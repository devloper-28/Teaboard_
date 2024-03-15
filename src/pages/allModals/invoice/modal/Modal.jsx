import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExcelJS from "exceljs";
import Modals from "../../../../components/common/Modal";
import "./modal.css";
import TableComponent from "../../../../components/tableComponent/TableComponent";
// import PrintInvoice from "./print";

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
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import CreateInvoiceForm from "./formCompo";
import {
  fetchInvoiceDetailsIdRequest,
  fetchInvoiceDetailsRequest,
} from "../../../../store/actions/invoice/invoiceActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchMarkRequest, getSaleNoRequest } from "../../../../store/actions";
import axios from "axios";
import CustomToast from "../../../../components/Toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosMain from "../../../../http/axios/axios_main";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { usePrint } from "../../../../components/common/PrintDataInTable";
import PrintableTable from "../../../../components/common/PrintableTable";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Get the current date
const currentDate = new Date();

// Get the current year
const currentYear = currentDate.getFullYear();

// Get the current week number of the year
// The week number is calculated based on the ISO 8601 standard, where weeks start on Monday and the first week of the year contains January 4th.
const currentWeek = Math.ceil(
  ((currentDate - new Date(currentYear, 0, 4)) / 86400000 + 1) / 7
);

const Modal = ({ modalRight }) => {
  const componentRef = useRef();

  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
    auction,
    auctionTypeMasterCode,
  } = useAuctionDetail();
  const [auctionType, setAuctionType] = useState(auction);
  const [auctionTypeCode, setAuctionTypeCode] = useState(auctionTypeMasterCode);
  const baseUrlEngn =
    auction === "ENGLISH" ? "EnglishAuctionInvoiceDetails" : "InvoiceDetails";
  const [baseUrlEng, setbaseUrlEng] = useState(baseUrlEngn);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const [expandedTab, setExpandedTab] = useState("panel1");
  const [rows, setRows] = useState([]);
  const [selection, setSelection] = useState([1]);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(6);
  const [srNo, setSrNo] = useState(null);
  const [receivedDateLable, setReceivedDate] = useState(null);
  const [invoiceStatusLable, setInvoiceStatus] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [markDataList, setMarkDataList] = useState([]);
  const [saleNo, setSaleNo] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [status, setStatus] = useState([]);
  const [openPrintModel, setopenPrintModel] = useState(false);
  const markList = useSelector((state) => state?.mark?.data?.responseData);
  const invoiceDetails = useSelector(
    (state) => state.invoiceDetails.data.responseData
  );
  console.log(invoiceDetails, "invoiceDetails");
  const saleNumber = useSelector(
    (state) => state?.auction?.saleNumber?.responseData
  );

  const responseData = useSelector(
    (state) => state?.invoiceDetails?.data?.responseData
  );
  const invoiceResponseData = useSelector((state) => state);
  const viewedDdata = useSelector((state) => state);
  const viewedData = useSelector((state) => state?.invoiceDetails);
  console.log(viewedData, "😂😒");

  const dispatch = useDispatch();

  const initialValues = {
    season: currentYear.toString(), // Set default value if needed
    saleNo: currentWeek, // Set default value if needed
    markId: 0, // Set default value if needed
    status: 1, // Set default value if needed
    auctionCenterId: auctionCenterId,
    role: roleCode,
  };

  const validationSchema = Yup.object().shape({
    season: Yup.string().required("Season is required"),
    saleNo: Yup.number().required("Sale No is required"),
    markId: Yup.number().required("Manufacturer is required"),
    status: Yup.number().required("Status is required"),
  });

  const handleSubmit = (values) => {
    // Handle form submission here, values object will contain the form data
    const { season, saleNo, markId, status } = values;
    const data = {
      factoryId: parseInt(markId),
      season: season,
      saleNo: parseInt(saleNo),
      status: parseInt(status),
      auctioneerId: userId, //auctioner
      auctionCenterId: auctionCenterId,
      // role:roleCode
    };
    // dispatch(fetchInvoiceDetailsRequest(data));
    axiosMain
      .post(
        `/preauction/${baseUrlEng}/GetInvoiceDetails?role=` + roleCode,
        data
      )
      .then((res) => {
        setRows(res.data.responseData);
      });
    // console.log(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });
  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    // API endpoint URL

    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

    if (formik.values.saleNo !== null) {
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season?.toString(),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          setbaseUrlEng(
            response?.data?.responseData[0]?.auctionTypeCode === "BHARAT"
              ? "InvoiceDetails"
              : "EnglishAuctionInvoiceDetails"
          );
          // Handle the API response here
          // setsaleprogrmId();
          // console.log(
          //   invoiceData.filter(
          //     (ele) =>
          //     (ele.SaleProgramId =
          //       response?.data?.responseData[0]?.SaleProgramId)
          // ),
          //   "response?.data?.responseData[0]?.SaleProgramId"
          // );

          // setsaleprogrmId(response?.data?.responseData[0]?.SaleProgramId);
        })
        .catch((error) => {
          // Handle errors here
          console.log(error);
        });
    }
  }, [formik.values.saleNo, formik.values.season]);

  useEffect(() => {
    dispatch(fetchInvoiceDetailsRequest(initialValues));
    // dispatch(fetchMarkRequest({auctionCenterId }));
    axiosMain
      .post("/admin/factory/dropdown/getFactoryDetail", { isActive: 1 })
      .then((res) => {
        // formik.setFieldValue("markId", res.data.responseData?.at(0).factoryId);
        setMarkDataList(res.data.responseData);
      })
      .catch((error) => console.log(error));
    // dispatch(getSaleNoRequest());

    axiosMain
      .post(`/preauction/Common/BindStatusTypeById?Id=${1}`, {
        invoiceId: 1,
      })
      .then((res) => setStatus(res.data.responseData));

    // axiosMain
    //   .get(`preauction/Common/Common/BindFactory`)
    //   .then((res) => console.log(res.data.responseData,"2222"));
  }, []);

  useEffect(() => {
    // setMarkDataList(markList);
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
      .catch((err) => CustomToast.error(err));
  }, [markList, saleNumber]);

  // useEffect(() => {
  //   if (isDisabled || isEdit) {
  //     setViewData(viewedData);
  //   } else {
  //     setViewData([]);
  //   }
  // }, [viewedData]);

  const invoices = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <InvoiceCheckBox data={row} />,
    // },
    {
      name: "status",
      title: "Invoice Status",
    },
    {
      name: "season",
      title: "Season",
    },
    {
      name: "saleNo",
      title: "Sale No",
    },
    {
      name: "receivedDate",
      title: "Received Date",
      getCellValue: ({ ...row }) => (
        <span>{row?.receivedDate?.split("T")[0]}</span>
      ),
    },
    {
      name: "invoiceNo",
      title: "Invoice No",
    },
    {
      name: "manufacturerName",
      title: "Manufacturer",
    },
    {
      name: "mark",
      title: "Mark",
    },
    {
      name: "wareHouseName",
      title: "Warehouse",
    },
    {
      name: "gradeName",
      title: "Grade",
    },
    {
      name: "invoiceDate",
      title: "Invoice Date",
    },
    {
      name: "manufactureFromDate",
      title: "Manufacture from Date",
    },
    {
      name: "manufactureToDate",
      title: "Manufacture To Date",
    },
    {
      name: "dateOfDispatch",
      title: "Date of Dispatch",
    },
    {
      name: "invoiceQty",
      title: "Invoice Qty.",
    },
  ];

  const handleToDateChange = (event) => {
    const selectedDate = event.target.value;

    if (selectedDate >= fromDate) {
      setToDate(selectedDate);
    }
  };

  const handleDownloadPDF = () => {
    html2canvas(componentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);

      // Save as Blob
      const blob = pdf.output("blob");

      // Trigger the download using file-saver
      saveAs(blob, "table.pdf");
    });
  };
  const ActionArea = (row) => {
    function handleAction(action) {
      setExpandedTab("panel2");

      switch (action) {
        case "view": {
          setSrNo(rows.map((ele) => ele.invoiceId).indexOf(row.data.invoiceId));
          setReceivedDate(row.data.receivedDate);
          setInvoiceStatus(row.data.status);
          return axiosMain
            .post(
              `/preauction/${baseUrlEng}/GetInvoiceDetailsById?invoiceId=${row.data.invoiceId}`,
              {}
            )
            .then((res) => setViewData(res));
        }
        case "edit": {
          setSrNo(null);
          // console.log(row, rows, "row.data.invoiceId");
          // console.log(
          //  rows.map((ele) => ele.invoiceId).indexOf(row.data.invoiceId) ,
          //   "row.data.invoiceId"
          // );

          return axiosMain
            .post(
              `/preauction/${baseUrlEng}/GetInvoiceDetailsById?invoiceId=${row.data.invoiceId}`,
              {}
            )
            .then((res) => setViewData(res));

          // return dispatch(fetchInvoiceDetailsIdRequest(row.data.invoiceId));
        }
        default:
          return "no data";
      }
    }
    return (
      <>
        {modalRight?.includes("3") && (
          <span
            // style={{ background: "transparent", border: "none", color: "green" }}
            onClick={() => {
              handleAction("view");
              setIsDisabled(true);
            }}
          >
            <VisibilityIcon />
          </span>
        )}

        {modalRight?.includes("2") && (
          <span
            // style={{ background: "transparent", border: "none", color: "green" }}
            onClick={() => {
              handleAction("edit");
              setIsDisabled(false);
              setIsEdit(true);
            }}
          >
            <EditIcon />
          </span>
        )}

        {/* <span
          // style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => {
            setOpenDelete(true);
            setInvoiceId(row.data.invoiceId);
          }}
        >
          <DeleteIcon />
        </span> */}
      </>
    );
  };
  // const handleExportExcel = () => {
  //   const data = rows.map((ele) => {
  //     const { invoiceId, ...rest } = ele;
  //     return rest;
  //   });

  //   // Create a new workbook and worksheet
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.json_to_sheet(data);

  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "PreAuctionStatusReport");

  //   // Generate Excel file
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const blob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   saveAs(blob, "InvoiceReport.xlsx");
  // };

  // const handleExportExcel = () => {
  //   const data = rows.map((ele) => {
  //     const { invoiceId, ...rest } = ele;
  //     return rest;
  //   });

  //   // Create a new workbook and worksheet
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.json_to_sheet(data);

  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "PreAuctionStatusReport");

  //   // Apply styles to the header row (row 1 in this case)
  //   const headerCellStyle = {
  //     font: { bold: true, color: { rgb: "FF0000" }, sz: "18" },
  //     alignment: { horizontal: "center" },
  //   };
  //   worksheet["A1"].s = headerCellStyle;

  //   // Generate Excel file with styles
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //     style: true, // Enable cell styles
  //   });

  //   // Convert the excelBuffer to a Blob
  //   const blob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });

  //   // Save the Blob as a file
  //   saveAs(blob, "InvoiceReport.xlsx");
  // };
  // const handleExportExcel = async () => {
  //   const data = rows.map((ele) => {
  //     const { invoiceId, ...rest } = ele;
  //     return rest;
  //   });

  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("PreAuctionStatusReport");
  //   let columnName = invoices.map((item) => item);
  //   let columnLabel = invoices.map((item) => item);
  //   let dataList = Object.values(data[0]); //Array me ANCHEL DO BAR AARHATHA IS LIYE USKO UDA DIYA
  //   dataList.splice(6, 1);
  //   console.log(
  //     dataList, //Array me ANCHEL DO BAR AARHATHA IS LIYE USKO UDA DIYA
  //     // invoices.filter((column) =>
  //     //   columnName
  //     //     .filter((ele, index) => Object.keys(data[0]).includes(ele))
  //     //     .includes(column.name)
  //     // )
  //     Object.keys(data[0]).map(ele=>{
  //       return{title:columnName.map(elee=>elee.name).includes(ele)}
  //     }),
  //     Object.keys(data[0]).filter((columns) => columnName.includes(columns)),
  //     // [...new Set(Object.values(data[0]))],
  //     "Object.keys(data[0])"
  //   );
  //   // Apply styles to the header row and add column names
  //   const headerRow = worksheet.addRow(
  //     // Object.keys(data[0]).filter((columns) => columnName.includes(columns))
  //     columnName
  //       .filter((obj) => Object.keys(data[0]).includes(obj.name))
  //       .map((obj) => obj.title)
  //   );
  //   headerRow.eachCell((cell) => {
  //     cell.font = { bold: true };
  //     cell.alignment = { horizontal: "center" };
  //   });

  //   // let dataList = data.forEach((row, index) => {
  //   //   let data = [...new Set(Object.values(row))];
  //   //   return data;
  //   // });
  //   // Add data rows
  //   data.forEach((row, index) => {
  //     console.log(row, "row--");
  //     worksheet.addRow(dataList);
  //   });

  //   // Automatically adjust column widths based on content
  //   worksheet.columns.forEach((column, index) => {
  //     const headerLength = invoices[index].title.length;
  //     const maxColumnWidth = column.values.reduce((acc, val) => {
  //       const cellLength = val ? val.toString().length : 0;
  //       return Math.max(acc, cellLength);
  //     }, headerLength);
  //     column.width = maxColumnWidth + 2; // Adding extra width for padding
  //   });

  //   const buffer = await workbook.xlsx.writeBuffer();

  //   // Convert the buffer to a Blob
  //   const blob = new Blob([buffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });

  //   // Save the Blob as a file
  //   saveAs(blob, "InvoiceReport.xlsx");
  // };
  const handleDownloadasExcel = () => {
    let documentName = "InvoiceExportasExcel.xlsx";

    // Get the current date and time
    let currentDate = new Date();
    let options = { timeZone: "Asia/Kolkata" }; // Set the time zone to Indian Standard Time
    let formattedDate = currentDate
      .toLocaleString("en-US", options)
      .replace(/[\/.,]/g, "-"); // Format the date as a string and replace certain characters

    // Append the formatted date and time to the document name
    documentName = documentName.replace(/\.xlsx$/, `_${formattedDate}.xlsx`);

    axiosMain
      .post(
        `/preauction/${baseUrlEng}/DownloadInvoiceExportAsExcel?role=` +
          roleCode,
        {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
          auctioneerId: userId,
          factoryId: parseInt(formik.values.markId),
          status: parseInt(formik.values.status),
        }
        // rows?.map((ele) => {
        //   return { LotNo: ele.LotNo };
        // })
      )
      .then((res) => {
        let documentBytes = res?.data?.responseData[0]?.byteDatas;

        // Decode base64 encoded documentBytes
        const decodedBytes = atob(documentBytes);

        // Create a Blob from the decoded bytes
        const blob = new Blob([
          new Uint8Array([...decodedBytes].map((char) => char.charCodeAt(0))),
        ]);

        // Create an object URL from the Blob
        const blobUrl = URL.createObjectURL(blob);

        // Create a hidden anchor element
        const anchor = document.createElement("a");
        anchor.style.display = "none";
        anchor.href = blobUrl;
        anchor.download = documentName;

        // Append anchor to the body
        document.body.appendChild(anchor);

        // Programmatically click the anchor element
        anchor.click();

        // Clean up: remove the anchor and revoke the object URL
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => console.log(err));
  };
  const handleDownload = () => {
    let documentName = "InvoiceSample.xlsx";

    // Get the current date and time
    let currentDate = new Date();
    let options = { timeZone: "Asia/Kolkata" }; // Set the time zone to Indian Standard Time
    let formattedDate = currentDate
      .toLocaleString("en-US", options)
      .replace(/[\/.,]/g, "-"); // Format the date as a string and replace certain characters

    // Append the formatted date and time to the document name
    documentName = documentName.replace(/\.xlsx$/, `_${formattedDate}.xlsx`);

    axiosMain
      .post(
        `/preauction/${baseUrlEng}/DownloadInvoiceSampleExcel?role=` + roleCode,
        {
          season: formik.values.season,
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
          auctioneerId: userId,
          factoryId: parseInt(formik.values.markId),
          status: parseInt(formik.values.status),
        }
        // rows?.map((ele) => {
        //   return { LotNo: ele.LotNo };
        // })
      )
      .then((res) => {
        let documentBytes = res?.data?.responseData[0]?.byteDatas;

        // Decode base64 encoded documentBytes
        const decodedBytes = atob(documentBytes);

        // Create a Blob from the decoded bytes
        const blob = new Blob([
          new Uint8Array([...decodedBytes].map((char) => char.charCodeAt(0))),
        ]);

        // Create an object URL from the Blob
        const blobUrl = URL.createObjectURL(blob);

        // Create a hidden anchor element
        const anchor = document.createElement("a");
        anchor.style.display = "none";
        anchor.href = blobUrl;
        anchor.download = documentName;

        // Append anchor to the body
        document.body.appendChild(anchor);

        // Programmatically click the anchor element
        anchor.click();

        // Clean up: remove the anchor and revoke the object URL
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => console.log(err));
  };

  const handleExportExcel = async () => {
    // Assuming columnName contains the list of objects with "name" and "title"
    let columnsdata = invoices;
    columnsdata.pop();
    const columnName = columnsdata;

    // Assuming data contains the list of data objects like [{saleNo: 5}, ...]
    const data = rows.map((ele) => {
      const { invoiceId, ...rest } = ele;
      return rest;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoice");

    // Define the types for specific columns

    // Create columns in the worksheet
    // columnName?.forEach((column) => {
    //   const excelColumn = worksheet?.addColumn({
    //     header: column.title,
    //     key: column.name,
    //   });

    //   if (dateColumns.includes(column.name)) {
    //     excelColumn.type = "date";
    //     // Optionally, set date format for the column
    //     // excelColumn.numFmt = 'mm/dd/yyyy'; // Date format
    //   } else if (textColumns.includes(column.name)) {
    //     excelColumn.type = "string";
    //   } else {
    //     excelColumn.type = "general";
    //   }
    //   // You can add more conditions for other types like numbers, currencies, etc.
    // });

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
      // worksheet.addRow(rowData).eachCell((cell) => {
      //   cell.fill = {
      //     type: "date",
      //   };
      // });
    });

    console.log(data, "datatata");

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
    saveAs(blob, "InvoiceReport.xlsx");
  };
  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    setActionData({
      view: {},
      edit: {},
    });
    if (panel === "panel1") {
      setViewData([]);
    }
    setSrNo(null);
    setIsDisabled(false);
    setIsEdit(false);
  };

  const InvoiceCheckBox = (data) => {
    const handleChange = (e) => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.invoiceNo === data.data.invoiceNo
            ? { ...row, checked: e.target.checked }
            : row
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const { markId, saleNo, season, status } = initialValues;

  //   const searchData = {
  //     markId: parseInt(markId),
  //     season: season,
  //     saleNo: parseInt(saleNo),
  //     status: parseInt(status),
  //   };

  //   dispatch(fetchInvoiceDetailsRequest(searchData));

  //   // console.log(initialValues, "😂😂😂😂😂");
  // };

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
      .catch((err) => CustomToast.error(err));
  }, [formik.values.season]);

  return (
    <>
      <div>
        <ConfirmationModal
          show={openDelete}
          remarkShow={false}
          title="Are you sure you want to delete Invoice"
          onDelete={() => {
            axiosMain
              .post(
                `/preauction/${baseUrlEng}/DeleteInvoiceDetails?invoiceId=${invoiceId}`,
                {
                  invoiceId: invoiceId,
                }
              )
              .then((res) => {
                if (res.data.statusCode === 200) {
                  CustomToast.success("Invoice Deleted Successfully");
                  fetchInvoiceDetailsRequest(initialValues);
                } else {
                  CustomToast.error("Invoice not Deleted");
                }
              });

            setOpenDelete(false);
          }}
          onHide={() => setOpenDelete(false)}
        />
        {modalRight?.includes("12") && (
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
              <Typography>Manage Invoice</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={formik.handleSubmit}>
                <div className="row">
                  <div className="col-xl-2 col-lg-3 col-md-4">
                    <label>Select Season</label>
                    <InputGroup up>
                      <Form.Control
                        as="select"
                        name="season"
                        value={formik.values.season}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {generateYearOptions()}
                      </Form.Control>
                      {formik.touched.season && formik.errors.season && (
                        <div className="error-message text-dengar">
                          {formik.errors.season}
                        </div>
                      )}
                    </InputGroup>
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-4">
                    <label>Sale No</label>
                    <InputGroup>
                      <Form.Control
                        as="select"
                        name="saleNo"
                        value={formik.values.saleNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {saleNo?.length > 0
                          ? saleNo?.map((item, index) => (
                              <option value={item.saleNoId} key={index}>
                                {item.saleNo}
                              </option>
                            ))
                          : "No Data"}
                      </Form.Control>
                      {formik.touched.saleNo && formik.errors.saleNo && (
                        <div className="error-message text-dengar">
                          {formik.errors.saleNo}
                        </div>
                      )}
                    </InputGroup>
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-4">
                    <label>Manufacturer</label>
                    <InputGroup>
                      <Form.Control
                        as="select"
                        name="markId"
                        value={formik.values.markId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value={0}>All</option>
                        {markDataList?.length > 0
                          ? markDataList?.map((item, index) => (
                              <option value={item.factoryId} key={index}>
                                {item.factoryName}
                              </option>
                            ))
                          : "No Data"}
                      </Form.Control>
                      {formik.touched.markId && formik.errors.markId && (
                        <div className="error-message text-dengar">
                          {formik.errors.markId}
                        </div>
                      )}
                    </InputGroup>
                  </div>
                  <div className="col-xl-2 col-lg-3 col-md-4">
                    <label>Status</label>
                    <InputGroup>
                      <Form.Control
                        as="select"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {status?.length > 0
                          ? status?.map((item, index) => (
                              <option value={item.Value} key={index}>
                                {item.Name}
                              </option>
                            ))
                          : "No Data"}
                      </Form.Control>
                      {formik.touched.status && formik.errors.status && (
                        <div className="error-message text-dengar">
                          {formik.errors.status}
                        </div>
                      )}
                    </InputGroup>
                  </div>
                  <div className="col-xl-auto mt-2">
                    <div className="BtnGroup">
                      <Button className="SubmitBtn" type="submit">
                        Search
                      </Button>
                      {/* <Button className="SubmitBtn" type="submit">
                        <i className="fa fa-refresh"></i>
                      </Button> */}
                      <Button
                        className="SubmitBtn"
                        onClick={() => {
                          formik.resetForm();
                          formik.setFieldValue(
                            "season",
                            currentYear?.toString()
                          );
                          formik.setFieldValue("saleNo", saleNo[0].saleNo);
                          formik.setFieldValue(
                            "markId",
                            markDataList[0].factoryId
                          );
                          formik.setFieldValue("status", status[0].Value);
                          setRows([]);
                        }}
                      >
                        {/* <i className="fa fa-refresh"></i> */}
                        Clear
                      </Button>
                      {/* {modalRight?.includes("8") && ( */}
                      <button
                        type="button"
                        onClick={() =>
                          //setopenPrintModel(true)
                          PrintableTable(
                            invoices,
                            rows?.length > 0 ? rows : [],
                            "Invoice"
                          )
                        }
                        className="SubmitBtn btn"
                      >
                        Export as Pdf
                      </button>
                      {/* )} */}
                      {modalRight?.includes("9") && (
                        <button
                          type="button"
                          className="btn SubmitBtn me-2"
                          onClick={handleDownloadasExcel}
                          // onClick={() => {
                          //   axiosMain
                          //     .post("/Common/GenerateExcel", {
                          //       auctionCenterId: 1,
                          //       AuctioneerId: 91,
                          //       isActive: 1,
                          //     })
                          //     .then((res) => console.log(res));
                          // }}
                        >
                          Export as Excel
                        </button>
                      )}

                      {/* <button
                        type="button"
                        onClick={handleDownloadPDF}
                        className="SubmitBtn btn"
                      >
                        Download PDF
                      </button> */}
                      {/* <Button className="SubmitBtn" onClick={handleExportExcel}>
                    Export as Excel
                  </Button> */}
                    </div>
                  </div>
                </div>
              </form>
              <div>
                <div style={{ display: "none" }}>
                  <table ref={componentRef}>
                    <thead>
                      <tr>
                        {invoices
                          ?.filter((ele) => ele.name !== "action")
                          ?.map((column) => (
                            <th key={column}>{column.title}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((item, index) => (
                        <tr key={index}>
                          {invoices
                            ?.filter((ele) => ele.name !== "action")
                            ?.map((column) => (
                              <td key={column.name}>{item[column.name]}</td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* <PrintableTable
                ref={componentRef}
                columns={invoices}
                data={rows.length > 0 ? rows : []}
              /> */}
                </div>
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
                <span>Invoice Count: {rows.length > 0 ? rows.length : 0}</span>
                <div id="invoiceTable" className="mt-4">
                  <TableComponent
                    columns={
                      modalRight?.includes("3") || modalRight?.includes("2")
                        ? [
                            ...invoices,
                            {
                              name: "action",
                              title: "Action",
                              getCellValue: ({ ...row }) => (
                                <ActionArea data={row} />
                              ),
                            },
                          ]
                        : invoices
                    }
                    rows={rows.length > 0 ? rows : []}
                    setRows={setRows}
                    dragdrop={false}
                    fixedColumnsOn={false}
                    resizeingCol={false}
                    selectionCol={true}
                    sorting={true}
                  />
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        )}

        {modalRight?.includes("1") || isDisabled === true || isEdit === true ? (
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
              <Typography>Create Invoice</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CreateInvoiceForm
                invoiceResponseData={invoiceResponseData}
                isDisabled={isDisabled}
                srNo={srNo}
                viewData={viewData}
                handleAccordionChange={handleAccordionChange}
                invoiceStatusLable={invoiceStatusLable}
                receivedDateLable={receivedDateLable}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                modalRight={modalRight}
                setExpandedTab={setExpandedTab}
                setRows={setRows}
              />
            </AccordionDetails>
          </Accordion>
        ) : (
          ""
        )}
      </div>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Modal;
