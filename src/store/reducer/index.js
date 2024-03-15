import { combineReducers } from "redux";

import dummyReducer from "./dummy/dummy";
import auth from "./auth/auth";
import toggle from "./toggle/toggle";
import auction from "./auction/auctionCentre";
import sale from "./sale/sale";
import teaType from "./teaType/TeaType";
import mark from "./mark/Mark";
import warehouseUser from "./warehouse/warehouse";
import grade from "./grade/Grade";
import category from "./bindCategory/bindcategory";
import invoiceDetails from "./invoice/invoice";
import kutchaCatalogueReducer from "./kutcha/kutcha";
import sessionTypesReducer from "./sessionType/SessionType";
import state from "./createStateMaster/stateReducer";
import auctionCenter from "./createAuctionCenter/auctionCenterReducer";
import teaTypeManage from "./createTeaType/teaTypeReducer";
import gradeManage from "./createGrade/gradeReducer";
import fectoryType from "./createFactory/factoryReducer";
import subTeaType from "./createSubTeaType/subTeaTypeReducer";
import role from "./createRole/roleReducer";
import categoryManage from "./createCategory/categoryReducer";
import plantation from "./createPlantation/plantationReducer";
import Revanue from "./createRevanue/revanueReducer";
import lotSeriesReducer from "./lotnoseries/lotnoseries";
import CreatedSaleNo from "./createdSaleNo/CreatedSaleNo";
import awr from "./awr/awr";
import documentReducer from "./uploadDocument/uploadDocumentReducer";
import sampleShortageReducer from "./sampleshortage/sampleshortage";
import createBankAcDetail from "./createBankAcDetail/getAllBankAcDetail";
import createTaxMaster from "./createTaxMaster/getAllTaxMaster";
import chargeCode from "./chargeCode/chargeCode";
import configParam from "./configParamReducer/configParamReducer";
import createSpu from "./createSpu/getAllSpu";
import createRegistrtion from "./createRegistration/getAllRegistration";
import warehouseUserRegistration from "./warehouseUserRegistration/warehouseUserRegistration";
import groupMaster from "./groupMaster/groupMaster";
import CreateChargeMaster from "./createChargeMaster/chargeReducer";
import createBuyer from "./createBuyerReducer/createBuyerReducer";
import User from "./userRegistration/getAllUserRegistration";
import TaoUser from "./toaUserRegistration/getAlltoaUserRegistration";
import markReducer from "./markReducer/markReducer";
import packageSizeReducer from "./packageSizeReducer/packageSizeReducer";
import packageTypeReducer from "./packageTypeReducer/packageTypeReducer";
import sellerReducer from "./seller/seller";
import ruleEngine from "./manageRuleEngine/getAllManageRuleEngine";
import auctionPage from "./auctionPage";
import getAllBankRedirectURLs from "./bankDetailsRedirectReducer/bankDetailsRedirectReducer";
import graceReducer from "./graceReducer/graceReducer";
import invoiceListReducer from "./invoiceListReducer/invoiceListReducer";
import viewBuyerTaxInvoiceReducer from "./viewBuyerTaxInvoiceReducer/viewBuyerTaxInvoiceReducer";
import generateSellerTaxInvoiceReducer from "./generateSellerTaxInvoiceReducer/generateSellerTaxInvoiceReducer";
import BuyerTaxInvoice from "./BuyerTaxInvoice/getAllBuyerTaxInvoice";
import auctionSearchBidBookReducer from "./auctionSearchBidBook/index";
import saleNoReducer from "./viewDealBook/viewDealBook";
import SellerTaxgen from "./SellerTaxGen/getAllSellerTaxGen";
import ruleEngineEng from "./ruleEngineEng/getAllRuleEngineEng";
import ChangePwd from "./ChangePwd/getAllChangePwd";
import TransferDealBookReducer from "./transferDealBookReducer/transferDealBookReducer";
import ModuleReducer from "./modules/ModuleReducer";
import WddWarehouseBillUploads from "./addWarehouseBillUploads/addWarehouseBillUploads";
import TeaBoardRegistrationNo from "./rejectWarehouseBill/rejectWarehouseBill";
import ContactLink from "./contactUsLink/getAllContactUsLink";

const allReducers = combineReducers({
  dummyReducer,
  auth,
  toggle,
  auction,
  sale,
  teaType,
  mark,
  warehouseUser,
  grade,
  category,
  invoiceDetails,
  kutchaCatalogueReducer,
  sessionTypesReducer,
  state,
  auctionCenter,
  teaTypeManage,
  gradeManage,
  fectoryType,
  subTeaType,
  role,
  categoryManage,
  plantation,
  Revanue,
  lotSeriesReducer,
  CreatedSaleNo,
  awr,
  documentReducer,
  sampleShortageReducer,
  chargeCode,
  createBankAcDetail,
  createTaxMaster,
  createSpu,
  configParam,
  createRegistrtion,
  warehouseUserRegistration,
  groupMaster,
  CreateChargeMaster,
  createBuyer,
  User,
  TaoUser,
  markReducer,
  packageSizeReducer,
  packageTypeReducer,
  sellerReducer,
  ruleEngine,
  auctionPage,
  graceReducer,
  getAllBankRedirectURLs,
  invoiceListReducer,
  viewBuyerTaxInvoiceReducer,
  generateSellerTaxInvoiceReducer,
  BuyerTaxInvoice,
  auctionSearchBidBookReducer,
  saleNoReducer,
  SellerTaxgen,
  ruleEngineEng,
  ChangePwd,
  TransferDealBookReducer,
  ModuleReducer,
  WddWarehouseBillUploads,
  TeaBoardRegistrationNo,
  ContactLink,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }
  return allReducers(state, action);
};

export default rootReducer;
