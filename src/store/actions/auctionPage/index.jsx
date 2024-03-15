import * as actionTypes from "../../actionLabels/index";

export const fetchAuctionCenterData = (data) => {
  return {
    type: actionTypes.FETCH_AUCTION_CENTER_DATA,
    payload: data,
  };
};

export const fetchAuctionCenterDataSuccess = (data) => {
  return {
    type: actionTypes.FETCH_AUCTION_CENTER_DATA_SUCCESS,
    payload: data,
  };
};

export const fetchAuctionCenterDataFailure = (error) => {
  return {
    type: actionTypes.FETCH_AUCTION_CENTER_DATA_FAILURE,
    payload: error,
  };
};

export const fetchAuctionCenterHeaderData = (data) => {
  return {
    type: actionTypes.FETCH_AUCTION_CENTER_HEADER_DATA,
    payload: data,
  };
};

export const fetchAuctionCenterHeaderDataSuccess = (data) => {
  return {
    type: actionTypes.FETCH_AUCTION_CENTER_HEADER_DATA_SUCCESS,
    payload: data,
  };
};

export const fetchAuctionCenterHeaderDataFailure = (error) => {
  return {
    type: actionTypes.FETCH_AUCTION_CENTER_HEADER_DATA_FAILURE,
    payload: error,
  };
};

export const bidderConfirm = (data) => {
  return {
    type: actionTypes.BIDDER_CONFIRM,
    payload: data,
  };
};

export const bidderConfirmSuccess = (data) => {
  return {
    type: actionTypes.BIDDER_CONFIRM_SUCCESS,
    payload: data,
  };
};

export const bidderConfirmFailure = (error) => {
  return {
    type: actionTypes.BIDDER_CONFIRM_FAILURE,
    payload: error,
  };
};

export const bidderIn = (data) => {
  return {
    type: actionTypes.BIDDER_IN,
    payload: data,
  };
};

export const bidderInSuccess = (data) => {
  return {
    type: actionTypes.BIDDER_IN_SUCCESS,
    payload: data,
  };
};

export const bidderInFailure = (error) => {
  return {
    type: actionTypes.BIDDER_IN_FAILURE,
    payload: error,
  };
};

export const bidderOut = (data) => {
  return {
    type: actionTypes.BIDDER_OUT,
    payload: data,
  };
};

export const bidderOutSuccess = (data) => {
  return {
    type: actionTypes.BIDDER_OUT_SUCCESS,
    payload: data,
  };
};

export const bidderOutFailure = (error) => {
  return {
    type: actionTypes.BIDDER_OUT_FAILURE,
    payload: error,
  };
};

export const fetchAuctionCenterDataApiCall = (data) => {
  return {
    type: actionTypes.FETCH_AUCTION_CENTER_DATA_API_CALL,
    payload: data,
  };
};

export const catelogFetchAllData = (data) => {
  return {
    type: actionTypes.CATELOG_FETCH_ALL_DATA,
    payload: data,
  };
};

export const catelogFetchAllDataSuccess = (data) => {
  return {
    type: actionTypes.CATELOG_FETCH_ALL_DATA_SUCCESS,
    payload: data,
  };
};

export const catelogFetchAllDataFailure = (error) => {
  return {
    type: actionTypes.CATELOG_FETCH_ALL_DATA_FAILURE,
    payload: error,
  };
};

export const catelogSubmitData = (data) => {
  return {
    type: actionTypes.CATELOG_SUBMIT_DATA,
    payload: data,
  };
};

export const catelogSubmitDataSuccess = (data) => {
  return {
    type: actionTypes.CATELOG_SUBMIT_DATA_SUCCESS,
    payload: data,
  };
};

export const catelogSubmitDataFailure = (error) => {
  return {
    type: actionTypes.CATELOG_SUBMIT_DATA_FAILURE,
    payload: error,
  };
};

export const getSummaryOfTeaSoldData = (data) => {
  return {
    type: actionTypes.GET_SUMMARY_OF_TEA_SOLD_DATA,
    payload: data,
  };
};

export const getSummaryOfTeaSoldDataSuccess = (data) => {
  return {
    type: actionTypes.GET_SUMMARY_OF_TEA_SOLD_DATA_SUCCESS,
    payload: data,
  };
};

export const getSummaryOfTeaSoldDataFailure = (error) => {
  return {
    type: actionTypes.GET_SUMMARY_OF_TEA_SOLD_DATA_FAILURE,
    payload: error,
  };
};

export const getAuctioneerMarketSummaryData = (data) => {
  return {
    type: actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_DATA,
    payload: data,
  };
};

export const getAuctioneerMarketSummaryDataSuccess = (data) => {
  return {
    type: actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_DATA_SUCCESS,
    payload: data,
  };
};

export const getAuctioneerMarketSummaryDataFailure = (error) => {
  return {
    type: actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_DATA_FAILURE,
    payload: error,
  };
};

export const getAuctioneerMarketSummaryWiseData = (data) => {
  return {
    type: actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_WISE_DATA,
    payload: data,
  };
};

export const getAuctioneerMarketSummaryWiseDataSuccess = (data) => {
  return {
    type: actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_WISE_DATA_SUCCESS,
    payload: data,
  };
};

export const getAuctioneerMarketSummaryWiseDataFailure = (error) => {
  return {
    type: actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_WISE_DATA_FAILURE,
    payload: error,
  };
};

export const getMarketSummaryData = (data) => {
  return {
    type: actionTypes.GET_MARKET_SUMMARY_DATA,
    payload: data,
  };
};

export const getMarketSummaryDataSuccess = (data) => {
  return {
    type: actionTypes.GET_MARKET_SUMMARY_DATA_SUCCESS,
    payload: data,
  };
};

export const getMarketSummaryDataFailure = (error) => {
  return {
    type: actionTypes.GET_MARKET_SUMMARY_DATA_FAILURE,
    payload: error,
  };
};

export const getMyPlannerData = (data) => {
  return {
    type: actionTypes.GET_MY_PLANNER_DATA,
    payload: data,
  };
};

export const getMyPlannerDataSuccess = (data) => {
  return {
    type: actionTypes.GET_MY_PLANNER_DATA_SUCCESS,
    payload: data,
  };
};

export const getMyPlannerDataFailure = (error) => {
  return {
    type: actionTypes.GET_MY_PLANNER_DATA_FAILURE,
    payload: error,
  };
};
