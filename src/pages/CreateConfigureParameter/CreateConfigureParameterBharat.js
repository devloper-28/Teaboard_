import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
//import { fetchGrade } from "../../store/actions"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import {
  getAllAuctionCenterAction,
  getAllAuctionCenterAscAction,
  getConfigParam,
  createConfigParamAction,
  updateConfigParamAction,
  getConfigParamByIdAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  uploadAllDocumentsConfigParamAction,
  getConfigParamByIdActionSuccess,
  createEditConfigureParameterApiStatus,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  getDocumentByIdActionSuccess,
} from "../../store/actions";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, Modal } from "react-bootstrap";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import $ from "jquery";
import CustomToast from "../../components/Toast";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";
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

function CreateConfigureParameter({ open, setOpen, modalRight }) {
  const getConfigParamData = useSelector(
    (state) => state?.configParam?.getConfigParam?.responseData
  );

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const dispatch = useDispatch();

  const [searchAuctionCenterName, setSearchAuctionCenterName] = useState("");
  const [documentMode, setDocumentmode] = useState("");
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const [cc, setcc] = useState("");
  const [loader, setLoader] = useState(false);
  const [auctionCenter, setauctionCenter] = useState("");
  const [cp, setcp] = useState("");
  const [bp, setbp] = useState("");
  const [sp, setsp] = useState("");
  const [ib, setib] = useState("");
  const [ccError, setccError] = useState("");
  const [auctionCenterError, setauctionCenterError] = useState("");
  const [cpError, setcpError] = useState("");
  const [bpError, setbpError] = useState("");
  const [spError, setspError] = useState("");
  const [ibError, setibError] = useState("");
  const [editingMode, seteditingMode] = useState(null);
  const [exportViewType, setexportViewType] = useState("");
  const navigate = useNavigate();
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showmodal, setShowmodal] = useState(false);
  const [isActive, setIsActive] = useState("");
  const [exportType, setexportType] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
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

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchStateAction({}));

      clearSearch();
      setViewMode(false);
      dispatch(getConfigParamByIdActionSuccess([]));
      seteditingMode(null);
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsConfigParamAction());
      setViewMode(false);
      dispatch(getConfigParamByIdActionSuccess([]));
      seteditingMode(null);
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getConfigParamByIdActionSuccess([]));
      seteditingMode(null);
      clearSearch();
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
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      getConfigParam({
        auctionCenterId: searchAuctionCenterName,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      getConfigParam({
        auctionCenterId: searchAuctionCenterName,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };

  const handleSearch = () => {
    setViewMode(false);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      pageNo = 1;
      setRows([]);
      fetchData();
    }, 1000);
  };

  const clearSearch = () => {
    setccError("");
    setcpError("");
    setbpError("");
    setspError("");
    setibError("");
    setauctionCenterError("");
    setSearchAuctionCenterName("");
    setcc("");
    setcp("");
    setbp("");
    setsp("");
    setib("");
    pageNo = 1;
    setRows([]);
    setauctionCenter("");
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(getConfigParam({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    }, 1000);

    setIsActive("");
    seteditingMode(null);
    setUploadDocumentRemarks("");
    setUploadedFiles([]);
    setUploadedDocuments([]);
    const inputElement = document.getElementById("configureParameterUpload");
    if (inputElement) {
      inputElement.value = "";
    }
  };
  const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   if (getConfigParamData != null && getConfigParamData != undefined) {
  //     setRows(getConfigParamData);
  //   } else {
  //     setRows([]);
  //   }
  // }, [getConfigParamData]);
  // useEffect(() => {
  //   const newRows = getConfigParamData || [];
  //   setRows((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
  // }, [getConfigParamData]);
  useEffect(() => {
    const newRows = getConfigParamData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.configParaId === newRow.configParaId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [getConfigParamData]);

  useEffect(() => {
    const newRows = getConfigParamData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.configParaId === newRow.configParaId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [getConfigParamData]);

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
      name: "catalogClosingDay",
      title: "Catalog Closing in Days",
    },
    {
      name: "catalogPublishingDay",
      title: "Catalog Publishing in Days",
    },
    {
      name: "buyersPromptDays",
      title: "Buyer's Prompt in Days",
    },
    {
      name: "sellersPromptDay",
      title: "Seller's Prompt in Days",
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
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id =
      editingConfigParamDataFromState &&
      editingConfigParamDataFromState.configParaId;
    let searchData = {
      url: `/admin/ConfigureParameter/get/${id}/${exportType}`,
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
          "ConfigureParameterDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "ConfigureParameterDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleSubmit = async (e) => {
    setccError("");
    setcpError("");
    setbpError("");
    setspError("");
    setibError("");
    setauctionCenterError("");
    e.preventDefault();
    let isValid = true;
    if (!cc) {
      CustomToast.error("Please enter the catalog closing days");
      isValid = false;
      return;
    } else {
      setccError("");
    }
    if (!cp) {
      CustomToast.error("Please enter the catalog publishing days");
      isValid = false;
      return;
    } else {
      setcpError("");
    }
    if (!bp) {
      CustomToast.error("Please enter the buyer's prompt days");
      isValid = false;
      return;
    } else {
      setbpError("");
    }
    if (!sp) {
      CustomToast.error("Please enter the seller's prompt days");
      isValid = false;
      return;
    } else {
      setspError("");
    }
    if (!ib) {
      CustomToast.error("Please enter the interval between auction sessions");
      isValid = false;
      return;
    } else {
      setibError("");
    }
    if (!auctionCenter) {
      CustomToast.error("Please select an auction center from the list");
      isValid = false;
      return;
    } else {
      setccError("");
    }

    if (parseInt(cc) > parseInt(cp)) {
      CustomToast.error(
        "Please enter catalog publish day shoud be greater than catalog Closing Day"
      );
      isValid = false;
      return;
    } else {
      setcpError("");
    }
    if (parseInt(cp) < parseInt(cc)) {
      CustomToast.error(
        "Catalog Closing Day shoud be Less than catalog Publish Day"
      );
      isValid = false;
      return;
    } else {
      setccError("");
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

    if (!isValid) {
      return;
    }

    const dataForSubmit = {
      auctionCenterId: auctionCenter,
      catalogClosingDay: cc,
      catalogPublishingDay: cp,
      buyersPromptDays: bp,
      sellersPromptDay: sp,
      intervalMin: ib,
      isActive: 1,
      uploadDocumentRemarks: uploadDocumentRemarks,
      downloadDto: uploadedDocuments,
      searchData: {
        pageNo: 1,
        noOfRecords: NO_OF_RECORDS,
      },
    };
    try {
      if (editingMode) {
        editingMode.searchData = {
          auctionCenterId: searchAuctionCenterName,
          isActive,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        };
        editingMode.uploadDocumentRemarks = uploadDocumentRemarks;
        editingMode.downloadDto = uploadedDocuments;
        editingMode.auctionTypeMasterId = 1;

        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          setRows([]);
          dispatch(updateConfigParamAction(editingMode));
        }, 1000);
      } else {
        dataForSubmit.auctionTypeMasterId = 1;
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          setRows([]);
          dispatch(createConfigParamAction(dataForSubmit));
        }, 1000);
      }
    } catch (error) {
      console.log("Update or create failed");
    }
  };

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      auctionCenterId: searchAuctionCenterName,
      isActive: isActive != "" ? parseInt(isActive) : isActive,
      url: "/admin/ConfigureParameter/search",
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
          "ConfigureParameterDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "ConfigureParameterDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleEditClick = (configParamId) => {
    setccError("");
    setcpError("");
    setbpError("");
    setspError("");
    setibError("");
    setauctionCenterError("");
    setcc("");
    setcp("");
    setbp("");
    setsp("");
    setib("");
    setauctionCenter("");
    dispatch(getConfigParamByIdAction(configParamId));
    setViewMode(false);
    // setExpanded("panel1");
    setEditModal(true);
  };

  const editingConfigParamDataFromState = useSelector(
    (state) => state.configParam.ConfigParamData.responseData
  );

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_ConfigureParameter";
    const moduleName = "Configure Parameter";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const handleCloseHistory = () => setShowmodal(false);
  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

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
  const getAllUploadedDoc = useSelector(
    (state) => state.configParam.uploadedDocuments.responseData
  );

  const setValueWithPatterns = (data, val) => {
    if (data != null && data !== "") {
      if (data.toString().match(/^[0-9]*$/)) {
        let number = parseInt(data);
        if (number >= 0 && number < 99.9999999) {
          if (val === "cc") {
            setcc(data);
            setccError("");
          } else if (val === "cp") {
            setcp(data);
            setcpError("");
          } else if (val === "bp") {
            setbp(data);
            setbpError("");
          } else if (val === "sp") {
            setsp(data);
            setspError("");
          } else if (val === "ib") {
            if (number < 60) {
              setib(data);
              setibError("");
            } else {
              CustomToast.error(
                "Minimum value should be 1 minute and maximum value should be 60 minutes, as configured in the respective auction center."
              );
            }
          }
        }
      } else {
        handleValidationError(val);
      }
    } else {
      handleValidationError(val);
    }
  };

  const handleValidationError = (val) => {
    switch (val) {
      case "cc":
        CustomToast.error(
          "Please enter a numeric value for the catalog closing days."
        );
        break;
      case "cp":
        CustomToast.error(
          "Please enter a positive numeric value for the catalog publishing days."
        );
        break;
      case "bp":
        CustomToast.error(
          "Please enter a positive numeric value for the buyer's prompt days."
        );
        break;
      case "sp":
        CustomToast.error(
          "Please enter a positive numeric value for the seller's prompt days."
        );
        break;
      case "ib":
        CustomToast.error(
          "Please enter a numeric value for the interval between auction sessions."
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (editingConfigParamDataFromState) {
      setcc(editingConfigParamDataFromState.catalogClosingDay || "");
      setbp(editingConfigParamDataFromState.buyersPromptDays || "");
      setcp(editingConfigParamDataFromState.catalogPublishingDay || "");
      setib(editingConfigParamDataFromState.intervalMin || "");
      setsp(editingConfigParamDataFromState.sellersPromptDay || "");
      setauctionCenter(editingConfigParamDataFromState.auctionCenterId || "");
      setUploadDocumentRemarks(
        editingConfigParamDataFromState.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingConfigParamDataFromState.downloadDto || []);
      seteditingMode(editingConfigParamDataFromState);
    }
  }, [editingConfigParamDataFromState]);

  const [viewMode, setViewMode] = useState(false);
  const handleViewClick = (configParamId) => {
    setccError("");
    setcpError("");
    setbpError("");
    setspError("");
    setibError("");
    setauctionCenterError("");
    setcc("");
    setcp("");
    setbp("");
    setsp("");
    setib("");
    setauctionCenter("");
    dispatch(getConfigParamByIdAction(configParamId));
    setViewMode(true);
    // setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
    setViewModal("true");
  };

  function ActionData(data) {
    return (
      <>
        <div class="Action">
          {modalRight?.some((ele) => ele === "2") && (
            <Tooltip title="Edit" placement="top">
              <i
                className="fa fa-edit"
                onClick={() => handleEditClick(data.data.configParaId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.configParaId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.configParaId);
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
      // Move the creation of updatedData above its usage
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };

      let searchData = {
        auctionCenterId: searchAuctionCenterName,
        isActive,
        pageNo: updatedData.pageNo,
        noOfRecords: updatedData.noOfRecords,
      };

      updatedData.searchData = searchData;

      // Call the API to update the isActive status in the backend
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateConfigParamAction(updatedData));
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
                id={`customSwitch${data.data.configParaId}`}
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange}
              />
              <label
                class="custom-control-label"
                for={`customSwitch${data.data.configParaId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.configParaId}`}
          >
            {data.data.isActive === 1 ? "Active" : "Inactive"}
          </label>
        )}
      </>
    );
  }

  let createData = useSelector(
    (state) => state.configParam.createEditConfigureParameterApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditConfigureParameterApiStatus(false));
      setExpanded("panel2");
      // clearSearch();
      dispatch(getConfigParamByIdActionSuccess([]));
      seteditingMode(null);
      setEditModal(false);
      setViewModal(false);
    }
  });

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
  };
  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
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
    clearSearch();
    setViewMode(false);
    dispatch(getConfigParamByIdActionSuccess([]));
    seteditingMode(null);
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    clearSearch();
    setViewMode(false);
    dispatch(getConfigParamByIdActionSuccess([]));
    seteditingMode(null);
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
            <Typography>Create Configure Parameter</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingMode?.auctionCenterId || auctionCenter}
                          onChange={(e) =>
                            editingMode
                              ? seteditingMode({
                                  ...editingMode,
                                  auctionCenterId: e.target.value,
                                })
                              : setauctionCenter(e.target.value)
                          }
                        >
                          <option value={0}>Search Auction Center</option>
                          {getAllAuctionCenter?.map((state) => (
                            <option
                              key={state.auctionCenterName}
                              value={state.auctionCenterId}
                            >
                              {state.auctionCenterName}
                            </option>
                          ))}
                        </select>

                        {auctionCenterError && (
                          <p className="errorLabel" style={{ color: "red" }}>
                            {auctionCenterError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Catalog Closing in Days</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingMode?.catalogClosingDay || cc}
                          onChange={(e) =>
                            editingMode
                              ? seteditingMode({
                                  ...editingMode,
                                  catalogClosingDay: e.target.value,
                                })
                              : setValueWithPatterns(e.target.value, "cc")
                          }
                        />
                        {ccError && (
                          <p className="errorLabel" style={{ color: "red" }}>
                            {ccError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Catalog Publishing in Days</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          maxLength="2"
                          className="form-control"
                          value={editingMode?.catalogPublishingDay || cp}
                          onChange={(e) =>
                            editingMode
                              ? seteditingMode({
                                  ...editingMode,
                                  catalogPublishingDay: e.target.value,
                                })
                              : setValueWithPatterns(e.target.value, "cp")
                          }
                        />
                        {cpError && (
                          <p className="errorLabel" style={{ color: "red" }}>
                            {cpError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer's Prompt in Days</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          maxLength="2"
                          className="form-control"
                          value={editingMode?.buyersPromptDays || bp}
                          onChange={(e) =>
                            editingMode
                              ? seteditingMode({
                                  ...editingMode,
                                  buyersPromptDays: e.target.value,
                                })
                              : setValueWithPatterns(e.target.value, "bp")
                          }
                        />
                        {bpError && (
                          <p className="errorLabel" style={{ color: "red" }}>
                            {bpError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Seller's Prompt in Days</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          maxLength="2"
                          className="form-control"
                          value={editingMode?.sellersPromptDay || sp}
                          onChange={(e) =>
                            editingMode
                              ? seteditingMode({
                                  ...editingMode,
                                  sellersPromptDay: e.target.value,
                                })
                              : setValueWithPatterns(e.target.value, "sp")
                          }
                        />
                        {spError && (
                          <p className="errorLabel" style={{ color: "red" }}>
                            {spError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>
                          Interval between two auction session in minutes
                        </label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          className="form-control"
                          value={editingMode?.intervalMin || ib}
                          onChange={(e) =>
                            editingMode
                              ? seteditingMode({
                                  ...editingMode,
                                  intervalMin: e.target.value,
                                })
                              : setValueWithPatterns(e.target.value, "ib")
                          }
                        />
                        {ibError && (
                          <p className="errorLabel" style={{ color: "red" }}>
                            {ibError}
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
                            inputId="configureParameterUpload"
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
                          onClick={clearSearch}
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
          title={"Edit Configure Parameter"}
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
                    <label>Auction Center</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingMode?.auctionCenterId || auctionCenter}
                      onChange={(e) =>
                        editingMode
                          ? seteditingMode({
                              ...editingMode,
                              auctionCenterId: e.target.value,
                            })
                          : setauctionCenter(e.target.value)
                      }
                    >
                      <option value={0}>Search Auction Center</option>
                      {getAllAuctionCenter?.map((state) => (
                        <option
                          key={state.auctionCenterName}
                          value={state.auctionCenterId}
                        >
                          {state.auctionCenterName}
                        </option>
                      ))}
                    </select>

                    {auctionCenterError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {auctionCenterError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Catalog Closing in Days</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingMode?.catalogClosingDay || cc}
                      onChange={(e) =>
                        editingMode
                          ? seteditingMode({
                              ...editingMode,
                              catalogClosingDay: e.target.value,
                            })
                          : setValueWithPatterns(e.target.value, "cc")
                      }
                    />
                    {ccError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {ccError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Catalog Publishing in Days</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      maxLength="2"
                      className="form-control"
                      value={editingMode?.catalogPublishingDay || cp}
                      onChange={(e) =>
                        editingMode
                          ? seteditingMode({
                              ...editingMode,
                              catalogPublishingDay: e.target.value,
                            })
                          : setValueWithPatterns(e.target.value, "cp")
                      }
                    />
                    {cpError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {cpError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Buyer's Prompt in Days</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      maxLength="2"
                      className="form-control"
                      value={editingMode?.buyersPromptDays || bp}
                      onChange={(e) =>
                        editingMode
                          ? seteditingMode({
                              ...editingMode,
                              buyersPromptDays: e.target.value,
                            })
                          : setValueWithPatterns(e.target.value, "bp")
                      }
                    />
                    {bpError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {bpError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Seller's Prompt in Days</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      maxLength="2"
                      className="form-control"
                      value={editingMode?.sellersPromptDay || sp}
                      onChange={(e) =>
                        editingMode
                          ? seteditingMode({
                              ...editingMode,
                              sellersPromptDay: e.target.value,
                            })
                          : setValueWithPatterns(e.target.value, "sp")
                      }
                    />
                    {spError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {spError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>
                      Interval between two auction session in minutes
                    </label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      value={editingMode?.intervalMin || ib}
                      onChange={(e) =>
                        editingMode
                          ? seteditingMode({
                              ...editingMode,
                              intervalMin: e.target.value,
                            })
                          : setValueWithPatterns(e.target.value, "ib")
                      }
                    />
                    {ibError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {ibError}
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
                        inputId="configureParameterUpload"
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
          title={"View Configure Parameter"}
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
                    <label>Auction Center</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingMode?.auctionCenterId || auctionCenter}
                      disabled={viewMode}
                    >
                      <option value={0}>Search Auction Center</option>
                      {getAllAuctionCenter?.map((state) => (
                        <option
                          key={state.auctionCenterName}
                          value={state.auctionCenterId}
                        >
                          {state.auctionCenterName}
                        </option>
                      ))}
                    </select>

                    {auctionCenterError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {auctionCenterError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Catalog Closing in Days</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingMode?.catalogClosingDay || cc}
                      disabled={viewMode}
                    />
                    {ccError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {ccError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Catalog Publishing in Days</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      maxLength="2"
                      className="form-control"
                      value={editingMode?.catalogPublishingDay || cp}
                      disabled={viewMode}
                    />
                    {cpError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {cpError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Buyer's Prompt in Days</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      maxLength="2"
                      className="form-control"
                      value={editingMode?.buyersPromptDays || bp}
                      disabled={viewMode}
                    />
                    {bpError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {bpError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Seller's Prompt in Days</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      maxLength="2"
                      className="form-control"
                      value={editingMode?.sellersPromptDay || sp}
                      disabled={viewMode}
                    />
                    {spError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {spError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>
                      Interval between two auction session in minutes
                    </label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      value={editingMode?.intervalMin || ib}
                      disabled={viewMode}
                    />
                    {ibError && (
                      <p className="errorLabel" style={{ color: "red" }}>
                        {ibError}
                      </p>
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
            <Typography>Manage Configure Parameter</Typography>
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
                          <option value={0}>Search Auction Center</option>
                          {getAllAuctionCenterResponse?.map((state) => (
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
                  <button class="SubmitBtn" onClick={handleViewMore}>
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
                    title: "Auction Center Name",
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
          title={"Configure Parameter"}
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

export default CreateConfigureParameter;
