import { all, call, put, takeEvery } from "redux-saga/effects";
import * as allActions from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_GRACE,
  UPDATE_GRACE,
  CREATE_GRACE,
  GET_GRACE_BY_ID,
  UPLOAD_ALL_DOCUMENTS_GRACE,
  GET_ALL_GRACE_WITHOUT_FILTER,
  GET_ALL_SALENO_PREAUCTION,
} from "../../actionLabels";
import CustomToast from "../../../components/Toast";

function* getAllGraceSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/grace/search",
      action.payload
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.getGraceSuccess(response.data));
      } else {
        //CustomToast.error(response.data.message);
        yield put(allActions.getGraceFail(response.data.message));
      }
    } else {
      yield put(
        allActions.getGraceFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      allActions.getGraceFail(error.message || "Unknown error occurred.")
    );
  }
}
function* updatedGraceSaga(action) {
  try {
    const { updatedGraceData } = action.payload;
    const updatedGrace = yield call(
      axiosMain.post,
      `/admin/grace/update`,
      updatedGraceData
    );
    if (updatedGrace.status == 200) {
      if (updatedGrace.data.statusCode == 200) {
        CustomToast.success(updatedGrace.data.message);
        yield put(allActions.updateGraceActionSuccess(updatedGrace));
        yield put(
          allActions.getGrace(
            updatedGraceData.searchData ? updatedGraceData.searchData : {}
          )
        );
        yield put(allActions.createEditApiStatusGrace(true));
      } else {
        CustomToast.error(updatedGrace.data.message);
        yield put(allActions.updateGraceActionFail(updatedGrace));
      }
    } else {
      CustomToast.error(updatedGrace.data.message);
      yield put(allActions.updateGraceActionFail(updatedGrace));
    }
  } catch (error) {
    yield put(allActions.updateGraceActionFail(error));
  }
}
function* createGraceSaga(action) {
  try {
    const newGraceData = action.payload;
    const createdGrace = yield call(
      axiosMain.post,
      `/admin/grace/create`,
      newGraceData
    );
     
      if (createdGrace.data.statusCode == 200) {
        CustomToast.success(createdGrace.data.message);
        yield put(allActions.createGraceActionSuccess(createdGrace));
        yield put(allActions.getGrace(newGraceData.searchData));
        yield put(allActions.createEditApiStatusGrace(true));
      } else {
        CustomToast.error(createdGrace.data.message);
        yield put(allActions.createGraceActionFail(createdGrace));
      }
    } 
    catch (error) {
    yield put(allActions.createGraceActionFail(error));
  }
}
function* getGraceByIdSaga(action) {
  try {
    const GraceId = action.payload;
    const GraceData = yield call(axiosMain.get, `/admin/grace/get/${GraceId}`);
    if (GraceData.status == 200) {
      if (GraceData.data.statusCode == 200) {
        //CustomToast.success(GraceData.data.message);
        yield put(allActions.getGraceByIdActionSuccess(GraceData.data));
      } else {
        CustomToast.error(GraceData.data.message);
        allActions.getGraceByIdActionFail(GraceData);
      }
    } else {
      CustomToast.error(GraceData.data.message);
      allActions.getGraceByIdActionFail(GraceData);
    }
  } catch (error) {
    yield put(allActions.getGraceByIdActionFail(error));
  }
}
function* uploadDocumentGrace(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/grace/getalluploadeddocument"
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.uploadAllDocumentsGraceSuccess(response.data));
      } else {
        CustomToast.error(response.data.message);
        allActions.uploadAllDocumentsGraceFail(response.message);
      }
    } else {
      CustomToast.error(response.data.message);
      allActions.uploadAllDocumentsGraceFail(response.message);
    }
  } catch (error) {
    yield put(allActions.uploadAllDocumentsGraceFail(error.message));
  }
}
function* getGraceWithoutFilter() {
  try {
    const response = yield call(axiosMain.post, "/admin/grace/search", {});
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.getGraceSuccessWithoutFilter(response.data));
      } else {
        //CustomToast.error(response.data.message);
        yield put(allActions.getGraceFailWithoutFilter(response.data));
      }
    } else {
      //CustomToast.error(response.data.message);
      yield put(allActions.getGraceFailWithoutFilter(response.data));
    }
  } catch (error) {
    yield put(allActions.getGraceFailWithoutFilter(error));
  }
}
function* getAllSaleNoSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/preauction/Common/BindSaleNoBySeasonAndAuctionCenter",
      action.payload
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.getSaleNoPreauctionSuccess(response.data));
      } else {
        //CustomToast.error(response.data.message);
        yield put(allActions.getSaleNoPreauctionFail(response.data.message));
      }
    } else {
      yield put(
        allActions.getSaleNoPreauctionFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      allActions.getGraceFail(error.message || "Unknown error occurred.")
    );
  }
}

export function* GraceSagas() {
  yield all([
    yield takeEvery(GET_ALL_GRACE, getAllGraceSaga),
    yield takeEvery(UPDATE_GRACE, updatedGraceSaga),
    yield takeEvery(CREATE_GRACE, createGraceSaga),
    yield takeEvery(GET_GRACE_BY_ID, getGraceByIdSaga),
    yield takeEvery(UPLOAD_ALL_DOCUMENTS_GRACE, uploadDocumentGrace),
    yield takeEvery(GET_GRACE_BY_ID, getGraceByIdSaga),
    yield takeEvery(GET_ALL_GRACE_WITHOUT_FILTER, getGraceWithoutFilter),
    yield takeEvery(GET_ALL_SALENO_PREAUCTION, getAllSaleNoSaga),
  ]);
}
export default GraceSagas;
