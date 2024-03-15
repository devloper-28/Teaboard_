import * as actionTypes from "../../actionLabels/index";

const initialState = {
  viewBuyerTaxInvoiceList: [],
  searchBuyerTaxInvoiceList: [],
  exportViewBuyerData: "",
  exportDataForViewBuyerApiCall: false,
};

const getViewBuyerTaxInvoice = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_INVOICEVIEW_SUCCESS:
      return {
        ...state,
        viewBuyerTaxInvoiceList: action.payload,
        error: null,
      };
    case actionTypes.GET_INVOICEVIEW_FAIL:
      return {
        ...state,
        viewBuyerTaxInvoiceList: [],
        error: action.payload,
      };
    case actionTypes.GET_SEARCHINVOICE_SUCCESS:
      return {
        ...state,
        searchBuyerTaxInvoiceList: action.payload,
        error: null,
      };
    case actionTypes.GET_SEARCHINVOICE_FAIL:
      return {
        ...state,
        searchBuyerTaxInvoiceList: [],
        error: action.payload,
      };
    case actionTypes.GET_EXPORT_DATA_FOR_VIEW_BUYER_SUCCESS:
      return {
        ...state,
        exportViewBuyerData: action.payload,
        error: null,
      };
    case actionTypes.GET_EXPORT_DATA_FOR_VIEW_BUYER_FAIL:
      return {
        ...state,
        exportViewBuyerData: "",
        error: action.payload,
      };
    case actionTypes.GET_EXPORT_DATA_FOR_VIEW_BUYER_API_CALL:
      return {
        ...state,
        exportDataForViewBuyerApiCall: action.payload,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default getViewBuyerTaxInvoice;
