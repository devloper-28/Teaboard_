import * as actionTypes from "../../actionLabels/bankDetailsRedirect/bandDetailsUrl";

export const getBankRedirectUrl = (payloadBankRedirectUrlData) => {
  console.log("payloadBankRedirectUrlData ",payloadBankRedirectUrlData)
  return {
    type: actionTypes.REDIRECT_BANK_LINK,
    payload: payloadBankRedirectUrlData,
  };
};

export const getBankRedirectUrlSuccess = (BankRedirectUrlData) => {
  return {
    type: actionTypes.REDIRECT_BANK_LINK_SUCCESS,
    payload: BankRedirectUrlData,
  };
};

export const getBankRedirectUrlFail = (error) => {
  return {
    type: actionTypes.REDIRECT_BANK_LINK_FAIL,
    payload: error,
  };
};