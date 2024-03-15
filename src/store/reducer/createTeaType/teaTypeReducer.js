import * as actionTypes from "../../actionLabels/index";

const initialState = {
  allTeaTypes: [],
  allTeaTypesAsc: [],
  teaType: [],
  searchResults: [],
  error: null,
  uploadedDocuments: [],
  createEditTeaTypeApiStatus: false,
};

const teaTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_TEA_TYPE_SUCCESS:
      return {
        ...state,
        allTeaTypes: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_TEA_TYPE_FAIL:
      return {
        ...state,
        allTeaTypes: [],
        error: action.payload,
      };
    case actionTypes.GET_ALL_TEA_TYPE_SUCCESS_ASC:
      return {
        ...state,
        allTeaTypesAsc: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_TEA_TYPE_FAIL_ASC:
      return {
        ...state,
        allTeaTypesAsc: [],
        error: action.payload,
      };
    case actionTypes.CREATE_TEA_TYPE_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case actionTypes.CREATE_TEA_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.UPDATE_TEA_TYPE_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case actionTypes.UPDATE_TEA_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.SEARCH_TEA_TYPE_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };
    case actionTypes.SEARCH_TEA_TYPE_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_TEA_TYPE_BY_ID_SUCCESS:
      return {
        ...state,
        teaType: action.payload,
        error: null,
      };
    case actionTypes.GET_TEA_TYPE_BY_ID_FAIL:
      return {
        ...state,
        teaType: null,
        error: action.payload,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_TEA_TYPE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_TEA_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_TEA_TYPE_API_STATUS:
      return {
        ...state,
        createEditTeaTypeApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default teaTypeReducer;
