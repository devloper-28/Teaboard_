import { FETCH_BUYER_GROUPS_ERROR, FETCH_BUYER_GROUPS_SUCCESS } from "../../actionLabels";

// reducer.js
const initialState = {
  buyerGroups: [],
};

export default function groupMaster(state = initialState, action) {
  switch (action.type) {
    case FETCH_BUYER_GROUPS_SUCCESS:
      return {
        ...state,
        buyerGroups: action.payload,
        error: null, // Clear any previous errors
      };
    case FETCH_BUYER_GROUPS_ERROR:
      return {
        ...state,
        buyerGroups: [], // Clear the buyerGroups in case of error
        error: action.payload, // Set the error message
      };
    default:
      return state;
  }
}