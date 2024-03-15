import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import { GET_ALL_CHANGE_PWD } from "../../actionLabels";
import { fetchChangePwdSFail, fetchChangePwdSuccess } from "../../actions";
import CustomToast from "../../../components/Toast";

function* fetchChangePwdSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/user/changePasswordAfterLogin`,
      action.payload
    );
    if (response.data.statusCode === 200) {
      yield put(fetchChangePwdSuccess(response.data));
      CustomToast.success(response.data.message);
    } else {
      CustomToast.error(response.data.message);
      yield put(fetchChangePwdSuccess(response.massage));
    }
  } catch (error) {
    yield put(fetchChangePwdSFail(error));
  }
}

export function* ChangePwdsSaga() {
  yield all([takeEvery(GET_ALL_CHANGE_PWD, fetchChangePwdSaga)]);
}
