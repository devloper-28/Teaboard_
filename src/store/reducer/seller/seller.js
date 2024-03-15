import {
  CREATE_FACTORY_OWNER_FAILURE,
  CREATE_FACTORY_OWNER_REQUEST,
  CREATE_FACTORY_OWNER_SUCCESS,
  CREATE_SELLER_FAILURE,
  CREATE_SELLER_REQUEST,
  CREATE_SELLER_SUCCESS,
  FETCH_FACTORY_BY_ID_FAILURE,
  FETCH_FACTORY_BY_ID_REQUEST,
  FETCH_FACTORY_BY_ID_SUCCESS,
  FETCH_FACTORY_FAILURE,
  FETCH_FACTORY_OWNER_FAILURE,
  FETCH_FACTORY_OWNER_REQUEST,
  FETCH_FACTORY_OWNER_SUCCESS,
  FETCH_FACTORY_REQUEST,
  FETCH_FACTORY_SUCCESS,
  GET_ALL_FACTORY_TYPE_FAILURE,
  GET_ALL_FACTORY_TYPE_REQUEST,
  GET_ALL_FACTORY_TYPE_SUCCESS,
  GET_ALL_REVENUES_FAILURE,
  GET_ALL_REVENUES_REQUEST,
  GET_ALL_REVENUES_SUCCESS,
  GET_ALL_SELLER_STATE_FAILURE,
  GET_ALL_SELLER_STATE_REQUEST,
  GET_ALL_SELLER_STATE_SUCCESS,
  GET_FACTORY_DOCUMENT_FAILURE,
  GET_FACTORY_DOCUMENT_REQUEST,
  GET_FACTORY_DOCUMENT_SUCCESS,
  GET_FACTORY_OWNER_LIST_FAILURE,
  GET_FACTORY_OWNER_LIST_REQUEST,
  GET_FACTORY_OWNER_LIST_SUCCESS,
  GET_SELLER_DOCUMENT_FAILURE,
  GET_SELLER_DOCUMENT_REQUEST,
  GET_SELLER_DOCUMENT_SUCCESS,
  UPDATE_FACTORY_FAILURE,
  UPDATE_FACTORY_OWNER_FAILURE,
  UPDATE_FACTORY_OWNER_REQUEST,
  UPDATE_FACTORY_OWNER_SUCCESS,
  UPDATE_FACTORY_REQUEST,
  UPDATE_FACTORY_SUCCESS,CREATE_EDIT_API_STATUS_SELLER,
} from "../../actionLabels";

const initialState = {
  sellerdocument: [],
  factoryOwnersList: [],
  factoryList: [],
  factoryType: [],
  allRevenue: [],
  factoryDocument: [],
  factoryById: null,
  factoryUpdate: null,
  factoryOwnerUpdate: null,
  factoryOwner: null,
  factoryOwnerById: null,
  sellercreated: null,
  loading: false,
  error: null,
  createEditApiStatusSeller:false
};

const sellerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SELLER_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_SELLER_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        sellerdocument: action.payload,
      };
    case GET_SELLER_DOCUMENT_FAILURE:
      return {
        ...state,
        data: null,
        loading: false,
        error: action.payload,
      };
    case CREATE_SELLER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_SELLER_SUCCESS:
      return {
        ...state,
        loading: false,
        sellercreated: action.payload,
      };
    case CREATE_SELLER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_FACTORY_OWNER_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_FACTORY_OWNER_SUCCESS:
      return {
        ...state,
        loading: false,
        factoryOwner: action.data,
        error: null,
      };

    case CREATE_FACTORY_OWNER_FAILURE:
      return { ...state, loading: false, data: null, error: action.error };

    case GET_FACTORY_OWNER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_FACTORY_OWNER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        factoryOwnersList: action.payload,
      };
    case GET_FACTORY_OWNER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_FACTORY_OWNER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_FACTORY_OWNER_SUCCESS:
      return {
        ...state,
        factoryOwnerUpdate: action.payload,
        loading: false,
      };
    case UPDATE_FACTORY_OWNER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case FETCH_FACTORY_OWNER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACTORY_OWNER_SUCCESS:
      return {
        ...state,
        factoryOwnerById: action.payload,
        loading: false,
      };
    case FETCH_FACTORY_OWNER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_FACTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        factoryList: action.payload,
      };
    case FETCH_FACTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case FETCH_FACTORY_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACTORY_BY_ID_SUCCESS:
      return {
        ...state,
        factoryById: action.payload,
        loading: false,
      };
    case FETCH_FACTORY_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_FACTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_FACTORY_SUCCESS:
      return {
        ...state,
        factoryUpdate: action.payload,
        loading: false,
      };
    case UPDATE_FACTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case GET_FACTORY_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_FACTORY_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        factoryDocument: action.payload,
      };
    case GET_FACTORY_DOCUMENT_FAILURE:
      return {
        ...state,
        data: null,
        loading: false,
        error: action.payload,
      };

    case GET_ALL_REVENUES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ALL_REVENUES_SUCCESS:
      return {
        ...state,
        loading: false,
        allRevenue: action.payload,
      };
    case GET_ALL_REVENUES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_ALL_FACTORY_TYPE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ALL_FACTORY_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        factoryType: action.payload,
      };
    case GET_ALL_FACTORY_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      case CREATE_EDIT_API_STATUS_SELLER:
        return {
          ...state,
          createEditApiStatusSeller: action.payload.data,
        };
  

    default:
      return state;
  }
};

export default sellerReducer;
