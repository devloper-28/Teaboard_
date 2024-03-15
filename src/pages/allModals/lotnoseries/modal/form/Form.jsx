import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
  Table,
} from "react-bootstrap";
import CustomeFormCreater from "../../../../../components/common/formCreater/CustomeFormCreater";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  addLotSeriesRequest,
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchInvoiceDetailsRequest,
  fetchMarkRequest,
  fetchSaleProgramListRequest,
  fetchSubTeaTypeRequest,
  fetchWarehouseUserRequest,
  teaTypeAction,
  updateLotSeriesRequest,
} from "../../../../../store/actions";
// import { fetchSaleNumbersRequest } from "../../../../../store/actions/createdSaleNo/CreatedSaleNo";
import { useFormik } from "formik";
import axios from "axios";
import { setRef } from "@mui/material";
import axiosMain from "../../../../../http/axios/axios_main";
import CustomToast from "../../../../../components/Toast";
import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";
import { useAuctionDetail } from "../../../../../components/common/AunctioneerDeteailProvider";

const currentDate = new Date().toISOString()?.split("T")[0];

// Get the current year
const currentYear = new Date().getFullYear();

const validationSchema = Yup.object().shape({
  saleNo: Yup.number().required("sale No is required"),
  teaTypeId: Yup.number().required("Tea Type is required"),
  categoryId: Yup.number().required("Category is required"),
  seriesFrom: Yup.number().required("Series From is required"),
  seriesTo: Yup.number()
    .required("Series To is required")
    .test(
      "is-greater",
      "Series To must be greater than Series From",
      function (value) {
        const { seriesFrom } = this.parent; // Access the value of seriesFrom
        return value > seriesFrom; // Return true if seriesTo is greater than seriesFrom
      }
    ),
});

