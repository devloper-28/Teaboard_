import * as actionTypes from "../../actionLabels/createPackageSize/createPackageSize";

export const getpackageSize = (payloadpackageSizeData) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_SIZE,
    payload: payloadpackageSizeData,
  };
};

export const getpackageSizeSuccess = (packageSizeData) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_SIZE_SUCCESS,
    payload: packageSizeData,
  };
 
};

export const getpackageSizeFail = (error) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_SIZE_FAIL,
    payload: error,
  };
};

// Action creator for creating a packageSize
export const createpackageSizeAction = (newpackageSizeData) => {
  return {
    type: actionTypes.CREATE_PACKAGE_SIZE,
    payload: newpackageSizeData,
  };
};

export const createpackageSizeActionSuccess = (createdpackageSize) => {
  return {
    type: actionTypes.CREATE_PACKAGE_SIZE_SUCCESS,
    payload: createdpackageSize,
  };
};

export const createpackageSizeActionFail = (error) => ({
  type: actionTypes.CREATE_PACKAGE_SIZE_FAIL,
  payload: error,
});

// Action creator for updating a packageSize
export const updatepackageSizeAction = (updatedpackageSizeData) => {
  return {
    type: actionTypes.UPDATE_PACKAGE_SIZE,
    payload: {
      updatedpackageSizeData,
    },
  };
};

export const updatepackageSizeActionSuccess = (updatedpackageSize) => {
  return {
    type: actionTypes.UPDATE_PACKAGE_SIZE_SUCCESS,
    payload: updatedpackageSize,
  };
};

export const updatepackageSizeActionFail = (error) => ({
  type: actionTypes.UPDATE_PACKAGE_SIZE_FAIL,
  payload: error,
});


// Action creator for getting state by packageSize ID
export const getpackageSizeByIdAction = (packageSizeId) => {
  return {
    type: actionTypes.GET_PACKAGE_SIZE_BY_ID,
    payload: packageSizeId,
  };
};

export const getpackageSizeByIdActionSuccess = (packageSizeData) => {
  return {
    type: actionTypes.GET_PACKAGE_SIZE_BY_ID_SUCCESS,
    payload: packageSizeData,
  };
};

export const getpackageSizeByIdActionFail = (error) => ({
  type: actionTypes.GET_PACKAGE_SIZE_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentspackageSizeAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_PACKAGE_SIZE,
  };
};

export const uploadAllDocumentspackageSizeSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_PACKAGE_SIZE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentspackageSizeFail = (error) => (
  {
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_PACKAGE_SIZE_FAIL,
  payload: error,
}
);


export const getpackageSizeWithoutFilter = (payloadpackageSizeData) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_SIZE_WITHOUT_FILTER,
    payload: payloadpackageSizeData,
  };
};

export const getpackageSizeSuccessWithoutFilter = (packageSizeData) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_SIZE_WITHOUT_FILTER_SUCCESS,
    payload: packageSizeData,
  };
};

export const getpackageSizeFailWithoutFilter = (error) => {
  return {
    type: actionTypes.GET_ALL_PACKAGE_SIZE_WITHOUT_FILTER_FAIL,
    payload: error,
  };
};

export const createEditApiStatuspackageSize = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_API_STATUS_PACKAGE_SIZE,
    payload: { data: data },
  };
};