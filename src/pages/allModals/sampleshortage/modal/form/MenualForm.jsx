import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axiosMain from "../../../../../http/axios/axios_main";
import CustomToast from "../../../../../components/Toast";
import { useAuctionDetail } from "../../../../../components/common/AunctioneerDeteailProvider";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchSampleShortageListRequest } from "../../../../../store/actions";

const validationSchema = Yup.object().shape({
  InspectionChgs: Yup.string()
    .required("Please enter appropriate Inspection Charges.")
    .test(
      "is-numeric-or-float",
      "Invalid value for InspectionChgs",
      (value) => {
        // Regular expression to allow numeric and float values
        return /^[0-9]+(\.[0-9]+)?$/.test(value);
      }
    ),
  LOTNO: Yup.string().required("LOTNO is required"),
  PACKAGENO: Yup.string().required("PACKAGENO is required"),
  ReInspectionChgs: Yup.string()
    .required("ReInspectionChgs is required")
    .test(
      "is-numeric-or-float",
      "Please enter appropriate Re-inspection Charges.",
      (value) => {
        // Regular expression to allow numeric and float values
        return /^[0-9]+(\.[0-9]+)?$/.test(value);
      }
    ),
  SAMPLEWT: Yup.string()
    .required("SAMPLEWT is required")
    .test(
      "is-numeric-or-float",
      "Please enter appropriate Sample Weight.",
      (value) => {
        // Regular expression to allow numeric and float values
        return /^[0-9]+(\.[0-9]+)?$/.test(value);
      }
    ),
  SHORTWT: Yup.string()
    .required("SHORTWT is required")
    .test(
      "is-numeric-or-float",
      "Please enter appropriate Short Weight.",
      (value) => {
        // Regular expression to allow numeric and float values
        return /^[0-9]+(\.[0-9]+)?$/.test(value);
      }
    ),
});

