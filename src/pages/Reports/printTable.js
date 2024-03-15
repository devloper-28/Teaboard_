import React from "react";

const PrintableTable = ({ columnNames, columnAlignments, data, title }) => {
  return (
    <div style={{ padding: "40px 20px" }}>
      <h2>{title}</h2>
      <table
        style={{
          border: "1px solid black",
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead style={{ position: "static" }}>
          <tr style={{ border: "1px solid black" }}>
            {columnNames.map((name, index) => (
              <th
                key={name}
                style={{
                  textAlign:
                    columnAlignments[index] === "C" ? "center" : "left",
                  border: "1px solid black",
                  width: "auto",
                  whiteSpace: "normal",
                  fontSize: "12px",
                }}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length ? (
            data.map((item, index) => (
              <tr
                key={index}
                style={{
                  border: "1px solid black",
                  backgroundColor: index % 2 ? "white" : "#efefef",
                }}
              >
                {columnNames.map((name, columnIndex) => (
                  <td
                    style={{
                      border: "1px solid black",
                      width: "auto",
                      whiteSpace: "normal",
                    }}
                    key={name}
                  >
                    {item[`fieldValue${columnIndex + 1}`]}
                    
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columnNames?.length}>no data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PrintableTable;
