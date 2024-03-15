import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getBankRedirectURL: [],
  error: null,
};

const getAllBankRedirectURLs = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REDIRECT_BANK_LINK_SUCCESS:
      return {
        ...state,
        getBankRedirectURL: action.payload,
        error: null,
      };
    case actionTypes.REDIRECT_BANK_LINK_FAIL:
      return {
        ...state,
        getBankRedirectURL: [],
        error: action.payload,
      };

      default :{
        return {...state}
      }
  }
};
export default getAllBankRedirectURLs;
