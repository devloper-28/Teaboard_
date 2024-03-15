import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExcelJS from "exceljs";

import "./modal.css";
import TableComponent from "../../../../components/tableComponent/TableComponent";

import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Accordion,
} from "@mui/material";
import { SelectAll } from "@mui/icons-material";
import * as Yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import AWRForm from "./form/Form";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchKutchaCatalogueRequest,
  fetchMarkRequest,
  fetchMarkTypeRequest,
  fetchSaleNumbersRequest,
  fetchSessionTypeRequest,
  fetchStatusRequest,
  generateLotNoRequest,
  getSaleNoRequest,
  teaTypeAction,
  updateKutchaCatalogueRequest,
} from "../../../../store/actions";
import { useDispatch } from "react-redux";
// import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// import KutchaCataloguePDF from "../KutchaCataloguePDF";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "react-toastify/dist/ReactToastify.css";
import KutchaTable from "./kutchaDataTable/KutchaTable";
import axiosMain from "../../../../http/axios/axios_main";
import CustomToast from "../../../../components/Toast";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import PrintableTable from "../../../../components/common/PrintableTable";
import MenualPublishDataTable from "./kutchaDataTable/MenualPublishDataTable";
import Modal from "../../../../components/common/Modal";
import axios from "axios";
import UploadValuation from "../../auctioncatalog/UploadValuation";
import PrintInvoice from "../../../../components/common/Print/print";
import Modals from "../../../../components/common/Modal";

const currentYear = new Date().getFullYear();

const validationSchema = Yup.object().shape({
  // mark: Yup.string().required("Mark is required"),
  // LotNoStatus: Yup.string().required("Lot Number is required"),
  // category: Yup.string().required("Category is required"),
  saleNo: Yup.string().required("Sale No is required"),
  // season: Yup.string().required("Season is required"),
  // teaType: Yup.string().required("Tea Type is required"),
  // grade: Yup.string().required("Grade is required"),
  // markType: Yup.string().required("Mark Type is required"),
});
const initialValues = {
  LotNoStatus: 0,
  season: currentYear,
  saleNo: "",
  teaType: "0",
  mark: "0",
  grade: "0",
  category: "0",
  markType: 0,
};
// const initialValues = {
//   mark: "Mark Value",
//   markType: "Mark Type",
//   warehouse: "Warehouse Value",
//   warehouseName: "Warehouse Name Value",
//   warehouseAddress: "Warehouse Address Value",
//   invoiceNo: "Invoice No Value",
//   invoiceQty: "Invoice Qty Value",
//   origin: "Origin Value",
//   year: "year",
//   manufacture: "Manufacture Value",
//   grade: "Grade Value",
//   fromDate: "From Date Value",
//   toDate: "To Date Value",
//   dateOfDispatch: "Date of Dispatch Value",
//   invoiceDate: "Invoice Date Value",
//   season: "Season Value",
//   saleNo: "Sale No Value",
//   auctioneer: "Auctioneer Value",
//   lorryReceiptNo: "Lorry Receipt No Value",
//   lorryNo: "Lorry No Value",
//   invRefNo: "Inv Ref No Value",
//   carrier: "Carrier Value",
//   teaType: "Tea Type Value",
//   subType: "Sub Type Value",
//   category: "Category Value",
//   packageSize: "Package Size Value",
//   packageType: "Package Type Value",
//   packageNo: "Package No Value",
//   totalPackages: "Total Packages Value",
//   grossKgs: "Gross Kgs Value",
//   tareKgs: "Tare Kgs Value",
//   netKgs: "Net Kgs Value",
//   totalNetKgs: "Total Net Kgs Value",
// };

