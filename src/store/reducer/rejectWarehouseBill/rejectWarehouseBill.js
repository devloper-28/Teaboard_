import {
  FETCH_FACTORY_DETAIL_FAILURE,
  FETCH_FACTORY_DETAIL_REQUEST,
  FETCH_FACTORY_DETAIL_SUCCESS,
  FETCH_WAREHOUSE_DATA_FAILURE,
  FETCH_WAREHOUSE_DATA_REQUEST,
  FETCH_WAREHOUSE_DATA_SUCCESS,
  FETCH_WAREHOUSE_EDIT_FAILURE,
  FETCH_WAREHOUSE_EDIT_REQUEST,
  FETCH_WAREHOUSE_EDIT_SUCCESS,
  FETCH_WAREHOUSE_FAILURE,
  FETCH_WAREHOUSE_REQUEST,
  FETCH_WAREHOUSE_SUCCESS,
  REJECT_BILL_FAILURE,
  REJECT_BILL_REQUEST,
  REJECT_BILL_SUCCESS,
} from "../../actionLabels/rejectWarehouseBill/rejectWarehouseBill";

const initialState = {
  tboardRegNo: null,
  loading: false,
  error: null,
  rejectWarehouseBillData:null,
  ViewWarehouseData:null,
  EditWarehouseById:null,
};

const TeaBoardRegistrationNo = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FACTORY_DETAIL_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_FACTORY_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        tboardRegNo: action.payload,
        error: null,
      };

    case FETCH_FACTORY_DETAIL_FAILURE:
      return { ...state, loading: false, error: action.payload.error };

     
      case FETCH_WAREHOUSE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_WAREHOUSE_SUCCESS:
      return {
        ...state,
        rejectWarehouseBillData: action.payload,
        loading: false,
        error: null
      };
    case FETCH_WAREHOUSE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };


    case REJECT_BILL_REQUEST:
      return { ...state, loading: true, error: null };
    case REJECT_BILL_SUCCESS:
      return { ...state, loading: false, data: action.payload.data };
    case REJECT_BILL_FAILURE:
      return { ...state, loading: false, error: action.payload.error };

      case FETCH_WAREHOUSE_DATA_REQUEST:
        return { ...state, loading: true, error: null };

      case FETCH_WAREHOUSE_DATA_SUCCESS:
        return {
          ...state,
          ViewWarehouseData: action.payload,
          error: null,
        };
      case FETCH_WAREHOUSE_DATA_FAILURE:
        return {
          ...state,
          warehouseData: null,
          error: action.payload,
        };

        case FETCH_WAREHOUSE_EDIT_REQUEST:
          return { ...state, loading: true, error: null };
        case FETCH_WAREHOUSE_EDIT_SUCCESS:
          return { ...state, loading: false, EditWarehouseById: action.payload };
        case FETCH_WAREHOUSE_EDIT_FAILURE:
          return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default TeaBoardRegistrationNo;
