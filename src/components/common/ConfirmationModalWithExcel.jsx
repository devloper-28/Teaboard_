import React, { useState } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import CustomToast from "../Toast";

const ConfirmationModalWithExcel = ({
  show,
  onHide,
  onDelete,
  setRemark,
  remarkShow,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const [remark] = useState(remarkShow ? remarkShow : true);
  const handleDelete = (e) => {
    onDelete(e, uploadedFiles); // Perform actual delete action
  };

  const onHideModal = () => {
    onHide();
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    const updatedFiles = [...uploadedFiles];
    const existingFileNames = updatedFiles.map(
      (uploadedFile) => uploadedFile.documentName.split(".")[0]
    );

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      const isExistingFile = existingFileNames.includes(file.name);
      const isSameNameDifferentExtension = existingFileNames.includes(
        fileNameWithoutExtension
      );
      if (isExistingFile || isSameNameDifferentExtension) {
        CustomToast.warning(`File "${file.name}" already exists.`);
        continue; // Skip this file and proceed to the next one
      }
      if (
        !allowedFileExtensions.includes(fileExtension) ||
        existingFileNames.includes(fileNameWithoutExtension)
      ) {
        CustomToast.error(
          `File "${file.name}" is not allowed or already exists.`
        );
        continue; // Skip this file and proceed to the next one
      }
      if (file.size <= MAX_FILE_SIZE) {
        try {
          // Read the file content as a Base64 string using FileReader and async/await
          const base64Content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              // Extract the Base64 content from the data URI
              const base64String = event.target.result.split(",")[1];
              resolve(base64String);
            };

            reader.onerror = (event) => {
              reject(event.target.error);
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
          });

          const fileInfo = {
            documentName: file.name,
            // documentPath: file.pathName,
            documentBrief: "", // Empty document brief, you can set the actual brief value
            DocumentSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
            status: 0,
            documentBytes: base64Content, // Store the Base64 content in fileInfo
            // contentType: file.type,
          };
          updatedFiles.push(fileInfo);
          console.log(event, "fileInfofileInfo");
        } catch (error) {
          console.error("Error reading the file:", error);
          // Handle the error as per your requirement (e.g., show an error message)
        }
      } else {
        CustomToast.error(`File "${file.name}" has more than 10MB.`);
      }
    }

    // Update the state after all files have been processed
    setUploadedFiles(updatedFiles);
  };

  const updateFileBrief = (index, brief) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles[index].documentBrief = brief;
    updatedFiles[index].status = 0;
    setUploadedFiles(updatedFiles);
  };
  const removeFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    URL.revokeObjectURL(updatedFiles[index].path); // Release the object URL
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  return (
    <Modal show={show} onHide={onHide} animation={true} className="DeleteModal">
      <form>
        {/* <Modal.Header>
           <Modal.Title></Modal.Title> 
          <i className="fa fa-times CloseModal"  onClick={onHide}></i>
        </Modal.Header> */}
        <Modal.Body>
          {/* <h3>Upload </h3> */}

          <div className="FileUpload mt-3">
            {uploadedFiles?.map((file, index) => (
              <div className="UploadedFile" key={index}>
                <div>
                  <Card>
                    {file?.status === 0
                      ? "Pending"
                      : file?.status === 1
                      ? "Active"
                      : file?.status === 2
                      ? "Cancelled"
                      : ""}
                  </Card>
                  {/* <input
                    type="text"
                    value={file?.documentBrief}
                    onChange={(event) =>
                      updateFileBrief(index, event.target.value)
                    }
                    placeholder="Enter document brief"
                    required
                  /> */}
                </div>

                <i
                  className="fa fa-times"
                  onClick={() => removeFile(index)}
                ></i>
              </div>
            ))}
            <input
              type="file"
              multiple
              // onChange={handleFileUpload}
              id="fileInput"
              className="p-2"
              onChange={handleFileUpload}
            />
          </div>
          <input
            className="fomr-control w-100 mt-3"
            style={{ display: remarkShow === true ? "block" : "none" }}
            type="textarea"
            required
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter Remarks"
          />

          <div className="BtnGroup">
            <Button className="SubmitBtn" type="submit" onClick={handleDelete}>
              Yes
            </Button>
            <Button className="SubmitBtn" onClick={onHideModal}>
              No
            </Button>
          </div>
        </Modal.Body>
      </form>
    </Modal>
  );
};

export default ConfirmationModalWithExcel;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedFileExtensions = [
  "txt",
  "zip",
  "pdf",
  "jpg",
  "jpeg",
  "gif",
  "bmp",
  "png",
  "tif",
  "tiff",
  "doc",
  "xls",
  "ppt",
  "pps",
  "dxf",
  "docx",
  "xlsx",
  "eml",
  "rar",
];
