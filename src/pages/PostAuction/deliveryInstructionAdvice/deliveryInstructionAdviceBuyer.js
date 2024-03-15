/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axiosMain from "../../../http/axios/axios_main";
import CustomToast from "../../../components/Toast";
import {
  bindAuctionDateRequest,
  bindAuctioneerRequest,
  bindLoatNoRequest,
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
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";
import Base64ToExcelDownload from "../../Base64ToExcelDownload";
import { uploadedFileDownload } from "../../uploadDocument/UploadedFileDownload";
import { NO_OF_RECORDS } from "../../../constants/commonConstants";
import { ThreeDots } from "react-loader-spinner";

function DeliveryInstructionAdviceBuyer({ modalRight }) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 5; i++) {
    const year = currentYear - i;
    years.push(year);
  }
  const [expanded, setExpanded] = React.useState("panel1");
  const [factoryExpanded, setFactoryExpanded] = React.useState("panel1");
  const handleChangeFactoryOwnerExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel1" == panel && isExpanded) {
      setViewBuyerData([]);
      setSelectedRows([]);
      setViewDealBookTaoData([]);
      reset();
    }

    if ("panel3" == panel && isExpanded) {
      setViewBuyerData([]);
      setSelectedRows([]);
      reset();
    }

    if ("panel2" == panel && isExpanded) {
      setViewDealBookTaoData([]);
      reset();
      setSelectedRows([]);
    }
  };
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId } =
    useAuctionDetail();
  const [ViewDealBookTaoData, setViewDealBookTaoData] = useState([]);
  const [allSaleNoList, setallSaleNoList] = useState([]);
  const [allAuctioneerList, setallAuctioneerList] = useState([]);
  const [allAuctionCenterList, setallAuctionCenterList] = useState([]);
  const [season, setSeason] = useState(currentYear);
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const [selectedDataOfList, setselectedDataOfList] = useState([]);
  const [selectedDataOfExportExcel, setselectedDataOfExportExcel] = useState(
    []
  );
  const [ViewBuyerData, setViewBuyerData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [splitDIValues, setSplitDIValues] = useState(
    Array(ViewDealBookTaoData?.length).fill("")
  );
  const [DealBookSearch, setDealBookSearch] = useState({
    season: String(currentYear),
    saleNo: null,
    loggedinfromAuctionCenterName: auctionCenterId,
    auctioneerName: null,
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
      url: "/postauction/deliveryinstruction/buyer/search",
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
    if (
      DealBookSearch.status == null ||
      DealBookSearch.status == "SELECT" ||
      DealBookSearch.status == ""
    ) {
      CustomToast.error("Please select status");
      isValid = false;
      return;
    }
    return isValid;
  };

  const [pageNo, setPageNo] = useState(2);
  const ViewDealBookList = async () => {
    try {
      const response = await axiosMain.post(
        "/postauction/deliveryinstruction/buyer/search",
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
        "/postauction/deliveryinstruction/buyer/search",
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
    const selectedValue = value != "" ? value : null; // Handle null if no option is selected
    setDealBookSearch({ ...DealBookSearch, [name]: selectedValue });
    setSeason(DealBookSearch.season);
  };
  const handleCheckboxChange = (index, isChecked) => {
    if (isChecked) {
      setSelectedRows([...selectedRows, index]);
    } else {
      setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
    }
  };
  // const handleSplitDIChange = (index, value) => {
  //   if (/[A-Za-z]/.test(value)) {
  //     value = "";
  //     CustomToast.error("Please enter numeric values only");
  //     return;
  //   }
  //   const formattedValue = value.replace(/\s/g, ",");
  //   const numericValues = formattedValue
  //     .replace(/[^\d,]/g, "")
  //     .split(",")
  //     .map(Number);

  //   const sum = numericValues.reduce((acc, val) => acc + val, 0);
  //   if (isNaN(sum) || sum !== ViewDealBookTaoData[index].totalPackage) {
  //     CustomToast.error(
  //       `The sum of splitDI values must be equal to ${ViewDealBookTaoData[index].totalPackage}`
  //     );
  //     return;
  //   }
  //   const newSplitDIValues = [...splitDIValues];
  //   newSplitDIValues[index] = formattedValue;
  //   setSplitDIValues(newSplitDIValues);
  // };
  const handleSplitDIChange = (index, value) => {
    if (/[A-Za-z]/.test(value)) {
      value = "";
      CustomToast.error("Please enter numeric values only");
      return;
    }

    const formattedValue = value.replace(/\s/g, ",");
    const numericValues = formattedValue
      .replace(/[^\d,]/g, "")
      .split(",")
      .map(Number);

    const sum = numericValues.reduce((acc, val) => acc + val, 0);
    const maxAllowedSum = ViewDealBookTaoData[index].totalPackage;

    if (isNaN(sum) || sum > maxAllowedSum) {
      CustomToast.error(
        `The sum of splitDI values must be less than or equal to ${maxAllowedSum}`
      );
      return;
    }

    const newSplitDIValues = [...splitDIValues];
    newSplitDIValues[index] = formattedValue;
    setSplitDIValues(newSplitDIValues);
  };
  // const confirmSplit = () => {
  //   const selectedData = selectedRows.map((index) => ({
  //     deliveryInstructionId: ViewDealBookTaoData[index].deliveryInstructionId,
  //     splitDI: splitDIValues[index],
  //     totalPackages: ViewDealBookTaoData[index].totalPackage,
  //     diDate: ViewDealBookTaoData[index].diDate,
  //     createdOn: ViewDealBookTaoData[index].diDate,
  //     updatedOn: ViewDealBookTaoData[index].diDate,
  //   }));

  //   if (selectedData?.length == 0) {
  //     CustomToast.error(
  //       "Please select at least one row before clicking confirm split."
  //     );
  //     return;
  //   }

  //   axiosMain
  //     .post("/postauction/deliveryinstruction/buyer/confirmSplit", selectedData)
  //     .then((response) => {
  //       if (response.data.statusCode == 200) {
  //         CustomToast.success(response.data.message);
  //         setSplitDIValues([]);
  //         if (Validate()) {
  //           ViewDealBookList();
  //         }
  //       } else {
  //         CustomToast.error(response.data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("POST request failed");
  //       console.error("Error:", error);
  //     });
  // };
  const deselectAllCheckboxes = () => {
    setSelectedRows([]);
    console.log(selectedRows);
  };

  const confirmSplit = () => {
    const selectedData = selectedRows.map((index) => ({
      deliveryInstructionId: ViewDealBookTaoData[index].deliveryInstructionId,
      splitDI: splitDIValues[index],
      totalPackages: ViewDealBookTaoData[index].totalPackage,
      diDate: ViewDealBookTaoData[index].diDate,
      createdOn: ViewDealBookTaoData[index].diDate,
      updatedOn: ViewDealBookTaoData[index].diDate,
    }));

    if (selectedData?.length == 0) {
      CustomToast.error(
        "Please select at least one row before clicking confirm split."
      );
      return;
    }

    axiosMain
      .post("/postauction/deliveryinstruction/buyer/confirmSplit", selectedData)
      .then((response) => {
        if (response.data.statusCode == 200) {
          CustomToast.success(response.data.message);
          setSplitDIValues([]);
          deselectAllCheckboxes();
          ViewDealBookList();
          clearInputs();
          ViewDealBookList();
        } else {
          CustomToast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("POST request failed");
        console.error("Error:", error);
      });
  };
  const clearInputs = () => {
    const inputFields = document.querySelectorAll('input[type="text"]');
    inputFields.forEach((input) => {
      input.value = ""; // Clear the value of the input field
    });
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
  const [selectedDeliveryInstructions, setSelectedDeliveryInstructions] =
    useState([]);

  const listCheckboxChange = (index, isChecked) => {
    const selectedIds = [...selectedDeliveryInstructions];
    if (isChecked) {
      selectedIds.push(ViewDealBookTaoData[index].deliveryInstructionId);
    } else {
      const idIndex = selectedIds.indexOf(
        ViewDealBookTaoData[index].deliveryInstructionId
      );
      if (idIndex !== -1) {
        selectedIds.splice(idIndex, 1);
      }
    }
    setSelectedDeliveryInstructions(selectedIds);

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

  const RequestDelivery = () => {
    if (selectedDataOfList?.length == 0) {
      CustomToast.error(
        "Please select at least one row before clicking request delivery."
      );
      return;
    }
    axiosMain
      .post(
        "/postauction/deliveryinstruction/buyer/requestDelivery",
        selectedDataOfList
      )
      .then((response) => {
        if (response.data.statusCode == 200) {
          CustomToast.success(response.data.message);
          setselectedDataOfList([]);
          ViewDealBookList();
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
  // const ViewMore = (id) => {

  //   const deliveryIds = selectedDataOfList.map(
  //     (item) => item.deliveryInstructionId
  //   );
  //   const deliveryIdsString = deliveryIds.join(",");

  //   if (deliveryIdsString?.length == 0 || id == null) {
  //     CustomToast.error(
  //       "Please select at least one row before clicking view details."
  //     );
  //     return;
  //   }

  //   if (id != null) {
  //     var url = `/postauction/deliveryinstruction/buyer/view/${id}`;
  //   } else {
  //     var url = `/postauction/deliveryinstruction/buyer/view/${deliveryIdsString}`;
  //   }

  //   axiosMain
  //     .get(url)
  //     .then((response) => {
  //       if (response.data.statusCode === 200) {
  //         CustomToast.success(response.data.message);
  //         setViewBuyerData(response.data.responseData);
  //         setExpanded("panel3");
  //       } else {
  //         CustomToast.error(response.data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("POST request failed");
  //       console.error("Error:", error);
  //     });
  // };

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
    var url = `/postauction/deliveryinstruction/buyer/view/${DataIds}`;
    axiosMain
      .get(url)
      .then((response) => {
        if (response.data.statusCode === 200) {
          CustomToast.success(response.data.message);
          setViewBuyerData(response.data.responseData);
          setExpanded("panel3");
        } else {
          CustomToast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("POST request failed");
        console.error("Error:", error);
      });
  };

  const exportSelectedRowsToExcel = () => {
    if (selectedDataOfExportExcel?.length == 0) {
      CustomToast.error("Please select at least one row before export.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(selectedDataOfExportExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "delivery-instruction-advice.xlsx");
  };

  const [base64Zip, setBase64Zip] = useState("");
  useEffect(() => {
    const parameters = selectedDeliveryInstructions.join(",");
    axiosMain
      .get(`/postauction/deliveryinstruction/buyer/downloadDi/${parameters}`)
      .then((response) => {
        const base64Data = response.data;
        setBase64Zip(base64Data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedDeliveryInstructions]);

  function download(filename, base64Zip) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;base64," + base64Zip);
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const handleDownload = () => {
    download("zip1.zip", base64Zip);
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
        saleNo: null,
        loggedinfromAuctionCenterName: auctionCenterId,
        auctioneerName: null,
        status: null,
      });
    }, 0);
  };

  useEffect(() => {
    if (DealBookSearch.season !== "") {
      dispatch(
        bindSaleNoRequest({
          season: DealBookSearch.season,
          auctionCenterId: auctionCenterId,
        })
      );
    }
  }, [DealBookSearch.season]);
  useEffect(() => {
    if (DealBookSearch.saleNo !== null) {
      dispatch(
        bindAuctionDateRequest({
          season: DealBookSearch.season,
          saleNo: DealBookSearch.saleNo,
          auctionCenterId: auctionCenterId,
        })
      );
    }
  }, [DealBookSearch.saleNo]);
  useEffect(() => {
    dispatch(fetchAuctionRequest());
    dispatch(bindAuctioneerRequest({ roleCode: "AUCTIONEER" }));
  }, []);
  useEffect(() => {
    setallAuctionCenterList(getAllAuctionCenterList);
    setallAuctioneerList(auctineerList);
    setallSaleNoList(saleNoData);
  }, [getAllAuctionCenterList, auctineerList, saleNoData]);

  return (
    <div>
      <div>
        <Accordion
          expanded={expanded === "panel1"}
          className={`${expanded === "panel1" ? "active" : ""}`}
          onChange={handleChangeFactoryOwnerExpand("panel1")}
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Split Delivery Instruction</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <form onSubmit={SearchViewDealBook}>
                {modalRight?.some((ele) => ele === "12") && (
                  <>
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
                          <label>Status</label>
                          <label className="errorLabel"> * </label>
                          <select
                            name="status"
                            value={DealBookSearch.status}
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
                          <label>Auctioneer Name </label>
                          <select
                            name="auctioneerName"
                            value={DealBookSearch.auctioneerName}
                            className="form-control select-form"
                            onChange={handleViewDealSearch}
                          >
                            <option value="">Select Auctioneer Name</option>
                            {allAuctioneerList?.map(
                              (allAuctioneerList, index) => (
                                <option
                                  value={allAuctioneerList.userId}
                                  key={index}
                                >
                                  {allAuctioneerList.userName}
                                </option>
                              )
                            )}
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
                            <option value="">Select Auction Center</option>
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
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Select</th>
                                <th>Split DI</th>
                                <th>Total Packages</th>
                                <th>Lot No</th>
                                <th>Mark</th>
                                <th>Auctioneer</th>
                                <th>Warehouse Name</th>
                                <th>Refere nce No</th>
                                <th>Delivery Instruction / AdviceNo</th>
                                <th>Deal Identification No</th>
                                <th>DI Date</th>
                                <th>Total Quantity</th>
                                <th>Total Amount</th>
                                <th>Status</th>
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
                                          disabled={item.status != 0}
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              index,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <input
                                          name={`splitDI-${index}`}
                                          value={splitDIValues[index]}
                                          onChange={(e) =>
                                            handleSplitDIChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                          type="text"
                                          disabled={
                                            !selectedRows.includes(index)
                                          }
                                        />
                                      </td>
                                      <td>{item.totalPackage}</td>
                                      <td>{item.lotNo}</td>
                                      <td>{item.markName}</td>
                                      <td>{item.auctioneerName}</td>
                                      <td>
                                        {item.wareHouseName == null
                                          ? "-"
                                          : item.wareHouseName}
                                      </td>
                                      <td>{item.referenceNo}</td>
                                      <td>
                                        {item.deliveryInstructionAdviceNo}
                                      </td>
                                      <td>{item.dealIdentificationNo}</td>
                                      <td>{item.diDate}</td>
                                      <td>{item.totalQuantity}</td>
                                      <td>{item.totalAmount}</td>
                                      <td>
                                        {getStatusText(parseInt(item.status))}
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <tr>
                                    <td colSpan={14} className="text-center">
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
                  </>
                )}
                <div className="row">
                  <div className="col-12">
                    <div className="BtnGroup">
                      {modalRight?.some((ele) => ele === "70") && (
                        <button
                          className="SubmitBtn"
                          onClick={() => confirmSplit()}
                          type="button"
                          disabled={selectedRows?.length == 0}
                        >
                          Confirm Split
                        </button>
                      )}
                      {modalRight?.some((ele) => ele === "12") && (
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
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          className={`${expanded === "panel2" ? "active" : ""}`}
          onChange={handleChangeFactoryOwnerExpand("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>List Delivery Instruction </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <form onSubmit={SearchViewDealBook}>
                {modalRight?.some((ele) => ele === "12") && (
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
                        <label>Status</label>
                        <label className="errorLabel"> * </label>
                        <select
                          name="status"
                          value={DealBookSearch.status}
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
                        <label>Auctioneer Name </label>
                        <select
                          name="auctioneerName"
                          value={DealBookSearch.auctioneerName}
                          className="form-control select-form"
                          onChange={handleViewDealSearch}
                        >
                          <option value="">Select Auctioneer Name</option>
                          {allAuctioneerList?.map(
                            (allAuctioneerList, index) => (
                              <option
                                value={allAuctioneerList.userId}
                                key={index}
                              >
                                {allAuctioneerList.userName}
                              </option>
                            )
                          )}
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
                          <option value="">Select Auction Center</option>
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
                    <div className="col-12 mt-3">
                      <div className="TableBox">
                        <table className="table" ref={tableRef}>
                          <thead>
                            <tr>
                              <th>Select</th>
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
                                        disabled={item.status != 2}
                                      />
                                    </td>
                                    <td>{item.auctioneerName}</td>
                                    <td>{item.wareHouseName}</td>
                                    <td>{item.referenceNo}</td>
                                    <td>{item.deliveryInstructionAdviceNo}</td>
                                    <td>{item.lotNo}</td>
                                    <td>{item.markName}</td>
                                    <td>{item.dealIdentificationNo}</td>
                                    <td>{item.diDate}</td>
                                    <td>{item.qty}</td>
                                    <td>{item.pin}</td>
                                    <td>
                                      {getStatusText(parseInt(item.status))}
                                    </td>
                                    <td>{item.eligibility}</td>
                                    <td>{item.ackNo}</td>
                                    <td>{item.irn}</td>
                                    <td
                                      className="Action"
                                      onClick={() =>
                                        ViewMore(item.deliveryInstructionId)
                                      }
                                    >
                                      <i
                                        className="fa fa-eye"
                                        title="View Details"
                                      ></i>
                                    </td>
                                  </tr>
                                ))}
                              </>
                            ) : (
                              <>
                                <tr>
                                  <td colSpan={16} className="text-center">
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
                )}
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="BtnGroup">
                      {DealBookSearch.status == 2 ? (
                        <>
                          {modalRight?.some((ele) => ele === "71") && (
                            <button
                              className="SubmitBtn"
                              onClick={() => RequestDelivery()}
                              type="button"
                              disabled={selectedDataOfList?.length == 0}
                            >
                              Request Delivery
                            </button>
                          )}
                          {modalRight?.some((ele) => ele === "72") && (
                            <button
                              className="SubmitBtn"
                              type="button"
                              disabled={selectedDataOfList?.length == 0}
                              onClick={() => handleDownload()}
                              // onClick={() => handleExport("pdf")}
                            >
                              Download DI
                            </button>
                          )}
                        </>
                      ) : (
                        ""
                      )}

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
                </div>
              </form>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          className={`${expanded === "panel3" ? "active" : ""}`}
          onChange={handleChangeFactoryOwnerExpand("panel3")}
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>View Delivery Instruction</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row mt-3">
                <div className="col-12">
                  <div className="TableBox">
                    <table className="table" ref={tableRef}>
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

export default DeliveryInstructionAdviceBuyer;
