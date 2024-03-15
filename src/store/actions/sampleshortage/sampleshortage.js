import {
  CHECK_PACKAGE_FAILURE,
  CHECK_PACKAGE_REQUEST,
  CHECK_PACKAGE_SUCCESS,
  FETCH_SAMPLE_SHORTAGE_ID_FAILURE,
  FETCH_SAMPLE_SHORTAGE_ID_REQUEST,
  FETCH_SAMPLE_SHORTAGE_ID_SUCCESS,
  FETCH_SAMPLE_SHORTAGE_LIST_FAILURE,
  FETCH_SAMPLE_SHORTAGE_LIST_REQUEST,
  FETCH_SAMPLE_SHORTAGE_LIST_SUCCESS,
  UPDATE_SAMPLE_SHORTAGE_FAILURE,
  UPDATE_SAMPLE_SHORTAGE_REQUEST,
  UPDATE_SAMPLE_SHORTAGE_SUCCESS,
  UPLOAD_SAMPLE_SHORTAGE_FAILURE,
  UPLOAD_SAMPLE_SHORTAGE_REQUEST,
  UPLOAD_SAMPLE_SHORTAGE_SUCCESS,
} from "../../actionLabels";

export const fetchSampleShortageListRequest = (data, role,baseUrlEng) => ({
  payload: {...data,role,baseUrlEng},
  type: FETCH_SAMPLE_SHORTAGE_LIST_REQUEST,
});

export const fetchSampleShortageListSuccess = (data) => ({
  type: FETCH_SAMPLE_SHORTAGE_LIST_SUCCESS,
  payload: data,
});

export const fetchSampleShortageListFailure = (error) => ({
  type: FETCH_SAMPLE_SHORTAGE_LIST_FAILURE,
  payload: error,
});

export const fetchSampleShortageRequest = (data,role,baseUrlEng) => ({
  type: FETCH_SAMPLE_SHORTAGE_ID_REQUEST,
  // payload: { shortWeightId },
  payload: {...data,role,baseUrlEng},
});

export const fetchSampleShortageSuccess = (data) => ({
  type: FETCH_SAMPLE_SHORTAGE_ID_SUCCESS,
  payload: { data },
});

export const fetchSampleShortageFailure = (error) => ({
  type: FETCH_SAMPLE_SHORTAGE_ID_FAILURE,
  payload: { error },
});


export const checkPackageRequest = (data) => {
  return {
    type: CHECK_PACKAGE_REQUEST,
    payload: data,
  };
};

export const checkPackageSuccess = (result) => {
  return {
    type: CHECK_PACKAGE_SUCCESS,
    payload: result,
  };
};

export const checkPackageFailure = (error) => {
  return {
    type: CHECK_PACKAGE_FAILURE,
    payload: error,
  };
};

export const uploadSampleShortageRequest = (data) => {
  return {
    type: UPLOAD_SAMPLE_SHORTAGE_REQUEST,
    payload: data,
  };
};

export const uploadSampleShortageSuccess = () => {
  return {
    type: UPLOAD_SAMPLE_SHORTAGE_SUCCESS,
  };
};

export const uploadSampleShortageFailure = (error) => {
  return {
    type: UPLOAD_SAMPLE_SHORTAGE_FAILURE,
    payload: error,
  };
};


export const updateSampleShortageRequest = (data) => {
  return {
    type: UPDATE_SAMPLE_SHORTAGE_REQUEST,
    payload: data,
  };
};

export const updateSampleShortageSuccess = () => {
  return {
    type: UPDATE_SAMPLE_SHORTAGE_SUCCESS,
  };
};

export const updateSampleShortageFailure = (error) => {
  return {
    type: UPDATE_SAMPLE_SHORTAGE_FAILURE,
    payload: error,
  };
};