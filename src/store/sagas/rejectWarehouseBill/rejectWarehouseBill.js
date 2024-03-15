/* eslint-disable no-unused-vars */
import { call, all, put, takeLatest } from "redux-saga/effects";
import CustomToast from "../../../components/Toast";
import axiosMain from "../../../http/axios/axios_main";
import { fetchFactoryDetailFailure, fetchFactoryDetailSuccess, fetchWarehouseDataFailure, fetchWarehouseDataSuccess, fetchWarehouseEditFailure, fetchWarehouseEditSuccess, fetchWarehouseFailure, fetchWarehouseSuccess, rejectBillFailure, rejectBillSuccess } from "../../actions/rejectWarehouseBill/rejectWarehouseBill";
import { FETCH_FACTORY_DETAIL_REQUEST, FETCH_WAREHOUSE_DATA_REQUEST, FETCH_WAREHOUSE_EDIT_REQUEST, FETCH_WAREHOUSE_REQUEST, REJECT_BILL_REQUEST } from "../../actionLabels/rejectWarehouseBill/rejectWarehouseBill";

function* rejectWarehouseBillSearch(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/factory/dropdown/getFactoryDetailByUserId",
      action.payload
    );
    if (response.data.statusCode === 200) { 
      yield put(fetchFactoryDetailSuccess(response.data));
    } else {
      // CustomToast.error(response.data.message);
      yield put(fetchFactoryDetailFailure(response.data.message));
    }
  } catch (error) {
    yield put(fetchFactoryDetailFailure(error.message));
  }
}
 


function* RejectwarehouseData(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/postauction/warehouseBill/seller/search`,
      action.payload
    ); 
    if (response.data.statusCode === 200) {
      // CustomToast.success(response.data.message);
      yield put(fetchWarehouseSuccess(response.data.responseData));
    } else if (response.data.statusCode === 404){
      yield put(fetchWarehouseSuccess(response.data.responseData));
    }else {
      CustomToast.error(response.data.message);
      yield put(fetchWarehouseFailure(response.data.message));
    }
  } catch (error) {
    yield put(fetchWarehouseFailure(error.message));
  }
}



  function* Reject(action) {
    console.log(action.payload.data,'action.payload.data')
    try {
      const response = yield call(
        axiosMain.post,
        `/postauction/warehouseBill/seller/reject`,
        action.payload.data
      );
      if (response.data.statusCode === 200) {
        CustomToast.success(response.data.message);
        yield put(rejectBillSuccess(response.data));
      } else {
        CustomToast.error(response.data.message);
        yield put(rejectBillFailure(response.data.message));
      }
    } catch (error) {
      yield put(rejectBillFailure(error.message));
    }
  }


  function* ViewWarehouseBill(action) {
    try {
      const response = yield call(
        axiosMain.post,
        `/postauction/warehouseBill/warehouse/view`,
        action.payload
      );
      if (response.data.statusCode === 200) {
        // CustomToast.success(response.data.message);
        yield put(fetchWarehouseDataSuccess(response.data));
      } else {
        CustomToast.error(response.data.message);
        yield put(fetchWarehouseDataFailure(response.data.message));
      }
    } catch (error) {
      yield put(fetchWarehouseDataFailure(error.message));
    }
  }
 

  

  function* fetchWarehouseEdit(action) {
    try {
      const response = yield call(
        axiosMain.get,
        `/postauction/warehouseBill/warehouse/getedit/${action.payload}`
      );
      if (response.data.statusCode === 200) {
        // CustomToast.success(response.data.message);
        yield put(fetchWarehouseEditSuccess(response.data));
      } else {
        CustomToast.error(response.data.message);
        yield put(fetchWarehouseDataFailure(response.data.message));
      }
    } catch (error) {
      yield put(fetchWarehouseDataFailure(error.message));
    }
  }
 

function* rejectWarehouseBill() {
  yield all([
    yield takeLatest(FETCH_FACTORY_DETAIL_REQUEST, rejectWarehouseBillSearch),
    yield takeLatest(FETCH_WAREHOUSE_REQUEST, RejectwarehouseData),     
    yield takeLatest(REJECT_BILL_REQUEST, Reject),     
    yield takeLatest(FETCH_WAREHOUSE_DATA_REQUEST, ViewWarehouseBill),     
    yield takeLatest(FETCH_WAREHOUSE_EDIT_REQUEST, fetchWarehouseEdit),     
  ]);
}

export default rejectWarehouseBill;
