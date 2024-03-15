/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React from "react";
import TableComponent from "../../../components/tableComponent/TableComponent";
import { ThreeDots } from "react-loader-spinner";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  GetFactoryRequest,
  createFactoryOwnerRequest,
  createSellerRequest,
  fetchAuctionRequest,
  fetchFactoryDocumentsRequest,
  fetchFactoryListRequest,
  fetchFactoryOwnerRequest,
  fetchSellerDocumentsRequest,
  fetchStateRequest,
  getAllRevenueRequest,
  getDocumentByIdAction,
  getDocumentByIdActionSuccess,
  getDocumentRequest,
  getFactoryOwnerListRequest,
  getFactoryTypeRequest,
  getHistoryByIdAction,
  updateFactoryOwnerRequest,
  updateFactoryRequest,
  getExportData,
  getExportDataApiCall,
  createEditApiStatusSeller,
  getExportDataForView,
  getExportDataForViewApiCall,
  closemodel,
} from "../../../store/actions";
import { uploadedFileDownload } from "../../uploadDocument/UploadedFileDownload";
import { useEffect } from "react";

import { Form, Modal } from "react-bootstrap";
import FactoryOwnerHistory from "./FactoryOwnerHistory";
import UploadMultipleDocuments from "../../uploadDocument/UploadMultipleDocuments";
import CustomToast from "../../../components/Toast";
import Base64ToExcelDownload from "../../Base64ToExcelDownload";
import Base64ToPDFPreview from "../../uploadDocument/Base64ToPDFPreview";
import { NO_OF_RECORDS } from "../../../constants/commonConstants";
import Modals from "../../../components/common/Modal";
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
function SellerRegistration({ isProfile, modalRight, childUser }) {
  const [expanded, setExpanded] = React.useState("panel1");
  const [factoryExpanded, setFactoryExpanded] = React.useState("panel1");
  const dispatch = useDispatch();
  const [sellerDocument, setsellerDocument] = useState([]);
  const [documentMode, setDocumentmode] = useState("");
  const [factoryOwnerDisabled, setfactoryOwnerDisabled] = useState(false);
  const [factoryDisabled, setfactoryDisabled] = useState(false);
  const [auctionCenterList, setauctionCenterList] = useState([]);
  const [field, setField] = useState([]);
  const [StateList, setStateList] = useState([]);
  const [isFactoryOwnerEdit, setisFactoryOwnerEdit] = useState(false);
  const [isFactoryEdit, setisFactoryEdit] = useState(false);
  const [isFactoryView, setisFactoryView] = useState(false);
  const [FactoryOwnerList, setFactoryOwnerList] = useState([]);
  const [ownerNameById, setownerNameById] = useState(null);
  const [FactoryList, setFactoryList] = useState([]);
  const [showOwnerModalHistory, setShowOwnerModalHistory] = useState(false);
  const ownerHistoryClose = () => setShowOwnerModalHistory(false);
  const [FactoryCreate, setFactoryCreate] = useState(false);
  const FactoryModalClose = () => {
    setFactoryCreate(false);
    setownerNameById(null);
    ClearFactoryForm();
  };
  const [revenueList, setrevenueList] = useState([]);
  const [factoryTypeList, setfactoryTypeList] = useState([]);
  const [FactoryId, setFactoryId] = useState("");
  const [exportType, setexportType] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [exportViewType, setexportViewType] = useState("");
  const [factoryUserId, setfactoryUserId] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const [facotruOwnerSearch, setFactoryOwnerSearch] = useState({
    userName: "",
    userCode: "",
    email: "",
    teaBoardRegistrationCertificate: null,
    gstNo: null,
    panNo: null,
    isActive: null,
    roleCode: "SELLER",
  });
  const [facotrySearch, setFactorySearch] = useState({
    userName: "",
    userCode: "",
    email: "",
    teaBoardRegistrationCertificate: null,
    gstNo: null,
    panNo: null,
    isActive: 1,
    userId: factoryUserId,
  });
  const [OwnerUserId, setOwnerUserId] = useState("");
  const [viewFactoryOwnerModal, setViewFactoryOwnerModal] = useState(false);
  const [editFactoryOwnerModal, setEditFactoryOwnerModal] = useState(false);
  const [viewFactoryModal, setViewFactoryModal] = useState(false);
  const [editFactoryModal, setEditFactoryModal] = useState(false);
  const [irnEligibility, setIrnEligibility] = useState(0);

  const getAllUploadedDoc = useSelector(
    (state) => state?.sellerReducer?.factoryDocument?.responseData
  );
  const handleChangeFactoryOwnerExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel1" == panel && isExpanded) {
      ClearFactoryOwnerForm();
      setfactoryOwnerDisabled(false);
      setisFactoryView(false);
      setisFactoryEdit(false);
    }
    if ("panel2" == panel && isExpanded) {
      ClearFactoryOwnerForm();
      setfactoryOwnerDisabled(false);
      pageNo = 1;
      dispatch(
        getFactoryOwnerListRequest({
          ...facotruOwnerSearch,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
    }
    if ("panel3" == panel && isExpanded) {
      ClearFactoryOwnerForm();
      setfactoryOwnerDisabled(false);
    }
  };

  const handleExport = (exportType) => {
    setexportType("");
    let searchData = {
      facotrySearch,
      url: "/admin/getAllUser/search",
      exportType: exportType,
      isExport: 1,
      roleCode: "SELLER",
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
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };
  useEffect(() => {
    if (getExportDataResponse != null && true == getExportDataApiCallResponse) {
      dispatch(getExportDataApiCall(false));
      if ("excel" == exportType) {
        Base64ToExcelDownload(getExportDataResponse, "SellerDetails.xlsx");
      } else {
        uploadedFileDownload(
          getExportDataResponse,
          "SellerDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });
  const handleChangeFactoryExpand = (panel) => (event, isFactoryExpanded) => {
    setFactoryExpanded(isFactoryExpanded ? panel : false);
    if ("panel1" == panel && isFactoryExpanded) {
      ClearFactoryForm();
      setfactoryDisabled(false);
    }
    if ("panel2" == panel && isFactoryExpanded) {
      ClearFactoryForm();
      setfactoryDisabled(false);
    }
    if ("panel3" == panel && isFactoryExpanded) {
      ClearFactoryForm();
      dispatch(fetchFactoryDocumentsRequest(factoryUserId));
      setfactoryDisabled(false);
    }
  };

  const handleDownloadPDF = () => {
    if (getUploadedIdData && getUploadedIdData.documentContent) {
      uploadedFileDownload(
        getUploadedIdData.documentContent,
        getUploadedIdData.documentName,
        "data:application/pdf;base64"
      );
    }
  };
  const validateFactory = () => {
    let isValid = true;
    if (
      factoryForm.factoryName == "" ||
      factoryForm.factoryName == undefined ||
      factoryForm.factoryName == null
    ) {
      CustomToast.error("Please enter the factory name");
      isValid = false;
      return;
    }
    if (
      factoryForm.address == "" ||
      factoryForm.address == undefined ||
      factoryForm.address == null
    ) {
      CustomToast.error("Please enter the address");
      isValid = false;
      return;
    }
    if (
      factoryForm.city == "" ||
      factoryForm.city == undefined ||
      factoryForm.city == null
    ) {
      CustomToast.error("Please enter the city");
      isValid = false;
      return;
    }
    if (
      factoryForm.contactPerson == "" ||
      factoryForm.contactPerson == undefined ||
      factoryForm.contactPerson == null
    ) {
      CustomToast.error("Please enter the contact person");
      isValid = false;
      return;
    }

    if (
      factoryForm.phoneNo == "" ||
      factoryForm.phoneNo == undefined ||
      factoryForm.phoneNo == null
    ) {
      CustomToast.error("Please enter the phone no");
      isValid = false;
      return;
    }
    if (
      factoryForm.fax == "" ||
      factoryForm.fax == undefined ||
      factoryForm.fax == null
    ) {
      CustomToast.error("Please enter the fax no");
      isValid = false;
      return;
    }

    if (
      factoryForm.panNo == "" ||
      factoryForm.panNo == undefined ||
      factoryForm.panNo == null
    ) {
      CustomToast.error("Please enter the PANno.");
      isValid = false;
      return;
    }

    if (
      factoryForm.tbRegistrationNo == "" ||
      factoryForm.tbRegistrationNo == undefined ||
      factoryForm.tbRegistrationNo == null
    ) {
      CustomToast.error("Please enter the Teaboard Registration No");
      isValid = false;
      return;
    }

    if (
      factoryForm.taxIdentityNo == "" ||
      factoryForm.taxIdentityNo == undefined ||
      factoryForm.taxIdentityNo == null
    ) {
      CustomToast.error("Please enter the tax identification No");
      isValid = false;
      return;
    }

    if (
      factoryForm.revenueId == "" ||
      factoryForm.revenueId == undefined ||
      factoryForm.revenueId == null
    ) {
      CustomToast.error("Please select the revenue district");
      isValid = false;
      return;
    }

    if (
      factoryForm.factoryTypeId == "" ||
      factoryForm.factoryTypeId == undefined ||
      factoryForm.factoryTypeId == null
    ) {
      CustomToast.error("Please select the factory type No");
      isValid = false;
      return;
    }

    // if (
    //   factoryForm.ownerName == "" ||
    //   factoryForm.ownerName == undefined ||
    //   factoryForm.ownerName == null
    // ) {
    //   CustomToast.error("Please select the owner name");
    //   isValid = false;
    //   return;
    // }

    if (
      factoryForm.email == "" ||
      factoryForm.email == undefined ||
      factoryForm.email == null
    ) {
      CustomToast.error("Please enter the emailID");
      isValid = false;
      return;
    }
    if (
      factoryForm.mobileNo == "" ||
      factoryForm.mobileNo == undefined ||
      factoryForm.mobileNo == null
    ) {
      CustomToast.error("Please enter the mobile number.");
      isValid = false;
      return;
    }
    if (
      factoryForm.fssaiNo == "" ||
      factoryForm.fssaiNo == undefined ||
      factoryForm.fssaiNo == null
    ) {
      CustomToast.error("Please enter the fssai no");
      isValid = false;
      return;
    }
    if (
      factoryForm.gstNo == "" ||
      factoryForm.gstNo == undefined ||
      factoryForm.gstNo == null
    ) {
      CustomToast.error("Please enter the GSTNo.");
      isValid = false;
      return;
    }

    return isValid;
  };

  const ValidateFactoryOwner = () => {
    let isValid = true;
    if (
      factoryOwnerForm.ownerName == "" ||
      factoryOwnerForm.ownerName == undefined ||
      factoryOwnerForm.ownerName == null
    ) {
      CustomToast.error("Please enter the owner name");
      isValid = false;
      return;
    }
    if (
      factoryOwnerForm.address == "" ||
      factoryOwnerForm.address == undefined ||
      factoryOwnerForm.address == null
    ) {
      CustomToast.error("Please enter the address");
      isValid = false;
      return;
    }
    if (
      factoryOwnerForm.city == "" ||
      factoryOwnerForm.city == undefined ||
      factoryOwnerForm.city == null
    ) {
      CustomToast.error("Please enter the city");
      isValid = false;
      return;
    }
    if (
      factoryOwnerForm.contactPerson == "" ||
      factoryOwnerForm.contactPerson == undefined ||
      factoryOwnerForm.contactPerson == null
    ) {
      CustomToast.error("Please enter the contact person");
      isValid = false;
      return;
    }
    if (
      factoryOwnerForm.phoneNo == "" ||
      factoryOwnerForm.phoneNo == undefined ||
      factoryOwnerForm.phoneNo == null
    ) {
      CustomToast.error("Please enter the phone no");
      isValid = false;
      return;
    }
    if (
      factoryOwnerForm.fax == "" ||
      factoryOwnerForm.fax == undefined ||
      factoryOwnerForm.fax == null
    ) {
      CustomToast.error("Please enter the fax");
      isValid = false;
      return;
    }
    if (
      factoryOwnerForm.userCode == "" ||
      factoryOwnerForm.userCode == undefined ||
      factoryOwnerForm.userCode == null
    ) {
      CustomToast.error("Please enter the Owner code");
      isValid = false;
      return;
    }
    if (
      factoryOwnerForm.email == "" ||
      factoryOwnerForm.email == undefined ||
      factoryOwnerForm.email == null
    ) {
      CustomToast.error("Please enter the emailID");
      isValid = false;
      return;
    }
    if (
      factoryOwnerForm.auctionCenterId == "" ||
      factoryOwnerForm.auctionCenterId == undefined ||
      factoryOwnerForm.auctionCenterId == null
    ) {
      CustomToast.error("Please select an auction center from the list.");
      isValid = false;
      return;
    }
    if (
      factoryOwnerForm.stateId == "" ||
      factoryOwnerForm.stateId == undefined ||
      factoryOwnerForm.stateId == null
    ) {
      CustomToast.error("Please select state a state from the dropdown menu.");
      isValid = false;
      return;
    }
    if (
      factoryOwnerForm.phoneNo == "" ||
      factoryOwnerForm.phoneNo == undefined ||
      factoryOwnerForm.phoneNo == null
    ) {
      CustomToast.error("Please enter the phone no");
      isValid = false;
      return;
    }
    return isValid;
  };

  const hideOwnerHistory = () => {
    setShowOwnerModalHistory(false);
  };
  const ClearFactoryForm = () => {
    const inputElement = document.getElementById("stateUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    setfactoryForm({
      uploadDocumentRemarks: "",
      factoryId: "",
      factoryName: "",
      tbRegistrationNo: "",
      factoryTypeId: "",
      revenueId: "",
      address: "",
      city: "",
      contactPerson: "",
      userId: "",
      email: "",
      fax: "",
      gstNo: "",
      panNo: "",
      mobileNo: "",
      phoneNo: "",
      taxIdentityNo: "",
      fssaiNo: "",
    });
    setisFactoryEdit(false);
    setIrnEligibility(0);
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
  const ClearFactoryOwnerForm = () => {
    const inputElement = document.getElementById("stateUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    setfactoryOwnerForm({
      uploadDocumentRemarks: "",
      ownerName: "",
      address: "",
      city: "",
      contactPerson: "",
      fax: "",
      userCode: "",
      email: "",
      auctionCenterId: [],
      stateId: "",
      phoneNo: "",
    });
    setisFactoryOwnerEdit(false);
    setisOwnerView(false);
    setOwnerUserId("");
    setField([]);
    setUploadedFiles([]);
  };

  const [factoryOwnerForm, setfactoryOwnerForm] = useState({
    ownerName: "",
    address: "",
    city: "",
    contactPerson: "",
    fax: "",
    userCode: "",
    email: "",
    roleCode: "SELLER",
    auctionCenterId: [],
    stateId: "",
    phoneNo: "",
    userId: null,
    isActive: 1,
    downloadDto: [uploadedDocuments],
    uploadDocumentRemarks: "",
  });
  const [factoryForm, setfactoryForm] = useState({
    factoryId: null,
    factoryName: "",
    tbRegistrationNo: "",
    factoryTypeId: null,
    revenueId: null,
    address: "",
    city: "",
    entityCode: "",
    contactPerson: "",
    userId: factoryUserId,
    email: "",
    fax: "",
    gstNo: "",
    panNo: "",
    mobileNo: null,
    phoneNo: "",
    taxIdentityNo: "",
    fssaiNo: "",
    sellerToAuctioneerInvoice: null,
    productionCapacity: null,
  });

  const sellerDocumentList = useSelector(
    (res) => res?.sellerReducer?.sellerdocument?.responseData
  );
  const getAllAuctionCenter = useSelector(
    (res) => res?.warehouseUserRegistration.auctionCenter?.responseData
  );

  const States = useSelector(
    (res) => res?.warehouseUserRegistration.stateList.data?.responseData
  );
  const FactoryOwner = useSelector(
    (res) => res?.sellerReducer?.factoryOwnersList?.responseData
  );
  const FactoryOwnerById = useSelector(
    (res) => res?.sellerReducer?.factoryOwnerById?.responseData
  );
  const ownernamechild = useSelector(
    (res) => res?.sellerReducer?.factoryOwnerById?.responseData?.ownerName
  );
  const FactoryData = useSelector(
    (res) => res?.sellerReducer?.factoryList?.responseData
  );

  const FactoryById = useSelector(
    (res) => res?.sellerReducer?.factoryById?.responseData
  );

  const revenueDataDropdown = useSelector(
    (res) => res?.sellerReducer?.allRevenue?.responseData
  );

  const factoryTypeDataDropdown = useSelector(
    (res) => res?.sellerReducer?.factoryType?.responseData
  );

  const handleDownloadClick = (uploadDocumentConfId, type) => {
    setDocumentmode(type);
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };

  const getUploadedIdData = useSelector(
    (state) => state.documentReducer.documentData.responseData
  );
  const handleRadioChange = (event) => {
    setfactoryForm({
      ...isFactoryEdit,
      isActive: event.target.value,
    });
  };
  useEffect(() => {
    setownerNameById(FactoryOwnerById?.ownerName);
  }, [FactoryOwnerById]);
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

  const handleChangeFactory = (e) => {
    const { name, value } = e.target;
    setfactoryForm({ ...factoryForm, [name]: value });
  };
  const handleSubmitFactory = (e) => {
    e.preventDefault();
    if (validateFactory()) {
      factoryForm.userId = factoryUserId;
      factoryForm.downloadDto = uploadedFiles;
      if (isFactoryEdit == true) {
        dispatch(updateFactoryRequest(factoryForm));
      } else {
        dispatch(createSellerRequest(factoryForm));
      }
      ClearFactorySearch();
    }
  };

  const handleChangeFactoryOwner = (e) => {
    const { name, value } = e.target;
    setfactoryForm({ ...factoryForm, [name]: value });
    setfactoryOwnerForm({ ...factoryOwnerForm, [name]: value });
  };
  const handleFactoryOwnerSubmit = (e) => {
    e.preventDefault();

    let auctionCenterListTempData = [];
    if (field.length > 0) {
      let data =
        auctionCenterList &&
        auctionCenterList.map(
          (auctionCenterListData, auctionCenterListIndex) => {
            if (field.includes(auctionCenterListData.auctionCenterName)) {
              auctionCenterListTempData.push(
                auctionCenterListData.auctionCenterId
              );
            }
          }
        );
    }

    factoryOwnerForm.auctionCenterId = auctionCenterListTempData;
    factoryOwnerForm.userId = OwnerUserId;
    factoryOwnerForm.roleCode = "SELLER";
    factoryOwnerForm.downloadDto = uploadedDocuments;
    if (ValidateFactoryOwner()) {
      console.log(factoryOwnerForm);
      if (isFactoryOwnerEdit == true) {
        factoryOwnerForm.irnEligibility = irnEligibility;
        dispatch(updateFactoryOwnerRequest(factoryOwnerForm));
      } else {
        dispatch(createFactoryOwnerRequest(factoryOwnerForm));
      }
    }
  };

  let createData = useSelector(
    (state) => state.sellerReducer.createEditApiStatusSeller
  );

  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiStatusSeller(false));
      ClearFactoryOwnerForm();
      ClearFactoryForm();
      setExpanded("panel2");
      setFactoryExpanded("panel2");
      dispatch(getFactoryOwnerListRequest(facotruOwnerSearch));
      dispatch(fetchFactoryListRequest(facotrySearch));
      setEditFactoryOwnerModal(false);
      setViewFactoryOwnerModal(false);
      setEditFactoryModal(false);
      setViewFactoryModal(false);
      if(isProfile==1){
        dispatch(closemodel(closestatusjpgp + 1));
      }
    }
  });

  const factoryModal = (userId) => {
    setFactoryCreate(true);
    fetchFactoryDocumentsRequest(userId);
    dispatch(fetchFactoryOwnerRequest(userId));
    factoryForm.ownerName = FactoryOwnerById?.ownerName;
    setFactoryExpanded("panel1");
    setfactoryUserId(userId);
    setownerNameById(ownernamechild);
    dispatch(fetchFactoryListRequest({ isActive: 1, userId: userId }));
  };
  const EditOwner = (userId) => {
    setisFactoryOwnerEdit(true);
    setOwnerUserId(userId);
    setfactoryOwnerDisabled(false);
    dispatch(fetchFactoryOwnerRequest(userId));
    // setExpanded("panel1");
    setEditFactoryOwnerModal(true);
  };

  const EditFactory = (fId) => {
    setisFactoryView(false);
    setisFactoryEdit(true);
    setFactoryId(fId);
    setfactoryDisabled(false);
    dispatch(GetFactoryRequest(fId));
    // setFactoryExpanded("panel1");
    setEditFactoryModal(true);
  };
  const ViewFactory = (fId) => {
    setfactoryDisabled(true);
    setFactoryId(fId);
    setisFactoryView(true);
    setisFactoryEdit(false);
    dispatch(GetFactoryRequest(fId));
    // setFactoryExpanded("panel1");
    setViewFactoryModal(true);
  };

  const handleFactoryOwnerSearch = (e) => {
    const { name, value } = e.target;
    setFactoryOwnerSearch({ ...facotruOwnerSearch, [name]: value });
  };
  const [loader, setLoader] = useState(false);

  const SearchFactoryOwner = (e) => {
    e.preventDefault();
    pageNo = 1;
    setFactoryOwnerList([]);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        getFactoryOwnerListRequest({
          ...facotruOwnerSearch,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
          userId: FactoryOwnerById?.userId,
        })
      );
    }, 1000);
  };
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      getFactoryOwnerListRequest({
        ...facotruOwnerSearch,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  // useEffect(() => {
  //   const newRows = FactoryOwner || [];
  //   setFactoryOwnerList((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
  // }, [FactoryOwner]);

  useEffect(() => {
    const newRows = FactoryOwner || [];
    setFactoryOwnerList((prevRows) => {
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
  }, [FactoryOwner]);

  const ClearFactoryOwnerSearch = () => {
    setFactoryOwnerList([]);
    pageNo = 1;
    dispatch(
      getFactoryOwnerListRequest({
        userName: "",
        userCode: "",
        email: "",
        teaBoardRegistrationCertificate: null,
        gstNo: null,
        panNo: null,
        isActive: 1,
        roleCode: "SELLER",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
    setFactoryOwnerSearch({
      userName: "",
      userCode: "",
      email: "",
      teaBoardRegistrationCertificate: "",
      gstNo: "",
      panNo: "",
      isActive: 1,
      roleCode: "SELLER",
      pageNo: pageNo,
      noOfRecords: NO_OF_RECORDS,
    });
  };
  const ClearFactorySearch = () => {
    dispatch(
      fetchFactoryListRequest({
        userName: "",
        userCode: "",
        email: "",
        teaBoardRegistrationCertificate: null,
        gstNo: "",
        panNo: "",
        isActive: 1,
        userId: factoryUserId,
      })
    );
    setFactorySearch({
      userName: "",
      userCode: "",
      email: "",
      teaBoardRegistrationCertificate: null,
      gstNo: "",
      panNo: "",
      isActive: 1,
      userId: factoryUserId,
    });
  };

  const handleFactorySearch = (e) => {
    const { name, value } = e.target;
    setFactorySearch({ ...facotrySearch, [name]: value });
  };
  const SearchFactory = (e) => {
    e.preventDefault();
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(fetchFactoryListRequest(facotrySearch));
    }, 1000);
  };

  const OwnerHistory = (id) => {
    const tableName = "tbl_UserLogin";
    const moduleName = "FactoryOwner";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowOwnerModalHistory(true);
  };
  const FactoryHistory = (id) => {
    const tableName = "tbl_Factory";
    const moduleName = "Factory";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowOwnerModalHistory(true);
  };
  useEffect(() => {
    if (isProfile == 1) {
      EditOwner(atob(sessionStorage.getItem("argument2")));
    }
    dispatch(fetchSellerDocumentsRequest());
    dispatch(fetchAuctionRequest());
    dispatch(fetchStateRequest());
    // dispatch(getFactoryOwnerListRequest(facotruOwnerSearch));
    dispatch(fetchFactoryListRequest(facotrySearch));
    dispatch(fetchFactoryDocumentsRequest());
    dispatch(getFactoryTypeRequest({}));
    dispatch(getAllRevenueRequest({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setsellerDocument(sellerDocumentList);
    setStateList(States);
    setauctionCenterList(getAllAuctionCenter);
    // setFactoryOwnerList(FactoryOwner);
    setFactoryList(FactoryData);
    setfactoryTypeList(factoryTypeDataDropdown);
    setrevenueList(revenueDataDropdown);
    if (isFactoryOwnerEdit == true || factoryOwnerDisabled == true) {
      setfactoryOwnerForm(FactoryOwnerById);
      console.log("FactoryOwnerById 989", FactoryOwnerById);

      let auctionCenterListTempData = [];
      if (FactoryOwnerById.auctionCenterId.length > 0) {
        let data =
          auctionCenterList &&
          auctionCenterList.map(
            (auctionCenterListData, auctionCenterListIndex) => {
              if (
                FactoryOwnerById.auctionCenterId.includes(
                  auctionCenterListData.auctionCenterId
                )
              ) {
                auctionCenterListTempData.push(
                  auctionCenterListData.auctionCenterName
                );
              }
            }
          );
      }

      setField(auctionCenterListTempData);
      setIrnEligibility(FactoryOwnerById.irnEligibility);
    }
    if (isFactoryEdit == true || factoryDisabled == true) {
      setfactoryForm(FactoryById);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sellerDocumentList,
    getAllAuctionCenter,
    States,
    // FactoryOwner,
    FactoryOwnerById,
    FactoryData,
    FactoryById,
    revenueDataDropdown,
    factoryTypeDataDropdown,
  ]);
  const [isOwnerView, setisOwnerView] = useState(false);
  const ViewOwner = (userId) => {
    setfactoryOwnerDisabled(true);
    setisOwnerView(true);
    setOwnerUserId(userId);
    dispatch(fetchFactoryOwnerRequest(userId));
    // setExpanded("panel1");
    setViewFactoryOwnerModal(true);
  };

  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
  };
  const [selectedIds, setSelectedIds] = useState([]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event) => {
    const {
      target: { value, id },
    } = event;
    setField(typeof value === "string" ? value.split(",") : value);
  };

  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = FactoryOwnerById && FactoryOwnerById.userId;
    let searchData = {
      url: `/admin/factoryOwner/get/${id}/${exportType}`,
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
          "FactoryOwnerDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportViewDataResponse,
          "FactoryOwnerDetails.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const handleCloseViewFactoryOwnerModal = () => {
    setViewFactoryOwnerModal(false);

    ClearFactoryOwnerForm();
    setfactoryOwnerDisabled(false);
    setisFactoryView(false);
    setisFactoryEdit(false);
  };
  const closestatusjpgp = useSelector((state) => state.createBuyer.closemodel);
  const handleCloseEditFactoryOwnerModal = () => {
    setEditFactoryOwnerModal(false);
    if(isProfile==1){
      dispatch(closemodel(closestatusjpgp + 1));
    }
    ClearFactoryOwnerForm();
    setfactoryOwnerDisabled(false);
    setisFactoryView(false);
    setisFactoryEdit(false);
  };

  const handleCloseViewFactoryModal = () => {
    setViewFactoryModal(false);
    ClearFactoryForm();
    setfactoryDisabled(false);
  };

  const handleCloseEditFactoryModal = () => {
    setEditFactoryModal(false);
    ClearFactoryForm();
    setfactoryDisabled(false);
  };

  return (
    <div>
      <>
        {/* Factory Owner Create */}
        <Accordion
          expanded={expanded === "panel1"}
          className={`${expanded === "panel1" ? "active" : ""}`}
          onChange={handleChangeFactoryOwnerExpand("panel1")}
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Create Factory Owner</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <form onSubmit={handleFactoryOwnerSubmit}>
                <div className="row align-items-center">
                  <div className="col-md-2 d-none">
                    <div className="FomrGroup">
                      <label>Role Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="roleCode"
                        value={factoryOwnerForm.roleCode}
                        onChange={handleFactoryOwnerSearch}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Owner Name</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="ownerName"
                        value={factoryOwnerForm.ownerName}
                        onChange={handleChangeFactoryOwner}
                        maxLength={100}
                        disabled={
                          isFactoryOwnerEdit == true
                            ? isFactoryOwnerEdit
                            : factoryOwnerDisabled
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Address</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={factoryOwnerForm.address}
                        onChange={handleChangeFactoryOwner}
                        maxLength={500}
                        disabled={factoryOwnerDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>City</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={factoryOwnerForm.city}
                        onChange={handleChangeFactoryOwner}
                        maxLength={50}
                        disabled={factoryOwnerDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Contact Person</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="contactPerson"
                        value={factoryOwnerForm.contactPerson}
                        onChange={handleChangeFactoryOwner}
                        maxLength={100}
                        disabled={factoryOwnerDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Phone</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="phoneNo"
                        value={factoryOwnerForm.phoneNo}
                        onChange={handleChangeFactoryOwner}
                        maxLength={10}
                        disabled={factoryOwnerDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Fax</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="fax"
                        value={factoryOwnerForm.fax}
                        onChange={handleChangeFactoryOwner}
                        maxLength={15}
                        disabled={factoryOwnerDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>User Code</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="userCode"
                        value={factoryOwnerForm.userCode}
                        onChange={handleChangeFactoryOwner}
                        disabled={factoryOwnerDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Email ID</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        value={factoryOwnerForm.email}
                        onChange={handleChangeFactoryOwner}
                        maxLength={50}
                        disabled={factoryOwnerDisabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Auction center</label>
                      <label className="errorLabel"> * </label>
                      <FormControl>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={field}
                          onChange={handleChange}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(", ")}
                          disabled={factoryOwnerDisabled}
                        >
                          {auctionCenterList?.map((AuctionCenter) => (
                            <MenuItem
                              key={AuctionCenter.auctionCenterId}
                              value={AuctionCenter.auctionCenterName}
                            >
                              <Checkbox
                                checked={
                                  field.indexOf(
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
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>State Name</label>
                      <label className="errorLabel"> * </label>
                      <select
                        name="stateId"
                        value={factoryOwnerForm?.stateId}
                        onChange={handleChangeFactoryOwner}
                        className="form-control select-form"
                        maxLength={500}
                        disabled={factoryOwnerDisabled}
                      >
                        <option value="SELECT">Select State</option>
                        {StateList?.map((StateList, index) => (
                          <option key={index} value={StateList.stateId}>
                            {StateList.stateName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {isFactoryOwnerEdit == true && (
                    <div className="col-auto">
                      <div className="FomrGroup">
                        <label>Status</label>

                        <div className="d-flex CheckboxGroup">
                          <>
                            <div className="d-flex">
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={1}
                                  onChange={handleChangeFactoryOwner}
                                  checked={factoryOwnerForm.isActive == 1}
                                  disabled={factoryOwnerDisabled}
                                />
                                <label class="form-check-label">Active</label>
                              </div>
                              &nbsp;&nbsp;
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={2}
                                  onChange={handleChangeFactoryOwner}
                                  checked={factoryOwnerForm.isActive == 2}
                                />
                                <label class="form-check-label">Inactive</label>
                              </div>
                              &nbsp;&nbsp;
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={3}
                                  onChange={handleChangeFactoryOwner}
                                  checked={factoryOwnerForm.isActive == 3}
                                />
                                <label class="form-check-label">Suspend</label>
                              </div>
                            </div>
                          </>
                        </div>
                      </div>
                    </div>
                  )}

                  {factoryOwnerDisabled != true ? (
                    <div className="col-md-12">
                      <UploadMultipleDocuments
                        onFileSelect={handleFileUpload}
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
                        uploadDocumentError={uploadDocumentError}
                        inputId="stateUpload"
                      />
                      <div className="form-group my-3">
                        <label>Remarks</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={handleChangeFactoryOwner}
                          value={factoryOwnerForm.uploadDocumentRemarks}
                          name="uploadDocumentRemarks"
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="col-12">
                    <div className="BtnGroup">
                      <button type="submit" className="SubmitBtn">
                        Submit
                      </button>
                      <button
                        className="SubmitBtn"
                        type="button"
                        onClick={() => ClearFactoryOwnerForm()}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Edit */}
        {editFactoryOwnerModal ? (
          <Modals
            title={"Edit Factory Owner"}
            show={editFactoryOwnerModal}
            handleClose={handleCloseEditFactoryOwnerModal}
            size="xl"
            centered
          >
            <form onSubmit={handleFactoryOwnerSubmit}>
              <div className="row align-items-center">
                <div className="col-md-2 d-none">
                  <div className="FomrGroup">
                    <label>Role Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="roleCode"
                      value={factoryOwnerForm.roleCode}
                      onChange={handleFactoryOwnerSearch}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Owner Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="ownerName"
                      value={factoryOwnerForm.ownerName}
                      onChange={handleChangeFactoryOwner}
                      maxLength={100}
                      disabled={
                        isFactoryOwnerEdit == true
                          ? isFactoryOwnerEdit
                          : factoryOwnerDisabled
                      }
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={factoryOwnerForm.address}
                      onChange={handleChangeFactoryOwner}
                      maxLength={500}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>City</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={factoryOwnerForm.city}
                      onChange={handleChangeFactoryOwner}
                      maxLength={50}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Contact Person</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="contactPerson"
                      value={factoryOwnerForm.contactPerson}
                      onChange={handleChangeFactoryOwner}
                      maxLength={100}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Phone</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="phoneNo"
                      value={factoryOwnerForm.phoneNo}
                      onChange={handleChangeFactoryOwner}
                      maxLength={10}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Fax</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="fax"
                      value={factoryOwnerForm.fax}
                      onChange={handleChangeFactoryOwner}
                      maxLength={15}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>User Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="userCode"
                      value={factoryOwnerForm.userCode}
                      onChange={handleChangeFactoryOwner}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Email ID</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="email"
                      value={factoryOwnerForm.email}
                      onChange={handleChangeFactoryOwner}
                      maxLength={50}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Auction center</label>
                    <label className="errorLabel"> * </label>
                    <FormControl>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={field}
                        onChange={handleChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(", ")}
                        disabled={factoryOwnerDisabled}
                      >
                        {auctionCenterList?.map((AuctionCenter) => (
                          <MenuItem
                            key={AuctionCenter.auctionCenterId}
                            value={AuctionCenter.auctionCenterName}
                          >
                            <Checkbox
                              checked={
                                field.indexOf(AuctionCenter.auctionCenterName) >
                                -1
                              }
                            />
                            <ListItemText
                              primary={AuctionCenter.auctionCenterName}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      name="stateId"
                      value={factoryOwnerForm?.stateId}
                      onChange={handleChangeFactoryOwner}
                      className="form-control select-form"
                      maxLength={500}
                      disabled={factoryOwnerDisabled}
                    >
                      <option value="SELECT">Select State</option>
                      {StateList?.map((StateList, index) => (
                        <option key={index} value={StateList.stateId}>
                          {StateList.stateName}
                        </option>
                      ))}
                    </select>
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

                {isFactoryOwnerEdit == true && (
                  <div className="col-auto">
                    <div className="FomrGroup">
                      <label>Status</label>

                      <div className="d-flex CheckboxGroup">
                        <>
                          <div className="d-flex">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="isActive"
                                value={1}
                                onChange={handleChangeFactoryOwner}
                                checked={factoryOwnerForm.isActive == 1}
                                disabled={factoryOwnerDisabled}
                              />
                              <label class="form-check-label">Active</label>
                            </div>
                            &nbsp;&nbsp;
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="isActive"
                                value={2}
                                onChange={handleChangeFactoryOwner}
                                checked={factoryOwnerForm.isActive == 2}
                              />
                              <label class="form-check-label">Inactive</label>
                            </div>
                            &nbsp;&nbsp;
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="isActive"
                                value={3}
                                onChange={handleChangeFactoryOwner}
                                checked={factoryOwnerForm.isActive == 3}
                              />
                              <label class="form-check-label">Suspend</label>
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                )}

                {factoryOwnerDisabled != true ? (
                  <div className="col-md-12">
                    <UploadMultipleDocuments
                      onFileSelect={handleFileUpload}
                      uploadedFiles={uploadedFiles}
                      setUploadedFiles={setUploadedFiles}
                      uploadDocumentError={uploadDocumentError}
                      inputId="stateUpload"
                    />
                    <div className="form-group my-3">
                      <label>Remarks</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={handleChangeFactoryOwner}
                        value={factoryOwnerForm.uploadDocumentRemarks}
                        name="uploadDocumentRemarks"
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="col-12">
                  <div className="BtnGroup">
                    <button type="submit" className="SubmitBtn">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </Modals>
        ) : (
          ""
        )}

        {/* View */}
        {viewFactoryOwnerModal ? (
          <Modals
            title={"View Factory Owner"}
            show={viewFactoryOwnerModal}
            handleClose={handleCloseViewFactoryOwnerModal}
            size="xl"
            centered
          >
            <form onSubmit={handleFactoryOwnerSubmit}>
              <div className="row align-items-center">
                <div className="col-md-2 d-none">
                  <div className="FomrGroup">
                    <label>Role Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="roleCode"
                      value={factoryOwnerForm.roleCode}
                      onChange={handleFactoryOwnerSearch}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Owner Name</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="ownerName"
                      value={factoryOwnerForm.ownerName}
                      onChange={handleChangeFactoryOwner}
                      maxLength={100}
                      disabled={
                        isFactoryOwnerEdit == true
                          ? isFactoryOwnerEdit
                          : factoryOwnerDisabled
                      }
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Address</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={factoryOwnerForm.address}
                      onChange={handleChangeFactoryOwner}
                      maxLength={500}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>City</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={factoryOwnerForm.city}
                      onChange={handleChangeFactoryOwner}
                      maxLength={50}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Contact Person</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="contactPerson"
                      value={factoryOwnerForm.contactPerson}
                      onChange={handleChangeFactoryOwner}
                      maxLength={100}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Phone</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="phoneNo"
                      value={factoryOwnerForm.phoneNo}
                      onChange={handleChangeFactoryOwner}
                      maxLength={10}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Fax</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="fax"
                      value={factoryOwnerForm.fax}
                      onChange={handleChangeFactoryOwner}
                      maxLength={15}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>User Code</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="userCode"
                      value={factoryOwnerForm.userCode}
                      onChange={handleChangeFactoryOwner}
                      disabled={factoryOwnerDisabled}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Email ID</label>
                    <label className="errorLabel"> * </label>
                    <input
                      type="text"
                      className="form-control"
                      name="email"
                      value={factoryOwnerForm.email}
                      onChange={handleChangeFactoryOwner}
                      maxLength={50}
                      disabled={factoryOwnerDisabled}
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

                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>Auction center</label>
                    <label className="errorLabel"> * </label>
                    <FormControl>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={field}
                        onChange={handleChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(", ")}
                        disabled={factoryOwnerDisabled}
                      >
                        {auctionCenterList?.map((AuctionCenter) => (
                          <MenuItem
                            key={AuctionCenter.auctionCenterId}
                            value={AuctionCenter.auctionCenterName}
                          >
                            <Checkbox
                              checked={
                                field.indexOf(AuctionCenter.auctionCenterName) >
                                -1
                              }
                            />
                            <ListItemText
                              primary={AuctionCenter.auctionCenterName}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="FomrGroup">
                    <label>State Name</label>
                    <label className="errorLabel"> * </label>
                    <select
                      name="stateId"
                      value={factoryOwnerForm?.stateId}
                      onChange={handleChangeFactoryOwner}
                      className="form-control select-form"
                      maxLength={500}
                      disabled={factoryOwnerDisabled}
                    >
                      <option value="SELECT">Select State</option>
                      {StateList?.map((StateList, index) => (
                        <option key={index} value={StateList.stateId}>
                          {StateList.stateName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {isFactoryOwnerEdit == true && (
                  <div className="col-auto">
                    <div className="FomrGroup">
                      <label>Status</label>
                      <div className="d-flex CheckboxGroup">
                        <>
                          <div className="d-flex">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="isActive"
                                value={1}
                                onChange={handleChangeFactoryOwner}
                                checked={factoryOwnerForm.isActive == 1}
                                disabled={factoryOwnerDisabled}
                              />
                              <label class="form-check-label">Active</label>
                            </div>
                            &nbsp;&nbsp;
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="isActive"
                                value={2}
                                onChange={handleChangeFactoryOwner}
                                checked={factoryOwnerForm.isActive == 2}
                              />
                              <label class="form-check-label">Inactive</label>
                            </div>
                            &nbsp;&nbsp;
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="isActive"
                                value={3}
                                onChange={handleChangeFactoryOwner}
                                checked={factoryOwnerForm.isActive == 3}
                              />
                              <label class="form-check-label">Suspend</label>
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-md-12">
                  <div className="BtnGroup">
                    {modalRight
                      ?.map((ele) => ele.rightIds)
                      ?.at(0)
                      ?.includes("9") && (
                      <button
                        class="SubmitBtn"
                        onClick={() => handleViewExport("excel")}
                        type="button"
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
                        onClick={() => handleViewExport("pdf")}
                        type="button"
                      >
                        <i class="fa fa-file-pdf"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </Modals>
        ) : (
          ""
        )}

        {/* Factory Owner Manage & Search */}
        {modalRight
          ?.map((ele) => ele.rightIds)
          ?.at(0)
          ?.includes("12") && (
          <Accordion
            expanded={expanded === "panel2"}
            className={`${expanded === "panel2" ? "active" : ""}`}
            onChange={handleChangeFactoryOwnerExpand("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Manage Factory Owner</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <form onSubmit={SearchFactoryOwner}>
                  <div className="row">
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>User Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="userCode"
                          value={facotruOwnerSearch.userCode}
                          onChange={handleFactoryOwnerSearch}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Owner Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="userName"
                          value={facotruOwnerSearch.userName}
                          onChange={handleFactoryOwnerSearch}
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Email ID</label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          value={facotruOwnerSearch.email}
                          onChange={handleFactoryOwnerSearch}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Status</label>
                        <select
                          className="form-control select-form"
                          name="isActive"
                          value={facotruOwnerSearch.isActive}
                          onChange={handleFactoryOwnerSearch}
                        >
                          <option value="">All</option>
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                          <option value={2}>Suspend</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <div className="BtnGroup">
                        <button type="submit" className="SubmitBtn">
                          Search
                        </button>
                        <button
                          type="button"
                          className="SubmitBtn"
                          onClick={() => ClearFactoryOwnerSearch()}
                        >
                          Clear
                        </button>
                        <button
                          class="SubmitBtn"
                          onClick={() => handleExport("excel")}
                        >
                          <i class="fa fa-file-excel"></i>
                        </button>
                        <button
                          class="SubmitBtn"
                          onClick={() => handleExport("pdf")}
                        >
                          <i class="fa fa-file-pdf"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="TableBox">
                  <table className="table">
                    <thead>
                      <tr>
                        <th rowSpan={2}>Sr.</th>
                        <th rowSpan={2}>User Code</th>
                        <th rowSpan={2}>Contact Name</th>
                        <th rowSpan={2}>Owner Name</th>
                        <th colSpan={2} className="text-center">
                          Contact Detail
                        </th>
                        <th rowSpan={2} className="Action">
                          Action
                        </th>
                      </tr>

                      <tr>
                        <th className="text-center">Phone Number</th>
                        <th className="text-center">Email ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FactoryOwnerList?.length > 0 ? (
                        <>
                          {FactoryOwnerList?.map((fo, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{fo.userCode}</td>
                              <td>{fo.contactPersonName}</td>
                              <td>{fo.userName}</td>
                              <td className="Phone">
                                <i className="fas fa-phone"></i>&nbsp;{" "}
                                {fo.phoneNo}
                              </td>
                              <td className="Email">
                                <i className="fa fa-envelope"></i>&nbsp;{" "}
                                {fo.email}
                              </td>
                              <td className="Action">
                                {modalRight
                                  ?.map((ele) => ele.rightIds)
                                  ?.at(0)
                                  ?.includes("2") && (
                                  <Tooltip title="Edit" placement="top">
                                    <i
                                      className="fa fa-edit"
                                      onClick={() => EditOwner(fo.userId)}
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
                                      onClick={() => ViewOwner(fo.userId)}
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
                                      onClick={() => OwnerHistory(fo.userId)}
                                    ></i>
                                  </Tooltip>
                                )}
                                {childUser.some(
                                  (user) => user.linkId === 28
                                ) && (
                                  <i
                                    className="fa fa-plus"
                                    onClick={() => factoryModal(fo.userId)}
                                  ></i>
                                )}

                                {1 == fo.bankAccountStatus ? (
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
                                        value={fo.walletRequestMessage}
                                      />

                                      <button
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
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}

        {/* factory Owner Upload Document */}
        {modalRight
          ?.map((ele) => ele.rightIds)
          ?.at(0)
          ?.includes("6") && (
          <Accordion
            expanded={expanded === "panel3"}
            className={`${expanded === "panel3" ? "active" : ""}`}
            onChange={handleChangeFactoryOwnerExpand("panel3")}
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
                <div className="TableBox">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>Seller Name</th>
                        <th>Document Brief/Remarks</th>
                        <th>Document upload date and time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerDocument?.length > 0 ? (
                        <>
                          {sellerDocument &&
                            sellerDocument.map((document, index) => (
                              <tr key={document.id}>
                                <td>{index + 1}</td>
                                <td>{document.fieldValue}</td>
                                <td>{document.uploadDocumentRemarks}</td>
                                <td>{document.documentUploadTime}</td>
                                <td className="Action">
                                  <i
                                    className="fa fa-download"
                                    onClick={() => {
                                      handleDownloadClick(
                                        document.uploadDocumentConfId,
                                        "download"
                                      );
                                    }}
                                  ></i>
                                  <i
                                    title="Preview"
                                    class="fa fa-eye"
                                    onClick={() => {
                                      handleDownloadClick(
                                        document.uploadDocumentConfId,
                                        "preview"
                                      );
                                    }}
                                  ></i>
                                </td>
                              </tr>
                            ))}
                        </>
                      ) : (
                        <>
                          <tr>
                            <td colSpan={4}>
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
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}
      </>

      {/* Factory Owener History */}
      {showOwnerModalHistory && (
        <Modal
          show={showOwnerModalHistory}
          onHide={ownerHistoryClose}
          size="xl"
          centered
        >
          <Modal.Header>
            <Modal.Title>Factory Owner History</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={() => hideOwnerHistory()}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <FactoryOwnerHistory />
          </Modal.Body>
        </Modal>
      )}

      {FactoryCreate && (
        <Modal
          show={FactoryCreate}
          onHide={FactoryModalClose}
          size="xl"
          centered
        >
          <Modal.Header>
            <Modal.Title>Create Factory</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={() => FactoryModalClose()}
            ></i>
          </Modal.Header>
          <Modal.Body>
            {/* Factory Create  */}
            <Accordion
              expanded={factoryExpanded === "panel1"}
              className={`${factoryExpanded === "panel1" ? "active" : ""}`}
              onChange={handleChangeFactoryExpand("panel1")}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Create Factory</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <form onSubmit={handleSubmitFactory}>
                    <div className="row align-items-center">
                      <div className="col-md-2 d-none">
                        <div className="FomrGroup">
                          <label>user Id</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="userId"
                            value={factoryUserId}
                            onChange={handleChangeFactory}
                            maxLength={500}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Factory Name</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="factoryName"
                            value={factoryForm.factoryName}
                            onChange={handleChangeFactory}
                            maxLength={500}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Address</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={factoryForm.address}
                            onChange={handleChangeFactory}
                            maxLength={500}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>City</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={factoryForm.city}
                            onChange={handleChangeFactory}
                            maxLength={50}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Contact Person Name</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="contactPerson"
                            value={factoryForm.contactPerson}
                            onChange={handleChangeFactory}
                            maxLength={100}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Phone: </label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="phoneNo"
                            value={factoryForm.phoneNo}
                            onChange={handleChangeFactory}
                            maxLength={15}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Fax</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="fax"
                            value={factoryForm.fax}
                            onChange={handleChangeFactory}
                            maxLength={15}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>PAN No</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="panNo"
                            value={factoryForm.panNo}
                            onChange={handleChangeFactory}
                            maxLength={10}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>TB Registration No</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="tbRegistrationNo"
                            value={factoryForm.tbRegistrationNo}
                            onChange={handleChangeFactory}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Tax Identification No</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="taxIdentityNo"
                            value={factoryForm.taxIdentityNo}
                            onChange={handleChangeFactory}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Revenue District</label>
                          <label className="errorLabel"> * </label>
                          <select
                            className="form-control"
                            name="revenueId"
                            value={parseInt(factoryForm.revenueId)}
                            onChange={handleChangeFactory}
                            disabled={factoryDisabled}
                          >
                            <option>Select Revenue District</option>
                            {revenueList?.map((revenue) => (
                              <option
                                key={revenue.revenueId}
                                value={revenue.revenueId}
                              >
                                {revenue.revenueDistrictName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Factory Type</label>
                          <label className="errorLabel"> * </label>
                          <select
                            className="form-control"
                            name="factoryTypeId"
                            value={factoryForm.factoryTypeId}
                            onChange={handleChangeFactory}
                            disabled={
                              factoryDisabled == true
                                ? factoryDisabled
                                : isFactoryEdit
                            }
                          >
                            <option>Select Factory Type</option>
                            {factoryTypeList?.map((factoryType) => (
                              <option
                                key={factoryType.factoryTypeId}
                                value={factoryType.factoryTypeId}
                              >
                                {factoryType.factoryType}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Owner</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            disabled
                            className="form-control"
                            name="ownerName"
                            value={ownerNameById}
                            onChange={handleChangeFactory}
                          />
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>E Mail</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={factoryForm.email}
                            onChange={handleChangeFactory}
                            maxLength={50}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Mobile</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="mobileNo"
                            value={factoryForm.mobileNo}
                            onChange={handleChangeFactory}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>FSSAI No</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="number"
                            className="form-control"
                            name="fssaiNo"
                            value={factoryForm.fssaiNo}
                            onChange={handleChangeFactory}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>GST No</label>
                          <label className="errorLabel"> * </label>
                          <input
                            type="text"
                            className="form-control"
                            name="gstNo"
                            value={factoryForm.gstNo}
                            onChange={handleChangeFactory}
                            disabled={factoryDisabled}
                          />
                        </div>
                      </div>
                      {isFactoryEdit == true && (
                        <div className="col-auto">
                          <div className="FomrGroup">
                            <label>Status</label>
                            <div className="d-flex CheckboxGroup">
                              <>
                                <div className="d-flex">
                                  <div class="form-check">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      name="isActive"
                                      value={1}
                                      onChange={handleChangeFactoryOwner}
                                      checked={factoryForm.isActive == 1}
                                      disabled={factoryOwnerDisabled}
                                    />
                                    <label class="form-check-label">
                                      Active
                                    </label>
                                  </div>
                                  &nbsp;&nbsp;
                                  <div class="form-check">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      name="isActive"
                                      value={2}
                                      onChange={handleChangeFactoryOwner}
                                      checked={factoryForm.isActive == 2}
                                    />
                                    <label class="form-check-label">
                                      Inactive
                                    </label>
                                  </div>
                                  &nbsp;&nbsp;
                                  <div class="form-check">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      name="isActive"
                                      value={3}
                                      onChange={handleChangeFactoryOwner}
                                      checked={factoryForm.isActive == 3}
                                    />
                                    <label class="form-check-label">
                                      Suspend
                                    </label>
                                  </div>
                                </div>
                              </>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12">
                        <UploadMultipleDocuments
                          onFileSelect={handleFileUpload}
                          uploadedFiles={uploadedFiles}
                          setUploadedFiles={setUploadedFiles}
                          uploadDocumentError={uploadDocumentError}
                          inputId="stateUpload"
                        />
                        <div className="form-group my-3">
                          <label>Remarks</label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={handleChangeFactoryOwner}
                            value={factoryForm.uploadDocumentRemarks}
                            name="uploadDocumentRemarks"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="BtnGroup">
                          <button type="submit" className="SubmitBtn">
                            Submit
                          </button>
                          <button
                            className="SubmitBtn"
                            type="button"
                            onClick={() => ClearFactoryForm()}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Edit */}
            {editFactoryModal ? (
              <Modals
                title={"Edit Factory"}
                show={editFactoryModal}
                handleClose={handleCloseEditFactoryModal}
                size="xl"
                centered
              >
                <form onSubmit={handleSubmitFactory}>
                  <div className="row align-items-center">
                    <div className="col-md-2 d-none">
                      <div className="FomrGroup">
                        <label>user Id</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="userId"
                          value={factoryUserId}
                          onChange={handleChangeFactory}
                          maxLength={500}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Factory Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="factoryName"
                          value={factoryForm.factoryName}
                          onChange={handleChangeFactory}
                          maxLength={500}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Address</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={factoryForm.address}
                          onChange={handleChangeFactory}
                          maxLength={500}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>City</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={factoryForm.city}
                          onChange={handleChangeFactory}
                          maxLength={50}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Contact Person Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="contactPerson"
                          value={factoryForm.contactPerson}
                          onChange={handleChangeFactory}
                          maxLength={100}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Phone: </label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phoneNo"
                          value={factoryForm.phoneNo}
                          onChange={handleChangeFactory}
                          maxLength={15}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Fax</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="fax"
                          value={factoryForm.fax}
                          onChange={handleChangeFactory}
                          maxLength={15}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>PAN No</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="panNo"
                          value={factoryForm.panNo}
                          onChange={handleChangeFactory}
                          maxLength={10}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>TB Registration No</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="tbRegistrationNo"
                          value={factoryForm.tbRegistrationNo}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Tax Identification No</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="taxIdentityNo"
                          value={factoryForm.taxIdentityNo}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Revenue District</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control"
                          name="revenueId"
                          value={parseInt(factoryForm.revenueId)}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        >
                          <option>Select Revenue District</option>
                          {revenueList?.map((revenue) => (
                            <option
                              key={revenue.revenueId}
                              value={revenue.revenueId}
                            >
                              {revenue.revenueDistrictName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Factory Type</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control"
                          name="factoryTypeId"
                          value={factoryForm.factoryTypeId}
                          onChange={handleChangeFactory}
                          disabled={
                            factoryDisabled == true
                              ? factoryDisabled
                              : isFactoryEdit
                          }
                        >
                          <option>Select Factory Type</option>
                          {factoryTypeList?.map((factoryType) => (
                            <option
                              key={factoryType.factoryTypeId}
                              value={factoryType.factoryTypeId}
                            >
                              {factoryType.factoryType}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Owner</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          name="ownerName"
                          value={factoryForm.ownerName}
                          onChange={handleChangeFactory}
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>E Mail</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          value={factoryForm.email}
                          onChange={handleChangeFactory}
                          maxLength={50}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Mobile</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="mobileNo"
                          value={factoryForm.mobileNo}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>FSSAI No</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          className="form-control"
                          name="fssaiNo"
                          value={factoryForm.fssaiNo}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>GST No</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="gstNo"
                          value={factoryForm.gstNo}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    {isFactoryEdit == true && (
                      <div className="col-auto">
                        <div className="FomrGroup">
                          <label>Status</label>
                          <div className="d-flex CheckboxGroup">
                            <>
                              <div className="d-flex">
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="radio"
                                    name="isActive"
                                    value={1}
                                    onChange={handleChangeFactoryOwner}
                                    checked={factoryForm.isActive == 1}
                                    disabled={factoryOwnerDisabled}
                                  />
                                  <label class="form-check-label">Active</label>
                                </div>
                                &nbsp;&nbsp;
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="radio"
                                    name="isActive"
                                    value={2}
                                    onChange={handleChangeFactoryOwner}
                                    checked={factoryForm.isActive == 2}
                                  />
                                  <label class="form-check-label">
                                    Inactive
                                  </label>
                                </div>
                                &nbsp;&nbsp;
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="radio"
                                    name="isActive"
                                    value={3}
                                    onChange={handleChangeFactoryOwner}
                                    checked={factoryForm.isActive == 3}
                                  />
                                  <label class="form-check-label">
                                    Suspend
                                  </label>
                                </div>
                              </div>
                            </>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-12">
                      <div className="BtnGroup">
                        <button type="submit" className="SubmitBtn">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </Modals>
            ) : (
              ""
            )}

            {/* View Factory*/}
            {viewFactoryModal ? (
              <Modals
                title={"View"}
                show={viewFactoryModal}
                handleClose={handleCloseViewFactoryModal}
                size="xl"
                centered
              >
                {" "}
                <form onSubmit={handleSubmitFactory}>
                  <div className="row align-items-center">
                    <div className="col-md-2 d-none">
                      <div className="FomrGroup">
                        <label>user Id</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="userId"
                          value={factoryUserId}
                          onChange={handleChangeFactory}
                          maxLength={500}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Factory Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="factoryName"
                          value={factoryForm.factoryName}
                          onChange={handleChangeFactory}
                          maxLength={500}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Address</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={factoryForm.address}
                          onChange={handleChangeFactory}
                          maxLength={500}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>City</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={factoryForm.city}
                          onChange={handleChangeFactory}
                          maxLength={50}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Contact Person Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="contactPerson"
                          value={factoryForm.contactPerson}
                          onChange={handleChangeFactory}
                          maxLength={100}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Phone: </label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phoneNo"
                          value={factoryForm.phoneNo}
                          onChange={handleChangeFactory}
                          maxLength={15}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Fax</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="fax"
                          value={factoryForm.fax}
                          onChange={handleChangeFactory}
                          maxLength={15}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>PAN No</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="panNo"
                          value={factoryForm.panNo}
                          onChange={handleChangeFactory}
                          maxLength={10}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>TB Registration No</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="tbRegistrationNo"
                          value={factoryForm.tbRegistrationNo}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Tax Identification No</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="taxIdentityNo"
                          value={factoryForm.taxIdentityNo}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Revenue District</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control"
                          name="revenueId"
                          value={parseInt(factoryForm.revenueId)}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        >
                          <option>Select Revenue District</option>
                          {revenueList?.map((revenue) => (
                            <option
                              key={revenue.revenueId}
                              value={revenue.revenueId}
                            >
                              {revenue.revenueDistrictName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Factory Type</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control"
                          name="factoryTypeId"
                          value={factoryForm.factoryTypeId}
                          onChange={handleChangeFactory}
                          disabled={
                            factoryDisabled == true
                              ? factoryDisabled
                              : isFactoryEdit
                          }
                        >
                          <option>Select Factory Type</option>
                          {factoryTypeList?.map((factoryType) => (
                            <option
                              key={factoryType.factoryTypeId}
                              value={factoryType.factoryTypeId}
                            >
                              {factoryType.factoryType}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Owner</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          name="ownerName"
                          value={factoryForm.ownerName}
                          onChange={handleChangeFactory}
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>E Mail</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          value={factoryForm.email}
                          onChange={handleChangeFactory}
                          maxLength={50}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Mobile</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="mobileNo"
                          value={factoryForm.mobileNo}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>FSSAI No</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          className="form-control"
                          name="fssaiNo"
                          value={factoryForm.fssaiNo}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>GST No</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="gstNo"
                          value={factoryForm.gstNo}
                          onChange={handleChangeFactory}
                          disabled={factoryDisabled}
                        />
                      </div>
                    </div>
                    {isFactoryEdit == true && (
                      <div className="col-auto">
                        <div className="FomrGroup">
                          <label>Status</label>
                          <div className="d-flex CheckboxGroup">
                            <>
                              <div className="d-flex">
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="radio"
                                    name="isActive"
                                    value={1}
                                    onChange={handleChangeFactoryOwner}
                                    checked={factoryForm.isActive == 1}
                                    disabled={factoryOwnerDisabled}
                                  />
                                  <label class="form-check-label">Active</label>
                                </div>
                                &nbsp;&nbsp;
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="radio"
                                    name="isActive"
                                    value={2}
                                    onChange={handleChangeFactoryOwner}
                                    checked={factoryForm.isActive == 2}
                                  />
                                  <label class="form-check-label">
                                    Inactive
                                  </label>
                                </div>
                                &nbsp;&nbsp;
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="radio"
                                    name="isActive"
                                    value={3}
                                    onChange={handleChangeFactoryOwner}
                                    checked={factoryForm.isActive == 3}
                                  />
                                  <label class="form-check-label">
                                    Suspend
                                  </label>
                                </div>
                              </div>
                            </>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </Modals>
            ) : (
              ""
            )}

            {/* Factory Manage & Search */}
            {childUser
              .filter((user) => user.linkId === 28)
              ?.map((ele) => ele.rightIds)
              ?.at(0)
              ?.includes("12") && (
              <Accordion
                expanded={factoryExpanded === "panel2"}
                className={`${factoryExpanded === "panel2" ? "active" : ""}`}
                onChange={handleChangeFactoryExpand("panel2")}
                TransitionProps={{ unmountOnExit: true }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Manage Factory</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <form onSubmit={SearchFactory}>
                      <div className="row">
                        <div className="col-md-2 d-none">
                          <div className="FomrGroup">
                            <input
                              type="hidden"
                              className="form-control"
                              name="userId"
                              value={factoryUserId}
                              onChange={handleFactorySearch}
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Factory Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="userName"
                              value={facotrySearch.userName}
                              onChange={handleFactorySearch}
                            />
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Email ID</label>
                            <input
                              type="text"
                              className="form-control"
                              name="email"
                              value={facotrySearch.email}
                              onChange={handleFactorySearch}
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>GST Number</label>
                            <input
                              type="text"
                              className="form-control"
                              name="gstNo"
                              value={facotrySearch.gstNo}
                              onChange={handleFactorySearch}
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>PAN Number</label>
                            <input
                              type="text"
                              className="form-control"
                              name="panNo"
                              value={facotrySearch.panNo}
                              onChange={handleFactorySearch}
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Status</label>
                            <select
                              className="form-control select-form"
                              name="isActive"
                              value={facotrySearch.isActive}
                              onChange={handleFactorySearch}
                            >
                              <option value={1}>Active</option>
                              <option value={0}>Inactive</option>
                              <option value={2}>Suspend</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-12 mb-5">
                          <div className="BtnGroup">
                            <button type="submit" className="SubmitBtn">
                              Search
                            </button>
                            <button
                              type="button"
                              className="SubmitBtn"
                              onClick={() => ClearFactorySearch()}
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div className="TableBox">
                      <table className="table">
                        <thead>
                          <tr>
                            <th rowSpan={2}>Sr.</th>
                            <th rowSpan={2}>Contact Name</th>
                            <th rowSpan={2}>Factory Name</th>
                            <th colSpan={3} className="text-center">
                              Contact Detail
                            </th>
                            <th colSpan={2} className="text-center">
                              Tax Detail
                            </th>
                            <th rowSpan={2} className="Action">
                              Action
                            </th>
                          </tr>
                          <tr>
                            <th className="text-center">Phone Number</th>
                            <th className="text-center">Mobile Number</th>
                            <th className="text-center">Email ID</th>
                            <th className="text-center">GST Number</th>
                            <th className="text-center">PAN Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {FactoryList?.length > 0 ? (
                            <>
                              {FactoryList?.map((fo, index) => (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{fo.contactPerson}</td>
                                  <td>{fo.factoryName}</td>
                                  <td className="Phone">
                                    <i className="fas fa-phone"></i>&nbsp;{" "}
                                    {fo.phoneNo}
                                  </td>
                                  <td className="Mobile">
                                    <i className="fa fa-mobile-alt"></i>&nbsp;{" "}
                                    {fo.mobileNo}
                                  </td>
                                  <td className="Email">
                                    <i className="fa fa-envelope"></i>&nbsp;{" "}
                                    {fo.email}
                                  </td>
                                  <td>{fo.gstNo} </td>
                                  <td>{fo.panNo} </td>

                                  <td className="Action">
                                    {childUser
                                      .filter((user) => user.linkId === 28)
                                      ?.map((ele) => ele.rightIds)
                                      ?.at(0)
                                      ?.includes("2") && (
                                      <Tooltip title="Edit" placement="top">
                                        <i
                                          className="fa fa-edit"
                                          onClick={() =>
                                            EditFactory(fo.factoryId)
                                          }
                                        ></i>
                                      </Tooltip>
                                    )}

                                    {childUser
                                      .filter((user) => user.linkId === 28)
                                      ?.map((ele) => ele.rightIds)
                                      ?.at(0)
                                      ?.includes("3") && (
                                      <Tooltip title="View" placement="top">
                                        <i
                                          className="fa fa-eye"
                                          onClick={() =>
                                            ViewFactory(fo.factoryId)
                                          }
                                        ></i>
                                      </Tooltip>
                                    )}

                                    {childUser
                                      .filter((user) => user.linkId === 28)
                                      ?.map((ele) => ele.rightIds)
                                      ?.at(0)
                                      ?.includes("4") && (
                                      <Tooltip title="History" placement="top">
                                        <i
                                          className="fa fa-history"
                                          onClick={() =>
                                            FactoryHistory(fo.factoryId)
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
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
            <Accordion
              expanded={factoryExpanded === "panel3"}
              className={`${factoryExpanded === "panel3" ? "active" : ""}`}
              onChange={handleChangeFactoryExpand("panel3")}
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
                        title: "Factory",
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
                        getCellValue: (rows) => (
                          <UploadActionData data={rows} />
                        ),
                      },
                    ]}
                    rows={
                      getAllUploadedDoc == undefined ||
                      getAllUploadedDoc == null
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
    </div>
  );
}

export default SellerRegistration;
