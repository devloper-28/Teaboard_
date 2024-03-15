import { all, takeEvery, put, call } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import * as actionTypes from "../../actionLabels";
import * as auctionCenterData from "../../actions";
import CustomToast from "../../../components/Toast";

function* fetchAuctionCenterData(action) {
  try {
    let auctionDetailId = action.payload.auctionDetailId;
    let userAuctionLoginId = action.payload.userAuctionLoginId;

    const response = yield call(
      axiosMain.get,
      `/auctionbid/viewuserwiseliveauction/${auctionDetailId}/${userAuctionLoginId}`
    );

    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        yield put(
          auctionCenterData.fetchAuctionCenterDataSuccess(response.data)
        );
        yield put(auctionCenterData.fetchAuctionCenterDataApiCall(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(
          auctionCenterData.fetchAuctionCenterDataFailure(response.data.message)
        );
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(
        auctionCenterData.fetchAuctionCenterDataFailure(response.data.message)
      );
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(auctionCenterData.fetchAuctionCenterDataFailure(error));
  }
}

function* fetchAuctionCenterHeaderData(action) {
  try {
    let auctionDetailId = action.payload.auctionDetailId;

    const response = yield call(
      axiosMain.get,
      `/auctionbid/getauctionheaderdata/${auctionDetailId}`
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        yield put(
          auctionCenterData.fetchAuctionCenterHeaderDataSuccess(response.data)
        );
      } else {
        CustomToast.error(response.data.message);
        yield put(
          auctionCenterData.fetchAuctionCenterHeaderDataFailure(
            response.data.message
          )
        );
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(
        auctionCenterData.fetchAuctionCenterHeaderDataFailure(
          response.data.message
        )
      );
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(auctionCenterData.fetchAuctionCenterHeaderDataFailure(error));
  }
}

function* bidderConfirm(action) {
  try {
    let bidderId = action.payload.bidderId;
    let auctionItemDetailId = action.payload.auctionItemDetailId;
    let maxBid = action.payload.maxBid;
    const response = yield call(
      axiosMain.post,
      `/auctionbid/changemaxbid?bidderId=${bidderId}&auctionItemDetailId=${auctionItemDetailId}&maxBid=${maxBid}`
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        let payloadData = {
          userAuctionLoginId:
            window.location.pathname &&
            window.location.pathname.split("/") &&
            window.location.pathname.split("/")[3]
              ? atob(
                  window.location.pathname &&
                    window.location.pathname.split("/") &&
                    window.location.pathname.split("/")[3]
                )
              : "",
          auctionDetailId:
            window.location.pathname &&
            window.location.pathname.split("/") &&
            window.location.pathname.split("/")[2]
              ? atob(
                  window.location.pathname &&
                    window.location.pathname.split("/") &&
                    window.location.pathname.split("/")[2]
                )
              : "",
        };
        yield put(auctionCenterData.fetchAuctionCenterData(payloadData));

        CustomToast.success(response.data.message);
        yield put(auctionCenterData.bidderConfirmSuccess(response.data));
        // window.location.reload();
      } else {
        CustomToast.error(response.data.message);
        yield put(
          auctionCenterData.bidderConfirmFailure(response.data.message)
        );
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(auctionCenterData.bidderConfirmFailure(response.data.message));
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(auctionCenterData.bidderConfirmFailure(error));
  }
}

function* bidderIn(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/auctionbid/addbuyerinitem",
      action.payload
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        let payloadData = {
          userAuctionLoginId:
            window.location.pathname &&
            window.location.pathname.split("/") &&
            window.location.pathname.split("/")[3]
              ? atob(
                  window.location.pathname &&
                    window.location.pathname.split("/") &&
                    window.location.pathname.split("/")[3]
                )
              : "",
          auctionDetailId:
            window.location.pathname &&
            window.location.pathname.split("/") &&
            window.location.pathname.split("/")[2]
              ? atob(
                  window.location.pathname &&
                    window.location.pathname.split("/") &&
                    window.location.pathname.split("/")[2]
                )
              : "",
        };
        yield put(auctionCenterData.fetchAuctionCenterData(payloadData));

        CustomToast.success(response.data.message);
        yield put(auctionCenterData.bidderInSuccess(response.data));
        // window.location.reload();
      } else {
        CustomToast.error(response.data.message);
        yield put(auctionCenterData.bidderInFailure(response.data.message));
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(auctionCenterData.bidderInFailure(response.data.message));
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(auctionCenterData.bidderInFailure(error));
  }
}

function* bidderOut(action) {
  try {
    let bidderId = action.payload.bidderId;
    let auctionItemDetailId = action.payload.auctionItemDetailId;

    const response = yield call(
      axiosMain.post,
      `/auctionbid/exitfromitem?bidderId=${bidderId}&auctionItemDetailId=${auctionItemDetailId}`
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        let payloadData = {
          userAuctionLoginId:
            window.location.pathname &&
            window.location.pathname.split("/") &&
            window.location.pathname.split("/")[3]
              ? atob(
                  window.location.pathname &&
                    window.location.pathname.split("/") &&
                    window.location.pathname.split("/")[3]
                )
              : "",
          auctionDetailId:
            window.location.pathname &&
            window.location.pathname.split("/") &&
            window.location.pathname.split("/")[2]
              ? atob(
                  window.location.pathname &&
                    window.location.pathname.split("/") &&
                    window.location.pathname.split("/")[2]
                )
              : "",
        };
        yield put(auctionCenterData.fetchAuctionCenterData(payloadData));

        CustomToast.success(response.data.message);
        yield put(auctionCenterData.bidderOutSuccess(response.data));
        // window.location.reload();
      } else {
        CustomToast.error(response.data.message);
        yield put(auctionCenterData.bidderOutFailure(response.data.message));
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(auctionCenterData.bidderOutFailure(response.data.message));
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(auctionCenterData.bidderOutFailure(error));
  }
}

function* catelogFetchAllData(action) {
  try {
    let userLoginId = action.payload.userLoginId;
    let auctionDetailId = action.payload.auctionDetailId;

    const response = yield call(
      axiosMain.post,
      `/auctionbid/getuserwisecolumnconfig?userLoginId=${userLoginId}&auctionDetailId=${auctionDetailId}`
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        // CustomToast.success(response.data.message);
        yield put(auctionCenterData.catelogFetchAllDataSuccess(response.data));
      } else {
        CustomToast.error(response.data.message);
        yield put(
          auctionCenterData.catelogFetchAllDataFailure(response.data.message)
        );
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(
        auctionCenterData.catelogFetchAllDataFailure(response.data.message)
      );
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(auctionCenterData.catelogFetchAllDataFailure(error));
  }
}

function* catelogSubmitData(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/auctionbid/addcatalogcolumnconfig`,
      action.payload
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        CustomToast.success(response.data.message);
        yield put(auctionCenterData.catelogSubmitDataSuccess(response.data));
        // yield put(auctionCenterData.fetchAuctionCenterData(action.payload));
        window.location.reload();
      } else {
        CustomToast.error(response.data.message);
        yield put(
          auctionCenterData.catelogSubmitDataFailure(response.data.message)
        );
      }
    } else {
      CustomToast.error(
        response.data.catelogSubmitDataFailure(response.data.message)
      );
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(auctionCenterData.catelogSubmitDataFailure(error));
  }
}

function* getSummaryOfTeaSoldData(action) {
  try {
    let userAuctionLoginId = action.payload.userAuctionLoginId;
    let auctionDetailId = action.payload.auctionDetailId;

    const response = yield call(
      axiosMain.get,
      `/auctionbid/viewteasoldsummary/${auctionDetailId}/${userAuctionLoginId}`
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        yield put(
          auctionCenterData.getSummaryOfTeaSoldDataSuccess(response.data)
        );
      } else {
        CustomToast.error(response.data.message);
        yield put(
          auctionCenterData.getSummaryOfTeaSoldDataFailure(
            response.data.message
          )
        );
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(
        auctionCenterData.getSummaryOfTeaSoldDataFailure(response.data.message)
      );
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(auctionCenterData.getSummaryOfTeaSoldDataFailure(error));
  }
}

function* getAuctioneerMarketSummaryData(action) {
  try {
    let auctionDetailId = action.payload.auctionDetailId;

    const response = yield call(
      axiosMain.get,
      `/auctionbid/viewauctioneersbyauctionid/${auctionDetailId}`
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        yield put(
          auctionCenterData.getAuctioneerMarketSummaryDataSuccess(response.data)
        );
      } else {
        CustomToast.error(response.data.message);
        yield put(
          auctionCenterData.getAuctioneerMarketSummaryDataFailure(
            response.data.message
          )
        );
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(
        auctionCenterData.getAuctioneerMarketSummaryDataFailure(
          response.data.message
        )
      );
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(auctionCenterData.getAuctioneerMarketSummaryDataFailure(error));
  }
}

function* getAuctioneerMarketSummaryWiseData(action) {
  try {
    let auctionDetailId = action.payload.auctionDetailId;
    let userLoginId = action.payload.userLoginId;

    const response = yield call(
      axiosMain.post,
      `/auctionbid/viewauctioneermarketsummary?auctionDetailId=${auctionDetailId}&commonUserId=${userLoginId}`
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        yield put(
          auctionCenterData.getAuctioneerMarketSummaryWiseDataSuccess(
            response.data
          )
        );
      } else {
        CustomToast.error(response.data.message);
        yield put(
          auctionCenterData.getAuctioneerMarketSummaryWiseDataFailure(
            response.data.message
          )
        );
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(
        auctionCenterData.getAuctioneerMarketSummaryWiseDataFailure(
          response.data.message
        )
      );
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(
      auctionCenterData.getAuctioneerMarketSummaryWiseDataFailure(error)
    );
  }
}

function* getMarketSummaryData(action) {
  try {
    let auctionDetailId = action.payload.auctionDetailId;

    const response = yield call(
      axiosMain.post,
      `/auctionbid/viewmarketsummary?auctionDetailId=${auctionDetailId}`
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        yield put(auctionCenterData.getMarketSummaryDataSuccess(response.data));
      } else {
        CustomToast.error(response.data.message);
        yield put(
          auctionCenterData.getMarketSummaryDataFailure(response.data.message)
        );
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(
        auctionCenterData.getMarketSummaryDataFailure(response.data.message)
      );
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(auctionCenterData.getMarketSummaryDataFailure(error));
  }
}

function* getMyPlannerData(action) {
  try {
    let auctionDetailId = action.payload.auctionDetailId;
    let bidderId = action.payload.bidderId;

    const response = yield call(
      axiosMain.get,
      `/auctionbid/getmyplannerdata/${auctionDetailId}/${bidderId}`
    );

    if (response.status == 200) {
      if (response.data.statusCode == 1) {
        yield put(auctionCenterData.getMyPlannerDataSuccess(response.data));
      } else {
        CustomToast.error(response.data.message);
        yield put(
          auctionCenterData.getMyPlannerDataFailure(response.data.message)
        );
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(
        auctionCenterData.getMyPlannerDataFailure(response.data.message)
      );
    }
  } catch (error) {
    // CustomToast.error("");
    yield put(auctionCenterData.getMyPlannerDataFailure(error));
  }
}

export default function* auctionPageSagas() {
  yield takeEvery(
    actionTypes.FETCH_AUCTION_CENTER_DATA,
    fetchAuctionCenterData
  );

  yield takeEvery(
    actionTypes.FETCH_AUCTION_CENTER_HEADER_DATA,
    fetchAuctionCenterHeaderData
  );

  yield takeEvery(actionTypes.BIDDER_CONFIRM, bidderConfirm);

  yield takeEvery(actionTypes.BIDDER_IN, bidderIn);

  yield takeEvery(actionTypes.BIDDER_OUT, bidderOut);

  yield takeEvery(actionTypes.CATELOG_FETCH_ALL_DATA, catelogFetchAllData);

  yield takeEvery(actionTypes.CATELOG_SUBMIT_DATA, catelogSubmitData);

  yield takeEvery(
    actionTypes.GET_SUMMARY_OF_TEA_SOLD_DATA,
    getSummaryOfTeaSoldData
  );

  yield takeEvery(
    actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_DATA,
    getAuctioneerMarketSummaryData
  );

  yield takeEvery(
    actionTypes.GET_AUCTIONEER_MARKET_SUMMARY_WISE_DATA,
    getAuctioneerMarketSummaryWiseData
  );

  yield takeEvery(actionTypes.GET_MARKET_SUMMARY_DATA, getMarketSummaryData);

  yield takeEvery(actionTypes.GET_MY_PLANNER_DATA, getMyPlannerData);
}
