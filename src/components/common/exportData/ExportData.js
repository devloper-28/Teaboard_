import React from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import ReactToPdf from "react-to-pdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";

import { saveAs } from "file-saver";

const ExportData = ({
  columnsdataNew,
  dataNew,
  columnsdata,
  data,
  exportType,
  fileName,
}) => {
  function Tables({ data }) {
    // Define the table column headers
    const columns = [
      "Season",
      "Sale No",
      "Catalog Closing Date",
      "Catalog Publish Date",
      "No. of Auction Days",
      "Average in Percentage",
      "Tea Type",
      "Sale Date",
      "Buyer's Prompt Date",
      "Seller's Prompt Date",
      "Status",
    ];

    return (
      <table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{item[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "exported.xlsx");
  };

  const downloadExcel = async () => {
    // Assuming columnName contains the list of objects with "name" and "title"
    let columnsDataList = columnsdata;
    columnsDataList.pop();
    const columnName = columnsDataList;

    // Assuming data contains the list of data objects like [{saleNo: 5}, ...]
    const dataList = data.map((ele) => {
      const { invoiceId, ...rest } = ele;
      return rest;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName);

    // Create a map from name to title for efficient lookup
    const nameToTitleMap = new Map();
    columnName.forEach((column) => {
      nameToTitleMap.set(column.name, column.title);
    });

    // Create the header row based on the columnName array
    const headerRow = worksheet.addRow(
      columnName.map((column) => column.title)
    );
    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFF" },

        // Text color set to white
      };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "183e29" }, // Background color (you can change the color code)
      };
    });
    // Add data rows based on columnName and data
    dataList.forEach((row) => {
      const rowData = columnName.map((column) => row[column.name]);
      worksheet.addRow(rowData);
    });

    //ADD NEW ROWS
    if (dataNew.length > 0 && columnsdataNew.length > 0) {
      //adding  a blank row
      worksheet.addRow();

      const dataListNew = dataNew.map((ele) => {
        const { invoiceId, ...rest } = ele;
        return rest;
      });
      const headerRow1 = worksheet.addRow(
        columnsdataNew.map((column) => column.title)
      );
      headerRow1.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFF" },

          // Text color set to white
        };
        cell.alignment = { horizontal: "center" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "183e29" }, // Background color (you can change the color code)
        };
      });
      // Add data rows based on columnName and data
      dataListNew.forEach((row) => {
        const rowData = columnsdataNew.map((column) => row[column.name]);
        worksheet.addRow(rowData);
      });

      // Automatically adjust column widths based on content
      worksheet.columns.forEach((column, index) => {
        if (columnName.length - 1 >= index) {
          const headerLength = columnName[index].title.length;
          const maxColumnWidth = column.values.reduce((acc, val) => {
            const cellLength = val ? val.toString().length : 0;
            return Math.max(acc, cellLength);
          }, headerLength);
          column.width = maxColumnWidth + 5; // Adding extra width for padding
          column.alignment = { horizontal: "center" };
        } else {
          const headerLength = columnsdataNew[index].title.length;
          const maxColumnWidth = column.values.reduce((acc, val) => {
            const cellLength = val ? val.toString().length : 0;
            return Math.max(acc, cellLength);
          }, headerLength);
          column.width = maxColumnWidth + 5; // Adding extra width for padding
          column.alignment = { horizontal: "center" };
        }
      });
    } else {
      // Automatically adjust column widths based on content
      worksheet.columns.forEach((column, index) => {
        const headerLength = columnName[index].title.length;
        const maxColumnWidth = column.values.reduce((acc, val) => {
          const cellLength = val ? val.toString().length : 0;
          return Math.max(acc, cellLength);
        }, headerLength);
        column.width = maxColumnWidth + 5; // Adding extra width for padding
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    // Convert the buffer to a Blob
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save the Blob as a file
    saveAs(blob, fileName + ".xlsx");
  };

  // const ExportToPDF = ({ children }) => {
  //   return (
  //     // const doc = new jsPDF("l", "in", [3, 4]);

  //     // // Define columns for the table
  //     // const columns = Object.keys(data[0]);

  //     // // Define rows for the table
  //     // const rows = data.map((row) => Object.values(row));

  //     // // Add the table to the PDF
  //     // doc.autoTable({
  //     //   head: [columns],
  //     //   body: rows,
  //     // });

  //     // // Add other content if needed
  //     // doc.text(10, 10, "PDF Export Content");

  //     // // Save the PDF
  //     // doc.save("exported.pdf");
  //     <ReactToPdf targetRef={data} filename={fileName}>
  //       {({ toPdf }) => (
  //         <button type="button" onClick={toPdf}>
  //           {children}
  //         </button>
  //       )}
  //     </ReactToPdf>
  //   );
  // };
  const handleGeneratePDF = async () => {
    const pdf = await generatePDF(data.current);
    downloadPDF(pdf, "mypage.pdf");
  };
  const generatePDF = (content) => {
    return new Promise((resolve) => {
      html2canvas(content, { scale: 2 }).then((canvas) => {
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 100); // Change page size here
        resolve(pdf);
      });
    });
  };

  const downloadPDF = (pdf, filename) => {
    pdf.save(filename);
  };

  const columns = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },

    {
      name: "LotNo",
      title: "Lot No",
    },
    {
      name: "teaTypeName",
      title: "Tea Type",
    },
    {
      name: "invoiceNo",
      title: "Invoice No",
    },
    {
      name: "markName",
      title: "Mark",
    },
    {
      name: "gradeName",
      title: "Grade",
    },
    {
      name: "categoryName",
      title: "Category",
    },
    {
      name: "packageNo",
      title: "No Of Packages",
    },
    // {
    //   name: "noofpackage",
    //   title: "No Of Packages",
    // },

    {
      name: "netKgs",
      title: "Net Weight",
    },
    {
      name: "totalSampleQty",
      title: "Total Sample Qty",
    },
    {
      name: "totalShortQty",
      title: "Total Short Qty",
    },
    {
      name: "inspectionCharges",
      title: "Inspection Charges",
    },
    {
      name: "reInspectionCharges",
      title: "Re-Inspection Charges",
    },
  ];
  const handleExportPDF = () => {
    let htmls;
    // if(rows.length>0)
    // {

    //}

    // if (printableContent) {
    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.open();
    printWindow.document.write(`
        <html>
        <head>
        <title>Sample Shortage</title>
       <style>
       .common-table p{
        margin-bottom: 0;
    }
    
    .dropdown_label{
        width: 150px;
    }
    .max-width250{
        max-width: 250px;
        width: 100%;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      font-size: 14px;
    }
    th {
      background-color: #343a40; 
      color: #fff;
      text-align: left;
      padding: 10px;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    
    
    tr:hover {
      background-color: #d4d4d4; 
    }
    td {
      padding: 10px;
      border: 1px solid #ccc; 
    }
       </style>

      </head>
          <body>
          <table class="custom-table">
          <thead>
            <tr>
              ${columns.map((column) => `<th>${column.title}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                ${columns
                  .map((column) => `<td>${row[column.name]}</td>`)
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
          
          </body>
        </html>
      `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
    //}
  };
  const exportToHTML = () => {
    // Create an HTML table from the data and columns
    const tableHTML = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Data Exported to HTML Table</h1>
          <tabl>
            <thead>
              <tr>
                ${columns.map((column) => `<th>${column.title}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${columns
                    .map((column) => `<td>${row[column.name]}</td>`)
                    .join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Create a Blob from the HTML table
    const blob = new Blob([tableHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // Create a download link
    const link = document.createElement("a");
    link.href = url;
    link.download = "exported.html";

    // Trigger a click event to download the file
    link.click();
  };

  return (
    <div>
      <br></br>
      {exportType === "excel" && (
        <button onClick={exportToExcel}>Export to Excel</button>
      )}
      {exportType === "pdf" && (
        // <ExportToPDF>
        //   <i className="fa-solid fa-file-pdf pdf-btn"></i>
        // </ExportToPDF>
        <i
          className="fa-solid fa-file-pdf pdf-btn"
          style={{ "font-size": "2rem", width: "56px", important: "true" }}
          onClick={handleGeneratePDF}
        ></i>
      )}
      {exportType === "downloadExcel" && (
        // <ExportToPDF>
        //   <i className="fa-solid fa-file-pdf pdf-btn"></i>
        // </ExportToPDF>
        <i
          className="fa-solid fa-file-excel excel-btn"
          style={{ "font-size": "2rem", important: "true" }}
          onClick={downloadExcel}
        ></i>
      )}
      {exportType === "html" && (
        <button
          type="button"
          style={{ color: "transparent", border: "none", fontSize: "1.5rem" }}
          onClick={exportToHTML}
        >
          <i className="fa-brands fa-html5 html5-btn"></i>{" "}
        </button>
      )}
      {exportType === "all" && (
        <div className="row">
          <div className="col-md-12 text-right export-btn">
            <button onClick={downloadExcel}>
              <i className="fa-sharp fa-solid fa-file-excel excel-btn"></i>
            </button>
            <i
              className="fa-solid fa-file-pdf pdf-btn"
              // onClick={handleGeneratePDF}
              onClick={handleExportPDF}
            ></i>
            <button onClick={exportToHTML}>
              <i className="fa-brands fa-html5 html5-btn"></i>{" "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportData;
