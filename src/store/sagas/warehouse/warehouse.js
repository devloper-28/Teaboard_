// commonSaga.js
import { takeLatest, put, call } from "redux-saga/effects";
import { fetchWarehouseUserSuccess, fetchWarehouseUserFailure } from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import { FETCH_WAREHOUSE_USER_REQUEST } from "../../actionLabels";

// Worker Saga: Makes the API call when the FETCH_WAREHOUSE_USER_REQUEST action is dispatched
function* fetchWarehouseUserSaga(data) {
  try {
    const response = yield call(axiosMain.post, "/admin/WareHouseUserReg/dropdown/wareHouseNameDetail",data.payload);
    yield put(fetchWarehouseUserSuccess(response.data));
  } catch (error) {
    yield put(fetchWarehouseUserFailure(error.message));
  }
}

// Watcher Saga: Watches for the FETCH_WAREHOUSE_USER_REQUEST action and calls the worker saga
export function* watchFetchWarehouseUser() {
  yield takeLatest(FETCH_WAREHOUSE_USER_REQUEST, fetchWarehouseUserSaga);
}
