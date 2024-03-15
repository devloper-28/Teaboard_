import React, { useState } from "react";

const AdvancedSearch = ({
  searchColumnDetails,
  getDataRequest,
  setIsSearchPopupOpen,
  isSearchPopupOpen,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isErrorMessageOpen, setIsErrorMessageOpen] = useState(false);

  const searchClickHandler = () => {
    if (searchValue) {
      const searchConditions = searchColumnDetails
        .map((ele) => {
          let data = {
            selectFieldName: ele.selectFieldName,
            controlType: ele.tblReportControlMaster[0].controlType,
          };
          return data;
        })
        .map((details) =>
          details.controlType === "tab" ||
          details.controlType === "date" ||
          details.controlType === "datetime"
            ? `${details.selectFieldName} LIKE '%${searchValue}%'`
            : ""
        )
        .filter((ele) => ele !== "")
        .join(" or ");

      getDataRequest(searchConditions);
      console.log(
        // searchColumnDetails.map((ele) => {
        //   let data = {
        //     selectFieldName: ele.selectFieldName,
        //     controlType: ele.tblReportControlMaster[0].controlType,
        //   };
        //   return data;
        // })
        searchConditions
      );
    } else {
      setIsErrorMessageOpen(true);
    }
  };
  const resetClickHandler = () => {
    setSearchValue("");
    getDataRequest("");
  };
  const changeSearchHandler = (e) => {
    if (isErrorMessageOpen) setIsErrorMessageOpen(false);
    setSearchValue(e.target.value);
  };

  return (
    !!searchColumnDetails.length && (
      <div className="row mb-3">
        {" "}
        <div className="col-lg-2">
          <input
            className="form-control"
            style={{ marginTop: "18px" }}
            value={searchValue}
            onChange={changeSearchHandler}
          />
        </div>
        <div className="col-lg-10">
          <div className="BtnGroup">
            <button className="SubmitBtn" onClick={searchClickHandler}>
              Search
            </button>
            <button
              className="SubmitBtn"
              onClick={resetClickHandler}
              disabled={!searchValue}
            >
              Clear
            </button>
            <button
              className="SubmitBtn"
              onClick={() => setIsSearchPopupOpen(!isSearchPopupOpen)}
            >
              {isSearchPopupOpen ? "-" : "+"}
            </button>
          </div>
        </div>
        <div className="col-12 p-0">
          {isErrorMessageOpen && (
            <p style={{ color: "red", marginLeft: "18px" }}>
              Please select at least one value
            </p>
          )}
        </div>
      </div>
    )
  );
};

export default AdvancedSearch;
