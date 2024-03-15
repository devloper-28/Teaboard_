import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_USER_RE,
  GET_ALL_USER_RE_WITH_STATUS,
  GET_USER_RE_BY_ID,
  CREATE_USER_RE,
  UPDATE_USER_RE,
  SEARCH_USER_RE,
  UPLOAD_ALL_DOCUMENTS_USER_RE,
  GET_ALL_CHILD_USER,
  UPDATE_CHILD_AUCTIONEER,
  CREATE_CHILD_AUCTIONEER,
  GET_CHILD_AUCTIONEER_BY_ID,
} from "../../actionLabels";
import  CustomToast  from "../../../components/Toast";
import {
  getUserByIdAction,
  fetchUser,
  fetchUserFail,
  fetchUserSuccess,
  getAllUserWithStatusActionSuccess,
  getAllUserWithStatusActionFail,
  getUserByIdActionSuccess,
  getUserByIdActionFail,
  createUserActionSuccess,
  createUserActionFail,
  updateUserActionSuccess,
  updateUserActionFail,
  searchUserActionSuccess,
  searchUserActionFail,
  searchUserAction,
  uploadAllDocumentsUserSuccess,
  uploadAllDocumentsUserFail,
  createEditApiUser,
  getChildUserSuccess,
  getChildUserFail,
  updateChildAucActionSuccess,
  createChildAucActionSuccess,
  createChildAucActionFail,
  updateChildAucActionFail,
  getChildAucByIdActionSuccess,
  getChildAucByIdActionFail,
} from "../../actions";

function* fetchUserSaga() {
  try {
    const response = yield call(axiosMain.post, `admin/getAllUser/search`, {
      roleCode: "AUCTIONEER",
    });
    yield put(fetchUserSuccess(response.data));
  } catch (error) {
    yield put(fetchUserFail(error));
  }
}

function* getAllUserWithStatusSaga(action) {
  try {
    const isActive = action.payload;
    const response = yield call(
      axiosMain.get,
      `admin/USER_REcountDetails/getAll/1/1/0`,
      isActive
    );
    yield put(getAllUserWithStatusActionSuccess(response.data));
  } catch (error) {
    yield put(getAllUserWithStatusActionFail(error.message));
  }
}

function* getUserByIdSaga(action) {
  try {
    const userId = action.payload;
    const UserData = yield call(
      axiosMain.get,
      `admin/auctioneer/getAuctioneerById/${userId}`
    );

    if (UserData.status == 200) {
      yield put(getUserByIdActionSuccess(UserData.data));
    } else {
      yield put(getUserByIdActionFail(UserData.data.message));
    }
  } catch (error) {
    yield put(getUserByIdActionFail(error));
  }
}

