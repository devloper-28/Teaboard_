import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import * as actionTypes from "../../actionLabels";
import {
  getAllContactLinkActionSuccess,
  getAllContactLinkActionFail,
  getAllSupportLinkActionSuccess,
  getAllSupportLinkActionFail,
} from "../../actions";

function* getAllContactLinkSaga(action) {
  try {
    const response = yield call(
      axiosMain.get,
      `/admin/afterLogin/getAllAfterLoginScreen`,
      action.payload
    );

    if (response.status === 200) {
      yield put(getAllContactLinkActionSuccess(response.data));
    } else {
      yield put(getAllContactLinkActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllContactLinkActionFail(error));
  }
}

function* getAllSupportLinkSaga(action) {
  try {
    const response = yield call(
      axiosMain.get,
      `/admin/afterLogin/getAllAfterLoginScreenSupport`,
      action.payload
    );

    if (response.status === 200) {
      yield put(getAllSupportLinkActionSuccess(response.data));
    } else {
      yield put(getAllSupportLinkActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllSupportLinkActionFail(error));
  }
}

export function* allContactLinkSaga() {
  yield all([
    yield takeEvery(actionTypes.GET_ALL_CONTACT_LINK, getAllContactLinkSaga),
    yield takeEvery(actionTypes.GET_ALL_SUPPORT_LINK, getAllSupportLinkSaga),
  ]);
}
