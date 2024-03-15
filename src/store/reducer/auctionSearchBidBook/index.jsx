import * as actionTypes from "../../actionLabels/index";

const initialState = {
  fetchAuctionSearchBidBook: [],
};

const auctionSearchBidBookReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_AUCTION_SEARCH_BID_BOOK_DATA_SUCCESS:
      return {
        ...state,
        fetchAuctionSearchBidBook: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.FETCH_AUCTION_SEARCH_BID_BOOK_DATA_FAILURE:
      return {
        ...state,
        fetchAuctionSearchBidBook: [],
        error: action.payload,
        errorMessage: "Failed to fetch data",
      };
    default:
      return state;
  }
};

export default auctionSearchBidBookReducer;
