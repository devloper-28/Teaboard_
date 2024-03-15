import * as actionTypes from "../../actionLabels/index";

// Sale number actions

export const getSaleNoRequest = () => ({
  type: actionTypes.GET_SALE_NO_REQUEST,
});

export const getSaleNoSuccess = (saleNo) => ({
  type: actionTypes.GET_SALE_NO_SUCCESS,
  payload: saleNo,
});

export const getSaleNoFailure = (error) => ({
  type: actionTypes.GET_SALE_NO_FAILURE,
  payload: error,
});


export const checkSaleNoExistence = (saleNo, season) => ({
    type: actionTypes.CHECK_SALE_NO_EXISTENCE,
    payload: { saleNo, season },
  });
  
  export const checkSaleNoExistenceSuccess = (exists) => ({
    type: actionTypes.CHECK_SALE_NO_EXISTENCE_SUCCESS,
    payload: { exists },
  });
  
  export const checkSaleNoExistenceFailure = (error) => ({
    type: actionTypes.CHECK_SALE_NO_EXISTENCE_FAILURE,
    payload: { error },
  });
  export const fetchSaleProgramListRequest = (payload) => ({
    type: actionTypes.FETCH_SALE_PROGRAM_LIST_REQUEST,
    payload:payload,
  });
  
  export const fetchSaleProgramListSuccess = (data) => ({
    type: actionTypes.FETCH_SALE_PROGRAM_LIST_SUCCESS,
    payload: data,
  });
  
  export const fetchSaleProgramListFailure = (error) => ({
    type: actionTypes.FETCH_SALE_PROGRAM_LIST_FAILURE,
    payload: error,
  });
  
  export const fetchSaleProgramDetailsRequest = (id) => ({
    type: actionTypes.FETCH_SALE_PROGRAM_DETAILS_REQUEST,
    payload: id,
  });
  
  export const fetchSaleProgramDetailsSuccess = (data) => ({
    type: actionTypes.FETCH_SALE_PROGRAM_DETAILS_SUCCESS,
    payload: data,
  });
  
  export const fetchSaleProgramDetailsFailure = (error) => ({
    type: actionTypes.FETCH_SALE_PROGRAM_DETAILS_FAILURE,
    payload: error,
  });
// create sale program
  export const createSaleProgramRequest = (data) => ({
    type: actionTypes.CREATE_SALE_PROGRAM_REQUEST,
    payload: data,
  });
  
  export const createSaleProgramSuccess = () => ({
    type: actionTypes.CREATE_SALE_PROGRAM_SUCCESS,
  });
  
  export const createSaleProgramFailure = (error) => ({
    type: actionTypes.CREATE_SALE_PROGRAM_FAILURE,
    payload: error,
  });

  export const updateSaleProgramRequest = (data) => ({
    type: actionTypes.UPDATE_SALE_PROGRAM_REQUEST,
    payload: data,
  });
  
  export const updateSaleProgramSuccess = () => ({
    type: actionTypes.UPDATE_SALE_PROGRAM_SUCCESS,
  });
  
  export const updateSaleProgramFailure = (error) => ({
    type: actionTypes.UPDATE_SALE_PROGRAM_FAILURE,
    payload: error,
  });

  export const cancelSaleProgramRequest = (data) => ({
    type: actionTypes.CANCEL_SALE_PROGRAM_REQUEST,
    payload: data,
  });
  
  export const cancelSaleProgramSuccess = () => ({
    type: actionTypes.CANCEL_SALE_PROGRAM_SUCCESS,
  });
  
  export const cancelSaleProgramFailure = (error) => ({
    type: actionTypes.CANCEL_SALE_PROGRAM_FAILURE,
    payload: error,
  });

  export const cancelSaleProgramDocumentRequest = (data) => {
    return {
      type: actionTypes.CANCEL_SALE_PROGRAM_DOCUMENT_REQUEST,
      payload: data,
    };
  };
  
  export const cancelSaleProgramDocumentSuccess = () => {
    return {
      type: actionTypes.CANCEL_SALE_PROGRAM_DOCUMENT_SUCCESS,
    };
  };
  
  export const cancelSaleProgramDocumentFailure = (error) => {
    return {
      type: actionTypes.CANCEL_SALE_PROGRAM_DOCUMENT_FAILURE,
      payload: error,
    };
  };
