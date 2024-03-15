// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";

// import PrintableTable from "./printTable";
// import { usePrint } from "./PrintDataTable";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import MultiSelectDropdown from "./MultiSelectDropdown";

// // Define the API URL
// const apiUrl = "http://192.168.101.5:9191/postauction/Report/list";
// const teabordUrl = "http://192.168.101.5:9191/";

// const orderValues = { desc: "desc", asc: "asc" };
// const initialSortValue = {
//   fieldName: "",
//   order: "",
// };

// function setOrder(order) {
//   return order === orderValues.desc
//     ? orderValues.asc
//     : order === orderValues.asc
//     ? ""
//     : orderValues.desc;
// }
// function sortFunc(a, b, name, order) {
//   if (typeof a[name] === "string" || typeof b[name] === "string") {
//     if (a[name]?.toLowerCase() || "" > b[name]?.toLowerCase() || "") {
//       return order === orderValues.asc ? -1 : 1;
//     }
//     if (a[name]?.toLowerCase() || "" > b[name]?.toLowerCase() || "") {
//       return order === orderValues.desc ? -1 : 1;
//     }
//     return 0;
//   }
//   return order === orderValues.desc ? a[name] - b[name] : b[name] - a[name];
// }
// function sortData(data = [], sortValue) {
//   if (sortValue.order) {
//     return [...data].sort((a, b) =>
//       sortFunc(a, b, `fieldValue${sortValue.fieldName + 1}`, sortValue.order)
//     );
//   }
//   return data;
// }
// function getConvertFunction(inputValues, fildData, dataType) {
//   return optionsConfig[dataType].value !== optionsConfig.between.value
//     ? inputValues[fildData.selectFieldName + "From"]
//       ? {
//           [fildData.selectFieldName]: `convert(${
//             fildData.tblReportControlMaster[0].controlType
//           },${fildData.selectFieldName},103) ${
//             optionsConfig[dataType].comparison
//           } convert(${fildData.tblReportControlMaster[0].controlType},'${
//             inputValues[fildData.selectFieldName + "From"]
//           }',103)`,
//         }
//       : { [fildData.selectFieldName]: "" }
//     : inputValues[fildData.selectFieldName + "From"] &&
//       inputValues[fildData.selectFieldName + "To"]
//     ? {
//         [fildData.selectFieldName]: `convert(${
//           fildData.tblReportControlMaster[0].controlType
//         },${fildData.selectFieldName},103) ${
//           optionsConfig[dataType].comparison
//         } convert(${fildData.tblReportControlMaster[0].controlType},'${
//           inputValues[fildData.selectFieldName + "From"]
//         }',103) and convert(${
//           fildData.tblReportControlMaster[0].controlType
//         },'${inputValues[fildData.selectFieldName + "To"]}',103)`,
//       }
//     : { [fildData.selectFieldName]: "" };
// }

// const optionsConfig = {
//   equal: { label: "Equal", value: "equal", comparison: "=" },
//   notEqual: { label: "Not Equal", value: "notEqual", comparison: "!=" },
//   less: { label: "Less", value: "less", comparison: "<" },
//   lessOrEqual: {
//     label: "Less or Equal",
//     value: "lessOrEqual",
//     comparison: "<=",
//   },
//   greater: { label: "Greater", value: "greater", comparison: ">" },
//   greaterOrEqual: {
//     label: "Greater or Equal",
//     value: "greaterOrEqual",
//     comparison: ">=",
//   },
//   between: { label: "Between", value: "between", comparison: "between" },
// };

// const Test1 = ({reportingId}) => {
//   const [isPrintAllowed, setIsPrintAllowed] = useState(false);
//   const [isExcelExportAllowed, setIsExcelExportAllowed] = useState(false);
//   const { printContent } = usePrint();
//   const [multiselectValues, setMultiselectValues] = useState({});

