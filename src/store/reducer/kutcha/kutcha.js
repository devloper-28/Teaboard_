import {
  FETCH_KUTCHA_CATALOGUE_FAILURE,
  FETCH_KUTCHA_CATALOGUE_REQUEST,
  FETCH_KUTCHA_CATALOGUE_SUCCESS,
  GENERATE_LOT_NO_FAILURE,
  GENERATE_LOT_NO_REQUEST,
  GENERATE_LOT_NO_SUCCESS,
  UPDATE_KUTCHA_CATALOGUE_FAILURE,
  UPDATE_KUTCHA_CATALOGUE_REQUEST,
  UPDATE_KUTCHA_CATALOGUE_SUCCESS,
} from "../../actionLabels";

const initialState = {
  data: [],
  lotNo: null,
  loading: false,
  successMessage: null,
  error: null,
};

const kutchaCatalogueReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_KUTCHA_CATALOGUE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_KUTCHA_CATALOGUE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_KUTCHA_CATALOGUE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      case GENERATE_LOT_NO_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case GENERATE_LOT_NO_SUCCESS:
        return {
          ...state,
          lotNo: action.payload,
          loading: false,
          error: null,
        };
      case GENERATE_LOT_NO_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };


        case UPDATE_KUTCHA_CATALOGUE_REQUEST:
          return {
            ...state,
            loading: true,
            error: null,
            successMessage: null,
          };
        case UPDATE_KUTCHA_CATALOGUE_SUCCESS:
          return {
            ...state,
            loading: false,
            successMessage: 'Kutcha Catalogue details updated successfully!',
          };
        case UPDATE_KUTCHA_CATALOGUE_FAILURE:
          return {
            ...state,
            loading: false,
            error: action.payload,
          };
    default:
      return state;
  }
};

export default kutchaCatalogueReducer;
