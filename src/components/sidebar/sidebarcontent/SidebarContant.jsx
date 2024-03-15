const SidebarContant = [
  {
    show: true,
    modalName: "Utility",
    title: "Master",
    moduleId: 1,
    content: [
      // { name: "categoryMaster", title: "Category master" },
      // { name: "manufactureMapping", title: "Manufacture Mapping" },
      // { name: "gradeMaster", title: "Grade Master" },
      // { name: "markMaster", title: "Mark Master" },
      { linkId: 1, name: "createStateMaster", title: "Create State Master" },
      {
        linkId: 2,
        name: "createAuctionCenterModal",
        title: "Create Auction Center",
      },
      { linkId: 3, name: "createCategory", title: "Create Category" },
      { linkId: 4, name: "createTeaType", title: "Create Tea Type" },
      { linkId: 5, name: "createSubTeaType", title: "Create Sub Tea Type" },
      {
        linkId: 6,
        name: "createPlantationDistrictMaster",
        title: "Create Plantation District Master",
      },
      {
        linkId: 7,
        name: "createRevenueDistrictMaster",
        title: "Create Revenue District Master",
      },
      { linkId: 8, name: "createGrade", title: "Create Grade" },
      { linkId: 9, name: "createFactoryType", title: "Create Factory Type" },
      { linkId: 10, name: "createRole", title: "Create Role" },
      { linkId: 11, name: "chargeCode", title: "Charge Code" },
      { linkId: 12, name: "createChargeMaster", title: "Create Charge Master" },
      { linkId: 13, name: "createTaxMaster", title: "Create Tax Master" },
      {
        linkId: 14,
        name: "CreateConfigureParameter",
        title: "Create Configure Parameter",
      },
      { linkId: 15, name: "createSpuMaster", title: "Create Spu Master" },
      {
        linkId: 16,
        name: "createBankAccountDetail",
        title: "Create Bank Account Detail",
      },
      { name: "registerUser", title: "Register User" },
      // { name: "createRegistration", title: "AUCTIONEER Registration" },
      // { linkId: 17, name: "userRegistartion", title: "TEABOARD User Registration" },
      // { linkId: 18, name: "toauserRegistration", title: "TAO User Registration" },
      // { name: "BuyerRegistartion", title: "Buyer Registartion" },
      { linkId: 29, name: "CreateMark", title: "Create Mark" },
      { linkId: 32, name: "CreatepackageType", title: "Create Package Type" },
      { linkId: 33, name: "CreatepackageSize", title: "Create Package Size" },
      { linkId: 31, name: "ruleEngine", title: "Manage Rule Engine" },
      { linkId: 30, name: "CreateGrace", title: "Create Grace" },
      // { name: "manageRole", title: "Manage Roles" },
      // {
      //   name: "WarehouseUserRegistration",
      //   title: "Warehouse User Registration",
      // },
    ],
  },

  {
    title: "Pre-Auction",
    moduleId: 2,
    content: [
      { linkId: 34, name: "saleProgramMaster", title: "Sale Program master" },
      { linkId: 35, name: "invoice", title: "Invoice" },
      { linkId: 36, name: "awr", title: "AWR" },
      { linkId: 38, name: "lotnoseries", title: "Lot No Series" },
      { linkId: 37, name: "kutcha", title: "Kutcha Catalog" },
      { linkId: 39, name: "AuctionSession", title: "Auction Session Master" },
      { linkId: 40, name: "sampleshortage", title: "Sample & Shortage" },
      { linkId: 41, name: "auctioncatalog", title: "Auction Catalog" },
      { linkId: 51, name: "auctioncatalogBuyer", title: "Auction Catalog" },
      { linkId: 42, name: "groupMaster", title: "Group Master" },
      { linkId: 43, name: "maxBidEntry", title: "Max Bid Entry" },
      // { name: "businessRule", title: "Business Rule" },
      {
        linkId: 45,
        name: "preAuctionStatusReport",
        title: "Pre Auction Status Report",
      },
      { linkId: 46, name: "teaQualityReport", title: "Tea Quality Report" },
      {
        linkId: 47,
        name: "prsAuctionCatalogBuyer",
        title: "PRS Auction Catalog Buyer",
      },
      { linkId: 48, name: "prsAuctionCatalog", title: "PRS Auction Catalog" },
      {
        linkId: 49,
        name: "saleProgramBuyerSallerReport",
        title: "Sale Programe Buyer ",
      },
      // {linkId:43,
      //   name: "saleProgramBuyerSallerReport",
      //   title: "Sale Programe Buyer Saller Report",
      // },
      {
        linkId: 49,
        name: "auctionSessionBuyerSallerReport",
        title: "Auction Session Buyer Saller Report",
      },
      // { name: "auctionSessionBuyerSallerReport", title: "Auction Session Buyer" },
    ],
    show: true,
    modalName: "preAuction",
  },
  // {
  //   title: "Auction",
  //   content: [{ name: "auctionSearchBidBookModal", title: "Search Bid Book" }],
  //   show: true,
  //   modalName: "Auction",
  //   moduleId: 3,
  // },

  {
    title: "Warehouse",
    content: [
      {
        name: "addWarehouseBillUploads",
        title: "Warehouse Bill Uploads",
      },
      {
        name: "rejectWarehouseBill",
        title: "Reject Warehouse Bill",
      },
    ],
  },

  {
    title: "Post Auction",
    moduleId: 4,
    content: [
      { linkId: 53, name: "viewDealBookModal", title: "View Deal Book" },
      {
        linkId: 54,
        name: "transferDealBookModal",
        title: "View Transfer Deal Book",
      },
      {
        linkId: 57,
        name: "generateSellerTaxInvoiceModal",
        title: "Generate Seller to Auctioneer Tax Invoice",
      },
      {
        linkId: 63,
        name: "buyerTaxInvoice",
        title: "Generate Buyer Tax Invoice",
      },
      {
        linkId: 64,
        name: "individualTaxInvoice",
        title: "Individual Buyer Tax Invoice Generation",
      },
      {
        linkId: 58,
        name: "sellerTaxInvoice",
        title: "Generate Seller Tax Invoice",
      },
      { linkId: 55, name: "InvoiceListModal", title: "Invoice List" },
      {
        linkId: 56,
        name: "ViewBuyerTaxInvoice",
        title: "View Buyer Tax Invoice",
      },
      {
        linkId: 59,
        name: "deliveryInstructionAdviceModal",
        title: "Delivery Instruction / Advice",
      },
    ],

    show: true,
    modalName: "PostAuction",
  },

  {
    title: "Report",
    content: [
      // { name: "test1", title: "Test 1" },
      { name: "test2", title: "Test 2" },
      { name: "test3", title: "Dealbook from sp" },
      { name: "test4", title: "Post Auction Catalog Report" },
    ],
    show: true,
    modalName: "Report",
  },

  {
    title: "Miscellaneous",
    content: "XXX XXX XXX",
    show: true,
    modalName: "Miscellaneous",
  },

  {
    title: "Profile",
    moduleId: 99,
    content: [
      { linkId: 299, name: "profileupdatelink", title: "Profile Update Link" },
    ],
    show: true,
    modalName: "profileupdatelink",
  },

  {
    title: "ContactUs",
    moduleId: 100,
    content: [{ linkId: 300, name: "contactUs", title: "Contact Us" }],
    show: true,
    modalName: "contactUs",
  },

  {
    title: "Support",
    moduleId: 101,
    content: [{ linkId: 301, name: "support", title: "Support" }],
    show: true,
    modalName: "support",
  },
];
export default SidebarContant;
