import * as actionLabels from "../../actionLabels";

// GET ALL CHARGE LIST
export const getAllChargeAction = () => {
  return {
    type: actionLabels.GET_ALL_CHARGE,
  };
};

export const getAllChargeActionSuccess = (getAllCharge) => {
  return {
    type: actionLabels.GET_ALL_CHARGE_SUCCESS,
    payload: getAllCharge,
  };
};

export const getAllChargeActionFail = (error) => ({
  type: actionLabels.GET_ALL_CHARGE_FAIL,
  payload: error,
});

export const getAllChargeActionAsc = (data) => {
  return {
    type: actionLabels.GET_ALL_CHARGE_ASC,
    payload: data,
  };
};

export const getAllChargeActionSuccessAsc = (getAllChargeAsc) => {
  return {
    type: actionLabels.GET_ALL_CHARGE_SUCCESS_ASC,
    payload: getAllChargeAsc,
  };
};

export const getAllChargeActionFailAsc = (error) => ({
  type: actionLabels.GET_ALL_CHARGE_FAIL_ASC,
  payload: error,
});

// Action creator for creating a charge
export const createChargeAction = (newChargeData) => {
  return {
    type: actionLabels.CREATE_CHARGE,
    payload: newChargeData,
  };
};

export const createChargeActionSuccess = (createdCharge) => {
  return {
    type: actionLabels.CREATE_CHARGE_SUCCESS,
    payload: createdCharge,
  };
};

export const createChargeActionFail = (error) => ({
  type: actionLabels.CREATE_CHARGE_FAIL,
  payload: error,
});
//console.error("error:raction", createStateActionFail.payload);

// Action creator for updating a charge
export const updateChargeAction = (updatedchargeData) => {
  return {
    type: actionLabels.UPDATE_CHARGE,
    payload: {
      updatedchargeData,
    },
  };
};

export const updateChargeActionSuccess = (updatedCharge) => {
  return {
    type: actionLabels.UPDATE_CHARGE_SUCCESS,
    payload: updatedCharge,
  };
};

export const updateChargeActionFail = (error) => ({
  type: actionLabels.UPDATE_CHARGE_FAIL,
  payload: error,
});

// Action creator for searching a CHARGE
export const searchChargeAction = (searchTerm) => {
  return {
    type: actionLabels.SEARCH_CHARGE,
    payload: searchTerm,
  };
};

export const searchChargeActionSuccess = (searchResults) => {
  return {
    type: actionLabels.SEARCH_CHARGE_SUCCESS,
    payload: searchResults,
  };
};

export const searchChargeActionFail = (error) => ({
  type: actionLabels.SEARCH_CHARGE_FAIL,
  payload: error,
});

// Action creator for getting CHARGE by CHARGE ID
export const getChargeByIdAction = (chargeId) => {
  return {
    type: actionLabels.GET_CHARGE_BY_ID,
    payload: chargeId,
  };
};

export const getChargeByIdActionSuccess = (chargeData) => {
  return {
    type: actionLabels.GET_CHARGE_BY_ID_SUCCESS,
    payload: chargeData,
  };
};

export const getChargeByIdActionFail = (error) => ({
  type: actionLabels.GET_CHARGE_BY_ID_FAIL,
  payload: error,
});

// Action creator for uploading all documents
export const uploadAllDocumentsChargeAction = () => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_CHARGE,
  };
};

export const uploadAllDocumentsChargeSuccess = (documents) => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_CHARGE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsChargeFail = (error) => ({
  type: actionLabels.UPLOAD_ALL_DOCUMENTS_CHARGE_FAIL,
  payload: error,
});

export const createEditChargeMasterApiStatus = (data) => {
  return {
    type: actionLabels.CREATE_EDIT_CHARGE_MASTER_API_STATUS,
    payload: { data: data },
  };
};
