/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import {
  fetchAuctionRequest,
  fetchGradeRequest,
  fetchMarkRequest,
  getAllCategoriesAction,
  getAllTeaTypes,
  getBuyer,
  fetchUser,
  getAllTaxInvoiceAction,
  getAllTaxInvoiceBuyerAction,
  getAllTaxInvoiceGenAction,
  getAllTaxInvoiceSaleAction,
  getAllTaxInvoiceLotAction,
  getAllTaxInvoiceSessionAction,
  getAllTaxInvoiceActionSuccess,
  getExportData,
  getExportDataApiCall,
  getAllTaxInvoiceSaleActionSuccess,
  getAllTaxInvoiceLotActionSuccess,
  getAllTaxInvoiceBuyerActionSuccess,
  getInvoicenotGenAction,
  InvoiceApiStatus,
} from "../../store/actions";
import { useSelector } from "react-redux";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { Card, Form, Modal, Button } from "react-bootstrap";
import TableComponent from "../../components/tableComponent/TableComponent";
import Checkbox from "@mui/material/Checkbox";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosMain from "../../http/axios/axios_main";
import CustomToast from "../../components/Toast";
import { toast } from "react-toastify";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { NO_OF_RECORDS } from "../../constants/commonConstants";

let pageNo = 1;

