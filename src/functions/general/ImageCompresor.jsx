import imageCompression from "browser-image-compression";

export const MAX_UPLOAD_FILE_SIZE_MB = 10;
export const MAX_UPLOAD_FILE_SIZE_BYTES = MAX_UPLOAD_FILE_SIZE_MB * 1024 * 1024;

export const isImageFile = (file) => file?.type?.startsWith("image/");

export const validateUploadFileSize = (file) => {
  if (file?.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
    throw new Error(
      `El archivo "${file.name}" pesa más de ${MAX_UPLOAD_FILE_SIZE_MB} MB.`,
    );
  }
};

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1000,
    useWebWorker: true,
  };

  return await imageCompression(file, options);
};

export const prepareFileForUpload = async (file) => {
  validateUploadFileSize(file);

  if (!isImageFile(file)) {
    return file;
  }

  const compressedFile = await compressImage(file);
  validateUploadFileSize(compressedFile);

  return compressedFile;
};