//   const [responseData, setResponseData] = useState(null);
//   const [sortedTableData, setSortedTableData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = responseData?.recordPerPage || 10;
//   const [inputValues, setInputValues] = useState({});
//   const [selectedComboValues, setSelectedComboValues] = useState({});
//   const [dateTypes, setDateTypes] = useState({});
//   const [extraSelectData, setExtraSelectData] = useState([]);
//   const [sortedField, setSortedField] = useState(initialSortValue);
//   const [paginationInputValue, setPaginationInputValue] = useState("");

//   const formatDate = (date) => {
//     var d = new Date(date),
//       month = "" + (d.getMonth() + 1),
//       day = "" + d.getDate(),
//       year = d.getFullYear();

//     if (month.length < 2) month = "0" + month;
//     if (day.length < 2) day = "0" + day;

//     return [day, month, year].join("-");
//   };
//   const getDateInputType = (type) =>
//     type === "datetime" ? "datetime-local" : "date";

//   useEffect(
//     () =>
//       setSortedTableData(sortData(responseData?.getReportList, sortedField)),
//     [sortedField]
//   );
//   useEffect(() => {
//     // Make the Axios GET request to fetch data
//     axios
//       .post(
//         apiUrl,
//         {
//           reportId: reportingId,
//           param1: "",
//           param2: "",
//           condition: "",
//         },
//         {
//           headers: {
//             Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJCVVlFUkExIiwiaWF0IjoxNjk4NjQ2NDI0LCJleHAiOjE2OTg4MjY0MjR9.7aJEnZGf_-L5lp_vnWkULO-5RnUFVr0TmHIY4vFaeRs`,
//           },
//         }
//       )
//       .then((response) => {
//         setResponseData(response.data.responseData);
//         setSortedTableData(
//           sortData(response.data.responseData?.getReportList, orderValues)
//         );
//         selectAllFirstOptions(
//           response.data.responseData?.tblReportSearchColumnDetails
//         );
//         setIsPrintAllowed(response.data.responseData.isPrintAllowed === 1);
//         setIsExcelExportAllowed(
//           response.data.responseData.excelRequired === "Y"
//         );
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, []);

//   const handleInputChange = (e, selectFieldName, inputType) => {
//     const { value } = e.target;

//     setInputValues((prevInputValues) => ({
//       ...prevInputValues,
//       [selectFieldName]:
//         inputType === "date" && value ? formatDate(value) : value,
//     }));
//   };
//   const handlePrint = (e) => {
//     e.preventDefault();
//     printContent("table-content");
//     // Close the print window
//     // printWindow.close();
//   };

//   const handleComboChange = (e, columnDetail) => {
//     const { value } = e.target;
//     setSelectedComboValues((prevComboValues) => ({
//       ...prevComboValues,
//       [columnDetail.selectFieldName]:
//         !value || value.split("=").length > 1
//           ? !columnDetail.tblReportControlMaster?.[0]?.isAPI &&
//             !columnDetail.tblReportControlMaster?.[0]?.onclickAPIName
//             ? value
//             : `${columnDetail.selectFieldName}=${value.split("=")[1]}`
//           : `${columnDetail.selectFieldName}=${value}`, // Use selectFieldName as the key
//     }));
//     if (columnDetail?.tblReportControlMaster?.[0]?.onclickAPIName) {
//       const extraParameters = {};

//       if (value.split("=").length > 1) {
//         extraParameters[value.split("=")[0]] = +value.split("=")[1];
//       }

//       axios
//         .post(
//           `${teabordUrl}${columnDetail?.tblReportControlMaster?.[0]?.onclickAPIName}`,
//           {
//             season:
//               extraSelectData[
//                 columnDetail?.tblReportControlMaster?.[0]?.apiname
//               ]?.value || value,
//             ...extraParameters,
//             auctionCenterId: "1",
//           },

