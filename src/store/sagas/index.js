/* eslint-disable import/prefer-default-export */
import { all } from "redux-saga/effects";

import dummySagas from "./dummy/dummy";
import authSagas from "./auth/auth";
import toggleSaga from "./toggle/toggle";
import auctionCenterRootSagas from "./auction/auction";
import saleSagas from "./sale/sale";
import teaType from "./teaType/TeaType";
import { watchFetchGrade } from "./grade/Grade";
import { watchFetchWarehouseUser } from "./warehouse/warehouse";
import {
  watchFetchCategory,
  watchFetchCategoryById,
} from "./bindCategory/bindcategory";
import {
  watchAddInvoiceDetails,
  watchDeleteInvoiceDetails,
  watchFetchInvoiceDetails,
  watchFetchInvoiceDetailsById,
  watchUpdateInvoiceDetails,
} from "./invoice/invoice";
import watchFetchKutchaCatalogue from "./kutcha/kutcha";
import sessionTypesSaga from "./sessiontype/sessiontype";
import awrSaga from "./awr/awr";
import markData from "./mark/Mark";
import { allAuctionCenterSaga } from "./createAuctionCenter/auctionCenterSagas";
import { TeaTypesSaga } from "./createTeaType/teatypeSagas";
import { gradeSagas } from "./createGrade/gradeSagas";
import { factorysSagas } from "./createFactory/factorySagas";
import { subTeaTypesSaga } from "./createSubTeaType/subTeaTypeSagas";
import { roleSaga } from "./createRole/roleSagas";
import { categorysSaga } from "./createCategory/categorySagas";
import { plantationSaga } from "./createPlantation/plantationSagas";
import { revanueSaga } from "./createRevanue/revanueSagas";
import { stateSaga } from "./createStateMaster/stateSagas";
import watchLotNotSeriesSaga from "./lotnoseries/lotnoseries";
import createdSaleNo from "./createdSaleNo/CreatedSaleNo";
import { documentSaga } from "./uploadDocument/uploadDocumentSagas";
import sampleshortagesaga from "./sampleshortage/sampleshortage";
import { getAllchargeCodesSaga } from "./chargeCode/chargeCode";
import { BankAcsSaga } from "./createBankAcDetail/getAllBankAcDetail";
import { TaxMastersSaga } from "./createTaxMaster/getAllTaxMaster";
import { SpusSaga } from "./createSpu/getAllSpu";
import { configParamSagas } from "./configParamSagas/configParamSagas";
import { UsersSaga } from "./createRegistration/getAllRegistration";
import warehouseUserRegistration from "./warehouseUserRegistration/warehouseUserRegistration";
import { watchFetchGroups } from "./groupMaster/groupMaster";
import chargeSaga from "./createChargeMaster/chargeSaga";
import { BuyerSagas } from "./createBuyerSagas/createBuyerSagas";
import { UserSaga } from "./userRegistration/getAllUserRegistration";
import { TaoUserSaga } from "./toaUserRegistration/getAlltoaUserRegistration";
import { MarkSagas } from "./markSagas/markSagas";
import { packageSizeSagas } from "./packageSizeSagas/packageSizeSagas";
import { packageTypeSagas } from "./packageTypeSagas/packageTypeSagas";
import sellerRegistration from "./seller/seller";
import { ruleEngineSagas } from "./manageRuleEngine/getAllManageRuleEngine";
import auctionPageSagas from "./auctionPage";
import { GraceSagas } from "./graceSagas/graceSagas";
import { getAllbankredirectSagas } from "./bankredirectSagas/bankredirectSagas";
import { allTaxInvoiceSaga } from "./BuyerTaxInvoice/getAllBuyerTaxInvoice";
import { auctionSearchBidBookSagas } from "./auctionSearchBidBook/index";
import ViewDealBookSaga, {
  watchFetchSaleNoData,
} from "./viewDealBook/viewDealBook";
import { allSellerTaxGenInvoiceSaga } from "./SellerTaxGen/getAllSellerTaxGen";
import { ruleEngineEngSagas } from "./ruleEngineEng/getAllRuleEngineEng";

import { invoiceListSagas } from "./invoiceListSagas/invoiceListSagas";
import { invoiceSearchSagas } from "./viewBuyerTaxInvoiceSagas/viewBuyerTaxInvoicesagas";
import { generateSellerTaxInvoiceSagas } from "./generateSellerTaxInvoiceSagas/generateSellerTaxInvoiceSagas";
import { ChangePwdsSaga } from "./ChangePwd/getAllChangePwd";
import watchTransferDealBook from "./transferDealBookReducer/transferDealBookReducer";
import userRightsSaga from "./modules/modulsSaga";
import WarehouseBillUpload from "./addWarehouseBillUploads/addWarehouseBillUploads";
import rejectWarehouseBill from "./rejectWarehouseBill/rejectWarehouseBill";
import { allContactLinkSaga } from "./contactUsLink/getAllContactUsLink";

export default function* rootSaga() {
  yield all([
    dummySagas(),
    authSagas(), 
    toggleSaga(),
    auctionCenterRootSagas(),
    saleSagas(),
    teaType(),
    markData(),
    watchFetchWarehouseUser(),
    watchFetchGrade(),
    watchFetchCategory(),
    watchFetchInvoiceDetails(),
    watchFetchInvoiceDetailsById(),
    watchAddInvoiceDetails(),
    watchUpdateInvoiceDetails(),
    watchDeleteInvoiceDetails(),
    watchFetchCategoryById(),
    watchFetchKutchaCatalogue(),
    sessionTypesSaga(),
    awrSaga(),
    watchLotNotSeriesSaga(),
    sampleshortagesaga(),
    createdSaleNo(),
    watchFetchGroups(),
    getAllchargeCodesSaga(),
    configParamSagas(),
    BankAcsSaga(),
    TaxMastersSaga(),
    SpusSaga(),
    documentSaga(),
    stateSaga(),
    allAuctionCenterSaga(),
    TeaTypesSaga(),
    gradeSagas(),
    factorysSagas(),
    subTeaTypesSaga(),
    roleSaga(),
    categorysSaga(),
    plantationSaga(),
    revanueSaga(),
    UsersSaga(),
    BuyerSagas(),
    MarkSagas(),
    packageSizeSagas(),
    packageTypeSagas(),
    warehouseUserRegistration(),
    chargeSaga(),
    UserSaga(),
    TaoUserSaga(),
    sellerRegistration(),
    ruleEngineSagas(),
    auctionPageSagas(),
    GraceSagas(),
    getAllbankredirectSagas(),
    invoiceListSagas(),
    invoiceSearchSagas(),
    generateSellerTaxInvoiceSagas(),
    allTaxInvoiceSaga(),
    auctionSearchBidBookSagas(),
    ViewDealBookSaga(),
    allSellerTaxGenInvoiceSaga(),
    ruleEngineEngSagas(),
    ChangePwdsSaga(),
    watchTransferDealBook(),
    WarehouseBillUpload(),
    rejectWarehouseBill(),
    userRightsSaga(),
    allContactLinkSaga(),
  ]);
}
