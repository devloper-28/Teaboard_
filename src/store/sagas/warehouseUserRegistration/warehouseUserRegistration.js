// sagas.js
import { call, put, takeEvery } from "redux-saga/effects";
import axios, { all } from "axios"; // Make sure you've installed Axios

import axiosMain from "../../../http/axios/axios_main";
import {
  createEditApiStatusWarehouse,
  createUserFailure,
  createUserSuccess,
  createWarehouseUnitFailure,
  createWarehouseUnitSuccess,
  createWarehouseUserFailure,
  createWarehouseUserSuccess,
  fetchAuctionCenterFailure,
  fetchAuctionCenterSuccess,
  fetchAuctionFailure,
  fetchAuctionSuccess,
  fetchDocumentsFailure,
  fetchDocumentsSuccess,
  fetchStateFailure,
  fetchStateSuccess,
  fetchUnitDocumentsFailure,
  fetchUnitDocumentsSuccess,
  getDocumentDetailFailure,
  getDocumentDetailSuccess,
  getUnitFailure,
  getUnitSuccess,
  getUserFailure,
  getUserSuccess,
  getUsersFailure,
  getUsersSuccess,
  getWarehouseHistoryFailure,
  getWarehouseHistorySuccess,
  getWarehouseUnitHistoryFailure,
  getWarehouseUnitHistorySuccess,
  postWarehouseUserFailure,
  postWarehouseUserSuccess,
  searchUnitFailure,
  searchUnitSuccess,
  searchUsersFailure,
  searchUsersSuccess,
  searchWarehouseUnitsFailure,
  searchWarehouseUnitsSuccess,
  updateWarehouseUnitFailure,
  updateWarehouseUnitSuccess,
  updateWarehouseUserFailure,
  updateWarehouseUserSuccess,
} from "../../actions";
import {
  CREATE_USER_REQUEST,
  CREATE_WAREHOUSE_UNIT_REQUEST,
  CREATE_WAREHOUSE_USER_REQUEST,
  FETCH_AUCTION_CENTER_REQUEST,
  FETCH_AUCTION_REQUEST,
  FETCH_DOCUMENTS_REQUEST,
  FETCH_STATE_REQUEST,
  GET_ALL_UNIT_DOCUMENT_REQUEST,
  GET_DOCUMENT_DETAIL_REQUEST,
  GET_UNIT_BY_ID_REQUEST,
  GET_UNIT_HISTORY_REQUEST,
  GET_USERS_REQUEST,
  GET_USER_REQUEST,
  GET_WAREHOUSE_HISTORY_REQUEST,
  POST_WAREHOUSE_USER_REQUEST,
  SEARCH_UNIT_REQUEST,
  SEARCH_USERS_REQUEST,
  SEARCH_WAREHOUSE_UNITS_REQUEST,
  UPDATE_WAREHOUSE_UNIT_REQUEST,
  UPDATE_WAREHOUSE_USER_REQUEST,
} from "../../actionLabels";
import { Warehouse } from "@mui/icons-material";
import CustomToast from "../../../components/Toast";

// Replace with your API endpoint
const API_URL = "/admin/WareHouseUserReg/getalluploadeddocument";
const GET_ALL_USERS_API = "/admin/WareHouseUserReg/search";
const GET_PDF_API = "/admin/getdocumentdetail";
const CREATE_USER_API = "/admin/WareHouseUserReg/create";
const UPDATE_API = "/admin/WareHouseUserReg/update";
const AUCTION_CENTER = "/admin/auctionCenter/search";
const STATE_API = "/admin/state/search";
const SEARCH_API = "/admin/WareHouseUserReg/search";
const GET_USER_BY_ID = "/admin/WareHouseUserReg/get";
const CREATE_WAREHOUSE_UNIT = "/admin/wareHouseUserUnitReg/create";
const GET_UNIT_SEARCH_API = "/admin/wareHouseUserUnitReg/search";
const UNIT_SEARCH = "/admin/wareHouseUserUnitReg/search";
const UPDATE_UNIT = "/admin/wareHouseUserUnitReg/update";
const GET_UNIT_BY_ID = "/admin/wareHouseUserUnitReg/get";
const GET_ALL_UNIT_DOCUMENT =
  "/admin/wareHouseUserUnitReg/getalluploadeddocument";
const GET_WAREHOUSE_HISTORY = "/admin/getHistory/tbl_Role/Role";
const GET_UNIT_HISTORY = "/admin/getHistory/tbl_Role/Role";
// Axios GET request
function fetchDocumentsApi() {
  return axiosMain.get(API_URL);
}
function fetchUsersApi() {
  return axiosMain.post(GET_ALL_USERS_API, { isActive: 1 });
}
function DownloadPDF(documentId) {
  return axiosMain.get(`${GET_PDF_API}/${documentId}`);
}

