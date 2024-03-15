import * as actionTypes from "../../actionLabels/index";

// Action creator to get all grades
export const getAllGrades = () => ({
  type: actionTypes.GET_ALL_GRADES,
});

export const getAllGradesSuccess = (grades) => ({
  type: actionTypes.GET_ALL_GRADES_SUCCESS,
  payload: grades,
});

export const getAllGradesFail = (error) => ({
  type: actionTypes.GET_ALL_GRADES_FAIL,
  payload: error,
});
// Action creator to create a new grade
export const createGrade = (gradeData) => ({
  type: actionTypes.CREATE_GRADE,
  payload: gradeData,
});

export const createGradeSuccess = () => ({
  type: actionTypes.CREATE_GRADE_SUCCESS,
});

export const createGradeFail = (error) => ({
  type: actionTypes.CREATE_GRADE_FAIL,
  payload: error,
});
// Action creator to update a grade
export const updateGrade = (updatedData) => ({
  type: actionTypes.UPDATE_GRADE,
  payload: updatedData,
});

export const updateGradeSuccess = () => ({
  type: actionTypes.UPDATE_GRADE_SUCCESS,
});

export const updateGradeFail = (error) => ({
  type: actionTypes.UPDATE_GRADE_FAIL,
  payload: error,
});

// Action creator to search for grades based on criteria
export const searchGrade = (searchCriteria) => ({
  type: actionTypes.SEARCH_GRADE,
  payload: searchCriteria,
});

export const searchGradeSuccess = (searchResults) => ({
  type: actionTypes.SEARCH_GRADE_SUCCESS,
  payload: searchResults,
});

export const searchGradeFail = (error) => ({
  type: actionTypes.SEARCH_GRADE_FAIL,
  payload: error,
});

// Action creator to get grade by its ID
export const getGradeById = (gradeId) => ({
  type: actionTypes.GET_GRADE_BY_ID,
  payload: gradeId,
});

export const getGradeByIdSuccess = (grade) => ({
  type: actionTypes.GET_GRADE_BY_ID_SUCCESS,
  payload: grade,
});

export const getGradeByIdFail = (error) => ({
  type: actionTypes.GET_GRADE_BY_ID_FAIL,
  payload: error,
});
// Action creator for uploading all documents
export const uploadAllDocumentsGradeAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_GRADE,
  };
};

export const uploadAllDocumentsGradeSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_GRADE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsGradeFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_GRADE_FAIL,
  payload: error,
});

export const createEditGradeApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_GRADE_API_STATUS,
    payload: { data: data },
  };
};
