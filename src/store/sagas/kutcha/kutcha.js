// kutchaCatalogueSaga.js
import { takeLatest, put, call, all, takeEvery } from "redux-saga/effects";
import {
  fetchKutchaCatalogueFailure,
  fetchKutchaCatalogueSuccess,
  updateKutchaCatalogueFailure,
  updateKutchaCatalogueSuccess,
} from "../../actions";
import {
  FETCH_KUTCHA_CATALOGUE_REQUEST,
  GENERATE_LOT_NO_FAILURE,
  GENERATE_LOT_NO_REQUEST,
  GENERATE_LOT_NO_SUCCESS,
  UPDATE_KUTCHA_CATALOGUE_REQUEST,
} from "../../actionLabels";
import axiosMain from "../../../http/axios/axios_main";

// Worker Saga: Makes the API call when the FETCH_KUTCHA_CATALOGUE_REQUEST action is dispatched
function* fetchKutchaCatalogueSaga(action) {
  const {
    LotNoStatus,
    auctionCenterId,
    auctioneerId,
    categoryId,
    gradeId,
    markId,
    marketTypeId,
    saleNo,
    season,
    teaTypeId,
    role,
    auctionType,
    baseUrlEng,
  } = action.payload;
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/${baseUrlEng}/GetKutchaCatalogueByParam?role=` + role,
      {
        LotNoStatus,
        auctionCenterId,
        auctioneerId,
        categoryId,
        gradeId,
        markId,
        marketTypeId,
        saleNo,
        season,
        teaTypeId,
      }
    );
    yield put(fetchKutchaCatalogueSuccess(response.data));
  } catch (error) {
    yield put(fetchKutchaCatalogueFailure(error.message));
  }
}
function* generateLotNoSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/preauction/KutchaCatalogue/GenerateLotNo",
      action.payload
    ); // Call the API function with the payload
    const lotNo = response.data.lotNo; // Update this line with the appropriate response data key

    yield put({ type: GENERATE_LOT_NO_SUCCESS, payload: lotNo });
  } catch (error) {
    yield put({ type: GENERATE_LOT_NO_FAILURE, payload: error.message });
  }
}
// Watcher Saga: Watches for the FETCH_KUTCHA_CATALOGUE_REQUEST action and calls the worker saga

function* updateKutchaCatalogue(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/preauction/KutchaCatalogue/UpdateKutchaCatalogueDetails",
      action.payload
    );
    yield put(updateKutchaCatalogueSuccess(response.data));
  } catch (error) {
    yield put(updateKutchaCatalogueFailure(error.message));
  }
}
function* watchFetchKutchaCatalogue() {
  yield all([
    yield takeEvery(FETCH_KUTCHA_CATALOGUE_REQUEST, fetchKutchaCatalogueSaga),
    yield takeEvery(GENERATE_LOT_NO_REQUEST, generateLotNoSaga),
    yield takeEvery(UPDATE_KUTCHA_CATALOGUE_REQUEST, updateKutchaCatalogue),
  ]);
}
export default watchFetchKutchaCatalogue;
