/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import qs from "qs";
import UploadZip from "../uploadDocument/UploadFileZip";
import {
  fetchAuctionRequest,
  fetchGradeRequest,
  fetchMarkRequest,
  getAllCategoriesAction,
  getAllTeaTypes,
  getBuyer,
  getAllTaxInvoiceActionSuccess,
  getGstExcelByIdAction,
  fetchUser,
  getExportDataSeller,
  getAllTaxInvoiceBuyerAction,
  getAllTaxInvoiceGenAction,
  getAllTaxInvoiceSaleAction,
  getAllTaxInvoiceLotAction,
  getAllSellerTaxInvoiceSessionAction,
  getAllSellerTaxAction,
  getSellerTaxGenByIdAction,
  getAuctiondataAction,
  getAllSellerTaxGenBuyerAction,
  getChargeTaxByIdAction,
  getAllSubmitChargeAction,
  getExportData,
  getExportDataApiCall,
  getAllSellerTaxGenSaleGenAction,
  getAllSellerTaxGenActionSuccess,
  getAllTaxInvoiceSessionAction,
  getExportDataSellerApiCall,
} from "../../store/actions";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import Checkbox from "@mui/material/Checkbox";
import TableComponent from "../../components/tableComponent/TableComponent";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosMain from "../../http/axios/axios_main";
import CustomToast from "../../components/Toast";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { Card, Form, Modal, Button } from "react-bootstrap";
import moment from "moment";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { NO_OF_RECORDS } from "../../constants/commonConstants";

