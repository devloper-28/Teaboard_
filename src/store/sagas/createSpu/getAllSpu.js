import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_SPU,
  GET_ALL_SPU_WITH_STATUS,
  GET_SPU_BY_ID,
  CREATE_SPU,
  UPDATE_SPU,
  SEARCH_SPU,
  UPLOAD_ALL_DOCUMENTS_SPU,
} from "../../actionLabels";
import {
  fetchSpu,
  fetchSpuFail,
  fetchSpuSuccess,
  getAllSpuWithStatusActionSuccess,
  getAllSpuWithStatusActionFail,
  getSpuByIdActionSuccess,
  getSpuByIdActionFail,
  createSpuActionSuccess,
  createSpuActionFail,
  updateSpuActionSuccess,
  updateSpuActionFail,
  searchSpuActionSuccess,
  searchSpuActionFail,
  uploadAllDocumentsSpuSuccess,
  uploadAllDocumentsSpuFail,
  createEditSpuApiStatus,
  searchSpuAction,
} from "../../actions";
import CustomToast from "../../../components/Toast";

function* fetchSpuSaga() {
  try {
    const response = yield call(axiosMain.post, `/admin/SPUMaster/search`, {});
    yield put(fetchSpuSuccess(response.data));
  } catch (error) {
    yield put(fetchSpuFail(error));
  }
}

function* getAllSpuWithStatusSaga(action) {
  try {
    const isActive = action.payload;
    const response = yield call(
      axiosMain.get,
      `/admin/SPUMaster/search`,
      isActive
    );
    yield put(getAllSpuWithStatusActionSuccess(response.data));
  } catch (error) {
    yield put(getAllSpuWithStatusActionFail(error.message));
  }
}

function* getSpuByIdSaga(action) {
  try {
    const spuMasterId = action.payload;
    const SpuData = yield call(
      axiosMain.get,
      `/admin/SPUMaster/get/${spuMasterId}`
    );

    if (SpuData.status == 200) {
      yield put(getSpuByIdActionSuccess(SpuData.data));
    } else {
      yield put(getSpuByIdActionFail(SpuData.data.message));
    }
  } catch (error) {
    yield put(getSpuByIdActionFail(error));
  }
}

function* createSpuSaga(action) {
  try {
    const newSpuData = action.payload;
    const createdSpu = yield call(
      axiosMain.post,
      `/admin/SPUMaster/create`,
      newSpuData
    );

    if (createdSpu.status == 200) {
      if (createdSpu.data.statusCode == 200) {
        CustomToast.success(createdSpu.data.message);
        yield put(createSpuActionSuccess(createdSpu));
        yield put(searchSpuAction(newSpuData.searchData));
        yield put(createEditSpuApiStatus(true));
      } else {
        CustomToast.error(createdSpu.data.message);
        yield put(createSpuActionFail(createdSpu.data.message));
      }
    } else {
      CustomToast.error(createdSpu.message);
      yield put(createSpuActionFail(createdSpu.message));
    }
  } catch (error) {
    yield put(createSpuActionFail(error));
  }
}

function* updateSpuSaga(action) {
  try {
    const { updatedSpuData } = action.payload;
    const updatedSpu = yield call(
      axiosMain.post,
      `/admin/SPUMaster/update`,
      updatedSpuData
    );

    if (updatedSpu.status === 200) {
      if (updatedSpu.data.statusCode == 200) {
        CustomToast.success(updatedSpu.data.message);
        yield put(updateSpuActionSuccess(updatedSpu));
        yield put(searchSpuAction(updatedSpuData.searchData));
        yield put(createEditSpuApiStatus(true));
      } else {
        CustomToast.error(updatedSpu.data.message);
        yield put(updateSpuActionFail(updatedSpu.data.message));
      }
    } else {
      CustomToast.error(updatedSpu.message);
      yield put(updateSpuActionFail(updatedSpu.message));
    }
  } catch (error) {
    yield put(updateSpuActionFail(error));
  }
}

function* searchSpuSaga(action) {
  try {
    const searchTerm = action.payload;
    const searchResults = yield call(
      axiosMain.post,
      `/admin/SPUMaster/search`,
      searchTerm
    );
    yield put(searchSpuActionSuccess(searchResults.data));
  } catch (error) {
    yield put(searchSpuActionFail(error));
  }
}

function* uploadDocumentSpu(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/state/getalluploadeddocument"
    );
    yield put(uploadAllDocumentsSpuSuccess(response.data));
  } catch (error) {
    yield put(uploadAllDocumentsSpuFail(error.message));
  }
}

export function* SpusSaga() {
  yield all([
    takeEvery(GET_ALL_SPU, fetchSpuSaga),
    takeEvery(GET_ALL_SPU_WITH_STATUS, getAllSpuWithStatusSaga),
    takeEvery(GET_SPU_BY_ID, getSpuByIdSaga),
    takeEvery(CREATE_SPU, createSpuSaga),
    takeEvery(UPDATE_SPU, updateSpuSaga),
    takeEvery(SEARCH_SPU, searchSpuSaga),
    takeEvery(UPLOAD_ALL_DOCUMENTS_SPU, uploadDocumentSpu),
  ]);
}
