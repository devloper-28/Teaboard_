import * as actionTypes from "../../actionLabels/index";

export const fetchTaoUser = () => {
  {
  }
  return {
    type: actionTypes.GET_ALL_TAO_USER,
  };
};

export const fetchTaoUserSuccess = (getAllTaoUserActionSuccess) => {
  return {
    type: actionTypes.GET_ALL_TAO_USER_SUCCESS,
    payload: getAllTaoUserActionSuccess,
  };
};

export const fetchTaoUserFail = (error) => {
  return {
    type: actionTypes.GET_ALL_TAO_USER_FAIL,
    payload: error,
  };
};
export const getAllTaoUserWithStatusAction = () => {
  return {
    type: actionTypes.GET_ALL_TAO_USER_WITH_STATUS,
  };
};

export const getAllTaoUserWithStatusActionSuccess = (
  getAllTaoUserWithStatus
) => {
  return {
    type: actionTypes.GET_ALL_TAO_USER_WITH_STATUS_SUCCESS,
    payload: getAllTaoUserWithStatus,
  };
};

export const getAllTaoUserWithStatusActionFail = (error) => ({
  type: actionTypes.GET_ALL_TAO_USER_WITH_STATUS_FAIL,
  payload: error,
});

export const createTaoUserAction = (newUserData) => {
  return {
    type: actionTypes.CREATE_TAO_USER,
    payload: newUserData,
  };
};

export const createTaoUserActionSuccess = (createdUser) => {
  return {
    type: actionTypes.CREATE_TAO_USER_SUCCESS,
    payload: createdUser,
  };
};

export const createTaoUserActionFail = (error) => ({
  type: actionTypes.CREATE_TAO_USER_FAIL,
  payload: error,
});

export const updateTaoUserAction = (updatedUserData) => {
  return {
    type: actionTypes.UPDATE_TAO_USER,
    payload: {
      updatedUserData,
    },
  };
};

export const updateTaoUserActionSuccess = (updatedUser) => {
  return {
    type: actionTypes.UPDATE_TAO_USER_SUCCESS,
    payload: updatedUser,
  };
};

export const updateTaoUserActionFail = (error) => ({
  type: actionTypes.UPDATE_TAO_USER_FAIL,
  payload: error,
});

export const searchTaoUserAction = (searchTerm) => {
  return {
    type: actionTypes.SEARCH_TAO_USER,
    payload: searchTerm,
  };
};

export const searchTaoUserActionSuccess = (searchResults) => {
  return {
    type: actionTypes.SEARCH_TAO_USER_SUCCESS,
    payload: searchResults,
  };
};

export const searchTaoUserActionFail = (error) => ({
  type: actionTypes.SEARCH_TAO_USER_FAIL,
  payload: error,
});

export const getTaoUserByIdAction = (userId) => {
  return {
    type: actionTypes.GET_TAO_USER_BY_ID,
    payload: userId,
  };
};

export const getTaoUserByIdActionSuccess = (UserData) => {
  return {
    type: actionTypes.GET_TAO_USER_BY_ID_SUCCESS,
    payload: UserData,
  };
};

export const getTaoUserByIdActionFail = (error) => ({
  type: actionTypes.GET_TAO_USER_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsTaoUserAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_TAO_USER,
  };
};

export const uploadAllDocumentsTaoUserSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_TAO_USER_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsTaoUserFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_TAO_USER_FAIL,
  payload: error,
});

export const createEditApiTaoUser = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_API_TAO_USERRGG,
    payload: { data: data },
  };
};
