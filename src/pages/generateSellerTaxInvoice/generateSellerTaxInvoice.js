import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import TableComponent from "../../components/tableComponent/TableComponent";
// import { fetchGrade } from "../../store/actions"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import UploadZip from "../uploadDocument/UploadFileZip";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import {
  fetchAuctionRequest,
  fetchMarkRequest,
  getAllCategoriesAction,
  getAllTeaTypes,
} from "../../store/actions";
import CustomToast from "../../components/Toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  bindAuctionDate,
  bindsalenobyseason,
  sellertoauctioneerinvoice_search,
  viewinvoicedetail,
  get_searchinvoiceSuccess,
  sellertoauctioneerinvoice_create,
  get_invoiceviewSuccess,
  getExportData,
  getExportDataApiCall,
  getAllTaxInvoiceSessionAction,
  getAllTaxInvoiceSaleAction,
  getAllTaxInvoiceBuyerAction,
  getExportDataSeller,
  getGstExcelByIdAction,
  getExportDataSellerApiCall,
} from "../../store/actions";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import axiosMain from "../../http/axios/axios_main";
import qs from "qs";
import axios from "axios";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { ThreeDots } from "react-loader-spinner";

let pageNo = 1;
const data = [
  {
    state: "California",
    stateCode: "CA",
    stateInitial: "C",
    action: "Some action",
  },
  {
    state: "New York",
    stateCode: "NY",
    stateInitial: "NY",
    action: "Another action",
  },
];

