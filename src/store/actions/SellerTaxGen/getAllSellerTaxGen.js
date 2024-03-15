import * as actionLabels from "../../actionLabels";

export const getAllSellerTaxAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE,
    payload: payload,
  };
};

export const getAllSellerTaxGenActionSuccess = (getAllTaxInvoice) => {
  return {
    type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_SUCCESS,
    payload: getAllTaxInvoice,
  };
};

export const getAllSellerTaxGenActionFail = (error) => ({
  type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_FAIL,
  payload: error,
});

export const getAllSellerTaxGenBuyerAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_BUYER,
    payload: payload,
  };
};

export const getAllSellerTaxGenBuyerActionSuccess = (getAllTaxInvoiceBuyer) => {
  return {
    type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_SUCCESS_BUYER,
    payload: getAllTaxInvoiceBuyer,
  };
};

export const getAllSellerTaxGenBuyerActionFail = (error) => ({
  type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_FAIL_BUYER,
  payload: error,
});

export const getAllSellerTaxGenSaleGenAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_SALE,
    payload: payload,
  };
};

export const getAllSellerTaxGenSaleActionSuccess = (getAllTaxInvoiceGen) => {
  return {
    type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_SALE_SUCCESS,
    payload: getAllTaxInvoiceGen,
  };
};

export const getAllSellerTaxGenSaleActionFail = (error) => ({
  type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_SALE_FAIL,
  payload: error,
});

export const getAllSellerTaxInvoiceSessionAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_SESSION,
    payload: payload,
  };
};

export const getAllSellerTaxGenSessionActionSuccess = (
  getAllTaxInvoiceSale
) => {
  return {
    type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_SESSION_SUCCESS,
    payload: getAllTaxInvoiceSale,
  };
};

export const getAllSellerTaxGenSessionActionFail = (error) => ({
  type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_SESSION_FAIL,
  payload: error,
});

export const getAuctiondataAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_AUCTION_CENTER_INVOICE,
    payload: payload,
  };
};

export const getAllauctionCenterdataActionSuccess = (getAllTaxInvoiceLot) => {
  return {
    type: actionLabels.GET_ALL_AUCTION_CENTER_INVOICE_SUCCESS,
    payload: getAllTaxInvoiceLot,
  };
};

export const getAllauctionCenterdataActionFail = (error) => ({
  type: actionLabels.GET_ALL_AUCTION_CENTER_INVOICE_FAIL,
  payload: error,
});

export const getChargeTaxByIdAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_CHARGE_TAX,
    payload: payload,
  };
};

export const getChargeTaxByIdActionSuccess = (getAllTaxInvoiceSession) => {
  return {
    type: actionLabels.GET_ALL_CHARGE_TAX_SUCCESS,
    payload: getAllTaxInvoiceSession,
  };
};

export const getChargeTaxByIdActionFail = (error) => ({
  type: actionLabels.GET_ALL_CHARGE_TAX_FAIL,
  payload: error,
});

export const getSellerTaxGenByIdAction = (InvoiceId) => {
  return {
    type: actionLabels.GET_SELLER_TAX_GEN_BY_ID,
    payload: InvoiceId,
  };
};

export const getSellerInvoiceByIdActionSuccess = (Invoice) => {
  return {
    type: actionLabels.GET_INVOICE_BY_ID_SUCCESS,
    payload: Invoice,
  };
};

export const getSellerInvoiceByIdActionFail = (error) => {
  return {
    type: actionLabels.GET_INVOICE_BY_ID_FAIL,
    payload: error,
  };
};

export const getAllSellerTaxGenAction = (InvoiceId) => {
  return {
    type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_GEN,
    payload: InvoiceId,
  };
};

export const getAllSellerTaxGenGenActionSuccess = (Invoice) => {
  return {
    type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_GEN_SUCCESS,
    payload: Invoice,
  };
};

export const getAllSellerTaxGenGenActionFail = (error) => {
  return {
    type: actionLabels.GET_ALL_SELLER_TAX_GEN_INVOICE_GEN_FAIL,
    payload: error,
  };
};

export const getAllSubmitChargeAction = (InvoiceId) => {
  return {
    type: actionLabels.GET_ALL_ADD_CHARGE_INVOICE,
    payload: InvoiceId,
  };
};

export const getAllSubmitChargeActionSuccess = (Invoice) => {
  return {
    type: actionLabels.GET_ALL_ADD_CHARGE_INVOICE_SUCCESS,
    payload: Invoice,
  };
};

export const getAllSubmitChargeActionFail = (error) => {
  return {
    type: actionLabels.GET_ALL_ADD_CHARGE_INVOICE_FAIL,
    payload: error,
  };
};
