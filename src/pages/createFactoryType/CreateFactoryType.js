import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
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
import {
  getAllFactoryAscTypes,
  getDocumentByIdActionSuccess,
  createFactoryType,
  updateFactoryType,
  getFactoryTypeById,
  searchFactoryType,
  uploadAllDocumentsFactoryTypeAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getFactoryTypeByIdSuccess,
  createEditFactoryTypeApiStatus,
  getGradeByIdSuccess,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import CustomToast from "../../components/Toast";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";
import Modals from "../../components/common/Modal";
import { ThreeDots } from "react-loader-spinner";

let pageNo = 1;
function CreateFactoryType({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [factoryTypeName, setFactoryTypeName] = useState("");
  const [loader, setLoader] = useState(false);
  const [factoryType, setFactoryType] = useState("");
  const [documentMode, setDocumentmode] = useState("");
  const [editingFactoryTypeData, setEditingFactoryTypeData] = useState(null);
  const [getSearchFactoryType, setGetSearchFactoryType] = useState([]);
  const [getAllFactoryType, setGetAllFactoryType] = useState([]);

  // New state variables for search parameters
  const [searchFactoryTypeName, setSearchFactoryTypeName] = useState("");
  const [searchFactoryTypeId, setSearchFactoryTypeId] = useState("");
  const [isActive, setIsActive] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");

  const [factoryTypeNameError, setFactoryTypeNameError] = useState("");
  const [factoryTypeError, setFactoryTypeError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");

  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [exportType, setexportType] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
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

  const getAllFactoryTypeData = useSelector(
    (state) => state.fectoryType.allFactoryAscTypes.responseData
  );
  const isActiveData =
    getAllFactoryTypeData &&
    getAllFactoryTypeData.filter((data) => 1 == data.isActive);

  const editingFactoryTypeDataFromId = useSelector(
    (state) => state.fectoryType.factoryType.responseData
  );
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchFactoryType({
        factoryTypeName: searchFactoryTypeName,
        factoryTypeId: searchFactoryTypeId,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchFactoryType({
        factoryTypeName: searchFactoryTypeName,
        factoryTypeId: searchFactoryTypeId,
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
    setSearchFactoryTypeName("");
    setSearchFactoryTypeId("");
    setIsActive("");
    setRows([]);
    pageNo = 1;
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        searchFactoryType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
    }, 1000);
  };

  const searchFactoryTypeData = useSelector(
    (state) => state.fectoryType.searchResults.responseData
  );

  let createData = useSelector(
    (state) => state.fectoryType.createEditFactoryTypeApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditFactoryTypeApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getGradeByIdSuccess([]));
      setEditingFactoryTypeData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const resetForm = () => {
    setFactoryTypeName("");
    setFactoryType("");
    setUploadDocumentRemarks("");
    setUploadedFiles([]);
    setUploadedDocuments([]);
    setEditingFactoryTypeData(null);
    const inputElement = document.getElementById("factoryTypeUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    setFactoryTypeNameError("");
    setFactoryTypeError("");
    setRemarksError("");
    setUploadDocumentError("");
  };

  const validateForm = () => {
    let isValid = true;

    if (!factoryTypeName.trim()) {
      CustomToast.error("Please enter the factory type name");
      isValid = false;
      return;
    } else {
      setFactoryTypeNameError("");
    }

    if (!factoryType) {
      CustomToast.error("Please enter the factory type");
      isValid = false;
      return;
    } else {
      setFactoryTypeError("");
    }

    // if (!editingFactoryTypeData) {
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
    return isValid;
  };

  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id =
      editingFactoryTypeDataFromId &&
      editingFactoryTypeDataFromId.factoryTypeId;
    let searchData = {
      url: `/admin/factorytype/get/${id}/${exportType}`,
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
          "FactoryTypeDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "FactoryTypeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      factoryTypeName: searchFactoryTypeName,
      factoryTypeId: searchFactoryTypeId,
      isActive,
      url: "/admin/factorytype/search",
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
        Base64ToExcelDownload(getExportDataResponse, "FactoryTypeDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "FactoryTypeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const factoryTypeData = {
        factoryTypeName: factoryTypeName,
        factoryType: factoryType,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
        searchData: {
          pageNo: 1,
          noOfRecords: NO_OF_RECORDS,
        },
      };

      try {
        if (editingFactoryTypeData) {
          const isFormModified =
            factoryTypeName !== editingFactoryTypeData?.factoryTypeName ||
            factoryType !== editingFactoryTypeData?.factoryType ||
            uploadDocumentRemarks !==
              editingFactoryTypeData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingFactoryTypeData?.downloadDto || []).length;
          if (isFormModified) {
            editingFactoryTypeData.searchData = {
              factoryTypeName: searchFactoryTypeName,
              factoryTypeId: searchFactoryTypeId,
              isActive,
              pageNo: pageNo,
              noOfRecords: NO_OF_RECORDS,
            };
            editingFactoryTypeData.uploadDocumentRemarks =
              uploadDocumentRemarks;
            editingFactoryTypeData.downloadDto = uploadedDocuments;

            setLoader(true);
            setTimeout(() => {
              setLoader(false);
              setRows([]);
              dispatch(updateFactoryType(editingFactoryTypeData));
            }, 1000);
          } else {
          }
        } else {
          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(createFactoryType(factoryTypeData));
          }, 1000);
        }
      } catch (e) {}
    }
  };
  // Function to handle edit button click
  const handleEditClick = (factoryTypeId) => {
    dispatch(getFactoryTypeById(factoryTypeId));
    // setExpanded("panel1");
    setEditModal(true);
  };

  useEffect(() => {
    if (editingFactoryTypeDataFromId) {
      setEditingFactoryTypeData(editingFactoryTypeDataFromId);
      setFactoryTypeName(editingFactoryTypeDataFromId.factoryTypeName || "");
      setFactoryType(editingFactoryTypeDataFromId.factoryType || "");
      setUploadDocumentRemarks(
        editingFactoryTypeDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingFactoryTypeDataFromId.downloadDto || []);
    } else {
      // setEditingFactoryTypeData(null);
      // Dispatch the action to fetch auction center data
    }
  }, [editingFactoryTypeDataFromId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      pageNo = 1;
      dispatch(
        searchFactoryType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
      //Get All State
      dispatch(
        getAllFactoryAscTypes({
          sortBy: "asc",
          sortColumn: "factoryType",
        })
      );
      // clearSearch();
      setViewMode(false);
      dispatch(getFactoryTypeByIdSuccess([]));
      setEditingFactoryTypeData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsFactoryTypeAction());
      setViewMode(false);
      dispatch(getFactoryTypeByIdSuccess([]));
      setEditingFactoryTypeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getFactoryTypeByIdSuccess([]));
      setEditingFactoryTypeData(null);
      resetForm();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.fectoryType.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(getAllFactoryType || getSearchFactoryType);
  // useEffect(() => {
  //   const newRows = searchFactoryTypeData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [searchFactoryTypeData]);
  useEffect(() => {
    const newRows = searchFactoryTypeData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.factoryTypeId === newRow.factoryTypeId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [searchFactoryTypeData]);
  // useEffect(() => {
  //   if (searchFactoryTypeData != null && searchFactoryTypeData != null) {
  //     setGetSearchFactoryType(searchFactoryTypeData);
  //     setRows(searchFactoryTypeData); // Update rows with the search data
  //   } else {
  //     setGetSearchFactoryType([]);
  //     setRows([]); // Update rows with the search data
  //   }
  // }, [searchFactoryTypeData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "factoryTypeName",
      title: "Factory Type Name",
    },
    {
      name: "factoryType",
      title: "Factory Type",
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
      let searchData = {
        factoryTypeName: searchFactoryTypeName,
        factoryTypeId: searchFactoryTypeId,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };
      // Toggle isActive value when the switch is changed
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };
      updatedData.searchData = searchData;
      // Call the API to update the isActive status in the backend

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateFactoryType(updatedData));
      }, 1000);
    };
    return (
      <>
        {modalRight?.some((ele) => ele === "5") ? (
          <div class="Switch">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id={`customSwitch${data.data.factoryTypeId}`} // Use a unique ID for each switch
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange} // Call the handler on
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.factoryTypeId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.factoryTypeId}`}
          >
            {data.data.isActive === 1 ? "Active" : "Inactive"}
          </label>
        )}
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
  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (factoryTypeId) => {
    dispatch(getFactoryTypeById(factoryTypeId));
    setViewMode(true);
    // setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
    setViewModal(true);
  };
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_FactoryType";
    const moduleName = "FactoryType";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );
  function ActionData(data) {
    return (
      <>
        <div class="Action">
          {modalRight?.some((ele) => ele === "2") && (
            <Tooltip title="Edit" placement="top">
              <i
                className="fa fa-edit"
                onClick={() => handleEditClick(data.data.factoryTypeId)}
              ></i>
            </Tooltip>
          )}

          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.factoryTypeId)}
              ></i>
            </Tooltip>
          )}

          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.factoryTypeId);
                }}
              ></i>
            </Tooltip>
          )}
        </div>
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
    // setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
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
    //Serch API call
    dispatch(searchFactoryType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    //Get All State
    dispatch(
      getAllFactoryAscTypes({
        sortBy: "asc",
        sortColumn: "factoryType",
      })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getFactoryTypeByIdSuccess([]));
    setEditingFactoryTypeData(null);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    //Serch API call
    dispatch(searchFactoryType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    //Get All State
    dispatch(
      getAllFactoryAscTypes({
        sortBy: "asc",
        sortColumn: "factoryType",
      })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getFactoryTypeByIdSuccess([]));
    setEditingFactoryTypeData(null);
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
            <Typography>Create Factory Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Factory Type Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          value={
                            editingFactoryTypeData?.factoryTypeName ||
                            factoryTypeName
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingFactoryTypeData
                              ? setEditingFactoryTypeData({
                                  ...editingFactoryTypeData,
                                  factoryTypeName: e.target.value,
                                })
                              : setFactoryTypeName(e.target.value))
                          }
                        />
                        {factoryTypeNameError && (
                          <p className="errorLabel">{factoryTypeNameError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Factory Type</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          value={
                            editingFactoryTypeData?.factoryType || factoryType
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingFactoryTypeData
                              ? setEditingFactoryTypeData({
                                  ...editingFactoryTypeData,
                                  factoryType: e.target.value,
                                })
                              : setFactoryType(e.target.value))
                          }
                        />
                        {factoryTypeError && (
                          <p className="errorLabel">{factoryTypeError}</p>
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
                            inputId="factoryTypeUpload"
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
          title={"Edit Factory Type"}
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
                    <label>Factory Type Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={
                        editingFactoryTypeData?.factoryTypeName ||
                        factoryTypeName
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingFactoryTypeData
                          ? setEditingFactoryTypeData({
                              ...editingFactoryTypeData,
                              factoryTypeName: e.target.value,
                            })
                          : setFactoryTypeName(e.target.value))
                      }
                    />
                    {factoryTypeNameError && (
                      <p className="errorLabel">{factoryTypeNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Factory Type</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingFactoryTypeData?.factoryType || factoryType}
                      onChange={(e) =>
                        !viewMode &&
                        (editingFactoryTypeData
                          ? setEditingFactoryTypeData({
                              ...editingFactoryTypeData,
                              factoryType: e.target.value,
                            })
                          : setFactoryType(e.target.value))
                      }
                    />
                    {factoryTypeError && (
                      <p className="errorLabel">{factoryTypeError}</p>
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
                        inputId="factoryTypeUpload"
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
          title={"View Factory Type"}
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
                    <label>Factory Type Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={
                        editingFactoryTypeData?.factoryTypeName ||
                        factoryTypeName
                      }
                      disabled={viewMode}
                    />
                    {factoryTypeNameError && (
                      <p className="errorLabel">{factoryTypeNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Factory Type</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingFactoryTypeData?.factoryType || factoryType}
                      disabled={viewMode}
                    />
                    {factoryTypeError && (
                      <p className="errorLabel">{factoryTypeError}</p>
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
            <Typography>Manage Factory Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Factory Type Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchFactoryTypeName}
                          onChange={(e) =>
                            setSearchFactoryTypeName(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Factory Type</label>
                        <select
                          className="form-control select-form"
                          value={searchFactoryTypeId}
                          onChange={(e) =>
                            setSearchFactoryTypeId(e.target.value)
                          }
                        >
                          <option value="">Select Factory Type </option>
                          {getAllFactoryTypeData?.map((state) => (
                            <option
                              key={state.factoryTypeId}
                              value={state.factoryTypeId}
                            >
                              {state.factoryType}
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
                      searchFactoryTypeData && searchFactoryTypeData.length < 19
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
                    title: "Factory Type",
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
        <Modal
          show={previewModal}
          onHide={handleClosePreviewModal}
          size="lg"
          centered
        >
          <Modal.Header>
            <Modal.Title>Factry Type</Modal.Title>
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

export default CreateFactoryType;
