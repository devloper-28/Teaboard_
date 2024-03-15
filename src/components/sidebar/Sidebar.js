import React, { useEffect, useState } from "react";
import SidebarContant from "./sidebarcontent/SidebarContant";
import AccordionItem from "../accordian/AccordianItem";
import { useSelector } from "react-redux";
import { FILE_ICON } from "../../assets/images/index";

//All Modals

import SaleProgram from "../../pages/allModals/saleprogram/SaleProgram";
import Invoice from "../../pages/allModals/invoice/Invoice";
import CreateAuctionCenterModal from "../../pages/createAuctionCenter/CreateAuctionCenterModal";
import CreateStateMasterModal from "../../pages/createStateMaster/CreateStateMasterModal";
import Awr from "../../pages/allModals/awr/AWR";
import KutchCatalog from "../../pages/allModals/kutchacatalog/KutchaCatalog";
import LotNoSeries from "../../pages/allModals/lotnoseries/LotNoSeries";
import SampleShortage from "../../pages/allModals/sampleshortage/SampleShortage";
import AuctionSession from "../../pages/allModals/auctionSesson/AuctionSession";
import AuctionCatalog from "../../pages/allModals/auctioncatalog/AuctionCatalog";
import CreateCategoryModal from "../../pages/createCategory/CreateCategoryModal";
import CreateTeaTypeModal from "../../pages/createTeaType/CreateTeaTypeModal";
import CreateSubTeaTypeModal from "../../pages/createSubTeaType/CreateSubTeaTypeModal";
import CreatePlantationDistrictMasterModal from "../../pages/createPlantationDistrictMaster/CreatePlantationDistrictMasterModal";
import CreateRevenueDistrictMasterModal from "../../pages/createRevenueDistrictMaster/CreateRevenueDistrictMasterModal";
import CreateGradeModal from "../../pages/createGrade/CreateGradeModal";
import CreateFactoryTypeModal from "../../pages/createFactoryType/CreateFactoryTypeModal";
import CreateRoleModal from "../../pages/createRole/CreateRoleModal";
import ChargeCodeModal from "../../pages/chargeCode/chargeCodeModal";
import CreateBankAccountDetailModal from "../../pages/createBankAccountDetail/createBankAccountDetailModal";
import CreateTaxMasterModal from "../../pages/createTaxMaster/createTaxMasterModal";
import CreateSpuMasterDetailModal from "../../pages/createSpuMaster/createSpuMasterModal";
import CreateConfigureParameterModal from "../../pages/CreateConfigureParameter/CreateConfigureParameterModal";
import AuctioneerUserRegistrationModal from "../../pages/RegisterUser/RegisterUserModal";
import WarehouseUserRegistrationModal from "../../pages/RegisterUser/RegisterUserModal";
import RegisterUser from "../../pages/RegisterUser/RegisterUser";
import RegisterUserModal from "../../pages/RegisterUser/RegisterUserModal";
import WarehouseUserRegistration from "../../pages/RegisterUser/WarehouseUserRegistration/WarehouseUserRegistration";
import GroupMaster from "../../pages/allModals/groupMaster/GroupMaster";
import CreateChargeMasterModal from "../../pages/createChargeMaster/CreateChargeMasterModal";
import MaxBidEntry from "../../pages/allModals/maxBidEntry/MaxBidEntry";
import BusinessRule from "../../pages/allModals/businessRule/BusinessRule";
import PreAuctionStatusReport from "../../pages/allModals/preAuctionStatusReport/PreAuctionStatusReport";
import TeaQualityReport from "../../pages/allModals/teaQualityReport/TeaQualityReport";
// import UserRegistrationModel from "../../pages/UserRegistration/UserRegistrationModel";
// import ToaUserRegistrationModel from "../../pages/createToaUserRegistration/CreateToaUserRegistrationModel";
// import CreateRegistration from "../../pages/createRegistration/CreateRegistration";
import PrsAuctionCatalogBuyer from "../../pages/allModals/prsAuctionCatalogBuyer/PrsAuctionCatalogBuyer";
// import PrsAuctionCatalog from "../../pages/allModals/PRSAuctioncatalog/PrsAuctionCatalog";
import { Accordion } from "@mui/material";
// import PrsAuctionCatalog from "../../pages/allModals/prsAuctioncatalog/PrsAuctionCatalog";
import PrsAuctionCatalog from "../../pages/allModals/prsAuctionCatalog/PrsAuctionCatalog";
import SaleProgramBuyerSallerReport from "../../pages/allModals/saleProgramBuyerSaller/SaleProgramBuyerSallerReport";

