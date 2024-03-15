import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./modal.css";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import Modals from "../../../../components/common/Modal";
import ExcelJS from "exceljs";

import { saveAs } from "file-saver";

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
import { useDispatch } from "react-redux";
import {
  fetchAwrListRequest,
  fetchGradeRequest,
  fetchInvoiceDetailsIdRequest,
  fetchMarkRequest,
  fetchSaleNumbersRequest,
  fetchSampleShortageListRequest,
  fetchSampleShortageRequest,
  fetchWarehouseUserRequest,
} from "../../../../store/actions";
import CustomeFormCreater from "../../../../components/common/formCreater/CustomeFormCreater";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import axios from "axios";
import ConvertTo12HourFormat from "../../../../components/common/dateAndTime/ConvertTo12HourFormat";
import Maintananse from "../maintanance/Maintananse";
import axiosMain from "../../../../http/axios/axios_main";
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import CustomToast from "../../../../components/Toast";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import HoldResume from "../maintanance/HoldResume";
import PrintableTable from "../../../../components/common/PrintableTable";

const allSampleShortage = [];

const currentDate = new Date().toISOString()?.split("T")[0];

// Get the current year
const currentYear = new Date().getFullYear();

const currentWeek = Math.ceil(
  ((new Date() - new Date(currentYear, 0, 4)) / 86400000 + 1) / 7
);

const validationSchema = Yup.object().shape({
  season: Yup.string().required("Season is required"),
  saleNo: Yup.string().required("Sale No is required"),
});

const initialValues = {
  season: currentYear?.toString(),
  saleNo: 0,
  saleDate: "",
  noOfSession: "",
  teaType: "",
  teaTypeId: null,
};

