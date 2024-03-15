import * as actionLabels from "../../actionLabels";

export const getAllAuctionCenterAction = () => {
  return {
    type: actionLabels.GET_ALL_AUCTION_CENTER,
  };
};

export const getAllAuctionCenterActionSuccess = (getAllAuctionCenter) => {
  return {
    type: actionLabels.GET_ALL_AUCTION_CENTER_SUCCESS,
    payload: getAllAuctionCenter,
  };
};

export const getAllAuctionCenterActionFail = (error) => ({
  type: actionLabels.GET_ALL_AUCTION_CENTER_FAIL,
  payload: error,
});

export const getAllAuctionCenterAscAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_AUCTION_CENTER_ASC,
    payload: payload,
  };
};

export const getAllAuctionCenterAscActionSuccess = (getAllAuctionCenterAsc) => {
  return {
    type: actionLabels.GET_ALL_AUCTION_CENTER_SUCCESS_ASC,
    payload: getAllAuctionCenterAsc,
  };
};

export const getAllAuctionCenterAscActionFail = (error) => ({
  type: actionLabels.GET_ALL_AUCTION_CENTER_FAIL_ASC,
  payload: error,
});

export const getAllAuctionRegionCenterAction = () => {
  return {
    type: actionLabels.GET_ALL_AUCTION_REGION_CENTER,
  };
};

export const getAllAuctionCenterRegionActionSuccess = (
  getAllAuctionCenterRegion
) => {
  return {
    type: actionLabels.GET_ALL_AUCTION_REGION_CENTER_SUCCESS,
    payload: getAllAuctionCenterRegion,
  };
};

export const getAllAuctionCenterRegionActionFail = (error) => ({
  type: actionLabels.GET_ALL_AUCTION_REGION_CENTER_FAIL,
  payload: error,
});

// Action creator for updating an auction center
export const updateAuctionCenterAction = (updatedData) => {
  return {
    type: actionLabels.UPDATE_AUCTION_CENTER,
    payload: updatedData,
  };
};

export const updateAuctionCenterActionSuccess = (updatedAuctionCenter) => {
  return {
    type: actionLabels.UPDATE_AUCTION_CENTER_SUCCESS,
    payload: updatedAuctionCenter,
  };
};

export const updateAuctionCenterActionFail = (error) => {
  return {
    type: actionLabels.UPDATE_AUCTION_CENTER_FAIL,
    payload: error,
  };
};

// Action creator for creating a new auction center
export const createAuctionCenterAction = (newAuctionCenterData) => {
  return {
    type: actionLabels.CREATE_AUCTION_CENTER,
    payload: newAuctionCenterData,
  };
};

export const createAuctionCenterActionSuccess = (createdAuctionCenter) => {
  return {
    type: actionLabels.CREATE_AUCTION_CENTER_SUCCESS,
    payload: createdAuctionCenter,
  };
};

export const createAuctionCenterActionFail = (error) => {
  return {
    type: actionLabels.CREATE_AUCTION_CENTER_FAIL,
    payload: error,
  };
};
//Type
export const createAuctionCenterActionType = () => {
  return {
    type: actionLabels.CREATE_AUCTION_CENTER_TYPE,
  };
};
export const createAuctionCenterActionTypeSuccess = (createdAuctionCenter) => {
  return {
    type: actionLabels.CREATE_AUCTION_CENTER_TYPE_SUCCESS,
    payload: createdAuctionCenter,
  };
};

export const createAuctionCenterActionTypeFail = (error) => {
  return {
    type: actionLabels.CREATE_AUCTION_CENTER_TYPE_FAIL,
    payload: error,
  };
};

// Action creator for searching auction centers
export const searchAuctionCenterAction = (searchTerm) => {
  return {
    type: actionLabels.SEARCH_AUCTION_CENTER,
    payload: searchTerm,
  };
};

export const searchAuctionCenterActionSuccess = (searchResults) => {
  return {
    type: actionLabels.SEARCH_AUCTION_CENTER_SUCCESS,
    payload: searchResults,
  };
};

export const searchAuctionCenterActionFail = (error) => {
  return {
    type: actionLabels.SEARCH_AUCTION_CENTER_FAIL,
    payload: error,
  };
};

// Action creator for getting an auction center by its ID
export const getAuctionCenterByIdAction = (auctionCenterId) => {
  return {
    type: actionLabels.GET_AUCTION_CENTER_BY_ID,
    payload: auctionCenterId,
  };
};

export const getAuctionCenterByIdActionSuccess = (auctionCenter) => {
  return {
    type: actionLabels.GET_AUCTION_CENTER_BY_ID_SUCCESS,
    payload: auctionCenter,
  };
};

export const getAuctionCenterByIdActionFail = (error) => {
  return {
    type: actionLabels.GET_AUCTION_CENTER_BY_ID_FAIL,
    payload: error,
  };
};

// Action creator for uploading all documents
export const uploadAllDocumentsAuctionCenterAction = () => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER,
  };
};

export const uploadAllDocumentsAuctionCenterSuccess = (documents) => {
  return {
    type: actionLabels.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsAuctionCenterFail = (error) => ({
  type: actionLabels.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER_FAIL,
  payload: error,
});

export const createEditAuctionCenterApiStatus = (data) => {
  return {
    type: actionLabels.CREATE_EDIT_AUCTION_CENTER_API_STATUS,
    payload: { data: data },
  };
};

//
export const userWiseAuctionCenterDetails = (data) => {
  return {
    type: actionLabels.USER_WISE_AUCTION_CENTER_DETAILS,
    payload: data,
  };
};

export const userWiseAuctionCenterDetailsSuccess = (data) => {
  return {
    type: actionLabels.USER_WISE_AUCTION_CENTER_DETAILS_SUCCESS,
    payload: data,
  };
};

export const userWiseAuctionCenterDetailsFail = (error) => ({
  type: actionLabels.USER_WISE_AUCTION_CENTER_DETAILS_FAIL,
  payload: error,
});

export const submitUnMappedAuctionCenterDetails = (data) => {
  return {
    type: actionLabels.SUBMIT_UNMAPPED_AUCTION_CENTER_DETAILS,
    payload: data,
  };
};

export const submitUnMappedAuctionCenterDetailsSuccess = (data) => {
  return {
    type: actionLabels.SUBMIT_UNMAPPED_AUCTION_CENTER_DETAILS_SUCCESS,
    payload: data,
  };
};

export const submitUnMappedAuctionCenterDetailsFail = (error) => ({
  type: actionLabels.SUBMIT_UNMAPPED_AUCTION_CENTER_DETAILS_FAIL,
  payload: error,
});

export const isSubmitUnMappedAuctionCenterDetailsSuccess = (data) => {
  return {
    type: actionLabels.IS_SUBMIT_UNMAPPED_AUCTION_CENTER_DETAILS_SUCCESS,
    payload: data,
  };
};

export const getServerDateAndTimeAction = () => {
  return {
    type: actionLabels.GET_SERVER_DATE_AND_TIME,
  };
};

export const getServerDateAndTimeSuccess = (data) => {
  return {
    type: actionLabels.GET_SERVER_DATE_AND_TIME_SUCCESS,
    payload: data,
  };
};
