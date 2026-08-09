/**
 * FrameInGoa - Client-Side iPhone HEIC/HEIF Image Converter Utility
 * Ensures seamless photo uploading for iOS / iPhone users without server roundtrips
 */

class HEICConverter {
  /**
   * Reads a File object, detects if it is HEIC/HEIF, and converts to standard Image object/DataURL
   * @param {File} file 
   * @returns {Promise<string>} Data URL string of processed image
   */
  static async processImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"));
        return;
      }

      const fileName = file.name ? file.name.toLowerCase() : "";
      const isHEIC = fileName.endsWith(".heic") || fileName.endsWith(".heif") || file.type === "image/heic" || file.type === "image/heif";

      const reader = new FileReader();

      if (isHEIC && window.heic2any) {
        // Use HEIC decoder if available
        window.heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 })
          .then((conversionResult) => {
            const convertedBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
            const convReader = new FileReader();
            convReader.onload = (e) => resolve(e.target.result);
            convReader.onerror = (e) => reject(e);
            convReader.readAsDataURL(convertedBlob);
          })
          .catch(() => {
            // Fallback to standard reader
            reader.readAsDataURL(file);
          });
      } else {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      }
    });
  }
}
