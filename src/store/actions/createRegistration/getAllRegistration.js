import * as actionTypes from "../../actionLabels/index";

export const fetchUser = () => {
  {
  }
  return {
    type: actionTypes.GET_ALL_USER_RE,
  };
};

export const fetchUserSuccess = (getAllUserActionSuccess) => {
  return {
    type: actionTypes.GET_ALL_USER_RE_SUCCESS,
    payload: getAllUserActionSuccess,
  };
};

export const fetchUserFail = (error) => {
  return {
    type: actionTypes.GET_ALL_USER_RE_FAIL,
    payload: error,
  };
};
export const getAllUserWithStatusAction = () => {
  return {
    type: actionTypes.GET_ALL_USER_RE_WITH_STATUS,
  };
};

export const getAllUserWithStatusActionSuccess = (getAllUserWithStatus) => {
  return {
    type: actionTypes.GET_ALL_USER_RE_WITH_STATUS_SUCCESS,
    payload: getAllUserWithStatus,
  };
};

export const getAllUserWithStatusActionFail = (error) => ({
  type: actionTypes.GET_ALL_USER_RE_WITH_STATUS_FAIL,
  payload: error,
});

export const createUserAction = (newUserData) => {
  return {
    type: actionTypes.CREATE_USER_RE,
    payload: newUserData,
  };
};

export const createUserActionSuccess = (createdUser) => {
  return {
    type: actionTypes.CREATE_USER_RE_SUCCESS,
    payload: createdUser,
  };
};

export const createUserActionFail = (error) => ({
  type: actionTypes.CREATE_USER_RE_FAIL,
  payload: error,
});

export const updateUserAction = (updatedUserData) => {
  return {
    type: actionTypes.UPDATE_USER_RE,
    payload: {
      updatedUserData,
    },
  };
};

export const updateUserActionSuccess = (updatedUser) => {
  return {
    type: actionTypes.UPDATE_USER_RE_SUCCESS,
    payload: updatedUser,
  };
};

export const updateUserActionFail = (error) => ({
  type: actionTypes.UPDATE_USER_RE_FAIL,
  payload: error,
});

export const searchUserAction = (searchTerm) => {
  return {
    type: actionTypes.SEARCH_USER_RE,
    payload: searchTerm,
  };
};

export const searchUserActionSuccess = (searchResults) => {
  return {
    type: actionTypes.SEARCH_USER_RE_SUCCESS,
    payload: searchResults,
  };
};

export const searchUserActionFail = (error) => ({
  type: actionTypes.SEARCH_USER_RE_FAIL,
  payload: error,
});

export const getUserByIdAction = (userId) => {
  return {
    type: actionTypes.GET_USER_RE_BY_ID,
    payload: userId,
  };
};

export const getUserByIdActionSuccess = (UserData) => {
  return {
    type: actionTypes.GET_USER_RE_BY_ID_SUCCESS,
    payload: UserData,
  };
};

export const getUserByIdActionFail = (error) => ({
  type: actionTypes.GET_USER_RE_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsUserAction = (role) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_USER_RE,
    payload: role,
  };
};

export const uploadAllDocumentsUserSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_USER_RE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsUserFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_USER_RE_FAIL,
  payload: error,
});

export const createEditApiUser = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_API_USER,
    payload: { data: data },
  };
};
export const getChildUser = (payloadAucData) => {
  return {
    type: actionTypes.GET_ALL_CHILD_USER,
    payload: payloadAucData,
  };
};
export const getChildUserSuccess = (AucData) => {
  return {
    type: actionTypes.GET_ALL_CHILD_USER_SUCCESS,
    payload: AucData,
  };
};

export const getChildUserFail = (error) => {
  return {
    type: actionTypes.GET_ALL_CHILD_USER_FAIL,
    payload: error,
  };
};
export const createChildAucAction = (newAucData) => {
  return {
    type: actionTypes.CREATE_CHILD_AUCTIONEER,
    payload: newAucData,
  };
};

export const createChildAucActionSuccess = (createdAuc) => {
  return {
    type: actionTypes.CREATE_CHILD_AUCTIONEER_SUCCESS,
    payload: createdAuc,
  };
};

export const createChildAucActionFail = (error) => ({
  type: actionTypes.CREATE_CHILD_AUCTIONEER_FAIL,
  payload: error,
});

export const updateChildAucAction = (updatedAucData) => {
  return {
    type: actionTypes.UPDATE_CHILD_AUCTIONEER,
    payload: 
      updatedAucData,
  };
};

export const updateChildAucActionSuccess = (updatedAuc) => {
  return {
    type: actionTypes.UPDATE_CHILD_AUCTIONEER_SUCCESS,
    payload: updatedAuc,
  };
};

export const updateChildAucActionFail = (error) => ({
  type: actionTypes.UPDATE_CHILD_AUCTIONEER_FAIL,
  payload: error,
});

export const getChildAucByIdAction = (AucId) => {
  return {
    type: actionTypes.GET_CHILD_AUCTIONEER_BY_ID,
    payload: AucId,
  };
};

export const getChildAucByIdActionSuccess = (AucData) => {
  return {
    type: actionTypes.GET_CHILD_AUCTIONEER_BY_ID_SUCCESS,
    payload: AucData,
  };
};

export const getChildAucByIdActionFail = (error) => ({
  type: actionTypes.GET_CHILD_AUCTIONEER_BY_ID_FAIL,
  payload: error,
});

