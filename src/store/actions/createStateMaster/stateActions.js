import * as actionLabels from "../../actionLabels";

// GET ALL STATE LIST
export const getAllStateAction = () => {
  return {
    type: actionLabels.GET_ALL_STATE,
  };
};

export const getAllStateActionSuccess = (getAllState) => {
  return {
    type: actionLabels.GET_ALL_STATE_SUCCESS,
    payload: getAllState,
  };
};

export const getAllStateActionFail = (error) => ({
  type: actionLabels.GET_ALL_STATE_FAIL,
  payload: error,
});

export const getAllStateAscAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_STATE_ASC,
    payload: payload,
  };
};

export const getAllStateAscActionSuccess = (getAllStateAsc) => {
  return {
    type: actionLabels.GET_ALL_STATE_SUCCESS_ASC,
    payload: getAllStateAsc,
  };
};

export const getAllStateAscActionFail = (error) => ({
  type: actionLabels.GET_ALL_STATE_FAIL_ASC,
  payload: error,
});

// Action creator for creating a state
export const createStateAction = (newStateData) => {
  return {
    type: actionLabels.CREATE_STATE,
    payload: newStateData,
  };
};

export const createStateActionSuccess = (createdState) => {
  return {
    type: actionLabels.CREATE_STATE_SUCCESS,
    payload: createdState,
  };
};

export const createStateActionFail = (error) => ({
  type: actionLabels.CREATE_STATE_FAIL,
  payload: error,
});

// Action creator for updating a state
export const updateStateAction = (updatedStateData) => {
  return {
    type: actionLabels.UPDATE_STATE,
    payload: {
      updatedStateData,
    },
  };
};

export const updateStateActionSuccess = (updatedState) => {
  return {
    type: actionLabels.UPDATE_STATE_SUCCESS,
    payload: updatedState,
  };
};

export const updateStateActionFail = (error) => ({
  type: actionLabels.UPDATE_STATE_FAIL,
  payload: error,
});

// Action creator for searching a state
export const searchStateAction = (searchTerm) => {
  return {
    type: actionLabels.SEARCH_STATE,
    payload: searchTerm,
  };
};

export const searchStateActionSuccess = (searchResults) => {
  return {
    type: actionLabels.SEARCH_STATE_SUCCESS,
    payload: searchResults,
  };
};

export const searchStateActionFail = (error) => ({
  type: actionLabels.SEARCH_STATE_FAIL,
  payload: error,
});

// Action creator for getting state by state ID
export const getStateByIdAction = (stateId) => {
  return {
    type: actionLabels.GET_STATE_BY_ID,
    payload: stateId,
  };
};

export const getStateByIdActionSuccess = (stateData) => {
  return {
    type: actionLabels.GET_STATE_BY_ID_SUCCESS,
    payload: stateData,
  };
};

export const getStateByIdActionFail = (error) => ({
  type: actionLabels.GET_STATE_BY_ID_FAIL,
  payload: error,
});
// Action creator for uploading all documents
export const uploadAllDocumentsStateAction = () => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_STATE,
  };
};

export const uploadAllDocumentsStateSuccess = (documents) => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_STATE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsStateFail = (error) => ({
  type: actionLabels.UPLOAD_ALL_DOCUMENTS_STATE_FAIL,
  payload: error,
});

export const createEditApiStatus = (data) => {
  return {
    type: actionLabels.CREATE_EDIT_API_STATUS,
    payload: { data: data },
  };
};
