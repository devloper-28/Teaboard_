import * as actionLabels from "../../actionLabels";

// GET ALL REVENUE
export const getAllRevenueAction = () => {
  return {
    type: actionLabels.GET_ALL_REVENUE,
  };
};

export const getAllRevenueActionSuccess = (revenueData) => {
  return {
    type: actionLabels.GET_ALL_REVENUE_SUCCESS,
    payload: revenueData,
  };
};

export const getAllRevenueActionFail = (error) => ({
  type: actionLabels.GET_ALL_REVENUE_FAIL,
  payload: error,
});

export const getAllRevenueAscAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_REVENUE_ASC,
    payload: payload,
  };
};

export const getAllRevenueAscActionSuccess = (revenueDataAsc) => {
  return {
    type: actionLabels.GET_ALL_REVENUE_SUCCESS_ASC,
    payload: revenueDataAsc,
  };
};

export const getAllRevenueAscActionFail = (error) => ({
  type: actionLabels.GET_ALL_REVENUE_FAIL_ASC,
  payload: error,
});

// CREATE REVENUE
export const createRevenueAction = (revenueData) => {
  return {
    type: actionLabels.CREATE_REVENUE,
    payload: revenueData,
  };
};

export const createRevenueActionSuccess = (createdRevenue) => {
  return {
    type: actionLabels.CREATE_REVENUE_SUCCESS,
    payload: createdRevenue,
  };
};

export const createRevenueActionFail = (error) => ({
  type: actionLabels.CREATE_REVENUE_FAIL,
  payload: error,
});

// UPDATE REVENUE
export const updateRevenueAction = (updatedRevenueData) => {
  return {
    type: actionLabels.UPDATE_REVENUE,
    payload: {
      updatedRevenueData,
    },
  };
};

export const updateRevenueActionSuccess = (updatedRevenue) => {
  return {
    type: actionLabels.UPDATE_REVENUE_SUCCESS,
    payload: updatedRevenue,
  };
};

export const updateRevenueActionFail = (error) => ({
  type: actionLabels.UPDATE_REVENUE_FAIL,
  payload: error,
});

// SEARCH REVENUE
export const searchRevenueAction = (searchCriteria) => {
  return {
    type: actionLabels.SEARCH_REVENUE,
    payload: searchCriteria,
  };
};

export const searchRevenueActionSuccess = (searchedRevenueData) => {
  return {
    type: actionLabels.SEARCH_REVENUE_SUCCESS,
    payload: searchedRevenueData,
  };
};

export const searchRevenueActionFail = (error) => ({
  type: actionLabels.SEARCH_REVENUE_FAIL,
  payload: error,
});

// GET REVENUE BY ID
export const getRevenueByIdAction = (revenueId) => {
  return {
    type: actionLabels.GET_REVENUE_BY_ID,
    payload: revenueId,
  };
};

export const getRevenueByIdActionSuccess = (revenueData) => {
  return {
    type: actionLabels.GET_REVENUE_BY_ID_SUCCESS,
    payload: revenueData,
  };
};

export const getRevenueByIdActionFail = (error) => ({
  type: actionLabels.GET_REVENUE_BY_ID_FAIL,
  payload: error,
});

// Action creator for uploading all documents
export const uploadAllDocumentsRevanueAction = () => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_REVENUE,
  };
};

export const uploadAllDocumentsRevanueSuccess = (documents) => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_REVENUE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsRevanueFail = (error) => ({
  type: actionLabels.UPLOAD_ALL_DOCUMENTS_REVENUE_FAIL,
  payload: error,
});

export const createEditRevenueApiStatus = (data) => {
  return {
    type: actionLabels.CREATE_EDIT_REVENUE_API_STATUS,
    payload: { data: data },
  };
};
