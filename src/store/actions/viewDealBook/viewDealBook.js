import { BIND_AUCTIONDATA_FAILURE, BIND_AUCTIONDATA_REQUEST, BIND_AUCTIONDATA_SUCCESS, BIND_AUCTIONEER_FAILURE, BIND_AUCTIONEER_REQUEST, BIND_AUCTIONEER_SUCCESS, BIND_LOATNO_FAILURE, BIND_LOATNO_REQUEST, BIND_LOATNO_SUCCESS, BIND_SALE_NO_FAILURE, BIND_SALE_NO_REQUEST, BIND_SALE_NO_SUCCESS, BIND_SESSIONTIME_FAILURE, BIND_SESSIONTIME_REQUEST, BIND_SESSIONTIME_SUCCESS, DOWNLOAD_AUCTIONEER_EXCEL_FAILURE, DOWNLOAD_AUCTIONEER_EXCEL_REQUEST, DOWNLOAD_AUCTIONEER_EXCEL_SUCCESS, DOWNLOAD_AUCTIONEER_PDF_FAILURE, DOWNLOAD_AUCTIONEER_PDF_REQUEST, DOWNLOAD_AUCTIONEER_PDF_SUCCESS, DOWNLOAD_EXCEL_FAILURE, DOWNLOAD_EXCEL_REQUEST, DOWNLOAD_EXCEL_SUCCESS, DOWNLOAD_PDF_FAILURE, DOWNLOAD_PDF_REQUEST, DOWNLOAD_PDF_SUCCESS, DOWNLOAD_TAO_EXCEL_FAILURE, DOWNLOAD_TAO_EXCEL_REQUEST, DOWNLOAD_TAO_EXCEL_SUCCESS, DOWNLOAD_TAO_PDF_FAILURE, DOWNLOAD_TAO_PDF_REQUEST, DOWNLOAD_TAO_PDF_SUCCESS, VIEWDEALBOOK_LIST_FAILURE, VIEWDEALBOOK_LIST_REQUEST, VIEWDEALBOOK_LIST_SUCCESS, VIEWDEALBOOK_SEARCH_FAILURE, VIEWDEALBOOK_SEARCH_REQUEST, VIEWDEALBOOK_SEARCH_SUCCESS, VIEW_DEALBOOK_LIST_FAILURE, VIEW_DEALBOOK_LIST_REQUEST, VIEW_DEALBOOK_LIST_SUCCESS } from "../../actionLabels";

export const bindSaleNoRequest = (data) => ({
  type: BIND_SALE_NO_REQUEST,
  payload: data,
});

export const bindSaleNoSuccess = (response) => ({
  type: BIND_SALE_NO_SUCCESS,
  payload: response,
});

export const bindSaleNoFailure = (error) => ({
  type: BIND_SALE_NO_FAILURE,
  payload: error,
});


export const bindAuctionDateRequest = (data) => ({
  type: BIND_AUCTIONDATA_REQUEST,
  payload: data,
});

export const bindAuctionDateSuccess = (response) => ({
  type: BIND_AUCTIONDATA_SUCCESS,
  payload: response,
});

export const bindAuctionDateFailure = (error) => ({
  type: BIND_AUCTIONDATA_FAILURE,
  payload: error,
});


export const bindLoatNoRequest = (data) => ({
  type: BIND_LOATNO_REQUEST,
  payload: data,
});

export const bindLoatNoSuccess = (response) => ({
  type: BIND_LOATNO_SUCCESS,
  payload: response,
});

export const bindLoatNoFailure = (error) => ({
  type: BIND_LOATNO_FAILURE,
  payload: error,
});



export const bindSessionTimeRequest = (data) => ({
  type: BIND_SESSIONTIME_REQUEST,
  payload: data,
});

export const bindSessionTimeSuccess = (response) => ({
  type: BIND_SESSIONTIME_SUCCESS,
  payload: response,
});

export const bindSessionTimeFailure = (error) => ({
  type: BIND_SESSIONTIME_FAILURE,
  payload: error,
});


export const bindAuctioneerRequest = (data) => ({
  type: BIND_AUCTIONEER_REQUEST,
  payload: data,
});

export const bindAuctioneerSuccess = (response) => ({
  type: BIND_AUCTIONEER_SUCCESS,
  payload: response,
});

export const bindAuctioneerFailure = (error) => ({
  type: BIND_AUCTIONEER_FAILURE,
  payload: error,
});



