import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import * as actionTypes from "../../actionLabels";
import { toast } from "react-toastify";
import * as invoiceGen from "../../actions";
import {
  getAllTaxInvoiceActionSuccess,
  getAllTaxInvoiceActionFail,
  getAllTaxInvoiceBuyerActionSuccess,
  getAllTaxInvoiceBuyerActionFail,
  getAllTaxInvoiceGenActionSuccess,
  getAllTaxInvoiceGenActionFail,
  getAllTaxInvoiceSaleActionSuccess,
  getAllTaxInvoiceSaleActionFail,
  getAllTaxInvoiceLotActionSuccess,
  getAllTaxInvoiceLotActionFail,
  getAllTaxInvoiceSessionActionSuccess,
  getAllTaxInvoiceSessionActionFail,
  getInvoiceByIdActionSuccess,
  getInvoiceByIdActionFail,
  getInvoiceGstByIdActionSuccess,
  getInvoiceGstByIdActionFail,
  getGstExcelByIdActionSuccess,
  getGstExcelByIdActionFail,
  getExportDataSellerApiCall,
  getExportDataSellerFail,
  getExportDataSellerSuccess,
  getInvoicenotGenActionFail,
  getInvoicenotGenActionSuccess,
  InvoiceApiStatus,
} from "../../actions";
import CustomToast from "../../../components/Toast";

function* getAllTaxInvoiceSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/postauction/buyertaxinvoice/search `,
      action.payload
    );

    if (response.status === 200) {
      yield put(getAllTaxInvoiceActionSuccess(response.data));
    } else {
      yield put(getAllTaxInvoiceActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllTaxInvoiceActionFail(error));
  }
}

function* getAllTaxInvoiceBuyer(action) {
  console.log("in saga0", action);

  try {
    const response = yield call(
      axiosMain.post,
      "/preauction/Common/BindSaleNoBySeason",
      action.payload
    );
    console.log("in saga", response);
    if (response.status === 200) {
      console.log("in saga1", response);

      yield put(getAllTaxInvoiceBuyerActionSuccess(response.data));
    } else {
      yield put(getAllTaxInvoiceBuyerActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllTaxInvoiceBuyerActionFail(error));
  }
}

function* getAllInvoiceGen(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/postauction/buyertaxinvoice/Invoicegenration`,
      action.payload
    );
    if (response.data.statusCode === 200) {
      yield put(getAllTaxInvoiceGenActionSuccess(response.data));
      toast.success("Invoice generation successful");
    } else if (response.data.statusCode === 500) {
      toast.success("Not Allow to Create Invoice  buyer or seller");
      yield put(getAllTaxInvoiceGenActionFail(response.message));
    } else {
      yield put(getAllTaxInvoiceGenActionFail(response.message));
    }
  } catch (error) {
    yield put(getAllTaxInvoiceGenActionFail(error));
  }
}

function* getAllInvoiceSale(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/Common/GetSaleProgramDetails`,
      action.payload
    );
    if (response.status == 200) {
      yield put(getAllTaxInvoiceSaleActionSuccess(response.data));
    } else {
      yield put(getAllTaxInvoiceSaleActionFail(""));
    }
  } catch (error) {
    yield put(getAllTaxInvoiceSaleActionFail(error));
  }
}

function* getAllInvoiceLot(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/postauction/dealbook/getlotnobysaleandseason`,
      action.payload
    );
    if (response.status === 200) {
      yield put(getAllTaxInvoiceLotActionSuccess(response.data));
    } else {
      yield put(getAllTaxInvoiceLotActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllTaxInvoiceLotActionFail(error));
  }
}

