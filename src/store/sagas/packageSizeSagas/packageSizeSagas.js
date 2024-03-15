import { all, call, put, takeEvery } from "redux-saga/effects";
import * as allActions from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_PACKAGE_SIZE,
  UPDATE_PACKAGE_SIZE,
  CREATE_PACKAGE_SIZE,
  GET_PACKAGE_SIZE_BY_ID,
  UPLOAD_ALL_DOCUMENTS_PACKAGE_SIZE,
  GET_ALL_PACKAGE_SIZE_WITHOUT_FILTER,
} from "../../actionLabels";
import CustomToast from "../../../components/Toast";

function* getAllpackageSizeSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/packageSize/search",
      action.payload
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.getpackageSizeSuccess(response.data));
      } else {
        //CustomToast.error(response.data.message);
        yield put(allActions.getpackageSizeFail(response.data.message));
      }
    } else {
      yield put(
        allActions.getpackageSizeFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      allActions.getpackageSizeFail(error.message || "Unknown error occurred.")
    );
  }
}
function* updatedpackageSizeSaga(action) {
  try {
    const { updatedpackageSizeData } = action.payload;
    const updatedpackageSize = yield call(
      axiosMain.post,
      `/admin/packageSize/update`,
      updatedpackageSizeData
    );
    if (updatedpackageSize.status == 200) {
      if (updatedpackageSize.data.statusCode == 200) {
        CustomToast.success(updatedpackageSize.data.message);
        yield put(
          allActions.updatepackageSizeActionSuccess(updatedpackageSize)
        );
        yield put(
          allActions.getpackageSize(
            updatedpackageSizeData.searchData
              ? updatedpackageSizeData.searchData
              : {}
          )
        );
        yield put(allActions.createEditApiStatuspackageSize(true));
      } else {
        CustomToast.error(updatedpackageSize.data.message);
        yield put(allActions.updatepackageSizeActionFail(updatedpackageSize));
      }
    } else {
      CustomToast.error(updatedpackageSize.data.message);
      yield put(allActions.updatepackageSizeActionFail(updatedpackageSize));
    }
  } catch (error) {
    yield put(allActions.updatepackageSizeActionFail(error));
  }
}
function* createpackageSizeSaga(action) {
  try {
    const newpackageSizeData = action.payload;
    const createdpackageSize = yield call(
      axiosMain.post,
      `/admin/packageSize/create`,
      newpackageSizeData
    );
    if (createdpackageSize.status == 200) {
      if (createdpackageSize.data.statusCode == 200) {
        CustomToast.success(createdpackageSize.data.message);
        yield put(
          allActions.createpackageSizeActionSuccess(createdpackageSize)
        );
        yield put(allActions.getpackageSize({}));
        yield put(allActions.createEditApiStatuspackageSize(true));
      } else {
        CustomToast.error(createdpackageSize.data.message);
        yield put(allActions.createpackageSizeActionFail(createdpackageSize));
      }
    } else {
      CustomToast.error(createdpackageSize.data.message);
      yield put(
        allActions.createpackageSizeActionFail(createdpackageSize.data.message)
      );
    }
  } catch (error) {
    yield put(allActions.createpackageSizeActionFail(error));
  }
}
function* getpackageSizeByIdSaga(action) {
  try {
    const packageSizeId = action.payload;
    const packageSizeData = yield call(
      axiosMain.get,
      `/admin/packageSize/get/${packageSizeId}`
    );
    if (packageSizeData.status == 200) {
      if (packageSizeData.data.statusCode == 200) {
        //CustomToast.success(packageSizeData.data.message);
        yield put(
          allActions.getpackageSizeByIdActionSuccess(packageSizeData.data)
        );
      } else {
        CustomToast.error(packageSizeData.data.message);
        allActions.getpackageSizeByIdActionFail(packageSizeData);
      }
    } else {
      CustomToast.error(packageSizeData.data.message);
      allActions.getpackageSizeByIdActionFail(packageSizeData);
    }
  } catch (error) {
    yield put(allActions.getpackageSizeByIdActionFail(error));
  }
}
function* uploadDocumentpackageSize(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/packageSize/getalluploadeddocument"
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(
          allActions.uploadAllDocumentspackageSizeSuccess(response.data)
        );
      } else {
        CustomToast.error(response.data.message);
        allActions.uploadAllDocumentspackageSizeFail(response.message);
      }
    } else {
      CustomToast.error(response.data.message);
      allActions.uploadAllDocumentspackageSizeFail(response.message);
    }
  } catch (error) {
    yield put(allActions.uploadAllDocumentspackageSizeFail(error.message));
  }
}
function* getpackageSizeWithoutFilter() {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/packageSize/search",
      {}
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.getpackageSizeSuccessWithoutFilter(response.data));
      } else {
        //CustomToast.error(response.data.message);
        yield put(allActions.getpackageSizeFailWithoutFilter(response.data));
      }
    } else {
      //CustomToast.error(response.data.message);
      yield put(allActions.getpackageSizeFailWithoutFilter(response.data));
    }
  } catch (error) {
    yield put(allActions.getpackageSizeFailWithoutFilter(error));
  }
}

export function* packageSizeSagas() {
  yield all([
    yield takeEvery(GET_ALL_PACKAGE_SIZE, getAllpackageSizeSaga),
    yield takeEvery(UPDATE_PACKAGE_SIZE, updatedpackageSizeSaga),
    yield takeEvery(CREATE_PACKAGE_SIZE, createpackageSizeSaga),
    yield takeEvery(GET_PACKAGE_SIZE_BY_ID, getpackageSizeByIdSaga),
    yield takeEvery(
      UPLOAD_ALL_DOCUMENTS_PACKAGE_SIZE,
      uploadDocumentpackageSize
    ),
    yield takeEvery(GET_PACKAGE_SIZE_BY_ID, getpackageSizeByIdSaga),
    yield takeEvery(
      GET_ALL_PACKAGE_SIZE_WITHOUT_FILTER,
      getpackageSizeWithoutFilter
    ),
  ]);
}
export default packageSizeSagas;
