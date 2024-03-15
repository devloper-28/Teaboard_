import {
  ADD_WAREHOUSE_BILL_CHARGE_EXCEL_FAILURE,
  ADD_WAREHOUSE_BILL_CHARGE_EXCEL_REQUEST,
  ADD_WAREHOUSE_BILL_CHARGE_EXCEL_SUCCESS,
  ADD_WAREHOUSE_BILL_CHARGE_FAILURE,
  ADD_WAREHOUSE_BILL_CHARGE_REQUEST,
  ADD_WAREHOUSE_BILL_CHARGE_SUCCESS,
  DELETE_WAREHOUSE_FAILURE,
  DELETE_WAREHOUSE_REQUEST,
  DELETE_WAREHOUSE_SUCCESS,
  FETCH_BILL_NUMBER_FAILURE,
  FETCH_BILL_NUMBER_REQUEST,
  FETCH_BILL_NUMBER_SUCCESS,
  FETCH_DATA_FAILURE,
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  SEARCH_WAREHOUSE_BILL_FAILURE,
  SEARCH_WAREHOUSE_BILL_REQUEST,
  SEARCH_WAREHOUSE_BILL_SUCCESS,
} from "../../actionLabels/addWarehouseBillUploads/addWarehouseBillUploads";

const initialState = {
  loading: false,
  data: null,
  error: null,
  WarehouseBill: null,
  AddWarehouseExcel: null,
  warehouseManageBillData: [],
  billNumber: null,
  WarehouseById: null,
};

const WarehouseBillChargeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WAREHOUSE_BILL_CHARGE_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_WAREHOUSE_BILL_CHARGE_SUCCESS:
      return {
        ...state,
        loading: false,
        WarehouseBill: action.payload,
        data: action.data,
      };

    case ADD_WAREHOUSE_BILL_CHARGE_FAILURE:
      return { ...state, loading: false, error: action.error };

    case ADD_WAREHOUSE_BILL_CHARGE_EXCEL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADD_WAREHOUSE_BILL_CHARGE_EXCEL_SUCCESS:
      return {
        ...state,
        loading: false,
        AddWarehouseExcel: action.payload,
        error: null,
      };
    case ADD_WAREHOUSE_BILL_CHARGE_EXCEL_FAILURE:
      return {
        ...state,
        loading: false,
        data: null,
        error: action.payload,
      };

      case SEARCH_WAREHOUSE_BILL_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case SEARCH_WAREHOUSE_BILL_SUCCESS:
        return {
          ...state,
          loading: false,
          warehouseManageBillData: action.payload,
          error: null,
        };
      case SEARCH_WAREHOUSE_BILL_FAILURE:
        return {
          ...state,
          loading: false,
          data: null,
          error: action.payload,
        };

    case FETCH_DATA_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        WarehouseById: action.payload,
        error: null,
      };
    case FETCH_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_WAREHOUSE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case DELETE_WAREHOUSE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case DELETE_WAREHOUSE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      case FETCH_BILL_NUMBER_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_BILL_NUMBER_SUCCESS:
        return {
          ...state,
          billNumber: action.payload,
          loading: false,
        };
      case FETCH_BILL_NUMBER_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };


    default:
      return state;
  }
};

export default WarehouseBillChargeReducer;
