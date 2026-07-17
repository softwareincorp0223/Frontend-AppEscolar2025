import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1000,
    useWebWorker: true,
  };

  return await imageCompression(file, options);
};
