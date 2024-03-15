import React, { useEffect, useState, useRef } from "react";
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
import CreatePlanner from "../../prsAuctionCatalog/CreatePlanner";
import PrintableTable from "../../../../components/common/PrintableTable";
import PrintInvoice from "../../../../components/common/Print/print";
import Modals from "../../../../components/common/Modal";

const validationSchema = Yup.object().shape({
  saleNo: Yup.number()
    .min(1, "Please select Sale No")
    .required("Sale No is required"),
  season: Yup.string().required("Season is required"),
  saleDate: Yup.string().required("Auctioner Date is required"),
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

const PrsAuctionCatalogBuyerFormModal = ({ modalRight }) => {
  const dispatch = useDispatch();
  const {
    auctionDetailId,
    auctionCenterUserId,
    auctionCenterId,
    userId,
    roleCode, auction,
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
  const [saleprogramid, setSaleProgramid] = useState(null);

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
  const [printrow, setprintrow] = useState([]);
  const [openPrintModel, setopenPrintModel] = useState(false);
  const [columndata, setcolumndata] = useState([]);

  const [openPrintMyModel, setopenPrintMyModel] = useState(false);
  const [columnMydata, setcolumnMydata] = useState([]);
  const [printMyrow, setprintMyrow] = useState([]);
  const [baseUrlEng, setbaseUrlEng] = useState(auction);
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
  const handleExportToPdfMyCatalogList = () => {
    var newdat = rows1?.map(obj => {
      for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
          obj[key] = "";
        }
      }
      return obj;
    });


    // var datas = newdat.map((item) => ({ ...item, season: formik.values.season, saleNo: formik.values.saleNo }))
    // setprintrow(myCatalogRows);
    // console.log(formik);
    const objectToRemove = ["action", "select"];

    // Find the index of the object with the specified name
    // const indexToRemove = allcoulmn.findIndex(item => item.name === objectToRemove);

    const indexToRemove = kutcha1.filter(item => !objectToRemove.includes(item.name))

    // Check if the index is found and remove the object
    // if (indexToRemove !== -1) {
    //   allcoulmn.splice(indexToRemove, 1);
    // }
    indexToRemove.push(

      { name: "auctioner", title: "auctioner" },
      { name: "sessiontime", title: "Session Time" },
    );
    let AuctionerselectedText;
    if (formik.values.auctioner === 0 || formik.values.auctioner === "0") {
      AuctionerselectedText = "All";
    }
    else
      AuctionerselectedText = auctioneer.filter((item) => item.userId === parseInt(formik.values.auctioner))?.at(0).userCode;

    const newrow = newdat?.map((itm) => ({
      ...itm, auctioner: AuctionerselectedText, sessiontime: formik.values.sessionTime
    }));
    setprintMyrow(newrow);
    setcolumnMydata(indexToRemove);

    setopenPrintMyModel(true);
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
    const objectToRemove = "select";

    // Find the index of the object with the specified name
    const indexToRemove = allcoulmn.findIndex(item => item.name === objectToRemove);

    // Check if the index is found and remove the object
    if (indexToRemove !== -1) {
      allcoulmn.splice(indexToRemove, 1);
    }
    allcoulmn.push(


      { name: "auctioner", title: "auctioner" },
      { name: "sessiontime", title: "Session Time" }
    );
    let AuctionerselectedText;
    if (formik.values.auctioner === 0 || formik.values.auctioner === "0") {
      AuctionerselectedText = "All";
    }
    else
      AuctionerselectedText = auctioneer.filter((item) => item.userId === parseInt(formik.values.auctioner))?.at(0).userCode;

    const newrow = newdat?.map((itm) => ({
      ...itm, auctioner: AuctionerselectedText, sessiontime: formik.values.sessionTime
    }));
    setprintrow(newrow);
    setcolumndata(allcoulmn);

    setopenPrintModel(true);
  };

  const handleDownload = () => {
    let documentName = "PrsAuctionCatalogBuyer.xlsx";

    axiosMain
      .post(
        "/preauction/AuctionCatalog/DownloadAuctionCatalogReportExcel?role=" +
        roleCode,
        {
          SaleProgramId: saleprogramid,
          auctionCenterId: auctionCenterId,
          userId: userId,
          Type: "PRSBuyer",
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

  const handleExportExcel = async () => {
    // Assuming columnName contains the list of objects with "name" and "title"
    let columnsdata = kutcha;
    // columnsdata.pop();
    columnsdata = columnsdata.slice(1);
    const columnName = columnsdata;

    // Assuming data contains the list of data objects like [{saleNo: 5}, ...]
    const data = rows;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PrsAuctionCatalogBuyer");

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
    saveAs(blob, "PrsAuctionCatalogBuyer.xlsx");
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
    formik.setFieldValue("season", "");
    formik.setFieldValue("sessionTime", "");
    formik.setFieldValue("saleDate", "");
    setRows([]);
    setRows1([]);

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
    dispatch(teaTypeAction({ auctionCenterId }));
    // dispatch(
    //   fetchCategoryRequest({
    //     teaTypeId: parseInt(formik.values.teaType),
    //     auctionCenterId,
    //   })
    // );

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
    let savedata = [];
    // const hasCheckedProperty = rows.some(item => item.hasOwnProperty('checked'));

    // if (hasCheckedProperty) {
    // }
    // const checkedIds = rows
    // //.some(item => item.hasOwnProperty('checked'))
    // .filter(item => item.checked === true)
    // .map(item => item.kutchaCatalogId)
    // .join(',');
    let checkedItems = rows1.filter((item) => item.checked === true);

    let checkedIds = checkedItems.map((item) => item.MyCatalogId).join(",");
    if (checkedIds?.length <= 0) {
      CustomToast.error("Please Check on LotNo which need to remove!");
      return false;
    }
    savedata = {
      // myCatalogIds:checkedIds,
      myCatalogIds: checkedIds,
      buyerId: userId,
      auctionCenterId: auctionCenterId,
    };

    console.log(checkedIds, "checkedIds");
    axiosMain
      .post("/preauction/Buyer/PRSRemoveLotsFromMyCatalog", savedata)
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
  const handleExportPDF = () => {
    let htmls;
    htmls = rows1.map((item) => {
      return `
        <tr>
        
        <td>${item.season}</td>
        <td>${item.saleNo}</td>
        <td>${item.teaTypeName}</td>
        <td>${item.categoryName}</td>
        <td>${item.lotNo}</td>
        <td>${item.origin}</td>

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
        <title>Buyer My Catalog</title>
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
        
        <td>Season</td>
        <td>Sale No</td>
        <td>Tea Type</td>
        <td>Category</td>
        <td>Lot No</td>
        <td>Origin</td>

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
        auctionDate: formatDateString(values.saleDate),
        auctioneerId: values.auctioner !== "" ? parseInt(values.auctioner) : 0,
        auctionCenterId: auctionCenterId,
        teaTypeId: values.teaType !== "" ? parseInt(values.teaType) : 0,
        categoryId: values.category !== "" ? parseInt(values.category) : 0,
        OriginId: 0,
        MarkId: 0,
        GraderId: 0,
        sessionStartTime: sttime,
        sessionEndTime: endtime,
      };

      let listdata = [];
      axiosMain
        .post("/preauction/Buyer/GetPRSBuyerAuctionCatalog", formData)
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
        auctionDate: formatDateString(formik.values.saleDate),
        auctioneerId:
          formik.values.auctioner !== ""
            ? parseInt(formik.values.auctioner)
            : 0,
        teaTypeId:
          formik.values.teaType !== "" ? parseInt(formik.values.teaType) : 0,
        categoryId:
          formik.values.category !== "" ? parseInt(formik.values.category) : 0,
        OriginId: 0,
        MarkId: 0,
        GraderId: 0,
        sessionStartTime: sttime,
        sessionEndTime: endtime,
        buyerId: userId,
        auctionCenterId: auctionCenterId,
      };
      let listdata = [];
      axiosMain
        .post("/preauction/Buyer/GetPRSMyCatalog?role=" + roleCode, formData)
        .then((response) => {
          // Handle the successful response here
          console.log("Response:", response.data);

          setRows1(response.data.responseData);
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

      axiosMain
        .post("/preauction/Common/GetSaleProgramDetailBySaleNo", {
          season: season,
          saleNo: parseInt(saleNo),
          auctionCenterId: auctionCenterId,
        })
        .then((response) => {
          setSaleProgramid(response.data.responseData[0].SaleProgramId);
          setbaseUrlEng(
            response?.data?.responseData[0]?.auctionTypeCode === "BHARAT"
              ? "BHARAT"
              : "ENGLISH"
          );
        })
        .catch((error) => {
          // Handle errors here
        });

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

      return () => {
        // Cancel the request (if necessary) to avoid memory leaks
      };
    }
  }, [formik.values.saleNo, formik.values.season]);
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
        auctionDate: saledate, //"2023-09-13T00:00:00",
        auctionCenterId: auctionCenterId,
        // sessionTypeId: 2,
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
  const [rows1, setRows1] = useState([]);
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
  const [openMyPlanner, setOpenMyPlanner] = useState(false);

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
    {
      name: "select",
      title: "Select",
      getCellValue: ({ ...row }) => <AWRCheckBox data={row} />,
    },

    { name: "Season", title: "Season" },
    { name: "saleNo", title: "Sale No" },
    { name: "auctionDate", title: "Auction Date" },
    { name: "teaTypeName", title: "Tea Type Name" },
    { name: "categoryName", title: "Category Name" },
    { name: "sessionType", title: "Session Type" },
    { name: "LotNo", title: "Lot No" },
    { name: "origin", title: "Origin" },
    { name: "subTeaTypeName", title: "Sub Tea Type" },
    { name: "markName", title: "Mark Name" },

    { name: "gradeName", title: "Grade" },
    { name: "totalPackages", title: "No. Of Packeges" },
    { name: "grossKgs", title: "Gross Weight" },
    { name: "netKgs", title: "Net Weight" },
    { name: "SampleQty", title: "Sample Qty" },
    { name: "invoiceQty", title: "Invoice Qty" },
    { name: "periodOfManufacture", title: "last Modified By" },
    { name: "basePrice", title: "Base Price" },
    { name: "priceIncrement", title: "Price Increment" },
    { name: "auctioneerValuation", title: "Auctioner Valuation" },
    { name: "markPackageComments", title: "Mark Packege Comments" },
    { name: "lotComments", title: "Lot Comments" },
    { name: "marketTypeName", title: "Market Type Name" },
    { name: "gpNo", title: "GP No" },
    { name: "gpDate", title: "GP Date" },
    { name: "invoiceNo", title: "Invoice No" },
    { name: "packageType", title: "Packege Type" },

    { name: "packageNo", title: "Packege No" },
    { name: "wareHouseName", title: "Ware House Name" },
    { name: "gardenCertification", title: "Garden Certification" },
    { name: "qualityCertification", title: "Quality Certification" },
    { name: "brewColor", title: "Brew Color" },
    { name: "ageOfProducts", title: "Age Of Product" },
    { name: "brewersComments", title: "Bewers Comments" },
  ];
  const kutcha1 = [
    {
      name: "select",
      title: "Select",
      getCellValue: ({ ...row }) => <AWRCheckBox1 data={row} />,
    },

    { name: "Season", title: "Season" },
    { name: "saleNo", title: "Sale No" },
    { name: "auctionDate", title: "Auction Date" },
    { name: "teaTypeName", title: "Tea Type Name" },
    { name: "categoryName", title: "Category Name" },
    { name: "sessionType", title: "Session Type" },
    { name: "LotNo", title: "Lot No" },
    { name: "origin", title: "Origin" },
    { name: "subTeaTypeName", title: "Sub Tea Type" },
    { name: "markName", title: "Mark Name" },

    { name: "gradeName", title: "Grade" },
    { name: "totalPackages", title: "No. Of Packeges" },
    { name: "grossKgs", title: "Gross Weight" },
    { name: "netKgs", title: "Net Weight" },
    { name: "SampleQty", title: "Sample Qty" },
    { name: "invoiceQty", title: "Invoice Qty" },
    { name: "periodOfManufacture", title: "last Modified By" },
    { name: "basePrice", title: "Base Price" },
    { name: "priceIncrement", title: "Price Increment" },
    { name: "auctioneerValuation", title: "Auctioner Valuation" },
    { name: "markPackageComments", title: "Mark Packege Comments" },
    { name: "lotComments", title: "Lot Comments" },
    { name: "marketTypeName", title: "Market Type Name" },
    { name: "gpNo", title: "GP No" },
    { name: "gpDate", title: "GP Date" },
    { name: "invoiceNo", title: "Invoice No" },
    { name: "packageType", title: "Packege Type" },

    { name: "packageNo", title: "Packege No" },
    { name: "wareHouseName", title: "Ware House Name" },
    { name: "gardenCertification", title: "Garden Certification" },
    { name: "qualityCertification", title: "Quality Certification" },
    { name: "brewColor", title: "Brew Color" },
    { name: "ageOfProducts", title: "Age Of Product" },
    { name: "brewersComments", title: "Bewers Comments" },
  ];

  console.log(rows, "rows");

  // useEffect(() => {
  //   if (teaTypeList && teaTypeList.length > 0) {
  //     formik.setFieldValue("teaType", teaTypeList[0]?.teaTypeId);
  //   }
  // }, [teaTypeList, formik]);
  // useEffect(() => {
  //   console.log(teaType, "teaType");
  //   setTeaTeatypeList(teaType);
  // }, [teaType]);

  useEffect(() => {
    setcategory(categorystate);
  }, [categorystate]);

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);
    //setLotSeriesData([]);
    setIsEdit(false);

    createformik.resetForm();
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
          style={{ marginLeft: "1rem" }}
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
          style={{ marginLeft: "1rem" }}
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
        obj.lotNo === "" ||
        obj.lotNo === undefined ||
        obj.myComments === "" ||
        obj.myComments === undefined ||
        obj.groupCode === "" ||
        obj.groupCode === undefined ||
        obj.myValuation === "" ||
        obj.myValuation === undefined
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
            const { lotno, myValuation, myComments, groupCode } =
              fixKeyNames(ele);

            let data = {
              lotNo: lotno !== undefined ? lotno?.toString() : "",
              myValuation:
                myValuation !== "" && myValuation !== undefined
                  ? parseInt(myValuation)
                  : 0,
              myComments: myComments !== undefined ? myComments.toString() : "",
              groupCode: groupCode !== undefined ? groupCode.toString() : "",

              updatedBy: userId,
              auctionCenterId: auctionCenterId,
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
      setInvoiceData([...invoiceData, ...mergedArray]);
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
  useEffect(() => {
    if (
      formik.values.saleNo !== "" &&
      formik.values.season !== "" &&
      formik.values.saleNo !== undefined &&
      formik.values.season !== undefined
    ) {
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
    }
  }, [formik.values.saleNo, formik.values.season]);

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
            <Typography>PRS Auction Catalog - Buyer List</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={formik.handleSubmit}>
              {modalRight?.includes("12") && (
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
                    <label>Select Auctioner Date.</label>
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
                    <label>Select Auctioner.</label>
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
                    <label>Select Tea Type</label>
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
                      <div className="max-width250">
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
              )}

              <div className="row pt-3">
                <div className="col-12">
                  <div className="BtnGroup">
                    {modalRight?.includes("9") && (
                      <Button className="SubmitBtn" onClick={handleExportExcel}>
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
                          PrintableTable(
                            kutcha.filter((ele) => ele.name !== "select"),
                            rows?.length > 0 ? rows : []
                          )
                        }
                        className="SubmitBtn btn"
                      >
                        Export as Pdf
                      </button>
                    )}
                    {baseUrlEng !== "ENGLISH" && (<Button className="SubmitBtn" onClick={handleExportToPdfCatalogList}>
                      Print
                    </Button>)}
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
                    {rows?.length > 0 ? (
                      <Button className="SubmitBtn" onClick={AddToMyCatalog}>
                        Add To My Catalog
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              {/* <PrsAuctionCatalogTable rows={rows} setRows={setRows} /> */}
            </form>
            <form onSubmit={formik1.handleSubmit}>
              {formik.values.season !== "" &&
                formik.values.saleNo !== "" &&
                formik.values.saleDate !== "" ? (
                <>
                  <div className="BtnGroup">
                    <Button className="SubmitBtn" type="submit">
                      Get My Catalog
                    </Button>
                  </div>
                  <div className="BtnGroup">
                    <Button
                      className="SubmitBtn"
                      type="button"
                      disabled={rows1?.length > 0 ? false : true}
                      onClick={() => setOpenMyPlanner(true)}
                    >
                      Create My Planner
                    </Button>
                    <button
                      type="button"
                      onClick={() =>
                        PrintableTable(
                          kutcha1.filter((ele) => ele.name !== "select"),
                          rows?.length > 0 ? rows : []
                        )
                      }
                      className="SubmitBtn btn"
                    >
                      Export as Pdf
                    </button>
                    {baseUrlEng !== "ENGLISH" && (<Button className="SubmitBtn btn" onClick={handleExportToPdfMyCatalogList}>
                      Print
                    </Button>)}
                  </div>

                  <div>
                    <TableComponent
                      columns={kutcha1}
                      rows={rows1?.length > 0 ? rows1 : []}
                      setRows={setRows}
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
              <div className="BtnGroup">
                {rows1?.length > 0 ? (
                  <>
                    <Button className="SubmitBtn" onClick={RemoveFromMyCatalog}>
                      Remove from My Catalog
                    </Button>

                    {modalRight?.includes("8") && (
                      <Button
                        className="SubmitBtn"
                        id="print-button"
                        onClick={handleExportPDF}
                      >
                        Export as PDF
                      </Button>
                    )}
                  </>
                ) : (
                  ""
                )}
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
            <Typography>Manage PRS Auction Catalog - Buyer</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {modalRight?.includes("1") && (
              <form onSubmit={createformik.handleSubmit}>
                <div className="col-md-12 ">
                  <div class="browse-file FileUpload">
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
                              const blankLotnoPositions =
                                requiredField(invoiceData);

                              if (blankLotnoPositions.length > 0) {
                                CustomToast.error(
                                  "Lot No,My Valuation, My Comments ,Group Code Can Not Be Blank of Position " +
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
                          console.log(allTrue, "allTrueallTrueallTrueallTrue");

                          if (allTrue) {
                            axiosMain
                              .post(
                                "/preauction/Buyer/PRSAddValuation",
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
                          CustomToast.error("Please Upload Max Bid Entry ");
                        }
                      }}
                    >
                      Create
                    </Button>
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
            )}
          </AccordionDetails>
        </Accordion>
      </div>

      {modalRight?.includes("33") && (
        <CreatePlanner
          openMyPlanner={openMyPlanner}
          setOpenMyPlanner={setOpenMyPlanner}
          myCatalogDetails={formik.values}
          modalRight={modalRight}
        />
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
          pageName={"Prs Auction catalog Buyer"}
        />
      </Modals>

      {/* MODAL PRINT */}
      <Modals
        size="l"
        title="Select For Print"
        show={openPrintMyModel}
        handleClose={() => {
          setopenPrintMyModel(false);
        }}
      >
        <PrintInvoice
          fields={[]}
          showcheckboxlebels={columnMydata}
          rows={printMyrow.length > 0 ? printMyrow : []}
          pageName={"Prs Auction catalog Buyer"}
        />
      </Modals>
      {/* // <ToastContainer /> */}
    </>
  );
};

export default PrsAuctionCatalogBuyerFormModal;
