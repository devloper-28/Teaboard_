import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getAllChargeAsc: [],
  getAllCharge: [],
  createdCharge: null,
  updatedCharge: null,
  searchResults: [],
  ChargeData: [],
  error: null,
  uploadedDocuments: [],
  createEditChargeMasterApiStatus: false,
};

const ChargeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_CHARGE_SUCCESS:
      return {
        ...state,
        getAllCharge: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_CHARGE_FAIL:
      return {
        ...state,
        getAllCharge: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_CHARGE_SUCCESS_ASC:
      return {
        ...state,
        getAllChargeAsc: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_CHARGE_FAIL_ASC:
      return {
        ...state,
        getAllChargeAsc: [],
        error: action.payload,
      };

    case actionTypes.CREATE_CHARGE_SUCCESS:
      return {
        ...state,
        createdCharge: action.payload,
        error: null,
      };

    case actionTypes.CREATE_CHARGE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.UPDATE_CHARGE_SUCCESS:
      return {
        ...state,
        updatedCharge: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_CHARGE_FAIL:
      return {
        ...state,
        updatedCharge: null,
        error: action.payload,
      };

    case actionTypes.SEARCH_CHARGE_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_CHARGE_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_CHARGE_BY_ID_SUCCESS:
      return {
        ...state,
        ChargeData: action.payload,
        error: null,
      };
    case actionTypes.GET_CHARGE_BY_ID_FAIL:
      return {
        ...state,
        ChargeData: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_CHARGE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_CHARGE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_CHARGE_MASTER_API_STATUS:
      return {
        ...state,
        createEditChargeMasterApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default ChargeReducer;