function TaxInvoice({ modalRight }) {
  const seasonYear = moment().year();
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 6; i++) {
    const year = currentYear - i;
    years.push(year);
  }
  const tableRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [viewData, setviewData] = useState([]);
  const handlecatId = () => setcatshowmodal(false);
  const [totPkg, settotPkg] = useState(0);
  const [totqty, settotqty] = useState(0);
  const [totvalue, settotvalue] = useState(0);
  const [allTeaTypeList, setallTeaTypeList] = useState([]);
  const [allGrade, setallGrade] = useState([]);
  const [message, setMessage] = useState("");
  const [allMarkList, setallMarkList] = useState([]);
  const [allAuctionCenterList, setallAuctionCenterList] = useState([]);
  const [allCategory, setallCategory] = useState([]);
  const [season, setSeason] = useState(seasonYear);
  const [allBuyer, setallBuyer] = useState([]);
  const [catshowmodal, setcatshowmodal] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [exportType, setexportType] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);

  const [TaxInvoiceSearch, setTaxInvoiceSearch] = useState({
    season: season + "",
    saleNo: "",
    centerId: null,
    teaType: null,
    category: null,
    auctionDate: null,
    sessionTime: null,
    mark: null,
    userName: null,
    buyersPromptDate: null,
    lotNo: null,
    auctionCentre: null,
    einvoiceEligibility: null,
    bilingType: null,
    flag: "1",
  });

  const Validate = () => {
    let isValid = true;

    if (!TaxInvoiceSearch.auctionCentre) {
      CustomToast.error("Please select AuctionCenter");
      isValid = false;
    }

    if (!TaxInvoiceSearch.saleNo) {
      CustomToast.error("Please select sale no");
      isValid = false;
    }

    if (TaxInvoiceSearch.teaType == "") {
      TaxInvoiceSearch.teaType = null;
    }
    if (TaxInvoiceSearch.category == "") {
      TaxInvoiceSearch.category = null;
    }
    if (TaxInvoiceSearch.auctionDate == "") {
      TaxInvoiceSearch.auctionDate = null;
    }
    if (TaxInvoiceSearch.sessionTime == "") {
      TaxInvoiceSearch.sessionTime = null;
    }
    if (TaxInvoiceSearch.buyerName == "") {
      TaxInvoiceSearch.buyerName = null;
    }
    if (TaxInvoiceSearch.buyerPromptDate == "") {
      TaxInvoiceSearch.buyerPromptDate = null;
    }
    if (TaxInvoiceSearch.lotNo == "") {
      TaxInvoiceSearch.lotNo = null;
    }
    if (TaxInvoiceSearch.auctionCentre == "") {
      TaxInvoiceSearch.auctionCentre = null;
    }
    if (TaxInvoiceSearch.centerId == "") {
      TaxInvoiceSearch.centerId = null;
    }
    if (TaxInvoiceSearch.auctionCenterId == "") {
      TaxInvoiceSearch.auctionCenterId = null;
    }
    if (TaxInvoiceSearch.einvoiceEligibility == "") {
      TaxInvoiceSearch.einvoiceEligibility = null;
    }
    if (TaxInvoiceSearch.status == "") {
      TaxInvoiceSearch.status = null;
    }
    if (TaxInvoiceSearch.bilingType == "") {
      TaxInvoiceSearch.bilingType = null;
    }
    if (TaxInvoiceSearch.mark == "") {
      TaxInvoiceSearch.mark = null;
    }

    return isValid;
  };

  const SearchViewDealBook = (e) => {
    e.preventDefault();
    if (Validate()) {
      getAllTaxInvoiceAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS });
    } else {
      console.log("Validation failed");
    }
  };
  const searchData = (e) => {
    e.preventDefault();
    if (Validate()) {
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        pageNo = 1;
        setRows([]);
        fetchData();
      }, 1000);
    }
  };

  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      getAllTaxInvoiceAction({
        season: TaxInvoiceSearch.season,
        saleNo: TaxInvoiceSearch.saleNo,
        centerId: TaxInvoiceSearch.auctionCentre,
        auctionDate: TaxInvoiceSearch.auctionDate,
        sessionTime: TaxInvoiceSearch.sessionTime,
        buyerPromptDate: TaxInvoiceSearch.buyerPromptDate,
        lotNo: TaxInvoiceSearch.Lot,
        teaType: TaxInvoiceSearch.teaType,
        category: TaxInvoiceSearch.category,
        InvoiceEligibility: TaxInvoiceSearch.einvoiceEligibility,
        mark: TaxInvoiceSearch.mark,
        buyerName: TaxInvoiceSearch.buyerName,
        BillingType: TaxInvoiceSearch.bilingType,
        flag: "1",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };

  const fetchData = () => {
    dispatch(
      getAllTaxInvoiceAction({
        season: TaxInvoiceSearch.season,
        saleNo: TaxInvoiceSearch.saleNo,
        centerId: TaxInvoiceSearch.auctionCentre,
        auctionDate: TaxInvoiceSearch.auctionDate,
        sessionTime: TaxInvoiceSearch.sessionTime,
        buyerPromptDate: TaxInvoiceSearch.buyerPromptDate,
        lotNo: TaxInvoiceSearch.Lot,
        teaType: TaxInvoiceSearch.teaType,
        category: TaxInvoiceSearch.category,
        InvoiceEligibility: TaxInvoiceSearch.einvoiceEligibility,
        mark: TaxInvoiceSearch.mark,
        buyerName: TaxInvoiceSearch.buyerName,
        BillingType: TaxInvoiceSearch.bilingType,
        flag: "1",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };

  const allTeaType = useSelector(
    (state) => state?.teaTypeManage?.allTeaTypes?.responseData
  );
  const getAllAuctionCenterList = useSelector(
    (res) => res?.warehouseUserRegistration?.auctionCenter?.responseData
  );
  const markList = useSelector((state) => state.mark.data.responseData);

  console.log("markList", markList);

  const allActiveCategory = useSelector(
    (state) => state?.categoryManage?.allCategories?.responseData
  );
  const grades = useSelector((state) => state.grade.data.responseData);

  let saleList = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoiceSale?.responseData
  );

  const LotList = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoiceLot?.responseData
  );

  const sessionList = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoiceSession?.responseData
  );

  const BuyerList = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoiceBuyer?.responseData
  );

  let getAllTaxInvoiceResponseAllData = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoice
  );

  let getAllTaxInvoiceResponse = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoice?.responseData
  );

  useEffect(() => {
    const newRows = getAllTaxInvoiceResponse || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      if (newRows.length > 0) {
        const index = currentRows.findIndex(
          (row) => row.dealBookId === newRows[0].dealBookId
        );

        if (index !== -1) {
          currentRows[index] = newRows[0];
          return currentRows;
        } else {
          return [...currentRows, ...newRows];
        }
      } else {
        return currentRows;
      }
    });
  }, [getAllTaxInvoiceResponse]);
  useEffect(() => {
    if (getAllTaxInvoiceResponse && Array.isArray(getAllTaxInvoiceResponse)) {
      let totalpackagesvalue = 0;
      let totalqtyvalue = 0;
      let totalvalue = 0;

      for (let i = 0; i < getAllTaxInvoiceResponse.length; i++) {
        const taxInvoice = getAllTaxInvoiceResponse[i];

        const dealPrice = parseFloat(taxInvoice.dealPrice);
        const qtyReceived = parseInt(taxInvoice.qtyReceived);

        if (!isNaN(dealPrice) && !isNaN(qtyReceived)) {
          const product = dealPrice * qtyReceived;

          totalvalue += product;
        }

        totalpackagesvalue += parseInt(taxInvoice.totalPackages) || 0;
        totalqtyvalue += parseInt(taxInvoice.qtyReceived) || 0;
      }

      settotPkg(totalpackagesvalue);
      settotqty(totalqtyvalue);
      settotvalue(totalvalue);
    }
  }, [getAllTaxInvoiceResponse]);

  const getData = useSelector(
    (state) => state?.createRegistrtion?.getAllUserActionSuccess?.responseData
  );

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      season: TaxInvoiceSearch.season,
      saleNo: TaxInvoiceSearch.saleNo,
      centerId: TaxInvoiceSearch.auctionCentre,
      auctionDate: TaxInvoiceSearch.auctionDate,
      sessionTime: TaxInvoiceSearch.sessionTime,
      buyerPromptDate: TaxInvoiceSearch.buyerPromptDate,
      lotNo: TaxInvoiceSearch.Lot,
      teaType: TaxInvoiceSearch.teaType,
      category: TaxInvoiceSearch.category,
      InvoiceEligibility: TaxInvoiceSearch.einvoiceEligibility,
      mark: TaxInvoiceSearch.mark,
      buyerName: TaxInvoiceSearch.buyerName,
      // auctionCentre: TaxInvoiceSearch.auctionCenterId,
      BillingType: TaxInvoiceSearch.bilingType,
      flag: "1",
      url: "/postauction/buyertaxinvoice/search",
      exportType: exportType,
      isExport: 1,
    };
    setexportType(exportType);
    dispatch(getExportData(searchData));
  };

  const getExportDataResponse = useSelector(
    (state) => state.documentReducer.exportData.responseData?.exported_file
  );

  const getExportDataApiCallResponse = useSelector(
    (state) => state.documentReducer.exportDataApiCall
  );
  const getApiStatus = useSelector(
    (state) => state.BuyerTaxInvoice.InvoiceApiStatus
  );

  useEffect(() => {
    if (getExportDataResponse != null && true == getExportDataApiCallResponse) {
      dispatch(getExportDataApiCall(false));
      if ("excel" == exportType) {
        Base64ToExcelDownload(
          getExportDataResponse,
          "BuyerTaxInvoiceDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "BuyerTaxInvoiceDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const InvoiceGens = () => {
    let selectedBuyer = [];
    getAllTaxInvoiceResponse &&
      getAllTaxInvoiceResponse.forEach((viewTaxInvoiceData) => {
        if (
          viewTaxInvoiceData &&
          viewTaxInvoiceData.isSelected &&
          true === viewTaxInvoiceData.isSelected
        ) {
          selectedBuyer.push({
            dealBookId: viewTaxInvoiceData.dealBookId,
            northOrsouth: viewTaxInvoiceData.northOrsouth,
          });
        }
      });
    if (selectedBuyer.length === 0) {
      toast.error("Please select at least one data to generate Invoice");
      return;
    }
    const selectedRecord = selectedBuyer[0];
    let payloadData = {
      dealBookId: selectedRecord.dealBookId,
      northOrsouth: selectedRecord.northOrsouth,
    };

    dispatch(getInvoicenotGenAction(payloadData));
  };

  useEffect(() => {
    if (getApiStatus == true) {
      dispatch(InvoiceApiStatus(false));
      setcatshowmodal(true);
    }
  }, [getApiStatus]);

  const InvoiceGen = () => {
    if (
      TaxInvoiceSearch.category == "" ||
      TaxInvoiceSearch.category == null ||
      TaxInvoiceSearch.category == undefined
    ) {
      setCategoryError("Please select a category.");
    } else {
      setConfirmationModalVisible(true);
    }
  };

  const handleConfirm = (confirmed) => {
    if (confirmed) {
      let selectedBuyer = [];
      getAllTaxInvoiceResponse &&
        getAllTaxInvoiceResponse.map(
          (viewTaxInvoiceData, viewTaxInvoiceDataIndex) => {
            if (
              viewTaxInvoiceData &&
              viewTaxInvoiceData.isSelected &&
              true == viewTaxInvoiceData.isSelected
            ) {
              selectedBuyer.push(viewTaxInvoiceData);
            }
          }
        );
      if (selectedBuyer && selectedBuyer.length == 0) {
        toast.error("Please select at least one data to generate invoice");
        return;
      }

      const currentDate = new Date();
      const buyerPromptDate = selectedBuyer[0]?.buyerPromptDate;

      if (buyerPromptDate && new Date(buyerPromptDate) < currentDate) {
        toast.error("buyer prompt date is  over");
        return;
      }

      let buyerGetInvoiceDataDTOS = {
        buyerGetInvoiceDataDTOS: selectedBuyer,
        userid: atob(sessionStorage.getItem("argument2")),
        flag: 1,
      };

      dispatch(getAllTaxInvoiceGenAction(buyerGetInvoiceDataDTOS));
      // toast.success("Invoice generation successful");
      setcatshowmodal(false);
      setIsAllSelected(false);
      setConfirmationModalVisible(false);
      dispatch(getAllTaxInvoiceActionSuccess([]));
    } else {
      setConfirmationModalVisible(false);
    }
  };

  // const searchData = (e) => {
  //   let payload = {
  //     season: TaxInvoiceSearch.season,
  //     saleNo: TaxInvoiceSearch.saleNo,
  //     centerId: TaxInvoiceSearch.auctionCentre,
  //     auctionDate: TaxInvoiceSearch.auctionDate,
  //     sessionTime: TaxInvoiceSearch.sessionTime,
  //     buyerPromptDate: TaxInvoiceSearch.buyerPromptDate,
  //     lotNo: TaxInvoiceSearch.Lot,
  //     teaType: TaxInvoiceSearch.teaType,
  //     category: TaxInvoiceSearch.category,
  //     InvoiceEligibility: TaxInvoiceSearch.einvoiceEligibility,
  //     mark: TaxInvoiceSearch.mark,
  //     buyerName: TaxInvoiceSearch.buyerName,
  //     // auctionCentre: TaxInvoiceSearch.auctionCenterId,
  //     BillingType: TaxInvoiceSearch.bilingType,
  //     flag: "1",
  //   };
  //   dispatch(getAllTaxInvoiceAction(payload));
  // };
  const ResetViewBook = (e) => {
    e.preventDefault();
    setTaxInvoiceSearch({
      season: setSeason,
      saleNo: "",
      auctionDate: "",
      centerId: "",
      auctionCenterId: "",
      sessionTime: "",
      buyerPromptDate: "",
      lotNo: "",
      teaType: "",
      category: "",
      bilingType: "",
      mark: "",
      buyerName: "",
      // einvoiceEligibility: null,
      auctionCentre: "",
      totalpackagesvalue: 0,
    });
    settotPkg(0);
    settotqty(0);
    settotvalue(0);
    dispatch(getAllTaxInvoiceSaleActionSuccess([]));
    pageNo = 1;
    setRows([]);
    dispatch(getAllTaxInvoiceBuyerActionSuccess([]));
    dispatch(getAllTaxInvoiceLotActionSuccess([]));
    dispatch(getAllTaxInvoiceActionSuccess([]));
  };

  const handleViewDealSearch = (e) => {
    const { name, value } = e.target;
    const seasonValue = name === "season" ? String(value) : value;
    setTaxInvoiceSearch((prevTaxInvoiceSearch) => ({
      ...prevTaxInvoiceSearch,
      [name]: seasonValue,
    }));
    setSeason(seasonValue);

    if ("auctionCentre" == null && "auctionCentre" == "") {
      setTaxInvoiceSearch((prevTaxInvoiceSearch) => ({
        ...prevTaxInvoiceSearch,
        season: "",
        saleNo: "",
      }));
    }
    if ("auctionCentre" == name && value != "") {
      // dispatch(
      //   getAllTaxInvoiceSessionAction({
      //     season: TaxInvoiceSearch.season,
      //     saleNo: TaxInvoiceSearch.saleNo,
      //     auctionDate: seasonValue,
      //     auctionCenterId: TaxInvoiceSearch.auctionCentre,
      //   })
      // );

      setTaxInvoiceSearch((prevTaxInvoiceSearch) => ({
        ...prevTaxInvoiceSearch,
        season: seasonYear + "",
        saleNo: "",
      }));

      dispatch(
        getAllTaxInvoiceBuyerAction({
          season: seasonYear + "",
          auctionCenterId: seasonValue,
        })
      );
    }

    if ("season" == name && value != "") {
      dispatch(
        getAllTaxInvoiceBuyerAction({
          season: seasonValue,
          auctionCenterId: TaxInvoiceSearch.auctionCentre,
        })
      );
      setTaxInvoiceSearch((prevTaxInvoiceSearch) => ({
        ...prevTaxInvoiceSearch,
        saleNo: "",
      }));
    }

    if ("saleNo" == name && value != "") {
      dispatch(
        getAllTaxInvoiceSaleAction({
          season: TaxInvoiceSearch.season,
          saleNo: value,
          auctionCenterId: TaxInvoiceSearch.auctionCentre,
        })
      );

      dispatch(
        getAllTaxInvoiceLotAction({
          season: TaxInvoiceSearch.season,
          saleNo: value,
          auctionCenterId: TaxInvoiceSearch.auctionCentre,
        })
      );
      dispatch(
        fetchMarkRequest({
          auctionCenterId: TaxInvoiceSearch.auctionCentre,
        })
      );
    }

    if ("auctionDate" == name && value != "") {
      dispatch(
        getAllTaxInvoiceSessionAction({
          season: TaxInvoiceSearch.season,
          saleNo: TaxInvoiceSearch.saleNo,
          auctionDate: seasonValue,
          auctionCenterId: TaxInvoiceSearch.auctionCentre,
        })
      );
    }

    if ("buyersPromptDate" == name && value != "") {
      dispatch(
        getAllTaxInvoiceSessionAction({
          season: TaxInvoiceSearch.season,
          saleNo: TaxInvoiceSearch.saleNo,
          buyersPromptDate: value,
          auctionCenterId: TaxInvoiceSearch.auctionCentre,
        })
      );
    }
    if ("category" == name && value != "") {
      setCategoryError("");
      dispatch(
        getAllCategoriesAction({
          category: value,
        })
      );
    }
    // if ("Lot" == name && value != "") {
    //   dispatch(
    //     getAllTaxInvoiceLotAction({
    //       season: TaxInvoiceSearch.season,
    //       saleNo: value,
    //       auctionCenterId: TaxInvoiceSearch.auctionCentre,
    //     })
    //   );
    // }
  };

  useEffect(() => {
    // dispatch(
    //   getAllTaxInvoiceBuyerAction({
    //     season: TaxInvoiceSearch.season,
    //     auctionCenterId: TaxInvoiceSearch.auctionCentre,
    //   })
    // );
    // dispatch(
    //   getAllTaxInvoiceLotAction({
    //     season: TaxInvoiceSearch.season,
    //     saleNo: TaxInvoiceSearch.saleNo,
    //     auctionCenterId: TaxInvoiceSearch.auctionCentre,
    //   })
    // );
    // dispatch(
    //   getAllTaxInvoiceLotAction({
    //     season: TaxInvoiceSearch.season,
    //     saleNo: TaxInvoiceSearch.saleNo,
    //     auctionCenterId: TaxInvoiceSearch.auctionCentre,
    //   })
    // );
    dispatch(InvoiceApiStatus(false));
    dispatch(getAllTeaTypes());

    dispatch(fetchAuctionRequest());
    dispatch(getAllCategoriesAction());
    dispatch(fetchGradeRequest());
    dispatch(fetchUser());
    // dispatch(getInvoicenotGenAction());
    dispatch(getBuyer({ roleCode: "BUYER", userType: 2, isParentId: 0 }));
  }, []);

  const getUserData = useSelector(
    (state) => state.createBuyer.getBuyer.responseData
  );
  const getnotData = useSelector(
    (state) => state.BuyerTaxInvoice.invoiceById.responseData
  );
  console.log("getnotData524", getnotData);
  useEffect(() => {
    setallTeaTypeList(allTeaType);
    setallMarkList(markList);
    setallAuctionCenterList(getAllAuctionCenterList);
    setallCategory(allActiveCategory);
    setallGrade(grades);
    setallBuyer(getUserData);
    setviewData([]);
  }, [
    allTeaType,
    currentYear,
    markList,
    getAllAuctionCenterList,
    allActiveCategory,
    grades,
    getUserData,
  ]);

  const checkBoxSelect = (index, key, value, isSingleSelected) => {
    let tempData = [];

    if (isSingleSelected == true) {
      tempData =
        getAllTaxInvoiceResponse &&
        getAllTaxInvoiceResponse.map(
          (viewTaxInvoiceData, viewTaxInvoiceDataIndex) => {
            if (index == viewTaxInvoiceDataIndex) {
              viewTaxInvoiceData[key] = value;
            }

            return viewTaxInvoiceData;
          }
        );

      let isAllSelected = false;
      let count = 0;
      getAllTaxInvoiceResponse &&
        getAllTaxInvoiceResponse.map(
          (ViewDealBookTaoData, ViewDealBookTaoDataIndex) => {
            if (
              ViewDealBookTaoData &&
              ViewDealBookTaoData.isSelected &&
              true == ViewDealBookTaoData.isSelected
            ) {
              count = count + 1;
            }
          }
        );

      if (count == getAllTaxInvoiceResponse.length) {
        isAllSelected = true;
      }

      setIsAllSelected(isAllSelected);
    } else {
      tempData =
        getAllTaxInvoiceResponse &&
        getAllTaxInvoiceResponse.map(
          (viewTaxInvoiceData, viewTaxInvoiceDataIndex) => {
            viewTaxInvoiceData[key] = value;
            return viewTaxInvoiceData;
          }
        );
      setIsAllSelected(value);
    }

    let temGetAllTaxInvoiceResponseAllData = getAllTaxInvoiceResponseAllData;
    temGetAllTaxInvoiceResponseAllData.responseData = tempData;
    dispatch(getAllTaxInvoiceActionSuccess(temGetAllTaxInvoiceResponseAllData));
  };
  useEffect(() => {
    setTaxInvoiceSearch({
      season: setSeason,
      saleNo: "",
      auctionDate: "",
      centerId: "",
      auctionCenterId: "",
      sessionTime: "",
      buyerPromptDate: "",
      lotNo: "",
      teaType: "",
      category: "",
      bilingType: "",
      mark: "",
      buyerName: "",
      // einvoiceEligibility: null,
      auctionCentre: "",
      totalpackagesvalue: 0,
    });
    setRows([]);
    settotPkg(0);
    settotqty(0);
    settotvalue(0);
    dispatch(getAllTaxInvoiceSaleActionSuccess([]));
    dispatch(getAllTaxInvoiceBuyerActionSuccess([]));
    dispatch(getAllTaxInvoiceLotActionSuccess([]));
    dispatch(getAllTaxInvoiceActionSuccess([]));
  }, []);

  return (
    <>
      <div>
        <div>
          <form onSubmit={SearchViewDealBook}>
            <div className="row">
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Auction Center </label>
                  <label className="errorLabel"> * </label>
                  <select
                    name="auctionCentre"
                    value={TaxInvoiceSearch.auctionCentre}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Auction Center</option>
                    {allAuctionCenterList?.map(
                      (allAuctionCenterList, index) => (
                        <option value={allAuctionCenterList.auctionCenterId}>
                          {allAuctionCenterList.auctionCenterName}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Season</label>
                  <label className="errorLabel"> * </label>
                  <select
                    name="season"
                    value={TaxInvoiceSearch.season}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                    disabled={
                      null == TaxInvoiceSearch.auctionCentre ||
                      "" == TaxInvoiceSearch.auctionCentre
                        ? true
                        : false
                    }
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Sale No</label>
                  <label className="errorLabel"> * </label>
                  <select
                    name="saleNo"
                    onChange={handleViewDealSearch}
                    value={TaxInvoiceSearch.saleNo}
                    className="form-control select-form"
                  >
                    <option value="">Select Sale No</option>
                    {BuyerList?.map((saleNoItem, index) => (
                      <option value={saleNoItem.saleNo} key={index}>
                        {saleNoItem.saleNo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Auction Date </label>
                  <select
                    name="auctionDate"
                    value={TaxInvoiceSearch.auctionDate}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Auction Date </option>
                    {saleList?.map((saleListData, index) => (
                      <option value={saleListData.saleDate} key={index}>
                        {saleListData.saleDate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Session Time</label>
                  <select
                    name="sessionTime"
                    value={TaxInvoiceSearch.sessionTime}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Session Time </option>
                    {sessionList?.map((sessionListData, index) => (
                      <option value={sessionListData.SessionTime}>
                        {sessionListData.SessionTime}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Buyer's Prompt Date</label>
                  <select
                    name="buyerPromptDate"
                    value={TaxInvoiceSearch.buyersPromptDate}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Buyer's Prompt Date</option>
                    {saleList?.map((sessionListData, index) => (
                      <option value={sessionListData.buyersPromptDate}>
                        {sessionListData.buyersPromptDate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Lot No</label>
                  <select
                    name="Lot"
                    value={TaxInvoiceSearch.Lot}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Lot No</option>
                    {LotList?.map((LotListdata, index) => (
                      <option value={LotListdata.LOT} key={index}>
                        {LotListdata.LOT}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Tea Type</label>
                  <select
                    name="teaType"
                    value={TaxInvoiceSearch.teaType}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Tea Type</option>
                    {allTeaTypeList?.map((allTeaTypeList, index) => (
                      <option value={allTeaTypeList.teaTypeId}>
                        {allTeaTypeList.teaTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Invoice (Billing) Type</label>
                  <select
                    name="bilingType"
                    value={TaxInvoiceSearch.bilingType}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Billing Type</option>
                    <option value="1">Auctioneer to Buyer (Goods)</option>
                    <option value="2">Seller to Buyer (Goods)</option>
                  </select>
                </div>
              </div>

              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Mark</label>
                  <select
                    name="mark"
                    value={TaxInvoiceSearch.mark}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Mark</option>
                    {allMarkList?.map((allMarkList, index) => (
                      <option value={allMarkList.markId}>
                        {allMarkList.markName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Buyer Name</label>
                  <select
                    name="buyerName"
                    value={TaxInvoiceSearch.buyerName}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Buyer Name</option>
                    {getData?.map((getData, index) => (
                      <option value={getData.userName}>
                        {getData.userName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {modalRight?.some((ele) => ele === "12") && (
                <div className="col-12">
                  <div className="BtnGroup">
                    <button
                      type="submit"
                      className="SubmitBtn"
                      onClick={searchData}
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className="SubmitBtn"
                      onClick={ResetViewBook}
                    >
                      Clear
                    </button>

                    {rows?.length > 0 ? (
                      <>
                        {modalRight?.some((ele) => ele === "48") && (
                          <button
                            class="SubmitBtn"
                            title="Export Excel"
                            onClick={() => handleExport("excel")}
                          >
                            <i class="fa fa-file-excel"></i>
                          </button>
                        )}
                        {modalRight?.some((ele) => ele === "47") && (
                          <button
                            class="SubmitBtn"
                            title="Export PDF"
                            onClick={() => handleExport("pdf")}
                          >
                            <i class="fa fa-file-pdf"></i>
                          </button>
                        )}
                        {modalRight?.some((ele) => ele === "56") && (
                          <button
                            type="button"
                            className="SubmitBtn"
                            onClick={() => InvoiceGens()}
                          >
                            Generate Invoice
                          </button>
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        {modalRight?.some((ele) => ele === "12") && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="TableBox">
                <table className="table" ref={tableRef}>
                  <thead>
                    <tr>
                      {rows?.length > 0 ? (
                        <th>
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={(e) =>
                              checkBoxSelect(
                                "",
                                "isSelected",
                                e.target.checked,
                                false
                              )
                            }
                          />
                        </th>
                      ) : (
                        ""
                      )}
                      <th>Sr.</th>
                      <th>Season</th>
                      <th>Sale No</th>
                      <th>Auction Date</th>
                      <th>Session Time</th>
                      <th>Lot No</th>
                      <th>Mark</th>
                      <th>Grade</th>
                      <th>Qty Received</th>
                      <th>Deal Price</th>
                      <th>Deal No</th>
                      <th>Buyer Name</th>
                      <th>Total Packages</th>
                      <th>Total Gross Wt. (Kgs)</th>
                      <th>Sample Qty(Kgs)</th>
                      <th>Short/Excess Wt. (Kgs)</th>
                      <th>Category</th>
                      <th>Sub Type</th>
                      <th>Invoice No</th>
                      <th>Within State</th>
                      <th>Export</th>
                      <th>Deal Time</th>
                      <th>Preference</th>
                      <th>CN Status</th>
                      <th>Session Type</th>
                      <th>Bidders From</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {loader ? (
                      <>
                        <div className="">
                          <ThreeDots
                            visible={true}
                            height="80"
                            width="80"
                            color="#4fa94d"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {rows?.length > 0 ? (
                          <>
                            {rows?.map((data, index) => (
                              <tr key={index}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={data && data.isSelected}
                                    onChange={(e) =>
                                      checkBoxSelect(
                                        index,
                                        "isSelected",
                                        e.target.checked,
                                        true
                                      )
                                    }
                                  />
                                </td>
                                <td>{index + 1}</td>
                                <td>{data.season}</td>
                                <td>{data.saleNo}</td>
                                <td>{data.saleDate}</td>
                                <td>{data.seasonTime}</td>
                                <td>{data.lotNO}</td>
                                <td>{data.markname}</td>
                                <td>{data.gradeName}</td>
                                <td>{data.qtyReceived}</td>
                                <td>{data.dealPrice}</td>
                                <td>{data.dealNo}</td>
                                <td>{data.buyerName}</td>
                                <td>{data.totalPackages}</td>
                                <td>{data.totalGrossWt}</td>
                                <td>{data.sampleQty}</td>
                                <td>{data.shortExcessWeight}</td>
                                <td>{data.category}</td>
                                <td>{data.subTeaTypename}</td>
                                <td>{data.invoiceNo}</td>
                                <td>{data.withinState}</td>
                                <td>{data.export}</td>
                                <td>{data.dealTime}</td>
                                <td>{data.preference}</td>
                                <td>{data.withinState}</td>
                                <td>{data.sessionTypeName}</td>
                                <td>{data.buyerName}</td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr>
                            <td colSpan={30}>
                              <div className="NoData">No Data</div>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="col-lg-1000 mt-3">
                  <div className="TableBox">
                    <table className="table">
                      <thead>
                        <th colSpan={6} className="text-center">
                          Calculation
                        </th>
                        <tr>
                          <th>Total Package </th>
                          <th>Qty. Received </th>
                          <th>Total Value </th>
                        </tr>
                      </thead>
                      <tr>
                        <td>{totPkg}</td>
                        <td>{totqty}</td>
                        <td>{totvalue}</td>
                      </tr>
                    </table>
                  </div>

                  {rows?.length > 19 ? (
                    <>
                      <button class="SubmitBtn" onClick={handleViewMore}>
                        View More
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {catshowmodal && (
        <Modal show={catshowmodal} onHide={handlecatId} size="lg" centered>
          <Modal.Header>
            <Modal.Title>Select Category</Modal.Title>
            <i className="fa fa-times CloseModal" onClick={handlecatId}></i>
          </Modal.Header>
          <div className="col-xl-4">
            <div className="FormGroup">
              <label>Category</label>
              <select
                name="category"
                value={TaxInvoiceSearch.category}
                className="form-control select-form"
                onChange={handleViewDealSearch}
              >
                <option value="">Select Category</option>
                {allCategory?.map((category, index) => (
                  <option key={index} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              <div>
                <button
                  type="button"
                  className="Excel"
                  onClick={() => InvoiceGen()}
                >
                  <i className="fa fa-download"></i>
                </button>
              </div>
              {categoryError && (
                <div className="error-message">{categoryError}</div>
              )}
            </div>
          </div>
        </Modal>
      )}
      <Modal
        show={confirmationModalVisible}
        onHide={() => handleConfirm(false)}
      >
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to add this category?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleConfirm(false)}>
            No
          </Button>
          <Button variant="primary" onClick={() => handleConfirm(true)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TaxInvoice;
