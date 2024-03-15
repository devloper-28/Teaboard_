 // sagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { ViewDealBookFailure, ViewDealBookListFailure, ViewDealBookListSuccess, ViewDealBookSuccess, bindAuctionDateFailure, bindAuctionDateSuccess, bindAuctioneerFailure, bindAuctioneerSuccess, bindLoatNoFailure, bindLoatNoSuccess, bindSaleNoFailure, bindSaleNoSuccess, bindSessionTimeFailure, bindSessionTimeSuccess, downloadAuctioneerExcelFailure, downloadAuctioneerExcelSuccess, downloadAuctioneerPDFFailure, downloadAuctioneerPDFSuccess, downloadExcelFailure, downloadExcelSuccess, downloadPDFFailure, downloadPDFRequest, downloadPDFSuccess, downloadTaoExcelFailure, downloadTaoExcelSuccess, downloadTaoPDFFailure, downloadTaoPDFSuccess, viewDealBookListFailure, viewDealBookListSuccess } from '../../actions';
import { BIND_AUCTIONDATA_REQUEST, BIND_AUCTIONEER_REQUEST, BIND_LOATNO_REQUEST, BIND_SALE_NO_REQUEST, BIND_SESSIONTIME_REQUEST, DOWNLOAD_AUCTIONEER_EXCEL_REQUEST, DOWNLOAD_AUCTIONEER_PDF_REQUEST, DOWNLOAD_EXCEL_REQUEST, DOWNLOAD_PDF_REQUEST, DOWNLOAD_TAO_EXCEL_REQUEST, DOWNLOAD_TAO_PDF_REQUEST, VIEWDEALBOOK_LIST_REQUEST, VIEWDEALBOOK_SEARCH_REQUEST, VIEW_DEALBOOK_LIST_REQUEST } from '../../actionLabels';
import axiosMain from '../../../http/axios/axios_main';
import CustomToast from '../../../components/Toast';


function* bindSaleNo(action) {
  try {    
    const response = yield call(axiosMain.post, '/preauction/Common/BindSaleNoBySeason', action.payload);
    if (response.status === 200) {
      if (response.data.statusCode === 200) {
        yield put(bindSaleNoSuccess(response.data));
      } else {       
        yield put(bindSaleNoFailure(response.data.message));
        // CustomToast.error(response.data.message);
      }
    } else {       
      yield put(bindSaleNoFailure('Failed to fetch sale numbers.'));
    }
  } catch (error) {
     
    yield put(bindSaleNoFailure(error.message));
  }
}
function* bindAuctionDate(action) {
  try {    
    const response = yield call(axiosMain.post, '/preauction/Common/GetSaleProgramDetails', action.payload);
    if (response.status === 200) {
      if (response.data.statusCode === 200) {
        yield put(bindAuctionDateSuccess(response.data));
        // CustomToast.success(response.data.message);
      } else {       
        yield put(bindAuctionDateFailure(response.data.message));
        // CustomToast.error(response.data.message);
      }
    } else {
       
      yield put(bindAuctionDateFailure('Failed to fetch sale numbers.'));
    }
  } catch (error) {
     
    yield put(bindAuctionDateFailure(error.message));
  }
}
function* bindLoatNo(action) {
  try {    
    const response = yield call(axiosMain.post, '/postauction/dealbook/getlotnobysaleandseason', action.payload);
    if (response.status === 200) {
      if (response.data.statusCode === 200) {
        yield put(bindLoatNoSuccess(response.data));
        // CustomToast.success(response.data.message);
      } else {       
        yield put(bindLoatNoFailure(response.data.message));
        // CustomToast.error(response.data.message);
      }
    } else {
       
      yield put(bindLoatNoFailure('Failed to fetch sale numbers.'));
    }
  } catch (error) {
     
    yield put(bindLoatNoFailure(error.message));
  }
}
function* bindSessionTime(action) {
  try {    
    const response = yield call(axiosMain.post, '/preauction/Common/BindSessionTime', action.payload);
    if (response.status === 200) {
      if (response.data.statusCode === 200) {
        yield put(bindSessionTimeSuccess(response.data));
        // CustomToast.success(response.data.message);
      } else {       
        yield put(bindSessionTimeFailure(response.data.message));
        // CustomToast.error(response.data.message);
      }
    } else {       
      yield put(bindSessionTimeFailure('Failed to fetch sale numbers.'));
    }
  } catch (error) {     
    yield put(bindSessionTimeFailure(error.message));
  }
}
function* bindAuctioneer(action) {
  try {    
    const response = yield call(axiosMain.post, '/admin/getAllUser/search', action.payload);
    if (response.status === 200) {
      if (response.data.statusCode === 200) {
        yield put(bindAuctioneerSuccess(response.data));
        // CustomToast.success(response.data.message);
      } else {       
        yield put(bindAuctioneerFailure(response.data.message));
        CustomToast.error(response.data.message);
      }
    } else {
       
      yield put(bindAuctioneerFailure('Failed to fetch sale numbers.'));
    }
  } catch (error) {
     
    yield put(bindAuctioneerFailure(error.message));
  }
}
 

