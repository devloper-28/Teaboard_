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
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import ExcelUploadComponent from "./form/ExcelUploadComponent";
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
import ExportData from "../../../../components/common/exportData/ExportData";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import axiosMain from "../../../../http/axios/axios_main";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import PrintableTable from "../../../../components/common/PrintableTable";

const allSampleShortage = [
  {
    id: 1,
    LotNo: "2",
    teaTypeName: "tea1",
    invoiceNo: "tea2",
    markName: "",
    gradeName: "",
    categoryName: "",
    packageNo: "",
    noofpackage: "",
    netKgs: "",
    totalSampleQty: "",
    totalShortQty: "",
    inspectionCharges: "",
    reInspectionCharges: "",
    checked: false,
  },
  {
    id: 2,
    LotNo: "2",
    teaTypeName: "tea3",
    invoiceNo: "tea4",
    markName: "",
    gradeName: "",
    categoryName: "",
    packageNo: "",
    noofpackage: "",
    netKgs: "",
    totalSampleQty: "",
    totalShortQty: "",
    inspectionCharges: "",
    reInspectionCharges: "",
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
  mark: "0",
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
  const [auctionTypeCode, setAuctionTypeCode] = useState(auctionTypeMasterCode);
  const baseUrlEnga =
    auction === "ENGLISH" ? "EnglishAuctionSampleShortage" : "SampleShortage";
    const [baseUrlEng, setbaseUrlEng] = useState(baseUrlEnga);
  const [expandedTab, setExpandedTab] = useState("panel1");
  const [rows, setRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const dispatch = useDispatch();

  const [handleChnage, setHandleChnage] = useState(false);
  const [saleNo, setSaleNo] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [disable, setDisable] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [viewData, setViewData] = useState([]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      // console.log("values");
      // handleSubmit(values);

      // const data = {
      //   pageNumber: 1,
      //   pageSize: 10,
      //   season: values.season,
      //   saleNo: parseInt(values.saleNo),
      //   markId: parseInt(values.mark===""?0:values.mark),
      //   // === null ? parseInt(values.mark) : 0
      //   auctioneerId: userId,//auctioner
      //   auctionCenterId: auctionCenterId

      // };
      const data = {
        pageNumber: 1,
        pageSize: 10,
        season: values.season,
        saleNo: values.saleNo,
        markId: parseInt(values.mark === "" ? 0 : values.mark),
        // === null ? parseInt(values.mark) : 0
        auctioneerId: userId, //auctioner
        auctionCenterId: auctionCenterId,
      };

      dispatch(fetchSampleShortageListRequest(data,roleCode,baseUrlEng));
    },
    validateOnBlur: false, // Disable validation on blur
    validateOnChange: handleChnage, // Disable validation on change
    isInitialValid: false,
  });

  // const [tableData, setTableData] = useState(
  //   formik.values.awrInvoices !== [] ? formik.values.awrInvoices : []
  // );

  const awrList = useSelector((state) => state?.awr.awrList?.responseData);
  const shortageList = useSelector(
    (state) => state.sampleShortageReducer.data?.responseData
  );
  console.log(shortageList, "AA");
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
  console.log(formik.values.mark, "markList");

  // console.log(invoiceData, "invoiceData");
  useEffect(() => {
    // dispatch(fetchSampleShortageRequest(5));
    dispatch(fetchMarkRequest({ auctionCenterId }));
    dispatch(fetchWarehouseUserRequest({ auctionCenterId }));
    dispatch(fetchGradeRequest({ auctionCenterId }));
    // dispatch(fetchSaleProgramListRequest(saleData));
    dispatch(fetchSaleNumbersRequest(formik.values.season));
  }, []);
  useEffect(() => {
    console.log("api cal");
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    console.log(saleNo, season, "sas");
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

    // Data to be sent in the POST request

    if (saleNo !== null && season !== "") {
      // Making the POST request using Axios

      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season?.toString(),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          setbaseUrlEng(response?.data?.responseData[0]?.auctionTypeCode === "BHARAT" ? "SampleShortage" : "EnglishAuctionSampleShortage");
          
        })
        .catch((error) => {
          // Handle errors here
        });
    } else {
      console.log(saleNo);
    }

    // Cleanup function, in case you need to cancel the request
  }, [formik.values.saleNo, formik.values.season]);

  useEffect(() => {
    setMarkDataList(markList);
    setWarehouseUserList(warehouseUsersList);
    setGradesList(grades);
    setSaleNo(saleNumber);
    if (shortageList?.length > 0) {
      setRows(shortageList);
    } else {
      setRows([]);
    }
  }, [markList, warehouseUsersList, grades, saleNumber, shortageList]);

  useEffect(() => {
    dispatch(fetchAwrListRequest());
  }, []);

  const sampleshortage = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },

    {
      name: "LotNo",
      title: "Lot No",
    },
    {
      name: "teaTypeName",
      title: "Tea Type",
    },
    {
      name: "invoiceNo",
      title: "Invoice No",
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
      name: "categoryName",
      title: "Category",
    },
    {
      name: "packageNo",
      title: "Packages No.",
    },
    {
      name: "totalPackages",

      title: "No Of Packages",
    },
    // {
    //   name: "noofpackage",
    //   title: "No Of Packages",
    // },

    {
      name: "netKgs",
      title: "Net Weight",
    },
    {
      name: "totalsampleWeight",
      title: "Total Sample Qty",
    },
    {
      name: "totalshortWeight",
      title: "Total Short Qty",
    },
    {
      name: "inspectionCharges",
      title: "Inspection Charges",
    },
    {
      name: "reInspectionCharges",
      title: "Re-Inspection Charges",
    },
  ];

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    setDisable(false);
    setIsEdit(false);
    setRows([]);
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
      let samplesortageRequestdata = {
        LotNo: row.data.LotNo,
        season: formik.values.season,
        saleNo: parseInt(formik.values.saleNo),
        auctionCenterId: auctionCenterId,
      };

      switch (action) {
        case "view": {
          setDisable(true);
          setIsEdit(false);

          return dispatch(fetchSampleShortageRequest(samplesortageRequestdata,roleCode,baseUrlEng));
          // eslint-disable-next-line no-unreachable
        }
        case "edit": {
          setDisable(false);
          setIsEdit(true);

          return dispatch(fetchSampleShortageRequest(samplesortageRequestdata,roleCode,baseUrlEng));
        }
        default:
          return "no data";
      }
    }

    return (
      <>
        <div class="Action">
          {" "}
          {modalRight?.includes("3") && (
            <span onClick={() => handleAction("view")}>
              <VisibilityIcon />
            </span>
          )}
          <span class="brack"></span>
          {modalRight?.includes("2") && (
            <span onClick={() => handleAction("edit")}>
              <EditIcon />
            </span>
          )}
        </div>

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
    const worksheet = workbook.addWorksheet("SampleShortage");

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
    saveAs(blob, "SampleShortage.xlsx");
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

  useEffect(() => {
    dispatch(fetchSaleNumbersRequest(formik.values.season.toString()));
  }, [formik.values.season]);

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
      label: "Mark",
      name: "mark",
      type: "select",
      options: markDataList?.map((ele) => {
        return { label: ele.markCode, value: ele.markId };
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
        {modalRight?.includes("12") && (<>
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
              <Typography>Manage Sample Shortage </Typography>
            </AccordionSummary>
            <AccordionDetails>

              <form onSubmit={formik.handleSubmit}>
                <div className="row align-items-end">
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
                  <div className="col-lg-auto">
                    <div className="BtnGroup">
                      <Button className="SubmitBtn" type="submit">
                        Search
                      </Button>
                      <Button
                        className="SubmitBtn"
                        onClick={() => {
                          let data = {
                            season: currentYear?.toString(),
                            saleNo: currentWeek,
                          };

                          dispatch(fetchAwrListRequest(data));
                        }}
                      >
                        Clear
                      </Button>
                      {modalRight?.includes("3") && (
                        <Button
                          className="SubmitBtn"
                          onClick={handleExportExcel}
                        >
                          Export as Excel
                        </Button>
                      )}

                      {modalRight?.includes("8") && (
                        <button
                          type="button"
                          onClick={() =>
                            PrintableTable(
                              sampleshortage,
                              rows?.length > 0 ? rows : []
                            )
                          }
                          className="SubmitBtn btn"
                        >
                          Export as Pdf
                        </button>
                      )}
                      {modalRight?.includes("8") && (
                        <ExportData
                          columnsdata={sampleshortage}
                          data={rows}
                          exportType={"pdf"}
                          fileName="sample shortage"
                        />
                      )}
                      {modalRight?.includes("9") && (
                        <ExportData
                          columnsdata={sampleshortage}
                          data={rows}
                          exportType={"html"}
                          fileName="sample shortage"
                        />
                      )}
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
                    columns={
                      modalRight?.includes("3") || modalRight?.includes("2")
                        ? [
                          ...sampleshortage,
                          {
                            name: "action",
                            title: "Action",
                            getCellValue: ({ ...row }) => (
                              <ActionArea data={row} />
                            ),
                          },
                        ]
                        : sampleshortage
                    }
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
        </>)}
        {modalRight?.includes("1") || disable || isEdit ? (
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
              <Typography>Upload Sample & Shortage</Typography>
            </AccordionSummary>
            <AccordionDetails>

              <ExcelUploadComponent
                isDisable={disable}
                setExpandedTab={setExpandedTab}
                isEdit={isEdit}
                seasonpass={formik.values.season}
                saleNopass={formik.values.saleNo}
                modalRight={modalRight}
              />

            </AccordionDetails>
          </Accordion>
        ):""}
      </div>
    </>
  );
};

export default Modal;
