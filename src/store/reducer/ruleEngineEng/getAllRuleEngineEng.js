import * as actionTypes from "../../actionLabels/index";

const initialstate = {
  getAllRuleEngineEngActionSuccess: [],
  getAllRuleEngineEngWithStatus: [],
  createdUser: null,
  updatedUser: null,
  searchResults: [],
  UserData: [],
  getAllRuleEngineBrtActionSuccess: [],
  createEditApiRuleEngineEng: false,
  error: null,
};

const getAllRuleEngineEngReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_RULE_ENGINE_ENG_SUCCESS:
      return {
        ...state,
        getAllRuleEngineEngActionSuccess: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_RULE_ENGINE_ENG_FAIL:
      return {
        ...state,
        getAllRuleEngineEngActionSuccess: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_RULE_ENGINE_BRT_SUCCESS:
      return {
        ...state,
        getAllRuleEngineBrtActionSuccess: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_RULE_ENGINE_BRT_FAIL:
      return {
        ...state,
        getAllRuleEngineBrtActionSuccess: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_RULE_ENGINE_ENG_WITH_STATUS_SUCCESS:
      return {
        ...state,
        getAllRuleEngineEngWithStatus: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_RULE_ENGINE_ENG_WITH_STATUS_FAIL:
      return {
        ...state,
        getAllRuleEngineEngWithStatus: [],
        error: action.payload,
      };

    case actionTypes.CREATE_RULE_ENGINE_ENG_SUCCESS:
      return {
        ...state,
        createdUser: action.payload,
        error: null,
      };

    case actionTypes.CREATE_RULE_ENGINE_ENG_FAIL:
      return {
        ...state,
        createdUser: null,
        error: action.payload,
      };

    case actionTypes.UPDATE_RULE_ENGINE_ENG_SUCCESS:
      return {
        ...state,
        updatedUser: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_RULE_ENGINE_ENG_FAIL:
      return {
        ...state,
        updatedUser: null,
        error: action.payload,
      };

    case actionTypes.SEARCH_RULE_ENGINE_ENG_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_RULE_ENGINE_ENG_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_RULE_ENGINE_ENG_BY_ID_SUCCESS:
      return {
        ...state,
        UserData: action.payload,
        error: null,
      };
    case actionTypes.GET_RULE_ENGINE_ENG_BY_ID_FAIL:
      return {
        ...state,
        UserData: null,
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_RULE_ENGINE_ENG_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_RULE_ENGINE_ENG_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_API_RULE_ENGINE_ENG:
      return {
        ...state,
        createEditApiRuleEngineEng: action.payload.data,
      };

    default:
      return state;
  }
};

export default getAllRuleEngineEngReducer;
