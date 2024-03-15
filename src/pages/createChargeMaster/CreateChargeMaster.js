import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import React, { useState, useEffect } from "react";

import { Card, Form, Modal } from "react-bootstrap";

import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";

import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import $ from "jquery";

import moment from "moment";

import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import {
  getDocumentByIdActionSuccess,
  createChargeAction,
  getChargeByIdAction,
  updateChargeAction,
  searchChargeAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  uploadAllDocumentsChargeAction,
  getChargeByIdActionSuccess,
  getAllAuctionCenterAction,
  createEditChargeMasterApiStatus,
  getChargeCodeWithoutFilter,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
} from "../../store/actions";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import CustomToast from "../../components/Toast";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

let pageNo = 1;
function CreateChargeMaster({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [chargesName, setChargesName] = useState("");
  const [chargeCode, setChargeCode] = useState("");
  const [chargesValueIn, setChargesValueIn] = useState("");
  const [chargesValue, setChargesValue] = useState("");
  const [effectiveFromDate, setEffectiveFromDate] = useState("");
  const [effectiveEndDate, setEffectiveEndDate] = useState("");
  const [chargeCodeId, setChargeCodeId] = useState("");
  const [chargeType, setChargeType] = useState("");
  const [auctionCenter, setAuctionCenter] = useState("");
  const [auctionCenterId, setAuctionCenterId] = useState("");
  const [stateInitial, setStateInitial] = useState("");
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [editingChargeData, setEditingChargeData] = useState(null);
  const [exportViewType, setexportViewType] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [searchAuctionCenterName, setSearchAuctionCenterName] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [getSearchCharge, setGetSearchCharge] = useState([]);
  const [getAllCharge, setGetAllCharge] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [searchStateInitial, setSearchStateInitial] = useState("");
  const [isActive, setIsActive] = useState("");
  const [searchChargeName, setSearchChargeName] = useState("");
  const [searchChargeCode, setSearchChargeCode] = useState("");
  const [chargesNameError, setChargesNameError] = useState("");
  const [chargeTypeError, setChargeTypeError] = useState("");
  const [chargesValueInError, setChargesValueInError] = useState("");
  const [auctionCenterIdError, setAuctionCenterIdError] = useState("");
  const [chargeCodeError, setChargeCodeError] = useState("");
  const [chargeCodeIdError, setChargeCodeIdError] = useState("");
  const [chargesValueError, setChargesValueError] = useState("");
  const [effectiveFromDateError, setEffectiveFromDateError] = useState("");
  const [effectiveEndDateError, setEffectiveEndDateError] = useState("");
  const [auctionCenterError, setAuctionCenterError] = useState("");
  const [stateInitialError, setStateInitialError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const [roleCode, setRoleCode] = useState("");
  const [roleCodeError, setRoleCodeError] = useState("");
  const [exportType, setexportType] = useState("");
  const [documentMode, setDocumentmode] = useState("");
  //getend
  const [dataById, setDataById] = useState("");
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const [handleSwitchClick, setHandleSwitchClick] = useState(false);
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

  const handleChargeCodeChange = (e) => {
    setChargesName(e.target.options[e.target.selectedIndex].id);
    setChargeCodeId(e.target.value);
  };

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter.getAllAuctionCenter.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  //UploadDocument

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.CreateChargeMaster &&
      state.CreateChargeMaster.uploadedDocuments &&
      state.CreateChargeMaster.uploadedDocuments.responseData
  );
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchChargeAction({
        auctionCenterId: searchAuctionCenterName,
        chargesName: searchChargeName,
        chargeCode: searchChargeCode,
        chargeCodeId: searchChargeCode,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchChargeAction({
        auctionCenterId: searchAuctionCenterName,
        chargesName: searchChargeName,
        chargeCode: searchChargeCode,
        chargeCodeId: searchChargeCode,
        isActive,
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

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    const inputElement = document.getElementById("chargeMasterUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    // removeFile();
    // setUploadedFiles([]);
  };

  const clearSearch = () => {
    setSearchChargeName("");
    setSearchChargeCode("");
    setSearchAuctionCenterName("");
    setIsActive("");
    setRows([]);
    pageNo = 1;
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        searchChargeAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset previous validation errors
    setChargesNameError("");
    setChargeCodeError("");
    setChargesValueInError("");
    setRoleCodeError("");
    setChargeTypeError("");
    setChargesValueError("");
    setChargeCodeIdError("");
    setEffectiveFromDateError("");
    setAuctionCenterIdError("");
    setEffectiveEndDateError("");
    setAuctionCenterError("");
    setStateInitialError("");
    setUploadDocumentError("");
    setRemarksError("");

    // Perform form validation
    let isValid = true;

    if (!chargesName.trim()) {
      CustomToast.error("Please select a charge code from the dropdown menu");
      isValid = false;
      return;
    }

    if (!chargeCodeId) {
      CustomToast.error("Please select the charge code");
      isValid = false;
      return;
    }
    if (!chargesValueIn) {
      CustomToast.error(
        "Please select whether the charges are in percentage or rupees from the dropdown menu"
      );
      isValid = false;
      return;
    }
    if (!effectiveFromDate || "Invalid date" == effectiveFromDate) {
      CustomToast.error("Please enter the effective from date");
      isValid = false;
      return;
    }
    if (!effectiveEndDate || "Invalid date" == effectiveEndDate) {
      CustomToast.error("Please enter the effective end date");
      isValid = false;
      return;
    }
    if (!chargesValue) {
      CustomToast.error("Please enter the charge value");
      isValid = false;
      return;
    }
    if (!auctionCenterId || "0" == auctionCenterId) {
      CustomToast.error(
        "Please select an auction center name from the dropdown menu."
      );
      isValid = false;
      return;
    }

    if (roleCode == "") {
      CustomToast.error("Please select role");
      isValid = false;
      return;
    }
    // if (!stateInitial.trim()) {
    //   setStateInitialError("State Initial is required.");
    //   isValid = false;
    // }

    // if (!editingChargeData) {
    // In create mode, check if the user provided either upload document or remarks
    // if (!uploadedDocuments.length && !uploadDocumentRemarks) {
    //   setUploadDocumentError("");
    //   setRemarksError("");
    // } else if (uploadedDocuments.length === 1 && !uploadDocumentRemarks) {
    //   CustomToast.error("Please enter the remarks");
    //   isValid = false;
    //   return;
    // } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
    //   CustomToast.error("Please upload the document");
    //   isValid = false;
    //   return;
    // }
    // } else {
    //   // In edit mode, reset the errors for upload document and remarks
    //   setUploadDocumentError("");
    //   setRemarksError("");
    // }

    if (!isValid) {
      return;
    }
    const newChargeData = {
      chargesName: chargesName,
      chargeCodeId: parseInt(chargeCodeId),
      chargeType: chargesValueIn,
      // chargeType: chargeType,
      chargesValue: chargesValue,
      effectiveFromDate: effectiveFromDate,
      effectiveEndDate: effectiveEndDate,
      auctionCenterId: auctionCenterId,
      //auctionCenter:auctionCenter,
      stateInitial: stateInitial,
      uploadDocumentRemarks: uploadDocumentRemarks,
      downloadDto: uploadedDocuments,
      isActive: 1,
      roleCode: roleCode,
    };

    try {
      if (editingChargeData) {
        const isFormModified =
          chargesName !== editingChargeData.chargesName ||
          chargeCodeId !== editingChargeData.chargeCodeId ||
          parseInt(searchChargeCode) !==
            parseInt(editingChargeData.chargeCode) ||
          chargeType !== editingChargeData.chargeType ||
          chargesValueIn !== editingChargeData.chargeType ||
          chargesValue !== editingChargeData.chargesValue ||
          effectiveFromDate !== effectiveFromDate ||
          effectiveEndDate !== effectiveEndDate ||
          //auctionCenter !==editingChargeData.auctionCenter ||
          auctionCenterId !== editingChargeData.auctionCenterId ||
          stateInitial !== editingChargeData.stateInitial ||
          uploadDocumentRemarks !== editingChargeData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingChargeData.downloadDto.length ||
          roleCode !== editingChargeData.roleCode;

        if (isFormModified) {
          editingChargeData.searchData = {};
          editingChargeData.chargesValue = parseInt(
            editingChargeData.chargesValue
          );
          editingChargeData.uploadDocumentRemarks = uploadDocumentRemarks;
          editingChargeData.downloadDto = uploadedDocuments;
          editingChargeData.effectiveFromDate = effectiveFromDate;
          editingChargeData.effectiveEndDate = effectiveEndDate;
          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(updateChargeAction(editingChargeData));
          }, 1000);
        } else {
          setExpanded("panel2");
        }
      } else {
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          setRows([]);
          dispatch(createChargeAction(newChargeData));
        }, 1000);
      }
    } catch (error) {
      setSubmitSuccess(false);
    }
  };

  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id =
      editingChargeDataFromState && editingChargeDataFromState.chargeMasterId;
    let searchData = {
      url: `/admin/chargeMaster/get/${id}/${exportType}`,
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
          "ChargeMasterDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "ChargeMasterDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleEditClick = (chargeId) => {
    setViewMode(false);
    dispatch(getChargeByIdAction(chargeId));
    // setExpanded("panel1");
    setEditModal(true);
  };

  const editingChargeDataFromState = useSelector(
    (state) => state.CreateChargeMaster.ChargeData.responseData
  );

  useEffect(() => {
    if (editingChargeDataFromState) {
      setEditingChargeData(editingChargeDataFromState);
      setChargesName(editingChargeDataFromState.chargesName || "");
      setSearchChargeCode(editingChargeDataFromState.chargeCodeId || "");
      setSearchChargeCode(editingChargeDataFromState.searchChargeCode || "");
      setChargesValueIn(editingChargeDataFromState.chargeType || "");
      setChargeCodeId(editingChargeDataFromState.chargeCodeId || "");
      setEffectiveFromDate(editingChargeDataFromState.effectiveFromDate || "");
      setEffectiveEndDate(editingChargeDataFromState.effectiveEndDate || "");
      setChargesValue(editingChargeDataFromState.chargesValue || "");
      setChargeType(editingChargeDataFromState.chargeType || "");
      setAuctionCenter(editingChargeDataFromState.auctionCenter || "");
      setAuctionCenterId(editingChargeDataFromState.auctionCenterId || "");
      setStateInitial(editingChargeDataFromState.stateInitial || "");
      setEffectiveFromDate(
        moment(editingChargeDataFromState.effectiveFromDate).format(
          "YYYY-MM-DDTHH:mm"
        )
      );
      setEffectiveEndDate(
        moment(editingChargeDataFromState.effectiveEndDate).format(
          "YYYY-MM-DDTHH:mm"
        )
      );

      setUploadDocumentRemarks(
        editingChargeDataFromState.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingChargeDataFromState.downloadDto || []);
      setRoleCode(editingChargeDataFromState.roleCode || "");
    } else {
      setEditingChargeData(null);
      dispatch(getChargeCodeWithoutFilter());
      dispatch(getAllAuctionCenterAction());
      resetForm();
    }
  }, [editingChargeDataFromState]);

  const getChargeCodeWithoutFilterResponse = useSelector(
    (state) => state.chargeCode.getChargeCodeWithoutFilter.responseData
  );

  const isActiveGetChargeCodeWithoutFilterData =
    getChargeCodeWithoutFilterResponse &&
    getChargeCodeWithoutFilterResponse?.filter((data) => 1 == data.isActive);

  const handleViewClick = (chargeId) => {
    dispatch(getChargeByIdAction(chargeId));
    setViewMode(true);
    // setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
    setViewModal(true);
  };

  const handleCloseHistory = () => setShowmodal(false);

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      auctionCenterId: searchAuctionCenterName,
      chargeName: searchChargeName,
      chargeCode: searchChargeCode,
      chargeCodeId: searchChargeCode,
      isActive,
      url: "/admin/chargeMaster/search",
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
          "ChargeMasterDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "ChargeMasterDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      pageNo = 1;
      dispatch(
        searchChargeAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
      // clearSearch();
      setViewMode(false);
      dispatch(getChargeByIdActionSuccess([]));
      setEditingChargeData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsChargeAction());
      setViewMode(false);
      dispatch(getChargeByIdActionSuccess([]));
      setEditingChargeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getChargeByIdActionSuccess([]));
      setEditingChargeData(null);
      resetForm();
    }
  };

  function formatFromDateTime(dateTimeString) {
    setEffectiveFromDate(moment(dateTimeString).format("YYYY-MM-DDTHH:mm"));
  }
  function formatEndDateTime(dateTimeString) {
    setEffectiveEndDate(moment(dateTimeString).format("YYYY-MM-DDTHH:mm"));
  }

  const [rows, setRows] = useState([]);

  const searchChargeData = useSelector(
    (state) => state.CreateChargeMaster.searchResults.responseData
  );

  // useEffect(() => {
  //   if (searchChargeData != null && searchChargeData != undefined) {
  //     setGetSearchCharge(searchChargeData);
  //     setRows(searchChargeData);
  //   } else {
  //     setGetSearchCharge(searchChargeData);
  //     setRows(searchChargeData);
  //   }
  // }, [searchChargeData]);
  // useEffect(() => {
  //   const newRows = searchChargeData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [searchChargeData]);
  useEffect(() => {
    const newRows = searchChargeData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.chargeMasterId === newRow.chargeMasterId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [searchChargeData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "chargesName",
      title: "Charges Name",
    },
    {
      name: "chargeCode",
      title: "Charge Code",
    },
    // {
    //   name: "chargeType",
    //   title: "Charges in",
    // },
    // {
    //   name: "chargesValue",
    //   title: "Charges value",
    // },
    // {
    //   name: "effectiveFromDate",
    //   title: "Effective From Date",
    // },
    // {
    //   name: "effectiveEndDate",
    //   title: "Effective To Date",
    // },
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

  const switchChargedata = useSelector(
    (state) => state.CreateChargeMaster.ChargeData.responseData
  );

  useEffect(() => {
    if (switchChargedata && handleSwitchClick) {
      setHandleSwitchClick(false);
      const updatedData = {
        ...switchChargedata,
        isActive: switchChargedata.isActive === 1 ? 0 : 1,
        chargesValue: parseInt(switchChargedata.chargesValue),
        // pageNo: 1,
        // noOfRecords: 20,
      };
      let searchData = {
        auctionCenterId: searchAuctionCenterName,
        chargesName: searchChargeName,
        chargeCode: searchChargeCode,
        chargeCodeId: searchChargeCode,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };

      updatedData.searchData = searchData;
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateChargeAction(updatedData));
      }, 1000);
    }
  }, [switchChargedata, handleSwitchClick]);

  function StatusData(data) {
    const handleSwitchChange = () => {
      setHandleSwitchClick(true);
      dispatch(getChargeByIdAction(data.data.chargeMasterId));
    };

    return (
      <>
        {modalRight?.some((ele) => ele === "5") ? (
          <div class="Switch">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id={`customSwitch${data.data.chargeMasterId}`}
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange}
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.chargeMasterId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.chargeMasterId}`}
          >
            {data.data.isActive === 1 ? "Active" : "Inactive"}
          </label>
        )}
      </>
    );
  }

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_ChargeMaster";
    const moduleName = "ChargeMaster";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

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

  const setValueData = (data, editingChargeData) => {
    setEditingChargeData({
      ...editingChargeData,
      chargeCodeId: data.target.value,
      chargesName: data.target.options[data.target.selectedIndex].id,
    });
  };

  function ActionData(data) {
    return (
      <>
        <div class="Action">
          {modalRight?.some((ele) => ele === "2") && (
            <Tooltip title="Edit" placement="top">
              <i
                className="fa fa-edit"
                onClick={() => handleEditClick(data.data.chargeMasterId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.chargeMasterId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.chargeMasterId);
                }}
              ></i>
            </Tooltip>
          )}
        </div>
      </>
    );
  }

  const handleDownloadClick = (uploadDocumentConfId, type) => {
    setDocumentmode(type);
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };

  const getUploadedIdData = useSelector(
    (state) => state.documentReducer.documentData.responseData
  );
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
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
    if (
      getUploadedIdData &&
      getUploadedIdData.documentContent &&
      "preview" == documentMode
    ) {
      dispatch(getDocumentByIdActionSuccess(""));
      setPreviewModal(true);
      setPreviewDocumentContent(getUploadedIdData.documentContent);
    }
  }, [getUploadedIdData]);

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
        {modalRight?.some((ele) => ele === "10") && (
          <i
          title="Preview"
            class="fa fa-eye"
            onClick={() => {
              handleDownloadClick(data.data.uploadDocumentConfId, "preview");
            }}
          ></i>
        )}
      </div>
    );
  }

  const resetForm = () => {
    setChargesName("");
    setSearchChargeCode("");
    setChargesValue("");
    setChargesValueIn("");
    setChargeType("");
    setEffectiveFromDate("");
    setSearchAuctionCenterName("");
    setEffectiveEndDate("");
    setAuctionCenter("");
    setAuctionCenterId("");
    setChargeCodeId("");
    setChargeCodeIdError("");
    setUploadDocumentRemarks("");
    setEditingChargeData(null);
    setChargesNameError("");
    setChargeCodeError("");
    setChargesValueError("");
    setEffectiveFromDateError("");
    setChargesValueInError("");
    setEffectiveEndDateError("");
    setAuctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setStateInitialError("");
    setEditingChargeData(null);
    setUploadedFiles([]); // Clear uploaded files
    setRoleCode("");
    setRoleCodeError("");
  };

  let createData = useSelector(
    (state) => state.CreateChargeMaster.createEditChargeMasterApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditChargeMasterApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getChargeByIdActionSuccess([]));
      setEditingChargeData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });

  const handleCloseViewModal = () => {
    setViewModal(false);
    pageNo = 1;
    dispatch(
      searchChargeAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getChargeByIdActionSuccess([]));
    setEditingChargeData(null);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    pageNo = 1;
    dispatch(
      searchChargeAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getChargeByIdActionSuccess([]));
    setEditingChargeData(null);
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
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Create Charge Master</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Role</label>
                        <select
                          className="form-control select-form"
                          value={editingChargeData?.roleCode || roleCode}
                          onChange={(e) =>
                            !viewMode &&
                            (editingChargeData
                              ? setEditingChargeData({
                                  ...editingChargeData,
                                  roleCode: e.target.value,
                                })
                              : setRoleCode(e.target.value))
                          }
                          disabled={viewMode}
                        >
                          <option value="">Select Role</option>
                          <option value="TEABOARDUSER">Teaboard</option>
                          <option value="BUYER">Buyer</option>
                          <option value="AUCTIONEER">Auctioneer</option>
                          <option value="SELLER">Seller</option>
                          <option value="WAREHOUSE">Warehouse</option>
                        </select>
                        {roleCodeError && (
                          <p className="errorLabel">{roleCodeError}</p>
                        )}
                      </div>
                    </div>

                    {roleCode && roleCode != "" ? (
                      <>
                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Charge Code</label>
                            <label className="errorLabel"> * </label>
                            <select
                              className="form-control select-form"
                              value={
                                editingChargeData?.chargeCodeId || chargeCodeId
                              }
                              onChange={(e) =>
                                !viewMode &&
                                (editingChargeData
                                  ? setEditingChargeData(e, editingChargeData)
                                  : handleChargeCodeChange(e))
                              }
                              disabled={viewMode}
                            >
                              <option value={0}>Select Charge Code</option>
                              {isActiveGetChargeCodeWithoutFilterData?.map(
                                (state) => (
                                  <option
                                    key={state.chargeCodeId}
                                    value={state.chargeCodeId}
                                    id={state.chargeCodeName}
                                  >
                                    {state.chargeCode}
                                  </option>
                                )
                              )}
                              disabled={viewMode}
                            </select>
                            {chargeCodeIdError && (
                              <p className="errorLabel">{chargeCodeIdError}</p>
                            )}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Charge Name</label>

                            <input
                              type="text"
                              className="form-control"
                              value={
                                editingChargeData?.chargesName || chargesName
                              }
                              // onChange={(e) =>
                              //   !viewMode &&
                              //   (editingTaxData
                              //     ? setEditingTaxData({
                              //         ...editingTaxData,
                              //         chargeName: e.target.value,
                              //       })
                              //     : setchargeName(e.target.value))
                              // }
                              disabled={true}
                            />
                            {chargesNameError && (
                              <p className="errorLabel">{chargesNameError}</p>
                            )}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Charges Value In</label>
                            <label className="errorLabel"> * </label>
                            <select
                              className="form-control select-form"
                              value={
                                editingChargeData?.chargesValueIn ||
                                chargesValueIn
                              }
                              onChange={(e) =>
                                setChargesValueIn(e.target.value)
                              }
                              disabled={viewMode}
                            >
                              <option value="">Select Charges Value In</option>
                              <option value="%">%</option>
                              <option value="Rs.">Rs.</option>
                            </select>
                            {chargesValueInError && (
                              <p className="errorLabel">
                                {chargesValueInError}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Charges Value</label>
                            <label className="errorLabel"> * </label>
                            <input
                              type="number"
                              className="form-control"
                              required
                              value={
                                editingChargeData?.chargesValue || chargesValue
                              }
                              onChange={(e) =>
                                !viewMode &&
                                (editingChargeData
                                  ? setEditingChargeData({
                                      ...editingChargeData,
                                      chargesValue: e.target.value,
                                    })
                                  : setChargesValue(e.target.value))
                              }
                              disabled={viewMode} // Disable the field in view mode
                            />
                            {chargesValueError && (
                              <p className="errorLabel">{chargesValueError}</p>
                            )}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Effective From Date</label>
                            <label className="errorLabel"> * </label>
                            <input
                              type="datetime-local"
                              name="effectiveFromDate"
                              class="form-control"
                              onChange={(e) =>
                                formatFromDateTime(e.target.value)
                              }
                              value={effectiveFromDate}
                              disabled={viewMode}
                            />

                            {effectiveFromDateError && (
                              <p className="errorLabel">
                                {effectiveFromDateError}
                              </p>
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
                              onChange={(e) =>
                                formatEndDateTime(e.target.value)
                              }
                              value={effectiveEndDate}
                              disabled={viewMode}
                            />
                            {effectiveEndDateError && (
                              <p className="errorLabel">
                                {effectiveEndDateError}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Auction Center</label>
                            <label className="errorLabel"> * </label>
                            <select
                              className="form-control select-form"
                              value={auctionCenterId}
                              onChange={(e) =>
                                setAuctionCenterId(e.target.value)
                              }
                              disabled={viewMode}
                            >
                              <option value={0}>Select Auction Center</option>
                              {getAllAuctionCenter?.map((state) => (
                                <option
                                  key={state.auctionCenter}
                                  value={state.auctionCenterId}
                                >
                                  {state.auctionCenterName}
                                </option>
                              ))}
                            </select>
                            {auctionCenterIdError && (
                              <p className="errorLabel">
                                {auctionCenterIdError}
                              </p>
                            )}
                          </div>
                        </div>

                        {!viewMode ? (
                          <>
                            <div className="col-md-12">
                              <UploadMultipleDocuments
                                onFileSelect={handleFileUpload}
                                uploadedFiles={uploadedDocuments}
                                setUploadedFiles={setUploadedDocuments}
                                uploadDocumentError={uploadDocumentError}
                                inputId="chargeMasterUpload"
                                // ref="#chargeMasterUpload"
                              />
                            </div>
                            <div className="col-md-12 mt-2">
                              <textarea
                                className="form-control"
                                placeholder="Enter Remarks"
                                value={uploadDocumentRemarks}
                                onChange={(e) =>
                                  setUploadDocumentRemarks(e.target.value)
                                }
                              ></textarea>
                              {remarksError && (
                                <p className="errorLabel">{remarksError}</p>
                              )}
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
                            >
                              Submit
                            </button>
                            <button
                              className="Clear"
                              onClick={handleClear}
                              disabled={viewMode}
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
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
          title={"Edit Charge Master"}
          show={editModal}
          handleClose={handleCloseEditModal}
          size="xl"
          centered
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="row align-items-end">
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Role</label>
                    <select
                      className="form-control select-form"
                      value={editingChargeData?.roleCode || roleCode}
                      onChange={(e) =>
                        !viewMode &&
                        (editingChargeData
                          ? setEditingChargeData({
                              ...editingChargeData,
                              roleCode: e.target.value,
                            })
                          : setRoleCode(e.target.value))
                      }
                      disabled={viewMode}
                    >
                      <option value="">Select Role</option>
                      <option value="TEABOARDUSER">Teaboard</option>
                      <option value="BUYER">Buyer</option>
                      <option value="AUCTIONEER">Auctioneer</option>
                      <option value="SELLER">Seller</option>
                      <option value="WAREHOUSE">Warehouse</option>
                    </select>
                    {roleCodeError && (
                      <p className="errorLabel">{roleCodeError}</p>
                    )}
                  </div>
                </div>

                {roleCode && roleCode != "" ? (
                  <>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charge Code</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingChargeData?.chargeCodeId || chargeCodeId
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingChargeData
                              ? setEditingChargeData(e, editingChargeData)
                              : handleChargeCodeChange(e))
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Select Charge Code</option>
                          {isActiveGetChargeCodeWithoutFilterData?.map(
                            (state) => (
                              <option
                                key={state.chargeCodeId}
                                value={state.chargeCodeId}
                                id={state.chargeCodeName}
                              >
                                {state.chargeCode}
                              </option>
                            )
                          )}
                          disabled={viewMode}
                        </select>
                        {chargeCodeIdError && (
                          <p className="errorLabel">{chargeCodeIdError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charge Name</label>

                        <input
                          type="text"
                          className="form-control"
                          value={editingChargeData?.chargesName || chargesName}
                          // onChange={(e) =>
                          //   !viewMode &&
                          //   (editingTaxData
                          //     ? setEditingTaxData({
                          //         ...editingTaxData,
                          //         chargeName: e.target.value,
                          //       })
                          //     : setchargeName(e.target.value))
                          // }
                          disabled={true}
                        />
                        {chargesNameError && (
                          <p className="errorLabel">{chargesNameError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charges Value In</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingChargeData?.chargesValueIn || chargesValueIn
                          }
                          onChange={(e) => setChargesValueIn(e.target.value)}
                          disabled={viewMode}
                        >
                          <option value="">Select Charges Value In</option>
                          <option value="%">%</option>
                          <option value="Rs.">Rs.</option>
                        </select>
                        {chargesValueInError && (
                          <p className="errorLabel">{chargesValueInError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charges Value</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          className="form-control"
                          required
                          value={
                            editingChargeData?.chargesValue || chargesValue
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingChargeData
                              ? setEditingChargeData({
                                  ...editingChargeData,
                                  chargesValue: e.target.value,
                                })
                              : setChargesValue(e.target.value))
                          }
                          disabled={viewMode} // Disable the field in view mode
                        />
                        {chargesValueError && (
                          <p className="errorLabel">{chargesValueError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Effective From Date</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="datetime-local"
                          name="effectiveFromDate"
                          class="form-control"
                          onChange={(e) => formatFromDateTime(e.target.value)}
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
                          onChange={(e) => formatEndDateTime(e.target.value)}
                          value={effectiveEndDate}
                          disabled={viewMode}
                        />
                        {effectiveEndDateError && (
                          <p className="errorLabel">{effectiveEndDateError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={auctionCenterId}
                          onChange={(e) => setAuctionCenterId(e.target.value)}
                          disabled={viewMode}
                        >
                          <option value={0}>Select Auction Center</option>
                          {getAllAuctionCenter?.map((state) => (
                            <option
                              key={state.auctionCenter}
                              value={state.auctionCenterId}
                            >
                              {state.auctionCenterName}
                            </option>
                          ))}
                        </select>
                        {auctionCenterIdError && (
                          <p className="errorLabel">{auctionCenterIdError}</p>
                        )}
                      </div>
                    </div>

                    {!viewMode ? (
                      <>
                        <div className="col-md-12">
                          <UploadMultipleDocuments
                            onFileSelect={handleFileUpload}
                            uploadedFiles={uploadedDocuments}
                            setUploadedFiles={setUploadedDocuments}
                            uploadDocumentError={uploadDocumentError}
                            inputId="chargeMasterUpload"
                            // ref="#chargeMasterUpload"
                          />
                        </div>
                        <div className="col-md-12 mt-2">
                          <textarea
                            className="form-control"
                            placeholder="Enter Remarks"
                            value={uploadDocumentRemarks}
                            onChange={(e) =>
                              setUploadDocumentRemarks(e.target.value)
                            }
                          ></textarea>
                          {remarksError && (
                            <p className="errorLabel">{remarksError}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <div className="col-md-12">
                      <div className="BtnGroup">
                        <button className="SubmitBtn" onClick={handleSubmit}>
                          Update
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
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
          title={"View Charge Master"}
          show={viewModal}
          handleClose={handleCloseViewModal}
          size="xl"
          centered
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="row align-items-end">
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Role</label>
                    <select
                      className="form-control select-form"
                      value={editingChargeData?.roleCode || roleCode}
                      disabled={viewMode}
                    >
                      <option value="">Select Role</option>
                      <option value="TEABOARDUSER">Teaboard</option>
                      <option value="BUYER">Buyer</option>
                      <option value="AUCTIONEER">Auctioneer</option>
                      <option value="SELLER">Seller</option>
                      <option value="WAREHOUSE">Warehouse</option>
                    </select>
                    {roleCodeError && (
                      <p className="errorLabel">{roleCodeError}</p>
                    )}
                  </div>
                </div>

                {roleCode && roleCode != "" ? (
                  <>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charge Code</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingChargeData?.chargeCodeId || chargeCodeId
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Select Charge Code</option>
                          {isActiveGetChargeCodeWithoutFilterData?.map(
                            (state) => (
                              <option
                                key={state.chargeCodeId}
                                value={state.chargeCodeId}
                                id={state.chargeCodeName}
                              >
                                {state.chargeCode}
                              </option>
                            )
                          )}
                          disabled={viewMode}
                        </select>
                        {chargeCodeIdError && (
                          <p className="errorLabel">{chargeCodeIdError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charge Name</label>

                        <input
                          type="text"
                          className="form-control"
                          value={editingChargeData?.chargesName || chargesName}
                          disabled={true}
                        />
                        {chargesNameError && (
                          <p className="errorLabel">{chargesNameError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charges Value In</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingChargeData?.chargesValueIn || chargesValueIn
                          }
                          disabled={viewMode}
                        >
                          <option value="">Select Charges Value In</option>
                          <option value="%">%</option>
                          <option value="Rs.">Rs.</option>
                        </select>
                        {chargesValueInError && (
                          <p className="errorLabel">{chargesValueInError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charges Value</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          className="form-control"
                          required
                          value={
                            editingChargeData?.chargesValue || chargesValue
                          }
                          disabled={viewMode} // Disable the field in view mode
                        />
                        {chargesValueError && (
                          <p className="errorLabel">{chargesValueError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Effective From Date</label>
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

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={auctionCenterId}
                          disabled={viewMode}
                        >
                          <option value={0}>Select Auction Center</option>
                          {getAllAuctionCenter?.map((state) => (
                            <option
                              key={state.auctionCenter}
                              value={state.auctionCenterId}
                            >
                              {state.auctionCenterName}
                            </option>
                          ))}
                        </select>
                        {auctionCenterIdError && (
                          <p className="errorLabel">{auctionCenterIdError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="BtnGroup">
                        <button
                          class="SubmitBtn"
                          onClick={() => handleViewExport("excel")}
                        >
                          <i class="fa fa-file-excel"></i>
                        </button>
                        <button
                          class="SubmitBtn"
                          onClick={() => handleViewExport("pdf")}
                        >
                          <i class="fa fa-file-pdf"></i>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
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
            <Typography>Manage Charge Master</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charge Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchChargeName}
                          onChange={(e) => setSearchChargeName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charge Code</label>
                        <select
                          className="form-control select-form"
                          value={searchChargeCode}
                          onChange={(e) => setSearchChargeCode(e.target.value)}
                        >
                          <option value={0}>Select Charge Code</option>
                          {getChargeCodeWithoutFilterResponse?.map((state) => (
                            <option
                              key={state.chargeCodeId}
                              value={state.chargeCodeId}
                            >
                              {state.chargeCode}
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
                          onChange={(e) => setIsActive(e.target.value)}
                        >
                          <option value="">All</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="BtnGroup">
                        <button className="SubmitBtn" onClick={handleSearch}>
                          Search
                        </button>
                        <button className="Clear" onClick={clearSearch}>
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
                  <div className="TableBox CreateChargeMaster">
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
                    disabled={searchChargeData && searchChargeData.length < 19}
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
                //columns={columns}
                columns={[
                  {
                    name: "index",
                    title: "Sr.",
                  },
                  {
                    name: "fieldValue",
                    title: "Charge Name",
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
                // setColumns={setColumns}
                //rows={rows}
                rows={
                  getAllUploadedDoc == undefined || getAllUploadedDoc == null
                    ? []
                    : getAllUploadedDoc?.map((row, index) => ({
                        ...row,
                        index: index + 1,
                      }))
                }
                setRows={setRows}
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

      {/* Preview */}
      {previewDocumentContent != "" && "preview" == documentMode ? (
        <Modal
          show={previewModal}
          onHide={handleClosePreviewModal}
          size="lg"
          centered
        >
          <Modal.Header>
            <Modal.Title>Preview</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={handleClosePreviewModal}
            ></i>
          </Modal.Header>

          <Modal.Body>
            <Base64ToPDFPreview base64String={previewDocumentContent} />
          </Modal.Body>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
}
export default CreateChargeMaster;
