import { call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import * as actionTypes from "../../actionLabels";
import * as auctionCenterActions from "../../actions";
import {
  ADD_AWR_REQUEST,
  FETCH_AWR_DETAILS_BY_INVOICE_ID_REQUEST,
  FETCH_AWR_LIST_REQUEST,
  GET_INVOICES_BY_AWR_DETAILS_REQUEST,
} from "../../actionLabels/awr/awr";

// fetch awr list
const fetchAwrListAPI = (
  season,
  saleNo,
  markId,
  wareHouseUserRegId,
  awrReferenceNo,
  grade,
  auctionCenterId,
) => {
  return axiosMain.post("/preauction/AWRDetails/GetAWRList", {
    season,
    saleNo,
    markId,
    wareHouseUserRegId,
    awrReferenceNo,
    grade,
    auctionCenterId,
  });
};

function* fetchAwrListSaga(action) {
  try {
    // Destructure the payload
    const {
      season,
      saleNo,
      markId,
      wareHouseUserRegId,
      awrReferenceNo,
      grade,
      auctionCenterId,
    } = action.payload;

    // Make the API call using the fetchAwrListAPI function
    const response = yield call(
      fetchAwrListAPI,
      season,
      saleNo,
      markId,
      wareHouseUserRegId,
      awrReferenceNo,
      grade,
      auctionCenterId
    );

    // Dispatch success action with the received AWR list
    yield put(auctionCenterActions.fetchAwrListSuccess(response.data));
  } catch (error) {
    // Dispatch failure action with the error message
    yield put(auctionCenterActions.fetchAwrListFailure(error.message));
  }
}

// fetch awr details by invoice
const fetchAwrDetailsByInvoiceIdAPI = (
  invoiceId,
  markId,
  season,
  saleNo,
  status
) => {
  return axiosMain.post("/preauction/InvoiceDetails/GetAWRDetailsById", {
    invoiceId,
    markId,
    season,
    saleNo,
    status,
  });
};

function* fetchAwrDetailsByInvoiceIdSaga(action) {
  try {
    // Destructure the payload
    const { invoiceId, markId, season, saleNo, status } = action.payload;

    // Make the API call using the fetchAwrDetailsByInvoiceIdAPI function
    const response = yield call(
      fetchAwrDetailsByInvoiceIdAPI,
      invoiceId,
      markId,
      season,
      saleNo,
      status
    );

    // Dispatch success action with the received AWR details
    yield put(
      auctionCenterActions.fetchAwrDetailsByInvoiceIdSuccess(response.data)
    );
  } catch (error) {
    // Dispatch failure action with the error message
    yield put(
      auctionCenterActions.fetchAwrDetailsByInvoiceIdFailure(error.message)
    );
  }
}

// add awr saga
const addAwrAPI = (awrData) => {
  return axiosMain.post("/preauction/AWRDetails/UploadAWRDetails", awrData);
};

function* addAwrSaga(action) {
  try {
    // Make the API call using the addAwrAPI function
    yield call(addAwrAPI, action.payload);

    // Dispatch success action after adding AWR
    yield put(auctionCenterActions.addAwrSuccess());
  } catch (error) {
    // Dispatch failure action with the error message
    yield put(auctionCenterActions.addAwrFailure(error.message));
  }
}

// Get Invoices by AWR details
const getInvoicesByAwrDetailsAPI = (awrDetails) => {
  return axiosMain.post(
    "/preauction/AWRDetails/GetInvoicesByAWRDetails",
    awrDetails
  );
};

function* getInvoicesByAwrDetailsSaga(action) {
  try {
    // Make the API call using the getInvoicesByAwrDetailsAPI function
    const response = yield call(getInvoicesByAwrDetailsAPI, action.payload);

    // Dispatch success action with the received invoices
    yield put(
      auctionCenterActions.getInvoicesByAwrDetailsSuccess(response.data)
    );
  } catch (error) {
    // Dispatch failure action with the error message
    yield put(
      auctionCenterActions.getInvoicesByAwrDetailsFailure(error.message)
    );
  }
}

export default function* awrSaga() {
  yield takeEvery(FETCH_AWR_LIST_REQUEST, fetchAwrListSaga);
  yield takeEvery(
    FETCH_AWR_DETAILS_BY_INVOICE_ID_REQUEST,
    fetchAwrDetailsByInvoiceIdSaga
  );
  yield takeEvery(ADD_AWR_REQUEST, addAwrSaga);
  yield takeEvery(
    GET_INVOICES_BY_AWR_DETAILS_REQUEST,
    getInvoicesByAwrDetailsSaga
  );
}
