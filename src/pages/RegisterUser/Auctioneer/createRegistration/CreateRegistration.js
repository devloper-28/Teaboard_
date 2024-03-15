import React, { useState, useEffect } from "react";
import Modals from "../../../../components/common/Modal";
import CreateChildUserRegistration from "../CreateChildUserRegistration/CreateChildUserRegistration";
import CustomToast from "../../../../components/Toast";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import { ThreeDots } from "react-loader-spinner";
import {
  fetchUser,
  createUserAction,
  updateUserAction,
  getUserByIdAction,
  getUserByIdActionSuccess,
  getDocumentByIdActionSuccess,
  getAllAuctionCenterAscAction,
  getAllStateAscAction,
  getAllStateAction,
  searchUserAction,
  uploadAllDocumentsUserAction,
  getDocumentByIdAction,
  createEditApiUser,
  getHistoryByIdAction,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  closemodel,
} from "../../../../store/actions";
import $ from "jquery";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Base64ToPDFPreview from "../../../uploadDocument/Base64ToPDFPreview";
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
import { Card, Form, Modal } from "react-bootstrap";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import { uploadedFileDownload } from "../../../uploadDocument/UploadedFileDownload";
import UploadMultipleDocuments from "../../../uploadDocument/UploadMultipleDocuments";
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

