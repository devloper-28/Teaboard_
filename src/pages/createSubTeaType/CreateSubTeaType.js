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
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import {
  getAllSubTeaTypes,
  createSubTeaType,
  getAllTeaTypes,
  getAllTeaTypesAsc,
  getSubTeaTypeById,
  updateSubTeaType,
  searchSubTeaType,
  uploadAllDocumentsSubTeaTypeAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getSubTeaTypeByIdSuccess,
  createEditSubTeaTypeApiStatus,
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
function CreateSubTeaType({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const [subTeaTypeName, setSubTeaTypeName] = useState("");
  const [subTeaTypeCode, setSubTeaTypeCode] = useState("");
  const [teaTypeId, setTeaTypeId] = useState("");
  const [editingSubTeaTypeData, setEditingSubTeaTypeData] = useState(null);
  const [exportViewType, setexportViewType] = useState("");
  const [getSearchSubTeaType, setGetSearchSubTeaType] = useState([]);
  const [getAllSubTeaType, setGetAllSubTeaType] = useState([]);

  // New state variables for search parameters
  const [searchSubTeaTypeName, setSearchSubTeaTypeName] = useState("");
  const [searchSubTeaTypeCode, setSearchSubTeaTypeCode] = useState("");
  const [searchTeaTypeId, setSearchTeaTypeId] = useState("");
  const [isActive, setIsActive] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");

  const [subTeaTypeNameError, setSubTeaTypeNameError] = useState("");
  const [subTeaTypeCodeError, setSubTeaTypeCodeError] = useState("");
  const [teaTypeIdError, setTeaTypeIdError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");

  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [exportType, setexportType] = useState("");
  const [documentMode, setDocumentmode] = useState("");
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

  const getAllSubTeaTypesData = useSelector(
    (state) => state.subTeaType.allSubTeaTypes.responseData
  );
  console.log("getAllSubTeaTypesData222", getAllSubTeaTypesData);

  const isActiveData =
    getAllSubTeaType && getAllSubTeaType.filter((data) => 1 == data.isActive);

  const editingSubTeaTypeDataFromId = useSelector(
    (state) => state.subTeaType.subTeaType.responseData
  );

  useEffect(() => {
    dispatch(
      getAllTeaTypesAsc({
        sortBy: "desc",
        sortColumn: "teaTypeName",
      })
    );
    // dispatch(searchSubTeaType({}));
  }, []);
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id =
      editingSubTeaTypeDataFromId && editingSubTeaTypeDataFromId.subTeaTypeId;
    let searchData = {
      url: `/admin/subTeaType/get/${id}/${exportType}`,
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
          "SubTeaTypeDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "SubTeaTypeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchSubTeaType({
        subTeaTypeId: searchSubTeaTypeCode,
        subTeaTypeName: searchSubTeaTypeName,
        teaTypeId: searchTeaTypeId,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchSubTeaType({
        subTeaTypeId: searchSubTeaTypeCode,
        subTeaTypeName: searchSubTeaTypeName,
        teaTypeId: searchTeaTypeId,
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
    // Clear search parameters and fetch all auction centers
    setSearchSubTeaTypeCode("");
    setSearchSubTeaTypeName("");
    setSearchTeaTypeId("");
    setIsActive("");
    setRows([]);
    pageNo = 1;
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        searchSubTeaType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
    }, 1000);

    // setRows(getAllSubTeaType);
  };

  const searchSubTeatypeData = useSelector(
    (state) => state.subTeaType.searchResults.responseData
  );

  const allTeaType = useSelector(
    (state) => state.teaTypeManage.allTeaTypesAsc.responseData
  );

  const isActiveTeaData =
    allTeaType && allTeaType.filter((data) => 1 == data.isActive);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubTeaTypeCodeError("");
    setSubTeaTypeNameError("");
    setTeaTypeIdError("");
    setUploadDocumentError("");
    setRemarksError("");

    let isValid = true;

    if (!subTeaTypeName.trim()) {
      CustomToast.error("Please enter the sub tea type name");
      isValid = false;
      return;
    }

    if (!subTeaTypeCode) {
      CustomToast.error("Please enter the sub tea type code");
      isValid = false;
      return;
    }

    if (!teaTypeId) {
      CustomToast.error("Please select an option from the drop-down menu.");
      isValid = false;
      return;
    }

    // if (!editingSubTeaTypeData) {
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

    const subTeaTypeData = {
      subTeaTypeCode: subTeaTypeCode,
      subTeaTypeName: subTeaTypeName,
      isActive: 1,
      uploadDocumentRemarks: uploadDocumentRemarks,
      downloadDto: uploadedDocuments,
      teaTypeId: teaTypeId,
      searchData: {
        pageNo: 1,
        noOfRecords: NO_OF_RECORDS,
      },
    };
    try {
      if (editingSubTeaTypeData) {
        const isFormModified =
          subTeaTypeCode !== editingSubTeaTypeData.subTeaTypeCode ||
          parseInt(teaTypeId) !== parseInt(editingSubTeaTypeData.teaTypeId) ||
          subTeaTypeName !== editingSubTeaTypeData.subTeaTypeName ||
          uploadDocumentRemarks !==
            editingSubTeaTypeData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingSubTeaTypeData.downloadDto.length;
        if (isFormModified) {
          editingSubTeaTypeData.searchData = {
            subTeaTypeId: searchSubTeaTypeCode,
            subTeaTypeName: searchSubTeaTypeName,
            teaTypeId: searchTeaTypeId,
            isActive,
            pageNo: pageNo,
            noOfRecords: NO_OF_RECORDS,
          };
          editingSubTeaTypeData.uploadDocumentRemarks = uploadDocumentRemarks;
          editingSubTeaTypeData.downloadDto = uploadedDocuments;

          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(updateSubTeaType(editingSubTeaTypeData));
          }, 1000);
        } else {
          // setExpanded("panel2");
        }
      } else {
        // dispatch(
        //   searchSubTeaType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
        // );
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          setRows([]);
          dispatch(createSubTeaType(subTeaTypeData));
        }, 1000);
      }
    } catch (e) {}
  };

  const handleViewClick = (subTeaTypeId) => {
    dispatch(getSubTeaTypeById(subTeaTypeId));
    setViewMode(true);
    // setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
    setViewModal(true);
  };

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const resetForm = () => {
    setSubTeaTypeName("");
    setSubTeaTypeCode("");
    setTeaTypeId("");
    const inputElement = document.getElementById("subTeatypeUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    setEditingSubTeaTypeData(null);
    setUploadDocumentRemarks("");
    setUploadDocumentRemarks("");
    setUploadedFiles([]);
    setUploadedDocuments([]);
    setTeaTypeIdError("");
    setSubTeaTypeCodeError("");
    setSubTeaTypeNameError("");
  };
  // Function to handle edit button click
  const handleEditClick = (subTeaTypeId) => {
    dispatch(getSubTeaTypeById(subTeaTypeId));
    // setExpanded("panel1");
    setEditModal(true);
  };

  useEffect(() => {
    if (editingSubTeaTypeDataFromId) {
      setEditingSubTeaTypeData(editingSubTeaTypeDataFromId);
      setSubTeaTypeName(editingSubTeaTypeDataFromId.subTeaTypeName || "");
      setSubTeaTypeCode(editingSubTeaTypeDataFromId.subTeaTypeCode || "");
      setTeaTypeId(editingSubTeaTypeDataFromId.teaTypeId || "");
      setUploadDocumentRemarks(
        editingSubTeaTypeDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingSubTeaTypeDataFromId.downloadDto || []);
    } else {
      // setEditingSubTeaTypeData(null);
      // dispatch(getAllSubTeaTypes()); // Dispatch the action to fetch data
      // dispatch(getAllTeaTypes());
    }
  }, [editingSubTeaTypeDataFromId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // pageNo = 1;
      // dispatch(
      //   searchSubTeaType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      // );
      clearSearch();
      setViewMode(false);
      dispatch(getSubTeaTypeByIdSuccess([]));
      setEditingSubTeaTypeData(null);

      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsSubTeaTypeAction());
      setViewMode(false);
      dispatch(getSubTeaTypeByIdSuccess([]));
      setEditingSubTeaTypeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getSubTeaTypeByIdSuccess([]));
      setEditingSubTeaTypeData(null);
      resetForm();
    }
  };

  let createData = useSelector(
    (state) => state.subTeaType.createEditSubTeaTypeApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditSubTeaTypeApiStatus(false));
      resetForm();
      setExpanded("panel2");
      dispatch(getSubTeaTypeByIdSuccess([]));
      setEditingSubTeaTypeData(null);

      setEditModal(false);
      setViewModal(false);
    }
  });

  const getAllUploadedDoc = useSelector(
    (state) => state.subTeaType.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(getAllSubTeaType || getSearchSubTeaType);
  useEffect(() => {
    if (getAllSubTeaTypesData) {
      setGetAllSubTeaType(getAllSubTeaTypesData);
      setRows(getAllSubTeaTypesData); // Update rows with the initial data
    }
  }, [getAllSubTeaTypesData]);
  // useEffect(() => {
  //   const newRows = searchSubTeatypeData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [searchSubTeatypeData]);
  // useEffect(() => {
  //   const newRows = searchSubTeatypeData || [];
  //   setRows((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
  // }, [searchSubTeatypeData]);
  useEffect(() => {
    const newRows = searchSubTeatypeData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.subTeaTypeId === newRow.subTeaTypeId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [searchSubTeatypeData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "subTeaTypeName",
      title: "Sub Tea Type Name",
    },
    {
      name: "subTeaTypeCode",
      title: "Sub Tea Type Code",
    },
    {
      name: "teaTypeName",
      title: "Tea Type Name",
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

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      subTeaTypeId: searchSubTeaTypeCode,
      subTeaTypeName: searchSubTeaTypeName,
      teaTypeId: searchTeaTypeId,
      isActive,
      url: "/admin/subTeaType/search",
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
        Base64ToExcelDownload(getExportDataResponse, "SubTeaTypeDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "SubTeaTypeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  function StatusData(data) {
    const handleSwitchChange = () => {
      let searchData = {
        subTeaTypeId: searchSubTeaTypeCode,
        subTeaTypeName: searchSubTeaTypeName,
        teaTypeId: searchTeaTypeId,
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
        dispatch(updateSubTeaType(updatedData));
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
                id={`customSwitch${data.data.subTeaTypeId}`} // Use a unique ID for each switch
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange} // Call the handler on
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.subTeaTypeId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.subTeaTypeId}`}
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
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_SubTeaType";
    const moduleName = "SubTeaType";
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
                onClick={() => handleEditClick(data.data.subTeaTypeId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.subTeaTypeId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.subTeaTypeId);
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
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
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
    // dispatch(
    //   searchSubTeaType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
    // );
    clearSearch();
    setViewMode(false);
    dispatch(getSubTeaTypeByIdSuccess([]));
    setEditingSubTeaTypeData(null);

    resetForm();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    //Serch API call
    pageNo = 1;
    // dispatch(
    //   searchSubTeaType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
    // );
    clearSearch();
    setViewMode(false);
    dispatch(getSubTeaTypeByIdSuccess([]));
    setEditingSubTeaTypeData(null);

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
            <Typography>Create Sub Tea Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Sub Tea Type Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          // value={subTeaTypeName}
                          // onChange={(e) => setSubTeaTypeName(e.target.value)}
                          value={
                            editingSubTeaTypeData?.subTeaTypeName ||
                            subTeaTypeName
                          }
                          maxLength="50"
                          onChange={(e) =>
                            !viewMode &&
                            (editingSubTeaTypeData
                              ? setEditingSubTeaTypeData({
                                  ...editingSubTeaTypeData,
                                  subTeaTypeName: e.target.value,
                                })
                              : setSubTeaTypeName(e.target.value))
                          }
                        />
                        {subTeaTypeNameError && (
                          <p className="errorLabel">{subTeaTypeNameError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Sub Tea Type Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="10"
                          // value={subTeaTypeCode}
                          // onChange={(e) => setSubTeaTypeCode(e.target.value)}
                          value={
                            editingSubTeaTypeData?.subTeaTypeCode ||
                            subTeaTypeCode
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingSubTeaTypeData
                              ? setEditingSubTeaTypeData({
                                  ...editingSubTeaTypeData,
                                  subTeaTypeCode: e.target.value,
                                })
                              : setSubTeaTypeCode(e.target.value))
                          }
                        />
                        {subTeaTypeCodeError && (
                          <p className="errorLabel">{subTeaTypeCodeError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea Type Name</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          // value={teaTypeId}
                          // onChange={(e) => setTeaTypeId(e.target.value)}
                          value={editingSubTeaTypeData?.teaTypeId || teaTypeId}
                          onChange={(e) =>
                            !viewMode &&
                            (editingSubTeaTypeData
                              ? setEditingSubTeaTypeData({
                                  ...editingSubTeaTypeData,
                                  teaTypeId: e.target.value,
                                })
                              : setTeaTypeId(e.target.value))
                          }
                        >
                          <option value="">Select Tea Type</option>
                          {isActiveTeaData?.map((state) => (
                            <option
                              key={state.teaTypeId}
                              value={state.teaTypeId}
                            >
                              {state.teaTypeName}
                            </option>
                          ))}
                        </select>
                        {teaTypeIdError && (
                          <p className="errorLabel">{teaTypeIdError}</p>
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
                            inputId="subTypeUpload"
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
          title={"Edit Sub Tea Type"}
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
                    <label>Sub Tea Type Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      // value={subTeaTypeName}
                      // onChange={(e) => setSubTeaTypeName(e.target.value)}
                      value={
                        editingSubTeaTypeData?.subTeaTypeName || subTeaTypeName
                      }
                      maxLength="50"
                      onChange={(e) =>
                        !viewMode &&
                        (editingSubTeaTypeData
                          ? setEditingSubTeaTypeData({
                              ...editingSubTeaTypeData,
                              subTeaTypeName: e.target.value,
                            })
                          : setSubTeaTypeName(e.target.value))
                      }
                    />
                    {subTeaTypeNameError && (
                      <p className="errorLabel">{subTeaTypeNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Sub Tea Type Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      // value={subTeaTypeCode}
                      // onChange={(e) => setSubTeaTypeCode(e.target.value)}
                      value={
                        editingSubTeaTypeData?.subTeaTypeCode || subTeaTypeCode
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingSubTeaTypeData
                          ? setEditingSubTeaTypeData({
                              ...editingSubTeaTypeData,
                              subTeaTypeCode: e.target.value,
                            })
                          : setSubTeaTypeCode(e.target.value))
                      }
                    />
                    {subTeaTypeCodeError && (
                      <p className="errorLabel">{subTeaTypeCodeError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Tea Type Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      // value={teaTypeId}
                      // onChange={(e) => setTeaTypeId(e.target.value)}
                      value={editingSubTeaTypeData?.teaTypeId || teaTypeId}
                      onChange={(e) =>
                        !viewMode &&
                        (editingSubTeaTypeData
                          ? setEditingSubTeaTypeData({
                              ...editingSubTeaTypeData,
                              teaTypeId: e.target.value,
                            })
                          : setTeaTypeId(e.target.value))
                      }
                    >
                      <option value="">Select Tea Type</option>
                      {isActiveTeaData?.map((state) => (
                        <option key={state.teaTypeId} value={state.teaTypeId}>
                          {state.teaTypeName}
                        </option>
                      ))}
                    </select>
                    {teaTypeIdError && (
                      <p className="errorLabel">{teaTypeIdError}</p>
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
                        inputId="subTypeUpload"
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
          title={"View Sub Tea Type"}
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
                    <label>Sub Tea Type Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      // value={subTeaTypeName}
                      // onChange={(e) => setSubTeaTypeName(e.target.value)}
                      value={
                        editingSubTeaTypeData?.subTeaTypeName || subTeaTypeName
                      }
                      maxLength="50"
                      disabled={viewMode}
                    />
                    {subTeaTypeNameError && (
                      <p className="errorLabel">{subTeaTypeNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Sub Tea Type Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      // value={subTeaTypeCode}
                      // onChange={(e) => setSubTeaTypeCode(e.target.value)}
                      value={
                        editingSubTeaTypeData?.subTeaTypeCode || subTeaTypeCode
                      }
                      disabled={viewMode}
                    />
                    {subTeaTypeCodeError && (
                      <p className="errorLabel">{subTeaTypeCodeError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Tea Type Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      // value={teaTypeId}
                      // onChange={(e) => setTeaTypeId(e.target.value)}
                      value={editingSubTeaTypeData?.teaTypeId || teaTypeId}
                      disabled={viewMode}
                    >
                      <option value="">Select Tea Type</option>
                      {isActiveTeaData?.map((state) => (
                        <option key={state.teaTypeId} value={state.teaTypeId}>
                          {state.teaTypeName}
                        </option>
                      ))}
                    </select>
                    {teaTypeIdError && (
                      <p className="errorLabel">{teaTypeIdError}</p>
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
            <Typography>Manage Sub Tea Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Sub Tea Type Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchSubTeaTypeName}
                          onChange={(e) =>
                            setSearchSubTeaTypeName(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Sub Tea Type Code</label>
                        <select
                          className="form-control select-form"
                          value={searchSubTeaTypeCode}
                          onChange={(e) =>
                            setSearchSubTeaTypeCode(e.target.value)
                          }
                        >
                          <option value="">Select Sub Tea Type Code</option>
                          {searchSubTeatypeData?.map((state) => (
                            <option
                              key={state.subTeaTypeId}
                              value={state.subTeaTypeId}
                            >
                              {state.subTeaTypeCode}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea Type Name</label>
                        <select
                          className="form-control select-form"
                          value={searchTeaTypeId}
                          onChange={(e) => setSearchTeaTypeId(e.target.value)}
                        >
                          <option value="">Select Tea Type Name</option>
                          {allTeaType?.map((state) => (
                            <option
                              key={state.teaTypeId}
                              value={state.teaTypeId}
                            >
                              {state.teaTypeName}
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
                      searchSubTeatypeData && searchSubTeatypeData.length < 19
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
                    title: "Sub Tea Type Name",
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
      {/* preview */}
      {previewDocumentContent != "" && "preview" == documentMode ? (
        <Modals
          title={"Sub Tea Type"}
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

export default CreateSubTeaType;
