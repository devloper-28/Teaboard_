import {
  ADD_LOT_SERIES_FAILURE,
  ADD_LOT_SERIES_REQUEST,
  ADD_LOT_SERIES_SUCCESS,
  DELETE_LOT_SERIES_FAILURE,
  DELETE_LOT_SERIES_REQUEST,
  DELETE_LOT_SERIES_SUCCESS,
  FETCH_LOT_SERIES_BY_ID_FAILURE,
  FETCH_LOT_SERIES_BY_ID_REQUEST,
  FETCH_LOT_SERIES_BY_ID_SUCCESS,
  FETCH_LOT_SERIES_FAILURE,
  FETCH_LOT_SERIES_REQUEST,
  FETCH_LOT_SERIES_SUCCESS,
  UPDATE_LOT_SERIES_FAILURE,
  UPDATE_LOT_SERIES_REQUEST,
  UPDATE_LOT_SERIES_SUCCESS,
} from "../../actionLabels";

export const fetchLotSeriesRequest = (requestData) => ({
  payload: requestData,
  type: FETCH_LOT_SERIES_REQUEST,
});

export const fetchLotSeriesSuccess = (data) => ({
  type: FETCH_LOT_SERIES_SUCCESS,
  payload: data,
});

export const fetchLotSeriesFailure = (error) => ({
  type: FETCH_LOT_SERIES_FAILURE,
  payload: error,
});

export const fetchLotSeriesByIdRequest = (requestData) => ({
  payload: requestData,
  type: FETCH_LOT_SERIES_BY_ID_REQUEST,
});

export const fetchLotSeriesByIdSuccess = (data) => ({
  type: FETCH_LOT_SERIES_BY_ID_SUCCESS,
  payload: data,
});

export const fetchLotSeriesByIdFailure = (error) => ({
  type: FETCH_LOT_SERIES_BY_ID_FAILURE,
  payload: error,
});

export const addLotSeriesRequest = (requestData) => ({
  type: ADD_LOT_SERIES_REQUEST,
  payload: requestData,
});

export const addLotSeriesSuccess = (responseData) => ({
  type: ADD_LOT_SERIES_SUCCESS,
  payload: responseData,
});

export const addLotSeriesFailure = (error) => ({
  type: ADD_LOT_SERIES_FAILURE,
  payload: error,
});

export const updateLotSeriesRequest = (requestData) => ({
  type: UPDATE_LOT_SERIES_REQUEST,
  payload: requestData,
});

export const updateLotSeriesSuccess = (responseData) => ({
  type: UPDATE_LOT_SERIES_SUCCESS,
  payload: responseData,
});

export const updateLotSeriesFailure = (error) => ({
  type: UPDATE_LOT_SERIES_FAILURE,
  payload: error,
});


export const deleteLotSeriesRequest = (requestData) => ({
  type: DELETE_LOT_SERIES_REQUEST,
  payload: requestData,
});

export const deleteLotSeriesSuccess = (responseData) => ({
  type: DELETE_LOT_SERIES_SUCCESS,
  payload: responseData,
});

export const deleteLotSeriesFailure = (error) => ({
  type: DELETE_LOT_SERIES_FAILURE,
  payload: error,
});