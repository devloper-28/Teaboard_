/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Modals from "../../../components/common/Modal";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { Card, Form, Modal } from "react-bootstrap";
import { resolveTimeFormat } from "@mui/x-date-pickers/internals/utils/time-utils";
import { uploadedFileDownload } from "../../uploadDocument/UploadedFileDownload";
import * as Yup from "yup";
import { ErrorMessage, Formik } from "formik";
import Base64ToExcelDownload from "../../Base64ToExcelDownload";
import UploadMultipleDocuments from "../../uploadDocument/UploadMultipleDocuments";
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileText,
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import {
  getAllAuctionCenterAscAction,
  getAllStateAscAction,
  createUserRequest,
  createWarehouseUnitRequest,
  createWarehouseUserRequest,
  fetchAuctionRequest,
  fetchDocumentsRequest,
  fetchStateRequest,
  fetchUnitDocumentsRequest,
  getDocumentDetailRequest,
  getUnitRequest,
  getUserRequest,
  getUsersRequest,
  getWarehouseHistoryRequest,
  getWarehouseUnitHistoryRequest,
  postWarehouseUserRequest,
  postWarehouseUserSuccess,
  searchUnitRequest,
  searchUsersRequest,
  searchWarehouseUnitsSuccess,
  updateWarehouseUnitRequest,
  updateWarehouseUserRequest,
  getHistoryByIdAction,
  getDocumentByIdAction,
  createEditApiStatusWarehouse,
  getExportDataForView,
  getExportDataForViewApiCall,
  closemodel,
} from "../../../store/actions";
import { useSelector } from "react-redux";
import WarehouseHistory from "./warehouseHistory";
import WarehouseUnitHistory from "./WarehouseUnitHistory";
import CustomToast from "../../../components/Toast";
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
import { NO_OF_RECORDS } from "../../../constants/commonConstants";
import { Tooltip } from "@mui/material";

