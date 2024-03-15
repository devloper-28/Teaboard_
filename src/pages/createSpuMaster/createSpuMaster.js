import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import {
  getDocumentByIdActionSuccess,
  createSpuAction,
  updateSpuAction,
  getSpuByIdAction,
  getSpuByIdActionSuccess,
  getAllAuctionCenterAction,
  getAllAuctionCenterAscAction,
  searchSpuAction,
  uploadAllDocumentsSpuAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getAllCategoriesAction,
  getAllCategoriesAscAction,
  getAllTeaTypes,
  getAllTeaTypesAsc,
  getAllGrades,
  createEditSpuApiStatus,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, Form, Modal } from "react-bootstrap";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
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

function CreateSpuMasterDetail({ open, setOpen, modalRight }) {
  const getSpuData = useSelector(
    (state) => state?.createSpu?.getAllSpuActionSuccess?.responseData
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewModal, setPreviewModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [teaTypeId, setteaTypeId] = useState("");
  const [gradeId, setgradeId] = useState("");
  const [spuquantity, setspuquantity] = useState("");
  const [manufacturingPeriod, setmanufacturingPeriod] = useState("");
  const [minLotSize, setminLotSize] = useState("");
  const [factoryAnnualCapacity, setfactoryAnnualCapacity] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState("");
  const [documentMode, setDocumentmode] = useState("");
  const [editingSpuData, setEditingSpuData] = useState(null);
  const [getAllSpu, setGetAllSpu] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [searchauctionCenterId, setsearchauctionCenterId] = useState("");
  const [searchgradeId, setsearchgradeId] = useState("");
  const [searchcategoryId, setsearchcategoryId] = useState("");
  const [searchteaTypeId, setsearchteaTypeId] = useState("");
  const [getSearchSpu, setGetSearchSpu] = useState([]);
  const [remarksError, setRemarksError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [exportType, setexportType] = useState("");

  const [isActive, setIsActive] = useState("");
  const [dataById, setDataById] = useState("");
  const [handleSwitchClick, setHandleSwitchClick] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [teaTypeIdError, setteaTypeIdError] = useState("");
  const [gradeIdError, setgradeIdError] = useState("");
  const [spuquantityError, setspuquantityError] = useState("");
  const [manufacturingPeriodError, setmanufacturingPeriodError] = useState("");
  const [minLotSizeError, setminLotSizeError] = useState("");
  const [factoryAnnualCapacityError, setfactoryAnnualCapacityError] =
    useState("");
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [categoryIdError, setcategoryIdError] = useState("");
  const [categoryId, setcategoryId] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setteaTypeIdError("");
    setgradeIdError("");
    setcategoryIdError("");
    setspuquantityError("");
    setmanufacturingPeriodError("");
    setminLotSizeError("");
    setfactoryAnnualCapacityError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");

    let isValid = true;

    if (!teaTypeId) {
      CustomToast.error("Please select a tea type from the dropdown menu");
      isValid = false;
      return;
    }

    if (!gradeId) {
      CustomToast.error("Please select a grade from the dropdown list");
      isValid = false;
      return;
    }

    if (!categoryId) {
      CustomToast.error("Please select category name");
      isValid = false;
      return;
    }

    if (!spuquantity) {
      CustomToast.error("Please enter the SPU quantity");
      isValid = false;
      return;
    }

    if (!manufacturingPeriod.trim()) {
      CustomToast.error("Please enter the manufacturing period");
      isValid = false;
      return;
    }
    if (!minLotSize.trim()) {
      CustomToast.error("Please enter the minimum lot size");
      isValid = false;
      return;
    }
    if (!factoryAnnualCapacity.trim()) {
      CustomToast.error("Please enter the factory annual capacity");
      isValid = false;
      return;
    }
    if (!auctionCenterId) {
      CustomToast.error("Please select an auction center name from the list");
      isValid = false;
      return;
    }

    // if (!editingSpuData) {
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
    //   setUploadDocumentError("");
    //   setRemarksError("");
    // }

    if (!isValid) {
      return;
    }

    const newStateData = {
      teaTypeId: teaTypeId,
      gradeId: gradeId,
      manufacturingPeriod: manufacturingPeriod,
      spuQuantity: spuquantity,
      minLotSize: minLotSize,
      factoryAnnualCapacity: factoryAnnualCapacity,
      auctionCenterId: auctionCenterId,
      downloadDto: uploadedDocuments,
      isActive: 1,
      categoryId: categoryId,
      searchData: {
        pageNo: 1,
        noOfRecords: NO_OF_RECORDS,
      },
      // searchasd: {
      //   sortBy: "asc",
      //   sortColumn: "roleName",
      // },
    };
    try {
      if (editingSpuData) {
        const isFormModified =
          teaTypeId !== editingSpuData.teaTypeId ||
          gradeId !== editingSpuData.gradeId ||
          categoryId !== editingSpuData.categoryId ||
          manufacturingPeriod !== editingSpuData.manufacturingPeriod ||
          auctionCenterId !== editingSpuData.auctionCenterId ||
          spuquantity != editingSpuData.spuquantity ||
          minLotSize !== editingSpuData.minLotSize ||
          factoryAnnualCapacity !== editingSpuData.contactPersonAddress ||
          uploadDocumentRemarks !== editingSpuData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingSpuData.downloadDto.length;
        if (isFormModified) {
          editingSpuData.spuQuantity = editingSpuData.spuquantity;
          editingSpuData.searchData = {
            teaTypeId: searchteaTypeId,
            auctionCenterId: searchauctionCenterId,
            gradeId: searchgradeId,
            categoryId: searchcategoryId,
            isActive,
            pageNo: pageNo,
            noOfRecords: NO_OF_RECORDS,
          };
          editingSpuData.uploadDocumentRemarks = uploadDocumentRemarks;
          editingSpuData.downloadDto = uploadedDocuments;

          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(updateSpuAction(editingSpuData));
          }, 1000);
        } else {
          setExpanded("panel2");
        }
      } else {
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          setRows([]);
          dispatch(createSpuAction(newStateData));
        }, 1000);
      }
      // handleClear();
      // setEditingSpuData(null);
      // clearSearch();
      // setExpanded("panel2");
    } catch (error) {}
  };
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchSpuAction({
        teaTypeId: searchteaTypeId,
        auctionCenterId: searchauctionCenterId,
        gradeId: searchgradeId,
        categoryId: searchcategoryId,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchSpuAction({
        teaTypeId: searchteaTypeId,
        auctionCenterId: searchauctionCenterId,
        gradeId: searchgradeId,
        categoryId: searchcategoryId,
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

  const searchSpuData = useSelector(
    (state) => state.createSpu.searchResults.responseData
  );

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    const inputElement = document.getElementById("spuUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    removeFile();
  };

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      teaTypeId: searchteaTypeId,
      auctionCenterId: searchauctionCenterId,
      gradeId: searchgradeId,
      categoryId: searchcategoryId,
      isActive: isActive != "" ? parseInt(isActive) : isActive,
      url: "/admin/SPUMaster/search",
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
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
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
        Base64ToExcelDownload(getExportDataResponse, "SpuDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "SpuDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const clearSearch = () => {
    setsearchcategoryId("");
    setsearchauctionCenterId("");
    setsearchgradeId("");
    setIsActive("");
    setsearchteaTypeId("");
    setRows([]);
    pageNo = 1;
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(searchSpuAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS }));
    }, 1000);

    setRows(getAllSpu);
  };

  const handleViewClick = (spuMasterId) => {
    dispatch(getSpuByIdAction(spuMasterId));
    setViewMode(true);
    // setExpanded("panel1");
    setViewModal(true);
  };

  const handleEditClick = (spuMasterId) => {
    setViewMode(false);
    dispatch(getSpuByIdAction(spuMasterId));
    // setExpanded("panel1");
    setEditModal(true);
  };

  const editingSpuDataFromAc = useSelector(
    (state) => state.createSpu.SpuData.responseData
  );

  useEffect(() => {
    if (editingSpuDataFromAc) {
      setEditingSpuData(editingSpuDataFromAc);
      setauctionCenterId(editingSpuDataFromAc.auctionCenterId || "");
      setteaTypeId(editingSpuDataFromAc.teaTypeId || "");
      setgradeId(editingSpuDataFromAc.gradeId || "");
      setmanufacturingPeriod(editingSpuDataFromAc.manufacturingPeriod || "");
      setspuquantity(editingSpuDataFromAc.spuquantity || "");
      setminLotSize(editingSpuDataFromAc.minLotSize || "");
      setfactoryAnnualCapacity(
        editingSpuDataFromAc.factoryAnnualCapacity || ""
      );
      setUploadDocumentRemarks(
        editingSpuDataFromAc.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingSpuDataFromAc.downloadDto || []);
      setcategoryId(editingSpuDataFromAc.categoryId || "");
    } else {
      setEditingSpuData(null);
      // dispatch(fetchSpu());
      dispatch(
        getAllAuctionCenterAscAction({
          sortBy: "asc",
          sortColumn: "auctionCenterName",
        })
      );
      dispatch(getAllGrades());
      dispatch(
        getAllTeaTypesAsc({
          sortBy: "desc",
          sortColumn: "teaTypeName",
        })
      );
      dispatch(
        getAllCategoriesAscAction({
          sortBy: "asc",
          sortColumn: "categoryCode",
        })
      );
      resetForm();
    }
  }, [editingSpuDataFromAc]);

  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingSpuDataFromAc && editingSpuDataFromAc.spuMasterId;
    let searchData = {
      url: `/admin/SPUMaster/get/${id}/${exportType}`,
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
        Base64ToExcelDownload(getExportViewDataResponse, "SpuDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "SpuDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const getAllGradeResponse = useSelector(
    (state) => state.gradeManage.allGrades.responseData
  );

  const getAllGrade =
    getAllGradeResponse &&
    getAllGradeResponse.filter((data) => 1 == data.isActive);

  const getAllTeaTypeResponse = useSelector(
    (state) => state.teaTypeManage?.allTeaTypesAsc?.responseData
  );

  const getAllTeaType =
    getAllTeaTypeResponse &&
    getAllTeaTypeResponse.filter((data) => 1 == data.isActive);

  const getAllCategoryResponse = useSelector(
    (state) => state.categoryManage?.allCategoriesAsc?.responseData
  );

  const getAllCategory =
    getAllCategoryResponse &&
    getAllCategoryResponse.filter((data) => 1 == data.isActive);

  const [rows, setRows] = useState(getAllSpu || getSearchSpu);

  // useEffect(() => {
  //   if (searchSpuData != null && searchSpuData != undefined) {
  //     setGetSearchSpu(searchSpuData);
  //     setRows(searchSpuData);
  //   } else {
  //     setGetSearchSpu([]);
  //     setRows([]);
  //   }
  // }, [searchSpuData]);
  useEffect(() => {
    const newRows = searchSpuData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.spuMasterId === newRow.spuMasterId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [searchSpuData]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchTaxMasterAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getSpuByIdActionSuccess([]));
      setEditingSpuData(null);
      handleClear();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsSpuAction());
      setViewMode(false);
      dispatch(getSpuByIdActionSuccess([]));
      setEditingSpuData(null);
      handleClear();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getSpuByIdActionSuccess([]));
      setEditingSpuData(null);
      handleClear();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.createSpu &&
      state.createSpu.uploadedDocuments &&
      state.createSpu.uploadedDocuments.responseData
  );

  const switchSpuDataFromAc = useSelector(
    (state) => state.createSpu.SpuData.responseData
  );

  useEffect(() => {
    if (switchSpuDataFromAc && handleSwitchClick) {
      let searchData = {
        teaTypeId: searchteaTypeId,
        auctionCenterId: searchauctionCenterId,
        gradeId: searchgradeId,
        categoryId: searchcategoryId,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };
      const updatedData = {
        ...switchSpuDataFromAc,
        isActive: switchSpuDataFromAc.isActive === 1 ? 0 : 1,
        spuQuantity: switchSpuDataFromAc.spuquantity,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };
      updatedData.searchData = searchData;

      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateSpuAction(updatedData));
      }, 1000);

      dispatch(getSpuByIdActionSuccess([]));
      setHandleSwitchClick(false);
    }
  }, [switchSpuDataFromAc]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center",
    },
    {
      name: "teaTypeName",
      title: "Tea type",
    },
    {
      name: "categoryName",
      title: "Category",
    },
    {
      name: "gradeName",
      title: "Grade",
    },
    {
      name: "spuquantity",
      title: "SPU Quantity",
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
      setHandleSwitchClick(true);
      dispatch(getSpuByIdAction(data.data.spuMasterId));
    };

    return (
      <>
        {modalRight?.some((ele) => ele === "5") ? (
          <div class="Switch">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id={`customSwitch${data.data.spuMasterId}`}
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange}
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.spuMasterId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.spuMasterId}`}
          >
            {data.data.isActive === 1 ? "Active" : "Inactive"}
          </label>
        )}
      </>
    );
  }

  function ActionData(data) {
    return (
      <>
        <div class="Action">
          {modalRight?.some((ele) => ele === "2") && (
            <Tooltip title="Edit" placement="top">
              <i
                className="fa fa-edit"
                onClick={() => handleEditClick(data.data.spuMasterId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.spuMasterId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.spuMasterId);
                }}
              ></i>
            </Tooltip>
          )}
        </div>
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

  const resetForm = () => {
    setauctionCenterId("");
    setteaTypeId("");
    setgradeId("");
    setmanufacturingPeriod("");
    setspuquantity("");
    setminLotSize("");
    setfactoryAnnualCapacity("");
    setteaTypeIdError("");
    setgradeIdError("");
    setcategoryIdError("");
    setspuquantityError("");
    setmanufacturingPeriodError("");
    setminLotSizeError("");
    setfactoryAnnualCapacityError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setauctionCenterId("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setEditingSpuData(null);
    setcategoryId("");
    setUploadDocumentRemarks("");
    setUploadedFiles([]);
    setUploadedDocuments([]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_SPUMaster";
    const moduleName = "SPUMaster";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
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

  let createData = useSelector(
    (state) => state.createSpu.createEditSpuApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditSpuApiStatus(false));
      setExpanded("panel2");
      handleClear();
      dispatch(getSpuByIdActionSuccess([]));
      setEditingSpuData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });

  const handleCloseViewModal = () => {
    setViewModal(false);
    //Serch API call
    // dispatch(searchTaxMasterAction({}));
    clearSearch();
    setViewMode(false);
    dispatch(getSpuByIdActionSuccess([]));
    setEditingSpuData(null);
    handleClear();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    //Serch API call
    // dispatch(searchTaxMasterAction({}));
    clearSearch();
    setViewMode(false);
    dispatch(getSpuByIdActionSuccess([]));
    setEditingSpuData(null);
    handleClear();
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
            <Typography>Create Spu Master</Typography>
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
                            editingSpuData?.auctionCenterId || auctionCenterId
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingSpuData
                              ? setEditingSpuData({
                                  ...editingSpuData,
                                  auctionCenterId: e.target.value,
                                })
                              : setauctionCenterId(e.target.value))
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Select Auction Center</option>
                          {getAllAuctionCenter?.map((state) => (
                            <option
                              key={state.auctionCenterId}
                              value={state.auctionCenterId}
                            >
                              {state.auctionCenterName}
                            </option>
                          ))}
                        </select>

                        {auctionCenterIdError && (
                          <p className="errorLabel">{auctionCenterIdError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea Type Name</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingSpuData?.teaTypeId || teaTypeId}
                          onChange={(e) =>
                            !viewMode &&
                            (editingSpuData
                              ? setEditingSpuData({
                                  ...editingSpuData,
                                  teaTypeId: e.target.value,
                                })
                              : setteaTypeId(e.target.value))
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Select Tea Type</option>
                          {getAllTeaType?.map((state) => (
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

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Grade Name</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingSpuData?.gradeId || gradeId}
                          onChange={(e) =>
                            !viewMode &&
                            (editingSpuData
                              ? setEditingSpuData({
                                  ...editingSpuData,
                                  gradeId: e.target.value,
                                })
                              : setgradeId(e.target.value))
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Select Grade</option>
                          {getAllGrade?.map((state) => (
                            <option key={state.gradeId} value={state.gradeId}>
                              {state.gradeName}
                            </option>
                          ))}
                        </select>

                        {gradeIdError && (
                          <p className="errorLabel">{gradeIdError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Category</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingSpuData?.categoryId || categoryId}
                          onChange={(e) =>
                            !viewMode &&
                            (editingSpuData
                              ? setEditingSpuData({
                                  ...editingSpuData,
                                  categoryId: e.target.value,
                                })
                              : setcategoryId(e.target.value))
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Search Category</option>
                          {getAllCategory?.map((state) => (
                            <option
                              key={state.categoryId}
                              value={state.categoryId}
                            >
                              {state.categoryName}
                            </option>
                          ))}
                        </select>
                        {categoryIdError && (
                          <p className="errorLabel">{categoryIdError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Manufacturing period</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="100"
                          className="form-control"
                          value={
                            editingSpuData?.manufacturingPeriod ||
                            manufacturingPeriod
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingSpuData
                              ? setEditingSpuData({
                                  ...editingSpuData,
                                  manufacturingPeriod: e.target.value,
                                })
                              : setmanufacturingPeriod(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {manufacturingPeriodError && (
                          <p className="errorLabel">
                            {manufacturingPeriodError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Minimum Lot Size</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingSpuData?.minLotSize || minLotSize}
                          onChange={(e) =>
                            !viewMode &&
                            (editingSpuData
                              ? setEditingSpuData({
                                  ...editingSpuData,
                                  minLotSize: e.target.value,
                                })
                              : setminLotSize(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {minLotSizeError && (
                          <p className="errorLabel">{minLotSizeError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Factory Annual Capacity</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="100"
                          className="form-control"
                          value={
                            editingSpuData?.factoryAnnualCapacity ||
                            factoryAnnualCapacity
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingSpuData
                              ? setEditingSpuData({
                                  ...editingSpuData,
                                  factoryAnnualCapacity: e.target.value,
                                })
                              : setfactoryAnnualCapacity(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {factoryAnnualCapacityError && (
                          <p className="errorLabel">
                            {factoryAnnualCapacityError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>SPU Quantity</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="3"
                          className="form-control"
                          value={editingSpuData?.spuquantity || spuquantity}
                          onChange={(e) =>
                            editingSpuData
                              ? setEditingSpuData({
                                  ...editingSpuData,
                                  spuquantity: e.target.value,
                                })
                              : setspuquantity(e.target.value)
                          }
                          disabled={viewMode}
                        />
                        {spuquantityError && (
                          <p className="errorLabel">{spuquantityError}</p>
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
                            inputId="spuUpload"
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
                          onClick={handleClear}
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
          title={"Edit Spu Master"}
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
                      value={editingSpuData?.auctionCenterId || auctionCenterId}
                      onChange={(e) =>
                        !viewMode &&
                        (editingSpuData
                          ? setEditingSpuData({
                              ...editingSpuData,
                              auctionCenterId: e.target.value,
                            })
                          : setauctionCenterId(e.target.value))
                      }
                      disabled={viewMode}
                    >
                      <option value={0}>Select Auction Center</option>
                      {getAllAuctionCenter?.map((state) => (
                        <option
                          key={state.auctionCenterId}
                          value={state.auctionCenterId}
                        >
                          {state.auctionCenterName}
                        </option>
                      ))}
                    </select>

                    {auctionCenterIdError && (
                      <p className="errorLabel">{auctionCenterIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Tea Type Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingSpuData?.teaTypeId || teaTypeId}
                      onChange={(e) =>
                        !viewMode &&
                        (editingSpuData
                          ? setEditingSpuData({
                              ...editingSpuData,
                              teaTypeId: e.target.value,
                            })
                          : setteaTypeId(e.target.value))
                      }
                      disabled={viewMode}
                    >
                      <option value={0}>Select Tea Type</option>
                      {getAllTeaType?.map((state) => (
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

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Grade Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingSpuData?.gradeId || gradeId}
                      onChange={(e) =>
                        !viewMode &&
                        (editingSpuData
                          ? setEditingSpuData({
                              ...editingSpuData,
                              gradeId: e.target.value,
                            })
                          : setgradeId(e.target.value))
                      }
                      disabled={viewMode}
                    >
                      <option value={0}>Select Grade</option>
                      {getAllGrade?.map((state) => (
                        <option key={state.gradeId} value={state.gradeId}>
                          {state.gradeName}
                        </option>
                      ))}
                    </select>

                    {gradeIdError && (
                      <p className="errorLabel">{gradeIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Category</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingSpuData?.categoryId || categoryId}
                      onChange={(e) =>
                        !viewMode &&
                        (editingSpuData
                          ? setEditingSpuData({
                              ...editingSpuData,
                              categoryId: e.target.value,
                            })
                          : setcategoryId(e.target.value))
                      }
                      disabled={viewMode}
                    >
                      <option value={0}>Search Category</option>
                      {getAllCategory?.map((state) => (
                        <option key={state.categoryId} value={state.categoryId}>
                          {state.categoryName}
                        </option>
                      ))}
                    </select>
                    {categoryIdError && (
                      <p className="errorLabel">{categoryIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Manufacturing period</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="100"
                      className="form-control"
                      value={
                        editingSpuData?.manufacturingPeriod ||
                        manufacturingPeriod
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingSpuData
                          ? setEditingSpuData({
                              ...editingSpuData,
                              manufacturingPeriod: e.target.value,
                            })
                          : setmanufacturingPeriod(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {manufacturingPeriodError && (
                      <p className="errorLabel">{manufacturingPeriodError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Minimum Lot Size</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingSpuData?.minLotSize || minLotSize}
                      onChange={(e) =>
                        !viewMode &&
                        (editingSpuData
                          ? setEditingSpuData({
                              ...editingSpuData,
                              minLotSize: e.target.value,
                            })
                          : setminLotSize(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {minLotSizeError && (
                      <p className="errorLabel">{minLotSizeError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Factory Annual Capacity</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="100"
                      className="form-control"
                      value={
                        editingSpuData?.factoryAnnualCapacity ||
                        factoryAnnualCapacity
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingSpuData
                          ? setEditingSpuData({
                              ...editingSpuData,
                              factoryAnnualCapacity: e.target.value,
                            })
                          : setfactoryAnnualCapacity(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {factoryAnnualCapacityError && (
                      <p className="errorLabel">{factoryAnnualCapacityError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>SPU Quantity</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="3"
                      className="form-control"
                      value={editingSpuData?.spuquantity || spuquantity}
                      onChange={(e) =>
                        editingSpuData
                          ? setEditingSpuData({
                              ...editingSpuData,
                              spuquantity: e.target.value,
                            })
                          : setspuquantity(e.target.value)
                      }
                      disabled={viewMode}
                    />
                    {spuquantityError && (
                      <p className="errorLabel">{spuquantityError}</p>
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
                        inputId="spuUpload"
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
          title={"View Spu Master"}
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
                      value={editingSpuData?.auctionCenterId || auctionCenterId}
                      disabled={viewMode}
                    >
                      <option value={0}>Select Auction Center</option>
                      {getAllAuctionCenter?.map((state) => (
                        <option
                          key={state.auctionCenterId}
                          value={state.auctionCenterId}
                        >
                          {state.auctionCenterName}
                        </option>
                      ))}
                    </select>

                    {auctionCenterIdError && (
                      <p className="errorLabel">{auctionCenterIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Tea Type Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingSpuData?.teaTypeId || teaTypeId}
                      disabled={viewMode}
                    >
                      <option value={0}>Select Tea Type</option>
                      {getAllTeaType?.map((state) => (
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

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Grade Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingSpuData?.gradeId || gradeId}
                      disabled={viewMode}
                    >
                      <option value={0}>Select Grade</option>
                      {getAllGrade?.map((state) => (
                        <option key={state.gradeId} value={state.gradeId}>
                          {state.gradeName}
                        </option>
                      ))}
                    </select>

                    {gradeIdError && (
                      <p className="errorLabel">{gradeIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Category</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingSpuData?.categoryId || categoryId}
                      disabled={viewMode}
                    >
                      <option value={0}>Search Category</option>
                      {getAllCategory?.map((state) => (
                        <option key={state.categoryId} value={state.categoryId}>
                          {state.categoryName}
                        </option>
                      ))}
                    </select>
                    {categoryIdError && (
                      <p className="errorLabel">{categoryIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Manufacturing period</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="100"
                      className="form-control"
                      value={
                        editingSpuData?.manufacturingPeriod ||
                        manufacturingPeriod
                      }
                      disabled={viewMode}
                    />
                    {manufacturingPeriodError && (
                      <p className="errorLabel">{manufacturingPeriodError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Minimum Lot Size</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingSpuData?.minLotSize || minLotSize}
                      disabled={viewMode}
                    />
                    {minLotSizeError && (
                      <p className="errorLabel">{minLotSizeError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Factory Annual Capacity</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="100"
                      className="form-control"
                      value={
                        editingSpuData?.factoryAnnualCapacity ||
                        factoryAnnualCapacity
                      }
                      disabled={viewMode}
                    />
                    {factoryAnnualCapacityError && (
                      <p className="errorLabel">{factoryAnnualCapacityError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>SPU Quantity</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="3"
                      className="form-control"
                      value={editingSpuData?.spuquantity || spuquantity}
                      disabled={viewMode}
                    />
                    {spuquantityError && (
                      <p className="errorLabel">{spuquantityError}</p>
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
            <Typography>Manage Spu Account Detail</Typography>
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
                          value={searchauctionCenterId}
                          onChange={(e) =>
                            setsearchauctionCenterId(e.target.value)
                          }
                        >
                          <option value={0}>Search Auction Center</option>
                          {getAllAuctionCenterResponse?.map((state) => (
                            <option
                              key={state.auctionCenterId}
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
                        <label>Tea type</label>
                        <select
                          className="form-control select-form"
                          value={searchteaTypeId}
                          onChange={(e) => setsearchteaTypeId(e.target.value)}
                        >
                          <option value={0}>Search Tea type</option>
                          {getAllTeaTypeResponse?.map((state) => (
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
                        <label>Grade</label>
                        <select
                          className="form-control select-form"
                          value={searchgradeId}
                          onChange={(e) => setsearchgradeId(e.target.value)}
                        >
                          <option value={0}>Search Grade Name</option>
                          {getAllGradeResponse?.map((state) => (
                            <option key={state.gradeId} value={state.gradeId}>
                              {state.gradeName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Category</label>
                        <select
                          className="form-control select-form"
                          value={searchcategoryId}
                          onChange={(e) => setsearchcategoryId(e.target.value)}
                        >
                          <option value={0}>Search Category</option>
                          {getAllCategory?.map((state) => (
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
                    disabled={searchSpuData && searchSpuData.length < 19}
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
      {/* Preview */}
      {previewDocumentContent != "" && "preview" == documentMode ? (
        <Modals
          title={"SPU Master"}
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

export default CreateSpuMasterDetail;
