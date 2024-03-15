import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_ROLES,
  CREATE_ROLE,
  UPDATE_ROLE,
  SEARCH_ROLE,
  GET_ROLE_BY_ID,
  UPLOAD_ALL_DOCUMENTS_ROLE,
  GET_ALL_ROLES_ASC,
  FETCH_USER_DETAILS_REQUEST,
  FETCH_ROLE_LIST_REQUEST,
  FETCH_RIGHTS_REQUEST,
  SAVE_RIGHTS_REQUEST,
  FETCH_SAVE_RIGHTS_BY_AUCTION_CENTER_ID_AND_USER_ID,
} from "../../actionLabels";
import {
  getAllRolesAsc,
  getAllRolesSuccess,
  getAllRolesFail,
  createRoleSuccess,
  createRoleFail,
  updateRoleSuccess,
  updateRoleFail,
  searchRoleSuccess,
  searchRoleFail,
  getRoleByIdSuccess,
  getRoleByIdFail,
  uploadAllDocumentsRoleSuccess,
  uploadAllDocumentsRoleFail,
  searchRole,
  createEditRoleApiStatus,
  getAllRolesAscSuccess,
  getAllRolesAscFail,
  fetchUserDetailsSuccess,
  fetchUserDetailsFailure,
  fetchRoleListSuccess,
  fetchRoleListFailure,
  fetchRightsSuccess,
  fetchRightsFailure,
  saveRightsFailure,
  saveRightsSuccess,
  createEditRightsApiStatus,
  getRoleApiStatus,
} from "../../actions";
import CustomToast from "../../../components/Toast";

// Worker function for getting all roles
function* getAllRolesSaga() {
  try {
    const response = yield call(axiosMain.post, `/admin/role/search`, {});
    yield put(getAllRolesSuccess(response.data));
  } catch (error) {
    yield put(getAllRolesFail(error));
  }
}

function* getAllRolesAscSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/role/search`,
      action.payload
    );
    yield put(getAllRolesAscSuccess(response.data));
  } catch (error) {
    yield put(getAllRolesAscFail(error));
  }
}
// Worker function for creating a new role
function* createRoleSaga(action) {
  try {
    const { roleData } = action.payload;

    const response = yield call(axiosMain.post, `/admin/role/create`, roleData);
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(createRoleSuccess());
        yield put(getAllRolesAsc(roleData.searchasd));
        yield put(searchRole(roleData.searchData));
        yield put(createEditRoleApiStatus(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(createRoleFail(response.data.message));
      }
    } else {
      yield put(
        createRoleFail(response.data.message || "Unknown error occurred.")
      );
    }
  } catch (error) {
    yield put(createRoleFail(error));
  }
}
// Worker function for updating a role
function* updateRoleSaga(action) {
  try {
    const { updatedData } = action.payload;
    const response = yield call(
      axiosMain.post,
      `/admin/role/update`,
      updatedData
    );

    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(updateRoleSuccess(response));
        yield put(searchRole(action.payload.updatedData.searchData));
        yield put(createEditRoleApiStatus(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(updateRoleFail(response.data.message));
      }
    } else {
      yield put(
        updateRoleFail(response.data.message || "Unknown error occurred.")
      );
    }
  } catch (error) {
    yield put(updateRoleFail(error));
  }
}

// Worker function for searching roles based on criteria

function* searchRoleSaga(action) {
  try {
    const { searchCriteria } = action.payload;
    const response = yield call(
      axiosMain.post,
      `/admin/role/search`,
      searchCriteria
    );
    yield put(searchRoleSuccess(response.data));
  } catch (error) {
    yield put(searchRoleFail(error));
  }
}

// Worker function for getting a role by ID
function* getRoleByIdSaga(action) {
  try {
    const { roleId } = action.payload;
    const response = yield call(axiosMain.get, `/admin/role/get/${roleId}`);
    yield put(getRoleByIdSuccess(response.data));
  } catch (error) {
    yield put(getRoleByIdFail(error));
  }
}
function* uploadDocumentRole(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/role/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsRoleSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsRoleFail(error.message));
  }
}
// Manage Roles
function* fetchUserDetails(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/user/dropdown/getUserDetail`,
      action.payload
      // `/admin/user/dropdown/getUserDetail/${roleCode}/${auctionCenterId}`
    );

    yield put(fetchUserDetailsSuccess(response.data.responseData));
  } catch (error) {
    yield put(fetchUserDetailsFailure(error.message));
  }
}

const staticRoleListParams = {
  sortBy: "asc",
  sortColumn: "roleName",
  isActive: 1,
};
function* fetchRoleList() {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/role/search",
      staticRoleListParams
    );

    yield put(fetchRoleListSuccess(response.data.responseData));
  } catch (error) {
    yield put(fetchRoleListFailure(error.message));
  }
}

function* fetchRightsData() {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/userRights/getRightsModuleWise"
    );

    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        yield put(fetchRightsSuccess(response.data));
        yield put(getRoleApiStatus(true));
      } else {
        yield put(fetchRightsFailure(response.data));
      }
    } else {
      yield put(
        fetchRightsFailure(response.data.message || "Unknown error occurred.")
      );
    }
  } catch (error) {
    yield put(fetchRightsFailure(error.message));
  }
}

function* saveRightsSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/userRights/saveRights",
      action.payload
    );
    if (response.data.statusCode === 200) {
      CustomToast.success(response.data.message);
      yield put(saveRightsSuccess(response.data));
      yield put(createEditRightsApiStatus(true));
    }
    // Dispatch success action with the actual response
  } catch (error) {
    // Dispatch failure action with the error message
    yield put(saveRightsFailure(error.message));
  }
}

function* fetchSaveRightsByAuctionCenterIdAndUserIdData(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/userRights/viewRights",
      action.payload
    );

    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        yield put(fetchRightsSuccess(response.data));
        yield put(getRoleApiStatus(true));
      } else {
        yield put(fetchRightsFailure(response.data));
      }
    } else {
      yield put(
        fetchRightsFailure(response.data.message || "Unknown error occurred.")
      );
    }
  } catch (error) {
    yield put(fetchRightsFailure(error.message));
  }
}

export function* roleSaga() {
  yield all([
    yield takeEvery(GET_ALL_ROLES_ASC, getAllRolesAscSaga),
    yield takeEvery(GET_ALL_ROLES, getAllRolesSaga),
    yield takeEvery(CREATE_ROLE, createRoleSaga),
    yield takeEvery(UPDATE_ROLE, updateRoleSaga),
    yield takeEvery(SEARCH_ROLE, searchRoleSaga),
    yield takeEvery(GET_ROLE_BY_ID, getRoleByIdSaga),
    yield takeEvery(UPLOAD_ALL_DOCUMENTS_ROLE, uploadDocumentRole),
    yield takeEvery(FETCH_USER_DETAILS_REQUEST, fetchUserDetails),
    yield takeEvery(FETCH_ROLE_LIST_REQUEST, fetchRoleList),
    yield takeEvery(FETCH_RIGHTS_REQUEST, fetchRightsData),
    yield takeEvery(
      FETCH_SAVE_RIGHTS_BY_AUCTION_CENTER_ID_AND_USER_ID,
      fetchSaveRightsByAuctionCenterIdAndUserIdData
    ),
    yield takeEvery(SAVE_RIGHTS_REQUEST, saveRightsSaga),
  ]);
}
