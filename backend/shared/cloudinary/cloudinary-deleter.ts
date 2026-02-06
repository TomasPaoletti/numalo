import cloudinary from "@/backend/shared/cloudinary/cloudinary.client";

export async function deleteImage(publicId: string): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary delete failed for publicId ${publicId}`);
  }
}
