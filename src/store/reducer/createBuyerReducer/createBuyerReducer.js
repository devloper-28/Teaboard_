import * as actionTypes from "../../actionLabels/index";

const initialState = {
  getBuyer: [],
  getPayment: [],
  error: null,
  createdBuyer: null,
  BuyerData: [],
  ChildBuyerData: [],
  uploadedDocuments: [],
  getChildBuyer: [],
  createEditApiStatus: false,
  childcreateEditApiStatus: false,
  closemodel: 0,
};

const getAllBuyers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_BUYER_SUCCESS:
      return {
        ...state,
        getBuyer: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_BUYER_FAIL:
      return {
        ...state,
        getBuyer: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_PAYMENT_SUCCESS:
      return {
        ...state,
        getPayment: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_PAYMENT_FAIL:
      return {
        ...state,
        getPayment: [],
        error: action.payload,
      };

    case actionTypes.CREATE_BUYER_SUCCESS:
      return {
        ...state,
        createdBuyer: action.payload,
        error: null,
      };

    case actionTypes.CREATE_CHILD_BUYER_FAIL:
      return {
        ...state,
        createdBuyer: null,
        error: action.payload,
      };
    case actionTypes.CREATE_CHILD_BUYER_SUCCESS:
      return {
        ...state,
        createdBuyer: action.payload,
        error: null,
      };

    case actionTypes.CREATE_BUYER_FAIL:
      return {
        ...state,
        createdBuyer: null,
        error: action.payload,
      };
    case actionTypes.UPDATE_BUYER_SUCCESS:
      return {
        ...state,
        updatedBuyer: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_BUYER_FAIL:
      return {
        ...state,
        updatedBuyer: null,
        error: action.payload,
      };
    case actionTypes.UPDATE_CHILD_BUYER_SUCCESS:
      return {
        ...state,
        updatedBuyer: action.payload,
        error: null,
      };

    case actionTypes.UPDATE_CHILD_BUYER_FAIL:
      return {
        ...state,
        updatedBuyer: null,
        error: action.payload,
      };
    case actionTypes.GET_BUYER_BY_ID_SUCCESS:
      return {
        ...state,
        BuyerData: action.payload,
        error: null,
      };
    case actionTypes.GET_BUYER_BY_ID_FAIL:
      return {
        ...state,
        BuyerData: [],
        error: action.payload,
      };
    case actionTypes.GET_CHILD_BUYER_BY_ID_SUCCESS:
      return {
        ...state,
        ChildBuyerData: action.payload,
        error: null,
      };
    case actionTypes.GET_CHILD_BUYER_BY_ID_FAIL:
      return {
        ...state,
        ChildBuyerData: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_BUYER_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_BUYER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.GET_ALL_CHILD_BUYER_SUCCESS:
      return {
        ...state,
        getChildBuyer: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_CHILD_BUYER_FAIL:
      return {
        ...state,
        getChildBuyer: [],
        error: action.payload,
      };
    case actionTypes.CREATE_EDIT_API_STATUS_BUYER:
      return {
        ...state,
        createEditApiStatus: action.payload.data,
      };
    case actionTypes.CLOSE_MODEL:
      return {
        ...state,
        closemodel: action.payload.data,
      };
    case actionTypes.CHILD_CREATE_EDIT_API_STATUS_BUYER:
      return {
        ...state,
        childcreateEditApiStatus: action.payload.data,
      };
    default:
      return state;
  }
};

export default getAllBuyers;
