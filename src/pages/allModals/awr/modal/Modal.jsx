import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./modal.css";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import * as XLSX from "xlsx";
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
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import AWRForm from "./form/Form";
import { useDispatch } from "react-redux";
import {
  fetchAwrListRequest,
  fetchGradeRequest,
  fetchMarkRequest,
  fetchSaleNumbersRequest,
  fetchWarehouseUserRequest,
  getSubTeaTypesByStatus,
} from "../../../../store/actions";
import CustomeFormCreater from "../../../../components/common/formCreater/CustomeFormCreater";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import axiosMain from "../../../../http/axios/axios_main";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import PrintableTable from "../../../../components/common/PrintableTable";

const allAWRs = [
  {
    id: 1,
    season: "Spring 2023",
    saleNo: "12345",
    gatePassQty: "10",
    awrRefNo: "AWR-001",
    mark: "Mark 1",
    warehouse: "Warehouse A",
    arrivalDate: "2023-07-01",
    awrDate: "2023-07-05",
    catalogClosingDate: "2023-07-10",
    manufacturer: "ABC Company",
    grade: "A",
    checked: false,
  },
  {
    id: 2,
    season: "Summer 2023",
    saleNo: "67890",
    gatePassQty: "20",
    awrRefNo: "AWR-002",
    mark: "Mark 2",
    warehouse: "Warehouse B",
    arrivalDate: "2023-08-01",
    awrDate: "2023-08-05",
    catalogClosingDate: "2023-08-10",
    manufacturer: "XYZ Company",
    grade: "B",
    checked: false,
  },
  // Add more AWR objects as needed
];

const currentDate = new Date().toISOString()?.split("T")[0];

// Get the current year
const currentYear = new Date().getFullYear();

const currentWeek = Math.ceil(
  ((new Date() - new Date(currentYear, 0, 4)) / 86400000 + 1) / 7
);

console.log(currentWeek, currentDate, "currentWeek");

const validationSchema = Yup.object().shape({
  season: Yup.string().required("Season is required"),
  saleNo: Yup.string().required("Sale No is required"),
});

const initialValues = {
  season: currentYear?.toString(),
  saleNo: "",
  awrNo: "",
  mark: "",
  warehouse: "",
  awrDate: "",
  grade: "",
  status: "",
};

