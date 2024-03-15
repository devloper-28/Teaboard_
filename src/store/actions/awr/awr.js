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

export const fetchAwrListRequest = (data) => ({
  type: FETCH_AWR_LIST_REQUEST,
  payload: data,
});

export const fetchAwrListSuccess = (awrList) => ({
  type: FETCH_AWR_LIST_SUCCESS,
  payload: awrList,
});

export const fetchAwrListFailure = (error) => ({
  type: FETCH_AWR_LIST_FAILURE,
  payload: error,
});

export const fetchAwrDetailsByInvoiceIdRequest = (data) => ({
  type: FETCH_AWR_DETAILS_BY_INVOICE_ID_REQUEST,
  payload: data,
});

export const fetchAwrDetailsByInvoiceIdSuccess = (awrDetails) => ({
  type: FETCH_AWR_DETAILS_BY_INVOICE_ID_SUCCESS,
  payload: awrDetails,
});

export const fetchAwrDetailsByInvoiceIdFailure = (error) => ({
  type: FETCH_AWR_DETAILS_BY_INVOICE_ID_FAILURE,
  payload: error,
});


export const addAwrRequest = (data) => ({
  type: ADD_AWR_REQUEST,
  payload: data,
});

export const addAwrSuccess = () => ({
  type: ADD_AWR_SUCCESS,
});

export const addAwrFailure = (error) => ({
  type: ADD_AWR_FAILURE,
  payload: error,
});


export const getInvoicesByAwrDetailsRequest = (data) => ({
  type: GET_INVOICES_BY_AWR_DETAILS_REQUEST,
  payload: data,
});

export const getInvoicesByAwrDetailsSuccess = (invoices) => ({
  type: GET_INVOICES_BY_AWR_DETAILS_SUCCESS,
  payload: invoices,
});

export const getInvoicesByAwrDetailsFailure = (error) => ({
  type: GET_INVOICES_BY_AWR_DETAILS_FAILURE,
  payload: error,
});