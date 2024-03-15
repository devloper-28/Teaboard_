import * as actionLabels from '../../actionLabels';

const initialState = {
  action: false,
  connected:false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionLabels.DUMMY_ACTION_SUCCESS: {
      return {
        ...state,
        action: true,
      };
    }
    case actionLabels.SET_AUTHENTICATION:{
      return {
        ...state,
       connected:true
      }
    }
    case actionLabels.LOGOUT:{
      return {
        ...state,
       connected:false
      }
    }
    default:
      return state;
  }
};
