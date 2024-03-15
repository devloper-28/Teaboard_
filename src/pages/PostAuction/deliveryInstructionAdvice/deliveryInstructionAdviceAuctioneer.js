/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axiosMain from "../../../http/axios/axios_main";
import CustomToast from "../../../components/Toast";
import {
  fetchAuctionRequest,
  getExportData,
  getExportDataApiCall,
} from "../../../store/actions";
import { useSelector } from "react-redux";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import UploadMultipleDocuments from "../../uploadDocument/UploadMultipleDocuments";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";
import axios from "axios";
import qs from "qs";
import moment from "moment";
import { Modal } from "react-bootstrap";
import Base64ToExcelDownload from "../../Base64ToExcelDownload";
import { uploadedFileDownload } from "../../uploadDocument/UploadedFileDownload";
import { NO_OF_RECORDS } from "../../../constants/commonConstants";
import { ThreeDots } from "react-loader-spinner";

function DeliveryInstructionAdviceAuctioneer({modalRight}) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 5; i++) {
    const year = currentYear - i;
    years.push(year);
  }
  const [showOwnerModalHistory, setShowCirtificateModal] = useState(false);
  const HideCirtificateModal = () => setShowCirtificateModal(false);
  const [expanded, setExpanded] = React.useState("panel1");
  const [factoryExpanded, setFactoryExpanded] = React.useState("panel1");
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId } =useAuctionDetail();
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const currentDate = new Date();
  const [ViewDealBookTaoData, setViewDealBookTaoData] = useState([]);
  const [allSaleNoList, setallSaleNoList] = useState([]);
  const [allBuyerList, setallBuyerListList] = useState([]);
  const [allAuctionCenterList, setallAuctionCenterList] = useState([]);
  const [season, setSeason] = useState(currentYear);
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const [pageNo, setPageNo] = useState(2);
  const [exportType, setexportType] = useState("");
  const [serialNumber, setserialNumber] = useState([]);
  const [selectedserialNumber, setselectedserialNumber] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [viewcertificateDetail, setviewcertificateDetail] = useState({});
  const [Loading, setloading] = useState(false);
  const [Base64Data, setBase64Data] = useState([]);
  const [Base64savedigitalsign, setBase64savedigitalsign] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedDataOfList, setselectedDataOfList] = useState([]);
  const [selectedDataOfExportExcel, setselectedDataOfExportExcel] = useState([]);
  const [ViewBuyerData, setViewBuyerData] = useState([]);
  const handleChangeFactoryOwnerExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      setViewBuyerData([]);
    }
  };
  const [DealBookSearch, setDealBookSearch] = useState({
    season: String(currentYear),
    saleNo: null,
    loggedinfromAuctionCenterName: auctionCenterId,
    buyerName: null,
    status: null,
  });
  const StatusList = [
    { status: "Split DI", id: 0 },
    { status: "DI Generated", id: 1 },
    { status: "DI Signed", id: 2 },
    { status: "Delivery Requested", id: 3 },
    { status: "Delivery Completed", id: 4 },
  ];

  const getAllAuctionCenterList = useSelector(
    (res) => res.warehouseUserRegistration.auctionCenter?.responseData
  );
  const ExportExcelDatas = useSelector(
    (state) => state.documentReducer.exportData.responseData?.exported_file
  );
  const getExportDataApiCallResponse = useSelector(
    (state) => state.documentReducer.exportDataApiCall
  );

  const Validate = () => {
    let isValid = true;
    if (
      DealBookSearch.season == null ||
      DealBookSearch.season == "SELECT" ||
      DealBookSearch.season == ""
    ) {
      CustomToast.error("Please select season");
      isValid = false;
      return;
    }
    if (
      DealBookSearch.saleNo == null ||
      DealBookSearch.saleNo == "SELECT" ||
      DealBookSearch.saleNo == ""
    ) {
      CustomToast.error("Please select sale no");
      isValid = false;
      return;
    }
    return isValid;
  };
  const [loader, setLoader] = useState(false);
  const SearchViewDealBook = async (e) => {
    e.preventDefault();
    if (Validate()) {
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        ViewDealBookList();
      }, 1000);
    }
  };
  const ViewDealBookList = async () => {
    try {
      const response = await axiosMain.post(
        "/postauction/deliveryinstruction/auctioneer/search",
        { ...DealBookSearch, pageNo: 1, noOfRecords: NO_OF_RECORDS }
      );
      setViewDealBookTaoData(response.data.responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleViewMore = async () => {
    try {
      const response = await axiosMain.post(
        "/postauction/deliveryinstruction/auctioneer/search",
        {
          ...DealBookSearch,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        }
      );

      if (Array.isArray(response.data.responseData)) {
        if (response.data.responseData.length === 0) {
        } else {
          setViewDealBookTaoData((prevData) => [
            ...prevData,
            ...response.data.responseData,
          ]);
          setPageNo((prevPageNo) => prevPageNo + 1);
        }
      } else {
        console.error(
          "Response data is not an array:",
          response.data.responseData
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleViewDealSearch = (e) => {
    var { name, value } = e.target;
    var selectedValue = value != "" ? value : null;
    if (name == "status" && selectedValue == "") {
      selectedValue = null;
    }
    if (name == "loggedinfromAuctionCenterName" && selectedValue == "") {
      selectedValue = null;
    }
    if (name == "buyerName" && selectedValue == "") {
      selectedValue = null;
    }
    setDealBookSearch({ ...DealBookSearch, [name]: selectedValue });
    setSeason(DealBookSearch.season);
  };
  const handleExport = (exportType) => {
    const updatedDealBookSearch = {
      ...DealBookSearch,
      url: "/postauction/deliveryinstruction/auctioneer/search",
      exportType: exportType,
      isExport: 1,
    };
    setexportType(exportType);
    dispatch(getExportData(updatedDealBookSearch));
  };
  const getAuctioneer = () => {
    axiosMain
      .post("/admin/getAllUser/search", {
        userType: 2,
        isParentId: 0,
        roleCode: "BUYER",
      })
      .then((response) => {
        setallBuyerListList(response.data.responseData);
      })
      .catch((error) => {});
  };
  const getStatusText = (id) => {
    switch (id) {
      case 0:
        return "Split DI";
      case 1:
        return "DI Generated";
      case 2:
        return "DI Signed";
      case 3:
        return "Delivery Requested";
      case 4:
        return "Delivery Completed";
      default:
        return "-";
    }
  };
  const listCheckboxChange = (index, isChecked) => {
    if (isChecked) {
      setSelectedInvoices((prevSelectedRows) => [
        ...prevSelectedRows,
        ViewDealBookTaoData[index].deliveryInstructionId,
      ]);
    } else {
      setSelectedInvoices((prevSelectedRows) =>
        prevSelectedRows.filter((_, i) => i !== index)
      );
    }

    if (isChecked) {
      const selectedRow = {
        deliveryInstructionId: ViewDealBookTaoData[index].deliveryInstructionId,
        status: ViewDealBookTaoData[index].status,
      };
      const selectedRowForExportExcel = {
        sr: index,
        deliveryInstructionId: ViewDealBookTaoData[index].deliveryInstructionId,
        totalPackage: ViewDealBookTaoData[index].totalPackage,
        lotNo: ViewDealBookTaoData[index].lotNo,
        markName: ViewDealBookTaoData[index].markName,
        auctioneerName: ViewDealBookTaoData[index].auctioneerName,
        wareHouseName: ViewDealBookTaoData[index].wareHouseName,
        referenceNo: ViewDealBookTaoData[index].referenceNo,
        deliveryInstructionAdviceNo:
          ViewDealBookTaoData[index].deliveryInstructionAdviceNo,
        dealIdentificationNo: ViewDealBookTaoData[index].dealIdentificationNo,
        diDate: ViewDealBookTaoData[index].diDate,
        totalQuantity: ViewDealBookTaoData[index].totalQuantity,
        totalAmount: ViewDealBookTaoData[index].totalAmount,
        status: ViewDealBookTaoData[index].status,
      };

      setselectedDataOfList((prevSelectedData) => [
        ...prevSelectedData,
        selectedRow,
      ]);

      setselectedDataOfExportExcel((prevSelectedData) => [
        ...prevSelectedData,
        selectedRowForExportExcel,
      ]);
    } else {
      // If the row is unchecked, remove the selected data from the array
      setselectedDataOfList((prevSelectedData) =>
        prevSelectedData.filter(
          (row) =>
            row.deliveryInstructionId !==
            ViewDealBookTaoData[index].deliveryInstructionId
        )
      );
      setselectedDataOfExportExcel((prevSelectedData) =>
        prevSelectedData.filter(
          (row) =>
            row.deliveryInstructionId !==
            ViewDealBookTaoData[index].deliveryInstructionId
        )
      );
    }

    // Update the selectedRows state
    if (isChecked) {
      setSelectedRows([...selectedRows, index]);
    } else {
      setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
    }
  };
  const ViewMore = (id) => {
    const deliveryIds = selectedDataOfList.map(
      (item) => item.deliveryInstructionId
    );
    const deliveryIdsString = deliveryIds.join(",");

    const DataIds = id != null ? id : deliveryIdsString;

    if (DataIds == null || DataIds == "") {
      CustomToast.error("Please select at least one row before export.");
      return;
    }

    var url = `/postauction/deliveryinstruction/auctioneer/view/${DataIds}`;

    axiosMain
      .get(url)
      .then((response) => {
        if (response.data.statusCode === 200) {
          CustomToast.success(response.data.message);
          setViewBuyerData(response.data.responseData);
          setExpanded("panel2");
        } else {
          CustomToast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("POST request failed");
        console.error("Error:", error);
      });
  };
  const convertBase64ToBlob = (base64Data, contentType) => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };
  const GetPDF = () => {
    const newData = selectedDataOfList.map(({ status, ...rest }) => rest);
    if (newData?.length > 0) {
      axiosMain
        .post(`/postauction/deliveryinstruction/auctioneer/getPDF`, newData)
        .then((response) => {
          if (
            response.data.statusCode === 200 &&
            response.data.responseData?.length > 0
          ) {
            response.data.responseData.forEach((pdfData, index) => {
              const blob = convertBase64ToBlob(pdfData, "application/pdf");
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `example_${index}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
            CustomToast.success(response.data.message);
            setselectedDataOfList([]);
          } else {
            CustomToast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      CustomToast.error("Please select data for download pdf.");
    }
  };
  const handleDownload = (parameters) => {
    axiosMain
      .get(
        `/postauction/deliveryinstruction/auctioneer/downloadlink/${parameters}`
      )
      .then((response) => {
        const base64Data = response.data;
        const binaryData = atob(base64Data);
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const byteArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryData.length; i++) {
          byteArray[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "downloaded_file.pdf";
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error fetching PDF data:", error);
      });
  };
  const reset = () => {
    setDealBookSearch({
      season: String(currentYear),
      saleNo: "",
      loggedinfromAuctionCenterName: auctionCenterId,
      auctioneerName: "",
      status: "",
    });

    setTimeout(() => {
      setDealBookSearch({
        season: String(currentYear),
        loggedinfromAuctionCenterName: auctionCenterId,
        auctioneerName: null,
        status: null,
      }); 
    }, 0);
  };
  const handleDropdownChange = (event) => {
    const selectedSerialNumber = event.target.value;
    setselectedserialNumber(selectedSerialNumber);
  };
  const ViewCertificates = async () => {
    const url = " https://localhost:29739/teaboard/signer";
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
            "/postauction/deliveryinstruction/auctioneer/digitalSign",
            {
              base64: "",
              filename: "",
              deliveryInstructionId: "",
              deliveryInstructionIdlist: selectedInvoices,
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
                serialnumber: selectedserialNumber,
                signPlace: "1",
                documentContent: name.base64,
                documentTitle: "Abc.pdf",
                organnizationName: "EPTL",
                place: atob(sessionStorage.getItem("argument11")),
                certificateName: datas.clientName,
              };
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
                    deliveryInstructionId: name.deliveryInstructionId,
                    deliveryInstructionIdlist: selectedInvoices,
                  },
                ];
                const response1 = await axiosMain.post(
                  "/postauction/deliveryinstruction/auctioneer/savedigitalsign",
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
    dispatch(fetchAuctionRequest());
    getAuctioneer();
  }, []);
  useEffect(() => {
    if (ExportExcelDatas != null && true == getExportDataApiCallResponse) {
      dispatch(getExportDataApiCall(false));
      if ("excel" == exportType) {
        Base64ToExcelDownload(ExportExcelDatas, "View_DealBook.xlsx");
      } else {
        uploadedFileDownload(
          ExportExcelDatas,
          "View_DealBook.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });
  useEffect(() => {
    setallAuctionCenterList(getAllAuctionCenterList);
  }, [getAllAuctionCenterList]);
  useEffect(() => {
    if (DealBookSearch.season !== "") {
      axiosMain
        .post(`/preauction/Common/BindSaleNoBySeason`, {
          season: DealBookSearch.season,
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          const responseData = response.data.responseData;
          setallSaleNoList(responseData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [DealBookSearch.season]);
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

  return (
    <div>
      <div>
        <Accordion
          expanded={expanded === "panel1"}
          className={`${expanded === "panel1" ? "active" : ""}`}
          onChange={handleChangeFactoryOwnerExpand("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>List Delivery Instruction </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <form onSubmit={SearchViewDealBook}>
              {modalRight?.some((ele) => ele === "52") && (
                 <div className="row">
                 <div className="col-xl-2">
                   <div className="FomrGroup">
                     <label>Season</label>
                     <select
                       name="season"
                       value={DealBookSearch.season}
                       className="form-control select-form"
                       onChange={handleViewDealSearch}
                     >
                       <option>Select Season</option>
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
                     <select
                       name="saleNo"
                       onChange={handleViewDealSearch}
                       value={DealBookSearch.saleNo}
                       className="form-control select-form"
                     >
                       <option>Select Sale No</option>
                       {allSaleNoList.map((saleNoItem, index) => (
                         <option
                           value={parseInt(saleNoItem.saleNo)}
                           key={index}
                         >
                           {saleNoItem.saleNo}
                         </option>
                       ))}
                     </select>
                   </div>
                 </div>
                 <div className="col-xl-2">
                   <div className="FomrGroup">
                     <label>Status</label>
                     <select
                       name="status"
                       value={DealBookSearch.status}
                       className="form-control select-form"
                       onChange={handleViewDealSearch}
                     >
                       <option>Select Status</option>
                       {StatusList.map((statusItem) => (
                         <option key={statusItem.status} value={statusItem.id}>
                           {statusItem.status}
                         </option>
                       ))}
                     </select>
                   </div>
                 </div>

                 <div className="col-xl-2">
                   <div className="FomrGroup">
                     <label>Buyer Name </label>
                     <select
                       name="buyername"
                       value={DealBookSearch.buyername}
                       className="form-control select-form"
                       onChange={handleViewDealSearch}
                     >
                       <option>Select Buyer Name</option>
                       {allBuyerList?.map((allBuyerList, index) => (
                         <option value={allBuyerList.userId} key={index}>
                           {allBuyerList.userName}
                         </option>
                       ))}
                     </select>
                   </div>
                 </div>

                 <div className="col-xl-2">
                   <div className="FomrGroup">
                     <label>Auction Center </label>
                     <select
                       name="loggedinfromAuctionCenterName"
                       value={DealBookSearch.loggedinfromAuctionCenterName}
                       className="form-control select-form"
                       onChange={handleViewDealSearch}
                     >
                       <option>Select Auction Center</option>
                       {allAuctionCenterList?.map(
                         (allAuctionCenterList, index) => (
                           <option
                             value={allAuctionCenterList.auctionCenterName}
                           >
                             {allAuctionCenterList.auctionCenterName}
                           </option>
                         )
                       )}
                     </select>
                   </div>
                 </div>

                 <div className="col-12 mb-3">
                   <div className="BtnGroup">
                     <button type="submit" className="SubmitBtn">
                       Search
                     </button>
                     <button
                       type="button"
                       onClick={() => reset()}
                       className="SubmitBtn"
                     >
                       Reset
                     </button>
                   </div>
                 </div>
               </div>
              )}
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
                        <option>Select Certificate </option>
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
                    {modalRight?.some((ele) => ele === "53") && (
                      <button
                        type="button"
                        className="SubmitBtn"
                        onClick={() => ViewCertificates()}
                      >
                        View Certificates
                      </button>
                    )}
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
                <div className="row mt-3">
                {modalRight?.some((ele) => ele === "12") && (
                  <div className="col-12">
                    <div className="TableBox">
                      <table className="table" ref={tableRef}>
                        <thead>
                          <tr>
                            <th>Select</th>
                            <th>Sale No</th>
                            <th>Buyer Name</th>
                            <th>Auctioneer</th>
                            <th>Reference No</th>
                            <th>DO Date</th>
                            <th>Delivery Order No</th>
                            <th>Warehouse Name</th>
                            <th>Tea Type</th>
                            <th>Mark</th>
                            <th>Grade</th>
                            <th>LotNo</th>
                            <th>Qty Purchased</th>
                            <th>No Of Packages</th>
                            <th>Total Qty</th>
                            <th>Sampl eQty</th>
                            <th>PIN</th>
                            <th>Status</th>
                            <th>Eligibility</th>
                            <th>AckNo</th>
                            <th>IRN</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ViewDealBookTaoData?.length > 0 ? (
                            <>
                              {ViewDealBookTaoData?.map((item, index) => (
                                <tr key={index}>
                                  <td>
                                    <input
                                      type="checkbox"
                                      name={`selected-${index}`}
                                      onChange={(e) =>
                                        listCheckboxChange(
                                          index,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </td>
                                  <td>{item.saleNo}</td>
                                  <td>{item.buyerName}</td>
                                  <td>{item.auctioneerName}</td>
                                  <td>{item.referenceNo}</td>
                                  <td>{item.deliveryOrderDate}</td>
                                  <td>{item.deliveryOrderNo}</td>
                                  <td>{item.wareHouseName}</td>
                                  <td>{item.teaType}</td>
                                  <td>{item.markName}</td>
                                  <td>{item.gradeId}</td>
                                  <td>{item.lotNo}</td>
                                  <td>{item.qtyPurchased}</td>
                                  <td>{item.noOfPackages}</td>
                                  <td>{item.totalQuantity}</td>
                                  <td>{item.sampleQty}</td>
                                  <td>{item.pin}</td>
                                  <td>
                                    {getStatusText(parseInt(item.status))}
                                  </td>
                                  <td>{item.eligibility}</td>
                                  <td>{item.ackNo}</td>
                                  <td>{item.irn}</td>
                                  <td className="Action text-center">
                                    <i
                                      className="fa fa-eye"
                                      onClick={() =>
                                        ViewMore(item.deliveryInstructionId)
                                      }
                                    ></i>

                                    {DealBookSearch.status == 2 ? (
                                      <>
                                        <i
                                          className="fa fa-download"
                                          onClick={() =>
                                            handleDownload(
                                              item.deliveryInstructionId
                                            )
                                          }
                                        ></i>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            <>
                               <tr>
                      <td colSpan={22}  className="text-center">
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
                            <div className="NoData">No Data</div>
                          </>
                        )}
                      </td>
                    </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="BtnGroup text-center justify-content-center">
                      <button
                        class="SubmitBtn"
                        type="button"
                        onClick={handleViewMore}
                        disabled={
                          ViewDealBookTaoData?.length == 0 ||
                          ViewDealBookTaoData?.length == null
                        }
                      >
                        View More
                      </button>
                    </div>

                    <div className="BtnGroup">
                      {DealBookSearch.status == 1 ? (
                        <>
                          <button
                            className="SubmitBtn"
                            type="button"
                            onClick={() => GetPDF()}
                          >
                            Get PDF
                          </button>
                        </>
                      ) : (
                        ""
                      )}
  {modalRight?.some((ele) => ele === "48") && (
                      <button
                        className="SubmitBtn"
                        type="button"
                        onClick={() => handleExport("excel")}
                      >
                        Export Excel
                      </button>
  )}

{modalRight?.some((ele) => ele === "47") && (
                      <button
                        className="SubmitBtn"
                        type="button"
                        onClick={() => handleExport("pdf")}
                      >
                        Export PDF
                      </button>
)}

{modalRight?.some((ele) => ele === "12") && (
                      <button
                        className="SubmitBtn"
                        type="button"
                        onClick={() => ViewMore(null)}
                      >
                        View Details
                      </button>
)}
                    </div>
                  </div>
                )}
                </div>
              </form>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          className={`${expanded === "panel2" ? "active" : ""}`}
          onChange={handleChangeFactoryOwnerExpand("panel2")}
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>View Delivery Instruction</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row mt-3">
                <div className="col-12">
                  <div className="TableBox">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Sr</th>
                          <th>Auctioneer Name</th>
                          <th>Warehouse Name</th>
                          <th>Refere nce No</th>
                          <th>Delivery Instruction / AdviceNo</th>
                          <th>Lot No</th>
                          <th>Mark</th>
                          <th>Deal Identification No</th>
                          <th>DI Date</th>
                          <th>Qty</th>
                          <th>PIN</th>
                          <th>Status</th>
                          <th>Eligibility</th>
                          <th>ACK No</th>
                          <th>IRN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ViewBuyerData?.length > 0 ? (
                          <>
                            {ViewBuyerData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.auctioneerName}</td>
                                <td>{item.wareHouseName}</td>
                                <td>{item.referenceNo}</td>
                                <td>
                                  {item.deliveryInstructionAdviceNo == null
                                    ? "-"
                                    : item.deliveryInstructionAdviceNo}
                                </td>
                                <td>{item.lotNo}</td>
                                <td>{item.markName}</td>
                                <td>
                                  {item.dealIdentificationNo == null
                                    ? "-"
                                    : item.dealIdentificationNo}
                                </td>
                                <td>{item.diDate}</td>
                                <td>{item.qty}</td>
                                <td>{item.pin}</td>
                                <td>{getStatusText(parseInt(item.status))}</td>
                                <td>{item.eligibility}</td>
                                <td>{item.ackNo == null ? "-" : item.ackNo}</td>
                                <td>{item.irn == null ? "-" : item.ackNo}</td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <>
                            <tr>
                      <td colSpan={15}  className="text-center">
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
                            <div className="NoData">No Data</div>
                          </>
                        )}
                      </td>
                    </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>

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
    </div>
  );
}

export default DeliveryInstructionAdviceAuctioneer;
