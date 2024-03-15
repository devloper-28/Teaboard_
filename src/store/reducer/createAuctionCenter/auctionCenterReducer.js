import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getAllAuctionCenter: [],
  getAllAuctionCenterAsc: [],
  getAllAuctionCenterRegion: [],
  createdAuctionCenter: null,
  updatedAuctionCenter: null,
  searchResults: [],
  auctionCenterById: [],
  error: null,
  uploadedDocuments: [],
  userWiseAuctionCenterDetails: [],
  createEditAuctionCenterApiStatus: false,
  submitUnMappedAuctionCenterDetails: [],
  isSubmitUnMappedAuctionCenterDetailsSuccess: false,
  serverDateAndTime: null,
  auctionCenterType:[],
};

const getAuctionCenterReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        getAllAuctionCenter: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_AUCTION_CENTER_FAIL:
      return {
        ...state,
        getAllAuctionCenter: [],
        error: action.payload,
      };
    case actionTypes.GET_ALL_AUCTION_CENTER_SUCCESS_ASC:
      return {
        ...state,
        getAllAuctionCenterAsc: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_AUCTION_CENTER_FAIL_ASC:
      return {
        ...state,
        getAllAuctionCenterAsc: [],
        error: action.payload,
      };
    case actionTypes.GET_ALL_AUCTION_REGION_CENTER_SUCCESS:
      return {
        ...state,
        getAllAuctionCenterRegion: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_AUCTION_REGION_CENTER_FAIL:
      return {
        ...state,
        getAllAuctionCenterRegion: [],
        error: action.payload,
      };
    case actionTypes.CREATE_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        createdAuctionCenter: action.payload,
        error: null,
      };
    case actionTypes.CREATE_AUCTION_CENTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case actionTypes.CREATE_AUCTION_CENTER_TYPE_SUCCESS:
      return {
        ...state,
        auctionCenterType: action.payload,
        error: null,
      };
    case actionTypes.CREATE_AUCTION_CENTER_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.UPDATE_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        updatedAuctionCenter: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_AUCTION_CENTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.SEARCH_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_AUCTION_CENTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.GET_AUCTION_CENTER_BY_ID_SUCCESS:
      return {
        ...state,
        auctionCenterById: action.payload,
        error: null,
      };

    case actionTypes.GET_AUCTION_CENTER_BY_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_AUCTION_CENTER_API_STATUS:
      return {
        ...state,
        createEditAuctionCenterApiStatus: action.payload.data,
      };

    case actionTypes.USER_WISE_AUCTION_CENTER_DETAILS_SUCCESS:
      return {
        ...state,
        userWiseAuctionCenterDetails: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.USER_WISE_AUCTION_CENTER_DETAILS_FAIL:
      return {
        ...state,
        userWiseAuctionCenterDetails: [],
        error: action.payload,
      };

    case actionTypes.SUBMIT_UNMAPPED_AUCTION_CENTER_DETAILS_SUCCESS:
      return {
        ...state,
        submitUnMappedAuctionCenterDetails: [],
        error: action.payload,
      };

    case actionTypes.SUBMIT_UNMAPPED_AUCTION_CENTER_DETAILS_FAIL:
      return {
        ...state,
        submitUnMappedAuctionCenterDetails: action.payload,
        error: action.payload,
      };

    case actionTypes.IS_SUBMIT_UNMAPPED_AUCTION_CENTER_DETAILS_SUCCESS:
      return {
        ...state,
        isSubmitUnMappedAuctionCenterDetailsSuccess: action.payload,
        error: action.payload,
      };

    case actionTypes.GET_SERVER_DATE_AND_TIME_SUCCESS:
      return {
        ...state,
        serverDateAndTime: action.payload,
      };

    default:
      return state;
  }
};

export default getAuctionCenterReducer;
