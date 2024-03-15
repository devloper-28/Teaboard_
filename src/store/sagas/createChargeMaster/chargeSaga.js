import { all, call, put, takeEvery } from "redux-saga/effects";

import {
  GET_ALL_CHARGE,
  CREATE_CHARGE,
  UPDATE_CHARGE,
  GET_ALL_AUCTION_CENTER_SUCCESS,
  GET_CHARGE_BY_ID,
  SEARCH_CHARGE,
  UPLOAD_ALL_DOCUMENTS_CHARGE,
  GET_ALL_CHARGE_ASC,
} from "../../actionLabels";
import {
  getAllChargeActionFail,
  getAllChargeActionSuccess,
  getAllCharge,
  getAllChargeAction,
  createChargeActionFail,
  createChargeActionSuccess,
  updateChargeActionSuccess,
  updateChargeActionFail,
  getChargeByIdActionSuccess,
  getChargeByIdActionFail,
  searchChargeActionSuccess,
  searchChargeActionFail,
  uploadAllDocumentsChargeSuccess,
  uploadAllDocumentsChargeFail,
  getalluploadeddocument,
  createEditChargeMasterApiStatus,
  searchChargeAction,
  getAllChargeActionSuccessAsc,
  getAllChargeFailAsc,
} from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import CustomToast from "../../../components/Toast";

// function* getAllChargeMasterWithStatusSaga(action) {
//   try {
//     const isActive = action.payload;
//     const response = yield call(
//       axiosMain.get,
//       `admin/TAXMASTERcountDetails/getAll/1/1/0`,
//       isActive
//     );
//     yield put(getAllChargeMasterStatusActionSuccess(response.data));
//   } catch (error) {
//     yield put(getAllTaxMasterWithStatusActionFail(error.message));
//   }
// }

//  function for getting all ChargeMaster
function* getAllChargeSaga(action) {
  try {
    //console.log("data");
    const response = yield call(
      axiosMain.post,
      "admin/chargeMaster/search",
      {}
    );
    if (response.status === 200) {
      yield put(getAllChargeActionSuccess(response.data));
    } else {
      yield put(GET_ALL_CHARGE.getAllChargeSuccess(response.massage));
    }
  } catch (error) {
    yield put(GET_ALL_CHARGE.getAllChargeFail(error));
  }
}

function* getAllChargeAscSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "admin/chargeMaster/search",
      action.payload
    );
    if (response.status === 200) {
      yield put(getAllChargeActionSuccessAsc(response.data));
    } else {
      yield put(GET_ALL_CHARGE_ASC.getAllChargeSuccessAsc(response.massage));
    }
  } catch (error) {
    yield put(GET_ALL_CHARGE_ASC.getAllChargeFailAsc(error));
  }
}

//Fetch Charge by ID
function* getChargeByIdSaga(action) {
  try {
    const chargeId = action.payload;
    const chargeData = yield call(
      axiosMain.get,
      `admin/chargeMaster/get/${chargeId}`
    );

    if (chargeData.status === 200) {
      yield put(getChargeByIdActionSuccess(chargeData.data));
    } else {
      yield put(getChargeByIdActionFail(chargeData.message));
    }
  } catch (error) {
    yield put(getChargeByIdActionFail(error));
  }
}

//Creating a new Charge
function* createChargeSaga(action) {
  try {
    const newChargeData = action.payload;
    const createdCharge = yield call(
      axiosMain.post,
      `admin/chargeMaster/create`,
      newChargeData
    );
    if (createdCharge.status === 200) {
      if (createdCharge.data.statusCode == 200) {
        CustomToast.success(createdCharge.data.message);
        yield put(createChargeActionSuccess(createdCharge));
        yield put(searchChargeAction({}));
        yield put(createEditChargeMasterApiStatus(true));
      } else {
        CustomToast.error(createdCharge.data.message);
        yield put(createChargeActionFail(createdCharge.data.message));
      }
    } else {
      yield put(
        createChargeActionFail(
          createdCharge.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      createChargeActionFail(error.message || "Unknown error occurred.")
    );
  }
}

//updating a charge
function* updateChargeSaga(action) {
  try {
    const { updatedchargeData } = action.payload;
    const updatedCharge = yield call(
      axiosMain.post,
      `admin/chargeMaster/update`,
      updatedchargeData
    );
    if (updatedCharge.status === 200) {
      if (updatedCharge.data.statusCode == 200) {
        CustomToast.success(updatedCharge.data.message);
        yield put(updateChargeActionSuccess(updatedCharge));
        yield put(
          searchChargeAction(action.payload.updatedchargeData.searchData)
        );
        yield put(createEditChargeMasterApiStatus(true));
      } else {
        CustomToast.error(updatedCharge.data.message);
        yield put(updateChargeActionFail(updatedCharge.data.message));
      }
    } else {
      yield put(updateChargeActionFail(updatedCharge.message));
    }
  } catch (error) {
    yield put(updateChargeActionFail(error.message));
  }
}

//searching a charge
function* searchChargeSaga(action) {
  try {
    const searchTerm = action.payload;
    const searchResults = yield call(
      axiosMain.post,
      `admin/chargeMaster/search`,
      searchTerm
    );
    if (searchResults.status === 200) {
      yield put(searchChargeActionSuccess(searchResults.data));
    } else {
      yield put(searchChargeActionFail(searchResults));
    }
  } catch (error) {
    yield put(searchChargeActionFail(error));
  }
}
//uploadDocument
function* uploadDocumentCharge(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "admin/chargeMaster/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsChargeSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsChargeFail(error.message));
  }
}

export function* chargeSaga() {
  yield all([
    yield takeEvery(GET_ALL_CHARGE_ASC, getAllChargeAscSaga),
    yield takeEvery(GET_ALL_CHARGE, getAllChargeSaga),
    yield takeEvery(GET_CHARGE_BY_ID, getChargeByIdSaga),
    yield takeEvery(CREATE_CHARGE, createChargeSaga),
    yield takeEvery(UPDATE_CHARGE, updateChargeSaga),
    yield takeEvery(SEARCH_CHARGE, searchChargeSaga),
    yield takeEvery(UPLOAD_ALL_DOCUMENTS_CHARGE, uploadDocumentCharge),
  ]);
}

export default chargeSaga;
