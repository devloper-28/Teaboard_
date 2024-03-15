import React, { useState } from "react";
import { Card } from "react-bootstrap";
import "../../assets/css/uploadDocumentAdmin.css";
import $ from "jquery";
import CustomToast from "../../components/Toast";
const UploadZip = ({
  onFileSelect,
  inputId,
  uploadedFiles,
  setUploadedFiles,
  uploadDocumentError,
}) => {
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const newFiles = [];

    for (const file of files) {
      console.log("file 18", file);
      if (file.type !== "application/x-zip-compressed") {
        CustomToast.error("Incorrect file type. Please upload a ZIP file.");
      } else if (file.size > 10 * 1024 * 1024) {
        CustomToast.error("File size exceeds 10 MB");
      } else {
        try {
          const base64Content = await fileToBase64(file);
          const fileSizeInMB = (file.size / (2024 * 2024)).toFixed(2);
          newFiles.push({
            documentContent: base64Content,
            documentName: file.name,
            documentSize: fileSizeInMB + " MB",
          });
        } catch (error) {
          CustomToast.error("Error converting file to base64");
          console.error(error);
        }
      }
    }

    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onFileSelect([...uploadedFiles, ...newFiles]);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Content = reader.result.split(",")[1]; // Remove the data URI prefix
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
    onFileSelect(uploadedFiles.filter((file, idx) => idx !== index));
    $(`${inputId}`).replaceWith($(`${inputId}`).val("").clone(true));
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
    onFileSelect([]);
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.value = "";
    }
  };

  return (
    <>
      <Card className="mt-3 FileUploadBox">
        <Card.Body>
          <Card.Title>
            File Upload{" "}
            <p className="Red">
              (File type must be ZIP.10 MB Size per file allowed.)
            </p>
          </Card.Title>
          <div className="FileUpload">
            <div className="FormGroup">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".zip"
                id={inputId}
              />
              <div>
                <button
                  onClick={() => {
                    removeAllFiles();
                  }}
                  type="button"
                >
                  Remove All
                </button>
              </div>
            </div>
          </div>
          {uploadDocumentError && (
            <p className="errorLabel">{uploadDocumentError}</p>
          )}

          {/* Render file type icons based on uploaded files */}
        </Card.Body>

        <div className="row px-3 mb-2">
          {uploadedFiles?.map((file, index) => (
            <div className="col-md-auto">
              <div className="UploadedFile" key={index}>
                <div>
                  {/* {renderFileTypeIcon(file)} */}
                  <span>{file.documentName}</span>
                </div>
                <i
                  className="fa fa-times"
                  onClick={() => removeFile(index)}
                ></i>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default UploadZip;
