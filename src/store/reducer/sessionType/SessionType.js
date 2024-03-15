import { FETCH_SESSION_TYPE_FAILURE, FETCH_SESSION_TYPE_REQUEST, FETCH_SESSION_TYPE_SUCCESS } from "../../actionLabels";


const initialState = {
  loading: false,
  data: [],
  error: null,
};

const sessionTypesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SESSION_TYPE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SESSION_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case FETCH_SESSION_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default sessionTypesReducer;
