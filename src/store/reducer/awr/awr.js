import {
  ADD_AWR_FAILURE,
  ADD_AWR_REQUEST,
  ADD_AWR_SUCCESS,
  FETCH_AWR_DETAILS_BY_INVOICE_ID_FAILURE,
  FETCH_AWR_DETAILS_BY_INVOICE_ID_REQUEST,
  FETCH_AWR_DETAILS_BY_INVOICE_ID_SUCCESS,
  FETCH_AWR_LIST_FAILURE,
  FETCH_AWR_LIST_REQUEST,
  FETCH_AWR_LIST_SUCCESS,
  GET_INVOICES_BY_AWR_DETAILS_FAILURE,
  GET_INVOICES_BY_AWR_DETAILS_REQUEST,
  GET_INVOICES_BY_AWR_DETAILS_SUCCESS,
} from "../../actionLabels/awr/awr";

const initialState = {
  loading: false,
  awrList: [],
  awrDetails: null,
  error: null,
  invoices: [],
};

const awrReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AWR_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_AWR_LIST_SUCCESS:
      return { ...state, loading: false, awrList: action.payload, error: null };
    case FETCH_AWR_LIST_FAILURE:
      return { ...state, loading: false, awrList: [], error: action.payload };
    case FETCH_AWR_DETAILS_BY_INVOICE_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_AWR_DETAILS_BY_INVOICE_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        awrDetails: action.payload,
        error: null,
      };
    case FETCH_AWR_DETAILS_BY_INVOICE_ID_FAILURE:
      return {
        ...state,
        loading: false,
        awrDetails: null,
        error: action.payload,
      };
    case ADD_AWR_REQUEST:
      return { ...state, loading: true, error: null };
    case ADD_AWR_SUCCESS:
      return { ...state, loading: false, error: null };
    case ADD_AWR_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case GET_INVOICES_BY_AWR_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_INVOICES_BY_AWR_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        invoices: action.payload,
        error: null,
      };
    case GET_INVOICES_BY_AWR_DETAILS_FAILURE:
      return { ...state, loading: false, invoices: [], error: action.payload };

    default:
      return state;
  }
};

export default awrReducer;