function* downloadExcelSaga(action) {
  try {    
    const response = yield call(axiosMain.post, '/postauction/dealbook/buyer/search', action.payload);
    if (response.status === 200) {
      if (response.data.statusCode === 200) {
         
        yield put(downloadExcelSuccess(response.data.responseData.exported_file));
        CustomToast.success(response.data.message);
      } else {       
        yield put(downloadExcelFailure(response.data.message));
        CustomToast.error(response.data.message);
      }
      
    } else {
       
      yield put(downloadExcelFailure('Failed to fetch sale numbers.'));
    }
  } catch (error) {
     
    yield put(downloadExcelFailure(error.message));
  }
}


function* downloadPDFSaga(action) {
  try {    
    const response = yield call(axiosMain.post, '/postauction/dealbook/buyer/search', action.payload);
    if (response.status === 200 && response.data.statusCode === 200) {
      yield put(downloadPDFSuccess(response.data.responseData.exported_file));
      CustomToast.success(response.data.message);
    } else {       
      yield put(downloadPDFFailure(response.data.message || 'Failed to fetch PDF.'));
      CustomToast.error(response.data.message || 'Failed to fetch PDF.');
    }
  } catch (error) {
    yield put(downloadPDFFailure(error.message || 'Failed to fetch PDF.'));
  }
}

function* downloadAuctioneerExcelSaga(action) {
  try {    
    const response = yield call(axiosMain.post, '/postauction/dealbook/buyer/search', action.payload);
    if (response.status === 200) {
      if (response.data.statusCode === 200) {         
        yield put(downloadAuctioneerExcelSuccess(response.data.responseData.exported_file));
        CustomToast.success(response.data.message);
      } else {       
        yield put(downloadAuctioneerExcelFailure(response.data.message));
        CustomToast.error(response.data.message);
      }      
    } else {       
      yield put(downloadAuctioneerExcelFailure('Failed to fetch sale numbers.'));
    }
  } catch (error) {     
    yield put(downloadAuctioneerExcelFailure(error.message));
  }
}


function* downloadAuctioneerPDFSaga(action) {
  try {    
    const response = yield call(axiosMain.post, '/postauction/dealbook/auctioneer/search', action.payload);
    if (response.status === 200 && response.data.statusCode === 200) {
      yield put(downloadAuctioneerPDFSuccess(response.data.responseData.exported_file));
      CustomToast.success(response.data.message);
    } else {       
      yield put(downloadAuctioneerPDFFailure(response.data.message || 'Failed to fetch PDF.'));
      CustomToast.error(response.data.message || 'Failed to fetch PDF.');
    }
  } catch (error) {
    yield put(downloadAuctioneerPDFFailure(error.message || 'Failed to fetch PDF.'));
  }
}


function* downloadTaoExcelSaga(action) {
  try {    
    const response = yield call(axiosMain.post, '/postauction/dealbook/search', action.payload);
    if (response.status === 200) {
      if (response.data.statusCode === 200) {         
        yield put(downloadTaoExcelSuccess(response.data.responseData.exported_file));
        CustomToast.success(response.data.message);
      } else {       
        yield put(downloadTaoExcelFailure(response.data.message));
        CustomToast.error(response.data.message);
      }      
    } else {       
      yield put(downloadTaoExcelFailure('Failed to fetch sale numbers.'));
    }
  } catch (error) {     
    yield put(downloadTaoExcelFailure(error.message));
  }
}


