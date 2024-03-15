import {
  FETCH_TEA_TYPE_FAIL,
  FETCH_TEA_TYPE_SUCCESS,
} from "../../actionLabels";
import {
  FETCH_SUB_TEATYPE_FAILURE,
  FETCH_SUB_TEATYPE_REQUEST,
  FETCH_SUB_TEATYPE_SUCCESS,
} from "../../actionLabels/teaType/TeaType";

const initialState = {
  teaTypeList: [],
  data: [],
  loading: false,
  error: null,
};

const teaType = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TEA_TYPE_SUCCESS:
      return {
        ...state,
        teaTypeList: action.payload,
        error: null,
      };
    case FETCH_TEA_TYPE_FAIL: {
      return {
        ...state,
        error: "error",
      };
    }
    case FETCH_SUB_TEATYPE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_SUB_TEATYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_SUB_TEATYPE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default teaType;
