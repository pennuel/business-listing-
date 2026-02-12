"use server";

import { writeFile } from "fs/promises";
import { join } from "path";

export async function uploadImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get("image") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Validate file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }

    // Create a unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const fileName = `profile-${timestamp}.${extension}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to public directory
    const imagePath = join(process.cwd(), "public", "uploads");
    const filePath = join(imagePath, fileName);
    await writeFile(filePath, buffer);

    // Return the URL that can be used to access the image
    const imageUrl = `/uploads/${fileName}`;
    return { url: imageUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}
