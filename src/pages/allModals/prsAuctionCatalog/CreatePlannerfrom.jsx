import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosMain from "../../../http/axios/axios_main";
import { useEffect } from "react";
import { useState } from "react";
import  CustomToast  from "../../../components/Toast";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";


const CreatePlannerfrom = ({ myCatalogDetails,modalRight }) => {
  const [group, setGroupCode] = useState([]);
  const validationSchema = Yup.object({
    purchaseIndicator: Yup.string()
      .matches(/^\d{1,3}(,\s*\d{1,3})*$/, "Invalid Purchase Indicator")
      .nullable(),
    groupCode: Yup.string().nullable(),
    plannedQtyPkgs: Yup.string()
      .matches(/^[0-9]{1,4}$/, "Invalid Planned Qty (Pkgs)")
      .nullable(),
    plannedQtyKgs: Yup.string()
      .matches(/^[0-9]{1,7}$/, "Invalid Planned Qty (KGs)")
      .nullable(),
    plannedAmount: Yup.string()
      .matches(/^[0-9]{1,15}(\.[0-9]{1,2})?$/, "Invalid Planned Amount (INR)")
      .nullable(),
    remarks: Yup.string()
      .max(500, "Remarks must be at most 500 characters")
      .nullable(),
  });
   const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId,roleCode } =
    useAuctionDetail();
  const formik = useFormik({
    initialValues: {
      season: myCatalogDetails.season,
      saleNo: myCatalogDetails.saleNo,
      purchaseIndicator: "",
      groupCode: "",
      plannedQtyPkgs: "",
      plannedQtyKgs: "",
      plannedAmount: "",
      remarks: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Handle form submission, e.g., send data to the server
      console.log("Form submitted with values:", values);

      axiosMain
        .post("/preauction/Buyer/CreateMyPlanner", {
          season: "2023",
          saleNo: parseFloat(values.saleNo),
          purchaseIndicator: parseFloat(values.purchaseIndicator),
          groupId: parseInt(values.groupCode),
          PlannedQty_PKGS: parseInt(values.plannedQtyPkgs),
          PlannedQty_kGS: parseInt(values.plannedQtyKgs),
          PlannedAmount: parseInt(values.plannedAmount),
          Remarks: values.remarks,
          createdBy: myCatalogDetails.auctioneer,
          auctionCenterId: auctionCenterId
        })
        .then((res) => {
          if (res.data.statusCode === 204) {
            CustomToast.warning(res.data.message);
          } else if (res.data.statusCode === 200) {
            CustomToast.success(res.data.message);
          } else {
            CustomToast.error(res.data.message);
          }
        })
        .catch((error) => {
          CustomToast.error();
        });
      resetForm();
    },
  });
  useEffect(() => {
    axiosMain
      .post(
        "/preauction/Common/BindGroupMasterByBuyerUserId?buyerUserId=" + userId,
        {}
      )
      .then((res) => {
        if (res.data.message) {
          setGroupCode(res.data.responseData);
        } else {
          setGroupCode([]);
        }
      });
  }, []);
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-md-4">
            <div className="FormGroup">
              <label htmlFor="saleNo">Sale No.</label>
              <input
                type="text"
                id="saleNo"
                name="saleNo"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.saleNo}
                disabled
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="FormGroup">
              <label htmlFor="purchaseIndicator">Purchase Indicator (%)</label>
              <input
                type="text"
                id="purchaseIndicator"
                name="purchaseIndicator"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.purchaseIndicator}
              />
              {formik.touched.purchaseIndicator &&
              formik.errors.purchaseIndicator ? (
                <div className="error text-danger">
                  {formik.errors.purchaseIndicator}
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-md-4">
            <div className="FormGroup">
              <label htmlFor="groupCode">Group Code</label>
              <select
                id="groupCode"
                name="groupCode"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.groupCode}
              >
                <option value="">Select</option>
                {group?.map((item) => (
                  <option value={item.groupId}>{item.groupCode}</option>
                ))}
                {/* Add options for dropdown */}
              </select>
            </div>
          </div>

          <div className="col-md-4">
            <div className="FormGroup">
              <label htmlFor="plannedQtyPkgs">Planned Qty. (Pkgs)</label>
              <input
                type="text"
                id="plannedQtyPkgs"
                name="plannedQtyPkgs"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.plannedQtyPkgs}
              />
              {formik.touched.plannedQtyPkgs && formik.errors.plannedQtyPkgs ? (
                <div className="error text-danger">
                  {formik.errors.plannedQtyPkgs}
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-md-4">
            <div className="FormGroup">
              <label htmlFor="plannedQtyKgs">Planned Qty. (KGs)</label>
              <input
                type="text"
                id="plannedQtyKgs"
                name="plannedQtyKgs"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.plannedQtyKgs}
              />
              {formik.touched.plannedQtyKgs && formik.errors.plannedQtyKgs ? (
                <div className="error text-danger">
                  {formik.errors.plannedQtyKgs}
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-md-4">
            <div className="FormGroup">
              <label htmlFor="plannedAmount">Planned Amount (INR)</label>
              <input
                type="text"
                id="plannedAmount"
                name="plannedAmount"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.plannedAmount}
              />
              {formik.touched.plannedAmount && formik.errors.plannedAmount ? (
                <div className="error text-danger">
                  {formik.errors.plannedAmount}
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-md-4">
            <div className="FormGroup">
              <label htmlFor="remarks">Remarks</label>
              <textarea
                id="remarks"
                name="remarks"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.remarks}
              />
              {formik.touched.remarks && formik.errors.remarks ? (
                <div className="error text-danger">{formik.errors.remarks}</div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="BtnGroup">
          <button type="submit" className="SubmitBtn btn">
            Submit
          </button>
          <button
            type="button"
            className="SubmitBtn btn"
            onClick={formik.handleReset}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlannerfrom;
