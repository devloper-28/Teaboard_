import * as actionTypes from "../../actionLabels/index";

const initialState = {
  allRevenue: [],
  allRevenueAsc: [],
  createdRevenue: null,
  searchedRevenue: [],
  revenueById: [],
  uploadedDocuments: [],
  error: null,
  createEditRevenueApiStatus: false,
};

const revenueReducer = (state = initialState, action) => {
  switch (action.type) {
    // GET ALL REVENUE
    case actionTypes.GET_ALL_REVENUE_SUCCESS:
      return {
        ...state,
        allRevenue: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_REVENUE_FAIL:
      return {
        ...state,
        allRevenue: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_REVENUE_SUCCESS_ASC:
      return {
        ...state,
        allRevenueAsc: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_REVENUE_FAIL_ASC:
      return {
        ...state,
        allRevenueAsc: [],
        error: action.payload,
      };

    // CREATE REVENUE
    case actionTypes.CREATE_REVENUE_SUCCESS:
      return {
        ...state,
        createdRevenue: action.payload,
        error: null,
      };
    case actionTypes.CREATE_REVENUE_FAIL:
      return {
        ...state,
        createdRevenue: null,
        error: action.payload,
      };

    // UPDATE REVENUE
    case actionTypes.UPDATE_REVENUE_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case actionTypes.UPDATE_REVENUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // SEARCH REVENUE
    case actionTypes.SEARCH_REVENUE_SUCCESS:
      return {
        ...state,
        searchedRevenue: action.payload,
        error: null,
      };
    case actionTypes.SEARCH_REVENUE_FAIL:
      return {
        ...state,
        searchedRevenue: [],
        error: action.payload,
      };

    // GET REVENUE BY ID
    case actionTypes.GET_REVENUE_BY_ID_SUCCESS:
      return {
        ...state,
        revenueById: action.payload,
        error: null,
      };
    case actionTypes.GET_REVENUE_BY_ID_FAIL:
      return {
        ...state,
        revenueById: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_REVENUE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_REVENUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_REVENUE_API_STATUS:
      return {
        ...state,
        createEditRevenueApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default revenueReducer;