export const downloadExcelRequest = (dealBookSearch) => ({
  type: DOWNLOAD_EXCEL_REQUEST,
  payload: dealBookSearch,
});

export const downloadExcelSuccess = (base64Data) => ({
  type: DOWNLOAD_EXCEL_SUCCESS,
  payload: base64Data,
});

export const downloadExcelFailure = (error) => ({
  type: DOWNLOAD_EXCEL_FAILURE,
  payload: error,
});



export const downloadPDFRequest = (dealBookSearch) => ({
  type: DOWNLOAD_PDF_REQUEST,
  payload: dealBookSearch,
});

export const downloadPDFSuccess = (base64Data) => ({
  type: DOWNLOAD_PDF_SUCCESS,
  payload: base64Data,
});

export const downloadPDFFailure = (error) => ({
  type: DOWNLOAD_PDF_FAILURE,
  payload: error,
});



export const downloadAuctioneerPDFRequest = (dealBookSearch) => ({
  type: DOWNLOAD_AUCTIONEER_PDF_REQUEST,
  payload: dealBookSearch,
});

export const downloadAuctioneerPDFSuccess = (base64Data) => ({
  type: DOWNLOAD_AUCTIONEER_PDF_SUCCESS,
  payload: base64Data,
});

export const downloadAuctioneerPDFFailure = (error) => ({
  type: DOWNLOAD_AUCTIONEER_PDF_FAILURE,
  payload: error,
});


export const downloadAuctioneerExcelRequest = (dealBookSearch) => ({
  type: DOWNLOAD_AUCTIONEER_EXCEL_REQUEST,
  payload: dealBookSearch,
});

export const downloadAuctioneerExcelSuccess = (base64Data) => ({
  type: DOWNLOAD_AUCTIONEER_EXCEL_SUCCESS,
  payload: base64Data,
});

export const downloadAuctioneerExcelFailure = (error) => ({
  type: DOWNLOAD_AUCTIONEER_EXCEL_FAILURE,
  payload: error,
});

export const downloadTaoExcelRequest = (dealBookSearch) => ({
  type: DOWNLOAD_TAO_EXCEL_REQUEST,
  payload: dealBookSearch,
});
export const downloadTaoExcelSuccess = (base64Data) => ({
  type: DOWNLOAD_TAO_EXCEL_SUCCESS,
  payload: base64Data,
});
export const downloadTaoExcelFailure = (error) => ({
  type: DOWNLOAD_TAO_EXCEL_FAILURE,
  payload: error,
});


export const downloadTaoPDFRequest = (dealBookSearch) => ({
  type: DOWNLOAD_TAO_PDF_REQUEST,
  payload: dealBookSearch,
});
export const downloadTaoPDFSuccess = (base64Data) => ({
  type: DOWNLOAD_TAO_PDF_SUCCESS,
  payload: base64Data,
});
export const downloadTaoPDFFailure = (error) => ({
  type: DOWNLOAD_TAO_PDF_FAILURE,
  payload: error,
});


export const ViewDealBookRequest = (dealBookSearch) => ({
  type: VIEWDEALBOOK_SEARCH_REQUEST,
  payload: dealBookSearch,
});

export const ViewDealBookSuccess = (base64Data) => ({
  type: VIEWDEALBOOK_SEARCH_SUCCESS,
  payload: base64Data,
});

export const ViewDealBookFailure = (error) => ({
  type: VIEWDEALBOOK_SEARCH_FAILURE,
  payload: error,
});


export const ViewDealBookListRequest = (dealBookSearch) => ({
  type: VIEWDEALBOOK_LIST_REQUEST,
  payload: dealBookSearch,
});

export const ViewDealBookListSuccess = (data) => ({
  type: VIEWDEALBOOK_LIST_SUCCESS,
  payload: data,
});

export const ViewDealBookListFailure = (error) => ({
  type: VIEWDEALBOOK_LIST_FAILURE,
  payload: error,
});


export const viewDealBookListRequest = (dealBookSearch) => ({
  type: VIEW_DEALBOOK_LIST_REQUEST,
  payload: dealBookSearch,
});

export const viewDealBookListSuccess = (responseData) => ({
  type: VIEW_DEALBOOK_LIST_SUCCESS,
  payload: responseData,
});

export const viewDealBookListFailure = (error) => ({
  type: VIEW_DEALBOOK_LIST_FAILURE,
  payload: error,
});