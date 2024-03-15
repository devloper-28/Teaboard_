import * as actionTypes from "../../actionLabels/index";

const initialstate = {
  getAllRuleEngineActionSuccess: [],
  getAllRuleEngineWithStatus: [],
  createdUser: null,
  updatedUser: null,
  searchResults: [],
  UserData: [],
  createEditApiRuleEngine: false,
  error: null,
};

const getAllRuleEngineReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_RULE_ENGINE_SUCCESS:
      return {
        ...state,
        getAllRuleEngineActionSuccess: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_RULE_ENGINE_FAIL:
      return {
        ...state,
        getAllRuleEngineActionSuccess: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_RULE_ENGINE_WITH_STATUS_SUCCESS:
      return {
        ...state,
        getAllRuleEngineWithStatus: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_RULE_ENGINE_WITH_STATUS_FAIL:
      return {
        ...state,
        getAllRuleEngineWithStatus: [],
        error: action.payload,
      };

    case actionTypes.CREATE_RULE_ENGINE_SUCCESS:
      return {
        ...state,
        createdUser: action.payload,
        error: null,
      };

    case actionTypes.CREATE_RULE_ENGINE_FAIL:
      return {
        ...state,
        createdUser: null,
        error: action.payload,
      };

    case actionTypes.UPDATE_RULE_ENGINE_SUCCESS:
      return {
        ...state,
        updatedUser: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_RULE_ENGINE_FAIL:
      return {
        ...state,
        updatedUser: null,
        error: action.payload,
      };

    case actionTypes.SEARCH_RULE_ENGINE_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_RULE_ENGINE_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_RULE_ENGINE_BY_ID_SUCCESS:
      return {
        ...state,
        UserData: action.payload,
        error: null,
      };
    case actionTypes.GET_RULE_ENGINE_BY_ID_FAIL:
      return {
        ...state,
        UserData: null,
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_RULE_ENGINE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_RULE_ENGINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_API_RULE_ENGINE:
      return {
        ...state,
        createEditApiRuleEngine: action.payload.data,
      };

    default:
      return state;
  }
};

export default getAllRuleEngineReducer;
