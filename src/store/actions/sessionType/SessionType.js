import {
  FETCH_SESSION_TYPE_FAILURE,
  FETCH_SESSION_TYPE_REQUEST,
  FETCH_SESSION_TYPE_SUCCESS,
} from "../../actionLabels/sessionType/SessionType";

export const fetchSessionTypeRequest = (url) => ({
  type: FETCH_SESSION_TYPE_REQUEST,
  payload: { url },
});

export const fetchSessionTypeSuccess = (data) => ({
  type: FETCH_SESSION_TYPE_SUCCESS,
  payload: data,
});

export const fetchSessionTypeFailure = (error) => ({
  type: FETCH_SESSION_TYPE_FAILURE,
  payload: error, 
});
