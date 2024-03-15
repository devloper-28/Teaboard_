import { all, call, put, takeEvery } from "redux-saga/effects";
import * as allActions from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import {
  GET_ALL_CONFIGURE_PARAMETER,
  UPDATE_CONFIGURE_PARAMETER,
  CREATE_CONFIGURE_PARAMETER,
  GET_CONFIGURE_PARAMETER_BY_ID,
  UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM,
  FETCH_PRICE_RANGE_REQUEST,
  CREATE_AUCTION_REQUEST,
  FETCH_AUCTION_DATA_REQUEST,
  FETCH_AUCTION_DATA_OPTION_REQUEST,
} from "../../actionLabels";
import CustomToast from "../../../components/Toast";

function* getAllConfigParamSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/ConfigureParameter/search",
      action.payload
    );
    yield put(allActions.getConfigParamSuccess(response.data));
  } catch (error) {
    yield put(allActions.getConfigParamFail(error));
  }
}
function* updatedConfigParamSaga(action) {
  try {
    const { updatedConfigParamData } = action.payload;
    const updatedConfigParam = yield call(
      axiosMain.post,
      `/admin/ConfigureParameter/update`,
      updatedConfigParamData
    );
    if (updatedConfigParam.status == 200) {
      if (updatedConfigParam.data.statusCode == 200) {
        CustomToast.success(updatedConfigParam.data.message);
        yield put(
          allActions.updateConfigParamActionSuccess(updatedConfigParam)
        );
        yield put(allActions.getConfigParam(updatedConfigParamData.searchData));
        yield put(allActions.createEditConfigureParameterApiStatus(true));
      } else {
        CustomToast.error(updatedConfigParam.data.message);
        yield put(
          allActions.updateConfigParamActionFail(
            updatedConfigParam.data.message
          )
        );
      }
    } else {
      yield put(allActions.updateConfigParamActionFail(updatedConfigParam));
    }
  } catch (error) {
    yield put(allActions.updateConfigParamActionFail(error));
  }
}
function* createConfigParamSaga(action) {
  try {
    const newConfigParamData = action.payload;
    const createdConfigParam = yield call(
      axiosMain.post,
      `/admin/ConfigureParameter/create`,
      newConfigParamData
    );

    if (createdConfigParam.data.statusCode == 200) {
      CustomToast.success(createdConfigParam.data.message);
      yield put(allActions.createConfigParamActionSuccess(createdConfigParam));
      yield put(allActions.getConfigParam(newConfigParamData.searchData));
      yield put(allActions.createEditConfigureParameterApiStatus(true));
    } else {
      CustomToast.error(createdConfigParam.data.message);
      yield put(
        allActions.createConfigParamActionFail(createdConfigParam.data.message)
      );
    }
  } catch (error) {
    yield put(allActions.createConfigParamActionFail(error));
  }
}
function* getConfigParamByIdSaga(action) {
  try {
    const ConfigParamId = action.payload;
    const ConfigParamData = yield call(
      axiosMain.get,
      `/admin/ConfigureParameter/get/${ConfigParamId}`
    );
    yield put(allActions.getConfigParamByIdActionSuccess(ConfigParamData.data));
  } catch (error) {
    yield put(allActions.getConfigParamByIdActionFail(error));
  }
}
function* uploadDocumentConfigParam(action) {
  try {
    const response = yield call(
      axiosMain.get,
      "/admin/ConfigureParameter/getalluploadeddocument"
    );
    yield put(allActions.uploadAllDocumentsConfigParamSuccess(response.data));
  } catch (error) {
    yield put(allActions.uploadAllDocumentsConfigParamFail(error.message));
  }
}
// english auction
const fetchPriceRangeAPI = async () => {
  try {
    const response = await axiosMain.get(
      "/admin/ConfigureParameter/getAllPriceRange"
    );
    return response.data.responseData; // Adjust the path based on your API response structure
  } catch (error) {
    throw error;
  }
};

function* fetchPriceRange() {
  try {
    const data = yield call(fetchPriceRangeAPI);
    yield put(allActions.fetchPriceRangeSuccess(data));
  } catch (error) {
    yield put(allActions.fetchPriceRangeFailure(error.message));
  }
}
const createAuctionApi = (data) => {
  return axiosMain.post(`admin/ConfigureParameter/englishAuctioncreate`, data);
};
function* fetchAuctionDataOption(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/ConfigureParameter/englishauctionsearch",
      action.payload
    );
    yield put(
      allActions.fetchAuctionDataOptionSuccess(response.data.responseData)
    );
  } catch (error) {
    yield put(allActions.fetchAuctionDataOptionFailure(error));
  }
}
function* fetchAuctionData(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "/admin/ConfigureParameter/englishauctionsearch",
      action.payload
    );
    yield put(allActions.fetchAuctionDataSuccess(response.data.responseData));
  } catch (error) {
    yield put(allActions.fetchAuctionDataFailure(error));
  }
}
function* createAuction(action) {
  try {
    // Make API call with the provided data using Axios
    yield call(createAuctionApi, action.payload);

    yield put(allActions.createAuctionSuccess());
  } catch (error) {
    yield put(allActions.createAuctionFailure(error));
  }
}
export function* configParamSagas() {
  yield all([
    yield takeEvery(GET_ALL_CONFIGURE_PARAMETER, getAllConfigParamSaga),
    yield takeEvery(UPDATE_CONFIGURE_PARAMETER, updatedConfigParamSaga),
    yield takeEvery(CREATE_CONFIGURE_PARAMETER, createConfigParamSaga),
    yield takeEvery(GET_CONFIGURE_PARAMETER_BY_ID, getConfigParamByIdSaga),
    yield takeEvery(
      UPLOAD_ALL_DOCUMENTS_CONFIG_PARAM,
      uploadDocumentConfigParam
    ),
    yield takeEvery(FETCH_PRICE_RANGE_REQUEST, fetchPriceRange),
    yield takeEvery(CREATE_AUCTION_REQUEST, createAuction),
    yield takeEvery(FETCH_AUCTION_DATA_REQUEST, fetchAuctionData),
    yield takeEvery(FETCH_AUCTION_DATA_OPTION_REQUEST, fetchAuctionDataOption),
  ]);
}

export default configParamSagas;
