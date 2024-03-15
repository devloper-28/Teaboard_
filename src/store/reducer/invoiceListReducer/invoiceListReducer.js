import * as actionTypes from "../../actionLabels/index";

const initialState = {
  downloadAllDocuments: [],
  error: null,
  bindAuctionDate: [],
  getlotnobyuserid: [],
  getinvoicenofortao: [],
  getlotnoforteaboard: [],
  getinvoicenobyuserid: [],
  bindsalenobyseason: [],
  searchinvoicelist: [],
  auctioneerData:[],
};

const getAllInvoiceList = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DOWNLOAD_ALL_DOCUMENT_SUCCESS:
      return {
        ...state,
        downloadAllDocuments: action.payload,
        error: null,
      };
    case actionTypes.DOWNLOAD_ALL_DOCUMENT_FAIL:
      return {
        ...state,
        downloadAllDocuments: [],
        error: action.payload,
      };

    case actionTypes.GET_BIND_AUCTION_DATE_SUCCESS:
      return {
        ...state,
        bindAuctionDate: action.payload,
        error: null,
      };
    case actionTypes.GET_BIND_AUCTION_DATE_FAIL:
      return {
        ...state,
        bindAuctionDate: [],
        error: action.payload,
      };

    case actionTypes.GET_GETLOTNOBYUSERID_SUCCESS:
      return {
        ...state,
        getlotnobyuserid: action.payload,
        error: null,
      };
    case actionTypes.GET_GETLOTNOBYUSERID_FAIL:
      return {
        ...state,
        getlotnobyuserid: [],
        error: action.payload,
      };

    case actionTypes.GETINVOICENOFORTAO_SUCCESS:
      return {
        ...state,
        getinvoicenofortao: action.payload,
        error: null,
      };
    case actionTypes.GETINVOICENOFORTAO_FAIL:
      return {
        ...state,
        getinvoicenofortao: [],
        error: action.payload,
      };

    case actionTypes.GETLOTNOFORTEABOARD_SUCCESS:
      return {
        ...state,
        getlotnoforteaboard: action.payload,
        error: null,
      };
    case actionTypes.GETLOTNOFORTEABOARD_FAIL:
      return {
        ...state,
        getlotnoforteaboard: [],
        error: action.payload,
      };

    case actionTypes.GETINVOICENOBYUSERID_SUCCESS:
      return {
        ...state,
        getinvoicenobyuserid: action.payload,
        error: null,
      };
    case actionTypes.GETINVOICENOBYUSERID_FAIL:
      return {
        ...state,
        getinvoicenobyuserid: [],
        error: action.payload,
      };

    case actionTypes.GETINVOICENOFORTEABOARD_SUCCESS:
      return {
        ...state,
        getinvoicenoforteaboard: action.payload,
        error: null,
      };
    case actionTypes.GETINVOICENOFORTEABOARD_FAIL:
      return {
        ...state,
        getinvoicenoforteaboard: [],
        error: action.payload,
      };
    case actionTypes.PREVIEWPDF_SUCCESS:
      return {
        ...state,
        previewpdf: action.payload,
        error: null,
      };
    case actionTypes.PREVIEWPDF_FAIL:
      return {
        ...state,
        previewpdf: [],
        error: action.payload,
      };

    case actionTypes.BINDSALENOBYSEASON_SUCCESS:
      return {
        ...state,
        bindsalenobyseason: action.payload,
        error: null,
      };
    case actionTypes.BINDSALENOBYSEASON_FAIL:
      return {
        ...state,
        bindsalenobyseason: [],
        error: action.payload,
      };

    case actionTypes.GET_SEARCHINVOICELIST_SUCCESS:
      return {
        ...state,
        searchinvoicelist: action.payload,
        error: null,
      };
    case actionTypes.GET_SEARCHINVOICELIST_FAIL:
      return {
        ...state,
        searchinvoicelist: [],
        error: action.payload,
      };
      case actionTypes.GETUSERSBYAUCTIONCENTER_SUCCESS:
        return {
          ...state,
          auctioneerData: action.payload,
          error: null,
        };
      case actionTypes.GETUSERSBYAUCTIONCENTER_FAIL:
        return {
          ...state,
          auctioneerData: [],
          error: action.payload,
        };
    default:
      return state;
  }
};
export default getAllInvoiceList;
