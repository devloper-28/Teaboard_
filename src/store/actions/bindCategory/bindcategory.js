import {
  FETCH_CATEGORY_FAILURE,
  FETCH_CATEGORY_REQUEST,
  FETCH_CATEGORY_SUCCESS,
  FETCH_STATUS_FAILURE,
  FETCH_STATUS_REQUEST,
  FETCH_STATUS_SUCCESS,
} from "../../actionLabels";

export const fetchCategoryRequest = (data) => ({
  type: FETCH_CATEGORY_REQUEST,
  payload:data,
});

export const fetchCategorySuccess = (data) => ({
  type: FETCH_CATEGORY_SUCCESS,
  payload: data,
});

export const fetchCategoryFailure = (error) => ({
  type: FETCH_CATEGORY_FAILURE,
  payload: error,
});

export const fetchStatusRequest = (id) => ({
  type: FETCH_STATUS_REQUEST,
  payload: id, // Pass the categoryId directly as the payload
});

export const fetchStatusSuccess = (data) => ({
  type: FETCH_STATUS_SUCCESS,
  payload: { data },
});

export const fetchStatusFailure = (error) => ({
  type: FETCH_STATUS_FAILURE,
  payload: { error },
});
