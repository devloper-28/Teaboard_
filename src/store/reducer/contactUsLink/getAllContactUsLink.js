import * as actionTypes from "../../actionLabels/index";
const initialState = {
  getAllContactLink: [],
  getAllSupportLink: [],
};

const getContactLinkReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_CONTACT_LINK_SUCCESS:
      return {
        ...state,
        getAllContactLink: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_CONTACT_LINK_FAIL:
      return {
        ...state,
        getAllContactLink: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_SUPPORT_LINK_SUCCESS:
      return {
        ...state,
        getAllSupportLink: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_SUPPORT_LINK_FAIL:
      return {
        ...state,
        getAllSupportLink: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default getContactLinkReducer;
