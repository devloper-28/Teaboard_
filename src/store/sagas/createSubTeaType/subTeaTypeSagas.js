import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_SUB_TEA_TYPES,
  CREATE_SUB_TEA_TYPE,
  UPDATE_SUB_TEA_TYPE,
  SEARCH_SUB_TEA_TYPE,
  GET_SUB_TEA_TYPE_BY_ID,
  UPLOAD_ALL_DOCUMENTS_SUB_TEA_TYPE,
} from "../../actionLabels";
import {
  getAllSubTeaTypesSuccess,
  getAllSubTeaTypesFail,
  createSubTeaTypeSuccess,
  createSubTeaTypeFail,
  updateSubTeaTypeSuccess,
  updateSubTeaTypeFail,
  searchSubTeaTypeSuccess,
  searchSubTeaTypeFail,
  getSubTeaTypeByIdSuccess,
  getSubTeaTypeByIdFail,
  uploadAllDocumentsSubTeaTypeSuccess,
  uploadAllDocumentsSubTeaTypeFail,
  createEditSubTeaTypeApiStatus,
  searchSubTeaType,
  getAllSubTeaTypes,
} from "../../actions";
import CustomToast from "../../../components/Toast";

// Sagas for getting all sub tea types
function* getAllSubTeaTypesSaga() {
  try {
    const subTeaTypes = yield call(
      axiosMain.post,
      `/admin/subTeaType/search`,
      {}
    );
    yield put(getAllSubTeaTypesSuccess(subTeaTypes.data));
  } catch (error) {
    yield put(getAllSubTeaTypesFail(error));
  }
}
// Sagas for creating a new sub tea type
function* createSubTeaTypeSaga(action) {
  try {
    const { subTeaTypeData } = action.payload;

    const createdSubTeaType = yield call(
      axiosMain.post,
      `/admin/subTeaType/create`,
      subTeaTypeData
    );

    if (createdSubTeaType.status == 200) {
      if (createdSubTeaType.data.statusCode == 200) {
        CustomToast.success(createdSubTeaType.data.message);
        yield put(createSubTeaTypeSuccess());
        yield put(createEditSubTeaTypeApiStatus(true));
        yield put(searchSubTeaType(subTeaTypeData.searchData));
      } else {
        CustomToast.error(createdSubTeaType.data.message);
        yield put(createSubTeaTypeFail(createdSubTeaType.data.message));
      }
    } else {
      yield put(
        createSubTeaTypeFail(
          createdSubTeaType.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(createSubTeaTypeFail(error));
  }
}
// Sagas for updating a sub tea type
function* updateSubTeaTypeSaga(action) {
  try {
    const updatedSubTeaType = yield call(
      axiosMain.post,
      `/admin/subTeaType/update`,
      action.payload.updatedData
    );

    if (updatedSubTeaType.status == 200) {
      if (updatedSubTeaType.data.statusCode == 200) {
        CustomToast.success(updatedSubTeaType.data.message);
        yield put(updateSubTeaTypeSuccess());
        yield put(createEditSubTeaTypeApiStatus(true));
        yield put(searchSubTeaType(action.payload.updatedData.searchData));
      } else {
        CustomToast.error(updatedSubTeaType.data.message);
        yield put(updateSubTeaTypeFail(updatedSubTeaType.data.message));
      }
    } else {
      yield put(
        updateSubTeaTypeFail(
          updatedSubTeaType.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(updateSubTeaTypeFail(error));
  }
}
// Sagas for searching sub tea types based on criteria
function* searchSubTeaTypeSaga(action) {
  try {
    const { searchCriteria } = action.payload;
    const searchResults = yield call(
      axiosMain.post,
      `/admin/subTeaType/search`,
      searchCriteria
    );
    yield put(searchSubTeaTypeSuccess(searchResults.data));
  } catch (error) {
    yield put(searchSubTeaTypeFail(error));
  }
}
// Sagas for getting sub tea type by ID
function* getSubTeaTypeByIdSaga(action) {
  try {
    const { subTeaTypeId } = action.payload;
    const subTeaType = yield call(
      axiosMain.get,
      `/admin/subTeaType/get/${subTeaTypeId}`
    );
    yield put(getSubTeaTypeByIdSuccess(subTeaType.data));
  } catch (error) {
    yield put(getSubTeaTypeByIdFail(error));
  }
}

function* uploadDocumentSubTeaType(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/subTeaType/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsSubTeaTypeSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsSubTeaTypeFail(error.message));
  }
}

export function* subTeaTypesSaga() {
  yield all([
    yield takeEvery(GET_ALL_SUB_TEA_TYPES, getAllSubTeaTypesSaga),
    yield takeEvery(CREATE_SUB_TEA_TYPE, createSubTeaTypeSaga),
    yield takeEvery(UPDATE_SUB_TEA_TYPE, updateSubTeaTypeSaga),
    yield takeEvery(SEARCH_SUB_TEA_TYPE, searchSubTeaTypeSaga),
    yield takeEvery(GET_SUB_TEA_TYPE_BY_ID, getSubTeaTypeByIdSaga),
    yield takeEvery(
      UPLOAD_ALL_DOCUMENTS_SUB_TEA_TYPE,
      uploadDocumentSubTeaType
    ),
  ]);
}

export default subTeaTypesSaga;
