import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { ICON, LOGINBG } from "../../assets/images";
import axiosMain from "../../http/axios/axios_main";
import CustomToast from "../../components/Toast";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailIdIsValid, setEmailIdIsValid] = useState(false);
  const [hintQuestion, setHintQuestion] = useState(null);
  const [hintQuestions, setHintQuestions] = useState([]);

  console.log(hintQuestion);

  const navigate = useNavigate();

  const initialValues = {
    hintQuestion: 0,
    hintAnswer: "",
    password: "",
    confirmPassword: "",
  };

  const { usercode } = useParams();

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

  const onSubmitPassword = (values) => {
    // Handle password submission logic here
    console.log(values);
    const { hintAnswer, hintQuestion, password, confirmPassword } = values;
    let data = {
      userCode: usercode.toString(),
      hintQuestionId: parseInt(hintQuestion),
      hintAnswer: hintAnswer,
      passWord: password,
      confirmPassWord: confirmPassword,
    };
    axiosMain.post("/admin/user/resetPassWord", data).then((res) => {
      if (res.data.statusCode === 200) {
        toast.success(res.data.message);
        formikPassword.resetForm();
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    });
  };

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
                    <h1>Reset Password</h1>
                  </div>

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
                        {...formikPassword.getFieldProps("hintQuestion")}
                      >
                        {hintQuestions.map((question, index) => (
                          <option
                            key={question.hintQuestionId}
                            value={question.hintQuestionId}
                          >
                            {question.lang1}
                          </option>
                        ))}
                      </select>
                      {formikPassword.touched.hintQuestion &&
                        formikPassword.errors.hintQuestion && (
                          <div className="text-danger">
                            {formikPassword.errors.hintQuestion}
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
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <div className="PasswordBox">
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className="form-control"
                          placeholder="Confirm Password"
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

                    <br />
                    <button type="submit" className="LoginBtn">
                      Reset Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
