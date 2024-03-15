import {
  BIND_AUCTIONDATA_FAILURE,
  BIND_AUCTIONDATA_REQUEST,
  BIND_AUCTIONDATA_SUCCESS,
  BIND_AUCTIONEER_FAILURE,
  BIND_AUCTIONEER_REQUEST,
  BIND_AUCTIONEER_SUCCESS,
  BIND_LOATNO_FAILURE,
  BIND_LOATNO_REQUEST,
  BIND_LOATNO_SUCCESS,
  BIND_SALE_NO_FAILURE,
  BIND_SALE_NO_REQUEST,
  BIND_SALE_NO_SUCCESS,
  BIND_SESSIONTIME_FAILURE,
  BIND_SESSIONTIME_REQUEST,
  BIND_SESSIONTIME_SUCCESS,
  DOWNLOAD_AUCTIONEER_EXCEL_FAILURE,
  DOWNLOAD_AUCTIONEER_EXCEL_REQUEST,
  DOWNLOAD_AUCTIONEER_EXCEL_SUCCESS,
  DOWNLOAD_AUCTIONEER_PDF_FAILURE,
  DOWNLOAD_AUCTIONEER_PDF_REQUEST,
  DOWNLOAD_AUCTIONEER_PDF_SUCCESS,
  DOWNLOAD_EXCEL_FAILURE,
  DOWNLOAD_EXCEL_REQUEST,
  DOWNLOAD_EXCEL_SUCCESS,
  DOWNLOAD_PDF_FAILURE,
  DOWNLOAD_PDF_REQUEST,
  DOWNLOAD_PDF_SUCCESS,
  DOWNLOAD_TAO_EXCEL_FAILURE,
  DOWNLOAD_TAO_EXCEL_REQUEST,
  DOWNLOAD_TAO_EXCEL_SUCCESS,
  DOWNLOAD_TAO_PDF_FAILURE,
  DOWNLOAD_TAO_PDF_REQUEST,
  DOWNLOAD_TAO_PDF_SUCCESS,
  VIEWDEALBOOK_LIST_FAILURE,
  VIEWDEALBOOK_LIST_REQUEST,
  VIEWDEALBOOK_LIST_SUCCESS,
  VIEWDEALBOOK_SEARCH_FAILURE,
  VIEWDEALBOOK_SEARCH_REQUEST,
  VIEWDEALBOOK_SEARCH_SUCCESS,
  VIEW_DEALBOOK_LIST_FAILURE,
  VIEW_DEALBOOK_LIST_REQUEST,
  VIEW_DEALBOOK_LIST_SUCCESS,
} from "../../actionLabels";
const initialState = {
  saleList: [], // Make sure this is an array
  auctionDateList: [],
  loatNoList: [],
  auctineerList: [],
  sessionTimeList: [],
  loading: false,
  error: null,
  base64DataExcel: null,
  base64DataPDF: null,
  ViewDealBookData: [],
  AuctioneerPDFDownload: null,
  AuctioneerExcelDownload: null,
  TaoExcelDownload: null,
  TaoPDFDownload: null,
  ViewDealBookListData:[],
  ViewDealBookBuyerData:[],
};

