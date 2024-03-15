/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import CustomToast from "../../../components/Toast";
import { useSelector } from "react-redux";
import axiosMain from "../../../http/axios/axios_main";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CryptoJS from "crypto-js";
import {
  addWarehouseBillChargeExcelRequest,
  addWarehouseBillChargeRequest,
  bindAuctioneerRequest,
  deleteWarehouseRequest,
  fetchAuctionRequest,
  fetchBillNumberRequest,
  fetchDataRequest,
  fetchFactoryDetailRequest,
  fetchMarkRequest,
  fetchWarehouseDataRequest,
  fetchWarehouseRequest,
  getExportData,
  getExportDataApiCall,
  rejectBillRequest,
  searchUsersRequest,
  searchWarehouseBill,
} from "../../../store/actions";
import { useDispatch } from "react-redux";
import UploadMultipleDocuments from "../../uploadDocument/UploadMultipleDocuments";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";
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
import { Card } from "react-bootstrap";
import Base64ToExcelDownload from "../../Base64ToExcelDownload";
import { uploadedFileDownload } from "../../uploadDocument/UploadedFileDownload";

const currentYear = new Date().getFullYear();
const years = [];
for (let i = 0; i <= 5; i++) {
  const year = currentYear - i;
  years.push(year);
}

function AddWarehouseBillUploads() {
  const handleChangeExpandSub = (panel) => (event, isSubExpanded) => {
    setExpandedSub(isSubExpanded ? panel : false);
    if ("panel1" == panel && isSubExpanded) {
      setisEdit(false);
      reset();
    }
    if ("panel2" == panel && isSubExpanded) {
      reset();
      resetSearch();
      setRejectWarehouseDatas([]);
      dispatch(searchWarehouseBill(warehouseBillsellerSearch));
    }
  };
  const [expandedSub, setExpandedSub] = React.useState("panel1");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const dispatch = useDispatch();
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId } =
    useAuctionDetail();
  const [warehouseBill, setwarehouseBill] = useState({
    billChargeId: 0,
    billType: 0,
    markName: null,
    auctioneerName: null,
    billDate: null,
    billNumber: null,
    grossBillAmount: null,
    sgstonGrossBillAmount: null,
    cgstonGrossBillAmount: null,
    igstonGrossBillAmount: null,
    tdsRate: null,
    tdsAmount: null,
    netAmount: null,
    warehouseRemarks: null,
    cstatus: null,
    createdBy: null,
    createdOn: null,
    updatedBy: null,
    updatedOn: null,
    userId: userId,
    warehouseUserName: null,
    warehouseName: null,
    billUploadDate: null,
    sellerRemarks: null,
    markId: null,
    auctionCenterName: auctionCenterId,
  });
  const [warehouseBillsellerSearch, setwarehouseBillsellerSearch] = useState({
    markId: null,
    auctioneerName: null,
    billYear: null,
    cstatus: null,
    billType: null,
  });
  const [allMarkList, setallMarkList] = useState([]);
  const [allAuctioneerList, setallAuctioneerList] = useState([]);
  const [allAuctionCenterList, setallAuctionCenterList] = useState([]);
  const [allTeaboardRegNoList, setallTeaboardRegNoList] = useState([]);
  const [RejectWarehouseDatas, setRejectWarehouseDatas] = useState([]);
  const [ViewWarehouse, setViewWarehouse] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("manual");
  const [isEdit, setisEdit] = useState(false);
  const [uploadedDocumentsForUnit, setUploadedDocumentsForUnit] =
    useState(null);
  const [exportType, setexportType] = useState("");
  const Status = [
    { cstatus: "All", Status: null },
    { cstatus: "Pending", Status: 0 },
    { cstatus: "Accepted", Status: 1 },
    { cstatus: "Confirmed", Status: 2 },
    { cstatus: "Rejected", Status: 3 },
  ];
  const markList = useSelector((state) => state.mark.data.responseData);
  const auctineerList = useSelector(
    (state) => state.saleNoReducer.auctineerList
  );
  const getAllAuctionCenterList = useSelector(
    (res) => res.warehouseUserRegistration.auctionCenter?.responseData
  );
  const WarehouseList = useSelector(
    (res) => res.warehouseUserRegistration.userSearch.data?.responseData
  );
  const rejectWarehouseBillData = useSelector(
    (res) => res.TeaBoardRegistrationNo.tboardRegNo?.responseData
  );
  const RejectWarehouseData = useSelector(
    (res) => res.TeaBoardRegistrationNo.RejectwarehouseData?.responseData
  );
  const ViewWarehouseData = useSelector(
    (res) => res.TeaBoardRegistrationNo.ViewWarehouseData?.responseData
  );
  const warehouseManageBillData = useSelector(
    (res) => res?.WddWarehouseBillUploads?.warehouseManageBillData
  );
  const billNumbercheck = useSelector(
    (res) => res?.WddWarehouseBillUploads?.billNumber?.responseData
  );
  const warehouseManageBillById = useSelector(
    (res) => res?.WddWarehouseBillUploads?.WarehouseById?.responseData
  );
  const [sellerRemarksInputs, setSellerRemarksInputs] = useState(
    Array(RejectWarehouseDatas?.length).fill("")
  );
  const [warehouseRemarksInputs, setwarehouseRemarksInputs] = useState(
    Array(RejectWarehouseDatas?.length).fill("")
  );
  const ExportExcelDatas = useSelector(
    (state) => state.documentReducer.exportData.responseData?.exported_file
  );
  const getExportDataApiCallResponse = useSelector(
    (state) => state.documentReducer.exportDataApiCall
  );

  const handleExport = (exportType) => {
    const updatedDealBookSearch = {
      ...warehouseBillsellerSearch,
      url: "/postauction/warehouseBill/warehouse/search",
      exportType: exportType,
      isExport: 1,
    };
    setexportType(exportType);
    dispatch(getExportData(updatedDealBookSearch));
  };  
  useEffect(() => {
    if (ExportExcelDatas != null && true == getExportDataApiCallResponse) {
      dispatch(getExportDataApiCall(false));
      if ("excel" == exportType) {
        Base64ToExcelDownload(ExportExcelDatas, "View_DealBook.xlsx");
      } else {
        uploadedFileDownload(
          ExportExcelDatas,
          "View_DealBook.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });
  useEffect(() => {
    dispatch(bindAuctioneerRequest({ roleCode: "WAREHOUSE" }));
    dispatch(fetchAuctionRequest());
    dispatch(searchUsersRequest({}));
    dispatch(fetchFactoryDetailRequest({ userId: userId }));
    dispatch(fetchMarkRequest({ auctionCenterId: auctionCenterId }));
  }, []);
  useEffect(() => {
    setallMarkList(markList);
    setallAuctioneerList(auctineerList);
    setallAuctionCenterList(getAllAuctionCenterList);
    setWarehouseList(WarehouseList);
    setallTeaboardRegNoList(rejectWarehouseBillData);
    setViewWarehouse(ViewWarehouseData);
  }, [
    markList,
    auctineerList,
    getAllAuctionCenterList,
    WarehouseList,
    rejectWarehouseBillData,
    ViewWarehouseData,
  ]);
  useEffect(() => {
    setRejectWarehouseDatas(warehouseManageBillData);
  }, [warehouseManageBillData]);

  const [billNumbervalidate, setbillNumbervalidate] = useState(null);

  useEffect(() => {
    setbillNumbervalidate(billNumbercheck);
  }, [billNumbercheck]);
  useEffect(() => {
    setallMarkList(markList);
    setallAuctioneerList(auctineerList);
  }, [markList, auctineerList]);
  useEffect(() => {
    const calculateTDSAmount = () => {
      const grossBillAmount = parseFloat(warehouseBill.grossBillAmount) || 0;
      const tdsRate = parseFloat(warehouseBill.tdsRate) || 0;
      const tdsAmount = (grossBillAmount * (tdsRate / 100)).toFixed(2);
      const netAmount = (grossBillAmount - tdsAmount).toFixed(2);
      setwarehouseBill((prevState) => ({
        ...prevState,
        tdsAmount: tdsAmount,
        netAmount: netAmount,
      }));
    };
    calculateTDSAmount();
  }, [
    warehouseBill.grossBillAmount,
    warehouseBill.tdsRate,
    warehouseBill.tdsAmount,
  ]);
  useEffect(() => {
    if (isEdit) {
      setwarehouseBill(warehouseManageBillById);
    }
  }, [warehouseManageBillById]);

  const handleChangeDataSearch = (e) => {
    const { name, value } = e.target;
    var selectedValue = value !== '' ? value : null; 
    setwarehouseBillsellerSearch({
      ...warehouseBillsellerSearch,
      [name]: selectedValue,
    }); 
  };
  const Validate = () => {
    let isValid = true;
    if (warehouseBill.billType == null || warehouseBill.billType == "") {
      CustomToast.error("Please select bill type");
      isValid = false;
      return;
    }
    if (warehouseBill.markId == null || warehouseBill.markId == "") {
      CustomToast.error("Please select mark");
      isValid = false;
      return;
    }
    if (
      warehouseBill.auctioneerName == null ||
      warehouseBill.auctioneerName == "0"
    ) {
      CustomToast.error("Please select auctioneer");
      isValid = false;
      return;
    }
    if (warehouseBill.billDate == null || warehouseBill.billDate == "") {
      CustomToast.error("Please select bill date");
      isValid = false;
      return;
    }
    if (warehouseBill.billNumber == null || warehouseBill.billNumber == "") {
      CustomToast.error("Please enter bill number");
      isValid = false;
      return;
    }
    if ( 
      warehouseBill.sgstonGrossBillAmount == "" &&  warehouseBill.sgstonGrossBillAmount == "" && warehouseBill.cgstonGrossBillAmount == ""
    ) {
      CustomToast.error("Please enter SGST on gross bill amount");
      isValid = false;
      return;
    }
    if (
      warehouseBill.cgstonGrossBillAmount == "" &&  warehouseBill.sgstonGrossBillAmount == "" && warehouseBill.cgstonGrossBillAmount ==""
    ) {
      CustomToast.error("Please enter CGST on gross bill amount");
      isValid = false;
      return;
    }
    if (warehouseBill.igstonGrossBillAmount == "" && warehouseBill.sgstonGrossBillAmount && warehouseBill.cgstonGrossBillAmount
    ) {
      CustomToast.error("Please enter IGST on gross bill amount");
      isValid = false;
      return;
    }
    if (
      warehouseBill.grossBillAmount == null ||
      warehouseBill.grossBillAmount == ""
    ) {
      CustomToast.error("Please enter gross bill amount");
      isValid = false;
      return;
    }
    if (warehouseBill.tdsRate == null || warehouseBill.tdsRate == "") {
      CustomToast.error("Please entet TDS rate");
      isValid = false;
      return;
    }
    if (
      warehouseBill.warehouseRemarks == null ||
      warehouseBill.warehouseRemarks == ""
    ) {
      CustomToast.error("Please enter warehouse remark");
      isValid = false;
      return;
    }
    return isValid;
  };
  const ValidateManage = () => {
    let isValid = true;
    if (
      warehouseBillsellerSearch.markName == null ||
      warehouseBillsellerSearch.markName == ""
    ) {
      CustomToast.error("Please select mark");
      isValid = false;
      return;
    }
    if (
      warehouseBillsellerSearch.billType == null ||
      warehouseBillsellerSearch.billType == "0"
    ) {
      CustomToast.error("Please select bill type");
      isValid = false;
      return;
    }
    return isValid;
  };
  const reset = () => {
    setwarehouseBill({
      billChargeId: "",
      billType: "",
      markName: "",
      auctioneerName: "",
      billDate: "",
      billNumber: "",
      grossBillAmount: "",
      sgstonGrossBillAmount: "",
      cgstonGrossBillAmount: "",
      igstonGrossBillAmount: "",
      tdsRate: "",
      tdsAmount: "",
      netAmount: "",
      warehouseRemarks: "",
      cstatus: "",
      createdBy: "",
      createdOn: "",
      updatedBy: "",
      updatedOn: "",
      warehouseUserName: "",
      warehouseName: "",
      billUploadDate: "",
      sellerRemarks: "",
      markId: "",
    });
    setUploadedDocumentsForUnit(null);
    setTimeout(() => {
      setwarehouseBill({
        billChargeId: null,
        billType: null,
        markName: "",
        auctioneerName: "",
        billDate: null,
        billNumber: "",
        grossBillAmount: null,
        sgstonGrossBillAmount: null,
        cgstonGrossBillAmount: null,
        igstonGrossBillAmount: null,
        tdsRate: null,
        tdsAmount: null,
        netAmount: null,
        warehouseRemarks: "",
        cstatus: null,
        createdBy: null,
        createdOn: null,
        updatedBy: null,
        updatedOn: null,
        warehouseUserName: "",
        warehouseName: "",
        billUploadDate: null,
        sellerRemarks: "",
        markId: null,
      });
    }, 0);
  };
  const resetSearch = () => {
    setwarehouseBillsellerSearch({
      markName: "",
      auctioneerName: "",
      markId: "",
      cstatus: [],
      billType: "",
      billYear: "",
    });
    setTimeout(() => {
      setwarehouseBillsellerSearch({
        markName: null,
        auctioneerName: null,
        markId: null,
        Status: null,
        billType: null,
        billYear: null,
      });
    }, 0);
  };
  const handleChangeData = (e) => {
    const { name, value } = e.target;
    var selectedValue = value !== '' ? value : null; 
    setwarehouseBill({ ...warehouseBill, [name]: selectedValue });
  };
  const ManagehandleSubmit = (e) => {
    e.preventDefault();
    console.log(warehouseBillsellerSearch, "warehouseBillsellerSearch");
    if (ValidateManage()) {
      dispatch(searchWarehouseBill(warehouseBillsellerSearch));
    }
  };
  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit) {
      if (selectedOption === "manual") {
        if (Validate()) {
          axiosMain
            .get(
              `/postauction/warehouseuser/checkbillNumber/${warehouseBill.billNumber}`
            )
            .then((response) => {
              if (response?.data?.statusCode === 200) {
                CustomToast.success(response.data.message);
                if (response?.data?.responseData === true) {
                  warehouseBill.billType = parseInt(warehouseBill.billType, 10);
                  dispatch(addWarehouseBillChargeRequest(warehouseBill));
                } else {
                }
              } else {
                CustomToast.error(response?.data?.message);
              }
            })
            .catch((error) => {
              // Handle error
              console.error("Error:", error);
            });
        }
      } else {
        if (uploadedDocumentsForUnit == null) {
          CustomToast.error("Please select excel file.");
        } else {
          if (
            warehouseBill.auctioneerName == null ||
            warehouseBill.auctioneerName == ""
          ) {
            CustomToast.error("Please select auctioneer name.");
          } else {
            dispatch(
              addWarehouseBillChargeExcelRequest({
                content: uploadedDocumentsForUnit,
                userId: userId,
                auctioncenterId: auctionCenterId,
                filename: "ware_house_bill_charge.xls",
                auctionnername: warehouseBill.auctioneerName,
              })
            );
          }
        }
      }
    } else {
      if (Validate()) {
        try {
          const response = await axiosMain.post(
            "/postauction/warehouseBill/warehouse/edit",
            { ...warehouseBill, updatedBy: userId }
          );

          if (response?.data?.statusCode == 200) {
            CustomToast.success(response.data.message);
            dispatch(searchWarehouseBill(warehouseBillsellerSearch));
            setExpandedSub("panel2");
          } else {
            CustomToast.error(response?.data?.message);
          }
          console.log("Response:", response?.data?.message);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
  };
  const handleFileUploadForUnit = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith(".xlsx")) {
        CustomToast.error("Please upload proper file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1];
        setUploadedDocumentsForUnit(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allIndices = Array.from(
        { length: RejectWarehouseDatas.length },
        (_, index) => index
      );
      setSelectedItems(allIndices);
    } else {
      setSelectedItems([]);
    }
  };
  const handleCheckboxChange = (index) => {
    const selectedIndex = selectedItems.indexOf(index);
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, index]);
    } else {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems.splice(selectedIndex, 1);
      setSelectedItems(updatedSelectedItems);
      if (selectAll) {
        setSelectAll(false);
      }
    }
  };
  const handleSellerRemarksChange = (index, value) => {
    const updatedInputs = [...sellerRemarksInputs];
    updatedInputs[index] = value;
    setSellerRemarksInputs(updatedInputs);
  };
  const ViewBill = (billChargeId) => {
    dispatch(
      fetchWarehouseDataRequest({
        billChargeId: billChargeId,
        isExport: 0,
        exportType: "",
      })
    );
    setExpandedSub("panel3");
  };
  const Delete = (billChargeId) => {
    dispatch(deleteWarehouseRequest(billChargeId));
    dispatch(searchWarehouseBill(warehouseBillsellerSearch));
  };
  const EditBill = (billChargeId) => {
    setisEdit(true);
    dispatch(fetchDataRequest(billChargeId));
    setExpandedSub("panel1");
  };
  const PDFDownload = (billChargeId, exportType) => {
    const updatedDealBookSearch = {
      url: "/postauction/warehouseBill/warehouse/view",
      billChargeId: billChargeId,
      exportType: exportType,
      isExport: 1,
    };
    setexportType(exportType);
    dispatch(getExportData(updatedDealBookSearch));
  };
  const findMarkName = (markId) => {
    const selectedMark = allMarkList?.find(
      (mark) => mark.markId === parseInt(markId)
    );
    warehouseBill.markName = selectedMark ? selectedMark.markName : "";
  };
  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
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
          <Typography>
            {isEdit == true ? "Edit Bill Uploads" : "Warehouse Bill Uploads"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row mb-4">
              <div className="col-12 WarehouseBill">
                <div class="form-check-inline">
                  <label class="form-check-label">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="optradio"
                      value="manual"
                      checked={selectedOption === "manual"}
                      onChange={handleRadioChange}
                    />
                    Manual Upload
                  </label>
                </div>
                <div class="form-check-inline">
                  <label class="form-check-label">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="optradio"
                      value="excel"
                      checked={selectedOption === "excel"}
                      onChange={handleRadioChange}
                    />
                    Excel Upload
                  </label>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                {selectedOption === "manual" && (
                  <div className="row">
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Bill Type</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          name="billType"
                          onChange={handleChangeData}
                          value={warehouseBill.billType}
                        >
                          <option>Select Bill Type</option>
                          <option value={1}>Warehouse Charge</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Mark</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          name="markId"
                          onChange={handleChangeData}
                          value={warehouseBill.markId}
                        >
                          <option value="">Select Mark</option>
                          {allMarkList?.map((allMarkList, index) => (
                            <option value={allMarkList.markId}>
                              {allMarkList.markName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-xl-2 d-none">
                      <div className="FomrGroup">
                        <label>Mark Name</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="markName"
                          value={findMarkName(warehouseBill.markId)}
                        />
                      </div>
                    </div>

                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Auctioneer</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          name="auctioneerName"
                          onChange={handleChangeData}
                          value={warehouseBill.auctioneerName}
                        >
                          <option value="0">Select Auctioneer Name</option>
                          {allAuctioneerList?.map(
                            (allAuctioneerList, index) => (
                              <option
                                value={allAuctioneerList.userId}
                                key={index}
                              >
                                {allAuctioneerList.userName}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Bill Date</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="date"
                          className="form-control"
                          name="billDate"
                          onChange={handleChangeData}
                          value={formatDate(warehouseBill.billDate)}
                          disabled={isEdit}
                        />
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Bill Number</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="billNumber"
                          onChange={handleChangeData}
                          disabled={isEdit}
                          value={warehouseBill.billNumber}
                        />
                      </div>
                    </div>

                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>SGST on Gross Bill Amount</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="sgstonGrossBillAmount"
                          onChange={handleChangeData}
                          value={warehouseBill.sgstonGrossBillAmount}
                          disabled={warehouseBill.igstonGrossBillAmount}
                        />
                      </div>
                    </div>

                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>CGST on Gross Bill Amount</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="cgstonGrossBillAmount"
                          onChange={handleChangeData}
                          value={warehouseBill.cgstonGrossBillAmount}
                          disabled={warehouseBill.igstonGrossBillAmount}
                        />
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>IGST on Gross Bill Amount</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="igstonGrossBillAmount"
                          onChange={handleChangeData}
                          value={warehouseBill.igstonGrossBillAmount}
                          disabled={warehouseBill.sgstonGrossBillAmount || warehouseBill.cgstonGrossBillAmount}
                        />
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Gross Bill Amount</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="grossBillAmount"
                          onChange={handleChangeData}
                          value={warehouseBill.grossBillAmount}
                          
                        />
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>TDS Rate</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="number"
                          className="form-control"
                          name="tdsRate"
                          placeholder=""
                          onChange={handleChangeData}
                          value={warehouseBill.tdsRate}
                        />
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>TDS Amount</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="tdsAmount"
                          onChange={handleChangeData}
                          value={warehouseBill.tdsAmount}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Net Amount</label>
                        <input
                          type="text"
                          className="form-control"
                          name="netAmount"
                          onChange={handleChangeData}
                          value={warehouseBill.netAmount}
                          disabled={true}
                        />
                      </div>
                    </div>
                    {/* <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Seller Remark</label>

                        <input
                          type="text"
                          className="form-control"
                          name="sellerRemarks"
                          onChange={handleChangeData}
                          value={warehouseBill.sellerRemarks}
                          disabled={isEdit}
                        />
                      </div>
                    </div> */}
                    <div className="col-xl-2">
                      <div className="FomrGroup">
                        <label>Warehouse Remark</label>
                        <label className="errorLabel"> * </label>
                        <input
                          type="text"
                          className="form-control"
                          name="warehouseRemarks"
                          onChange={handleChangeData}
                          value={warehouseBill.warehouseRemarks}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {selectedOption === "excel" && (
                  <div className="row">
                    <div className="col-xl-2 mb-3">
                      <div className="FomrGroup">
                        <label>Auctioneer</label>
                        <label className="errorLabel"> * </label>
                        <select
                          className="form-control select-form"
                          name="auctioneerName"
                          onChange={handleChangeData}
                          value={warehouseBill.auctioneerName}
                        >
                          <option value="">Select Auctioneer Name</option>
                          {allAuctioneerList?.map(
                            (allAuctioneerList, index) => (
                              <option
                                value={allAuctioneerList.userId}
                                key={index}
                              >
                                {allAuctioneerList.userName}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <Card className="FileUploadBox">
                        <Card.Body>
                          <Card.Title>Excel Upload </Card.Title>
                          <div className="FileUpload p-2">
                            <div className="FormGroup">
                              <input
                                type="file"
                                multiple
                                onChange={handleFileUploadForUnit}
                                accept=".xlsx"
                              />
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-12">
                    <div className="BtnGroup">
                      {isEdit && (
                        <>
                          <button type="submit" className="SubmitBtn">
                            Update
                          </button>
                        </>
                      )}
                      {!isEdit && (
                        <>
                          <button type="submit" className="SubmitBtn">
                            Submit
                          </button>
                        </>
                      )}
                     
                      <button
                        type="button"
                        className="SubmitBtn"
                        onClick={() => reset()}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
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
          <Typography>Manage Warehouse</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <form onSubmit={ManagehandleSubmit}>
              <div className="row">
                <div className="col-xl-2">
                  <div className="FomrGroup">
                    <label>Mark</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      name="markName"
                      onChange={handleChangeDataSearch}
                      value={warehouseBillsellerSearch.markName}
                    >
                      <option value="">Select Mark</option>
                      {allMarkList?.map((allMarkList, index) => (
                        <option value={allMarkList.markName}>
                          {allMarkList.markName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-xl-2">
                  <div className="FomrGroup">
                    <label>Auctioneer</label>
                    <select
                      className="form-control select-form"
                      name="auctioneerName"
                      onChange={handleChangeDataSearch}
                      value={warehouseBillsellerSearch.auctioneerName}
                    >
                      <option value="">Select Auctioneer Name</option>
                      {allAuctioneerList?.map((allAuctioneerList, index) => (
                        <option value={allAuctioneerList.userId} key={index}>
                          {allAuctioneerList.userName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-xl-2">
                  <div className="FomrGroup">
                    <label>Bill Year</label>
                    <select
                      name="billYear"
                      value={warehouseBillsellerSearch.billYear}
                      className="form-control select-form"
                      onChange={handleChangeDataSearch}
                    >
                      <option value="0">Select Bill Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-xl-2">
                  <div className="FomrGroup">
                    <label>Status</label>
                    <select
                      className="form-control select-form"
                      name="cstatus"
                      onChange={handleChangeDataSearch}
                      value={warehouseBillsellerSearch.cstatus}
                    >
                      <option value="">Select Status</option>
                      {Status?.map((Status, index) => (
                        <option value={Status.Status}>{Status.cstatus}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-xl-2">
                  <div className="FomrGroup">
                    <label>Bill Type</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      name="billType"
                      onChange={handleChangeDataSearch}
                      value={warehouseBillsellerSearch.billType}
                    >
                      <option>Select Bill Type</option>
                      <option value="1">Warehouse Charge</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="BtnGroup">
                    <button type="submit" className="SubmitBtn">
                      Search
                    </button>
                    <button
                      type="button"
                      className="SubmitBtn"
                      onClick={() => resetSearch()}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="SubmitBtn"
                      onClick={() => handleExport("pdf")}
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div className="row mt-4">
              <div className="col-12">
                <div className="TableBox">
                  <table className="table">
                    <thead>
                      <th>
                        <input
                          type="checkbox"
                          onChange={handleSelectAllChange}
                          checked={selectAll}
                        />
                      </th>
                      <th>Sr.</th>
                      <th>Auctioneer</th>
                      <th>Bill Type</th>
                      <th>Mark Name</th>
                      <th className="text-center">Status</th>
                      <th>Warehouse User Name</th>
                      <th>Warehouse Name</th>
                      <th>Bill Number</th>
                      <th>Bill Date</th>
                      <th>Gross Bill Amount</th>
                      <th>SGST on Gross Bill Amount</th>
                      <th>CGST on Gross Bill Amount</th>
                      <th>IGST on Gross Bill Amount</th>
                      <th>TDS Rate</th>
                      <th>TDS Amount</th>
                      <th>Net Amount</th>
                      <th>Bill Upload Date</th>
                      <th>Seller Remarks</th>
                      <th>Warehouse Remarks</th>
                      <th>Action</th>
                    </thead>
                    <tbody>
                      {RejectWarehouseDatas?.length > 0 ? (
                        <>
                          {RejectWarehouseDatas.map((data, index) => (
                            <tr key={index} className={selectedItems.includes(index) ? 'SelectedRows' : ''}>
                              <td>
                                <input
                                  type="checkbox"
                                  onChange={() => handleCheckboxChange(index)}
                                  checked={selectedItems.includes(index)}
                                  disabled={
                                    data.cstatus == 3 || data.cstatus == 4
                                  }
                                />
                              </td>
                              <td>{index + 1}</td>
                              <td>{data.auctioneerName}</td>
                              <td>{data.billType}</td>
                              <td>{data.markName}</td>
                              <td>
                                {data.cstatus == 0 ? (
                                  <strong className="Pending">Pending</strong>
                                ) : (
                                  (data.cstatus == 0) == "Pending"
                                )}
                                {data.cstatus == 1 ? (
                                  <strong className="Updated">Accepted</strong>
                                ) : (
                                  (data.cstatus == 1) == "Accepted"
                                )}
                                {data.cstatus == 2 ? (
                                  <strong className="Confirmed">
                                    Confirmed
                                  </strong>
                                ) : (
                                  (data.cstatus == 2) == "Confirmed"
                                )}
                                {data.cstatus == 3 ? (
                                  <strong className="Closed">Rejected</strong>
                                ) : (
                                  (data.cstatus == 3) == "Rejected"
                                )}
                                {data.cstatus == 4 ? (
                                  <strong className="Closed">Deleted</strong>
                                ) : (
                                  (data.cstatus == 3) == "Deleted"
                                )}
                              </td>
                              <td>{data.warehouseUserName}</td>
                              <td>{data.warehouseName}</td>
                              <td>{data.billNumber}</td>
                              <td>{data.billDate}</td>
                              <td>{data.grossBillAmount}</td>
                              <td>{data.sgstonGrossBillAmount}</td>
                              <td>{data.cgstonGrossBillAmount}</td>
                              <td>{data.igstonGrossBillAmount}</td>
                              <td>{data.tdsRate}</td>
                              <td>{data.tdsAmount}</td>
                              <td>{data.netAmount}</td>
                              <td>{data.billUploadDate}</td>
                              <td>{data.sellerRemarks}</td>
                              <td>{data.warehouseRemarks}</td>
                              <td className="Action">
                              <i
                                      className="fa fa-download"
                                      onClick={() =>
                                        PDFDownload(data.billChargeId,"pdf")
                                      }
                                    ></i>
                                {data.cstatus == 0 ? (
                                  <>
                                    <i
                                      className="fa fa-edit"
                                      onClick={() =>
                                        EditBill(data.billChargeId)
                                      }
                                    ></i>
                                  </>
                                ) : (
                                  ""
                                )}
                                {data.cstatus == 1 ||
                                data.cstatus == 2 ||
                                data.cstatus == 3 ? (
                                  <>
                                    <i
                                      className="fa fa-eye"
                                      onClick={() =>
                                        ViewBill(data.billChargeId)
                                      }
                                    ></i>
                                  </>
                                ) : (
                                  ""
                                )}
                                {data.cstatus == 0 ||
                                data.cstatus == 2 ||
                                data.cstatus == 3 ? (
                                  <>
                                    <i
                                      className="fa fa-trash"
                                      onClick={() => Delete(data.billChargeId)}
                                    ></i>
                                  </>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={22}>
                            <div className="NoData">No Data</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expandedSub === "panel3"}
        className={`${expandedSub === "panel3" ? "active" : ""}`}
        onChange={handleChangeExpandSub("panel3")}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>View Warehouse Bill</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="TableBox">
              {ViewWarehouse == null ? (
                <>
                  <table className="table">
                    <tr>
                      <th>Bill Charge ID</th>
                      <th>Bill Type</th>
                      <th>Mark Name</th>
                      <th>Warehouse Name</th>
                      <th>Bill Number</th>
                      <th>Bill Date</th>
                      <th>Gross Bill Amount</th>
                      <th>SGST Amount</th>
                      <th>CGST Amount</th>
                      <th>IGST Amount</th>
                      <th>TDS Rate</th>
                      <th>Warehouse Remarks</th>
                    </tr>
                    <tr>
                      <td colSpan={12}>
                        <div className="NoData">No Data</div>
                      </td>
                    </tr>
                  </table>
                </>
              ) : (
                <>
                  {ViewWarehouse && (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Bill Charge ID</th>
                          <th>Bill Type</th>
                          <th>Mark Name</th>
                          <th>Warehouse Name</th>
                          <th>Bill Number</th>
                          <th>Bill Date</th>
                          <th>Gross Bill Amount</th>
                          <th>SGST Amount</th>
                          <th>CGST Amount</th>
                          <th>IGST Amount</th>
                          <th>TDS Rate</th>
                          <th>Warehouse Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{ViewWarehouse.billChargeId}</td>
                          <td>{ViewWarehouse.billType}</td>
                          <td>{ViewWarehouse.markName}</td>
                          <td>{ViewWarehouse.warehouseName}</td>
                          <td>{ViewWarehouse.billNumber}</td>
                          <td>{ViewWarehouse.billDate}</td>
                          <td>{ViewWarehouse.grossBillAmount}</td>
                          <td>{ViewWarehouse.sgstonGrossBillAmount}</td>
                          <td>{ViewWarehouse.cgstonGrossBillAmount}</td>
                          <td>{ViewWarehouse.igstonGrossBillAmount}</td>
                          <td>{ViewWarehouse.tdsRate}</td>
                          <td>{ViewWarehouse.warehouseRemarks}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default AddWarehouseBillUploads;
