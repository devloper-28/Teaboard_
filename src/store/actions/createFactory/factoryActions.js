import * as actionTypes from "../../actionLabels/index";

// Action creator to get all factory types
export const getAllFactoryTypes = () => ({
  type: actionTypes.GET_ALL_FACTORY_TYPES,
});

export const getAllFactoryTypesSuccess = (factoryTypes) => ({
  type: actionTypes.GET_ALL_FACTORY_TYPES_SUCCESS,
  payload: factoryTypes,
});

export const getAllFactoryTypesFail = (error) => ({
  type: actionTypes.GET_ALL_FACTORY_TYPES_FAIL,
  payload: error,
});

export const getAllFactoryAscTypes = (payload) => ({
  type: actionTypes.GET_ALL_FACTORY_TYPES_ASC,
  payload: payload,
});

export const getAllFactoryAscTypesSuccess = (factoryTypes) => ({
  type: actionTypes.GET_ALL_FACTORY_TYPES_SUCCESS_ASC,
  payload: factoryTypes,
});

export const getAllFactoryAscTypesFail = (error) => ({
  type: actionTypes.GET_ALL_FACTORY_TYPES_FAIL_ASC,
  payload: error,
});

// Action creator to create a new factory type
export const createFactoryType = (factoryTypeData) => ({
  type: actionTypes.CREATE_FACTORY_TYPE,
  payload: factoryTypeData,
});

export const createFactoryTypeSuccess = () => ({
  type: actionTypes.CREATE_FACTORY_TYPE_SUCCESS,
});

export const createFactoryTypeFail = (error) => ({
  type: actionTypes.CREATE_FACTORY_TYPE_FAIL,
  payload: error,
});

// Action creator to update a factory type
export const updateFactoryType = (updatedData) => ({
  type: actionTypes.UPDATE_FACTORY_TYPE,
  payload: { updatedData },
});

export const updateFactoryTypeSuccess = () => ({
  type: actionTypes.UPDATE_FACTORY_TYPE_SUCCESS,
});

export const updateFactoryTypeFail = (error) => ({
  type: actionTypes.UPDATE_FACTORY_TYPE_FAIL,
  payload: error,
});

// Action creator to search for factory types based on criteria
export const searchFactoryType = (searchCriteria) => ({
  type: actionTypes.SEARCH_FACTORY_TYPE,
  payload: searchCriteria,
});

export const searchFactoryTypeSuccess = (searchResults) => ({
  type: actionTypes.SEARCH_FACTORY_TYPE_SUCCESS,
  payload: searchResults,
});

export const searchFactoryTypeFail = (error) => ({
  type: actionTypes.SEARCH_FACTORY_TYPE_FAIL,
  payload: error,
});

// Action creator to get factory type by its ID
export const getFactoryTypeById = (factoryTypeId) => ({
  type: actionTypes.GET_FACTORY_TYPE_BY_ID,
  payload: factoryTypeId,
});

export const getFactoryTypeByIdSuccess = (factoryType) => ({
  type: actionTypes.GET_FACTORY_TYPE_BY_ID_SUCCESS,
  payload: factoryType,
});

export const getFactoryTypeByIdFail = (error) => ({
  type: actionTypes.GET_FACTORY_TYPE_BY_ID_FAIL,
  payload: error,
});
// Action creator for uploading all documents
export const uploadAllDocumentsFactoryTypeAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_FACTORY_TYPE,
  };
};

export const uploadAllDocumentsFactoryTypeSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_FACTORY_TYPE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsFactoryTypeFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_FACTORY_TYPE_FAIL,
  payload: error,
});

export const createEditFactoryTypeApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_FACTORY_TYPE_API_STATUS,
    payload: { data: data },
  };
};