//           {
//             headers: {
//               Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJCVVlFUkExIiwiaWF0IjoxNjk4NjQ2NDI0LCJleHAiOjE2OTg4MjY0MjR9.7aJEnZGf_-L5lp_vnWkULO-5RnUFVr0TmHIY4vFaeRs`,
//             },
//           }
//         )
//         .then((responce) => {
//           setExtraSelectData((selectData) => ({
//             ...selectData,
//             [columnDetail?.tblReportControlMaster?.[0]?.onclickAPIName]: {
//               value: value,
//               options: responce?.data?.responseData || [],
//             },
//           }));
//         })
//         .catch((error) => {
//           console.error("Error making API request:", error);
//         });
//     }
//   };
//   const handleFormSubmit = () => {
//     // Initialize an array to store conditions
//     const conditions = [];
//     let flag = false;

//     // Iterate over tblReportSearchColumnDetails to build conditions
//     responseData.tblReportSearchColumnDetails.forEach((columnDetail) => {
//       const { selectFieldName, controlType } = columnDetail;
//       const inputValue = inputValues[selectFieldName];
//       const selectedComboValue = selectedComboValues[selectFieldName];

//       if (controlType === "tab" && inputValue) {
//         // For input fields (controlType === "tab"), add condition to array
//         conditions.push(`${selectFieldName}='${inputValue}'`);
//       } else if (controlType === "combo" && selectedComboValue) {
//         // For combo boxes (controlType === "combo"), add condition to array
//         conditions.push(`${selectFieldName}='${selectedComboValue}'`);
//       }
//     });

//     // Show the alert with the combined conditions

//     let fildData = responseData.tblReportSearchColumnDetails.filter(
//       (ele) => ele.datatype === "Date"
//     )[0];

//     let data = {};
//     Object.keys(dateTypes).forEach((fieldName) => {
//       data = {
//         ...data,
//         ...getConvertFunction(inputValues, fildData, dateTypes[fieldName]),
//       };
//     });

//     const clonedInputValues = { ...inputValues };

//     Object.keys(data).forEach((fieldKey) => {
//       clonedInputValues[`${fieldKey}From`] = undefined;
//       clonedInputValues[`${fieldKey}To`] = undefined;
//       if (data[fieldKey]) {
//         clonedInputValues[fieldKey] = data[fieldKey];
//       }
//     });

//     if (
//       selectedComboValues ||
//       Object.keys(multiselectValues).some(
//         (multiselectFieldName) => multiselectValues[multiselectFieldName].length
//       )
//     )
//       flag = true;
//     // Join conditions with 'and' if there are multiple conditions
//     Object.keys(clonedInputValues).map((ele, index) =>
//       ele !== "" ? (ele !== undefined ? (flag = true) : "") : (flag = false)
//     );
//     const combinedConditions = Object.keys(clonedInputValues)
//       .map((ele, index) =>
//         ele !== "" &&
//         ele !== undefined &&
//         clonedInputValues[ele] !== "" &&
//         clonedInputValues[ele] !== undefined
//           ? Object.keys(dateTypes).some((fieldName) => fieldName === ele)
//             ? `${Object.values(clonedInputValues)[index]}`
//             : `${ele}='${Object.values(clonedInputValues)[index]}'`
//           : ""
//       )
//       .concat(
//         Object.values(selectedComboValues).filter(
//           (value) => !value.includes("undefined")
//         )
//       )
//       .concat(
//         Object.keys(multiselectValues).map((multiselectFieldName) =>
//           multiselectValues[multiselectFieldName]?.length
//             ? `${multiselectFieldName} in (${multiselectValues[
//                 multiselectFieldName
//               ]
//                 .map((ele) => ele.value)
//                 .join()})`
//             : ""
//         )
//       )
//       .filter(Boolean)
//       .join(" and ");

