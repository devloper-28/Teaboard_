import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
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
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import { Card, Modal } from "react-bootstrap";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import {
  getAllTeaTypes,
  getDocumentByIdActionSuccess,
  getAllTeaTypesAsc,
  createTeaType,
  updateTeaType,
  getTeaTypeById,
  searchTeaType,
  uploadAllDocumentsTeaTypeAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getAllCategoriesAction,
  getAllCategoriesAscAction,
  getTeaTypeByIdSuccess,
  createEditTeaTypeApiStatus,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  getAllAuctionCenterAscAction,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import CustomToast from "../../components/Toast";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

let pageNo = 1;
function CreateTeaType({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  // const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryCode] = useState("");
  const [teaTypeName, setTeaTypeName] = useState("");
  const [editingTeaTypeData, setEditingTeatypeData] = useState(null);
  // const [categoryId, setCategoryId] = useState("");

  const [getAllTeaTypeList, setGetAllTeaTypeList] = useState([]);
  const [getSearchTeaType, setGetSearchTeaType] = useState([]);
  // New state variables for search parameters
  const [searchCategoryName, setSearchCategoryName] = useState("");
  const [searchCategoryCode, setSearchCategoryCode] = useState("");
  const [searchTeaTypeName, setSearchTeaTypeName] = useState("");
  const [isActive, setIsActive] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [documentMode, setDocumentmode] = useState("");
  const [categoryNameError, setCategoryNameError] = useState("");
  const [categoryCodeError, setCategoryCodeError] = useState("");
  const [teaTypeNameError, setTeaTypeNameError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [viewMode, setViewMode] = useState(false);
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

  const getAllTeaType = useSelector(
    (state) => state.teaTypeManage.allTeaTypesAsc.responseData
  );

  const editingTeaTypeDataFromId = useSelector(
    (state) => state.teaTypeManage.teaType.responseData
  );
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchTeaType({
        categoryId: searchCategoryCode,
        teaTypeName: searchTeaTypeName,
        auctionCenterId: auctionCenterId,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchTeaType({
        categoryId: searchCategoryCode,
        teaTypeName: searchTeaTypeName,
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
    // Clear search parameters and fetch all auction centers
    setSearchCategoryName("");
    setSearchCategoryCode("");
    setSearchTeaTypeName("");
    setIsActive("");
    setRows([]);
    pageNo = 1;
    setauctionCenterId([]);
    setOnChangeAuctionCenterId([]);
    dispatch(
      getAllTeaTypesAsc({
        sortBy: "desc",
        sortColumn: "teaTypeName",
      })
    );
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(searchTeaType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    }, 1000);
  };
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingTeaTypeDataFromId && editingTeaTypeDataFromId.teaTypeId;
    let searchData = {
      url: `/admin/teaType/get/${id}/${exportType}`,
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
        Base64ToExcelDownload(getExportViewDataResponse, "TeaTypeDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "TeaTypeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      categoryId: searchCategoryCode,
      teaTypeName: searchTeaTypeName,
      isActive,
      url: "/admin/teaType/search",
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
        Base64ToExcelDownload(getExportDataResponse, "TeaTypeDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "TeaTypeDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  useEffect(() => {
    dispatch(
      getAllCategoriesAscAction({
        sortBy: "asc",
        sortColumn: "categoryCode",
        sortColumn: "categoryName",
      })
    );
  }, []);

  const searchTeatypeData = useSelector(
    (state) => state.teaTypeManage.searchResults.responseData
  );

  const allActiveCategory = useSelector(
    (state) => state.categoryManage.allCategoriesAsc.responseData
  );

  const isActiveCategoryData =
    allActiveCategory && allActiveCategory.filter((data) => 1 == data.isActive);

  const validateForm = () => {
    let isValid = true;

    if (!teaTypeName.trim()) {
      CustomToast.error("Please enter the tea type");
      isValid = false;
      return;
    } else {
      setTeaTypeNameError("");
    }

    if (!categoryId) {
      CustomToast.error(
        "Please select either the category name or the category code"
      );
      isValid = false;
      return;
    } else {
      setCategoryCodeError("");
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

    // Validate Certificate Number
    // if (!categoryName.trim()) {
    //   setCategoryNameError("Category Name is required.");
    //   isValid = false;
    // } else {
    //   setCategoryNameError("");
    // }

    // if (!editingTeaTypeData) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const teaTypeData = {
        categoryId: categoryId != null ? parseInt(categoryId) : categoryId,
        teaTypeName: teaTypeName,
        uploadDocumentRemarks: uploadDocumentRemarks,
        downloadDto: uploadedDocuments,
        isActive: 1,
        auctionCenterId: auctionCenterId,
        searchData: {
          pageNo: 1,
          noOfRecords: NO_OF_RECORDS,
        },
      };
      try {
        if (editingTeaTypeData) {
          const isFormModified =
            // categoryName !== editingTeaTypeData?.categoryName ||
            teaTypeName !== editingTeaTypeData?.teaTypeName ||
            categoryId !== editingTeaTypeData?.categoryId ||
            uploadDocumentRemarks !==
              editingTeaTypeData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingTeaTypeData?.downloadDto || []).length;

          if (isFormModified) {
            editingTeaTypeData.searchData = {
              categoryId: searchCategoryCode,
              teaTypeName: searchTeaTypeName,
              isActive,
              pageNo: pageNo,
              noOfRecords: NO_OF_RECORDS,
            };
            editingTeaTypeData.uploadDocumentRemarks = uploadDocumentRemarks;
            editingTeaTypeData.downloadDto = uploadedDocuments;
            editingTeaTypeData.auctionCenterId = auctionCenterId;

            setLoader(true);
            setTimeout(() => {
              setLoader(false);
              setRows([]);
              dispatch(updateTeaType(editingTeaTypeData));
            }, 1000);
          } else {
            // setExpanded("panel2");
          }
        } else {
          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(createTeaType(teaTypeData));
          }, 1000);
        }
      } catch (error) {}
    }
  };

  // Function to handle edit button click
  const handleEditClick = (teaTypeId) => {
    dispatch(getTeaTypeById(teaTypeId));
    // setExpanded("panel1");
    setEditModal(true);
  };

  const handleViewClick = (teaTypeId) => {
    dispatch(getTeaTypeById(teaTypeId));
    setViewMode(true);
    // setExpanded("panel1"); // Assuming this is to expand the appropriate accordion
    setViewModal(true);
  };

  let createData = useSelector(
    (state) => state.teaTypeManage.createEditTeaTypeApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditTeaTypeApiStatus(false));
      resetForm();
      setExpanded("panel2");
      dispatch(getTeaTypeByIdSuccess([]));
      setEditingTeatypeData(null);
      // dispatch(searchTeaType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
      setEditModal(false);
      setViewModal(false);
    }
  });

  useEffect(() => {
    if (
      editingTeaTypeDataFromId != null &&
      editingTeaTypeDataFromId != undefined
    ) {
      let tempData = editingTeaTypeDataFromId;
      tempData.categoryCode = editingTeaTypeDataFromId.categoryId;
      setEditingTeatypeData(tempData);

      setTeaTypeName(editingTeaTypeDataFromId.teaTypeName || "");
      setCategoryCode(editingTeaTypeDataFromId.categoryId || "");
      setUploadDocumentRemarks(
        editingTeaTypeDataFromId.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingTeaTypeDataFromId.downloadDto || []);

      let tempDataNo = [];
      editingTeaTypeDataFromId.auctionCenterId &&
        editingTeaTypeDataFromId.auctionCenterId.map(
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
    } else {
      dispatch(
        getAllCategoriesAscAction({
          sortBy: "asc",
          sortColumn: "categoryCode",
          sortColumn: "categoryName",
        })
      );
      dispatch(
        getAllTeaTypesAsc({
          sortBy: "desc",
          sortColumn: "teaTypeName",
        })
      );
    }
  }, [editingTeaTypeDataFromId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //To get all data for dropdown
      pageNo = 1;

      dispatch(searchTeaType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
      //Serch API call
      // dispatch(searchTeaType({}));
      // clearSearch();
      resetForm();
      setViewMode(false);
      dispatch(getTeaTypeByIdSuccess([]));
      setEditingTeatypeData(null);
      resetForm();
    } else if ("panel3" == panel && !isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsTeaTypeAction());
      setViewMode(false);
      dispatch(getTeaTypeByIdSuccess([]));
      setEditingTeatypeData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getTeaTypeByIdSuccess([]));
      setEditingTeatypeData(null);
      resetForm();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.teaTypeManage.uploadedDocuments.responseData
  );

  useEffect(() => {
    // Fetch uploaded documents when the component mounts
    dispatch(uploadAllDocumentsTeaTypeAction());
  }, [dispatch]);

  const [rows, setRows] = useState(getAllTeaType || getSearchTeaType);

  useEffect(() => {
    if (getSearchTeaType) {
      setGetAllTeaTypeList(getSearchTeaType);
      setRows(getSearchTeaType); // Update rows with the initial data
    }
  }, [getSearchTeaType]);
  // useEffect(() => {
  //   const newRows = searchTeatypeData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [searchTeatypeData]);
  useEffect(() => {
    const newRows = searchTeatypeData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.teaTypeId === newRow.teaTypeId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [searchTeatypeData]);

  // useEffect(() => {
  //   if (searchTeatypeData != null && searchTeatypeData != undefined) {
  //     setGetSearchTeaType(searchTeatypeData);
  //     setRows(searchTeatypeData); // Update rows with the search data
  //   } else {
  //     setGetSearchTeaType([]);
  //     setRows([]);
  //   }
  // }, [searchTeatypeData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "teaTypeName",
      title: "Tea Type Name",
    },
    {
      name: "categoryCode",
      title: "Category Code",
    },
    {
      name: "categoryName",
      title: "Category Name",
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
  function StatusData(data) {
    const handleSwitchChange = () => {
      let searchData = {
        categoryId: searchCategoryCode,
        teaTypeName: searchTeaTypeName,
        auctionCenterId: auctionCenterId,
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

      // Call the API to update the isActive status in the backend

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateTeaType(updatedData));
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
                id={`customSwitch${data.data.teaTypeId}`} // Use a unique ID for each switch
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange} // Call the handler on
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.teaTypeId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.teaTypeId}`}
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
    const tableName = "tbl_TeaType";
    const moduleName = "Tea Type";
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
                onClick={() => handleEditClick(data.data.teaTypeId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.teaTypeId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.teaTypeId);
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
  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };
  const resetForm = () => {
    // setCategoryName("");
    setCategoryCode("");
    setTeaTypeName("");
    setUploadDocumentRemarks("");
    setUploadedFiles([]);
    setUploadedDocuments([]);
    setRemarksError("");
    const inputElement = document.getElementById("teaTypeUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    setUploadDocumentError("");
    setCategoryCodeError("");
    setCategoryNameError("");
    setTeaTypeNameError("");
    setEditingTeatypeData(null);
    setauctionCenterId([]);
    setOnChangeAuctionCenterId([]);
  };

  useEffect(() => {
    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
      })
    );
  }, []);
  const getAllAuctiondata = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  const getAllAuctionCenterResponse = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
  const handleAuctionCenter = (event) => {
    const {
      target: { value, id },
    } = event;
    let tempData = typeof value === "string" ? value.split(",") : value;
    setOnChangeAuctionCenterId(tempData);

    let tempDataJsons = [];
    getAllAuctionCenter &&
      getAllAuctionCenter.map((auctionCenterData, auctioncenterIndex) => {
        if (tempData.includes(auctionCenterData.auctionCenterName)) {
          tempDataJsons.push(auctionCenterData);
        }
      });

    setauctionCenterId(tempDataJsons);
  };
  const handleCloseViewModal = () => {
    setViewModal(false);
    //To get all data for dropdown
    pageNo = 1;

    dispatch(searchTeaType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    //Serch API call
    // dispatch(searchTeaType({}));
    // clearSearch();
    resetForm();
    setViewMode(false);
    dispatch(getTeaTypeByIdSuccess([]));
    setEditingTeatypeData(null);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    //To get all data for dropdown
    pageNo = 1;

    dispatch(searchTeaType({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    //Serch API call
    // dispatch(searchTeaType({}));
    // clearSearch();
    resetForm();
    setViewMode(false);
    dispatch(getTeaTypeByIdSuccess([]));
    setEditingTeatypeData(null);
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
            <Typography>Create Tea Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea Type Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          // value={teaTypeName}
                          // onChange={(e) => setTeaTypeName(e.target.value)}
                          value={editingTeaTypeData?.teaTypeName || teaTypeName}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTeaTypeData
                              ? setEditingTeatypeData({
                                  ...editingTeaTypeData,
                                  teaTypeName: e.target.value,
                                })
                              : setTeaTypeName(e.target.value))
                          }
                          disabled={viewMode}
                          maxLength="50"
                        />
                        {teaTypeNameError && (
                          <p className="errorLabel">{teaTypeNameError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Category Code</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingTeaTypeData?.categoryId || categoryId}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTeaTypeData
                              ? setEditingTeatypeData({
                                  ...editingTeaTypeData,
                                  categoryId: e.target.value,
                                })
                              : setCategoryCode(e.target.value))
                          }
                          disabled={viewMode}
                        >
                          <option value="">Select Category Code</option>
                          {isActiveCategoryData?.map((state) => (
                            <option
                              key={state.categoryId}
                              value={state.categoryId}
                            >
                              {state.categoryCode}
                            </option>
                          ))}
                        </select>
                        {categoryCodeError && (
                          <p className="errorLabel">{categoryCodeError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Category Name</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingTeaTypeData?.categoryId || categoryId}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTeaTypeData
                              ? setEditingTeatypeData({
                                  ...editingTeaTypeData,
                                  categoryId: e.target.value,
                                })
                              : setCategoryCode(e.target.value))
                          }
                          disabled={viewMode}
                        >
                          <option value="">Select Category Name</option>
                          {isActiveCategoryData?.map((state) => (
                            <option
                              key={state.categoryId}
                              value={state.categoryId}
                            >
                              {state.categoryName}
                            </option>
                          ))}
                        </select>
                        {categoryCodeError && (
                          <p className="errorLabel">{categoryCodeError}</p>
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
                          onChange={handleAuctionCenter}
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

                    {!viewMode ? (
                      <>
                        <div className="col-md-12">
                          <UploadMultipleDocuments
                            onFileSelect={handleFileUpload}
                            uploadedFiles={uploadedFiles}
                            setUploadedFiles={setUploadedFiles}
                            uploadDocumentError={uploadDocumentError}
                            inputId="teaTypeUpload"
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
          title={"Edit Tea Type"}
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
                    <label>Tea Type Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      // value={teaTypeName}
                      // onChange={(e) => setTeaTypeName(e.target.value)}
                      value={editingTeaTypeData?.teaTypeName || teaTypeName}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTeaTypeData
                          ? setEditingTeatypeData({
                              ...editingTeaTypeData,
                              teaTypeName: e.target.value,
                            })
                          : setTeaTypeName(e.target.value))
                      }
                      maxLength="50"
                    />
                    {teaTypeNameError && (
                      <p className="errorLabel">{teaTypeNameError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Category Code</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingTeaTypeData?.categoryId || categoryId}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTeaTypeData
                          ? setEditingTeatypeData({
                              ...editingTeaTypeData,
                              categoryId: e.target.value,
                            })
                          : setCategoryCode(e.target.value))
                      }
                    >
                      <option value="">Select Category Code</option>
                      {isActiveCategoryData?.map((state) => (
                        <option key={state.categoryId} value={state.categoryId}>
                          {state.categoryCode}
                        </option>
                      ))}
                    </select>
                    {categoryCodeError && (
                      <p className="errorLabel">{categoryCodeError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Category Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingTeaTypeData?.categoryId || categoryId}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTeaTypeData
                          ? setEditingTeatypeData({
                              ...editingTeaTypeData,
                              categoryId: e.target.value,
                            })
                          : setCategoryCode(e.target.value))
                      }
                    >
                      <option value="">Select Category Name</option>
                      {isActiveCategoryData?.map((state) => (
                        <option key={state.categoryId} value={state.categoryId}>
                          {state.categoryName}
                        </option>
                      ))}
                    </select>
                    {categoryCodeError && (
                      <p className="errorLabel">{categoryCodeError}</p>
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
                      onChange={handleAuctionCenter}
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
                        inputId="teaTypeUpload"
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
          title={"View Tea Type"}
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
                    <label>Tea Type Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      // value={teaTypeName}
                      // onChange={(e) => setTeaTypeName(e.target.value)}
                      value={editingTeaTypeData?.teaTypeName || teaTypeName}
                      disabled={viewMode}
                      maxLength="50"
                    />
                    {teaTypeNameError && (
                      <p className="errorLabel">{teaTypeNameError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Category Code</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingTeaTypeData?.categoryId || categoryId}
                      disabled={viewMode}
                    >
                      <option value="">Select Category Code</option>
                      {isActiveCategoryData?.map((state) => (
                        <option key={state.categoryId} value={state.categoryId}>
                          {state.categoryCode}
                        </option>
                      ))}
                    </select>
                    {categoryCodeError && (
                      <p className="errorLabel">{categoryCodeError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Category Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingTeaTypeData?.categoryId || categoryId}
                      disabled={viewMode}
                    >
                      <option value="">Select Category Name</option>
                      {isActiveCategoryData?.map((state) => (
                        <option key={state.categoryId} value={state.categoryId}>
                          {state.categoryName}
                        </option>
                      ))}
                    </select>
                    {categoryCodeError && (
                      <p className="errorLabel">{categoryCodeError}</p>
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
                      {getAllAuctiondata?.map((AuctionCenter) => (
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
            <Typography>Manage Tea Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea Type Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchTeaTypeName}
                          onChange={(e) => setSearchTeaTypeName(e.target.value)}
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
                          {allActiveCategory?.map((state) => (
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
                        <label>Category Name</label>
                        <select
                          className="form-control select-form"
                          value={searchCategoryCode}
                          onChange={(e) =>
                            setSearchCategoryCode(e.target.value)
                          }
                        >
                          <option value="">Select Category Name</option>
                          {allActiveCategory?.map((state) => (
                            <option
                              key={state.categoryId}
                              value={state.categoryId}
                            >
                              {state.categoryName}
                            </option>
                          ))}
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
                          onChange={handleAuctionCenter}
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
                      searchTeatypeData && searchTeatypeData.length < 19
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
                    title: "Tea Type Name",
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
          title={"Tea Type"}
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

export default CreateTeaType;
