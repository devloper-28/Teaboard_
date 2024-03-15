import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  FormControl,
  InputGroup,
  Form,
  Table,
  Card,
} from "react-bootstrap";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx"; // Library for Excel file reading
import { saveAs } from "file-saver";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modals from "../../../../components/common/Modal";
import PrintInvoice from "../../../../components/common/Print/print";
// import { format } from "date-fns"; // Import the format function from date-fns

import {
  addInvoiceDetailsRequest,
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchMarkRequest,
  fetchSaleProgramListRequest,
  fetchWarehouseUserRequest,
  getSaleNoRequest,
  teaTypeAction,
} from "../../../../store/actions/index";
import { useSelector } from "react-redux";
import { fetchSubTeaTypeRequest } from "../../../../store/actions/teaType/TeaType";
import UploadeFile from "./UploadeFile";

import axios from "axios";
import axiosMain from "../../../../http/axios/axios_main";
import FileUpload from "../../../../components/common/uploadFile/FileUpload";
import { readFileAndCheckHeaders } from "../../../../components/common/uploadFile/utils";
import CustomToast from "../../../../components/Toast";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";

const currentDate = new Date();
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".xls", ".xlsx"];

const validationSchema = Yup.object().shape({
  mark: Yup.number().required("Please select mark"),
  warehouse: Yup.string().required("Warehouse is required"),
  warehouseName: Yup.string().required("Warehouse Name is required"),
  warehouseAddress: Yup.string().required("Warehouse Address is required"),
  invoiceNo: Yup.string().required("Invoice No is required"),
  invoiceQty: Yup.string().required("Invoice Qty is required"),
  // origin: Yup.string().required("Origin is required"),
  // manufacture: Yup.string().required("Manufacture is required"),
  // grade: Yup.string().required("Grade is required"),

  manufactureFromDate: Yup.date().required("From Date is required"),
  manufactureToDate: Yup.date()
    .required("To Date is required")
    .min(
      Yup.ref("manufactureFromDate"),
      "To Date must be greater than or equal to From Date"
    ),

  dateOfDispatch: Yup.date().required("Date of Dispatch is required"),
  // invoiceDate: Yup.date().required("Invoice Date is required"),
  season: Yup.string().required("Please select Season"),
  saleNo: Yup.string().required("Please select Sale No"),
  auctioneer: Yup.string().required("Auctioneer is required"),
  // lorryReceiptNo: Yup.string().required("Lorry Receipt No is required"),
  // lorryNo: Yup.string().required("Lorry No is required"),
  // invRefNo: Yup.string().required("Inv Ref No is required"),
  // carrier: Yup.string().required("Carrier is required"),
  subType: Yup.number()
    .min(1, "Please select sub tea type")
    .required("Sub Type is required"),
  teaType: Yup.number()
    .min(1, "Please select tea type")
    .required("Tea Type is required"),
  category: Yup.number()
    .required("Category is required")
    .min(1, "Please select Category type"),
  // packageSize: Yup.string().required("Package Size is required"),
  packageType: Yup.string().required("Package Type is required"),
  packageNo: Yup.string()
    .required("Package No is required")
    .test(
      "is-package-range",
      "Enter the appropriate package number.For example, 1-25, 10-50, 001-0030, etc.",
      function (value) {
        if (!/^\d+-\d+$/.test(value)) {
          return false; // Incorrect format, handled by the regular expression test
        }

        const [start, end] = value.split("-");
        return parseInt(start) < parseInt(end);
      }
    ),
  totalPackages: Yup.string().required("Total Packages is required"),
  grossKgs: Yup.number()
    .typeError("Gross Kgs must be a number")
    .positive("Gross Kgs must be a positive number")
    .test(
      "is-numeric-with-decimal",
      "Positive Numeric with two digits after decimal point Non-zero.",
      function (value) {
        return /^\d+(\.\d{1,2})?$/.test(value);
      }
    )
    .min(0.01, "Gross Kgs must be at least 0.01"),

  tareKgs: Yup.number()
    .required("Tare Kgs is required")
    .typeError("Tare KGs must be a number")
    .positive("Tare KGs must be a positive number")
    .test(
      "is-numeric-with-decimal",
      "Positive Numeric with two digits after decimal point Non-zero.",
      function (value) {
        return /^\d+(\.\d{1,2})?$/.test(value);
      }
    )
    .min(0.01, "Gross Kgs must be at least 0.01")
    .lessThan(Yup.ref("grossKgs"), "Tare KGs must be less than Gross KGs"),
  netKgs: Yup.string().required("Net Kgs is required"),
  totalNetKgs: Yup.string().required("Total Net Kgs is required"),
  // gpNo: Yup.string().required("Gp No is required"),
  // gpDate: Yup.string().required("Gp Date is required"),
  // shortExcessWeight: Yup.number()
  //   // .required("Short ExcessWeight is required")
  //   .typeError("Short/Excess Weight must be a number")
  //   .positive("Short/Excess Weight must be a positive number")
  //   .test(
  //     "validate-short-excess-weight",
  //     "Short/Excess Weight should not be greater than (Package No * (Gross Weight - Tare Weight))",
  //     function (value) {
  //       const packageNo = this.resolve(Yup.ref("totalPackages"));
  //       const grossWeight = this.resolve(Yup.ref("grossKgs"));
  //       const tareWeight = this.resolve(Yup.ref("tareKgs"));
  //       const maxShortExcessWeight = packageNo * (grossWeight - tareWeight);
  //       return value <= maxShortExcessWeight;
  //     }
  //   ),
  // locationInsideWarehouse: Yup.string().required(
  //   "location InsideWarehouse is required"
  // ),
  // invoiceRefNo: Yup.string().required("invoiceRefNo is required"),
});
const initialValues = {
  mark: 0,
  warehouse: 0,
  warehouseName: "",
  warehouseAddress: "",
  invoiceNo: "",
  invoiceQty: "",
  // origin: "",
  manufacture: "",
  grade: 0,
  manufactureFromDate: currentDate.toISOString().split("T")[0],
  manufactureToDate: currentDate.toISOString().split("T")[0],
  dateOfDispatch: "",
  invoiceDate: currentDate.toISOString().split("T")[0],
  season: new Date().getFullYear(),
  saleNo: "",
  auctioneer: 5, //auctioner
  lorryReceiptNo: "",
  lorryNo: "",
  invRefNo: 0,
  carrier: "",
  teaType: 0,
  subType: 0,
  category: 0,
  packageSize: "",
  packageType: "",
  packageNo: "",
  totalPackages: 0,
  sampleQty: 0,
  grossKgs: "",
  tareKgs: "",
  netKgs: "",
  totalNetKgs: 0,
  gpNo: "",
  gpDate: "",
  shortExcessWeight: "",
  locationInsideWarehouse: "",
  invoiceRefNo: "",
};
const CreateInvoiceForm = ({
  isDisabled,
  invoiceResponseData,
  viewData,
  srNo,
  handleAccordionChange,
  invoiceStatusLable,
  receivedDateLable,
  isEdit,
  modalRight,
  setExpandedTab,
  setRows,
}) => {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    auction,
    roleCode,
    auctionTypeMasterCode,
    userCode,
  } = useAuctionDetail();

  const [auctionType, setAuctionType] = useState(auction);
  const [auctionTypeCode, setAuctionTypeCode] = useState(auctionTypeMasterCode);
  const baseUrlEngn =
    auction === "ENGLISH" ? "EnglishAuctionInvoiceDetails" : "InvoiceDetails";
  const [baseUrlEng, setbaseUrlEng] = useState(baseUrlEngn);
  // const [formInitialData, setFormInitialData] = useState(initialValues);
  const [saleprogrmId, setsaleprogrmId] = useState(null);
  const [catalogClosingDate, setCatalogClosingDate] = useState(null);
  const [warehouseUserRegIdOnEdit, setWarehouseUserRegIdOnEdit] = useState([]);
  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [saleNo, setSaleNo] = useState([]);
  const [subTeaTypeNo, setSubTeaTypeNo] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [FileErrors, setErrors] = useState({});
  const [invoiceData, setInvoiceData] = useState([]);
  const [catagory, setCategory] = useState([]);
  const [sampleList, setSampleList] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [validationData, setValidationData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [auctioneer, setAuctioneer] = useState([]);
  const [propertyNameList, setPropertyNameList] = useState([]);
  const [uploadData, setUploadData] = useState([]);
  const [manufacturerIdd, setmanufacturerIdd] = useState(0);
  const [openModalConformation, setOpenModalConformation] = useState(false);
  const [origindata, setorigin] = useState(false);
  const [
    openModalConformationInvalidData,
    setOpenModalConformationInvalidData,
  ] = useState(false);
  const [
    openModalConformationInvalidDataTitle,
    setOpenModalConformationInvalidDataTitle,
  ] = useState({});
  const [openModalConformationTitle, setOpenModalConformationTitle] =
    useState("");

  const [packegetype, setpackegetype] = useState([]);
  const [packegesize, setpackegesize] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPrintModel, setopenPrintModel] = useState(false);
  const [printrow, setprintrow] = useState([]);
  const manuallypropertyNames = [
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
      title: "Tea Type",
      getCellValue: ({ ...row }) => (
        <span>
          {teaTypeList?.map((ele) =>
            ele.teaTypeId == row?.teatypeid ? ele.teaTypeName : ""
          )}
        </span>
      ),
    },
    { name: "saleNo", title: "Sale No" },
    {
      name: "wareHouseUserReg",
      title: "Warehouse User Registration",
      getCellValue: ({ ...row }) => (
        <span>
          {warehouseUserList?.map((ele) =>
            ele.wareHouseUserRegId === row?.wareHouseUserRegId
              ? ele.wareHouseName
              : ""
          )}
        </span>
      ),
    },
    // { name: "auctioneerId", title: "Auctioneer ID" },
    {
      name: "categoryId",
      title: "Category",
      getCellValue: ({ ...row }) => (
        <span>
          {category?.map((ele) =>
            ele.categoryId === row?.categoryId ? ele.categoryName : ""
          )}
        </span>
      ),
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
      name: "subTeaTypeId",
      title: "Sub Tea Type",
      getCellValue: ({ ...row }) => (
        <span>
          {subTeaType?.map((ele) =>
            ele.subTeaTypeId === row?.subTeaTypeId ? ele.subTeaTypeName : ""
          )}
        </span>
      ),
    },
    {
      name: "gradeId",
      title: "Grade",
      getCellValue: ({ ...row }) => (
        <span>
          {gradesList?.map((ele) =>
            ele.gradeId === row?.gradeId ? ele.gradeName : ""
          )}
        </span>
      ),
    },
    {
      name: "packageType",
      title: "Package Type",
      // getCellValue: ({ ...row }) => <span>Paper sacks</span>,
    },
    {
      name: "packageSize",
      title: "Package Size",
      // getCellValue: ({ ...row }) => <span> 27x21x11</span>,
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
    // {
    //   name: "action",
    //   title: "Action",
    //   getCellValue: ({ ...row }) => <ActionArea data={row} />,
    // },
  ];
  const handleDownload = () => {
    let documentName = "InvoiceSample.xlsx";

    // Get the current date and time
    let currentDate = new Date();
    let options = { timeZone: "Asia/Kolkata" }; // Set the time zone to Indian Standard Time
    let formattedDate = currentDate
      .toLocaleString("en-US", options)
      .replace(/[\/.,]/g, "-"); // Format the date as a string and replace certain characters

    // Append the formatted date and time to the document name
    documentName = documentName.replace(/\.xlsx$/, `_${formattedDate}.xlsx`);
    // "http://192.168.100.164:5080/preauction/Common/GenerateExcel"
    axiosMain
      .post(
        // "/preauction/InvoiceDetails/DownloadInvoiceSampleExcel?role=" +roleCode,
        "/preauction/Common/GenerateExcel",
        {
          season: formik.values.season.toString(),
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
          auctioneerId: userId,
          factoryId: parseInt(manufacturerIdd),
          status: 0,
        }
        // rows?.map((ele) => {
        //   return { LotNo: ele.LotNo };
        // })
      )
      .then((res) => {
        let documentBytes = res?.data;

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

  function reCallAllApi() {
    dispatch(teaTypeAction({ auctionCenterId }));
    dispatch(fetchMarkRequest({ auctionCenterId }));
    // dispatch(fetchWarehouseUserRequest({ auctionCenterId }));
    dispatch(fetchGradeRequest({ auctionCenterId }));

    axiosMain
      .post("/admin/WareHouseUserReg/dropdown/wareHouseNameDetail", {
        auctionCenterId,
      })
      .then((res) => {
        setWarehouseUserList(res.data.responseData);
        if (isDisabled !== true && isEdit !== true)
          formik.setFieldValue(
            "warehouse",
            res?.data?.responseData[0]?.wareHouseUserRegId.toString()
          );
      })
      .catch((err) => CustomToast.error(err));
    // dispatch(fetchSaleProgramListRequest(saleData));
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
      .catch((err) => CustomToast.error(err));
    dispatch(fetchSubTeaTypeRequest(formik.values.teaType, auctionCenterId));
    dispatch(
      fetchCategoryRequest({
        teaTypeId: formik.values.teaType,
        auctionCenterId,
      })
    );
    // dispatch(fetchCategoryRequest());
    // axiosMain.post("/admin/Category/search", { isActive: 1 }).then((res) => {
    //   if (res.data.statusCode === 200) {
    //     setCategory(res.data.responseData);
    //   } else {
    //     setCategory([]);
    //   }
    // });

    axiosMain
      .post(
        "/preauction/Common/BindMark?auctionCenterId=" + auctionCenterId,
        {}
      )
      .then((res) => {
        if (res.data.statusCode === 200) {
          setMarkDataList(res.data.responseData);
        } else {
          setMarkDataList([]);
        }
      });

    axiosMain
      .post(
        `/preauction/${baseUrlEng}/GetAuctioneerByCenter?auctionCenterId=${auctionCenterId}`
      )
      .then((response) => {
        // Handle the API response here

        if (roleCode === "AUCTIONEER") {
          formik.setFieldValue(
            "auctioneer",
            response.data.responseData.filter(
              (item) => item.userCode == userCode
            )[0]?.userId
          );
        } else {
          formik.setFieldValue(
            "auctioneer",
            response.data.responseData?.at(0)?.userId
          );
        }

        setAuctioneer(response.data.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });

    if (isDisabled === true) {
      formik.setValues(viewData);
    } else {
      formik.setValues(initialValues);
    }

    axiosMain
      .post(`/admin/packageType/dropdown/getpackageType`, {
        auctionCenterId: auctionCenterId,
      })
      // .post(`/admin/packageType/search`, {
      //   isActive: 1,
      // })
      .then((response) => {
        setpackegetype(response.data.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });
    axiosMain
      .post(`/admin/packageSize/search`, {
        isActive: 1,
      })
      .then((response) => {
        // Handle the API response here

        setpackegesize(response.data.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });
  }
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setPropertyNameList(manuallypropertyNames);

      const data = {
        markId: parseInt(values?.mark),
        season: values?.season.toString(),
        teaTypeId: parseInt(values?.teaType),
        saleNo: parseInt(values?.saleNo),
        SaleProgramId: saleprogrmId,
        wareHouseUserRegId: parseInt(values?.warehouse),
        auctioneerId: userId,
        categoryId: parseInt(values?.category),
        manufactureFromDate: values?.manufactureFromDate,
        manufactureToDate: values?.manufactureToDate,
        dateOfDispatch: values?.dateOfDispatch,
        invoiceDate: values?.invoiceDate,
        carrier: values?.carrier,
        lorryReceiptNo: values?.lorryReceiptNo,
        lorryNo: values?.lorryNo,
        invoiceNo: values?.invoiceNo,
        arrivalDate: values?.arrivalDate,
        awrDate: values?.awrDate,
        awrReferenceNo: values?.awrReferenceNo,
        subTeaTypeId: parseInt(values?.subType),
        gradeId:
          parseInt(values?.grade) === 0
            ? gradesList?.at(0)?.gradeId
            : parseInt(values?.grade),
        packageType: values?.packageType,
        packageSize: values?.packageSize,
        packageNo: values?.packageNo,
        totalPackages: parseInt(values?.totalPackages),
        grossKgs: parseInt(values?.grossKgs),
        tareKgs: parseInt(values?.tareKgs),
        netKgs: parseInt(values?.netKgs),
        totalNetKgs: parseInt(values?.totalNetKgs),
        gpNo:
          values?.gpNo === undefined || values?.gpNo === ""
            ? null
            : values?.gpNo,
        gpDate: values?.gpDate,
        shortExcessWeight:
          values?.shortExcessWeight === undefined ||
          values?.shortExcessWeight === null ||
          values?.shortExcessWeight === ""
            ? 0
            : parseInt(values?.shortExcessWeight),
        locationInsideWarehouse: values?.locationInsideWarehouse,
        isActive: true,
        createdBy: userId, //auctioner
        invoiceRefNo: values?.invoiceRefNo,
        invoiceQty: parseInt(values?.invoiceQty),
        DataFlag: "",
        TeaType: "",
        Category: "",
        Grade: "",
        Mark: "",
        SubTeaType: "",
        Warehouse: "",
        Auctioneer: "",
        auctionCenterId: auctionCenterId,
      };
      setInvoiceData([...invoiceData, data]);
      handleAccordionChange("panel1");
      resetForm();
      reCallAllApi();
      // Handle form submission here
      // console.log(data, "😒😒😒");
    },
  });
  // console.log(parseInt(saleprogrmId), "saleee");
  useEffect(() => {
    let data = viewData?.data?.responseData?.at(0);
    console.log(data, "viewData");

    if (viewData?.data?.responseData?.length > 0) {
      setWarehouseUserRegIdOnEdit(data.warehouse);
      setorigin(data?.Origin);
      formik.setFieldValue("warehouse", data.warehouse);
      formik.setValues({
        ...formik.values,
        mark: data.mark,
        warehouse: data.warehouse,
        warehouseName: data.warehouseName,
        warehouseAddress: data.address,
        invoiceNo: data.invoiceNo,
        invoiceQty: data.invoiceQty,
        receivedDate: data.receivedDate,
        manufacture: data.manufacturerName,
        grade: data.grade,
        manufactureFromDate:
          viewData?.data?.responseData?.length > 0 && isEdit === true
            ? viewData?.data?.responseData
                ?.at(0)
                ?.manufactureFromDate?.split("T")[0]
            : data.manufactureFromDate?.split("T")?.at(0),
        manufactureToDate: data.manufactureToDate,
        dateOfDispatch: data.dateOfDispatch,
        invoiceDate: data.invoiceDate,
        season: data.season,
        saleNo: data.saleNo,
        lorryReceiptNo: data.lorryReceiptNo,
        lorryNo: data.lorryNo,
        carrier: data.carrier,
        teaType: data.teaType,
        subType: data.subTeaType,
        category: data.category,
        packageSize: data.packageSize,
        packageType: data.packageType,
        packageNo: data.packageNo,
        totalPackages: data.totalPackages,
        sampleQty: 0,
        grossKgs: data.grossKgs,
        tareKgs: data.tareKgs,
        netKgs: data.netKgs,
        totalNetKgs: data.totalNetKgs,
        gpNo: data.gpNo,
        gpDate:
          viewData?.data?.responseData?.length > 0 && isEdit === true
            ? viewData?.data?.responseData?.at(0)?.gpDate?.split("T")[0]
            : data.gpDate?.split("T")?.at(0),
        shortExcessWeight: data.shortExcessWeight,
        locationInsideWarehouse: data.locationInsideWarehouse,
        invoiceRefNo: data.invoiceRefNo,
      });

      console.log(data.subTeaType, data.totalNetKgs, "data.subTeaType");
    } else {
      // console.log(viewData, "viewData");
      formik.resetForm();
    }

    // console.log(viewData, "viewData");
  }, [viewData]);
  // useEffect({wareHouseUserRegDetail},[formik.values.warehouse])

  const saleData = {
    season: formik.values.season?.toString(),
    saleNo: 0,
    pageNumber: 2,
    pageSize: 10,
  };

  // const [formData, setFormData] = useState();

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
    (state) => state?.auction?.saleNumber?.responseData
  );
  const category = useSelector((state) => state?.category?.data?.responseData);
  console.log(saleNumber, "😒😒😒F");

  const fileInputRef = useRef(null);

  const propertyNames = [
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
    {
      name: "arrivalDate",
      title: "Arrival Date",
      getCellValue: ({ ...row }) => (
        <span>{row.arrivalDate === "" ? "-" : row.arrivalDate}</span>
      ),
    },
    {
      name: "awrDate",
      title: "AWR Date",
      getCellValue: ({ ...row }) => (
        <span>{row.awrDate === "" ? "-" : row.awrDate}</span>
      ),
    },
    {
      name: "awrReferenceNo",
      title: "AWR Reference Number",
    },
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
      // getCellValue: ({ ...row }) => <span>Paper sacks</span>,
    },
    {
      name: "packageSize",
      title: "Package Size",
      // getCellValue: ({ ...row }) => <span> 27x21x11</span>,
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
    // {
    //   name: "action",
    //   title: "Action",
    //   getCellValue: ({ ...row }) => <ActionArea data={row} />,
    // },
  ];

  // const handleFileRemove = (index) => {
  //   setUploadedFiles((prevFiles) => {
  //     const updatedFiles = [...prevFiles];
  //     updatedFiles.splice(index, 1);
  //     return updatedFiles;
  //   });
  //   setInvoiceData([]);
  // };
  // console.log(teaType);
  const dispatch = useDispatch();

  const { handleChange, handleBlur, values, touched, errors } = formik;

  useEffect(() => {
    dispatch(teaTypeAction({ auctionCenterId }));
    dispatch(fetchMarkRequest({ auctionCenterId }));
    // dispatch(fetchWarehouseUserRequest({ auctionCenterId }));
    dispatch(fetchGradeRequest({ auctionCenterId }));

    axiosMain
      .post("/admin/WareHouseUserReg/dropdown/wareHouseNameDetail", {
        auctionCenterId,
      })
      .then((res) => {
        setWarehouseUserList(res.data.responseData);
        if (isDisabled !== true && isEdit !== true)
          formik.setFieldValue(
            "warehouse",
            res?.data?.responseData[0]?.wareHouseUserRegId.toString()
          );
      })
      .catch((err) => CustomToast.error(err));
    // dispatch(fetchSaleProgramListRequest(saleData));
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
      .catch((err) => CustomToast.error(err));
    dispatch(fetchSubTeaTypeRequest(formik.values.teaType, auctionCenterId));
    dispatch(
      fetchCategoryRequest({
        teaTypeId: formik.values.teaType,
        auctionCenterId,
      })
    );
    // dispatch(fetchCategoryRequest());
    // axiosMain.post("/admin/Category/search", { isActive: 1 }).then((res) => {
    //   if (res.data.statusCode === 200) {
    //     setCategory(res.data.responseData);
    //   } else {
    //     setCategory([]);
    //   }
    // });

    axiosMain
      .post(
        "/preauction/Common/BindMark?auctionCenterId=" + auctionCenterId,
        {}
      )
      .then((res) => {
        if (res.data.statusCode === 200) {
          setMarkDataList(res.data.responseData);
        } else {
          setMarkDataList([]);
        }
      });

    axiosMain
      .post(
        `/preauction/${baseUrlEng}/GetAuctioneerByCenter?auctionCenterId=${auctionCenterId}`
      )
      .then((response) => {
        // Handle the API response here

        if (roleCode === "AUCTIONEER") {
          formik.setFieldValue(
            "auctioneer",
            response.data.responseData.filter(
              (item) => item.userCode == userCode
            )[0]?.userId
          );
        } else {
          formik.setFieldValue(
            "auctioneer",
            response.data.responseData?.at(0)?.userId
          );
        }

        setAuctioneer(response.data.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });

    if (isDisabled === true) {
      formik.setValues(viewData);
    } else {
      formik.setValues(initialValues);
    }

    axiosMain
      .post(`/admin/packageType/dropdown/getpackageType`, {
        auctionCenterId: auctionCenterId,
      })
      // .post(`/admin/packageType/search`, {
      //   isActive: 1,
      // })
      .then((response) => {
        setpackegetype(response.data.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });
    axiosMain
      .post(`/admin/packageSize/search`, {
        isActive: 1,
      })
      .then((response) => {
        // Handle the API response here

        setpackegesize(response.data.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });
  }, []);

  useEffect(() => {
    dispatch(fetchSubTeaTypeRequest(formik.values.teaType, auctionCenterId));
    dispatch(
      fetchCategoryRequest({
        teaTypeId: parseInt(formik.values.teaType),
        auctionCenterId,
      })
    );
  }, [formik.values.teaType]);

  useEffect(() => {
    setSubTeaTypeNo(subTeaType);
  }, [subTeaType]);

  useEffect(() => {
    // setTeaTeatypeList(teaType);
    // setMarkDataList(markList);
    setGradesList(grades);
    if (
      warehouseUsersList?.at(0)?.wareHouseUserRegId !== undefined &&
      warehouseUsersList?.at(0)?.wareHouseUserRegId !== null
    ) {
      formik.setFieldValue(
        "warehouse",
        warehouseUsersList?.at(0)?.wareHouseUserRegId
      );
    }

    formik.setFieldValue("auctioneerId", auctioneer?.at(0)?.userId);
    setCategory(category);
    // formik.setFieldValue("mark", markList?.at(0)?.markId);
  }, [teaType, warehouseUsersList, grades, category]);

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
            setInvoiceData(
              [...invoiceData].filter((ele) => ele.invoiceNo !== row.invoiceNo)
            );
            // console.log(row,"invData")
          }}
        >
          <DeleteIcon />
        </Button>
      </>
    );
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

  function resetFunction() {
    formik.resetForm();
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

  function netKagesCalculation(gross, tare) {
    if (gross > tare) {
      return gross - tare;
    } else {
      CustomToast.error(
        "Tare KGs cannot be greater than or equal to Gross KGs"
      );
    }
  }

  function totalNetKagesCalculation(totalPackage, netKags, sampleQty) {
    const result = totalPackage * netKags;

    return result - sampleQty;
  }
  const hasMatchingHeaders = (data1, data2) => {
    if (!data1 || !data2 || data1.length === 0 || data2.length === 0) {
      return false;
    }

    const headers1 = Object.keys(data1[0]);
    const headers2 = Object.keys(data2[0]);

    return (
      headers1.length === headers2.length &&
      headers1.every((header) => headers2.includes(header))
    );
  };

  // console.log(invoiceData, "hi");

  function toCamelCase(str) {
    return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
  }
  function convertKeysToCamelCaseArray(dataArray) {
    return dataArray.map((dataObj) => {
      const newObj = {};
      for (const key in dataObj) {
        if (dataObj.hasOwnProperty(key)) {
          const camelCaseKey = toCamelCase(key);
          newObj[camelCaseKey] = dataObj[key];
        }
      }
      return console.log(newObj, "hi");
    });
  }

  useEffect(() => {
    // console.log(formik.values.warehouse, "formik.values.warehouse");
    if (
      formik.values.warehouse !== undefined &&
      formik.values.warehouse !== null
    ) {
      axiosMain
        .post(`/admin/WareHouseUserReg/dropdown/wareHouseUserRegDetail`, {
          wareHouseUserRegId: parseInt(formik.values.warehouse),

          // auctionCenterId,
        })
        .then((response) => {
          response.data.responseData?.map((ele) =>
            formik.setFieldValue("warehouseAddress", ele.address)
          );
          response.data.responseData?.map((ele) =>
            formik.setFieldValue("warehouseName", ele.wareHouseName)
          );
        })
        .catch((err) => console.log(err));
    }
  }, [formik.values.warehouse]);

  useEffect(() => {
    // console.log(formik.values.warehouse, "formik.values.warehouse");
    axiosMain
      .post(`/admin/factory/dropdown/getFactory`, {
        markId: parseInt(formik.values.mark),
        auctionCenterId,
      })
      .then((response) => {
        response.data.responseData?.map((ele) => {
          formik.setFieldValue("manufacture", ele.factoryName);
          setmanufacturerIdd(ele.factoryId);
        });
      })
      .catch((err) => console.log(err));
  }, [formik.values.mark]);

  useEffect(() => {
    const firstValue = parseInt(formik.values.packageNo?.split("-")[0]);
    const secondValue = parseInt(formik.values.packageNo?.split("-")[1]);
    let result = firstValue - secondValue;
    if (firstValue > secondValue) {
      result = firstValue - secondValue;
    } else {
      result = secondValue - firstValue;
    }
    formik.setFieldValue("totalPackages", result + 1);
    // console.log(, "formik.values");
  }, [formik.values.packageNo]);

  useEffect(() => {
    let gross = formik.values.grossKgs === "" ? 0 : formik.values.grossKgs;
    let tare = formik.values.tareKgs === "" ? 0 : formik.values.tareKgs;

    if (parseInt(gross) > parseInt(tare)) {
      formik.setFieldValue("netKgs", parseInt(gross) - parseInt(tare));
    } else formik.setFieldValue("netKgs", 0);
  }, [formik.values.grossKgs, formik.values.tareKgs]);

  useEffect(() => {
    if (markDataList.length > 0) {
      formik.setFieldValue("mark", markDataList?.at(0)?.markId);
    }
  }, [markDataList]);

  useEffect(() => {
    const totalPackage =
      formik.values.totalPackages === "" ? 0 : formik.values.totalPackages;
    const netKags = parseInt(formik.values.netKgs);
    const sampleQty =
      formik.values.sampleQty === "" ? 0 : formik.values.sampleQty;
    const result = totalPackage * netKags;

    formik.setFieldValue("totalNetKgs", result - sampleQty);
    console.log("totalNetKgs", result, sampleQty);
  }, [
    formik.values.grossKgs,
    formik.values.tareKgs,
    formik.values.netKgs,
    formik.values.totalPackages,
  ]);

  useEffect(() => {
    //const totalPackage = formik.values.totalPackages;
    const firstValue = parseInt(formik.values.packageNo?.split("-")[0]);
    const secondValue = parseInt(formik.values.packageNo?.split("-")[1]);
    let result1 = firstValue - secondValue;
    if (firstValue > secondValue) {
      result1 = firstValue - secondValue;
    } else {
      result1 = secondValue - firstValue;
    }
    result1 = result1 + 1;
    const netKags = parseInt(formik.values.netKgs);
    const sampleQty = formik.values.sampleQty;

    const result = result1 * netKags;
    formik.setFieldValue(
      "invoiceQty",
      result -
        sampleQty -
        parseInt(
          formik.values.shortExcessWeight === "" ||
            formik.values.shortExcessWeight === undefined
            ? 0
            : formik.values.shortExcessWeight
        )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.sampleQty,
    formik.values.netKgs,
    formik.values.tareKgs,
    formik.values.packageNo,
    formik.values.shortExcessWeight,
  ]);
  useEffect(() => {
    console.log("api cal");
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    console.log(saleNo, season, "sas");
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

    // Data to be sent in the POST request

    if (saleNo !== null && season !== "") {
      // Making the POST request using Axios

      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season?.toString(),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          setbaseUrlEng(
            response?.data?.responseData[0]?.auctionTypeCode === "BHARAT"
              ? "InvoiceDetails"
              : "EnglishAuctionInvoiceDetails"
          );
          // Handle the API response here
          const isCatalogClosingDateGreater =
            new Date(response?.data?.responseData[0]?.catalogClosingDate) >
            new Date();

          console.log(
            isCatalogClosingDateGreater,
            response?.data?.responseData[0]?.catalogClosingDate,
            "11111"
          );

          if (isCatalogClosingDateGreater) {
            setCatalogClosingDate(
              response?.data?.responseData[0]?.catalogClosingDate
            );
          } else {
            // CustomToast.error("Max Limit Catalog Closing Date");
            // setCatalogClosingDate(
            //   response?.data?.responseData[0]?.catalogClosingDate
            // );\
            if (isDisabled) {
              console.log(
                response?.data?.responseData[0]?.catalogClosingDate,
                "11111"
              );
            } else {
              // CustomToast.error(" Catalog Closing Date is expired");
            }
          }
        })
        .catch((error) => {
          // Handle errors here
        });
    } else {
      console.log(saleNo);
    }

    // Cleanup function, in case you need to cancel the request
  }, [formik.values.saleNo, formik.values.season]);

  function BindSaleprogramId(saleNos, seasons) {
    const saleNo = saleNos;
    const season = seasons;
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (saleNo !== null) {
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season.toString(),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          // Handle the API response here
          // setsaleprogrmId();
          // console.log(
          //   invoiceData.filter(
          //     (ele) =>
          //     (ele.SaleProgramId =
          //       response?.data?.responseData[0]?.SaleProgramId)
          // ),
          //   "response?.data?.responseData[0]?.SaleProgramId"
          // );

          let data = validationData.filter(
            (ele) =>
              (ele.SaleProgramId =
                response?.data?.responseData[0]?.SaleProgramId)
          );

          setsaleprogrmId(data);
        })

        .catch((error) => {
          // Handle errors here
          console.log(error);
        });
    }
  }

  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    // API endpoint URL
    // const apiUrl = `/preauction/AuctionSession/GetSaleDateAndTeaType`;
    const apiUrl = `/preauction/Common/BindTeaTypeBySeasonSaleNo`;
    const apiUrlAuctioneer = "/preauction/Common/BindAuctioneerByInvoice";
    // Making the POST request using Axios
    if (saleNo !== "" && season !== undefined) {
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season.toString(),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          // Handle the API response here
          formik.setFieldValue(
            "teaType",
            response?.data?.responseData[0]?.teatypeid
          );
          setTeaTeatypeList(response?.data?.responseData);
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
  useEffect(() => {
    const season = formik.values.season;
    if (season !== undefined) {
      const seasondata = {
        season: season.toString(),
        auctionCenterId: auctionCenterId,
      };
      // Data to be sent in the POST request
      if (!isEdit && !isDisabled) {
        axiosMain
          .post(`/preauction/Common/BindSaleNoBySeason`, seasondata)
          .then((res) => {
            setSaleNo(res.data.responseData);
            formik.setFieldValue("saleNo", res.data.responseData?.at(0).saleNo);
          })
          .catch((err) => CustomToast.error(err));
      }
    }
  }, [formik.values.season]);

  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    // API endpoint URL

    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (formik.values.saleNo !== null) {
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season?.toString(),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          setbaseUrlEng(
            response?.data?.responseData[0]?.auctionTypeCode === "BHARAT"
              ? "InvoiceDetails"
              : "EnglishAuctionInvoiceDetails"
          );
          // Handle the API response here
          // setsaleprogrmId();
          // console.log(
          //   invoiceData.filter(
          //     (ele) =>
          //     (ele.SaleProgramId =
          //       response?.data?.responseData[0]?.SaleProgramId)
          // ),
          //   "response?.data?.responseData[0]?.SaleProgramId"
          // );

          setsaleprogrmId(response?.data?.responseData[0]?.SaleProgramId);
        })
        .catch((error) => {
          // Handle errors here
          console.log(error);
        });
    }
  }, [formik.values.saleNo, formik.values.season]);

  useEffect(() => {
    if (saleprogrmId?.length > 0) {
      setInvoiceData(saleprogrmId);
    } else {
      console.log(saleprogrmId);
    }
  }, [saleprogrmId]);

  const propertyName = [
    "mark",
    "warehouseCode",
    "inv.No",
    "grade",
    "periodOfManufactureFrom",
    "periodOfManufactureTo",
    "dateOfDispatch",
    "invoiceDate",
    "season",
    "saleNo",
    "auctioneerCode",
    "lorryReceiptNo",
    "lorryNo",
    "carrier",
    "teaType",
    "subType",
    "category",
    "packageSize",
    "packageType",
    "packageNos",
    "grossKgs",
    "tareKgs",
    "netKgs",
    "gpNo",
    "gpDate",
    "short/excessWeight",
    "locationInsideWarehouse",
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
    const excelStartDate = new Date(1899, 11, 30); // Excel's incorrect leap year handling
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

  function totalNetKagesCalculation(totalPackage, netKags, sampleQty) {
    const result = totalPackage * netKags;

    return result - sampleQty;
  }

  // function getSaleProgramId(saleNos) {
  //   const saleNo = saleNos;
  //   const season = new Date().getFullYear().toString();
  //   // API endpoint URL
  //   const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo?saleNo=${saleNo}&season=${season}`;

  //   // Data to be sent in the POST request

  //   // Making the POST request using Axios

  // }

  useEffect(() => {
    if (uploadData?.length > 0) setTableData(uploadData);
    else setTableData([]);
  }, [uploadData]);
  useEffect(() => {
    if (invoiceData?.length > 0) setTableData(invoiceData);
    else setTableData([]);
  }, [invoiceData]);

  // useEffect(() => {
  //   if (fileData !== []) {
  //     validation(fileData);
  //   }
  // }, [fileData]);

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
          // console.log(filteredData, "filteredData");
          // console.log(uploadedData, "uploadedData");
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
              totalNetKgs,
              totalPackages,
              warehouseAddress,
              short_excessWeight,
              warehouseCode,
              warehouseName,
            } = fixKeyNames(ele);

            let data = {
              markId: 0,
              season:
                season === null || season === undefined
                  ? ""
                  : season?.toString(),
              teaTypeId: 0,
              saleNo:
                saleNo === null || saleNo === undefined ? "" : parseInt(saleNo),
              SaleProgramId: "",
              wareHouseUserRegId: 0,
              auctioneerId: userId, //auctioner
              categoryId: 0,
              manufactureFromDate: excelDateToJSDate(periodOfManufactureFrom),
              manufactureToDate: excelDateToJSDate(periodOfManufactureTo),
              dateOfDispatch:
                dateOfDispatch === null || dateOfDispatch === undefined
                  ? ""
                  : excelDateToJSDate(dateOfDispatch),
              invoiceDate:
                invoiceDate === null || invoiceDate === undefined
                  ? ""
                  : excelDateToJSDate(invoiceDate),
              carrier:
                carrier === null || carrier === undefined
                  ? ""
                  : carrier?.toString(),
              lorryReceiptNo:
                lorryReceiptNo === null || lorryReceiptNo === undefined
                  ? ""
                  : lorryReceiptNo?.toString(),
              lorryNo:
                lorryNo === null || lorryNo === undefined
                  ? ""
                  : lorryNo?.toString(),
              invoiceNo:
                invNo === null || invNo === undefined ? "" : invNo.toString(),
              arrivalDate:
                arrivalDate === null || arrivalDate === undefined
                  ? ""
                  : excelDateToJSDate(arrivalDate),
              awrDate:
                awrDate === null || awrDate === undefined
                  ? ""
                  : excelDateToJSDate(awrDate),
              awrReferenceNo: null,
              subTeaTypeId: 0,
              gradeId: 0,
              // parseInt(grade) === 0
              //   ? gradesList?.at(0)?.gradeId
              //   : parseInt(grade),
              packageType:
                packageType === null || packageType === undefined
                  ? ""
                  : packageType.toString(),
              packageSize:
                packageSize === null || packageSize === undefined
                  ? ""
                  : packageSize.toString(),
              packageNo:
                packageNos === null || packageNos === undefined
                  ? ""
                  : packageNos.toString(),
              totalPackages: totalPackagesCalculation(
                packageNos === null || packageNos === undefined
                  ? ""
                  : packageNos.toString()
              ),
              grossKgs:
                grossKgs === null || grossKgs === undefined
                  ? ""
                  : parseFloat(grossKgs),
              tareKgs:
                tareKgs === null || tareKgs === undefined
                  ? ""
                  : parseFloat(tareKgs),
              netKgs: netKagesCalculation(
                grossKgs === null || grossKgs === undefined
                  ? 0
                  : parseFloat(grossKgs),
                tareKgs === null || tareKgs === undefined
                  ? 0
                  : parseFloat(tareKgs)
              ),
              totalNetKgs: totalNetKagesCalculation(
                totalPackagesCalculation(packageNos.toString()),
                netKagesCalculation(parseFloat(grossKgs), parseFloat(tareKgs)),
                0
              ),
              invoiceQty: totalNetKagesCalculation(
                totalPackagesCalculation(packageNos.toString()),
                netKagesCalculation(parseFloat(grossKgs), parseFloat(tareKgs)),
                0
              ),
              // gpNo: gpNo === ""|| gpNo===undefined ? "" : parseInt(gpNo),
              gpNo:
                gpNo === "" || gpNo === undefined
                  ? ""
                  : Number.isInteger(gpNo)
                  ? parseInt(gpNo)
                  : typeof gpNo === "number"
                  ? parseFloat(gpNo)
                  : gpNo,

              gpDate:
                gpDate === undefined || gpDate === null
                  ? ""
                  : excelDateToJSDate(gpDate),
              shortExcessWeight: short_excessWeight,
              locationInsideWarehouse:
                locationInsideWarehouse === undefined
                  ? ""
                  : locationInsideWarehouse.toString(),
              isActive: true,
              createdBy: userId, //auctioner
              SampleQty: 0,
              DataFlag: "Excel",
              TeaType: teaType === null || teaType === undefined ? "" : teaType,
              Category:
                category === null || category === undefined ? "" : category,
              Grade:
                grade === null || grade === undefined ? "" : grade.toString(),
              Mark: mark,
              SubTeaType:
                subType === null || subType === undefined ? "" : subType,
              Warehouse:
                warehouseCode === null || warehouseCode === undefined
                  ? ""
                  : warehouseCode,
              Auctioneer:
                auctioneerCode === null || auctioneerCode === undefined
                  ? ""
                  : auctioneerCode,
              auctionCenterId: auctionCenterId,
            };

            return data;
          });

          // console.log(
          //   dataList.map((ele,indexs) => ele.grossKgs?.toString()?.split(".")[1].length>0 ? indexs+1:false).filter(ele=> ele !== false),
          //   "dataListdataListdataListdataList"
          // );
          // if (
          //   dataList
          //     .map(
          //       (ele) =>
          //         // Number.isInteger(ele.gpNo === "" ? 0 : ele.gpNo) === true ||
          //         (typeof (ele.gpNo === "" ? 0 : ele.gpNo) === "number") ===
          //         true
          //     )
          //     .includes(false)
          // ) {
          //   CustomToast.error("Please enter valid GP NO.");
          // } else {
          updatedFileData.push(dataList);
          //}
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
      console.log(mergedArray, "mergedArraymergedArray");
    } catch (error) {
      CustomToast.error(error);
    }
    // validation(uploadedData);
  };

  const allData = (dataList) => {
    if (dataList.length > 0) {
      const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(dataList?.at(0)?.saleNo),
          season: dataList?.at(0)?.season?.toString(),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          setbaseUrlEng(
            response?.data?.responseData[0]?.auctionTypeCode === "BHARAT"
              ? "InvoiceDetails"
              : "EnglishAuctionInvoiceDetails"
          );
          const data = dataList.map((item) => {
            // Data to be sent in the POST request

            // Making the POST request using Axios

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

            item.SaleProgramId = response?.data?.responseData[0]?.SaleProgramId;

            // console.log(
            //   response?.data?.responseData[0]?.SaleProgramId,
            //   "response?.data?.responseData[0]?.SaleProgramId)"
            // );
            document.getElementById("file-upload").value = "";
          });
          if (uploadData?.length > 0) {
            setUploadData([...uploadData, ...dataList]);
            setTableData([...dataList]);
          } else {
            setUploadData([...dataList]);
          }

          console.log(data, dataList, "dataF");
        })
        .catch((error) => {
          // Handle errors here
          console.log(error);
        });
    }
  };
  // const handleFileUpload = async (e) => {
  //   const files = e.target.files;

  //   for (const file of files) {
  //     const fileSize = file.size;
  //     const fileName = file.name;
  //     const fileExtension = fileName.slice(
  //       ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
  //     );
  //     setPropertyNameList(propertyNames);
  //     if (!ALLOWED_EXTENSIONS.includes("." + fileExtension.toLowerCase())) {
  //       CustomToast.error(
  //         `File '${fileName}' is not allowed. Only Excel files are accepted.`
  //       );
  //     } else if (fileSize > MAX_FILE_SIZE) {
  //       CustomToast.error(
  //         `File '${fileName}' exceeds the maximum allowed size of 10 MB.`
  //       );
  //     } else {
  //       const promises = Array.from(files).map((file) =>
  //         readFileAndCheckHeaders(file)
  //       );

  //       Promise.allSettled(promises).then((results) => {
  //         const fulfilledResults = results.filter(
  //           (result) => result.status === "fulfilled"
  //         );
  //         const dataFromFiles = fulfilledResults.map((result) => result.value);
  //         console.log(dataFromFiles, "dataFromFiles");
  //         handleData(dataFromFiles);
  //       });
  //     }
  //   }
  // };

  const handleFileUpload = async (e) => {
    const files = e.target.files;

    const filePromises = Array.from(files).map((file) => {
      const fileSize = file.size;
      const fileName = file.name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );
      setPropertyNameList(propertyNames);

      if (!ALLOWED_EXTENSIONS.includes("." + fileExtension.toLowerCase())) {
        CustomToast.error(
          `File '${fileName}' is not allowed. Only Excel files are accepted.`
        );
        return Promise.resolve(null);
      } else if (fileSize > MAX_FILE_SIZE) {
        CustomToast.error(
          `File '${fileName}' exceeds the maximum allowed size of 10 MB.`
        );
        return Promise.resolve(null);
      } else {
        return readFileAndCheckHeaders(file);
      }
    });

    try {
      const results = await Promise.all(filePromises);
      const dataFromFiles = results.filter((result) => result !== null);
      // console.log(dataFromFiles, "dataFromFiles")
      // debugger;
      handleData(dataFromFiles);
    } catch (error) {
      console.log("Error occurred during file processing:", error);
      // Handle error here
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear().toString();
    return `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;
  }

  console.log(
    catalogClosingDate,
    // new Date(catalogClosingDate?.toString()).toLocaleDateString("en-GB"),
    "new Date(catalogClosingDate).toLocaleDateString(en-GB)"
  );
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

  // const handleExportPDF = () => {
  //   const pdfBlob = (
  //     <PDFViewer width="100%" height="600px">
  //       <Document>
  //         <Page>
  //           <View>
  //             <Text>Name: {formik.values.gpDate}</Text>
  //             <Text>Email: {formik.values.gpNo}</Text>
  //             {/* Add other fields here */}
  //           </View>
  //         </Page>
  //       </Document>
  //     </PDFViewer>
  //   );

  //   const pdfUrl = URL.createObjectURL(
  //     new Blob([pdfBlob], { type: "application/pdf" })
  //   );
  //   window.open(pdfUrl);
  // };
  const generatePDFBlob = () => {
    const pdfContent = (
      <Document>
        <Page>
          <View>
            <Text>Name: {formik.values.gpNo}</Text>
            {/* Add other fields here */}
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = pdfContent.toBuffer();
    return pdfBlob;
  };

  const handleExportPDF = () => {
    const pdfBlob = generatePDFBlob();
    const pdfUrl = URL.createObjectURL(
      new Blob([pdfBlob], { type: "application/pdf" })
    );
    window.open(pdfUrl);
  };

  const handleExportExcel = () => {
    let { mark, warehouse, subType, teaType, grade } = formik.values;
    let newdata = {
      ...formik.values,
      mark: markDataList.filter((item) => item.markId === mark)?.at(0)
        ?.markCode,
      warehouse: warehouseUserList
        .filter((item) => item.wareHouseUserRegId === warehouse)
        ?.at(0)?.wareHouseCode,

      auctioneer: auctioneer
        .filter((item) => item.userId === formik.values.auctioneerId)
        ?.at(0)?.userCode,
      teaType: teaTypeList.filter((item) => item.teatypeid === teaType)?.at(0)
        ?.teaTypeName,
      subType: subTeaTypeNo
        .filter((item) => item.subTeaTypeId === subType)
        ?.at(0)?.subTeaTypeName,
      grade: gradesList.filter((item) => item.gradeId === grade)?.at(0)
        ?.gradeCode,
      category: catagory
        .filter((item) => item.categoryId === formik.values.category)
        ?.at(0)?.categoryCode,
    };
    delete newdata.auctioneerId;
    const ws = XLSX.utils.json_to_sheet([newdata]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Form Data");
    XLSX.writeFile(wb, "form_data.xlsx");
  };
  //Pdf START

  const sourceDivRef = useRef(null);
  // const targetDivRef = useRef(null);

  const handleExportToPdf = () => {
    // const sourceDiv = sourceDivRef.current;
    // // const targetDiv = targetDivRef.current;

    // if (sourceDiv) {
    //   const pdfOptions = { margin: 10, filename: "Invoice_Export.pdf" };

    //   html2pdf(sourceDiv, pdfOptions);
    //   // html2pdf(targetDiv, pdfOptions);
    // }
    const markval = formik.values.mark;
    const markvalselectedText = markDataList
      .filter((item) => item.markId === markval)
      ?.at(0).markName;

    const subteatypeval = formik.values.subType;
    const subTypeselectedText = subTeaTypeNo
      .filter((item) => item.subTeaTypeId === subteatypeval)
      ?.at(0).subTeaTypeName;

    const teaTypeNameval = formik.values.teaType;
    const teaTypeNameselectedText = teaTypeList
      .filter((item) => item.teatypeid === teaTypeNameval)
      ?.at(0).teaTypeName;

    const auctioneerval = formik.values.auctioneerId;
    const auctioneerselectedText = auctioneer
      .filter((item) => item.userId === auctioneerval)
      ?.at(0).userCode;

    var data = [];
    data?.push(formik.values);
    var newobj = data?.map((item) => ({
      ...item,
      invoiceStatus: invoiceStatusLable,
      origin: origindata,
      mark: markvalselectedText,
      subType: subTypeselectedText,
      teaType: teaTypeNameselectedText,
      auctioneer: auctioneerselectedText,
    }));
    var newdat = newobj.map((obj) => {
      for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
          obj[key] = "";
        }
      }
      return obj;
    });
    setprintrow(newdat);
    console.log(formik);
    setopenPrintModel(true);
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
    },
  ];
  const invoices = [
    {
      name: "mark",
      title: "Mark",
    },
    {
      name: "invoiceStatus",
      title: "Invoice Status",
    },
    {
      name: "season",
      title: "Season",
    },
    {
      name: "saleNo",
      title: "Sale No",
    },
    {
      name: "origin",
      title: "Origin",
    },
    {
      title: "invoice No",
      name: "invoiceNo",
    },
    {
      title: "invoice Qty",
      name: "invoiceQty",
    },
    {
      title: "manufacture",
      name: "manufacture",
    },

    {
      title: "manufacture From Date",
      name: "manufactureFromDate",
    },
    {
      title: "manufacture To Date",
      name: "manufactureToDate",
    },
    {
      title: "date Of Dispatch",
      name: "dateOfDispatch",
    },
    {
      title: "invoice Date",
      name: "invoiceDate",
    },

    {
      title: "auctioneer",
      name: "auctioneer",
    },
    {
      title: "lorry Receipt No",
      name: "lorryReceiptNo",
    },
    {
      title: "lorry No",
      name: "lorryNo",
    },
    {
      title: "inv Ref No",
      name: "invRefNo",
    },
    {
      title: "carrier",
      name: "carrier",
    },

    {
      title: "sample Qty",
      name: "sampleQty",
    },

    {
      title: "gp No",
      name: "gpNo",
    },
    {
      title: "invoice Ref No",
      name: "invoiceRefNo",
    },
    {
      title: "received Date",
      name: "receivedDate",
    },
    {
      title: "warehouse",
      name: "warehouseName",
    },
  ];

  ///PDF END

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="Invoice-Maintenance cust-filed row">
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                <div>
                  Mark
                  <span
                    className={`${
                      formik.errors.mark && formik.touched.mark
                        ? "error text-danger"
                        : ""
                    }`}
                  >
                    *
                  </span>
                </div>
              </label>
              <div className="max-width250">
                <InputGroup>
                  <FormControl
                    as="select"
                    disabled={isDisabled}
                    name="mark"
                    value={formik.values.mark}
                    onChange={handleChange}
                  >
                    {/* <option>All</option> */}
                    {markDataList?.length > 0
                      ? markDataList?.map((item, index) => (
                          <option value={item.markId} key={index}>
                            {item.markCode}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.mark && formik.touched.mark && (
                  <div className="error text-danger">{formik.errors.mark}</div>
                )}
              </div>
            </div>
          </div>
          {srNo !== null ? (
            <>
              <div className="FormGrup col-xl-2 col-lg-4 col-md-3 mt-3">
                <label>SR No</label>
                <div>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Control
                        disabled
                        type="text"
                        placeholder="0"
                        name="srNo"
                        value={srNo + 1}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </div>

              <div className="FormGrup col-xl-2 col-lg-4 col-md-3 mt-3">
                <label>Invoice Status</label>
                <div>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Control
                        disabled
                        type="text"
                        placeholder="-"
                        name="invoiceStatus"
                        value={invoiceStatusLable}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </div>

              <div className="FormGrup col-xl-2 col-lg-4 col-md-3 mt-3">
                <label>Origin</label>
                <div>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Control
                        disabled
                        type="text"
                        placeholder="-"
                        name="origin"
                        value={origindata}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Season *</label>
              <div>
                <InputGroup>
                  <FormControl
                    as="select"
                    name="season"
                    value={formik.values.season}
                    onChange={handleChange}
                    disabled={
                      viewData?.data?.responseData?.length > 0 &&
                      isEdit === true
                        ? true
                        : isDisabled
                    }
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
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Sale no
                <span
                  className={`${
                    formik.errors.saleNo && formik.touched.saleNo
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div className="max-width250">
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData?.data?.responseData?.length > 0 &&
                      isEdit === true
                        ? true
                        : isDisabled
                    }
                    as="select"
                    name="saleNo"
                    value={formik.values.saleNo}
                    onChange={handleChange}
                  >
                    {saleNo?.length > 0
                      ? saleNo?.map((item, index) => (
                          <option value={item.SaleProgramId} key={index}>
                            {item.saleNo}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.saleNo && formik.touched.saleNo && (
                  <div className="error text-danger">
                    {formik.errors.saleNo}
                  </div>
                )}
              </div>
            </div>
          </div>
          {srNo !== null ? (
            <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
              <div className="FormGrup">
                <label>Received Date</label>
                <div className="max-width250">
                  <div>
                    <Form>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          disabled
                          type="date"
                          value={formik.values.receivedDate?.split("T")?.at(0)}
                          placeholder="-"
                          name="origin"
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Form>
                  </div>
                </div>
                {formik.errors.saleNo && formik.touched.saleNo && (
                  <div className="error text-danger">
                    {formik.errors.saleNo}
                  </div>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Warehouse{" "}
                <span
                  className={`${
                    formik.errors.warehouse && formik.touched.warehouse
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={isDisabled}
                    as="select"
                    name="warehouse"
                    value={formik.values.warehouse}
                    onChange={handleChange}
                  >
                    {warehouseUserList?.length > 0
                      ? warehouseUserList?.map((item, index) => (
                          <option value={item.wareHouseUserRegId} key={index}>
                            {item.wareHouseCode}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.warehouse && formik.touched.warehouse && (
                  <div className="error text-danger">
                    {formik.errors.warehouse}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Warehouse Name</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled
                      type="text"
                      placeholder="Warehouse Name"
                      name="warehouseName"
                      value={formik.values.warehouseName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {/* {formik.errors.warehouseName &&
                    formik.touched.warehouseName && (
                      <div className="error text-danger">
                        {formik.errors.warehouseName}
                      </div>
                    )} */}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Warehouse Address</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                      as="textarea"
                      disabled
                      rows={2}
                      placeholder="Warehouse Address"
                      name="warehouseAddress"
                      value={formik.values.warehouseAddress}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {/* {formik.errors.warehouseAddress &&
                    formik.touched.warehouseAddress && (
                      <div className="error text-danger">
                        {formik.errors.warehouseAddress}
                      </div>
                    )} */}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Manufacture
                <span
                  className={`${
                    formik.errors.manufacture && formik.touched.manufacture
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      disabled
                      name="manufacture"
                      value={formik.values.manufacture}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.manufacture && formik.touched.manufacture && (
                    <div className="error text-danger">
                      {formik.errors.manufacture}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Auctioneer</label>
              <div>
                <Form>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="auctioneer"
                      value={formik.values.auctioneer}
                      onChange={handleChange}
                      disabled={roleCode === "AUCTIONEER" ? true : false}
                      // disabled={
                      //   viewData?.data?.responseData?.length > 0 &&
                      //     isEdit === true
                      //     ? true
                      //     : isDisabled
                      // }
                    >
                      {auctioneer?.map((item, index) => (
                        <option value={item.userId} key={item.userId}>
                          {item.userCode}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.auctioneer && formik.touched.auctioneer && (
                    <div className="error text-danger">
                      {formik.errors.auctioneer}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Grade</label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData?.data?.responseData?.length > 0 &&
                      isEdit === true
                        ? true
                        : isDisabled
                    }
                    as="select"
                    name="grade"
                    value={formik.values.grade}
                    onChange={handleChange}
                  >
                    {gradesList?.length > 0
                      ? gradesList?.map((item, index) => (
                          <option value={item.gradeId} key={index}>
                            {item.gradeCode}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.grade && formik.touched.grade && (
                  <div className="error text-danger">{formik.errors.grade}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Invoice Date</label>
              <div className="max-width250">
                <input
                  type="date"
                  name="invoiceDate"
                  disabled={isDisabled}
                  value={formik.values.invoiceDate?.split("T")[0]}
                  onChange={handleChange}
                  onKeyDown={(e) => e.preventDefault()} // This prevents typing in the input
                  max={catalogClosingDate?.split("T")[0]}
                  // max={"2023-09-13"}
                />
                {formik.errors.invoiceDate && formik.touched.invoiceDate && (
                  <div className="error text-danger">
                    {formik.errors.invoiceDate}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Period of Manufacture From</label>
              <div className="DateGroup">
                <input
                  type="date"
                  id="fromDate"
                  value={
                    formik.values.manufactureFromDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  name="manufactureFromDate"
                  onChange={handleChange}
                  disabled={isDisabled}
                  onKeyDown={(e) => e.preventDefault()} // This prevents typing in the input
                />
                {formik.errors.manufactureFromDate &&
                  formik.touched.manufactureFromDate && (
                    <div className="error text-danger">
                      {formik.errors.manufactureFromDate}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Period of Manufacture To</label>
              <div className="max-width250 d-flex">
                <input
                  type="date"
                  id="manufactureToDate"
                  disabled={isDisabled}
                  onKeyDown={(e) => e.preventDefault()} // This prevents typing in the input
                  value={
                    formik.values.manufactureToDate?.split("T")[0] ||
                    currentDate.toISOString().split("T")[0]
                  }
                  name="manufactureToDate"
                  onChange={handleChange}
                  min={formik.values.manufactureFromDate?.split("T")[0]}
                  max={formik.values.invoiceDate?.split("T")[0]}
                />
                {formik.errors.manufactureToDate &&
                  formik.touched.manufactureToDate && (
                    <div className="error text-danger">
                      {formik.errors.manufactureToDate}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Date of dispatch{" "}
                <span
                  className={`${
                    formik.errors.dateOfDispatch &&
                    formik.touched.dateOfDispatch
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <input
                  type="date"
                  disabled={isDisabled}
                  name="dateOfDispatch"
                  onKeyDown={(e) => e.preventDefault()} // This prevents typing in the input
                  value={
                    formik.values.dateOfDispatch?.split("T")[0] || new Date()
                  }
                  onChange={handleChange}
                  min={formik.values.invoiceDate}
                  max={catalogClosingDate}
                />
                {formik.errors.dateOfDispatch &&
                  formik.touched.dateOfDispatch && (
                    <div className="error text-danger">
                      {formik.errors.dateOfDispatch}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Invoice No{" "}
                <span
                  className={`${
                    formik.errors.invoiceNo && formik.touched.invoiceNo
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      disabled={
                        viewData?.data?.responseData?.length > 0 &&
                        isEdit === true
                          ? true
                          : isDisabled
                      }
                      name="invoiceNo"
                      placeholder="Invoice No"
                      value={formik.values.invoiceNo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.invoiceNo && formik.touched.invoiceNo && (
                    <div className="error text-danger">
                      {formik.errors.invoiceNo}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Invoice Qty.{" (Invoice Weight)"}</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      disabled
                      name="invoiceQty"
                      placeholder="Invoice Qty. (Invoice Weight)"
                      value={
                        viewData?.data?.responseData?.length > 0 &&
                        isEdit === true
                          ? viewData?.data?.responseData?.at(0)?.invoiceQty
                          : formik.values.invoiceQty || 0
                      }
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.invoiceQty && formik.touched.invoiceQty && (
                    <div className="error text-danger">
                      {formik.errors.invoiceQty}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Lorry Receipt No</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={isDisabled}
                      type="text"
                      name="lorryReceiptNo"
                      placeholder="Lorry Receipt No"
                      value={formik.values.lorryReceiptNo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.lorryReceiptNo &&
                    formik.touched.lorryReceiptNo && (
                      <div className="error text-danger">
                        {formik.errors.lorryReceiptNo}
                      </div>
                    )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Lorry No</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={isDisabled}
                      type="text"
                      name="lorryNo"
                      placeholder="Lorry No"
                      value={formik.values.lorryNo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.lorryNo && formik.touched.lorryNo && (
                    <div className="error text-danger">
                      {formik.errors.lorryNo}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>

          {(viewData?.data?.responseData?.length > 0 && isEdit === true) ||
          isDisabled === true ||
          auction === "ENGLISH" ? (
            <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
              <div className="FormGrup">
                <label>Inv. Ref. No.</label>
                <div>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Control
                        disabled={
                          viewData?.data?.responseData?.length > 0 &&
                          isEdit === true
                            ? true
                            : isDisabled
                        }
                        type="text"
                        placeholder="123ABC"
                        name="invoiceRefNo"
                        value={formik.values.invoiceRefNo}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    {formik.errors.invoiceRefNo &&
                      formik.touched.invoiceRefNo && (
                        <div className="error text-danger">
                          {formik.errors.invoiceRefNo}
                        </div>
                      )}
                  </Form>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {isDisabled ? (
            ""
          ) : (
            <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
              <div className="FormGrup">
                <label>Carrier</label>
                <div>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Control
                        disabled={isDisabled}
                        type="text"
                        name="carrier"
                        placeholder="Carrier"
                        value={formik.values.carrier}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    {formik.errors.carrier && formik.touched.carrier && (
                      <div className="error text-danger">
                        {formik.errors.carrier}
                      </div>
                    )}
                  </Form>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="row" ref={sourceDivRef} id="sourceDiv">
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Tea Type{" "}
                <span
                  className={`${
                    formik.errors.teaType && formik.touched.teaType
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData?.data?.responseData?.length > 0 &&
                      isEdit === true
                        ? true
                        : isDisabled
                    }
                    as="select"
                    name="teaType"
                    value={formik.values.teaType}
                    onChange={handleChange}
                  >
                    <option value={0}>Select tea type</option>
                    {teaTypeList?.length > 0
                      ? teaTypeList?.map((item, index) => (
                          <option value={item.teatypeid}>
                            {item.teaTypeName}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.teaType && formik.touched.teaType && (
                  <div className="error text-danger">
                    {formik.errors.teaType}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Sub Type{" "}
                <span
                  className={`${
                    formik.errors.subType && formik.touched.subType
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData?.data?.responseData?.length > 0 &&
                      isEdit === true
                        ? true
                        : isDisabled
                    }
                    as="select"
                    name="subType"
                    value={formik.values.subType}
                    onChange={handleChange}
                  >
                    <option value={0}>Select sub tea type</option>

                    {subTeaTypeNo?.length > 0
                      ? subTeaTypeNo?.map((item, index) => (
                          <option value={item.subTeaTypeId} key={index}>
                            {item.subTeaTypeName}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.subType && formik.touched.subType && (
                  <div className="error text-danger">
                    {formik.errors.subType}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Category{" "}
                <span
                  className={`${
                    formik.errors.category && formik.touched.category
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData?.data?.responseData?.length > 0 &&
                      isEdit === true
                        ? true
                        : isDisabled
                    }
                    as="select"
                    name="category"
                    value={formik.values.category}
                    onChange={handleChange}
                  >
                    <option value={0}>Select Category</option>

                    {catagory?.length > 0
                      ? catagory?.map((item, index) => (
                          <option value={item.categoryId} key={index}>
                            {item.categoryCode}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.category && formik.touched.category && (
                  <div className="error text-danger">
                    {formik.errors.category}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Package Size</label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData?.data?.responseData?.length > 0 &&
                      isEdit === true
                        ? true
                        : isDisabled
                    }
                    as="select"
                    name="packageSize"
                    value={formik.values.packageSize}
                    onChange={handleChange}
                  >
                    <option value="">Select Package Size</option>
                    {/* <option value={14}>27x21x11</option> */}
                    {packegesize?.length > 0
                      ? packegesize?.map((item, index) => (
                          <option value={item.packageSizeName} key={index}>
                            {item.packageSizeName}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.packageSize && formik.touched.packageSize && (
                  <div className="error text-danger">
                    {formik.errors.packageSize}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Package Type{" "}
                <span
                  className={`${
                    formik.errors.packageType && formik.touched.packageType
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <InputGroup>
                  <FormControl
                    disabled={
                      viewData?.data?.responseData?.length > 0 &&
                      isEdit === true
                        ? true
                        : isDisabled
                    }
                    as="select"
                    name="packageType"
                    value={formik.values.packageType}
                    onChange={handleChange}
                  >
                    <option value="">Select Package Type</option>
                    {/* <option value={15}>Paper sacks</option> */}
                    {packegetype?.length > 0
                      ? packegetype?.map((item, index) => (
                          <option value={item.packageTypeName} key={index}>
                            {item.packageTypeName}
                          </option>
                        ))
                      : "No Data"}
                  </FormControl>
                </InputGroup>
                {formik.errors.packageType && formik.touched.packageType && (
                  <div className="error text-danger">
                    {formik.errors.packageType}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Package No.{" "}
                <span
                  className={`${
                    formik.errors.packageNo && formik.touched.packageNo
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={
                        viewData?.data?.responseData?.length > 0 &&
                        isEdit === true
                          ? true
                          : isDisabled
                      }
                      type="text"
                      name="packageNo"
                      placeholder="Package No"
                      value={formik.values.packageNo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.packageNo && formik.touched.packageNo && (
                    <div className="error text-danger">
                      {formik.errors.packageNo}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Total Packages</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled
                      type="text"
                      name="totalPackages"
                      value={formik.values.totalPackages || 0}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.totalPackages &&
                    formik.touched.totalPackages && (
                      <div className="error text-danger">
                        {formik.errors.totalPackages}
                      </div>
                    )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Gross Kges{" "}
                <span
                  className={`${
                    formik.errors.grossKgs && formik.touched.grossKgs
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={
                        viewData?.data?.responseData?.length > 0 &&
                        isEdit === true
                          ? true
                          : isDisabled
                      }
                      type="text"
                      name="grossKgs"
                      placeholder="Gross Kgs"
                      value={formik.values.grossKgs}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.grossKgs && formik.touched.grossKgs && (
                    <div className="error text-danger">
                      {formik.errors.grossKgs}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>
                Tare KGs{" "}
                <span
                  className={`${
                    formik.errors.tareKgs && formik.touched.tareKgs
                      ? "error text-danger"
                      : ""
                  }`}
                >
                  *
                </span>
              </label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled={
                        viewData?.data?.responseData?.length > 0 &&
                        isEdit === true
                          ? true
                          : isDisabled
                      }
                      type="text"
                      name="tareKgs"
                      placeholder="Tare KGs"
                      value={formik.values.tareKgs}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.tareKgs && formik.touched.tareKgs && (
                    <div className="error text-danger">
                      {formik.errors.tareKgs}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Net KGs</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      disabled
                      type="text"
                      name="netKgs"
                      placeholder="Net KGs"
                      value={formik.values.netKgs}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formik.errors.netKgs && formik.touched.netKgs && (
                    <div className="error text-danger">
                      {formik.errors.netKgs}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
            <div className="FormGrup">
              <label>Total Net KGs</label>
              <div>
                <Form>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      name="totalNetKgs"
                      placeholder="Total Net KGs"
                      value={formik.values.totalNetKgs || 0}
                      onChange={handleChange}
                      disabled
                    />
                  </Form.Group>
                  {formik.errors.totalNetKgs && formik.touched.totalNetKgs && (
                    <div className="error text-danger">
                      {formik.errors.totalNetKgs}
                    </div>
                  )}
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {isDisabled === true ? (
            ""
          ) : (
            <>
              <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
                <div className="FormGrup">
                  <label>GP No.</label>
                  <div>
                    <Form>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          type="number"
                          disabled={
                            viewData?.data?.responseData?.length > 0 &&
                            isEdit === true
                              ? true
                              : isDisabled
                          }
                          name="gpNo"
                          placeholder="Gp No"
                          value={formik.values.gpNo}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      {formik.errors.gpNo && formik.touched.gpNo && (
                        <div className="error text-danger">
                          {formik.errors.gpNo}
                        </div>
                      )}
                    </Form>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
                <div className="FormGrup">
                  <label>GP Date</label>
                  <div>
                    <Form>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          type="date"
                          disabled={
                            viewData?.data?.responseData?.length > 0 &&
                            isEdit === true
                              ? true
                              : isDisabled
                          }
                          name="gpDate"
                          value={formik.values.gpDate?.split("T")?.at(0)}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      {formik.errors.gpDate && formik.touched.gpDate && (
                        <div className="error text-danger">
                          {formik.errors.gpDate}
                        </div>
                      )}
                    </Form>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
                <div className="FormGrup">
                  <label>Short/Excess Weight</label>
                  <div>
                    <Form>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          type="text"
                          disabled={
                            viewData?.data?.responseData?.length > 0 &&
                            isEdit === true
                              ? true
                              : isDisabled
                          }
                          name="shortExcessWeight"
                          value={formik.values.shortExcessWeight}
                          onChange={handleChange}
                          placeholder="Short/Excess Weight"
                        />
                      </Form.Group>
                      {formik.errors.shortExcessWeight &&
                        formik.touched.shortExcessWeight && (
                          <div className="error text-danger">
                            {formik.errors.shortExcessWeight}
                          </div>
                        )}
                    </Form>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-md-3 mt-3">
                <div className="FormGrup">
                  <label>Location inside Warehouse</label>
                  <div>
                    <Form>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          type="textareya"
                          disabled={
                            viewData?.data?.responseData?.length > 0 &&
                            isEdit === true
                              ? true
                              : isDisabled
                          }
                          name="locationInsideWarehouse"
                          value={formik.values.locationInsideWarehouse}
                          onChange={handleChange}
                          placeholder="Location inside Warehouse"
                        />
                      </Form.Group>
                      {formik.errors.locationInsideWarehouse &&
                        formik.touched.locationInsideWarehouse && (
                          <div className="error text-danger">
                            {formik.errors.locationInsideWarehouse}
                          </div>
                        )}
                    </Form>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="row">
          <div className="col-12">
            <div className="BtnGroup">
              {isDisabled === true ? (
                ""
              ) : (
                <>
                  {viewData?.data?.responseData?.length > 0 && isEdit ? (
                    <Button
                      className="SubmitBtn"
                      type="button"
                      onClick={() => {
                        //setWarehouseUserRegIdOnEdit(formik.values.warehouse);
                        const apiUrlCatagory = `/preauction/${baseUrlEng}/AddInvoiceDetails?action=update&saleNo=${formik.values?.saleNo}`;

                        // const { values } = formik;

                        const data = {
                          markId: parseInt(formik.values?.mark),
                          season: formik.values?.season.toString(),
                          teaTypeId: parseInt(formik.values?.teaType),
                          // SaleProgramId: parseInt(values?.saleNo),
                          SaleProgramId: saleprogrmId,
                          wareHouseUserRegId: parseInt(
                            formik.values?.warehouse === undefined
                              ? warehouseUserRegIdOnEdit
                              : formik.values?.warehouse //warehouseUserRegIdOnEdit
                          ),
                          auctioneerId: userId,
                          categoryId: parseInt(formik.values?.category),
                          manufactureFromDate:
                            formik.values?.manufactureFromDate,
                          manufactureToDate: formik.values?.manufactureToDate,
                          dateOfDispatch: formik.values?.dateOfDispatch,
                          invoiceDate: formik.values?.invoiceDate,
                          carrier: formik.values?.carrier,
                          lorryReceiptNo: formik.values?.lorryReceiptNo,
                          lorryNo: formik.values?.lorryNo,
                          invoiceNo: formik.values?.invoiceNo,
                          arrivalDate: null,
                          awrDate: null,
                          awrReferenceNo: null,
                          subTeaTypeId: parseInt(formik.values?.subType),
                          gradeId:
                            parseInt(formik.values?.grade) === 0
                              ? gradesList?.at(0)?.gradeId
                              : parseInt(formik.values?.grade),
                          packageType: formik.values?.packageType,
                          packageSize: formik.values?.packageSize,
                          packageNo: formik.values?.packageNo,
                          totalPackages: parseInt(formik.values?.totalPackages),
                          grossKgs: parseInt(formik.values?.grossKgs),
                          tareKgs: parseInt(formik.values?.tareKgs),
                          netKgs: parseInt(formik.values?.netKgs),
                          totalNetKgs: parseInt(formik.values?.totalNetKgs),
                          gpNo: null,
                          gpDate: null,
                          shortExcessWeight:
                            formik.values?.shortExcessWeight === null ||
                            formik.values?.shortExcessWeight === undefined
                              ? 0
                              : parseInt(formik.values?.shortExcessWeight),
                          locationInsideWarehouse:
                            formik.values?.locationInsideWarehouse,
                          isActive: true,
                          createdBy: userId, //auctioner
                          updatedBy: userId,
                          invoiceRefNo: formik.values?.invoiceRefNo,
                          invoiceQty: parseInt(formik.values?.invoiceQty),
                          DataFlag: "",
                          TeaType: "",
                          Category: "",
                          Grade: "",
                          Mark: "",
                          SubTeaType: "",
                          Warehouse: "",
                          Auctioneer: "",
                          auctionCenterId: auctionCenterId,
                        };

                        axiosMain
                          .post(`${apiUrlCatagory}?role=${roleCode}`, [data])
                          .then((response) => {
                            // Handle the API response here'

                            // setSelectedSalePrograms({
                            //   ...selectedSalePrograms,
                            //   categoryId: response?.data?.responseData[0].categoryId,
                            // });
                            if (response.data.statusCode === 200) {
                              CustomToast.success(response.data.message);
                              handleAccordionChange("panel1");
                              setInvoiceData([]);
                            } else {
                              CustomToast.error(response.data.message);
                            }
                            // console.log(response, "invresponse");
                          })
                          .catch((error) => {
                            // Handle errors here
                          });
                      }}
                    >
                      Updates
                    </Button>
                  ) : (
                    <>
                      {modalRight?.includes("1") && (
                        <>
                          <Button className="SubmitBtn" type="submit">
                            Add
                          </Button>
                          <Button
                            className="SubmitBtn"
                            type="button"
                            onClick={() =>
                              invoiceData.length > 0
                                ? setOpenDelete(true)
                                : CustomToast.error("Please First add invoice")
                            }
                          >
                            Create
                          </Button>
                          {/* <Button
                            className="SubmitBtn"
                            type="button"
                            onClick={() => {
                              if (invoiceData.length > 0) {
                                dispatch(addInvoiceDetailsRequest(invoiceData));
                                axiosMain
                                  .post(
                                    "/preauction/InvoiceDetails/AddInvoiceDetails",
                                    invoiceData
                                  )
                                  .then((response) => {
                                    // Handle the API response here'

                                    // setSelectedSalePrograms({
                                    //   ...selectedSalePrograms,
                                    //   categoryId: response?.data?.responseData[0].categoryId,
                                    // });
                                    if (response.data.statusCode === 200) {
                                      CustomToast.success(
                                        response.data.message
                                      );
                                      handleAccordionChange("panel1");
                                      setInvoiceData([]);
                                    } else {
                                      CustomToast.error(response.data.message);
                                    }
                                    // console.log(response, "invresponse");
                                  })
                                  .catch((error) => {
                                    // Handle errors here
                                  });
                                console.log(
                                  invoiceResponseData,
                                  "invoiceResponseData"
                                );
                              } else {
                                CustomToast.error("Please First add invoice");
                              }
                            }}
                          >
                            Create
                          </Button> */}
                        </>
                      )}
                      <Button
                        className="SubmitBtn"
                        type="button"
                        onClick={() => {
                          setTableData([]);
                          setInvoiceData([]);
                          setUploadData([]);
                        }}
                      >
                        Clear
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
                    </>
                  )}
                </>
              )}
              {/* <Button className="SubmitBtn">
                <ImportExportIcon />
              </Button> 
              {/* <UploadeFile
                handleData={handleData}
                readFileAndCheckHeaders={readFileAndCheckHeaders}
              /> */}

              {/* <Button>
                <PictureAsPdfIcon />
              </Button> */}
            </div>
          </div>
        </div>
      </form>
      {(viewData?.data?.responseData?.length > 0 && isDisabled === true) ||
      isEdit === true
        ? ""
        : modalRight?.includes("6") && (
            <>
              {" "}
              <b>
                *Certified that the Teas were weighed at the time of dispatch
                and weights stated are correct. “We here by certify that foods
                mentioned in the invoice are warranted to be of the nature and
                quality which it purports to be, and conform to the P.F.A. Act,
                1954 (Act No. 37 of 1954)”
              </b>
              <ul style={{ "font-weight": "bold" }}>
                <li>● Any number of excel file can be uploaded.</li>
                <li>● Maximum file size should not exceed 10 MB.</li>
                <li>● Acceptable file types: (*.xls and .xlsx)</li>
              </ul>
              <div className="row mt-3 ">
                <div className="col-md-12 ">
                  <div className="browse-file FileUpload px-0">
                    {/* <FileUpload
   id="fileInput"
   handleData={handleData}
   readFileAndCheckHeaders={readFileAndCheckHeaders}
 /> */}
                    <button className="SubmitBtn" onClick={handleButtonClick}>
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
                      type="button"
                      onClick={() => {
                        if (uploadData.length > 0) {
                          const toastMessages = uploadData.map((obj, index) => {
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
                              findDuplicateInvoiceNumbers(uploadData);

                            // const isValid = validateMandatoryFields(
                            //   invoiceData,
                            //   propertyName
                            // );

                            // if (checkmanadatoryManadatory.length > 0) {
                            //   CustomToast.error(errorparam + " are Mandatory");
                            //   return false;
                            // }
                            // else {
                            //   return true;
                            // }

                            if (y < x) {
                              CustomToast.error(
                                "Greater than or equal to From Date. Row No  " +
                                  toDate +
                                  "<" +
                                  fromDate +
                                  rowNo
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
                          });

                          const allTrue = toastMessages.every(
                            (element) => element === true
                          );
                          console.log(allTrue, "allTrueallTrueallTrueallTrue");

                          if (allTrue) {
                            //SDP Validation
                            const manadatory = [
                              "season",
                              "saleNo",
                              "Warehouse",
                              "Auctioneer",
                              "invoiceDate",
                              "invoiceNo",
                              // "arrivalDate",
                              // "awrDate",
                              "TeaType",
                              "SubTeaType",
                              "Category",
                              "Grade",
                              "packageType",
                              "packageNo",
                              "grossKgs",
                              "tareKgs",
                              "netKgs",
                              "dateOfDispatch",
                            ];
                            let checkmanadatoryManadatory = manadatory
                              ?.map((item) =>
                                uploadData.map((ele) =>
                                  ele[item] === "" ? item : ""
                                )
                              )
                              ?.reduce((acc, cur) => cur.concat(acc), [])
                              ?.filter((ele) => ele !== "");
                            let errorparam = manadatory
                              ?.map((item) =>
                                uploadData.map((ele) =>
                                  ele[item] === "" ? item : ""
                                )
                              )
                              ?.reduce((acc, cur) => cur.concat(acc), [])
                              ?.filter((ele) => ele !== "")
                              .join();

                            const checkGrossAndTeraKgs = uploadData
                              ?.map(
                                (ele) =>
                                  ele?.grossKgs?.toString()?.split(".")[1]
                                    ?.length <= 2
                              )
                              .map((ele, index) => ele === false && index + 1)
                              .filter((ele) => ele !== false);
                            const checkTeraKgs = uploadData
                              ?.map(
                                (ele) =>
                                  ele?.tareKgs?.toString()?.split(".")[1]
                                    ?.length <= 2
                              )
                              .map((ele, index) => ele === false && index + 1)
                              .filter((ele) => ele !== false);

                            // ?.map((index) => index + 1);

                            console.log(
                              uploadData?.map(
                                (ele) =>
                                  ele?.grossKgs?.toString()?.split(".")[1]
                                    ?.length <= 2
                              ),
                              // ?.map(
                              //   (ele) =>
                              //     ele?.grossKgs.toString().split(".")[1] ===
                              //       undefined && false
                              // )
                              uploadData?.map((ele) =>
                                ele?.grossKgs.toString().split(".")[1] ===
                                undefined
                                  ? parseFloat(
                                      ele?.grossKgs?.toString() + ".00"
                                    )
                                  : ele?.grossKgs
                              ).filter(ele=> ele !== false),
                              checkGrossAndTeraKgs,
                              checkTeraKgs,
                              "newFilterlength"
                            );
                            if (
                              uploadData
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
                            } else if (
                              checkGrossAndTeraKgs?.length > 0 &&
                              uploadData
                                ?.map(
                                  (ele) =>
                                    ele?.grossKgs?.toString()?.split(".")[1]
                                      ?.length <= 2
                                )
                                .filter((ele) => ele === false)?.length !==
                                uploadData.length
                            ) {
                              // console.log(checkGrossAndTeraKgs);
                              CustomToast.error(
                                "Please enter appropriate Gross KGs in row no. < " +
                                  checkGrossAndTeraKgs?.join(",") +
                                  " >"
                              );
                              // debugger;                       
                            } else if (
                              checkTeraKgs?.length &&
                              uploadData
                                ?.map(
                                  (ele) =>
                                    ele?.tareKgs?.toString()?.split(".")[1]
                                      ?.length <= 2
                                )
                                .filter((ele) => ele === false)?.length !==
                                uploadData.length
                            ) {
                              CustomToast.error(
                                "Please enter appropriate Tare KGs in row no. < " +
                                  checkTeraKgs?.join(",") +
                                  " >"
                              );
                            } else {
                              axiosMain
                                .post(
                                  `/preauction/${baseUrlEng}/AddInvoiceDetails?action=create&saleNo=${
                                    uploadData?.at(0)?.saleNo
                                  }&role=` + roleCode,
                                  uploadData.map((ele) => ({
                                    ...ele,
                                    gpNo:
                                      ele.gpNo === ""
                                        ? null
                                        : ele.gpNo?.toString(),
                                  }))
                                )
                                .then((response) => {
                                  if (response.data.statusCode === 200) {
                                    CustomToast.success(response.data.message);
                                    handleAccordionChange("panel1");
                                    setInvoiceData([]);
                                    setTableData([]);
                                  } else if (response.data.statusCode === 422) {
                                    // CustomToast.warning(response.data.message);
                                    setOpenModalConformation(true);
                                    setOpenModalConformationTitle(
                                      response.data.message
                                    );
                                  } else if (response.data.statusCode === 423) {
                                    // CustomToast.warning(response.data.message);
                                    setOpenModalConformationInvalidData(true);
                                    setOpenModalConformationInvalidDataTitle({
                                      title: response.data.message,
                                      responseData: response.data.responseData,
                                    });
                                    console.log(
                                      response.data,
                                      "response.data.message"
                                    );
                                  } else {
                                    CustomToast.error(response.data.message);
                                  }
                                  // Handle the response data or success
                                })
                                .catch((error) => {
                                  CustomToast.error("API call failed:", error);
                                  // Handle errors here
                                });
                            }
                            // console.log(invoiceData, "datadatadata");
                          } else {
                            console.log("Not all elements are true.");
                          }
                        }
                      }}
                    >
                      Create
                    </Button>
                  </div>
                </div>
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
            </>
          )}
      <div>
        {isDisabled && (
          <>
            <Button className="SubmitBtn creat-btn" onClick={handleExportExcel}>
              export Excel
            </Button>
            <Button className="SubmitBtn creat-btn" onClick={handleExportToPdf}>
              Print
            </Button>
          </>
        )}
      </div>

      {/* <ToastContainer /> */}
      {/* {uploadedFiles.length > 0 && (
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
              )}*/}
      <Modals
        show={openModalConformation}
        size="xl"
        // onHide={() => setShow(false)}
        handleClose={() => false}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        title={openModalConformationTitle}
      >
        <div className="btnGroup">
          <button
            className="btn w-25 text-light text-center"
            onClick={() => {
              axiosMain
                .post(
                  `/preauction/${baseUrlEng}/AddInvoiceDetails?action=update&saleNo=${
                    tableData?.at(0)?.saleNo
                  }&role=` + roleCode,
                  tableData.map((ele) => ele.gpNo?.toString())
                )
                .then((response) => {
                  if (response.data.statusCode === 200) {
                    CustomToast.success(response.data.message);
                    // handleAccordionChange("panel1");
                  } else {
                    CustomToast.error(response.data.message);
                  }
                  setInvoiceData([]);
                  setTableData([]);
                  setOpenModalConformation(false);
                  setOpenModalConformationTitle("");

                  // Handle the response data or success
                })
                .catch((error) => {
                  CustomToast.error("API call failed:", error);
                  // Handle errors here
                });
            }}
          >
            Yes
          </button>

          <button
            className="btn w-25 text-light text-center"
            onClick={() => {
              setOpenModalConformation(false);
              setOpenModalConformationTitle("");
            }}
          >
            No
          </button>
        </div>
      </Modals>
      <Modals
        show={openModalConformationInvalidData}
        size="xl"
        // onHide={() => setShow(false)}
        handleClose={() => setOpenModalConformationInvalidData(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        title={openModalConformationInvalidDataTitle?.title}
      >
        <ul>
          {openModalConformationInvalidDataTitle?.responseData?.length > 0
            ? openModalConformationInvalidDataTitle?.responseData?.map(
                (ele, index) => <li key={index}>● {ele.InvalidRecord}</li>
              )
            : ""}
        </ul>
      </Modals>

      <Modals
        show={openDelete}
        size="lg"
        // onHide={() => setShow(false)}
        handleClose={() => setOpenDelete(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        title="Are you sure you want to submit the invoice ?"
      >
        <div className="btnGroup">
          <button
            className="btn w-25 text-light text-center"
            onClick={async () => {
              if (invoiceData.length > 0) {
                // dispatch(addInvoiceDetailsRequest(invoiceData));
                axiosMain
                  .post(
                    `/preauction/${baseUrlEng}/AddInvoiceDetails?saleNo=${
                      invoiceData?.at(0)?.saleNo
                    }`,
                    invoiceData
                  )
                  .then((response) => {
                    // Handle the API response here'

                    // setSelectedSalePrograms({
                    //   ...selectedSalePrograms,
                    //   categoryId: response?.data?.responseData[0].categoryId,
                    // });

                    // const data = {
                    //   factoryId: parseInt(invoiceData?.at(0)?.markId),
                    //   season: invoiceData?.at(0)?.season,
                    //   saleNo: parseInt(invoiceData?.at(0)?.saleNo),
                    //   status: parseInt(invoiceData?.at(0)?.status),
                    //   auctioneerId: userId, //auctioner
                    //   auctionCenterId: auctionCenterId,
                    //   // role:roleCode
                    // };
                    if (response.data.statusCode === 200) {
                      CustomToast.success(response.data.message);
                      setExpandedTab("panel1");
                      setInvoiceData([]);
                      setOpenDelete(false);
                      // axiosMain
                      //   .post(
                      //     `/preauction/${baseUrlEng}/GetInvoiceDetails?role=` +
                      //       roleCode,
                      //     data
                      //   )
                      //   .then((res) => {
                      //     setRows(res.data.responseData);

                      //   });
                    } else {
                      CustomToast.error(response.data.message);
                      setOpenDelete(false);
                    }
                    // console.log(response, "invresponse");
                  })
                  .catch((error) => {
                    // Handle errors here
                  });
                console.log(invoiceResponseData, "invoiceResponseData");
              } else {
                CustomToast.error("Please First add invoice");
              }
            }}
          >
            Yes
          </button>

          <button
            className="btn w-25 text-light text-center"
            onClick={() => {
              setOpenDelete(false);
              setOpenModalConformationTitle("");
            }}
          >
            No
          </button>
        </div>
      </Modals>

      {isDisabled === true || isEdit === true ? (
        ""
      ) : (
        <div className="row p-2">
          <div className="col-12">
            <div className="TableBox">
              <TableComponent
                columns={propertyNameList}
                rows={tableData}
                setRows={setTableData}
                dragdrop={false}
                fixedColumnsOn={false}
                resizeingCol={false}
                selectionCol={true}
                sorting={true}
              />
            </div>
          </div>
        </div>
      )}
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
          fields={invoices}
          showcheckboxlebels={showcheckboxlebels}
          rows={printrow.length > 0 ? printrow : []}
          pageName={"Invoice"}
        />
      </Modals>
    </>
  );
};

export default CreateInvoiceForm;
