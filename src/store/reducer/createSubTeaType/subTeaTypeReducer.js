import * as actionTypes from "../../actionLabels/index";

const initialState = {
  allSubTeaTypes: [],
  subTeaType: [],
  searchResults: [],
  error: null,
  uploadedDocuments: [],
  createEditSubTeaTypeApiStatus: false,
};

const subTeaTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    // Get all sub tea types
    case actionTypes.GET_ALL_SUB_TEA_TYPES_SUCCESS:
      return {
        ...state,
        allSubTeaTypes: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_SUB_TEA_TYPES_FAIL:
      return {
        ...state,
        allSubTeaTypes: [],
        error: action.payload,
      };
    // Create sub tea type
    case actionTypes.CREATE_SUB_TEA_TYPE_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case actionTypes.CREATE_SUB_TEA_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    // Update sub tea type
    case actionTypes.UPDATE_SUB_TEA_TYPE_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case actionTypes.UPDATE_SUB_TEA_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    // Search sub tea types
    case actionTypes.SEARCH_SUB_TEA_TYPE_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };
    case actionTypes.SEARCH_SUB_TEA_TYPE_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    // Get sub tea type by ID
    case actionTypes.GET_SUB_TEA_TYPE_BY_ID_SUCCESS:
      return {
        ...state,
        subTeaType: action.payload,
        error: null,
      };
    case actionTypes.GET_SUB_TEA_TYPE_BY_ID_FAIL:
      return {
        ...state,
        subTeaType: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_SUB_TEA_TYPE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_SUB_TEA_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_SUB_TEA_TYPE_API_STATUS:
      return {
        ...state,
        createEditSubTeaTypeApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default subTeaTypeReducer;
