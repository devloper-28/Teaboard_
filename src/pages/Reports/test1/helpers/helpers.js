import { apiUrl, optionsConfig, orderValues } from "../constants/constants";
import axiosMain from "../http/axios/axios_main";

export function setOrder(order) {
  return order === orderValues.desc
    ? orderValues.asc
    : order === orderValues.asc
    ? ""
    : orderValues.desc;
}
function sortFunc(a, b, name, order) {
  if (typeof a[name] === "string" || typeof b[name] === "string") {
    if (a[name]?.toLowerCase() || "" > b[name]?.toLowerCase() || "") {
      return order === orderValues.asc ? -1 : 1;
    }
    if (a[name]?.toLowerCase() || "" > b[name]?.toLowerCase() || "") {
      return order === orderValues.desc ? -1 : 1;
    }
    return 0;
  }
  return order === orderValues.desc ? a[name] - b[name] : b[name] - a[name];
}
export function sortData(data = [], sortValue) {
  if (sortValue.order) {
    return [...data].sort((a, b) =>
      sortFunc(a, b, `fieldValue${sortValue.fieldName + 1}`, sortValue.order)
    );
  }
  return data;
}
export function getConvertFunction(inputValues, fildData, dataType) {
  return optionsConfig[dataType].value !== optionsConfig.between.value
    ? inputValues[fildData.selectFieldName + "From"]
      ? {
          [fildData.selectFieldName]: `convert(${
            fildData.tblReportControlMaster[0].controlType
          },${fildData.selectFieldName},103) ${
            optionsConfig[dataType].comparison
          } convert(${fildData.tblReportControlMaster[0].controlType},'${
            inputValues[fildData.selectFieldName + "From"]
          }',103)`,
        }
      : { [fildData.selectFieldName]: "" }
    : inputValues[fildData.selectFieldName + "From"] &&
      inputValues[fildData.selectFieldName + "To"]
    ? {
        [fildData.selectFieldName]: `convert(${
          fildData.tblReportControlMaster[0].controlType
        },${fildData.selectFieldName},103) ${
          optionsConfig[dataType].comparison
        } convert(${fildData.tblReportControlMaster[0].controlType},'${
          inputValues[fildData.selectFieldName + "From"]
        }',103) and convert(${
          fildData.tblReportControlMaster[0].controlType
        },'${inputValues[fildData.selectFieldName + "To"]}',103)`,
      }
    : { [fildData.selectFieldName]: "" };
}
export function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("-");
}

export const getDateInputType = (type) =>
  type === "datetime" ? "datetime-local" : "date";

export const selectAllFirstOptions = (
  data,
  handleComboChange,
  setDateTypes
) => {
  data?.forEach((columnDetail) => {
    const settings = columnDetail?.tblReportControlMaster?.[0];
    const options = settings?.tblReportControlDetail;
    if (
      settings?.controlType === "combo" &&
      !settings?.isAPI &&
      options?.some((option) => option.isDefaultSelected === "Y")
    ) {
      const option = options.find((option) => option.isDefaultSelected === "Y");
      handleComboChange(
        {
          target: {
            value: option?.condition || "",
          },
        },
        columnDetail
      );
    }
    if (
      settings?.controlType === "date" ||
      settings?.controlType === "datetime"
    ) {
      setDateTypes((types) => ({
        ...types,
        [columnDetail.selectFieldName]: optionsConfig.equal.value,
      }));
    }
  });
};

export const getDataRequest =
  ({
    id,
    setResponseData,
    setSortedTableData,
    setIsPrintAllowed,
    setIsExcelExportAllowed,
    setIsPdfExportAllowed,
    setIsSerchRequest,
  }) =>
  (condition) =>
    axiosMain
      .post(
        apiUrl,
        {
          reportId: id,
          param1: "",
          param2: "",
          condition,
        }
      )
      .then((response) => {
        setResponseData(response.data.responseData);
        setSortedTableData(
          sortData(response.data.responseData?.getReportList, orderValues)
        );
        selectAllFirstOptions(
          response.data.responseData?.tblReportSearchColumnDetails
        );
        setIsPrintAllowed(response.data.responseData.isPrintAllowed === 1);
        setIsExcelExportAllowed(
          response.data.responseData.excelRequired === "Y"
        );
        setIsPdfExportAllowed(response.data.responseData.pdfRequired === "Y");
        setIsSerchRequest && setIsSerchRequest(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
