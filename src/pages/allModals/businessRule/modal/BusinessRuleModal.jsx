import React, { useEffect, useState } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./modal.css";
import TableComponent from "../../../../components/tableComponent/TableComponent";
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
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";

const validationSchema = Yup.object().shape({
  saleNo: Yup.string().required("Sale No is required"),
  season: Yup.string().required("Season is required"),
});
const createvalidationSchema = Yup.object().shape({
  // timeless: Yup.string()
  //   .required('Time Less is required'),
  //.min(3, 'Group Code must be at least 3 characters')
  season: Yup.string().required("Season is required"),
  saleNo: Yup.string().required("Sale No is required"),
  auctionVariant: Yup.string().required("Auction Varient is required"),

  activeLots: Yup.number()
    .typeError("No Of Active Lots must be a number")
    .required("No Of Active Lots is required")
    .positive("No Of Active Lots must be a positive number")
    .integer("No Of Active Lots must be an integer"),

  // auctionSession: Yup.number()
  // .typeError('No Of Auction Session must be a number')
  // .required('No Of Auction Session is required')
  // .positive('No Of Auction Session must be a positive number')
  // .integer('No Of Auction Session must be an integer')
});
const initialValues = {
  season: "",
  saleNo: "",
  groupCode: "",
  groupName: "",
};
const createinitialValues = {
  season: "",
  SaleNo: "",
  auctionSession: "0",
  timeless: true,
  activeLots: "",
  auctionVariant: "Batch Wise",
};

