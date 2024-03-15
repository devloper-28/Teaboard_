// kutchaCatalogueActions.js
import {
  FETCH_KUTCHA_CATALOGUE_FAILURE,
  FETCH_KUTCHA_CATALOGUE_REQUEST,
  FETCH_KUTCHA_CATALOGUE_SUCCESS,
  GENERATE_LOT_NO_FAILURE,
  GENERATE_LOT_NO_REQUEST,
  GENERATE_LOT_NO_SUCCESS,
  UPDATE_KUTCHA_CATALOGUE_FAILURE,
  UPDATE_KUTCHA_CATALOGUE_REQUEST,
  UPDATE_KUTCHA_CATALOGUE_SUCCESS,
} from "../../actionLabels";

export const fetchKutchaCatalogueRequest = (requestData) => ({
  type: FETCH_KUTCHA_CATALOGUE_REQUEST,
  payload: requestData,
});

export const fetchKutchaCatalogueSuccess = (data) => ({
  type: FETCH_KUTCHA_CATALOGUE_SUCCESS,
  payload: data,
});

export const fetchKutchaCatalogueFailure = (error) => ({
  type: FETCH_KUTCHA_CATALOGUE_FAILURE,
  payload: error,
});


export const generateLotNoRequest = (data) => ({
  type: GENERATE_LOT_NO_REQUEST,
  payload: data,
});

export const generateLotNoSuccess = (lotNo) => ({
  type: GENERATE_LOT_NO_SUCCESS,
  payload: lotNo,
});

export const generateLotNoFailure = (error) => ({
  type: GENERATE_LOT_NO_FAILURE,
  payload: error,
});


export const updateKutchaCatalogueRequest = (data) => ({
  type: UPDATE_KUTCHA_CATALOGUE_REQUEST,
  payload: data,
});

export const updateKutchaCatalogueSuccess = (response) => ({
  type: UPDATE_KUTCHA_CATALOGUE_SUCCESS,
  payload: response,
});

export const updateKutchaCatalogueFailure = (error) => ({
  type: UPDATE_KUTCHA_CATALOGUE_FAILURE,
  payload: error,
});