import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import TableComponent from "../../components/tableComponent/TableComponent";
import moment from "moment";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import CreateChildUserBuyerRegistration from "../CreateChildUserBuyerRegistration/CreateChildUserBuyerRegistration";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import CustomToast from "../../components/Toast";
import {
  //fetchUser,
  createBuyerAction,
  getBuyer,
  getBuyerByIdAction,
  updateBuyerAction,
  //   updateUserAction,
  //   getUserByIdAction,
  //   getUserByIdActionSuccess,
  getAllAuctionCenterAction,
  getAllStateAction,
  //   searchUserAction,
  uploadAllDocumentsBuyerAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  getBuyerByIdActionSuccess,
  createEditApiStatusBuyer,
  getPayment,
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

function BuyerRegistration({ open, setOpen }) {
  const getUserData = useSelector(
    (state) => state.createBuyer.getBuyer.responseData
  );
  useEffect(() => {
    dispatch(
      getBuyer({
        userType: 2,
        isParentId: 0,
      })
    );
  }, [getBuyer]);

  useEffect(() => {
    let yearObj = {};
    for (let i = 1980; i <= currentYear; i++) {
      yearObj = {};
      yearObj.key = i;
      yearObj.value = i;

      optionsForYear.push(yearObj);
    }
    setOptionsForYear(optionsForYear);
  }, []);

  const [selectedValue, setSelectedValue] = useState("Option 1");
  const [editingUserData, setEditingUserData] = useState(null);
  const [buyerName, setbuyerName] = useState("");
  const [buyerCode, setbuyerCode] = useState("");
  const [HeadOfficeAddress, setHeadOfficeAddress] = useState("");
  const [LocalOfficeAddress, setLocalOfficeAddress] = useState("");

  const [city, setcity] = useState("");
  const [contactPerson, setcontactPerson] = useState("");
  const [email, setemail] = useState("");
  const [gstNo, setgstNo] = useState("");
  const [mobileNo, setmobileNo] = useState("");
  const [panNo, setpanNo] = useState("");
  const [teaBoardRegistrationNo, setteaBoardRegistrationNo] = useState("");
  const [ExporterLicenseNo, setExporterLicenseNo] = useState("");

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
  const [auctionCenterId, setauctionCenterId] = useState("");
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
  const [uploadDocumentError, setUploadDocumentError] = useState("");

  const [showchildmodal, setShowChildmodal] = useState(false);
  const handleCloseChild = () => setShowChildmodal(false);

  // Update the state with the generated options
  //this.setState({ optionsForYear });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!buyerName.trim()) {
      CustomToast.error("Please Buyer name");
      isValid = false;
    }
    if (!buyerCode.trim()) {
      CustomToast.error("Please Buyer Code");
      isValid = false;
    }
    if (!HeadOfficeAddress.trim()) {
      CustomToast.error("Please Head Office Address");
      isValid = false;
    }

    if (!auctionCenterId) {
      CustomToast.error(
        "Please select an auction center from the dropdown menu."
      );
      isValid = false;
    }

    if (!contactPerson.trim()) {
      CustomToast.error("Please enter the contact person");
      isValid = false;
    }

    if (!city.trim()) {
      CustomToast.error("Please enter the city");
      isValid = false;
    }

    if (!email.trim()) {
      CustomToast.error("Please enter the email ID");
      isValid = false;
    }
    if (auctioneerGstDtoList == null || auctioneerGstDtoList == []) {
      CustomToast.error("Please enter the GSTNo");
      isValid = false;
    }
    if (!mobileNo.trim()) {
      CustomToast.error("Please enter the mobile number");
      isValid = false;
    }
    if (!panNo.trim()) {
      CustomToast.error("Please enter the PANno");
      isValid = false;
    }
    if (!stateCode.trim()) {
      CustomToast.error("Please enter the contact person address");
      isValid = false;
    }
    if (!tblState) {
      CustomToast.error("Please select a state from the dropdown list");
      isValid = false;
    }
    if (!taxIdentityNo.trim()) {
      CustomToast.error("Please select taxIdentityNo");
      isValid = false;
    }
    if (!ExporterLicenseNo.trim()) {
      CustomToast.error("Please select ExporterLicenseNo");
      isValid = false;
    }
    if (!editingUserData) {
      if (!uploadedDocuments.length && !uploadDocumentRemarks) {
      } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
        CustomToast.error("Remarks is required");
        isValid = false;
      } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
        CustomToast.error("Upload Document is required");
      }
    } else {
    }

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
      headOfficeAddress: HeadOfficeAddress,
      localOfficeAddress: LocalOfficeAddress,
      contactPerson: contactPerson,
      city: city,
      phoneNo: phoneNo,
      mobileNo: mobileNo,
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
          HeadOfficeAddress != editingUserData.HeadOfficeAddress ||
          LocalOfficeAddress != editingUserData.LocalOfficeAddress ||
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
          yearOfReg != editingUserData.yearOfReg ||
          uploadDocumentRemarks != editingUserData.uploadDocumentRemarks ||
          auctioneerGstDtoList != editingUserData.auctioneerGstDtoList ||
          isActive != selectedValue;

        if (isFormModified) {
          dispatch(updateBuyerAction(editingUserData));
        }
      } else {
        for (let i = 0; i < auctioneerGstDtoList.length; i++) {
          //if selected auction Center & selected state id is same
          if (tblState != "" && auctioneerGstDtoList[i].stateId == tblState) {
            auctioneerGstDtoList[i].gstNo = gstNo;
            auctioneerGstDtoList[i].localOfficeAddress = LocalOfficeAddress;
          }
        }
        dispatch(createBuyerAction(newStateData));
      }
    } catch (error) {}
  };
  let createData = useSelector(
    (state) => state.createBuyer.createEditApiStatus
  );
  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiStatusBuyer(false));
      setExpanded("panel2");
      clearSearch();
      setEditingUserData(null);
    }
  });
  const handleSearch = () => {
    dispatch(
      getBuyer({
        userName: buyerName,
        email: email,
        gstNo: gstNo,
        isActive: userProfileStatus,
        panNo: panNo,
        teaBoardRegistrationCertificate: teaBoardRegistrationNo,
        userCode: buyerCode,
        isActive: isActive,
        roleCode: "BUYER",
      })
    );
  };
  const handleHistoryViewClick = (id) => {
    const tableName = "tbl_UserLogin";
    const moduleName = "Buyer";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodal(true);
  };
  const handlePaymentClick = (userCode) => {
    dispatch(getPayment(userCode));
  };
  const handleChildUserViewClick = (id) => {
    dispatch(getBuyerByIdAction(id));
    // const tableName = "tbl_UserLogin";
    // const moduleName = "Buyer";
    // dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setEditingUserData("");
    setShowChildmodal(true);
  };

  const getHistoryIdData = useSelector(
    (state) => state.documentReducer.historyData.responseData
  );

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
    dispatch(getBuyer({ roleCode: "BUYER", userType: 2, isParentId: 0 }));
  };

  const handleViewClick = (userId) => {
    dispatch(getBuyerByIdAction(userId));
    setViewMode(true);
    setExpanded("panel1");
  };

  const handleEditClick = (userId) => {
    setViewMode(false);
    dispatch(getBuyerByIdAction(userId));
    setExpanded("panel1");
  };
  const editingUserDataFromAc = useSelector(
    (state) => state.createBuyer.BuyerData.responseData
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
          editingUserDataFromAc.stateId != "" &&
          editingUserDataFromAc.auctioneerGstDtoList[i].stateId ==
            editingUserDataFromAc.stateId
        ) {
          editingUserDataFromAc.auctioneerGstDtoList[i].statePresent = true;
          states.push(editingUserDataFromAc.auctioneerGstDtoList[i].stateId);
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

      setEditingUserData(editingUserDataFromAc);
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
    } else {
      setEditingUserData(editingUserDataFromAc);
      //   dispatch(fetchUser());
      dispatch(getAllAuctionCenterAction());
      dispatch(getAllStateAction());
      //resetForm();
    }
  }, [editingUserDataFromAc]);

  const getAllStateData = useSelector(
    (state) => state.state.getAllState.responseData
  );

  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter.getAllAuctionCenter.responseData
  );

  // const getAllAuctionCenter = useSelector(
  //   (state) => state.auctionCenter.getAllAuctionCenter.responseData
  // );

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
          if (data.stateId == stateId) {
            data[key] = value;
          }
          return data;
        });
      setauctioneerGstDtoList(data);
    } else {
      if ("address" == key) {
        setLocalOfficeAddress(value);
      } else if ("gstNo" == key) {
        setgstNo(value);
      }
    }
  };

  const [rows, setRows] = useState(data);
  useEffect(() => {
    if (getUserData) {
      setRows(getUserData);
    }
  }, [getUserData]);

  const handleSahil = () => {
    setShowChildmodal(false);
    handleClear();
  };

  const handleChange = (panel) => (event, isExpanded) => {
    dispatch(getBuyer({ userType: 2, isParentId: 0, roleCode: "BUYER" }));
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
              <td>${data.data.phoneNo}</td>
              <td>${data.data.mobileNo}</td>
              <td>${data.data.email}</td>
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
              <td>${data.data.gstNo}</td>
              <td>${data.data.panNo}</td>
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
          <i>
            <button
              className="SubmitBtn"
              onClick={() => handleChildUserViewClick(data.data.userId)}
            ></button>
          </i>
          <i
            className="fa fa-cc-paypal"
            onClick={() => handlePaymentClick(row.userCode)}
          ></i>
        </div>
      </>
    );
  }

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
  const handleDownloadClick = (uploadDocumentConfId) => {
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
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
    setauctioneerGstDtoList([]);
  };
  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
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
      <Modals
        title={"Buyer Registartion"}
        show={open === "BuyerRegistartion" ? true : false}
        handleClose={() => setOpen("")}
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
                ? "View Buyer"
                : editingUserData
                ? "Edit Buyer"
                : "Buyer Registrtion"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Name</label>
                        <input
                          type="text"
                          className="form-control"
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
                          maxLength="50"
                          disabled={viewMode}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Buyer Code</label>
                        <input
                          type="text"
                          className="form-control"
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
                        <input
                          type="text"
                          className="form-control"
                          value={
                            editingUserData?.HeadOfficeAddress ||
                            HeadOfficeAddress
                          }
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserData
                              ? setEditingUserData({
                                  ...editingUserData,
                                  HeadOfficeAddress: e.target.value,
                                })
                              : setHeadOfficeAddress(e.target.value))
                          }
                          disabled={viewMode}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Contact Person Name</label>
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
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>State Name</label>
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
                      </div>
                    </div>
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
                    {editingUserData != null ? (
                      <>
                        <div className="col-md-4">
                          <div className="FormGroup">
                            <label>Year of Registration</label>
                            <select
                              className="form-control select-form"
                              value={editingUserData?.setyearOfReg || yearOfReg}
                              id="yor"
                              onChange={(e) =>
                                !viewMode && setyearOfReg(e.target.value)
                              }
                            >
                              <option value={0}>
                                Select Year of Registration
                              </option>
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
                            disabled={viewMode}
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>TNGST No.</label>
                        <input
                          type="text"
                          className="form-control"
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
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tax Identification no</label>
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
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Tea Board Exporter License No.</label>
                        <input
                          type="text"
                          className="form-control"
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
                        <label>PANno</label>
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
                        <label>Auction center</label>
                        <Form.Group controlId="my_multiselect_field">
                          <Form.Control
                            as="select"
                            multiple
                            value={auctionCenterId}
                            onChange={(e) =>
                              handleAuctionCenter(
                                [].slice
                                  .call(e.target.selectedOptions)
                                  .map((item) => item.value)
                              )
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
                      </div>
                    </div>

                    {auctioneerGstDtoList && auctioneerGstDtoList.length > 0 ? (
                      <div className="GSTBox">
                        {auctioneerGstDtoList &&
                          auctioneerGstDtoList.map((data, index) => (
                            <>
                              {!data.statePresent ? (
                                // <>
                                //   <div className="col-md-3">
                                //     <div className="FormGroup">
                                //       <label>GSTNo</label>
                                //       <input
                                //         type="text"
                                //         className="form-control"
                                //         value={data.gstNo}
                                //         // onChange={}
                                //         disabled={viewMode}
                                //         onChange={(e) =>
                                //           tempAuctionCenterDataChange(
                                //             "gstNo",
                                //             e.target.value,
                                //             data.stateId
                                //           )
                                //         }
                                //       />
                                //     </div>
                                //   </div>
                                //   <div className="col-md-3">
                                //     <div className="FormGroup">
                                //       <label>Address</label>
                                //       <input
                                //         type="text"
                                //         className="form-control"
                                //         value={data.localOfficeAddress}
                                //         onChange={(e) =>
                                //           tempAuctionCenterDataChange(
                                //             "localOfficeAddress",
                                //             e.target.value,
                                //             data.stateId
                                //           )
                                //         }
                                //         disabled={viewMode}
                                //       />
                                //     </div>
                                //   </div>
                                // </><>
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
                                        // onChange={}
                                        disabled={viewMode}
                                        onChange={(e) =>
                                          tempAuctionCenterDataChange(
                                            "gstNo",
                                            e.target.value,
                                            data.stateId
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
                                        value={data.localOfficeAddress}
                                        onChange={(e) =>
                                          tempAuctionCenterDataChange(
                                            "localOfficeAddress",
                                            e.target.value,
                                            data.stateId
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
                    {!viewMode ? (
                      <div className="col-md-12">
                        <div className="BtnGroup">
                          <button
                            className="SubmitBtn"
                            onClick={handleSubmit}
                            disabled={viewMode}
                          >
                            {viewMode
                              ? "View Mode"
                              : editingUserData
                              ? "Update"
                              : "Submit"}
                          </button>
                          <button className="Clear" onClick={handleClear}>
                            {viewMode ? "Exit from View Mode" : "Clear"}
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
            <Typography>Manage User Registration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>User Code</label>
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
                        <label>User Name</label>
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
                        <label>Email Id</label>
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
                        <label>Tea Board Registration certificate</label>
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
                    {auctioneerGstDtoList &&
                      auctioneerGstDtoList.map((data, index) => (
                        <>
                          {!data.statePresent ? (
                            <>
                              <div className="col-md-4">
                                <div className="FormGroup">
                                  <label>{data.stateName} GSTNo</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={data.gstNo}
                                    // onChange={}
                                    disabled={viewMode}
                                    onChange={(e) =>
                                      tempAuctionCenterDataChange(
                                        "gstNo",
                                        e.target.value,
                                        data.stateId
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-md-4">
                                <div className="FormGroup">
                                  <label>{data.stateName} Address</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={data.localOfficeAddress}
                                    onChange={(e) =>
                                      tempAuctionCenterDataChange(
                                        "address",
                                        e.target.value,
                                        data.stateId
                                      )
                                    }
                                    disabled={viewMode}
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      ))}
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>PAN No</label>
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
                  <div className="TableBox CreateStateMaster Buyer">
                    <TableComponent
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
                  documentUploadTime: new Date(
                    row.documentUploadTime
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  }),
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
      </Modals>

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
          // onHide={handleCloseChild}
          size="xl"
          centered
          handleClose={() => handleSahil()}
        >
          <CreateChildUserBuyerRegistration
            editData={editingUserData}
            showchildmodal1={showchildmodal}
          ></CreateChildUserBuyerRegistration>
        </Modals>
      )}
    </>
  );
}

export default BuyerRegistration;
