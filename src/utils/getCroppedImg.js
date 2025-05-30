export const getCroppedImg = async (imageSrc, pixelCrop) =>  {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
 
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
 
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
 
 return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      // ✅ give a unique name using timestamp
      const file = new File([blob], `cropped_${Date.now()}.jpeg`, { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg');
  });
}
 
// Add this helper inside the same file or import it
function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}