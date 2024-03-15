import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  fetchBankAcAsc,
  fetchBankAc,
  createBankAcAction,
  updateBankAcAction,
  getBankAcByIdAction,
  getBankAcByIdActionSuccess,
  getAllAuctionCenterAction,
  getAllAuctionCenterAscAction,
  searchBankAcAction,
  uploadAllDocumentsBankAcAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditBankAcDetailsApiStatus,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  getDocumentByIdActionSuccess,
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
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import { Tooltip } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

let pageNo = 1;
function CreateBankAccountDetail({ open, setOpen, modalRight }) {
  const dispatch = useDispatch();
  const [documentMode, setDocumentmode] = useState("");
  const navigate = useNavigate();
  const [exportViewType, setexportViewType] = useState("");
  const [loader, setLoader] = useState(false);
  const [bankAccountNumber, setbankAccountNumber] = useState("");
  const [bankName, setbankName] = useState("");
  const [branchAddress, setbranchAddress] = useState("");
  const [ifscCode, setifscCode] = useState("");
  const [auctionCenterName, setauctionCenterName] = useState("");
  const [beneficiaryName, setbeneficiaryName] = useState("");
  const [contactPerson, setcontactPerson] = useState("");
  const [email, setemail] = useState("");
  const [contactNumber, setcontactNumber] = useState("");
  const [contactPersonAddress, setcontactPersonAddress] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState("");
  const [editingBankData, setEditingBankData] = useState(null);
  const [getAllBankAc, setGetAllBankAc] = useState([]);
  const [getSearchBank, setGetSearchBank] = useState([]);
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [searchbankName, setsearchbankName] = useState("");
  const [searchauctionCenterName, setsearchauctionCenterName] = useState("");
  const [searchbankAccountNumber, setsearchbankAccountNumber] = useState("");
  const [searchifscCode, setsearchifscCode] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [exportType, setexportType] = useState("");

  const [isActive, setIsActive] = useState("");

  const [dataById, setDataById] = useState("");

  const [handleSwitchClick, setHandleSwitchClick] = useState(false);

  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [bankAccountNumberError, setbankAccountNumberError] = useState("");
  const [bankNameError, setbankNameError] = useState("");
  const [branchAddressError, setbranchAddressError] = useState("");
  const [ifscCodeError, setifscCodeError] = useState("");
  const [beneficiaryNameError, setbeneficiaryNameError] = useState("");
  const [contactPersonError, setcontactPersonError] = useState("");
  const [emailError, setemailError] = useState("");
  const [contactNumberError, setcontactNumberError] = useState("");
  const [auctionCenterNameError, setauctionCenterNameError] = useState("");
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [contactPersonAddressError, setcontactPersonAddressError] =
    useState("");
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

  const getBankAcData = useSelector(
    (state) =>
      state.createBankAcDetail.getAllBankAcAscActionSuccess.responseData
  );
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const isActiveData =
    getBankAcData && getBankAcData.filter((data) => 1 == data.isActive);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setbankAccountNumberError("");
    setbankNameError("");
    setbranchAddressError("");
    setifscCodeError("");
    setbeneficiaryNameError("");
    setcontactPersonError("");
    setemailError("");
    setcontactNumberError("");
    setauctionCenterNameError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setcontactPersonAddressError("");

    let isValid = true;

    if (!bankAccountNumber) {
      CustomToast.error("Please enter the bank account number");
      isValid = false;
      return;
    }

    if (!bankName.trim()) {
      CustomToast.error("Please enter the bank account name");
      isValid = false;
      return;
    }

    if (!branchAddress.trim()) {
      CustomToast.error("Please enter the branch address");
      isValid = false;
      return;
    }

    if (!ifscCode.trim()) {
      CustomToast.error("Please enter the IFSC code.");
      isValid = false;
      return;
    }
    if (!beneficiaryName.trim()) {
      CustomToast.error("Please enter the beneficiary name.");
      isValid = false;
      return;
    }
    if (!email.trim()) {
      CustomToast.error("Please enter the email ID.");
      isValid = false;
      return;
    }
    if (!contactNumber) {
      CustomToast.error("Please enter a valid contact number");
      isValid = false;
      return;
    }
    if (!auctionCenterId || "0" == auctionCenterId) {
      CustomToast.error(
        "Please select an auction center from the dropdown menu."
      );
      isValid = false;
      return;
    }
    if (!contactPerson.trim()) {
      CustomToast.error("Please enter the contact person");
      isValid = false;
      return;
    }
    if (!contactPersonAddress.trim()) {
      CustomToast.error("Please enter the contact person address");
      isValid = false;
      return;
    }

    // if (!editingBankData) {
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
      bankAccountNumber: bankAccountNumber,
      bankName: bankName,
      branchAddress: branchAddress,
      ifscCode: ifscCode,
      auctionCenterName: auctionCenterName,
      beneficiaryName: beneficiaryName,
      contactPerson: contactPerson,
      email: email,
      contactNumber: contactNumber,
      contactPersonAddress: contactPersonAddress,
      auctionCenterId: auctionCenterId,
      downloadDto: uploadedDocuments,
      isActive: 1,
      uploadDocumentRemarks: uploadDocumentRemarks,
      searchData: {
        pageNo: 1,
        noOfRecords: NO_OF_RECORDS,
      },
      searchasd: {
        sortBy: "asc",
        sortColumn: "bankName",
      },
    };

    try {
      if (editingBankData) {
        const isFormModified =
          bankName !== editingBankData.bankName ||
          bankAccountNumber !== editingBankData.bankAccountNumber ||
          ifscCode !== editingBankData.ifscCode ||
          auctionCenterName !== editingBankData.auctionCenterName ||
          auctionCenterId !== editingBankData.auctionCenterId ||
          beneficiaryName !== editingBankData.beneficiaryName ||
          contactPerson !== editingBankData.contactPerson ||
          contactPersonAddress !== editingBankData.contactPersonAddress ||
          email !== editingBankData.email ||
          parseInt(contactNumber) !== parseInt(editingBankData.contactNumber) ||
          uploadDocumentRemarks !== editingBankData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingBankData.downloadDto.length;

        if (isFormModified) {
          editingBankData.bankAccountNumber =
            editingBankData.bankAccountNumber &&
            parseInt(editingBankData.bankAccountNumber);
          editingBankData.searchData = {
            bankAccountDetailId: searchbankName,
            auctionCenterId: searchauctionCenterName,
            bankAccountNumber: searchbankAccountNumber,
            ifscCode: searchifscCode,
            isActive,
            pageNo: pageNo,
            noOfRecords: NO_OF_RECORDS,
          };
          editingBankData.searchasd = {
            sortBy: "asc",
            sortColumn: "bankName",
          };
          editingBankData.uploadDocumentRemarks = uploadDocumentRemarks;
          editingBankData.downloadDto = uploadedDocuments;
          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            setRows([]);
            dispatch(updateBankAcAction(editingBankData));
          }, 1000);
        } else {
          setExpanded("panel2");
        }
      } else {
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          setRows([]);
          dispatch(createBankAcAction(newStateData));
        }, 1000);
      }
    } catch (error) {}
  };
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingBankDataFromAc && editingBankDataFromAc.bankAccountDetailId;
    let searchData = {
      url: `/admin/bankAccountDetails/get/${id}/${exportType}`,
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
          "BankAccountDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "BankAccountDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchBankAcAction({
        bankAccountDetailId: searchbankName,
        auctionCenterId: searchauctionCenterName,
        bankAccountNumber: searchbankAccountNumber,
        ifscCode: searchifscCode,
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchBankAcAction({
        bankAccountDetailId: searchbankName,
        auctionCenterId: searchauctionCenterName,
        bankAccountNumber: searchbankAccountNumber,
        ifscCode: searchifscCode,
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

  const searchBankData = useSelector(
    (state) => state.createBankAcDetail.searchResults.responseData
  );
  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      bankAccountDetailId: searchbankName,
      auctionCenterId: searchauctionCenterName,
      bankAccountNumber: searchbankAccountNumber,
      isActive: isActive != "" ? parseInt(isActive) : isActive,
      url: "/admin/bankAccountDetails/search",
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
        Base64ToExcelDownload(getExportDataResponse, "BankAccountDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "BankAccountDetails.pdf",
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
  const handleClear = () => {
    resetForm();
    const inputElement = document.getElementById("bankAccountUpload");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const clearSearch = () => {
    setsearchbankName("");
    setsearchauctionCenterName("");
    setsearchbankAccountNumber("");
    setIsActive("");
    setsearchauctionCenterName("");
    setsearchifscCode("");
    setRows([]);
    pageNo = 1;
    dispatch(
      fetchBankAcAsc({
        sortBy: "asc",
        sortColumn: "bankName",
      })
    );
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        searchBankAcAction({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
      );
    }, 1000);
  };

  const handleViewClick = (bankAccountDetailId) => {
    dispatch(getBankAcByIdAction(bankAccountDetailId));
    setViewMode(true);
    // setExpanded("panel1");
    setViewModal(true);
  };

  const handleEditClick = (bankAccountDetailId) => {
    setViewMode(false);
    dispatch(getBankAcByIdAction(bankAccountDetailId));
    // setExpanded("panel1");
    setEditModal(true);
  };
  const editingBankDataFromAc = useSelector(
    (state) => state.createBankAcDetail.BankAcData.responseData
  );

  useEffect(() => {
    if (editingBankDataFromAc) {
      setEditingBankData(editingBankDataFromAc);
      setauctionCenterName(editingBankDataFromAc.auctionCenterName || "");
      setauctionCenterId(editingBankDataFromAc.auctionCenterId || "");
      setbankAccountNumber(editingBankDataFromAc.bankAccountNumber || "");
      setbankName(editingBankDataFromAc.bankName || "");
      setbranchAddress(editingBankDataFromAc.branchAddress || "");
      setifscCode(editingBankDataFromAc.ifscCode || "");
      setbeneficiaryName(editingBankDataFromAc.beneficiaryName || "");
      setcontactPerson(editingBankDataFromAc.contactPerson || "");
      setemail(editingBankDataFromAc.email || "");
      setcontactNumber(editingBankDataFromAc.contactNumber || "");
      setcontactPersonAddress(editingBankDataFromAc.contactPersonAddress || "");
      setUploadDocumentRemarks(
        editingBankDataFromAc.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingBankDataFromAc.downloadDto || []);
    } else {
      setEditingBankData(null);
      dispatch(
        getAllAuctionCenterAscAction({
          sortBy: "asc",
          sortColumn: "auctionCenterName",
        })
      );
    }
  }, [editingBankDataFromAc]);

  const getAllAuctionCenterResponse = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const [rows, setRows] = useState(getAllBankAc || getSearchBank);

  // useEffect(() => {
  //   if (searchBankData != null && searchBankData != undefined) {
  //     setGetSearchBank(searchBankData);
  //     setRows(searchBankData);
  //   } else {
  //     setGetSearchBank([]);
  //     setRows([]);
  //   }
  // }, [searchBankData]);
  // useEffect(() => {
  //   const newRows = searchBankData || [];
  //   setRows((prevRows) => [...prevRows, ...newRows]);
  // }, [searchBankData]);
  useEffect(() => {
    const newRows = searchBankData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      if (newRows.length > 0) {
        const index = currentRows.findIndex(
          (row) => row.bankAccountDetailId === newRows[0].bankAccountDetailId
        );

        if (index !== -1) {
          currentRows[index] = newRows[0];
          return currentRows;
        } else {
          return [...currentRows, ...newRows];
        }
      } else {
        return currentRows;
      }
    });
  }, [searchBankData]);

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.createBankAcDetail &&
      state.createBankAcDetail.uploadedDocuments &&
      state.createBankAcDetail.uploadedDocuments.responseData
  );

  const switchBankDataFromAc = useSelector(
    (state) => state.createBankAcDetail.BankAcData.responseData
  );

  useEffect(() => {
    if (switchBankDataFromAc && handleSwitchClick) {
      setHandleSwitchClick(false);
      const updatedData = {
        ...switchBankDataFromAc,
        isActive: switchBankDataFromAc.isActive === 1 ? 0 : 1,
      };

      let searchData = {
        bankAccountDetailId: updatedData.bankAccountDetailId,
        auctionCenterId: updatedData.auctionCenterId,
        bankAccountNumber: updatedData.bankAccountNumber,
        ifscCode: updatedData.ifscCode,
        isActive: updatedData.isActive,
        pageNo: updatedData.pageNo,
        noOfRecords: updatedData.noOfRecords,
      };

      updatedData.searchData = searchData;

      setDataById("");
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        dispatch(updateBankAcAction(updatedData));
      }, 1000);

      dispatch(getBankAcByIdActionSuccess([]));
    }
  }, [switchBankDataFromAc, handleSwitchClick]);
  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "bankAccountNumber",
      title: "Bank Account Number",
    },
    {
      name: "bankName",
      title: "Bank Name",
    },
    {
      name: "branchAddress",
      title: "Branch Address",
    },
    {
      name: "ifscCode",
      title: "IFSC Code",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center",
    },
    {
      name: "beneficiaryName",
      title: "Beneficiary Name",
    },
    {
      name: "contactPerson",
      title: "Contact Person",
    },
    {
      name: "email",
      title: "Email",
    },
    {
      name: "contactNumber",
      title: "Contact Number",
    },
    {
      name: "contactPersonAddress",
      title: "Contact Person Address",
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

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchTaxMasterAction({}));
      clearSearch();
      setViewMode(false);
      dispatch(getBankAcByIdActionSuccess([]));
      setEditingBankData(null);
      handleClear();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsBankAcAction());
      setViewMode(false);
      dispatch(getBankAcByIdActionSuccess([]));
      setEditingBankData(null);
      handleClear();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getBankAcByIdActionSuccess([]));
      setEditingBankData(null);
      handleClear();
    }
  };

  let createData = useSelector(
    (state) => state.createBankAcDetail.createEditBankAcDetailsApiStatus
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditBankAcDetailsApiStatus(false));
      setExpanded("panel2");
      resetForm();
      dispatch(getBankAcByIdActionSuccess([]));
      setEditingBankData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });

  function StatusData(data) {
    const handleSwitchChange = () => {
      setHandleSwitchClick(true);
      dispatch(getBankAcByIdAction(data.data.bankAccountDetailId));
    };

    return (
      <>
        {modalRight?.some((ele) => ele === "5") ? (
          <div class="Switch">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id={`customSwitch${data.data.bankAccountDetailId}`}
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange}
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.bankAccountDetailId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.bankAccountDetailId}`}
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
                onClick={() => handleEditClick(data.data.bankAccountDetailId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.bankAccountDetailId)}
              ></i>
            </Tooltip>
          )}
          {modalRight?.some((ele) => ele === "4") && (
            <Tooltip title="History" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.bankAccountDetailId);
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
  const resetForm = () => {
    setUploadDocumentRemarks("");
    setUploadedFiles([]);
    setUploadedDocuments([]);
    setbankAccountNumber("");
    setbankName("");
    setbranchAddress("");
    setifscCode("");
    setauctionCenterName("");
    setbeneficiaryName("");
    setcontactPerson("");
    setcontactPersonAddress("");
    setemail("");
    setcontactNumber("");
    setbankAccountNumberError("");
    setbankNameError("");
    setbranchAddressError("");
    setifscCodeError("");
    setbeneficiaryNameError("");
    setcontactPersonError("");
    setauctionCenterId("");
    setauctionCenterIdError("");
    setemailError("");
    setcontactNumberError("");
    setauctionCenterNameError("");
    setUploadDocumentError("");
    setRemarksError("");
    setcontactPersonAddressError("");
    setEditingBankData(null);
  };
  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_BankAccountDetail";
    const moduleName = "BankAccountDetail";
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

  const handleCloseViewModal = () => {
    setViewModal(false);
    //Serch API call
    // dispatch(searchTaxMasterAction({}));
    clearSearch();
    setViewMode(false);
    dispatch(getBankAcByIdActionSuccess([]));
    setEditingBankData(null);
    handleClear();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    //Serch API call
    // dispatch(searchTaxMasterAction({}));
    clearSearch();
    setViewMode(false);
    dispatch(getBankAcByIdActionSuccess([]));
    setEditingBankData(null);
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
            <Typography>Create Bank Account Detail</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Bank Account Number</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="20"
                          className="form-control"
                          value={
                            editingBankData?.bankAccountNumber ||
                            bankAccountNumber
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingBankData
                              ? setEditingBankData({
                                  ...editingBankData,
                                  bankAccountNumber: e.target.value,
                                })
                              : setbankAccountNumber(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {bankAccountNumberError && (
                          <p className="errorLabel">{bankAccountNumberError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Bank Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="100"
                          className="form-control"
                          value={editingBankData?.bankName || bankName}
                          onChange={(e) =>
                            !viewMode &&
                            (editingBankData
                              ? setEditingBankData({
                                  ...editingBankData,
                                  bankName: e.target.value,
                                })
                              : setbankName(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {bankNameError && (
                          <p className="errorLabel">{bankNameError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Branch Address</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="500"
                          className="form-control"
                          value={
                            editingBankData?.branchAddress || branchAddress
                          }
                          onChange={(e) =>
                            editingBankData
                              ? setEditingBankData({
                                  ...editingBankData,
                                  branchAddress: e.target.value,
                                })
                              : setbranchAddress(e.target.value)
                          }
                          disabled={viewMode}
                        />
                        {branchAddressError && (
                          <p className="errorLabel">{branchAddressError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>IFSC Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="20"
                          className="form-control"
                          value={editingBankData?.ifscCode || ifscCode}
                          onChange={(e) =>
                            !viewMode &&
                            (editingBankData
                              ? setEditingBankData({
                                  ...editingBankData,
                                  ifscCode: e.target.value,
                                })
                              : setifscCode(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {ifscCodeError && (
                          <p className="errorLabel">{ifscCodeError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={
                            editingBankData?.auctionCenterId || auctionCenterId
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingBankData
                              ? setEditingBankData({
                                  ...editingBankData,
                                  auctionCenterId: e.target.value,
                                })
                              : setauctionCenterId(e.target.value))
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Select auctionCenter</option>
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
                        <label>Beneficiary Name </label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="100"
                          className="form-control"
                          value={
                            editingBankData?.beneficiaryName || beneficiaryName
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingBankData
                              ? setEditingBankData({
                                  ...editingBankData,
                                  beneficiaryName: e.target.value,
                                })
                              : setbeneficiaryName(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {beneficiaryNameError && (
                          <p className="errorLabel">{beneficiaryNameError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Contact Person</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="100"
                          className="form-control"
                          value={
                            editingBankData?.contactPerson || contactPerson
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingBankData
                              ? setEditingBankData({
                                  ...editingBankData,
                                  contactPerson: e.target.value,
                                })
                              : setcontactPerson(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {contactPersonError && (
                          <p className="errorLabel">{contactPersonError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Email</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="50"
                          className="form-control"
                          value={editingBankData?.email || email}
                          onChange={(e) =>
                            !viewMode &&
                            (editingBankData
                              ? setEditingBankData({
                                  ...editingBankData,
                                  email: e.target.value,
                                })
                              : setemail(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {emailError && (
                          <p className="errorLabel">{emailError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Contact Number</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          maxLength="15"
                          className="form-control"
                          value={
                            editingBankData?.contactNumber || contactNumber
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingBankData
                              ? setEditingBankData({
                                  ...editingBankData,
                                  contactNumber: e.target.value,
                                })
                              : setcontactNumber(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {contactNumberError && (
                          <p className="errorLabel">{contactNumberError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Contact Person Address</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          maxLength="200"
                          className="form-control"
                          value={
                            editingBankData?.contactPersonAddress ||
                            contactPersonAddress
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingBankData
                              ? setEditingBankData({
                                  ...editingBankData,
                                  contactPersonAddress: e.target.value,
                                })
                              : setcontactPersonAddress(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {contactPersonAddressError && (
                          <p className="errorLabel">
                            {contactPersonAddressError}
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
                            inputId="bankAccountUpload"
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
          title={"Edit Bank Account Detail"}
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
                    <label>Bank Account Number</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="20"
                      className="form-control"
                      value={
                        editingBankData?.bankAccountNumber || bankAccountNumber
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingBankData
                          ? setEditingBankData({
                              ...editingBankData,
                              bankAccountNumber: e.target.value,
                            })
                          : setbankAccountNumber(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {bankAccountNumberError && (
                      <p className="errorLabel">{bankAccountNumberError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Bank Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="100"
                      className="form-control"
                      value={editingBankData?.bankName || bankName}
                      onChange={(e) =>
                        !viewMode &&
                        (editingBankData
                          ? setEditingBankData({
                              ...editingBankData,
                              bankName: e.target.value,
                            })
                          : setbankName(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {bankNameError && (
                      <p className="errorLabel">{bankNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Branch Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="500"
                      className="form-control"
                      value={editingBankData?.branchAddress || branchAddress}
                      onChange={(e) =>
                        editingBankData
                          ? setEditingBankData({
                              ...editingBankData,
                              branchAddress: e.target.value,
                            })
                          : setbranchAddress(e.target.value)
                      }
                      disabled={viewMode}
                    />
                    {branchAddressError && (
                      <p className="errorLabel">{branchAddressError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>IFSC Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="20"
                      className="form-control"
                      value={editingBankData?.ifscCode || ifscCode}
                      onChange={(e) =>
                        !viewMode &&
                        (editingBankData
                          ? setEditingBankData({
                              ...editingBankData,
                              ifscCode: e.target.value,
                            })
                          : setifscCode(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {ifscCodeError && (
                      <p className="errorLabel">{ifscCodeError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Auction Center</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={
                        editingBankData?.auctionCenterId || auctionCenterId
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingBankData
                          ? setEditingBankData({
                              ...editingBankData,
                              auctionCenterId: e.target.value,
                            })
                          : setauctionCenterId(e.target.value))
                      }
                      disabled={viewMode}
                    >
                      <option value={0}>Select auctionCenter</option>
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
                    <label>Beneficiary Name </label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="100"
                      className="form-control"
                      value={
                        editingBankData?.beneficiaryName || beneficiaryName
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingBankData
                          ? setEditingBankData({
                              ...editingBankData,
                              beneficiaryName: e.target.value,
                            })
                          : setbeneficiaryName(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {beneficiaryNameError && (
                      <p className="errorLabel">{beneficiaryNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Contact Person</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="100"
                      className="form-control"
                      value={editingBankData?.contactPerson || contactPerson}
                      onChange={(e) =>
                        !viewMode &&
                        (editingBankData
                          ? setEditingBankData({
                              ...editingBankData,
                              contactPerson: e.target.value,
                            })
                          : setcontactPerson(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {contactPersonError && (
                      <p className="errorLabel">{contactPersonError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Email</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="50"
                      className="form-control"
                      value={editingBankData?.email || email}
                      onChange={(e) =>
                        !viewMode &&
                        (editingBankData
                          ? setEditingBankData({
                              ...editingBankData,
                              email: e.target.value,
                            })
                          : setemail(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {emailError && <p className="errorLabel">{emailError}</p>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Contact Number</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      maxLength="15"
                      className="form-control"
                      value={editingBankData?.contactNumber || contactNumber}
                      onChange={(e) =>
                        !viewMode &&
                        (editingBankData
                          ? setEditingBankData({
                              ...editingBankData,
                              contactNumber: e.target.value,
                            })
                          : setcontactNumber(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {contactNumberError && (
                      <p className="errorLabel">{contactNumberError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Contact Person Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="200"
                      className="form-control"
                      value={
                        editingBankData?.contactPersonAddress ||
                        contactPersonAddress
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingBankData
                          ? setEditingBankData({
                              ...editingBankData,
                              contactPersonAddress: e.target.value,
                            })
                          : setcontactPersonAddress(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {contactPersonAddressError && (
                      <p className="errorLabel">{contactPersonAddressError}</p>
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
                        inputId="bankAccountUpload"
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
          title={"View Bank Account Detail"}
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
                    <label>Bank Account Number</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="20"
                      className="form-control"
                      value={
                        editingBankData?.bankAccountNumber || bankAccountNumber
                      }
                      disabled={viewMode}
                    />
                    {bankAccountNumberError && (
                      <p className="errorLabel">{bankAccountNumberError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Bank Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="100"
                      className="form-control"
                      value={editingBankData?.bankName || bankName}
                      disabled={viewMode}
                    />
                    {bankNameError && (
                      <p className="errorLabel">{bankNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Branch Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="500"
                      className="form-control"
                      value={editingBankData?.branchAddress || branchAddress}
                      disabled={viewMode}
                    />
                    {branchAddressError && (
                      <p className="errorLabel">{branchAddressError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>IFSC Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="20"
                      className="form-control"
                      value={editingBankData?.ifscCode || ifscCode}
                      disabled={viewMode}
                    />
                    {ifscCodeError && (
                      <p className="errorLabel">{ifscCodeError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Auction Center</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={
                        editingBankData?.auctionCenterId || auctionCenterId
                      }
                      disabled={viewMode}
                    >
                      <option value={0}>Select auctionCenter</option>
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
                    <label>Beneficiary Name </label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="100"
                      className="form-control"
                      value={
                        editingBankData?.beneficiaryName || beneficiaryName
                      }
                      disabled={viewMode}
                    />
                    {beneficiaryNameError && (
                      <p className="errorLabel">{beneficiaryNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Contact Person</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="100"
                      className="form-control"
                      value={editingBankData?.contactPerson || contactPerson}
                      disabled={viewMode}
                    />
                    {contactPersonError && (
                      <p className="errorLabel">{contactPersonError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Email</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="50"
                      className="form-control"
                      value={editingBankData?.email || email}
                      disabled={viewMode}
                    />
                    {emailError && <p className="errorLabel">{emailError}</p>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Contact Number</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      maxLength="15"
                      className="form-control"
                      value={editingBankData?.contactNumber || contactNumber}
                      disabled={viewMode}
                    />
                    {contactNumberError && (
                      <p className="errorLabel">{contactNumberError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Contact Person Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      maxLength="200"
                      className="form-control"
                      value={
                        editingBankData?.contactPersonAddress ||
                        contactPersonAddress
                      }
                      disabled={viewMode}
                    />
                    {contactPersonAddressError && (
                      <p className="errorLabel">{contactPersonAddressError}</p>
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
            <Typography>Manage Bank Account Detail</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Account No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchbankAccountNumber}
                          onChange={(e) =>
                            setsearchbankAccountNumber(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Bank Name</label>
                        <select
                          className="form-control select-form"
                          value={searchbankName}
                          onChange={(e) => setsearchbankName(e.target.value)}
                        >
                          <option value={0}>Search Bank Name</option>
                          {getBankAcData?.map((state) => (
                            <option
                              key={state.bankAccountDetailId}
                              value={state.bankAccountDetailId}
                            >
                              {state.bankName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>IFSC Code</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchifscCode}
                          onChange={(e) => setsearchifscCode(e.target.value)}
                        />
                      </div>
                    </div>

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
                    disabled={searchBankData && searchBankData.length < 19}
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

export default CreateBankAccountDetail;
