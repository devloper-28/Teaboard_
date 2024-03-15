import * as actionTypes from "../../actionLabels/index";
// auction prompt data

export const getPromptDateByAuctionCenterRequest = (data) => {
  return {
    type: actionTypes.GET_PROMPT_DATE_BY_AUCTION_CENTER_REQUEST,
    payload: data,
  };
};

export const getPromptDateByAuctionCenterSuccess = (data) => {
  return {
    type: actionTypes.GET_PROMPT_DATE_BY_AUCTION_CENTER_SUCCESS,
    payload: data,
  };
};

export const getPromptDateByAuctionCenterFailure = (error) => {
  return {
    type: actionTypes.GET_PROMPT_DATE_BY_AUCTION_CENTER_FAILURE,
    payload: error,
  };
};

export const fetchPromptDatesByAuctionCenterRequest = (auctionCenterId, saleDate) => ({
  type: actionTypes.FETCH_PROMPT_DATES_BY_AUCTION_CENTER_REQUEST,
  payload: { auctionCenterId, saleDate },
});

export const fetchPromptDatesByAuctionCenterSuccess = (promptDates) => ({
  type: actionTypes.FETCH_PROMPT_DATES_BY_AUCTION_CENTER_SUCCESS,
  payload: promptDates,
});

export const fetchPromptDatesByAuctionCenterFailure = (error) => ({
  type: actionTypes.FETCH_PROMPT_DATES_BY_AUCTION_CENTER_FAILURE,
  payload: error,
});



export const fetchAuctionCenter = () => {
  return {
    type: actionTypes.FETCH_AUCTION_CENTER,
  };
};

export const fetchAuctionCenterSuccess = (auctionCenter) => {
  return {
    type: actionTypes.FETCH_AUCTION_CENTER_SUCCESS,
    payload: auctionCenter,
  };
};

export const fetchAuctionCenterFail = (error) => {
  return {
    type: actionTypes.FETCH_AUCTION_CENTER_FAIL,
    payload: error,
  };
};