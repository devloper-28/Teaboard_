import * as actionLabels from "../../actionLabels/index";

// GET ALL PLANTATION
export const getAllPlantationAction = () => {
  return {
    type: actionLabels.GET_ALL_PLANTATION,
  };
};

export const getAllPlantationActionSuccess = (plantations) => {
  return {
    type: actionLabels.GET_ALL_PLANTATION_SUCCESS,
    payload: plantations,
  };
};

export const getAllPlantationActionFail = (error) => ({
  type: actionLabels.GET_ALL_PLANTATION_FAIL,
  payload: error,
});

export const getAllPlantationAscAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_PLANTATION_ASC,
    payload: payload,
  };
};

export const getAllPlantationAscActionSuccess = (plantations) => {
  return {
    type: actionLabels.GET_ALL_PLANTATION_SUCCESS_ASC,
    payload: plantations,
  };
};

export const getAllPlantationAscActionFail = (error) => ({
  type: actionLabels.GET_ALL_PLANTATION_FAIL_ASC,
  payload: error,
});

// CREATE PLANTATION
export const createPlantationAction = (plantationData) => {
  return {
    type: actionLabels.CREATE_PLANTATION,
    payload: plantationData,
  };
};

export const createPlantationActionSuccess = () => {
  return {
    type: actionLabels.CREATE_PLANTATION_SUCCESS,
  };
};

export const createPlantationActionFail = (error) => ({
  type: actionLabels.CREATE_PLANTATION_FAIL,
  payload: error,
});

// UPDATE PLANTATION
export const updatePlantationAction = (plantationData) => {
  return {
    type: actionLabels.UPDATE_PLANTATION,
    payload: plantationData,
  };
};

export const updatePlantationActionSuccess = () => {
  return {
    type: actionLabels.UPDATE_PLANTATION_SUCCESS,
  };
};

export const updatePlantationActionFail = (error) => ({
  type: actionLabels.UPDATE_PLANTATION_FAIL,
  payload: error,
});

// SEARCH PLANTATION
export const searchPlantationAction = (searchCriteria) => {
  return {
    type: actionLabels.SEARCH_PLANTATION,
    payload: searchCriteria,
  };
};

export const searchPlantationActionSuccess = (searchResult) => {
  return {
    type: actionLabels.SEARCH_PLANTATION_SUCCESS,
    payload: searchResult,
  };
};

export const searchPlantationActionFail = (error) => ({
  type: actionLabels.SEARCH_PLANTATION_FAIL,
  payload: error,
});

// GET PLANTATION BY ID
export const getPlantationByIdAction = (plantationId) => {
  return {
    type: actionLabels.GET_PLANTATION_BY_ID,
    payload: plantationId,
  };
};

export const getPlantationByIdActionSuccess = (plantation) => {
  return {
    type: actionLabels.GET_PLANTATION_BY_ID_SUCCESS,
    payload: plantation,
  };
};

export const getPlantationByIdActionFail = (error) => ({
  type: actionLabels.GET_PLANTATION_BY_ID_FAIL,
  payload: error,
});

// Action creator for uploading all documents
export const uploadAllDocumentsPlantationAction = () => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_PLANTATION,
  };
};

export const uploadAllDocumentsPlantationSuccess = (documents) => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_PLANTATION_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsPlantationFail = (error) => ({
  type: actionLabels.UPLOAD_ALL_DOCUMENTS_PLANTATION_FAIL,
  payload: error,
});

export const createEditPlantationApiStatus = (data) => {
  return {
    type: actionLabels.CREATE_EDIT_PLANTATION_API_STATUS,
    payload: { data: data },
  };
};
