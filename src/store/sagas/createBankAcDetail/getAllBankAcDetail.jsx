import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_BANKAC,
  GET_ALL_BANKAC_WITH_STATUS,
  GET_BANKAC_BY_ID,
  CREATE_BANKAC,
  UPDATE_BANKAC,
  SEARCH_BANKAC,
  UPLOAD_ALL_DOCUMENTS_BANKAC,
  GET_ALL_BANKAC_ASC,
} from "../../actionLabels";
import {
  fetchBankAcAsc,
  fetchBankAcFail,
  fetchBankAcSuccess,
  getAllBankAcWithStatusActionSuccess,
  getAllBankAcWithStatusActionFail,
  getBankAcByIdActionSuccess,
  getBankAcByIdActionFail,
  createBankAcActionSuccess,
  createBankAcActionFail,
  updateBankAcActionSuccess,
  updateBankAcActionFail,
  searchBankAcActionSuccess,
  searchBankAcActionFail,
  uploadAllDocumentsBankAcSuccess,
  uploadAllDocumentsBankAcFail,
  createEditBankAcDetailsApiStatus,
  searchBankAcAction,
  fetchBankAcAscSuccess,
  fetchBankAcAscFail,
} from "../../actions";
import CustomToast from "../../../components/Toast";

function* fetchBankAcSaga() {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/bankAccountDetails/search`,
      {}
    );
    yield put(fetchBankAcSuccess(response.data));
  } catch (error) {
    yield put(fetchBankAcFail(error));
  }
}

function* fetchBankAcAscSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/bankAccountDetails/search`,
      action.payload
    );
    yield put(fetchBankAcAscSuccess(response.data));
  } catch (error) {
    yield put(fetchBankAcAscFail(error));
  }
}

function* getAllBankAcWithStatusSaga(action) {
  try {
    const isActive = action.payload;
    const response = yield call(
      axiosMain.get,
      `/admin/bankAccountDetails/getAll/1/1/0`,
      isActive
    );
    yield put(getAllBankAcWithStatusActionSuccess(response.data));
  } catch (error) {
    yield put(getAllBankAcWithStatusActionFail(error.message));
  }
}

function* getBankAcByIdSaga(action) {
  try {
    const bankAccountDetailId = action.payload;
    const BankAcData = yield call(
      axiosMain.get,
      `/admin/bankAccountDetails/get/${bankAccountDetailId}`
    );

    if (BankAcData.status == 200) {
      yield put(getBankAcByIdActionSuccess(BankAcData.data));
    } else {
      yield put(getBankAcByIdActionFail(BankAcData.data.message));
    }
  } catch (error) {
    yield put(getBankAcByIdActionFail(error));
  }
}

function* createBankAcSaga(action) {
  try {
    const newBankAcData = action.payload;
    const createdBankAc = yield call(
      axiosMain.post,
      `/admin/bankAccountDetails/create`,
      newBankAcData
    );

    if (createdBankAc.status == 200) {
      if (createdBankAc.data.statusCode == 200) {
        CustomToast.success(createdBankAc.data.message);
        yield put(createBankAcActionSuccess(createdBankAc));
        yield put(searchBankAcAction(newBankAcData.searchData));
        yield put(fetchBankAcAsc(newBankAcData.searchasd));
        yield put(createEditBankAcDetailsApiStatus(true));
      } else {
        CustomToast.error(createdBankAc.data.message);
        yield put(createBankAcActionFail(createdBankAc.data.message));
      }
    } else {
      CustomToast.error(createdBankAc.message);
      yield put(createBankAcActionFail(createdBankAc.message));
    }
  } catch (error) {
    yield put(createBankAcActionFail(error));
  }
}

function* updateBankAcSaga(action) {
  try {
    const { updatedBankAcData } = action.payload;
    const updatedBankAc = yield call(
      axiosMain.post,
      `/admin/bankAccountDetails/update`,
      updatedBankAcData
    );

    if (updatedBankAc.status == 200) {
      if (updatedBankAc.data.statusCode == 200) {
        CustomToast.success(updatedBankAc.data.message);
        yield put(searchBankAcAction(updatedBankAcData.searchData));
        yield put(fetchBankAcAsc(updatedBankAcData.searchasd));
        yield put(createEditBankAcDetailsApiStatus(true));
        yield put(updateBankAcActionSuccess(updatedBankAc));
      } else {
        CustomToast.error(updatedBankAc.data.message);
        yield put(updateBankAcActionFail(updatedBankAc.data.message));
      }
    } else {
      CustomToast.error(updatedBankAc.message);
      yield put(updateBankAcActionFail(updatedBankAc.message));
    }
  } catch (error) {
    yield put(updateBankAcActionFail(error));
  }
}

function* searchBankAcSaga(action) {
  try {
    const searchTerm = action.payload;
    const searchResults = yield call(
      axiosMain.post,
      `/admin/bankAccountDetails/search`,
      searchTerm
    );
    yield put(searchBankAcActionSuccess(searchResults.data));
  } catch (error) {
    yield put(searchBankAcActionFail(error));
  }
}

function* uploadDocumentBankAc(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/bankAccountDetails/getalluploadeddocument"
    );
    yield put(uploadAllDocumentsBankAcSuccess(response.data)); // Define uploadDocumentSuccess action creator
  } catch (error) {
    yield put(uploadAllDocumentsBankAcFail(error.message));
  }
}

export function* BankAcsSaga() {
  yield all([
    takeEvery(GET_ALL_BANKAC_ASC, fetchBankAcAscSaga),
    takeEvery(GET_ALL_BANKAC, fetchBankAcSaga),
    takeEvery(GET_ALL_BANKAC_WITH_STATUS, getAllBankAcWithStatusSaga),
    takeEvery(GET_BANKAC_BY_ID, getBankAcByIdSaga),
    takeEvery(CREATE_BANKAC, createBankAcSaga),
    takeEvery(UPDATE_BANKAC, updateBankAcSaga),
    takeEvery(SEARCH_BANKAC, searchBankAcSaga),
    takeEvery(UPLOAD_ALL_DOCUMENTS_BANKAC, uploadDocumentBankAc),
  ]);
}
