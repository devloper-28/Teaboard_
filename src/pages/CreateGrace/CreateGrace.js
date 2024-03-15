import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import moment from "moment";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { Modal } from "react-bootstrap";
import CustomToast from "../../components/Toast";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import {
  getGrace,
  getGraceWithoutFilter,
  getAllAuctionCenterAction,
  createGraceAction,
  updateGraceAction,
  getGraceByIdAction,
  getDocumentByIdAction,
  uploadAllDocumentsGraceAction,
  getHistoryByIdAction,
  createEditApiStatusGrace,
  getGraceByIdActionSuccess,
  getBuyer,
  getSaleNoPreauction,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  getDocumentByIdActionSuccess,
} from "../../store/actions";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";
import Modals from "../../components/common/Modal";
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

function CreateGrace({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const currentYear = moment().year();
  const [loader, setLoader] = useState(false);
  const [documentMode, setDocumentmode] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [GraceName, setGraceName] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [saleNoId, setsaleNoId] = useState("");
  const [graceperiod, setgraceperiod] = useState("");
  const [editingGraceData, setEditingGraceData] = useState(null);
  const [effectiveFromDate, seteffectiveFromDate] = useState("");
  const [effectiveEndDate, seteffectiveEndDate] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setuploadDocumentRemarks] = useState("");
  const [showmodal, setShowmodal] = useState(false);
  const [isActive, setisActive] = useState("");
  const [searchAuctionCenterName, setSearchAuctionCenterName] = useState("");
  const [searchBuyerCode, setsearchBuyerCode] = useState("");
  const [submitAuctionCenterName, setsubmitAuctionCenterName] = useState("");
  const [submitBuyerCode, setsubmitBuyerCode] = useState("");
  const [buyerName, setbuyerName] = useState("");
  const [teaRegi, setteaRegi] = useState("");
  const [effectiveFromDateError, seteffectiveFromDateError] = useState("");
  const [effectiveEndDateError, seteffectiveEndDateError] = useState("");
  const [handleSwitchClick, setHandleSwitchClick] = useState(false);
  const [buyerWiseAuctionCenterData, setbuyerWiseAuctionCenterData] = useState(
    []
  );
  const [exportType, setexportType] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const historycolumns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "fieldLabel",
      title: "Field Name",
    },
    {
      name: "oldValue",
      title: "Old Value",
    },
    {
      name: "newValue",
      title: "New Value",
    },
    {
      name: "updatedOn",
      title: "Updated on Date And Time",
    },
    {
      name: "updatedBy",
      title: "Updated By",
    },
  ];

  const renderTableContent = () => {
    if (loader) {
      return (
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
      );
    } else if (rows.length > 0) {
      return (
        <TableComponent
          columns={historycolumns}
          rows={
            getHistoryIdData?.length > 0
              ? getHistoryIdData.map((row, index) => ({
                  ...row,
                  index: index + 1,
                }))
              : []
          }
          sorting={true}
          dragdrop={false}
          fixedColumnsOn={false}
          resizeingCol={false}
        />
      );
    } else {
      return <div className="NoData">No Records Found</div>;
    }
  };

  const getGraceData = useSelector(
    (state) => state?.graceReducer?.getgrace?.responseData
  );
  const getUserData = useSelector(
    (state) => state?.createBuyer?.getBuyer?.responseData
  );
  const [rows, setRows] = useState([]);
  //Radio
  const [selectedValue, setSelectedValue] = useState("");

  // useEffect(() => {
  //   setRows(getGraceData);
  // }, [getGraceData]);
  // useEffect(() => {
  //   const newRows = getGraceData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [getGraceData]);

  useEffect(() => {
    const newRows = getGraceData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.graceId === newRow.graceId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [getGraceData]);

  useEffect(() => {
    dispatch(getBuyer({ roleCode: "BUYER", isActive: 1, userType: 2 }));
    dispatch(getAllAuctionCenterAction());
    dispatch(getGraceWithoutFilter({}));
  }, []);

  const getAllAuctionCenter = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenter?.responseData
  );
  const getAllUploadedDoc = useSelector(
    (state) => state?.graceReducer?.uploadedDocuments?.responseData
  );

  const saleNoDataResponse = useSelector(
    (state) => state?.graceReducer?.saleNoData?.responseData
  );

  const isActiveDataAuctionCenter =
    getAllAuctionCenter &&
    getAllAuctionCenter.filter((data) => 1 == data.isActive);
  const handleChange = (panel) => (event, isExpanded) => {
    if ("panel2" == panel && isExpanded) {
      pageNo = 1;
      dispatch(getGrace({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
      setViewMode(false);
      setEditingGraceData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsGraceAction());
      setViewMode(false);
      setEditingGraceData(null);
      resetForm();
    } else if ("panel1" == panel && isExpanded) {
      setViewMode(false);
      setEditingGraceData(null);
      resetForm();
    }
    setExpanded(isExpanded ? panel : false);
    //new end
  };
  const resetForm = () => {
    setsaleNoId("");
    setSelectedValue("");
    seteffectiveEndDate("");
    seteffectiveFromDate("");
    setgraceperiod("");
    setbuyerName("");
    setsubmitBuyerCode("");
    setsubmitAuctionCenterName("");
    setuploadDocumentRemarks("");
    setUploadedDocuments([]);
    setEditingGraceData("");
    setViewMode(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = true;
    let selectedVal;
    selectedVal =
      editingGraceData == null
        ? selectedValue
        : editingGraceData.userId != null && editingGraceData.userId != ""
        ? (selectedVal = 2)
        : (selectedVal = 1);
    let bc =
      editingGraceData == null
        ? submitBuyerCode
        : editingGraceData.userId
        ? editingGraceData.userId
        : submitBuyerCode;
    let gp =
      editingGraceData == null
        ? saleNoId
        : editingGraceData.saleNo
        ? editingGraceData.saleNo
        : saleNoId;

    let ac =
      editingGraceData == null
        ? submitAuctionCenterName
        : editingGraceData.auctionCenterId
        ? editingGraceData.auctionCenterId
        : submitAuctionCenterName;

    let ef =
      editingGraceData == null
        ? effectiveFromDate
        : editingGraceData.effectiveFrom
        ? editingGraceData.effectiveFrom
        : effectiveFromDate;

    let et =
      editingGraceData == null
        ? effectiveEndDate
        : editingGraceData.effectiveTo
        ? editingGraceData.effectiveTo
        : effectiveEndDate;
    let sni =
      editingGraceData == null
        ? saleNoId
        : editingGraceData.saleNoId
        ? editingGraceData.saleNoId
        : saleNoId;

    if (!selectedVal) {
      CustomToast.error("Please select Auction Center wise / Buyer wise");
      isValid = false;
      return;
    }
    if (selectedVal == 2) {
      if (!bc) {
        CustomToast.error("Please select Buyer code");
        isValid = false;
        return;
      }
    }
    if (!gp) {
      CustomToast.error("Please Select Sale No.");
      isValid = false;
      return;
    }
    if (!ac || ac === "0") {
      CustomToast.error("Please select an auction center from the list.");
      isValid = false;
      return;
    }
    if (!ef) {
      CustomToast.error("Please Select effective from date.");
      isValid = false;
      return;
    }
    if (!et) {
      CustomToast.error("Please Select effective end date");
      isValid = false;
      return;
    }
    // if (!uploadedDocuments.length && !uploadDocumentRemarks) {
    // } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
    //   CustomToast.error("Please enter the remarks");
    //   isValid = false;
    //   return;
    // } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
    //   CustomToast.error("Please upload the document");
    //   isValid = false;
    //   return;
    // }
    if (editingGraceData) {
      editingGraceData.searchData = {
        auctionCenterId: searchAuctionCenterName,
        GraceName: GraceName,
        isActive: isActive,
        userId: searchBuyerCode,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };
      editingGraceData.season
        ? currentYear.toString()
        : (editingGraceData.season = currentYear.toString());

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setRows([]);
        dispatch(updateGraceAction(editingGraceData));
      }, 1000);
    } else {
      let dataForSubmit = {
        auctionCenterId: submitAuctionCenterName,
        userId: submitBuyerCode,
        effectiveFrom: effectiveFromDate,
        effectiveTo: effectiveEndDate,
        sessionUserId: 1,
        saleNo: saleNoId,
        isActive: 1,
        gracingPeriod: graceperiod,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        season: currentYear.toString(),
        searchData: {
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        },
      };

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setRows([]);
        dispatch(createGraceAction(dataForSubmit));
      }, 1000);
    }
  };
  let createData = useSelector(
    (state) => state?.graceReducer?.createEditApiStatus
  );
  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiStatusGrace(false));
      setExpanded("panel2");
      setEditingGraceData(null);
      dispatch(getGraceByIdActionSuccess([]));
      setEditModal(false);
      setViewModal(false);
    }
  });

  const editingDataFromApi = useSelector(
    (state) => state?.graceReducer?.graceData?.responseData
  );

  useEffect(() => {
    if (editingDataFromApi) {
      editingDataFromApi.userId != null && editingDataFromApi.userId != ""
        ? setSelectedValue(2)
        : setSelectedValue(1);
      seteffectiveFromDate(
        moment(editingDataFromApi.effectiveFrom).format("YYYY-MM-DDTHH:mm")
      );
      seteffectiveEndDate(
        moment(editingDataFromApi.effectiveTo).format("YYYY-MM-DDTHH:mm")
      );
      setEditingGraceData(editingDataFromApi);
      if (
        editingDataFromApi.userId != null &&
        editingDataFromApi.userId != ""
      ) {
        let buyerData =
          getUserData &&
          getUserData.filter(
            (data) => editingDataFromApi.userId == data.userId
          );
        setteaRegi(buyerData[0].teaBoardRegistrationCertificate);
        setbuyerName(buyerData[0].userName);
        let auctionCenterIds = buyerData[0].auctionCenterId;
        let buyerWiseAuctionCenter = [];
        isActiveDataAuctionCenter &&
          isActiveDataAuctionCenter.map(
            (auctionCenterData, auctionCenterDataIndex) => {
              if (
                auctionCenterIds.includes(auctionCenterData.auctionCenterId)
              ) {
                buyerWiseAuctionCenter.push(auctionCenterData);
              }
            }
          );
        setbuyerWiseAuctionCenterData(buyerWiseAuctionCenter);
      }
      setsubmitAuctionCenterName(editingDataFromApi.auctionCenterId);
      let centerid = editingDataFromApi.auctionCenterId;
      // dispatch(axiosMain.)
      let payloadData = {
        auctionCenterId: centerid,
        season: currentYear.toString(),
      };
      dispatch(getSaleNoPreauction(payloadData));
    }
  }, [editingDataFromApi]);
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingDataFromApi && editingDataFromApi.graceId;
    let searchData = {
      url: `/admin/grace/get/${id}/${exportType}`,
    };
    setexportViewType(exportType);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(getExportDataForView(searchData));
    }, 1000);
  };
  const getExportViewDataResponse = useSelector(
    (state) => state.documentReducer.exportViewData.responseData?.exported_file
  );

  const getExportDataViewApiCallResponse = useSelector(
    (state) => state.documentReducer.exportDataForViewApiCall
  );

  useEffect(() => {
    if (
      getExportViewDataResponse != null &&
      true == getExportDataViewApiCallResponse
    ) {
      dispatch(getExportDataForViewApiCall(false));
      if ("excel" == exportViewType) {
        Base64ToExcelDownload(
          getExportViewDataResponse,
          "GracingPeriodDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "GracingPeriodDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      auctionCenterId: searchAuctionCenterName,
      GraceName: GraceName,
      isActive: isActive,
      userId: searchBuyerCode,
      isActive,
      url: "/admin/grace/search",
      exportType: exportType,
      isExport: 1,
    };
    setexportType(exportType);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(getExportData(searchData));
    }, 1000);
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
          "GracingPeriodDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "GracingPeriodDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      getGrace({
        auctionCenterId: searchAuctionCenterName,
        GraceName: GraceName,
        isActive: isActive,
        userId: searchBuyerCode,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      getGrace({
        auctionCenterId: searchAuctionCenterName,
        GraceName: GraceName,
        isActive: isActive,
        userId: searchBuyerCode,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const handleSearch = () => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      pageNo = 1;
      setRows([]);
      fetchData();
    }, 1000);
  };

  const handleClearSearch = () => {
    setSearchAuctionCenterName("");
    setsearchBuyerCode("");
    setisActive("");
    pageNo = 1;
    setRows([]);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(getGrace({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    }, 1000);
  };
  const handleEditClick = (GraceId) => {
    dispatch(getGraceByIdAction(GraceId));
    setViewMode(false);
    // setExpanded("panel1");
    setEditModal(true);
  };
  const handleViewClick = (GraceId) => {
    dispatch(getGraceByIdAction(GraceId));
    setViewMode(true);
    // setExpanded("panel1");
    setViewModal(true);
  };
  const getUploadedIdData = useSelector(
    (state) => state?.documentReducer?.documentData?.responseData
  );
  function UploadActionData(data) {
    return (
      <div class="Action">
        {modalRight?.some((ele) => ele === "7") && (
          <i
            class="fa fa-download"
            onClick={() => {
              handleDownloadClick(data.data.uploadDocumentConfId, "download");
            }}
          ></i>
        )}
        <i
         title="Preview"
          class="fa fa-eye"
          onClick={() => {
            handleDownloadClick(data.data.uploadDocumentConfId, "preview");
          }}
        ></i>
      </div>
    );
  }

  useEffect(() => {
    if (
      getUploadedIdData &&
      getUploadedIdData.documentContent &&
      "download" == documentMode
    ) {
      dispatch(getDocumentByIdActionSuccess(""));
      uploadedFileDownload(
        getUploadedIdData.documentContent,
        getUploadedIdData.documentName,
        "data:application/pdf;base64"
      );
    }
  }, [getUploadedIdData]);
  const handleDownloadClick = (uploadDocumentConfId, type) => {
    setDocumentmode(type);
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_Grace";
    const moduleName = "Grace";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };
  const handleCloseHistory = () => setShowmodal(false);
  const getHistoryIdData = useSelector(
    (state) => state?.documentReducer?.historyData?.responseData
  );
  const handleRadioChange = (event) => {
    setsubmitAuctionCenterName("");
    setsubmitBuyerCode("");
    setbuyerName("");
    setteaRegi("");
    setSelectedValue(event.target.value);
  };
  //Buyer data
  const handlesStateNameChange = (e) => {
    editingGraceData
      ? setEditingGraceData({
          ...editingGraceData,
          userId: e.target.value,
        })
      : setsubmitBuyerCode(e.target.value);

    if (e.target.value === "0") {
      setteaRegi("");
      setbuyerName("");
      return;
    }
    let data = JSON.parse(e.target.options[e.target.selectedIndex].id);
    setteaRegi(data.teaBoardRegistrationCertificate);
    setbuyerName(data.userName);
    let auctionCenterIds = data.auctionCenterId;
    let buyerWiseAuctionCenter = [];
    isActiveDataAuctionCenter &&
      isActiveDataAuctionCenter.map(
        (auctionCenterData, auctionCenterDataIndex) => {
          if (auctionCenterIds.includes(auctionCenterData.auctionCenterId)) {
            buyerWiseAuctionCenter.push(auctionCenterData);
          }
        }
      );
    setbuyerWiseAuctionCenterData(buyerWiseAuctionCenter);
  };
  const handlecallsellNo = (e) => {
    editingGraceData
      ? setEditingGraceData({
          ...editingGraceData,
          auctionCenterId: e.target.value,
        })
      : setsubmitAuctionCenterName(e.target.value);

    let payloadData = {
      auctionCenterId: e.target.value,
      season: currentYear.toString(),
    };
    dispatch(getSaleNoPreauction(payloadData));

    //dispatch(getSaleNoPreauction({auctionCenterId:centerid,season:currentYear,}))
  };
  const setValueWithPatterns = (data) => {
    if (data != null && data != "") {
      if (data.toString().match(/^[0-9]*$/)) {
        let number = parseInt(data);
        if (number >= 0 && number < 99.9999999) {
          setgraceperiod(number);
        }
      } else {
        CustomToast.error(
          "only numeric positive value and maximum 2-digit value allowed"
        );
      }
    }
  };

  //Time
  function formatFromDateTime(dateTimeString, key, isEdit) {
    if (false == isEdit) {
      if ("effectiveFromDate" == key) {
        seteffectiveFromDate(moment(dateTimeString).format("YYYY-MM-DDTHH:mm"));
      } else if ("effectiveEndDate" == key) {
        seteffectiveEndDate(moment(dateTimeString).format("YYYY-MM-DDTHH:mm"));
      }
    } else {
      setEditingGraceData({
        ...editingGraceData,
        [key]: moment(dateTimeString).format("YYYY-MM-DDTHH:mm"),
      });
    }
  }

  const radioButtonData = [
    {
      key: "Auction Center Wise *",
      value: "1",
    },
    {
      key: "Buyer Wise *",
      value: "2",
    },
  ];

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center Name",
    },
    {
      name: "gracingPeriod",
      title: "Gracing period",
    },
    {
      name: "userName",
      title: "Buyer Name",
    },
    {
      name: "gracingUsed",
      title: "Gracing period Used",
    },
    {
      name: "remainingGracingPeriod",
      title: "Gracing period Remaining",
    },
    {
      name: "buyerCode",
      title: "Buyer Code",
    },
    {
      name: "saleNoId",
      title: "Sale No.",
    },
    {
      name: "effectiveFrom",
      title: "Effective From Date",
    },
    {
      name: "effectiveFromremain",
      title: "Remaining Gracing period",
    },
    {
      name: "effectiveTo",
      title: "Effective To Date",
    },
    {
      name: "isActive",
      title: "Status",
      getCellValue: (rows) => <StatusData data={rows} />,
    },
    {
      name: "action",
      title: "Action",
      getCellValue: (rows) => <ActionData data={rows} />,
    },
  ];
  function ActionData(data) {
    return (
      <>
        <div class="Action">
          {modalRight?.some((ele) => ele === "2") && (
            <Tooltip title="Edit" placement="top">
              <i
                className="fa fa-edit"
                onClick={() => handleEditClick(data.data.graceId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.graceId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.graceId);
                }}
              ></i>
            </Tooltip>
          )}
        </div>
      </>
    );
  }

  const SwitchDataFromApi = useSelector(
    (state) => state?.graceReducer?.graceData?.responseData
  );

  useEffect(() => {
    if (SwitchDataFromApi && handleSwitchClick) {
      const updatedData = {
        ...SwitchDataFromApi,
        isActive: SwitchDataFromApi.isActive == 1 ? 0 : 1,
      };
      let searchData = {
        auctionCenterId: searchAuctionCenterName,
        GraceName: GraceName,
        isActive: isActive,
        userId: searchBuyerCode,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };

      updatedData.searchData = searchData;

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateGraceAction(updatedData));
      }, 1000);
      setHandleSwitchClick(false);
      dispatch(getGraceByIdActionSuccess([]));
    }
  }, [SwitchDataFromApi, handleSwitchClick]);
  function StatusData(data) {
    const handleSwitchChange = () => {
      // Toggle isActive value when the switch is changed
      setHandleSwitchClick(true);
      dispatch(getGraceByIdAction(data.data.graceId));
      // Call the API to update the isActive status in the backend
    };
    return (
      <>
        {modalRight?.some((ele) => ele === "5") ? (
          <div class="Switch">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id={`customSwitch${data.data.graceId}`}
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange}
              />
              <label
                class="custom-control-label"
                for={`customSwitch${data.data.graceId}`}
              >
                {data.data.isActive === 1 ? "Active" : "In-Active"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.graceId}`}
          >
            {data.data.isActive === 1 ? "Active" : "In-Active"}
          </label>
        )}
      </>
    );
  }

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
  };

  const renderFileTypeIcon = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();

    if (extension === "pdf") {
      return <AiOutlineFilePdf />;
    } else if (
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png"
    ) {
      return <AiOutlineFileImage />;
    } else if (extension === "txt") {
      return <AiOutlineFileText />;
    } else {
      return <AiOutlineFile />;
    }
  };

  const handleCloseViewModal = () => {
    setViewModal(false);
    dispatch(getGrace({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    setViewMode(false);
    setEditingGraceData(null);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    dispatch(getGrace({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    setViewMode(false);
    setEditingGraceData(null);
    resetForm();
  };

  return (
    <>
      {/* Create */}
      {modalRight?.some((ele) => ele === "1") && (
        <Accordion
          expanded={expanded === "panel1"}
          className={`${expanded === "panel1" ? "active" : ""}`}
          onChange={handleChange("panel1")}
          on
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Create Grace</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-center">
                    <div className="col-md-4 d-flex CheckboxGroup mb-3">
                      {radioButtonData &&
                        radioButtonData.map((data, index) => (
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="radio"
                              name={data.value}
                              id={data.key}
                              value={data.value}
                              checked={
                                selectedValue == data.value ? true : false
                              }
                              onChange={(event) => handleRadioChange(event)}
                              disabled={viewMode}
                            />
                            <label class="form-check-label" for={data.key}>
                              {data.key}
                            </label>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </div>
                        ))}
                    </div>
                    {selectedValue == 1 ? (
                      <>
                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Auction Center</label>
                            <label className="errorLabel"> * </label>
                            <select
                              className="form-control select-form"
                              value={
                                editingGraceData?.auctionCenterId ||
                                submitAuctionCenterName
                              }
                              onChange={
                                (e) => handlecallsellNo(e)
                                //   editingGraceData
                                // ? setEditingGraceData({
                                //     ...editingGraceData,
                                //     auctionCenterId: e.target.value,
                                //   })
                                // : setsubmitAuctionCenterName(e.target.value)
                              }
                              disabled={viewMode}
                            >
                              <option value={0}>Select Auction Center</option>
                              {isActiveDataAuctionCenter?.map((state) => (
                                <option
                                  key={state.auctionCenterName}
                                  value={state.auctionCenterId}
                                >
                                  {state.auctionCenterName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </>
                    ) : selectedValue == 2 ? (
                      <>
                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Buyer Code</label>
                            <label className="errorLabel"> * </label>
                            <select
                              className="form-control select-form"
                              value={
                                editingGraceData?.userId || submitBuyerCode
                              }
                              onChange={(e) => handlesStateNameChange(e)}
                              //setsubmitBuyerCode(e.target.value)
                              disabled={viewMode}
                            >
                              <option value={0}>Select Buyer Code</option>
                              {getUserData?.map((state) => (
                                <option
                                  key={state.auctionCenterId}
                                  value={state.userId}
                                  id={JSON.stringify(state)}
                                >
                                  {state.userCode}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Buyer Name</label>
                            <label className="errorLabel"> * </label>
                            <input
                              type="text"
                              className="form-control"
                              value={buyerName}
                              maxLength="50"
                              disabled={true}
                            />
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Tea Board Registration Number </label>
                            <label className="errorLabel"> * </label>
                            <input
                              type="text"
                              className="form-control"
                              value={teaRegi}
                              maxLength="50"
                              disabled={true}
                            />
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Auction Center</label>
                            <label className="errorLabel"> * </label>
                            <select
                              className="form-control select-form"
                              value={
                                editingGraceData?.auctionCenterId ||
                                submitAuctionCenterName
                              }
                              onChange={(e) => handlecallsellNo(e)}
                              disabled={viewMode}
                            >
                              <option value={0}>Select Auction Center</option>
                              {buyerWiseAuctionCenterData?.map((state) => (
                                <option
                                  key={state.auctionCenterName}
                                  value={state.auctionCenterId}
                                >
                                  {state.auctionCenterName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Remaining Gracing period</label>
                            <input
                              type="text"
                              className="form-control"
                              value="5"
                              disabled
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Sale Number</label>
                        <label className="errorLabel"> * </label>
                        {/* <input
                        type="text"
                        className="form-control"
                        value={editingGraceData?.saleNoId || saleNoId}
                        onChange={(e) =>
                          editingGraceData
                            ? setEditingGraceData({
                                ...editingGraceData,
                                saleNoId: e.target.value,
                              })
                            : setsaleNoId(e.target.value)
                        }
                        disabled={viewMode}
                      /> */}
                        <select
                          className="form-control select-form"
                          value={editingGraceData?.saleNo || saleNoId}
                          onChange={(e) =>
                            editingGraceData
                              ? setEditingGraceData({
                                  ...editingGraceData,
                                  saleNo: e.target.value,
                                })
                              : setsaleNoId(e.target.value)
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Select Sale No</option>
                          {saleNoDataResponse?.map((state) => (
                            <option key={state.saleNo} value={state.saleNo}>
                              {state.saleNo}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Gracing period</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingGraceData?.gracingPeriod || graceperiod}
                          onChange={(e) =>
                            editingGraceData
                              ? setEditingGraceData({
                                  ...editingGraceData,
                                  gracingPeriod: e.target.value,
                                })
                              : setValueWithPatterns(e.target.value)
                          }
                          disabled={viewMode}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Effective from Date</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="datetime-local"
                          name="effectiveFromDate"
                          class="form-control"
                          onChange={(e) => {
                            !viewMode &&
                              (editingGraceData
                                ? formatFromDateTime(
                                    e.target.value,
                                    "effectiveFromDate",
                                    true
                                  )
                                : formatFromDateTime(
                                    e.target.value,
                                    "effectiveFromDate",
                                    false
                                  ));
                          }}
                          value={effectiveFromDate}
                          disabled={viewMode}
                        />

                        {effectiveFromDateError && (
                          <p className="errorLabel">{effectiveFromDateError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Effective End Date</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="datetime-local"
                          name="effectiveEndDate"
                          class="form-control"
                          onChange={(e) => {
                            !viewMode &&
                              (editingGraceData
                                ? formatFromDateTime(
                                    e.target.value,
                                    "effectiveEndDate",
                                    true
                                  )
                                : formatFromDateTime(
                                    e.target.value,
                                    "effectiveEndDate",
                                    false
                                  ));
                          }}
                          value={effectiveEndDate}
                          disabled={viewMode}
                        />

                        {effectiveEndDateError && (
                          <p className="errorLabel">{effectiveEndDateError}</p>
                        )}
                      </div>
                    </div>

                    {!viewMode ? (
                      <>
                        <div className="col-md-12">
                          <UploadMultipleDocuments
                            onFileSelect={handleFileUpload}
                            uploadedFiles={uploadedFiles}
                            setUploadedFiles={setUploadedFiles}
                            inputId="taoUser"
                          />
                        </div>

                        <div className="col-md-12 mt-2">
                          <textarea
                            className="form-control"
                            placeholder="Enter Remarks"
                            value={
                              editingGraceData?.uploadDocumentRemarks ||
                              uploadDocumentRemarks
                            }
                            onChange={(e) =>
                              !viewMode &&
                              (editingGraceData
                                ? setEditingGraceData({
                                    ...editingGraceData,
                                    uploadDocumentRemarks: e.target.value,
                                  })
                                : setuploadDocumentRemarks(e.target.value))
                            }
                            disabled={viewMode}
                          ></textarea>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <div className="col-md-12">
                      <div className="BtnGroup">
                        <button
                          className="SubmitBtn"
                          onClick={handleSubmit}
                          disabled={viewMode}
                        >
                          Submit
                        </button>
                        <button
                          className="Clear"
                          onClick={resetForm}
                          disabled={viewMode}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Edit */}
      {editModal ? (
        <Modals
          title={"Edit Grace"}
          show={editModal}
          handleClose={handleCloseEditModal}
          size="xl"
          centered
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="row align-items-center">
                <div className="col-md-4 d-flex CheckboxGroup mb-3">
                  {radioButtonData &&
                    radioButtonData.map((data, index) => (
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name={data.value}
                          id={data.key}
                          value={data.value}
                          checked={selectedValue == data.value ? true : false}
                          onChange={(event) => handleRadioChange(event)}
                          disabled={viewMode}
                        />
                        <label class="form-check-label" for={data.key}>
                          {data.key}
                        </label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </div>
                    ))}
                </div>
                {selectedValue == 1 ? (
                  <>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingGraceData?.auctionCenterId ||
                            submitAuctionCenterName
                          }
                          onChange={
                            (e) => handlecallsellNo(e)
                            //   editingGraceData
                            // ? setEditingGraceData({
                            //     ...editingGraceData,
                            //     auctionCenterId: e.target.value,
                            //   })
                            // : setsubmitAuctionCenterName(e.target.value)
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Select Auction Center</option>
                          {isActiveDataAuctionCenter?.map((state) => (
                            <option
                              key={state.auctionCenterName}
                              value={state.auctionCenterId}
                            >
                              {state.auctionCenterName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : selectedValue == 2 ? (
                  <>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Code</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingGraceData?.userId || submitBuyerCode}
                          onChange={(e) => handlesStateNameChange(e)}
                          //setsubmitBuyerCode(e.target.value)
                          disabled={viewMode}
                        >
                          <option value={0}>Select Buyer Code</option>
                          {getUserData?.map((state) => (
                            <option
                              key={state.auctionCenterId}
                              value={state.userId}
                              id={JSON.stringify(state)}
                            >
                              {state.userCode}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={buyerName}
                          maxLength="50"
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea Board Registration Number </label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={teaRegi}
                          maxLength="50"
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingGraceData?.auctionCenterId ||
                            submitAuctionCenterName
                          }
                          onChange={(e) => handlecallsellNo(e)}
                          disabled={viewMode}
                        >
                          <option value={0}>Select Auction Center</option>
                          {buyerWiseAuctionCenterData?.map((state) => (
                            <option
                              key={state.auctionCenterName}
                              value={state.auctionCenterId}
                            >
                              {state.auctionCenterName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Remaining Gracing period</label>
                        <input
                          type="text"
                          className="form-control"
                          value="5"
                          disabled
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Sale Number</label>
                    <label className="errorLabel"> * </label>
                    {/* <input
                        type="text"
                        className="form-control"
                        value={editingGraceData?.saleNoId || saleNoId}
                        onChange={(e) =>
                          editingGraceData
                            ? setEditingGraceData({
                                ...editingGraceData,
                                saleNoId: e.target.value,
                              })
                            : setsaleNoId(e.target.value)
                        }
                        disabled={viewMode}
                      /> */}
                    <select
                      className="form-control select-form"
                      value={editingGraceData?.saleNo || saleNoId}
                      onChange={(e) =>
                        editingGraceData
                          ? setEditingGraceData({
                              ...editingGraceData,
                              saleNo: e.target.value,
                            })
                          : setsaleNoId(e.target.value)
                      }
                      disabled={viewMode}
                    >
                      <option value={0}>Select Sale No</option>
                      {saleNoDataResponse?.map((state) => (
                        <option key={state.saleNo} value={state.saleNo}>
                          {state.saleNo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Gracing period</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingGraceData?.gracingPeriod || graceperiod}
                      onChange={(e) =>
                        editingGraceData
                          ? setEditingGraceData({
                              ...editingGraceData,
                              gracingPeriod: e.target.value,
                            })
                          : setValueWithPatterns(e.target.value)
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Effective from Date</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="datetime-local"
                      name="effectiveFromDate"
                      class="form-control"
                      onChange={(e) => {
                        !viewMode &&
                          (editingGraceData
                            ? formatFromDateTime(
                                e.target.value,
                                "effectiveFromDate",
                                true
                              )
                            : formatFromDateTime(
                                e.target.value,
                                "effectiveFromDate",
                                false
                              ));
                      }}
                      value={effectiveFromDate}
                      disabled={viewMode}
                    />

                    {effectiveFromDateError && (
                      <p className="errorLabel">{effectiveFromDateError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Effective End Date</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="datetime-local"
                      name="effectiveEndDate"
                      class="form-control"
                      onChange={(e) => {
                        !viewMode &&
                          (editingGraceData
                            ? formatFromDateTime(
                                e.target.value,
                                "effectiveEndDate",
                                true
                              )
                            : formatFromDateTime(
                                e.target.value,
                                "effectiveEndDate",
                                false
                              ));
                      }}
                      value={effectiveEndDate}
                      disabled={viewMode}
                    />

                    {effectiveEndDateError && (
                      <p className="errorLabel">{effectiveEndDateError}</p>
                    )}
                  </div>
                </div>

                {!viewMode ? (
                  <>
                    <div className="col-md-12">
                      <UploadMultipleDocuments
                        onFileSelect={handleFileUpload}
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
                        inputId="taoUser"
                      />
                    </div>

                    <div className="col-md-12 mt-2">
                      <textarea
                        className="form-control"
                        placeholder="Enter Remarks"
                        value={
                          editingGraceData?.uploadDocumentRemarks ||
                          uploadDocumentRemarks
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingGraceData
                            ? setEditingGraceData({
                                ...editingGraceData,
                                uploadDocumentRemarks: e.target.value,
                              })
                            : setuploadDocumentRemarks(e.target.value))
                        }
                        disabled={viewMode}
                      ></textarea>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div className="col-md-12">
                  <div className="BtnGroup">
                    <button
                      className="SubmitBtn"
                      onClick={handleSubmit}
                      disabled={viewMode}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modals>
      ) : (
        ""
      )}

      {/* View */}
      {viewModal ? (
        <Modals
          title={"View"}
          show={viewModal}
          handleClose={handleCloseViewModal}
          size="xl"
          centered
        >
          {" "}
          <div className="row">
            <div className="col-lg-12">
              <div className="row align-items-center">
                <div className="col-md-4 d-flex CheckboxGroup mb-3">
                  {radioButtonData &&
                    radioButtonData.map((data, index) => (
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name={data.value}
                          id={data.key}
                          value={data.value}
                          checked={selectedValue == data.value ? true : false}
                          disabled={viewMode}
                        />
                        <label class="form-check-label" for={data.key}>
                          {data.key}
                        </label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </div>
                    ))}
                </div>
                {selectedValue == 1 ? (
                  <>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingGraceData?.auctionCenterId ||
                            submitAuctionCenterName
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Select Auction Center</option>
                          {isActiveDataAuctionCenter?.map((state) => (
                            <option
                              key={state.auctionCenterName}
                              value={state.auctionCenterId}
                            >
                              {state.auctionCenterName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : selectedValue == 2 ? (
                  <>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Code</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingGraceData?.userId || submitBuyerCode}
                          //setsubmitBuyerCode(e.target.value)
                          disabled={viewMode}
                        >
                          <option value={0}>Select Buyer Code</option>
                          {getUserData?.map((state) => (
                            <option
                              key={state.auctionCenterId}
                              value={state.userId}
                              id={JSON.stringify(state)}
                            >
                              {state.userCode}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={buyerName}
                          maxLength="50"
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea Board Registration Number </label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={teaRegi}
                          maxLength="50"
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingGraceData?.auctionCenterId ||
                            submitAuctionCenterName
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Select Auction Center</option>
                          {buyerWiseAuctionCenterData?.map((state) => (
                            <option
                              key={state.auctionCenterName}
                              value={state.auctionCenterId}
                            >
                              {state.auctionCenterName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Sale Number</label>
                    <label className="errorLabel"> * </label>

                    <select
                      className="form-control select-form"
                      value={editingGraceData?.saleNo || saleNoId}
                      disabled={viewMode}
                    >
                      <option value={0}>Select Sale No</option>
                      {saleNoDataResponse?.map((state) => (
                        <option key={state.saleNo} value={state.saleNo}>
                          {state.saleNo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Gracing period</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingGraceData?.gracingPeriod || graceperiod}
                      disabled={viewMode}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Effective from Date</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="datetime-local"
                      name="effectiveFromDate"
                      class="form-control"
                      value={effectiveFromDate}
                      disabled={viewMode}
                    />

                    {effectiveFromDateError && (
                      <p className="errorLabel">{effectiveFromDateError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Effective End Date</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="datetime-local"
                      name="effectiveEndDate"
                      class="form-control"
                      value={effectiveEndDate}
                      disabled={viewMode}
                    />

                    {effectiveEndDateError && (
                      <p className="errorLabel">{effectiveEndDateError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="BtnGroup">
                    {modalRight?.some((ele) => ele === "11") && (
                      <button
                        class="SubmitBtn"
                        onClick={() => handleViewExport("excel")}
                      >
                        <i class="fa fa-file-excel"></i>
                      </button>
                    )}
                    {modalRight?.some((ele) => ele === "10") && (
                      <button
                        class="SubmitBtn"
                        onClick={() => handleViewExport("pdf")}
                      >
                        <i class="fa fa-file-pdf"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modals>
      ) : (
        ""
      )}

      {/* Manage & Search */}
      {modalRight?.some((ele) => ele === "12") && (
        <Accordion
          expanded={expanded === "panel2"}
          className={`${expanded === "panel2" ? "active" : ""}`}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Manage Grace</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center</label>
                        <select
                          className="form-control select-form"
                          value={searchAuctionCenterName}
                          onChange={(e) =>
                            setSearchAuctionCenterName(e.target.value)
                          }
                        >
                          <option value={0}>Select Auction Center</option>
                          {getAllAuctionCenter?.map((state) => (
                            <option
                              key={state.auctionCenterName}
                              value={state.auctionCenterId}
                            >
                              {state.auctionCenterName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Code</label>
                        <select
                          className="form-control select-form"
                          value={searchBuyerCode}
                          onChange={(e) => setsearchBuyerCode(e.target.value)}
                        >
                          <option value={0}>Select Buyer Code</option>
                          {getUserData?.map((state) => (
                            <option key={state.userCode} value={state.userId}>
                              {state.userCode}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Status</label>
                        <select
                          className="form-control select-form"
                          value={isActive}
                          onChange={(e) => setisActive(e.target.value)}
                        >
                          <option value="">All</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="BtnGroup">
                        <button onClick={handleSearch} className="SubmitBtn">
                          Search
                        </button>
                        <button onClick={handleClearSearch} className="Clear">
                          Clear
                        </button>

                        {modalRight?.some((ele) => ele === "9") && (
                          <button
                            class="SubmitBtn"
                            onClick={() => handleExport("excel")}
                          >
                            <i class="fa fa-file-excel"></i>
                          </button>
                        )}
                        {modalRight?.some((ele) => ele === "8") && (
                          <button
                            class="SubmitBtn"
                            onClick={() => handleExport("pdf")}
                          >
                            <i class="fa fa-file-pdf"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12 mt-4">
                  <div className="TableBox CreateStateMaster">
                    {loader ? (
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
                    ) : rows?.length > 0 ? (
                      <TableComponent
                        columns={columns}
                        rows={rows?.map((row, index) => ({
                          ...row,
                          index: index + 1,
                        }))}
                        sorting={true}
                        dragdrop={false}
                        fixedColumnsOn={false}
                        resizeingCol={false}
                      />
                    ) : (
                      <div className="NoData">No Records Found</div>
                    )}
                  </div>
                  <button
                    class="SubmitBtn"
                    onClick={handleViewMore}
                    disabled={getGraceData && getGraceData.length < 19}
                  >
                    View More
                  </button>
                </div>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Upload Document*/}
      {modalRight?.some((ele) => ele === "6") && (
        <Accordion
          expanded={expanded === "panel3"}
          className={`${expanded === "panel3" ? "active" : ""}`}
          onChange={handleChange("panel3")}
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Uploaded Document</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TableComponent
                columns={[
                  {
                    name: "index",
                    title: "Sr.",
                  },
                  {
                    name: "fieldValue",
                    title: "Auction center Name",
                  },
                  {
                    name: "documentUploadTime",
                    title: "Document Upload Date And Time",
                  },
                  {
                    name: "uploadDocumentRemarks",
                    title: "Document Brief/Remarks",
                  },
                  {
                    name: "action",
                    title: "Action",
                    getCellValue: (rows) => <UploadActionData data={rows} />,
                  },
                ]}
                // columns={columns}
                // setColumns={setColumns}
                rows={
                  getAllUploadedDoc == undefined || getAllUploadedDoc == null
                    ? []
                    : getAllUploadedDoc?.map((row, index) => ({
                        ...row,
                        index: index + 1,
                      }))
                }
                // rows={rows}
                // setRows={setRows}
                sorting={true}
                dragdrop={false}
                fixedColumnsOn={false}
                resizeingCol={false}
              />
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}

      {/* History */}
      {showmodal && (
        <Modal show={showmodal} onHide={handleCloseHistory} size="lg" centered>
          <Modal.Header>
            <Modal.Title>History</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={handleCloseHistory}
            ></i>
          </Modal.Header>
          <Modal.Body>{renderTableContent()}</Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default CreateGrace;
