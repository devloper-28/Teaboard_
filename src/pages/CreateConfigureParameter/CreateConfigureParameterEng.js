import React, { useState, useEffect, useCallback } from "react";
//import { fetchGrade } from "../../store/actions"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import TableComponent from "../../components/tableComponent/TableComponent";
import Modal from "../../components/common/Modal";

import {
  createAuctionRequest,
  // englishAuctionSearchRequest,
  fetchAuctionDataOptionRequest,
  fetchAuctionDataRequest,
  fetchPriceRangeRequest,
  getAllAuctionCenterAction,
  getAllAuctionCenterAscAction,
  getAllCategoriesAscAction,
  getAllTeaTypes,
  getExportData,
  getExportDataApiCall,
} from "../../store/actions";
import isEqual from "lodash/isEqual";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, Form } from "react-bootstrap";
import { AiOutlineConsoleSql } from "react-icons/ai";
import axiosMain from "../../http/axios/axios_main";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CustomToast from "../../components/Toast";
import { History } from "@mui/icons-material";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { Tooltip } from "@mui/material";

let pageNo = 1;
function CreateConfigureParameterEngAuction({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const priceRange = useSelector((state) => state.configParam.priceRange);
  // console.log(priceRange, "priceRange");
  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );
  const englishAuctionCenter = useSelector((state) => state.configParam.data);
  // console.log(englishAuctionCenter, "englishAuctionCenter");
  const allActiveCategory = useSelector(
    (state) => state.categoryManage.allCategoriesAsc.responseData
  );
  const isActiveCategoryData =
    allActiveCategory && allActiveCategory.filter((data) => data.isActive == 1);
  const auctionData = useSelector((state) => state.configParam.data);
  // console.log("===1",auctionData)
  // console.log(isActiveCategoryData);
  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => data.isActive == 1);
  const getEnglishAuctionCenter =
    englishAuctionCenter &&
    englishAuctionCenter.filter((data) => data.isActive == 1);

  const allTeaType = useSelector(
    (state) => state.teaTypeManage.allTeaTypes.responseData
  );

  const allDataList = useSelector((state) => state);
  const tableData1 = useSelector((state) => state.configParam);
  console.log(tableData1, "tableDatatableData");
  // console.log(getAllAuctionCenter, "getAllAuctionCenter");
  const createCategoryValuesSchema = (priceRangeCategories) => {
    const schema = {};
    priceRangeCategories.forEach((category) => {
      schema[category.categoryId] = Yup.number().required(
        `Input value for ${category.categoryName} is required`
      );
    });
    return Yup.object().shape(schema);
  };
  const [selectedAuctionCenter, setSelectedAuctionCenter] = useState();
  const [tableData, setTableData] = useState([]);

  const [editingMode, seteditingMode] = useState(null);
  const [expanded, setExpanded] = React.useState("panel1");
  const [viewMode, setViewMode] = useState(false);
  const [tickSizeMappingss, setTickSizeMappings] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [byteCode, setBytecode] = useState(null);
  const [flsize, filesize] = useState(null);
  const [flname, filename] = useState(null);
  const [documentBrief, setDocumentBrief] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [teaTypeCategoryss, setTeatypeCatagorys] = useState([]);
  const [teaTypeList, setTeatypeList] = useState([]);
  const [auctionCenterForSearch, setAuctionCenterForSearch] = useState([]);
  const [uploadDocumentData, setUploadDocumentData] = useState([]);
  const [historyTableData, setHistoryTableData] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [status, setStatus] = useState(false);
  const [status1, setStatus1] = useState(false);

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [divisionMatrix, setDivisionMatrix] = useState([
    { minNoOfPackages: "", maxNoOfPackages: "", noOfBuyers: "" },
  ]);
  const [divisionMatrixValidations, setDivisionMatrixValidations] = useState(
    []
  );
  // const handleChange = (panel) => (event, isExpanded) => {
  //   setExpanded(isExpanded ? panel : false);

  //   if ("panel2" == panel && isExpanded) {
  //     //Serch API call
  //     console.log("2nd page came");
  //     dispatch(fetchAuctionDataRequest({ auctionCenterTypeId: 2 }));
  //     // dispatch(searchStateAction({}));
  //   }
  // };
  const handleViewMore = () => {
    // Increment the pageNo for the next set of records
    pageNo = pageNo + 1;

    // Prepare the request data with the updated pageNo
    const requestData = {
      auctionCenterTypeId: 2,
      pageNo: pageNo,
      noOfRecords: NO_OF_RECORDS,
    };
    // dispatch(englishAuctionSearchRequest({ auctionCenterTypeId: 2, pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    // Make a POST request to fetch additional records
    axiosMain
      .post("/admin/ConfigureParameter/englishauctionsearch", requestData)
      .then((res) => {
        if (res.data.statusCode === 200) {
          // Assuming setTableData is a function to update the state of tableData
          // Only append the new 20 records to the existing tableData
          setTableData((prevData) => [
            ...prevData,
            ...res.data.responseData.slice(0, NO_OF_RECORDS),
          ]);

          // Update any other state if needed
          setAuctionCenterForSearch(res.data.responseData);
        }
      })
      .catch((err) => console.error(err));
  };
  const handleChange = (panel) => (event, isExpanded) => {
    dispatch(getAllTeaTypes({ isActive: 1, sortBy: "asc" }));

    setExpanded(isExpanded ? panel : false);
    setTableData([]);
    setTeatypeCatagorys([]);
    setTickSizeMappings([]);
    setDivisionMatrix([
      { minNoOfPackages: "", maxNoOfPackages: "", noOfBuyers: "" },
    ]);
    formik.resetForm();
    setStatus(false);
    setAuctionCenterForSearch([]);
    setDisabled(false);

    setIsEdit(false);

    if (panel === "panel2") {
      setDisabled(false);
      console.log("2nd page came");
      // dispatch(fetchAuctionDataRequest({ auctionCenterTypeId: 2 }));
      // dispatch(fetchAuctionDataOptionRequest({ auctionCenterTypeId: 2 }));
      axiosMain
        .post("/admin/ConfigureParameter/englishauctionsearch", {
          auctionCenterTypeId: 2,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            setTableData(res.data.responseData);
          }
        })
        .catch((err) => console.log(err));
      axiosMain
        .post("/admin/ConfigureParameter/englishauctionsearch", {
          auctionCenterTypeId: 2,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            setAuctionCenterForSearch(res.data.responseData);
          }
        })
        .catch((err) => console.log(err));
    }

    if (panel === "panel3") {
      axiosMain
        .get("/admin/ConfigureParameter/getalluploadeddocument")
        .then((res) => {
          setUploadDocumentData(
            res.data.statusCode === 200 ? res.data.responseData : []
          );
        })
        .catch((err) => console.log(err));
    }
  };

  // useEffect(() => {
  //   if (allDataList.configParam.data.length > 0) {
  //     setTableData(allDataList.configParam.data);
  //     console.log(allDataList.configParam.data, "allDataList");
  //   }
  // }, [allDataList]);

  const validationSchema = Yup.object().shape({
    // minBiddingTime: Yup.string().required("Minimum Bidding Time is required"),
    noOfActiveLots: Yup.number()
      .positive("Number of Active Lots must be a positive number")
      .integer("Number of Active Lots must be an integer")
      .max(99, "Number of Active Lots must have at most two digits")
      .required("Number of Active Lots is required"),
    catalogClosingDate: Yup.number()
      .positive("Catalog closing day is a positive number")
      .integer("Catalog closing day is an integer")
      .max(99, "Catalog closing day must have at most two digits")
      .required("Catalog closing day is required"),
    catalogPublishingDate: Yup.number()
      .positive("Catalog publishing day must be a positive number")
      .integer("Catalog publishing day must be an integer")
      .max(99, "Catalog publishing day must have at most two digits")
      .required("Catalog publishing day is required"),
    sellersPromptDate: Yup.number()
      .positive("Seller Prompt day must a positive number")
      .integer("Seller Prompt day must an integer")
      .max(99, "Seller Prompt day must have at most two digits")
      .required("Seller Prompt day is required"),
    noOfCycles: Yup.number()
      .positive("Number of cycles must be a positive number")
      .integer("Number of cycles must be an integer")
      .max(99, "Number of cycles Lots must have at most two digits")
      .required("Number of cycles is required"),
    buyersPromptDate: Yup.number()
      .positive("Buyer's Prompt day must be a positive number")
      .integer("Buyer's Prompt day must be an integer")
      .max(99, "Buyer's Prompt day must have at most two digits")
      .required("Buyer's Prompt day is required"),
    timeIntervalBetweenCycles: Yup.number()
      .typeError("Time interval between cycle must be a number")
      .positive("Time interval between cycle must be a positive number")
      .integer("Time interval between cycle must be an integer")
      .max(99, "Time interval between cycle must have at most two digits")
      .required("Time interval between cycle is required"),
    durationOfActiveLots: Yup.number()
      .typeError("Duration of active lots must be a number")
      .positive("Duration of active lots must be a positive number")
      .integer("Duration of active lots must be an integer")
      .max(99, "Duration of active lots must have at most two digits")
      .required("Duration of active lots is required"),
    minNumberOfPackageBidding: Yup.number()
      .typeError("Min number of package bidding must be a number")
      .positive("Min number of package bidding must be a positive number")
      .integer("Min number of package bidding must be an integer")
      .test(
        "maxDigits",
        "Min number of package bidding must have at most 10 digits",
        (value) => value.toString().length <= 10
      )
      .required("Min number of package bidding is required"),
    permissibleIncrease: Yup.number().required(
      "Permissible Increase over Highest Bid Price (%) is required"
    ),
    minNumberOfPackageInvoice: Yup.number().required(
      "Minimum Number of Package (Invoice) is required"
    ),
    reprintAfterWeeks: Yup.number().required(
      "Reprint After (Weeks) is required"
    ),
    allowBiddersAnonymity: Yup.boolean(),
    minNumberOfLotsAuctioneer: Yup.number().required(
      "Minimum Number of Lots (Auctioneer) is required"
    ),
    enableUniformTickSize: Yup.boolean(),
    auctionCenterId: Yup.string().required("Auction Center is required"),
  });

  const formik = useFormik({
    initialValues: {
      auctionDate: "",
      catalogClosingDate: "",
      catalogPublishingDate: "",
      buyersPromptDate: "",
      sellersPromptDate: "",
      // minBiddingTime: "",
      noOfActiveLots: "",
      noOfCycles: "",
      result: "",

      timeIntervalBetweenCycles: "",
      durationOfActiveLots: "",
      minNumberOfPackageBidding: "",
      permissibleIncrease: "",
      minNumberOfPackageInvoice: "",
      reprintAfterWeeks: "",
      allowBiddersAnonymity: false,
      minNumberOfLotsAuctioneer: "",
      enableUniformTickSize: false,
      auctionCenterId: "",
      divisionMatrix: divisionMatrix.reduce((acc, current, index) => {
        return {
          ...acc,
          [`minNoOfPackages${index}`]: current.minNoOfPackages,
          [`maxNoOfPackages${index}`]: current.maxNoOfPackages,
          [`noOfBuyers${index}`]: current.noOfBuyers,
        };
      }, {}),
      tickSizeData: {
        priceRangeCategories: [],
        categoryValues: {}, // Separate object for storing category values
      },
      tickSizeMappings: tickSizeMappingss,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // console.log("Formik Errors:", formik.errors);
      // console.log("Formik Touched:", formik.touched);
      // // convert auctionCenterId to integer if not null
      // const auctionCenterId =
      //   values.auctionCenterId !== null
      //     ? parseInt(values.auctionCenterId)
      //     : null;
      // console.log("Tick Size Data:", values.tickSizeData);
      // const { result, ...dataToSubmit } = values;
      // console.log("Division Matrix:", values.divisionMatrix);
      // // Log the form data with auctionCenterId
      // console.log("Form Data:", { ...dataToSubmit, auctionCenterId });

      // // Handle form submission here
      // // For example, you can dispatch an action to submit data
      // // dispatch(submitFormData({ ...dataToSubmit, auctionCenterId }));
      // setDivisionMatrix([{ minNoOfPackages: "", maxNoOfPackages: "", noOfBuyers: "" }]);

      let checkError = divisionMatrix
        .filter(
          (ele) =>
            ele.maxNoOfPackages === "" ||
            ele.minNoOfPackages === "" ||
            ele.noOfBuyers === ""
        )
        ?.map((ele, index) =>
          Object.values(ele)
            ?.map((item, indexs) => (item === "" ? indexs : ""))
            .filter((ele) => ele !== "")
            ?.map((eles) => {
              return { keyName: Object.keys(ele)?.at(eles), keyIndex: index };
            })
        )
        ?.at(0);

      setDivisionMatrixValidations(
        divisionMatrix
          .filter(
            (ele) =>
              ele.maxNoOfPackages === "" ||
              ele.minNoOfPackages === "" ||
              ele.noOfBuyers === ""
          )
          ?.map((ele, index) =>
            Object.values(ele)
              ?.map((item, indexs) => (item === "" ? indexs : ""))
              .filter((ele) => ele !== "")
              ?.map((eles) => Object.keys(ele)?.at(eles))
          )
      );
      console.log(
        divisionMatrix
          .filter(
            (ele) =>
              ele.maxNoOfPackages === "" ||
              ele.minNoOfPackages === "" ||
              ele.noOfBuyers === ""
          )
          ?.map((ele, index) =>
            Object.values(ele)
              ?.map((item, indexs) => (item === "" ? indexs : ""))
              .filter((ele) => ele !== "")
              ?.map((eles) => Object.keys(ele)?.at(eles))
          )
        //     ?.map((eles) => {
        //       return {
        //         keyName: Object.keys(ele).at(eles),
        //         keyIndex: index,
        //       };
        //     })
        //     ?.map((ele) => ele.keyName)
        // )
        // ?.at(0)
      );

      let newObj = {
        auctionCenterId: values.auctionCenterId,
        auctionTypeMasterId: 2,
        catalogClosingDay: values.catalogClosingDate,
        catalogPublishingDay: values.catalogPublishingDate,
        buyersPromptDays: values.buyersPromptDate,
        sellersPromptDay: values.sellersPromptDate,
        // increamentTime: values.,
        noOfActiveLots: values.noOfActiveLots,
        noOfCycles: values.noOfCycles,
        durationOfActiveLots: values.durationOfActiveLots,
        timeIntervalBetweenTwoCycleOfActiveLots:
          values.timeIntervalBetweenCycles,
        minimumNumberOfPackagesBidding: values.minNumberOfPackageBidding,
        permissibleIncreaseOverHighestBidPrice: values.permissibleIncrease,
        minimumNumberOfPackagesInvoice: values.minNumberOfPackageInvoice,
        reprintAfterWeeks: values.reprintAfterWeeks,
        // differenceToShowRP: values.,
        minimumNumberofLotsAuctioneer: values.minNumberOfLotsAuctioneer,
        allowBiddersAnonymity: values.allowBiddersAnonymity ? 1 : 0,
        enableUniformTickSize: values.enableUniformTickSize ? 1 : 0,
        isActive: status ? 1 : 0,
        uploadDocumentRemarks: documentBrief === null ? [] : documentBrief,
        downloadDto:
          byteCode === null
            ? []
            : [
                {
                  documentContent: byteCode,
                  documentName: flname,
                  documentSize: flsize,
                },
              ],
        isExport: 0,
        exportType: null,
        packagesTypeMappings: divisionMatrix,
        teaTypeMappings: isEdit
          ? teaTypeCategoryss.filter(
              (ele) =>
                ele.columnNo !== null &&
                ele.rowNo !== null &&
                ele.value !== null
            )
          : teaTypeCategoryss,
        tickSizeMappings: tickSizeMappingss,
      };
      // console.log("File uploaded:", selectedFile);
      // console.log("Document Name:", fileName);
      // console.log("File Size (MB):", fileSizeMB);
      // console.log("Base64 Data:", base64Data);
      // console.log("Document Brief:", documentBrief);
      let data = tickSizeMappingss
        ?.map((ele) => ele.configTickSizeMappingId)
        ?.map((ele, index) => (ele === undefined ? index : ""))
        .filter((ele) => ele !== "")
        ?.map((ele) => tickSizeMappingss[ele]);

      // console.log(
      //   divisionMatrix.filter(
      //     (ele) =>
      //       ele.maxNoOfPackages === "" ||
      //       ele.minNoOfPackages === "" ||
      //       ele.noOfBuyers === ""
      //   ),
      //   // Object.values(
      //   //   divisionMatrix.filter(
      //   //     (ele) =>
      //   //       ele.maxNoOfPackages === "" ||
      //   //       ele.minNoOfPackages === "" ||
      //   //       ele.noOfBuyers === ""
      //   //   )
      //   // ),
      //   divisionMatrix.filter(
      //     (ele) =>
      //       ele.maxNoOfPackages === "" ||
      //       ele.minNoOfPackages === "" ||
      //       ele.noOfBuyers === ""
      //   ),
      //   // ?.map((ele, index) => ele)
      //   // ?.at(0)
      //   divisionMatrix
      // );
      // console.log(
      //   tickSizeMappingss
      //     ?.map((ele) => ele.configTickSizeMappingId)
      //     .filter((ele) => ele !== undefined)
      //     ?.map((ele, index) => {
      //       return {
      //         ...ele,
      //         rowNo: data[index].rowNo,
      //         value: parseInt(data[index].values),
      //         columnNo: data[index].columnNo,
      //         categoryId: data[index].categoryId, // You can set a default value or handle this as needed
      //         pricerrange: data[index].pricerrange,
      //       };
      //     })
      // );
      // console.log(
      //   "values===",
      //   tickSizeMappingss,
      //   tickSizeMappingss
      //     ?.map((ele, index) =>
      //       ele.columnNo === 2 && ele.rowNo === 1 ? index : ""
      //     )
      //     .filter((ele) => ele !== "")
      //     ?.at(0),
      //   tickSizeMappingss
      //     .filter((ele) => ele.columnNo === 2 && ele.rowNo === 1)
      //     ?.at(
      //       tickSizeMappingss
      //         ?.map((ele, index) =>
      //           ele.columnNo === 2 && ele.rowNo === 1 ? index : ""
      //         )
      //         .filter((ele) => ele !== "")
      //         ?.at(0)
      //     )?.value
      // );
      // console.log(newObj, divisionMatrix, "===Value");
      // dispatch(createAuctionRequest(newObj));
      if (divisionMatrixValidations.length <= 0) {
        if (isEdit) {
          axiosMain
            .post("/admin/ConfigureParameter/englishauctionupdate", {
              ...newObj,
              configParaId: values.configParaId,
            })
            .then((res) => {
              if (res.data.statusCode === 200) {
                CustomToast.success(res.data.message);
                setExpanded("panel2");
              } else {
                CustomToast.warning(res.data.message);
              }
            })
            .catch((err) => console.log(err));
        } else {
          axiosMain
            .post("/admin/ConfigureParameter/englishAuctioncreate", newObj)
            .then((res) => {
              if (res.data.statusCode === 200) {
                CustomToast.success(res.data.message);
                formik.resetForm();
              } else {
                CustomToast.warning(res.data.message);
              }
            });
        }
        // Reset the form after submission
        // resetForm();
      }
    },
    validateOnBlur: true,
  });

  useEffect(() => {
    dispatch(getAllTeaTypes({ isActive: 1, sortBy: "asc" }));
    dispatch(fetchPriceRangeRequest());
    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
      })
    );
    dispatch(
      getAllCategoriesAscAction({
        sortBy: "asc",
        sortColumn: "categoryCode",
        isActive: 1,
        // sortColumn: "categoryName",
      })
    );
  }, []);

  useEffect(() => {
    setTeatypeCatagorys(allTeaType?.length > 0 ? allTeaType : []);
  }, [allTeaType]);

  const handleActiveLotsCyclesChange = (field, value) => {
    formik.setFieldValue(field, value);

    const noOfActiveLots = formik.values.noOfActiveLots;
    const noOfCycles = formik.values.noOfCycles;

    const result =
      isNaN(noOfActiveLots) || isNaN(noOfCycles)
        ? ""
        : noOfActiveLots * noOfCycles;
    formik.setFieldValue("result", result);
  };
  useEffect(() => {
    const calculateResult = () => {
      const noOfActiveLots = formik.values.noOfActiveLots;
      const noOfCycles = formik.values.noOfCycles;
      const result =
        isNaN(noOfActiveLots) || isNaN(noOfCycles)
          ? ""
          : noOfActiveLots * noOfCycles;
      formik.setFieldValue("result", result);
    };

    calculateResult();
  }, [formik.values.noOfActiveLots, formik.values.noOfCycles]);

  const handleAddMore = () => {
    const newMatrix = [
      ...divisionMatrix,
      { minNoOfPackages: "", maxNoOfPackages: "", noOfBuyers: "" },
    ];

    setDivisionMatrix(newMatrix);

    // // Update formik values here
    // const newValues = [
    //   ...formik.values.divisionMatrix,
    //   { minNoOfPackages: "", maxNoOfPackages: "", noOfBuyers: "" },
    // ];
    // formik.setFieldValue("divisionMatrix", newValues);
  };
  const handleRemove = (index) => {
    const newMatrix = [...divisionMatrix];
    // newMatrix.splice(index, 1);
    setDivisionMatrix(newMatrix.filter((ele, indexs) => indexs !== index));
    // setDivisionMatrix(newMatrix);
  };

  const handleInputChange = (index, field, value) => {
    const newMatrix = divisionMatrix?.map((row, i) => {
      if (i === index) {
        return { ...row, [field]: value };
      }
      return row;
    });

    setDivisionMatrix(newMatrix);

    // // Update formik values here
    // const newValues = [...formik.values.divisionMatrix];
    // newValues[index][field] = value;
    // formik.setFieldValue("divisionMatrix", newValues);
  };

  // const handleSubmit = () => {
  //   // Implement your logic for handling the division matrix on form submission
  //   console.log("Division Matrix:", divisionMatrix);
  // };
  const handleCategoryInputChange = (key, value) => {
    console.log(key, value);
    // Set category value in formik state
    formik.setFieldValue(`tickSizeData.categoryValues.${key}`, value);

    // Manually trigger field-level validation
    // formik.validateField(`tickSizeData.categoryValues.${key}`);
  };
  // useEffect(() => {
  //   console.log("Formik Values Structure:", formik.values);
  // }, [formik.values]);

  const tableHeaders = [
    { label: "Price Range", key: "priceRange" },
    ...(isActiveCategoryData || [])
      ?.filter((ele, index) => index < 3)
      .map((category) => ({
        label: category.categoryName,
        key: category.categoryId,
      })),
  ];
  const tableHeaders1 = [
    { label: "Type", key: "teaTypeName" },
    ...(isActiveCategoryData || [])
      .filter((ele, index) => index < 3)
      ?.map((category) => ({
        label: category.categoryName,
        key: category.categoryId,
      })),
  ];
  const teatypeTableHeaders = [
    { label: "Type", key: "teaTypeName" },
    ...(allTeaType || [])
      ?.filter((ele, index) => index < 3)
      .map((category) => ({
        label: category.categoryName,
        key: category.categoryId,
      })),
  ];
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Check if a file is selected
    if (file) {
      // Check if the file type is PDF
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setErrorMessage("");
      } else {
        // Display error message for incorrect file type
        setSelectedFile(null);
        setErrorMessage("Incorrect file type. Please select a PDF file.");
      }
    }
  };

  const handleDocumentBriefChange = (e) => {
    setDocumentBrief(e.target.value);
  };
  const handleUpload = async () => {
    if (selectedFile) {
      const reader = await new FileReader();
      reader.onloadend = () => {
        // Get the base64 data without the data URL prefix
        const base64Data = reader.result.split(",")[1];

        // Get the file name and size
        const fileName = selectedFile.name;
        const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);

        // Implement your upload functionality
        console.log("File uploaded:", selectedFile);
        console.log("Document Name:", fileName);
        console.log("File Size (MB):", fileSizeMB);
        console.log("Base64 Data:", base64Data);
        console.log("Document Brief:", documentBrief);

        // Clear the form after successful upload
        setBytecode(base64Data);
        filesize(fileSizeMB);
        filename(fileName);
        setSelectedFile(null);
        setDocumentBrief("");
      };

      // Read the file content as a data URL
      reader.readAsDataURL(selectedFile);
    } else {
      // Display error message if no file is selected
      setErrorMessage("Please select a PDF file before uploading.");
    }
  };

  const handleClear = () => {
    // Clear the form
    setSelectedFile(null);
    setDocumentBrief("");
    setErrorMessage("");
  };
  // Function to handle input changes
  const handleInputChanges = (
    rowIndex,
    columnName,
    values,
    categoryId,
    pricerranges
  ) => {
    // setTickSizeMappings((prevData) => {
    //   const newData = [...prevData];
    //   const existingRow = newData[rowIndex] || {}; // Get the existing row or create a new one
    //   existingRow[columnName] = value; // Update the specific property
    //   newData[rowIndex] = existingRow;
    //   return newData;
    // });
    setTickSizeMappings((prevData) => {
      const newData = [...prevData];
      const existingRow = newData.find(
        (row) => row.rowNo === rowIndex && row.columnNo === columnName
      );

      if (existingRow) {
        // If the row with the same rowIndex exists, update the existing row
        existingRow.value = values;
      } else {
        // If the row with the same rowIndex doesn't exist, create a new row
        const newRow = {
          rowNo: rowIndex,
          value: values,
          columnNo: columnName,
          categoryId: categoryId, // You can set a default value or handle this as needed
          pricerrange: pricerranges,
        };
        newData.push(newRow);
      }

      return newData;
    });
  };

  //Function to handle teatype table input changes
  const handleTeaTypeInputChanges = (
    rowIndex,
    columnName,
    values,
    categoryId,
    teaTypeIds
  ) => {
    // setTickSizeMappings((prevData) => {
    //   const newData = [...prevData];
    //   const existingRow = newData[rowIndex] || {}; // Get the existing row or create a new one
    //   existingRow[columnName] = value; // Update the specific property
    //   newData[rowIndex] = existingRow;
    //   return newData;
    // });
    setTeatypeCatagorys((prevData) => {
      const newData = [...prevData];
      const existingRow = newData.find(
        (row) => row.rowNo === rowIndex && row.columnNo === columnName
      );

      if (existingRow) {
        // If the row with the same rowIndex exists, update the existing row
        existingRow.value = values;
      } else {
        // If the row with the same rowIndex doesn't exist, create a new row
        const newRow = {
          rowNo: rowIndex,
          value: values,
          columnNo: columnName,
          categoryId: categoryId, // You can set a default value or handle this as needed
          teaTypeId: teaTypeIds,
        };
        newData.push(newRow);
      }

      return newData;
    });
  };

  // console.log(
  //   tickSizeMappingss,
  //   Object.keys(tickSizeMappingss).filter((ele) => ele !== "0")
  // );
  // console.log(
  //   teaTypeCategoryss?.filter((ele) => ele.rowNo === 1
  // );

  const handleAuctionCenterChange = (event) => {
    setSelectedAuctionCenter(event.target.value);
  };

  const handleAuctionCenterSubmit = () => {
    if (selectedAuctionCenter !== null) {
      // Call your API or dispatch an action with the selected auction center ID
      // dispatch(
      //   fetchAuctionDataRequest({
      //     auctionCenterTypeId: 2,
      //     auctionCenterId: selectedAuctionCenter,
      //   })
      // );
      axiosMain
        .post("/admin/ConfigureParameter/englishauctionsearch", {
          auctionCenterTypeId: 2,
          auctionCenterId: selectedAuctionCenter,
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            setTableData(res.data.responseData);
          }
        })
        .catch((err) => console.log(err));
    }
    // Check if the selected auction center is different from the one in the state
  };

  // Update the tableData state when the initial data is available

  // Remove this useEffect block

  //Manage create config code

  //Manage create config code end logic

  const callGetById = (id, action) => {
    axiosMain
      .get(`/admin/ConfigureParameter/getenglishauction/${id}`)
      .then((res) => {
        // console.log(res);
        if (res.data.statusCode === 200) {
          let values = res.data.responseData;
          // setExpanded("panel1");
          // formik.setValues(values);

          if ("edit" === action) {
            setEditModal(true);
          } else if ("view" === action) {
            setViewModal(true);
          }

          setDisabled(action === "view");
          setIsEdit(action === "edit");

          setTickSizeMappings(values.tickSizeMappings);
          setDivisionMatrix(values.packagesTypeMappings);
          setSelectedAuctionCenter(values.auctionCenterId);
          setTeatypeCatagorys(values.teaTypeMappings);
          setStatus(values.isActive === 1 ? true : false);

          // formik.setFieldValue("auctionCenterId", values.auctionCenterId);
          // formik.setFieldValue("catalogClosingDate", values.catalogClosingDay);
          // formik.setFieldValue(
          //   "catalogPublishingDate",
          //   values.catalogPublishingDay
          // );
          // formik.setFieldValue("buyersPromptDate", values.buyersPromptDays);
          // formik.setFieldValue("sellersPromptDate", values.sellersPromptDay);
          // formik.setFieldValue("noOfActiveLots", values.noOfActiveLots);
          // formik.setFieldValue("noOfCycles", values.noOfCycles);
          // formik.setFieldValue(
          //   "durationOfActiveLots",
          //   values.durationOfActiveLots
          // );
          // formik.setFieldValue(
          //   "timeIntervalBetweenCycles",
          //   values.timeIntervalBetweenTwoCycleOfActiveLots
          // );
          // formik.setFieldValue(
          //   "minNumberOfPackageBidding",
          //   values.minimumNumberOfPackagesBidding
          // );
          // formik.setFieldValue(
          //   "permissibleIncrease",
          //   values.permissibleIncreaseOverHighestBidPrice
          // );
          // formik.setFieldValue(
          //   "minNumberOfPackageInvoice",
          //   values.minimumNumberOfPackagesInvoice
          // );
          // formik.setFieldValue("reprintAfterWeeks", values.auctionCenterId); // aapan nathi
          // formik.setFieldValue(
          //   "minNumberOfLotsAuctioneer",
          //   values.minimumNumberofLotsAuctioneer
          // );
          // formik.setFieldValue(
          //   "enableUniformTickSize",
          //   values.enableUniformTickSize === 0 ? false : true
          // );
          // formik.setFieldValue(
          //   "allowBiddersAnonymity",
          //   values.allowBiddersAnonymity === 0 ? false : true
          // );
          const fieldValues = {
            auctionCenterId: values.auctionCenterId,
            catalogClosingDate: values.catalogClosingDay,
            catalogPublishingDate: values.catalogPublishingDay,
            buyersPromptDate: values.buyersPromptDays,
            sellersPromptDate: values.sellersPromptDay,
            noOfActiveLots: values.noOfActiveLots,
            noOfCycles: values.noOfCycles,
            durationOfActiveLots: values.durationOfActiveLots,
            timeIntervalBetweenCycles:
              values.timeIntervalBetweenTwoCycleOfActiveLots,
            minNumberOfPackageBidding: values.minimumNumberOfPackagesBidding,
            permissibleIncrease: values.permissibleIncreaseOverHighestBidPrice,
            minNumberOfPackageInvoice: values.minimumNumberOfPackagesInvoice,
            reprintAfterWeeks: values.auctionCenterId,
            minNumberOfLotsAuctioneer: values.minimumNumberofLotsAuctioneer,
            enableUniformTickSize:
              values.enableUniformTickSize === 0 ? false : true,
            allowBiddersAnonymity:
              values.allowBiddersAnonymity === 0 ? false : true,
            configParaId: values.configParaId,
          };

          Object.entries(fieldValues).forEach(([fieldName, value]) => {
            formik.setFieldValue(fieldName, value);
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDownload = (documentName, documentBytes) => {
    // Decode base64 encoded documentBytes
    const decodedBytes = atob(documentBytes);

    // Create a Blob from the decoded bytes
    const blob = new Blob([
      new Uint8Array([...decodedBytes]?.map((char) => char.charCodeAt(0))),
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
  };

  const ActionArea = (row) => {
    function handleAction(action) {
      // setExpanded("panel2");
      console.log(row.data.configParaId);

      switch (action) {
        // case "view": {
        //   return dispatch(
        //     fetchSaleProgramDetailsRequest(row.data.saleProgramDetailId)
        //   );
        // }
        case "view": {
          callGetById(row.data.configParaId, action);
          break;
        }
        case "edit": {
          callGetById(row.data.configParaId, action);
          break;
        }
        default:
          return "no data";
      }
    }
    return (
      <>
        <div className="Action">
          {modalRight?.some((ele) => ele === "3") && (
            <span onClick={() => handleAction("view")}>
              <VisibilityIcon />
            </span>
          )}
          <span className="brack"></span>
          {modalRight?.some((ele) => ele === "2") && (
            <span onClick={() => handleAction("edit")}>
              <EditIcon />
            </span>
          )}

          <span className="brack"></span>
          {modalRight?.some((ele) => ele === "4") && (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                axiosMain
                  .get(
                    "/admin/getHistory/tbl_ConfigureParameter/ConfigureParameter/" +
                      row.data.configParaId
                  )
                  .then((res) => {
                    setOpenModal(true);

                    setHistoryTableData(
                      res.data.statsCode === 200 ? res.data.responseData : []
                    );
                  });
              }}
            >
              <History />
            </span>
          )}
        </div>
      </>
    );
  };

  const handleChangeDense = async (event, configParaId) => {
    const isActive = event.target.checked ? 1 : 0;
    console.log("function callewd", event);
    setStatus(event.target.checked);
    setStatus1(event.target.checked);
    console.log(`The ${configParaId} and its ${isActive}`);

    try {
      // First, make a GET request to the first API
      const responseGet = await axiosMain.get(
        `/admin/ConfigureParameter/getenglishauction/${configParaId}`
      );

      // Update the isActive value in the response data
      const responseDataUpdated = {
        ...responseGet.data.responseData,
        isActive: isActive,
      };

      // Make a POST request to the second API with the updated response data
      const responsePost = await axiosMain.post(
        "/admin/ConfigureParameter/englishauctionupdate",
        responseDataUpdated
      );
      if (responsePost.data.statusCode === 200) {
        CustomToast.success(responsePost.data.message);
        formik.resetForm();
      } else {
        CustomToast.warning(responsePost.data.message);
      }

      const responseSearch = await axiosMain.post(
        "/admin/ConfigureParameter/englishauctionsearch",
        {
          auctionCenterTypeId: 2,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        }
      );

      if (responseSearch.data.statusCode === 200) {
        setTableData(responseSearch.data.responseData);
      }
      console.log("GET response:", responseGet.data);
      console.log("POST response:", responsePost.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [previewDocumentContent, setPreviewDocumentContent] = useState(null);
  const handlePreviewClick = (uploadDocumentConfId) => {
    axiosMain
      .get(`/admin/getdocumentdetail/${uploadDocumentConfId}`)
      .then((res) => {
        const documentContent = res.data.responseData.documentContent;
        // You can render a modal or use state to show the preview
        // For this example, let's just update a state
        setPreviewDocumentContent(documentContent);
      })
      .catch((error) => {
        console.error("Error fetching document details:", error);
      });
  };

  const ExportExcelDatas = useSelector(
    (state) => state.documentReducer.exportData.responseData?.exported_file
  );

  const getExportDataApiCallResponse = useSelector(
    (state) => state.documentReducer.exportDataApiCall
  );

  const [exportType, setexportType] = useState("");

  const handleExport = (exportType) => {
    const updatedDealBookSearch = {
      auctionTypeMasterId: 2,
      url: "/admin/ConfigureParameter/englishauctionsearch",
      auctionCenterTypeId: 2,
      pageNo: pageNo,

      exportType: exportType,
      isExport: 1,
    };
    setexportType(exportType);
    dispatch(getExportData(updatedDealBookSearch));
  };

  useEffect(() => {
    if (ExportExcelDatas != null && true == getExportDataApiCallResponse) {
      dispatch(getExportDataApiCall(false));
      if ("excel" == exportType) {
        Base64ToExcelDownload(ExportExcelDatas, "CreateConfig_english.xlsx");
      } else {
        uploadedFileDownload(
          ExportExcelDatas,
          "CreateConfig_english.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleCloseViewModal = () => {
    setViewModal(false);
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
  };

  return (
    <>
      {/* Create */}
      <Accordion
        expanded={expanded === "panel1"}
        className={`${expanded === "panel1" ? "active" : ""}`}
        onChange={handleChange("panel1")}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            <Typography>Create Configure Parameter</Typography>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row configure_parameter" id="">
              <div className="col-lg-12 ">
                {" "}
                <form onSubmit={formik.handleSubmit}>
                  <h3 className="text-dark ml-3">Days</h3>
                  <div className="row align-items-end m-3 p-3 border border-dark">
                    {/* Inside the form */}
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Auction Center</label>
                        <Form.Select
                          id="auctionCenterId"
                          className="form-control"
                          {...formik.getFieldProps("auctionCenterId")}
                          isInvalid={
                            formik.touched.auctionCenterId &&
                            Boolean(formik.errors.auctionCenterId)
                          }
                          disabled={isDisabled || isEdit}
                        >
                          <option value="" disabled>
                            Please select a value
                          </option>
                          {getAllAuctionCenterResponse &&
                          getAllAuctionCenterResponse.length > 0 ? (
                            getAllAuctionCenter?.map((center) => (
                              <option
                                key={center.auctionCenterId}
                                value={parseInt(center.auctionCenterId)} // Use the ID as the value
                              >
                                {center.auctionCenterName}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No data available
                            </option>
                          )}
                        </Form.Select>

                        <Form.Control.Feedback type="invalid">
                          {formik.touched.auctionCenterId &&
                            formik.errors.auctionCenterId}
                        </Form.Control.Feedback>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        {formik.touched.auctionCenterId &&
                          formik.errors.auctionCenterId}
                      </Form.Control.Feedback>
                    </div>

                    {/* Input fields */}
                    {isEdit ? (
                      ""
                    ) : (
                      <div className="col-xl-3 col-lg-4 col-md-4">
                        <div className="FomrGroup">
                          <label>Auction Date</label>
                          <TextField
                            className="form-control"
                            id="auctionDate"
                            // label="Auction Date"
                            type="text"
                            fullWidth
                            {...formik.getFieldProps("auctionDate")}
                            error={
                              formik.touched.auctionDate &&
                              Boolean(formik.errors.auctionDate)
                            }
                            helperText={
                              formik.touched.auctionDate &&
                              formik.errors.auctionDate
                            }
                            disabled={isDisabled}
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <div className="form-group">
                          <label>Catalog Closing Date</label>
                          <TextField
                            className="form-control"
                            id="catalogClosingDate"
                            // label="Catalog Closing Date"
                            type="text"
                            fullWidth
                            {...formik.getFieldProps("catalogClosingDate")}
                            error={
                              formik.touched.catalogClosingDate &&
                              Boolean(formik.errors.catalogClosingDate)
                            }
                            disabled={isDisabled}
                            helperText={
                              formik.touched.catalogClosingDate &&
                              formik.errors.catalogClosingDate
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Catalog Publishing Date</label>
                        <TextField
                          className="form-control"
                          id="catalogPublishingDate"
                          // label="Catalog Publishing Date"
                          type="text"
                          fullWidth
                          {...formik.getFieldProps("catalogPublishingDate")}
                          error={
                            formik.touched.catalogPublishingDate &&
                            Boolean(formik.errors.catalogPublishingDate)
                          }
                          disabled={isDisabled}
                          helperText={
                            formik.touched.catalogPublishingDate &&
                            formik.errors.catalogPublishingDate
                          }
                        />
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Buyer's prompt Date</label>
                        <TextField
                          className="form-control"
                          id="buyersPromptDate"
                          // label="Buyer's prompt Date"
                          type="text"
                          fullWidth
                          {...formik.getFieldProps("buyersPromptDate")}
                          error={
                            formik.touched.buyersPromptDate &&
                            Boolean(formik.errors.buyersPromptDate)
                          }
                          disabled={isDisabled}
                          helperText={
                            formik.touched.buyersPromptDate &&
                            formik.errors.buyersPromptDate
                          }
                        />
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Sellers prompt Date</label>
                        <TextField
                          className="form-control"
                          id="sellersPromptDate"
                          // label="Sellers prompt Date"
                          type="text"
                          fullWidth
                          {...formik.getFieldProps("sellersPromptDate")}
                          error={
                            formik.touched.sellersPromptDate &&
                            Boolean(formik.errors.sellersPromptDate)
                          }
                          helperText={
                            formik.touched.sellersPromptDate &&
                            formik.errors.sellersPromptDate
                          }
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-dark ml-3">Knock Down Process</h3>
                  <div className="row align-items-end m-3 p-3 border border-dark">
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>No of Active Lots</label>
                        <TextField
                          className="form-control"
                          id="noOfActiveLots"
                          // label="No of Active Lots"
                          type="number"
                          fullWidth
                          {...formik.getFieldProps("noOfActiveLots")}
                          value={formik.values.noOfActiveLots}
                          onChange={(e) => {
                            const value = e.target.value;
                            formik.setFieldValue("noOfActiveLots", value);
                            handleActiveLotsCyclesChange(
                              "noOfActiveLots",
                              value
                            );
                          }}
                          disabled={isDisabled}
                          error={
                            formik.touched.noOfActiveLots &&
                            Boolean(formik.errors.noOfActiveLots)
                          }
                          helperText={
                            formik.touched.noOfActiveLots &&
                            formik.errors.noOfActiveLots
                          }
                        />
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>No of Cycles</label>
                        <TextField
                          className="form-control"
                          id="noOfCycles"
                          // label="No of Cycles"
                          type="number"
                          fullWidth
                          {...formik.getFieldProps("noOfCycles")}
                          value={formik.values.noOfCycles}
                          onChange={(e) => {
                            const value = e.target.value;
                            formik.setFieldValue("noOfCycles", value);
                            handleActiveLotsCyclesChange("noOfCycles", value);
                          }}
                          disabled={isDisabled}
                          error={
                            formik.touched.noOfCycles &&
                            Boolean(formik.errors.noOfCycles)
                          }
                          helperText={
                            formik.touched.noOfCycles &&
                            formik.errors.noOfCycles
                          }
                        />
                      </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Result</label>
                        <TextField
                          className="form-control"
                          id="result"
                          // label="Result"
                          type="text"
                          fullWidth
                          value={formik.values.result}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Duration of Active Lots</label>
                        <TextField
                          className="form-control"
                          id="durationOfActiveLots"
                          // label="Duration of Active Lots"
                          type="text"
                          fullWidth
                          {...formik.getFieldProps("durationOfActiveLots")}
                          error={
                            formik.touched.durationOfActiveLots &&
                            Boolean(formik.errors.durationOfActiveLots)
                          }
                          helperText={
                            formik.touched.durationOfActiveLots &&
                            formik.errors.durationOfActiveLots
                          }
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Time Interval Between Cycles</label>
                        <TextField
                          className="form-control"
                          id="timeIntervalBetweenCycles"
                          // label="Time Interval Between Cycles"
                          type="text"
                          fullWidth
                          {...formik.getFieldProps("timeIntervalBetweenCycles")}
                          error={
                            formik.touched.timeIntervalBetweenCycles &&
                            Boolean(formik.errors.timeIntervalBetweenCycles)
                          }
                          helperText={
                            formik.touched.timeIntervalBetweenCycles &&
                            formik.errors.timeIntervalBetweenCycles
                          }
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-dark ml-3">General Section</h3>
                  <div className="row align-items-end m-3 p-3 border border-dark">
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Minimum Number of Package (Bidding)</label>
                        <TextField
                          className="form-control"
                          id="minNumberOfPackageBidding"
                          // label="Minimum Number of Package (Bidding)"
                          type="number"
                          fullWidth
                          {...formik.getFieldProps("minNumberOfPackageBidding")}
                          error={
                            formik.touched.minNumberOfPackageBidding &&
                            Boolean(formik.errors.minNumberOfPackageBidding)
                          }
                          helperText={
                            formik.touched.minNumberOfPackageBidding &&
                            formik.errors.minNumberOfPackageBidding
                          }
                          disabled={isDisabled}
                        />
                      </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>
                          Permissible Increase over Highest Bid Price (%)
                        </label>
                        <TextField
                          className="form-control"
                          id="permissibleIncrease"
                          // label="Permissible Increase over Highest Bid Price (%)"
                          type="number"
                          fullWidth
                          {...formik.getFieldProps("permissibleIncrease")}
                          error={
                            formik.touched.permissibleIncrease &&
                            Boolean(formik.errors.permissibleIncrease)
                          }
                          helperText={
                            formik.touched.permissibleIncrease &&
                            formik.errors.permissibleIncrease
                          }
                          disabled={isDisabled}
                        />
                      </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Minimum Number of Package (Invoice)</label>
                        <TextField
                          className="form-control"
                          id="minNumberOfPackageInvoice"
                          // label="Minimum Number of Package (Invoice)"
                          type="number"
                          fullWidth
                          {...formik.getFieldProps("minNumberOfPackageInvoice")}
                          error={
                            formik.touched.minNumberOfPackageInvoice &&
                            Boolean(formik.errors.minNumberOfPackageInvoice)
                          }
                          helperText={
                            formik.touched.minNumberOfPackageInvoice &&
                            formik.errors.minNumberOfPackageInvoice
                          }
                          disabled={isDisabled}
                        />
                      </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Reprint After (Weeks)</label>
                        <TextField
                          className="form-control"
                          id="reprintAfterWeeks"
                          // label="Reprint After (Weeks)"
                          type="number"
                          fullWidth
                          {...formik.getFieldProps("reprintAfterWeeks")}
                          error={
                            formik.touched.reprintAfterWeeks &&
                            Boolean(formik.errors.reprintAfterWeeks)
                          }
                          helperText={
                            formik.touched.reprintAfterWeeks &&
                            formik.errors.reprintAfterWeeks
                          }
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Minimum Number of Lots (Auctioneer)</label>
                        <TextField
                          className="form-control"
                          id="minNumberOfLotsAuctioneer"
                          // label="Minimum Number of Lots (Auctioneer)"
                          type="number"
                          fullWidth
                          helperText={
                            formik.touched.minNumberOfLotsAuctioneer &&
                            formik.errors.minNumberOfLotsAuctioneer
                          }
                          {...formik.getFieldProps("minNumberOfLotsAuctioneer")}
                          error={
                            formik.touched.minNumberOfLotsAuctioneer &&
                            Boolean(formik.errors.minNumberOfLotsAuctioneer)
                          }
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup" id="text_dark">
                        <FormControlLabel
                          control={
                            <Checkbox
                              id="allowBiddersAnonymity"
                              {...formik.getFieldProps("allowBiddersAnonymity")}
                            />
                          }
                          label="Allow Bidders Anonymity"
                          disabled={isDisabled}
                        />
                      </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup" id="text_dark">
                        <FormControlLabel
                          control={
                            <Checkbox
                              id="enableUniformTickSize"
                              {...formik.getFieldProps("enableUniformTickSize")}
                            />
                          }
                          label="Enable Uniform Tick Size"
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                    {isDisabled === false && isEdit === false ? (
                      ""
                    ) : (
                      <div className="col-xl-3 col-lg-4 col-md-4">
                        <div className="FomrGroup">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={status}
                                onChange={handleChangeDense}
                                disabled={isDisabled}
                              />
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-dark ml-3">Division of Lots</h3>
                  <div className="row align-items-end m-3 p-3 border border-dark">
                    <TableContainer component={Paper}>
                      <Table className="TableBox">
                        <TableHead>
                          <TableRow>
                            <TableCell>Min Package</TableCell>
                            <TableCell>Max Package</TableCell>
                            <TableCell>No. of Buyers</TableCell>
                            {isDisabled ? "" : <TableCell>Action</TableCell>}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {divisionMatrix?.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={row.minNoOfPackages}
                                  disabled={isDisabled}
                                  onChange={(e) => {
                                    handleInputChange(
                                      index,
                                      "minNoOfPackages",
                                      e.target.value
                                    );

                                    if (e.target.value === "") {
                                      let data = [...divisionMatrixValidations];
                                      data[index] = [
                                        ...data[index],
                                        "minNoOfPackages",
                                      ];
                                      setDivisionMatrixValidations(data);
                                    } else {
                                      let data = [...divisionMatrixValidations];
                                      data[index] = divisionMatrixValidations[
                                        index
                                      ]?.filter(
                                        (ele) => ele !== "minNoOfPackages"
                                      );
                                      setDivisionMatrixValidations(data);
                                    }
                                  }}
                                />
                                {divisionMatrixValidations?.map(
                                  (ele, errorIndex) =>
                                    errorIndex === index
                                      ? ele?.map(
                                          (items) =>
                                            items === "minNoOfPackages" && (
                                              <p style={{ color: "red" }}>
                                                Min Package is missing
                                              </p>
                                            )
                                        )
                                      : ""
                                )}
                              </TableCell>

                              <TableCell>
                                <TextField
                                  type="number"
                                  disabled={isDisabled}
                                  value={row.maxNoOfPackages}
                                  onChange={(e) => {
                                    handleInputChange(
                                      index,
                                      "maxNoOfPackages",
                                      e.target.value
                                    );
                                    if (e.target.value === "") {
                                      let data = [...divisionMatrixValidations];
                                      data[index] = [
                                        ...data[index],
                                        "maxNoOfPackages",
                                      ];
                                      setDivisionMatrixValidations(data);
                                    } else {
                                      let data = [...divisionMatrixValidations];
                                      data[index] = divisionMatrixValidations[
                                        index
                                      ]?.filter(
                                        (ele) => ele !== "maxNoOfPackages"
                                      );
                                      setDivisionMatrixValidations(data);
                                    }
                                  }}
                                  error={
                                    formik.touched.divisionMatrix &&
                                    formik.errors.divisionMatrix &&
                                    formik.errors.divisionMatrix[index] &&
                                    formik.errors.divisionMatrix[index]
                                      .maxNoOfPackages !== undefined
                                  }
                                  helperText={
                                    (formik.touched.divisionMatrix &&
                                      formik.errors.divisionMatrix &&
                                      formik.errors.divisionMatrix[index] &&
                                      formik.errors.divisionMatrix[index]
                                        .maxNoOfPackages) ||
                                    ""
                                  }
                                />
                                {/* {divisionMatrixValidations[0]?.keyName ===
                                  "maxNoOfPackages" && (
                                  <p style={{ color: "red" }}>
                                    Max Package is missing
                                  </p>
                                )} */}
                                {divisionMatrixValidations?.map(
                                  (ele, errorIndex) =>
                                    errorIndex === index
                                      ? ele?.map(
                                          (items) =>
                                            items === "maxNoOfPackages" && (
                                              <p style={{ color: "red" }}>
                                                Max Package is missing
                                              </p>
                                            )
                                        )
                                      : ""
                                )}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  disabled={isDisabled}
                                  value={row.noOfBuyers}
                                  onChange={(e) => {
                                    handleInputChange(
                                      index,
                                      "noOfBuyers",
                                      e.target.value
                                    );

                                    if (e.target.value === "") {
                                      let data = [...divisionMatrixValidations];
                                      data[index] = [
                                        ...data[index],
                                        "noOfBuyers",
                                      ];
                                      setDivisionMatrixValidations(data);
                                    } else {
                                      let data = [...divisionMatrixValidations];
                                      data[index] = divisionMatrixValidations[
                                        index
                                      ]?.filter((ele) => ele !== "noOfBuyers");
                                      setDivisionMatrixValidations(data);
                                    }
                                  }}
                                />
                                {/* {divisionMatrixValidations[0]?.keyName ===
                                  "noOfBuyers" && (
                                  <p style={{ color: "red" }}>
                                    No. of Buyers is missing
                                  </p>
                                )} */}
                                {divisionMatrixValidations?.map(
                                  (ele, errorIndex) =>
                                    errorIndex === index
                                      ? ele?.map(
                                          (items) =>
                                            items === "noOfBuyers" && (
                                              <p style={{ color: "red" }}>
                                                No. of Buyers is missing
                                              </p>
                                            )
                                        )
                                      : ""
                                )}
                              </TableCell>
                              {isDisabled ? (
                                ""
                              ) : (
                                <TableCell>
                                  <div
                                    style={{ curser: "pointer" }}
                                    onClick={() => handleRemove(index)}
                                  >
                                    <DeleteIcon />
                                  </div>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {isDisabled ? (
                      ""
                    ) : (
                      <Button onClick={handleAddMore}>Add More</Button>
                    )}
                  </div>
                  <h3 className="text-dark ml-3">Tick size</h3>
                  <div className="row align-items-end m-3 p-3 border border-dark">
                    <TableContainer
                      component={Paper}
                      className="tick-size TableBox"
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            {tableHeaders?.map((header) => (
                              <TableCell key={header.key}>
                                {header.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Map over the price range response and create rows */}
                          {priceRange &&
                            priceRange?.map((priceRangeCategory, index) => (
                              <TableRow key={priceRangeCategory.tickId}>
                                {tableHeaders?.map((header, indexs) => (
                                  <TableCell key={indexs}>
                                    {header.key === "priceRange" ? (
                                      // Display the priceRange value from the response
                                      priceRangeCategory.value
                                    ) : (
                                      // Other category fields are editable
                                      <>
                                        <TextField
                                          type="number"
                                          // value={
                                          //   formik.values.tickSizeData
                                          //     .categoryValues[header.key] &&
                                          //   formik.values.tickSizeData
                                          //     .categoryValues[header.key][
                                          //     priceRangeCategory.tickId
                                          //   ]
                                          //     ? formik.values.tickSizeData
                                          //         .categoryValues[header.key][
                                          //         priceRangeCategory.tickId
                                          //       ]
                                          //     : ""
                                          // }
                                          // value={tickSizeMappingss}
                                          // value={
                                          //   (priceRange[index] &&
                                          //     priceRange[index]) ||
                                          //   ""
                                          // }
                                          // value={tickSizeMappingss}

                                          value={
                                            tickSizeMappingss
                                              ?.filter(
                                                (ele) =>
                                                  ele.columnNo ===
                                                    tableHeaders
                                                      ?.map((ele) => ele.key)
                                                      .indexOf(header.key) +
                                                      1 &&
                                                  ele.rowNo === index + 1
                                              )
                                              ?.at(
                                                tickSizeMappingss
                                                  ?.map((ele, index) =>
                                                    ele.columnNo ===
                                                      tableHeaders
                                                        ?.map((ele) => ele.key)
                                                        .indexOf(header.key) +
                                                        1 &&
                                                    ele.rowNo === index + 1
                                                      ? index
                                                      : ""
                                                  )
                                                  .filter((ele) => ele !== "")
                                                  ?.at(0)
                                              )?.value
                                          }
                                          onChange={
                                            (e) =>
                                              handleInputChanges(
                                                index + 1,
                                                tableHeaders
                                                  ?.map((ele) => ele.key)
                                                  .indexOf(header.key) + 1,
                                                e.target.value,
                                                header.key,
                                                priceRangeCategory.tickId
                                              )
                                            // handleCategoryInputChange(
                                            //   header.key,
                                            //   e.target.value,
                                            //   priceRangeCategory.tickId
                                            // )
                                            // {
                                            // let obj = {
                                            //   pricerrange: 1,
                                            //   value: e.target.value,
                                            //   rowNo: index + 1,
                                            //   coulmnNo:
                                            //     tableHeaders
                                            //       ?.map((ele) => ele.key)
                                            //       .indexOf(header.key) + 1,
                                            //   categoryId: header.key,
                                            // };
                                            // let data = [...tickSizeMappingss];
                                            // setTickSizeMappings([
                                            //   ...tickSizeMappingss,
                                            //   data
                                            //     ?.map((ele) =>
                                            //       ele.rowNo === obj.rowNo &&
                                            //       ele.coulmnNo ===
                                            //         obj.coulmnNo
                                            //         ? {
                                            //             pricerrange: 1,
                                            //             value:
                                            //               ele.value +
                                            //               obj.value,
                                            //             rowNo: index + 1,
                                            //             coulmnNo:
                                            //               tableHeaders
                                            //                 ?.map(
                                            //                   (ele) => ele.key
                                            //                 )
                                            //                 .indexOf(
                                            //                   header.key
                                            //                 ) + 1,
                                            //             categoryId:
                                            //               header.key,
                                            //           }
                                            //         : obj
                                            //     )
                                            //     .filter(
                                            //       (ele, index) => index === 0
                                            //     ),
                                            // ]);
                                            // }
                                          }
                                          disabled={isDisabled}
                                        />
                                        <div style={{ color: "red" }}>
                                          {
                                            formik.errors.tickSizeData
                                              ?.categoryValues[header.key]?.[
                                              priceRangeCategory.tickId
                                            ]
                                          }
                                        </div>
                                      </>
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  <h3 className="text-dark ml-3">Permissible Bit Limits</h3>
                  <div className="row align-items-end m-3 p-3 border border-dark">
                    <TableContainer component={Paper}>
                      <Table className="TableBox">
                        <TableHead>
                          <TableRow>
                            {tableHeaders1?.map((header, index) => (
                              <TableCell key={index}>{header.label}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Map over the price range response and create rows */}
                          {teaTypeCategoryss &&
                            teaTypeCategoryss
                              .filter((ele, index) => index < 3)
                              ?.map((teaTypeCategory, index) => (
                                <TableRow key={teaTypeCategory.teaTypeId}>
                                  {teatypeTableHeaders?.map(
                                    (header, indexs) => (
                                      <TableCell key={indexs}>
                                        {header.key === "teaTypeName" ? (
                                          // Display the priceRange value from the response
                                          teaTypeCategory.teaTypeName
                                        ) : (
                                          // Other category fields are editable
                                          <div key={indexs}>
                                            <TextField
                                              type="number"
                                              // value={
                                              //   formik.values.tickSizeData
                                              //     .categoryValues[header.key] &&
                                              //   formik.values.tickSizeData
                                              //     .categoryValues[header.key][
                                              //     priceRangeCategory.tickId
                                              //   ]
                                              //     ? formik.values.tickSizeData
                                              //         .categoryValues[header.key][
                                              //         priceRangeCategory.tickId
                                              //       ]
                                              //     : ""
                                              // }
                                              // value={tickSizeMappingss}
                                              // value={
                                              //   (priceRange[index] &&
                                              //     priceRange[index]) ||
                                              //   ""
                                              // }
                                              value={
                                                teaTypeCategoryss
                                                  ?.filter(
                                                    (ele) =>
                                                      ele.columnNo ===
                                                        teatypeTableHeaders
                                                          ?.map(
                                                            (ele) => ele.key
                                                          )
                                                          .indexOf(header.key) +
                                                          1 &&
                                                      ele.rowNo === index + 1
                                                  )
                                                  ?.at(
                                                    teaTypeCategoryss
                                                      ?.map((ele, index) =>
                                                        ele.columnNo ===
                                                          teatypeTableHeaders
                                                            ?.map(
                                                              (ele) => ele.key
                                                            )
                                                            .indexOf(
                                                              header.key
                                                            ) +
                                                            1 &&
                                                        ele.rowNo === index + 1
                                                          ? index
                                                          : ""
                                                      )
                                                      .filter(
                                                        (ele) => ele !== ""
                                                      )
                                                      ?.at(0)
                                                  )?.value
                                              }
                                              onChange={
                                                (e) =>
                                                  handleTeaTypeInputChanges(
                                                    index + 1,
                                                    teatypeTableHeaders
                                                      ?.map((ele) => ele.key)
                                                      .indexOf(header.key) + 1,
                                                    e.target.value,
                                                    header.key,
                                                    teaTypeCategory.teaTypeId
                                                  )
                                                // handleCategoryInputChange(
                                                //   header.key,
                                                //   e.target.value,
                                                //   priceRangeCategory.tickId
                                                // )
                                                // {
                                                // let obj = {
                                                //   pricerrange: 1,
                                                //   value: e.target.value,
                                                //   rowNo: index + 1,
                                                //   coulmnNo:
                                                //     tableHeaders
                                                //       ?.map((ele) => ele.key)
                                                //       .indexOf(header.key) + 1,
                                                //   categoryId: header.key,
                                                // };
                                                // let data = [...tickSizeMappingss];
                                                // setTickSizeMappings([
                                                //   ...tickSizeMappingss,
                                                //   data
                                                //     ?.map((ele) =>
                                                //       ele.rowNo === obj.rowNo &&
                                                //       ele.coulmnNo ===
                                                //         obj.coulmnNo
                                                //         ? {
                                                //             pricerrange: 1,
                                                //             value:
                                                //               ele.value +
                                                //               obj.value,
                                                //             rowNo: index + 1,
                                                //             coulmnNo:
                                                //               tableHeaders
                                                //                 ?.map(
                                                //                   (ele) => ele.key
                                                //                 )
                                                //                 .indexOf(
                                                //                   header.key
                                                //                 ) + 1,
                                                //             categoryId:
                                                //               header.key,
                                                //           }
                                                //         : obj
                                                //     )
                                                //     .filter(
                                                //       (ele, index) => index === 0
                                                //     ),
                                                // ]);
                                                // }
                                              }
                                              disabled={isDisabled}
                                            />
                                            <div style={{ color: "red" }}>
                                              {
                                                formik.errors.tickSizeData
                                                  ?.categoryValues[
                                                  header.key
                                                ]?.[teaTypeCategory.teaTypeId]
                                              }
                                            </div>
                                          </div>
                                        )}
                                      </TableCell>
                                    )
                                  )}
                                </TableRow>
                              ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* <Button onClick={handleAddMore}>Add More</Button> */}
                  </div>
                  {isDisabled ? (
                    ""
                  ) : (
                    <>
                      <h3 className="text-dark ml-3">Document Upload</h3>
                      <div className="row align-items-end m-3 p-3 border border-dark">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />

                        <input
                          type="text"
                          placeholder="Document Brief/Remarks"
                          value={documentBrief}
                          onChange={handleDocumentBriefChange}
                        />
                        <button type="button" onClick={handleUpload}>
                          Upload
                        </button>
                        <button type="button" onClick={handleClear}>
                          Clear
                        </button>
                        {errorMessage && (
                          <div style={{ color: "red", marginLeft: "10px" }}>
                            {errorMessage}
                          </div>
                        )}
                      </div>
                      <div className="col-lg-1">
                        {!isEdit && modalRight?.some((ele) => ele === "1") ? (
                          <Button
                            type="submit"
                            varient="primary"
                            className="text-center"
                          >
                            Create
                          </Button>
                        ) : (
                          ""
                        )}

                        {isEdit && modalRight?.some((ele) => ele === "2") ? (
                          <Button
                            type="submit"
                            varient="primary"
                            className="text-center"
                          >
                            Update
                          </Button>
                        ) : (
                          ""
                        )}
                      </div>
                    </>
                  )}
                </form>{" "}
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Edit */}
      {editModal ? (
        <Modal
          title={"Edit Configure Parameter"}
          show={editModal}
          handleClose={handleCloseEditModal}
          size="xl"
          centered
        >
          <div className="row configure_parameter" id="">
            <div className="col-lg-12 ">
              {" "}
              <form onSubmit={formik.handleSubmit}>
                <h3 className="text-dark ml-3">Days</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  {/* Inside the form */}
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Auction Center</label>
                      <Form.Select
                        id="auctionCenterId"
                        className="form-control"
                        {...formik.getFieldProps("auctionCenterId")}
                        isInvalid={
                          formik.touched.auctionCenterId &&
                          Boolean(formik.errors.auctionCenterId)
                        }
                        disabled={isDisabled || isEdit}
                      >
                        <option value="" disabled>
                          Please select a value
                        </option>
                        {getAllAuctionCenterResponse &&
                        getAllAuctionCenterResponse.length > 0 ? (
                          getAllAuctionCenter?.map((center) => (
                            <option
                              key={center.auctionCenterId}
                              value={parseInt(center.auctionCenterId)} // Use the ID as the value
                            >
                              {center.auctionCenterName}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No data available
                          </option>
                        )}
                      </Form.Select>

                      <Form.Control.Feedback type="invalid">
                        {formik.touched.auctionCenterId &&
                          formik.errors.auctionCenterId}
                      </Form.Control.Feedback>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {formik.touched.auctionCenterId &&
                        formik.errors.auctionCenterId}
                    </Form.Control.Feedback>
                  </div>

                  {/* Input fields */}
                  {isEdit ? (
                    ""
                  ) : (
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Auction Date</label>
                        <TextField
                          className="form-control"
                          id="auctionDate"
                          // label="Auction Date"
                          type="text"
                          fullWidth
                          {...formik.getFieldProps("auctionDate")}
                          error={
                            formik.touched.auctionDate &&
                            Boolean(formik.errors.auctionDate)
                          }
                          helperText={
                            formik.touched.auctionDate &&
                            formik.errors.auctionDate
                          }
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <div className="form-group">
                        <label>Catalog Closing Date</label>
                        <TextField
                          className="form-control"
                          id="catalogClosingDate"
                          // label="Catalog Closing Date"
                          type="text"
                          fullWidth
                          {...formik.getFieldProps("catalogClosingDate")}
                          error={
                            formik.touched.catalogClosingDate &&
                            Boolean(formik.errors.catalogClosingDate)
                          }
                          disabled={isDisabled}
                          helperText={
                            formik.touched.catalogClosingDate &&
                            formik.errors.catalogClosingDate
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Catalog Publishing Date</label>
                      <TextField
                        className="form-control"
                        id="catalogPublishingDate"
                        // label="Catalog Publishing Date"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps("catalogPublishingDate")}
                        error={
                          formik.touched.catalogPublishingDate &&
                          Boolean(formik.errors.catalogPublishingDate)
                        }
                        disabled={isDisabled}
                        helperText={
                          formik.touched.catalogPublishingDate &&
                          formik.errors.catalogPublishingDate
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Buyer's prompt Date</label>
                      <TextField
                        className="form-control"
                        id="buyersPromptDate"
                        // label="Buyer's prompt Date"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps("buyersPromptDate")}
                        error={
                          formik.touched.buyersPromptDate &&
                          Boolean(formik.errors.buyersPromptDate)
                        }
                        disabled={isDisabled}
                        helperText={
                          formik.touched.buyersPromptDate &&
                          formik.errors.buyersPromptDate
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Sellers prompt Date</label>
                      <TextField
                        className="form-control"
                        id="sellersPromptDate"
                        // label="Sellers prompt Date"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps("sellersPromptDate")}
                        error={
                          formik.touched.sellersPromptDate &&
                          Boolean(formik.errors.sellersPromptDate)
                        }
                        helperText={
                          formik.touched.sellersPromptDate &&
                          formik.errors.sellersPromptDate
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-dark ml-3">Knock Down Process</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>No of Active Lots</label>
                      <TextField
                        className="form-control"
                        id="noOfActiveLots"
                        // label="No of Active Lots"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("noOfActiveLots")}
                        value={formik.values.noOfActiveLots}
                        onChange={(e) => {
                          const value = e.target.value;
                          formik.setFieldValue("noOfActiveLots", value);
                          handleActiveLotsCyclesChange("noOfActiveLots", value);
                        }}
                        disabled={isDisabled}
                        error={
                          formik.touched.noOfActiveLots &&
                          Boolean(formik.errors.noOfActiveLots)
                        }
                        helperText={
                          formik.touched.noOfActiveLots &&
                          formik.errors.noOfActiveLots
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>No of Cycles</label>
                      <TextField
                        className="form-control"
                        id="noOfCycles"
                        // label="No of Cycles"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("noOfCycles")}
                        value={formik.values.noOfCycles}
                        onChange={(e) => {
                          const value = e.target.value;
                          formik.setFieldValue("noOfCycles", value);
                          handleActiveLotsCyclesChange("noOfCycles", value);
                        }}
                        disabled={isDisabled}
                        error={
                          formik.touched.noOfCycles &&
                          Boolean(formik.errors.noOfCycles)
                        }
                        helperText={
                          formik.touched.noOfCycles && formik.errors.noOfCycles
                        }
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Result</label>
                      <TextField
                        className="form-control"
                        id="result"
                        // label="Result"
                        type="text"
                        fullWidth
                        value={formik.values.result}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Duration of Active Lots</label>
                      <TextField
                        className="form-control"
                        id="durationOfActiveLots"
                        // label="Duration of Active Lots"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps("durationOfActiveLots")}
                        error={
                          formik.touched.durationOfActiveLots &&
                          Boolean(formik.errors.durationOfActiveLots)
                        }
                        helperText={
                          formik.touched.durationOfActiveLots &&
                          formik.errors.durationOfActiveLots
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Time Interval Between Cycles</label>
                      <TextField
                        className="form-control"
                        id="timeIntervalBetweenCycles"
                        // label="Time Interval Between Cycles"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps("timeIntervalBetweenCycles")}
                        error={
                          formik.touched.timeIntervalBetweenCycles &&
                          Boolean(formik.errors.timeIntervalBetweenCycles)
                        }
                        helperText={
                          formik.touched.timeIntervalBetweenCycles &&
                          formik.errors.timeIntervalBetweenCycles
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-dark ml-3">General Section</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Minimum Number of Package (Bidding)</label>
                      <TextField
                        className="form-control"
                        id="minNumberOfPackageBidding"
                        // label="Minimum Number of Package (Bidding)"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("minNumberOfPackageBidding")}
                        error={
                          formik.touched.minNumberOfPackageBidding &&
                          Boolean(formik.errors.minNumberOfPackageBidding)
                        }
                        helperText={
                          formik.touched.minNumberOfPackageBidding &&
                          formik.errors.minNumberOfPackageBidding
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>
                        Permissible Increase over Highest Bid Price (%)
                      </label>
                      <TextField
                        className="form-control"
                        id="permissibleIncrease"
                        // label="Permissible Increase over Highest Bid Price (%)"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("permissibleIncrease")}
                        error={
                          formik.touched.permissibleIncrease &&
                          Boolean(formik.errors.permissibleIncrease)
                        }
                        helperText={
                          formik.touched.permissibleIncrease &&
                          formik.errors.permissibleIncrease
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Minimum Number of Package (Invoice)</label>
                      <TextField
                        className="form-control"
                        id="minNumberOfPackageInvoice"
                        // label="Minimum Number of Package (Invoice)"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("minNumberOfPackageInvoice")}
                        error={
                          formik.touched.minNumberOfPackageInvoice &&
                          Boolean(formik.errors.minNumberOfPackageInvoice)
                        }
                        helperText={
                          formik.touched.minNumberOfPackageInvoice &&
                          formik.errors.minNumberOfPackageInvoice
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Reprint After (Weeks)</label>
                      <TextField
                        className="form-control"
                        id="reprintAfterWeeks"
                        // label="Reprint After (Weeks)"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("reprintAfterWeeks")}
                        error={
                          formik.touched.reprintAfterWeeks &&
                          Boolean(formik.errors.reprintAfterWeeks)
                        }
                        helperText={
                          formik.touched.reprintAfterWeeks &&
                          formik.errors.reprintAfterWeeks
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Minimum Number of Lots (Auctioneer)</label>
                      <TextField
                        className="form-control"
                        id="minNumberOfLotsAuctioneer"
                        // label="Minimum Number of Lots (Auctioneer)"
                        type="number"
                        fullWidth
                        helperText={
                          formik.touched.minNumberOfLotsAuctioneer &&
                          formik.errors.minNumberOfLotsAuctioneer
                        }
                        {...formik.getFieldProps("minNumberOfLotsAuctioneer")}
                        error={
                          formik.touched.minNumberOfLotsAuctioneer &&
                          Boolean(formik.errors.minNumberOfLotsAuctioneer)
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup" id="text_dark">
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="allowBiddersAnonymity"
                            {...formik.getFieldProps("allowBiddersAnonymity")}
                          />
                        }
                        label="Allow Bidders Anonymity"
                        disabled={isDisabled}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup" id="text_dark">
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="enableUniformTickSize"
                            {...formik.getFieldProps("enableUniformTickSize")}
                          />
                        }
                        label="Enable Uniform Tick Size"
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                  {isDisabled === false && isEdit === false ? (
                    ""
                  ) : (
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={status}
                              onChange={handleChangeDense}
                              disabled={isDisabled}
                            />
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="text-dark ml-3">Division of Lots</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  <TableContainer component={Paper}>
                    <Table className="TableBox">
                      <TableHead>
                        <TableRow>
                          <TableCell>Min Package</TableCell>
                          <TableCell>Max Package</TableCell>
                          <TableCell>No. of Buyers</TableCell>
                          {isDisabled ? "" : <TableCell>Action</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {divisionMatrix?.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                type="number"
                                value={row.minNoOfPackages}
                                disabled={isDisabled}
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "minNoOfPackages",
                                    e.target.value
                                  );

                                  if (e.target.value === "") {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = [
                                      ...data[index],
                                      "minNoOfPackages",
                                    ];
                                    setDivisionMatrixValidations(data);
                                  } else {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = divisionMatrixValidations[
                                      index
                                    ]?.filter(
                                      (ele) => ele !== "minNoOfPackages"
                                    );
                                    setDivisionMatrixValidations(data);
                                  }
                                }}
                              />
                              {divisionMatrixValidations?.map(
                                (ele, errorIndex) =>
                                  errorIndex === index
                                    ? ele?.map(
                                        (items) =>
                                          items === "minNoOfPackages" && (
                                            <p style={{ color: "red" }}>
                                              Min Package is missing
                                            </p>
                                          )
                                      )
                                    : ""
                              )}
                            </TableCell>

                            <TableCell>
                              <TextField
                                type="number"
                                disabled={isDisabled}
                                value={row.maxNoOfPackages}
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "maxNoOfPackages",
                                    e.target.value
                                  );
                                  if (e.target.value === "") {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = [
                                      ...data[index],
                                      "maxNoOfPackages",
                                    ];
                                    setDivisionMatrixValidations(data);
                                  } else {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = divisionMatrixValidations[
                                      index
                                    ]?.filter(
                                      (ele) => ele !== "maxNoOfPackages"
                                    );
                                    setDivisionMatrixValidations(data);
                                  }
                                }}
                                error={
                                  formik.touched.divisionMatrix &&
                                  formik.errors.divisionMatrix &&
                                  formik.errors.divisionMatrix[index] &&
                                  formik.errors.divisionMatrix[index]
                                    .maxNoOfPackages !== undefined
                                }
                                helperText={
                                  (formik.touched.divisionMatrix &&
                                    formik.errors.divisionMatrix &&
                                    formik.errors.divisionMatrix[index] &&
                                    formik.errors.divisionMatrix[index]
                                      .maxNoOfPackages) ||
                                  ""
                                }
                              />
                              {/* {divisionMatrixValidations[0]?.keyName ===
                                  "maxNoOfPackages" && (
                                  <p style={{ color: "red" }}>
                                    Max Package is missing
                                  </p>
                                )} */}
                              {divisionMatrixValidations?.map(
                                (ele, errorIndex) =>
                                  errorIndex === index
                                    ? ele?.map(
                                        (items) =>
                                          items === "maxNoOfPackages" && (
                                            <p style={{ color: "red" }}>
                                              Max Package is missing
                                            </p>
                                          )
                                      )
                                    : ""
                              )}
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                disabled={isDisabled}
                                value={row.noOfBuyers}
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "noOfBuyers",
                                    e.target.value
                                  );

                                  if (e.target.value === "") {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = [
                                      ...data[index],
                                      "noOfBuyers",
                                    ];
                                    setDivisionMatrixValidations(data);
                                  } else {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = divisionMatrixValidations[
                                      index
                                    ]?.filter((ele) => ele !== "noOfBuyers");
                                    setDivisionMatrixValidations(data);
                                  }
                                }}
                              />
                              {/* {divisionMatrixValidations[0]?.keyName ===
                                  "noOfBuyers" && (
                                  <p style={{ color: "red" }}>
                                    No. of Buyers is missing
                                  </p>
                                )} */}
                              {divisionMatrixValidations?.map(
                                (ele, errorIndex) =>
                                  errorIndex === index
                                    ? ele?.map(
                                        (items) =>
                                          items === "noOfBuyers" && (
                                            <p style={{ color: "red" }}>
                                              No. of Buyers is missing
                                            </p>
                                          )
                                      )
                                    : ""
                              )}
                            </TableCell>
                            {isDisabled ? (
                              ""
                            ) : (
                              <TableCell>
                                <IconButton onClick={() => handleRemove(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {isDisabled ? (
                    ""
                  ) : (
                    <Button onClick={handleAddMore}>Add More</Button>
                  )}
                </div>
                <h3 className="text-dark ml-3">Tick size</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  <TableContainer
                    component={Paper}
                    className="tick-size TableBox"
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          {tableHeaders?.map((header) => (
                            <TableCell key={header.key}>
                              {header.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Map over the price range response and create rows */}
                        {priceRange &&
                          priceRange?.map((priceRangeCategory, index) => (
                            <TableRow key={priceRangeCategory.tickId}>
                              {tableHeaders?.map((header, indexs) => (
                                <TableCell key={indexs}>
                                  {header.key === "priceRange" ? (
                                    // Display the priceRange value from the response
                                    priceRangeCategory.value
                                  ) : (
                                    // Other category fields are editable
                                    <>
                                      <TextField
                                        type="number"
                                        // value={
                                        //   formik.values.tickSizeData
                                        //     .categoryValues[header.key] &&
                                        //   formik.values.tickSizeData
                                        //     .categoryValues[header.key][
                                        //     priceRangeCategory.tickId
                                        //   ]
                                        //     ? formik.values.tickSizeData
                                        //         .categoryValues[header.key][
                                        //         priceRangeCategory.tickId
                                        //       ]
                                        //     : ""
                                        // }
                                        // value={tickSizeMappingss}
                                        // value={
                                        //   (priceRange[index] &&
                                        //     priceRange[index]) ||
                                        //   ""
                                        // }
                                        // value={tickSizeMappingss}

                                        value={
                                          tickSizeMappingss
                                            ?.filter(
                                              (ele) =>
                                                ele.columnNo ===
                                                  tableHeaders
                                                    ?.map((ele) => ele.key)
                                                    .indexOf(header.key) +
                                                    1 && ele.rowNo === index + 1
                                            )
                                            ?.at(
                                              tickSizeMappingss
                                                ?.map((ele, index) =>
                                                  ele.columnNo ===
                                                    tableHeaders
                                                      ?.map((ele) => ele.key)
                                                      .indexOf(header.key) +
                                                      1 &&
                                                  ele.rowNo === index + 1
                                                    ? index
                                                    : ""
                                                )
                                                .filter((ele) => ele !== "")
                                                ?.at(0)
                                            )?.value
                                        }
                                        onChange={
                                          (e) =>
                                            handleInputChanges(
                                              index + 1,
                                              tableHeaders
                                                ?.map((ele) => ele.key)
                                                .indexOf(header.key) + 1,
                                              e.target.value,
                                              header.key,
                                              priceRangeCategory.tickId
                                            )
                                          // handleCategoryInputChange(
                                          //   header.key,
                                          //   e.target.value,
                                          //   priceRangeCategory.tickId
                                          // )
                                          // {
                                          // let obj = {
                                          //   pricerrange: 1,
                                          //   value: e.target.value,
                                          //   rowNo: index + 1,
                                          //   coulmnNo:
                                          //     tableHeaders
                                          //       ?.map((ele) => ele.key)
                                          //       .indexOf(header.key) + 1,
                                          //   categoryId: header.key,
                                          // };
                                          // let data = [...tickSizeMappingss];
                                          // setTickSizeMappings([
                                          //   ...tickSizeMappingss,
                                          //   data
                                          //     ?.map((ele) =>
                                          //       ele.rowNo === obj.rowNo &&
                                          //       ele.coulmnNo ===
                                          //         obj.coulmnNo
                                          //         ? {
                                          //             pricerrange: 1,
                                          //             value:
                                          //               ele.value +
                                          //               obj.value,
                                          //             rowNo: index + 1,
                                          //             coulmnNo:
                                          //               tableHeaders
                                          //                 ?.map(
                                          //                   (ele) => ele.key
                                          //                 )
                                          //                 .indexOf(
                                          //                   header.key
                                          //                 ) + 1,
                                          //             categoryId:
                                          //               header.key,
                                          //           }
                                          //         : obj
                                          //     )
                                          //     .filter(
                                          //       (ele, index) => index === 0
                                          //     ),
                                          // ]);
                                          // }
                                        }
                                        disabled={isDisabled}
                                      />
                                      <div style={{ color: "red" }}>
                                        {
                                          formik.errors.tickSizeData
                                            ?.categoryValues[header.key]?.[
                                            priceRangeCategory.tickId
                                          ]
                                        }
                                      </div>
                                    </>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                <h3 className="text-dark ml-3">Permissible Bit Limits</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  <TableContainer component={Paper}>
                    <Table className="TableBox">
                      <TableHead>
                        <TableRow>
                          {teatypeTableHeaders?.map((header, index) => (
                            <TableCell key={index}>{header.label}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Map over the price range response and create rows */}
                        {teaTypeCategoryss &&
                          teaTypeCategoryss
                            .filter((ele, index) => index < 3)
                            ?.map((teaTypeCategory, index) => (
                              <TableRow key={teaTypeCategory.teaTypeId}>
                                {teatypeTableHeaders?.map((header, indexs) => (
                                  <TableCell key={indexs}>
                                    {header.key === "teaTypeName" ? (
                                      // Display the priceRange value from the response
                                      teaTypeCategory.teaTypeName
                                    ) : (
                                      // Other category fields are editable
                                      <div key={indexs}>
                                        <TextField
                                          type="number"
                                          // value={
                                          //   formik.values.tickSizeData
                                          //     .categoryValues[header.key] &&
                                          //   formik.values.tickSizeData
                                          //     .categoryValues[header.key][
                                          //     priceRangeCategory.tickId
                                          //   ]
                                          //     ? formik.values.tickSizeData
                                          //         .categoryValues[header.key][
                                          //         priceRangeCategory.tickId
                                          //       ]
                                          //     : ""
                                          // }
                                          // value={tickSizeMappingss}
                                          // value={
                                          //   (priceRange[index] &&
                                          //     priceRange[index]) ||
                                          //   ""
                                          // }
                                          value={
                                            teaTypeCategoryss
                                              ?.filter(
                                                (ele) =>
                                                  ele.columnNo ===
                                                    teatypeTableHeaders
                                                      ?.map((ele) => ele.key)
                                                      .indexOf(header.key) +
                                                      1 &&
                                                  ele.rowNo === index + 1
                                              )
                                              ?.at(
                                                teaTypeCategoryss
                                                  ?.map((ele, index) =>
                                                    ele.columnNo ===
                                                      teatypeTableHeaders
                                                        ?.map((ele) => ele.key)
                                                        .indexOf(header.key) +
                                                        1 &&
                                                    ele.rowNo === index + 1
                                                      ? index
                                                      : ""
                                                  )
                                                  .filter((ele) => ele !== "")
                                                  ?.at(0)
                                              )?.value
                                          }
                                          onChange={
                                            (e) =>
                                              handleTeaTypeInputChanges(
                                                index + 1,
                                                teatypeTableHeaders
                                                  ?.map((ele) => ele.key)
                                                  .indexOf(header.key) + 1,
                                                e.target.value,
                                                header.key,
                                                teaTypeCategory.teaTypeId
                                              )
                                            // handleCategoryInputChange(
                                            //   header.key,
                                            //   e.target.value,
                                            //   priceRangeCategory.tickId
                                            // )
                                            // {
                                            // let obj = {
                                            //   pricerrange: 1,
                                            //   value: e.target.value,
                                            //   rowNo: index + 1,
                                            //   coulmnNo:
                                            //     tableHeaders
                                            //       ?.map((ele) => ele.key)
                                            //       .indexOf(header.key) + 1,
                                            //   categoryId: header.key,
                                            // };
                                            // let data = [...tickSizeMappingss];
                                            // setTickSizeMappings([
                                            //   ...tickSizeMappingss,
                                            //   data
                                            //     ?.map((ele) =>
                                            //       ele.rowNo === obj.rowNo &&
                                            //       ele.coulmnNo ===
                                            //         obj.coulmnNo
                                            //         ? {
                                            //             pricerrange: 1,
                                            //             value:
                                            //               ele.value +
                                            //               obj.value,
                                            //             rowNo: index + 1,
                                            //             coulmnNo:
                                            //               tableHeaders
                                            //                 ?.map(
                                            //                   (ele) => ele.key
                                            //                 )
                                            //                 .indexOf(
                                            //                   header.key
                                            //                 ) + 1,
                                            //             categoryId:
                                            //               header.key,
                                            //           }
                                            //         : obj
                                            //     )
                                            //     .filter(
                                            //       (ele, index) => index === 0
                                            //     ),
                                            // ]);
                                            // }
                                          }
                                          disabled={isDisabled}
                                        />
                                        <div style={{ color: "red" }}>
                                          {
                                            formik.errors.tickSizeData
                                              ?.categoryValues[header.key]?.[
                                              teaTypeCategory.teaTypeId
                                            ]
                                          }
                                        </div>
                                      </div>
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* <Button onClick={handleAddMore}>Add More</Button> */}
                </div>
                {isDisabled ? (
                  ""
                ) : (
                  <>
                    <h3 className="text-dark ml-3">Document Upload</h3>
                    <div className="row align-items-end m-3 p-3 border border-dark">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                      />

                      <input
                        type="text"
                        placeholder="Document Brief/Remarks"
                        value={documentBrief}
                        onChange={handleDocumentBriefChange}
                      />
                      <button type="button" onClick={handleUpload}>
                        Upload
                      </button>
                      <button type="button" onClick={handleClear}>
                        Clear
                      </button>
                      {errorMessage && (
                        <div style={{ color: "red", marginLeft: "10px" }}>
                          {errorMessage}
                        </div>
                      )}
                    </div>
                    <div className="col-lg-1">
                      <Button
                        type="submit"
                        varient="primary"
                        className="text-center"
                      >
                        {isEdit ? "Update" : "Create"}
                      </Button>
                    </div>
                  </>
                )}
              </form>{" "}
            </div>
          </div>
        </Modal>
      ) : (
        ""
      )}

      {/* View */}
      {viewModal ? (
        <Modal
          title={"View Configure Parameter"}
          show={viewModal}
          handleClose={handleCloseViewModal}
          size="xl"
          centered
        >
          <div className="row configure_parameter" id="">
            <div className="col-lg-12 ">
              {" "}
              <form onSubmit={formik.handleSubmit}>
                <h3 className="text-dark ml-3">Days</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  {/* Inside the form */}
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Auction Center</label>
                      <Form.Select
                        id="auctionCenterId"
                        className="form-control"
                        {...formik.getFieldProps("auctionCenterId")}
                        isInvalid={
                          formik.touched.auctionCenterId &&
                          Boolean(formik.errors.auctionCenterId)
                        }
                        disabled={isDisabled || isEdit}
                      >
                        <option value="" disabled>
                          Please select a value
                        </option>
                        {getAllAuctionCenterResponse &&
                        getAllAuctionCenterResponse.length > 0 ? (
                          getAllAuctionCenter?.map((center) => (
                            <option
                              key={center.auctionCenterId}
                              value={parseInt(center.auctionCenterId)} // Use the ID as the value
                            >
                              {center.auctionCenterName}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No data available
                          </option>
                        )}
                      </Form.Select>

                      <Form.Control.Feedback type="invalid">
                        {formik.touched.auctionCenterId &&
                          formik.errors.auctionCenterId}
                      </Form.Control.Feedback>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {formik.touched.auctionCenterId &&
                        formik.errors.auctionCenterId}
                    </Form.Control.Feedback>
                  </div>

                  {/* Input fields */}
                  {isEdit ? (
                    ""
                  ) : (
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <label>Auction Date</label>
                        <TextField
                          className="form-control"
                          id="auctionDate"
                          // label="Auction Date"
                          type="text"
                          fullWidth
                          {...formik.getFieldProps("auctionDate")}
                          error={
                            formik.touched.auctionDate &&
                            Boolean(formik.errors.auctionDate)
                          }
                          helperText={
                            formik.touched.auctionDate &&
                            formik.errors.auctionDate
                          }
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <div className="form-group">
                        <label>Catalog Closing Date</label>
                        <TextField
                          className="form-control"
                          id="catalogClosingDate"
                          // label="Catalog Closing Date"
                          type="text"
                          fullWidth
                          {...formik.getFieldProps("catalogClosingDate")}
                          error={
                            formik.touched.catalogClosingDate &&
                            Boolean(formik.errors.catalogClosingDate)
                          }
                          disabled={isDisabled}
                          helperText={
                            formik.touched.catalogClosingDate &&
                            formik.errors.catalogClosingDate
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Catalog Publishing Date</label>
                      <TextField
                        className="form-control"
                        id="catalogPublishingDate"
                        // label="Catalog Publishing Date"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps("catalogPublishingDate")}
                        error={
                          formik.touched.catalogPublishingDate &&
                          Boolean(formik.errors.catalogPublishingDate)
                        }
                        disabled={isDisabled}
                        helperText={
                          formik.touched.catalogPublishingDate &&
                          formik.errors.catalogPublishingDate
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Buyer's prompt Date</label>
                      <TextField
                        className="form-control"
                        id="buyersPromptDate"
                        // label="Buyer's prompt Date"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps("buyersPromptDate")}
                        error={
                          formik.touched.buyersPromptDate &&
                          Boolean(formik.errors.buyersPromptDate)
                        }
                        disabled={isDisabled}
                        helperText={
                          formik.touched.buyersPromptDate &&
                          formik.errors.buyersPromptDate
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Sellers prompt Date</label>
                      <TextField
                        className="form-control"
                        id="sellersPromptDate"
                        // label="Sellers prompt Date"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps("sellersPromptDate")}
                        error={
                          formik.touched.sellersPromptDate &&
                          Boolean(formik.errors.sellersPromptDate)
                        }
                        helperText={
                          formik.touched.sellersPromptDate &&
                          formik.errors.sellersPromptDate
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-dark ml-3">Knock Down Process</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>No of Active Lots</label>
                      <TextField
                        className="form-control"
                        id="noOfActiveLots"
                        // label="No of Active Lots"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("noOfActiveLots")}
                        value={formik.values.noOfActiveLots}
                        onChange={(e) => {
                          const value = e.target.value;
                          formik.setFieldValue("noOfActiveLots", value);
                          handleActiveLotsCyclesChange("noOfActiveLots", value);
                        }}
                        disabled={isDisabled}
                        error={
                          formik.touched.noOfActiveLots &&
                          Boolean(formik.errors.noOfActiveLots)
                        }
                        helperText={
                          formik.touched.noOfActiveLots &&
                          formik.errors.noOfActiveLots
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>No of Cycles</label>
                      <TextField
                        className="form-control"
                        id="noOfCycles"
                        // label="No of Cycles"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("noOfCycles")}
                        value={formik.values.noOfCycles}
                        onChange={(e) => {
                          const value = e.target.value;
                          formik.setFieldValue("noOfCycles", value);
                          handleActiveLotsCyclesChange("noOfCycles", value);
                        }}
                        disabled={isDisabled}
                        error={
                          formik.touched.noOfCycles &&
                          Boolean(formik.errors.noOfCycles)
                        }
                        helperText={
                          formik.touched.noOfCycles && formik.errors.noOfCycles
                        }
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Result</label>
                      <TextField
                        className="form-control"
                        id="result"
                        // label="Result"
                        type="text"
                        fullWidth
                        value={formik.values.result}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Duration of Active Lots</label>
                      <TextField
                        className="form-control"
                        id="durationOfActiveLots"
                        // label="Duration of Active Lots"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps("durationOfActiveLots")}
                        error={
                          formik.touched.durationOfActiveLots &&
                          Boolean(formik.errors.durationOfActiveLots)
                        }
                        helperText={
                          formik.touched.durationOfActiveLots &&
                          formik.errors.durationOfActiveLots
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Time Interval Between Cycles</label>
                      <TextField
                        className="form-control"
                        id="timeIntervalBetweenCycles"
                        // label="Time Interval Between Cycles"
                        type="text"
                        fullWidth
                        {...formik.getFieldProps("timeIntervalBetweenCycles")}
                        error={
                          formik.touched.timeIntervalBetweenCycles &&
                          Boolean(formik.errors.timeIntervalBetweenCycles)
                        }
                        helperText={
                          formik.touched.timeIntervalBetweenCycles &&
                          formik.errors.timeIntervalBetweenCycles
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-dark ml-3">General Section</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Minimum Number of Package (Bidding)</label>
                      <TextField
                        className="form-control"
                        id="minNumberOfPackageBidding"
                        // label="Minimum Number of Package (Bidding)"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("minNumberOfPackageBidding")}
                        error={
                          formik.touched.minNumberOfPackageBidding &&
                          Boolean(formik.errors.minNumberOfPackageBidding)
                        }
                        helperText={
                          formik.touched.minNumberOfPackageBidding &&
                          formik.errors.minNumberOfPackageBidding
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>
                        Permissible Increase over Highest Bid Price (%)
                      </label>
                      <TextField
                        className="form-control"
                        id="permissibleIncrease"
                        // label="Permissible Increase over Highest Bid Price (%)"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("permissibleIncrease")}
                        error={
                          formik.touched.permissibleIncrease &&
                          Boolean(formik.errors.permissibleIncrease)
                        }
                        helperText={
                          formik.touched.permissibleIncrease &&
                          formik.errors.permissibleIncrease
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Minimum Number of Package (Invoice)</label>
                      <TextField
                        className="form-control"
                        id="minNumberOfPackageInvoice"
                        // label="Minimum Number of Package (Invoice)"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("minNumberOfPackageInvoice")}
                        error={
                          formik.touched.minNumberOfPackageInvoice &&
                          Boolean(formik.errors.minNumberOfPackageInvoice)
                        }
                        helperText={
                          formik.touched.minNumberOfPackageInvoice &&
                          formik.errors.minNumberOfPackageInvoice
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Reprint After (Weeks)</label>
                      <TextField
                        className="form-control"
                        id="reprintAfterWeeks"
                        // label="Reprint After (Weeks)"
                        type="number"
                        fullWidth
                        {...formik.getFieldProps("reprintAfterWeeks")}
                        error={
                          formik.touched.reprintAfterWeeks &&
                          Boolean(formik.errors.reprintAfterWeeks)
                        }
                        helperText={
                          formik.touched.reprintAfterWeeks &&
                          formik.errors.reprintAfterWeeks
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup">
                      <label>Minimum Number of Lots (Auctioneer)</label>
                      <TextField
                        className="form-control"
                        id="minNumberOfLotsAuctioneer"
                        // label="Minimum Number of Lots (Auctioneer)"
                        type="number"
                        fullWidth
                        helperText={
                          formik.touched.minNumberOfLotsAuctioneer &&
                          formik.errors.minNumberOfLotsAuctioneer
                        }
                        {...formik.getFieldProps("minNumberOfLotsAuctioneer")}
                        error={
                          formik.touched.minNumberOfLotsAuctioneer &&
                          Boolean(formik.errors.minNumberOfLotsAuctioneer)
                        }
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup" id="text_dark">
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="allowBiddersAnonymity"
                            {...formik.getFieldProps("allowBiddersAnonymity")}
                          />
                        }
                        label="Allow Bidders Anonymity"
                        disabled={isDisabled}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="FomrGroup" id="text_dark">
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="enableUniformTickSize"
                            {...formik.getFieldProps("enableUniformTickSize")}
                          />
                        }
                        label="Enable Uniform Tick Size"
                        disabled={isDisabled}
                      />
                    </div>
                  </div>
                  {isDisabled === false && isEdit === false ? (
                    ""
                  ) : (
                    <div className="col-xl-3 col-lg-4 col-md-4">
                      <div className="FomrGroup">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={status}
                              onChange={handleChangeDense}
                              disabled={isDisabled}
                            />
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="text-dark ml-3">Division of Lots</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  <TableContainer component={Paper}>
                    <Table className="TableBox">
                      <TableHead>
                        <TableRow>
                          <TableCell>Min Package</TableCell>
                          <TableCell>Max Package</TableCell>
                          <TableCell>No. of Buyers</TableCell>
                          {isDisabled ? "" : <TableCell>Action</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {divisionMatrix?.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                type="number"
                                value={row.minNoOfPackages}
                                disabled={isDisabled}
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "minNoOfPackages",
                                    e.target.value
                                  );

                                  if (e.target.value === "") {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = [
                                      ...data[index],
                                      "minNoOfPackages",
                                    ];
                                    setDivisionMatrixValidations(data);
                                  } else {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = divisionMatrixValidations[
                                      index
                                    ]?.filter(
                                      (ele) => ele !== "minNoOfPackages"
                                    );
                                    setDivisionMatrixValidations(data);
                                  }
                                }}
                              />
                              {divisionMatrixValidations?.map(
                                (ele, errorIndex) =>
                                  errorIndex === index
                                    ? ele?.map(
                                        (items) =>
                                          items === "minNoOfPackages" && (
                                            <p style={{ color: "red" }}>
                                              Min Package is missing
                                            </p>
                                          )
                                      )
                                    : ""
                              )}
                            </TableCell>

                            <TableCell>
                              <TextField
                                type="number"
                                disabled={isDisabled}
                                value={row.maxNoOfPackages}
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "maxNoOfPackages",
                                    e.target.value
                                  );
                                  if (e.target.value === "") {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = [
                                      ...data[index],
                                      "maxNoOfPackages",
                                    ];
                                    setDivisionMatrixValidations(data);
                                  } else {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = divisionMatrixValidations[
                                      index
                                    ]?.filter(
                                      (ele) => ele !== "maxNoOfPackages"
                                    );
                                    setDivisionMatrixValidations(data);
                                  }
                                }}
                                error={
                                  formik.touched.divisionMatrix &&
                                  formik.errors.divisionMatrix &&
                                  formik.errors.divisionMatrix[index] &&
                                  formik.errors.divisionMatrix[index]
                                    .maxNoOfPackages !== undefined
                                }
                                helperText={
                                  (formik.touched.divisionMatrix &&
                                    formik.errors.divisionMatrix &&
                                    formik.errors.divisionMatrix[index] &&
                                    formik.errors.divisionMatrix[index]
                                      .maxNoOfPackages) ||
                                  ""
                                }
                              />
                              {/* {divisionMatrixValidations[0]?.keyName ===
                                  "maxNoOfPackages" && (
                                  <p style={{ color: "red" }}>
                                    Max Package is missing
                                  </p>
                                )} */}
                              {divisionMatrixValidations?.map(
                                (ele, errorIndex) =>
                                  errorIndex === index
                                    ? ele?.map(
                                        (items) =>
                                          items === "maxNoOfPackages" && (
                                            <p style={{ color: "red" }}>
                                              Max Package is missing
                                            </p>
                                          )
                                      )
                                    : ""
                              )}
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                disabled={isDisabled}
                                value={row.noOfBuyers}
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "noOfBuyers",
                                    e.target.value
                                  );

                                  if (e.target.value === "") {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = [
                                      ...data[index],
                                      "noOfBuyers",
                                    ];
                                    setDivisionMatrixValidations(data);
                                  } else {
                                    let data = [...divisionMatrixValidations];
                                    data[index] = divisionMatrixValidations[
                                      index
                                    ]?.filter((ele) => ele !== "noOfBuyers");
                                    setDivisionMatrixValidations(data);
                                  }
                                }}
                              />
                              {/* {divisionMatrixValidations[0]?.keyName ===
                                  "noOfBuyers" && (
                                  <p style={{ color: "red" }}>
                                    No. of Buyers is missing
                                  </p>
                                )} */}
                              {divisionMatrixValidations?.map(
                                (ele, errorIndex) =>
                                  errorIndex === index
                                    ? ele?.map(
                                        (items) =>
                                          items === "noOfBuyers" && (
                                            <p style={{ color: "red" }}>
                                              No. of Buyers is missing
                                            </p>
                                          )
                                      )
                                    : ""
                              )}
                            </TableCell>
                            {isDisabled ? (
                              ""
                            ) : (
                              <TableCell>
                                <IconButton onClick={() => handleRemove(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {isDisabled ? (
                    ""
                  ) : (
                    <Button onClick={handleAddMore}>Add More</Button>
                  )}
                </div>
                <h3 className="text-dark ml-3">Tick size</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  <TableContainer
                    component={Paper}
                    className="tick-size TableBox"
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          {tableHeaders?.map((header) => (
                            <TableCell key={header.key}>
                              {header.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Map over the price range response and create rows */}
                        {priceRange &&
                          priceRange?.map((priceRangeCategory, index) => (
                            <TableRow key={priceRangeCategory.tickId}>
                              {tableHeaders?.map((header, indexs) => (
                                <TableCell key={indexs}>
                                  {header.key === "priceRange" ? (
                                    // Display the priceRange value from the response
                                    priceRangeCategory.value
                                  ) : (
                                    // Other category fields are editable
                                    <>
                                      <TextField
                                        type="number"
                                        // value={
                                        //   formik.values.tickSizeData
                                        //     .categoryValues[header.key] &&
                                        //   formik.values.tickSizeData
                                        //     .categoryValues[header.key][
                                        //     priceRangeCategory.tickId
                                        //   ]
                                        //     ? formik.values.tickSizeData
                                        //         .categoryValues[header.key][
                                        //         priceRangeCategory.tickId
                                        //       ]
                                        //     : ""
                                        // }
                                        // value={tickSizeMappingss}
                                        // value={
                                        //   (priceRange[index] &&
                                        //     priceRange[index]) ||
                                        //   ""
                                        // }
                                        // value={tickSizeMappingss}

                                        value={
                                          tickSizeMappingss
                                            ?.filter(
                                              (ele) =>
                                                ele.columnNo ===
                                                  tableHeaders
                                                    ?.map((ele) => ele.key)
                                                    .indexOf(header.key) +
                                                    1 && ele.rowNo === index + 1
                                            )
                                            ?.at(
                                              tickSizeMappingss
                                                ?.map((ele, index) =>
                                                  ele.columnNo ===
                                                    tableHeaders
                                                      ?.map((ele) => ele.key)
                                                      .indexOf(header.key) +
                                                      1 &&
                                                  ele.rowNo === index + 1
                                                    ? index
                                                    : ""
                                                )
                                                .filter((ele) => ele !== "")
                                                ?.at(0)
                                            )?.value
                                        }
                                        onChange={
                                          (e) =>
                                            handleInputChanges(
                                              index + 1,
                                              tableHeaders
                                                ?.map((ele) => ele.key)
                                                .indexOf(header.key) + 1,
                                              e.target.value,
                                              header.key,
                                              priceRangeCategory.tickId
                                            )
                                          // handleCategoryInputChange(
                                          //   header.key,
                                          //   e.target.value,
                                          //   priceRangeCategory.tickId
                                          // )
                                          // {
                                          // let obj = {
                                          //   pricerrange: 1,
                                          //   value: e.target.value,
                                          //   rowNo: index + 1,
                                          //   coulmnNo:
                                          //     tableHeaders
                                          //       ?.map((ele) => ele.key)
                                          //       .indexOf(header.key) + 1,
                                          //   categoryId: header.key,
                                          // };
                                          // let data = [...tickSizeMappingss];
                                          // setTickSizeMappings([
                                          //   ...tickSizeMappingss,
                                          //   data
                                          //     ?.map((ele) =>
                                          //       ele.rowNo === obj.rowNo &&
                                          //       ele.coulmnNo ===
                                          //         obj.coulmnNo
                                          //         ? {
                                          //             pricerrange: 1,
                                          //             value:
                                          //               ele.value +
                                          //               obj.value,
                                          //             rowNo: index + 1,
                                          //             coulmnNo:
                                          //               tableHeaders
                                          //                 ?.map(
                                          //                   (ele) => ele.key
                                          //                 )
                                          //                 .indexOf(
                                          //                   header.key
                                          //                 ) + 1,
                                          //             categoryId:
                                          //               header.key,
                                          //           }
                                          //         : obj
                                          //     )
                                          //     .filter(
                                          //       (ele, index) => index === 0
                                          //     ),
                                          // ]);
                                          // }
                                        }
                                        disabled={isDisabled}
                                      />
                                      <div style={{ color: "red" }}>
                                        {
                                          formik.errors.tickSizeData
                                            ?.categoryValues[header.key]?.[
                                            priceRangeCategory.tickId
                                          ]
                                        }
                                      </div>
                                    </>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                <h3 className="text-dark ml-3">Permissible Bit Limits</h3>
                <div className="row align-items-end m-3 p-3 border border-dark">
                  <TableContainer component={Paper}>
                    <Table className="TableBox">
                      <TableHead>
                        <TableRow>
                          {teatypeTableHeaders?.map((header, index) => (
                            <TableCell key={index}>{header.label}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Map over the price range response and create rows */}
                        {teaTypeCategoryss &&
                          teaTypeCategoryss
                            .filter((ele, index) => index < 3)
                            ?.map((teaTypeCategory, index) => (
                              <TableRow key={teaTypeCategory.teaTypeId}>
                                {teatypeTableHeaders?.map((header, indexs) => (
                                  <TableCell key={indexs}>
                                    {header.key === "teaTypeName" ? (
                                      // Display the priceRange value from the response
                                      teaTypeCategory.teaTypeName
                                    ) : (
                                      // Other category fields are editable
                                      <div key={indexs}>
                                        <TextField
                                          type="number"
                                          // value={
                                          //   formik.values.tickSizeData
                                          //     .categoryValues[header.key] &&
                                          //   formik.values.tickSizeData
                                          //     .categoryValues[header.key][
                                          //     priceRangeCategory.tickId
                                          //   ]
                                          //     ? formik.values.tickSizeData
                                          //         .categoryValues[header.key][
                                          //         priceRangeCategory.tickId
                                          //       ]
                                          //     : ""
                                          // }
                                          // value={tickSizeMappingss}
                                          // value={
                                          //   (priceRange[index] &&
                                          //     priceRange[index]) ||
                                          //   ""
                                          // }
                                          value={
                                            teaTypeCategoryss
                                              ?.filter(
                                                (ele) =>
                                                  ele.columnNo ===
                                                    teatypeTableHeaders
                                                      ?.map((ele) => ele.key)
                                                      .indexOf(header.key) +
                                                      1 &&
                                                  ele.rowNo === index + 1
                                              )
                                              ?.at(
                                                teaTypeCategoryss
                                                  ?.map((ele, index) =>
                                                    ele.columnNo ===
                                                      teatypeTableHeaders
                                                        ?.map((ele) => ele.key)
                                                        .indexOf(header.key) +
                                                        1 &&
                                                    ele.rowNo === index + 1
                                                      ? index
                                                      : ""
                                                  )
                                                  .filter((ele) => ele !== "")
                                                  ?.at(0)
                                              )?.value
                                          }
                                          onChange={
                                            (e) =>
                                              handleTeaTypeInputChanges(
                                                index + 1,
                                                teatypeTableHeaders
                                                  ?.map((ele) => ele.key)
                                                  .indexOf(header.key) + 1,
                                                e.target.value,
                                                header.key,
                                                teaTypeCategory.teaTypeId
                                              )
                                            // handleCategoryInputChange(
                                            //   header.key,
                                            //   e.target.value,
                                            //   priceRangeCategory.tickId
                                            // )
                                            // {
                                            // let obj = {
                                            //   pricerrange: 1,
                                            //   value: e.target.value,
                                            //   rowNo: index + 1,
                                            //   coulmnNo:
                                            //     tableHeaders
                                            //       ?.map((ele) => ele.key)
                                            //       .indexOf(header.key) + 1,
                                            //   categoryId: header.key,
                                            // };
                                            // let data = [...tickSizeMappingss];
                                            // setTickSizeMappings([
                                            //   ...tickSizeMappingss,
                                            //   data
                                            //     ?.map((ele) =>
                                            //       ele.rowNo === obj.rowNo &&
                                            //       ele.coulmnNo ===
                                            //         obj.coulmnNo
                                            //         ? {
                                            //             pricerrange: 1,
                                            //             value:
                                            //               ele.value +
                                            //               obj.value,
                                            //             rowNo: index + 1,
                                            //             coulmnNo:
                                            //               tableHeaders
                                            //                 ?.map(
                                            //                   (ele) => ele.key
                                            //                 )
                                            //                 .indexOf(
                                            //                   header.key
                                            //                 ) + 1,
                                            //             categoryId:
                                            //               header.key,
                                            //           }
                                            //         : obj
                                            //     )
                                            //     .filter(
                                            //       (ele, index) => index === 0
                                            //     ),
                                            // ]);
                                            // }
                                          }
                                          disabled={isDisabled}
                                        />
                                        <div style={{ color: "red" }}>
                                          {
                                            formik.errors.tickSizeData
                                              ?.categoryValues[header.key]?.[
                                              teaTypeCategory.teaTypeId
                                            ]
                                          }
                                        </div>
                                      </div>
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* <Button onClick={handleAddMore}>Add More</Button> */}
                </div>
                {isDisabled ? (
                  ""
                ) : (
                  <>
                    <h3 className="text-dark ml-3">Document Upload</h3>
                    <div className="row align-items-end m-3 p-3 border border-dark">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                      />

                      <input
                        type="text"
                        placeholder="Document Brief/Remarks"
                        value={documentBrief}
                        onChange={handleDocumentBriefChange}
                      />
                      <button type="button" onClick={handleUpload}>
                        Upload
                      </button>
                      <button type="button" onClick={handleClear}>
                        Clear
                      </button>
                      {errorMessage && (
                        <div style={{ color: "red", marginLeft: "10px" }}>
                          {errorMessage}
                        </div>
                      )}
                    </div>
                    <div className="col-lg-1">
                      <Button
                        type="submit"
                        varient="primary"
                        className="text-center"
                      >
                        {isEdit ? "Update" : "Create"}
                      </Button>
                    </div>
                  </>
                )}
              </form>{" "}
            </div>
          </div>
        </Modal>
      ) : (
        ""
      )}

      {/* Manage & Search */}
      {modalRight?.some((ele) => ele === "12") && (
        <Accordion
          expanded={expanded === "panel2"}
          className={`${expanded === "panel2" ? "active" : ""}`}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Manage Configure Parameter</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="row align-items-end">
              <div className="col-auto">
                {/* Dropdown for Auction Center */}
                <label htmlFor="auctionCenterDropdown">
                  Select Auction Center:
                </label>
                <select
                  className="form-control select-form"
                  id="auctionCenterDropdown"
                  value={selectedAuctionCenter}
                  onChange={handleAuctionCenterChange}
                >
                  <option value="" disabled>
                    Please Select Auction Center
                  </option>
                  {auctionCenterForSearch &&
                    auctionCenterForSearch?.map((auctionCenter, index) => (
                      <option key={index} value={auctionCenter.auctionCenterId}>
                        {auctionCenter.auctionCenterName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-auto">
                <div className="BtnGroup">
                  <button
                    type="button"
                    className="SubmitBtn mt-0 mb-2"
                    onClick={() => handleAuctionCenterSubmit()}
                  >
                    Search
                  </button>
                  {modalRight?.some((ele) => ele === "9") && (
                    <button
                      class="SubmitBtn mt-0 mb-2"
                      onClick={() => handleExport("excel")}
                    >
                      <i class="fa fa-file-excel"></i>
                    </button>
                  )}
                  {modalRight?.some((ele) => ele === "8") && (
                    <button
                      class="SubmitBtn mt-0 mb-2"
                      onClick={() => handleExport("pdf")}
                    >
                      <i class="fa fa-file-pdf"></i>
                    </button>
                  )}
                </div>
              </div>{" "}
            </div>
            {/* Submit Button */}

            <TableComponent
              columns={[
                { title: "Auction Center Type", name: "auctionCenterTypeName" },
                { title: "Auction Center Name", name: "auctionCenterName" },
                {
                  title: "Status",
                  name: "isActive",
                  getCellValue: ({ ...row }) => (
                    <>
                      {modalRight?.some((ele) => ele === "5") && (
                        <FormControlLabel
                          control={
                            <Switch
                              // checked={tableData?.map(
                              //   (ele) =>
                              //     ele.configParaId === row.configParaId &&
                              //     ele.isActive
                              // )}
                              // disabled
                              checked={
                                tableData?.find(
                                  (ele) => ele.configParaId === row.configParaId
                                )?.isActive === 1
                              }
                              onChange={(e) =>
                                handleChangeDense(e, row.configParaId)
                              }
                            />
                          }
                          // label="Dense padding"
                        />
                      )}
                    </>
                  ),
                },
                {
                  name: "action",
                  title: "Action",
                  getCellValue: ({ ...row }) => <ActionArea data={row} />,
                },
              ]}
              rows={tableData}
              //setRows={setRows}
              addpagination={true}
              dragdrop={false}
              fixedColumnsOn={false}
              resizeingCol={false}
              selectionCol={true}
              sorting={true}
            />
            <button class="SubmitBtn" onClick={handleViewMore}>
              View More
            </button>
            {/* Table to display data */}
            {/* <Table>
            <TableHead>
              <TableRow>
                <TableCell>Auction Center Type</TableCell>
                <TableCell>Auction Center Name</TableCell>
                {/* ... Other table headers 
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData?.map((auctionCenter) => (
                <TableRow key={index}>
                  <TableCell>{auctionCenter.auctionCenterTypeName}</TableCell>
                  <TableCell>{auctionCenter.auctionCenterName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}
          </AccordionDetails>
        </Accordion>
      )}

      {modalRight?.some((ele) => ele === "6") && (
        <Accordion
          expanded={expanded === "panel3"}
          className={`${expanded === "panel3" ? "active" : ""}`}
          onChange={handleChange("panel3")}
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Uploaded Document</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="document_tbale">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr.</TableCell>
                    <TableCell>Document Upload Date And Time</TableCell>
                    <TableCell>Document Brief/Remarks</TableCell>
                    <TableCell>Action </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uploadDocumentData?.map((uploadDoc, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell>{uploadDoc.documentUploadTime}</TableCell>
                      <TableCell>{uploadDoc.fieldValue}</TableCell>
                      <TableCell>
                        <div class="Action">
                          {modalRight?.some((ele) => ele === "7") && (
                            <i
                              class="fa fa-download"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                axiosMain
                                  .get(
                                    "/admin/getdocumentdetail/" +
                                      uploadDoc.uploadDocumentConfId
                                  )
                                  .then((res) =>
                                    handleDownload(
                                      res.data.responseData.documentName,
                                      res.data.responseData.documentContent
                                    )
                                  );
                              }}
                            ></i>
                          )}

                          <i
                            className="fa fa-eye"
                            onClick={() => {
                              setOpenModal1(true);

                              handlePreviewClick(
                                uploadDoc.uploadDocumentConfId
                              );
                            }}
                          ></i>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionDetails>
        </Accordion>
      )}
      <Modal
        title={"Configure Parameter"}
        show={openModal1}
        handleClose={() => setOpenModal1(false)}
        size="xl"
        centered
      >
        <Base64ToPDFPreview base64String={previewDocumentContent} />
      </Modal>

      {/* <Base64ToPDFPreview base64String={previewDocumentContent} /> */}
      {/* History */}
      <Modal
        title={"View  History"}
        show={openModal}
        handleClose={() => setOpenModal(false)}
        size="xl"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.</TableCell>
              <TableCell>Old Value</TableCell>
              <TableCell>New Value</TableCell>
              <TableCell>Updated on Date and Time</TableCell>
              <TableCell>Updated by</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyTableData.length > 0 ? (
              historyTableData?.map((history, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{history.oldValue}</TableCell>
                  <TableCell>{history.newValue}</TableCell>
                  <TableCell>{history.updatedOn}</TableCell>
                  <TableCell>{history.updatedBy}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} clasName="text-center">
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Modal>
    </>
  );
}

export default CreateConfigureParameterEngAuction;
