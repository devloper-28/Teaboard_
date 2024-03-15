import * as actionTypes from "../../actionLabels/index";

const initialState = {
  documentData: [],
  error: null,
  historyData: [],
  exportData: "",
  exportDataApiCall: false,
  exportViewData: "",
  exportViewDataApiCall: false,
};

const documentByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DOCUMENT_BY_ID_SUCCESS:
      return {
        ...state,
        documentData: action.payload,
        error: null,
      };
    case actionTypes.GET_DOCUMENT_BY_ID_FAIL:
      return {
        ...state,
        documentData: [],
        error: action.payload,
      };
    case actionTypes.GET_HISTORY_BY_ID_SUCCESS:
      return {
        ...state,
        historyData: action.payload,
        error: null,
      };
    case actionTypes.GET_HISTORY_BY_ID_FAIL:
      return {
        ...state,
        historyData: [],
        error: action.payload,
      };
    case actionTypes.GET_EXPORT_DATA_SUCCESS:
      return {
        ...state,
        exportData: action.payload,
        error: null,
      };
    case actionTypes.GET_EXPORT_DATA_FAIL:
      return {
        ...state,
        exportData: "",
        error: action.payload,
      };
    case actionTypes.GET_EXPORT_DATA_API_CALL:
      return {
        ...state,
        exportDataApiCall: action.payload,
        error: action.payload,
      };

    case actionTypes.GET_EXPORT_DATA_FOR_VIEW_SUCCESS:
      return {
        ...state,
        exportViewData: action.payload,
        error: null,
      };
    case actionTypes.GET_EXPORT_DATA_FOR_VIEW_FAIL:
      return {
        ...state,
        exportViewData: "",
        error: action.payload,
      };
    case actionTypes.GET_EXPORT_DATA_FOR_VIEW_API_CALL:
      return {
        ...state,
        exportDataForViewApiCall: action.payload,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default documentByIdReducer;