const Modal = ({ modalRight }) => {
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
    auction,
  } = useAuctionDetail();
  const [expandedTab, setExpandedTab] = useState("panel1");
  const [rows, setRows] = useState(allSampleShortage);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [prePostData, setPrePostData] = useState([]);
  const [prePostDataresume, setPrePostDataResume] = useState([]);
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [show, setShow] = useState(false);
  const [showresume, setShowResume] = useState(false);

  const dispatch = useDispatch();

  const [handleChnage, setHandleChnage] = useState(false);
  const [saleNo, setSaleNo] = useState([]);
  const [teaTypeList, setTeaTypeList] = useState([]);
  const [dataByID, setDataByID] = useState([]);
  const [saleDates, setSaleDates] = useState([]);
  const [disable, setDisable] = useState(false);
  const [onEdit, setEdit] = useState(false);
  const [lotNoDisable, setLotNoDisable] = useState(false);
  const [auctionType, setAuctionType] = useState(auction);

  const [baseUrlEng, setBaseUrlEng] = useState(
    auction === "ENGLISH" ? "EnglishAuctionSession" : "AuctionSession"
  );

  const [sampleshortage, setSampleSortage] = useState([
    {
      name: "userName",
      title: "Auctioneer",
    },
    {
      name: "teaTypeName",
      title: "Tea Type",
    },
    {
      name: "categoryName",
      title: "Category",
    },
    {
      name: "sessionTypeName",
      title: "Session Type",
    },
    {
      name: "marketTypeName",
      title: "Market Type",
    },
    {
      name: "saleDate",
      title: "Sale Date",
      getCellValue: ({ ...row }) => <span>{row?.saleDate?.split("T")[0]}</span>,
    },
    {
      name: "startDate",
      title: "Start Time",
      getCellValue: ({ ...row }) => (
        <span>{ConvertTo12HourFormat(row?.startDate?.split("T")[1])}</span>
      ),
    },
    {
      name: "enddate",
      title: "End Time",
      getCellValue: ({ ...row }) => (
        <span>{ConvertTo12HourFormat(row?.enddate?.split("T")[1])}</span>
      ),
    },
    {
      name: "noOfLots",
      title: "Number of Lots",
    },
    {
      name: "minimumBidTime",
      title: "MBT",
    },
    {
      name: "status",
      title: "Status",
      getCellValue: ({ status }) => {
        switch (status) {
          case 0: {
            return "Pending";
          }
          case 1: {
            return "Active";
          }
          case 2: {
            return "Inactive";
          }
          case 3: {
            return "Warm up";
          }
          case 4: {
            return "Closed";
          }
          case 5: {
            return "Cancelled";
          }
          case 6: {
            return "Hold";
          }
          case 7: {
            return "Resume";
          }
          case 8: {
            return "PrePond";
          }
          case 9: {
            return "PostPond";
          }
          default:
            return "-";
        }
      },
    },
  ]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      // console.log("values");
      // handleSubmit(values);
      const apiUrl = `/preauction/${baseUrlEng}/GetAuctionSessionList`;
      const { season, saleNo, saleDate, noOfSession } = values;
      const teaType = teaTypeList?.at(0)?.teatypeid;

      if (noOfSession === "") {
        // Show toaster for no data found
        CustomToast.error("No of session is blank, data not found");
        return;
      }
      const data = {
        season: season,
        saleNo: parseInt(saleNo),
        saleDate: saleDate,
        teaTypeId: teaType,
        noOfSession: noOfSession,
        pageNumber: 1,
        pageSize: 10,
        auctionCenterId: auctionCenterId,
        // === null ? parseInt(values.mark) : 0
      };

      axiosMain
        .post(apiUrl, data)
        .then((response) => {
          // Handle the API response here
          setRows(response?.data?.responseData);
          // setRows(response?.data?.responseData[0]);
          //formik.resetForm();
        })
        .catch((error) => {
          // Handle errors here
        });
    },
    validateOnBlur: false, // Disable validation on blur
    validateOnChange: handleChnage, // Disable validation on change
    isInitialValid: false,
  });

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  // console.log(invoiceData, "invoiceData");
  useEffect(() => {
    dispatch(fetchSaleNumbersRequest(currentYear.toString()));
  }, []);

  useEffect(() => {
    setSaleNo(saleNumber);
  }, [saleNumber]);
  useEffect(() => {
    setSaleDates([]);
    setRows([]);
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    dispatch(fetchSaleNumbersRequest(formik.values.season));

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (saleNo !== "") {
      axiosMain
        .post("/preauction/Common/GetSaleProgramDetailBySaleNo", {
          season: season === "" ? new Date().getFullYear()?.toString() : season,
          saleNo: parseInt(saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          // setSaleProgramId(res.data.responseData);
          setAuctionType(res.data.responseData?.at(0)?.auctionTypeCode);
          setBaseUrlEng(
            res.data.responseData?.at(0)?.auctionTypeCode === "ENGLISH"
              ? "EnglishAuctionSession"
              : "AuctionSession"
          );
          setSampleSortage(
            res.data.responseData?.at(0)?.auctionTypeCode === "ENGLISH"
              ? [
                  {
                    name: "userName",
                    title: "Auctioneer",
                  },
                  {
                    name: "teaTypeName",
                    title: "Tea Type",
                  },
                  {
                    name: "categoryName",
                    title: "Category",
                  },
                  {
                    name: "sessionTypeName",
                    title: "Session Type",
                  },
                  {
                    name: "saleDate",
                    title: "Sale Date",
                    getCellValue: ({ ...row }) => (
                      <span>{row?.saleDate?.split("T")[0]}</span>
                    ),
                  },
                  {
                    name: "startDate",
                    title: "Start Time",
                    getCellValue: ({ ...row }) => (
                      <span>
                        {ConvertTo12HourFormat(row?.startDate?.split("T")[1])}
                      </span>
                    ),
                  },
                  {
                    name: "enddate",
                    title: "End Time",
                    getCellValue: ({ ...row }) => (
                      <span>
                        {ConvertTo12HourFormat(row?.enddate?.split("T")[1])}
                      </span>
                    ),
                  },
                  {
                    name: "noOfLots",
                    title: "Number of Lots",
                  },
                  {
                    name: "minimumBidTime",
                    title: "MBT",
                  },
                  {
                    name: "status",
                    title: "Status",
                    getCellValue: ({ status }) => {
                      switch (status) {
                        case 0: {
                          return "Pending";
                        }
                        case 1: {
                          return "Active";
                        }
                        case 2: {
                          return "Inactive";
                        }
                        case 3: {
                          return "Warm up";
                        }
                        case 4: {
                          return "Closed";
                        }
                        case 5: {
                          return "Cancelled";
                        }
                        case 6: {
                          return "Hold";
                        }
                        case 7: {
                          return "Resume";
                        }
                        case 8: {
                          return "PrePond";
                        }
                        case 9: {
                          return "PostPond";
                        }
                        default:
                          return "-";
                      }
                    },
                  },
                ]
              : [
                  {
                    name: "userName",
                    title: "Auctioneer",
                  },
                  {
                    name: "teaTypeName",
                    title: "Tea Type",
                  },
                  {
                    name: "categoryName",
                    title: "Category",
                  },
                  {
                    name: "sessionTypeName",
                    title: "Session Type",
                  },
                  {
                    name: "marketTypeName",
                    title: "Market Type",
                  },
                  {
                    name: "saleDate",
                    title: "Sale Date",
                    getCellValue: ({ ...row }) => (
                      <span>{row?.saleDate?.split("T")[0]}</span>
                    ),
                  },
                  {
                    name: "startDate",
                    title: "Start Time",
                    getCellValue: ({ ...row }) => (
                      <span>
                        {ConvertTo12HourFormat(row?.startDate?.split("T")[1])}
                      </span>
                    ),
                  },
                  {
                    name: "enddate",
                    title: "End Time",
                    getCellValue: ({ ...row }) => (
                      <span>
                        {ConvertTo12HourFormat(row?.enddate?.split("T")[1])}
                      </span>
                    ),
                  },
                  {
                    name: "noOfLots",
                    title: "Number of Lots",
                  },
                  {
                    name: "minimumBidTime",
                    title: "MBT",
                  },
                  {
                    name: "status",
                    title: "Status",
                    getCellValue: ({ status }) => {
                      switch (status) {
                        case 0: {
                          return "Pending";
                        }
                        case 1: {
                          return "Active";
                        }
                        case 2: {
                          return "Inactive";
                        }
                        case 3: {
                          return "Warm up";
                        }
                        case 4: {
                          return "Closed";
                        }
                        case 5: {
                          return "Cancelled";
                        }
                        case 6: {
                          return "Hold";
                        }
                        case 7: {
                          return "Resume";
                        }
                        case 8: {
                          return "PrePond";
                        }
                        case 9: {
                          return "PostPond";
                        }
                        default:
                          return "-";
                      }
                    },
                  },
                ]
          );
          const URL =
            res?.data?.responseData?.at(0)?.auctionTypeCode === "ENGLISH"
              ? "EnglishAuctionSession"
              : "AuctionSession";

          axiosMain
            .post(`/preauction/${URL}/GetSaleDateAndTeaType`, {
              saleNo: parseInt(saleNo),
              season: season,
              auctionCenterId: auctionCenterId,
            })
            .then((response) => {
              // Handle the API response here
              // let datas = response?.data?.responseData.map((ele) =>
              //   ele.saleDate?.split("T")?.at(0)
              // );
              setSaleDates(response?.data?.responseData);

              formik.values.saleDate = response?.data?.responseData?.at(0);

              //   axiosMain
              //     .post(`/preauction/${URL}/GetTeaTypeByParam`, {
              //       season: season,
              //       saleNo: parseInt(saleNo),
              //       saleDate: response?.data?.responseData?.at(0)?.saleDate,
              //       auctionCenterId: auctionCenterId,
              //     })
              //     .then((response) => {
              //       // Handle the API response here
              //       setTeaTypeList(response?.data?.responseData);
              //     })
              //     .catch((error) => {
              //       // Handle errors here
              //     });
            })
            .catch((error) => {
              // Handle errors here
            });
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
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    const saleDate = formik.values.saleDate;
    // const teaType = teaTypeList?.at(0)?.teatypeid;

    // API endpoint URL

    // Data to be sent in the POST request
    axiosMain
      .post(`/preauction/${baseUrlEng}/GetTeaTypeByParam`, {
        season: season,
        saleNo: parseInt(saleNo),
        saleDate: saleDate,
        auctionCenterId: auctionCenterId,
      })
      .then((response) => {
        // Handle the API response here
        setTeaTypeList(response?.data?.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });
  }, [formik.values.saleDate]);

  useEffect(() => {
    const saleDate = formik.values.saleDate;
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    const teaType = teaTypeList?.at(0)?.teatypeid;
    formik.setFieldValue("noOfSession", "");
    const apiUrl = `/preauction/${baseUrlEng}/GetNoOfSession`;

    axiosMain
      .post(apiUrl, {
        season: season,
        saleNo: parseInt(saleNo),
        saleDate: saleDate,
        teaTypeId: teaType,
        auctionCenterId: auctionCenterId,
      })
      .then((response) => {
        // Handle the API response here
        formik.setFieldValue(
          "noOfSession",
          response?.data?.responseData[0]?.noOfSession
        );
      })
      .catch((error) => {
        // Handle errors here
      });
  }, [teaTypeList]);

  // useEffect(() => {
  //   const saleNo = formik.values.saleNo;
  //   const season = formik.values.season;
  //   const saleDate = formik.values.saleDate;
  //   // API endpoint URL
  //   const apiUrl = `/preauction/${baseUrlEng}/GetTeaTypeByParam`;

  //   // Data to be sent in the POST request

  //   // Making the POST request using Axios
  //   if (saleNo !== 0 && saleDate !== "") {
  //     // Cleanup function, in case you need to cancel the request
  //     return () => {
  //       // Cancel the request (if necessary) to avoid memory leaks
  //     };
  //   }
  // }, [formik.values.saleDate]);

  useEffect(() => {
    formik.setFieldValue("saleDate", saleDates?.at(0)?.saleDate);
  }, [saleDates]);
  const handleExportExcel = async () => {
    // Assuming columnName contains the list of objects with "name" and "title"
    let columnsdata = sampleshortage;
    columnsdata.pop();
    const columnName = columnsdata;

    // Assuming data contains the list of data objects like [{saleNo: 5}, ...]
    const data = rows.map((ele) => {
      const { invoiceId, ...rest } = ele;
      return rest;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("AuctionSessionReport");

    // Create a map from name to title for efficient lookup
    const nameToTitleMap = new Map();
    columnName.forEach((column) => {
      nameToTitleMap.set(column.name, column.title);
    });

    // Create the header row based on the columnName array
    const headerRow = worksheet.addRow(
      columnName.map((column) => column.title)
    );
    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFF" },

        // Text color set to white
      };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "183e29" }, // Background color (you can change the color code)
      };
    });

    // Add data rows based on columnName and data
    data.forEach((row) => {
      const rowData = columnName.map((column) => row[column.name]);
      worksheet.addRow(rowData);
    });

    // Automatically adjust column widths based on content
    worksheet.columns.forEach((column, index) => {
      const headerLength = columnName[index].title.length;
      const maxColumnWidth = column.values.reduce((acc, val) => {
        const cellLength = val ? val.toString().length : 0;
        return Math.max(acc, cellLength);
      }, headerLength);
      column.width = maxColumnWidth + 5; // Adding extra width for padding
    });

    const buffer = await workbook.xlsx.writeBuffer();

    // Convert the buffer to a Blob
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save the Blob as a file
    saveAs(blob, "AwrReport.xlsx");
  };

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    if (panel === "panel1") {
      setDataByID([]);
    }
    setDisable(false);
    setEdit(false);
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAllRow(checked);
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        checked,
      }))
    );
  };

  function isDateLessThanOrEqualToCurrent(dateString) {
    // Parse the input date string into a Date object
    var inputDate = new Date(dateString);

    // Get the current date
    var currentDate = new Date();

    // Compare the input date with the current date
    return inputDate <= currentDate;
  }

  const ActionArea = (row) => {
    function handleAction(action) {
      setExpandedTab("panel2");
      setLotNoDisable(
        isDateLessThanOrEqualToCurrent(row.data.catalogPublishingDate)
      );
      switch (action) {
        case "view": {
          const apiURL = `/preauction/${baseUrlEng}/GetAuctionSessionById?auctionSessionDetailId=${row.data.auctionSessionDetailId}`; // Replace with your API URL
          axiosMain
            .post(apiURL)
            .then((response) => {
              // console.log("API Response:", response.data);
              setEdit(true);
              setDataByID(response.data);
              // Handle the response data here
            })
            .catch((error) => {
              console.error("API Error:", error);
              // Handle the error here
            });
          break; // Make sure to break after the API call
        }
        case "edit": {
          const apiURL = `/preauction/${baseUrlEng}/GetAuctionSessionById?auctionSessionDetailId=${row.data.auctionSessionDetailId}`; // Replace with your API URL
          axiosMain
            .post(apiURL)
            .then((response) => {
              // console.log("API Response:", response.data);
              setEdit(false);
              setDataByID(response.data);
              // Handle the response data here
            })
            .catch((error) => {
              console.error("API Error:", error);
              // Handle the error here
            });
          break;
        }
        default:
          return "no data";
      }
      // switch (action) {
      //   case "view": {
      //     return dispatch(fetchSampleShortageRequest(row.data.shortWeightId));
      //     // eslint-disable-next-line no-unreachable
      //   }
      //   case "edit": {
      //     return setActionData({ ...actionData, view: row.data });
      //   }
      //   default:
      //     return "no data";
      // }
    }

    return (
      <>
        <div className="BtnGroup">
          {modalRight?.includes("1") && (
            <>
              <i className="fa fa-eye" onClick={() => handleAction("view")}></i>{" "}
              <span className="brack"></span>
            </>
          )}
          {modalRight?.includes("3") && (
            <>
              {" "}
              <i
                className="fa fa-edit"
                onClick={() => handleAction("edit")}
              ></i>
              <span className="brack"></span>
            </>
          )}

          {modalRight?.includes("18") && (
            <i
              className="fa fa-trash"
              onClick={() => {
                setOpenDelete(true);
                setActionData({ ...actionData, edit: row.data });
              }}
            ></i>
          )}
          {modalRight?.includes("22") ? (
            row.data.status === 1 ||
            row.data.status === 2 ||
            row.data.status === 3 ||
            row.data.status === 7 ? (
              <>
                <button onClick={() => setholddata(row.data)}>Hold</button>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {modalRight?.includes("22") ? (
            row.data.status === 6 && row.data.holdDate !== null ? (
              <button onClick={() => setresumedata(row.data)}>Resume</button>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </div>
      </>
    );
  };
  function setholddata(rowdata) {
    setShow(true);
    let data = {
      auctionSessionDetailId: rowdata.auctionSessionDetailId,
      updatedBy: userId,
      type: "hold",
      auctionSessionId: rowdata.auctionSessionId,
      SaleProgramId: rowdata.SaleProgramId,
      season: formik.values.season.toString(),
      saleNo: parseInt(formik.values.saleNo),
    };
    setPrePostData(data);
  }
  function setresumedata(rowdata) {
    setShowResume(true);
    let data = {
      auctionSessionDetailId: rowdata.auctionSessionDetailId,
      updatedBy: userId,
      auctionSessionId: rowdata.auctionSessionId,
      type: "resume",
      saleDate: rowdata.saleDate?.split("T")?.at(0),
      SaleProgramId: rowdata.SaleProgramId,
      season: formik.values.season.toString(),
      saleNo: parseInt(formik.values.saleNo),
    };
    setPrePostDataResume(data);
  }
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
      label: "Sale Date",
      name: "saleDate",
      type: "select",
      options: saleDates?.map((ele) => {
        return { label: ele.saleDate, value: ele.saleDate };
      }),
      required: true,
      className: "FormGroup",
    },
    {
      label: "Tea Type",
      name: "teaType",
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
      type: "disable",
      required: false,
      className: "FormGroup",
    },
  ];
  const Controlls = () => <></>;

  return (
    <>
      <div>
        <ConfirmationModal
          show={openDelete}
          onDelete={() => {
            // setRows([...rows?.filter((ele) => ele.id !== actionData.edit.id)]);
            let data = {
              auctionSessionId: actionData.edit.auctionSessionId,
              auctionSessionDetailId: actionData.edit.auctionSessionDetailId,
              updatedBy: actionData.edit.userId,
              season: formik.values.season.toString(),
              saleNo: parseInt(formik.values.saleNo),
            };

            axiosMain
              .post(`/preauction/${baseUrlEng}/CancelAuctionSession`, data)
              .then((res) => {
                if (res.data.statusCode === 200) {
                  CustomToast.success(res.data.message);
                  setRows([]);
                  formik.resetForm();
                } else {
                  CustomToast.error(res.data.message);
                }
              });
            // console.log(data, "actionDataactionData");
            setOpenDelete(false);
          }}
          title="Are you sure to want to cancel the selected auction session?"
          onHide={() => setOpenDelete(false)}
        />
        <Accordion
          expanded={expandedTab === "panel1"}
          onChange={handleAccordionChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Manage Auction Session </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="">
              <form onSubmit={formik.handleSubmit}>
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
                  <div className="col-12">
                    <div className="">
                      <div className="BtnGroup">
                        <Button
                          variant="primary"
                          type="submit"
                          className="SubmitBtn btn btn-primary"
                        >
                          Search
                        </Button>

                        <Button
                          variant="primary"
                          className="SubmitBtn"
                          onClick={() => {
                            formik.resetForm();
                            setTeaTypeList([]);
                            // formik.setFieldValue("auctioner", "0");
                            // formik.setFieldValue("saleNo", "0");
                            // formik.setFieldValue("sessionType", "0");
                            // formik.setFieldValue("season", "");
                            // formik.setFieldValue("sessionTime", "");
                            // formik.setFieldValue("saleDate", "");
                            setRows([]);
                          }}
                        >
                          <i class="fa fa-refresh"></i>
                        </Button>
                        {/* <Button
                          className="SubmitBtn"
                          onClick={() => {
                            formik.resetForm();
                            setTeaTypeList([]);
                            // formik.setFieldValue("auctioner", "0");
                            // formik.setFieldValue("saleNo", "0");
                            // formik.setFieldValue("sessionType", "0");
                            // formik.setFieldValue("season", "");
                            // formik.setFieldValue("sessionTime", "");
                            // formik.setFieldValue("saleDate", "");
                            setRows([]);
                          }}
                        >
                          Clear
                        </Button> */}
                        <Button
                          className="SubmitBtn"
                          onClick={handleExportExcel}
                        >
                          Export as Excel
                        </Button>

                        <button
                          type="button"
                          onClick={() =>
                            PrintableTable(
                              sampleshortage,
                              rows?.length > 0
                                ? rows.map((item) => {
                                    switch (item.status) {
                                      case 0: {
                                        return { ...item, status: "Pending" };
                                      }
                                      case 1: {
                                        return { ...item, status: "Active" };
                                      }
                                      case 2: {
                                        return { ...item, status: "Inactive" };
                                      }
                                      case 3: {
                                        return { ...item, status: "Warm up" };
                                      }
                                      case 4: {
                                        return { ...item, status: "Closed" };
                                      }
                                      case 5: {
                                        return { ...item, status: "Cancelled" };
                                      }
                                      case 6: {
                                        return { ...item, status: "Hold" };
                                      }
                                      case 7: {
                                        return { ...item, status: "Resume" };
                                      }
                                      case 8: {
                                        return { ...item, status: "PrePond" };
                                      }
                                      case 9: {
                                        return { ...item, status: "PostPond" };
                                      }
                                      default:
                                        return { ...item, status: "-" };
                                    }
                                  })
                                : [],
                              "Auction Session"
                            )
                          }
                          className="SubmitBtn btn"
                        >
                          Export as Pdf
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="mt-3">
              <div className="SelectAll">
                {/* <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="defaultCheck1"
                    checked={selectAllRow}
                    onChange={handleSelectAllChange}
                  />
                  <label className="form-check-label" for="defaultCheck1">
                    Select All
                  </label>
                </div> */}
              </div>
              <div>
                <TableComponent
                  columns={
                    modalRight?.includes("1") ||
                    modalRight?.includes("3") ||
                    modalRight?.includes("22")
                      ? [
                          ...sampleshortage,
                          {
                            name: "action",
                            title: "Action",
                            getCellValue: ({ ...row }) => (
                              <div className="Action">
                                <ActionArea data={row} />
                              </div>
                            ),
                          },
                        ]
                      : sampleshortage
                  }
                  rows={rows?.length > 0 ? rows : []}
                  setRows={setRows}
                  dragdrop={false}
                  sorting={true}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expandedTab === "panel2"}
          onChange={handleAccordionChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Create Auction Session</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {modalRight?.includes("1") && (
              <Maintananse
                dataByID={dataByID}
                onEdit={onEdit}
                expandedTab={expandedTab}
                setExpandedTab={setExpandedTab}
                lotNoDisable={lotNoDisable}
                modalRight={modalRight}
                auctionType={auctionType}
                setAuctionType={setAuctionType}
              />
            )}
          </AccordionDetails>
        </Accordion>
      </div>
      {/* <ToastContainer autoClose={1200}/> */}
      {/* hold resume modal */}
      <Modals
        show={show}
        size="xl"
        // onHide={() => setShow(false)}
        handleClose={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        title={"Hold"}
      >
        <HoldResume
          prePostData={prePostData}
          setShow={setShow}
          baseUrlEng={baseUrlEng}
        />
      </Modals>
      <Modals
        show={showresume}
        size="xl"
        // onHide={() => setShow(false)}
        handleClose={() => setShowResume(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        title={"Resume"}
      >
        <HoldResume
          baseUrlEng={baseUrlEng}
          prePostData={prePostDataresume}
          setShowResume={setShowResume}
        />
      </Modals>
    </>
  );
};

export default Modal;
