import { all, takeEvery, put, call } from "redux-saga/effects";
import { fetchTokenFailure, fetchTokenSuccess, loginActionFail, loginActionSuccess } from "../../actions";
import * as actionLabels from "../../actionLabels";
import axiosMain from "../../../http/axios/axios_main";
import CustomToast from "../../../components/Toast";

function* loginSaga(action) {
  try {
    const response = yield call(
      axiosMain.post,
      `/admin/auth/token`,
      action.payload
    );

    if (response.status === 200) {
      if (response.data.statusCode === 200) {
        let responseData = response.data.responseData;
        let userNameEncodeData =
          responseData.roleCode && responseData.roleCode.toString();

        //ROLE
        sessionStorage.setItem(
          "User",
          JSON.stringify({
            userCode: userNameEncodeData === "BUYER" ? "buyer" : "auctioneer",
          })
        );
        //token
        let tokenEncodeData = btoa(responseData.token.toString());
        sessionStorage.setItem("argument1", tokenEncodeData);

        //refresh token time
        let refreshTokenTime = btoa(responseData.tokenExpirationOn.toString());
        sessionStorage.setItem("argument12", refreshTokenTime);

        //userId
        let userIdEncodeData = btoa(responseData.userId.toString());
        sessionStorage.setItem("argument2", userIdEncodeData);

        //userType
        let userTypeEncodeData = btoa(responseData.usertypeId.toString());
        sessionStorage.setItem("argument3", userTypeEncodeData);

        //userCode
        let userCodeEncodeData = btoa(responseData.userCode.toString());
        sessionStorage.setItem("argument4", userCodeEncodeData);

        

        //userName
        if (responseData.userName != null) {
          let userNameEncodeData = btoa(responseData.userName.toString());
          sessionStorage.setItem("argument5", userNameEncodeData);
        }

        // Role
        if (responseData.roleCode != null) {
          let userNameEncodeData =
            responseData.roleCode && btoa(responseData.roleCode.toString());
          sessionStorage.setItem("argument6", userNameEncodeData);
        }

        //trackLoginId
        let trackLoginIdData =
          responseData.trackLoginId &&
          btoa(responseData.trackLoginId.toString());
        sessionStorage.setItem("argument7", trackLoginIdData);

        let isLogged = responseData.isFirstLogin;
        sessionStorage.setItem("isLogged", isLogged);

        CustomToast.success(response.data.message);
        window.location.pathname = "/dashboard";
      } else {
        CustomToast.error(response.data.message);
        yield put(loginActionFail(response.data.message));
      }
    } else {
      yield put(loginActionFail(response.message));
    }
  } catch (err) {
    console.log(err);
  }
}
function* fetchToken(action) {
  try {
    // Make the API call using Axios
    const response = yield call(fetchTokenAPI, action.payload.userCode);
    yield put(fetchTokenSuccess(response.data.responseData));
  } catch (error) {
    yield put(fetchTokenFailure(error));
  }
}

// Function to make API call using Axios
function fetchTokenAPI(userCode) {
  return axiosMain.post("/admin/auth/refreshToken", {
    userCode,
  });
}

export default function* authSaga() {
  yield takeEvery(actionLabels.LOGIN_ACTION, loginSaga);
  yield takeEvery(actionLabels.FETCH_TOKEN_REQUEST, fetchToken);
}
