import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../modal/modal.css";
import TableComponent from "../../../../components/tableComponent/TableComponent";

import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Accordion,
} from "@mui/material";
import { SelectAll } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import { useDispatch } from "react-redux";
import {
  fetchAwrListRequest,
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchInvoiceDetailsIdRequest,
  fetchMarkRequest,
  fetchMarkTypeRequest,
  fetchSaleNumbersRequest,
  fetchSampleShortageListRequest,
  fetchSampleShortageRequest,
  fetchSessionTypeRequest,
  fetchWarehouseUserRequest,
  teaTypeAction,
} from "../../../../store/actions";
import CustomeFormCreater from "../../../../components/common/formCreater/CustomeFormCreater";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import axios from "axios";
import ConvertTo12HourFormat from "../../../../components/common/dateAndTime/ConvertTo12HourFormat";

import axiosMain from "../../../../http/axios/axios_main";
import PrePostDate from "./PrePostDate";
import CustomToast from "../../../../components/Toast";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import { isDisabled } from "@testing-library/user-event/dist/utils";

const allSampleShortage = [];

const currentDate = new Date().toISOString()?.split("T")[0];

// Get the current year
const currentYear = new Date().getFullYear()?.toString();

const currentWeek = Math.ceil(
  ((new Date() - new Date(currentYear, 0, 4)) / 86400000 + 1) / 7
);

console.log(currentWeek, currentDate, "currentWeek");

const validationSchema = Yup.object().shape({
  // season: Yup.string().required("Season is required"),
  saleNo: Yup.string().required("Sale No is required"),
});

