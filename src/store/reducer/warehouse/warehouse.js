import {
  FETCH_WAREHOUSE_USER_FAILURE,
  FETCH_WAREHOUSE_USER_REQUEST,
  FETCH_WAREHOUSE_USER_SUCCESS,
} from "../../actionLabels";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const warehouseUser = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WAREHOUSE_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_WAREHOUSE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_WAREHOUSE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default warehouseUser;
