import React, { useState } from "react";
import * as XLSX from "xlsx";

const SheetUploader = ({sheetDataList, setSheetDataList,validationMessages, setValidationMessages}) => {


  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const filePromises = [];
      const validationMessages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePromise = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              raw: false,
              dateNF: "hh:mm:ss.000",
              defval: null, // Set defval option to null to handle empty values
            });
            resolve(jsonData);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsArrayBuffer(file);
        });
        filePromises.push(filePromise);
        validationMessages.push(""); // Initialize validation message for each file
      }

      Promise.all(filePromises)
        .then((sheetDataList) => {
          setSheetDataList(sheetDataList);
          setValidationMessages(validationMessages);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  console.log(sheetDataList)

  const handleDownload = (sheetData) => {
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const handleValidate = (index) => {
    const sheetData = sheetDataList[index];
    const hasEmptyRows = sheetData.slice(1).some((row) => row.some((cell) => !cell));
    const validationMessagesCopy = [...validationMessages];
    if (hasEmptyRows) {
      validationMessagesCopy[index] = "File has missing values.";
    } else {
      validationMessagesCopy[index] = "Validation successful.";
    }
    setValidationMessages(validationMessagesCopy);
  };
  

  return (
    <div>
      <input type="file" accept=".xlsx,.xls" multiple onChange={handleFileUpload} />
      {sheetDataList.length > 0 &&
        sheetDataList.map((sheetData, index) => (
          <div key={index}>
            <button onClick={() => handleDownload(sheetData)}>Download</button>
            <button onClick={() => handleValidate(index)}>Validate</button>
            {validationMessages[index] && (
              <div
                style={{
                  color: validationMessages[index] === "Validation successful." ? "green" : "red",
                  marginTop: "10px",
                }}
              >
                {validationMessages[index]}
              </div>
            )}
            {/* <table>
              <thead>
                <tr>
                  {sheetData[0].map((header, index) => (
                    <th key={index}>{header || ""}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheetData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell || ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        ))}
    </div>
  );
};

export default SheetUploader;
