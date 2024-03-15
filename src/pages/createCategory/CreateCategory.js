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
  getAllCategoriesAction,
  getDocumentByIdActionSuccess,
  getAllCategoriesAscAction,
  createCategoryAction,
  updateCategoryAction,
  getCategoryByIdAction,
  searchCategoriesAction,
  uploadAllDocumentsAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditCategoryApiStatus,
  getCategoryByIdSuccess,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Modals from "../../components/common/Modal";
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
function CreateCategory({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [loader, setLoader] = useState(false);
  const [editingCategoryData, setEditingCategoryData] = useState(null);

  const [getSearchCategory, setGetCategoryState] = useState([]);
  const [getAllCategory, setGetAllCategory] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  // New state variables for search parameters
  const [searchCategoryName, setSearchCategoryName] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [searchCategoryCode, setSearchCategoryCode] = useState("");
  const [isActive, setIsActive] = useState("");
  const [documentMode, setDocumentmode] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [categoryNameError, setCategoryNameError] = useState("");
  const [categoryCodeError, setCategoryCodeError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
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
  const getCategoryData = useSelector(
    (state) => state?.categoryManage?.allCategoriesAsc?.responseData
  );

  // Filter only the data where isActive is 1
  const isActiveData =
    getCategoryData && getCategoryData.filter((data) => 1 == data.isActive);

  const editingCategoryDataFromId = useSelector(
    (state) => state.categoryManage.categoryById.responseData
  );

  const getCategoryDatas = useSelector(
    (state) => state?.categoryManage?.searchedCategories?.responseData
  );

  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchCategoriesAction({
        categoryName: searchCategoryName,
        categoryId: searchCategoryCode,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  // Function to perform the search API call
  const fetchData = () => {
    dispatch(
      searchCategoriesAction({
        categoryName: searchCategoryName,
        categoryId: searchCategoryCode,
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
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingCategoryDataFromId && editingCategoryDataFromId.categoryId;
    let searchData = {
      url: `/admin/Category/get/${id}/${exportType}`,
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
          "CategoryDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "CategoryDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const clearSearch = () => {
    setSearchCategoryCode("");
    setSearchCategoryName("");
    setIsActive("");
    setRows([]);
    pageNo = 1;
    dispatch(
      getAllCategoriesAscAction({
        sortBy: "asc",
        sortColumn: "categoryCode",
      })
    );
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        searchCategoriesAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
    }, 1000);

    // setRows(getCategoryDatas);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      pageNo = 1;
      //To get all data for dropdown
      dispatch(
        getAllCategoriesAscAction({
          sortBy: "asc",
          sortColumn: "categoryCode",
        })
      );

      dispatch(
        searchCategoriesAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
      //Serch API call
      // dispatch(searchCategoriesAction({}));
      // clearSearch();
      setViewMode(false);
      dispatch(getCategoryByIdSuccess([]));
      setEditingCategoryData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsAction());
      setViewMode(false);
      dispatch(getCategoryByIdSuccess([]));
      setEditingCategoryData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getCategoryByIdSuccess([]));
      setEditingCategoryData(null);
      resetForm();
    }
  };

  const searchCategoryData = useSelector(
    (state) => state.categoryManage.searchedCategories.responseData
  );

  const validateForm = () => {
    let isValid = true;

    if (!categoryName.trim()) {
      CustomToast.error("Please enter the category name");
      isValid = false;
      return;
    } else {
      setCategoryNameError("");
    }

    if (!categoryCode) {
      CustomToast.error("Please enter the category code");
      isValid = false;
      return;
    } else {
      setCategoryCodeError("");
    }

    // if (!editingCategoryData) {
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

  let createData = useSelector(
    (state) => state.categoryManage.createEditCategoryApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditCategoryApiStatus(false));
      resetForm();
      setExpanded("panel2");
      dispatch(getCategoryByIdSuccess([]));
      setEditingCategoryData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const categoryData = {
        categoryName: categoryName,
        categoryCode: categoryCode,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
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
        if (editingCategoryData) {
          const isFormModified =
            categoryName !== editingCategoryData?.categoryName ||
            categoryCode !== editingCategoryData?.categoryCode ||
            uploadDocumentRemarks !==
              editingCategoryData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingCategoryData?.downloadDto || []).length;
          if (isFormModified) {
            let records = pageNo * NO_OF_RECORDS;
            editingCategoryData.serchData = {
              pageNo: 1,
              noOfRecords: records + "",
            };
            editingCategoryData.searchasd = {
              sortBy: "asc",
              sortColumn: "chargeCode",
            };
            editingCategoryData.uploadDocumentRemarks = uploadDocumentRemarks;
            editingCategoryData.downloadDto = uploadedDocuments;
            setLoader(true);
            setTimeout(() => {
              setLoader(false);
              setRows([]);
              dispatch(updateCategoryAction(editingCategoryData));
            }, 1000);
          } else {
          }
        } else {
          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(createCategoryAction(categoryData));
          }, 1000);

          setRows([]);
        }
      } catch (e) {}
    }
  };

  const handleEditClick = (categoryId) => {
    dispatch(getCategoryByIdAction(categoryId));
    // setExpanded("panel1");
    setEditModal(true);
    setViewMode(false);
  };

  useEffect(() => {
    if (
      editingCategoryDataFromId != null &&
      editingCategoryDataFromId != undefined
    ) {
      setEditingCategoryData(editingCategoryDataFromId);
      setCategoryName(editingCategoryDataFromId.categoryName || "");
      setCategoryCode(editingCategoryDataFromId.categoryCode || "");
      setUploadDocumentRemarks(
        editingCategoryDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingCategoryDataFromId.downloadDto || []);
    } else {
      dispatch(
        getAllCategoriesAscAction({
          sortBy: "asc",
          sortColumn: "categoryCode",
        })
      );
      // resetForm();
      // dispatch(getAllCategoriesAction());
    }
  }, [editingCategoryDataFromId]);

  const getAllUploadedDoc = useSelector(
    (state) => state.categoryManage.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   if (getCategoryDatas) {
  //     setGetAllCategory(getCategoryDatas);
  //     setRows(getCategoryDatas); // Update rows with the initial data
  //   }
  // }, [getCategoryDatas]);
  // useEffect(() => {
  //   const newRows = getCategoryDatas || [];
  //   setRows((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
  // }, [getCategoryDatas]);
  useEffect(() => {
    const newRows = getCategoryDatas || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.categoryId === newRow.categoryId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [getCategoryDatas]);

  // useEffect(() => {
  //   if (searchCategoryData != null) {
  //     setGetAllCategory(searchCategoryData);
  //     setRows(searchCategoryData); // Update rows with the search data
  //   } else {
  //     setGetAllCategory([]);
  //     setRows([]);
  //   }
  // }, [searchCategoryData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "categoryName",
      title: "Category Name",
    },
    {
      name: "categoryCode",
      title: "Category Code",
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

  const [viewMode, setViewMode] = useState(false);

  const handleViewClick = (categoryId) => {
    dispatch(getCategoryByIdAction(categoryId));
    setViewMode(true);
    // setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
    setViewModal(true);
  };

  function StatusData(data) {
    const handleSwitchChange = () => {
      let searchData = {
        categoryName: searchCategoryName,
        categoryId: searchCategoryCode,
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
        dispatch(updateCategoryAction(updatedData));
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
                id={`customSwitch${data.data.categoryId}`} // Use a unique ID for each switch
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange} // Call the handler on
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.categoryId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.categoryId}`}
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
    const tableName = "tbl_Category";
    const moduleName = "Categoty";
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
                onClick={() => handleEditClick(data.data.categoryId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.categoryId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => handleHistoryViewClick(data.data.categoryId)}
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

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      categoryName: searchCategoryName,
      categoryId: searchCategoryCode,
      isActive,
      url: "/admin/Category/search",
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
        Base64ToExcelDownload(getExportDataResponse, "CategoryDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "CategoryDetails.pdf",
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
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
  const resetForm = () => {
    setCategoryName("");
    setCategoryCode("");
    setEditingCategoryData(null);
    const inputElement = document.getElementById("categoryUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    setEditingCategoryData(null);
    setCategoryCodeError("");
    setCategoryNameError("");
    setRemarksError("");
    setUploadDocumentError("");
    setUploadDocumentRemarks("");
    setUploadedFiles([]);
    setUploadedDocuments([]);
  };

  const handleCloseViewModal = () => {
    setViewModal(false);
    pageNo = 1;
    //To get all data for dropdown
    dispatch(
      getAllCategoriesAscAction({
        sortBy: "asc",
        sortColumn: "categoryCode",
      })
    );

    dispatch(
      searchCategoriesAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
    );
    //Serch API call
    // dispatch(searchCategoriesAction({}));
    // clearSearch();
    setViewMode(false);
    dispatch(getCategoryByIdSuccess([]));
    setEditingCategoryData(null);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    pageNo = 1;
    //To get all data for dropdown
    dispatch(
      getAllCategoriesAscAction({
        sortBy: "asc",
        sortColumn: "categoryCode",
      })
    );

    dispatch(
      searchCategoriesAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
    );
    //Serch API call
    // dispatch(searchCategoriesAction({}));
    // clearSearch();
    setViewMode(false);
    dispatch(getCategoryByIdSuccess([]));
    setEditingCategoryData(null);
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
            <Typography>Create Category</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-6">
                      <div className="FormGroup">
                        <label>Category Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          // value={categoryName}
                          // onChange={(e) => setCategoryName(e.target.value)}
                          value={
                            editingCategoryData?.categoryName || categoryName
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingCategoryData
                              ? setEditingCategoryData({
                                  ...editingCategoryData,
                                  categoryName: e.target.value,
                                })
                              : setCategoryName(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {categoryNameError && (
                          <p className="errorLabel">{categoryNameError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="FormGroup">
                        <label>Category Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="10"
                          // value={categoryCode}
                          // onChange={(e) => setCategoryCode(e.target.value)}
                          value={
                            editingCategoryData?.categoryCode || categoryCode
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingCategoryData
                              ? setEditingCategoryData({
                                  ...editingCategoryData,
                                  categoryCode: e.target.value,
                                })
                              : setCategoryCode(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {categoryCodeError && (
                          <p className="errorLabel">{categoryCodeError}</p>
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
                            inputId="categoryUpload"
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
          title={"Edit Category"}
          show={editModal}
          handleClose={handleCloseEditModal}
          size="xl"
          centered
        >
          {" "}
          <div className="row">
            <div className="col-lg-12">
              <div className="row align-items-end">
                <div className="col-md-6">
                  <div className="FormGroup">
                    <label>Category Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      // value={categoryName}
                      // onChange={(e) => setCategoryName(e.target.value)}
                      value={editingCategoryData?.categoryName || categoryName}
                      onChange={(e) =>
                        !viewMode &&
                        (editingCategoryData
                          ? setEditingCategoryData({
                              ...editingCategoryData,
                              categoryName: e.target.value,
                            })
                          : setCategoryName(e.target.value))
                      }
                    />
                    {categoryNameError && (
                      <p className="errorLabel">{categoryNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="FormGroup">
                    <label>Category Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      // value={categoryCode}
                      // onChange={(e) => setCategoryCode(e.target.value)}
                      value={editingCategoryData?.categoryCode || categoryCode}
                      onChange={(e) =>
                        !viewMode &&
                        (editingCategoryData
                          ? setEditingCategoryData({
                              ...editingCategoryData,
                              categoryCode: e.target.value,
                            })
                          : setCategoryCode(e.target.value))
                      }
                    />
                    {categoryCodeError && (
                      <p className="errorLabel">{categoryCodeError}</p>
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
                        inputId="categoryUpload"
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
                    {modalRight?.some((ele) => ele === "2") &&
                      editingCategoryData && (
                        <button
                          className="SubmitBtn"
                          onClick={handleSubmit}
                          disabled={viewMode}
                        >
                          Update
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

      {/* View */}
      {viewModal ? (
        <Modals
          title={"View Category"}
          show={viewModal}
          handleClose={handleCloseViewModal}
          size="xl"
          centered
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="row align-items-end">
                <div className="col-md-6">
                  <div className="FormGroup">
                    <label>Category Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      // value={categoryName}
                      // onChange={(e) => setCategoryName(e.target.value)}
                      value={editingCategoryData?.categoryName || categoryName}
                      disabled={viewMode}
                    />
                    {categoryNameError && (
                      <p className="errorLabel">{categoryNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="FormGroup">
                    <label>Category Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      // value={categoryCode}
                      // onChange={(e) => setCategoryCode(e.target.value)}
                      value={editingCategoryData?.categoryCode || categoryCode}
                      disabled={viewMode}
                    />
                    {categoryCodeError && (
                      <p className="errorLabel">{categoryCodeError}</p>
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
            <Typography>Manage Category</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Category Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchCategoryName}
                          onChange={(e) =>
                            setSearchCategoryName(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Category Code</label>
                        <select
                          className="form-control select-form"
                          value={searchCategoryCode}
                          onChange={(e) =>
                            setSearchCategoryCode(e.target.value)
                          }
                        >
                          <option value="">Select Category Code</option>
                          {getCategoryData?.map((state) => (
                            <option
                              key={state.categoryId}
                              value={state.categoryId}
                            >
                              {state.categoryCode}
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
                    disabled={getCategoryDatas && getCategoryDatas.length < 19}
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
                    title: "Category Name",
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
                // rows={rows}
                rows={
                  getAllUploadedDoc == undefined || getAllUploadedDoc == null
                    ? []
                    : getAllUploadedDoc?.map((row, index) => ({
                        ...row,
                        index: index + 1,
                      }))
                }
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
          title={"Category"}
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

export default CreateCategory;
