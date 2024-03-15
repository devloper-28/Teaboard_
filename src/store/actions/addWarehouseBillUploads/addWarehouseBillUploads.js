import {
  ADD_WAREHOUSE_BILL_CHARGE_EXCEL_FAILURE,
  ADD_WAREHOUSE_BILL_CHARGE_EXCEL_REQUEST,
  ADD_WAREHOUSE_BILL_CHARGE_EXCEL_SUCCESS,
  ADD_WAREHOUSE_BILL_CHARGE_FAILURE,
  ADD_WAREHOUSE_BILL_CHARGE_REQUEST,
  ADD_WAREHOUSE_BILL_CHARGE_SUCCESS,
  DELETE_WAREHOUSE_FAILURE,
  DELETE_WAREHOUSE_REQUEST,
  DELETE_WAREHOUSE_SUCCESS,
  FETCH_BILL_NUMBER_FAILURE,
  FETCH_BILL_NUMBER_REQUEST,
  FETCH_BILL_NUMBER_SUCCESS,
  FETCH_DATA_FAILURE,
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  SEARCH_WAREHOUSE_BILL_FAILURE,
  SEARCH_WAREHOUSE_BILL_REQUEST,
  SEARCH_WAREHOUSE_BILL_SUCCESS,
} from "../../actionLabels/addWarehouseBillUploads/addWarehouseBillUploads";

export const addWarehouseBillChargeRequest = (payload) => ({
  type: ADD_WAREHOUSE_BILL_CHARGE_REQUEST,
  payload: payload,
});

export const addWarehouseBillChargeSuccess = (data) => ({
  type: ADD_WAREHOUSE_BILL_CHARGE_SUCCESS,
  data: data,
});

export const addWarehouseBillChargeFailure = (error) => ({
  type: ADD_WAREHOUSE_BILL_CHARGE_FAILURE,
  error,
});


export const addWarehouseBillChargeExcelRequest = (data) => ({
  type: ADD_WAREHOUSE_BILL_CHARGE_EXCEL_REQUEST,
  payload: data,
});

export const addWarehouseBillChargeExcelSuccess = (response) => ({
  type: ADD_WAREHOUSE_BILL_CHARGE_EXCEL_SUCCESS,
  payload: response,
});

export const addWarehouseBillChargeExcelFailure = (error) => ({
  type: ADD_WAREHOUSE_BILL_CHARGE_EXCEL_FAILURE,
  payload: error,
});

export const searchWarehouseBill = (data) => ({
  type: SEARCH_WAREHOUSE_BILL_REQUEST,
  payload: data,
});

export const searchWarehouseBillSuccess = (data) => ({
  type: SEARCH_WAREHOUSE_BILL_SUCCESS,
  payload: data,
});

export const searchWarehouseBillFailure = (error) => ({
  type: SEARCH_WAREHOUSE_BILL_FAILURE,
  payload: error,
});

export const fetchDataRequest = (id) => ({
  type: FETCH_DATA_REQUEST,
  payload:id,
});

export const fetchDataSuccess = (data) => ({
  type: FETCH_DATA_SUCCESS,
  payload: data,
});

export const fetchDataFailure = (error) => ({
  type: FETCH_DATA_FAILURE,
  payload: error,
});

export const deleteWarehouseRequest = (id) => ({
  type: DELETE_WAREHOUSE_REQUEST,
  payload:id,
});

export const deleteWarehouseSuccess = (response) => ({
  type: DELETE_WAREHOUSE_SUCCESS,
  payload: response
});

export const deleteWarehouseFailure = (error) => ({
  type: DELETE_WAREHOUSE_FAILURE,
  payload: error
});



export const fetchBillNumberRequest = (id) => ({
  type: FETCH_BILL_NUMBER_REQUEST,
  payload: id,
});

export const fetchBillNumberSuccess = (data) => ({
  type: FETCH_BILL_NUMBER_SUCCESS,
  payload: data,
});

export const fetchBillNumberFailure = (error) => ({
  type: FETCH_BILL_NUMBER_FAILURE,
  payload: error,
});