function CreateUserAPI(UserData) {
  return axiosMain.post(CREATE_USER_API, UserData);
}

function UpdateUser(UpdatedData) {
  return axiosMain.post(UPDATE_API, UpdatedData);
}

function createWarehouseUnitAPI(WarehouseUnit) {
  return axiosMain.post(CREATE_WAREHOUSE_UNIT, WarehouseUnit);
}

function fetchAuctionCenter() {
  return axiosMain.post(AUCTION_CENTER, { isActive: 1 });
}

function fetchStateDataFromApi() {
  return axiosMain.post(STATE_API, { isActive: 1 });
}

function searchUsersFromApi(usersearch) {
  return axiosMain.post(SEARCH_API, usersearch, { isActive: 1 });
}

function getUsersById(userId) {
  return axiosMain.get(`${GET_USER_BY_ID}/${userId}`);
}

function GetWarehouseUnitsApi() {
  return axiosMain.post(GET_UNIT_SEARCH_API, {});
}

function SearchWarehouseUnitsApi(unitsearch) {
  return axiosMain.post(UNIT_SEARCH, unitsearch);
}

function getUnitById(unitId) {
  return axiosMain.get(`${GET_UNIT_BY_ID}/${unitId}`);
}

function updateWarehouseUnitApi(unitUpdate) {
  return axiosMain.post(UPDATE_UNIT, unitUpdate);
}

function GetUnitAllDocument() {
  return axiosMain.get(GET_ALL_UNIT_DOCUMENT);
}
function WarehouseHistoryApi(warehouseId) {
  return axiosMain.get(`${GET_WAREHOUSE_HISTORY}/${warehouseId}`);
}
function WarehouseUnitHistoryApi(warehouseUnitId) {
  return axiosMain.get(`${GET_UNIT_HISTORY}/${warehouseUnitId}`);
}

// Saga function to handle the API call
function* fetchDocuments() {
  try {
    const response = yield call(fetchDocumentsApi);
    const data = response.data;
    yield put(fetchDocumentsSuccess(data));
  } catch (error) {
    yield put(fetchDocumentsFailure(error));
  }
}

function* getUsers() {
  try {
    const users = yield call(fetchUsersApi);
    yield put(getUsersSuccess(users));
  } catch (error) {
    yield put(getUsersFailure(error.message));
  }
}

function* getDocumentDetail(action) {
  try {
    const documentId = action.payload;
    const response = yield call(DownloadPDF, documentId);
    const data = response.data;
    yield put(getDocumentDetailSuccess(data));
  } catch (error) {
    yield put(getDocumentDetailFailure(error));
  }
}

function* postWarehouseUserSaga(action) {
  try {
    const response = yield call(CreateUserAPI, action.payload);
    if (response.data.statusCode == 200) {
      CustomToast.success(response.data.message);
      yield put(postWarehouseUserSuccess(response.data));
      yield put(createEditApiStatusWarehouse(true));
    } else {
      CustomToast.error(response.data.message);
      yield put(postWarehouseUserFailure(response.data.message));
    }
  } catch (error) {
    yield put(postWarehouseUserFailure(error));
  }
}

function* updateWarehouseUser(action) {
  try {
    const response = yield call(UpdateUser, action.payload);
    if (response.data.statusCode == 200) {
      CustomToast.success(response.data.message);
      yield put(updateWarehouseUserSuccess(response.data));
      yield put(createEditApiStatusWarehouse(true));
    } else {
      CustomToast.error(response.data.message);
      yield put(updateWarehouseUserFailure(response.data.message));
    }
  } catch (error) {
    yield put(updateWarehouseUserFailure(error));
  }
}

function* fetchAuctionSaga() {
  try {
    const response = yield call(fetchAuctionCenter);
    yield put(fetchAuctionSuccess(response.data));
  } catch (error) {
    yield put(fetchAuctionFailure(error.message));
  }
}

function* fetchStateData() {
  try {
    const data = yield call(fetchStateDataFromApi);
    yield put(fetchStateSuccess(data));
  } catch (error) {
    yield put(fetchStateFailure(error));
  }
}

function* searchUsers(action) {
  try {
    const data = yield call(
      searchUsersFromApi,
      action.payload != "" ? action.payload : {}
    );
    yield put(searchUsersSuccess(data));
  } catch (error) {
    yield put(searchUsersFailure(error));
  }
}