const ModalForm = ({ modalRight }) => {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
    auction,
  } = useAuctionDetail();
  const dispatch = useDispatch();
  const inputRefs = useRef({});

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const teaType = useSelector(
    (state) => state?.teaType?.teaTypeList?.responseData
  );

  const abc = useSelector((state) => state.category.loading);
  const kutchaList = useSelector(
    (state) => state.kutchaCatalogueReducer.data.responseData
  );
  const kutchaListWarning = useSelector(
    (state) => state.kutchaCatalogueReducer.data.message
  );
  const sessionType = useSelector(
    (state) => state.sessionTypesReducer.data.responseData
  );

  console.log(sessionType, "sessionType");

  const statusData = useSelector(
    (state) => state.category.statusData.responseData
  );
  console.log(statusData, ".");
  const markList = useSelector((state) => state.mark.data.responseData);
  const categorys = useSelector((state) => state?.category?.data?.responseData);

  const markType = useSelector((state) => state.mark.markTypeData.responseData);
  const grades = useSelector((state) => state?.grade?.data?.responseData);

  const searchData = useSelector(
    (state) => state?.kutchaCatalogueReducer?.data?.responseData
  );
  const [openUploadValuation, setOpenUploadValuation] = useState(false);

  const [printrow, setprintrow] = useState([]);
  const [openPrintModel, setopenPrintModel] = useState(false);
  const [columndata, setcolumndata] = useState([]);
  const [rowsprint, setrowsprint] = useState([]);
  const [tableData, setTableData] = useState(null);

  console.log(searchData, "categorystate");
  const expaspdfcolumn = [
    { name: "LotNo", title: "Lot No " },
    { name: "invoiceNo", title: "Invoice No" },
    { name: "origin", title: "origin" },
    { name: "teaTypeName", title: "Tea Type" },
    { name: "subTeaTypeName", title: "Sub Tea Type" },
    { name: "categoryName", title: "Category" },
    { name: "markName", title: "Mark" },
    {
      name: "sessionType",
      title: "Session Type",
    },
    { name: "gradeName", title: "Grade" },
    { name: "packageType", title: "Package Type" },
    { name: "packageNo", title: "Package No." },
    {
      name: "totalPackages",
      title: "No. of Packages",
    },
    {
      name: "SampleQty",
      title: "Sample Qty.(Kgs)",
    },
    { name: "grossKgs", title: "Gross Weight" },
    { name: "tareKgs", title: "Tare Weight" },
    { name: "netKgs", title: "Net Weight" },
    { name: "invoiceWeight", title: "Invoice Weight" },
    { name: "shortExcessWeight", title: "Short/Excess Weight" },
    { name: "manufactureFromDate", title: "Manufacture From Date" },
    { name: "manufactureToDate", title: "Manufacture To Date" },
    { name: "gpNo", title: "GP No" },
    { name: "gpDate", title: "GP Date" },
    {
      name: "basePrice",
      title: "Base Price",
    },
    {
      name: "auctioneerValuation",
      title: "Auctioneer Valuation",
    },
    {
      name: "reservePrice",
      title: "Reserve Price",
    },
    {
      name: "priceIncrement",
      title: "Price Increment",
    },
    {
      name: "markPackageComments",
      title: "Mark & Package Comments",
    },
    {
      name: "lotComments",
      title: "Lot Comments",
    },
    {
      name: "qualityComments",
      title: "Quality Comments",
    },
    {
      name: "qualityCertification",
      title: "Quality Certification",
    },
    {
      name: "brewColor",
      title: "Brew Color",
    },
    {
      name: "ageOfProducts",
      title: "Age of Products (In Months)",
    },
    {
      name: "brewersComments",
      title: "Brewers Comments",
    },
    {
      name: "gardenCertification",
      title: "Garden Certification",
    },
    {
      name: "wareHouseName",
      title: "Warehouse",
    },
    {
      name: "locationInsideWarehouse",
      title: "Location Inside Warehouse",
    },
    {
      name: "remarks",
      title: "Remarks",
    },
    {
      name: "lastModifiedBy",
      title: "Last Modified By",
    },
    {
      name: "marketTypeName",
      title: "Market Type",
    },
    {
      name: "SystemBasePrice",
      title: "System Base Price",
    },
  ];
  // useEffect(() => {}, [searchData]);
  // const handleExportPDF = () => {
  //   // You need to replace `rows` with the actual data you want to export
  //   const data = rows;

  //   const pdfBlob = (<KutchaCataloguePDF data={data} />).toBlob();
  //   saveAs(pdfBlob, "kutcha_catalogue.pdf");
  // };

  // const handleExportExcel = () => {
  //   const data = rows.map((ele) => {
  //     const {
  //       KutchaCatalogId,
  //       invoiceId,
  //       SaleProgramId,
  //       teaTypeId,
  //       subTeaTypeId,
  //       categoryId,
  //       markId,
  //       sessionTypeId,
  //       gradeId,
  //       wareHouseUserRegId,
  //       factoryId,
  //       marketTypeId,
  //       ...rest
  //     } = ele;
  //     return rest;
  //   });

  //   // Create a new workbook and worksheet
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.json_to_sheet(data);

  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "KutchaCatalogue");

  //   // Generate Excel file
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const blob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   saveAs(blob, "kutcha_catalogue.xlsx");
  // };

  const handleExportExcel = async () => {
    // Assuming columnName contains the list of objects with "name" and "title"
    const thElements = [
      "Lot No.",
      "Invoice No.",
      "Tea Type",
      "Subtea Type",
      "Category",
      "Mark",
      "Grade",
      "Market Type",
      "Package Type",
      "Package Number",
      "Total Packages",
      "Sample Quantity",
      "Gross Kilograms",
      "Tare Kilograms",
      "Net Kilograms",
      "Invoice Weight",
      "Short/Excess Weight",
      "Manufacture Date From",
      "Manufacture Date To",
      "GP Number",
      "GP Date",
      "Base Price",
      "Reserve Price",
      "Auctioneer Valuation",
      "Mark Package Comments",
      "Lot Comments",
      "Quality Comments",
      "Quality Certification",
      "Price Increment",
      "Brew Color",
      "Age of Products",
      "Brewer's Comments",
      "Garden Certification",
      "Warehouse",
      "Location Inside Warehouse",
      "Remarks",
      "Last Modified By",
      "System Base Price",
    ];

    const dataArray = [
      { name: "LotNo", title: "Lot No " },
      { name: "invoiceNo", title: "Invoice No" },
      { name: "origin", title: "origin" },
      { name: "teaTypeName", title: "Tea Type" },
      { name: "subTeaTypeName", title: "Sub Tea Type" },
      { name: "categoryName", title: "Category" },
      { name: "markName", title: "Mark" },
      {
        name: "sessionType",
        title: "Session Type",
      },
      { name: "gradeName", title: "Grade" },
      { name: "packageType", title: "Package Type" },
      { name: "packageNo", title: "Package No." },
      {
        name: "totalPackages",
        title: "No. of Packages",
      },
      {
        name: "SampleQty",
        title: "Sample Qty.(Kgs)",
      },
      { name: "grossKgs", title: "Gross Weight" },
      { name: "tareKgs", title: "Tare Weight" },
      { name: "netKgs", title: "Net Weight" },
      { name: "invoiceWeight", title: "Invoice Weight" },
      { name: "shortExcessWeight", title: "Short/Excess Weight" },
      { name: "manufactureFromDate", title: "Manufacture From Date" },
      { name: "manufactureToDate", title: "Manufacture To Date" },
      { name: "gpNo", title: "GP No" },
      { name: "gpDate", title: "GP Date" },
      {
        name: "basePrice",
        title: "Base Price",
      },
      {
        name: "auctioneerValuation",
        title: "Auctioneer Valuation",
      },
      {
        name: "reservePrice",
        title: "Reserve Price",
      },
      {
        name: "priceIncrement",
        title: "Price Increment",
      },
      {
        name: "markPackageComments",
        title: "Mark & Package Comments",
      },
      {
        name: "lotComments",
        title: "Lot Comments",
      },
      {
        name: "qualityComments",
        title: "Quality Comments",
      },
      {
        name: "qualityCertification",
        title: "Quality Certification",
      },
      {
        name: "brewColor",
        title: "Brew Color",
      },
      {
        name: "ageOfProducts",
        title: "Age of Products (In Months)",
      },
      {
        name: "brewersComments",
        title: "Brewers Comments",
      },
      {
        name: "gardenCertification",
        title: "Garden Certification",
      },
      {
        name: "wareHouseName",
        title: "Warehouse",
      },
      {
        name: "locationInsideWarehouse",
        title: "Location Inside Warehouse",
      },
      {
        name: "remarks",
        title: "Remarks",
      },
      {
        name: "lastModifiedBy",
        title: "Last Modified By",
      },
      {
        name: "marketTypeName",
        title: "Market Type",
      },
      {
        name: "SystemBasePrice",
        title: "System Base Price",
      },
    ];

    const filteredArray = dataArray.filter((item) =>
      thElements.includes(item.title)
    );

    let columnsdata = filteredArray;
    columnsdata.pop();
    const columnName = columnsdata;

    // Assuming data contains the list of data objects like [{saleNo: 5}, ...]
    const data = rows.map((ele) => {
      const { invoiceId, ...rest } = ele;
      return rest;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PreAuctionStatusReport");

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
    data.forEach((row) => {
      const rowData = columnName.map((column) => row[column.name]);
      worksheet.addRow(rowData);
    });

    // Automatically adjust column widths based on content
    worksheet.columns.forEach((column, index) => {
      const headerLength = columnName[index].title.length;
      const maxColumnWidth = column.values.reduce((acc, val) => {
        const cellLength = val ? val.toString().length : 0;
        return Math.max(acc, cellLength);
      }, headerLength);
      column.width = maxColumnWidth + 5; // Adding extra width for padding
    });

    const buffer = await workbook.xlsx.writeBuffer();

    // Convert the buffer to a Blob
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save the Blob as a file
    saveAs(blob, "KuchaCatalogReport.xlsx");
  };

  const formik = useFormik({
    initialValues: initialValues,

    validationSchema,
    onSubmit: async (values) => {
      setRows([]);
      const formData = {
        marketTypeId: parseInt(values.markType) /* update in future */,
        saleNo: parseInt(values.saleNo),
        LotNoStatus: parseInt(values.LotNoStatus), // Convert to integer
        categoryId: parseInt(values.category), // Convert to integer
        gradeId: parseInt(values.grade), // Convert to integer
        markId: parseInt(values.mark), // Convert to integer
        teaTypeId: parseInt(values.teaType), // Convert to integer
        auctioneerId: userId, //auctioner
        season: formik.values.season.toString(),
        auctionCenterId: auctionCenterId,
        role: roleCode,
        auctionType,
        baseUrlEng,
      };
      console.log(roleCode, "roleCode");
      // const formData = {
      //   season: formik.values.season.toString(),
      //   saleNo: 19,
      //   teaTypeId: 1,
      //   LotNoStatus: 0,
      //   markId: 7,
      //   categoryId: 2,
      //   gradeId: 4,
      //   marketType: 0,
      //   auctioneerId: userId,//auctioner
      // };

      // Check for responseData and show toast notification if it's null
      // if (kutchaList === null || kutchaList?.length === 0) {
      //   CustomToast.warning(kutchaListWarning, {
      //     position: CustomToast.POSITION.TOP_RIGHT,
      //     autoClose: 3000,
      //   });
      // } else {
      //   setRows(kutchaList);
      // }

      // console.log(formData, "GOING");
      // Update form values to the first option for all dropdowns if they are empty
      if (!values.teaType && teaType.length > 0) {
        formik.setFieldValue("teaType", teaType[0].teaTypeId);
      }
      if (!values.LotNoStatus && statusData.length > 0) {
        formik.setFieldValue("LotNoStatus", statusData[0].Value);
      }
      if (!values.grade && gradesList.length > 0) {
        formik.setFieldValue("grade", gradesList[0].gradeId);
      }
      if (!values.mark && markDataList.length > 0) {
        formik.setFieldValue("mark", markDataList[0].markId);
      }
      if (!values.category && categoryList.length > 0) {
        formik.setFieldValue("category", categoryList[0].categoryId);
      }

      // Manually validate the updated form values
      try {
        await validationSchema.validate(values, { abortEarly: false });
      } catch (errors) {
        // Handle validation errors
        const errorsMap = {};
        errors.inner.forEach((error) => {
          errorsMap[error.path] = error.message;
        });
        formik.setErrors(errorsMap);
      }
      dispatch(fetchKutchaCatalogueRequest(formData));
      console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
    },
  });

  console.log(kutchaListWarning, "mss");
  // Check for responseData and show toast notification if it's null

  const [sellsNo, setSellNo] = useState(1);

  const [expandedTab, setExpandedTab] = useState("panel1");
  const [rows, setRows] = useState([]);
  // const [year, setYear] = useState("2023");
  const [sessionTypes, setSessionType] = useState([]); // If using React state hooks

  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [mark, setmark] = useState([]);
  const [categoryList, setcategory] = useState([]);
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [openConformationModal, setOpenConformationModal] = useState(false);
  const { handleChange, handleBlur, values, touched, errors } = formik;

  const [fieldData, setFieldData] = useState({});
  const [updatedData, setUpdatedDataList] = useState([]);
  const [markTypeValue, setMarkTypeValue] = useState("0");
  const [saleNo, setSaleNo] = useState([]);
  const [openMenualValuation, setOpenMenualValuation] = useState(false);
  const [menualPublishrows, setMenualPublishRows] = useState([]);
  const [saleProgramId, setSaleProgramId] = useState([]);
  const [isPublishDate, setIsPublishDate] = useState(false);
  const [auctionType, setAuctionType] = useState(auction);
  const [baseUrlEng, setBaseUrlEng] = useState(
    auction === "ENGLISH" ? "EnglishAuctionKutchaCatalogue" : "KutchaCatalogue"
  );

  useEffect(() => {
    // dispatch(teaTypeAction({ auctionCenterId }));
    dispatch(fetchMarkTypeRequest());
    dispatch(fetchMarkRequest({ auctionCenterId }));
    // dispatch(fetchWarehouseUserRequest({ auctionCenterId }));
    dispatch(fetchGradeRequest({ auctionCenterId }));
    dispatch(fetchSaleNumbersRequest(formik.values.season));
    // dispatch(
    //   fetchCategoryRequest({
    //     teaTypeId: parseInt(formik.values.teaType),
    //     auctionCenterId,
    //   })
    // );
    dispatch(fetchStatusRequest(6));
    setRows([]);

    //     dispatch(fetchSubTeaTypeRequest(formik.values.teaType));
  }, []);

  useEffect(() => {
    setRows([]);
    setUpdatedDataList(kutchaList);
    setmark(markType);
    setGradesList(grades);
    setMarkDataList(markList);
    // setTeaTeatypeList(teaType);
    // setcategory(categorystate);
    setSessionType(sessionType);
    setSaleNo(saleNumber);
    formik.setFieldValue("saleNo", saleNumber?.at(0)?.saleNo);
    // console.log(gradesList, kutchaList, teaTypeList, markList, "gtt");
  }, [saleNumber, gradesList, grades, markList, markType]);

  useEffect(() => {
    setcategory(categorys);
  }, [categorys]);

  useEffect(() => {
    dispatch(fetchSaleNumbersRequest(formik.values.season));
  }, [formik.values.season]);
  console.log(sessionTypes, "sessionTypess");
  function isResponseDateGreaterOrEqual(responseDateString) {
    // Parse the response date string into a Date object
    var responseDate = new Date(responseDateString);

    // Get the current date
    var currentDate = new Date();

    // Compare the response date with the current date
    if (currentDate >= responseDate) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (parseInt(formik.values.saleNo) > 0) {
      axiosMain
        .post("/preauction/Common/GetSaleProgramDetailBySaleNo", {
          season: formik.values.season?.toString(),
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          setSaleProgramId(res.data.responseData);
          let isResponseDateGreaterOrEquals =
            res.data.responseData?.at(0)?.catalogPublishingDate;
          setIsPublishDate(
            isResponseDateGreaterOrEqual(isResponseDateGreaterOrEquals)
          );
          let url =
            res.data.responseData?.at(0)?.auctionTypeCode === "ENGLISH"
              ? "EnglishAuctionKutchaCatalogue"
              : "KutchaCatalogue";
          setBaseUrlEng(url);
          setAuctionType(res.data.responseData?.at(0)?.auctionTypeCode);
        })
        .catch((err) => console.log(err));
      axiosMain
        .post("/preauction/Common/BindTeaTypeBySeasonSaleNo", {
          season: formik.values.season?.toString(),
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            // formik.setFieldValue(
            //   "teaType",
            //   res.data.responseData?.at(0)?.teatypeid
            // );
            setTeaTeatypeList(res.data.responseData);
          } else {
            setTeaTeatypeList([]);
          }
        });
      // axiosMain
      //   .post("/preauction/Common/BindCatagoryByParam", {
      //     season: formik.values.season?.toString(),
      //     saleNo: parseInt(formik.values.saleNo),
      //     // AuctioneerId: parseInt(formik.values.auctioneer),
      //     auctionCenterId: auctionCenterId,
      //     auctioneerId: userId,
      //   })
      //   .then((res) => {
      //     if  (res.data.responseData?.length > 0) {
      //       // formik.setFieldValue(
      //       //   "category",
      //       //   res.data.responseData?.at(0)?.categoryId
      //       // );
      //       setcategory(res.data.responseData);
      //     } else {
      //       setcategory([]);
      //     }
      //   });
    } else {
      setTeaTeatypeList([]);
      setcategory([]);
    }
  }, [formik.values.saleNo]);

  const SampleTxt = ({ rowIndex, name, value, onChange, disabled }) => {
    return (
      <InputGroup>
        <FormControl
          disabled={disabled ? disabled : false}
          name={name}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setTableData((prevData) => {
              const updatedData = [...prevData];
              updatedData[rowIndex][name] = e.target.value;
              return updatedData;
            });
          }}
        />
      </InputGroup>
    );
  };

  // Function to handle input value changes
  // const handleInputChange = (key, value) => {
  //   console.log(key, value, rows, "nnnn");
  //   // const data = { key: key, value: value };
  //   let columnsName = kutcha.some((ele) => ele.name === key);
  //   const data = [...rows];
  //   const updatedItem = [...data].map(
  //     (item, index) => (item[key.toString()] = value)
  //   );

  //   console.log(updatedItem, "ndnnn");

  //   const updatedDataList = rows.map((item) =>
  //     kutcha.some((ele) => ele.name === key) ? {} : item
  //   );
  //   setUpdatedData(updatedDataList);
  // };

  // Function to handle input value changes

  function updateObjectByKey(arrayOfObjects, keyName, newValue) {
    return arrayOfObjects?.map((obj) => {
      if (obj.hasOwnProperty(keyName)) {
        return {
          ...obj,
          [keyName]: newValue,
        };
      }
      return obj;
    });
  }
  const KuchaketCatalogForAuctioneer = [
    "Lot No.",
    "Invoice No.",
    "Origin",
    "Tea Type",
    "Sub Tea Type",
    "Category",
    "Mark",
    "Session Type",
    "Grade",
    "Package Type",
    "Package No.",
    "No. of Packages",
    "Sample Qty.(Kgs)",
    "Gross Weight",
    "Tare Weight",
    "Net Weight",
    "Invoice Weight",
    "Short/Excess Weight",
    "Manufacture From Date",
    "Manufacture To Date",
    "GP No",
    "GP Date",
    "Base Price",
    "Reserve Price",
    "Auctioneer Valuation",
    // "Default value should be 1 and hidden",
    "Mark & Package Comments",
    "Lot Comments",
    "Quality Comments",
    "Price Increment",
    // "Quality Certification",
    // "Brew Color",
    // "Age of Products (In Months)",
    // "Brewers Comments",
    // "Garden Certification",
    "Warehouse",
    "Location Inside Warehouse",
    "Remarks",
    "Last Modified By",
    "Market  / Lot Type",
    // "action",
  ];
  const handleExportToPdfCatalogList = () => {
    let newdat = rows?.map(obj => {
      for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
          obj[key] = "";
        }
      }
      return obj;
    });
    const AwrPrintArr = Object.keys(rowsprint?.at(0)).map(key => {
      return {
        name: key,
        title: key.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase(), // Convert camelCase to Title Case
      };
    });
    let removearr = ["factoryId", "categoryId", "invoiceId", "markId", "subTeaTypeId", "teaTypeId", "gradeId", "auctioneerId", "SaleProgramId", "sa", "wareHouseUserRegId", "marketTypeId", "KutchaCatalogId", "sessionTypeId"];
    let newcolumn = AwrPrintArr.map((itm) =>
      removearr?.includes(itm.name) === false && itm
    ).filter(ele => ele !== false)

    newcolumn.push(
      { name: "lotnostatus", title: "LOT NO STATUS" },
      { name: "lotmarkettype", title: "LOT MARKET TYPE" },);


    // var datas = newdat.map((item) => ({ ...item, season: formik.values.season, saleNo: formik.values.saleNo }))
    // setprintrow(myCatalogRows);
    // console.log(formik);
    // const objectToRemove = "action";

    // // Find the index of the object with the specified name
    // const indexToRemove = allcoulmn.findIndex(item => item.name === objectToRemove);

    // // Check if the index is found and remove the object
    // if (indexToRemove !== -1) {
    //   allcoulmn.splice(indexToRemove, 1);
    // }
    // allcoulmn.push(
    //   { name: "season", title: "season" },
    //   { name: "saleNo", title: "Sale No" },
    //   { name: "auctionerDate", title: "auctionerDate" },
    //   { name: "auctioner", title: "auctioner" },
    //   { name: "sessiontime", title: "Session Time" }
    // );
    // let AuctionerselectedText;
    // if (formik.values.auctioner === 0 || formik.values.auctioner === "0") {
    //   AuctionerselectedText = "All";
    // }
    // else
    //   AuctionerselectedText = auctioneer.filter((item) => item.userId === parseInt(formik.values.auctioner))?.at(0).userCode;
    let lotnostatus;
    if (formik.values.LotNoStatus === 0) {
      lotnostatus = "All";
    }
    else {
      lotnostatus = statusData.filter((ele) => ele.Value ===parseInt(formik.values.LotNoStatus)).at(0)?.Name;
    }
    let markTypes;
    if (formik.values.markType === 0) {
      markTypes = "All";
    }
    else {
      markTypes = markType.filter((ele) => ele.marketTypeId === parseInt(formik.values.markType)).at(0)?.marketTypeName
    }
  
      let newrow = newdat.map((itm) => ({
        ...itm, season: formik.values.season, saleNo: formik.values.saleNo, lotnostatus: lotnostatus, lotmarkettype: markTypes
      }));
   
     
    setprintrow(newrow);
    setcolumndata(newcolumn);

    setopenPrintModel(true);
  };
  const handleInputChange = (key, value) => {
    let updatedDataList = updateObjectByKey(updatedData, key, value);

    const formData = updatedDataList?.map((item) => {
      return {
        KutchaCatalogId:
          item.KutchaCatalogId == null ? "" : item.KutchaCatalogId,
        SampleQty: item.SampleQty == null ? 0 : parseFloat(item.SampleQty),
        basePrice: item.basePrice == null ? 0 : parseFloat(item.basePrice),
        reservePrice:
          item.reservePrice == null ? 0 : parseFloat(item.reservePrice),
        auctioneerValuation:
          item.auctioneerValuation == null
            ? 0
            : parseFloat(item.auctioneerValuation),
        priceIncrement:
          item.priceIncrement == null ? 0 : parseInt(item.priceIncrement),
        markPackageComments:
          item.markPackageComments == null ? "" : item.markPackageComments,
        lotComments: item.lotComments == null ? "" : item.lotComments,
        qualityComments:
          item.qualityComments == null ? "" : item.qualityComments,
        qualityCertification:
          item.qualityCertification == null ? "" : item.qualityCertification,
        brewColor: item.brewColor == null ? "" : item.brewColor,
        ageOfProducts:
          item.ageOfProducts == null ? 0 : parseInt(item.ageOfProducts),
        brewersComments:
          item.brewersComments == null ? "" : item.brewersComments,
        gardenCertification:
          item.gardenCertification == null ? "" : item.gardenCertification,
        locationInsideWarehouse:
          item.locationInsideWarehouse == null
            ? ""
            : item.locationInsideWarehouse,
        remarks: item.remarks == null ? "" : item.remarks,
        // lastModifiedBy:
        //   item.lastModifiedBy == null ? "" : parseInt(item.lastModifiedBy),
        SystemBasePrice:
          item.SystemBasePrice == null ? "" : parseFloat(item.SystemBasePrice),
        // MarketType: item.MarketType == null ? "" : item.MarketType,
        updatedBy: userId, //auctioner
        auctionCenterId: auctionCenterId,
      };
    });
    console.log(formData, "updatedDataList");
    setUpdatedDataList(formData);
  };

  // console.log(updatedData,"updatedData")

  // const kutcha = [
  //   // {
  //   //   name: "select",
  //   //   title: "Select",
  //   //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
  //   // },
  //   { name: "LotNo", title: "Lot No " },
  //   { name: "invoiceNo", title: "Invoice No" },
  //   { name: "origin", title: "origin" },
  //   { name: "teaTypeName", title: "Tea Type" },
  //   { name: "subTeaTypeName", title: "Sub Tea Type" },
  //   { name: "categoryName", title: "Category" },
  //   { name: "markName", title: "Mark" },
  //   {
  //     name: "sessionType",
  //     title: "Session Type",
  //     getCellValue: (row) => {
  //       console.log(row, "sessionTypes");
  //       // const data=row?.at(0)
  //       if (row.sessionTypeId === null) {
  //         return (
  //           <InputGroup>
  //             <FormControl
  //               as="select"
  //               name="sessionType"
  //               value={sessionTypes}
  //               onChange={(e) => handleSessionTypeChange(e.target.value)}
  //               required
  //             >
  //               {sessionType?.map((type) => (
  //                 <option key={type.sessionTypeId} value={type.sessionTypeName}>
  //                   {type.sessionTypeName}
  //                 </option>
  //               ))}
  //             </FormControl>
  //           </InputGroup>
  //         );
  //       } else {
  //         <span>{row.sessionTypeId}</span>;
  //       }
  //     },
  //   },

  //   { name: "gradeName", title: "Grade" },
  //   { name: "packageType", title: "Package Type" },
  //   { name: "packageNo", title: "Package No." },
  //   {
  //     name: "totalPackages",
  //     title: "No. of Packages",
  //   },
  //   {
  //     name: "SampleQty",
  //     title: "Sample Qty.(Kgs)",
  //   },
  //   { name: "grossKgs", title: "Gross Weight" },
  //   { name: "tareKgs", title: "Tare Weight" },
  //   { name: "netKgs", title: "Net Weight" },
  //   { name: "invoiceWeight", title: "Invoice Weight" },
  //   { name: "shortExcessWeight", title: "Short/Excess Weight" },
  //   { name: "manufactureFromDate", title: "Manufacture From Date" },
  //   { name: "manufactureToDate", title: "Manufacture To Date" },
  //   { name: "gpNo", title: "GP No" },
  //   { name: "gpDate", title: "GP Date" },
  //   {
  //     name: "basePrice",
  //     title: "Base Price",
  //   },
  //   {
  //     name: "auctioneerValuation",
  //     title: "Auctioneer Valuation",
  //   },
  //   {
  //     name: "reservePrice",
  //     title: "Reserve Price",
  //   },
  //   {
  //     name: "priceIncrement",
  //     title: "Price Increment",
  //   },
  //   {
  //     name: "markPackageComments",
  //     title: "Mark & Package Comments",
  //   },
  //   {
  //     name: "lotComments",
  //     title: "Lot Comments",
  //   },
  //   {
  //     name: "qualityComments",
  //     title: "Quality Comments",
  //   },
  //   {
  //     name: "qualityCertification",
  //     title: "Quality Certification",
  //   },
  //   {
  //     name: "brewColor",
  //     title: "Brew Color",
  //   },
  //   {
  //     name: "ageOfProducts",
  //     title: "Age of Products (In Months)",
  //   },
  //   {
  //     name: "brewersComments",
  //     title: "Brewers Comments",
  //   },
  //   {
  //     name: "gardenCertification",
  //     title: "Garden Certification",
  //   },
  //   {
  //     name: "wareHouseName",
  //     title: "Warehouse",
  //   },
  //   {
  //     name: "locationInsideWarehouse",
  //     title: "Location Inside Warehouse",
  //   },
  //   {
  //     name: "remarks",
  //     title: "Remarks",
  //   },
  //   {
  //     name: "lastModifiedBy",
  //     title: "Last Modified By",
  //   },
  //   {
  //     name: "marketTypeName",
  //     title: "Market Type",
  //   },
  //   {
  //     name: "SystemBasePrice",
  //     title: "System Base Price",
  //   },

  //   // {
  //   //   name: "action",
  //   //   title: "Action",
  //   //   getCellValue: ({ ...row }) => <ActionArea data={row} />,
  //   // },
  // ];

  const handleSessionTypeChange = (selectedSessionType) => {
    setSessionType(selectedSessionType);
  };

  // const handleRefresh = () => {};
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = {
      marketType: 0 /* update in future */,
      saleNo: parseInt(formik.values.saleNo),
      LotNoStatus: parseInt(formik.values.LotNoStatus), // Convert to integer
      categoryId: parseInt(formik.values.category), // Convert to integer
      gradeId: parseInt(formik.values.grade), // Convert to integer
      markId: 6, // Convert to integer
      teaTypeId: parseInt(formik.values.teaType), // Convert to integer
      auctioneerId: userId, //auctioner
      season: formik.values.season.toString(),
      auctionCenterId: auctionCenterId,
      role: roleCode,
      auctionType,
      baseUrlEng,
    };
    console.log(formData, "GOING");
    dispatch(fetchKutchaCatalogueRequest(formData));
  };
  // useEffect(() => {
  //   if (teaTypeList && teaTypeList.length > 0) {
  //     formik.setFieldValue("teaType", teaTypeList[0]?.teaTypeId);
  //   }
  // }, [teaTypeList, formik]);

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    setRows([]);
  };
  function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let i = currentYear; i > currentYear - 7; i--) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return options;
  }
  // console.log(tableData, "tableData", rows, "rows");

  const useFieldData = () => {
    const updateFieldData = (rowIndex, columnName, value) => {
      const key = `${rowIndex}-${columnName}`;
      setFieldData((prevData) => ({ ...prevData, [key]: value }));
    };

    return { fieldData, updateFieldData };
  };

  // const TableComponent = ({ columns, data }) => {
  //   return (
  //     <table className="table table-responsive">
  //       <thead>
  //         <tr>
  //           {columns?.map((column) => (
  //             <th key={column.name}>{column.title}</th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {data?.map((row,rowIndex) => (
  //           <tr key={rowIndex}>
  //             {columns?.map((column) => {
  //               return (
  //                 <td key={column.name}>
  //                   {column.getCellValue ? (
  //                     column.getCellValue(row,rowIndex)
  //                   ) : row[column.name] === null ? (
  //                     <input
  //                       type="text"
  //                       value={row[column.name] || ""}
  //                       onChange={(e) =>
  //                         console.log(rowIndex, column.name, e.target.value)
  //                       }
  //                       required={column.required} // Use the 'required' attribute here
  //                     />
  //                   ) : (
  //                     row[column.name]
  //                   )}
  //                 </td>
  //               );
  //             })}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   );
  // };
  const handleSampleQtyChange = (name, value) => {
    // You can update the corresponding row's data in the `rows` state or handle the value as needed

    console.log("Sample Q ty.(Kgs) changed to:", value);

    setTableData({
      ...tableData,
      [name]: value,
    });
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAllRow(checked);
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        checked,
      }))
    );
  };

  const AWRCheckBox = (data) => {
    const handleChange = (e) => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === data.data.id ? { ...row, checked: e.target.checked } : row
        )
      );

      const allChecked = rows.every((row) => row.checked);
      setSelectAllRow(allChecked);
    };
    useEffect(() => {
      const allChecked = rows.every((row) => row.checked);
      setSelectAllRow(allChecked);
    }, [rows]);

    return (
      <>
        <Form.Check
          type="checkbox"
          id="custom-switch"
          checked={data.data.checked}
          onChange={handleChange}
        />
      </>
    );
  };
  useEffect(() => {
    if (kutchaList?.length > 0) {
      setRows(kutchaList);
      setrowsprint(kutchaList);
    } else {
      setRows([]);
      setrowsprint([]);
    }
  }, [kutchaList]);

  useEffect(() => {
    setRows([]);
    setrowsprint([]);
  }, [formik.values.LotNoStatus]);

  // handle Update
  // const getEmptyFields = (rows, kutcha) => {
  //   const emptyFields = rows.map((item) =>
  //     kutcha.filter(
  //       (column) => item[column.name] === null || item[column.name] === ""
  //     )
  //   );
  //   return emptyFields.map((column) => column.title);
  // };

  // const handleUpdate = () => {
  //   const emptyFields = getEmptyFields(updatedData, kutcha);

  //   console.log(updatedData, emptyFields, "updatedData");
  //   if (emptyFields.length === 0) {
  //     // Perform your update action here
  //     CustomToast.success("All fields are filled. Proceed with the update.");
  //     setRows(updatedData)
  //   } else {
  //     CustomToast.error("Please fill fields before updating.");
  //   }
  // };

  const handleUpdate = () => {
    // console.log(updatedData, "updatedDataList");
    dispatch(updateKutchaCatalogueRequest(updatedData));
  };

  // console.log(rows,"rows")
  return (
    <>
      <div>
        <DeleteConfirmationModal
          show={openDelete}
          onDelete={() => {
            setRows([...rows?.filter((ele) => ele.id !== actionData.edit.id)]);
            setOpenDelete(false);
          }}
          onHide={() => setOpenDelete(false)}
        />
        <ConfirmationModal
          show={openConformationModal}
          title="Are you sure you want to Generate Lot no. ?"
          onYes={() => {
            if (
              formik.values.markType !== "A" ||
              formik.values.LotNoStatus === 0
            ) {
              const data = {
                season: formik.values.season.toString(),
                saleNo: parseInt(formik.values.saleNo),
                teaTypeId: parseInt(formik.values.teaType),
                markId: parseInt(formik.values.mark),
                auctionCenterId: auctionCenterId,
                userId: userId, //auctioner
                marketTypeId: parseInt(formik.values.markType),
                categoryId: parseInt(formik.values.category),
                gradeId: parseInt(formik.values.grade),
                auctioneerId: userId, //auctioner
                auctionCenterId: auctionCenterId,
              };

              const formData = {
                marketTypeId: parseInt(
                  formik.values.markType
                ) /* update in future */,
                saleNo: parseInt(formik.values.saleNo),
                LotNoStatus: parseInt(formik.values.LotNoStatus), // Convert to integer
                categoryId: parseInt(formik.values.category), // Convert to integer
                gradeId: parseInt(formik.values.grade), // Convert to integer
                markId: parseInt(formik.values.mark), // Convert to integer
                teaTypeId: parseInt(formik.values.teaType), // Convert to integer
                auctioneerId: userId, //auctioner
                season: formik.values.season.toString(),
                auctionCenterId: auctionCenterId,
                role: roleCode,
                auctionType,
                baseUrlEng,
              };

              console.log(data, "datadata");
              // dispatch(generateLotNoRequest(data));
              axiosMain
                .post(`/preauction/${baseUrlEng}/GenerateLotNo`, data)
                .then((res) => {
                  if (res.data.statusCode === 200) {
                    CustomToast.success(res.data.message);
                    formik.setFieldValue("LotNoStatus", 1);
                    setMarkTypeValue("1");
                    // dispatch(fetchKutchaCatalogueRequest(formData));
                    dispatch(fetchKutchaCatalogueRequest(formData));
                  } else {
                    CustomToast.warning(res.data.message);
                  }
                })
                .catch((error) => {
                  CustomToast.error(error.data.message);
                });
            } else {
              CustomToast.error(
                "Lot No Status must be pendding or Mark type All is not valid to genarate Lot No "
              );
            }
            setOpenConformationModal(false);
          }}
          onHide={() => setOpenConformationModal(false)}
        />
        {modalRight?.includes("12") && (
          <>
            <Accordion
              expanded={expandedTab === "panel1"}
              onChange={handleAccordionChange("panel1")}
              className={`${expandedTab === "panel1" ? "active" : ""}`}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Manage Kutcha Catalog</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <form onSubmit={formik.handleSubmit}>
                  <div className="row align-items-end">
                    <div className="col-lg-2">
                      <label>Select Season</label>
                      <InputGroup>
                        <FormControl
                          as="select"
                          name="season"
                          value={formik.values.season}
                          onChange={handleChange}
                        >
                          {generateYearOptions()}
                        </FormControl>
                      </InputGroup>
                      {formik.errors.season && formik.touched.season && (
                        <div className="error text-danger">
                          {formik.errors.season}
                        </div>
                      )}
                    </div>
                    <div className="col-lg-2">
                      <label>Sale No.</label>
                      <InputGroup>
                        <FormControl
                          as="select"
                          name="saleNo"
                          value={formik.values.saleNo}
                          onChange={handleChange}
                        >
                          {saleNumber?.map((e) => (
                            <option key={e.SaleNoId} value={e.saleNo}>
                              {e.saleNo}
                            </option>
                          ))}
                        </FormControl>
                      </InputGroup>
                      {formik.errors.saleNo && formik.touched.saleNo && (
                        <div className="error text-danger">
                          {formik.errors.saleNo}
                        </div>
                      )}
                    </div>
                    <div className="col-lg-2">
                      <label>Tea Type</label>
                      <InputGroup>
                        <FormControl
                          as="select"
                          size="sm"
                          name="teaType"
                          value={formik.values.teaType}
                          onChange={(e) => {
                            dispatch(
                              fetchCategoryRequest({
                                teaTypeId: parseInt(e.target.value),
                                auctionCenterId,
                              })
                            );
                            handleChange(e);
                          }}
                        >
                          <option value={0}>All</option>
                          {teaTypeList?.length > 0 ? (
                            teaTypeList?.map((item, index) => (
                              <option value={item?.teatypeid} key={index}>
                                {item.teaTypeName}
                              </option>
                            ))
                          ) : (
                            <option>No Data</option>
                          )}
                        </FormControl>
                      </InputGroup>
                      {formik.errors.teaType && formik.touched.teaType && (
                        <div className="error text-danger">
                          {formik.errors.teaType}
                        </div>
                      )}
                    </div>
                    <div className="col-lg-2">
                      <label>Lot No status</label>
                      <InputGroup>
                        <FormControl
                          as="select"
                          size="sm"
                          name="LotNoStatus"
                          value={formik.values.LotNoStatus}
                          onChange={(e) => {
                            handleChange(e);
                            setMarkTypeValue(e.target.value);
                          }}
                        >
                          {statusData?.length > 0
                            ? statusData?.map((item, index) => (
                              <option value={parseInt(item?.Value)}>
                                {item.Name}
                              </option>
                            ))
                            : "No Data"}
                        </FormControl>
                      </InputGroup>
                      {formik.errors.LotNoStatus &&
                        formik.touched.LotNoStatus && (
                          <div className="error text-danger">
                            {formik.errors.LotNoStatus}
                          </div>
                        )}
                    </div>
                    <div className="col-md-2">
                      <div className="FormGrup">
                        <label>Grade</label>
                        <div className="max-width250">
                          <InputGroup>
                            <FormControl
                              as="select"
                              name="grade"
                              value={formik.values.grade}
                              onChange={handleChange}
                            >
                              {gradesList?.length > 0 ? (
                                <>
                                  <option value={0}>All</option>
                                  {gradesList?.map((item, index) => (
                                    <option value={item.gradeId} key={index}>
                                      {item.gradeCode}
                                    </option>
                                  ))}
                                </>
                              ) : (
                                <option>No Data</option>
                              )}
                            </FormControl>
                          </InputGroup>
                          {formik.errors.grade && formik.touched.grade && (
                            <div className="error text-danger">
                              {formik.errors.grade}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FormGrup">
                        <label>Mark</label>
                        <div className="max-width250">
                          <InputGroup>
                            <FormControl
                              as="select"
                              name="mark"
                              value={formik.values.mark}
                              onChange={handleChange}
                            >
                              <option value={0}>All</option>
                              {markDataList?.length > 0 ? (
                                markDataList?.map((item, index) => (
                                  <option value={item.markId} key={index}>
                                    {item.markCode}
                                  </option>
                                ))
                              ) : (
                                <option>No Data</option>
                              )}
                            </FormControl>
                          </InputGroup>
                          {formik.errors.mark && formik.touched.mark && (
                            <div className="error text-danger">
                              {formik.errors.mark}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FormGrup">
                        <label>Category</label>
                        <div className="max-width250">
                          <InputGroup>
                            <FormControl
                              as="select"
                              name="category"
                              value={formik.values.category}
                              onChange={handleChange}
                            >
                              <option value={0}>All</option>
                              {categoryList?.length > 0 ? (
                                categoryList?.map((item, index) => (
                                  <option value={item.categoryId} key={index}>
                                    {item.categoryCode}
                                  </option>
                                ))
                              ) : (
                                <option>No Data</option>
                              )}
                            </FormControl>
                          </InputGroup>
                          {formik.errors.category &&
                            formik.touched.category && (
                              <div className="error text-danger">
                                {formik.errors.category}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FormGrup">
                        <label>Lot/Market Type</label>
                        <div className="max-width250">
                          {console.log(markType, "ji")}
                          <InputGroup>
                            <FormControl
                              as="select"
                              name="markType"
                              value={formik.values.markType}
                              onChange={(e) => {
                                handleChange(e);
                              }}
                            >
                              {/* <option value="A">All</option> */}
                              <option value={0}>All</option>
                              {markType?.length > 0 ? (
                                markType?.map((item, index) => (
                                  <option value={item.marketTypeId} key={index}>
                                    {item.marketTypeName}
                                  </option>
                                ))
                              ) : (
                                <option>No Data</option>
                              )}
                            </FormControl>
                          </InputGroup>
                          {formik.errors.markType &&
                            formik.touched.markType && (
                              <div className="error text-danger">
                                {formik.errors.markType}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="BtnGroup">
                        {modalRight?.includes("12") && (
                          <Button className="SubmitBtn" type="submit">
                            Search
                          </Button>
                        )}

                        {modalRight?.includes("1") && markTypeValue === "0" ? (
                          <Button
                            className="SubmitBtn"
                            onClick={() => setOpenConformationModal(true)}
                          >
                            Generate Lot No
                          </Button>
                        ) : (
                          ""
                        )}
                        {rows.length > 0 && (<Button className="SubmitBtn" onClick={handleExportToPdfCatalogList}>
                          Print
                        </Button>)}
                        {modalRight?.includes("8") && (
                          <button
                            type="button"
                            onClick={() =>
                              PrintableTable(
                                expaspdfcolumn,
                                rows?.length > 0
                                  ? rows.map(obj => {
                                    for (const key in obj) {
                                      if (obj[key] === undefined || obj[key] === null) {
                                        obj[key] = "-";
                                      }
                                    }
                                    return obj;
                                  })
                                  : [],
                                "Kutcha Catalog"
                              )
                            }
                            className="SubmitBtn btn"
                          >
                            Export as Pdf
                          </button>
                        )}

                        {/* <Button
                      className="SubmitBtn"
                      onClick={() => formik.resetForm()}
                    >
                      <i class="fa fa-refresh"></i>
                    </Button> */}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-12">
                      <strong>Lot Count :</strong>
                      {rows?.length === null ? 0 : rows?.length}
                    </div>
                    <div className="col-12">
                      <ul style={{ "font-weight": "bold" }}>
                        <li>
                          ● If values are uploaded in Base Price, Reserve Price,
                          Price Increment, Auctioneer Valuation, then system
                          won't take the values and Auctioneer can upload/Add
                          all these values after catalog is published.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="BtnGroup">
                        {modalRight?.includes("9") && (
                          <>
                            <Button
                              className="SubmitBtn"
                              onClick={handleExportExcel}
                            >
                              Export as Excel
                            </Button>
                            {auctionType === "ENGLISH" &&
                              markTypeValue !== "0" ? (
                              <Button
                                type="button"
                                disable
                                className="SubmitBtn btn"
                                onClick={() => {
                                  setOpenUploadValuation(true);
                                }}
                              >
                                Upload Valuation
                              </Button>
                            ) : (
                              ""
                            )}
                            {isPublishDate && (
                              <Button
                                className="SubmitBtn"
                                onClick={() => {
                                  if (
                                    formik.values.season.toString() !== "" &&
                                    parseInt(formik.values.saleNo) !== null
                                  ) {
                                    let data = {
                                      auctionCenterId: auctionCenterId,
                                      auctioneerId: userId,
                                      season: formik.values.season.toString(),
                                      saleNo: parseInt(formik.values.saleNo),
                                    };
                                    axiosMain
                                      .post(
                                        `/preauction/${baseUrlEng}/GetPendingSessionsForManualPublish?role=` +
                                        roleCode,
                                        data
                                      )
                                      .then((res) => {
                                        if (res.data.statusCode === 200) {
                                          setOpenMenualValuation(true);
                                          setMenualPublishRows(
                                            res.data.responseData
                                          );
                                        } else {
                                          CustomToast.warning(res.data.message);
                                        }
                                      });
                                  }
                                }}
                              >
                                Publish
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-2">
                    {/* <PDFDownloadLink
                    document={<KutchaCataloguePDF data={rows} />}
                    fileName="kutcha_catalogue.pdf"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? "Loading document..." : "Export as PDF"
                    }
                  </PDFDownloadLink> */}
                  </div>

                  {/* <div>
                <div className="SelectAll">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="defaultCheck1"
                      checked={selectAllRow}
                      onChange={handleSelectAllChange}
                    />
                    <label className="form-check-label" for="defaultCheck1">
                      Select All
                    </label>
                  </div>
                </div> 
              </div> */}
                </form>
                <div
                  id={rows?.length > 0 ? "invoiceTable" : "invoiceTable" + "c"}
                >
                  {/* <TableComponent
                columns={kutcha}
                rows={rows}
                setRows={setRows}
                dragdrop={false}
                fixedColumnsOn={false}
                resizeingCol={false}
                selectionCol={true}
                sorting={true}
              /> */}
                  {/* <TableComponent columns={kutcha} data={rows} />
                   */}
                  <KutchaTable
                    rows={rows}
                    setRows={setRows}
                    status={formik.values.LotNoStatus}
                    formik={formik}
                    modalRight={modalRight}
                    auctionType={auctionType}
                    baseUrlEng={baseUrlEng}
                    markTypeValue={markTypeValue}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </>
        )}
        {/* <Accordion
          expanded={expandedTab === "panel2"}
          onChange={handleAccordionChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>AWR Maintenance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AWRForm />
          </AccordionDetails>
        </Accordion> */}
      </div>
      <UploadValuation
        openUploadValuation={openUploadValuation}
        setOpenUploadValuation={setOpenUploadValuation}
        auctionCatalogDetail={formik.values}
        loggedUser={JSON.parse(sessionStorage.getItem("User"))}
        setMyCatalogRows={setRows}
        baseUrlEng={baseUrlEng}
        // timeData={timeData}
        kuchacatalogValuaction={true}
      />
      <Modal
        size="xl"
        title="Valuation"
        show={openMenualValuation}
        handleClose={() => setOpenMenualValuation(false)}
      >
        <MenualPublishDataTable
          menualPublishrows={menualPublishrows}
          setMenualPublishRows={setMenualPublishRows}
          setOpenMenualValuation={setOpenMenualValuation}
          otherData={{
            season: formik.values.season,
            saleNo: formik.values.saleNo,
          }}
        />
      </Modal>
      {/* MODAL PRINT */}
      <Modals
        size="l"
        title="Select For Print"
        show={openPrintModel}
        handleClose={() => {
          setopenPrintModel(false);
        }}
      >
        <PrintInvoice
          fields={[]}
          showcheckboxlebels={columndata}
          rows={printrow.length > 0 ? printrow : []}
          pageName={"Prs Auction catalog"}
        />
      </Modals>
    </>
  );
};

export default ModalForm;
