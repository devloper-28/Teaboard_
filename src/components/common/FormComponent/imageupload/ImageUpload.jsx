import React, { useState, useRef, useEffect } from "react";
// import { FILE_UPLOAD } from "../../../../assets/images/index";
import "./imageupload.css";

const ImageUpload = ({
  data,
  name,
  previewImage,
  setPreviewImage,
  setdata,
  fileUploadError,
}) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const imageUrl = file && URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setdata(file);
    console.log(file,"🤣")

    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(data.file);
    };
  }, []);

  return (
    <>
      <label
        className={`${
          previewImage !== "" ? "image-upload uploaded-new-img" : "image-upload"
        }`}
        htmlFor="file-input"
      >
        {previewImage === "" ? (
          <img src="../../../../assets/images/file.png" alt="file-upload" />
        ) : (
          <img src={previewImage} className="updated-img" alt="file-upload" />
        )}
      </label>
      <input
        ref={fileInputRef}
        id="file-input"
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e)}
        name={name}
      />
    </>
  );
};

export default ImageUpload;
