import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getMark: [],
  error: null,
  createdMark: null,
  MarkData: [],
  uploadedDocuments: [],
  getMarkWithoutFilter: [],
  factorydataSelect: [],
  createEditApiStatus: false,
};

const getAllMarks = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_MARK_SUCCESS:
      return {
        ...state,
        getMark: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_MARK_FAIL:
      return {
        ...state,
        getMark: [],
        error: action.payload,
      };

    case actionTypes.CREATE_MARK_SUCCESS:
      return {
        ...state,
        createdMark: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_FACTORY_SUCCESS:
      return {
        ...state,
        factorydataSelect: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_FACTORY_FAIL:
      return {
        ...state,
        factorydataSelect: [],
        error: action.payload,
      };

    case actionTypes.CREATE_MARK_SUCCESS:
      return {
        ...state,
        createdMark: action.payload,
        error: null,
      };

    case actionTypes.CREATE_MARK_FAIL:
      return {
        ...state,
        createdMark: null,
        error: action.payload,
      };
    case actionTypes.UPDATE_MARK_SUCCESS:
      return {
        ...state,
        updatedMark: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_MARK_FAIL:
      return {
        ...state,
        updatedMark: null,
        error: action.payload,
      };
    case actionTypes.GET_MARK_BY_ID_SUCCESS:
      return {
        ...state,
        MarkData: action.payload,
        error: null,
      };
    case actionTypes.GET_MARK_BY_ID_FAIL:
      return {
        ...state,
        MarkData: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_MARK_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_MARK_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.GET_ALL_MARK_WITHOUT_FILTER_SUCCESS:
      return {
        ...state,
        getMarkWithoutFilter: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_MARK_WITHOUT_FILTER_FAIL:
      return {
        ...state,
        getMarkWithoutFilter: [],
        error: action.payload,
      };
    case actionTypes.CREATE_EDIT_API_STATUS_MARK:
      return {
        ...state,
        createEditApiStatus: action.payload.data,
      };
    default:
      return state;
  }
};

export default getAllMarks;
