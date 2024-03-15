import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_RULE_ENGINE,
  GET_ALL_RULE_ENGINE_WITH_STATUS,
  GET_RULE_ENGINE_BY_ID,
  CREATE_RULE_ENGINE,
  UPDATE_RULE_ENGINE,
  SEARCH_RULE_ENGINE,
  UPLOAD_ALL_DOCUMENTS_RULE_ENGINE,
} from "../../actionLabels";
import CustomToast from "../../../components/Toast";
import {
  fetchRuleEngine,
  fetchRuleEngineFail,
  fetchRuleEngineSuccess,
  searchRuleEngineAction,
  getAllRuleEngineWithStatusActionSuccess,
  getAllRuleEngineWithStatusActionFail,
  getRuleEngineByIdActionSuccess,
  getRuleEngineByIdActionFail,
  createRuleEngineActionSuccess,
  createRuleEngineActionFail,
  updateRuleEngineActionSuccess,
  updateRuleEngineActionFail,
  searchRuleEngineActionSuccess,
  searchRuleEngineActionFail,
  createEditApiRuleEngine,
  uploadAllDocumentsRuleEngineSuccess,
  uploadAllDocumentsRuleEngineFail,
} from "../../actions";

function* fetchRuleEngineRggSaga() {
  try {
    const response = yield call(
      axiosMain.post,
      `admin/auctionCenter/search`,
      {}
    );
    yield put(fetchRuleEngineSuccess(response.data));
  } catch (error) {
    yield put(fetchRuleEngineFail(error));
  }
}

function* getAllRuleEngineRggWithStatusSaga(action) {
  try {
    const isActive = action.payload;
    const response = yield call(
      axiosMain.get,
      `/admin/RuleEngine/getAll/1/1/0`,
      isActive
    );
    yield put(getAllRuleEngineWithStatusActionSuccess(response.data));
  } catch (error) {
    yield put(getAllRuleEngineWithStatusActionFail(error.message));
  }
}

function* getRuleEngineRggByIdSaga(action) {
  try {
    const userId = action.payload;
    const UserData = yield call(
      axiosMain.get,
      `admin/ruleEngine/getByAuctionCenterId/${userId}`
    );

    if (UserData.status == 200) {
      yield put(getRuleEngineByIdActionSuccess(UserData.data));
    } else {
      yield put(getRuleEngineByIdActionFail(UserData.data.message));
    }
  } catch (error) {
    yield put(getRuleEngineByIdActionFail(error));
  }
}

function* createRuleEngineRggSaga(action) {
  try {
    let newUserData = action.payload;
    const createdUser = yield call(
      axiosMain.post,
      `admin/ruleEngine/create`,
      newUserData
    );
    if (createdUser.status == 200) {
      if (createdUser.data.statusCode == 200) {
        CustomToast.success(createdUser.data.message);
        yield put(createRuleEngineActionSuccess(createdUser));
        // yield put(searchRuleEngineAction({ userType: 63, isActive: "" }));
        yield put(createEditApiRuleEngine(true));
      } else {
        CustomToast.error(createdUser.data.message);
        yield put(createRuleEngineActionFail(createdUser.data.message));
      }
    } else {
      yield put(
        createRuleEngineActionFail(
          createdUser.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      createRuleEngineActionFail(error.message || "Unknown error occurred.")
    );
  }
}

function* updateRuleEngineRggSaga(action) {
  try {
    const { updatedUserData } = action.payload;

    const updatedUser = yield call(
      axiosMain.post,
      `admin/ruleEngine/update`,
      updatedUserData
    );
    if (updatedUser.status == 200) {
      if (updatedUser.data.statusCode == 200) {
        CustomToast.success(updatedUser.data.message);
        yield put(updateRuleEngineActionSuccess(updatedUser));
        yield put(searchRuleEngineAction(updatedUserData.searchData || {}));
        yield put(createEditApiRuleEngine(true));
      } else {
        CustomToast.error(updatedUser.data.message);
        yield put(updateRuleEngineActionFail(updatedUser.data.message));
      }
    } else {
      yield put(updateRuleEngineActionFail(updatedUser.message));
    }
  } catch (error) {
    yield put(updateRuleEngineActionFail(error.message));
  }
}

function* searchRuleEngineRggSaga(action) {
  try {
    const searchTerm = action.payload;
    const searchResults = yield call(
      axiosMain.get,
      `admin/ruleEngine/getAllRule`,
      searchTerm
    );

    if (searchResults.status == 200) {
      yield put(searchRuleEngineActionSuccess(searchResults.data));
    } else {
      yield put(searchRuleEngineActionFail(searchResults));
    }
  } catch (error) {
    yield put(searchRuleEngineActionFail(error));
  }
}

function* uploadDocumentRuleEngineRgg(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "admin/ruleEngine/getalluploadeddocument"
    );
    yield put(uploadAllDocumentsRuleEngineSuccess(response.data)); // Define uploadDocumentSuccess action creator
  } catch (error) {
    yield put(uploadAllDocumentsRuleEngineFail(error.message));
  }
}

export function* ruleEngineSagas() {
  yield all([
    takeEvery(GET_ALL_RULE_ENGINE, fetchRuleEngineRggSaga),
    takeEvery(
      GET_ALL_RULE_ENGINE_WITH_STATUS,
      getAllRuleEngineRggWithStatusSaga
    ),
    takeEvery(GET_RULE_ENGINE_BY_ID, getRuleEngineRggByIdSaga),
    takeEvery(CREATE_RULE_ENGINE, createRuleEngineRggSaga),
    takeEvery(UPDATE_RULE_ENGINE, updateRuleEngineRggSaga),
    takeEvery(SEARCH_RULE_ENGINE, searchRuleEngineRggSaga),
    takeEvery(UPLOAD_ALL_DOCUMENTS_RULE_ENGINE, uploadDocumentRuleEngineRgg),
  ]);
}
