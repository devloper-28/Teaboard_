import { TOGGLE_SUCCESS, TOGGLE_FAIL } from "../../actionLabels";

const initialState = {
  activeClass: false
};

export default (state = initialState, { type }) => {
  switch (type) {
    case TOGGLE_SUCCESS: {
      return {
        ...state,
        activeClass: !state.activeClass
      };
    }
    case TOGGLE_FAIL: {
      return {
        ...state,
        errorMsg: "error"
      };
    }
    default:
      return state;
  }
};
