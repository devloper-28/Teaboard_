export function uploadedFileDownload(base64Data, fileName, fileType) {
  const linkSource = ` ${fileType} ,${base64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}
