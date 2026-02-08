import fs from "fs";
import path from "path";

export const deleteImage = (imagePath) => {
  if (!imagePath) return;

  const fullPath = path.join(process.cwd(), "uploads", imagePath);

  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};
