import React from "react";

const FileUpload = ({ handleData, readFileAndCheckHeaders, id }) => {
  const handleFileUpload = (e) => {
    const files = e.target.files;
    const promises = Array.from(files).map((file) =>
      readFileAndCheckHeaders(file)
    );

    Promise.allSettled(promises).then((results) => {
      const fulfilledResults = results.filter(
        (result) => result.status === "fulfilled"
      );
      const dataFromFiles = fulfilledResults.map((result) => result.value);

      handleData(dataFromFiles);
    });
  };

  return <input type="file" id={id} onChange={handleFileUpload} multiple />;
};

export default FileUpload;
