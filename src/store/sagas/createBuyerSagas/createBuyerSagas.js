import { all, call, put, takeEvery } from "redux-saga/effects";
import * as allActions from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import CustomToast from "../../../components/Toast";
import {
  GET_ALL_BUYER,
  UPDATE_BUYER,
  CREATE_BUYER,
  GET_BUYER_BY_ID,
  UPLOAD_ALL_DOCUMENTS_BUYER,
  GET_ALL_CHILD_BUYER,
  GET_ALL_PAYMENT,
  CLOSE_MODEL,
  GET_CHILD_BUYER_BY_ID,
  UPDATE_CHILD_BUYER,
  CREATE_CHILD_BUYER,
} from "../../actionLabels";
function* getAllBuyerSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      "admin/getAllUser/search",
      action.payload
    );
    yield put(allActions.getBuyerSuccess(response.data));
  } catch (error) {
    yield put(allActions.getBuyerFail(error));
  }
}
function* updatedBuyerSaga(action) {
  try {
    const { updatedBuyerData } = action.payload;
    const updatedBuyer = yield call(
      axiosMain.post,
      `/admin/buyer/update`,
      updatedBuyerData
    );
    if (updatedBuyer.status == 200) {
      if (updatedBuyer.data.statusCode == 200) {
        CustomToast.success(updatedBuyer.data.message);
        yield put(allActions.updateBuyerActionSuccess(updatedBuyer));
        yield put(allActions.getBuyer(action));
        yield put(allActions.createEditApiStatusBuyer(true));
      } else {
        CustomToast.error(updatedBuyer.data.message);
        yield put(allActions.updateBuyerActionFail(updatedBuyer.data.message));
      }
    } else {
      yield put(allActions.updateBuyerActionFail(updatedBuyer));
    }
  } catch (error) {
    yield put(allActions.updateBuyerActionFail(error));
  }
}
function* updatedChildBuyerSaga(action) {
  try {
    const updatedChildBuyer = yield call(
      axiosMain.post,
      `/admin/buyer/childBuyerUpdate`,
      action.payload
    );
    if (updatedChildBuyer.status == 200) {
      if (updatedChildBuyer.data.statusCode == 200) {
        CustomToast.success(updatedChildBuyer.data.message);
        yield put(allActions.updateBuyerActionSuccess(updatedChildBuyer));
        yield put(allActions.getChildBuyer(updatedChildBuyer.data.responseData.isParentId));
        yield put(allActions.childcreateEditApiStatusBuyer(true));
      } else {
        CustomToast.error(updatedChildBuyer.data.message);
        yield put(allActions.updateBuyerActionFail(updatedChildBuyer.data.message));
      }
    } else {
      yield put(allActions.updateBuyerActionFail(updatedChildBuyer));
    }
  } catch (error) {
    yield put(allActions.updateBuyerActionFail(error));
  }
}
function* createBuyerSaga(action) {
  try {
    let newBuyerData = action.payload;
    const createdBuyer = yield call(
      axiosMain.post,
      `admin/buyer/create`,
      newBuyerData
    );
    if (createdBuyer.status == 200) {
      if (createdBuyer.data.statusCode == 200) {
        CustomToast.success(createdBuyer.data.message);
        yield put(allActions.createBuyerActionSuccess(createdBuyer));
        if (
          action.payload.isParentId == null ||
          action.payload.isParentId == undefined ||
          action.payload.isParentId == ""
        ) {
          yield put(allActions.createEditApiStatusBuyer(true));
        } else {
          yield put(allActions.childcreateEditApiStatusBuyer(true));
        }
      } else {
        CustomToast.error(createdBuyer.data.message);
        yield put(allActions.createBuyerActionFail(createdBuyer.data.message));
      }
    }
  } catch (error) {
    yield put(allActions.createBuyerActionFail(error));
  }
}
function* createChildBuyerSaga(action) {
  try {
    let newBuyerData = action.payload;
    const createdBuyer = yield call(
      axiosMain.post,
      `admin/buyer/childBuyerCreate`,
      newBuyerData
    );
    if (createdBuyer.status == 200) {
      if (createdBuyer.data.statusCode == 200) {
        CustomToast.success(createdBuyer.data.message);
        yield put(allActions.createChildBuyerActionSuccess(createdBuyer));
        if (
          action.payload.isParentId == null ||
          action.payload.isParentId == undefined ||
          action.payload.isParentId == ""
        ) {
          yield put(allActions.createEditApiStatusBuyer(true));
        } else {
          yield put(allActions.childcreateEditApiStatusBuyer(true));
        }
      } else {
        CustomToast.error(createdBuyer.data.message);
        yield put(allActions.createChildBuyerActionFail(createdBuyer.data.message));
      }
    }
  } catch (error) {
    yield put(allActions.createBuyerActionFail(error));
  }
}

