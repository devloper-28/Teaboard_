import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_GRADES,
  CREATE_GRADE,
  UPDATE_GRADE,
  SEARCH_GRADE,
  GET_GRADE_BY_ID,
  UPLOAD_ALL_DOCUMENTS_GRADE,
} from "../../actionLabels";
import {
  getAllGradesSuccess,
  getAllGradesFail,
  createGradeSuccess,
  createGradeFail,
  updateGradeSuccess,
  updateGradeFail,
  searchGradeSuccess,
  searchGradeFail,
  getGradeByIdSuccess,
  getGradeByIdFail,
  uploadAllDocumentsGradeSuccess,
  uploadAllDocumentsGradeFail,
  searchGrade,
  createEditGradeApiStatus,
} from "../../actions";
import CustomToast from "../../../components/Toast";

// Worker saga for getting all grades
function* getAllGradesSaga() {
  try {
    const grades = yield call(axiosMain.post, `/admin/grade/search`, {});
    yield put(getAllGradesSuccess(grades.data));
  } catch (error) {
    yield put(getAllGradesFail(error.message));
  }
}

// Worker saga for creating a new grade
function* createGradeSaga(action) {
  try {
    const Createdata = action.payload;
    const response = yield call(
      axiosMain.post,
      `/admin/grade/create`,
      Createdata
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(createGradeSuccess(response.data));
        // yield put(searchGrade(Createdata.searchasd));
        yield put(createEditGradeApiStatus(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(createGradeFail(response.data.message));
      }
    } else {
      yield put(
        createGradeFail(response.data.message || "Unknown error occurred.")
      );
    }

    // Optionally, dispatch another action to handle any additional logic after successful creation
  } catch (error) {
    yield put(createGradeFail(error.message));
  }
}

// Worker saga for updating a grade
function* updateGradeSaga(action) {
  try {
    const updatedata = action.payload;
    const response = yield call(
      axiosMain.post,
      `/admin/grade/update`,
      updatedata
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(updateGradeSuccess(response.data));
        // yield put(searchGrade(updatedata.searchasd));
        yield put(createEditGradeApiStatus(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(updateGradeFail(response.data.message));
      }
    } else {
      yield put(
        updateGradeFail(response.data.message || "Unknown error occurred.")
      );
    }

    // Optionally, dispatch another action to handle any additional logic after successful update
  } catch (error) {
    yield put(updateGradeFail(error.message));
  }
}

// Worker saga for searching grades
function* searchGradeSaga(action) {
  try {
    const searchResults = yield call(
      axiosMain.post,
      "/admin/grade/search",
      action.payload
    );
    yield put(searchGradeSuccess(searchResults.data));
  } catch (error) {
    yield put(searchGradeFail(error.message));
  }
}

// Worker saga for getting a grade by ID
function* getGradeByIdSaga(action) {
  try {
    const grade = yield call(
      axiosMain.get,
      `/admin/grade/get/${action.payload}`
    );
    yield put(getGradeByIdSuccess(grade.data));
  } catch (error) {
    yield put(getGradeByIdFail(error.message));
  }
}

function* uploadDocumentRevanue(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/grade/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsGradeSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsGradeFail(error.message));
  }
}

export function* gradeSagas() {
  yield all([
    takeEvery(GET_ALL_GRADES, getAllGradesSaga),
    takeEvery(CREATE_GRADE, createGradeSaga),
    takeEvery(UPDATE_GRADE, updateGradeSaga),
    takeEvery(SEARCH_GRADE, searchGradeSaga),
    takeEvery(GET_GRADE_BY_ID, getGradeByIdSaga),
    takeEvery(UPLOAD_ALL_DOCUMENTS_GRADE, uploadDocumentRevanue),
  ]);
}
