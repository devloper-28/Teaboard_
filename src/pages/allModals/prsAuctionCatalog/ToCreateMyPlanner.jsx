import React from "react";
import { useFormik } from "formik";
import axiosMain from "../../../http/axios/axios_main";
import  CustomToast  from "../../../components/Toast";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";

const ToCreateMyPlanner = ({
  openMyPlanner,
  setOpenMyPlanner,
  myCatalogDetails,
  selectedData,
  loggedUser,
  setSelectedData,
}) => {
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId } =
  useAuctionDetail();
  // Initialize Formik using the useFormik hook
  const formik = useFormik({
    initialValues: {
      origin: "",
      mark: "",
      grade: "",
    },
    onSubmit: (values) => {
      // This function will be called when the form is submitted
      console.log("Form data submitted:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row">
        <div className="col-lg-3">
          <div className="FormGroup">
            <label htmlFor="origin">Origin</label>
            <select
              id="origin"
              name="origin"
              className="form-control select-form"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.origin}
            >
              <option value="">Select Origin</option>
              <option value="Darjeeling">Darjeeling</option>
              <option value="Assam">Assam</option>
              <option value="Ceylon">Ceylon</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="FormGroup">
            <label htmlFor="mark">Mark</label>
            <select
              id="mark"
              name="mark"
              className="form-control select-form"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mark}
            >
              <option value="">Select Mark</option>
              <option value="Highland">Highland</option>
              <option value="Golden">Golden</option>
              <option value="Premium">Premium</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="FormGroup">
            <label htmlFor="grade">Grade</label>
            <select
              id="grade"
              name="grade"
              className="form-control select-form"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.grade}
            >
              <option value="">Select Grade</option>
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
              <option value="Grade C">Grade C</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>

        <div className="BtnGroup col-lg-3">
          <button type="submit" className="SubmitBtn btn">
            Search
          </button>
          <button
            type="button"
            className="SubmitBtn btn"
            onClick={() => {
              if (loggedUser?.userCode === "buyer") {
                let KutchaCatalogId = "";

                selectedData.map(
                  (ele) =>
                    (KutchaCatalogId =
                      KutchaCatalogId === ""
                        ? ele.KutchaCatalogId.toString()
                        : KutchaCatalogId +
                          "," +
                          ele.KutchaCatalogId.toString())
                );

                axiosMain
                  .post("/preauction/Buyer/AddToMyCatalog", {
                    kutchaCatalogIds: KutchaCatalogId,
                    buyerId: userId,
                    auctionCenterId: auctionCenterId,
                  })
                  .then((res) => {
                    if (res.data.statusCode === 200) {
                      CustomToast.success(res.data.message);
                      setSelectedData([]);
                    } else {
                      CustomToast.error(res.data.message);
                      setSelectedData([]);
                    }
                  });
              }
            }}
          >
            Add to My Catalog{" "}
          </button>
          <button
            type="submit"
            className="SubmitBtn btn"
            onClick={() => setOpenMyPlanner(true)}
            disabled={myCatalogDetails.length > 0 ? false : true}
          >
            Create My Planner
          </button>
        </div>
      </div>
      {/* <div className="row mt-4">
        
      </div> */}
    </form>
  );
};

export default ToCreateMyPlanner;