function* createUserSaga(action) {
  try {
    let newUserData = action.payload;
    const createdUser = yield call(
      axiosMain.post,
      `admin/auctioneer/create`,
      newUserData
    );
    if (createdUser.status == 200) {
      if (createdUser.data.statusCode == 200) {
        CustomToast.success(createdUser.data.message);
        yield put(createUserActionSuccess(createdUser));
        yield put(searchUserAction({}));
        yield put(fetchUser());
        yield put(createEditApiUser(true));
      } else {
        CustomToast.error(createdUser.data.message);
        yield put(createUserActionFail(createdUser.data.message));
      }
    } else {
      yield put(
        createUserActionFail(
          createdUser.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(createUserActionFail(error.message || "Unknown error occurred."));
  }
}

function* updateUserSaga(action) {
  try {
    const { updatedUserData } = action.payload;

    const updatedUser = yield call(
      axiosMain.post,
      `admin/auctioneer/update`,
      updatedUserData
    );
    if (updatedUser.status == 200) {
      if (updatedUser.data.statusCode == 200) {
        CustomToast.success(updatedUser.data.message);
        yield put(updateUserActionSuccess(updatedUser));
        yield put(searchUserAction(updatedUserData.searchData || {}));
        yield put(createEditApiUser(true));
      } else {
        CustomToast.error(updatedUser.data.message);
        yield put(updateUserActionFail(updatedUser.data.message));
      }
    } else {
      yield put(updateUserActionFail(updatedUser.message));
    }
  } catch (error) {
    yield put(updateUserActionFail(error.message));
  }
}

function* searchUserSaga(action) {
  try {
    const searchTerm = action.payload;
    const searchResults = yield call(
      axiosMain.post,
      `admin/getAllUser/search`,
      searchTerm
    );

    if (searchResults.status == 200) {
      yield put(searchUserActionSuccess(searchResults.data));
    } else {
      yield put(searchUserActionFail(searchResults));
    }
  } catch (error) {
    yield put(searchUserActionFail(error));
  }
}

function* uploadDocumentUser(action) {
  try {
    let role = action.payload;
    if(role.ischilddoc==undefined && role.ischilddoc !=1){
      const response = yield call(
        axiosMain.get,
        `admin/auctioneer/getalluploadeddocument/${role}`
      );
      yield put(uploadAllDocumentsUserSuccess(response.data));
    }else{
      const response = yield call(
        axiosMain.get,
        `admin/auctioneer/getallChilduploadeddocument/${role.role}`
      );
    yield put(uploadAllDocumentsUserSuccess(response.data));
    }
  } catch (error) {
    yield put(uploadAllDocumentsUserFail(error.message));
  }
}

function* getAllChildUserSaga(action) {
  try {
    const userId = action.payload;
    const response = yield call(
      axiosMain.get,
      `admin/buyer/getAlLChildUserList/${userId}`
    );
    yield put(getChildUserSuccess(response.data));
  } catch (error) {
    yield put(getChildUserFail(error));
  }
}

function* updateChildUserSaga(action) {
  try {
    const updatedUserData = action.payload;

    const updatedUser = yield call(
      axiosMain.post,
      `admin/auctioneer/chilAuctioneeUpdate`,
      updatedUserData
    );
    if (updatedUser.status == 200) {
      if (updatedUser.data.statusCode == 200) {
        CustomToast.success(updatedUser.data.message);
        yield put(updateChildAucActionSuccess(updatedUser));
        yield put(createEditApiUser(true));
      } else {
        CustomToast.error(updatedUser.data.message);
        yield put(updateChildAucActionFail(updatedUser.data.message));
      }
    } else {
      yield put(updateChildAucActionFail(updatedUser.message));
    }
  } catch (error) {
    yield put(updateUserActionFail(error.message));
  }
}

function* createChildAucSaga(action) {
  try {
    let newBuyerData = action.payload;
    const createdBuyer = yield call(
      axiosMain.post,
      `admin/auctioneer/chilAuctioneeCreate`,
      newBuyerData
    );
    if (createdBuyer.status == 200) {
      if (createdBuyer.data.statusCode == 200) {
        CustomToast.success(createdBuyer.data.message);
        yield put(createChildAucActionSuccess(createdBuyer));
        yield put(createEditApiUser(true));
      } else {
        CustomToast.error(createdBuyer.data.message);
        yield put(createChildAucActionFail(createdBuyer.data.message));
      }
    }
  } catch (error) {
    yield put(createChildAucActionFail(error));
  }
}

function* getchildAucByIdSaga(action) {
  try {
    const BuyerId = action.payload;
    const BuyerData = yield call(
      axiosMain.get,
      `admin/auctioneer/getchilAuctioneerById/${BuyerId}`
    );
    if (BuyerData.status == 200) {
      if (BuyerData.data.statusCode == 200) {
        yield put(getChildAucByIdActionSuccess(BuyerData.data));
        yield put(getUserByIdAction(BuyerData.data.responseData.isParentId));
      }
    }
  } catch (error) {
    yield put(getChildAucByIdActionFail(error));
  }
}

export function* UsersSaga() {
  yield all([
    takeEvery(GET_ALL_USER_RE, fetchUserSaga),
    takeEvery(GET_ALL_USER_RE_WITH_STATUS, getAllUserWithStatusSaga),
    takeEvery(GET_USER_RE_BY_ID, getUserByIdSaga),
    takeEvery(CREATE_USER_RE, createUserSaga),
    takeEvery(UPDATE_USER_RE, updateUserSaga),
    takeEvery(SEARCH_USER_RE, searchUserSaga),
    takeEvery(UPLOAD_ALL_DOCUMENTS_USER_RE, uploadDocumentUser),
    takeEvery(GET_ALL_CHILD_USER, getAllChildUserSaga),
    takeEvery(UPDATE_CHILD_AUCTIONEER,updateChildUserSaga),
    takeEvery(CREATE_CHILD_AUCTIONEER,createChildAucSaga),
    takeEvery(GET_CHILD_AUCTIONEER_BY_ID,getchildAucByIdSaga),
  ]);
}
