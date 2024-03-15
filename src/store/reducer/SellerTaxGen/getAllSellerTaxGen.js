import * as actionTypes from "../../actionLabels/index";
const initialState = {
  getAllSellerTaxGen: [],
  getAllSellerTaxGenBuyer: [],
  getAllSellerTaxGenGen: [],
  getAllSellerTaxGenSale: [],
  getAllSellerTaxGenLot: [],
  getAllSellerTaxGenSession: [],
  SellerTaxGenById: [],
  getAllAuctiondata: [],
  ChargeById: [],
  getAllSubmit: [],
  getAllNot: [],
};

const getSellerTaxGenReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_SUCCESS:
      return {
        ...state,
        getAllSellerTaxGen: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_FAIL:
      return {
        ...state,
        getAllSellerTaxGen: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_SUCCESS_BUYER:
      return {
        ...state,
        getAllSellerTaxGenBuyer: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_FAIL_BUYER:
      return {
        ...state,
        getAllSellerTaxGenBuyer: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_GEN_SUCCESS:
      return {
        ...state,
        getAllSellerTaxGenGen: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_GEN_FAIL:
      return {
        ...state,
        getAllSellerTaxGenGen: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_SALE_SUCCESS:
      return {
        ...state,
        getAllSellerTaxGenSale: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_SALE_FAIL:
      return {
        ...state,
        getAllSellerTaxGenSale: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_LOT_SUCCESS:
      return {
        ...state,
        getAllSellerTaxGenLot: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_LOT_FAIL:
      return {
        ...state,
        getAllSellerTaxGenLot: [],
        error: action.payload,
      };
    case actionTypes.GET_INVOICE_BY_ID_SUCCESS:
      return {
        ...state,
        SellerTaxGenById: action.payload,
        error: null,
      };

    case actionTypes.GET_INVOICE_BY_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_SESSION_SUCCESS:
      return {
        ...state,
        getAllSellerTaxGenSession: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_SELLER_TAX_GEN_INVOICE_SESSION_FAIL:
      return {
        ...state,
        getAllSellerTaxGenSession: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_AUCTION_CENTER_INVOICE_SUCCESS:
      return {
        ...state,
        getAllAuctiondata: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_AUCTION_CENTER_INVOICE_FAIL:
      return {
        ...state,
        getAllAuctiondata: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_CHARGE_TAX_SUCCESS:
      return {
        ...state,
        ChargeById: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_CHARGE_TAX_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.GET_ALL_ADD_CHARGE_INVOICE_SUCCESS:
      return {
        ...state,
        getAllSubmit: action.payload,
        error: null,
      };
    case actionTypes.GET_ALL_ADD_CHARGE_INVOICE_FAIL:
      return {
        ...state,
        getAllSubmit: [],
        error: action.payload,
      };

    case actionTypes.GET_INVOICE_NOT_BY_SUCCESS:
      return {
        ...state,
        getAllNot: action.payload,
        error: null,
      };
    case actionTypes.GET_INVOICE_NOT_BY_FAIL:
      return {
        ...state,
        getAllNot: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default getSellerTaxGenReducer;
