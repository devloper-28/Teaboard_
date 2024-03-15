import * as actionTypes from "../../actionLabels/index";

export const getChangePassword = (payload) => {
  return {
    type: actionTypes.GET_ALL_CHANGE_PWD,
    payload: payload,
  };
};

export const fetchChangePwdSuccess = (getAllChangePwdSActionSuccess) => {
  return {
    type: actionTypes.GET_ALL_CHANGE_PWD_SUCCESS,
    payload: getAllChangePwdSActionSuccess,
  };
};

export const fetchChangePwdSFail = (error) => {
  return {
    type: actionTypes.GET_ALL_CHANGE_PWD_FAIL,
    payload: error,
  };
};