function CreateUser({ open, setOpen, isProfile, modalRight, childUser }) {
  const getUserData = useSelector(
    (state) => state.createRegistrtion.getAllUserActionSuccess.responseData
  );
  const [documentMode, setDocumentmode] = useState("");
  const [editingUserData, setEditingUserData] = useState(null);
  const [city, setcity] = useState("");
  const [contactPerson, setcontactPerson] = useState("");
  const [email, setemail] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [gstNo, setgstNo] = useState("");
  const [mobileNo, setmobileNo] = useState("");
  const [panNo, setpanNo] = useState("");
  // const [field, setField] = useState([]);
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
  const [auctionCenterId, setauctionCenterId] = useState([]);
  const [onChangesAuctionCenterId, setOnChangeAuctionCenterId] = useState([]);
  const [address, setaddress] = useState("");
  const [tblState, settblState] = useState("");
  const [getAllUser, setgetAllUser] = useState([]);
  const [getSearchUser, setgetSearchUser] = useState("");
  const [cityError, setcityError] = useState("");
  const [contactPersonError, setcontactPersonError] = useState("");
  const [emailError, setemailError] = useState("");
  const [gstNoError, setgstNoError] = useState("");
  const [mobileNoError, setmobileNoError] = useState("");
  const [panNoError, setpanNoError] = useState("");
  const [teaBoardRegistrationNoError, setteaBoardRegistrationNoError] =
    useState("");
  const [auctionCenterList, setauctionCenterList] = useState([]);
  const [factoryOwnerDisabled, setfactoryOwnerDisabled] = useState(false);
  const [stateNameError, setstateNameError] = useState("");
  const [phoneNoError, setphoneNoError] = useState("");
  const [faxError, setfaxError] = useState("");
  const [entityCodeError, setentityCodeError] = useState("");
  const [auctioneerNameError, setauctioneerNameError] = useState("");
  const [auctioneerCodeError, setauctioneerCodeError] = useState("");
  const [fssaiNoError, setfssaiNoError] = useState("");
  const [cinNoError, setcinNoError] = useState("");
  const [taxIdentityNoError, settaxIdentityNoError] = useState("");
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [stateCodeError, setstateCodeError] = useState("");
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
  const [userProfileStatus, setuserProfileStatus] = useState("");
  const [exportType, setexportType] = useState("");
  const [loader, setLoader] = useState(false);
  const [auctioneerGstDtoList, setauctioneerGstDtoList] = useState([]);
  var isDisplay = false;
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [irnEligibility, setIrnEligibility] = useState(0);

  const handleSubmit = (e) => {
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
        "Please select an auction center from the dropdown list."
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
    if (!fax) {
      CustomToast.error("Please enter a valid fax number");
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
      CustomToast.error("Please enter the GSTNo.");
      isValid = false;
    }
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
    if (!tblState) {
      CustomToast.error("Please select a state from the dropdown list");
      isValid = false;
      return;
    }
    // if (!taxIdentityNo) {
    //   CustomToast.error("Please enter a unique TaxId No");
    //   isValid = false;
    //   return;
    // }
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
    // if (!cinNo) {
    //   CustomToast.error("Please enter a unique CIN no");
    //   isValid = false;
    //   return;
    // }
    // if (!fssaiNo) {
    //   CustomToast.error("Please enter a unique FSSAI No");
    //   isValid = false;
    //   return;
    // }

    // if (!editingUserData) {
    //   if (!uploadedDocuments.length && !uploadDocumentRemarks) {
    //     setUploadDocumentError("");
    //     setRemarksError("");
    //   } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
    //     isValid = false;
    //     CustomToast.error("Please enter the remarks");
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
      uploadDocumentRemarks: uploadDocumentRemarks,
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
          editingUserData.auctioneerGstDtoList = auctioneerGstDtoList;
          editingUserData.isActive = selectedValue;
          editingUserData.irnEligibility = irnEligibility;
          editingUserData.searchData = {
            userName: SearchUserName,
            userCode: SearchUserCode,
            email: SearchEmail,
            gstNo: SearchGstNumber,
            panNo: SearchPanNumber,
            teaBoardRegistrationCertificate: SearchRegistrationCertificate,
            // userType: SearchUserProfile,
            isActive: userProfileStatus,
            roleCode: "AUCTIONEER",
            pageNo: pageNo,
            noOfRecords: NO_OF_RECORDS,
          };
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
    } catch (error) {}
  };

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
    if (isProfile == 1) {
      handleEditClick(atob(sessionStorage.getItem("argument2")));
    }
    console.log(
      modalRight?.map((ele) => ele.linkId),
      "modalRightmodalRightmodalRightmodalRightmodalRight22"
    );
  }, []);
  console.log(modalRight, childUser, "MR");
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

  let createData = useSelector(
    (state) => state.createRegistrtion.createEditApiUser
  );
  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      userName: SearchUserName,
      userCode: SearchUserCode,
      email: SearchEmail,
      gstNo: SearchGstNumber,
      panNo: SearchPanNumber,
      roleCode: "AUCTIONEER",
      isActive: userProfileStatus,
      teaBoardRegistrationCertificate: SearchRegistrationCertificate,
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
        Base64ToExcelDownload(getExportDataResponse, "AuctioneerDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "AuctioneerDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiUser(false));
      setExpanded("panel2");
      handleClear();
      dispatch(getUserByIdActionSuccess([]));
      if(isProfile==1){
        dispatch(closemodel(closestatusjpgp + 1));
      }
      setEditingUserData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchUserAction({
        userName: SearchUserName,
        userCode: SearchUserCode,
        email: SearchEmail,
        gstNo: SearchGstNumber,
        panNo: SearchPanNumber,
        teaBoardRegistrationCertificate: SearchRegistrationCertificate,
        // userType: SearchUserProfile,
        isActive: userProfileStatus,
        roleCode: "AUCTIONEER",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchUserAction({
        userName: SearchUserName,
        userCode: SearchUserCode,
        email: SearchEmail,
        gstNo: SearchGstNumber,
        panNo: SearchPanNumber,
        teaBoardRegistrationCertificate: SearchRegistrationCertificate,
        // userType: SearchUserProfile,
        isActive: userProfileStatus,
        roleCode: "AUCTIONEER",
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
      tblState: parseInt(data.target.value),
      stateName: data.target.value,
      stateId: data.target.options[data.target.selectedIndex].id,
    });
  };
  // const handleChanges = (event) => {
  //   const {
  //     target: { value, id },
  //   } = event;
  //   setField(typeof value === "string" ? value.split(",") : value);
  // };
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
    setuserProfileStatus("");
    setRows([]);
    setgetAllUser([]);
    pageNo = 1;
    dispatch(
      searchUserAction({
        roleCode: "AUCTIONEER",
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
    setRows(getAllUser);
  };

  const handleViewClick = (userId) => {
    dispatch(getUserByIdAction(userId));
    // setExpanded("panel1");
    setViewModal(true);
    setViewMode(true);
    $("#vishal").show();
  };

  const handleEditClick = (userId) => {
    setViewMode(false);
    dispatch(getUserByIdAction(userId));
    // setExpanded("panel1");
    setEditModal(true);
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
      let auctionCenterIdData = [];
      // Get selected auction center
      for (
        let i = 0;
        i < editingUserDataFromAc.auctioneerGstDtoList.length;
        i++
      ) {
        editingUserDataFromAc.auctioneerGstDtoList[i].statePresent = false;
        //if auction Center & selected state id is same
        if (
          editingUserDataFromAc.stateId != "" &&
          editingUserDataFromAc.auctioneerGstDtoList[i].stateId ==
            editingUserDataFromAc.tblState
        ) {
          editingUserDataFromAc.auctioneerGstDtoList[i].statePresent = true;
          auctionCenterIdData.push(
            editingUserDataFromAc.auctioneerGstDtoList[i].auctionCenterId
          );
          states.push(editingUserDataFromAc.auctioneerGstDtoList[i].stateId);
          tempAuctionCenterData1.push(
            editingUserDataFromAc.auctioneerGstDtoList[i]
          );
        } else if (auctionCenterIdData && auctionCenterIdData.length == 0) {
          auctionCenterIdData.push(
            editingUserDataFromAc.auctioneerGstDtoList[i].auctionCenterId
          );
          states.push(editingUserDataFromAc.auctioneerGstDtoList[i].stateId);
          tempAuctionCenterData1.push(
            editingUserDataFromAc.auctioneerGstDtoList[i]
          );
        } else if (
          states.includes(editingUserDataFromAc.auctioneerGstDtoList[i].stateId)
        ) {
          //if currenrt auction Center state id & saved state id is same
          editingUserDataFromAc.auctioneerGstDtoList[i].statePresent = true;
          auctionCenterIdData.push(
            editingUserDataFromAc.auctioneerGstDtoList[i].auctionCenterId
          );
        } else if (
          !states.includes(
            editingUserDataFromAc.auctioneerGstDtoList[i].stateId
          )
        ) {
          states.push(editingUserDataFromAc.auctioneerGstDtoList[i].stateId);
          auctionCenterIdData.push(
            editingUserDataFromAc.auctioneerGstDtoList[i].auctionCenterId
          );
          tempAuctionCenterData1.push(
            editingUserDataFromAc.auctioneerGstDtoList[i]
          );
        } else if (
          !auctionCenterIdData.includes(
            editingUserDataFromAc.auctioneerGstDtoList[i].auctionCenterIdData
          )
        ) {
          auctionCenterIdData.push(
            editingUserDataFromAc.auctioneerGstDtoList[i].auctionCenterId
          );
          // states.push(editingUserDataFromAc.auctioneerGstDtoList[i].stateId);
        }
      }

      let tempDataNo = [];
      getAllAuctionCenter &&
        getAllAuctionCenter.map((auctionCenterData, auctioncenterIndex) => {
          if (auctionCenterIdData.includes(auctionCenterData.auctionCenterId)) {
            tempDataNo.push(auctionCenterData.auctionCenterName.toString());
          }
        });

      setOnChangeAuctionCenterId(tempDataNo);
      editingUserDataFromAc.auctionCenterId = auctionCenterIdData;
      setauctionCenterId(auctionCenterIdData);
      setauctioneerGstDtoList(tempAuctionCenterData1);
      setSelectedValue(editingUserDataFromAc.isActive || "");
      editingUserDataFromAc.onChangesAuctionCenterId = tempDataNo;
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
      setIrnEligibility(editingUserDataFromAc.irnEligibility);
    } else {
      setEditingUserData(null);
      // dispatch(
      //   searchUserAction({
      //     roleCode: "AUCTIONEER",
      //     pageNo: pageNo,
      //     noOfRecords: NO_OF_RECORDS,
      //   })
      // );
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
      // resetForm();
    }
  }, [editingUserDataFromAc]);

  const getAllStateDataResponse = useSelector(
    (state) => state?.state?.getAllStateAsc?.responseData
  );

  const getAllStateData =
    getAllStateDataResponse &&
    getAllStateDataResponse.filter((data) => 1 == data.isActive);

  const [rows, setRows] = useState([]);
  // useEffect(() => {
  //   if (getUserData) setgetAllUser(getUserData);
  //   setauctionCenterList(getAllAuctionCenter);
  //   setRows(getUserData);
  // }, [getUserData]);

  // useEffect(() => {
  //   if (searchUserData != null && searchUserData != undefined) {
  //     // setgetAllUser(searchUserData);
  //     setRows(searchUserData);
  //   } else {
  //     // setgetAllUser([]);
  //     setRows([]);
  //   }
  // }, [searchUserData]);

  // useEffect(() => {
  //   const newRows = getUserData || [];
  //   setRows((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
  // }, [getUserData]);

  // useEffect(() => {
  //   const newRows = searchUserData || [];
  //   setRows((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
  // }, [searchUserData]);

  useEffect(() => {
    const newRows = searchUserData || [];
    setRows((prevRows) => {
      const currentRows = Array.isArray(prevRows) ? [...prevRows] : [];

      if (newRows.length > 0) {
        const index = currentRows.findIndex(
          (row) => row.userId === newRows[0].userId
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
  }, [searchUserData]);

  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      //Serch API call
      // dispatch(searchStateAction({}));
      //Get All State
      pageNo = 1;
      dispatch(
        searchUserAction({
          roleCode: "AUCTIONEER",
          isActive,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
      setfactoryOwnerDisabled(false);
      dispatch(
        getAllStateAscAction({
          sortBy: "asc",
          sortColumn: "stateName",
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
      // clearSearch();
      setViewMode(false);
      dispatch(getUserByIdActionSuccess([]));
      setfactoryOwnerDisabled(false);
      setEditingUserData(null);
      handleClear();
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsUserAction("AUCTIONEER"));
      setViewMode(false);
      setfactoryOwnerDisabled(false);
      dispatch(getUserByIdActionSuccess([]));
      setEditingUserData(null);
      handleClear();
    } else if ("panel1" == panel && !isExpanded) {
      setViewMode(false);
      dispatch(getUserByIdActionSuccess([]));
      setfactoryOwnerDisabled(false);
      setEditingUserData(null);
      $("#vishal").hide();
      handleClear();
    }
  };
  const handleChilsUserViewClick = (id) => {
    setShowChildmodal(true);
    dispatch(getUserByIdAction(id));
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
  console.log(
    childUser,
    childUser.some((user) => user.linkId === 20 && user.rightIds.includes("2")),
    "child user"
  );
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
          isActive: userProfileStatus,
          teaBoardRegistrationCertificate: SearchRegistrationCertificate,
          // userType: SearchUserProfile,
          isActive: isActive != "" ? parseInt(isActive) : isActive,
        },
      };
      dispatch(updateUserAction(updatedData));
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
        ) : (
          <label
            class="custom-control-label"
            for={`customSwitch${data.data.auctionCenterId}`}
          >
            {data.data.isActive === 1 ? "Active" : "In-Active"}
          </label>
        )}
      </>
    );
  }

  function ActionData(data) {
    return (
      <>
        <div class="Action">
          {modalRight
            ?.map((ele) => ele.rightIds)
            ?.at(0)
            ?.includes("2") && (
            <i
              className="fa fa-edit"
              onClick={() => handleEditClick(data.data.userId)}
            ></i>
          )}
          {modalRight
            ?.map((ele) => ele.rightIds)
            ?.at(0)
            ?.includes("3") && (
            <i
              className="fa fa-eye"
              onClick={() => handleViewClick(data.data.userId)}
            ></i>
          )}
          {modalRight
            ?.map((ele) => ele.rightIds)
            ?.at(0)
            ?.includes("4") && (
            <i
              className="fa fa-history"
              onClick={() => {
                handleHistoryViewClick(data.data.userId);
              }}
            ></i>
          )}
          <i
            className="fa fa-add"
            onClick={() => handleChilsUserViewClick(data.data.userId)}
          ></i>
        </div>
      </>
    );
  }

  const getAllAuctionCenterResponse = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const handleAuctionCenter = (event) => {
    const {
      target: { value, id },
    } = event;
    let tempData = typeof value === "string" ? value.split(",") : value;
    setOnChangeAuctionCenterId(tempData);

    let tempDataNo = [];
    getAllAuctionCenter &&
      getAllAuctionCenter.map((auctionCenterData, auctioncenterIndex) => {
        if (tempData.includes(auctionCenterData.auctionCenterName)) {
          tempDataNo.push(auctionCenterData.auctionCenterId.toString());
        }
      });

    setauctionCenterId(tempDataNo);
    let tempAuctionCenterData1 = [];
    let states = [];

    // Get selected auction center
    for (let i = 0; i < getAllAuctionCenter.length; i++) {
      if (
        tempDataNo.includes(getAllAuctionCenter[i].auctionCenterId.toString())
      ) {
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
        if (editingUserData) {
          editingUserData.address = value;
        }
        setaddress(value);
      } else if ("gstNo" == key) {
        if (editingUserData) {
          editingUserData.gstNo = value;
        }
        setgstNo(value);
      }
    }
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
    setOnChangeAuctionCenterId([]);
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
    setauctioneerName("");
    setauctioneerCode("");
    setuploadDocumentRemarks("");
    setEditingUserData(null);
    setIrnEligibility(0);
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

  const handleCloseViewModal = () => {
    setViewModal(false);
    //Serch API call
    // dispatch(searchStateAction({}));
    //Get All State
    pageNo = 1;
    dispatch(
      searchUserAction({
        roleCode: "AUCTIONEER",
        isActive,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
    setfactoryOwnerDisabled(false);
    dispatch(
      getAllStateAscAction({
        sortBy: "asc",
        sortColumn: "stateName",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getUserByIdActionSuccess([]));
    setfactoryOwnerDisabled(false);
    setEditingUserData(null);
    handleClear();
  };
  const closestatusjpgp = useSelector((state) => state.createBuyer.closemodel);
  const handleCloseEditModal = () => {
    if(isProfile==1){
      dispatch(closemodel(closestatusjpgp + 1));
    }
    setEditModal(false);
    //Serch API call
    // dispatch(searchStateAction({}));
    //Get All State
    pageNo = 1;
    dispatch(
      searchUserAction({
        userName: SearchUserName,
        userCode: SearchUserCode,
        email: SearchEmail,
        gstNo: SearchGstNumber,
        panNo: SearchPanNumber,
        teaBoardRegistrationCertificate: SearchRegistrationCertificate,
        // userType: SearchUserProfile,
        isActive: userProfileStatus,
        roleCode: "AUCTIONEER",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
    setfactoryOwnerDisabled(false);
    dispatch(
      getAllStateAscAction({
        sortBy: "asc",
        sortColumn: "stateName",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getUserByIdActionSuccess([]));
    setfactoryOwnerDisabled(false);
    setEditingUserData(null);
    handleClear();
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
            <Typography>Create Auctioneer User Registration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Name</label>
                        <label className="errorLabel"> * </label>
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
                        <label className="errorLabel"> * </label>
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
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
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
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="500"
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
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="15"
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
                        <label>Email ID</label>
                        <label className="errorLabel"> * </label>
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

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Fax</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          className="form-control"
                          maxLength="15"
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
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          className="form-control"
                          maxLength="15"
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
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="10"
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
                        <label>TaxId No</label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="15"
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
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="15"
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
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
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
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="10"
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
                          maxLength="21"
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
                          maxLength="14"
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
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>

                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={onChangesAuctionCenterId}
                          onChange={handleAuctionCenter}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(", ")}
                          disabled={viewMode}
                          className="w-100"
                        >
                          {getAllAuctionCenter?.map((AuctionCenter) => (
                            <MenuItem
                              key={AuctionCenter.auctionCenterId}
                              value={AuctionCenter.auctionCenterName}
                            >
                              <Checkbox
                                checked={
                                  onChangesAuctionCenterId.indexOf(
                                    AuctionCenter.auctionCenterName
                                  ) > -1
                                }
                              />
                              <ListItemText
                                primary={AuctionCenter.auctionCenterName}
                              />
                            </MenuItem>
                          ))}
                        </Select>
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
          title={"Edit Auctioneer User Registration"}
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
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
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
                    <label className="errorLabel"> * </label>
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="500"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
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
                    {gstNoError && <p className="errorLabel">{gstNoError}</p>}
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
                    <label>Email ID</label>
                    <label className="errorLabel"> * </label>
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
                    {emailError && <p className="errorLabel">{emailError}</p>}
                  </div>
                </div>

                {editingUserData ? (
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

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Fax</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
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
                    {panNoError && <p className="errorLabel">{panNoError}</p>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Phone</label>
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
                    <label>TaxId No</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
                      value={editingUserData?.taxIdentityNo || taxIdentityNo}
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingUserData?.auctioneerName || auctioneerName}
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={editingUserData?.auctioneerCode || auctioneerCode}
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
                      maxLength="21"
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
                    {cinNoError && <p className="errorLabel">{cinNoError}</p>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>FSSAI No</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="14"
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
                  <div className="FormGroup">
                    <label>IRN Eligibility (Turnover Exceeds 5 CR)</label>
                    <select
                      className="form-control select-form"
                      value={irnEligibility}
                      onChange={(e) => setIrnEligibility(e.target.value)}
                      disabled={1 == isProfile ? false : true}
                    >
                      <option value={1}>Yes</option>
                      <option value={0}>No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FomrGroup">
                    <label>Auction Center</label>
                    <label className="errorLabel"> * </label>

                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={onChangesAuctionCenterId}
                      onChange={handleAuctionCenter}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => selected.join(", ")}
                      disabled={viewMode}
                      className="w-100"
                    >
                      {getAllAuctionCenter?.map((AuctionCenter) => (
                        <MenuItem
                          key={AuctionCenter.auctionCenterId}
                          value={AuctionCenter.auctionCenterName}
                        >
                          <Checkbox
                            checked={
                              onChangesAuctionCenterId.indexOf(
                                AuctionCenter.auctionCenterName
                              ) > -1
                            }
                          />
                          <ListItemText
                            primary={AuctionCenter.auctionCenterName}
                          />
                        </MenuItem>
                      ))}
                    </Select>
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
                {/* {!viewMode ? (
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
                    </div> */}

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
          title={"View Auctioneer User Registration"}
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
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
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
                    <label className="errorLabel"> * </label>
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="500"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
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
                    {gstNoError && <p className="errorLabel">{gstNoError}</p>}
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
                    <label>Email ID</label>
                    <label className="errorLabel"> * </label>
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
                    {emailError && <p className="errorLabel">{emailError}</p>}
                  </div>
                </div>

                {editingUserData ? (
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

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Fax</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
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
                    {panNoError && <p className="errorLabel">{panNoError}</p>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Phone</label>
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
                    <label>TaxId No</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
                      value={editingUserData?.taxIdentityNo || taxIdentityNo}
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={editingUserData?.auctioneerName || auctioneerName}
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={editingUserData?.auctioneerCode || auctioneerCode}
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
                      maxLength="21"
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
                    {cinNoError && <p className="errorLabel">{cinNoError}</p>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>FSSAI No</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="14"
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
                  <div className="FormGroup">
                    <label>IRN Eligibility (Turnover Exceeds 5 CR)</label>
                    <select
                      className="form-control select-form"
                      value={irnEligibility}
                      onChange={(e) => setIrnEligibility(e.target.value)}
                      disabled={true}
                    >
                      <option value={1}>Yes</option>
                      <option value={0}>No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FomrGroup">
                    <label>Auction Center</label>
                    <label className="errorLabel"> * </label>

                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={onChangesAuctionCenterId}
                      onChange={handleAuctionCenter}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => selected.join(", ")}
                      disabled={viewMode}
                      className="w-100"
                    >
                      {getAllAuctionCenter?.map((AuctionCenter) => (
                        <MenuItem
                          key={AuctionCenter.auctionCenterId}
                          value={AuctionCenter.auctionCenterName}
                        >
                          <Checkbox
                            checked={
                              onChangesAuctionCenterId.indexOf(
                                AuctionCenter.auctionCenterName
                              ) > -1
                            }
                          />
                          <ListItemText
                            primary={AuctionCenter.auctionCenterName}
                          />
                        </MenuItem>
                      ))}
                    </Select>
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
            <Typography>Manage Auctioneer User Registration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Auctioneer Code</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Auctioneer Code"
                          value={SearchUserCode}
                          onChange={(e) => setSearchUserCode(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label> Auctioneer Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Auctioneer Name"
                          value={SearchUserName}
                          onChange={(e) => setSearchUserName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea Board Registration Certificate Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Tea Board Registration Certificate Number"
                          value={SearchRegistrationCertificate}
                          onChange={(e) =>
                            setSearchRegistrationCertificate(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Email ID</label>
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
                        <label>GST Number</label>
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
                        <label>PAN Number</label>
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
                        <label>User Profile Status</label>
                        <select
                          className="form-control select-form"
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

              <div className="row">
                {/* <div className="col-lg-12 mt-4">
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
              </div> */}
              </div>
              <div className="TableBox mt-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th rowSpan={2}>Sr.</th>
                      <th rowSpan={2}>Auctioneer Code</th>
                      <th rowSpan={2}>Contact Name</th>
                      <th rowSpan={2}>Auctioneer Name</th>
                      <th rowSpan={2}>
                        Tea Board Registration Certificate Number
                      </th>
                      <th colSpan={3} className="text-center">
                        Contact Details
                      </th>
                      <th colSpan={2} className="text-center">
                        TAX Details
                      </th>
                      <th rowSpan={2}>Action</th>
                    </tr>

                    <tr>
                      <th>Phone Number</th>
                      <th>Mobile Number</th>
                      <th>Email ID</th>
                      <th>GST Number</th>
                      <th>PAN Number</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows?.length > 0 ? (
                      <>
                        {rows?.map((row, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.userCode}</td>
                            <td>{row.contactPersonName}</td>
                            <td>{row.userName}</td>
                            <td>{row.teaBoardRegistrationCertificate}</td>
                            <td className="Phone">
                              <i className="fa fa-phone"></i> &nbsp;
                              {row.phoneNo}
                            </td>
                            <td className="Mobile">
                              <i className="fas fa-mobile-alt"></i> &nbsp;
                              {row.mobileNo}
                            </td>
                            <td className="Email">
                              <i className="fa fa-envelope"></i> &nbsp;
                              {row.email}
                            </td>
                            <td>{row.gstNo}</td>
                            <td>{row.panNo}</td>
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
                              {childUser.some((user) => user.linkId === 21) && (
                                <Tooltip title="Add" placement="top">
                                  <i
                                    className="fa fa-add"
                                    onClick={() =>
                                      handleChilsUserViewClick(row.userId)
                                    }
                                  ></i>
                                </Tooltip>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <>
                        <tr>
                          <td colSpan={11}>
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
                      </>
                    )}
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
                getHistoryIdData?.length > 0
                  ? getHistoryIdData.map((row, index) => ({
                      ...row,
                      index: index + 1,
                      updatedOn: row.updatedOn,
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

      {/* Addd Child   */}
      {showchildmodal && (
        <Modals
          title={" Add Child User"}
          show={showchildmodal}
          size="xl"
          centered
          handleClose={() => setShowChildmodal(false)}
        >
          <CreateChildUserRegistration
            childUser={childUser}
            editData={editingUserData}
            showchildmodal1={showchildmodal}
          ></CreateChildUserRegistration>
        </Modals>
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

export default CreateUser;
