import * as actionTypes from "../../actionLabels/index";

// Action creator to get all tea types
export const getAllTeaTypes = (payload) => ({
  type: actionTypes.GET_ALL_TEA_TYPE,
  payload
});

export const getAllTeaTypesSuccess = (teaTypes) => ({
  type: actionTypes.GET_ALL_TEA_TYPE_SUCCESS,
  payload: teaTypes,
});

export const getAllTeaTypesFail = (error) => ({
  type: actionTypes.GET_ALL_TEA_TYPE_FAIL,
  payload: error,
});
export const getAllTeaTypesAsc = (payload) => ({
  type: actionTypes.GET_ALL_TEA_TYPE_ASC,
  payload: payload,
});

export const getAllTeaTypesAscSuccess = (teaTypes) => ({
  type: actionTypes.GET_ALL_TEA_TYPE_SUCCESS_ASC,
  payload: teaTypes,
});

export const getAllTeaTypesAscFail = (error) => ({
  type: actionTypes.GET_ALL_TEA_TYPE_FAIL_ASC,
  payload: error,
});
// Action creator to create a new tea type
export const createTeaType = (teaTypeData) => ({
  type: actionTypes.CREATE_TEA_TYPE,
  payload: teaTypeData,
});

export const createTeaTypeSuccess = () => ({
  type: actionTypes.CREATE_TEA_TYPE_SUCCESS,
});

export const createTeaTypeFail = (error) => ({
  type: actionTypes.CREATE_TEA_TYPE_FAIL,
  payload: error,
});

// Action creator to update a tea type
export const updateTeaType = (updatedData) => ({
  type: actionTypes.UPDATE_TEA_TYPE,
  payload: { updatedData },
});

export const updateTeaTypeSuccess = () => ({
  type: actionTypes.UPDATE_TEA_TYPE_SUCCESS,
});

export const updateTeaTypeFail = (error) => ({
  type: actionTypes.UPDATE_TEA_TYPE_FAIL,
  payload: error,
});

// Action creator to search for tea types based on criteria
export const searchTeaType = (searchCriteria) => ({
  type: actionTypes.SEARCH_TEA_TYPE,
  payload: searchCriteria,
});

export const searchTeaTypeSuccess = (searchResults) => ({
  type: actionTypes.SEARCH_TEA_TYPE_SUCCESS,
  payload: searchResults,
});

export const searchTeaTypeFail = (error) => ({
  type: actionTypes.SEARCH_TEA_TYPE_FAIL,
  payload: error,
});

// Action creator to get tea type by its ID
export const getTeaTypeById = (teaTypeId) => ({
  type: actionTypes.GET_TEA_TYPE_BY_ID,
  payload: teaTypeId,
});

export const getTeaTypeByIdSuccess = (teaType) => ({
  type: actionTypes.GET_TEA_TYPE_BY_ID_SUCCESS,
  payload: teaType,
});

export const getTeaTypeByIdFail = (error) => ({
  type: actionTypes.GET_TEA_TYPE_BY_ID_FAIL,
  payload: error,
});

// Action creator for uploading all documents
export const uploadAllDocumentsTeaTypeAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_TEA_TYPE,
  };
};

export const uploadAllDocumentsTeaTypeSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_TEA_TYPE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsTeaTypeFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_TEA_TYPE_FAIL,
  payload: error,
});

export const createEditTeaTypeApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_TEA_TYPE_API_STATUS,
    payload: { data: data },
  };
};
