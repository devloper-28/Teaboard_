import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./modal.css";
import TableComponent from "../../../../components/tableComponent/TableComponent";

import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Accordion,
} from "@mui/material";
import { SelectAll } from "@mui/icons-material";
import * as Yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import AWRForm from "./form/Form";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  addLotSeriesRequest,
  deleteLotSeriesRequest,
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchKutchaCatalogueRequest,
  fetchLotSeriesByIdRequest,
  fetchLotSeriesRequest,
  fetchMarkRequest,
  fetchMarkTypeRequest,
  fetchSaleNumbersRequest,
  fetchSessionTypeRequest,
  fetchStatusRequest,
  getSaleNoRequest,
  teaTypeAction,
  updateLotSeriesRequest,
} from "../../../../store/actions";
import { useDispatch } from "react-redux";
import ExcelJS from "exceljs";

// import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// import KutchaCataloguePDF from "../KutchaCataloguePDF";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "react-toastify/dist/ReactToastify.css";
import CustomToast from "../../../../components/Toast";
import axiosMain from "../../../../http/axios/axios_main";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";

const validationSchema = Yup.object().shape({
  // mark: Yup.string().required("Mark is required"),
  // LotNoStatus: Yup.string().required("Lot Number is required"),
  // category: Yup.string().required("Category is required"),
  saleNo: Yup.string().required("Sale No is required"),
  // season: Yup.string().required("Season is required"),
  // teaType: Yup.string().required("Tea Type is required"),
  // grade: Yup.string().required("Grade is required"),
  // markType: Yup.string().required("Mark Type is required"),
});
const currentYear = new Date().getFullYear();

const initialValues = {
  season: currentYear,
  saleNo: "",
};
// const initialValues = {
//   mark: "Mark Value",
//   markType: "Mark Type",
//   warehouse: "Warehouse Value",
//   warehouseName: "Warehouse Name Value",
//   warehouseAddress: "Warehouse Address Value",
//   invoiceNo: "Invoice No Value",
//   invoiceQty: "Invoice Qty Value",
//   origin: "Origin Value",
//   year: "year",
//   manufacture: "Manufacture Value",
//   grade: "Grade Value",
//   fromDate: "From Date Value",
//   toDate: "To Date Value",
//   dateOfDispatch: "Date of Dispatch Value",
//   invoiceDate: "Invoice Date Value",
//   season: "Season Value",
//   saleNo: "Sale No Value",
//   auctioneer: "Auctioneer Value",
//   lorryReceiptNo: "Lorry Receipt No Value",
//   lorryNo: "Lorry No Value",
//   invRefNo: "Inv Ref No Value",
//   carrier: "Carrier Value",
//   teaType: "Tea Type Value",
//   subType: "Sub Type Value",
//   category: "Category Value",
//   packageSize: "Package Size Value",
//   packageType: "Package Type Value",
//   packageNo: "Package No Value",
//   totalPackages: "Total Packages Value",
//   grossKgs: "Gross Kgs Value",
//   tareKgs: "Tare Kgs Value",
//   netKgs: "Net Kgs Value",
//   totalNetKgs: "Total Net Kgs Value",
// };