let pageNo = 1;
function SellerTaxInvoice({
  modalRight,
  onFileSelect,
  inputId,
  open,
  setOpen,
}) {
  const seasonYear = moment().year();
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 6; i++) {
    const year = currentYear - i;
    years.push(year);
  }
  const tableRef = useRef(null);
  const [catshowmodal, setcatshowmodal] = useState(false);
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const handleViewClick = () => setShowmodal(false);

  const [totCharge, settotCharge] = useState(0);
  const [netAmount, setnetAmount] = useState(0);
  const [grossTea, setgrossTea] = useState(0);
  const [totalSftp, settotSftp] = useState(0);
  const [pils, setpils] = useState("0.00");
  const [sellerChestageAllowance, setsellerChestageAllowance] =
    useState("0.00");
  const [sptfRecovery, setsptfRecovery] = useState("0.00");
  const [damageClaims, setdamageClaims] = useState("0.00");
  const [withdrawnCharges, setwithdrawnCharges] = useState("0.00");
  const [withdrawnSGST, setwithdrawnSGST] = useState("");
  const [withdrawnCGST, setwithdrawnCGST] = useState("");
  const [withdrawnIGST, setwithdrawnIGST] = useState("");
  const [freightCharges, setfreightCharges] = useState("0.00");
  const [invoiceDeatilsId, setinvoiceDeatilsId] = useState("");
  const [remarks, setremarks] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const handlecatId = () => setcatshowmodal(false);
  const [showmodal, setShowmodal] = useState(false);
  const [showmodalCharge, setShowmodalCharge] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [allTeaTypeList, setallTeaTypeList] = useState([]);
  const [editingCharge, seteditingCharge] = useState({});
  const [allGrade, setallGrade] = useState([]);
  const [allMarkList, setallMarkList] = useState([]);
  const [allAuctionCenterList, setallAuctionCenterList] = useState([]);
  const [allCategory, setallCategory] = useState([]);
  const [season, setSeason] = useState(currentYear);
  const [allBuyer, setallBuyer] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isSingleSelected, setisSingleSelected] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [exportTypes, setexportTypes] = useState("");
  const [exportType, setexportType] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const dispatch = useDispatch();

  const [TaxInvoiceSearch, setTaxInvoiceSearch] = useState({
    season: season + "",
    saleNo: "",
    roleCode: "AUCTIONEER",
    userId: null,
    einvoiceEligibility: null,
    status: null,
    mark: null,
    seller: null,
  });

  const Validate = () => {
    let isValid = true;
    if (
      TaxInvoiceSearch.season == null ||
      TaxInvoiceSearch.season == "SELECT" ||
      TaxInvoiceSearch.season == undefined
    ) {
      CustomToast.error("Please select season");
      isValid = false;
      return;
    }
    if (
      TaxInvoiceSearch.saleNo == null ||
      TaxInvoiceSearch.saleNo == "SELECT" ||
      TaxInvoiceSearch.saleNo == undefined
    ) {
      CustomToast.error("Please select sale no");
      isValid = false;
      return;
    }
    if (TaxInvoiceSearch.einvoiceEligibility == "") {
      TaxInvoiceSearch.einvoiceEligibility = null;
    }
    if (TaxInvoiceSearch.mark == "") {
      TaxInvoiceSearch.mark = null;
    }
    if (TaxInvoiceSearch.seller == "") {
      TaxInvoiceSearch.seller = null;
    }
    if (TaxInvoiceSearch.bilingType == "") {
      TaxInvoiceSearch.bilingType = null;
    }
    if (TaxInvoiceSearch.status == "") {
      TaxInvoiceSearch.status = null;
    }

    return isValid;
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

  const invoieceGenerateList = useSelector(
    (state) => state?.SellerTaxgen?.SellerTaxGenById?.responseData
  );

  const BuyerList = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoiceBuyer?.responseData
  );

  let getAllTaxInvoiceResponse = useSelector(
    (state) => state?.SellerTaxgen?.getAllSellerTaxGen?.responseData
  );

  const listbyinvoice = useSelector(
    (state) => state?.SellerTaxgen?.getAllSellerTaxGenSale?.responseData
  );

  const AddchargeId = useSelector(
    (state) => state?.SellerTaxgen?.ChargeById?.responseData
  );
  console.log("AddchargeId", AddchargeId);

  useEffect(() => {
    if (AddchargeId) {
      seteditingCharge(AddchargeId);
      setpils(AddchargeId.pils || "");
      setsellerChestageAllowance(AddchargeId.sellerChestageAllowance || "");
      setsptfRecovery(AddchargeId.sptfRecovery || "");
      setdamageClaims(AddchargeId.damageClaims || "");
      setwithdrawnCharges(AddchargeId.withdrawnCharges || "");
      setwithdrawnSGST(AddchargeId.withdrawnSGST || "");
      setwithdrawnCGST(AddchargeId.withdrawnCGST || "");
      setwithdrawnIGST(AddchargeId.withdrawnIGST || "");
      setfreightCharges(AddchargeId.freightCharges || "");
      setremarks(AddchargeId.remarks || "");
    }
  }, [AddchargeId]);

  const auctionlist = useSelector(
    (state) => state?.SellerTaxgen?.getAllAuctiondata?.responseData
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
        "SellerTaxInvoiceDetails.xlsx"
      );
    }
  });

  const SearchViewDealBook = (e) => {
    e.preventDefault();
    if (Validate()) {
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        getAllSellerTaxAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS });
      }, 1000);
    }
  };

  const confirmInvoiceGeneration = () => {
    setConfirmationModalVisible(true);
  };
  const handleConfirm = (confirmed, invoicedetailid) => {
    dispatch(getSellerTaxGenByIdAction(invoicedetailid));
    setinvoiceDeatilsId(invoicedetailid);
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
              let tempJSON = {
                listInvoiceDeatilsId: viewTaxInvoiceData.invoicedetailid,
              };
              selectedBuyer.push(tempJSON);
            }
          }
        );
      if (selectedBuyer && selectedBuyer.length == 0) {
        toast.error("Please select atleast one data to generate invoice");
        return;
      }
      dispatch(getAllSellerTaxGenSaleGenAction(selectedBuyer));
      // toast.success("Invoice generation successful");
      setcatshowmodal(false);
      setConfirmationModalVisible(false);
      setIsAllSelected(false);
      setisSingleSelected(false);
      dispatch(getAllSellerTaxGenActionSuccess([]));
    } else {
      setConfirmationModalVisible(false);
      setisSingleSelected(false);
      setIsAllSelected(false);
    }
  };

  const searchData = () => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      pageNo = 1;
      setRows([]);
      fetchData();
    }, 1000);
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
  const fetchData = () => {
    dispatch(
      getAllSellerTaxAction({
        season: TaxInvoiceSearch.season,
        saleNo: TaxInvoiceSearch.saleNo,
        roleCode: "AUCTIONEER",
        userId: null,
        einvoiceEligibility: "0",
        status: null,
        mark: TaxInvoiceSearch.mark,
        seller: TaxInvoiceSearch.seller,
        bilingType: TaxInvoiceSearch.bilingType,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      getAllSellerTaxAction({
        season: TaxInvoiceSearch.season,
        saleNo: TaxInvoiceSearch.saleNo,
        roleCode: "AUCTIONEER",
        userId: null,
        einvoiceEligibility: "0",
        status: null,
        mark: TaxInvoiceSearch.mark,
        seller: TaxInvoiceSearch.seller,
        bilingType: TaxInvoiceSearch.bilingType,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const ResetViewBook = (e) => {
    e.preventDefault();
    setTaxInvoiceSearch({
      season: seasonYear,
      saleNo: "",
      roleCode: null,
      userId: null,
      einvoiceEligibility: "",
      status: "",
      mark: "",
      seller: "",
      bilingType: "",
    });
    pageNo = 1;
    setRows([]);
    getAllSellerTaxAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS });
    dispatch(getAllSellerTaxGenActionSuccess([]));
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
          // auctionCenterId: TaxInvoiceSearch.auctionCenterId,
          auctionCenterId: atob(window.location.pathname.split("/")[4]),
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
          auctionCenterId: atob(window.location.pathname.split("/")[4]),
        })
      );
    }

    if ("season" == name && value != "") {
      dispatch(
        getAllTaxInvoiceBuyerAction({
          season: seasonValue,
          auctionCenterId: atob(window.location.pathname.split("/")[4]),
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
          auctionCenterId: atob(window.location.pathname.split("/")[4]),
        })
      );

      // dispatch(
      //   getAllTaxInvoiceLotAction({
      //     season: TaxInvoiceSearch.season,
      //     saleNo: value,
      //     auctionCenterId: TaxInvoiceSearch.auctionCentre,
      //   })
      // );
    }
    if ("auctionDate" == name && value != null) {
      dispatch(
        getAllTaxInvoiceSessionAction({
          season: TaxInvoiceSearch.season,
          saleNo: TaxInvoiceSearch.saleNo,
          auctionDate: value,
          auctionCenterId: atob(window.location.pathname.split("/")[4]),
        })
      );
    }
  };
  const handleCloseModal = () => {
    const inputElement = document.getElementById("individualTaxInvoice");
    if (inputElement) {
      inputElement.value = "";
    }
    setModalOpen(false);
  };
  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      season: seasonYear,
      saleNo: TaxInvoiceSearch.saleNo,
      roleCode: "AUCTIONEER",
      userId: null,
      einvoiceEligibility: "0",
      status: null,
      mark: TaxInvoiceSearch.mark,
      seller: TaxInvoiceSearch.seller,
      bilingType: TaxInvoiceSearch.bilingType,
      url: "/postauction/sellertaxinvoice/search",
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

  useEffect(() => {
    if (getExportDataResponse != null && true == getExportDataApiCallResponse) {
      dispatch(getExportDataApiCall(false));
      if ("excel" == exportType) {
        Base64ToExcelDownload(
          getExportDataResponse,
          "SellerTaxInvoiceDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "SellerTaxInvoiceDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const ChargebyIddata = useSelector(
    (state) => state?.SellerTaxgen?.ChargeById?.responseData
  );
  let getAllTaxInvoiceResponseAllData = useSelector(
    (state) => state?.SellerTaxgen?.getAllSellerTaxGen
  );

  useEffect(() => {
    dispatch(
      getAllTaxInvoiceBuyerAction({
        season: TaxInvoiceSearch.season,
        auctionCenterId: atob(window.location.pathname.split("/")[4]),
      })
    );
    dispatch(getAllTaxInvoiceGenAction());
    dispatch(
      getAllTaxInvoiceSaleAction({
        season: TaxInvoiceSearch.season,
        saleNo: TaxInvoiceSearch.saleNo,
        auctionCenterId: atob(window.location.pathname.split("/")[4]),
      })
    );
    dispatch(
      getAllTaxInvoiceLotAction({
        season: TaxInvoiceSearch.season,
        saleNo: TaxInvoiceSearch.saleNo,
        auctionCenterId: atob(window.location.pathname.split("/")[4]),
        pageNumber: 1,
        pageSize: 10,
      })
    );
    dispatch(
      getAllSellerTaxInvoiceSessionAction({
        season: TaxInvoiceSearch.season,
        saleNo: TaxInvoiceSearch.saleNo,
        auctionDate: TaxInvoiceSearch.auctionDate,
        auctionCenterId: atob(window.location.pathname.split("/")[4]),
      })
    );
    dispatch(
      getAuctiondataAction({
        auctionCenterId: atob(window.location.pathname.split("/")[4]),
        roleCode: "SELLER",
      })
    );
    // dispatch(
    //   getAllSubmitChargeAction({
    //     invoiceDeatilsId: "1704",
    //   }).
    // );
    // dispatch(getAllSellerTaxGenBuyerAction());
    dispatch(getAllTeaTypes());
    // dispatch(getAllSellerTaxGenSaleGenAction());
    dispatch(
      fetchMarkRequest({
        auctionCenterId: atob(window.location.pathname.split("/")[4]),
      })
    );
    dispatch(fetchAuctionRequest());
    dispatch(getAllCategoriesAction());
    dispatch(fetchGradeRequest());
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

  const handleAddchargeId = (invoicedetailid) => {
    dispatch(getChargeTaxByIdAction(invoicedetailid));

    setShowmodalCharge(true);
  };

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
              invoiceDate: viewTaxInvoiceData.invoiceDate,
              buyerGSTIN: viewTaxInvoiceData.buyerGSTIN,
              invoiceValue: viewTaxInvoiceData.invoiceValue,
              transferId: viewTaxInvoiceData.transferId,
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
    dispatch(getAllTaxInvoiceActionSuccess([]));
  };

  function Actiontab() {
    return (
      <div class="Action">
        {modalRight?.some((ele) => ele === "64") && (
          <i
            className="fa fa-add"
            onClick={() => handleAddchargeId(invoiceDeatilsId)}
          ></i>
        )}
      </div>
    );
  }

  const handleSubmit = (event, flag) => {
    event.preventDefault();

    let dataForSubmit = {
      pils: formatDecimalValue(editingCharge?.pils) || "0.00",
      sellerChestageAllowance:
        formatDecimalValue(editingCharge?.sellerChestageAllowance) || "0.00",
      sptfRecovery: formatDecimalValue(editingCharge?.sptfRecovery) || "0.00",
      damageClaims: formatDecimalValue(editingCharge?.damageClaims) || "0.00",
      withdrawnCharges:
        formatDecimalValue(editingCharge?.withdrawnCharges) || "0.00",
      withdrawnSGST: formatDecimalValue(editingCharge?.withdrawnSGST) || "0.00",
      withdrawnCGST: formatDecimalValue(editingCharge?.withdrawnCGST) || "0.00",
      withdrawnIGST: formatDecimalValue(editingCharge?.withdrawnIGST) || "0.00",
      freightCharges: editingCharge?.freightCharges ?? "0.00",
      remarks: editingCharge?.remarks,
      netWarehouseCharges: editingCharge?.netWarehouseCharges ?? "0.00",
      invoiceDeatilsId: invoiceDeatilsId,
      buttonStatus: flag,
    };

    dispatch(getAllSellerTaxGenBuyerAction(dataForSubmit));
  };

  useEffect(() => {
    const newRows = getAllTaxInvoiceResponse || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      if (newRows.length > 0) {
        const index = currentRows.findIndex(
          (row) => row.invoicedetailid === newRows[0].invoicedetailid
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
    if (invoieceGenerateList && Array.isArray(invoieceGenerateList)) {
      let grossTeaValue = 0;
      let totalCharges = 0;
      let netAmount = 0;
      let totalSftp = 0;

      for (let i = 0; i < invoieceGenerateList.length; i++) {
        const taxInvoice = invoieceGenerateList[i];

        // Check if the values are valid numbers before adding to totals
        const grossTeaValueAmount = parseInt(taxInvoice.grossTeaValueAmount);
        const totalChargesValue = parseInt(
          taxInvoice.totalChargesofSellerandWarehouse
        );
        const netAmountPaidValue = parseInt(
          taxInvoice.netAmountPaidToWarehouse
        );
        const totalSftpValue = parseInt(
          taxInvoice.totalChargesofSellerandWarehouse
        );

        // Check if the parsed values are valid numbers
        if (!isNaN(grossTeaValueAmount)) {
          grossTeaValue += grossTeaValueAmount;
        }

        if (!isNaN(totalChargesValue)) {
          totalCharges += totalChargesValue;
        }

        if (!isNaN(netAmountPaidValue)) {
          netAmount += netAmountPaidValue;
        }

        if (!isNaN(totalSftpValue)) {
          totalSftp += totalSftpValue;
        }
      }

      // Set state with the updated values
      settotCharge(grossTeaValue);
      setnetAmount(totalCharges);
      setgrossTea(netAmount);
      settotSftp(totalSftp);
    }
  }, [getAllTaxInvoiceResponse]);

  const handleClear = () => {
    setpils("0.00");
    setsellerChestageAllowance("0.00");
    setsptfRecovery("0.00");
    setdamageClaims("0.00");
    setwithdrawnCharges("0.00");
    setwithdrawnSGST("");
    setwithdrawnCGST("");
    setwithdrawnIGST("");
    setfreightCharges("0.00");
    setremarks("");
    seteditingCharge({});
  };

  const handleAddcharge = () => {
    handleClear();
    setShowmodalCharge(false);
  };
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

  // let temGetAllTaxInvoiceResponseAllData = getAllTaxInvoiceResponseAllData;
  // temGetAllTaxInvoiceResponseAllData.responseData = tempData;
  // dispatch(
  //   getAllSellerTaxGenActionSuccess(temGetAllTaxInvoiceResponseAllData)
  // );

  const handleViewClickid = (invoicedetailid) => {
    dispatch(getSellerTaxGenByIdAction(invoicedetailid));
    setinvoiceDeatilsId(invoicedetailid);
    setShowmodal(true);
  };

  const currentDate = new Date();
  const [serialNumber, setserialNumber] = useState([]);
  const [selectedserialNumber, setselectedserialNumber] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [viewcertificateDetail, setviewcertificateDetail] = useState({});
  const [Loading, setloading] = useState(false);
  const [Base64Data, setBase64Data] = useState([]);
  const [Base64savedigitalsign, setBase64savedigitalsign] = useState([]);
  const [showOwnerModalHistory, setShowCirtificateModal] = useState(false);
  const HideCirtificateModal = () => setShowCirtificateModal(false);
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
      let urls = "postauction/sellertaxinvoice/gstresponse";
      dispatch(
        getGstExcelByIdAction({ urls, apiPayload: apiPayload && apiPayload[0] })
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
  const handleSGSTChange = (e) => {
    if (!viewMode) {
      const sgstValue = parseFloat(e.target.value) || 0;
      const newValues = {
        withdrawnSGST: sgstValue,
        withdrawnCGST: sgstValue,
      };

      if (editingCharge) {
        seteditingCharge({
          ...editingCharge,
          ...newValues,
        });
      } else {
        setwithdrawnSGST(newValues.withdrawnSGST);
        setwithdrawnCGST(newValues.withdrawnCGST);
      }
    }
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

  useEffect(() => {
    setTaxInvoiceSearch({
      season: seasonYear,
      saleNo: [],
      roleCode: null,
      userId: null,
      einvoiceEligibility: null,
      status: null,
      mark: null,
      seller: null,
      bilingType: null,
    });
    setRows([]);
    setpils("0.00");
    setsellerChestageAllowance("0.00");
    setsptfRecovery("0.00");
    setdamageClaims("0.00");
    setwithdrawnCharges("0.00");
    setwithdrawnSGST("");
    setwithdrawnCGST("");
    setwithdrawnIGST("");
    setfreightCharges("0.00");
    setremarks("");
    seteditingCharge({});
    setShowmodal(false);
    setShowmodalCharge(false);
    dispatch(getAllSellerTaxGenActionSuccess([]));
  }, []);
  // const handlePostRequest = async () => {

  //   if (selectedInvoiceNos?.length > 0 && selectedserialNumber !== null) {
  //     const url = "https://localhost:29739/teaboard/signer";
  //     const data = {
  //       action: "1",
  //       serialNumber: selectedserialNumber,
  //       data: null,
  //       publicKey: null,
  //       key: null,
  //     };
  //     const response = await axios.post(url, qs.stringify(data), {});
  //     const validTo = response.data.signerResponse.certificateDetail.validTo;
  //     const validDate = moment(validTo).format('YYYY-MM-DD HH:mm:ss');
  //     const currentDates = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
  //     console.log('Valid Date:', validDate);
  //     console.log('Current Date:', currentDates);
  //     const validD = new Date(validDate);
  //     const currentD = new Date(currentDates);
  //     const current_date = new Date();
  //     const isBetweenDates = currentD <= current_date && current_date <= validD;
  //     if (isBetweenDates) {
  //       setloading(true);
  //       try {
  //         const response = await axiosMain.post(
  //           "/postauction/sellertoauctioneerinvoice/saveDigitalSign",
  //           {
  //             base64: "",
  //             filename: "",
  //             deliveryInstructionId: "",
  //             deliveryInstructionIdlist: selectedInvoiceNos,
  //           }
  //         );
  //         if (response.data.statusCode === 200) {

  //           const base64Data = response.data.responseData;
  //           setBase64Data(base64Data);
  //           const url = "https://localhost:29739/teaboard/signer";
  //           try {
  //             const data = {
  //               action: "1",
  //               serialNumber: selectedserialNumber,
  //               data: null,
  //               publicKey: null,
  //               key: null,
  //             };
  //             if (data.serialNumber != "" || data.serialNumber != null) {

  //               const response = await axiosMain.post(url, qs.stringify(data), {});
  //               setviewcertificateDetail(
  //                 response?.data?.signerResponse?.certificateDetail
  //               );
  //               var datas = response.data.signerResponse?.certificateDetail;
  //               const keyValuePairs =
  //                 response.data.signerResponse?.certificateDetail.clientName.split(",");
  //               const cnField = keyValuePairs.find((pair) => pair.includes("CN="));
  //               const name = cnField.split("=")[1].trim();

  //               datas.clientName = name;

  //             } else {
  //               CustomToast.error("Please select certificate");
  //               setShowCirtificateModal(false);
  //             }
  //           } catch (error) {
  //             console.error("Error:", error.message);
  //           }
  //           console.log('response.data', response.data)
  //           for (const name of base64Data) {
  //             const signData = {
  //               serialnumber:selectedserialNumber,
  //               signPlace: "1",
  //               documentContent: name.publicKey,
  //               documentTitle: "Abc.pdf",
  //               organnizationName: "EPTL",
  //               place: atob(sessionStorage.getItem('argument11')),
  //               certificateName: datas.clientName,
  //             };
  //             const response = await axiosMain.post(
  //               "https://localhost:29739/teaboard/livesign/pdfsigner",
  //               signData
  //             );
  //             setBase64savedigitalsign(response.data);
  //             console.log('certificateDetail',response.data.publicKey)
  //             console.log("Response from pdfsigner:", response.data);
  //             if (response.data !== null && response.data !== "") {
  //               const data1 = [
  //                 {
  //                   base64: response.data.publicKey,
  //                   filename: name.filename,
  //                   deliveryInstructionId: name.deliveryInstructionId,
  //                   deliveryInstructionIdlist: selectedInvoiceNos,
  //                 },
  //               ];
  //               const response1 = await axiosMain.post(
  //                 "/postauction/sellertoauctioneerinvoice/saveDigitalSign",
  //                 data1
  //               );
  //               if (response1.data.statusCode === 200) {
  //                 CustomToast.success(response1.data.message);
  //               } else {
  //                 CustomToast.error(response1.data.message);
  //               }
  //             }
  //           }
  //         } else {
  //           setBase64Data([]);
  //         }
  //       } catch (error) {
  //         console.error("Error making POST request to Digitalsign:", error);
  //       } finally {
  //         setloading(false);
  //       }
  //     } else {
  //       CustomToast.error('Digital Certificate is expired');
  //     }
  //   } else {
  //     CustomToast.error("Please select rows and select certificate");
  //   }
  // };

  const formatDecimalValue = (value) => {
    // Ensure the value is a valid number
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return "0.00";
    }

    // Format the number to always have 2 decimal places
    const formattedValue = parsedValue.toFixed(2);

    return formattedValue;
  };
  return (
    <>
      <div>
        <div>
          <form onSubmit={SearchViewDealBook}>
            <div className="row">
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
                    {markList?.map((markList, index) => (
                      <option value={markList.markId}>
                        {markList.markName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Seller</label>
                  <select
                    name="Seller"
                    value={TaxInvoiceSearch.seller}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Seller</option>
                    {auctionlist?.map((auctionlist, index) => (
                      <option value={auctionlist.value}>
                        {auctionlist.value}
                      </option>
                    ))}
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
                  >
                    <option value="">Select Season</option>
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
                    <option value="SELECT">Select Sale No</option>
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
                  <label>Status Dropdown</label>
                  <select
                    name="bilingType"
                    value={TaxInvoiceSearch.bilingType}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Billing Type</option>
                    <option value="1">All</option>
                    <option value="2">Charges not applied</option>
                    <option value="3">Charges saved</option>
                    <option value="4">Charges submitted</option>
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
                    Cancel
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
                          className="Excel"
                          title="Invoice Generate"
                          onClick={() => confirmInvoiceGeneration()}
                        >
                          <i className="fa fa-download"></i>
                        </button>
                      )}
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
                  ) : (
                    ""
                  )}
                </div>
              </div>
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
                      <th>Mark</th>
                      <th>Category</th>
                      <th>Account Sale No</th>
                      <th>Seller Address</th>
                      <th>AuctioneerAddress</th>
                      <th>AuctioneerEmailId</th>
                      <th>TaxIdNo</th>
                      <th>TeaboardRegNo</th>
                      <th>Seller PAN No</th>
                      <th>Auctioneer CIN No</th>
                      <th>Service Tax Reg. No</th>
                      <th>Auctioneer PAN No</th>
                      <th>Seller Prompt Date</th>
                      <th>Selling Brokerage</th>
                      <th>Inspection Chgs</th>
                      <th>ReInspection Chgs</th>
                      <th>LotMoney (South )</th>
                      <th>ServiceChgs</th>
                      <th>TeaBoard Seller Charges</th>
                      <th>TeaBoard Service Tax</th>
                      <th>PILS</th>
                      <th>Seller_Chestage_Allowance</th>
                      <th>Freight Charges</th>
                      <th>SPTF Recovery :</th>
                      <th>Damage Claims</th>
                      <th>Withdrawn Charges</th>
                      <th>Withdrawn Service Charges</th>
                      <th>WarehouseChgs</th>
                      <th>TDSChgs</th>
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
                                <td>{data.mark}</td>
                                <td>{data.category}</td>
                                <td>{data.accountSaleNo}</td>
                                <td>{data.sellerAddress}</td>
                                <td>{data.auctioneerAddress}</td>
                                <td>{data.auctioneerEmailId}</td>
                                <td>{data.taxIdNo}</td>
                                <td>{data.teaboardRegNo}</td>
                                <td>{data.sellerPanNo}</td>
                                <td>{data.auctioneerCinNo}</td>
                                <td>{data.serviceTaxRegNo}</td>
                                <td>{data.auctioneerPANNo}</td>
                                <td>{data.sellerPromptDate}</td>
                                <td>{data.sellingBrokerage}</td>
                                <td>{data.inspectionChgs}</td>
                                <td>{data.reInspectionChgs}</td>
                                <td>{data.lotMoneyForSouth}</td>
                                <td>{data.serviceChgs}</td>
                                <td>{data.teaBoardSellerCharges}</td>
                                <td>{data.teaBoardServiceTax}</td>
                                <td>{data.pils}</td>
                                <td>{data.sellerChestageAllowance}</td>
                                <td>{data.freightCharges}</td>
                                <td>{data.sptfRecovery}</td>
                                <td>{data.damageClaims}</td>
                                <td>{data.withdrawnCharges}</td>
                                <td>{data.withdrawnServiceCharges}</td>
                                <td>{data.warehouseChgs}</td>
                                <td>{data.tdsChgs}</td>
                                {/* <td>{data.invoicedetailid}</td>
                        <td>{data.invoiceid}</td>
                        <td>{data.transferid}</td> */}
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
                                            handleViewClickid(
                                              data.invoicedetailid
                                            )
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
                { name: "referenceNo", title: "Reference No." },
                { name: "sellerName", title: "Seller" },
                { name: "markName", title: "Mark" },
                { name: "categoryName", title: "Category" },
                { name: "teaTypeName", title: "Tea Type" },
                { name: "season", title: "Season" },
                { name: "saleNo", title: "Sale No" },
                { name: "saleDate", title: "Sale date" },
                { name: "taxInvoiceNoForGoods", title: "Tax Invoice No." },
                { name: "buyerName", title: "Buyer" },
                { name: "bags", title: "Bags" },
                { name: "invoiceKg", title: "Invoice Kg" },
                { name: "sampleKg", title: "Sample Kg" },
                { name: "netKg", title: "Net Kg" },
                { name: "value", title: "Value" },
                { name: "grossValueRs", title: "PRS Seller Premium" },
                { name: "sgstonTeaValue", title: "SGST on Tea Value" },
                { name: "cgstonTeaValue", title: "CGST on Tea Value" },
                { name: "igstonTeaValue", title: "IGST on Tea Value" },
                { name: "Gross Value Rs.", title: "Gross Value Rs." },
                { name: "inspection", title: "Inspection" },
                { name: "reInspection", title: "Re-Inspection" },
                { name: "brokerage", title: "Brokerage" },
                { name: "serviceCharge", title: "Service Charge" },
                { name: "lotMoney", title: "Lot Money" },
                {
                  name: "sgstonAuctioneerServices",
                  title: "SGST on Auctioneer Services",
                },
                {
                  name: "cgstonAuctioneerServices",
                  title: "CGST on Auctioneer Services",
                },
                {
                  name: "igstonAuctioneerServices",
                  title: "IGST on Auctioneer Services",
                },
                {
                  name: "netAmountPaidToWarehouse",
                  title: "Net Amount Paid to Warehouse",
                },
                { name: "teaboardCharges", title: "Tea Board Charges" },
                {
                  name: "sgstonTeaBoardcharges",
                  title: "SGST on Tea Board charges",
                },
                {
                  name: "cgstonTeaBoardcharges",
                  title: "CGST on Tea Board charges",
                },
                {
                  name: "igstonTeaBoardcharges",
                  title: "IGST on Tea Board charges",
                },
                {
                  name: "action",
                  title: "Action",
                  getCellValue: (rows) => <Actiontab />,
                },
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
                {/* <button
                  type="button"
                  className="Excel"
                  onClick={() => InvoiceGen()}
                >
                  <i className="fa fa-download"></i>
                </button> */}
              </div>
              {categoryError && (
                <div className="error-message">{categoryError}</div>
              )}
            </div>
          </div>
        </Modal>
      )}
      {showmodalCharge && (
        <Modal
          show={showmodalCharge}
          onHide={handleViewClick}
          size="xl"
          centered
        >
          <Modal.Header>
            <Modal.Title>Add Charge</Modal.Title>
            <i className="fa fa-times CloseModal" onClick={handleAddcharge}></i>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>PILS</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingCharge?.pils || pils}
                        onChange={(e) =>
                          !viewMode &&
                          (editingCharge
                            ? seteditingCharge({
                                ...editingCharge,
                                pils: e.target.value,
                              })
                            : setpils(e.target.value))
                        }
                        disabled={viewMode}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Seller Chestage Allowance</label>
                      <input
                        type="number"
                        className="form-control"
                        value={
                          editingCharge?.sellerChestageAllowance ||
                          sellerChestageAllowance
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingCharge
                            ? seteditingCharge({
                                ...editingCharge,
                                sellerChestageAllowance: e.target.value,
                              })
                            : setsellerChestageAllowance(e.target.value))
                        }
                        disabled={viewMode}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>SPTF Recovery</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingCharge?.sptfRecovery || sptfRecovery}
                        onChange={(e) =>
                          !viewMode &&
                          (editingCharge
                            ? seteditingCharge({
                                ...editingCharge,
                                sptfRecovery: e.target.value,
                              })
                            : setsptfRecovery(e.target.value))
                        }
                        disabled={viewMode}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Damage Claims</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingCharge?.damageClaims || damageClaims}
                        onChange={(e) =>
                          !viewMode &&
                          (editingCharge
                            ? seteditingCharge({
                                ...editingCharge,
                                damageClaims: e.target.value,
                              })
                            : setdamageClaims(e.target.value))
                        }
                        disabled={viewMode}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Withdrawn Charges</label>
                      <input
                        type="number"
                        className="form-control"
                        value={
                          editingCharge?.withdrawnCharges || withdrawnCharges
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingCharge
                            ? seteditingCharge({
                                ...editingCharge,
                                withdrawnCharges: e.target.value,
                              })
                            : setwithdrawnCharges(e.target.value))
                        }
                        disabled={viewMode}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Withdrawn SGST</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingCharge?.withdrawnSGST || withdrawnSGST}
                        onChange={handleSGSTChange}
                        disabled={
                          viewMode ||
                          (editingCharge?.withdrawnIGST &&
                            editingCharge?.withdrawnIGST !== 0)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Withdrawn CGST</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingCharge?.withdrawnCGST || withdrawnCGST}
                        onChange={(e) =>
                          !viewMode &&
                          (editingCharge
                            ? seteditingCharge({
                                ...editingCharge,
                                withdrawnCGST: e.target.value,
                              })
                            : setwithdrawnCGST(e.target.value))
                        }
                        disabled={
                          viewMode ||
                          (editingCharge?.withdrawnIGST &&
                            editingCharge?.withdrawnIGST !== 0)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Withdrawn IGST</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingCharge?.withdrawnIGST || withdrawnIGST}
                        onChange={(e) =>
                          !viewMode &&
                          (editingCharge
                            ? seteditingCharge({
                                ...editingCharge,
                                withdrawnIGST: e.target.value,
                              })
                            : setwithdrawnIGST(e.target.value))
                        }
                        disabled={
                          viewMode ||
                          (editingCharge?.withdrawnSGST &&
                            editingCharge?.withdrawnSGST !== 0) ||
                          (editingCharge?.withdrawnCGST &&
                            editingCharge?.withdrawnCGST !== 0)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Freight Charges</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingCharge?.freightCharges || freightCharges}
                        onChange={(e) =>
                          !viewMode &&
                          (editingCharge
                            ? seteditingCharge({
                                ...editingCharge,
                                freightCharges: e.target.value,
                              })
                            : setfreightCharges(e.target.value))
                        }
                        disabled={viewMode}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Remarks</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingCharge?.remarks || remarks}
                        onChange={(e) =>
                          !viewMode &&
                          (editingCharge
                            ? seteditingCharge({
                                ...editingCharge,
                                remarks: e.target.value,
                              })
                            : setremarks(e.target.value))
                        }
                        disabled={viewMode}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Net Warehouse Charges.</label>
                      <input
                        className="form-control"
                        value={totCharge}
                        disabled={viewMode}
                      />
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className="col-lg-1000 mt-3">
                        <div className="TableBox">
                          <table className="table">
                            <thead>
                              <th colSpan={6} className="text-center">
                                Calculation
                              </th>
                              <tr>
                                <th>Gross Tea Value Amount</th>
                                <th>Total charges – SPTF</th>
                                <th>Total Charges (Seller and Warehouse)</th>
                                <th>Net Amount</th>
                              </tr>
                            </thead>
                            <tr>
                              <td>{grossTea}</td>
                              <td>{totalSftp}</td>
                              <td>{totCharge}</td>
                              <td>{netAmount}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {ChargebyIddata == null ||
                  (ChargebyIddata.cstatus !== 2 && ChargebyIddata !== null) ? (
                    <div className="col-md-12">
                      <div className="BtnGroup">
                        {modalRight?.some((ele) => ele === "69") && (
                          <button
                            className="SubmitBtn"
                            onClick={(event) => handleSubmit(event, 1)}
                          >
                            Submit
                          </button>
                        )}
                        {modalRight?.some((ele) => ele === "65") && (
                          <button
                            className="SubmitBtn"
                            onClick={(event) => handleSubmit(event, 0)}
                          >
                            Save
                          </button>
                        )}

                        <button className="Clear" onClick={handleClear}>
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
      <Modal
        show={confirmationModalVisible}
        onHide={() => handleConfirm(false)}
      >
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to Invoicegenrate?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleConfirm(false)}>
            No
          </Button>
          <Button variant="primary" onClick={() => handleConfirm(true)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
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
                  inputId="sellerTaxInvoice"
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

export default SellerTaxInvoice;
