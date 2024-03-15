import {
  FETCH_MARK_FAILURE,
  FETCH_MARK_REQUEST,
  FETCH_MARK_SUCCESS,
  FETCH_MARK_TYPE_FAILURE,
  FETCH_MARK_TYPE_REQUEST,
  FETCH_MARK_TYPE_SUCCESS,
} from "../../actionLabels";

export const fetchMarkRequest = (action) => ({
  type: FETCH_MARK_REQUEST,
  payload: action,
});

export const fetchMarkSuccess = (data) => ({
  type: FETCH_MARK_SUCCESS,
  payload: data,
});

export const fetchMarkFailure = (error) => ({
  type: FETCH_MARK_FAILURE,
  payload: error,
});

export const fetchMarkTypeRequest = () => ({
  type: FETCH_MARK_TYPE_REQUEST,
});

export const fetchMarkTypeSuccess = (data) => ({
  type: FETCH_MARK_TYPE_SUCCESS,
  payload: data,
});

export const fetchMarkTypeFailure = (error) => ({
  type: FETCH_MARK_TYPE_FAILURE,
  payload: error,
});
