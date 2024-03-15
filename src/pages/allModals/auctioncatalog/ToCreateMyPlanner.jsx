import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axiosMain from "../../../http/axios/axios_main";
import CustomToast from "../../../components/Toast";
import { useSelector } from "react-redux";
import { fetchGradeRequest, fetchMarkRequest } from "../../../store/actions";
import { useDispatch } from "react-redux";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";

const ToCreateMyPlanner = ({
  openMyPlanner,
  saleProgramId,
  setOpenMyPlanner,
  myCatalogDetails,
  selectedData,
  loggedUser,
  setSelectedData,
  myCatalog
}) => {
   const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId,roleCode } =
    useAuctionDetail();
  const [markDataList, setMarkDataList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const dispatch = useDispatch();
  const grades = useSelector((state) => state.grade.data.responseData);
  const markList = useSelector((state) => state.mark.data.responseData);
  useEffect(() => {
    dispatch(fetchMarkRequest({auctionCenterId }));
    dispatch(fetchGradeRequest({auctionCenterId}));
  }, []);
  useEffect(() => {
    setMarkDataList(markList);
    setGradesList(grades);
  }, [markList, grades]);

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
        {/* <div className="col-lg-3">
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
              {/* Add more options as needed 
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
              {markDataList?.length > 0
                ? markDataList?.map((item, index) => (
                    <option value={item.markId} key={index}>
                      {item.markCode}
                    </option>
                  ))
                : "No Data"}
              {/* Add more options as needed 
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
              {gradesList?.length > 0
                ? gradesList?.map((item, index) => (
                    <option value={item.gradeId} key={index}>
                      {item.gradeCode}
                    </option>
                  ))
                : "No Data"}
              {/* Add more options as needed 
            </select>
          </div>
        </div> */}

        {/* <div className="BtnGroup col-lg-3">
          {/* <button type="submit" className="SubmitBtn btn">
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
                    SaleProgramId: saleProgramId,
                    buyerId: userId,
                    auctionCenterId: auctionCenterId,
                  })
                  .then((res) => {
                    if (res.data.statusCode === 200) {
                      CustomToast.success(res.data.message);
                      formik.values.sessionStartTime = timeData
                        ?.split(" - ")
                        ?.at(0);
                      formik.values.sessionEndTime = timeData?.split(" - ")[1];

                      axiosMain
                        .post("/preauction/Buyer/GetMyCatalog", {
                          season: formik.values.season,
                          saleNo: parseInt(formik.values.saleNo),
                          auctionDate: formik.values.auctionDate,
                          buyerId: userId,
                          // userId: formik.values.auctioneer,
                          sessionTime: formik.values.sessionTime,
                          teaTypeId: formik.values.teaType,
                          categoryId: formik.values.category,
                          sessionStartTime: formik.values.sessionStartTime,
                          sessionEndTime: formik.values.sessionEndTime,
                          auctionCenterId: auctionCenterId,
                        })
                        .then((res) => {
                          if (res.data.statusCode === 200) {
                            CustomToast.success(res.data.message);
                            setMyCatalogRows(res.data.responseData);
                          } else {
                            CustomToast.error(res.data.message);
                          }
                        });
                      setSelectedData([]);
                    } else {
                      CustomToast.error(res.data.message);
                      setSelectedData([]);
                    }
                  });
              }
            }}
          >
            Add to My Catalog
          </button>
          <button
            type="submit"
            className="SubmitBtn btn"
            onClick={() => setOpenMyPlanner(true)}
            disabled={myCatalogDetails.length > 0 ? false : true}
          >
            Create My Planner
          </button>
        </div> */}
      </div>
      {/* <div className="row mt-4">
        
      </div> */}
    </form>
  );
};

export default ToCreateMyPlanner;
