import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../assets/css/style.css";
import CryptoJS from "crypto-js";
import { ICON, LOGINBG } from "../../assets/images";
import { useSelector } from "react-redux";
import axiosMain from "../../http/axios/axios_main";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import CustomToast from "../../components/Toast";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailIdIsValid, setEmailIdIsValid] = useState(false);
  const activeClass = useSelector((state) => state.toggle.activeClass);
  const [hintQuestion, setHintQuestion] = useState([]);
  const [showOldPassword, setShowOldPassword] = useState(false);
  useEffect(() => {
    axiosMain.get("/admin/user/getHintQuestion").then((res) => {
      if (res?.data.statusCode === 200) {
        setHintQuestion(res?.data.responseData);
      } else {
        setHintQuestion([]);
      }
    });
  }, []);

  console.log(hintQuestion);

  const hintQuestions = [
    "What is your favorite color?",
    "What is your mother's maiden name?",
    "What is the name of your first pet?",
    "What city were you born in?",
  ];
  const initialValues = {
    oldPassword: "",
    hintQuestion: "",
    hintAnswer: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required(
      "Password must be at least 8 characters"
    ),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password can be at most 50 characters")
      .matches(
        /^[a-zA-Z0-9!@#$_.()]*$/,
        "Password must contain alphanumeric and specific special characters (!, @, #, $, _, ., ())"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    hintAnswer: Yup.string().required("Hint Answer is required"),
  });

  const onSubmitEmail = (values) => {
    // Handle email submission logic here
    // You can check the email and set emailIdIsValid accordingly
    if (values.userCode === "john") {
      setEmailIdIsValid(true);
    } else {
      setEmailIdIsValid(false);
    }
  };

  const onSubmitPassword = (values) => {
    console.log("Before API call");
    console.log(values, "a");

    // Hash the passwords using SHA256
    const oldPasswordHash = CryptoJS.SHA256(values.oldPassword).toString(
      CryptoJS.enc.Hex
    );
    const newPasswordHash = CryptoJS.SHA256(values.password).toString(
      CryptoJS.enc.Hex
    );
    const confirmPasswordHash = CryptoJS.SHA256(
      values.confirmPassword
    ).toString(CryptoJS.enc.Hex);

    // Hash the hintAnswer using SHA256
    const hintAnswerHash = CryptoJS.SHA256(values.hintAnswer).toString(
      CryptoJS.enc.Hex
    );

    axiosMain
      .post("/admin/user/resetPasswordOnFirstLogin", {
        userCode: atob(sessionStorage.getItem("argument4")),
        hintQuestionId: parseInt(values.hintQuestion),
        hintAnswer: hintAnswerHash,
        oldPassWord: oldPasswordHash,
        newPassWord: newPasswordHash,
        confirmPassWord: confirmPasswordHash,
      })
      .then((res) => {
        if (res?.data.statusCode === 200) {
          CustomToast.success(res?.data.message);
          sessionStorage.setItem("isLogged", 0);
          navigate("dashboard");
          formik.resetForm();
        } else {
          CustomToast.info(res?.data.message);
        }
      });

    console.log("After API call");
    console.log(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: onSubmitPassword,
  });

  console.log(formik.values, "for");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  return (
    <div
      className={`LoginBox ${activeClass && "active"}  MainComponent container`}
    >
      <div>
        <h1>Change Password</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="oldPassword">Old Password</label>
              <div className="PasswordBox">
                <input
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  className="form-control"
                  placeholder="Old Password"
                  {...formik.getFieldProps("oldPassword")}
                />

                <span
                  onClick={toggleOldPasswordVisibility}
                  // toggle="#password-field"
                  style={{ cursor: "pointer" }}
                  className="fa fa fa-eye field-icon"
                ></span>
              </div>
              {formik.touched.oldPassword && formik.errors.oldPassword && (
                <div className="text-danger">{formik.errors.oldPassword}</div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="PasswordBox">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  {...formik.getFieldProps("password")}
                />

                <span
                  onClick={togglePasswordVisibility}
                  toggle="#password-field"
                  style={{ cursor: "pointer" }}
                  className="fa fa fa-eye field-icon toggle-password"
                ></span>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-danger">{formik.errors.password}</div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="PasswordBox">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm Password"
                  {...formik.getFieldProps("confirmPassword")}
                />
                <span
                  onClick={toggleConfirmPasswordVisibility}
                  toggle="#confirmPassword-field"
                  style={{ cursor: "pointer" }}
                  className="fa fa fa-eye field-icon toggle-password"
                ></span>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-danger">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="hintQuestion">Hint Question</label>
              <select
                id="hintQuestion"
                name="hintQuestion"
                className="form-control"
                {...formik.getFieldProps("hintQuestion")}
              >
                <option value="" disabled>
                  Select Hint Question
                </option>
                {hintQuestion.map((question, index) => (
                  <option
                    key={question.hintQuestionId}
                    value={question.hintQuestionId}
                  >
                    {question.lang1}
                  </option>
                ))}
              </select>
              {formik.touched.hintQuestion && formik.errors.hintQuestion && (
                <div className="text-danger">{formik.errors.hintQuestion}</div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="hintAnswer">Hint Answer</label>
              <input
                type="text"
                id="hintAnswer"
                name="hintAnswer"
                className="form-control"
                placeholder="Hint Answer"
                {...formik.getFieldProps("hintAnswer")}
              />
              {formik.touched.hintAnswer && formik.errors.hintAnswer && (
                <div className="text-danger">{formik.errors.hintAnswer}</div>
              )}
            </div>
          </div>
          {/* Forgot hint answer too? No problem. You can still reset your
                    password.
                    <span
                      onClick={() => setEmailIdIsValid(false)}
                      style={{ cursor: "pointer" }}
                    >
                      Click here to Reset password.
                    </span> */}
          <div className="col-md-12">
            <button type="submit" className="LoginBtn">
              Change Password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
