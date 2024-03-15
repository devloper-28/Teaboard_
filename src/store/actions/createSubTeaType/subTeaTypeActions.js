import * as actionLabels from "../../actionLabels/index";

// Action creator to get all sub tea types
export const getAllSubTeaTypes = () => {
  return {
    type: actionLabels.GET_ALL_SUB_TEA_TYPES,
  };
};

export const getAllSubTeaTypesSuccess = (subTeaTypes) => {
  return {
    type: actionLabels.GET_ALL_SUB_TEA_TYPES_SUCCESS,
    payload: subTeaTypes,
  };
};

export const getAllSubTeaTypesFail = (error) => ({
  type: actionLabels.GET_ALL_SUB_TEA_TYPES_FAIL,
  payload: error,
});
// Action creator to create a new sub tea type
export const createSubTeaType = (subTeaTypeData) => {
  return {
    type: actionLabels.CREATE_SUB_TEA_TYPE,
    payload: {
      subTeaTypeData,
    },
  };
};

export const createSubTeaTypeSuccess = () => {
  return {
    type: actionLabels.CREATE_SUB_TEA_TYPE_SUCCESS,
  };
};

export const createSubTeaTypeFail = (error) => ({
  type: actionLabels.CREATE_SUB_TEA_TYPE_FAIL,
  payload: error,
});
// Action creator to update a sub tea type
export const updateSubTeaType = (updatedData) => {
  return {
    type: actionLabels.UPDATE_SUB_TEA_TYPE,
    payload: {
      updatedData,
    },
  };
};

export const updateSubTeaTypeSuccess = () => {
  return {
    type: actionLabels.UPDATE_SUB_TEA_TYPE_SUCCESS,
  };
};

export const updateSubTeaTypeFail = (error) => ({
  type: actionLabels.UPDATE_SUB_TEA_TYPE_FAIL,
  payload: error,
});
// Action creator to search for sub tea types based on criteria
export const searchSubTeaType = (searchCriteria) => {
  return {
    type: actionLabels.SEARCH_SUB_TEA_TYPE,
    payload: {
      searchCriteria,
    },
  };
};

export const searchSubTeaTypeSuccess = (searchResults) => {
  return {
    type: actionLabels.SEARCH_SUB_TEA_TYPE_SUCCESS,
    payload: searchResults,
  };
};

export const searchSubTeaTypeFail = (error) => ({
  type: actionLabels.SEARCH_SUB_TEA_TYPE_FAIL,
  payload: error,
});

// Action creator to get sub tea type by ID
export const getSubTeaTypeById = (subTeaTypeId) => {
  return {
    type: actionLabels.GET_SUB_TEA_TYPE_BY_ID,
    payload: {
      subTeaTypeId,
    },
  };
};

export const getSubTeaTypeByIdSuccess = (subTeaType) => {
  return {
    type: actionLabels.GET_SUB_TEA_TYPE_BY_ID_SUCCESS,
    payload: subTeaType,
  };
};

export const getSubTeaTypeByIdFail = (error) => ({
  type: actionLabels.GET_SUB_TEA_TYPE_BY_ID_FAIL,
  payload: error,
});

// Action creator for uploading all documents
export const uploadAllDocumentsSubTeaTypeAction = () => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_SUB_TEA_TYPE,
  };
};

export const uploadAllDocumentsSubTeaTypeSuccess = (documents) => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_SUB_TEA_TYPE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsSubTeaTypeFail = (error) => ({
  type: actionLabels.UPLOAD_ALL_DOCUMENTS_SUB_TEA_TYPE_FAIL,
  payload: error,
});

export const createEditSubTeaTypeApiStatus = (data) => {
  return {
    type: actionLabels.CREATE_EDIT_SUB_TEA_TYPE_API_STATUS,
    payload: { data: data },
  };
};
