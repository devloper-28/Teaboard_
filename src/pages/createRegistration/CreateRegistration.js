import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import CreateChildUserRegistration from "../CreateChildUserRegistration/CreateChildUserRegistration";
import CustomToast from "../../components/Toast";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import {
  fetchUser,
  createUserAction,
  updateUserAction,
  getUserByIdAction,
  getUserByIdActionSuccess,
  getAllAuctionCenterAction,
  getAllStateAction,
  searchUserAction,
  uploadAllDocumentsUserAction,
  getDocumentByIdAction,
  createEditApiUser,
  getHistoryByIdAction,
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
import { Card, Form, Modal } from "react-bootstrap";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
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

function CreateUser({ open, setOpen }) {
  const getUserData = useSelector(
    (state) => state.createRegistrtion.getAllUserActionSuccess.responseData
  );

  const [editingUserData, setEditingUserData] = useState(null);
  const [city, setcity] = useState("");
  const [contactPerson, setcontactPerson] = useState("");
  const [email, setemail] = useState("");
  const [gstNo, setgstNo] = useState("");
  const [mobileNo, setmobileNo] = useState("");
  const [panNo, setpanNo] = useState("");
  const [teaBoardRegistrationNo, setteaBoardRegistrationNo] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [fax, setfax] = useState("");
  const [entityCode, setentityCode] = useState("");
  const [auctioneerName, setauctioneerName] = useState("");
  const [auctioneerCode, setauctioneerCode] = useState("");
  const [fssaiNo, setfssaiNo] = useState("");
  const [cinNo, setcinNo] = useState("");
  const [taxIdentityNo, settaxIdentityNo] = useState("");
  const [isActive, setisActive] = useState("");
  const [isParentId, setisParentId] = useState("");
  const [uploadDocumentRemarks, setuploadDocumentRemarks] = useState("");
  const [stateCode, setstateCode] = useState("");
  const [userType, setuserType] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState("");
  const [address, setaddress] = useState("");
  const [tblState, settblState] = useState("");
  const [getAllUser, setgetAllUser] = useState("");
  const [getSearchUser, setgetSearchUser] = useState("");
  const [cityError, setcityError] = useState("");
  const [contactPersonError, setcontactPersonError] = useState("");
  const [emailError, setemailError] = useState("");
  const [gstNoError, setgstNoError] = useState("");
  const [mobileNoError, setmobileNoError] = useState("");
  const [panNoError, setpanNoError] = useState("");
  const [teaBoardRegistrationNoError, setteaBoardRegistrationNoError] =
    useState("");
  const [stateNameError, setstateNameError] = useState("");
  const [phoneNoError, setphoneNoError] = useState("");
  const [faxError, setfaxError] = useState("");
  const [entityCodeError, setentityCodeError] = useState("");
  const [auctioneerNameError, setauctioneerNameError] = useState("");
  const [auctioneerCodeError, setauctioneerCodeError] = useState("");
  const [fssaiNoError, setfssaiNoError] = useState("");
  const [cinNoError, setcinNoError] = useState("");
  const [taxIdentityNoError, settaxIdentityNoError] = useState("");
  const [isParentIdError, setisParentIdError] = useState("");
  const [uploadDocumentRemarksError, setuploadDocumentRemarksError] =
    useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [stateCodeError, setstateCodeError] = useState("");
  const [userTypeError, setuserTypeError] = useState("");
  const [addressError, setaddressError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const dispatch = useDispatch();
  const [dataById, setDataById] = useState("");
  const [handleSwitchClick, setHandleSwitchClick] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [SearchUserName, setSearchUserName] = useState("");
  const [SearchUserCode, setSearchUserCode] = useState("");
  const [SearchEmail, setSearchEmail] = useState("");
  const [SearchRegistrationCertificate, setSearchRegistrationCertificate] =
    useState("");
  const [SearchGstNumber, setSearchGstNumber] = useState("");
  const [SearchPanNumber, setSearchPanNumber] = useState("");
  const [SearchUserProfile, setSearchUserProfile] = useState("");

  const [showchildmodal, setShowChildmodal] = useState(false);
  const handleCloseChild = () => setShowChildmodal(false);
  const [selectedValue, setSelectedValue] = useState("Option 1");
  const [submittedValue, setSubmittedValue] = useState("");
  const [userProfileStatus, setuserProfileStatus] = useState("");

  const [auctioneerGstDtoList, setauctioneerGstDtoList] = useState([]);
  var isDisplay = false;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setcityError("");
    setentityCodeError("");
    setfaxError("");
    setgstNoError("");
    setmobileNoError("");
    setpanNoError("");
    setphoneNoError("");
    setstateCodeError("");
    setstateNameError("");
    setauctionCenterIdError("");
    setaddressError("");
    setUploadDocumentError("");
    setRemarksError("");
    settaxIdentityNoError("");
    setteaBoardRegistrationNoError("");
    setauctioneerNameError("");
    setauctioneerCodeError("");
    setcinNoError("");
    setfssaiNoError("");

    let isValid = true;

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

    if (!contactPerson.trim()) {
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
    // if (!gstNo) {
    //   setgstNoError("Please enter the GSTNo");
    //   isValid = false;
    // }
    if (!mobileNo) {
      CustomToast.error("Please enter the mobile number");
      isValid = false;
      return;
    }
    if (!panNo.trim()) {
      CustomToast.error("Please enter the PANno");
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
    if (!tblState) {
      CustomToast.error("Please select a state from the dropdown list");
      isValid = false;
      return;
    }
    if (!taxIdentityNo) {
      CustomToast.error("Please enter a unique TaxId No");
      isValid = false;
      return;
    }
    if (!teaBoardRegistrationNo) {
      CustomToast.error("Please enter the Teaboard Reg No");
      isValid = false;
      return;
    }
    if (!auctioneerName.trim) {
      CustomToast.error("Please enter the Auctioneer Name");
      isValid = false;
      return;
    }
    if (!auctioneerCode) {
      CustomToast.error("Please enter the Auctioneer Code");
      isValid = false;
      return;
    }
    if (!cinNo) {
      CustomToast.error("Please enter a unique CIN no");
      isValid = false;
      return;
    }
    if (!fssaiNo) {
      CustomToast.error("Please enter a unique FSSAI No");
      isValid = false;
      return;
    }

    if (!editingUserData) {
      if (!uploadedDocuments.length && !uploadDocumentRemarks) {
        setUploadDocumentError("");
        setRemarksError("");
      } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
        CustomToast.error("Remarks is required");
        isValid = false;
        return;
      } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
        CustomToast.error("Upload Document is required");
        return;
      }
    } else {
      setUploadDocumentError("");
      setRemarksError("");
    }

    if (!isValid) {
      return;
    }

    const newStateData = {
      auctioneerGstDtoList: auctioneerGstDtoList,
      city: city,
      address: address,
      entityCode: entityCode,
      fax: fax,
      gstNo: gstNo,
      mobileNo: mobileNo,
      panNo: panNo,
      phoneNo: phoneNo,
      stateCode: stateCode,
      tblState: tblState,
      taxIdentityNo: taxIdentityNo,
      teaBoardRegistrationNo: teaBoardRegistrationNo,
      auctioneerName: auctioneerName,
      auctioneerCode: auctioneerCode,
      cinNo: cinNo,
      fssaiNo: fssaiNo,
      contactPerson: contactPerson,
      email: email,
      downloadDto: uploadedDocuments,
      isActive: 1,
      roleCode: "AUCTIONEER",
    };

    try {
      if (editingUserData) {
        const isFormModified =
          city !== editingUserData.city ||
          fax !== editingUserData.fax ||
          gstNo !== editingUserData.gstNo ||
          auctionCenterId !== editingUserData.auctionCenterId ||
          mobileNo !== editingUserData.mobileNo ||
          panNo !== editingUserData.panNo ||
          phoneNo !== editingUserData.phoneNo ||
          stateCode !== editingUserData.stateCode ||
          tblState !== editingUserData.tblState ||
          taxIdentityNo !== editingUserData.taxIdentityNo ||
          teaBoardRegistrationNo !== editingUserData.teaBoardRegistrationNo ||
          auctioneerName !== editingUserData.auctioneerName ||
          auctioneerCode !== editingUserData.auctioneerCode ||
          cinNo !== editingUserData.cinNo ||
          fssaiNo !== editingUserData.fssaiNo ||
          contactPerson !== editingUserData.contactPerson ||
          email !== editingUserData.email ||
          uploadDocumentRemarks !== editingUserData.uploadDocumentRemarks ||
          auctioneerGstDtoList !== editingUserData.auctioneerGstDtoList ||
          uploadedDocuments.length !== editingUserData.downloadDto.length;

        if (isFormModified) {
          dispatch(updateUserAction(editingUserData));
        } else {
          setExpanded("panel2");
        }
      } else {
        for (let i = 0; i < auctioneerGstDtoList.length; i++) {
          //if selected auction Center & selected state id is same
          if (tblState != "" && auctioneerGstDtoList[i].stateId == tblState) {
            auctioneerGstDtoList[i].gstNo = gstNo;
            auctioneerGstDtoList[i].address = address;
          }
        }
        dispatch(createUserAction(newStateData));
      }

      // handleClear();
      // setEditingUserData(null);
      // clearSearch();
      // setExpanded("panel2");
    } catch (error) {}
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

  const handleSearch = () => {
    const searchData = {
      userName: SearchUserName,
      userCode: SearchUserCode,
      email: SearchEmail,
      gstNo: SearchGstNumber,
      panNo: SearchPanNumber,
      teaBoardRegistrationCertificate: SearchRegistrationCertificate,
      // userType: SearchUserProfile,
      roleCode: "AUCTIONEER",
    };
    dispatch(searchUserAction(searchData));
  };

  const searchUserData = useSelector(
    (state) => state.createRegistrtion.searchResults.responseData
  );
  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };

  const setValueData = (data, editingUserData) => {
    setEditingUserData({
      ...editingUserData,
      stateName: data.target.value,
      stateId: data.target.options[data.target.selectedIndex].id,
    });
  };
  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    const inputElement = document.getElementById("auctioneerUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    removeFile();
  };

  const clearSearch = () => {
    setSearchUserName("");
    setSearchUserCode("");
    setSearchEmail("");
    setSearchGstNumber("");
    setSearchPanNumber("");
    setSearchRegistrationCertificate("");
    setSearchUserProfile("");
    dispatch(searchUserAction({ roleCode: "AUCTIONEER", isActive }));
    setRows(getAllUser);
  };

  const handleViewClick = (userId) => {
    dispatch(getUserByIdAction(userId));
    setViewMode(true);
    setExpanded("panel1");
    $("#vishal").show();
  };

  const handleEditClick = (userId) => {
    setViewMode(false);
    dispatch(getUserByIdAction(userId));
    setExpanded("panel1");
    isDisplay = true;
    $("#vishal").show();
  };
  const editingUserDataFromAc = useSelector(
    (state) => state.createRegistrtion.UserData.responseData
  );

  useEffect(() => {
    if (editingUserDataFromAc != null && editingUserDataFromAc != undefined) {
      let tempAuctionCenterData1 = [];
      let states = [];
      // Get selected auction center
      for (
        let i = 0;
        i < editingUserDataFromAc.auctioneerGstDtoList.length;
        i++
      ) {
        editingUserDataFromAc.auctioneerGstDtoList[i].statePresent = false;

        //if auction Center & selected state id is same
        if (
          editingUserDataFromAc.tblState != "" &&
          editingUserDataFromAc.auctioneerGstDtoList[i].stateId ==
            editingUserDataFromAc.tblState
        ) {
          editingUserDataFromAc.auctioneerGstDtoList[i].statePresent = true;
          states.push(editingUserDataFromAc.auctioneerGstDtoList[i].stateId);
          editingUserDataFromAc.gstNo =
            editingUserDataFromAc.auctioneerGstDtoList[i].gstNo;
          editingUserDataFromAc.address =
            editingUserDataFromAc.auctioneerGstDtoList[i].address;
        } else if (states && states.length == 0) {
          states.push(editingUserDataFromAc.auctioneerGstDtoList[i].stateId);
        } else if (
          states.includes(editingUserDataFromAc.auctioneerGstDtoList[i].stateId)
        ) {
          //if currenrt auction Center state id & saved state id is same
          editingUserDataFromAc.auctioneerGstDtoList[i].statePresent = true;
        } else if (
          !states.includes(
            editingUserDataFromAc.auctioneerGstDtoList[i].stateId
          )
        ) {
          states.push(editingUserDataFromAc.auctioneerGstDtoList[i].stateId);
        }
        tempAuctionCenterData1.push(
          editingUserDataFromAc.auctioneerGstDtoList[i]
        );
      }
      editingUserDataFromAc.auctionCenterId = states;
      setauctionCenterId(states);
      setauctioneerGstDtoList(tempAuctionCenterData1);
      setSelectedValue(editingUserDataFromAc.isActive || "");
      setEditingUserData(editingUserDataFromAc);
      setcity(editingUserDataFromAc.city || "");
      setauctionCenterId(
        editingUserDataFromAc.auctioneerGstDtoList[0].auctionCenterId || ""
      );
      setaddress(editingUserDataFromAc.address || "");
      setcontactPerson(editingUserDataFromAc.contactPerson || "");
      setemail(editingUserDataFromAc.email || "");
      setentityCode(editingUserDataFromAc.entityCode || "");
      setfax(editingUserDataFromAc.fax || "");
      setgstNo(editingUserDataFromAc.gstNo || "");
      setmobileNo(editingUserDataFromAc.mobileNo || "");
      setpanNo(editingUserDataFromAc.panNo || "");
      setphoneNo(editingUserDataFromAc.phoneNo || "");
      setstateCode(editingUserDataFromAc.stateCode || "");
      settblState(editingUserDataFromAc.tblState || "");
      settaxIdentityNo(editingUserDataFromAc.taxIdentityNo || "");
      setteaBoardRegistrationNo(
        editingUserDataFromAc.teaBoardRegistrationNo || ""
      );
      setauctioneerName(editingUserDataFromAc.auctioneerName || "");
      setauctioneerCode(editingUserDataFromAc.auctioneerCode || "");
      setcinNo(editingUserDataFromAc.cinNo || "");
      setfssaiNo(editingUserDataFromAc.fssaiNo || "");
      setuploadDocumentRemarks(
        editingUserDataFromAc.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingUserDataFromAc.downloadDto || []);
    } else {
      setEditingUserData(null);
      dispatch(fetchUser());
      dispatch(getAllAuctionCenterAction());
      dispatch(getAllStateAction());
      // resetForm();
    }
  }, [editingUserDataFromAc]);

  const getAllStateData = useSelector(
    (state) => state.state.getAllState.responseData
  );

  const [rows, setRows] = useState(getAllUser || getSearchUser);
  useEffect(() => {
    if (getUserData) setgetAllUser(getUserData);
    setRows(getUserData);
  }, [getUserData]);
  useEffect(() => {
    if (searchUserData != null && searchUserData != undefined) {
      setgetSearchUser(searchUserData);
      setRows(searchUserData);
    } else {
      setgetAllUser([]);
      setRows([]);
    }
  }, [searchUserData]);

  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchStateAction({}));
      //Get All State
      dispatch(searchUserAction({ roleCode: "AUCTIONEER", isActive }));
      dispatch(getAllStateAction());
      clearSearch();
      setViewMode(false);
      dispatch(getUserByIdActionSuccess([]));
      setEditingUserData(null);
      handleClear();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsUserAction("AUCTIONEER"));
      setViewMode(false);
      dispatch(getUserByIdActionSuccess([]));
      setEditingUserData(null);
      handleClear();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getUserByIdActionSuccess([]));
      setEditingUserData(null);
      $("#vishal").hide();
      handleClear();
    }
  };
  const handleChilsUserViewClick = (id) => {
    dispatch(getUserByIdAction(id));
    setShowChildmodal(true);
  };
  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.createRegistrtion &&
      state.createRegistrtion.uploadedDocuments &&
      state.createRegistrtion.uploadedDocuments.responseData
  );
  useEffect(() => {
    dispatch(uploadAllDocumentsUserAction("AUCTIONEER"));
  }, [dispatch]);

  const switchUserDataFromAc = useSelector(
    (state) => state.createRegistrtion.UserData.responseData
  );

  useEffect(() => {
    if (switchUserDataFromAc && handleSwitchClick) {
      const updatedData = {
        ...switchUserDataFromAc,
        isActive: switchUserDataFromAc.isActive === 1 ? 0 : 1,
      };
      setDataById(updatedData);
      dispatch(getUserByIdActionSuccess([]));
      setHandleSwitchClick(false);
    }
  }, [switchUserDataFromAc]);

  if (dataById != "") {
    const tempData = dataById;
    setDataById("");
    dispatch(updateUserAction(tempData));
  }

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
      const updatedData = {
        ...data.data,
        isActive: data.data.isActive === 1 ? 0 : 1,
        searchData: {
          userName: SearchUserName,
          userCode: SearchUserCode,
          email: SearchEmail,
          gstNo: SearchGstNumber,
          panNo: SearchPanNumber,
          teaBoardRegistrationCertificate: SearchRegistrationCertificate,
          // userType: SearchUserProfile,
          isActive: isActive != "" ? parseInt(isActive) : isActive,
        },
      };
      dispatch(updateUserAction(updatedData));
    };

    return (
      <>
        <div class="Switch">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id={`customSwitch${data.data.auctionCenterId}`}
              checked={data.data.isActive === 1 ? true : false}
              onChange={handleSwitchChange}
            />

            <label
              class="custom-control-label"
              for={`customSwitch${data.data.auctionCenterId}`}
            >
              {data.data.isActive === 1 ? "Active" : "In-Active"}
            </label>
          </div>
        </div>
      </>
    );
  }

  function ActionData(data) {
    return (
      <>
        <div class="Action">
          <i
            className="fa fa-edit"
            onClick={() => handleEditClick(data.data.userId)}
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
          <i
            className="fa fa-add"
            onClick={() => handleChilsUserViewClick(data.data.userId)}
          ></i>
        </div>
      </>
    );
  }

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter.getAllAuctionCenter.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const handleAuctionCenter = (value) => {
    setauctionCenterId(value);

    let tempAuctionCenterData1 = [];
    let states = [];
    // Get selected auction center
    for (let i = 0; i < getAllAuctionCenter.length; i++) {
      if (value.includes(getAllAuctionCenter[i].auctionCenterId.toString())) {
        getAllAuctionCenter[i].gstNo = getAllAuctionCenter[i].gstNo || "";
        getAllAuctionCenter[i].address = getAllAuctionCenter[i].address || "";
        getAllAuctionCenter[i].statePresent = false;

        //if auction Center & selected state id is same
        if (tblState != "" && getAllAuctionCenter[i].stateId == tblState) {
          getAllAuctionCenter[i].statePresent = true;
          states.push(getAllAuctionCenter[i].stateId);
        } else if (states && states.length == 0) {
          states.push(getAllAuctionCenter[i].stateId);
        } else if (states.includes(getAllAuctionCenter[i].stateId)) {
          //if currenrt auction Center state id & saved state id is same
          getAllAuctionCenter[i].statePresent = true;
        } else if (!states.includes(getAllAuctionCenter[i].stateId)) {
          states.push(getAllAuctionCenter[i].stateId);
        }

        tempAuctionCenterData1.push(getAllAuctionCenter[i]);
      }
    }
    setauctioneerGstDtoList(tempAuctionCenterData1);
  };

  const handlesStateNameChange = (e) => {
    setstateCode(e.target.options[e.target.selectedIndex].id);
    settblState(e.target.value);

    let tempAuctionCenterData1 = [];
    let states = [];

    // Get selected auction center
    for (let i = 0; i < getAllAuctionCenter.length; i++) {
      if (
        auctionCenterId.includes(
          getAllAuctionCenter[i].auctionCenterId.toString()
        )
      ) {
        getAllAuctionCenter[i].gstNo = "";
        getAllAuctionCenter[i].address = "";
        getAllAuctionCenter[i].statePresent = false;

        //if auction Center & selected state id is same
        if (
          e.target.value != "" &&
          getAllAuctionCenter[i].stateId == e.target.value
        ) {
          getAllAuctionCenter[i].statePresent = true;
          states.push(getAllAuctionCenter[i].stateId);
        } else if (states && states.length == 0) {
          states.push(getAllAuctionCenter[i].stateId);
        } else if (states.includes(getAllAuctionCenter[i].stateId)) {
          //if currenrt auction Center state id & saved state id is same
          getAllAuctionCenter[i].statePresent = true;
        } else if (!states.includes(getAllAuctionCenter[i].stateId)) {
          states.push(getAllAuctionCenter[i].stateId);
        }

        tempAuctionCenterData1.push(getAllAuctionCenter[i]);
      }
    }
    setauctioneerGstDtoList(tempAuctionCenterData1);
  };

  const tempAuctionCenterDataChange = (key, value, stateId, fromMultiple) => {
    if (fromMultiple) {
      let data =
        auctioneerGstDtoList &&
        auctioneerGstDtoList.map((data, index) => {
          if (data.stateId == stateId) {
            data[key] = value;
          }
          return data;
        });
      setauctioneerGstDtoList(data);
    } else {
      if ("address" == key) {
        setaddress(value);
      } else if ("gstNo" == key) {
        setgstNo(value);
      }
    }
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
        "downloaded_document.pdf"
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
    setauctioneerGstDtoList([]);
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
    settaxIdentityNo("");
    setteaBoardRegistrationNo("");
    setcinNo("");
    setfssaiNo("");
    setcontactPerson("");
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
    settaxIdentityNoError("");
    setteaBoardRegistrationNoError("");
    setauctioneerNameError("");
    setaddressError("");
    setauctioneerCodeError("");
    setcinNoError("");
    setfssaiNoError("");
    setcontactPersonError("");
    setemailError("");
    setUploadDocumentError("");
    setRemarksError("");
    setEditingUserData(null);
  };
  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_UserLogin";
    const moduleName = "Auctioneer";
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

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <Modals
        title={"AUCTIONEER Registration"}
        handleClose={handleClose}
        show={open === "createRegistration" || open === "editingUserData"}
        size="xl"
      >
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
                ? "View AUCTIONEER User Registration"
                : editingUserData
                ? "Edit AUCTIONEER User Registration"
                : "Create AUCTIONEER User Registration"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Name</label>
                        <select
                          className="form-control select-form"
                          value={editingUserData?.tblState || tblState}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setValueData(e, editingUserData)
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
                        <label>StateCode</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.stateCode || stateCode}
                          readOnly
                        />
                        {stateCodeError && (
                          <p className="errorLabel">{stateCodeError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>City</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.city || city}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
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
                        <label>Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.address || address}
                          onChange={(e) =>
                            tempAuctionCenterDataChange(
                              "address",
                              e.target.value,
                              tblState,
                              false
                            )
                          }
                          disabled={viewMode}
                        />
                        {addressError && (
                          <p className="errorLabel">{addressError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>GSTNo</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.gstNo || gstNo}
                          onChange={(e) =>
                            tempAuctionCenterDataChange(
                              "gstNo",
                              e.target.value,
                              tblState,
                              false
                            )
                          }
                          disabled={viewMode}
                        />
                        {gstNoError && (
                          <p className="errorLabel">{gstNoError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Contact Person</label>
                        <input
                          type="text"
                          className="form-control"
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
                        <label>Email ID</label>
                        <input
                          type="text"
                          className="form-control"
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
                      <div className="col-md-4">
                        <div className="FormGroup">
                          <label>EntityCode</label>
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

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Fax</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.fax || fax}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
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
                        <label>Mobile No.</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.mobileNo || mobileNo}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
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
                        <label>PAN No.</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.panNo || panNo}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  panNo: e.target.value,
                                })
                              : setpanNo(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {panNoError && (
                          <p className="errorLabel">{panNoError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Phone</label>
                        <input
                          type="text"
                          className="form-control"
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
                        <label>TaxId No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            editingUserData?.taxIdentityNo || taxIdentityNo
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  taxIdentityNo: e.target.value,
                                })
                              : settaxIdentityNo(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {taxIdentityNoError && (
                          <p className="errorLabel">{taxIdentityNoError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Teaboard Reg No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            editingUserData?.teaBoardRegistrationNo ||
                            teaBoardRegistrationNo
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  teaBoardRegistrationNo: e.target.value,
                                })
                              : setteaBoardRegistrationNo(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {teaBoardRegistrationNoError && (
                          <p className="errorLabel">
                            {teaBoardRegistrationNoError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auctioneer Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            editingUserData?.auctioneerName || auctioneerName
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  auctioneerName: e.target.value,
                                })
                              : setauctioneerName(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {auctioneerNameError && (
                          <p className="errorLabel">{auctioneerNameError}</p>
                        )}
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
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  auctioneerCode: e.target.value,
                                })
                              : setauctioneerCode(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {auctioneerCodeError && (
                          <p className="errorLabel">{auctioneerCodeError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>CINno</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.cinNo || cinNo}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  cinNo: e.target.value,
                                })
                              : setcinNo(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {cinNoError && (
                          <p className="errorLabel">{cinNoError}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>FSSAI No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.fssaiNo || fssaiNo}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  fssaiNo: e.target.value,
                                })
                              : setfssaiNo(e.target.value))
                          }
                          disabled={viewMode}
                        />
                        {fssaiNoError && (
                          <p className="errorLabel">{fssaiNoError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FomrGroup">
                        <label>Auction center</label>
                        <Form.Group controlId="my_multiselect_field">
                          <Form.Control
                            as="select"
                            multiple
                            value={
                              editingUserData?.auctionCenterId ||
                              auctionCenterId
                            }
                            onChange={(e) =>
                              !viewMode &&
                              (editingUserData
                                ? setEditingUserData({
                                    ...editingUserData,
                                    auctionCenterId: e.target.value,
                                  })
                                : handleAuctionCenter(
                                    [].slice
                                      .call(e.target.selectedOptions)
                                      .map((item) => item.value)
                                  ))
                            }
                            disabled={viewMode}
                          >
                            {getAllAuctionCenter?.map((data, index) => (
                              <option key={index} value={data.auctionCenterId}>
                                {data.auctionCenterName}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                        {auctionCenterIdError && (
                          <p className="errorLabel">{auctionCenterIdError}</p>
                        )}
                      </div>
                    </div>

                    {auctioneerGstDtoList && auctioneerGstDtoList.length > 0 ? (
                      <div className="GSTBox">
                        {auctioneerGstDtoList &&
                          auctioneerGstDtoList.map((data, index) => (
                            <>
                              {!data.statePresent ? (
                                <div className="row">
                                  <div className="col-md-3">
                                    <div className="FormGroup">
                                      <label>Sr No.</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={index + 1}
                                        disabled={true}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="FormGroup">
                                      <label>State</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={data.stateName}
                                        disabled={true}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="FormGroup">
                                      <label>GSTNo</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={data.gstNo}
                                        disabled={viewMode}
                                        onChange={(e) =>
                                          tempAuctionCenterDataChange(
                                            "gstNo",
                                            e.target.value,
                                            data.stateId,
                                            true
                                          )
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="FormGroup">
                                      <label>Address</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={data.address}
                                        onChange={(e) =>
                                          tempAuctionCenterDataChange(
                                            "address",
                                            e.target.value,
                                            data.stateId,
                                            true
                                          )
                                        }
                                        disabled={viewMode}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </>
                          ))}
                      </div>
                    ) : (
                      ""
                    )}
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
                                  selectedValue == data.value ? true : false
                                }
                                onChange={(event) => handleRadioChange(event)}
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
                            inputId="auctioneerUpload"
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
                            onClick={handleSubmit}
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
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Manage AUCTIONEER User Registration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auctioneer User code</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search User Code"
                          value={SearchUserCode}
                          onChange={(e) => setSearchUserCode(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label> Auctioneer User Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search User Name"
                          value={SearchUserName}
                          onChange={(e) => setSearchUserName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auctioneer Email Id</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Email"
                          value={SearchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auctioneer Registration certificate</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Auctioneer Registration certificate"
                          value={SearchRegistrationCertificate}
                          onChange={(e) =>
                            setSearchRegistrationCertificate(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auctioneer GST Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder=" Search GST No"
                          value={SearchGstNumber}
                          onChange={(e) => setSearchGstNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label> Auctioneer PAN Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder=" Search PAN No"
                          value={SearchPanNumber}
                          onChange={(e) => setSearchPanNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auctioneer User Profile Status</label>
                        <select
                          className="form-control select-form"
                          value={userProfileStatus}
                          onChange={(e) => setuserProfileStatus(e.target.value)}
                        >
                          <option>Select Auctioneer User Profile Status</option>
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
                      // rows={getUserData?.map((row, index) => ({
                      //   ...row,
                      //   index: index + 1,
                      // }))}
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
                    name: "fieldValue",
                    title: "Auctioneer Name",
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
      </Modals>

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
                getHistoryIdData?.length > 0
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
      {showchildmodal && (
        <Modals
          title={" Add Child User"}
          show={showchildmodal}
          size="xl"
          centered
          handleClose={() => setShowChildmodal(false)}
        >
          <CreateChildUserRegistration
            editData={editingUserData}
            showchildmodal1={showchildmodal}
          ></CreateChildUserRegistration>
        </Modals>
      )}
    </>
  );
}

export default CreateUser;
