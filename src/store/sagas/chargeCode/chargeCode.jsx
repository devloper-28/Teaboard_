import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_CHARGE_CODE,
  CREATE_CHARGE_CODE,
  CREATE_CHARGE_CODE_SUCCESS,
  CREATE_CHARGE_CODE_FAIL,
  UPDATE_CHARGE_CODE,
  GET_CHARGE_CODE_BY_ID,
  UPLOAD_ALL_DOCUMENTS_CHARGE_CODE,
  GET_ALL_CHARGE_CODE_WITHOUT_FILTER,
  GET_ALL_CHARGE_CODE_ASC,
} from "../../actionLabels";
import * as chargeCodeActions from "../../actions";
import CustomToast from "../../../components/Toast";

function* getAllChargeCodeSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/chargecode/search",
      action.payload
    );
    yield put(chargeCodeActions.getChargeCodeSuccess(response.data));
  } catch (error) {
    yield put(chargeCodeActions.getChargeCodeFail(error));
  }
}

function* getAllChargeCodeAscSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/chargecode/search",
      action.payload
    );
    yield put(chargeCodeActions.getChargeCodeAscSuccess(response.data));
  } catch (error) {
    yield put(chargeCodeActions.getChargeCodeAscFail(error));
  }
}

function* getChargeCodeWithoutFilter() {
  try {
    const response = yield call(axiosMain.post, "/admin/chargecode/search", {});
    yield put(
      chargeCodeActions.getChargeCodeSuccessWithoutFilter(response.data)
    );
  } catch (error) {
    yield put(chargeCodeActions.getChargeCodeFailWithoutFilter(error));
  }
}

function* createChargeCodeSaga(action) {
  try {
    const newChargeCodeData = action.payload;
    const createdChargeCode = yield call(
      axiosMain.post,
      `/admin/chargecode/create`,
      newChargeCodeData
    );

    if (createdChargeCode.status === 200) {
      if (createdChargeCode.data.statusCode == 200) {
        CustomToast.success(createdChargeCode.data.message);
        yield put(
          chargeCodeActions.createChargeCodeActionSuccess(createdChargeCode)
        );
        yield put(chargeCodeActions.getChargeCode(newChargeCodeData.searchData));
        yield put(chargeCodeActions.createEditChargeCodeApiStatus(true));
      } else {
        CustomToast.error(createdChargeCode.data.message);
        yield put(
          chargeCodeActions.createChargeCodeActionFail(
            createdChargeCode.data.message
          )
        );
      }
    } else {
      yield put(
        chargeCodeActions.createChargeCodeActionFail(
          "Failed to create category"
        )
      );
    }
  } catch (error) {
    yield put(chargeCodeActions.createChargeCodeActionFail(error));
  }
}

//updating a chargeCode
function* updatedChargeCodeSaga(action) {
  try {
    const { updatedChargeCodeData } = action.payload;
    const updatedChargeCode = yield call(
      axiosMain.post,
      `/admin/chargecode/update`,
      updatedChargeCodeData
    );

    if (updatedChargeCode.status === 200) {
      if (updatedChargeCode.data.statusCode == 200) {
        CustomToast.success(updatedChargeCode.data.message);
        yield put(
          chargeCodeActions.updateChargeCodeActionSuccess(updatedChargeCode)
        );
        yield put(
          chargeCodeActions.getChargeCode(updatedChargeCodeData.searchData)
        );
        yield put(
          chargeCodeActions.getChargeCodeAsc(updatedChargeCodeData.searchasd)
        );
        yield put(chargeCodeActions.createEditChargeCodeApiStatus(true));
      } else {
        CustomToast.error(updatedChargeCode.data.message);
        yield put(
          chargeCodeActions.updateChargeCodeActionFail(
            updatedChargeCode.data.message
          )
        );
      }
    } else {
      yield put(
        chargeCodeActions.updateChargeCodeActionFail(
          "Failed to create category"
        )
      );
    }
  } catch (error) {
    yield put(chargeCodeActions.updateChargeCodeActionFail(error));
  }
}

//Fetch chargeCode by ID
function* getChargeCodeByIdSaga(action) {
  try {
    const chargeCodeId = action.payload;
    const chargeCodeData = yield call(
      axiosMain.get,
      `/admin/chargecode/getChargeCode/${chargeCodeId}`
    );

    if (chargeCodeData.status == 200) {
      yield put(
        chargeCodeActions.getChargeCodeByIdActionSuccess(chargeCodeData.data)
      );
    } else {
      yield put(
        chargeCodeActions.getChargeCodeByIdActionFail(
          chargeCodeData.data.message
        )
      );
    }
  } catch (error) {
    yield put(chargeCodeActions.getChargeCodeByIdActionFail(error));
  }
}

function* uploadDocumentConfigParam(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/chargecode/getalluploadeddocument"
    );
    yield put(
      chargeCodeActions.uploadAllDocumentsChargeCodeSuccess(response.data)
    );
  } catch (error) {
    yield put(
      chargeCodeActions.uploadAllDocumentsChargeCodeFail(error.message)
    );
  }
}
export function* getAllchargeCodesSaga() {
  yield all([
    yield takeEvery(GET_ALL_CHARGE_CODE_ASC, getAllChargeCodeAscSaga),
    yield takeEvery(GET_ALL_CHARGE_CODE, getAllChargeCodeSaga),
    yield takeEvery(
      GET_ALL_CHARGE_CODE_WITHOUT_FILTER,
      getChargeCodeWithoutFilter
    ),
    yield takeEvery(CREATE_CHARGE_CODE, createChargeCodeSaga),
    yield takeEvery(UPDATE_CHARGE_CODE, updatedChargeCodeSaga),
    yield takeEvery(GET_CHARGE_CODE_BY_ID, getChargeCodeByIdSaga),
    yield takeEvery(
      UPLOAD_ALL_DOCUMENTS_CHARGE_CODE,
      uploadDocumentConfigParam
    ),
  ]);
}

export default getAllchargeCodesSaga;
