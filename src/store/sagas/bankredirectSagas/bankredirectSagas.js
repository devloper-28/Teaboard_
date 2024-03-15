import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
    REDIRECT_BANK_LINK,
} from "../../actionLabels";
import * as bankActions from "../../actions";

function* getbankredirectSaga(action) {
    try {
      const response = yield call(
        axiosMain.post,
        "wallet/registeruserbankdetail",
        action.payload
      );
      yield put(bankActions.getBankRedirectUrlSuccess(response.data));
    } catch (error) {
      yield put(bankActions.getBankRedirectUrlFail(error));
    }
  }

export function* getAllbankredirectSagas() {
    yield all([
        yield takeEvery(REDIRECT_BANK_LINK, getbankredirectSaga),
    ]);
}

export default getAllbankredirectSagas;