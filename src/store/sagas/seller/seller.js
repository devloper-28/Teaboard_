import axiosMain from "../../../http/axios/axios_main";

import {
  CREATE_FACTORY_OWNER_REQUEST,
  CREATE_SELLER_REQUEST,
  FETCH_FACTORY_BY_ID_REQUEST,
  FETCH_FACTORY_OWNER_FAILURE,
  FETCH_FACTORY_OWNER_REQUEST,
  FETCH_FACTORY_OWNER_SUCCESS,
  FETCH_FACTORY_REQUEST,
  GET_ALL_FACTORY_TYPE_REQUEST,
  GET_ALL_REVENUES_REQUEST,
  GET_ALL_REVENUE_REQUEST,
  GET_ALL_SELLER_STATE_REQUEST,
  GET_FACTORY_DOCUMENT_REQUEST,
  GET_FACTORY_OWNER_LIST_REQUEST,
  GET_SELLER_DOCUMENT_REQUEST,
  UPDATE_FACTORY_OWNER_REQUEST,
  UPDATE_FACTORY_REQUEST,
} from "../../actionLabels";
import { takeLatest, put, call, all } from "redux-saga/effects";
import {
  GetFactoryFailure,
  GetFactorySuccess,
  createFactoryOwnerFailure,
  createFactoryOwnerSuccess,
  createSellerFailure,
  createSellerSuccess,
  fetchFactoryDocumentsFailure,
  fetchFactoryDocumentsSuccess,
  fetchFactoryFailure,
  fetchFactoryListFailure,
  fetchFactoryListSuccess,
  fetchFactorySuccess,
  fetchSellerDocumentsFailure,
  fetchSellerDocumentsSuccess,
  getAllRevenueFailure,
  getAllRevenueSuccess,
  getAllStateFailure,
  getAllStateSuccess,
  getFactoryOwnerListFailure,
  getFactoryOwnerListSuccess,
  getFactoryTypeFailure,
  getFactoryTypeSuccess,
  updateFactoryFailure,
  updateFactoryOwnerFailure,
  updateFactoryOwnerSuccess,
  updateFactorySuccess,
  createEditApiStatusSeller,
} from "../../actions";
import CustomToast from "../../../components/Toast";

function* fetchDocuments() {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/factoryOwner/getalluploadeddocument"
    );
    const data = response.data;
    yield put(fetchSellerDocumentsSuccess(data));
  } catch (error) {
    yield put(fetchSellerDocumentsFailure(error));
  }
}
function* fetchDocumentsForFactory() {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/factory/getdocumentdetail/alluploaddocument"
    );
    const data = response.data;
    yield put(fetchFactoryDocumentsSuccess(data));
  } catch (error) {
    yield put(fetchFactoryDocumentsFailure(error));
  }
}
function* createSeller(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/factory/create",
      action.payload
    );

    if (response.data.statusCode == 200) {
      CustomToast.success(response.data.message);
      yield put(createSellerSuccess(response.data));
      yield put(createEditApiStatusSeller(true));
    } else {
      CustomToast.error(response.data.message);
      yield put(createSellerFailure(response.data.message));
    }
  } catch (error) {
    yield put(createSellerFailure(error.message));
  }
}

function* createFactoryOwnerSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/factoryOwner/create",
      action.payload
    );
    if (response.data.statusCode == 200) {
      CustomToast.success(response.data.message);
      yield put(createFactoryOwnerSuccess(response.data));
      yield put(createEditApiStatusSeller(true));
    } else {
      CustomToast.error(response.data.message);
      yield put(createFactoryOwnerFailure(response.data.message));
    }
  } catch (error) {
    yield put(createFactoryOwnerFailure(error));
  }
}

function* getFactoryOwnerListSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/getAllUser/search",
      action.payload
    );
    yield put(getFactoryOwnerListSuccess(response.data));
  } catch (error) {
    yield put(getFactoryOwnerListFailure(error));
  }
}

