import React, { useState, useEffect } from "react";
import moment from "moment";
import Modals from "../../../../components/common/Modal";
import { uploadedFileDownload } from "../../../uploadDocument/UploadedFileDownload";
import UploadMultipleDocuments from "../../../uploadDocument/UploadMultipleDocuments";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import CustomToast from "../../../../components/Toast";
import { ThreeDots } from "react-loader-spinner";
import CreateChildUserBuyerRegistration from "../CreateChildUserBuyerRegistration/CreateChildUserBuyerRegistration";
import {
  //fetchUser,
  createBuyerAction,
  getBuyer,
  getBuyerByIdAction,
  updateBuyerAction,
  getAllAuctionCenterAction,
  getAllAuctionCenterAscAction,
  getAllStateAction,
  getAllStateAscAction,
  getDocumentByIdActionSuccess,
  uploadAllDocumentsBuyerAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getBuyerByIdActionSuccess,
  createEditApiStatusBuyer,
  getExportData,
  getExportDataApiCall,
  getExportDataForView,
  getExportDataForViewApiCall,
  getPayment,
  closemodel,
} from "../../../../store/actions";
import $ from "jquery";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import Base64ToExcelDownload from "../../../Base64ToExcelDownload";
import Base64ToPDFPreview from "../../../uploadDocument/Base64ToPDFPreview";
import { NO_OF_RECORDS } from "../../../../constants/commonConstants";
import { Tooltip } from "@mui/material";

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