// import BuyerRegistration from "../../pages/BuyerRegistration/BuyerRegistration";
import CreateMarkModel from "../../pages/createMark/CreateMarkModel";
import CreatepackageSizeModal from "../../pages/CreatePackageSize/CreatepackageSizeModal";
import CreatepackageTypeModal from "../../pages/CreatePackageType/CreatepackageTypeModal";
import { useDispatch } from "react-redux";
// import viewDealBookModal from "../../pages/PostAuction/viewDealBook/viewDealBookModal";
import AuctionSessionBuyerSallerReport from "../../pages/allModals/auctionSessionBuyerSeller/AuctionSessionBuyerSallerReport";
import ViewDealBookModal from "../../pages/PostAuction/viewDealBook/viewDealBookModal";
import InvoiceListModal from "../../pages/invoiceList/invoiceListModal";

import SellerTaxInvoice from "../../pages/SellerTaxInvoice/SellerTaxInvoiceModel";
import ViewBuyerTaxInvoice from "../../pages/viewBuyerTaxInvoice/viewBuyerTaxInvoiceModal";
import GenerateSellerTaxInvoiceModal from "../../pages/generateSellerTaxInvoice/generateSellerTaxInvoiceModal";
import ReportTest1 from "../../pages/Reports/test1/ReportTest1";
import ReportTest2 from "../../pages/Reports/test2/ReportTest2";
import ReportTest3 from "../../pages/Reports/test3/ReportTest3";
import ReportTest4 from "../../pages/Reports/test4/ReportTest4";
import CreateGraceModal from "../../pages/CreateGrace/CreateGraceModal";
import TaxInvoice from "../../pages/BuyerTaxInvoice/BuyerTaxInvoiceModel";
import IndividualTaxInvoice from "../../pages/IndividualTaxInvoice/IndividualTaxInvoiceModel";
import {
  fetchUserRightsRequest,
  getBankRedirectUrl,
} from "../../store/actions";
import TransferDealBookModal from "../../pages/PostAuction/transferDealBook/transferDealBookModal";
import DeliveryInstructionAdviceModal from "../../pages/PostAuction/deliveryInstructionAdvice/deliveryInstructionAdviceModal";
import AuctionSearchBidBookModal from "../../pages/auctionSearchBidBook/AuctionSearchBidBookModal";
import RuleEngineEng from "../../pages/ruleEngineEng/RuleEngineEngModel";
import ChangePwd from "../../pages/ChangePwd/ChangePwdModel";
import AddWarehouseBillUploads from "../../pages/PostAuction/addWarehouseBillUploads/addWarehouseBillUploadsModal";
// import AddWarehouseBillUploadsModal from "../../pages/PostAuction/addWarehouseBillUploads/addWarehouseBillUploadsModal";
import ManageRolesModal from "../../pages/manageRoles/ManageRolesModal";
import { useAuctionDetail } from "../common/AunctioneerDeteailProvider";
import AddWarehouseBillUploadsModal from "../../pages/Warehouse/addWarehouseBillUploads/addWarehouseBillUploadsModal";
import RejectWarehouseBillModal from "../../pages/Warehouse/rejectWarehouseBill/rejectWarehouseBillModal";
import Profileupdatelink from "../../pages/profileupdatelink/profileupdatelink";
import ContactLinkModel from "../../pages/ContactUs/ContactModel";
import SupportLinkModel from "../../pages/SuppurtLink/SupportModel";

