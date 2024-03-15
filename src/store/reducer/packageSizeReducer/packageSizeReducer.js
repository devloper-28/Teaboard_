import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getpackageSize: [],
  error: null,
  createdpackageSize: null,
  packageSizeData: [],
  uploadedDocuments: [],
  getpackageSizeWithoutFilter: [],
  factorydataSelect: [],
  createEditApiStatus: false,
};

const getAllpackageSizes = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_PACKAGE_SIZE_SUCCESS:
      return {
        ...state,
        getpackageSize: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_PACKAGE_SIZE_FAIL:
      return {
        ...state,
        getpackageSize: [],
        error: action.payload,
      };

    case actionTypes.CREATE_PACKAGE_SIZE_SUCCESS:
      return {
        ...state,
        createdpackageSize: action.payload,
        error: null,
      };

    case actionTypes.CREATE_PACKAGE_SIZE_FAIL:
      return {
        ...state,
        createdpackageSize: null,
        error: action.payload,
      };
    case actionTypes.UPDATE_PACKAGE_SIZE_SUCCESS:
      return {
        ...state,
        updatedpackageSize: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_PACKAGE_SIZE_FAIL:
      return {
        ...state,
        updatedpackageSize: null,
        error: action.payload,
      };
    case actionTypes.GET_PACKAGE_SIZE_BY_ID_SUCCESS:
      return {
        ...state,
        packageSizeData: action.payload,
        error: null,
      };
    case actionTypes.GET_PACKAGE_SIZE_BY_ID_FAIL:
      return {
        ...state,
        packageSizeData: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_PACKAGE_SIZE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_PACKAGE_SIZE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.GET_ALL_PACKAGE_SIZE_WITHOUT_FILTER_SUCCESS:
      return {
        ...state,
        getpackageSizeWithoutFilter: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_PACKAGE_SIZE_WITHOUT_FILTER_FAIL:
      return {
        ...state,
        getpackageSizeWithoutFilter: [],
        error: action.payload,
      };
    case actionTypes.CREATE_EDIT_API_STATUS_PACKAGE_SIZE:
      return {
        ...state,
        createEditApiStatus: action.payload.data,
      };
    default:
      return state;
  }
};

export default getAllpackageSizes;
