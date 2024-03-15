// actions.js
import * as actionLabels from "../../actionLabels/index";

export const fetchSaleNumbersRequest = (season) => ({
  type: actionLabels.FETCH_SALE_NUMBERS_REQUEST,
  payload: season,
});

export const fetchSaleNumbersSuccess = (saleNumbers) => ({
  type: actionLabels.FETCH_SALE_NUMBERS_SUCCESS,
  payload: saleNumbers,
});

export const fetchSaleNumbersFailure = (error) => ({
  type: actionLabels.FETCH_SALE_NUMBERS_FAILURE,
  payload: error,
});
