  // sagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import axiosMain from '../../../http/axios/axios_main';
import CustomToast from '../../../components/Toast';
import { TRANSFER_DEALBOOK_REQUEST } from '../../actionLabels/transferDealBookReducer/transferDealBookReducer';
import { transferDealBookFailure, transferDealBookSuccess } from '../../actions/transferDealBookReducer/transferDealBookReducer';
 

function* transferDealBookSaga(action) {
  try {
    const response = yield call(axiosMain.post, '/postauction/dealbook/transferdealbook', action.payload);
    if (response.status === 200 && response.data.statusCode === 200) {
      yield put(transferDealBookSuccess(response.data.responseData));
      CustomToast.success(response.data.message);
    } else {
      yield put(transferDealBookFailure(response.data.message || 'Failed to fetch PDF.'));
      console.log(response.data.responseData);
      CustomToast.error(response.data.message || 'Failed to fetch PDF.');
    }
  } catch (error) {
    yield put(transferDealBookFailure(error.message || 'Failed to fetch PDF.'));
  }
}

 

function* watchTransferDealBook() {
  yield takeLatest(TRANSFER_DEALBOOK_REQUEST, transferDealBookSaga);
}

export default watchTransferDealBook;
