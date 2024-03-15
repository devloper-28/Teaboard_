import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import TableComponent from "../../components/tableComponent/TableComponent";
// import { fetchGrade } from "../../store/actions"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import moment from "moment";
import jsPDF from "jspdf";
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
  getExportData,
  getExportDataApiCall,
  getExportDataForViewBuyer,
  getExportDataForViewBuyerApiCall,
} from "../../store/actions";
import CustomToast from "../../components/Toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ThreeDots } from "react-loader-spinner";
import {
  bindAuctionDate,
  bindsalenobyseason,
  get_searchinvoice,
  get_searchinvoiceSuccess,
  get_invoiceview,
  get_invoiceviewSuccess,
  getAllAuctionCenterAscAction,
  getAllTaxInvoiceSaleAction,
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

function ViewBuyerTaxInvoice({ modalRight, open, setOpen }) {
  const [allAuctionDate, setallAuctionDate] = useState([]);
  const seasonYear = moment().year();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [exportViewType, setexportViewType] = useState("");
  const handleCloseHistory = () => setShowmodal(false);
  const [showmodal, setShowmodal] = useState(false);
  const [viewData, setviewData] = useState([]);
  const [exportType, setexportType] = useState(null);
  const [DealBookSearch, setDealBookSearch] = useState({
    season: seasonYear.toString(),
    saleNo: "",
    auctionDate: null,
    auctionCenter: null,
    userId: parseInt(atob(sessionStorage.getItem("argument2"))),
    invoiceStatus: null,
    url: null,
    exportType: null,
    isExport: null,
  });
  const [ViewDealBookTaoData, setViewDealBookTaoData] = useState([]);
  const [allSaleNoList, setallSaleNoList] = useState([]);

  const ViewDealBookList = async () => {
    DealBookSearch.url = "";
    DealBookSearch.exportType = null;
    DealBookSearch.isExport = null;
    if (
      DealBookSearch.auctionCenter == null ||
      DealBookSearch.auctionCenter == "" ||
      DealBookSearch.auctionCenter == undefined
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
      if (DealBookSearch.auctionCenter == "") {
        DealBookSearch.auctionCenter = null;
      }
      if (DealBookSearch.invoiceStatus == "") {
        DealBookSearch.invoiceStatus = null;
      }
      dispatch(
        get_searchinvoice({
          ...DealBookSearch,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
    }
  };

  let url =
    window.location.href &&
    window.location.href.split("/") &&
    window.location.href.split("/")[3];
  useEffect(() => {
    dispatch(get_searchinvoiceSuccess([]));
    dispatch(get_invoiceviewSuccess([]));
    setShowmodal(false);
    setviewData([]);
  }, []);

  const searchResults = useSelector(
    (state) =>
      state?.viewBuyerTaxInvoiceReducer?.searchBuyerTaxInvoiceList?.responseData
  );

  const searchResultss = useSelector(
    (state) =>
      state?.viewBuyerTaxInvoiceReducer?.searchBuyerTaxInvoiceList?.responseData
  );
  useEffect(() => {
    const newRows = searchResultss || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      if (newRows.length > 0) {
        const index = currentRows.findIndex(
          (row) => row.invoiceId === newRows[0].invoiceId
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
  }, [searchResultss]);
  useEffect(() => {
    if (
      searchResults != undefined &&
      searchResults != null &&
      searchResults != ""
    ) {
      setViewDealBookTaoData(searchResults);
    } else {
      setViewDealBookTaoData([]);
      setRows([]);
    }
  }, [searchResults]);
  const viewResults = useSelector(
    (state) =>
      state?.viewBuyerTaxInvoiceReducer?.viewBuyerTaxInvoiceList?.responseData
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
      DealBookSearch.saleNo !== "SELECT" &&
      DealBookSearch.saleNo !== "" &&
      DealBookSearch.saleNo !== null
    ) {
      dispatch(
        getAllTaxInvoiceSaleAction({
          season: seasonYear.toString(),
          saleNo: DealBookSearch.saleNo,
          auctionCenterId: DealBookSearch.auctionCenter,
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

  const ResetViewBook = (e) => {
    e.preventDefault();
    setallSaleNoList([]);
    setallAuctionDate([]);
    setDealBookSearch({
      season: seasonYear.toString(),
      saleNo: "",
      auctionDate: "",
      auctionCenter: "",
      userId: atob(sessionStorage.getItem("argument2")),
      invoiceStatus: "",
    });
    pageNo = 1;
    setRows([]);
    dispatch(
      get_searchinvoice({
        ...DealBookSearch,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
    dispatch(get_searchinvoice([]));
    setViewDealBookTaoData([]);
    dispatch(getAllTaxInvoiceSaleAction([]));
  };

  //ViewExport
  const handleViewExport = (exportType) => {
    setexportViewType("");

    if (rows && rows.length > 0) {
      let invoiceId = rows[0].invoiceId;
      let userId = atob(sessionStorage.getItem("argument2"));

      let searchData = {
        url: `/postauction/buyertaxinvoice/invoiceView`,
        method: "POST",
        data: {
          invoiceId: invoiceId,
          userId: userId,
          isExport: 1,
          exportType: exportType,
        },
      };

      setexportViewType(exportType);
      dispatch(getExportDataForViewBuyer(searchData));
    } else {
      console.error("Invalid 'rows' data");
    }
  };

  const getExportViewDataResponse = useSelector(
    (state) =>
      state.viewBuyerTaxInvoiceReducer?.exportViewBuyerData?.responseData
        ?.exported_file
  );

  const getExportDataViewApiCallResponse = useSelector(
    (state) => state?.viewBuyerTaxInvoiceReducer?.exportDataForViewBuyerApiCall
  );

  useEffect(() => {
    if (
      getExportViewDataResponse != null &&
      true == getExportDataViewApiCallResponse
    ) {
      dispatch(getExportDataForViewBuyerApiCall(false));
      if ("excel" == exportViewType) {
        Base64ToExcelDownload(
          getExportViewDataResponse,
          "ViewBuyerTaxInvoiceDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "ViewBuyerTaxInvoiceDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  //Export
  const handleExport = (exportTypee) => {
    if (
      DealBookSearch.auctionCenter == null ||
      DealBookSearch.auctionCenter == "" ||
      DealBookSearch.auctionCenter == undefined
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
      DealBookSearch.url = "/postauction/buyertaxinvoice/searchInvoice";
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
        Base64ToExcelDownload(getExportDataResponse, "BuyerTaxInvoice.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "BuyerTaxInvoice.pdf",
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
  const handleViewDealSearch = (e) => {
    const { name, value } = e.target;
    setDealBookSearch({ ...DealBookSearch, [name]: value });
  };

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
      XLSX.utils.book_append_sheet(workbook, worksheet, "viewBuyerTaxInvoice");

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
      DealBookSearch.auctionCenter != "" &&
      DealBookSearch.auctionCenter != undefined &&
      DealBookSearch.auctionCenter != null
    ) {
      let data = {
        season: seasonYear.toString(),
        auctionCenterId: DealBookSearch.auctionCenter,
      };
      dispatch(bindsalenobyseason(data));
    }
  }, [DealBookSearch.auctionCenter]);
  //FileView
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      get_searchinvoice({
        ...DealBookSearch,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const handleView = (data) => {
    let calldata = {
      invoiceId: data.invoiceId,
      userId: atob(sessionStorage.getItem("argument2")),
    };
    dispatch(get_invoiceview(calldata));
  };
  useEffect(() => {
    setDealBookSearch({
      season: seasonYear.toString(),
      saleNo: "",
      auctionDate: "",
      auctionCenter: "",
      userId: atob(sessionStorage.getItem("argument2")),
      invoiceStatus: "",
    });
    setRows([]);
    setallSaleNoList([]);
    setallAuctionDate([]);
    pageNo = 1;
    setRows([]);
    // dispatch(
    //   get_searchinvoice({
    //     ...DealBookSearch,
    //     pageNo: pageNo,
    //     noOfRecords: NO_OF_RECORDS,
    //   })
    // );
    setViewDealBookTaoData([]);
    dispatch(get_searchinvoice([]));
    dispatch(getAllTaxInvoiceSaleAction([]));
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
                    name="auctionCenter"
                    value={DealBookSearch.auctionCenter}
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
                  <label>invoice Status</label>
                  <select
                    name="invoiceStatus"
                    value={DealBookSearch.invoiceStatus}
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
                      Reset
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
                      <th>Sr.</th>
                      <th>Contract Note HeaderID</th>
                      <th>Contract ID</th>
                      <th>InvoiceReference No</th>
                      <th>Invoice Date</th>
                      <th>Sale No</th>
                      <th>Sale Date</th>
                      <th>Prompt Date</th>
                      <th>State</th>
                      <th>Place Of Supply</th>
                      <th>Country</th>
                      <th>Dispatch Contact Name</th>
                      <th>Dispatch GSTNo</th>
                      <th>Dispatch State</th>
                      <th>Dispatch Address</th>
                      <th>Dispatch Country</th>
                      <th>AuctionCenter</th>
                      <th>Sale Type</th>
                      <th>HSNCode</th>
                      <th>SACCode</th>
                      <th>TeaBoard SACCode</th>
                      <th>Goods Description</th>
                      <th>Services Description</th>
                      <th>TeaBoard Description</th>
                      <th>MarkName</th>
                      <th>SellerName</th>
                      <th>SellerAddress</th>
                      <th>Warehouse Address</th>
                      <th>Seller PhoneNo</th>
                      <th>Seller EmailID</th>
                      <th>Seller PANNo</th>
                      <th>Seller TBReg No</th>
                      <th>Seller CIN</th>
                      <th>Seller FSSAILicence No</th>
                      <th>Seller GSTNo</th>
                      <th>Buyer Name</th>
                      <th>Buyer Address</th>
                      <th>Buyer EntityNo</th>
                      <th>Buyer PANNo</th>
                      <th>Buyer FSSAINo</th>
                      <th>Buyer TBRegNo</th>
                      <th>Buyer GSTNo</th>
                      <th>Auctioneer Name</th>
                      <th>Auctioneer Address</th>
                      <th>Auctioneer PhoneNo</th>
                      <th>Auctioneer EmailID</th>
                      <th>Auctioneer PANNo</th>
                      <th>Auctioneer TBReg No</th>
                      <th>Auctioneer CIN</th>
                      <th>Auctioneer FSSAILicence No</th>
                      <th>Auctioneer GSTNo</th>
                      <th>TeaBoard Name</th>
                      <th>TeaBoard Address</th>
                      <th>TeaBoard PhoneNo</th>
                      <th>TeaBoard EmailID</th>
                      <th>TeaBoard PANNo</th>
                      <th>TeaBoard GSTNo</th>
                      <th>Seller ContractNote No</th>
                      <th>Auctioneer ContractNote No</th>
                      <th>TeaBoard ContractNote No</th>
                      <th>AuctBuyer ContractNote No</th>
                      <th>Eligibility</th>
                      <th>Seller Eligibility</th>
                      <th>TBEligibility</th>
                      <th>ABAckNo</th>
                      <th>ABCNNAckDt</th>
                      <th>ABIRN</th>
                      <th>ABSigned QRCode</th>
                      <th>Seller AckNo</th>
                      <th>Seller CNNAckDt</th>
                      <th>Seller IRN</th>
                      <th>Seller QRGenerated</th>
                      <th>TBAckNo</th>
                      <th>TBCNNAckDt</th>
                      <th>TBIRN</th>
                      <th>TBSigned QRCode</th>
                      <th>Auctioneer AckNo</th>
                      <th>Auctioneer CNNAckDt</th>
                      <th>Auctioneer IRN</th>
                      <th>Auctioneer SignedQRCode</th>
                      <th>Contract NoteDetailsID</th>
                      <th>LotNo</th>
                      <th>DealID No</th>
                      <th>Grade</th>
                      <th>Garden InvoiceNo</th>
                      <th>Mark</th>
                      <th>Warehouse</th>
                      <th>PkgType</th>
                      <th>GrossKgs</th>
                      <th>ShortKgs</th>
                      <th>ShortPkgs</th>
                      <th>FTSampleKgs</th>
                      <th>FTSamplePkgs</th>
                      <th>NetKgs</th>
                      <th>Total NetKgs</th>
                      <th>Rate</th>
                      <th>TeaValue</th>
                      <th>Brokerage</th>
                      <th>BrokerageRate</th>
                      <th>LotMoney</th>
                      <th>TeaBoard Charges</th>
                      <th>Deal SGST Value</th>
                      <th>Deal SGST Rate</th>
                      <th>Deal CGST Value</th>
                      <th>Deal CGST Rate</th>
                      <th>Deal IGST Value</th>
                      <th>Deal IGST Rate</th>
                      <th>BuyBrkge SGST Value</th>
                      <th>BuyBrkge SGST Rate</th>
                      <th>BuyBrkge CGST Value</th>
                      <th>BuyBrkge CGST Rate</th>
                      <th>BuyBrkge IGST Value</th>
                      <th>BuyBrkge IGST Rate</th>
                      <th>TBSGST Value</th>
                      <th>TBSGST Rate</th>
                      <th>TBCGST Value</th>
                      <th>TBCGST Rate</th>
                      <th>TBIGST Value</th>
                      <th>TBIGST Rate</th>
                      <th>Total AuctioneerServices Amount</th>
                      <th>NetAmount</th>
                      <th>Total Seller Amount</th>
                      <th>Total TeaBoard Amount</th>
                      <th>Total AuctBuyer Amount</th>
                      <th>TCS Collected By Seller</th>
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
                                <td>{index + 1}</td>
                                <td>{data.contractNoteHeaderID}</td>
                                <td>{data.contractID}</td>
                                <td>{data.invoiceReferenceNo}</td>
                                <td>{data.invoiceDate}</td>
                                <td>{data.saleNo}</td>
                                <td>{data.saleDate}</td>
                                <td>{data.promptDate}</td>
                                <td>{data.state}</td>
                                <td>{data.placeOfSupply}</td>
                                <td>{data.country}</td>

                                <td>{data.dispatchContactName}</td>
                                <td>{data.dispatchGSTNo}</td>
                                <td>{data.dispatchState}</td>
                                <td>{data.dispatchAddress}</td>
                                <td>{data.dispatchCountry}</td>
                                <td>{data.auctionCenter}</td>
                                <td>{data.saleType}</td>
                                <td>{data.hsnCode}</td>
                                <td>{data.sacCode}</td>
                                <td>{data.teaBoardSACCode}</td>
                                <td>{data.goodsDescription}</td>
                                <td>{data.servicesDescription}</td>
                                <td>{data.teaBoardDescription}</td>
                                <td>{data.markName}</td>
                                <td>{data.sellerName}</td>
                                <td>{data.sellerAddress}</td>
                                <td>{data.warehouseAddress}</td>
                                <td>{data.sellerPhoneNo}</td>
                                <td>{data.sellerEmailID}</td>
                                <td>{data.sellerPANNo}</td>
                                <td>{data.sellerTBRegNo}</td>
                                <td>{data.sellerCIN}</td>
                                <td>{data.sellerFSSAILicenceNo}</td>
                                <td>{data.sellerGSTNo}</td>
                                <td>{data.buyerName}</td>
                                <td>{data.buyerAddress}</td>
                                <td>{data.buyerEntityNo}</td>
                                <td>{data.buyerPANNo}</td>
                                <td>{data.buyerFSSAINo}</td>
                                <td>{data.buyerTBRegNo}</td>
                                <td>{data.buyerGSTNo}</td>
                                <td>{data.auctioneerName}</td>
                                <td>{data.auctioneerAddress}</td>
                                <td>{data.auctioneerPhoneNo}</td>
                                <td>{data.auctioneerEmailID}</td>
                                <td>{data.auctioneerPANNo}</td>
                                <td>{data.auctioneerTBRegNo}</td>
                                <td>{data.auctioneerCIN}</td>
                                <td>{data.auctioneerFSSAILicenceNo}</td>
                                <td>{data.auctioneerGSTNo}</td>
                                <td>{data.teaBoardName}</td>
                                <td>{data.teaBoardAddress}</td>
                                <td>{data.teaBoardPhoneNo}</td>
                                <td>{data.teaBoardEmailID}</td>
                                <td>{data.teaBoardPANNo}</td>
                                <td>{data.teaBoardGSTNo}</td>
                                <td>{data.sellerContractNoteNo}</td>
                                <td>{data.auctioneerContractNoteNo}</td>
                                <td>{data.teaBoardContractNoteNo}</td>
                                <td>{data.auctBuyerContractNoteNo}</td>
                                <td>{data.eligibility}</td>
                                <td>{data.sellerEligibility}</td>
                                <td>{data.tbEligibility}</td>
                                <td>{data.abAckNo}</td>
                                <td>{data.abCNNAckDt}</td>
                                <td>{data.abIRN}</td>
                                <td>{data.abSignedQRCode}</td>
                                <td>{data.sellerAckNo}</td>
                                <td>{data.sellerCNNAckDt}</td>
                                <td>{data.sellerIRN}</td>
                                <td>{data.sellerQRGenerated}</td>
                                <td>{data.tbAckNo}</td>
                                <td>{data.tbCNNAckDt}</td>
                                <td>{data.tbIRN}</td>
                                <td>{data.tbSignedQRCode}</td>
                                <td>{data.auctioneerAckNo}</td>
                                <td>{data.auctioneerCNNAckDt}</td>
                                <td>{data.auctioneerIRN}</td>
                                <td>{data.auctioneerSignedQRCode}</td>
                                <td>{data.contractNoteDetailsID}</td>
                                <td>{data.lotNo}</td>
                                <td>{data.dealIDNo}</td>
                                <td>{data.grade}</td>
                                <td>{data.gardenInvoiceNo}</td>
                                <td>{data.mark}</td>
                                <td>{data.warehouse}</td>
                                <td>{data.pkgType}</td>
                                <td>{data.grossKgs}</td>
                                <td>{data.shortKgs}</td>
                                <td>{data.shortPkgs}</td>
                                <td>{data.sampleKgs}</td>
                                <td>{data.samplePkgs}</td>
                                <td>{data.netKgs}</td>
                                <td>{data.totalNetKgs}</td>
                                <td>{data.rate}</td>
                                <td>{data.teaValue}</td>
                                <td>{data.brokerage}</td>
                                <td>{data.brokerageRate}</td>
                                <td>{data.lotMoney}</td>
                                <td>{data.teaBoardCharges}</td>
                                <td>{data.dealSGSTValue}</td>
                                <td>{data.dealSGSTRate}</td>
                                <td>{data.dealCGSTValue}</td>
                                <td>{data.dealCGSTRate}</td>
                                <td>{data.dealIGSTValue}</td>
                                <td>{data.dealIGSTRate}</td>
                                <td>{data.buyBrkgeSGSTValue}</td>
                                <td>{data.buyBrkgeSGSTRate}</td>
                                <td>{data.buyBrkgeCGSTValue}</td>
                                <td>{data.buyBrkgeCGSTRate}</td>
                                <td>{data.buyBrkgeIGSTValue}</td>
                                <td>{data.buyBrkgeIGSTRate}</td>
                                <td>{data.tbSGSTValue}</td>
                                <td>{data.tbSGSTRate}</td>
                                <td>{data.tbCGSTValue}</td>
                                <td>{data.tbCGSTRate}</td>
                                <td>{data.tbIGSTValue}</td>
                                <td>{data.tbIGSTRate}</td>
                                <td>{data.totalAuctioneerServicesAmount}</td>
                                <td>{data.netAmount}</td>
                                <td>{data.totalSellerAmount}</td>
                                <td>{data.totalTeaBoardAmount}</td>
                                <td>{data.totalAuctBuyerAmount}</td>
                                <td>{data.tcsCollectedBySeller}</td>

                                <td className="Action">
                                  {modalRight?.some((ele) => ele === "3") && (
                                    <i
                                      className="fa fa-eye"
                                      title="View"
                                      onClick={() => handleView(data)}
                                    ></i>
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
        <Modal
          show={showmodal}
          onHide={handleCloseHistory}
          backdrop="static"
          size="xl"
          centered
        >
          <Modal.Header>
            <Modal.Title>View Invoice</Modal.Title>
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
                        <th>Prompt Date</th>
                        <th>Reference No</th>
                        <th>CN No</th>
                        <th>Cn Date</th>
                        <th>Auctioneer Name</th>
                        <th>Tea type</th>
                        <th>Sale Type</th>
                        <th>Lot No</th>
                        <th>Deal Identification No</th>
                        <th>Garden Invoice No</th>
                        <th>Tax Invoice Date</th>
                        <th>Mark</th>
                        <th>Grade</th>
                        <th>Category</th>
                        <th>Net Qty (Kgs)</th>
                        <th>Sample Qty (Kgs)</th>
                        <th>Short Qty (Kgs)</th>
                        <th>Qty Purchased (Kgs)</th>
                        <th>Price/Kg</th>
                        <th>Tea Value Invoice No.</th>
                        <th>Tea Value</th>
                        <th>SGST On Tea Value</th>
                        <th>CGST On Tea Value</th>
                        <th>IGST On Tea Value</th>
                        <th>Tea Value Invoice Amount</th>
                        <th>Auctioneer Invoice No</th>
                        <th>Buying Brokerage</th>
                        <th>Lot Money</th>
                        <th>Auctioneer Services Taxable Value</th>
                        <th>SGST On Auctioneer Services</th>
                        <th>CGST On Auctioneer Services</th>
                        <th>IGST On Auctioneer Services</th>
                        <th>Auctioneer Invoice Amount</th>
                        <th>STAMP</th>
                        <th>TeaBoard Invoice No</th>
                        <th>TeaBoard Charges</th>
                        <th>SGST On TeaBoard Charges</th>
                        <th>CGST On TeaBoard Charges</th>
                        <th>IGST On TeaBoard Charges</th>
                        <th>TeaBoard Invoice Amount</th>
                        <th>Buyer Chestage Allowance</th>
                        <th>TDS On Buying Brokerage</th>
                        <th>TCS Collected By Seller</th>
                        <th>Grand Total</th>
                        <th>Delivery Order No</th>
                        <th>Total Tea Invoice Amount (Rs)</th>
                        <th>Total Auctioneer Invoice Amount (Rs)</th>
                        <th>Total Tea Board Invoice Amount (Rs)</th>
                        <th>Grand Total (Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewData?.length > 0 ? (
                        <>
                          {viewData?.map((data, index) => (
                            <tr key={index}>
                              <td>{data.season}</td>
                              <td>{data.saleNo}</td>
                              <td>{data.promptDate}</td>
                              <td>{data.referenceNo}</td>
                              <td>{data.cnNo}</td>
                              <td>{data.cnDate}</td>
                              <td>{data.auctioneerName}</td>
                              <td>{data.teaType}</td>
                              <td>{data.saleType}</td>
                              <td>{data.lotNo}</td>
                              <td>{data.dealIdentificationNo}</td>
                              <td>{data.gardenInvoiceNo}</td>
                              <td>{data.taxInvoiceDate}</td>
                              <td>{data.mark}</td>
                              <td>{data.grade}</td>
                              <td>{data.category}</td>
                              <td>{data.netQtyKgs}</td>
                              <td>{data.sampleQtyKgs}</td>
                              <td>{data.shortQtyKgs}</td>
                              <td>{data.qtyPurchasedKgs}</td>
                              <td>{data.priceKg}</td>
                              <td>{data.teaValueInvoiceNo}</td>
                              <td>{data.teaValue}</td>
                              <td>{data.sgstOnTeaValue}</td>
                              <td>{data.cgstOnTeaValue}</td>
                              <td>{data.igstOnTeaValue}</td>
                              <td>{data.teaValueInvoiceAmount}</td>
                              <td>{data.auctioneerInvoiceNo}</td>
                              <td>{data.buyingBrokerage}</td>
                              <td>{data.lotMoney}</td>
                              <td>{data.auctioneerServicesTaxableValue}</td>
                              <td>{data.sgstOnAuctioneerServices}</td>
                              <td>{data.cgstOnAuctioneerServices}</td>
                              <td>{data.igstOnAuctioneerServices}</td>
                              <td>{data.auctioneerInvoiceAmount}</td>
                              <td>{data.stamp}</td>
                              <td>{data.teaBoardInvoiceNo}</td>
                              <td>{data.teaBoardCharges}</td>
                              <td>{data.sgstOnTeaBoardCharges}</td>
                              <td>{data.cgstOnTeaBoardCharges}</td>
                              <td>{data.igstOnTeaBoardCharges}</td>
                              <td>{data.teaBoardInvoiceAmount}</td>
                              <td>{data.buyerChestageAllowance}</td>
                              <td>{data.tdsOnBuyingBrokerage}</td>
                              <td>{data.tcsCollectedBySeller}</td>
                              <td>{data.grandTotal}</td>
                              <td>{data.deliveryOrderNo}</td>
                              <td>{data.totalTeaInvoiceAmountRs}</td>
                              <td>{data.totalAuctioneerInvoiceAmountRs}</td>
                              <td>{data.totalTeaBoardInvoiceAmountRs}</td>
                              <td>{data.grandTotalRs}</td>
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
                <div className="col-lg-9 mt-4">
                  <div className="TableBox">
                    <table className="table">
                      <thead>
                        <th colSpan={6} className="text-center">
                          Calculation
                        </th>
                        <tr>
                          <th>Total Tea Invoice Amount</th>
                          <th>Total Auctioneer Invoice Amount</th>
                          <th>Total Tea Board Invoice Amount</th>
                          <th>TDS on Buying Brokerage</th>
                          <th>TCS Collected by Sellers</th>
                          <th>Grand Total</th>
                        </tr>
                      </thead>
                      <tr>
                        <td>{viewData[0].finalTotalTeaInvoiceAmount}</td>
                        <td>{viewData[0].finalTotalAuctioneerInvoiceAmount}</td>
                        <td>{viewData[0].finalTotalTeaBoardInvoiceAmount}</td>
                        <td>{viewData[0].finalTDSOnBuyingBrokerage}</td>
                        <td>{viewData[0].finalTCSCollectedBySellers}</td>
                        <td>{viewData[0].finalGrandTotal}</td>
                      </tr>
                    </table>
                  </div>

                  <div className="col-md-12">
                    <div className="BtnGroup">
                      <button
                        class="SubmitBtn"
                        title="Export Excel"
                        onClick={() => handleViewExport("excel")}
                      >
                        <i class="fa fa-file-excel"></i>
                      </button>
                      <button
                        class="SubmitBtn"
                        title="Export PDF"
                        onClick={() => handleViewExport("pdf")}
                      >
                        <i class="fa fa-file-pdf"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default ViewBuyerTaxInvoice;
