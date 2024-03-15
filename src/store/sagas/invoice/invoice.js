// commonSaga.js
import { takeLatest, put, call } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  addInvoiceDetailsFailure,
  addInvoiceDetailsSuccess,
  deleteInvoiceDetailsFailure,
  deleteInvoiceDetailsSuccess,
  fetchInvoiceDetailsFailure,
  fetchInvoiceDetailsSuccess,
  updateInvoiceDetailsFailure,
  updateInvoiceDetailsSuccess,
} from "../../actions/invoice/invoiceActions";
import {
  ADD_INVOICE_DETAILS_REQUEST,
  DELETE_INVOICE_DETAILS_REQUEST,
  FETCH_INVOICE_DETAILS_ID_REQUEST,
  FETCH_INVOICE_DETAILS_REQUEST,
  UPDATE_INVOICE_DETAILS_REQUEST,
} from "../../actionLabels/invoice/invoiceLabels";

// Worker Saga: Makes the API call when the FETCH_INVOICE_DETAILS_REQUEST action is dispatched
function* fetchInvoiceDetailsSaga(payload) {
  try {
    let { auctionCenterId, markId, role, saleNo, season, status } =
      payload.payload;
    const response = yield call(
      axiosMain.post,
      "/preauction/InvoiceDetails/GetInvoiceDetails?role=" + role,
      { auctionCenterId, markId, saleNo, season, status }
    );
    yield put(fetchInvoiceDetailsSuccess(response.data));
  } catch (error) {
    yield put(fetchInvoiceDetailsFailure(error.message));
  }
}
// Watcher Saga: Watches for the FETCH_INVOICE_DETAILS_REQUEST action and calls the worker saga
export function* watchFetchInvoiceDetails() {
  yield takeLatest(FETCH_INVOICE_DETAILS_REQUEST, fetchInvoiceDetailsSaga);
}

function* fetchInvoiceDetailsByIdSaga(action) {
  try {
    const invoiceId = action.payload;

    const response = yield call(
      axiosMain.post,
      `/preauction/InvoiceDetails/GetInvoiceDetailsById?invoiceId=${invoiceId}`
    );
    yield put(fetchInvoiceDetailsSuccess(response.data));
  } catch (error) {
    yield put(fetchInvoiceDetailsFailure(error.message));
  }
}

export function* watchFetchInvoiceDetailsById() {
  yield takeLatest(
    FETCH_INVOICE_DETAILS_ID_REQUEST,
    fetchInvoiceDetailsByIdSaga
  );
}

// API Function to add invoice details
function* addInvoiceDetailsApi(invoiceData) {
  try {
    const response = yield call(
      axiosMain.post,
      "/preauction/InvoiceDetails/AddInvoiceDetails",
      invoiceData
    );
    return response;
  } catch (error) {
    throw error;
  }
}

// Saga worker function
function* addInvoiceDetailsSaga(action) {
  try {
    const response = yield call(addInvoiceDetailsApi, action.payload);
    yield put(addInvoiceDetailsSuccess(response.data));
  } catch (error) {
    yield put(addInvoiceDetailsFailure(error.message));
  }
}

// Saga watcher function
export function* watchAddInvoiceDetails() {
  yield takeLatest(ADD_INVOICE_DETAILS_REQUEST, addInvoiceDetailsSaga);
}

// API Function to update invoice details
function* updateInvoiceDetailsApi(invoiceData) {
  try {
    const response = yield call(
      axiosMain.post,
      "/preauction/InvoiceDetails/UpdateInvoiceDetails",
      invoiceData
    );
    return response;
  } catch (error) {
    throw error;
  }
}
function* updateInvoiceDetailsSaga(action) {
  try {
    const response = yield call(updateInvoiceDetailsApi, action.payload);
    yield put(updateInvoiceDetailsSuccess(response.data));
  } catch (error) {
    yield put(updateInvoiceDetailsFailure(error.message));
  }
}

// Saga watcher function
export function* watchUpdateInvoiceDetails() {
  yield takeLatest(UPDATE_INVOICE_DETAILS_REQUEST, updateInvoiceDetailsSaga);
}

// API Function to delete invoice details by ID
function* deleteInvoiceDetailsApi(invoiceId) {
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/InvoiceDetails/DeleteInvoiceDetails?invoiceId=${invoiceId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

// Saga worker function
function* deleteInvoiceDetailsSaga(action) {
  try {
    const response = yield call(deleteInvoiceDetailsApi, action.payload);
    yield put(deleteInvoiceDetailsSuccess(response.data));
  } catch (error) {
    yield put(deleteInvoiceDetailsFailure(error.message));
  }
}

// Saga watcher function
export function* watchDeleteInvoiceDetails() {
  yield takeLatest(DELETE_INVOICE_DETAILS_REQUEST, deleteInvoiceDetailsSaga);
}
