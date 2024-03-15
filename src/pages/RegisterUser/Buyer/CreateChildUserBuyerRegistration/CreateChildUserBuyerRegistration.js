import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Card, Modal } from "react-bootstrap";
import Base64ToExcelDownload from "../../../Base64ToExcelDownload";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import {
  getChildBuyer,
  getAllAuctionCenterAscAction,
  getAllStateAscAction,
  createChildBuyerAction,
  getBuyerByIdAction,
  updateChildBuyerAction,
  getHistoryByIdAction,
  uploadAllDocumentsBuyerAction,
  getDocumentByIdAction,
  getChildBuyerByIdAction,
  childcreateEditApiStatusBuyer,
  getDocumentByIdActionSuccess,
  getExportDataForView,
  getExportDataForViewApiCall,
  closemodel,
} from "../../../../store/actions";
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
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import { uploadedFileDownload } from "../../../uploadDocument/UploadedFileDownload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomToast from "../../../../components/Toast";
import UploadMultipleDocuments from "../../../uploadDocument/UploadMultipleDocuments";
import { NO_OF_RECORDS } from "../../../../constants/commonConstants";
import Modals from "../../../../components/common/Modal";
import { Tooltip } from "@mui/material";

let pageNo = 1;
function CreateChildUserBuyerRegistration({
  isProfile,
  editData,
  showchildmodal1,
  modalRight,
  childUser,
}) {
  const [showchildmodal, setShowChildmodal] = useState(true);
  const handleCloseChild = () => setShowChildmodal(false);
  const [selectedValue, setSelectedValue] = useState("Option 1");
  const [submittedValue, setSubmittedValue] = useState("");
  const [editingUserData, setEditingUserData] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [oldUserId, setoldUserId] = useState(null);
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [showmodal, setShowmodal] = useState(false);
  const [documentMode, setDocumentmode] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const handleCloseHistory = () => setShowmodal(false);
  const [exportViewType, setexportViewType] = useState("");

  const [isEditFlag, setisEditFlag] = useState(false);
  const [uploadDocumentRemarks, setuploadDocumentRemarks] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [viewChildModal, setViewChildModal] = useState(false);
  const [editChildModal, setEditChildModal] = useState(false);

  useEffect(() => {
    if (isProfile!=2 &&
      (oldUserId == null || oldUserId == undefined) &&
      editData.userId != undefined &&
      editData.userId != null
    ) {
      setoldUserId(editData?.userId);
    }
  });

  const dispatch = useDispatch();
  const getUserData = useSelector(
    (state) => state?.createBuyer?.getChildBuyer?.responseData
  );

  const getAllStateDataResponse = useSelector(
    (state) => state?.state?.getAllStateAsc?.responseData
  );

  const getAllStateData =
    getAllStateDataResponse &&
    getAllStateDataResponse.filter((data) => 1 == data.isActive);

  const getAllAuctionCenterResponse = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);
  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.createBuyer &&
      state.createBuyer.uploadedDocuments &&
      state.createBuyer.uploadedDocuments.responseData
  );
  const radioButtonData = [
    {
      key: "Active",
      value: 1,
    },
    {
      key: "In active",
      value: 2,
    },
    {
      key: "Suspend",
      value: 3,
    },
  ];
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    if (editData !== undefined && oldUserId !== null) {
      dispatch(
        getChildBuyer(oldUserId, {
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
    }
  };
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      setViewMode(false);
      setisEditFlag(false);
      if (oldUserId != null) {
        dispatch(getChildBuyer(oldUserId));
      }
      setEditingUserData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      dispatch(uploadAllDocumentsBuyerAction(oldUserId));
      setViewMode(false);
      // dispatch(getBuyerByIdActionSuccess([]));
      setEditingUserData(null);
    }else if("panel1" == panel && isExpanded){
      dispatch(getBuyerByIdAction(oldUserId));
    }
  };
  const handleChildEditClick = (userId) => {
    setViewMode(false);
    dispatch(getChildBuyerByIdAction(userId));
    // setExpanded("panel1");
    setEditChildModal(true);
    setisEditFlag(true);
  };
  const handleViewClick = (userId) => {
    dispatch(getBuyerByIdAction(userId));
    
    setViewMode(true);
    setisEditFlag(false);
    // setExpanded("panel1");
    setViewChildModal(true);
  };
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_UserLogin";
    const moduleName = "Buyer";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
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
  }, [getUploadedIdData]);
  useEffect(() => {
  if(isProfile==2){
    setoldUserId(atob(sessionStorage.getItem("argument2")));
    handleChildEditClick(atob(sessionStorage.getItem("argument2")));
  }
  },[]);
  const handleDownloadClick = (uploadDocumentConfId, type) => {
    setDocumentmode(type);
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };
  function UploadActionData(data) {
    return (
      <div class="Action">
        {childUser
          .filter((user) => user.linkId === 23)
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
      </div>
    );
  }
  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
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
  const removeAllFiles = () => {
    setUploadedFiles([]);
  };
  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
  };
  const getHistoryIdData = useSelector(
    (state) => state?.documentReducer?.historyData?.responseData
  );
  const [expanded, setExpanded] = React.useState("panel1");
  const [auctionCenterId, setauctionCenterId] = useState();
  const [Buyecode, setBuyecode] = useState("");
  const [contactPerson, setcontactPerson] = useState("");
  const [email, setemail] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [associateBuyer, setassociateBuyer] = useState("");
  const [BuyecodeError, setBuyecodeError] = useState("");
  const [contactPersonError, setcontactPersonError] = useState("");
  const [emailError, setemailError] = useState("");
  const [phoneNoError, setphoneNoError] = useState("");
  const [associateBuyerError, setassociateBuyerError] = useState("");
  const [editingUserDataFromAc,seteditingUserDataFromAc]= useState();
  const [getAllUser, setgetAllUser] = useState("");
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
      dispatch(
        getAllAuctionCenterAscAction({
          sortBy: "asc",
          sortColumn: "auctionCenterName",
        })
      );
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

  const editingUserDataFromAcc = useSelector(
    (state) => state?.createBuyer?.BuyerData?.responseData
  );
  const editingChildUserDataFromAc = useSelector(
    (state) => state?.createBuyer?.ChildBuyerData?.responseData
  );
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingUserDataFromAc && editingUserDataFromAc.userId;
    let searchData = {
      url: `/admin/buyer/get/${id}/${exportType}`,
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
        Base64ToExcelDownload(getExportViewDataResponse, "ChildBuyerDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "ChildBuyerDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });


  useEffect(() => {
    if ((editingChildUserDataFromAc && isEditFlag)|| (editingChildUserDataFromAc && viewMode)) {
      setEditingUserData(editingChildUserDataFromAc);
      setauctionCenterId(editingChildUserDataFromAc?.auctioneerGstDtoList[0]?.auctionCenterId);
      setassociateBuyer(editingChildUserDataFromAc?.roleCode);
    }
  }, [editingChildUserDataFromAc]);
  useEffect(() => {
    if(editingUserDataFromAcc!=undefined){
      seteditingUserDataFromAc(editingUserDataFromAcc);
      editData=editingUserDataFromAcc;
    }
    
  },editingUserDataFromAcc)
  const handleChildUserSubmit = (event) => {
    event.preventDefault();
    let isValid = true;

    let bc =
      editingUserData == null
        ? Buyecode
        : editingUserData.userCode
        ? editingUserData.userCode
        : Buyecode;
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

    if (!role) {
      CustomToast.error("Please select the Role");
      isValid = false;
      return;
    }
    if (!ac && editingUserData == null) {
      CustomToast.error("Please enter the Auction Center");
      isValid = false;
      return;
    }
    if (!bc.trim()) {
      CustomToast.error(
        "Please enter the Associate Buyer code / Post Auction Associate Buyer code."
      );
      isValid = false;
      return;
    }
    if (!cp.trim()) {
      CustomToast.error("Please enter the contact person.");
      isValid = false;
      return;
    }
    if (!mail.trim()) {
      CustomToast.error("Please enter the email ID.");
      isValid = false;
      return;
    }
    if (!phone.trim()) {
      CustomToast.error("Please enter a valid phone number.");
      isValid = false;
      return;
    }

    if (!isValid) {
      return;
    }
    if (editingUserData) {
      // if (!editingUserData) {
      //   if (!uploadedDocuments.length && !uploadDocumentRemarks) {
      //   } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
      //     isValid = false;
      //     CustomToast.error("Please enter the remarks");
      //     return;
      //   } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
      //     isValid = false;
      //     CustomToast.error("Please upload the document");
      //     return;
      //   }
      // }
      let filtered = editingUserDataFromAc.auctioneerGstDtoList.filter(item => item.auctionCenterId == auctionCenterId);
      editingUserData.auctioneerGstDtoList = filtered
      dispatch(updateChildBuyerAction(editingUserData));
    } else {
      // editData.roleCode = associateBuyer;
      // editData.isParentId = oldUserId;
      // editData.buyerCode = Buyecode;
      // editData.contactPerson = contactPerson;
      // editData.phoneNo = phoneNo;
      // editData.email = email;
      // editData.roleId = "";
      // editData.userId = "";
      // editData.downloadDto = uploadedDocuments;
      // editData.uploadDocumentRemarks = uploadDocumentRemarks;

      let createDataPayload = {
      roleCode : associateBuyer,
      isParentId : oldUserId,
      buyerCode : Buyecode,
      contactPerson : contactPerson,
      phoneNo : phoneNo,
      email : email,
      roleId : "",
      userId : "",
      downloadDto : uploadedDocuments,
      uploadDocumentRemarks : uploadDocumentRemarks,
      auctioneerGstDtoList : [{auctionCenterId : parseInt(auctionCenterId)}]
      }
      dispatch(createChildBuyerAction(createDataPayload));
    }
    dispatch(getBuyerByIdAction(oldUserId));
  };
  const handleAuctionCenterChange = (e) => {
    if (!viewMode) {
      const selectedAuctionCenterId = e.target.value;
      setauctionCenterId(selectedAuctionCenterId);
    }
  };
  let createDataChild = useSelector(
    (state) => state?.createBuyer?.childcreateEditApiStatus
  );
  useEffect(() => {
    if (true == createDataChild) {
      dispatch(childcreateEditApiStatusBuyer(false));
      resetForm();
      handleCloseEditChildModal();
      setExpanded("panel2");
      setEditingUserData(null);
      if (oldUserId != null) {
        dispatch(getChildBuyer(oldUserId));
      }
    }
  });
  const handleRadioChange = (event) => {
    setEditingUserData({
      ...editingUserData,
      isActive: parseInt(event.target.value),
    });
  };

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
          {childUser
            .filter((user) => user.linkId === 23)
            ?.map((ele) => ele.rightIds)
            ?.at(0)
            ?.includes("2") && (
            <Tooltip title="Edit" placement="top">
              <i
                className="fa fa-edit"
                onClick={() => handleChildEditClick(data.data.userId)}
              ></i>
            </Tooltip>
          )}
          {childUser
            .filter((user) => user.linkId === 23)
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
            .filter((user) => user.linkId === 23)
            ?.map((ele) => ele.rightIds)
            ?.at(0)
            ?.includes("4") && (
            <Tooltip title="History" placement="top">
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
  const resetForm = () => {
    setBuyecode("");
    setauctionCenterId("");
    setBuyecodeError("");
    setcontactPerson("");
    setcontactPersonError("");
    setauctionCenterIdError("");
    setemail("");
    setemailError("");
    setphoneNo("");
    setphoneNoError("");
    setassociateBuyer("");
    setassociateBuyerError("");
    removeAllFiles();
    setuploadDocumentRemarks("");
    const inputElement = document.getElementById("buyerChildUpload");
    if (inputElement) {
      inputElement.value = "";
    }
  };
  const handleClear = () => {
    resetForm();
  };

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "buyerCode",
      title: "Associate Buyer code / Post Auction Associate Buyer code",
    },
    {
      name: "contactPerson",
      title: "Contact Name",
    },
    {
      name: "buyerName",
      title: "Buyer Name",
    },
    {
      name: "teaBoardRegistrationNo",
      title: "Tea Board  Registration Certificate Number",
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

  const handleCloseViewChildModal = () => {
    setViewChildModal(false);
    setViewMode(false);
    setisEditFlag(false);
    if (oldUserId != null) {
      dispatch(getChildBuyer(oldUserId));
    }
    setEditingUserData(null);
    resetForm();
  };
  const closestatusjpgp = useSelector(
    (state) => state.createBuyer.closemodel
  );
  const handleCloseEditChildModal = () => {
  if(isProfile==2){
    dispatch(closemodel(closestatusjpgp + 1));
  }
    setEditChildModal(false);
    setViewMode(false);
    setisEditFlag(false);
    if (oldUserId != null) {
      dispatch(getChildBuyer(oldUserId));
    }
    setEditingUserData(null);
    resetForm();
  };

  return (
    <>
      {/* Create */}
      {childUser
        .filter((user) => user.linkId === 23)
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
              Create Associate Buyer/Post Auction Associate Buyer Registration
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
                          <option value="">Select Buyer</option>
                          <option value="ASSOCIATEBUYER">
                            ASSOCIATE BUYER
                          </option>
                          <option value="POSTAUCTIONASSOCIATEBUYER">
                            POST AUCTION ASSOCIATE BUYER
                          </option>
                        </select>
                        {associateBuyerError && (
                          <p className="errorLabel">{associateBuyerError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData?.buyerName}
                          maxLength="50"
                          disabled="true"
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Code</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData?.buyerCode}
                          disabled="true"
                        />
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
                        <label>Head Office Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData?.headOfficeAddress}
                          disabled="true"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Local Office Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData?.localOfficeAddress}
                          disabled="true"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Contact Person Name</label>
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
                        <label>State Name</label>
                        <select
                          className="form-control select-form"
                          value={editData?.stateId}
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
                        <label>Phone Number</label>
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
                        <label>Year of Registration</label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            editData?.yearOfRegistration != null
                              ? editData.yearOfRegistration.split("-")[0]
                              : editData?.yearOfRegistration
                          }
                          disabled="true"
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>TNGST No.</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData?.tngstNo}
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
                        <label>Tax Identification no</label>
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
                        <label>Tea Board Exporter License No.</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData?.teaBoardExporterLicenseNo}
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
                        <label>GSTNo</label>
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
                        <label>Bank account detail status.</label>
                        <input
                          type="text"
                          className="form-control"
                          value=""
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>
                          Associate Buyer code / Post Auction Associate Buyer
                          code
                        </label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.userCode || Buyecode}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  userCode: e.target.value,
                                })
                              : setBuyecode(e.target.value))
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
                            (editingUserData != null
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
                        <label>Phone Number</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          className="form-control"
                          maxLength="15"
                          value={editingUserData?.phoneNo || phoneNo}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
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
                        <label>Email ID</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
                          value={editingUserData?.email || email}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
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
                    {editingUserData ? (
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
                                  editingUserData?.isActive == data.value
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
                            inputId="buyerChildUpload"
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
          title={
            "Edit Associate Buyer/Post Auction Associate Buyer Registration"
          }
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
                      <option value="">Select Buyer</option>
                      <option value="ASSOCIATEBUYER">ASSOCIATE BUYER</option>
                      <option value="POSTAUCTIONASSOCIATEBUYER">
                        POST AUCTION ASSOCIATE BUYER
                      </option>
                    </select>
                    {associateBuyerError && (
                      <p className="errorLabel">{associateBuyerError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Buyer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.buyerName}
                      maxLength="50"
                      disabled="true"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Buyer Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.buyerCode}
                      disabled="true"
                    />
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
                    <label>Head Office Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.headOfficeAddress}
                      disabled="true"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Local Office Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.localOfficeAddress}
                      disabled="true"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Contact Person Name</label>
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
                    <label>State Name</label>
                    <select
                      className="form-control select-form"
                      value={editData?.stateId}
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
                    <label>Phone Number</label>
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
                    <label>Year of Registration</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        editData?.yearOfRegistration != null
                          ? editData.yearOfRegistration.split("-")[0]
                          : editData?.yearOfRegistration
                      }
                      disabled="true"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>TNGST No.</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.tngstNo}
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
                    <label>Tax Identification no</label>
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
                    <label>Tea Board Exporter License No.</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.teaBoardExporterLicenseNo}
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
                    <label>GSTNo</label>
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
                    <label>Bank account detail status.</label>
                    <input
                      type="text"
                      className="form-control"
                      value=""
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>
                      Associate Buyer code / Post Auction Associate Buyer code
                    </label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingUserData?.userCode || Buyecode}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              userCode: e.target.value,
                            })
                          : setBuyecode(e.target.value))
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
                        (editingUserData != null
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
                    <label>Phone Number</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
                      value={editingUserData?.phoneNo || phoneNo}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
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
                    <label>Email ID</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingUserData?.email || email}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              email: e.target.value,
                            })
                          : setemail(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {emailError && <p className="errorLabel">{emailError}</p>}
                  </div>
                </div>
                {editingUserData ? (
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
                              editingUserData?.isActive == data.value
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
                        inputId="buyerChildUpload"
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
          title={
            "View Associate Buyer/Post Auction Associate Buyer Registration"
          }
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
                      <option value="">Select Buyer</option>
                      <option value="ASSOCIATEBUYER">ASSOCIATE BUYER</option>
                      <option value="POSTAUCTIONASSOCIATEBUYER">
                        POST AUCTION ASSOCIATE BUYER
                      </option>
                    </select>
                    {associateBuyerError && (
                      <p className="errorLabel">{associateBuyerError}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Buyer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.buyerName}
                      maxLength="50"
                      disabled="true"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Buyer Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.buyerCode}
                      disabled="true"
                    />
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
                    <label>Head Office Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.headOfficeAddress}
                      disabled="true"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Local Office Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.localOfficeAddress}
                      disabled="true"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Contact Person Name</label>
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
                    <label>State Name</label>
                    <select
                      className="form-control select-form"
                      value={editData?.stateId}
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
                    <label>Phone Number</label>
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
                    <label>Year of Registration</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        editData?.yearOfRegistration != null
                          ? editData.yearOfRegistration.split("-")[0]
                          : editData?.yearOfRegistration
                      }
                      disabled="true"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>TNGST No.</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.tngstNo}
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
                    <label>Tax Identification no</label>
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
                    <label>Tea Board Exporter License No.</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData?.teaBoardExporterLicenseNo}
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
                    <label>GSTNo</label>
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
                    <label>Bank account detail status.</label>
                    <input
                      type="text"
                      className="form-control"
                      value=""
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>
                      Associate Buyer code / Post Auction Associate Buyer code
                    </label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingUserData?.userCode || Buyecode}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              userCode: e.target.value,
                            })
                          : setBuyecode(e.target.value))
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
                        (editingUserData != null
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
                    <label>Phone Number</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
                      value={editingUserData?.phoneNo || phoneNo}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
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
                    <label>Email ID</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingUserData?.email || email}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              email: e.target.value,
                            })
                          : setemail(e.target.value))
                      }
                      disabled={viewMode}
                    />
                    {emailError && <p className="errorLabel">{emailError}</p>}
                  </div>
                </div>
                {editingUserData ? (
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
                              editingUserData?.isActive == data.value
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
        .filter((user) => user.linkId === 23)
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
            aria-controls="panel1a-content"
            id="pane21a-header"
          >
            <Typography>Manage Associate Buyer/Post Auction Associate Buyer</Typography>
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
                      // setRows={setRows}
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
        .filter((user) => user.linkId === 23)
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
                    title: "Associate Buyer Name/Post Associate Buyer Name",
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
                rows={getAllUploadedDoc?.map((row, index) => ({
                  ...row,
                  index: index + 1,
                }))}
                //rows={rows}
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
        <Modal show={showmodal} onHide={handleCloseHistory} size="xl" centered>
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
    </>
  );
}
export default CreateChildUserBuyerRegistration;
