import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import TableComponent from "../../components/tableComponent/TableComponent";
// import { fetchGrade } from "../../store/actions"
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import moment from "moment";
import { toast } from "react-toastify";
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
  userWiseAuctionCenterDetails,
  getSaleNoRequest,
} from "../../store/actions";
import CustomToast from "../../components/Toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  downloadAllDocument,
  bindAuctionDate,
  getAllTaxInvoiceSaleAction,
  getlotnobyuserid,
  getlotnofortao,
  getinvoicenofortao,
  getlotnoforteaboard,
  getinvoicenobyuserid,
  getinvoicenoforteaboard,
  previewpdf,
  bindsalenobyseason,
  get_searchinvoicelist,
  getusersbyauctioncenter,
  getExportData,
  getExportDataApiCall,
  getAllAuctionCenterAscAction,
} from "../../store/actions";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { NO_OF_RECORDS } from "../../constants/commonConstants";

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

function InvoiceList({ open, setOpen, modalRight }) {
  const currentYear = new Date().getFullYear();
  const [loader, setLoader] = useState(false);
  const [allAuctionDate, setallAuctionDate] = useState([]);
  const [allLoatNo, setallLoatNo] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [invoiceNo, setinvoiceNo] = useState([]);
  const seasonYear = moment().year();
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const roleCode = atob(sessionStorage.getItem("argument6"));
  const handleCloseHistory = () => setShowmodal(false);
  const [showmodal, setShowmodal] = useState(false);
  const [downclick, setdownclick] = useState(false);
  const [DealBookSearch, setDealBookSearch] = useState({
    season: seasonYear.toString(),
    roleCode: roleCode,
    saleNo: null,
    teaType: null,
    auctionDate: null,
    // buyerName: null,
    status: null,
    lotNo: null,
    // invoiceNumber: null,
    bilingType: null,
    einvoiceEligibility: null,
    auctionCentre: null,
    auctioneer: null,
    userId: parseInt(atob(sessionStorage.getItem("argument2"))),
    url: "/postauction/invoiceList/searchInvoiceList",
    exportType: "",
    isExport: 0,
  });
  const [exportType, setexportType] = useState("");
  const [ViewDealBookTaoData, setViewDealBookTaoData] = useState([]);
  const [allTeaTypeList, setallTeaTypeList] = useState([]);
  const [allSaleNoList, setallSaleNoList] = useState([]);
  const auctioneerData = useSelector(
    (state) => state?.invoiceListReducer?.auctioneerData?.responseData
  );
  const ViewDealBookList = async () => {
    DealBookSearch.url = "";
    DealBookSearch.exportType = "";
    DealBookSearch.isExport = null;
    if (
      DealBookSearch.auctionCentre == null ||
      DealBookSearch.auctionCentre == "" ||
      DealBookSearch.auctionCentre == undefined
    ) {
      CustomToast.error("Please select Auction Center");
      return false;
    } else if (
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
      if (DealBookSearch.auctionCentre == "") {
        DealBookSearch.auctionCentre = null;
      }
      if (DealBookSearch.teaType == "") {
        DealBookSearch.teaType = null;
      }
      // if (DealBookSearch.buyerName == "") {
      //   DealBookSearch.buyerName = null;
      // }
      if (DealBookSearch.status == "") {
        DealBookSearch.status = null;
      }
      if (DealBookSearch.lotNo == "") {
        DealBookSearch.lotNo = null;
      }
      if (DealBookSearch.invoiceNo == "") {
        DealBookSearch.invoiceNo = null;
      }
      if (DealBookSearch.bilingType == "") {
        DealBookSearch.bilingType = null;
      }
      if (DealBookSearch.einvoiceEligibility == "") {
        DealBookSearch.einvoiceEligibility = null;
      }
      if (DealBookSearch.auctioneer == "") {
        DealBookSearch.auctioneer = null;
      }
      dispatch(
        get_searchinvoicelist({
          ...DealBookSearch,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
      setRows([]);
    }
  };
  const searchResults = useSelector(
    (state) => state?.invoiceListReducer?.searchinvoicelist?.responseData
  );

  const searchResultss = useSelector(
    (state) => state?.invoiceListReducer?.searchinvoicelist?.responseData
  );
  useEffect(() => {
    if (
      searchResultss != undefined &&
      searchResultss != null &&
      searchResultss != ""
    ) {
      setViewDealBookTaoData(searchResultss);
    } else {
      setViewDealBookTaoData([]);
      setRows([]);
    }
  }, [searchResultss]);
  // useEffect(() => {
  //   const newRows = searchResultss || [];
  //   setRows((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

  //     if (newRows.length > 0) {
  //       const index = currentRows.findIndex(
  //         (row) => row.invoicedetailid === newRows[0].invoicedetailid
  //       );

  //       if (index !== -1) {
  //         currentRows[index] = newRows[0];
  //         return currentRows;
  //       } else {
  //         return [...currentRows, ...newRows];
  //       }
  //     } else {
  //       return currentRows;
  //     }
  //   });
  // }, [searchResultss]);
  useEffect(() => {
    if (searchResultss && searchResultss.length > 0) {
      setRows((prevRows) => [...prevRows, ...searchResultss]);
    }
  }, [searchResultss]);
  useEffect(() => {
    dispatch(getAllTeaTypes());

    dispatch(fetchMarkRequest());
    dispatch(fetchAuctionRequest());
    dispatch(getAllCategoriesAction());
  }, []);

  const allTeaType = useSelector(
    (state) => state?.teaTypeManage?.allTeaTypes?.responseData
  );

  const auctionCenterDropDownData = useSelector(
    (state) => state?.auctionCenter?.userWiseAuctionCenterDetails?.responseData
  );
  const bindAuctionDatelist = useSelector(
    (state) => state?.BuyerTaxInvoice?.getAllTaxInvoiceSale?.responseData
  );
  useEffect(() => {
    setallAuctionDate(bindAuctionDatelist);
  }, [bindAuctionDatelist]);
  const listSaleNo = useSelector(
    (state) => state?.invoiceListReducer?.bindsalenobyseason?.responseData
  );
  useEffect(() => {
    setallSaleNoList(listSaleNo);
  }, [listSaleNo]);

  const listInvoiceNumber = useSelector(
    (state) => state?.invoiceListReducer?.getinvoicenobyuserid?.responseData
  );

  useEffect(() => {
    if (
      listInvoiceNumber != undefined &&
      listInvoiceNumber != null &&
      listInvoiceNumber != ""
    ) {
      setinvoiceNo(listInvoiceNumber);
    }
  }, [listInvoiceNumber]);
  const listofLots = useSelector(
    (state) => state?.invoiceListReducer?.getlotnobyuserid?.responseData
  );
  console.log("listofLots", listofLots);
  useEffect(() => {
    if (listofLots != undefined && listofLots != null && listofLots != "") {
      setallLoatNo(listofLots);
    } else {
      setallLoatNo([]);
    }
  }, [listofLots]);
  //Export
  const handleExport = (exportTypee) => {
    if (
      DealBookSearch.auctionCentre == null ||
      DealBookSearch.auctionCentre == "" ||
      DealBookSearch.auctionCentre == undefined
    ) {
      CustomToast.error("Please select Auction Center");
      return false;
    } else if (
      DealBookSearch.saleNo == null ||
      DealBookSearch.saleNo == "" ||
      DealBookSearch.saleNo == undefined
    ) {
      CustomToast.error("Please select sale No.");
      return false;
    } else {
      setexportType(exportTypee);
      DealBookSearch.url = "/postauction/invoiceList/searchInvoiceList";
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
      DealBookSearch.url = "";
      DealBookSearch.exportType = "";
      DealBookSearch.isExport = null;
    }
  });
  //Export end
  //download doc
  const downloadAllDocuments = useSelector(
    (state) => state?.invoiceListReducer?.downloadAllDocuments
  );

  useEffect(() => {
    if (downloadAllDocuments.length != 0 && downclick == true) {
      // Convert the base64 data to binary
      const binaryData = atob(downloadAllDocuments);
      const byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }

      // Create a Blob from the binary data
      const blob = new Blob([byteArray], { type: "application/zip" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a link and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = "invoice.zip";
      document.body.appendChild(link);
      link.click();

      // Clean up by revoking the URL
      URL.revokeObjectURL(url);
      setdownclick(false);
    }
  }, [downloadAllDocuments]);

  //CheckBox
  const allDocDownload = () => {
    let selectedBuyer = [];

    ViewDealBookTaoData &&
      ViewDealBookTaoData.map(
        (ViewDealBookTaoData, ViewDealBookTaoDataIndex) => {
          if (
            ViewDealBookTaoData &&
            ViewDealBookTaoData.isSelected &&
            true == ViewDealBookTaoData.isSelected
          ) {
            selectedBuyer.push(ViewDealBookTaoData);
          }
        }
      );

    if (selectedBuyer && selectedBuyer.length == 0) {
      toast.error("Please select atleast one data to generate invoice");
      return;
    }
    let commadata = selectedBuyer.map((item) => item.invoiceNumber).join(",");
    let downloadAlldata = {
      commaseprateddata: commadata,
      userCode: atob(sessionStorage.getItem("argument6")).toString(),
    };
    console.log("selectedBuyer 130", commadata);
    dispatch(downloadAllDocument(downloadAlldata));
  };
  const checkBoxSelect = (index, key, value, isSingleSelected) => {
    let tempData = [];

    if (isSingleSelected == true) {
      tempData =
        ViewDealBookTaoData &&
        ViewDealBookTaoData.map(
          (ViewDealBookTaoData, ViewDealBookTaoDataIndex) => {
            if (index == ViewDealBookTaoDataIndex) {
              ViewDealBookTaoData[key] = value;
            }

            return ViewDealBookTaoData;
          }
        );

      let isAllSelected = false;
      let count = 0;
      ViewDealBookTaoData &&
        ViewDealBookTaoData.map(
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

      if (count == ViewDealBookTaoData.length) {
        isAllSelected = true;
      }

      setIsAllSelected(isAllSelected);
    } else {
      tempData =
        ViewDealBookTaoData &&
        ViewDealBookTaoData.map(
          (ViewDealBookTaoData, ViewDealBookTaoDataIndex) => {
            ViewDealBookTaoData[key] = value;
            return ViewDealBookTaoData;
          }
        );
      setIsAllSelected(value);
    }

    setViewDealBookTaoData(tempData);
  };

  //Check end
  //download doc
  useEffect(() => {
    // let payloadData = {
    //   userId: parseInt(atob(sessionStorage.getItem("argument2"))),
    // };
    // if (auctionCenterDropDownData == undefined) {
    //   dispatch(userWiseAuctionCenterDetails(payloadData));
    // }
    // setallAuctionCenterList(auctionCenterDropDownData);
    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
      })
    );
  }, []);

  useEffect(() => {
    if (
      DealBookSearch.saleNo != "" &&
      DealBookSearch.saleNo != undefined &&
      DealBookSearch.saleNo != null
    ) {
      dispatch(
        getAllTaxInvoiceSaleAction({
          season: seasonYear.toString(),
          saleNo: DealBookSearch.saleNo,
          auctionCenterId: DealBookSearch.auctionCentre,
        })
      );
    }
  }, [DealBookSearch.saleNo]);
  useEffect(() => {
    if (
      atob(sessionStorage.getItem("argument6")) == "BUYER" ||
      atob(sessionStorage.getItem("argument6")) == "AUCTIONEER" ||
      atob(sessionStorage.getItem("argument6")) == "SELLER"
    ) {
      dispatch(
        getlotnobyuserid(atob(sessionStorage.getItem("argument2")).toString())
      );
    } else if (atob(sessionStorage.getItem("argument6")) == "TAOUSER") {
      let lotnojson = {
        auctionCenter: DealBookSearch.auctionCentre,
        userid: atob(sessionStorage.getItem("argument2")).toString(),
      };
      dispatch(getlotnofortao(lotnojson));
    } else {
      dispatch(getlotnoforteaboard());
    }
    //invoice
    if (
      atob(sessionStorage.getItem("argument6")) == "BUYER" ||
      atob(sessionStorage.getItem("argument6")) == "AUCTIONEER" ||
      atob(sessionStorage.getItem("argument6")) == "SELLER"
    ) {
      dispatch(
        getinvoicenobyuserid(
          atob(sessionStorage.getItem("argument2")).toString()
        )
      );
    } else if (atob(sessionStorage.getItem("argument6")) == "TAOUSER") {
      let invoicenojson = {
        auctionCenter: DealBookSearch.auctionCentre,
        userid: atob(sessionStorage.getItem("argument2")).toString(),
      };
      dispatch(getinvoicenofortao(invoicenojson));
    } else {
      dispatch(getinvoicenoforteaboard());
    }
  }, []);
  const SearchViewDealBook = (e) => {
    e.preventDefault();
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      ViewDealBookList();
    }, 1000);
  };
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      get_searchinvoicelist({
        ...DealBookSearch,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const ResetViewBook = (e) => {
    e.preventDefault();
    setallSaleNoList([]);
    setDealBookSearch({
      season: seasonYear.toString(),
      roleCode: roleCode,
      saleNo: "",
      teaType: "",
      auctionDate: "",
      // buyerName: "",
      status: "",
      lotNo: "",
      // invoiceNumber: "",
      bilingType: "",
      einvoiceEligibility: "",
      auctionCentre: "",
      auctioneer: "",
      userId: parseInt(atob(sessionStorage.getItem("argument2"))),
    });
    pageNo = 1;
    setRows([]);
    get_searchinvoicelist({
      ...DealBookSearch,
      pageNo: pageNo,
      noOfRecords: NO_OF_RECORDS,
    });
    setViewDealBookTaoData([]);
  };

  const handleViewDealSearch = (e) => {
    const { name, value } = e.target;
    setDealBookSearch({ ...DealBookSearch, [name]: value });
  };

  useEffect(() => {
    setallTeaTypeList(allTeaType);
    // setallAuctionCenterList(auctionCenterDropDownData);
  }, [allTeaType, currentYear]);

  const getAllAuctionCenterList = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  // Filter only the data where isActive is 1
  const isActiveAuctionCenterData =
    getAllAuctionCenterList &&
    getAllAuctionCenterList?.filter((data) => 1 == data.isActive);

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
  const [file, setFile] = useState();

  const handlePreview = (invoiceNo) => {
    let previewPdfparam = {
      invoiceNo: invoiceNo,
      role: atob(sessionStorage.getItem("argument6")).toString(),
    };
    dispatch(previewpdf(previewPdfparam));
  };
  const handlesingledownload = (invoiceNo) => {
    let downloaddata = {
      commaseprateddata: invoiceNo,
      userCode: atob(sessionStorage.getItem("argument6")).toString(),
    };
    setdownclick(true);
    dispatch(downloadAllDocument(downloaddata));
  };
  const pdfPreviewdata = useSelector(
    (state) => state?.invoiceListReducer?.previewpdf
  );
  useEffect(() => {
    if (
      pdfPreviewdata != null &&
      pdfPreviewdata != undefined &&
      pdfPreviewdata != ""
    ) {
      setFile(pdfPreviewdata);
      setShowmodal(true);
    }
  }, [pdfPreviewdata]);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Convert the Base64 string to a Blob object

    if (file) {
      const byteCharacters = atob(file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" }); // Specify the image type

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Set the URL as the image source
      setImageUrl(url);

      // Clean up by revoking the URL when the component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  useEffect(() => {
    if (
      DealBookSearch.auctionCentre != "" &&
      DealBookSearch.auctionCentre != undefined &&
      DealBookSearch.auctionCentre != null
    ) {
      let data = {
        season: seasonYear.toString(),
        auctionCenterId: DealBookSearch.auctionCentre,
      };
      dispatch(bindsalenobyseason(data));
      dispatch(
        getusersbyauctioncenter({
          auctionCenterId: parseInt(DealBookSearch.auctionCentre),
          roleCode: atob(sessionStorage.getItem("argument6")).toString(),
        })
      );
    }
  }, [DealBookSearch.auctionCentre]);

  useEffect(() => {
    setDealBookSearch({
      season: seasonYear.toString(),
      roleCode: roleCode,
      saleNo: "",
      teaType: "",
      auctionDate: "",
      // buyerName: "",
      status: "",
      lotNo: "",
      // invoiceNumber: "",
      bilingType: "",
      einvoiceEligibility: "",
      auctionCentre: "",
      auctioneer: "",
      userId: parseInt(atob(sessionStorage.getItem("argument2"))),
    });
    setRows([]);
    get_searchinvoicelist({
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
    // dispatch(getAllAuctionCenterAscAction([]));
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
                    value={DealBookSearch.auctionCentre}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Auction Center</option>
                    {isActiveAuctionCenterData?.map(
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
                  <input
                    type="text"
                    name="buyerPromptDate"
                    className="form-control"
                    value={seasonYear}
                    disabled
                  />
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
                    {allSaleNoList?.map((allSaleNoList, index) => (
                      <option value={allSaleNoList.saleNo}>
                        {allSaleNoList.saleNo}
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
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Lot No</label>
                  <select
                    name="lotNo"
                    value={DealBookSearch.lotNo}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Lot No</option>
                    {allLoatNo.map((allLoatNo, index) => (
                      <option value={allLoatNo} key={index}>
                        {allLoatNo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Invoice Number</label>
                  <select
                    name="invoiceNo"
                    value={DealBookSearch.invoiceNumber}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Invoice No</option>
                    {invoiceNo.map((invoiceNo, index) => (
                      <option value={invoiceNo} key={index}>
                        {invoiceNo}
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
                    value={DealBookSearch.bilingType}
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
                  <label>Status</label>
                  <select
                    name="status"
                    value={DealBookSearch.status}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Status</option>
                    <option value="1">Invoice Generated</option>
                    <option value="2">IRN Pending</option>
                    <option value="3">IRN Updated</option>
                    <option value="4">Ready for Download </option>
                    <option value="5">Uploaded</option>
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Tea Type</label>
                  <select
                    name="teaType"
                    value={DealBookSearch.teaType}
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
                  <label>Auctioneer Name </label>
                  <select
                    name="auctioneer"
                    value={DealBookSearch.auctioneer}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Auctioneer Name</option>
                    {auctioneerData?.map((auctioneerData, index) => (
                      <option value={auctioneerData.value}>
                        {auctioneerData.value}
                      </option>
                    ))}
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
                        {modalRight?.some((ele) => ele === "63") && (
                          <button
                            type="button"
                            className="Excel"
                            title="Download AllDocuments"
                            onClick={() => allDocDownload()}
                          >
                            <i className="fa fa-file-archive"></i>
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
                      <th>Sr No.</th>
                      <th>Auction Centre</th>
                      <th>Season</th>
                      <th>Sale No</th>
                      <th>Auction Date</th>
                      <th>E-Invoice Eligibility</th>
                      <th>IRN Status</th>
                      <th>Lot No.</th>
                      <th>Tea Type</th>
                      <th>Invoice Number</th>
                      <th>Invoice Date</th>
                      {/* <th>Auctioneer</th> */}
                      <th>Invoice (Billing) Type</th>
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
                                <td>{data.auctionCentre}</td>
                                <td>{data.auctionDate}</td>
                                <td>{data.saleNo}</td>
                                <td>{data.auctionDate}</td>
                                <td>{data.einvoiceEligibility}</td>
                                <td>{data.irnStatus}</td>
                                <td>{data.lotNo}</td>
                                <td>{data.teaType}</td>
                                <td>{data.invoiceNumber}</td>
                                <td>{data.invoiceDate}</td>
                                {/* <td>-</td> */}
                                <td>{data.bilingType}</td>

                                <td className="Action">
                                  {data.cstatus == 5 && (
                                    <>
                                      {modalRight?.some(
                                        (ele) => ele === "61"
                                      ) && (
                                        <i
                                          className="fa fa-eye"
                                          title="View"
                                          onClick={() =>
                                            handlePreview(data.invoiceNumber)
                                          }
                                        ></i>
                                      )}
                                      {modalRight?.some(
                                        (ele) => ele === "62"
                                      ) && (
                                        <i
                                          className="fa fa-download"
                                          title="Download"
                                          onClick={() =>
                                            handlesingledownload(
                                              data.invoiceNumber
                                            )
                                          }
                                        ></i>
                                      )}
                                    </>
                                  )}
                                  {data.cstatus !== 5 && "-"}
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
                  <button
                    class="SubmitBtn"
                    onClick={handleViewMore}
                    disabled={searchResultss && searchResultss.length < 19}
                  >
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
        <Modal show={showmodal} onHide={handleCloseHistory} size="xl" centered>
          <Modal.Header>
            <Modal.Title>Preview</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={handleCloseHistory}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <div className="ImgBox">
              <img src={imageUrl ? imageUrl : ""} className="img-fluid" />
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default InvoiceList;