function* updateFactoryOwner(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/factoryOwner/update",
      action.payload
    );

    if (response.data.statusCode == 200) {
      CustomToast.success(response.data.message);
      yield put(updateFactoryOwnerSuccess(response.data));
      yield put(createEditApiStatusSeller(true));
    } else {
      CustomToast.error(response.data.message);
      yield put(updateFactoryOwnerFailure(response.data.message));
    }
  } catch (error) {
    yield put(updateFactoryOwnerFailure(error));
  }
}

function* updateFactory(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/factory/update",
      action.payload
    );

    if (response.data.statusCode == 200) {
      CustomToast.success(response.data.message);
      yield put(updateFactorySuccess(response.data));
      yield put(createEditApiStatusSeller(true));
    } else {
      CustomToast.error(response.data.message);
      yield put(updateFactoryOwnerFailure(response.data.message));
    }
    yield put(updateFactorySuccess(response.data));
  } catch (error) {
    yield put(updateFactoryFailure(error));
  }
}

function* fetchFactoryOwnerData(action) {
  try {
    const response = yield call(
      axiosMain.get,
      `/admin/factoryOwner/get/${action.payload}`
    );
    yield put(fetchFactorySuccess(response.data));
  } catch (error) {
    yield put(fetchFactoryFailure(error));
  }
}

function* getFactoryListSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/factory/search",
      action.payload
    );
    yield put(fetchFactoryListSuccess(response.data));
  } catch (error) {
    yield put(fetchFactoryListFailure(error));
  }
}

function* fetchFactoryData(action) {
  try {
    const response = yield call(
      axiosMain.get,
      `/admin/factory/get/${action.payload}`
    );
    yield put(GetFactorySuccess(response.data));
  } catch (error) {
    yield put(GetFactoryFailure(error));
  }
}

function* fetchFactoryDocuments() {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/factoryOwner/getalluploadeddocument"
    );
    const data = response.data;
    yield put(fetchFactoryDocumentsSuccess(data));
  } catch (error) {
    yield put(fetchFactoryDocumentsFailure(error));
  }
}

function* fetchAllRevenue(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/revenue/search",
      action.payload
    );
    yield put(getAllRevenueSuccess(response.data));
  } catch (error) {
    yield put(getAllRevenueFailure(error.message));
  }
}

function* fetchAllFactoryType(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/factorytype/search",
      action.payload
    );
    yield put(getFactoryTypeSuccess(response.data));
  } catch (error) {
    yield put(getFactoryTypeFailure(error.message));
  }
}

function* sellerRegistration() {
  yield all([
    yield takeLatest(GET_SELLER_DOCUMENT_REQUEST, fetchDocuments),
    yield takeLatest(GET_FACTORY_DOCUMENT_REQUEST, fetchDocumentsForFactory),
    yield takeLatest(CREATE_SELLER_REQUEST, createSeller),
    yield takeLatest(CREATE_FACTORY_OWNER_REQUEST, createFactoryOwnerSaga),
    yield takeLatest(GET_FACTORY_OWNER_LIST_REQUEST, getFactoryOwnerListSaga),
    yield takeLatest(UPDATE_FACTORY_OWNER_REQUEST, updateFactoryOwner),
    yield takeLatest(FETCH_FACTORY_OWNER_REQUEST, fetchFactoryOwnerData),
    yield takeLatest(FETCH_FACTORY_REQUEST, getFactoryListSaga),
    yield takeLatest(FETCH_FACTORY_BY_ID_REQUEST, fetchFactoryData),
    yield takeLatest(UPDATE_FACTORY_REQUEST, updateFactory),
    yield takeLatest(GET_SELLER_DOCUMENT_REQUEST, fetchFactoryDocuments),
    yield takeLatest(GET_ALL_REVENUES_REQUEST, fetchAllRevenue),
    yield takeLatest(GET_ALL_FACTORY_TYPE_REQUEST, fetchAllFactoryType),
  ]);
}

export default sellerRegistration;