const MenualForm = ({
  rows,
  setRows,
  handleSubmit,
  isDisable,
  isEdit,
  seasonpass,
  saleNopass,
  setExpandedTab,
}) => {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
    auction,
    auctionTypeMasterCode,
  } = useAuctionDetail();
  const [auctionTypeCode, setAuctionTypeCode] = useState(auctionTypeMasterCode);
  const baseUrlEng =
    auction === "ENGLISH" ? "EnglishAuctionSampleShortage" : "SampleShortage";
  console.log(baseUrlEng, "baseUrlEng");
  const [isDisabledPacakge, setIsDisabledPacakge] = useState(false);
  const [viewDataList, setViewDataList] = useState([
    // {
    //   LotNo: "Sach123AHM20231710-S ",
    //   categoryId: 10131,
    //   categoryName: "Crush Tear And Curl",
    //   gradeId: 4,
    //   gradeName: "Grade3",
    //   inspectionCharges: 10,
    //   invoiceId: 0,
    //   invoiceNo: "TEST11152",
    //   markId: 40,
    //   markName: "Orange",
    //   netKgs: 53,
    //   packageNo: "10-20",
    //   reInspectionCharges: 10,
    //   saleNo: 17,
    //   sampleWeight: "54",
    //   season: "2023",
    //   shortWeight: 2,
    //   shortWeightId: 0,
    //   teaTypeId: 85,
    //   teaTypeName: "Leaf",
    //   totalPackages: 11,
    //   totalSampleQty: 5,
    //   totalShortQty: 2,
    // },
    // {
    //   LotNo: "Sach123AHM20231710-S ",
    //   categoryId: 10131,
    //   categoryName: "Crush Tear And Curl",
    //   gradeId: 4,
    //   gradeName: "Grade3",
    //   inspectionCharges: 10,
    //   invoiceId: 0,
    //   invoiceNo: "TEST11152",
    //   markId: 40,
    //   markName: "Orange",
    //   netKgs: 53,
    //   packageNo: "10-20",
    //   reInspectionCharges: 10,
    //   saleNo: 17,
    //   sampleWeight: "54",
    //   season: "2023",
    //   shortWeight: 2,
    //   shortWeightId: 0,
    //   teaTypeId: 85,
    //   teaTypeName: "Leaf",
    //   totalPackages: 11,
    //   totalSampleQty: 5,
    //   totalShortQty: 2,
    // },
  ]);
  console.log(viewDataList, "viewDataList");
  const viewData = useSelector(
    (state) => state?.sampleShortageReducer?.data?.responseData
  );
  const newww = useSelector((state) => state?.sampleShortageReducer);
  console.log(newww, "newww");
  console.log(viewData, "viewData");
  const dispatch = useDispatch();
  // useEffect(() => {
  //   setViewDataList([]);
  // }, []);

  console.log(isDisable, "isDisableisDisable");
  const formik = useFormik({
    initialValues: {
      InspectionChgs: "",
      LOTNO: "",
      PACKAGENO: "",
      ReInspectionChgs: "",
      SAMPLEWT: "",
      SHORTWT: "",
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      // Call the API to create data
      setRows([...rows, values]);
      // let updatedData = rows;

      // //   console.log(values, "rowsrows");
      // if (isEdit) {

      // }
    },
  });
  useEffect(() => {
    if (viewData?.length > 0) {
      let data = viewData.map((ele) => {
        return {
          ...ele,
          sampleWeight: ele.sampleWeight === null ? 0 : ele.sampleWeight,
          shortWeight: ele.shortWeight === null ? 0 : ele.shortWeight,
          inspectionCharges:
            ele.inspectionCharges === null ? 0 : ele.inspectionCharges,
          reInspectionCharges:
            ele.reInspectionCharges === null ? 0 : ele.reInspectionCharges,
          isDisable:
            ele.packageNo === null || ele.packageNo === 0 ? false : true,
        };
      });
      setViewDataList(data);
    } else setViewDataList([]);

    if (isEdit) {
      formik.setFieldValue("PACKAGENO", viewData?.at(0)?.invPackageNo);
      formik.setFieldValue("SAMPLEWT", viewData?.at(0)?.sampleWeight);
      formik.setFieldValue("SHORTWT", viewData?.at(0)?.shortWeight);
      formik.setFieldValue(
        "InspectionChgs",
        viewData?.at(0)?.inspectionCharges
      );
      formik.setFieldValue(
        "ReInspectionChgs",
        viewData?.at(0).reInspectionCharges
      );
    } else {
      formik.setFieldValue("PACKAGENO", "");
    }
  }, [viewData]);
  console.log(viewDataList, "viewDataListviewDataList");

  /*----------Add Row----------*/

  function addnewRow(e) {
    e.preventDefault();
    setViewDataList([
      ...viewDataList,
      viewDataList
        .map((ele) => ({
          ...ele,
          inspectionCharges: 0,
          packageNo: 0,
          reInspectionCharges: 0,
          sampleWeight: 0,
          shortWeight: 0,
          isDisable: false,
        }))
        .at(0),
    ]);
  }

  /*---------Add Row-----------*/

  const sampleshortage = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },
    {
      name: "season",
      title: "Season",
    },
    {
      name: "saleNo",
      title: "Sale No",
    },
    // {
    //   name: "markName",
    //   title: "Mark",
    // },
    {
      name: "LotNo",
      title: "Lot No",
    },
    {
      name: "teaTypeName",
      title: "Tea Type",
    },
    {
      name: "invoiceNo",
      title: "Invoice No",
    },
    {
      name: "markName",
      title: "Mark",
    },
    {
      name: "gradeName",
      title: "Grade",
    },

    {
      name: "categoryName",
      title: "Category",
    },
    {
      name: "packageNo",
      title: "Packages No.",
    },
    {
      name: "totalPackages",
      title: "No Of Packages",
    },
    {
      name: "netKgs",
      title: "Net Weight",
    },
    // {
    //   name: "totalSampleQty",
    //   title: "Total Sample Qty",
    // },
    {
      name: "sampleWeight",
      title: "Sample Weight",
    },
    // {
    //   name: "totalShortQty",
    //   title: "Total Short Qty",
    // },
    {
      name: "shortWeight",
      title: "Short Weight",
    },
    {
      name: "inspectionCharges",
      title: "Inspection Charges",
    },
    {
      name: "reInspectionCharges",
      title: "Re-Inspection Charges",
    },
  ];

  // const handleInputChange = (event, name) => {
  //   const newData = viewDataList.map((item) => {
  //     if (item.name === name) {
  //       return { ...item, lotno: event.target.value };
  //     }
  //     return item;
  //   });
  //   setViewDataList(newData);
  // };

  const handleInputChange = (event, rowIndex, fieldName) => {
    const newValue = event.target.value;
    setViewDataList((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][fieldName] = newValue;
      return newData;
    });
  };

  const handlePrintData = () => {
    let data = viewDataList.map((ele) => {
      let result = {
        LotNo: ele.LotNo,
        packageNo: ele.packageNo,
        sampleWeight:
          parseFloat(ele.sampleWeight) === null
            ? 0
            : parseFloat(ele.sampleWeight),
        shortWeight:
          parseFloat(ele.shortWeight) === null
            ? 0
            : parseFloat(ele.shortWeight),
        inspectionCharges:
          parseFloat(ele.inspectionCharges) === null
            ? 0
            : parseFloat(ele.inspectionCharges),
        reInspectionCharges:
          parseFloat(ele.reInspectionCharges) === null
            ? 0
            : parseFloat(ele.reInspectionCharges),
        isActive: true,
        createdBy: userId, //auctioner
        updatedBy: userId, //auctioner
        auctionCenterId: auctionCenterId,

        // shortWeightId: parseInt(
        //   ele.shortWeightId === "" ? 0 : ele.shortWeightId
        // ),
        season: seasonpass?.toString(), //ele.season?.toString(),
        saleNo: parseInt(saleNopass === "" ? 0 : saleNopass), //parseInt(ele.saleNo === "" ? 0 : ele.saleNo),
      };
      return result;
    });
    let fileData = data.map((ele) => {
      let data = {
        LotNo: ele.LotNo?.toString(),
        packageNo: ele.packageNo?.toString(),
        createdBy: userId,
        season: seasonpass?.toString(), //ele.season?.toString(),
        saleNo: parseInt(saleNopass === "" ? 0 : saleNopass), //parseInt(ele.saleNo === "" ? 0 : ele.saleNo),
        auctionCenterId: auctionCenterId,
      };
      return data;
    });

    axiosMain
      .post(`/preauction/${baseUrlEng}/CheckPackageNoByLotNo`, fileData)
      .then((res) => {
        if (res.data.statusCode === 200) {
          // CustomToast.success(res.data.message);
          axiosMain
            .post(
              `/preauction/${baseUrlEng}/UploadSampleShortage?role=` + roleCode,
              data
            )
            // axios
            //   .post(
            //     "http://192.168.101.178:5080/preauction/SampleShortage/UploadSampleShortage?role=" +
            //       roleCode,
            //     data
            //   )
            .then((res) => {
              if (res.data.statusCode === 200) {
                const data = {
                  pageNumber: 1,
                  pageSize: 10,
                  season: seasonpass?.toString(), //ele.season?.toString(),
                  saleNo: parseInt(saleNopass === "" ? 0 : saleNopass), //parseInt(ele.saleNo === "" ? 0 : ele.saleNo),
                  markId: 0,
                  // === null ? parseInt(values.mark) : 0
                  auctioneerId: userId, //auctioner
                  auctionCenterId: auctionCenterId,
                };
                CustomToast.success(res.data.message);
                dispatch(
                  fetchSampleShortageListRequest(data, roleCode, baseUrlEng)
                );
                setExpandedTab("panel1");
                formik.resetForm();
              } else {
                CustomToast.error(res.data.message);
              }
            });
          // .catch((error) => CustomToast.error(error.data.errors));
        } else {
          CustomToast.error(res.data.message);
        }
      });

    // console.log(data);
  };
  const sampleshortageUpdate = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },
    // {
    //   name: "season",
    //   title: "Season",
    // },
    // {
    //   name: "saleNo",
    //   title: "Sale No",
    // },
    // {
    //   name: "markName",
    //   title: "Mark",
    // },
    {
      name: "LotNo",
      title: "Lot No",
    },
    {
      name: "markName",
      title: "Mark",
    },
    {
      name: "teaTypeName",
      title: "Tea Type",
    },
    {
      name: "invoiceNo",
      title: "Invoice No",
    },
    {
      name: "categoryName",
      title: "Category",
    },
    {
      name: "netKgs",
      title: "Net Weight",
    },
    {
      name: "gradeName",
      title: "Grade",
    },

    {
      name: "invPackageNo",
      title: "Package No",
    },
    // {
    //   name: "packageNo",
    //   title: "packageNo",
    // },
    // {
    //   name: "shortWeight",
    //   title: "Short Weight",
    // },
    // {
    //   name: "inspectionCharges",
    //   title: "Inspection Charges",
    // },
    // {
    //   name: "reInspectionCharges",
    //   title: "Re-Inspection Charges",
    // },
  ];

  return (
    <form onSubmit={formik.handleSubmit}>
      {viewDataList?.length > 0 && isDisable
        ? sampleshortage?.map((key, index) => (
            <div className="row">
              <div key={key.name} className="col-xl-2 col-lg-2 col-md-4">
                <label>{key.title}</label>
                <br />
                <input
                  className="form-control"
                  type="text"
                  value={viewDataList?.at(0)[key?.name]}
                  // value={viewDataList[key.name]}
                  // onChange={(e) => handleInputChange(e, key)}
                  disabled
                />
              </div>
            </div>
          ))
        : ""}
      {viewDataList?.length > 0 && isEdit ? (
        <>
          <div className="row">
            <div className="col-xl-2 col-lg-2 col-md-4">
              <label>Season</label>
              <br />
              <input
                type="text"
                value={seasonpass}
                // value={viewDataList[key.name]}
                // onChange={(e) => handleInputChange(e, key)}
                disabled
              />
            </div>
            <div className="col-xl-2 col-lg-2 col-md-4">
              <label>Sale No</label>
              <br />
              <input
                type="text"
                value={saleNopass}
                // value={viewDataList[key.name]}
                // onChange={(e) => handleInputChange(e, key)}
                disabled
              />
            </div>
            {sampleshortageUpdate?.map((key, index) => (
              <div key={key.name} className="col-xl-2 col-lg-2 col-md-4">
                <label>{key.title}</label>
                <br />
                <input
                  type="text"
                  value={viewDataList.at(0)[key.name]}
                  // value={viewDataList[key.name]}
                  // onChange={(e) => handleInputChange(e, key)}
                  disabled
                />
              </div>
            ))}
          </div>

          <div className="mb-5">
            <button
              type="button"
              className="btn SubmitBtn"
              onClick={addnewRow}
              style={{ float: "inline-end" }}
            >
              Add Row
            </button>
          </div>

          <table className="table mt-5">
            <thead>
              <tr>
                <th>Package No</th>
                <th>Sample Weight</th>
                <th>Short Weight</th>
                <th>Inspection Charges</th>
                <th>Re-Inspection Charges</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {viewDataList.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.packageNo === null ? 0 : item.packageNo}
                      onChange={(event) =>
                        handleInputChange(event, index, "packageNo")
                      }
                      disabled={
                        // viewData?.at(index)?.packageNo === null ||
                        // item.packageNo === 0
                        //   ? false
                        //   : true
                        item.isDisable
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.sampleWeight === null ? 0 : item.sampleWeight}
                      onChange={(event) =>
                        handleInputChange(event, index, "sampleWeight")
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.shortWeight === null ? 0 : item.shortWeight}
                      onChange={(event) =>
                        handleInputChange(event, index, "shortWeight")
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={
                        item.inspectionCharges === null
                          ? 0
                          : item.inspectionCharges
                      }
                      onChange={(event) =>
                        handleInputChange(event, index, "inspectionCharges")
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={
                        item.reInspectionCharges === null
                          ? 0
                          : item.reInspectionCharges
                      }
                      onChange={(event) =>
                        handleInputChange(event, index, "reInspectionCharges")
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="SubmitBtn"
                      onClick={() => {
                        setViewDataList(
                          viewDataList?.filter(
                            (ele, indexs) => indexs !== index
                          )
                        );
                      }}
                      disabled={
                        // viewData?.at(index)?.packageNo === null ||
                        // item.packageNo === 0
                        //   ? false
                        //   : true
                        item.isDisable || viewDataList.length === 1
                      }
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        ""
      )}
      {isDisable ? (
        ""
      ) : isEdit ? (
        <button
          type="button"
          className="btn SubmitBtn"
          onClick={handlePrintData}
        >
          Update
        </button>
      ) : (
        <>
          {" "}
          {/* <button type="submit">Add</button>
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              handleSubmit();
            }}
          >
            Create
          </button> */}
        </>
      )}
    </form>
  );
};

export default MenualForm;
