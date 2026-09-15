/**
 * Downscales an uploaded image to a JPEG data URL small enough to persist in
 * localStorage-backed Zustand state (which has a low per-origin size cap).
 */
export function compressImageFile(
  file: File,
  maxDimension = 1000,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("ไม่สามารถประมวลผลรูปภาพได้"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("ไม่สามารถเปิดไฟล์รูปภาพได้"));
    };

    img.src = objectUrl;
  });
}
