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
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import { Card, Modal } from "react-bootstrap";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getAllAuctionCenterAction,
  getDocumentByIdActionSuccess,
  getAllAuctionCenterAscAction,
  getAllAuctionRegionCenterAction,
  createAuctionCenterAction,
  getAuctionCenterByIdAction,
  updateAuctionCenterAction,
  searchAuctionCenterAction,
  getAllStateAction,
  getAllStateAscAction,
  getDocumentByIdAction,
  uploadAllDocumentsAuctionCenterAction,
  getHistoryByIdAction,
  uploadAllDocumentsAction,
  createEditAuctionCenterApiStatus,
  getAuctionCenterByIdActionSuccess,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  createAuctionCenterActionType,
} from "../../store/actions";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import $ from "jquery";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import CustomToast from "../../components/Toast";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";
let pageNo = 1;

function CreateAuctionCenter({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewModal, setPreviewModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const [auctionCenterName, setAuctionCenterName] = useState("");
  const [auctionCenterCode, setAuctionCenterCode] = useState("");
  const [certificateNo, setCertificateNo] = useState("");
  const [editingAuctionCenterData, setEditingAuctionCenterData] =
    useState(null);
  const [getSearchAuctionCenter, setGetSearchAuctionCenter] = useState([]);
  const [getAllAuctionCenter, setGetAllAuctionCenter] = useState([]);
  const [stateId, setStateId] = useState("");
  const [auctionTypeId, setauctionTypeId] = useState("");
  // New state variables for search parameters
  const [searchAuctionCenterName, setSearchAuctionCenterName] = useState("");
  const [searchAuctionCenterType, setSearchAuctionCenterType] = useState("");
  const [searchAuctionCenterCode, setSearchAuctionCenterCode] = useState("");
  const [searchCertificateNo, setSearchCertificateNo] = useState("");
  const [isActive, setIsActive] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [regionId, setregionId] = useState("");
  const [regionIdError, setregionIdError] = useState("");

  const [auctionCenterNameError, setAuctionCenterNameError] = useState("");
  const [auctionCenterCodeError, setAuctionCenterCodeError] = useState("");
  const [certificateNoError, setCertificateNoError] = useState("");
  const [stateIdError, setStateIdError] = useState("");
  const [auctionTypeIdError, setauctionTypeIdError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchStateId, setSearchStateId] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [region, setRegion] = useState("");
  const [exportType, setexportType] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [documentMode, setDocumentmode] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const handleCloseHistory = () => setShowmodal(false);

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

  const getAllAuctionCenterList = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  const getAllAuctionCenterRegion = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterRegion?.responseData
  );

  // Filter only the data where isActive is 1
  const isActiveData =
    getAllAuctionCenterList &&
    getAllAuctionCenterList?.filter((data) => 1 == data.isActive);

  const editingAuctionCenterDataFromState = useSelector(
    (state) => state?.auctionCenter?.auctionCenterById?.responseData
  );

  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchAuctionCenterAction({
        auctionCenterName: searchAuctionCenterName,
        auctionCenterCode: searchAuctionCenterCode,
        auctionTypeMasterId: searchAuctionCenterType,
        auctionCenterId:
          searchCertificateNo != ""
            ? parseInt(searchCertificateNo)
            : searchCertificateNo,
        stateId: searchStateId != "" ? parseInt(searchStateId) : searchStateId,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchAuctionCenterAction({
        auctionCenterName: searchAuctionCenterName,
        auctionCenterCode: searchAuctionCenterCode,
        auctionTypeMasterId: searchAuctionCenterType,
        auctionCenterId:
          searchCertificateNo != ""
            ? parseInt(searchCertificateNo)
            : searchCertificateNo,
        stateId: searchStateId != "" ? parseInt(searchStateId) : searchStateId,
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
    setSearchAuctionCenterType("");
    setSearchAuctionCenterName("");
    setSearchAuctionCenterCode("");
    setSearchCertificateNo("");
    setIsActive("");
    setRows([]);
    pageNo = 1;
    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
        sortColumn: "auctionCenterCode",
      })
    );
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        searchAuctionCenterAction({
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
    }, 1000);

    setGetSearchAuctionCenter([]);
    setSearchStateId("");
  };

  const searchAuctionCenterData = useSelector(
    (state) => state?.auctionCenter?.searchResults?.responseData
  );

  useEffect(() => {
    dispatch(
      getAllStateAscAction({
        sortBy: "asc",
        sortColumn: "stateName",
      })
    );
    dispatch(createAuctionCenterActionType());
    dispatch(getAllAuctionRegionCenterAction());

    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
        sortColumn: "auctionCenterCode",
      })
    );
  }, []);
  const allAuctionTypeData = useSelector(
    (state) => state?.auctionCenter?.auctionCenterType?.data?.responseData
  );
  const allSateActiveState = useSelector(
    (state) => state.state.getAllStateAsc.responseData
  );
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
  const isActiveStateData =
    allSateActiveState &&
    allSateActiveState.filter((data) => 1 == data.isActive);

  const validateForm = () => {
    let isValid = true;
    if (editingAuctionCenterData == null && !auctionTypeId) {
      CustomToast.error("Please select one value");
      isValid = false;
      return;
    } else {
      setauctionTypeIdError("");
    }

    if (
      editingAuctionCenterData != null &&
      !editingAuctionCenterData.auctionTypeMasterId
    ) {
      CustomToast.error("Please select one value");
      isValid = false;
      return;
    } else {
      setauctionTypeIdError("");
    }

    // Validate Auction Center Name
    if (!auctionCenterName) {
      isValid = false;
      CustomToast.error("Please enter the auction center");
      return;
    } else {
      setAuctionCenterNameError("");
    }

    // Validate Auction Center Code
    if (!auctionCenterCode) {
      CustomToast.error("Please enter the auction center code");
      isValid = false;
      return;
    } else {
      setAuctionCenterCodeError("");
    }

    // Validate Certificate Number
    if (!certificateNo) {
      CustomToast.error("Please enter the auction center certificate number");
      isValid = false;
      return;
    } else {
      setCertificateNoError("");
    }

    // Validate State ID
    if (!stateId) {
      CustomToast.error("Please select a state from the dropdown menu");
      isValid = false;
      return;
    } else {
      setStateIdError("");
    }

    if (!regionId) {
      CustomToast.error("Please select a region from the dropdown menu");
      isValid = false;
      return;
    } else {
      setregionIdError("");
    }

    // if (!editingAuctionCenterData) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newAuctionCenterData = {
        auctionTypeMasterId: auctionTypeId,
        auctionCenterName: auctionCenterName,
        auctionCenterCode: auctionCenterCode,
        certificateNo: certificateNo,
        regionId: regionId,
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
        if (editingAuctionCenterData) {
          const isFormModified =
            regionId !== editingAuctionCenterData?.regionId ||
            auctionTypeId !== editingAuctionCenterData?.auctionTypeMasterId ||
            auctionCenterName !== editingAuctionCenterData?.auctionCenterName ||
            auctionCenterCode !== editingAuctionCenterData?.auctionCenterCode ||
            certificateNo !== editingAuctionCenterData?.certificateNo ||
            stateId !== editingAuctionCenterData?.stateId ||
            uploadDocumentRemarks !==
              editingAuctionCenterData?.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              (editingAuctionCenterData?.downloadDto || []).length;
          if (isFormModified) {
            editingAuctionCenterData.searchData = {
              auctionCenterName: searchAuctionCenterName,
              auctionCenterCode: searchAuctionCenterCode,
              auctionTypeMasterId: searchAuctionCenterType,
              auctionCenterId:
                searchCertificateNo != ""
                  ? parseInt(searchCertificateNo)
                  : searchCertificateNo,
              stateId:
                searchStateId != "" ? parseInt(searchStateId) : searchStateId,
              isActive,
              pageNo: pageNo,
              noOfRecords: NO_OF_RECORDS,
            };
            editingAuctionCenterData.uploadDocumentRemarks =
              uploadDocumentRemarks;
            editingAuctionCenterData.downloadDto = uploadedDocuments;
            setLoader(true);
            setTimeout(() => {
              setLoader(false);
              setRows([]);
              dispatch(updateAuctionCenterAction(editingAuctionCenterData));
            }, 1000);
          } else {
            // setExpanded("panel2");
          }
        } else {
          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(createAuctionCenterAction(newAuctionCenterData));
          }, 1000);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };
  const handleEditClick = (auctionCenterId) => {
    // Call the action creator to get the auction center data by ID
    dispatch(getAuctionCenterByIdAction(auctionCenterId));
    // setExpanded("panel1"); // Show the first accordion panel
    setEditModal(true);
    setViewMode(false);
  };

  useEffect(() => {
    if (editingAuctionCenterDataFromState) {
      setEditingAuctionCenterData(editingAuctionCenterDataFromState);
      setAuctionCenterName(
        editingAuctionCenterDataFromState?.auctionCenterName || ""
      );
      setAuctionCenterCode(
        editingAuctionCenterDataFromState?.auctionCenterCode || ""
      );
      setregionId(editingAuctionCenterDataFromState.regionId || "");
      setCertificateNo(editingAuctionCenterDataFromState.certificateNo || "");
      setStateId(editingAuctionCenterDataFromState.stateId || "");
      setUploadDocumentRemarks(
        editingAuctionCenterDataFromState.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingAuctionCenterDataFromState.downloadDto || []);
    } else {
      // resetForm();
    }
  }, [editingAuctionCenterDataFromState]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //To get all data for dropdown
      dispatch(
        getAllAuctionCenterAscAction({
          sortBy: "asc",
          sortColumn: "auctionCenterName",
          sortColumn: "auctionCenterCode",
        })
      );
      //Serch API call
      // dispatch(searchAuctionCenterAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getAuctionCenterByIdActionSuccess([]));
      setEditingAuctionCenterData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsAuctionCenterAction());
      setViewMode(false);
      dispatch(getAuctionCenterByIdActionSuccess([]));
      setEditingAuctionCenterData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getAuctionCenterByIdActionSuccess([]));
      setEditingAuctionCenterData(null);
      resetForm();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) => state.auctionCenter.uploadedDocuments.responseData
  );

  const [rows, setRows] = useState(
    getAllAuctionCenter || getSearchAuctionCenter
  );

  // useEffect(() => {
  //   // Update the searchAuctionCenterData state with the latest search results
  //   if (searchAuctionCenterData != null) {
  //     setGetSearchAuctionCenter(searchAuctionCenterData);
  //     setRows(searchAuctionCenterData);
  //   } else {
  //     setGetSearchAuctionCenter([]);
  //     setRows([]);
  //   }
  // }, [searchAuctionCenterData]);
  // useEffect(() => {
  //   const newRows = searchAuctionCenterData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [searchAuctionCenterData]);
  useEffect(() => {
    const newRows = searchAuctionCenterData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.auctionCenterId === newRow.auctionCenterId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [searchAuctionCenterData]);

  useEffect(() => {
    // Update the getAllAuctionCenter state with the initial data
    if (getAllAuctionCenterList) {
      setGetAllAuctionCenter(getAllAuctionCenterList);
    }
  }, [getAllAuctionCenterList]);

  let createData = useSelector(
    (state) => state.auctionCenter.createEditAuctionCenterApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditAuctionCenterApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getAuctionCenterByIdActionSuccess([]));
      setEditingAuctionCenterData(null);
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
      name: "auctionType",
      title: "Auction Variant",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center Name",
    },
    {
      name: "auctionCenterCode",
      title: "Auction Center Code",
    },
    {
      name: "certificateNo",
      title: "Auction Center Certificate Number",
    },
    {
      name: "regionName",
      title: "Region",
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
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };
      let searchData = {
        auctionCenterName: searchAuctionCenterName,
        auctionCenterCode: searchAuctionCenterCode,

        auctionCenterId:
          searchCertificateNo != ""
            ? parseInt(searchCertificateNo)
            : searchCertificateNo,
        stateId: searchStateId != "" ? parseInt(searchStateId) : searchStateId,
        isActive,
        pageNo: updatedData.pageNo,
        noOfRecords: updatedData.noOfRecords,
      };
      updatedData.searchData = searchData;
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateAuctionCenterAction(updatedData));
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
                id={`customSwitch${data.data.auctionCenterId}`} // Use a unique ID for each switch
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange} // Call the handler on
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.auctionCenterId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.auctionCenterId}`}
          >
            {data.data.isActive === 1 ? "Active" : "Inactive"}
          </label>
        )}
      </>
    );
  }

  const handleViewClick = (auctionCenterId) => {
    dispatch(getAuctionCenterByIdAction(auctionCenterId));
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
      <div class="Action">
        {modalRight?.some((ele) => ele === "7") && (
          <Tooltip title="Download" placement="top">
            <i
              className="fa fa-download"
              onClick={() => {
                handleDownloadClick(data.data.uploadDocumentConfId, "download");
              }}
            ></i>
          </Tooltip>
        )}

        <Tooltip title="Preview" placement="top">
          <i
           title="Preview"
            className="fa fa-eye"
            onClick={() => {
              handleDownloadClick(data.data.uploadDocumentConfId, "preview");
            }}
          ></i>
        </Tooltip>
      </div>
    );
  }

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_AuctionCenter";
    const moduleName = "AuctionCenter";
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
                onClick={() => handleEditClick(data.data.auctionCenterId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.auctionCenterId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.auctionCenterId);
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

  const resetForm = () => {
    setauctionTypeId("");
    setAuctionCenterName("");
    setAuctionCenterCode("");
    setCertificateNo("");
    setStateId("");
    const inputElement = document.getElementById("auctionCenterUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    setUploadDocumentRemarks("");
    setUploadedFiles([]);
    setUploadedDocuments([]);
    setEditingAuctionCenterData(null);
    setAuctionCenterCodeError("");
    setAuctionCenterNameError("");
    setCertificateNoError("");
    setRemarksError("");
    setUploadDocumentError("");
    setStateIdError("");
    setregionId("");
    setregionIdError("");
    setauctionTypeIdError("");
  };

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      auctionCenterName: searchAuctionCenterName,
      auctionCenterCode: searchAuctionCenterCode,

      auctionCenterId:
        searchCertificateNo != ""
          ? parseInt(searchCertificateNo)
          : searchCertificateNo,
      stateId: searchStateId != "" ? parseInt(searchStateId) : searchStateId,
      isActive,
      url: "/admin/auctionCenter/search",
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
          "AuctionCenterDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "AuctionCenterDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id =
      editingAuctionCenterDataFromState &&
      editingAuctionCenterDataFromState.auctionCenterId;
    let searchData = {
      url: `/admin/auctionCenter/get/${id}/${exportType}`,
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
          "AuctionCenterDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "AuctionCenterDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleCloseViewModal = () => {
    setViewModal(false);
    //To get all data for dropdown
    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
        sortColumn: "auctionCenterCode",
      })
    );
    //Serch API call
    // dispatch(searchAuctionCenterAction({}));
    clearSearch();
    setViewMode(false);
    dispatch(getAuctionCenterByIdActionSuccess([]));
    setEditingAuctionCenterData(null);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    //To get all data for dropdown
    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
        sortColumn: "auctionCenterCode",
      })
    );
    //Serch API call
    // dispatch(searchAuctionCenterAction({}));
    clearSearch();
    setViewMode(false);
    dispatch(getAuctionCenterByIdActionSuccess([]));
    setEditingAuctionCenterData(null);
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
            <Typography>Create Auction Center</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Variant</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingAuctionCenterData?.auctionTypeMasterId ||
                            auctionTypeId
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingAuctionCenterData
                              ? setEditingAuctionCenterData({
                                  ...editingAuctionCenterData,
                                  auctionTypeMasterId: e.target.value,
                                })
                              : setauctionTypeId(e.target.value))
                          }
                          disabled={viewMode}
                        >
                          <option value="">Select Auction Variant</option>
                          {allAuctionTypeData?.map((state) => (
                            <option
                              key={state.auctionTypeMasterId}
                              value={state.auctionTypeMasterId}
                            >
                              {state.auctionType}
                            </option>
                          ))}
                        </select>
                        {auctionTypeIdError && (
                          <p className="errorLabel">{auctionTypeIdError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            editingAuctionCenterData?.auctionCenterName ||
                            auctionCenterName
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingAuctionCenterData
                              ? setEditingAuctionCenterData({
                                  ...editingAuctionCenterData,
                                  auctionCenterName: e.target.value,
                                })
                              : setAuctionCenterName(e.target.value))
                          }
                          maxLength="100"
                          disabled={viewMode}
                        />
                        {auctionCenterNameError && (
                          <p className="errorLabel">{auctionCenterNameError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="10"
                          value={
                            editingAuctionCenterData?.auctionCenterCode ||
                            auctionCenterCode
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingAuctionCenterData
                              ? setEditingAuctionCenterData({
                                  ...editingAuctionCenterData,
                                  auctionCenterCode: e.target.value,
                                })
                              : setAuctionCenterCode(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {auctionCenterCodeError && (
                          <p className="errorLabel">{auctionCenterCodeError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center Certificate Number</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="20"
                          value={
                            editingAuctionCenterData?.certificateNo ||
                            certificateNo
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingAuctionCenterData
                              ? setEditingAuctionCenterData({
                                  ...editingAuctionCenterData,
                                  certificateNo: e.target.value,
                                })
                              : setCertificateNo(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {certificateNoError && (
                          <p className="errorLabel">{certificateNoError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Name</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingAuctionCenterData?.stateId || stateId}
                          onChange={(e) =>
                            !viewMode &&
                            (editingAuctionCenterData
                              ? setEditingAuctionCenterData({
                                  ...editingAuctionCenterData,
                                  stateId: e.target.value,
                                })
                              : setStateId(e.target.value))
                          }
                          disabled={viewMode}
                        >
                          <option value="">Select State</option>
                          {isActiveStateData?.map((state) => (
                            <option key={state.stateId} value={state.stateId}>
                              {state.stateName}
                            </option>
                          ))}
                        </select>
                        {stateIdError && (
                          <p className="errorLabel">{stateIdError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Region</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingAuctionCenterData?.regionId || regionId}
                          onChange={(e) =>
                            !viewMode &&
                            (editingAuctionCenterData
                              ? setEditingAuctionCenterData({
                                  ...editingAuctionCenterData,
                                  regionId: e.target.value,
                                })
                              : setregionId(e.target.value))
                          }
                          disabled={viewMode}
                        >
                          <option value="">Select Region</option>
                          {getAllAuctionCenterRegion?.map((state) => (
                            <option key={state.stateId} value={state.regionId}>
                              {state.regionName}
                            </option>
                          ))}
                        </select>
                        {regionIdError && (
                          <p className="errorLabel">{regionIdError}</p>
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
                            inputId="auctionCenterUpload"
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

                    {/* {!viewMode ? (
                    <div className="col-md-12">
                      <div className="BtnGroup">
                        {modalRight?.some((ele) => ele === "1") && (
                          <button
                            className="SubmitBtn"
                            onClick={handleSubmit}
                            disabled={viewMode}
                          >
                            {editingAuctionCenterData ? "Update" : "Submit"}
                          </button>
                        )}
                        <button
                          className="Clear"
                          onClick={resetForm}
                          disabled={viewMode}
                        >
                          Clear
                        </button>
                      </div>
                    </div> */}
                    {!viewMode ? (
                      <>
                        <div className="col-md-12">
                          <div className="BtnGroup">
                            {modalRight?.some((ele) => ele === "2") &&
                              editingAuctionCenterData && (
                                <button
                                  className="SubmitBtn"
                                  onClick={handleSubmit}
                                  disabled={viewMode}
                                >
                                  Update
                                </button>
                              )}
                            {modalRight?.some((ele) => ele === "1") &&
                              !editingAuctionCenterData && (
                                <>
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
                                </>
                              )}
                          </div>
                        </div>
                      </>
                    ) : (
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
                    )}
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
          title={"Edit Auction Center"}
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
                    <label>Auction Variant</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={
                        editingAuctionCenterData?.auctionTypeMasterId ||
                        auctionTypeId
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingAuctionCenterData
                          ? setEditingAuctionCenterData({
                              ...editingAuctionCenterData,
                              auctionTypeMasterId: e.target.value,
                            })
                          : setauctionTypeId(e.target.value))
                      }
                    >
                      <option value="">Select Auction Variant</option>
                      {allAuctionTypeData?.map((state) => (
                        <option
                          key={state.auctionTypeMasterId}
                          value={state.auctionTypeMasterId}
                        >
                          {state.auctionType}
                        </option>
                      ))}
                    </select>
                    {auctionTypeIdError && (
                      <p className="errorLabel">{auctionTypeIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Auction Center Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        editingAuctionCenterData?.auctionCenterName ||
                        auctionCenterName
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingAuctionCenterData
                          ? setEditingAuctionCenterData({
                              ...editingAuctionCenterData,
                              auctionCenterName: e.target.value,
                            })
                          : setAuctionCenterName(e.target.value))
                      }
                      maxLength="100"
                    />
                    {auctionCenterNameError && (
                      <p className="errorLabel">{auctionCenterNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Auction Center Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={
                        editingAuctionCenterData?.auctionCenterCode ||
                        auctionCenterCode
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingAuctionCenterData
                          ? setEditingAuctionCenterData({
                              ...editingAuctionCenterData,
                              auctionCenterCode: e.target.value,
                            })
                          : setAuctionCenterCode(e.target.value))
                      }
                    />
                    {auctionCenterCodeError && (
                      <p className="errorLabel">{auctionCenterCodeError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Auction Center Certificate Number</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="20"
                      value={
                        editingAuctionCenterData?.certificateNo || certificateNo
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingAuctionCenterData
                          ? setEditingAuctionCenterData({
                              ...editingAuctionCenterData,
                              certificateNo: e.target.value,
                            })
                          : setCertificateNo(e.target.value))
                      }
                    />
                    {certificateNoError && (
                      <p className="errorLabel">{certificateNoError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingAuctionCenterData?.stateId || stateId}
                      onChange={(e) =>
                        !viewMode &&
                        (editingAuctionCenterData
                          ? setEditingAuctionCenterData({
                              ...editingAuctionCenterData,
                              stateId: e.target.value,
                            })
                          : setStateId(e.target.value))
                      }
                    >
                      <option value="">Select State</option>
                      {isActiveStateData?.map((state) => (
                        <option key={state.stateId} value={state.stateId}>
                          {state.stateName}
                        </option>
                      ))}
                    </select>
                    {stateIdError && (
                      <p className="errorLabel">{stateIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Region</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingAuctionCenterData?.regionId || regionId}
                      onChange={(e) =>
                        !viewMode &&
                        (editingAuctionCenterData
                          ? setEditingAuctionCenterData({
                              ...editingAuctionCenterData,
                              regionId: e.target.value,
                            })
                          : setregionId(e.target.value))
                      }
                      disabled={viewMode}
                    >
                      <option value="">Select Region</option>
                      {getAllAuctionCenterRegion?.map((state) => (
                        <option key={state.stateId} value={state.regionId}>
                          {state.regionName}
                        </option>
                      ))}
                    </select>
                    {regionIdError && (
                      <p className="errorLabel">{regionIdError}</p>
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
                        inputId="auctionCenterUpload"
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
          title={"View Auction center"}
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
                    <label>Auction Variant</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={
                        editingAuctionCenterData?.auctionTypeMasterId ||
                        auctionTypeId
                      }
                      disabled={viewMode}
                    >
                      <option value="">Select Auction Variant</option>
                      {allAuctionTypeData?.map((state) => (
                        <option
                          key={state.auctionTypeMasterId}
                          value={state.auctionTypeMasterId}
                        >
                          {state.auctionType}
                        </option>
                      ))}
                    </select>
                    {auctionTypeIdError && (
                      <p className="errorLabel">{auctionTypeIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Auction Center Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        editingAuctionCenterData?.auctionCenterName ||
                        auctionCenterName
                      }
                      maxLength="100"
                      disabled={viewMode}
                    />
                    {auctionCenterNameError && (
                      <p className="errorLabel">{auctionCenterNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Auction Center Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={
                        editingAuctionCenterData?.auctionCenterCode ||
                        auctionCenterCode
                      }
                      disabled={viewMode}
                    />
                    {auctionCenterCodeError && (
                      <p className="errorLabel">{auctionCenterCodeError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Auction Center Certificate Number</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="20"
                      value={
                        editingAuctionCenterData?.certificateNo || certificateNo
                      }
                      disabled={viewMode}
                    />
                    {certificateNoError && (
                      <p className="errorLabel">{certificateNoError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingAuctionCenterData?.stateId || stateId}
                      disabled={viewMode}
                    >
                      <option value="">Select State</option>
                      {isActiveStateData?.map((state) => (
                        <option key={state.stateId} value={state.stateId}>
                          {state.stateName}
                        </option>
                      ))}
                    </select>
                    {stateIdError && (
                      <p className="errorLabel">{stateIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Region</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingAuctionCenterData?.regionId || regionId}
                      disabled={viewMode}
                    >
                      <option value="">Select Region</option>
                      {getAllAuctionCenterRegion?.map((state) => (
                        <option key={state.stateId} value={state.regionId}>
                          {state.regionName}
                        </option>
                      ))}
                    </select>
                    {regionIdError && (
                      <p className="errorLabel">{regionIdError}</p>
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
            <Typography>Manage Auction Center</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Variant</label>
                        {/* <label className="errorLabel"> * </label> */}
                        <select
                          className="form-control select-form"
                          value={searchAuctionCenterType}
                          onChange={(e) =>
                            setSearchAuctionCenterType(e.target.value)
                          }
                        >
                          <option value="">Select Auction Variant</option>
                          {allAuctionTypeData?.map((state) => (
                            <option
                              key={state.auctionTypeMasterId}
                              value={state.auctionTypeMasterId}
                            >
                              {state.auctionType}
                            </option>
                          ))}
                        </select>
                        {stateIdError && (
                          <p className="errorLabel">{stateIdError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchAuctionCenterName}
                          onChange={(e) =>
                            setSearchAuctionCenterName(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center Code</label>
                        <select
                          className="form-control select-form"
                          value={searchAuctionCenterCode}
                          onChange={(e) =>
                            setSearchAuctionCenterCode(e.target.value)
                          }
                        >
                          <option value={0}>Select Auction Center Code</option>
                          {getAllAuctionCenterList?.map((state) => (
                            <option
                              key={state?.auctionCenterId}
                              value={state?.auctionCenterCode}
                            >
                              {state.auctionCenterCode}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center Certificate Number</label>
                        {/* <input
                    type="text"
                    className="form-control"
                    value={searchCertificateNo}
                    onChange={(e) => setSearchCertificateNo(e.target.value)}
                  /> */}
                        <select
                          className="form-control select-form"
                          value={searchCertificateNo}
                          onChange={(e) =>
                            setSearchCertificateNo(e.target.value)
                          }
                        >
                          <option value={0}>
                            Select Auction Center Certificate Number
                          </option>
                          {getAllAuctionCenterList?.map((state) => (
                            <option
                              key={state?.auctionCenterId}
                              value={state?.auctionCenterId}
                            >
                              {state.certificateNo}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Name</label>
                        <select
                          className="form-control select-form"
                          value={searchStateId}
                          onChange={(e) => setSearchStateId(e.target.value)}
                        >
                          <option value="">Select State</option>
                          {isActiveStateData?.map((state) => (
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
                      searchAuctionCenterData &&
                      searchAuctionCenterData.length < 19
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
                // rows={rows}
                // setRows={setRows}
                rows={
                  getAllUploadedDoc == undefined || getAllUploadedDoc == null
                    ? []
                    : getAllUploadedDoc?.map((row, index) => ({
                        ...row,
                        index: index + 1,
                      }))
                }
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
          title={"Auction Center"}
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

export default CreateAuctionCenter;
