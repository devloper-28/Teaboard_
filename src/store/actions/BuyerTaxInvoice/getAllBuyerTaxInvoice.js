import * as actionLabels from "../../actionLabels";

export const getAllTaxInvoiceAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_TAX_INVOICE,
    payload: payload,
  };
};

export const getAllTaxInvoiceActionSuccess = (getAllTaxInvoice) => {
  return {
    type: actionLabels.GET_ALL_TAX_INVOICE_SUCCESS,
    payload: getAllTaxInvoice,
  };
};

export const getAllTaxInvoiceActionFail = (error) => ({
  type: actionLabels.GET_ALL_TAX_INVOICE_FAIL,
  payload: error,
});

export const getAllTaxInvoiceBuyerAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_TAX_INVOICE_BUYER,
    payload: payload,
  };
};

export const getAllTaxInvoiceBuyerActionSuccess = (getAllTaxInvoiceBuyer) => {
  return {
    type: actionLabels.GET_ALL_TAX_INVOICE_SUCCESS_BUYER,
    payload: getAllTaxInvoiceBuyer,
  };
};

export const getAllTaxInvoiceBuyerActionFail = (error) => ({
  type: actionLabels.GET_ALL_TAX_INVOICE_FAIL_BUYER,
  payload: error,
});

export const getAllTaxInvoiceGenAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_TAX_INVOICE_GEN,
    payload: payload,
  };
};

export const getAllTaxInvoiceGenActionSuccess = (getAllTaxInvoiceGen) => {
  return {
    type: actionLabels.GET_ALL_TAX_INVOICE_GEN_SUCCESS,
    payload: getAllTaxInvoiceGen,
  };
};

export const getAllTaxInvoiceGenActionFail = (error) => ({
  type: actionLabels.GET_ALL_TAX_INVOICE_GEN_FAIL,
  payload: error,
});

export const getAllTaxInvoiceSaleAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_TAX_INVOICE_SALE,
    payload: payload,
  };
};

export const getAllTaxInvoiceSaleActionSuccess = (getAllTaxInvoiceSale) => {
  return {
    type: actionLabels.GET_ALL_TAX_INVOICE_SALE_SUCCESS,
    payload: getAllTaxInvoiceSale,
  };
};

export const getAllTaxInvoiceSaleActionFail = (error) => ({
  type: actionLabels.GET_ALL_TAX_INVOICE_SALE_FAIL,
  payload: error,
});

export const getAllTaxInvoiceLotAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_TAX_INVOICE_LOT,
    payload: payload,
  };
};

export const getAllTaxInvoiceLotActionSuccess = (getAllTaxInvoiceLot) => {
  return {
    type: actionLabels.GET_ALL_TAX_INVOICE_LOT_SUCCESS,
    payload: getAllTaxInvoiceLot,
  };
};

export const getAllTaxInvoiceLotActionFail = (error) => ({
  type: actionLabels.GET_ALL_TAX_INVOICE_LOT_FAIL,
  payload: error,
});

export const getAllTaxInvoiceSessionAction = (payload) => {
  console.log(" in action payload", payload);

  return {
    type: actionLabels.GET_ALL_TAX_INVOICE_SESSION,
    payload: payload,
  };
};

export const getAllTaxInvoiceSessionActionSuccess = (
  getAllTaxInvoiceSession
) => {
  return {
    type: actionLabels.GET_ALL_TAX_INVOICE_SESSION_SUCCESS,
    payload: getAllTaxInvoiceSession,
  };
};

export const getAllTaxInvoiceSessionActionFail = (error) => ({
  type: actionLabels.GET_ALL_TAX_INVOICE_SESSION_FAIL,
  payload: error,
});

export const getInvoiceByIdAction = (InvoiceId) => {
  return {
    type: actionLabels.GET_INVOICE_BY_ID,
    payload: InvoiceId,
  };
};

export const getInvoiceByIdActionSuccess = (Invoice) => {
  return {
    type: actionLabels.GET_INVOICE_BY_ID_SUCCESS,
    payload: Invoice,
  };
};

export const getInvoiceByIdActionFail = (error) => {
  return {
    type: actionLabels.GET_INVOICE_BY_ID_FAIL,
    payload: error,
  };
};

export const getInvoiceGstByIdAction = (InvoiceGstId) => {
  return {
    type: actionLabels.GET_INVOICE_BY_ID,
    payload: InvoiceGstId,
  };
};

export const getInvoiceGstByIdActionSuccess = (Invoice) => {
  return {
    type: actionLabels.GET_INVOICE_GST_BY_ID_SUCCESS,
    payload: Invoice,
  };
};

export const getInvoiceGstByIdActionFail = (error) => {
  return {
    type: actionLabels.GET_INVOICE_GST_BY_ID_FAIL,
    payload: error,
  };
};

export const getGstExcelByIdAction = (GstExcelId) => {
  return {
    type: actionLabels.GET_GST_EXCEL_BY_ID,
    payload: GstExcelId,
  };
};

export const getGstExcelByIdActionSuccess = (ExcelData) => {
  return {
    type: actionLabels.GET_GST_EXCEL_BY_ID_SUCCESS,
    payload: ExcelData,
  };
};

export const getGstExcelByIdActionFail = (error) => {
  return {
    type: actionLabels.GET_GST_EXCEL_BY_ID_FAIL,
    payload: error,
  };
};

export const getExportDataSeller = (payload) => {
  return {
    type: actionLabels.GET_EXPORT_DATA_SELLER,
    payload: payload,
  };
};

export const getExportDataSellerSuccess = (payload) => {
  return {
    type: actionLabels.GET_EXPORT_DATA_SELLER_SUCCESS,
    payload: payload,
  };
};

export const getExportDataSellerFail = (error) => ({
  type: actionLabels.GET_EXPORT_DATA_SELLER_FAIL,
  payload: error,
});

export const getExportDataSellerApiCall = (payload) => {
  return {
    type: actionLabels.GET_EXPORT_DATA_SELLER_API_CALL,
    payload: payload,
  };
};

export const getInvoicenotGenAction = (InvoiceNotId) => {
  return {
    type: actionLabels.GET_INVOICE_NOT_BY_ID,
    payload: InvoiceNotId,
  };
};

export const getInvoicenotGenActionSuccess = (InvoiceNotData) => {
  return {
    type: actionLabels.GET_INVOICE_NOT_BY_SUCCESS,
    payload: InvoiceNotData,
  };
};

export const getInvoicenotGenActionFail = (error) => {
  return {
    type: actionLabels.GET_INVOICE_NOT_BY_FAIL,
    payload: error,
  };
};

export const InvoiceApiStatus = (data) => {
  return {
    type: actionLabels.INVOICE_API_STATUS,
    payload: { data: data },
  };
};
