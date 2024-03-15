import React from "react";

const DownloadFile = ({ documentName, documentBytes, element }) => {
  const handleDownload = () => {
    // Decode base64 encoded documentBytes
    const decodedBytes = atob(documentBytes);

    // Create a Blob from the decoded bytes
    const blob = new Blob([
      new Uint8Array([...decodedBytes].map((char) => char.charCodeAt(0))),
    ]);

    // Create an object URL from the Blob
    const blobUrl = URL.createObjectURL(blob);

    // Create a hidden anchor element
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.href = blobUrl;
    anchor.download = documentName;

    // Append anchor to the body
    document.body.appendChild(anchor);

    // Programmatically click the anchor element
    anchor.click();

    // Clean up: remove the anchor and revoke the object URL
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);
  };

  return <button type="button" onClick={handleDownload}>{element}</button>;
};

export default DownloadFile;
