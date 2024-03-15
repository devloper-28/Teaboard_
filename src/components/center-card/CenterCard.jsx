import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import TableComponent from "../tableComponent/TableComponent";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  userWiseAuctionCenterDetails,
  submitUnMappedAuctionCenterDetails,
  isSubmitUnMappedAuctionCenterDetailsSuccess,
  fetchUserRightsRequest,
} from "../../store/actions";
import NoData from "../nodata/NoData";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Modal } from "react-bootstrap";
import CustomToast from "../../components/Toast";

const CenterCard = () => {
  const auctionCenter = useSelector(
    (state) => state?.auctionCenter?.userWiseAuctionCenterDetails?.responseData
  );

  const dispatch = useDispatch();

  const activeClass = useSelector((state) => state.toggle.activeClass);

  const navigate = useNavigate();

  const [showmodal, setShowmodal] = useState(false);
  const [tempData, settempData] = useState({
    typeOfGST: "2",
  });

  const handleCloseHistory = () => setShowmodal(false);

  const [columns] = useState([
    { name: "auctioneer", title: "Auctioneer" },
    { name: "sessionPeriod", title: "Session Period" },
    { name: "sessionStatus", title: "Session Status" },
    { name: "sessionType", title: "Session Type" },
  ]);

  const [rows] = useState([]);

  const radioButtonData = [
    {
      key: "PAN GST",
      value: "1",
    },
    {
      key: "Center Wise GST",
      value: "2",
    },
  ];

  //To get socket subscription
  useEffect(() => {
    socketHandler();
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

    // Function to subscribe call on the server
    const subscribeCall = () => {
      stompClient.subscribe(
        `/auctionbid/broadcast/auctionstartnotify`,
        (message) => {
          if (message.body) {
            console.log("body called");
            let payloadData = {
              userId: atob(sessionStorage.getItem("argument2")),
            };
            dispatch(userWiseAuctionCenterDetails(payloadData)); // Dispatch the action to fetch auction center data
          }
        }
      );
    };

    // Connect to the WebSocket server
    stompClient.connect({}, () => {
      console.log("Connected to WebSocket server");
      subscribeCall();
    });
  };

  useEffect(() => {
    if (sessionStorage.getItem("isLogged") == 1) {
      navigate("change-password");
    } else {
      let payloadData = {
        userId: atob(sessionStorage.getItem("argument2")),
      };
      dispatch(userWiseAuctionCenterDetails(payloadData)); // Dispatch the action to fetch auction center data
    }
  }, []);

  const linkOnClick = (
    data,
    auctionCenterId,
    mapped,
    auctionCenterName,
    auctionTypeMasterId,
    panGSTNo
  ) => {
    let auctionDetailId = 0;
    let auctionCenterUserId = 0;
    if (true == mapped) {
      if (data != null && data != undefined && data.length > 0) {
        data &&
          data.map((data, index) => {
            if (
              "Active" == data.sessionStatus ||
              "Warmup" == data.sessionStatus
            ) {
              auctionDetailId = data.auctionDetailId;
              auctionCenterUserId = data.auctionCenterUserId;
            }
          });
      }
      let url = `/auctionPage/${btoa(auctionDetailId)}/${btoa(
        auctionCenterUserId
      )}/${btoa(auctionCenterId)}/${btoa(auctionTypeMasterId)}`;
      // navigate(url);
      window.open(url);
      // window.location.reload();
    } else {
      setShowmodal(true);
      let data = {
        auctionDetailId: auctionDetailId,
        auctionUserId: auctionCenterUserId,
        auctionCenterId: auctionCenterId,
        url: `/auctionPage/${btoa(auctionDetailId)}/${btoa(
          auctionCenterUserId
        )}/${btoa(auctionCenterId)}/${btoa(auctionTypeMasterId)}`,
        gstNo: "",
        typeOfGST: "2",
        panGSTNo: panGSTNo,
      };
      settempData(data);
    }

    sessionStorage.setItem("argument11", btoa(auctionCenterName));
  };

  const submitButtonHandle = () => {
    if (tempData.gstNo == "" || tempData.gstNo == null) {
      CustomToast.error("Please enter GST no.");
      return;
    }

    if (tempData.address == "" || tempData.address == null) {
      CustomToast.error("Please enter address");
      return;
    }

    dispatch(submitUnMappedAuctionCenterDetails(tempData));
  };

  let isSubmitUnMappedAuctionCenterDetailsSuccessResponse = useSelector(
    (state) => state?.auctionCenter?.isSubmitUnMappedAuctionCenterDetailsSuccess
  );

  useEffect(() => {
    if (true == isSubmitUnMappedAuctionCenterDetailsSuccessResponse) {
      dispatch(isSubmitUnMappedAuctionCenterDetailsSuccess(false));
      setShowmodal(false);

      let url = tempData.url;
      settempData({
        typeOfGST: "2",
      });

      let payloadData = {
        userId: atob(sessionStorage.getItem("argument2")),
      };
      dispatch(userWiseAuctionCenterDetails(payloadData));
      window.open(url);
    }
  });

  const handleTypeOfGSTChange = (value) => {
    if (1 == value) {
      settempData({
        ...tempData,
        typeOfGST: value,
        gstNo: tempData.panGSTNo,
        address: "",
      });
    } else {
      settempData({
        ...tempData,
        typeOfGST: value,
        gstNo: "",
        address: "",
      });
    }
  };

  return (
    <>
      <Modal show={showmodal} onHide={handleCloseHistory} size="lg" centered>
        <Modal.Header>
          <Modal.Title>Please enter GST details</Modal.Title>
          <i
            className="fa fa-times CloseModal"
            onClick={handleCloseHistory}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 d-flex CheckboxGroup">
              {radioButtonData &&
                radioButtonData.map((data, index) => (
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name={data.value}
                      id={data.key}
                      value={data.value}
                      checked={tempData?.typeOfGST == data.value ? true : false}
                      onChange={(e) =>
                        tempData ? handleTypeOfGSTChange(e.target.value) : ""
                      }
                    />
                    <label class="form-check-label" for={data.key}>
                      {data.key}
                    </label>
                    &nbsp;&nbsp;
                  </div>
                ))}
            </div>

            <div className="col-md-6">
              <div className="FormGroup">
                <label>GST No.</label>
                <label className="errorLabel"> * </label>
                <input
                  type="text"
                  className="form-control"
                  maxLength="50"
                  value={tempData?.gstNo}
                  onChange={(e) =>
                    tempData
                      ? settempData({
                          ...tempData,
                          gstNo: e.target.value,
                        })
                      : ""
                  }
                  disabled={tempData?.typeOfGST == 1 ? true : false}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="FormGroup">
                <label>Address</label>
                <label className="errorLabel"> * </label>
                <input
                  type="text"
                  className="form-control"
                  maxLength="500"
                  value={tempData?.address}
                  onChange={(e) =>
                    tempData
                      ? settempData({
                          ...tempData,
                          address: e.target.value,
                        })
                      : ""
                  }
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="BtnGroup">
                <button className="SubmitBtn" onClick={submitButtonHandle}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div className={`${activeClass && "active"}  MainComponent `}>
        <div className="TeaboardDashboard">
          <div className="container-fluid">
            <div className="row">
              {auctionCenter &&
                auctionCenter?.map((e) => {
                  return (
                    <div
                      className="col-xl-4 col-lg-6 col-md-6 col-12 py-3 px-2"
                      key={e.auctionCenterId}
                    >
                      <div className="AuctionCenter">
                        <div className="TableTitle">
                          <h6 className="AuctionCenterName">
                            {e.auctionCenterName}
                          </h6>
                          <span>
                            {e.liveSessionDetail != null &&
                            e.liveSessionDetail != undefined &&
                            e.liveSessionDetail.length > 0 ? (
                              <small className="SaleNo">
                                Sale No.:
                                <span className="No">
                                  {e.liveSessionDetail[0].saleNo}
                                </span>
                              </small>
                            ) : (
                              ""
                            )}

                            {e.liveSessionDetail != null &&
                            e.liveSessionDetail != undefined &&
                            e.liveSessionDetail.length > 0 ? (
                              <>
                                <i className="fa-solid fa-calendar-days"></i>
                                {e.liveSessionDetail[0].season}
                              </>
                            ) : (
                              ""
                            )}
                          </span>
                        </div>
                        <div className="TableBox">
                          <TableComponent
                            columns={columns}
                            // rows={rows}
                            // tableColumnExtensions={tableColumnExtensions}
                            rows={
                              e.liveSessionDetail != null &&
                              e.liveSessionDetail != undefined &&
                              e.liveSessionDetail.length > 0
                                ? e.liveSessionDetail
                                : []
                            }
                          />
                        </div>
                        <button
                          onClick={() =>
                            linkOnClick(
                              e.liveSessionDetail,
                              e.auctionCenterId,
                              e.mapped,
                              e.auctionCenterName,
                              e.auctionTypeMasterId,
                              e.gstNo
                            )
                          }
                          target="_blank"
                          className="ClickToEnter"
                        >
                          Click here to enter
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CenterCard;
