import * as actionTypes from "../../actionLabels/createRole/roleActionLable";

// Action creator for getting all roles
export const getAllRoles = () => ({
  type: actionTypes.GET_ALL_ROLES,
});

export const getAllRolesSuccess = (roles) => ({
  type: actionTypes.GET_ALL_ROLES_SUCCESS,
  payload: roles,
});

export const getAllRolesFail = (error) => ({
  type: actionTypes.GET_ALL_ROLES_FAIL,
  payload: error,
});

export const getAllRolesAsc = (payload) => ({
  type: actionTypes.GET_ALL_ROLES_ASC,
  payload: payload,
});

export const getAllRolesAscSuccess = (roles) => ({
  type: actionTypes.GET_ALL_ROLES_SUCCESS_ASC,
  payload: roles,
});

export const getAllRolesAscFail = (error) => ({
  type: actionTypes.GET_ALL_ROLES_FAIL_ASC,
  payload: error,
});

// Action creator for creating a new role
export const createRole = (roleData) => ({
  type: actionTypes.CREATE_ROLE,
  payload: { roleData },
});

export const createRoleSuccess = () => ({
  type: actionTypes.CREATE_ROLE_SUCCESS,
});

export const createRoleFail = (error) => ({
  type: actionTypes.CREATE_ROLE_FAIL,
  payload: error,
});

// Action creator for updating a role
export const updateRole = (updatedData) => ({
  type: actionTypes.UPDATE_ROLE,
  payload: { updatedData },
});

export const updateRoleSuccess = () => ({
  type: actionTypes.UPDATE_ROLE_SUCCESS,
});

export const updateRoleFail = (error) => ({
  type: actionTypes.UPDATE_ROLE_FAIL,
  payload: error,
});

// Action creator for searching roles based on criteria
export const searchRole = (searchCriteria) => ({
  type: actionTypes.SEARCH_ROLE,
  payload: { searchCriteria },
});

export const searchRoleSuccess = (searchResults) => ({
  type: actionTypes.SEARCH_ROLE_SUCCESS,
  payload: searchResults,
});

export const searchRoleFail = (error) => ({
  type: actionTypes.SEARCH_ROLE_FAIL,
  payload: error,
});

// Action creator for getting a role by ID
export const getRoleById = (roleId) => ({
  type: actionTypes.GET_ROLE_BY_ID,
  payload: { roleId },
});

export const getRoleByIdSuccess = (role) => ({
  type: actionTypes.GET_ROLE_BY_ID_SUCCESS,
  payload: role,
});

export const getRoleByIdFail = (error) => ({
  type: actionTypes.GET_ROLE_BY_ID_FAIL,
  payload: error,
});
// Action creator for uploading all documents
export const uploadAllDocumentsRoleAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_ROLE,
  };
};

export const uploadAllDocumentsRoleSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_ROLE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsRoleFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_ROLE_FAIL,
  payload: error,
});

export const createEditRoleApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_ROLE_API_STATUS,
    payload: { data: data },
  };
};
// Manage Roles
export const fetchUserDetailsRequest = (roleCode, auctionCenterId) => ({
  type: actionTypes.FETCH_USER_DETAILS_REQUEST,
  payload: { roleCode, auctionCenterId },
});

export const fetchUserDetailsSuccess = (responseData) => ({
  type: actionTypes.FETCH_USER_DETAILS_SUCCESS,
  payload: responseData,
});

export const fetchUserDetailsFailure = (error) => ({
  type: actionTypes.FETCH_USER_DETAILS_FAILURE,
  payload: error,
});

export const setSelectedUserId = (userId) => ({
  type: actionTypes.SET_SELECTED_USER_ID,
  payload: userId,
});

export const fetchRoleListRequest = () => ({
  type: actionTypes.FETCH_ROLE_LIST_REQUEST,
});

export const fetchRoleListSuccess = (responseData) => ({
  type: actionTypes.FETCH_ROLE_LIST_SUCCESS,
  payload: responseData,
});

export const fetchRoleListFailure = (error) => ({
  type: actionTypes.FETCH_ROLE_LIST_FAILURE,
  payload: error,
});

export const setSelectedRoleId = (roleId) => ({
  type: actionTypes.SET_SELECTED_ROLE_ID,
  payload: roleId,
});

export const fetchRightsRequest = () => ({
  type: actionTypes.FETCH_RIGHTS_REQUEST,
});

export const fetchRightsSuccess = (data) => ({
  type: actionTypes.FETCH_RIGHTS_SUCCESS,
  payload: data,
});

export const fetchRightsFailure = (error) => ({
  type: actionTypes.FETCH_RIGHTS_FAILURE,
  payload: error,
});

export const saveRightsRequest = (requestData) => ({
  type: actionTypes.SAVE_RIGHTS_REQUEST,
  payload: requestData,
});

export const saveRightsSuccess = (response) => ({
  type: actionTypes.SAVE_RIGHTS_SUCCESS,
  payload: response,
});

export const saveRightsFailure = (error) => ({
  type: actionTypes.SAVE_RIGHTS_FAILURE,
  payload: error,
});

export const fetchSaveRightsByAuctionCenterIdAndUserId = (data) => ({
  type: actionTypes.FETCH_SAVE_RIGHTS_BY_AUCTION_CENTER_ID_AND_USER_ID,
  payload: data,
});

export const createEditRightsApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_RIGHTS_API_STATUS,
    payload: { data: data },
  };
};

export const getRoleApiStatus = (data) => {
  return {
    type: actionTypes.GET_ROLE_API_STATUS,
    payload: { data: data },
  };
};
