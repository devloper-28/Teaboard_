import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_REVENUE,
  CREATE_REVENUE,
  UPDATE_REVENUE,
  SEARCH_REVENUE,
  GET_REVENUE_BY_ID,
  UPLOAD_ALL_DOCUMENTS_REVENUE,
  GET_ALL_REVENUE_ASC,
} from "../../actionLabels";
import {
  getAllRevenueActionSuccess,
  getAllRevenueActionFail,
  createRevenueActionSuccess,
  createRevenueActionFail,
  updateRevenueActionSuccess,
  updateRevenueActionFail,
  searchRevenueActionSuccess,
  searchRevenueActionFail,
  getRevenueByIdActionSuccess,
  getRevenueByIdActionFail,
  uploadAllDocumentsRevanueSuccess,
  uploadAllDocumentsRevanueFail,
  searchRevenueAction,
  createEditRevenueApiStatus,
  getAllRevenueAscActionFail,
  getAllRevenueAscActionSuccess,
} from "../../actions";
import CustomToast from "../../../components/Toast";

function* getAllRevenueSaga() {
  try {
    const revenueList = yield call(axiosMain.post, `/admin/revenue/search`, {});
    yield put(getAllRevenueActionSuccess(revenueList.data));
  } catch (error) {
    yield put(getAllRevenueActionFail(error.message));
  }
}

function* getAllRevenueAscSaga(action) {
  try {
    const revenueList = yield call(
      axiosMain.post,
      `/admin/revenue/search`,
      action.payload
    );
    yield put(getAllRevenueAscActionSuccess(revenueList.data));
  } catch (error) {
    yield put(getAllRevenueAscActionFail(error.message));
  }
}

function* createRevenueSaga(action) {
  try {
    const createdRevenue = yield call(
      axiosMain.post,
      `/admin/revenue/create`,
      action.payload
    );

    if (createdRevenue.status == 200) {
      if (createdRevenue.data.statusCode == 200) {
        CustomToast.success(createdRevenue.data.message);
        yield put(createRevenueActionSuccess(createdRevenue));
        yield put(searchRevenueAction(action.payload.searchData));
        yield put(createEditRevenueApiStatus(true));
      } else {
        CustomToast.error(createdRevenue.data.message);
        yield put(createRevenueActionFail(createdRevenue.data.message));
      }
    } else {
      yield put(
        createRevenueActionFail(
          createdRevenue.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(createRevenueActionFail(error.message));
  }
}

function* updateRevenueSaga(action) {
  try {
    const updatedRevenue = yield call(
      axiosMain.post,
      `/admin/revenue/update`,
      action.payload.updatedRevenueData
    );
    if (updatedRevenue.status == 200) {
      if (updatedRevenue.data.statusCode == 200) {
        CustomToast.success(updatedRevenue.data.message);
        yield put(updateRevenueActionSuccess(updatedRevenue));
        yield put(
          searchRevenueAction(action.payload.updatedRevenueData.searchData)
        );
        yield put(createEditRevenueApiStatus(true));
      } else {
        CustomToast.error(updatedRevenue.data.message);
        yield put(updateRevenueActionFail(updatedRevenue.data.message));
      }
    } else {
      yield put(
        updateRevenueActionFail(
          updatedRevenue.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(updateRevenueActionFail(error.message));
  }
}

function* searchRevenueSaga(action) {
  try {
    const searchedRevenue = yield call(
      axiosMain.post,
      `/admin/revenue/search`,
      action.payload
    );
    yield put(searchRevenueActionSuccess(searchedRevenue.data));
  } catch (error) {
    yield put(searchRevenueActionFail(error.message));
  }
}

function* getRevenueByIdSaga(action) {
  try {
    const revenueById = yield call(
      axiosMain.get,
      `/admin/revenue/get/${action.payload}`
    );
    yield put(getRevenueByIdActionSuccess(revenueById.data));
  } catch (error) {
    yield put(getRevenueByIdActionFail(error.message));
  }
}

function* uploadDocumentRevanue(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/revenue/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsRevanueSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsRevanueFail(error.message));
  }
}

export function* revanueSaga() {
  yield all([
    takeEvery(GET_ALL_REVENUE_ASC, getAllRevenueAscSaga),
    takeEvery(GET_ALL_REVENUE, getAllRevenueSaga),
    takeEvery(CREATE_REVENUE, createRevenueSaga),
    takeEvery(UPDATE_REVENUE, updateRevenueSaga),
    takeEvery(SEARCH_REVENUE, searchRevenueSaga),
    takeEvery(GET_REVENUE_BY_ID, getRevenueByIdSaga),
    takeEvery(UPLOAD_ALL_DOCUMENTS_REVENUE, uploadDocumentRevanue),
  ]);
}

export default revanueSaga;
