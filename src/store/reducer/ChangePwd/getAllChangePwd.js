import * as actionTypes from "../../actionLabels/index";

const initialstate = {
  getAllChangePwdActionSuccess: [],
};

const getAllChangePwdReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_CHANGE_PWD_SUCCESS:
      return {
        ...state,
        getAllChangePwdActionSuccess: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_CHANGE_PWD_FAIL:
      return {
        ...state,
        getAllChangePwdActionSuccess: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default getAllChangePwdReducer;
