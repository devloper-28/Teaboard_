import * as actionTypes from "../../actionLabels/viewBuyerTaxInvoiceActionLabels/viewBuyerTaxInvoiceActionLabels";

export const get_searchinvoice = (payload) => {
  return {
    type: actionTypes.GET_SEARCHINVOICE,
    payload: payload,
  };
};

export const get_searchinvoiceSuccess = (data) => {
  return {
    type: actionTypes.GET_SEARCHINVOICE_SUCCESS,
    payload: data,
  };
};

export const get_searchinvoiceFail = (error) => {
  return {
    type: actionTypes.GET_SEARCHINVOICE_FAIL,
    payload: error,
  };
};

export const get_invoiceview = (payload) => {
  return {
    type: actionTypes.GET_INVOICEVIEW,
    payload: payload,
  };
};

export const get_invoiceviewSuccess = (data) => {
  return {
    type: actionTypes.GET_INVOICEVIEW_SUCCESS,
    payload: data,
  };
};

export const get_invoiceviewFail = (error) => {
  return {
    type: actionTypes.GET_INVOICEVIEW_FAIL,
    payload: error,
  };
};

export const getExportDataForViewBuyer = (payload) => {
  return {
    type: actionTypes.GET_EXPORT_DATA_FOR_VIEW_BUYER,
    payload: payload,
  };
};

export const getExportDataForViewBuyerSuccess = (payload) => {
  return {
    type: actionTypes.GET_EXPORT_DATA_FOR_VIEW_BUYER_SUCCESS,
    payload: payload,
  };
};

export const getExportDataForViewBuyerFail = (error) => ({
  type: actionTypes.GET_EXPORT_DATA_FOR_VIEW_BUYER_FAIL,
  payload: error,
});

export const getExportDataForViewBuyerApiCall = (payload) => {
  return {
    type: actionTypes.GET_EXPORT_DATA_FOR_VIEW_BUYER_API_CALL,
    payload: payload,
  };
};
