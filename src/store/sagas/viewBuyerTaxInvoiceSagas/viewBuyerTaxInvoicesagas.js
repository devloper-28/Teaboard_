import { takeLatest, put, call, all } from "redux-saga/effects";
import * as allActions from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import * as labels from "../../actionLabels";
import CustomToast from "../../../components/Toast";

function* searchInvoiceSagas(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/postauction/buyertaxinvoice/searchInvoice",
      action.payload
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        yield put(allActions.get_searchinvoiceSuccess(response.data));
      } else {
        yield put(allActions.get_searchinvoiceFail(response.data.message));
      }
    } else {
      yield put(
        allActions.get_searchinvoiceFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      allActions.get_searchinvoiceFail(
        error.message || "Unknown error occurred."
      )
    );
  }
}
function* searchInvoiceViewSagas(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/postauction/buyertaxinvoice/invoiceView",
      action.payload
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        yield put(allActions.get_invoiceviewSuccess(response.data));
      } else {
        yield put(allActions.get_invoiceviewFail(response.data.message));
      }
    } else {
      yield put(
        allActions.get_invoiceviewFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      allActions.get_invoiceviewFail(error.message || "Unknown error occurred.")
    );
  }
}

function* getExportDataForViewBuyer(action) {
  try {
    const url = action.payload.url;
    const response = yield call(axiosMain.post, url, action.payload.data);

    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        yield put(allActions.getExportDataForViewBuyerSuccess(response.data));
        yield put(allActions.getExportDataForViewBuyerApiCall(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(allActions.getExportDataForViewBuyerFail(response.message));
      }
    } else {
      yield put(allActions.getExportDataForViewBuyerFail(response.message));
    }
  } catch (error) {
    yield put(allActions.getExportDataForViewBuyerFail(error));
  }
}

export function* invoiceSearchSagas() {
  yield all([
    yield takeLatest(
      labels.GET_EXPORT_DATA_FOR_VIEW_BUYER,
      getExportDataForViewBuyer
    ),
    yield takeLatest(labels.GET_SEARCHINVOICE, searchInvoiceSagas),
    yield takeLatest(labels.GET_INVOICEVIEW, searchInvoiceViewSagas),
  ]);
}
