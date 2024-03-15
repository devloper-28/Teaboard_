/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import CustomToast from "../../../components/Toast";
import {
  bindAuctioneerRequest,
  fetchAuctionRequest,
  fetchMarkRequest,
  getExportData,
  getExportDataApiCall,
  searchUsersRequest,
} from "../../../store/actions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch } from "react-redux";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";
import { useSelector } from "react-redux";
import {
  fetchFactoryDetailRequest,
  fetchWarehouseDataRequest,
  fetchWarehouseRequest,
  rejectBillRequest,
} from "../../../store/actions/rejectWarehouseBill/rejectWarehouseBill";
import Base64ToExcelDownload from "../../Base64ToExcelDownload";
import { uploadedFileDownload } from "../../uploadDocument/UploadedFileDownload";
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

function RejectWarehouseBill() {
  const dispatch = useDispatch();
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId } =
    useAuctionDetail();
  const [warehouseBillsellerSearch, setwarehouseBillsellerSearch] = useState({
    teaBoardRegistrationNo: null,
    auctionCenter: null,
    auctioneerName: null,
    markName: null,
    warehouseName: null,
    cstatus: null,
    billType: parseInt(1),
  });
  const handleChangeExpandSub = (panel) => (event, isSubExpanded) => {
    setExpandedSub(isSubExpanded ? panel : false);
  };
  const [expandedSub, setExpandedSub] = React.useState("panel1");

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [warehouseList, setWarehouseList] = useState([]);
  const [allMarkList, setallMarkList] = useState([]);
  const [allAuctioneerList, setallAuctioneerList] = useState([]);
  const [allAuctionCenterList, setallAuctionCenterList] = useState([]);
  const [allTeaboardRegNoList, setallTeaboardRegNoList] = useState([]);
  const [RejectWarehouseDatas, setRejectWarehouseDatas] = useState([]);
  const [sellerRemarks, setSellerRemarks] = useState("");
  const [ViewWarehouse, setViewWarehouse] = useState(null);

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
  const rejectWarehouseBillDatas = useSelector(
    (res) => res.TeaBoardRegistrationNo.tboardRegNo?.responseData
  );
  const RejectWarehouseData = useSelector(
    (res) => res.TeaBoardRegistrationNo.rejectWarehouseBillData
  );

  const ViewWarehouseData = useSelector(
    (res) => res.TeaBoardRegistrationNo.ViewWarehouseData?.responseData
  );

  console.log(RejectWarehouseData, "RejectWarehouseData");

  const ExportExcelDatas = useSelector(
    (state) => state.documentReducer.exportData.responseData?.exported_file
  );

  const [exportType, setexportType] = useState("");
  const getExportDataApiCallResponse = useSelector(
    (state) => state.documentReducer.exportDataApiCall
  );

  console.log(useSelector((state) => state));

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

  useEffect(() => {
    if (ExportExcelDatas != null && true == getExportDataApiCallResponse) {
      dispatch(getExportDataApiCall(false));
      if ("excel" == exportType) {
        Base64ToExcelDownload(ExportExcelDatas, "Warehouse-bill.xlsx");
      } else {
        uploadedFileDownload(
          ExportExcelDatas,
          "Warehouse-bill.pdf",
          `data:application/pdf;base64`
        );
      }
    }
  });

  const Status = [
    { cstatus: "All", Status: null },
    { cstatus: "Pending", Status: 0 },
    { cstatus: "Accepted", Status: 1 },
    { cstatus: "Confirmed", Status: 2 },
    { cstatus: "Rejected", Status: 3 },
  ];

  useEffect(() => {
    dispatch(fetchMarkRequest({ auctionCenterId: auctionCenterId }));
    dispatch(bindAuctioneerRequest({ roleCode: "WAREHOUSE" }));
    dispatch(fetchAuctionRequest());
    dispatch(searchUsersRequest({}));
    dispatch(fetchFactoryDetailRequest({ userId: userId }));
  }, []);
  useEffect(() => {
    setallMarkList(markList);
    setallAuctioneerList(auctineerList);
    setallAuctionCenterList(getAllAuctionCenterList);
    setWarehouseList(WarehouseList);
    setallTeaboardRegNoList(rejectWarehouseBillDatas);
    setRejectWarehouseDatas(RejectWarehouseData);
    setViewWarehouse(ViewWarehouseData);
  }, [
    markList,
    auctineerList,
    getAllAuctionCenterList,
    WarehouseList,
    rejectWarehouseBillDatas,
    RejectWarehouseData,
    ViewWarehouseData,
  ]);

  const Validate = () => {
    let isValid = true;
    if (
      warehouseBillsellerSearch.teaBoardRegistrationNo == null ||
      warehouseBillsellerSearch.teaBoardRegistrationNo == ""
    ) {
      CustomToast.error("Please select tea board registration No");
      isValid = false;
      return;
    }
    if (
      warehouseBillsellerSearch.auctionCenter == null ||
      warehouseBillsellerSearch.auctionCenter == ""
    ) {
      CustomToast.error("Please select auction center");
      isValid = false;
      return;
    }
    if (
      warehouseBillsellerSearch.auctioneerName == null ||
      warehouseBillsellerSearch.auctioneerName == ""
    ) {
      CustomToast.error("Please select auctioneer name");
      isValid = false;
      return;
    }
    if (
      warehouseBillsellerSearch.markName == null ||
      warehouseBillsellerSearch.markName == ""
    ) {
      CustomToast.error("Please select mark name");
      isValid = false;
      return;
    }
    if (
      warehouseBillsellerSearch.warehouseName == null ||
      warehouseBillsellerSearch.warehouseName == ""
    ) {
      CustomToast.error("Please select warehouse name");
      isValid = false;
      return;
    }
    return isValid;
  };
  const reset = () => {
    setwarehouseBillsellerSearch({
      teaBoardRegistrationNo: "",
      auctionCenter: "",
      auctioneerName: "",
      markName: "",
      warehouseName:"",
      cstatus: "",
      billType: "",
    });
    setTimeout(() => {
      setwarehouseBillsellerSearch({
        teaBoardRegistrationNo: null,
        auctionCenter: null,
        auctioneerName: null,
        markName: null,
        warehouseName: null,
        cstatus: null,
        billType: null,
      });
    }, 0);
  };
  const handleChangeData = (e) => {
    const { name, value } = e.target;
    var selectedValue = value !== "" ? value : null;
    setwarehouseBillsellerSearch({
      ...warehouseBillsellerSearch,
      [name]: selectedValue,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Validate()) {
      dispatch(fetchWarehouseRequest(warehouseBillsellerSearch));
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
  const [sellerRemarksInput, setSellerRemarksInput] = useState("");
  const [rejectedDataArray, setRejectedDataArray] = useState([]);

  const [sellerRemarksInputs, setSellerRemarksInputs] = useState(
    Array(RejectWarehouseDatas?.length).fill("")
  );

  const handleSellerRemarksChange = (index, value) => {
    const updatedInputs = [...sellerRemarksInputs];
    updatedInputs[index] = value;
    setSellerRemarksInputs(updatedInputs);
  };

  const rejectBill = (billChargeId) => {
    const isSellerRemarksValid = selectedItems.every((index) => {
      const sellerRemarks = sellerRemarksInputs[index];
      return sellerRemarks !== null && sellerRemarks !== undefined;
    });

    if (!isSellerRemarksValid) {
      CustomToast.error(
        "Please fill in Seller Remarks for all selected items."
      );
      return;
    }

    if (
      (billChargeId == null && billChargeId == "") ||
      billChargeId == undefined
    ) {
      const rejectedData = selectedItems.map((index) => {
        const selectedRowData = RejectWarehouseDatas[index];
        return {
          billChargeId: selectedRowData.billChargeId,
          sellerRemarks:
            sellerRemarksInputs[index] === undefined
              ? ""
              : sellerRemarksInputs[index],
        };
      });

      const billChargeIds = rejectedData
        .map((item) => item.billChargeId)
        .join(",");
      console.log(billChargeIds);

      dispatch(rejectBillRequest({ data: rejectedData, billChargeIds }));
      setSelectAll(false);
    } else {
      const filteredData = selectedItems.map((index) => {
        const selectedRowData = RejectWarehouseDatas[index];
        return {
          billChargeId: selectedRowData.billChargeId,
          sellerRemarks:
            sellerRemarksInputs[index] === undefined
              ? ""
              : sellerRemarksInputs[index],
        };
      });
      const filteredArray = filteredData.filter(
        (item) => item.billChargeId == billChargeId
      );

      const billChargeIds = filteredArray
        .map((item) => item.billChargeId)
        .join(",");
      console.log(billChargeIds);
      dispatch(rejectBillRequest({ data: filteredArray, billChargeIds }));
    }
    dispatch(fetchWarehouseRequest(warehouseBillsellerSearch));
    setSelectedItems([]);
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

  return (
    <>
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
          <Typography>Search Warehouse Bill</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-xl-2">
                  <div className="FomrGroup">
                    <label>Tea Board Registration No </label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      name="teaBoardRegistrationNo"
                      onChange={handleChangeData}
                      value={warehouseBillsellerSearch.teaBoardRegistrationNo}
                    >
                      <option>Select Tea Board Registration No</option>
                      {allTeaboardRegNoList?.map(
                        (allTeaboardRegNoList, index) => (
                          <option
                            value={allTeaboardRegNoList.teaBoardRegistrationNo}
                          >
                            {allTeaboardRegNoList.teaBoardRegistrationNo}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="col-xl-2">
                  <div className="FomrGroup">
                    <label>Auction Center </label>
                    <label className="errorLabel"> * </label>
                    <select
                      name="auctionCenter"
                      value={warehouseBillsellerSearch.auctionCenter}
                      className="form-control select-form"
                      onChange={handleChangeData}
                    >
                      <option value="">Select Auction Center</option>
                      {allAuctionCenterList?.map(
                        (allAuctionCenterList, index) => (
                          <option value={allAuctionCenterList.auctionCenterId}>
                            {allAuctionCenterList.auctionCenterName}
                          </option>
                        )
                      )}
                    </select>
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
                    <label>Mark</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      name="markName"
                      onChange={handleChangeData}
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
                    <label>Warehouse</label>
                    <label className="errorLabel"> * </label>
                    <select
                      className="form-control select-form"
                      name="warehouseName"
                      onChange={handleChangeData}
                      value={warehouseBillsellerSearch.warehouseName}
                    >
                      <option value="">Select Warehouse</option>
                      {warehouseList?.map((warehouseList, index) => (
                        <option value={warehouseList.wareHouseCode}>
                          {warehouseList.wareHouseCode}
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
                      onChange={handleChangeData}
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
                    <select
                      className="form-control select-form"
                      name="billType"
                      onChange={handleChangeData}
                      value={warehouseBillsellerSearch.billType}
                    >
                      <option value="">Select Bill Type</option>
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
                      onClick={() => reset()}
                    >
                      Reset
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
                          disabled={RejectWarehouseDatas == null}
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
                      <th>Warehouse Remarks</th>
                      <th>Seller Remarks</th>
                      <th>Action</th>
                    </thead>
                    <tbody>
                      {RejectWarehouseDatas != null ? (
                        <>
                          {RejectWarehouseDatas.map((data, index) => (
                            <tr key={index}>
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
                                  (data.cstatus == 4) == "Deleted"
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
                              <td>{data.warehouseRemarks}</td>

                              <td>
                                {data.cstatus == 3 ? (
                                  <>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={data.sellerRemarks}
                                      onChange={(e) =>
                                        handleSellerRemarksChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                      disabled={
                                        data.cstatus == 3 || data.cstatus == 4
                                      }
                                    />
                                  </>
                                ) : (
                                  <>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={sellerRemarksInputs[index]}
                                      onChange={(e) =>
                                        handleSellerRemarksChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                      disabled={!selectedItems.includes(index)}
                                    />
                                  </>
                                )}
                              </td>
                              <td className="Action">
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
                                {data.cstatus == 1 ||
                                data.cstatus == 2 ||
                                data.cstatus == 3 ? (
                                  <>
                                    <i
                                      class="fa fa-download"
                                      aria-hidden="true"
                                      onClick={() =>
                                        PDFDownload(data.billChargeId, "pdf")
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
                                      class="fa fa-file"
                                      aria-hidden="true"
                                      onClick={() =>
                                        PDFDownload(data.billChargeId, "excel")
                                      }
                                    ></i>
                                  </>
                                ) : (
                                  ""
                                )}

                                {data.cstatus != 3 ? (
                                  <a
                                    onClick={() =>
                                      rejectBill(data.billChargeId)
                                    }
                                    disabled={!selectedItems.includes(index)}
                                  >
                                    <i className="fa fa-times"></i>
                                  </a>
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
                <div className="BtnGroup">
                  <button className="SubmitBtn" onClick={() => rejectBill()}>
                    Reject Bill
                  </button>
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
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
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
    </>
  );
}

export default RejectWarehouseBill;
