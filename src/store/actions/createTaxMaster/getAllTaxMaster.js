import * as actionTypes from "../../actionLabels/index";

export const fetchTaxMaster = () => {
  // {
  //   console.log("actions::")
  // }
  return {
    type: actionTypes.GET_ALL_TAXMASTER,
  };
};

export const fetchTaxMasterSuccess = (getAllTaxMasterActionSuccess) => {
  return {
    type: actionTypes.GET_ALL_TAXMASTER_SUCCESS,
    payload: getAllTaxMasterActionSuccess,
  };
};

export const fetchTaxMasterFail = (error) => {
  return {
    type: actionTypes.GET_ALL_TAXMASTER_FAIL,
    payload: error,
  };
};
//GET ALL TAXMASTER WITH STATUS.
export const getAllTaxMasterWithStatusAction = () => {
  return {
    type: actionTypes.GET_ALL_TAXMASTER_WITH_STATUS,
  };
};

export const getAllTaxMasterWithStatusActionSuccess = (
  getAllTaxMasterWithStatus
) => {
  return {
    type: actionTypes.GET_ALL_TAXMASTER_WITH_STATUS_SUCCESS,
    payload: getAllTaxMasterWithStatus,
  };
};

export const getAllTaxMasterWithStatusActionFail = (error) => ({
  type: actionTypes.GET_ALL_TAXMASTER_WITH_STATUS_FAIL,
  payload: error,
});

// Action creator for creating a TAXMASTER
export const createTaxMasterAction = (newTaxMasterData) => {
  return {
    type: actionTypes.CREATE_TAXMASTER,
    payload: newTaxMasterData,
  };
};

export const createTaxMasterActionSuccess = (createdTaxMaster) => {
  return {
    type: actionTypes.CREATE_TAXMASTER_SUCCESS,
    payload: createdTaxMaster,
  };
};

export const createTaxMasterActionFail = (error) => ({
  type: actionTypes.CREATE_TAXMASTER_FAIL,
  payload: error,
});

// Action creator for updating a TAXMASTER
export const updateTaxMasterAction = (updatedTaxMasterData) => {
  return {
    type: actionTypes.UPDATE_TAXMASTER,
    payload: {
      updatedTaxMasterData,
    },
  };
};

export const updateTaxMasterActionSuccess = (updatedTaxMaster) => {
  return {
    type: actionTypes.UPDATE_TAXMASTER_SUCCESS,
    payload: updatedTaxMaster,
  };
};

export const updateTaxMasterActionFail = (error) => ({
  type: actionTypes.UPDATE_TAXMASTER_FAIL,
  payload: error,
});

// Action creator for searching a TAXMASTER
export const searchTaxMasterAction = (searchTerm) => {
  //console.log("in action",searchTerm)
  return {
    type: actionTypes.SEARCH_TAXMASTER,
    payload: searchTerm,
  };
};

export const searchTaxMasterActionSuccess = (searchResults) => {
  return {
    type: actionTypes.SEARCH_TAXMASTER_SUCCESS,
    payload: searchResults,
  };
};

export const searchTaxMasterActionFail = (error) => ({
  type: actionTypes.SEARCH_TAXMASTER_FAIL,
  payload: error,
});

// Action creator for getting TAXMASTER by TAXMASTER ID
export const getTaxMasterByIdAction = (taxMasterId) => {
  return {
    type: actionTypes.GET_TAXMASTER_BY_ID,
    payload: taxMasterId,
  };
};

export const getTaxMasterByIdActionSuccess = (TaxMasterData) => {
  return {
    type: actionTypes.GET_TAXMASTER_BY_ID_SUCCESS,
    payload: TaxMasterData,
  };
};

export const getTaxMasterByIdActionFail = (error) => ({
  type: actionTypes.GET_TAXMASTER_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsTaxMasterAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_TAXMASTER,
  };
};

export const uploadAllDocumentsTaxMasterSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_TAXMASTER_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsTaxMasterFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_TAXMASTER_FAIL,
  payload: error,
});

export const createEditTaxMasterApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_TAX_MASTER_API_STATUS,
    payload: { data: data },
  };
};
