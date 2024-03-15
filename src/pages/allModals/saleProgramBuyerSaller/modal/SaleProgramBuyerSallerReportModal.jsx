import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormLabel,
  Modal,
  ToastContainer,
} from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./modal.css";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import formatDateToDdMmYy from "../../../../components/common/dateAndTime/convertToDate";
import ExcelJS from "exceljs";

import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Accordion,
  FormGroup,
} from "@mui/material";
import { SelectAll } from "@mui/icons-material";
import * as Yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";

import { useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  addLotSeriesRequest,
  deleteLotSeriesRequest,
  fetchBuyerGroups,
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
// import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// import KutchaCataloguePDF from "../KutchaCataloguePDF";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "react-toastify/dist/ReactToastify.css";
import axiosMain from "../../../../http/axios/axios_main";
import CustomToast from "../../../../components/Toast";
import DocModal from "./DocModal";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";

const validationSchema = Yup.object().shape({
  season: Yup.string().required("Season is required"),
  saleNo: Yup.number()
    .min(1, "Please select Sale No")
    .required("Sale No is required"),
  saleDate: Yup.string().required("Catalog Closing Date is required"),
  catalogpublishDate: Yup.string().required(
    "Catalog Publshing Date is required"
  ),
  //markType: Yup.string().required("Sale Date is required"),
});

const initialValues = {
  season: "",
  saleNo: "0",
  saleDate: "",
  catalogpublishDate: "",
};

const SaleProgramBuyerSallerReportModal = ({ modalRight }) => {
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
const [auctionTypeCode, setAuctionTypeCode] = useState(auctionTypeMasterCode);
const baseUrlEng =
  auction === "ENGLISH" ? "EnglishAuctionBuyer" : "Buyer";
  const [lotSeriesDataIds, setLotSeriesData] = useState([]);
  const [initialValues, setInitialValue] = useState({});

  const [isEdit, setIsEdit] = useState(false);
  const [groupCodeListdata, setGroupCodeList] = useState([]);
  const [auctioneer, setAuctioneer] = useState([]);
  //const [saleNumber, setsaleNumber] = useState([]);
  const [groupid, setgroupid] = useState(0);

  const [saleDates, setSaleDates] = useState([]);
  const [catalogClose, setcatalogClose] = useState([]);

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
  console.log(abc, "abc");
  const kutchaList = useSelector(
    (state) => state?.kutchaCatalogueReducer?.data?.responseData
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
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
  const [openDelete, setOpenDelete] = useState(false);
  const [modalRowData, setmodalRowData] = useState([]);

  const handleExportPDF = () => {
    let htmls;
    // if(rows.length>0)
    // {
    htmls = rows.map((item) => {
      return `
          <tr>
            <td>${item.teaTypeName}</td>
            <td>${item.saleDate}</td>
            <td>${item.buyersPromptDate}</td>
            <td>${item.sellersPromptDate}</td>
            <td>${item.remarks}</td>
            <td>
  ${
    item.status === 0
      ? "Pending"
      : item.status === 1
      ? "Active"
      : item.status === 2
      ? "Cancel"
      : item.status === 3
      ? "Complete"
      : ""
  }
</td>
          </tr>
        `;
    });
    //}

    // if (printableContent) {
    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.open();
    printWindow.document.write(`
        <html>
        <head>
        <title>Sale Programme Buyer Saller</title>
       <style>
       
table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 14px;
}
th {
  background-color: #343a40; 
  color: #fff;
  text-align: left;
  padding: 10px;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}


tr:hover {
  background-color: #d4d4d4; 
}
td {
  padding: 10px;
  border: 1px solid #ccc; 
}
       </style>

      </head>
          <body>
          <table class="custom-table">
          <thead>
          <tr>
          <td>Tea Type</td>
          <td>Sale Date</td>
          <td>Buyers Promt Date</td>
          <td>Sellers Promt Date</td>
          <td>Remars</td>
          <td>Status</td>

          </tr>
          </thead>
          <tbody>
          ${htmls.join("")}
          </tbody>
          </table>
          </body>
        </html>
      `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
    //}
  };
  // Call handleExportPDF when you want to export the table to PDF

  const handleExportExcel = async () => {
    // Assuming columnName contains the list of objects with "name" and "title"
    let columnsdata = kutcha;
    columnsdata.pop();
    const columnName = columnsdata;

    // Assuming data contains the list of data objects like [{saleNo: 5}, ...]
    const data = rows;
    let newdata = rows?.map((item) => {
      if (item.status === 0) {
        return { ...item, status: "Pending" };
      } else if (item.status === 1) {
        return { ...item, status: "Active" };
      } else if (item.status === 2) {
        return { ...item, status: "Completed" };
      } else if (item.status === 3) {
        return { ...item, status: "Cancelled" };
      } else {
        return { ...item, status: "-" };
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SaleProgrammerBuyerSeller");

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
    saveAs(blob, "SaleProgrammerBuyerSeller.xlsx");
  };

  // useEffect(() => {
  //   formik.setFieldValue("saleDate", saleDates?.at(0)?.saleDate);
  // }, [saleDates]);
  useEffect(() => {
    formik.values.saleNo = "0";
    formik.values.season = "";
    formik.values.saleDate = "";
    // formik.values.teaType="0";
  }, []);

  useEffect(() => {
    // Dispatch the action when the component mounts

    dispatch(
      fetchLotSeriesRequest({
        season: "2023",
        saleNo: 3,
        pageNumber: 1,
        pageSize: 10,
      })
    );
    dispatch(fetchSaleNumbersRequest(2023));
    dispatch(fetchBuyerGroups(userId));
    dispatch(fetchSessionTypeRequest());
    dispatch(fetchMarkTypeRequest());
    // axiosMain
    //   .post("/preauction/Common/BindAuctioneer")
    //   .then((response) => {
    //     // Handle the API response here
    //     setAuctioneer(response.data.responseData);
    //   })
    //   .catch((error) => {
    //     // Handle errors here
    //   });
  }, []);

  const handleRemove = () => {
    const requestData = {
      lotNoSeriesID: actionData.edit.lotNoSeriesID,
      updatedBy: userId,
    };

    // Dispatch the deleteLotSeriesRequest action with the provided data
    dispatch(deleteLotSeriesRequest(requestData));
    setOpenDelete(false);
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      //  if(values.sessionTime!=="")
      //   {
      //     let data=values.sessionTime.split('-');
      //   }
      const formData = {
        Season: values.season,
        SaleNo: values.saleNo !== "0" ? parseInt(values.saleNo) : 0,
        catalogClosingDate: values.saleDate,
        catalogPublishingDate: values.catalogpublishDate,
        auctionCenterId: auctionCenterId,
      };
      let listdata = [];
      axiosMain
        .post(`/preauction/${baseUrlEng}/GetSaleProgramDetails`, formData)
        .then((response) => {
          // Handle the successful response here
          console.log("Response:", response.data);
          // if (response.data.responseData) {
          //   listdata = response.data.responseData.map((item, index) => {
          //     return { ...item, interestedtobid: '0',maxbid:0 };
          //   });
          // }
          let data = response.data?.responseData[0]?.saleProgramList?.map(
            (ele) => {
              return {
                ...ele,
                buyersPromptDate: formatDateToDdMmYy(ele.buyersPromptDate),
                sellersPromptDate: formatDateToDdMmYy(ele.sellersPromptDate),
                saleDate: formatDateToDdMmYy(ele.saleDate),
              };
            }
          );

          setRows(data);
          let modalrowda = [];
          modalrowda = response.data.responseData[0].saleProgramDocList?.map(
            (item, index) => {
              return {
                ...item,
                srNo: index + 1, // Add the "srNo" property with a value of index + 1
              };
            }
          );
          setmodalRowData(modalrowda);
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error:", error);
        });

      console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
    },
  });
  useEffect(() => {
    if (
      formik.values.season !== "" &&
      formik.values.season !== undefined &&
      formik.values.saleNo !== undefined &&
      formik.values.saleNo !== "0"
    ) {
      let requestdata = {
        season: formik.values.season,
        saleNo: parseInt(formik.values.saleNo),
        auctionCenterId: auctionCenterId,
      };
      axiosMain
        .post(`/preauction/${baseUrlEng}/BindClosingAndPublishingDate`, requestdata)
        .then((response) => {
          // Handle the API response here
          formik.setFieldValue("saleDate","");
          formik.setFieldValue("catalogpublishDate","")
          setcatalogClose(response.data.responseData);
        })
        .catch((error) => {
          // Handle errors here
        });
    }
  }, [formik.values.season, formik.values.saleNo]);
  useEffect(() => {
    formik.resetForm();
    formik.setFieldValue("season", "");
    formik.setFieldValue("saleNo", "0");
    formik.setFieldValue("saleDate", "");
    formik.setFieldValue("catalogpublishDate", "");
    setRows([]);
  }, []);
  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;

    // API endpoint URL
    const apiUrl = `/preauction/AuctionSession/GetSaleDateAndTeaType`;

    // Making the POST request using Axios
    if (
      saleNo !== "" &&
      season !== "" &&
      saleNo !== undefined &&
      season !== undefined
    ) {
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season,
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          // Handle the API response here
          setSaleDates(response?.data?.responseData);
        })
        .catch((error) => {
          // Handle errors here
        });

      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo, formik.values.season]);
  //bind session time
  // useEffect(() => {
  //   const saleNo = formik.values.saleNo;
  //   const season = formik.values.season;
  //   const saledate = formik.values.saleDate;
  //   if (saleNo !== "" && season !== "" && saleNo !== undefined && season !== undefined && saledate !== undefined && saledate !== "") {
  //     const dataparam = {
  //       season: season,
  //       saleNo: parseInt(saleNo),
  //       auctionDate: "2023-09-13T00:00:00"
  //     };
  //     axiosMain
  //       .post("/preauction/Common/BindSessionTime", dataparam)
  //       .then((response) => {
  //         console.log(response, "bind session time")
  //         setSessionTime(response.data.responseData);
  //       })
  //       .catch((error) => {
  //         // Handle errors here
  //       });
  //   }
  // }, [formik.values.saleNo, formik.values.season, formik.values.saleDate]);

  useEffect(() => {
    const season = formik.values.season;
    if ((season !== "") & (season !== undefined)) {
      dispatch(fetchSaleNumbersRequest(formik.values.season));
    }
  }, [formik.values.season]);

  //for create formik

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
  const [rows, setRows] = useState([]);
  // const [year, setYear] = useState("2023");
  const [sessionTypes, setSessionType] = useState(sessionType); // If using React state hooks

  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [kutchaData, setTeakutchaData] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  // const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [mark, setmark] = useState([]);
  const [categoryList, setcategory] = useState([]);
  const [sessionTime, setSessionTime] = useState(sessionType);
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [isDisabled, setIsDisabled] = useState(false);

  const { handleChange, handleBlur, values, touched, errors } = formik;

  console.log(sessionTypes, "sessionTypess");
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

  const kutcha = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },
    { name: "teaTypeName", title: "Tea Type Name" },
    { name: "saleDate", title: "Sale Date" },
    { name: "buyersPromptDate", title: "Buyers Promt Date" },

    { name: "sellersPromptDate", title: "Seller Promt Date" },
    { name: "remarks", title: "Remarks" },
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
            return "Completed";
          }
          case 3: {
            return "Cancelled";
          }
          default:
            return "-";
        }
      },
    },

    // {
    //   title: "View Doc",
    //   name: "auction",
    //   getCellValue: ({ ...row }) => (
    //     <>
    //       <button
    //         type="button"
    //         onClick={() => {
    //           setmodalRowData(row);
    //           setOpenDelete(true);
    //           console.log(row,modalRowData,"setmodalRowData")
    //         }}
    //       >
    //         View Doc
    //       </button>
    //     </>
    //   ),
    // },
  ];

  const Modalls = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <Modal
        size="xl"
        title="Sale Programme Document List"
        show={isOpen}
        handleClose={() => onClose()}
      >
        <div className="modall">
          <div className="modall-content">
            <span className="close" onClick={onClose}>
              &times;
            </span>
            <h2>Saa</h2>
          </div>
        </div>
      </Modal>
    );
  };
  const ActionArea = (row) => {
    function handleAction(action) {
      switch (action) {
        case "view": {
          openModal();
          break;
          // const lotNo = row.data.groupId;
          // setIsModalOpen(true);
          // return (
          //   <div className="App">
          //     <h1>React Modal Example</h1>

          //     <Modalls isOpen={isModalOpen} onClose={closeModal}>
          //       <h2>Modal Content</h2>
          //       <p>This is the content of the modal.</p>
          //     </Modalls>
          //   </div>
          // );
          //setgroupid(lotNo);
          // axiosMain
          //   .post("/preauction/GroupMaster/GetGroupMasterById?groupId=" + lotNo)
          //   .then((response) => {
          //     // Handle the successful response here
          //     console.log("EditResponse:", response.data.responseData[0]);

          //     // createformik.setFieldValue(
          //     //   "groupName",
          //     //   response.data.responseData[0].groupName
          //     // );
          //     // createformik.setFieldValue(
          //     //   "groupCode",
          //     //   response.data.responseData[0].groupCode
          //     // );
          //   })
          //   .catch((error) => {
          //     // Handle any errors here
          //     console.error("Error:", error);
          //   });
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
          <span onClick={() => handleAction("view")}>
            <VisibilityIcon />
          </span>
        </div>
      </>
    );
  };
  console.log(rows, "rows");

  // useEffect(() => {
  //   if (teaTypeList && teaTypeList.length > 0) {
  //     formik.setFieldValue("teaType", teaTypeList[0]?.teaTypeId);
  //   }
  // }, [teaTypeList, formik]);

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    //setLotSeriesData([]);
    setIsEdit(false);

    setIsDisabled(false);
    // if(panel==="panel1")
    // {
    //   formik.resetForm()
    // formik.setFieldValue("groupCode", "")
    // formik.setFieldValue("groupName", "")
    // setRows([]);
    // }
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

  useEffect(() => {
    setSessionType(sessionType);
  }, [sessionType]);

  // console.log(rows,"rows")
  return (
    <>
      <div id="invoiceTablec">
        {/* <ConfirmationModal
          show={openDelete}
          onDelete={handleRemove}
          onHide={() => setOpenDelete(false)}
        /> */}
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
            <Typography>Sale Programme Buyer Report</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {modalRight?.includes("12") && (
              <form onSubmit={formik.handleSubmit}>
                <div className="row align-items-end no-print">
                  <div className="col-lg-2">
                    <label>Select Season</label>
                    <InputGroup>
                      <FormControl
                        as="select"
                        name="season"
                        value={formik.values.season}
                        onChange={formik.handleChange}
                      >
                        <option value="" selected>
                          Please Select Season
                        </option>
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
                        <option value="0" selected>
                          All
                        </option>
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

                  <div className="col-lg-2">
                    <label>Select Catalog Closing Date.</label>
                    <InputGroup>
                      <FormControl
                        as="select"
                        name="saleDate"
                        value={formik.values.saleDate}
                        onChange={handleChange}
                      >
                        <option value="" selected>
                          Please Select Catalog Closing Date
                        </option>
                        {catalogClose?.map((e) => (
                          <option
                            key={e.spClosingDate[0].catalogClosingDate}
                            value={e.spClosingDate[0].catalogClosingDate}
                          >
                            {e.spClosingDate[0].catalogClosingDate}
                          </option>
                        ))}
                      </FormControl>
                    </InputGroup>
                    {formik.errors.saleDate && formik.touched.saleDate && (
                      <div className="error text-danger">
                        {formik.errors.saleDate}
                      </div>
                    )}
                  </div>
                  <div className="col-lg-2">
                    <label>Select Catalog Publish Date.</label>
                    <InputGroup>
                      <FormControl
                        as="select"
                        name="catalogpublishDate"
                        value={formik.values.catalogpublishDate}
                        onChange={handleChange}
                      >
                        <option value="" selected>
                          Please Select Catalog Publish Date
                        </option>
                        {catalogClose?.map((e) => (
                          <option
                            key={e.spPublishingDate[0].catalogPublishingDate}
                            value={e.spPublishingDate[0].catalogPublishingDate}
                          >
                            {e.spPublishingDate[0].catalogPublishingDate}
                          </option>
                        ))}
                      </FormControl>
                    </InputGroup>
                    {formik.errors.catalogpublishDate &&
                      formik.touched.catalogpublishDate && (
                        <div className="error text-danger">
                          {formik.errors.catalogpublishDate}
                        </div>
                      )}
                  </div>

                  <br></br>
                  <div className="col-auto">
                    <div className="BtnGroup">
                      <Button className="SubmitBtn" type="submit">
                        Search
                      </Button>
                      <Button
                        className="SubmitBtn"
                        onClick={() => {
                          formik.resetForm();
                          formik.setFieldValue("season", "");
                          formik.setFieldValue("saleNo", "0");
                          formik.setFieldValue("saleDate", "");
                          formik.setFieldValue("catalogpublishDate", "");
                          setRows([]);
                          setmodalRowData([]);
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  <div className="col-lg-2"></div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="BtnGroup">
                      {modalRight?.includes("9") && <Button className="SubmitBtn" onClick={handleExportExcel}>
                        Export as Excel
                      </Button>}
                      {modalRight?.includes("7") && rows?.length > 0 ? (
                        <Button
                          className="SubmitBtn"
                          id="print-button"
                          onClick={handleExportPDF}
                        >
                          Export as PDF
                        </Button>
                      ) : (
                        ""
                      )}

                      {modalRowData?.length > 0 ? (
                        <div className="col-6">
                          <button
                            className="SubmitBtn"
                            type="button"
                            onClick={() => {
                              //setmodalRowData(modalRowData);
                              setOpenDelete(true);
                              console.log(modalRowData, "setmodalRowData");
                            }}
                          >
                            View Doc
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <TableComponent
                    columns={kutcha}
                    rows={rows?.length > 0 ? rows : []}
                    // setRows={setRows}
                    dragdrop={false}
                    fixedColumnsOn={false}
                    resizeingCol={false}
                    selectionCol={true}
                    sorting={true}
                  />
                </div>
              </form>
            )}
          </AccordionDetails>
        </Accordion>

        <DocModal
          show={openDelete}
          data={modalRowData}
          onDelete={() => {
            setOpenDelete(false);
          }}
          onHide={() => setOpenDelete(false)}
        />
      </div>
      {/* <ToastContainer position="top-center" autoClose={3000} /> */}
    </>
  );
};

export default SaleProgramBuyerSallerReportModal;
