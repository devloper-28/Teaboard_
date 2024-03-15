import * as actionTypes from "../../actionLabels/index";

// Action creator for getting all categories
export const getAllCategoriesAction = () => {
  return {
    type: actionTypes.GET_ALL_CATEGORIES,
  };
};

export const getAllCategoriesSuccess = (categories) => {
  return {
    type: actionTypes.GET_ALL_CATEGORIES_SUCCESS,
    payload: categories,
  };
};

export const getAllCategoriesFail = (error) => ({
  type: actionTypes.GET_ALL_CATEGORIES_FAIL,
  payload: error,
});

export const getAllCategoriesAscAction = (payload) => {
  return {
    type: actionTypes.GET_ALL_CATEGORIES_ASC,
    payload: payload,
  };
};

export const getAllCategoriesAscSuccess = (categories) => {
  return {
    type: actionTypes.GET_ALL_CATEGORIES_SUCCESS_ASC,
    payload: categories,
  };
};

export const getAllCategoriesAscFail = (error) => ({
  type: actionTypes.GET_ALL_CATEGORIES_FAIL_ASC,
  payload: error,
});

// Action creator for creating a new category
export const createCategoryAction = (categoryData) => {
  return {
    type: actionTypes.CREATE_CATEGORY,
    payload: {
      categoryData,
    },
  };
};

export const createCategorySuccess = () => {
  return {
    type: actionTypes.CREATE_CATEGORY_SUCCESS,
  };
};

export const createCategoryFail = (error) => ({
  type: actionTypes.CREATE_CATEGORY_FAIL,
  payload: error,
});

// Action creator for updating a category
export const updateCategoryAction = (updatedData) => {
  return {
    type: actionTypes.UPDATE_CATEGORY,
    payload: {
      updatedData,
    },
  };
};

export const updateCategorySuccess = () => {
  return {
    type: actionTypes.UPDATE_CATEGORY_SUCCESS,
  };
};

export const updateCategoryFail = (error) => ({
  type: actionTypes.UPDATE_CATEGORY_FAIL,
  payload: error,
});

// Action creator for searching categories
export const searchCategoriesAction = (searchCriteria) => {
  return {
    type: actionTypes.SEARCH_CATEGORIES,
    payload: {
      searchCriteria,
    },
  };
};

export const searchCategoriesSuccess = (searchedCategories) => {
  return {
    type: actionTypes.SEARCH_CATEGORIES_SUCCESS,
    payload: searchedCategories,
  };
};

export const searchCategoriesFail = (error) => ({
  type: actionTypes.SEARCH_CATEGORIES_FAIL,
  payload: error,
});

// Action creator for getting a category by its ID
export const getCategoryByIdAction = (categoryId) => {
  return {
    type: actionTypes.GET_CATEGORY_BY_ID,
    payload: {
      categoryId,
    },
  };
};

export const getCategoryByIdSuccess = (category) => {
  return {
    type: actionTypes.GET_CATEGORY_BY_ID_SUCCESS,
    payload: category,
  };
};

export const getCategoryByIdFail = (error) => ({
  type: actionTypes.GET_CATEGORY_BY_ID_FAIL,
  payload: error,
});

// Action creator for uploading all documents
export const uploadAllDocumentsAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS,
  };
};

export const uploadAllDocumentsSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_FAIL,
  payload: error,
});

export const createEditCategoryApiStatus = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_CATEGORY_API_STATUS,
    payload: { data: data },
  };
};
