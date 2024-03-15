import * as actionTypes from "../../actionLabels/index";

const initialstate = {
  getAllUserActionSuccess: [],
  getAllUserWithStatus: [],
  createdUser: null,
  updatedUser: null,
  searchResults: [],
  UserData: [],
  createEditApiUserRgg: false,
  error: null,
};

const getAllUserReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_USER_SUCCESS:
      return {
        ...state,
        getAllUserActionSuccess: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_USER_FAIL:
      return {
        ...state,
        getAllUserActionSuccess: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_USER_WITH_STATUS_SUCCESS:
      return {
        ...state,
        getAllUserWithStatus: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_USER_WITH_STATUS_FAIL:
      return {
        ...state,
        getAllUserWithStatus: [],
        error: action.payload,
      };

    case actionTypes.CREATE_USER_SUCCESS:
      return {
        ...state,
        createdUser: action.payload,
        error: null,
      };

    case actionTypes.CREATE_USER_FAIL:
      return {
        ...state,
        createdUser: null,
        error: action.payload,
      };

    case actionTypes.UPDATE_USER_SUCCESS:
      return {
        ...state,
        updatedUser: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_USER_FAIL:
      return {
        ...state,
        updatedUser: null,
        error: action.payload,
      };

    case actionTypes.SEARCH_USER_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_USER_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_USER_BY_ID_SUCCESS:
      return {
        ...state,
        UserData: action.payload,
        error: null,
      };
    case actionTypes.GET_USER_BY_ID_FAIL:
      return {
        ...state,
        UserData: null,
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_USER_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_API_USERRGG:
      return {
        ...state,
        createEditApiUserRgg: action.payload.data,
      };

    default:
      return state;
  }
};

export default getAllUserReducer;
