import * as actionTypes from "../../actionLabels/index";

const initialState = {
  allCategories: [],
  allCategoriesAsc: [],
  createdCategory: null,
  // updatedCategory: null,
  searchedCategories: [],
  categoryById: [],
  uploadedDocuments: [],
  error: null,
  createEditCategoryApiStatus: false,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_CATEGORIES_SUCCESS:
      return {
        ...state,
        allCategories: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_CATEGORIES_FAIL:
      return {
        ...state,
        allCategories: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_CATEGORIES_SUCCESS_ASC:
      return {
        ...state,
        allCategoriesAsc: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_CATEGORIES_FAIL_ASC:
      return {
        ...state,
        allCategoriesAsc: [],
        error: action.payload,
      };

    case actionTypes.CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        createdCategory: true,
        error: null,
      };

    case actionTypes.CREATE_CATEGORY_FAIL:
      return {
        ...state,
        createdCategory: null,
        error: action.payload,
      };

    case actionTypes.UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        // updatedCategory: true,
        error: null,
      };

    case actionTypes.UPDATE_CATEGORY_FAIL:
      return {
        ...state,
        // updatedCategory: null,
        error: action.payload,
      };

    case actionTypes.SEARCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        searchedCategories: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_CATEGORIES_FAIL:
      return {
        ...state,
        searchedCategories: [],
        error: action.payload,
      };

    case actionTypes.GET_CATEGORY_BY_ID_SUCCESS:
      return {
        ...state,
        categoryById: action.payload,
        error: null,
      };

    case actionTypes.GET_CATEGORY_BY_ID_FAIL:
      return {
        ...state,
        categoryById: [],
        error: action.payload,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_CATEGORY_API_STATUS:
      return {
        ...state,
        createEditCategoryApiStatus: action.payload.data,
      };

    default:
      return state;
  }
};

export default categoryReducer;
