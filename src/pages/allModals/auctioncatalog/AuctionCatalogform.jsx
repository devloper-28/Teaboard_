import React, { useState, useEffect } from "react";
import TableComponent from "../../../components/tableComponent/TableComponent";
import {
  fetchGradeRequest,
  fetchMarkRequest,
  fetchSaleNumbersRequest,
  teaTypeAction,
} from "../../../store/actions";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import axiosMain from "../../../http/axios/axios_main";
import CreatePlanner from "./CreatePlanner";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  SelectionState,
  PagingState,
  IntegratedPaging,
  IntegratedSelection,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  PagingPanel,
} from "@devexpress/dx-react-grid-bootstrap4";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";

import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import CustomToast from "../../../components/Toast";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ToCreateMyPlanner from "./ToCreateMyPlanner";
import { usePrint } from "../../../components/common/PrintDataInTable";
import PrintableTable from "../../../components/common/PrintableTable";
import UploadValuation from "./UploadValuation";
import UpdateValuation from "./UpdateValuation";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";
import formatDateToDdMmYy from "../../../components/common/dateAndTime/convertToDate";
import ExportData from "../../../components/common/exportData/ExportData";
import { Button } from "react-bootstrap";

import "./table.css";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import axios from "axios";
import PrintInvoice from "../../../components/common/Print/print";
import Modals from "../../../components/common/Modal";

// console.log(loggedUser, "loggedUserloggedUser");

