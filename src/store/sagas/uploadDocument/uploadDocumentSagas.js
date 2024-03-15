import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_DOCUMENT_BY_ID,
  GET_HISTORY_BY_ID,
  GET_EXPORT_DATA,
  GET_EXPORT_DATA_FOR_VIEW,
} from "../../actionLabels";
import {
  getDocumentByIdActionSuccess,
  getDocumentByIdActionFail,
  getHistoryByIdSuccess,
  getHistoryByIdFail,
  getExportDataSuccess,
  getExportDataFail,
  getExportDataApiCall,
  getExportDataForViewSuccess,
  getExportDataForViewFail,
  getExportDataForViewApiCall,
} from "../../actions";
import CustomToast from "../../../components/Toast";

//Fetch state by ID
function* getDocumentByIdSaga(action) {
  try {
    const uploadData = yield call(
      axiosMain.get,
      `/admin/getdocumentdetail/${action.payload}`
    );

    if (uploadData.status == 200) {
      yield put(getDocumentByIdActionSuccess(uploadData.data));
    } else {
      yield put(getDocumentByIdActionFail(uploadData.message));
    }
  } catch (error) {
    yield put(getDocumentByIdActionFail(error));
  }
}

function* getHistoryByIdSaga(action) {
  try {
    const tableName = action.payload.tableName;
    const moduleName = action.payload.moduleName;
    const tableId = action.payload.id;
    const historyData = yield call(
      axiosMain.get,
      `/admin/getHistory/${tableName}/${moduleName}/${tableId}`
    );

    if (historyData.status == 200) {
      yield put(getHistoryByIdSuccess(historyData.data));
    } else {
      yield put(getHistoryByIdFail(historyData.message));
    }
  } catch (error) {
    yield put(getHistoryByIdFail(error));
  }
}

function* getExportData(action) {
  try {
    const url = action.payload.url;
    const response = yield call(axiosMain.post, url, action.payload);

    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        yield put(getExportDataSuccess(response.data));
        yield put(getExportDataApiCall(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(getExportDataFail(response.message));
      }
    } else {
      yield put(getExportDataFail(response.message));
    }
  } catch (error) {
    yield put(getExportDataFail(error));
  }
}

function* getExportDataForView(action) {
  try {
    const url = action.payload.url;
    const response = yield call(axiosMain.get, url);

    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        yield put(getExportDataForViewSuccess(response.data));
        yield put(getExportDataForViewApiCall(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(getExportDataForViewFail(response.message));
      }
    } else {
      yield put(getExportDataForViewFail(response.message));
    }
  } catch (error) {
    yield put(getExportDataForViewFail(error));
  }
}

export function* documentSaga() {
  yield all([
    takeEvery(GET_DOCUMENT_BY_ID, getDocumentByIdSaga),
    takeEvery(GET_HISTORY_BY_ID, getHistoryByIdSaga),
    takeEvery(GET_EXPORT_DATA, getExportData),
    takeEvery(GET_EXPORT_DATA_FOR_VIEW, getExportDataForView),
  ]);
}
