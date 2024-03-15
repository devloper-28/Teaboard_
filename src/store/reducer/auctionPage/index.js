import * as actionTypes from "../../actionLabels/index";

const initialState = {
  errorMessage: "",
  fetchData: [],
  fetchAuctionCenterDataApiCall: false,
  catelogFetchAllData: [],
  getSummaryOfTeaSoldData: [],
  getAuctioneerMarketSummaryData: [],
  getMarketSummaryData: [],
  fetchAuctionCenterHeaderData: null,
  getMyPlannerData: [],
};

const auctionPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_AUCTION_CENTER_DATA_SUCCESS:
      return {
        ...state,
        fetchData: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
        // fetchAuctionCenterDataApiCall: true,
      };

    case actionTypes.FETCH_AUCTION_CENTER_DATA_FAILURE:
      return {
        ...state,
        fetchData: [],
        error: action.payload,
        errorMessage: "Failed to fetch data",
      };

    case actionTypes.FETCH_AUCTION_CENTER_HEADER_DATA_SUCCESS:
      return {
        ...state,
        fetchAuctionCenterHeaderData: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.FETCH_AUCTION_CENTER_HEADER_DATA_FAILURE:
      return {
        ...state,
        fetchAuctionCenterHeaderData: null,
        error: action.payload,
        errorMessage: "Failed to fetch data",
      };

    case actionTypes.BIDDER_CONFIRM_SUCCESS:
      return {
        ...state,
        bidderConfirm: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.BIDDER_CONFIRM_FAILURE:
      return {
        ...state,
        bidderConfirm: "",
        error: action.payload,
        errorMessage: "Failed to confirm",
      };

    case actionTypes.BIDDER_IN_SUCCESS:
      return {
        ...state,
        bidderIn: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.BIDDER_IN_FAILURE:
      return {
        ...state,
        bidderIn: "",
        error: action.payload,
        errorMessage: "Failed to in",
      };

    case actionTypes.BIDDER_OUT_SUCCESS:
      return {
        ...state,
        bidderOut: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.BIDDER_OUT_FAILURE:
      return {
        ...state,
        bidderOut: "",
        error: action.payload,
        errorMessage: "Failed to in",
      };

    case actionTypes.FETCH_AUCTION_CENTER_DATA_API_CALL:
      return {
        ...state,
        fetchAuctionCenterDataApiCall: action.payload,
      };

    case actionTypes.CATELOG_FETCH_ALL_DATA_SUCCESS:
      return {
        ...state,
        catelogFetchAllData: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.CATELOG_FETCH_ALL_DATA_FAILURE:
      return {
        ...state,
        catelogFetchAllData: "",
        error: action.payload,
        errorMessage: "Failed to fetch catelog data",
      };

    case actionTypes.CATELOG_SUBMIT_DATA_SUCCESS:
      return {
        ...state,
        catelogSubmitData: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.CATELOG_SUBMIT_DATA_FAILURE:
      return {
        ...state,
        catelogSubmitData: "",
        error: action.payload,
        errorMessage: "Failed to submit",
      };

    case actionTypes.GET_SUMMARY_OF_TEA_SOLD_DATA_SUCCESS:
      return {
        ...state,
        getSummaryOfTeaSoldData: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.GET_SUMMARY_OF_TEA_SOLD_DATA_FAILURE:
      return {
        ...state,
        getSummaryOfTeaSoldData: [],
        error: action.payload,
        errorMessage: "Failed to submit",
      };

    case actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_DATA_SUCCESS:
      return {
        ...state,
        getAuctioneerMarketSummaryData: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_DATA_FAILURE:
      return {
        ...state,
        getAuctioneerMarketSummaryData: [],
        error: action.payload,
        errorMessage: "Failed to submit",
      };

    case actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_WISE_DATA_SUCCESS:
      return {
        ...state,
        getAuctioneerMarketSummaryWiseData: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_WISE_DATA_FAILURE:
      return {
        ...state,
        getAuctioneerMarketSummaryWiseData: [],
        error: action.payload,
        errorMessage: "Failed to submit",
      };

    case actionTypes.GET_MARKET_SUMMARY_DATA_SUCCESS:
      return {
        ...state,
        getMarketSummaryData: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.GET_MARKET_SUMMARY_DATA_FAILURE:
      return {
        ...state,
        getMarketSummaryData: [],
        error: action.payload,
        errorMessage: "Failed to submit",
      };

    case actionTypes.GET_MY_PLANNER_DATA_SUCCESS:
      return {
        ...state,
        getMyPlannerData: action.payload,
        error: "",
        errorMessage: "", // Reset the errorMessage field on time of success
      };

    case actionTypes.GET_MY_PLANNER_DATA_FAILURE:
      return {
        ...state,
        getMyPlannerData: [],
        error: action.payload,
        errorMessage: "Failed to submit",
      };

    default:
      return state;
  }
};

export default auctionPageReducer;
