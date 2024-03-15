import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getgrace: [],
  error: null,
  createdgrace: null,
  graceData: [],
  uploadedDocuments: [],
  getgraceWithoutFilter: [],
  factorydataSelect: [],
  saleNoData :[],
  createEditApiStatus: false,
};

const getAllgraces = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_GRACE_SUCCESS:
      return {
        ...state,
        getgrace: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_GRACE_FAIL:
      return {
        ...state,
        getgrace: [],
        error: action.payload,
      };

    case actionTypes.CREATE_GRACE_SUCCESS:
      return {
        ...state,
        createdgrace: action.payload,
        error: null,
      };

    case actionTypes.CREATE_GRACE_FAIL:
      return {
        ...state,
        createdgrace: null,
        error: action.payload,
      };
    case actionTypes.UPDATE_GRACE_SUCCESS:
      return {
        ...state,
        updatedgrace: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_GRACE_FAIL:
      return {
        ...state,
        updatedgrace: null,
        error: action.payload,
      };
    case actionTypes.GET_GRACE_BY_ID_SUCCESS:
      return {
        ...state,
        graceData: action.payload,
        error: null,
      };
    case actionTypes.GET_GRACE_BY_ID_FAIL:
      return {
        ...state,
        graceData: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_GRACE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_GRACE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.GET_ALL_GRACE_WITHOUT_FILTER_SUCCESS:
      return {
        ...state,
        getgraceWithoutFilter: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_GRACE_WITHOUT_FILTER_FAIL:
      return {
        ...state,
        getgraceWithoutFilter: [],
        error: action.payload,
      };
    case actionTypes.CREATE_EDIT_API_STATUS_GRACE:
      return {
        ...state,
        createEditApiStatus: action.payload.data,
      };
      case actionTypes.GET_ALL_SALENO_PREAUCTION_SUCCESS:
        return {
          ...state,
          saleNoData: action.payload,
          error: null,
        };
      case actionTypes.GET_ALL_SALENO_PREAUCTION_FAIL:
        return {
          ...state,
          saleNoData: [],
          error: action.payload,
        };
    default:
      return state;
  }
};

export default getAllgraces;
