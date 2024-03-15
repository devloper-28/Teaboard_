import { FETCH_USER_RIGHTS_FAILURE, FETCH_USER_RIGHTS_REQUEST, FETCH_USER_RIGHTS_SUCCESS } from "../../actionLabels";


const initialState = {
  data: null,
  loading: false,
  error: null,
};

const ModuleReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_RIGHTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_USER_RIGHTS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_USER_RIGHTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default ModuleReducer;
