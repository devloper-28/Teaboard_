import { all, takeEvery, put, call } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import * as actionTypes from "../../actionLabels";
import * as auctionCenterData from "../../actions";
import CustomToast from "../../../components/Toast";

function* fetchAuctionSearchBidBook(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/auctionbid/searchbidbook`,
      action.payload
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        yield put(
          auctionCenterData.fetchAuctionSearchBidBookDataSuccess(response.data)
        );
      } else {
        CustomToast.error(response.data.message);
        yield put(
          auctionCenterData.fetchAuctionSearchBidBookDataFailure(
            response.data.message
          )
        );
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(
        auctionCenterData.fetchAuctionSearchBidBookDataFailure(
          response.data.message
        )
      );
    }
  } catch (error) {
    yield put(auctionCenterData.fetchAuctionSearchBidBookDataFailure(error));
  }
}

export function* auctionSearchBidBookSagas() {
  yield takeEvery(
    actionTypes.FETCH_AUCTION_SEARCH_BID_BOOK_DATA,
    fetchAuctionSearchBidBook
  );
}
