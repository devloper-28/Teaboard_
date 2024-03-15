import * as actionTypes from "../../actionLabels/index";

export const fetchRuleEngine = () => {
  {
  }
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE,
  };
};

export const fetchRuleEngineSuccess = (getAllRuleEngineActionSuccess) => {
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_SUCCESS,
    payload: getAllRuleEngineActionSuccess,
  };
};

export const fetchRuleEngineFail = (error) => {
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_FAIL,
    payload: error,
  };
};
export const getAllRuleEngineWithStatusAction = () => {
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_WITH_STATUS,
  };
};

export const getAllRuleEngineWithStatusActionSuccess = (
  getAllRuleEngineWithStatus
) => {
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_WITH_STATUS_SUCCESS,
    payload: getAllRuleEngineWithStatus,
  };
};

export const getAllRuleEngineWithStatusActionFail = (error) => ({
  type: actionTypes.GET_ALL_RULE_ENGINE_WITH_STATUS_FAIL,
  payload: error,
});

export const createRuleEngineAction = (newUserData) => {
  return {
    type: actionTypes.CREATE_RULE_ENGINE,
    payload: newUserData,
  };
};

export const createRuleEngineActionSuccess = (createdUser) => {
  return {
    type: actionTypes.CREATE_RULE_ENGINE_SUCCESS,
    payload: createdUser,
  };
};

export const createRuleEngineActionFail = (error) => ({
  type: actionTypes.CREATE_RULE_ENGINE_FAIL,
  payload: error,
});

export const updateRuleEngineAction = (updatedUserData) => {
  return {
    type: actionTypes.UPDATE_RULE_ENGINE,
    payload: {
      updatedUserData,
    },
  };
};

export const updateRuleEngineActionSuccess = (updatedUser) => {
  return {
    type: actionTypes.UPDATE_RULE_ENGINE_SUCCESS,
    payload: updatedUser,
  };
};

export const updateRuleEngineActionFail = (error) => ({
  type: actionTypes.UPDATE_RULE_ENGINE_FAIL,
  payload: error,
});

export const searchRuleEngineAction = (searchTerm) => {
  return {
    type: actionTypes.SEARCH_RULE_ENGINE,
    payload: searchTerm,
  };
};

export const searchRuleEngineActionSuccess = (searchResults) => {
  return {
    type: actionTypes.SEARCH_RULE_ENGINE_SUCCESS,
    payload: searchResults,
  };
};

export const searchRuleEngineActionFail = (error) => ({
  type: actionTypes.SEARCH_RULE_ENGINE_FAIL,
  payload: error,
});

export const getRuleEngineByIdAction = (userId) => {
  return {
    type: actionTypes.GET_RULE_ENGINE_BY_ID,
    payload: userId,
  };
};

export const getRuleEngineByIdActionSuccess = (UserData) => {
  return {
    type: actionTypes.GET_RULE_ENGINE_BY_ID_SUCCESS,
    payload: UserData,
  };
};

export const getRuleEngineByIdActionFail = (error) => ({
  type: actionTypes.GET_RULE_ENGINE_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsRuleEngineAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_RULE_ENGINE,
  };
};

export const uploadAllDocumentsRuleEngineSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_RULE_ENGINE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsRuleEngineFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_RULE_ENGINE_FAIL,
  payload: error,
});

export const createEditApiRuleEngine = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_API_RULE_ENGINE,
    payload: { data: data },
  };
};