//     axios
//       .post(
//         apiUrl,
//         {
//           reportId: reportingId,
//           param1: "",
//           param2: "",
//           condition: combinedConditions,
//         },
//         {
//           headers: {
//             Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJCVVlFUkExIiwiaWF0IjoxNjk4NjQ2NDI0LCJleHAiOjE2OTg4MjY0MjR9.7aJEnZGf_-L5lp_vnWkULO-5RnUFVr0TmHIY4vFaeRs`,
//           },
//         }
//       )
//       .then((response) => {
//         setResponseData(response.data.responseData);
//         setSortedTableData(
//           sortData(response.data.responseData?.getReportList, orderValues)
//         );
//         setIsPrintAllowed(response.data.responseData.isPrintAllowed === 1);
//         setIsExcelExportAllowed(
//           response.data.responseData.excelRequired === "Y"
//         );
//       })
//       .catch((error) => {
//         console.error("Error making API request:", error);
//       });
//   };
//   const handleFormReset = () => {
//     setExtraSelectData([]);
//     setSelectedComboValues({});
//     setInputValues({});
//     setMultiselectValues({});
//     setDateTypes((dateTypes) => {
//       const result = {};

//       Object.keys(dateTypes).map((dateTypeKey) => {
//         result[dateTypeKey] = optionsConfig.equal.value;
//       });

//       return result;
//     });
//     selectAllFirstOptions(responseData?.tblReportSearchColumnDetails);
//     const resetableElements = document.querySelectorAll("[data='resetable']");
//     [].forEach.call(resetableElements, (element) => {
//       element.value = "";
//     });
//   };

//   const selectAllFirstOptions = (data) => {
//     data?.forEach((columnDetail) => {
//       const settings = columnDetail?.tblReportControlMaster?.[0];
//       const options = settings?.tblReportControlDetail;
//       if (
//         settings?.controlType === "combo" &&
//         !settings?.isAPI &&
//         options?.some((option) => option.isDefaultSelected === "Y")
//       ) {
//         const option = options.find(
//           (option) => option.isDefaultSelected === "Y"
//         );
//         handleComboChange(
//           {
//             target: {
//               value: option?.condition || "",
//             },
//           },
//           columnDetail
//         );
//       }
//       if (
//         settings?.controlType === "date" ||
//         settings?.controlType === "datetime"
//       ) {
//         setDateTypes((types) => ({
//           ...types,
//           [columnDetail.selectFieldName]: optionsConfig.equal.value,
//         }));
//       }
//     });
//   };

//   const columnDetails = responseData?.tblReportDetails[0].columnDetails;
//   const columns = columnDetails?.split(" ~ ").map((column) => {
//     const [, , alignment] = column?.split(":"); // Extract alignment (L or C)
//     return alignment;
//   });

//   // Create an array of column names from columnDetails
//   const columnNames = columnDetails
//     ?.split(" ~ ")
//     ?.map((column) => column?.split(":")[0]);

//   // Calculate start and end indices for pagination
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const itemsToDisplay = sortedTableData.slice(startIndex, endIndex);

//   // Calculate total number of pages
//   const totalPages = Math.ceil(sortedTableData.length / itemsPerPage);

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };
//   if (!responseData) {
//     return <div>Loading...</div>;
//   }
//   const handleExcelExport = () => {
//     // Convert your data to an array of arrays
//     const table = document.getElementById("table-content");
//     const wb = XLSX.utils.table_to_book(table);
//     XLSX.writeFile(wb, responseData?.reportHeading + ".xlsx");
//   };
//   const onTableDataSort = (name) => {
//     setSortedField((sortedFieldValue) => ({
//       fieldName: name,
//       order: setOrder(
//         sortedFieldValue.fieldName === name ? sortedFieldValue.order : ""
//       ),
//     }));
//   };