function* getBuyerByIdSaga(action) {
  try {
    const BuyerId = action.payload;
    const BuyerData = yield call(
      axiosMain.get,
      `admin/buyer/getuserbyid/${BuyerId}`
    );
    if(BuyerData.data.responseData.isParentId==0){
    yield put(allActions.getBuyerByIdActionSuccess(BuyerData.data));
    }
  } catch (error) {
    yield put(allActions.getBuyerByIdActionFail(error));
  }
}
function* getchildBuyerByIdSaga(action) {
  try {
    const BuyerId = action.payload;
    const BuyerData = yield call(
      axiosMain.get,
      `/admin/buyer/getchilduserbyid/${BuyerId}`
    );
    if (BuyerData.status == 200) {
      if (BuyerData.data.statusCode == 200) {
        
        if(BuyerData.data.responseData.isParentId != undefined && BuyerData.data.responseData.isParentId != null && BuyerData.data.responseData.isParentId != 0 && BuyerData.data.responseData.isParentId != ""){
          yield put(allActions.getChildBuyerByIdActionSuccess(BuyerData.data));
          yield put(allActions.getBuyerByIdAction(BuyerData.data.responseData.isParentId));
        }
      }
    }
  } catch (error) {
    yield put(allActions.getChildBuyerByIdActionFail(error));
  }
}
function* uploadDocumentBuyer(action) {
  try {
    let role = action.payload;
    if (isNaN(role)) {
      const response = yield call(
        axiosMain.get,
        `admin/buyer/getalluploadeddocument/${role}`
      );
      yield put(allActions.uploadAllDocumentsBuyerSuccess(response.data));
    } else if (!isNaN(role)) {
      const response = yield call(
        axiosMain.get,
        `admin/buyer/getallChilduploadeddocument/${role}`
      );
      yield put(allActions.uploadAllDocumentsBuyerSuccess(response.data));
    } else {
      yield put(allActions.uploadAllDocumentsBuyerFail(role));
    }
  } catch (error) {
    yield put(allActions.uploadAllDocumentsBuyerFail(error.message));
  }
}
function* getAllChildBuyerSaga(action) {
  try {
    const BuyerId = action.payload;
    const response = yield call(
      axiosMain.get,
      `admin/buyer/getAlLChildUserList/${BuyerId}`
    );
    yield put(allActions.getChildBuyerSuccess(response.data));
  } catch (error) {
    yield put(allActions.getChildBuyerFail(error));
  }
}

function* getAllPaymentSaga(action) {
  try {
    const walletUserCode = action.payload;
    const response = yield call(
      axiosMain.post,
      `admin/wallet/createUserParameter/${walletUserCode}`
    );
    if (response.status == 200) {
      if (response.data.statusCode == 200) {
        // axiosMain
        //   .post(
        //     response.data.responseData.requestUrl,
        //     response.data.responseData.walletRequestMessageParameter
        //   )
        //   .then((response) => {
        //     console.log("hello 143", response);
        //   });

        let url = response.data.responseData.requestUrl;

        let tempData = {
          walletClientCode: response.data.responseData.walletClientCode,
          walletRequestMessage: response.data.responseData.walletRequestMessage,
        };
        console.log("tempData 152", tempData);
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tempData),
        };

        fetch(url, requestOptions)
          .then((response) => console.log("hello 143", response))
          .then((data) => console.log("hello 144", data));

        // window.open(
        //   response.data.responseData.requestUrl,
        //   response.data.responseData.walletRequestMessageParameter
        //   // response.data.responseData.walletUserCode
        // );
        yield put(allActions.getPaymentSuccess(response.data));
      }
    } else {
      yield put(allActions.getPaymentFail(response.data.message));
    }
  } catch (error) {
    yield put(allActions.getPaymentFail(error));
  }
}
function* closemymodel(action) {
  let chch = action.payload.data;
  let ddd = parseInt(chch)+1;
  allActions.closemodel(ddd);
}
export function* BuyerSagas() {
  yield all([
    yield takeEvery(GET_ALL_PAYMENT, getAllPaymentSaga),
    yield takeEvery(GET_ALL_BUYER, getAllBuyerSaga),
    yield takeEvery(UPDATE_BUYER, updatedBuyerSaga),
    yield takeEvery(UPDATE_CHILD_BUYER, updatedChildBuyerSaga),
    yield takeEvery(CREATE_BUYER, createBuyerSaga),
    yield takeEvery(CREATE_CHILD_BUYER, createChildBuyerSaga),
    yield takeEvery(GET_BUYER_BY_ID, getBuyerByIdSaga),
    yield takeEvery(GET_CHILD_BUYER_BY_ID, getchildBuyerByIdSaga),
    yield takeEvery(UPLOAD_ALL_DOCUMENTS_BUYER, uploadDocumentBuyer),
    yield takeEvery(GET_ALL_CHILD_BUYER, getAllChildBuyerSaga),
    yield takeEvery(CLOSE_MODEL, closemymodel),
  ]);
}
export default BuyerSagas;
