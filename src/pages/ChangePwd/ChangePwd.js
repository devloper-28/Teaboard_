import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import { getChangePassword } from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomToast from "../../components/Toast";
import CryptoJS from "crypto-js";


function ChangePwd({ open, setOpen }) {
  const passwordSelector = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [confirmPassWord, setconfirmPassWord] = useState("");
  const [newPassWord, setnewPassWord] = useState("");
  const [oldPassWord, setoldPassWord] = useState("");
  const [userCode, setuserCode] = useState(
    atob(sessionStorage.getItem("argument4"))
  );
  const [confirmPassWordError, setconfirmPassWordError] = useState("");
  const [newPassWordError, setnewPassWordError] = useState("");
  const [oldPassWordError, setoldPassWordError] = useState("");

  const handleClear = () => {
    setconfirmPassWord("");
    setnewPassWord("");
    setoldPassWord("");
  };
  const handlePasswordChange = (e) => {
    setnewPassWord(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setconfirmPassWord(e.target.value);
  };

  const validatePasswords = () => {
    if (newPassWord === "" || confirmPassWord === "") {
      CustomToast.error("Please enter both password and confirm password.");
      return false;
    }

    if (newPassWord !== confirmPassWord) {
      CustomToast.error(
        " Your new password and confirm password do not match."
      );
      return false;
    }
    if (newPassWord.length < 8 || confirmPassWord.length < 8) {
      CustomToast.error("Password should be at least 8 characters long.");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => { 
    e.preventDefault();
    setconfirmPassWordError("");
    setnewPassWordError("");
    setoldPassWordError("");
    let isValid = true;

    if (!oldPassWord.trim()) {
      CustomToast.error("Please enter the old Password");
      isValid = false;
      return;
    }
    if (!newPassWord.trim()) {
      CustomToast.error("Please enter the new Password");
      isValid = false;
      return;
    }
    if (!confirmPassWord) {
      CustomToast.error("Please enter the confirm Password");
      isValid = false;
      return;
    }

    

   

    if (!isValid) {
      return;
    }

    try {
      if (validatePasswords()) {
        const hashedOldPassword = CryptoJS.SHA256(oldPassWord).toString(
          CryptoJS.enc.Hex
        );
        const hashedNewPassword = CryptoJS.SHA256(newPassWord).toString(
          CryptoJS.enc.Hex
        );
        const hashedConfirmPassword = CryptoJS.SHA256(confirmPassWord).toString(
          CryptoJS.enc.Hex
        );

        const newStateData = {
          userCode: userCode,
          confirmPassWord: hashedConfirmPassword,
          newPassWord: hashedNewPassword,
          oldPassWord: hashedOldPassword,
        };

        const updatedLoginData = {
          ...newStateData,
          password: hashedNewPassword,
        };

        dispatch(getChangePassword(updatedLoginData));
        
      }
    } catch (error) {
      // Handle errors
    }
  };

  useEffect(()=>{
    if(passwordSelector?.ChangePwd?.getAllChangePwdActionSuccess?.statusCode === 200){
      handleClear();
      // setOpen(false);
    }
  },[passwordSelector])
 

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-12">
          <div className="row align-items-end">
            <div className="col-md-6">
              <div className="FormGroup">
                <label>User Code</label>
                <label className="errorLabel"> * </label>
                <input
                  type="text"
                  maxLength="100"
                  className="form-control"
                  value={userCode}
                  disabled="true"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="FormGroup">
                <label>Old Password</label>
                <label className="errorLabel"> * </label>
                <input
                  type="text"
                  maxLength="100"
                  className="form-control"
                  value={oldPassWord}
                  onChange={(e) => setoldPassWord(e.target.value)}
                />
                {oldPassWordError && (
                  <p className="errorLabel">{oldPassWordError}</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="FormGroup">
                <label>New Password</label>
                <label className="errorLabel"> * </label>
                <input
                  type="text"
                  maxLength="500"
                  className="form-control"
                  value={newPassWord}
                  onChange={handlePasswordChange}
                />
                {newPassWordError && (
                  <p className="errorLabel">{newPassWordError}</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="FormGroup">
                <label>Confirm Password</label>
                <label className="errorLabel"> * </label>
                <input
                  type="text"
                  maxLength="500"
                  className="form-control"
                  value={confirmPassWord}
                  onChange={handleConfirmPasswordChange}
                />
                {confirmPassWordError && (
                  <p className="errorLabel">{confirmPassWordError}</p>
                )}
              </div>
            </div>
            <div className="col-md-12">
              <div className="BtnGroup">
                <button className="SubmitBtn" type="submit">
                  Submit
                </button>
                <button className="Clear" type="button" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    </>
  );
}
export default ChangePwd;
