// reducer.js

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
  
  const initialState = {
    data: [],
    loading: false,
    error: null,
    dataById: [],
    adding: false,
    addingError: null,
    updating: false,
    updatingError: null,
    deleting: false,
    deletingError: null,
  };
  
  const lotSeriesReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_LOT_SERIES_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_LOT_SERIES_SUCCESS:
        return {
          ...state,
          loading: false,
          data: action.payload,
        };
      case FETCH_LOT_SERIES_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case FETCH_LOT_SERIES_BY_ID_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_LOT_SERIES_BY_ID_SUCCESS:
        return {
          ...state,
          loading: false,
          dataById: action.payload,
        };
      case FETCH_LOT_SERIES_BY_ID_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      case ADD_LOT_SERIES_REQUEST:
        return {
          ...state,
          adding: true,
          addingError: null,
        };
      case ADD_LOT_SERIES_SUCCESS:
        return {
          ...state,
          adding: false,
          data: action.payload,
        };
      case ADD_LOT_SERIES_FAILURE:
        return {
          ...state,
          adding: false,
          addingError: action.payload,
        };
      case UPDATE_LOT_SERIES_REQUEST:
        return {
          ...state,
          updating: true,
          updatingError: null,
        };
      case UPDATE_LOT_SERIES_SUCCESS:
        return {
          ...state,
          updating: false,
          data: action.payload,
        };
      case UPDATE_LOT_SERIES_FAILURE:
        return {
          ...state,
          updating: false,
          updatingError: action.payload,
        };
      case DELETE_LOT_SERIES_REQUEST:
        return {
          ...state,
          deleting: true,
          deletingError: null,
        };
      case DELETE_LOT_SERIES_SUCCESS:
        return {
          ...state,
          deleting: false,
          data: action.payload,
        };
      case DELETE_LOT_SERIES_FAILURE:
        return {
          ...state,
          deleting: false,
          deletingError: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default lotSeriesReducer;
  