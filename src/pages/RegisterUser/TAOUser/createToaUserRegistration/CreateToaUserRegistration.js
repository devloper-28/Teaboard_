import React, { useState, useEffect } from "react";
import Modals from "../../../../components/common/Modal";
import { uploadedFileDownload } from "../../../uploadDocument/UploadedFileDownload";
import UploadMultipleDocuments from "../../../uploadDocument/UploadMultipleDocuments";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import CustomToast from "../../../../components/Toast";
import Base64ToPDFPreview from "../../../uploadDocument/Base64ToPDFPreview";
import { ThreeDots } from "react-loader-spinner";
import {
  createTaoUserAction,
  updateTaoUserAction,
  getTaoUserByIdAction,
  getTaoUserByIdActionSuccess,
  getAllAuctionCenterAction,
  getAllAuctionCenterAscAction,
  searchTaoUserAction,
  uploadAllDocumentsTaoUserAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditApiTaoUser,
  getAllStateAction,
  getAllStateAscAction,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  getDocumentByIdActionSuccess,
  closemodel
} from "../../../../store/actions";
import $ from "jquery";
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
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import Base64ToExcelDownload from "../../../Base64ToExcelDownload";
import { NO_OF_RECORDS } from "../../../../constants/commonConstants";
import { Tooltip } from "@mui/material";

let pageNo = 1;
const radioButtonData = [
  {
    key: "Active",
    value: "1",
  },
  {
    key: "In active",
    value: "2",
  },
  {
    key: "Suspend",
    value: "3",
  },
];