const Modal = ({ modalRight }) => {
  const dispatch = useDispatch();
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
    auction,
    auctionTypeMasterCode,
  } = useAuctionDetail();
  const baseUrlEnga =
    auction === "ENGLISH" ? "EnglishAuctionLotNoSeries" : "LotNoSeries";
  const [baseUrlEng, setbaseUrlEng] = useState(baseUrlEnga);
  const [lotSeriesDataIds, setLotSeriesData] = useState([]);
  const [initialValue, setInitialValue] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [handleChnage, setHandleChnage] = useState(false);

  const lotSeriesData = useSelector(
    (state) => state?.lotSeriesReducer?.data?.responseData
  );

  console.log(lotSeriesData, "lotSeriesData");

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const teaType = useSelector(
    (state) => state?.teaType?.teaTypeList?.responseData
  );

  const abc = useSelector((state) => state.category.loading);
  const kutchaList = useSelector(
    (state) => state?.kutchaCatalogueReducer?.data?.responseData
  );

  const kutchaListWarning = useSelector(
    (state) => state.kutchaCatalogueReducer.data.message
  );
  const sessionType = useSelector(
    (state) => state?.sessionTypesReducer?.data?.responseData
  );
  console.log(sessionType, "sessionType");

  const statusData = useSelector(
    (state) => state?.category?.statusData?.responseData
  );
  console.log(statusData, ".");
  const markList = useSelector((state) => state?.mark?.data?.responseData);
  const categorystate = useSelector(
    (state) => state?.category?.data?.responseData
  );
  const markType = useSelector((state) => state.mark.markTypeData.responseData);
  const grades = useSelector((state) => state?.grade?.data?.responseData);

  const searchData = useSelector(
    (state) => state?.kutchaCatalogueReducer?.data?.responseData
  );
  console.log(searchData, "categorystate");
  const allLot = [
    {
      id: 1,
      // lotNo: "Lot Number 123",
      // invoiceNo: "INV-2023-001",
      // origin: "Tea Garden",
      teaTypeName: "Black Tea",
      categoryName: "category name",
      seriesFrom: "1000",
      seriesTo: "2000",
    },
    // Add more AWR objects as needed
  ];

  // const handleExportPDF = () => {
  //   // You need to replace `rows` with the actual data you want to export
  //   const data = rows;

  //   const pdfBlob = (<KutchaCataloguePDF data={data} />).toBlob();
  //   saveAs(pdfBlob, "kutcha_catalogue.pdf");
  // };

  // const handleExportExcel = () => {
  //   const data = rows.map((ele) => {
  //     const { saleProgramId,lotNoSeriesID,teaTypeId,categoryId, ...rest } = ele;
  //     return rest;
  //   });

  //   // Create a new workbook and worksheet
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.json_to_sheet(data);

  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Lot_No_Series");

  //   // Generate Excel file
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const blob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   saveAs(blob, "Lot_No_Series.xlsx");
  // };

  const handleExportExcel = async () => {
    // Assuming columnName contains the list of objects with "name" and "title"
    let columnsdata = kutcha;
    columnsdata.pop();
    const columnName = columnsdata;

    // Assuming data contains the list of data objects like [{saleNo: 5}, ...]
    const data = rows.map((ele) => {
      const { invoiceId, ...rest } = ele;
      return rest;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PreAuctionStatusReport");

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
    saveAs(blob, "LotNoReport.xlsx");
  };

  useEffect(() => {
    // Dispatch the action when the component mounts

    dispatch(
      fetchLotSeriesRequest({
        season: formik.values.season.toString(),
        saleNo: 3,
        pageNumber: 1,
        pageSize: 10,
        baseUrl: baseUrlEng
      })
    );
    dispatch(fetchSaleNumbersRequest(formik.values.season.toString()));

    // const requestData = [
    //   {
    //     saleNo: 19,
    //     season: formik.values.season.toString()?.toString(),
    //     saleProgramId: 10110,
    //     teaTypeId: 3,
    //     categoryId: 3,
    //     seriesFrom: "1",
    //     seriesTo: "3",
    //     isActive: true,
    //     createdBy: userId,
    //   },
    //   {
    //     saleNo: 19,
    //     season: formik.values.season.toString()?.toString(),
    //     saleProgramId: 10110,
    //     teaTypeId: 2,
    //     categoryId: 3,
    //     seriesFrom: "2",
    //     seriesTo: "3",
    //     isActive: true,
    //     createdBy: userId,
    //   },
    // ];

    // // Dispatch the action to add new lot series
    // dispatch(addLotSeriesRequest(requestData));
  }, []);
  const handleUpdate = () => {
    const requestData = {
      lotNoSeriesID: 6,
      saleNo: 19,
      season: formik.values.season.toString(),
      saleProgramId: 10110,
      teaTypeId: 1,
      categoryId: 2,
      seriesFrom: "1",
      seriesTo: "3",
      isActive: true,
      updatedBy: userId,
      auctionCenterId: auctionCenterId,
    };

    // Dispatch the updateLotSeriesRequest action with the updated data
    dispatch(updateLotSeriesRequest(requestData));
  };

  const handleRemove = () => {
    const requestData = {
      lotNoSeriesID: actionData.edit.lotNoSeriesID,
      updatedBy: userId,
      auctionCenterId: auctionCenterId,
    };
    axiosMain
      .post(`/preauction/${baseUrlEng}/DeleteLotSeries`, requestData)
      .then((response) => {
        // Handle the API response here
        CustomToast.success(response.data.message);
        //setOpenDelete(false);
      })
      .catch((error) => {
        CustomToast.error(error);
        // Handle errors here
      });
    setOpenDelete(false);
    // Dispatch the deleteLotSeriesRequest action with the provided data
    // dispatch(deleteLotSeriesRequest(requestData));

    console.log(actionData.edit, "actionData.edit");
  };
  const formik = useFormik({
    initialValues: initialValues,

    validationSchema,
    onSubmit: async (values) => {
      const formData = {
        season: values.season.toString(),
        saleNo: parseInt(values.saleNo),
        pageNumber: 1,
        pageSize: 100,
        auctioneerId: userId, //auctioner
        auctionCenterId: auctionCenterId,
        baseUrl: baseUrlEng,
      };
      // const formData = {
      //   season: formik.values.season.toString()?.toString(),
      //   saleNo: 19,
      //   teaTypeId: 1,
      //   LotNoStatus: 0,
      //   markId: 7,
      //   categoryId: 2,
      //   gradeId: 4,
      //   marketType: 0,
      //   auctioneerId: userId,//auctioner
      // };

      // console.log(formData, "GOING");
      // Update form values to the first option for all dropdowns if they are empty
      // if (!values.teaType && teaType.length > 0) {
      //   formik.setFieldValue("teaType", teaType[0].teaTypeId);
      // }
      // if (!values.LotNoStatus && statusData.length > 0) {
      //   formik.setFieldValue("LotNoStatus", statusData[0].Value);
      // }
      // if (!values.grade && gradesList.length > 0) {
      //   formik.setFieldValue("grade", gradesList[0].gradeId);
      // }
      // if (!values.mark && markDataList.length > 0) {
      //   formik.setFieldValue("mark", markDataList[0].markId);
      // }
      // if (!values.category && categoryList.length > 0) {
      //   formik.setFieldValue("category", categoryList[0].categoryId);
      // }

      // // Manually validate the updated form values
      // try {
      //   await validationSchema.validate(values, { abortEarly: false });
      // } catch (errors) {
      //   // Handle validation errors
      //   const errorsMap = {};
      //   errors.inner.forEach((error) => {
      //     errorsMap[error.path] = error.message;
      //   });
      //   formik.setErrors(errorsMap);
      // }
      dispatch(fetchLotSeriesRequest(formData));
      console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
    },
  });
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
        })
        .catch(() => {
          // Handle errors here
        });

      // Cleanup function, in case you need to cancel the request
      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo, formik.values.season]);
  useEffect(() => {
    // Check for responseData and show toast notification if it's null
    if (kutchaList === null) {
      CustomToast.warning(kutchaListWarning, {
        position: CustomToast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  }, [kutchaList, kutchaListWarning]);
  console.log(kutchaListWarning, "mss");
  // Check for responseData and show toast notification if it's null

  const [sellsNo, setSellNo] = useState(1);

  const [expandedTab, setExpandedTab] = useState("panel1");
  const [rows, setRows] = useState(allLot);
  // const [year, setYear] = useState("2023");
  const [sessionTypes, setSessionType] = useState(sessionType); // If using React state hooks

  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [kutchaData, setTeakutchaData] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [mark, setmark] = useState([]);
  const [categoryList, setcategory] = useState([]);
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [isDisabled, setIsDisabled] = useState(false);

  const { handleChange, handleBlur, values, touched, errors } = formik;

  console.log(sessionTypes, "sessionTypess");

  useEffect(() => {
    dispatch(fetchSaleNumbersRequest(formik.values.season.toString()));
  }, [formik.values.season]);

  // {
  //   id: 1,
  //   // lotNo: "Lot Number 123",
  //   // invoiceNo: "INV-2023-001",
  //   // origin: "Tea Garden",
  //   teaTypeName: "Black Tea",
  //   category: "category name",
  //   seriesFrom: "1000",
  //   seriesTo: "2000",
  // },

  const resetModal = () => { };
  const kutcha = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },
    { name: "teaTypeName", title: "Tea Type" },
    { name: "categoryName", title: "Category" },
    { name: "seriesFrom", title: "Series From" },
    { name: "seriesTo", title: "Series To" },
    // {
    //   name: "action",
    //   title: "Action",
    //   getCellValue: ({ ...row }) => <ActionArea data={row} />,
    // },
  ];

  console.log(rows, "rows");
  const handleSessionTypeChange = (selectedSessionType) => {
    setSessionType(selectedSessionType);
  };
  const handleRefresh = () => { };
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = {
      marketType: 0 /* update in future */,
      saleNo: parseInt(formik.values.saleNo),
      LotNoStatus: parseInt(formik.values.LotNoStatus), // Convert to integer
      categoryId: parseInt(formik.values.category), // Convert to integer
      gradeId: parseInt(formik.values.grade), // Convert to integer
      markId: 6, // Convert to integer
      teaTypeId: parseInt(formik.values.teaType), // Convert to integer
      auctioneerId: userId, //auctioner
      season: formik.values.season.toString(),
      role: roleCode,
    };
    console.log(formData, "GOING");
    dispatch(fetchKutchaCatalogueRequest(formData));
  };
  // useEffect(() => {
  //   if (teaTypeList && teaTypeList.length > 0) {
  //     formik.setFieldValue("teaType", teaTypeList[0]?.teaTypeId);
  //   }
  // }, [teaTypeList, formik]);

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    setInitialValue({
      saleNo: null,
      season: formik.values.season.toString(),
      saleProgramId: null,
      teaTypeId: null,
      categoryId: null,
      seriesFrom: "",
      seriesTo: "",
      isActive: true,
      createdBy: userId,
    });
    setLotSeriesData([]);
    setIsEdit(false);
    setIsDisabled(false);
    setHandleChnage(false);
  };

  // useEffect(() => {
  //   formik.setFieldValue("saleNo", saleNumber?.at(0)?.saleNumber);
  // }, [saleNumber]);
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
  const handleSampleQtyChange = (value) => {
    // You can update the corresponding row's data in the `rows` state or handle the value as needed
    console.log("Sample Q ty.(Kgs) changed to:", value);
  };

  const SampleTxt = ({ value, onChange }) => {
    return (
      <InputGroup>
        <FormControl
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </InputGroup>
    );
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

  const ActionArea = (row) => {
    function handleAction(action) {
      setExpandedTab("panel2");

      switch (action) {
        // case "view": {
        //   return dispatch(
        //     fetchSaleProgramDetailsRequest(row.data.saleProgramDetailId)
        //   );
        // }
        case "view": {
          const lotNo = row.data;
          // setSelectedSaleProgram(saleProgramDetail);
          // setIsDisabled(true);
          dispatch(fetchLotSeriesByIdRequest({ lotNoSeriesID: lotNo.lotNoSeriesID, baseUrl: baseUrlEng }));
          setIsDisabled(true);
          // setIsEdit(true);
          break;
        }
        case "edit": {
          const lotNo = row.data;
          dispatch(fetchLotSeriesByIdRequest({lotNoSeriesID: lotNo.lotNoSeriesID, baseUrl: baseUrlEng}));
          // setSelectedSaleProgram(saleProgramDetail);
          setIsDisabled(false);
          setIsEdit(true);
          // setIsEdit(true);
          // dispatch(
          //   fetchSaleProgramDetailsRequest(saleProgramDetail.SaleProgramId)
          // );
        }
        default:
          return "no data";
      }
    }

    // if (!saleProgramList || !saleNumber) {
    //   return (
    //     <div>
    //       <NoData />
    //     </div>
    //   ); // Show a message when no data is available
    // }
    return (
      <>
        <div className="Action">
          {modalRight?.includes("3") && (
            <span onClick={() => handleAction("view")}>
              <VisibilityIcon />
            </span>
          )}
          {modalRight?.includes("2") && (
            <span onClick={() => handleAction("edit")}>
              <EditIcon />
            </span>
          )}
          {modalRight?.includes("18") && (
            <span
              onClick={() => {
                setOpenDelete(true);
                setActionData({ ...actionData, edit: row.data });
              }}
            >
              <DeleteIcon />
            </span>
          )}
        </div>
      </>
    );
  };

  const AWRCheckBox = (data) => {
    const handleChange = (e) => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === data.data.id ? { ...row, checked: e.target.checked } : row
        )
      );

      const allChecked = rows.every((row) => row.checked);
      setSelectAllRow(allChecked);
    };
    useEffect(() => {
      const allChecked = rows.every((row) => row.checked);
      setSelectAllRow(allChecked);
    }, [rows]);

    return (
      <>
        <Form.Check
          type="checkbox"
          id="custom-switch"
          checked={data.data.checked}
          onChange={handleChange}
        />
      </>
    );
  };
  useEffect(() => {
    setRows(lotSeriesData);
  }, [lotSeriesData]);
  // console.log(rows,"rows")

  return (
    <>
      <div>
        <ConfirmationModal
          title="Do you want to cancel this Lot Series?"
          show={openDelete}
          onDelete={handleRemove}
          onHide={() => setOpenDelete(false)}
        />
        {modalRight?.includes("12") && (
          <>
            <Accordion
              expanded={expandedTab === "panel1"}
              onChange={handleAccordionChange("panel1")}
              className={`${expandedTab === "panel1" ? "active" : ""}`}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Manage Lot No Series</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <form onSubmit={formik.handleSubmit}>

                  <div className="row align-items-end">
                    <div className="col-lg-2">
                      <label>Select Season</label>
                      <InputGroup>
                        <FormControl
                          as="select"
                          name="season"
                          value={formik.values.season}
                          onChange={handleChange}
                        >
                          {generateYearOptions()}
                        </FormControl>
                      </InputGroup>
                      {formik.errors.season && formik.touched.season && (
                        <div className="error text-danger">
                          {formik.errors.season}
                        </div>
                      )}
                    </div>
                    <div className="col-lg-2">
                      <label>Select Sale No.</label>
                      <InputGroup>
                        <FormControl
                          as="select"
                          name="saleNo"
                          value={formik.values.saleNo}
                          onChange={handleChange}
                        >
                          <option value="">Plese Select</option>
                          {saleNumber?.map((e) => (
                            <option key={e.SaleNoId} value={e.saleNo}>
                              {e.saleNo}
                            </option>
                          ))}
                        </FormControl>
                      </InputGroup>
                      {formik.errors.saleNo && formik.touched.saleNo && (
                        <div className="error text-danger">
                          {formik.errors.saleNo}
                        </div>
                      )}
                    </div>
                    <div className="col-auto">
                      <div className="BtnGroup">
                        <Button className="SubmitBtn" type="submit">
                          Search
                        </Button>
                        <Button
                          className="SubmitBtn"
                          onClick={() => formik.resetForm()}
                        >
                          <i class="fa fa-refresh"></i>
                        </Button>
                      </div>
                    </div>

                    <div className="col-lg-2">
                      {/* <PDFDownloadLink
                    document={<KutchaCataloguePDF data={rows} />}
                    fileName="kutcha_catalogue.pdf"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? "Loading document..." : "Export as PDF"
                    }
                  </PDFDownloadLink> */}
                    </div>
                  </div>
                  {modalRight?.includes("9") && (
                    <div className="row pt-3">
                      <div className="col-12">
                        <div className="BtnGroup">
                          <Button
                            className="SubmitBtn"
                            onClick={handleExportExcel}
                          >
                            Export as Excel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* <div className="SelectAll">
                  <div className="form-check">
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
                  </div>
                </div> */}
                  <div
                    id={rows?.length > 0 ? "invoiceTable" : "invoiceTable" + "c"}
                  >
                    <TableComponent
                      columns={
                        modalRight?.includes("3") || modalRight?.includes("2")
                          ? [
                            ...kutcha,
                            {
                              name: "action",
                              title: "Action",
                              getCellValue: ({ ...row }) => (
                                <ActionArea data={row} />
                              ),
                            },
                          ]
                          : kutcha
                      }
                      rows={rows?.length > 0 ? rows : []}
                      setRows={setRows}
                      dragdrop={false}
                      fixedColumnsOn={false}
                      resizeingCol={false}
                      selectionCol={true}
                      sorting={true}
                    />
                  </div>
                </form>
              </AccordionDetails>
            </Accordion>
          </>
        )}
        {/* <ToastContainer position="top-center" autoClose={3000} /> */}
        {modalRight?.includes("1") || isDisabled || isEdit ? (<>
          <Accordion
            expanded={expandedTab === "panel2"}
            onChange={handleAccordionChange("panel2")}
            className={`${expandedTab === "panel2" ? "active" : ""}`}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Create Lot No Series</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* {isDisabled || isEdit ? (
              <AWRForm
                setExpandedTab={setExpandedTab}
                expandedTab={expandedTab}
                initialValue={initialValue}
                handleChnage={handleChnage}
                setHandleChnage={setHandleChnage}
                setInitialValue={setInitialValue}
                lotSeriesDataIds={lotSeriesDataIds}
                setLotSeriesData={setLotSeriesData}
                isDisabled={isDisabled}
                isEdit={isEdit}
              />
            ) : ( */}

              <AWRForm
                setExpandedTab={setExpandedTab}
                expandedTab={expandedTab}
                initialValue={initialValue}
                handleChnage={handleChnage}
                setHandleChnage={setHandleChnage}
                setInitialValue={setInitialValue}
                lotSeriesDataIds={lotSeriesDataIds}
                setLotSeriesData={setLotSeriesData}
                isDisabled={isDisabled}
                isEdit={isEdit}
                modalRight={modalRight}
              />

            </AccordionDetails>
          </Accordion>
        </>) : ""}
      </div>
    </>
  );
};

export default Modal;
