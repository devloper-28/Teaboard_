import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
//import { fetchGrade } from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
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
  getpackageType,
  getpackageTypeWithoutFilter,
  getDocumentByIdActionSuccess,
  getAllAuctionCenterAscAction,
  searchRevenueAction,
  createpackageTypeAction,
  updatepackageTypeAction,
  getFactory,
  getpackageTypeByIdAction,
  getDocumentByIdAction,
  uploadAllDocumentspackageTypeAction,
  getHistoryByIdAction,
  createEditApiStatuspackageType,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
} from "../../store/actions";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
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

function CreatepackageType({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState("panel1");
  const [loader, setLoader] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [packageTypeName, setpackageTypeName] = useState("");
  const [packageTypeNamecreate, setpackageTypeNamecreate] = useState("");
  const [editingpackageTypeData, setEditingpackageTypeData] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setuploadDocumentRemarks] = useState("");
  const [showmodal, setShowmodal] = useState(false);
  const [exportType, setexportType] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [documentMode, setDocumentmode] = useState("");
  const getAllAuctionCenterResponse = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const [auctionCenter, setauctionCenter] = useState("");
  const [searchAuctionCenterName, setSearchAuctionCenterName] = useState("");
  const [isActive, setisActive] = useState("");
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

  const getpackageTypeData = useSelector(
    (state) => state.packageTypeReducer.getpackageType.responseData
  );
  const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   setRows(getpackageTypeData);
  // }, [getpackageTypeData]);
  // useEffect(() => {
  //   const newRows = getpackageTypeData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [getpackageTypeData]);
  useEffect(() => {
    const newRows = getpackageTypeData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.packageTypeId === newRow.packageTypeId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [getpackageTypeData]);

  useEffect(() => {
    dispatch(getFactory());
    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
      })
    );
    dispatch(searchRevenueAction({}));
    dispatch(getpackageTypeWithoutFilter({}));
  }, []);
  const getAllUploadedDoc = useSelector(
    (state) => state.packageTypeReducer.uploadedDocuments.responseData
  );
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      pageNo = 1;
      dispatch(
        getpackageType({
          isActive: 1,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
      // handleClearSearch();
      setViewMode(false);
      setEditingpackageTypeData(null);
      // handleClearSearch();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentspackageTypeAction());
      setViewMode(false);
      setEditingpackageTypeData(null);
      resetForm();
    } else if ("panel1" == panel && isExpanded) {
      handleClearSearch();
    }
  };
  const resetForm = () => {
    setpackageTypeNamecreate("");
    setEditingpackageTypeData("");
    setauctionCenter("");
    setViewMode(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = true;
    let mn =
      editingpackageTypeData == null
        ? packageTypeNamecreate
        : editingpackageTypeData.packageTypeName
        ? editingpackageTypeData.packageTypeName
        : packageTypeNamecreate;
    let ac =
      editingpackageTypeData == null
        ? auctionCenter
        : editingpackageTypeData.auctionCenterId
        ? editingpackageTypeData.auctionCenterId
        : auctionCenter;
    if (!mn) {
      CustomToast.error("Please enter the package type name");
      isValid = false;
      return;
    }
    if (!ac) {
      CustomToast.error("Please select auction center");
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

    if (editingpackageTypeData) {
      editingpackageTypeData.uploadDocumentRemarks = uploadDocumentRemarks;
      editingpackageTypeData.downloadDto = uploadedDocuments;
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setRows([]);
        dispatch(updatepackageTypeAction(editingpackageTypeData));
      }, 1000);
    } else {
      let dataForSubmit = {
        packageTypeName: mn,
        auctionCenterId: ac,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
      };
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setRows([]);
        dispatch(createpackageTypeAction(dataForSubmit));
      }, 1000);
    }
  };
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingpackageTypeData && editingpackageTypeData.packageTypeId;
    let searchData = {
      url: `/admin/packageType/get/${id}/${exportType}`,
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
          "PackageTypeDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "PackageTypeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  let createData = useSelector(
    (state) => state.packageTypeReducer.createEditApiStatus
  );
  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      packageTypeName: packageTypeName,
      auctionCenterId: searchAuctionCenterName,
      isActive: isActive != "" ? parseInt(isActive) : isActive,
      url: "/admin/packageType/search",
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
        Base64ToExcelDownload(getExportDataResponse, "PackageTypeDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "PackageTypeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });
  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiStatuspackageType(false));
      setExpanded("panel2");
      //handleClearSearch();
      setEditingpackageTypeData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });
  const editingDataFromApi = useSelector(
    (state) => state.packageTypeReducer.packageTypeData.responseData
  );

  useEffect(() => {
    if (editingDataFromApi) {
      setEditingpackageTypeData(editingDataFromApi);
    }
  }, [editingDataFromApi]);
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      getpackageType({
        packageTypeName: packageTypeName,
        auctionCenterId: searchAuctionCenterName,
        isActive: isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };

  const fetchData = () => {
    dispatch(
      getpackageType({
        packageTypeName: packageTypeName,
        auctionCenterId: searchAuctionCenterName,
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
    setSearchAuctionCenterName("");
    setisActive("");
    setpackageTypeName("");
    pageNo = 1;
    setRows([]);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        getpackageType({
          isActive: 1,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
    }, 1000);
  };
  const handleEditClick = (packageTypeId) => {
    dispatch(getpackageTypeByIdAction(packageTypeId));
    setViewMode(false);
    // setExpanded("panel1");
    setEditModal(true);
  };
  const handleViewClick = (packageTypeId) => {
    dispatch(getpackageTypeByIdAction(packageTypeId));
    setViewMode(true);
    // setExpanded("panel1");
    setViewModal(true);
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
    const tableName = "tbl_packageType";
    const moduleName = "packageType";
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
      name: "packageTypeName",
      title: "Package Type name",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center Name",
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
                onClick={() => handleEditClick(data.data.packageTypeId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.packageTypeId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.packageTypeId);
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
          packageTypeName: packageTypeName,
          auctionCenterId: searchAuctionCenterName,
          isActive: isActive,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        },
      };
      // Call the API to update the isActive status in the backend

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updatepackageTypeAction(updatedData));
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
                id={`customSwitch${data.data.packageTypeId}`}
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange}
              />
              <label
                class="custom-control-label"
                for={`customSwitch${data.data.packageTypeId}`}
              >
                {data.data.isActive === 1 ? "Active" : "In-Active"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.packageTypeId}`}
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
    pageNo = 1;
    dispatch(
      getpackageType({
        isActive: 1,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
    // handleClearSearch();
    setViewMode(false);
    setEditingpackageTypeData(null);
    // handleClearSearch();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    pageNo = 1;
    dispatch(
      getpackageType({
        isActive: 1,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
    // handleClearSearch();
    setViewMode(false);
    setEditingpackageTypeData(null);
    // handleClearSearch();
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
            <Typography>Create Package Type</Typography>
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
                          value={
                            editingpackageTypeData?.auctionCenterId ||
                            auctionCenter
                          }
                          onChange={(e) =>
                            editingpackageTypeData
                              ? setEditingpackageTypeData({
                                  ...editingpackageTypeData,
                                  auctionCenterId: e.target.value,
                                })
                              : setauctionCenter(e.target.value)
                          }
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
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Package Type Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          value={
                            editingpackageTypeData?.packageTypeName ||
                            packageTypeNamecreate
                          }
                          onChange={(e) =>
                            editingpackageTypeData
                              ? setEditingpackageTypeData({
                                  ...editingpackageTypeData,
                                  packageTypeName: e.target.value,
                                })
                              : setpackageTypeNamecreate(e.target.value)
                          }
                          disabled={viewMode}
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
                              setuploadDocumentRemarks(e.target.value)
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
          title={"Edit Package Type"}
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
                      value={
                        editingpackageTypeData?.auctionCenterId || auctionCenter
                      }
                      onChange={(e) =>
                        editingpackageTypeData
                          ? setEditingpackageTypeData({
                              ...editingpackageTypeData,
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
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Package Type Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={
                        editingpackageTypeData?.packageTypeName ||
                        packageTypeNamecreate
                      }
                      onChange={(e) =>
                        editingpackageTypeData
                          ? setEditingpackageTypeData({
                              ...editingpackageTypeData,
                              packageTypeName: e.target.value,
                            })
                          : setpackageTypeNamecreate(e.target.value)
                      }
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
                          setuploadDocumentRemarks(e.target.value)
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
          title={"View Package Type"}
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
                      value={
                        editingpackageTypeData?.auctionCenterId || auctionCenter
                      }
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
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Package Type Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={
                        editingpackageTypeData?.packageTypeName ||
                        packageTypeNamecreate
                      }
                      disabled={viewMode}
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
            <Typography>Manage Package Type</Typography>
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
                        <label>Package Type Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={packageTypeName}
                          onChange={(e) => setpackageTypeName(e.target.value)}
                        />
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
                    disabled={
                      getpackageTypeData && getpackageTypeData.length < 19
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
                    name: "auctionCenter",
                    title: "Auction Center Name",
                  },
                  {
                    name: "packageTypeName",
                    title: "Package Type Name",
                  },
                  {
                    name: "documentUploadTime",
                    title: "Document Upload Date And Time",
                  },
                  {
                    name: "uploadDocumentRemarks",
                    title: "Document Remarks",
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
                reTypeingCol={false}
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

export default CreatepackageType;
