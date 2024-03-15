import axios from "axios";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Test2({ modalTitle }) {
  const [responseData, setResponseData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = responseData?.recordPerPage || 10;
  const [inputValues, setInputValues] = useState({});
  const [selectedComboValues, setSelectedComboValues] = useState({});

  useEffect(() => {
    // Define the API URL
    const apiUrl = "http://192.168.100.187:8080/Report/list";

    // Make the Axios GET request to fetch data
    axios
      .post(apiUrl, {
        reportId: 2,
        param1: "2023",
        param2: "4",
      })
      .then((response) => {
        setResponseData(response.data.responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleInputChange = (e, selectFieldName) => {
    const { value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [selectFieldName]: value,
    }));
  };

  // const handleComboChange = (e, columnDetail) => {
  //   const { value } = e.target;
  //   setSelectedComboValues((prevComboValues) => ({
  //     ...prevComboValues,
  //     [columnDetail.selectFieldName]: value, // Use selectFieldName as the key
  //   }));
  // };
  const handleComboChange = (e, columnDetail) => {
    const { value } = e.target;
    setSelectedComboValues((prevComboValues) => ({
      ...prevComboValues,
      [columnDetail.selectFieldName]: value, // Use selectFieldName as the key
    }));
  };
  const handleFormSubmit = () => {
    // Initialize an array to store conditions
    const conditions = [];

    // Iterate over tblReportSearchColumnDetails to build conditions
    responseData.tblReportSearchColumnDetails.forEach((columnDetail) => {
      const { selectFieldName, controlType } = columnDetail;
      const inputValue = inputValues[selectFieldName];
      const selectedComboValue = selectedComboValues[selectFieldName];

      if (controlType === "tab" && inputValue) {
        // For input fields (controlType === "tab"), add condition to array
        conditions.push(`${selectFieldName}='${inputValue}'`);
      } else if (controlType === "combo" && selectedComboValue) {
        // For combo boxes (controlType === "combo"), add condition to array
        conditions.push(`${selectFieldName}='${selectedComboValue}'`);
      }
    });

    // Join conditions with 'and' if there are multiple conditions
    const combinedConditions = Object.keys(inputValues)
      .map((ele, index) => ele + "=" + Object.values(inputValues)[index])
      .concat(Object.values(selectedComboValues))
      .join(" and ");

    // console.log("Input Values:");
    // console.log("Selected Combo Values:");
    // console.log("Combined Conditions:", combinedConditions);

    // Show the alert with the combined conditions
    alert(combinedConditions);
  };

  const reportList = responseData?.getReportList || [];
  const columnDetails = responseData?.tblReportDetails[0].columnDetails;
  const columns = columnDetails?.split(" ~ ").map((column) => {
    const [, , alignment] = column?.split(":"); // Extract alignment (L or C)
    return alignment;
  });

  // Create an array of column names from columnDetails
  const columnNames = columnDetails
    ?.split(" ~ ")
    ?.map((column) => column?.split(":")[0]);

  // Calculate start and end indices for pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = reportList.slice(startIndex, endIndex);

  // Calculate total number of pages
  const totalPages = Math.ceil(reportList.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  if (!responseData) {
    return <Skeleton count={5} />;
  }
  return (
    <div>
      <h2>{responseData?.reportHeading}</h2>
      <div className="row">
        {/* Render controls based on tblReportSearchColumnDetails */}
        {responseData?.tblReportSearchColumnDetails?.map((columnDetail) => (
          <div key={columnDetail.columnId} className="col-md-2">
            <label>{columnDetail.columnName} </label>
       
            {columnDetail &&
            columnDetail.tblReportControlMaster &&
            columnDetail.tblReportControlMaster[0] &&
            columnDetail.tblReportControlMaster[0].controlType === "combo" ? (
              <select
                className="form-control select-form"
                onChange={(e) => handleComboChange(e, columnDetail)}
              >
                {columnDetail.tblReportControlMaster[0].tblReportControlDetail?.map(
                  (controlDetail) => (
                    <option
                      key={controlDetail.reportControlDetailId}
                      value={controlDetail.condition}
                    >
                      {controlDetail.lang1}
                    </option>
                  )
                )}
              </select>
            ) : (
              <div className="">
                <div className="FomrGroup">
                  {/* <label>{columnDetail.columnName}</label> */}
                  {/* <label className="errorLabel"> * </label> */}
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) =>
                      handleInputChange(e, columnDetail.selectFieldName)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            {columnNames?.map((columnName, index) => (
              <th
                key={index}
                style={{
                  textAlign: columns[index] === "C" ? "center" : "left",
                }}
              >
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {itemsToDisplay?.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns?.map((alignment, columnIndex) => (
                <td
                  key={columnIndex}
                  style={{ textAlign: alignment === "C" ? "center" : "left" }}
                >
                  {item[`fieldValue${columnIndex + 1}`]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Submit button */}
      <button onClick={handleFormSubmit}>Submit</button>
    </div>
  );
}

export default Test2;