const Modal = ({ modalRight }) => {
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
  auction === "ENGLISH" ? "EnglishAuctionAWRDetails" : "AWRDetails";
  const [baseUrlEng, setbaseUrlEng] = useState(baseUrlEngn);

  const [expandedTab, setExpandedTab] = useState("panel1");
  const [rows, setRows] = useState(allAWRs);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [actionData, setActionData] = useState([]);
  const dispatch = useDispatch();

  const [handleChnage, setHandleChnage] = useState(false);
  const [saleNo, setSaleNo] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [disable, setDisable] = useState(false);
  const [status, setStatus] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      // console.log("values");
      // handleSubmit(values);
      formik.values.auctionCenterId = auctionCenterId;
      formik.values.auctioneerId = userId;

      const data = {
        season: values.season,
        saleNo: parseInt(values.saleNo),
        markId: values.mark === "" ? 0 : parseInt(values.mark),
        wareHouseUserRegId:
          values.warehouse === "" ? 0 : parseInt(values.warehouse),
        awrReferenceNo: values.awrNo,
        grade: values.grade === "" ? 0 : parseInt(values.grade),
        auctionCenterId: values.auctionCenterId,
        auctioneerId: values.auctioneerId,
      };

      // dispatch(fetchAwrListRequest(data));
      axiosMain
        .post(`/preauction/${baseUrlEng}/GetAWRList?role=` + roleCode, data)
        .then((res) => {
          setRows(res.data.responseData);
        })
        .catch((err) => console.log(err));
    },
    validateOnBlur: false, // Disable validation on blur
    validateOnChange: handleChnage, // Disable validation on change
    isInitialValid: false,
  });

  // const [tableData, setTableData] = useState(
  //   formik.values.awrInvoices !== [] ? formik.values.awrInvoices : []
  // );

  const awrList = useSelector((state) => state?.awr.awrList?.responseData);

  const markList = useSelector((state) => state.mark.data.responseData);
  const warehouseUsersList = useSelector(
    (state) => state.warehouseUser.data.responseData
  );
  const grades = useSelector((state) => state.grade.data.responseData);

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const category = useSelector((state) => state?.category?.data?.responseData);

  const invoiceData = useSelector(
    (state) => state?.invoiceDetails?.data?.responseData
  );

  // console.log(invoiceData, "invoiceData");

  function AwrStatus() {
    axiosMain
      .post("/preauction/Common/BindStatusTypeById?Id=2")
      .then((res) => setStatus(res.data.responseData));
  }

  useEffect(() => {
    dispatch(fetchMarkRequest({ auctionCenterId }));
    dispatch(fetchWarehouseUserRequest({ auctionCenterId }));
    dispatch(fetchGradeRequest({ auctionCenterId }));
    // dispatch(fetchSaleProgramListRequest(saleData));
    dispatch(fetchSaleNumbersRequest(formik.values.season));
    AwrStatus();
  }, []);

  useEffect(() => {
    setMarkDataList(markList);
    setWarehouseUserList(warehouseUsersList);
    setGradesList(grades);
    setSaleNo(saleNumber);
    if (awrList?.length > 0) {
      setRows(awrList);
    } else {
      setRows([]);
    }
  }, [markList, warehouseUsersList, grades, saleNumber, awrList]);
  useEffect(() => {
    console.log("api cal");
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

    // Data to be sent in the POST request

    // Making the POST request using Axios
    if (saleNo !== "") {
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season,
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          setbaseUrlEng(response?.data?.responseData[0]?.auctionTypeCode === "BHARAT" ? "AWRDetails" : "EnglishAuctionAWRDetails");
         
        })
        .catch((error) => {
          // Handle errors here
        });

      // Cleanup function, in case you need to cancel the request
      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo, formik.values.season]);
  useEffect(() => {
    dispatch(fetchAwrListRequest());
  }, []);

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
  }, [formik.values.season]);

  const awrs = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },
    {
      name: "season",
      title: "Season",
    },
    {
      name: "saleNo",
      title: "Sale No",
    },
    // {
    //   name: "invoiceNo",
    //   title: "Invoice No",
    // },
    {
      name: "awrNo",
      title: "AWR No",
    },
    {
      name: "awrDate",
      title: "AWR Date",
    },
    {
      name: "invoiceDate",
      title: "Invoice Date",
    },

    {
      name: "wareHouseName",
      title: "Warehouse",
    },
    {
      name: "markName",
      title: "Mark",
    },
    {
      name: "gradeName",
      title: "Grade",
    },
    {
      name: "arrivalDate",
      title: "Arrival Date",
    },
    {
      name: "awrReferenceNo",
      title: "AWR Ref No",
    },
    {
      name: "totalNetKgs",
      title: "GP Qty",
    },
    {
      name: "status",
      title: "Status",
      getCellValue: ({ status }) => {
        switch (status) {
          // case 0: {
          //   return "Pending";
          // }
          // case 1: {
          //   return "Invoice Generated";
          // }
          // case 2: {
          //   return "AWR Generated";
          // }
          case 3: {
            return "Approved";
          }
          default:
            return "Approved";
        }
      },
    },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
  ];

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    setDisable(false);
    setRows([]);
    setActionData([]);
    formik.resetForm();
    const today = new Date();

    // Format today's date to YYYY-MM-DD
    const formattedDate = today.toISOString().split("T")[0];
    // console.log(formattedDate);
    setCurrentDate(formattedDate);
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
    function handleAction() {
      setExpandedTab("panel2");
      setDisable(true);
      console.log(row);
      axiosMain
        .post(`/preauction/${baseUrlEng}/GetAWRDetailsById?role=` + roleCode, {
          awrReferenceNo: row.data.awrReferenceNo,
          season: row.data.season,
          saleNo: row.data.saleNo,
          auctioneerId: userId,
          auctionCenterId: auctionCenterId,
          invoiceId: row.data.invoiceId,
        })
        .then((res) => {
          setActionData(res.data.responseData);
        })
        .catch((err) => console.log(err));
    }

    return (
      <>
        <div className="Action">
          {modalRight?.includes("3") && (
            <span
              // style={{
              //   background: "transparent",
              //   border: "none",
              //   color: "green",
              // }}
              onClick={() => handleAction()}
            >
              <VisibilityIcon />
            </span>
          )}
        </div>

        {/* <Button
          style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => handleAction("edit")}
        >
          <EditIcon />
        </Button> */}

        {/* <Button
          style={{ background: "transparent", border: "none", color: "green" }}
          onClick={() => {
            setOpenDelete(true);
            setActionData({ ...actionData, edit: row.data });
          }}
        >
          <DeleteIcon />
        </Button> */}
      </>
    );
  };
  // const handleExportExcel = () => {
  //   const data = rows;

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
  //   saveAs(blob, "AWRReport.xlsx");
  // };



  const handleExportExcel = async () => {
    // Assuming columnName contains the list of objects with "name" and "title"
    let columnsdata = awrs;
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
    saveAs(blob, "AwrReport.xlsx");
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
    // {
    //   label: "AWR No",
    //   name: "awrNo",
    //   type: "text",
    //   required: true,
    //   className: "FormGroup",
    // },
    {
      label: "Mark",
      name: "mark",
      type: "select",
      options: markDataList?.map((ele) => {
        return { label: ele.markCode, value: ele.markId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Warehouse",
      name: "warehouse",
      type: "select",
      options: warehouseUserList?.map((ele) => {
        return { label: ele.wareHouseCode, value: ele.wareHouseUserRegId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Grade",
      name: "grade",
      type: "select",
      options: gradesList?.map((ele) => {
        return { label: ele.gradeCode, value: ele.gradeId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      options: status?.map((ele) => {
        return { label: ele.Name, value: ele.Value };
      }),
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
            setRows([...rows?.filter((ele) => ele.id !== actionData.edit.id)]);
            setOpenDelete(false);
          }}
          onHide={() => setOpenDelete(false)}
        />
        {modalRight?.includes("12") && (
          <Accordion
            expanded={expandedTab === "panel1"}
            className={`${expandedTab === "panel1" ? "active" : ""}`}
            onChange={handleAccordionChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Manage AWR</Typography>
            </AccordionSummary>
            <AccordionDetails>

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

                  <div className="col-lg-12 mb-3">
                    <div className="BtnGroup">
                      {modalRight?.includes("12") && (
                        <>
                          {" "}
                          <Button className="SubmitBtn" type="submit">
                            Search
                          </Button>
                          <Button
                            className="SubmitBtn"
                            onClick={() => {
                              let data = {
                                season: currentYear?.toString(),
                                saleNo: currentWeek,
                                auctionCenterId: auctionCenterId,
                              };

                              dispatch(fetchAwrListRequest(data));
                            }}
                          >
                            <i class="fa fa-refresh"></i>
                          </Button>
                        </>
                      )}
                      {modalRight?.includes("9") && (
                        <Button
                          className="SubmitBtn"
                          onClick={handleExportExcel}
                        >
                          Export as Excel
                        </Button>
                      )}

                      {/* {modalRight?.includes("8") && ( */}
                      <button
                        type="button"
                        onClick={() =>
                          PrintableTable(
                            awrs,
                            rows?.length > 0
                              ? rows.map((item) => ({
                                ...item,
                                status: "Approved",
                              }))
                              : [],
                            "AWR"
                          )
                        }
                        className="SubmitBtn btn"
                      >
                        Export as Pdf
                      </button>
                      {/* )} */}
                    </div>
                  </div>
                </div>
              </form>


              <div>
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
                <div id="invoiceTable">
                  <TableComponent
                    columns={awrs}
                    rows={rows}
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
        {modalRight?.includes("1") || disable === true ? (<>
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
              <Typography>Create AWR</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* {disable === true ? (
              <AWRForm
                isDisabled={disable}
                setExpandedTab={setExpandedTab}
                actionData={actionData}
                currentDate={currentDate}
              />
            ) : (
              modalRight?.includes("1") && ( */}
              <AWRForm
                isDisabled={disable}
                setExpandedTab={setExpandedTab}
                actionData={actionData}
                currentDate={currentDate}
                modalRight={modalRight}
              />
              {/* )
            )} */}
            </AccordionDetails>
          </Accordion></>) : ""}

      </div>
    </>
  );
};

export default Modal;
