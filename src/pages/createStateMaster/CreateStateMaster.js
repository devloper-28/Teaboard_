import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
import Modals from "../../components/common/Modal";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, Modal } from "react-bootstrap";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  createStateAction,
  getStateByIdAction,
  getAllStateAction,
  getAllStateAscAction,
  updateStateAction,
  searchStateAction,
  uploadAllDocumentsStateAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditApiStatus,
  getStateByIdActionSuccess,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  getDocumentByIdActionSuccess,
} from "../../store/actions";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import CustomToast from "../../components/Toast";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

let pageNo = 1;
function CreateStateMaster({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stateName, setStateName] = useState("");
  const [loader, setLoader] = useState(false);
  const [stateCode, setStateCode] = useState();
  const [stateInitial, setStateInitial] = useState("");
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [editingStateData, setEditingStateData] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [getSearchState, setGetSearchState] = useState([]);
  const [getAllState, setGetAllState] = useState([]);
  const [exportViewType, setexportViewType] = useState("");
  const [searchStateName, setSearchStateName] = useState("");
  const [searchStateCode, setSearchStateCode] = useState(0);
  const [searchStateInitial, setSearchStateInitial] = useState("");
  const [isActive, setIsActive] = useState("");

  const [stateNameError, setStateNameError] = useState("");
  const [stateCodeError, setStateCodeError] = useState("");
  const [stateInitialError, setStateInitialError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [expanded, setExpanded] = useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [exportType, setexportType] = useState("");
  const [documentMode, setDocumentmode] = useState("");
  const [previewModal, setPreviewModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");

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

  const getAllStateData = useSelector(
    (state) => state.state.getAllStateAsc.responseData
  );

  const isActiveData =
    getAllStateData && getAllStateData.filter((data) => 1 == data.isActive);

  const editingStateDataFromState = useSelector(
    (state) => state.state.stateData.responseData
  );
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchStateAction({
        stateName: searchStateName,
        stateId: searchStateCode > 0 ? parseInt(searchStateCode) : "",
        stateInitial: searchStateInitial,
        isActive: isActive != "" ? parseInt(isActive) : isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchStateAction({
        stateName: searchStateName,
        stateId: searchStateCode > 0 ? parseInt(searchStateCode) : "",
        stateInitial: searchStateInitial,
        isActive: isActive != "" ? parseInt(isActive) : isActive,
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

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      stateName: searchStateName,
      stateId: searchStateCode > 0 ? parseInt(searchStateCode) : "",
      stateInitial: searchStateInitial,
      isActive: isActive != "" ? parseInt(isActive) : isActive,
      url: "/admin/state/search",
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
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingStateDataFromState && editingStateDataFromState.stateId;
    let searchData = {
      url: `/admin/state/get/${id}/${exportType}`,
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
          "StateMasterDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "StateMasterDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

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
        Base64ToExcelDownload(getExportDataResponse, "StateMasterDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "StateMasterDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const resetForm = () => {
    setStateName("");
    setStateCode("");
    setStateInitial("");
    setUploadDocumentRemarks("");
    setEditingStateData(null);
    setStateNameError("");
    setStateCodeError("");
    setUploadDocumentError("");
    setRemarksError("");
    setStateInitialError("");
    setUploadedDocuments([]);
    const inputElement = document.getElementById("stateUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    setUploadedFiles([]); // Clear uploaded files
  };

  const handleClear = () => {
    resetForm();
    removeFile();
  };

  const clearSearch = () => {
    setSearchStateName("");
    setSearchStateCode("");
    setSearchStateInitial("");
    setIsActive("");
    setRows([]);
    pageNo = 1;
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        searchStateAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
    }, 1000);
    dispatch(getAllStateAscAction({ sortBy: "asc", sortColumn: "stateCode" }));
  };

  const searchStateData = useSelector(
    (state) => state.state.searchResults.responseData
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset previous validation errors
    setStateNameError("");
    setStateCodeError("");
    setStateInitialError("");
    setUploadDocumentError("");
    setRemarksError("");

    // Perform form validation
    let isValid = true;

    if (!stateName.trim()) {
      // setStateNameError("State Name is required.");
      isValid = false;
      CustomToast.error("Please enter the state name");
      return;
    }

    if (!stateCode) {
      // setStateCodeError("State Code is required.");
      CustomToast.error("Please enter the GST state code");
      isValid = false;
      return;
    }

    if (!stateInitial.trim()) {
      // setStateInitialError("State Initial is required.");
      CustomToast.error("Please enter the state initials");
      isValid = false;
      return;
    }

    // if (!editingStateData) {
    // In create mode, check if the user provided either upload document or remarks
    // if (!uploadedDocuments.length && !uploadDocumentRemarks) {
    //   setUploadDocumentError("");
    //   setRemarksError("");
    // } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
    //   // setRemarksError("Remarks is required.");
    //   isValid = false;
    //   CustomToast.error("Please enter the remarks");
    //   return;
    // } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
    //   // setUploadDocumentError("Upload Document is required.");
    //   CustomToast.error("Please upload the document");
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

    const newStateData = {
      stateName: stateName,
      stateCode: stateCode,
      stateInitial: stateInitial,
      uploadDocumentRemarks: uploadDocumentRemarks,
      downloadDto: uploadedDocuments,
      isActive: 1,
      searchData: {
        pageNo: 1,
        noOfRecords: NO_OF_RECORDS,
      },
    };

    try {
      if (editingStateData) {
        const isFormModified =
          stateName !== editingStateData.stateName ||
          stateCode !== editingStateData.stateCode ||
          stateInitial !== editingStateData.stateInitial ||
          uploadDocumentRemarks !== editingStateData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingStateData.downloadDto.length;

        if (isFormModified) {
          editingStateData.searchData = {
            stateName: searchStateName,
            stateId: searchStateCode > 0 ? parseInt(searchStateCode) : "",
            stateInitial: searchStateInitial,
            isActive: isActive != "" ? parseInt(isActive) : isActive,
            pageNo: pageNo,
            noOfRecords: NO_OF_RECORDS,
          };
          editingStateData.uploadDocumentRemarks = uploadDocumentRemarks;
          editingStateData.downloadDto = uploadedDocuments;

          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(updateStateAction(editingStateData));
          }, 1000);
        } else {
          setExpanded("panel2");
        }
      } else {
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          setRows([]);
          dispatch(createStateAction(newStateData));
        }, 1000);
      }
    } catch (error) {}
  };

  let createData = useSelector((state) => state.state.createEditApiStatus);

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiStatus(false));
      setExpanded("panel2");
      handleClear();
      dispatch(getStateByIdActionSuccess([]));
      setEditingStateData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });

  const handleEditClick = (stateId) => {
    dispatch(getStateByIdAction(stateId));
    setViewMode(false);
    // setExpanded("panel1");
    setEditModal(true);
  };

  useEffect(() => {
    if (editingStateDataFromState) {
      setEditingStateData(editingStateDataFromState);
      setStateName(editingStateDataFromState.stateName || "");
      setStateCode(editingStateDataFromState.stateCode || "");
      setStateInitial(editingStateDataFromState.stateInitial || "");
      setUploadDocumentRemarks(
        editingStateDataFromState.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingStateDataFromState.downloadDto || []);
    } else {
      // resetForm();
    }
  }, [editingStateDataFromState]);

  const handleViewClick = (stateId) => {
    dispatch(getStateByIdAction(stateId));
    setViewMode(true);
    // setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
    setViewModal(true);
  };

  const handleCloseHistory = () => setShowmodal(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchStateAction({}));
      //Get All State
      dispatch(
        getAllStateAscAction({ sortBy: "asc", sortColumn: "stateCode" })
      );
      clearSearch();
      setViewMode(false);
      dispatch(getStateByIdActionSuccess([]));
      setEditingStateData(null);
      handleClear();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsStateAction());
      setViewMode(false);
      dispatch(getStateByIdActionSuccess([]));
      setEditingStateData(null);
      handleClear();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getStateByIdActionSuccess([]));
      setEditingStateData(null);
      handleClear();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.state.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(getAllState || getSearchState);

  // useEffect(() => {
  //   if (searchStateData != null) {
  //     setGetSearchState(searchStateData);
  //     setRows(searchStateData);
  //   } else {
  //     setGetSearchState([]);
  //     setRows([]);
  //   }
  // }, [searchStateData]);
  // useEffect(() => {
  //   const newRows = searchStateData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [searchStateData]);

  useEffect(() => {
    const newRows = searchStateData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.stateId === newRow.stateId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [searchStateData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "stateName",
      title: "State Name",
    },
    {
      name: "stateCode",
      title: "State Code",
    },
    {
      name: "stateInitial",
      title: "State Initial",
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

  function StatusData(data) {
    const handleSwitchChange = () => {
      // const { stateId, isActive } = data.data;
      let searchData = {
        stateName: searchStateName,
        stateId: searchStateCode > 0 ? parseInt(searchStateCode) : "",
        stateInitial: searchStateInitial,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };

      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };
      updatedData.searchData = searchData;

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateStateAction(updatedData));
      }, 1000);
      pageNo = 1;
      setRows([]);
      fetchData();
    };

    return (
      <>
        {modalRight?.some((ele) => ele === "5") ? (
          <div class="Switch">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id={`customSwitch${data.data.stateId}`}
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange}
              />
              <label
                class="custom-control-label"
                for={`customSwitch${data.data.stateId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.stateId}`}
          >
            {data.data.isActive === 1 ? "Active" : "Inactive"}
          </label>
        )}
      </>
    );
  }

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

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_state";
    const moduleName = "State";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

  function ActionData(data) {
    return (
      <div class="Action">
        {modalRight?.some((ele) => ele === "2") && (
          <Tooltip title="Edit" placement="top">
            <i
              className="fa fa-edit"
              onClick={() => handleEditClick(data.data.stateId)}
            ></i>
          </Tooltip>
        )}
        {modalRight?.some((ele) => ele === "3") && (
          <Tooltip title="View" placement="top">
            <i
              className="fa fa-eye"
              onClick={() => handleViewClick(data.data.stateId)}
            ></i>
          </Tooltip>
        )}
        {modalRight?.some((ele) => ele === "4") && (
          <Tooltip title="History" placement="top">
            <i
              className="fa fa-history"
              onClick={() => handleHistoryViewClick(data.data.stateId)}
            ></i>
          </Tooltip>
        )}
      </div>
    );
  }

  const handleDownloadClick = (uploadDocumentConfId, type) => {
    setDocumentmode(type);
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };

  const getUploadedIdData = useSelector(
    (state) => state.documentReducer.documentData.responseData
  );

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
      <>
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
      </>
    );
  }

  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };

  const handleCloseViewModal = () => {
    setViewModal(false);
    setViewMode(false);
    dispatch(getStateByIdActionSuccess([]));
    setEditingStateData(null);
    // handleClear();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    setViewMode(false);
    dispatch(getStateByIdActionSuccess([]));
    setEditingStateData(null);
    handleClear();
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
            <Typography>Create State</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row align-items-end">
                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>State Name</label>
                            <label className="errorLabel"> * </label>
                            <input
                              type="text"
                              className="form-control"
                              maxLength="50"
                              required
                              value={editingStateData?.stateName || stateName}
                              onChange={(e) =>
                                !viewMode &&
                                (editingStateData
                                  ? setEditingStateData({
                                      ...editingStateData,
                                      stateName: e.target.value,
                                    })
                                  : setStateName(e.target.value))
                              }
                              disabled={viewMode} // Disable the field in view mode
                            />
                            {stateNameError && (
                              <p className="errorLabel">{stateNameError}</p>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>State Code</label>
                            <label className="errorLabel"> * </label>
                            <input
                              type="text"
                              maxLength="2"
                              className="form-control"
                              required
                              value={editingStateData?.stateCode || stateCode}
                              onChange={(e) =>
                                !viewMode &&
                                (editingStateData
                                  ? setEditingStateData({
                                      ...editingStateData,
                                      stateCode: e.target.value,
                                    })
                                  : setStateCode(e.target.value))
                              }
                              disabled={viewMode}
                            />
                            {stateCodeError && (
                              <p className="errorLabel">{stateCodeError}</p>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>State Initial</label>
                            <label className="errorLabel"> * </label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              value={
                                editingStateData?.stateInitial || stateInitial
                              }
                              maxLength="2"
                              onChange={(e) =>
                                !viewMode &&
                                (editingStateData
                                  ? setEditingStateData({
                                      ...editingStateData,
                                      stateInitial: e.target.value,
                                    })
                                  : setStateInitial(
                                      e.target.value.toUpperCase()
                                    ))
                              }
                              disabled={viewMode}
                            />
                            {stateInitialError && (
                              <p className="errorLabel">{stateInitialError}</p>
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
                                uploadDocumentError={uploadDocumentError}
                                inputId="stateUpload"
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
                                disabled={viewMode}
                              ></textarea>
                              {remarksError && (
                                <p
                                  className="errorLabel"
                                  style={{ color: "red" }}
                                >
                                  {remarksError}
                                </p>
                              )}
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="BtnGroup">
                      <>
                        <button
                          className="SubmitBtn"
                          onClick={handleSubmit}
                          disabled={viewMode}
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
                      </>
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
          title={"Edit State Master"}
          show={editModal}
          handleClose={handleCloseEditModal}
          size="xl"
          centered
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          required
                          value={editingStateData?.stateName || stateName}
                          onChange={(e) =>
                            !viewMode &&
                            (editingStateData
                              ? setEditingStateData({
                                  ...editingStateData,
                                  stateName: e.target.value,
                                })
                              : setStateName(e.target.value))
                          }
                          disabled={viewMode} // Disable the field in view mode
                        />
                        {stateNameError && (
                          <p className="errorLabel">{stateNameError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="2"
                          className="form-control"
                          required
                          value={editingStateData?.stateCode || stateCode}
                          onChange={(e) =>
                            !viewMode &&
                            (editingStateData
                              ? setEditingStateData({
                                  ...editingStateData,
                                  stateCode: e.target.value,
                                })
                              : setStateCode(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {stateCodeError && (
                          <p className="errorLabel">{stateCodeError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Initial</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={editingStateData?.stateInitial || stateInitial}
                          maxLength="2"
                          onChange={(e) =>
                            !viewMode &&
                            (editingStateData
                              ? setEditingStateData({
                                  ...editingStateData,
                                  stateInitial: e.target.value,
                                })
                              : setStateInitial(e.target.value.toUpperCase()))
                          }
                          disabled={viewMode}
                        />
                        {stateInitialError && (
                          <p className="errorLabel">{stateInitialError}</p>
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
                            uploadDocumentError={uploadDocumentError}
                            inputId="stateUpload"
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
                            disabled={viewMode}
                          ></textarea>
                          {remarksError && (
                            <p className="errorLabel" style={{ color: "red" }}>
                              {remarksError}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

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
        </Modals>
      ) : (
        ""
      )}

      {/* View */}
      {viewModal ? (
        <Modals
          title={"View State Master"}
          show={viewModal}
          handleClose={handleCloseViewModal}
          size="xl"
          centered
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          required
                          value={editingStateData?.stateName || stateName}
                          disabled={viewMode} // Disable the field in view mode
                        />
                        {stateNameError && (
                          <p className="errorLabel">{stateNameError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="2"
                          className="form-control"
                          required
                          value={editingStateData?.stateCode || stateCode}
                          disabled={viewMode}
                        />
                        {stateCodeError && (
                          <p className="errorLabel">{stateCodeError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Initial</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={editingStateData?.stateInitial || stateInitial}
                          maxLength="2"
                          disabled={viewMode}
                        />
                        {stateInitialError && (
                          <p className="errorLabel">{stateInitialError}</p>
                        )}
                      </div>
                    </div>
                  </div>
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
            <Typography>Manage State Master</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchStateName}
                          onChange={(e) => setSearchStateName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Code</label>
                        <select
                          className="form-control select-form"
                          value={searchStateCode}
                          onChange={(e) => setSearchStateCode(e.target.value)}
                        >
                          <option value={0}>Select State Code</option>
                          {getAllStateData?.map((state) => (
                            <option key={state.stateId} value={state.stateId}>
                              {state.stateCode}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Initial</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchStateInitial}
                          onChange={(e) =>
                            setSearchStateInitial(e.target.value)
                          }
                        />
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
                        <button
                          className="SubmitBtn"
                          onClick={() => handleSearch()}
                        >
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
                    disabled={searchStateData && searchStateData.length < 19}
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
                    title: "State Name",
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
      {/* Preview */}
      {previewDocumentContent != "" && "preview" == documentMode ? (
        <Modals
          title={"State Master"}
          show={previewModal}
          handleClose={handleClosePreviewModal}
          size="xl"
          centered
        >
          <Base64ToPDFPreview base64String={previewDocumentContent} />
        </Modals>
      ) : (
        ""
      )}
    </>
  );
}

export default CreateStateMaster;
