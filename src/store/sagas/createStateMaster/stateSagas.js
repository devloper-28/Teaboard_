import { all, call, put, takeEvery } from "redux-saga/effects";

import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_STATE,
  GET_STATE_BY_ID,
  CREATE_STATE,
  UPDATE_STATE,
  SEARCH_STATE,
  UPLOAD_ALL_DOCUMENTS_STATE,
  GET_ALL_STATE_ASC,
} from "../../actionLabels";
import {
  getAllStateActionFail,
  getAllStateActionSuccess,
  getStateByIdActionSuccess,
  getStateByIdActionFail,
  createStateActionSuccess,
  createStateActionFail,
  updateStateActionSuccess,
  updateStateActionFail,
  searchStateActionSuccess,
  searchStateActionFail,
  searchStateAction,
  uploadAllDocumentsStateSuccess,
  uploadAllDocumentsStateFail,
  createEditApiStatus,
  getAllStateAction,
  getAllStateAscActionSuccess,
  getAllStateAscActionFail,
} from "../../actions";
import CustomToast from "../../../components/Toast";

function* getAllStateSaga() {
  try {
    const response = yield call(axiosMain.post, "/admin/state/search", {});
    if (response.status == 200) {
      yield put(getAllStateActionSuccess(response.data));
    } else {
      yield put(getAllStateActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllStateActionFail(error));
  }
}

function* getAllStateAscSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/state/search",
      action.payload
    );
    if (response.status == 200) {
      yield put(getAllStateAscActionSuccess(response.data));
    } else {
      yield put(getAllStateAscActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllStateAscActionFail(error));
  }
}

//Fetch state by ID
function* getStateByIdSaga(action) {
  try {
    const stateId = action.payload;
    const stateData = yield call(axiosMain.get, `/admin/state/get/${stateId}`);

    if (stateData.status == 200) {
      yield put(getStateByIdActionSuccess(stateData.data));
    } else {
      CustomToast.error(stateData.message);
      yield put(getStateByIdActionFail(stateData.message));
    }
  } catch (error) {
    yield put(getStateByIdActionFail(error));
  }
}

//creating a new state
function* createStateSaga(action) {
  try {
    let newStateData = action.payload;
    const createdState = yield call(
      axiosMain.post,
      `/admin/state/create`,
      newStateData
    );
    if (createdState.status == 200) {
      if (createdState.data.statusCode == 200) {
        CustomToast.success(createdState.data.message);
        yield put(createStateActionSuccess(createdState));
        yield put(searchStateAction(newStateData.searchData));
        yield put(getAllStateAction());
        yield put(createEditApiStatus(true));
      } else {
        CustomToast.error(createdState.data.message);
        yield put(createStateActionFail(createdState.data.message));
      }
    } else {
      yield put(
        createStateActionFail(
          createdState.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      createStateActionFail(error.message || "Unknown error occurred.")
    );
  }
}

//updating a state
function* updateStateSaga(action) {
  try {
    const { updatedStateData } = action.payload;

    const updatedState = yield call(
      axiosMain.post,
      `/admin/state/update`,
      updatedStateData
    );
    if (updatedState.status == 200) {
      if (updatedState.data.statusCode == 200) {
        CustomToast.success(updatedState.data.message);
        yield put(updateStateActionSuccess(updatedState));
        yield put(searchStateAction(updatedStateData.searchData || {}));
        yield put(createEditApiStatus(true));
      } else {
        CustomToast.error(updatedState.data.message);
        yield put(updateStateActionFail(updatedState.data.message));
      }
    } else {
      yield put(updateStateActionFail(updatedState.message));
    }
  } catch (error) {
    yield put(updateStateActionFail(error.message));
  }
}

//searching a state
function* searchStateSaga(action) {
  try {
    const searchTerm = action.payload;
    const searchResults = yield call(
      axiosMain.post,
      `/admin/state/search`,
      searchTerm
    );

    if (searchResults.status == 200) {
      yield put(searchStateActionSuccess(searchResults.data));
    } else {
      CustomToast.error(searchResults.message);
      yield put(searchStateActionFail(searchResults));
    }
  } catch (error) {
    yield put(searchStateActionFail(error));
  }
}

function* uploadDocumentState(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/state/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsStateSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsStateFail(error.message));
  }
}

export function* stateSaga() {
  yield all([
    takeEvery(GET_ALL_STATE, getAllStateSaga),
    takeEvery(GET_ALL_STATE_ASC, getAllStateAscSaga),
    takeEvery(GET_STATE_BY_ID, getStateByIdSaga),
    takeEvery(CREATE_STATE, createStateSaga),
    takeEvery(UPDATE_STATE, updateStateSaga),
    takeEvery(SEARCH_STATE, searchStateSaga),
    takeEvery(UPLOAD_ALL_DOCUMENTS_STATE, uploadDocumentState),
  ]);
}
