import {
  ADD_INVOICE_DETAILS_FAILURE,
  ADD_INVOICE_DETAILS_REQUEST,
  ADD_INVOICE_DETAILS_SUCCESS,
  DELETE_INVOICE_DETAILS_FAILURE,
  DELETE_INVOICE_DETAILS_REQUEST,
  DELETE_INVOICE_DETAILS_SUCCESS,
  FETCH_INVOICE_DETAILS_FAILURE,
  FETCH_INVOICE_DETAILS_ID_FAILURE,
  FETCH_INVOICE_DETAILS_ID_REQUEST,
  FETCH_INVOICE_DETAILS_ID_SUCCESS,
  FETCH_INVOICE_DETAILS_REQUEST,
  FETCH_INVOICE_DETAILS_SUCCESS,
  UPDATE_INVOICE_DETAILS_FAILURE,
  UPDATE_INVOICE_DETAILS_REQUEST,
  UPDATE_INVOICE_DETAILS_SUCCESS,
} from "../../actionLabels/invoice/invoiceLabels";

const initialState = {
  response: null,
  invoiceDetail: {},
  data: [],
  invoiceDetails: {},
  loading: false,
  error: null,
};

const invoiceDetails = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INVOICE_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_INVOICE_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_INVOICE_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_INVOICE_DETAILS_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_INVOICE_DETAILS_ID_SUCCESS:
      return { ...state, loading: false, invoiceDetail: action.payload };
    case FETCH_INVOICE_DETAILS_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ADD_INVOICE_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case ADD_INVOICE_DETAILS_SUCCESS:
      return { ...state, loading: false, response: action.payload };
    case ADD_INVOICE_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_INVOICE_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_INVOICE_DETAILS_SUCCESS:
      return { ...state, loading: false, response: action.payload };
    case UPDATE_INVOICE_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_INVOICE_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case DELETE_INVOICE_DETAILS_SUCCESS:
      return { ...state, loading: false, response: action.payload };
    case DELETE_INVOICE_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default invoiceDetails;
