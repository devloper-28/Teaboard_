// reducer.js
import {
  FETCH_DOCUMENTS_REQUEST,
  FETCH_DOCUMENTS_SUCCESS,
  FETCH_DOCUMENTS_FAILURE,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  GET_DOCUMENT_DETAIL_REQUEST,
  GET_DOCUMENT_DETAIL_SUCCESS,
  GET_DOCUMENT_DETAIL_FAILURE,
  POST_WAREHOUSE_USER_REQUEST,
  POST_WAREHOUSE_USER_SUCCESS,
  POST_WAREHOUSE_USER_FAILURE,
  UPDATE_WAREHOUSE_USER_REQUEST,
  UPDATE_WAREHOUSE_USER_SUCCESS,
  UPDATE_WAREHOUSE_USER_FAILURE,
  FETCH_AUCTION_REQUEST,
  FETCH_AUCTION_SUCCESS,
  FETCH_AUCTION_FAILURE,
  FETCH_STATE_REQUEST,
  FETCH_STATE_SUCCESS,
  FETCH_STATE_FAILURE,
  SEARCH_USERS_REQUEST,
  SEARCH_USERS_SUCCESS,
  SEARCH_USERS_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  CREATE_WAREHOUSE_UNIT_REQUEST,
  CREATE_WAREHOUSE_UNIT_SUCCESS,
  CREATE_WAREHOUSE_UNIT_FAILURE,
  SEARCH_WAREHOUSE_UNITS_REQUEST,
  SEARCH_WAREHOUSE_UNITS_SUCCESS,
  SEARCH_WAREHOUSE_UNITS_FAILURE,
  SEARCH_UNIT_REQUEST,
  SEARCH_UNIT_SUCCESS,
  SEARCH_UNIT_FAILURE,
  UPDATE_WAREHOUSE_UNIT_REQUEST,
  UPDATE_WAREHOUSE_UNIT_SUCCESS,
  UPDATE_WAREHOUSE_UNIT_FAILURE,
  GET_UNIT_BY_ID_REQUEST,
  GET_UNIT_BY_ID_SUCCESS,
  GET_UNIT_BY_ID_FAILURE,
  GET_ALL_UNIT_DOCUMENT_REQUEST,
  GET_ALL_UNIT_DOCUMENT_SUCCESS,
  GET_ALL_UNIT_DOCUMENT_FAILURE,
  GET_WAREHOUSE_HISTORY_REQUEST,
  GET_WAREHOUSE_HISTORY_SUCCESS,
  GET_WAREHOUSE_HISTORY_FAILURE,
  GET_UNIT_HISTORY_REQUEST,
  GET_UNIT_HISTORY_SUCCESS,
  GET_UNIT_HISTORY_FAILURE,
  CREATE_EDIT_API_STATUS_WAREHOUSE,
} from "../../actionLabels";

const initialState = {
  documents: [],
  unitdocument: [],
  users: [],
  auctionCenter: [],
  stateList: [],
  userSearch: [],
  data: null,
  loading: false,
  unitupdated: null,
  error: null,
  createuser: null,
  updatedData: null,
  userById: null,
  unitsearch: [],
  unitsearchData: [],
  createunit: null,
  unitById: null,
  warehousehistory: [],
  warehouseunithistory: [],
  createEditApiStatusWarehouse: false,
};

const warehouseUserRegistration = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DOCUMENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_DOCUMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        documents: action.payload,
      };
    case FETCH_DOCUMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case GET_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_DOCUMENT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        data: null,
        error: null,
      };
    case GET_DOCUMENT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case GET_DOCUMENT_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        data: null,
        error: action.payload,
      };
    case POST_WAREHOUSE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case POST_WAREHOUSE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        createuser: action.payload,
      };
    case POST_WAREHOUSE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case UPDATE_WAREHOUSE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_WAREHOUSE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        updatedData: action.payload,
      };
    case UPDATE_WAREHOUSE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_AUCTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_AUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        auctionCenter: action.payload,
        error: null,
      };
    case FETCH_AUCTION_FAILURE:
      return {
        ...state,
        loading: false,
        data: null,
        error: action.payload,
      };
    case FETCH_STATE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_STATE_SUCCESS:
      return {
        ...state,
        stateList: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_STATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SEARCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SEARCH_USERS_SUCCESS:
      return {
        ...state,
        userSearch: action.payload,
        loading: false,
        error: null,
      };
    case SEARCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        userById: action.payload.user,
      };
    case GET_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case CREATE_WAREHOUSE_UNIT_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    case CREATE_WAREHOUSE_UNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        createunit: action.payload,
      };
    case CREATE_WAREHOUSE_UNIT_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.error,
      };
    case SEARCH_WAREHOUSE_UNITS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SEARCH_WAREHOUSE_UNITS_SUCCESS:
      return {
        ...state,
        unitsearch: action.payload,
        loading: false,
        error: null,
      };

    case SEARCH_WAREHOUSE_UNITS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SEARCH_UNIT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SEARCH_UNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        unitsearchData: action.data,
      };
    case SEARCH_UNIT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case UPDATE_WAREHOUSE_UNIT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case UPDATE_WAREHOUSE_UNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        unitupdated: action.payload,
      };
    case UPDATE_WAREHOUSE_UNIT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_UNIT_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_UNIT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        unitById: action.payload,
      };
    case GET_UNIT_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case GET_ALL_UNIT_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ALL_UNIT_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        unitdocument: action.payload,
      };
    case GET_ALL_UNIT_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_WAREHOUSE_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_WAREHOUSE_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        warehousehistory: action.payload,
        error: null,
      };
    case GET_WAREHOUSE_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_UNIT_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_UNIT_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        warehouseunithistory: action.payload,
        error: null,
      };
    case GET_UNIT_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_EDIT_API_STATUS_WAREHOUSE:
      return {
        ...state,
        createEditApiStatusWarehouse: action.payload.data,
      };

    default:
      return state;
  }
};

export default warehouseUserRegistration;
