import * as actionTypes from "../../actionLabels/index";

export const fetchUserRgg = () => {
  {
  }
  return {
    type: actionTypes.GET_ALL_USER,
  };
};

export const fetchUserRggSuccess = (getAllUSERActionSuccess) => {
  return {
    type: actionTypes.GET_ALL_USER_SUCCESS,
    payload: getAllUSERActionSuccess,
  };
};

export const fetchUserRggFail = (error) => {
  return {
    type: actionTypes.GET_ALL_USER_FAIL,
    payload: error,
  };
};
export const getAllUserRggWithStatusAction = () => {
  return {
    type: actionTypes.GET_ALL_USER_WITH_STATUS,
  };
};

export const getAllUserRggWithStatusActionSuccess = (getAllUserWithStatus) => {
  return {
    type: actionTypes.GET_ALL_USER_WITH_STATUS_SUCCESS,
    payload: getAllUserWithStatus,
  };
};

export const getAllUserRggWithStatusActionFail = (error) => ({
  type: actionTypes.GET_ALL_USER_WITH_STATUS_FAIL,
  payload: error,
});

export const createUserRggAction = (newUserData) => {
  return {
    type: actionTypes.CREATE_USER,
    payload: newUserData,
  };
};

export const createUserRggActionSuccess = (createdUser) => {
  return {
    type: actionTypes.CREATE_USER_SUCCESS,
    payload: createdUser,
  };
};

export const createUserRggActionFail = (error) => ({
  type: actionTypes.CREATE_USER_FAIL,
  payload: error,
});

export const updateUserRggAction = (updatedUserData) => {
  return {
    type: actionTypes.UPDATE_USER,
    payload: {
      updatedUserData,
    },
  };
};

export const updateUserRggActionSuccess = (updatedUser) => {
  return {
    type: actionTypes.UPDATE_USER_SUCCESS,
    payload: updatedUser,
  };
};

export const updateUserRggActionFail = (error) => ({
  type: actionTypes.UPDATE_USER_FAIL,
  payload: error,
});

export const searchUserRggAction = (searchTerm) => {
  return {
    type: actionTypes.SEARCH_USER,
    payload: searchTerm,
  };
};

export const searchUserRggActionSuccess = (searchResults) => {
  return {
    type: actionTypes.SEARCH_USER_SUCCESS,
    payload: searchResults,
  };
};

export const searchUserRggActionFail = (error) => ({
  type: actionTypes.SEARCH_USER_FAIL,
  payload: error,
});

export const getUserRggByIdAction = (userId) => {
  return {
    type: actionTypes.GET_USER_BY_ID,
    payload: userId,
  };
};

export const getUserRggByIdActionSuccess = (UserData) => {
  return {
    type: actionTypes.GET_USER_BY_ID_SUCCESS,
    payload: UserData,
  };
};

export const getUserRggByIdActionFail = (error) => ({
  type: actionTypes.GET_USER_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsUserRggAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_USER,
  };
};

export const uploadAllDocumentsUserRggSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_USER_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsUserRggFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_USER_FAIL,
  payload: error,
});

export const createEditApiUserRgg = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_API_USERRGG,
    payload: { data: data },
  };
};
