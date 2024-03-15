import * as actionTypes from "../../actionLabels/index";

const initialState = {
  allGrades: [],
  grade: [],
  searchResults: [],
  error: null,

  uploadedDocuments: [],
  createEditGradeApiStatus: false,
};

const gradeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_GRADES_SUCCESS:
      return {
        ...state,
        allGrades: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_GRADES_FAIL:
      return {
        ...state,
        allGrades: [],
        error: action.payload,
      };
    case actionTypes.CREATE_GRADE_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case actionTypes.CREATE_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.UPDATE_GRADE_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case actionTypes.UPDATE_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.SEARCH_GRADE_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };
    case actionTypes.SEARCH_GRADE_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_GRADE_BY_ID_SUCCESS:
      return {
        ...state,
        grade: action.payload,
        error: null,
      };
    case actionTypes.GET_GRADE_BY_ID_FAIL:
      return {
        ...state,
        grade: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_GRADE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_GRADE_API_STATUS:
      return {
        ...state,
        createEditGradeApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default gradeReducer;
