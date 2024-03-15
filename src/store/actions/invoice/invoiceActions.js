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

export const fetchInvoiceDetailsRequest = (data) => ({
  type: FETCH_INVOICE_DETAILS_REQUEST,
  payload: data,
});
export const fetchInvoiceDetailsSuccess = (data) => ({
  type: FETCH_INVOICE_DETAILS_SUCCESS,
  payload: data,
});

export const fetchInvoiceDetailsFailure = (error) => ({
  type: FETCH_INVOICE_DETAILS_FAILURE,
  payload: error,
});

export const fetchInvoiceDetailsIdRequest = (invoiceId) => ({
  type: FETCH_INVOICE_DETAILS_ID_REQUEST,
  payload: invoiceId,
});

export const fetchInvoiceDetailsIdSuccess = (invoiceDetails) => ({
  type: FETCH_INVOICE_DETAILS_ID_SUCCESS,
  payload: invoiceDetails,
});

export const fetchInvoiceDetailsIdFailure = (error) => ({
  type: FETCH_INVOICE_DETAILS_ID_FAILURE,
  payload: error,
});

export const addInvoiceDetailsRequest = (invoiceData) => ({
  type: ADD_INVOICE_DETAILS_REQUEST,
  payload: invoiceData,
});

export const addInvoiceDetailsSuccess = (response) => ({
  type: ADD_INVOICE_DETAILS_SUCCESS,
  payload: response,
});

export const addInvoiceDetailsFailure = (error) => ({
  type: ADD_INVOICE_DETAILS_FAILURE,
  payload: error,
});

export const updateInvoiceDetailsRequest = (invoiceData) => ({
  type: UPDATE_INVOICE_DETAILS_REQUEST,
  payload: invoiceData,
});

export const updateInvoiceDetailsSuccess = (response) => ({
  type: UPDATE_INVOICE_DETAILS_SUCCESS,
  payload: response,
});

export const updateInvoiceDetailsFailure = (error) => ({
  type: UPDATE_INVOICE_DETAILS_FAILURE,
  payload: error,
});

export const deleteInvoiceDetailsRequest = (invoiceId) => ({
  type: DELETE_INVOICE_DETAILS_REQUEST,
  payload: invoiceId,
});

export const deleteInvoiceDetailsSuccess = (response) => ({
  type: DELETE_INVOICE_DETAILS_SUCCESS,
  payload: response,
});

export const deleteInvoiceDetailsFailure = (error) => ({
  type: DELETE_INVOICE_DETAILS_FAILURE,
  payload: error,
});
