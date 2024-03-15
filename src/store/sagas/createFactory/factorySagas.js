import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_FACTORY_TYPES,
  CREATE_FACTORY_TYPE,
  UPDATE_FACTORY_TYPE,
  SEARCH_FACTORY_TYPE,
  GET_FACTORY_TYPE_BY_ID,
  UPLOAD_ALL_DOCUMENTS_FACTORY_TYPE,
  GET_ALL_FACTORY_TYPES_ASC,
} from "../../actionLabels";
import {
  getAllFactoryTypesSuccess,
  getAllFactoryTypesFail,
  createFactoryTypeSuccess,
  createFactoryTypeFail,
  updateFactoryTypeSuccess,
  updateFactoryTypeFail,
  searchFactoryTypeSuccess,
  searchFactoryTypeFail,
  getFactoryTypeByIdSuccess,
  getFactoryTypeByIdFail,
  uploadAllDocumentsFactoryTypeSuccess,
  uploadAllDocumentsFactoryTypeFail,
  createEditFactoryTypeApiStatus,
  searchFactoryType,
  getAllFactoryAscTypesSuccess,
  getAllFactoryAscTypesFail,
} from "../../actions";
import CustomToast from "../../../components/Toast";

// Function to fetch all factory types
function* getAllFactoryTypesSaga() {
  try {
    const factoryTypes = yield call(
      axiosMain.post,
      `/admin/factorytype/search`,
      {}
    );
    yield put(getAllFactoryTypesSuccess(factoryTypes.data));
  } catch (error) {
    yield put(getAllFactoryTypesFail(error.message));
  }
}

function* getAllFactoryAscTypesSaga(action) {
  try {
    const factoryTypes = yield call(
      axiosMain.post,
      `/admin/factorytype/search`,
      action.payload
    );
    yield put(getAllFactoryAscTypesSuccess(factoryTypes.data));
  } catch (error) {
    yield put(getAllFactoryAscTypesFail(error.message));
  }
}
// Function to create a new factory type
function* createFactoryTypeSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/factorytype/create`,
      action.payload
    );

    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(createFactoryTypeSuccess(response));
        yield put(searchFactoryType(action.payload.searchData));
        yield put(createEditFactoryTypeApiStatus(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(createFactoryTypeFail(response.data.message));
      }
    } else {
      yield put(
        createFactoryTypeFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(createFactoryTypeFail(error.message));
  }
}
// Function to update a factory type
function* updateFactoryTypeSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/factorytype/update`,
      action.payload.updatedData
    );

    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(updateFactoryTypeSuccess(response));
        yield put(searchFactoryType(action.payload.updatedData.searchData));
        yield put(createEditFactoryTypeApiStatus(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(updateFactoryTypeFail(response.data.message));
      }
    } else {
      yield put(
        updateFactoryTypeFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(updateFactoryTypeFail(error.message));
  }
}
// Function to search for factory types based on criteria
function* searchFactoryTypeSaga(action) {
  try {
    const { searchCriteria } = action.payload;
    const searchResults = yield call(
      axiosMain.post,
      `/admin/factorytype/search`,
      action.payload
    );
    yield put(searchFactoryTypeSuccess(searchResults.data));
  } catch (error) {
    yield put(searchFactoryTypeFail(error.message));
  }
}
// Function to get factory type by ID
function* getFactoryTypeByIdSaga(action) {
  try {
    const factoryType = yield call(
      axiosMain.get,
      `/admin/factorytype/get/${action.payload}`
    );
    yield put(getFactoryTypeByIdSuccess(factoryType.data));
  } catch (error) {
    yield put(getFactoryTypeByIdFail(error.message));
  }
}

function* uploadDocumentFactoryType(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/factorytype/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsFactoryTypeSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsFactoryTypeFail(error.message));
  }
}

export function* factorysSagas() {
  yield all([
    takeEvery(GET_ALL_FACTORY_TYPES_ASC, getAllFactoryAscTypesSaga),
    takeEvery(GET_ALL_FACTORY_TYPES, getAllFactoryTypesSaga),
    takeEvery(CREATE_FACTORY_TYPE, createFactoryTypeSaga),
    takeEvery(UPDATE_FACTORY_TYPE, updateFactoryTypeSaga),
    takeEvery(SEARCH_FACTORY_TYPE, searchFactoryTypeSaga),
    takeEvery(GET_FACTORY_TYPE_BY_ID, getFactoryTypeByIdSaga),
    takeEvery(UPLOAD_ALL_DOCUMENTS_FACTORY_TYPE, uploadDocumentFactoryType),
  ]);
}
