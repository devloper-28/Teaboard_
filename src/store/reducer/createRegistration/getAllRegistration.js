import * as actionTypes from "../../actionLabels/index";

const initialstate = {
  getAllUserActionSuccess: [],
  getAllUserWithStatus: [],
  createdUser: null,
  updatedUser: null,
  searchResults: [],
  UserData: [],
  error: null,
  createEditApiUser: false,
  getChildUser: [],
  getChildAuc: [],
  ChildBuyerData: [],
  updatedChildAuc : [],
  childcreatedAuc : [],
};

const getAllUserReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_USER_RE_SUCCESS:
      return {
        ...state,
        getAllUserActionSuccess: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_USER_RE_FAIL:
      return {
        ...state,
        getAllUserActionSuccess: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_USER_RE_WITH_STATUS_SUCCESS:
      return {
        ...state,
        getAllUserWithStatus: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_USER_RE_WITH_STATUS_FAIL:
      return {
        ...state,
        getAllUserWithStatus: [],
        error: action.payload,
      };

    case actionTypes.CREATE_USER_RE_SUCCESS:
      return {
        ...state,
        createdUser: action.payload,
        error: null,
      };

    case actionTypes.CREATE_USER_RE_FAIL:
      return {
        ...state,
        createdUser: null,
        error: action.payload,
      };

    case actionTypes.UPDATE_USER_RE_SUCCESS:
      return {
        ...state,
        updatedUser: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_USER_RE_FAIL:
      return {
        ...state,
        updatedUser: null,
        error: action.payload,
      };

    case actionTypes.SEARCH_USER_RE_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_USER_RE_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_USER_RE_BY_ID_SUCCESS:
      return {
        ...state,
        UserData: action.payload,
        error: null,
      };
    case actionTypes.GET_USER_RE_BY_ID_FAIL:
      return {
        ...state,
        UserData: null,
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_USER_RE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload,
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_USER_RE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.CREATE_EDIT_API_USER:
      return {
        ...state,
        createEditApiUser: action.payload.data,
      };
    case actionTypes.GET_ALL_CHILD_USER:
      return {
        ...state,
        getChildUser: action.payload,
      };
    case actionTypes.GET_ALL_CHILD_USER_SUCCESS:
      return {
        ...state,
        getChildUser: action.payload,
      };
    case actionTypes.GET_ALL_CHILD_USER_FAIL:
      return {
        ...state,
        getChildUser: [],
        error: action.payload,
      };
    case actionTypes.CREATE_CHILD_AUCTIONEER_FAIL:
      return {
        ...state,
        childcreatedAuc: null,
        error: action.payload,
      };
    case actionTypes.CREATE_CHILD_AUCTIONEER_SUCCESS:
      return {
        ...state,
        childcreatedAuc: action.payload,
        error: null,
      };
    case actionTypes.GET_CHILD_AUCTIONEER_BY_ID_SUCCESS:
      return {
        ...state,
        ChildBuyerData: action.payload,
        error: null,
      };
    case actionTypes.GET_CHILD_AUCTIONEER_BY_ID_FAIL:
      return {
        ...state,
        ChildBuyerData: [],
        error: action.payload,
      };
    case actionTypes.UPDATE_CHILD_AUCTIONEER_SUCCESS:
      return {
        ...state,
        updatedChildAuc: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_CHILD_AUCTIONEER_FAIL:
      return {
        ...state,
        updatedChildAuc: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default getAllUserReducer;
