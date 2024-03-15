import { call, all, put, takeLatest } from "redux-saga/effects";
import CustomToast from "../../../components/Toast";
import axiosMain from "../../../http/axios/axios_main";
import { ADD_WAREHOUSE_BILL_CHARGE_EXCEL_REQUEST, ADD_WAREHOUSE_BILL_CHARGE_REQUEST, DELETE_WAREHOUSE_REQUEST, FETCH_BILL_NUMBER_REQUEST, FETCH_DATA_REQUEST, SEARCH_WAREHOUSE_BILL_REQUEST } from "../../actionLabels/addWarehouseBillUploads/addWarehouseBillUploads";
import { addWarehouseBillChargeExcelFailure, addWarehouseBillChargeExcelSuccess, addWarehouseBillChargeFailure, addWarehouseBillChargeSuccess, deleteWarehouseFailure, deleteWarehouseSuccess, fetchBillNumberFailure, fetchBillNumberSuccess, fetchDataFailure, fetchDataSuccess, searchWarehouseBillFailure, searchWarehouseBillSuccess } from "../../actions";

function* WarehouseBillManual(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/postauction/warehouseuser/addwarehousebillcharge",
      action.payload
    );
    if (response.data.statusCode === 200) {
      CustomToast.success(response.data.message);
      yield put(addWarehouseBillChargeSuccess(response.data));
    } else {
      CustomToast.error(response.data.message);
      yield put(addWarehouseBillChargeFailure(response.data.message));
    }
  } catch (error) {
    yield put(addWarehouseBillChargeFailure(error.message));
  }
}

function* AddWarehouseExcel(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/postauction/warehouseuser/addwarehousebillchargeForExcel",
      action.payload
    );
    if (response.data.statusCode === 200) {
      CustomToast.success(response.data.message);
      yield put(addWarehouseBillChargeExcelSuccess(response.data));
    } else {
      CustomToast.error(response.data.message);
      yield put(addWarehouseBillChargeExcelFailure(response.data.message));
    }
  } catch (error) {
    yield put(addWarehouseBillChargeExcelFailure(error.message));
  }
}

function* SearchManageWarehouse(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/postauction/warehouseBill/warehouse/search",
      action.payload
    );
    if (response.data.statusCode === 200) {
      yield put(searchWarehouseBillSuccess(response.data.responseData));
    } else if (response.data.statusCode === 404){
      yield put(searchWarehouseBillSuccess(response.data.responseData));
    }else {
      yield put(searchWarehouseBillFailure(response.data.message));
    }
  } catch (error) {
    yield put(searchWarehouseBillFailure(error.message));
  }
}



function* EditManageWarehouse(action) {
  try {
    const response = yield call(
      axiosMain.get,
      `/postauction/warehouseBill/warehouse/getedit/${action.payload}`,
      action.payload
    );
    if (response.data.statusCode === 200) {
      CustomToast.success(response.data.message);
      yield put(fetchDataSuccess(response.data));
    } else {
      CustomToast.error(response.data.message);
      yield put(fetchDataFailure(response.data.message));
    }
  } catch (error) {
    yield put(fetchDataFailure(error.message));
  }
}
function* DeleteManageWarehouse(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/postauction/warehouseBill/warehouse/delete/${action.payload}`,
      action.payload
    );
    if (response.data.statusCode === 200) {
      CustomToast.success(response.data.message);
      yield put(deleteWarehouseSuccess(response.data));
    } else {
      CustomToast.error(response.data.message);
      yield put(deleteWarehouseFailure(response.data.message));
    }
  } catch (error) {
    yield put(deleteWarehouseFailure(error.message));
  }
}

function* checkbillNo(action) {
  try {
    const response = yield call(
      axiosMain.get,
      `/postauction/warehouseuser/checkbillNumber/${action.payload}`
    );
    if (response.data.statusCode === 200) {
      CustomToast.success(response.data.message);
      yield put(fetchBillNumberSuccess(response.data));
    } else {
      CustomToast.error(response.data.message);
      yield put(fetchBillNumberFailure(response.data.message));
    }
  } catch (error) {
    yield put(fetchBillNumberFailure(error.message));
  }
}




function* WarehouseBillUpload() {
  yield all([
    yield takeLatest(FETCH_BILL_NUMBER_REQUEST, checkbillNo),
    yield takeLatest(ADD_WAREHOUSE_BILL_CHARGE_REQUEST, WarehouseBillManual),
    yield takeLatest(ADD_WAREHOUSE_BILL_CHARGE_EXCEL_REQUEST, AddWarehouseExcel),
    yield takeLatest(SEARCH_WAREHOUSE_BILL_REQUEST, SearchManageWarehouse),
    yield takeLatest(FETCH_DATA_REQUEST, EditManageWarehouse),
    yield takeLatest(DELETE_WAREHOUSE_REQUEST, DeleteManageWarehouse),
  ]);
}

export default WarehouseBillUpload;
