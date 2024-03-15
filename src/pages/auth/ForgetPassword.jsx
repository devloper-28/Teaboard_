import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import { ICON, LOGINBG } from "../../assets/images";
import axiosMain from "../../http/axios/axios_main";
import CustomToast from "../../components/Toast";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailIdIsValid, setEmailIdIsValid] = useState(false);
  const [hintQuestion, setHintQuestion] = useState(null);
  const [hintQuestions, setHintQuestions] = useState([]);

  console.log(hintQuestion);

  const navigate = useNavigate();

  const initialValues = {
    userCode: "",
    hintQuestion: hintQuestion,
    hintAnswer: "",
    password: "",
    confirmPassword: "",
  };
  useEffect(() => {
    axiosMain.get("/admin/user/getHintQuestion").then((res) => {
      if (res.data.statusCode === 200) {
        setHintQuestions(res.data.responseData);
      } else {
        setHintQuestions([]);
      }
    });
  }, []);
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password can be at most 50 characters")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\-]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one numeric digit"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    hintAnswer: Yup.string().required("Hint Answer is required"),
  });

  const validationSchemaOfEmail = Yup.object().shape({
    userCode: Yup.string()
      .required("User Code is required")
      .matches(
        /^[a-zA-Z0-9!@#$_.()]*$/,
        "UserCode must contain alphanumeric and specific special characters (!, @, #, $, _, ., ())"
      )
      .test(
        "no-leading-trailing-whitespace",
        "Leading and trailing whitespace are not allowed",
        (value) => {
          if (value) {
            const trimmedValue = value.trim();
            return (
              value === trimmedValue &&
              !trimmedValue.startsWith(" ") &&
              !trimmedValue.endsWith(" ")
            );
          }
          return true; // Allow empty values without leading/trailing whitespace
        }
      )

      .max(10, "UserCode can be at most 10 characters")
      .trim(),
  });

  const onSubmitEmail = (values) => {
    // Handle email submission logic here
    // You can check the email and set emailIdIsValid accordingly
    if (hintQuestion === null) {
      axiosMain
        .get("/admin/user/checkUserCode/" + values.userCode)
        .then((res) => {
          if (res.data.statusCode === 200) {
            CustomToast.success(res.data.message);
            setHintQuestion(res.data.responseData.hintQuestionId);
            setEmailIdIsValid(true);
          } else if (res.data.statusCode === 404) {
            setEmailIdIsValid(false);
            CustomToast.error(res.data.message);
          } else {
            setEmailIdIsValid(false);
            CustomToast.warning(res.data.message);
          }
        });
    } else {
      // setEmailIdIsValid(false);
    }
  };

  const onSubmitPassword = (values) => {
    console.log(values);
    const hintAnswer = CryptoJS.SHA256(values.oldPassword).toString(
      CryptoJS.enc.Hex
    );
    const password = CryptoJS.SHA256(values.password).toString(
      CryptoJS.enc.Hex
    );
    const confirmPassword = CryptoJS.SHA256(values.confirmPassword).toString(
      CryptoJS.enc.Hex
    );
    // const { hintAnswer, password, confirmPassword } = values;
    let data = {
      userCode: formikEmail.values.userCode,
      hintQuestionId: hintQuestion,
      hintAnswer: hintAnswer,
      passWord: password,
      confirmPassWord: confirmPassword,
    };

    axiosMain.post("/admin/user/forgotPassWord", data).then((res) => {
      if (res.data.statusCode === 200) {
        CustomToast.success(res.data.message);
        formikPassword.resetForm();
        formikEmail.resetForm();
        navigate("/login");
      } else {
        CustomToast.error(res.data.message);
      }
    });
  };

  const formikEmail = useFormik({
    initialValues,
    validationSchema: validationSchemaOfEmail,
    onSubmit: onSubmitEmail,
  });

  const formikPassword = useFormik({
    initialValues,
    validationSchema,
    onSubmit: onSubmitPassword,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      <div className="LoginBox">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 p-0">
              <div className="LoginBg">
                <img
                  src={LOGINBG}
                  className="img-fluid"
                  alt="Login Background"
                />
              </div>
            </div>
            <div className="col-md-6 p-0">
              <div className="LoginForm">
                <div className="row g-4">
                  <div className="col-md-12 mb-3">
                    <span className="LoginTitle">
                      <img src={ICON} className="img-fluid Logo" alt="Logo" />{" "}
                      Tea Auction Organiser
                    </span>
                  </div>
                  <div className="col-12 mt-2">
                    <h1>Forgot Password</h1>
                  </div>
                  <form
                    className="col-md-12 mb-3"
                    onSubmit={formikEmail.handleSubmit}
                  >
                    <div className="form-group">
                      <label htmlFor="userCode">User Code</label>
                      <input
                        type="text"
                        id="userCode"
                        name="userCode"
                        className="form-control"
                        placeholder="Enter User Code..."
                        {...formikEmail.getFieldProps("userCode")}
                      />
                      {formikEmail.touched.userCode &&
                        formikEmail.errors.userCode && (
                          <div className="text-danger">
                            {formikEmail.errors.userCode}
                          </div>
                        )}
                      {/* {!emailIdIsValid &&
                        formikEmail.values.userCode !== "" && (
                          <div className="text-danger">Invalid Email</div>
                        )} */}
                    </div>

                    <button
                      type="submit"
                      className="LoginBtn"
                      style={{ width: "157px" }}
                    >
                      Check UserCode
                    </button>
                  </form>

                  {emailIdIsValid && (
                    <form
                      className="col-md-12 mb-3"
                      onSubmit={formikPassword.handleSubmit}
                    >
                      <div className="form-group">
                        <label htmlFor="hintQuestion">Hint Question</label>
                        <select
                          id="hintQuestion"
                          name="hintQuestion"
                          className="form-control"
                          {...formikEmail.getFieldProps("hintQuestion")}
                          disabled
                        >
                          <option value="" disabled>
                            Select Hint Question
                          </option>
                          {hintQuestions.map((question, index) => (
                            <option
                              key={question.hintQuestionId}
                              value={question.hintQuestionId}
                            >
                              {question.lang1}
                            </option>
                          ))}
                        </select>
                        {formikEmail.touched.hintQuestion &&
                          formikEmail.errors.hintQuestion && (
                            <div className="text-danger">
                              {formikEmail.errors.hintQuestion}
                            </div>
                          )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="hintAnswer">Hint Answer</label>
                        <input
                          type="text"
                          id="hintAnswer"
                          name="hintAnswer"
                          className="form-control"
                          placeholder="Hint Answer"
                          {...formikPassword.getFieldProps("hintAnswer")}
                        />
                        {formikPassword.touched.hintAnswer &&
                          formikPassword.errors.hintAnswer && (
                            <div className="text-danger">
                              {formikPassword.errors.hintAnswer}
                            </div>
                          )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="PasswordBox">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            {...formikPassword.getFieldProps("password")}
                          />

                          <span
                            onClick={togglePasswordVisibility}
                            toggle="#password-field"
                            style={{ cursor: "pointer" }}
                            className="fa fa fa-eye field-icon toggle-password"
                          ></span>
                        </div>
                        {formikPassword.touched.password &&
                          formikPassword.errors.password && (
                            <div className="text-danger">
                              {formikPassword.errors.password}
                            </div>
                          )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <div className="PasswordBox">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirm Password"
                            onPaste={(e) => e.preventDefault()}
                            {...formikPassword.getFieldProps("confirmPassword")}
                          />
                          <span
                            onClick={toggleConfirmPasswordVisibility}
                            toggle="#confirmPassword-field"
                            style={{ cursor: "pointer" }}
                            className="fa fa fa-eye field-icon toggle-password"
                          ></span>
                        </div>
                        {formikPassword.touched.confirmPassword &&
                          formikPassword.errors.confirmPassword && (
                            <div className="text-danger">
                              {formikPassword.errors.confirmPassword}
                            </div>
                          )}
                      </div>
                      Forgot hint answer too? No problem. You can still reset
                      your password.
                      <span
                        onClick={() => {
                          axiosMain
                            .post(
                              "/admin/mail/mailforResetPasswordlink/" +
                                formikEmail.values.userCode,
                              {}
                            )
                            .then((res) => {
                              if (res.data.statusCode === 200) {
                                CustomToast.success(res.data.message);
                                formikEmail.resetForm();
                                formikPassword.resetForm();
                                setHintQuestion(null);

                                setEmailIdIsValid(false);
                              } else {
                                CustomToast.error(res.data.message);
                              }
                            });
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        Click here to Reset password.
                      </span>
                      <br />
                      <button type="submit" className="LoginBtn">
                        Reset Password
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
