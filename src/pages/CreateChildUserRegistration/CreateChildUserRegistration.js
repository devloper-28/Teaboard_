import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Card, Modal } from "react-bootstrap";
import $ from "jquery";
import TableComponent from "../../components/tableComponent/TableComponent";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import {
  fetchUser,
  getAllAuctionCenterAction,
  getAllStateAction,
  createUserAction,
  getUserByIdAction,
  getUserByIdActionSuccess,
  getChildUser,
  uploadAllDocumentsUserAction,
  getDocumentByIdAction,
  updateUserAction,
  getHistoryByIdAction,
  createEditApiUser,
} from "../../store/actions";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomToast from "../../components/Toast";

function CreateChildUserBuyerRegistration({
  open,
  setOpen,
  editData,
  showchildmodal1,
}) {
  const [showchildmodal, setShowChildmodal] = useState(true);
  const handleCloseChild = () => setShowChildmodal(false);
  const [selectedValue, setSelectedValue] = useState("Option 1");
  const [oldUserId, setoldUserId] = useState(null);
  const [isEditFlag, setisEditFlag] = useState(false);
  useEffect(() => {
    if (
      (oldUserId == null || oldUserId == undefined) &&
      (editData != null || editData != undefined)
    ) {
      setoldUserId(editData.userId);
    }
  });

  const dispatch = useDispatch();
  const getUserData = useSelector(
    (state) => state.createRegistrtion.getChildUser.responseData
  );
  const getAllStateData = useSelector(
    (state) => state.state.getAllState.responseData
  );
  const getAllAuctionCenter = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenter?.responseData
  );

  const editingUserDataFromAc = useSelector(
    (state) => state.createRegistrtion.UserData.responseData
  );

  useEffect(() => {
    if (editingUserDataFromAc && isEditFlag) {
      setEditingUserData(editingUserDataFromAc);
    }
  }, [editingUserDataFromAc]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      setViewMode(false);
      setisEditFlag(false);
      if (editData != undefined && oldUserId != null) {
        dispatch(getChildUser(oldUserId));
      }
      setEditingUserData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      dispatch(uploadAllDocumentsUserAction(oldUserId));
      setViewMode(false);
      dispatch(getUserByIdActionSuccess([]));
      setEditingUserData(null);
    }
  };

  let createData = useSelector(
    (state) => state.createRegistrtion.createEditApiUser
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiUser(false));
      setExpanded("panel2");
      handleClear();
      dispatch(getUserByIdActionSuccess([]));
      setEditingUserData(null);
    }
  });

  const [editingUserData, setEditingUserData] = useState(null);
  const [expanded, setExpanded] = React.useState("panel1");
  const [auctioneerCode, setBuyecode] = useState("");
  const [contactPerson, setcontactPerson] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [email, setemail] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [associateBuyer, setassociateBuyer] = useState("");
  const [BuyecodeError, setBuyecodeError] = useState("");
  const [contactPersonError, setcontactPersonError] = useState("");
  const [emailError, setemailError] = useState("");
  const [phoneNoError, setphoneNoError] = useState("");
  const [associateBuyerError, setassociateBuyerError] = useState("");
  const [getAllUser, setgetAllUser] = useState("");
  const [uploadDocumentRemarks, setuploadDocumentRemarks] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const handleCloseHistory = () => setShowmodal(false);
  const [showmodal, setShowmodal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (getAllStateData === undefined) {
      dispatch(getAllStateAction());
    }
    if (getAllAuctionCenter === undefined) {
      dispatch(getAllAuctionCenterAction());
    }
  });
  const [rows, setRows] = useState(getAllUser);
  useEffect(() => {
    if (getUserData != null && getUserData != undefined) {
      setgetAllUser(getUserData);
      setRows(getUserData);
    } else {
      setgetAllUser([]);
      setRows([]);
    }
  }, [getUserData]);

  const handleViewClick = (userId) => {
    dispatch(getUserByIdAction(userId));
    setEditingUserData(editingUserDataFromAc);
    setViewMode(true);
    setisEditFlag(false);
    setExpanded("panel1");
  };

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.createRegistrtion &&
      state.createRegistrtion.uploadedDocuments &&
      state.createRegistrtion.uploadedDocuments.responseData
  );
  useEffect(() => {
    dispatch(uploadAllDocumentsUserAction("ASSOCIATEAUCTIONEER"));
  }, [dispatch]);

  const handleChildEditClick = (userId) => {
    setViewMode(false);
    dispatch(getUserByIdAction(userId));
    setExpanded("panel1");
    setisEditFlag(true);
  };
  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );
  const handleClear = () => {
    resetForm();
  };

  const resetForm = () => {
    setBuyecode("");
    setcontactPerson("");
    setcontactPersonError("");
    setemailError("");
    setemailError("");
    setphoneNo("");
    setphoneNoError("");
    setassociateBuyer("");
    setassociateBuyerError("");
    setUploadDocumentError("");
    setRemarksError("");
    setBuyecodeError("");
    setEditingUserData(null);
  };

  const handleChildUserSubmit = (event) => {
    event.preventDefault();
    let isValid = true;

    let bc =
      editingUserData == null
        ? auctioneerCode
        : editingUserData.auctioneerCode
        ? editingUserData.auctioneerCode
        : auctioneerCode;
    let cp =
      editingUserData == null
        ? contactPerson
        : editingUserData.contactPerson
        ? editingUserData.contactPerson
        : contactPerson;
    let mail =
      editingUserData == null
        ? email
        : editingUserData.email
        ? editingUserData.email
        : email;
    let phone =
      editingUserData == null
        ? phoneNo
        : editingUserData.phoneNo
        ? editingUserData.phoneNo
        : phoneNo;
    let role =
      editingUserData == null
        ? associateBuyer
        : editingUserData.roleCode
        ? editingUserData.roleCode
        : associateBuyer;

    if (!role) {
      CustomToast.error("Please select Role");
      isValid = false;
      return;
    }
    if (!bc) {
      CustomToast.error(
        "Associate Buyer code / Post Auction Associate Buyer code"
      );
      isValid = false;
      return;
    }
    if (!cp.trim()) {
      CustomToast.error("Please enter contact person");
      isValid = false;
      return;
    }
    if (!mail.trim()) {
      CustomToast.error("Please enter email");
      isValid = false;
      return;
    }
    if (!phone.trim()) {
      CustomToast.error("Please enter phone number");
      isValid = false;
      return;
    }

    if (!isValid) {
      return;
    }

    if (editingUserData) {
      editingUserData.isParentId = editData.userId;
      editingUserData.roleCode = associateBuyer;
      dispatch(updateUserAction(editingUserData));
    } else {
      editData.roleCode = associateBuyer;
      editData.isParentId = editData.userId;
      editData.auctioneerCode = auctioneerCode;
      editData.contactPerson = contactPerson;
      editData.phoneNo = phoneNo;
      editData.email = email;
      editData.roleId = "";
      editData.userId = "";
      dispatch(createUserAction(editData));
      dispatch(fetchUser());
    }
  };

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "buyerName",
      title: "Company Name",
    },
    {
      name: "teaBoardRegistrationNo",
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
  function ActionData(data) {
    return (
      <>
        <div class="Action">
          <i
            className="fa fa-edit"
            onClick={() => handleChildEditClick(data.data.userId)}
          ></i>
          <i
            className="fa fa-pencil"
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
  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
  };
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_UserLogin";
    const moduleName = "Auctioneer";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };
  const handleDownloadClick = (uploadDocumentConfId) => {
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };

  const getUploadedIdData = useSelector(
    (state) => state.documentReducer.documentData.responseData
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
  return (
    <>
      {/* <Modals
        title={"Create Child User"}
        handleClose={handleClose}
        show={
          open === "CreateChildUserRegistration" || open === "editingUserData"
        }
        size="xl"
      > */}
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
              ? "View Child User"
              : editingUserDataFromAc
              ? "Edit Child User"
              : "Create Child User"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label htmlFor="selectBox">Select an option:</label>
                      <select
                        className="form-control select-form"
                        id="selectBox"
                        value={editingUserData?.roleCode || associateBuyer}
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserData
                            ? setEditingUserData({
                                ...editingUserData,
                                roleCode: e.target.value,
                              })
                            : setassociateBuyer(e.target.value))
                        }
                        disabled={viewMode}
                      >
                        <option value="">Select USER</option>
                        <option value="ASSOCIATEAUCTIONEER">
                          ASSOCIATE USER
                        </option>
                        <option value="POSTAUCTIONASSOCIATEAUCTIONEER">
                          POST AUCTION ASSOCIATE USER
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center</label>
                      <select
                        className="form-control select-form"
                        value={
                          editData?.auctioneerGstDtoList[0].auctionCenterId
                        }
                        disabled="true"
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
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.city}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.address}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Contact Person</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.contactPerson}
                        disabled="true"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Email ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.email}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>EntityCode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.entityCode}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Fax</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.fax}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>GSTNo</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.auctioneerGstDtoList[0].gstNo}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Mobile No.</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.mobileNo}
                        disabled="true"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>PANno</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.panNo}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.phoneNo}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>State Name</label>
                      <select
                        className="form-control select-form"
                        value={editData?.tblState}
                        disabled="true"
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
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>StateCode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.stateCode}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>TaxId No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.taxIdentityNo}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Teaboard Reg No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.teaBoardRegistrationNo}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auctioneer Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.auctioneerName}
                        disabled="true"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auctioneer Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.auctioneerCode}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>CINno</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.cinNo}
                        disabled="true"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>FSSAI No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.fssaiNo}
                        disabled={true}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auctioneer Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          editingUserData?.auctioneerCode || auctioneerCode
                        }
                        onChange={(e) =>
                          !viewMode && editingUserData
                            ? setEditingUserData({
                                ...editingUserData,
                                auctioneerCode: e.target.value,
                              })
                            : setBuyecode(e.target.value)
                        }
                        disabled={viewMode}
                      />
                      {BuyecodeError && (
                        <p className="errorLabel">{BuyecodeError}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Contact Person</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserData?.contactPerson || contactPerson}
                        onChange={(e) =>
                          !viewMode &&
                          (editingUserData
                            ? setEditingUserData({
                                ...editingUserData,
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
                      <label>Phone No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserData?.phoneNo || phoneNo}
                        onChange={(e) =>
                          !viewMode && editingUserData
                            ? setEditingUserData({
                                ...editingUserData,
                                phoneNo: e.target.value,
                              })
                            : setphoneNo(e.target.value)
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
                      <input
                        type="text"
                        className="form-control"
                        value={editingUserData?.email || email}
                        onChange={(e) =>
                          !viewMode && editingUserData
                            ? setEditingUserData({
                                ...editingUserData,
                                email: e.target.value,
                              })
                            : setemail(e.target.value)
                        }
                        disabled={viewMode}
                      />
                      {emailError && <p className="errorLabel">{emailError}</p>}
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
                          inputId="taoUser"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={
                            editingUserData?.uploadDocumentRemarks ||
                            uploadDocumentRemarks
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
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
                          onClick={handleChildUserSubmit}
                        >
                          {editingUserData ? "Update" : "Submit"}
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
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          {"Manage Child User"}
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-12">
                    <div className="BtnGroup"></div>
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
                      getUserData == null
                        ? []
                        : getUserData?.map((row, index) => ({
                            ...row,
                            index: index + 1,
                          }))
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
      {/* </Modals> */}

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
                getHistoryIdData?.length > 0 &&
                getHistoryIdData != null &&
                getHistoryIdData != undefined
                  ? getHistoryIdData.map((row, index) => ({
                      ...row,
                      index: index + 1,
                      updatedOn: new Date(row.updatedOn).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        }
                      ),
                    }))
                  : []
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

export default CreateChildUserBuyerRegistration;
