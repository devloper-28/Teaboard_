/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  bindAuctionDateRequest,
  bindAuctioneerRequest,
  bindLoatNoRequest,
  bindSaleNoRequest,
  bindSessionTimeRequest,
  fetchAuctionRequest,
  fetchGradeRequest,
  fetchMarkRequest,
  getAllCategoriesAction,
  getAllTeaTypes,
  getBuyer,
  getDocumentByIdAction,
  getExportData,
  getExportDataApiCall,
  getSaleNoRequest,
} from "../../../store/actions";
import { useSelector } from "react-redux";
import CustomToast from "../../../components/Toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosMain from "../../../http/axios/axios_main";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";
import Base64ToExcelDownload from "../../Base64ToExcelDownload";
import { uploadedFileDownload } from "../../uploadDocument/UploadedFileDownload";
import { NO_OF_RECORDS } from "../../../constants/commonConstants";
import { ThreeDots } from "react-loader-spinner";

function ViewDealBookTao({ modalRight }) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 5; i++) {
    const year = currentYear - i;
    years.push(year);
  }
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId } =
    useAuctionDetail();
  const [ViewDealBookTaoData, setViewDealBookTaoData] = useState([]);
  const [allTeaTypeList, setallTeaTypeList] = useState([]);
  const [allGrade, setallGrade] = useState([]);
  const [allSaleNoList, setallSaleNoList] = useState([]);
  const [allAuctionDate, setallAuctionDate] = useState([]);
  const [allSessionTime, setallSessionTime] = useState([]);
  const [allMarkList, setallMarkList] = useState([]);
  const [allAuctionCenterList, setallAuctionCenterList] = useState([]);
  const [allCategory, setallCategory] = useState([]);
  const [season, setSeason] = useState(currentYear);
  const [allLoatNo, setallLoatNo] = useState([]);
  const [allBuyer, setallBuyer] = useState([]);
  const [buyersPromptDate, setbuyersPromptDate] = useState("");
  const [allAuctioneerList, setallAuctioneerList] = useState([]);
  const dispatch = useDispatch();
  const [remarksList, setRemarksList] = useState([]);
  const tableRef = useRef(null);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [pageNo, setPageNo] = useState(2);
  const [DealBookSearch, setDealBookSearch] = useState({
    season: String(currentYear),
    saleNo: null,
    teaType: null,
    category: null,
    auctionDate: null,
    sessionTime: null,
    mark: null,
    buyerName: null,
    lotNo: null,
    auctionCentre: auctionCenterId,
    dealStatus: null,
    gradeName: null,
    auctioneerName: null,
  });

  const allTeaType = useSelector(
    (state) => state.teaTypeManage.allTeaTypes.responseData
  );
  const getAllAuctionCenterList = useSelector(
    (res) => res.warehouseUserRegistration.auctionCenter?.responseData
  );
  const markList = useSelector((state) => state.mark.data.responseData);
  const allActiveCategory = useSelector(
    (state) => state.categoryManage.allCategories.responseData
  );
  const grades = useSelector((state) => state.grade.data.responseData);
  const getUploadedIdData = useSelector(
    (state) => state.documentReducer.documentData.responseData
  );
  const getUserData = useSelector(
    (state) => state.createBuyer.getBuyer.responseData
  );
  const saleNoData = useSelector((state) => state.saleNoReducer.saleList);
  const auctionDate = useSelector(
    (state) => state.saleNoReducer.auctionDateList
  );
  const loatNoList = useSelector((state) => state.saleNoReducer.loatNoList);
  const sessionTime = useSelector(
    (state) => state.saleNoReducer.sessionTimeList
  );
  const auctineerList = useSelector(
    (state) => state.saleNoReducer.auctineerList
  );
  const ExportExcelDatas = useSelector(
    (state) => state.documentReducer.exportData.responseData?.exported_file
  );
  const getExportDataApiCallResponse = useSelector(
    (state) => state.documentReducer.exportDataApiCall
  );
  const [exportType, setexportType] = useState("");

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
    if (DealBookSearch.season !== "") {
      dispatch(
        bindSaleNoRequest({
          season: DealBookSearch?.season,
          auctionCenterId: auctionCenterId,
        })
      );
    }
  }, [DealBookSearch.season]);
  useEffect(() => {
    if (DealBookSearch.saleNo !== null) {
      dispatch(
        bindAuctionDateRequest({
          season: DealBookSearch.season,
          saleNo: DealBookSearch.saleNo,
          auctionCenterId: auctionCenterId,
        })
      );
      dispatch(
        bindLoatNoRequest({
          season: DealBookSearch.season,
          saleNo: DealBookSearch.saleNo,
          auctionCenterId: auctionCenterId,
          pageNumber: 1,
          pageSize: 10,
          auctioneerId: userId,
        })
      );
    }
  }, [DealBookSearch.saleNo]);
  useEffect(() => {
    if (DealBookSearch.auctionDate !== null) {
      dispatch(
        bindSessionTimeRequest({
          season: DealBookSearch.season,
          saleNo: DealBookSearch.saleNo,
          auctionDate: DealBookSearch.auctionDate,
          auctionCenterId: auctionCenterId,
        })
      );
    }
  }, [DealBookSearch.auctionDate]);
  useEffect(() => {
    dispatch(getAllTeaTypes());
    dispatch(fetchMarkRequest({ auctionCenterId: auctionCenterId }));
    dispatch(fetchAuctionRequest());
    dispatch(getAllCategoriesAction());
    dispatch(fetchGradeRequest({ auctionCenterId }));
    dispatch(getBuyer({ roleCode: "BUYER", userType: 2, isParentId: 0 }));
    dispatch(bindAuctioneerRequest({ roleCode: "AUCTIONEER" }));
  }, []);
  useEffect(() => {
    setallTeaTypeList(allTeaType);
    setallMarkList(markList);
    setallAuctionCenterList(getAllAuctionCenterList);
    setallCategory(allActiveCategory);
    setallGrade(grades);
    setallBuyer(getUserData);
    setallSaleNoList(saleNoData);
    setbuyersPromptDate(auctionDate[0]?.buyersPromptDate);
    setallLoatNo(loatNoList);
    setallSessionTime(sessionTime);
    setallAuctioneerList(auctineerList);
    setallAuctionDate(auctionDate);
  }, [
    allTeaType,
    currentYear,
    markList,
    getAllAuctionCenterList,
    allActiveCategory,
    grades,
    getUserData,
    saleNoData,
    auctionDate,
    loatNoList,
    sessionTime,
    auctineerList,
  ]);

  const handleExport = (exportType) => {
    const updatedDealBookSearch = {
      ...DealBookSearch,
      url: "/postauction/dealbook/search",
      exportType: exportType,
      isExport: 1,
    };
    setexportType(exportType);
    dispatch(getExportData(updatedDealBookSearch));
  };
  const Validate = () => {
    let isValid = true;
    if (DealBookSearch.season == null || DealBookSearch.season === "") {
      CustomToast.error("Please select season");
      isValid = false;
      return;
    }
    if (DealBookSearch.saleNo == null || DealBookSearch.saleNo === "") {
      CustomToast.error("Please select sale no");
      isValid = false;
      return;
    }
    return isValid;
  };
  const ViewDealBookList = async () => {
    try {
      const response = await axiosMain.post("/postauction/dealbook/search", {
        ...DealBookSearch,
        pageNo: 1,
        noOfRecords: NO_OF_RECORDS,
      });

      if (response.data.statusCode == 200) {
        setViewDealBookTaoData(response.data.responseData);
        response.data.responseData?.map(
          (ele, i) =>
            (document.getElementById(`remark-${i}`).value =
              response.data.responseData?.at(i).remarks)
        );
        const selectAllCheckbox = document.getElementById("select-all");
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
        setPageNo(2);
      } else if (response.data.statusCode == 404) {
        setViewDealBookTaoData(response.data.responseData);
        response.data.responseData?.map(
          (ele, i) =>
            (document.getElementById(`remark-${i}`).value =
              response.data.responseData?.at(i).remarks)
        );
        const selectAllCheckbox = document.getElementById("select-all");
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      } else {
        CustomToast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [loader, setLoader] = useState(false);
  const SearchViewDealBook = (e) => {
    e.preventDefault();
    if (Validate()) {
      setLoader(true);
      ViewDealBookList();
      setTimeout(() => {
        setLoader(false);
      }, 1000);
    }
  };
  const ResetViewBook = (e) => {
    e.preventDefault();
    const selectAllCheckbox = document.getElementById("select-all");
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    setDealBookSearch({
      season: String(currentYear),
      saleNo: [],
      teaType: null,
      category: null,
      auctionDate: null,
      sessionTime: null,
      mark: null,
      buyerName: null,
      buyerPromptDate: null,
      lotNo: null,
      auctionCentre: auctionCenterId,
      dealStatus: null,
      gradeName: null,
      auctioneerName: null,
    });
    setbuyersPromptDate("");
    setViewDealBookTaoData([]);
  };
  const handleViewMore = async () => {
    try {
      const response = await axiosMain.post("/postauction/dealbook/search", {
        ...DealBookSearch,
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS, // Pass NO_OF_RECORDS as 20
      });
      if (Array.isArray(response.data.responseData)) {
        if (response.data.responseData.length === 0) {
          // Handle case when response is empty if necessary
        } else {
          setViewDealBookTaoData((prevData) => [
            ...prevData,
            ...response.data.responseData,
          ]);
          setPageNo((prevPageNo) => prevPageNo + 1); // Increment pageNo
        }
      } else {
        console.error(
          "Response data is not an array:",
          response.data.responseData
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleViewDealSearch = (e) => {
    const { name, value } = e.target;
    var selectedValue = value != "" ? value : null;
    setDealBookSearch({ ...DealBookSearch, [name]: selectedValue });
    setSeason(DealBookSearch.season);
  };
  const handleCheckboxChange = (index) => {
    const selectedRow = ViewDealBookTaoData[index];
    const updatedSelectedRows = [...selectedRowsData];
    if (updatedSelectedRows.includes(selectedRow)) {
      const rowIndex = updatedSelectedRows.indexOf(selectedRow);
      updatedSelectedRows.splice(rowIndex, 1);
    } else {
      updatedSelectedRows.push(selectedRow);
    }
    setSelectedRowsData(updatedSelectedRows);
  };
  const cancelDeal = () => {
    let dataList = [];
    let allRemarksProvided = true; // Assume all remarks are provided by default
    var remarks;
    ViewDealBookTaoData?.forEach((data, i) => {
      const checkbox = document.getElementById(`checkbox-${i}`);
      if (checkbox.checked) {
        remarks = document.getElementById(`remark-${i}`).value;
        // Check if remarks are provided for the selected row
        let remark = {
          remarks,
          dealbookId: data.dealNo,
          updatedBy: 3,
        };
        dataList.push(remark);
      }
    });
    if (!remarks) {
      allRemarksProvided = false;
      // Optionally, you can display a message or style the row to indicate the missing remark.
      CustomToast.error(`Remarks are mandatory for all selected rows`);
    }
    if (!allRemarksProvided) {
      // If remarks are missing for any selected rows, don't proceed with deletion.
      return;
    }
    if (dataList.length === 0) {
      CustomToast.error("No items selected for deletion.");
      return;
    }

    axiosMain
      .post("/postauction/dealbook/canceldeal", dataList)
      .then((response) => {
        if (response.data.statusCode == 200) {
          CustomToast.success(response.data.message);
          ViewDealBookList();
        } else {
          CustomToast.erro(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating remarks:", error);
      });
  };
  const deleteDeal = (dealNo, remark) => {
    const data = [
      {
        dealbookId: dealNo,
        remarks: remark,
        updatedBy: 3,
      },
    ];

    if (remark == "" || remark == null || remark == undefined) {
      CustomToast.error("Please enter remark");
      return;
    }

    axiosMain
      .post("/postauction/dealbook/canceldeal", data)
      .then((response) => {
        if (response.data.statusCode == 200) {
          CustomToast.success(response.data.message);
        } else {
          CustomToast.error(response.data.message);
        }

        ViewDealBookList();
      })
      .catch((error) => {
        console.error("Error updating remarks:", error);
      });
  };
  const handleRemarkChange = (index, updatedValue) => {
    const updatedRemarksList = [...remarksList];
    updatedRemarksList[index] = {
      remarks: updatedValue,
      dealbookId: ViewDealBookTaoData[index].dealNo,
      updatedBy: 3,
    };
    setRemarksList(updatedRemarksList);
  };

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAllChecked(isChecked);
    if (isChecked) {
      setSelectedRowsData([...ViewDealBookTaoData]);
    } else {
      setSelectedRowsData([]);
    }
  };

  // const selectAllHandler = () => {
  //   const selectAllCheckbox = document.getElementById("select-all");
  //   const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  //   checkboxes.forEach((checkbox) => {
  //     checkbox.checked = selectAllCheckbox.checked;
  //   });
  // };

  return (
    <div>
      <div>
        <form onSubmit={SearchViewDealBook}>
          {modalRight?.some((ele) => ele === "12") && (
            <div className="row">
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Season</label>
                  <label className="errorLabel"> * </label>
                  <select
                    name="season"
                    value={DealBookSearch.season}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Season</option>
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
                  <label>Sale No</label>
                  <label className="errorLabel"> * </label>
                  <select
                    name="saleNo"
                    onChange={handleViewDealSearch}
                    value={DealBookSearch.saleNo}
                    className="form-control select-form"
                  >
                    <option value="">Select Sale No</option>
                    {allSaleNoList.map((saleNoItem, index) => (
                      <option value={saleNoItem.saleNo} key={index}>
                        {saleNoItem.saleNo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Auction Date </label>
                  <select
                    name="auctionDate"
                    value={DealBookSearch.auctionDate}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Auction Date </option>
                    {allAuctionDate?.map((allAuctionDate, index) => (
                      <option value={allAuctionDate.saleDate}>
                        {allAuctionDate.saleDate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Session Time</label>
                  <select
                    name="sessionTime"
                    value={DealBookSearch.sessionTime}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Session Time </option>
                    {allSessionTime?.map((allSessionTime, index) => (
                      <option value={allSessionTime.SessionTime}>
                        {allSessionTime.SessionTime}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Tea Type</label>
                  <select
                    name="teaType"
                    value={DealBookSearch.teaType}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Tea Type</option>
                    {allTeaTypeList?.map((allTeaTypeList, index) => (
                      <option value={allTeaTypeList.teaTypeId}>
                        {allTeaTypeList.teaTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Category</label>
                  <select
                    name="category"
                    value={DealBookSearch.category}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Category</option>
                    {allCategory?.map((allCategory, index) => (
                      <option value={allCategory.categoryId}>
                        {allCategory.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Mark</label>
                  <select
                    name="mark"
                    value={DealBookSearch.mark}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
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
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Buyer Name</label>
                  <select
                    name="buyerName"
                    value={DealBookSearch.buyerName}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Buyer Name</option>
                    {allBuyer?.map((allBuyer, index) => (
                      <option value={allBuyer.userId}>
                        {allBuyer.userName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Buyer's Prompt Date</label>
                  <input
                    type="text"
                    name="buyerPromptDate"
                    className="form-control"
                    value={buyersPromptDate}
                    disabled
                  />
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Lot No</label>
                  <select
                    name="lotNo"
                    value={DealBookSearch.lotNo}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Lot No</option>
                    {allLoatNo.map((allLoatNo, index) => (
                      <option value={allLoatNo.LOT} key={index}>
                        {allLoatNo.LOT}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Auction Center </label>
                  <select
                    name="auctionCentre"
                    value={DealBookSearch.auctionCentre}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
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
                  <label>Deal Status </label>
                  <select
                    name="dealStatus"
                    value={DealBookSearch.dealStatus}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Deal Status</option>
                    <option value="0">Pending</option>
                    <option value="1">Completed</option>
                    <option value="4">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Grade Name </label>
                  <select
                    name="gradeName"
                    value={DealBookSearch.gradeName}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
                  >
                    <option value="">Select Grade Name</option>
                    {allGrade?.map((allGrade, index) => (
                      <option value={allGrade.gradeId} key={index}>
                        {allGrade.gradeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-xl-2">
                <div className="FomrGroup">
                  <label>Auctioneer Name </label>
                  <select
                    name="auctioneerName"
                    value={DealBookSearch.auctioneerName}
                    className="form-control select-form"
                    onChange={handleViewDealSearch}
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
              <div className="col-12">
                <div className="BtnGroup">
                  <button type="submit" className="SubmitBtn">
                    Search
                  </button>
                  <button
                    type="button"
                    className="SubmitBtn"
                    onClick={ResetViewBook}
                  >
                    Reset
                  </button>
                  {modalRight?.some((ele) => ele === "48") && (
                    <button
                      type="button"
                      className="Excel"
                      title="Export Excel"
                      onClick={() => handleExport("excel")}
                    >
                      <i className="fa fa-file-excel"></i>
                    </button>
                  )}
                  {modalRight?.some((ele) => ele === "47") && (
                    <button
                      type="button"
                      className="Excel"
                      title="Export PDF"
                      onClick={() => handleExport("pdf")}
                    >
                      <i className="fa fa-file-pdf"></i>
                    </button>
                  )}
                  {modalRight?.some((ele) => ele === "12") && (
                    <button
                      type="button"
                      className="Excel"
                      title="Delete All"
                      onClick={() => cancelDeal()}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="TableBox">
            <table className="table" ref={tableRef}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="select-all"
                      // onChange={selectAllHandler}
                      onChange={handleSelectAllChange}
                      checked={selectAllChecked}
                    />
                  </th>
                  <th>Sr.</th>
                  <th>Lot No</th>
                  <th>Mark</th>
                  <th>Grade</th>
                  <th>Invoice No</th>
                  <th>Qty. Received</th>
                  <th>Auction Value</th>
                  <th>Deal Status</th>
                  <th>Packages / Total Packages</th>
                  <th>Total Gross Weight </th>
                  <th>Sample Qty</th>
                  <th>Short/Excess Weight</th>
                  <th>Received Qty</th>
                  <th>Category </th>
                  <th>Tea Type</th>
                  <th>Sub Tea Type </th>
                  <th>Base Price</th>
                  <th>Session Type </th>
                  <th>Buyer Code</th>
                  <th>Buyer Name</th>
                  <th>Price</th>
                  <th>Deal No</th>
                  <th>Deal Time</th>
                  <th>Within State</th>
                  <th>Inter State</th>
                  <th>Export</th>
                  <th className="RemarksHead">Remarks* </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ViewDealBookTaoData?.length > 0 ? (
                  <>
                    {ViewDealBookTaoData?.map((data, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            name={`checkbox-${index}`}
                            id={`checkbox-${index}`}
                            onChange={() => handleCheckboxChange(index)}
                            checked={selectedRowsData.includes(data)}
                            disabled={
                              data.dealStatus == 4 || data.dealStatus == 3
                            }
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{data.lotNo}</td>
                        <td>{data.mark}</td>
                        <td>{data.grade}</td>
                        <td>{data.invoiceNo}</td>
                        <td>{data.qtyReceived}</td>
                        <td>{data.auctionValue}</td>
                        <td>
                          {data.dealStatus === 4 ? (
                            <strong className="Canceled">Cancelled</strong>
                          ) : (
                            ""
                          )}
                          {data.dealStatus === 3 ? (
                            <strong className="Transfared">Transferred</strong>
                          ) : (
                            ""
                          )}
                          {data.dealStatus === 2 ? (
                            <strong className="Closed">Closed</strong>
                          ) : (
                            ""
                          )}
                          {data.dealStatus === 0 ? (
                            <strong className="Pending">Pending</strong>
                          ) : (
                            ""
                          )}
                          {data.dealStatus === 1 ? (
                            <strong className="Updated">Completed</strong>
                          ) : (
                            ""
                          )}
                        </td>
                        <td>{data.packages}</td>
                        <td>{data.totalGrossWeight}</td>
                        <td>{data.sampleQty}</td>
                        <td>{data.shortWeight}</td>
                        <td>{data.receivedQty}</td>
                        <td>{data.category}</td>
                        <td>{data.teaType}</td>
                        <td>{data.subTeaType}</td>
                        <td>{data.basePrice}</td>
                        <td>{data.sessionType}</td>
                        <td>{data.buyerCode}</td>
                        <td>{data.buyerName}</td>
                        <td>{data.priceKG}</td>
                        <td>{data.dealNo}</td>
                        <td>{data.dealTime}</td>
                        <td>{data.withinState}</td>
                        <td>{data.interstate}</td>
                        <td>{data.export}</td>
                        <td className="d-none">
                          <input
                            type="text"
                            className="form-control"
                            name="updatedBy"
                            value={data.updatedBy}
                          />
                        </td>
                        <td>
                          <div className="RemarksInput">
                            <input
                              type="text"
                              className="form-control Remarks"
                              name="remarks"
                              id={`remark-${index}`}
                              placeholder="Remarks"
                              onChange={(e) =>
                                handleRemarkChange(index, e.target.value)
                              }
                              disabled={
                                !selectedRowsData.includes(data) ||
                                data.dealStatus === 4 ||
                                data.dealStatus === 3
                              }
                            />
                          </div>
                        </td>
                        <td className="Action text-center">
                          {data.dealStatus === 4 ? (
                            <>-</>
                          ) : (
                            <>
                              <i
                                className="fa fa-trash"
                                title="Delete"
                                onClick={() =>
                                  deleteDeal(
                                    data.dealNo,
                                    document.getElementById(`remark-${index}`)
                                      .value
                                  )
                                }
                              ></i>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    <tr>
                      <td colSpan={30}>
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
            <button
              class="SubmitBtn"
              type="button"
              onClick={handleViewMore}
              disabled={
                ViewDealBookTaoData?.length == 0 ||
                ViewDealBookTaoData?.length == null
              }
            >
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ViewDealBookTao;