function* downloadTaoPDFSaga(action) {
  try {    
    const response = yield call(axiosMain.post, '/postauction/dealbook/search', action.payload);
    if (response.status === 200 && response.data.statusCode === 200) {
      yield put(downloadTaoPDFSuccess(response.data.responseData.exported_file));
      CustomToast.success(response.data.message);
    } else {       
      yield put(downloadTaoPDFFailure(response.data.message || 'Failed to fetch PDF.'));
      CustomToast.error(response.data.message || 'Failed to fetch PDF.');
    }
  } catch (error) {
    yield put(downloadTaoPDFFailure(error.message || 'Failed to fetch PDF.'));
  }
}


function* SearchViewDealBook(action) {
  try {
    const response = yield call(axiosMain.post, '/postauction/dealbook/auctioneer/search', action.payload);
    if (response.status === 200 && response.data.statusCode === 200) {
      yield put(downloadAuctioneerPDFSuccess(response.data.responseData));
      CustomToast.success(response.data.message);
    } else {
      yield put(downloadAuctioneerPDFFailure(response.data.message || 'Failed to fetch PDF.'));
      console.log(response.data.responseData);
      CustomToast.error(response.data.message || 'Failed to fetch PDF.');
    }
  } catch (error) {
    yield put(downloadAuctioneerPDFFailure(error.message || 'Failed to fetch PDF.'));
  }
}


function* SearchViewDealBookList(action) {
  try {
    const response = yield call(axiosMain.post, '/postauction/dealbook/auctioneer/search', action.payload);
    if (response.status === 200 && response.data.statusCode === 200) {
      yield put(ViewDealBookListSuccess(response.data.responseData));
      console.log(response.data.responseData,'response.data.responseData')
      CustomToast.success(response.data.message);
    } else {
      yield put(ViewDealBookListFailure(response.data.message || 'Failed to fetch PDF.'));
      console.log(response.data.responseData);
      CustomToast.error(response.data.message || 'Failed to fetch PDF.');
    }
  } catch (error) {
    yield put(ViewDealBookListFailure(error.message || 'Failed to fetch PDF.'));
  }
}

function* fetchViewDealBookList(action) {
  try {
    const response = yield call(axiosMain.post, '/postauction/dealbook/buyer/search', action.payload);
    if (response.status === 200 && response.data.statusCode === 200) {
      yield put(viewDealBookListSuccess(response.data.responseData));
      console.log(response.data.responseData,'response.data.responseData')
      CustomToast.success(response.data.message);
    } else {
      yield put(viewDealBookListFailure(response.data.message || 'Failed to fetch PDF.'));
      console.log(response.data.responseData);
      CustomToast.error(response.data.message || 'Failed to fetch PDF.');
    }
  } catch (error) {
    yield put(viewDealBookListFailure(error.message || 'Failed to fetch PDF.'));
  }
}


 
function* ViewDealBookSaga() {
  yield takeLatest(BIND_SALE_NO_REQUEST, bindSaleNo);
  yield takeLatest(BIND_AUCTIONDATA_REQUEST, bindAuctionDate);
  yield takeLatest(BIND_LOATNO_REQUEST, bindLoatNo);
  yield takeLatest(BIND_SESSIONTIME_REQUEST, bindSessionTime);
  yield takeLatest(BIND_AUCTIONEER_REQUEST, bindAuctioneer);
  yield takeLatest(DOWNLOAD_EXCEL_REQUEST, downloadExcelSaga);
  yield takeLatest(DOWNLOAD_PDF_REQUEST, downloadPDFSaga);
  yield takeLatest(DOWNLOAD_AUCTIONEER_PDF_REQUEST, downloadAuctioneerPDFSaga);
  yield takeLatest(VIEWDEALBOOK_SEARCH_REQUEST, SearchViewDealBook);
  yield takeLatest(DOWNLOAD_AUCTIONEER_EXCEL_REQUEST, downloadAuctioneerExcelSaga);
  yield takeLatest(DOWNLOAD_TAO_PDF_REQUEST, downloadTaoPDFSaga);
  yield takeLatest(DOWNLOAD_TAO_EXCEL_REQUEST, downloadTaoExcelSaga);
  yield takeLatest(VIEWDEALBOOK_LIST_REQUEST, SearchViewDealBookList);
  yield takeLatest(VIEW_DEALBOOK_LIST_REQUEST, fetchViewDealBookList);
}

export default ViewDealBookSaga;