function AWRForm({
  initialValue,
  setInitialValue,
  lotSeriesDataIds,
  setLotSeriesData,
  isDisabled,
  isEdit,
  setExpandedTab,
  handleChnage,
  setHandleChnage,
  expandedTab,
  modalRight
}) {
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId, roleCode, auction,
    auctionTypeMasterCode, } =
    useAuctionDetail();
  const baseUrlEnga =
    auction === "ENGLISH" ? "EnglishAuctionSampleShortage" : "SampleShortage";
  const [baseUrlEng, setbaseUrlEng] = useState(baseUrlEnga);

  const [uploadedData, setUploadedData] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [saleNo, setSaleNo] = useState([]);
  const [subTeaTypeNo, setSubTeaTypeNo] = useState([]);
  const [catagory, setCategory] = useState([]);
  const [saleprogram, setsaleprogrm] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const initialValues = {
    saleNo: null,
    season: currentYear.toString(),
    saleProgramId: null,
    teaTypeId: null,
    categoryId: null,
    seriesFrom: "",
    seriesTo: "",
    isActive: true,
    createdBy: userId,
  };
  const lotSeriesDataId = useSelector(
    (state) => state.lotSeriesReducer.dataById.responseData
  );
  const lotseriesData = useSelector((state) => state.lotSeriesReducer);
  console.log(lotseriesData, "lotSeriesDataId");
  useEffect(() => {
    if (lotSeriesDataId?.length > 0) {
      if (isEdit) {
        setInitialValue(lotSeriesDataId[0]);
        formik.setValues(lotSeriesDataId[0]);
        setLotSeriesData(lotSeriesDataId);
      } else {
        formik.setValues(lotSeriesDataId[0]);
        setLotSeriesData(lotSeriesDataId);
      }
    } else {
      setInitialValue({
        saleNo: null,
        season: formik.values.season,
        saleProgramId: null,
        teaTypeId: null,
        categoryId: null,
        seriesFrom: "",
        seriesTo: "",
        isActive: true,
        createdBy: userId,
      });
    }
  }, [lotSeriesDataId]);

  const formik = useFormik({
    initialValues: {
      saleNo: null,
      season: currentYear,
      saleProgramId: null,
      teaTypeId: null,
      categoryId: null,
      seriesFrom: "",
      seriesTo: "",
      isActive: true,
      createdBy: userId,
    },
    validationSchema,
    onSubmit: (values) => {
      // console.log("values");
      // handleSubmit(values);

      if (isEdit === true) {
        const {
          saleNo,
          season,
          saleProgramId,
          teaTypeId,
          categoryId,
          seriesFrom,
          seriesTo,
        } = values;
        const updateData = {
          lotNoSeriesID: values.lotNoSeriesID,
          saleNo: parseInt(saleNo),
          season: season.toString(),
          saleProgramId: saleProgramId,
          teaTypeId: parseInt(teaTypeId),
          categoryId: parseInt(categoryId),
          seriesFrom: parseInt(seriesFrom),
          seriesTo: parseInt(seriesTo),
          auctioneerId: parseInt(userId), //auctioner
          isActive: true,
          updatedBy: parseInt(userId),
          auctionCenterId: auctionCenterId,
        };
        // dispatch(updateLotSeriesRequest(updateData));
        axiosMain
          .post(`/preauction/${baseUrlEng}/UpdateLotSeries`, updateData)
          .then((res) => {
            if (res.data.statusCode === 200) {
              CustomToast.success(res.data.message);
              setExpandedTab("panel1");
              setHandleChnage(false);

              formik.resetForm();
            } else {
              CustomToast.error(res.data.message);
            }
          });
      } else {
        const {
          saleNo,
          season,
          saleProgramId,
          teaTypeId,
          categoryId,
          seriesFrom,
          seriesTo,
          isActive,
          createdBy,
        } = values;

        const data = {
          saleNo: parseInt(saleNo),
          season: season.toString(),
          saleProgramId: saleProgramId,
          teaTypeId: parseInt(teaTypeId),
          teaTypeName: teaTypeList?.find(
            (ele) => ele.teaTypeId == parseInt(teaTypeId)
          )?.teaTypeName,
          categoryId: parseInt(categoryId),
          categoryName: catagory?.find(
            (ele) => ele.categoryId == parseInt(categoryId)
          )?.categoryCode,
          seriesFrom: parseInt(seriesFrom),
          seriesTo: parseInt(seriesTo),
          isActive: true,
          auctioneerId: parseInt(userId), //auctioner

          createdBy: parseInt(userId),
          auctionCenterId: auctionCenterId,
        };
        setTableData([...tableData, data]);
        //formik.resetForm();
        formik.setFieldValue("seriesFrom", "");
        formik.setFieldValue("seriesTo", "");
        setInitialValue({
          //saleNo: null,
          season: formik.values.season,
          saleProgramId: formik.values.saleProgramId,
          //teaTypeId: null,
          //categoryId: null,
          seriesFrom: "",
          seriesTo: "",
          isActive: true,
          createdBy: userId,
        });
        setHandleChnage(false);
      }
      // resetForm();
    },
    validateOnChange: false,
  });

  // resetModal = () => {
  //   formik.setValues({
  //     saleNo: null,
  //     season: currentYear.toString(),
  //     saleProgramId: null,
  //     teaTypeId: null,
  //     categoryId: null,
  //     seriesFrom: "",
  //     seriesTo: "",
  //     isActive: true,
  //     createdBy: userId,
  //   });
  //   setInitialValue({});
  //   lotSeriesDataId = [];
  // };

  // useEffect(() => {
  //   formik.setValues(
  //     initialValue === []
  //       ? {
  //         saleNo: null,
  //         season: formik.values.season.toString()?.toString(),
  //         saleProgramId: null,
  //         teaTypeId: null,
  //         categoryId: null,
  //         seriesFrom: "",
  //         seriesTo: "",
  //         isActive: true,
  //         createdBy: userId,
  //       }
  //       : initialValue
  //   );
  // }, [initialValue]);

  // useEffect(() => {
  //   if (lotSeriesDataId?.teaTypeId) {
  //     formik.values.teaTypeId = initialValue.teaTypeId;
  //     formik.values.categoryId = initialValue.categoryId;
  //     formik.values.seriesFrom = parseInt(initialValue.seriesFrom);
  //     formik.values.seriesTo = parseInt(initialValue.seriesTo);
  //   } else {
  //     formik.values.teaTypeId = null;
  //     formik.values.categoryId = null;
  //     formik.values.seriesFrom = "";
  //     formik.values.seriesTo = "";
  //   }
  // }, [lotSeriesDataId, initialValue]);

  console.log(formik.values, initialValue, "formik");

  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();

  const teaType = useSelector(
    (state) => state.teaType.teaTypeList.responseData
  );
  const subTeaType = useSelector((state) => state.teaType.data.responseData);

  const markList = useSelector((state) => state.mark.data.responseData);
  const warehouseUsersList = useSelector(
    (state) => state.warehouseUser.data.responseData
  );
  const grades = useSelector((state) => state.grade.data.responseData);

  const category = useSelector((state) => state?.category?.data?.responseData);

  const invoiceData = useSelector(
    (state) => state?.invoiceDetails?.data?.responseData
  );

  console.log(invoiceData, "invoiceData");

  useEffect(() => {
    dispatch(teaTypeAction({ auctionCenterId }));
    dispatch(fetchMarkRequest({ auctionCenterId }));
    dispatch(fetchWarehouseUserRequest({ auctionCenterId }));
    dispatch(fetchGradeRequest({ auctionCenterId }));
    // dispatch(fetchSaleProgramListRequest(saleData));
    // dispatch(fetchSubTeaTypeRequest(formik.values.teaType));
    dispatch(fetchCategoryRequest({
      teaTypeId: parseInt(formik.values.teaType),
      auctionCenterId,
    }));

    // dispatch(fetchSaleNumbersRequest(formik.values.season.toString()));
  }, []);

  useEffect(() => {
    // formik.resetForm();
    formik.setFieldValue("seriesFrom", "");
    formik.setFieldValue("seriesTo", "");
    setTableData([]);
  }, [expandedTab]);
  useEffect(() => {
    if (
      formik.values.saleNo !== "" &&
      formik.values.saleNo !== null &&
      formik.values.saleNo !== undefined
    ) {
      axiosMain
        // .post("/preauction/Common/BindTeaTypeBySeasonSaleNo", {
        .post("/preauction/Common/BindTeaTypeByParam", {
          season: formik.values.season.toString(),
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
          auctioneerId: parseInt(userId),
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            formik.setFieldValue(
              "teaTypeId",
              res.data.responseData?.at(0)?.teaTypeId
            );
            console.log(res.data.responseData, "res.data.responseData");
            setTeaTeatypeList(res.data.responseData);
          } else {
            setTeaTeatypeList([]);
          }
        });
      //bind category
      axiosMain
        .post("/preauction/Common/BindCatagoryByParam", {
          season: formik.values.season.toString(),
          saleNo: parseInt(formik.values.saleNo),
          // AuctioneerId: parseInt(formik.values.auctioneer),
          auctionCenterId: auctionCenterId,
          auctioneerId: userId,
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            formik.setFieldValue(
              "categoryId",
              res.data.responseData?.at(0)?.categoryId
            );
            setCategory(res.data.responseData);
          } else {
            setCategory([]);
          }
        });
    }
  }, [formik.values.season, formik.values.saleNo]);
  useEffect(() => {
    //setTeaTeatypeList(teaType);
    setMarkDataList(markList);
    setWarehouseUserList(warehouseUsersList);
    setGradesList(grades);
    setSubTeaTypeNo(subTeaType);
    //setCategory(category);
    const seasondata = {
      season: currentYear.toString(),
      auctionCenterId: auctionCenterId,
    };
    axiosMain
      .post(`/preauction/Common/BindSaleNoBySeason`, seasondata)
      .then((res) => {
        if (res.data.responseData?.length > 0) {
          formik.setFieldValue("saleNo", res.data.responseData?.at(0)?.saleNo);
          formik.values.saleNo = res.data.responseData?.at(0)?.saleNo;
          setSaleNo(res.data.responseData);
        } else {
          setSaleNo([]);
        }
      })
      .catch((err) => console.log(err));
    // }, [teaType, subTeaType, markList, warehouseUsersList, grades, category]);
  }, [subTeaType, markList, warehouseUsersList, grades]);
  useEffect(() => {
    console.log("api cal");
    const saleNo = formik.values.saleNo;
    const season = formik.values.season.toString();
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (
      saleNo !== "" &&
      saleNo !== null &&
      season !== "" &&
      formik.values.saleNo !== undefined
    ) {
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season.toString(),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          setbaseUrlEng(response?.data?.responseData[0]?.auctionTypeCode === "BHARAT" ? "LotNoSeries" : "EnglishAuctionLotNoSeries");
          // Handle the API response here
          formik.setFieldValue(
            "saleProgramId",
            response?.data?.responseData[0]?.SaleProgramId
          );
        })
        .catch(() => {
          // Handle errors here
        });

      // Cleanup function, in case you need to cancel the request
      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo]);

  // function generateYearOptions() {
  //   const currentYear = new Date().getFullYear();
  //   const options = [];

  //   for (let i = currentYear; i > currentYear - 7; i--) {
  //     options.push({ label: i, value: i });
  //   }

  //   return options;
  // }
  function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let i = currentYear; i > currentYear - 7; i--) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return options;
  }

  // const handleFileUpload = (e) => {
  //   const { values, handleChange, handleSubmit, errors: formikErrors } = formik;

  //   const files = Array.from(e.target.files);
  //   const validFiles = files.filter(
  //     (file) =>
  //       file.type === "application/vnd.ms-excel" ||
  //       file.type ===
  //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //   );

  //   if (validFiles.length > 0) {
  //     setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       fileUpload: null,
  //     }));
  //   } else {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       fileUpload: "Please select valid Excel files",
  //     }));
  //   }
  // };

  const fields =
    lotSeriesDataIds?.length > 0
      ? [
        {
          label: "Category",
          name: "categoryId",
          type: isDisabled === true ? "disableSelect" : "select",
          options: catagory?.map((ele) => {
            return { label: ele.categoryName, value: ele.categoryId };
          }),
          required: true,
          className: "FormGroup",
        },
        {
          label: "Tea Type",
          name: "teaTypeId",
          type: isDisabled === true ? "disableSelect" : "select",
          options: teaTypeList?.map((ele) => {
            return { label: ele.teaTypeName, value: ele.teaTypeId };
          }),
          required: true,
          className: "FormGroup",
        },
        {
          label: "Series From",
          name: "seriesFrom",
          type: isDisabled === true ? "disable" : "number",
          required: true,
          className: "FormGroup",
        },
        {
          label: "Series To",
          name: "seriesTo",
          type: isDisabled === true ? "disable" : "number",
          required: true,
          className: "FormGroup",
        },
      ]
      : [
        {
          label: "Season",
          name: "seson",
          type: "select",
          options: generateYearOptions(),
          required: false,
          className: "FormGroup",
        },
        {
          label: "Sale No",
          name: "saleNo",
          type: "select",
          options: saleNo?.map((ele) => {
            return { label: ele.saleNo, value: ele.saleNo };
          }),
          required: false,
          className: "FormGroup",
        },
        {
          label: "Category",
          name: "categoryId",
          type: "select",
          options: catagory?.map((ele) => {
            return { label: ele.categoryName, value: ele.categoryId };
          }),
          required: true,
          className: "FormGroup",
        },
        {
          label: "Tea Type",
          name: "teaTypeId",
          type: "select",
          options: teaTypeList?.map((ele) => {
            return { label: ele.teaTypeName, value: ele.teaTypeId };
          }),
          required: true,
          className: "FormGroup",
        },
        {
          label: "Series From",
          name: "seriesFrom",
          type: "number",
          required: true,
          className: "FormGroup",
        },
        {
          label: "Series To",
          name: "seriesTo",
          type: "number",
          required: true,
          className: "FormGroup",
        },
      ];

  const Controlls = () => {
    return (
      <>
        <div className="BtnGroup">
          {isDisabled === true ? (
            <></>
          ) : isEdit === true ? (
            <>
              <Button className="SubmitBtn" type="submit">
                Update
              </Button>
            </>
          ) : (
            <>
              <Button
                className="SubmitBtn"
                onClick={() => {
                  if (tableData.length > 0) {
                    //dispatch(addLotSeriesRequest(tableData));
                    axiosMain
                      .post(`/preauction/${baseUrlEng}/AddLotNoSeries`, tableData)
                      .then((response) => {
                        if (response.data.statusCode === 403) {
                          setExpandedTab("panel1");
                          formik.resetForm();
                          setTableData([]);
                          setHandleChnage(false);
                          CustomToast.warning(response.data.message);
                          //return;
                        }
                        if (response.data.statusCode === 200) {
                          CustomToast.success(response.data.message);
                          setExpandedTab("panel1");
                          formik.resetForm();
                          setTableData([]);
                          setHandleChnage(false);
                          //return;
                        }
                      })
                      .catch(() => {
                        // Handle errors here
                      });
                  } else {
                    CustomToast.error("Please Click on Add Button First.");
                    return;
                  }
                  console.log(lotseriesData, "lotseriesDatalotseriesData");

                  // if (lotseriesData.data.statusCode === 403) {
                  //   setExpandedTab("panel1");
                  //   formik.resetForm();
                  //   setTableData([]);
                  //   setHandleChnage(false);
                  //   CustomToast.warning(lotseriesData.data.message);
                  //   //return;
                  // }
                  // if (lotseriesData.data.statusCode === 200) {
                  //   CustomToast.success(lotseriesData.data.message);
                  //   setExpandedTab("panel1");
                  //   formik.resetForm();
                  //   setTableData([]);
                  //   setHandleChnage(false);
                  //   //return;
                  // }
                }}
              >
                Create
              </Button>

              <Button className="SubmitBtn" type="submit">
                Add
              </Button>
            </>
          )}
        </div>
      </>
    );
  };
  useEffect(() => {
    const seasondata = {
      season: formik.values.season.toString(),
      auctionCenterId: auctionCenterId,
    };
    axiosMain
      .post(`/preauction/Common/BindSaleNoBySeason`, seasondata)
      .then((res) => {
        setSaleNo(res.data.responseData);
        formik.setFieldValue("saleNo", res.data.responseData?.at(0).saleNo);
      })
      .catch((err) => console.log(err));
  }, [formik.values.season.toString()]);

  const handleFileRemove = (index) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  return (
    <div>
      {/* <form onSubmit={formik.handleSubmit}> */}

      {/* <CustomeFormCreater
            fields={fields}
            initialValues={initialValues}
            validationSchema={validationSchema}
            // handleSubmit={() => handleSubmit()}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            handleFileRemove={handleFileRemove}
            formik={formik}
            Controlls={Controlls}
            setHandleChnage={setHandleChnage}
          /> */}

      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-lg-2">
            <label>Select Season</label>
            <InputGroup>
              <FormControl
                as="select"
                name="season"
                value={formik.values.season.toString()}
                onChange={formik.handleChange}
                disabled={isDisabled || lotSeriesDataIds?.length > 0}
              >
                {generateYearOptions()}
              </FormControl>
            </InputGroup>
            {formik.errors.season && formik.touched.season && (
              <div className="error text-danger">{formik.errors.season}</div>
            )}
          </div>
          <div className="col-lg-2">
            <label>Select Sale No.</label>
            <InputGroup>
              <FormControl
                as="select"
                name="saleNo"
                value={formik.values.saleNo}
                onChange={formik.handleChange}
                disabled={isDisabled || lotSeriesDataIds?.length > 0}
              >
                {saleNo?.map((e, index) => (
                  <option
                    key={e.saleNo}
                    value={e.saleNo}
                    selected={index === 0}
                  >
                    {e.saleNo}
                  </option>
                ))}
              </FormControl>
            </InputGroup>
            {formik.errors.saleNo && formik.touched.saleNo && (
              <div className="error text-danger">{formik.errors.saleNo}</div>
            )}
          </div>

          <div className="col-lg-2">
            <label>Category</label>
            <InputGroup>
              <FormControl
                as="select"
                name="categoryId"
                onChange={formik.handleChange}
                value={formik.values.categoryId}
                disabled={isDisabled || lotSeriesDataIds?.length > 0}
              >
                {catagory?.map((e) => (
                  <option key={e.categoryId} value={e.categoryId}>
                    {e.categoryCode}
                  </option>
                ))}
              </FormControl>
            </InputGroup>
            {formik.errors.categoryId && formik.touched.categoryId && (
              <div className="error text-danger">
                {formik.errors.categoryId}
              </div>
            )}
          </div>

          <div className="col-xl-2 col-lg-3 col-md-4">
            <div className="FormGroup">
              <label htmlFor="teaTypeId">Tea Type </label>
              <FormControl
                as="select"
                name="teaTypeId"
                onChange={formik.handleChange}
                value={formik.values.teaTypeId}
                disabled={isDisabled || lotSeriesDataIds?.length > 0}
              >
                {teaTypeList?.map((e) => (
                  <option key={e.teaTypeId} value={e.teaTypeId}>
                    {e.teaTypeName}
                  </option>
                ))}
              </FormControl>

              {formik.touched.teaTypeId && formik.errors.teaTypeId && (
                <div className="error text-danger">
                  {formik.errors.teaTypeId}
                </div>
              )}
            </div>
          </div>
          <FormGroup className="col-xl-2 col-lg-2 col-md-4">
            <FormLabel>Series From</FormLabel>
            <FormControl
              as="input"
              type="number"
              name="seriesFrom"
              onChange={formik.handleChange}
              value={formik.values.seriesFrom}
              disabled={isDisabled === true ? true : false}
            />
            {formik.errors.seriesFrom && formik.touched.seriesFrom && (
              <div className="error text-danger">
                {formik.errors.seriesFrom}
              </div>
            )}
          </FormGroup>
          <FormGroup className="col-xl-2 col-lg-2 col-md-4">
            <FormLabel>Series To</FormLabel>
            <FormControl
              as="input"
              type="number"
              name="seriesTo"
              onChange={formik.handleChange}
              value={formik.values.seriesTo}
              disabled={isDisabled === true ? true : false}
            />
            {formik.errors.seriesTo && formik.touched.seriesTo && (
              <div className="error text-danger">{formik.errors.seriesTo}</div>
            )}
          </FormGroup>
        </div>
        {/* <div className="BtnGroup mt-1">
           <button type="submit" className="SubmitBtn">Submit</button>
           </div> */}
        <div className="BtnGroup">
          {isDisabled === true ? (
            <></>
          ) : isEdit === true ? (
            <>
              <Button className="SubmitBtn" type="submit">
                Update
              </Button>
            </>
          ) : (
            <>
              <Button className="SubmitBtn" type="submit">
                Add
              </Button>
              <Button
                className="SubmitBtn"
                onClick={() => {
                  if (tableData.length > 0) {
                    //dispatch(addLotSeriesRequest(tableData));
                    axiosMain
                      .post(`/preauction/${baseUrlEng}/AddLotNoSeries`, tableData)
                      .then((response) => {
                        if (response.data.statusCode === 403) {
                          setExpandedTab("panel1");
                          formik.resetForm();
                          setTableData([]);
                          setHandleChnage(false);
                          CustomToast.warning(response.data.message);
                          //return;
                        }
                        if (response.data.statusCode === 200) {
                          CustomToast.success(response.data.message);
                          setExpandedTab("panel1");
                          formik.resetForm();
                          setTableData([]);
                          setHandleChnage(false);
                          //return;
                        }
                      })
                      .catch(() => {
                        // Handle errors here
                      });
                  } else {
                    CustomToast.error("Please Click on Add Button First.");
                    return;
                  }
                  console.log(lotseriesData, "lotseriesDatalotseriesData");

                  // if (lotseriesData.data.statusCode === 403) {
                  //   setExpandedTab("panel1");
                  //   formik.resetForm();
                  //   setTableData([]);
                  //   setHandleChnage(false);
                  //   CustomToast.warning(lotseriesData.data.message);
                  //   // return;
                  // }
                  // if (lotseriesData.data.statusCode === 200) {
                  //   CustomToast.success(lotseriesData.data.message);
                  //   setExpandedTab("panel1");
                  //   formik.resetForm();
                  //   setTableData([]);
                  //   setHandleChnage(false);
                  //   // return;
                  // }
                }}
              >
                Create
              </Button>
            </>
          )}
        </div>
      </form>

      {/* </form> */}

      <div className="">
        <div className="TableBox">
          {lotSeriesDataIds?.length > 0 ? (
            ""
          ) : tableData?.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Tea Type</th>
                  <th>Category</th>
                  <th>Series From</th>
                  <th>Series To</th>
                </tr>
              </thead>
              <tbody>
                {console.log(tableData, "tableData")}
                {tableData.map((value) => (
                  <tr>
                    <td>
                      {/* {teaTypeList.map((ele) =>
                        ele.teaTypeId === value.teaTypeId ? ele.teaTypeName : ""
                      )} */}
                      {value.teaTypeName}
                    </td>
                    <td>
                      {/* {catagory.map((ele) =>
                        ele.categoryId === value.categoryId
                          ? ele.categoryName
                          : ""
                      )} */}
                      {value.categoryName}
                    </td>
                    <td>{value.seriesFrom}</td>
                    <td>{value.seriesTo}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <>
              <table className="table mt-4">
                <thead>
                  <tr>
                    <th>Tea Type</th>
                    <th>Category</th>
                    <th>Series From</th>
                    <th>Series To</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <div className="NoData">No Data</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* <ToastContainer /> */}
    </div>
  );
}

export default AWRForm;
