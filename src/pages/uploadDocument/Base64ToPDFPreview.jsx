import React, { useState } from "react";

const Base64ToPDFPreview = ({ base64String }) => {
  const [pdfUrl, setPdfUrl] = useState("");

  const decodeBase64ToPDF = () => {
    try {
      const decodedData = atob(base64String);
      const uint8Array = new Uint8Array(decodedData.length);

      for (let i = 0; i < decodedData.length; ++i) {
        uint8Array[i] = decodedData.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error decoding Base64 to PDF:", error);
    }
  };

  React.useEffect(() => {
    decodeBase64ToPDF();
  }, [base64String]);

  return (
    <div>
      {pdfUrl && (
        <iframe
          title="PDF Preview"
          src={pdfUrl}
          width="100%"
          height="800px"
          style={{ border: "none" }}
        />
      )}
    </div>
  );
};

export default Base64ToPDFPreview;

// import React, { useState } from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";

// const Base64ToPDFPreview = ({ base64String }) => {
//   const [pdfData, setPdfData] = useState(null);

//   const decodeBase64ToPDF = () => {
//     try {
//       const decodedData = atob(base64String);
//       const uint8Array = new Uint8Array(decodedData.length);

//       for (let i = 0; i < decodedData.length; ++i) {
//         uint8Array[i] = decodedData.charCodeAt(i);
//       }

//       setPdfData(uint8Array);
//     } catch (error) {
//       console.error("Error decoding Base64 to PDF:", error);
//     }
//   };

//   React.useEffect(() => {
//     decodeBase64ToPDF();
//   }, [base64String]);

//   return (
//     <div>
//       {pdfData && (
//         <Worker
//           workerUrl={`https://unpkg.com/pdfjs-dist@${"2.11.596"}/build/pdf.worker.min.js`}
//         >
//           <Viewer fileUrl={pdfData} />
//         </Worker>
//       )}
//     </div>
//   );
// };

// export default Base64ToPDFPreview;
