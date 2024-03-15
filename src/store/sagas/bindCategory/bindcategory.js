// commonSaga.js
import { takeLatest, put, call } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  fetchCategoryFailure,
  fetchCategorySuccess,
  fetchStatusFailure,
  fetchStatusSuccess,
} from "../../actions";
import {
  FETCH_CATEGORY_REQUEST,
  FETCH_STATUS_REQUEST,
} from "../../actionLabels";

// Worker Saga: Makes the API call when the FETCH_CATEGORY_REQUEST action is dispatched
function* fetchCategorySaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/Category/dropdown/getcategory",
      action.payload
    );
    yield put(fetchCategorySuccess(response.data));
  } catch (error) {
    yield put(fetchCategoryFailure(error.message));
  }
}

// Watcher Saga: Watches for the FETCH_CATEGORY_REQUEST action and calls the worker saga
export function* watchFetchCategory() {
  yield takeLatest(FETCH_CATEGORY_REQUEST, fetchCategorySaga);
}

// Worker Saga: Makes the API call when the FETCH_CATEGORY_BY_ID_REQUEST action is dispatched
function* fetchCategoryByIdSaga(action) {
  const categoryId = action.payload; // Extract the category ID from the action payload
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/Common/BindStatusTypeById?Id=${categoryId}`
    );
    yield put(fetchStatusSuccess(response.data));
  } catch (error) {
    yield put(fetchStatusFailure(error.message));
  }
}

// Watcher Saga: Watches for the FETCH_CATEGORY_BY_ID_REQUEST action and calls the worker saga
export function* watchFetchCategoryById() {
  yield takeLatest(FETCH_STATUS_REQUEST, fetchCategoryByIdSaga);
}
