import { FETCH_CATEGORY_FAILURE, FETCH_CATEGORY_REQUEST, FETCH_CATEGORY_SUCCESS, FETCH_STATUS_FAILURE, FETCH_STATUS_REQUEST, FETCH_STATUS_SUCCESS } from "../../actionLabels";

const initialState = {
  data: [],
  statusData:[],
  loading: false,
  error: null,
};

const category = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case FETCH_STATUS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_STATUS_SUCCESS:
        return {
          ...state,
          statusData: action.payload.data,
          loading: false,
          error: null,
        };
      case FETCH_STATUS_FAILURE:
        return {
          ...state,
          statusData: [],
          loading: false,
          error: action.payload.error,
        };
    default:
      return state;
  }
};

export default category;