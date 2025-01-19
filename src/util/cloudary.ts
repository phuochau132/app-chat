import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

export const uploadFiles = async ({ fileUris }: { fileUris: string[] }) => {
  const cloudName = Constants.manifest?.extra?.VITE_CLOUD_NAME;
  const uploadPreset = Constants.manifest?.extra?.VITE_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration is missing.");
  }

  try {
    const uploadPromises = fileUris.map(async (fileUri) => {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error(`File does not exist at URI: ${fileUri}`);
      }

      const formData = new FormData();
      const fileBlob = {
        uri: fileUri,
        name: fileInfo.uri.split("/").pop(),
        type: "image/jpeg",
      };

      formData.append("file", fileBlob as any);
      formData.append("upload_preset", uploadPreset);

      // Upload file lên Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return { success: true, data };
    });

    // Chờ tất cả các file được upload
    const response = await Promise.all(uploadPromises);
    const result = response.map((item) => {
      return item.data.url;
    });
    return result;
  } catch (error) {
    console.error("Upload to Cloudinary failed", error);
    throw error;
  }
};
