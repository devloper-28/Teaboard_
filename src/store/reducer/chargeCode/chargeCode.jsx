import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getChargeCode: [],
  getChargeCodeAsc: [],
  error: null,
  createdChargeCode: null,
  chargeCodeData: [],
  uploadedDocuments: [],
  createEditChargeCodeApiStatus: false,
  getChargeCodeWithoutFilter: [],
};

const getAllChargeCodes = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_CHARGE_CODE_SUCCESS:
      return {
        ...state,
        getChargeCode: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_CHARGE_CODE_FAIL:
      return {
        ...state,
        getChargeCode: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_CHARGE_CODE_SUCCESS_ASC:
      return {
        ...state,
        getChargeCodeAsc: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_CHARGE_CODE_FAIL_ASC:
      return {
        ...state,
        getChargeCodeAsc: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_CHARGE_CODE_WITHOUT_FILTER_SUCCESS:
      return {
        ...state,
        getChargeCodeWithoutFilter: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_CHARGE_CODE_WITHOUT_FILTER_FAIL:
      return {
        ...state,
        getChargeCodeWithoutFilter: [],
        error: action.payload,
      };

    case actionTypes.CREATE_CHARGE_CODE_SUCCESS:
      return {
        ...state,
        createdChargeCode: action.payload,
        error: null,
      };

    case actionTypes.CREATE_CHARGE_CODE_FAIL:
      return {
        ...state,
        createdChargeCode: null,
        error: action.payload,
      };
    case actionTypes.UPDATE_CHARGE_CODE_SUCCESS:
      return {
        ...state,
        updatedChargeCode: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_CHARGE_CODE_FAIL:
      return {
        ...state,
        updatedChargeCode: null,
        error: action.payload,
      };
    case actionTypes.GET_CHARGE_CODE_BY_ID_SUCCESS:
      return {
        ...state,
        chargeCodeData: action.payload,
        error: null,
      };
    case actionTypes.GET_CHARGE_CODE_BY_ID_FAIL:
      return {
        ...state,
        chargeCodeData: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_CHARGE_CODE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_CHARGE_CODE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_CHARGE_CODE_API_STATUS:
      return {
        ...state,
        createEditChargeCodeApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default getAllChargeCodes;
