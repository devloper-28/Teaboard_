import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { Card, Modal } from "react-bootstrap";
import Modals from "../../components/common/Modal";
import $ from "jquery";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import {
  getTaxMasterByIdAction,
  createTaxMasterAction,
  updateTaxMasterAction,
  searchTaxMasterAction,
  getDocumentByIdActionSuccess,
  getAllAuctionCenterAscAction,
  getTaxMasterByIdActionSuccess,
  uploadAllDocumentsTaxMasterAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditTaxMasterApiStatus,
  searchChargeAction,
  getAllChargeActionAsc,
  getChargeCodeAsc,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import CustomToast from "../../components/Toast";
import Base64ToExcelDownload from "../Base64ToExcelDownload";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

let pageNo = 1;
function CreateTaxMaster({ open, setOpen, modalRight }) {
  const getAllTaxMasterData = useSelector(
    (state) => state.createTaxMaster.getAllTaxMasterActionSuccess.responseData
  );

  const [documentMode, setDocumentmode] = useState("");
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const [chargeName, setchargeName] = useState("");
  const [chargeCode, setchargeCode] = useState("");
  const [hsn, sethsn] = useState("");
  const [sac, setsac] = useState("");
  const [description, setdescription] = useState("");
  const [auctionCenterName, setauctionCenterName] = useState("");
  const [sgst, setsgst] = useState("");
  const [igst, setigst] = useState("");
  const [cgst, setcgst] = useState("");
  const [effectiveFromDate, seteffectiveFromDate] = useState("");
  const [effectiveEndDate, seteffectiveEndDate] = useState("");
  const [chargeCodeId, setchargeCodeId] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState("");
  const [editingTaxData, setEditingTaxData] = useState(null);
  const [getAllTaxMaster, setGetAllTaxMaster] = useState([]);
  const [getSearchTaxMaster, setGetSearchTaxMaster] = useState([]);
  const [exportViewType, setexportViewType] = useState("");
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [remarksError, setRemarksError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [auctionCenterNameError, setauctionCenterNameError] = useState("");
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [chargeNameError, setchargeNameError] = useState("");
  const [chargeCodeError, setchargeCodeError] = useState("");
  const [chargeCodeIdError, setchargeCodeIdError] = useState("");
  const [hsnError, sethsnError] = useState("");
  const [sacError, setsacError] = useState("");
  const [descriptionError, setdescriptionError] = useState("");
  const [sgstError, setsgstError] = useState("");
  const [igstError, setigstError] = useState("");
  const [cgstError, setcgstError] = useState("");
  const [effectiveFromDateError, seteffectiveFromDateError] = useState("");
  const [effectiveEndDateError, seteffectiveEndDateError] = useState("");
  const [exportType, setexportType] = useState("");

  const [searchchargeCode, setsearchchargeCode] = useState("");
  const [searchchargeName, setsearchchargeName] = useState("");
  const [searchhsn, setsearchhsn] = useState("");
  const [searchsac, setsearchsac] = useState("");

  const [searchauctionCenterName, setsearchauctionCenterName] = useState("");

  const [isActive, setIsActive] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filterChargeData, setFilterChargeData] = useState([]);

  //const [submitSuccess, setSubmitSuccess] = useState(false);

  const [dataById, setDataById] = useState("");

  const [handleSwitchClick, setHandleSwitchClick] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  // const handleDateChange = (date) => {
  //   const today = dayjs();
  //   const selectedDate = dayjs(date);

  //   if (selectedDate.isBefore(today, "day")) {
  //   } else {
  //     setSelectedDate(date);
  //   }
  // };
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

  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingTaxDataFromAc && editingTaxDataFromAc.taxMasterId;
    let searchData = {
      url: `/admin/taxmaster/get/${id}/${exportType}`,
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
          "TaxMasterDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "TaxMasterDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleChargeCodeChange = (e) => {
    setchargeName(e.target.options[e.target.selectedIndex].id);
    setchargeCodeId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setchargeNameError("");
    setchargeCodeError("");
    setchargeCodeIdError("");
    sethsnError("");
    setsacError("");
    setdescriptionError("");
    setsgstError("");
    setigstError("");
    setcgstError("");
    seteffectiveFromDateError("");
    seteffectiveEndDateError("");
    setauctionCenterNameError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");

    let isValid = true;
    if (!auctionCenterId) {
      CustomToast.error(
        "Please select at least one auction center from the list"
      );
      isValid = false;
      return;
    }

    if (!chargeName.trim()) {
      CustomToast.error("Please select a charge code from the dropdown menu");
      isValid = false;
      return;
    }

    if (!chargeCodeId) {
      CustomToast.error("Please select a charge code from the dropdown menu");
      isValid = false;
      return;
    }

    if (!hsn.trim() && !sac.trim()) {
      CustomToast.error("Please enter HSN code or SAC code.");
      isValid = false;
      return;
    }

    if (!description.trim()) {
      CustomToast.error("Please enter a description");
      isValid = false;
      return;
    }

    if (!igst.trim()) {
      CustomToast.error("Please enter the IGST value");
      isValid = false;
      return;
    }

    // if (!sgst.trim()) {
    //   CustomToast.error("Please enter the SGST value");
    //   isValid = false;
    //   return;
    // }

    // if (!cgst.trim()) {
    //   CustomToast.error("Please enter the CGST value");
    //   isValid = false;
    //   return;
    // }

    if (!effectiveFromDate) {
      CustomToast.error("Please enter the effective from date");
      isValid = false;
      return;
    }
    if (!effectiveEndDate) {
      CustomToast.error("Please enter the effective end date");
      isValid = false;
      return;
    }

    // if (!editingTaxData) {
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
      chargeName: chargeName,
      //chargeCode: chargeCode,
      hsn: hsn,
      sac: sac,
      description: description,
      //auctionCenterName: auctionCenterName,
      sgst: sgst,
      igst: igst,
      cgst: cgst,
      chargeCodeId: chargeCodeId,
      effectiveFromDate: effectiveFromDate,
      effectiveEndDate: effectiveEndDate,
      auctionCenterId: auctionCenterId,
      chargeMasterId: chargeCodeId,
      isActive: 1,
      searchData: {
        pageNo: 1,
        noOfRecords: NO_OF_RECORDS,
      },
      // searchasd:{
      //   sortBy: "asc",
      //   sortColumn: "chargeCode",
      // },
    };
    try {
      if (editingTaxData) {
        const isFormModified =
          chargeCodeId !== editingTaxData.chargeCodeId ||
          chargeCode !== editingTaxData.chargeCode ||
          chargeName !== editingTaxData.chargeName ||
          hsn !== editingTaxData.hsn ||
          sac !== editingTaxData.sac ||
          auctionCenterName !== editingTaxData.auctionCenterName ||
          auctionCenterId !== editingTaxData.auctionCenterId ||
          description !== editingTaxData.description ||
          sgst !== editingTaxData.sgst ||
          cgst !== editingTaxData.cgst ||
          igst !== editingTaxData.email ||
          effectiveFromDate !== editingTaxData.effectiveFromDate ||
          effectiveEndDate !== editingTaxData.effectiveEndDate ||
          uploadDocumentRemarks !== editingTaxData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingTaxData.downloadDto.length;

        if (isFormModified) {
          editingTaxData.searchData = {
            auctionCenterId: searchauctionCenterName,
            chargeCodeId: searchchargeCode,
            chargeName: searchchargeName,
            hsn: searchhsn,
            sac: searchsac,
            isActive,
            pageNo: pageNo,
            noOfRecords: NO_OF_RECORDS,
          };
          editingTaxData.chargeMasterId = editingTaxData.chargeCodeId;
          editingTaxData.uploadDocumentRemarks = uploadDocumentRemarks;
          editingTaxData.downloadDto = uploadedDocuments;

          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(updateTaxMasterAction(editingTaxData));
          }, 1000);
        } else {
          setExpanded("panel2");
        }
      } else {
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          setRows([]);
          dispatch(createTaxMasterAction(newStateData));
        }, 1000);
      }
    } catch (error) {}
  };
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchTaxMasterAction({
        auctionCenterId: searchauctionCenterName,
        chargeCodeId: searchchargeCode,
        chargeName: searchchargeName,
        hsn: searchhsn,
        sac: searchsac,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchTaxMasterAction({
        auctionCenterId: searchauctionCenterName,
        chargeCodeId: searchchargeCode,
        chargeName: searchchargeName,
        hsn: searchhsn,
        sac: searchsac,
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

  const searchTaxMasterData = useSelector(
    (state) => state.createTaxMaster.searchResults.responseData
  );

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };
  const handleClear = () => {
    resetForm();
    const inputElement = document.getElementById("taxMasterUpload");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const clearSearch = () => {
    setsearchauctionCenterName("");
    setsearchchargeCode("");
    setsearchchargeName("");
    setsearchhsn("");
    setsearchsac("");
    setIsActive("");
    pageNo = 1;
    setRows([]);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        searchTaxMasterAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
    }, 1000);
  };

  const handleViewClick = (taxMasterId) => {
    dispatch(getTaxMasterByIdAction(taxMasterId));
    setViewMode(true);
    // setExpanded("panel1");
    setViewModal(true);
  };

  const handleEditClick = (taxMasterId) => {
    dispatch(getTaxMasterByIdAction(taxMasterId));
    // setExpanded("panel1");
    setEditModal(true);
  };

  const editingTaxDataFromAc = useSelector(
    (state) => state.createTaxMaster.TaxMasterData.responseData
  );

  useEffect(() => {
    if (editingTaxDataFromAc && !handleSwitchClick) {
      editingTaxDataFromAc.chargeCodeId = editingTaxDataFromAc.chargeMasterId;
      setEditingTaxData(editingTaxDataFromAc);
      setauctionCenterName(editingTaxDataFromAc.auctionCenterName || "");
      setauctionCenterId(editingTaxDataFromAc.auctionCenterId || "");
      setchargeCodeId(editingTaxDataFromAc.chargeMasterId || "");
      setchargeName(editingTaxDataFromAc.chargeName || "");
      sethsn(editingTaxDataFromAc.hsn || "");
      setsac(editingTaxDataFromAc.sac || "");
      setdescription(editingTaxDataFromAc.description || "");
      setsgst(editingTaxDataFromAc.sgst || "");
      setcgst(editingTaxDataFromAc.cgst || "");
      setigst(editingTaxDataFromAc.igst || "");
      seteffectiveFromDate(
        moment(editingTaxDataFromAc.effectiveFromDate).format(
          "YYYY-MM-DDTHH:mm"
        )
      );
      seteffectiveEndDate(
        moment(editingTaxDataFromAc.effectiveEndDate).format("YYYY-MM-DDTHH:mm")
      );

      setUploadDocumentRemarks(
        editingTaxDataFromAc.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingTaxDataFromAc.downloadDto || []);
    } else {
      dispatch(
        getAllAuctionCenterAscAction({
          sortBy: "asc",
          sortColumn: "auctionCenterName",
        })
      );
      dispatch(
        getAllChargeActionAsc({
          sortBy: "asc",
          sortColumn: "chargeCode",
        })
      );
    }
  }, [editingTaxDataFromAc]);

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const [rows, setRows] = useState(getAllTaxMaster || getSearchTaxMaster);
  // useEffect(() => {
  //   if (getAllTaxMasterData) setGetAllTaxMaster(getAllTaxMasterData);
  //   setRows(getAllTaxMasterData);
  // }, [getAllTaxMasterData]);
  // useEffect(() => {
  //   const newRows = searchTaxMasterData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [searchTaxMasterData]);

  useEffect(() => {
    const newRows = searchTaxMasterData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.taxMasterId === newRow.taxMasterId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [searchTaxMasterData]);
  // useEffect(() => {
  //   if (searchTaxMasterData != null && searchTaxMasterData != undefined) {
  //     setGetSearchTaxMaster(searchTaxMasterData);
  //     setRows(searchTaxMasterData);
  //   } else {
  //     setGetSearchTaxMaster([]);
  //     setRows([]);
  //   }
  // }, [searchTaxMasterData]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchTaxMasterAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getTaxMasterByIdActionSuccess([]));
      setEditingTaxData(null);
      handleClear();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsTaxMasterAction());
      setViewMode(false);
      dispatch(getTaxMasterByIdActionSuccess([]));
      setEditingTaxData(null);
      handleClear();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getTaxMasterByIdActionSuccess([]));
      setEditingTaxData(null);
      handleClear();
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.createTaxMaster &&
      state.createTaxMaster.uploadedDocuments &&
      state.createTaxMaster.uploadedDocuments.responseData
  );

  const switchTaxDataFromAc = useSelector(
    (state) => state.createTaxMaster.TaxMasterData.responseData
  );

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      auctionCenterId: searchauctionCenterName,
      chargeCodeId: searchchargeCode,
      chargeName: searchchargeName,
      hsn: searchhsn,
      sac: searchsac,
      isActive: isActive != "" ? parseInt(isActive) : isActive,
      url: "/admin/taxmaster/search",
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
        Base64ToExcelDownload(getExportDataResponse, "TaxMasterDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "TaxMasterDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  useEffect(() => {
    if (switchTaxDataFromAc && handleSwitchClick) {
      let searchData = {
        auctionCenterId: searchauctionCenterName,
        chargeCodeId: searchchargeCode,
        chargeName: searchchargeName,
        hsn: searchhsn,
        sac: searchsac,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };
      const updatedData = {
        ...switchTaxDataFromAc,
        isActive: switchTaxDataFromAc.isActive === 1 ? 0 : 1,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      };
      updatedData.searchData = searchData;
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateTaxMasterAction(updatedData));
      }, 1000);

      dispatch(getTaxMasterByIdActionSuccess([]));
      setHandleSwitchClick(false);
    }
  }, [switchTaxDataFromAc]);

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
      name: "chargeName",
      title: "Charge Name",
    },
    {
      name: "chargeCode",
      title: "Charge Code",
    },
    {
      name: "hsn",
      title: "HSN Code",
    },
    {
      name: "sac",
      title: "SAC Code",
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
      dispatch(getTaxMasterByIdAction(data.data.taxMasterId));
    };

    return (
      <>
        {modalRight?.some((ele) => ele === "5") ? (
          <div class="Switch">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id={`customSwitch${data.data.taxMasterId}`}
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange}
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.taxMasterId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.taxMasterId}`}
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
                onClick={() => handleEditClick(data.data.taxMasterId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.taxMasterId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.taxMasterId);
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
    setchargeName("");
    setchargeCode("");
    sethsn("");
    setsac("");
    setdescription("");
    setauctionCenterName("");
    setsgst("");
    setigst("");
    setcgst("");
    seteffectiveFromDate("");
    seteffectiveEndDate("");
    setauctionCenterId("");
    setchargeCodeId("");
    setchargeCodeIdError("");
    setRemarksError("");
    setUploadDocumentError("");
    setchargeNameError("");
    setchargeCodeError("");
    sethsnError("");
    setsacError("");
    setdescriptionError("");
    setsgstError("");
    setigstError("");
    setcgstError("");
    seteffectiveFromDateError("");
    seteffectiveEndDateError("");
    setauctionCenterNameError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setUploadDocumentRemarks("");
    setUploadedFiles([]);
    setUploadedDocuments([]);
    setEditingTaxData(null);
  };

  function formatFromDateTime(dateTimeString) {
    seteffectiveFromDate(
      dateTimeString != ""
        ? moment(dateTimeString).format("YYYY-MM-DDTHH:mm")
        : ""
    );
  }
  function formatEndDateTime(dateTimeString) {
    seteffectiveEndDate(
      dateTimeString != ""
        ? moment(dateTimeString).format("YYYY-MM-DDTHH:mm")
        : ""
    );
  }
  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_taxMaster";
    const moduleName = "TaxMaster";
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

  const setValueData = (data, editingTaxData) => {
    setEditingTaxData({
      ...editingTaxData,
      chargeCodeId: data.target.value,
      chargeName: data.target.options[data.target.selectedIndex].id,
    });
  };

  const searchChargeData = useSelector(
    (state) => state?.CreateChargeMaster?.getAllChargeAsc?.responseData
  );

  const isActiveSearchChargeData =
    searchChargeData && searchChargeData?.filter((data) => 1 == data.isActive);

  let createData = useSelector(
    (state) => state.createTaxMaster.createEditTaxMasterApiStatus
  );
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
  useEffect(() => {
    if (true == createData) {
      dispatch(createEditTaxMasterApiStatus(false));
      setExpanded("panel2");
      handleClear();
      dispatch(getTaxMasterByIdActionSuccess([]));
      setEditingTaxData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });

  const handleAuctionCenter = (value, isEdit) => {
    if (!isEdit) {
      setauctionCenterId(value);
      setchargeCodeId("");
      setchargeName("");
    } else {
      setEditingTaxData({
        ...editingTaxData,
        auctionCenterId: value,
        chargeCodeId: "",
        chargeName: "",
      });
    }

    if (value != null && value != "" && value != undefined) {
      let tempData = [];
      let data =
        isActiveSearchChargeData &&
        isActiveSearchChargeData.filter((data) => {
          if (value == data.auctionCenterId) {
            tempData.push(data);
          }
        });
      setFilterChargeData(tempData);
    } else {
      setFilterChargeData([]);
    }
  };

  const setGSTData = (fromEdit, value) => {
    if (fromEdit) {
      setEditingTaxData({
        ...editingTaxData,
        igst: value,
        sgst: value / 2,
        cgst: value / 2,
      });
    } else {
      setigst(value);
      setsgst(value / 2);
      setcgst(value / 2);
    }
  };

  const handleCloseViewModal = () => {
    setViewModal(false);
    clearSearch();
    setViewMode(false);
    dispatch(getTaxMasterByIdActionSuccess([]));
    setEditingTaxData(null);
    handleClear();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    clearSearch();
    setViewMode(false);
    dispatch(getTaxMasterByIdActionSuccess([]));
    setEditingTaxData(null);
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
            <Typography>Create Tax Master</Typography>
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
                            editingTaxData?.auctionCenterId || auctionCenterId
                          }
                          disabled={viewMode}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaxData
                              ? handleAuctionCenter(e.target.value, true)
                              : handleAuctionCenter(e.target.value, false))
                          }
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
                        <label>Charge Code</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingTaxData?.chargeCodeId || chargeCodeId}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaxData
                              ? setValueData(e, editingTaxData)
                              : handleChargeCodeChange(e))
                          }
                          disabled={
                            (editingTaxData?.auctionCenterId ||
                              auctionCenterId != null) &&
                            (editingTaxData?.auctionCenterId ||
                              auctionCenterId != "") &&
                            (editingTaxData?.auctionCenterId ||
                              auctionCenterId != undefined) &&
                            !viewMode
                              ? false
                              : true
                          }
                        >
                          <option value={0}>Select Charge Code</option>
                          {filterChargeData &&
                            filterChargeData.map((state) => (
                              <option
                                key={state.chargeMasterId}
                                value={state.chargeMasterId}
                                id={state.chargesName}
                              >
                                {state.chargeCode}
                              </option>
                            ))}
                        </select>

                        {chargeCodeIdError && (
                          <p className="errorLabel">{chargeCodeIdError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charge Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingTaxData?.chargeName || chargeName}
                          disabled={true}
                        />
                        {chargeNameError && (
                          <p className="errorLabel">{chargeNameError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>HSN</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="8"
                          value={editingTaxData?.hsn || hsn}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaxData
                              ? setEditingTaxData({
                                  ...editingTaxData,
                                  hsn: e.target.value,
                                })
                              : sethsn(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {hsnError && <p className="errorLabel">{hsnError}</p>}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>SAC</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="6"
                          value={editingTaxData?.sac || sac}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaxData
                              ? setEditingTaxData({
                                  ...editingTaxData,
                                  sac: e.target.value,
                                })
                              : setsac(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {sacError && <p className="errorLabel">{sacError}</p>}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Description</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="100"
                          value={editingTaxData?.description || description}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaxData
                              ? setEditingTaxData({
                                  ...editingTaxData,
                                  description: e.target.value,
                                })
                              : setdescription(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {descriptionError && (
                          <p className="errorLabel">{descriptionError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>IGST</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="100"
                          value={editingTaxData?.igst || igst}
                          onChange={(e) =>
                            setGSTData(
                              editingTaxData ? true : false,
                              e.target.value
                            )
                          }
                          disabled={viewMode}
                        />
                        {igstError && <p className="errorLabel">{igstError}</p>}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>SGST</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="100"
                          value={editingTaxData?.sgst || sgst}
                          disabled={true}
                        />
                        {sgstError && <p className="errorLabel">{sgstError}</p>}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>CGST</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="100"
                          value={editingTaxData?.cgst || cgst}
                          disabled={true}
                        />
                        {cgstError && <p className="errorLabel">{cgstError}</p>}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Effective from Date</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="datetime-local"
                          name="effectiveFromDate"
                          class="form-control"
                          onChange={(e) => formatFromDateTime(e.target.value)}
                          value={effectiveFromDate}
                          disabled={viewMode}
                        />

                        {effectiveFromDateError && (
                          <p className="errorLabel">{effectiveFromDateError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Effective End Date</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="datetime-local"
                          name="effectiveEndDate"
                          class="form-control"
                          onChange={(e) => formatEndDateTime(e.target.value)}
                          value={effectiveEndDate}
                          disabled={viewMode}
                        />

                        {effectiveEndDateError && (
                          <p className="errorLabel">{effectiveEndDateError}</p>
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
                            inputId="taxMasterUpload"
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
          title={"Edit Tax Master"}
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
                      value={editingTaxData?.auctionCenterId || auctionCenterId}
                      disabled={viewMode}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaxData
                          ? handleAuctionCenter(e.target.value, true)
                          : handleAuctionCenter(e.target.value, false))
                      }
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
                    <label>Charge Code</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingTaxData?.chargeCodeId || chargeCodeId}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaxData
                          ? setValueData(e, editingTaxData)
                          : handleChargeCodeChange(e))
                      }
                      disabled={
                        (editingTaxData?.auctionCenterId ||
                          auctionCenterId != null) &&
                        (editingTaxData?.auctionCenterId ||
                          auctionCenterId != "") &&
                        (editingTaxData?.auctionCenterId ||
                          auctionCenterId != undefined) &&
                        !viewMode
                          ? false
                          : true
                      }
                    >
                      <option value={0}>Select Charge Code</option>
                      {filterChargeData &&
                        filterChargeData.map((state) => (
                          <option
                            key={state.chargeMasterId}
                            value={state.chargeMasterId}
                            id={state.chargesName}
                          >
                            {state.chargeCode}
                          </option>
                        ))}
                    </select>

                    {chargeCodeIdError && (
                      <p className="errorLabel">{chargeCodeIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Charge Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingTaxData?.chargeName || chargeName}
                      disabled={true}
                    />
                    {chargeNameError && (
                      <p className="errorLabel">{chargeNameError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>HSN</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="8"
                      value={editingTaxData?.hsn || hsn}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaxData
                          ? setEditingTaxData({
                              ...editingTaxData,
                              hsn: e.target.value,
                            })
                          : sethsn(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {hsnError && <p className="errorLabel">{hsnError}</p>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>SAC</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="6"
                      value={editingTaxData?.sac || sac}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaxData
                          ? setEditingTaxData({
                              ...editingTaxData,
                              sac: e.target.value,
                            })
                          : setsac(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {sacError && <p className="errorLabel">{sacError}</p>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Description</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingTaxData?.description || description}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaxData
                          ? setEditingTaxData({
                              ...editingTaxData,
                              description: e.target.value,
                            })
                          : setdescription(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {descriptionError && (
                      <p className="errorLabel">{descriptionError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>IGST</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingTaxData?.igst || igst}
                      onChange={(e) =>
                        setGSTData(
                          editingTaxData ? true : false,
                          e.target.value
                        )
                      }
                      disabled={viewMode}
                    />
                    {igstError && <p className="errorLabel">{igstError}</p>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>SGST</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingTaxData?.sgst || sgst}
                      disabled={true}
                    />
                    {sgstError && <p className="errorLabel">{sgstError}</p>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>CGST</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingTaxData?.cgst || cgst}
                      disabled={true}
                    />
                    {cgstError && <p className="errorLabel">{cgstError}</p>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Effective from Date</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="datetime-local"
                      name="effectiveFromDate"
                      class="form-control"
                      onChange={(e) => formatFromDateTime(e.target.value)}
                      value={effectiveFromDate}
                      disabled={viewMode}
                    />

                    {effectiveFromDateError && (
                      <p className="errorLabel">{effectiveFromDateError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Effective End Date</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="datetime-local"
                      name="effectiveEndDate"
                      class="form-control"
                      onChange={(e) => formatEndDateTime(e.target.value)}
                      value={effectiveEndDate}
                      disabled={viewMode}
                    />

                    {effectiveEndDateError && (
                      <p className="errorLabel">{effectiveEndDateError}</p>
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
                        inputId="taxMasterUpload"
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
          title={"View Tax Master"}
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
                      value={editingTaxData?.auctionCenterId || auctionCenterId}
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
                    <label>Charge Code</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingTaxData?.chargeCodeId || chargeCodeId}
                      disabled={
                        (editingTaxData?.auctionCenterId ||
                          auctionCenterId != null) &&
                        (editingTaxData?.auctionCenterId ||
                          auctionCenterId != "") &&
                        (editingTaxData?.auctionCenterId ||
                          auctionCenterId != undefined) &&
                        !viewMode
                          ? false
                          : true
                      }
                    >
                      <option value={0}>Select Charge Code</option>
                      {filterChargeData &&
                        filterChargeData.map((state) => (
                          <option
                            key={state.chargeMasterId}
                            value={state.chargeMasterId}
                            id={state.chargesName}
                          >
                            {state.chargeCode}
                          </option>
                        ))}
                    </select>

                    {chargeCodeIdError && (
                      <p className="errorLabel">{chargeCodeIdError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Charge Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingTaxData?.chargeName || chargeName}
                      disabled={true}
                    />
                    {chargeNameError && (
                      <p className="errorLabel">{chargeNameError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>HSN</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="8"
                      value={editingTaxData?.hsn || hsn}
                      disabled={viewMode}
                    />
                    {hsnError && <p className="errorLabel">{hsnError}</p>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>SAC</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="6"
                      value={editingTaxData?.sac || sac}
                      disabled={viewMode}
                    />
                    {sacError && <p className="errorLabel">{sacError}</p>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Description</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingTaxData?.description || description}
                      disabled={viewMode}
                    />
                    {descriptionError && (
                      <p className="errorLabel">{descriptionError}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>IGST</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingTaxData?.igst || igst}
                      disabled={viewMode}
                    />
                    {igstError && <p className="errorLabel">{igstError}</p>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>SGST</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingTaxData?.sgst || sgst}
                      disabled={true}
                    />
                    {sgstError && <p className="errorLabel">{sgstError}</p>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>CGST</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingTaxData?.cgst || cgst}
                      disabled={true}
                    />
                    {cgstError && <p className="errorLabel">{cgstError}</p>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Effective from Date</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="datetime-local"
                      name="effectiveFromDate"
                      class="form-control"
                      value={effectiveFromDate}
                      disabled={viewMode}
                    />

                    {effectiveFromDateError && (
                      <p className="errorLabel">{effectiveFromDateError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Effective End Date</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="datetime-local"
                      name="effectiveEndDate"
                      class="form-control"
                      value={effectiveEndDate}
                      disabled={viewMode}
                    />

                    {effectiveEndDateError && (
                      <p className="errorLabel">{effectiveEndDateError}</p>
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
            <Typography>Manage Tax Master</Typography>
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
                          value={searchauctionCenterName}
                          onChange={(e) =>
                            setsearchauctionCenterName(e.target.value)
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
                        <label>Charge Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchchargeName}
                          onChange={(e) => setsearchchargeName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Charge Code</label>
                        <select
                          className="form-control select-form"
                          value={searchchargeCode}
                          onChange={(e) => setsearchchargeCode(e.target.value)}
                        >
                          <option value={0}>Search Charge Code</option>
                          {searchChargeData?.map((state) => (
                            <option
                              key={state.chargeCodeId}
                              value={state.chargeCodeId}
                            >
                              {state.chargeCode}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>HSN Code</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchhsn}
                          onChange={(e) => setsearchhsn(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>SAC Code</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchsac}
                          onChange={(e) => setsearchsac(e.target.value)}
                        />
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
                      searchTaxMasterData && searchTaxMasterData.length < 19
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
          title={"Tax Master"}
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

export default CreateTaxMaster;
