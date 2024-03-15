import * as actionTypes from "../../actionLabels";

const initialState = {
  allPlantations: [],
  allPlantationsAsc: [],
  createdPlantation: null,
  searchedPlantations: [],
  plantationByStatus: [],
  plantationById: [],
  uploadedDocuments: [],
  error: null,
  createEditPlantationApiStatus: false,
};

const plantationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_PLANTATION_SUCCESS:
      return {
        ...state,
        allPlantations: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_PLANTATION_FAIL:
      return {
        ...state,
        allPlantations: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_PLANTATION_SUCCESS_ASC:
      return {
        ...state,
        allPlantationsAsc: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_PLANTATION_FAIL_ASC:
      return {
        ...state,
        allPlantationsAsc: [],
        error: action.payload,
      };

    case actionTypes.CREATE_PLANTATION_SUCCESS:
      return {
        ...state,
        createdPlantation: action.payload,
        error: null,
      };

    case actionTypes.CREATE_PLANTATION_FAIL:
      return {
        ...state,
        createdPlantation: null,
        error: action.payload,
      };

    case actionTypes.UPDATE_PLANTATION_SUCCESS:
      return {
        ...state,

        error: null,
      };

    case actionTypes.UPDATE_PLANTATION_FAIL:
      return {
        ...state,

        error: action.payload,
      };

    case actionTypes.SEARCH_PLANTATION_SUCCESS:
      return {
        ...state,
        searchedPlantations: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_PLANTATION_FAIL:
      return {
        ...state,
        searchedPlantations: [],
        error: action.payload,
      };

    case actionTypes.GET_PLANTATION_BY_ID_SUCCESS:
      return {
        ...state,
        plantationById: action.payload,
        error: null,
      };

    case actionTypes.GET_PLANTATION_BY_ID_FAIL:
      return {
        ...state,
        plantationById: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_PLANTATION_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_PLANTATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_PLANTATION_API_STATUS:
      return {
        ...state,
        createEditPlantationApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default plantationReducer;
