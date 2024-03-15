import React, { useState, useEffect } from "react";
import TableComponent from "../../../components/tableComponent/TableComponent";
import { fetchSaleNumbersRequest, teaTypeAction } from "../../../store/actions";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import axiosMain from "../../../http/axios/axios_main";
import CreatePlanner from "./CreatePlanner";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
import CustomToast from "../../../components/Toast";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";

// console.log(loggedUser, "loggedUserloggedUser");

const AuctionCatalog = () => {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
  } = useAuctionDetail();
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
  const [searchwedValue, setSearchedValue] = useState({});
  const [openUploadValuation, setOpenUploadValuation] = useState(false);
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(sessionStorage.getItem("User"))
  );

  const { printContent } = usePrint();

  const teaType = useSelector(
    (state) => state.teaType.teaTypeList.responseData
  );

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      season: new Date().getFullYear()?.toString(),
      saleNo: "",
      auctionDate: "",
      auctioneer: "",
      teaType: "",
      category: "",
      sessionTime: sessionTime,
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
      values.sessionStartTime = sessionTime[0]?.SessionTime?.split(" - ")[0];
      values.sessionEndTime = sessionTime[0]?.SessionTime?.split(" - ")[1];
      // let data = [...sessionTime];

      // console.log([...sessionTime, values], values, "sessionTime");
      if (loggedUser?.userCode === "buyer") {
        axiosMain
          .post(
            "preauction/Buyer/GetBuyerAuctionCatalog",
            values.map((ele) => {
              let data = {
                ...ele,
                auctioneerId: userId, //auctioner
                auctionCenterId: auctionCenterId,
              };
              return data;
            })
          )
          .then((res) => {
            if (res.data.statusCode === 200) {
              CustomToast.success(res.data.message);
              setRows(res.data.responseData);
            } else {
              CustomToast.error(res.data.message);
            }
          });
      } else {
        axiosMain
          .post("/preauction/AuctionCatalog/GetAuctionCatalog", values)
          .then((res) => {
            if (res.data.statusCode === 200) {
              CustomToast.success(res.data.message);
              setRows(res.data.responseData);
            } else {
              CustomToast.error(res.data.message);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  });

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
  }, []);
  useEffect(() => {
    // setRows(sellPrograms);
    if (saleNumber?.length > 0) {
      setSaleNo(saleNumber);
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
        .post("/preauction/Common/BindAuctionDate", {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            formik.setFieldValue(
              "auctionDate",
              res.data.responseData?.at(0)?.saleDate
            );
            setAuctionDates(res.data.responseData);
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
            formik.setFieldValue(
              "auctioneer",
              res.data.responseData?.at(0)?.userId
            );
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
            formik.setFieldValue(
              "teaType",
              res.data.responseData?.at(0)?.teatypeid
            );
            setTeaType(res.data.responseData);
          } else {
            setTeaType([]);
          }
        });
    } else {
      setAuctioneer([]);
      setAuctionDates([]);
      setTeaType([]);
    }
  }, [formik.values.saleNo]);

  useEffect(() => {
    console.log(formik.values.auctioneer);
    if (auctioneer.length > 0 && parseInt(formik.values.auctioneer) > 0) {
      axiosMain
        .post("/preauction/Common/BindCatagoryByParam", {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          AuctioneerId: parseInt(formik.values.auctioneer),
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            formik.setFieldValue(
              "category",
              res.data.responseData?.at(0)?.categoryId
            );
            setCategory(res.data.responseData);
          } else {
            setCategory([]);
          }
        });
    } else {
      setCategory([]);
    }
  }, [auctioneer, formik.values.auctioneer]);

  useEffect(() => {
    if (parseInt(formik.values.auctionDate) > 0) {
      axiosMain
        .post("/preauction/Common/BindSessionTime", {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          auctionDate: formik.values.auctionDate,
          auctionCenterId: auctionCenterId,
          // sessionTypeId: 2,
          sessionTypeName: "Price Rediscovery Session",
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            formik.setFieldValue(
              "sessionTime",
              res.data.responseData?.at(0)?.sessionTime
            );
            formik.setFieldValue(
              "sessionStartTime",
              res.data.responseData?.at(0)?.sessionTime?.split("-")[0]
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
  }, [auctionDates, formik.values.auctionDate]);

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
  const sellProgramsForAuctioneer = [
    { title: "Lot No.", name: "LotNo" },
    { title: "Mark", name: "markName" },
    { title: "Invoice No.", name: "invoiceNo" },
    { title: "Grade", name: "gradeName" },
    { title: "No. of Packages", name: "noOfPackages" },
    { title: "Base Price", name: "basePrice" },
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
    { title: "Invoice Weight", name: "invoiceQty" },
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
    { title: "System Base Price", name: "SystemBasePrice" },
    { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
    // { title: "Lot Comments", name: "lotComments" },
  ];
  const sellProgramsForBuyer = [
    {
      title: "",
      name: "",
      getCellValue: ({ ...row }) => (
        <>
          <input
            type="checkbox"
            checked={selectedData.some(
              (selectedRow) =>
                selectedRow.KutchaCatalogId === row.KutchaCatalogId
            )}
            onChange={() => handleCheckboxChange(row)}
          />
        </>
      ),
    },

    { title: "Lot No.", name: "LotNo" },
    { title: "Mark", name: "markName" },
    { title: "Invoice No.", name: "invoiceNo" },
    { title: "Grade", name: "gradeName" },
    { title: "No. of Packages", name: "noOfPackages" },
    { title: "Base Price", name: "basePrice" },
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
    { title: "Invoice Weight", name: "invoiceQty" },
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
    { title: "System Base Price", name: "SystemBasePrice" },
    { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
    // { title: "Lot Comments", name: "lotComments" },
  ];
  const myCatalogForBuyer = [
    {
      title: ".",
      name: ".",
      getCellValue: ({ ...row }) => (
        <>
          <input
            type="checkbox"
            onClick={() => setSelectedData([...selectedData, row])}
          />
        </>
      ),
    },
    { title: "Season", name: "Season" },
    { title: "Sale No.", name: "saleNo" },
    { title: "Auction Date", name: "auctionDate" },
    { title: "Tea Type", name: "teaTypeName" },
    { title: "Category", name: "categoryName" },
    { title: "Session Time", name: "sessionTime" },
    { title: "Lot No.", name: "LotNo" },
    { title: "Invoice No.", name: "invoiceNo" },
    { title: "Origin", name: "Origin" },
    { title: "Tea Type", name: "teaTypeName" },
    { title: "Sub Type", name: "subTeaTypeName" },
    { title: "Category", name: "categoryName" },
    { title: "Mark", name: "markName" },
    { title: "Grade", name: "gradeName" },
    // { title: "Group Code", name: "groupCode" },
    { title: "No. of Packages", name: "noOfPackages" },
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
    { title: "System Base Price", name: "SystemBasePrice" },
    { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
    // { title: "My Comments", name: "myComments" },
    // { title: "My Valuation", name: "myValuation" },

    // { title: "Short accses Weight", name: "shortAccsesWeight" },
  ];

  const myCatalogForAuctioneer = [
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
    { title: "Auction Date", name: "auctionDate" },
    { title: "Tea Type", name: "teaTypeName" },
    { title: "Category", name: "categoryName" },
    { title: "Session Time", name: "sessionTime" },
    { title: "Lot No.", name: "LotNo" },
    { title: "Invoice No.", name: "invoiceNo" },
    { title: "Origin", name: "Origin" },
    { title: "Tea Type", name: "teaTypeName" },
    { title: "Sub Type", name: "subTeaTypeName" },
    { title: "Category", name: "categoryName" },
    { title: "Mark", name: "markName" },
    { title: "Grade", name: "gradeName" },
    // { title: "Group Code", name: "groupCode" },
    { title: "No. of Packages", name: "noOfPackages" },
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
    { title: "System Base Price", name: "SystemBasePrice" },
    { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
    // { title: "My Comments", name: "myComments" },
    // { title: "My Valuation", name: "myValuation" },

    // { title: "Short accses Weight", name: "shortAccsesWeight" },
  ];

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    // setDisable(false);
    // setIsEdit(false);
  };

  return (
    <div>
      <Accordion
        expanded={expandedTab === "panel1" || expandedTab === "All"}
        onChange={handleAccordionChange("panel1")}
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
                    <option value={0}>All</option>

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
                    name="auctioneer"
                    className="form-control select-form"
                    onChange={formik.handleChange}
                    value={formik.values.auctioneer}
                  >
                    {auctioneer?.length > 0 ? (
                      auctioneer?.map((item, index) => (
                        <option value={item.userId} key={item.userId}>
                          {item.userName}
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
                    <option value="">All</option>
                    {category?.length > 0 ? (
                      category?.map((item, index) => (
                        <option value={item.categoryId} key={item.categoryId}>
                          {item.categoryName}
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
            </div>

            <div className="row mt-4">
              <div className="col-lg-auto">
                <button
                  type="submit"
                  className="SubmitBtn btn"
                  // onClick={formik.handleSubmit}
                >
                  Refresh
                </button>
              </div>
              <div className="col-lg-auto">
                <button type="button" className="SubmitBtn btn">
                  Clear
                </button>
              </div>

              <div className="col-lg-auto">
                <button
                  type="button"
                  className="SubmitBtn btn"
                  onClick={() => {
                    if (loggedUser?.userCode === "buyer") {
                      // axiosMain.post("/preauction/Buyer/AddToMyCatalog")
                      formik.values.sessionStartTime =
                        sessionTime[0]?.SessionTime?.split(" - ")[0];
                      formik.values.sessionEndTime =
                        sessionTime[0]?.SessionTime?.split(" - ")[1];

                      axiosMain
                        .post(
                          "/preauction/Buyer/GetMyCatalog?role=" + roleCode,
                          {
                            season: formik.values.season,
                            saleNo: parseInt(formik.values.saleNo),
                            auctionDate: formik.values.auctionDate,
                            auctioneerId: formik.values.auctioneer,
                            // userId: formik.values.auctioneer,
                            teaTypeId: formik.values.teaType,
                            categoryId: formik.values.category,
                            sessionStartTime: formik.values.sessionStartTime,
                            sessionEndTime: formik.values.sessionEndTime,
                            auctionCenterId: auctionCenterId,
                          }
                        )
                        .then((res) => {
                          if (res.data.statusCode === 200) {
                            CustomToast.success(res.data.message);
                            setMyCatalogRows(res.data.responseData);
                          } else {
                            CustomToast.error(res.data.message);
                          }
                        });

                      // console.log(KutchaCatalogId);
                    } else {
                      if (formik.values.saleNo !== "") {
                        formik.values.sessionStartTime =
                          sessionTime[0]?.SessionTime?.split(" - ")[0];
                        formik.values.sessionEndTime =
                          sessionTime[0]?.SessionTime?.split(" - ")[1];
                        console.log(formik.values);
                        axiosMain
                          .post(
                            "/preauction/AuctionCatalog/GetMyCatalog?role=" +
                              roleCode,
                            {
                              season: formik.values.season,
                              saleNo: parseInt(formik.values.saleNo),
                              auctionDate: formik.values.auctionDate,
                              auctioneerId: formik.values.auctioneer,
                              userId: formik.values.auctioneer,
                              teaTypeId: formik.values.teaType,
                              categoryId: formik.values.category,
                              sessionStartTime: formik.values.sessionStartTime,
                              sessionEndTime: formik.values.sessionEndTime,
                            }
                          )
                          .then((res) => {
                            if (res.data.statusCode === 200) {
                              CustomToast.success(res.data.message);
                              setMyCatalogRows(res.data.responseData);
                            } else {
                              CustomToast.error(res.data.message);
                            }
                          });
                      }
                    }
                  }}
                >
                  Get My Catalog
                </button>
              </div>
            </div>
          </form>

          <div className="row mt-4">
            <div className="col-12">
              <TableComponent
                columns={
                  loggedUser?.userCode === "buyer"
                    ? sellProgramsForBuyer
                    : sellProgramsForAuctioneer
                }
                rows={rows?.length > 0 ? rows : []}
                setRows={setRows}
                addpagination={true}
                dragdrop={false}
                fixedColumnsOn={false}
                resizeingCol={false}
                selectionCol={true}
                sorting={true}
              />
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
          />
        </div>
      ) : (
        ""
      )}
      <Accordion
        expanded={expandedTab === "panel2" || expandedTab === "All"}
        onChange={handleAccordionChange("panel2")}
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
              <button
                type="button"
                className="SubmitBtn btn"
                onClick={() => {
                  if (loggedUser?.userCode === "buyer") {
                    let KutchaCatalogId = "";

                    selectedData.map(
                      (ele) =>
                        (KutchaCatalogId =
                          KutchaCatalogId === ""
                            ? ele.KutchaCatalogId.toString()
                            : KutchaCatalogId +
                              "," +
                              ele.KutchaCatalogId.toString())
                    );

                    axiosMain
                      .post("/preauction/AuctionCatalog/RemoveFromMyCatalog", {
                        kutchaCatalogIds: KutchaCatalogId,
                        buyerId: userId,
                        auctionCenterId: auctionCenterId,
                      })
                      .then((res) => {
                        if (res.data.statusCode === 200) {
                          CustomToast.success(res.data.message);
                          setSelectedData([]);
                        } else {
                          CustomToast.error(res.data.message);
                          setSelectedData([]);
                        }
                      });
                  }
                }}
              >
                Remove lots
              </button>

              <button type="button" className="SubmitBtn btn">
                Save My Catalog
              </button>
              <button
                type="button"
                onClick={() => printContent("table-content")}
                className="SubmitBtn btn"
              >
                Exort My Catalog
              </button>
            </div>
          ) : (
            <div className="BtnGroup d-flex">
              <button type="button" className="SubmitBtn btn">
                Export My Catalog
              </button>

              <button
                type="button"
                onClick={() => printContent("table-content")}
                className="SubmitBtn btn"
              >
                Print My Catalog
              </button>
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
              <button type="button" className="SubmitBtn btn">
                Save
              </button>
            </div>
          )}

          <div id="table-content" style={{ display: "none" }}>
            <PrintableTable
              columns={
                loggedUser.userCode.toLowerCase() === "auctioneer" ||
                loggedUser.userCode.toLowerCase() === "teaboard"
                  ? myCatalogForAuctioneer
                  : myCatalogForBuyer
              }
              data={myCatalogRows?.length > 0 ? myCatalogRows : []}
            />
          </div>
          <div className="row mt-4">
            <div className="col-12" id="table-content">
              <TableComponent
                columns={
                  loggedUser.userCode.toLowerCase() === "auctioneer" ||
                  loggedUser.userCode.toLowerCase() === "teaboard"
                    ? myCatalogForAuctioneer
                    : myCatalogForBuyer
                }
                rows={myCatalogRows?.length > 0 ? myCatalogRows : []}
                setRows={setMyCatalogRows}
                addpagination={true}
                dragdrop={false}
                fixedColumnsOn={false}
                resizeingCol={false}
                selectionCol={true}
                sorting={true}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <CreatePlanner
        openMyPlanner={openMyPlanner}
        setOpenMyPlanner={setOpenMyPlanner}
        myCatalogDetails={formik.values}
      />
      <UploadValuation
        openUploadValuation={openUploadValuation}
        setOpenUploadValuation={setOpenUploadValuation}
        auctionCatalogDetail={formik.values}
        loggedUser={loggedUser}
      />
    </div>
  );
};

export default AuctionCatalog;
