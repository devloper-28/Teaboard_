import { TRANSFER_DEALBOOK_FAILURE, TRANSFER_DEALBOOK_REQUEST, TRANSFER_DEALBOOK_SUCCESS } from "../../actionLabels/transferDealBookReducer/transferDealBookReducer";

const initialState = {
    loading: false,
    message: '',
    error: null,
    TransferDealBookData:'',
  };


const TransferDealBookReducer = (state = initialState, action) => {
    switch (action.type) {
      case TRANSFER_DEALBOOK_REQUEST:
        return { ...state, loading: true, error: null };
  
      case TRANSFER_DEALBOOK_SUCCESS:
        return { ...state, loading: false,  TransferDealBookData: action.payload, message: action.payload.message };
  
      case TRANSFER_DEALBOOK_FAILURE:
        return { ...state, loading: false, error: action.payload.error };
  
      default:
        return state;
    }
  };

  export default TransferDealBookReducer;