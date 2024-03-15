import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosMain from "../../../../http/axios/axios_main";
import { Button } from "react-bootstrap";
import CustomToast from "../../../../components/Toast";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";

const PrePostDate = ({
  dateAndTime,
  auctionSessionDetailId,
  setShow,
  setSmShow,
  setExpandedTab,
  baseUrlEng,
}) => {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
  } = useAuctionDetail();
  const initialValues = {
    date: dateAndTime?.saleDate.split("T")[0], // Assuming dateAndTime is an object with a 'date' property
    startTime: dateAndTime?.startDate.split("T")[1],
    endTime: dateAndTime?.enddate.split("T")[1], // Change the default end time as needed
  };

  const validationSchema = Yup.object({
    date: Yup.date().required("Date is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string()
      .required("End Time is required")
      .when("startTime", (startTime, schema) => {
        return schema.test(
          "is-after-start",
          "End Time must be after Start Time",
          function (endTime) {
            if (startTime && endTime) {
              return (
                new Date(`2000-01-01 ${endTime}`) >
                new Date(`2000-01-01 ${startTime}`)
              );
            }
            return true;
          }
        );
      }),
  });

  const onSubmit = (values) => {
    // Handle form submission here
    let data = {
      auctionSessionDetailId: auctionSessionDetailId,
      saleDate: values?.date + "T00:00:00",
      startDate: values?.date + "T" + values?.startTime,
      enddate: values?.date + "T" + values?.endTime,
      updatedBy: userId,
      auctionCenterId,
    };

    axiosMain
      .post(`preauction/${baseUrlEng}/PrePostponeAuctionSessionResponse`, data)
      .then((response) => {
        if (response.data.statusCode === 200) {
          CustomToast.success(response.data.message);
          setShow(false);
          setSmShow(false);
          setExpandedTab("panel1");
        } else {
          CustomToast.error(response.data.message);
        }
        // Handle the successful response
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        CustomToast.error(error.message);
      });
    console.log("Form submitted with values:", values, dateAndTime);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  //   useEffect(() => {

  //   }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row">
        <div className="col-md-4 datetimepicker">
          <label>Sale Date</label>
          <div className="input-group">
            <input
              type="date"
              id="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.date && formik.errors.date
                  ? "invalid form-control"
                  : "form-control"
              }
            />
          </div>
          {formik.touched.date && formik.errors.date && (
            <div className="error-message text-danger ">
              {formik.errors.date}
            </div>
          )}
        </div>
        <div className="col-md-4 datetimepicker">
          <label>Start Time</label>
          <div className="input-group">
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formik.values.startTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.startTime && formik.errors.startTime
                  ? "invalid form-control"
                  : "form-control"
              }
            />
          </div>
          {formik.touched.startTime && formik.errors.startTime && (
            <div className="error-message text-danger">
              {formik.errors.startTime}
            </div>
          )}
        </div>
        <div className="col-md-4 datetimepicker">
          <label>End Time</label>
          <div className="input-group">
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formik.values.endTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.endTime && formik.errors.endTime
                  ? "invalid form-control"
                  : "form-control"
              }
            />
          </div>
          {formik.touched.endTime && formik.errors.endTime && (
            <div className="error-message text-danger">
              {formik.errors.endTime}
            </div>
          )}
        </div>
      </div>
      <Button type="submit" className="SubmitBtn">
        Submit
      </Button>
    </form>
  );
};

export default PrePostDate;
