import { all, call, put, takeEvery } from "redux-saga/effects";
import * as allActions from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_PACKAGE_TYPE,
  UPDATE_PACKAGE_TYPE,
  CREATE_PACKAGE_TYPE,
  GET_PACKAGE_TYPE_BY_ID,
  UPLOAD_ALL_DOCUMENTS_PACKAGE_TYPE,
  GET_ALL_PACKAGE_TYPE_WITHOUT_FILTER,
} from "../../actionLabels";
import CustomToast from "../../../components/Toast";

function* getAllpackageTypeSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/packageType/search",
      action.payload
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.getpackageTypeSuccess(response.data));
      } else {
        //CustomToast.error(response.data.message);
        yield put(allActions.getpackageTypeFail(response.data.message));
      }
    } else {
      yield put(
        allActions.getpackageTypeFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      allActions.getpackageTypeFail(error.message || "Unknown error occurred.")
    );
  }
}
function* updatedpackageTypeSaga(action) {
  try {
    const { updatedpackageTypeData } = action.payload;
    const updatedpackageType = yield call(
      axiosMain.post,
      `/admin/packageType/update`,
      updatedpackageTypeData
    );
    if (updatedpackageType.status == 200) {
      if (updatedpackageType.data.statusCode == 200) {
        CustomToast.success(updatedpackageType.data.message);
        yield put(
          allActions.updatepackageTypeActionSuccess(updatedpackageType)
        );
        yield put(
          allActions.getpackageType(
            updatedpackageTypeData.searchData
              ? updatedpackageTypeData.searchData
              : { isActive: 1 }
          )
        );
        yield put(allActions.createEditApiStatuspackageType(true));
      } else {
        CustomToast.error(updatedpackageType.data.message);
        yield put(allActions.updatepackageTypeActionFail(updatedpackageType));
      }
    } else {
      CustomToast.error(updatedpackageType.data.message);
      yield put(allActions.updatepackageTypeActionFail(updatedpackageType));
    }
  } catch (error) {
    yield put(allActions.updatepackageTypeActionFail(error));
  }
}
function* createpackageTypeSaga(action) {
  try {
    const newpackageTypeData = action.payload;
    const createdpackageType = yield call(
      axiosMain.post,
      `/admin/packageType/create`,
      newpackageTypeData
    );
    if (createdpackageType.status == 200) {
      if (createdpackageType.data.statusCode == 200) {
        CustomToast.success(createdpackageType.data.message);
        yield put(
          allActions.createpackageTypeActionSuccess(createdpackageType)
        );
        yield put(
          allActions.getpackageType(
            createdpackageType.searchData
              ? createdpackageType.searchData
              : { isActive: 1 }
          )
        );
        yield put(allActions.createEditApiStatuspackageType(true));
      } else {
        CustomToast.error(createdpackageType.data.message);
        yield put(allActions.createpackageTypeActionFail(createdpackageType));
      }
    } else {
      CustomToast.error(createdpackageType.data.message);
      yield put(allActions.getpackageType({ isActive: 1 }));
    }
  } catch (error) {
    yield put(allActions.createpackageTypeActionFail(error));
  }
}
function* getpackageTypeByIdSaga(action) {
  try {
    const packageTypeId = action.payload;
    const packageTypeData = yield call(
      axiosMain.get,
      `/admin/packageType/get/${packageTypeId}`
    );
    if (packageTypeData.status == 200) {
      if (packageTypeData.data.statusCode == 200) {
        //CustomToast.success(packageTypeData.data.message);
        yield put(
          allActions.getpackageTypeByIdActionSuccess(packageTypeData.data)
        );
      } else {
        //CustomToast.error(packageTypeData.data.message);
        allActions.getpackageTypeByIdActionFail(packageTypeData);
      }
    } else {
      CustomToast.error(packageTypeData.data.message);
      allActions.getpackageTypeByIdActionFail(packageTypeData);
    }
  } catch (error) {
    yield put(allActions.getpackageTypeByIdActionFail(error));
  }
}
function* uploadDocumentpackageType(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/packageType/getalluploadeddocument"
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(
          allActions.uploadAllDocumentspackageTypeSuccess(response.data)
        );
      } else {
        CustomToast.error(response.data.message);
        allActions.uploadAllDocumentspackageTypeFail(response.message);
      }
    } else {
      CustomToast.error(response.data.message);
      allActions.uploadAllDocumentspackageTypeFail(response.message);
    }
  } catch (error) {
    yield put(allActions.uploadAllDocumentspackageTypeFail(error.message));
  }
}
function* getpackageTypeWithoutFilter() {
  try {
    const response = yield call(axiosMain.post, "/admin/packageType/search", {
      isActive: 1,
    });
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.getpackageTypeSuccessWithoutFilter(response.data));
      } else {
        //CustomToast.error(response.data.message);
        yield put(allActions.getpackageTypeFailWithoutFilter(response.data));
      }
    } else {
      //CustomToast.error(response.data.message);
      yield put(allActions.getpackageTypeFailWithoutFilter(response.data));
    }
  } catch (error) {
    yield put(allActions.getpackageTypeFailWithoutFilter(error));
  }
}

export function* packageTypeSagas() {
  yield all([
    yield takeEvery(GET_ALL_PACKAGE_TYPE, getAllpackageTypeSaga),
    yield takeEvery(UPDATE_PACKAGE_TYPE, updatedpackageTypeSaga),
    yield takeEvery(CREATE_PACKAGE_TYPE, createpackageTypeSaga),
    yield takeEvery(GET_PACKAGE_TYPE_BY_ID, getpackageTypeByIdSaga),
    yield takeEvery(
      UPLOAD_ALL_DOCUMENTS_PACKAGE_TYPE,
      uploadDocumentpackageType
    ),
    yield takeEvery(GET_PACKAGE_TYPE_BY_ID, getpackageTypeByIdSaga),
    yield takeEvery(
      GET_ALL_PACKAGE_TYPE_WITHOUT_FILTER,
      getpackageTypeWithoutFilter
    ),
  ]);
}
export default packageTypeSagas;
