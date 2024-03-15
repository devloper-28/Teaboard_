import React, { useEffect, useState } from "react";
import Modal from "../../../../components/common/Modal";
import CommonTable from "../../../../components/tableComponent/CommonTable";
import { Button, Card, Form, FormControl, InputGroup, NavItem } from "react-bootstrap";
import Accordion from "@mui/material/Accordion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AuctionCard from "../maintanance/Maintananse";
import TableComponent from "../../../../components/tableComponent/TableComponent";
import ConfirmationModal from "../../../../components/common/DeleteConfirmationModal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  fetchSaleProgramDetailsRequest,
  fetchSaleProgramListRequest,
  getSaleNoRequest,
} from "../../../../store/actions";
import NoData from "../../../../components/nodata/NoData";
import { FileUpload, SettingsCellOutlined } from "@mui/icons-material";
import axios from "axios";
import axiosMain from "../../../../http/axios/axios_main";
import DownloadFile from "../../../../components/common/download/DownloadFile";
import ConfirmationModalWithExcel from "../../../../components/common/ConfirmationModalWithExcel";
import CustomToast from "../../../../components/Toast";
import { useAuctionDetail } from "../../../../components/common/AunctioneerDeteailProvider";
import { Tooltip } from "@mui/material";

const currentDate = new Date().toISOString()?.split("T")[0];
const nextcurrentDate = new Date(); // Current date and time
nextcurrentDate.setDate(nextcurrentDate.getDate() + 1); // Add 1 day to the current date

const nextDate = nextcurrentDate.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
console.log(nextDate, "nextDate");

const getMinDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split("T")[0];
};

