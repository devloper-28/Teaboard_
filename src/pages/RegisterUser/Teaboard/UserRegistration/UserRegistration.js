import React, { useState, useEffect } from "react";
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
  getExportData,
  getExportDataApiCall,
  getAllAuctionCenterAscAction,
  getAllStateAscAction,
  getExportDataForView,
  getExportDataForViewApiCall,
  getDocumentByIdActionSuccess,
  closemodel,
} from "../../../../store/actions";
import $ from "jquery";

import { ThreeDots } from "react-loader-spinner";
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
import Modals from "../../../../components/common/Modal";
import { uploadedFileDownload } from "../../../uploadDocument/UploadedFileDownload";
import UploadMultipleDocuments from "../../../uploadDocument/UploadMultipleDocuments";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import CustomToast from "../../../../components/Toast";
import { Card, Modal } from "react-bootstrap";
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

function UserRegistration({ open, setOpen, isProfile, modalRight }) {
  const getTeaData = useSelector(
    (state) => state.User?.getAllUserActionSuccess?.responseData
  );
  const [loader, setLoader] = useState(false);
  const [documentMode, setDocumentmode] = useState("");
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
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
  const [exportViewType, setexportViewType] = useState("");
  const [teaBoardUserCode, setteaBoardUserCode] = useState("");
  const [email, setemail] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState([]);
  const [onChangesAuctionCenterId, setOnChangeAuctionCenterId] = useState([]);
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
  const [exportType, setexportType] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.User &&
      state.User.uploadedDocuments &&
      state.User.uploadedDocuments.responseData
  );
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadDocumentError("");
    setRemarksError("");

    let isValid = true;
    if (!teaBoardUserCode.trim()) {
      CustomToast.error("Please enter the TEA BOARD USER Code");
      isValid = false;
      return;
    }
    if (!auctionCenterId) {
      CustomToast.error("Please select an auction center from the list Box.");
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
      CustomToast.error("Please enter the CONTACT PERSON NAME");
      isValid = false;
      return;
    }

    if (!fax.trim()) {
      CustomToast.error("Please enter a valid fax number.");
      isValid = false;
      return;
    }
    if (!email.trim()) {
      CustomToast.error("Please enter the email ID");
      isValid = false;
      return;
    }
    // if (!gstNo) {
    //   CustomToast.error("Please enter the GSTNo");
    //   isValid = false;
    //   return;
    // }
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
      CustomToast.error("Please enter a valid phone number.");
      isValid = false;
      return;
    }
    if (!stateCode.trim()) {
      CustomToast.error("Please select a state from the dropdown list");
      isValid = false;
      return;
    }
    // if (!stateId) {
    //   CustomToast.error("Please select a state from the dropdown list");
    //   isValid = false;
    //   return;
    // }

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
      uploadDocumentRemarks: uploadDocumentRemarks,
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
          editingUserRggData.searchData = {
            userCode: searchUserCode,
            userName: searchUserName,
            email: SearchEmail,
            gstNo: SearchGstNumber,
            panNo: SearchPanNumber,
            // teaBoardRegistrationCertificate: SearchRegistrationCertificate,
            roleCode: "TEABOARDUSER",
            isActive: userProfileStatus,
            pageNo: pageNo,
            noOfRecords: NO_OF_RECORDS,
          };
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
      setEditModal(false);
      setViewModal(false);
      if(isProfile==1){
        dispatch(closemodel(closestatusjpgp + 1));
      }
    }
  });
  useEffect(() => {
    if (isProfile == 1) {
      handleEditClick(atob(sessionStorage.getItem("argument2")));
    }
  }, []);
  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      userCode: searchUserCode,
      userName: searchUserName,
      email: SearchEmail,
      gstNo: SearchGstNumber,
      panNo: SearchPanNumber,
      isActive: userProfileStatus,
      // teaBoardRegistrationCertificate: SearchRegistrationCertificate,
      roleCode: "TEABOARDUSER",
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
  const handleChanges = (event) => {
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
  };
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = editingUserRggDataFromAc && editingUserRggDataFromAc.userId;
    let searchData = {
      url: `/admin/teaboarduser/get/${id}/${exportType}`,
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
          "TeaboardDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "TeaboardDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const getExportDataApiCallResponse = useSelector(
    (state) => state.documentReducer.exportDataApiCall
  );

  useEffect(() => {
    if (getExportDataResponse != null && true == getExportDataApiCallResponse) {
      dispatch(getExportDataApiCall(false));
      if ("excel" == exportType) {
        Base64ToExcelDownload(getExportDataResponse, "TeaboardDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "TeaboardDetails.pdf",
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
      searchUserRggAction({
        userCode: searchUserCode,
        userName: searchUserName,
        email: SearchEmail,
        gstNo: SearchGstNumber,
        panNo: SearchPanNumber,
        // teaBoardRegistrationCertificate: SearchRegistrationCertificate,
        roleCode: "TEABOARDUSER",
        isActive: userProfileStatus,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  const fetchData = () => {
    dispatch(
      searchUserRggAction({
        userCode: searchUserCode,
        userName: searchUserName,
        email: SearchEmail,
        gstNo: SearchGstNumber,
        panNo: SearchPanNumber,
        // teaBoardRegistrationCertificate: SearchRegistrationCertificate,
        roleCode: "TEABOARDUSER",
        isActive: userProfileStatus,
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

  const searchTeaData = useSelector(
    (state) => state.User?.searchResults?.responseData
  );

  const setValueData = (data, editingUserRggData) => {
    seteditingUserRggData({
      ...editingUserRggData,
      stateName: data.target.value,
      stateId: data.target.options[data.target.selectedIndex].value,
      stateCode: data.target.options[data.target.selectedIndex].id,
    });
  };

  const handlesStateNameChange = (e) => {
    setstateCode(e.target.options[e.target.selectedIndex].id);
    settblState(e.target.value);
  };
  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    const inputElement = document.getElementById("teaboardUpload");
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
    setuserProfileStatus("");
    setRows([]);
    //setgetAllUser([]);
    pageNo = 1;
    dispatch(
      searchUserRggAction({
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
        roleCode: "TEABOARDUSER",
        isActive,
      })
    );
    setRows(getAllUserRgg);
  };

  const handleViewClick = (userId) => {
    dispatch(getUserRggByIdAction(userId));
    setViewMode(true);
    // setExpanded("panel1");
    setViewModal(true);
  };

  const handleEditClick = (userId) => {
    setViewMode(false);
    dispatch(getUserRggByIdAction(userId));
    // setExpanded("panel1");
    setEditModal(true);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    if ("panel2" == panel && isExpanded) {
      dispatch(
        searchUserRggAction({
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
          roleCode: "TEABOARDUSER",
          isActive,
        })
      );
      // clearSearch();
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
  useEffect(
    (event) => {
      if (editingUserRggDataFromAc) {
        let tempDataName = [];
        getAllAuctionCenter &&
          getAllAuctionCenter.map((auctionCenterData, auctioncenterIndex) => {
            if (
              editingUserRggDataFromAc.auctionCenterId.includes(
                auctionCenterData.auctionCenterId
              )
            ) {
              tempDataName.push(auctionCenterData.auctionCenterName.toString());
            }
          });
        setOnChangeAuctionCenterId(tempDataName);
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
    },
    [editingUserRggDataFromAc]
  );

  const getAllStateDataResponse = useSelector(
    (state) => state?.state?.getAllStateAsc?.responseData
  );

  const getAllStateData =
    getAllStateDataResponse &&
    getAllStateDataResponse.filter((data) => 1 == data.isActive);

  const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   if (searchTeaData != null && searchTeaData != undefined) {
  //     setGetAllUserRgg(searchTeaData);
  //     setRows(searchTeaData);
  //   } else {
  //     setGetAllUserRgg([]);
  //     setRows([]);
  //   }
  // }, [searchTeaData]);
  // useEffect(() => {
  //   const newRows = searchTeaData || [];
  //   setRows((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
  // }, [searchTeaData]);

  useEffect(() => {
    const newRows = searchTeaData || [];
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
  }, [searchTeaData]);

  // const columns = [
  //   {
  //     name: "index",
  //     title: "Sr.",
  //   },
  //   {
  //     name: "userName",
  //     title: "Company Name",
  //   },
  //   // {
  //   //   name: "teaBoardRegistrationCertificate",
  //   //   title: "Tea Board Certificate Number",
  //   // },
  //   {
  //     name: "contactDetails",
  //     title: "Contact Details",
  //     getCellValue: (rows) => <ContactDetails data={rows} />,
  //   },
  //   {
  //     name: "taxDetail",
  //     title: "TAX Details",
  //     getCellValue: (rows) => <TaxDetail data={rows} />,
  //   },
  //   {
  //     name: "action",
  //     title: "Action",
  //     getCellValue: (rows) => <ActionData data={rows} />,
  //   },
  // ];

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
    setauctionCenterId([]);
    setOnChangeAuctionCenterId([]);
    setcity("");
    setteaBoardUserCode("");
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
    setuploadDocumentRemarks("");
    const inputElement = document.getElementById("teaBoardUpload");
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

  // function ActionData(data) {
  //   return (
  //     <>
  //       <div class="Action">
  //         {modalRight
  //           ?.map((ele) => ele.rightIds)
  //           ?.at(0)
  //           ?.includes("2") && (
  //           <i
  //             className="fa fa-edit"
  //             onClick={() => handleEditClick(data.data.userId)}
  //           ></i>
  //         )}
  //         {modalRight
  //           ?.map((ele) => ele.rightIds)
  //           ?.at(0)
  //           ?.includes("3") && (
  //           <i
  //             className="fa fa-eye"
  //             onClick={() => handleViewClick(data.data.userId)}
  //           ></i>
  //         )}
  //         {modalRight
  //           ?.map((ele) => ele.rightIds)
  //           ?.at(0)
  //           ?.includes("4") && (
  //           <i
  //             className="fa fa-history"
  //             onClick={() => {
  //               handleHistoryViewClick(data.data.userId);
  //             }}
  //           ></i>
  //         )}
  //       </div>
  //     </>
  //   );
  // }

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
      searchUserRggAction({
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
        roleCode: "TEABOARDUSER",
        isActive,
      })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getUserRggByIdActionSuccess([]));
    seteditingUserRggData(null);
    resetForm();
  };
  const closestatusjpgp = useSelector((state) => state.createBuyer.closemodel);
  const handleCloseEditModal = () => {
    if(isProfile==1){
      dispatch(closemodel(closestatusjpgp + 1));
    }
    setEditModal(false);
    dispatch(
      searchUserRggAction({
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
        roleCode: "TEABOARDUSER",
        isActive,
      })
    );
    // clearSearch();
    setViewMode(false);
    dispatch(getUserRggByIdActionSuccess([]));
    seteditingUserRggData(null);
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
            <Typography>Create TeaBoard Registration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Contact Person Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="50"
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
                        />
                        {contactPersonNameError && (
                          <p className="errorLabel">{contactPersonNameError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>TB User Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="10"
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
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          className="w-100"
                          value={onChangesAuctionCenterId}
                          onChange={handleChanges}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(", ")}
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
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Address</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength="500"
                          value={editingUserRggData?.address || address}
                          onChange={(e) =>
                            editingUserRggData
                              ? seteditingUserRggData({
                                  ...editingUserRggData,
                                  address: e.target.value,
                                })
                              : setaddress(e.target.value)
                          }
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
                          type="number"
                          className="form-control"
                          maxLength="15"
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
                        />
                        {phoneNoError && (
                          <p className="errorLabel">{phoneNoError}</p>
                        )}
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
                        />
                        {mobileNoError && (
                          <p className="errorLabel">{mobileNoError}</p>
                        )}
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
                        />
                        {faxError && <p className="errorLabel">{faxError}</p>}
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
                        />
                        {panNoError && (
                          <p className="errorLabel">{panNoError}</p>
                        )}
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
                        />
                        {gstNoError && (
                          <p className="errorLabel">{gstNoError}</p>
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
                          value={editingUserRggData?.stateId || stateId}
                          onChange={(e) =>
                            !viewMode &&
                            (editingUserRggData
                              ? setValueData(e, editingUserRggData)
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
                            inputId="teaBoardUpload"
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
          title={"Edit TeaBoard Registration"}
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
                    <label>Contact Person Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={
                        editingUserRggData?.teaBoardUserCode || teaBoardUserCode
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
                    <label className="errorLabel"> * </label>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      className="w-100"
                      value={onChangesAuctionCenterId}
                      onChange={handleChanges}
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
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="500"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
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
                    <label>GST No</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="15"
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
                    <label>Email ID</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
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
                    <label className="errorLabel"> * </label>
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
                    <label className="errorLabel"> * </label>
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
                        inputId="teaBoardUpload"
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
          title={"View TeaBoard Registration"}
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
                    <label>Contact Person Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      value={
                        editingUserRggData?.contactPersonName ||
                        contactPersonName
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="10"
                      value={
                        editingUserRggData?.teaBoardUserCode || teaBoardUserCode
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
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      className="w-100"
                      value={onChangesAuctionCenterId}
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
                <div className="col-md-4">
                  <div className="FormGroup">
                    <label>Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="500"
                      value={editingUserRggData?.address || address}
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
                      type="number"
                      className="form-control"
                      maxLength="15"
                      value={editingUserRggData?.phoneNo || phoneNo}
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
                      value={editingUserRggData?.mobileNo || mobileNo}
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
                    <label className="errorLabel"> * </label>
                    <input
                      type="number"
                      className="form-control"
                      maxLength="15"
                      value={editingUserRggData?.fax || fax}
                      disabled={viewMode}
                    />
                    {faxError && <p className="errorLabel">{faxError}</p>}
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
                      value={editingUserRggData?.panNo || panNo}
                      disabled={viewMode}
                    />
                    {panNoError && <p className="errorLabel">{panNoError}</p>}
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
                      value={editingUserRggData?.gstNo || gstNo}
                      disabled={viewMode}
                    />
                    {gstNoError && <p className="errorLabel">{gstNoError}</p>}
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
                      value={editingUserRggData?.email || email}
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
                      value={editingUserRggData?.city || city}
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
                      value={editingUserRggData?.stateId || stateId}
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
                    <label className="errorLabel"> * </label>
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
                                selectedValue == data.value ? true : false
                              }
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
            <Typography>Manage TeaBoard Registration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row align-items-end">
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>Teaboard Code</label>
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
                        <label>Contact Name</label>
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
                  </div> */}
                    <div className="col-md-4">
                      <div className="FormGroup">
                        <label>GST Number</label>
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
                        <label> PAN Number</label>
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

              {/* <div className="row">
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
                      <th rowSpan={2}>Teaboard Code</th>
                      <th rowSpan={2}>Contact Name</th>
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
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <>
                        <tr>
                          <td colSpan={9}>
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
                            )}{" "}
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
                    title: "Teaboard User Name",
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
          title={"TEA BOARD USER"}
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

export default UserRegistration;
