import { takeLatest, put, call, all } from "redux-saga/effects";
import * as allActions from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import * as labels from "../../actionLabels";
import CustomToast from "../../../components/Toast";
function* sellertoauctioneerinvoice_search_Sagas(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/postauction/sellertoauctioneerinvoice/search",
      action.payload
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        yield put(
          allActions.sellertoauctioneerinvoice_search_Success(response.data)
        );
      } else {
        CustomToast.error(response.data);
        yield put(
          allActions.sellertoauctioneerinvoice_search_Fail(response.data)
        );
      }
    } else {
      CustomToast.error(response.data);
      yield put(
        allActions.sellertoauctioneerinvoice_search_Fail(
          response.data || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    // yield put(
    //   allActions.get_searchinvoiceFail(
    //     error.message || "Unknown error occurred."
    //   )
    // );
  }
}
function* viewinvoicedetail_Sagas(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/postauction/sellertoauctioneerinvoice/viewInvoiceDetail/" +
        action.payload
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        yield put(allActions.viewinvoicedetail_Success(response.data));
      } else {
        yield put(allActions.viewinvoicedetail_Fail(response.data.message));
      }
    } else {
      yield put(
        allActions.viewinvoicedetail_Fail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      allActions.viewinvoicedetail_Fail(
        error.message || "Unknown error occurred."
      )
    );
  }
}
function* sellertoauctioneerinvoice_create_Sagas(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/postauction/sellertoauctioneerinvoice/Create",
      action.payload
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(
          allActions.sellertoauctioneerinvoice_create_Success(response.data)
        );
      } else {
        CustomToast.error(response.data.message);
        yield put(
          allActions.sellertoauctioneerinvoice_create_Fail(
            response.data.message
          )
        );
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(
        allActions.sellertoauctioneerinvoice_create_Fail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      allActions.sellertoauctioneerinvoice_create_Fail(
        error.message || "Unknown error occurred."
      )
    );
  }
}

export function* generateSellerTaxInvoiceSagas() {
  yield all([
    yield takeLatest(
      labels.SELLERTOAUCTIONEERINVOICE_SEARCH,
      sellertoauctioneerinvoice_search_Sagas
    ),
    yield takeLatest(
      labels.SELLERTOAUCTIONEERINVOICE_VIEWINVOICEDETAIL,
      viewinvoicedetail_Sagas
    ),
    yield takeLatest(
      labels.SELLERTOAUCTIONEERINVOICE_CREATE,
      sellertoauctioneerinvoice_create_Sagas
    ),
  ]);
}