function* getUserById(action) {
  try {
    const user = yield call(getUsersById, action.payload);

    yield put(getUserSuccess(user));
  } catch (error) {
    yield put(getUserFailure(error));
  }
}

function* createWarehouseUnit(action) {
  try {
    const response = yield call(createWarehouseUnitAPI, action.payload);
    if (response.data.statusCode == 200) {
      CustomToast.success(response.data.message);
      yield put(createWarehouseUnitSuccess(response.data));
      yield put(createEditApiStatusWarehouse(true));
    } else {
      CustomToast.error(response.data.message);
      yield put(createWarehouseUnitFailure(response.data.message));
    }
  } catch (error) {
    yield put(createWarehouseUnitFailure(error));
  }
}

function* searchWarehouseUnits(action) {
  try {
    const data = yield call(
      GetWarehouseUnitsApi,
      action.payload != "" ? action.payload : {}
    );
    yield put(searchWarehouseUnitsSuccess(data));
  } catch (error) {
    yield put(searchWarehouseUnitsFailure(error));
  }
}

function* searchUnitSaga(action) {
  try {
    const { params } = action;
    const result = yield call(SearchWarehouseUnitsApi, params);
    yield put(searchUnitSuccess(result));
  } catch (error) {
    yield put(searchUnitFailure(error));
  }
}

function* getUnitSaga(action) {
  try {
    const user = yield call(getUnitById, action.payload);
    yield put(getUnitSuccess(user.data));
  } catch (error) {
    yield put(getUnitFailure(error));
  }
}

function* updateWarehouseUnit(action) {
  try {
    const response = yield call(updateWarehouseUnitApi, action.payload);
    if (response.data.statusCode == 200) {
      CustomToast.success(response.data.message);
      yield put(updateWarehouseUnitSuccess(response.data));
      yield put(createEditApiStatusWarehouse(true));
    } else {
      CustomToast.error(response.data.message);
      yield put(updateWarehouseUnitFailure(response.data.message));
    }
  } catch (error) {
    yield put(updateWarehouseUnitFailure(error));
  }
}

function* fetchUnitDocuments() {
  try {
    const response = yield call(GetUnitAllDocument);
    const data = response.data;
    yield put(fetchUnitDocumentsSuccess(data));
  } catch (error) {
    yield put(fetchUnitDocumentsFailure(error));
  }
}

function* fetchWarehouseHistory(action) {
  try {
    const response = yield call(WarehouseHistoryApi, action.payload);
    yield put(getWarehouseHistorySuccess(response.data));
  } catch (error) {
    yield put(getWarehouseHistoryFailure(error.message));
  }
}

function* fetchWarehouseUnitHistory(action) {
  try {
    const response = yield call(WarehouseUnitHistoryApi, action.payload);
    yield put(getWarehouseUnitHistorySuccess(response.data));
  } catch (error) {
    yield put(getWarehouseUnitHistoryFailure(error.message));
  }
}

function* warehouseUserRegistration() {
  yield all([
    yield takeEvery(FETCH_DOCUMENTS_REQUEST, fetchDocuments),
    yield takeEvery(GET_USERS_REQUEST, getUsers),
    yield takeEvery(GET_DOCUMENT_DETAIL_REQUEST, getDocumentDetail),
    yield takeEvery(POST_WAREHOUSE_USER_REQUEST, postWarehouseUserSaga),
    yield takeEvery(UPDATE_WAREHOUSE_USER_REQUEST, updateWarehouseUser),
    yield takeEvery(FETCH_AUCTION_REQUEST, fetchAuctionSaga),
    yield takeEvery(FETCH_STATE_REQUEST, fetchStateData),
    yield takeEvery(SEARCH_USERS_REQUEST, searchUsers),
    yield takeEvery(GET_USER_REQUEST, getUserById),
    yield takeEvery(CREATE_WAREHOUSE_UNIT_REQUEST, createWarehouseUnit),
    yield takeEvery(SEARCH_WAREHOUSE_UNITS_REQUEST, searchWarehouseUnits),
    yield takeEvery(SEARCH_UNIT_REQUEST, searchUnitSaga),
    yield takeEvery(GET_UNIT_BY_ID_REQUEST, getUnitSaga),
    yield takeEvery(UPDATE_WAREHOUSE_UNIT_REQUEST, updateWarehouseUnit),
    yield takeEvery(GET_ALL_UNIT_DOCUMENT_REQUEST, fetchUnitDocuments),
    yield takeEvery(GET_WAREHOUSE_HISTORY_REQUEST, fetchWarehouseHistory),
    yield takeEvery(GET_UNIT_HISTORY_REQUEST, fetchWarehouseUnitHistory),
  ]);
}

export default warehouseUserRegistration;
