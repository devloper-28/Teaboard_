import { put, call, takeLatest } from "redux-saga/effects";
import axios from "axios"; // Import Axios

import { FETCH_SESSION_TYPE_REQUEST } from "../../actionLabels";
import {
  fetchSessionTypeFailure,
  fetchSessionTypeSuccess,
} from "../../actions";
import axiosMain from "../../../http/axios/axios_main";

// Your API URL
const API_URL = `/preauction/Common/BindSessionType`; // Update the URL

function* fetchSessionTypes(action) {
  try {
    const response = yield call(
      axiosMain.get,
      API_URL + "?auctionTypeCode=" + action?.payload?.url
    ); // Use axios.get to make the API call
    if (!response.data) {
      throw new Error("Failed to fetch data");
    }
    const data = response.data; // Use response.data to get the JSON data
    yield put(fetchSessionTypeSuccess(data));
  } catch (error) {
    yield put(fetchSessionTypeFailure(error.message));
  }
}

function* sessionTypesSaga() {
  yield takeLatest(FETCH_SESSION_TYPE_REQUEST, fetchSessionTypes);
}

export default sessionTypesSaga;
