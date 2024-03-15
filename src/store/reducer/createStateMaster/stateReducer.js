import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getAllState: [],
  getAllStateAsc: [],
  createdState: null,
  updatedState: null,
  searchResults: [],
  stateData: [],
  error: null,
  uploadedDocuments: [],
  createEditApiStatus: false,
};

const getStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_STATE_SUCCESS:
      return {
        ...state,
        getAllState: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_STATE_FAIL:
      return {
        ...state,
        getAllState: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_STATE_SUCCESS_ASC:
      return {
        ...state,
        getAllStateAsc: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_STATE_FAIL_ASC:
      return {
        ...state,
        getAllStateAsc: [],
        error: action.payload,
      };
    case actionTypes.CREATE_STATE_SUCCESS:
      return {
        ...state,
        createdState: action.payload,
        error: null,
      };

    case actionTypes.CREATE_STATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.UPDATE_STATE_SUCCESS:
      return {
        ...state,
        updatedState: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_STATE_FAIL:
      return {
        ...state,
        updatedState: null,
        error: action.payload,
      };

    case actionTypes.SEARCH_STATE_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_STATE_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_STATE_BY_ID_SUCCESS:
      return {
        ...state,
        stateData: action.payload,
        error: null,
      };
    case actionTypes.GET_STATE_BY_ID_FAIL:
      return {
        ...state,
        stateData: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_STATE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_STATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_API_STATUS:
      return {
        ...state,
        createEditApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default getStateReducer;