function Maintananse({ modalRight, ...dataBy }) {
  const [rows, setRows] = useState(allSampleShortage);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [rowValues, setRowValues] = useState([]);
  const [auctionType, setAuctionType] = useState(dataBy?.auctionType);
  const [baseUrlEng, setBaseUrlEng] = useState(
    dataBy?.auctionType === "ENGLISH"
      ? "EnglishAuctionSession"
      : "AuctionSession"
  );

  const dispatch = useDispatch();
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
  } = useAuctionDetail();
  const [handleChnage, setHandleChnage] = useState(false);
  const [saleNo, setSaleNo] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [disable, setDisable] = useState(false);
  const [numRows, setNumRows] = useState(1);
  const [markDataList, setMarkDataList] = useState([]);
  const [catagory, setCategory] = useState([]);
  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [startDate, setStartDate] = useState("");

  const [selectedSalePrograms, setSelectedSalePrograms] = useState([]);
  const [sessionTypes, setSessionType] = useState([]);
  const [saleProgramIds, setSaleProgramId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, numRows);
  let data = dataBy?.dataByID?.responseData?.at(0)?.searchParam;

  const itemsOnPage = Array?.from(
    {
      length: data === undefined ? numRows : 1,
    },
    (_, index) => index + startIndex
  );

  const { dataByID, onEdit, expandedTab } = dataBy;

  // const [formData, setFormData] = useState(
  //   dataBy?.dataByID?.responseData?.at(0)?.searchParam
  // );
  const [auctioneer, setAuctioneer] = useState([]);
  const [dataListBy, setDataBy] = useState(dataBy);
  const [smShow, setSmShow] = useState(false);
  const [show, setShow] = useState(false);
  const [prePostData, setPrePostData] = useState([]);
  const [saleDates, setSaleDates] = useState([]);
  const [markType, setMarkType] = useState([]);
  const [auctionSessionDetailId, setAuctionSessionDetailId] = useState({});
  const [
    timeIntervalBetweenTwoAuctionSessionData,
    setTimeIntervalBetweenTwoAuctionSessionData,
  ] = useState({});
  const initialValues = {
    season: currentYear?.toString(),
    saleNo: null,
    saleDate: "",
    teaTypeId: null,
    createdBy: parseInt(userId),
    noOfSession: 1,
    dealBookClosingDate: "",
    sessionList: selectedSalePrograms,
  };

  const teaType = useSelector(
    (state) => state.teaType.teaTypeList.responseData
  );

  function checkKeys(keys) {
    selectedSalePrograms.forEach((obj, index) => {
      keys.forEach((key) => {
        if (!(key in obj)) {
          console.log(
            `Missing key '${key}' in row ${index + 1}`,
            "Missing key"
          );
        } else if (obj[key] === undefined || obj[key] === null) {
          console.log(`Missing value for key '${key}' in row ${index + 1}`);
        } else {
          return true;
        }
      });
    });
  }

  const formik = useFormik({
    initialValues: {
      season: currentYear,
      saleNo: null,
      saleDate: "",
      teaTypeId: null,
      createdBy: parseInt(userId),
      noOfSession: 1,
      dealBookClosingDate: "",
      sessionList: selectedSalePrograms,
    },
    validationSchema,
    onSubmit: (values) => {
      // console.log("values");
      selectedSalePrograms?.map((ele) => (ele.teaTypeId = values.teaTypeId));
      // handleSubmit(values);
      const {
        season,
        saleNo,
        saleDate,
        teaTypeId,
        createdBy,
        categoryId,
        noOfSession,
        dealBookClosingDate,
        sessionList,
      } = values;
      if (sessionList?.length > 0) {
        const requiredKeys = [
          "userId",
          "marketTypeId",
          "remarks",
          "categoryId",
          "startDate",
          "enddate",
          "noOfLots",
        ];
        checkKeys(requiredKeys);

        let endDate = selectedSalePrograms
          ?.map((ele, index) =>
            ele.enddate === null || ele.enddate === undefined ? index + 1 : ""
          )
          .filter((ele) => ele !== "");

        console.log(
          selectedSalePrograms?.map((ele, index) =>
            new Date(ele.startDate) > new Date(ele.enddate) ? index : ""
          ),
          "endDateendDate"
        );
        if (
          endDate.length > 0 ||
          selectedSalePrograms
            ?.map((ele, index) =>
              new Date(ele.startDate) > new Date(ele.enddate) ? index : ""
            )
            .filter((ele) => ele !== "").length > 0
        ) {
          CustomToast.error(
            endDate?.length > 0
              ? "Row No of " +
                  endDate?.join(" , ") +
                  " End Date is less then Start Date"
              : "Row No of " +
                  selectedSalePrograms
                    ?.map((ele, index) =>
                      new Date(ele.startDate) > new Date(ele.enddate)
                        ? index + 1
                        : ""
                    )
                    .filter((ele) => ele !== "")
                    ?.join(" , ") +
                  "End Date is less then Start Date"
          );
        } else {
          const apiUrl = `/preauction/${baseUrlEng}/CreateAuctionSession`;

          const extractedData = selectedSalePrograms.map((program) => ({
            season:
              season === "" ? new Date().getFullYear()?.toString() : season,
            saleNo: parseInt(saleNo),
            auctionCenterId: auctionCenterId,

            auctionSessionId: program.auctionSessionId,
            auctionSessionDetailId: program.auctionSessionDetailId,
            userId: program.userId !== "" ? parseInt(program.userId) : 0,
            marketTypeId: program.marketTypeId,
            // marketTypeId: markType?.at(0).marketTypeId,
            categoryId: program.categoryId,
            saleDate: saleDate,
            teaTypeId: program.teaTypeId,
            sessionTypeId:
              program.sessionTypeId == undefined
                ? sessionTypes?.at(0)?.sessionTypeId
                : program.sessionTypeId,
            sessionTypeName:
              program.sessionTypeId == undefined
                ? auctionType === "ENGLISH"
                  ? sessionTypes?.at(0)?.sessionTypeId === 3
                    ? "Normal"
                    : "Supplement"
                  : sessionTypes?.at(0)?.sessionTypeId === 1
                  ? "Normal"
                  : "Price Rediscovery Session"
                : sessionTypes
                    ?.filter(
                      (ele) => ele?.sessionTypeId === program.sessionTypeId
                    )
                    ?.at(0)?.sessionTypeName,
            //  program.sessionTypeId === 1
            // ? "Normal"
            // : "Price Rediscovery Session"
            startDate: program.startDate,
            enddate: program.enddate,
            minimumBidTime: program.minimumBidTime,
            noOfLots: program.noOfLots,
            updatedBy: parseInt(userId),
            status: program.status,
            remarks: program.remarks,
            dealBookClosingDate: dealBookClosingDate,
          }));
          // //debugger;
          if (
            extractedData?.at(0).sessionTypeId === 1
              ? selectedSalePrograms?.some((ele) => ele.noOfLots > 0) &&
                selectedSalePrograms?.some((ele) => ele.minimumBidTime > 0) &&
                selectedSalePrograms?.some((ele) => ele.userId) > 0
              : true
          ) {
            if (dataBy?.dataByID?.responseData?.at(0) !== undefined) {
              if (auctionType === "ENGLISH")
                delete extractedData?.at(0)?.marketTypeId;
              delete extractedData?.at(0)?.remarks;
              axiosMain
                .post(
                  `/preauction/${baseUrlEng}/UpdateAuctionSession`,
                  extractedData?.at(0)
                )
                .then((response) => {
                  console.log(response, "Sss");
                  if (response.data.statusCode === 200) {
                    CustomToast.success(response.data.message);
                    formik.resetForm();
                    setSelectedSalePrograms([]);
                    dataBy?.setExpandedTab("panel1");
                  } else {
                    CustomToast.warning(response.data.message);
                  }
                  // Handle the API response here
                  // setRows(response?.data?.responseData[0]);
                })
                .catch((error) => {
                  // Handle errors here
                });
            } else {
              // let mainData = extractedData.filter((ele) => {
              //   let mainData = {
              //     ...ele,
              //     sessionTypeId: sessionTypes?.at(0)?.sessionTypeId,
              //   };
              //   return "sessionTypeId" in ele ? mainData : mainData;
              // });
              if (selectedSalePrograms?.some((ele) => ele.remarks !== "")) {
                console.log(
                  extractedData,
                  // mainData,
                  sessionTypes?.at(0)?.sessionTypeId,
                  "mainData"
                );
                axiosMain
                  .post(apiUrl, {
                    season:
                      season === ""
                        ? new Date().getFullYear()?.toString()
                        : season,
                    saleNo: parseInt(saleNo),
                    saleDate: saleDate,
                    saleProgramId: saleProgramIds?.at(0).SaleProgramId,
                    teaTypeId: teaTypeId,
                    categoryId: categoryId,
                    createdBy: parseInt(userId),
                    noOfSession: noOfSession !== "" ? parseInt(noOfSession) : 0,
                    sessionList: extractedData,
                    dealBookClosingDate: dealBookClosingDate,
                    auctionCenterId: auctionCenterId,
                  })
                  .then((response) => {
                    console.log(response, "Sss");
                    if (response.data.statusCode === 200) {
                      CustomToast.success(response.data.message);
                      formik.resetForm();
                      setSelectedSalePrograms([]);
                      dataBy?.setExpandedTab("panel1");
                    } else {
                      CustomToast.warning(response.data.message);
                    }
                    // Handle the API response here
                    // setRows(response?.data?.responseData[0]);
                  })
                  .catch((error) => {
                    // Handle errors here
                  });
              } else {
                CustomToast.error("Please fill auction remarks.");
              }
            }
          } else {
            CustomToast.error("Please Check No Of Lots , MBT , Auctioneer.");
          }
        }
        // const results = selectedSalePrograms.map((program, index) => {
        //   const missingKeys = [];
        //   const emptyValueKeys = [];

        //   requiredKeys.forEach((key) => {
        //     if (!(key in program)) {
        //       missingKeys.push(key);
        //     } else if (program[key] === "") {
        //       emptyValueKeys.push(key);
        //     }
        //   });

        //   return {
        //     programIndex: index + 1,
        //     missingKeys,
        //     emptyValueKeys,
        //     allRequiredKeysPresent:
        //       missingKeys.length === 0 && emptyValueKeys.length === 0,
        //   };
        // });

        // console.log(results, "results");
      } else {
        CustomToast.error("Please fill auction session.");
      }

      console.log(data, selectedSalePrograms, "results");
    },
    validateOnBlur: false, // Disable validation on blur
    validateOnChange: handleChnage, // Disable validation on change
    isInitialValid: false,
  });

  function addStartDateInNextRow(index, value, updatedProgram) {
    const selectedTime = value;
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const newMinutes =
      (minutes +
        timeIntervalBetweenTwoAuctionSessionData?.timeIntervalBetweenTwoAuctionSession) %
      60; // Adding 10 minutes
    const newHours =
      hours +
      Math.floor(
        (minutes +
          timeIntervalBetweenTwoAuctionSessionData?.timeIntervalBetweenTwoAuctionSession) /
          60
      ); // Updating hours if necessary
    const updatedTime = `${String(newHours).padStart(2, "0")}:${String(
      newMinutes
    ).padStart(2, "0")}`;

    const updatedPrograms = {
      ...selectedSalePrograms[index + 1],
      startDate: formik?.values?.saleDate + "T" + updatedTime + ":00",
    };

    console.log(updatedPrograms, "updatedProgramupdatedProgramupdatedProgram");
    try {
      selectedSalePrograms[index + 1] = updatedPrograms;

      // You can perform the API call regardless of whether saleDate is available or not

      console.log(
        selectedSalePrograms,
        selectedSalePrograms,
        "updatedProgramssupdatedProgramssupdatedProgramss"
      );
    } catch (error) {
      console.error("API call error:", error);
      // Handle the error if needed
    }
    updateSelectedSaleProgram(index, updatedProgram);
  }

  // useEffect(() => {
  //   if (formData !== undefined) {

  //   }
  // }, [formData]);
  // useEffect(() => {
  //   setDataBy(dataListBy);
  // }, [dataBy]);
  function getEditValues() {
    //let data = dataBy?.dataByID?.responseData?.at(0)?.searchParam;
    let data = dataBy?.dataByID?.responseData?.at(0);
    setSelectedSalePrograms([dataBy?.dataByID?.responseData?.at(0)]);
    // debugger
    if (data !== undefined) {
      // setFormData(dataByID.dataByID.responseData?.at(0)?.searchParam);
      formik.setValues({
        ...formik.values,
        season: data.season,
        saleNo: data.saleNo,
        saleDate: data.saleDate.split("T")[0],
        teaTypeId: data.teaTypeId,
        createdBy: parseInt(userId),
        noOfSession: data.noOfSession,
        sessionList: selectedSalePrograms,
        dealBookClosingDate: data.dealBookClosingDate,
      });

      // setFormTableData(
      //   dataByID.dataByID.responseData?.at(0)?.auctionSessionList
      // );

      axiosMain
        .post("/preauction/Common/BindCatagoryByParam", {
          season: data.season,
          saleNo: parseInt(data.saleNo),
          AuctioneerId: parseInt(
            //dataBy?.dataByID?.responseData?.at(0)?.auctionSessionList?.userId
            dataBy?.dataByID?.responseData?.at(0)?.userId
          ),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          // Handle the API response here'

          setCategory(response?.data?.responseData);

          console.log(response);
        })
        .catch((error) => {
          // Handle errors here
        });

      const marketTypeId = "/preauction/Common/BindMarketTypeByParam";

      axiosMain
        .post(marketTypeId, {
          season: data.season,
          saleNo: parseInt(data.saleNo),
          AuctioneerId: parseInt(dataBy?.dataByID?.responseData?.at(0)?.userId),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          // Handle the API response here'
          selectedSalePrograms[0].marketTypeId =
            response?.data?.responseData?.at(0)?.marketTypeId;
          //setCategory(response?.data?.responseData);
          // setSelectedSalePrograms({
          //   ...selectedSalePrograms,
          //   categoryId:
          //     response?.data?.responseData[0]
          //       .categoryId,
          // });
          setMarkType(response?.data?.responseData);
          console.log(
            response?.data?.responseData,
            "response?.data?.responseData"
          );
        })
        .catch((error) => {
          // Handle errors here
        });

      const apiUrl = `/preauction/${baseUrlEng}/GetSaleDateAndTeaType`;
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(data.saleNo),
          season: data.season,
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          setSaleDates(res?.data?.responseData);
          // formik.setFieldValue(
          //   "teaTypeId",
          //   res?.data?.responseData?.at(0)?.teaTypeId
          // );
        })
        .catch((error) => {
          // Handle errors here
        });
      axiosMain
        .post("/preauction/Common/BindAuctioneerByInvoice", {
          season: data.season,
          saleNo: parseInt(data.saleNo),
          AuctioneerId: data.userId, //auctioner
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          // Handle the API response here'

          setAuctioneer(response?.data?.responseData);
          // setSelectedSalePrograms({
          //   ...selectedSalePrograms,
          //   categoryId: response?.data?.responseData[0].categoryId,
          // });
          console.log(response);
        });
    } else {
      console.log(data);
    }
  }

  useEffect(() => {
    getEditValues();
    // //debugger;
  }, [dataBy?.dataByID]);

  const resetForm = () => {
    formik.handleReset();
    setHandleChnage(false); // Reset the "handleChange" flag as well
    fields
      .filter(
        (field) => field.type === "select" || field.type === "disableSelect"
      )
      .forEach((field) => {
        formik.setFieldValue(field.name, "");
      });
    setSelectedSalePrograms([
      {
        userId: 0,
        marketTypeId: 0,
        categoryId: 1,
        teaTypeId: 1,
        sessionTypeId: 1,
        saleDate: formik.values.saleDate,
        startDate: null,
        enddate: null,
        minimumBidTime: 1,
        noOfLots: 0,
        status: 0,
        remarks: "",
      },
    ]);

    // console.log(, "updatedProgram");
  };

  useEffect(() => {
    resetForm();

    console.log(expandedTab, "expandedTab");
  }, [expandedTab]);

  useEffect(() => {
    formik.setFieldValue("sessionList", selectedSalePrograms);
  }, [selectedSalePrograms]);

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const category = useSelector((state) => state?.category?.data?.responseData);
  const sessionType = useSelector(
    (state) => state?.sessionTypesReducer?.data?.responseData
  );
  // console.log(invoiceData, "invoiceData");
  useEffect(() => {
    formik.setFieldValue("season", currentYear);
    dispatch(fetchSaleNumbersRequest(currentYear.toString()));
    dispatch(teaTypeAction({ auctionCenterId }));
    dispatch(fetchMarkTypeRequest());
    dispatch(
      fetchCategoryRequest({
        teaTypeId: parseInt(formik.values.teaTypeId),
        auctionCenterId,
      })
    );
    dispatch(fetchSessionTypeRequest());
    axiosMain
      .post("/admin/user/dropdown/getUserDetail", { roleCode })
      .then((response) => {
        // Handle the API response here
        setAuctioneer(response.data.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });
    // updateSelectedSaleProgram(0, updatedProgram);

    axiosMain
      .get("/admin/ruleEngine/getByAuctionCenterId/" + auctionCenterId, {
        roleCode,
      })
      .then((response) => {
        // Handle the API response here
        // setAuctioneer(response.data.responseData);
        if (response.data.statusCode === 200) {
          setTimeIntervalBetweenTwoAuctionSessionData(
            response.data.responseData
          );
        } else {
          setTimeIntervalBetweenTwoAuctionSessionData(10);
          CustomToast.warning(response.data.message);
        }
        // setTimeIntervalBetweenTwoAuctionSessionData(response.data.responseData);
        console.log(response, "responseresponse");
      })
      .catch((error) => {
        // Handle errors here
      });
  }, []);

  useEffect(() => {
    // formik.setFieldValue("season", currentYear);
    formik.values.season = currentYear;

    setSaleNo(saleNumber);
    // setCategory(category);
    // itemsOnPage
    //   .slice(startIndex, endIndex)
    //   ?.map(
    //     (ele, index) =>
    //       (selectedSalePrograms[index].sessionTypeId =
    //         sessionType?.at(0)?.sessionTypeId)
    //   );
    setSessionType(sessionType);
    // setTeaTeatypeList(teaType);
  }, [saleNumber, category, sessionType]);

  useEffect(() => {
    if (formik.values.season !== "") {
      dispatch(fetchSaleNumbersRequest(formik.values.season));
    }
    // setSelectedSalePrograms([])
    setSaleDates([]);
    const saleNo = formik.values.saleNo;
    const season =
      formik.values.season === ""
        ? currentYear?.toString()
        : formik.values.season;
    // API endpoint URL
    // const apiUrl = `/preauction/${baseUrlEng}/GetSaleDateAndTeaType`;
    const apiUrlAuctioneer = "/preauction/Common/BindAuctioneerByInvoice";

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (saleNo !== "" && season !== "") {
      // setNumRows(0)
      // setSelectedSalePrograms([]);

      axiosMain
        .post(apiUrlAuctioneer, {
          season: season === "" ? new Date().getFullYear()?.toString() : season,
          saleNo: parseInt(saleNo),
          AuctioneerId: userId, //auctioner
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          // Handle the API response here'

          setAuctioneer(response?.data?.responseData);
          // setSelectedSalePrograms({
          //   ...selectedSalePrograms,
          //   categoryId: response?.data?.responseData[0].categoryId,
          // });
          console.log(response);
        })
        .catch((error) => {
          // Handle errors here
        });

      axiosMain
        .post("/preauction/Common/GetSaleProgramDetailBySaleNo", {
          season: season === "" ? new Date().getFullYear()?.toString() : season,
          saleNo: parseInt(saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          setSaleProgramId(res.data.responseData);
          setAuctionType(res.data.responseData?.at(0)?.auctionTypeCode);
          setBaseUrlEng(
            res.data.responseData?.at(0)?.auctionTypeCode === "ENGLISH"
              ? "EnglishAuctionSession"
              : "AuctionSession"
          );
          let url =
            res.data.responseData?.at(0)?.auctionTypeCode === "ENGLISH"
              ? "EnglishAuctionSession"
              : "AuctionSession";
          axiosMain
            .post(`/preauction/${url}/GetSaleDateAndTeaType`, {
              saleNo: parseInt(saleNo),
              season:
                season === "" ? new Date().getFullYear()?.toString() : season,
              auctionCenterId: auctionCenterId,
            })
            .then((response) => {
              dispatch(
                fetchSessionTypeRequest(
                  res.data.responseData?.at(0)?.auctionTypeCode
                )
              );

              // Handle the API response here
              formik.setFieldValue(
                "saleDate",
                response?.data?.responseData[0]?.saleDate?.split("T")[0]
              );
              formik.setFieldValue(
                "teaTypeId",
                response?.data?.responseData[0]?.teaTypeId
              );
              setSaleDates(response?.data?.responseData);

              itemsOnPage
                .slice(startIndex, endIndex)
                ?.map(
                  (ele, index) =>
                    (selectedSalePrograms[index].saleDate =
                      response?.data?.responseData[0]?.saleDate?.split("T")[0])
                );
              itemsOnPage
                .slice(startIndex, endIndex)
                ?.map(
                  (ele, index) =>
                    (selectedSalePrograms[index].teaTypeId =
                      response?.data?.responseData[0]?.teaTypeId)
                );

              console.log(selectedSalePrograms);
            })
            .catch((error) => {
              // Handle errors here
            });
          if (dataBy?.dataByID?.responseData?.length > 0) {
            formik.setFieldValue(
              "dealBookClosingDate",
              dataBy?.dataByID?.responseData?.at(0)?.dealBookClosingDate
            );
          } else {
            axiosMain
              .post(`/preauction/${url}/ConfigureDealBookTime`, {
                season:
                  season === "" ? new Date().getFullYear()?.toString() : season,
                saleNo: parseInt(saleNo),
                auctionCenterId: auctionCenterId,
              })
              .then((res) => {
                console.log(res.data.responseData, "resData");
                if (res.data.statusCode === 200) {
                  formik.setFieldValue(
                    "dealBookClosingDate",
                    res.data.responseData?.at(0)?.dealBookClosingDate
                  );
                } else {
                  formik.setFieldValue("dealBookClosingDate", "");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // Cleanup function, in case you need to cancel the request
      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo, formik.values.season]);

  useEffect(() => {
    setNumRows(
      dataBy?.dataByID?.responseData?.at(0) !== undefined || onEdit
        ? 1
        : formik.values.noOfSession
    );
    setPageSize(
      dataBy?.dataByID?.responseData?.at(0) !== undefined || onEdit
        ? 1
        : formik.values.noOfSession
    );
  }, [formik.values.noOfSession]);

  function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let i = currentYear; i > currentYear - 7; i--) {
      options.push({ label: i, value: i });
    }

    return options;
  }

  const fields = [
    {
      label: "Season",
      name: "season",
      type:
        dataBy?.dataByID?.responseData?.at(0) !== undefined
          ? "disableSelect"
          : "select",
      options: generateYearOptions(),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Sale No",
      name: "saleNo",
      type:
        dataBy?.dataByID?.responseData?.at(0) !== undefined
          ? "disableSelect"
          : "select",
      options: saleNo?.map((ele) => {
        return { label: ele.saleNo, value: ele.saleNo };
      }),
      required: false,
      className: "FormGroup",
    },
    // {
    //   label: "Sale Date",
    //   name: "saleDate",
    //   type: "disableDatePicker",
    //   required: true,
    //   className: "FormGroup",

    // },
    {
      label: "Sale Date",
      name: "saleDate",
      type:
        dataBy?.dataByID?.responseData?.at(0) !== undefined
          ? "disableSelect"
          : "select",
      options: saleDates?.map((ele) => {
        return { label: ele.saleDate, value: ele.saleDate?.split("T")?.at(0) };
      }),
      required: true,
      className: "FormGroup",
    },
    {
      label: "Tea Type",
      name: "teaTypeId",
      type: "disableSelect",
      options: teaTypeList?.map((ele) => {
        return { label: ele.teaTypeName, value: ele.teatypeid };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "No of Session",
      name: "noOfSession",
      type:
        dataBy?.dataByID?.responseData?.at(0) !== undefined
          ? "disable"
          : "text",
      required: false,
      className: "FormGroup",
    },
    {
      label: "Deal Book Closing Date & Time",
      name: "dealBookClosingDate",
      type:
        dataBy?.dataByID?.responseData?.at(0) !== undefined
          ? dataBy?.dataByID?.responseData?.some((ele) => ele.status === 4)
            ? "dateTimePicker"
            : "disableDateTimePicker"
          : "disableDateTimePicker",
      required: false,
      className: "FormGroup",
    },
  ];

  const Controlls = () => {
    return (
      <>
        {/* <div className="BtnGroup">
          <Button type="submit" className="SubmitBtn">
            Refresh
          </Button>
          <Button type="submit" className="SubmitBtn">
            Update Actual Lots
          </Button>

          <Button className="SubmitBtn">Close</Button>
          {/* <Button
            type="submit"
            className="SubmitBtn w-25"
            onClick={() => {
              if (
                formik.values.saleNo !== null &&
                formik.values.mark !== "" &&
                formik.values.warehouse !== "" &&
                formik.values.grade !== "" &&
                formik.values.invoiceDate !== ""
              ) {
                axios
                  .post(
                    "/preauction/AWRDetails/",

                    {
                      season: formik.values.season,
                      saleNo:
                        formik.values.saleNo === ""
                          ? parseInt(currentWeek)
                          : parseInt(formik.values.saleNo),
                      markId: parseInt(formik.values.mark),
                      wareHouseUserRegId: parseInt(formik.values.warehouse),
                      gradeId: parseInt(formik.values.grade),
                      invoiceDate: formik.values.invoiceDate + "T17:16:40",
                    }
                  )
                  .then((res) => {
                    setTableData(res.data.responseData);
                    const data = res.data.responseData.map(
                      (ele) => ele.totalWeight
                    );
                    // console.log(
                    //   ,"res"
                    // );

                    if (data.length > 0) {
                      let gpq = data.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue;
                      });
                      formik.setFieldValue("gatePassQuantity", gpq);
                    }
                  });
              } else {
                CustomToast.error(
                  "Please First fill those fields Sale No,Mark,WareHouse,Grade and Invoice Date"
                );
              }
            }}
          >
            Get AWR Detail
          </Button> */}
        {/* <label className="btn SubmitBtn mr-2">
            <ImportExportIcon />
          </label> */}

        {/* <label htmlFor="fileUpload" className="btn SubmitBtn mr-2">
            <FileUploadIcon />
          </label> */}
        {/* <input
            type="file"
            className="form-control"
            id="fileUpload"
            accept=".xls, .xlsx"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            multiple
          /> */}
        {/* <label className="btn SubmitBtn">
            <PictureAsPdfIcon />
        </label>
        </div> */}
      </>
    );
  };

  const updateSelectedSaleProgram = (index, updatedProgram) => {
    try {
      const updatedPrograms = [...selectedSalePrograms];
      updatedPrograms[index] = updatedProgram;

      // You can perform the API call regardless of whether saleDate is available or not

      setSelectedSalePrograms(updatedPrograms);
    } catch (error) {
      console.error("API call error:", error);
      // Handle the error if needed
    }
  };
  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    const saleDate = formik.values.saleDate;
    // API endpoint URL
    const apiUrl = `/preauction/${baseUrlEng}/GetTeaTypeByParam`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (saleNo !== 0 && saleDate !== "") {
      axiosMain
        .post(apiUrl, {
          season: season === "" ? new Date().getFullYear()?.toString() : season,
          saleNo: parseInt(saleNo),
          saleDate: saleDate,
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          // Handle the API response here
          setTeaTeatypeList(response?.data?.responseData);
          formik.values.teaTypeId =
            response?.data?.responseData?.at(0)?.teatypeid;
          selectedSalePrograms?.map(
            (ele) =>
              (ele.teaTypeId = response?.data?.responseData?.at(0)?.teatypeid)
          );
        })
        .catch((error) => {
          // Handle errors here
        });

      // Cleanup function, in case you need to cancel the request
      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleDate, numRows]);

  // useEffect(() => {
  //   const saleNo = formik.values.saleNo;
  //   const season = formik.values.season;
  //   const apiUrlCatagory = "/preauction/Common/BindCatagoryByParam";
  //   if (dataBy?.dataByID?.responseData?.at(0) !== undefined) {
  //     if (selectedSalePrograms?.length > 0) {
  //       selectedSalePrograms.map((ele) => {
  //         if (ele.userId) {
  //           axiosMain
  //             .post(apiUrlCatagory, {
  //               season: season === "" ? new Date().getFullYear()?.toString() : season,
  //               saleNo: parseInt(saleNo),
  //               AuctioneerId: parseInt(ele.userId),
  //             })
  //             .then((response) => {
  //               // Handle the API response here'

  //               setCategory(response?.data?.responseData);
  //               // setSelectedSalePrograms({
  //               //   ...selectedSalePrograms,
  //               //   categoryId: response?.data?.responseData[0].categoryId,
  //               // });
  //               console.log(response);
  //             })
  //             .catch((error) => {
  //               // Handle errors here
  //             });
  //         }
  //       });
  //     }
  //   }
  // }, [selectedSalePrograms]);

  const validateTimeRanges = () => {
    selectedSalePrograms.map((ele, index) => {
      if (
        selectedSalePrograms[index - 1]?.endTime >
        selectedSalePrograms[index].startTime
      ) {
        console.log(
          "The end time of the first interval is greater than the start time of the second interval."
        );
      } else {
        console.log(
          "The end time of the first interval is not greater than the start time of the second interval."
        );
      }
    });
  };

  // console.log(, "validateTimeRanges");

  const handlePrePost = (rowData) => {
    // if (
    //   dataBy?.dataByID?.responseData?.at(0)?.auctionSessionList !== undefined
    // ) {
    //   setPrePostData(
    //     dataBy?.dataByID?.responseData?.at(0)?.auctionSessionList?.at(rowData)
    //   );
    // } else {
    //   setPrePostData({});
    // }
    setAuctionSessionDetailId(
      selectedSalePrograms[rowData]?.auctionSessionDetailId
    );
    //debugger;
    axiosMain
      .post(
        `/preauction/${baseUrlEng}/PrePostponeAuctionSessionRequest?auctionSessionDetailId=` +
          selectedSalePrograms[rowData]?.auctionSessionDetailId
      )
      .then((response) => {
        setPrePostData(response.data.responseData?.at(0));
      });

    setSmShow(true);
  };

  function calculateEndTime(startTime) {
    // //debugger;
    // Split the input time into hours and minutes
    let [startHour, startMinute] = startTime.split(":").map(Number);

    // Create a new Date object with today's date and the provided time
    let startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    // Add 10 minutes to the start time
    let endDate = new Date(startDate.getTime() + 10 * 60000); // 10 minutes in milliseconds

    // Format the end time as a string (HH:MM format)
    let formattedEndTime =
      ("0" + endDate.getHours()).slice(-2) +
      ":" +
      ("0" + endDate.getMinutes()).slice(-2);

    return formattedEndTime;
  }

  function generateTimeSlots(startTime, numberOfRows, index) {
    const timeSlots = [];
    const timeGap = 10; // 10 minutes gap

    // Convert start time to Date object
    const startDate = new Date(`01/01/2000 ${startTime}`);

    let previousEndTime = null;

    for (let i = 0; i < numberOfRows; i++) {
      let newStartTime;

      if (index === 0) {
        newStartTime = new Date(startDate.getTime() - timeGap * 60000);
      } else {
        newStartTime = previousEndTime
          ? new Date(previousEndTime.getTime() + 60000)
          : new Date(startDate.getTime());
      }

      const newEndTime = new Date(newStartTime.getTime() + timeGap * 60000);

      const formattedStartTime = newStartTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedEndTime = newEndTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      timeSlots.push({
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      });

      previousEndTime = newEndTime;
    }

    return timeSlots;
  }

  return (
    <>
      <div>
        <ConfirmationModal
          show={openDelete}
          title={"Are you sure you "}
          onDelete={() => {
            setRows([...rows?.filter((ele) => ele.id !== actionData.edit.id)]);
            setOpenDelete(false);
          }}
          onHide={() => setOpenDelete(false)}
        />

        <form onSubmit={formik.handleSubmit}>
          <div className="">
            <div className="">
              <div className="row">
                <CustomeFormCreater
                  fields={fields}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  // handleSubmit={() => handleSubmit()}
                  // uploadedFiles={uploadedFiles}
                  // setUploadedFiles={setUploadedFiles}
                  // handleFileRemove={handleFileRemove}
                  formik={formik}
                  Controlls={Controlls}
                  setHandleChnage={setHandleChnage}
                />
                {/* <div className="col-lg-2 my-3">
                    <div className="row g-3">
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        Add
                      </Button>
                      <Button variant="primary">Update Actual Lots</Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          let data = {
                            season: currentYear?.toString(),
                            saleNo: currentWeek,
                          };
                        }}
                      >
                        Refresh
                      </Button>
                    </div>
                  </div> */}
              </div>
              <div className="col-md-12 mt-3">
                <table className="table table-responsive">
                  <thead>
                    <tr>
                      <th>Auctioneer</th>
                      {auctionType !== "ENGLISH" && <th>Market Type</th>}
                      <th>Category</th>
                      <th>TeaType</th>
                      <th>Session Type</th>
                      <th>Sale Date</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Minimum Bid Time</th>
                      <th>No Of Lots</th>
                      <th>Status</th>
                      {auctionType !== "ENGLISH" && (
                        <th
                          style={{
                            display:
                              dataBy?.dataByID?.responseData?.at(0) !==
                              undefined
                                ? "none"
                                : "",
                          }}
                        >
                          Remark
                        </th>
                      )}
                      {dataBy?.dataByID?.responseData?.at(0) !== undefined &&
                      onEdit == false
                        ? modalRight?.includes("27") && (
                            <th
                              style={{
                                display:
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                    ? ""
                                    : "none",
                              }}
                            >
                              {" "}
                              Action{" "}
                            </th>
                          )
                        : ""}
                    </tr>
                  </thead>
                  <tbody>
                    {itemsOnPage
                      .slice(startIndex, endIndex)
                      ?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <FormControl
                              as="select"
                              size="sm"
                              name="userId"
                              value={selectedSalePrograms[index]?.userId || ""}
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].userId = parseInt(
                                    e.target.value
                                  );
                                  // const updatedProgram = {
                                  //   ...selectedSalePrograms[index],
                                  //   userId: e.target.value,
                                  // };
                                  // updateSelectedSaleProgram(
                                  //   index,
                                  //   updatedProgram
                                  // );
                                  const saleNo = formik.values.saleNo;
                                  const season = formik.values.season;
                                  const apiUrlCatagory =
                                    "/preauction/Common/BindCatagoryByParam";

                                  const marketTypeIdapiUrlCatagory =
                                    "/preauction/Common/BindMarketTypeByParam";

                                  axiosMain
                                    .post(marketTypeIdapiUrlCatagory, {
                                      season:
                                        season === ""
                                          ? new Date().getFullYear()?.toString()
                                          : season,
                                      saleNo: parseInt(saleNo),
                                      AuctioneerId: parseInt(e.target.value),
                                      auctionCenterId: auctionCenterId,
                                    })
                                    .then((response) => {
                                      // Handle the API response here'
                                      selectedSalePrograms[index].marketTypeId =
                                        response?.data?.responseData?.at(
                                          0
                                        )?.marketTypeId;
                                      selectedSalePrograms[
                                        index
                                      ].marketTypeName =
                                        response?.data?.responseData[0].marketTypeName;

                                      setMarkType(response?.data?.responseData);
                                    })
                                    .catch((error) => {
                                      // Handle errors here
                                    });
                                  axiosMain
                                    .post(apiUrlCatagory, {
                                      season:
                                        season === ""
                                          ? new Date().getFullYear()?.toString()
                                          : season,
                                      saleNo: parseInt(saleNo),
                                      AuctioneerId: parseInt(e.target.value),
                                      auctionCenterId: auctionCenterId,
                                    })
                                    .then((response) => {
                                      // Handle the API response here'

                                      setCategory(response?.data?.responseData);

                                      selectedSalePrograms[index].categoryId =
                                        response?.data?.responseData[0].categoryId;
                                      // setSelectedSalePrograms({
                                      //   ...selectedSalePrograms,
                                      //   categoryId:
                                      //     response?.data?.responseData[0]
                                      //       .categoryId,
                                      // });
                                      console.log(response);
                                    })
                                    .catch((error) => {
                                      // Handle errors here
                                    });
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    userId: e.target.value,
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );

                                  // selectedSalePrograms[index].userId = parseInt(
                                  const saleNo = formik.values.saleNo;
                                  const season = formik.values.season;
                                  const apiUrlCatagory =
                                    "/preauction/Common/BindCatagoryByParam";

                                  const marketTypeIdapiUrlCatagory =
                                    "/preauction/Common/BindMarketTypeByParam";

                                  axiosMain
                                    .post(marketTypeIdapiUrlCatagory, {
                                      season:
                                        season === ""
                                          ? new Date().getFullYear()?.toString()
                                          : season,
                                      saleNo: parseInt(saleNo),
                                      AuctioneerId: parseInt(e.target.value),
                                      auctionCenterId: auctionCenterId,
                                    })
                                    .then((response) => {
                                      // Handle the API response here'
                                      selectedSalePrograms[index].marketTypeId =
                                        response?.data?.responseData?.at(
                                          0
                                        )?.marketTypeId;
                                      selectedSalePrograms[
                                        index
                                      ].marketTypeName =
                                        response?.data?.responseData[0].marketTypeName;

                                      setMarkType(response?.data?.responseData);
                                    })
                                    .catch((error) => {
                                      // Handle errors here
                                    });
                                  axiosMain
                                    .post(apiUrlCatagory, {
                                      season:
                                        season === ""
                                          ? new Date().getFullYear()?.toString()
                                          : season,
                                      saleNo: parseInt(saleNo),
                                      AuctioneerId: parseInt(e.target.value),
                                      auctionCenterId: auctionCenterId,
                                    })
                                    .then((response) => {
                                      // Handle the API response here'

                                      setCategory(response?.data?.responseData);

                                      selectedSalePrograms[index].categoryId =
                                        response?.data?.responseData[0].categoryId;
                                      // setSelectedSalePrograms({
                                      //   ...selectedSalePrograms,
                                      //   categoryId:
                                      //     response?.data?.responseData[0]
                                      //       .categoryId,
                                      // });
                                      console.log(response);
                                    })
                                    .catch((error) => {
                                      // Handle errors here
                                    }); //   e.target.value
                                  // );
                                }
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? selectedSalePrograms[index]
                                      ?.sessionTypeName !== "Normal"
                                    ? true
                                    : onEdit
                                  : false
                              }
                            >
                              <option value={0}>Select Auctioneer</option>

                              {auctioneer?.length > 0 ? (
                                auctioneer?.map((item, index) => (
                                  <option value={item.userId} key={item.userId}>
                                    {item.userCode}
                                  </option>
                                ))
                              ) : (
                                <option>No Data</option>
                              )}
                            </FormControl>
                          </td>
                          {auctionType !== "ENGLISH" && (
                            <td>
                              <FormControl
                                as="select"
                                size="sm"
                                //type="select"
                                //size="sm"
                                name="marketTypeId"
                                value={
                                  // selectedSalePrograms[index]?.marketTypeId || ""
                                  selectedSalePrograms[index]?.marketTypeId ||
                                  ""
                                }
                                onChange={(e) => {
                                  if (
                                    dataBy?.dataByID?.responseData?.at(0) !==
                                    undefined
                                  ) {
                                    const updatedProgram = {
                                      ...selectedSalePrograms[index],
                                      marketTypeId: parseInt(e.target.value),
                                    };
                                    updateSelectedSaleProgram(
                                      index,
                                      updatedProgram
                                    );
                                    // selectedSalePrograms[index].marketTypeId =
                                    //   parseInt(e.target.value);
                                  } else {
                                    const updatedProgram = {
                                      ...selectedSalePrograms[index],
                                      marketTypeId: parseInt(e.target.value),
                                    };
                                    updateSelectedSaleProgram(
                                      index,
                                      updatedProgram
                                    );
                                  }
                                }}
                                disabled={
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                    ? selectedSalePrograms[index]
                                        ?.sessionTypeName !== "Normal"
                                      ? true
                                      : onEdit
                                    : false
                                }
                                // disabled
                              >
                                <option value="">Select Market Type</option>
                                {markType?.length > 0 ? (
                                  markType?.map((item, index) => (
                                    <option
                                      value={item.marketTypeId}
                                      key={item.marketTypeId}
                                    >
                                      {item.marketTypeName}
                                    </option>
                                  ))
                                ) : (
                                  <option>No Data</option>
                                )}
                              </FormControl>
                            </td>
                          )}
                          <td>
                            <FormControl
                              as="select"
                              size="sm"
                              name="categoryId"
                              value={
                                selectedSalePrograms[index]?.categoryId || ""
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    categoryId: parseInt(e.target.value),
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                  // selectedSalePrograms[index].categoryId =
                                  //   parseInt(e.target.value);
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    categoryId: parseInt(e.target.value),
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }
                              }}
                              c
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? selectedSalePrograms[index]
                                      ?.sessionTypeName !== "Normal"
                                    ? true
                                    : onEdit
                                  : false
                              }
                            >
                              <option value={0}>Select Category</option>
                              {catagory?.length > 0
                                ? catagory?.map((item, index) => (
                                    <option value={item.categoryId} key={index}>
                                      {item.categoryCode}
                                    </option>
                                  ))
                                : "No Data"}
                            </FormControl>
                          </td>
                          <td>
                            <FormControl
                              as="select"
                              size="sm"
                              name="teaTypeId"
                              value={
                                selectedSalePrograms[index]?.teaTypeId ||
                                formik.values.teaTypeId
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].teaTypeId =
                                    parseInt(e.target.value);
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    teaTypeId: parseInt(e.target.value),
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }
                              }}
                              disabled
                            >
                              {teaTypeList?.length > 0
                                ? teaTypeList?.map((item, index) => (
                                    <option value={item?.teatypeid}>
                                      {item.teaTypeName}
                                    </option>
                                  ))
                                : "No Data"}
                            </FormControl>
                          </td>
                          <td>
                            <FormControl
                              as="select"
                              size="sm"
                              value={selectedSalePrograms[index]?.sessionTypeId}
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    teaTypeId: formik.values.teaTypeId,
                                    sessionTypeId: parseInt(e.target.value),
                                    sessionTypeName: item.sessionTypeName,
                                  };
                                  // selectedSalePrograms[index].sessionTypeId =
                                  //   parseInt(e.target.value);
                                  // selectedSalePrograms[index].teaTypeId =
                                  //   formik.values.teaTypeId;

                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    teaTypeId: formik.values.teaTypeId,
                                    sessionTypeId: parseInt(e.target.value),
                                    sessionTypeName: item.sessionTypeName,
                                  };
                                  // //debugger;
                                  // selectedSalePrograms[index].sessionTypeId =
                                  //   parseInt(e.target.value);
                                  // selectedSalePrograms[index].teaTypeId =
                                  //   formik.values.teaTypeId;

                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                }
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? auctionType === "ENGLISH"
                                    ? true
                                    : selectedSalePrograms[index]
                                        ?.sessionTypeName !== "Normal"
                                    ? true
                                    : onEdit
                                  : false
                              }
                            >
                              {sessionTypes?.length > 0
                                ? sessionTypes?.map((item, index) => (
                                    <option value={item?.sessionTypeId}>
                                      {item.sessionTypeName}
                                    </option>
                                  ))
                                : "No Data"}
                            </FormControl>
                          </td>
                          <td>
                            <input
                              type="date"
                              id="saleDate"
                              value={formik?.values?.saleDate}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              id="startDate"
                              value={
                                selectedSalePrograms[index]?.startDate?.split(
                                  "T"
                                )[1] || ""
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    startDate:
                                      formik?.values?.saleDate +
                                      "T" +
                                      e.target.value +
                                      ":00",
                                  };

                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                  // selectedSalePrograms[index].startDate =
                                  //   formik?.values?.saleDate +
                                  //   "T" +
                                  //   e.target.value +
                                  //   ":00";
                                  // setStartDate(e.target.value);
                                } else {
                                  console.log(
                                    calculateEndTime(e.target.value),
                                    generateTimeSlots(
                                      e.target.value,
                                      numRows,
                                      index
                                    ),
                                    "hhhhhh"
                                  );
                                  // validateTimeRanges();
                                  // const updatedProgram = {
                                  //   ...selectedSalePrograms[index],
                                  //   saleDate: formik.values.saleDate,
                                  //   startDate:
                                  //     formik.values.saleDate +
                                  //     "T" +
                                  //     e.target.value +
                                  //     ":00",
                                  // };
                                  // updateSelectedSaleProgram(
                                  //   index,
                                  //   updatedProgram
                                  // );
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    startDate:
                                      formik?.values?.saleDate +
                                      "T" +
                                      e.target.value +
                                      ":00",
                                  };

                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );

                                  // selectedSalePrograms[index].startDate =
                                  //   formik?.values?.saleDate +
                                  //   "T" +
                                  //   e.target.value +
                                  //   ":00";

                                  setStartDate(e.target.value);
                                }

                                // const pubDate = new Date(e.target.value);
                                // const nextDayDate = new Date(pubDate);
                                // nextDayDate.setDate(pubDate?.getDate() + 1);
                                // setMinDate(
                                //   nextDayDate?.toISOString()?.split("T")[0]
                                // );
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              id="enddate"
                              // min={startDate || undefined} // Set min time to the start time
                              value={
                                selectedSalePrograms[index]?.enddate?.split(
                                  "T"
                                )[1]
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  if (e.target.value > startDate) {
                                    const updatedProgram = {
                                      ...selectedSalePrograms[index],
                                      enddate:
                                        formik?.values?.saleDate +
                                        "T" +
                                        e.target.value +
                                        ":00",
                                    };

                                    updateSelectedSaleProgram(
                                      index,
                                      updatedProgram
                                    );
                                    // selectedSalePrograms[index].enddate =
                                    //   formik?.values?.saleDate +
                                    //   "T" +
                                    //   e.target.value +
                                    //   ":00";
                                  } else {
                                    CustomToast.error(
                                      "End Date must be grater then start date"
                                    );
                                  }
                                } else {
                                  if (e.target.value > startDate) {
                                    const updatedProgram = {
                                      ...selectedSalePrograms[index],
                                      enddate:
                                        formik?.values?.saleDate +
                                        "T" +
                                        e.target.value +
                                        ":00",
                                    };
                                    // selectedSalePrograms[index].enddate =
                                    //   formik?.values?.saleDate +
                                    //   "T" +
                                    //   e.target.value +
                                    //   ":00";
                                    if (numRows - 1 === index + 1) {
                                      addStartDateInNextRow(
                                        index,
                                        e.target.value,
                                        updatedProgram
                                      );
                                    }
                                    updateSelectedSaleProgram(
                                      index,
                                      updatedProgram
                                    );
                                  } else {
                                    CustomToast.error(
                                      "End Date must be grater then start date"
                                    );
                                  }

                                  // const updatedProgram = {
                                  //   ...selectedSalePrograms[index],
                                  //   enddate:
                                  //     formik.values.saleDate +
                                  //     "T" +
                                  //     e.target.value +
                                  //     ":00",
                                  // };

                                  // if (e.target.value > startDate) {
                                  //   console.log(updatedProgram);
                                  //   updateSelectedSaleProgram(
                                  //     index,
                                  //     updatedProgram
                                  //   );
                                  // } else {
                                  //   CustomToast.error(
                                  //     "End Date must be grater then start date"
                                  //   );
                                  // }
                                }

                                // const pubDate = new Date(e.target.value);
                                // const nextDayDate = new Date(pubDate);
                                // nextDayDate.setDate(pubDate?.getDate() + 1);
                                // setMinDate(
                                //   nextDayDate?.toISOString()?.split("T")[0]
                                // );
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              id="minimumBidTime"
                              value={
                                selectedSalePrograms[index]?.minimumBidTime
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  // selectedSalePrograms[index].minimumBidTime =
                                  //   parseInt(e.target.value);
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    minimumBidTime:
                                      e.target.value === ""
                                        ? e.target.value
                                        : parseInt(e.target.value),
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    minimumBidTime:
                                      e.target.value === ""
                                        ? e.target.value
                                        : parseInt(e.target.value),
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                  // selectedSalePrograms[index].minimumBidTime =
                                  //   parseInt(e.target.value);
                                  // const updatedProgram = {
                                  //   ...selectedSalePrograms[index],
                                  //   minimumBidTime: parseInt(e.target.value),
                                  // };
                                  // updateSelectedSaleProgram(
                                  //   index,
                                  //   updatedProgram
                                  // );
                                  console.log(
                                    index,
                                    e.target.value,
                                    selectedSalePrograms
                                  );
                                }
                                // const pubDate = new Date(e.target.value);
                                // const nextDayDate = new Date(pubDate);
                                // nextDayDate.setDate(pubDate?.getDate() + 1);
                                // setMinDate(
                                //   nextDayDate?.toISOString()?.split("T")[0]
                                // );
                              }}
                              disabled={
                                dataBy?.dataByID?.responseData?.at(0) !==
                                undefined
                                  ? onEdit
                                  : false
                              }
                              maxlength="2"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              id="No of Lots"
                              value={selectedSalePrograms[index]?.noOfLots}
                              maxLength={4}
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    noOfLots:
                                      e.target.value === ""
                                        ? e.target.value
                                        : parseInt(e.target.value),
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                  // selectedSalePrograms[index].noOfLots =
                                  //   parseInt(e.target.value);
                                  // setStartDate(e.target.value);
                                } else {
                                  //   const updatedProgram = {
                                  //   ...selectedSalePrograms[index],
                                  //   noOfLots: parseInt(e.target.value),
                                  //
                                  // };
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    noOfLots:
                                      e.target.value === ""
                                        ? e.target.value
                                        : parseInt(e.target.value),
                                    status: 0,
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                  // selectedSalePrograms[index].noOfLots =
                                  //   parseInt(e.target.value);

                                  // selectedSalePrograms[index].status = 0;

                                  // updateSelectedSaleProgram(
                                  //   index,
                                  //   updatedProgram
                                  // );
                                }

                                // const pubDate = new Date(e.target.value);
                                // const nextDayDate = new Date(pubDate);
                                // nextDayDate.setDate(pubDate?.getDate() + 1);
                                // setMinDate(
                                //   nextDayDate?.toISOString()?.split("T")[0]
                                // );
                              }}
                              disabled={
                                dataBy.lotNoDisable
                                  ? dataBy.lotNoDisable
                                  : dataBy?.dataByID?.responseData?.at(0) !==
                                    undefined
                                  ? onEdit
                                  : false
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              id="Status"
                              value={
                                selectedSalePrograms[index]?.status === 5
                                  ? "Cancelled"
                                  : "Pending"
                              }
                              onChange={(e) => {
                                if (
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                ) {
                                  selectedSalePrograms[index].status = 0;
                                } else {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    status: 0,
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                  // const pubDate = new Date(e.target.value);
                                  // const nextDayDate = new Date(pubDate);
                                  // nextDayDate.setDate(pubDate?.getDate() + 1);
                                  // setMinDate(
                                  //   nextDayDate?.toISOString()?.split("T")[0]
                                  // );
                                }
                              }}
                              disabled
                            />
                          </td>
                          {auctionType !== "ENGLISH" && (
                            <td
                              style={{
                                display:
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                    ? "none"
                                    : "block",
                              }}
                            >
                              <input
                                type="text"
                                id="Remark"
                                value={
                                  selectedSalePrograms[index]?.remarks || ""
                                }
                                onChange={(e) => {
                                  const updatedProgram = {
                                    ...selectedSalePrograms[index],
                                    remarks: e.target.value,
                                  };
                                  updateSelectedSaleProgram(
                                    index,
                                    updatedProgram
                                  );
                                  // const pubDate = new Date(e.target.value);
                                  // const nextDayDate = new Date(pubDate);
                                  // nextDayDate.setDate(pubDate?.getDate() + 1);
                                  // setMinDate(
                                  //   nextDayDate?.toISOString()?.split("T")[0]
                                  // );
                                }}
                                disabled={
                                  dataBy?.dataByID?.responseData?.at(0) !==
                                  undefined
                                    ? onEdit
                                    : false
                                }
                              />
                            </td>
                          )}
                          {dataBy?.dataByID?.responseData?.at(0) !==
                            undefined && onEdit == false
                            ? modalRight?.includes("27") && (
                                <td
                                  style={{
                                    display:
                                      dataBy?.dataByID?.responseData?.at(0) !==
                                      undefined
                                        ? ""
                                        : "none",
                                  }}
                                >
                                  <button
                                    type="button"
                                    className="w-100"
                                    onClick={() => handlePrePost(item)}
                                  >
                                    Pre/Postpone
                                  </button>
                                  {/* <button
                              type="button"preauction/${baseUrlEng}/UpdateAuctionSession
                              onClick={() => {
                                axiosMain.post(
                                  "/${baseUrlEng}/CancelAuctionSession",
                                  {
                                    auctionSessionId:
                                      selectedSalePrograms[index]
                                        ?.auctionSessionId,
                                    auctionSessionDetailId:
                                      selectedSalePrograms[index]
                                        ?.auctionSessionDetailId,
                                    updatedBy: 4,
                                  }
                                );
                              }}
                            >
                              Cancle
                            </button> */}
                                  {/* <button
                              type="button"
                              onClick={async () => {
                                const response = await axiosMain.post(
                                  "/preauction/${baseUrlEng}/CancelAuctionSession",
                                  {
                                    auctionSessionId:
                                      selectedSalePrograms[index]
                                        ?.auctionSessionId,
                                    auctionSessionDetailId:
                                      selectedSalePrograms[index]
                                        ?.auctionSessionDetailId,
                                    updatedBy: 4,
                                  }
                                );
                                console.log(response, "responseresponse");
                                if (response.data.statusCode === 204) {
                                  // Show toast message here
                                  CustomToast.error(response.data.message);
                                }
                                if (response.data.statusCode === 200) {
                                  // Show toast message here
                                  CustomToast.success(response.data.message);
                                }
                              }}
                            >
                              Cancel
                            </button> */}
                                </td>
                              )
                            : ""}

                          {/* <td>
                          <input
                            type="date"
                            id="saleDate"
                            value={
                              selectedSalePrograms[index]?.saleDate?.split(
                                "T"
                              )[0] || ""
                            }
                            disabled={isDisabled}
                            onChange={(e) => {
                              const updatedProgram = {
                                ...selectedSalePrograms[index],
                                saleDate: e.target.value,
                              };
                              updateSelectedSaleProgram(index, updatedProgram);
                              // const pubDate = new Date(e.target.value);
                              // const nextDayDate = new Date(pubDate);
                              // nextDayDate.setDate(pubDate?.getDate() + 1);
                              // setMinDate(
                              //   nextDayDate?.toISOString()?.split("T")[0]
                              // );
                            }} 
                            min={minDate}
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            disabled={true}
                            value={
                              selectedSalePrograms[
                                index
                              ]?.buyersPromptDate?.split("T")[0] || ""
                            }
                          />
                        </td>
                        <td>
                          <input
                            disabled={true}
                            type="date"
                            value={
                              selectedSalePrograms[
                                index
                              ]?.sellersPromptDate?.split("T")[0] || ""
                              // selectedSalePrograms[index]?.sellersPromptDate?
                            }
                          />
                        </td>
                        <td>
                          {selectedSaleProgram?.status === null
                            ? "-"
                            : getStatusText(selectedSaleProgram?.status)}
                        </td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="col-auto py-3">
                {dataBy?.dataByID?.responseData?.at(0) !== undefined &&
                onEdit == false ? (
                  <div className="row">
                    <div className="col-md-5">
                      <pre>
                        ● The system will automatically add two hours (default)
                        to the deal book closing date and time of the last
                        configured auction session. However, users will have the
                        option to manually edit the date and time after any
                        auction session closed of particular sale no.
                      </pre>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="BtnGroup ">
                  {dataBy?.dataByID?.responseData?.at(0) !== undefined &&
                  onEdit == true ? (
                    ""
                  ) : (
                    <Button
                      type="submit"
                      className="SubmitBtn"
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   console.log(startDate, "startDate");
                      // }}
                    >
                      {dataBy?.dataByID?.responseData?.at(0) !== undefined
                        ? "Update"
                        : "Submit"}
                    </Button>
                  )}
                  {dataBy?.dataByID?.responseData?.at(0) !== undefined &&
                  onEdit == false ? (
                    <Button
                      type="button"
                      onClick={() =>
                        dataBy?.dataByID?.responseData?.at(0) !== undefined
                          ? getEditValues()
                          : resetForm()
                      }
                      className="SubmitBtn"
                    >
                      <i class="fa fa-refresh"></i>
                    </Button>
                  ) : (
                    <> </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Modal
        size="xl"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Prepone/Postpone Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure to want to Prepone/Postpone the selected auction session?
        </Modal.Body>
        <Modal.Footer>
          <div className="row">
            <div className="col-md-6">
              <Button onClick={() => setShow(true)}>Yes</Button>
            </div>
            <div className="col-md-6">
              <Button onClick={() => setSmShow(false)}>No</Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={show}
        size="xl"
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {`Postpone details of auctioneer ${prePostData?.userName} for Season ${formik.values.season} Sale No. ${formik.values.saleNo} and Tea Type: ${prePostData?.teaTypeName}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PrePostDate
            dateAndTime={prePostData}
            setShow={setShow}
            setSmShow={setSmShow}
            setExpandedTab={dataBy?.setExpandedTab}
            auctionSessionDetailId={auctionSessionDetailId}
            baseUrlEng={baseUrlEng}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Maintananse;
