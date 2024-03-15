// commonReducer.js
import {
  FETCH_MARK_REQUEST,
  FETCH_MARK_SUCCESS,
  FETCH_MARK_FAILURE,
  FETCH_MARK_TYPE_SUCCESS,
  FETCH_MARK_TYPE_FAILURE,
} from "../../actionLabels";

const initialState = {
  data: [],
  markTypeData: [],
  loading: false,
  error: null,
};

const mark = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MARK_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_MARK_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_MARK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case FETCH_MARK_TYPE_SUCCESS:
      return {
        ...state,
        markTypeData: action.payload,
        error: null,
      };
    case FETCH_MARK_TYPE_FAILURE:
      return {
        ...state,
        markTypeData: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default mark;
