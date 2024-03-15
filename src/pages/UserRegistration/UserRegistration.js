import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import CustomToast from "../../components/Toast";
import {
  createUserRggAction,
  updateUserRggAction,
  getUserRggByIdAction,
  getUserRggByIdActionSuccess,
  searchUserRggAction,
  uploadAllDocumentsUserRggAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditApiUserRgg,
} from "../../store/actions";
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
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { Card, Modal } from "react-bootstrap";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";

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

function UserRegistration({ open, setOpen }) {
  const getTeaData = useSelector(
    (state) => state.User?.getAllUserActionSuccess?.responseData
  );

  const [selectedValue, setSelectedValue] = useState("Option 1");
  const [editingUserRggData, seteditingUserRggData] = useState(null);
  const [contactPersonName, setcontactPersonName] = useState("");
  const [getAllUserRgg, setGetAllUserRgg] = useState([]);
  const [getSearchUserRgg, setgetSearchUserRgg] = useState("");
  const [uploadDocumentRemarks, setuploadDocumentRemarks] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [city, setcity] = useState("");
  const [teaBoardUserCode, setteaBoardUserCode] = useState("");
  const [email, setemail] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState("");
  const [gstNo, setgstNo] = useState("");
  const [mobileNo, setmobileNo] = useState("");
  const [panNo, setpanNo] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [address, setaddress] = useState("");
  const [fax, setfax] = useState("");
  const [stateId, settblState] = useState("");
  const [entityCode, setentityCode] = useState("");
  const [stateCode, setstateCode] = useState("");
  const [isActive, setIsActive] = useState("");
  const [teaBoardUserName, setteaBoardUserName] = useState("");
  const [AddressError, setaddressError] = useState("");
  const [handleSwitchClick, setHandleSwitchClick] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [userCodeError, setuserCodeError] = useState("");
  const [cityError, setcityError] = useState("");
  const [stateCodeError, setstateCodeError] = useState("");
  const [contactPersonError, setcontactPersonError] = useState("");
  const [emailError, setemailError] = useState("");
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [gstNoError, setgstNoError] = useState("");
  const [mobileNoError, setmobileNoError] = useState("");
  const [contactPersonNameError, setcontactPersonNameError] = useState("");
  const [panNoError, setpanNoError] = useState("");
  const [stateNameError, setstateNameError] = useState("");
  const [phoneNoError, setphoneNoError] = useState("");
  const [faxError, setfaxError] = useState("");
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

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.User &&
      state.User.uploadedDocuments &&
      state.User.uploadedDocuments.responseData
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadDocumentError("");
    setRemarksError("");

    let isValid = true;
    if (!teaBoardUserCode.trim()) {
      CustomToast.error("Please enter the teaBoardUserCode");
      isValid = false;
      return;
    }
    if (!auctionCenterId) {
      CustomToast.error(
        "Please select an auction center from the dropdown menu."
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

    if (!contactPersonName.trim()) {
      CustomToast.error("Please enter the contact person");
      isValid = false;
      return;
    }

    if (!fax.trim()) {
      CustomToast.error("Please enter a valid fax number");
      isValid = false;
      return;
    }
    if (!email.trim()) {
      CustomToast.error("Please enter the email ID");
      isValid = false;
      return;
    }
    if (!gstNo) {
      CustomToast.error("Please enter the GSTNo");
      isValid = false;
      return;
    }
    if (!mobileNo) {
      CustomToast.error("Please enter the mobile number");
      isValid = false;
      return;
    }
    if (!panNo.trim()) {
      CustomToast.error("Please enter the PANno.");
      isValid = false;
      return;
    }
    if (!phoneNo.trim()) {
      CustomToast.error("Please enter a valid phone number");
      isValid = false;
      return;
    }
    if (!stateCode.trim()) {
      CustomToast.error("Please enter the contact person address");
      isValid = false;
      return;
    }
    if (!stateId) {
      CustomToast.error("Please select a state from the dropdown list");
      isValid = false;
      return;
    }

    // if (!editingUserRggData) {
    //   if (!uploadedDocuments.length && !uploadDocumentRemarks) {
    //     setUploadDocumentError("");
    //     setRemarksError("");
    //   } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
    //     CustomToast.error("Please enter the remarks");
    //     isValid = false;
    //     return;
    //   } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
    //     CustomToast.error("Please upload the document");
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
      teaBoardUserCode: teaBoardUserCode,
      auctionCenterId: auctionCenterId,
      city: city,
      address: address,
      fax: fax,
      gstNo: gstNo,
      mobileNo: mobileNo,
      panNo: panNo,
      phoneNo: phoneNo,
      stateCode: stateCode,
      stateId: stateId,
      teaBoardUserName: contactPersonName,
      email: email,
      contactPersonName: contactPersonName,
      downloadDto: uploadedDocuments,
      isActive: 1,
      sessionUserId: 1,
      roleCode: "TEABOARDUSER",
    };

    try {
      if (editingUserRggData) {
        const isFormModified =
          auctionCenterId !== editingUserRggData.auctionCenterId ||
          teaBoardUserName !== editingUserRggData.contactPersonName ||
          teaBoardUserCode !== editingUserRggData.teaBoardUserCode ||
          fax !== editingUserRggData.fax ||
          gstNo !== editingUserRggData.gstNo ||
          auctionCenterId !== editingUserRggData.auctionCenterId ||
          mobileNo !== editingUserRggData.mobileNo ||
          panNo !== editingUserRggData.panNo ||
          phoneNo !== editingUserRggData.phoneNo ||
          stateCode !== editingUserRggData.stateCode ||
          stateId !== editingUserRggData.stateId ||
          contactPersonName !== editingUserRggData.contactPersonName ||
          email !== editingUserRggData.email ||
          uploadDocumentRemarks !== editingUserRggData.uploadDocumentRemarks ||
          uploadedDocuments.length !== editingUserRggData.downloadDto.length;

        if (isFormModified) {
          editingUserRggData.isActive = parseInt(selectedValue);
          dispatch(updateUserRggAction(editingUserRggData));
        }
      } else {
        dispatch(createUserRggAction(newStateData));
      }
    } catch (error) {}
  };

  let createData = useSelector((state) => state.User.createEditApiUserRgg);

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiUserRgg(false));
      setExpanded("panel2");
      handleClear();
      dispatch(getUserRggByIdActionSuccess([]));
      seteditingUserRggData(null);
    }
  });

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter?.getAllAuctionCenter?.responseData
  );
  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const handleSearch = () => {
    let searchData = {
      userCode: searchUserCode,
      userName: searchUserName,
      email: SearchEmail,
      gstNo: SearchGstNumber,
      panNo: SearchPanNumber,
      teaBoardRegistrationCertificate: SearchRegistrationCertificate,
      roleCode: "TEABOARDUSER",
      isActive: SearchUserProfile,
    };

    dispatch(searchUserRggAction(searchData));
  };

  const searchTeaData = useSelector(
    (state) => state.User?.searchResults?.responseData
  );

  const setValueData = (data, editingUserRggData) => {
    seteditingUserRggData({
      ...editingUserRggData,
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
    const inputElement = document.getElementById("teaBoardUserUpload");
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
    dispatch(searchUserRggAction({ roleCode: "TEABOARDUSER", isActive }));
    setRows(getAllUserRgg);
  };

  const handleViewClick = (userId) => {
    dispatch(getUserRggByIdAction(userId));
    setViewMode(true);
    setExpanded("panel1");
  };

  const handleEditClick = (userId) => {
    setViewMode(false);
    dispatch(getUserRggByIdAction(userId));
    setExpanded("panel1");
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      dispatch(searchUserRggAction({ roleCode: "TEABOARDUSER", isActive }));
      clearSearch();
      setViewMode(false);
      dispatch(getUserRggByIdActionSuccess([]));
      seteditingUserRggData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      dispatch(uploadAllDocumentsUserRggAction());
      setViewMode(false);
      dispatch(getUserRggByIdActionSuccess([]));
      seteditingUserRggData(null);
      resetForm();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getUserRggByIdActionSuccess([]));
      seteditingUserRggData(null);
      resetForm();
    }
  };
  const editingUserRggDataFromAc = useSelector(
    (state) => state.User?.UserData?.responseData
  );
  useEffect(() => {
    if (editingUserRggDataFromAc) {
      setSelectedValue(editingUserRggDataFromAc.isActive || "");
      seteditingUserRggData(editingUserRggDataFromAc);
      setcity(editingUserRggDataFromAc.city || "");
      setteaBoardUserCode(editingUserRggDataFromAc.teaBoardUserCode || "");
      setcontactPersonName(editingUserRggDataFromAc.contactPersonName || "");
      setauctionCenterId(editingUserRggDataFromAc.auctionCenterId || "");
      setaddress(editingUserRggDataFromAc.address || "");
      setcontactPersonName(editingUserRggDataFromAc.contactPersonName || "");
      setemail(editingUserRggDataFromAc.email || "");
      setentityCode(editingUserRggDataFromAc.entityCode || "");
      setfax(editingUserRggDataFromAc.fax || "");
      setgstNo(editingUserRggDataFromAc.gstNo || "");
      setmobileNo(editingUserRggDataFromAc.mobileNo || "");
      setpanNo(editingUserRggDataFromAc.panNo || "");
      setphoneNo(editingUserRggDataFromAc.phoneNo || "");
      setstateCode(editingUserRggDataFromAc.stateCode || "");
      settblState(editingUserRggDataFromAc.stateId || "");
      setuploadDocumentRemarks(
        editingUserRggDataFromAc.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingUserRggDataFromAc.downloadDto || []);
    }
  }, [editingUserRggDataFromAc]);

  const getAllStateData = useSelector(
    (state) => state.state?.getAllState?.responseData
  );

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (searchTeaData != null && searchTeaData != undefined) {
      setGetAllUserRgg(searchTeaData);
      setRows(searchTeaData);
    } else {
      setGetAllUserRgg([]);
      setRows([]);
    }
  }, [searchTeaData]);

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "userName",
      title: "Company Name",
    },
    {
      name: "teaBoardRegistrationCertificate",
      title: "Tea Board Certificate Number",
    },
    {
      name: "contactDetails",
      title: "Contact Details",
      getCellValue: (rows) => <ContactDetails data={rows} />,
    },
    {
      name: "taxDetail",
      title: "TAX Details",
      getCellValue: (rows) => <TaxDetail data={rows} />,
    },
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

  function TaxDetail(data) {
    return (
      <>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">GST No</th>
              <th scope="col">PAN No</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.data.gstNo}</td>
              <td>{data.data.panNo}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  function StatusData(data) {
    const handleSwitchChange = () => {
      setHandleSwitchClick(true);
      dispatch(getUserRggByIdAction(data.data.userId));
    };

    return (
      <>
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
      </>
    );
  }

  const handleDownloadClick = (uploadDocumentConfId) => {
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };

  const getUploadedIdData = useSelector(
    (state) => state.documentReducer?.documentData?.responseData
  );

  const handleDownloadPDF = () => {
    if (getUploadedIdData && getUploadedIdData.documentContent) {
      uploadedFileDownload(
        getUploadedIdData.documentContent,
        getUploadedIdData.documentName,
        "data:application/pdf;base64"
      );
    }
  };

  function UploadActionData(data) {
    return (
      <div class="Action">
        <i
          class="fa fa-download"
          onClick={() => {
            handleDownloadClick(data.data.uploadDocumentConfId);
            handleDownloadPDF();
          }}
        ></i>
      </div>
    );
  }
  const resetForm = () => {
    setauctionCenterId("");
    setauctionCenterId("");
    setcity("");
    setentityCode("");
    setcityError("");
    setfax("");
    setaddress("");
    setgstNo("");
    setmobileNo("");
    setpanNo("");
    setphoneNo("");
    setstateCode("");
    settblState("");
    setcontactPersonName("");
    setemail("");
    setentityCodeError("");
    setfaxError("");
    setgstNoError("");
    setmobileNoError("");
    setpanNoError("");
    setphoneNoError("");
    setstateCodeError("");
    setstateNameError("");
    setauctionCenterIdError("");
    setUploadDocumentError("");
    setRemarksError("");
    setaddressError("");
    setcontactPersonError("");
    setemailError("");
    setUploadDocumentError("");
    setRemarksError("");
    setuserProfileStatus("");
    seteditingUserRggData(null);
    const inputElement = document.getElementById("teaBoardUserUpload");
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
    const moduleName = "Tea board user";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
  };
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
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

  return (
    <>
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
          <Typography>
            {viewMode
              ? "View User Registration"
              : editingUserRggData
              ? "Edit TeaBoard Registration"
              : "Create TeaBoard Registration"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Contact Person Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          editingUserRggData?.contactPersonName ||
                          contactPersonName
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserRggData
                            ? seteditingUserRggData({
                                ...editingUserRggData,
                                contactPersonName: e.target.value,
                              })
                            : setcontactPersonName(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {contactPersonNameError && (
                        <p className="errorLabel">{contactPersonNameError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>TB User Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          editingUserRggData?.teaBoardUserCode ||
                          teaBoardUserCode
                        }
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserRggData
                            ? seteditingUserRggData({
                                ...editingUserRggData,
                                teaBoardUserCode: e.target.value,
                              })
                            : setteaBoardUserCode(e.target.value))
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
                      <select
                        className="form-control select-form"
                        value={
                          editingUserRggData?.auctionCenterId || auctionCenterId
                        }
                        onChange={
                          (e) =>
                            !viewMode &&
                            (editingUserRggData
                              ? seteditingUserRggData({
                                  ...editingUserRggData,
                                  auctionCenterId: e.target.value,
                                })
                              : setauctionCenterId(
                                  [].slice
                                    .call(e.target.selectedOptions)
                                    .map((item) => item.value)
                                ))
                          // setauctionCenterId(e.target.value))
                        }
                        multiple
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
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserRggData?.address || address}
                        onChange={(e) =>
                          editingUserRggData
                            ? seteditingUserRggData({
                                ...editingUserRggData,
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
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserRggData?.phoneNo || phoneNo}
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserRggData
                            ? seteditingUserRggData({
                                ...editingUserRggData,
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
                      <label>Mobile No.</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserRggData?.mobileNo || mobileNo}
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserRggData
                            ? seteditingUserRggData({
                                ...editingUserRggData,
                                mobileNo: e.target.value,
                              })
                            : setmobileNo(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {mobileNoError && (
                        <p className="errorLabel">{mobileNoError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Fax</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserRggData?.fax || fax}
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserRggData
                            ? seteditingUserRggData({
                                ...editingUserRggData,
                                fax: e.target.value,
                              })
                            : setfax(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {faxError && <p className="errorLabel">{faxError}</p>}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>PAN No.</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserRggData?.panNo || panNo}
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserRggData
                            ? seteditingUserRggData({
                                ...editingUserRggData,
                                panNo: e.target.value,
                              })
                            : setpanNo(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {panNoError && <p className="errorLabel">{panNoError}</p>}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>GSTNo</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserRggData?.gstNo || gstNo}
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserRggData
                            ? seteditingUserRggData({
                                ...editingUserRggData,
                                gstNo: e.target.value,
                              })
                            : setgstNo(e.target.value))
                        }
                        disabled={viewMode}
                      />
                      {gstNoError && <p className="errorLabel">{gstNoError}</p>}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Email</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserRggData?.email || email}
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserRggData
                            ? seteditingUserRggData({
                                ...editingUserRggData,
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
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserRggData?.city || city}
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserRggData
                            ? seteditingUserRggData({
                                ...editingUserRggData,
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
                      <select
                        className="form-control select-form"
                        value={editingUserRggData?.stateId || stateId}
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserRggData
                            ? setValueData(e, editingUserRggData)
                            : handlesStateNameChange(e))
                        }
                        disabled={viewMode}
                      >
                        <option value={0}>Select State Name</option>
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
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserRggData?.stateCode || stateCode}
                        readOnly
                      />
                      {stateCodeError && (
                        <p className="errorLabel">{stateCodeError}</p>
                      )}
                    </div>
                  </div>
                  {editingUserRggData ? (
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

                  {editingUserRggData ? (
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
                          inputId="teaBoardUserUpload"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingUserRggData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserRggData
                              ? seteditingUserRggData({
                                  ...editingUserRggData,
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

                  {!viewMode ? (
                    <div className="col-md-12">
                      <div className="BtnGroup">
                        <button
                          className="SubmitBtn"
                          disabled={viewMode}
                          onClick={handleSubmit}
                        >
                          {editingUserRggData ? "Update" : "Submit"}
                        </button>
                        <button
                          className="Clear"
                          disabled={viewMode}
                          onClick={handleClear}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
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
          <Typography>Manage Teaboard Registration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tea Board User Name</label>
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
                      <label>Tea Board User Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search User Code"
                        value={searchUserCode}
                        onChange={(e) => setsearchUserCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tea Board Email Id</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search Email Id"
                        value={SearchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Tea Board Registration certificate</label>
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
                      <label>Tea Board GST Number</label>
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
                      <label>Tea Board PAN Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search PAN Number"
                        value={SearchPanNumber}
                        onChange={(e) => setSearchPanNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>User Profile Status</label>
                      <select
                        className="form-control select-form"
                        placeholder="Select User Status"
                        value={userProfileStatus}
                        onChange={(e) => setuserProfileStatus(e.target.value)}
                      >
                        <option value={""}>Select User Profile Status</option>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
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
                      documentUploadTime: new Date(
                        row.documentUploadTime
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      }),
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
    </>
  );
}

export default UserRegistration;
