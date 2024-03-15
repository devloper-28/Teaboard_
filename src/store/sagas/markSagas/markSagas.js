import { all, call, put, takeEvery } from "redux-saga/effects";
import * as allActions from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_MARK,
  UPDATE_MARK,
  CREATE_MARK,
  GET_MARK_BY_ID,
  UPLOAD_ALL_DOCUMENTS_MARK,
  GET_ALL_MARK_WITHOUT_FILTER,
  GET_ALL_FACTORY,
} from "../../actionLabels";
import CustomToast from "../../../components/Toast";

function* getAllMarkSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/mark/search",
      action.payload
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.getMarkSuccess(response.data));
      } else {
        // CustomToast.error(response.data.message);
        yield put(allActions.getMarkFail(response.data.message));
      }
    } else {
      yield put(
        allActions.getMarkFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      allActions.getMarkFail(error.message || "Unknown error occurred.")
    );
  }
}
function* updatedMarkSaga(action) {
  try {
    const { updatedMarkData } = action.payload;
    const updatedMark = yield call(
      axiosMain.post,
      `/admin/mark/update`,
      updatedMarkData
    );
    if (updatedMark.status == 200) {
      if (updatedMark.data.statusCode == 200) {
        CustomToast.success(updatedMark.data.message);
        yield put(allActions.updateMarkActionSuccess(updatedMark));
        yield put(allActions.getMarkWithoutFilter());
        yield put(
          allActions.getMark(
            updatedMarkData.searchData ? updatedMarkData.searchData : {}
          )
        );
        yield put(allActions.createEditApiStatusMark(true));
      } else {
        CustomToast.error(updatedMark.data.message);
        yield put(allActions.updateMarkActionFail(updatedMark));
      }
    } else {
      CustomToast.error(updatedMark.data.message);
      yield put(allActions.updateMarkActionFail(updatedMark));
    }
  } catch (error) {
    yield put(allActions.updateMarkActionFail(error));
  }
}
function* createMarkSaga(action) {
  try {
    const newMarkData = action.payload;
    const createdMark = yield call(
      axiosMain.post,
      `/admin/mark/create`,
      newMarkData
    );
    if (createdMark.status == 200) {
      if (createdMark.data.statusCode == 200) {
        CustomToast.success(createdMark.data.message);
        yield put(allActions.createMarkActionSuccess(createdMark));
        yield put(allActions.getMark(newMarkData.searchData));
        yield put(allActions.createEditApiStatusMark(true));
      } else {
        CustomToast.error(createdMark.data.message);
        yield put(allActions.createMarkActionFail(createdMark));
      }
    } else {
      CustomToast.error(createdMark.data.message);
      yield put(allActions.getMark({}));
    }
  } catch (error) {
    yield put(allActions.createMarkActionFail(error));
  }
}
function* getMarkByIdSaga(action) {
  try {
    const MarkId = action.payload;
    const MarkData = yield call(axiosMain.get, `/admin/mark/get/${MarkId}`);
    if (MarkData.status == 200) {
      if (MarkData.data.statusCode == 200) {
        //CustomToast.success(MarkData.data.message);
        yield put(allActions.getMarkByIdActionSuccess(MarkData.data));
      } else {
        // CustomToast.error(MarkData.data.message);
        allActions.getMarkByIdActionFail(MarkData);
      }
    } else {
      CustomToast.error(MarkData.data.message);
      allActions.getMarkByIdActionFail(MarkData);
    }
  } catch (error) {
    yield put(allActions.getMarkByIdActionFail(error));
  }
}
function* uploadDocumentMark(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/mark/getalluploadeddocument"
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.uploadAllDocumentsMarkSuccess(response.data));
        yield put(allActions.createEditApiStatus(true));
      } else {
        CustomToast.error(response.data.message);
        allActions.uploadAllDocumentsMarkFail(response.message);
      }
    } else {
      CustomToast.error(response.data.message);
      allActions.uploadAllDocumentsMarkFail(response.message);
    }
  } catch (error) {
    yield put(allActions.uploadAllDocumentsMarkFail(error.message));
  }
}
function* getMarkWithoutFilter() {
  try {
    const response = yield call(axiosMain.post, "/admin/mark/search", {});
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.getMarkSuccessWithoutFilter(response.data));
      } else {
        // CustomToast.error(response.data.message);
        yield put(allActions.getMarkFailWithoutFilter(response.data));
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(allActions.getMarkFailWithoutFilter(response.data));
    }
  } catch (error) {
    yield put(allActions.getMarkFailWithoutFilter(error));
  }
}
function* getFactoryWithoutFilter() {
  try {
    const response = yield call(axiosMain.post, "/admin/factory/search", {
      isActive: 1,
    });
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.getFactorySuccess(response.data));
      } else {
        // CustomToast.error(response.data.message);
        yield put(allActions.getFactoryFail(response.data));
      }
    } else {
      CustomToast.error(response.data.message);
      yield put(allActions.getFactoryFail(response.data));
    }
  } catch (error) {
    yield put(allActions.getFactoryFail(error));
  }
}

export function* MarkSagas() {
  yield all([
    yield takeEvery(GET_ALL_MARK, getAllMarkSaga),
    yield takeEvery(UPDATE_MARK, updatedMarkSaga),
    yield takeEvery(CREATE_MARK, createMarkSaga),
    yield takeEvery(GET_MARK_BY_ID, getMarkByIdSaga),
    yield takeEvery(UPLOAD_ALL_DOCUMENTS_MARK, uploadDocumentMark),
    yield takeEvery(GET_MARK_BY_ID, getMarkByIdSaga),
    yield takeEvery(GET_ALL_MARK_WITHOUT_FILTER, getMarkWithoutFilter),
    yield takeEvery(GET_ALL_FACTORY, getFactoryWithoutFilter),
  ]);
}
export default MarkSagas;
