import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_PLANTATION,
  CREATE_PLANTATION,
  UPDATE_PLANTATION,
  SEARCH_PLANTATION,
  UPLOAD_ALL_DOCUMENTS_PLANTATION,
  GET_PLANTATION_BY_ID,
  GET_ALL_PLANTATION_ASC,
} from "../../actionLabels";
import {
  getAllPlantationActionSuccess,
  getAllPlantationActionFail,
  createPlantationActionSuccess,
  createPlantationActionFail,
  updatePlantationActionSuccess,
  updatePlantationActionFail,
  searchPlantationActionSuccess,
  searchPlantationActionFail,
  getPlantationByIdActionSuccess,
  getPlantationByIdActionFail,
  uploadAllDocumentsPlantationSuccess,
  uploadAllDocumentsPlantationFail,
  createEditPlantationApiStatus,
  searchPlantationAction,
  getAllPlantationAscActionSuccess,
  getAllPlantationAscActionFail,
} from "../../actions";
import CustomToast from "../../../components/Toast";

// GET ALL PLANTATION
function* getAllPlantation() {
  try {
    const response = yield call(axiosMain.post, `/admin/plantation/search`, {});
    yield put(getAllPlantationActionSuccess(response.data));
  } catch (error) {
    yield put(getAllPlantationActionFail(error));
  }
}

function* getAllPlantationAsc(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/plantation/search`,
      action.payload
    );
    yield put(getAllPlantationAscActionSuccess(response.data));
  } catch (error) {
    yield put(getAllPlantationAscActionFail(error));
  }
}

// CREATE PLANTATION
function* createPlantation(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/plantation/create`,
      action.payload
    );

    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(createPlantationActionSuccess(response.data));
        yield put(searchPlantationAction(action.payload.searchData));
        yield put(createEditPlantationApiStatus(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(createPlantationActionFail(response.data.message));
      }
    } else {
      yield put(
        createPlantationActionFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(createPlantationActionFail(error));
  }
}

// UPDATE PLANTATION
function* updatePlantation(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/plantation/update`,
      action.payload
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(updatePlantationActionSuccess(response.data));
        yield put(searchPlantationAction(action.payload.searchData));
        yield put(createEditPlantationApiStatus(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(updatePlantationActionFail(response.data.message));
      }
    } else {
      yield put(
        updatePlantationActionFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(updatePlantationActionFail(error));
  }
}

// SEARCH PLANTATION
function* searchPlantation(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/plantation/search`,
      action.payload
    );
    yield put(searchPlantationActionSuccess(response.data));
  } catch (error) {
    yield put(searchPlantationActionFail(error));
  }
}

// GET PLANTATION BY ID
function* getPlantationById(action) {
  try {
    const response = yield call(
      axiosMain.get,
      `/admin/plantation/get/${action.payload}`
    );
    yield put(getPlantationByIdActionSuccess(response.data));
  } catch (error) {
    yield put(getPlantationByIdActionFail(error));
  }
}

function* uploadDocumentPlantation(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/plantation/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsPlantationSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsPlantationFail(error.message));
  }
}

export function* plantationSaga() {
  yield all([
    yield takeEvery(GET_ALL_PLANTATION_ASC, getAllPlantationAsc),
    yield takeEvery(GET_ALL_PLANTATION, getAllPlantation),
    yield takeEvery(CREATE_PLANTATION, createPlantation),
    yield takeEvery(UPDATE_PLANTATION, updatePlantation),
    yield takeEvery(SEARCH_PLANTATION, searchPlantation),
    yield takeEvery(GET_PLANTATION_BY_ID, getPlantationById),
    yield takeEvery(UPLOAD_ALL_DOCUMENTS_PLANTATION, uploadDocumentPlantation),
  ]);
}

export default plantationSaga;
