import * as actionTypes from "../../actionLabels/configureParameter/configureParameter";

export const getConfigParam = (payloadConfigParamData) => {
  return {
    type: actionTypes.GET_ALL_CONFIGURE_PARAMETER,
    payload: payloadConfigParamData,
  };
};

export const getConfigParamSuccess = (ConfigParamData) => {
  return {
    type: actionTypes.GET_ALL_CONFIGURE_PARAMETER_SUCCESS,
    payload: ConfigParamData,
  };
};

export const getConfigParamFail = (error) => {
  return {
    type: actionTypes.GET_ALL_CONFIGURE_PARAMETER_FAIL,
    payload: error,
  };
};

// Action creator for creating a ConfigParam
export const createConfigParamAction = (newConfigParamData) => {
  return {
    type: actionTypes.CREATE_CONFIGURE_PARAMETER,
    payload: newConfigParamData,
  };
};

export const createConfigParamActionSuccess = (createdConfigParam) => {
  return {
    type: actionTypes.CREATE_CONFIGURE_PARAMETER_SUCCESS,
    payload: createdConfigParam,
  };
};

export const createConfigParamActionFail = (error) => ({
  type: actionTypes.CREATE_CONFIGURE_PARAMETER_FAIL,
  payload: error,
});

// Action creator for updating a ConfigParam
export const updateConfigParamAction = (updatedConfigParamData) => {
  return {
    type: actionTypes.UPDATE_CONFIGURE_PARAMETER,
    payload: {
      updatedConfigParamData,
    },
  };
};

export const updateConfigParamActionSuccess = (updatedConfigParam) => {
  return {
    type: actionTypes.UPDATE_CONFIGURE_PARAMETER_SUCCESS,
    payload: updatedConfigParam,
  };
};

export const updateConfigParamActionFail = (error) => ({
  type: actionTypes.UPDATE_CONFIGURE_PARAMETER_FAIL,
  payload: error,
});

// Action creator for getting state by ConfigParam ID
export const getConfigParamByIdAction = (ConfigParamId) => {
  return {
    type: actionTypes.GET_CONFIGURE_PARAMETER_BY_ID,
    payload: ConfigParamId,
  };
};

export const getConfigParamByIdActionSuccess = (ConfigParamData) => {
  return {
    type: actionTypes.GET_CONFIGURE_PARAMETER_BY_ID_SUCCESS,
    payload: ConfigParamData,
  };
};

export const getConfigParamByIdActionFail = (error) => ({
  type: actionTypes.GET_CONFIGURE_PARAMETER_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsConfigParamAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM,
  };
};

export const uploadAllDocumentsConfigParamSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsConfigParamFail = (error) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM_FAIL,
    payload: error,
  };
};

export const createEditConfigureParameterApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_CONFIGURE_PARAMETER_API_STATUS,
    payload: { data: data },
  };
};



// configureParameterActions.js

export const fetchPriceRangeRequest = () => ({
  type: actionTypes.FETCH_PRICE_RANGE_REQUEST,
});

export const fetchPriceRangeSuccess = (data) => ({
  type: actionTypes.FETCH_PRICE_RANGE_SUCCESS,
  payload: data,
});

export const fetchPriceRangeFailure = (error) => ({
  type: actionTypes.FETCH_PRICE_RANGE_FAILURE,
  payload: error,
});


export const createAuctionRequest = (data) => ({
  type: actionTypes.CREATE_AUCTION_REQUEST,
  payload: data,
});

export const createAuctionSuccess = () => ({
  type: actionTypes.CREATE_AUCTION_SUCCESS,
});

export const createAuctionFailure = (error) => ({
  type: actionTypes.CREATE_AUCTION_FAILURE,
  payload: error,
});

export const fetchAuctionDataRequest = (requestData) => ({
  type: actionTypes.FETCH_AUCTION_DATA_REQUEST,
  payload: requestData,
});

export const fetchAuctionDataSuccess = (responseData) => ({
  type: actionTypes.FETCH_AUCTION_DATA_SUCCESS,
  payload: responseData,
});

export const fetchAuctionDataFailure = (error) => ({
  type: actionTypes.FETCH_AUCTION_DATA_FAILURE,
  payload: error,
});

export const fetchAuctionDataOptionRequest = (requestData) => ({
  type: actionTypes.FETCH_AUCTION_DATA_REQUEST,
  payload: requestData,
});

export const fetchAuctionDataOptionSuccess = (responseData) => ({
  type: actionTypes.FETCH_AUCTION_DATA_SUCCESS,
  payload: responseData,
});

export const fetchAuctionDataOptionFailure = (error) => ({
  type: actionTypes.FETCH_AUCTION_DATA_FAILURE,
  payload: error,
});


// export const englishAuctionSearchRequest = (requestData) => ({
//   type: actionTypes.ENGLISH_AUCTION_SEARCH_REQUEST,
//   payload: requestData,
// });

// export const englishAuctionSearchSuccess = (responseData) => ({
//   type: actionTypes.ENGLISH_AUCTION_SEARCH_SUCCESS,
//   payload: responseData,
// });

// export const englishAuctionSearchFailure = (error) => ({
//   type: actionTypes.ENGLISH_AUCTION_SEARCH_FAILURE,
//   payload: error,
// });