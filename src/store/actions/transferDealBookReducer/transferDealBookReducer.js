import { TRANSFER_DEALBOOK_FAILURE, TRANSFER_DEALBOOK_REQUEST, TRANSFER_DEALBOOK_SUCCESS } from "../../actionLabels/transferDealBookReducer/transferDealBookReducer";

export const transferDealBookRequest = (data) => ({
  type: TRANSFER_DEALBOOK_REQUEST,
  payload: data,
});

export const transferDealBookSuccess = (message) => ({
  type: TRANSFER_DEALBOOK_SUCCESS,
  payload: { message },
});

export const transferDealBookFailure = (error) => ({
  type: TRANSFER_DEALBOOK_FAILURE,
  payload: { error },
});