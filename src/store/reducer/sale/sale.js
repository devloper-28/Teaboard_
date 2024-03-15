import {
  CANCEL_SALE_PROGRAM_DOCUMENT_FAILURE,
  CANCEL_SALE_PROGRAM_DOCUMENT_REQUEST,
  CANCEL_SALE_PROGRAM_DOCUMENT_SUCCESS,
  CANCEL_SALE_PROGRAM_FAILURE,
  CANCEL_SALE_PROGRAM_REQUEST,
  CANCEL_SALE_PROGRAM_SUCCESS,
  CREATE_SALE_PROGRAM_FAILURE,
  CREATE_SALE_PROGRAM_REQUEST,
  CREATE_SALE_PROGRAM_SUCCESS,
  FETCH_SALE_PROGRAM_DETAILS_FAILURE,
  FETCH_SALE_PROGRAM_DETAILS_REQUEST,
  FETCH_SALE_PROGRAM_DETAILS_SUCCESS,
  FETCH_SALE_PROGRAM_LIST_FAILURE,
  FETCH_SALE_PROGRAM_LIST_REQUEST,
  FETCH_SALE_PROGRAM_LIST_SUCCESS,
  UPDATE_SALE_PROGRAM_FAILURE,
  UPDATE_SALE_PROGRAM_REQUEST,
  UPDATE_SALE_PROGRAM_SUCCESS,
} from "../../actionLabels";

const initialState = {
  saleProgramDetails: [],
  saleProgramList: [],
  error: null,
  isCanceling: false,
  loading: false,
  createSaleProgramLoading: false,
  createSaleProgramError: null,

  success: false,
};

const sale = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SALE_PROGRAM_LIST_REQUEST:
      return {
        ...state,
        error: null,
      };
    case FETCH_SALE_PROGRAM_LIST_SUCCESS:
      return {
        ...state,
        saleProgramList: action.payload,
        error: null,
      };
    case FETCH_SALE_PROGRAM_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case FETCH_SALE_PROGRAM_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SALE_PROGRAM_DETAILS_SUCCESS:
      return {
        ...state,
        saleProgramDetails: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_SALE_PROGRAM_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_SALE_PROGRAM_REQUEST:
      return {
        ...state,
        createSaleProgramLoading: true,
        createSaleProgramError: null,
      };
    case CREATE_SALE_PROGRAM_SUCCESS:
      return {
        ...state,
        createSaleProgramLoading: false,
      };
    case CREATE_SALE_PROGRAM_FAILURE:
      return {
        ...state,
        createSaleProgramLoading: false,
        createSaleProgramError: action.payload,
      };
    case UPDATE_SALE_PROGRAM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_SALE_PROGRAM_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UPDATE_SALE_PROGRAM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CANCEL_SALE_PROGRAM_REQUEST:
      return {
        ...state,
        isCanceling: true,
        error: null,
      };
    case CANCEL_SALE_PROGRAM_SUCCESS:
      return {
        ...state,
        isCanceling: false,
      };
    case CANCEL_SALE_PROGRAM_FAILURE:
      return {
        ...state,
        isCanceling: false,
        error: action.payload,
      };
    case CANCEL_SALE_PROGRAM_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    case CANCEL_SALE_PROGRAM_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
      };
    case CANCEL_SALE_PROGRAM_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default sale;
