import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Modals from "../../components/common/Modal";
import { Card, Modal } from "react-bootstrap";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import {
  createPlantationAction,
  getAllStateAction,
  getAllStateAscAction,
  updatePlantationAction,
  getPlantationByIdAction,
  searchPlantationAction,
  uploadAllDocumentsPlantationAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditPlantationApiStatus,
  getPlantationByIdActionSuccess,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  getDocumentByIdActionSuccess,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import $ from "jquery";
import CustomToast from "../../components/Toast";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

let pageNo = 1;
function CreatePlantationDistrictMaster({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [plantationDistrictName, setPlantationDistrictName] = useState("");
  const [stateId, setSelectedStateId] = useState(0);
  const [editingPlantationData, setEditingPlantationData] = useState(null);
  const [documentMode, setDocumentmode] = useState("");
  const [getSearchPlantation, setGetSearchPlantation] = useState([]);
  const [getAllPlantation, setGetAllPlantation] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  // New state variables for search parameters
  const [searchPlantationDistrictName, setSearchPlantationDistrictName] =
    useState("");
  const [searchStateId, setSearchStateId] = useState("");
  const [isActive, setIsActive] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [plantationDistrictNameError, setPlantationDistrictNameError] =
    useState("");
  const [selectedStateIdError, setSelectedStateIdError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
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

  const getAllPlantationData = useSelector(
    (state) => state.plantation.allPlantations.responseData
  );

  const allStates = useSelector(
    (state) => state.state.getAllStateAsc.responseData
  );

  const isActiveData =
    allStates && allStates.filter((data) => 1 == data.isActive);

  const editingPlantationDataFromId = useSelector(
    (state) => state.plantation.plantationById.responseData
    // .plantation.plantationById.responseData
  );
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchPlantationAction({
        plantationDistrictName: searchPlantationDistrictName,
        stateId: searchStateId,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchPlantationAction({
        plantationDistrictName: searchPlantationDistrictName,
        stateId: searchStateId,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };

  // Function to perform the search API call
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
    setSearchPlantationDistrictName("");
    setSearchStateId("");
    setIsActive("");
    setRows([]);
    pageNo = 1;
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        searchPlantationAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
    }, 1000);
  };

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      plantationDistrictName: searchPlantationDistrictName,
      stateId: searchStateId,
      isActive,
      url: "/admin/plantation/search",
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
          "PlantationDistrictDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "PlantationDistrictDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const searchPlantationData = useSelector(
    (state) => state.plantation.searchedPlantations.responseData //.plantation.searchedPlantations.responseData
  );

  const validateForm = () => {
    let isValid = true;

    // Validate Auction Center Name
    if (!plantationDistrictName.trim()) {
      CustomToast.error("Please enter the plantation district name");
      isValid = false;
      return;
    } else {
      setPlantationDistrictNameError("");
    }

    // Validate Auction Center Code
    if (!stateId) {
      CustomToast.error("Please select a state from the dropdown menu");
      isValid = false;
      return;
    } else {
      setSelectedStateIdError("");
    }

    // if (!editingPlantationData) {
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
  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };
  const resetForm = () => {
    setPlantationDistrictName("");
    setSelectedStateId("");
    const inputElement = document.getElementById("plantationUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    setUploadDocumentRemarks("");
    setUploadedFiles([]);
    setUploadedDocuments([]);
    setEditingPlantationData(null);

    setPlantationDistrictNameError("");
    setSelectedStateIdError("");
    setUploadDocumentError("");
    setRemarksError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const plantationData = {
        plantationDistrictName: plantationDistrictName,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
        stateId: stateId,
        searchData: {
          pageNo: 1,
          noOfRecords: NO_OF_RECORDS,
        },
      };
      try {
        if (editingPlantationData) {
          const isFormModified =
            plantationDistrictName !==
              editingPlantationData?.plantationDistrictName ||
            stateId !== editingPlantationData?.stateId ||
            uploadDocumentRemarks !==
              editingPlantationData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingPlantationData?.downloadDto || []).length;
          if (isFormModified) {
            editingPlantationData.searchData = {
              plantationDistrictName: searchPlantationDistrictName,
              stateId: searchStateId,
              isActive,
              pageNo: pageNo,
              noOfRecords: NO_OF_RECORDS,
            };
            editingPlantationData.uploadDocumentRemarks = uploadDocumentRemarks;
            editingPlantationData.downloadDto = uploadedDocuments;

            setLoader(true);
            setTimeout(() => {
              setLoader(false);
              setRows([]);
              dispatch(updatePlantationAction(editingPlantationData));
            }, 1000);
          } else {
          }
        } else {
          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(createPlantationAction(plantationData));
          }, 1000);
        }
      } catch (e) {}
    }
  };
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id =
      editingPlantationDataFromId && editingPlantationDataFromId.plantationId;
    let searchData = {
      url: `/admin/plantation/get/${id}/${exportType}`,
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
          "PlantationDistrictDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "PlantationDistrictDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  // Function to handle edit button click
  const handleEditClick = (plantationId) => {
    dispatch(getPlantationByIdAction(plantationId));
    // setExpanded("panel1");
    setEditModal(true);
  };

  useEffect(() => {
    if (editingPlantationDataFromId) {
      setEditingPlantationData(editingPlantationDataFromId);
      setPlantationDistrictName(
        editingPlantationDataFromId.plantationDistrictName || ""
      );
      setSelectedStateId(editingPlantationDataFromId.stateId || "");
      setUploadDocumentRemarks(
        editingPlantationDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingPlantationDataFromId.downloadDto || []);
    } else {
      setEditingPlantationData(null);
      dispatch(
        getAllStateAscAction({
          sortBy: "asc",
          sortColumn: "stateName",
        })
      );
    }
  }, [editingPlantationDataFromId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      pageNo = 1;
      dispatch(
        searchPlantationAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
      // clearSearch();
      setViewMode(false);
      dispatch(getPlantationByIdActionSuccess([]));
      setEditingPlantationData(null);
      resetForm();
      dispatch(
        getAllStateAscAction({
          sortBy: "asc",
          sortColumn: "stateName",
        })
      );
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsPlantationAction());
      setViewMode(false);
      dispatch(getPlantationByIdActionSuccess([]));
      setEditingPlantationData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getPlantationByIdActionSuccess([]));
      setEditingPlantationData(null);
      resetForm();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.plantation.uploadedDocuments.responseData
  );

  let createData = useSelector(
    (state) => state.plantation.createEditPlantationApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditPlantationApiStatus(false));
      dispatch(getPlantationByIdActionSuccess([]));
      setEditingPlantationData(null);
      resetForm();
      setExpanded("panel2");
      setEditModal(false);
      setViewModal(false);
    }
  });

  const [rows, setRows] = useState(getAllPlantation || getSearchPlantation);
  // useEffect(() => {
  //   const newRows = searchPlantationData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [searchPlantationData]);

  useEffect(() => {
    const newRows = searchPlantationData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.plantationId === newRow.plantationId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [searchPlantationData]);
  // useEffect(() => {
  //   if (searchPlantationData != null && searchPlantationData != undefined) {
  //     setGetSearchPlantation(searchPlantationData);
  //     setRows(searchPlantationData); // Update rows with the search data
  //   } else {
  //     setGetSearchPlantation([]);
  //     setRows([]); // Update rows with the search data
  //   }
  // }, [searchPlantationData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "plantationDistrictName",
      title: "Plantation District name",
    },
    {
      name: "stateName",
      title: "State",
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
        plantationDistrictName: searchPlantationDistrictName,
        stateId: searchStateId,
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

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updatePlantationAction(updatedData));
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
                id={`customSwitch${data.data.plantationId}`} // Use a unique ID for each switch
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange} // Call the handler on
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.plantationId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.plantationId}`}
          >
            {data.data.isActive === 1 ? "Active" : "Inactive"}
          </label>
        )}
      </>
    );
  }

  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (plantationId) => {
    dispatch(getPlantationByIdAction(plantationId));
    setViewMode(true);
    // setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
    setViewModal(true);
  };
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
        {modalRight?.some((ele) => ele === "7") && (
          <div class="Action">
            <i
              class="fa fa-download"
              onClick={() => {
                handleDownloadClick(data.data.uploadDocumentConfId, "download");
              }}
            ></i>
            <i
             title="Preview"
              class="fa fa-eye"
              onClick={() => {
                handleDownloadClick(data.data.uploadDocumentConfId, "preview");
              }}
            ></i>
          </div>
        )}
      </>
    );
  }
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_plantation";
    const moduleName = "Plantation";
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
                onClick={() => handleEditClick(data.data.plantationId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.plantationId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.plantationId);
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
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
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
    pageNo = 1;
    dispatch(
      searchPlantationAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getPlantationByIdActionSuccess([]));
    setEditingPlantationData(null);
    resetForm();
    dispatch(
      getAllStateAscAction({
        sortBy: "asc",
        sortColumn: "stateName",
      })
    );
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    //Serch API call
    pageNo = 1;
    dispatch(
      searchPlantationAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getPlantationByIdActionSuccess([]));
    setEditingPlantationData(null);
    resetForm();
    dispatch(
      getAllStateAscAction({
        sortBy: "asc",
        sortColumn: "stateName",
      })
    );
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
            <Typography>Create Plantation District</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Plantation District name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="50"
                          className="form-control"
                          value={
                            editingPlantationData?.plantationDistrictName ||
                            plantationDistrictName
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingPlantationData
                              ? setEditingPlantationData({
                                  ...editingPlantationData,
                                  plantationDistrictName: e.target.value,
                                })
                              : setPlantationDistrictName(e.target.value))
                          }
                        />
                        {plantationDistrictNameError && (
                          <p className="errorLabel">
                            {plantationDistrictNameError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingPlantationData?.stateId || stateId}
                          onChange={(e) =>
                            !viewMode &&
                            (editingPlantationData
                              ? setEditingPlantationData({
                                  ...editingPlantationData,
                                  stateId: e.target.value,
                                })
                              : setSelectedStateId(e.target.value))
                          }
                        >
                          <option value="">Select State</option>
                          {isActiveData?.map((state) => (
                            <option key={state.stateId} value={state.stateId}>
                              {state.stateName}
                            </option>
                          ))}
                        </select>
                        {selectedStateIdError && (
                          <p className="errorLabel">{selectedStateIdError}</p>
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
                            inputId="plantationUpload"
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
          title={"Edit Plantation District"}
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
                    <label>Plantation District name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="50"
                      className="form-control"
                      value={
                        editingPlantationData?.plantationDistrictName ||
                        plantationDistrictName
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingPlantationData
                          ? setEditingPlantationData({
                              ...editingPlantationData,
                              plantationDistrictName: e.target.value,
                            })
                          : setPlantationDistrictName(e.target.value))
                      }
                    />
                    {plantationDistrictNameError && (
                      <p className="errorLabel">
                        {plantationDistrictNameError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingPlantationData?.stateId || stateId}
                      onChange={(e) =>
                        !viewMode &&
                        (editingPlantationData
                          ? setEditingPlantationData({
                              ...editingPlantationData,
                              stateId: e.target.value,
                            })
                          : setSelectedStateId(e.target.value))
                      }
                    >
                      <option value="">Select State</option>
                      {isActiveData?.map((state) => (
                        <option key={state.stateId} value={state.stateId}>
                          {state.stateName}
                        </option>
                      ))}
                    </select>
                    {selectedStateIdError && (
                      <p className="errorLabel">{selectedStateIdError}</p>
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
                        inputId="plantationUpload"
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
          title={"View Plantation District"}
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
                    <label>Plantation District name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="50"
                      className="form-control"
                      value={
                        editingPlantationData?.plantationDistrictName ||
                        plantationDistrictName
                      }
                      disabled={viewMode}
                    />
                    {plantationDistrictNameError && (
                      <p className="errorLabel">
                        {plantationDistrictNameError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingPlantationData?.stateId || stateId}
                      disabled={viewMode}
                    >
                      <option value="">Select State</option>
                      {isActiveData?.map((state) => (
                        <option key={state.stateId} value={state.stateId}>
                          {state.stateName}
                        </option>
                      ))}
                    </select>
                    {selectedStateIdError && (
                      <p className="errorLabel">{selectedStateIdError}</p>
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
            <Typography>Manage Plantation District</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Plantation District name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchPlantationDistrictName}
                          onChange={(e) =>
                            setSearchPlantationDistrictName(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State</label>
                        <select
                          className="form-control select-form"
                          value={searchStateId}
                          onChange={(e) => setSearchStateId(e.target.value)}
                        >
                          <option value="">Select State </option>
                          {allStates?.map((state) => (
                            <option key={state.stateId} value={state.stateId}>
                              {state.stateName}
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
                      searchPlantationData && searchPlantationData.length < 19
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
                    title: "Plantation District Name",
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
          title={"Plantation District Master"}
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

export default CreatePlantationDistrictMaster;
