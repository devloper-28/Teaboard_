import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  SEARCH_CATEGORIES,
  GET_CATEGORY_BY_ID,
  UPLOAD_ALL_DOCUMENTS,
  GET_ALL_CATEGORIES_ASC,
} from "../../actionLabels";
import {
  getAllCategoriesSuccess,
  getAllCategoriesFail,
  createCategorySuccess,
  createCategoryFail,
  updateCategorySuccess,
  updateCategoryFail,
  searchCategoriesSuccess,
  searchCategoriesFail,
  getCategoryByIdSuccess,
  getCategoryByIdFail,
  uploadAllDocumentsSuccess,
  uploadAllDocumentsFail,
  createEditCategoryApiStatus,
  searchCategoriesAction,
  getAllCategoriesAction,
  getAllCategoriesAscSuccess,
  getAllCategoriesAscFail,
} from "../../actions";
import CustomToast from "../../../components/Toast";

// Generator function to handle the GET_ALL_CATEGORIES action
function* getAllCategories() {
  try {
    const response = yield call(axiosMain.post, "/admin/Category/search", {});
    if (response.status == 200) {
      yield put(getAllCategoriesSuccess(response.data));
    } else {
      yield put(getAllCategoriesSuccess(response.message));
    }
  } catch (error) {
    yield put(getAllCategoriesFail(error.message));
  }
}

function* getAllCategoriesAsc(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/Category/search",
      action.payload
    );
    if (response.status == 200) {
      yield put(getAllCategoriesAscSuccess(response.data));
    } else {
      yield put(getAllCategoriesAscSuccess(response.message));
    }
  } catch (error) {
    yield put(getAllCategoriesAscFail(error.message));
  }
}

// Generator function to handle the CREATE_CATEGORY action
function* createCategory(action) {
  const newcategoryData = action.payload.categoryData;
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/Category/create`,
      newcategoryData
    );

    if (response.status === 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(createCategorySuccess(response));
        yield put(createEditCategoryApiStatus(true));
        yield put(getAllCategoriesAction(newcategoryData.searchData));
      } else {
        CustomToast.error(response.data.message);
        yield put(createCategoryFail(response.data.message));
      }
    } else {
      yield put(createCategoryFail("Failed to create category"));
    }
  } catch (error) {
    yield put(createCategoryFail(error.message));
  }
}
// Generator function to handle the UPDATE_CATEGORY action
function* updateCategory(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/Category/update`,
      action.payload.updatedData
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(updateCategorySuccess());
        yield put(createEditCategoryApiStatus(true));
        yield put(
          searchCategoriesAction(action.payload.updatedData.searchData || {})
        );
      } else {
        CustomToast.error(response.data.message);
        yield put(createCategoryFail(response.data.message));
      }
    } else {
      yield put(updateCategoryFail("Failed to update category"));
    }
  } catch (error) {
    yield put(updateCategoryFail(error.message));
  }
}

// Generator function to handle the SEARCH_CATEGORIES action
function* searchCategories(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/Category/search`,
      action.payload.searchCriteria
    );
    if (response.status == 200) {
      yield put(searchCategoriesSuccess(response.data));
    } else {
      yield put(searchCategoriesSuccess(response.message));
    }
  } catch (error) {
    yield put(searchCategoriesFail(error.message));
  }
}

// Generator function to handle the GET_CATEGORY_BY_ID action
function* getCategoryById(action) {
  try {
    const response = yield call(
      axiosMain.get,
      `/admin/Category/getcategory/${action.payload.categoryId}`
    );
    // if (response.status == 200) {
    yield put(getCategoryByIdSuccess(response.data));
    // } else {
    //   yield put(getCategoryByIdSuccess(response.message));
    // }
  } catch (error) {
    yield put(getCategoryByIdFail(error.message));
  }
}

function* uploadDocument(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/Category/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsFail(error.message));
  }
}

export function* categorysSaga() {
  yield all([
    takeEvery(GET_ALL_CATEGORIES_ASC, getAllCategoriesAsc),
    takeEvery(GET_ALL_CATEGORIES, getAllCategories),
    takeEvery(CREATE_CATEGORY, createCategory),
    takeEvery(UPDATE_CATEGORY, updateCategory),
    takeEvery(SEARCH_CATEGORIES, searchCategories),
    takeEvery(GET_CATEGORY_BY_ID, getCategoryById),
    takeEvery(UPLOAD_ALL_DOCUMENTS, uploadDocument),
  ]);
}
