import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
//import { fetchGrade } from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, Modal } from "react-bootstrap";
import CustomToast from "../../components/Toast";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import {
  getMark,
  getMarkWithoutFilter,
  getDocumentByIdActionSuccess,
  getAllAuctionCenterAscAction,
  searchRevenueAction,
  createMarkAction,
  updateMarkAction,
  getFactory,
  getMarkByIdAction,
  getDocumentByIdAction,
  uploadAllDocumentsMarkAction,
  getHistoryByIdAction,
  createEditApiStatusMark,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
} from "../../store/actions";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
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

function CreateMark({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState("panel1");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [markName, setmarkName] = useState("");
  const [loader, setLoader] = useState(false);
  const [exportViewType, setexportViewType] = useState("");
  const [markCode, setmarkCode] = useState("");
  const [markNamecreate, setmarkNamecreate] = useState("");
  const [markCodecreate, setmarkCodecreate] = useState("");
  const [searchFactoryTypeId, setsearchFactoryTypeId] = useState("");
  const [auctionCenter, setauctionCenter] = useState("");
  const [plantation, setplantation] = useState("");
  const [stateName, setstateName] = useState("");
  const [plantationId, setplantationId] = useState("");
  const [stateId, setstateId] = useState("");
  const [revanue, setrevanue] = useState("");
  const [editingMarkData, setEditingMarkData] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [showmodal, setShowmodal] = useState(false);
  const [isActive, setIsActive] = useState("");
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

  const getAllAuctionCenter = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );
  const getMarkData = useSelector(
    (state) => state.markReducer.getMark.responseData
  );
  const getSelectWithoutFilterResponse = useSelector(
    (state) => state.markReducer.getMarkWithoutFilter.responseData
  );
  const [rows, setRows] = useState([]);
  const isActiveGetmarkCodeWithoutFilterData =
    getSelectWithoutFilterResponse &&
    getSelectWithoutFilterResponse?.filter((data) => 1 == data.isActive);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");

  // useEffect(() => {
  //   const newRows = getMarkData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [getMarkData]);

  useEffect(() => {
    const newRows = getMarkData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.markId === newRow.markId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [getMarkData]);

  useEffect(() => {
    dispatch(getFactory());
    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
      })
    );
    dispatch(searchRevenueAction({}));
    dispatch(getMarkWithoutFilter({ markName: markName, markId: markCode }));
    resetForm();
  }, []);

  const searchRevenueData = useSelector(
    (state) => state.Revanue.searchedRevenue.responseData
  );

  const activeSearchRevenueData =
    searchRevenueData && searchRevenueData.filter((data) => 1 == data.isActive);

  const getAllFactoryTypeData = useSelector(
    (state) => state.markReducer.factorydataSelect.responseData
  );
  const isActiveData =
    getAllFactoryTypeData &&
    getAllFactoryTypeData.filter((data) => 1 == data.isActive);

  const isActiveDataAuctionCenter =
    getAllAuctionCenter &&
    getAllAuctionCenter.filter((data) => 1 == data.isActive);

  const getAllUploadedDoc = useSelector(
    (state) => state.markReducer.uploadedDocuments.responseData
  );
  const handleChange = (panel) => (event, isExpanded) => {
    if ("panel2" == panel && isExpanded) {
      pageNo = 1;
      dispatch(getMark({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
      setViewMode(false);
      setEditingMarkData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsMarkAction());
      setViewMode(false);
      setEditingMarkData(null);
      resetForm();
    } else if ("panel1" == panel && isExpanded) {
      setViewMode(false);
      setEditingMarkData(null);
      resetForm();
    }
    setExpanded(isExpanded ? panel : false);
  };
  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      markName: markName,
      markId: markCode != "" ? parseInt(markCode) : markCode,
      isActive: isActive != "" ? parseInt(isActive) : isActive,
      url: "/admin/mark/search",
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
        Base64ToExcelDownload(getExportDataResponse, "MarkDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "MarkDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const resetForm = () => {
    setmarkCodecreate("");
    setmarkNamecreate("");
    setsearchFactoryTypeId("");
    setauctionCenter("");
    setrevanue("");
    setstateName("");
    setplantation("");
    setplantationId("");
    setstateId("");
    setEditingMarkData("");
    setViewMode(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = true;
    let mc =
      editingMarkData == null
        ? markCodecreate
        : editingMarkData.markCode
        ? editingMarkData.markCode
        : markCodecreate;
    let mn =
      editingMarkData == null
        ? markNamecreate
        : editingMarkData.markName
        ? editingMarkData.markName
        : markNamecreate;
    let fac =
      editingMarkData == null
        ? searchFactoryTypeId
        : editingMarkData.factoryId
        ? editingMarkData.factoryId
        : searchFactoryTypeId;
    let ac =
      editingMarkData == null
        ? auctionCenter
        : editingMarkData.auctionCenterId
        ? editingMarkData.auctionCenterId
        : auctionCenter;
    let rev =
      editingMarkData == null
        ? revanue
        : editingMarkData.revenueId
        ? editingMarkData.revenueId
        : revanue;

    if (!mn) {
      CustomToast.error("Please enter the Mark name");
      isValid = false;
      return;
    }
    if (!mc.trim()) {
      CustomToast.error("Please enter the Mark code");
      isValid = false;
      return;
    }
    if (!fac) {
      CustomToast.error("Please select factory name");
      isValid = false;
      return;
    }
    if (!ac || "0" == ac) {
      CustomToast.error("Please select an auction center from the list.");
      isValid = false;
      return;
    }
    if (!rev || "0" == rev) {
      CustomToast.error("Please select a Revenue District from the list.");
      isValid = false;
      return;
    }
    if (!isValid) {
      return;
    }
    if (editingMarkData) {
      editingMarkData.searchData = {
        markName: markName,
        markId: markCode !== "" ? parseInt(markCode) : markCode,
        isActive: isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };
      editingMarkData.uploadDocumentRemarks = uploadDocumentRemarks;
      editingMarkData.downloadDto = uploadedDocuments;

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setRows([]);
        dispatch(updateMarkAction(editingMarkData));
      }, 1000);
    } else {
      let dataForSubmit = {
        markName: mn,
        markCode: mc,
        factoryId: fac,
        auctionCenterId: ac,
        revenueId: rev,
        plantationId: plantationId,
        stateId: stateId,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        searchData: {
          pageNo: 1,
          noOfRecords: NO_OF_RECORDS,
        },
      };

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setRows([]);
        dispatch(createMarkAction(dataForSubmit));
      }, 1000);
    }
  };
  const editingDataFromApi = useSelector(
    (state) => state.markReducer.MarkData.responseData
  );

  useEffect(() => {
    if (editingDataFromApi) {
      let tempDataState =
        searchRevenueData &&
        searchRevenueData.filter(
          (data) => data.revenueId == editingDataFromApi.revenueId
        );
      let tempDataPlant =
        searchRevenueData &&
        searchRevenueData.filter(
          (data) => data.plantationId == editingDataFromApi.plantationId
        );
      setstateName(tempDataState[0].stateName);
      setplantation(tempDataState[0].plantationDistrictName);
      setplantationId(tempDataState[0].plantationId);
      setstateId(tempDataState[0].stateId);
      setEditingMarkData(editingDataFromApi);
    }
  }, [editingDataFromApi]);

  let createData = useSelector(
    (state) => state.markReducer.createEditApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiStatusMark(false));
      resetForm();
      setExpanded("panel2");
      setEditingMarkData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });

  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingDataFromApi && editingDataFromApi.markId;
    let searchData = {
      url: `/admin/mark/get/${id}/${exportType}`,
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
        Base64ToExcelDownload(getExportViewDataResponse, "MarkDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "MarkDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      getMark({
        markName: markName,
        markId: markCode != "" ? parseInt(markCode) : markCode,
        isActive: isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      getMark({
        markName: markName,
        markId: markCode !== "" ? parseInt(markCode) : markCode,
        isActive: isActive,
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
    setmarkName("");
    setmarkCode("");
    setIsActive("");
    setRows([]);
    pageNo = 1;
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(getMark({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    }, 1000);
  };
  const handleEditClick = (markId) => {
    dispatch(getMarkByIdAction(markId));
    setViewMode(false);
    // setExpanded("panel1");
    setEditModal(true);
  };
  const handleViewClick = (markId) => {
    dispatch(getMarkByIdAction(markId));
    setViewMode(true);
    // setExpanded("panel1");
    setViewModal(true);
  };
  const handlesStateNameChange = (e) => {
    editingMarkData
      ? setEditingMarkData({
          ...editingMarkData,
          revenueId: e.target.value,
        })
      : setrevanue(e.target.value);
    let plant = e.target.options[e.target.selectedIndex].id.split(",")[1];
    let state = e.target.options[e.target.selectedIndex].id.split(",")[0];
    let plantId = e.target.options[e.target.selectedIndex].id.split(",")[2];
    let stateId = e.target.options[e.target.selectedIndex].id.split(",")[3];
    setrevanue(e.target.value);
    setplantation(plant);
    setstateName(state);
    setplantationId(plantId);
    setstateId(stateId);
  };
  const getUploadedIdData = useSelector(
    (state) => state.documentReducer.documentData.responseData
  );
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
    resetForm();
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
  const handleDownloadClick = (uploadDocumentConfId, type) => {
    setDocumentmode(type);
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_Mark";
    const moduleName = "Mark";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };
  const handleCloseHistory = () => setShowmodal(false);
  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "markName",
      title: "Mark name",
    },
    {
      name: "markCode",
      title: "Mark Code",
    },
    {
      name: "factoryName",
      title: "Factory Name ",
    },
    {
      name: "entityCode",
      title: "Entity Code ",
    },
    {
      name: "revenueDistrictName",
      title: "Revenue District Name",
    },
    {
      name: "plantationDistrictName",
      title: "Plantation District label",
    },
    {
      name: "stateName",
      title: "State label",
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
                onClick={() => handleEditClick(data.data.markId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.markId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.markId);
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
      // Toggle isActive value when the switch is changed
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: {
          markName: markName,
          markId: markCode != "" ? parseInt(markCode) : markCode,
          isActive: isActive,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        },
      };
      // Call the API to update the isActive status in the backend

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateMarkAction(updatedData));
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
                id={`customSwitch${data.data.markId}`}
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange}
              />
              <label
                class="custom-control-label"
                for={`customSwitch${data.data.markId}`}
              >
                {data.data.isActive === 1 ? "Active" : "In-Active"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.markId}`}
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
    pageNo = 1;
    dispatch(getMark({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    setViewMode(false);
    setEditingMarkData(null);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    pageNo = 1;
    dispatch(getMark({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    setViewMode(false);
    setEditingMarkData(null);
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
            <Typography>Create Mark</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Mark Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="100"
                          value={editingMarkData?.markName || markNamecreate}
                          onChange={(e) =>
                            editingMarkData
                              ? setEditingMarkData({
                                  ...editingMarkData,
                                  markName: e.target.value,
                                })
                              : setmarkNamecreate(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Mark Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="10"
                          value={editingMarkData?.markCode || markCodecreate}
                          onChange={(e) =>
                            editingMarkData
                              ? setEditingMarkData({
                                  ...editingMarkData,
                                  markCode: e.target.value,
                                })
                              : setmarkCodecreate(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Factory </label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingMarkData?.factoryId || searchFactoryTypeId
                          }
                          onChange={(e) =>
                            editingMarkData
                              ? setEditingMarkData({
                                  ...editingMarkData,
                                  factoryId: e.target.value,
                                })
                              : setsearchFactoryTypeId(e.target.value)
                          }
                        >
                          <option value="">Select Factory</option>
                          {isActiveData?.map((state) => (
                            <option
                              key={state.factoryId}
                              value={state.factoryId}
                            >
                              {state.factoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingMarkData?.auctionCenterId || auctionCenter
                          }
                          onChange={(e) =>
                            editingMarkData
                              ? setEditingMarkData({
                                  ...editingMarkData,
                                  auctionCenterId: e.target.value,
                                })
                              : setauctionCenter(e.target.value)
                          }
                        >
                          <option value={0}>Search Auction Center</option>
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
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Revenue</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingMarkData?.revenueId || revanue}
                          onChange={(e) => handlesStateNameChange(e)}
                        >
                          <option value={0}>Select Revenue</option>
                          {activeSearchRevenueData?.map((state) => (
                            <option
                              id={
                                state.stateName +
                                "," +
                                state.plantationDistrictName +
                                "," +
                                state.plantationId +
                                "," +
                                state.stateId
                              }
                              value={state.revenueId}
                            >
                              {state.revenueDistrictName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          disabled="true"
                          value={stateName}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Plantation Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          disabled="true"
                          value={plantation}
                          className="form-control"
                        />
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
          title={"Edit mark"}
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
                    <label>Mark Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingMarkData?.markName || markNamecreate}
                      onChange={(e) =>
                        editingMarkData
                          ? setEditingMarkData({
                              ...editingMarkData,
                              markName: e.target.value,
                            })
                          : setmarkNamecreate(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Mark Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={editingMarkData?.markCode || markCodecreate}
                      onChange={(e) =>
                        editingMarkData
                          ? setEditingMarkData({
                              ...editingMarkData,
                              markCode: e.target.value,
                            })
                          : setmarkCodecreate(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Factory </label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingMarkData?.factoryId || searchFactoryTypeId}
                      onChange={(e) =>
                        editingMarkData
                          ? setEditingMarkData({
                              ...editingMarkData,
                              factoryId: e.target.value,
                            })
                          : setsearchFactoryTypeId(e.target.value)
                      }
                    >
                      <option value="">Select Factory</option>
                      {isActiveData?.map((state) => (
                        <option key={state.factoryId} value={state.factoryId}>
                          {state.factoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Auction Center</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingMarkData?.auctionCenterId || auctionCenter}
                      onChange={(e) =>
                        editingMarkData
                          ? setEditingMarkData({
                              ...editingMarkData,
                              auctionCenterId: e.target.value,
                            })
                          : setauctionCenter(e.target.value)
                      }
                    >
                      <option value={0}>Search Auction Center</option>
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
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Revenue</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingMarkData?.revenueId || revanue}
                      onChange={(e) => handlesStateNameChange(e)}
                    >
                      <option value={0}>Select Revenue</option>
                      {activeSearchRevenueData?.map((state) => (
                        <option
                          id={
                            state.stateName +
                            "," +
                            state.plantationDistrictName +
                            "," +
                            state.plantationId +
                            "," +
                            state.stateId
                          }
                          value={state.revenueId}
                        >
                          {state.revenueDistrictName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      disabled="true"
                      value={stateName}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Plantation Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      disabled="true"
                      value={plantation}
                      className="form-control"
                    />
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
          title={"View Mark"}
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
                    <label>Mark Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingMarkData?.markName || markNamecreate}
                      disabled={viewMode}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Mark Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={editingMarkData?.markCode || markCodecreate}
                      disabled={viewMode}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Factory </label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingMarkData?.factoryId || searchFactoryTypeId}
                      disabled={viewMode}
                    >
                      <option value="">Select Factory</option>
                      {isActiveData?.map((state) => (
                        <option key={state.factoryId} value={state.factoryId}>
                          {state.factoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Auction Center</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingMarkData?.auctionCenterId || auctionCenter}
                      disabled={viewMode}
                    >
                      <option value={0}>Search Auction Center</option>
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
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Revenue</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingMarkData?.revenueId || revanue}
                      disabled={viewMode}
                    >
                      <option value={0}>Select Revenue</option>
                      {activeSearchRevenueData?.map((state) => (
                        <option
                          id={
                            state.stateName +
                            "," +
                            state.plantationDistrictName +
                            "," +
                            state.plantationId +
                            "," +
                            state.stateId
                          }
                          value={state.revenueId}
                        >
                          {state.revenueDistrictName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      disabled="true"
                      value={stateName}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Plantation Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      disabled="true"
                      value={plantation}
                      className="form-control"
                    />
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
            <Typography>Manage Mark</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Mark Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={markName}
                          onChange={(e) => setmarkName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Mark Code</label>
                        <select
                          className="form-control select-form"
                          value={markCode}
                          onChange={(e) => setmarkCode(e.target.value)}
                        >
                          <option value={0}>Select mark Code</option>

                          {getSelectWithoutFilterResponse?.map((state) => (
                            <option key={state.markId} value={state.markId}>
                              {state.markCode}
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
                    disabled={getMarkData && getMarkData.length < 19}
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
                    title: "Mark Name",
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

export default CreateMark;
