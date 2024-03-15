import { FETCH_USER_RIGHTS_FAILURE, FETCH_USER_RIGHTS_REQUEST, FETCH_USER_RIGHTS_SUCCESS } from "../../actionLabels";

export const fetchUserRightsRequest = (auctionCenterId, userId) => ({
    type: FETCH_USER_RIGHTS_REQUEST,
    payload: { auctionCenterId, userId },
  });
  
  export const fetchUserRightsSuccess = (data) => ({
    type: FETCH_USER_RIGHTS_SUCCESS,
    payload: data,
  });
  
  export const fetchUserRightsFailure = (error) => ({
    type: FETCH_USER_RIGHTS_FAILURE,
    payload: error,
  });