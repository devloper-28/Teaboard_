import * as actionTypes from "../../actionLabels/createPackageType/createPackageType";

export const getpackageType = (payloadpackageTypeData) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_TYPE,
    payload: payloadpackageTypeData,
  };
};

export const getpackageTypeSuccess = (packageTypeData) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_TYPE_SUCCESS,
    payload: packageTypeData,
  };
 
};

export const getpackageTypeFail = (error) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_TYPE_FAIL,
    payload: error,
  };
};

// Action creator for creating a packageType
export const createpackageTypeAction = (newpackageTypeData) => {
  return {
    type: actionTypes.CREATE_PACKAGE_TYPE,
    payload: newpackageTypeData,
  };
};

export const createpackageTypeActionSuccess = (createdpackageType) => {
  return {
    type: actionTypes.CREATE_PACKAGE_TYPE_SUCCESS,
    payload: createdpackageType,
  };
};

export const createpackageTypeActionFail = (error) => ({
  type: actionTypes.CREATE_PACKAGE_TYPE_FAIL,
  payload: error,
});

// Action creator for updating a packageType
export const updatepackageTypeAction = (updatedpackageTypeData) => {
  return {
    type: actionTypes.UPDATE_PACKAGE_TYPE,
    payload: {
      updatedpackageTypeData,
    },
  };
};

export const updatepackageTypeActionSuccess = (updatedpackageType) => {
  return {
    type: actionTypes.UPDATE_PACKAGE_TYPE_SUCCESS,
    payload: updatedpackageType,
  };
};

export const updatepackageTypeActionFail = (error) => ({
  type: actionTypes.UPDATE_PACKAGE_TYPE_FAIL,
  payload: error,
});


// Action creator for getting state by packageType ID
export const getpackageTypeByIdAction = (packageTypeId) => {
  return {
    type: actionTypes.GET_PACKAGE_TYPE_BY_ID,
    payload: packageTypeId,
  };
};

export const getpackageTypeByIdActionSuccess = (packageTypeData) => {
  return {
    type: actionTypes.GET_PACKAGE_TYPE_BY_ID_SUCCESS,
    payload: packageTypeData,
  };
};

export const getpackageTypeByIdActionFail = (error) => ({
  type: actionTypes.GET_PACKAGE_TYPE_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentspackageTypeAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_PACKAGE_TYPE,
  };
};

export const uploadAllDocumentspackageTypeSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_PACKAGE_TYPE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentspackageTypeFail = (error) => (
  {
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_PACKAGE_TYPE_FAIL,
  payload: error,
}
);


export const getpackageTypeWithoutFilter = (payloadpackageTypeData) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_TYPE_WITHOUT_FILTER,
    payload: payloadpackageTypeData,
  };
};

export const getpackageTypeSuccessWithoutFilter = (packageTypeData) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_TYPE_WITHOUT_FILTER_SUCCESS,
    payload: packageTypeData,
  };
};

export const getpackageTypeFailWithoutFilter = (error) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_TYPE_WITHOUT_FILTER_FAIL,
    payload: error,
  };
};

export const createEditApiStatuspackageType = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_API_STATUS_PACKAGE_TYPE,
    payload: { data: data },
  };
};