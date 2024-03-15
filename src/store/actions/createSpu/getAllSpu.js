import * as actionTypes from "../../actionLabels/index";

export const fetchSpu = () => {
  return {
    type: actionTypes.GET_ALL_SPU,
  };
};

export const fetchSpuSuccess = (getAllSpuActionSuccess) => {
  return {
    type: actionTypes.GET_ALL_SPU_SUCCESS,
    payload: getAllSpuActionSuccess,
  };
};

export const fetchSpuFail = (error) => {
  return {
    type: actionTypes.GET_ALL_SPU_FAIL,
    payload: error,
  };
};

export const getAllSpuWithStatusAction = () => {
  return {
    type: actionTypes.GET_ALL_SPU_WITH_STATUS,
  };
};

export const getAllSpuWithStatusActionSuccess = (getAllSpuWithStatus) => {
  return {
    type: actionTypes.GET_ALL_SPU_WITH_STATUS_SUCCESS,
    payload: getAllSpuWithStatus,
  };
};

export const getAllSpuWithStatusActionFail = (error) => ({
  type: actionTypes.GET_ALL_SPU_WITH_STATUS_FAIL,
  payload: error,
});

export const createSpuAction = (newSpuData) => {
  return {
    type: actionTypes.CREATE_SPU,
    payload: newSpuData,
  };
};

export const createSpuActionSuccess = (createdSpu) => {
  return {
    type: actionTypes.CREATE_SPU_SUCCESS,
    payload: createdSpu,
  };
};

export const createSpuActionFail = (error) => ({
  type: actionTypes.CREATE_SPU_FAIL,
  payload: error,
});

export const updateSpuAction = (updatedSpuData) => {
  return {
    type: actionTypes.UPDATE_SPU,
    payload: {
      updatedSpuData,
    },
  };
};

export const updateSpuActionSuccess = (updatedSpu) => {
  return {
    type: actionTypes.UPDATE_SPU_SUCCESS,
    payload: updatedSpu,
  };
};

export const updateSpuActionFail = (error) => ({
  type: actionTypes.UPDATE_SPU_FAIL,
  payload: error,
});

export const searchSpuAction = (searchTerm) => {
  return {
    type: actionTypes.SEARCH_SPU,
    payload: searchTerm,
  };
};

export const searchSpuActionSuccess = (searchResults) => {
  return {
    type: actionTypes.SEARCH_SPU_SUCCESS,
    payload: searchResults,
  };
};

export const searchSpuActionFail = (error) => ({
  type: actionTypes.SEARCH_SPU_FAIL,
  payload: error,
});

export const getSpuByIdAction = (spuMasterId) => {
  return {
    type: actionTypes.GET_SPU_BY_ID,
    payload: spuMasterId,
  };
};

export const getSpuByIdActionSuccess = (SpuData) => {
  return {
    type: actionTypes.GET_SPU_BY_ID_SUCCESS,
    payload: SpuData,
  };
};

export const getSpuByIdActionFail = (error) => ({
  type: actionTypes.GET_SPU_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsSpuAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_SPU,
  };
};

export const uploadAllDocumentsSpuSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_SPU_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsSpuFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_SPU_FAIL,
  payload: error,
});

export const createEditSpuApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_SPU_API_STATUS,
    payload: { data: data },
  };
};