function TaoUserRegistration({ open, setOpen, isProfile, modalRight }) {
  const getTaoData = useSelector(
    (state) => state.TaoUser?.getAllTaoUserActionSuccess?.responseData
  );
  const [documentMode, setDocumentmode] = useState("");
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const [selectedValue, setSelectedValue] = useState("Option 1");
  const [editingTaoUserData, seteditingTaoUserData] = useState(null);
  const [taoName, settaoName] = useState("");
  const [getAllUserRgg, setGetAllUserRgg] = useState([]);
  const [uploadDocumentRemarks, setuploadDocumentRemarks] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [city, setcity] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [taoCode, settaoCode] = useState("");
  const [email, setemail] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState();
  const [mobileNo, setmobileNo] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [address, setaddress] = useState("");
  const [tblState, settblState] = useState("");
  const [entityCode, setentityCode] = useState("");
  const [stateCode, setstateCode] = useState("");
  const [isActive, setIsActive] = useState("");
  const [AddressError, setaddressError] = useState("");
  const [handleSwitchClick, setHandleSwitchClick] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [userCodeError, setuserCodeError] = useState("");
  const [cityError, setcityError] = useState("");
  const [stateCodeError, setstateCodeError] = useState("");
  const [emailError, setemailError] = useState("");
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [mobileNoError, setmobileNoError] = useState("");
  const [taoNameError, settaoNameError] = useState("");
  const [stateNameError, setstateNameError] = useState("");
  const [phoneNoError, setphoneNoError] = useState("");
  const [entityCodeError, setentityCodeError] = useState("");
  const [searchUserName, setsearchUserName] = useState("");
  const [searchUserCode, setsearchUserCode] = useState("");
  const [SearchEmail, setSearchEmail] = useState("");
  const [SearchRegistrationCertificate, setSearchRegistrationCertificate] =
    useState("");
  const [SearchGstNumber, setSearchGstNumber] = useState("");
  const [SearchPanNumber, setSearchPanNumber] = useState("");
  const [SearchUserProfile, setSearchUserProfile] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userProfileStatus, setuserProfileStatus] = useState("");
  const [exportType, setexportType] = useState("");
  const [loader, setLoader] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.TaoUser &&
      state.TaoUser.uploadedDocuments &&
      state.TaoUser.uploadedDocuments.responseData
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadDocumentError("");
    setRemarksError("");

    let isValid = true;
    if (!taoCode.trim()) {
      CustomToast.error("Please enter the TAO Code");
      isValid = false;
      return;
    }
    if (!auctionCenterId || auctionCenterId === "0") {
      CustomToast.error(
        "Please select an auction center from the dropdown list"
      );
      isValid = false;
      return;
    }
    if (!address.trim()) {
      CustomToast.error("Please enter the address");
      isValid = false;
      return;
    }

    if (!city.trim()) {
      CustomToast.error("Please enter the city");
      isValid = false;
      return;
    }

    if (!taoName.trim()) {
      CustomToast.error("Please enter the TAO Name");
      isValid = false;
      return;
    }

    if (!email.trim()) {
      CustomToast.error("Please enter the email ID");
      isValid = false;
      return;
    }
    if (!phoneNo.trim()) {
      CustomToast.error("Please enter a valid phone number.");
      isValid = false;
      return;
    }

    if (!tblState) {
      CustomToast.error("Please select a state from the dropdown list");
      isValid = false;
      return;
    }

    // if (!editingTaoUserData) {
    //   if (!uploadedDocuments.length && !uploadDocumentRemarks) {
    //     setUploadDocumentError("");
    //     setRemarksError("");
    //   } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
    //     CustomToast.error("Please enter the remarks");
    //     isValid = false;
    //     return;
    //   } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
    //     CustomToast.error("Please upload the document");
    //     isValid = false;
    //     return;
    //   }
    // } else {
    //   setUploadDocumentError("");
    //   setRemarksError("");
    // }

    if (!isValid) {
      return;
    }

    const newStateData = {
      taoCode: taoCode,
      auctionCenterId: auctionCenterId,
      city: city,
      address: address,
      phoneNo: phoneNo,
      tblState: tblState,
      taoName: taoName,
      email: email,
      downloadDto: uploadedDocuments,
      isActive: 1,
      roleCode: "TAOUSER",
      uploadDocumentRemarks: uploadDocumentRemarks,
    };

    try {
      if (editingTaoUserData) {
        const isFormModified =
          auctionCenterId !== editingTaoUserData.auctionCenterId ||
          taoName !== editingTaoUserData.taoName ||
          taoCode !== editingTaoUserData.taoCode ||
          mobileNo !== editingTaoUserData.mobileNo ||
          phoneNo !== editingTaoUserData.phoneNo ||
          tblState !== editingTaoUserData.parseInt.tblState ||
          email !== editingTaoUserData.email ||
          uploadDocumentRemarks !== editingTaoUserData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingTaoUserData.downloadDto.length;

        if (isFormModified) {
          editingTaoUserData.isActive = parseInt(selectedValue);
          editingTaoUserData.searchData = {
            userCode: searchUserCode,
            userName: searchUserName,
            email: SearchEmail,
            gstNo: SearchGstNumber,
            panNo: SearchPanNumber,
            isActive: userProfileStatus,
            roleCode: "TAOUSER",
            pageNo: pageNo,
            noOfRecords: NO_OF_RECORDS};
          dispatch(updateTaoUserAction(editingTaoUserData));
        }
      } else {
        dispatch(createTaoUserAction(newStateData));
      }
    } catch (error) {}
  };
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      userCode: searchUserCode,
      userName: searchUserName,
      email: SearchEmail,
      gstNo: SearchGstNumber,
      panNo: SearchPanNumber,
      isActive: userProfileStatus,
      teaBoardRegistrationCertificate: SearchRegistrationCertificate,
      roleCode: "TAOUSER",
      isActive: isActive != "" ? parseInt(isActive) : isActive,
      url: "/admin/getAllUser/search",
      exportType: exportType,
      isExport: 1,
    };
    setexportType(exportType);
    dispatch(getExportData(searchData));
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
        Base64ToExcelDownload(getExportDataResponse, "TaoDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "TaoDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  let createData = useSelector((state) => state.TaoUser.createEditApiTaoUser);

  useEffect(() => {
    if (isProfile == 1) {
      handleEditClick(atob(sessionStorage.getItem("argument2")));
    }
  }, []);
  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiTaoUser(false));
      setExpanded("panel2");
      handleClear();
      dispatch(getTaoUserByIdActionSuccess([]));
      seteditingTaoUserData(null);
      setEditModal(false);
      setViewModal(false);
      if(isProfile==1){
        dispatch(closemodel(closestatusjpgp + 1));
      }
    }
  });
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingTaoUserDataFromAc && editingTaoUserDataFromAc.userId;
    let searchData = {
      url: `/admin/TAOUser/get/getTAOUserById/${id}/${exportType}`,
    };
    setexportViewType(exportType);
    dispatch(getExportDataForView(searchData));
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
        Base64ToExcelDownload(getExportViewDataResponse, "TaoDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "TaoDetails.pdf",
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
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchTaoUserAction({
        userCode: searchUserCode,
        userName: searchUserName,
        email: SearchEmail,
        gstNo: SearchGstNumber,
        panNo: SearchPanNumber,
        isActive: userProfileStatus,
        // teaBoardRegistrationCertificate: SearchRegistrationCertificate,
        roleCode: "TAOUSER",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchTaoUserAction({
        userCode: searchUserCode,
        userName: searchUserName,
        email: SearchEmail,
        gstNo: SearchGstNumber,
        panNo: SearchPanNumber,
        isActive: userProfileStatus,
        // teaBoardRegistrationCertificate: SearchRegistrationCertificate,
        roleCode: "TAOUSER",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const handleSearch = () => {
    pageNo = 1;
    setRows([]);
    setLoader(true);
    setTimeout(() => {
        setLoader(false);
        fetchData();
      }, 1000);

    
  };

  const searchTaoData = useSelector(
    (state) => state.TaoUser?.searchResults?.responseData
  );

  const setValueData = (data, editingTaoUserData) => {
    seteditingTaoUserData({
      ...editingTaoUserData,
      stateName: data.target.value,
      stateId: data.target.options[data.target.selectedIndex].id,
    });
  };
  const handlesStateNameChange = (e) => {
    setstateCode(e.target.options[e.target.selectedIndex].id);
    settblState(e.target.value);
  };

  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    const inputElement = document.getElementById("taoUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    removeFile();
  };

  const clearSearch = () => {
    setsearchUserCode("");
    setsearchUserName("");
    setSearchEmail("");
    setSearchGstNumber("");
    setSearchPanNumber("");
    setSearchRegistrationCertificate("");
    setSearchUserProfile("");
    setRows([]);
    pageNo = 1;
    dispatch(
      searchTaoUserAction({
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
        roleCode: "TAOUSER",
        isActive,
      })
    );
    setRows(getAllUserRgg);
    setuserProfileStatus("");
  };

  const handleViewClick = (userId) => {
    dispatch(getTaoUserByIdAction(userId));
    setViewMode(true);
    // setExpanded("panel1");
    setViewModal(true);
  };

  const handleEditClick = (userId) => {
    setViewMode(false);
    dispatch(getTaoUserByIdAction(userId));
    // setExpanded("panel1");
    setEditModal(true);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      dispatch(
        searchTaoUserAction({
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
          roleCode: "TAOUSER",
          isActive,
        })
      );
      // clearSearch();
      setViewMode(false);
      dispatch(getTaoUserByIdActionSuccess([]));
      seteditingTaoUserData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      dispatch(uploadAllDocumentsTaoUserAction());
      setViewMode(false);
      dispatch(getTaoUserByIdActionSuccess([]));
      seteditingTaoUserData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getTaoUserByIdActionSuccess([]));
      seteditingTaoUserData(null);
      resetForm();
    }
  };
  const editingTaoUserDataFromAc = useSelector(
    (state) => state.TaoUser?.UserData?.responseData
  );
  useEffect(() => {
    if (editingTaoUserDataFromAc) {
      setSelectedValue(editingTaoUserDataFromAc.isActive || "");
      seteditingTaoUserData(editingTaoUserDataFromAc);
      settaoName(editingTaoUserDataFromAc.taoName || "");
      setcity(editingTaoUserDataFromAc.city || "");
      settaoCode(editingTaoUserDataFromAc.taoCode || "");
      setauctionCenterId(editingTaoUserDataFromAc.auctionCenterId || "");
      setaddress(editingTaoUserDataFromAc.address || "");
      setemail(editingTaoUserDataFromAc.email || "");
      setentityCode(editingTaoUserDataFromAc.entityCode || "");
      setmobileNo(editingTaoUserDataFromAc.mobileNo || "");
      setphoneNo(editingTaoUserDataFromAc.phoneNo || "");
      setstateCode(editingTaoUserDataFromAc.stateCode || "");
      settblState(editingTaoUserDataFromAc.tblState || "");
      setuploadDocumentRemarks(
        editingTaoUserDataFromAc.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingTaoUserDataFromAc.downloadDto || []);
    } else {
      dispatch(
        getAllAuctionCenterAscAction({
          sortBy: "asc",
          sortColumn: "auctionCenterName",
        })
      );
      dispatch(
        getAllStateAscAction({
          sortBy: "asc",
          sortColumn: "stateName",
        })
      );
    }
  }, [editingTaoUserDataFromAc]);

  const getAllStateDataResponse = useSelector(
    (state) => state?.state?.getAllStateAsc?.responseData
  );

  const getAllStateData =
    getAllStateDataResponse &&
    getAllStateDataResponse.filter((data) => 1 == data.isActive);

  const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   if (searchTaoData != null && searchTaoData != undefined) {
  //     setGetAllUserRgg(searchTaoData);
  //     setRows(searchTaoData);
  //   } else {
  //     setGetAllUserRgg([]);
  //     setRows([]);
  //   }
  // }, [searchTaoData]);
  // useEffect(() => {
  //   const newRows = searchTaoData || [];
  //   setRows((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
  // }, [searchTaoData]);

  useEffect(() => {
    const newRows = searchTaoData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      newRows.forEach((newRow) => {
        const index = currentRows.findIndex(
          (row) => row.userId === newRow.userId
        );

        if (index !== -1) {
          currentRows[index] = newRow;
        } else {
          currentRows.push(newRow);
        }
      });

      return currentRows;
    });
  }, [searchTaoData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "userName",
      title: "Company Name",
    },
    // {
    //   name: "teaBoardRegistrationCertificate",
    //   title: "Tao Certificate Number",
    // },
    {
      name: "contactDetails",
      title: "Contact Details",
      getCellValue: (rows) => <ContactDetails data={rows} />,
    },
    // {
    //   name: "taxDetail",
    //   title: "TAX Details",
    //   getCellValue: (rows) => <TaxDetail data={rows} />,
    // },
    {
      name: "action",
      title: "Action",
      getCellValue: (rows) => <ActionData data={rows} />,
    },
  ];

  function ContactDetails(data) {
    return (
      <>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Phone No</th>
              <th scope="col">Mobile No</th>
              <th scope="col">EmailId</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.data.phoneNo}</td>
              <td>{data.data.mobileNo}</td>
              <td>{data.data.email}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  // function TaxDetail(data) {
  //   return (
  //     <>
  //       <table class="table">
  //         {/* <thead>
  //           <tr>
  //             <th scope="col">GST No</th>
  //             <th scope="col">PAN No</th>
  //           </tr>
  //         </thead> */}
  //         <tbody>
  //           <tr>
  //             <td>{data.data.gstNo}</td>
  //             <td>{data.data.panNo}</td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </>
  //   );
  // }

  function StatusData(data) {
    const handleSwitchChange = () => {
      setHandleSwitchClick(true);
      dispatch(getTaoUserByIdAction(data.data.userId));
    };

    return (
      <>
        {modalRight
          ?.map((ele) => ele.rightIds)
          ?.at(0)
          ?.includes("5") ? (
          <div class="Switch">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id={`customSwitch${data.data.userId}`}
                checked={data.data.isActive === 1 ? true : false}
                onChange={handleSwitchChange}
              />

              <label
                class="custom-control-label"
                for={`customSwitch${data.data.userId}`}
              >
                {data.data.isActive === 1 ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.userId}`}
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
    (state) => state.documentReducer?.documentData?.responseData
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
        {modalRight
          ?.map((ele) => ele.rightIds)
          ?.at(0)
          ?.includes("7") && (
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
    setcity("");
    setentityCode("");
    setcityError("");
    setaddress("");
    setmobileNo("");
    setphoneNo("");
    setstateCode("");
    settblState("");
    settaoName("");
    settaoCode("");
    setemail("");
    setentityCodeError("");
    setmobileNoError("");
    setphoneNoError("");
    setstateNameError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setaddressError("");
    setemailError("");
    setUploadDocumentError("");
    setRemarksError("");
    setuserProfileStatus("");
    seteditingTaoUserData(null);
    setuploadDocumentRemarks("");
    const inputElement = document.getElementById("taoUpload");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  function ActionData(data) {
    return (
      <>
        <div class="Action">
          <i
            className="fa fa-edit"
            onClick={() => handleEditClick(data.data.userId)}
          ></i>
          <i
            className="fa fa-eye"
            onClick={() => handleViewClick(data.data.userId)}
          ></i>
          <i
            className="fa fa-history"
            onClick={() => {
              handleHistoryViewClick(data.data.userId);
            }}
          ></i>
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

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_UserLogin";
    const moduleName = "TaoUser";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
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
    dispatch(
      searchTaoUserAction({
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
        roleCode: "TAOUSER",
        isActive,
      })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getTaoUserByIdActionSuccess([]));
    seteditingTaoUserData(null);
    resetForm();
  };
  const closestatusjpgp = useSelector(
    (state) => state.createBuyer.closemodel
  );
  const handleCloseEditModal = () => {
    if(isProfile==1){
      dispatch(closemodel(closestatusjpgp + 1));
    }
    setEditModal(false);
    dispatch(
      searchTaoUserAction({
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
        roleCode: "TAOUSER",
        isActive,
      })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getTaoUserByIdActionSuccess([]));
    seteditingTaoUserData(null);
    resetForm();
  };

  return (
    <>
      {/* Create */}
      {modalRight
        ?.map((ele) => ele.rightIds)
        ?.at(0)
        ?.includes("1") && (
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
            <Typography>Create TAO User Registration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>TAO Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          value={editingTaoUserData?.taoName || taoName}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaoUserData
                              ? seteditingTaoUserData({
                                  ...editingTaoUserData,
                                  taoName: e.target.value,
                                })
                              : settaoName(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {taoNameError && (
                          <p className="errorLabel">{taoNameError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>TAO Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="10"
                          value={editingTaoUserData?.taoCode || taoCode}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaoUserData
                              ? seteditingTaoUserData({
                                  ...editingTaoUserData,
                                  taoCode: e.target.value,
                                })
                              : settaoCode(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {userCodeError && (
                          <p className="errorLabel">{userCodeError}</p>
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
                            editingTaoUserData?.auctionCenterId ||
                            auctionCenterId
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaoUserData
                              ? seteditingTaoUserData({
                                  ...editingTaoUserData,
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
                        <label>Address</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="500"
                          value={editingTaoUserData?.address || address}
                          onChange={(e) =>
                            editingTaoUserData
                              ? seteditingTaoUserData({
                                  ...editingTaoUserData,
                                  address: e.target.value,
                                })
                              : setaddress(e.target.value)
                          }
                          disabled={viewMode}
                        />
                        {AddressError && (
                          <p className="errorLabel">{AddressError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Phone</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingTaoUserData?.phoneNo || phoneNo}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaoUserData
                              ? seteditingTaoUserData({
                                  ...editingTaoUserData,
                                  phoneNo: e.target.value,
                                })
                              : setphoneNo(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {phoneNoError && (
                          <p className="errorLabel">{phoneNoError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Email</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          value={editingTaoUserData?.email || email}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaoUserData
                              ? seteditingTaoUserData({
                                  ...editingTaoUserData,
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
                        <label>City</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          value={editingTaoUserData?.city || city}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaoUserData
                              ? seteditingTaoUserData({
                                  ...editingTaoUserData,
                                  city: e.target.value,
                                })
                              : setcity(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {cityError && <p className="errorLabel">{cityError}</p>}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Name</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingTaoUserData?.tblState || tblState}
                          onChange={(e) =>
                            !viewMode &&
                            (editingTaoUserData
                              ? setValueData(e, editingTaoUserData)
                              : handlesStateNameChange(e))
                          }
                          disabled={viewMode}
                        >
                          <option value="">Select State Name</option>
                          {getAllStateData?.map((state) => (
                            <option
                              id={state.stateCode}
                              key={state.stateId}
                              value={state.stateId}
                            >
                              {state.stateName}
                            </option>
                          ))}
                        </select>
                        {stateNameError && (
                          <p className="errorLabel">{stateNameError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingTaoUserData?.stateCode || stateCode}
                          readOnly
                        />
                        {stateCodeError && (
                          <p className="errorLabel">{stateCodeError}</p>
                        )}
                      </div>
                    </div>
                    {editingTaoUserData ? (
                      <div className="col-md-4">
                        <div className="FormGroup">
                          <label>Entity Code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={entityCode}
                            readOnly
                          />
                          {entityCodeError && (
                            <p className="errorLabel">{entityCodeError}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {editingTaoUserData ? (
                      <div className="col-md-auto d-flex CheckboxGroup">
                        {radioButtonData &&
                          radioButtonData.map((data, index) => (
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name={data.value}
                                id={data.key}
                                value={data.value}
                                checked={
                                  selectedValue == data.value ? true : false
                                }
                                onChange={(event) => handleRadioChange(event)}
                                disabled={viewMode}
                              />
                              <label class="form-check-label" for={data.key}>
                                {data.key}
                              </label>
                              &nbsp;&nbsp;
                            </div>
                          ))}
                      </div>
                    ) : (
                      ""
                    )}
                    {!viewMode ? (
                      <>
                        <div className="col-md-12">
                          <UploadMultipleDocuments
                            onFileSelect={handleFileUpload}
                            uploadedFiles={uploadedFiles}
                            setUploadedFiles={setUploadedFiles}
                            uploadDocumentError={uploadDocumentError}
                            inputId="taoUpload"
                          />
                        </div>

                        <div className="col-md-12 mt-2">
                          <textarea
                            className="form-control"
                            placeholder="Enter Remarks"
                            value={
                              editingTaoUserData?.uploadDocumentRemarks ||
                              uploadDocumentRemarks
                            }
                            onChange={(e) =>
                              !viewMode &&
                              (editingTaoUserData
                                ? seteditingTaoUserData({
                                    ...editingTaoUserData,
                                    uploadDocumentRemarks: e.target.value,
                                  })
                                : setuploadDocumentRemarks(e.target.value))
                            }
                            disabled={viewMode}
                          ></textarea>
                          {remarksError && (
                            <p className="errorLabel" style={{ color: "red" }}>
                              {remarksError}
                            </p>
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
          title={"Edit TAO User Registration"}
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
                    <label>TAO Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingTaoUserData?.taoName || taoName}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaoUserData
                          ? seteditingTaoUserData({
                              ...editingTaoUserData,
                              taoName: e.target.value,
                            })
                          : settaoName(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {taoNameError && (
                      <p className="errorLabel">{taoNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>TAO Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={editingTaoUserData?.taoCode || taoCode}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaoUserData
                          ? seteditingTaoUserData({
                              ...editingTaoUserData,
                              taoCode: e.target.value,
                            })
                          : settaoCode(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {userCodeError && (
                      <p className="errorLabel">{userCodeError}</p>
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
                        editingTaoUserData?.auctionCenterId || auctionCenterId
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaoUserData
                          ? seteditingTaoUserData({
                              ...editingTaoUserData,
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
                    <label>Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="500"
                      value={editingTaoUserData?.address || address}
                      onChange={(e) =>
                        editingTaoUserData
                          ? seteditingTaoUserData({
                              ...editingTaoUserData,
                              address: e.target.value,
                            })
                          : setaddress(e.target.value)
                      }
                      disabled={viewMode}
                    />
                    {AddressError && (
                      <p className="errorLabel">{AddressError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Phone</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingTaoUserData?.phoneNo || phoneNo}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaoUserData
                          ? seteditingTaoUserData({
                              ...editingTaoUserData,
                              phoneNo: e.target.value,
                            })
                          : setphoneNo(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {phoneNoError && (
                      <p className="errorLabel">{phoneNoError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Email</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingTaoUserData?.email || email}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaoUserData
                          ? seteditingTaoUserData({
                              ...editingTaoUserData,
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
                    <label>City</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingTaoUserData?.city || city}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaoUserData
                          ? seteditingTaoUserData({
                              ...editingTaoUserData,
                              city: e.target.value,
                            })
                          : setcity(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {cityError && <p className="errorLabel">{cityError}</p>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingTaoUserData?.tblState || tblState}
                      onChange={(e) =>
                        !viewMode &&
                        (editingTaoUserData
                          ? setValueData(e, editingTaoUserData)
                          : handlesStateNameChange(e))
                      }
                      disabled={viewMode}
                    >
                      <option value="">Select State Name</option>
                      {getAllStateData?.map((state) => (
                        <option
                          id={state.stateCode}
                          key={state.stateId}
                          value={state.stateId}
                        >
                          {state.stateName}
                        </option>
                      ))}
                    </select>
                    {stateNameError && (
                      <p className="errorLabel">{stateNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingTaoUserData?.stateCode || stateCode}
                      readOnly
                    />
                    {stateCodeError && (
                      <p className="errorLabel">{stateCodeError}</p>
                    )}
                  </div>
                </div>
                {editingTaoUserData ? (
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Entity Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={entityCode}
                        readOnly
                      />
                      {entityCodeError && (
                        <p className="errorLabel">{entityCodeError}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {editingTaoUserData ? (
                  <div className="col-md-auto d-flex CheckboxGroup">
                    {radioButtonData &&
                      radioButtonData.map((data, index) => (
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name={data.value}
                            id={data.key}
                            value={data.value}
                            checked={selectedValue == data.value ? true : false}
                            onChange={(event) => handleRadioChange(event)}
                            disabled={viewMode}
                          />
                          <label class="form-check-label" for={data.key}>
                            {data.key}
                          </label>
                          &nbsp;&nbsp;
                        </div>
                      ))}
                  </div>
                ) : (
                  ""
                )}
                {!viewMode ? (
                  <>
                    <div className="col-md-12">
                      <UploadMultipleDocuments
                        onFileSelect={handleFileUpload}
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
                        uploadDocumentError={uploadDocumentError}
                        inputId="taoUpload"
                      />
                    </div>

                    <div className="col-md-12 mt-2">
                      <textarea
                        className="form-control"
                        placeholder="Enter Remarks"
                        value={
                          editingTaoUserData?.uploadDocumentRemarks ||
                          uploadDocumentRemarks
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingTaoUserData
                            ? seteditingTaoUserData({
                                ...editingTaoUserData,
                                uploadDocumentRemarks: e.target.value,
                              })
                            : setuploadDocumentRemarks(e.target.value))
                        }
                        disabled={viewMode}
                      ></textarea>
                      {remarksError && (
                        <p className="errorLabel" style={{ color: "red" }}>
                          {remarksError}
                        </p>
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
          title={"View TAO User Registration"}
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
                    <label>TAO Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingTaoUserData?.taoName || taoName}
                      disabled={viewMode}
                    />
                    {taoNameError && (
                      <p className="errorLabel">{taoNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>TAO Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={editingTaoUserData?.taoCode || taoCode}
                      disabled={viewMode}
                    />
                    {userCodeError && (
                      <p className="errorLabel">{userCodeError}</p>
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
                        editingTaoUserData?.auctionCenterId || auctionCenterId
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
                    <label>Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="500"
                      value={editingTaoUserData?.address || address}
                      disabled={viewMode}
                    />
                    {AddressError && (
                      <p className="errorLabel">{AddressError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Phone</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingTaoUserData?.phoneNo || phoneNo}
                      disabled={viewMode}
                    />
                    {phoneNoError && (
                      <p className="errorLabel">{phoneNoError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Email</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingTaoUserData?.email || email}
                      disabled={viewMode}
                    />
                    {emailError && <p className="errorLabel">{emailError}</p>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>City</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingTaoUserData?.city || city}
                      disabled={viewMode}
                    />
                    {cityError && <p className="errorLabel">{cityError}</p>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingTaoUserData?.tblState || tblState}
                      disabled={viewMode}
                    >
                      <option value="">Select State Name</option>
                      {getAllStateData?.map((state) => (
                        <option
                          id={state.stateCode}
                          key={state.stateId}
                          value={state.stateId}
                        >
                          {state.stateName}
                        </option>
                      ))}
                    </select>
                    {stateNameError && (
                      <p className="errorLabel">{stateNameError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingTaoUserData?.stateCode || stateCode}
                      readOnly
                    />
                    {stateCodeError && (
                      <p className="errorLabel">{stateCodeError}</p>
                    )}
                  </div>
                </div>
                {editingTaoUserData ? (
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Entity Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={entityCode}
                        readOnly
                      />
                      {entityCodeError && (
                        <p className="errorLabel">{entityCodeError}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {editingTaoUserData ? (
                  <div className="col-md-auto d-flex CheckboxGroup">
                    {radioButtonData &&
                      radioButtonData.map((data, index) => (
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name={data.value}
                            id={data.key}
                            value={data.value}
                            checked={selectedValue == data.value ? true : false}
                            onChange={(event) => handleRadioChange(event)}
                            disabled={viewMode}
                          />
                          <label class="form-check-label" for={data.key}>
                            {data.key}
                          </label>
                          &nbsp;&nbsp;
                        </div>
                      ))}
                  </div>
                ) : (
                  ""
                )}

                <div className="col-md-12">
                  <div className="BtnGroup">
                    {modalRight
                      ?.map((ele) => ele.rightIds)
                      ?.at(0)
                      ?.includes("11") && (
                      <button
                        class="SubmitBtn"
                        onClick={() => handleViewExport("excel")}
                      >
                        <i class="fa fa-file-excel"></i>
                      </button>
                    )}
                    {modalRight
                      ?.map((ele) => ele.rightIds)
                      ?.at(0)
                      ?.includes("10") && (
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
      {modalRight
        ?.map((ele) => ele.rightIds)
        ?.at(0)
        ?.includes("12") && (
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
            <Typography>Manage TAO User Registration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                  <div className="col-md-4">
                      <div className="FormGroup">
                        <label>TAO Code</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search TAO Code"
                          value={searchUserCode}
                          onChange={(e) => setsearchUserCode(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>TAO Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search User Name"
                          value={searchUserName}
                          onChange={(e) => setsearchUserName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Email ID</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Email Id"
                          value={SearchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tao Registration certificate</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search Registration certificate"
                        value={SearchRegistrationCertificate}
                        onChange={(e) =>
                          setSearchRegistrationCertificate(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tao GST Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search GST Number"
                        value={SearchGstNumber}
                        onChange={(e) => setSearchGstNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tao PAN Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search PAN Number"
                        value={SearchPanNumber}
                        onChange={(e) => setSearchPanNumber(e.target.value)}
                      />
                    </div>
                  </div> */}
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>User Profile Status</label>
                        <select
                          className="form-control select-form"
                          placeholder="Select User Status"
                          value={userProfileStatus}
                          onChange={(e) => setuserProfileStatus(e.target.value)}
                        >
                          <option value="">All</option>
                          <option value={1}>Active</option>
                          <option value={2}>In-Active</option>
                          <option value={3}>Suspend</option>
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
                        {modalRight
                          ?.map((ele) => ele.rightIds)
                          ?.at(0)
                          ?.includes("9") && (
                          <button
                            class="SubmitBtn"
                            onClick={() => handleExport("excel")}
                          >
                            <i class="fa fa-file-excel"></i>
                          </button>
                        )}
                        {modalRight
                          ?.map((ele) => ele.rightIds)
                          ?.at(0)
                          ?.includes("8") && (
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
              {/* 
            <div className="row">
              <div className="col-lg-12 mt-4">
                <div className="TableBox CreateStateMaster">
                  <TableComponent
                    columns={columns}
                    rows={
                      rows?.length > 0
                        ? rows?.map((row, index) => ({
                            ...row,
                            index: index + 1,
                          }))
                        : []
                    }
                    setRows={setRows}
                    sorting={true}
                    dragdrop={false}
                    fixedColumnsOn={false}
                    resizeingCol={false}
                  />
                </div>
              </div>
            </div> */}

              <div className="TableBox mt-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th rowSpan={2}>Sr.</th>
                      <th rowSpan={2}>TAO Code</th>
                      <th rowSpan={2}>TAO Name</th>
                      <th colSpan={2} className="text-center">
                        Contact Details
                      </th>
                      <th rowSpan={2}>Action</th>
                    </tr>
                    <tr>
                      <th>Phone Number</th>
                      <th>Email ID</th>
                    </tr>
                  </thead>

                  <tbody>
                  {rows?.length > 0  ? (<>
                    {rows?.map((row, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{row.userCode}</td>
                        <td>{row.userName}</td>
                        <td className="Phone">
                          <i className="fa fa-phone"></i> &nbsp;{row.phoneNo}
                        </td>
                        <td className="Email">
                          <i className="fa fa-envelope"></i> &nbsp;{row.email}
                        </td>
                        <td className="Action">
                          {modalRight
                            ?.map((ele) => ele.rightIds)
                            ?.at(0)
                            ?.includes("2") && (
                            <Tooltip title="Edit" placement="top">
                              <i
                                className="fa fa-edit"
                                onClick={() => handleEditClick(row.userId)}
                              ></i>
                            </Tooltip>
                          )}
                          {modalRight
                            ?.map((ele) => ele.rightIds)
                            ?.at(0)
                            ?.includes("3") && (
                            <Tooltip title="View" placement="top">
                              <i
                                className="fa fa-eye"
                                onClick={() => handleViewClick(row.userId)}
                              ></i>
                            </Tooltip>
                          )}
                          {modalRight
                            ?.map((ele) => ele.rightIds)
                            ?.at(0)
                            ?.includes("4") && (
                            <Tooltip title="History" placement="top">
                              <i
                                className="fa fa-history"
                                onClick={() => {
                                  handleHistoryViewClick(row.userId);
                                }}
                              ></i>
                            </Tooltip>
                          )}
                        </td>
                      </tr>
                    ))}
                    </>) : (<>
                     
                     <tr>
                      <td colSpan={6}>
                      {loader ? (
                                    <>
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
                                    </>
                                  ) : (
                                    <>
                                      <div className="NoData">No Data</div>
                                    </>
                                  )}
                        </td>
                     </tr>
                    </>)}
                    
                  </tbody>
                </table>
              </div>
              <button class="SubmitBtn" onClick={handleViewMore}>
                View More
              </button>
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Upload Document*/}
      {modalRight
        ?.map((ele) => ele.rightIds)
        ?.at(0)
        ?.includes("6") && (
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
                    title: "TAO Name",
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
                  getAllUploadedDoc == null || getAllUploadedDoc == undefined
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
          <Modal.Body>
            <TableComponent
              columns={[
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
              ]}
              rows={
                getHistoryIdData == null || getHistoryIdData == undefined
                  ? []
                  : getHistoryIdData?.map((row, index) => ({
                      ...row,
                      index: index + 1,
                    }))
              }
              sorting={true}
              dragdrop={false}
              fixedColumnsOn={false}
              resizeingCol={false}
            />
          </Modal.Body>
        </Modal>
      )}

      {/* Preview */}
      {previewDocumentContent != "" && "preview" == documentMode ? (
        <Modals
          title={"TAO USER"}
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

export default TaoUserRegistration;
