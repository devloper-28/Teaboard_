import { FETCH_FACTORY_DETAIL_FAILURE, FETCH_FACTORY_DETAIL_REQUEST, FETCH_FACTORY_DETAIL_SUCCESS, FETCH_WAREHOUSE_DATA_FAILURE, FETCH_WAREHOUSE_DATA_REQUEST, FETCH_WAREHOUSE_DATA_SUCCESS, FETCH_WAREHOUSE_EDIT_FAILURE, FETCH_WAREHOUSE_EDIT_REQUEST, FETCH_WAREHOUSE_EDIT_SUCCESS, FETCH_WAREHOUSE_FAILURE, FETCH_WAREHOUSE_REQUEST, FETCH_WAREHOUSE_SUCCESS, REJECT_BILL_FAILURE, REJECT_BILL_REQUEST, REJECT_BILL_SUCCESS } from "../../actionLabels/rejectWarehouseBill/rejectWarehouseBill";

export const fetchFactoryDetailRequest = (userId) => ({
    type: FETCH_FACTORY_DETAIL_REQUEST,
    payload:userId,
  });
  
  export const fetchFactoryDetailSuccess = (data) => ({
    type: FETCH_FACTORY_DETAIL_SUCCESS,
    payload:data,
  });
  
  export const fetchFactoryDetailFailure = (error) => ({
    type: FETCH_FACTORY_DETAIL_FAILURE,
    payload:error,
  });


  export const fetchWarehouseRequest = (payload) => ({
    type: FETCH_WAREHOUSE_REQUEST,
    payload: payload,
  });
  
  export const fetchWarehouseSuccess = (data) => ({
    type: FETCH_WAREHOUSE_SUCCESS,
    payload: data,
  });
  
  export const fetchWarehouseFailure = (error) => ({
    type: FETCH_WAREHOUSE_FAILURE,
    payload: error,
  });

  export const rejectBillRequest = (payload) => ({
    type: REJECT_BILL_REQUEST,
    payload : payload,
  });
  
  export const rejectBillSuccess = (data) => ({
    type: REJECT_BILL_SUCCESS,
    payload: { data },
  });
  
  export const rejectBillFailure = (error) => ({
    type: REJECT_BILL_FAILURE,
    payload: { error },
  });

  export const fetchWarehouseDataRequest = (billChargeId) => ({
    type: FETCH_WAREHOUSE_DATA_REQUEST,
    payload:billChargeId
  });
  
  export const fetchWarehouseDataSuccess = (data) => ({
    type: FETCH_WAREHOUSE_DATA_SUCCESS,
    payload: data,
  });
  
  export const fetchWarehouseDataFailure = (error) => ({
    type: FETCH_WAREHOUSE_DATA_FAILURE,
    payload: error,
  });


  export const fetchWarehouseEditRequest = (id) => ({
    type: FETCH_WAREHOUSE_EDIT_REQUEST,
    payload: id,
  });
  
  export const fetchWarehouseEditSuccess = (data) => ({
    type: FETCH_WAREHOUSE_EDIT_SUCCESS,
    payload: data,
  });
  
  export const fetchWarehouseEditFailure = (error) => ({
    type: FETCH_WAREHOUSE_EDIT_FAILURE,
    payload: error,
  });
