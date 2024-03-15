import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_USER,
  GET_ALL_USER_WITH_STATUS,
  GET_USER_BY_ID,
  CREATE_USER,
  UPDATE_USER,
  SEARCH_USER,
  UPLOAD_ALL_DOCUMENTS_USER,
} from "../../actionLabels";
import CustomToast from "../../../components/Toast";
import {
  fetchUserRgg,
  fetchUserRggFail,
  fetchUserRggSuccess,
  searchUserRggAction,
  getAllUserRggWithStatusActionSuccess,
  getAllUserRggWithStatusActionFail,
  getUserRggByIdActionSuccess,
  getUserRggByIdActionFail,
  createUserRggActionSuccess,
  createUserRggActionFail,
  updateUserRggActionSuccess,
  updateUserRggActionFail,
  searchUserRggActionSuccess,
  searchUserRggActionFail,
  createEditApiUserRgg,
  uploadAllDocumentsUserRggSuccess,
  uploadAllDocumentsUserRggFail,
} from "../../actions";

function* fetchUserRggSaga() {
  try {
    const response = yield call(axiosMain.post, `admin/getAllUser/search`, {
      roleCode: "TAOUSER",
    });
    yield put(fetchUserRggSuccess(response.data));
  } catch (error) {
    yield put(fetchUserRggFail(error));
  }
}

function* getAllUserRggWithStatusSaga(action) {
  try {
    const isActive = action.payload;
    const response = yield call(
      axiosMain.get,
      `/admin/teaboarduser/getAll/1/1/0`,
      isActive
    );
    yield put(getAllUserRggWithStatusActionSuccess(response.data));
  } catch (error) {
    yield put(getAllUserRggWithStatusActionFail(error.message));
  }
}

function* getUserRggByIdSaga(action) {
  try {
    const userId = action.payload;
    const UserData = yield call(
      axiosMain.get,
      `admin/teaboarduser/getteaboarduserbyid/${userId}`
    );

    if (UserData.status == 200) {
      yield put(getUserRggByIdActionSuccess(UserData.data));
    } else {
      yield put(getUserRggByIdActionFail(UserData.data.message));
    }
  } catch (error) {
    yield put(getUserRggByIdActionFail(error));
  }
}

function* createUserRggSaga(action) {
  try {
    let newUserData = action.payload;
    const createdUser = yield call(
      axiosMain.post,
      `admin/teaboarduser/create`,
      newUserData
    );
    if (createdUser.status == 200) {
      if (createdUser.data.statusCode == 200) {
        CustomToast.success(createdUser.data.message);
        yield put(createUserRggActionSuccess(createdUser));
        yield put(
          searchUserRggAction({ roleCode: "TEABOARDUSER", isActive: "" })
        );
        // yield put(fetchUserRgg());
        yield put(createEditApiUserRgg(true));
      } else {
        CustomToast.error(createdUser.data.message);
        yield put(createUserRggActionFail(createdUser.data.message));
      }
    } else {
      yield put(
        createUserRggActionFail(
          createdUser.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      createUserRggActionFail(error.message || "Unknown error occurred.")
    );
  }
}

function* updateUserRggSaga(action) {
  try {
    const { updatedUserData } = action.payload;

    const updatedUser = yield call(
      axiosMain.post,
      `admin/teaboarduser/update`,
      updatedUserData
    );
    if (updatedUser.status == 200) {
      if (updatedUser.data.statusCode == 200) {
        CustomToast.success(updatedUser.data.message);
        yield put(updateUserRggActionSuccess(updatedUser));
        yield put(
          searchUserRggAction(
            updatedUserData.searchData || {
              roleCode: "TEABOARDUSER",
              isActive: "",
            }
          )
        );
        yield put(createEditApiUserRgg(true));
      } else {
        CustomToast.error(updatedUser.data.message);
        yield put(updateUserRggActionFail(updatedUser.data.message));
      }
    } else {
      yield put(updateUserRggActionFail(updatedUser.message));
    }
  } catch (error) {
    yield put(updateUserRggActionFail(error.message));
  }
}

function* searchUserRggSaga(action) {
  try {
    const searchTerm = action.payload;
    const searchResults = yield call(
      axiosMain.post,
      `admin/getAllUser/search`,
      searchTerm
    );

    if (searchResults.status == 200) {
      yield put(searchUserRggActionSuccess(searchResults.data));
    } else {
      yield put(searchUserRggActionFail(searchResults));
    }
  } catch (error) {
    yield put(searchUserRggActionFail(error));
  }
}

function* uploadDocumentUserRgg(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "admin/teaboarduser/getalluploadeddocument"
    );
    yield put(uploadAllDocumentsUserRggSuccess(response.data)); // Define uploadDocumentSuccess action creator
  } catch (error) {
    yield put(uploadAllDocumentsUserRggFail(error.message));
  }
}

export function* UserSaga() {
  yield all([
    takeEvery(GET_ALL_USER, fetchUserRggSaga),
    takeEvery(GET_ALL_USER_WITH_STATUS, getAllUserRggWithStatusSaga),
    takeEvery(GET_USER_BY_ID, getUserRggByIdSaga),
    takeEvery(CREATE_USER, createUserRggSaga),
    takeEvery(UPDATE_USER, updateUserRggSaga),
    takeEvery(SEARCH_USER, searchUserRggSaga),
    takeEvery(UPLOAD_ALL_DOCUMENTS_USER, uploadDocumentUserRgg),
  ]);
}
