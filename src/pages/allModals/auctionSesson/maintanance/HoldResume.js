import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosMain from "../../../../http/axios/axios_main";
import { Button } from "react-bootstrap";
import CustomToast from "../../../../components/Toast";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";

const HoldResume = ({ prePostData, setShowResume, setShow,baseUrlEng }) => {
  console.log(prePostData, "prePostDataprePostData");
  const initialValues = {
    saleDate: prePostData?.saleDate, // Assuming dateAndTime is an object with a 'date' property
    startTime: "",
    endTime: "", // Change the default end time as needed
    Remarks: "",
  };
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
  } = useAuctionDetail();
  const validationSchema =
    prePostData.type === "hold"
      ? Yup.object({
          Remarks: Yup.string().required("Remarks is required"),
        })
      : Yup.object({
          saleDate: Yup.string().required("Sale Date is required"),
          startTime: Yup.string().required("Start Time is required"),
          endTime: Yup.string().required("End Time is required"),
          Remarks: Yup.string().required("Remarks is required"),
        });

  const onSubmit = (values) => {
    // Handle form submission here
    // debugger;
    if (prePostData !== null) {
      if (prePostData.type === "hold") {
        let datasave = {
          auctionSessionDetailId: prePostData.auctionSessionDetailId,
          remarks: values.Remarks,
          updatedBy: prePostData.updatedBy,
          auctionSessionId: prePostData.auctionSessionId,
          auctionCenterId: auctionCenterId,
          SaleProgramId: prePostData.SaleProgramId,
        };

        axiosMain
          .post(`/preauction/${baseUrlEng}/HoldAuctionSession`, datasave)
          .then((response) => {
            // Handle the successful response
            if (response.data.statusCode === 200) {
              CustomToast.success(response.data.message);
            } else {
              CustomToast.error(response.data.message);
            }
            // debugger;

            setShow(false);
          })
          .catch((error) => {
            // Handle any errors that occur during the request
            CustomToast.error(error.message);
            // setShow(false);
          });
      } else {
        let datasaveresume = {
          auctionSessionDetailId: prePostData.auctionSessionDetailId,
          resumeStartDate: values.saleDate + " " + values.startTime + ":00",
          resumeEndDate: values.saleDate + " " + values.endTime,
          remarks: values.Remarks,
          updatedBy: prePostData.updatedBy,
          auctionSessionId: prePostData.auctionSessionId,
          auctionCenterId: auctionCenterId,
          SaleProgramId: prePostData.SaleProgramId,
        };

        axiosMain
          .post(
            `/preauction/${baseUrlEng}/ResumeAuctionSession`,
            datasaveresume
          )
          .then((response) => {
            // Handle the successful response
            if (response.data.statusCode === 200) {
              CustomToast.success(response.data.message);
              setShowResume(false);

            } else {
              CustomToast.error(response.data.message);
            }
          })
          .catch((error) => {
            // Handle any errors that occur during the request
            CustomToast.error(error.message);
          });
      }
    } else {
      CustomToast.error("Error");
      return;
    }

    //console.log("Form submitted with values:", values, dateAndTime);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (formik?.values?.startTime !== "" && prePostData.type !== "hold") {
      axiosMain
        .post(`/preauction${baseUrlEng}BindEndDateForResume`, {
          auctionSessionDetailId: prePostData.auctionSessionDetailId,
          SaleProgramId: prePostData.SaleProgramId,
          resumeStartDate:
            formik.values.saleDate + " " + formik?.values?.startTime,
        })
        .then((res) => {
          console.log(
            res.data?.responseData?.at(0)?.ResumeEndDate?.split(" ")?.at(1),
            "prePostDataprePostData"
          );
          formik.setFieldValue(
            "endTime",
            res.data?.responseData?.at(0)?.ResumeEndDate?.split(" ")?.at(1)
          );
        });
    }
  }, [formik.values.startTime]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row">
        {prePostData.type !== "hold" ? (
          <>
            <div className="col-md-3 datetimepicker">
              <label>Sale Date</label>

              <div className="input-group">
                <input
                  type="date"
                  id="saleDate"
                  value={formik?.values?.saleDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.saleDate && formik.errors.saleDate
                      ? "invalid form-control"
                      : "form-control"
                  }
                />
              </div>

              {formik.touched.saleDate && formik.errors.saleDate && (
                <div className="error-message text-danger ">
                  {formik.errors.saleDate}
                </div>
              )}
            </div>
            <div className="col-md-3 datetimepicker">
              <label>Start Time</label>

              <div className="input-group">
                <input
                  type="time"
                  id="startTime"
                  value={formik?.values?.startTime}
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
                <div className="error-message text-danger ">
                  {formik.errors.startTime}
                </div>
              )}
            </div>
            <div className="col-md-3 datetimepicker">
              <label>End Time</label>
              <div className="input-group">
                <input
                  type="time"
                  id="endTime"
                  value={formik?.values?.endTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.endTime && formik.errors.endTime
                      ? "invalid form-control"
                      : "form-control"
                  }
                  disabled
                />
              </div>

              {formik.touched.endTime && formik.errors.endTime && (
                <div className="error-message text-danger ">
                  {formik.errors.endTime}
                </div>
              )}
            </div>
          </>
        ) : (
          ""
        )}

        <div className="col-md-3 datetimepicker">
          <label>Remarks</label>
          <div className="input-group">
            <input
              type="text"
              id="Remarks"
              name="Remarks"
              value={formik.values.Remarks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.Remarks && formik.errors.Remarks
                  ? "invalid form-control"
                  : "form-control"
              }
            />
          </div>
          {formik.touched.Remarks && formik.errors.Remarks && (
            <div className="error-message text-danger ">
              {formik.errors.Remarks}
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

export default HoldResume;
