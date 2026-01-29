import { Platform } from "react-native";

const CLOUD_NAME = "dyy0hwnns";
const UPLOAD_PRESET = "ml_default";

const getExt = (uri = "") => {
  const clean = uri.split("?")[0];
  const parts = clean.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
};

const guessMime = (uri) => {
  const ext = getExt(uri);

  if (["jpg", "jpeg"].includes(ext)) return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "heic") return "image/heic";
  if (ext === "mp4") return "video/mp4";
  if (ext === "mov") return "video/quicktime";

  return "application/octet-stream";
};

export async function uploadImageToCloudinary(uri, folder = "assets") {
  try {
    if (!uri) return null;

    const ext = getExt(uri);
    const mimeType = guessMime(uri);
    const isVideo = mimeType.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    const formData = new FormData();

    if (Platform.OS === "ios") {
      formData.append("file", uri);
    } else {
      formData.append("file", {
        uri,
        name: `upload.${ext}`,
        type: mimeType,
      });
    }

    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", data);
      return null;
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
}
