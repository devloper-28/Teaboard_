import { put, takeEvery } from "redux-saga/effects";
import * as actionLabels from "../../actionLabels";
import { toggleActionFail, toggleActionSuccess } from "../../actions";

function* toggleSaga(action) {
  const { id } = action.payload;
  try {
    // Perform any necessary operations or logic here
    
    // Dispatch toggleActionSuccess to update the Redux store
    yield put(toggleActionSuccess());
  } catch (err) {
    console.log(err);
    // Dispatch toggleActionFail if an error occurs
    yield put(toggleActionFail("error"));
  }
}

export default function* toggleSagaWatcher() {
  yield takeEvery(actionLabels.TOGGLE_SAGA, toggleSaga);
}
