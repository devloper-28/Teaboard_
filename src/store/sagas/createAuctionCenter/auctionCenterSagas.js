import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import * as actionTypes from "../../actionLabels";
import {
  getAllAuctionCenterAction,
  getAllAuctionCenterActionSuccess,
  getAllAuctionCenterActionFail,
  updateAuctionCenterActionSuccess,
  updateAuctionCenterActionFail,
  createAuctionCenterActionSuccess,
  createAuctionCenterActionFail,
  searchAuctionCenterActionSuccess,
  searchAuctionCenterActionFail,
  getAuctionCenterByIdActionSuccess,
  getAuctionCenterByIdActionFail,
  uploadAllDocumentsAuctionCenterSuccess,
  uploadAllDocumentsAuctionCenterFail,
  createEditAuctionCenterApiStatus,
  searchAuctionCenterAction,
  userWiseAuctionCenterDetailsSuccess,
  userWiseAuctionCenterDetailsFail,
  getAllAuctionCenterRegionActionSuccess,
  getAllAuctionCenterRegionActionFail,
  getAllAuctionCenterAscActionSuccess,
  getAllAuctionCenterAscActionFail,
  submitUnMappedAuctionCenterDetailsSuccess,
  submitUnMappedAuctionCenterDetailsFail,
  isSubmitUnMappedAuctionCenterDetailsSuccess,
  getServerDateAndTimeAction,
  getAllAuctionCenterAscAction,
  getAllAuctionRegionCenterAction,
  createAuctionCenterActionTypeSuccess,
  getServerDateAndTimeSuccess,
  createAuctionCenterActionTypeFail,
} from "../../actions";
import CustomToast from "../../../components/Toast";

