import * as actionLabels from "../../actionLabels";

const initialState = {
  data: [],
  loginData: "",
  loading: false,
  errorMsg: "",
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionLabels.LOGIN_ACTION_SUCCESS: {
      return {
        ...state,
        loginData: action.payload,
      };
    }

    case actionLabels.LOGIN_ACTION_FAIL: {
      return {
        ...state,
        errorMsg: action,
        loginData: "",
      };
    }
    case actionLabels.FETCH_TOKEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionLabels.FETCH_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.responseData,
        error: null,
      };
    case actionLabels.FETCH_TOKEN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default authReducer;
