import * as actionTypes from "../../actionLabels/chargeCode/chargeCode";

export const getChargeCode = (payloadChargeCodeData) => {
  return {
    type: actionTypes.GET_ALL_CHARGE_CODE,
    payload: payloadChargeCodeData,
  };
};

export const getChargeCodeSuccess = (chargeCodeData) => {
  return {
    type: actionTypes.GET_ALL_CHARGE_CODE_SUCCESS,
    payload: chargeCodeData,
  };
};

export const getChargeCodeFail = (error) => {
  return {
    type: actionTypes.GET_ALL_CHARGE_CODE_FAIL,
    payload: error,
  };
};

export const getChargeCodeAsc = (payload) => {
  return {
    type: actionTypes.GET_ALL_CHARGE_CODE_ASC,
    payload: payload,
  };
};

export const getChargeCodeAscSuccess = (chargeCodeData) => {
  return {
    type: actionTypes.GET_ALL_CHARGE_CODE_SUCCESS_ASC,
    payload: chargeCodeData,
  };
};

export const getChargeCodeAscFail = (error) => {
  return {
    type: actionTypes.GET_ALL_CHARGE_CODE_FAIL_ASC,
    payload: error,
  };
};

export const getChargeCodeWithoutFilter = (payloadChargeCodeData) => {
  return {
    type: actionTypes.GET_ALL_CHARGE_CODE_WITHOUT_FILTER,
    payload: payloadChargeCodeData,
  };
};

export const getChargeCodeSuccessWithoutFilter = (chargeCodeData) => {
  return {
    type: actionTypes.GET_ALL_CHARGE_CODE_WITHOUT_FILTER_SUCCESS,
    payload: chargeCodeData,
  };
};

export const getChargeCodeFailWithoutFilter = (error) => {
  return {
    type: actionTypes.GET_ALL_CHARGE_CODE_WITHOUT_FILTER_FAIL,
    payload: error,
  };
};

// Action creator for creating a ChargeCode
export const createChargeCodeAction = (newChargeCodeData) => {
  return {
    type: actionTypes.CREATE_CHARGE_CODE,
    payload: newChargeCodeData,
  };
};

export const createChargeCodeActionSuccess = (createdChargeCode) => {
  return {
    type: actionTypes.CREATE_CHARGE_CODE_SUCCESS,
    payload: createdChargeCode,
  };
};

export const createChargeCodeActionFail = (error) => ({
  type: actionTypes.CREATE_CHARGE_CODE_FAIL,
  payload: error,
});

// Action creator for updating a ChargeCode
export const updateChargeCodeAction = (updatedChargeCodeData) => {
  return {
    type: actionTypes.UPDATE_CHARGE_CODE,
    payload: {
      updatedChargeCodeData,
    },
  };
};

export const updateChargeCodeActionSuccess = (updatedChargeCode) => {
  return {
    type: actionTypes.UPDATE_CHARGE_CODE_SUCCESS,
    payload: updatedChargeCode,
  };
};

export const updateChargeCodeActionFail = (error) => ({
  type: actionTypes.UPDATE_CHARGE_CODE_FAIL,
  payload: error,
});

// Action creator for getting state by ChargeCode ID
export const getChargeCodeByIdAction = (ChargeCodeId) => {
  return {
    type: actionTypes.GET_CHARGE_CODE_BY_ID,
    payload: ChargeCodeId,
  };
};

export const getChargeCodeByIdActionSuccess = (ChargeCodeData) => {
  return {
    type: actionTypes.GET_CHARGE_CODE_BY_ID_SUCCESS,
    payload: ChargeCodeData,
  };
};

export const getChargeCodeByIdActionFail = (error) => ({
  type: actionTypes.GET_CHARGE_CODE_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsChargeCodeAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_CHARGE_CODE,
  };
};

export const uploadAllDocumentsChargeCodeSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_CHARGE_CODE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsChargeCodeFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_CHARGE_CODE_FAIL,
  payload: error,
});

export const createEditChargeCodeApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_CHARGE_CODE_API_STATUS,
    payload: { data: data },
  };
};
