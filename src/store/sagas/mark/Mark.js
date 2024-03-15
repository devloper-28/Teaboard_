// commonSaga.js
import { takeLatest, put, call, all } from "redux-saga/effects";
import {
  fetchMarkSuccess,
  fetchMarkFailure,
  fetchMarkTypeSuccess,
  fetchMarkTypeFailure,
} from "../../actions/index";
import axiosMain from "../../../http/axios/axios_main";
import {
  FETCH_MARK_REQUEST,
  FETCH_MARK_TYPE_REQUEST,
} from "../../actionLabels";

// Worker Saga: Makes the API call when the FETCH_MARK_REQUEST action is dispatched
function* fetchMarkSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/mark/dropdown/getMark",
      action.payload
    );
    yield put(fetchMarkSuccess(response.data));
  } catch (error) {
    yield put(fetchMarkFailure(error.message));
  }
}
function* fetchMarkTypeSaga() {
  try {
    const response = yield call(
      axiosMain.get,
      "/preauction/Common/BindMarketType"
    );
    yield put(fetchMarkTypeSuccess(response.data));
  } catch (error) {
    yield put(fetchMarkTypeFailure(error.message));
  }
}
// Watcher Saga: Watches for the FETCH_MARK_REQUEST action and calls the worker saga

function* markData() {
  yield all([
    yield takeLatest(FETCH_MARK_REQUEST, fetchMarkSaga),
    yield takeLatest(FETCH_MARK_TYPE_REQUEST, fetchMarkTypeSaga),
  ]);
}

export default markData;