//   return (
//     <div>
//       <h2>{responseData?.reportHeading}</h2>
//       <div className="row">
//         {responseData?.tblReportSearchColumnDetails?.map((columnDetail) => {
//           const feildArray =
//             columnDetail?.tblReportControlMaster?.[0]?.responseField?.split(
//               ":"
//             );
//           const labelOptionName = Array.isArray(feildArray)
//             ? feildArray[feildArray.length - 1]
//             : "";
//           const valueOptionName = Array.isArray(feildArray)
//             ? feildArray[0]
//             : "";
//           return (
//             <div key={columnDetail.columnId} className="col-xl-2">
//               <label>{columnDetail.columnName}</label>
//               {columnDetail &&
//               columnDetail.tblReportControlMaster &&
//               columnDetail.tblReportControlMaster[0] &&
//               columnDetail.tblReportControlMaster[0].controlType === "combo" ? (
//                 <div className="FomrGroup">
//                 <select
//                  className="form-control select-form"
//                   data="resetable"
//                   onChange={(e) => handleComboChange(e, columnDetail)}
//                   value={
//                     !columnDetail.tblReportControlMaster[0].isAPI &&
//                     columnDetail.tblReportControlMaster[0].tblReportControlDetail?.some(
//                       (option) => option.isDefaultSelected === "Y"
//                     )
//                       ? selectedComboValues[columnDetail.selectFieldName]
//                       : undefined
//                   }
//                 >
//                   {!columnDetail.tblReportControlMaster[0].isAPI &&
//                   columnDetail.tblReportControlMaster[0].tblReportControlDetail?.some(
//                     (option) => option.isDefaultSelected === "Y"
//                   ) ? null : (
//                     <option value={""}>Select Value</option>
//                   )}
//                   {columnDetail?.tblReportControlMaster?.[0]?.isAPI
//                     ? (
//                         extraSelectData[
//                           columnDetail?.tblReportControlMaster?.[0]?.apiname
//                         ]?.options || []
//                       ).map((optionData) => {
//                         const value = `${valueOptionName}=${
//                           columnDetail.datatype === "Date"
//                             ? `'${optionData[valueOptionName]}'`
//                             : optionData[valueOptionName]
//                         }`;
//                         const label = `${optionData[labelOptionName]}`;

