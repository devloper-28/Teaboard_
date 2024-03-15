/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import axiosMain from "../../../http/axios/axios_main";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { useSelector } from "react-redux";
import CustomToast from "../../../components/Toast";
import {
  bindAuctionDateRequest,
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
  getSaleNoRequest,
} from "../../../store/actions";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";
import { transferDealBookRequest } from "../../../store/actions/transferDealBookReducer/transferDealBookReducer";
import { ThreeDots } from "react-loader-spinner";

function TransferDealBook({ modalRight }) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 5; i++) {
    const year = currentYear - i;
    years.push(year);
  }
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId } =
    useAuctionDetail();
  const [TransferDealBookData, setTransferDealBook] = useState("");
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
  const tableRef = useRef(null);
  const [remarksList, setRemarksList] = useState([]);

  const [DealBookSearch, setDealBookSearch] = useState({
    season: String(currentYear),
    saleNo: null,
    auctionDate: null,
    sessionTime: null,
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
  const getUserData = useSelector(
    (state) => state.createBuyer.getBuyer.responseData
  );
  const saleNoData = useSelector((state) => state.saleNoReducer.saleList);
  const auctionDate = useSelector(
    (state) => state.saleNoReducer.auctionDateList
  );
  const sessionTime = useSelector(
    (state) => state.saleNoReducer.sessionTimeList
  );
  const transferDealBookState = useSelector((state) => state.transferDealBook);

  const Validate = () => {
    let isValid = true;
    if (
      DealBookSearch.season == null ||
      DealBookSearch.season == "" ||
      DealBookSearch.season == undefined
    ) {
      CustomToast.error("Please select season");
      isValid = false;
      return;
    }
    if (
      DealBookSearch.saleNo == null ||
      DealBookSearch.saleNo == "" ||
      DealBookSearch.saleNo == undefined
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
        "/postauction/dealbook/searchtransferdealbook",
        DealBookSearch
      );
      if (response.data.statusCode == 200) {
        // CustomToast.success(response.data.message);
        setTransferDealBook(response.data.responseData);
      } else {
        setTransferDealBook(null);
        CustomToast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [loader, setLoader] = useState(false);
  const SearchViewDealBook = async (e) => {
    e.preventDefault();
    if (Validate()) {
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        ViewDealBookList();
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
      saleNo: "",
      auctionDate: "",
      sessionTime: "",
    });
    setTimeout(() => {
      setDealBookSearch({
        season: String(currentYear),
        saleNo: null,
        auctionDate: null,
        sessionTime: null,
      });
    }, 0);
    setTransferDealBook("");
  };
  const handleViewDealSearch = (e) => {
    const { name, value } = e.target;
    // const updatedValue = value === 'null' ? null : value;
    var selectedValue = value !== "" ? value : null;
    setDealBookSearch({ ...DealBookSearch, [name]: selectedValue });
    setSeason(DealBookSearch.season);
  };
  const TransferedDealBook = (data) => {
    if (data == null) {
      CustomToast.error("No data found");
    } else {
      const dealBook = {
        season: data.season,
        saleNo: data.saleNo,
        auctionDate:
          data.auctionDate != null ? data.auctionDate : data.auctionDate,
        sessionTime:
          data.sessionTime != null ? data.sessionTime : data.sessionTime,
      };

      dispatch(transferDealBookRequest(dealBook));
      if (transferDealBookState == "") {
        setTransferDealBook(null);
      }
    }
  };

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
    setallSessionTime(sessionTime);
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
    sessionTime,
    auctionDate[0]?.buyersPromptDate,
    auctionDate,
  ]);

  return (
    <div>
      <div>
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
                      {allSaleNoList.map((saleNoItem, index) => (
                        <option value={parseInt(saleNoItem.saleNo)} key={index}>
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
                        <option
                          value={
                            new Date(allAuctionDate.saleDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        >
                          {
                            new Date(allAuctionDate.saleDate)
                              .toISOString()
                              .split("T")[0]
                          }
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
                  </div>
                </div>
              </div>
            </form>
            <div className="row mt-4">
              <div className="col-12">
                <div className="TableBox">
                  <table className="table" ref={tableRef}>
                    <thead>
                      <tr>
                        <th>Season</th>
                        <th>Sale No</th>
                        <th>No Of Lot</th>
                        <th>Auction Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TransferDealBookData == "failed" ||
                      TransferDealBookData == null ||
                      TransferDealBookData == "" ? (
                        <>
                          <tr>
                            <td colSpan={5}>
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
                      ) : (
                        <>
                          <tr>
                            <td>{TransferDealBookData?.season}</td>
                            <td>{TransferDealBookData?.saleNo}</td>
                            <td>{TransferDealBookData?.noOfLot}</td>
                            <td>{TransferDealBookData?.auctionDate}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="BtnGroup">
                {modalRight?.some((ele) => ele === "60") && (
                  <button
                    className="SubmitBtn"
                    onClick={() => TransferedDealBook(TransferDealBookData)}
                  >
                    Transfer
                  </button>
                )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TransferDealBook;
