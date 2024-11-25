export function isImageFile(file: File) {
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
    "tiff",
  ];
  const isMineImage = file.type && file.type.startsWith("/image");

  const extensions = file.name.split(".").pop()?.toLowerCase() || "";
  const isExtensionImage = imageExtensions.includes(extensions);
  return isMineImage || isExtensionImage;
}