const AuctionCatalog = ({ modalRight }) => {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    auction,
    roleCode,
    auctionTypeMasterCode,
  } = useAuctionDetail();
  const [auctionType, setAuctionType] = useState(auction);
  const [auctionTypeCode, setAuctionTypeCode] = useState(auctionTypeMasterCode);
  const [baseUrlEng, setbaseUrlEng] = useState(
    auction === "ENGLISH" ? "EnglishAuctionCatalog" : "AuctionCatalog"
  );
  const [baseUrlEngBuyer, setbaseUrlEngBuyer] = useState(
    auction === "ENGLISH" ? "EnglishAuctionBuyer" : "Buyer"
  );

  const [rows, setRows] = useState([]);
  const [expandedTab, setExpandedTab] = useState("All");

  const [saleNo, setSaleNo] = useState([]);
  const [auctioneer, setAuctioneer] = useState([]);
  const [teatypeList, setTeaType] = useState([]);
  const [auctionDates, setAuctionDates] = useState([]);
  const [category, setCategory] = useState([]);
  const [sessionTime, setSessionTime] = useState([]);
  const [timeData, setTimeData] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [myCatalogRows, setMyCatalogRows] = useState([]);
  const [openMyPlanner, setOpenMyPlanner] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selection, setSelection] = useState([]);
  const [sessionTypeId, setsessionTypeId] = useState(0);
  const [auctioncatalogIdforupload, setauctioncatalogIdforupload] = useState(0);

  const [saleProgramId, setSaleProgramId] = useState(null);
  const [selectedDataMyCatalogdata, setSelectedDataMyCatalogdata] = useState(
    []
  );
  const [selectedDataAuctionCatalogdata, setSelectedDataAuctionCatalogdata] =
    useState([]);
  const [openUploadValuation, setOpenUploadValuation] = useState(false);
  const [getDataByPrems, setGetDataByprems] = useState([]);
  const [openUploadUpdateValuation, setOpenUploadUpdateValuation] =
    useState(false);
  const [selectionAuctionerList, setSelectionAuctionerList] = useState([]);

  const [editData, setIsEditData] = useState([]);
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(sessionStorage.getItem("User"))
  );
  const [isEdit, setIsEdit] = useState(false);

  const { printContent } = usePrint();

  const teaType = useSelector(
    (state) => state.teaType.teaTypeList.responseData
  );

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const [markDataList, setMarkDataList] = useState([]);
  const [gradesList, setGradesList] = useState([]);

  const dispatch = useDispatch();
  const grades = useSelector((state) => state.grade.data.responseData);
  const markList = useSelector((state) => state.mark.data.responseData);
  const [openPrintModel, setopenPrintModel] = useState(false);
  const [openPrintModelMyCatalog, setopenPrintModelMyCatalog] = useState(false);
  const [printrow, setprintrow] = useState([]);
  const [columndata, setcolumndata] = useState([]);
  const [columndatamycatalog, setcolumndatamycatalog] = useState([]);
  const [printMyrow, setprintMyrow] = useState([]);
  const formik = useFormik({
    initialValues:
      baseUrlEngBuyer == "EnglishAuctionBuyer"
        ? {
          season: new Date().getFullYear()?.toString(),
          saleNo: 0,
          auctionDate: "",
          // auctioneer: "",
          auctioneerId: 0,
          teaType: 0,
          category: 0,
          sessionTime: "",
          mark: 0,
          grade: 0,
        }
        : {
          season: new Date().getFullYear()?.toString(),
          saleNo: 0,
          auctionDate: "",
          // auctioneer: "",
          auctioneerId: 0,
          teaType: 0,
          category: 0,
          sessionTime: "",
        },
    onSubmit: (values) => {
      console.log(
        "🚀 ~ file: AuctionCatalogform.jsx:47 ~ AuctionCatalog ~ values:",
        values
      );
      // This function will be called when the form is submitted
      // console.log("Form data submitted:", values);

      // let data = {
      //   season: values.season,
      //   saleNo: values.saleNo,
      //   auctionDate: values.auctionDate,
      //   auctioneerId: values.auctioneer,
      //   teaTypeId: values.teaType,
      //   categoryId: values.category,
      //   sessionStartTime: values.sessionTime,
      //   sessionEndTime: values.sessionTime,
      // };
      // let data = [...sessionTime];

      // console.log([...sessionTime, values], values, "sessionTime");
      const {
        season,
        saleNo,
        auctionDate,
        auctioneerId,
        teaType,
        category,
        sessionTime,
      } = values;
      //SDP
      // const updatedObject = { ...values, auctionCenterId: auctionCenterId };
      const updatedObject = {
        season: season,
        saleNo: parseInt(saleNo),
        auctionDate: auctionDate,
        auctionCenterId: parseInt(auctionCenterId),
        auctioneerId: parseInt(auctioneerId),
        teaTypeId: parseInt(teaType),
        categoryId:
          category !== "" && category !== undefined ? parseInt(category) : 0,
        sessionStartTime:
          sessionTime?.split(" - ") !== undefined
            ? sessionTime?.split(" - ")?.at(0)
            : "",
        sessionEndTime:
          sessionTime?.split(" - ") !== undefined
            ? sessionTime?.split(" - ")?.at(1)
            : "",
      };
      if (loggedUser?.userCode === "auctioneer") {
        axiosMain
          .post(`/preauction/${baseUrlEng}/GetAuctionCatalog`, updatedObject)
          .then((res) => {
            if (res.data.statusCode === 200) {
              CustomToast.success(res.data.message);
              let data = res.data?.responseData?.map((ele) => {
                return {
                  ...ele,
                  gpDate: formatDateToDdMmYy(ele.gpDate),
                };
              });
              setRows(data);
            } else {
              setRows([]);
              CustomToast.error(res.data.message);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        axiosMain
          .post(
            `/preauction/${baseUrlEngBuyer}/GetBuyerAuctionCatalog`,
            updatedObject
          )
          .then((res) => {
            if (res.data.statusCode === 200) {
              CustomToast.success(res.data.message);
              let data = res.data?.responseData?.map((ele) => {
                return {
                  ...ele,
                  gpDate: formatDateToDdMmYy(ele.gpDate),
                };
              });
              setRows(data);
              setSelectedData([]);
              setSelectedDataMyCatalogdata([]);
            } else {
              setRows([]);
              CustomToast.error(res.data.message);
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 400) {
              // Handle the error and set the error message
              const errorData = error.response.data;
              console.log(
                "🚀 ~ file: AuctionCatalogform.jsx:126 ~ AuctionCatalog ~ errorData:",
                errorData
              );
            }
          });
      }
    },
  });
  useEffect(() => {
    dispatch(fetchSaleNumbersRequest(formik.values.season.toString()));
  }, [formik.values.season]);

  useEffect(() => {
    // setRows(sellPrograms);
    dispatch(fetchSaleNumbersRequest(formik.values.season));
    // dispatch(teaTypeAction());

    // axiosMain
    //   .post("/preauction/Common/BindAuctioneer")
    //   .then((response) => {
    //     // Handle the API response here
    //     setAuctioneer(response.data.responseData);
    //   })
    //   .catch((error) => {
    //     // Handle errors here
    //   });
    setLoggedUser(JSON.parse(sessionStorage.getItem("User")));
    dispatch(fetchMarkRequest({ auctionCenterId }));
    dispatch(fetchGradeRequest({ auctionCenterId }));
  }, []);
  useEffect(() => {
    setMarkDataList(markList);
    setGradesList(grades);
  }, [markList, grades]);
  useEffect(() => {
    // setRows(sellPrograms);
    if (saleNumber?.length > 0) {
      setSaleNo(saleNumber);
      formik.values.saleNo = saleNumber?.at(0)?.saleNo;
      // formik.values.saleNo = 0;
    } else {
      setSaleNo([]);
    }

    // if (teaType?.length > 0) {
    //   setTeaType(teaType);
    // } else {
    //   setTeaType([]);
    // }
  }, [saleNumber, teaType]);

  useEffect(() => {
    if (parseInt(formik.values.saleNo) > 0) {
      axiosMain
        .post("/preauction/Common/GetSaleProgramDetailBySaleNo", {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          setSaleProgramId(res.data.responseData[0].SaleProgramId);
          setbaseUrlEng(
            res?.data?.responseData[0]?.auctionTypeCode === "BHARAT"
              ? "AuctionCatalog"
              : "EnglishAuctionCatalog"
          );
          setbaseUrlEngBuyer(
            res?.data?.responseData[0]?.auctionTypeCode === "BHARAT"
              ? "Buyer"
              : "EnglishAuctionBuyer"
          );
        })
        .catch((err) => console.log(err));
      axiosMain
        .post("/preauction/Common/BindAuctionDate", {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            const dates = res.data.responseData?.map((ele) => {
              return { saleDate: ele?.saleDate?.split("T")?.at(0) };
            });
            // console.log(dates, "444");
            formik.setFieldValue("auctionDate", dates?.at(0)?.saleDate);
            setAuctionDates(dates);
          } else {
            setAuctionDates([]);
          }
        });
      axiosMain
        .post("/preauction/Common/BindAuctioneerByInvoice", {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            // formik.setFieldValue(
            //   "auctioneer",
            //   res.data.responseData?.at(0)?.userId
            // );
            setAuctioneer(res.data.responseData);
          } else {
            setAuctioneer([]);
          }
        });
      axiosMain
        .post("/preauction/Common/BindTeaTypeBySeasonSaleNo", {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            // formik.setFieldValue(
            //   "teaType",
            //   res.data.responseData?.at(0)?.teatypeid
            // );
            setTeaType(res.data.responseData);
          } else {
            setTeaType([]);
          }
        });
      axiosMain
        .post("/preauction/Common/BindCatagoryByParam", {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          // AuctioneerId: parseInt(formik.values.auctioneer),
          auctionCenterId: auctionCenterId,
          auctioneerId: userId,
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            // formik.setFieldValue(
            //   "category",
            //   res.data.responseData?.at(0)?.categoryId
            // );
            setCategory(res.data.responseData);
          } else {
            setCategory([]);
          }
        });
    } else {
      setAuctioneer([]);
      setAuctionDates([]);
      setTeaType([]);
    }
  }, [formik.values.saleNo]);

  useEffect(() => {
    // console.log(formik.values.auctioneerId);
    if (auctioneer.length > 0 && parseInt(formik.values.auctioneerId) > 0) {
      axiosMain
        .post("/preauction/Common/BindCatagoryByParam", {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          // AuctioneerId: parseInt(formik.values.auctioneer),
          auctionCenterId: auctionCenterId,
          auctioneerId: userId,
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            // formik.setFieldValue(
            //   "category",
            //   res.data.responseData?.at(0)?.categoryId
            // );
            setCategory(res.data.responseData);
          } else {
            setCategory([]);
          }
        });
    } else {
      setCategory([]);
    }
  }, [formik.values.auctioneerId]);

  useEffect(() => {
    if (parseInt(formik.values.auctionDate) > 0) {
      axiosMain
        .post("/preauction/Common/BindSessionTime", {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          auctionDate: formik.values.auctionDate,
          auctionCenterId: auctionCenterId,
          // sessionTypeId: 1,
          sessionTypeName: "Normal",
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            formik.setFieldValue(
              "sessionTime",
              res.data.responseData?.at(0)?.sessionTime
            );
            formik.setFieldValue(
              "sessionStartTime",
              res.data.responseData?.at(0)?.sessionTime?.split("-")?.at(0)
            );
            formik.setFieldValue(
              "sessionEndTime",
              res.data.responseData?.at(0)?.sessionTime?.split("-")[1]
            );
            // console.log(
            //   res.data.responseData?.at(0)?.sessionTime,
            //   "sessionTime"
            // );
            setSessionTime(res.data.responseData);
          } else {
            setSessionTime([]);
          }
        });
    }
  }, [formik.values.auctionDate]);

  // useEffect(() => {
  //   if (teatypeList?.length > 0 && parseInt(formik.values.teaType)) {

  //   } else {
  //   }
  // }, [teatypeList, formik.values.teaType]);

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

  const handleCheckboxChange = (row) => {
    // Check if the row is already in the selectedData array
    const isRowSelected = selectedData.some(
      (selectedRow) => selectedRow.KutchaCatalogId === row.KutchaCatalogId
    );

    if (isRowSelected) {
      // If the row is already selected, remove it from selectedData
      const updatedData = selectedData.filter(
        (selectedRow) => selectedRow.KutchaCatalogId !== row.KutchaCatalogId
      );
      setSelectedData(updatedData);
    } else {
      // If the row is not selected, add it to selectedData
      setSelectedData([...selectedData, row]);
    }
  };

  const handleCheckboxChangeMyCatalog = (row) => {
    // Check if the row is already in the selectedData array
    const isRowSelected = selectedDataMyCatalogdata.some(
      (selectedRow) => selectedRow.MyCatalogId === row.MyCatalogId
    );

    if (isRowSelected) {
      // If the row is already selected, remove it from selectedData
      const updatedData = selectedDataMyCatalogdata.filter(
        (selectedRow) => selectedRow.MyCatalogId !== row.MyCatalogId
      );
      setSelectedDataMyCatalogdata(updatedData);
    } else {
      // If the row is not selected, add it to selectedData
      setSelectedDataMyCatalogdata([...selectedDataMyCatalogdata, row]);
    }
  };

  const sellProgramsForBuyer =
    baseUrlEngBuyer === "Buyer"
      ? [
        // {
        //   title: ,
        //   name: ".",
        //   getCellValue: ({ ...row }) => (
        //     <>
        //       <input
        //         type="checkbox"
        //         checked={selectedData.some(
        //           (selectedRow) =>
        //             selectedRow.KutchaCatalogId === row.KutchaCatalogId
        //         )}
        //         onChange={() => handleCheckboxChange(row)}
        //       />
        //     </>
        //   ),
        // },

        { title: "Lot No.", name: "LotNo" },
        { title: "Origin", name: "Origin" },
        { title: "Tea Type", name: "teaTypeName" },
        { title: "Sub Type", name: "subTeaTypeName" },
        { title: "Category", name: "categoryName" },
        { title: "Mark", name: "markName" },
        { title: "Grade", name: "gradeName" },
        { title: "No. of Packages", name: "totalPackages" },
        { title: "Gross Weight", name: "grossKgs" },
        { title: "Net Weight", name: "netKgs" },
        { title: "Sample Qty. (KGs)", name: "SampleQty" },
        { title: "Invoice Weight", name: "invoiceQty" },
        { title: "Period of Manufacture", name: "periodOfManufacture" },
        { title: "Base Price", name: "basePrice" },
        { title: "Price Increment", name: "priceIncrement" },
        { title: "Auctioneer’s Valuation", name: "auctioneerValuation" },
        { title: "Mark & Packaging Comments", name: "markPackageComments" },
        { title: "Lot Comments", name: "lotComments" },
        { title: "Market Type", name: "marketTypeName" },
        { title: "GP No.", name: "gpNo" },
        { title: "GP Date", name: "gpDate" },
        { title: "Invoice No.", name: "invoiceNo" },
        { title: "Package Type", name: "packageType" },
        { title: "Package No.", name: "packageNo" },
        { title: "Warehouse Name", name: "wareHouseName" },
        { title: "Garden Certification", name: "gardenCertification" },
        { title: "Quality Certification", name: "qualityCertification" },
        { title: "Color of Brew", name: "brewColor" },
        { title: "Age of Products (In Months)", name: "ageOfProducts" },
        { title: "Brewers Comments", name: "brewersComments" },
        // { title: "Reserve Price", name: "reservePrice" },
        // { title: "LSP / SP", name: "LSP_SP" },
        // { title: "Quality Comments", name: "qualityComments" },

        // { title: "Tare Weight", name: "tareKgs" },
        // { title: "Short accses Weight", name: "shortAccsesWeight" },

        // { title: "System Base Price", name: "SystemBasePrice" },
        // { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
      ]
      : [
        { title: "Lot No.", name: "LotNo" },
        { title: "Origin", name: "Origin" },
        { title: "Tea Type", name: "teaTypeName" },
        { title: "Sub Type", name: "subTeaTypeName" },
        { title: "Category", name: "categoryName" },
        { title: "Mark", name: "markName" },
        { title: "Grade", name: "gradeName" },
        { title: "No. of Packages", name: "totalPackages" },
        { title: "Gross Weight", name: "grossKgs" },
        { title: "Net Weight", name: "netKgs" },
        { title: "Sample Qty. (KGs)", name: "SampleQty" },
        { title: "Invoice Weight", name: "invoiceQty" },
        { title: "Period of Manufacture", name: "periodOfManufacture" },
        { title: "Base Price", name: "basePrice" },
        { title: "Price Increment", name: "priceIncrement" },
        { title: "Auctioneer’s Valuation", name: "auctioneerValuation" },
        { title: "Mark & Packaging Comments", name: "markPackageComments" },
        { title: "Lot Comments", name: "lotComments" },
        { title: "Market Type", name: "marketTypeName" },
        { title: "GP No.", name: "gpNo" },
        { title: "GP Date", name: "gpDate" },
        { title: "Invoice No.", name: "invoiceNo" },
        { title: "Package Type", name: "packageType" },
        { title: "Package No.", name: "packageNo" },
        { title: "Warehouse Name", name: "wareHouseName" },
        // { title: "Garden Certification", name: "gardenCertification" },
        // { title: "Quality Certification", name: "qualityCertification" },
        // { title: "Color of Brew", name: "brewColor" },
        // { title: "Age of Products (In Months)", name: "ageOfProducts" },
        // { title: "Brewers Comments", name: "brewersComments" },
      ];
  const myCatalogForBuyer = [
    // {
    //   title: "Select",
    //   name: ".",
    //   getCellValue: ({ ...row }) => (
    //     <>
    //       <input
    //         type="checkbox"
    //         checked={selectedDataMyCatalogdata.some(
    //           (selectedRow) => selectedRow.MyCatalogId === row.MyCatalogId
    //         )}
    //         onChange={() => handleCheckboxChangeMyCatalog(row)}
    //       />
    //     </>
    //   ),
    // },
    { title: "Season", name: "season" },
    { title: "Sale No.", name: "saleNo" },
    {
      title: "Auction Date",
      name: "auctionDate",
      getCellValue: ({ ...row }) => row.auctionDate?.split("T")?.at(0),
    },
    // { title: "Tea Type", name: "teaTypeName" },
    { title: "Category", name: "categoryName" },
    { title: "Session Time", name: "sessionTime" },
    { title: "Lot No.", name: "lotNo" },
    { title: "Invoice No.", name: "invoiceNo" },
    { title: "Origin", name: "origin" },
    { title: "Tea Type", name: "teaTypeName" },
    { title: "Sub Type", name: "subTeaTypeName" },
    // { title: "Category", name: "categoryName" },
    { title: "Mark", name: "markName" },
    { title: "Grade", name: "gradeName" },
    { title: "Group Code", name: "groupCode" },
    { title: "No. of Packages", name: "packageNo" },
    { title: "Gross Weight", name: "grossKgs" },
    { title: "Tare Weight", name: "tareKgs" },
    { title: "Net Weight", name: "netKgs" },
    { title: "Sample Qty. (KGs)", name: "SampleQty" },
    { title: "Invoice Weight", name: "invoiceQty" },
    { title: "GP No.", name: "gpNo" },
    { title: "GP Date", name: "gpDate" },
    { title: "Period of Manufacture", name: "periodOfManufacture" },
    { title: "Base Price", name: "basePrice" },
    // { title: "Reserve Price", name: "reservePrice" },
    { title: "Auctioneer’s Valuation", name: "auctioneerValuation" },
    { title: "Price Increment", name: "priceIncrement" },
    // { title: "LSP / SP", name: "LSP_SP" },
    // { title: "Quality Comments", name: "qualityComments" },
    { title: "Mark & Packaging Comments", name: "markPackageComments" },
    { title: "Lot Comments", name: "lotComments" },
    { title: "Market Type", name: "marketTypeName" },
    { title: "Package Type", name: "packageType" },
    { title: "Package No.", name: "packageNo" },
    { title: "Warehouse Name", name: "wareHouseName" },

    { title: "Garden Certification", name: "gardenCertification" },
    { title: "Quality Certification", name: "qualityCertification" },
    { title: "Color of Brew", name: "brewColor" },
    { title: "Age of Products (In Months)", name: "ageOfProducts" },
    { title: "Brewers Comments", name: "brewersComments" },
    // { title: "System Base Price", name: "basePrice" },
    { title: "SBP_LSP/SP", name: "LSP_SP" },
    // { title: "My Comments", name: "myComments" },
    // { title: "My Valuation", name: "myValuation" },

    {
      title: "Action",
      name: "action",
      // getCellValue: ({ ...row }) => (
      //   <>
      //     <button
      //       type="button"
      //       onClick={() => {
      //         setOpenMyPlanner(true);
      //         setIsEdit(true);
      //       }}
      //     >
      //       Remove
      //     </button>
      //     {/* <button type="button" onClick={() => setOpenMyPlanner(true)}>
      //       Add Valuation
      //     </button> */}
      //   </>
      // ),
    },
  ];

  const myCatalogForAuctioneer =
    baseUrlEng === "AuctionCatalog"
      ? [
        // {
        //   title: ".",
        //   name: ".",
        //   // getCellValue: ({ ...row }) => (
        //   //   <>
        //   //     <input
        //   //       type="checkbox"
        //   //       onClick={() => setSelectedData([...selectedData, row])}
        //   //     />
        //   //   </>
        //   // ),
        // },
        { title: "Season", name: "Season" },
        { title: "Sale No.", name: "saleNo" },
        { title: "Auction Date", name: "saleDate" },
        { title: "Tea Type", name: "teaTypeName" },
        { title: "Category", name: "categoryName" },
        { title: "Session Type", name: "sessionType" },
        { title: "Lot No.", name: "LotNo" },
        { title: "Invoice No.", name: "invoiceNo" },
        { title: "Origin", name: "Origin" },
        { title: "Sub Type", name: "subTeaTypeName" },
        { title: "Mark", name: "markName" },
        { title: "Grade", name: "gradeName" },
        // { title: "Group Code", name: "groupCode" },
        { title: "No. of Packages", name: "totalPackages" },
        { title: "Gross Weight", name: "grossKgs" },
        { title: "Tare Weight", name: "tareKgs" },
        { title: "Net Weight", name: "netKgs" },
        { title: "Sample Qty. (KGs)", name: "SampleQty" },
        { title: "Invoice Weight", name: "invoiceWeight" },
        { title: "GP No.", name: "gpNo" },
        { title: "GP Date", name: "gpDate" },
        { title: "Period of Manufacture", name: "periodOfManufacture" },
        { title: "Base Price", name: "basePrice" },
        { title: "Reserve Price", name: "reservePrice" },
        { title: "Auctioneer’s Valuation", name: "auctioneerValuation" },
        { title: "Price Increment", name: "priceIncrement" },
        { title: "LSP / SP", name: "LSP_SP" },
        // { title: "Quality Comments", name: "qualityComments" },
        { title: "Mark & Packaging Comments", name: "markPackageComments" },
        { title: "Lot Comments", name: "lotComments" },
        { title: "Market Type", name: "marketTypeName" },
        { title: "Package Type", name: "packageType" },
        { title: "Package No.", name: "packageNo" },
        { title: "Warehouse Name", name: "wareHouseName" },

        { title: "Garden Certification", name: "gardenCertification" },
        { title: "Quality Certification", name: "qualityCertification" },
        { title: "Color of Brew", name: "brewColor" },
        { title: "Age of Products (In Months)", name: "ageOfProducts" },
        { title: "Brewers Comments", name: "brewersComments" },
        { title: "System Base Price", name: "SBP" },
        { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
        {
          title: "Action",
          name: "action",
        },
        // { title: "My Comments", name: "myComments" },
        // { title: "My Valuation", name: "myValuation" },

        // { title: "Short accses Weight", name: "shortAccsesWeight" },
      ]
      : [
        { title: "Season", name: "Season" },
        { title: "Sale No.", name: "saleNo" },
        { title: "Auction Date", name: "saleDate" },
        { title: "Tea Type", name: "teaTypeName" },
        { title: "Category", name: "categoryName" },
        { title: "Session Type", name: "sessionType" },
        { title: "Lot No.", name: "LotNo" },
        { title: "Invoice No.", name: "invoiceNo" },
        { title: "Origin", name: "Origin" },
        { title: "Sub Type", name: "subTeaTypeName" },
        { title: "Mark", name: "markName" },
        { title: "Grade", name: "gradeName" },
        // { title: "Group Code", name: "groupCode" },
        { title: "No. of Packages", name: "totalPackages" },
        { title: "Gross Weight", name: "grossKgs" },
        { title: "Tare Weight", name: "tareKgs" },
        { title: "Net Weight", name: "netKgs" },
        { title: "Sample Qty. (KGs)", name: "SampleQty" },
        { title: "Invoice Weight", name: "invoiceWeight" },
        { title: "GP No.", name: "gpNo" },
        { title: "GP Date", name: "gpDate" },
        { title: "Period of Manufacture", name: "periodOfManufacture" },
        { title: "Base Price", name: "basePrice" },
        { title: "Reserve Price", name: "reservePrice" },
        { title: "Auctioneer’s Valuation", name: "auctioneerValuation" },
        { title: "Price Increment", name: "priceIncrement" },
        { title: "LSP / SP", name: "LSP_SP" },
        // { title: "Quality Comments", name: "qualityComments" },
        { title: "Mark & Packaging Comments", name: "markPackageComments" },
        { title: "Lot Comments", name: "lotComments" },
        { title: "Market Type", name: "marketTypeName" },
        { title: "Package Type", name: "packageType" },
        { title: "Package No.", name: "packageNo" },
        { title: "Warehouse Name", name: "wareHouseName" },

        // { title: "Garden Certification", name: "gardenCertification" },
        // { title: "Quality Certification", name: "qualityCertification" },
        // { title: "Color of Brew", name: "brewColor" },
        // { title: "Age of Products (In Months)", name: "ageOfProducts" },
        // { title: "Brewers Comments", name: "brewersComments" },
        // { title: "System Base Price", name: "SBP" },
        // { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },

        {
          title: "Action",
          name: "action",
        },
      ];

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);

    // setDisable(false);
    // setIsEdit(false);
  };
  const handleExportExcel = async () => {
    // Assuming columnName contains the list of objects with "name" and "title"
    let columnsdata = sellProgramsForAuctioneer;
    // columnsdata.pop();
    const columnName = columnsdata;

    // Assuming data contains the list of data objects like [{saleNo: 5}, ...]
    const data = rows.map((ele) => {
      const { invoiceId, ...rest } = ele;
      return rest;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("AuctionCatalog");

    // Define the types for specific columns

    // Create columns in the worksheet
    // columnName?.forEach((column) => {
    //   const excelColumn = worksheet?.addColumn({
    //     header: column.title,
    //     key: column.name,
    //   });

    //   if (dateColumns.includes(column.name)) {
    //     excelColumn.type = "date";
    //     // Optionally, set date format for the column
    //     // excelColumn.numFmt = 'mm/dd/yyyy'; // Date format
    //   } else if (textColumns.includes(column.name)) {
    //     excelColumn.type = "string";
    //   } else {
    //     excelColumn.type = "general";
    //   }
    //   // You can add more conditions for other types like numbers, currencies, etc.
    // });

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
      // worksheet.addRow(rowData).eachCell((cell) => {
      //   cell.fill = {
      //     type: "date",
      //   };
      // });
    });

    console.log(data, "datatata");

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
    saveAs(blob, "AuctionCatalog.xlsx");
  };
  console.log(baseUrlEng, "baseUrlEng");
  const sellProgramsForAuctioneer =
    baseUrlEng === "AuctionCatalog"
      ? [
        {
          title: "Lot No",
          name: "LotNo",
        },
        { title: "Mark", name: "markName" },
        { title: "Invoice No.", name: "invoiceNo" },
        { title: "Grade", name: "gradeName" },
        { title: "No. of Packages", name: "totalPackages" },
        {
          title: "Base Price",
          name: "basePrice",
        },

        // { title: "Reserve Price", name: "reservePrice" },
        { title: "Auctioneer’s Valuation", name: "auctioneerValuation" },
        { title: "Price Increment", name: "priceIncrement" },
        { title: "LSP / SP", name: "LSP_SP" },
        // { title: "Quality Comments", name: "qualityComments" },
        { title: "Origin", name: "Origin" },
        { title: "Tea Type", name: "teaTypeName" },
        { title: "Sub Type", name: "subTeaTypeName" },
        { title: "Category", name: "categoryName" },
        { title: "Package Type", name: "packageType" },
        { title: "Package No.", name: "packageNo" },
        { title: "Gross Weight", name: "grossKgs" },
        { title: "Tare Weight", name: "tareKgs" },
        { title: "Net Weight", name: "netKgs" },
        { title: "Sample Qty. (KGs)", name: "SampleQty" },
        { title: "Invoice Weight", name: "invoiceWeight" },
        // { title: "Short accses Weight", name: "shortAccsesWeight" },
        { title: "GP No.", name: "gpNo" },
        { title: "GP Date", name: "gpDate" },
        { title: "Period of Manufacture", name: "periodOfManufacture" },
        { title: "Mark & Packaging Comments", name: "markPackageComments" },
        { title: "Market Type", name: "marketTypeName" },
        { title: "Warehouse Name", name: "wareHouseName" },
        { title: "Garden Certification", name: "gardenCertification" },
        { title: "Quality Certification", name: "qualityCertification" },
        { title: "Color of Brew", name: "brewColor" },
        { title: "Age of Products (In Months)", name: "ageOfProducts" },
        { title: "Brewers Comments", name: "brewersComments" },
        // { title: "System Base Price", name: "SBP" },
        { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
        // { title: "Lot Comments", name: "lotComments" },
        // {
        //   title: "Auction",
        //   name: "auction",
        //   getCellValue: ({ ...row }) => (
        //     <>
        //       <a type="button" onClick={() => setOpenUploadUpdateValuation(true)}>
        //         <i class="fa fa-edit"></i>
        //       </a>
        //     </>
        //   ),
        // },
      ]
      : [
        {
          title: "Lot No.",
          name: "LotNo",
        },
        { title: "Mark", name: "markName" },
        { title: "Invoice No.", name: "invoiceNo" },
        { title: "Grade", name: "gradeName" },
        { title: "No. of Packages", name: "totalPackages" },
        {
          title: "Base Price",
          name: "basePrice",
        },

        // { title: "Reserve Price", name: "reservePrice" },
        { title: "Auctioneer’s Valuation", name: "auctioneerValuation" },
        { title: "Price Increment", name: "priceIncrement" },
        { title: "LSP / SP", name: "LSP_SP" },
        // { title: "Quality Comments", name: "qualityComments" },
        { title: "Origin", name: "Origin" },
        { title: "Tea Type", name: "teaTypeName" },
        { title: "Sub Type", name: "subTeaTypeName" },
        { title: "Category", name: "categoryName" },
        { title: "Package Type", name: "packageType" },
        { title: "Package No.", name: "packageNo" },
        { title: "Gross Weight", name: "grossKgs" },
        { title: "Tare Weight", name: "tareKgs" },
        { title: "Net Weight", name: "netKgs" },
        { title: "Sample Qty. (KGs)", name: "SampleQty" },
        { title: "Invoice Weight", name: "invoiceWeight" },
        // { title: "Short accses Weight", name: "shortAccsesWeight" },
        { title: "GP No.", name: "gpNo" },
        { title: "GP Date", name: "gpDate" },
        { title: "Period of Manufacture", name: "periodOfManufacture" },
        { title: "Mark & Packaging Comments", name: "markPackageComments" },
        { title: "Market Type", name: "marketTypeName" },
        { title: "Warehouse Name", name: "wareHouseName" },
        // { title: "Garden Certification", name: "gardenCertification" },
        // { title: "Quality Certification", name: "qualityCertification" },
        // { title: "Color of Brew", name: "brewColor" },
        // { title: "Age of Products (In Months)", name: "ageOfProducts" },
        // { title: "Brewers Comments", name: "brewersComments" },
        // // { title: "System Base Price", name: "SBP" },
        // { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
        // { title: "Lot Comments", name: "lotComments" },
        // {
        //   title: "Auction",
        //   name: "auction",
        //   getCellValue: ({ ...row }) => (
        //     <>
        //       <a type="button" onClick={() => setOpenUploadUpdateValuation(true)}>
        //         <i class="fa fa-edit"></i>
        //       </a>
        //     </>
        //   ),
        // },
      ];
  const handleDownload = () => {
    let documentName = "AuctionCata.xlsx";

    axiosMain
      .post(
        `/preauction/${baseUrlEng}/DownloadAuctionCatalogReportExcel?role=` +
        roleCode,
        {
          SaleProgramId: saleProgramId,
          auctionCenterId: auctionCenterId,
          userId: 0,
          Type: roleCode === "BUYER" ? "For Buyer" : "Normal",
          auctionDate: formik.values.auctionDate,
          auctioneerId: parseInt(formik.values.auctioneerId),
          teaTypeId: parseInt(formik.values.teaType),
          categoryId:
            formik.values.category == "" ? 0 : parseInt(formik.values.category),
          sessionStartTime:
            formik.values.sessionTime?.split(" - ") === undefined
              ? formik.values.sessionTime?.split(" - ")?.at(0)
              : "",
          sessionEndTime:
            formik.values.sessionTime?.split(" - ") === undefined
              ? formik.values.sessionTime?.split(" - ")?.at(1)
              : "",
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
  const handleExportToPdf = () => {
    var newdat = rows?.map(obj => {
      for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
          obj[key] = "";
        }
      }
      return obj;
    });
    var allcoulmn = loggedUser?.userCode === "buyer" ? sellProgramsForBuyer : sellProgramsForAuctioneer;
    allcoulmn.push({ name: "season", title: "Season" }, { name: "saleNo", title: "Sale No" })
    setcolumndata(allcoulmn);

    var datas = newdat?.map((item) => ({ ...item, season: formik.values.season, saleNo: formik.values.saleNo }))
    setprintrow(datas);
    console.log(formik);
    setopenPrintModel(true)
  };
  const handleExportToPdfMyCatalog = () => {
    var newdat = myCatalogRows?.map(obj => {
      for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
          obj[key] = "";
        }
      }
      return obj;
    });
    var allcoulmn = loggedUser.userCode.toLowerCase() === "auctioneer" ? myCatalogForAuctioneer : myCatalogForBuyer;
    allcoulmn.push({ name: "season", title: "Season" }, { name: "saleNo", title: "Sale No" })
    // var datas = newdat.map((item) => ({ ...item, season: formik.values.season, saleNo: formik.values.saleNo }))
    // setprintrow(myCatalogRows);
    // console.log(formik);
    const objectToRemove = "action";

    // Find the index of the object with the specified name
    const indexToRemove = allcoulmn.findIndex(item => item.name === objectToRemove);

    // Check if the index is found and remove the object
    if (indexToRemove !== -1) {
      allcoulmn.splice(indexToRemove, 1);
    }
    var datas = newdat?.map((item) => ({ ...item, season: formik.values.season, saleNo: formik.values.saleNo }))
    setprintMyrow(datas);
    setcolumndatamycatalog(allcoulmn);

    setopenPrintModelMyCatalog(true)
  };


  return (
    <div>
      <Accordion
        expanded={expandedTab === "panel1" || expandedTab === "All"}
        onChange={handleAccordionChange("panel1")}
        className={`${expandedTab === "panel1" || expandedTab === "All" ? "active" : ""
          }`}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Auction Catalog</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={formik.handleSubmit}>
            {/* <div className="row">
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="season">Season</label>
              <input
                type="text"
                id="season"
                name="season"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.season}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="saleNo">Sale No.</label>
              <input
                type="text"
                id="saleNo"
                name="saleNo"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.saleNo}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="auctionDate">Auction Date</label>
              <input
                type="text"
                id="auctionDate"
                name="auctionDate"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.auctionDate}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="auctioneer">Auctioneer</label>
              <input
                type="text"
                id="auctioneer"
                name="auctioneer"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.auctioneer}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="teaType">Tea Type</label>
              <input
                type="text"
                id="teaType"
                name="teaType"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.teaType}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.category}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="sessionTime">Session Time</label>
              <input
                type="text"
                id="sessionTime"
                name="sessionTime"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sessionTime}
              />
            </div>
          </div>
        </div> */}
            {modalRight?.includes("12") && (
              <div className="row">
                <div className="col-lg-2">
                  <div className="FormGroup">
                    <label htmlFor="season">Season</label>
                    <select
                      id="season"
                      name="season"
                      className="form-control select-form"
                      onChange={formik.handleChange}
                      value={formik.values.season}
                    >
                      {generateYearOptions()}
                    </select>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="FormGroup">
                    <label htmlFor="saleNo">Sale No.</label>
                    <select
                      id="saleNo"
                      name="saleNo"
                      className="form-control select-form"
                      onChange={formik.handleChange}
                      value={formik.values.saleNo}
                    >
                      {saleNo?.length > 0 ? (
                        saleNo?.map((item, index) => (
                          <option value={item.saleNo} key={item.saleNo}>
                            {item.saleNo}
                          </option>
                        ))
                      ) : (
                        <option>No Data</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="FormGroup">
                    <label htmlFor="auctionDate">Auction Date</label>
                    <select
                      id="auctionDate"
                      name="auctionDate"
                      className="form-control select-form"
                      onChange={formik.handleChange}
                      value={formik.values.auctionDate}
                    >
                      {auctionDates?.length > 0 ? (
                        auctionDates?.map((item, index) => (
                          <option value={item.saleDate} key={index}>
                            {item.saleDate}
                          </option>
                        ))
                      ) : (
                        <option>No Data</option>
                      )}
                      {/* Add more options as needed */}
                    </select>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="FormGroup">
                    <label htmlFor="auctioneer">Auctioneer</label>
                    <select
                      id="auctioneer"
                      name="auctioneerId"
                      className="form-control select-form"
                      onChange={formik.handleChange}
                      value={formik.values.auctioneerId}
                    >
                      <option value={0}>All</option>

                      {auctioneer?.length > 0 ? (
                        auctioneer?.map((item, index) => (
                          <option value={item.userId} key={item.userId}>
                            {item.userCode}
                          </option>
                        ))
                      ) : (
                        <option>No Data</option>
                      )}
                      {/* Add more options as needed */}
                    </select>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="FormGroup">
                    <label htmlFor="teaType">Tea Type</label>
                    <select
                      id="teaType"
                      name="teaType"
                      className="form-control select-form"
                      onChange={formik.handleChange}
                      value={formik.values.teaType}
                    >
                      <option value={0}>All</option>

                      {teatypeList?.length > 0 ? (
                        teatypeList?.map((item, index) => (
                          <option value={item.teatypeid} key={index}>
                            {item.teaTypeName}
                          </option>
                        ))
                      ) : (
                        <option>No Data</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="FormGroup">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      className="form-control select-form"
                      onChange={formik.handleChange}
                      value={formik.values.category}
                    >
                      <option value={0}>All</option>

                      {category?.length > 0 ? (
                        category?.map((item, index) => (
                          <option value={item.categoryId} key={item.categoryId}>
                            {item.categoryCode}
                          </option>
                        ))
                      ) : (
                        <option>No Data</option>
                      )}
                      {/* Add more options as needed */}
                    </select>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="FormGroup">
                    <label htmlFor="sessionTime">Session Time</label>
                    <select
                      id="sessionTime"
                      name="sessionTime"
                      className="form-control select-form"
                      onChange={(e) => {
                        formik.handleChange(e);
                        setTimeData(e.target.value);
                      }}
                      value={formik.values.sessionTime}
                    >
                      <option value="">All</option>
                      {sessionTime?.length > 0 ? (
                        sessionTime?.map((item, index) => (
                          <option value={item.SessionTime} key={index}>
                            {item.SessionTime}
                          </option>
                        ))
                      ) : (
                        <option>No Data</option>
                      )}
                      {/* Add more options as needed */}
                    </select>
                  </div>
                </div>
                {baseUrlEngBuyer === "EnglishAuctionBuyer" && (
                  <>
                    <div className="col-lg-2">
                      <div className="FormGroup">
                        <label htmlFor="auctioneer">Mark</label>
                        <select
                          id="mark"
                          name="mark"
                          className="form-control select-form"
                          onChange={formik.handleChange}
                          value={formik.values.mark}
                        >
                          <option value={0}>All</option>

                          {markDataList?.length > 0
                            ? markDataList?.map((item, index) => (
                              <option value={item.markId} key={index}>
                                {item.markCode}
                              </option>
                            ))
                            : "No Data"}
                          {/* Add more options as needed */}
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="FormGroup">
                        <label htmlFor="grade">Grade</label>
                        <select
                          id="grade"
                          name="grade"
                          className="form-control select-form"
                          onChange={formik.handleChange}
                          value={formik.values.grade}
                        >
                          <option value={0}>All</option>

                          {gradesList?.length > 0
                            ? gradesList?.map((item, index) => (
                              <option value={item.gradeId} key={index}>
                                {item.gradeCode}
                              </option>
                            ))
                            : "No Data"}
                          {/* Add more options as needed */}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="col-12">
                  <div className="BtnGroup">
                    {modalRight?.includes("12") && (
                      <button
                        type="submit"
                        className="SubmitBtn btn"
                      // onClick={formik.handleSubmit}
                      >
                        Search
                      </button>
                    )}
                    <Button className="SubmitBtn creat-btn" onClick={handleExportToPdf}>
                      Print
                    </Button>
                    {modalRight?.includes("9") && (
                      <Button className="SubmitBtn" onClick={handleExportExcel}>
                        Export as Excel
                      </Button>
                    )}
                    {modalRight?.includes("7") && (
                      <button
                        type="button"
                        className="btn SubmitBtn me-2"
                        onClick={handleDownload}
                      >
                        Download Sample
                      </button>
                    )}
                    {loggedUser?.userCode === "buyer" ? (
                      <button
                        type="button"
                        className="SubmitBtn btn"
                        onClick={() => {
                          if (loggedUser?.userCode === "buyer") {
                            let KutchaCatalogId = "";
                            let auctionCatalogId = "";

                            selectedDataAuctionCatalogdata
                              .map((ele) => rows[ele])
                              .map(
                                (ele) =>
                                  baseUrlEng === "Buyer" || baseUrlEngBuyer === "Buyer" ? (KutchaCatalogId =
                                    KutchaCatalogId === ""
                                      ? ele.KutchaCatalogId?.toString()
                                      : KutchaCatalogId +
                                      "," +
                                      ele.KutchaCatalogId?.toString())
                                    : (auctionCatalogId =
                                      auctionCatalogId === ""
                                        ? ele.auctionCatalogId?.toString()
                                        : auctionCatalogId +
                                        "," +
                                        ele.auctionCatalogId?.toString())
                              );

                            axiosMain
                              .post(
                                `/preauction/${baseUrlEngBuyer}/AddToMyCatalog`,
                                baseUrlEngBuyer === "Buyer"
                                  ? {
                                    kutchaCatalogIds: KutchaCatalogId,
                                    SaleProgramId: saleProgramId,
                                    buyerId: userId,
                                    auctionCenterId: auctionCenterId,
                                    sessionTypeId: parseInt(
                                      rows[0].sessionTypeId
                                    ),
                                  }
                                  : {
                                    auctionCatalogIds: auctionCatalogId,
                                    SaleProgramId: saleProgramId,
                                    buyerId: userId,
                                    auctionCenterId: auctionCenterId,
                                    sessionTypeId: parseInt(
                                      rows[0].sessionTypeId
                                    ),
                                  }
                              )
                              .then((res) => {
                                if (res.data.statusCode === 200) {
                                  CustomToast.success(res.data.message);
                                  formik.values.sessionStartTime = timeData
                                    ?.split(" - ")
                                    ?.at(0);
                                  formik.values.sessionEndTime =
                                    timeData?.split(" - ")[1];

                                  axiosMain
                                    .post(
                                      `/preauction/${baseUrlEngBuyer}/GetMyCatalog?role=` +
                                      roleCode,
                                      baseUrlEngBuyer === "Buyer"
                                        ? {
                                          season: formik.values.season,
                                          saleNo: parseInt(
                                            formik.values.saleNo
                                          ),
                                          auctionDate:
                                            formik.values.auctionDate,
                                          buyerId: userId,
                                          // userId: formik.values.auctioneer,
                                          sessionTime:
                                            formik.values.sessionTime,
                                          teaTypeId: formik.values.teaType,
                                          categoryId: formik.values.category,
                                          sessionStartTime:
                                            formik.values.sessionTime
                                              ?.split(" - ")
                                              ?.at(0),
                                          sessionEndTime:
                                            formik.values.sessionTime
                                              ?.split(" - ")
                                              ?.at(1),
                                          auctionCenterId: auctionCenterId,
                                        }
                                        : {
                                          season: formik.values.season,
                                          saleNo: parseInt(
                                            formik.values.saleNo
                                          ),
                                          auctionDate:
                                            formik.values.auctionDate,
                                          buyerId: userId,
                                          // userId: formik.values.auctioneer,
                                          sessionTime:
                                            formik.values.sessionTime,
                                          teaTypeId: formik.values.teaType,
                                          categoryId: formik.values.category,
                                          sessionStartTime:
                                            formik.values.sessionTime
                                              ?.split(" - ")
                                              ?.at(0),
                                          sessionEndTime:
                                            formik.values.sessionTime
                                              ?.split(" - ")
                                              ?.at(1),
                                          auctionCenterId: auctionCenterId,
                                          gradeId:
                                            formik.values.grade === ""
                                              ? 0
                                              : parseInt(formik.values.grade),
                                          markId:
                                            formik.values.mark === ""
                                              ? 0
                                              : parseInt(formik.values.mark),
                                        }
                                    )
                                    .then((res) => {
                                      if (res.data.statusCode === 200) {
                                        CustomToast.success(res.data.message);
                                        setMyCatalogRows(res.data.responseData);
                                        setSelectedData([]);
                                        setSelectedDataMyCatalogdata([]);
                                        //set session type id
                                        setsessionTypeId(
                                          res.data?.responseData[0]
                                            ?.sessionTypeId
                                        );
                                      } else {
                                        CustomToast.error(res.data.message);
                                        setMyCatalogRows([]);
                                      }
                                    });
                                  setSelectedData([]);
                                } else {
                                  CustomToast.error(res.data.message);
                                  setSelectedData([]);
                                }
                              });
                          }
                        }}
                      >
                        Add to My Catalog
                      </button>
                    ) : (
                      ""
                    )}
                    <button
                      type="button"
                      className="SubmitBtn btn"
                      onClick={() => {
                        formik.resetForm();
                        setRows([]);
                        setMyCatalogRows([]);
                        setSelectedData([]);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                  {/* <ExportData
                  data={rows.map((ele) => {
                    return {
                      LotNo: ele.LotNo,
                    };
                  })}
                  exportType="downloadExcel"
                /> */}
                </div>
              </div>
            )}
          </form>

          <div className="row mt-4">
            <div className="col-12">
              {/* <TableComponent
                columns={
                  loggedUser?.userCode === "buyer"
                    ? sellProgramsForBuyer.map((obj) => ({
                        ...obj,
                        getCellValue:
                          obj.name === "."
                            ? obj.getCellValue
                            : (row) =>
                                row[obj.name] === null ? "-" : row[obj.name],
                      }))
                    : sellProgramsForAuctioneer.map((obj) => ({
                        ...obj,
                        getCellValue: (row) =>
                          row[obj.name] === null ? "-" : row[obj.name],
                      }))
                }
                rows={rows?.length > 0 ? rows : []}
                setRows={setRows}
                addpagination={true}
                dragdrop={false}
                fixedColumnsOn={false}
                resizeingCol={false}
                selectionCol={true}
                sorting={true}
              /> */}

              <Grid
                rows={rows?.length > 0 ? rows : []}
                columns={
                  loggedUser?.userCode === "buyer"
                    ? sellProgramsForBuyer.map((obj) => ({
                      ...obj,
                      getCellValue:
                        obj.name === "."
                          ? obj.getCellValue
                          : (row) =>
                            row[obj.name] === null ? "-" : row[obj.name],
                    }))
                    : sellProgramsForAuctioneer.map((obj) => ({
                      ...obj,
                      getCellValue: (row) =>
                        row[obj.name] === null ? "-" : row[obj.name],
                    }))
                }
              >
                {loggedUser?.userCode === "buyer" ? (
                  <SelectionState
                    selection={selectedDataAuctionCatalogdata}
                    onSelectionChange={setSelectedDataAuctionCatalogdata}
                  />
                ) : (
                  ""
                )}
                <PagingState defaultCurrentPage={0} pageSize={rows?.length} />
                {loggedUser?.userCode === "buyer" ? (
                  <IntegratedSelection />
                ) : (
                  ""
                )}
                <IntegratedPaging />
                <Table />
                <TableHeaderRow />
                {loggedUser?.userCode === "buyer" ? (
                  <TableSelection showSelectAll />
                ) : (
                  ""
                )}
                {/* <PagingPanel /> */}
              </Grid>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      {loggedUser?.userCode === "buyer" ? (
        <div clasName="mt-5 mb-5">
          <ToCreateMyPlanner
            openMyPlanner={openMyPlanner}
            setOpenMyPlanner={setOpenMyPlanner}
            myCatalogDetails={myCatalogRows}
            loggedUser={loggedUser}
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            saleProgramId={saleProgramId}
          // myCatalog={() => (
          //   <>
          //     <button
          //       type="button"
          //       className="SubmitBtn btn"
          //       onClick={() => {
          //         if (loggedUser?.userCode === "buyer") {
          //           // axiosMain.post("/preauction/Buyer/AddToMyCatalog")
          //           formik.values.sessionStartTime = timeData
          //             ?.split(" - ")
          //             ?.at(0);
          //           formik.values.sessionEndTime = timeData?.split(" - ")[1];

          //           axiosMain
          //             .post("/preauction/Buyer/GetMyCatalog", {
          //               season: formik.values.season,
          //               saleNo: parseInt(formik.values.saleNo),
          //               auctionDate: formik.values.auctionDate,
          //               buyerId: userId,
          //               // userId: formik.values.auctioneer,
          //               sessionTime: formik.values.sessionTime,
          //               teaTypeId: formik.values.teaType,
          //               categoryId: formik.values.category,
          //               sessionStartTime: formik.values.sessionStartTime,
          //               sessionEndTime: formik.values.sessionEndTime,
          //               auctionCenterId: auctionCenterId,
          //             })
          //             .then((res) => {
          //               if (res.data.statusCode === 200) {
          //                 CustomToast.success(res.data.message);
          //                 setMyCatalogRows(res.data.responseData);
          //                 setSelectedData([]);
          //                 setSelectedDataMyCatalogdata([]);
          //               } else {
          //                 CustomToast.error(res.data.message);
          //                 setMyCatalogRows([]);
          //               }
          //             });

          //           // console.log(KutchaCatalogId);
          //         } else {
          //           if (formik.values.saleNo !== "") {
          //             formik.values.sessionStartTime =
          //               formik.values.sessionTime
          //                 ?.at(0)
          //                 ?.SessionTime?.split(" - ")
          //                 ?.at(0);
          //             formik.values.sessionEndTime = formik.values.sessionTime
          //               ?.at(0)
          //               ?.SessionTime?.split(" - ")[1];
          //             console.log(formik.values);
          //             axiosMain
          //               .post("/preauction/AuctionCatalog/GetMyCatalog", {
          //                 season: formik.values.season,
          //                 saleNo: parseInt(formik.values.saleNo),
          //                 auctionDate: formik.values.auctionDate,
          //                 // auctioneerId: formik.values.auctioneer,

          //                 auctioneerId: userId,
          //                 auctionCenterId: auctionCenterId,
          //                 userId: userId,
          //                 // userId: formik.values.auctioneer,
          //                 teaTypeId: formik.values.teaType,
          //                 categoryId: formik.values.category,
          //                 sessionStartTime: formik.values.sessionStartTime,
          //                 sessionEndTime: formik.values.sessionEndTime,
          //               })
          //               .then((res) => {
          //                 if (res.data.statusCode === 200) {
          //                   CustomToast.success(res.data.message);
          //                   setMyCatalogRows(res.data.responseData);
          //                 } else {
          //                   CustomToast.error(res.data.message);
          //                 }
          //               });
          //           }
          //         }
          //       }}
          //     >
          //       My Catalog
          //     </button>
          //   </>
          // )}
          />
        </div>
      ) : (
        ""
      )}
      <Accordion
        expanded={expandedTab === "panel2" || expandedTab === "All"}
        onChange={handleAccordionChange("panel2")}
        className={`${expandedTab === "panel2" || expandedTab === "All" ? "active" : ""
          }`}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>My Catalog</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* <div className="BtnGroup">
            <button >
              Create My Planner{" "}
            </button>
          </div> */}

          {loggedUser.userCode === "buyer" ? (
            <div className="BtnGroup d-flex">
              {modalRight?.includes("21") && (
                <button
                  type="button"
                  disable
                  className="SubmitBtn btn"
                  onClick={() => {
                    setOpenUploadValuation(true);
                  }}
                >
                  Upload Valuation
                </button>
              )}

              {modalRight?.includes("21") && (
                <button
                  type="button"
                  className="SubmitBtn btn"
                  onClick={() => {
                    setOpenDelete(true);
                  }}
                >
                  Remove lots
                </button>
              )}

              {/* <button type="button" className="SubmitBtn btn">
                Save My Catalog
              </button> */}
              {modalRight?.includes("9") && (
                <button
                  type="button"
                  onClick={() =>
                    PrintableTable(
                      loggedUser.userCode.toLowerCase() === "auctioneer" ||
                        loggedUser.userCode.toLowerCase() === "teaboard"
                        ? modalRight?.includes("9") && modalRight?.includes("9")
                          ? [
                            ...myCatalogForAuctioneer,
                            {
                              name: "action",
                              title: "Action",
                            },
                          ]
                          : myCatalogForAuctioneer
                        : myCatalogForBuyer,
                      myCatalogRows?.length > 0 ? myCatalogRows : [],
                      roleCode + "My Catalog"
                    )
                  }
                  className="SubmitBtn btn"
                >
                  Exort My Catalog
                </button>
              )}
              {/* <button type="submit" className="SubmitBtn btn">
            Search
          </button> */}
              <button
                type="button"
                className="SubmitBtn btn"
                onClick={() => {
                  if (loggedUser?.userCode === "buyer") {
                    // axiosMain.post("/preauction/Buyer/AddToMyCatalog")
                    formik.values.sessionStartTime = timeData
                      ?.split(" - ")
                      ?.at(0);
                    formik.values.sessionEndTime = timeData?.split(" - ")[1];

                    axiosMain
                      .post(
                        `/preauction/${baseUrlEngBuyer}/GetMyCatalog?role=` +
                        roleCode,
                        baseUrlEngBuyer === "Buyer"
                          ? {
                            season: formik.values.season,
                            saleNo: parseInt(formik.values.saleNo),
                            auctionDate: formik.values.auctionDate,
                            buyerId: userId,
                            // userId: formik.values.auctioneer,
                            sessionTime: formik.values.sessionTime,
                            teaTypeId: formik.values.teaType,
                            categoryId: formik.values.category,
                            sessionStartTime: formik.values.sessionStartTime,
                            sessionEndTime: formik.values.sessionEndTime,
                            auctionCenterId: auctionCenterId,
                          }
                          : {
                            season: formik.values.season,
                            saleNo: parseInt(formik.values.saleNo),
                            auctionDate: formik.values.auctionDate,
                            buyerId: userId,
                            // userId: formik.values.auctioneer,
                            sessionTime: formik.values.sessionTime,
                            teaTypeId: formik.values.teaType,
                            categoryId: formik.values.category,
                            sessionStartTime: formik.values.sessionStartTime,
                            sessionEndTime: formik.values.sessionEndTime,
                            auctionCenterId: auctionCenterId,
                            gradeId:
                              formik.values.grade === ""
                                ? 0
                                : parseInt(formik.values.grade),
                            markId:
                              formik.values.mark === ""
                                ? 0
                                : parseInt(formik.values.mark),
                          }
                      )
                      .then((res) => {
                        if (res.data.statusCode === 200) {
                          CustomToast.success(res.data.message);

                          let data = res.data?.responseData?.map((ele) => {
                            return {
                              ...ele,
                              gpDate: formatDateToDdMmYy(ele.gpDate),
                              auctionDate: formatDateToDdMmYy(ele.auctionDate),
                            };
                          });

                          setMyCatalogRows(data);
                          setSelectedData([]);
                          setSelectedDataMyCatalogdata([]);
                          //set session type id
                          setsessionTypeId(
                            res.data?.responseData[0]?.sessionTypeId
                          );
                        } else {
                          CustomToast.error(res.data.message);
                          setMyCatalogRows([]);
                        }
                      });

                    // console.log(KutchaCatalogId);
                  } else {
                    if (formik.values.saleNo !== "") {
                      formik.values.sessionStartTime = formik.values.sessionTime
                        ?.at(0)
                        ?.SessionTime?.split(" - ")
                        ?.at(0);
                      formik.values.sessionEndTime = formik.values.sessionTime
                        ?.at(0)
                        ?.SessionTime?.split(" - ")[1];
                      console.log(formik.values);
                      axiosMain
                        .post(
                          `/preauction/${baseUrlEng}/GetMyCatalog?role=` +
                          roleCode,
                          {
                            season: formik.values.season,
                            saleNo: parseInt(formik.values.saleNo),
                            auctionDate: formik.values.auctionDate,
                            // auctioneerId: formik.values.auctioneer,

                            auctioneerId: userId,
                            auctionCenterId: auctionCenterId,
                            userId: userId,
                            // userId: formik.values.auctioneer,
                            teaTypeId: formik.values.teaType,
                            categoryId: formik.values.category,
                            sessionStartTime: formik.values.sessionStartTime,
                            sessionEndTime: formik.values.sessionEndTime,
                          }
                        )
                        .then((res) => {
                          if (res.data.statusCode === 200) {
                            CustomToast.success(res.data.message);
                            let data = res.data?.responseData?.map((ele) => {
                              return {
                                ...ele,
                                saleDate: formatDateToDdMmYy(ele.saleDate),
                                gpDate: formatDateToDdMmYy(ele.gpDate),
                              };
                            });
                            setMyCatalogRows(data);
                          } else {
                            CustomToast.error(res.data.message);
                          }
                        });
                    }
                  }
                }}
              >
                My Catalog
              </button>

              {modalRight?.includes("42") && (
                <button
                  type="submit"
                  className="SubmitBtn btn"
                  onClick={() => setOpenMyPlanner(true)}
                  disabled={myCatalogRows.length > 0 ? false : true}
                >
                  Create My Planners
                </button>
              )}
            </div>
          ) : (
            <div className="BtnGroup d-flex">
              {modalRight?.includes("9") && (
                <button type="button" className="SubmitBtn btn">
                  Export My Catalog
                </button>
              )}
              {modalRight?.includes("9") && (
                <button
                  type="button"
                  onClick={() =>
                    PrintableTable(
                      loggedUser.userCode.toLowerCase() === "auctioneer" ||
                        loggedUser.userCode.toLowerCase() === "teaboard"
                        ? myCatalogForAuctioneer
                        : myCatalogForBuyer,
                      myCatalogRows?.length > 0 ? myCatalogRows : [],
                      roleCode + "My Catalog"
                    )
                  }
                  className="SubmitBtn btn"
                >
                  Print My Catalog
                </button>
              )}
              {modalRight?.includes("21") && (
                <button
                  type="button"
                  disable
                  className="SubmitBtn btn"
                  onClick={() => {
                    setOpenUploadValuation(true);
                  }}
                >
                  Upload Valuation
                </button>
              )}
              {modalRight?.includes("26") && (
                <button
                  type="button"
                  className="SubmitBtn btn"
                  onClick={() => {
                    if (loggedUser?.userCode === "buyer") {
                      // axiosMain.post("/preauction/Buyer/AddToMyCatalog")
                      formik.values.sessionStartTime = timeData
                        ?.split(" - ")
                        ?.at(0);
                      formik.values.sessionEndTime = timeData?.split(" - ")[1];

                      axiosMain
                        .post(
                          `/preauction/${baseUrlEngBuyer}/GetMyCatalog?role=` +
                          roleCode,
                          baseUrlEngBuyer === "Buyer"
                            ? {
                              season: formik.values.season,
                              saleNo: parseInt(formik.values.saleNo),
                              auctionDate: formik.values.auctionDate,
                              buyerId: userId,
                              // userId: formik.values.auctioneer,
                              sessionTime: formik.values.sessionTime,
                              teaTypeId: formik.values.teaType,
                              categoryId: formik.values.category,
                              sessionStartTime:
                                formik.values.sessionStartTime,
                              sessionEndTime: formik.values.sessionEndTime,
                              auctionCenterId: auctionCenterId,
                            }
                            : {
                              season: formik.values.season,
                              saleNo: parseInt(formik.values.saleNo),
                              auctionDate: formik.values.auctionDate,
                              buyerId: userId,
                              // userId: formik.values.auctioneer,
                              sessionTime: formik.values.sessionTime,
                              teaTypeId: formik.values.teaType,
                              categoryId: formik.values.category,
                              sessionStartTime:
                                formik.values.sessionStartTime,
                              sessionEndTime: formik.values.sessionEndTime,
                              auctionCenterId: auctionCenterId,
                              gradeId:
                                formik.values.grade === ""
                                  ? 0
                                  : parseInt(formik.values.grade),
                              markId:
                                formik.values.mark === ""
                                  ? 0
                                  : parseInt(formik.values.mark),
                            }
                        )
                        .then((res) => {
                          if (res.data.statusCode === 200) {
                            CustomToast.success(res.data.message);
                            setMyCatalogRows(res.data.responseData);
                            setSelectedData([]);
                            setSelectedDataMyCatalogdata([]);
                            //set session type id
                            setsessionTypeId(
                              res.data?.responseData[0]?.sessionTypeId
                            );
                          } else {
                            CustomToast.error(res.data.message);
                            setMyCatalogRows([]);
                          }
                        });

                      // console.log(KutchaCatalogId);
                    } else {
                      if (formik.values.saleNo !== "") {
                        formik.values.sessionStartTime =
                          formik.values.sessionTime
                            ?.at(0)
                            ?.SessionTime?.split(" - ")
                            ?.at(0);
                        formik.values.sessionEndTime = formik.values.sessionTime
                          ?.at(0)
                          ?.SessionTime?.split(" - ")[1];
                        console.log(formik.values);
                        axiosMain
                          .post(
                            `/preauction/${baseUrlEng}/GetMyCatalog?role=` +
                            roleCode,
                            {
                              // axios
                              // .post(
                              //   "http://192.168.100.205:5080/preauction/AuctionCatalog/GetMyCatalog?role=" +
                              //     roleCode,
                              //   {
                              season: formik.values.season,
                              saleNo: parseInt(formik.values.saleNo),
                              auctionDate: formik.values.auctionDate,
                              // auctioneerId: formik.values.auctioneer,

                              auctioneerId: userId,
                              auctionCenterId: auctionCenterId,
                              userId: userId,
                              // userId: formik.values.auctioneer,
                              teaTypeId: formik.values.teaType,
                              categoryId: formik.values.category,
                              sessionStartTime: formik.values.sessionStartTime,
                              sessionEndTime: formik.values.sessionEndTime,
                            }
                          )
                          .then((res) => {
                            if (res.data.statusCode === 200) {
                              CustomToast.success(res.data.message);
                              let data = res.data?.responseData?.map((ele) => {
                                return {
                                  ...ele,
                                  saleDate: formatDateToDdMmYy(ele.saleDate),
                                  gpDate: formatDateToDdMmYy(ele.gpDate),
                                };
                              });
                              setMyCatalogRows(data);
                            } else {
                              CustomToast.error(res.data.message);
                            }
                          });
                      }
                    }
                  }}
                >
                  My Catalog
                </button>
              )}

              <button type="button" className="SubmitBtn btn">
                Save
              </button>
            </div>
          )}
          <Button className="SubmitBtn" onClick={handleExportToPdfMyCatalog}>
            Print
          </Button>
          <div id="table-content" style={{ display: "none" }}>
            {/* <PrintableTable
              columns={
                loggedUser.userCode.toLowerCase() === "auctioneer" ||
                loggedUser.userCode.toLowerCase() === "teaboard"
                  ? myCatalogForAuctioneer
                  : myCatalogForBuyer
              }
              data={myCatalogRows?.length > 0 ? myCatalogRows : []}
            /> */}
          </div>
          <div className="row mt-4">
            <div className="col-12" id="table-content">
              {/* <TableComponent
                columns={
                  loggedUser.userCode.toLowerCase() === "auctioneer" ||
                  loggedUser.userCode.toLowerCase() === "teaboard"
                    ? myCatalogForAuctioneer.map((obj) => ({
                        ...obj,
                        getCellValue: (row) =>
                          obj.name === "action" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenUploadUpdateValuation(true);
                                  axiosMain
                                    .post(
                                      "/preauction/AuctionCatalog/GetMyCatalogValuationByParam",
                                      {
                                        auctionCatalogId: row.auctionCatalogId,
                                        auctioneerId: userId,
                                        auctionCenterId: auctionCenterId,
                                        season: row.Season,
                                        saleNo: row.saleNo,
                                      }
                                    )
                                    .then((res) => {
                                      setGetDataByprems(res.data.responseData);
                                    });
                                }}
                              >
                                <i class="fa fa-edit"></i>
                              </button>
                              {/* <button type="button" onClick={() => setOpenMyPlanner(true)}>
                                  Add Valuation
                                </button> 
                            </>
                          ) : row[obj.name] === null ? (
                            "-"
                          ) : (
                            row[obj.name]
                          ),
                      }))
                    : myCatalogForBuyer.map((obj) => ({
                        ...obj,
                        getCellValue:
                          obj.name === "."
                            ? obj.getCellValue
                            : (row) =>
                                obj.name === "action"
                                  ? row[obj.name]
                                  : row[obj.name] === null
                                  ? "-"
                                  : row[obj.name],
                      }))
                }
                rows={myCatalogRows?.length > 0 ? myCatalogRows : []}
                setRows={setMyCatalogRows}
                addpagination={true}
                dragdrop={false}
                fixedColumnsOn={false}
                resizeingCol={false}
                selectionCol={true}
                sorting={true}
              /> */}
              <Grid
                rows={myCatalogRows?.length > 0 ? myCatalogRows : []}
                columns={
                  loggedUser.userCode.toLowerCase() === "auctioneer" ||
                    loggedUser.userCode.toLowerCase() === "teaboard"
                    ? myCatalogForAuctioneer.map((obj) => ({
                      ...obj,
                      getCellValue: (row) =>
                        obj.name === "action" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenUploadUpdateValuation(true);
                                setauctioncatalogIdforupload(
                                  row.KutchaCatalogId
                                );
                                axiosMain
                                  .post(
                                    `/preauction/${baseUrlEng}/GetMyCatalogValuationByParam?role=` +
                                    roleCode,
                                    // axios
                                    //   .post(
                                    //     "http://192.168.101.178:5080/preauction/AuctionCatalog/GetMyCatalogValuationByParam?role=" +
                                    //       roleCode,
                                    {
                                      KutchaCatalogId: row.KutchaCatalogId,
                                      auctioneerId: userId,
                                      auctionCenterId: auctionCenterId,
                                      season: row.Season,
                                      saleNo: row.saleNo,
                                    }
                                  )
                                  .then((res) => {
                                    setGetDataByprems(res.data.responseData);
                                  });
                              }}
                            >
                              <i class="fa fa-edit"></i>
                            </button>
                            {/* <button type="button" onClick={() => setOpenMyPlanner(true)}>
                            Add Valuation
                          </button> */}
                          </>
                        ) : row[obj.name] === null ? (
                          "-"
                        ) : (
                          row[obj.name]
                        ),
                    }))
                    : myCatalogForBuyer.map((obj) => ({
                      ...obj,
                      //   getCellValue:
                      //     obj.name === "."
                      //       ? obj.getCellValue
                      //       : (row) =>
                      //           obj.name === "action"
                      //             ? row[obj.name]
                      //             : row[obj.name] === null
                      //             ? "-"
                      //             : row[obj.name],
                      // }))
                      getCellValue: (row) =>
                        obj.name === "action" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenUploadUpdateValuation(true);
                                setGetDataByprems(row);
                              }}
                            >
                              <i class="fa fa-edit"></i>
                            </button>
                            {/* <button type="button" onClick={() => setOpenMyPlanner(true)}>
                            Add Valuation
                          </button> */}
                          </>
                        ) : row[obj.name] === null ? (
                          "-"
                        ) : (
                          row[obj.name]
                        ),
                    }))
                }
              >
                {loggedUser?.userCode === "buyer" ? (
                  <SelectionState
                    selection={selectedDataMyCatalogdata}
                    onSelectionChange={setSelectedDataMyCatalogdata}
                  />
                ) : (
                  ""
                )}
                <PagingState defaultCurrentPage={0} pageSize={6} />
                {loggedUser?.userCode === "buyer" ? (
                  <IntegratedSelection />
                ) : (
                  ""
                )}
                <IntegratedPaging />
                <Table />
                <TableHeaderRow />
                {loggedUser?.userCode === "buyer" ? (
                  <TableSelection showSelectAll />
                ) : (
                  ""
                )}
                <PagingPanel />
              </Grid>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <CreatePlanner
        openMyPlanner={openMyPlanner}
        setOpenMyPlanner={setOpenMyPlanner}
        myCatalogDetails={formik.values}
        isEdit={isEdit}
        editData={editData}
        saleProgramId={saleProgramId}
        sessionTypeId={sessionTypeId}
        modalRight={modalRight}
        baseUrlEngBuyer={baseUrlEngBuyer}
      />
      <UploadValuation
        openUploadValuation={openUploadValuation}
        setOpenUploadValuation={setOpenUploadValuation}
        auctionCatalogDetail={formik.values}
        loggedUser={loggedUser}
        setMyCatalogRows={setMyCatalogRows}
        timeData={timeData}
        baseUrlEng={roleCode === "BUYER" ? baseUrlEngBuyer : baseUrlEng}
        kuchacatalogValuaction={false}
      />
      <UpdateValuation
        openUploadUpdateValuation={openUploadUpdateValuation}
        setOpenUploadUpdateValuation={setOpenUploadUpdateValuation}
        getDataByPrems={getDataByPrems}
        auctionCatalogDetail={formik.values}
        setGetDataByprems={setGetDataByprems}
        auctioncatalogIdforupload={auctioncatalogIdforupload}
        baseUrlEng={roleCode === "BUYER" ? baseUrlEngBuyer : baseUrlEng}
      />
      <DeleteConfirmationModal
        show={openDelete}
        title={"Are you sure you want to remove ?"}
        onDelete={() => {
          if (loggedUser?.userCode === "buyer") {
            let MyCatalogId = "";

            selectedDataMyCatalogdata
              .map((ele) => myCatalogRows[ele])
              .map(
                (ele) =>
                (MyCatalogId =
                  MyCatalogId === ""
                    ? ele.MyCatalogId?.toString()
                    : MyCatalogId + "," + ele.MyCatalogId?.toString())
              );
            axiosMain
              .post(`/preauction/${baseUrlEngBuyer}/RemoveFromMyCatalog`, {
                myCatalogIds: MyCatalogId,
                buyerId: userId,
                auctionCenterId: auctionCenterId,
              })
              .then((res) => {
                if (res.data.statusCode === 200) {
                  CustomToast.success(res.data.message);
                  formik.values.sessionStartTime = timeData
                    ?.split(" - ")
                    ?.at(0);
                  formik.values.sessionEndTime = timeData?.split(" - ")[1];

                  axiosMain
                    .post("/preauction/Buyer/GetMyCatalog?role=" + roleCode, {
                      season: formik.values.season,
                      saleNo: parseInt(formik.values.saleNo),
                      auctionDate: formik.values.auctionDate,
                      buyerId: userId,
                      // userId: formik.values.auctioneer,
                      sessionTime: formik.values.sessionTime,
                      teaTypeId: formik.values.teaType,
                      categoryId: formik.values.category,
                      sessionStartTime: formik.values.sessionStartTime,
                      sessionEndTime: formik.values.sessionEndTime,
                      auctionCenterId: auctionCenterId,
                    })
                    .then((res) => {
                      if (res.data.statusCode === 200) {
                        CustomToast.success(res.data.message);
                        setMyCatalogRows(res.data.responseData);
                        setSelectedData([]);
                        setSelectedDataMyCatalogdata([]);
                        //set session type id
                        setsessionTypeId(
                          res.data?.responseData[0]?.sessionTypeId
                        );
                      } else {
                        CustomToast.error(res.data.message);
                        setMyCatalogRows([]);
                      }
                    });
                  setSelectedData([]);
                } else {
                  CustomToast.error(res.data.message);
                  setSelectedData([]);
                }
              });
          }
          setOpenDelete(false);
        }}
        onHide={() => setOpenDelete(false)}
      />
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
          pageName={"Auction catalog"}
        />
      </Modals>
      {/* MODAL PRINT */}
      <Modals
        size="l"
        title="Select For Print"
        show={openPrintModelMyCatalog}
        handleClose={() => {
          setopenPrintModelMyCatalog(false);
        }}
      >
        <PrintInvoice
          fields={[]}
          showcheckboxlebels={columndatamycatalog}
          rows={printMyrow.length > 0 ? printMyrow : []}
          pageName={"My catalog"}
        />
      </Modals>
    </div>
  );
};

export default AuctionCatalog;
