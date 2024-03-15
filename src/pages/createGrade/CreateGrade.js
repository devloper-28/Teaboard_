import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import Modals from "../../components/common/Modal";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Checkbox,
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
  getAllGrades,
  createGrade,
  updateGrade,
  getGradeById,
  searchGrade,
  uploadAllDocumentsGradeAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getGradeByIdSuccess,
  createEditGradeApiStatus,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  getAllAuctionCenterAscAction,
  getDocumentByIdActionSuccess,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { useNavigate } from "react-router-dom";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import CustomToast from "../../components/Toast";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

let pageNo = 1;
function CreateGrade({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [gradeName, setGradeName] = useState("");
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const [gradeCode, setGradeCode] = useState("");
  const [editingGradeData, setEditingGradeData] = useState(null);

  const [getSearchGrade, setGetSearchGrade] = useState([]);
  const [getAllGradeList, setGetAllGradeList] = useState([]);

  // New state variables for search parameters
  const [searchGradeName, setSearchGradeName] = useState("");
  const [searchGradeCode, setSearchGradeCode] = useState("");
  const [isActive, setIsActive] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [gradeNameError, setGradeNameError] = useState("");
  const [gradeCodeError, setGradeCodeError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [documentMode, setDocumentmode] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [exportType, setexportType] = useState("");
  const [onChangesAuctionCenterId, setOnChangeAuctionCenterId] = useState([]);
  const [auctionCenterId, setauctionCenterId] = useState([]);

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

  const getAllGrade = useSelector(
    (state) => state.gradeManage.allGrades.responseData
  );
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
  const isActiveData =
    getAllGrade && getAllGrade.filter((data) => 1 == data.isActive);

  const editingGradeDataFromId = useSelector(
    (state) => state.gradeManage.grade.responseData
  );
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchGrade({
        gradeName: searchGradeName,
        gradeId: searchGradeCode,
        auctionCenterId: auctionCenterId,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchGrade({
        gradeName: searchGradeName,
        gradeId: searchGradeCode,
        auctionCenterId: auctionCenterId,
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
    setSearchGradeName("");
    setSearchGradeCode("");
    setIsActive("");
    setRows([]);
    pageNo = 1;
    setauctionCenterId([]);
    setOnChangeAuctionCenterId([]);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(searchGrade({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    }, 1000);
  };

  const searchGradeData = useSelector(
    (state) => state.gradeManage.searchResults.responseData
  );

  const resetForm = () => {
    setGradeName("");
    setGradeCode("");
    setEditingGradeData(null);
    setUploadDocumentRemarks("");
    setUploadedDocuments([]);
    setGradeNameError("");
    setGradeCodeError("");
    setUploadDocumentError("");
    setRemarksError("");
    setUploadedFiles([]);
    setauctionCenterId([]);
    setOnChangeAuctionCenterId([]);
    const inputElement = document.getElementById("gradeUpload");
    if (inputElement) {
      inputElement.value = "";
    }
  };
  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const validateForm = () => {
    let isValid = true;

    if (!gradeName.trim()) {
      CustomToast.error("Please enter the grade name");
      isValid = false;
      return;
    } else {
      setGradeNameError("");
    }

    if (!gradeCode) {
      CustomToast.error("Please enter the grade code");
      isValid = false;
      return;
    } else {
      setGradeCodeError("");
    }

    if (
      auctionCenterId &&
      auctionCenterId.length &&
      auctionCenterId.length == 0
    ) {
      CustomToast.error(
        "Please select at least one value from Auction centre list box"
      );
      isValid = false;
      return;
    }

    // if (!editingGradeData) {
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

  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (gradeId) => {
    dispatch(getGradeById(gradeId));
    setViewMode(true);
    // setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
    setViewModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const gradeData = {
        gradeName: gradeName,
        gradeCode: gradeCode,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
        auctionCenterId: auctionCenterId,
        searchData: {
          pageNo: 1,
          noOfRecords: NO_OF_RECORDS,
        },
        searchasd: {
          sortBy: "asc",
          sortColumn: "gradeCode",
        },
      };
      try {
        if (editingGradeData) {
          const isFormModified =
            gradeName !== editingGradeData?.gradeName ||
            gradeCode !== editingGradeData?.gradeCode ||
            uploadDocumentRemarks !== editingGradeData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingGradeData?.downloadDto || []).length;
          if (isFormModified) {
            let records = pageNo * NO_OF_RECORDS;
            editingGradeData.searchData = {
              pageNo: 1,
              noOfRecords: records + "",
            };
            editingGradeData.searchasd = {
              sortBy: "asc",
              sortColumn: "gradeCode",
            };
            editingGradeData.uploadDocumentRemarks = uploadDocumentRemarks;
            editingGradeData.downloadDto = uploadedDocuments;
            editingGradeData.auctionCenterId = auctionCenterId;

            setLoader(true);
            setTimeout(() => {
              setLoader(false);
              setRows([]);
              dispatch(updateGrade(editingGradeData));
            }, 1000);
          } else {
          }
        } else {
          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(createGrade(gradeData));
          }, 1000);
        }
      } catch (e) {}
    }
  };

  // Function to handle edit button click
  const handleEditClick = (gradeId) => {
    dispatch(getGradeById(gradeId));
    // setExpanded("panel1");
    setEditModal(true);
  };

  useEffect(() => {
    if (editingGradeDataFromId) {
      setEditingGradeData(editingGradeDataFromId);
      setGradeName(editingGradeDataFromId.gradeName || "");
      setGradeCode(editingGradeDataFromId.gradeCode || "");
      setUploadDocumentRemarks(
        editingGradeDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingGradeDataFromId.downloadDto || []);

      let tempDataNo = [];
      editingGradeDataFromId.auctionCenterId &&
        editingGradeDataFromId.auctionCenterId.map(
          (auctionCenterData, auctioncenterIndex) => {
            tempDataNo.push(auctionCenterData.auctionCenterId);
          }
        );

      let tempDataJsons = [];
      let tempDataName = [];
      getAllAuctionCenter &&
        getAllAuctionCenter.map((auctionCenterData, auctioncenterIndex) => {
          if (tempDataNo.includes(auctionCenterData.auctionCenterId)) {
            tempDataJsons.push(auctionCenterData);
            tempDataName.push(auctionCenterData.auctionCenterName.toString());
          }
        });

      setOnChangeAuctionCenterId(tempDataName);
      setauctionCenterId(tempDataJsons);
    }
  }, [editingGradeDataFromId]);
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingGradeDataFromId && editingGradeDataFromId.gradeId;
    let searchData = {
      url: `/admin/grade/get/${id}/${exportType}`,
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
        Base64ToExcelDownload(getExportViewDataResponse, "GradeDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "GradeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      pageNo = 1;
      dispatch(searchGrade({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
      //Get All grade
      dispatch(getAllGrades());
      // clearSearch();
      setViewMode(false);
      dispatch(getGradeByIdSuccess([]));
      setEditingGradeData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsGradeAction());
      setViewMode(false);
      dispatch(getGradeByIdSuccess([]));
      setEditingGradeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getGradeByIdSuccess([]));
      setEditingGradeData(null);
      resetForm();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.gradeManage.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(getSearchGrade || getAllGradeList);
  // useEffect(() => {
  //   if (searchGradeData != null && searchGradeData != undefined) {
  //     setGetSearchGrade(searchGradeData);
  //     setRows(searchGradeData); // Update rows with the search data
  //   } else {
  //     setGetSearchGrade([]);
  //     setRows([]); // Update rows with the search data
  //   }
  // }, [searchGradeData]);
  // useEffect(() => {
  //   const newRows = searchGradeData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [searchGradeData]);

  useEffect(() => {
    const newRows = searchGradeData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.gradeId === newRow.gradeId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [searchGradeData]);

  let createData = useSelector(
    (state) => state.gradeManage.createEditGradeApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditGradeApiStatus(false));
      setExpanded("panel2");
      resetForm();
      clearSearch();
      dispatch(getGradeByIdSuccess([]));
      setEditingGradeData(null);
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
      name: "gradeName",
      title: "Grade Name",
    },
    {
      name: "gradeCode",
      title: "Grade Code",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center",
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

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      gradeName: searchGradeName,
      gradeId: searchGradeCode,
      isActive,
      url: "/admin/grade/search",
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
        Base64ToExcelDownload(getExportDataResponse, "GradeDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "GradeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

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
    const tableName = "tbl_Grade";
    const moduleName = "Grade";
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
                onClick={() => handleEditClick(data.data.gradeId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.gradeId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="Hostory" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.gradeId);
                }}
              ></i>
            </Tooltip>
          )}
        </div>
      </>
    );
  }
  function StatusData(data) {
    const handleSwitchChange = () => {
      let searchData = {
        gradeName: searchGradeName,
        gradeId: searchGradeCode,
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
        dispatch(updateGrade(updatedData));
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
                id={`customSwitch${data.data.gradeId}`} // Use a unique ID for each switch
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange} // Call the handler on
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.gradeId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.gradeId}`}
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

  useEffect(() => {
    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
      })
    );
  }, []);

  const getAllAuctionCenterResponse = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const handleAuctionCenter = (event, fromManage) => {
    console.log("event 588", event);
    const {
      target: { value, id },
    } = event;
    let tempData = typeof value === "string" ? value.split(",") : value;
    setOnChangeAuctionCenterId(tempData);

    let tempDataJsons = [];

    if (fromManage) {
      getAllAuctionCenterResponse &&
        getAllAuctionCenterResponse.map(
          (auctionCenterData, auctioncenterIndex) => {
            if (tempData.includes(auctionCenterData.auctionCenterName)) {
              tempDataJsons.push(auctionCenterData);
            }
          }
        );
    } else {
      getAllAuctionCenter &&
        getAllAuctionCenter.map((auctionCenterData, auctioncenterIndex) => {
          if (tempData.includes(auctionCenterData.auctionCenterName)) {
            tempDataJsons.push(auctionCenterData);
          }
        });
    }

    setauctionCenterId(tempDataJsons);
  };

  const handleCloseViewModal = () => {
    setViewModal(false);
    //Serch API call
    dispatch(searchGrade({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    //Get All grade
    dispatch(getAllGrades());
    // clearSearch();
    setViewMode(false);
    dispatch(getGradeByIdSuccess([]));
    setEditingGradeData(null);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    //Serch API call
    dispatch(searchGrade({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    //Get All grade
    dispatch(getAllGrades());
    // clearSearch();
    setViewMode(false);
    dispatch(getGradeByIdSuccess([]));
    setEditingGradeData(null);
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
            <Typography>Create Grade</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Grade Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          value={editingGradeData?.gradeName || gradeName}
                          onChange={(e) =>
                            !viewMode &&
                            (editingGradeData
                              ? setEditingGradeData({
                                  ...editingGradeData,
                                  gradeName: e.target.value,
                                })
                              : setGradeName(e.target.value))
                          }
                        />
                        {gradeNameError && (
                          <p className="errorLabel">{gradeNameError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Grade Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="10"
                          // value={gradeCode}
                          // onChange={(e) => setGradeCode(e.target.value)}
                          value={editingGradeData?.gradeCode || gradeCode}
                          onChange={(e) =>
                            !viewMode &&
                            (editingGradeData
                              ? setEditingGradeData({
                                  ...editingGradeData,
                                  gradeCode: e.target.value,
                                })
                              : setGradeCode(e.target.value))
                          }
                        />
                        {gradeCodeError && (
                          <p className="errorLabel">{gradeCodeError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FomrGroup">
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>

                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={onChangesAuctionCenterId}
                          onChange={(event) =>
                            handleAuctionCenter(event, false)
                          }
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(", ")}
                          className="w-100"
                        >
                          {getAllAuctionCenter?.map((AuctionCenter) => (
                            <MenuItem
                              key={AuctionCenter.auctionCenterId}
                              value={AuctionCenter.auctionCenterName}
                            >
                              <Checkbox
                                checked={
                                  onChangesAuctionCenterId.indexOf(
                                    AuctionCenter.auctionCenterName
                                  ) > -1
                                }
                              />
                              <ListItemText
                                primary={AuctionCenter.auctionCenterName}
                              />
                            </MenuItem>
                          ))}
                        </Select>
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
                            inputId="gradeUpload"
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
          title={"Edit Grade"}
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
                    <label>Grade Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingGradeData?.gradeName || gradeName}
                      onChange={(e) =>
                        !viewMode &&
                        (editingGradeData
                          ? setEditingGradeData({
                              ...editingGradeData,
                              gradeName: e.target.value,
                            })
                          : setGradeName(e.target.value))
                      }
                    />
                    {gradeNameError && (
                      <p className="errorLabel">{gradeNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Grade Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      // value={gradeCode}
                      // onChange={(e) => setGradeCode(e.target.value)}
                      value={editingGradeData?.gradeCode || gradeCode}
                      onChange={(e) =>
                        !viewMode &&
                        (editingGradeData
                          ? setEditingGradeData({
                              ...editingGradeData,
                              gradeCode: e.target.value,
                            })
                          : setGradeCode(e.target.value))
                      }
                    />
                    {gradeCodeError && (
                      <p className="errorLabel">{gradeCodeError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FomrGroup">
                    <label>Auction Center</label>
                    <label className="errorLabel"> * </label>

                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={onChangesAuctionCenterId}
                      onChange={(event) => handleAuctionCenter(event, false)}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => selected.join(", ")}
                      className="w-100"
                    >
                      {getAllAuctionCenter?.map((AuctionCenter) => (
                        <MenuItem
                          key={AuctionCenter.auctionCenterId}
                          value={AuctionCenter.auctionCenterName}
                        >
                          <Checkbox
                            checked={
                              onChangesAuctionCenterId.indexOf(
                                AuctionCenter.auctionCenterName
                              ) > -1
                            }
                          />
                          <ListItemText
                            primary={AuctionCenter.auctionCenterName}
                          />
                        </MenuItem>
                      ))}
                    </Select>
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
                        inputId="gradeUpload"
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
          title={"View Grade"}
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
                    <label>Grade Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingGradeData?.gradeName || gradeName}
                      disabled={viewMode}
                    />
                    {gradeNameError && (
                      <p className="errorLabel">{gradeNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Grade Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={editingGradeData?.gradeCode || gradeCode}
                      disabled={viewMode}
                    />
                    {gradeCodeError && (
                      <p className="errorLabel">{gradeCodeError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FomrGroup">
                    <label>Auction Center</label>
                    <label className="errorLabel"> * </label>

                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={onChangesAuctionCenterId}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => selected.join(", ")}
                      disabled={viewMode}
                      className="w-100"
                    >
                      {getAllAuctionCenter?.map((AuctionCenter) => (
                        <MenuItem
                          key={AuctionCenter.auctionCenterId}
                          value={AuctionCenter.auctionCenterName}
                        >
                          <Checkbox
                            checked={
                              onChangesAuctionCenterId.indexOf(
                                AuctionCenter.auctionCenterName
                              ) > -1
                            }
                          />
                          <ListItemText
                            primary={AuctionCenter.auctionCenterName}
                          />
                        </MenuItem>
                      ))}
                    </Select>
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
            <Typography>Manage Grade</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Grade Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchGradeName}
                          onChange={(e) => setSearchGradeName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Grade Code</label>
                        <select
                          className="form-control select-form"
                          value={searchGradeCode}
                          onChange={(e) => setSearchGradeCode(e.target.value)}
                        >
                          <option value="">Select Grade Code </option>
                          {getAllGrade?.map((state) => (
                            <option key={state.gradeId} value={state.gradeId}>
                              {state.gradeCode}
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

                    <div className="col-md-4">
                      <div className="FomrGroup">
                        <label>Auction Center</label>

                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={onChangesAuctionCenterId}
                          onChange={(event) => handleAuctionCenter(event, true)}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(", ")}
                          disabled={viewMode}
                          className="w-100"
                        >
                          {getAllAuctionCenterResponse?.map((AuctionCenter) => (
                            <MenuItem
                              key={AuctionCenter.auctionCenterId}
                              value={AuctionCenter.auctionCenterName}
                            >
                              <Checkbox
                                checked={
                                  onChangesAuctionCenterId.indexOf(
                                    AuctionCenter.auctionCenterName
                                  ) > -1
                                }
                              />
                              <ListItemText
                                primary={AuctionCenter.auctionCenterName}
                              />
                            </MenuItem>
                          ))}
                        </Select>
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
                    disabled={searchGradeData && searchGradeData.length < 19}
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
                    title: "Grade Name",
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
          title={"Grade"}
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

export default CreateGrade;
