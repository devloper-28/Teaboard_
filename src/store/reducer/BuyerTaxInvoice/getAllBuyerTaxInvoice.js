import * as actionTypes from "../../actionLabels/index";
const initialState = {
  getAllTaxInvoice: [],
  getAllTaxInvoiceBuyer: [],
  getAllTaxInvoiceGen: [],
  getAllTaxInvoiceSale: [],
  getAllTaxInvoiceLot: [],
  getAllTaxInvoiceSession: [],
  invoiceById: [],
  gstById: [],
  excelById: [],
  exportDataSeller: [],
  exportDataSellerApiCall: [],
  InvoiceApiStatus: false,
};

const getTaxInvoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_TAX_INVOICE_SUCCESS:
      return {
        ...state,
        getAllTaxInvoice: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_TAX_INVOICE_FAIL:
      return {
        ...state,
        getAllTaxInvoice: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_TAX_INVOICE_SUCCESS_BUYER:
      return {
        ...state,
        getAllTaxInvoiceBuyer: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_TAX_INVOICE_FAIL_BUYER:
      return {
        ...state,
        getAllTaxInvoiceBuyer: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_TAX_INVOICE_GEN_SUCCESS:
      return {
        ...state,
        getAllTaxInvoiceGen: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_TAX_INVOICE_GEN_FAIL:
      return {
        ...state,
        getAllTaxInvoiceGen: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_TAX_INVOICE_SALE_SUCCESS:
      return {
        ...state,
        getAllTaxInvoiceSale: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_TAX_INVOICE_SALE_FAIL:
      return {
        ...state,
        getAllTaxInvoiceSale: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_TAX_INVOICE_LOT_SUCCESS:
      return {
        ...state,
        getAllTaxInvoiceLot: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_TAX_INVOICE_LOT_FAIL:
      return {
        ...state,
        getAllTaxInvoiceLot: [],
        error: action.payload,
      };
    case actionTypes.GET_INVOICE_BY_ID_SUCCESS:
      return {
        ...state,
        invoiceById: action.payload,
        error: null,
      };

    case actionTypes.GET_INVOICE_BY_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.GET_ALL_TAX_INVOICE_SESSION_SUCCESS:
      return {
        ...state,
        getAllTaxInvoiceSession: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_TAX_INVOICE_SESSION_FAIL:
      return {
        ...state,
        getAllTaxInvoiceSession: [],
        error: action.payload,
      };

    case actionTypes.GET_INVOICE_GST_BY_ID_SUCCESS:
      return {
        ...state,
        gstById: action.payload,
        error: null,
      };

    case actionTypes.GET_INVOICE_GST_BY_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.GET_GST_EXCEL_BY_ID_SUCCESS:
      return {
        ...state,
        excelById: action.payload,
        error: null,
      };

    case actionTypes.GET_GST_EXCEL_BY_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.GET_EXPORT_DATA_SELLER_SUCCESS:
      return {
        ...state,
        exportDataSeller: action.payload,
        error: null,
      };
    case actionTypes.GET_EXPORT_DATA_SELLER_FAIL:
      return {
        ...state,
        exportDataSeller: "",
        error: action.payload,
      };
    case actionTypes.GET_EXPORT_DATA_SELLER_API_CALL:
      return {
        ...state,
        exportDataSellerApiCall: action.payload,
        error: action.payload,
      };

    case actionTypes.INVOICE_API_STATUS:
      return {
        ...state,
        InvoiceApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default getTaxInvoiceReducer;
