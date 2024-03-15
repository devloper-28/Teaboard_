import React from "react";
import XLSX from "xlsx";

const UploadeFile = ({ handleData, readFileAndCheckHeaders }) => {
  const handleUploadeFile = (e) => {
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

  return <input type="file" onChange={handleUploadeFile} multiple />;
};

export default UploadeFile;
