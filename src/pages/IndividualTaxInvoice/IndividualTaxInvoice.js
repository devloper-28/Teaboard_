/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import html2canvas from "html2canvas";
import SellerTaxInvoice from "../../pages/SellerTaxInvoice/SellerTaxInvoice";
import jsPDF from "jspdf";
import { useRef } from "react";
import $ from "jquery";

import {
  fetchAuctionRequest,
  fetchGradeRequest,
  fetchMarkRequest,
  getAllCategoriesAction,
  getAllTeaTypes,
  getBuyer,
  getDocumentByIdAction,
  getSaleNoRequest,
  fetchUser,
  getInvoiceByIdAction,
  getAllTaxInvoiceAction,
  getAllTaxInvoiceBuyerAction,
  getAllTaxInvoiceGenAction,
  getAllTaxInvoiceSaleAction,
  getAllTaxInvoiceLotAction,
  getAllTaxInvoiceSessionAction,
  getAllTaxInvoiceActionSuccess,
  getExportData,
  getExportDataApiCall,
  getExportDataSeller,
  getExportDataSellerApiCall,
  getAllTaxInvoiceSaleActionSuccess,
  getAllTaxInvoiceBuyerActionSuccess,
  getAllTaxInvoiceLotActionSuccess,
  getGstExcelByIdAction,
  getInvoiceGstByIdAction,
} from "../../store/actions";

import { useSelector } from "react-redux";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import Checkbox from "@mui/material/Checkbox";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosMain from "../../http/axios/axios_main";
import CustomToast from "../../components/Toast";
import { toast } from "react-toastify";
import { Card, Form, Modal, Button } from "react-bootstrap";
import moment from "moment";
import { ThreeDots } from "react-loader-spinner";
import qs from "qs";
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import UploadZip from "../uploadDocument/UploadFileZip";
import { NO_OF_RECORDS } from "../../constants/commonConstants";

