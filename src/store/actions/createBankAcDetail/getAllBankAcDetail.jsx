import * as actionTypes from "../../actionLabels/index";

export const fetchBankAc = () => {
  return {
    type: actionTypes.GET_ALL_BANKAC,
  };
};

export const fetchBankAcSuccess = (getAllBankAcActionSuccess) => {
  return {
    type: actionTypes.GET_ALL_BANKAC_SUCCESS,
    payload: getAllBankAcActionSuccess,
  };
};

export const fetchBankAcFail = (error) => {
  return {
    type: actionTypes.GET_ALL_BANKAC_FAIL,
    payload: error,
  };
};

export const fetchBankAcAsc = (payload) => {
  return {
    type: actionTypes.GET_ALL_BANKAC_ASC,
    payload: payload,
  };
};

export const fetchBankAcAscSuccess = (getAllBankAcActionSuccess) => {
  return {
    type: actionTypes.GET_ALL_BANKAC_SUCCESS_ASC,
    payload: getAllBankAcActionSuccess,
  };
};

export const fetchBankAcAscFail = (error) => {
  return {
    type: actionTypes.GET_ALL_BANKAC_FAIL_ASC,
    payload: error,
  };
};
export const getAllBankAcWithStatusAction = () => {
  return {
    type: actionTypes.GET_ALL_BANKAC_WITH_STATUS,
  };
};

export const getAllBankAcWithStatusActionSuccess = (getAllBankAcWithStatus) => {
  return {
    type: actionTypes.GET_ALL_BANKAC_WITH_STATUS_SUCCESS,
    payload: getAllBankAcWithStatus,
  };
};

export const getAllBankAcWithStatusActionFail = (error) => ({
  type: actionTypes.GET_ALL_BANKAC_WITH_STATUS_FAIL,
  payload: error,
});

export const createBankAcAction = (newBankAcData) => {
  return {
    type: actionTypes.CREATE_BANKAC,
    payload: newBankAcData,
  };
};

export const createBankAcActionSuccess = (createdBankAc) => {
  return {
    type: actionTypes.CREATE_BANKAC_SUCCESS,
    payload: createdBankAc,
  };
};

export const createBankAcActionFail = (error) => ({
  type: actionTypes.CREATE_BANKAC_FAIL,
  payload: error,
});

export const updateBankAcAction = (updatedBankAcData) => {
  return {
    type: actionTypes.UPDATE_BANKAC,
    payload: {
      updatedBankAcData,
    },
  };
};

export const updateBankAcActionSuccess = (updatedBankAc) => {
  return {
    type: actionTypes.UPDATE_BANKAC_SUCCESS,
    payload: updatedBankAc,
  };
};

export const updateBankAcActionFail = (error) => ({
  type: actionTypes.UPDATE_BANKAC_FAIL,
  payload: error,
});

export const searchBankAcAction = (searchTerm) => {
  return {
    type: actionTypes.SEARCH_BANKAC,
    payload: searchTerm,
  };
};

export const searchBankAcActionSuccess = (searchResults) => {
  return {
    type: actionTypes.SEARCH_BANKAC_SUCCESS,
    payload: searchResults,
  };
};

export const searchBankAcActionFail = (error) => ({
  type: actionTypes.SEARCH_BANKAC_FAIL,
  payload: error,
});

export const getBankAcByIdAction = (bankAccountDetailId) => {
  return {
    type: actionTypes.GET_BANKAC_BY_ID,
    payload: bankAccountDetailId,
  };
};

export const getBankAcByIdActionSuccess = (BankAcData) => {
  return {
    type: actionTypes.GET_BANKAC_BY_ID_SUCCESS,
    payload: BankAcData,
  };
};

export const getBankAcByIdActionFail = (error) => ({
  type: actionTypes.GET_BANKAC_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsBankAcAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_BANKAC,
  };
};

export const uploadAllDocumentsBankAcSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_BANKAC_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsBankAcFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_BANKAC_FAIL,
  payload: error,
});

export const createEditBankAcDetailsApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_BANK_AC_DETAILS_API_STATUS,
    payload: { data: data },
  };
};
