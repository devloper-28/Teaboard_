import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMarkTypeRequest } from "../../../../store/actions";
import { useSelector } from "react-redux";
import axiosMain from "../../../../http/axios/axios_main";
import CustomToast from "../../../../components/Toast";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import { Button, Modal } from "react-bootstrap";

const MaxBidEntryTable = ({ rows, setRows, modalRight, auctionType }) => {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
    auction,
  } = useAuctionDetail();

  const [data, setData] = useState(rows?.length > 0 ? rows : []);
  const [selectedData, setSelectedData] = useState([]);
  const [checked, setChecked] = useState(false);

  const [editing, setEditing] = useState(false);
  const [show, setShow] = useState(false);
  const [handleYes, setHandleYes] = useState(true);

  const [validationErrors, setValidationErrors] = useState({});
  const [baseUrlEng, setBaseUrlEng] = useState(auction === "English" ? "" : "");

  const dispatch = useDispatch();
  const handleClose = () => {
    setShow(false);
    setHandleYes(true);
  };

  useEffect(() => {
    setData(rows);
  }, [rows]);
  const handleCheckboxChange = (id) => {
    const isChecked = selectedData.some((item) => item.LotNo === id);

    // If the checkbox is checked, remove the data from selectedData
    setSelectedData(selectedData.filter((item) => item.LotNo !== id));
  };

  const handleAdd = (massage) => {
    let totalPackages = data.map((ele) => ele.totalPackages);
    let minAcceptableQty = data.map((ele) => ele.minAcceptableQty);
    let AutoBidLimit = data.map((ele) => ele.AutoBidLimit);
    let validateModal = data.map((ele, index) =>
      parseFloat(ele.LimitPrice) < AutoBidLimit?.at(index) ? ele.LotNo : ele
    );
    let valiDateData = data.map((ele, index) =>
      parseInt(ele.buyingQty) <= totalPackages?.at(index) &&
      parseInt(ele.buyingQty) >= minAcceptableQty?.at(index)
        ? ele
        : ele.LotNo
    );
    axiosMain
      // .post("/preauction/MaxBidEntry/UpdateMaxBidEntry", savedata)
      .post(
        `/preauction/${"EnglishAuctionMaxBidEntry"}/UploadMaxBidEntry?flag=${massage}`,
        valiDateData
          .filter((ele) => typeof ele !== "string")
          .map((ele) => {
            return {
              ...ele,
              status: ele.status === "Submitted" ? 1 : 0,
              createdBy: userId,
              updatedBy: userId,
              buyingQty: parseInt(ele.buyingQty),
              AutoBidLimit:
                parseInt(ele.AutoBidLimit) === null
                  ? 0
                  : parseInt(ele.AutoBidLimit),
              auctionCenterId,
            };
          })
      )
      .then((response) => {
        if (response.data.statusCode == 200) {
          CustomToast.success(response.data.message);
        } else {
          CustomToast.error(response.data.message);
          return false;
        }

        // Handle the successful response here
        console.log("Response:", response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error:", error);
      });
  };
  const savetabledata = () => {
    console.log(rows, "samardas");

    if (auctionType === "ENGLISH") {
      // savedata now contains only objects where interestedToBid is greater than 0
      let totalPackages = data.map((ele) => ele.totalPackages);
      let minAcceptableQty = data.map((ele) => ele.minAcceptableQty);
      let AutoBidLimit = data.map((ele) => ele.AutoBidLimit);
      let validateModal = data.map((ele, index) =>
        parseFloat(ele.LimitPrice) < AutoBidLimit?.at(index) ? ele.LotNo : ele
      );
      let valiDateData = data.map((ele, index) =>
        parseInt(ele.buyingQty) <= totalPackages?.at(index) &&
        parseInt(ele.buyingQty) >= minAcceptableQty?.at(index)
          ? ele
          : ele.LotNo
      );
      if (validateModal.filter((ele) => typeof ele === "string").length > 0) {
        // CustomToast.error(
        //   valiDateData.filter((ele) => typeof ele === "string").join(",")
        // );
        setShow(true);
        // console.log(validateModal, "Insert max bid data2");
      } else {
        // console.log(
        //   valiDateData.filter((ele) => typeof ele !== "string"),
        //   "Insert max bid data"
        // );

        handleAdd(false);
      }

      console.log(
        data.map((ele, index) =>
          parseInt(ele.buyingQty) < totalPackages?.at(index) &&
          parseInt(ele.buyingQty) > minAcceptableQty?.at(index)
            ? ele
            : ele.LotNo
        ),
        valiDateData.filter((ele) => typeof ele !== "string"),
        valiDateData.filter((ele) => typeof ele === "string"),
        "Insert max bid data"
      );
    } else {
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
      // console.log(data.filter((items) => parseInt(items.maxBidId) === 0 ? parseInt(items.interestedToBid) !== 0 : items),"datadata")

      savedata = data
        .filter((items) =>
          parseInt(items.maxBidId) === 0
            ? parseInt(items.interestedToBid) !== 0
            : items
        )
        .map((items) => {
          const Newdatas = {
            auctionCenterId: auctionCenterId,
            LotNo: items?.LotNo?.toString(),
            interestedToBid: parseInt(items.interestedToBid),
            maxBid:
              parseInt(items.interestedToBid) === 0
                ? 0
                : parseInt(items.maxBid),
            maxBidId:
              items.maxBidId === "" || items.maxBidId === null
                ? 0
                : parseInt(items.maxBidId),
            //sessiontype:sessionType?.toString(),
            isActive: true,
            createdBy: userId,
            updatedBy: userId,
            buyerUserId: userId,
            status: items.status === "Submitted" ? 1 : 0,
            sessionTypeName:
              items.sessionTypeName !== null
                ? items.sessionTypeName.toString()
                : "",
          };
          return Newdatas;
          //   const Newdatas = {
          //     SaleProgramId: parseInt(items.SaleProgramId),
          //     auctionCenterId: auctionCenterId,
          //     kutchaCatalogId: parseInt(items.KutchaCatalogId),
          //     sessionTypeId: parseInt(items.sessionTypeId),
          //     teaTypeId: parseInt(items.teaTypeId),
          //     categoryId: parseInt(items.categoryId),
          //     markId: parseInt(items.markId),
          //     gradeId: parseInt(items.gradeId),
          //     invoiceId: parseInt(items.invoiceId),
          //     auctionCatalogId: parseInt(items.auctionCatalogId),
          //     interestedToBid: parseInt(items.interestedToBid),
          //     maxBid: parseInt(items.maxBid),
          //     isActive: true,
          //     createdBy: 2,
          //     updatedBy: 2,
          //     buyerUserId:userId,
          //     status: 1, // parseInt(items.status),
          //     LotNo: items.LotNo,
          //   };
          //   return Newdatas;
        });
      axiosMain
        // .post("/preauction/MaxBidEntry/UpdateMaxBidEntry", savedata)
        .post(
          `/preauction/${
            auctionType === "ENGLISH"
              ? "EnglishAuctionMaxBidEntry"
              : "MaxBidEntry"
          }/UploadMaxBidEntry`,
          savedata
        )
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
    }
  };
  const handleSaveCell = (id, field, value, itemnew) => {
    if (field === "interestedToBid") {
      itemnew = { ...itemnew, [field]: value !== "" ? parseInt(value) : 0 };
      // if (value !== "" ? parseInt(value) : 0 === 0) {
      //   itemnew = { ...itemnew, ...itemnew.maxBid= 0 };
      // }
    } else if (field === "maxBid") {
      itemnew = { ...itemnew, [field]: value !== "" ? parseInt(value) : 0 };
    } else itemnew = { ...itemnew, [field]: value.toString() };

    console.log(id, field, value, itemnew, "id, field, value");
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
            item.LotNo === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.LotNo === id ? { ...item, [field]: value } : item
          )
        );
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "",
        }));
      } else {
        setData((prevData) =>
          prevData.map((item) =>
            item.LotNo === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.LotNo === id ? { ...item, [field]: value } : item
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
      const dataList = data.filter((item) => item.LotNo === id)?.at(0);

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
            item.LotNo === id
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
            item.LotNo === id
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
            item.LotNo === id
              ? { ...item, [field]: value, netKgs: 0, invoiceWeight: 0 }
              : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.LotNo === id
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
          item.LotNo === id ? { ...item, [field]: value } : item
        )
      );
      setSelectedData((prevData) =>
        prevData.map((item) =>
          item.LotNo === id ? { ...item, [field]: value } : item
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
            item.LotNo === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.LotNo === id ? { ...item, [field]: value } : item
          )
        );
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "",
        }));
      } else {
        setData((prevData) =>
          prevData.map((item) =>
            item.LotNo === id ? { ...item, [field]: value } : item
          )
        );
        setSelectedData((prevData) =>
          prevData.map((item) =>
            item.LotNo === id ? { ...item, [field]: value } : item
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
    const index = data.findIndex((item) => item.LotNo === itemnew.LotNo);

    if (index !== -1) {
      data.splice(index, 1, { ...data[index], [field]: value });
    }

    if (field.toString() === "buyingQty") {
      data.splice(index, 1, {
        ...data[index],
        sharingQty: data[index]?.totalPackages - value,
      });
    }

    setSelectedData(data.map((item) => (item.LotNo === id ? itemnew : item)));
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
  //       item.LotNo === id ? { ...item, [field]: value } : item
  //     )
  //   );
  // };

  // Extract property names from the first data object
  const propertyNames =
    auctionType === "ENGLISH"
      ? [
          "LotNo",
          "teaTypeName",
          "categoryName",
          "markName",
          "gradeName",
          "invoiceNo",
          "totalPackages",
          "basePrice",
          "priceIncrement",
          "LSP_SP",
          "sharingQty",
          "buyingQty",
          "minAcceptableQty",
          "AutoBidLimit",
          "LimitPrice",
          "status",
          "createdBy",
          "lastModifiedBy",
          "sessionTypeName",
        ]
      : [
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
          "lastModifiedBy",
          "sessionTypeName",
          "status",
        ];
  const nonEditableColumns =
    auctionType === "ENGLISH"
      ? [
          "LotNo",
          "teaTypeName",
          "categoryName",
          "markName",
          "gradeName",
          "invoiceNo",
          "basePrice",
          "totalPackages",
          "priceIncrement",
          "LSP_SP",
          "sharingQty",
          "minAcceptableQty",
          "status",
          "createdBy",
          "lastModifiedBy",
          "sessionTypeName",
        ]
      : [
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
            <th>Lot No</th>
            <th>Tea Type</th>
            <th>Category Name</th>
            <th>Mark</th>
            <th>Grade</th>
            <th>Invoice No</th>
            {auctionType === "ENGLISH" ? (
              <>
                <th>Total Package</th>
                <th>Base Price</th>
              </>
            ) : (
              <>
                <th>Base Price for Normal Auction</th>
                <th>Base Price for PRS Auction</th>
              </>
            )}
            <th>Price Increment</th>
            <th>LSP/SP</th>
            {auctionType === "ENGLISH" ? (
              <>
                <th>SQ (Sharing Qty.)</th>
                <th>BQ@HBP (Buying Qty. @ Highest Bid Price)</th>
                <th>MAQ@HBP (Min. Acceptable Qty. @ Highest Bid Price)</th>
                <th>Auto Bid Limit (AB)</th>
                <th>Limit Price (LP)</th>
              </>
            ) : (
              <>
                <th>interestedtobid</th>
                <th>Max BID</th>
                <th>Invoice No</th>
                <th>Created By</th>
                <th>last Modified By</th>
                <th>Session Type</th>
              </>
            )}

            <th>Status</th>
            {auctionType === "ENGLISH" && (
              <>
                <th>Created By</th>
                <th>Last Modified By</th>
                <th>Session Type</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {rows?.length > 0 ? (
            data?.map((item) =>
              auctionType === "ENGLISH" ? (
                <tr key={item.LotNo}>
                  {/* <td>
                <input
                  type="checkbox"
                  checked={selectedData.some(
                    (selectedItem) =>
                      selectedItem.KutchaCatalogId === item.LotNo
                  )}
                  onChange={() => {
                    setChecked(!checked);

                    handleCheckboxChange(item.LotNo);
                  }}
                />
              </td> */}
                  {propertyNames.map((propertyName) => (
                    <td key={`${item.LotNo}-${propertyName}`}>
                      {nonEditableColumns.includes(propertyName) ? (
                        item[propertyName]
                      ) : propertyName === "lastModifiedBy" ? (
                        item[propertyName]
                      ) : propertyName.includes("buyingQty") ? (
                        <input
                          disabled={item.flag === 1 ? true : false}
                          type="number"
                          value={
                            item.buyingQty === 0 || item.buyingQty === "0"
                              ? 0
                              : item[propertyName]
                          }
                          onInput={(e) => {
                            if (parseInt(e.target.value) === 0) {
                              CustomToast.error(
                                "BQ@HBP cannot be ZERO in Lot No. " +
                                  item.LotNo +
                                  " in case of blank/zero entered"
                              );
                            } else {
                              if (
                                parseInt(e.target.value) > item.totalPackages
                              ) {
                                handleCheckboxChange(item.LotNo);
                                handleSaveCell(
                                  item.LotNo,
                                  propertyName,
                                  item.totalPackages,
                                  item
                                );
                              } else {
                                handleCheckboxChange(item.LotNo);
                                handleSaveCell(
                                  item.LotNo,
                                  propertyName,
                                  e.target.value,
                                  item
                                );
                              }
                            }
                          }}
                        />
                      ) : propertyName.includes("AutoBidLimit") ? (
                        <input
                          disabled={item.flag === 1 ? true : false}
                          type="number"
                          value={
                            item.AutoBidLimit === 0 || item.AutoBidLimit === "0"
                              ? 0
                              : item[propertyName]
                          }
                          onInput={(e) => {
                            handleCheckboxChange(item.LotNo);
                            handleSaveCell(
                              item.LotNo,
                              propertyName,
                              e.target.value,
                              item
                            );
                          }}
                        />
                      ) : propertyName.includes("LimitPrice") ? (
                        <input
                          disabled={item.flag === 1 ? true : false}
                          type="number"
                          value={
                            item.LimitPrice === 0 || item.LimitPrice === "0"
                              ? 0
                              : item[propertyName]
                          }
                          onInput={(e) => {
                            handleCheckboxChange(item.LotNo);
                            handleSaveCell(
                              item.LotNo,
                              propertyName,
                              e.target.value,
                              item
                            );
                          }}
                        />
                      ) : (
                        <select
                          disabled={item.flag === 1 ? true : false}
                          value={item[propertyName]}
                          onChange={(e) => {
                            handleCheckboxChange(item.LotNo);
                            handleSaveCell(
                              item.LotNo,
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
              ) : (
                <tr key={item.LotNo}>
                  {/* <td>
                  <input
                    type="checkbox"
                    checked={selectedData.some(
                      (selectedItem) =>
                        selectedItem.KutchaCatalogId === item.LotNo
                    )}
                    onChange={() => {
                      setChecked(!checked);

                      handleCheckboxChange(item.LotNo);
                    }}
                  />
                </td> */}
                  {propertyNames.map((propertyName) => (
                    <td key={`${item.LotNo}-${propertyName}`}>
                      {nonEditableColumns.includes(propertyName) ? (
                        item[propertyName]
                      ) : propertyName === "lastModifiedBy" ? (
                        item[propertyName]
                      ) : propertyName === "maxBid" ? (
                        <input
                          disabled={item.flag === 1 ? true : false}
                          type="text"
                          value={
                            item.interestedToBid === 0 ||
                            item.interestedToBid === "0"
                              ? 0
                              : item[propertyName]
                          }
                          onInput={(e) => {
                            handleCheckboxChange(item.LotNo);
                            handleSaveCell(
                              item.LotNo,
                              propertyName,
                              e.target.value,
                              item
                            );
                          }}
                        />
                      ) : (
                        <select
                          disabled={item.flag === 1 ? true : false}
                          value={item[propertyName]}
                          onChange={(e) => {
                            handleCheckboxChange(item.LotNo);
                            handleSaveCell(
                              item.LotNo,
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
              )
            )
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
            {modalRight?.includes("2") && rows?.length > 0 ? (
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Limit Price is less than Auto Bid Price or Bid Price. Do you want to
            continue?
          </Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body> */}
        <Modal.Footer>
          <div className="BtnGroup">
            <Button variant="primary" onClick={() => handleAdd(true)}>
              Yes
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              No
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MaxBidEntryTable;
