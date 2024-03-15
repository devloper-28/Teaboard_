import { takeLatest, put, call, all } from "redux-saga/effects";
import * as allActions from "../../actions";
import axiosMain from "../../../http/axios/axios_main";
import * as labels from "../../actionLabels";


function* downloadAllDocumentSagas(action) {
    
  try {
    const response = yield call(
      axiosMain.get,
      "postauction/invoiceList/downloadAllPdf/"+action.payload.commaseprateddata+"/"+action.payload.userCode,
    );
    if (response.status == 200) {
        //CustomToast.success(response.data.message);
        yield put(allActions.downloadAllDocumentSuccess(response.data));
      
    } else {
      yield put(
        allActions.downloadAllDocumentFail(
          response.data.message || "Unknown error occurred."
        )
      );
    }
  } catch (error) {
    yield put(
      allActions.getMarkFail(error.message || "Unknown error occurred.")
    );
  }
  }
  function* bindAuctionDateSagas(action) {
    try {
        const response = yield call(
          axiosMain.post,
          "/preauction/Common/BindAuctionDate",
          action.payload
        );
        if (response.status == 200) {
          if (response.data.statusCode == 200) {
            yield put(allActions.bindAuctionDateSuccesss(response.data));
          } else {
            yield put(allActions.bindAuctionDateFail(response.data.message));
          }
        } else {
          yield put(
            allActions.bindAuctionDateFail(
              response.data.message || "Unknown error occurred."
            )
          );
        }
      } catch (error) {
        yield put(
          allActions.bindAuctionDateFail(error.message || "Unknown error occurred.")
        );
      }
  }
  
  function* getLotNoForTaoSagas(action) {
    try {
        const response = yield call(
          axiosMain.get,
          "/postauction/invoiceList/getLotNoForTao/"+action.payload.auctionCentre+"/"+action.payload.userid,
        );
        if (response.status == 200) {
          if (response.data.statusCode == 200) {
            yield put(allActions.getlotnobyuseridSuccess(response.data));
          } else {
            yield put(allActions.getlotnobyuseridFail(response.data.message));
          }
        } else {
          yield put(
            allActions.getlotnobyuseridFail(
              response.data.message || "Unknown error occurred."
            )
          );
        }
      } catch (error) {
        yield put(
          allActions.getlotnobyuseridFail(error.message || "Unknown error occurred.")
        );
      }
  }
  function* getlotnobyuseridSagas(action) {
    try {
        const response = yield call(
          axiosMain.get,
          "/postauction/invoiceList/getLotNoByUserId/"+action.payload,
        );
        if (response.status == 200) {
          if (response.data.statusCode == 200) {
            yield put(allActions.getlotnobyuseridSuccess(response.data));
          } else {
            yield put(allActions.getlotnobyuseridFail(response.data.message));
          }
        } else {
          yield put(
            allActions.getlotnobyuseridFail(
              response.data.message || "Unknown error occurred."
            )
          );
        }
      } catch (error) {
        yield put(
          allActions.getlotnobyuseridFail(error.message || "Unknown error occurred.")
        );
      }
  }
  function* getinvoicenofortaoSagas(action) {
    try {
        const response = yield call(
          axiosMain.get,
          "/postauction/invoiceList/getInvoiceNoForTao/"+action.payload.auctionCentre+"/"+action.payload.id,
        );
        if (response.status == 200) {
          if (response.data.statusCode == 200) {
            yield put(allActions.getinvoicenobyuseridSuccess(response.data));
          } else {
            yield put(allActions.getinvoicenobyuseridFail(response.data.message));
          }
        } else {
          yield put(
            allActions.getinvoicenobyuseridFail(
              response.data.message || "Unknown error occurred."
            )
          );
        }
      } catch (error) {
        yield put(
          allActions.getinvoicenobyuseridFail(error.message || "Unknown error occurred.")
        );
      }
  }
  function* getlotnoforteaboardSagas() {
    try {
        const response = yield call(
          axiosMain.get,
          "/postauction/invoiceList/getLotNoForTeaBoard",
        );
        if (response.status == 200) {
          if (response.data.statusCode == 200) {
            yield put(allActions.getlotnobyuseridSuccess(response.data));
          } else {
            yield put(allActions.getlotnobyuseridFail(response.data.message));
          }
        } else {
          yield put(
            allActions.getlotnobyuseridFail(
              response.data.message || "Unknown error occurred."
            )
          );
        }
      } catch (error) {
        yield put(
          allActions.getlotnobyuseridFail(error.message || "Unknown error occurred.")
        );
      }
  }
  function* getinvoicenobyuseridSagas(action) {
    try {
        const response = yield call(
          axiosMain.get,
          "/postauction/invoiceList/getInvoiceNoByUserId/"+action.payload,
        );
        if (response.status == 200) {
          if (response.data.statusCode == 200) {
            yield put(allActions.getinvoicenobyuseridSuccess(response.data));
          } else {
            yield put(allActions.getinvoicenobyuseridFail(response.data.message));
          }
        } else {
          yield put(
            allActions.getinvoicenobyuseridFail(
              response.data.message || "Unknown error occurred."
            )
          );
        }
      } catch (error) {
        yield put(
          allActions.getinvoicenobyuseridFail(error.message || "Unknown error occurred.")
        );
      }
  }
  function* getinvoicenoforteaboardSagas(action) {
    try {
        const response = yield call(
          axiosMain.get,
          "/postauction/invoiceList/getInvoiceNoForTeaBoard/"+action.payload.auctionCentre+"/"+action.payload.id,
        );
        if (response.status == 200) {
          if (response.data.statusCode == 200) {
            yield put(allActions.getinvoicenobyuseridSuccess(response.data));
          } else {
            yield put(allActions.getinvoicenobyuseridFail(response.data.message));
          }
        } else {
          yield put(
            allActions.getinvoicenobyuseridFail(
              response.data.message || "Unknown error occurred."
            )
          );
        }
      } catch (error) {
        yield put(
          allActions.getinvoicenobyuseridFail(error.message || "Unknown error occurred.")
        );
      }
  }
  function* previewPdfSagas(action) {
    try {
        const response = yield call(
          axiosMain.get,
          "/postauction/invoiceList/previewPdf/"+action.payload.invoiceNo+"/"+action.payload.role,
        );
        if (response.status == 200) {
            yield put(allActions.previewpdfSuccess(response.data));
          
        } else {
          yield put(
            allActions.previewpdfFail(
              response.data.message || "Unknown error occurred."
            )
          );
        }
      } catch (error) {
        yield put(
          allActions.previewpdfFail(error.message || "Unknown error occurred.")
        );
      }
  }
  function* bindsalenobyseasonSagas(action) {
    try {
        const response = yield call(
          axiosMain.post,
          "/preauction/Common/BindSaleNoBySeason",action.payload,
        );
        if (response.status == 200) {
          if (response.data.statusCode == 200) {
            yield put(allActions.bindsalenobyseasonSuccess(response.data));
          } else {
            yield put(allActions.bindsalenobyseasonFail(response.data.message));
          }
        } else {
          yield put(
            allActions.bindsalenobyseasonFail(
              response.data.message || "Unknown error occurred."
            )
          );
        }
      } catch (error) {
        yield put(
          allActions.bindsalenobyseasonFail(error.message || "Unknown error occurred.")
        );
      }
  }
  
  function* searchInvoiceListSagas(action) {
    try {
        const response = yield call(
          axiosMain.post,
          "/postauction/invoiceList/searchInvoiceList",
          action.payload
        );
        if (response.status == 200) {
          if (response.data.statusCode == 200) {
            yield put(allActions.get_searchinvoicelistSuccess(response.data));
          } else {
            yield put(allActions.get_searchinvoicelistFail(response.data.message));
          }
        } else {
          yield put(
            allActions.get_searchinvoicelistFail(
              response.data.message || "Unknown error occurred."
            )
          );
        }
      } catch (error) {
        yield put(
          allActions.get_searchinvoicelistFail(error.message || "Unknown error occurred.")
        );
      }
  }
  function* getusersbyauctioncenterSagas(action) {
    try {
        const response = yield call(
          axiosMain.post,
          "/admin/auctionCenter/dropdown/getUsersByAuctionCenter",
          action.payload
        );
        if (response.status == 200) {
          if (response.data.statusCode == 200) {
            yield put(allActions.getusersbyauctioncenter_success(response.data));
          } else {
            yield put(allActions.getusersbyauctioncenter_fail(response.data.message));
          }
        } else {
          yield put(
            allActions.getusersbyauctioncenter_fail(
              response.data.message || "Unknown error occurred."
            )
          );
        }
      } catch (error) {
        yield put(
          allActions.getusersbyauctioncenter_fail(error.message || "Unknown error occurred.")
        );
      }
  }
  // Watcher Saga: Watches for the FETCH_MARK_REQUEST action and calls the worker saga
  
  export function* invoiceListSagas() {
    yield all([
      yield takeLatest(labels.DOWNLOAD_ALL_DOCUMENT, downloadAllDocumentSagas),
      yield takeLatest(labels.GET_BIND_AUCTION_DATE, bindAuctionDateSagas),
      yield takeLatest(labels.GET_GETLOTNOBYUSERID, getlotnobyuseridSagas),
      yield takeLatest(labels.GETINVOICENOFORTAO, getinvoicenofortaoSagas),
      yield takeLatest(labels.GETLOTNOFORTEABOARD, getlotnoforteaboardSagas),
      yield takeLatest(labels.GETINVOICENOBYUSERID, getinvoicenobyuseridSagas),
      yield takeLatest(labels.GETINVOICENOFORTEABOARD, getinvoicenoforteaboardSagas),
      yield takeLatest(labels.PREVIEWPDF, previewPdfSagas),
      yield takeLatest(labels.BINDSALENOBYSEASON, bindsalenobyseasonSagas),
      yield takeLatest(labels.GET_SEARCHINVOICELIST, searchInvoiceListSagas),
      yield takeLatest(labels.GET_GETLOTNOFORTAO,getLotNoForTaoSagas),
      yield takeLatest(labels.GETUSERSBYAUCTIONCENTER ,getusersbyauctioncenterSagas),
    ]);
  }
  
  export default invoiceListSagas;