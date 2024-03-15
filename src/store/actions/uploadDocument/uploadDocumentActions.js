import * as actionLabels from "../../actionLabels/index";

// Action creator for getting state by state ID
export const getDocumentByIdAction = (documentId) => {
  return {
    type: actionLabels.GET_DOCUMENT_BY_ID,
    payload: documentId,
  };
};

export const getDocumentByIdActionSuccess = (documentData) => {
  return {
    type: actionLabels.GET_DOCUMENT_BY_ID_SUCCESS,
    payload: documentData,
  };
};

export const getDocumentByIdActionFail = (error) => ({
  type: actionLabels.GET_STATE_BY_ID_FAIL,
  payload: error,
});

// Action creator for getting state by state ID
export const getHistoryByIdAction = (tableName, moduleName, id) => {
  return {
    type: actionLabels.GET_HISTORY_BY_ID,
    payload: { tableName, moduleName, id },
  };
};

export const getHistoryByIdSuccess = (historyData) => {
  return {
    type: actionLabels.GET_HISTORY_BY_ID_SUCCESS,
    payload: historyData,
  };
};

export const getHistoryByIdFail = (error) => ({
  type: actionLabels.GET_HISTORY_BY_ID_FAIL,
  payload: error,
});

export const getExportData = (payload) => {
  return {
    type: actionLabels.GET_EXPORT_DATA,
    payload: payload,
  };
};

export const getExportDataSuccess = (payload) => {
  return {
    type: actionLabels.GET_EXPORT_DATA_SUCCESS,
    payload: payload,
  };
};

export const getExportDataFail = (error) => ({
  type: actionLabels.GET_EXPORT_DATA_FAIL,
  payload: error,
});

export const getExportDataApiCall = (payload) => {
  return {
    type: actionLabels.GET_EXPORT_DATA_API_CALL,
    payload: payload,
  };
};

export const getExportDataForView = (payload) => {
  return {
    type: actionLabels.GET_EXPORT_DATA_FOR_VIEW,
    payload: payload,
  };
};

export const getExportDataForViewSuccess = (payload) => {
  return {
    type: actionLabels.GET_EXPORT_DATA_FOR_VIEW_SUCCESS,
    payload: payload,
  };
};

export const getExportDataForViewFail = (error) => ({
  type: actionLabels.GET_EXPORT_DATA_FOR_VIEW_FAIL,
  payload: error,
});

export const getExportDataForViewApiCall = (payload) => {
  return {
    type: actionLabels.GET_EXPORT_DATA_FOR_VIEW_API_CALL,
    payload: payload,
  };
};
