import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_TEA_TYPE,
  CREATE_TEA_TYPE,
  UPDATE_TEA_TYPE,
  SEARCH_TEA_TYPE,
  GET_TEA_TYPE_BY_ID,
  UPLOAD_ALL_DOCUMENTS_TEA_TYPE,
  GET_ALL_TEA_TYPE_ASC,
} from "../../actionLabels/createTeaType/teaTypeActionLable";
import {
  getAllTeaTypesSuccess,
  getAllTeaTypesFail,
  createTeaTypeSuccess,
  createTeaTypeFail,
  updateTeaTypeSuccess,
  updateTeaTypeFail,
  searchTeaTypeSuccess,
  searchTeaTypeFail,
  getTeaTypeByIdSuccess,
  getTeaTypeByIdFail,
  uploadAllDocumentsTeaTypeSuccess,
  uploadAllDocumentsTeaTypeFail,
  createEditTeaTypeApiStatus,
  searchTeaType,
  getAllTeaTypes,
  getAllTeaTypesAscFail,
  getAllTeaTypesAscSuccess,
} from "../../actions/createTeaType/teaTypeActions";
import CustomToast from "../../../components/Toast";

// Worker saga for getting all tea types
function* getAllTeaTypesSaga() {
  try {
    const response = yield call(axiosMain.post, `/admin/teaType/search`, {});
    // if (response.data == 200) {
    yield put(getAllTeaTypesSuccess(response.data));
    // } else {
    //   yield put(getAllTeaTypesSuccess(response.message));
    // }
  } catch (error) {
    yield put(getAllTeaTypesFail(error.message));
  }
}

function* getAllTeaTypesAscSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/teaType/search`,
      action.payload
    );
    // if (response.data == 200) {
    yield put(getAllTeaTypesAscSuccess(response.data));
    // } else {
    //   yield put(getAllTeaTypesSuccess(response.message));
    // }
  } catch (error) {
    yield put(getAllTeaTypesAscFail(error.message));
  }
}
// Worker saga for creating a new tea type
function* createTeaTypeSaga(action) {
  try {
    const TeaTypedata = action.payload;
    const createdTeaType = yield call(
      axiosMain.post,
      `/admin/teaType/create`,
      TeaTypedata
    );

    if (createdTeaType.status == 200) {
      if (createdTeaType.data.statusCode == 200) {
        CustomToast.success(createdTeaType.data.message);
        yield put(createTeaTypeSuccess());
        yield put(createEditTeaTypeApiStatus(true));
        yield put(searchTeaType(TeaTypedata.searchData));
      } else {
        CustomToast.error(createdTeaType.data.message);
        yield put(createTeaTypeFail(createdTeaType.data.message));
      }
    } else {
      yield put(
        createTeaTypeFail(
          createdTeaType.data.message || "Unknown error occurred."
        )
      );
    }

    // Optionally, dispatch another action to handle any additional logic after successful creation
  } catch (error) {
    yield put(createTeaTypeFail(error.message));
  }
}
// Worker saga for updating a tea type
function* updateTeaTypeSaga(action) {
  try {
    const updateTeaType = yield call(
      axiosMain.post,
      `/admin/teaType/update`,
      action.payload.updatedData
    );

    if (updateTeaType.status == 200) {
      if (updateTeaType.data.statusCode == 200) {
        CustomToast.success(updateTeaType.data.message);
        yield put(updateTeaTypeSuccess());
        yield put(createEditTeaTypeApiStatus(true));
        yield put(searchTeaType(action.payload.updatedData.searchData));
      } else {
        CustomToast.error(updateTeaType.data.message);
        yield put(updateTeaTypeFail(updateTeaType.data.message));
      }
    } else {
      yield put(
        updateTeaTypeFail(
          updateTeaType.data.message || "Unknown error occurred."
        )
      );
    }

    // Optionally, dispatch another action to handle any additional logic after successful update
  } catch (error) {
    yield put(updateTeaTypeFail(error.message));
  }
}
// Worker saga for searching tea types
function* searchTeaTypeSaga(action) {
  try {
    const searchResults = yield call(
      axiosMain.post,
      `/admin/teaType/search`,
      action.payload
    );
    yield put(searchTeaTypeSuccess(searchResults.data));
  } catch (error) {
    yield put(searchTeaTypeFail(error.message));
  }
}

// Worker saga for getting a tea type by ID
function* getTeaTypeByIdSaga(action) {
  try {
    const teaType = yield call(
      axiosMain.get,
      `/admin/teaType/get/${action.payload}`
    );
    yield put(getTeaTypeByIdSuccess(teaType.data));
  } catch (error) {
    yield put(getTeaTypeByIdFail(error.message));
  }
}

function* uploadDocumentTeaType(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/teaType/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsTeaTypeSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsTeaTypeFail(error.message));
  }
}

export function* TeaTypesSaga() {
  yield all([
    yield takeEvery(GET_ALL_TEA_TYPE_ASC, getAllTeaTypesAscSaga),
    yield takeEvery(GET_ALL_TEA_TYPE, getAllTeaTypesSaga),
    yield takeEvery(CREATE_TEA_TYPE, createTeaTypeSaga),
    yield takeEvery(UPDATE_TEA_TYPE, updateTeaTypeSaga),
    yield takeEvery(SEARCH_TEA_TYPE, searchTeaTypeSaga),
    yield takeEvery(GET_TEA_TYPE_BY_ID, getTeaTypeByIdSaga),
    yield takeEvery(UPLOAD_ALL_DOCUMENTS_TEA_TYPE, uploadDocumentTeaType),
  ]);
}