let pageNo = 1;
function WarehouseUserRegistration({ modalRight, childUser, isProfile }) {
  const [expanded, setExpanded] = React.useState("panel1");
  const [expandedSub, setExpandedSub] = React.useState("panel1");
  const dispatch = useDispatch();
  const handleChangeExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel1" == panel && isExpanded) {
      resetForm();
    }
  };
  const handleChangeExpandSub = (panel) => (event, isSubExpanded) => {
    setExpandedSub(isSubExpanded ? panel : false);
  };
  const [exportViewType, setexportViewType] = useState("");
  const [exportUnitViewType, setexportUnitViewType] = useState("");
  const [AuctionCenter, setAuctionCenter] = useState([]);
  const [StateList, setStateList] = useState([]);
  const [StateCode, setStateCode] = useState([]);
  const [RegUsers, setRegUsers] = useState([]);
  const [isEdit, setIsedit] = useState(false);
  const [UploadedDocuemnt, setUploadedDocument] = useState([]);
  const [userId, setUserId] = useState("");
  const [downlodDocument, setDownloadDocument] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [field, setField] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadedDocumentsForUnit, setUploadedDocumentsForUnit] = useState([]);
  const [uploadDocumentError, setUploadDocumentError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedFilesUnit, setUploadedFilesUnit] = useState([]);
  const [showmodal, setShowmodal] = useState(false);
  const [showmodalWarehouseHistory, setShowmodalWarehouseHistory] =
    useState(false);
  const [showmodalWarehouseUnitHistory, setShowmodalWarehouseUnitHistory] =
    useState(false);
  const [unitsearch, setUnitSearch] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [unitSearchData, setUnitSearchData] = useState([]);
  const [isUnitEdit, setisUnitEdit] = useState([]);
  const [isUnitAdd, setisUnitAdd] = useState(true);
  const [isViewUnit, setViewUnit] = useState(false);
  const [warehouseDisabled, setwarehouseDisabled] = useState(false);
  const SubUSerClose = () => setShowmodal(false);
  const WarehouseHistoryClose = () => setShowmodalWarehouseHistory(false);
  const WarehouseHistoryUnitClose = () => showmodalWarehouseUnitHistory(false);
  const [auctionCenterId, setauctionCenterId] = useState("");
  const [auctioneerGstDtoList, setauctioneerGstDtoList] = useState([]);
  const [onChangesAuctionCenterId, setOnChangeAuctionCenterId] = useState([]);
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [tblState, settblState] = useState("");
  const [viewWarehouseModal, setViewWarehouseModal] = useState(false);
  const [editWarehouseModal, setEditWarehouseModal] = useState(false);
  const [viewWarehouseUnitModal, setViewWarehouseUnitModal] = useState(false);
  const [editWarehouseUnitModal, setEditWarehouseUnitModal] = useState(false);
  const [irnEligibility, setIrnEligibility] = useState(0);

  const [formData, setFormData] = useState({
    uploadDocumentRemarks: "",
    wareHouseName: "",
    wareHouseCode: "",
    roleCode: "WAREHOUSE",
    wareHouseLicenseNo: "",
    address: "",
    city: "",
    contactPerson: "",
    email: "",
    stateId: "",
    phoneNo: " ",
    mobileNo: "",
    fax: "",
    gstNo: "",
    shortName: "",
    panNo: "",
    taxIdentityNo: "",
    teaBoardRegistrationNo: "",
    wareHouseGstDtoList: [
      {
        gstNo: "",
        auctionCenterId: null,
        isActive: null,
        stateId: null,
        address: "",
      },
    ],
    isActive: 1,
  });
  const handleUnitViewExport = (exportType) => {
    setexportUnitViewType("");
    let id = UnitById && UnitById.wareHouseUnitId;
    let searchData = {
      url: `/admin/wareHouseUserUnitReg/get/getWareHouseUnitById/${id}/${exportType}`,
    };
    setexportUnitViewType(exportType);
    dispatch(getExportDataForView(searchData));
  };

  const getExportUnitViewDataResponse = useSelector(
    (state) => state.documentReducer.exportViewData.responseData?.exported_file
  );

  const getExportUnitDataViewApiCallResponse = useSelector(
    (state) => state.documentReducer.exportDataForViewApiCall
  );

  useEffect(() => {
    if (
      getExportUnitViewDataResponse != null &&
      true == getExportUnitDataViewApiCallResponse
    ) {
      dispatch(getExportDataForViewApiCall(false));
      if ("excel" == exportUnitViewType) {
        Base64ToExcelDownload(
          getExportUnitDataViewApiCallResponse,
          "AuctionCenterDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportUnitDataViewApiCallResponse,
          "downloaded_document.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const [formDataUnit, setFormDataUnit] = useState({
    wareHouseUserRegId: null,
    wareHouseUnitCode: null,
    wareHouseUnitName: null,
    isActive: null,
    uploadDocumentRemarks: "",
  });

  const UploadedDocumentList = useSelector(
    (res) => res.warehouseUserRegistration.documents?.responseData
  );

  const getAllAuctionCenter = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );
  const States = useSelector(
    (state) => state?.state?.getAllStateAsc?.responseData
  );
  const SearchUser = useSelector(
    (res) => res.warehouseUserRegistration.userSearch.data?.responseData
  );
  const UserById = useSelector(
    (res) => res?.warehouseUserRegistration?.userById?.data?.responseData
  );

  const SubUserForId = useSelector(
    (res) => res?.warehouseUserRegistration?.userById?.data?.responseData
  );

  const SearchWareHouseUnit = useSelector(
    (res) => res?.warehouseUserRegistration?.unitsearchData?.data?.responseData
  );

  const CreateUser = useSelector(
    (res) => res?.warehouseUserRegistration?.createuser
  );

  const CreateUnit = useSelector(
    (res) => res?.warehouseUserRegistration?.createunit?.data
  );

  const UnitById = useSelector(
    (res) => res?.warehouseUserRegistration.unitById?.user.responseData
  );

  const UnitDocument = useSelector(
    (res) => res?.warehouseUserRegistration?.unitdocument?.responseData
  );

  const updateWarehouse = useSelector(
    (res) => res?.warehouseUserRegistration?.updatedData?.responseData
  );

  const Message = useSelector((res) => res.warehouseUserRegistration);

  const [unitDocument, setUnitDocument] = useState([]);

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
    // setstateCode(e.target.options[e.target.selectedIndex].id);
    // settblState(e.target.value);
    const { name, value } = e.target;
    const updatedValue = name === "isActive" ? parseInt(value, 10) : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: updatedValue,
    }));
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
  const tempAuctionCenterDataChange = (key, value, stateId) => {
    let data =
      auctioneerGstDtoList &&
      auctioneerGstDtoList.map((data, index) => {
        if (data.stateId == stateId) {
          data[key] = value;
        }
        return data;
      });
    setauctioneerGstDtoList(data);
  };

  useEffect(() => {
    let data = StateList?.filter((ele) => ele.stateId == formData.stateId);
    setStateCode(data?.at(0)?.stateCode);
  }, [formData.stateId]);
  useEffect(() => {
    dispatch(
      getAllStateAscAction({
        sortBy: "asc",
        sortColumn: "stateName",
        isActive: 1,
      })
    );
    dispatch(fetchDocumentsRequest());
    dispatch(
      searchUsersRequest({
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
    dispatch(postWarehouseUserSuccess());
    dispatch(
      getAllAuctionCenterAscAction({
        isActive: 1,
        sortBy: "asc",
        sortColumn: "auctionCenterName",
      })
    );
    dispatch(searchUnitRequest({}));
    dispatch(fetchUnitDocumentsRequest());
  }, []);
  useEffect(() => {
    if (UserById != null && UserById != undefined) {
      let tempAuctionCenterData1 = [];
      let states = [];
      let auctionCenterIdData = [];
      for (let i = 0; i < UserById.wareHouseGstDtoList.length; i++) {
        UserById.wareHouseGstDtoList[i].statePresent = false;
        //if auction Center & selected state id is same
        if (
          UserById.stateId != "" &&
          UserById.wareHouseGstDtoList[i].stateId == UserById.tblState
        ) {
          UserById.wareHouseGstDtoList[i].statePresent = true;
          auctionCenterIdData.push(
            UserById.wareHouseGstDtoList[i].auctionCenterId
          );
          states.push(UserById.wareHouseGstDtoList[i].stateId);
          tempAuctionCenterData1.push(UserById.wareHouseGstDtoList[i]);
        } else if (auctionCenterIdData && auctionCenterIdData.length == 0) {
          auctionCenterIdData.push(
            UserById.wareHouseGstDtoList[i].auctionCenterId
          );
          states.push(UserById.wareHouseGstDtoList[i].stateId);
          tempAuctionCenterData1.push(UserById.wareHouseGstDtoList[i]);
        } else if (states.includes(UserById.wareHouseGstDtoList[i].stateId)) {
          //if currenrt auction Center state id & saved state id is same
          UserById.wareHouseGstDtoList[i].statePresent = true;
          auctionCenterIdData.push(
            UserById.wareHouseGstDtoList[i].auctionCenterId
          );
        } else if (!states.includes(UserById.wareHouseGstDtoList[i].stateId)) {
          states.push(UserById.wareHouseGstDtoList[i].stateId);
          auctionCenterIdData.push(
            UserById.wareHouseGstDtoList[i].auctionCenterId
          );
          tempAuctionCenterData1.push(UserById.wareHouseGstDtoList[i]);
        } else if (
          !auctionCenterIdData.includes(
            UserById.wareHouseGstDtoList[i].auctionCenterIdData
          )
        ) {
          auctionCenterIdData.push(
            UserById.wareHouseGstDtoList[i].auctionCenterId
          );
          // states.push(UserById.wareHouseGstDtoList[i].stateId);
        }
      }
      let tempDataNo = [];
      getAllAuctionCenter &&
        getAllAuctionCenter.map((auctionCenterData, auctioncenterIndex) => {
          if (auctionCenterIdData.includes(auctionCenterData.auctionCenterId)) {
            tempDataNo.push(auctionCenterData.auctionCenterName.toString());
          }
        });
      setauctionCenterId(auctionCenterIdData);
      setOnChangeAuctionCenterId(tempDataNo);
      setIrnEligibility(UserById.irnEligibility);
    }
  }, [UserById]);
  useEffect(() => {
    setUploadedDocument(UploadedDocumentList);
    setAuctionCenter(getAllAuctionCenter);
    setStateList(States);
    setUnitSearch(SearchWareHouseUnit);
    setUnitDocument(UnitDocument);
    if (isEdit === true) {
      setFormData(UserById);
      setauctioneerGstDtoList(UserById.wareHouseGstDtoList);
    }
    if (IsView == true) {
      setFormData(UserById);
      setField(UserById.auctionCenterId);
      setauctioneerGstDtoList(UserById.wareHouseGstDtoList);
    }
    if (isUnitEdit == true) {
      setFormDataUnit(UnitById);
    }
    if (isUnitAdd == true) {
      setFormDataUnit(SubUserForId);
    }
    if (isViewUnit == true) {
      setFormDataUnit(UnitById);
    }
  }, [
    UploadedDocumentList,
    getAllAuctionCenter,
    States,
    UserById,
    SubUserForId,
    SearchWareHouseUnit,
    UnitById,
    UnitDocument,
  ]);

  console.log(auctionCenterId,'auctionCenterId')
  // Validation WarehouseUser
  const validate = () => {
    let isValid = true;
    if (formData.address == "") {
      CustomToast.error("Please enter the address");
      isValid = false;
      return;
    }
    if (auctionCenterId == null || auctionCenterId == "") {
      CustomToast.error(
        "Please select an auction center from the dropdown list."
      );
      isValid = false;
      return;
    }
    if (formData.city == "") {
      CustomToast.error("Please enter the city");
      isValid = false;
      return;
    }
    if (formData.contactPerson == "") {
      CustomToast.error("Please enter the contact person");
      isValid = false;
      return;
    }
    if (formData.email == "") {
      CustomToast.error("Please enter the email Id");
      isValid = false;
      return;
    }
    if (formData.fax == "") {
      CustomToast.error("Please enter the fax");
      isValid = false;
      return;
    }
    if (formData.gstNo == "") {
      CustomToast.error("Please enter the GSTNo.");
      isValid = false;
      return;
    }
    if (formData.mobileNo == "") {
      CustomToast.error("Please enter the mobile number.");
      isValid = false;
      return;
    }
    if (formData.panNo == "") {
      CustomToast.error("Please enter the PANno.");
      isValid = false;
      return;
    }
    if (formData.phoneNo == "") {
      CustomToast.error("Please enter the phone number");
      isValid = false;
      return;
    }
    if (formData.shortName == "") {
      CustomToast.error("Please enter the short name");
      isValid = false;
      return;
    }
    if (formData.stateId == "") {
      CustomToast.error("Please select a state from the dropdown list.");
      isValid = false;
      return;
    } else {
      CustomToast.error();
    }
    if (formData.teaBoardRegistrationNo == "") {
      CustomToast.error("Please enter the teaboard registration no");
      isValid = false;
      return;
    }
    if (formData.wareHouseCode == "") {
      CustomToast.error("Please enter the warehouse code");
      isValid = false;
      return;
    }
    if (formData.wareHouseName == "") {
      CustomToast.error("Please enter the warehouse name");
      isValid = false;
      return;
    }
    if (formData.wareHouseLicenseNo == "") {
      CustomToast.error("Please enter the warehouse licence no");
      isValid = false;
      return;
    }
    return isValid;
  };
  const validUnit = () => {
    let isValid = true;
    if (formDataUnit.wareHouseUnitCode == "") {
      CustomToast.error("Please enter the warehouse unit code");
      isValid = false;
      return;
    }
    if (formDataUnit.wareHouseUnitName == "") {
      CustomToast.error("Please enter the warehouse unit name");
      isValid = false;
      return;
    }
    return isValid;
  };
  const resetFormUnit = () => {
    setUserId("");
    setFormDataUnit({
      uploadDocumentRemarks: "",
      wareHouseUnitCode: "",
      wareHouseUnitName: "",
    });
    setisUnitEdit(false);
    setUploadedFilesUnit([]);
    const inputElement = document.getElementById("UploadWarehouseUnit");
    if (inputElement) {
      inputElement.value = "";
    }
  };
  const resetForm = () => {
    setDisabled(false);
    setUserId("");
    setFormData({
      uploadDocumentRemarks: "",
      wareHouseUserRegId: 0,
      wareHouseName: "",
      wareHouseCode: "",
      wareHouseLicenseNo: "",
      address: "",
      city: "",
      contactPerson: "",
      email: "",
      entityCode: "",
      phoneNo: "",
      mobileNo: "",
      fax: "",
      auctionCenterId: [],
      shortName: "",
      stateId: 0,
      panNo: "",
      gstNo: "",
      taxIdentityNo: "",
      teaBoardRegistrationNo: "",
      isActive: 1,
      downloadDto: [],
    });
    setIsedit(false);
    setauctionCenterId("");
    setauctioneerGstDtoList([]);
    setStateCode("");
    setOnChangeAuctionCenterId([]);
    setUploadedDocuments([]);
    setUploadedFiles([]);
    setIrnEligibility(0);
    const inputElement = document.getElementById("UploadWarehouseUser");
    if (inputElement) {
      inputElement.value = "";
    }
  };
  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
  };
  const handleFileUploadForUnit = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocumentsForUnit(newFiles);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedValue = name === "isActive" ? parseInt(value, 10) : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: updatedValue,
    }));
  };
  // File Select for Unit
  const handleChangeForUnit = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "isActive" ? parseInt(value, 10) : value;
    setFormDataUnit((prevFormData) => ({
      ...prevFormData,
      [name]: updatedValue,
    }));
  };
  const handleChangeAuctionCenter = (event) => {
    const {
      target: { value, id },
    } = event;
    setField(typeof value === "string" ? value.split(",") : value);
  };

  const Status = [
    { status: "Active", id: 1 },
    { status: "Inactive", id: 0 },
    { status: "Suspend", id: 2 },
  ];
  //  Warehouse Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    formData.auctionCenterId = field;
    formData.downloadDto = uploadedDocuments;
    formData.wareHouseGstDtoList = auctioneerGstDtoList;
    formData.roleCode = "WAREHOUSE";
    if (validate()) {
      if (isEdit == true) {
        formData.wareHouseUserRegId = userId;
        if (validate() && isEdit == true) {
          formData.irnEligibility = irnEligibility;
          dispatch(updateWarehouseUserRequest(formData));
        }
      } else {
        dispatch(postWarehouseUserRequest(formData));
      }
    } else {
      return false;
    }
  };
  // Unit Form Submit
  const handleSubmitForUnit = (e) => {
    e.preventDefault();
    formDataUnit.downloadDto = uploadedDocumentsForUnit;
    formDataUnit.wareHouseUserRegId = IdForSubUser;
    if (validUnit() && isUnitEdit != true) {
      dispatch(createWarehouseUnitRequest(formDataUnit));
    }
  };
  const handleViewExport = (exportType) => {
    setexportViewType("");
    let id = UserById && UserById.userId;
    let searchData = {
      url: `/admin/WareHouseUserReg/get/${id}/${exportType}`,
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
          getExportDataViewApiCallResponse,
          "AuctionCenterDetails.xlsx"
        );
      } else {
        uploadedFileDownload(
          getExportDataViewApiCallResponse,
          "downloaded_document.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  let createData = useSelector(
    (state) => state.warehouseUserRegistration.createEditApiStatusWarehouse
  );
  useEffect(() => {
    if (true == createData) {
      dispatch(createEditApiStatusWarehouse(false));
      setExpanded("panel2");
      setExpandedSub("panel2");
      dispatch(searchUnitRequest({}));
      dispatch(
        searchUsersRequest({
          ...searchData,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
      setEditWarehouseUnitModal(false);
      setViewWarehouseUnitModal(false);
      setEditWarehouseModal(false);
      setViewWarehouseModal(false);
      if(isProfile==1){
        dispatch(closemodel(closestatusjpgp + 1));
      }
    }
  });

  const SaveUpdatedForUnit = () => {
    if (validUnit() && isUnitEdit == true) {
      dispatch(updateWarehouseUnitRequest(formDataUnit));
    }
  };
  const closestatusjpgp = useSelector((state) => state.createBuyer.closemodel);
  useEffect(() => {
    if (isProfile == 1) {
      EditUserData(atob(sessionStorage.getItem("argument2")));
    }
  }, []);

  // Edit Warehouse
  const EditUserData = (id) => {
    setUserId(id);
    setIsView(false);
    setIsedit(true);
    setDisabled(false);
    // setExpanded("panel1");
    setEditWarehouseModal(true);
    dispatch(getUserRequest(id));
  };

  // Edit Unit
  const EditUnit = (unitData) => {
    resetFormUnit();
    setIsView(false);
    setViewUnit(false);
    setwarehouseDisabled(false);
    setisUnitAdd(false);
    setisUnitEdit(true);
    dispatch(getUnitRequest(unitData));
    // setExpandedSub("panel1");
    setEditWarehouseUnitModal(true);
  };

  const [IsView, setIsView] = useState([]);
  // View Warehouse Read Only
  const ViewUserData = (id) => {
    setUserId(id);
    setIsedit(false);
    setDisabled(true);
    setIsView(true);
    // setExpanded("panel1");
    setViewWarehouseModal(true);
    dispatch(getUserRequest(id));
  };
  // View Unit Read Only
  const ViewUniWareHouse = (unitData) => {
    setViewUnit(true);
    resetFormUnit();
    setisUnitAdd(false);
    setisUnitEdit(false);
    dispatch(getUnitRequest(unitData));
    setwarehouseDisabled(true);
    // setExpandedSub("panel1");
    setViewWarehouseUnitModal(true);
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

  // Get Search Value Warehouse
  const handleSearchWarehouse = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      searchUsersRequest({
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  // Search Warehouse
  const [loader, setLoader] = useState(false);
  const handleSearch = (e) => {
    e.preventDefault();
    setRegUsers([]);
    pageNo = 1;
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        searchUsersRequest({
          ...searchData,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
    }, 1000);
  };
  // const [rows, setRows] = useState([]);
  // useEffect(() => {
  //   const newRows = SearchUser || [];
  //   setRegUsers((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
  // }, [SearchUser]);

  useEffect(() => {
    const newRows = SearchUser || [];
    setRegUsers((prevRows) => {
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
  }, [SearchUser]);
  // Clear Search Warehouse
  const ClearSearch = () => {
    setRegUsers([]);
    pageNo = 1;
    dispatch(
      searchUsersRequest({ pageNo: pageNo, noOfRecords: NO_OF_RECORDS })
    );
    searchData.wareHouseCode = "";
    searchData.wareHouseName = "";
  };

  // Get Search Value Unit
  const handleSearchUnit = (e) => {
    const { name, value } = e.target;
    setUnitSearchData({ ...unitSearchData, [name]: value });
  };
  // Search Value Unit
  const handleUnitSearchSubmit = (e) => {
    e.preventDefault();
    setRegUsers([]);
    pageNo = 1;
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(searchUnitRequest(unitSearchData));
    }, 1000);
  };
  // Clear Search Unit
  const ClearUnitSearch = () => {
    dispatch(searchUnitRequest({}));
    setIdForSubUser("");
    setUserId("");
    unitSearchData.wareHouseUnitCode = "";
    unitSearchData.wareHouseUnitName = "";
  };
  const [IdForSubUser, setIdForSubUser] = useState("");
  // Add Warehouse Unit
  const AddNewSubUser = (id) => {
    resetFormUnit();
    setisUnitAdd(true);
    setIdForSubUser(id);
    setisUnitEdit(false);
    dispatch(getUserRequest(id));
    setExpandedSub("panel1");
    dispatch(searchUnitRequest({ wareHouseUserRegId: id }));
    setShowmodal(true);
  };

  const CloseUnitModal = () => {
    setShowmodal(false);
    resetForm();
    resetFormUnit();
    setIdForSubUser("");
    setUserId("");
  };

  const ShowWarehouseHistory = (id) => {
    const tableName = "tbl_wareHouseUserReg";
    const moduleName = "WareHouseUserReg";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodalWarehouseHistory(true);
  };

  const ShowUnitHistory = (id) => {
    const tableName = "tbl_wareHouseUserUnit";
    const moduleName = "WareHouseUserUnit";
    dispatch(getHistoryByIdAction(tableName, moduleName, id));
    setShowmodalWarehouseUnitHistory(true);
  };

  const hideWarehouseHistory = () => {
    setShowmodalWarehouseHistory(false);
  };
  const hideUnitHistory = (id) => {
    setShowmodalWarehouseUnitHistory(false);
  };

  const handleCloseViewWarehouseModal = () => {
    setViewWarehouseModal(false);
  };

  const handleCloseEditWarehouseModal = () => {
    if(isProfile==1){
      dispatch(closemodel(closestatusjpgp + 1));
    }
    setEditWarehouseModal(false);
  };

  const handleCloseViewWarehouseUnitModal = () => {
    setViewWarehouseUnitModal(false);
  };

  const handleCloseEditWarehouseUnitModal = () => {
    setEditWarehouseUnitModal(false);
  };
  // const [onChangesAuctionCenterId, setOnChangesAuctionCenterId] = useState([]);

  //   useEffect(() => {
  //     if (responseData && responseData.wareHouseGstDtoList) {
  //         const selectedAuctionCenterIds = responseData.wareHouseGstDtoList.map(item => item.auctionCenterId);
  //         setOnChangesAuctionCenterId(selectedAuctionCenterIds);
  //     }
  // }, [responseData]);
  // useEffect(() => {
  //   if (UserById && UserById.wareHouseGstDtoList) {
  //       const selectedAuctionCenterIds = UserById.wareHouseGstDtoList.map(item => item.auctionCenterId);

  //       let tempDataNo = [];
  //       getAllAuctionCenter &&
  //         getAllAuctionCenter.map((auctionCenterData, auctioncenterIndex) => {
  //           if (selectedAuctionCenterIds.includes(auctionCenterData.auctionCenterId)) {
  //             tempDataNo.push(auctionCenterData.auctionCenterName.toString());
  //           }
  //         });
  //         console.log("line 1044",tempDataNo)

  //       setOnChangeAuctionCenterId(tempDataNo);
  //   }
  // }, [UserById]);
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
          onChange={handleChangeExpand("panel1")}
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Create Warehouse User Registration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <form onSubmit={handleSubmit}>
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Address</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData?.address}
                        onChange={handleChange}
                        maxLength={500}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
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
                        className="w-100"
                      >
                        {getAllAuctionCenter?.map((AuctionCenter) => (
                          <MenuItem
                            key={AuctionCenter?.auctionCenterId}
                            value={AuctionCenter?.auctionCenterName} // Change to auctionCenterId
                          >
                            <Checkbox
                              checked={
                                onChangesAuctionCenterId.indexOf(
                                  AuctionCenter?.auctionCenterName
                                ) > -1
                              }
                            />
                            <ListItemText
                              primary={AuctionCenter?.auctionCenterName}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                      {auctionCenterIdError && (
                        <p className="errorLabel">{auctionCenterIdError}</p>
                      )}
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
                        value={formData?.city}
                        onChange={handleChange}
                        maxLength={50}
                        disabled={disabled}
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
                        value={formData && formData.contactPerson}
                        onChange={handleChange}
                        maxLength={100}
                        disabled={disabled}
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
                        value={formData?.email}
                        onChange={handleChange}
                        maxLength={50}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  {isEdit == true ? (
                    <>
                      <div className="col-md-2">
                        <div className="FomrGroup">
                          <label>Entity Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="entityCode"
                            value={formData?.entityCode}
                            onChange={handleChange}
                            disabled
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Fax</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="fax"
                        value={formData?.fax}
                        onChange={handleChange}
                        maxLength={15}
                        disabled={disabled}
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
                        value={formData?.gstNo}
                        onChange={handleChange}
                        maxLength={15}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Mobile No</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="mobileNo"
                        value={formData?.mobileNo}
                        onChange={handleChange}
                        maxLength={15}
                        disabled={disabled}
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
                        value={formData?.panNo}
                        onChange={handleChange}
                        maxLength={10}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Phone </label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="phoneNo"
                        value={formData?.phoneNo}
                        onChange={handleChange}
                        maxLength={15}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Short Name</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="shortName"
                        value={formData?.shortName}
                        onChange={handleChange}
                        maxLength={15}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>State Name</label>
                      <label className="errorLabel"> * </label>
                      <select
                        name="stateId"
                        value={formData?.stateId}
                        onChange={handlesStateNameChange}
                        className="form-control select-form"
                        maxLength={500}
                        disabled={disabled}
                      >
                        <option>Select State</option>
                        {StateList?.map((StateList, index) => (
                          <option key={index} value={StateList.stateId}>
                            {StateList.stateName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>State Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="StateCode"
                        value={StateCode}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Tax Id No</label>
                      <input
                        type="text"
                        className="form-control"
                        name="taxIdentityNo"
                        value={formData?.taxIdentityNo}
                        onChange={handleChange}
                        maxLength={15}
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Teaboard Reg No</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="teaBoardRegistrationNo"
                        value={formData?.teaBoardRegistrationNo}
                        onChange={handleChange}
                        maxLength={15}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Ware House Code</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="wareHouseCode"
                        value={formData?.wareHouseCode}
                        onChange={handleChange}
                        maxLength={10}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Ware House Name</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="wareHouseName"
                        value={formData?.wareHouseName}
                        onChange={handleChange}
                        maxLength={50}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Ware House License No</label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        name="wareHouseLicenseNo"
                        value={formData?.wareHouseLicenseNo}
                        onChange={handleChange}
                        maxLength={15}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  {isEdit == true && (
                    <div className="col-auto">
                      <div className="FomrGroup">
                        <label>Status</label>

                        <div className="d-flex CheckboxGroup">
                          <>
                            <div className="d-flex">
                              <div class="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={1}
                                  onChange={handleChange}
                                  checked={formData?.isActive === 1}
                                />
                                <label className="form-check-label">
                                  Active
                                </label>
                              </div>
                              &nbsp;&nbsp;
                              <div class="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={2}
                                  onChange={handleChange}
                                  checked={formData?.isActive === 2}
                                />
                                <label className="form-check-label">
                                  Inactive
                                </label>
                              </div>
                              &nbsp;&nbsp;
                              <div class="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={3}
                                  onChange={handleChange}
                                  checked={formData?.isActive === 3}
                                />
                                <label className="form-check-label">
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
                    {auctioneerGstDtoList?.length > 0 ? (
                      <>
                        <div className="GSTBox">
                          {auctioneerGstDtoList &&
                            auctioneerGstDtoList.map((data, index) => (
                              <>
                                {!data.statePresent ? (
                                  <div className="row mt-2">
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
                                          value={data?.stateName}
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
                                          value={data?.gstNo}
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
                                        <label> Address</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          value={data?.address}
                                          onChange={(e) =>
                                            tempAuctionCenterDataChange(
                                              "address",
                                              e.target.value,
                                              data.stateId
                                            )
                                          }
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
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <UploadMultipleDocuments
                      onFileSelect={handleFileUpload}
                      uploadedFiles={uploadedFiles}
                      setUploadedFiles={setUploadedFiles}
                      uploadDocumentError={uploadDocumentError}
                      inputId="UploadWarehouseUser"
                    />
                    <div className="form-group my-3">
                      <label>Remarks</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.uploadDocumentRemarks}
                        onChange={handleChange}
                        name="uploadDocumentRemarks"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-auto">
                    <div className="BtnGroup">
                      <button className={"SubmitBtn"}>Submit</button>
                      <button
                        className="SubmitBtn"
                        type="button"
                        onClick={() => resetForm()}
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
      )}

      {/* Edit */}
      {editWarehouseModal ? (
        <Modals
          title={"Edit Warehouse User Registration"}
          show={editWarehouseModal}
          handleClose={handleCloseEditWarehouseModal}
          size="xl"
          centered
        >
          <form onSubmit={handleSubmit}>
            <div className="row align-items-center">
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Address</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData?.address}
                    onChange={handleChange}
                    maxLength={500}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
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
                    className="w-100"
                  >
                    {console.log(
                      getAllAuctionCenter,
                      onChangesAuctionCenterId,
                      "getAllAuctionCentergetAllAuctionCenter"
                    )}
                    {getAllAuctionCenter?.map((AuctionCenter) => (
                      <MenuItem
                        key={AuctionCenter?.auctionCenterId}
                        value={AuctionCenter?.auctionCenterName} // Change to auctionCenterId
                      >
                        <Checkbox
                          checked={
                            onChangesAuctionCenterId.indexOf(
                              AuctionCenter?.auctionCenterName
                            ) > -1
                          }
                        />
                        <ListItemText
                          primary={AuctionCenter?.auctionCenterName}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                  {auctionCenterIdError && (
                    <p className="errorLabel">{auctionCenterIdError}</p>
                  )}
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
                    value={formData?.city}
                    onChange={handleChange}
                    maxLength={50}
                    disabled={disabled}
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
                    value={formData && formData.contactPerson}
                    onChange={handleChange}
                    maxLength={100}
                    disabled={disabled}
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
                    value={formData?.email}
                    onChange={handleChange}
                    maxLength={50}
                    disabled={disabled}
                  />
                </div>
              </div>
              {isEdit == true ? (
                <>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Entity Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="entityCode"
                        value={formData?.entityCode}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Fax</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="fax"
                    value={formData?.fax}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
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
                    value={formData?.gstNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Mobile No</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobileNo"
                    value={formData?.mobileNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
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
                    value={formData?.panNo}
                    onChange={handleChange}
                    maxLength={10}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Phone </label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="phoneNo"
                    value={formData?.phoneNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Short Name</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="shortName"
                    value={formData?.shortName}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>State Name</label>
                  <label className="errorLabel"> * </label>
                  <select
                    name="stateId"
                    value={formData?.stateId}
                    onChange={handleChange}
                    className="form-control select-form"
                    maxLength={500}
                    disabled={disabled}
                  >
                    <option>Select State</option>
                    {StateList?.map((StateList, index) => (
                      <option key={index} value={StateList.stateId}>
                        {StateList.stateName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>State Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="StateCode"
                    value={StateCode}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Tax Id No</label>
                  <input
                    type="text"
                    className="form-control"
                    name="taxIdentityNo"
                    value={formData?.taxIdentityNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Teaboard Reg No</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="teaBoardRegistrationNo"
                    value={formData?.teaBoardRegistrationNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Ware House Code</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="wareHouseCode"
                    value={formData?.wareHouseCode}
                    onChange={handleChange}
                    maxLength={10}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Ware House Name</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="wareHouseName"
                    value={formData?.wareHouseName}
                    onChange={handleChange}
                    maxLength={50}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Ware House License No</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="wareHouseLicenseNo"
                    value={formData?.wareHouseLicenseNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
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

              {isEdit == true && (
                <div className="col-auto">
                  <div className="FomrGroup">
                    <label>Status</label>

                    <div className="d-flex CheckboxGroup">
                      <>
                        <div className="d-flex">
                          <div class="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="isActive"
                              value={1}
                              onChange={handleChange}
                              checked={formData?.isActive === 1}
                            />
                            <label className="form-check-label">Active</label>
                          </div>
                          &nbsp;&nbsp;
                          <div class="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="isActive"
                              value={2}
                              onChange={handleChange}
                              checked={formData?.isActive === 2}
                            />
                            <label className="form-check-label">Inactive</label>
                          </div>
                          &nbsp;&nbsp;
                          <div class="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="isActive"
                              value={3}
                              onChange={handleChange}
                              checked={formData?.isActive === 3}
                            />
                            <label className="form-check-label">Suspend</label>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              )}
              <div className="col-12">
                {auctioneerGstDtoList?.length > 0 ? (
                  <>
                    <div className="GSTBox">
                      {auctioneerGstDtoList &&
                        auctioneerGstDtoList.map((data, index) => (
                          <>
                            {!data.statePresent ? (
                              <div className="row mt-2">
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
                                      value={data?.stateName}
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
                                      value={data?.gstNo}
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
                                    <label> Address</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={data?.address}
                                      onChange={(e) =>
                                        tempAuctionCenterDataChange(
                                          "address",
                                          e.target.value,
                                          data.stateId
                                        )
                                      }
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
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <UploadMultipleDocuments
                  onFileSelect={handleFileUpload}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  uploadDocumentError={uploadDocumentError}
                  inputId="UploadWarehouseUser"
                />
                <div className="form-group my-3">
                  <label>Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.uploadDocumentRemarks}
                    onChange={handleChange}
                    name="uploadDocumentRemarks"
                  />
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-auto">
                <div className="BtnGroup">
                  <button className={"SubmitBtn"}>Update</button>
                </div>
              </div>
            </div>
          </form>
        </Modals>
      ) : (
        ""
      )}

      {/* View */}
      {viewWarehouseModal ? (
        <Modals
          title={"View Warehouse User Registration"}
          show={viewWarehouseModal}
          handleClose={handleCloseViewWarehouseModal}
          size="xl"
          centered
        >
          <form onSubmit={handleSubmit}>
            <div className="row align-items-center">
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Address</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData?.address}
                    onChange={handleChange}
                    maxLength={500}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
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
                    className="w-100"
                  >
                    {getAllAuctionCenter?.map((AuctionCenter) => (
                      <MenuItem
                        key={AuctionCenter?.auctionCenterId}
                        value={AuctionCenter?.auctionCenterId} // Change to auctionCenterId
                      >
                        <Checkbox
                          checked={
                            onChangesAuctionCenterId.indexOf(
                              AuctionCenter?.auctionCenterId
                            ) > -1
                          }
                        />
                        <ListItemText
                          primary={AuctionCenter?.auctionCenterName}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                  {auctionCenterIdError && (
                    <p className="errorLabel">{auctionCenterIdError}</p>
                  )}
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
                    value={formData?.city}
                    onChange={handleChange}
                    maxLength={50}
                    disabled={disabled}
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
                    value={formData && formData.contactPerson}
                    onChange={handleChange}
                    maxLength={100}
                    disabled={disabled}
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
                    value={formData?.email}
                    onChange={handleChange}
                    maxLength={50}
                    disabled={disabled}
                  />
                </div>
              </div>
              {isEdit == true ? (
                <>
                  <div className="col-md-2">
                    <div className="FomrGroup">
                      <label>Entity Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="entityCode"
                        value={formData?.entityCode}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Fax</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="fax"
                    value={formData?.fax}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
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
                    value={formData?.gstNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Mobile No</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobileNo"
                    value={formData?.mobileNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
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
                    value={formData?.panNo}
                    onChange={handleChange}
                    maxLength={10}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Phone </label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="phoneNo"
                    value={formData?.phoneNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Short Name</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="shortName"
                    value={formData?.shortName}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>State Name</label>
                  <label className="errorLabel"> * </label>
                  <select
                    name="stateId"
                    value={formData?.stateId}
                    onChange={handleChange}
                    className="form-control select-form"
                    maxLength={500}
                    disabled={disabled}
                  >
                    <option>Select State</option>
                    {StateList?.map((StateList, index) => (
                      <option key={index} value={StateList.stateId}>
                        {StateList.stateName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>State Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="StateCode"
                    value={StateCode}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Tax Id No</label>
                  <input
                    type="text"
                    className="form-control"
                    name="taxIdentityNo"
                    value={formData?.taxIdentityNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Teaboard Reg No</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="teaBoardRegistrationNo"
                    value={formData?.teaBoardRegistrationNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Ware House Code</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="wareHouseCode"
                    value={formData?.wareHouseCode}
                    onChange={handleChange}
                    maxLength={10}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Ware House Name</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="wareHouseName"
                    value={formData?.wareHouseName}
                    onChange={handleChange}
                    maxLength={50}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="FomrGroup">
                  <label>Ware House License No</label>
                  <label className="errorLabel"> * </label>
                  <input
                    type="text"
                    className="form-control"
                    name="wareHouseLicenseNo"
                    value={formData?.wareHouseLicenseNo}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={disabled}
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

              {isEdit == true && (
                <div className="col-auto">
                  <div className="FomrGroup">
                    <label>Status</label>

                    <div className="d-flex CheckboxGroup">
                      <>
                        <div className="d-flex">
                          <div class="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="isActive"
                              value={1}
                              onChange={handleChange}
                              checked={formData?.isActive === 1}
                            />
                            <label className="form-check-label">Active</label>
                          </div>
                          &nbsp;&nbsp;
                          <div class="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="isActive"
                              value={2}
                              onChange={handleChange}
                              checked={formData?.isActive === 2}
                            />
                            <label className="form-check-label">Inactive</label>
                          </div>
                          &nbsp;&nbsp;
                          <div class="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="isActive"
                              value={3}
                              onChange={handleChange}
                              checked={formData?.isActive === 3}
                            />
                            <label className="form-check-label">Suspend</label>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              )}
              <div className="col-12">
                {auctioneerGstDtoList?.length > 0 ? (
                  <>
                    <div className="GSTBox">
                      {auctioneerGstDtoList &&
                        auctioneerGstDtoList.map((data, index) => (
                          <>
                            {!data.statePresent ? (
                              <div className="row mt-2">
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
                                      value={data?.stateName}
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
                                      value={data?.gstNo}
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
                                    <label> Address</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={data?.address}
                                      onChange={(e) =>
                                        tempAuctionCenterDataChange(
                                          "address",
                                          e.target.value,
                                          data.stateId
                                        )
                                      }
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
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <UploadMultipleDocuments
                  onFileSelect={handleFileUpload}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  uploadDocumentError={uploadDocumentError}
                  inputId="UploadWarehouseUser"
                />
                <div className="form-group my-3">
                  <label>Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.uploadDocumentRemarks}
                    onChange={handleChange}
                    name="uploadDocumentRemarks"
                  />
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-auto">
                <div className="BtnGroup">
                  {childUser
                    .filter((user) => user.linkId === 26)
                    ?.map((ele) => ele.rightIds)
                    ?.at(0)
                    ?.includes("9") && (
                    <button
                      class="SubmitBtn"
                      type="button"
                      onClick={() => handleViewExport("excel")}
                    >
                      <i class="fa fa-file-excel"></i>
                    </button>
                  )}

                  {childUser
                    .filter((user) => user.linkId === 26)
                    ?.map((ele) => ele.rightIds)
                    ?.at(0)
                    ?.includes("8") && (
                    <button
                      class="SubmitBtn"
                      type="button"
                      onClick={() => handleViewExport("pdf")}
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

      {/* Manage & Search */}
      {modalRight
        ?.map((ele) => ele.rightIds)
        ?.at(0)
        ?.includes("12") && (
        <Accordion
          expanded={expanded === "panel2"}
          className={`${expanded === "panel2" ? "active" : ""}`}
          onChange={handleChangeExpand("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Manage Warehouse User </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <form onSubmit={handleSearch}>
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <div className="FomrGroup">
                      <label>Ware House Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="wareHouseCode"
                        value={searchData.wareHouseCode}
                        onChange={handleSearchWarehouse}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="FomrGroup">
                      <label>Ware House Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="wareHouseName"
                        value={searchData.wareHouseName}
                        onChange={handleSearchWarehouse}
                      />
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="BtnGroup">
                      <button className="SubmitBtn">Search</button>
                      <button
                        className="SubmitBtn"
                        onClick={() => ClearSearch()}
                        type="button"
                      >
                        Clear
                      </button>

                      <button
                        class="SubmitBtn"
                        type="button"
                        onClick={() => handleViewExport("excel")}
                      >
                        <i class="fa fa-file-excel"></i>
                      </button>

                      <button
                        class="SubmitBtn"
                        type="button"
                        onClick={() => handleViewExport("pdf")}
                      >
                        <i class="fa fa-file-pdf"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <div className="TableBox">
                      <table className="table">
                        <thead>
                          <tr>
                            <th rowSpan={2}>Sr.</th>
                            <th rowSpan={2}>Ware House Code</th>
                            <th rowSpan={2}>Contact Name</th>
                            <th rowSpan={2}>Ware House Name</th>
                            <th rowSpan={2}>
                              Tea Board Registration Certificate Number
                            </th>
                            <th colSpan={3} className="text-center">
                              Contact Detail
                            </th>
                            <th colSpan={2} className="text-center">
                              Tax Detail
                            </th>
                            <th rowSpan={2}>Status</th>
                            <th rowSpan={2}>Action</th>
                          </tr>
                          <tr>
                            <th className="text-center">Phone Number</th>
                            <th className="text-center">Mobile Number </th>
                            <th className="text-center">Email ID</th>
                            <th className="text-center">GST Number</th>
                            <th className="text-center">PAN Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {RegUsers?.length > 0 ? (
                            <>
                              {RegUsers?.map((warehouse, index) => (
                                <tr key={warehouse.wareHouseUserRegId}>
                                  <td>{index + 1}</td>
                                  <td>{warehouse.wareHouseCode}</td>
                                  <td>{warehouse.contactPerson}</td>
                                  <td>{warehouse.wareHouseName}</td>
                                  <td>{warehouse.teaBoardRegistrationNo}</td>
                                  <td className="Phone">
                                    <i className="fa fa-phone"></i> &nbsp;
                                    {warehouse.phoneNo}
                                  </td>
                                  <td className="Mobile">
                                    <i class="fas fa-mobile-alt"></i> &nbsp;
                                    {warehouse.mobileNo}
                                  </td>
                                  <td className="Email">
                                    <i className="fa fa-envelope"></i> &nbsp;
                                    {warehouse.email}
                                  </td>
                                  <td>{warehouse.gstNo}</td>
                                  <td>{warehouse.panNo}</td>

                                  <td
                                    className={`Status ${
                                      warehouse.isActive == 1
                                        ? "Active"
                                        : warehouse.isActive == 2
                                        ? "Inactive"
                                        : warehouse.isActive === 3
                                        ? "Suspend"
                                        : ""
                                    }`}
                                  >
                                    {warehouse.isActive == 1
                                      ? "Active"
                                      : warehouse.isActive == 2
                                      ? "Inactive"
                                      : warehouse.isActive == 3
                                      ? "Suspend"
                                      : ""}
                                  </td>
                                  <td className="Action">
                                    <>
                                      {modalRight
                                        ?.map((ele) => ele.rightIds)
                                        ?.at(0)
                                        ?.includes("2") && (
                                        <Tooltip title="Edit" placement="top">
                                          <i
                                            className="fa fa-edit"
                                            onClick={() =>
                                              EditUserData(
                                                warehouse.wareHouseUserRegId
                                              )
                                            }
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
                                            onClick={() =>
                                              ViewUserData(
                                                warehouse.wareHouseUserRegId
                                              )
                                            }
                                          ></i>
                                        </Tooltip>
                                      )}
                                      {modalRight
                                        ?.map((ele) => ele.rightIds)
                                        ?.at(0)
                                        ?.includes("4") && (
                                        <Tooltip
                                          title="History"
                                          placement="top"
                                        >
                                          <i
                                            className="fa fa-history"
                                            onClick={() =>
                                              ShowWarehouseHistory(
                                                warehouse.wareHouseUserRegId
                                              )
                                            }
                                          ></i>
                                        </Tooltip>
                                      )}

                                      {childUser.some(
                                        (user) => user.linkId === 26
                                      ) && (
                                        <Tooltip title="Add" placement="top">
                                          <i
                                            className="fa fa-plus"
                                            onClick={() =>
                                              AddNewSubUser(
                                                warehouse.wareHouseUserRegId
                                              )
                                            }
                                          ></i>
                                        </Tooltip>
                                      )}

                                      {1 == warehouse.bankAccountStatus ? (
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
                                              value={
                                                warehouse.walletRequestMessage
                                              }
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
                                    </>
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            <>
                              <tr>
                                <td colSpan={12}>
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
                    <div className="BtnGroup text-center justify-content-center">
                      <button class="SubmitBtn" onClick={handleViewMore}>
                        View More
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Upload Document */}
      {modalRight
        ?.map((ele) => ele.rightIds)
        ?.at(0)
        ?.includes("6") && (
        <Accordion
          expanded={expanded === "panel3"}
          className={`${expanded === "panel3" ? "active" : ""}`}
          onChange={handleChangeExpand("panel3")}
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
                      <th>Warehouse Name</th>
                      <th>Document Brief/Remarks</th>
                      <th>Document upload date and time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UploadedDocuemnt?.length > 0 ? (
                      <>
                        {UploadedDocuemnt &&
                          UploadedDocuemnt.map((document, index) => (
                            <tr key={document.id}>
                              <td>{index + 1}</td>
                              <td>{document.fieldValue}</td>
                              <td>{document.uploadDocumentRemarks}</td>
                              <td>{document.documentUploadTime}</td>
                              <td className="Action">
                                <>
                                  {modalRight
                                    ?.map((ele) => ele.rightIds)
                                    ?.at(0)
                                    ?.includes("3") && (
                                    <i className="fa fa-eye" title="Preview"></i>
                                  )}
                                  {modalRight
                                    ?.map((ele) => ele.rightIds)
                                    ?.at(0)
                                    ?.includes("7") && (
                                    <i
                                      className="fa fa-download"
                                      onClick={() => {
                                        handleDownloadClick(
                                          document.uploadDocumentConfId
                                        );
                                        handleDownloadPDF();
                                      }}
                                    ></i>
                                  )}
                                </>
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

      {/* Warehouse History */}
      {showmodalWarehouseHistory && (
        <Modal
          show={showmodalWarehouseHistory}
          onHide={hideWarehouseHistory}
          size="xl"
          centered
        >
          <Modal.Header>
            <Modal.Title>Warehouse History</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={() => hideWarehouseHistory()}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <WarehouseHistory />
          </Modal.Body>
        </Modal>
      )}

      {/* Warehouse Unit */}
      {showmodal && (
        <Modal show={showmodal} onHide={SubUSerClose} size="xl" centered>
          <Modal.Header>
            <Modal.Title>Warehouse Unit Registration</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={() => CloseUnitModal()}
            ></i>
          </Modal.Header>
          <Modal.Body>
            {/* Warehouse Unit Create */}
            {childUser
              .filter((user) => user.linkId === 26)
              ?.map((ele) => ele.rightIds)
              ?.at(0)
              ?.includes("1") && (
              <Accordion
                expanded={expandedSub === "panel1"}
                className={`${expandedSub === "panel1" ? "active" : ""}`}
                onChange={handleChangeExpandSub("panel1")}
                TransitionProps={{ unmountOnExit: true }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Create Warehouse Unit Registration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <form onSubmit={handleSubmitForUnit}>
                      <div className="row align-items-center">
                        <div className="col-md-2 d-none">
                          <div className="FomrGroup">
                            <label>wareHouseUserRegId</label>
                            <input
                              type="text"
                              className="form-control"
                              name="wareHouseUserRegId"
                              value={formDataUnit?.wareHouseUserRegId}
                              maxLength={500}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Address</label>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              value={formDataUnit?.address}
                              maxLength={500}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>City</label>
                            <input
                              type="text"
                              className="form-control"
                              name="city"
                              value={formDataUnit?.city}
                              maxLength={50}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Contact Person</label>
                            <input
                              type="text"
                              className="form-control"
                              name="contactPerson"
                              value={formDataUnit?.contactPerson}
                              maxLength={100}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>E Mail</label>
                            <input
                              type="text"
                              className="form-control"
                              name="email"
                              value={formDataUnit?.email}
                              maxLength={50}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Entity Code</label>
                            <input
                              type="text"
                              className="form-control"
                              name="entityCode"
                              value={formDataUnit?.entityCode}
                              disabled
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
                              value={formDataUnit?.fax}
                              maxLength={15}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Mobile No</label>
                            <input
                              type="text"
                              className="form-control"
                              name="mobileNo"
                              value={formDataUnit?.mobileNo}
                              maxLength={15}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Phone: </label>
                            <input
                              type="text"
                              className="form-control"
                              name="phoneNo"
                              value={formDataUnit?.phoneNo}
                              maxLength={15}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Short Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="shortName"
                              value={formDataUnit?.shortName}
                              maxLength={15}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Teaboard Reg No</label>
                            <input
                              type="text"
                              className="form-control"
                              name="teaBoardRegistrationNo"
                              value={formDataUnit?.teaBoardRegistrationNo}
                              maxLength={15}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Ware House Unit Code</label>
                            <label className="errorLabel"> * </label>
                            <input
                              type="text"
                              className="form-control"
                              name="wareHouseUnitCode"
                              value={formDataUnit?.wareHouseUnitCode}
                              onChange={handleChangeForUnit}
                              maxLength={50}
                              disabled={warehouseDisabled}
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Ware House Unit Name</label>
                            <label className="errorLabel"> * </label>
                            <input
                              type="text"
                              className="form-control"
                              name="wareHouseUnitName"
                              value={formDataUnit?.wareHouseUnitName}
                              onChange={handleChangeForUnit}
                              maxLength={50}
                              disabled={warehouseDisabled}
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Ware House License No</label>
                            <input
                              type="text"
                              className="form-control"
                              name="wareHouseLicenseNo"
                              value={formDataUnit?.wareHouseLicenseNo}
                              maxLength={50}
                              disabled
                            />
                          </div>
                        </div>

                        {isUnitEdit && (
                          <div className="col-auto">
                            <div className="FomrGroup">
                              <label>Status</label>

                              <div className="d-flex CheckboxGroup">
                                <div className="d-flex">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="isActive"
                                      value={1}
                                      onChange={handleChangeForUnit}
                                      checked={formDataUnit?.isActive == 1}
                                    />
                                    <label className="form-check-label">
                                      Active
                                    </label>
                                  </div>
                                  &nbsp;&nbsp;
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="isActive"
                                      value={2}
                                      onChange={handleChangeForUnit}
                                      checked={formDataUnit?.isActive == 2}
                                    />
                                    <label className="form-check-label">
                                      Inactive
                                    </label>
                                  </div>
                                  &nbsp;&nbsp;
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="isActive"
                                      value={3}
                                      onChange={handleChangeForUnit}
                                      checked={formDataUnit?.isActive == 3}
                                    />
                                    <label className="form-check-label">
                                      Suspend
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <UploadMultipleDocuments
                            onFileSelect={handleFileUploadForUnit}
                            uploadedFiles={uploadedFilesUnit}
                            setUploadedFiles={setUploadedFilesUnit}
                            uploadDocumentError={uploadDocumentError}
                            inputId="UploadWarehouseUnit"
                          />
                          <div className="form-group my-3">
                            <label>Remarks</label>
                            <input
                              type="text"
                              className="form-control"
                              onChange={handleChangeForUnit}
                              value={formDataUnit.uploadDocumentRemarks}
                              name="uploadDocumentRemarks"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12">
                          <div className="BtnGroup">
                            <button className={"SubmitBtn"}>Submit</button>
                            <button
                              className="SubmitBtn"
                              type="button"
                              onClick={() => resetFormUnit()}
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
            )}

            {/* Warehouse Unit Edit */}
            {editWarehouseUnitModal ? (
              <Modals
                title={"Edit Warehouse Unit"}
                show={editWarehouseUnitModal}
                handleClose={handleCloseEditWarehouseUnitModal}
                size="xl"
                centered
              >
                <form onSubmit={handleSubmitForUnit}>
                  <div className="row align-items-center">
                    <div className="col-md-2 d-none">
                      <div className="FomrGroup">
                        <label>wareHouseUserRegId</label>
                        <input
                          type="text"
                          className="form-control"
                          name="wareHouseUserRegId"
                          value={formDataUnit?.wareHouseUserRegId}
                          maxLength={500}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={formDataUnit?.address}
                          maxLength={500}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formDataUnit?.city}
                          maxLength={50}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Contact Person</label>
                        <input
                          type="text"
                          className="form-control"
                          name="contactPerson"
                          value={formDataUnit?.contactPerson}
                          maxLength={100}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>E Mail</label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          value={formDataUnit?.email}
                          maxLength={50}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Entity Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="entityCode"
                          value={formDataUnit?.entityCode}
                          disabled
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
                          value={formDataUnit?.fax}
                          maxLength={15}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Mobile No</label>
                        <input
                          type="text"
                          className="form-control"
                          name="mobileNo"
                          value={formDataUnit?.mobileNo}
                          maxLength={15}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Phone: </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phoneNo"
                          value={formDataUnit?.phoneNo}
                          maxLength={15}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Short Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="shortName"
                          value={formDataUnit?.shortName}
                          maxLength={15}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Teaboard Reg No</label>
                        <input
                          type="text"
                          className="form-control"
                          name="teaBoardRegistrationNo"
                          value={formDataUnit?.teaBoardRegistrationNo}
                          maxLength={15}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Ware House Unit Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="wareHouseUnitCode"
                          value={formDataUnit?.wareHouseUnitCode}
                          onChange={handleChangeForUnit}
                          maxLength={50}
                          disabled={warehouseDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Ware House Unit Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="wareHouseUnitName"
                          value={formDataUnit?.wareHouseUnitName}
                          onChange={handleChangeForUnit}
                          maxLength={50}
                          disabled={warehouseDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Ware House License No</label>
                        <input
                          type="text"
                          className="form-control"
                          name="wareHouseLicenseNo"
                          value={formDataUnit?.wareHouseLicenseNo}
                          maxLength={50}
                          disabled
                        />
                      </div>
                    </div>

                    {isUnitEdit && (
                      <div className="col-auto">
                        <div className="FomrGroup">
                          <label>Status</label>

                          <div className="d-flex CheckboxGroup">
                            <div className="d-flex">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={1}
                                  onChange={handleChangeForUnit}
                                  checked={formDataUnit?.isActive == 1}
                                />
                                <label className="form-check-label">
                                  Active
                                </label>
                              </div>
                              &nbsp;&nbsp;
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={2}
                                  onChange={handleChangeForUnit}
                                  checked={formDataUnit?.isActive == 2}
                                />
                                <label className="form-check-label">
                                  Inactive
                                </label>
                              </div>
                              &nbsp;&nbsp;
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={3}
                                  onChange={handleChangeForUnit}
                                  checked={formDataUnit?.isActive == 3}
                                />
                                <label className="form-check-label">
                                  Suspend
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <UploadMultipleDocuments
                        onFileSelect={handleFileUploadForUnit}
                        uploadedFiles={uploadedFilesUnit}
                        setUploadedFiles={setUploadedFilesUnit}
                        uploadDocumentError={uploadDocumentError}
                        inputId="UploadWarehouseUnit"
                      />
                      <div className="form-group my-3">
                        <label>Remarks</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={handleChangeForUnit}
                          value={formDataUnit.uploadDocumentRemarks}
                          name="uploadDocumentRemarks"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="BtnGroup">
                        <button
                          className={"SubmitBtn"}
                          onClick={() => SaveUpdatedForUnit()}
                        >
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

            {/* Warehouse Unit View */}
            {viewWarehouseUnitModal ? (
              <Modals
                title={"View Warehouse Unit"}
                show={viewWarehouseUnitModal}
                handleClose={handleCloseViewWarehouseUnitModal}
                size="xl"
                centered
              >
                {" "}
                <form onSubmit={handleSubmitForUnit}>
                  <div className="row align-items-center">
                    <div className="col-md-2 d-none">
                      <div className="FomrGroup">
                        <label>wareHouseUserRegId</label>
                        <input
                          type="text"
                          className="form-control"
                          name="wareHouseUserRegId"
                          value={formDataUnit?.wareHouseUserRegId}
                          maxLength={500}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={formDataUnit?.address}
                          maxLength={500}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formDataUnit?.city}
                          maxLength={50}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Contact Person</label>
                        <input
                          type="text"
                          className="form-control"
                          name="contactPerson"
                          value={formDataUnit?.contactPerson}
                          maxLength={100}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>E Mail</label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          value={formDataUnit?.email}
                          maxLength={50}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Entity Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="entityCode"
                          value={formDataUnit?.entityCode}
                          disabled
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
                          value={formDataUnit?.fax}
                          maxLength={15}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Mobile No</label>
                        <input
                          type="text"
                          className="form-control"
                          name="mobileNo"
                          value={formDataUnit?.mobileNo}
                          maxLength={15}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Phone: </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phoneNo"
                          value={formDataUnit?.phoneNo}
                          maxLength={15}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Short Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="shortName"
                          value={formDataUnit?.shortName}
                          maxLength={15}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Teaboard Reg No</label>
                        <input
                          type="text"
                          className="form-control"
                          name="teaBoardRegistrationNo"
                          value={formDataUnit?.teaBoardRegistrationNo}
                          maxLength={15}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Ware House Unit Code</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="wareHouseUnitCode"
                          value={formDataUnit?.wareHouseUnitCode}
                          onChange={handleChangeForUnit}
                          maxLength={50}
                          disabled={warehouseDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Ware House Unit Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="wareHouseUnitName"
                          value={formDataUnit?.wareHouseUnitName}
                          onChange={handleChangeForUnit}
                          maxLength={50}
                          disabled={warehouseDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="FomrGroup">
                        <label>Ware House License No</label>
                        <input
                          type="text"
                          className="form-control"
                          name="wareHouseLicenseNo"
                          value={formDataUnit?.wareHouseLicenseNo}
                          maxLength={50}
                          disabled
                        />
                      </div>
                    </div>

                    {isUnitEdit && (
                      <div className="col-auto">
                        <div className="FomrGroup">
                          <label>Status</label>

                          <div className="d-flex CheckboxGroup">
                            <div className="d-flex">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={1}
                                  onChange={handleChangeForUnit}
                                  checked={formDataUnit?.isActive == 1}
                                />
                                <label className="form-check-label">
                                  Active
                                </label>
                              </div>
                              &nbsp;&nbsp;
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={2}
                                  onChange={handleChangeForUnit}
                                  checked={formDataUnit?.isActive == 2}
                                />
                                <label className="form-check-label">
                                  Inactive
                                </label>
                              </div>
                              &nbsp;&nbsp;
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="isActive"
                                  value={3}
                                  onChange={handleChangeForUnit}
                                  checked={formDataUnit?.isActive == 3}
                                />
                                <label className="form-check-label">
                                  Suspend
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <UploadMultipleDocuments
                        onFileSelect={handleFileUploadForUnit}
                        uploadedFiles={uploadedFilesUnit}
                        setUploadedFiles={setUploadedFilesUnit}
                        uploadDocumentError={uploadDocumentError}
                        inputId="UploadWarehouseUnit"
                      />
                      <div className="form-group my-3">
                        <label>Remarks</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={handleChangeForUnit}
                          value={formDataUnit.uploadDocumentRemarks}
                          name="uploadDocumentRemarks"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="BtnGroup">
                        <button
                          class="SubmitBtn"
                          type="button"
                          onClick={() => handleViewExport("excel")}
                        >
                          <i class="fa fa-file-excel"></i>
                        </button>
                        <button
                          class="SubmitBtn"
                          type="button"
                          onClick={() => handleViewExport("pdf")}
                        >
                          <i class="fa fa-file-pdf"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </Modals>
            ) : (
              ""
            )}

            {/* Warehouse Unit Manage & Search */}
            {childUser
              .filter((user) => user.linkId === 26)
              ?.map((ele) => ele.rightIds)
              ?.at(0)
              ?.includes("12") && (
              <Accordion
                expanded={expandedSub === "panel2"}
                className={`${expandedSub === "panel2" ? "active" : ""}`}
                onChange={handleChangeExpandSub("panel2")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Manage Warehouse Unit</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <form onSubmit={handleUnitSearchSubmit}>
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Ware House Unit Code</label>
                            <input
                              type="text"
                              className="form-control"
                              name="wareHouseUnitCode"
                              value={unitSearchData.wareHouseUnitCode}
                              onChange={handleSearchUnit}
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Ware House Unit Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="wareHouseUnitName"
                              value={unitSearchData.wareHouseUnitName}
                              onChange={handleSearchUnit}
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>
                              Tea Board Registration Certificate Number
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="teaBoardRegistrationNo"
                              value={unitSearchData.teaBoardRegistrationNo}
                              onChange={handleSearchUnit}
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
                              value={unitSearchData.email}
                              onChange={handleSearchUnit}
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
                              value={unitSearchData.gstNo}
                              onChange={handleSearchUnit}
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
                              value={unitSearchData.panNo}
                              onChange={handleSearchUnit}
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="FomrGroup">
                            <label>Status</label>
                            <select
                              className="form-control select-form"
                              value={unitSearchData.Status}
                              onChange={handleSearchUnit}
                              name="status"
                            >
                              <option>Select Status</option>
                              {Status?.map((status, index) => (
                                <option value={status.id}>
                                  {status.status}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-12 mb-3">
                          <div className="BtnGroup">
                            <button className="SubmitBtn">Search</button>
                            <button
                              className="SubmitBtn"
                              onClick={() => ClearUnitSearch()}
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        {isViewUnit == true ? (
                          <>
                            {childUser
                              .filter((user) => user.linkId === 26)
                              ?.map((ele) => ele.rightIds)
                              ?.at(0)
                              ?.includes("11") && (
                              <button
                                class="SubmitBtn"
                                onClick={() => handleUnitViewExport("excel")}
                              >
                                <i class="fa fa-file-excel"></i>
                              </button>
                            )}
                            {childUser
                              .filter((user) => user.linkId === 26)
                              ?.map((ele) => ele.rightIds)
                              ?.at(0)
                              ?.includes("10") && (
                              <button
                                class="SubmitBtn"
                                onClick={() => handleUnitViewExport("pdf")}
                              >
                                <i class="fa fa-file-pdf"></i>
                              </button>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </form>
                    <div className="row">
                      <div className="col-12">
                        <div className="TableBox">
                          <table className="table">
                            <thead>
                              <tr>
                                <th rowSpan={2}>Sr.</th>
                                <th rowSpan={2}>Ware House Unit Code</th>
                                <th rowSpan={2}>Contact Name</th>
                                <th rowSpan={2}>Ware House Unit Name</th>
                                <th rowSpan={2}>
                                  Tea Board Registration Certificate Number
                                </th>

                                <th colSpan={3} className="text-center">
                                  Contact Detail
                                </th>
                                <th colSpan={2} className="text-center">
                                  Tax Detail
                                </th>
                                <th rowSpan={2}>Status</th>
                                <th rowSpan={2}>Action</th>
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
                              {unitsearch?.length > 0 ? (
                                <>
                                  {unitsearch?.map((unit, index) => (
                                    <tr key={unit.id}>
                                      <td>{index + 1}</td>
                                      <td>{unit.wareHouseUnitCode}</td>
                                      <td>{unit.contactPerson}</td>
                                      <td>{unit.wareHouseUnitName}</td>
                                      <td>{unit.teaBoardRegistrationNo}</td>

                                      <td className="Phone">
                                        <i className="fas fa-phone"></i>&nbsp;{" "}
                                        {unit.phoneNo}
                                      </td>
                                      <td className="Mobile">
                                        <i className="fa fa-mobile-alt"></i>
                                        &nbsp; {unit.mobileNo}
                                      </td>
                                      <td className="Email">
                                        <i className="fa fa-envelope"></i>&nbsp;{" "}
                                        {unit.email}
                                      </td>
                                      <td>{unit.gstNo}</td>
                                      <td>{unit.panNo}</td>
                                      <td
                                        className={`Status ${
                                          unit.isActive === 1
                                            ? "Active"
                                            : unit.isActive === 2
                                            ? "Inactive"
                                            : unit.isActive === 3
                                            ? "Suspend"
                                            : ""
                                        }`}
                                      >
                                        {unit.isActive === 1
                                          ? "Active"
                                          : unit.isActive === 2
                                          ? "Inactive"
                                          : unit.isActive === 3
                                          ? "Suspend"
                                          : ""}
                                      </td>
                                      <td className="Action">
                                        {childUser
                                          .filter((user) => user.linkId === 26)
                                          ?.map((ele) => ele.rightIds)
                                          ?.at(0)
                                          ?.includes("2") && (
                                          <Tooltip title="Edit" placement="top">
                                            <i
                                              className="fa fa-edit"
                                              onClick={() =>
                                                EditUnit(
                                                  unit.wareHouseunitRegId
                                                )
                                              }
                                            ></i>
                                          </Tooltip>
                                        )}

                                        {childUser
                                          .filter((user) => user.linkId === 26)
                                          ?.map((ele) => ele.rightIds)
                                          ?.at(0)
                                          ?.includes("3") && (
                                          <Tooltip title="View" placement="top">
                                            <i
                                              className="fa fa-eye"
                                              onClick={() =>
                                                ViewUniWareHouse(
                                                  unit.wareHouseunitRegId
                                                )
                                              }
                                            ></i>
                                          </Tooltip>
                                        )}

                                        {childUser
                                          .filter((user) => user.linkId === 26)
                                          ?.map((ele) => ele.rightIds)
                                          ?.at(0)
                                          ?.includes("4") && (
                                          <Tooltip
                                            title="History"
                                            placement="top"
                                          >
                                            <i
                                              className="fa fa-history"
                                              onClick={() =>
                                                ShowUnitHistory(
                                                  unit.wareHouseunitRegId
                                                )
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
                                    <td colSpan={12}>
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
                      </div>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Warehouse Unit Upload Document */}
            {childUser
              .filter((user) => user.linkId === 26)
              ?.map((ele) => ele.rightIds)
              ?.at(0)
              ?.includes("6") && (
              <Accordion
                expanded={expandedSub === "panel3"}
                className={`${expandedSub === "panel3" ? "active" : ""}`}
                onChange={handleChangeExpandSub("panel3")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3a-content"
                  id="panel3a-header"
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
                            <th>Warehouse Unit Name</th>
                            <th>Document Brief/Remarks</th>
                            <th>Document upload date and time</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {unitDocument?.length > 0 ? (
                            <>
                              {unitDocument &&
                                unitDocument?.map((document, index) => (
                                  <tr key={document.id}>
                                    <td>{index + 1}</td>
                                    <td>{document.fieldValue}</td>
                                    <td>{document.uploadDocumentRemarks}</td>
                                    <td>{document.documentUploadTime}</td>
                                    <td className="Action">
                                      <i className="fa fa-eye"  title="Preview"></i>
                                      {childUser
                                        .filter((user) => user.linkId === 26)
                                        ?.map((ele) => ele.rightIds)
                                        ?.at(0)
                                        ?.includes("7") && (
                                        <i
                                          className="fa fa-download"
                                          onClick={() => {
                                            handleDownloadClick(
                                              document.uploadDocumentConfId
                                            );
                                            handleDownloadPDF();
                                          }}
                                        ></i>
                                      )}
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
          </Modal.Body>
        </Modal>
      )}

      {/* Warehouse Unit History */}
      {showmodalWarehouseUnitHistory && (
        <Modal
          show={showmodalWarehouseUnitHistory}
          onHide={hideUnitHistory}
          size="xl"
          centered
        >
          <Modal.Header>
            <Modal.Title>Warehouse Unit History</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={() => hideUnitHistory()}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <WarehouseUnitHistory />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default WarehouseUserRegistration;
