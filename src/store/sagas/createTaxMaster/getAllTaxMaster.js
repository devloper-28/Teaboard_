import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_TAXMASTER,
  GET_ALL_TAXMASTER_WITH_STATUS,
  GET_TAXMASTER_BY_ID,
  CREATE_TAXMASTER,
  UPDATE_TAXMASTER,
  SEARCH_TAXMASTER,
  UPLOAD_ALL_DOCUMENTS_TAXMASTER,
} from "../../actionLabels";
import {
  fetchTaxMaster,
  fetchTaxMasterFail,
  fetchTaxMasterSuccess,
  getAllTaxMasterWithStatusActionSuccess,
  getAllTaxMasterWithStatusActionFail,
  getTaxMasterByIdActionSuccess,
  getTaxMasterByIdActionFail,
  createTaxMasterActionSuccess,
  createTaxMasterActionFail,
  updateTaxMasterActionSuccess,
  updateTaxMasterActionFail,
  searchTaxMasterActionSuccess,
  searchTaxMasterActionFail,
  uploadAllDocumentsTaxMasterSuccess,
  uploadAllDocumentsTaxMasterFail,
  createEditTaxMasterApiStatus,
  searchTaxMasterAction,
} from "../../actions";
import CustomToast from "../../../components/Toast";

function* fetchTaxMasterSaga() {
  try {
    const response = yield call(axiosMain.post, `/admin/taxmaster/search`, {});
    //console.log("sagasData:", response);
    yield put(fetchTaxMasterSuccess(response.data));
  } catch (error) {
    yield put(fetchTaxMasterFail(error));
  }
}

function* getAllTaxMasterWithStatusSaga(action) {
  try {
    const isActive = action.payload;
    const response = yield call(
      axiosMain.get,
      `/admin/TAXMASTERcountDetails/getAll/1/1/0`,
      isActive
    );
    yield put(getAllTaxMasterWithStatusActionSuccess(response.data));
  } catch (error) {
    yield put(getAllTaxMasterWithStatusActionFail(error.message));
  }
}

function* getTaxMasterByIdSaga(action) {
  try {
    const taxMasterId = action.payload;
    const TaxMasterData = yield call(
      axiosMain.get,
      `/admin/taxmaster/get/${taxMasterId}`
    );

    if (TaxMasterData.status == 200) {
      yield put(getTaxMasterByIdActionSuccess(TaxMasterData.data));
    } else {
      yield put(getTaxMasterByIdActionFail(TaxMasterData.data.message));
    }
  } catch (error) {
    yield put(getTaxMasterByIdActionFail(error));
  }
}
//creating a new TAXMASTER
function* createTaxMasterSaga(action) {
  try {
    const newTaxMasterData = action.payload;
    const createdTaxMaster = yield call(
      axiosMain.post,
      `/admin/taxmaster/create`,
      newTaxMasterData
    );

    if (createdTaxMaster.status == 200) {
      if (createdTaxMaster.data.statusCode == 200) {
        CustomToast.success(createdTaxMaster.data.message);
        yield put(createTaxMasterActionSuccess(createdTaxMaster));
        yield put(searchTaxMasterAction(newTaxMasterData.searchData));
        yield put(createEditTaxMasterApiStatus(true));
      } else {
        CustomToast.error(createdTaxMaster.data.message);
        yield put(createTaxMasterActionFail(createdTaxMaster.data.message));
      }
    } else {
      yield put(
        createTaxMasterActionFail(
          createdTaxMaster.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(createTaxMasterActionFail(error));
  }
}

//updating a TAXMASTER
function* updateTaxMasterSaga(action) {
  try {
    const { updatedTaxMasterData } = action.payload;
    const updatedTaxMaster = yield call(
      axiosMain.post,
      `/admin/taxmaster/update`,
      updatedTaxMasterData
    );
    if (updatedTaxMaster.status == 200) {
      if (updatedTaxMaster.data.statusCode == 200) {
        CustomToast.success(updatedTaxMaster.data.message);
        yield put(updateTaxMasterActionSuccess(updatedTaxMaster));
        yield put(createEditTaxMasterApiStatus(true));
        yield put(searchTaxMasterAction(updatedTaxMasterData.searchData));
      } else {
        CustomToast.error(updatedTaxMaster.data.message);
        yield put(updateTaxMasterActionFail(updatedTaxMaster.data.message));
      }
    } else {
      yield put(
        updateTaxMasterActionFail(
          updatedTaxMaster.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(updateTaxMasterActionFail(error));
  }
}

//searching a TAXMASTER
function* searchTaxMasterSaga(action) {
  try {
    const searchTerm = action.payload;
    const searchResults = yield call(
      axiosMain.post,
      `/admin/taxmaster/search`,
      searchTerm
    );
    yield put(searchTaxMasterActionSuccess(searchResults.data));
  } catch (error) {
    yield put(searchTaxMasterActionFail(error));
  }
}

function* uploadDocumentTaxMaster(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/taxmaster/getalluploadeddocument"
    );

    yield put(uploadAllDocumentsTaxMasterSuccess(response.data));
  } catch (error) {
    yield put(uploadAllDocumentsTaxMasterFail(error.message));
  }
}

export function* TaxMastersSaga() {
  yield all([
    takeEvery(GET_ALL_TAXMASTER, fetchTaxMasterSaga),
    takeEvery(GET_ALL_TAXMASTER_WITH_STATUS, getAllTaxMasterWithStatusSaga),
    takeEvery(GET_TAXMASTER_BY_ID, getTaxMasterByIdSaga),
    takeEvery(CREATE_TAXMASTER, createTaxMasterSaga),
    takeEvery(UPDATE_TAXMASTER, updateTaxMasterSaga),
    takeEvery(SEARCH_TAXMASTER, searchTaxMasterSaga),
    takeEvery(UPLOAD_ALL_DOCUMENTS_TAXMASTER, uploadDocumentTaxMaster),
  ]);
}
