import { all, call, put, takeEvery } from "redux-saga/effects";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_RULE_ENGINE_ENG,
  GET_ALL_RULE_ENGINE_ENG_WITH_STATUS,
  GET_RULE_ENGINE_ENG_BY_ID,
  CREATE_RULE_ENGINE_ENG,
  UPDATE_RULE_ENGINE_ENG,
  SEARCH_RULE_ENGINE_ENG,
  UPLOAD_ALL_DOCUMENTS_RULE_ENGINE_ENG,
  GET_ALL_RULE_ENGINE_BRT,
} from "../../actionLabels";
import CustomToast from "../../../components/Toast";
import {
  fetchRuleEngineEngEng,
  fetchRuleEngineBrtSuccess,
  fetchRuleEngineBrtFail,
  fetchRuleEngineEngFail,
  fetchRuleEngineEngSuccess,
  searchRuleEngineEngAction,
  getAllRuleEngineEngWithStatusActionSuccess,
  getAllRuleEngineEngWithStatusActionFail,
  getRuleEngineEngByIdActionSuccess,
  getRuleEngineEngByIdActionFail,
  createRuleEngineEngActionSuccess,
  createRuleEngineEngActionFail,
  updateRuleEngineEngActionSuccess,
  updateRuleEngineEngActionFail,
  searchRuleEngineEngActionSuccess,
  searchRuleEngineEngActionFail,
  createEditApiRuleEngineEng,
  uploadAllDocumentsRuleEngineEngSuccess,
  uploadAllDocumentsRuleEngineEngFail,
} from "../../actions";

function* fetchRuleEngineEngRggSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `admin/auctionCenter/search`,
      action.payload
    );
    yield put(fetchRuleEngineEngSuccess(response.data));
  } catch (error) {
    yield put(fetchRuleEngineEngFail(error));
  }
}

function* fetchRuleEngineBrtRggSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `admin/auctionCenter/search`,
      action.payload
    );
    yield put(fetchRuleEngineBrtSuccess(response.data));
  } catch (error) {
    yield put(fetchRuleEngineBrtFail(error));
  }
}

function* getAllRuleEngineEngRggWithStatusSaga(action) {
  try {
    const isActive = action.payload;
    const response = yield call(
      axiosMain.get,
      `/admin/RuleEngine/getAll/1/1/0`,
      isActive
    );
    yield put(getAllRuleEngineEngWithStatusActionSuccess(response.data));
  } catch (error) {
    yield put(getAllRuleEngineEngWithStatusActionFail(error.message));
  }
}

function* getRuleEngineEngRggByIdSaga(action) {
  try {
    const userId = action.payload;
    const UserData = yield call(
      axiosMain.get,
      `admin/ruleEngine/getByAuctionCenterId/${userId}`
    );

    if (UserData.status == 200) {
      yield put(getRuleEngineEngByIdActionSuccess(UserData.data));
    } else {
      yield put(getRuleEngineEngByIdActionFail(UserData.data.message));
    }
  } catch (error) {
    yield put(getRuleEngineEngByIdActionFail(error));
  }
}

function* createRuleEngineEngRggSaga(action) {
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
        yield put(createRuleEngineEngActionSuccess(createdUser));
        // yield put(searchRuleEngineEngAction({ userType: 63, isActive: "" }));
        yield put(createEditApiRuleEngineEng(true));
      } else {
        CustomToast.error(createdUser.data.message);
        yield put(createRuleEngineEngActionFail(createdUser.data.message));
      }
    } else {
      yield put(
        createRuleEngineEngActionFail(
          createdUser.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      createRuleEngineEngActionFail(error.message || "Unknown error occurred.")
    );
  }
}

function* updateRuleEngineEngRggSaga(action) {
  try {
    const { updatedUserData } = action.payload;

    const updatedUser = yield call(
      axiosMain.post,
      `admin/ruleEngine/updateRuleEngAuc`,
      updatedUserData
    );
    if (updatedUser.status == 200) {
      if (updatedUser.data.statusCode == 200) {
        CustomToast.success(updatedUser.data.message);
        yield put(updateRuleEngineEngActionSuccess(updatedUser));
        yield put(searchRuleEngineEngAction(updatedUserData.searchData || {}));
        yield put(createEditApiRuleEngineEng(true));
      } else {
        CustomToast.error(updatedUser.data.message);
        yield put(updateRuleEngineEngActionFail(updatedUser.data.message));
      }
    } else {
      yield put(updateRuleEngineEngActionFail(updatedUser.message));
    }
  } catch (error) {
    yield put(updateRuleEngineEngActionFail(error.message));
  }
}

function* searchRuleEngineEngRggSaga(action) {
  try {
    const searchTerm = action.payload;
    const searchResults = yield call(
      axiosMain.get,
      `admin/ruleEngine/getAllRule`,
      searchTerm
    );

    if (searchResults.status == 200) {
      yield put(searchRuleEngineEngActionSuccess(searchResults.data));
    } else {
      yield put(searchRuleEngineEngActionFail(searchResults));
    }
  } catch (error) {
    yield put(searchRuleEngineEngActionFail(error));
  }
}

function* uploadDocumentRuleEngineEngRgg(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "admin/ruleEngine/getalluploadeddocument"
    );
    yield put(uploadAllDocumentsRuleEngineEngSuccess(response.data)); // Define uploadDocumentSuccess action creator
  } catch (error) {
    yield put(uploadAllDocumentsRuleEngineEngFail(error.message));
  }
}

export function* ruleEngineEngSagas() {
  yield all([
    takeEvery(GET_ALL_RULE_ENGINE_ENG, fetchRuleEngineEngRggSaga),
    takeEvery(GET_ALL_RULE_ENGINE_BRT, fetchRuleEngineBrtRggSaga),
    takeEvery(
      GET_ALL_RULE_ENGINE_ENG_WITH_STATUS,
      getAllRuleEngineEngRggWithStatusSaga
    ),
    takeEvery(GET_RULE_ENGINE_ENG_BY_ID, getRuleEngineEngRggByIdSaga),
    takeEvery(CREATE_RULE_ENGINE_ENG, createRuleEngineEngRggSaga),
    takeEvery(UPDATE_RULE_ENGINE_ENG, updateRuleEngineEngRggSaga),
    takeEvery(SEARCH_RULE_ENGINE_ENG, searchRuleEngineEngRggSaga),
    takeEvery(
      UPLOAD_ALL_DOCUMENTS_RULE_ENGINE_ENG,
      uploadDocumentRuleEngineEngRgg
    ),
  ]);
}
