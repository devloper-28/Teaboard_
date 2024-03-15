import React, { useEffect, useState } from "react";
import {
  getConvertFunction,
  formatDate,
  getDateInputType,
  selectAllFirstOptions,
} from "./helpers/helpers";
import { optionsConfig } from "./constants/constants";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useAuctionDetail } from "../../components/common/AunctioneerDeteailProvider";
// import { useAuctionDetail } from "./components/common/AunctioneerDeteailProvider";
// import axiosMain from "./http/axios/axios_main";
import axiosMain from "../../http/axios/axios_main";

const NormalSearch = ({
  searchColumnDetails,
  getDataRequest,
  hasAdvancedSearchColumnDetails,
  setIsSearchPopupOpen,
  isSearchPopupOpen,
  tblReportSearchColumnDetails,
}) => {
  const [multiselectValues, setMultiselectValues] = useState({});
  const [isErrorMessageOpen, setIsErrorMessageOpen] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [selectedComboValues, setSelectedComboValues] = useState({});
  const [extraSelectData, setExtraSelectData] = useState([]);
  const [dateTypes, setDateTypes] = useState({});
  const { auctionCenterId } = useAuctionDetail();

  useEffect(() => {
    if (searchColumnDetails.length) {
      selectAllFirstOptions(
        searchColumnDetails,
        handleComboChange,
        setDateTypes
      );
    }
  }, [!!searchColumnDetails.length]);

  const handleComboChange = (e, columnDetail) => {
    if (isErrorMessageOpen) setIsErrorMessageOpen(false);
    const { value } = e.target;

    console.log(
      columnDetail,
      columnDetail.datatype === "Date"
        ? [
            "'%",
            value
              ?.split("=")[1]
              ?.split("'")
              ?.map((ele) => (ele === "" ? "%" : ele))
              .join(""),
            "%'",
          ]
        : // .join()
          value.split("=")[1],
      "columnDetail"
    );
    setSelectedComboValues((prevComboValues) => ({
      ...prevComboValues,
      [columnDetail.selectFieldName]:
        !value || value.split("=").length > 1
          ? !columnDetail.tblReportControlMaster?.[0]?.isAPI &&
            !columnDetail.tblReportControlMaster?.[0]?.onclickAPIName &&
            columnDetail.tblReportControlMaster?.[0]?.query === null
            ? value
            : columnDetail.searchCriteria === 0
            ? `${columnDetail.selectFieldName} LIKE ${
                columnDetail.tblReportControlMaster?.[0]?.isAPI === 1 &&
                columnDetail.datatype === "Date"
                  ? "'" +
                    value
                      ?.split("=")[1]
                      ?.split("'")
                      ?.map((ele) => (ele === "" ? "%" : ele))
                      .join("") +
                    "'"
                  : "'%" + value.split("=")[1] + "%'"
              }`
            : `${columnDetail.selectFieldName} = ${value.split("=")[1]}`
          : columnDetail.searchCriteria === 0
          ? `${columnDetail.selectFieldName} LIKE '%${value}%'`
          : `${columnDetail.selectFieldName} = ${value}`, // Use selectFieldName as the key
    }));

    if (columnDetail?.tblReportControlMaster?.[0]?.onclickAPIName) {
      const extraParameters = {};

      if (value.split("=").length > 1) {
        extraParameters[value.split("=")[0]] = +value.split("=")[1];
      }
      axiosMain
        .post(`${columnDetail?.tblReportControlMaster?.[0]?.onclickAPIName}`, {
          season:
            extraSelectData[columnDetail?.tblReportControlMaster?.[0]?.apiname]
              ?.value || value,
          ...extraParameters,
          auctionCenterId: auctionCenterId,
        })
        .then((responce) => {
          setExtraSelectData((selectData) => ({
            ...selectData,
            [columnDetail?.tblReportControlMaster?.[0]?.onclickAPIName]: {
              value: value,
              options: responce?.data?.responseData || [],
            },
          }));
        })
        .catch((error) => {
          console.error("Error making API request:", error);
        });
    }
  };

  const handleFormSubmit = () => {
    // Show the alert with the combined conditions

    let fildData = searchColumnDetails.filter(
      (ele) => ele.datatype === "Date"
    )[0];

    let searchСriteria = {};
    Object.keys(dateTypes).forEach((fieldName) => {
      searchСriteria = {
        ...searchСriteria,
        ...getConvertFunction(inputValues, fildData, dateTypes[fieldName]),
      };
    });

    const clonedInputValues = { ...inputValues };
    Object.keys(searchСriteria).forEach((fieldKey) => {
      clonedInputValues[`${fieldKey}From`] = undefined;
      clonedInputValues[`${fieldKey}To`] = undefined;
      if (searchСriteria[fieldKey]) {
        clonedInputValues[fieldKey] = searchСriteria[fieldKey];
      }
    });

    const combinedConditions = Object.keys(clonedInputValues)
      .map((ele, index) => {
        const elementDetails = searchColumnDetails.find(
          (detail) => detail.selectFieldName === ele
        );

        // dynamic search condition logic based on the searchCriteria value
        const searchCriteriaValue = elementDetails?.searchCriteria;
        let newStatus = Object.values(selectedComboValues);

        if (
          ele !== "" &&
          ele !== undefined &&
          clonedInputValues[ele] !== "" &&
          clonedInputValues[ele] !== undefined
        ) {
          console.log("====2");
          if (Object.keys(dateTypes).some((dateType) => dateType === ele)) {
            console.log("====3", Object.values(clonedInputValues)[index]);
            return `${Object.values(clonedInputValues)[index]}`;
          } else {
            const condition = searchCriteriaValue === 0 ? "LIKE" : "=";
            const fieldValue = `${Object.values(clonedInputValues)[index]}`;
            // console.log("====4", `${ele} ${condition === "LIKE" ? "LIKE %"+fieldValue+"%":fieldValue}`);

            // console.log(
            //   "====1",

            //   // combinedConditions,
            //   inputValues,
            //   selectedComboValues,

            //   Object.values(clonedInputValues)

            //   // newStatus
            //   // elementDetails
            // );

            return `${ele} ${
              condition === "LIKE" ? "LIKE '%" + fieldValue + "%'" : fieldValue
            }`;
          }
        } else {
          console.log("====5");
          return "";
        }
      })
      // console.log(selectedComboValues)
      .concat(
        Object.values(selectedComboValues).filter((value) => {
          console.log("===!value.includ", value);
          return !value.includes("undefined");
        })
      )
      .concat(
        Object.keys(multiselectValues).map((multiselectFieldName) =>
          multiselectValues[multiselectFieldName]?.length
            ? `${multiselectFieldName} in (${multiselectValues[
                multiselectFieldName
              ]
                .map((ele) => {
                  console.log("==ele.value", ele.value);
                  return ele.value;
                })
                .join()})`
            : ""
        )
      )
      .filter(Boolean)
      .join(" and ");
    // console.log(
    //   searchColumnDetails
    //   .map((ele) =>
    //     ele.tblReportControlMaster.filter(
    //       (item) => item.controlType === "combo"
    //     )
    //   ),
    //   // .filter((ele) => ele.length > 0)
    //   // .map((ele) => {
    //   //   let strq = null;
    //   //   if (ele.query === null) {
    //   //     console.log("aws");
    //   //   }
    //   // })
    //   "dkk"
    // );
    console.log(inputValues, selectedComboValues, combinedConditions, "dkk");

    if (combinedConditions) {
      // let objeValueNames = Object.values(selectedComboValues);
      // let objeKeyNames = Object.keys(selectedComboValues);

      // let dataValue = objeValueNames
      //   .map((ele) => {
      //     let data = ele.split("=");
      //     data.shift();
      //     return data;
      //   })
      //   .map((ele) => ele[0]);

      // let newData = tblReportSearchColumnDetails
      //   .map((ele, index) => {
      //     // console.log("=====",ele.searchCriteria);
      //     let symbol = ele.searchCriteria === 0 ? " LIKE " : " = ";
      //     let data =
      //       dataValue[index] !== undefined
      //         ? `${ele.selectFieldName}${symbol}%${dataValue[index]}%`
      //         : "";
      //     return data;
      //   })
      //   .filter((ele) => ele !== "" && !ele.includes("undefined"))
      //   .join(" and ");

      // console.log("=== objeKeyNames[0]", objeKeyNames[0]);
      // console.log("===newData",newData);
      console.log("===combinedConditions", combinedConditions);
      getDataRequest(combinedConditions);
    } else {
      setIsErrorMessageOpen(true);
    }
  };

  const handleInputChange = (e, selectFieldName, inputType) => {
    if (isErrorMessageOpen) setIsErrorMessageOpen(false);
    const { value } = e.target;

    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [selectFieldName]:
        inputType === "date" && value ? formatDate(value) : value,
    }));
  };

  const handleFormReset = () => {
    if (isErrorMessageOpen) setIsErrorMessageOpen(false);
    setExtraSelectData([]);
    setSelectedComboValues({});
    setInputValues({});
    setMultiselectValues({});
    setDateTypes((dateTypes) => {
      const result = {};

      Object.keys(dateTypes).map((dateTypeKey) => {
        result[dateTypeKey] = optionsConfig.equal.value;
      });

      return result;
    });
    selectAllFirstOptions(searchColumnDetails, handleComboChange, setDateTypes);
    const resetableElements = document.querySelectorAll("[data='resetable']");
    [].forEach.call(resetableElements, (element) => {
      element.value = "";
    });
  };

  console.log(
    // searchColumnDetails
    //   ?.map((columnDetail) =>
    //     columnDetail.tblReportControlMaster[0].controlType === "multiselect"
    //       ? extraSelectData[columnDetail.tblReportControlMaster[0].apiname]
    //       : ""
    //   )
    //   ?.filter((ele) => ele !== "")
    //   ?.map((ele, index) => ele?.options)
    //   ?.at(0)
    //   ?.map((ele) => {
    //     return { controlValue: ele[
    //       columnDetail.tblReportControlMaster[0]?.responseField
    //         ?.split(":")
    //         ?.at(0)
    //     ], condition: ele[
    //       columnDetail.tblReportControlMaster[0]?.responseField
    //         ?.split(":")
    //         ?.at(0)
    //     ] };
    //   }),
    searchColumnDetails?.map((columnDetail) =>
      columnDetail.tblReportControlMaster[0].controlType === "multiselect"
        ? extraSelectData[
            columnDetail.tblReportControlMaster[0].apiname
          ]?.options?.map((ele) => {
            return {
              condition:
                ele[
                  columnDetail.tblReportControlMaster[0]?.responseField
                    ?.split(":")
                    ?.at(1)
                ],
                controlValue:
                ele[
                  columnDetail.tblReportControlMaster[0]?.responseField
                    ?.split(":")
                    ?.at(0)
                ],
            };
          })
        : ""
    ),
    "extraSelectData"
  );

  return (
    <div
      style={{
        display:
          !hasAdvancedSearchColumnDetails || isSearchPopupOpen
            ? "block"
            : "none",
      }}
    >
      <div className="row">
        {searchColumnDetails?.map((columnDetail) => {
          const feildArray =
            columnDetail?.tblReportControlMaster?.[0]?.responseField?.split(
              ":"
            );
          const labelOptionName = Array.isArray(feildArray)
            ? feildArray[feildArray.length - 1]
            : "";
          const valueOptionName = Array.isArray(feildArray)
            ? feildArray[0]
            : "";
          return (
            <div key={columnDetail.columnId} className="col-xl-2">
              <label>{columnDetail.columnName}</label>
              {columnDetail &&
              columnDetail.tblReportControlMaster &&
              columnDetail.tblReportControlMaster[0] &&
              columnDetail.tblReportControlMaster[0].controlType === "combo" ? (
                <select
                  className="form-control select-form"
                  data="resetable"
                  onChange={(e) => handleComboChange(e, columnDetail)}
                  value={
                    !columnDetail.tblReportControlMaster[0].isAPI &&
                    columnDetail.tblReportControlMaster[0].tblReportControlDetail?.some(
                      (option) => option.isDefaultSelected === "Y"
                    )
                      ? selectedComboValues[columnDetail.selectFieldName]
                      : undefined
                  }
                >
                  {console.log(
                    "===badal",
                    !columnDetail.tblReportControlMaster[0]
                  )}
                  {!columnDetail.tblReportControlMaster[0].isAPI &&
                  columnDetail.tblReportControlMaster[0].tblReportControlDetail?.some(
                    (option) => option.isDefaultSelected === "Y"
                  ) ? null : (
                    <option value={""}>Select Value</option>
                  )}
                  {columnDetail?.tblReportControlMaster?.[0]?.isAPI
                    ? (
                        extraSelectData[
                          columnDetail?.tblReportControlMaster?.[0]?.apiname
                        ]?.options || []
                      ).map((optionData) => {
                        const value = `${valueOptionName}=${
                          columnDetail.datatype === "Date"
                            ? `'${optionData[valueOptionName]}'`
                            : optionData[valueOptionName]
                        }`;
                        const label = `${optionData[labelOptionName]}`;

                        return (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        );
                      })
                    : columnDetail.tblReportControlMaster[0].tblReportControlDetail?.map(
                        (controlDetail) => (
                          <option
                            key={controlDetail.reportControlDetailId}
                            value={controlDetail.condition}
                          >
                            {controlDetail.lang1 || controlDetail.condition}
                          </option>
                        )
                      )}
                </select>
              ) : columnDetail.tblReportControlMaster[0].controlType ===
                  "date" ||
                columnDetail.tblReportControlMaster[0].controlType ===
                  "datetime" ? (
                <>
                  <select
                    className="form-control select-form"
                    value={
                      dateTypes[columnDetail.selectFieldName] ||
                      optionsConfig.equal.value
                    }
                    onChange={(e) => {
                      if (isErrorMessageOpen) setIsErrorMessageOpen(false);
                      setDateTypes({
                        [columnDetail.selectFieldName]: e.target.value,
                      });
                    }}
                  >
                    {Object.values(optionsConfig).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    className="form-control"
                    data="resetable"
                    type={getDateInputType(
                      columnDetail.tblReportControlMaster[0].controlType
                    )}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        columnDetail.selectFieldName + "From",
                        getDateInputType(
                          columnDetail.tblReportControlMaster[0].controlType
                        )
                      )
                    }
                  />
                  {dateTypes[columnDetail.selectFieldName] ===
                  optionsConfig.between.value ? (
                    <input
                      className="form-control asd"
                      data="resetable"
                      type={getDateInputType(
                        columnDetail.tblReportControlMaster[0].controlType
                      )}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          columnDetail.selectFieldName + "To",
                          getDateInputType(
                            columnDetail.tblReportControlMaster[0].controlType
                          )
                        )
                      }
                    />
                  ) : (
                    ""
                  )}
                </>
              ) : columnDetail.tblReportControlMaster[0].controlType ===
                "multiselect" ? (
                columnDetail.tblReportControlMaster[0].isAPI === 1 ? (
                  <MultiSelectDropdown
                    optionsList={
                      // columnDetail.tblReportControlMaster[0]
                      //   .tblReportControlDetail
                      extraSelectData[
                        columnDetail.tblReportControlMaster[0].apiname
                      ]?.options?.map((ele) => {
                        return {
                          controlValue:
                            ele[
                              columnDetail.tblReportControlMaster[0]?.responseField
                                ?.split(":")
                                ?.at(0)
                            ],
                          condition:
                            ele[
                              columnDetail.tblReportControlMaster[0]?.responseField
                                ?.split(":")
                                ?.at(1)
                            ],
                        };
                      })
                    }
                    selectedOptions={
                      multiselectValues[columnDetail.selectFieldName] || []
                    }
                    setSelectedOptions={(selectedValues) => {
                      if (isErrorMessageOpen) setIsErrorMessageOpen(false);
                      setMultiselectValues((values) => ({
                        ...values,
                        [columnDetail.selectFieldName]: selectedValues,
                      }));
                    }}
                  />
                ) : (
                  <MultiSelectDropdown
                    optionsList={
                      columnDetail.tblReportControlMaster[0]
                        .tblReportControlDetail
                    }
                    selectedOptions={
                      multiselectValues[columnDetail.selectFieldName] || []
                    }
                    setSelectedOptions={(selectedValues) => {
                      if (isErrorMessageOpen) setIsErrorMessageOpen(false);
                      setMultiselectValues((values) => ({
                        ...values,
                        [columnDetail.selectFieldName]: selectedValues,
                      }));
                    }}
                  />
                )
              ) : (
                <input
                  className="form-control"
                  data="resetable"
                  type="text"
                  onChange={(e) =>
                    handleInputChange(e, columnDetail.selectFieldName)
                  }
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="BtnGroup mb-3">
        <button className="SubmitBtn" onClick={handleFormReset}>
          Reset
        </button>

        <button className="SubmitBtn" onClick={handleFormSubmit}>
          Submit
        </button>
        {isSearchPopupOpen && (
          <button
            className="SubmitBtn"
            onClick={() => setIsSearchPopupOpen(false)}
          >
            -
          </button>
        )}
      </div>
      <div className="col-12 p-0">
        {isErrorMessageOpen && (
          <p style={{ color: "red" }}>Please select at least one value</p>
        )}
      </div>
    </div>
  );
};

export default NormalSearch;