function SaleModal({ modalRight }) {
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
  const saleProgramList = useSelector(
    (state) => state.sale.saleProgramList.responseData
  );
  const [saleNumber, setSaleNumber] = useState([]);

  //form hooks
  const [isChecked, setIsChecked] = useState(false);

  const [selectedSaleProgram, setSelectedSaleProgram] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [numRows, setNumRows] = useState(0); //useState(1); // State to track the number of rows
  const [saleDate, setSaleDate] = useState("");
  const [rows, setRows] = useState(saleProgramList);
  const [totalCount, setTotalCount] = useState(0);
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [selectedSaleNo, setSelectedSaleNo] = useState(1);
  const [closingDate, setClosingDate] = useState(nextDate ? nextDate : "");
  const [publishingDate, setPublishingDate] = useState(nextDate);
  const [openDelete, setOpenDelete] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [year, setYears] = useState(currentDate?.split("-")[0]);
  const [sellsNo, setSellNo] = useState(0);
  const [selectedSalePrograms, setSelectedSalePrograms] = useState([]);
  const [saleProgramDetailList, setSaleProgramDetailList] = useState([]);
  const [lotConfiguration, setLotConfiguration] = useState(5);
  const [prsAuctionSessionId, setPrsAuctionSessionId] = useState(0);
  const [averageInPercentage, setAverageInPercentage] = useState(1);
  const [auctionVarient, setAuctionVarient] = useState("Batch Wise");
  const [auctionType, setAuctionType] = useState(auction);
  const [auctionTypeCode, setAuctionTypeCode] = useState(auctionTypeMasterCode);
  const baseUrlEng =
    auction === "ENGLISH" ? "EnglishAuctionSaleProgram" : "SaleProgram";
  const salesNo = useSelector(
    (state) => state?.auction?.saleNumber?.responseData
  );

  useEffect(() => {
    setRows(saleProgramList);
  }, [saleProgramList]);
  useEffect(() => {
    dispatch(
      fetchSaleProgramListRequest({ season, pageNumber, pageSize, baseUrlEng })
    );
    dispatch(getSaleNoRequest());
    let auctionCenterIds = auctionCenterId;
    const reqdata = {
      auctionCenterId: auctionCenterIds,
      season: year.toString(),
    };
    axiosMain
      .post(`/preauction/Common/BindAllSaleNoBySeason`, reqdata)
      .then((res) => setSaleNumber(res.data.responseData))
      .catch((err) => CustomToast.error(err));
  }, []);

  useEffect(() => {
    console.log(auctionCenterId, "auctionCenterId");
    let auctionCenterIds = auctionCenterId;
    const reqdata = {
      auctionCenterId: auctionCenterIds,
      season: year.toString(),
    };

    axiosMain
      .post(`/preauction/Common/BindAllSaleNoBySeason`, reqdata)
      .then((res) => setSaleNumber(res.data.responseData))
      .catch((err) => CustomToast.error(err));
  }, [year]);

  const [actionData, setActionData] = useState({
    view: {},
    edit: {},
  });
  const [expanded, setExpanded] = useState("panel1");

  const [originalRows, setOriginalRows] = useState([]);

  const resateForm = () => {
    setYears(currentDate?.split("-")[0]);
    setNumRows(0);
    setSelectedSaleNo(1);
    setSaleDate(currentDate);
    setPublishingDate(nextDate);
    setClosingDate(nextDate);
    setUploadedFiles([]);
    setIsDisabled(false);
    setSelectedSaleProgram([]);
    setSelectedSalePrograms([]);
  };
  useEffect(() => {
    if (expanded === "panel1") {
      let auctionCenterIds = auctionCenterId;
      const reqdata = {
        auctionCenterId: auctionCenterIds,
        season: year.toString(),
      };
      axiosMain
        .post(`/preauction/Common/BindAllSaleNoBySeason`, reqdata)
        .then((res) => setSaleNumber(res.data.responseData))
        .catch((err) => CustomToast.error(err));
      dispatch(
        fetchSaleProgramListRequest({
          season,
          pageNumber,
          pageSize,
          baseUrlEng,
        })
      );
      dispatch(getSaleNoRequest());
      setLotConfiguration(5);
      setAuctionVarient("Batch Wise");
      setPrsAuctionSessionId(0);
      resateForm();
      setAuctionType(auction);
      setAuctionTypeCode(auctionTypeMasterCode);
    }
  }, [expanded]);

  const handleChange = (panel) => (event, isExpanded) => {
    // if (isExpanded === "panel1") {
    //   // dispatch(
    //   //   fetchSaleProgramListRequest({
    //   //     season,
    //   //     pageNumber,
    //   //     pageSize,
    //   //     baseUrlEng,
    //   //   })
    //   // );

    // }

    setExpanded(isExpanded ? panel : false);
    setIsDisabled(false);
    setIsEdit(false);
    setSelectedSaleProgram([]);
    setSelectedSalePrograms([]);
    setSaleProgramDetailList([]);
    setYears(currentDate?.split("-")[0]);
    setNumRows(0);
    // setNumRows(0);
    setSelectedSaleNo(1);
    setSaleDate(currentDate);
    setPublishingDate(nextDate);
    setClosingDate(nextDate);
    setUploadedFiles([]);
    //setIsDisabled(false);
    setIsChecked(false);
    setAverageInPercentage(1);
    setAuctionType(auction);
    setAuctionTypeCode(auctionTypeMasterCode);
  };
  const handleYearChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: parseInt(value), // Convert the value to an integer
    }));
  };
  const season = new Date().getFullYear().toString();
  const saleNo = "";
  const pageNumber = 1;
  const pageSize = 200;

  // Dispatch the action on component mount

  const handleRefresh = () => {
    dispatch(
      fetchSaleProgramListRequest({ season, pageNumber, pageSize, baseUrlEng })
    );
  };

  useEffect(() => {
    setRows(searchData);
  }, [searchData]);

  // console.log(saleProgramList, "POLO");
  const data = [
    { id: 1, name: "John", age: 25 },
    { id: 2, name: "Jane", age: 30 },
    { id: 3, name: "Alice", age: 28 },
  ];

  const columns = ["ID", "Name", "Age"];

  const handleDelete = (row) => {
    // Delete the row from the data array
    console.log("Deleting row:", row);
  };
  const [formData, setFormData] = useState({
    age1: "",
    age2: "",
    age3: "",
    age4: "",
    age5: "",
    age6: "",
    age7: "",
    age8: "",
    age9: "",
    age10: "",
    age11: "",
    age12: "",
    age13: "",
    age14: "",
    age15: "",
  });

  function getSaleProgramById(SaleProgramIds, baseUrl) {
    axiosMain
      .post(
        `/preauction/${baseUrl}/GetSaleProgramById?SaleProgramId=${SaleProgramIds}`
      )
      .then((response) => {
        if (response.status === 200) {
          const saleProgram = response.data;
          const { SaleProgramId, documentDetails } =
            saleProgram.responseData?.at(0); // Assuming the response contains the SaleProgram data
          console.log("Sale Program:", saleProgram.responseData);

          let data = {
            SaleProgramId: SaleProgramId,
            updatedBy: userId,
            createdBy: userId,
            documentList: documentDetails,
          };
          setActionData({ ...actionData, delete: data });
        } else {
          CustomToast.error("API call failed.");
        }
      })
      .catch((error) => {
        CustomToast.error("An error occurred.");
      });
  }
  const handleDownload = (documentName, documentBytes) => {
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
  };
  function downloaDocumentById(SaleProgramIds, baseUrl, statusdata) {
    axiosMain
      .post(
        `/preauction/${baseUrl}/GetSaleProgramById?SaleProgramId=${SaleProgramIds}`
      )
      .then((response) => {
        if (response.status === 200) {
          const saleProgram = response.data;
          const { SaleProgramId, documentDetails, status } =
            saleProgram.responseData?.at(0); // Assuming the response contains the SaleProgram data
          console.log("Sale Program:", saleProgram.responseData);

          if (documentDetails === null) {
            CustomToast.error("There is no any files to download");
          } else {
            if (statusdata === 3) {
              if (documentDetails?.filter((itm) => (itm.Flag === 2)).length === 0) {
                CustomToast.error("There is no any files to download");
              }
              else {
                documentDetails?.filter((itm) => (itm.Flag === 2)).map((ele) =>
                  handleDownload(ele.documentName, ele.documentBytes))
              }


            }
            else {
              documentDetails?.map((ele) =>
                handleDownload(ele.documentName, ele.documentBytes)
              )
            }


          }
        } else {
          CustomToast.error("API call failed.");
        }
      })
      .catch((error) => {
        CustomToast.error("An error occurred.");
      });
  }

  const handleSearch = () => {
    // Filter the originalRows data based on the selected values in the form

    const data = {
      season: typeof year == "object" ? year?.at(0) : year,
      saleNo: parseInt(sellsNo),
      pageNumber: 1,
      pageSize: 1000,
      auctionCenterId: auctionCenterId,
    };

    try {
      axiosMain
        .post(`/preauction/${baseUrlEng}/GetSaleProgramList`, data)
        .then((response) => setSearchData(response.data.responseData));
    } catch (error) {
      console.error("Error calling POST API:", error);
    }

    // console.log(data, "😘");

    // Update the rows state with the filtered data
    // setRows(filteredRows);
  };

  const ActionArea = (row) => {
    function handleAction(action) {
      setExpanded("panel2");

      switch (action) {
        // case "view": {
        //   return dispatch(
        //     fetchSaleProgramDetailsRequest(row.data.saleProgramDetailId)
        //   );
        // }
        case "view": {
          const saleProgramDetail = row.data;
          setAuctionTypeCode(saleProgramDetail?.auctionTypeCode);
          setAuctionType(
            saleProgramDetail?.auctionTypeCode?.replace(/[-_](.)/g, (_, c) =>
              c.toUpperCase()
            )
          );
          setSelectedSaleProgram(saleProgramDetail);
          setIsEdit(false);
          setIsDisabled(true);
          dispatch(
            fetchSaleProgramDetailsRequest({
              id: saleProgramDetail.SaleProgramId,
              baseUrlEng:
                saleProgramDetail?.auctionTypeCode === "ENGLISH"
                  ? "EnglishAuctionSaleProgram"
                  : "SaleProgram",
              actionType: "View",
              userId,
            })
          );
          break;
        }
        case "edit": {
          const saleProgramDetail = row.data;
          setAuctionType(saleProgramDetail?.auctionTypeCode);
          setAuctionTypeCode(saleProgramDetail?.auctionTypeCode);

          setSelectedSaleProgram(saleProgramDetail);
          setIsDisabled(false);
          setIsEdit(true);
          dispatch(
            fetchSaleProgramDetailsRequest({
              id: saleProgramDetail.SaleProgramId,
              baseUrlEng:
                saleProgramDetail?.auctionTypeCode === "ENGLISH"
                  ? "EnglishAuctionSaleProgram"
                  : "SaleProgram",
              actionType: "Edit",
              userId,
            })
          );
        }
        default:
          return "no data";
      }
    }

    if (!saleProgramList || !saleNumber) {
      return (
        <div>
          <NoData />
        </div>
      ); // Show a message when no data is available
    }
    return (
      <>
        <div className="Action">
          {modalRight?.includes("3") && (
            <Tooltip title="View" placement="top">
              <span onClick={() => handleAction("view")}>
                <VisibilityIcon />
              </span>
            </Tooltip>
          )}

          {modalRight?.includes("2") && (
            <>
              <span className="brack"></span>
              {row.data.status === 3 ? (
                ""
              ) : (
                <Tooltip title="Edit" placement="top">
                  <span onClick={() => handleAction("edit")}>
                    <EditIcon />
                  </span>
                </Tooltip>
              )}
            </>
          )}
          {modalRight?.includes("18") && (
            <>
              <span className="brack"></span>
              {row.data.status === 3 ? (
                ""
              ) : (
                <>
                  <Tooltip title="Delete" placement="top">
                    <span
                      onClick={() => {
                        const saleProgramDetail = row.data;

                        setOpenDelete(true);
                        // setActionData({ ...actionData, edit: row.data });
                        getSaleProgramById(
                          row.data.SaleProgramId,
                          saleProgramDetail?.auctionTypeCode === "ENGLISH"
                            ? "EnglishAuctionSaleProgram"
                            : "SaleProgram"
                        );
                        setAuctionType(saleProgramDetail?.auctionTypeCode);
                      }}
                    >
                      <DeleteIcon />
                    </span>
                  </Tooltip>

                  <span className="brack"></span>
                </>
              )}
            </>
          )}
          {modalRight?.includes("7") && (
            <Tooltip title="Download" placement="top">
              <span
                onClick={() => {
                  const saleProgramDetail = row.data;

                  downloaDocumentById(
                    row.data.SaleProgramId,
                    saleProgramDetail?.auctionTypeCode === "ENGLISH"
                      ? "EnglishAuctionSaleProgram"
                      : "SaleProgram", row.data.status
                  );
                }}
              >
                <i className="fa fa-download"></i>
              </span>
            </Tooltip>
          )}
        </div>
      </>
    );
  };
  const sellPrograms = [
    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <InvoiceCheckBox data={row} />,
    // },

    // {
    //   name: "select",
    //   title: "Select",
    //   getCellValue: ({ ...row }) => <InvoiceCheckBox data={row} />,
    // },
    {
      name: "teaTypeName",
      title: "Tea Type",
    },
    {
      name: "saleNo",
      title: "Sale No",
    },
    {
      name: "saleDate",
      title: "Sale Date",
      getCellValue: ({ ...row }) => {
        return row.saleDate;
      },
    },
    {
      name: "buyersPromptDate",
      title: "Buyer's Prompt Date",
      getCellValue: ({ ...row }) => {
        return row.buyersPromptDate;
      },
    },
    {
      name: "sellersPromptDate",
      title: "Seller's Prompt Date",
      getCellValue: ({ ...row }) => {
        return row.sellersPromptDate;
      },
    },
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
    //   name: "mark",
    //   title: "Mark",
    // },
    // {
    //   name: "warehouseName",
    //   title: "Warehouse Name",
    // },
    // {
    //   name: "grade",
    //   title: "Grade",
    // },
  ];

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

  // function generateYearOptions() {
  //   const currentYear = new Date().getFullYear();
  //   const options = [];

  //   for (let i = currentYear; i > currentYear - 7; i--) {
  //     options.push(
  //       <option key={i} value={i}>
  //         {i}
  //       </option>
  //     );
  //   }

  //   console.log(options.map((ele) => ele.props));

  //   return options;
  // }

  function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    let startYear = currentYear + 10;
    let endYear = currentYear - 10;
    const options = [];

    for (let i = startYear; i >= endYear; i--) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    // console.log(options.map((ele) => ele.props));

    return options;
  }

  return (
    <div>
      <ConfirmationModalWithExcel
        show={openDelete}
        remarkShow={true}
        setRemark={(data) =>
          setActionData({
            ...actionData,
            remarks: data,
          })
        }
        onDelete={(e, datas) => {
          //e setRows([
          //   ...rows?.filter(
          //     (ele) => ele.invoiceNo !== actionData.edit.invoiceNo
          //   ),
          // ]);
          e.preventDefault();
          if (actionData.remarks === "") {
            CustomToast.error("Remarks Is Mandatory");
            return;
          }
          const data = {
            SaleProgramId: actionData.delete.SaleProgramId,
            updatedBy: userId,
            remarks: actionData.remarks,
            createdBy: userId,
            documentList: datas,
          };

          console.log(actionData, "actionData.edit");
          if (datas !== null && datas !== undefined) {
            let docBrif = datas?.filter((ele) => ele.documentBrief === "");
          }

          if (actionData.remarks !== undefined && actionData.remarks !== "") {
            console.log(data);

            axiosMain
              .post(
                `/preauction/${auctionType === "ENGLISH"
                  ? "EnglishAuctionSaleProgram"
                  : "SaleProgram"
                }/CancelSaleProgram`,
                data
              )
              .then((response) => {
                if (response.data.statusCode === 200) {
                  CustomToast.success(response.data.message);
                  dispatch(
                    fetchSaleProgramListRequest({
                      season,
                      pageNumber,
                      pageSize,
                      baseUrlEng:
                        auction === "ENGLISH"
                          ? "EnglishAuctionSaleProgram"
                          : "SaleProgram",
                    })
                  );
                } else {
                  CustomToast.warning(response.data.message);
                }
              })
              .catch((error) => {
                CustomToast.error("An error occurred.");
              });
            setUploadedFiles([]);
            setOpenDelete(false);
            setAuctionType(auction);
          } else {
            CustomToast.error("remark is require");
          }

          // axios
          //   .post(
          //     "https://teaboard.procuretiger.com/TEABOARD/preauction/${baseUrlEng}/CancelSaleProgram",
          //     actionData.edit
          //   )
          //   .then((response) => {
          //     if (response.data.status === 200) {
          //       CustomToast.success("API call successful!");
          //     } else {
          //       CustomToast.error("API call failed.", {
          //         position: CustomToast.POSITION.TOP_RIGHT,
          //       });
          //     }
          //   })
          //   .catch((error) => {
          //     CustomToast.error("An error occurred.", {
          //       position: CustomToast.POSITION.TOP_RIGHT,
          //     });
          //   });
        }}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        onHide={() => setOpenDelete(false)}
      />
      <Accordion
        expanded={expanded === "panel1"}
        className={`${expanded === "panel1" ? "active" : ""}`}
        onChange={handleChange("panel1")}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Manage Sale Program</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {modalRight?.includes("12") && (
            <>
              <div className="row align-items-end">
                <div className="col-lg-1 col-xxl-2">
                  <label>Select Season</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="age1"
                      value={year}
                      onChange={(e) => setYears(e.target.value)}
                    >
                      {generateYearOptions()}
                    </FormControl>
                  </InputGroup>
                </div>
                <div className="col-lg-2">
                  <label>Select Sale No.</label>
                  <InputGroup>
                    <FormControl
                      as="select"
                      name="age2"
                      value={sellsNo}
                      onChange={(e) => setSellNo(e.target.value)}
                    >
                      <option value={0}>All</option>
                      {saleNumber?.length > 0
                        ? saleNumber?.map((e) => (
                          <option key={e.SaleNoId} value={e.saleNo}>
                            {e.saleNo}
                          </option>
                        ))
                        : 0}
                    </FormControl>
                  </InputGroup>
                </div>

                <div className="col-lg-auto">
                  <div className="BtnGroup">
                    <Tooltip title={"Search Sale Program"} placement="top">
                      {" "}
                      <Button className="SubmitBtn" onClick={handleSearch}>
                        Search
                      </Button>
                    </Tooltip>
                    &nbsp;
                    {/* <Button className="SubmitBtn" onClick={() => handleRefresh()}>
                  <i className="fa fa-refresh"></i>
                </Button> */}
                    <Tooltip
                      title={"Clear Searched Sale program"}
                      placement="top"
                    >
                      <Button
                        className="SubmitBtn"
                        onClick={() => {
                          setYears(currentDate?.split("-")[0]);
                          setSellNo(0);
                          const data = {
                            season: new Date().getFullYear().toString(),
                            saleNo: 0,
                            pageNumber: 1,
                            pageSize: 1000,
                            auctionCenterId: auctionCenterId,
                          };

                          try {
                            axiosMain
                              .post(
                                `/preauction/${baseUrlEng}/GetSaleProgramList`,
                                data
                              )
                              .then((response) =>
                                setSearchData(response.data.responseData)
                              );
                          } catch (error) {
                            console.error("Error calling POST API:", error);
                          }
                        }}
                      >
                        Clear
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div
                id="invoiceTable"
                className="mt-2"
                style={{ height: "300px", overflow: "scroll " }}
              >
                {(rows?.length <= 0 && rows == []) || undefined || null ? (
                  "No data"
                ) : (
                  <TableComponent
                    columns={
                      modalRight?.includes("3") ||
                        modalRight?.includes("2") ||
                        modalRight?.includes("18") ||
                        modalRight?.includes("7")
                        ? [
                          ...sellPrograms,
                          {
                            name: "action",
                            title: "Action",
                            getCellValue: ({ ...row }) => (
                              <ActionArea data={row} />
                            ),
                          },
                        ]
                        : sellPrograms
                    }
                    rows={rows?.length > 0 ? rows : []}
                    //setRows={setRows}
                    addpagination={true}
                    dragdrop={false}
                    fixedColumnsOn={false}
                    resizeingCol={false}
                    selectionCol={true}
                    sorting={true}
                  />
                )}
              </div>
            </>
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
        </AccordionDetails>
      </Accordion>

      {modalRight?.includes("1") || isDisabled || isEdit ? (
        <Accordion
          className={`${expanded === "panel2" ? "active" : ""}`}
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>
              {isEdit === true ? "Edit Sale Program" : "Add Sale Program"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AuctionCard
              resateForm={resateForm}
              currentDate={currentDate}
              rows={saleProgramList}
              saleDates={saleDate}
              setSaleDates={setSaleDate}
              formData={formData}
              year={year}
              saleNumber={saleNumber}
              setSelectedSaleProgram={setSelectedSaleProgram}
              handleYearChange={handleYearChange}
              generateYearOptions={generateYearOptions}
              actionData={actionData}
              selectedSaleProgram={selectedSaleProgram}
              isDisabled={isDisabled}
              isEdit={isEdit}
              setYears={setYears}
              setSelectedSalePrograms={setSelectedSalePrograms}
              selectedSalePrograms={selectedSalePrograms}
              saleProgramDetailList={saleProgramDetailList}
              setSaleProgramDetailList={setSaleProgramDetailList}
              selectedSaleNo={selectedSaleNo}
              setSelectedSaleNo={setSelectedSaleNo}
              publishingDate={publishingDate}
              setPublishingDate={setPublishingDate}
              closingDate={isEdit === true ? closingDate : closingDate}
              setClosingDate={setClosingDate}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              numRows={numRows}
              setNumRows={setNumRows}
              handleChange={handleChange}
              setExpanded={setExpanded}
              setLotConfiguration={setLotConfiguration}
              lotConfiguration={lotConfiguration}
              auctionVarient={auctionVarient}
              setAuctionVarient={setAuctionVarient}
              setPrsAuctionSessionId={setPrsAuctionSessionId}
              prsAuctionSessionId={prsAuctionSessionId}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              setAverageInPercentage={setAverageInPercentage}
              averageInPercentage={averageInPercentage}
              modalRight={modalRight}
              auctionType={auctionType}
              auctionTypeCode={auctionTypeCode}
            />
          </AccordionDetails>
        </Accordion>
      ) : (
        ""
      )}
    </div>
  );
}

export default SaleModal;
