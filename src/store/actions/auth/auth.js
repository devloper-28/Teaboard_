import * as actionLabels from "../../actionLabels";

export const loginAction = (payload) => {
  return {
    type: actionLabels.LOGIN_ACTION,
    payload: payload,
  };
};

export const loginActionSuccess = (payload) => {
  return {
    type: actionLabels.LOGIN_ACTION_SUCCESS,
    payload,
  };
};

export const loginActionFail = (payload) => ({
  type: actionLabels.LOGIN_ACTION_FAIL,
  payload,
});


export const fetchTokenRequest = (userCode) => ({
  type: actionLabels.FETCH_TOKEN_REQUEST,
  payload: { userCode }
});

export const fetchTokenSuccess = (responseData) => ({
  type: actionLabels.FETCH_TOKEN_SUCCESS,
  payload: { responseData }
});

export const fetchTokenFailure = (error) => ({
  type: actionLabels.FETCH_TOKEN_FAILURE,
  payload: { error }
});