//                         return (
//                           <option key={value} value={value}>
//                             {label}
//                           </option>
//                         );
//                       })
//                     : columnDetail.tblReportControlMaster[0].tblReportControlDetail?.map(
//                         (controlDetail) => (
//                           <option
//                             key={controlDetail.reportControlDetailId}
//                             value={controlDetail.condition}
//                           >
//                             {controlDetail.lang1 || controlDetail.condition}
//                           </option>
//                         )
//                       )}
//                 </select>
//                 </div>
//               ) : columnDetail.tblReportControlMaster[0].controlType ===
//                   "date" ||
//                 columnDetail.tblReportControlMaster[0].controlType ===
//                   "datetime" ? (
//                 <>
//                   <select
//                     value={
//                       dateTypes[columnDetail.selectFieldName] ||
//                       optionsConfig.equal.value
//                     }
//                     onChange={(e) =>
//                       setDateTypes({
//                         [columnDetail.selectFieldName]: e.target.value,
//                       })
//                     }
//                   >
//                     {Object.values(optionsConfig).map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                   className="form-control"
//                     data="resetable"
//                     type={getDateInputType(
//                       columnDetail.tblReportControlMaster[0].controlType
//                     )}
//                     onChange={(e) =>
//                       handleInputChange(
//                         e,
//                         columnDetail.selectFieldName + "From",
//                         getDateInputType(
//                           columnDetail.tblReportControlMaster[0].controlType
//                         )
//                       )
//                     }
//                   />
//                   {dateTypes[columnDetail.selectFieldName] ===
//                   optionsConfig.between.value ? (
//                     <input
//                     className="form-control"
//                       data="resetable"
//                       type={getDateInputType(
//                         columnDetail.tblReportControlMaster[0].controlType
//                       )}
//                       onChange={(e) =>
//                         handleInputChange(
//                           e,
//                           columnDetail.selectFieldName + "To",
//                           getDateInputType(
//                             columnDetail.tblReportControlMaster[0].controlType
//                           )
//                         )
//                       }
//                     />
//                   ) : (
//                     ""
//                   )}
//                 </>
//               ) : columnDetail.tblReportControlMaster[0].controlType ===
//                 "multiselect" ? (
//                 <MultiSelectDropdown
//                   optionsList={columnDetail.tblReportControlMaster[0]}
//                   selectedOptions={
//                     multiselectValues[columnDetail.selectFieldName] || []
//                   }
//                   setSelectedOptions={(selectedValues) => {
//                     setMultiselectValues((values) => ({
//                       ...values,
//                       [columnDetail.selectFieldName]: selectedValues,
//                     }));
//                   }}
//                 />
//               ) : (
//                 <input
//                 className="form-control"
//                   data="resetable"
//                   type="text"
//                   onChange={(e) =>
//                     handleInputChange(e, columnDetail.selectFieldName)
//                   }
//                 />
//               )}
//             </div>
//           );
//         })}
//       </div>
//       <div className="BtnGroup">
//         <button onClick={handleFormReset} className="SubmitBtn">
//           Reset
//         </button>
//         <button onClick={handleFormSubmit} className="SubmitBtn">
//           Submit
//         </button>
//       </div>
//       <div className="TableBox my-3">
//         <table>
//           <thead>
//             <tr>
//               {columnNames?.map((columnName, index) => (
//                 <th
//                   onClick={() => onTableDataSort(index)}
//                   key={index}
//                   style={{
//                     textAlign: columns[index] === "C" ? "center" : "left",
//                     cursor: "pointer",
//                     textWrap: "nowrap",
//                   }}
//                 >
//                   {columnName}{" "}
//                   {sortedField.fieldName !== index || !sortedField.order ? (
//                     <span style={{ opacity: 0 }}> ▲</span>
//                   ) : sortedField.order === orderValues.desc ? (
//                     <span> ▲</span>
//                   ) : (
//                     <span> ▼</span>
//                   )}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {itemsToDisplay?.map((item, rowIndex) => (
//               <tr key={rowIndex}>
//                 {columns?.map((alignment, columnIndex) => (
//                   <td
//                     key={columnIndex}
//                     style={{ textAlign: alignment === "C" ? "center" : "left" }}
//                   >
//                     {item[`fieldValue${columnIndex + 1}`]}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="pagination">
//         <div style={{marginTop:"18px"}}>
//         Page {currentPage} / {totalPages}
//         </div>
//         <input
//         className="form-control"
//           type="number"
//           style={{width:"50px",marginRight:"12px",marginTop:"18px"}}
//           value={paginationInputValue}
//           onChange={(e) => setPaginationInputValue(e.target.value)}
//         />
//         <div className="BtnGroup">
//           <button
//             className="SubmitBtn"
//             disabled={
//               +paginationInputValue < 1 ||
//               !Number.isInteger(+paginationInputValue) ||
//               +paginationInputValue === currentPage ||
//               +paginationInputValue > totalPages
//             }
//             onClick={() => {
//               handlePageChange(+paginationInputValue);
//             }}
//           >
//             Go
//           </button>
//         </div>
//         <div className="BtnGroup">
//           <button
//             className="SubmitBtn"
//             onClick={() => handlePageChange(1)}
//             disabled={currentPage === 1}
//           >
//             First
//           </button>
//           <button
//             className="SubmitBtn"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           <button
//             className="SubmitBtn"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//           <button
//             className="SubmitBtn"
//             onClick={() => handlePageChange(totalPages)}
//             disabled={currentPage === totalPages}
//           >
//             Last
//           </button>
//         </div>
//       </div>

//       <div id="table-content" style={{ display: "none" }}>
//         <PrintableTable columns={columnNames} data={itemsToDisplay} />
//       </div>
//       <div className="BtnGroup">
//         <div>
//           {isPrintAllowed && (
//             <button
//               className="SubmitBtn"
//               onClick={() =>
//                 printContent("table-content", responseData?.reportHeading)
//               }
//             >
//               Print
//             </button>
//           )}
//           {isExcelExportAllowed && (
//             <button className="SubmitBtn" onClick={handleExcelExport}>
//               Export to Excel
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Test1;
