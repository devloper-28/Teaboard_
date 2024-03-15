import * as actionTypes from "../../actionLabels/index";

const initialState = {
  allFactoryTypes: [],
  allFactoryAscTypes: [],
  factoryType: [],
  searchResults: [],
  error: null,
  uploadedDocuments: [],
  createEditFactoryTypeApiStatus: false,
};

const factoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_FACTORY_TYPES_SUCCESS:
      return {
        ...state,
        allFactoryTypes: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_FACTORY_TYPES_FAIL:
      return {
        ...state,
        allFactoryTypes: [],
        error: action.payload,
      };
    case actionTypes.GET_ALL_FACTORY_TYPES_SUCCESS_ASC:
      return {
        ...state,
        allFactoryAscTypes: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_FACTORY_TYPES_FAIL_ASC:
      return {
        ...state,
        allFactoryAscTypes: [],
        error: action.payload,
      };
    case actionTypes.CREATE_FACTORY_TYPE_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case actionTypes.CREATE_FACTORY_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.UPDATE_FACTORY_TYPE_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case actionTypes.UPDATE_FACTORY_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.SEARCH_FACTORY_TYPE_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };
    case actionTypes.SEARCH_FACTORY_TYPE_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_FACTORY_TYPE_BY_ID_SUCCESS:
      return {
        ...state,
        factoryType: action.payload,
        error: null,
      };
    case actionTypes.GET_FACTORY_TYPE_BY_ID_FAIL:
      return {
        ...state,
        factoryType: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_FACTORY_TYPE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_FACTORY_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_FACTORY_TYPE_API_STATUS:
      return {
        ...state,
        createEditFactoryTypeApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default factoryReducer;
