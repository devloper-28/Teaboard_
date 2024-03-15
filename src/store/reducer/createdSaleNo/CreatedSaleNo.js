// reducer.js
import * as actionLabels from "../../actionLabels/index";

const initialState = {
  saleNumbers: [],
  loading: false,
  error: null,
};

const CreatedSaleNo= (state = initialState, action) => {
  switch (action.type) {
    case actionLabels.FETCH_SALE_NUMBERS_REQUEST:

      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionLabels.FETCH_SALE_NUMBERS_SUCCESS:
      return {
        ...state,
        saleNumbers: action.payload,
        loading: false,
        error: null,
      };
    case actionLabels.FETCH_SALE_NUMBERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default CreatedSaleNo;
