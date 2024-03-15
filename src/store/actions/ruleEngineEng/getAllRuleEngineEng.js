import * as actionTypes from "../../actionLabels/index";

export const fetchRuleEngineEng = (payload) => {
  {
  }
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_ENG,
    payload: payload,
  };
};

export const fetchRuleEngineEngSuccess = (getAllRuleEngineEngActionSuccess) => {
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_ENG_SUCCESS,
    payload: getAllRuleEngineEngActionSuccess,
  };
};

export const fetchRuleEngineEngFail = (error) => {
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_ENG_FAIL,
    payload: error,
  };
};

export const fetchRuleEngineBrt = (payload) => {
  {
  }
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_BRT,
    payload: payload,
  };
};

export const fetchRuleEngineBrtSuccess = (getAllRuleEngineBrtActionSuccess) => {
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_BRT_SUCCESS,
    payload: getAllRuleEngineBrtActionSuccess,
  };
};

export const fetchRuleEngineBrtFail = (error) => {
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_BRT_FAIL,
    payload: error,
  };
};
export const getAllRuleEngineEngWithStatusAction = () => {
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_ENG_WITH_STATUS,
  };
};

export const getAllRuleEngineEngWithStatusActionSuccess = (
  getAllRuleEngineEngWithStatus
) => {
  return {
    type: actionTypes.GET_ALL_RULE_ENGINE_ENG_WITH_STATUS_SUCCESS,
    payload: getAllRuleEngineEngWithStatus,
  };
};

export const getAllRuleEngineEngWithStatusActionFail = (error) => ({
  type: actionTypes.GET_ALL_RULE_ENGINE_ENG_WITH_STATUS_FAIL,
  payload: error,
});

export const createRuleEngineEngAction = (newUserData) => {
  return {
    type: actionTypes.CREATE_RULE_ENGINE_ENG,
    payload: newUserData,
  };
};

export const createRuleEngineEngActionSuccess = (createdUser) => {
  return {
    type: actionTypes.CREATE_RULE_ENGINE_ENG_SUCCESS,
    payload: createdUser,
  };
};

export const createRuleEngineEngActionFail = (error) => ({
  type: actionTypes.CREATE_RULE_ENGINE_ENG_FAIL,
  payload: error,
});

export const updateRuleEngineEngAction = (updatedUserData) => {
  return {
    type: actionTypes.UPDATE_RULE_ENGINE_ENG,
    payload: {
      updatedUserData,
    },
  };
};

export const updateRuleEngineEngActionSuccess = (updatedUser) => {
  return {
    type: actionTypes.UPDATE_RULE_ENGINE_ENG_SUCCESS,
    payload: updatedUser,
  };
};

export const updateRuleEngineEngActionFail = (error) => ({
  type: actionTypes.UPDATE_RULE_ENGINE_ENG_FAIL,
  payload: error,
});

export const searchRuleEngineEngAction = (searchTerm) => {
  return {
    type: actionTypes.SEARCH_RULE_ENGINE_ENG,
    payload: searchTerm,
  };
};

export const searchRuleEngineEngActionSuccess = (searchResults) => {
  return {
    type: actionTypes.SEARCH_RULE_ENGINE_ENG_SUCCESS,
    payload: searchResults,
  };
};

export const searchRuleEngineEngActionFail = (error) => ({
  type: actionTypes.SEARCH_RULE_ENGINE_ENG_FAIL,
  payload: error,
});

export const getRuleEngineEngByIdAction = (userId) => {
  return {
    type: actionTypes.GET_RULE_ENGINE_ENG_BY_ID,
    payload: userId,
  };
};

export const getRuleEngineEngByIdActionSuccess = (UserData) => {
  return {
    type: actionTypes.GET_RULE_ENGINE_ENG_BY_ID_SUCCESS,
    payload: UserData,
  };
};

export const getRuleEngineEngByIdActionFail = (error) => ({
  type: actionTypes.GET_RULE_ENGINE_ENG_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsRuleEngineEngAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_RULE_ENGINE_ENG,
  };
};

export const uploadAllDocumentsRuleEngineEngSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_RULE_ENGINE_ENG_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsRuleEngineEngFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_RULE_ENGINE_ENG_FAIL,
  payload: error,
});

export const createEditApiRuleEngineEng = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_API_RULE_ENGINE_ENG,
    payload: { data: data },
  };
};
