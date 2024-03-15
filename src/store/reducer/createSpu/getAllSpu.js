import * as actionTypes from "../../actionLabels/index";

const initialstate = {
  getAllSpuActionSuccess: [],
  getAllSpuWithStatus: [],
  createdSpu: null,
  updatedSpu: null,
  searchResults: [],
  SpuData: [],
  error: null,
  createEditSpuApiStatus: false,
};

const getAllSpuReducer = (state = initialstate, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_SPU_SUCCESS:
      return {
        ...state,
        getAllSpuActionSuccess: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_SPU_FAIL:
      return {
        ...state,
        getAllSpuActionSuccess: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_SPU_WITH_STATUS_SUCCESS:
      return {
        ...state,
        getAllSpuWithStatus: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_SPU_WITH_STATUS_FAIL:
      return {
        ...state,
        getAllSpuWithStatus: [],
        error: action.payload,
      };

    case actionTypes.CREATE_SPU_SUCCESS:
      return {
        ...state,
        createdSpu: action.payload,
        error: null,
      };

    case actionTypes.CREATE_SPU_FAIL:
      return {
        ...state,
        createdSpu: null,
        error: action.payload,
      };

    case actionTypes.UPDATE_SPU_SUCCESS:
      return {
        ...state,
        updatedSpu: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_SPU_FAIL:
      return {
        ...state,
        updatedSpu: null,
        error: action.payload,
      };

    case actionTypes.SEARCH_SPU_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_SPU_FAIL:
      return {
        ...state,
        searchResults: [],
        error: action.payload,
      };
    case actionTypes.GET_SPU_BY_ID_SUCCESS:
      return {
        ...state,
        SpuData: action.payload,
        error: null,
      };
    case actionTypes.GET_SPU_BY_ID_FAIL:
      return {
        ...state,
        SpuData: null,
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_SPU_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload,
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_SPU_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_SPU_API_STATUS:
      return {
        ...state,
        createEditSpuApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default getAllSpuReducer;
