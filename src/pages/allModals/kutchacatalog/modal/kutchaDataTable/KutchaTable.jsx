import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  SelectionState,
  PagingState,
  IntegratedPaging,
  IntegratedSelection,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  PagingPanel,
} from "@devexpress/dx-react-grid-bootstrap4";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";

import { fetchMarkTypeRequest } from "../../../../../store/actions";
import { useSelector } from "react-redux";
import axiosMain from "../../../../../http/axios/axios_main";
import CustomToast from "../../../../../components/Toast";
import { useAuctionDetail } from "../../../../../components/common/AunctioneerDeteailProvider";
import formatDateToDdMmYy from "../../../../../components/common/dateAndTime/convertToDate";
import ConfirmationModal from "../../../../../components/common/DeleteConfirmationModal";
import UploadValuation from "../../../auctioncatalog/UploadValuation";
import UpdateValuation from "../../../auctioncatalog/UpdateValuation";

const KutchaTable = ({
  rows,
  setRows,
  status,
  modalRight,
  baseUrlEng,
  auctionType,
  formik,
  markTypeValue,
}) => {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    auction,
    roleCode,
  } = useAuctionDetail();
  const initialData = [
    {
      KutchaCatalogId: 84,
      LotNo: "RO14AHM2023123-S",
      invoiceId: 10240,
      invoiceNo: "PQ12",
      teaTypeId: 1,
      teaTypeName: "sdfsdfsdaaaa",
      subTeaTypeId: 2,
      subTeaTypeName: "fgdfgdfg",
      categoryId: 3,
      categoryName: "string04",
      markId: 9,
      markName: "ICnjRUkVs",
      gradeId: 3,
      gradeName: "string1211",
      marketTypeId: 1,
      marketTypeName: "Small",
      sessionTypeId: 1,
      sessionTypeName: "Normal",
      packageType: "test",
      packageNo: "10-20",
      totalPackages: 11,
      SampleQty: null,
      grossKgs: 10.0,
      tareKgs: 5.0,
      netKgs: 5.0,
      invoiceWeight: 55.0,
      shortExcessWeight: 10.0,
      manufactureFromDate: "2023-02-03T17:16:40",
      manufactureToDate: "2023-03-02T17:16:40",
      gpNo: "test23",
      gpDate: "2023-02-15T17:16:40",
      basePrice: 300.0,
      auctioneerValuation: 370.0,
      reservePrice: 320.0,
      priceIncrement: 1.0,
      markPackageComments: "Package Comments",
      lotComments: "Lot Comments",
      qualityComments: "Quality Comments",
      qualityCertification: "Quality Certificate",
      brewColor: "",
      ageOfProducts: 0.0,
      brewersComments: "",
      gardenCertification: "Garden Certification",
      wareHouseUserRegId: 3,
      wareHouseName: "ABC",
      locationInsideWarehouse: "",
      remarks: "",
      lastModifiedBy: 6,
      MarketType: null,
      SystemBasePrice: 325.0,
      factoryId: 6,
      lastModifiedBy: "factry11",
    },
  ];

  const [data, setData] = useState(rows?.length > 0 ? rows : []);
  const [selectedData, setSelectedData] = useState([]);
  const [checked, setChecked] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editing, setEditing] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});

  const [allCheked, setAllChacked] = useState(false);
  const [getDataByPrems, setGetDataByprems] = useState([]);
  const [openUploadUpdateValuation, setOpenUploadUpdateValuation] =
    useState(false);
  const [auctioncatalogIdforupload, setauctioncatalogIdforupload] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(data, "datadatadata");
    setRows(data);
  }, [selectedData]);

  useEffect(() => {
    let data = rows?.map((ele) => {
      return {
        ...ele,
        gpDate: formatDateToDdMmYy(ele.gpDate), //formatDateToDdMmYy()+ "T" + ele.gpDate?.split("T")?.at(1), With Time
        manufactureFromDate: formatDateToDdMmYy(
          ele.manufactureFromDate?.split("T")?.at(0)
        ),
        manufactureToDate: formatDateToDdMmYy(
          ele.manufactureToDate?.split("T")?.at(0)
        ),
      };
    });
    // console.log(data, "datadata");
    setData(data);
  }, [rows]);
  //
  useEffect(() => {
    if (data.length > 1) {
      setAllChacked(selectedData.length === data.length ? true : false);
    } else {
      setAllChacked(false);
    }
  }, [selectedData]);
  const handleCheckboxChange = (id) => {
    const isChecked = selectedData.some((item) => item.KutchaCatalogId === id);

    if (isChecked) {
      // If the checkbox is checked, remove the data from selectedData
      setSelectedData(
        selectedData.filter((item) => item.KutchaCatalogId !== id)
      );
      // setAllChacked(selectedData.length === data.length ? true:false);
    } else {
      // If the checkbox is unchecked, add the data to selectedData
      const data2 = data.find((item) => item.KutchaCatalogId === id);
      setSelectedData([...selectedData, data2]);
      // setAllChacked(selectedData.length === data.length ? true:false);
    }
  };
  console.log(selectedData, "selectedData");
  // const handleDeleteSelected = async () => {
  //   // setData((prevData) => prevData.filter((item) => !item.selected));
  //   console.log(
  //     data.map((ele) => ele.KutchaCatalogId).join(", "),
  //     data,
  //     "checkedDatacheckedDatacheckedData"
  //   );

  //   if (data?.length > 0) {
  //     try {
  //       const response = await axiosMain.post(
  //         "/preauction/${baseUrlEng}/DeleteKutchaCatalogueDetails",
  //         {
  //           season: data?.at(0)?.season,
  //           saleNo: data?.at(0)?.saleNo,
  //           KutchaCatalogIds: selectedData
  //             .map((ele) => ele.KutchaCatalogId)
  //             .join(", "),
  //           userId: userId,
  //           auctionCenterId: auctionCenterId,
  //         }
  //       );

  //       if (response.status === 200) {
  //         CustomToast.success(response.data.message);
  //       }
  //     } catch (error) {
  //       console.error("Error deleting:", error);
  //       CustomToast.error("An error occurred while deleting.");
  //     }
  //   } else {
  //   }
  // };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSaveCell = (id, field, value) => {
    console.log(id, field, value, "id, field, value");
    if (
      field?.toString() === "SampleQty" ||
      field?.toString() === "grossKgs" ||
      field?.toString() === "shortExcessWeight" ||
      field?.toString() === "basePrice" ||
      field?.toString() === "reservePrice"
    ) {
      let isValid = /^\d+(\.\d{1,2})?$/.test(value.toString());
      if (isValid) {
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "",
        }));
      } else {
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        // console.log("Sample Qwantity is able to dasimal");
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "Two digits after decimal point allowed.",
        }));
        return;
      }
    }
    if (field?.toString() === "grossKgs") {
      const dataList = data
        .filter((item) => item.KutchaCatalogId === id)
        ?.at(0);

      let greatestValue = Math.max(
        parseFloat(value),
        parseFloat(dataList.SampleQty)
      );

      if (
        greatestValue === parseFloat(value) &&
        parseFloat(value) !== parseFloat(dataList.SampleQty)
      ) {
        let netKgsValue = value - dataList.tareKgs;

        let noOfKgs = dataList.totalPackages * netKgsValue;
        let smapQty = dataList.SampleQty + dataList.shortExcessWeight;
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id
              ? {
                  ...item,
                  [field]: value,
                  netKgs: value - dataList.tareKgs,
                  invoiceWeight: noOfKgs - smapQty,
                }
              : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id
              ? {
                  ...item,
                  [field]: value,
                  netKgs: value - dataList.tareKgs,
                  invoiceWeight: noOfKgs - smapQty,
                }
              : item
          )
        );
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          grossKgs: "",
        }));
      } else {
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id
              ? { ...item, [field]: value, netKgs: 0, invoiceWeight: 0 }
              : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id
              ? { ...item, [field]: value, netKgs: 0, invoiceWeight: 0 }
              : item
          )
        );
        // console.log("Sample Qwantity is able to dasimal");
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          grossKgs: "Gross Weight cannot be less than sampling Qty.",
        }));
      }

      console.log(
        parseFloat(dataList.SampleQty),
        field,
        "dataListdataListdataList"
      );
    } else {
      // console.log(data);
      setData((prevData) =>
        prevData.map((item) =>
          item.KutchaCatalogId === id ? { ...item, [field]: value } : item
        )
      );
      setSelectedData((prevData) =>
        prevData.map((item) =>
          item.KutchaCatalogId === id ? { ...item, [field]: value } : item
        )
      );
    }

    if (
      field?.toString() === "auctioneerValuation" ||
      field?.toString() === "markPackageComments" ||
      field?.toString() === "lotComments" ||
      field?.toString() === "qualityComments"
    ) {
      const regex = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-|]+$/;

      if (regex.test(value) || value === "") {
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "",
        }));
      } else {
        setData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.KutchaCatalogId === id ? { ...item, [field]: value } : item
          )
        );
        // console.log("Sample Qwantity is able to dasimal");
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "Two digits after decimal point allowed.",
        }));
        return;
      }
    }

    // if (!value) {
    //   setValidationErrors((prevErrors) => ({
    //     ...prevErrors,
    //     [field]: "Field is required.",
    //   }));
    //   return;
    // }

    // setValidationErrors((prevErrors) => ({
    //   ...prevErrors,
    //   [field]: "", // Clear the error message
    // }));
  };
  // const handleSaveCell = (id, field, value) => {
  //   setData((prevData) =>
  //     prevData.map((item) =>
  //       item.KutchaCatalogId === id ? { ...item, [field]: value } : item
  //     )
  //   );
  // };
  const KuchaketCatalogForAuctioneer = [
    "Lot No.",
    "Invoice No.",
    "Origin",
    "Tea Type",
    "Sub Tea Type",
    "Category",
    "Mark",
    "Session Type",
    "Grade",
    "Package Type",
    "Package No.",
    "No. of Packages",
    "Sample Qty.(Kgs)",
    "Gross Weight",
    "Tare Weight",
    "Net Weight",
    "Invoice Weight",
    "Short/Excess Weight",
    "Manufacture From Date",
    "Manufacture To Date",
    "GP No",
    "GP Date",
    "Base Price",
    "Reserve Price",
    "Auctioneer Valuation",
    // "Default value should be 1 and hidden",
    "Mark & Package Comments",
    "Lot Comments",
    "Quality Comments",
    "Price Increment",
    // "Quality Certification",
    // "Brew Color",
    // "Age of Products (In Months)",
    // "Brewers Comments",
    // "Garden Certification",
    "Warehouse",
    "Location Inside Warehouse",
    "Remarks",
    "Last Modified By",
    "Market  / Lot Type",
    // "action",
  ];

  // Extract property names from the first data object
  const propertyNames =
    auctionType === "ENGLISH"
      ? [
          "LotNo",
          "invoiceNo",
          "origin",
          "teaTypeName",
          "subTeaTypeName",
          "categoryName",
          "markName",
          "sessionTypeName",
          "gradeName",
          "packageType",
          "packageNo",
          "totalPackages",
          "SampleQty",
          "grossKgs",
          "tareKgs",
          "netKgs",
          "invoiceWeight",
          "shortExcessWeight",
          "manufactureFromDate",
          "manufactureToDate",
          "gpNo",
          "gpDate",
          "basePrice",
          "reservePrice",
          "auctioneerValuation",
          "markPackageComments",
          "lotComments",
          "qualityComments",
          "priceIncrement",
          "wareHouseName",
          "locationInsideWarehouse",
          "remarks",
          "lastModifiedBy",
          "lotType",
          // "action",
        ]
      : [
          "LotNo",
          "invoiceNo",
          "teaTypeName",
          "subTeaTypeName",
          "categoryName",
          "markName",
          "gradeName",
          "marketTypeName",
          "packageType",
          "packageNo",
          "totalPackages",
          "SampleQty",
          "grossKgs",
          "tareKgs",
          "netKgs",
          "invoiceWeight",
          "shortExcessWeight",
          "manufactureFromDate",
          "manufactureToDate",
          "gpNo",
          "gpDate",
          "basePrice",
          "reservePrice",
          "auctioneerValuation",
          "markPackageComments",
          "lotComments",
          "qualityComments",
          "qualityCertification",
          "priceIncrement",
          "brewColor",
          "ageOfProducts",
          "brewersComments",
          "gardenCertification",
          "wareHouseName",
          "locationInsideWarehouse",
          "remarks",
          "lastModifiedBy",
          "SystemBasePrice",
          // "factoryId",
        ];
  const nonEditableColumns = [
    "KutchaCatalogId",
    "LotNo",
    "invoiceId",
    "invoiceNo",
    "teaTypeId",
    "subTeaTypeId",
    "subTeaTypeName",
    "categoryId",
    "categoryName",
    "markId",
    "markName",
    "tareKgs",
    "netKgs",
    "invoiceWeight",
    "shortExcessWeight",
    "manufactureFromDate",
    "manufactureToDate",
    "gpNo",
    "gpDate",
    "gradeId",
    "gradeName",
    "marketTypeId",
    "marketTypeName",
    "sessionTypeId",
    "sessionTypeName",
    "packageType",
    "packageNo",
    "totalPackages",
    "teaTypeName",
  ]; // Add column names that are not editable

  useEffect(() => {
    dispatch(fetchMarkTypeRequest());
    // dispatch(fetchWarehouseUserRequest({ auctionCenterId }));

    //     dispatch(fetchSubTeaTypeRequest(formik.values.teaType));
  }, []);
  // console.log(data, selectedData, "checkedDatacheckedDatacheckedData");

  const markType = useSelector((state) => state.mark.markTypeData.responseData);

  return (
    <div>
      {auctionType === "ENGLISH" ? (
        <Grid
          rows={data?.length > 0 ? data : []}
          columns={
            markTypeValue !== "0"
              ? [
                  ...KuchaketCatalogForAuctioneer.map((ele, index) => {
                    return { title: ele, name: propertyNames[index] };
                  }),
                  {
                    title: "Action",
                    name: "action",
                  },
                ].map((obj) => ({
                  ...obj,
                  getCellValue: (row) =>
                    obj.name === "action" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenUploadUpdateValuation(true);
                            setauctioncatalogIdforupload(row.KutchaCatalogId);
                            // debugger
                            axiosMain
                              .post(
                                "/preauction/EnglishAuctionKutchaCatalogue/GetKutchaCatalogValuationByParam",
                                // axios
                                //   .post(
                                //     "http://192.168.100.164:5080/preauction/EnglishAuctionKutchaCatalogue/GetKutchaCatalogValuationByParam",
                                // axios
                                //   .post(
                                //     "http://192.168.100.205:5080/preauction/AuctionCatalog/GetMyCatalogValuationByParam?role=" +
                                //       roleCode,
                                {
                                  KutchaCatalogId: row.KutchaCatalogId,
                                  auctioneerId: userId,
                                  auctionCenterId: auctionCenterId,
                                  season: formik.values.season.toString(),
                                  saleNo: parseInt(formik.values.saleNo),
                                }
                              )
                              .then((res) => {
                                setGetDataByprems(res.data.responseData);
                              });
                          }}
                        >
                          <i class="fa fa-edit"></i>
                        </button>
                        {/* <button type="button" onClick={() => setOpenMyPlanner(true)}>
                     Add Valuation
                   </button> */}
                      </>
                    ) : row[obj.name] === null ? (
                      "-"
                    ) : (
                      row[obj.name]
                    ),
                }))
              : [
                  ...KuchaketCatalogForAuctioneer.map((ele, index) => {
                    return { title: ele, name: propertyNames[index] };
                  }),
                ].filter((ele) => ele.name !== "LotNo")
          }
        >
          <PagingState defaultCurrentPage={0} pageSize={6} />

          <IntegratedPaging />
          <Table />
          <TableHeaderRow />
          <PagingPanel />
        </Grid>
      ) : (
        <table className="table table-responsive">
          <thead>
            <tr>
              {status?.toString() === "0" ? (
                ""
              ) : (
                <th>
                  <input
                    type="checkbox"
                    checked={
                      rows.length > 0
                        ? selectedData.length === rows.length
                        : false
                    }
                    onChange={() => {
                      // setAllChacked(!allCheked)

                      // .map((ele) =>
                      //   // handleCheckboxChange(ele.KutchaCatalogId)
                      //   setSelectedData(ele)
                      // )
                      setAllChacked(!allCheked);

                      if (selectedData.length === rows.length) {
                        setSelectedData([]);
                      } else {
                        // setAllChacked(!allCheked);
                        setSelectedData(rows);
                      }
                    }}
                  />
                </th>
              )}

              {/* {propertyNames?.map((propertyName) => (
                    <th key={propertyName}>{propertyName}</th>
                  ))} */}
              <th>Lot No.</th>
              <th>Invoice No. </th>

              <th>Tea Type </th>
              <th>Sub Tea Type</th>
              <th>Category</th>
              <th>Mark</th>
              {auctionType !== "ENGLISH" ? "" : <th>Session Type</th>}

              <th>Grade</th>
              {auctionType !== "ENGLISH" ? <th>Market Type</th> : ""}

              <th>Package Type</th>
              <th>Package Number</th>
              {auctionType !== "ENGLISH" ? (
                <th>Total Packages</th>
              ) : (
                <th>No. of Packages</th>
              )}
              {auctionType !== "ENGLISH" ? (
                <th>Sample Quantity</th>
              ) : (
                <th>Sample Qty.(Kgs)</th>
              )}
              {auctionType !== "ENGLISH" ? (
                <th>Gross Kilograms</th>
              ) : (
                <th>Gross Weight</th>
              )}
              {auctionType !== "ENGLISH" ? (
                <th>Tare Kilograms</th>
              ) : (
                <th>Tare Weight</th>
              )}
              {auctionType !== "ENGLISH" ? (
                <th>Net Kilograms</th>
              ) : (
                <th>Net Weight</th>
              )}
              <th>Invoice Weight</th>
              <th>Short/Excess Weight</th>
              <th>Manufacture Date From</th>
              <th>Manufacture Date To</th>
              <th>GP Number</th>
              <th>GP Date</th>
              <th>Base Price</th>
              <th>Reserve Price</th>
              <th>Auctioneer Valuation</th>
              <th>Mark Package Comments</th>
              <th>Lot Comments</th>
              <th>Quality Comments</th>
              {auctionType !== "ENGLISH" ? (
                <>
                  <th>Quality Certification</th>
                  <th>Price Increment</th>
                  <th>Brew Color</th>
                  <th>Age of Products</th>
                  <th>Brewer's Comments</th>
                  <th>Garden Certification</th>
                </>
              ) : (
                ""
              )}
              <th>Warehouse</th>
              <th>Location Inside Warehouse</th>
              <th>Remarks</th>
              <th>Last Modified By</th>
              {/* <th>Market Type Duplicate</th> */}
              <th>System Base Price</th>
              {/* <th>Factory ID</th> */}
              {/* <th>Last Modified Date By</th> */}
            </tr>
          </thead>
          <tbody>
            {rows?.length > 0 ? (
              data?.map((item) => (
                // auctionType === "ENGLISH" ? (
                //   <tr key={item.KutchaCatalogId}>
                //     {propertyNames.map((propertyName) => (
                //       <td>{item[propertyName]}</td>
                //     ))}
                //   </tr>
                // ) :
                <tr key={item.KutchaCatalogId}>
                  {status === "0" ? (
                    ""
                  ) : status?.toString() === "0" ? (
                    ""
                  ) : (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedData.some(
                          (selectedItem) =>
                            selectedItem.KutchaCatalogId ===
                            item.KutchaCatalogId
                        )}
                        onChange={() => {
                          setChecked(!checked);
                          handleCheckboxChange(item.KutchaCatalogId);
                        }}
                      />
                    </td>
                  )}
                  {propertyNames
                    .filter((ele) =>
                      auctionType !== "ENGLISH"
                        ? ele
                        : ele === "qualityCertification" &&
                          ele === "priceIncrement" &&
                          ele === "brewColor" &&
                          ele === "ageOfProducts" &&
                          ele === "brewersComments" &&
                          ele === "gardenCertification"
                    )
                    .map((propertyName) => (
                      <td key={`${item.KutchaCatalogId}-${propertyName}`}>
                        {nonEditableColumns
                          .filter((ele) =>
                            auctionType !== "ENGLISH"
                              ? ele
                              : ele === "qualityCertification" &&
                                ele === "priceIncrement" &&
                                ele === "brewColor" &&
                                ele === "ageOfProducts" &&
                                ele === "brewersComments" &&
                                ele === "gardenCertification"
                          )
                          .includes(propertyName) ? (
                          item[propertyName]
                        ) : propertyName === "priceIncrement" &&
                          selectedData.some(
                            (obj) =>
                              obj.KutchaCatalogId === item.KutchaCatalogId
                          ) ? (
                          editing ? (
                            <input
                              type="textarea"
                              value={item[propertyName]}
                              onChange={(e) =>
                                handleSaveCell(
                                  item.KutchaCatalogId,
                                  propertyName,
                                  e.target.value
                                )
                              }
                              maxLength={5}
                            />
                          ) : (
                            item[propertyName]
                          )
                        ) : propertyName === "gpDate" &&
                          selectedData.some(
                            (obj) =>
                              obj.KutchaCatalogId === item.KutchaCatalogId
                          ) ? (
                          editing ? (
                            <input
                              type="date"
                              value={item[propertyName]}
                              onChange={(e) =>
                                handleSaveCell(
                                  item.KutchaCatalogId,
                                  propertyName,
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            item[propertyName]
                          )
                        ) : editing &&
                          propertyName === "MarketType" &&
                          selectedData.some(
                            (obj) =>
                              obj.KutchaCatalogId === item.KutchaCatalogId
                          ) ? (
                          <select
                            value={item[propertyName]}
                            onChange={(e) =>
                              handleSaveCell(
                                item.KutchaCatalogId,
                                propertyName,
                                e.target.value
                              )
                            }
                          >
                            {markType?.length > 0 ? (
                              markType?.map((item, index) => (
                                <option value={item.marketTypeId} key={index}>
                                  {item.marketTypeName}
                                </option>
                              ))
                            ) : (
                              <option>No Data</option>
                            )}
                          </select>
                        ) : editing &&
                          propertyName === "subTeaTypeId" &&
                          selectedData.some(
                            (obj) =>
                              obj.KutchaCatalogId === item.KutchaCatalogId
                          ) ? (
                          <select
                            value={item[propertyName]}
                            onChange={(e) =>
                              handleSaveCell(
                                item.KutchaCatalogId,
                                propertyName,
                                e.target.value
                              )
                            }
                          >
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                          </select>
                        ) : editing &&
                          selectedData.some(
                            (obj) =>
                              obj.KutchaCatalogId === item.KutchaCatalogId
                          ) ? (
                          <>
                            <input
                              type={
                                [
                                  "markPackageComments",
                                  "lotComments",
                                  "qualityComments",
                                  "qualityCertification",
                                  "priceIncrement",
                                  "brewColor",
                                  "ageOfProducts",
                                  "brewersComments",
                                  "gardenCertification",
                                  "locationInsideWarehouse",
                                  "remarks",
                                  "lastModifiedBy",
                                ]?.includes(propertyName)
                                  ? "text"
                                  : "number"
                              }
                              value={item[propertyName]}
                              onChange={(e) =>
                                handleSaveCell(
                                  item.KutchaCatalogId,
                                  propertyName,
                                  e.target.value
                                )
                              }
                            />
                            {validationErrors[propertyName] && (
                              <div className="ValidationError">
                                {validationErrors[propertyName]}
                              </div>
                            )}
                          </>
                        ) : //: propertyName === "SystemBasePrice" ? (
                        //   10
                        // )
                        propertyName === "wareHouseName" ? (
                          item[propertyName]
                        ) : (
                          item[propertyName]
                        )}
                      </td>
                    ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={53}>
                  <div className="NoData">No Records Found</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="row">
        <div className="col-12">
          <div className="BtnGroup">
            {selectedData?.length > 0 ? (
              <button
                disabled={selectedData?.length > 0 ? false : true}
                className="SubmitBtn"
                onClick={() => setOpenDelete(true)}
              >
                Remove
              </button>
            ) : (
              ""
            )}

            {rows?.length > 0 ? (
              editing && selectedData.length > 0 ? (
                <button
                  onClick={() => {
                    const updatedData = selectedData.map((ele) => {
                      let data = {
                        KutchaCatalogId: ele.KutchaCatalogId,
                        SampleQty: parseFloat(ele.SampleQty),
                        basePrice: parseFloat(ele.basePrice),
                        reservePrice: parseFloat(ele.reservePrice),
                        auctioneerValuation: parseFloat(
                          ele.auctioneerValuation
                        ),
                        priceIncrement: parseFloat(ele.priceIncrement),
                        markPackageComments: ele.markPackageComments,
                        lotComments: ele.lotComments,
                        qualityComments: ele.qualityComments,
                        qualityCertification: ele.qualityCertification,
                        brewColor: ele.brewColor,
                        ageOfProducts: parseFloat(ele.ageOfProducts),
                        brewersComments: ele.brewersComments,
                        gardenCertification: ele.gardenCertification,
                        locationInsideWarehouse: ele.locationInsideWarehouse,
                        remarks: ele.remarks,
                        SystemBasePrice: parseFloat(ele.SystemBasePrice),
                        updatedBy: userId, //auctioner
                        auctionCenterId: auctionCenterId,
                      };
                      return data;
                    });

                    console.log(
                      // updatedData.some((ele) => isNaN(ele.SampleQty)),
                      // updatedData.map((ele) =>
                      //   isNaN(ele.SampleQty)
                      //     ? CustomToast.warning("Please Enter sample qty")
                      //     : ""
                      // ),
                      updatedData.map((ele) => isNaN(ele.SampleQty)),
                      "updatedDataupdatedData"
                    );
                    if (updatedData.some((ele) => isNaN(ele.SampleQty))) {
                      CustomToast.warning("Please Enter sample qty");
                    } else {
                      if (
                        updatedData.some(
                          (ele) => ele.gardenCertification === null
                        )
                      ) {
                        CustomToast.warning(
                          "Please Enter Garden Certification"
                        );
                      } else {
                        axiosMain
                          .post(
                            `/preauction/${baseUrlEng}/UpdateKutchaCatalogueDetails`,
                            updatedData
                          )
                          .then((res) => {
                            if (res.data.statusCode === 200) {
                              CustomToast.success(res.data.message);
                              handleEditToggle();
                              setSelectedData([]);
                            } else {
                              CustomToast.error(res.data.message);
                            }
                          })
                          .catch(({ errors }) =>
                            CustomToast.error(errors.data.message)
                          );
                      }
                    }

                    // console.log(data, updatedData, "datadata");
                  }}
                >
                  Save Changes
                </button>
              ) : auctionType === "ENGLISH" ? (
                ""
              ) : (
                modalRight?.includes("1") && (
                  <button
                    className="SubmitBtn"
                    onClick={() => {
                      if (selectedData.length > 0) {
                        handleEditToggle();
                      } else {
                        CustomToast.warning(
                          "Please select one or more row to edit that row"
                        );
                      }
                    }}
                  >
                    Edit
                  </button>
                )
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        show={openDelete}
        title={
          "Are you sure you want to remove this lot(" +
          selectedData.map((ele) => ele.LotNo).join(", ") +
          ")?"
        }
        isokbutton={"YesNo"}
        onDelete={async () => {
          if (data?.length > 0) {
            try {
              const response = await axiosMain.post(
                `/preauction/${baseUrlEng}/DeleteKutchaCatalogueDetails`,
                {
                  season: data?.at(0)?.season,
                  saleNo: data?.at(0)?.saleNo,
                  KutchaCatalogIds: selectedData
                    .map((ele) => ele.KutchaCatalogId)
                    .join(", "),
                  userId: userId,
                  auctionCenterId: auctionCenterId,
                }
              );

              if (response.status === 200) {
                CustomToast.success(response.data.message);
                setOpenDelete(false);
              }
            } catch (error) {
              console.error("Error deleting:", error);
              CustomToast.error("An error occurred while deleting.");
            }
          }
        }}
        onHide={() => {
          setOpenDelete(false);
        }}
      />
      <UpdateValuation
        openUploadUpdateValuation={openUploadUpdateValuation}
        setOpenUploadUpdateValuation={setOpenUploadUpdateValuation}
        getDataByPrems={getDataByPrems}
        auctionCatalogDetail={formik.values}
        setGetDataByprems={setGetDataByprems}
        auctioncatalogIdforupload={auctioncatalogIdforupload}
        baseUrlEng={"EnglishAuctionKutchaCatalogue"}
        kutchaCatalog={true}
      />
    </div>
  );
};

export default KutchaTable;
