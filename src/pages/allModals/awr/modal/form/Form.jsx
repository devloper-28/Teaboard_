import React, { useEffect, useState } from "react";
import { Button, Card, FormControl, InputGroup, Table } from "react-bootstrap";
import CustomeFormCreater from "../../../../../components/common/formCreater/CustomeFormCreater";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  addAwrRequest,
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchInvoiceDetailsRequest,
  fetchMarkRequest,
  fetchSaleProgramListRequest,
  fetchSubTeaTypeRequest,
  fetchWarehouseUserRequest,
  teaTypeAction,
  uploadSampleShortageRequest,
} from "../../../../../store/actions";
import { fetchSaleNumbersRequest } from "../../../../../store/actions/createdSaleNo/CreatedSaleNo";
import { useFormik } from "formik";
import axios from "axios";
import { setRef } from "@mui/material";
import FileUpload from "../../../../../components/common/uploadFile/FileUpload";
import { readFileAndCheckHeaders } from "../../../../../components/common/uploadFile/utils";
import { useRef } from "react";
import TableComponent from "../../../../../components/tableComponent/TableComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosMain from "../../../../../http/axios/axios_main";
import CustomToast from "../../../../../components/Toast";
import { useAuctionDetail } from "../../../../../components/common/AunctioneerDeteailProvider";
import formatDateToDdMmYy from "../../../../../components/common/dateAndTime/convertToDate";

import PrintInvoice from "../../../../../components/common/Print/print";
import Modals from "../../../../../components/common/Modal";

const currentDate = new Date().toISOString()?.split("T")[0];

// Get the current year
const currentYear = new Date().getFullYear();

const currentWeek = Math.ceil(
  ((currentDate - new Date(currentYear, 0, 4)) / 86400000 + 1) / 7
);

const validationSchema = Yup.object().shape({
  gatePassQuantity: Yup.number().required("Gate Pass Quantity is required"),
  // awrRefNo: Yup.string().required("AWR Ref No is required"),
  arrivalDate: Yup.date().required("Arrival Date is required"),
  // awrDate: Yup.date().required("AWR Date is required"),
  catalogClosingDate: Yup.date().required("Catalog Closing Date is required"),
  invoiceDate: Yup.date().required("Invoice Date is required"),
  //  gpNumber: Yup.number().required("GP Number is required").typeError("GP Number must be a number"),
  //  gpDate: Yup.date().required("GP Date is required"),
});

// const handleSubmit = (fromData) => {
//   // setUploadedData(fromData);
//   const data = {
//     season: fromData.season,
//     saleNo: fromData.saleNo,
//     gpQty: 800,
//     awrReferenceNo: fromData.awrReferenceNo,
//     markId: fromData.mark,
//     wareHouseUserRegId: fromData.wareHouseUserRegId,
//     arrivalDate: fromData.arrivalDate,
//     awrDate: fromData.awrDate,
//     catalogClosingDate: fromData.catalogClosingDate,
//     invoiceDate: fromData.invoiceDate,
//     factoryName: fromData.factoryName,
//     gradeId: fromData.gradeId,
//     awrInvoices: fromData.awrInvoices,
//   };
//   console.log(data);
// };
const initialValues = {
  season: currentYear?.toString(),
  saleNo: "",
  SaleProgramId: 0,
  gatePassQuantity: null,
  awrRefNo: "",
  mark: "",
  warehouse: "",
  arrivalDate: "",
  awrDate: "",
  catalogClosingDate: "",
  invoiceDate: "",
  manufacture: "",
  grade: 0,
  gpNo: "",
  gpDate: "",
  awrInvoices: [],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".xls", ".xlsx"];

