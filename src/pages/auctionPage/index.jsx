/* eslint-disable jsx-a11y/anchor-has-content */

/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";
import TableComponent from "./Table";
import AuctionData from "../../constants/Datas";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useTimer } from "react-timer-hook";
import {
  fetchAuctionCenterData,
  fetchAuctionCenterHeaderData,
  fetchAuctionCenterDataApiCall,
  fetchAuctionCenterDataSuccess,
  bidderConfirm,
  bidderIn,
  bidderOut,
  catelogFetchAllData,
  catelogSubmitData,
  catelogFetchAllDataSuccess,
  getSummaryOfTeaSoldData,
  getAuctioneerMarketSummaryData,
  getAuctioneerMarketSummaryWiseData,
  getAuctioneerMarketSummaryWiseDataSuccess,
  getMarketSummaryData,
  getMyPlannerData,
} from "../../store/actions";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import "../../assets/css/auctionPage.css";
import { Table } from "react-bootstrap";
import CustomToast from "../../components/Toast";

let socket = false;
let isSummaryCalled = false;
let isPlannerCalled = false;
let firstCall = 0;
let isHoldAuctionCalled = false;
const StatusList = ({ value }) => (
  <span className="badge badge-secondary w-100">{value}</span>
);

let isTimeAvailable = false;
const Auction = () => {
  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();

  const [rows, setRows] = useState([]);
  // const [rows, setRows] = useState([]);

  const [leftColumns, setLeftColumns] = useState([]);
  const [rightColumns, setRightColumns] = useState([]);

  const activeClass = useSelector((state) => state.toggle.activeClass);

  const [updatedData, setUpdatedData] = useState([]);

  const [columns, setColumns] = useState([]);

  const [fixedColumn, setFixedColumn] = useState([]);

  const [fixedColumns, setFixedColumns] = useState([]);

  const [selectedColumns, setSelectedColumns] = useState([]);

  const [leftNo, setLeftNo] = useState(0);
  const [rightNo, setRightNo] = useState(0);
  const [stickyInput, setStickyInput] = useState({
    leftNo: 0,
    rightNo: 0,
  });
  const [dataMenu, setdataMenu] = useState(false);

  const [leftDbData, setLeftDbData] = useState([]);
  const [rightDbData, setRightDbData] = useState([]);
  const [leftData, setLeftData] = useState([]);
  const [rightData, setRightData] = useState([]);

  const [
    showAuctioneerMarketWiseSummaryData,
    setShowAuctioneerMarketWiseSummaryData,
  ] = useState(false);
  const [
    auctioneerMarketWiseSummaryDataValue,
    setAuctioneerMarketWiseSummaryDataValue,
  ] = useState(false);

  const time = new Date();

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);

    if (2 == tabNumber) {
      handleSummaryOfTeaSoldModal(true);
    }

    if (3 == tabNumber) {
      handlePlannerModal(true);
    }
  };

  useEffect(() => {
    let payloadData = {
      userAuctionLoginId:
        window.location.pathname &&
        window.location.pathname.split("/") &&
        window.location.pathname.split("/")[3]
          ? atob(
              window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[3]
            )
          : "",
      auctionDetailId:
        window.location.pathname &&
        window.location.pathname.split("/") &&
        window.location.pathname.split("/")[2]
          ? atob(
              window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[2]
            )
          : "",
    };
    dispatch(fetchAuctionCenterData(payloadData));
    dispatch(fetchAuctionCenterHeaderData(payloadData));
    socket = true;
    // socketHandler();
  }, []);

  let auctionData = useSelector((state) => state.auctionPage.fetchData);

  const auctionDataColumnDetails = auctionData?.responseData?.columnDetails;

  const auctionDataLiveBidDetails = auctionData?.responseData?.liveBidDetails;

  const fetchAuctionCenterHeaderDataResponse = useSelector(
    (state) => state.auctionPage?.fetchAuctionCenterHeaderData?.responseData
  );

  let fetchAuctionCenterDataApiCallResponse = useSelector(
    (state) => state.auctionPage.fetchAuctionCenterDataApiCall
  );

  useEffect(() => {
    if (true == fetchAuctionCenterDataApiCallResponse) {
      dispatch(fetchAuctionCenterDataApiCall(false));

      let tempUpdatedData = auctionDataColumnDetails?.map((item) => ({
        ...item,
        name: item.columnName,
      }));

      setUpdatedData(tempUpdatedData);

      let tempColumnsData = tempUpdatedData?.map((item) => ({
        ...item,
        title: item.name,
      }));
      setColumns(tempColumnsData);

      let tempFixedColumnsData = auctionDataColumnDetails?.map((item) => ({
        ...item,
        name: item.columnName,
      }));

      setFixedColumn(tempFixedColumnsData);

      let tempFixedColumnData = tempFixedColumnsData?.map((item) => ({
        ...item,
        title: item.name,
      }));

      setFixedColumns(tempFixedColumnData);

      let tempSelectedColumnsData = tempUpdatedData?.map((item) => ({
        ...item,
        name: item.name,
        checked: tempFixedColumnsData
          ?.map((ele) => ele.name)
          .includes(item.name), // Assign either true or false as desired
      }));

      setSelectedColumns(tempSelectedColumnsData);

      let tempRowData = [];
      auctionDataLiveBidDetails &&
        auctionDataLiveBidDetails.forEach((item, index) => {
          const combinedJSON = {};
          let isPeachColorAndBidderNotIn = false;
          // combinedJSON["rowColor"] = item.itemColor;
          if (true == isTimeAvailable) {
            combinedJSON["rowColor"] = "pending-lots-color1";
            item.isActive = 0;
            if (0 == item.isItemSelected) {
              isPeachColorAndBidderNotIn = true;
            } else {
              isPeachColorAndBidderNotIn = false;
            }
          } else {
            combinedJSON["rowColor"] = item.itemColor;
          }

          // Iterate through the list of JSON objects and add them to the combined JSON
          item.columnDetails.forEach((item1, index) => {
            // You can use a unique key for each item
            if (42 == item1.columnTypeId) {
              combinedJSON[item1.columnName] = (
                <input
                  type="text"
                  id={item.auctionItemDetailId}
                  onChange={(event) =>
                    handleChange(
                      item,
                      item.auctionItemDetailId,
                      item1.columnTypeId,
                      event.target.value,
                      "columnValue"
                    )
                  }
                  value={item1.columnValue}
                  disabled={
                    true == isHoldAuctionCalled
                      ? true
                      : true == isPeachColorAndBidderNotIn
                      ? false
                      : 0 == item.isItemSelected &&
                        0 == item.isActive &&
                        ("pending-lots-color1" == item.itemColor ||
                          "pending-lots-color" == item.itemColor)
                      ? false
                      : 1 == item.isItemSelected &&
                        1 == item.isActive &&
                        "unsold-lots-color" != item.itemColor &&
                        "sold-lots-color" != item.itemColor &&
                        "out-button-lots-color" != item.itemColor &&
                        "winner-buyer-lots-color" != item.itemColor &&
                        "active-lots-reached-max-bid-color" != item.itemColor
                      ? false
                      : true
                  }
                  className={
                    true == isPeachColorAndBidderNotIn
                      ? "liveAuctionInput form-control"
                      : 0 == item.isItemSelected &&
                        0 == item.isActive &&
                        ("pending-lots-color1" == item.itemColor ||
                          "pending-lots-color" == item.itemColor)
                      ? "liveAuctionInput form-control"
                      : 1 == item.isItemSelected &&
                        1 == item.isActive &&
                        "unsold-lots-color" != item.itemColor &&
                        "sold-lots-color" != item.itemColor &&
                        "out-button-lots-color" != item.itemColor &&
                        "winner-buyer-lots-color" != item.itemColor &&
                        "active-lots-reached-max-bid-color" != item.itemColor
                      ? "liveAuctionInput form-control"
                      : "liveAuctionInput form-control disabled"
                  }
                />
              );
            } else if (43 == item1.columnTypeId) {
              combinedJSON[item1.columnName] = (
                <div className="BtnGroup d-flex justify-space-even">
                  <button
                    onClick={() => handleButton("confirm", item)}
                    disabled={
                      true == isHoldAuctionCalled
                        ? true
                        : true == isTimeAvailable
                        ? true
                        : 1 == item.isItemSelected &&
                          1 == item.isActive &&
                          "unsold-lots-color" != item.itemColor &&
                          "sold-lots-color" != item.itemColor &&
                          "out-button-lots-color" != item.itemColor &&
                          "winner-buyer-lots-color" != item.itemColor &&
                          "active-lots-reached-max-bid-color" != item.itemColor
                        ? false
                        : true
                    }
                    className={
                      true == isTimeAvailable
                        ? "liveAuctionBtn disabled"
                        : 1 == item.isItemSelected &&
                          1 == item.isActive &&
                          "unsold-lots-color" != item.itemColor &&
                          "sold-lots-color" != item.itemColor &&
                          "out-button-lots-color" != item.itemColor &&
                          "winner-buyer-lots-color" != item.itemColor &&
                          "active-lots-reached-max-bid-color" != item.itemColor
                        ? "liveAuctionBtn"
                        : "liveAuctionBtn disabled"
                    }
                  >
                    Confirm
                  </button>
                </div>
              );
            } else if (44 == item1.columnTypeId) {
              combinedJSON[item1.columnName] = (
                <div className="BtnGroup d-flex justify-space-even">
                  <button
                    onClick={() => handleButton("in", item)}
                    disabled={
                      true == isHoldAuctionCalled
                        ? true
                        : true == isPeachColorAndBidderNotIn
                        ? false
                        : "pending-lots-color" == item.itemColor &&
                          0 == item.isItemSelected
                        ? false
                        : "sold-lots-color" == item.itemColor ||
                          "unsold-lots-color" == item.itemColor ||
                          "active-lots-reached-max-bid-color" == item.itemColor
                        ? true
                        : true
                    }
                    className={
                      true == isPeachColorAndBidderNotIn
                        ? false
                        : "pending-lots-color" == item.itemColor &&
                          0 == item.isItemSelected
                        ? "liveAuctionBtn"
                        : "sold-lots-color" == item.itemColor ||
                          "unsold-lots-color" == item.itemColor ||
                          "active-lots-reached-max-bid-color" == item.itemColor
                        ? "liveAuctionBtn disabled"
                        : "liveAuctionBtn disabled"
                    }
                  >
                    IN
                  </button>
                </div>
              );
            } else if (45 == item1.columnTypeId) {
              combinedJSON[item1.columnName] = (
                <div className="BtnGroup d-flex justify-space-even">
                  <button
                    onClick={() => handleButton("out", item)}
                    disabled={
                      true == isHoldAuctionCalled
                        ? true
                        : true == isTimeAvailable
                        ? true
                        : 1 == item.isItemSelected &&
                          1 == item.isActive &&
                          "unsold-lots-color" != item.itemColor &&
                          "sold-lots-color" != item.itemColor &&
                          "out-button-lots-color" != item.itemColor &&
                          "winner-buyer-lots-color" != item.itemColor &&
                          "active-lots-reached-max-bid-color" != item.itemColor
                        ? false
                        : true
                    }
                    className={
                      true == isTimeAvailable
                        ? "liveAuctionBtn disabled"
                        : 1 == item.isItemSelected &&
                          1 == item.isActive &&
                          "unsold-lots-color" != item.itemColor &&
                          "sold-lots-color" != item.itemColor &&
                          "out-button-lots-color" != item.itemColor &&
                          "winner-buyer-lots-color" != item.itemColor &&
                          "active-lots-reached-max-bid-color" != item.itemColor
                        ? "liveAuctionBtn"
                        : "liveAuctionBtn disabled"
                    }
                  >
                    OUT
                  </button>{" "}
                </div>
              );
            } else if (6 == item1.columnTypeId) {
              //For status
              combinedJSON[item1.columnName] =
                true == isTimeAvailable
                  ? item1.columnValue
                  : "active-lots-color" == item.itemColor ||
                    "active-lots-reached-max-bid-color" == item.itemColor ||
                    "max-bid-reached-lots-color" == item.itemColor
                  ? "Active"
                  : item1.columnValue;
            } else {
              combinedJSON[item1.columnName] = item1.columnValue;
            }
          });
          tempRowData.push(combinedJSON);
        });
      setRows(tempRowData);
    }
  });

  const socketHandler = () => {
    let url =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_END_POINT_URL_DEV
        : process.env.REACT_APP_END_POINT_URL_PROD;

    // Connect to the server using SockJS
    const socket = new SockJS(
      url +
        "/auctionbid/connect?token=" +
        atob(sessionStorage.getItem("argument1"))
    );

    // Create a Stomp.js client over the WebSocket connection
    let stompClient = Stomp.over(socket);

    // Function to subscribe to a static on the server
    const subscribeToStaticCall = () => {
      console.log("firstCall 386", firstCall);

      stompClient.subscribe(
        `/auctionbid/broadcast/biddingdashboard/${atob(
          window.location.pathname &&
            window.location.pathname.split("/") &&
            window.location.pathname.split("/")[2]
        )}`,
        (message) => {
          // if (message.body) {
          //   console.log("static update called");
          //   console.log("auctionData before", auctionData);

          //   if (firstCall == 0) {
          //     firstCall = firstCall + 1;
          //     let payloadData = {
          //       userAuctionLoginId:
          //         window.location.pathname &&
          //         window.location.pathname.split("/") &&
          //         window.location.pathname.split("/")[3]
          //           ? atob(
          //               window.location.pathname &&
          //                 window.location.pathname.split("/") &&
          //                 window.location.pathname.split("/")[3]
          //             )
          //           : "",
          //       auctionDetailId:
          //         window.location.pathname &&
          //         window.location.pathname.split("/") &&
          //         window.location.pathname.split("/")[2]
          //           ? atob(
          //               window.location.pathname &&
          //                 window.location.pathname.split("/") &&
          //                 window.location.pathname.split("/")[2]
          //             )
          //           : "",
          //     };
          //     dispatch(fetchAuctionCenterHeaderData(payloadData));
          //   }

          //   let tempLiveBidDetailsData =
          //     auctionData &&
          //     auctionData.responseData &&
          //     auctionData.responseData.liveBidDetails &&
          //     auctionData.responseData.liveBidDetails.map(
          //       (liveBidDetailsData, liveBidDetailsIndex) => {
          //         let currentBid = liveBidDetailsData.currentBid;
          //         let increment = liveBidDetailsData.increment;
          //         let itemColor = liveBidDetailsData.itemColor;
          //         let l1Amount = liveBidDetailsData.l1Amount;
          //         let maxBid = liveBidDetailsData.maxBid;
          //         let isActive = liveBidDetailsData.isActive;

          //         if (1 == isActive) {
          //           let tempColumnDetailsData =
          //             liveBidDetailsData &&
          //             liveBidDetailsData.columnDetails &&
          //             liveBidDetailsData.columnDetails.map(
          //               (columnDetailsData, columnDetailsIndex) => {
          //                 if (35 == columnDetailsData.columnTypeId) {
          //                   console.log(
          //                     "currentBid + increment 148",
          //                     currentBid + increment
          //                   );

          //                   if (
          //                     currentBid + increment <= maxBid &&
          //                     "unsold-lots-color" != itemColor &&
          //                     "sold-lots-color" != itemColor
          //                   ) {
          //                     columnDetailsData.columnValue =
          //                       currentBid + increment;
          //                     liveBidDetailsData.currentBid =
          //                       currentBid + increment;
          //                   }
          //                 }
          //                 return columnDetailsData;
          //               }
          //             );
          //         }

          //         return liveBidDetailsData;
          //       }
          //     );

          //   let tempUpdatedLiveBidDetailsData = auctionData.responseData;
          //   tempUpdatedLiveBidDetailsData.liveBidDetails =
          //     tempLiveBidDetailsData;

          //   let tempAuctionData = auctionData;
          //   auctionData.responseData = tempUpdatedLiveBidDetailsData;
          //   auctionData = tempAuctionData;
          //   console.log("rows 438", rows);
          // }
          if (message.body) {
            console.log("dynamic update called");
            if (firstCall == 0) {
              firstCall = firstCall + 1;
              let payloadData = {
                userAuctionLoginId:
                  window.location.pathname &&
                  window.location.pathname.split("/") &&
                  window.location.pathname.split("/")[3]
                    ? atob(
                        window.location.pathname &&
                          window.location.pathname.split("/") &&
                          window.location.pathname.split("/")[3]
                      )
                    : "",
                auctionDetailId:
                  window.location.pathname &&
                  window.location.pathname.split("/") &&
                  window.location.pathname.split("/")[2]
                    ? atob(
                        window.location.pathname &&
                          window.location.pathname.split("/") &&
                          window.location.pathname.split("/")[2]
                      )
                    : "",
              };
              dispatch(fetchAuctionCenterHeaderData(payloadData));
            }
            let payloadData = {
              userAuctionLoginId:
                window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[3]
                  ? atob(
                      window.location.pathname &&
                        window.location.pathname.split("/") &&
                        window.location.pathname.split("/")[3]
                    )
                  : "",
              auctionDetailId:
                window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[2]
                  ? atob(
                      window.location.pathname &&
                        window.location.pathname.split("/") &&
                        window.location.pathname.split("/")[2]
                    )
                  : "",
            };

            dispatch(fetchAuctionCenterData(payloadData));
          }
        }
      );
    };

    // Function to subscribe to a dynamic on the server
    const subscribeToDynamicCall = () => {
      stompClient.subscribe(
        `/auctionbid/broadcast/biddingdashboarddyn/${atob(
          window.location.pathname &&
            window.location.pathname.split("/") &&
            window.location.pathname.split("/")[2]
        )}`,
        (message) => {
          if (message.body) {
            console.log("dynamic update called");
            if (firstCall == 0) {
              firstCall = firstCall + 1;
              let payloadData = {
                userAuctionLoginId:
                  window.location.pathname &&
                  window.location.pathname.split("/") &&
                  window.location.pathname.split("/")[3]
                    ? atob(
                        window.location.pathname &&
                          window.location.pathname.split("/") &&
                          window.location.pathname.split("/")[3]
                      )
                    : "",
                auctionDetailId:
                  window.location.pathname &&
                  window.location.pathname.split("/") &&
                  window.location.pathname.split("/")[2]
                    ? atob(
                        window.location.pathname &&
                          window.location.pathname.split("/") &&
                          window.location.pathname.split("/")[2]
                      )
                    : "",
              };
              dispatch(fetchAuctionCenterHeaderData(payloadData));
            }
            let payloadData = {
              userAuctionLoginId:
                window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[3]
                  ? atob(
                      window.location.pathname &&
                        window.location.pathname.split("/") &&
                        window.location.pathname.split("/")[3]
                    )
                  : "",
              auctionDetailId:
                window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[2]
                  ? atob(
                      window.location.pathname &&
                        window.location.pathname.split("/") &&
                        window.location.pathname.split("/")[2]
                    )
                  : "",
            };

            dispatch(fetchAuctionCenterData(payloadData));

            //If summary is open then call summary api
            if (true == isSummaryCalled) {
              handleSummaryOfTeaSoldModal(true);
            }

            //If planner is open then call planner api
            if (true == isPlannerCalled) {
              handlePlannerModal(true);
            }
          }
        }
      );
    };

    //Function to hold auction
    const subscribeToHoldAuction = () => {
      stompClient.subscribe(`/auctionbid/broadcast/holdAuction`, (message) => {
        if (message.body) {
          console.log("hold auction called");
          isHoldAuctionCalled = true;
          if (firstCall == 0) {
            firstCall = firstCall + 1;
            let payloadData = {
              userAuctionLoginId:
                window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[3]
                  ? atob(
                      window.location.pathname &&
                        window.location.pathname.split("/") &&
                        window.location.pathname.split("/")[3]
                    )
                  : "",
              auctionDetailId:
                window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[2]
                  ? atob(
                      window.location.pathname &&
                        window.location.pathname.split("/") &&
                        window.location.pathname.split("/")[2]
                    )
                  : "",
            };
            dispatch(fetchAuctionCenterHeaderData(payloadData));
          }
          let payloadData = {
            userAuctionLoginId:
              window.location.pathname &&
              window.location.pathname.split("/") &&
              window.location.pathname.split("/")[3]
                ? atob(
                    window.location.pathname &&
                      window.location.pathname.split("/") &&
                      window.location.pathname.split("/")[3]
                  )
                : "",
            auctionDetailId:
              window.location.pathname &&
              window.location.pathname.split("/") &&
              window.location.pathname.split("/")[2]
                ? atob(
                    window.location.pathname &&
                      window.location.pathname.split("/") &&
                      window.location.pathname.split("/")[2]
                  )
                : "",
          };

          dispatch(fetchAuctionCenterData(payloadData));

          //If summary is open then call summary api
          if (true == isSummaryCalled) {
            handleSummaryOfTeaSoldModal(true);
          }

          //If planner is open then call planner api
          if (true == isPlannerCalled) {
            handlePlannerModal(true);
          }
          CustomToast.warning("Auction is on hold");
        }
      });
    };

    // Connect to the WebSocket server
    stompClient.connect({}, () => {
      console.log("Connected to WebSocket server");
      subscribeToStaticCall();
      subscribeToDynamicCall();
      subscribeToHoldAuction();
    });
  };

  if (
    socket &&
    auctionData != null &&
    auctionData != undefined &&
    auctionData.responseData &&
    auctionData.responseData != null &&
    auctionData.responseData != undefined
  ) {
    socket = false;
    socketHandler();
  }

  const handleButton = (name, data) => {
    console.log("handleButton 69", data);
    switch (name) {
      case "confirm": {
        console.log("handleButton in confirm", data);

        let maxBid = 0;

        data &&
          data.columnDetails &&
          data.columnDetails.map((columnDetailsData, columnDetailsIndex) => {
            if (42 == columnDetailsData.columnTypeId) {
              maxBid = columnDetailsData.columnValue;
            }
          });

        let payloadData = {
          auctionItemDetailId: data.auctionItemDetailId,
          bidderId:
            window.location.pathname &&
            window.location.pathname.split("/") &&
            window.location.pathname.split("/")[3]
              ? atob(
                  window.location.pathname &&
                    window.location.pathname.split("/") &&
                    window.location.pathname.split("/")[3]
                )
              : "",
          maxBid: maxBid,
        };

        dispatch(bidderConfirm(payloadData));
        break;
      }

      case "in": {
        console.log("handleButton in in", data);
        let maxBid = 0;

        data &&
          data.columnDetails &&
          data.columnDetails.map((columnDetailsData, columnDetailsIndex) => {
            if (42 == columnDetailsData.columnTypeId) {
              maxBid = columnDetailsData.columnValue;
            }
          });

        let payloadData = {
          auctionItemDetailId: data.auctionItemDetailId,
          bidderId:
            window.location.pathname &&
            window.location.pathname.split("/") &&
            window.location.pathname.split("/")[3]
              ? atob(
                  window.location.pathname &&
                    window.location.pathname.split("/") &&
                    window.location.pathname.split("/")[3]
                )
              : "",
          maxBid: maxBid,
        };

        dispatch(bidderIn(payloadData));
        break;
      }

      case "out": {
        console.log("handleButton in out", data);
        let payloadData = {
          auctionItemDetailId: data.auctionItemDetailId,
          bidderId:
            window.location.pathname &&
            window.location.pathname.split("/") &&
            window.location.pathname.split("/")[3]
              ? atob(
                  window.location.pathname &&
                    window.location.pathname.split("/") &&
                    window.location.pathname.split("/")[3]
                )
              : "",
        };

        dispatch(bidderOut(payloadData));
        break;
      }

      default: {
        break;
      }
    }
  };

  const handleChange = (
    data,
    auctionItemDetailId,
    columnTypeId,
    value,
    key
  ) => {
    let tempLiveBidDetailsData =
      auctionData &&
      auctionData.responseData &&
      auctionData.responseData.liveBidDetails &&
      auctionData.responseData.liveBidDetails.map(
        (liveBidDetailsData, liveBidDetailsIndex) => {
          if (auctionItemDetailId == liveBidDetailsData.auctionItemDetailId) {
            let tempColumnDetailsData =
              liveBidDetailsData &&
              liveBidDetailsData.columnDetails &&
              liveBidDetailsData.columnDetails.map(
                (columnDetailsData, columnDetailsIndex) => {
                  if (columnTypeId == columnDetailsData.columnTypeId) {
                    columnDetailsData[key] = value;
                  }

                  return columnDetailsData;
                }
              );
          }

          return liveBidDetailsData;
        }
      );

    let tempUpdatedLiveBidDetailsData = auctionData.responseData;
    tempUpdatedLiveBidDetailsData.liveBidDetails = tempLiveBidDetailsData;

    let tempAuctionData = auctionData;
    auctionData.responseData = tempUpdatedLiveBidDetailsData;

    dispatch(fetchAuctionCenterDataSuccess(tempAuctionData));
    dispatch(fetchAuctionCenterDataApiCall(true));
  };

  const [tableColumnExtensions] = useState([
    { columnName: "LotNo", width: 125 },
    { columnName: "Session Period" },
    { columnName: "Session Status" },
    { columnName: "Session Type" },
  ]);

  const lastIndex = fixedColumns?.map((ele) => ele);
  lastIndex?.reverse();

  useEffect(() => {
    let leftColumnsArray = [];
    if (Number.isInteger(leftNo) && leftNo > 0) {
      leftColumnsArray = [...Array(leftNo)]?.map(
        (_, index) => fixedColumns[index].name
      );
      setLeftData(leftColumnsArray);
    } else {
      //locked data get from api
      let length = fixedColumns.length / 2;
      for (let i = 0; i < fixedColumns.length; i++) {
        if (i < length) {
          if (1 == fixedColumns[i].isLocked) {
            leftColumnsArray.push(fixedColumns[i].name);
          }
        }
      }
      setLeftDbData(leftColumnsArray);
      setLeftData(leftColumnsArray);
    }

    setLeftColumns(leftColumnsArray);
  }, [leftNo, fixedColumns]);

  useEffect(() => {
    let rightColumnsArray = [];
    if (Number.isInteger(rightNo) && rightNo > 0) {
      rightColumnsArray = [...Array(rightNo)]?.map(
        (_, index) => lastIndex[index].name
      );
      setRightData(rightColumnsArray);
    } else {
      //locked data get from api
      let length = fixedColumns.length / 2;
      for (let i = fixedColumns.length - 1; i > 0; i--) {
        if (length < i) {
          if (1 == fixedColumns[i].isLocked) {
            rightColumnsArray.push(fixedColumns[i].name);
          }
        }
      }
      setRightDbData(rightColumnsArray);
      setRightData(rightColumnsArray);
    }
    setRightColumns(rightColumnsArray);
  }, [rightNo, fixedColumns]);

  const custmizeColumn = [
    {
      column: Number.isInteger(leftNo) && leftNo > 0 ? leftData : leftDbData,
      functionName: (props) => (
        <DataTypeProvider formatterComponent={StatusList} {...props} />
      ),
    },
    {
      column:
        Number.isInteger(rightNo) && rightNo > 0 ? rightData : rightDbData,
      functionName: (props) => (
        <DataTypeProvider formatterComponent={StatusList} {...props} />
      ),
    },
  ];

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleModal = (value) => {
    setShow(value);

    if (true == value) {
      setLeftNo(0);
      setRightNo(0);
      setStickyInput({
        leftNo: 0,
        rightNo: 0,
      });

      let payloadData = {
        userLoginId:
          window.location.pathname &&
          window.location.pathname.split("/") &&
          window.location.pathname.split("/")[3]
            ? atob(
                window.location.pathname &&
                  window.location.pathname.split("/") &&
                  window.location.pathname.split("/")[3]
              )
            : "",
        auctionDetailId:
          window.location.pathname &&
          window.location.pathname.split("/") &&
          window.location.pathname.split("/")[2]
            ? atob(
                window.location.pathname &&
                  window.location.pathname.split("/") &&
                  window.location.pathname.split("/")[2]
              )
            : "",
      };
      dispatch(catelogFetchAllData(payloadData));
    } else {
      setLeftNo(0);
      setRightNo(0);
      setStickyInput({
        leftNo: 0,
        rightNo: 0,
      });
    }
  };

  const catelogFetchAllDataResponses = useSelector(
    (state) => state.auctionPage?.catelogFetchAllData
  );

  const catelogFetchAllDataResponse = useSelector(
    (state) => state.auctionPage?.catelogFetchAllData?.responseData
  );

  const selectRecord = (key, value, columnTypeId) => {
    let tempData =
      catelogFetchAllDataResponse &&
      catelogFetchAllDataResponse.map((innerData, innerIndex) => {
        if (columnTypeId == innerData.columnTypeId) {
          innerData[key] = value;
        }
        return innerData;
      });

    let updateData = catelogFetchAllDataResponses;
    catelogFetchAllDataResponses.responseData = tempData;
    dispatch(catelogFetchAllDataSuccess(updateData));
  };

  const handleStickySubmit = () => {
    setRightNo(stickyInput.rightNo);
    setLeftNo(stickyInput.leftNo);
    // handleModal(false);
    setShow(false);

    //For filtered is shown 1 data
    let catelogFetchAllDataResponseFilterData = [];

    let catelogFetchAllDataResponseFilterIds = [];
    catelogFetchAllDataResponse &&
      catelogFetchAllDataResponse.map(
        (catelogFetchAllDataResponseData, catelogFetchAllDataResponseIndex) => {
          if (catelogFetchAllDataResponseData.isShown) {
            catelogFetchAllDataResponseFilterData.push(
              catelogFetchAllDataResponseData
            );
            catelogFetchAllDataResponseFilterIds.push(
              catelogFetchAllDataResponseData.columnTypeId
            );
          }
        }
      );

    //To set left columns locked
    for (let i = 0; i < catelogFetchAllDataResponseFilterData.length; i++) {
      if (i < stickyInput.leftNo) {
        catelogFetchAllDataResponseFilterData[i].isLocked = 1;
      } else {
        catelogFetchAllDataResponseFilterData[i].isLocked = 0;
      }
    }

    let tempFixedColumnData = catelogFetchAllDataResponseFilterData?.map(
      (item) => ({
        ...item,
        title: item.name,
      })
    );

    //To set right columns locked
    let rightLength = tempFixedColumnData.length - (stickyInput.rightNo + 1);
    for (let i = tempFixedColumnData.length - 1; i > rightLength; i--) {
      catelogFetchAllDataResponseFilterData[i].isLocked = 1;
    }

    let tempAllData = catelogFetchAllDataResponseFilterData;
    if (
      catelogFetchAllDataResponseFilterIds &&
      catelogFetchAllDataResponseFilterIds.length > 0
    ) {
      catelogFetchAllDataResponse &&
        catelogFetchAllDataResponse.map(
          (
            catelogFetchAllDataResponseData,
            catelogFetchAllDataResponseIndex
          ) => {
            if (
              !catelogFetchAllDataResponseFilterIds.includes(
                catelogFetchAllDataResponseData.columnTypeId
              )
            ) {
              tempAllData.push(catelogFetchAllDataResponseData);
            }
          }
        );
    }

    let payloadData = {
      userLoginId:
        window.location.pathname &&
        window.location.pathname.split("/") &&
        window.location.pathname.split("/")[3]
          ? atob(
              window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[3]
            )
          : "",
      auctionDetailId:
        window.location.pathname &&
        window.location.pathname.split("/") &&
        window.location.pathname.split("/")[2]
          ? atob(
              window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[2]
            )
          : "",
      userAuctionLoginId:
        window.location.pathname &&
        window.location.pathname.split("/") &&
        window.location.pathname.split("/")[3]
          ? atob(
              window.location.pathname &&
                window.location.pathname.split("/") &&
                window.location.pathname.split("/")[3]
            )
          : "",
      catalogColumnConfigurationDetails: tempAllData,
    };

    dispatch(catelogSubmitData(payloadData));
  };

  const handleSummaryOfTeaSoldModal = (value) => {
    setdataMenu(value);
    isSummaryCalled = value;

    if (true == value) {
      let payloadData = {
        auctionDetailId:
          window.location.pathname &&
          window.location.pathname.split("/") &&
          window.location.pathname.split("/")[2]
            ? atob(
                window.location.pathname &&
                  window.location.pathname.split("/") &&
                  window.location.pathname.split("/")[2]
              )
            : "",
        userAuctionLoginId:
          window.location.pathname &&
          window.location.pathname.split("/") &&
          window.location.pathname.split("/")[3]
            ? atob(
                window.location.pathname &&
                  window.location.pathname.split("/") &&
                  window.location.pathname.split("/")[3]
              )
            : "",
      };

      dispatch(getSummaryOfTeaSoldData(payloadData));
      dispatch(getAuctioneerMarketSummaryData(payloadData));
      dispatch(getMarketSummaryData(payloadData));
    } else {
      handleTabClick(1);
    }
  };

  const onClickOfAuctioneerMarketSummary = (flag, data) => {
    if (flag) {
      let payloadData = {
        auctionDetailId:
          window.location.pathname &&
          window.location.pathname.split("/") &&
          window.location.pathname.split("/")[2]
            ? atob(
                window.location.pathname &&
                  window.location.pathname.split("/") &&
                  window.location.pathname.split("/")[2]
              )
            : "",
        userLoginId: data.commonUserId,
      };
      setAuctioneerMarketWiseSummaryDataValue(data.auctioneerCode);
      dispatch(getAuctioneerMarketSummaryWiseData(payloadData));
    } else {
      dispatch(getAuctioneerMarketSummaryWiseDataSuccess([]));
      setAuctioneerMarketWiseSummaryDataValue("");
    }
    setShowAuctioneerMarketWiseSummaryData(flag);
  };

  const getSummaryOfTeaSoldDataResponse = useSelector(
    (state) => state.auctionPage?.getSummaryOfTeaSoldData?.responseData
  );

  const getAuctioneerMarketSummaryDataResponse = useSelector(
    (state) => state.auctionPage?.getAuctioneerMarketSummaryData?.responseData
  );

  const getAuctioneerMarketSummaryWiseDataResponse = useSelector(
    (state) =>
      state.auctionPage?.getAuctioneerMarketSummaryWiseData?.responseData
  );

  const getMarketSummaryDataResponse = useSelector(
    (state) => state.auctionPage?.getMarketSummaryData?.responseData
  );

  const handlePlannerModal = (value) => {
    setdataMenu(value);
    isPlannerCalled = true;
    if (true == value) {
      let payloadData = {
        auctionDetailId:
          window.location.pathname &&
          window.location.pathname.split("/") &&
          window.location.pathname.split("/")[2]
            ? atob(
                window.location.pathname &&
                  window.location.pathname.split("/") &&
                  window.location.pathname.split("/")[2]
              )
            : "",
        bidderId:
          window.location.pathname &&
          window.location.pathname.split("/") &&
          window.location.pathname.split("/")[3]
            ? atob(
                window.location.pathname &&
                  window.location.pathname.split("/") &&
                  window.location.pathname.split("/")[3]
              )
            : "",
      };

      dispatch(getMyPlannerData(payloadData));
    } else {
      handleTabClick(1);
    }
  };

  const getMyPlannerDataResponse = useSelector(
    (state) => state.auctionPage?.getMyPlannerData?.responseData
  );

  const CalculateDifferenceBetweenCurrentTimeAndMBTTime = (
    currentDate,
    auctionDate,
    minimumBidTime
  ) => {
    let date1 = new Date(currentDate);
    let date2 = new Date(minimumBidTime);
    let date3 = new Date(auctionDate);

    // Calculate the time difference in milliseconds
    let timeDifferenceOfCurrentAndAuctionDate = 1;
    if (date1.getTime() > date2.getTime()) {
      timeDifferenceOfCurrentAndAuctionDate = date3 - date1;
    } else {
      timeDifferenceOfCurrentAndAuctionDate = date3 - date2;
    }

    // Convert the time difference to a more human-readable format
    let seconds = Math.floor(
      (timeDifferenceOfCurrentAndAuctionDate / 1000) % 60
    );

    let minutes = Math.floor(
      (timeDifferenceOfCurrentAndAuctionDate / (1000 * 60)) % 60
    );

    let hours = Math.floor(
      (timeDifferenceOfCurrentAndAuctionDate / (1000 * 60 * 60)) % 24
    );

    if (hours <= 0 && minutes <= 0 && seconds <= 0) {
      time.setHours(0);
      time.setMinutes(0);
      time.setSeconds(0);
      isTimeAvailable = false;
    } else {
      time.setHours(time.getHours() + hours);
      time.setMinutes(time.getMinutes() + minutes);
      time.setSeconds(time.getSeconds() + seconds);
      isTimeAvailable = true;
    }
  };

  function MyTimer({ expiryTimestamp }) {
    const { seconds, minutes, hours } = useTimer({
      expiryTimestamp,
      onExpire: () => console.warn("onExpire called"),
    });

    return (
      <>
        <span>{hours > 9 ? hours : "0" + hours}</span>:
        <span>{minutes > 9 ? minutes : "0" + minutes}</span>:
        <span>{seconds > 9 ? seconds : "0" + seconds}</span>
      </>
    );
  }

  const handleMyCatalogModal = (value) => {
    setdataMenu(value);
    handleTabClick(1);
  };

  const moduleList = useSelector(
    (state) => state?.ModuleReducer?.data?.responseData
  );

  console.log("moduleList 1298", moduleList);

  const [rightsIdData, setRightsIdData] = useState([]);

  if (
    moduleList !== null &&
    moduleList !== undefined &&
    rightsIdData?.length == 0
  ) {
    setRightsIdData(
      moduleList?.auctionCentersList
        ?.map((auctionCenters) => auctionCenters.modulesDtoList)
        ?.at(0)
        ?.filter((modulesDto) => modulesDto.moduleid == 3)
        ?.at(0)
        ?.linksDtoList?.filter((linksDto) => linksDto.linkId == 52)
        ?.at(0)?.rightIds
    );
  }

  return (
    <>
      {auctionDataLiveBidDetails == null ? (
        "No data found"
      ) : (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Table Setting</Modal.Title>
              <i
                className="fa fa-times CloseModal"
                onClick={() => handleModal(false)}
              ></i>
            </Modal.Header>

            <Modal.Body>
              <div className="row">
                <div className="col-md-6">
                  <div class="FomrGroup">
                    <label>Left Column</label>
                    <input
                      type="text"
                      className="form-control"
                      min={0}
                      max={columns && columns.length && columns.length / 2}
                      value={stickyInput.leftNo >= 0 ? stickyInput.leftNo : ""}
                      onChange={(e) =>
                        setStickyInput({
                          ...stickyInput,
                          leftNo:
                            e.target.value <= columns?.length
                              ? parseFloat(e.target.value)
                              : "",
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div class="FomrGroup">
                    <label>Right Column</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        stickyInput.rightNo >= 0 ? stickyInput.rightNo : ""
                      }
                      min={0}
                      max={columns && columns.length && columns.length / 2}
                      onChange={(e) =>
                        setStickyInput({
                          ...stickyInput,
                          rightNo:
                            e.target.value <= columns?.length
                              ? parseFloat(e.target.value)
                              : "",
                        })
                      }
                    />
                  </div>
                </div>
                {/* <div className="col-md-12">
              <div class="FomrGroup">
                <label>Select Column</label>
                <select className="form-control select-form">
                  <option value="">LotNo</option>
                  <option value="">Origin</option>
                  <option value="">Type</option>
                  <option value="">Subtype</option>
                </select>
              </div>
            </div> */}

                <div class="col-md-12">
                  <div class="CardBox">
                    <h5 class="SmallTitle">Select Column</h5>
                    <ul>
                      {catelogFetchAllDataResponse &&
                        catelogFetchAllDataResponse.map((data, index) => (
                          <li>
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="isShown"
                                value={data.isShown}
                                id={data.columnTypeId}
                                checked={data.isShown == 1 ? true : false}
                                onChange={(event) => {
                                  selectRecord(
                                    event.target.name,
                                    event.target.checked == true ? 1 : 0,
                                    data.columnTypeId
                                  );
                                }}
                                disabled={data.isEditable == 0 ? true : false}
                              />
                              <label className="ml-2">{data.columnName}</label>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="SubmitBtn"
                onClick={() => handleStickySubmit()}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="container-fluid-">
            <div className="header-2">
              <span>
                <b>MBT :</b>
                {fetchAuctionCenterHeaderDataResponse != undefined &&
                fetchAuctionCenterHeaderDataResponse != null ? (
                  <>
                    {CalculateDifferenceBetweenCurrentTimeAndMBTTime(
                      fetchAuctionCenterHeaderDataResponse.currentDate,
                      fetchAuctionCenterHeaderDataResponse.auctionDate,
                      fetchAuctionCenterHeaderDataResponse.minimumBidTime
                    )}
                    <MyTimer expiryTimestamp={time} />
                  </>
                ) : (
                  ""
                )}
              </span>
              <span className="divider"></span>
              <span>
                <b>Season :</b>
                {fetchAuctionCenterHeaderDataResponse &&
                  fetchAuctionCenterHeaderDataResponse.season}
              </span>
              <span className="divider"></span>
              <span>
                <b>Sale No :</b>
                {fetchAuctionCenterHeaderDataResponse &&
                  fetchAuctionCenterHeaderDataResponse.saleNo}
              </span>
              <span className="divider"></span>
              <span>
                <b>Auction Date :</b>
                {fetchAuctionCenterHeaderDataResponse &&
                  fetchAuctionCenterHeaderDataResponse.auctionDate}
              </span>

              <span className="divider"></span>
              <span>
                <b>Current Session Time :</b>
                {fetchAuctionCenterHeaderDataResponse &&
                  fetchAuctionCenterHeaderDataResponse.currentSessionTime}
              </span>
            </div>
          </div>
          <div
            className={activeClass ? "active MainComponent" : "MainComponent "}
          >
            <div className="container-fluid">
              <div className="AuctionScreen">
                <div className="TabsMenu">
                  <ul>
                    {console.log("line 1486", rightsIdData.includes(43))}
                    {rightsIdData.includes("43") ? (
                      <li
                        className={`${activeTab === 1 ? "active" : ""}`}
                        onClick={() => handleTabClick(1)}
                      >
                        Auctioneer Catalog
                      </li>
                    ) : (
                      ""
                    )}

                    {rightsIdData.includes("44") ? (
                      <li
                        className={`${activeTab === 2 ? "active" : ""}`}
                        onClick={() => handleTabClick(2)}
                      >
                        Summary
                      </li>
                    ) : (
                      ""
                    )}

                    {rightsIdData.includes("45") ? (
                      <li
                        className={`${activeTab === 3 ? "active" : ""}`}
                        onClick={() => handleTabClick(3)}
                      >
                        My Planner
                      </li>
                    ) : (
                      ""
                    )}

                    {"BUYER" == atob(sessionStorage.getItem("argument6")) ||
                    "AUCTIONEER" ==
                      atob(sessionStorage.getItem("argument6")) ? (
                      <li
                        className={`${activeTab === 4 ? "active" : ""}`}
                        onClick={() => handleTabClick(4)}
                      >
                        My Catalog
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>

                  {rightsIdData.includes("46") ? (
                    <a
                      className="TableSetting"
                      onClick={() => handleModal(true)}
                    >
                      <i class="fa fa-wrench" aria-hidden="true"></i>
                    </a>
                  ) : (
                    ""
                  )}
                </div>

                <div className="LiveAuction">
                  <div
                    className={`TableBox ${dataMenu == true ? "active" : ""}`}
                  >
                    {columns.length > 0 ? (
                      <>
                        <TableComponent
                          columns={selectedColumns}
                          updatedData={updatedData}
                          setColumns={setColumns}
                          rows={rows}
                          setRows={setRows}
                          leftColumns={leftColumns}
                          rightColumns={rightColumns}
                          tableColumnExtensions={tableColumnExtensions}
                          custmize={custmizeColumn}
                          fixedColumns={fixedColumns}
                          setFixedColumns={setFixedColumns}
                          selectedColumns={selectedColumns}
                          setSelectedColumns={setSelectedColumns}
                          dragdrop={true}
                          fixedColumnsOn={true}
                          resizeingCol={true}
                          sorting={false}
                        />
                        <div class="status-bx-view">
                          <div class="status-bx">
                            <span class="status-color-bx active-lots-color"></span>
                            <span class="status-name"> Active Lots</span>
                          </div>

                          <div class="status-bx">
                            <span class="status-color-bx pending-lots-color"></span>
                            <span class="status-name"> Pending Lots</span>
                          </div>

                          <div class="status-bx">
                            <span class="status-color-bx sold-lots-color"></span>
                            <span class="status-name"> Sold Lots</span>
                          </div>

                          <div class="status-bx">
                            <span class="status-color-bx unsold-lots-color"></span>
                            <span class="status-name"> Unsold Lots </span>
                          </div>

                          <div class="status-bx">
                            <span class="status-color-bx max-bid-reached-lots-color"></span>
                            <span class="status-name"> MaxBidOut </span>
                          </div>

                          <div class="status-bx">
                            <span class="status-color-bx winner-buyer-lots-color"></span>
                            <span class="status-name"> WinnerBuyer </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  <div
                    className={`LiveAuctionMenu ${
                      activeTab === 2 ? "active " : ""
                    } ${activeClass && "ShowSideBar"}`}
                  >
                    {activeTab === 2 && (
                      <div className="Summery">
                        <span
                          class="Close"
                          onClick={() => {
                            handleSummaryOfTeaSoldModal(false);
                          }}
                        >
                          x
                        </span>
                        <div className="row">
                          {/* Summary of Tea Sold */}
                          <div className="col-lg-4">
                            <div className="Shadow">
                              <div className="Title">Summary of Tea Sold</div>
                              <div className="TableBox">
                                <Table striped bordered hover>
                                  <thead>
                                    <tr>
                                      <th>Lot No.</th>
                                      <th>Mark</th>
                                      <th>Grade</th>
                                      <th>Pkgs</th>
                                      <th>Closing</th>
                                      <th>Bidder</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {getSummaryOfTeaSoldDataResponse != null ? (
                                      <>
                                        {getSummaryOfTeaSoldDataResponse &&
                                          getSummaryOfTeaSoldDataResponse.map(
                                            (teaSoldData, teaSoldDataIndex) => (
                                              <tr>
                                                <td>{teaSoldData.lotNo}</td>
                                                <td>{teaSoldData.mark}</td>
                                                <td>{teaSoldData.grade}</td>
                                                <td>
                                                  {teaSoldData.noOfPackages}
                                                </td>
                                                <td>
                                                  {teaSoldData.closingPrice}
                                                </td>
                                                <td>
                                                  {teaSoldData.winningBuyer}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                      </>
                                    ) : (
                                      "No data available"
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </div>

                          {/* Auctioneer Market Summary */}
                          <div className="col-lg-4">
                            <div className="Shadow">
                              <div className="Title">
                                Auctioneer Market Summary
                                {true == showAuctioneerMarketWiseSummaryData
                                  ? ` - ${auctioneerMarketWiseSummaryDataValue}`
                                  : ""}
                                {true == showAuctioneerMarketWiseSummaryData ? (
                                  <span
                                    class="Close"
                                    onClick={() => {
                                      onClickOfAuctioneerMarketSummary(
                                        false,
                                        []
                                      );
                                    }}
                                  >
                                    x
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                              {false == showAuctioneerMarketWiseSummaryData ? (
                                <ul className="AuctioneerList">
                                  {getAuctioneerMarketSummaryDataResponse !=
                                  null ? (
                                    <>
                                      {getAuctioneerMarketSummaryDataResponse &&
                                        getAuctioneerMarketSummaryDataResponse.map(
                                          (
                                            auctioneerMarketSummaryData,
                                            auctioneerMarketSummaryIndex
                                          ) => (
                                            <li
                                              onClick={() =>
                                                onClickOfAuctioneerMarketSummary(
                                                  true,
                                                  auctioneerMarketSummaryData
                                                )
                                              }
                                            >
                                              {
                                                auctioneerMarketSummaryData.auctioneerCode
                                              }
                                            </li>
                                          )
                                        )}
                                    </>
                                  ) : (
                                    "No data available"
                                  )}
                                </ul>
                              ) : (
                                <Table striped bordered hover>
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th>No. of Lots</th>
                                      <th>Pkgs</th>
                                      <th>Kgs</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {getAuctioneerMarketSummaryWiseDataResponse !=
                                    null ? (
                                      <>
                                        {getAuctioneerMarketSummaryWiseDataResponse &&
                                          getAuctioneerMarketSummaryWiseDataResponse.map(
                                            (
                                              auctioneerMarketSummaryWiseData,
                                              auctioneerMarketSummaryWiseDataIndex
                                            ) => (
                                              <>
                                                {auctioneerMarketSummaryWiseDataIndex !=
                                                4 ? (
                                                  <>
                                                    <tr>
                                                      <td>
                                                        {
                                                          auctioneerMarketSummaryWiseData.columnName
                                                        }
                                                      </td>
                                                      <td>
                                                        {
                                                          auctioneerMarketSummaryWiseData.noOfLots
                                                        }
                                                      </td>
                                                      <td>
                                                        {
                                                          auctioneerMarketSummaryWiseData.noOfPackages
                                                        }
                                                      </td>{" "}
                                                      <td>
                                                        {
                                                          auctioneerMarketSummaryWiseData.totalKgs
                                                        }
                                                      </td>
                                                    </tr>
                                                  </>
                                                ) : (
                                                  <>
                                                    <tr>
                                                      <td>
                                                        {
                                                          auctioneerMarketSummaryWiseData.averagePrice
                                                        }
                                                      </td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                    </tr>
                                                  </>
                                                )}
                                              </>
                                            )
                                          )}
                                      </>
                                    ) : (
                                      "No data available"
                                    )}
                                  </tbody>
                                </Table>
                              )}
                            </div>
                          </div>

                          {/* Market Summary */}
                          <div className="col-lg-4">
                            <div className="Shadow">
                              <div className="Title">Market Summary</div>
                              <div className="TableBox">
                                <Table striped bordered hover>
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th>No. of Lots</th>
                                      <th>Pkgs</th>
                                      <th>Kgs</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {getMarketSummaryDataResponse != null ? (
                                      <>
                                        {getMarketSummaryDataResponse &&
                                          getMarketSummaryDataResponse.map(
                                            (
                                              marketSummaryData,
                                              marketSummaryDataIndex
                                            ) => (
                                              <>
                                                {marketSummaryDataIndex == 5 ? (
                                                  <>
                                                    <tr>
                                                      <td>
                                                        {
                                                          marketSummaryData.columnName
                                                        }
                                                      </td>
                                                      <td>
                                                        {
                                                          marketSummaryData.averagePrice
                                                        }
                                                      </td>
                                                      <td></td>
                                                      <td></td>
                                                    </tr>
                                                  </>
                                                ) : marketSummaryDataIndex ==
                                                  6 ? (
                                                  <>
                                                    <tr>
                                                      <td>
                                                        {
                                                          marketSummaryData.columnName
                                                        }
                                                      </td>
                                                      <td>
                                                        {
                                                          marketSummaryData.successfulBiddersCount
                                                        }
                                                      </td>
                                                      <td></td>
                                                      <td></td>
                                                    </tr>
                                                  </>
                                                ) : (
                                                  <>
                                                    <tr>
                                                      <td>
                                                        {
                                                          marketSummaryData.columnName
                                                        }
                                                      </td>
                                                      <td>
                                                        {
                                                          marketSummaryData.noOfLots
                                                        }
                                                      </td>
                                                      <td>
                                                        {
                                                          marketSummaryData.noOfPackages
                                                        }
                                                      </td>
                                                      <td>
                                                        {
                                                          marketSummaryData.totalKgs
                                                        }
                                                      </td>
                                                    </tr>
                                                  </>
                                                )}
                                              </>
                                            )
                                          )}
                                      </>
                                    ) : (
                                      "No data available"
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`LiveAuctionMenu ${
                      activeTab === 3 ? "active " : ""
                    } ${activeClass && "ShowSideBar"}`}
                  >
                    {activeTab === 3 && (
                      <div className="Summery">
                        <span
                          class="Close"
                          onClick={() => {
                            handlePlannerModal(false);
                          }}
                        >
                          x
                        </span>
                        <div className="row">
                          {/* My Planner Data */}
                          <div className="col-lg-12">
                            <div className="Shadow">
                              <div className="Title">My Planner</div>
                              <div className="TableBox">
                                <Table striped bordered hover>
                                  <thead>
                                    <tr>
                                      <th>Group Code</th>
                                      <th>Planned(Pkgs)</th>
                                      <th>Planned(Kgs)</th>
                                      <th>Average Price</th>
                                      <th>Planned Amount(Rs)</th>
                                      <th>Balance Qty(Pkgs)</th>
                                      <th>Balance Qty(Kgs)</th>
                                      <th>Balance Amount(Rs)</th>
                                      <th>Knockdown(Pkgs)</th>
                                      <th>Knockdown(Kgs)</th>
                                      <th>Knockdown(Avg)</th>
                                      <th>Knockdown Amount(Rs)</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {getMyPlannerDataResponse != null ? (
                                      <>
                                        {getMyPlannerDataResponse &&
                                          getMyPlannerDataResponse.map(
                                            (plannerData) => (
                                              <tr>
                                                <td>{plannerData.groupCode}</td>
                                                <td>
                                                  {plannerData.plannedPackages}
                                                </td>
                                                <td>
                                                  {plannerData.plannedKgs}
                                                </td>
                                                <td>
                                                  {plannerData.averagePrice}
                                                </td>
                                                <td>
                                                  {plannerData.plannedAmount}
                                                </td>
                                                <td>
                                                  {plannerData.balancePackages}
                                                </td>
                                                <td>
                                                  {plannerData.balanceKgs}
                                                </td>
                                                <td>
                                                  {plannerData.balanceAmount}
                                                </td>
                                                <td>
                                                  {
                                                    plannerData.knockDownPackages
                                                  }
                                                </td>
                                                <td>
                                                  {plannerData.knockDownKgs}
                                                </td>
                                                <td>
                                                  {
                                                    plannerData.knockDownAverageprice
                                                  }
                                                </td>
                                                <td>
                                                  {plannerData.knockDownAmount}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                      </>
                                    ) : (
                                      "No data available"
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {"BUYER" == atob(sessionStorage.getItem("argument6")) ||
                  "AUCTIONEER" == atob(sessionStorage.getItem("argument6")) ? (
                    <div
                      className={`LiveAuctionMenu ${
                        activeTab === 4 ? "active " : ""
                      } ${activeClass && "ShowSideBar"}`}
                    >
                      {activeTab === 4 && (
                        <div className="Summery">
                          <span
                            class="Close"
                            onClick={() => {
                              handleMyCatalogModal(false);
                            }}
                          >
                            x
                          </span>
                          <div className="row">
                            {/* My Catalog Data */}
                            <div className="col-lg-12">
                              <div className="Shadow">
                                <div className="Title">My Catalog</div>
                                <div className="TableBox">
                                  {/* <Table striped bordered hover>
                                  {console.log("rows 1845", rows)}
                                  <thead>
                                    <tr>
                                      <th>Group Code</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {getMyPlannerDataResponse != null ? (
                                      <>
                                        {getMyPlannerDataResponse &&
                                          getMyPlannerDataResponse.map(
                                            (plannerData) => (
                                              <tr>
                                                <td>{plannerData.groupCode}</td>
                                              </tr>
                                            )
                                          )}
                                      </>
                                    ) : (
                                      "No data available"
                                    )}
                                  </tbody>
                                </Table> */}

                                  <TableComponent
                                    columns={selectedColumns}
                                    // updatedData={updatedData}
                                    // setColumns={setColumns}
                                    rows={rows}
                                    setRows={setRows}
                                    // leftColumns={leftColumns}
                                    // rightColumns={rightColumns}
                                    // tableColumnExtensions={tableColumnExtensions}
                                    // custmize={custmizeColumn}
                                    // fixedColumns={fixedColumns}
                                    // setFixedColumns={setFixedColumns}
                                    // selectedColumns={selectedColumns}
                                    // setSelectedColumns={setSelectedColumns}
                                    // dragdrop={true}
                                    // fixedColumnsOn={true}
                                    // resizeingCol={true}
                                    // sorting={false}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Auction;