function GenerateSellerTaxInvoice({
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
  const [loader, setLoader] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [exportType, setexportType] = useState(null);
  const [season, setSeason] = useState(currentYear);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [allAuctionDate, setallAuctionDate] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  // const seasonYear = moment().year();
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  // const seasonYear = 2023;
  const dispatch = useDispatch();
  const handleCloseHistory = () => setShowmodal(false);
  const [showmodal, setShowmodal] = useState(false);
  const [exportTypes, setexportTypes] = useState("");
  const [viewData, setviewData] = useState([]);
  const [rows, setRows] = useState([]);

  const [DealBookSearch, setDealBookSearch] = useState({
    season: season + "",
    saleNo: "",
    auctionDate: null,
    einvoiceEligibility: null,
    auctionCenterId: atob(window.location.pathname.split("/")[4]),
    roleCode: atob(sessionStorage.getItem("argument6")),
    userId: parseInt(atob(sessionStorage.getItem("argument2"))),
    exportType: null,
    isExport: 0,
    pageNo: 1,
    noOfRecords: NO_OF_RECORDS,
  });
  const [ViewDealBookTaoData, setViewDealBookTaoData] = useState([]);
  const [allSaleNoList, setallSaleNoList] = useState([]);
  const BuyerList = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoiceBuyer?.responseData
  );
  const ViewDealBookList = async () => {
    DealBookSearch.exportType = null;
    DealBookSearch.isExport = null;
    if (
      DealBookSearch.saleNo == null ||
      DealBookSearch.saleNo == "" ||
      DealBookSearch.saleNo == undefined
    ) {
      CustomToast.error("Please select sale No.");
      return false;
    } else {
      if (DealBookSearch.auctionDate == "") {
        DealBookSearch.auctionDate = null;
      }
      if (DealBookSearch.einvoiceEligibility == "") {
        DealBookSearch.einvoiceEligibility = null;
      }
      dispatch(
        sellertoauctioneerinvoice_search({
          ...DealBookSearch,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
      setRows([]);
    }
  };
  const handleUploadClick = () => {
    let selectedBuyer = searchResultss.filter(
      (viewTaxInvoiceData) => viewTaxInvoiceData.isSelected
    );

    if (selectedBuyer.length === 0) {
      toast.error("Please select at least one data to upload.");
      return;
    }

    setModalOpen(true);
  };
  const handleUploadDocument = () => {
    if (uploadedFiles.length === 0) {
      setUploadDocumentError("Please select a file.");
    } else {
      let selectedBuyer = [];
      searchResultss &&
        searchResultss.map((viewTaxInvoiceData, viewTaxInvoiceDataIndex) => {
          if (
            viewTaxInvoiceData &&
            viewTaxInvoiceData.isSelected &&
            true == viewTaxInvoiceData.isSelected
          ) {
            selectedBuyer.push(viewTaxInvoiceData.invoiceNo);
          }
        });

      if (selectedBuyer && selectedBuyer.length > 1) {
        toast.error("Must be select only one record");
        return;
      }

      const apiPayload = uploadedFiles.map((file) => ({
        base64: file.documentContent,
        filename: file.documentName,
        invoiceno: selectedInvoiceNos && selectedInvoiceNos[0],
        userId: atob(sessionStorage.getItem("argument2")),
      }));
      let urls = "postauction/sellertoauctioneerinvoice/gstresponse";
      dispatch(
        getGstExcelByIdAction({ urls, apiPayload: apiPayload && apiPayload[0] })
      );
      setUploadDocumentError(null);
      setModalOpen(false);
      setUploadedFiles("");
      removeAllFiles("");
      setIsAllSelected(false);
      setConfirmationModalVisible(false);
      setRows([]);
      setViewDealBookTaoData([]);
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

  const handleImportExcelClick = (exportTypes) => {
    setexportTypes("");
    let selectedBuyer = [];
    searchResultss &&
      searchResultss.map((viewTaxInvoiceData, viewTaxInvoiceDataIndex) => {
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
      });
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
    setIsAllSelected(false);
    setRows([]);
    setViewDealBookTaoData([]);
  };

  useEffect(() => {
    dispatch(
      getAllTaxInvoiceBuyerAction({
        season: seasonYear + "",
        auctionCenterId: atob(window.location.pathname.split("/")[4]),
      })
    );
    dispatch(get_searchinvoiceSuccess([]));
    dispatch(get_invoiceviewSuccess([]));
    setShowmodal(false);
    setviewData([]);
  }, []);
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
  const searchResults1 = useSelector((state) => state);
  const searchResults = useSelector(
    (state) =>
      state?.generateSellerTaxInvoiceReducer?.genSellerTaxInvoiceSearch
        ?.responseData
  );
  const searchResultss = useSelector(
    (state) =>
      state?.generateSellerTaxInvoiceReducer?.genSellerTaxInvoiceSearch
        ?.responseData
  );
  useEffect(() => {
    if (
      searchResults != undefined &&
      searchResults != null &&
      searchResults != ""
    ) {
      setViewDealBookTaoData(searchResults);
    } else {
      setViewDealBookTaoData([]);
    }
  }, [searchResults]);
  const viewResults = useSelector(
    (state) =>
      state?.generateSellerTaxInvoiceReducer?.genSellerTaxInvoiceView
        ?.responseData
  );
  useEffect(() => {
    if (viewResults != undefined && viewResults != null && viewResults != "") {
      setviewData(viewResults);
      setShowmodal(true);
    } else {
      setviewData([]);
      setShowmodal(false);
    }
  }, [viewResults]);

  useEffect(() => {
    dispatch(getAllTeaTypes());

    dispatch(fetchMarkRequest());
    dispatch(fetchAuctionRequest());
    dispatch(getAllCategoriesAction());
  }, []);

  const bindAuctionDatelist = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoiceSale?.responseData
  );
  useEffect(() => {
    setallAuctionDate(bindAuctionDatelist);
  }, [bindAuctionDatelist]);

  useEffect(() => {
    if (searchResultss && searchResultss.length > 0) {
      setRows((prevRows) => [...prevRows, ...searchResultss]);
    }
  }, [searchResultss]);

  const handleCloseModal = () => {
    const inputElement = document.getElementById("individualTaxInvoice");
    if (inputElement) {
      inputElement.value = "";
    }
    setModalOpen(false);
  };
  const listSaleNo = useSelector(
    (state) => state?.invoiceListReducer?.bindsalenobyseason?.responseData
  );
  useEffect(() => {
    setallSaleNoList(listSaleNo);
  }, [listSaleNo]);

  useEffect(() => {
    if (
      DealBookSearch.saleNo !== "SELECT" &&
      DealBookSearch.saleNo !== "" &&
      DealBookSearch.saleNo !== null
    ) {
      dispatch(
        bindAuctionDate({
          season: seasonYear.toString(),
          saleNo: DealBookSearch.saleNo,
          auctionCenterId: atob(window.location.pathname.split("/")[4]),
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
    }
  }, [DealBookSearch.saleNo]);
  const SearchViewDealBook = (e) => {
    e.preventDefault();
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      ViewDealBookList();
    }, 1000);
  };

  //Export
  const handleExport = (exportTypee) => {
    if (
      DealBookSearch.saleNo == null ||
      DealBookSearch.saleNo == "" ||
      DealBookSearch.saleNo == undefined
    ) {
      CustomToast.error("Please select sale No.");
      return false;
    } else {
      setexportType(exportTypee);
      DealBookSearch.exportType = exportTypee;
      DealBookSearch.isExport = 1;
      dispatch(getExportData(DealBookSearch));
    }
  };

  const getExportDataResponse = useSelector(
    (state) => state.documentReducer.exportData.responseData?.exported_file
  );

  const getExportDataApiCallResponse = useSelector(
    (state) => state.documentReducer.exportDataApiCall
  );

  useEffect(() => {
    if (getExportDataResponse != null && true == getExportDataApiCallResponse) {
      if ("excel" == exportType) {
        Base64ToExcelDownload(getExportDataResponse, "InvoiceList.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "InvoiceList.pdf",
          `data:application/pdf;base64`
        );
      }
      dispatch(getExportDataApiCall(false));
      DealBookSearch.exportType = null;
      DealBookSearch.isExport = null;
    }
  });
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      sellertoauctioneerinvoice_search({
        ...DealBookSearch,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
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
  //Export end
  const ResetViewBook = (e) => {
    e.preventDefault();
    setallAuctionDate([]);
    setDealBookSearch({
      season: seasonYear.toString(),
      saleNo: "",
      auctionDate: "",
      einvoiceEligibility: "",
      auctionCenterId: atob(window.location.pathname.split("/")[4]),
      userId: atob(sessionStorage.getItem("argument2")),
      roleCode: atob(sessionStorage.getItem("argument6")),
    });
    pageNo = 1;
    setRows([]);
    sellertoauctioneerinvoice_search({
      ...DealBookSearch,
      pageNo: pageNo,
      noOfRecords: NO_OF_RECORDS,
    });
    setViewDealBookTaoData([]);
  };
  //Check
  const allDocDownload = () => {
    let selectedBuyer = [];

    rows &&
      rows.map((rows, ViewDealBookTaoDataIndex) => {
        if (rows && rows.isSelected && true == rows.isSelected) {
          selectedBuyer.push(rows);
        }
      });

    if (selectedBuyer && selectedBuyer.length == 0) {
      toast.error("Please select atleast one data to generate invoice");
      return;
    }
    let downloadAlldata = {
      invoiceSToADtoList: selectedBuyer,
      userId: parseInt(atob(sessionStorage.getItem("argument2"))),
      auctionCenterId: atob(window.location.pathname.split("/")[4]),
    };
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(sellertoauctioneerinvoice_create(downloadAlldata));
    }, 1000);

    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      ViewDealBookList();
    }, 1000);
  };

  const [selectedInvoiceNos, setSelectedInvoiceNos] = useState([]);
  console.log("selectedInvoiceNos", selectedInvoiceNos);
  const checkBoxSelect = (index, key, value, isSingleSelected) => {
    let tempData = [];

    const updatedData = [...rows];
    updatedData[index] = {
      ...updatedData[index],
      [key]: value,
    };

    if (isSingleSelected && value) {
      setSelectedInvoiceNos((prevSelected) => [
        ...prevSelected,
        updatedData[index].invoiceNo,
      ]);
    } else {
      setSelectedInvoiceNos((prevSelected) =>
        prevSelected.filter(
          (invoiceNo) => invoiceNo !== updatedData[index].invoiceNo
        )
      );
    }

    if (isSingleSelected == true) {
      tempData =
        rows &&
        rows.map((rows, ViewDealBookTaoDataIndex) => {
          if (index == ViewDealBookTaoDataIndex) {
            rows[key] = value;
          }

          return rows;
        });

      let isAllSelected = false;
      let count = 0;
      rows &&
        rows.map((rows, ViewDealBookTaoDataIndex) => {
          if (rows && rows.isSelected && true == rows.isSelected) {
            count = count + 1;
          }
        });

      if (count == rows.length) {
        isAllSelected = true;
      }

      setIsAllSelected(isAllSelected);
    } else {
      tempData =
        rows &&
        rows.map((rows, ViewDealBookTaoDataIndex) => {
          rows[key] = value;
          return rows;
        });
      setIsAllSelected(value);
    }

    setRows(tempData);
  };
  //Checkend

  const handleViewDealSearch = (e) => {
    const { name, value } = e.target;
    const seasonValue = name === "season" ? String(value) : value;
    setDealBookSearch((prevDealBookSearch) => ({
      ...prevDealBookSearch,
      [name]: seasonValue,
    }));
    setSeason(seasonValue);

    if ("auctionCentre" == null && "auctionCentre" == "") {
      setDealBookSearch((prevDealBookSearch) => ({
        ...prevDealBookSearch,
        season: "",
        saleNo: "",
      }));
    }
    if ("auctionCentre" == name && value != "") {
      dispatch(
        getAllTaxInvoiceSessionAction({
          season: DealBookSearch.season,
          saleNo: DealBookSearch.saleNo,
          auctionDate: value,
          auctionCenterId: DealBookSearch.auctionCenterId,
        })
      );

      setDealBookSearch((prevDealBookSearch) => ({
        ...prevDealBookSearch,
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
          auctionCenterId: DealBookSearch.auctionCenterId,
        })
      );
      setDealBookSearch((prevDealBookSearch) => ({
        ...prevDealBookSearch,
        saleNo: "",
      }));
    }

    if ("saleNo" == name && value != "") {
      dispatch(
        getAllTaxInvoiceSaleAction({
          season: DealBookSearch.season,
          saleNo: value,
          auctionCenterId: DealBookSearch.auctionCenterId,
        })
      );
    }
    if (value === "") {
      dispatch(getAllTaxInvoiceSaleAction([]));
    }

    // dispatch(
    //   getAllTaxInvoiceLotAction({
    //     season: DealBookSearch.season,
    //     saleNo: value,
    //     auctionCenterId: DealBookSearch.auctionCentre,
    //   })
    // );
    if ("auctionDate" == name && value != null) {
      dispatch(
        getAllTaxInvoiceSessionAction({
          season: DealBookSearch.season,
          saleNo: DealBookSearch.saleNo,
          auctionDate: value,
          auctionCenterId: DealBookSearch.auctionCenterId,
        })
      );
    }
  };

  const DownloadExcel = () => {
    const data = ViewDealBookTaoData;
    if (data?.length > 0) {
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "ViewDealBook");

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "ViewDealBook.xlsx");
    } else {
      CustomToast.error("No Data Found");
    }
  };

  useEffect(() => {
    if (
      atob(window.location.pathname.split("/")[4]) != "" &&
      atob(window.location.pathname.split("/")[4]) != null &&
      atob(window.location.pathname.split("/")[4]) != undefined
    ) {
      let data = {
        season: seasonYear.toString(),
        auctionCenterId: atob(window.location.pathname.split("/")[4]),
      };
      dispatch(bindsalenobyseason(data));
    }
  }, []);
  //FileView
  const handleView = (data) => {
    dispatch(viewinvoicedetail(data.invoicedetailid));
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

  const handleDropdownChange = (event) => {
    const selectedSerialNumber = event.target.value;
    setselectedserialNumber(selectedSerialNumber);
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

  const handlePostRequest = async () => {
    if (selectedInvoiceNos?.length > 0) {
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
            "/postauction/sellertoauctioneerinvoice/base64DigitalSign",
            {
              base64: "",
              filename: "",
              invoiceNo: "",
              invoicenolist: selectedInvoiceNos,
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
                place: atob(localStorage.getItem("argument11")),
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
                    invoicenolist: selectedInvoiceNos,
                  },
                ];
                const response1 = await axiosMain.post(
                  "/postauction/sellertoauctioneerinvoice/saveDigitalSign",
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
    setDealBookSearch({
      season: seasonYear.toString(),
      saleNo: "",
      auctionDate: "",
      einvoiceEligibility: "",
      auctionCenterId: atob(window.location.pathname.split("/")[4]),
      userId: atob(sessionStorage.getItem("argument2")),
      roleCode: atob(sessionStorage.getItem("argument6")),
    });
    setRows([]);
    sellertoauctioneerinvoice_search({
      ...DealBookSearch,
      pageNo: pageNo,
      noOfRecords: NO_OF_RECORDS,
    });
    setShowmodal(false);
    setViewDealBookTaoData([]);
    dispatch(getAllTeaTypes([]));
    dispatch(fetchMarkRequest([]));
    dispatch(fetchAuctionRequest([]));
    dispatch(getAllCategoriesAction([]));
  }, []);

  return (
    <>
      <div>
        <div>
          <form onSubmit={SearchViewDealBook}>
            <div className="row">
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Season</label>
                  <label className="errorLabel"> * </label>
                  <select
                    name="season"
                    value={DealBookSearch.season}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
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
                    value={DealBookSearch.saleNo}
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
                    value={DealBookSearch.auctionDate}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Auction Date </option>
                    {allAuctionDate?.map((allAuctionDate, index) => (
                      <option value={allAuctionDate.saleDate}>
                        {allAuctionDate.saleDate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label> E-Invoice Eligibility </label>
                  <select
                    name="einvoiceEligibility"
                    value={DealBookSearch.einvoiceEligibility}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select E-Invoice Eligibility</option>
                    <option value="1">Yes </option>
                    <option value="0">No </option>
                  </select>
                </div>
              </div>
              {modalRight?.some((ele) => ele === "12") && (
                <div className="col-12">
                  <div className="BtnGroup">
                    <button type="submit" className="SubmitBtn">
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
                        {modalRight?.some((ele) => ele === "56") && (
                          <button
                            type="button"
                            className="SubmitBtn"
                            onClick={() => allDocDownload()}
                          >
                            Generate Invoice
                          </button>
                        )}
                        {modalRight?.some((ele) => ele === "48") && (
                          <button
                            type="button"
                            className="Excel"
                            title="Export Excel"
                            onClick={() => DownloadExcel()}
                          >
                            <i className="fa fa-file-excel"></i>
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
              )}
            </div>
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
                      <option key={item.serialNumber} value={item.serialNumber}>
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
          </form>
        </div>
        {modalRight?.some((ele) => ele === "12") && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="TableBox">
                <table className="table">
                  <thead>
                    <tr>
                      {rows?.length > 0 ? (
                        <th>
                          <center>
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
                          </center>
                        </th>
                      ) : (
                        ""
                      )}
                      <th>Sr.</th>
                      <th>Season</th>
                      <th>Sale No</th>
                      <th>Sale Date</th>
                      <th>Reference No (Invoice)</th>
                      <th>Seller Name</th>
                      <th>Invoice No. </th>
                      <th>Invoice Date</th>
                      <th>Tea Type</th>
                      <th>Total Invoice Amount </th>
                      <th>E-Invoice Eligibility (IRN)</th>
                      <th>Status</th>
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
                                <td>{data.season}</td>
                                <td>{data.saleNo}</td>
                                <td>{data.saleDate}</td>
                                <td>{data.referenceNo}</td>
                                <td>{data.sellerName}</td>
                                <td>{data.invoiceNo}</td>
                                <td>{data.invoiceDate}</td>
                                <td>{data.teaType}</td>
                                <td>{data.totalInvoiceAmount}</td>
                                <td>{data.einvoiceEligibility}</td>
                                <td>{data.status}</td>
                                <td className="Action">
                                  {data.cstatus !== 0 && (
                                    <>
                                      {modalRight?.some(
                                        (ele) => ele === "3"
                                      ) && (
                                        <i
                                          className="fa fa-eye"
                                          title="View"
                                          onClick={() => handleView(data)}
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
            </div>
          </div>
        )}
      </div>
      {showmodal && (
        <Modal
          show={showmodal}
          onHide={handleCloseHistory}
          backdrop="static"
          size="xl"
          centered
        >
          <Modal.Header>
            <Modal.Title>View Invoice Detail</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={handleCloseHistory}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-4">
              <div className="col-12">
                <div className="TableBox">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Season</th>
                        <th>Sale No</th>
                        <th>Sale Date</th>
                        <th>Tea Type</th>
                        <th>Seller Name</th>
                        <th>Invoice Date</th>
                        <th>Lot No</th>
                        <th>Mark Code</th>
                        <th>Grade</th>
                        <th>Garden Invoice Ref No</th>
                        <th>Category Code</th>
                        <th>Total Packages</th>
                        <th>Gross In Kgs</th>
                        <th>Sampling Qty In Kgs</th>
                        <th>Short/Excess Weight</th>
                        <th>Net In Kgs</th>
                        <th>Total In Kgs</th>
                        <th>Deal Price</th>
                        <th>Deal Value </th>
                        <th>SGST</th>
                        <th>CGST</th>
                        <th>IGST</th>
                        <th>Net Amount </th>
                        <th>Invoice No</th>
                        <th>HSN Code</th>
                        <th>Goods Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewResults?.length > 0 ? (
                        <>
                          {viewResults?.map((data, index) => (
                            <tr key={index}>
                              <td>{data.season}</td>
                              <td>{data.saleNo}</td>
                              <td>{data.saleDate}</td>
                              <td>{data.teaType}</td>
                              <td>{data.sellerName}</td>
                              <td>{data.invoiceDate}</td>
                              <td>{data.lotNo}</td>
                              <td>{data.markCode}</td>
                              <td>{data.grade}</td>
                              <td>{data.categoryCode}</td>
                              <td>{data.gardenInvoiceRefNo}</td>
                              <td>{data.totalPackages}</td>
                              <td>{data.grossInKgs}</td>
                              <td>{data.samplingQtyInKgs}</td>
                              <td>{data.excessWeight}</td>
                              <td>{data.netInKgs}</td>
                              <td>{data.totalInKgs}</td>
                              <td>{data.dealPrice}</td>
                              <td>{data.dealValue}</td>
                              <td>{data.sgst}</td>
                              <td>{data.cgst}</td>
                              <td>{data.igst}</td>
                              <td>{data.netAmount}</td>
                              <td>{data.invoiceNo}</td>
                              <td>{data.hsncode}</td>
                              <td>{data.goodsDescription}</td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <>
                          <tr>
                            <td colSpan={30}>
                              <div className="NoData">No Data</div>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
      {rows?.length > 19 ? (
        <>
          <button class="SubmitBtn" onClick={handleViewMore}>
            View More
          </button>
        </>
      ) : (
        ""
      )}
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

export default GenerateSellerTaxInvoice;
