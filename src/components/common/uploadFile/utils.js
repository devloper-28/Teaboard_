// utils.js
import * as XLSX from "xlsx";

export const readFileAndCheckHeaders = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Check if the parsedData has at least one row (header row) with headers
      if (parsedData.length > 0 && Array.isArray(parsedData[0])) {
        const headers = parsedData[0];
        const camelCaseHeaders = headers.map((header) => {
          const camelCaseKey = header
            .replace(/\([^)]+\)/g, "")
            .split(" ")
            .map((word, index) =>
              index === 0
                ? word.toLowerCase()
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join("");
          return camelCaseKey;
        });

        // Convert the data rows to camel case
        const camelCaseData = parsedData.slice(1).map((row) => {
          const newRow = {};
          headers.forEach((header, index) => {
            const camelCaseKey = camelCaseHeaders[index];
            newRow[camelCaseKey] = row[index];
          });
          return newRow;
        });

        resolve({ fileName: file.name, data: camelCaseData });
      } else {
        reject(new Error("Failed to parse the file or missing headers"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the file"));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const findMissingValues = (data) => {
  const missingValues = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    Object.entries(row).forEach(([key, value]) => {
      if (!value && value !== 0 && value !== false) {
        missingValues.push(i);
      }
    });
  }

  return missingValues;
};
