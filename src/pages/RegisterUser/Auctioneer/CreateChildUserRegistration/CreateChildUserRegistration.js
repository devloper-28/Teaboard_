import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Card, Modal } from "react-bootstrap";
import $ from "jquery";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import Base64ToExcelDownload from "../../../Base64ToExcelDownload";
import Base64ToPDFPreview from "../../../uploadDocument/Base64ToPDFPreview";
import {
  fetchUser,
  getAllAuctionCenterAction,
  getAllStateAscAction,
  createUserAction,
  getUserByIdAction,
  getUserByIdActionSuccess,
  getChildUser,
  uploadAllDocumentsUserAction,
  getDocumentByIdAction,
  updateUserAction,
  getHistoryByIdAction,
  createEditApiUser,
  getDocumentByIdActionSuccess,
  getExportDataForView,
  getExportDataForViewApiCall,
  getChildAucByIdAction,
  updateChildAucAction,
  createChildAucAction,
} from "../../../../store/actions";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import {
  Accordion,
  FormControl,
  AccordionDetails,
  Checkbox,
  AccordionSummary,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { uploadedFileDownload } from "../../../uploadDocument/UploadedFileDownload";
import UploadMultipleDocuments from "../../../uploadDocument/UploadMultipleDocuments";
import CustomToast from "../../../../components/Toast";
import { NO_OF_RECORDS } from "../../../../constants/commonConstants";
import { Tooltip } from "@mui/material";
import Modals from "../../../../components/common/Modal";

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
function CreateChildUserBuyerRegistration({
  open,
  setOpen,
  editData,
  showchildmodal1,
  modalRight,
  childUser,
}) {
  const [showchildmodal, setShowChildmodal] = useState(true);
  const handleCloseChild = () => setShowChildmodal(false);
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [oldUserId, setoldUserId] = useState(null);
  const [isEditFlag, setisEditFlag] = useState(false);
  const [documentMode, setDocumentmode] = useState("");
  const [viewChildModal, setViewChildModal] = useState(false);
  const [editChildModal, setEditChildModal] = useState(false);
  const [exportViewType, setexportViewType] = useState("");
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");

  useEffect(() => {
    setoldUserId(editData?.userId);
  }, [editData?.userId]);

  const dispatch = useDispatch();
  const getUserData = useSelector(
    (state) => state.createRegistrtion.getChildUser.responseData
  );

  const getAllStateDataResponse = useSelector(
    (state) => state?.state?.getAllStateAsc?.responseData
  );

  const getAllStateData =
    getAllStateDataResponse &&
    getAllStateDataResponse.filter((data) => 1 == data.isActive);

  const getAllAuctionCenter = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenter?.responseData
  );
  const editingChildUserDataFromAc = useSelector(
    (state) => state?.createRegistrtion?.ChildBuyerData?.responseData
  );
  const editingUserDataFromAc = useSelector(
    (state) => state.createRegistrtion.UserData.responseData
  );
  const handleRadioChange = (event) => {
    setEditingUserData({
      ...editingUserData,
      isActive: event.target.value,
    });
  };
  useEffect(() => {
    if (
      (editingChildUserDataFromAc && isEditFlag) ||
      (editingChildUserDataFromAc && viewMode)
    ) {
      setEditingUserData(editingChildUserDataFromAc);
      setauctionCenterId(
        editingChildUserDataFromAc?.auctioneerGstDtoList[0]?.auctionCenterId
      );
    }
  }, [editingChildUserDataFromAc]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel1" == panel && isExpanded) {
      dispatch(getUserByIdAction(oldUserId));
    } else if ("panel2" == panel && isExpanded) {
      setViewMode(false);
      setisEditFlag(false);
      if (oldUserId != null) {
        dispatch(getChildUser(oldUserId));
      }
      setEditingUserData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      let data = {
        ischilddoc: 1,
        role: oldUserId,
      };
      dispatch(uploadAllDocumentsUserAction(data));
      setViewMode(false);
      // dispatch(getUserByIdActionSuccess([]));
      setEditingUserData(null);
    }
  };

  let createData = useSelector(
    (state) => state.createRegistrtion.createEditApiUser
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiUser(false));
      handleCloseEditChildModal();
      setExpanded("panel2");
      handleClear();
      dispatch(getUserByIdActionSuccess([]));
      setEditingUserData(null);
      if (oldUserId != null) {
        dispatch(getChildUser(oldUserId));
      }
    }
  });

  const [editingUserData, setEditingUserData] = useState(null);
  const [auctionCenterId, setauctionCenterId] = useState();
  const [expanded, setExpanded] = React.useState("panel1");
  const [auctioneerCode, setBuyecode] = useState("");
  const [contactPerson, setcontactPerson] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [email, setemail] = useState("");
  const [onChangesAuctionCenterId, setOnChangeAuctionCenterId] = useState([]);
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
      dispatch(
        getAllStateAscAction({
          sortBy: "asc",
          sortColumn: "stateName",
        })
      );
    }
    if (getAllAuctionCenter === undefined) {
      dispatch(getAllAuctionCenterAction());
    }
  });
  const [rows, setRows] = useState(getAllUser);
  // useEffect(() => {
  //   if (getUserData != null && getUserData != undefined) {
  //     setgetAllUser(getUserData);
  //     setRows(getUserData);
  //   } else {
  //     setgetAllUser([]);
  //     setRows([]);
  //   }
  // }, [getUserData]);

  const handleViewMore = () => {
    pageNo = pageNo + 1;
    if (editData !== undefined && oldUserId !== null) {
      dispatch(
        getChildUser(oldUserId, {
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
    }
  };
  // useEffect(() => {
  //   const newRows = getUserData || [];
  //   setRows((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
  // }, [getUserData]);

  useEffect(() => {
    const newRows = getUserData || [];
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
  }, [getUserData]);

  const handleViewClick = (userId) => {
    dispatch(getUserByIdAction(userId));
    setViewMode(true);
    setisEditFlag(false);
    // setExpanded("panel1");
    setViewChildModal(true);
  };

  useEffect(() => {
    if (viewMode) {
      setEditingUserData(editingUserDataFromAc);
    }
  }, [editingUserDataFromAc]);

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.createRegistrtion &&
      state.createRegistrtion.uploadedDocuments &&
      state.createRegistrtion.uploadedDocuments.responseData
  );

  const handleChildEditClick = (userId) => {
    setViewMode(false);
    dispatch(getChildAucByIdAction(userId));
    // setExpanded("panel1");
    setisEditFlag(true);
    setEditChildModal(true);
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
    setauctionCenterId("");
    setauctionCenterIdError("");
    setemail("");
    setemailError("");
    setphoneNo("");
    setphoneNoError("");
    setassociateBuyer("");
    setassociateBuyerError("");
    setUploadDocumentError("");
    setUploadedDocuments([]);
    setuploadDocumentRemarks("");
    setUploadedFiles([]);
    setRemarksError("");
    setBuyecodeError("");
    setEditingUserData(null);
    const inputElement = document.getElementById("auctioneerChildUpload");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  console.log(
    childUser
      .filter((user) => user.linkId === 21)
      ?.map((ele) => ele.rightIds)
      ?.at(0)
      ?.includes("1"),
    "childUserchildUser"
  );

  const handleChildUserSubmit = (event) => {
    event.preventDefault();
    let isValid = true;

    let bc =
      editingUserData == null
        ? auctioneerCode
        : editingUserData.userCode
        ? editingUserData.userCode
        : auctioneerCode;
    let ac = auctionCenterId;
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

    if (!role && editingUserData == null) {
      CustomToast.error("Please select the Role");
      isValid = false;
      return;
    }
    if (!ac && editingUserData == null) {
      CustomToast.error("Please enter the Auction Center");
      isValid = false;
      return;
    }
    if (!bc) {
      CustomToast.error("Please enter the Auctioneer Code.");
      isValid = false;
      return;
    }

    if (!cp.trim()) {
      CustomToast.error("Please enter the contact person");
      isValid = false;
      return;
    }
    if (!mail.trim()) {
      CustomToast.error("Please enter the email ID.");
      isValid = false;
      return;
    }
    if (!phone.trim()) {
      CustomToast.error("Please enter the phone number");
      isValid = false;
      return;
    }
    // if(uploadedFiles != []){
    //     if(!uploadDocumentRemarks.trim() && editingUserData == null){
    //       CustomToast.error("Please enter Remarks");
    //       isValid = false;
    //     }
    // }
    if (!isValid) {
      return;
    }

    if (editingUserData) {
      // editingUserData.isParentId = editData.userId;
      // editingUserData.roleCode = editData.roleCode;
      // dispatch(updateUserAction(editingUserData));
      let filtered = editingUserDataFromAc.auctioneerGstDtoList.filter(
        (item) => item.auctionCenterId == auctionCenterId
      );
      editingUserData.auctioneerGstDtoList = filtered;
      dispatch(updateChildAucAction(editingUserData));
    } else {
      // editData.roleCode = associateBuyer;
      // editData.isParentId = oldUserId;
      // editData.auctioneerCode = auctioneerCode;
      // editData.contactPerson = contactPerson;
      // editData.phoneNo = phoneNo;
      // editData.email = email;
      // editData.roleId = "";
      // editData.userId = "";
      // editData.downloadDto = uploadedFiles;
      // editData.uploadDocumentRemarks = uploadDocumentRemarks;
      let createDataPayload = {
        roleCode: associateBuyer,
        isParentId: oldUserId,
        auctioneerCode: auctioneerCode,
        contactPerson: contactPerson,
        phoneNo: phoneNo,
        email: email,
        roleId: "",
        userId: "",
        downloadDto: uploadedDocuments,
        uploadDocumentRemarks: uploadDocumentRemarks,
        auctioneerGstDtoList: [{ auctionCenterId: parseInt(auctionCenterId) }],
      };
      dispatch(createChildAucAction(createDataPayload));
    }
    dispatch(getUserByIdAction(oldUserId));
  };

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "buyerCode",
      title: "Associate Auctioneer/Post Auction Associate Auctioneer Code",
    },
    {
      name: "contactPerson",
      title: "Contact Name",
    },
    {
      name: "buyerName",
      title: "Auctioneer Name",
    },
    {
      name: "teaBoardRegistrationNo",
      title: "Tea Board Registration Certificate Number",
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
              <th scope="col">Phone Number</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Email ID</th>
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
              <th scope="col">GST Number</th>
              <th scope="col">PAN Number</th>
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
          {childUser
            .filter((user) => user.linkId === 21)
            ?.map((ele) => ele.rightIds)
            ?.at(0)
            ?.includes("2") && (
            <Tooltip title="Edit" placement="top">
              {" "}
              <i
                className="fa fa-edit"
                onClick={() => handleChildEditClick(data.data.userId)}
              ></i>
            </Tooltip>
          )}
          {childUser
            .filter((user) => user.linkId === 21)
            ?.map((ele) => ele.rightIds)
            ?.at(0)
            ?.includes("3") && (
            <Tooltip title="View" placement="top">
              <i
                className="fa fa-eye"
                onClick={() => handleViewClick(data.data.userId)}
              ></i>
            </Tooltip>
          )}
          {childUser
            .filter((user) => user.linkId === 21)
            ?.map((ele) => ele.rightIds)
            ?.at(0)
            ?.includes("4") && (
            <Tooltip title="Hoistory" placement="top">
              <i
                className="fa fa-history"
                onClick={() => {
                  handleHistoryViewClick(data.data.userId);
                }}
              ></i>
            </Tooltip>
          )}
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
  const handleDownloadClick = (uploadDocumentConfId, type) => {
    setDocumentmode(type);
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };

  const getUploadedIdData = useSelector(
    (state) => state.documentReducer.documentData.responseData
  );
  const handleAuctionCenterChange = (e) => {
    if (!viewMode) {
      const selectedAuctionCenterId = e.target.value;
      setauctionCenterId(selectedAuctionCenterId);
    }
  };
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
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
        {childUser
          .filter((user) => user.linkId === 21)
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
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingUserDataFromAc && editingUserDataFromAc.userId;
    let searchData = {
      url: `/admin/auctioneer/get/${id}/${exportType}`,
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
        Base64ToExcelDownload(
          getExportViewDataResponse,
          "AuctioneerDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "AuctioneerDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });
  const handleCloseViewChildModal = () => {
    setViewChildModal(false);
    setViewMode(false);
    setisEditFlag(false);
    if (editData != undefined && oldUserId != null) {
      dispatch(getChildUser(oldUserId));
    }
    setEditingUserData(null);
    resetForm();
  };

  const handleCloseEditChildModal = () => {
    setEditChildModal(false);
    setViewMode(false);
    setisEditFlag(false);
    if (editData != undefined && oldUserId != null) {
      dispatch(getChildUser(oldUserId));
    }
    setEditingUserData(null);
    resetForm();
  };

  return (
    <>
      {/* Create */}
      {childUser
        .filter((user) => user.linkId === 21)
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
            <Typography>
              Create Associate Auctioneer/Post Auction Associate Auctioneer
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
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={auctionCenterId}
                          onChange={handleAuctionCenterChange}
                        >
                          <option value={0}>Select auctionCenter</option>
                          {editingUserDataFromAc?.auctioneerGstDtoList?.map(
                            (auctionCenter) => (
                              <option
                                key={auctionCenter.auctionCenterId}
                                value={auctionCenter.auctionCenterId}
                              >
                                {auctionCenter.auctioncenterName}
                              </option>
                            )
                          )}
                        </select>

                        {auctionCenterIdError && (
                          <p className="errorLabel">{auctionCenterIdError}</p>
                        )}
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
                        <label>GST Number</label>
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
                        <label>Mobile NUmber</label>
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
                        <label>PAN Number</label>
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
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="10"
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
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="100"
                          value={
                            editingUserData?.contactPerson || contactPerson
                          }
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
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          className="form-control"
                          maxLength="15"
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
                        <label>Email ID</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
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
                        {emailError && (
                          <p className="errorLabel">{emailError}</p>
                        )}
                      </div>
                    </div>
                    {editingUserData ? (
                      <div className="col-md-auto d-flex CheckboxGroup">
                        <div className="FormGroup">
                          <label>Status</label>
                          <label className="errorLabel"> * </label>
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
                                    editingUserData.isActive == data.value
                                      ? true
                                      : false
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
                            inputId="auctioneerChildUpload"
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

                    <div className="col-md-12">
                      <div className="BtnGroup">
                        <button
                          className="SubmitBtn"
                          onClick={handleChildUserSubmit}
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
      {editChildModal ? (
        <Modals
          title={"Edit Associate Auctioneer/Post Auction Associate Auctioneer"}
          show={editChildModal}
          handleClose={handleCloseEditChildModal}
          size="xl"
          centered
        >
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
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={auctionCenterId}
                      onChange={handleAuctionCenterChange}
                    >
                      <option value={0}>Select auctionCenter</option>
                      {editingUserDataFromAc?.auctioneerGstDtoList?.map(
                        (auctionCenter) => (
                          <option
                            key={auctionCenter.auctionCenterId}
                            value={auctionCenter.auctionCenterId}
                          >
                            {auctionCenter.auctioncenterName}
                          </option>
                        )
                      )}
                    </select>

                    {auctionCenterIdError && (
                      <p className="errorLabel">{auctionCenterIdError}</p>
                    )}
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
                    <label>GST Number</label>
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
                    <label>Mobile NUmber</label>
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
                    <label>PAN Number</label>
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={editingUserData?.userCode || auctioneerCode}
                      onChange={(e) =>
                        !viewMode && editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              userCode: e.target.value,
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
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
                    <label>Email ID</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
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
                {editingUserData ? (
                  <div className="col-md-auto d-flex CheckboxGroup">
                    <div className="FormGroup">
                      <label>Status</label>
                      <label className="errorLabel"> * </label>
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
                                editingUserData.isActive == data.value
                                  ? true
                                  : false
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
                        inputId="auctioneerChildUpload"
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

                <div className="col-md-12">
                  <div className="BtnGroup">
                    <button
                      className="SubmitBtn"
                      onClick={handleChildUserSubmit}
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
      {viewChildModal ? (
        <Modals
          title={"View Associate Auctioneer/Post Auction Associate Auctioneer"}
          show={viewChildModal}
          handleClose={handleCloseViewChildModal}
          size="xl"
          centered
        >
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
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={auctionCenterId}
                      disabled={viewMode}
                    >
                      <option value={0}>Select auctionCenter</option>
                      {editingUserDataFromAc?.auctioneerGstDtoList?.map(
                        (auctionCenter) => (
                          <option
                            key={auctionCenter.auctionCenterId}
                            value={auctionCenter.auctionCenterId}
                          >
                            {auctionCenter.auctioncenterName}
                          </option>
                        )
                      )}
                    </select>

                    {auctionCenterIdError && (
                      <p className="errorLabel">{auctionCenterIdError}</p>
                    )}
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
                    <label>GST Number</label>
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
                    <label>Mobile NUmber</label>
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
                    <label>PAN Number</label>
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={editingUserData?.userCode || auctioneerCode}
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingUserData?.contactPerson || contactPerson}
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
                      value={editingUserData?.phoneNo || phoneNo}
                      disabled={viewMode}
                    />
                    {phoneNoError && (
                      <p className="errorLabel">{phoneNoError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Email ID</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingUserData?.email || email}
                      disabled={viewMode}
                    />
                    {emailError && <p className="errorLabel">{emailError}</p>}
                  </div>
                </div>
                {editingUserData ? (
                  <div className="col-md-auto d-flex CheckboxGroup">
                    <div className="FormGroup">
                      <label>Status</label>
                      <label className="errorLabel"> * </label>
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
                                editingUserData.isActive == data.value
                                  ? true
                                  : false
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
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-md-12">
              <div className="BtnGroup">
                <button
                  class="SubmitBtn"
                  onClick={() => handleViewExport("excel")}
                >
                  <i class="fa fa-file-excel"></i>
                </button>

                <button
                  class="SubmitBtn"
                  onClick={() => handleViewExport("pdf")}
                >
                  <i class="fa fa-file-pdf"></i>
                </button>
              </div>
            </div>
          </div>
        </Modals>
      ) : (
        ""
      )}

      {/* Manage & Search */}
      {childUser
        .filter((user) => user.linkId === 21)
        ?.map((ele) => ele.rightIds)
        ?.at(0)
        ?.includes("12") && (
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
            <Typography>
              Manage Associate Auctioneer/Post Auction Associate Auctioneer
            </Typography>
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
                      //setRows={setRows}
                      sorting={true}
                      dragdrop={false}
                      fixedColumnsOn={false}
                      resizeingCol={false}
                    />
                  </div>
                  <button class="SubmitBtn" onClick={handleViewMore}>
                    View More
                  </button>
                </div>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Upload Document*/}
      {childUser
        .filter((user) => user.linkId === 21)
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
                    title:
                      "Associate Auctioneer/Post Associate Auctioneer Name",
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

export default CreateChildUserBuyerRegistration;
