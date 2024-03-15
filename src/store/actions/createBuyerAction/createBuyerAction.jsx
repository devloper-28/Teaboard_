import * as actionTypes from "../../actionLabels/CreateBuyer/CreateBuyer";

export const getBuyer = (payloadBuyerData) => {
  return {
    type: actionTypes.GET_ALL_BUYER,
    payload: payloadBuyerData,
  };
};

export const getBuyerSuccess = (BuyerData) => {
  return {
    type: actionTypes.GET_ALL_BUYER_SUCCESS,
    payload: BuyerData,
  };
};

export const getBuyerFail = (error) => {
  return {
    type: actionTypes.GET_ALL_BUYER_FAIL,
    payload: error,
  };
};

export const getPayment = (walletUserCode) => {
  return {
    type: actionTypes.GET_ALL_PAYMENT,
    payload: walletUserCode,
  };
};

export const getPaymentSuccess = (PaymentData) => {
  return {
    type: actionTypes.GET_ALL_PAYMENT_SUCCESS,
    payload: PaymentData,
  };
};

export const getPaymentFail = (error) => {
  return {
    type: actionTypes.GET_ALL_PAYMENT_FAIL,
    payload: error,
  };
};

// Action creator for creating a Buyer
export const createBuyerAction = (newBuyerData) => {
  return {
    type: actionTypes.CREATE_BUYER,
    payload: newBuyerData,
  };
};

export const createBuyerActionSuccess = (createdBuyer) => {
  return {
    type: actionTypes.CREATE_BUYER_SUCCESS,
    payload: createdBuyer,
  };
};

export const createBuyerActionFail = (error) => ({
  type: actionTypes.CREATE_BUYER_FAIL,
  payload: error,
});

export const createChildBuyerAction = (newBuyerData) => {
  return {
    type: actionTypes.CREATE_CHILD_BUYER,
    payload: newBuyerData,
  };
};

export const createChildBuyerActionSuccess = (createdBuyer) => {
  return {
    type: actionTypes.CREATE_CHILD_BUYER_SUCCESS,
    payload: createdBuyer,
  };
};

export const createChildBuyerActionFail = (error) => ({
  type: actionTypes.CREATE_CHILD_BUYER_FAIL,
  payload: error,
});

// Action creator for updating a Buyer
export const updateBuyerAction = (updatedBuyerData) => {
  return {
    type: actionTypes.UPDATE_BUYER,
    payload: {
      updatedBuyerData,
    },
  };
};
export const updateChildBuyerAction = (updatedBuyerData) => {
  return {
    type: actionTypes.UPDATE_CHILD_BUYER,
    payload: 
      updatedBuyerData,
  };
};
export const updateBuyerActionSuccess = (updatedBuyer) => {
  return {
    type: actionTypes.UPDATE_BUYER_SUCCESS,
    payload: updatedBuyer,
  };
};

export const updateBuyerActionFail = (error) => ({
  type: actionTypes.UPDATE_BUYER_FAIL,
  payload: error,
});

export const updateChildBuyerActionSuccess = (updatedBuyer) => {
  return {
    type: actionTypes.UPDATE_CHILD_BUYER_SUCCESS,
    payload: updatedBuyer,
  };
};

export const updateChildBuyerActionFail = (error) => ({
  type: actionTypes.UPDATE_CHILD_BUYER_FAIL,
  payload: error,
});

// Action creator for getting state by Buyer ID
export const getBuyerByIdAction = (BuyerId) => {
  return {
    type: actionTypes.GET_BUYER_BY_ID,
    payload: BuyerId,
  };
};

export const getBuyerByIdActionSuccess = (BuyerData) => {
  return {
    type: actionTypes.GET_BUYER_BY_ID_SUCCESS,
    payload: BuyerData,
  };
};

export const getBuyerByIdActionFail = (error) => ({
  type: actionTypes.GET_BUYER_BY_ID_FAIL,
  payload: error,
});

export const getChildBuyerByIdAction = (BuyerId) => {
  return {
    type: actionTypes.GET_CHILD_BUYER_BY_ID,
    payload: BuyerId,
  };
};

export const getChildBuyerByIdActionSuccess = (BuyerData) => {
  return {
    type: actionTypes.GET_CHILD_BUYER_BY_ID_SUCCESS,
    payload: BuyerData,
  };
};

export const getChildBuyerByIdActionFail = (error) => ({
  type: actionTypes.GET_CHILD_BUYER_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsBuyerAction = (role) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_BUYER,
    payload: role,
  };
};

export const uploadAllDocumentsBuyerSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_BUYER_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsBuyerFail = (error) => ({
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_BUYER_FAIL,
  payload: error,
});
export const getChildBuyer = (payloadBuyerData) => {
  return {
    type: actionTypes.GET_ALL_CHILD_BUYER,
    payload: payloadBuyerData,
  };
};

export const getChildBuyerSuccess = (BuyerData) => {
  return {
    type: actionTypes.GET_ALL_CHILD_BUYER_SUCCESS,
    payload: BuyerData,
  };
};

export const getChildBuyerFail = (error) => {
  return {
    type: actionTypes.GET_ALL_CHILD_BUYER_FAIL,
    payload: error,
  };
};

export const createEditApiStatusBuyer = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_API_STATUS_BUYER,
    payload: { data: data },
  };
};

export const closemodel = (data) => {
  return {
    type: actionTypes.CLOSE_MODEL,
    payload: { data: data },
  };
};

export const childcreateEditApiStatusBuyer = (data) => {
  return {
    type: actionTypes.CHILD_CREATE_EDIT_API_STATUS_BUYER,
    payload: { data: data },
  };
};
