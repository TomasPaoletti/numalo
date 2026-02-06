import cloudinary from "@/backend/shared/cloudinary/cloudinary.client";

export interface UploadImageOptions {
  folder: string;
  publicId?: string;
}

export interface UploadedImage {
  url: string;
  publicId: string;
}

export async function uploadImage(
  buffer: Buffer,
  options: UploadImageOptions
): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: options.folder,
          public_id: options.publicId,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error("Cloudinary upload failed"));
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      )
      .end(buffer);
  });
}
