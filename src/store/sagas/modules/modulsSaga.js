// sagas.js

import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import { fetchUserRightsFailure, fetchUserRightsSuccess } from "../../actions";
import { FETCH_USER_RIGHTS_REQUEST } from "../../actionLabels";
import axiosMain from "../../../http/axios/axios_main";

// Function to make the API request using Axios
const fetchUserRightsApi = async (auctionCenterId, userId) => {
  const url = "/admin/userRights/getRights";

  try {
    const response = await axiosMain.post(url, { auctionCenterId, userId });
    

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Saga worker function
function* fetchUserRights(action) {
  try {
    const { auctionCenterId, userId } = action.payload;
    const data = yield call(fetchUserRightsApi, auctionCenterId, userId);
    yield put(fetchUserRightsSuccess(data));
  } catch (error) {
    yield put(fetchUserRightsFailure(error.message));
  }
}

// Saga watcher function
function* userRightsSaga() {
  yield takeLatest(FETCH_USER_RIGHTS_REQUEST, fetchUserRights);
}

export default userRightsSaga;
