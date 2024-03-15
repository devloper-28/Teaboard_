import * as actionTypes from "../../actionLabels/index";

const initialState = {
  genSellerTaxInvoiceView: [],
  genSellerTaxInvoiceSearch: [],
  genSellerTaxInvoiceCreate:[],
};

const generateSellerTaxInvoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELLERTOAUCTIONEERINVOICE_VIEWINVOICEDETAIL_SUCCESS:
      return {
        ...state,
        genSellerTaxInvoiceView: action.payload,
        error: null,
      };
    case actionTypes.SELLERTOAUCTIONEERINVOICE_VIEWINVOICEDETAIL_FAIL:
      return {
        ...state,
        genSellerTaxInvoiceView: [],
        error: action.payload,
      };
      case actionTypes.SELLERTOAUCTIONEERINVOICE_SEARCH_SUCCESS:
      return {
        ...state,
        genSellerTaxInvoiceSearch: action.payload,
        error: null,
      };
    case actionTypes.SELLERTOAUCTIONEERINVOICE_SEARCH_FAIL:
      return {
        ...state,
        genSellerTaxInvoiceSearch: [],
        error: action.payload,
      };
      case actionTypes.SELLERTOAUCTIONEERINVOICE_CREATE_SUCCESS:
      return {
        ...state,
        genSellerTaxInvoiceCreate: action.payload,
        error: null,
      };
    case actionTypes.SELLERTOAUCTIONEERINVOICE_CREATE_FAIL: 
      return {
        ...state,
        genSellerTaxInvoiceCreate: [],
        error: action.payload,
      };
      default:
      return state;
  }
};
export default generateSellerTaxInvoiceReducer;
