import React from "react";
import "./PrintableTable.css";

const PrintableTable = (columns, data, name) => {
  let htmls;
  let column;
  // if(rows.length>0)
  // {
  htmls = data.map((item, index) => {
    return ` <tr key={index} style={{ border: "1px solid black" }}>
       ${columns
         ?.filter((ele) => ele.name !== "action")
         ?.map((column) => `<td>${item[column.name]}</td>`)}
      </tr>`;
  });

  //}
  column = columns
    ?.filter((ele) => ele.name !== "action")
    ?.map((column) => {
      return `<th>${column.title}</th>`;
    });
  console.log(column.join(""), htmls.join("").split(",").join(""));

  // if (printableContent) {
  const printWindow = window.open("", "", "width=2000,height=1400");
  printWindow.document.open();
  printWindow.document.write(`
      <html>
      <head>
      <title>${name}</title>
     <style>
     
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
border: 1px solid #ccc; 
}
     </style>

    </head>
        <body>
        <table class="custom-table">
        <thead>
        <tr>
        ${column.join("")}
        </tr>
        </thead>
        <tbody>
        ${htmls.join("").split(",").join("")}
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

export default PrintableTable;
