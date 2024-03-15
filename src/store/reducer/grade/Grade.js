// commonReducer.js

import {
  FETCH_GRADE_FAILURE,
  FETCH_GRADE_REQUEST,
  FETCH_GRADE_SUCCESS,
} from "../../actionLabels";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const grade = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GRADE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_GRADE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_GRADE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default grade;
