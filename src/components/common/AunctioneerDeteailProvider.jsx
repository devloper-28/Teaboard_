import React, { createContext, useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserRightsRequest } from "../../store/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const AuctionDetailContext = createContext();

export function AuctionDetailProvider({ children }) {
  const { type1 } = useParams();
  const [processedData, setProcessedData] = useState(null);
  const dispatch = useDispatch();
  const state = useSelector(
    (state) => state?.auctionCenter?.userWiseAuctionCenterDetails
  );
  console.log(
    state?.responseData
      ?.map((ele) => ele.auctionCenterId)
      ?.indexOf(processedData?.auctionCenterId),
    "statestate"
  );

  useEffect(() => {
    let data = window.location.href
      .split("auctionPage")
      [window.location.href.split("auctionPage").length - 1].split("/");
    data.shift();

    // Only process the data when the user is logged in and on the dashboard page
    if (
      !data.some((ele) => ele == "dashboard" && ele == "change-password") &&
      sessionStorage.getItem("argument2")
    ) {
      let data = window.location.href
        .split("auctionPage")
        [window.location.href.split("auctionPage").length - 1].split("/");
      data.shift();

      // Process the encoded data and set it in state

      // let [auctionDetailId, auctionCenterUserId, auctionCenterId] = data.map(
      //   (ele) => parseInt(atob(ele))
      // );
      let [auctionDetailId, auctionCenterUserId, auctionCenterId] = data.map(
        (ele) => {
          try {
            return parseInt(atob(ele));
          } catch (error) {
            console.error("Error decoding data:", error);
            return null; // or handle the error in another way
          }
        }
      );
      dispatch(
        fetchUserRightsRequest(
          auctionCenterId,
          parseInt(atob(sessionStorage.getItem("argument2")))
        )
      );

      setProcessedData({
        auctionDetailId,
        auctionCenterUserId,
        auctionCenterId,
      });
    }
  }, [type1]);

  const auctionDetailId = processedData?.auctionDetailId;
  const auctionCenterUserId = processedData?.auctionCenterUserId;
  const auctionCenterId = processedData?.auctionCenterId;
  const roleCode = atob(sessionStorage.getItem("argument6"));
  const auction = state?.responseData?.at(state?.responseData
      ?.map((ele) => ele.auctionCenterId)
      ?.indexOf(processedData?.auctionCenterId))?.auctionTypeCode;
  const auctionTypeMasterCode = state?.responseData?.at(state?.responseData
      ?.map((ele) => ele.auctionCenterId)
      ?.indexOf(processedData?.auctionCenterId))?.auctionTypeCode;
  const userCode = atob(sessionStorage.getItem("argument4"));

  console.log(
    processedData,
    atob(sessionStorage.getItem("argument6")),
    "processedDataprocessedData"
  );
  const userId = sessionStorage.getItem("argument2")
    ? parseInt(atob(sessionStorage.getItem("argument2")))
    : "";

  return (
    <AuctionDetailContext.Provider
      value={{
        auctionDetailId,
        auctionCenterUserId,
        auctionCenterId,
        userId,
        auction,
        roleCode,
        auctionTypeMasterCode,
        userCode,
      }}
    >
      {children}
    </AuctionDetailContext.Provider>
  );
}

export function useAuctionDetail() {
  return useContext(AuctionDetailContext);
}