function AWRForm({
  isDisabled,
  setExpandedTab,
  actionData,
  currentDate,
  modalRight,
}) {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
    auction,
    auctioneerCode,
    auctionTypeMasterCode,
  } = useAuctionDetail();

  const [auctionType, setAuctionType] = useState(auction);
  const [auctionTypeCode, setAuctionTypeCode] = useState(auctionTypeMasterCode);
  const baseUrlEngn =
    auction === "ENGLISH" ? "EnglishAuctionAWRDetails" : "AWRDetails";
  const [baseUrlEng, setbaseUrlEng] = useState(baseUrlEngn);
  const [uploadedData, setUploadedData] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [saleNo, setSaleNo] = useState([]);
  const [subTeaTypeNo, setSubTeaTypeNo] = useState([]);
  const [catagory, setCategory] = useState([]);
  const [saleprogram, setsaleprogrm] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [handleChnage, setHandleChnage] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [invoiceDataList, setInvoiceDataList] = useState([]);
  const [sampleList, setSampleList] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [validationData, setValidationData] = useState([]);
  const fileInputRef = useRef(null);
  const [propertyNameList, setPropertyNameList] = useState([]);
  const [checked, setChecked] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [allCheked, setAllChacked] = useState(false);
  const [openPrintModel, setopenPrintModel] = useState(false);
  const [printrow, setprintrow] = useState([]);
  const [AwrPrintArr, setAwrPrintArr] = useState([]);
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      setPropertyNameList(propertyNames);

      const {
        arrivalDate,
        awrdDate,
        awrRefNo,
        gatePassQuantity,
        SaleProgramId,
      } = values;
      let awrData = {
        season: values.season,
        saleNo: parseInt(values.saleNo),
        invoiceDate: values.invoiceDate,
        SaleProgramId: SaleProgramId,
        arrivalDate:
          invoiceDataList?.at(0).arrivalDate !== null
            ? invoiceDataList?.at(0)?.arrivalDate?.split("T")?.at(0)
            : arrivalDate,
        awrDate:
          invoiceDataList?.at(0).awrDate !== null
            ? invoiceDataList?.at(0)?.awrDate?.split("T")?.at(0)
            : awrdDate,
        awrRefNo: awrRefNo,
        gatePassQuantity: gatePassQuantity,
        createdBy: userId,
        updatedBy: userId,
        packageType: "15",
        gradeId: parseInt(formik.values.grade),
        auctionCenterId: auctionCenterId,
        auctioneerId: userId,
        Auctioneer: auctioneerCode,
      };

      const data = invoiceDataList?.map((ele) => {
        return {
          ...ele,
          ...awrData,
        };
      });
      console.log(data, "555");
      formik.values.gatePassQuantity = "";
      setTableData(data);
      // formik.resetForm();
      setHandleChnage(true);
    },
    validateOnBlur: false, // Disable validation on blur
    validateOnChange: false, // Disable validation on change
    // validateOnBlur: true,
    isInitialValid: true,
  });

  const dispatch = useDispatch();

  const teaType = useSelector(
    (state) => state.teaType.teaTypeList.responseData
  );
  const subTeaType = useSelector((state) => state.teaType.data.responseData);

  const markList = useSelector((state) => state.mark.data.responseData);
  const warehouseUsersList = useSelector(
    (state) => state.warehouseUser.data.responseData
  );
  const grades = useSelector((state) => state.grade.data.responseData);

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const category = useSelector((state) => state?.category?.data?.responseData);

  const invoiceData = useSelector(
    (state) => state?.invoiceDetails?.data?.responseData
  );

  console.log(invoiceData, "invoiceData");

  useEffect(() => {
    dispatch(teaTypeAction({ auctionCenterId }));
    dispatch(fetchMarkRequest({ auctionCenterId }));
    dispatch(fetchWarehouseUserRequest({ auctionCenterId }));
    dispatch(fetchGradeRequest({ auctionCenterId }));
    // dispatch(fetchSaleProgramListRequest(saleData));
    dispatch(
      fetchCategoryRequest({
        teaTypeId: parseInt(formik.values.teaType),
        auctionCenterId,
      })
    );
    dispatch(fetchSaleNumbersRequest(formik.values.season));
    const today = new Date();

    // Format today's date to YYYY-MM-DD
    const formattedDate = today.toISOString().split("T")[0];
    console.log(formattedDate);
    formik.setFieldValue(
      "awrdDate",
      actionData?.at(0)?.awrDate !== undefined
        ? actionData?.at(0)?.awrDate
        : formattedDate
    );
    formik.setFieldValue(
      "arrivalDate",
      actionData?.at(0)?.awrDate !== undefined
        ? actionData?.at(0)?.awrDate
        : formattedDate
    );
    formik.values.arrivalDate =
      actionData?.at(0)?.awrDate !== undefined
        ? actionData?.at(0)?.awrDate
        : formattedDate;
  }, []);

  useEffect(() => {
    if (formik.values.awrDate === "") {
      const today = new Date();

      // Format today's date to YYYY-MM-DD
      const formattedDate = today.toISOString().split("T")[0];
      // console.log(formattedDate);
      formik.setFieldValue(
        "awrdDate",
        actionData?.at(0)?.awrDate !== undefined
          ? actionData?.at(0)?.awrDate
          : formattedDate
      );
      formik.values.awrdDate =
        actionData?.at(0)?.awrDate !== undefined
          ? actionData?.at(0)?.awrDate
          : formattedDate;
    }
  }, [formik.values.awrdDate]);

  useEffect(() => {
    formik.setFieldValue("awrdDate", currentDate);
    setTableData([]);
    setSelectedData([]);
  }, [currentDate]);

  useEffect(() => {
    const today = new Date();

    // Format today's date to YYYY-MM-DD
    const formattedDate = today.toISOString().split("T")[0];
    console.log(formattedDate);
    // formik.setFieldValue("arrivalDate", formattedDate);
  }, [formik.values.arrivalDate]);

  useEffect(() => {
    setTeaTeatypeList(teaType);
    setMarkDataList(markList);
    setWarehouseUserList(warehouseUsersList);
    setGradesList(grades);
    setSaleNo(saleNumber);
    setSubTeaTypeNo(subTeaType);
    setCategory(category);

    //set value
    if (markList?.length > 0) {
      formik.setFieldValue("mark", markList[0]?.markId);
    }
    if (warehouseUsersList?.length > 0) {
      formik.setFieldValue(
        "warehouse",
        warehouseUsersList[0]?.wareHouseUserRegId
      );
    }
    if (grades?.length > 0) {
      formik.setFieldValue("grade", grades[0]?.gradeId);
    }
  }, [
    teaType,
    subTeaType,
    markList,
    warehouseUsersList,
    grades,
    saleNumber,
    category,
  ]);
  const handlePrint = () => {
    window.print();
  };
  useEffect(() => {
    console.log(
      actionData,
      markDataList
        ?.filter((ele) => ele.markId === actionData?.at(0)?.markId)
        ?.at(0)?.markCode
    );
    // formik.setValues({
    //   season: actionData?.at(0)?.season,
    //   saleNo: actionData?.at(0)?.saleNo,
    //   SaleProgramId: 0,
    //   gatePassQuantity: actionData?.at(0)?.gpQty,
    //   awrRefNo: actionData?.at(0)?.awrReferenceNo,
    //   mark: actionData?.at(0)?.markId,
    //   warehouse: actionData?.at(0)?.wareHouseUserRegId,
    //   arrivalDate: actionData?.at(0)?.arrivalDate,
    //   awrdDate: actionData?.at(0)?.awrdDate,
    //   catalogClosingDate: actionData?.at(0)?.catalogClosingDate,
    //   invoiceDate: actionData?.at(0)?.invoiceDate,
    //   manufacture:"",
    //   grade: actionData?.at(0)?.gradeId,
    // });
    if (isDisabled) {
      formik.setFieldValue("seson", actionData?.at(0)?.season);
      formik.setFieldValue("saleNo", actionData?.at(0)?.saleNo);
      formik.setFieldValue("gatePassQuantity", actionData?.at(0)?.gpQty);
      formik.setFieldValue("awrRefNo", actionData?.at(0)?.awrReferenceNo);
      formik.setFieldValue(
        "mark",
        markDataList
          ?.filter((ele) => ele.markId === actionData?.at(0)?.markId)
          ?.at(0)?.markCode
      );
      formik.setFieldValue(
        "warehouse",
        warehouseUserList
          ?.filter(
            (ele) =>
              ele.wareHouseUserRegId === actionData?.at(0)?.wareHouseUserRegId
          )
          ?.at(0)?.wareHouseCode
      );
      formik.setFieldValue("arrivalDate", actionData?.at(0)?.arrivalDate);
      formik.setFieldValue("awrDate", actionData?.at(0)?.awrDate);
      formik.setFieldValue(
        "catalogClosingDate",
        actionData?.at(0)?.catalogClosingDate
      );
      formik.setFieldValue("invoiceDate", actionData?.at(0)?.invoiceDate);

      setTableData(actionData?.at(0)?.awrInvoices);
    }
  }, [actionData]);

  const handleCheckboxChange = (id) => {
    const isChecked = selectedData.some((item) => item.invoiceId === id);

    if (isChecked) {
      // If the checkbox is checked, remove the data from selectedData
      setSelectedData(selectedData.filter((item) => item.invoiceId !== id));
      // setAllChacked(selectedData.length === data.length ? true:false);
    } else {
      // If the checkbox is unchecked, add the data to selectedData
      const data2 = tableData.find((item) => item.invoiceId === id);
      setSelectedData([...selectedData, data2]);
      // setAllChacked(selectedData.length === data.length ? true:false);
    }
  };
  useEffect(() => {
    const seasondata = {
      season: formik.values.season.toString(),
      auctionCenterId: auctionCenterId,
    };
    axiosMain
      .post(`/preauction/Common/BindSaleNoBySeason`, seasondata)
      .then((res) => {
        setSaleNo(res.data.responseData);
        formik.setFieldValue("saleNo", res.data.responseData?.at(0).saleNo);
      })
      .catch((err) => console.log(err));
  }, [formik.values.season]);

  const ExecelpropertyNames = [
    {
      name: "Mark",
      title: "Mark",
    },
    { name: "season", title: "Season" },
    {
      name: "TeaType",
      title: "Tea Type",
    },
    { name: "saleNo", title: "Sale No" },
    {
      name: "Warehouse",
      title: "Warehouse User Registration",
    },
    // { name: "auctioneerId", title: "Auctioneer ID" },
    {
      name: "Category",
      title: "Category",
    },
    { name: "manufactureFromDate", title: "Manufacture From Date" },
    { name: "manufactureToDate", title: "Manufacture To Date" },
    { name: "dateOfDispatch", title: "Date of Dispatch" },
    { name: "invoiceDate", title: "Invoice Date" },
    { name: "carrier", title: "Carrier" },
    { name: "lorryReceiptNo", title: "Lorry Receipt Number" },
    { name: "lorryNo", title: "Lorry Number" },
    { name: "invoiceNo", title: "Invoice Number" },
    { name: "arrivalDate", title: "Arrival Date" },
    { name: "awrDate", title: "AWR Date" },
    { name: "awrReferenceNo", title: "AWR Reference Number" },
    {
      name: "SubTeaType",
      title: "Sub Tea Type",
    },
    {
      name: "Grade",
      title: "Grade",
    },
    {
      name: "packageType",
      title: "Package Type",
      getCellValue: ({ ...row }) => <span>Paper sacks</span>,
    },
    {
      name: "packageSize",
      title: "Package Size",
      getCellValue: ({ ...row }) => <span> 27x21x11</span>,
    },
    { name: "packageNo", title: "Package Number" },
    { name: "totalPackages", title: "Total Packages" },
    { name: "grossKgs", title: "Gross Kgs" },
    { name: "tareKgs", title: "Tare Kgs" },
    { name: "netKgs", title: "Net Kgs" },
    { name: "totalNetKgs", title: "Total Net Kgs" },
    { name: "gpNo", title: "GP Number" },
    { name: "gpDate", title: "GP Date" },
    { name: "shortExcessWeight", title: "Short Excess Weight" },
    { name: "locationInsideWarehouse", title: "Location Inside Warehouse" },
    // {
    //   name: "isActive",
    //   title: "Is Active",
    //   getCellValue: ({ ...row }) => (
    //     <span>{row.isActive == true ? "true" : "false"}</span>
    //   ),
    // },
    // { name: "createdBy", title: "Created By" },
    { name: "invoiceQty", title: "Invoice Qty" },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
  ];
  useEffect(() => {
    formik.setFieldValue("awrInvoices", invoiceData || []);
  }, [invoiceData]);

  // useEffect(() => {
  //   if (formik.values.awrdDate !== "") {
  //     if (isDisabled === false) {
  //       const parsedDate1 = new Date(formik.values.awrdDate);
  //       const parsedDate2 = new Date(formik.values.catalogClosingDate);
  //       if (parsedDate1 <= parsedDate2) {
  //         formik.setFieldValue("awrdDate", formik.values.awrdDate);
  //       } else {
  //         formik.setFieldValue("awrdDate", "");
  //         CustomToast.error(
  //           "Arrival Date must me lessthen catlog closing date"
  //         );
  //       }
  //     }
  //   } else {
  //     formik.setFieldValue("awrdDate", "");
  //   }
  // }, [formik.values.awrdDate]);

  useEffect(() => {
    // console.log(formik.values.warehouse, "formik.values.warehouse");
    if (formik.values.mark !== "") {
      axiosMain
        .post(`/admin/factory/dropdown/getFactory`, {
          markId: parseInt(formik.values.mark),
          auctionCenterId,
        })
        .then((response) => {
          response.data.responseData?.map((ele) =>
            formik.setFieldValue("manufacture", ele.factoryName)
          );
        })
        .catch((err) => console.log(err));
    } else {
      console.log("Mark is missing");
    }
  }, [formik.values.mark]);

  useEffect(() => {
    console.log("api cal");
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (saleNo !== "") {
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season,
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          setbaseUrlEng(
            response?.data?.responseData[0]?.auctionTypeCode === "BHARAT"
              ? "AWRDetails"
              : "EnglishAuctionAWRDetails"
          );
          // Handle the API response here
          formik.setFieldValue(
            "catalogClosingDate",
            response?.data?.responseData[0]?.catalogClosingDate?.split("T")[0]
          );
          formik.setFieldValue(
            "SaleProgramId",
            response?.data?.responseData[0]?.SaleProgramId
          );
        })
        .catch((error) => {
          // Handle errors here
        });

      // Cleanup function, in case you need to cancel the request
      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo, formik.values.season]);

  function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let i = currentYear; i > currentYear - 7; i--) {
      options.push({ label: i, value: i });
    }

    return options;
  }

  // const handleFileUpload = (e) => {
  //   const { values, handleChange, handleSubmit, errors: formikErrors } = formik;

  //   const files = Array.from(e.target.files);
  //   const validFiles = files.filter(
  //     (file) =>
  //       file.type === "application/vnd.ms-excel" ||
  //       file.type ===
  //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //   );

  //   if (validFiles.length > 0) {
  //     setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       fileUpload: null,
  //     }));
  //   } else {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       fileUpload: "Please select valid Excel files",
  //     }));
  //   }
  // };

  const fields = [
    {
      label: "Season",
      name: "season",
      type: isDisabled ? "disable" : "select",
      options: generateYearOptions(),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Sale No",
      name: "saleNo",
      type: isDisabled ? "disable" : "select",
      options: saleNo?.map((ele) => {
        return { label: ele.saleNo, value: ele.saleNo };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Gate Pass Quantity",
      name: "gatePassQuantity",
      type: isDisabled ? "disable" : "disable",
      required: true,
      className: "FormGroup",
    },
    {
      label: "AWR Ref No",
      name: "awrRefNo",
      type: "disable",
      required: true,
      className: "FormGroup",
    },
    {
      label: "MARK",
      name: "mark",
      type: isDisabled ? "disable" : "select",
      options: markDataList?.map((ele) => {
        return { label: ele.markCode, value: ele.markId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Warehouse",
      name: "warehouse",
      type: isDisabled ? "disable" : "select",
      options: warehouseUserList?.map((ele) => {
        return { label: ele.wareHouseCode, value: ele.wareHouseUserRegId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Arrival Date",
      name: "arrivalDate",
      type: isDisabled ? "disable" : "datepicker",
      required: true,
      className: "FormGroup",
    },
    {
      label: "AWR Date",
      name: "awrdDate",
      type: isDisabled ? "disable" : "disableDatePicker",
      required: true,
      className: "FormGroup",
    },
    {
      label: "Catalog Closing Date",
      name: "catalogClosingDate",
      type: isDisabled ? "disable" : "disable",
      value: formik.values.catalogClosingDate,
      required: true,
      className: "FormGroup",
    },
    {
      label: "Invoice Date",
      name: "invoiceDate",
      type: isDisabled ? "disable" : "datepicker",
      required: true,
      className: "FormGroup",
    },
    {
      label: "Manufacture",
      name: "manufacture",
      type: isDisabled ? "disable" : "disable",
      value: formik.values.manufacture,
      required: false,
      className: "FormGroup",
    },
    {
      label: "Grade",
      name: "grade",
      type: isDisabled ? "disable" : "select",
      options: gradesList?.map((ele) => {
        return { label: ele.gradeCode, value: ele.gradeId };
      }),
      required: false,
      className: "FormGroup",
    },
  ];

  const handleButtonClick = () => {
    formik.handleReset();
    setHandleChnage(false); // Reset the "handleChange" flag as well
    setPropertyNameList(ExecelpropertyNames);

    fileInputRef.current.click();
  };
  const handleDownload = () => {
    let documentName = "SampleAwr.xlsx";

    axiosMain
      .post(
        `/preauction/${baseUrlEng}/DownloadAwrSampleExcel?role=` + roleCode,
        {
          auctionCenterId: auctionCenterId,
          Season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          auctioneerId: userId,
          markId: formik.values.mark === "" ? 0 : parseInt(formik.values.mark),
          wareHouseUserRegId:
            formik.values.warehouse === ""
              ? 0
              : parseInt(formik.values.warehouse),
          awrReferenceNo: formik.values.awrNo,
          grade: formik.values.grade === "" ? 0 : parseInt(formik.values.grade),
        }
        // rows?.map((ele) => {
        //   return { LotNo: ele.LotNo };
        // })
      )
      .then((res) => {
        let documentBytes = res?.data?.responseData[0]?.byteDatas;

        // Decode base64 encoded documentBytes
        const decodedBytes = atob(documentBytes);

        // Create a Blob from the decoded bytes
        const blob = new Blob([
          new Uint8Array([...decodedBytes].map((char) => char.charCodeAt(0))),
        ]);

        // Create an object URL from the Blob
        const blobUrl = URL.createObjectURL(blob);

        // Create a hidden anchor element
        const anchor = document.createElement("a");
        anchor.style.display = "none";
        anchor.href = blobUrl;
        anchor.download = documentName;

        // Append anchor to the body
        document.body.appendChild(anchor);

        // Programmatically click the anchor element
        anchor.click();

        // Clean up: remove the anchor and revoke the object URL
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => console.log(err));
  };
  const handleFileUpload = (e) => {
    const files = e.target.files;

    for (const file of files) {
      const fileSize = file.size;
      const fileName = file.name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );

      if (!ALLOWED_EXTENSIONS.includes("." + fileExtension.toLowerCase())) {
        CustomToast.error(
          `File '${fileName}' is not allowed. Only Excel files are accepted.`
        );
      } else if (fileSize > MAX_FILE_SIZE) {
        CustomToast.error(
          `File '${fileName}' exceeds the maximum allowed size of 10 MB.`
        );
      } else {
        const promises = Array.from(files).map((file) =>
          readFileAndCheckHeaders(file)
        );

        Promise.allSettled(promises).then((results) => {
          const fulfilledResults = results.filter(
            (result) => result.status === "fulfilled"
          );
          const dataFromFiles = fulfilledResults.map((result) => result.value);

          handleData(dataFromFiles);
        });
      }
    }
  };

  const handleFileRemove = (index) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };
  const propertyName = [
    "inspectionchgs",
    "lotno",
    "packageno",
    "reinspectionchgs",
    "samplewt",
    "shortwt",
  ];

  function fixKeyNames(obj) {
    const newObj = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        let fixedKey = key.replace("/", "_"); // Replace '/' with '_'
        fixedKey = fixedKey.replace(".No", "No");
        newObj[fixedKey] = obj[key];
      }
    }

    return newObj;
  }

  // function excelDateToJSDate(excelDate) {
  //   console.log(excelDate,"excelDate")
  //   const MS_PER_DAY = 24 * 60 * 60 * 1000; // Milliseconds per day
  //   const excelStartDate = new Date(1900, 0, 1); // Excel date system starts from January 1, 1900
  //   const excelDays = excelDate - 1; // Excel date is 1-based

  //   const jsTimestamp = excelStartDate.getTime() + excelDays * MS_PER_DAY;
  //   const jsDate = new Date(jsTimestamp);

  //   const day = jsDate.getDate().toString().padStart(2, "0");
  //   const month = (jsDate.getMonth() + 1).toString().padStart(2, "0");
  //   const year = jsDate.getFullYear();

  //   return `${year}-${month}-${day}`;
  // }
  function excelDateToJSDate(excelDate) {
    const MS_PER_DAY = 24 * 60 * 60 * 1000; // Milliseconds per day
    const excelStartDate = new Date(1899, 11, 30); // Adjusted start date (Excel epoch is one day ahead)
    const excelDays = excelDate; // Excel date is 1-based

    const jsTimestamp = excelStartDate.getTime() + excelDays * MS_PER_DAY;
    const jsDate = new Date(jsTimestamp);

    const day = jsDate.getDate().toString().padStart(2, "0");
    const month = (jsDate.getMonth() + 1).toString().padStart(2, "0");
    const year = jsDate.getFullYear();

    return isNaN(year) ? "" : `${year}-${month}-${day}`;
  }

  function netKagesCalculation(gross, tare) {
    if (gross > tare) {
      return gross - tare;
    } else {
      CustomToast.error(
        "Tare KGs cannot be greater than or equal to Gross KGs"
      );
    }
  }
  const totalPackagesCalculation = (pkgNo) => {
    const firstValue = parseInt(pkgNo?.split("-")[0]);
    const secondValue = parseInt(pkgNo?.split("-")[1]);
    console.log(pkgNo, firstValue - secondValue, "pkgNopkgNo");
    if (firstValue > secondValue) {
      CustomToast.error("package from has to be greater than package to.");
    } else {
      let result = secondValue - firstValue;
      if (result + 1 <= 0) {
        CustomToast.error("package from has to be greater than zero.");
      } else {
        return result + 1;
      }
    }
  };
  function totalNetKagesCalculation(totalPackage, netKags, sampleQty) {
    const result = totalPackage * netKags;

    return result - sampleQty;
  }
  const handleData = async (uploadedData) => {
    try {
      const updatedFileData = [];
      // if (fileData.length > 0) {
      uploadedData.map(({ fileName, data }, index) => {
        if (data && data.length > 0) {
          const filteredData = data.filter((obj) => {
            // Check if any key in the object has a defined value
            return Object.values(obj).some((value) => value !== undefined);
          });

          const dataList = filteredData.map((ele) => {
            const {
              arrivalDate,
              auctioneerCode,
              awrDate,
              carrier,
              category,
              dateOfDispatch,
              gpDate,
              gpNo,
              grade,
              grossKgs,
              invNo,
              invoiceDate,
              locationInsideWarehouse,
              lorryNo,
              lorryReceiptNo,
              mark,
              netKgs,
              packageNos,
              packageSize,
              packageType,
              periodOfManufactureFrom,
              periodOfManufactureTo,
              saleNo,
              season,
              subType,
              tareKgs,
              teaType,
              // auctioneerCode,
              totalNetKgs,
              totalPackages,
              warehouseAddress,
              short_excessWeight,
              warehouseCode,
              warehouseName,
            } = fixKeyNames(ele);

            let data = {
              markId: 0,
              season: season?.toString(),
              teaTypeId: 0,
              saleNo: parseInt(saleNo),
              SaleProgramId: "",
              wareHouseUserRegId: 0,
              auctioneerId: userId, //auctioner
              categoryId: 0,
              manufactureFromDate: excelDateToJSDate(periodOfManufactureFrom),
              manufactureToDate: excelDateToJSDate(periodOfManufactureTo),
              dateOfDispatch: excelDateToJSDate(dateOfDispatch),
              invoiceDate: excelDateToJSDate(invoiceDate),
              carrier: carrier?.toString(),
              lorryReceiptNo: lorryReceiptNo?.toString(),
              lorryNo: lorryNo?.toString(),
              invoiceNo: invNo.toString(),
              arrivalDate: excelDateToJSDate(arrivalDate),
              awrDate: excelDateToJSDate(awrDate),
              awrReferenceNo: null,
              subTeaTypeId: 0,
              gradeId: 0,
              // parseInt(grade) === 0
              //   ? gradesList?.at(0)?.gradeId
              //   : parseInt(grade),
              packageType: packageType.toString(),
              packageSize: packageSize.toString(),
              packageNo: packageNos.toString(),
              totalPackages: totalPackagesCalculation(packageNos.toString()),
              grossKgs: grossKgs,
              tareKgs: tareKgs,
              netKgs: netKagesCalculation(
                grossKgs,
                tareKgs
              ),
              totalNetKgs: totalNetKagesCalculation(
                totalPackagesCalculation(packageNos.toString()),
                netKagesCalculation(grossKgs, tareKgs),
                0
              ),
              invoiceQty: totalNetKagesCalculation(
                totalPackagesCalculation(packageNos.toString()),
                netKagesCalculation(grossKgs, tareKgs),
                0
              ),
              gpNo:
                gpNo === "" || gpNo === undefined
                  ? ""
                  : Number.isInteger(gpNo)
                    ? parseInt(gpNo)
                    : typeof gpNo === "number"
                      ? parseFloat(gpNo)
                      : gpNo,
              gpDate: excelDateToJSDate(gpDate),
              shortExcessWeight: short_excessWeight,
              locationInsideWarehouse:
                locationInsideWarehouse === undefined ||
                  locationInsideWarehouse === ""
                  ? ""
                  : locationInsideWarehouse.toString(),
              isActive: true,
              createdBy: userId, //auctioner
              updatedBy: userId, //auctioner
              SampleQty: 0,
              DataFlag: "Excel",
              TeaType: teaType,
              Category: category,
              Grade: grade.toString(),
              Mark: mark,
              SubTeaType: subType,
              Warehouse: warehouseCode,
              Auctioneer: auctioneerCode,
              auctionCenterId: auctionCenterId,
            };

            return data;
          });

          // if (
          //   dataList
          //     .map(
          //       (ele) =>
          //         // Number.isInteger(ele.gpNo) === true)
          //         (typeof ele.gpNo === "number") === true
          //     )
          //     .includes(false)
          // ) {
          //   CustomToast.error("Please enter valid GP NO.");
          // } else {
          //   if (dataList.some((ele) => ele.gpDate !== "")) {
          //     updatedFileData.push(dataList);
          //   } else {
          //     CustomToast.error("Please enter valid GP Date.");
          //   }
          // }
          updatedFileData.push(dataList);
          // updatedFileData.push(filteredData);
        } else {
          // Handle the case where the data array is empty
          CustomToast.error(`No data found in file '${fileName}'`);
        }
      });
      // } else {
      //   CustomToast.error(`No file found in fields`);
      // }
      const mergedArray = updatedFileData.reduce((result, currentArray) => {
        return result.concat(currentArray);
      }, []);
      console.log(updatedFileData?.at(0), "updatedFileData");

      allData(mergedArray);
    } catch (error) {
      CustomToast.error(error);
    }
    // validation(uploadedData);
  };

  const allData = (dataList) => {
    if (dataList.length > 0) {
      const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

      // Data to be sent in the POST request

      // Making the POST request using Axios
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(dataList?.at(0)?.saleNo),
          season: dataList?.at(0)?.season.toString(),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          setbaseUrlEng(
            response?.data?.responseData[0]?.auctionTypeCode === "BHARAT"
              ? "AWRDetails"
              : "EnglishAuctionAWRDetails"
          );
          // Handle the API response here
          // setsaleprogrmId();
          // console.log(
          //   dataList.filter(
          //     (ele) =>
          //     (ele.SaleProgramId =
          //       response?.data?.responseData[0]?.SaleProgramId)
          // ),
          //   "response?.data?.responseData[0]?.SaleProgramId"
          // );

          // let data = dataList.filter(
          //   (ele) =>
          //     (ele.SaleProgramId =
          //
          // );

          // item.SaleProgramId = ;
          if (fileData?.length > 0) {
            setFileData([
              ...fileData,
              ...dataList.map((ele) => ({
                ...ele,
                SaleProgramId: response?.data?.responseData[0]?.SaleProgramId,
              })),
            ]);
          } else {
            setFileData([
              ...dataList.map((ele) => ({
                ...ele,
                SaleProgramId: response?.data?.responseData[0]?.SaleProgramId,
              })),
            ]);
          }
          // console.log(
          //   response?.data?.responseData[0]?.SaleProgramId,
          //   "response?.data?.responseData[0]?.SaleProgramId)"
          // );
          document.getElementById("file-upload").value = "";
        })
        .catch((error) => {
          // Handle errors here
          console.log(error);
        });
      // const data = dataList.map((item) => {});

      // console.log(data, dataList, "dataF");
    }
  };

  const validation = async (uploadedData) => {
    const updatedFileData = [];
    if (fileData.length > 0) {
      for (const { fileName, data } of uploadedData) {
        if (data && data.length > 0) {
          const missingProperties = propertyName.filter((propertyName) => {
            return !data.some((obj) => propertyName in obj);
          });

          const filteredData = data.filter((obj) => {
            // Check if any key in the object has a defined value
            return Object.values(obj).some((value) => value !== undefined);
          });

          if (missingProperties.length === 0 && filteredData.length > 0) {
            // console.log(`All properties are present in file '${fileName}'`);
            CustomToast.success(
              `All properties are present in file ${fileName}`
            );
            updatedFileData.push(filteredData);
            // Continue with processing the data
            // ... rest of your code ...
          } else {
            // console.log(
            //   `Missing properties in file '${fileName}':`,
            //   missingProperties
            // );

            // Handle the case where properties are missing
            CustomToast.error(
              `Missing properties in file '${fileName}': ${missingProperties.join(
                ", "
              )}`
            );
          }
        } else {
          // Handle the case where the data array is empty
          CustomToast.error(`No data found in file '${fileName}'`);
        }
      }
    } else {
      CustomToast.error(`No file found in fields`);
    }
    const mergedArray = updatedFileData.reduce((result, currentArray) => {
      return result.concat(currentArray);
    }, []);
    // console.log(mergedArray, "updatedFileData");

    setValidationData([...sampleList, ...mergedArray]);
  };

  const handleAddData = () => {
    // You can call this function when the "Add Data" button is clicked

    const fileInput = document.getElementById("fileInput");

    if (fileData?.length > 0 && validationData?.length > 0) {
      // handleData(/* Your uploaded data here */);
      fileInput.value = "";
      setSampleList(validationData);
      setFileData([]);
      CustomToast.success("Data added successfully!");
    } else {
      CustomToast.error("Data validation failed! Cannot add data.");
    }
  };

  function findDuplicateInvoiceNumbers(arrayOfObjects) {
    const invoiceNumbers = new Map();
    const duplicateInvoices = [];

    arrayOfObjects.forEach((obj) => {
      if (invoiceNumbers.has(obj.invoiceNo)) {
        duplicateInvoices.push(obj.invoiceNo);
      }
      invoiceNumbers.set(obj.invoiceNo, true);
    });

    return duplicateInvoices;
  }

  const propertyNames = [
    {
      name: "markId",
      title: "Mark",
      getCellValue: ({ ...row }) => (
        <span>
          {markDataList?.map((ele) =>
            ele.markId == row?.markId ? ele.markName : ""
          )}
        </span>
      ),
    },
    { name: "season", title: "Season" },
    {
      name: "teaType",
      title: "Tea Type ID",
      getCellValue: ({ ...row }) => (
        <span>
          {teaTypeList?.map((ele) =>
            ele.teaTypeId == row?.teaTypeId ? ele.teaTypeName : ""
          )}
        </span>
      ),
    },
    { name: "saleNo", title: "Sale No" },
    { name: "wareHouseUserRegId", title: "Warehouse User Registration ID" },
    // { name: "auctioneerId", title: "Auctioneer ID" },
    { name: "categoryId", title: "Category" },
    { name: "manufactureFromDate", title: "Manufacture From Date" },
    { name: "manufactureToDate", title: "Manufacture To Date" },
    { name: "dateOfDispatch", title: "Date of Dispatch" },
    { name: "invoiceDate", title: "Invoice Date" },
    { name: "carrier", title: "Carrier" },
    { name: "lorryReceiptNo", title: "Lorry Receipt Number" },
    { name: "lorryNo", title: "Lorry Number" },
    { name: "invoiceNo", title: "Invoice Number" },
    { name: "arrivalDate", title: "Arrival Date" },
    { name: "awrDate", title: "AWR Date" },
    { name: "awrReferenceNo", title: "AWR Reference Number" },
    { name: "subTeaTypeId", title: "Sub Tea Type" },
    { name: "gradeId", title: "Grade" },
    { name: "packageType", title: "Package Type" },
    { name: "packageSize", title: "Package Size" },
    { name: "packageNo", title: "Package Number" },
    { name: "totalPackages", title: "Total Packages" },
    { name: "grossKgs", title: "Gross Kgs" },
    { name: "tareKgs", title: "Tare Kgs" },
    { name: "netKgs", title: "Net Kgs" },
    { name: "totalNetKgs", title: "Total Net Kgs" },
    { name: "gpNo", title: "GP Number" },
    { name: "gpDate", title: "GP Date" },
    { name: "shortExcessWeight", title: "Short Excess Weight" },
    { name: "locationInsideWarehouse", title: "Location Inside Warehouse" },
    // {
    //   name: "isActive",
    //   title: "Is Active",
    //   getCellValue: ({ ...row }) => (
    //     <span>{row.isActive == true ? "true" : "false"}</span>
    //   ),
    // },
    // { name: "createdBy", title: "Created By" },
    { name: "invoiceQty", title: "Invoice Qty" },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
  ];

  const handleInputChange = (event, index, field) => {
    const newData = [...tableData];
    newData[index][field] = event.target.value;
    setTableData(newData);
  };

  const ActionArea = (row) => {
    // const indexs = invoiceData.indexOf(row.data.SaleProgramId);

    return (
      <>
        {/* <Button
          style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => {
            // handleAction("edit");
            formik.setValues(row.data);
          }}
        >
          <EditIcon />
        </Button> */}
        <Button
          className="action-btn"
          onClick={() => {
            // console.log(indexs, row.data, "invData");
            // setFileData(
            //   fileData.filter((ele) => ele.invoiceNo !== row.data.invoiceNo)
            // );
            console.log(fileData, tableData, row, "invData");
          }}
        >
          <DeleteIcon />
        </Button>
      </>
    );
  };
  const showcheckboxlebels = [

    {
      title: "tea Type",
      name: "teaType",
    },
    {
      title: "sub Type",
      name: "subType",
    },
    {
      title: "category",
      name: "category",
    },
    {
      title: "grade",
      name: "grade",
    },
    {
      title: "package Size",
      name: "packageSize",
    },
    {
      title: "package Type",
      name: "packageType",
    },
    {
      title: "package No",
      name: "packageNo",
    },
    {
      title: "total Packages",
      name: "totalPackages",
    },
    {
      title: "gross Kgs",
      name: "grossKgs",
    },
    {
      title: "tare Kgs",
      title: "tareKgs",
    },
    {
      title: "net Kgs",
      name: "netKgs",
    },
    {
      title: "total Net Kgs",
      name: "totalNetKgs",
    }
  ];

  const handleExportToPdf = () => {
    // const sourceDiv = sourceDivRef.current;
    // // const targetDiv = targetDivRef.current;

    // if (sourceDiv) {
    //   const pdfOptions = { margin: 10, filename: "Invoice_Export.pdf" };

    //   html2pdf(sourceDiv, pdfOptions);
    //   // html2pdf(targetDiv, pdfOptions);
    // }
    // const markval = formik.values.mark;
    // const markvalselectedText = markDataList.filter((item) => item.markId === markval)?.at(0).markName;

    // const subteatypeval = formik.values.subType;
    // const subTypeselectedText = subTeaTypeNo.filter((item) => item.subTeaTypeId === subteatypeval)?.at(0).subTeaTypeName;


    // const teaTypeNameval = formik.values.teaType;
    // const teaTypeNameselectedText = teaTypeList.filter((item) => item.teatypeid === teaTypeNameval)?.at(0).teaTypeName;

    // const auctioneerval = formik.values.auctioneerId;
    // const auctioneerselectedText = auctioneer.filter((item) => item.userId === auctioneerval)?.at(0).userCode;
    const AwrPrintArr = Object.keys(tableData[0]).filter((item) => (item === "gpDate" || item === "gpNo" || item === "invoiceNo" || item === "Origin" || item === "categoryName" || item === "teaTypeName" || item === "subTeaTypeName" || item === "markName" || item === "grossKgs" || item === "tareKgs"
      || item === "netKgs" || item === "packageNo" || item === "shortExcessWeight" || item === "dateOfDispatch" || item === "carrier" || item === "lorryReceiptNo" || item === "lorryNo")).map(key => {
        return {
          name: key,
          title: key.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase(), // Convert camelCase to Title Case
        };
      });
    setAwrPrintArr(AwrPrintArr);

    // var data = []
    // data?.push(formik.values);
    // var newobj = tableData?.map((item) => ({
    //   ...item
    // }))

    var newdat = tableData.map(obj => {
      for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
          obj[key] = "";
        }
      }
      return obj;
    });
    setprintrow(newdat);
    console.log(formik, newdat, "newdatnewdat");
    setopenPrintModel(true)
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <CustomeFormCreater
            fields={fields}
            pageName="AWR"
            initialValues={initialValues}
            validationSchema={validationSchema}
            // handleSubmit={() => handleSubmit()}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            handleFileRemove={handleFileRemove}
            formik={formik}
            Controlls={() => <></>}
            setHandleChnage={setHandleChnage}
          />
          {isDisabled ? (
            ""
          ) : (
            <div className="col-lg-12 mb-3">
              <div className="BtnGroup">
                <Button
                  onClick={() => {
                    if (selectedData?.length > 0) {
                      // let tableDatas = tableData?.map((ele) => {
                      //   ele.gpDate + "" + ele.gpNo;
                      // });
                      // tableData[0].gpDate = formik.values.gpDate;
                      // tableData[0].gpNo = formik.values.gpNo.toString();
                      // dispatch(addAwrRequest(tableData));
                      console.log(selectedData, "selectedData");

                      if (
                        selectedData
                          .map(
                            (ele) => ele.gpNo !== null && ele.gpDate !== null
                          )
                          .includes(false)
                      ) {
                        CustomToast.error(
                          "Enter valid GP Number and GP Date !"
                        );
                      } else {
                        axiosMain
                          .post(
                            `/preauction/${baseUrlEng}/UploadAWRDetails?role=` +
                            roleCode + `&saleNo=${formik.values.saleNo}`,
                            selectedData.map((ele) => {
                              //delete ele["userCode"];
                              return {
                                ...ele,
                                gpNo: parseFloat(ele.gpNo),
                                Auctioneer: ele.userCode,
                              };
                            })
                          )
                          // .post("/preauction/AWRDetails/UploadAWRDetails", tableData)
                          .then((res) => {
                            if (res.data.statusCode === 200) {
                              CustomToast.success(res.data.message);
                              setExpandedTab("panel1");
                              formik.resetForm();
                              setTableData([]);
                            } else {
                              CustomToast.info(res.data.message);
                            }
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }
                    } else {
                      CustomToast.error("Select Awr to create AWR");
                    }
                  }}
                  className="SubmitBtn"
                >
                  Create
                </Button>
                {/* <Button type="submit" className="SubmitBtn">
              Add
            </Button> */}
                <Button
                  className="SubmitBtn"
                  onClick={() => {
                    console.log(
                      formik.values.saleNo,
                      formik.values.mark,
                      formik.values.warehouse,
                      formik.values.invoiceDate,
                      "???"
                    );
                    if (
                      formik.values.saleNo !== null &&
                      formik.values.mark !== "" &&
                      formik.values.warehouse !== "" &&
                      formik.values.invoiceDate !== ""
                    ) {
                      axiosMain
                        .post(
                          `/preauction/${baseUrlEng}/GetInvoicesByAWRDetails?role=` +
                          roleCode,
                          {
                            season: formik.values.season,
                            saleNo:
                              formik.values.saleNo === ""
                                ? parseInt(currentWeek)
                                : parseInt(formik.values.saleNo),
                            markId: parseInt(formik.values.mark),
                            wareHouseUserRegId: parseInt(
                              formik.values.warehouse
                            ),
                            gradeId: parseInt(formik.values.grade),
                            invoiceDate: formik.values.invoiceDate,
                            auctioneerId: userId, //auctioner
                            auctionCenterId: auctionCenterId,
                          }
                        )
                        .then((res) => {
                          const data = res.data.responseData?.map(
                            (ele) => ele.totalWeight
                          );
                          // console.log(
                          //   ,"res"
                          // );

                          if (data?.length > 0) {
                            CustomToast.success("AWR Details Filled");

                            let gpq = data.reduce(
                              (accumulator, currentValue) => {
                                return accumulator + currentValue;
                              }
                            );
                            formik.setFieldValue("gatePassQuantity", gpq);
                            formik.setFieldValue(
                              "awrInvoices",
                              res.data.responseData
                            );
                            setInvoiceDataList(res.data.responseData);
                            formik.handleSubmit();
                            console.log(res.data.responseData, "555");
                          } else {
                            CustomToast.error("AWR Details Not Filled");
                          }
                        });
                    } else {
                      CustomToast.error(
                        "Please First fill those fields Sale No,Mark,WareHouse,Grade and Invoice Date"
                      );
                    }
                  }}
                >
                  Get AWR Detail
                </Button>
                {modalRight?.includes("7") && (
                  <button
                    type="button"
                    className="btn SubmitBtn me-2"
                    onClick={handleDownload}
                  >
                    Download Sample
                  </button>
                )}
                {/* <label className="btn SubmitBtn mr-2">
            <ImportExportIcon />
          </label> */}

                {/* <label htmlFor="fileUpload" className="btn SubmitBtn mr-2">
            <FileUploadIcon />
          </label> */}
                {/* <input
            type="file"
            className="form-control"
            id="fileUpload"
            accept=".xls, .xlsx"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            multiple
          /> */}
                {/* <label className="btn SubmitBtn">
            <PictureAsPdfIcon />
          </label> */}
              </div>
            </div>
          )}
          {/* <div className="col-md-6">
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>File Name</th>
                          <th>File Type</th>
                          <th>File Size</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadedFiles.map((file, index) => (
                          <tr key={index}>
                            <td>{file.name}</td>
                            <td>{file.type}</td>
                            <td>{Math.round(file.size / 1024)} KB</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleFileRemove(index)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div> */}
        </div>

        {/* <div className="row mt-3">
          <div className="col-md-12">
            <Card className="mt-3 FileUploadBox">
              <Card.Body>
                <Card.Title>File Upload</Card.Title>
                {/* <div className="row">
                  <div className="col-lg-auto">
                    <div className="FileUpload">
                      <FileUpload
                        id="fileInput"
                        handleData={handleData}
                        readFileAndCheckHeaders={readFileAndCheckHeaders}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="BtnGroup">
                      <Button
                        className="SubmitBtn"
                        onClick={() => handleAddData()}
                      >
                        Add
                      </Button>

                      <Button
                        className="SubmitBtn"
                        onClick={() => validation(fileData)}
                      >
                        Validate
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div> */}

        <div className="row">
          {modalRight?.includes("6") && (
            <div className="col-md-12 mt-3">
              <ul style={{ listStyle: "disc", padding: "1%" }}>
                <li>Any number of excel file can be uploaded. </li>
                <li> Maximum file size should not exceed {"<10>"} MB</li>
                <li>Acceptable file types: (*.xls and.xlsx)</li>
              </ul>
            </div>
          )}
          <div className="col-md-12 mt-3">
            <div className="row mt-3">
              <button
                className="SubmitBtn"
                type="button"
                onClick={() => setFileData([])}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="col-md-12 mt-3">
            <div className="row mt-3">
              {isDisabled
                ? ""
                : modalRight?.includes("6") && (
                  <div className="col-md-12">
                    <div class="browse-file FileUpload px-0">
                      {/* <FileUpload
              id="fileInput"
              handleData={handleData}
              readFileAndCheckHeaders={readFileAndCheckHeaders}
            /> */}
                      <button
                        className="SubmitBtn"
                        type="button"
                        onClick={handleButtonClick}
                      >
                        Browse
                      </button>

                      <input
                        type="file"
                        id="file-upload"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        multiple
                        accept=".xls,.xlsx"
                      />
                      <Button
                        className="SubmitBtn creat-btn"
                        onClick={() => {
                          if (fileData?.length > 0) {
                            // const toastMessages = fileData?.map((obj, index) => {
                            //   let rowNo = index + 1;
                            //   const fromDateParts =
                            //     obj.manufactureFromDate.split("-");
                            //   const toDateParts = obj.manufactureToDate.split("-");

                            //   const fromDate =
                            //     fromDateParts[2] +
                            //     "-" +
                            //     fromDateParts[1] +
                            //     "-" +
                            //     fromDateParts[0];
                            //   const toDate =
                            //     toDateParts[2] +
                            //     "-" +
                            //     toDateParts[1] +
                            //     "-" +
                            //     toDateParts[0];

                            //   // console.log(
                            //   //   obj.manufactureFromDate.split("-"),
                            //   //   fromDateParts[2]+"-"+fromDateParts[1]+"-"+fromDateParts[0],
                            //   //   new Date(toDate) >= new Date(fromDate),
                            //   //   // fromDate,
                            //   //   // obj.manufactureToDate,
                            //   //   // toDate,
                            //   //   "obj.manufactureFromDate,obj.manufactureToDate"
                            //   // );

                            //   const duplicates =
                            //     findDuplicateInvoiceNumbers(fileData);

                            //   // const isValid = validateMandatoryFields(
                            //   //   invoiceData,
                            //   //   propertyName
                            //   // );

                            //   if (duplicates.length > 0) {
                            //     CustomToast.error(
                            //       "Invoise No" +
                            //         " " +
                            //         duplicates.join(", ") +
                            //         " " +
                            //         "is already exist"
                            //     );
                            //     return false;
                            //   } else if (
                            //     obj.gpDate === null ||
                            //     obj.gpNo === null ||
                            //     obj.awrDate === null ||
                            //     obj.arrivalDate === null
                            //   ) {
                            //     CustomToast.error(
                            //       "Any AWR field is missing from gpdate,gpno,arrival date, awr date" +
                            //         rowNo
                            //     );
                            //   } else {
                            //     // console.log(
                            //     //   toastMessages,
                            //     //   "invoiceDatainvoiceDatainvoiceData"
                            //     // );\

                            //     return true;
                            //   }
                            // });
                            const toastMessages = fileData.map(
                              (obj, index) => {
                                let rowNo = index + 1;
                                const fromDateParts =
                                  obj.manufactureFromDate.split("-");
                                const toDateParts =
                                  obj.manufactureToDate.split("-");

                                const x = new Date(obj.manufactureFromDate);
                                const y = new Date(obj.manufactureToDate);
                                const fromDate =
                                  fromDateParts[2] +
                                  "-" +
                                  fromDateParts[1] +
                                  "-" +
                                  fromDateParts[0];
                                const toDate =
                                  toDateParts[2] +
                                  "-" +
                                  toDateParts[1] +
                                  "-" +
                                  toDateParts[0];

                                // console.log(
                                //   obj.manufactureFromDate.split("-"),
                                //   fromDateParts[2]+"-"+fromDateParts[1]+"-"+fromDateParts[0],
                                //   new Date(toDate) >= new Date(fromDate),
                                //   // fromDate,
                                //   // obj.manufactureToDate,
                                //   // toDate,
                                //   "obj.manufactureFromDate,obj.manufactureToDate"
                                // );

                                const duplicates =
                                  findDuplicateInvoiceNumbers(fileData);

                                // const isValid = validateMandatoryFields(
                                //   invoiceData,
                                //   propertyName
                                // );
                                if (y < x) {
                                  // debugger;

                                  CustomToast.error(
                                    "Greater than or equal to From Date. Row No  " +
                                    toDate +
                                    "<" +
                                    fromDate +
                                    rowNo
                                  );
                                  return false;
                                } else if (duplicates.length > 0) {
                                  CustomToast.error(
                                    "Invoise No" +
                                    " " +
                                    duplicates.join(", ") +
                                    " " +
                                    "is already exist"
                                  );
                                  return false;
                                } else {
                                  // console.log(
                                  //   toastMessages,
                                  //   "invoiceDatainvoiceDatainvoiceData"
                                  // );\
                                  // axiosMain
                                  //   .post(
                                  //     " /preauction/InvoiceDetails/AddInvoiceDetails",
                                  //     invoiceData
                                  //   )
                                  //   .then((response) => {
                                  //     if (response.data.statusCode === 204) {
                                  //       CustomToast.success("Invoice submitted successfully");
                                  //     }
                                  //     // Handle the response data or success
                                  //   })
                                  //   .catch((error) => {
                                  //     CustomToast.error("API call failed:", error);
                                  //     // Handle errors here
                                  //   });
                                  return true;
                                }
                              }
                            );

                            const allTrue = toastMessages.every(
                              (element) => element === true
                            );

                            if (allTrue) {
                              //
                              const checkGrossAndTeraKgs = fileData
                                ?.map(
                                  (ele) =>
                                    ele?.grossKgs?.toString()?.split(".")[1]
                                      ?.length <= 2
                                )
                                .map((ele, index) => ele === false && index + 1)
                                .filter((ele) => ele !== false);
                              const checkTeraKgs = fileData
                                ?.map(
                                  (ele) =>
                                    ele?.tareKgs?.toString()?.split(".")[1]
                                      ?.length <= 2
                                )
                                .map((ele, index) => ele === false && index + 1)
                                .filter((ele) => ele !== false);

                              const manadatory = [
                                "season",
                                "saleNo",
                                "Warehouse",
                                "Auctioneer",
                                "invoiceDate",
                                "invoiceNo",
                                "arrivalDate",
                                "awrDate",
                                "TeaType",
                                "SubTeaType",
                                "Category",
                                "Grade",
                                "packageType",
                                "packageNo",
                                "grossKgs",
                                "tareKgs",
                                "netKgs",
                                "gpNo",
                                "gpDate"
                                //"dateOfDispatch",
                              ];
                              let checkmanadatoryManadatory = manadatory
                                ?.map((item) =>
                                  fileData.map((ele) =>
                                    ele[item] === "" ? item : ""
                                  )
                                )
                                ?.reduce((acc, cur) => cur.concat(acc), [])
                                ?.filter((ele) => ele !== "");
                              let errorparam = manadatory
                                ?.map((item) =>
                                  fileData.map((ele) =>
                                    ele[item] === "" ? item : ""
                                  )
                                )
                                ?.reduce((acc, cur) => cur.concat(acc), [])
                                ?.filter((ele) => ele !== "")
                                .join();
                              if (
                                fileData
                                  .map(
                                    (ele) =>
                                      // Number.isInteger(ele.gpNo === "" ? 0 : ele.gpNo) === true ||
                                      (typeof (ele.gpNo === "" ? 0 : ele.gpNo) ===
                                        "number") ===
                                      true
                                  )
                                  .includes(false)
                              ) {
                                CustomToast.error("Please enter valid GP NO.");
                                return false;
                              } else if (checkmanadatoryManadatory.length > 0) {
                                CustomToast.error(errorparam + " are Mandatory");
                                return false;
                              }
                              else if (
                                checkGrossAndTeraKgs?.length > 0 &&
                                fileData
                                  ?.map(
                                    (ele) =>
                                      ele?.grossKgs?.toString()?.split(".")[1]
                                        ?.length <= 2
                                  )
                                  .filter((ele) => ele === false)?.length !==
                                fileData.length
                              ) {
                                // console.log(checkGrossAndTeraKgs);
                                CustomToast.error(
                                  "Please enter appropriate Gross KGs in row no. < " +
                                  checkGrossAndTeraKgs?.join(",") +
                                  " >"
                                );
                                // debugger;
                              } else if (checkTeraKgs?.length > 0 && fileData
                                ?.map(
                                  (ele) =>
                                    ele?.tareKgs?.toString()?.split(".")[1]
                                      ?.length <= 2
                                )
                                .filter((ele) => ele === false)) {
                                CustomToast.error(
                                  "Please enter appropriate Tare KGs in row no. < " +
                                  checkTeraKgs?.join(",") +
                                  " >"
                                );
                              }
                              //
                              console.log(
                                fileData,
                                "fileDatafileDatafileData"
                              );
                              axiosMain
                                .post(
                                  `/preauction/${baseUrlEng}/UploadAWRDetails?role=` +
                                  roleCode + `&saleNo=${fileData?.at(0)?.saleNo}`,
                                  fileData.map((item) => ({
                                    ...item,
                                    gpNo: item.gpNo === "" ? null : item.gpNo,
                                  }))
                                )
                                .then((response) => {
                                  if (response.data.statusCode === 200) {
                                    setFileData([]);
                                    CustomToast.success(
                                      response.data.message
                                    );
                                    setExpandedTab("panel1");
                                    formik.resetForm();
                                    setTableData([]);
                                  }
                                  if (response.data.statusCode === 403) {
                                    CustomToast.warning(
                                      response.data.message
                                    );
                                  }
                                  if (response.data.statusCode === 204) {
                                    CustomToast.warning(
                                      response.data.message
                                    );
                                  }
                                  // Handle the response data or success
                                })
                                .catch((error) => {
                                  CustomToast.error(
                                    "Something went wrong",
                                    error
                                  );
                                  // Handle errors here
                                });

                              // console.log(invoiceData, "datadatadata");
                            } else {
                              console.log("Not all elements are true.");
                            }

                            console.log(toastMessages, "toastMessages");
                          }
                        }}
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                )}
              {/* <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                
              </div>
              {/* <div className="col-md-6">
                <Button
                  className="SubmitBtn"
                  onClick={() => validation(fileData)}
                >
                  Validate
                </Button>
                <div
                  id="loader"
                  className="spinner-border text-light"
                  style={{ display: "none" }}
                ></div>
              </div> 
            </div>
          </div> */}
            </div>

            <div className="TableBox">
              {fileData?.length > 0 ? (
                <TableComponent
                  columns={propertyNameList}
                  rows={fileData}
                  setRows={setFileData}
                  dragdrop={false}
                  fixedColumnsOn={false}
                  resizeingCol={false}
                  selectionCol={true}
                  sorting={true}
                />
              ) : tableData?.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      {isDisabled ? (
                        ""
                      ) : (
                        <th>
                          <input
                            type="checkbox"
                            checked={selectedData.length === tableData.length}
                            onChange={() => {
                              // setAllChacked(!allCheked)

                              // .map((ele) =>
                              //   // handleCheckboxChange(ele.KutchaCatalogId)
                              //   setSelectedData(ele)
                              // )
                              setAllChacked(!allCheked);

                              if (tableData?.length > 0) {
                                setSelectedData(!allCheked ? tableData : []);
                              } else {
                                setAllChacked(!allCheked);
                                setSelectedData([]);
                              }
                            }}
                          />
                        </th>
                      )}
                      <th>Invoice No.</th>
                      <th>GP No.</th>
                      <th>GP Date</th>
                      {/* <th>AWR Date</th>
                      <th>Arrival Date</th> */}
                      <th>Origin</th>
                      <th>Category</th>
                      <th>Tea Type</th>
                      <th>Sub Type</th>
                      <th>Mark</th>
                      <th>AWR Ref. No.</th>
                      <th>Gross Weight</th>
                      <th>Tare Weight</th>
                      <th>Net Weight</th>
                      <th>No. of Packages</th>
                      <th>Serial No. of Packages</th>
                      <th>Short/Excess Weight</th>
                      <th>Total Weight</th>
                      <th>Location Inside Warehouse</th>
                      <th>Period of Manufacture From</th>
                      <th>Period of Manufacture To</th>
                      <th>Dispatch Date</th>
                      <th>Carrier</th>
                      <th>Lorry Receipt No.</th>
                      <th>Lorry No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((data, index) => (
                      <tr key={index}>
                        {isDisabled ? (
                          ""
                        ) : (
                          <td>
                            {" "}
                            <input
                              type="checkbox"
                              checked={selectedData.some(
                                (selectedItem) =>
                                  selectedItem.invoiceId === data.invoiceId
                              )}
                              onChange={() => {
                                setChecked(!checked);
                                handleCheckboxChange(data.invoiceId);
                              }}
                            />
                          </td>
                        )}
                        <td>{data.invoiceNo}</td>
                        <td>
                          {isDisabled ? (
                            data.gpNo
                          ) : (
                            <input
                              type="number"
                              value={data.gpNo}
                              onChange={(e) =>
                                handleInputChange(e, index, "gpNo")
                              }
                            />
                          )}
                        </td>
                        <td>
                          {isDisabled ? (
                            data.gpDate
                          ) : (
                            <input
                              type="date"
                              value={data.gpDate?.split("T")?.at(0)}
                              onChange={(e) =>
                                handleInputChange(e, index, "gpDate")
                              }
                            />
                          )}
                        </td>
                        {/* <td>
                          {actionData?.at(index)?.arrivalDate === undefined
                            ? invoiceDataList?.at(index)?.awrDate === null
                              ? "-"
                              : formatDateToDdMmYy(data.awrDate)
                            : formatDateToDdMmYy(
                                actionData?.at(index)?.awrDate
                              )}
                        </td>
                        <td>
                          {actionData?.at(index)?.arrivalDate === undefined
                            ? invoiceDataList?.at(index)?.awrDate === null
                              ? "-"
                              : formatDateToDdMmYy(data.arrivalDate)
                            : formatDateToDdMmYy(
                                actionData?.at(index)?.arrivalDate
                              )}
                        </td> */}
                        <td>{data.Origin}</td>
                        <td>{data.categoryName}</td>
                        <td>{data.teaTypeName}</td>
                        <td>{data.subTeaTypeName}</td>
                        <td>{data.markName}</td>
                        <td>{actionData?.at(0)?.awrReferenceNo}</td>
                        <td>{data.grossKgs}</td>
                        <td>{data.tareKgs}</td>
                        <td>{data.netKgs}</td>
                        <td>{data.totalPackages}</td>
                        <td>{data.packageNo}</td>
                        <td>{data.shortExcessWeight}</td>
                        <td>{data.totalWeight}</td>
                        <td>
                          {data.locationInsideWarehouse === ""
                            ? "-"
                            : data.locationInsideWarehouse}
                        </td>
                        <td>
                          {formatDateToDdMmYy(
                            data.manufactureFromDate?.split("T")?.at(0)
                          )}
                        </td>
                        <td>
                          {formatDateToDdMmYy(
                            data.manufactureToDate?.split("T")?.at(0)
                          )}
                        </td>
                        <td>{formatDateToDdMmYy(data.dateOfDispatch)}</td>
                        <td>{data.carrier}</td>
                        <td>{data.lorryReceiptNo}</td>
                        <td>{data.lorryNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <>
                  <table className="table mt-4">
                    <thead>
                      <tr>
                        <th>Invoice No.</th>
                        <th>GP No.</th>
                        <th>GP Date</th>

                        <th>Origin</th>
                        <th>Category</th>
                        <th>Tea Type</th>
                        <th>Sub Type</th>
                        <th>Mark</th>
                        <th>AWR Ref. No.</th>
                        <th>Gross Weight</th>
                        <th>Tare Weight</th>
                        <th>Net Weight</th>
                        <th>No. of Packages</th>
                        <th>Serial No. of Packages</th>
                        <th>Short/Excess Weight</th>
                        <th>Total Weight</th>
                        <th>Location Inside Warehouse</th>
                        <th>Period of Manufacture From</th>
                        <th>Period of Manufacture To</th>
                        <th>Dispatch Date</th>
                        <th>Carrier</th>
                        <th>Lorry Receipt No.</th>
                        <th>Lorry No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={35}>
                          <div className="NoData">No Data</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}

              <div>
                {isDisabled ? (
                  <>
                    <button
                      type="button"
                      className="SubmitBtn"
                      onClick={handlePrint}
                    >
                      Print Page
                    </button>
                    <Button className="SubmitBtn" onClick={handleExportToPdf}>
                      Print
                    </Button>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        {/* MODAL PRINT */}
        <Modals
          size="l"
          title="Chose For Print"
          show={openPrintModel}
          handleClose={() => {
            setopenPrintModel(false);
          }}
        >
          <PrintInvoice
            fields={[]}
            showcheckboxlebels={AwrPrintArr}
            rows={printrow.length > 0 ? printrow : []}
            pageName={"AWR"}
          />
        </Modals>
      </form>

      {/* <ToastContainer autoClose={1200} /> */}
    </div>
  );
}

export default AWRForm;
