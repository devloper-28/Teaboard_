import { all, takeLatest, call, put, takeEvery } from "redux-saga/effects";

import axiosMain from "../../../http/axios/axios_main";
import {
  CANCEL_SALE_PROGRAM_DOCUMENT_REQUEST,
  CANCEL_SALE_PROGRAM_REQUEST,
  CREATE_SALE_PROGRAM_REQUEST,
  FETCH_SALE_PROGRAM_DETAILS_REQUEST,
  FETCH_SALE_PROGRAM_LIST_REQUEST,
  GET_PROMPT_DATE_BY_AUCTION_CENTER_REQUEST,
  UPDATE_SALE_PROGRAM_REQUEST,
} from "../../actionLabels";
import {
  cancelSaleProgramDocumentFailure,
  cancelSaleProgramDocumentSuccess,
  cancelSaleProgramFailure,
  cancelSaleProgramSuccess,
  createSaleProgramFailure,
  createSaleProgramSuccess,
  fetchSaleProgramDetailsFailure,
  fetchSaleProgramDetailsSuccess,
  fetchSaleProgramListFailure,
  fetchSaleProgramListSuccess,
  getPromptDateByAuctionCenterFailure,
  getPromptDateByAuctionCenterSuccess,
  updateSaleProgramFailure,
  updateSaleProgramSuccess,
} from "../../actions";
import CustomToast from "../../../components/Toast";
import axios from "axios";

function* fetchSaleProgramListSaga(action) {
  const { season, saleNo, pageNumber, pageSize } = action.payload;
  let data = window.location.href
    .split("auctionPage")
    [window.location.href.split("auctionPage").length - 1].split("/");
  data.shift();

  let [auctionDetailId, auctionCenterUserId, auctionCenterId] = data.map(
    (ele) => parseInt(atob(ele))
  );
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/${action?.payload?.baseUrlEng}/GetSaleProgramList`,
      {
        season,
        saleNo,
        pageNumber,
        pageSize,
        auctionCenterId: auctionCenterId,
      }
    );

    yield put(fetchSaleProgramListSuccess(response.data));
  } catch (error) {
    yield put(fetchSaleProgramListFailure(error.message));
  }
}
function* fetchSaleProgramDetailsSaga(action) {
  // debugger
  try {
    const id = action.payload.id;
    const response = yield call(
      axiosMain.post,
      // axios.post, //http://192.168.101.178:5080/
      `/preauction/${action?.payload?.baseUrlEng}/GetSaleProgramById?SaleProgramId=${id}&createdBy=${action.payload.userId}&action=${action.payload.actionType}`
    );
    yield put(fetchSaleProgramDetailsSuccess(response.data));
  } catch (error) {
    yield put(fetchSaleProgramDetailsFailure(error.message));
  }
}
function* getPromptDateByAuctionCenterSaga(action) {
  try {
    const { auctionCenterId, saleDate } = action.payload;
    const url = `${axiosMain}/preauction/${action?.payload?.baseUrlEng}/GetPromptDateByAuctionCenter`;
    const data = {
      auctionCenterId: auctionCenterId,
      saleDate: saleDate,
    };
    const response = yield call(axiosMain.post, url, data);
    yield put(getPromptDateByAuctionCenterSuccess(response.data));
  } catch (error) {
    yield put(getPromptDateByAuctionCenterFailure(error.message));
  }
}
function* createSaleProgramSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/${action?.payload?.baseUrlEng}/CreateSaleProgram`,
      action.payload
    );
    yield put(createSaleProgramSuccess());
    // Show success toast notification
    if (response.data.statusCode === 200) {
      yield put(updateSaleProgramSuccess());
      CustomToast.success(response.data.message);
    } else {
      yield put(updateSaleProgramFailure(response.data.message));
      CustomToast.warning(response.data.message);
    }
  } catch (error) {
    yield put(createSaleProgramFailure(error.message));
    CustomToast.error("Failed to create sale program. Please try again.");
    // Show error toast notification
  }
}
function* updateSaleProgramSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/${action?.payload?.baseUrlEng}/UpdateSaleProgram`,
      action.payload
    );
    if (response.data.statusCode === 200) {
      yield put(updateSaleProgramSuccess());
      CustomToast.success(response.data.message);
    } else {
      yield put(updateSaleProgramFailure(response.data.message));
      CustomToast.error(response.data.message);
    }
  } catch (error) {
    yield put(updateSaleProgramFailure(error.message));
    CustomToast.error("An error occurred while updating the sale program");
  }
}

function* cancelSaleProgramSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/${action?.payload?.baseUrlEng}/CancelSaleProgram`,
      action.payload
    );
    if (response.data.statusCode === 200) {
      yield put(cancelSaleProgramSuccess());
      CustomToast.success("Sale Program canceled successfully");
    } else {
      yield put(cancelSaleProgramFailure(response.data.message));
      CustomToast.error("Failed to cancel Sale Program");
    }
  } catch (error) {
    yield put(cancelSaleProgramFailure(error.message));
    CustomToast.error("An error occurred while canceling Sale Program");
  }
}

function* cancelSaleProgramDocumentSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/${action?.payload?.baseUrlEng}/CancelSaleProgramDocument`,
      action.payload
    );
    if (response.data.statusCode === 200) {
      yield put(cancelSaleProgramDocumentSuccess());
      CustomToast.success("Sale Program document canceled successfully");
    } else {
      yield put(cancelSaleProgramDocumentFailure(response.data.message));
      CustomToast.error("Failed to cancel Sale Program document");
    }
  } catch (error) {
    yield put(cancelSaleProgramDocumentFailure(error.message));
    CustomToast.error(
      "An error occurred while canceling Sale Program document"
    );
  }
}

function* rootSaga() {
  yield all([
    yield takeEvery(FETCH_SALE_PROGRAM_LIST_REQUEST, fetchSaleProgramListSaga),
    yield takeEvery(
      FETCH_SALE_PROGRAM_DETAILS_REQUEST,
      fetchSaleProgramDetailsSaga
    ),
    yield takeEvery(
      GET_PROMPT_DATE_BY_AUCTION_CENTER_REQUEST,
      getPromptDateByAuctionCenterSaga
    ),
    yield takeEvery(CREATE_SALE_PROGRAM_REQUEST, createSaleProgramSaga),
    yield takeEvery(UPDATE_SALE_PROGRAM_REQUEST, updateSaleProgramSaga),
    yield takeEvery(CANCEL_SALE_PROGRAM_REQUEST, cancelSaleProgramSaga),
    yield takeEvery(
      CANCEL_SALE_PROGRAM_DOCUMENT_REQUEST,
      cancelSaleProgramDocumentSaga
    ),
  ]);
}

export default rootSaga;
