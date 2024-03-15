import * as actionTypes from "../../actionLabels/index";

const initialstate = {
  getAllBankAcActionSuccess: [],
  getAllBankAcWithStatus: [],
  createdBankAc: null,
  updatedBankAc: null,
  searchResults: [],
  BankAcData: [],
  getAllBankAcAscActionSuccess: [],
  error: null,
  createEditBankAcDetailsApiStatus: false,
};

const getAllBankAcReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_BANKAC_SUCCESS:
      return {
        ...state,
        getAllBankAcActionSuccess: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_BANKAC_FAIL:
      return {
        ...state,
        getAllBankAcActionSuccess: [],
        error: action.payload,
      };
    case actionTypes.GET_ALL_BANKAC_SUCCESS_ASC:
      return {
        ...state,
        getAllBankAcAscActionSuccess: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_BANKAC_FAIL_ASC:
      return {
        ...state,
        getAllBankAcAscActionSuccess: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_BANKAC_WITH_STATUS_SUCCESS:
      return {
        ...state,
        getAllBankAcWithStatus: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_BANKAC_WITH_STATUS_FAIL:
      return {
        ...state,
        getAllBankAcWithStatus: [],
        error: action.payload,
      };

    case actionTypes.CREATE_BANKAC_SUCCESS:
      return {
        ...state,
        createdBankAc: action.payload,
        error: null,
      };

    case actionTypes.CREATE_BANKAC_FAIL:
      return {
        ...state,
        createdBankAc: null,
        error: action.payload,
      };

    case actionTypes.UPDATE_BANKAC_SUCCESS:
      return {
        ...state,
        updatedBankAc: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_BANKAC_FAIL:
      return {
        ...state,
        updatedBankAc: null,
        error: action.payload,
      };

    case actionTypes.SEARCH_BANKAC_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_BANKAC_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_BANKAC_BY_ID_SUCCESS:
      return {
        ...state,
        BankAcData: action.payload,
        error: null,
      };
    case actionTypes.GET_BANKAC_BY_ID_FAIL:
      return {
        ...state,
        BankAcData: null,
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_BANKAC_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_BANKAC_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_BANK_AC_DETAILS_API_STATUS:
      return {
        ...state,
        createEditBankAcDetailsApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default getAllBankAcReducer;
