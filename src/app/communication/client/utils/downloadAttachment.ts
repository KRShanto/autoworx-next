export function downloadAttachment(
  filename: string,
  mimeType: string,
  base64Data: string,
) {
  // Replace URL-safe base64 characters
  base64Data = base64Data.replace(/-/g, "+").replace(/_/g, "/");

  // Handle padding (if needed)
  const padding = "=".repeat((4 - (base64Data.length % 4)) % 4);
  base64Data += padding;

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
