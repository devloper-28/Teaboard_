import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  FormControl,
  FormLabel,
  FormGroup,
  Button,
  Table,
  Col,
  Row,
  Form,
} from "react-bootstrap";
import Switch from "react-switch";

import {
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlineFileText,
  AiOutlineFile,
} from "react-icons/ai";
import CustomToast from "../../../../components/Toast";
import "react-toastify/dist/ReactToastify.css";
import {
  cancelSaleProgramDocumentRequest,
  cancelSaleProgramRequest,
  checkSaleNoExistence,
  createSaleProgramRequest,
  fetchPromptDatesByAuctionCenterRequest,
  teaTypeAction,
  updateSaleProgramRequest,
} from "../../../../store/actions/index";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import NoData from "../../../../components/nodata/NoData";
import { SettingsSystemDaydreamSharp } from "@mui/icons-material";
import axios from "axios";
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import DownloadFile from "../../../../components/common/download/DownloadFile";
import axiosMain from "../../../../http/axios/axios_main";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import ExportData from "../../../../components/common/exportData/ExportData";
import Modal from "../../../../components/common/Modal";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import { Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import { Switch } from "@mui/material";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// function formatDate(dateString) {
//   const date = new Date(dateString);
//   const day = date.getDate();
//   const month = date.getMonth() + 1; // January is 0
//   const year = date.getFullYear() % 100; // Get last two digits of year
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const seconds = date.getSeconds();

//   // Add leading zero if the number is less than 10
//   const formattedDay = (day < 10 ? "0" : "") + day;
//   const formattedMonth = (month < 10 ? "0" : "") + month;
//   const formattedYear = (year < 10 ? "0" : "") + year;
//   const formattedHours = (hours < 10 ? "0" : "") + hours;
//   const formattedMinutes = (minutes < 10 ? "0" : "") + minutes;
//   const formattedSeconds = (seconds < 10 ? "0" : "") + seconds;

//   // Construct the date and time string in the format dd/mm/yy hh:min
//   return `${formattedDay}/${formattedMonth}/${formattedYear} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
// }
function checkStatus(status) {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Approved";
    case 2:
      return "Cancelled";
    default:
      return "-";
  }
}
function getFormattedDateTime() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // January is 0
  const year = currentDate.getFullYear() % 100; // Get last two digits of year
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // Add leading zero if the number is less than 10
  const formattedDay = (day < 10 ? "0" : "") + day;
  const formattedMonth = (month < 10 ? "0" : "") + month;
  const formattedYear = (year < 10 ? "0" : "") + year;
  const formattedHours = (hours < 10 ? "0" : "") + hours;
  const formattedMinutes = (minutes < 10 ? "0" : "") + minutes;

  // Construct the date and time string in the format dd/mm/yy hh:min
  return `${formattedDay}/${formattedMonth}/${formattedYear} ${formattedHours}:${formattedMinutes}`;
}
function formatdate(dates, ismonthprev) {
  const date = new Date(dates);
  const day = date.getDate();
  const month = date.getMonth() + 1; // January is 0
  const year = date.getFullYear() % 100; // Get last two digits of year
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Add leading zero if the number is less than 10
  const formattedDay = (day < 10 ? "0" : "") + day;
  const formattedMonth = (month < 10 ? "0" : "") + month;
  // const formattedYear = (year < 10 ? "0" : "") + year;
  const formattedHours = (hours < 10 ? "0" : "") + hours;
  const formattedMinutes = (minutes < 10 ? "0" : "") + minutes;
  const formattedSeconds = (seconds < 10 ? "0" : "") + seconds;

  // const formattedDate = `${formattedDay}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  let formattedDate;
  if (ismonthprev === true) {
    formattedDate = `${formattedMonth}/${formattedDay}/${date.getFullYear()} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    formattedDate = `${formattedDay}/${formattedMonth}/${date.getFullYear()} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return formattedDate;
}
const AuctionCard = ({
  selectedSaleProgram,
  formData,
  generateYearOptions,
  handleYearChange,
  saleNumber,
  setSelectedSaleProgram,
  isDisabled,
  isEdit,
  resateForm,
  year,
  setYears,
  setSaleDate,
  selectedSalePrograms,
  setSelectedSalePrograms,
  saleProgramDetailList,
  setSaleProgramDetailList,
  currentDate,
  saleDates,
  setSaleDates,
  closingDate,
  setClosingDate,
  selectedSaleNo,
  setSelectedSaleNo,
  publishingDate,
  setPublishingDate,
  uploadedFiles,
  setUploadedFiles,
  numRows,
  setNumRows,
  handleChange,
  setExpanded,
  setLotConfiguration,
  lotConfiguration,
  auctionVarient,
  setAuctionVarient,
  setPrsAuctionSessionId,
  prsAuctionSessionId,
  isChecked,
  setIsChecked,
  averageInPercentage,
  setAverageInPercentage,
  modalRight,
  auctionType,
  auctionTypeCode,
}) => {
  const dispatch = useDispatch();
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId } =
    useAuctionDetail();
  const componentRef = useRef();

  const auctionCenter = useSelector(
    (state) => state.auction.auctionCenter.responseData
  );
  const saleProgramList = useSelector(
    (state) => state.sale.saleProgramList.responseData
  );
  const [teaTypeList, setTeaTeatypeList] = useState([]);

  const saleProgramDetail = useSelector((state) => state);
  const [salePromtDate, setSalePromtDate] = useState([]);
  const [SaleProgramId, setSaleProgramId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const baseUrlEng =
    auctionType === "ENGLISH" ? "EnglishAuctionSaleProgram" : "SaleProgram";

  const exists = useSelector((state) => state.auction.saleNumber);
  const auctionDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Array of auction days
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [removeFiles, setRemoveFile] = useState(null);
  const [minDate, setMinDate] = useState("");
  const [status, setStatus] = useState(null);
  const [saleNo, setSaleNo] = useState([]);
  const [open, setOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState([]);

  const [Exceldatafordownload, setExceldatafordownload] = useState([]);
  const [ExceldatafordownloadfirstRow, setExceldatafordownloadfirstRow] =
    useState([]);
  const [hideButtons, setHideButtons] = useState(false);

  const [documentIdd, setDocumentIdd] = useState(0);
  const [uploadDocument, setUploadDocument] = useState(false);

  const [dynamicTimeless, setDynamicTimeless] = useState(1);
  // const [auctionVarient, setAuctionVarient] = useState("Batch Wise");
  const [isOn, setIsOn] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [Remarksval, setRemarksval] = useState("");

  const columnsdata = [
    { name: "teaTypeName", title: "Tea Type Name" },
    { name: "saleDate", title: "Sale Date" },
    { name: "buyersPromptDate", title: "Buyers Prompt Date" },
    { name: "sellersPromptDate", title: "Sellers Prompt Date" },
    { name: "status", title: "Status" },
  ];

  const columnsdataNew = [
    { name: "season", title: "Season" },
    { name: "saleNo", title: "Sale No" },
    { name: "catalogClosingDate", title: "Catalog Closing Date" },
    { name: "catalogPublishingDate", title: "Catalog Publishing Date" },
    { name: "noOfAuctionDays", title: "No Of Auction Days" },
    { name: "averageinPercentage", title: "Average in Percentage" },
    { name: "priceMovement", title: "priceMovement" },
    // { name: "status", title: "Status" },

    { name: "pop", title: "pop" },
  ];

  //SBP Data List
  const [SBPDataList, setSBPDataList] = useState([]);
  const toggleSwitch = () => {
    setIsOn(!isOn);
  };
  const teaType = useSelector(
    (state) => state.teaType.teaTypeList.responseData
  );

  const saleDateData = useSelector(
    (state) => state?.auction?.promptDates?.responseData
  );

  useEffect(() => {
    setSalePromtDate(saleDateData?.at(0));
  }, [saleDateData]);

  // useEffect(() => {
  //   var newdata = [];
  //   newdata.push(uploadedFiles);
  //   if (uploadedFiles?.length > 0) {
  //     setSelectedFiles([...uploadedFiles]);
  //   }
  // }, [uploadedFiles]);

  useEffect(() => {
    dispatch(teaTypeAction({ auctionCenterId }));
    setLotConfiguration(5);
    axiosMain
      .get(`/preauction/Common/BindSaleNo`)
      .then((response) => {
        if (response.status === 200) {
          // Assuming the response contains the SaleProgram data
          // console.log(response.data)
          setSaleNo(response.data.responseData);
        } else {
          CustomToast.error("API call failed.");
        }
      })
      .catch((error) => {
        CustomToast.error("An error occurred.");
      });
    //set Business Rule when edit false
  }, []);

  useEffect(() => {
    setTeaTeatypeList(teaType);
    // if (teaType?.length > 0) {
    //   setSelectedSaleProgram(
    //     [...selectedSalePrograms].map((ele) => {
    //       ele.teaTypeId = teaType?.at(0)?.teatypeId;
    //     })
    //   );
    // }
  }, [teaType]);

  // Get the total number of pages based on the number of items and the page size
  const totalPages = Math.ceil(numRows / pageSize);

  // Generate an array of page numbers
  const pageNumbers = Array?.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // Get the items to display on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(
    startIndex + pageSize,
    isNaN(numRows) || numRows === 0
      ? isEdit
        ? selectedSalePrograms.length
        : 1
      : numRows
  );
  const itemsOnPage = Array?.from(
    {
      length:
        isNaN(numRows) || numRows === 0
          ? isEdit
            ? selectedSalePrograms.length
            : 1
          : numRows,
    },
    (_, index) => index + startIndex
  );

  useEffect(() => {
    setTeaTeatypeList(teaType);
  }, [teaType]);

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setSaleProgramDetailList(
      saleProgramDetail.sale.saleProgramDetails.responseData
    );

    if (
      saleProgramDetail.sale.saleProgramDetails.responseData?.at(0)
        .auctionDetails !== undefined
    ) {
      setSelectedSalePrograms(
        saleProgramDetail.sale.saleProgramDetails.responseData?.at(0)
          .auctionDetails
      );
    }

    // console.log(
    //   saleProgramDetail.sale.saleProgramDetails.responseData?.at(0)
    //     .auctionDetails,
    //   "saleProgramDetail"
    // );

    //Business Rule
    // saleProgramDetail.sale.saleProgramDetails.responseData?.at(0)
    if (isEdit === true || isDisabled === true) {
      if (
        saleProgramDetail?.sale?.saleProgramDetails?.responseData?.at(0)
          .SaleProgramId !== null &&
        saleProgramDetail?.sale?.saleProgramDetails?.responseData?.length > 0
      ) {
        // axiosMain
        //   .post(
        //     "/preauction/BusinessRule/GetBusinessRuleByID?prsAuctionSessionId=" +
        //       3
        //   )
        //   .then((response) => {
        // Handle the successful response here
        // console.log("EditResponse:", saleProgramDetail?.sale?.saleProgramDetails?.responseData?.businessRule?.at(0));
        setPrsAuctionSessionId(
          saleProgramDetail?.sale?.saleProgramDetails?.responseData[0]
            ?.businessRule[0]?.prsAuctionSessionId
        );
        setLotConfiguration(
          saleProgramDetail?.sale?.saleProgramDetails?.responseData[0]
            ?.businessRule[0]?.noOfActiveLots
        );
        setAuctionVarient(
          saleProgramDetail?.sale?.saleProgramDetails?.responseData[0]
            ?.businessRule[0]?.auctionVariant === 1
            ? "Batch Wise"
            : "Batch Split"
        );

        // })
        // .catch((error) => {
        //   // Handle any errors here
        //   console.error("Error:", error);
        // });
      }
    }
  }, [saleProgramDetail]);

  useEffect(() => {
    if (saleProgramDetailList?.length > 0) {
      setYears(saleProgramDetailList?.map((ele) => ele.season))?.at(0);
      setSelectedSaleNo(saleProgramDetailList?.map((ele) => ele.saleNo));
      setClosingDate(
        saleProgramDetailList?.map((ele) =>
          ele.catalogClosingDate?.split("T")?.at(0)
        )
      );
      setPublishingDate(
        saleProgramDetailList?.map((ele) =>
          ele.catalogPublishingDate?.split("T")?.at(0)
        )
      );
      //SDP
      setRemarksval(saleProgramDetailList[0]?.remarks);
      setAverageInPercentage(saleProgramDetailList[0]?.averageinPercentage);
      if (saleProgramDetailList[0]?.priceMovement === 1) {
        setIsChecked(true);
      } else setIsChecked(false);

      setNumRows(saleProgramDetailList?.map((ele) => ele.noOfAuctionDays));

      setUploadedFiles(
        saleProgramDetailList?.map((ele) => ele?.documentDetails)[0]
      );

      // setStatus(saleProgramDetailList?.map((ele) => ele?.documentDetails)[0]);

      // setSelectedSalePrograms(
      //   saleProgramDetailList?.map((ele) => ele?.auctionDetails)[0]
      // );
      setSaleProgramId(saleProgramDetailList?.map((ele) => ele?.SaleProgramId));
      // setFormattedDate(saleProgramDetailList?.map((ele) => ele?.documentDateAndTime))
      //SDP
      //
      let exceldatanew = [];
      const newData = {
        season: saleProgramDetailList[0]?.season,
        saleNo: saleProgramDetailList[0]?.saleNo,
        catalogClosingDate: saleProgramDetailList[0]?.catalogClosingDate,
        catalogPublishingDate: saleProgramDetailList[0]?.catalogPublishingDate,
        noOfAuctionDays: saleProgramDetailList[0]?.noOfAuctionDays,
        // status: saleProgramDetailList[0]?.status,
        priceMovement:
          saleProgramDetailList[0]?.priceMovement === 0 ? "-" : "+",
        averageinPercentage: saleProgramDetailList[0]?.averageinPercentage,
      };
      exceldatanew.push(newData);
      // exceldatanew=exceldatanew?.map((item)=>{
      //   switch (item.status) {
      //     case 0:
      //       return { ...item, status: "Pending" };
      //     case 1:
      //       return { ...item, status: "Active" };
      //     case 2:
      //       return { ...item, status: "Completed" };
      //     case 3:
      //       return { ...item, status: "Cancelled" };
      //     default:
      //       return { ...item, status: "-" };
      //   }
      // })
      function statusret(status) {
        switch (status) {
          case 0:
            return "Pending";
          case 1:
            return "Active";
          case 2:
            return "Completed";
          case 3:
            return "Cancelled";
          default:
            return "-";
        }
      }
      setExceldatafordownload(exceldatanew);

      const newDetails = saleProgramDetailList[0]?.auctionDetails?.map(
        (item) => {
          switch (item.status) {
            case 0:
              return { ...item, status: "Pending" };
            case 1:
              return { ...item, status: "Active" };
            case 2:
              return { ...item, status: "Completed" };
            case 3:
              return { ...item, status: "Cancelled" };
            default:
              return { ...item, status: "-" };
          }
        }
      );
      setExceldatafordownloadfirstRow(newDetails);
    } else {
    }
  }, [saleProgramDetailList]);

  // useEffect(() => {
  //   document.getElementById("fileInput").value = "";
  // }, [uploadedFiles]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredKeys = [
      "teaTypeId",
      "saleDate",
      "buyersPromptDate",
      "sellersPromptDate",
    ];

    // if (!closingDate || !publishingDate || !saleDates) {
    //   CustomToast.error('Please fill in all the form fields');
    //   return;
    // }

    //
    function hasRequiredKeys(obj, keys) {
      return keys?.every((key) => obj?.hasOwnProperty(key));
    }

    const isAllKeysPresent = selectedSalePrograms?.some((item) =>
      hasRequiredKeys(item, requiredKeys)
    );

    const dataList = itemsOnPage
      .slice(startIndex, endIndex)
      ?.map((item, itemindex) =>
        [...selectedSalePrograms]?.filter((ele, index) =>
          index !== itemindex ? (ele.isActive = false) : (ele.isActive = true)
        )
      );

    console.log(dataList, "dataListdataList");

    // if (selectedSalePrograms?.length !== numRows) {
    //   CustomToast.error("Auction Details fields is missing.!");
    //   return;
    // }
    console.log(isAllKeysPresent, "isAllKeysPresent");
    if (numRows === 0) {
      CustomToast.error("Please select/enter No. of Auction Days");
      return;
    }
    if (!isAllKeysPresent) {
      CustomToast.error("Please select/enter No. of Auction Days");
      return;
    }

    // if (saleNo !== null) {
    //   // CustomToast.error("This sale no is already exist");
    //   axiosMain
    //     .post("/preauction/" + auctionType === "ENGLISH"
    // ? "EnglishAuctionSaleProgram"
    // : "SaleProgram" + "/IsSaleNoExist")
    //     .then((res) => {
    //       if (res.data.statusCode === 403) {
    //         CustomToast.error(res.data.massage);
    //         return;
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    //   return;
    // }

    const formattedDate1 = new Date(publishingDate);
    const formattedDate2 = new Date(closingDate);

    // if (publishingDate < currentDate) {
    //   CustomToast.error(
    //     "Catalog Publishing Date should be greater than catalog closing date"
    //   );
    //   return;
    // }

    if (formattedDate1 <= formattedDate2) {
      CustomToast.error(
        "Catalog closing date should be lesser than catalog publishing date."
      );
      return;
    }
    if (!selectedSaleNo) {
      CustomToast.error("Please select a sale number");
      return;
    }

    if (!closingDate) {
      CustomToast.error("Please enter the closing date");
      return;
    }

    if (!publishingDate) {
      CustomToast.error("Please enter the publishing date");
      return;
    }

    if (!selectedSaleNo && isEdit == false) {
      CustomToast.error("Please select a sale number");
      return;
    }
    // if (!uploadedFiles.length > 0 && isEdit == false) {
    //   CustomToast.error("Please upload a file");
    //   return;
    // }
    if (lotConfiguration === "" && lotConfiguration === 0) {
      CustomToast.error("Please Fill Lot Configuration");
      return;
    }
    setSelectedSalePrograms([
      ...selectedSalePrograms.filter((item) =>
        item?.teaTypeId === ""
          ? (item.teaTypeId = teaTypeList[0]?.teaTypeName)
          : item.teaTypeId
      ),
    ]);

    if (isEdit == true) {
      const data = selectedSalePrograms.map((ele, index) =>
        index <= numRows - 1 == true
          ? (ele.isActive = true)
          : (ele.isActive = false)
      );

      console.log(
        // MainDataList,
        data,
        selectedSalePrograms,
        // numRows,
        "numRows"
      );
      const businessruledata = {
        prsAuctionSessionId: parseInt(prsAuctionSessionId),
        dynamicTimeless: auctionType === "ENGLISH" ? 2 : 1,
        auctionVariant: auctionVarient === "Batch Wise" ? 1 : 2,
        noOfActiveLots: parseInt(lotConfiguration),
      };

      const formData = {
        SaleProgramId: SaleProgramId?.at(0),
        systemBasePrice: 260,
        priceMovement: isChecked === false ? 0 : 1,
        averageinPercentage: parseInt(
          averageInPercentage !== "" ? averageInPercentage : 0
        ),
        season: typeof year == "object" ? year[0] : year,
        saleNo: parseInt(selectedSaleNo),
        catalogClosingDate:
          typeof closingDate == "object" ? closingDate[0] : closingDate,
        catalogPublishingDate:
          typeof publishingDate == "object"
            ? publishingDate[0]
            : publishingDate,
        createdBy: userId,
        updatedBy: userId,
        auctionCenterId: auctionCenterId,
        auctionTypeCode: auctionType,
        noOfAuctionDays: parseInt(numRows),
        status: 0,
        auctionDate: getMinimumSaleDate(selectedSalePrograms),
        auctionDays: selectedSalePrograms
          ?.map((ele, index) =>
            ele.saleProgramDetailId !== undefined
              ? ele.saleProgramDetailId ===
                selectedSalePrograms
                  ?.filter((ele, index) => index + 1 <= parseInt(numRows))
                  ?.at(index)?.saleProgramDetailId
                ? {
                  ...ele,
                  isActive: true,
                }
                : {
                  ...ele,
                  isActive: false,
                }
              : index + 1 <= parseInt(numRows) && {
                ...ele,
                isActive: true,
              }
          )
          .filter((ele) => ele !== false),
        documentList:
          uploadedFiles == []
            ? uploadedFiles[0]?.length > 0
              ? uploadedFiles[0]?.map((ele) => {
                return {
                  DocumentSize: ele.DocumentSize,
                  documentBrief: ele?.documentBrief,
                  documentId: ele.documentId,
                  // contentType: ele.contentType,
                  documentName: ele?.documentName,
                  // documentPath: ele?.documentPath,
                  status: 0,
                };
              })
              : uploadedFiles
            : uploadedFiles,
        businessRule: businessruledata,
      };

      formData.documentList === null
        ? (formData.documentList = [])
        : (formData.documentList = formData.documentList);

      if (auctionType === "ENGLISH") {
        delete formData.systemBasePrice;
        delete formData.priceMovement;
        delete formData.averageinPercentage;
      }
      // resateForm();
      // console.log(formData, "formDataformData");
      // dispatch(updateSaleProgramRequest(formData));
      axiosMain
        .post(`/preauction/${baseUrlEng}/UpdateSaleProgram`, formData)
        .then((res) => {
          if (res.data.statusCode === 200) {
            CustomToast.success(res.data.message);
            resateForm();
            setExpanded("panel1");
            handleChange("panel1");
          } else {
            CustomToast.warning(res.data.message);
          }
        });
      // setExpanded("panel1");
      // handleChange("panel1");
    } else {
      const businessruledata = {
        dynamicTimeless: auctionType === "ENGLISH" ? 2 : 1,
        auctionVariant: auctionVarient === "Batch Wise" ? 1 : 2,
        noOfActiveLots: parseInt(lotConfiguration),
      };

      const formData = {
        season: year,
        saleNo: parseInt(selectedSaleNo),
        catalogClosingDate: closingDate,
        catalogPublishingDate: publishingDate,
        createdBy: userId,
        noOfAuctionDays: parseInt(numRows),
        status: 0,
        auctionDate: getMinimumSaleDate(selectedSalePrograms),
        auctionDays: selectedSalePrograms?.filter(
          (ele, index) => index + 1 <= parseInt(numRows)
        ),
        documentList: uploadedFiles,
        auctionCenterId: auctionCenterId,
        systemBasePrice: 260,
        priceMovement: isChecked === false ? 0 : 1,
        averageinPercentage: parseInt(
          averageInPercentage !== "" ? averageInPercentage : 0
        ),
        businessRule: businessruledata,
      };
      //console.log(formData, "formData");
      // dispatch(createSaleProgramRequest(formData));
      if (auctionType === "ENGLISH") {
        delete formData.systemBasePrice;
        delete formData.priceMovement;
        delete formData.averageinPercentage;
      }
      axiosMain
        .post(`/preauction/${baseUrlEng}/CreateSaleProgram`, {
          ...formData,
          auctionTypeCode: auctionTypeCode,
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            CustomToast.success(res.data.message);
            resateForm();
            setExpanded("panel1");
            handleChange("panel1");
          } else {
            CustomToast.warning(res.data.message);
          }
        });
    }
    //Business Rule
    // let conbsdata = [];
    // let url = "";
    // if (lotConfiguration !== "" && lotConfiguration !== 0) {
    //   if (prsAuctionSessionId === "" || prsAuctionSessionId === 0) {
    //     conbsdata = {
    //       SaleProgramId: SaleProgramId?.at(0),
    //       //auctionSessionLotConfiguration: 0,//parseInt(values.auctionSession),
    //       dynamicTimeless: 1,
    //       auctionVariant: auctionVarient === "Batch Wise" ? 1 : 2,
    //       noOfActiveLots: parseInt(lotConfiguration),
    //       createdBy: 1,
    //     };
    //     url = "/preauction/BusinessRule/CreateBusinessRule";
    //   } else {
    //     conbsdata = {
    //       prsAuctionSessionId: parseInt(prsAuctionSessionId),
    //       SaleProgramId: SaleProgramId?.at(0),
    //       //auctionSessionLotConfiguration: 0,//parseInt(values.auctionSession),
    //       dynamicTimeless: 1,
    //       auctionVariant: auctionVarient === "Batch Wise" ? 1 : 2,
    //       noOfActiveLots: parseInt(lotConfiguration),
    //       updatedBy: 15,
    //     };
    //     url = "/preauction/BusinessRule/UpdateBusinessRule";
    //   }

    //   axiosMain
    //     .post(url, conbsdata)
    //     .then((response) => {
    //       setPrsAuctionSessionId(0);
    //       setLotConfiguration(5);
    //       // Handle the successful response here
    //       console.log("Response:", response.data);
    //       // if (response.data.statusCode == 200) {
    //       //   CustomToast.success(response.data.message);

    //       //   // createformik.resetForm();
    //       //   // setIsEdit(false);
    //       // } else CustomToast.error(response.data.message);
    //     })
    //     .catch((error) => {
    //       // Handle any errors here
    //       console.error("Error:", error);
    //     });
    // }
  };
  function getMinimumSaleDate(auctionDays) {
    if (!Array.isArray(auctionDays) || auctionDays.length === 0) {
      // CustomToast.error("Auction Days is missing !");
      return null;
    }

    // Extract the saleDates from the auctionDays array
    const saleDates = auctionDays.map((ele) => ele.saleDate);

    // Find the minimum sale date using the reduce function
    const minSaleDate = saleDates.reduce((minDate, currentDate) => {
      return currentDate < minDate ? currentDate : minDate;
    });

    return minSaleDate;
  }

  const handleAuctionDaysChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    const data = selectedSalePrograms.map((ele, index) =>
      index <= numRows - 1 ? (ele.isActive = true) : (ele.isActive = false)
    );

    if (isEdit) {
      axiosMain
        .post(`/preauction/${baseUrlEng}/ValidateNoOfDays`, {
          season: year?.at(0),
          saleNo: parseInt(selectedSaleNo),
          saleDate: selectedSalePrograms
            .filter(
              (ele, index) =>
                index !== 0 &&
                index <= selectedSalePrograms.length - selectedValue
            )
            .map((ele) => ele.saleDate.split("T")?.at(0) + " " + "00:00:00.000")
            .join(","),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            setNumRows(selectedValue);
          } else {
            CustomToast.warning(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setNumRows(selectedValue);
    }
    console.log(
      selectedSalePrograms.length - selectedValue,
      selectedValue,
      data,
      selectedSalePrograms
        .filter(
          (ele, index) =>
            index !== 0 && index <= selectedSalePrograms.length - selectedValue
        )
        .map((ele) => ele.saleDate + " " + "00:00:00.000")
        .join(",")
    );
  };
  ///SDP Business Rule
  const handledynamicTimeless = (e) => {
    const selectedValue = e.target.value;
    setDynamicTimeless(1);
  };
  const handledAuctionVarient = (e) => {
    const selectedValue = e.target.value;
    console.log(selectedValue, "selectedValue");
    setAuctionVarient(selectedValue);
  };
  const handlelotConfig = (e) => {
    const selectedValue = parseInt(e.target.value);
    setLotConfiguration(selectedValue);
  };
  ///

  if (exists === false) {
    CustomToast.error("You are not allowed to create a sale program");
  } else if (exists === true) {
    CustomToast.success("You can create a sale program");
  }

  const renderFileTypeIcon = (file) => {
    const extension = file.name?.split(".").pop().toLowerCase();

    if (extension === "pdf") {
      return <AiOutlineFilePdf />;
    } else if (
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png"
    ) {
      return <AiOutlineFileImage />;
    } else if (extension === "txt") {
      return <AiOutlineFileText />;
    } else {
      return <AiOutlineFile />;
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    URL.revokeObjectURL(updatedFiles[index].path); // Release the object URL
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
    setRemoveFile(null);
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
  };
  const handleSaleNoChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue !== null) {
      axiosMain
        .post(`/preauction/${baseUrlEng}/IsSaleNoExist`, {
          season: year,
          saleNo: parseInt(selectedValue),
          auctionCenterId: auctionCenterId,
        })
        .then((res) => {
          if (res.data.statusCode === 403) {
            CustomToast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // CustomToast.success("You can create a sale program");
    }

    setSelectedSaleNo(selectedValue);
  };

  // if (!exists || !saleProgramDetail) {
  //   return (
  //     <div>
  //       <NoData />
  //     </div>
  //   ); // Show a message when no data is available
  // }
  const handleSaleDateChange = (e) => {
    const selectedSaleDate = e.target.value;
    setSaleDates(selectedSaleDate);
  };
  // Function to update the state for a specific row/item

  const updateSelectedSaleProgram = (index, updatedProgram) => {
    const updatedPrograms = [...selectedSalePrograms];
    updatedPrograms[index] = updatedProgram;

    // You can perform the API call regardless of whether saleDate is available or not
    if (updatedProgram.saleDate) {
      const apiUrl = "/preauction/SaleProgram/GetPromptDateByAuctionCenter";
      const requestData = {
        auctionCenterId: auctionCenterId,
        auctionTypeCode: auctionTypeCode,
        saleDate: updatedPrograms[index].saleDate,
      };

      axiosMain
        .post(
          auctionType === "ENGLISH"
            ? "/preauction/EnglishAuctionSaleProgram/GetPromptDateByAuctionCenter"
            : apiUrl,
          requestData
        )
        .then((response) => {
          if (response.data.statusCode === 204) {
            CustomToast.warning(response.data.massage);
          } else {
            const { buyersPromptDate, sellersPromptDate } =
              response.data.responseData[0];

            const combinedObject = {
              ...updatedPrograms[index],
              sellersPromptDate,
              buyersPromptDate,
            };
            updatedPrograms[index] = combinedObject;
            // updatedPrograms[index] = updatedProgram;
            setSelectedSalePrograms(updatedPrograms);
          }
        });
    } else {
      // If saleDate is not available, you can update the selectedSalePrograms directly
      setSelectedSalePrograms(updatedPrograms);
    }
    // setSelectedSalePrograms(updatedPrograms);
  };

  const updateSelectedsalebuyerSaleProgram = (index, updatedProgram) => {
    const updatedPrograms = [...selectedSalePrograms];
    updatedPrograms[index] = updatedProgram;

    // You can perform the API call regardless of whether saleDate is available or not
    if (updatedProgram.saleDate) {
      // const apiUrl = "/preauction/" + auctionType === "ENGLISH"
      // ? "EnglishAuctionSaleProgram"
      // : "SaleProgram" + "/GetPromptDateByAuctionCenter";
      // const requestData = {
      //   auctionCenterId: auctionCenterId,
      //   saleDate: updatedPrograms[index].saleDate,
      // };

      // axiosMain.post(apiUrl, requestData).then((response) => {
      //   if (response.data.statusCode === 204) {
      //     CustomToast.warning(response.data.massage);
      //   } else {
      // const { buyersPromptDate, sellersPromptDate } =
      //   response.data.responseData[0];

      // const combinedObject = {
      //   ...updatedPrograms[index],
      //   sellersPromptDate,
      //   buyersPromptDate,
      // };
      //updatedPrograms[index] = combinedObject;
      updatedPrograms[index] = updatedProgram;
      setSelectedSalePrograms(updatedPrograms);
      //}
      //});
    } else {
      // If saleDate is not available, you can update the selectedSalePrograms directly
      setSelectedSalePrograms(updatedPrograms);
    }
    // setSelectedSalePrograms(updatedPrograms);
  };

  const updateFileBrief = (index, brief) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles[index].documentBrief = brief;
    updatedFiles[index].status = 0;
    // setUploadedFiles(updatedFiles);
    setSelectedFiles(updatedFiles);
  };

  const handleCencal = () => {
    const formData = {
      SaleProgramId: SaleProgramId?.at(0),
      season: typeof year == "object" ? year[0] : year,
      saleNo: parseInt(selectedSaleNo),
      catalogClosingDate:
        typeof closingDate == "object" ? closingDate[0] : closingDate,
      catalogPublishingDate:
        typeof publishingDate == "object" ? publishingDate[0] : publishingDate,
      createdBy: userId,
      updatedBy: userId,
      auctionCenterId: auctionCenterId,
      noOfAuctionDays: parseInt(numRows),
      status: 0,
      remarks: remark,
      auctionDate: typeof saleDates == "object" ? saleDates[0] : saleDates,
      auctionDays: selectedSalePrograms.map((ele) => {
        return {
          buyersPromptDate: ele.buyersPromptDate,
          saleDate: ele.saleDate,
          saleProgramDetailId: ele.saleProgramDetailId,
          sellersPromptDate: ele.sellersPromptDate,
          status: 0,
          teaTypeId: ele.teaTypeId,
          teaTypeName: ele.teaTypeName,
        };
      }),
      documentList:
        uploadedFiles == []
          ? uploadedFiles[0]?.map((ele) => {
            return {
              DocumentSize: ele.DocumentSize,
              documentBrief: ele.documentBrief,
              // contentType: ele.contentType,
              documentId: ele.documentId,
              documentName: ele.documentName,
              // documentPath: ele.documentPath,
              status: 0,
            };
          })
          : uploadedFiles,
    };

    dispatch(cancelSaleProgramRequest(formData));
  };

  const cancelDocument = (documentId) => {
    const documentData = {
      SaleProgramId: SaleProgramId?.at(0),
      documentId: documentId,
      updatedBy: userId,
    };

    setUploadedFiles([
      ...uploadedFiles.filter((ele) => ele.documentId !== documentId),
    ]);
    dispatch(cancelSaleProgramDocumentRequest(documentData));
  };
  const approveDocument = (documentId) => {
    // const documentData = {
    //   SaleProgramId: SaleProgramId?.at(0),
    //   documentId: documentId,
    //   updatedBy: userId,
    // };

    // setUploadedFiles([
    //   ...uploadedFiles.filter((ele) => ele.documentId !== documentId),
    // ]);
    axiosMain
      .post(
        `/preauction/${baseUrlEng}/ApproveDocument?documentId=` + documentId
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          CustomToast.success(response.data.message);
          //when success calling doocument bind api calling bi id
          axiosMain
            .post(
              `/preauction/${baseUrlEng}/GetSaleProgramById?SaleProgramId=${SaleProgramId}`
            )
            .then((response) => {
              if (response.status === 200) {
                const saleProgram = response.data;
                // const { SaleProgramId, documentDetails } =
                //   saleProgram.responseData?.at(0); // Assuming the response contains the SaleProgram data
                console.log("Sale Program:", saleProgram.responseData);
                setUploadedFiles(
                  saleProgram?.responseData?.at(0).documentDetails
                );
              } else {
                CustomToast.error("API call failed.");
              }
            })
            .catch((error) => {
              CustomToast.error("An error occurred.");
            });
        } else {
          CustomToast.error(response.data.message);
        }
        // console.log(response, "invresponse");
      })
      .catch((error) => {
        // Handle errors here
      });
  };

  function getStatusText(status) {
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
  }
  const allowedFileExtensions = [
    "txt",
    "zip",
    "pdf",
    "jpg",
    "jpeg",
    "gif",
    "bmp",
    "png",
    "tif",
    "tiff",
    "doc",
    "xls",
    "ppt",
    "pps",
    "dxf",
    "docx",
    "xlsx",
    "eml",
    "rar",
  ];

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (selectedFiles === null) {
      selectedFiles = [];
    }
    const updatedFiles = [...selectedFiles];
    const existingFileNames = updatedFiles.map(
      (uploadedFile) => uploadedFile.documentName.split(".")[0]
    );

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      const isExistingFile = existingFileNames.includes(file.name);
      const isSameNameDifferentExtension = existingFileNames.includes(
        fileNameWithoutExtension
      );
      if (isExistingFile || isSameNameDifferentExtension) {
        CustomToast.warning(`File "${file.name}" already exists.`);
        continue; // Skip this file and proceed to the next one
      }
      if (
        !allowedFileExtensions.includes(fileExtension) ||
        existingFileNames.includes(fileNameWithoutExtension)
      ) {
        CustomToast.error(
          `File "${file.name}" is not allowed or already exists.`
        );
        continue; // Skip this file and proceed to the next one
      }
      if (file.size <= MAX_FILE_SIZE) {
        try {
          // Read the file content as a Base64 string using FileReader and async/await
          const base64Content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              // Extract the Base64 content from the data URI
              const base64String = event.target.result.split(",")[1];
              resolve(base64String);
            };

            reader.onerror = (event) => {
              reject(event.target.error);
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
          });

          const fileInfo = {
            documentName: file.name,
            // documentPath: "xyz/xyz.jpeg",
            documentBrief: "", // Empty document brief, you can set the actual brief value
            DocumentSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
            status: 0,
            documentBytes: base64Content, // Store the Base64 content in fileInfo
            // contentType: file.type,
            documentDateAndTime: formatdate(new Date(), true),
          };
          updatedFiles.push(fileInfo);
        } catch (error) {
          console.error("Error reading the file:", error);
          // Handle the error as per your requirement (e.g., show an error message)
        }
      } else {
        // CustomToast.error(`File "${file.name}" has more than 10MB.`);
        CustomToast.error(`The file size should not exceed 10 MB.`);
      }
    }

    // Update the state after all files have been processed
    setSelectedFiles(updatedFiles);
  };

  const handleClosingDate = (e) => {
    const inputValue = e.target.value;
    const currentDate = new Date();

    const inputDate = new Date(inputValue);
    const publishingDates = new Date(publishingDate);

    if (publishingDate !== "") {
      if (inputDate > currentDate) {
        setClosingDate(e.target.value);
      } else {
        // The input date is equal to or earlier than the current date
        CustomToast.error(
          "Catalog closing date should be lesser than catalog publishing date."
        );
      }
    } else {
      if (publishingDates > inputDate) {
        setClosingDate(e.target.value);
      } else {
        // The input date is equal to or earlier than the current date
        CustomToast.error(
          "Catalog closing date should be lesser than catalog publishing date."
        );
      }
    }
  };

  const handlePublicingDate = (e) => {
    const pubDate = new Date(e.target.value);
    const nextDayDate = new Date(pubDate);

    const publisceingDate = new Date(e.target.value);
    const closingDates = new Date(closingDate);

    const closingMonth = closingDate?.split("-")[1];
    const publisceingMonth = e.target.value?.split("-")[1];

    if (publisceingDate > closingDates) {
      nextDayDate.setDate(pubDate?.getDate() + 1);
      setMinDate(nextDayDate?.toISOString()?.split("T")?.at(0));
      setPublishingDate(e.target.value);
    } else {
      CustomToast.error(
        "Catalog Publishing Date should be greater than catalog closing date."
      );
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")?.at(0);
  };

  const handleSwitchChange = () => {
    setIsChecked(!isChecked);
  };

  const NoOfAuctionDaysOptions = () => {
    let options = [];
    for (let i = 1; i <= 7; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };
  return (
    <>
      <ConfirmationModal
        show={openDelete}
        remarkShow={false}
        isokbutton="Yes"
        title="Are you sure you want to cancel this document?"
        onDelete={() => {
          const documentData = {
            SaleProgramId: SaleProgramId?.at(0),
            documentId: documentIdd,
            updatedBy: userId,
          };

          axiosMain
            .post(
              `/preauction/${auctionType === "ENGLISH"
                ? "EnglishAuctionSaleProgram"
                : "SaleProgram"
              }/CancelSaleProgramDocument`,
              documentData
            )
            .then((res) => {
              if (res.data.statusCode === 200) {
                setDocumentIdd(0);
                setUploadedFiles([
                  ...uploadedFiles.filter(
                    (ele) => ele.documentId !== documentIdd
                  ),
                ]);
                CustomToast.success("Document cancelled successfully");
              } else {
                CustomToast.error("Failed to Cancle Document");
              }
            });

          // dispatch(cancelSaleProgramDocumentRequest(documentData));

          setOpenDelete(false);
        }}
        onHide={() => setOpenDelete(false)}
      />

      <form onSubmit={handleSubmit} className="p-2">
        <div className="row" ref={componentRef}>
          <div className="col-12">
            <div className="row g-2 g-lg-3">
              <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                <FormLabel>Season</FormLabel>
                <FormControl
                  as="select"
                  name="age1"
                  value={year || ""}
                  disabled={isEdit ? true : isDisabled}
                  onChange={(e) => setYears(e.target.value)}
                >
                  {generateYearOptions()}
                </FormControl>
              </FormGroup>
              <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                <FormLabel>Sale No</FormLabel>
                <FormControl
                  as="select"
                  value={selectedSaleNo || ""}
                  onChange={handleSaleNoChange}
                  size="sm"
                  disabled={isEdit ? true : isDisabled}
                >
                  {saleNo?.map((e) => (
                    <option key={e.saleNo} value={e.saleNo}>
                      {e.saleNo}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
              <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                <FormLabel>Catalog Closing Date</FormLabel>
                <FormControl
                  as="input"
                  type="date"
                  size="sm"
                  // value={closingDate}
                  value={
                    isEdit == true || isDisabled == true
                      ? typeof closingDate == "object"
                        ? closingDate[0]
                        : closingDate
                      : closingDate
                  }
                  disabled={isDisabled}
                  onChange={(e) => handleClosingDate(e)}
                  min={getMinDate()} // Set the minimum date allowed
                />
              </FormGroup>
              <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                <FormLabel>Catalog Publish Date</FormLabel>
                <FormControl
                  as="input"
                  type="date"
                  size="sm"
                  // value={publishingDate}
                  value={
                    isEdit == true || isDisabled == true
                      ? publishingDate
                      : publishingDate || ""
                  }
                  // min={
                  //   typeof closingDate == "object"
                  //     ? closingDate[0]
                  //     : closingDate
                  // }
                  disabled={isDisabled}
                  onChange={(e) => handlePublicingDate(e)}
                />
              </FormGroup>
              {/* <FormGroup className="col-xl-2 col-lg-2 col-md-4"> */}
              {/* <FormLabel>No. of Auction Days</FormLabel> */}
              {/* <FormControl
                  as="select"
                  // value={numRows || auctionDays[0]}
                  value={numRows}
                  disabled={isDisabled}
                  onChange={handleAuctionDaysChange}
                  size="sm"
                >
                  <option value="0">Please Select Auction Days</option>
                  {auctionDays?.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </FormControl> */}
              <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                <FormLabel>No. of Auction Days</FormLabel>
                <FormControl
                  as="select"
                  value={numRows}
                  disabled={isDisabled}
                  onChange={handleAuctionDaysChange}
                >
                  <option value={0}>Please Select</option>
                  {NoOfAuctionDaysOptions()}
                </FormControl>
              </FormGroup>
              {/* <div className="FormGroup"></div> */}
              <br />
              {/* </FormGroup> */}
              {/* <FormGroup className="col-xl-2 col-lg-2 col-md-4"></FormGroup> */}
            </div>

            {auctionType === "ENGLISH"
              ? ""
              : modalRight?.includes("35") && (
                <>
                  <h5
                    className="mt-2"
                    style={{
                      "font-size": "15px",
                      color: "#444444",
                      "font-weight": "600",
                    }}
                  >
                    {/* {isEdit === true ? "Edit Business Rule" : "Create Business Rule"} */}
                    SBP Configration
                  </h5>
                  <div className="row">
                    <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                      <FormLabel>Average in Percentage </FormLabel>
                      <FormControl
                        as="select"
                        name="age1"
                        value={averageInPercentage || ""}
                        // disabled={isEdit ? true : isDisabled}
                        disabled={isDisabled}
                        onChange={(e) =>
                          setAverageInPercentage(e.target.value)
                        }
                      >
                        {Array.from(
                          { length: 10 },
                          (_, index) => index + 1
                        ).map((number) => (
                          <option key={number} value={number}>
                            {number}
                          </option>
                        ))}
                      </FormControl>
                    </FormGroup>
                    <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                      <label>
                        {/* <span>{"Price Movement (+ / -)"}</span> */}
                        <FormLabel>{"Price Movement (+ / -)"} </FormLabel>

                        <br />
                        <Switch
                          onChange={handleSwitchChange}
                          checked={isChecked}
                          disabled={isDisabled}
                          uncheckedIcon={
                            <div
                              style={{
                                backgroundColor: "#183e29",
                              }}
                            ></div>
                          }
                          checkedIcon={""}
                          uncheckedHandleIcon={
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "90%",
                                color: "#183e29",
                                fontSize: 20,
                              }}
                            >
                              -
                            </div>
                          }
                          checkedHandleIcon={
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "90%",
                                color: "#183e29",
                                fontSize: 20,
                              }}
                            >
                              +
                            </div>
                          }
                          className="react-switch"
                        />
                      </label>
                    </FormGroup>
                  </div>
                </>
              )}
            {/* <div
              className="row"
              onClick={() => setHideButtons(true)}
              style={{ display: hideButtons ? "none" : "flex", width: "7%" }}
            >
              <div className="col-6">
                <ExportData
                  data={componentRef}
                  fileName="saleProgram.pdf"
                  exportType={"pdf"}
                />
              </div>
              <div className="col-6">
                <ExportData
                  columnsdataNew={columnsdata}
                  dataNew={ExceldatafordownloadfirstRow}
                  columnsdata={columnsdataNew}
                  data={Exceldatafordownload}
                  fileName="saleProgram"
                  exportType={"downloadExcel"}
                />
              </div>
            </div>
             */}

            {isDisabled !== true ? (
              <div className="col-auto">
                <div className="BtnGroup">
                  <Tooltip
                    title={
                      isEdit === true
                        ? "Update Sale Program"
                        : "Create Sale Program"
                    }
                    placement="top"
                  >
                    {modalRight?.includes("1") || modalRight?.includes("2") ? (
                      <Button className="SubmitBtn" type="submit">
                        {isEdit === true ? "Update" : "Submit"}
                      </Button>
                    ) : (
                      ""
                    )}
                  </Tooltip>
                  {/* <Button
                    type="button"
                    className="SubmitBtn ml-2"
                    onClick={() => {
                      setOpen(true);
                      axiosMain
                        .post("/preauction/${baseUrlEng}/ConfigureSBP", {
                          auctionCenterId: auctionCenterId,
                          season: "2023",
                          priceMovement: isChecked ? 1 : 0,
                          averageinPercentage: parseInt(averageInPercentage),
                        })
                        .then((res) => {
                          if (res.data.statusCode === 200) {
                            setSBPDataList(res.data.responseData);
                          } else {
                            setSBPDataList([]);
                          }
                        })
                        .catch((err) => console.log(err));
                    }}
                    id="resetButton"
                  >
                    Configure SBP
                  </Button> */}
                  {/* <Button
                    className="SubmitBtn ml-2"
                    onClick={() => resateForm()}
                    id="resetButton"
                  >
                    <i className="fa fa-refresh"></i>
                  </Button> */}
                </div>
              </div>
            ) : (
              // <div
              //   onClick={() => setHideButtons(true)}
              //   style={{ display: hideButtons ? "none" : "block" }}
              // >
              //   <ExportData
              //     data={componentRef}
              //     fileName="saleProgram.pdf"
              //     exportType={"pdf"}
              //   />
              //   <ExportData
              //     columnsdataNew={columnsdata}
              //     dataNew={ExceldatafordownloadfirstRow}
              //     columnsdata={columnsdataNew}
              //     data={Exceldatafordownload}
              //     fileName="saleProgram"
              //     exportType={"downloadExcel"}
              //   />
              // </div>
              <div
                className="row"
                // onClick={() => setHideButtons(true)}
                style={{ display: hideButtons ? "none" : "flex", width: "7%" }}
              >
                <Tooltip title="Export in PDF" placement="top">
                  <div className="col-6">
                    <ExportData
                      data={componentRef}
                      fileName="saleProgram.pdf"
                      exportType={"pdf"}
                    />
                  </div>
                </Tooltip>
                <Tooltip title="Export as Excel" placement="top">
                  <div className="col-6">
                    <ExportData
                      columnsdataNew={columnsdata}
                      dataNew={ExceldatafordownloadfirstRow}
                      columnsdata={columnsdataNew}
                      data={Exceldatafordownload}
                      fileName="saleProgram"
                      exportType={"downloadExcel"}
                    />
                  </div>
                </Tooltip>
              </div>
            )}
          </div>

          <div className="col-12 mt-4">
            <Card className="p-2">
              <Table>
                <thead>
                  <tr>
                    <th>Tea Type</th>
                    <th>Sale Date</th>
                    <th>Buyer's Prompt Date</th>
                    <th>Seller's Prompt Date</th>
                    {(isDisabled === true || isEdit === true) && (<th>Remarks</th>)}
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parseInt(numRows) > 0
                    ? itemsOnPage
                      .slice(startIndex, endIndex)
                      ?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <FormControl
                              as="select"
                              disabled={isDisabled}
                              size="sm"
                              value={
                                selectedSalePrograms[index]?.teaTypeId || ""
                              }
                              onChange={(e) => {
                                const updatedProgram = {
                                  ...selectedSalePrograms[index],
                                  teaTypeId: parseInt(e.target.value),
                                };
                                updateSelectedSaleProgram(
                                  index,
                                  updatedProgram
                                );
                              }}
                            >
                              <option value="">Select Teatype</option>
                              {teaTypeList?.length > 0
                                ? teaTypeList?.map((item, index) => (
                                  <option value={item?.teaTypeId}>
                                    {item.teaTypeName}
                                  </option>
                                ))
                                : "No Data"}
                            </FormControl>
                          </td>
                          <td>
                            <input
                              type="date"
                              id="saleDate"
                              value={
                                selectedSalePrograms[index]?.saleDate?.split(
                                  "T"
                                )[0] || ""
                              }
                              disabled={isDisabled}
                              onChange={(e) => {
                                const updatedProgram = {
                                  ...selectedSalePrograms[index],
                                  saleDate: e.target.value,
                                };
                                updateSelectedSaleProgram(
                                  index,
                                  updatedProgram
                                );
                              }}
                              min={minDate}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              disabled={isDisabled}
                              // disabled={isDisabled || isEdit}
                              onChange={(e) => {
                                const updatedProgram = {
                                  ...selectedSalePrograms[index],
                                  buyersPromptDate: e.target.value,
                                };
                                updateSelectedsalebuyerSaleProgram(
                                  index,
                                  updatedProgram
                                );
                              }}
                              value={
                                selectedSalePrograms[index]?.buyersPromptDate
                                  ?.split("T")
                                  ?.at(0) || ""
                              }
                            />
                          </td>
                          <td>
                            <input
                              disabled={isDisabled}
                              // disabled={isDisabled || isEdit}
                              onChange={(e) => {
                                const updatedProgram = {
                                  ...selectedSalePrograms[index],
                                  sellersPromptDate: e.target.value,
                                };
                                updateSelectedsalebuyerSaleProgram(
                                  index,
                                  updatedProgram
                                );
                              }}
                              type="date"
                              value={
                                selectedSalePrograms[index]?.sellersPromptDate
                                  ?.split("T")
                                  ?.at(0) || ""
                                // selectedSalePrograms[index]?.sellersPromptDate?
                              }
                            />
                          </td>
                          {(isDisabled === true || isEdit === true) && (<td>{Remarksval === null ? "-" : Remarksval}</td>)}
                          <td>
                            {selectedSalePrograms[index]?.status === null
                              ? "-"
                              : selectedSalePrograms[index]?.status === 0
                                ? "Pending"
                                : selectedSalePrograms[index]?.status === 1
                                  ? "Active"
                                  : selectedSalePrograms[index]?.status === 2
                                    ? "Completed"
                                    : selectedSalePrograms[index]?.status === 3
                                      ? "Cancelled"
                                      : "-"}
                          </td>
                        </tr>
                      ))
                    : ""}
                </tbody>
              </Table>

              <div>
                <ul className="pagination">
                  {/* Previous page button */}
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {/* Page buttons */}
                  {pageNumbers.map((page) => (
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  {/* Next page button */}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
        {isDisabled
          ? modalRight?.includes("6") && (
            <Card className="mt-3 FileUploadBox">
              <Card.Body>
                <Card.Title>File Upload</Card.Title>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Document Name</th>
                      <th>Document brief</th>
                      <th>Document Size</th>
                      <th>Status</th>
                      <th>Document Uploaded Date & Time</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles?.map((file, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <span>
                            {isDisabled == true || isEdit == true
                              ? file?.documentName
                              : file?.documentName}
                          </span>
                        </td>

                        <td>
                          <input
                            type="text"
                            value={
                              isDisabled == true || isEdit == true
                                ? file?.documentBrief
                                : file?.documentBrief
                            }
                            onChange={(event) =>
                              updateFileBrief(index, event.target.value)
                            }
                            placeholder="Enter document brief"
                            disabled={isDisabled}
                            required
                          />
                        </td>
                        <td>{file?.DocumentSize}</td>
                        <td>
                          {isDisabled == true || isEdit == true ? (
                            <>
                              {file?.status === 0
                                ? "Pending"
                                : file?.status === 1
                                  ? "Approved"
                                  : file?.status === 2
                                    ? "Cancelled"
                                    : ""}
                            </>
                          ) : (
                            ""
                          )}
                        </td>
                        <td>
                          {isDisabled == true || isEdit == true
                            ? file?.documentDateAndTime !== null ||
                              file?.documentDateAndTime != ""
                              ? formatdate(file?.documentDateAndTime, false)
                              : ""
                            : getFormattedDateTime()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
              {status !== null && isEdit ? <div>{status}</div> : ""}
            </Card>
          )
          : modalRight?.includes("6") && (
            <Card className="mt-3 FileUploadBox">
              <Card.Body>
                <Card.Title>File Upload</Card.Title>
                <ul style={{ "font-weight": "bold" }}>
                  <li>
                    ● Any number of files should be allowed to upload. Maximum
                    file size should not exceed 10 MB
                  </li>
                  <li>
                    ● Acceptable file types should be: *.txt, *.zip, *.pdf,
                    *.jpeg, *.gif, *.bmp, *.png, *.tif, *.tiff, *.doc, *.xls,
                    *.ppt, *.pps, *.dxf, *. docx, *.xlsx, *.eml,*.rar
                  </li>
                </ul>
                <br></br>
                <div className="FileUpload p-2 mb-3">
                  <Button
                    className="btn"
                    onClick={() => setUploadDocument(true)}
                  >
                    {isEdit ? "Update Document" : "Upload Document"}
                  </Button>
                </div>

                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Document Name</th>
                      <th>Document brief</th>
                      <th>Document Size</th>
                      <th>Status</th>
                      <th>Document Uploaded Date & Time</th>

                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles?.map((file, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <span>
                            {isDisabled == true || isEdit == true
                              ? file?.documentName
                              : file?.documentName}
                          </span>
                        </td>
                        <td>
                          {isDisabled == true || isEdit == true
                            ? file?.documentBrief
                            : file?.documentBrief}
                          {/* <input
                            type="text"
                            value={
                              isDisabled == true || isEdit == true
                                ? file?.documentBrief
                                : file?.documentBrief
                            }
                            onChange={(event) =>
                              updateFileBrief(index, event.target.value)
                            }
                            placeholder="Enter document brief"
                            disabled={isDisabled}
                            required
                          /> */}
                        </td>
                        <td>{file?.DocumentSize}</td>
                        <td>
                          {/* {isDisabled == true || isEdit == true ? (
                              <> */}
                          {file?.status === 0
                            ? "Pending"
                            : file?.status === 1
                              ? "Approved"
                              : file?.status === 2
                                ? "Cancelled"
                                : ""}

                        </td>
                        <td>
                          {isDisabled == true || isEdit == true
                            ? file?.documentDateAndTime !== null ||
                              file?.documentDateAndTime != ""
                              ? formatdate(file?.documentDateAndTime, false)
                              : ""
                            : getFormattedDateTime()}
                        </td>


                        <td>
                          {isDisabled === true ? (
                            <>
                              <DownloadFile
                                documentName={file.documentName}
                                documentBytes={file.documentBytes}
                                element={
                                  <i
                                    className="fa fa-download"
                                    style={{
                                      color: "green",
                                      cursor: "pointer",
                                    }}
                                  ></i>
                                }
                              />
                              {/* <a href={file.documentPath} download={file.documentName}>
                      
                    </a> */}
                            </>
                          ) : isEdit ? (
                            file?.status === 1 ? (
                              <>
                                <DownloadFile
                                  documentName={file.documentName}
                                  documentBytes={file.documentBytes}
                                  element={
                                    <i
                                      className="fa fa-download"
                                      style={{
                                        color: "green",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  }
                                />
                                <button
                                  style={{
                                    backgroundColor: "transparent",
                                    cursor: "pointer",
                                  }}
                                  type="button"
                                  // onClick={() => cancelDocument(file.documentId)}
                                  onClick={() => {
                                    setDocumentIdd(file.documentId);
                                    setOpenDelete(true);
                                  }}
                                >
                                  <i
                                    className="fa fa-cancel"
                                    style={{
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                  ></i>
                                </button>
                              </>
                            ) : (
                              <>
                                <DownloadFile
                                  documentName={file.documentName}
                                  documentBytes={file.documentBytes}
                                  element={
                                    <i
                                      className="fa fa-download"
                                      style={{
                                        color: "green",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  }
                                />
                                <button
                                  style={{
                                    backgroundColor: "transparent",
                                    cursor: "pointer",
                                  }}
                                  type="button"
                                  // onClick={() => cancelDocument(file.documentId)}
                                  onClick={() => {
                                    setDocumentIdd(file.documentId);
                                    { file?.documentId !== undefined ? setOpenDelete(true) : setRemoveFile(index) }
                                  }}
                                >
                                  <i
                                    className="fa fa-cancel"
                                    style={{
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                  ></i>
                                </button>
                                {file?.documentId !== undefined && (<button
                                  style={{
                                    backgroundColor: "transparent",
                                    cursor: "pointer",
                                  }}
                                  type="button"
                                  onClick={() =>
                                    approveDocument(file.documentId)
                                  }
                                >
                                  <i
                                    className="fa fa-check"
                                    style={{
                                      color: "green",
                                      cursor: "pointer",
                                    }}
                                  ></i>
                                </button>)}
                              </>
                            )
                          ) : (
                            <>
                              <DownloadFile
                                documentName={file.documentName}
                                documentBytes={file.documentBytes}
                                element={
                                  <i
                                    className="fa fa-download"
                                    style={{
                                      color: "green",
                                      cursor: "pointer",
                                    }}
                                  ></i>
                                }
                              />
                              <button
                                style={{
                                  backgroundColor: "transparent",
                                  cursor: "pointer",
                                }}
                                type="button"
                                onClick={() => setRemoveFile(index)}
                              >
                                <i
                                  className="fa fa-cancel"
                                  style={{ color: "red", cursor: "pointer" }}
                                ></i>
                              </button>
                              {/* <i
                            className="fa fa-times"
                            onClick={() => removeFile(index)}
                          ></i> */}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
              {/* {status !== null && isEdit ? <div>{status}</div> : ""} */}
            </Card>
          )}

        {modalRight?.includes("30") ||
          modalRight?.includes("31") ||
          modalRight?.includes("32") ? (
          <card className="mt-3 FileUploadBox card">
            <Card.Body>
              <Card.Title>
                {isEdit === true
                  ? "Edit Business Rule"
                  : "Create Business Rule"}
              </Card.Title>
              <div className="row">
                <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                  <FormLabel>Auction Session / Lot Configuration</FormLabel>
                  <div>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Check
                          type="checkbox"
                          id="timeless"
                          name="timeless"
                          disabled="true"
                          label={
                            auctionType === "ENGLISH"
                              ? "Dynamic + Static"
                              : "Dynamic + Timeless"
                          }
                          checked="true"
                          onChange={handledynamicTimeless}
                        />
                      </div>

                      <div className="col-md-2">
                        <Tooltip
                          title={`•	Dynamic: This configuration will not have any fixed session time (No fixed session time). The session time defined by the TAO will be flexible and can automatically be preponed or postponed by the system and the start time of the next session will be after 10 mins from the end time of the previous session.
                            •	Timeless: This auction configuration will not have any time-limit (No time limit). The lot will remain active till one bidder is left alone, the system will check if the (Maximum Bid Price) MBP of sole bidder is greater than (Reserve Price) RP, then the Lot will be sold else it will be unsold.`}
                        >
                          <InfoOutlinedIcon style={{ margin: " 0 0 0 -19%" }} />
                        </Tooltip>
                      </div>
                    </div>

                    {/* Add more options as needed  */}
                  </div>
                </FormGroup>
                <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                  <FormLabel>Auction Variant </FormLabel>
                  <div>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Check
                          type="radio"
                          label="Batch Wise"
                          id="variantOption1"
                          name="auctionVariant"
                          value="Batch Wise"
                          disabled={isDisabled}
                          // checked={
                          //   auctionVarient === "Batch Wise" && isEdit === true
                          //     ? auctionVarient
                          //     : "Batch Wise"
                          // }
                          checked={
                            auctionVarient === "Batch Wise" ? true : false
                          }
                          onChange={handledAuctionVarient}
                        />
                      </div>

                      <div className="col-md-2">
                        <Tooltip
                          title={
                            "•	On this configuration, the total batch of 6 lots will wait to be sold or unsold. Once all the 6 lots will get sold or unsold, then only the new 6 lots will come replacing the old lots."
                          }
                        >
                          <InfoOutlinedIcon style={{ margin: " 0 0 0 -19%" }} />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <Form.Check
                          type="radio"
                          label="Batch Split"
                          id="variantOption2"
                          name="auctionVariant2"
                          value="Batch Split"
                          disabled={isDisabled}
                          checked={
                            auctionVarient === "Batch Split" ? true : false
                          }
                          onChange={handledAuctionVarient}
                        />
                      </div>

                      <div className="col-md-2">
                        <Tooltip
                          title={
                            "•	On this configuration, If at a time six lots are active and three or more than three lots have been sold or unsold, then those lots will be replaced by the same number of new lots and total number of active lots will remain same that is six."
                          }
                        >
                          <InfoOutlinedIcon style={{ margin: " 0 0 0 -19%" }} />
                        </Tooltip>
                      </div>
                    </div>

                    {/* Add more options as needed  */}
                  </div>
                </FormGroup>

                {auctionType === "ENGLISH" ? (
                  <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                    <FormLabel>Auction Type</FormLabel>
                    <FormControl
                      as="input"
                      type="text"
                      id="auctionName"
                      name="auctionName"
                      value={auctionType}
                      disabled
                    />
                  </FormGroup>
                ) : (
                  <FormGroup className="col-xl-2 col-lg-2 col-md-4">
                    <FormLabel>No Of Active Lots</FormLabel>
                    <FormControl
                      as="input"
                      type="number"
                      id="activeLots"
                      name="activeLots"
                      disabled={isDisabled}
                      onChange={handlelotConfig}
                      value={lotConfiguration}
                    />
                  </FormGroup>
                )}
              </div>
            </Card.Body>
          </card>
        ) : (
          ""
        )}

        {/* </>)
          : ("")} */}
      </form>

      <ConfirmationModal
        show={showModal}
        onHide={closeModal}
        onDelete={handleCencal}
        setRemark={setRemark}
        title={"Are you sure you want to delete this document?"}
      />
      <Modal
        title="File Upload"
        show={uploadDocument}
        handleClose={() => setUploadDocument(false)}
        size="xl"
      >
        <div className="row">
          <div className="col-md-6">
            <input
              type="file"
              multiple
              // onChange={handleFileUpload}
              id="fileInput"
              onChange={handleFileUpload}
              disabled={isDisabled}
            />
          </div>
          <div className="col-md-6">
            <Button
              className="w-25 text-center"
              onClick={() => {
                // setSelectedFiles(uploadedFiles);
                if (selectedFiles.length > 0) {
                  let rowNo = selectedFiles.map((ele, index) => ele.documentBrief === "" ? index + 1 : "").filter(ele => ele !== "")
                  if (rowNo?.length > 0) {
                    CustomToast.error("Please Enter Document Bref in this row No" + rowNo.join(" , "))
                  } else {

                    if (uploadedFiles?.length > 0)
                      setUploadedFiles([...uploadedFiles, ...selectedFiles]);
                    else
                      setUploadedFiles(selectedFiles);
                    
                    CustomToast.success("File uploaded successfully");
                    console.log(selectedFiles, "selectedFilesselectedFiles")

                    setSelectedFiles([])
                    setUploadDocument(false);
                  }

                } else {
                  CustomToast.error("Please Select File to Upload");
                }
              }}
            >
              Upload
            </Button>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Document Name</th>
              <th>Document brief</th>
              <th>Document Size</th>
              <th>Status</th>
              <th>Document Uploaded Date & Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedFiles?.map((file, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <span>
                    {isDisabled == true || isEdit == true
                      ? file?.documentName
                      : file?.documentName}
                  </span>
                </td>
                {/* <td>
                            {isDisabled == true || isEdit == true ? (
                              <>
                                {file?.status === 0
                                  ? "Pending"
                                  : file?.status === 1
                                  ? "Approved"
                                  : file?.status === 2
                                  ? "Cancelled"
                                  : ""}
                              </>
                            ) : (
                              ""
                            )}
                          </td> */}
                <td>
                  <input
                    type="text"
                    value={
                      isDisabled == true || isEdit == true
                        ? file?.documentBrief
                        : file?.documentBrief
                    }
                    onChange={(event) =>
                      updateFileBrief(index, event.target.value)
                    }
                    placeholder="Enter document brief"
                    disabled={isDisabled}
                    required
                  />
                </td>
                <td>{file?.DocumentSize}</td>
                <td>
                  {/* {isDisabled == true || isEdit == true ? (
                    <> */}
                  {file?.status === 0
                    ? "Pending"
                    : file?.status === 1
                      ? "Approved"
                      : file?.status === 2
                        ? "Cancelled"
                        : ""}


                </td>
                <td>
                  {isDisabled == true || isEdit == true
                    ? file?.documentDateAndTime !== null ||
                      file?.documentDateAndTime != ""
                      ? formatdate(file?.documentDateAndTime, false)
                      : ""
                    : getFormattedDateTime()}
                </td>

                <td>
                  {isDisabled === true ? (
                    <>
                      <DownloadFile
                        documentName={file.documentName}
                        documentBytes={file.documentBytes}
                        element={
                          <i
                            className="fa fa-download"
                            style={{
                              color: "green",
                              cursor: "pointer",
                            }}
                          ></i>
                        }
                      />
                      {/* <a href={file.documentPath} download={file.documentName}>
                      
                    </a> */}
                    </>
                  ) : isEdit ? (
                    file?.status === 1 ? (
                      <>
                        <DownloadFile
                          documentName={file.documentName}
                          documentBytes={file.documentBytes}
                          element={
                            <i
                              className="fa fa-download"
                              style={{
                                color: "green",
                                cursor: "pointer",
                              }}
                            ></i>
                          }
                        />
                        <button
                          style={{
                            backgroundColor: "transparent",
                            cursor: "pointer",
                          }}
                          type="button"
                          // onClick={() => cancelDocument(file.documentId)}
                          onClick={() => {
                            setDocumentIdd(file.documentId);
                            setOpenDelete(true);
                          }}
                        >
                          <i
                            className="fa fa-cancel"
                            style={{
                              color: "red",
                              cursor: "pointer",
                            }}
                          ></i>
                        </button>
                      </>
                    ) : (
                      <>
                        <DownloadFile
                          documentName={file.documentName}
                          documentBytes={file.documentBytes}
                          element={
                            <i
                              className="fa fa-download"
                              style={{
                                color: "green",
                                cursor: "pointer",
                              }}
                            ></i>
                          }
                        />
                        <button
                          style={{
                            backgroundColor: "transparent",
                            cursor: "pointer",
                          }}
                          type="button"
                          // onClick={() => cancelDocument(file.documentId)}
                          onClick={() => {
                            setDocumentIdd(file.documentId);
                            { file?.documentId !== undefined ? setOpenDelete(true) : setRemoveFile(index) }
                          }}
                        >
                          <i
                            className="fa fa-cancel"
                            style={{
                              color: "red",
                              cursor: "pointer",
                            }}
                          ></i>
                        </button>
                        {file?.documentId !== undefined && (<button
                          style={{
                            backgroundColor: "transparent",
                            cursor: "pointer",
                          }}
                          type="button"
                          onClick={() => approveDocument(file.documentId)}
                        >
                          <i
                            className="fa fa-check"
                            style={{
                              color: "green",
                              cursor: "pointer",
                            }}
                          ></i>
                        </button>)}
                      </>
                    )
                  ) : (
                    <>
                      <DownloadFile
                        documentName={file.documentName}
                        documentBytes={file.documentBytes}
                        element={
                          <i
                            className="fa fa-download"
                            style={{
                              color: "green",
                              cursor: "pointer",
                            }}
                          ></i>
                        }
                      />
                      <button
                        style={{
                          backgroundColor: "transparent",
                          cursor: "pointer",
                        }}
                        type="button"
                        onClick={() => setRemoveFile(index)}
                      >
                        <i
                          className="fa fa-cancel"
                          style={{ color: "red", cursor: "pointer" }}
                        ></i>
                      </button>
                      {/* <i
                            className="fa fa-times"
                            onClick={() => removeFile(index)}
                          ></i> */}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
      <Modal
        title="Are you sure you want to delete this document?"
        show={removeFiles !== null}
        handleClose={() => setRemoveFile(null)}
        size="l"
      >
        <div className="btn-group">
          <Button onClick={() => removeFile(removeFiles)}>Yes</Button>
          <Button className="ms-3" onClick={() => setRemoveFile(null)}>
            No
          </Button>
        </div>
      </Modal>
      <Modal
        title="Sale Program master"
        show={open}
        handleClose={() => setOpen(false)}
        size="l"
      >
        <TableComponent
          columns={[{ title: "SBP", name: "SBP" }]}
          rows={SBPDataList}
          //setRows={setRows}
          addpagination={true}
          dragdrop={false}
          fixedColumnsOn={false}
          resizeingCol={false}
          selectionCol={true}
          sorting={true}
        />
      </Modal>
      {/* <ToastContainer autoClose={1000} /> */}
    </>
  );
};

export default AuctionCard;
