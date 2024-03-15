import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import generatePDF from "react-to-pdf";
import { useReactToPrint } from "react-to-print";
import PrintableTable from "./printTable";
// import data from "./data.json";
import { orderValues, initialSortValue } from "./constants/constants";
import { getDataRequest, setOrder, sortData } from "./helpers/helpers";
import NormalSearch from "./NormalSearch"
import AdvancedSearch from "./AdvancedSearch";
import "./report.css";


const App = ({ reportingId }) => {
  const pdfContainerRef = useRef();
  const [isPrintAllowed, setIsPrintAllowed] = useState(false);
  const [isExcelExportAllowed, setIsExcelExportAllowed] = useState(false);
  const [isPdfExportAllowed, setIsPdfExportAllowed] = useState(false);
  const [isSerchRequest, setIsSerchRequest] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);

  const [responseData, setResponseData] = useState(null);
  const [sortedTableData, setSortedTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = responseData?.recordPerPage || 10;
  const [sortedField, setSortedField] = useState(initialSortValue);
  const [paginationInputValue, setPaginationInputValue] = useState("");
  const handlePrint = useReactToPrint({
    content: () => pdfContainerRef.current,
  });

  useEffect(
    () =>
      setSortedTableData(sortData(responseData?.getReportList, sortedField)),
    [sortedField]
  );
  useEffect(() => {
    // Make the axiosMain GET request to fetch data
    // setResponseData(data.responseData);
    // setSortedTableData(sortData(data.responseData?.getReportList, orderValues));
    // setIsPrintAllowed(data.responseData.isPrintAllowed === 1);
    // setIsExcelExportAllowed(data.responseData.excelRequired === "Y");
    // setIsPdfExportAllowed(data.responseData.pdfRequired === "Y");

    getDataRequest({
      id: reportingId,
      setResponseData,
      setSortedTableData,
      setIsPrintAllowed,
      setIsExcelExportAllowed,
      setIsPdfExportAllowed,
    })("");
  }, []);

  const columnDetails =
    (responseData?.tblReportDetails[0].columnDetails || "")?.split(" ~ ") || [];
  const columnNames =
    columnDetails?.map((column) => {
      const [name] = column?.split(":");
      return name;
    }) || [];
  const columnAlignments =
    columnDetails?.map((column) => {
      const [name, , alignment] = column?.split(":");
      return alignment;
    }) || [];
  const columnVisibles =
    columnDetails?.map((column) => {
      const [name, , alignment, , number] = column?.split(":");
      const isAllow = number === "0" || isSerchRequest ? true : false;
      return isAllow;
    }) || [];

  // Calculate start and end indices for pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = sortedTableData.slice(startIndex, endIndex);

  // Calculate total number of pages
  const totalPages = Math.ceil(sortedTableData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  if (!responseData) {
    return <div>Loading...</div>;
  }
  const handleExcelExport = () => {
    // Convert your data to an array of arrays
    const table = document.getElementById("table-content");
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, responseData?.reportHeading + ".xlsx");
  };
  const onTableDataSort = (name) => {
    setSortedField((sortedFieldValue) => ({
      fieldName: name,
      order: setOrder(
        sortedFieldValue.fieldName === name ? sortedFieldValue.order : ""
      ),
    }));
  };

  const normalSearchColumnDetails =
    responseData?.tblReportSearchColumnDetails || [];
  const advancedSearchColumnDetails =
    responseData?.tblReportSearchColumnDetails?.filter(
      (details) => details.searchType === "A"
    ) || [];

  return (
    <div>
      <h2>{responseData?.reportHeading}</h2>
      {!isSearchPopupOpen && (
        <AdvancedSearch
          searchColumnDetails={advancedSearchColumnDetails}
          setIsSearchPopupOpen={setIsSearchPopupOpen}
          isSearchPopupOpen={isSearchPopupOpen}
          getDataRequest={getDataRequest({
            id: reportingId,
            setResponseData,
            setSortedTableData,
            setIsPrintAllowed,
            setIsExcelExportAllowed,
            setIsPdfExportAllowed,
            setIsSerchRequest,
          })}
        />
      )}
      <NormalSearch
        hasAdvancedSearchColumnDetails={!!advancedSearchColumnDetails.length}
        setIsSearchPopupOpen={setIsSearchPopupOpen}
        isSearchPopupOpen={isSearchPopupOpen}
        searchColumnDetails={normalSearchColumnDetails}
        getDataRequest={getDataRequest({
          id: reportingId,
          setResponseData,
          setSortedTableData,
          setIsPrintAllowed,
          setIsExcelExportAllowed,
          setIsPdfExportAllowed,
          setIsSerchRequest,
        })}
        tblReportSearchColumnDetails={responseData?.tblReportSearchColumnDetails }
      />
      <div className="TableBox">
        <table className="table">
          <thead>
            <tr>
              {columnNames?.map((name, index) => (
                <th
                  onClick={() => onTableDataSort(index)}
                  key={index}
                  style={{
                    textAlign:
                      columnAlignments[index] === "C" ? "center" : "left",
                    cursor: "pointer",
                    textWrap: "nowrap",
                    display: !columnVisibles[index] ? "none" : "table-cell",
                  }}
                >
                  {name}{" "}
                  {sortedField.fieldName !== index || !sortedField.order ? (
                    <span style={{ opacity: 0 }}> ▲</span>
                  ) : sortedField.order === orderValues.desc ? (
                    <span> ▲</span>
                  ) : (
                    <span> ▼</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {itemsToDisplay?.length ? (
              itemsToDisplay?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columnAlignments?.map((alignment, columnIndex) => (
                    <td
                      key={columnIndex}
                      style={{
                        textAlign: alignment === "C" ? "center" : "left",
                        display: !columnVisibles[columnIndex]
                          ? "none"
                          : "table-cell",
                      }}
                    >
                      {item[`fieldValue${columnIndex + 1}`]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnDetails?.length} className="NoData">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination ">
        <div style={{ marginTop: "18px", marginRight: "12px" }}>
          Page {currentPage} / {totalPages}
        </div>
        <input
          style={{ width: "50px", marginRight: "12px", marginTop: "18px" }}
          className="form-control"
          type="number"
          value={paginationInputValue}
          onChange={(e) => setPaginationInputValue(e.target.value)}
        />
        <div className="BtnGroup">
          <button
            className="SubmitBtn"
            disabled={
              +paginationInputValue < 1 ||
              !Number.isInteger(+paginationInputValue) ||
              +paginationInputValue === currentPage ||
              +paginationInputValue > totalPages
            }
            onClick={() => {
              handlePageChange(+paginationInputValue);
            }}
          >
            Go
          </button>
          <button
            className="SubmitBtn"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="SubmitBtn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="SubmitBtn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            className="SubmitBtn"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>

      <div style={{ overflow: "hidden", width: "100%", height: "0" }}>
        <div id="table-content" ref={pdfContainerRef}>
          <PrintableTable
            columnNames={columnNames}
            columnAlignments={columnAlignments}
            data={
              responseData?.exportAllRecords ? sortedTableData : itemsToDisplay
            }
            title={responseData?.reportHeading}
          />
        </div>
      </div>

      <div className="BtnGroup">
        {isPrintAllowed && (
          <button className="SubmitBtn" onClick={handlePrint}>
            Print
          </button>
        )}
        {isExcelExportAllowed && (
          <button onClick={handleExcelExport} className="SubmitBtn">
            Export to Excel
          </button>
        )}
        {isPdfExportAllowed && (
          <button
            className="SubmitBtn"
            onClick={() =>
              generatePDF(pdfContainerRef, { filename: "exportPDF.pdf" })
            }
          >
            Export to PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
