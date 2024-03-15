/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { ICON, LOGINBG } from "../../assets/images";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { userRoutes, authRoutes } from "../../routes/mainRoutes/mainRoutes";
import CustomToast from "../../components/Toast";
import { loginAction, loginActionSuccess } from "../../store/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";

const Login = () => {
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    userCode: "",
    password: "",
  });
  const [passwordInputType, setPasswordInputType] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const handleCopyPaste = (event) => {
    event.preventDefault();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    let isValid = true;
    if (loginData.userCode == "") {
      CustomToast.error("Please enter your login");
      isValid = false;
      return;
    }

    if (loginData.password == "") {
      CustomToast.error("Please enter a password");
      isValid = false;
      return;
    }

    if (isValid) {
      // dispatch(loginAction(loginData));
      const hashedPassword = CryptoJS.SHA256(loginData.password).toString(
        CryptoJS.enc.Hex
      );

      const updatedLoginData = {
        ...loginData,
        password: hashedPassword,
      };

      dispatch(loginAction(updatedLoginData));
    }
  };
  const handleClear = () => {
    setLoginData({
      userCode: "",
      password: "",
    });
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      document.getElementById("loginsubmitJS").click();
    }
  };
  const loginResponse = useSelector((state) => state?.auth?.loginData);

  useEffect(() => {
    if (loginResponse.statusCode === 200) {
      navigate("/dashboard");
      dispatch(loginActionSuccess(""));
    }
  }, [loginResponse, dispatch]);
  return (
    <div>
      <div class="LoginBox">
        <div className="container-fluid">
          <div class="row">
            <div class="col-md-6 p-0">
              <div class="LoginBg">
                <img src={LOGINBG} class="img-fluid" />
              </div>
            </div>
            <div class="col-md-6 p-0">
              <div class="LoginForm">
                <div class="row g-4">
                  <div class="col-md-12 mb-3">
                    <span className="LoginTitle">
                      <img src={ICON} className="img-fluid Logo" /> Tea Auction
                      Organiser
                    </span>
                  </div>
                  <h6>Welcome to e-Auction system</h6>
                  <div class="col-12 mt-2">
                    <h1>Login</h1>
                  </div>
                  <div class="col-lg-12 mt-2">
                    <input
                      type="text"
                      name="userCode"
                      value={loginData.userCode}
                      class="form-control"
                      placeholder="User Code"
                      onChange={(e) => {
                        setLoginData({
                          ...loginData,
                          userCode: e.target.value,
                        });
                      }}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <div class="col-lg-12 mt-2">
                    <div class="PasswordBox">
                      <input
                        id="password-field"
                        name="password"
                        type={passwordInputType ? "password" : "text"}
                        value={loginData.password}
                        className="form-control"
                        placeholder="Password"
                        onCopy={(e) => handleCopyPaste(e)}
                        onPaste={(e) => handleCopyPaste(e)}
                        onChange={(e) => {
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          });
                        }}
                        onKeyPress={handleKeyPress}
                      />
                      <span
                        onClick={() => setPasswordInputType(!passwordInputType)}
                        toggle="#password-field"
                        className="fa fa fa-eye field-icon toggle-password"
                      ></span>
                    </div>
                  </div>

                  <div className="col-lg-12 text-end">
                    <span
                      type="submit"
                      onClick={() => {
                        navigate("/forgot-password");
                      }}
                    >
                      <u>Forget Password</u>
                    </span>
                  </div>
                  {/* <div class="col-lg-12 mt-3">
                    <input
                      type="submit"
                      value="Login"
                      class="LoginBtn"
                      onClick={() => {
                        let userCode = loginData.userCode.toString();

                        let password = loginData.password.toString();
                        if (
                          (userCode === "teaboard" &&
                            password === "teaboard") ||
                          (userCode === "auctioneer" &&
                            password === "auctioneer") ||
                          (userCode === "buyer" && password === "buyer")
                        ) {
                          sessionStorage.setItem(
                            "User",
                            JSON.stringify(loginData)
                          );
                          navigate("/dashboard");
                        } else {
                          toast.error("Incorrect credentials");
                        }
                      }}
                    />
                  </div> */}
                </div>
                <div>
                  <div className="col-md-12 mt-2">
                    <div className="BtnGroup d-flex justify-space-even">
                      <button
                        type="button"
                        className="LoginBtn"
                        id="loginsubmitJS"
                        onClick={(e) => handleLogin(e)}
                      >
                        Login
                      </button>
                      &nbsp;&nbsp;
                      <button
                        className="LoginBtn"
                        onClick={() => handleClear()}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
