/**
 * FrameInGoa - Face Detection & Auto-Crop Engine
 * Intelligent skin-tone & facial density analyzer for auto-centering builder selfies
 */

class FaceDetectionEngine {
  /**
   * Analyzes an HTML Image / ImageBitmap / Canvas and returns estimated Face Center & Crop parameters
   * @param {HTMLImageElement} image 
   * @returns {Object} { centerX, centerY, suggestedScale }
   */
  static detectAndCenter(image) {
    const canvas = document.createElement("canvas");
    const width = image.naturalWidth || image.width || 300;
    const height = image.naturalHeight || image.height || 300;
    
    // Scale down analysis resolution for fast performance
    const sampleWidth = 100;
    const sampleHeight = Math.max(10, Math.round((height / width) * sampleWidth));
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;

    const ctx = canvas.getContext("2d");
    try {
      ctx.drawImage(image, 0, 0, sampleWidth, sampleHeight);
    } catch (e) {
      return { centerX: width / 2, centerY: height * 0.35, scale: 1.15 };
    }

    let imgData;
    try {
      imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;
    } catch (e) {
      // CORS fallback if external image
      return {
        centerX: width / 2,
        centerY: height * 0.35, // Default upper third vertical crop for face
        scale: 1.15
      };
    }

    let skinPixelsX = 0;
    let skinPixelsY = 0;
    let totalSkinPixels = 0;

    const maxRow = Math.floor(sampleHeight * 0.75);

    for (let y = 0; y < maxRow; y++) {
      for (let x = 0; x < sampleWidth; x++) {
        const index = (y * sampleWidth + x) * 4;
        const r = imgData[index];
        const g = imgData[index + 1];
        const b = imgData[index + 2];

        // Skin Tone RGB Threshold heuristic algorithm
        const isSkin = 
          r > 50 && g > 30 && b > 15 &&
          Math.max(r, g, b) - Math.min(r, g, b) > 10 &&
          Math.abs(r - g) > 8 &&
          r > g && r > b;

        if (isSkin) {
          const weight = 1 + (1 - y / maxRow) * 0.5;
          skinPixelsX += x * weight;
          skinPixelsY += y * weight;
          totalSkinPixels += weight;
        }
      }
    }

    if (totalSkinPixels > 15) {
      const avgSampleX = skinPixelsX / totalSkinPixels;
      const avgSampleY = skinPixelsY / totalSkinPixels;

      const centerX = (avgSampleX / sampleWidth) * width;
      const centerY = (avgSampleY / sampleHeight) * height;

      return {
        centerX: Math.round(centerX),
        centerY: Math.round(centerY),
        scale: 1.15,
        detected: true
      };
    }

    return {
      centerX: width / 2,
      centerY: height * 0.35,
      scale: 1.15,
      detected: false
    };
  }

  /**
   * Applies Smart Crop on target canvas given source image, target bounds, zoom scale, and offsets
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLImageElement} image 
   * @param {number} targetX Destination X on canvas
   * @param {number} targetY Destination Y on canvas
   * @param {number} targetWidth Destination width
   * @param {number} targetHeight Destination height
   * @param {number} zoom Crop zoom scale factor
   * @param {number} offsetX Manual X offset
   * @param {number} offsetY Manual Y offset
   */
  static drawCroppedFace(ctx, image, targetX, targetY, targetWidth, targetHeight, zoom = 1.15, offsetX = 0, offsetY = 0) {
    const srcW = image.naturalWidth || image.width || 300;
    const srcH = image.naturalHeight || image.height || 300;

    const analysis = this.detectAndCenter(image);

    // Base crop size (square crop matching target aspect ratio)
    const baseSize = Math.min(srcW, srcH);
    const cropSize = Math.max(10, baseSize / Math.max(0.5, zoom));

    // Apply manual offset + detected face center
    let cropX = analysis.centerX - cropSize / 2 + (offsetX * (srcW / 500));
    let cropY = analysis.centerY - cropSize / 2 + (offsetY * (srcH / 500));

    // Clamp crop region inside image bounds
    cropX = Math.max(0, Math.min(srcW - cropSize, cropX));
    cropY = Math.max(0, Math.min(srcH - cropSize, cropY));

    ctx.drawImage(
      image,
      cropX, cropY, cropSize, cropSize,
      targetX, targetY, targetWidth, targetHeight
    );
  }
}
