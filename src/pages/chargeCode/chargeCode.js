import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import {
  getChargeCode,
  getChargeCodeAsc,
  createChargeCodeAction,
  getChargeCodeByIdAction,
  updateChargeCodeAction,
  getHistoryByIdAction,
  getDocumentByIdAction,
  uploadAllDocumentsChargeCodeAction,
  getChargeCodeByIdActionSuccess,
  createEditChargeCodeApiStatus,
  getChargeCodeWithoutFilter,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  getDocumentByIdActionSuccess,
} from "../../store/actions";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import { ThreeDots } from "react-loader-spinner";

import $ from "jquery";
import CustomToast from "../../components/Toast";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";

let pageNo = 1;

const data = [
  {
    state: "California",
    chargeCode: "CA",
    stateInitial: "C",
    action: "Some action",
  },
  {
    state: "New York",
    chargeCode: "NY",
    stateInitial: "NY",
    action: "Another action",
  },
];

function ChargeCode({ open, setOpen, modalRight }) {
  const getChargeCodeData = useSelector(
    (state) => state.chargeCode.getChargeCode.responseData
  );

  const dispatch = useDispatch();
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [documentMode, setDocumentmode] = useState("");
  const [ChargeCodeName, setChargeCodeName] = useState("");
  const [chargeCode, setchargeCode] = useState("");
  const [stateInitial, setStateInitial] = useState("");

  const [editingChargeCodeData, setEditingChargeCodeData] = useState(null);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [ChargeCodeNameError, setChargeCodeNameError] = useState("");
  const [ChargeCodeError, setChargeCodeError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showmodal, setShowmodal] = useState(false);
  const [isActive, setIsActive] = useState("");
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
  const editingChargeCodeDataFromState = useSelector(
    (state) => state.chargeCode.chargeCodeData.responseData
  );
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_ChargeCode";
    const moduleName = "ChargeCode";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };
  const getAllUploadedDoc = useSelector(
    (state) => state.chargeCode.uploadedDocuments.responseData
  );
  const handleCloseHistory = () => setShowmodal(false);
  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );
  const handleDownloadClick = (uploadDocumentConfId, type) => {
    setDocumentmode(type);
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
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

  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    const inputElement = document.getElementById("chargeCodeUpload");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setChargeCodeNameError("");
    setChargeCodeError("");
    setUploadDocumentError("");
    setRemarksError("");
    let isValid = true;

    if (!ChargeCodeName.trim()) {
      CustomToast.error("Please enter the charge code name");
      isValid = false;
      return;
    }

    if (!chargeCode) {
      CustomToast.error("Please enter the charge code");
      isValid = false;
      return;
    }

    // if (!editingChargeCodeData) {
    // In create mode, check if the user provided either upload document or remarks
    // if (!uploadedDocuments.length && !uploadDocumentRemarks) {
    //   setUploadDocumentError("");
    //   setRemarksError("");
    // } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
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

    const newChargeCodedata = {
      chargeCodeName: ChargeCodeName,
      chargeCode: chargeCode,
      stateInitial: stateInitial,
      isActive: 1,
      uploadDocumentRemarks: uploadDocumentRemarks,
      downloadDto: uploadedDocuments,
      searchData: {
        pageNo: 1,
        noOfRecords: NO_OF_RECORDS,
      },
      searchasd: {
        sortBy: "asc",
        sortColumn: "chargeCode",
      },
    };
    try {
      if (editingChargeCodeData) {
        const isFormModified =
          ChargeCodeName !== editingChargeCodeData.chargeCodeName ||
          chargeCode !== editingChargeCodeData.chargeCode ||
          uploadDocumentRemarks !==
            editingChargeCodeData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingChargeCodeData.downloadDto.length;

        if (isFormModified) {
          let records = pageNo * NO_OF_RECORDS;
          editingChargeCodeData.searchData = {
            pageNo: 1,
            noOfRecords: records + "",
          };

          editingChargeCodeData.searchasd = {
            sortBy: "asc",
            sortColumn: "chargeCode",
          };
          editingChargeCodeData.uploadDocumentRemarks = uploadDocumentRemarks;
          editingChargeCodeData.downloadDto = uploadedDocuments;

          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(updateChargeCodeAction(editingChargeCodeData));
          }, 1000);
        } else {
        }
      } else {
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          setRows([]);
          dispatch(createChargeCodeAction(newChargeCodedata));
        }, 1000);
      }
      // dispatch(getAllStateAction());
    } catch (error) {
      setSubmitSuccess(false);
    }
  };
  const handleEditClick = (ChargeCodeId) => {
    setViewMode(false);
    dispatch(getChargeCodeByIdAction(ChargeCodeId));
    // setExpanded("panel1");
    setEditModal(true);
  };
  useEffect(() => {
    if (editingChargeCodeDataFromState) {
      setEditingChargeCodeData(editingChargeCodeDataFromState);
      setChargeCodeName(editingChargeCodeDataFromState.chargeCodeName || "");
      setchargeCode(editingChargeCodeDataFromState.chargeCode || "");
      setUploadDocumentRemarks(
        editingChargeCodeDataFromState.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingChargeCodeDataFromState.downloadDto || []);
    } else {
      resetForm();
    }
  }, [editingChargeCodeDataFromState]);
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id =
      editingChargeCodeDataFromState &&
      editingChargeCodeDataFromState.chargeCodeId;
    let searchData = {
      url: `/admin/chargecode/get/${id}/${exportType}`,
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
          "ChargeCodeDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "ChargeCodeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (ChargeCodeId) => {
    dispatch(getChargeCodeByIdAction(ChargeCodeId));
    setViewMode(true);
    setViewModal(true);
    // setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
  };
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      getChargeCode({
        chargeCodeName: ChargeCodeName,
        chargeCodeId: chargeCode,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      getChargeCode({
        chargeCodeName: ChargeCodeName,
        chargeCodeId: chargeCode,
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

  const clearSearch = () => {
    setChargeCodeName("");
    setchargeCode("");
    setIsActive("");
    pageNo = 1;
    setRows([]);
    setUploadDocumentRemarks("");
    dispatch(
      getChargeCodeAsc({
        sortBy: "asc",
        sortColumn: "chargeCode",
      })
    );
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(getChargeCode({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    }, 1000);
  };

  const resetForm = () => {
    setChargeCodeName("");
    setchargeCode("");
    setUploadDocumentRemarks("");
    setUploadedFiles([]);
    setUploadedDocuments([]);
    setEditingChargeCodeData(null);
    setChargeCodeNameError("");
    setChargeCodeError("");
    setUploadDocumentError("");
    setRemarksError("");
    // setUploadedFiles([]); // Clear uploaded files
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      dispatch(
        getChargeCodeAsc({
          sortBy: "asc",
          sortColumn: "chargeCode",
        })
      );
      dispatch(getChargeCode({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
      // dispatch(getChargeCodeWithoutFilter());
      //Get All roles
      // dispatch(getAllRoles());
      // clearSearch();
      setViewMode(false);
      dispatch(getChargeCodeByIdActionSuccess([]));
      setEditingChargeCodeData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsChargeCodeAction());
      setViewMode(false);
      dispatch(getChargeCodeByIdActionSuccess([]));
      setEditingChargeCodeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getChargeCodeByIdActionSuccess([]));
      setEditingChargeCodeData(null);
      resetForm();
    }
  };

  const getChargeCodeWithoutFilterResponse = useSelector(
    (state) => state.chargeCode.getChargeCodeAsc.responseData
  );

  const [rows, setRows] = useState(getChargeCodeData);

  // useEffect(() => {
  //   if (getChargeCodeData != null && getChargeCodeData != undefined) {
  //     setRows(getChargeCodeData);
  //   } else {
  //     setRows([]);
  //   }
  // }, [getChargeCodeData && getChargeCodeData]);
  useEffect(() => {
    const newRows = getChargeCodeData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      if (newRows.length > 0) {
        const index = currentRows.findIndex(
          (row) => row.chargeCodeId === newRows[0].chargeCodeId
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
  }, [getChargeCodeData]);

  let createData = useSelector(
    (state) => state.chargeCode.createEditChargeCodeApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditChargeCodeApiStatus(false));
      setExpanded("panel2");
      resetForm();
      clearSearch();
      dispatch(getChargeCodeByIdActionSuccess([]));
      setEditingChargeCodeData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "chargeCodeName",
      title: "Charge Code name",
    },
    {
      name: "chargeCode",
      title: "Charge Code",
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
                onClick={() => handleEditClick(data.data.chargeCodeId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.chargeCodeId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => handleHistoryViewClick(data.data.chargeCodeId)}
              ></i>
            </Tooltip>
          )}
        </div>
      </>
    );
  }

  function StatusData(data) {
    const handleSwitchChange = () => {
      // Destructure data for readability
      const {
        chargeCodeName,
        chargeCode,
        isActive,
        chargeCodeId,
        pageNo,
        NO_OF_RECORDS,
      } = data.data;

      // Toggle isActive value when the switch is changed
      const updatedData = {
        ...data.data,
        isActive: isActive === 1 ? 0 : 1,
        pageNo: 1,
        noOfRecords: 20,
      };

      // Update searchData with the current chargeCodeId, pageNo, and noOfRecords
      const searchData = {
        chargeCodeName: updatedData.chargeCodeName,
        chargeCodeId: updatedData.chargeCodeId,
        chargeCode: updatedData.chargeCode,
        isActive: updatedData.isActive,
        uploadDocumentRemarks: null,
        downloadDto: null,
        isExport: updatedData.isExport,
        exportType: null,
        sortBy: null,
        sortColumn: null,
        pageNo: updatedData.pageNo,
        noOfRecords: updatedData.noOfRecords,
      };

      // Include the updated searchData in the updatedData
      updatedData.searchData = searchData;

      // Call the API to update the isActive status in the backend
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateChargeCodeAction(updatedData));
      }, 1000);
    };

    // Rest of your component...

    return (
      <>
        {modalRight?.some((ele) => ele === "5") ? (
          <div class="Switch">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id={`customSwitch${data.data.chargeCodeId}`}
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange}
              />
              <label
                class="custom-control-label"
                for={`customSwitch${data.data.chargeCodeId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.chargeCodeId}`}
          >
            {data.data.isActive === 1 ? "Active" : "Inactive"}
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

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      chargeCodeName: ChargeCodeName,
      chargeCodeId: chargeCode,
      isActive,
      url: "/admin/chargecode/search",
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
        Base64ToExcelDownload(getExportDataResponse, "ChargeCodeDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "ChargeCodeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleCloseViewModal = () => {
    setViewModal(false);
    //Serch API call
    dispatch(
      getChargeCodeAsc({
        sortBy: "asc",
        sortColumn: "chargeCode",
      })
    );
    dispatch(getChargeCode({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    // dispatch(getChargeCodeWithoutFilter());
    //Get All roles
    // dispatch(getAllRoles());
    // clearSearch();
    setViewMode(false);
    dispatch(getChargeCodeByIdActionSuccess([]));
    setEditingChargeCodeData(null);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    //Serch API call
    dispatch(
      getChargeCodeAsc({
        sortBy: "asc",
        sortColumn: "chargeCode",
      })
    );
    dispatch(getChargeCode({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    // dispatch(getChargeCodeWithoutFilter());
    //Get All roles
    // dispatch(getAllRoles());
    // clearSearch();
    setViewMode(false);
    dispatch(getChargeCodeByIdActionSuccess([]));
    setEditingChargeCodeData(null);
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
            <Typography>Create Charge Code</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charge Code name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            editingChargeCodeData?.chargeCodeName ||
                            ChargeCodeName
                          }
                          maxLength="50"
                          onChange={(e) =>
                            editingChargeCodeData
                              ? setEditingChargeCodeData({
                                  ...editingChargeCodeData,
                                  chargeCodeName: e.target.value,
                                })
                              : setChargeCodeName(e.target.value)
                          }
                        />
                        {ChargeCodeNameError && (
                          <p className="errorLabel" style={{ color: "red" }}>
                            {ChargeCodeNameError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>
                          Charge Code<label className="errorLabel"> * </label>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            editingChargeCodeData?.chargeCode || chargeCode
                          }
                          maxLength="10"
                          onChange={(e) =>
                            !viewMode &&
                            (editingChargeCodeData
                              ? setEditingChargeCodeData({
                                  ...editingChargeCodeData,
                                  chargeCode: e.target.value,
                                })
                              : setchargeCode(e.target.value))
                          }
                        />
                        {ChargeCodeError && (
                          <p className="errorLabel" style={{ color: "red" }}>
                            {ChargeCodeError}
                          </p>
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
                            inputId="chargeCodeUpload"
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

                    <div className="col-md-12">
                      <div className="BtnGroup">
                        <button
                          className="SubmitBtn"
                          disabled={viewMode}
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                        <button
                          className="Clear"
                          disabled={viewMode}
                          onClick={handleClear}
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
          title={"Edit Charge Code"}
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
                    <label>Charge Code name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        editingChargeCodeData?.chargeCodeName || ChargeCodeName
                      }
                      maxLength="50"
                      onChange={(e) =>
                        editingChargeCodeData
                          ? setEditingChargeCodeData({
                              ...editingChargeCodeData,
                              chargeCodeName: e.target.value,
                            })
                          : setChargeCodeName(e.target.value)
                      }
                    />
                    {ChargeCodeNameError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {ChargeCodeNameError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>
                      Charge Code<label className="errorLabel"> * </label>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingChargeCodeData?.chargeCode || chargeCode}
                      maxLength="10"
                      onChange={(e) =>
                        !viewMode &&
                        (editingChargeCodeData
                          ? setEditingChargeCodeData({
                              ...editingChargeCodeData,
                              chargeCode: e.target.value,
                            })
                          : setchargeCode(e.target.value))
                      }
                    />
                    {ChargeCodeError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {ChargeCodeError}
                      </p>
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
                        inputId="chargeCodeUpload"
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

                <div className="col-md-12">
                  <div className="BtnGroup">
                    <button
                      className="SubmitBtn"
                      disabled={viewMode}
                      onClick={handleSubmit}
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
          title={"View Charge Code"}
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
                    <label>Charge Code name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        editingChargeCodeData?.chargeCodeName || ChargeCodeName
                      }
                      maxLength="50"
                      disabled={viewMode}
                    />
                    {ChargeCodeNameError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {ChargeCodeNameError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>
                      Charge Code<label className="errorLabel"> * </label>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingChargeCodeData?.chargeCode || chargeCode}
                      maxLength="10"
                      disabled={viewMode}
                    />
                    {ChargeCodeError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {ChargeCodeError}
                      </p>
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
            <Typography>Manage Charge Code</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charge Code Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={ChargeCodeName}
                          onChange={(e) => setChargeCodeName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charge Code</label>
                        <select
                          className="form-control select-form"
                          value={chargeCode}
                          onChange={(e) => setchargeCode(e.target.value)}
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
                    disabled={
                      getChargeCodeData && getChargeCodeData.length < 19
                    }
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
                    title: "Charge Code",
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
      {/* History */}

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

export default ChargeCode;
