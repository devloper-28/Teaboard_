import * as actionTypes from "../../actionLabels/invoiceListActionLabels/invoiceListActionLabels";

export const downloadAllDocument = (payload) => {
    return {
      type: actionTypes.DOWNLOAD_ALL_DOCUMENT,
      payload: payload,
    };
  };
  
  export const downloadAllDocumentSuccess = (data) => {
    return {
      type: actionTypes.DOWNLOAD_ALL_DOCUMENT_SUCCESS,
      payload: data,
    };
   
  };
  
  export const downloadAllDocumentFail = (error) => {
    return {
      type: actionTypes.DOWNLOAD_ALL_DOCUMENT_FAIL,
      payload: error,
    };
  };

  export const bindAuctionDate = (payload) => {
    return {
      type: actionTypes.GET_BIND_AUCTION_DATE,
      payload: payload,
    };
  };
  
  export const bindAuctionDateSuccesss = (data) => {
    return {
      type: actionTypes.GET_BIND_AUCTION_DATE_SUCCESS,
      payload: data,
    };
   
  };
  
  export const bindAuctionDateFail = (error) => {
    return {
      type: actionTypes.GET_BIND_AUCTION_DATE_FAIL,
      payload: error,
    };
  };

  export const getlotnofortao = () => {
    return {
      type: actionTypes.GET_GETLOTNOFORTAO,
    };
  };

  export const getlotnobyuserid = (payload) => {
    return {
      type: actionTypes.GET_GETLOTNOBYUSERID,
      payload: payload,
    };
  };
  
  export const getlotnobyuseridSuccess = (data) => {
    return {
      type: actionTypes.GET_GETLOTNOBYUSERID_SUCCESS,
      payload: data,
    };
   
  };
  
  export const getlotnobyuseridFail = (error) => {
    return {
      type: actionTypes.GET_GETLOTNOBYUSERID_FAIL,
      payload: error,
    };
  };

  export const getinvoicenofortao = (payload) => {
    return {
      type: actionTypes.GETINVOICENOFORTAO,
      payload: payload,
    };
  };
  
  export const getinvoicenofortaoSuccess = (data) => {
    return {
      type: actionTypes.GETINVOICENOFORTAO_SUCCESS,
      payload: data,
    };
   
  };
  
  export const getinvoicenofortaoFail = (error) => {
    return {
      type: actionTypes.GETINVOICENOFORTAO_FAIL,
      payload: error,
    };
  };

  export const getlotnoforteaboard = () => {
    return {
      type: actionTypes.GETLOTNOFORTEABOARD,
    };
  };
  
  export const getlotnoforteaboardSuccess = (data) => {
    return {
      type: actionTypes.GETLOTNOFORTEABOARD_SUCCESS,
      payload: data,
    };
   
  };
  
  export const getlotnoforteaboardFail = (error) => {
    return {
      type: actionTypes.GETLOTNOFORTEABOARD_FAIL,
      payload: error,
    };
  };
  
  
export const getinvoicenobyuserid = (payload) => {
    return {
      type: actionTypes.GETINVOICENOBYUSERID,
      payload: payload,
    };
  };
  
  export const getinvoicenobyuseridSuccess = (data) => {
    return {
      type: actionTypes.GETINVOICENOBYUSERID_SUCCESS,
      payload: data,
    };
   
  };
  
  export const getinvoicenobyuseridFail = (error) => {
    return {
      type: actionTypes.GETINVOICENOBYUSERID_FAIL,
      payload: error,
    };
  };

  
export const getinvoicenoforteaboard = () => {
    return {
      type: actionTypes.GETINVOICENOFORTEABOARD,
    };
  };
  
  export const getinvoicenoforteaboardSuccess = (data) => {
    return {
      type: actionTypes.GETINVOICENOFORTEABOARD_SUCCESS,
      payload: data,
    };
   
  };
  
  export const getinvoicenoforteaboardFail = (error) => {
    return {
      type: actionTypes.GETINVOICENOFORTEABOARD_FAIL,
      payload: error,
    };
  };

  
export const previewpdf = (payload) => {
    return {
      type: actionTypes.PREVIEWPDF,
      payload: payload,
    };
  };
  
  export const previewpdfSuccess = (data) => {
    return {
      type: actionTypes.PREVIEWPDF_SUCCESS,
      payload: data,
    };
   
  };
  
  export const previewpdfFail = (error) => {
    return {
      type: actionTypes.PREVIEWPDF_FAIL,
      payload: error,
    };
  };

  
export const bindsalenobyseason = (payload) => {
    return {
      type: actionTypes.BINDSALENOBYSEASON,
      payload: payload,
    };
  };
  
  export const bindsalenobyseasonSuccess = (data) => {
    return {
      type: actionTypes.BINDSALENOBYSEASON_SUCCESS,
      payload: data,
    };
   
  };
  
  export const bindsalenobyseasonFail = (error) => {
    return {
      type: actionTypes.BINDSALENOBYSEASON_FAIL,
      payload: error,
    };
  };

  
export const get_searchinvoicelist = (payload) => {
    return {
      type: actionTypes.GET_SEARCHINVOICELIST,
      payload: payload,
    };
  };
  
  export const get_searchinvoicelistSuccess = (data) => {
    return {
      type: actionTypes.GET_SEARCHINVOICELIST_SUCCESS,
      payload: data,
    };
   
  };
  
  export const get_searchinvoicelistFail = (error) => {
    return {
      type: actionTypes.GET_SEARCHINVOICELIST_FAIL,
      payload: error,
    };
  }
  export const getusersbyauctioncenter = (payload) => {
    return {
      type: actionTypes.GETUSERSBYAUCTIONCENTER,
      payload: payload,
    };
  };
    export const getusersbyauctioncenter_success = (data) => {
      return {
        type: actionTypes.GETUSERSBYAUCTIONCENTER_SUCCESS,
        payload: data,
      };
     
    };
    
    export const getusersbyauctioncenter_fail = (error) => {
      return {
        type: actionTypes.GETUSERSBYAUCTIONCENTER_FAIL,
        payload: error,
      };
  };