function BuyerRegistration({
  open,
  setOpen,
  isProfile,
  modalRight,
  childUser,
}) {
  const getUserData = useSelector(
    (state) => state.createBuyer.getBuyer.responseData
  );
  // useEffect(() => {
  //   dispatch(
  //     getBuyer({
  //       userType: 2,
  //       isParentId: 0,
  //     })
  //   );
  // }, [getBuyer]);

  useEffect(() => {
    let yearObj = {};
    for (let i = 1980; i <= currentYear; i++) {
      yearObj = {};
      yearObj.key = i;
      yearObj.value = i;

      optionsForYear.push(yearObj);
    }
    setOptionsForYear(optionsForYear);
    if (isProfile == 1) {
      handleEditClick(atob(sessionStorage.getItem("argument2")));
      //setExpanded("panel2");
      //dispatch(getBuyer({ userType: 2, isParentId: 0, roleCode: "BUYER" }));
    } else if (isProfile == 2) {
      handleChildUserViewClick(atob(sessionStorage.getItem("argument2")));
    }
  }, []);
  const [documentMode, setDocumentmode] = useState("");
  const [selectedValue, setSelectedValue] = useState("Option 1");
  const [editingUserData, setEditingUserData] = useState(null);
  const [buyerName, setbuyerName] = useState("");
  const [buyerCode, setbuyerCode] = useState("");
  const [headOfficeAddress, setHeadOfficeAddress] = useState("");
  const [localOfficeAddress, setLocalOfficeAddress] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [city, setcity] = useState("");
  const [contactPerson, setcontactPerson] = useState("");
  const [email, setemail] = useState("");
  const [gstNo, setgstNo] = useState("");
  const [mobileNo, setmobileNo] = useState("");
  const [panNo, setpanNo] = useState("");
  const [teaBoardRegistrationNo, setteaBoardRegistrationNo] = useState("");
  const [ExporterLicenseNo, setExporterLicenseNo] = useState("");
  const [exportType, setexportType] = useState("");

  const [phoneNo, setphoneNo] = useState("");
  const [fax, setfax] = useState("");
  const [entityCode, setentityCode] = useState("");
  const [auctioneerName, setauctioneerName] = useState("");
  const [auctioneerCode, setauctioneerCode] = useState("");
  const [fssaiNo, setfssaiNo] = useState("");
  const [cinNo, setcinNo] = useState("");
  const [taxIdentityNo, settaxIdentityNo] = useState("");
  const [isActive, setisActive] = useState("");
  const [uploadDocumentRemarks, setuploadDocumentRemarks] = useState("");
  const [stateCode, setstateCode] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState([]);
  const [onChangesAuctionCenterId, setOnChangeAuctionCenterId] = useState([]);
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [TNGSTNo, setTNGSTNo] = useState("");
  const [tblState, settblState] = useState("");
  const [yearOfReg, setyearOfReg] = useState("");
  const [userProfileStatus, setuserProfileStatus] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const dispatch = useDispatch();
  const [dataById, setDataById] = useState("");
  const [handleSwitchClick, setHandleSwitchClick] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [optionsForYear, setOptionsForYear] = useState([]);
  const currentYear = moment().year();
  const [expanded, setExpanded] = React.useState("panel1");
  const [showmodal, setShowmodal] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [auctioneerGstDtoList, setauctioneerGstDtoList] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");

  const [showchildmodal, setShowChildmodal] = useState(false);
  const handleCloseChild = () => setShowChildmodal(false);

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [irnEligibility, setIrnEligibility] = useState(0);
  // Update the state with the generated options
  //this.setState({ optionsForYear });
  console.log(childUser, "chil1232");
  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    if (!editingUserData) {
      if (!buyerName.trim()) {
        CustomToast.error("Please enter the buyer name");
        isValid = false;
        return;
      }
      if (!buyerCode.trim()) {
        CustomToast.error("Please enter the buyer code");
        isValid = false;
        return;
      }
      if (!headOfficeAddress.trim()) {
        CustomToast.error("Please enter the Head Office Address");
        isValid = false;
        return;
      }
      if (!localOfficeAddress.trim()) {
        CustomToast.error("Please enter the Local Office Address");
        isValid = false;
        return;
      }
      if (!auctionCenterId) {
        CustomToast.error("Please select an auction center from the list.");
        isValid = false;
        return;
      }
      if (!contactPerson.trim()) {
        CustomToast.error("Please enter the contact person");
        isValid = false;
        return;
      }

      if (!city.trim()) {
        CustomToast.error("Please enter the city");
        isValid = false;
        return;
      }
      if (!teaBoardRegistrationNo.trim()) {
        CustomToast.error("Please enter the Teaboard Reg No.");
        isValid = false;
        return;
      }
      if (!gstNo.trim()) {
        CustomToast.error("Please enter the GSTNo.");
        isValid = false;
        return;
      }
      if (!panNo.trim()) {
        CustomToast.error("Please enter the PANno.");
        isValid = false;
        return;
      }
      if (!fax) {
        CustomToast.error("Please enter a valid fax number.");
        isValid = false;
        return;
      }

      if (!email.trim()) {
        CustomToast.error("Please enter the email ID");
        isValid = false;
        return;
      }
      if (!city.trim()) {
        CustomToast.error("Please enter the city.");
        isValid = false;
        return;
      }
      if (auctioneerGstDtoList == null || auctioneerGstDtoList == []) {
        CustomToast.error("Please enter the GST No");
        isValid = false;
        return;
      }
      if (!mobileNo.trim()) {
        CustomToast.error("Please enter the mobile number");
        isValid = false;
        return;
      }
      if (!phoneNo.trim()) {
        CustomToast.error("Please enter a valid phone number.");
        isValid = false;
        return;
      }
      if (!panNo.trim()) {
        CustomToast.error("Please enter the PANno.");
        isValid = false;
        return;
      }
      if (!stateCode.trim()) {
        CustomToast.error("Please select a state from the dropdown list");
        isValid = false;
        return;
      }
      if (!tblState) {
        CustomToast.error("Please select a state from the dropdown list");
        isValid = false;
        return;
      }
      if (!taxIdentityNo.trim()) {
        CustomToast.error("Please select the taxIdentityNo");
        isValid = false;
        return;
      }
      if (!ExporterLicenseNo.trim()) {
        CustomToast.error("Please enter the Teaboard Exporter License No");
        isValid = false;
        return;
      }
    }
    // if (!editingUserData) {
    //   if (!uploadedDocuments.length && !uploadDocumentRemarks) {
    //   } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
    //     isValid = false;
    //     CustomToast.error("Please enter the remarks");
    //     return;
    //   } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
    //     CustomToast.error("Please upload the document");
    //     return;
    //   }
    // } else {
    // }

    if (!isValid) {
      return;
    }

    const newStateData = {
      buyerName: buyerName,
      buyerCode: buyerCode,
      roleCode: "BUYER",
      auctioneerGstDtoList: auctioneerGstDtoList,
      auctionCenterId: [auctionCenterId],
      auctionCenterDto: [{ auctionCenterId }],
      headOfficeAddress: headOfficeAddress,
      localOfficeAddress: localOfficeAddress,
      contactPerson: contactPerson,
      city: city,
      phoneNo: phoneNo,
      mobileNo: mobileNo,
      yearOfRegistration: yearOfReg,
      email: email,
      fax: fax,
      entityCode: entityCode,
      tngstNo: TNGSTNo,
      teaBoardRegistrationNo: teaBoardRegistrationNo,
      taxIdentityNo: taxIdentityNo,
      teaBoardExporterLicenseNo: ExporterLicenseNo,
      panNo: panNo,
      gstNo: gstNo,
      fssaiNo: fssaiNo,
      stateId: tblState,
      stateCode: stateCode,
      bankAccountStatus: 1,
      sessionUserId: 1,
      downloadDto: uploadedDocuments,
      uploadDocumentRemarks: uploadDocumentRemarks,
      isActive: 1,
    };

    try {
      if (editingUserData) {
        const isFormModified =
          buyerName != editingUserData.buyerName ||
          buyerCode != editingUserData.buyerCode ||
          headOfficeAddress != editingUserData.headOfficeAddress ||
          localOfficeAddress != editingUserData.localOfficeAddress ||
          contactPerson != editingUserData.contactPerson ||
          city != editingUserData.city ||
          phoneNo != editingUserData.phoneNo ||
          mobileNo != editingUserData.mobileNo ||
          email != editingUserData.email ||
          fax != editingUserData.fax ||
          entityCode != editingUserData.entityCode ||
          TNGSTNo != editingUserData.TNGSTNo ||
          teaBoardRegistrationNo != editingUserData.teaBoardRegistrationNo ||
          taxIdentityNo != editingUserData.taxIdentityNo ||
          ExporterLicenseNo != editingUserData.ExporterLicenseNo ||
          panNo != editingUserData.panNo ||
          gstNo != editingUserData.gstNo ||
          fssaiNo != editingUserData.fssaiNo ||
          tblState != editingUserData.tblState ||
          stateCode != editingUserData.stateCode ||
          yearOfReg != editingUserData.yearOfRegistration ||
          uploadDocumentRemarks != editingUserData.uploadDocumentRemarks ||
          auctioneerGstDtoList != editingUserData.auctioneerGstDtoList ||
          isActive != selectedValue;

        if (isFormModified) {
          editingUserData.isActive = selectedValue;
          editingUserData.auctioneerGstDtoList = auctioneerGstDtoList;
          editingUserData.auctionCenterId = [auctionCenterId];
          editingUserData.auctionCenterDto = [{ auctionCenterId }];
          editingUserData.irnEligibility = irnEligibility;
          editingUserData.searchData = {
            userName: buyerName,
            email: email,
            gstNo: gstNo,
            isActive: userProfileStatus,
            panNo: panNo,
            teaBoardRegistrationCertificate: teaBoardRegistrationNo,
            userCode: buyerCode,
            isActive: userProfileStatus,
            roleCode: "BUYER",
            pageNo: pageNo,
            noOfRecords: NO_OF_RECORDS,
          };
          dispatch(updateBuyerAction(editingUserData));
        }
      } else {
        for (let i = 0; i < auctioneerGstDtoList.length; i++) {
          //if selected auction Center & selected state id is same
          if (tblState != "" && auctioneerGstDtoList[i].stateId == tblState) {
            auctioneerGstDtoList[i].gstNo = gstNo;
            auctioneerGstDtoList[i].localOfficeAddress = localOfficeAddress;
          }
        }
        dispatch(createBuyerAction(newStateData));
      }
    } catch (error) {}
  };
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
        Base64ToExcelDownload(getExportViewDataResponse, "BuyerDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "BuyerDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  let createData = useSelector(
    (state) => state.createBuyer.createEditApiStatus
  );
  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiStatusBuyer(false));
      if(isProfile==1){
        dispatch(closemodel(closestatusjpgp + 1));
      }
      setExpanded("panel2");
      clearSearch();
      setEditingUserData(null);
      setEditModal(false);
      setViewModal(false);
    }
  });
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      getBuyer({
        userName: buyerName,
        email: email,
        gstNo: gstNo,
        isActive: userProfileStatus,
        panNo: panNo,
        teaBoardRegistrationCertificate: teaBoardRegistrationNo,
        userCode: buyerCode,
        isActive: userProfileStatus,
        roleCode: "BUYER",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      getBuyer({
        userName: buyerName,
        email: email,
        gstNo: gstNo,
        isActive: userProfileStatus,
        panNo: panNo,
        teaBoardRegistrationCertificate: teaBoardRegistrationNo,
        userCode: buyerCode,
        isActive: userProfileStatus,
        roleCode: "BUYER",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const [loader, setLoader] = useState(false);
  const handleSearch = () => {
    pageNo = 1;
    setRows([]);
    //setgetAllUser([]);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      fetchData();
    }, 1000);
  };
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_UserLogin";
    const moduleName = "Buyer";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };
  const handleChildUserViewClick = (id) => {
    dispatch(getBuyerByIdAction(id));
    // const tableName = "tbl_UserLogin";
    // const moduleName = "Buyer";
    // dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setEditingUserData("");
    setShowChildmodal(true);
  };
  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      userName: buyerName,
      email: email,
      gstNo: gstNo,
      isActive: userProfileStatus,
      panNo: panNo,
      teaBoardRegistrationCertificate: teaBoardRegistrationNo,
      userCode: buyerCode,
      roleCode: "BUYER",
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
        Base64ToExcelDownload(getExportDataResponse, "BuyerDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "BuyerDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });
  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );
  console.log(childUser, "childUser123");

  const handleClose = () => {
    setOpen("");
    resetForm();
    setViewMode(false);
  };
  // const handlesStateNameChange = (e) => {
  //   setstateCode(e.target.options[e.target.selectedIndex].id);
  //   settblState(e.target.value);
  // };
  const setValueData = (data, editingUserData) => {
    setEditingUserData({
      ...editingUserData,
      stateName: data.target.value,
      state: data.target.options[data.target.selectedIndex].id,
      tblState: data.target.options[data.target.selectedIndex].value,
    });
    //setstateCode(data.target.options[data.target.selectedIndex].id);
    //settblState(data.target.value);
    handlesStateNameChange(data);
  };
  const handleClear = () => {
    resetForm();
    setViewMode(false);
    setUploadedDocuments([]);
    const inputElement = document.getElementById("buyerUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    removeFile();
  };
  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const clearSearch = () => {
    setbuyerCode("");
    setbuyerName("");
    setemail("");
    setteaBoardRegistrationNo("");
    setpanNo("");
    setRows([]);
    //setgetAllUser([]);
    pageNo = 1;
    dispatch(
      getBuyer({
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
        roleCode: "BUYER",
        userType: 2,
        isParentId: 0,
      })
    );
  };

  const handleViewClick = (userId) => {
    dispatch(getBuyerByIdAction(userId));
    setViewMode(true);
    // setExpanded("panel1");
    setViewModal(true);
  };

  const handleEditClick = (userId) => {
    setViewMode(false);
    dispatch(getBuyerByIdAction(userId));
    // setExpanded("panel1");
    setEditModal(true);
  };
  const editingUserDataFromAc = useSelector(
    (state) => state.createBuyer.BuyerData.responseData
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
            editingUserDataFromAc.stateId
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
      setEditingUserData(editingUserDataFromAc);
      editingUserDataFromAc.onChangesAuctionCenterId = tempDataNo;
      setSelectedValue(editingUserDataFromAc.isActive || "");
      setbuyerName(editingUserDataFromAc.buyerName || "");
      setbuyerCode(editingUserDataFromAc.buyerCode || "");
      setcity(editingUserDataFromAc.city || "");
      setauctionCenterId(editingUserDataFromAc.auctionCenterId || "");
      setTNGSTNo(editingUserDataFromAc.TNGSTNo || "");
      setcontactPerson(editingUserDataFromAc.contactPerson || "");
      setemail(editingUserDataFromAc.email || "");
      setentityCode(editingUserDataFromAc.entityCode || "");
      setfax(editingUserDataFromAc.fax || "");
      setgstNo(editingUserDataFromAc.gstNo || "");
      setmobileNo(editingUserDataFromAc.mobileNo || "");
      setpanNo(editingUserDataFromAc.panNo || "");
      setphoneNo(editingUserDataFromAc.phoneNo || "");
      setstateCode(editingUserDataFromAc.stateCode || "");
      settblState(editingUserDataFromAc.stateId || "");
      settaxIdentityNo(editingUserDataFromAc.taxIdentityNo || "");
      setteaBoardRegistrationNo(
        editingUserDataFromAc.teaBoardRegistrationNo || ""
      );
      setHeadOfficeAddress(editingUserDataFromAc.headOfficeAddress || "");
      setLocalOfficeAddress(editingUserDataFromAc.localOfficeAddress || "");
      setTNGSTNo(editingUserDataFromAc.tngstNo || "");
      setExporterLicenseNo(
        editingUserDataFromAc.teaBoardExporterLicenseNo || ""
      );
      setauctioneerName(editingUserDataFromAc.auctioneerName || "");
      setauctioneerCode(editingUserDataFromAc.auctioneerCode || "");
      setcinNo(editingUserDataFromAc.cinNo || "");
      setfssaiNo(editingUserDataFromAc.fssaiNo || "");
      setuploadDocumentRemarks(
        editingUserDataFromAc.uploadDocumentRemarks || ""
      );
      setyearOfReg(editingUserDataFromAc.yearOfRegistration || "");
      setUploadedDocuments(editingUserDataFromAc.downloadDto || []);
      setIrnEligibility(editingUserDataFromAc.irnEligibility);
    } else {
      setEditingUserData(editingUserDataFromAc);
      //   dispatch(fetchUser());
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
      //resetForm();
    }
  }, [editingUserDataFromAc]);

  const getAllStateDataResponse = useSelector(
    (state) => state?.state?.getAllStateAsc?.responseData
  );

  const getAllStateData =
    getAllStateDataResponse &&
    getAllStateDataResponse.filter((data) => 1 == data.isActive);

  const getAllAuctionCenterResponse = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  // const getAllAuctionCenter = useSelector(
  //   (state) => state.auctionCenter.getAllAuctionCenter.responseData
  // );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const handleAuctionCenter = (event) => {
    const {
      target: { value, id },
    } = event;

    // setauctionCenterId(value);
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
        getAllAuctionCenter[i].localOfficeAddress =
          getAllAuctionCenter[i].address || "";
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
        getAllAuctionCenter[i].gstNo = getAllAuctionCenter[i].gstNo || "";
        getAllAuctionCenter[i].localOfficeAddress =
          getAllAuctionCenter[i].address || "";
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
          if (data.stateId === stateId) {
            data[key] = value;
          }
          return data;
        });
      setauctioneerGstDtoList(data);
    } else {
      if (key === "localOfficeAddress") {
        setLocalOfficeAddress(value);
      } else if (key === "gstNo") {
        setgstNo(value);
      } else if (key === "headOfficeAddress") {
        setHeadOfficeAddress(value);
      }
    }
  };

  const [rows, setRows] = useState([]);
  // useEffect(() => {
  //   if (getUserData) {
  //     setRows(getUserData);
  //   }
  // // }, [getUserData]);
  // useEffect(() => {
  //   const newRows = getUserData || [];
  //   setRows((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
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

  const handleSahil = () => {
    setShowChildmodal(false);
    handleClear();
  };

  const handleChange = (panel) => (event, isExpanded) => {
    dispatch(
      getBuyer({
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
        userType: 2,
        isParentId: 0,
        roleCode: "BUYER",
      })
    );
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      setViewMode(false);
      dispatch(getBuyerByIdActionSuccess([]));
      setEditingUserData(null);
      resetForm();
    } else if ("panel3" == panel && isExpanded) {
      dispatch(uploadAllDocumentsBuyerAction("BUYER"));
      setViewMode(false);
      dispatch(getBuyerByIdActionSuccess([]));
      setEditingUserData(null);
      resetForm();
    } else if ("panel1" == panel && isExpanded) {
      resetForm();
      setEditingUserData(null);
    }
  };

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.createBuyer &&
      state.createBuyer.uploadedDocuments &&
      state.createBuyer.uploadedDocuments.responseData
  );
  useEffect(() => {
    dispatch(uploadAllDocumentsBuyerAction("BUYER"));
  }, [dispatch]);

  const switchUserDataFromAc = useSelector(
    (state) => state //.createUserDetail.UserData.responseData
  );

  useEffect(() => {
    if (switchUserDataFromAc && handleSwitchClick) {
      const updatedData = {
        ...switchUserDataFromAc,
        isActive: switchUserDataFromAc.isActive === 1 ? 0 : 1,
      };
      setDataById(updatedData);
      //dispatch(getUserByIdActionSuccess([]));
      setHandleSwitchClick(false);
    }
  }, [switchUserDataFromAc]);

  if (dataById != "") {
    const tempData = dataById;
    setDataById("");
    // dispatch(updateUserAction(tempData));
  }

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "userCode",
      title: "Buyer Code",
    },
    {
      name: "contactPersonName",
      title: "User Name",
    },
    {
      name: "userName",
      title: "Company Name",
    },
    {
      name: "teaBoardRegistrationCertificate",
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
  function StatusData(data) {
    const handleSwitchChange = () => {
      setHandleSwitchClick(true);
      //dispatch(getUserByIdAction(data.data.auctionCenterId));
    };

    return (
      <>
        {childUser
          .filter((user) => user.linkId === 22)
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
        <div class="ActionBtn">
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
          <i
            className="fa fa-plus"
            onClick={() => handleChildUserViewClick(data.data.userId)}
          ></i>
        </div>
      </>
    );
  }

  const getUploadedIdData = useSelector(
    (state) => state.documentReducer.documentData.responseData
  );
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
  const handleDownloadClick = (uploadDocumentConfId, type) => {
    setDocumentmode(type);
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };
  function UploadActionData(data) {
    return (
      <div class="ActionBtn">
        {childUser
          .filter((user) => user.linkId === 22)
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
    setLocalOfficeAddress("");
    setcity("");
    setentityCode("");
    setfax("");
    setTNGSTNo("");
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
    setEditingUserData(null);
    setbuyerCode("");
    setbuyerName("");
    setHeadOfficeAddress("");
    setExporterLicenseNo("");
    setyearOfReg("");
    setuploadDocumentRemarks("");
    setauctioneerGstDtoList([]);
    setOnChangeAuctionCenterId([]);
    setIrnEligibility(0);
  };
  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  const handlePaymentClick = (userCode) => {
    dispatch(getPayment(userCode));
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
  const getFormattedYear = (dateString) => {
    if (!dateString) return null;

    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();

    return year;
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
    setViewMode(false);
    dispatch(getBuyerByIdActionSuccess([]));
    setEditingUserData(null);
    resetForm();
  };
  const closestatusjpgp = useSelector((state) => state.createBuyer.closemodel);

  const handleCloseEditModal = () => {
    if(isProfile==1){
      dispatch(closemodel(closestatusjpgp + 1));
    }
    setEditModal(false);
    setViewMode(false);
    dispatch(getBuyerByIdActionSuccess([]));
    setEditingUserData(null);
    resetForm();
  };

  return (
    <>
      {/* Create */}
      {childUser
        .filter((user) => user.linkId === 22)
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
            <Typography>Buyer Registration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="100"
                          value={editingUserData?.buyerName || buyerName}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  buyerName: e.target.value,
                                })
                              : setbuyerName(e.target.value))
                          }
                          disabled={viewMode}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="10"
                          value={editingUserData?.buyerCode || buyerCode}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  buyerCode: e.target.value,
                                })
                              : setbuyerCode(e.target.value))
                          }
                          disabled={viewMode}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Head Office Address</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="500"
                          value={
                            editingUserData?.headOfficeAddress ||
                            headOfficeAddress
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  headOfficeAddress: e.target.value,
                                })
                              : tempAuctionCenterDataChange(
                                  "headOfficeAddress",
                                  e.target.value,
                                  "",
                                  false
                                ))
                          }
                          disabled={viewMode}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Local Office Address</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="500"
                          // value={LocalOfficeAddress}
                          // onChange={(e) =>
                          //   tempAuctionCenterDataChange(
                          //     "localOfficeAddress",
                          //     e.target.value,
                          //     "",
                          //     false
                          //   )
                          value={
                            editingUserData?.localOfficeAddress ||
                            localOfficeAddress
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  localOfficeAddress: e.target.value,
                                })
                              : tempAuctionCenterDataChange(
                                  "localOfficeAddress",
                                  e.target.value,
                                  "",
                                  false
                                ))
                          }
                          disabled={viewMode}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>GST No</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="15"
                          value={gstNo}
                          onChange={(e) =>
                            tempAuctionCenterDataChange(
                              "gstNo",
                              e.target.value,
                              "",
                              false
                            )
                          }
                          disabled={viewMode}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Contact Person Name</label>
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
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Name</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          value={editingUserData?.stateId || tblState}
                          // value={tblState}
                          // onChange={(e) =>handlesStateNameChange(e)}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setValueData(e, editingUserData)
                              : handlesStateNameChange(e))
                          }
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
                          disabled={viewMode}
                        </select>
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
                          // onChange={(e) =>
                          //   !viewMode &&
                          //   (editingUserData
                          //     ? setEditingUserData({
                          //         ...editingUserData,
                          //         stateCode: e.target.value,
                          //       })
                          //     : setstateCode(e.target.value))
                          // }
                          disabled={true}
                        />
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
                      </div>
                    </div>
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
                      </div>
                    </div>
                    {editingUserData != null ? (
                      <>
                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>EntityCode</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editingUserData?.entityCode || entityCode}
                              onChange={(e) =>
                                !viewMode &&
                                (editingUserData
                                  ? setEditingUserData({
                                      ...editingUserData,
                                      entityCode: e.target.value,
                                    })
                                  : setentityCode(e.target.value))
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Year of Registration</label>
                        <select
                          className="form-control select-form"
                          value={
                            getFormattedYear(
                              editingUserData?.yearOfRegistration
                            ) || yearOfReg
                          }
                          id="yor"
                          onChange={(e) =>
                            editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  yearOfRegistration: e.target.value,
                                })
                              : setyearOfReg(e.target.value)
                          }
                          disabled={viewMode}
                        >
                          <option value={0}>Select Year of Registration</option>
                          {optionsForYear?.map((year) => (
                            <option
                              id={year.key}
                              key={year.key}
                              value={year.value}
                            >
                              {year.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>TNGST No.</label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="15"
                          value={editingUserData?.TNGSTNo || TNGSTNo}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  TNGSTNo: e.target.value,
                                })
                              : setTNGSTNo(e.target.value))
                          }
                          disabled={viewMode}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea board registration no.</label>
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
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tax Identification no</label>
                        <label className="errorLabel"> * </label>
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
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea Board Exporter License No.</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="15"
                          value={
                            editingUserData?.ExporterLicenseNo ||
                            ExporterLicenseNo
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  ExporterLicenseNo: e.target.value,
                                })
                              : setExporterLicenseNo(e.target.value))
                          }
                          disabled={viewMode}
                        />
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
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>PAN No</label>
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
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Bank account detail status.</label>
                        <input
                          type="text"
                          className="form-control"
                          value=""
                          onChange={(e) => settaxIdentityNo(e.target.value)}
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FomrGroup">
                        <label>Auction Center</label>
                        <label className="errorLabel"> * </label>

                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          className="w-100"
                          multiple
                          value={onChangesAuctionCenterId}
                          onChange={handleAuctionCenter}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(", ")}
                          disabled={viewMode}
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
                                        maxLength="15"
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
                                      <label>GST No</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        maxLength="15"
                                        value={data.gstNo}
                                        // onChange={}
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
                                        maxLength="500"
                                        value={data.localOfficeAddress}
                                        onChange={(e) =>
                                          tempAuctionCenterDataChange(
                                            "localOfficeAddress",
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

                    {editingUserData != null ? (
                      <>
                        <div className="col-md-12">
                          <div class="RadioGroup">
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
                                    disabled={viewMode}
                                    onChange={(event) =>
                                      handleRadioChange(event)
                                    }
                                  />
                                  <label
                                    class="form-check-label"
                                    for={data.key}
                                  >
                                    {data.key}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      </>
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
                            inputId="buyerUpload"
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
          title={"Edit Buyer"}
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
                    <label>Buyer Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingUserData?.buyerName || buyerName}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              buyerName: e.target.value,
                            })
                          : setbuyerName(e.target.value))
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Buyer Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={editingUserData?.buyerCode || buyerCode}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              buyerCode: e.target.value,
                            })
                          : setbuyerCode(e.target.value))
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Head Office Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="500"
                      value={
                        editingUserData?.headOfficeAddress || headOfficeAddress
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              headOfficeAddress: e.target.value,
                            })
                          : tempAuctionCenterDataChange(
                              "headOfficeAddress",
                              e.target.value,
                              "",
                              false
                            ))
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Local Office Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="500"
                      // value={LocalOfficeAddress}
                      // onChange={(e) =>
                      //   tempAuctionCenterDataChange(
                      //     "localOfficeAddress",
                      //     e.target.value,
                      //     "",
                      //     false
                      //   )
                      value={
                        editingUserData?.localOfficeAddress ||
                        localOfficeAddress
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              localOfficeAddress: e.target.value,
                            })
                          : tempAuctionCenterDataChange(
                              "localOfficeAddress",
                              e.target.value,
                              "",
                              false
                            ))
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>GST No</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
                      value={gstNo}
                      onChange={(e) =>
                        tempAuctionCenterDataChange(
                          "gstNo",
                          e.target.value,
                          "",
                          false
                        )
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Contact Person Name</label>
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
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingUserData?.stateId || tblState}
                      // value={tblState}
                      // onChange={(e) =>handlesStateNameChange(e)}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setValueData(e, editingUserData)
                          : handlesStateNameChange(e))
                      }
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
                      disabled={viewMode}
                    </select>
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
                      // onChange={(e) =>
                      //   !viewMode &&
                      //   (editingUserData
                      //     ? setEditingUserData({
                      //         ...editingUserData,
                      //         stateCode: e.target.value,
                      //       })
                      //     : setstateCode(e.target.value))
                      // }
                      disabled={true}
                    />
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
                  </div>
                </div>
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
                  </div>
                </div>
                {editingUserData != null ? (
                  <>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>EntityCode</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.entityCode || entityCode}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  entityCode: e.target.value,
                                })
                              : setentityCode(e.target.value))
                          }
                          disabled={true}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Year of Registration</label>
                    <select
                      className="form-control select-form"
                      value={
                        getFormattedYear(editingUserData?.yearOfRegistration) ||
                        yearOfReg
                      }
                      id="yor"
                      onChange={(e) =>
                        editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              yearOfRegistration: e.target.value,
                            })
                          : setyearOfReg(e.target.value)
                      }
                      disabled={viewMode}
                    >
                      <option value={0}>Select Year of Registration</option>
                      {optionsForYear?.map((year) => (
                        <option id={year.key} key={year.key} value={year.value}>
                          {year.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>TNGST No.</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
                      value={editingUserData?.TNGSTNo || TNGSTNo}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              TNGSTNo: e.target.value,
                            })
                          : setTNGSTNo(e.target.value))
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Tea board registration no.</label>
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
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Tax Identification no</label>
                    <label className="errorLabel"> * </label>
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
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Tea Board Exporter License No.</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
                      value={
                        editingUserData?.ExporterLicenseNo || ExporterLicenseNo
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              ExporterLicenseNo: e.target.value,
                            })
                          : setExporterLicenseNo(e.target.value))
                      }
                      disabled={viewMode}
                    />
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
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>PAN No</label>
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
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Bank account detail status.</label>
                    <input
                      type="text"
                      className="form-control"
                      value=""
                      onChange={(e) => settaxIdentityNo(e.target.value)}
                      disabled={true}
                    />
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
                      className="w-100"
                      multiple
                      value={onChangesAuctionCenterId}
                      onChange={handleAuctionCenter}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => selected.join(", ")}
                      disabled={viewMode}
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
                                    maxLength="15"
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
                                  <label>GST No</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    maxLength="15"
                                    value={data.gstNo}
                                    // onChange={}
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
                                    maxLength="500"
                                    value={data.localOfficeAddress}
                                    onChange={(e) =>
                                      tempAuctionCenterDataChange(
                                        "localOfficeAddress",
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

                {editingUserData != null ? (
                  <>
                    <div className="col-md-12">
                      <div class="RadioGroup">
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
                                disabled={viewMode}
                                onChange={(event) => handleRadioChange(event)}
                              />
                              <label class="form-check-label" for={data.key}>
                                {data.key}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
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
                        inputId="buyerUpload"
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
          title={"View Associate Auctioneer/Post Auction Associate Auctioneer"}
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
                    <label>Buyer Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      value={editingUserData?.buyerName || buyerName}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              buyerName: e.target.value,
                            })
                          : setbuyerName(e.target.value))
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Buyer Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={editingUserData?.buyerCode || buyerCode}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              buyerCode: e.target.value,
                            })
                          : setbuyerCode(e.target.value))
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Head Office Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="500"
                      value={
                        editingUserData?.headOfficeAddress || headOfficeAddress
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              headOfficeAddress: e.target.value,
                            })
                          : tempAuctionCenterDataChange(
                              "headOfficeAddress",
                              e.target.value,
                              "",
                              false
                            ))
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Local Office Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="500"
                      // value={LocalOfficeAddress}
                      // onChange={(e) =>
                      //   tempAuctionCenterDataChange(
                      //     "localOfficeAddress",
                      //     e.target.value,
                      //     "",
                      //     false
                      //   )
                      value={
                        editingUserData?.localOfficeAddress ||
                        localOfficeAddress
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              localOfficeAddress: e.target.value,
                            })
                          : tempAuctionCenterDataChange(
                              "localOfficeAddress",
                              e.target.value,
                              "",
                              false
                            ))
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>GST No</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
                      value={gstNo}
                      onChange={(e) =>
                        tempAuctionCenterDataChange(
                          "gstNo",
                          e.target.value,
                          "",
                          false
                        )
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Contact Person Name</label>
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
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      value={editingUserData?.stateId || tblState}
                      // value={tblState}
                      // onChange={(e) =>handlesStateNameChange(e)}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setValueData(e, editingUserData)
                          : handlesStateNameChange(e))
                      }
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
                      disabled={viewMode}
                    </select>
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
                      // onChange={(e) =>
                      //   !viewMode &&
                      //   (editingUserData
                      //     ? setEditingUserData({
                      //         ...editingUserData,
                      //         stateCode: e.target.value,
                      //       })
                      //     : setstateCode(e.target.value))
                      // }
                      disabled={true}
                    />
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
                  </div>
                </div>
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
                  </div>
                </div>
                {editingUserData != null ? (
                  <>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>EntityCode</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingUserData?.entityCode || entityCode}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  entityCode: e.target.value,
                                })
                              : setentityCode(e.target.value))
                          }
                          disabled={true}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Year of Registration</label>
                    <select
                      className="form-control select-form"
                      value={
                        getFormattedYear(editingUserData?.yearOfRegistration) ||
                        yearOfReg
                      }
                      id="yor"
                      onChange={(e) =>
                        editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              yearOfRegistration: e.target.value,
                            })
                          : setyearOfReg(e.target.value)
                      }
                      disabled={viewMode}
                    >
                      <option value={0}>Select Year of Registration</option>
                      {optionsForYear?.map((year) => (
                        <option id={year.key} key={year.key} value={year.value}>
                          {year.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>TNGST No.</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
                      value={editingUserData?.TNGSTNo || TNGSTNo}
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              TNGSTNo: e.target.value,
                            })
                          : setTNGSTNo(e.target.value))
                      }
                      disabled={viewMode}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Tea board registration no.</label>
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
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Tax Identification no</label>
                    <label className="errorLabel"> * </label>
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
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Tea Board Exporter License No.</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
                      value={
                        editingUserData?.ExporterLicenseNo || ExporterLicenseNo
                      }
                      onChange={(e) =>
                        !viewMode &&
                        (editingUserData
                          ? setEditingUserData({
                              ...editingUserData,
                              ExporterLicenseNo: e.target.value,
                            })
                          : setExporterLicenseNo(e.target.value))
                      }
                      disabled={viewMode}
                    />
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
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>PAN No</label>
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
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Bank account detail status.</label>
                    <input
                      type="text"
                      className="form-control"
                      value=""
                      onChange={(e) => settaxIdentityNo(e.target.value)}
                      disabled={true}
                    />
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
                      className="w-100"
                      multiple
                      value={onChangesAuctionCenterId}
                      onChange={handleAuctionCenter}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => selected.join(", ")}
                      disabled={viewMode}
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
                                    maxLength="15"
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
                                  <label>GST No</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    maxLength="15"
                                    value={data.gstNo}
                                    // onChange={}
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
                                    maxLength="500"
                                    value={data.localOfficeAddress}
                                    onChange={(e) =>
                                      tempAuctionCenterDataChange(
                                        "localOfficeAddress",
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

                {editingUserData != null ? (
                  <>
                    <div className="col-md-12">
                      <div class="RadioGroup">
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
                                disabled={viewMode}
                                onChange={(event) => handleRadioChange(event)}
                              />
                              <label class="form-check-label" for={data.key}>
                                {data.key}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div className="col-md-12">
                  <div className="BtnGroup">
                    {childUser
                      .filter((user) => user.linkId === 22)
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
                    {childUser
                      .filter((user) => user.linkId === 22)
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
      {childUser
        .filter((user) => user.linkId === 22)
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
            <Typography>Manage Buyer User Registration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Code</label>
                        <input
                          type="text"
                          className="form-control"
                          value={buyerCode}
                          onChange={(e) => setbuyerCode(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={buyerName}
                          onChange={(e) => setbuyerName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea Board Registration Certificate Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={teaBoardRegistrationNo}
                          onChange={(e) =>
                            setteaBoardRegistrationNo(e.target.value)
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
                          value={email}
                          onChange={(e) => setemail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>PAN Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={panNo}
                          onChange={(e) => setpanNo(e.target.value)}
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
                        {childUser
                          .filter((user) => user.linkId === 22)
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
                        {childUser
                          .filter((user) => user.linkId === 22)
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
                <div className="col-lg-12 mt-4">
                  <div className="TableBox CreateStateMaster">
                    {/* <TableComponent
                    columns={columns}
                    // setColumns={setColumns}
                    // rows={rows}
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
                  /> */}
                    <div className="TableBox">
                      <table className="table">
                        <thead>
                          <tr>
                            <th rowSpan={2}>Sr.</th>
                            <th rowSpan={2}>Buyer Code</th>
                            <th rowSpan={2}>Contact Name</th>
                            <th rowSpan={2}>Buyer Name</th>
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
                                    {childUser
                                      .filter((user) => user.linkId === 22)
                                      ?.map((ele) => ele.rightIds)
                                      ?.at(0)
                                      ?.includes("2") && (
                                      <Tooltip title="Edit" placement="top">
                                        <i
                                          className="fa fa-edit"
                                          onClick={() =>
                                            handleEditClick(row.userId)
                                          }
                                        ></i>
                                      </Tooltip>
                                    )}
                                    {childUser
                                      .filter((user) => user.linkId === 22)
                                      ?.map((ele) => ele.rightIds)
                                      ?.at(0)
                                      ?.includes("3") && (
                                      <Tooltip title="View" placement="top">
                                        <i
                                          className="fa fa-eye"
                                          onClick={() =>
                                            handleViewClick(row.userId)
                                          }
                                        ></i>
                                      </Tooltip>
                                    )}
                                    {childUser
                                      .filter((user) => user.linkId === 22)
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

                                    {childUser.some(
                                      (user) => user.linkId === 23
                                    ) && (
                                      <i
                                        className="fa fa-plus"
                                        onClick={() =>
                                          handleChildUserViewClick(row.userId)
                                        }
                                      ></i>
                                    )}

                                    {/* <i
                                  className="fa fa-cc-paypal"
                                  onClick={() =>
                                    handlePaymentClick(row.userCode)
                                  }
                                ></i> */}
                                    {1 == row.bankAccountStatus ? (
                                      <Tooltip
                                        title="Register With Bank"
                                        placement="top"
                                      >
                                        <form
                                          action="https://demo.b2biz.co.in/TeaBoard/ws/registerBankInfo"
                                          method="post"
                                        >
                                          <input
                                            type="hidden"
                                            name="walletClientCode"
                                            value="WT-1001"
                                          />

                                          <input
                                            type="hidden"
                                            name="walletRequestMessage"
                                            value={row.walletRequestMessage}
                                          />

                                          <i
                                            className="fa fa-cc-paypal"
                                            type="submit"
                                          />
                                        </form>
                                      </Tooltip>
                                    ) : (
                                      ""
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
                  </div>
                </div>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Upload Document*/}
      {childUser
        .filter((user) => user.linkId === 22)
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
                    title: "Buyer Name",
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
                // rows={rows}
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

      {/* Child */}
      {showchildmodal && (
        <Modals
          title={
            "Add Associate Buyer/Post Auction Associate Buyer Registration"
          }
          show={showchildmodal}
          // onHide={handleCloseChild}
          size="xl"
          centered
          handleClose={() => handleSahil()}
        >
          <CreateChildUserBuyerRegistration
            isProfile={isProfile}
            childUser={childUser}
            editData={editingUserData}
            showchildmodal1={showchildmodal}
          ></CreateChildUserBuyerRegistration>
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

export default BuyerRegistration;
