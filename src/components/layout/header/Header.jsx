import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ICON } from "../../../assets/images";
import { Button, Card, Dropdown, Modal } from "react-bootstrap";
import {
  toggleAction,
  toggleActionSuccess,
  userWiseAuctionCenterDetails,
  getServerDateAndTimeAction,
  getServerDateAndTimeSuccess,
  fetchTokenRequest,
} from "../../../store/actions";
import { useNavigate, useLocation } from "react-router-dom";
import ChangePwd from "../../../pages/ChangePwd/ChangePwd";
import CustomToast from "../../Toast";
import { AiOutlineClose } from "react-icons/ai";
let serverDateAndTimeValue = new Date();
let count = 1;

const TokenUpdateModal = ({ show, onClose, onConfirm }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header >
        <Modal.Title>Update Token</Modal.Title>
        <i
              className="fa fa-times CloseModal"
              onClick={() => onClose()}
            ></i>
      </Modal.Header>
    
      <p  className="BtnGroup pt-3 pl-3">Your token will expire in 5 Minutes. Please update your token?</p>
      <div className="BtnGroup pb-3 pl-3">
     
        <button class="SubmitBtn mt-0" onClick={onClose}>
          No
        </button>
        <button class="SubmitBtn mt-0" onClick={onConfirm}>
          Yes
        </button>
      </div>
    </Modal>
  );
};
const HeaderUI = () => {
  const activeClass = useSelector((state) => state.toggle.activeClass);
  const updatedRefreshCdes = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [time, setTime] = useState(serverDateAndTimeValue);
  const [showModal, setShowModal] = useState(false);
  const [modalNames, setModalNames] = useState(false);
  const navigate = useNavigate();
  const [auctionCenterValue, setAuctionCenterValue] = useState("");
  const [showModal1, setShowModal1] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "numeric",
  };
  const handleButtonClick = () => {
    setModalNames(true);
  };
  let indianTime = time.toLocaleString("en-IN", options);

  const auctionCenterDropDownAllData = useSelector(
    (state) => state?.auctionCenter?.userWiseAuctionCenterDetails?.responseData
  );

  const auctionCenterDropDownMappedData =
    auctionCenterDropDownAllData &&
    auctionCenterDropDownAllData.filter((data) => 1 == data.mapped);

  useEffect(() => {
    dispatch(getServerDateAndTimeAction());
  }, []);

  useEffect(() => {
    let payloadData = {
      userId: atob(sessionStorage.getItem("argument2")),
    };

    if (
      auctionCenterDropDownMappedData == undefined &&
      "/dashboard" != currentPath
    ) {
      dispatch(userWiseAuctionCenterDetails(payloadData));
    }

    let tempData =
      window.location.pathname &&
      window.location.pathname.split("/") &&
      window.location.pathname.split("/")[4];
    let auctionCenterId = tempData && atob(tempData);
    setAuctionCenterValue(auctionCenterId);
  });

  const serverDateAndTime = useSelector(
    (state) => state?.auctionCenter?.serverDateAndTime?.responseData
  );

  useEffect(() => {
    if (serverDateAndTime != null || serverDateAndTime != undefined) {
      let serverDateAndTimeTemp = new Date(serverDateAndTime);

      let date = new Date();
      date.setDate(serverDateAndTimeTemp.getDate());
      date.setHours(serverDateAndTimeTemp.getHours());
      date.setMinutes(serverDateAndTimeTemp.getMinutes());
      date.setSeconds(serverDateAndTimeTemp.getSeconds());

      serverDateAndTimeValue = date;
      setTime(date);
      indianTime = date?.toLocaleString("en-IN", options);

      dispatch(getServerDateAndTimeSuccess(null));
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      let tempDate = new Date(serverDateAndTimeValue);
      tempDate.setSeconds(tempDate.getSeconds() + count++);
      setTime(tempDate);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  const handleCloseHistory = () => setModalNames(false);
  // const formatTime = (time) => {
  //   const options = { hour: "numeric", minute: "numeric", second: "numeric" };
  //   const formattedTime = time.toLocaleTimeString("en-IN", options);
  //   return formattedTime;
  // };

  const handleClick = () => {
    dispatch(toggleActionSuccess());
  };

  const dropDownOnChange = (event) => {
    let tempData = event.target.options[event.target.selectedIndex].id;
    let auctionCenterId = event.target.value;
    let auctionDetailId =
      tempData && tempData.split(",") && tempData.split(",")[0];
    let auctionCenterUserId =
      tempData && tempData.split(",") && tempData.split(",")[1];
    let auctionTypeMasterId =
      tempData && tempData.split(",") && tempData.split(",")[2];

    let url = `/auctionPage/${btoa(auctionDetailId)}/${btoa(
      auctionCenterUserId
    )}/${btoa(auctionCenterId)}/${btoa(auctionTypeMasterId)}`;
    //navigate(url);
    window.open(url);
    setAuctionCenterValue(auctionCenterId);
    window.location.reload();
  };

  const handleLogout = () => {
    // Display the modal
    setShowModal(true);
  };

  const handleConfirmation = (confirmed) => {
    // If user confirms, proceed with logout
    if (confirmed) {
      sessionStorage.removeItem("argument1");
      sessionStorage.removeItem("argument2");
      sessionStorage.removeItem("argument3");
      sessionStorage.removeItem("argument4");
      sessionStorage.removeItem("argument5");
      sessionStorage.removeItem("argument6");
      sessionStorage.removeItem("argument7");
      sessionStorage.removeItem("argument12");

      // Perform logout action
      navigate("/login");
    }

    // Close the modal
    setShowModal(false);
  };

  useEffect(() => {
    const checkAndUpdateToken = () => {
      const argument11 = sessionStorage.getItem("argument12");
      if (argument11) {
        const timeExpired = atob(argument11);
        const argument11Time = timeExpired.split("T")[1]; // Extracting the time part
        const [hours, minutes, seconds] = argument11Time.split(":"); // Splitting hours, minutes, and seconds
        console.log(argument11Time,argument11,timeExpired, "argument11Time");

        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const currentSeconds = currentTime.getSeconds();

        // Calculate the total seconds remaining until argument11Time
        const totalSecondsRemaining =
          (hours - currentHours) * 3600 + // Convert hours to seconds
          (minutes - currentMinutes) * 60 + // Convert minutes to seconds
          (seconds - currentSeconds);

        // If there is exactly 300 seconds remaining, show the modal
        if (totalSecondsRemaining === 300) {
          setShowModal1(true);
        }

        // If current time surpasses argument11Time, clear session storage
        if (currentTime > new Date(timeExpired)) {
          CustomToast.error("Token is Expired.");
          setTimeout(() => {
            sessionStorage.clear();
            navigate("/login");
          }, 500); 
        }
      }
    };

    const tokenCheckInterval = setInterval(() => {
      checkAndUpdateToken();
    }, 1000);

    // Clear the interval when the component unmounts or when the effect re-runs
    return () => clearInterval(tokenCheckInterval);
  }, []); // Dependency array is empty, so this effect runs only once after the initial render

  const handleUpdateToken = () => {
    const userCode = sessionStorage.getItem("argument4");
    dispatch(fetchTokenRequest(atob(userCode)));

    setShowModal1(false);
  };
  useEffect(() => {
    if (
      updatedRefreshCdes &&
      updatedRefreshCdes.data &&
      updatedRefreshCdes.data.length !== 0
    ) {
      console.log(updatedRefreshCdes, "updatedRefreshCdes");

      const newToken = updatedRefreshCdes.data.token;
      const newTokenExpirationOn = updatedRefreshCdes.data.tokenExpirationOn;
      if (newToken || newTokenExpirationOn) {
        const newExpData = newTokenExpirationOn;
        const newExpData1 = newToken
        console.log(
          newToken,
          newTokenExpirationOn,
          newToken || newTokenExpirationOn,
          "argument11Time"
        );

        sessionStorage.setItem("argument1", btoa(newExpData1));
        sessionStorage.setItem("argument12", btoa(newExpData));
      }
    }
  }, [updatedRefreshCdes.data]);

  // const handleUpdateToken = async () => {
  //   const userCode = sessionStorage.getItem("argument4");

  //   try {
  //     const updatedRefreshCdes = await dispatch(fetchTokenRequest(atob(userCode)));

  //     // Assuming `updatedRefreshCdes.data.token` and `updatedRefreshCdes.data.tokenExpirationOn` exist
  //     const newToken = updatedRefreshCdes.data.token;
  //     const newTokenExpirationOn = updatedRefreshCdes.data.tokenExpirationOn;

  //     // Update sessionStorage with new values
  //     sessionStorage.setItem("argument1", newToken);
  //     sessionStorage.setItem("argument11", newTokenExpirationOn);

  //     // Close the modal
  //     setShowModal1(false);
  //   } catch (error) {
  //     console.error("Error updating token:", error);
  //     // Handle errors if necessary
  //   }
  // };

  const handleCloseModal = () => {
    setShowModal1(false);
  };
  return (
    <>
      <header className={activeClass ? "active" : ""}>
        <nav className="navbar navbar-expand-lg">
          {sessionStorage.getItem("isLogged") === "1" ? (
            ""
          ) : (
            <>
              {"/dashboard" != currentPath ? (
                <span onClick={handleClick} className="SidebarToggle">
                  <i className={activeClass ? "fa fa-times" : "fa fa-bars"}></i>
                </span>
              ) : (
                ""
              )}
            </>
          )}
          <div className="container-fluid">
            <div className="row justify-content-between w-100 align-items-center">
              <div className="col-xl-auto">
                <div className="LogoTitle mx-3">
                  <a className="navbar-brand" href="index.html">
                    <img src={ICON} className="img-fluid Logo" alt="Logo" />
                  </a>
                  <h2>Teaboard Auction</h2>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="row justify-content-end align-items-center">
                  {"/dashboard" != currentPath ? (
                    <div className="col-auto">
                      <div className="FormGroup Auction-center-list">
                        <select
                          className="form-control select-form mb-0"
                          value={auctionCenterValue}
                          onChange={(e) => dropDownOnChange(e)}
                        >
                          {auctionCenterDropDownMappedData?.map((state) => (
                            <option
                              id={
                                state.liveSessionDetail != null &&
                                state.liveSessionDetail != undefined &&
                                state.liveSessionDetail.length > 0
                                  ? state.liveSessionDetail[0].auctionDetailId +
                                    "," +
                                    state.auctionCenterUserId +
                                    "," +
                                    state.auctionTypeMasterId
                                  : 0 +
                                    "," +
                                    state.auctionCenterUserId +
                                    "," +
                                    state.auctionTypeMasterId
                              }
                              value={state.auctionCenterId}
                            >
                              {state.auctionCenterName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="col-auto">
                    <span className="Timer">
                      <i className="fa fa-clock" aria-hidden="true"></i>
                      {indianTime}
                    </span>
                  </div>

                  {/* <span>
              <b>Season :</b> 2023
            </span>{" "}
            <span className="divider"></span>{" "}
            <span>
              <b>Sale No :</b> 25
            </span>{" "}
            <span className="divider"></span>{" "}
            <span>
              <b>Auction Date :</b> 03-07-2023
            </span>{" "}
            <span className="divider"></span>
            */}
                  {/* <div className="col-auto">
                    <span className="UserName">
                      <b> Welcome </b> &nbsp;
                      {atob(sessionStorage.getItem("argument5"))}{" "}
                      {atob(sessionStorage.getItem("argument6"))}
                    </span>{" "}
                  </div> */}
                  {/* <div className="col-auto">
                    <button className="UserName" onClick={handleButtonClick}>
                      Change Password
                    </button>
                  </div> */}

                  {/* <div className="col-auto">
                    <button
                      className="LogoutBtn"
                      onClick={handleLogout}
                      // onClick={() => {
                      //   sessionStorage.removeItem("argument1");
                      //   sessionStorage.removeItem("argument2");
                      //   sessionStorage.removeItem("argument3");
                      //   sessionStorage.removeItem("argument4");
                      //   sessionStorage.removeItem("argument5");
                      //   sessionStorage.removeItem("argument6");
                      //   sessionStorage.removeItem("argument7");

                      //   navigate("/login");
                      // }}
                    >
                      Sign Out
                    </button>
                  </div> */}
                  <div className="col-auto">
                    <Dropdown>
                      <Dropdown.Toggle className="DropDownBox">
                        <>
                          <span className="UserName">
                            <b> Welcome </b> &nbsp;
                            {atob(sessionStorage.getItem("argument5"))}{" "}
                            {atob(sessionStorage.getItem("argument6"))}
                          </span>{" "}
                        </>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={handleButtonClick}>
                          <i className="fa fa-key"></i> Change Password
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                          <i className="fa fa-sign-out"></i> Sign Out
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>{" "}
      {modalNames && (
        <Modal show={modalNames} onHide={handleCloseHistory} size="md" centered>
          <Modal.Header>
            <Modal.Title>Change Password</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={handleCloseHistory}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <ChangePwd />
          </Modal.Body>
        </Modal>
      )}
      {showModal && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="md"
          centered
        >
          <Modal.Header>
            <Modal.Title>Sign Out</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={() => setShowModal(false)}
            ></i>
          </Modal.Header>
          <Modal.Body className="text-center">
            <h5>Are you sure you want to sign out?</h5>
            <div className="BtnGroup justify-content-center">
              <button
                type="button"
                className="SubmitBtn signOut"
                size="lg"
                onClick={() => handleConfirmation(true)}
              >
                YES
              </button>
              &nbsp;&nbsp;
              <button
                type="button"
                className="SubmitBtn signOut"
                size="lg"
                onClick={() => handleConfirmation(false)}
              >
                NO
              </button>
            </div>
          </Modal.Body>
        </Modal>
      )}
      <TokenUpdateModal
        show={showModal1}
        onClose={handleCloseModal}
        onConfirm={handleUpdateToken}
      />
    </>
  );
};

export default HeaderUI;
