import * as actionTypes from "../../actionLabels/index";

const initialState = {
  promptDate: [],
  auctionCenter: [],
  saleNumber: [],
  teaType: [],
  error: null,
  promptDates: null,
  exists: [],
  errorMessage: "", // Add errorMessage field to the state
};

const auctionCenterReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case actionTypes.FETCH_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        auctionCenter: action.payload,
        error: null,
        errorMessage: null, // Reset the errorMessage field
      };
    case actionTypes.FETCH_AUCTION_CENTER_FAIL:
      return {
        ...state,
        auctionCenter: [],
        error: action.payload,
        errorMessage: 'Failed to fetch auction center data.', // Set the errorMessage field
      };
    case actionTypes.GET_SALE_NO_SUCCESS:
      return {
        ...state,
        saleNumber: action.payload,
        error: null,
        errorMessage: null, // Reset the errorMessage field
      };
    case actionTypes.GET_SALE_NO_FAILURE:
      return {
        ...state,
        saleNumber: null,
        error: action.payload,
        errorMessage: 'Failed to fetch sale numbers.', // Set the errorMessage field
      };
    case actionTypes.CHECK_SALE_NO_EXISTENCE_SUCCESS:
      return {
        ...state,
        exists: action.payload.exists,
        error: null,
        errorMessage: null, // Reset the errorMessage field
      };
    case actionTypes.CHECK_SALE_NO_EXISTENCE_FAILURE:
      return {
        ...state,
        exists: null,
        error: action.payload.error,
        errorMessage: 'Failed to check sale number existence.', // Set the errorMessage field
      };
    case actionTypes.GET_PROMPT_DATE_BY_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        promptDate: action.payload,
        error: null,
        errorMessage: null, // Reset the errorMessage field
      };
    case actionTypes.GET_PROMPT_DATE_BY_AUCTION_CENTER_FAILURE:
      return {
        ...state,
        promptDate: null,
        error: action.payload,
        errorMessage: 'Failed to fetch prompt date by auction center.', // Set the errorMessage field
      };
      // set prompt data by sale date
      case actionTypes.FETCH_PROMPT_DATES_BY_AUCTION_CENTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.FETCH_PROMPT_DATES_BY_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        promptDates: action.payload,
        loading: false,
        error: null,
      };
    case actionTypes.FETCH_PROMPT_DATES_BY_AUCTION_CENTER_FAILURE:
      return {
        ...state,
        promptDates: null,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default auctionCenterReducer;
