import * as actionTypes from "../../actionLabels/index";

export const fetchAuctionSearchBidBookData = (data) => {
  return {
    type: actionTypes.FETCH_AUCTION_SEARCH_BID_BOOK_DATA,
    payload: data,
  };
};

export const fetchAuctionSearchBidBookDataSuccess = (data) => {
  return {
    type: actionTypes.FETCH_AUCTION_SEARCH_BID_BOOK_DATA_SUCCESS,
    payload: data,
  };
};

export const fetchAuctionSearchBidBookDataFailure = (error) => {
  return {
    type: actionTypes.FETCH_AUCTION_SEARCH_BID_BOOK_DATA_FAILURE,
    payload: error,
  };
};
