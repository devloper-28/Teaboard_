// saga.js
import { takeLatest, put, call } from "redux-saga/effects";
import { fetchBuyerGroupsError, fetchBuyerGroupsSuccess } from '../../actions';
import { FETCH_BUYER_GROUPS } from '../../actionLabels';
import axiosMain from '../../../http/axios/axios_main';

function* fetchBuyerGroupsSaga(action) {
    try {
        // Call your API here and get the data
        const data = yield call(axiosMain.post, "/preauction/GroupMaster/BindGroups?buyerUserId=" + action.payload);

        // Dispatch a success action with the data
        yield put(fetchBuyerGroupsSuccess(data));
    } catch (error) {
        // Dispatch an error action if the API call fails
        yield put(fetchBuyerGroupsError(error.message));
    }
}


// Watcher Saga: Watches for the FETCH_GRADE_REQUEST action and calls the worker saga
export function* watchFetchGroups() {
    yield takeLatest(FETCH_BUYER_GROUPS, fetchBuyerGroupsSaga);
}


// Rest of the saga remains the same
