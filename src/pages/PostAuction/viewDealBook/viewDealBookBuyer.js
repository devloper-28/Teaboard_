/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-dupe-keys */
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
  downloadExcelRequest,
  downloadPDFRequest,
  fetchAuctionRequest,
  fetchGradeRequest,
  fetchMarkRequest,
  getAllCategoriesAction,
  getAllTeaTypes,
  getBuyer,
  getDocumentByIdAction,
  getExportData,
  getExportDataApiCall,
  getFactoryTypeRequest,
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

function ViewDealBookBuyer({ modalRight }) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 5; i++) {
    const year = currentYear - i;
    years.push(year);
  }
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId } =
    useAuctionDetail();
  const [ViewDealBookBuyerData, setViewDealBookBuyerData] = useState([]);
  const [
    ViewDealBookBuyerDataForChangeValue,
    setViewDealBookBuyerDataForChangeValue,
  ] = useState([]);
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
  const [withinStates, setWithinStates] = useState([]);
  const [interstate, setinterstate] = useState([]);
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const [totalPackages, setTotalPackages] = useState(0);
  const [receivedQty, setreceivedQty] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [locationList, setLocationList] = useState({
    location: "A005-K1",
    location: "A005-K2",
  });
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = useState(2);
  const [dispatchLOcationData, setdispatchLOcationData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("SELECT");
  const [dispatchLocation, setdispatchLocation] = useState("");
  const [withindispatchLocation, setwithindispatchLocation] = useState("");
  const [exportdispatchlocation, setexportdispatchlocation] = useState("");
  const [updateLocation, setUpdateLocation] = useState([]);
  const [selectedDispatchLocation, setSelectedDispatchLocation] = useState("");
  const [withinStateEnabledTrue, setwithinStateEnabledTrue] = useState(0);
  const [interStateEnabledTrue, setinterStateEnabledTrue] = useState(0);
  const [originalWithinState, setOriginalWithinState] = useState([]);
  const [originalInterstate, setOriginalInterstate] = useState([]);
  const [selectedExportDispatchLocation, setSelectedExportDispatchLocation] =
    useState("");
  const [selectedWithinDispatchLocation, setSelectedWithinDispatchLocation] =
    useState("");
  const [
    selectedinterstateDispatchLocation,
    setselectedinterstateDispatchLocation,
  ] = useState("");
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
    buyerId: userId,
  });
  const [dispatchLocationData, setDispatchLocationData] = useState({
    dispatchlocation: null,
    withinDispatchlocation: null,
    exportDispatchlocation: null,
    interstateDispatchlocation: null,
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

  const handleExport = (exportType) => {
    const updatedDealBookSearch = {
      ...DealBookSearch,
      url: "/postauction/dealbook/buyer/search",
      exportType: exportType,
      isExport: 1,
    };
    setexportType(exportType);
    dispatch(getExportData(updatedDealBookSearch));
  };
  const Validate = () => {
    let isValid = true;
    if (
      DealBookSearch.season == null ||
      DealBookSearch.season == "SELECT" ||
      DealBookSearch.season == ""
    ) {
      CustomToast.error("Please select season");
      isValid = false;
      return;
    }
    if (
      DealBookSearch.saleNo == null ||
      DealBookSearch.saleNo == "SELECT" ||
      DealBookSearch.saleNo == ""
    ) {
      CustomToast.error("Please select sale no");
      isValid = false;
      return;
    }
    return isValid;
  };
  const ViewDealBookList = async () => {
    try {
      const response = await axiosMain.post(
        "/postauction/dealbook/buyer/search",
        { ...DealBookSearch, pageNo: 1, noOfRecords: NO_OF_RECORDS }
      );
      if (response.data.statusCode == 200) {
        const modifiedData = response.data.responseData.map((item) => {
          return {
            ...item,
            interStateEnabled: item.interstate > 0 ? true : false,
            withinStateEnabled: item.withinState > 0 ? true : false,
          };
        });
        setViewDealBookBuyerData(modifiedData);
        console.log(modifiedData, "modifiedData");
        setViewDealBookBuyerDataForChangeValue(response.data.responseData);
        setWithinStates(
          response.data.responseData?.map((ele) => ele.withinState)
        );
        setinterstate(response.data.responseData?.map((ele) => ele.interstate));
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
        setViewDealBookBuyerData(response.data.responseData);
        setViewDealBookBuyerDataForChangeValue(response.data.responseData);
        setWithinStates(
          response.data.responseData?.map((ele) => ele.withinState)
        );
        setinterstate(response.data.responseData?.map((ele) => ele.interstate));
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
        // CustomToast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const SearchViewDealBook = async (e) => {
    e.preventDefault();
    if (Validate()) {
      setViewDealBookBuyerData([]);
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        ViewDealBookList();
      }, 1000);
    }
  };
  const handleViewMore = async () => {
    try {
      const response = await axiosMain.post(
        "/postauction/dealbook/buyer/search",
        {
          ...DealBookSearch,
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        }
      );
      if (response.data.statusCode == 200) {
        if (Array.isArray(response.data.responseData)) {
          if (response.data.responseData.length === 0) {
          } else {
            setViewDealBookBuyerData((prevData) => [
              ...prevData,
              ...response.data.responseData,
            ]);
            setPageNo((prevPageNo) => prevPageNo + 1);
          }
        } else {
          console.error(
            "Response data is not an array:",
            response.data.responseData
          );
        }
      } else {
        CustomToast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const ResetViewBook = (e) => {
    e.preventDefault();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    setDealBookSearch({
      season: String(currentYear),
      saleNo: [],
      teaType: "",
      category: "",
      auctionDate: "",
      sessionTime: "",
      mark: "",
      buyerName: "",
      buyerPromptDate: "",
      lotNo: "",
      auctionCentre: auctionCenterId,
      dealStatus: "",
      gradeName: "",
      auctioneerName: "",
      buyerId: userId,
    });

    setTimeout(() => {
      setDealBookSearch({
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
        buyerId: userId,
      });
      console.log(DealBookSearch, "DealBookSearch");
    }, 0);

    setbuyersPromptDate("");
    setViewDealBookBuyerData([]);
    dispatch(
      bindSaleNoRequest({
        season: String(DealBookSearch?.season),
        auctionCenterId: auctionCenterId,
      })
    );
  };
  const handleViewDealSearch = (e) => {
    const { name, value } = e.target;
    var selectedValue = value != "" ? value : null;
    setDealBookSearch({ ...DealBookSearch, [name]: selectedValue });
    setSeason(DealBookSearch.season);
  };
  const UpdateDisapatchLocation = () => {
    if (selectedCheckboxes.length > 0) {
      const dataToUpdate = ViewDealBookBuyerData.filter((data) =>
        selectedCheckboxes.includes(data.dealNo)
      ).map((data) => ({
        dealbookId: data.dealNo,
        withinState: data.withinState,
        interstate: data.interstate,
        export: data.export,
        dispatchlocation: parseInt(dispatchLocationData.dispatchlocation),
        withinDispatchlocation: parseInt(
          dispatchLocationData.withinDispatchlocation
        ),
        exportDispatchlocation: parseInt(
          dispatchLocationData.exportDispatchlocation
        ),
        interstateDispatchlocation: parseInt(
          dispatchLocationData.interstateDispatchlocation
        ),
      }));

      let isValid = true;
      if (selectedCheckboxes.length > 0) {
        const dataToUpdate = ViewDealBookBuyerData.filter((data) =>
          selectedCheckboxes.includes(data.dealNo)
        ).map((data) => {
          const dispatchLocation = parseInt(
            dispatchLocationData.dispatchlocation
          );
          const withinDispatchLocation = parseInt(
            dispatchLocationData.withinDispatchlocation
          );
          const exportDispatchLocation = parseInt(
            dispatchLocationData.exportDispatchlocation
          );
          const interstateDispatchLocation = parseInt(
            dispatchLocationData.interstateDispatchlocation
          );
          console.log(
            data.interStateEnabled,
            interstateDispatchLocation,
            "interstateDispatchLocation"
          );
          if (isNaN(dispatchLocation) || dispatchLocation === null) {
            CustomToast.error("Please select dispatch location.");
            isValid = false;
            return;
          }
          if (
            isNaN(exportDispatchLocation) ||
            exportDispatchLocation === null
          ) {
            CustomToast.error("Please select export dispatch location.");
            isValid = false;
            return;
          }
          if (isNaN(withinDispatchLocation) && withinStateEnabledTrue > 0) {
            CustomToast.error("Please select within dispatch location.");
            isValid = false;
            return;
          }
          if (isNaN(interstateDispatchLocation) && interStateEnabledTrue > 0) {
            CustomToast.error("Please select interstate dispatchlocation.");
            isValid = false;
            return;
          }
          return isValid;
        });
      }

      if (isValid == true) {
        axiosMain
          .post("/postauction/dealbook/updatedispatchlocation", dataToUpdate)
          .then((response) => {
            if (response.data.statusCode == 200) {
              CustomToast.success(response.data.message);
              ViewDealBookList();
            } else {
              CustomToast.error(response.data.message);
            }
          })
          .catch((error) => {
            CustomToast.error("Error updating dispatch locations:", error);
          });
      } else {
        // Handle the case where no checkboxes are selected
        console.warn("No checkboxes selected for update.");
      }
    }
  };

  const [selectedRecords, setSelectedRecords] = useState([]);
  const handleCheckboxChange = (
    event,
    dealNo,
    withinStateEnabled,
    interStateEnabled
  ) => {
    const isChecked = event.target.checked;
    setSelectedRecords((prevSelectedRecords) =>
      isChecked
        ? [
            ...prevSelectedRecords,
            { dealNo, withinStateEnabled, interStateEnabled },
          ]
        : prevSelectedRecords.filter((record) => record.dealNo !== dealNo)
    );

    setSelectedCheckboxes((prevSelected) =>
      isChecked
        ? [...prevSelected, dealNo]
        : prevSelected.filter((selectedDealNo) => selectedDealNo !== dealNo)
    );

    setViewDealBookBuyerData((prevData) =>
      prevData.map((data) => (data.dealNo === dealNo ? { ...data } : data))
    );
  };
  useEffect(() => {
    const lengthwithinStateEnabled = selectedRecords.filter(
      (item) => item.withinStateEnabled
    ).length;
    setwithinStateEnabledTrue(lengthwithinStateEnabled);

    const lengthinterStateEnabled = selectedRecords.filter(
      (item) => item.interStateEnabled
    ).length;
    setinterStateEnabledTrue(lengthinterStateEnabled);

    console.log(
      lengthinterStateEnabled,
      lengthwithinStateEnabled,
      "selectedRecords"
    );
  }, [selectedRecords]);

  const handlePreferenceChange = (event, dealNo) => {
    const updatedPreferences = { ...preferences };
    updatedPreferences[dealNo] = event.target.value;
    setPreferences(updatedPreferences);
  };
  const Preferences = () => {
    const requestData = ViewDealBookBuyerData?.map((data) => ({
      dealbookId: data.dealNo,
      preference: preferences[data.dealNo] || "",
      updatedBy: 5,
      auctioneerCode: data.auctioneerCode,
    }));

    const filteredArray = requestData.filter(
      (item) => item.preference !== null && item.preference !== ""
    );
    for (var i = 0; i < filteredArray.length; i++) {
      for (var j = i + 1; j < filteredArray.length; j++) {
        if (
          filteredArray[i].auctioneerCode !== filteredArray[j].auctioneerCode
        ) {
          // If auctioneerCode is different, preference should be different index-wise
          if (filteredArray[i].preference === filteredArray[j].preference) {
            CustomToast.error(
              "Preference must be different for items with different auctioneer code."
            );
            return;
          }
        }
      }
    }
    try {
      axiosMain
        .post("/postauction/dealbook/savesalepreferences", filteredArray)
        .then((response) => {
          console.log(response);
          if (response.data.statusCode === 200) {
            CustomToast.success(response.data.message);
          } else {
            CustomToast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error("API call error:", error);
        });
    } catch (error) {
      console.error("API call error:", error);
    }
  };
  const handleDropdownChange = (event) => {
    const { name, value } = event.target;
    if (selectedCheckboxes.length === 0) {
      return;
    }
    switch (name) {
      case "dispatchlocation":
        setSelectedDispatchLocation(value);
        dispatchLocationData.dispatchlocation = value;
        break;
      case "withinDispatchlocation":
        setSelectedWithinDispatchLocation(value);
        dispatchLocationData.withinDispatchlocation = value;
        break;
      case "exportDispatchlocation":
        setSelectedExportDispatchLocation(value);
        dispatchLocationData.exportDispatchlocation = value;
        break;
      case "interstateDispatchlocation":
        setselectedinterstateDispatchLocation(value);
        dispatchLocationData.interstateDispatchlocation = value;
        break;
      default:
    }

    const updatedData = ViewDealBookBuyerData.map((data) => {
      if (selectedCheckboxes.includes(data.dealNo)) {
        switch (name) {
          case "dispatchlocation":
            data.dispatchLocation = value;
            break;
          case "withinDispatchlocation":
            data.withinDispatchLocation = value;
            break;
          case "exportDispatchlocation":
            data.exportDispatchLocation = value;
            break;
          case "interstate":
            data.interstate = value;
            break;
          default:
        }
      }
      return data;
    });

    // Update the state with the modified data
    setViewDealBookBuyerData(updatedData);
  };
  const handleInputChange = (index, field, value) => {
    const newData = [...ViewDealBookBuyerData];
    const originalWithinStateValue = originalWithinState[index];
    const originalInterstateValue = originalInterstate[index];
    if (field === "withinState") {
      const exportValue =
        originalInterstateValue - (value - originalWithinStateValue);
      if (exportValue < 0) {
        CustomToast.error("Total export value cannot be negative.");
      }

      newData[index]["export"] = exportValue;
    } else if (field === "interstate") {
      const exportValue =
        originalWithinStateValue - (value - originalInterstateValue);
      if (exportValue < 0) {
        CustomToast.error("Total export value cannot be negative.");
      }
      newData[index]["export"] = exportValue;
    }

    newData[index][field] = value;
    setViewDealBookBuyerData(newData);
  };
  const dispatchLocationList = () => {
    axiosMain
      .get(`/admin/auctionCenter/getAuctionCenterByUserId/${userId}`)
      .then((response) => {
        console.log("Response Data:", response.data.responseData);
        setdispatchLOcationData(response.data.responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
    let sum = 0;
    ViewDealBookBuyerData?.map((item) => {
      sum += item.packages;
      return item;
    });
    setTotalPackages(sum);
  }, [ViewDealBookBuyerData]);
  useEffect(() => {
    let sum = 0;
    ViewDealBookBuyerData?.map((item) => {
      sum += item.qtyReceived;
      return item;
    });
    setreceivedQty(sum);
  }, [ViewDealBookBuyerData]);
  useEffect(() => {
    let sum = 0;
    ViewDealBookBuyerData?.forEach((item) => {
      sum += item.qtyReceived * item.priceKG;
    });
    setTotalValue(sum);
  }, [ViewDealBookBuyerData]);
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
    if (ViewDealBookBuyerDataForChangeValue) {
      const originalWithinState = ViewDealBookBuyerDataForChangeValue.map(
        (data) => data.withinState
      );
      const originalInterstate = ViewDealBookBuyerDataForChangeValue.map(
        (data) => data.interstate
      );
      setOriginalWithinState(originalWithinState);
      setOriginalInterstate(originalInterstate);
    }
  }, [ViewDealBookBuyerDataForChangeValue]);
  useEffect(() => {
    dispatch(getAllTeaTypes());
    dispatch(fetchMarkRequest({ auctionCenterId: auctionCenterId }));
    dispatch(fetchAuctionRequest());
    dispatch(getAllCategoriesAction());
    dispatch(fetchGradeRequest({ auctionCenterId }));
    dispatch(getBuyer({ roleCode: "BUYER", userType: 2, isParentId: 0 }));
    dispatch(bindAuctioneerRequest({ roleCode: "AUCTIONEER" }));
    dispatchLocationList();
  }, []);
  useEffect(() => {
    setallTeaTypeList(allTeaType);
    setallMarkList(markList);
    setallAuctionCenterList(getAllAuctionCenterList);
    setallCategory(allActiveCategory);
    setallGrade(grades);
    setallBuyer(getUserData);
    setallAuctionDate(auctionDate);
    setallSaleNoList(saleNoData);
    setbuyersPromptDate(auctionDate[0]?.buyersPromptDate);
    setallLoatNo(loatNoList);
    setallSessionTime(sessionTime);
    setallAuctioneerList(auctineerList);
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
    auctineerList,
    sessionTime,
  ]);

  return (
    <div>
      <div>
        <>
          {modalRight?.some((ele) => ele === "12") && (
            <>
              <form onSubmit={SearchViewDealBook}>
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
                        {allSaleNoList?.map((saleNoItem, index) => (
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
                        {allLoatNo?.map((allLoatNo, index) => (
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
                            <option
                              value={allAuctionCenterList.auctionCenterId}
                            >
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

                  <div className="col-auto">
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
                          onClick={() => handleExport("excel")}
                          title="Export Excel"
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
                    </div>
                  </div>
                </div>
              </form>
              <div className="row">
                <div className="col-12">
                  <div className="TableBox">
                    <table className="table" ref={tableRef}>
                      <thead>
                        <tr>
                          <th>
                            <input type="checkbox" className="form-control" />
                          </th>
                          <th>Sr.</th>
                          <th>Lot No</th>
                          <th>Mark</th>
                          <th>Grade</th>
                          <th>Invoice No</th>
                          <th>Qty. Received</th>
                          <th>Deal Status</th>
                          <th>Auction Value</th>
                          <th>Packages / Total Packages</th>
                          <th>Total Gross Weight </th>
                          <th>Sample Qty</th>
                          <th>Short/Excess Weight</th>
                          <th>Tea Type</th>
                          <th>Base Price</th>
                          <th>Session Type </th>
                          <th>Price</th>
                          <th>Deal No</th>
                          <th>Deal Time</th>
                          <th>Within State</th>
                          <th>Inter State</th>
                          <th>Export</th>
                          <th>Preference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ViewDealBookBuyerData?.length > 0 ? (
                          <>
                            {ViewDealBookBuyerData?.map((data, index) => (
                              <tr key={index}>
                                <td className="d-none">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="updatedBy"
                                    value={data.updatedBy}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-control"
                                    onChange={(event) =>
                                      handleCheckboxChange(
                                        event,
                                        data.dealNo,
                                        data.withinStateEnabled,
                                        data.interStateEnabled
                                      )
                                    }
                                    disabled={
                                      data.dealStatus === 2 ||
                                      data.dealStatus === 3 ||
                                      data.dealStatus === 4
                                    }
                                  />
                                </td>
                                <td>{index + 1}</td>
                                <td>{data.lotNo}</td>
                                <td>{data.mark}</td>
                                <td>{data.grade}</td>
                                <td>{data.invoiceNo}</td>
                                <td>{data.qtyReceived}</td>
                                <td>
                                  {data.dealStatus === 4 ? (
                                    <strong className="Canceled">
                                      Cancelled
                                    </strong>
                                  ) : (
                                    ""
                                  )}
                                  {data.dealStatus === 3 ? (
                                    <strong className="Transfared">
                                      Transferred
                                    </strong>
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
                                    <strong className="Updated">
                                      Completed
                                    </strong>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td>{data.auctionValue}</td>
                                <td>{data.packages}</td>
                                <td>{data.totalGrossWeight}</td>
                                <td>{data.sampleQty}</td>
                                <td>{data.shortWeight}</td>
                                <td>{data.teaType}</td>
                                <td>{data.basePrice}</td>
                                <td>{data.sessionType}</td>
                                <td>{data.priceKG}</td>
                                <td>{data.dealNo}</td>
                                <td>{data.dealTime}</td>
                                <td>
                                  <input
                                    type="number"
                                    min={0}
                                    value={data.withinState}
                                    className="form-control"
                                    disabled={
                                      !selectedCheckboxes.includes(
                                        data.dealNo
                                      ) ||
                                      originalWithinState[index] === 0 ||
                                      data.dealStatus === 2
                                    }
                                    onChange={(e) => {
                                      const newValue = parseFloat(
                                        e.target.value
                                      );
                                      const originalValue =
                                        originalWithinState[index];
                                      if (newValue > originalValue) {
                                        CustomToast.error(
                                          "New value cannot be greater than the original value."
                                        );
                                        return;
                                      }
                                      const exportValue =
                                        originalValue - newValue;
                                      handleInputChange(
                                        index,
                                        "export",
                                        exportValue
                                      );
                                      handleInputChange(
                                        index,
                                        "withinState",
                                        newValue
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    min={0}
                                    value={data.interstate}
                                    className="form-control"
                                    disabled={
                                      !selectedCheckboxes.includes(
                                        data.dealNo
                                      ) ||
                                      originalInterstate[index] == 0 ||
                                      data.dealStatus === 2
                                    }
                                    onChange={(e) => {
                                      const newValue = parseFloat(
                                        e.target.value
                                      );
                                      const originalValue =
                                        originalInterstate[index];
                                      if (newValue > originalValue) {
                                        CustomToast.error(
                                          "New value cannot be greater than the original value."
                                        );
                                        return;
                                      }
                                      const exportValue =
                                        originalValue - newValue;
                                      handleInputChange(
                                        index,
                                        "export",
                                        exportValue
                                      );
                                      handleInputChange(
                                        index,
                                        "interstate",
                                        newValue
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  {data.interstate == 0 ? (
                                    <>
                                      <input
                                        type="number"
                                        min={0}
                                        value={data.export}
                                        className="form-control"
                                        disabled={
                                          !selectedCheckboxes.includes(
                                            data.dealNo
                                          ) || data.dealStatus === 2
                                        }
                                        onChange={(e) => {
                                          const newValue = parseFloat(
                                            e.target.value
                                          );
                                          const originalValue =
                                            originalInterstate[index];
                                          if (newValue > originalValue) {
                                            CustomToast.error(
                                              "New value cannot be greater than the original value."
                                            );
                                            return;
                                          }
                                          const exportValue =
                                            originalValue - newValue;
                                          handleInputChange(
                                            index,
                                            "export",
                                            exportValue
                                          );
                                          handleInputChange(
                                            index,
                                            "interstate",
                                            newValue
                                          );
                                        }}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <input
                                        type="number"
                                        min={0}
                                        value={data.export}
                                        className="form-control"
                                        disabled={true}
                                        onChange={(e) =>
                                          parseFloat(e.target.value) +
                                            parseFloat(data.interstate) <=
                                          interstate?.at(index)
                                            ? handleInputChange(
                                                index,
                                                "export",
                                                e.target.value
                                              )
                                            : CustomToast.error(
                                                "Export value must be less then current value."
                                              )
                                        }
                                      />
                                    </>
                                  )}
                                </td>
                                <td>
                                  {" "}
                                  {/* <input
                                    type="text"
                                    className="form-control"
                                    name={`preference_${data.dealNo}`}
                                    value={preferences[data.dealNo] || ""}
                                    disabled={
                                      !selectedCheckboxes.includes(
                                        data.dealNo
                                      ) || data.dealStatus === 2
                                    }
                                    onChange={(event) =>
                                      handlePreferenceChange(event, data.dealNo)
                                    }
                                  /> */}
                                  <input
                                    type="text"
                                    className="form-control"
                                    name={`preference_${data.dealNo}`}
                                    value={
                                      preferences[data.dealNo] ||
                                      data.preferences ||
                                      ""
                                    }
                                    disabled={
                                      !selectedCheckboxes.includes(data.dealNo)
                                    }
                                    onChange={(event) =>
                                      handlePreferenceChange(event, data.dealNo)
                                    }
                                  />
                                </td>
                                <td className="d-none">
                                  {data.auctioneerCode}
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
                        ViewDealBookBuyerData?.length == 0 ||
                        ViewDealBookBuyerData?.length == null
                      }
                    >
                      View More
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="row my-4">
            <div className="col-md-auto">
              <strong>
                <span className="totals">Total Packages :</span> {totalPackages}
              </strong>
            </div>
            <div className="col-md-auto">
              <strong>
                <span className="totals">Qty. Received :</span> {receivedQty}
              </strong>
            </div>
            <div className="col-md-auto">
              <strong>
                <span className="totals">Total Value :</span> {totalValue}
              </strong>
            </div>
          </div>
          <div className="row mt-2">
            {modalRight?.some((ele) => ele === "58") && (
              <div className="col-md-auto">
                <div className="FomrGroup">
                  <label>Dispatch Location</label>
                  <select
                    name="dispatchlocation"
                    value={selectedDispatchLocation}
                    onChange={handleDropdownChange}
                    className="form-control select-form"
                    disabled={selectedCheckboxes?.length === 0}
                  >
                    <option value="">Select Dispatch Location</option>
                    {dispatchLOcationData?.map((location, index) => (
                      <option key={index} value={location.auctionCenterId}>
                        {location.auctionCenterName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {modalRight?.some((ele) => ele === "58") && (
              <div className="col-md-auto">
                <div className="FomrGroup">
                  <label>Export Dispatch Location</label>
                  <select
                    className="form-control select-form"
                    name="exportDispatchlocation"
                    value={selectedExportDispatchLocation}
                    onChange={handleDropdownChange}
                    disabled={selectedCheckboxes?.length == 0}
                  >
                    <option value="">Select Dispatch Location </option>
                    {dispatchLOcationData?.map(
                      (dispatchLOcationData, index) => (
                        <option value={dispatchLOcationData.auctionCenterId}>
                          {dispatchLOcationData.auctionCenterName}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            )}
            {modalRight?.some((ele) => ele === "58") && (
              <div className="col-md-auto">
                <div className="FomrGroup">
                  <label>Within Dispatch Location</label>
                  <select
                    className="form-control select-form"
                    name="withinDispatchlocation"
                    value={selectedWithinDispatchLocation}
                    onChange={handleDropdownChange}
                    disabled={
                      selectedCheckboxes?.length === 0 ||
                      withinStateEnabledTrue === 0
                    }
                  >
                    <option value="">Select Dispatch Location</option>
                    {dispatchLOcationData?.map(
                      (dispatchLOcationData, index) => (
                        <option value={dispatchLOcationData.auctionCenterId}>
                          {dispatchLOcationData.auctionCenterName}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            )}
            {modalRight?.some((ele) => ele === "58") && (
              <div className="col-md-auto">
                <div className="FomrGroup">
                  <label>Inter State Dispatch Location</label>
                  <select
                    className="form-control select-form"
                    name="interstateDispatchlocation"
                    value={selectedinterstateDispatchLocation}
                    onChange={handleDropdownChange}
                    disabled={
                      selectedCheckboxes?.length === 0 ||
                      interStateEnabledTrue === 0
                    }
                  >
                    <option value="">Select Dispatch Location </option>
                    {dispatchLOcationData?.map(
                      (dispatchLOcationData, index) => (
                        <option value={dispatchLOcationData.auctionCenterId}>
                          {dispatchLOcationData.auctionCenterName}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            )}

            <div className="col-auto">
              <div className="BtnGroup">
                {modalRight?.some((ele) => ele === "58") && (
                  <button
                    className="SubmitBtn"
                    disabled={selectedCheckboxes.length == 0}
                    onClick={() => UpdateDisapatchLocation()}
                  >
                    Update Dispatch Location
                  </button>
                )}
                {modalRight?.some((ele) => ele === "59") && (
                  <button
                    className="SubmitBtn"
                    disabled={selectedCheckboxes.length == 0}
                    onClick={() => Preferences()}
                  >
                    Save sale Preferences
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ViewDealBookBuyer;