import React, { useEffect, useState, useRef } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";

import { FormControl, InputGroup } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  SelectionState,
  PagingState,
  IntegratedPaging,
  IntegratedSelection,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  PagingPanel,
} from "@devexpress/dx-react-grid-bootstrap4";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";
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
import DeleteConfirmationModal from "../../../../components/common/DeleteConfirmationModal";

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
  getAllCategoriesAction,
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
import { readFileAndCheckHeaders } from "../../../../components/common/uploadFile/utils";
import CustomToast from "../../../../components/Toast";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import PrintableTable from "../../../../components/common/PrintableTable";
import PrintInvoice from "../../../../components/common/Print/print";
import Modals from "../../../../components/common/Modal";

const curruntYear = new Date()?.getFullYear()?.toString();

const validationSchema = Yup.object().shape({
  saleNo: Yup.number()
    .min(1, "Please select Sale No")
    .required("Sale No is required"),
  season: Yup.string().required("Season is required"),
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
const validationSchemaNew = Yup.object().shape({
  reservePrice: Yup.number()
    .min(1, "Please Enter Reserve price greater than 0")
    .required("Reserve price is required"),
  // season: Yup.string()
  //   .required("Season is required"),
  // saleDate: Yup.string()
  //   .required("Sale Date is required"),
});
const createvalidationSchema = Yup.object().shape({
  // groupCode: Yup.string()
  //   .required('Group Code is required')
  //   //.min(3, 'Group Code must be at least 3 characters')
  //   .max(10, 'Group Code must not exceed 10 characters'),
  // groupName: Yup.string()
  //   .required('Group Name is required')
  //   .max(10, 'Group Name must not exceed 10 characters'),
});
const validationSchema1 = Yup.object().shape({});
const initialValues = {
  season: "",
  saleNo: "",
  saleDate: "",
  auctioner: "",
  sessionType: "",
  sessionTime: "",
};
const initialValues1 = {};
const createinitialValues = {
  groupCode: "",
  groupName: "",
};
const createinitialValuesNew = {
  srNo: "",
  markName: "",
  basePrice: 0,

  reservePrice: 0,
};

const PrsAuctionCatalogFormModal = ({ modalRight }) => {
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
  const [initialValues1, setInitialValue1] = useState({});
  const [ischecked, setischecked] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupCodeListdata, setGroupCodeList] = useState([]);
  const [auctioneer, setAuctioneer] = useState([]);
  //const [saleNumber, setsaleNumber] = useState([]);
  const [groupid, setgroupid] = useState(0);
  const [propertyNameList, setPropertyNameList] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [searchCategoryCode, setSearchCategoryCode] = useState("");
  const [saleDates, setSaleDates] = useState([]);
  const [auctioncatalogid, setauctioncatalogid] = useState(0);
  const [saleprogramid, setSaleProgramid] = useState(null);
  const [baseUrlEng, setbaseUrlEng] = useState(auction);

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
  const [printrow, setprintrow] = useState([]);
  const [openPrintModel, setopenPrintModel] = useState(false);
  const [columndata, setcolumndata] = useState([]);

  const [openPrintMyModel, setopenPrintMyModel] = useState(false);
  const [columnMydata, setcolumnMydata] = useState([]);
  const [printMyrow, setprintMyrow] = useState([]);
  const searchData = useSelector(
    (state) => state?.kutchaCatalogueReducer?.data?.responseData
  );

  const allLot = [
    {
      id: 1,
      // lotNo: "Lot Number 123",
      // invoiceNo: "INV-curruntYear-001",
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
  const handleDownload = () => {
    let documentName = "PrsAuctionCatalog.xlsx";

    axiosMain
      .post(
        "/preauction/AuctionCatalog/DownloadAuctionCatalogReportExcel?role=" +
        roleCode,
        {
          SaleProgramId: saleprogramid,
          auctionCenterId: auctionCenterId,
          userId: 0,
          Type: "PRS",
          auctionDate: formik.values.saleDate,
          auctioneerId:
            formik.values.auctioner === ""
              ? 0
              : parseInt(formik.values.auctioner),
          teaTypeId: parseInt(formik.values.teaType),
          categoryId:
            formik.values.category == "" ? 0 : parseInt(formik.values.category),
          sessionStartTime:
            formik.values.sessionTime?.split(" - ") === undefined
              ? formik.values.sessionTime?.split(" - ")?.at(0)
              : "",
          sessionEndTime:
            formik.values.sessionTime?.split(" - ") === undefined
              ? formik.values.sessionTime?.split(" - ")?.at(1)
              : "",
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
  const handleExportToPdfCatalogList = () => {
    var newdat = rows?.map(obj => {
      for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
          obj[key] = "";
        }
      }
      return obj;
    });
    var allcoulmn = kutcha;

    // var datas = newdat.map((item) => ({ ...item, season: formik.values.season, saleNo: formik.values.saleNo }))
    // setprintrow(myCatalogRows);
    // console.log(formik);
    // const objectToRemove = "action";

    // // Find the index of the object with the specified name
    // const indexToRemove = allcoulmn.findIndex(item => item.name === objectToRemove);

    // // Check if the index is found and remove the object
    // if (indexToRemove !== -1) {
    //   allcoulmn.splice(indexToRemove, 1);
    // }
    allcoulmn.push(
      { name: "season", title: "season" },
      { name: "saleNo", title: "Sale No" },
      { name: "auctionerDate", title: "auctionerDate" },
      { name: "auctioner", title: "auctioner" },
      { name: "sessiontime", title: "Session Time" }
    );
    let AuctionerselectedText;
    if (formik.values.auctioner === 0 || formik.values.auctioner === "0") {
      AuctionerselectedText = "All";
    }
    else
      AuctionerselectedText = auctioneer.filter((item) => item.userId === parseInt(formik.values.auctioner))?.at(0).userCode;

    const newrow = newdat.map((itm) => ({
      ...itm, season: formik.values.season, saleNo: formik.values.saleNo,
      auctionerDate: formik.values.saleDate, auctioner: AuctionerselectedText, sessiontime: formik.values.sessionTime
    }));
    setprintrow(newrow);
    setcolumndata(allcoulmn);

    setopenPrintModel(true);
  };
  const handleExportToPdfMyCatalogList = () => {
    var newdat = rows1?.map(obj => {
      for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
          obj[key] = "";
        }
      }
      return obj;
    });
    var allcoulmn = kutcha1;

    // var datas = newdat.map((item) => ({ ...item, season: formik.values.season, saleNo: formik.values.saleNo }))
    // setprintrow(myCatalogRows);
    // console.log(formik);
    const objectToRemove = "action";

    // Find the index of the object with the specified name
    const indexToRemove = allcoulmn.findIndex(item => item.name === objectToRemove);

    // Check if the index is found and remove the object
    if (indexToRemove !== -1) {
      allcoulmn.splice(indexToRemove, 1);
    }
    allcoulmn.push(
      { name: "season", title: "season" },
      { name: "saleNo", title: "Sale No" },
      { name: "auctionerDate", title: "auctionerDate" },
      { name: "auctioner", title: "auctioner" },
      { name: "sessiontime", title: "Session Time" },
    );
    let AuctionerselectedText;
    if (formik.values.auctioner === 0 || formik.values.auctioner === "0") {
      AuctionerselectedText = "All";
    }
    else
      AuctionerselectedText = auctioneer.filter((item) => item.userId === parseInt(formik.values.auctioner))?.at(0).userCode;

    const newrow = newdat.map((itm) => ({
      ...itm, season: formik.values.season, saleNo: formik.values.saleNo,
      auctionerDate: formik.values.saleDate, auctioner: AuctionerselectedText, sessiontime: formik.values.sessionTime
    }));
    setprintMyrow(newrow);
    setcolumnMydata(allcoulmn);

    setopenPrintMyModel(true);
  };
  const handleExportExcel = async () => {
    // Assuming columnName contains the list of objects with "name" and "title"
    let columnsdata = kutcha;
    columnsdata.pop();
    const columnName = columnsdata;

    // Assuming data contains the list of data objects like [{saleNo: 5}, ...]
    const data = rows;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PrsAuctionCatalog");

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
    data?.forEach((row) => {
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
    saveAs(blob, "PrsAuctionCatalog.xlsx");
  };

  // useEffect(() => {
  //   formik.setFieldValue("saleDate", saleDates?.at(0)?.saleDate);
  // }, [saleDates]);

  useEffect(() => {
    formik.resetForm();
    formik.setFieldValue("auctioner", "0");
    formik.setFieldValue("saleNo", "0");
    formik.setFieldValue("teaType", "0");
    formik.setFieldValue("auctioner", "0");
    formik.setFieldValue("category", "0");
    formik.setFieldValue("season", curruntYear);
    formik.setFieldValue("sessionTime", "");
    formik.setFieldValue("saleDate", "");
    setRows([]);
    setRows1([]);

    dispatch(
      fetchLotSeriesRequest({
        season: curruntYear,
        saleNo: 3,
        pageNumber: 1,
        pageSize: 10,
      })
    );
    dispatch(fetchSaleNumbersRequest(parseInt(curruntYear)));
    dispatch(fetchBuyerGroups(userId));
    dispatch(fetchSessionTypeRequest());
    dispatch(teaTypeAction({ auctionCenterId }));
    dispatch(
      fetchCategoryRequest({
        teaTypeId: parseInt(formik.values.teaType),
        auctionCenterId,
      })
    );
    axiosMain
      .post("/admin/user/dropdown/getUserDetail", { roleCode })
      .then((response) => {
        // Handle the API response here
        setAuctioneer(response.data.responseData);
      })
      .catch((error) => {
        // Handle errors here
      });
  }, []);

  // useEffect(() => {
  //   setGroupCodeList(groupCodeList)
  // }, [groupCodeList])
  const AddToMyCatalog = () => {
    console.log(rows, "samardas");
    let savedata = [];
    // const hasCheckedProperty = rows.some(item => item.hasOwnProperty('checked'));

    // if (hasCheckedProperty) {
    // }
    // const checkedIds = rows
    // //.some(item => item.hasOwnProperty('checked'))
    // .filter(item => item.checked === true)
    // .map(item => item.kutchaCatalogId)
    // .join(',');
    let checkedItems = rows.filter((item) => item.checked === true);

    let checkedIds = checkedItems
      .map((item) => item.auctionCatalogId)
      .join(",");
    //let checkedIds = '';
    // for (const item of checkedItems) {
    //   if (checkedIds.length > 0) {
    //     checkedIds += ',';
    //   }
    //   checkedIds += item.kutchaCatalogId;
    // }
    savedata = {
      auctionCatalogIds: checkedIds,
      buyerId: userId,
    };

    console.log(checkedIds, "checkedIds");
    axiosMain
      .post("/preauction/Buyer/PrsAddToMyCatalog", savedata)
      .then((response) => {
        if (response.data.statusCode === 200) {
          CustomToast.success(response.data.message);
          setRows([]);
        } else if (response.data.statusCode === 204) {
          CustomToast.warning(response.data.message);
        } else CustomToast.error(response.data.message);

        // Handle the successful response here
        console.log("Response:", response.data);
      })

      .catch((error) => {
        // Handle any errors here
        console.error("Error:", error);
      });
  };

  const RemoveFromMyCatalog = () => {
    console.log(rows1, "samardas");

    let checkedIds = selection.map((ele) => rows1[ele].invoiceId).join(",");
    let notCheckdIds = rows1.filter(
      (ele, index) => ele.invoiceId.toString() !== checkedIds
    );

    // .map((item) => item.invoiceId)
    // console.log(
    //   checkedIds,
    //   notCheckdIds.map((ele) => ele.invoiceId).join(","),
    //   "checkedIds"
    // );

    // console.log(selection.map(ele=>rows1[ele]),rows1, "checkedIds");
    axiosMain
      .post("/preauction/AuctionCatalog/UnmapPrsLots", {
        invoiceIds: notCheckdIds.map((ele) => ele.invoiceId).join(","),
        auctionSessionDetailId: rows1?.at(0).auctionSessionDetailId,
      })
      .then((response) => {
        if (response.data.statusCode === 200) {
          CustomToast.success(response.data.message);
          setRows1([]);
        } else if (response.data.statusCode === 204) {
          CustomToast.warning(response.data.message);
        } else CustomToast.error(response.data.message);

        // Handle the successful response here
        console.log("Response:", response.data);
      })

      .catch((error) => {
        // Handle any errors here
        console.error("Error:", error);
      });
  };
  const savetabledata = () => {
    console.log(rows, "samardas");
    let savedata = [];

    rows.map((items) => {
      const Newdatas = {
        SaleProgramId: parseInt(items.SaleProgramId),
        auctionCenterId: 2,
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
      .post("/preauction/MaxBidEntry/UpdateMaxBidEntry", savedata)
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
  function formatDateString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed

    return isNaN(year) ? "" : `${year}-${month}-${day}`;
  }
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
    onSubmit: async (values) => {
      let datatime;
      let sttime;
      let endtime;
      if (values.sessionTime !== "" && values.sessionTime !== undefined) {
        datatime = values.sessionTime.split("-");
        sttime = datatime[0].slice(0, -5);
        endtime = datatime[1].slice(0, -4);
      } else {
        sttime = "";
        endtime = "";
      }
      const formData = {
        season: values.season,
        saleNo: values.saleNo !== "" ? parseInt(values.saleNo) : 0,
        auctionDate: values.saleDate,
        auctioneerId: values.auctioner !== "" ? parseInt(values.auctioner) : 0,
        teaTypeId: values.teaType !== "" ? parseInt(values.teaType) : 0,
        categoryId: values.category !== "" ? parseInt(values.category) : 0,
        OriginId: 0,
        MarkId: 0,
        GraderId: 0,
        sessionStartTime: sttime,
        sessionEndTime: endtime,
        userId: userId, //auctioner
        auctionCenterId: auctionCenterId,
      };
      let listdata = [];
      axiosMain
        .post("/preauction/AuctionCatalog/GetPRSAuctionCatalog", formData)
        .then((response) => {
          // Handle the successful response here
          console.log("Response:", response.data);
          // if (response.data.responseData) {
          //   listdata = response.data.responseData.map((item, index) => {
          //     return { ...item, interestedtobid: '0', maxbid: 0 };
          //   });
          // }
          setRows(response.data.responseData);
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error:", error);
        });

      console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
    },
  });
  const createformik = useFormik({
    initialValues: createinitialValues,

    validationSchema: createvalidationSchema,
    onSubmit: (values) => {
      let url = "";
      let formData = [];

      //console.log(formData, kutchaListWarning, kutchaList, "tabval"); // Handle form submission here
    },
  });
  const formik1 = useFormik({
    initialValues: initialValues1,

    validationSchema: validationSchema1,
    onSubmit: async (values) => {
      let datatime;
      let sttime;
      let endtime;
      if (
        formik.values.sessionTime !== "" &&
        formik.values.sessionTime !== undefined
      ) {
        datatime = formik.values.sessionTime.split("-");
        sttime = datatime[0].slice(0, -5);
        endtime = datatime[1].slice(0, -4);
      } else {
        sttime = "";
        endtime = "";
      }
      const formData = {
        season: formik.values.season,
        saleNo:
          formik.values.saleNo !== "" ? parseInt(formik.values.saleNo) : 0,
        auctionDate: formik.values.saleDate,
        //auctioneerId: formik.values.auctioner !== "" ? parseInt(formik.values.auctioner) : 0,
        teaTypeId:
          formik.values.teaType !== "" ? parseInt(formik.values.teaType) : 0,
        categoryId:
          formik.values.category !== "" ? parseInt(formik.values.category) : 0,
        // OriginId:0,
        // MarkId:0,
        // GraderId:0,
        sessionStartTime: sttime,
        sessionEndTime: endtime,
        userId: userId, //auctioner

        auctioneerId: userId, //auctioner
        auctionCenterId: auctionCenterId,
      };
      let listdata = [];
      axiosMain
        .post(
          "/preauction/AuctionCatalog/GetPRSMyCatalog?role=" + roleCode,
          formData
        )
        .then((response) => {
          // Handle the successful response here
          console.log("Response:", response.data);

          setRows1(response.data.responseData);
          // console.log(response.data.responseData.map((ele,index)=> index),"value")
          setSelection(response.data.responseData.map((ele, index) => index));
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
    const season = formik.values.season;

    // API endpoint URL
    const apiUrl = `/preauction/AuctionSession/GetSaleDateAndTeaType`;
    const apiUrl2 = `/preauction/AuctionSession/GetSaleDateAndTeaType`;

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
      getSaleProgramId(season, saleNo);

      axiosMain
        .post("/preauction/Common/BindAuctioneerByInvoice", {
          season: formik.values.season?.toString(),
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          setAuctioneer(res.data.responseData);
        })
        .catch((error) => { });

      axiosMain
        .post("/preauction/Common/BindCatagoryByParam", {
          season: formik.values.season?.toString(),
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          // Handle the API response here
          setcategory(response.data.responseData);
        })
        .catch((error) => {
          // Handle errors here
        });
      axiosMain
        .post("/preauction/Common/BindTeaTypeBySeasonSaleNo", {
          season: formik.values.season?.toString(),
          saleNo: parseInt(formik.values.saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          if (res.data.responseData?.length > 0) {
            // formik.setFieldValue(
            //   "teaType",
            //   res.data.responseData?.at(0)?.teatypeid
            // );
            setTeaTeatypeList(res.data.responseData);
          } else {
            setTeaTeatypeList([]);
          }
        });

      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo, formik.values.season]);

  async function getSaleProgramId(season, saleNo) {
    if (parseInt(saleNo) > 0) {
      try {
        const response = await axiosMain.post(
          "/preauction/Common/GetSaleProgramDetailBySaleNo",
          {
            season: season,
            saleNo: parseInt(saleNo),
            auctionCenterId: auctionCenterId,
          }
        );
        setSaleProgramid(response?.data?.responseData[0]?.SaleProgramId);
        setbaseUrlEng(
          response?.data?.responseData[0]?.auctionTypeCode === "BHARAT"
            ? "BHARAT"
            : "ENGLISH"
        );
      } catch (error) {
        console.error("Error:", error);
        throw error; // Optionally, you can re-throw the error if you want to handle it elsewhere
      }
    } else {
      console.log("Logging...");
      return null; // Return null when saleNo is not greater than 0
    }
  }
  //bind session time
  useEffect(() => {
    const saleNo = formik.values.saleNo;
    const season = formik.values.season;
    const saledate = formik.values.saleDate;
    if (
      saleNo !== "" &&
      season !== "" &&
      saleNo !== undefined &&
      season !== undefined &&
      saledate !== undefined &&
      saledate !== ""
    ) {
      const dataparam = {
        season: season,
        saleNo: parseInt(saleNo),
        auctionDate: saledate,
        auctionCenterId: auctionCenterId,
        // sessionTypeId:2
        sessionTypeName: "Price Rediscovery Session",
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
  }, [formik.values.saleNo, formik.values.season, formik.values.saleDate]);

  useEffect(() => {
    const season = formik.values.season;
    if ((season !== "") & (season !== undefined)) {
      dispatch(fetchSaleNumbersRequest(formik.values.season));
    }
  }, [formik.values.season]);

  //for create formik
  const handleExportPDF = () => {
    let htmls;
    // <td>${item.season}</td>
    // <td>${item.saleNo}</td>
    // <td>${item.auctionDate}</td>
    // <td>${item.teaTypeName}</td>
    // <td>${item.categoryName}</td>
    // <td>${item.sessionType}</td>

    //   <td>season</td>
    // <td>saleNo</td>
    // <td>auctionDate</td>
    // <td>teaTypeName</td>
    // <td>categoryName</td>
    // <td>sessionType</td>
    htmls = rows.map((item) => {
      return `
        <tr>
        
        
        <td>${item.LotNo}</td>
        <td>${item.origin}</td>
        <td>${item.subTeaTypeName}</td>
        <td>${item.markName}</td>
        <td>${item.gradeName}</td>
        <td>${item.totalPackages}</td>
        <td>${item.BasePriceforNormalAuction}</td>

        <td>${item.BasePriceforPRSAuction}</td>
        <td>${item.reservePrice}</td>
        <td>${item.priceIncrement}</td>
        <td>${item.auctioneerValuation}</td>
        <td>${item.LSP_SP}</td>
        <td>${item.lotComments}</td>

        <td>${item.qualityComments}</td>
        <td>${item.Origin}</td>
        <td>${item.packageType}</td>
        <td>${item.grossKgs}</td>
        <td>${item.tareKgs}</td>
        <td>${item.netKgs}</td>

        <td>${item.SampleQty}</td>
        <td>${item.invoiceQty}</td>
        <td>${item.shortExcessWeight}</td>
        <td>${item.gpNo}</td>
        <td>${item.gpDate}</td>
        <td>${item.periodOfManufacture}</td>
        <td>${item.markPackageComments}</td>

        <td>${item.wareHouseName}</td>
        <td>${item.ModifiedBy}</td>
        <td>${item.factoryType}</td>
        <td>${item.gardenCertification}</td>
        <td>${item.qualityCertification}</td>
        <td>${item.brewColor}</td>

        <td>${item.ageOfProducts}</td>
        <td>${item.brewersComments}</td>
        <td>${item.SBP_LSP_SP}</td>
        </tr>
         
        `;
    });
    //}

    // if (printableContent) {
    const printWindow = window.open("", "", "width=1200,height=800");
    printWindow.document.open();
    printWindow.document.write(`
        <html>
        <head>
        <title>Auction Catalog</title>
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
        
        <td>LotNo</td>
        <td>origin</td>
        <td>subTeaTypeName</td>
        <td>markName</td>
        <td>gradeName</td>
        <td>totalPackages</td>
        <td>BasePriceforNormalAuction</td>

        <td>BasePriceforPRSAuction</td>
        <td>reservePrice</td>
        <td>priceIncrement</td>
        <td>auctioneerValuation</td>
        <td>LSP_SP</td>
        <td>lotComments</td>

        <td>qualityComments</td>
        <td>Origin</td>
        <td>packageType</td>
        <td>grossKgs</td>
        <td>tareKgs</td>
        <td>netKgs</td>

        <td>SampleQty</td>
        <td>invoiceQty</td>
        <td>shortExcessWeight</td>
        <td>gpNo</td>
        <td>gpDate</td>
        <td>periodOfManufacture</td>
        <td>markPackageComments</td>

        <td>wareHouseName</td>
        <td>ModifiedBy</td>
        <td>factoryType</td>
        <td>gardenCertification</td>
        <td>qualityCertification</td>
        <td>brewColor</td>

        <td>ageOfProducts</td>
        <td>brewersComments</td>
        <td>SBP_LSP_SP</td>

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

  const handleExportPDFmycatalog = () => {
    let htmls;

    htmls = rows1.map((item) => {
      return `
        <tr>
        
        
        <td>${item.LotNo}</td>
        <td>${item.Origin}</td>
        <td>${item.markName}</td>
        <td>${item.gradeName}</td>
        <td>${item.totalPackages}</td>
        <td>${item.BasePriceforNormalAuction}</td>

        <td>${item.BasePriceforPRSAuction}</td>
        <td>${item.reservePrice}</td>
        <td>${item.priceIncrement}</td>
        <td>${item.auctioneerValuation}</td>
        <td>${item.LSP_SP}</td>
        <td>${item.lotComments}</td>

        <td>${item.qualityComments}</td>
        <td>${item.Origin}</td>
        <td>${item.packageType}</td>
        <td>${item.grossKgs}</td>
        <td>${item.tareKgs}</td>
        <td>${item.netKgs}</td>

        <td>${item.SampleQty}</td>
        <td>${item.invoiceQty}</td>
        <td>${item.shortExcessWeight}</td>
        <td>${item.gpNo}</td>
        <td>${item.gpDate}</td>
        <td>${item.periodOfManufacture}</td>
        <td>${item.markPackageComments}</td>

        <td>${item.wareHouseName}</td>
        <td>${item.ModifiedBy}</td>
        <td>${item.factoryType}</td>
        <td>${item.gardenCertification}</td>
        <td>${item.qualityCertification}</td>
        <td>${item.brewColor}</td>

        <td>${item.ageOfProducts}</td>
        <td>${item.brewersComments}</td>
        <td>${item.SBP_LSP_SP}</td>
        </tr>
         
        `;
    });
    //}

    // if (printableContent) {
    const printWindow = window.open("", "", "width=1500,height=950");
    printWindow.document.open();
    printWindow.document.write(`
        <html>
        <head>
        <title>My Catalog</title>
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
         
        <td>LotNo</td>
        <td>origin</td>
        <td>markName</td>
        <td>gradeName</td>
        <td>totalPackages</td>
        <td>BasePriceforNormalAuction</td>

        <td>BasePriceforPRSAuction</td>
        <td>reservePrice</td>
        <td>priceIncrement</td>
        <td>auctioneerValuation</td>
        <td>LSP_SP</td>
        <td>lotComments</td>

        <td>qualityComments</td>
        <td>Origin</td>
        <td>packageType</td>
        <td>grossKgs</td>
        <td>tareKgs</td>
        <td>netKgs</td>

        <td>SampleQty</td>
        <td>invoiceQty</td>
        <td>shortExcessWeight</td>
        <td>gpNo</td>
        <td>gpDate</td>
        <td>periodOfManufacture</td>
        <td>markPackageComments</td>

        <td>wareHouseName</td>
        <td>ModifiedBy</td>
        <td>factoryType</td>
        <td>gardenCertification</td>
        <td>qualityCertification</td>
        <td>brewColor</td>

        <td>ageOfProducts</td>
        <td>brewersComments</td>
        <td>SBP_LSP_SP</td>

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

  const createformikNew = useFormik({
    initialValues: createinitialValuesNew,

    validationSchema: validationSchemaNew,
    onSubmit: (values) => {
      console.log(values, "sdp val");
      let url = "";
      let newdata = [];
      if (auctioncatalogid <= 0) {
        CustomToast.error("Can Not perform Edit valuation");
        return false;
      }
      newdata = {
        auctionCatalogId: auctioncatalogid,
        season: formik.values.season,
        saleNo:
          formik.values.saleNo !== "" ? parseInt(formik.values.saleNo) : 0,
        SampleQty: PRSAuctionCatalodEditData?.SampleQty,
        basePrice: values.basePrice !== "" ? parseFloat(values.basePrice) : 0,
        auctioneerValuation: PRSAuctionCatalodEditData?.auctioneerValuation,
        reservePrice:
          values.reservePrice !== "" ? parseFloat(values.reservePrice) : 0,
        priceIncrement: PRSAuctionCatalodEditData?.priceIncrement,
        markPackageComments: PRSAuctionCatalodEditData?.markPackageComments,
        lotComments: PRSAuctionCatalodEditData?.lotComments,
        qualityComments: PRSAuctionCatalodEditData?.qualityComments,
        qualityCertification: PRSAuctionCatalodEditData?.qualityCertification,
        brewColor: PRSAuctionCatalodEditData?.brewColor,
        ageOfProducts: PRSAuctionCatalodEditData?.ageOfProducts,
        brewersComments: PRSAuctionCatalodEditData?.brewersComments,
        gardenCertification: PRSAuctionCatalodEditData?.gardenCertification,
        netWeight: PRSAuctionCatalodEditData?.netWeight,
        auctioneerId: userId, //auctioner
        auctionCenterId: auctionCenterId,
      };

      url =
        "/preauction/AuctionCatalog/UpdatePRSMyCatalogValuationReservePrice";

      axiosMain
        .post(url, newdata)
        .then((response) => {
          // Handle the successful response here
          console.log("Response:", response.data);
          if (response.data.statusCode == 200) {
            setauctioncatalogid(0);
            CustomToast.success(response.data.message);

            createformikNew.resetForm();
            setRows1([]);
            handleAccordionChange("panel1");
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
  const [rows1, setRows1] = useState([]);
  // const [year, setYear] = useState(curruntYear);
  const [sessionTypes, setSessionType] = useState(sessionType); // If using React state hooks

  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [kutchaData, setTeakutchaData] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDeletenew, setOpenDeletenew] = useState(false);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [mark, setmark] = useState([]);
  const [categoryList, setcategory] = useState([]);
  const [sessionTime, setSessionTime] = useState(sessionType);
  const [selection, setSelection] = useState([]);
  const [PRSAuctionCatalodEditData, setPRSAuctionCatalodEditData] = useState(
    {}
  );

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
  //   // invoiceNo: "INV-curruntYear-001",
  //   // origin: "Tea Garden",
  //   teaTypeName: "Black Tea",
  //   category: "category name",
  //   seriesFrom: "1000",
  //   seriesTo: "2000",
  // },

  const kutcha = [
    //  {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    // },

    // { name: "Season", title: "Season" },
    // { name: "saleNo", title: "Sale No" },
    //{ name: "auctionDate", title: "Auction Date" },
    // { name: "teaTypeName", title: "Tea Type Name" },
    // { name: "categoryName", title: "Category Name" },
    //{ name: "sessionType", title: "Session Type" },
    { name: "LotNo", title: "Lot No" },
    { name: "invoiceNo", title: "Invoice No" },
    { name: "markName", title: "Mark" },
    { name: "gradeName", title: "Grade" },
    { name: "totalPackages", title: "No. Of Packeges" },
    {
      name: "BasePriceforNormalAuction",
      title: "Base Price For Normal Auction",
    },
    { name: "BasePriceforPRSAuction", title: "Base Price For PRS Auction" },
    { name: "reservePrice", title: "Reserve Price" },
    { name: "priceIncrement", title: "Price Increment" },

    { name: "auctioneerValuation", title: "Auctineer Valuation" },
    { name: "LSP_SP", title: "LSP/SP" },
    { name: "lotComments", title: "Lots Comments" },
    { name: "qualityComments", title: "Quality Comments" },
    { name: "Origin", title: "Origin" },
    { name: "teaTypeName", title: "Tea Type" },
    { name: "subTeaTypeName", title: "Sub Tea Type" },
    { name: "categoryName", title: "Category Name" },
    { name: "packageType", title: "Packege Type" },
    { name: "packageNo", title: "Packege No" },
    { name: "grossKgs", title: "Gross KGS" },
    { name: "tareKgs", title: "Tare KGS" },
    { name: "netKgs", title: "Net KGS" },
    { name: "SampleQty", title: "Sample Qty" },
    { name: "invoiceQty", title: "Invoice Qty" },
    { name: "shortExcessWeight", title: "Short Excess Weight" },
    { name: "gpNo", title: "GP No" },
    { name: "gpDate", title: "GP Date" },
    { name: "periodOfManufacture", title: "Period Of Manufacture" },
    { name: "markPackageComments", title: "Mark Packege Comments" },
    { name: "wareHouseName", title: "Ware House Name" },
    { name: "ModifiedBy", title: "Last Modified By" },
    { name: "marketTypeName", title: "Market  Type" },
    { name: "gardenCertification", title: "Garden Certification" },
    { name: "qualityCertification", title: "Quality Certification" },
    { name: "brewColor", title: "Brew Color" },
    { name: "ageOfProducts", title: "Age Of Product" },
    { name: "brewersComments", title: "Bewers Comments" },
    { name: "SBP_LSP_SP", title: "SBP_LSP/SP" },
  ];
  const kutcha1 = [
    { name: "LotNo", title: "Lot No" },
    { name: "invoiceNo", title: "Invoice No" },
    { name: "markName", title: "Mark Name" },
    { name: "gradeName", title: "Grade" },
    { name: "totalPackages", title: "No. Of Packeges" },
    {
      name: "BasePriceforNormalAuction",
      title: "Base Price For Normal Auction",
    },
    { name: "BasePriceforPRSAuction", title: "Base Price For PRS Auction" },
    { name: "reservePrice", title: "Reserve Price" },
    { name: "priceIncrement", title: "Price Increment" },

    { name: "auctioneerValuation", title: "Auctineer Valuation" },
    { name: "LSP_SP", title: "LSP/SP" },
    { name: "lotComments", title: "Lots Comments" },
    { name: "qualityComments", title: "Quality Comments" },
    { name: "Origin", title: "Origin" },
    { name: "teaTypeName", title: "Tea Type" },
    { name: "subTeaTypeName", title: "Sub Tea Type" },
    { name: "categoryName", title: "Category Name" },
    { name: "packageType", title: "Packege Type" },
    { name: "packageNo", title: "Packege No" },
    { name: "grossKgs", title: "Gross KGS" },
    { name: "tareKgs", title: "Tare KGS" },
    { name: "netKgs", title: "Net KGS" },
    { name: "SampleQty", title: "Sample Qty" },
    { name: "invoiceQty", title: "Invoice Qty" },
    { name: "shortExcessWeight", title: "Short Excess Weight" },
    { name: "gpNo", title: "GP No" },
    { name: "gpDate", title: "GP Date" },
    { name: "periodOfManufacture", title: "Period Of Manufacture" },
    { name: "markPackageComments", title: "Mark Packege Comments" },
    { name: "wareHouseName", title: "Ware House Name" },
    { name: "ModifiedBy", title: "Last Modified By" },
    { name: "factoryType", title: "Factory Type" },
    { name: "gardenCertification", title: "Garden Certification" },
    { name: "qualityCertification", title: "Quality Certification" },
    { name: "brewColor", title: "Brew Color" },
    { name: "ageOfProducts", title: "Age Of Product" },
    { name: "brewersComments", title: "Bewers Comments" },
    { name: "SBP_LSP_SP", title: "SBP_LSP/SP" },
    {
      name: "action",
      title: "Action",
      getCellValue: ({ ...row }) => <ActionArea data={row} />,
    },
  ];

  console.log(rows1, "rows");

  // useEffect(() => {
  //   if (teaTypeList && teaTypeList.length > 0) {
  //     formik.setFieldValue("teaType", teaTypeList[0]?.teaTypeId);
  //   }
  // }, [teaTypeList, formik]);
  useEffect(() => {
    console.log(teaType, "teaType");
    setTeaTeatypeList(teaType);
  }, [teaType]);

  useEffect(() => {
    setcategory(categorystate);
  }, [categorystate]);

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
  const ActionArea = (row) => {
    function handleAction(action) {
      setExpandedTab("panel3");

      switch (action) {
        case "edit": {
          let requestdata = {
            auctionCatalogId: row.data.auctionCatalogId,
            season: formik.values.season,
            saleNo: formik.values.saleNo,
            auctionCenterId: auctionCenterId,
            auctioneerId: userId,
          };

          setauctioncatalogid(row.data.auctionCatalogId);
          axiosMain
            .post(
              "/preauction/AuctionCatalog/GetPRSMyCatalogValuationByParam?role=" +
              roleCode,
              requestdata
            )
            .then((response) => {
              // Handle the successful response here
              console.log("EditResponse:", response.data.responseData[0]);

              createformikNew.setFieldValue(
                "srNo",
                response.data.responseData[0].SrNo
              );
              createformikNew.setFieldValue(
                "markName",
                response.data.responseData[0].markName
              );
              createformikNew.setFieldValue(
                "basePrice",
                response.data.responseData[0].basePrice
              );
              createformikNew.setFieldValue(
                "reservePrice",
                response.data.responseData[0].reservePrice
              );
              setPRSAuctionCatalodEditData(response.data.responseData[0]);
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
      // setRows((prevRows) =>
      //   prevRows.map((row) =>
      //     row.id === data.data.id ? { ...row, checked: e.target.checked } : row

      //   )
      // );
      setRows(
        rows.map((row) =>
          row.auctionCatalogId === data.data.auctionCatalogId
            ? { ...row, checked: e.target.checked }
            : row
        )
      );
      for (const item of rows) {
        if (item.checked === true) {
          setischecked(true);
        } else setischecked(false);
      }

      const allChecked = rows.every((row) => row.checked);
      setSelectAllRow(allChecked);
    };
    // useEffect(() => {
    //   const allChecked = rows.every((row) => row.checked);
    //   setSelectAllRow(allChecked);
    // }, [rows]);

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

  const AWRCheckBox1 = (data) => {
    const handleChange = (e) => {
      setRows1(
        rows1.map((row) =>
          row.MyCatalogId === data.data.MyCatalogId
            ? { ...row, checked: e.target.checked }
            : row
        )
      );

      // for (const item of rows1) {
      //   if (item.checked===true) {
      //     setischecked(true);
      //   }
      //   else
      //   setischecked(false);

      // }

      const allChecked = rows1.every((row) => row.checked);
      //setSelectAllRow(allChecked);
    };

    // useEffect(() => {
    //   const allChecked = rows.every((row) => row.checked);
    //   setSelectAllRow(allChecked);
    // }, [rows]);

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
  function requiredField(arrayOfObjects) {
    const positions = [];

    arrayOfObjects.forEach((obj, index) => {
      if (
        obj.LotNo === "" ||
        obj.LotNo === undefined ||
        obj.reservePrice === 0
      ) {
        positions.push(index + 1);
      }
    });

    return positions;
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
            const { lotno, reservePrice } = fixKeyNames(ele);

            let data = {
              LotNo:
                lotno !== "" || lotno !== undefined ? lotno?.toString() : "",
              reservePrice:
                reservePrice !== "" && reservePrice !== undefined
                  ? parseInt(reservePrice)
                  : 0,
            };

            return data;
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
  const handleFileUpload = (e) => {
    const files = e.target.files;

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
    // if (fileInputRef.current) {
    //   fileInputRef.current.value = ''
    // }
  };

  return (
    <>
      <div>
        <ConfirmationModal
          show={openDelete}
          onDelete={handleRemove}
          onHide={() => setOpenDelete(false)}
        />

        <DeleteConfirmationModal
          show={openDeletenew}
          title={"Are you sure you want to Remove ?"}
          onDelete={() => {
            let checkedIds = selection
              ?.map((ele) => rows1[ele].invoiceId)
              .join(",");
            let notCheckdIds = rows1?.filter(
              (ele, index) => ele.invoiceId.toString() !== checkedIds
            );

            // .map((item) => item.invoiceId)
            // console.log(
            //   checkedIds,
            //   notCheckdIds.map((ele) => ele.invoiceId).join(","),
            //   "checkedIds"
            // );

            // console.log(selection.map(ele=>rows1[ele]),rows1, "checkedIds");
            axiosMain
              .post("/preauction/AuctionCatalog/UnmapPrsLots", {
                invoiceIds: notCheckdIds.map((ele) => ele.invoiceId).join(","),
                auctionSessionDetailId: rows1?.at(0).auctionSessionDetailId,
                auctionCenterId: auctionCenterId,
              })
              .then((response) => {
                if (response.data.statusCode === 200) {
                  CustomToast.success(response.data.message);
                  setRows1([]);
                } else if (response.data.statusCode === 204) {
                  CustomToast.warning(response.data.message);
                } else CustomToast.error(response.data.message);

                // Handle the successful response here
                console.log("Response:", response.data);
              })

              .catch((error) => {
                // Handle any errors here
                console.error("Error:", error);
              });

            setOpenDeletenew(false);
          }}
          onHide={() => setOpenDeletenew(false)}
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
            <Typography>PRS Auction Catalog List</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {modalRight?.includes("12") && (
              <form onSubmit={formik.handleSubmit}>
                <div className="row align-items-end">
                  <div className="col-lg-2">
                    <label>Season</label>
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
                    <label>Sale No.</label>
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
                    <label>Auctioner Date.</label>
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
                    <label>Auctioner.</label>
                    <InputGroup>
                      <FormControl
                        as="select"
                        name="auctioner"
                        value={formik.values.auctioner}
                        onChange={handleChange}
                      >
                        <option value="0">All</option>

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
                    <label>Tea Type</label>
                    <InputGroup>
                      <FormControl
                        as="select"
                        size="sm"
                        name="teaType"
                        value={formik.values.teaType}
                        onChange={handleChange}
                      >
                        <option value={0}>All</option>
                        {teaTypeList?.length > 0 ? (
                          teaTypeList?.map((item, index) => (
                            <option value={item?.teatypeid} key={index}>
                              {item.teaTypeName}
                            </option>
                          ))
                        ) : (
                          <option>No Data</option>
                        )}
                      </FormControl>
                    </InputGroup>
                    {formik.errors.teaType && formik.touched.teaType && (
                      <div className="error text-danger">
                        {formik.errors.teaType}
                      </div>
                    )}
                  </div>
                  <div className="col-md-2">
                    <div className="FormGrup">
                      <label>Category</label>
                      <div className="ma6x-width250">
                        <InputGroup>
                          <FormControl
                            as="select"
                            name="category"
                            value={formik.values.category}
                            onChange={handleChange}
                          >
                            <option value={0}>All</option>
                            {categoryList?.length > 0 ? (
                              categoryList?.map((item, index) => (
                                <option value={item.categoryId} key={index}>
                                  {item.categoryCode}
                                </option>
                              ))
                            ) : (
                              <option>No Data</option>
                            )}
                          </FormControl>
                        </InputGroup>
                        {formik.errors.category && formik.touched.category && (
                          <div className="error text-danger">
                            {formik.errors.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-2">
                    <label>Session Time.</label>
                    <InputGroup>
                      <FormControl
                        as="select"
                        name="sessionTime"
                        value={formik.values.sessionTime}
                        onChange={handleChange}
                      >
                        <option value="">Session Time</option>
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
                  <label>Group Code</label>
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
                          formik.setFieldValue("teaType", "0");
                          formik.setFieldValue("auctioner", "0");
                          formik.setFieldValue("category", "0");
                          formik.setFieldValue("season", "");
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
                      <Button className="SubmitBtn" onClick={handleExportExcel}>
                        Export as Excel
                      </Button>
                      {baseUrlEng !== "ENGLISH" && (<Button className="SubmitBtn" onClick={handleExportToPdfCatalogList}>
                        Print
                      </Button>)}


                      {/* {rows?.length > 0 ? (
                        <Button
                          className="SubmitBtn"
                          id="print-button"
                          onClick={handleExportPDF}
                        >
                          Export as PDF
                        </Button>
                      ) : (
                        ""
                      )} */}
                      <button
                        type="button"
                        onClick={() =>
                          PrintableTable(kutcha, rows?.length > 0 ? rows : [], "Prs Auction Catalog")
                        }
                        className="SubmitBtn btn"
                      >
                        Export as Pdf
                      </button>
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

                <div className="row pt-3">
                  <div className="col-12">
                    <div className="BtnGroup">
                      {/* <Button className="SubmitBtn" onClick={AddToMyCatalog}>
                      Add To My Catalog
                    </Button> */}
                    </div>
                  </div>
                </div>
                {/* <PrsAuctionCatalogTable rows={rows} setRows={setRows} /> */}
              </form>
            )}
            <form onSubmit={formik1.handleSubmit}>
              {formik.values.season !== "" &&
                formik.values.saleNo !== "" &&
                formik.values.saleDate !== "" ? (
                <div className="BtnGroup">
                  {modalRight?.includes("19") && (
                    <Button className="SubmitBtn" type="submit">
                      Get My Catalog
                    </Button>
                  )}
                  {rows1?.length > 0 ? (
                    <Button
                      className="SubmitBtn"
                      id="print-button"
                      onClick={handleExportPDFmycatalog}
                    >
                      Export as PDF
                    </Button>
                  ) : (
                    ""
                  )}
                  {baseUrlEng !== "ENGLISH" &&
                    (<Button className="SubmitBtn" onClick={handleExportToPdfMyCatalogList}>
                      Print My Catalog
                    </Button>)}
                </div>
              ) : (
                ""
              )}
              {formik.values.season !== "" &&
                formik.values.saleNo !== "" &&
                formik.values.saleDate !== "" ? (
                <div>
                  {/* <TableComponent
                    columns={kutcha1}
                    rows={rows1?.length > 0 ? rows1 : []}
                    setRows={setRows}
                    dragdrop={false}
                    fixedColumnsOn={false}
                    resizeingCol={false}
                    selectionCol={true}
                    sorting={true}
                  /> */}
                  <Grid rows={rows1?.length > 0 ? rows1 : []} columns={kutcha1}>
                    {/* <SelectionState
                      selection={selection}
                      defaultSelection={
                        rows1?.length > 0
                          ? rows1.map((ele, index) => index)
                          : []
                      }
                      onSelectionChange={setSelection}
                      allSelected={true}
                    /> */}
                    <PagingState defaultCurrentPage={0} pageSize={6} />
                    {/* <IntegratedSelection /> */}
                    <IntegratedPaging />
                    <Table />
                    <TableHeaderRow />
                    {/* <TableSelection showSelectAll /> */}
                    <PagingPanel />
                  </Grid>
                </div>
              ) : (
                ""
              )}

              {/* <div className="BtnGroup">
                <Button
                  className="SubmitBtn"
                  onClick={() => setOpenDeletenew(true)}
                >
                  Remove from My Catalog
                </Button>
              </div> */}
            </form>
          </AccordionDetails>
        </Accordion>

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
            <Typography>Manage PRS Auction Catalog</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={createformik.handleSubmit}>
              <div className="col-md-12 ">
                <button
                  type="button"
                  className="btn SubmitBtn me-2"
                  onClick={handleDownload}
                >
                  Download Sample
                </button>

                {modalRight?.includes("6") && (
                  <ul style={{ listStyle: "disc", padding: "1%" }}>
                    <li>Any number of excel file can be uploaded. </li>
                    <li> Maximum file size should not exceed {"<10>"} MB</li>
                    <li>Acceptable file types: (*.xls and.xlsx)</li>
                  </ul>
                )}
                <div class="browse-file FileUpload">
                  {/* <FileUpload
              id="fileInput"
              handleData={handleData}
              readFileAndCheckHeaders={readFileAndCheckHeaders}
            /> */}

                  {modalRight?.includes("6") && (
                    <>
                      {" "}
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
                                const blankLotnoPositions =
                                  requiredField(invoiceData);

                                if (blankLotnoPositions.length > 0) {
                                  CustomToast.error(
                                    "Lot No,Reserve Price Can Not Be Blank of Position " +
                                    blankLotnoPositions.join(",")
                                  );
                                  return false;
                                } else if (duplicates.length > 0) {
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
                            console.log(
                              allTrue,
                              "allTrueallTrueallTrueallTrue"
                            );

                            if (allTrue) {
                              axiosMain
                                .post(
                                  "/preauction/AuctionCatalog/PRSUploadValuation",
                                  invoiceData.map((ele) => {
                                    return {
                                      ...ele,
                                      auctionCenterId: auctionCenterId,
                                      createdBy: userId,
                                      saleprogramid: saleprogramid,
                                    };
                                  })
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
                                  } else
                                    CustomToast.error(response.data.message);
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
                            CustomToast.error("Please Upload Max Bid Entry ");
                          }
                        }}
                      >
                        Create
                      </Button>
                    </>
                  )}
                  <div>
                    {/* <a
        href="/maxbidentryformat.xlsx" 
        download="MaxBidEntryFormat.xlsx"
      >
        Download Excel
      </a> */}
                  </div>
                </div>
              </div>
            </form>
          </AccordionDetails>
        </Accordion>

        {formik.values.season !== "" &&
          formik.values.saleNo !== "" &&
          formik.values.saleDate !== "" &&
          rows1?.length > 0 &&
          isEdit === true ? (
          <Accordion
            expanded={expandedTab === "panel3"}
            onChange={handleAccordionChange("panel3")}
            className={`${expandedTab === "panel3" ? "active" : ""}`}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography>PRS Auction Catalog Valuation Config</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={createformikNew.handleSubmit}>
                <div className="row align-items-end">
                  <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                    <FormLabel>Sr NO.</FormLabel>
                    <FormControl
                      as="input"
                      type="text"
                      id="srNo"
                      name="srNo"
                      disabled="true"
                      onChange={createformikNew.handleChange}
                      value={createformikNew.values.srNo}
                    />
                  </FormGroup>
                  <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                    <FormLabel>Mark Name</FormLabel>
                    <FormControl
                      as="input"
                      type="text"
                      id="markName"
                      name="markName"
                      disabled="true"
                      onChange={createformikNew.handleChange}
                      value={createformikNew.values.markName}
                    />
                  </FormGroup>
                  <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                    <FormLabel>Base Price</FormLabel>
                    <FormControl
                      as="input"
                      type="text"
                      id="basePrice"
                      name="basePrice"
                      disabled="true"
                      onChange={createformikNew.handleChange}
                      value={createformikNew.values.basePrice}
                    />
                  </FormGroup>
                  <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                    <FormLabel>Reserve Price</FormLabel>
                    <FormControl
                      as="input"
                      type="text"
                      id="reservePrice"
                      name="reservePrice"
                      onChange={createformikNew.handleChange}
                      value={createformikNew.values.reservePrice}
                    />
                  </FormGroup>

                  <div className="col-auto">
                    <div className="BtnGroup">
                      <Button className="SubmitBtn" type="submit">
                        Save Valuation
                      </Button>
                      <Button
                        className="SubmitBtn"
                        onClick={() => {
                          createformikNew.resetForm();
                          handleAccordionChange("panel1");
                          setauctioncatalogid(0);
                          setIsEdit(false);
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </AccordionDetails>
          </Accordion>
        ) : (
          ""
        )}
        {/* MODAL PRINT */}

        <Modals
          size="l"
          title="Select For Print"
          show={openPrintModel}
          handleClose={() => {
            setopenPrintModel(false);
          }}
        >
          <PrintInvoice
            fields={[]}
            showcheckboxlebels={columndata}
            rows={printrow.length > 0 ? printrow : []}
            pageName={"Prs Auction catalog"}
          />
        </Modals>

        {/* MODAL PRINT */}
        <Modals
          size="l"
          title="Select Print For My Catalog"
          show={openPrintMyModel}
          handleClose={() => {
            setopenPrintMyModel(false);
          }}
        >
          <PrintInvoice
            fields={[]}
            showcheckboxlebels={columnMydata}
            rows={printMyrow.length > 0 ? printMyrow : []}
            pageName={"Prs Auction catalog"}
          />
        </Modals>
      </div>
    </>
  );
};

export default PrsAuctionCatalogFormModal;
