import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import Modal from "../../../components/common/Modal";
import { useEffect } from "react";
import axiosMain from "../../../http/axios/axios_main";
import CustomToast from "../../../components/Toast";
import { useState } from "react";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";
import axios from "axios";

const UpdateValuation = ({
  openUploadUpdateValuation,
  setOpenUploadUpdateValuation,
  getDataByPrems,
  setGetDataByprems,
  auctionCatalogDetail,
  auctioncatalogIdforupload,
  baseUrlEng,
  kutchaCatalog,
}) => {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
  } = useAuctionDetail();
  
  const [myCatalogForAuctioneer, setMyCatalogForAuctioneer] = useState(
    roleCode === "BUYER"
      ? [
        // { title: "Season", name: "season" },
        // { title: "Sale No.", name: "saleNo", noneditable: true, type: "number" },
        // { title: "Mark", name: "markName", noneditable: true, type: "text" },
        {
          title: "Lot No",
          name: "lotNo",
          noneditable: true,
          type: "text",
        },
        {
          title: "My Valuation",
          name: "myValuation",
          noneditable: false,
          type: "number",
        },
        {
          title: "My Comments",
          name: "myComments",
          noneditable: false,
          type: "text",
        },
        {
          title: "Group Code",
          name: "groupCode",
          noneditable: true,
          type: "text",
        },
      ]
      : baseUrlEng === "AuctionCatalog"
        ? [
          // { title: "Season", name: "season" },
          // { title: "Sale No.", name: "saleNo", noneditable: true, type: "number" },
          // { title: "Mark", name: "markName", noneditable: true, type: "text" },
          {
            title: "Base Price",
            name: "basePrice",
            noneditable: false,
            type: "number",
          },
          {
            title: "Auctioneer’s Valuation",
            name: "auctioneerValuation",
            noneditable: false,
            type: "number",
          },
          {
            title: "Reserve Price",
            name: "reservePrice",
            noneditable: false,
            type: "number",
          },
          // { title: "Auction Date", name: "auctionDate" },
          // { title: "Auction Date", name: "auctionDate" },
          // { title: "Tea Type", name: "teaTypeName" },
          // { title: "Category", name: "categoryName" },
          // { title: "Session Time", name: "sessionTime" },
          // { title: "Lot No.", name: "LotNo" },
          // { title: "Invoice No.", name: "invoiceNo" },
          // { title: "Origin", name: "Origin" },
          // { title: "Tea Type", name: "teaTypeName" },
          // { title: "Sub Type", name: "subTeaTypeName" },
          // { title: "Category", name: "categoryName" },
          // { title: "Grade", name: "gradeName" },
          // { title: "No. of Packages", name: "noOfPackages" },
          {
            title: "Mark & Packaging Comments",
            name: "markPackageComments",
            noneditable: false,
            type: "text",
          },
          {
            title: "Lot Comments",
            name: "lotComments",
            noneditable: false,
            type: "text",
          },
          {
            title: "Gross Weight",
            name: "grossKgs",
            noneditable: false,
            type: "number",
          },
          {
            title: "Package No.",
            name: "packageNo",
            noneditable: false,
            type: "text",
          },
          // { title: "Tare Weight", name: "tareKgs" },
          // { title: "Net Weight", name: "netKgs" },
          {
            title: "Sample Qty. (KGs)",
            name: "SampleQty",
            noneditable: false,
            type: "number",
          },
          {
            title: "Quality Comments",
            name: "qualityComments",
            noneditable: false,
            type: "text",
          },
          // { title: "Invoice Weight", name: "invoiceQty",noneditable:false },
          // { title: "GP No.", name: "gpNo",noneditable:false },
          // { title: "GP Date", name: "gpDate",noneditable:false },
          // { title: "Period of Manufacture", name: "periodOfManufacture",noneditable:false },
          {
            title: "Price Increment",
            name: "priceIncrement",
            noneditable: false,
            type: "number",
          },
          // { title: "Market Type", name: "marketTypeName",noneditable:false },
          // { title: "Package Type", name: "packageType",noneditable:false },
          // { title: "Warehouse Name", name: "wareHouseName",noneditable:false },
          {
            title: "Garden Certification",
            name: "gardenCertification",
            noneditable: false,
            type: "text",
          },
          {
            title: "Quality Certification",
            name: "qualityCertification",
            noneditable: false,
            type: "text",
          },
          {
            title: "Age of the Tea (In Months)",
            name: "ageOfProducts",
            noneditable: false,
            type: "number",
          },
          {
            title: "Color of Brew",
            name: "brewColor",
            noneditable: false,
            type: "text",
          },
          // { title: "Age of Products (In Months)", name: "ageOfProducts",noneditable:false },
          {
            title: "Brewers Comments",
            name: "brewersComments",
            noneditable: false,
            type: "text",
          },
          // {
          //   title: "System Base Price",
          //   name: "SystemBasePrice",
          //   noneditable: true,
          //   type: "number",
          // },
          // { title: "LSP / SP", name: "LSP_SP", noneditable: true },
          // { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
        ]
        : [
          // { title: "Season", name: "season" },
          // { title: "Sale No.", name: "saleNo", noneditable: true, type: "number" },
          // { title: "Mark", name: "markName", noneditable: true, type: "text" },
          {
            title: "Base Price",
            name: "basePrice",
            noneditable: false,
            type: "number",
          },
          {
            title: "Auctioneer’s Valuation",
            name: "auctioneerValuation",
            noneditable: false,
            type: "number",
          },
          {
            title: "Reserve Price",
            name: "reservePrice",
            noneditable: false,
            type: "number",
          },
          // { title: "Auction Date", name: "auctionDate" },
          // { title: "Auction Date", name: "auctionDate" },
          // { title: "Tea Type", name: "teaTypeName" },
          // { title: "Category", name: "categoryName" },
          // { title: "Session Time", name: "sessionTime" },
          // { title: "Lot No.", name: "LotNo" },
          // { title: "Invoice No.", name: "invoiceNo" },
          // { title: "Origin", name: "Origin" },
          // { title: "Tea Type", name: "teaTypeName" },
          // { title: "Sub Type", name: "subTeaTypeName" },
          // { title: "Category", name: "categoryName" },
          // { title: "Grade", name: "gradeName" },
          // { title: "No. of Packages", name: "noOfPackages" },
          {
            title: "Mark & Packaging Comments",
            name: "markPackageComments",
            noneditable: false,
            type: "text",
          },
          {
            title: "Lot Comments",
            name: "lotComments",
            noneditable: false,
            type: "text",
          },
          {
            title: "Gross Weight",
            name: "grossKgs",
            noneditable: false,
            type: "number",
          },
          {
            title: "Tare Weight",
            name: "tareKgs",
            noneditable: false,
            type: "number",
          },
          {
            title: "Category",
            name: "categoryName",
            noneditable: true,
            type: "text",
          },
          {
            title: "Package No.",
            name: "packageNo",
            noneditable: false,
            type: "text",
          },
          // { title: "Tare Weight", name: "tareKgs" },
          // { title: "Net Weight", name: "netKgs" },

          {
            title: "Sample Qty. (KGs)",
            name: "SampleQty",
            noneditable: true,
            type: "number",
          },
          {
            title: "Total Package",
            name: "totalPackages",
            noneditable: true,
            type: "number",
          },
          {
            title: "Quality Comments",
            name: "qualityComments",
            noneditable: false,
            type: "text",
          },
          {
            title: "Short Excess Weight",
            name: "shortExcessWeight",
            noneditable: true,
            type: "text",
          },
          // { title: "Invoice Weight", name: "invoiceQty",noneditable:false },
          // { title: "GP No.", name: "gpNo",noneditable:false },
          // { title: "GP Date", name: "gpDate",noneditable:false },
          // { title: "Period of Manufacture", name: "periodOfManufacture",noneditable:false },
          // {
          //   title: "Price Increment",
          //   name: "priceIncrement",
          //   noneditable: false,
          //   type: "number",
          // },
          // { title: "Market Type", name: "marketTypeName",noneditable:false },
          // { title: "Package Type", name: "packageType",noneditable:false },
          // { title: "Warehouse Name", name: "wareHouseName",noneditable:false },
          // {
          //   title: "Garden Certification",
          //   name: "gardenCertification",
          //   noneditable: false,
          //   type: "text",
          // },
          // {
          //   title: "Quality Certification",
          //   name: "qualityCertification",
          //   noneditable: false,
          //   type: "text",
          // },
          // {
          //   title: "Age of the Tea (In Months)",
          //   name: "ageOfProducts",
          //   noneditable: false,
          //   type: "number",
          // },
          // {
          //   title: "Color of Brew",
          //   name: "brewColor",
          //   noneditable: false,
          //   type: "text",
          // },
          // { title: "Age of Products (In Months)", name: "ageOfProducts",noneditable:false },
          // {
          //   title: "Brewers Comments",
          //   name: "brewersComments",
          //   noneditable: false,
          //   type: "text",
          // },
          // {
          //   title: "System Base Price",
          //   name: "SystemBasePrice",
          //   noneditable: true,
          //   type: "number",
          // },
          // { title: "LSP / SP", name: "LSP_SP", noneditable: true },
          // { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
        ]
  );

  const validationSchema =
    roleCode === "BUYER"
      ? Yup.object({
        myValuation: Yup.string().required("My Valuation is required"),
        myComments: Yup.string().required("My Comments is required"),
      })
      : baseUrlEng === "AuctionCatalog"
        ? Yup.object({
          basePrice: Yup.number()
            .typeError("Base Price must be a number")
            .required("Base Price is required")
            .test(
              "twoDecimalPlaces",
              "Base Price must have at most two decimal places",
              (value) => {
                if (typeof value !== "number") return true;
                const decimalPart = value.toString().split(".")[1];
                return !decimalPart || decimalPart.length <= 2;
              }
            ),
          auctioneerValuation: Yup.number()
            .typeError("Auctioneer Valuation must be a number")
            .required("Auctioneer Valuation is required")
            .test(
              "twoDecimalPlaces",
              "Auctioneer Valuation must have at most two decimal places",
              (value) => {
                if (typeof value !== "number") return true;
                const decimalPart = value.toString().split(".")[1];
                return !decimalPart || decimalPart.length <= 2;
              }
            ),
          reservePrice: Yup.number()
            .typeError("Reserve Price must be a number")
            .moreThan(
              Yup.ref("basePrice"),
              "Reserve Price must be greater than Base Price"
            )
            .test(
              "twoDecimalPlaces",
              "Reserve Price must have at most two decimal places",
              (value) => {
                if (typeof value !== "number") return true;
                const decimalPart = value.toString().split(".")[1];
                return !decimalPart || decimalPart.length <= 2;
              }
            )
            .required("Reserve Price is required"),
          markPackageComments: Yup.string().max(
            255,
            "Mark & Packaging Comments must be 255 characters or less"
          ),
          lotComments: Yup.string().max(
            255,
            "Lot Comments must be 255 characters or less"
          ),
          grossWeight: Yup.number()
            .typeError("Gross Weight must be a number")
            .test(
              "twoDecimalPlaces",
              "Gross Weight must have at most two decimal places",
              (value) => {
                if (typeof value !== "number") return true;
                const decimalPart = value.toString().split(".")[1];
                return !decimalPart || decimalPart.length <= 2;
              }
            ),
          packageNo: Yup.string().matches(
            /^\d+-\d+$/,
            "Package No. must be in the format X-Y"
          ),
          sampleQty: Yup.number()
            .typeError("Sample Qty. must be a number")
            .test(
              "twoDecimalPlaces",
              "Sample Qty must have at most two decimal places",
              (value) => {
                if (typeof value !== "number") return true;
                const decimalPart = value.toString().split(".")[1];
                return !decimalPart || decimalPart.length <= 2;
              }
            ),
          // Add validation for other fields here
        })
        : Yup.object({
          basePrice: Yup.number()
            .typeError("Base Price must be a number")
            .required("Base Price is required")
            .test(
              "twoDecimalPlaces",
              "Base Price must have at most two decimal places",
              (value) => {
                if (typeof value !== "number") return true;
                const decimalPart = value.toString().split(".")[1];
                return !decimalPart || decimalPart.length <= 2;
              }
            ),
          auctioneerValuation: Yup.number()
            .typeError("Auctioneer Valuation must be a number")
            .required("Auctioneer Valuation is required")
            .test(
              "twoDecimalPlaces",
              "Auctioneer Valuation must have at most two decimal places",
              (value) => {
                if (typeof value !== "number") return true;
                const decimalPart = value.toString().split(".")[1];
                return !decimalPart || decimalPart.length <= 2;
              }
            ),
          reservePrice: Yup.number()
            .typeError("Reserve Price must be a number")
            .moreThan(
              Yup.ref("basePrice"),
              "Reserve Price must be greater than Base Price"
            )
            .test(
              "twoDecimalPlaces",
              "Reserve Price must have at most two decimal places",
              (value) => {
                if (typeof value !== "number") return true;
                const decimalPart = value.toString().split(".")[1];
                return !decimalPart || decimalPart.length <= 2;
              }
            )
            .required("Reserve Price is required"),
          markPackageComments: Yup.string().max(
            255,
            "Mark & Packaging Comments must be 255 characters or less"
          ),
          lotComments: Yup.string().max(
            255,
            "Lot Comments must be 255 characters or less"
          ),
          grossWeight: Yup.number()
            .typeError("Gross Weight must be a number")
            .test(
              "twoDecimalPlaces",
              "Gross Weight must have at most two decimal places",
              (value) => {
                if (typeof value !== "number") return true;
                const decimalPart = value.toString().split(".")[1];
                return !decimalPart || decimalPart.length <= 2;
              }
            ),
          packageNo: Yup.string().matches(
            /^\d+-\d+$/,
            "Package No. must be in the format X-Y"
          ),
          sampleQty: Yup.number()
            .typeError("Sample Qty. must be a number")
            .test(
              "twoDecimalPlaces",
              "Sample Qty must have at most two decimal places",
              (value) => {
                if (typeof value !== "number") return true;
                const decimalPart = value.toString().split(".")[1];
                return !decimalPart || decimalPart.length <= 2;
              }
            ),
          // Add validation for other fields here
        });
  const formik = useFormik({
    initialValues: {
      saleNo: "",
      markName: "",
      basePrice: "",
      auctioneerValuation: "",
      reservePrice: "",
      markPackageComments: "",
      lotComments: "",
      grossKgs: "",
      packageNo: "",
      SampleQty: "",
      qualityComments: "",
      priceIncrement: "",
      gardenCertification: "",
      qualityCertification: "",
      brewColor: "",
      ageOfProducts: "",
      brewersComments: "",
      SystemBasePrice: "",
      SBP_LSP_SP: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Handle form submission, e.g., send data to the server
      // console.log("Form submitted with values:", values);
      // if (getDataByPrems?.at(0).hours_date_difference < 48) {

      if (roleCode === "BUYER") {
        axiosMain
          .post(
            `/preauction/${baseUrlEng}/AddValuation?role=` + roleCode,
            // axios
            //   .post(
            //     "http://192.168.100.205:5080/preauction/AuctionCatalog/UploadValuation?role=" +
            //       roleCode,
            // [{
            //   auctionCatalogId: auctionCatalogId,
            //   season: getDataByPrems[0]?.season,
            //   saleNo:
            //     getDataByPrems[0]?.saleNo !== "" ||
            //     getDataByPrems[0]?.saleNo !== 0
            //       ? parseInt(getDataByPrems[0]?.saleNo)
            //       : 0,
            //   SampleQty: SampleQty,
            //   basePrice: basePrice,
            //   reservePrice: reservePrice,
            //   auctioneerValuation: auctioneerValuation,
            //   priceIncrement: priceIncrement,
            //   markPackageComments: markPackageComments,
            //   lotComments: lotComments,
            //   qualityComments: qualityComments,
            //   qualityCertification: qualityCertification,
            //   brewColor: brewColor,
            //   ageOfProducts: ageOfProducts,
            //   brewersComments: brewersComments,
            //   gardenCertification: gardenCertification,
            //   netWeight: netWeight,
            //   auctioneerId: userId, //auctioner
            // }]
            [
              {
                ...values,
                auctionCenterId,
                updatedBy: userId,
                createdBy: userId,
              },
            ]
          )
          .then((res) => {
            if (res.data.statusCode === 204) {
              CustomToast.warning(res.data.message);
            } else if (res.data.statusCode === 200) {
              CustomToast.success(res.data.message);
              setOpenUploadUpdateValuation(false);
              resetForm();
            } else {
              CustomToast.error(res.data.message);
            }
          })
          .catch((error) => {
            CustomToast.error();
          });
      } else {
        if (
          (baseUrlEng === "AuctionCatalog" &&
            getDataByPrems?.at(0)?.minute_difference >= 15 &&
            getDataByPrems?.at(0)?.hours_date_difference < 48) ||
          (baseUrlEng === "EnglishAuctionCatalog" &&
            getDataByPrems?.at(0)?.minute_difference >= 15 &&
            getDataByPrems?.at(0)?.hours_date_difference < 24) ||
          (baseUrlEng === "EnglishAuctionKutchaCatalogue" &&
            getDataByPrems?.at(0)?.minute_difference >= 15 &&
            getDataByPrems?.at(0)?.hours_date_difference < 24)
        ) {
          const {
            auctionCatalogId,
            SampleQty,
            basePrice,
            reservePrice,
            auctioneerValuation,
            priceIncrement,
            markPackageComments,
            lotComments,
            qualityComments,
            qualityCertification,
            brewColor,
            ageOfProducts,
            brewersComments,
            gardenCertification,
            netWeight,
            auctioneerId,
            saleNo,
            season,
            grossKgs,
          } = values;
          axiosMain
            .post(
              baseUrlEng === "EnglishAuctionKutchaCatalogue"
                ? `/preauction/EnglishAuctionKutchaCatalogue/UpdateKutchaCatalogValuationReservePrice`
                : `/preauction/${baseUrlEng}/UpdateMyCatalogValuationReservePrice?role=` +
                roleCode,
              baseUrlEng === "AuctionCatalog" ||
                baseUrlEng === "EnglishAuctionKutchaCatalogue"
                ? {
                    season: auctionCatalogDetail?.season?.toString(),
                    saleNo: parseInt(auctionCatalogDetail?.saleNo),
                    auctionCenterId,
                    KutchaCatalogId: parseInt(auctioncatalogIdforupload),
                    reservePrice,
                    basePrice,
                    auctioneerId: userId,
                    ageOfProducts: values.ageOfProducts,
                    gardenCertification: values.gardenCertification,
                    SaleProgramId: getDataByPrems[0]?.saleprogramid,
                  }
                : {
                  season: auctionCatalogDetail?.season,
                  saleNo: parseInt(auctionCatalogDetail?.saleNo),
                  auctionCenterId,
                  KutchaCatalogId: parseInt(auctioncatalogIdforupload),
                  reservePrice,
                  auctioneerId: userId,
                  ageOfProducts: values.ageOfProducts,
                  gardenCertification: values.gardenCertification,
                  SaleProgramId: getDataByPrems[0]?.saleprogramid,
                }
            )
            .then((res) => {
              if (res.data.statusCode === 403) {
                CustomToast.warning(res.data.message);
              } else if (res.data.statusCode === 200) {
                CustomToast.success(res.data.message);
                setOpenUploadUpdateValuation(false);
                resetForm();
              } else {
                CustomToast.error(res.data.message);
              }
            })
            .catch((error) => {
              CustomToast.error();
            });
        } else {
          values.auctioneerId = getDataByPrems?.at(0)?.auctioneerId;
          const {
            auctionCatalogId,
            SampleQty,
            basePrice,
            reservePrice,
            auctioneerValuation,
            priceIncrement,
            markPackageComments,
            lotComments,
            qualityComments,
            qualityCertification,
            brewColor,
            ageOfProducts,
            brewersComments,
            gardenCertification,
            netWeight,
            auctioneerId,
            grossKgs,
          } = values;
          axiosMain
            .post(
              `/preauction/${baseUrlEng}/UploadValuation?role=` + roleCode,
              // axios
              //   .post(
              //     "http://192.168.100.205:5080/preauction/AuctionCatalog/UploadValuation?role=" +
              //       roleCode,
              // [{
              //   auctionCatalogId: auctionCatalogId,
              //   season: getDataByPrems[0]?.season,
              //   saleNo:
              //     getDataByPrems[0]?.saleNo !== "" ||
              //     getDataByPrems[0]?.saleNo !== 0
              //       ? parseInt(getDataByPrems[0]?.saleNo)
              //       : 0,
              //   SampleQty: SampleQty,
              //   basePrice: basePrice,
              //   reservePrice: reservePrice,
              //   auctioneerValuation: auctioneerValuation,
              //   priceIncrement: priceIncrement,
              //   markPackageComments: markPackageComments,
              //   lotComments: lotComments,
              //   qualityComments: qualityComments,
              //   qualityCertification: qualityCertification,
              //   brewColor: brewColor,
              //   ageOfProducts: ageOfProducts,
              //   brewersComments: brewersComments,
              //   gardenCertification: gardenCertification,
              //   netWeight: netWeight,
              //   auctioneerId: userId, //auctioner
              // }]
              baseUrlEng === "AuctionCatalog"
                ? [
                  {
                    KutchaCatalogId: getDataByPrems?.at(0)?.KutchaCatalogId,
                    invoiceId: getDataByPrems?.at(0)?.invoiceId,
                    ageOfProducts:
                      ageOfProducts === undefined ? null : ageOfProducts,
                    auctioneerValuation:
                      auctioneerValuation === undefined
                        ? null
                        : auctioneerValuation,
                    basePrice: basePrice === undefined ? null : basePrice,
                    brewersComments:
                      brewersComments === undefined ? null : brewersComments,
                    brewColor: brewColor === undefined ? null : brewColor,
                    gardenCertification:
                      gardenCertification === undefined
                        ? null
                        : gardenCertification,
                    lotComments:
                      lotComments === undefined ? null : lotComments,
                    LotNo: getDataByPrems?.at(0)?.LotNo,
                    markPackageComments:
                      markPackageComments === undefined
                        ? null
                        : markPackageComments,
                    priceIncrement:
                      priceIncrement === undefined ? null : priceIncrement,
                    qualityCertification:
                      qualityCertification === undefined
                        ? null
                        : qualityCertification,
                    qualityComments:
                      qualityComments === undefined ? null : qualityComments,
                    reservePrice: parseFloat(reservePrice),
                    SampleQty: SampleQty,
                    sessionType: getDataByPrems?.at(0)?.sessionType,
                    createdOn: null,
                    createdBy: userId, //auctioner
                    updatedBy: userId, //auctioner
                    updatedOn: null,
                    status: 1,
                    auctionCenterId: auctionCenterId,
                    saleprogramid: getDataByPrems?.at(0)?.saleprogramid,
                  },
                ]
                : [
                  {
                    KutchaCatalogId: getDataByPrems?.at(0)?.KutchaCatalogId,
                    invoiceId: getDataByPrems?.at(0)?.invoiceId,
                    // ageOfProducts:
                    //   ageOfProducts === undefined ? null : ageOfProducts,
                    auctioneerValuation:
                      auctioneerValuation === undefined
                        ? null
                        : auctioneerValuation,
                    basePrice: basePrice === undefined ? null : basePrice,
                    // brewersComments:
                    //   brewersComments === undefined ? null : brewersComments,
                    // brewColor: brewColor === undefined ? null : brewColor,
                    // gardenCertification:
                    //   gardenCertification === undefined
                    //     ? null
                    //     : gardenCertification,
                    lotComments:
                      lotComments === undefined ? null : lotComments,
                    LotNo: getDataByPrems?.at(0)?.LotNo,
                    markPackageComments:
                      markPackageComments === undefined
                        ? null
                        : markPackageComments,
                    priceIncrement:
                      priceIncrement === undefined ? null : priceIncrement,
                    // // qualityCertification:
                    // //   qualityCertification === undefined
                    // //     ? null
                    // //     : qualityCertification,
                    qualityComments:
                      qualityComments === undefined ? null : qualityComments,
                    reservePrice: parseFloat(reservePrice),
                    SampleQty: SampleQty,
                    sessionTypeName: getDataByPrems?.at(0)?.sessionType,
                    createdOn: null,
                    createdBy: userId, //auctioner
                    updatedBy: userId, //auctioner
                    updatedOn: null,
                    status: 1,
                    auctionCenterId: auctionCenterId,
                    saleprogramid: getDataByPrems?.at(0)?.saleprogramid,

                    auctioneerId: userId,
                    auctionTypeMasterId: 2,
                    // markPackageComments,
                    // lotComments,
                    grossKgs,
                  },
                ]
            )
            .then((res) => {
              if (res.data.statusCode === 204) {
                CustomToast.warning(res.data.message);
              } else if (res.data.statusCode === 200) {
                CustomToast.success(res.data.message);
                setOpenUploadUpdateValuation(false);
                resetForm();
              } else {
                CustomToast.error(res.data.message);
              }
            })
            .catch((error) => {
              CustomToast.error();
            });
        }
      }
      // }

      // else {
      //   const {
      //     auctionCatalogId,
      //     SampleQty,
      //     basePrice,
      //     reservePrice,
      //     auctioneerValuation,
      //     priceIncrement,
      //     markPackageComments,
      //     lotComments,
      //     qualityComments,
      //     qualityCertification,
      //     brewColor,
      //     ageOfProducts,
      //     brewersComments,
      //     gardenCertification,
      //     netWeight,
      //   } = values;
      //   // axiosMain
      //   //   .post("/preauction/AuctionCatalog/UpdateMyCatalogValuationDetails", {
      //   axios
      //     .post(
      //       "http://192.168.100.205:5080/preauction/AuctionCatalog/UploadValuation?role=" +
      //         roleCode,
      //       [
      //         {
      //           auctionCatalogId: auctionCatalogId,
      //           season: getDataByPrems?.at(0)?.season,
      //           saleNo: getDataByPrems?.at(0)?.saleNo,
      //           SampleQty: SampleQty,
      //           basePrice: basePrice,
      //           reservePrice: reservePrice,
      //           auctioneerValuation: auctioneerValuation,
      //           priceIncrement: priceIncrement,
      //           markPackageComments: markPackageComments,
      //           lotComments: lotComments,
      //           qualityComments: qualityComments,
      //           qualityCertification: qualityCertification,
      //           brewColor: brewColor,
      //           ageOfProducts: ageOfProducts,
      //           brewersComments: brewersComments,
      //           gardenCertification: gardenCertification,
      //           netWeight: netWeight,
      //           auctionCenterId: auctionCenterId,
      //           // auctioneerId: getDataByPrems?.at(0)?.auctioneerId,
      //           auctioneerId: userId,
      //         },
      //       ]
      //     )
      //     .then((res) => {
      //       if (res.data.statusCode === 204) {
      //         CustomToast.warning(res.data.message);
      //       } else if (res.data.statusCode === 200) {
      //         CustomToast.success(res.data.message);
      //       } else {
      //         CustomToast.error(res.data.message);
      //       }
      //     })
      //     .catch((error) => {
      //       CustomToast.error();
      //     });
      // }
      // resetForm();
    },
  });

  useEffect(() => {
    // console.log(getDataByPrems, "getDataByPremsgetDataByPrems");
    setMyCatalogForAuctioneer(
      roleCode === "BUYER"
        ? [
          // { title: "Season", name: "season" },
          // { title: "Sale No.", name: "saleNo", noneditable: true, type: "number" },
          // { title: "Mark", name: "markName", noneditable: true, type: "text" },
          {
            title: "Lot No",
            name: "lotNo",
            noneditable: true,
            type: "text",
          },
          {
            title: "My Valuation",
            name: "myValuation",
            noneditable: false,
            type: "number",
          },
          {
            title: "My Comments",
            name: "myComments",
            noneditable: false,
            type: "text",
          },
          {
            title: "Group Code",
            name: "groupCode",
            noneditable: true,
            type: "text",
          },
        ]
        : baseUrlEng === "AuctionCatalog"
          ? [
            // { title: "Season", name: "season" },
            // { title: "Sale No.", name: "saleNo", noneditable: true, type: "number" },
            // { title: "Mark", name: "markName", noneditable: true, type: "text" },
            {
              title: "Base Price",
              name: "basePrice",
              noneditable: false,
              type: "number",
            },
            {
              title: "Auctioneer’s Valuation",
              name: "auctioneerValuation",
              noneditable: false,
              type: "number",
            },
            {
              title: "Reserve Price",
              name: "reservePrice",
              noneditable: false,
              type: "number",
            },
            // { title: "Auction Date", name: "auctionDate" },
            // { title: "Auction Date", name: "auctionDate" },
            // { title: "Tea Type", name: "teaTypeName" },
            // { title: "Category", name: "categoryName" },
            // { title: "Session Time", name: "sessionTime" },
            // { title: "Lot No.", name: "LotNo" },
            // { title: "Invoice No.", name: "invoiceNo" },
            // { title: "Origin", name: "Origin" },
            // { title: "Tea Type", name: "teaTypeName" },
            // { title: "Sub Type", name: "subTeaTypeName" },
            // { title: "Category", name: "categoryName" },
            // { title: "Grade", name: "gradeName" },
            // { title: "No. of Packages", name: "noOfPackages" },
            {
              title: "Mark & Packaging Comments",
              name: "markPackageComments",
              noneditable: false,
              type: "text",
            },
            {
              title: "Lot Comments",
              name: "lotComments",
              noneditable: false,
              type: "text",
            },
            {
              title: "Gross Weight",
              name: "grossKgs",
              noneditable: false,
              type: "number",
            },
            {
              title: "Package No.",
              name: "packageNo",
              noneditable: false,
              type: "text",
            },
            // { title: "Tare Weight", name: "tareKgs" },
            // { title: "Net Weight", name: "netKgs" },
            {
              title: "Sample Qty. (KGs)",
              name: "SampleQty",
              noneditable: false,
              type: "number",
            },
            {
              title: "Quality Comments",
              name: "qualityComments",
              noneditable: false,
              type: "text",
            },
            // { title: "Invoice Weight", name: "invoiceQty",noneditable:false },
            // { title: "GP No.", name: "gpNo",noneditable:false },
            // { title: "GP Date", name: "gpDate",noneditable:false },
            // { title: "Period of Manufacture", name: "periodOfManufacture",noneditable:false },
            {
              title: "Price Increment",
              name: "priceIncrement",
              noneditable: false,
              type: "number",
            },
            // { title: "Market Type", name: "marketTypeName",noneditable:false },
            // { title: "Package Type", name: "packageType",noneditable:false },
            // { title: "Warehouse Name", name: "wareHouseName",noneditable:false },
            {
              title: "Garden Certification",
              name: "gardenCertification",
              noneditable: false,
              type: "text",
            },
            {
              title: "Quality Certification",
              name: "qualityCertification",
              noneditable: false,
              type: "text",
            },
            {
              title: "Age of the Tea (In Months)",
              name: "ageOfProducts",
              noneditable: false,
              type: "number",
            },
            {
              title: "Color of Brew",
              name: "brewColor",
              noneditable: false,
              type: "text",
            },
            // { title: "Age of Products (In Months)", name: "ageOfProducts",noneditable:false },
            {
              title: "Brewers Comments",
              name: "brewersComments",
              noneditable: false,
              type: "text",
            },
            // {
            //   title: "System Base Price",
            //   name: "SystemBasePrice",
            //   noneditable: true,
            //   type: "number",
            // },
            // { title: "LSP / SP", name: "LSP_SP", noneditable: true },
            // { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
          ]
          : [
            // { title: "Season", name: "season" },
            // { title: "Sale No.", name: "saleNo", noneditable: true, type: "number" },
            // { title: "Mark", name: "markName", noneditable: true, type: "text" },
            {
              title: "Base Price",
              name: "basePrice",
              noneditable: false,
              type: "number",
            },
            {
              title: "Auctioneer’s Valuation",
              name: "auctioneerValuation",
              noneditable: false,
              type: "number",
            },
            {
              title: "Reserve Price",
              name: "reservePrice",
              noneditable: false,
              type: "number",
            },
            // { title: "Auction Date", name: "auctionDate" },
            // { title: "Auction Date", name: "auctionDate" },
            // { title: "Tea Type", name: "teaTypeName" },
            // { title: "Category", name: "categoryName" },
            // { title: "Session Time", name: "sessionTime" },
            // { title: "Lot No.", name: "LotNo" },
            // { title: "Invoice No.", name: "invoiceNo" },
            // { title: "Origin", name: "Origin" },
            // { title: "Tea Type", name: "teaTypeName" },
            // { title: "Sub Type", name: "subTeaTypeName" },
            // { title: "Category", name: "categoryName" },
            // { title: "Grade", name: "gradeName" },
            // { title: "No. of Packages", name: "noOfPackages" },
            {
              title: "Mark & Packaging Comments",
              name: "markPackageComments",
              noneditable: false,
              type: "text",
            },
            {
              title: "Lot Comments",
              name: "lotComments",
              noneditable: true,
              type: "text",
            },
            {
              title: "Gross Weight",
              name: "grossKgs",
              noneditable: false,
              type: "number",
            },
            {
              title: "Tare Weight",
              name: "tareKgs",
              noneditable: false,
              type: "number",
            },
            {
              title: "Category",
              name: "categoryName",
              noneditable: true,
              type: "text",
            },
            {
              title: "Package No.",
              name: "packageNo",
              noneditable: false,
              type: "text",
            },
            // { title: "Tare Weight", name: "tareKgs" },
            // { title: "Net Weight", name: "netKgs" },
            {
              title: "Sample Qty. (KGs)",
              name: "SampleQty",
              noneditable: true,
              type: "number",
            },

            {
              title: "Total Package",
              name: "totalPackages",
              noneditable: true,
              type: "number",
            },
            {
              title: "Quality Comments",
              name: "qualityComments",
              noneditable: false,
              type: "text",
            },
            {
              title: "Short Excess Weight",
              name: "shortExcessWeight",
              noneditable: true,
              type: "text",
            },
            // { title: "Invoice Weight", name: "invoiceQty",noneditable:false },
            // { title: "GP No.", name: "gpNo",noneditable:false },
            // { title: "GP Date", name: "gpDate",noneditable:false },
            // { title: "Period of Manufacture", name: "periodOfManufacture",noneditable:false },
            // {
            //   title: "Price Increment",
            //   name: "priceIncrement",
            //   noneditable: false,
            //   type: "number",
            // },
            // { title: "Market Type", name: "marketTypeName",noneditable:false },
            // { title: "Package Type", name: "packageType",noneditable:false },
            // { title: "Warehouse Name", name: "wareHouseName",noneditable:false },
            // {
            //   title: "Garden Certification",
            //   name: "gardenCertification",
            //   noneditable: false,
            //   type: "text",
            // },
            // {
            //   title: "Quality Certification",
            //   name: "qualityCertification",
            //   noneditable: false,
            //   type: "text",
            // },
            // {
            //   title: "Age of the Tea (In Months)",
            //   name: "ageOfProducts",
            //   noneditable: false,
            //   type: "number",
            // },
            // {
            //   title: "Color of Brew",
            //   name: "brewColor",
            //   noneditable: false,
            //   type: "text",
            // },
            // { title: "Age of Products (In Months)", name: "ageOfProducts",noneditable:false },
            // {
            //   title: "Brewers Comments",
            //   name: "brewersComments",
            //   noneditable: false,
            //   type: "text",
            // },
            // {
            //   title: "System Base Price",
            //   name: "SystemBasePrice",
            //   noneditable: true,
            //   type: "number",
            // },
            // { title: "LSP / SP", name: "LSP_SP", noneditable: true },
            // { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
          ]
    );
    if (roleCode === "BUYER") {
      console.log(getDataByPrems, "getDataByPremsgetDataByPrems");
      formik.setValues(getDataByPrems);
      setgroupcodedisable(getDataByPrems?.groupCode);
    } else {
      if (getDataByPrems?.length > 0) {
        if (
          (getDataByPrems?.at(0)?.hours_date_difference < 48 &&
            baseUrlEng === "AuctionCatalog") ||
          (baseUrlEng === "EnglishAuctionCatalog" &&
            getDataByPrems?.at(0)?.hours_date_difference < 24) ||
          (baseUrlEng === "EnglishAuctionKutchaCatalogue" &&
            getDataByPrems?.at(0)?.hours_date_difference < 24)
        ) {
          let data = [...myCatalogForAuctioneer];
          data.filter((ele) =>
            ele.name === "reservePrice"
              ? (ele.noneditable =
                getDataByPrems?.at(0)?.minute_difference >= 15 ? false : true)
              : (ele.noneditable = true)
          );
          setMyCatalogForAuctioneer(data);
        }
       
        formik.setValues(getDataByPrems?.at(0));
      } else {
        formik.setValues({
          saleNo: "",
          markName: "",
          basePrice: "",
          auctioneerValuation: "",
          reservePrice: "",
          markPackageComments: "",
          lotComments: "",
          grossKgs: "",
          packageNo: "",
          SampleQty: "",
          qualityComments: "",
          priceIncrement: "",
          gardenCertification: "",
          qualityCertification: "",
          brewColor: "",
          ageOfProducts: "",
          brewersComments: "",
          SystemBasePrice: "",
          SBP_LSP_SP: "",
        });
      }
    }
  }, [getDataByPrems]);
  const [groupcodedisable, setgroupcodedisable] = useState("");
  return (
    <Modal
      size="xl"
      title="Update My Catalog Valuation"
      show={openUploadUpdateValuation}
      handleClose={() => {
        setGetDataByprems([]);
        setOpenUploadUpdateValuation(false);
        formik.resetForm();
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          {myCatalogForAuctioneer.map((field, index) => (
            <div className="col-lg-2" key={index}>
              <div className="FormGroup">
                <label htmlFor={field.name}>{field.title}</label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  className="form-control select-form"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name]}
                  disabled={
                    (field.name === "lotComments" || (field.name === "groupCode" && groupcodedisable === "-")) ? false : field.noneditable
                  }
                />
                <small className="text-danger">
                  {formik.touched[field.name] && formik.errors[field.name]
                    ? formik.errors[field.name]
                    : null}
                </small>
              </div>
            </div>
          ))}
        </div>

        {roleCode === "BUYER" ? (
          <button type="submit" className="SubmitBtn btn">
            Update Valuation
          </button>
        ) : (
          <button
            type="submit"
            disabled={
              getDataByPrems?.at(0)?.minute_difference >= 15 ? false : true
            }
            className="SubmitBtn btn"
          >
            Update Valuation
          </button>
        )}
      </form>
    </Modal>
  );
};

export default UpdateValuation;
