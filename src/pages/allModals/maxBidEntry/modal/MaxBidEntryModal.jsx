import React, { useEffect, useState, useRef } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./modal.css";
import TableComponent from "../../../../components/tableComponent/TableComponent";

import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Accordion,
  FormGroup,
  Card,
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
import MaxBidEntryTable from "../MaxBidEntryDataTable/MaxBidEntryTable";
import { readFileAndCheckHeaders } from "../../../../components/common/uploadFile/utils";
import CustomToast from "../../../../components/Toast";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import ExcelJS from "exceljs";
import PrintableTable from "../../../../components/common/PrintableTable";
import axios from "axios";

const currentYear = new Date().getFullYear();

const validationSchema = Yup.object().shape({
  saleNo: Yup.number()
    .min(1, "Please select Sale No")
    .required("Sale No is required"),
  season: Yup.string().required("Seasonis required"),
  saleDate: Yup.string().required("Sale Date is required"),
  // sessionTime: Yup.string()
  //   .required("Session Time is required"),
  // // LotNoStatus: Yup.string().required("Lot Number is required"),
  // // category: Yup.string().required("Category is required"),
  // saleNo: Yup.string().required("Sale No is required"),
  // // season: Yup.string().required("Season is required"),
  // // teaType: Yup.string().required("Tea Type is required"),
  // // grade: Yup.string().required("Grade is required"),
  // // markType: Yup.string().required("Mark Type is required"),
});
const createvalidationSchema = Yup.object().shape({
  groupCode: Yup.string()
    .required("Group Code is required")
    //.min(3, 'Group Code must be at least 3 characters')
    .max(10, "Group Code must not exceed 10 characters"),
  groupName: Yup.string()
    .required("Group Name is required")
    .max(10, "Group Name must not exceed 10 characters"),
});
const initialValues = {
  season: "",
  saleNo: "",
  saleDate: "",
  auctioner: "",
  sessionType: "",
  sessionTime: "",
};
const createinitialValues = {
  groupCode: "",
  groupName: "",
};