const BusinessRuleModal = () => {
  const dispatch = useDispatch();
   const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId,roleCode } =
    useAuctionDetail();
  const [lotSeriesDataIds, setLotSeriesData] = useState([]);
  const [initialValues, setInitialValue] = useState({});

  const [isEdit, setIsEdit] = useState(false);
  const [groupCodeListdata, setGroupCodeList] = useState([]);
  const [groupid, setgroupid] = useState(0);
  const [ischecked, setischecked] = useState(true);
  //search
  const [saleNo, setSaleNo] = useState([]);
  const [saleProgramId, setSaleProgramId] = useState(0);
  //for create
  const [createsaleNo, createsetSaleNo] = useState([]);
  const [createsaleProgramId, createsetSaleProgramId] = useState(0);

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
  
  const handleExportExcel = async () => {
    // Assuming columnName contains the list of objects with "name" and "title"
    let columnsdata = kutcha;
    columnsdata.pop();
    const columnName = columnsdata;

    // Assuming data contains the list of data objects like [{saleNo: 5}, ...]
    const data = rows.map((ele) => {
      const { srNo,prsAuctionSessionId,auctionSessionLotConfiguration,...rest } = ele;
     
      return rest;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("BusinessRule");

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
    saveAs(blob, "BusinessRule.xlsx");
  };
  // const handleExportExcel = () => {
    
  //   let newrows = rows?.map(item => {
  //     const { srNo,prsAuctionSessionId,auctionSessionLotConfiguration,...newdata } = item;
  //     return newdata;
  //   })
  //   // Create a new workbook and worksheet
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.json_to_sheet(newrows);

  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "BusinessRule");

  //   // Generate Excel file
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const blob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   saveAs(blob, "BusinessRule.xlsx");
  // };
  ///samar
  const groupCodeList = useSelector(
    (state) => state?.groupMaster?.buyerGroups?.data?.responseData
  );
  console.log(groupCodeList, "Gropu datas.......................");
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

    // dispatch(fetchSaleNumbersRequest(formik.values.season));
    //dispatch(fetchBuyerGroups(userId));
  }, []);

  useEffect(() => {
    setGroupCodeList(groupCodeList);
  }, [groupCodeList]);

  //bind group
  const bindGroupsList = () => {
    axiosMain
      .post("/preauction/GroupMaster/BindGroups?buyerUserId=" + userId)
      .then((response) => {
        // Handle the successful response here
        console.log("Response:", response.data);
        console.log("after update group bind", response.data.responseData);
        setGroupCodeList(response.data.responseData);
        setRows([]);
      })

      .catch((error) => {
        // Handle any errors here
        console.error("Error:", error);
      });
  };

  const handleRemove = () => {
    const requestData = {
      lotNoSeriesID: actionData.edit.lotNoSeriesID,
      updatedBy: userId,
    };

    // Dispatch the deleteLotSeriesRequest action with the provided data
    dispatch(deleteLotSeriesRequest(requestData));
    setOpenDelete(false);
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
  const formik = useFormik({
    initialValues: initialValues,

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let listdata = [];
      axiosMain
        .post(
          "/preauction/BusinessRule/GetBusinessRule?SaleProgramId=" +
          saleProgramId + "&auctionCenterId=" + auctionCenterId
        )
        .then((response) => {
          // Handle the successful response here
          console.log("Response:", response.data);
          if (response.data.responseData) {
            listdata = response.data.responseData.map((item, index) => {
              return {
                ...item,
                srNo: index + 1,
                auctionVariant:
                  item.auctionVariant === 1 ? "Batch Wise" : "Batch Split",
                dynamicTimeless: item.dynamicTimeless === 1 ? "Yes" : "No",
              };
            });
          }
          setRows(listdata);
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error:", error);
        });
    },
  });
  useEffect(() => {
    const seasondata = {
      season: formik?.values?.season?.toString(),
      auctionCenterId: auctionCenterId,
    };
    axiosMain
      // .post(
      //   `/preauction/Common/BindSaleNoBySeason?season=${formik.values.season}`
      // )
      .post(`/preauction/Common/BindSaleNoBySeason`, seasondata)
      .then((res) => setSaleNo(res.data.responseData))
      .catch((err) => CustomToast.error(err));
  }, [formik.values.season]);

  useEffect(() => {
    console.log("api cal");
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    console.log(saleNo, season, "sas");
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

    // Data to be sent in the POST request

    if (
      saleNo !== undefined &&
      saleNo !== "" &&
      formik.values.season !== "" &&
      formik.values.season !== undefined
    ) {
      // Making the POST request using Axios
      setSaleProgramId(0);
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season.toString(),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          console.log(
            response.data.responseData[0].SaleProgramId,
            "saleno sel"
          );
          setSaleProgramId(response.data.responseData[0].SaleProgramId);
        })
        .catch((error) => {
          // Handle errors here
        });
    }

    // Cleanup function, in case you need to cancel the request
    return () => {
      // Cancel the request (if necessary) to avoid memory leaks
    };
  }, [formik.values.saleNo, formik.values.season]);

  //for create formik

  const createformik = useFormik({
    initialValues: createinitialValues,

    validationSchema: createvalidationSchema,
    onSubmit: (values) => {
      let url = "";
      let formData = [];

      if (isEdit === false) {
        formData = {
          SaleProgramId: createsaleProgramId,
          //auctionSessionLotConfiguration: 0, //parseInt(values.auctionSession),
          dynamicTimeless: 1,
          auctionVariant: values.auctionVariant === "Batch Wise" ? 1 : 2,
          noOfActiveLots: parseInt(values.activeLots),
          createdBy: parseInt(userId),
          auctionCenterId: auctionCenterId,
        };
        url = "/preauction/BusinessRule/CreateBusinessRule";
      } else {
        formData = {
          prsAuctionSessionId: groupid,
          SaleProgramId: createsaleProgramId,
          //auctionSessionLotConfiguration: 0, //parseInt(values.auctionSession),
          dynamicTimeless: 1,
          auctionVariant: values.auctionVariant === "Batch Wise" ? 1 : 2,
          noOfActiveLots: parseInt(values.activeLots),
          updatedBy: parseInt(userId),
          auctionCenterId: auctionCenterId,
        };
        url = "/preauction/BusinessRule/UpdateBusinessRule";
      }

      axiosMain
        .post(url, formData)
        .then((response) => {
          // Handle the successful response here
          console.log("Response:", response.data);
          if (response.data.statusCode == 200) {
            CustomToast.success(response.data.message);

            createformik.resetForm();
            setExpandedTab("panel1");
            setIsEdit(false);
          } else CustomToast.error(response.data.message);
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error:", error);
        });

      //console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
    },
  });
  //Createa time
  useEffect(() => {
    const seasondata = {
      season: createformik.values.season.toString(),
      auctionCenterId: auctionCenterId,
    };
    axiosMain
      .post(`/preauction/Common/BindSaleNoBySeason`, seasondata)
      .then((res) => createsetSaleNo(res.data.responseData))
      .catch((err) => CustomToast.error(err));
  }, [createformik.values.season]);

  useEffect(() => {
    console.log("api cal");
    const saleNo = createformik.values.saleNo;
    const season = createformik.values.season;
    console.log(saleNo, season, "sas");
    // API endpoint URL
    const apiUrl = `/preauction/Common/GetSaleProgramDetailBySaleNo`;

    // Data to be sent in the POST request

    if (
      saleNo !== undefined &&
      saleNo !== "" &&
      createformik.values.season !== "" &&
      createformik.values.season !== undefined
    ) {
      // Making the POST request using Axios
      createsetSaleProgramId(0);
      axiosMain
        .post(apiUrl, {
          saleNo: parseInt(saleNo),
          season: season.toString(),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          console.log(
            response.data.responseData[0].SaleProgramId,
            "saleno sel"
          );
          createsetSaleProgramId(response.data.responseData[0].SaleProgramId);
        })
        .catch((error) => {
          // Handle errors here
        });
    }

    // Cleanup function, in case you need to cancel the request
    return () => {
      // Cancel the request (if necessary) to avoid memory leaks
    };
  }, [createformik.values.saleNo, createformik.values.season]);
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
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [mark, setmark] = useState([]);
  const [categoryList, setcategory] = useState([]);
  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled1, setIsDisabled1] = useState(false);
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
    { name: "srNo", title: "Sr No." },
    // {
    //   name: "auctionSessionLotConfiguration",
    //   title: "Auction Session/Lot Configuration",
    // },
    {
      name: "dynamicTimeless",
      title: "Dynamic Timeless",
    },
    { name: "auctionVariant", title: "Auction Varient" },
    { name: "noOfActiveLots", title: "No Of Active Lots" },
    { name: "userName", title: "User Name" },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
  ];

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
    createformik.setFieldValue("season", "");
    createformik.setFieldValue("saleNo", "");
    createformik.resetForm();
    setIsDisabled(false);
    setIsDisabled1(false);
    // if(panel==="panel1")
    // {
    //   formik.resetForm()
    // formik.setFieldValue("groupCode", "")
    // formik.setFieldValue("groupName", "")
    // setRows([]);
    // }
  };

  const ActionArea = (row) => {
    function handleAction(action) {
      setExpandedTab("panel2");

      switch (action) {
        case "view": {
          const lotNo = row.data.prsAuctionSessionId;

          axiosMain
            .post(
              "/preauction/BusinessRule/GetBusinessRuleByID?prsAuctionSessionId=" +
              lotNo + "&auctionCenterId=" + auctionCenterId
            )
            .then((response) => {
              // Handle the successful response here
              console.log(
                "EditResponse by sdp:",
                response.data.responseData[0]
              );
              createsetSaleProgramId(
                response.data.responseData[0].SaleProgramId
              );
              createformik.setFieldValue(
                "saleNo",
                response.data.responseData[0].saleNo
              );
              createformik.setFieldValue(
                "season",
                response.data.responseData[0].season
              );
              // createformik.setFieldValue(
              //   "auctionSession",
              //   response.data.responseData[0].auctionSessionLotConfiguration
              // );
              createformik.setFieldValue(
                "timeless",
                response.data.responseData[0].dynamicTimeless === 1
                  ? setIsDisabled(true)
                  : setIsDisabled(false)
              );
              createformik.setFieldValue(
                "activeLots",
                response.data.responseData[0].noOfActiveLots
              );
              createformik.setFieldValue(
                "auctionVariant",
                response.data.responseData[0].auctionVariant === 1
                  ? "Batch Wise"
                  : "Batch Split"
              );
            })
            .catch((error) => {
              // Handle any errors here
              console.error("Error:", error);
            });
          setIsDisabled(true);
          setIsDisabled1(true);
          break;
        }
        case "edit": {
          setIsDisabled(false);
          setIsDisabled1(true);
          const lotNo = row.data.prsAuctionSessionId;

          setgroupid(lotNo);
          axiosMain
            .post(
              "/preauction/BusinessRule/GetBusinessRuleByID?prsAuctionSessionId=" +
              lotNo + "&auctionCenterId=" + auctionCenterId
            )
            .then((response) => {
              // Handle the successful response here
              console.log("EditResponse:", response.data.responseData[0]);
              createsetSaleProgramId(
                response.data.responseData[0].SaleProgramId
              );

              // createformik.setFieldValue(
              //   "auctionSession",
              //   response.data.responseData[0].auctionSessionLotConfiguration
              // );
              createformik.setFieldValue(
                "timeless",
                response.data.responseData[0].dynamicTimeless === 1
                  ? setischecked(true)
                  : setischecked(false)
              );
              createformik.setFieldValue(
                "activeLots",
                response.data.responseData[0].noOfActiveLots
              );
              createformik.setFieldValue(
                "auctionVariant",
                response.data.responseData[0].auctionVariant === 1
                  ? "Batch Wise"
                  : "Batch Split"
              );
              createformik.setFieldValue(
                "saleNo",
                response.data.responseData[0].saleNo
              );
              createformik.setFieldValue(
                "season",
                response.data.responseData[0].season
              );
            })
            .catch((error) => {
              // Handle any errors here
              console.error("Error:", error);
            });
          // setSelectedSaleProgram(saleProgramDetail);

          setIsEdit(true);
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
          <span onClick={() => handleAction("edit")}>
            <EditIcon />
          </span>
          {/* <span
            onClick={() => {
              setOpenDelete(true);
              setActionData({ ...actionData, edit: row.data });
            }}
          >
            <DeleteIcon />
          </span> */}
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
  // useEffect(() => {
  //   setRows(lotSeriesData);
  // }, [lotSeriesData]);
  // console.log(rows,"rows")
  return (
    <>
      <div>
        <ConfirmationModal
          show={openDelete}
          onDelete={handleRemove}
          onHide={() => setOpenDelete(false)}
        />
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
            <Typography>Business Rule List</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={formik.handleSubmit}>
              <div className="row align-items-end">
                <div className="col-lg-2">
                  <label>Select Season</label>
                  <InputGroup>
                    <FormControl
                      disabled={isDisabled}
                      as="select"
                      name="season"
                      value={formik.values.season}
                      onChange={handleChange}
                    >
                      <option value="0">Select Season</option>
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
                  <label>Select Sale No</label>
                  <InputGroup>
                    <FormControl
                      disabled={isDisabled}
                      as="select"
                      name="saleNo"
                      value={formik.values.saleNo}
                      onChange={handleChange}
                    >
                      <option value="0">Select Sale No</option>
                      {saleNo?.length > 0
                        ? saleNo?.map((item, index) => (
                          <option value={item.saleNo} key={index}>
                            {item.saleNo}
                          </option>
                        ))
                        : "No Data"}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.saleNo && formik.touched.saleNo && (
                    <div className="error text-danger">
                      {formik.errors.saleNo}
                    </div>
                  )}
                </div>
                {/* <div className="col-lg-2">
                  <label>Select Group Code</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="groupCode"
                      value={formik.values.groupCode}
                      onChange={handleChange}
                    >
                      <option value="">Please Select</option>

                      {groupCodeListdata?.at(0)?.codes?.map((e) => (
                        <option key={e.groupCode} value={e.groupCode}>
                          {e.groupCode}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                  {formik.errors.groupCode && formik.touched.groupCode && (
                    <div className="error text-danger">
                      {formik.errors.groupCode}
                    </div>
                  )}
                </div> */}

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
                        formik.setFieldValue("groupCode", "");
                        formik.setFieldValue("groupName", "");
                        setRows([]);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="col-lg-2"></div>
              </div>

              <div className="row pt-3">
                <div className="col-12">
                  <div className="BtnGroup">
                    <Button className="SubmitBtn" onClick={handleExportExcel}>
                      Export as Excel
                    </Button>
                  </div>
                </div>
              </div>

              <div
                id={rows?.length > 0 ? "invoiceTable" : "invoiceTable" + "c"}
              >
                <TableComponent
                  columns={kutcha}
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
        {/* <ToastContainer position="top-center" autoClose={3000} /> */}
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
            <Typography>{isEdit === true ? "Edit Business Rule" : "Create Business Rule"}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={createformik.handleSubmit}>
              <div className="row">
                <div className="col-lg-2">
                  <label>Select Season</label>
                  <InputGroup>
                    <FormControl
                      disabled={isDisabled1}
                      as="select"
                      name="season"
                      value={createformik.values.season}
                      onChange={createformik.handleChange}
                    >
                      <option value="">Select Season</option>
                      {generateYearOptions()}
                    </FormControl>
                  </InputGroup>
                  {createformik.errors.season &&
                    createformik.touched.season && (
                      <div className="error text-danger">
                        {createformik.errors.season}
                      </div>
                    )}
                </div>

                <div className="col-lg-2">
                  <label>Select Sale No</label>
                  <InputGroup>
                    <FormControl
                      disabled={isDisabled1}
                      as="select"
                      name="saleNo"
                      value={createformik.values.saleNo}
                      onChange={createformik.handleChange}
                    >
                      <option value="">Select Sale No</option>
                      {createsaleNo?.length > 0
                        ? createsaleNo?.map((item, index) => (
                          <option value={item.saleNo} key={index}>
                            {item.saleNo}
                          </option>
                        ))
                        : "No Data"}
                    </FormControl>
                  </InputGroup>
                  {createformik.errors.saleNo &&
                    createformik.touched.saleNo && (
                      <div className="error text-danger">
                        {createformik.errors.saleNo}
                      </div>
                    )}
                </div>
              </div>
              <div className="row">
                <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                  <FormLabel>Auction Session / Lot Configuration</FormLabel>
                  {/* <FormControl
                    as="input"
                    type="number"
                    id="auctionSession"
                    name="auctionSession"
                    disabled={isDisabled}
                    onChange={createformik.handleChange}
                    value={createformik.values.auctionSession}
                  />
                  {createformik.touched.auctionSession &&
                  createformik.errors.auctionSession ? (
                    <div className="error text-danger">
                      {createformik.errors.auctionSession}
                    </div>
                  ) : null}
                </FormGroup>
                <FormGroup className="col-xl-2 col-lg-2 col-md-4"> */}
                  <Form.Check
                    type="checkbox"
                    id="timeless"
                    name="timeless"
                    disabled="true"
                    label="Dynamic + Timeless"
                    checked={ischecked}
                    onChange={createformik.handleChange}
                  />
                  {createformik.touched.timeless &&
                    createformik.errors.timeless ? (
                    <div className="error text-danger">
                      {createformik.errors.timeless}
                    </div>
                  ) : null}
                </FormGroup>
                <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                  <FormLabel>Auction Variant</FormLabel>
                  <div>
                    <Form.Check
                      type="radio"
                      label="Batch Wise"
                      id="variantOption1"
                      name="auctionVariant"
                      value="Batch Wise"
                      disabled={isDisabled}
                      checked={
                        createformik.values.auctionVariant === "Batch Wise" && isEdit === true ? true : (createformik.values.auctionVariant === "Batch Wise" && isEdit === false) ? true : false
                      }
                      onChange={createformik.handleChange}
                    />
                    <Form.Check
                      type="radio"
                      label="Batch Split"
                      id="variantOption2"
                      name="auctionVariant"
                      value="Batch Split"
                      disabled={isDisabled}
                      checked={
                        createformik.values.auctionVariant === "Batch Split"
                      }
                      onChange={createformik.handleChange}
                    />
                    {/* Add more options as needed */}
                  </div>
                  {createformik.touched.auctionVariant &&
                    createformik.errors.auctionVariant ? (
                    <div className="error text-danger">
                      {createformik.errors.auctionVariant}
                    </div>
                  ) : null}
                </FormGroup>

                <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                  <FormLabel>No Of Active Lots</FormLabel>
                  <FormControl
                    as="input"
                    type="number"
                    id="activeLots"
                    name="activeLots"
                    disabled={isDisabled}
                    onChange={createformik.handleChange}
                    value={createformik.values.activeLots}
                  />
                  {createformik.errors.activeLots &&
                    createformik.touched.activeLots && (
                      <div className="error text-danger">
                        {createformik.errors.activeLots}
                      </div>
                    )}
                </FormGroup>
              </div>
              <div className="BtnGroup">
                {isDisabled === true ? (
                  ""
                ) : isEdit === true ? (
                  <>
                    <Button className="SubmitBtn" type="submit">
                      Update
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="submit" className="SubmitBtn">
                      Submit
                    </Button>
                  </>
                )}
              </div>
            </form>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default BusinessRuleModal;