// reducer.js
const ViewDealBook = (state = initialState, action) => {
  switch (action.type) {
    case BIND_SALE_NO_REQUEST:
      return { ...state, loading: true, error: null };
    case BIND_SALE_NO_SUCCESS:
      return {
        ...state,
        saleList: action.payload.responseData || [], // Set to an empty array if responseData is falsy
        loading: false,
        error: null,
      };
    case BIND_SALE_NO_FAILURE:
      return {
        ...state,
        saleList: [], // Set saleList to an empty array on failure
        loading: false,
        error: action.payload,
      };

    case BIND_AUCTIONDATA_REQUEST:
      return { ...state, loading: true, error: null };
    case BIND_AUCTIONDATA_SUCCESS:
      return {
        ...state,
        auctionDateList: action.payload.responseData || "", // Set to an empty array if responseData is falsy
        loading: false,
        error: null,
      };
    case BIND_AUCTIONDATA_FAILURE:
      return {
        ...state,
        auctionDateList: [], // Set saleList to an empty array on failure
        loading: false,
        error: action.payload,
      };

    case BIND_LOATNO_REQUEST:
      return { ...state, loading: true, error: null };
    case BIND_LOATNO_SUCCESS:
      return {
        ...state,
        loatNoList: action.payload.responseData || "", // Set to an empty array if responseData is falsy
        loading: false,
        error: null,
      };
    case BIND_LOATNO_FAILURE:
      return {
        ...state,
        loatNoList: [], // Set saleList to an empty array on failure
        loading: false,
        error: action.payload,
      };

    case BIND_SESSIONTIME_REQUEST:
      return { ...state, loading: true, error: null };
    case BIND_SESSIONTIME_SUCCESS:
      return {
        ...state,
        sessionTimeList: action.payload.responseData || "", // Set to an empty array if responseData is falsy
        loading: false,
        error: null,
      };
    case BIND_SESSIONTIME_FAILURE:
      return {
        ...state,
        sessionTimeList: [], // Set saleList to an empty array on failure
        loading: false,
        error: action.payload,
      };

    case BIND_AUCTIONEER_REQUEST:
      return { ...state, loading: true, error: null };
    case BIND_AUCTIONEER_SUCCESS:
      return {
        ...state,
        auctineerList: action.payload.responseData || [], // Set to an empty array if responseData is falsy
        loading: false,
        error: null,
      };
    case BIND_AUCTIONEER_FAILURE:
      return {
        ...state,
        auctineerList: [], // Set saleList to an empty array on failure
        loading: false,
        error: action.payload,
      };

    case DOWNLOAD_EXCEL_REQUEST:
      return { ...state, loading: true, error: null };

    case DOWNLOAD_EXCEL_SUCCESS:
      return { ...state, loading: false, base64DataExcel: action.payload };

    case DOWNLOAD_EXCEL_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DOWNLOAD_PDF_REQUEST:
      return { ...state, loading: true, error: null };
    case DOWNLOAD_PDF_SUCCESS:
      return {
        ...state,
        loading: false,
        base64DataPDF: action.payload,
        error: null,
      };
    case DOWNLOAD_PDF_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case VIEWDEALBOOK_SEARCH_REQUEST:
      return { ...state, loading: true, error: null };
    case VIEWDEALBOOK_SEARCH_SUCCESS:
      return {
        ...state,
        ViewDealBookData: action.payload.responseData || [], // Set to an empty array if responseData is falsy
        loading: false,
        error: null,
      };
    case VIEWDEALBOOK_SEARCH_FAILURE:
      return {
        ...state,
        ViewDealBookData: [], // Set saleList to an empty array on failure
        loading: false,
        error: action.payload,
      };

    case DOWNLOAD_AUCTIONEER_PDF_REQUEST:
      return { ...state, loading: true, error: null };
    case DOWNLOAD_AUCTIONEER_PDF_SUCCESS:
      return {
        ...state,
        loading: false,
        AuctioneerPDFDownload: action.payload,
        error: null,
      };
    case DOWNLOAD_AUCTIONEER_PDF_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DOWNLOAD_AUCTIONEER_EXCEL_REQUEST:
      return { ...state, loading: true, error: null };
    case DOWNLOAD_AUCTIONEER_EXCEL_SUCCESS:
      return {
        ...state,
        loading: false,
        AuctioneerExcelDownload: action.payload,
        error: null,
      };
    case DOWNLOAD_AUCTIONEER_EXCEL_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DOWNLOAD_TAO_EXCEL_REQUEST:
      return { ...state, loading: true, error: null };
    case DOWNLOAD_TAO_EXCEL_SUCCESS:
      return {
        ...state,
        loading: false,
        TaoExcelDownload: action.payload,
        error: null,
      };
    case DOWNLOAD_TAO_EXCEL_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DOWNLOAD_TAO_PDF_REQUEST:
      return { ...state, loading: true, error: null };
    case DOWNLOAD_TAO_PDF_SUCCESS:
      return {
        ...state,
        loading: false,
        TaoPDFDownload: action.payload,
        error: null,
      };
    case DOWNLOAD_TAO_PDF_FAILURE:
      return { ...state, loading: false, error: action.payload };



      case VIEWDEALBOOK_LIST_REQUEST:
        return { ...state, loading: true, error: null };
      case VIEWDEALBOOK_LIST_SUCCESS:
        return {
          ...state,
          loading: false,
          ViewDealBookListData: action.payload,
          error: null,
        };
      case VIEWDEALBOOK_LIST_FAILURE:
        return { ...state, loading: false, error: action.payload };


        case VIEW_DEALBOOK_LIST_REQUEST:
          return {
            ...state,
            loading: true,
            error: null,
          };
        case VIEW_DEALBOOK_LIST_SUCCESS:
          return {
            ...state,
            ViewDealBookBuyerData:action.payload,
            loading: false,
            error: null,
          };
        case VIEW_DEALBOOK_LIST_FAILURE:
          return {
            ...state,
            loading: false,
            error: action.payload,
          };

    default:
      return state;
  }
};

export default ViewDealBook;
