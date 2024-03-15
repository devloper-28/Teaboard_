import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getpackageType: [],
  error: null,
  createdpackageType: null,
  packageTypeData: [],
  uploadedDocuments: [],
  getpackageTypeWithoutFilter: [],
  factorydataSelect: [],
  createEditApiStatus: false,
};

const getAllpackageTypes = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_PACKAGE_TYPE_SUCCESS:
      return {
        ...state,
        getpackageType: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_PACKAGE_TYPE_FAIL:
      return {
        ...state,
        getpackageType: [],
        error: action.payload,
      };

    case actionTypes.CREATE_PACKAGE_TYPE_SUCCESS:
      return {
        ...state,
        createdpackageType: action.payload,
        error: null,
      };

    case actionTypes.CREATE_PACKAGE_TYPE_FAIL:
      return {
        ...state,
        createdpackageType: null,
        error: action.payload,
      };
    case actionTypes.UPDATE_PACKAGE_TYPE_SUCCESS:
      return {
        ...state,
        updatedpackageType: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_PACKAGE_TYPE_FAIL:
      return {
        ...state,
        updatedpackageType: null,
        error: action.payload,
      };
    case actionTypes.GET_PACKAGE_TYPE_BY_ID_SUCCESS:
      return {
        ...state,
        packageTypeData: action.payload,
        error: null,
      };
    case actionTypes.GET_PACKAGE_TYPE_BY_ID_FAIL:
      return {
        ...state,
        packageTypeData: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_PACKAGE_TYPE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_PACKAGE_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.GET_ALL_PACKAGE_TYPE_WITHOUT_FILTER_SUCCESS:
      return {
        ...state,
        getpackageTypeWithoutFilter: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_PACKAGE_TYPE_WITHOUT_FILTER_FAIL:
      return {
        ...state,
        getpackageTypeWithoutFilter: [],
        error: action.payload,
      };
    case actionTypes.CREATE_EDIT_API_STATUS_PACKAGE_TYPE:
      return {
        ...state,
        createEditApiStatus: action.payload.data,
      };
    default:
      return state;
  }
};

export default getAllpackageTypes;
