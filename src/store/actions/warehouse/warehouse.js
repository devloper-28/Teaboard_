import {
  FETCH_WAREHOUSE_USER_FAILURE,
  FETCH_WAREHOUSE_USER_REQUEST,
  FETCH_WAREHOUSE_USER_SUCCESS,
} from "../../actionLabels";

export const fetchWarehouseUserRequest = (data) => ({
  type: FETCH_WAREHOUSE_USER_REQUEST,
  payload: data,
});

export const fetchWarehouseUserSuccess = (data) => ({
  type: FETCH_WAREHOUSE_USER_SUCCESS,
  payload: data,
});

export const fetchWarehouseUserFailure = (error) => ({
  type: FETCH_WAREHOUSE_USER_FAILURE,
  payload: error,
});
