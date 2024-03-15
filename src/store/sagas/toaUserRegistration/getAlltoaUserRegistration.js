import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_TAO_USER,
  GET_ALL_TAO_USER_WITH_STATUS,
  GET_TAO_USER_BY_ID,
  CREATE_TAO_USER,
  UPDATE_TAO_USER,
  SEARCH_TAO_USER,
  UPLOAD_ALL_DOCUMENTS_TAO_USER,
} from "../../actionLabels";
import CustomToast from "../../../components/Toast";
import {
  fetchTaoUser,
  fetchTaoUserFail,
  fetchTaoUserSuccess,
  searchTaoUserAction,
  getAllTaoUserWithStatusActionSuccess,
  getAllTaoUserWithStatusActionFail,
  getTaoUserByIdActionSuccess,
  getTaoUserByIdActionFail,
  createTaoUserActionSuccess,
  createTaoUserActionFail,
  updateTaoUserActionSuccess,
  updateTaoUserActionFail,
  searchTaoUserActionSuccess,
  searchTaoUserActionFail,
  createEditApiTaoUser,
  uploadAllDocumentsTaoUserSuccess,
  uploadAllDocumentsTaoUserFail,
} from "../../actions";

function* fetchTaoUserRggSaga() {
  try {
    const response = yield call(axiosMain.post, `admin/getAllUser/search`, {
      roleCode: "TAOUSER",
    });
    yield put(fetchTaoUserSuccess(response.data));
  } catch (error) {
    yield put(fetchTaoUserFail(error));
  }
}

function* getAllTaoUserRggWithStatusSaga(action) {
  try {
    const isActive = action.payload;
    const response = yield call(
      axiosMain.get,
      `/admin/TAOUser/getAll/1/1/0`,
      isActive
    );
    yield put(getAllTaoUserWithStatusActionSuccess(response.data));
  } catch (error) {
    yield put(getAllTaoUserWithStatusActionFail(error.message));
  }
}

function* getTaoUserRggByIdSaga(action) {
  try {
    const userId = action.payload;
    const UserData = yield call(
      axiosMain.get,
      `admin/TAOUser/getTAOUserById/${userId}`
    );

    if (UserData.status == 200) {
      yield put(getTaoUserByIdActionSuccess(UserData.data));
    } else {
      yield put(getTaoUserByIdActionFail(UserData.data.message));
    }
  } catch (error) {
    yield put(getTaoUserByIdActionFail(error));
  }
}

function* createTaoUserRggSaga(action) {
  try {
    let newUserData = action.payload;
    const createdUser = yield call(
      axiosMain.post,
      `admin/TAOUser/create`,
      newUserData
    );
    if (createdUser.status == 200) {
      if (createdUser.data.statusCode == 200) {
        CustomToast.success(createdUser.data.message);
        yield put(createTaoUserActionSuccess(createdUser));
        yield put(searchTaoUserAction({ roleCode: "TAOUSER", isActive: "" }));
        yield put(createEditApiTaoUser(true));
      } else {
        CustomToast.error(createdUser.data.message);
        yield put(createTaoUserActionFail(createdUser.data.message));
      }
    } else {
      yield put(
        createTaoUserActionFail(
          createdUser.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      createTaoUserActionFail(error.message || "Unknown error occurred.")
    );
  }
}

function* updateTaoUserRggSaga(action) {
  try {
    const { updatedUserData } = action.payload;

    const updatedUser = yield call(
      axiosMain.post,
      `admin/TAOUser/update`,
      updatedUserData
    );
    if (updatedUser.status == 200) {
      if (updatedUser.data.statusCode == 200) {
        CustomToast.success(updatedUser.data.message);
        yield put(updateTaoUserActionSuccess(updatedUser));
        yield put(
          searchTaoUserAction(
            updatedUserData.searchData || { roleCode: "TAOUSER", isActive: "" }
          )
        );
        yield put(createEditApiTaoUser(true));
      } else {
        CustomToast.error(updatedUser.data.message);
        yield put(updateTaoUserActionFail(updatedUser.data.message));
      }
    } else {
      yield put(updateTaoUserActionFail(updatedUser.message));
    }
  } catch (error) {
    yield put(updateTaoUserActionFail(error.message));
  }
}

function* searchTaoUserRggSaga(action) {
  try {
    const searchTerm = action.payload;
    const searchResults = yield call(
      axiosMain.post,
      `admin/getAllUser/search`,
      searchTerm
    );

    if (searchResults.status == 200) {
      yield put(searchTaoUserActionSuccess(searchResults.data));
    } else {
      yield put(searchTaoUserActionFail(searchResults));
    }
  } catch (error) {
    yield put(searchTaoUserActionFail(error));
  }
}

function* uploadDocumentTaoUserRgg(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "admin/TAOUser/getalluploadeddocument"
    );
    yield put(uploadAllDocumentsTaoUserSuccess(response.data)); // Define uploadDocumentSuccess action creator
  } catch (error) {
    yield put(uploadAllDocumentsTaoUserFail(error.message));
  }
}

export function* TaoUserSaga() {
  yield all([
    takeEvery(GET_ALL_TAO_USER, fetchTaoUserRggSaga),
    takeEvery(GET_ALL_TAO_USER_WITH_STATUS, getAllTaoUserRggWithStatusSaga),
    takeEvery(GET_TAO_USER_BY_ID, getTaoUserRggByIdSaga),
    takeEvery(CREATE_TAO_USER, createTaoUserRggSaga),
    takeEvery(UPDATE_TAO_USER, updateTaoUserRggSaga),
    takeEvery(SEARCH_TAO_USER, searchTaoUserRggSaga),
    takeEvery(UPLOAD_ALL_DOCUMENTS_TAO_USER, uploadDocumentTaoUserRgg),
  ]);
}
