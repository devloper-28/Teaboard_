import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMarkTypeRequest } from "../../../../store/actions";
import { useSelector } from "react-redux";
import axiosMain from "../../../../http/axios/axios_main";
import  CustomToast  from "../../../../components/Toast";

const PrsAuctionCatalogBuyerTable = ({ rows, setRows }) => {
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

  const [editing, setEditing] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    setData(rows);
  }, [rows]);
  const handleCheckboxChange = (id) => {
    const isChecked = selectedData.some((item) => item.KutchaCatalogId === id);

    // If the checkbox is checked, remove the data from selectedData
    setSelectedData(selectedData.filter((item) => item.KutchaCatalogId !== id));
  };

 

  const handleEditToggle = () => {
    setEditing(!editing);
  };
  const savetabledata = () => {
    console.log(rows, "samardas");
    let savedata = [];

    // data.map((items) => {
    //   const Newdatas={
    //     SaleProgramId:parseInt(items.SaleProgramId),
    //         auctionCenterId:2,
    //         kutchaCatalogId: parseInt(items.KutchaCatalogId),
    //         sessionTypeId: parseInt(items.sessionTypeId),
    //         teaTypeId: parseInt(items.teaTypeId),
    //         categoryId: parseInt(items.categoryId),
    //         markId: parseInt(items.markId),
    //         gradeId: parseInt(items.gradeId),
    //         invoiceId: parseInt(items.invoiceId),
    //         auctionCatalogId: parseInt(items.auctionCatalogId),
    //         interestedToBid:parseInt(items.interestedToBid),
    //         maxBid:parseInt(items.maxBid),
    //         isActive:true,
    //         createdBy:1,
    //         updatedBy: userId,
    //         buyerUserId:userId,
    //         status:1,//parseInt(items.status),
    //         LotNo: items.LotNo

    //   }
    //   savedata.push(Newdatas);

    // });

    savedata = data
      .filter((items) => parseInt(items.interestedToBid) > 0)
      .map((items) => {
        const Newdatas = {
          SaleProgramId: parseInt(items.SaleProgramId),
          auctionCenterId: 2,
          kutchaCatalogId: parseInt(items.KutchaCatalogId),
          sessionTypeId: parseInt(items.sessionTypeId),
          teaTypeId: parseInt(items.teaTypeId),
          categoryId: parseInt(items.categoryId),
          markId: parseInt(items.markId),
          gradeId: parseInt(items.gradeId),
          invoiceId: parseInt(items.invoiceId),
          auctionCatalogId: parseInt(items.auctionCatalogId),
          interestedToBid: parseInt(items.interestedToBid),
          maxBid: parseInt(items.maxBid),
          isActive: true,
          createdBy: userId,
          updatedBy: userId,
          buyerUserId: userId,
          status: 1, // parseInt(items.status),
          LotNo: items.LotNo,
        };
        return Newdatas;
      });

    // savedata now contains only objects where interestedToBid is greater than 0

    console.log(savedata, "Insert max bid data");
    axiosMain
      .post("/preauction/MaxBidEntry/InsertMaxBidEntry", savedata)
      .then((response) => {
        if (response.data.statusCode == 200) {
          CustomToast.success(response.data.message);
        } else {
          CustomToast.error(response.data.message);
          return false;
          return;
        }

        // Handle the successful response here
        console.log("Response:", response.data);
      })

      .catch((error) => {
        // Handle any errors here
        console.error("Error:", error);
      });
  };
  const handleSaveCell = (id, field, value, itemnew) => {
    itemnew = { ...itemnew, field: value.toString() };
    console.log(id, field, value, "id, field, value");
    if (
      field?.toString() === "SampleQty" ||
      field?.toString() === "grossKgs" ||
      field?.toString() === "shortExcessWeight" ||
      field?.toString() === "basePrice" ||
      field?.toString() === "maxBid"
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
      //set DATA from Here
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
    const index = data.findIndex(
      (item) => item.KutchaCatalogId === itemnew.KutchaCatalogId
    );

    if (index !== -1) {
      data.splice(index, 1, { ...data[index], [field]: value });
    }

    setSelectedData(
      data.map((item) => (item.KutchaCatalogId === id ? itemnew : item))
    );
    console.log("value updated:", value);
    console.log("Data updated:", data);
    console.log("SelectedData updated:", selectedData);
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

  // Extract property names from the first data object
  const propertyNames = [
    "LotNo",
    "teaTypeName",
    "categoryName",

    "markName",
    "gradeName",
    "invoiceNo",

    "basePrice",
    "basePrice",
    "priceIncrement",
    "LSP_SP",
    "interestedToBid",
    "maxBid",
    "invoiceNo",
    "createdBy",
    "updatedBy",
    "sessionTypeName",
    "status",
  ];
  const nonEditableColumns = [
    "LotNo",
    "teaTypeName",
    "categoryName",

    "markName",
    "gradeName",
    "invoiceNo",

    "basePrice",
    "basePrice",
    "priceIncrement",
    "LSP_SP",
    //"interestedtobid",
    //"maxbid",
    "invoiceNo",
    "createdBy",
    "updatedBy",
    "sessionTypeName",
    "status",
  ]; // Add column names that are not editable

  useEffect(() => {
    dispatch(fetchMarkTypeRequest());
    // dispatch(fetchWarehouseUserRequest({ auctionCenterId }));

    //     dispatch(fetchSubTeaTypeRequest(formik.values.teaType));
  }, []);

  const markType = useSelector((state) => state.mark.markTypeData.responseData);

  return (
    <div>
      <table className="table table-responsive">
        <thead>
          <tr>
            <td>Lot No</td>
            <td>Tea Type</td>
            <td>Category Name</td>
            <td>Mark</td>
            <td>Grade</td>
            <td>Invoice No</td>
            <td>Base Price for Normal Auction</td>
            <td>Base Price for PRS Auction</td>
            <td>Price Increment</td>
            <td>LSP/SP</td>
            <td>interestedtobid</td>
            <td>Max BID</td>
            <td>Invoice No</td>
            <td>Created By</td>
            <td>last Modified By</td>
            <td>Session Type</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {rows?.length > 0 ? (
            data?.map((item) => (
              <tr key={item.KutchaCatalogId}>
                {/* <td>
                  <input
                    type="checkbox"
                    checked={selectedData.some(
                      (selectedItem) =>
                        selectedItem.KutchaCatalogId === item.KutchaCatalogId
                    )}
                    onChange={() => {
                      setChecked(!checked);

                      handleCheckboxChange(item.KutchaCatalogId);
                    }}
                  />
                </td> */}
                {propertyNames.map((propertyName) => (
                  <td key={`${item.KutchaCatalogId}-${propertyName}`}>
                    {nonEditableColumns.includes(propertyName) ? (
                      item[propertyName]
                    ) : propertyName === "maxBid" ? (
                      <input
                        type="text"
                        value={item[propertyName]}
                        onInput={(e) => {
                          handleCheckboxChange(item.KutchaCatalogId);
                          handleSaveCell(
                            item.KutchaCatalogId,
                            propertyName,
                            e.target.value,
                            item
                          );
                        }}
                      />
                    ) : (
                      <select
                        value={item[propertyName]}
                        onChange={(e) => {
                          handleCheckboxChange(item.KutchaCatalogId);
                          handleSaveCell(
                            item.KutchaCatalogId,
                            propertyName,
                            e.target.value,
                            item
                          );
                        }}
                      >
                        <option value="0">N</option>
                        <option value="1">Y</option>
                      </select>
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={53}>
                <div className="NoData">No Data</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="row">
        <div className="col-12">
          <div className="BtnGroup">
            {rows?.length > 0 ? (
              <div className="row">
                <div className="col-12">
                  <div className="BtnGroup">
                    <button
                      className="SubmitBtn"
                      type="button"
                      onClick={savetabledata}
                    >
                      save data
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrsAuctionCatalogBuyerTable;
