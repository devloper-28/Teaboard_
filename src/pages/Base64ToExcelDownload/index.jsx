import { saveAs } from "file-saver";

const Base64ToExcelDownload = (base64Data, filename) => {
  if (base64Data != null) {
    try {
      // Decode the Base64 string to a binary array
      const byteCharacters = atob(base64Data);
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      // Convert the binary array to an Excel Blob
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a file object from the Blob and save it
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  }
};

export default Base64ToExcelDownload;
