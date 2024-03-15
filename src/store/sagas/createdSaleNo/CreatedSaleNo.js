// sagas.js
import { put, takeLatest, call } from "redux-saga/effects";

import { all } from "axios";
import {
  fetchSaleNumbersFailure,
  fetchSaleNumbersSuccess,
} from "../../actions/createdSaleNo/CreatedSaleNo";
import { FETCH_SALE_NUMBERS_REQUEST } from "../../actionLabels";
import axiosMain from "../../../http/axios/axios_main";

function* fetchSaleNumbersSaga(action) {
  try {
    let data = window.location.href
      .split("auctionPage")
      [window.location.href.split("auctionPage").length - 1].split("/");
    data.shift();

    let [auctionDetailId, auctionCenterUserId, auctionCenterId] = data.map(
      (ele) => parseInt(atob(ele))
    );
    const sdata = {
      auctionCenterId: auctionCenterId,
      season: action.payload.toString(),
    };

    const response = yield call(
      axiosMain.post,
      `/preauction/Common/BindSaleNoBySeason`,
      sdata
    );
    const responseData = response.data;
    yield put(fetchSaleNumbersSuccess(responseData));
  } catch (error) {
    yield put(fetchSaleNumbersFailure(error.message));
  }
}

function* createdSaleNo() {
  yield all([
    yield takeLatest(FETCH_SALE_NUMBERS_REQUEST, fetchSaleNumbersSaga),
  ]);
}

export default createdSaleNo;
