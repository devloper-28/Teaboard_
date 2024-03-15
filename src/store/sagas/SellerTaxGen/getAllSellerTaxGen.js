import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import * as actionTypes from "../../actionLabels";
import {
  getAllSellerTaxGenActionSuccess,
  getAllSellerTaxGenActionFail,
  getAllSellerTaxGenBuyerActionSuccess,
  getAllSellerTaxGenBuyerActionFail,
  getAllSellerTaxGenGenActionSuccess,
  getAllSellerTaxGenGenActionFail,
  getAllSellerTaxGenSaleActionSuccess,
  getAllSellerTaxGenSaleActionFail,
  getAllSellerTaxGenSessionActionSuccess,
  getAllSellerTaxGenSessionActionFail,
  getSellerInvoiceByIdActionSuccess,
  getSellerInvoiceByIdActionFail,
  getAllauctionCenterdataActionSuccess,
  getAllauctionCenterdataActionFail,
  getChargeTaxByIdActionSuccess,
  getChargeTaxByIdActionFail,
  getAllSubmitChargeActionSuccess,
  getAllSubmitChargeActionFail,
} from "../../actions";
import CustomToast from "../../../components/Toast";
import { toast } from "react-toastify";

function* getAllSellerTaxGenSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/postauction/sellertaxinvoice/search`,
      action.payload
    );

    if (response.status === 200) {
      yield put(getAllSellerTaxGenActionSuccess(response.data));
    } else {
      yield put(getAllSellerTaxGenActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllSellerTaxGenActionFail(error));
  }
}

function* getAllAddSellerTaxGen(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/postauction/sellertaxinvoice/addcharges",
      action.payload
    );
    if (response.data.statusCode === 200) {
      yield put(getAllSellerTaxGenBuyerActionSuccess(response.data));
      toast.success("Seller Charges Submitted successfully");
    } else if (response.data.statusCode === 405) {
      toast.success("Seller Charges Already Submitted successfully");
    } else {
      yield put(getAllSellerTaxGenBuyerActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllSellerTaxGenBuyerActionFail(error));
    toast.success("Seller Charges  Submitted Unsuccessfully");
  }
}

function* getAllSubmitCharge(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/postauction/sellertaxinvoice/submitCharges",
      action.payload
    );
    if (response.status === 200) {
      yield put(getAllSubmitChargeActionSuccess(response.data));
    } else {
      yield put(getAllSubmitChargeActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllSubmitChargeActionFail(error));
  }
}

function* getAllModifyInvoiceGen(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/postauction/sellertaxinvoice/modifycharges`,
      action.payload
    );
    if (response.status === 200) {
      yield put(getAllSellerTaxGenGenActionSuccess(response.data));
    } else {
      yield put(getAllSellerTaxGenGenActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllSellerTaxGenGenActionFail(error));
  }
}

function* getAllInvoiceDelete(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/postauction/sellertaxinvoice/generateInvoice`,
      action.payload
    );
    if (response.status == 200) {
      yield put(getAllSellerTaxGenSaleActionSuccess(response.data));
    } else {
      yield put(getAllSellerTaxGenSaleActionSuccess(response.data));
    }
  } catch (error) {
    yield put(getAllSellerTaxGenSaleActionFail(error));
  }
}
function* getAllInvoiceSession(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/Common/BindSessionTime`,
      action.payload
    );
    if (response.status === 200) {
      yield put(getAllSellerTaxGenSessionActionSuccess(response.data));
    } else {
      yield put(getAllSellerTaxGenSessionActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllSellerTaxGenSessionActionFail(error));
  }
}
function* getInvoiceById(action) {
  try {
    const Invoice = yield call(
      axiosMain.get,
      `/postauction/sellertaxinvoice/viewInvoiceDetails/${action.payload}`
    );
    if (Invoice.status == 200) {
      yield put(getSellerInvoiceByIdActionSuccess(Invoice.data));
    } else {
      yield put(getSellerInvoiceByIdActionSuccess(Invoice.massage));
    }
  } catch (error) {
    yield put(getSellerInvoiceByIdActionFail(error));
  }
}

function* getAllauctionCenterdata(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/auctionCenter/dropdown/getUsersByAuctionCenter`,
      action.payload
    );
    if (response.status === 200) {
      yield put(getAllauctionCenterdataActionSuccess(response.data));
    } else {
      yield put(getAllauctionCenterdataActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllauctionCenterdataActionFail(error));
  }
}

function* getChargeById(action) {
  try {
    const Invoice = yield call(
      axiosMain.get,
      `/postauction/sellertaxinvoice/getCharges/${action.payload}`
    );
    if (Invoice.status == 200) {
      yield put(getChargeTaxByIdActionSuccess(Invoice.data));
    } else {
      yield put(getChargeTaxByIdActionSuccess(Invoice.massage));
    }
  } catch (error) {
    yield put(getChargeTaxByIdActionFail(error));
  }
}

export function* allSellerTaxGenInvoiceSaga() {
  yield all([
    yield takeEvery(actionTypes.GET_ALL_ADD_CHARGE_INVOICE, getAllSubmitCharge),
    yield takeEvery(
      actionTypes.GET_ALL_AUCTION_CENTER_INVOICE,
      getAllauctionCenterdata
    ),
    yield takeEvery(actionTypes.GET_ALL_CHARGE_TAX, getChargeById),
    yield takeEvery(
      actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE,
      getAllSellerTaxGenSaga
    ),
    yield takeEvery(
      actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_BUYER,
      getAllAddSellerTaxGen
    ),
    yield takeEvery(
      actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_GEN,
      getAllModifyInvoiceGen
    ),
    yield takeEvery(
      actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_SALE,
      getAllInvoiceDelete
    ),
    yield takeEvery(actionTypes.GET_SELLER_TAX_GEN_BY_ID, getInvoiceById),
    yield takeEvery(
      actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_SESSION,
      getAllInvoiceSession
    ),
  ]);
}