function* getAllAuctionCenterSaga() {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/auctionCenter/search`,
      {}
    );
    if (response.status === 200) {
      yield put(getAllAuctionCenterActionSuccess(response.data));
    } else {
      yield put(getAllAuctionCenterActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllAuctionCenterActionFail(error));
  }
}

function* getAllAuctionCenterAscSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/auctionCenter/search`,
      action.payload
    );
    if (response.data.statusCode == 200) {
      yield put(getAllAuctionCenterAscActionSuccess(response.data));
    } else if (response.data.statusCode === 404) {
      yield put(
        getAllAuctionCenterAscActionSuccess(response.data.message.nodata)
      );
    }
  } catch (error) {
    yield put(getAllAuctionCenterAscActionFail(error));
  }
}
// CREATE AUCTION CENTER
function* createAuctionCenter(action) {
  try {
    const createdAuctionCenter = yield call(
      axiosMain.post,
      `/admin/auctionCenter/create`,
      action.payload
    );

    if (createdAuctionCenter.status == 200) {
      if (createdAuctionCenter.data.statusCode == 200) {
        CustomToast.success(createdAuctionCenter.data.message);
        yield put(createAuctionCenterActionSuccess(createdAuctionCenter));
        yield put(getAllAuctionCenterAction());
        yield put(searchAuctionCenterAction(action.payload.searchData));
        yield put(
          getAllAuctionCenterAscAction({
            sortBy: "asc",
            sortColumn: "auctionCenterName",
            sortColumn: "auctionCenterCode",
          })
        );
        yield put(getAllAuctionRegionCenterAction());
        yield put(createEditAuctionCenterApiStatus(true));
      } else {
        CustomToast.error(createdAuctionCenter.data.message);
        yield put(
          createAuctionCenterActionFail(createdAuctionCenter.data.message)
        );
      }
    } else {
      yield put(
        createAuctionCenterActionFail(
          createdAuctionCenter.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(createAuctionCenterActionFail(error));
  }
}

// UPDATE AUCTION CENTER
function* updateAuctionCenter(action) {
  try {
    const updatedAuctionCenter = yield call(
      axiosMain.post,
      `/admin/auctionCenter/update`,
      action.payload
    );
    if (updatedAuctionCenter.status == 200) {
      if (updatedAuctionCenter.data.statusCode == 200) {
        CustomToast.success(updatedAuctionCenter.data.message);
        yield put(updateAuctionCenterActionSuccess(updatedAuctionCenter));
        yield put(getAllAuctionCenterAction());
        yield put(searchAuctionCenterAction(action.payload.searchData));
        yield put(
          getAllAuctionCenterAscAction({
            sortBy: "asc",
            sortColumn: "auctionCenterName",
            sortColumn: "auctionCenterCode",
          })
        );
        yield put(getAllAuctionRegionCenterAction());
        yield put(createEditAuctionCenterApiStatus(true));
      } else {
        CustomToast.error(updatedAuctionCenter.data.message);
        yield put(
          updateAuctionCenterActionSuccess(updatedAuctionCenter.data.message)
        );
      }
    } else {
      yield put(updateAuctionCenterActionSuccess(updatedAuctionCenter.massage));
    }
  } catch (error) {
    yield put(updateAuctionCenterActionFail(error));
  }
}

// SEARCH AUCTION CENTER
function* searchAuctionCenter(action) {
  try {
    const searchResults = yield call(
      axiosMain.post,
      `/admin/auctionCenter/search`,
      action.payload
    );
    if (searchResults.status === 200) {
      yield put(searchAuctionCenterActionSuccess(searchResults.data));
    } else {
      yield put(searchAuctionCenterActionSuccess(searchResults.massage));
    }
  } catch (error) {
    yield put(searchAuctionCenterActionFail(error));
  }
}

// GET AUCTION CENTER BY ID
function* getAuctionCenterById(action) {
  try {
    const auctionCenter = yield call(
      axiosMain.get,
      `/admin/auctionCenter/get/${action.payload}`
    );
    if (auctionCenter.status == 200) {
      yield put(getAuctionCenterByIdActionSuccess(auctionCenter.data));
    } else {
      yield put(getAuctionCenterByIdActionSuccess(auctionCenter.massage));
    }
  } catch (error) {
    yield put(getAuctionCenterByIdActionFail(error));
  }
}

function* uploadDocumentAuctionCenter(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/auctionCenter/getalluploadeddocument"
    );

    // if (response.status === 200) {
    yield put(uploadAllDocumentsAuctionCenterSuccess(response.data)); // Define uploadDocumentSuccess action creator
    // You can also dispatch other actions if needed
    // } else {
    //   yield put(uploadAllDocumentsFail("Failed to upload document"));
    // }
  } catch (error) {
    yield put(uploadAllDocumentsAuctionCenterFail(error.message));
  }
}

function* userWiseAuctionCenterDetails(action) {
  try {
    const response = yield call(
      axiosMain.get,
      `/admin/auctionCenter/getAuctionCentersliveByUserId/${action.payload.userId}`
    );

    if (response.status === 200) {
      if (response.data.statusCode == 200) {
        yield put(userWiseAuctionCenterDetailsSuccess(response.data));
      } else {
        yield put(userWiseAuctionCenterDetailsFail(response.massage));
      }
    } else {
      yield put(userWiseAuctionCenterDetailsFail(response.massage));
    }
  } catch (error) {
    yield put(userWiseAuctionCenterDetailsFail(error));
  }
}

function* submitUnMappedAuctionCenterDetails(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/user/mappedAuctionCenter`,
      action.payload
    );

    if (response.status === 200) {
      if (response.data.statusCode == 200) {
        CustomToast.success(response.data.message);
        yield put(submitUnMappedAuctionCenterDetailsSuccess(response.data));
        yield put(isSubmitUnMappedAuctionCenterDetailsSuccess(true));
      } else {
        CustomToast.error(response.data.message);
        yield put(submitUnMappedAuctionCenterDetailsFail(response.massage));
      }
    } else {
      yield put(submitUnMappedAuctionCenterDetailsFail(response.massage));
    }
  } catch (error) {
    yield put(submitUnMappedAuctionCenterDetailsFail(error));
  }
}

function* getAllAuctionCenterRegion() {
  try {
    const response = yield call(
      axiosMain.get,
      `/admin/auctionCenter/getAllRegion`,
      {}
    );
    if (response.status === 200) {
      yield put(getAllAuctionCenterRegionActionSuccess(response.data));
    } else {
      yield put(getAllAuctionCenterRegionActionSuccess(response.massage));
    }
  } catch (error) {
    yield put(getAllAuctionCenterRegionActionFail(error));
  }
}

function* getServerDateAndTime() {
  try {
    const response = yield call(axiosMain.get, `/admin/getDatabaseServerTime`);
    if (response.status === 200) {
      yield put(getServerDateAndTimeSuccess(response.data));
    } else {
      yield put(getServerDateAndTimeSuccess(response.massage));
    }
  } catch (error) {
    yield put(getServerDateAndTimeSuccess([]));
  }
}
function* auctionCenterType() {
  try {
    const createdAuctionCenter = yield call(
      axiosMain.get,
      `/admin/auctionCenter/getAllAuctionType`
    );

    if (createdAuctionCenter.status == 200) {
      if (createdAuctionCenter.data.statusCode == 200) {
        yield put(createAuctionCenterActionTypeSuccess(createdAuctionCenter));
      } else {
        yield put(
          createAuctionCenterActionTypeFail(createdAuctionCenter.data.message)
        );
      }
    } else {
      yield put(
        createAuctionCenterActionTypeFail(
          createdAuctionCenter.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(createAuctionCenterActionTypeFail(error));
  }
}

export function* allAuctionCenterSaga() {
  yield all([
    yield takeEvery(
      actionTypes.GET_ALL_AUCTION_CENTER,
      getAllAuctionCenterSaga
    ),
    yield takeEvery(
      actionTypes.GET_ALL_AUCTION_REGION_CENTER,
      getAllAuctionCenterRegion
    ),
    yield takeEvery(
      actionTypes.GET_ALL_AUCTION_CENTER_ASC,
      getAllAuctionCenterAscSaga
    ),
    yield takeEvery(actionTypes.CREATE_AUCTION_CENTER_TYPE, auctionCenterType),
    yield takeEvery(actionTypes.CREATE_AUCTION_CENTER, createAuctionCenter),
    yield takeEvery(actionTypes.UPDATE_AUCTION_CENTER, updateAuctionCenter),
    yield takeEvery(actionTypes.SEARCH_AUCTION_CENTER, searchAuctionCenter),
    yield takeEvery(actionTypes.GET_AUCTION_CENTER_BY_ID, getAuctionCenterById),
    yield takeEvery(
      actionTypes.UPLOAD_ALL_DOCUMENTS_AUCTION_CENTER,
      uploadDocumentAuctionCenter
    ),
    yield takeEvery(
      actionTypes.USER_WISE_AUCTION_CENTER_DETAILS,
      userWiseAuctionCenterDetails
    ),
    yield takeEvery(
      actionTypes.SUBMIT_UNMAPPED_AUCTION_CENTER_DETAILS,
      submitUnMappedAuctionCenterDetails
    ),

    yield takeEvery(actionTypes.GET_SERVER_DATE_AND_TIME, getServerDateAndTime),
  ]);
}
