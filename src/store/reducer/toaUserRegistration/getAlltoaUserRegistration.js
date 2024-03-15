import * as actionTypes from "../../actionLabels/index";

const initialstate = {
  getAllTaoUserActionSuccess: [],
  getAllTaoUserWithStatus: [],
  createdUser: null,
  updatedUser: null,
  searchResults: [],
  UserData: [],
  createEditApiTaoUser: false,
  error: null,
};

const getAllTaoUserReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_TAO_USER_SUCCESS:
      return {
        ...state,
        getAllTaoUserActionSuccess: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_TAO_USER_FAIL:
      return {
        ...state,
        getAllTaoUserActionSuccess: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_TAO_USER_WITH_STATUS_SUCCESS:
      return {
        ...state,
        getAllTaoUserWithStatus: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_TAO_USER_WITH_STATUS_FAIL:
      return {
        ...state,
        getAllTaoUserWithStatus: [],
        error: action.payload,
      };

    case actionTypes.CREATE_TAO_USER_SUCCESS:
      return {
        ...state,
        createdUser: action.payload,
        error: null,
      };

    case actionTypes.CREATE_TAO_USER_FAIL:
      return {
        ...state,
        createdUser: null,
        error: action.payload,
      };

    case actionTypes.UPDATE_TAO_USER_SUCCESS:
      return {
        ...state,
        updatedUser: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_TAO_USER_FAIL:
      return {
        ...state,
        updatedUser: null,
        error: action.payload,
      };

    case actionTypes.SEARCH_TAO_USER_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_TAO_USER_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_TAO_USER_BY_ID_SUCCESS:
      return {
        ...state,
        UserData: action.payload,
        error: null,
      };
    case actionTypes.GET_TAO_USER_BY_ID_FAIL:
      return {
        ...state,
        UserData: null,
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_TAO_USER_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_TAO_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_API_TAO_USERRGG:
      return {
        ...state,
        createEditApiTaoUser: action.payload.data,
      };

    default:
      return state;
  }
};

export default getAllTaoUserReducer;
