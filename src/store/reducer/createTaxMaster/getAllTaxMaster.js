import * as actionTypes from "../../actionLabels/index";

const initialstate = {
  getAllTaxMasterActionSuccess: [],
  getAllTaxMasterWithStatus: [],
  createdTaxMaster: null,
  updatedTaxMaster: null,
  searchResults: [],
  TaxMasterData: [],
  error: null,
  createEditTaxMasterApiStatus: false,
};

const getAllTaxMasterReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_TAXMASTER_SUCCESS:
      return {
        ...state,
        getAllTaxMasterActionSuccess: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_TAXMASTER_FAIL:
      return {
        ...state,
        getAllTaxMasterActionSuccess: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_TAXMASTER_WITH_STATUS_SUCCESS:
      return {
        ...state,
        getAllTaxMasterWithStatus: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_TAXMASTER_WITH_STATUS_FAIL:
      return {
        ...state,
        getAllTaxMasterWithStatus: [],
        error: action.payload,
      };

    case actionTypes.CREATE_TAXMASTER_SUCCESS:
      return {
        ...state,
        createdTaxMaster: action.payload,
        error: null,
      };

    case actionTypes.CREATE_TAXMASTER_FAIL:
      {
      }
      return {
        ...state,
        createdTaxMaster: null,
        error: action.payload,
      };

    case actionTypes.UPDATE_TAXMASTER_SUCCESS:
      return {
        ...state,
        updatedTaxMaster: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_TAXMASTER_FAIL:
      return {
        ...state,
        updatedTaxMaster: null,
        error: action.payload,
      };

    case actionTypes.SEARCH_TAXMASTER_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_TAXMASTER_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_TAXMASTER_BY_ID_SUCCESS:
      return {
        ...state,
        TaxMasterData: action.payload,
        error: null,
      };
    case actionTypes.GET_TAXMASTER_BY_ID_FAIL:
      return {
        ...state,
        TaxMasterData: null,
        error: action.payload,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_TAXMASTER_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_TAXMASTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_TAX_MASTER_API_STATUS:
      return {
        ...state,
        createEditTaxMasterApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default getAllTaxMasterReducer;