let pageNo = 1;
function IndividualTaxInvoice({ modalRight, onFileSelect, inputId }) {
  const seasonYear = moment().year();
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 6; i++) {
    const year = currentYear - i;
    years.push(year);
  }
  const handleCloseHistory = () => setModalNames(false);
  const handleCloseModal = () => {
    const inputElement = document.getElementById("individualTaxInvoice");
    if (inputElement) {
      inputElement.value = "";
    }
    setModalOpen(false);
  };
  const [isModalOpen, setModalOpen] = useState(false);
  const [showOwnerModalHistory, setShowCirtificateModal] = useState(false);
  const HideCirtificateModal = () => setShowCirtificateModal(false);

  const tableRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [exportType, setexportType] = useState("");
  const [exportTypes, setexportTypes] = useState("");
  const [modalNames, setModalNames] = useState(false);
  const handleViewClick = () => setShowmodal(false);
  const [viewData, setviewData] = useState([]);
  const [totteainvoice, settotteainvoice] = useState(0);
  const [totauctioneerinvoice, settotauctioneerinvoice] = useState(0);
  const [totteboardinvoice, settotteboardinvoice] = useState(0);
  const [tottcs, settottottcs] = useState(0);
  const [tottds, settottottds] = useState(0);
  const [totgrand, settotgrand] = useState(0);
  const handlecatId = () => setcatshowmodal(false);
  const [ViewTaxInvoiceData, setViewTaxInvoiceData] = useState([]);
  const [allAuctioneerList, setallAuctioneerList] = useState([]);
  const [allTeaTypeList, setallTeaTypeList] = useState([]);
  const [allGrade, setallGrade] = useState([]);
  const [allMarkList, setallMarkList] = useState([]);
  const [allAuctionCenterList, setallAuctionCenterList] = useState([]);
  const [allCategory, setallCategory] = useState([]);
  const [season, setSeason] = useState(seasonYear);
  const [allBuyer, setallBuyer] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [catshowmodal, setcatshowmodal] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [rows, setRows] = useState([]);
  const [categoryError, setCategoryError] = useState("");
  const dispatch = useDispatch();

  const [TaxInvoiceSearch, setTaxInvoiceSearch] = useState({
    season: season + "",
    saleNo: "",
    centerId: null,
    teaType: null,
    category: null,
    auctionDate: null,
    sessionTime: null,
    mark: null,
    buyerName: null,
    buyerPromptDate: null,
    auctionCentre: null,
    einvoiceEligibility: null,
    bilingType: null,
    status: null,
    flag: "2",
  });

  const handleUploadClick = () => {
    let selectedBuyer = getAllTaxInvoiceResponse.filter(
      (viewTaxInvoiceData) => viewTaxInvoiceData.isSelected
    );

    if (selectedBuyer.length === 0) {
      toast.error("Please select at least one data to upload.");
      return;
    }

    setModalOpen(true);
  };
  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      base64: file.documentContent,
      filename: file.documentName,
      invoiceno: file.invoiceNo,
      userId: atob(sessionStorage.getItem("argument2")),
    }));
    setUploadedDocuments(newFiles);
  };
  const handleUploadDocument = () => {
    if (uploadedFiles.length === 0) {
      setUploadDocumentError("Please select a file.");
    } else {
      let selectedBuyer = [];
      getAllTaxInvoiceResponse &&
        getAllTaxInvoiceResponse.map(
          (viewTaxInvoiceData, viewTaxInvoiceDataIndex) => {
            if (
              viewTaxInvoiceData &&
              viewTaxInvoiceData.isSelected &&
              true == viewTaxInvoiceData.isSelected
            ) {
              selectedBuyer.push(viewTaxInvoiceData.invoiceNo);
            }
          }
        );

      if (selectedBuyer && selectedBuyer.length > 1) {
        toast.error("Must be select only one record");
        return;
      }

      const apiPayload = uploadedFiles.map((file) => ({
        base64: file.documentContent,
        filename: file.documentName,
        invoiceno: selectedBuyer && selectedBuyer[0],
        userId: atob(sessionStorage.getItem("argument2")),
      }));
      let urls = "postauction/esign/gstresponse";
      dispatch(
        getGstExcelByIdAction({
          urls,
          apiPayload: apiPayload && apiPayload[0],
        })
      );
      setUploadDocumentError(null);
      setModalOpen(false);
      setUploadedFiles("");
      removeAllFiles("");
      setcatshowmodal(false);
      setIsAllSelected(false);
      setConfirmationModalVisible(false);
      dispatch(getAllTaxInvoiceActionSuccess([]));
      const inputElement = document.getElementById("individualTaxInvoice");
      if (inputElement) {
        inputElement.value = "";
      }
    }
  };
  const removeAllFiles = () => {
    setUploadedFiles([]);
    // onFileSelect([]);
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.value = "";
    }
  };
  const handleButtonClick = () => {
    setModalNames(true);
  };
  const Validate = () => {
    let isValid = true;
    if (
      TaxInvoiceSearch.auctionCentre == null ||
      TaxInvoiceSearch.auctionCentre == "" ||
      TaxInvoiceSearch.auctionCentre == undefined
    ) {
      CustomToast.error("Please select AuctionCenter");
      isValid = false;
      return;
    }
    if (
      TaxInvoiceSearch.saleNo == null ||
      TaxInvoiceSearch.saleNo == "" ||
      TaxInvoiceSearch.saleNo == undefined
    ) {
      CustomToast.error("Please select sale no");
      isValid = false;
      return;
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
    if (TaxInvoiceSearch.mark == "") {
      TaxInvoiceSearch.mark = null;
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
        teaType: TaxInvoiceSearch.teaType,
        category: TaxInvoiceSearch.category,
        auctionDate: TaxInvoiceSearch.auctionDate,
        sessionTime: TaxInvoiceSearch.sessionTime,
        mark: TaxInvoiceSearch.mark,
        buyerName: TaxInvoiceSearch.buyerName,
        buyerPromptDate: TaxInvoiceSearch.buyerPromptDate,
        lotNo: TaxInvoiceSearch.Lot,
        // auctionCentre: TaxInvoiceSearch.auctionCenterId,
        InvoiceEligibility: TaxInvoiceSearch.einvoiceEligibility,
        BillingType: TaxInvoiceSearch.bilingType,
        status: TaxInvoiceSearch.status,
        flag: "2",
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
        teaType: TaxInvoiceSearch.teaType,
        category: TaxInvoiceSearch.category,
        auctionDate: TaxInvoiceSearch.auctionDate,
        sessionTime: TaxInvoiceSearch.sessionTime,
        mark: TaxInvoiceSearch.mark,
        buyerName: TaxInvoiceSearch.buyerName,
        buyerPromptDate: TaxInvoiceSearch.buyerPromptDate,
        lotNo: TaxInvoiceSearch.Lot,
        // auctionCentre: TaxInvoiceSearch.auctionCenterId,
        InvoiceEligibility: TaxInvoiceSearch.einvoiceEligibility,
        BillingType: TaxInvoiceSearch.bilingType,
        status: TaxInvoiceSearch.status,
        flag: "2",
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

  const allActiveCategory = useSelector(
    (state) => state?.categoryManage?.allCategories?.responseData
  );
  const grades = useSelector((state) => state.grade.data.responseData);

  const saleList = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoiceSale?.responseData
  );

  const LotList = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoiceLot?.responseData
  );

  const invoieceGenerateList = useSelector(
    (state) => state?.BuyerTaxInvoice?.invoiceById?.responseData
  );

  const BuyerList = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoiceBuyer?.responseData
  );
  let getAllTaxInvoiceResponse = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoice?.responseData
  );

  const getData = useSelector(
    (state) => state?.createRegistrtion?.getAllUserActionSuccess?.responseData
  );
  const exceldatagst = useSelector(
    (state) => state //?.createRegistrtion?.getAllUserActionSuccess?.responseData
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
      let totalteainvoice = 0;
      let totalauctioneerinvoice = 0;
      let totalteabordinvoice = 0;
      let totaltcs = 0;
      let totaltds = 0;
      let totalgrand = 0;

      for (let i = 0; i < getAllTaxInvoiceResponse.length; i++) {
        const taxInvoice = getAllTaxInvoiceResponse[i];

        // Ensure that the values are valid numbers before parsing
        const teaInvoiceAmount = parseInt(taxInvoice.totalTeaInvoiceAmount);
        const auctioneerInvoiceAmount = parseInt(
          taxInvoice.totalAuctioneerInvoiceAmount
        );
        const teaBoardInvoiceAmount = parseInt(
          taxInvoice.totalTeaBoardInvoiceAmount
        );
        const tcsAmount = parseInt(taxInvoice.tcsonBuyingBrokerage);
        const tdsAmount = parseInt(taxInvoice.tdsonBuyingBrokerage);

        // Check if the parsed values are valid numbers
        if (!isNaN(teaInvoiceAmount)) totalteainvoice += teaInvoiceAmount;
        if (!isNaN(auctioneerInvoiceAmount))
          totalauctioneerinvoice += auctioneerInvoiceAmount;
        if (!isNaN(teaBoardInvoiceAmount))
          totalteabordinvoice += teaBoardInvoiceAmount;
        if (!isNaN(tcsAmount)) totaltcs += tcsAmount;
        if (!isNaN(tdsAmount)) totaltds += tdsAmount;

        // Calculate grandTotal for each entry and handle NaN values
        const grandTotal =
          (isNaN(teaInvoiceAmount) ? 0 : teaInvoiceAmount) +
          (isNaN(auctioneerInvoiceAmount) ? 0 : auctioneerInvoiceAmount) +
          (isNaN(teaBoardInvoiceAmount) ? 0 : teaBoardInvoiceAmount) +
          (isNaN(tcsAmount) ? 0 : tcsAmount) +
          (isNaN(tdsAmount) ? 0 : tdsAmount);

        totalgrand += grandTotal;
      }

      settotteainvoice(totalteainvoice);
      settotauctioneerinvoice(totalauctioneerinvoice);
      settotteboardinvoice(totalteabordinvoice);
      settottottcs(totaltcs);
      settottottds(totaltds);
      settotgrand(totalgrand); // Set the total grand value
    }
  }, [getAllTaxInvoiceResponse]);

  const InvoiceGens = () => {
    setcatshowmodal(true);
  };
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

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      season: TaxInvoiceSearch.season,
      saleNo: TaxInvoiceSearch.saleNo,
      centerId: TaxInvoiceSearch.auctionCentre,
      teaType: TaxInvoiceSearch.teaType,
      category: TaxInvoiceSearch.category,
      auctionDate: TaxInvoiceSearch.auctionDate,
      sessionTime: TaxInvoiceSearch.sessionTime,
      mark: TaxInvoiceSearch.mark,
      buyerName: TaxInvoiceSearch.buyerName,
      buyerPromptDate: TaxInvoiceSearch.buyerPromptDate,
      lotNo: TaxInvoiceSearch.Lot,
      // auctionCentre: TaxInvoiceSearch.auctionCenterId,
      InvoiceEligibility: TaxInvoiceSearch.einvoiceEligibility,
      BillingType: TaxInvoiceSearch.bilingType,
      status: TaxInvoiceSearch.status,
      flag: "2",
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

  const getExportDataSellerResponse = useSelector(
    (state) => state.BuyerTaxInvoice.exportDataSeller.responseData
  );

  const getExportDataSellerApiCallResponse = useSelector(
    (state) => state.BuyerTaxInvoice.exportDataSellerApiCall
  );

  useEffect(() => {
    if (
      getExportDataSellerResponse != null &&
      true == getExportDataSellerApiCallResponse
    ) {
      dispatch(getExportDataSellerApiCall(false));
      // if ("excel" == exportType) {
      Base64ToExcelDownload(
        getExportDataSellerResponse,
        "IndividualTaxInvoiceDetails.xlsx"
      );
      // } else {
      //   uploadedFileDownload(
      //     getExportDataSellerResponse,
      //     "IndividualTaxInvoiceDetails.pdf",
      //     `data:application/pdf;base64`
      //   );
      // }
    }
  });

  useEffect(() => {
    if (getExportDataResponse != null && true == getExportDataApiCallResponse) {
      dispatch(getExportDataApiCall(false));
      if ("excel" == exportType) {
        Base64ToExcelDownload(
          getExportDataResponse,
          "IndividualTaxInvoiceDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "IndividualTaxInvoiceDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleImportExcelClick = (exportTypes) => {
    setexportTypes("");
    let selectedBuyer = [];
    getAllTaxInvoiceResponse &&
      getAllTaxInvoiceResponse.map(
        (viewTaxInvoiceData, viewTaxInvoiceDataIndex) => {
          if (
            viewTaxInvoiceData &&
            viewTaxInvoiceData.isSelected &&
            true == viewTaxInvoiceData.isSelected
          ) {
            let tempData = {
              invoiceNo: viewTaxInvoiceData.invoiceNo,
              invoiceDate: viewTaxInvoiceData.asgst,
              buyerGSTIN: viewTaxInvoiceData.buyerGstNo,
              invoiceValue: viewTaxInvoiceData.totalTeaBoardInvoiceAmount,
              transferId: viewTaxInvoiceData.dealBookId,
              invoiceId: viewTaxInvoiceData.invoiceId,
              ackDate: "",
              ackNo: "",
              irn: "",
              ewb: "Success",
            };

            selectedBuyer.push(tempData);
          }
        }
      );
    if (selectedBuyer && selectedBuyer.length == 0) {
      toast.error("Please select at least one data to generate GST IRN.");
      return;
    }
    setexportTypes(exportTypes);
    let payload = {
      url: "postauction/gst/exportIrn",
      data: selectedBuyer,
    };
    dispatch(getExportDataSeller(payload));
    setcatshowmodal(false);
    setIsAllSelected(false);
    setConfirmationModalVisible(false);
    // dispatch(getAllTaxInvoiceActionSuccess([]));
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
        toast.error("Please select atleast one data to generate invoice");
        return;
      }
      let buyerGetInvoiceDataDTOS = {
        buyerGetInvoiceDataDTOS: selectedBuyer,
        userid: 1,
        flag: 2,
      };
      dispatch(getAllTaxInvoiceGenAction(buyerGetInvoiceDataDTOS));
      // toast.success("Invoice generation successful");
      setcatshowmodal(false);
      setIsAllSelected(false);
      setConfirmationModalVisible(false);
      // dispatch(getAllTaxInvoiceActionSuccess([]));
    } else {
      setConfirmationModalVisible(false);
    }
    setConfirmationModalVisible(false);
  };

  const ResetViewBook = (e) => {
    e.preventDefault();
    setTaxInvoiceSearch({
      season: seasonYear,
      saleNo: "",
      teaType: "",
      category: "",
      auctionDate: "",
      sessionTime: "",
      mark: "",
      buyerName: "",
      buyerPromptDate: "",
      lotNo: "",
      auctionCentre: "",
      centerId: "",
      auctionCenterId: "",
      einvoiceEligibility: "",
      status: "",
      bilingType: "",
    });
    settotteainvoice(0);
    settotauctioneerinvoice(0);
    settotteboardinvoice(0);
    settottottcs(0);
    settottottds(0);
    settotgrand(0);
    setRows([]);
    dispatch(getAllTaxInvoiceSaleActionSuccess([]));
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
      dispatch(
        getAllTaxInvoiceSessionAction({
          season: TaxInvoiceSearch.season,
          saleNo: TaxInvoiceSearch.saleNo,
          auctionDate: value,
          auctionCenterId: TaxInvoiceSearch.auctionCentre,
        })
      );

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
    }
    if ("auctionDate" == name && value != null) {
      dispatch(
        getAllTaxInvoiceSessionAction({
          season: TaxInvoiceSearch.season,
          saleNo: TaxInvoiceSearch.saleNo,
          auctionDate: value,
          auctionCenterId: TaxInvoiceSearch.auctionCentre,
        })
      );
    }
  };

  useEffect(() => {
    // dispatch(
    //   getAllTaxInvoiceBuyerAction({
    //     season: TaxInvoiceSearch.season,
    //     auctionCenterId: "1",
    //   })
    // );

    dispatch(getAllTeaTypes());
    dispatch(fetchMarkRequest());
    dispatch(fetchAuctionRequest());
    dispatch(getAllCategoriesAction());
    dispatch(fetchGradeRequest());
    dispatch(getInvoiceGstByIdAction());
    dispatch(fetchUser());
    dispatch(getBuyer({ roleCode: "BUYER", userType: 2, isParentId: 0 }));
  }, []);

  const getUserData = useSelector(
    (state) => state.createBuyer.getBuyer.responseData
  );
  useEffect(() => {
    setallTeaTypeList(allTeaType);
    setallMarkList(markList);
    setallAuctionCenterList(getAllAuctionCenterList);
    setallCategory(allActiveCategory);
    setallGrade(grades);
    setallBuyer(getUserData);
  }, [
    allTeaType,
    currentYear,
    markList,
    getAllAuctionCenterList,
    allActiveCategory,
    grades,
    getUserData,
  ]);
  const handleViewClickid = (invoiceId) => {
    dispatch(getInvoiceByIdAction(invoiceId));
    setShowmodal(true);
  };

  const [selectedInvoices, setSelectedInvoices] = useState([]);

  const checkBoxSelect = (index, key, value, isSingleSelected) => {
    let tempData = [];
    const updatedSelectedInvoices = [...selectedInvoices];

    if (!getAllTaxInvoiceResponse) {
      // Handle the case when getAllTaxInvoiceResponse is undefined
      return;
    }

    if (isSingleSelected) {
      const invoiceNo = getAllTaxInvoiceResponse[index]?.invoiceNo;
      if (invoiceNo) {
        updatedSelectedInvoices.push(invoiceNo);
      }
    } else {
      const invoiceNo = getAllTaxInvoiceResponse[index]?.invoiceNo;
      const indexOfInvoice = updatedSelectedInvoices.indexOf(invoiceNo);
      if (indexOfInvoice !== -1) {
        updatedSelectedInvoices.splice(indexOfInvoice, 1);
      }
    }

    setSelectedInvoices(updatedSelectedInvoices);

    if (isSingleSelected == true) {
      tempData = getAllTaxInvoiceResponse.map(
        (viewTaxInvoiceData, viewTaxInvoiceDataIndex) => {
          if (index == viewTaxInvoiceDataIndex) {
            viewTaxInvoiceData[key] = value;
          }
          return viewTaxInvoiceData;
        }
      );

      let isAllSelected = getAllTaxInvoiceResponse.every(
        (ViewDealBookTaoData) => ViewDealBookTaoData?.isSelected
      );

      setIsAllSelected(isAllSelected);
    } else {
      tempData = getAllTaxInvoiceResponse.map(
        (viewTaxInvoiceData, viewTaxInvoiceDataIndex) => {
          viewTaxInvoiceData[key] = value;
          return viewTaxInvoiceData;
        }
      );
      setIsAllSelected(value);
    }

    getAllTaxInvoiceResponse = tempData;
  };

  const [serialNumber, setserialNumber] = useState([]);
  const [selectedserialNumber, setselectedserialNumber] = useState("");

  const handleDropdownChange = (event) => {
    const selectedSerialNumber = event.target.value;
    setselectedserialNumber(selectedSerialNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = "https://localhost:29739/signer";

      try {
        const data = {
          action: "0",
          serialNumber: null,
          data: null,
          publicKey: null,
          key: null,
        };
        console.log(qs.stringify(data));
        const response = await axios.post(url, qs.stringify(data), {});
        setserialNumber(response?.data?.signerResponse?.certificates);
        console.log("Response:", serialNumber);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchData();
  }, []);
  const [viewcertificateDetail, setviewcertificateDetail] = useState({});

  const ViewCertificates = async () => {
    const url = "https://localhost:29739/teaboard/signer";
    try {
      const data = {
        action: "1",
        serialNumber: selectedserialNumber,
        data: null,
        publicKey: null,
        key: null,
      };

      if (data.serialNumber != "" || data.serialNumber != null) {
        const response = await axios.post(url, qs.stringify(data), {});
        setviewcertificateDetail(
          response?.data?.signerResponse?.certificateDetail
        );
        var datas = response.data.signerResponse?.certificateDetail;
        const keyValuePairs =
          response.data.signerResponse?.certificateDetail.clientName.split(",");
        const cnField = keyValuePairs.find((pair) => pair.includes("CN="));
        const name = cnField.split("=")[1].trim();

        datas.clientName = name;
        setShowCirtificateModal(true);
      } else {
        CustomToast.error("Please select certificate");
        setShowCirtificateModal(false);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const [Base64Data, setBase64Data] = useState([]);
  const [Base64savedigitalsign, setBase64savedigitalsign] = useState([]);
  const [Loading, setloading] = useState(false);
  const currentDate = new Date();

  console.log("selectedInvoices", selectedInvoices);

  const handlePostRequest = async () => {
    if (selectedInvoices?.length > 0 && selectedserialNumber !== null) {
      const url = "https://localhost:29739/teaboard/signer";
      const data = {
        action: "1",
        serialNumber: selectedserialNumber,
        data: null,
        publicKey: null,
        key: null,
      };
      const response = await axios.post(url, qs.stringify(data), {});
      const validTo = response.data.signerResponse.certificateDetail.validTo;
      const validDate = moment(validTo).format("YYYY-MM-DD HH:mm:ss");
      const currentDates = moment(currentDate).format("YYYY-MM-DD HH:mm:ss");
      console.log("Valid Date:", validDate);
      console.log("Current Date:", currentDates);
      const validD = new Date(validDate);
      const currentD = new Date(currentDates);
      const current_date = new Date();
      const isBetweenDates = currentD <= current_date && current_date <= validD;
      if (isBetweenDates) {
        setloading(true);
        try {
          const response = await axiosMain.post(
            "/postauction/esign/Digitalsign",
            {
              base64: "",
              filename: "",
              invoiceNo: "",
              invoicenolist: selectedInvoices,
            }
          );
          if (response.data.statusCode === 200) {
            const base64Data = response.data.responseData;
            setBase64Data(base64Data);
            const url = "https://localhost:29739/teaboard/signer";
            try {
              const data = {
                action: "1",
                serialNumber: selectedserialNumber,
                data: null,
                publicKey: null,
                key: null,
              };
              if (data.serialNumber != "" || data.serialNumber != null) {
                const response = await axios.post(url, qs.stringify(data), {});
                setviewcertificateDetail(
                  response?.data?.signerResponse?.certificateDetail
                );
                var datas = response.data.signerResponse?.certificateDetail;
                const keyValuePairs =
                  response.data.signerResponse?.certificateDetail.clientName.split(
                    ","
                  );
                const cnField = keyValuePairs.find((pair) =>
                  pair.includes("CN=")
                );
                const name = cnField.split("=")[1].trim();

                datas.clientName = name;
              } else {
                CustomToast.error("Please select certificate");
                setShowCirtificateModal(false);
              }
            } catch (error) {
              console.error("Error:", error.message);
            }
            console.log("response.data", response.data);
            for (const name of base64Data) {
              const signData = {
                signPlace: "1",
                serialnumber: selectedserialNumber,
                documentContent: name.base64,
                documentTitle: name.filename,
                organnizationName: "EPTL",
                place: atob(sessionStorage.getItem("argument11")),
                certificateName: datas.clientName,
              };
              console.log("Location", signData);
              const response = await axios.post(
                "https://localhost:29739/teaboard/livesign/pdfsigner",
                signData
              );
              setBase64savedigitalsign(response.data);
              console.log("Response from pdfsigner:", response.data);
              if (response.data !== null && response.data !== "") {
                const data1 = [
                  {
                    base64: response.data.base64,
                    filename: name.filename,
                    invoiceNo: name.invoiceNo,
                    invoicenolist: selectedInvoices,
                  },
                ];
                const response1 = await axiosMain.post(
                  "/postauction/esign/savedigitalsign",
                  data1
                );
                if (response1.data.statusCode === 200) {
                  CustomToast.success(response1.data.message);
                } else {
                  CustomToast.error(response1.data.message);
                }
              }
            }
          } else {
            setBase64Data([]);
          }
        } catch (error) {
          console.error("Error making POST request to Digitalsign:", error);
        } finally {
          setloading(false);
        }
      } else {
        CustomToast.error("Digital Certificate is expired");
      }
    } else {
      CustomToast.error("Please select rows and select certificate");
    }
  };

  useEffect(() => {
    setTaxInvoiceSearch({
      season: setSeason,
      saleNo: "",
      teaType: "",
      category: "",
      auctionDate: "",
      sessionTime: "",
      mark: "",
      buyerName: "",
      buyerPromptDate: "",
      lotNo: "",
      auctionCentre: "",
      centerId: "",
      auctionCenterId: "",
      einvoiceEligibility: "",
      status: "",
      bilingType: "",
    });
    settotteainvoice(0);
    settotauctioneerinvoice(0);
    settotteboardinvoice(0);
    settottottcs(0);
    settottottds(0);
    settotgrand(0);
    setRows([]);
    dispatch(getAllTaxInvoiceSaleActionSuccess([]));
    dispatch(getAllTaxInvoiceBuyerActionSuccess([]));
    dispatch(getAllTaxInvoiceLotActionSuccess([]));
    dispatch(getAllTaxInvoiceActionSuccess([]));
  }, []);

  const moduleList = useSelector(
    (state) => state?.ModuleReducer?.data?.responseData
  );

  const [rightsIdData, setRightsIdData] = useState([]);

  if (
    moduleList !== null &&
    moduleList !== undefined &&
    rightsIdData?.length == 0
  ) {
    setRightsIdData(
      moduleList?.auctionCentersList
        ?.map((auctionCenters) => auctionCenters.modulesDtoList)
        ?.at(0)
        ?.filter((modulesDto) => modulesDto.moduleid == 4)
        ?.at(0)
        ?.linksDtoList?.filter((linksDto) => linksDto.linkId == 58)
        ?.at(0)?.rightIds
    );
  }

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
              {/* <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Auction Center </label>
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
              </div> */}
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
                    <option value="1">Seller to Auctioneer(Goods)</option>
                    <option value="2">Seller to Buyer(Goods)</option>
                    <option value="3">Auctioneer to Buyer (Goods)</option>
                    <option value="4">Auctioneer to Buyer (Service)</option>
                    <option value="5">Auctioneer to Seller (Service)</option>
                    <option value="6">Tea Board to Seller (Service)</option>
                    <option value="7">Tea Board to Auctioneer (Service)</option>
                    <option value="8">Tea Board to Buyer (Service)</option>
                    <option value="9">Tea Board to Warehouse (Service)</option>
                    <option value="10">Seller Tax Invoice</option>
                  </select>
                </div>
              </div>

              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label> E-Invoice Eligibility </label>
                  <select
                    name="einvoiceEligibility"
                    value={TaxInvoiceSearch.einvoiceEligibility}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select E-Invoice Eligibility</option>
                    <option value="1">Yes </option>
                    <option value="0">No </option>
                  </select>
                </div>
              </div>

              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Status</label>
                  <select
                    name="status"
                    value={TaxInvoiceSearch.status}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Status</option>
                    <option value="1">Digital Sign Pending</option>
                    <option value="2">Digital Sign Completed</option>
                    <option value="3">GST Pending</option>
                    <option value="4">GST Completed</option>
                    <option value="5">Ready for Download/completed</option>
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
                            onClick={() => handleButtonClick()}
                          >
                            Generate Invoice
                          </button>
                        )}
                        {TaxInvoiceSearch.status === "3" && (
                          <>
                            {modalRight?.some((ele) => ele === "54") && (
                              <button
                                class="SubmitBtn"
                                onClick={() => handleImportExcelClick()}
                              >
                                GST Excel
                              </button>
                            )}
                            {modalRight?.some((ele) => ele === "55") && (
                              <button
                                className="SubmitBtn"
                                onClick={() => handleUploadClick()}
                              >
                                IRN Upload Document
                              </button>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      ""
                    )}

                    {/* <button
                    type="button"
                    className="Excel"
                    onClick={() => InvoiceGens()}
                  >
                    <i className="fa fa-download"></i>
                  </button> */}
                  </div>
                </div>
              )}
            </div>
            {TaxInvoiceSearch.status == "1" ? (
              <>
                <div className="row">
                  <div className="col-xl-2">
                    <div className="FomrGroup">
                      <label>Certificates </label>
                      <select
                        name="auctionDate"
                        value={selectedserialNumber}
                        className="form-control select-form"
                        onChange={handleDropdownChange}
                      >
                        <option value="">Select Certificate </option>
                        {serialNumber?.map((item) => (
                          <option
                            key={item.serialNumber}
                            value={item.serialNumber}
                          >
                            {item.clientName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-xl-auto">
                    <div className="BtnGroup">
                      <button
                        type="button"
                        className="SubmitBtn"
                        onClick={() => ViewCertificates()}
                      >
                        View Certificates
                      </button>
                      {modalRight?.some((ele) => ele === "74") && (
                        <button
                          type="button"
                          className="SubmitBtn"
                          onClick={() => handlePostRequest()}
                          disabled={Loading == true}
                        >
                          Digital sign
                          {Loading == true ? (
                            <>
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
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
                      <th>Invoice Reference No</th>
                      <th>Sale No</th>
                      <th>Sale Date</th>
                      <th>Buyer’s Prompt Date</th>
                      <th>State</th>
                      <th>Place Of Supply</th>
                      <th>Country</th>
                      <th>Dispatch Contact Name</th>
                      <th>Dispatch GST No</th>
                      <th>Dispatch State</th>
                      <th>Dispatch Address</th>
                      <th>Dispatch Country</th>
                      <th>Auction Center</th>
                      <th>Sale Type</th>
                      <th>HSN Code</th>
                      <th>SAC Code</th>
                      <th>Tea Board SAC Code</th>
                      <th>Goods Description</th>
                      <th>Services Description</th>
                      <th>Tea Board Description</th>
                      <th>Goods Description1</th>
                      <th>ReverseCharge</th>
                      <th>Seller Name</th>
                      <th>Seller Address</th>
                      <th>Seller PAN No</th>
                      <th>Seller TB Reg No</th>
                      <th>Seller CIN</th>
                      <th>Seller FSSAI License No</th>
                      <th>Seller GST No</th>
                      <th>Buyer Address</th>
                      <th>Buyer Entity No</th>
                      <th>Buyer PAN No</th>
                      <th>Buyer FSSAI No</th>
                      <th>Buyer TB Reg. No</th>
                      <th>Buyer GST No</th>
                      <th>Auctioneer Name</th>
                      <th>Auctioneer Address</th>
                      <th>Auctioneer Phone No</th>
                      <th>Auctioneer Email ID</th>
                      <th>Auctioneer PAN No</th>
                      <th>Auctioneer TB Reg. No</th>
                      <th>Auctioneer CIN</th>
                      <th>Auctioneer FSSAI License No</th>
                      <th>Auctioneer GST No</th>
                      <th>Tea Board Name</th>
                      <th>Tea Board Address</th>
                      <th>Tea Board Phone No</th>
                      <th>Tea Board Email ID</th>
                      <th>Tea Board PAN No</th>
                      <th>Tea Board GST No</th>
                      <th>Seller Contract Note No</th>
                      <th>Auctioneer Contract Note No</th>
                      <th>Tea Board Contract Note No</th>
                      <th>Auct Buyer Contract Note No </th>
                      <th>Eligibility</th>
                      <th>Seller Eligibility</th>
                      <th>TB Eligibility</th>
                      <th>ABAckNo</th>
                      <th>ABAckDt</th>
                      <th>ABIRN</th>
                      <th>ABSignedQRCode</th>
                      <th>SellerAckNo</th>
                      <th>SellerCNNAckDt</th>
                      <th>SellerIRN</th>
                      <th>SellerQRGenerated</th>
                      <th>TBAckNo</th>
                      <th>TBCNNAckDt</th>
                      <th>TBIRN</th>
                      <th>TBSignedQRCode</th>
                      <th>AuctioneerAckNo</th>
                      <th>AuctioneerCNNAckDt</th>
                      <th>AuctioneerIRN</th>
                      <th>AuctioneerSignedQRCode</th>
                      <th>Warehouse Address</th>
                      <th>Action</th>
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
                                <td>{data.invoiceReferenceNo}</td>
                                <td>{data.saleNo}</td>
                                <td>{data.saleDate}</td>
                                <td>{data.buyerPromptDate}</td>
                                <td>{data.dispatchState}</td>
                                <td>{data.placeOfSupply}</td>
                                <td>{data.country}</td>
                                <td>{data.dispatchContactName}</td>
                                <td>{data.dispatchGstNo}</td>
                                <td>{data.dispatchState}</td>
                                <td>{data.dispatchAddress}</td>
                                <td>{data.dispatchCountry}</td>
                                <td>{data.auctionCenter}</td>
                                <td>{data.saleType}</td>
                                <td>{data.hsncode}</td>
                                <td>{data.saccode}</td>
                                <td>{data.teaBoardSACCode}</td>
                                <td>{data.goodsDescription}</td>
                                <td>{data.servicesDescription}</td>
                                <td>{data.teaBoardDescription}</td>
                                <td>{data.goodsDescription}</td>
                                <td>{data.reverseCharge}</td>
                                <td>{data.sellerName}</td>
                                <td>{data.sellerAddress}</td>
                                <td>{data.sellerPAnNo}</td>
                                <td>{data.sellerTBRegNo}</td>
                                <td>{data.sellerCIN}</td>
                                <td>{data.sellerFSSAILicense}</td>
                                <td>{data.sellerGstNo}</td>
                                <td>{data.buyerAddress}</td>
                                <td>{data.buyerEntity}</td>
                                <td>{data.buyerPAN}</td>
                                <td>{data.buyerFssai}</td>
                                <td>{data.buyerTbReg}</td>
                                <td>{data.buyerGstNo}</td>
                                <td>{data.auctioneerName}</td>
                                <td>{data.auctioneerAddress}</td>
                                <td>{data.auctioneerPhone}</td>
                                <td>{data.auctioneerEmail}</td>
                                <td>{data.auctioneerPan}</td>
                                <td>{data.auctioneerTBReg}</td>
                                <td>{data.auctioneerCIN}</td>
                                <td>{data.auctioneerFSSAILicense}</td>
                                <td>{data.auctioneerGST}</td>
                                <td>{data.teaboardName}</td>
                                <td>{data.teaBoardAddress}</td>
                                <td>{data.teaBoardPhoneNo}</td>
                                <td>{data.teaBoarEmailID}</td>
                                <td>{data.teaBoardPANNo}</td>
                                <td>{data.teaBoardGSTNo}</td>
                                <td>{data.sellerContractNoteNo}</td>
                                <td>{data.auctionnerContractNote}</td>
                                <td>{data.teaboardContractNote}</td>
                                <td>{data.auctBuyerContractNote}</td>
                                <td>{data.eligibility == 1 ? "YES" : "NO"}</td>
                                <td>
                                  {data.sellerEligibility == 1 ? "YES" : "NO"}
                                </td>
                                <td>
                                  {data.tbeligibility == 1 ? "YES" : "NO"}
                                </td>
                                <td>{data.abackNo}</td>
                                <td>{data.abcnnackDt}</td>
                                <td>{data.abirn}</td>
                                <td>{data.absignedQRCode}</td>
                                <td>{data.sellerAckNoforSouth}</td>
                                <td>{data.sellerCNNAckDt}</td>
                                <td>{data.sellerIRN}</td>
                                <td>{data.sellerQRGenerated}</td>
                                <td>{data.tbackNo}</td>
                                <td>{data.tbcnnackDt}</td>
                                <td>{data.tbirn}</td>
                                <td>{data.tbsignedQRCode}</td>
                                <td>{data.auctioneerAckNo}</td>
                                <td>{data.auctioneerCNNAckDt}</td>
                                <td>{data.auctioneerIRN}</td>
                                <td>{data.auctioneerSignedQRCode}</td>
                                <td>{data.warehouseAddress}</td>
                                <td className="Action text-center">
                                  {data.dealStatus === 4 ? (
                                    <></>
                                  ) : (
                                    <>
                                      {modalRight?.some(
                                        (ele) => ele === "3"
                                      ) && (
                                        <i
                                          className="fa fa-eye"
                                          title="View"
                                          onClick={() =>
                                            handleViewClickid(data.invoiceId)
                                          }
                                        ></i>
                                      )}
                                    </>
                                  )}
                                </td>
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
                          <th>Total Tea Invoice Amount (INR)</th>
                          <th>Total Auctioneer Invoice Amount (INR)</th>
                          <th>Total Tea Board Invoice Amount (INR)</th>
                          <th>TCS on Buying Brokerage (INR)</th>
                          <th>TDS on Buying Brokerage (INR)</th>
                          <th>Grand Total</th>
                        </tr>
                      </thead>
                      <tr>
                        <td>{totteainvoice}</td>
                        <td>{totauctioneerinvoice}</td>
                        <td>{totteboardinvoice}</td>
                        <td>{tottcs}</td>
                        <td>{tottds}</td>
                        <td>{totgrand}</td>
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

      {showmodal && (
        <Modal show={showmodal} onHide={handleViewClick} size="xl" centered>
          <Modal.Header>
            <Modal.Title>Invioce Data</Modal.Title>
            <i className="fa fa-times CloseModal" onClick={handleViewClick}></i>
          </Modal.Header>
          <Modal.Body>
            <TableComponent
              columns={[
                { name: "season", title: "Season" },
                { name: "saleNo", title: "Sale No" },
                {
                  name: "buyersPromptDate",
                  title: "Buyer’s Prompt Date",
                },
                { name: "cnno", title: "CN No" },
                { name: "cndate", title: "CN Date" },
                { name: "teatype", title: "Tea type" },
                { name: "saleType", title: "Sale Type" },
                { name: "buyerName", title: "Buyer Name" },
                { name: "lotNo", title: "Lot No" },
                {
                  name: "dealIdentificationNo",
                  title: "Deal Identification No",
                },
                { name: "gardenInvoiceNo", title: "Garden Invoice No" },
                {
                  name: "buyerTaxInvoiceDate",
                  title: "Buyer Tax Invoice Date",
                },
                { name: "mark", title: "Mark" },
                { name: "grade", title: "Grade" },
                { name: "category", title: "Category" },
                { name: "netQty", title: "Net Qty (Kgs)" },
                { name: "sampleQty", title: "Sample Qty (Kgs)" },
                { name: "shortQty", title: "Short Qty (Kgs)" },
                {
                  name: "qtyPurchased",
                  title: "Qty Purchased (Kgs)",
                },
                { name: "price", title: "Price/Kg" },
                {
                  name: "teaValueInvoiceNo",
                  title: "Tea Value Invoice No",
                },
                // { name: "prstbpremium", title: "PRS Seller Premium" },
                { name: "teaValue", title: "Tea Value" },
                { name: "sgstonTeaValue", title: "SGST On Tea Value" },
                { name: "cgstonTeaValue", title: "CGST On Tea Value" },
                { name: "igstonTeaValue", title: "IGST On Tea Value" },
                {
                  name: "teaValueInvoiceAmount",
                  title: "Tea Value Invoice Amount ( For South Region )",
                },
                {
                  name: "auctioneerInvoiceNo",
                  title: "Auctioneer Invoice No",
                },
                {
                  name: "auctioneertoBuyerGoodsInvoice",
                  title:
                    "Auctioneer to Buyer Goods Invoice.(Tea Value)Buying Brokerage",
                },
                {
                  name: "lotMoney",
                  title: "Lot Money ( For South Region )",
                },
                {
                  name: "auctioneerServicesTaxableValue",
                  title: "Auctioneer Services Taxable Value",
                },
                {
                  name: "sgstonAuctioneerServices",
                  title: "SGST On Auctioneer Services",
                },
                {
                  name: "cgstonAuctioneerServices",
                  title: "CGST On Auctioneer Services",
                },
                {
                  name: "igstonAuctioneerServices",
                  title: "IGST On Auctioneer Services",
                },
                {
                  name: "auctioneerInvoiceAmount",
                  title: "Auctioneer Invoice Amount",
                },
                {
                  name: "teaBoardInvoiceNo",
                  title: "TeaBoard Invoice No",
                },
                // { name: "prstbpremium", title: "PRS TB Premium" },
                { name: "teaBoardCharges", title: "TeaBoard Charges" },
                {
                  name: "sgstonTeaBoardCharges",
                  title: "SGST On Tea Board Charges",
                },
                {
                  name: "cgstonTeaBoardCharges",
                  title: "CGST On Tea Board Charges",
                },
                {
                  name: "igstonTeaBoardCharges",
                  title: "IGST On Tea Board Charges",
                },
                {
                  name: "teaBoardInvoiceAmount",
                  title: "Tea Board Invoice Amount",
                },
                {
                  name: "tdsonBuyingBrokerage",
                  title: "TDS on Buying Brokerage",
                },
                {
                  name: "tcscollectedByseller",
                  title: "TCS Collected By Seller",
                },
                { name: "debitNoteNumber", title: "DebitNoteNumber" },
                { name: "grandTotals", title: "Grand Total" },
                { name: "deliveryOrderNo", title: "Delivery Order No" },
                {
                  name: "totalTeaInvoiceAmount",
                  title: "Total Tea Invoice Amount (Rs)",
                },
                {
                  name: "totalAuctioneerInvoiceAmount",
                  title: "Total Auctioneer Invoice Amount (Rs)",
                },
                {
                  name: "totalTeaBoardInvoiceAmount",
                  title: "Total Tea Board Invoice Amount (Rs)",
                },
                { name: "grandTotals", title: "Grand Total (Rs)" },
              ]}
              rows={
                invoieceGenerateList?.length > 0
                  ? invoieceGenerateList.map((row, index) => ({
                      ...row,
                      index: index + 1,
                      updatedOn: new Date(row.updatedOn).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        }
                      ),
                    }))
                  : []
              }
              sorting={true}
              dragdrop={false}
              fixedColumnsOn={false}
              resizeingCol={false}
            />
          </Modal.Body>
        </Modal>
      )}
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

      {showOwnerModalHistory && (
        <Modal
          show={showOwnerModalHistory}
          onHide={HideCirtificateModal}
          size="xl"
          centered
        >
          <Modal.Header>
            <Modal.Title>View Certificate</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={() => HideCirtificateModal()}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <div className="TableBox">
              <table className="table">
                <tbody>
                  <tr>
                    <td>Serial Number</td>
                    <td>{viewcertificateDetail?.serialNumber}</td>
                  </tr>

                  <tr>
                    <td>Client Name</td>
                    <td>{viewcertificateDetail?.clientName}</td>
                  </tr>

                  <tr>
                    <td>Issuer Name</td>
                    <td>{viewcertificateDetail?.issuerName}</td>
                  </tr>

                  <tr>
                    <td>Valid From</td>
                    <td>{viewcertificateDetail?.validFrom}</td>
                  </tr>

                  <tr>
                    <td>Valid To</td>
                    <td>{viewcertificateDetail?.validTo}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal.Body>
        </Modal>
      )}
      {modalNames && (
        <Modal show={modalNames} onHide={handleCloseHistory} size="xl" centered>
          <Modal.Header>
            <Modal.Title>Generate Seller Tax Invoice</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={handleCloseHistory}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <SellerTaxInvoice modalRight={rightsIdData} />
          </Modal.Body>
        </Modal>
      )}
      {isModalOpen && (
        <div>
          <Modal
            show={isModalOpen}
            onHide={handleCloseModal}
            size="xl"
            centered
          >
            <Modal.Header>
              <Modal.Title>Upload Invoice Details</Modal.Title>
              <i
                className="fa fa-times CloseModal"
                onClick={handleCloseModal}
              ></i>
            </Modal.Header>
            <Modal.Body>
              <div className="col-md-12">
                <UploadZip
                  onFileSelect={handleFileUpload}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  uploadDocumentError={uploadDocumentError}
                  inputId="individualTaxInvoice"
                />
              </div>
              {uploadDocumentError && (
                <div className="error-message">{uploadDocumentError}</div>
              )}
              <div>
                <button className="SubmitBtn" onClick={handleUploadDocument}>
                  Upload
                </button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
}

export default IndividualTaxInvoice;