function* getAllInvoiceSession(action) {
  console.log("in sagas", action.payload);
  try {
    const response = yield call(
      axiosMain.post,
      `/preauction/Common/BindSessionTime`,
      action.payload
    );
    if (response.status === 200) {
      yield put(getAllTaxInvoiceSessionActionSuccess(response.data));
    } else {
      yield put(getAllTaxInvoiceSessionActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllTaxInvoiceSessionActionFail(error));
  }
}
function* getInvoiceById(action) {
  try {
    const Invoice = yield call(
      axiosMain.post,
      `/postauction/buyertaxinvoice/view/${action.payload}`
    );
    if (Invoice.status == 200) {
      yield put(getInvoiceByIdActionSuccess(Invoice.data));
    } else {
      yield put(getInvoiceByIdActionSuccess(Invoice.massage));
    }
  } catch (error) {
    yield put(getInvoiceByIdActionFail(error));
  }
}

function* getInvoiceGstId(action) {
  try {
    const url = action.payload.url;
    const data = action.payload.data;
    const response = yield call(axiosMain.post, url, data);

    if (response.status === 200) {
      if (response.data.statusCode === 200) {
        yield put(getExportDataSellerSuccess(response.data));
        yield put(getExportDataSellerApiCall(true));
        toast.success("IRN Excel SuccessFully");
      } else if (response.data.statusCode === 500) {
        CustomToast.error(response.data.message);
        yield put(getExportDataSellerFail(response.message));
        toast.error("IRN Excel UnsuccessFully");
      } else {
        yield put(getExportDataSellerFail(response.message));
        toast.error("IRN Excel UnsuccessFully");
      }
    }
  } catch (error) {
    yield put(getExportDataSellerFail(error));
  }
}
function* getGSTExcelId(action) {
  try {
    const urls = action.payload.urls;
    const apiPayload = action.payload.apiPayload;
    const GstExcel = yield call(axiosMain.post, urls, apiPayload);

    if (GstExcel.data.statusCode === 200) {
      yield put(getGstExcelByIdActionSuccess(GstExcel.data));
      toast.success("Upload Document SuccessFully.");
    } else if (GstExcel.data.statusCode === 500) {
      yield put(getGstExcelByIdActionFail(GstExcel.message));
      toast.error(GstExcel.data.message);
    } else {
      yield put(getGstExcelByIdActionFail(GstExcel.message));
      toast.error("Upload Document UnsuccessFully");
    }
  } catch (error) {
    yield put(getGstExcelByIdActionFail(error));
    toast.err("Upload Document error");
  }
}

function* getInvoicenotGen(action) {
  try {
    const dealBookId = action.payload.dealBookId;
    const northOrsouth = action.payload.northOrsouth;
    const Invoice = yield call(
      axiosMain.post,
      `/postauction/buyertaxinvoice/checkinvoicegenrateornot/${dealBookId}/${northOrsouth}`
    );
    if (Invoice.data.statusCode == 200) {
      yield put(getInvoicenotGenActionSuccess(Invoice.data));
      yield put(InvoiceApiStatus(true));
      // toast.success("Invoice  Genrated");
    } else if (Invoice.data.statusCode === 500) {
      yield put(getInvoicenotGenActionFail(Invoice.message));
      toast.error("Seller to Auctioneer Tax Invoice is not generated");
    } else {
      yield put(getInvoicenotGenActionFail(Invoice.message));
      toast.error(" Technical error");
    }
  } catch (error) {
    yield put(getInvoicenotGenActionFail(error));
  }
}

export function* allTaxInvoiceSaga() {
  yield all([
    yield takeEvery(actionTypes.GET_INVOICE_NOT_BY_ID, getInvoicenotGen),
    yield takeEvery(actionTypes.GET_GST_EXCEL_BY_ID, getGSTExcelId),
    yield takeEvery(actionTypes.GET_EXPORT_DATA_SELLER, getInvoiceGstId),
    yield takeEvery(actionTypes.GET_ALL_TAX_INVOICE, getAllTaxInvoiceSaga),
    yield takeEvery(
      actionTypes.GET_ALL_TAX_INVOICE_BUYER,
      getAllTaxInvoiceBuyer
    ),
    yield takeEvery(actionTypes.GET_ALL_TAX_INVOICE_GEN, getAllInvoiceGen),
    yield takeEvery(actionTypes.GET_ALL_TAX_INVOICE_SALE, getAllInvoiceSale),
    yield takeEvery(actionTypes.GET_ALL_TAX_INVOICE_LOT, getAllInvoiceLot),
    yield takeEvery(actionTypes.GET_INVOICE_BY_ID, getInvoiceById),
    yield takeEvery(
      actionTypes.GET_ALL_TAX_INVOICE_SESSION,
      getAllInvoiceSession
    ),
  ]);
}
