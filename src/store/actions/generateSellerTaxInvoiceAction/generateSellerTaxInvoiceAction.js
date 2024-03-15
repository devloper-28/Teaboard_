import * as actionTypes from "../../actionLabels/generateSellerTaxInvoice/generateSellerTaxInvoiceActionlabels";

export const sellertoauctioneerinvoice_search = (payload) => {
    return {
      type: actionTypes.SELLERTOAUCTIONEERINVOICE_SEARCH,
      payload: payload,
    };
  };
  
  export const sellertoauctioneerinvoice_search_Success = (data) => {
    return {
      type: actionTypes.SELLERTOAUCTIONEERINVOICE_SEARCH_SUCCESS,
      payload: data,
    };
   
  };
  
  export const sellertoauctioneerinvoice_search_Fail = (error) => {
    return {
      type: actionTypes.SELLERTOAUCTIONEERINVOICE_SEARCH_FAIL,
      payload: error,
    };
  };

  
export const viewinvoicedetail = (payload) => {
    return {
      type: actionTypes.SELLERTOAUCTIONEERINVOICE_VIEWINVOICEDETAIL,
      payload: payload,
    };
  };
  
  export const viewinvoicedetail_Success = (data) => {
    return {
      type: actionTypes.SELLERTOAUCTIONEERINVOICE_VIEWINVOICEDETAIL_SUCCESS,
      payload: data,
    };
   
  };
  
  export const viewinvoicedetail_Fail = (error) => {
    return {
      type: actionTypes.SELLERTOAUCTIONEERINVOICE_VIEWINVOICEDETAIL_FAIL,
      payload: error,
    };
  };

  
export const sellertoauctioneerinvoice_create = (payload) => {
    return {
      type: actionTypes.SELLERTOAUCTIONEERINVOICE_CREATE,
      payload: payload,
    };
  };
  
  export const sellertoauctioneerinvoice_create_Success = (data) => {
    return {
      type: actionTypes.SELLERTOAUCTIONEERINVOICE_CREATE_SUCCESS,
      payload: data,
    };
   
  };
  
  export const sellertoauctioneerinvoice_create_Fail = (error) => {
    return {
      type: actionTypes.SELLERTOAUCTIONEERINVOICE_CREATE_FAIL,
      payload: error,
    };
  };