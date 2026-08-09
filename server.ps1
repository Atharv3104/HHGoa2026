# FrameInGoa - High-Performance Cross-Device Static Web Server (TcpListener)
$port = 8080
$ip = [System.Net.IPAddress]::Any
$server = New-Object System.Net.Sockets.TcpListener($ip, $port)

# Auto-detect active Wi-Fi IPv4 Address
$wifiIP = "10.214.109.37"
try {
    $detected = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1).IPAddress
    if (-not [string]::IsNullOrEmpty($detected)) {
        $wifiIP = $detected
    }
} catch {}

try {
    $server.Start()
    Write-Host "🚀 FrameInGoa Web Server running on ALL interfaces!" -ForegroundColor Green
    Write-Host "   👉 Desktop: http://localhost:$port/" -ForegroundColor Cyan
    Write-Host "   👉 Mobile (Wi-Fi): http://${wifiIP}:$port/" -ForegroundColor Yellow
} catch {
    Write-Host "Error starting server on port $port : $_" -ForegroundColor Red
    exit 1
}

$rootFolder = $PSScriptRoot

while ($server.Server.IsBound) {
    try {
        $client = $server.AcceptTcpClient()
        $stream = $client.GetStream()
        
        $buffer = New-Object byte[] 2097152 # 2MB buffer for image upload payloads
        $bytesRead = $stream.Read($buffer, 0, $buffer.Length)
        if ($bytesRead -le 0) {
            $client.Close()
            continue
        }

        $requestText = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $bytesRead)
        $requestLines = $requestText.Split("`n")
        $firstLine = $requestLines[0].Trim()
        
        $tokens = $firstLine.Split(" ")
        if ($tokens.Length -lt 2) {
            $client.Close()
            continue
        }

        $rawPath = $tokens[1]

        # HTTP Server Attachment Download Endpoint: /download-image
        if ($rawPath.StartsWith("/download-image")) {
            $headerEndIndex = $requestText.IndexOf("`r`n`r`n")
            if ($headerEndIndex -ge 0) {
                $postBody = $requestText.Substring($headerEndIndex + 4)
                if ($postBody.Contains("data:image/png;base64,")) {
                    try {
                        $encodedPart = $postBody.Split("data:image/png;base64,")[1]
                        $cleanBase64 = $encodedPart.Split("&")[0].Split("`r")[0].Split("`n")[0]
                        $cleanBase64 = [System.Uri]::UnescapeDataString($cleanBase64)
                        $imgBytes = [System.Convert]::FromBase64String($cleanBase64)

                        $fileName = "HHGOA_ID_CARD.png"
                        $headerText = "HTTP/1.1 200 OK`r`nContent-Type: image/png`r`nContent-Disposition: attachment; filename=`"$fileName`"`r`nContent-Length: $($imgBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                        $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($headerText)
                        
                        $stream.Write($headerBytes, 0, $headerBytes.Length)
                        $stream.Write($imgBytes, 0, $imgBytes.Length)
                        $stream.Flush()
                        $client.Close()
                        continue
                    } catch {}
                }
            }
        }

        if ($rawPath -eq "/" -or [string]::IsNullOrEmpty($rawPath)) { $rawPath = "/index.html" }

        $cleanPath = $rawPath.Split("?")[0].TrimStart("/")
        $cleanPath = [System.Uri]::UnescapeDataString($cleanPath)
        $localPath = Join-Path $rootFolder $cleanPath

        if (Test-Path $localPath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($localPath)
            
            $contentType = "application/octet-stream"
            if ($localPath.EndsWith(".html")) { $contentType = "text/html; charset=utf-8" }
            elseif ($localPath.EndsWith(".css")) { $contentType = "text/css" }
            elseif ($localPath.EndsWith(".js")) { $contentType = "text/javascript" }
            elseif ($localPath.EndsWith(".json")) { $contentType = "application/json" }
            elseif ($localPath.EndsWith(".png")) { $contentType = "image/png" }
            elseif ($localPath.EndsWith(".jpg") -or $localPath.EndsWith(".jpeg")) { $contentType = "image/jpeg" }
            elseif ($localPath.EndsWith(".svg")) { $contentType = "image/svg+xml" }

            $headerText = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($content.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($headerText)
            
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($content, 0, $content.Length)
        } else {
            $body = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1>")
            $headerText = "HTTP/1.1 404 Not Found`r`nContent-Type: text/html`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($headerText)
            
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($body, 0, $body.Length)
        }

        $stream.Flush()
        $client.Close()
    } catch {
        # Client disconnect or socket error
    }
}
