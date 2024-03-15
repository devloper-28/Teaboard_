/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axiosMain from "../../../http/axios/axios_main";
import CustomToast from "../../../components/Toast";
import {
  bindAuctionDateRequest,
  bindAuctioneerRequest,
  bindSaleNoRequest,
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
import Base64ToExcelDownload from "../../Base64ToExcelDownload";
import { uploadedFileDownload } from "../../uploadDocument/UploadedFileDownload";
import { NO_OF_RECORDS } from "../../../constants/commonConstants";
import { ThreeDots } from "react-loader-spinner";

function DeliveryInstructionAdviceWarehouse({ modalRight }) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 5; i++) {
    const year = currentYear - i;
    years.push(year);
  }
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId } =
    useAuctionDetail();
  const [expanded, setExpanded] = React.useState("panel1");
  const [factoryExpanded, setFactoryExpanded] = React.useState("panel1");
  const handleChangeFactoryOwnerExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      setViewBuyerData([]);
    }
  };
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarkValue, setRemarkValue] = useState("");
  const [ViewDealBookTaoData, setViewDealBookTaoData] = useState([]);
  const [allSaleNoList, setallSaleNoList] = useState([]);
  const [allBuyerList, setallBuyerListList] = useState([]);
  const [allAuctionCenterList, setallAuctionCenterList] = useState([]);
  const [season, setSeason] = useState(currentYear);
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedDataOfList, setselectedDataOfList] = useState([]);
  const [selectedDataOfSubmit, setselectedDataOfSubmit] = useState([]);
  const pinDefaultValues = []; // An array of default values for each item
  const [pinValues, setPinValues] = useState(pinDefaultValues);
  const [selectedDataOfExportExcel, setselectedDataOfExportExcel] = useState(
    []
  );
  const [ViewBuyerData, setViewBuyerData] = useState([]);
  const [DealBookSearch, setDealBookSearch] = useState({
    saleNo: null,
    loggedinfromAuctionCenterName: auctionCenterId,
    status: null,
    buyerName: null,
    saleYear: String(currentYear),
    deliveryOrderNo: null,
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
  const auctineerList = useSelector(
    (state) => state.saleNoReducer.auctineerList
  );
  const saleNoData = useSelector((state) => state.saleNoReducer.saleList);

  const ExportExcelDatas = useSelector(
    (state) => state.documentReducer.exportData.responseData?.exported_file
  );

  const getExportDataApiCallResponse = useSelector(
    (state) => state.documentReducer.exportDataApiCall
  );

  const [exportType, setexportType] = useState("");

  const handleExport = (exportType) => {
    const updatedDealBookSearch = {
      ...DealBookSearch,
      url: "/postauction/deliveryinstruction/warehouse/search",
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

  const Validate = () => {
    let isValid = true;
    if (
      DealBookSearch.saleYear == null ||
      DealBookSearch.saleYear == "SELECT" ||
      DealBookSearch.saleYear == ""
    ) {
      CustomToast.error("Please select sale year");
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
  const [pageNo, setPageNo] = useState(2);
  const ViewDealBookList = async () => {
    try {
      const response = await axiosMain.post(
        "/postauction/deliveryinstruction/warehouse/search",
        { ...DealBookSearch, pageNo: 1, noOfRecords: NO_OF_RECORDS }
      );
      setViewDealBookTaoData(response.data.responseData);
    } catch (error) {
      console.error("Error:", error);
    }
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
  const handleViewMore = async () => {
    try {
      const response = await axiosMain.post(
        "/postauction/deliveryinstruction/warehouse/search",
        {
          ...DealBookSearch,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS, // Pass NO_OF_RECORDS as 20
        }
      );

      if (Array.isArray(response.data.responseData)) {
        if (response.data.responseData.length === 0) {
          // Handle case when response is empty if necessary
        } else {
          setViewDealBookTaoData((prevData) => [
            ...prevData,
            ...response.data.responseData,
          ]);
          setPageNo((prevPageNo) => prevPageNo + 1); // Increment pageNo
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
    const { name, value } = e.target;
    const selectedValue = value != "" ? value : null;
    setDealBookSearch({ ...DealBookSearch, [name]: selectedValue });
    setSeason(DealBookSearch.season);
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
      // If the row is checked, add the selected data to the array
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
  // const exportSelectedRowsToExcel = () => {
  //   if (selectedDataOfExportExcel?.length == 0) {
  //     CustomToast.error("Please select at least one row before export.");
  //     return;
  //   }
  //   const ws = XLSX.utils.json_to_sheet(selectedDataOfExportExcel);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Users");
  //   XLSX.writeFile(wb, "delivery-instruction-advice.xlsx");
  // };
  // const GetPDF = () => {
  //   const newData = selectedDataOfList.map(({ status, ...rest }) => rest);
  //   axiosMain
  //     .post(`/postauction/deliveryinstruction/buyer/getPDF`, newData)
  //     .then((response) => {
  //       if (response.data.statusCode == 200) {
  //         CustomToast.success(response.data.message);
  //       } else {
  //         CustomToast.error(response.data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // };
  // const DownloadPDF = () => {
  //   const doc = new jsPDF();
  //   const table = tableRef.current;
  //   html2canvas(table).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pageWidth = 210;
  //     const pageHeight = 297;
  //     const imgWidth = 190;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  //     doc.save("delivery-instruction-advice.pdf");
  //   });
  // };
  // const handleFileUpload = (files) => {
  //   const newFiles = files?.map((file) => ({
  //     documentContent: file.documentContent,
  //     documentName: file.documentName,
  //     documentSize: file.documentSize,
  //   }));
  //   setUploadedDocuments(newFiles);
  // };
  // const UploadPDF = () => {
  //   if (uploadedDocuments?.length == 0) {
  //     CustomToast.error("Please select file.");
  //   }
  //   console.log(uploadedDocuments);
  // };
  const completedDelivery = (index, id, pin, remark) => {
    const Data = {
      deliveryInstructionId: id,
      pin: pin[index],
      remarks: remark,
    };

    if (!Data.pin) {
      CustomToast.error("Pin is missing.");
    }

    if (!Data.remarks) {
      CustomToast.error("Remarks are missing.");
    }

    axiosMain
      .post(
        `/postauction/deliveryinstruction/warehouse/completedDelivery`,
        Data
      )
      .then((response) => {
        if (response.data.statusCode == 200) {
          CustomToast.success(response.data.message);
        } else {
          CustomToast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const reset = () => {
    setDealBookSearch({
      saleNo: String(currentYear),
      loggedinfromAuctionCenterName: auctionCenterId,
      status: "",
      buyerName: "",
      saleYear: "",
      deliveryOrderNo: "",
    });

    setTimeout(() => {
      setDealBookSearch({
        saleNo: String(currentYear),
        loggedinfromAuctionCenterName: auctionCenterId,
        status: null,
        buyerName: null,
        saleYear: null,
        deliveryOrderNo: null,
      });
    }, 0);
  };

  ViewDealBookTaoData?.forEach((item, index) => {
    pinDefaultValues[index] = item.pinDefaultValue;
  });

  useEffect(() => {
    if (DealBookSearch.saleYear !== "") {
      dispatch(
        bindSaleNoRequest({
          season: DealBookSearch.saleYear,
          auctionCenterId: auctionCenterId,
        })
      );
    }
  }, [DealBookSearch.saleYear]);
  useEffect(() => {
    if (DealBookSearch.saleNo !== null) {
      dispatch(
        bindAuctionDateRequest({
          saleYear: DealBookSearch.season,
          saleNo: DealBookSearch.saleNo,
          auctionCenterId: auctionCenterId,
        })
      );
    }
  }, [DealBookSearch.saleNo]);
  useEffect(() => {
    dispatch(fetchAuctionRequest());
    dispatch(bindAuctioneerRequest({ roleCode: "AUCTIONEER" }));
    dispatch(fetchAuctionRequest());
  }, []);
  useEffect(() => {
    setallAuctionCenterList(getAllAuctionCenterList);
    setallSaleNoList(saleNoData);
  }, [getAllAuctionCenterList, auctineerList, saleNoData]);

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
              {modalRight?.some((ele) => ele === "12") && (
                <form onSubmit={SearchViewDealBook}>
                  <div className="row">
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Sale Year</label>
                        <select
                          name="saleYear"
                          value={DealBookSearch.saleYear}
                          className="form-control select-form"
                          onChange={handleViewDealSearch}
                        >
                          <option value="">Select Sale Year</option>
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
                          <option value="">Select Sale No</option>
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
                        <label>Delivery Status</label>
                        <select
                          name="status"
                          value={DealBookSearch.status || null}
                          className="form-control select-form"
                          onChange={handleViewDealSearch}
                        >
                          <option value="">Select Status</option>
                          {StatusList.map((statusItem) => (
                            <option
                              key={statusItem.status}
                              value={statusItem.id}
                            >
                              {statusItem.status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Buyer Name </label>
                        <input
                          type="text"
                          name="buyerName"
                          value={DealBookSearch.buyerName}
                          className="form-control select-form"
                          onChange={handleViewDealSearch}
                        />
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Buyer From </label>
                        <select
                          name="loggedinfromAuctionCenterName"
                          value={DealBookSearch.loggedinfromAuctionCenterName}
                          className="form-control select-form"
                          onChange={handleViewDealSearch}
                        >
                          <option value="">Select Buyer From</option>
                          {allAuctionCenterList?.map(
                            (allAuctionCenterList, index) => (
                              <option
                                value={allAuctionCenterList.auctionCenterId}
                              >
                                {allAuctionCenterList.auctionCenterName}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Delivery Order No</label>
                        <input
                          type="text"
                          name="deliveryOrderNo"
                          value={DealBookSearch.deliveryOrderNo}
                          className="form-control select-form"
                          onChange={handleViewDealSearch}
                        />
                      </div>
                    </div>

                    <div className="col-12">
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
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="TableBox">
                        <table className="table" ref={tableRef}>
                          <thead>
                            <tr>
                              <th>Select</th>
                              <th>Seller Name</th>
                              <th>Seller Prompt Date</th>
                              <th>package Type</th>
                              <th>Package Size</th>
                              <th>PIN</th>
                              <th>Delivery Order No</th>
                              <th>Delivery Order Date</th>
                              <th>Delivery Instruction Id</th>
                              <th>Buyer Prompt</th>
                              <th>Status</th>
                              <th>Remark</th>
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

                                    <td>{item.sellerName}</td>
                                    <td>{item.sellerPromptDate}</td>
                                    <td>{item.packageType}</td>
                                    <td>{item.packageSize}</td>
                                    <td>
                                      <input
                                        type="text"
                                        value={pinValues[index]}
                                        name="pin"
                                        className="form-control"
                                        onChange={(e) => {
                                          const newPinValues = [...pinValues];
                                          newPinValues[index] = e.target.value;
                                          setPinValues(newPinValues);
                                        }}
                                      />
                                    </td>

                                    <td>{item.deliveryOrderNo}</td>
                                    <td>{item.deliveryOrderDate}</td>
                                    <td>{item.deliveryInstructionId}</td>
                                    <td>{item.buyerPrompt}</td>

                                    <td>
                                      {getStatusText(parseInt(item.status))}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="remark"
                                        className="form-control"
                                        onChange={(e) =>
                                          setRemarkValue(e.target.value)
                                        }
                                      />
                                    </td>
                                    <td>
                                      <div className="BtnGroup">
                                        <button
                                          type="button"
                                          className="w-auto"
                                          onClick={() =>
                                            completedDelivery(
                                              index,
                                              item.deliveryInstructionId,
                                              pinValues,
                                              remarkValue
                                            )
                                          }
                                        >
                                          Completed Delivery
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </>
                            ) : (
                              <>
                                <tr>
                                  <td colSpan={22} className="text-center">
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
                      <div className="BtnGroup">
                        {modalRight?.some((ele) => ele === "48") && (
                          <button
                            className="SubmitBtn"
                            type="button"
                            // onClick={() => exportSelectedRowsToExcel()}
                            onClick={() => handleExport("excel")}
                          >
                            Export Excel
                          </button>
                        )}
                        {modalRight?.some((ele) => ele === "47") && (
                          <button
                            className="SubmitBtn"
                            type="button"
                            // onClick={() => DownloadPDF()}
                            onClick={() => handleExport("pdf")}
                          >
                            Export PDF
                          </button>
                        )}

                        <button
                          className="SubmitBtn"
                          type="button"
                          onClick={() => ViewMore(null)}
                        >
                          View Details
                        </button>

                        <button
                          class="SubmitBtn"
                          type="button"
                          onClick={handleViewMore}
                        >
                          View More
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
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
                              <td colSpan={15} className="text-center">
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
    </div>
  );
}

export default DeliveryInstructionAdviceWarehouse;
