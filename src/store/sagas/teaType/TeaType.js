import { put, takeEvery, call } from "redux-saga/effects";
import * as actionLabels from "../../actionLabels";
import { toggleActionFail, teaTypeActionSuccess } from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import {
  fetchSubTeaTypeFailure,
  fetchSubTeaTypeSuccess,
} from "../../actions/teaType/TeaType";
import { FETCH_SUB_TEATYPE_REQUEST } from "../../actionLabels/teaType/TeaType";

function* teaTypeSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/teaType/dropdown/getTeaType",
      action.payload
    );
    yield put(teaTypeActionSuccess(response.data));
  } catch (error) {
    yield put(toggleActionFail(error.message));
  }
}

// Worker Saga: Makes the API call when the FETCH_SUB_TEATYPE_REQUEST action is dispatched
function* fetchSubTeaTypeSaga(action) {
  try {
    // const { payload: teaTypeId } = action;
    const response = yield call(
      axiosMain.post,
      `/admin/subTeaType/dropdown/subTeaType`,
      action.payload
    );
    
    yield put(fetchSubTeaTypeSuccess(response.data));
  } catch (error) {
    yield put(fetchSubTeaTypeFailure(error.message));
  }
}

export default function* teaTypeSagaWatcher() {
  yield takeEvery(actionLabels.FETCH_TEA_TYPE, teaTypeSaga);
  yield takeEvery(FETCH_SUB_TEATYPE_REQUEST, fetchSubTeaTypeSaga);
}
