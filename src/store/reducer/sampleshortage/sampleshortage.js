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

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const sampleShortageReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SAMPLE_SHORTAGE_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SAMPLE_SHORTAGE_LIST_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_SAMPLE_SHORTAGE_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_SAMPLE_SHORTAGE_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SAMPLE_SHORTAGE_ID_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        loading: false,
      };
    case FETCH_SAMPLE_SHORTAGE_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case CHECK_PACKAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CHECK_PACKAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        result: action.payload,
      };
    case CHECK_PACKAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPLOAD_SAMPLE_SHORTAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPLOAD_SAMPLE_SHORTAGE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UPLOAD_SAMPLE_SHORTAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_SAMPLE_SHORTAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_SAMPLE_SHORTAGE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UPDATE_SAMPLE_SHORTAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default sampleShortageReducer;