const MaxBidEntryModal = ({ setAuctionTypes, modalRight }) => {
  const dispatch = useDispatch();
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode,
    auction,
  } = useAuctionDetail();
  const [lotSeriesDataIds, setLotSeriesData] = useState([]);
  const [initialValues, setInitialValue] = useState({});

  const [isEdit, setIsEdit] = useState(false);
  const [groupCodeListdata, setGroupCodeList] = useState([]);
  const [auctioneer, setAuctioneer] = useState([]);
  //const [saleNumber, setsaleNumber] = useState([]);
  const [groupid, setgroupid] = useState(0);
  const [propertyNameList, setPropertyNameList] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);

  const [saleDates, setSaleDates] = useState([]);
  const [saleProgramdtsId, setSaleProgramdtsId] = useState(0);
  const [auctionType, setAuctionType] = useState(auction);
  const [auctionTypeId, setAuctionTypeId] = useState(null);
  const [baseUrlEng, setBaseUrlEng] = useState(
    auction === "ENGLISH" ? "EnglishAuctionMaxBidEntry" : "MaxBidEntry"
  );

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

    let columnsdata = kutcha
      .filter((ele) => ele.name !== "maxbid")
      .filter((ele) => ele.name !== "interestedtobid");
    // columnsdata.pop();
    const columnName = columnsdata;

    // Assuming data contains the list of data objects like [{saleNo: 5}, ...]
    const data = rows.map((ele) => {
      const { maxBidId, flag, ...rest } = ele;
      return rest;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("MaxBidEntryExcel");

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
        const cellLength = val ? val?.toString().length : 0;
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
    saveAs(blob, "MaxBidEntryExcel.xlsx");
  };

  const handleDownload = () => {
    let documentName = "MaxBidSample.xlsx";

    // Get the current date and time
    let currentDate = new Date();
    let formattedDate = currentDate.toISOString().replace(/[:.]/g, "-"); // Format the date as a string without colons and periods

    // Append the formatted date and time to the document name
    documentName = documentName.replace(/\.xlsx$/, `_${formattedDate}.xlsx`);
    const formattedDates = values.saleDate.replace("T", " ");
    axiosMain
      .post(
        `/preauction/${baseUrlEng}/DownloadMaxBidSampleExcel`,
        {
          saleProgramId: saleProgramdtsId,
          buyerUserId: userId,
          sessionTypeId: formik.values.sessionType,
          saleDate: formattedDates,
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
  // const handleExportExcel = () => {
  //   const data = rows;

  //   let listdata = data.map(item => {
  //     const { maxBidId,flag, ...rest } = item;
  //     return rest; // Returning the item without 'paramToRemove'
  //   });

  //   // Create a new workbook and worksheet
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.json_to_sheet(listdata);

  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "MaxBidEntry");

  //   // Generate Excel file
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const blob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   saveAs(blob, "MaxBidEntry.xlsx");
  // };
  // useEffect(() => {
  //   formik.setFieldValue("saleDate", saleDates?.at(0)?.saleDate);
  // }, [saleDates]);

  useEffect(() => {
    // Dispatch the action when the component mounts
    formik.resetForm();

    setRows([]);

    dispatch(
      fetchLotSeriesRequest({
        season: formik.values.season?.toString(),
        saleNo: formik.values.saleNo,
        pageNumber: 1,
        pageSize: 10,
      })
    );
    dispatch(fetchSaleNumbersRequest(formik.values.season?.toString()));
    dispatch(fetchBuyerGroups(userId));
    dispatch(fetchSessionTypeRequest(auction));

    axiosMain
      .post("/preauction/Common/BindAuctioneerByInvoice", {
        season: formik.values.season,
        saleNo: parseInt(formik.values.saleNo),
        auctionCenterId: auctionCenterId,
      })
      .then((res) => {
        setAuctioneer(res.data.responseData);
      })
      .catch((error) => {});

    // axiosMain
    //   .post("/admin/user/dropdown/getUserDetail", { roleCode})
    //   .then((response) => {
    //     // Handle the API response here
    //     setAuctioneer(response.data.responseData);
    //   })
    //   .catch((error) => {
    //     // Handle errors here
    //   });
    formik.setFieldValue("season", currentYear);
  }, []);

  useEffect(() => {
    // formik.setFieldValue("auctioner", auctioneer?.at(0)?.userId);
    formik.setFieldValue("saleNo", saleNumber?.at(0)?.saleNo);
    // formik.setFieldValue("sessionType", sessionTypes?.at(0)?.sessionTypeId);
    if (sessionType !== undefined && sessionType !== null) {
      console.log(sessionType[0]?.sessionTypeId, "sessionType12345");
      formik.setFieldValue("sessionType", sessionType[0]?.sessionTypeId);
    }
  }, [saleNumber, sessionType]);

  useEffect(() => {
    formik.setFieldValue("auctioner", "0");
  }, [auctioneer]);

  useEffect(() => {
    formik.setFieldValue("saleDate", saleDates?.at(0)?.saleDate);
  }, [saleDates]);

  // useEffect(() => {
  //   setGroupCodeList(groupCodeList)
  // }, [groupCodeList])
  const savetabledata = () => {
    console.log(rows, "samardas");
    let savedata = [];

    rows.map((items) => {
      const Newdatas = {
        SaleProgramId: parseInt(items.SaleProgramId),
        auctionCenterId: auctionCenterId,
        kutchaCatalogId: parseInt(items.auctionCatalogId),
        sessionTypeId: parseInt(items.sessionTypeId),
        teaTypeId: parseInt(items.teaTypeId),
        categoryId: parseInt(items.categoryId),
        markId: parseInt(items.markId),
        gradeId: parseInt(items.gradeId),
        invoiceId: parseInt(items.invoiceId),
        auctionCatalogId: parseInt(items.auctionCatalogId),
        interestedToBid: 1,
        maxBid: 120,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
        buyerUserId: userId,
        status: parseInt(items.status),
        LotNo: items.LotNo,
      };
      savedata.push(Newdatas);
    });
    axiosMain
      .post(`/preauction/${baseUrlEng}/UpdateMaxBidEntry`, savedata)
      .then((response) => {
        // Handle the successful response here
        console.log("Response:", response.data);
      })

      .catch((error) => {
        // Handle any errors here
        console.error("Error:", error);
      });
  };
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
  const formik = useFormik({
    initialValues: initialValues,

    validationSchema,
    onSubmit: (values) => {
      let datatime;
      let sttime;
      let endtime;
      let stypname;
      if (auctionType === "ENGLISH") {
        // debugger
        if (parseInt(values.sessionType) === 3) {
          stypname = "Normal";
        } else {
          stypname = "Supplement";
        }
      } else {
        if (parseInt(values.sessionType) === 1) {
          stypname = "Normal";
        } else {
          stypname = "Price Rediscovery Session";
        }
        debugger;
      }

      if (values.sessionTime !== "" && values.sessionTime !== undefined) {
        datatime = values.sessionTime.split("-");
        sttime = datatime[0].replace(/\s/g, "");
        endtime = datatime[1].replace(/\s/g, "");
      } else {
        sttime = null;
        endtime = null;
      }
      const formattedDate = values.saleDate.replace("T", " ");

      const formData = {
        season: values.season.toString(),
        saleNo: values.saleNo !== "" ? parseInt(values.saleNo) : 0,
        saleDate: formattedDate, ///values.saleDate,
        auctioneerId: parseInt(values.auctioner), //auctioner//values.auctioner !== "" ? parseInt(values.auctioner) : 0,
        // sessionTypeId:
        //   values.sessionType !== "" ? parseInt(values.sessionType) : 0,
        sessionTypeName: stypname,
        sessionStartTime: sttime,
        sessionEndTime: endtime,
        buyerUserId: parseInt(userId),
        auctionCenterId: parseInt(auctionCenterId),
        auctionTypeMasterId: auctionTypeId,
      };
      let listdata = [];
      axiosMain
        .post(`/preauction/${baseUrlEng}/GetMaxBidEntryList`, formData)
        // axios
        //   .post(`http://192.168.101.178:5080/preauction/${baseUrlEng}/GetMaxBidEntryList`, formData)
        .then((response) => {
          if (response.data.statusCode === 200) {
            // Handle the successful response here
            console.log("Response:", response.data);
            if (response.data.responseData) {
              listdata = response.data.responseData.map((item, index) => {
                // return { ...item, interestedtobid: "0", maxbid: 0 };
                return { ...item };
              });

              listdata = response.data.responseData.map((item, index) => {
                if (item.status === 0) {
                  return { ...item, status: "Pending" };
                } else {
                  return { ...item, status: "Submitted" };
                }
              });
            }
            setRows(listdata);
          } else {
            CustomToast.warning(response.data.message);
          }
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error:", error);
        });

      console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
    },
  });

  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season?.toString();
    setRows([]);

    // API endpoint URL
    const apiUrl = `/preauction/AuctionSession/GetSaleDateAndTeaType`;

    // Making the POST request using Axios
    if (
      saleNo !== "" &&
      season !== "" &&
      saleNo !== undefined &&
      season !== undefined
    ) {
      //saleprogramme details
      axiosMain
        .post("/preauction/Common/GetSaleProgramDetailBySaleNo", {
          season: formik.values.season?.toString(),
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          setAuctionTypeId(res.data?.responseData?.at(0)?.auctionTypeMasterId);
          setAuctionType(res.data?.responseData?.at(0)?.auctionTypeCode);
          setAuctionTypes(res.data?.responseData?.at(0)?.auctionTypeCode);

          setBaseUrlEng(
            res.data?.responseData?.at(0)?.auctionTypeCode === "ENGLISH"
              ? "EnglishAuctionMaxBidEntry"
              : "MaxBidEntry"
          );
          setSaleProgramdtsId(res.data.responseData[0].SaleProgramId);
          let url =
            res.data?.responseData?.at(0)?.auctionTypeCode === "ENGLISH"
              ? "EnglishAuctionSession"
              : "AuctionSession";
          dispatch(
            fetchSessionTypeRequest(
              res.data?.responseData?.at(0)?.auctionTypeCode
            )
          );

          axiosMain
            .post(`/preauction/${url}/GetSaleDateAndTeaType`, {
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
        })
        .catch((err) => console.log(err));

      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo, formik.values.season]);
  //bind session time
  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season?.toString();
    const saledate = formik.values.saleDate;
    if (
      saleNo !== "" &&
      season !== "" &&
      saleNo !== undefined &&
      season !== undefined &&
      saledate !== undefined &&
      saledate !== ""
    ) {
      // axiosMain
      //   .post("/preauction/Common/BindSessionTime", dataparam)
      //   .then((response) => {
      //     console.log(response, "bind session time");
      //     setSessionTime(response.data.responseData);
      //   })
      //   .catch((error) => {
      //     // Handle errors here
      //   });
    }
  }, [formik.values.saleNo, formik.values.season, formik.values.saleDate]);

  useEffect(() => {
    if (formik.values.saleNo !== "" && formik.values.season !== "") {
      axiosMain
        .post("/preauction/Common/BindAuctioneerByInvoice", {
          season: formik.values.season?.toString(),
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          setAuctioneer(res.data.responseData);
        })
        .catch((error) => {});
    }
  }, [formik.values.saleNo, formik.values.season]);

  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season?.toString();
    const saledate = formik.values.saleDate;
    const sessionType = formik.values.sessionType;
    if (
      saleNo !== null &&
      season !== null &&
      saleNo !== undefined &&
      season !== undefined &&
      saledate !== null &&
      saledate !== undefined
    ) {
      let sstype = "";
      if (parseInt(sessionType) === 1) {
        sstype = "Normal";
      } else {
        sstype = "Price Rediscovery Session";
      }
      const dataparam = {
        season: season,
        saleNo: parseInt(saleNo),
        auctionDate: saledate,
        auctionCenterId: auctionCenterId,
        // sessionTypeId: parseInt(sessionType),
        sessionTypeName: sstype,
      };
      axiosMain
        .post("/preauction/Common/BindSessionTime", dataparam)
        .then((response) => {
          console.log(response, "bind session time");
          setSessionTime(response.data.responseData);
        })
        .catch((error) => {
          // Handle errors here
        });
    }
  }, [formik.values.sessionType, formik.values.saleDate, formik.values.saleNo]);

  useEffect(() => {
    const season = formik.values.season?.toString();
    if ((season !== "") & (season !== undefined)) {
      dispatch(fetchSaleNumbersRequest(formik.values.season));
    }
  }, [formik.values.season]);

  //for create formik

  const createformik = useFormik({
    initialValues: createinitialValues,

    validationSchema: createvalidationSchema,
    onSubmit: (values) => {
      let url = "";
      let formData = [];

      if (isEdit === false) {
        formData = {
          groupName: values.groupName,
          groupCode: values.groupCode,
          createdBy: userId,
          buyerUserId: userId,
        };
        url = "/preauction/GroupMaster/CreateGroupMaster";
      } else {
        formData = {
          groupId: groupid,
          groupName: values.groupName,
          groupCode: values.groupCode,
          updatedBy: userId,
          buyerUserId: userId,
        };
        url = "/preauction/GroupMaster/UpdateGroupMaster";
      }

      axiosMain
        .post(url, formData)
        .then((response) => {
          // Handle the successful response here
          console.log("Response:", response.data);
          if (response.data.statusCode == 200) {
            CustomToast.success(response.data.message);
            bindGroupsList();
            createformik.resetForm();
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
  const [uploadrows, setuploadRows] = useState([]);
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
  const uploadtablecolumn =
    auctionType === "ENGLISH"
      ? [
          { name: "LotNo", title: "Lot No" },
          { name: "sharingQty", title: "SQ (Sharing Qty.)" },
          { name: "buyingQty", title: "BQ@HBP" },
          { name: "minAcceptableQty", title: "MAQ@HBP" },
          { name: "AutoBidLimit", title: "Auto Bid Limit" },
          { name: "LimitPrice", title: "Limit Price" },
        ]
      : [
          { name: "LotNo", title: "Lot No" },
          { name: "interestedToBid", title: "Interested to Bid(Y/N)" },
          { name: "maxBid", title: "Maxbid price" },
          { name: "sessionTypeName", title: "Session Type" },
        ];

  const kutcha = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },
    { name: "LotNo", title: "Lot Noo" },
    { name: "teaTypeName", title: "Tea Type" },
    { name: "categoryName", title: "Category" },

    { name: "markName", title: "Mark" },
    { name: "gradeName", title: "Grade" },
    { name: "invoiceNo", title: "Invoice No" },
    //{ name: "totalPackages", title: "Total Packeges" },
    { name: "basePrice", title: "Base Price for Normal Auction" },
    { name: "basePrice", title: "Base Price for PRS Auction" },
    { name: "priceIncrement", title: "Price Increment" },
    { name: "LSP_SP", title: "LSP/SP" },
    // {name: "interestedtobid", title: "Interested To BID",type: "select",
    // options: [
    //   { label: "N", value: "N" },
    //   { label: "Y", value: "Y" },
    // ],
    // required: false,
    // className: "FormGroup"},
    {
      name: "interestedToBid",
      title: "Interested To Bid",
      getCellValue: ({ ...row }) => <DdlArea data={row} />,
    },
    {
      name: "maxBid",
      title: "Max Bid",
      getCellValue: ({ value, setValue, isDisabled, ...row }) => (
        <InputArea
          // value={value}
          value={row.maxBid}
          onChange={setValue} // Pass a function to update the value
          isDisabled={isDisabled}
          row={row}
        />
      ),
    },
    //{name: "maxbid", title: "Max Bid",getCellValue: ({ ...row }) => <InputArea data={row} />,},
    { name: "invoiceNo", title: "Invoice No" },
    { name: "createdBy", title: "Created By" },
    { name: "lastModifiedBy", title: "last Modified By" },
    { name: "sessionTypeName", title: "Session Type" },
    { name: "status", title: "Status" },
    // {
    //   name: "action",
    //   title: "Action",
    //   getCellValue: ({ ...row }) => <ActionArea data={row} />,
    // },
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

    createformik.resetForm();
    setIsDisabled(false);
    if (panel === "panel2") {
      //   formik.resetForm()
      // formik.setFieldValue("groupCode", "")
      // formik.setFieldValue("groupName", "")
      setRows([]);
    }
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
  const ActionArea = (row) => {
    function handleAction(action) {
      setExpandedTab("panel2");

      switch (action) {
        case "view": {
          const lotNo = row.data.groupId;

          //setgroupid(lotNo);
          axiosMain
            .post("/preauction/GroupMaster/GetGroupMasterById?groupId=" + lotNo)
            .then((response) => {
              // Handle the successful response here
              console.log("EditResponse:", response.data.responseData[0]);

              createformik.setFieldValue(
                "groupName",
                response.data.responseData[0].groupName
              );
              createformik.setFieldValue(
                "groupCode",
                response.data.responseData[0].groupCode
              );
            })
            .catch((error) => {
              // Handle any errors here
              console.error("Error:", error);
            });
          setIsDisabled(true);
          break;
        }
        case "edit": {
          setIsDisabled(false);
          const lotNo = row.data.groupId;

          setgroupid(lotNo);
          axiosMain
            .post("/preauction/GroupMaster/GetGroupMasterById?groupId=" + lotNo)
            .then((response) => {
              // Handle the successful response here
              console.log("EditResponse:", response.data.responseData[0]);

              createformik.setFieldValue(
                "groupName",
                response.data.responseData[0].groupName
              );
              createformik.setFieldValue(
                "groupCode",
                response.data.responseData[0].groupCode
              );
            })
            .catch((error) => {
              // Handle any errors here
              console.error("Error:", error);
            });
          // setSelectedSaleProgram(saleProgramDetail);
          //setIsDisabled(false);
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

  const InputArea = ({ value, onChange, isDisabled, row }) => {
    const handleChange = (event) => {
      if (event.target.value !== "") {
        row.maxbid = parseInt(event.target.value);
      }
    };
    if (row.interestedtobid === "0") {
      //isDisabled=true;
    } else isDisabled = false;
    return (
      <FormGroup>
        <FormControl
          type="number"
          id="maxbid"
          name="maxbid"
          disabled={isDisabled}
          onChange={handleChange}
          value={value}
        />
      </FormGroup>
    );
  };

  const DdlArea = (row) => {
    const [selectedValue, setSelectedValue] = useState(0);
    setSelectedValue(row.interestedToBid);
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
      row.data.interestedtobid = event.target.value;
      // You can also update your 'data' object here if needed
      // data.inbid = event.target.value;
      console.log(row, "row all");
    };
    return (
      <>
        <InputGroup>
          <FormControl
            as="select"
            name="inbid"
            // value="inbid"
            value={selectedValue}
            onChange={handleChange}
            //onChange={handleChange}
          >
            <option value={0}>N</option>
            <option value={1}>Y</option>
          </FormControl>
        </InputGroup>
      </>
    );
  };
  useEffect(() => {
    setSessionType(sessionType);
  }, [sessionType]);

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
  // console.log(rows,"rows")

  //Export button

  const propertyNames = [
    {
      name: "lotNo",
      title: "Lot No",
    },
    { name: "interestedToBid", title: "Interested To Bid" },
    {
      name: "maxBidPrice",
      title: "Max Bid Price",
    },
    { name: "sessionType", title: "Session Type" },
  ];
  function fixKeyNames(obj) {
    const newObj = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        let fixedKey = key.replace("/", "_"); // Replace '/' with '_'
        fixedKey = fixedKey.replace(".No", "No");
        newObj[fixedKey] = obj[key];
      }
    }

    return newObj;
  }
  function findDuplicateInvoiceNumbers(arrayOfObjects) {
    const invoiceNumbers = new Map();
    const duplicateInvoices = [];

    arrayOfObjects.forEach((obj) => {
      if (invoiceNumbers.has(obj.LotNo)) {
        duplicateInvoices.push(obj.LotNo);
      }
      invoiceNumbers.set(obj.LotNo, true);
    });

    return duplicateInvoices;
  }
  function requiredvalidation(arrayOfObjects) {
    arrayOfObjects.forEach((obj) => {
      if (obj.LotNo !== "" && obj.LotNo !== undefined) {
        if (
          (obj.interestedToBid === "" && obj.interestedToBid === undefined) ||
          (obj.maxBid === "" && obj.maxBid === undefined)
        ) {
          return 0;
        } else return 1;
      } else return 1;
    });
  }

  const handleData = async (uploadedData) => {
    try {
      console.log(invoiceData, "chk");

      const updatedFileData = [];
      // if (fileData.length > 0) {
      uploadedData.map(({ fileName, data }, index) => {
        if (data && data.length > 0) {
          const filteredData = data.filter((obj) => {
            // Check if any key in the object has a defined value
            return Object.values(obj).some((value) => value !== undefined);
          });
          console.log(data, "datadata");

          const dataList = filteredData.map((ele) => {
            if (auctionType === "ENGLISH") {
              const {
                lotno,
                sharingQty,
                buyingQty,
                minAcceptableQty,
                autoBidLimit,
                limitPrice,
              } = fixKeyNames(ele);
              return {
                auctionCenterId: auctionCenterId,
                LotNo: lotno?.toString(),
                sharingQty:
                  parseInt(sharingQty) === null ? 0 : parseInt(sharingQty),
                buyingQty:
                  buyingQty !== "" && buyingQty !== undefined
                    ? parseInt(buyingQty)
                    : 0,
                minAcceptableQty:
                  parseInt(minAcceptableQty) === null
                    ? 0
                    : parseInt(minAcceptableQty),
                AutoBidLimit:
                  parseFloat(autoBidLimit) === null
                    ? 0
                    : parseFloat(autoBidLimit),
                // autoBidLimit,
                LimitPrice:
                  // limitPrice,
                  parseFloat(limitPrice) === null ? 0 : parseFloat(limitPrice),
                //sessiontype:sessionType?.toString(),
                isActive: true,
                createdBy: userId,
                updatedBy: userId,
                buyerUserId: userId,
                status: 1,
                sessionTypeName: sessionType,
              };
            } else {
              const { lotno, interestedToBid, maxbidprice, sessionType } =
                fixKeyNames(ele);
              return {
                auctionCenterId: auctionCenterId,
                LotNo: lotno?.toString(),
                interestedToBid: interestedToBid?.toString() === "Y" ? 1 : 0,
                maxBid:
                  maxbidprice !== "" && maxbidprice !== undefined
                    ? parseInt(maxbidprice)
                    : 0,
                //sessiontype:sessionType?.toString(),
                isActive: true,
                createdBy: userId,
                updatedBy: userId,
                buyerUserId: userId,
                status: 1,
                sessionTypeName: sessionType,
              };
            }
          });

          updatedFileData.push(dataList);
          // updatedFileData.push(filteredData);
        } else {
          // Handle the case where the data array is empty
          CustomToast.error(`No data found in file '${fileName}'`);
        }
      });
      // } else {
      //   CustomToast.error(`No file found in fields`);
      // }
      const mergedArray = updatedFileData.reduce((result, currentArray) => {
        return result.concat(currentArray);
      }, []);
      console.log(updatedFileData?.at(0), "updatedFileData");

      //allData(mergedArray);
      // if (invoiceData?.length > 0) {
      //   setInvoiceData([...invoiceData, ...dataList]);
      // } else {
      setInvoiceData([...mergedArray]);
      //FOR SHOWING TABLE DATA
      // const uploadmynewrow = [...invoiceData, ...mergedArray];
      const uploadmynewrow = [...mergedArray];
      //AFTER SET INTERESTED TO BID Y N
      const newrowsetinterestedtobid = uploadmynewrow.map((item) => {
        return {
          ...item,
          interestedToBid: item.interestedToBid === 1 ? "Yes" : "No",
        };
      });

      setuploadRows(newrowsetinterestedtobid);

      //}
      console.log(...mergedArray, "mergedArraymergedArray");
      console.log(invoiceData, "invoiceDatainvoiceData");
    } catch (error) {
      CustomToast.error(error);
    }
    // validation(uploadedData);
  };
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_EXTENSIONS = [".xls", ".xlsx"];

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileClear = () => {
    fileInputRef.current.value = "";
    setuploadRows([]);
    setInvoiceData([]);
  };
  const handleFileUpload = (e) => {
    const files = e.target.files;
    setInvoiceData([]);
    setuploadRows([]);
    for (const file of files) {
      const fileSize = file.size;
      const fileName = file.name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );
      setPropertyNameList(propertyNames);
      if (!ALLOWED_EXTENSIONS.includes("." + fileExtension.toLowerCase())) {
        CustomToast.error(
          `File '${fileName}' is not allowed. Only Excel files are accepted.`
        );
      } else if (fileSize > MAX_FILE_SIZE) {
        CustomToast.error(
          `File '${fileName}' exceeds the maximum allowed size of 10 MB.`
        );
      } else {
        const promises = Array.from(files).map((file) =>
          readFileAndCheckHeaders(file)
        );

        Promise.allSettled(promises).then((results) => {
          const fulfilledResults = results.filter(
            (result) => result.status === "fulfilled"
          );
          const dataFromFiles = fulfilledResults.map((result) => result.value);

          handleData(dataFromFiles);
        });
      }
    }
  };

  return (
    <>
      <div>
        <ConfirmationModal
          show={openDelete}
          onDelete={handleRemove}
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
              <Typography>
                {auctionType === "ENGLISH"
                  ? "Offline Bid Entry "
                  : "Max Bid Entry "}
                List
              </Typography>
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
                        <option value="">Please Select Season</option>
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
                        <option value="0">Please Select Sale No</option>
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
                    <label>Select Sale Date.</label>
                    <InputGroup>
                      <FormControl
                        as="select"
                        name="saleDate"
                        value={formik.values.saleDate}
                        onChange={handleChange}
                      >
                        <option value="">Please Select Sale Date</option>
                        {saleDates?.map((e) => (
                          <option key={e.saleDate} value={e.saleDate}>
                            {e.saleDate}
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
                    <label>Select Auctioneer.</label>
                    <InputGroup>
                      <FormControl
                        as="select"
                        name="auctioner"
                        value={formik.values.auctioner}
                        onChange={handleChange}
                      >
                        <option value="0">Select Auctioneer</option>

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
                    </InputGroup>
                    {formik.errors.auctioner && formik.touched.auctioner && (
                      <div className="error text-danger">
                        {formik.errors.auctioner}
                      </div>
                    )}
                  </div>

                  <div className="col-lg-2">
                    <label>Select Session Type.</label>
                    <InputGroup>
                      <FormControl
                        as="select"
                        name="sessionType"
                        value={formik.values.sessionType}
                        onChange={handleChange}
                      >
                        {/* <option value="0">Select Session Type</option> */}
                        {sessionTypes?.length > 0
                          ? sessionTypes?.map((item, index) => (
                              <option value={item?.sessionTypeId}>
                                {item.sessionTypeName}
                              </option>
                            ))
                          : "No Data"}
                      </FormControl>
                    </InputGroup>
                    {formik.errors.sessionType &&
                      formik.touched.sessionType && (
                        <div className="error text-danger">
                          {formik.errors.sessionType}
                        </div>
                      )}
                  </div>

                  <div className="col-lg-2">
                    <label>Select Session Time.</label>
                    <InputGroup>
                      <FormControl
                        as="select"
                        name="sessionTime"
                        value={formik.values.sessionTime}
                        onChange={handleChange}
                      >
                        <option value="">Select Session Time</option>
                        {sessionTime?.length > 0
                          ? sessionTime?.map((item, index) => (
                              <option value={item?.SessionTime}>
                                {item.SessionTime}
                              </option>
                            ))
                          : "No Data"}
                      </FormControl>
                    </InputGroup>
                    {formik.errors.sessionTime &&
                      formik.touched.sessionTime && (
                        <div className="error text-danger">
                          {formik.errors.sessionTime}
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
                          formik.setFieldValue("auctioner", "0");
                          formik.setFieldValue("saleNo", "0");
                          formik.setFieldValue("sessionType", "1");
                          formik.setFieldValue("season", currentYear);
                          formik.setFieldValue("sessionTime", "");
                          formik.setFieldValue("saleDate", "");
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
                      {modalRight?.includes("9") && (
                        <Button
                          className="SubmitBtn"
                          onClick={handleExportExcel}
                        >
                          Export as Excel
                        </Button>
                      )}
                      {modalRight?.includes("7") && (
                        <button
                          type="button"
                          className="btn SubmitBtn me-2"
                          onClick={handleDownload}
                        >
                          Download Sample
                        </button>
                      )}
                      {modalRight?.includes("8") && (
                        <button
                          type="button"
                          onClick={() =>
                            PrintableTable(kutcha, rows?.length > 0 ? rows : [])
                          }
                          className="SubmitBtn btn"
                        >
                          Export as Pdf
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* <div
                  id={rows?.length > 0 ? "invoiceTable" : "invoiceTable" + "c"}
                >
                  {/* <TableComponent
                  columns={kutcha}
                  rows={rows?.length > 0 ? rows : []}
                  setRows={setRows}
                  dragdrop={false}
                  fixedColumnsOn={false}
                  resizeingCol={false}
                  selectionCol={true}
                  sorting={true}
                /> 
                </div> */}
                <MaxBidEntryTable
                  auctionType={auctionType}
                  rows={rows}
                  setRows={setRows}
                  modalRight={modalRight}
                />
              </form>
            </AccordionDetails>
          </Accordion>
        )}
        {/* <ToastContainer position="top-center" autoClose={3000} /> */}
        {modalRight?.includes("1") && (
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
              <Typography>
                Upload{" "}
                {auctionType === "ENGLISH"
                  ? "Offline Bid Entry "
                  : "Max Bid Entry"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Card className="mt-3 FileUploadBox">
                <form onSubmit={createformik.handleSubmit}>
                  <div class="browse-file FileUpload px-0">
                    {/* <FileUpload
              id="fileInput"
              handleData={handleData}
              readFileAndCheckHeaders={readFileAndCheckHeaders}
            /> */}
                    <button className="SubmitBtn" onClick={handleButtonClick}>
                      Browse
                    </button>
                    <input
                      type="file"
                      id="file-upload"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept=".xls,.xlsx"
                    />

                    <Button
                      className="SubmitBtn creat-btn"
                      type="button"
                      onClick={() => {
                        if (invoiceData.length > 0) {
                          const toastMessages = invoiceData.map(
                            (obj, index) => {
                              let rowNo = index + 1;

                              const duplicates =
                                findDuplicateInvoiceNumbers(invoiceData);
                              //   const isValid= requiredvalidation(invoiceData);
                              // if(isValid===0)
                              // {
                              //   CustomToast.error(
                              //    "Please Choose Max Bid And Interested To Bid!")
                              // }

                              if (duplicates.length > 0) {
                                CustomToast.error(
                                  "Lot No" +
                                    " " +
                                    duplicates.join(", ") +
                                    " " +
                                    "is already exist"
                                );
                                return false;
                              } else {
                                return true;
                              }
                            }
                          );

                          const allTrue = toastMessages.every(
                            (element) => element === true
                          );
                          console.log(allTrue, "allTrueallTrueallTrueallTrue");

                          if (allTrue) {
                            axiosMain
                              .post(
                                `/preauction/${baseUrlEng}/UploadMaxBidEntry`,
                                invoiceData
                              )
                              .then((response) => {
                                if (response.data.statusCode === 200) {
                                  CustomToast.success(response.data.message);
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = ""; // Reset the input field value to clear any selected file
                                  }
                                  handleAccordionChange("panel1");
                                  //setInvoiceData([]);
                                } else if (response.data.statusCode === 204) {
                                  //else
                                  CustomToast.warning(response.data.message);
                                } else CustomToast.error(response.data.message);
                                // Handle the response data or success
                              })

                              .catch((error) => {
                                CustomToast.error("API call failed:", error);
                                // Handle errors here
                              });

                            // console.log(invoiceData, "datadatadata");
                          } else {
                            console.log("Not all elements are true.");
                          }

                          console.log(toastMessages, "toastMessages");
                        } else {
                          CustomToast.error(
                            `Please Upload ${
                              auctionType === "ENGLISH"
                                ? "Offline Bid Entry"
                                : "Max Bid Entry"
                            } `
                          );
                        }
                      }}
                    >
                      Create
                    </Button>

                    {/* showing upload table data */}

                    {/* <a
        href="/maxbidentryformat.xlsx" 
        download="MaxBidEntryFormat.xlsx"
      >
        Download Excel
      </a> */}
                  </div>
                </form>
                {invoiceData.length > 0 ? (
                  <>
                    <div className="col-auto">
                      <div className="BtnGroup">
                        <button
                          className="SubmitBtn creat-btn"
                          onClick={handleFileClear}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div>
                      <TableComponent
                        columns={uploadtablecolumn}
                        rows={uploadrows?.length > 0 ? uploadrows : []}
                        setRows={setuploadRows}
                        dragdrop={false}
                        fixedColumnsOn={false}
                        resizeingCol={false}
                        selectionCol={true}
                        sorting={true}
                      />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </Card>
            </AccordionDetails>
          </Accordion>
        )}
      </div>
      {/* // <ToastContainer /> */}
    </>
  );
};

export default MaxBidEntryModal;