function Sidebar() {
  const [expandedTab, setExpandedTab] = useState("Master");
  const [modalNames, setModalNames] = useState("");
  const [modalRight, setModalRight] = useState([]);
  const [moduleLists, setMduleList] = useState([]);

  const userRole = atob(sessionStorage.getItem("argument6"));
  const activeClass = useSelector((state) => state.toggle.activeClass);
  const moduleList = useSelector(
    (state) => state?.ModuleReducer?.data?.responseData
  );
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    auction, 
    roleCode,
  } = useAuctionDetail();

  console.log(moduleList, "moduleList");
  const contant = SidebarContant?.filter((ele) => ele.show == true);

  const filteredSidebarData = SidebarContant.map((section) => {
    if (Array.isArray(section.content)) {
      section.content = section.content.filter(
        (item) => !item.roleCode || item.roleCode.includes(userRole)
      );
    }
    return section;
  });
  console.log(moduleList, modalRight, "modalRightmn");
  useEffect(() => {
    if (moduleList !== null && moduleList !== undefined) {
      moduleList?.auctionCentersList
        ?.map((eles) => eles.modulesDtoList)
        ?.at(0)
        .push({ moduleid: 100, linksDtoList: [{ linkId: 300, rightIds: [] }] });
      moduleList?.auctionCentersList
        ?.map((eles) => eles.modulesDtoList)
        ?.at(0)
        .push({ moduleid: 101, linksDtoList: [{ linkId: 301, rightIds: [] }] });
	  moduleList?.auctionCentersList
        ?.map((eles) => eles.modulesDtoList)
        ?.at(0)
        .push({ moduleid: 99, linksDtoList: [{ linkId: 299, rightIds: [] }] });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      console.log(
        moduleList?.auctionCentersList
          ?.map((eles) => eles.modulesDtoList)
          ?.at(0)
          .map((ele) =>
            ele.linksDtoList.map((item) =>
              [28, 27, 26, 25, 24, 23, 22, 20, 19, 18, 17, 21].includes(
                item.linkId
              )
            )
          )
          ?.at(0)
          .filter((ele) => ele)
          .includes(true),
        "moduleList?.auctionCentersList"
      );

      if (
        ["TAOUSER", "TEABOARDUSER"].includes(roleCode) &&
        moduleList?.auctionCentersList
          ?.map((eles) => eles.modulesDtoList)
          ?.at(0)
          .filter((ele) => ele.moduleid === 1).length === 0
      ) {
        moduleList?.auctionCentersList
          ?.map((eles) => eles.modulesDtoList)
          ?.at(0)
          .unshift({ moduleid: 1, linksDtoList: [] });
        setMduleList(moduleList);
      } else {
        setMduleList(moduleList);
      }
    } else {
      setMduleList([]);
    }
  }, [moduleList]);

  function findCommonModules(array1, array2) {
    return array1
      ?.map((obj1) => array2?.find((obj2) => obj2.moduleId === obj1.moduleid))
      ?.filter(Boolean);
  }
  function findCommonModulesList(array1, array2) {
    return array1
      ?.map((obj1) =>
        array2?.find(
          (obj2) =>
            obj2.moduleId === obj1.moduleid && obj2.linkId === obj1.linkId
        )
      )
      ?.filter(Boolean);
  }
  let data = moduleLists?.auctionCentersList
    ?.map((eles) => eles.modulesDtoList)
    ?.at(0)
    ?.map((ele) => ele.linksDtoList);

  // data?.push({ linkId: 100, rightIds: [] });

  const combinedArray =
    moduleLists?.auctionCentersList === null &&
    ["TAOUSER", "TEABOARDUSER"].includes(roleCode)
      ? [
          {
            show: true,
            modalName: "Utility",
            title: "Master",
            moduleId: 1,
            content: [
              {
                name: "manageRole",
                title: "Manage Roles",
                rightIds: [],
              },
            ],
          },
        ]
      : moduleLists?.auctionCentersList
          ?.map((eles) => eles.modulesDtoList)
          ?.at(0)
          .map((itemsList) => {
            let dataList = findCommonModules(
              moduleLists?.auctionCentersList
                ?.map((eles) => eles.modulesDtoList)
                ?.at(0),
              filteredSidebarData
            ).map((ele) =>
              ele.moduleId === itemsList.moduleid
                ? {
                    ...ele,
                    content: ele?.content
                      .map((itemListData, index) => {
                        return itemsList?.linksDtoList
                          ?.map((itemListss) =>
                            itemListss.linkId === itemListData.linkId
                              ? {
                                  ...itemListData,
                                  rightIds: itemListss.rightIds,
                                }
                              : ""
                          )
                          .filter((itemsListData) => itemsListData !== "");
                      })
                      .reduce((acc, cur) => acc.concat(cur), []),
                  }
                : ""
            );

            return dataList;
          })
          ?.reduce((acc, cur) => acc.concat(cur), [])
          ?.filter((ele) => ele !== "")
          ?.map((ele) =>
            ele.moduleId === 1 && ["TAOUSER", "TEABOARDUSER"].includes(roleCode)
              ? {
                  ...ele,
                  content: [
                    ...ele.content,
                    {
                      name: "manageRole",
                      title: "Manage Roles",
                      rightIds: [],
                    },
                    moduleList?.auctionCentersList
                      ?.map((eles) => eles.modulesDtoList)
                      ?.at(0)
                      .map((ele) =>
                        ele.linksDtoList?.map((item) =>
                          [
                            28, 27, 26, 25, 24, 23, 22, 20, 19, 18, 17, 21,
                          ].includes(item.linkId)
                        )
                      )
                      ?.filter((ele) => ele !== false)
                      ?.at(0)
                      ?.filter((ele) => ele)
                      ?.includes(true) && {
                      name: "registerUser",
                      title: "Register User",
                      rightIds: moduleList?.auctionCentersList
                        ?.map((eles) => eles.modulesDtoList)
                        ?.at(0)
                        ?.map((ele) =>
                          ele.linksDtoList
                            // ?.map((item) =>
                            //   [28, 27, 26, 25, 24, 23, 22, 20, 19, 18, 17,21]
                            //     ?.map((eless) => {
                            //       return eless === item.linkId
                            //         ? ele.linksDtoList
                            //         : "";
                            //     })

                            //     ?.filter((ele) => ele !== "")
                            // )
                            // ?.at(0)
                            // ?.reduce((acc, curr) => acc?.concat(curr), [])
                            ?.filter((item) =>
                              [
                                28, 27, 26, 25, 24, 23, 22, 20, 19, 18, 17, 21,
                              ]?.includes(item.linkId)
                            )
                        )
                        ?.reduce((acc, curr) => acc?.concat(curr), []),
                    },
                  ].filter(Boolean),
                }
              : ele
          );

  console.log(
    combinedArray,
    moduleList?.auctionCentersList
      ?.map((eles) => eles.modulesDtoList)
      ?.at(0)
      ?.map((ele) =>
        ele.linksDtoList?.filter((item) =>
          [28, 27, 26, 25, 24, 23, 22, 20, 19, 18, 17, 21]?.includes(
            item.linkId
          )
        )
      )
      ?.reduce((acc, curr) => acc?.concat(curr), []),
    // moduleList?.auctionCentersList
    //   ?.map((eles) => eles.modulesDtoList)
    //   ?.at(0)
    //   .map((ele, index) =>
    //     ele.moduleid === 1
    //       ? {
    //           ...ele,
    //           linksDtoList: [
    //             ...ele.linksDtoList,
    //             { linkId: 100, rightIds: [] },
    //           ],
    //         }
    //       : ""
    //   ),
    // findCommonModules(
    //   moduleLists?.auctionCentersList
    //     ?.map((eles) => eles.modulesDtoList)
    //     ?.at(0),
    //   filteredSidebarData
    // ),
    // moduleLists?.auctionCentersList
    //   ?.map((eles) => eles.modulesDtoList)
    //   ?.at(0)
    //   .map((itemsList) => {
    //     let dataList = findCommonModules(
    //       moduleLists?.auctionCentersList
    //         ?.map((eles) => eles.modulesDtoList)
    //         ?.at(0),
    //       filteredSidebarData
    //     ).map((ele) =>
    //       ele.moduleId === itemsList.moduleid
    //         ? {
    //             ...ele,
    //             content: ele?.content
    //               .map((itemListData, index) => {
    //                 return itemsList?.linksDtoList
    //                   ?.map((itemListss) =>
    //                     itemListss.linkId === itemListData.linkId
    //                       ? { ...itemListData, rightIds: itemListss.rightIds }
    //                       : ""
    //                   )
    //                   .filter((itemsListData) => itemsListData !== "");
    //               })
    //               .reduce((acc, cur) => acc.concat(cur), []),
    //           }
    //         : ""
    //     );

    //     return dataList;
    //   })
    //   ?.reduce((acc, cur) => acc.concat(cur), [])
    //   ?.filter((ele) => ele !== ""),
    // moduleLists?.auctionCentersList
    //   ?.map((eles) => eles.modulesDtoList)
    //   ?.at(0)
    //   .map((itemsList) => {
    //     let dataList = findCommonModules(
    //       moduleLists?.auctionCentersList
    //         ?.map((eles) => eles.modulesDtoList)
    //         ?.at(0),
    //       filteredSidebarData
    //     ).map((ele) =>
    //       ele.moduleId === itemsList.moduleid
    //         ? {
    //             ...ele,
    //             content: ele?.content
    //               .map((itemListData, index) => {
    //                 return itemsList?.linksDtoList
    //                   ?.map((itemListss) =>
    //                     itemListss.linkId === itemListData.linkId
    //                       ? {
    //                           ...itemListData,
    //                           rightIds: itemListss.rightIds,
    //                         }
    //                       : ""
    //                   )
    //                   .filter((itemsListData) => itemsListData !== "");
    //               })
    //               .reduce((acc, cur) => acc.concat(cur), []),
    //           }
    //         : ""
    //     );

    //     return dataList;
    //   })
    //   ?.reduce((acc, cur) => acc.concat(cur), [])
    //   ?.filter((ele) => ele !== "")
    //   ?.map((ele) =>
    //     ele.moduleId === 1 && ["TAOUSER", "TEABOARDUSER"].includes(roleCode)
    //       ? [
    //           ...ele.content,
    //           {
    //             name: "manageRole",
    //             title: "Manage Roles",
    //             rightIds: [],
    //           },
    //         ]
    //       : ""
    //   )
    //   ?.filter((ele) => ele !== ""),

    "filteredSidebarData"
  );
  const handleAccordionItemClick = (value) => {
    console.log(value, "valuevaluevaluevalue");
    if (value === expandedTab) setExpandedTab("");
    else {
      setExpandedTab(value);
    }

    // Optionally, you can call handleAccordionChange here if needed.
    // handleAccordionChange(value.title)(null, !expandedTab === value.title);
  };
  const contentExpand = combinedArray?.map((ele) => ele.title === expandedTab);
  //with manage role filter //

  // old code //
  // moduleLists?.auctionCentersList
  //   ?.map((eles) => eles.modulesDtoList)
  //   ?.at(0)
  //   .map((itemsList) => {
  //     let dataList = findCommonModules(
  //       moduleLists?.auctionCentersList
  //         ?.map((eles) => eles.modulesDtoList)
  //         ?.at(0),
  //       filteredSidebarData
  //     ).map((ele) =>
  //       ele.moduleId === itemsList.moduleid
  //         ? {
  //             ...ele,
  //             content: ele?.content
  //               .map((itemListData, index) => {
  //                 return itemsList?.linksDtoList
  //                   ?.map((itemListss) =>
  //                     itemListss.linkId === itemListData.linkId
  //                       ? {
  //                           ...itemListData,
  //                           rightIds: itemListss.rightIds,
  //                         }
  //                       : ""
  //                   )
  //                   .filter((itemsListData) => itemsListData !== "");
  //               })
  //               .reduce((acc, cur) => acc.concat(cur), []),
  //           }
  //         : ""
  //     );

  //     return dataList;
  //   })
  //   ?.reduce((acc, cur) => acc.concat(cur), [])
  //   ?.filter((ele) => ele !== "");

  const dispatch = useDispatch();
  const handleBankRedirectUrl = () => {
    console.log("Called done bank");
    dispatch({ userId: 1, walletUserCode: 23 });
  };

  console.log(
    // contentExpand?.map((ele) =>
    //   ele.moduleId === 1 && ["TAOUSER", "TEABOARDUSER"].includes(roleCode)
    //     ? {
    //         ...ele,
    //         content: [
    //           ...ele.content,
    //           {
    //             name: "manageRole",
    //             title: "Manage Roles",
    //             rightIds: [],
    //           },
    //         ],
    //       }
    //     : ele
    // ),
    combinedArray?.map((ele) =>
      ele.moduleId === 2
        ? {
            ...ele,
            content: combinedArray
              ?.filter((ele) => ele.moduleId === 2)
              ?.at(0)
              ?.content?.map((item) =>
                item.linkId === 43
                  ? { ...item, title: "Offline Bid Entry" }
                  : item
              ),
          }
        : ele
    ),

    "useruser"
  );
  return (
    <div>
      <div className={activeClass ? "active SideBar" : "SideBar "}>
        <div className="SideBar-logo">
          <img src={FILE_ICON} className="img-fluid Logo" alt="Logo" />
          <h2 className="SideBar-title">Bharat Auction</h2>
        </div>
        {/* Dynamic sidebar data */}

        {/* findCommonModules(
          moduleLists?.auctionCentersList
            ?.map((eles) => eles.modulesDtoList)
            ?.at(0),
          filteredSidebarData
        )
          ?.map((obj1) => {
            return {
              ...obj1,
              content: combinedArray?.filter((ele) => ele !== undefined),
            };
          }) */}
        {combinedArray
          ?.map((ele) =>
            ele.moduleId === 2 && auction === "ENGLISH"
              ? {
                  ...ele,
                  content: combinedArray
                    ?.filter((ele) => ele.moduleId === 2)
                    ?.at(0)
                    ?.content?.map((item) =>
                      item.linkId === 43
                        ? { ...item, title: "Offline Bid Entry" }
                        : item
                    ),
                }
              : ele
          )
          ?.map((value, index) => (
            <AccordionItem
              key={index}
              title={value.title}
              content={value.content}
              setModalNames={setModalNames}
              contentExpand={contentExpand}
              setModalRight={setModalRight}
              index={index}
              handleAccordionItemClick={handleAccordionItemClick}
            />
          ))}

        {/* Static sidebar data */}
        {/* {filteredSidebarData?.map((value, index) =>
          userRole === "TEABOARDUSER" ||
          (userRole === "TAOUSER" && value.content === "manageRole") ? (
            ""
          ) : (
            <AccordionItem
              key={index}
              title={value.title}
              content={value.content}
              setModalNames={setModalNames}
              contentExpand={contentExpand}
              index={index}
              handleAccordionItemClick={handleAccordionItemClick}
            />
          )
        )} */}
        <button
          className="LogoutBtn"
          onClick={() => {
            handleBankRedirectUrl();
          }}
        >
          Bank Button
        </button>
      </div>
      <SaleProgram
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <Invoice
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateStateMasterModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateAuctionCenterModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateCategoryModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateTeaTypeModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateSubTeaTypeModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreatePlantationDistrictMasterModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateRevenueDistrictMasterModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateGradeModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateFactoryTypeModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateRoleModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateBankAccountDetailModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateTaxMasterModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateSpuMasterDetailModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      {/* <CreateRegistration modalRight={modalRight} open={modalNames} setOpen={setModalNames} /> */}
      {/* <UserRegistrationModel modalRight={modalRight} open={modalNames} setOpen={setModalNames} />
      <ToaUserRegistrationModel modalRight={modalRight} open={modalNames} setOpen={setModalNames} /> */}
      <Awr modalRight={modalRight} open={modalNames} setOpen={setModalNames} />
      <ChargeCodeModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <SampleShortage
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <KutchCatalog
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <AuctionSession
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <LotNoSeries
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <AuctionCatalog
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <GroupMaster
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateConfigureParameterModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <RegisterUserModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      {/* <WarehouseUserRegistration modalRight={modalRight} open={modalNames} setOpen={setModalNames} /> */}
      <CreateChargeMasterModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <MaxBidEntry
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <BusinessRule
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <PreAuctionStatusReport
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <TeaQualityReport
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <PrsAuctionCatalogBuyer
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <PrsAuctionCatalog
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <SaleProgramBuyerSallerReport
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateMarkModel
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreatepackageSizeModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreatepackageTypeModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <ViewDealBookModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <InvoiceListModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <ViewBuyerTaxInvoice
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <GenerateSellerTaxInvoiceModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <TaxInvoice
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <IndividualTaxInvoice
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <RuleEngineEng
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <AuctionSessionBuyerSallerReport
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <ReportTest1
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <ReportTest2
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <ReportTest3
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <ReportTest4
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <CreateGraceModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <SellerTaxInvoice
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <TransferDealBookModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <DeliveryInstructionAdviceModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <AuctionSearchBidBookModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <ChangePwd
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <AddWarehouseBillUploadsModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <ManageRolesModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />

      <RejectWarehouseBillModal
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <Profileupdatelink
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <ContactLinkModel
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
      <SupportLinkModel
        modalRight={modalRight}
        open={modalNames}
        setOpen={setModalNames}
      />
    </div>
  );
}

export default Sidebar;
