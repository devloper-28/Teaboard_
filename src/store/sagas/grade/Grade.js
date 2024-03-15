// commonSaga.js
import { takeLatest, put, call } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import { fetchGradeFailure, fetchGradeSuccess } from "../../actions";
import { FETCH_GRADE_REQUEST } from "../../actionLabels";

// Worker Saga: Makes the API call when the FETCH_GRADE_REQUEST action is dispatched
function* fetchGradeSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/grade/dropdown/getGrade",
      action.payload
    );
    yield put(fetchGradeSuccess(response.data));
  } catch (error) {
    yield put(fetchGradeFailure(error.message));
  }
}

// Watcher Saga: Watches for the FETCH_GRADE_REQUEST action and calls the worker saga
export function* watchFetchGrade() {
  yield takeLatest(FETCH_GRADE_REQUEST, fetchGradeSaga);
}
