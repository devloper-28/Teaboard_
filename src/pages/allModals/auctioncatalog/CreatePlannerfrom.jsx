import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosMain from "../../../http/axios/axios_main";
import { useEffect } from "react";
import { useState } from "react";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  PagingPanel,
} from "@devexpress/dx-react-grid-bootstrap4";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CustomToast from "../../../components/Toast";
import TableComponent from "../../../components/tableComponent/TableComponent";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import { useAuctionDetail } from "../../../components/common/AunctioneerDeteailProvider";
import { IntegratedSelection, SelectionState } from "@devexpress/dx-react-grid";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";

const CreatePlannerfrom = ({
  myCatalogDetails,
  isEdit,
  saleProgramId,
  sessionTypeId,
  modalRight,
  baseUrlEngBuyer
}) => {
  const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId, roleCode } =
    useAuctionDetail();

  const [group, setGroupCode] = useState([]);
  const [editData, setIsEditData] = useState([]);
  const [rows, setRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState({});
  const [selectionPlannerList, setselectionPlannerList] = useState([]);
  const [expandedTab, setExpandedTab] = useState("panel1");

  const validationSchema = Yup.object({
    purchaseIndicator: Yup.string()
      .matches(/^\d{1,3}(,\s*\d{1,3})*$/, "Invalid Purchase Indicator")
      .nullable(),
    groupCode: Yup.string().nullable(),
    plannedQtyPkgs: Yup.string()
      .matches(/^[0-9]{1,4}$/, "Invalid Planned Qty (Pkgs)")
      .nullable(),
    plannedQtyKgs: Yup.string()
      .matches(/^[0-9]{1,7}$/, "Invalid Planned Qty (KGs)")
      .nullable(),
    plannedAmount: Yup.string()
      .matches(/^[0-9]{1,15}(\.[0-9]{1,2})?$/, "Invalid Planned Amount (INR)")
      .nullable(),
    remarks: Yup.string()
      .max(500, "Remarks must be at most 500 characters")
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      season: myCatalogDetails.season,
      saleNo: myCatalogDetails.saleNo,
      purchaseIndicator: "",
      groupCode: "",
      plannedQtyPkgs: "",
      plannedQtyKgs: "",
      plannedAmount: "",
      remarks: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Handle form submission, e.g., send data to the server
      console.log("Form submitted with values:", values);

      if (editData.length > 0) {
        axiosMain
          .post("/preauction/Buyer/UpdateMyPlanner", {
            // season: "2023",
            saleNo: parseFloat(values.saleNo),
            SaleProgramId: saleProgramId,
            purchaseIndicator: parseFloat(values.purchaseIndicator),
            groupId: parseInt(values.groupCode),
            PlannedQty_PKGS: isNaN(parseInt(values.plannedQtyPkgs))
              ? 0
              : parseInt(values.plannedQtyPkgs),
            PlannedQty_kGS: isNaN(parseInt(values.plannedQtyKgs))
              ? 0
              : parseInt(values.plannedQtyKgs),
            PlannedAmount: isNaN(parseInt(values.plannedAmount))
              ? 0
              : parseInt(values.plannedAmount),
            Remarks: values.remarks,
            createdBy: userId,
            updatedBy: userId,
            myPlannerId: editData[0].myPlannerId,
            auctionCenterId: auctionCenterId,
            // sessionTypeId: sessionTypeId,
          })
          .then((res) => {
            if (res.data.statusCode === 204) {
              CustomToast.warning(res.data.message);
            } else if (res.data.statusCode === 200) {
              CustomToast.success(res.data.message);
              axiosMain
                .post(`preauction/${baseUrlEngBuyer}/GetMyPlannerList`, {
                  // season: myCatalogDetails.season,
                  // saleNo: parseInt(myCatalogDetails.saleNo),
                  // createdBy: userId,
                  // auctionCenterId: auctionCenterId
                  SaleProgramId: saleProgramId,
                  createdBy: userId,
                  auctionCenterId: auctionCenterId,
                  // sessionTypeId: sessionTypeId,
                })
                .then((res) => {
                  if (res.data.statusCode === 200) {
                    // CustomToast.success(res.data.message);
                    setRows(res.data.responseData);
                  } else {
                    CustomToast.warning(res.data.message);
                    setRows([]);
                  }
                });
            } else {
              CustomToast.error(res.data.message);
            }
          })
          .catch((error) => {
            CustomToast.error();
          });
      } else {
        axiosMain
          .post(`/preauction/${baseUrlEngBuyer}/CreateMyPlanner`, {
            // season: "2023",
            SaleProgramId: saleProgramId,
            saleNo: parseFloat(values.saleNo),
            purchaseIndicator: isNaN(parseInt(values.purchaseIndicator))
              ? 0
              : parseInt(values.purchaseIndicator),
            groupId: isNaN(parseInt(values.groupCode))
              ? 0
              : parseInt(values.groupCode),
            PlannedQty_PKGS: isNaN(parseInt(values.plannedQtyPkgs))
              ? 0
              : parseInt(values.plannedQtyPkgs),
            PlannedQty_kGS: isNaN(parseInt(values.plannedQtyKgs))
              ? 0
              : parseInt(values.plannedQtyKgs),
            PlannedAmount: isNaN(parseInt(values.plannedAmount))
              ? 0
              : parseInt(values.plannedAmount),
            Remarks: values.remarks,
            createdBy: userId,
            auctionCenterId: auctionCenterId,
            // sessionTypeId: sessionTypeId,
          })
          .then((res) => {
            if (res.data.statusCode === 204) {
              CustomToast.warning(res.data.message);
            } else if (res.data.statusCode === 200) {
              CustomToast.success(res.data.message);
              axiosMain
                .post(`preauction/${baseUrlEngBuyer}/GetMyPlannerList`, {
                  // season: myCatalogDetails.season,
                  // saleNo: parseInt(myCatalogDetails.saleNo),
                  // createdBy: userId,
                  // auctionCenterId: auctionCenterId
                  SaleProgramId: saleProgramId,
                  createdBy: userId,
                  auctionCenterId: auctionCenterId,
                  // sessionTypeId: sessionTypeId,
                })
                .then((res) => {
                  if (res.data.statusCode === 200) {
                    // CustomToast.success(res.data.message);
                    setRows(res.data.responseData);
                  } else {
                    CustomToast.warning(res.data.message);
                    setRows([]);
                  }
                });
            } else {
              CustomToast.error(res.data.message);
            }
          })
          .catch((error) => {
            CustomToast.error();
          });
      }
      setIsEditData([]);
      resetForm();
    },
  });

  useEffect(() => {
    if (editData.length > 0) {
      formik.setValues({
        season: myCatalogDetails.season,
        saleNo: myCatalogDetails.saleNo,
        purchaseIndicator: editData?.at(0)?.purchaseIndicator,
        groupCode: editData?.at(0)?.groupId,
        plannedQtyPkgs: editData?.at(0)?.PlannedQty_PKGS,
        plannedQtyKgs: editData?.at(0)?.PlannedQty_kGS,
        plannedAmount: editData?.at(0)?.PlannedAmount,
        remarks: editData?.at(0)?.Remarks,
      });
      formik.setFieldValue("groupCode", editData?.at(0)?.groupId);
    }
  }, [editData]);
  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedTab(isExpanded ? panel : null);

    // setDisable(false);
    // setIsEdit(false);
  };
  const myPlanner = [
    { title: "Sale No.", name: "saleNo" },
    { title: "Purchase Indicator", name: "purchaseIndicator" },
    // { title: "Tea Type", name: "teaTypeName" },
    { title: "Group", name: "groupCode" },
    { title: "PlannedQty PKGS", name: "PlannedQty_PKGS" },
    { title: "PlannedQty KGS", name: "PlannedQty_kGS" },
    { title: "Planned Amount", name: "PlannedAmount" },
    { title: "Remarks", name: "Remarks" },
    {
      title: "Auction",
      name: "auction",
      getCellValue: ({ ...row }) => (
        <>
          <button
            type="button"
            onClick={() => {
              // setOpenUploadUpdateValuation(true);
              axiosMain
                .post(
                  `/preauction/${baseUrlEngBuyer}/GetMyPlannerById?myPlannerId=` +
                  row.myPlannerId,
                  {}
                )
                .then((res) => {
                  // setGetDataByprems(res.data.responseData);
                  if (res.data.statusCode === 200) {
                    setIsEditData(res.data.responseData);
                    setExpandedTab("panel2");
                  } else {
                    CustomToast.warning(res.data.message);
                  }
                });
            }}
          >
            edit
          </button>
          {/* <button
            type="button"
            onClick={() => {
              // setOpenUploadUpdateValuation(true);
              setOpenDelete(true);
              setRowData(row);
            }}
          >
            Delete
          </button> */}
        </>
      ),
    },
  ];

  useEffect(() => {
    axiosMain
      .post(
        "/preauction/Common/BindGroupMasterByBuyerUserId?buyerUserId=" + userId,
        // "/preauction/Buyer/BindGroupMasterByBuyerUserIdForPlanner?buyerUserId=" + userId,
        {}
      )
      .then((res) => {
        if (res.data.message) {
          setGroupCode(res.data.responseData);
        } else {
          setGroupCode([]);
        }
      });
  }, []);
  return (
    <>
      <Accordion
        expanded={expandedTab === "panel1"}
        onChange={handleAccordionChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Manage My Planner</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <button
              type="button"
              onClick={() => {
                axiosMain
                  .post(`preauction/${baseUrlEngBuyer}/GetMyPlannerList`, {
                    // season: myCatalogDetails.season,
                    // saleNo: parseInt(myCatalogDetails.saleNo),
                    SaleProgramId: saleProgramId,
                    createdBy: userId,
                    auctionCenterId: auctionCenterId,
                    // sessionTypeId: sessionTypeId,
                  })
                  .then((res) => {
                    if (res.data.statusCode === 200) {
                      // CustomToast.success(res.data.message);
                      setRows(res.data.responseData);
                      //new group code
                      // let sdata = {}
                      // const grpdata = res.data?.responseData?.map((ele) => {
                      //   sdata = { ...sdata, groupId: ele.groupId, groupCode: ele.groupCode }
                      // })
                      // console.log(group, grpdata, "aaaaaaaaa")
                      //   if (group === null) {
                      //     // const grpcode=[{
                      //     //   groupId:5,
                      //     //   groupCode:"abc"
                      //     // }]
                      //     setGroupCode(grpdata);
                      //   }
                      //   else {
                      //     // const grpcode={
                      //     //   groupId:5,
                      //     //   groupCode:"abc"
                      //     // }
                      //     setGroupCode(...group,grpdata);
                      //   }
                    } else {
                      CustomToast.warning(res.data.message);
                      setRows([]);
                    }
                  });
              }}
              className="SubmitBtn btn"
            >
              Get My Planner List
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenDelete(true);
                // console.log(
                //   selectionPlannerList.map((ele) => rows[ele]),
                //   "selectionPlannerList"
                // );
              }}
              className="SubmitBtn btn"
            >
              Delete
            </button>
            <div className="col-12">
              {/* <TableComponent
          columns={myPlanner}
          rows={rows?.length > 0 ? rows : []}
          setRows={setRows}
          addpagination={true}
          dragdrop={false}
          fixedColumnsOn={false}
          resizeingCol={false}
          selectionCol={true}
          sorting={true}
        /> */}

              <Grid columns={myPlanner} rows={rows?.length > 0 ? rows : []}>
                <SelectionState
                  selection={selectionPlannerList}
                  onSelectionChange={setselectionPlannerList}
                />
                {/* <PagingState defaultCurrentPage={0} pageSize={6} /> */}
                <IntegratedSelection />
                {/* <IntegratedPaging /> */}
                <Table />
                <TableHeaderRow />
                <TableSelection showSelectAll />
                {/* <PagingPanel /> */}
              </Grid>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expandedTab === "panel2"}
        onChange={handleAccordionChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Create My Planner </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <div className="FormGroup">
                  <label htmlFor="saleNo">Sale No.</label>
                  <input
                    type="text"
                    id="saleNo"
                    name="saleNo"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.saleNo}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="FormGroup">
                  <label htmlFor="purchaseIndicator">
                    Purchase Indicator (%)
                  </label>
                  <input
                    type="text"
                    id="purchaseIndicator"
                    name="purchaseIndicator"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.purchaseIndicator}
                  />
                  {formik.touched.purchaseIndicator &&
                    formik.errors.purchaseIndicator ? (
                    <div className="error text-danger">
                      {formik.errors.purchaseIndicator}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-md-4">
                <div className="FormGroup">
                  <label htmlFor="groupCode">Group Code</label>
                  <select
                    id="groupCode"
                    name="groupCode"
                    className="form-control select-form"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.groupCode}
                  >
                    <option value="">Select</option>
                    {group?.map((item) => (
                      <option value={item.groupId}>{item.groupCode}</option>
                    ))}
                    {/* Add options for dropdown */}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="FormGroup">
                  <label htmlFor="plannedQtyPkgs">Planned Qty. (Pkgs)</label>
                  <input
                    type="text"
                    id="plannedQtyPkgs"
                    name="plannedQtyPkgs"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.plannedQtyPkgs}
                  />
                  {formik.touched.plannedQtyPkgs &&
                    formik.errors.plannedQtyPkgs ? (
                    <div className="error text-danger">
                      {formik.errors.plannedQtyPkgs}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-md-4">
                <div className="FormGroup">
                  <label htmlFor="plannedQtyKgs">Planned Qty. (KGs)</label>
                  <input
                    type="text"
                    id="plannedQtyKgs"
                    name="plannedQtyKgs"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.plannedQtyKgs}
                  />
                  {formik.touched.plannedQtyKgs &&
                    formik.errors.plannedQtyKgs ? (
                    <div className="error text-danger">
                      {formik.errors.plannedQtyKgs}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-md-4">
                <div className="FormGroup">
                  <label htmlFor="plannedAmount">Planned Amount (INR)</label>
                  <input
                    type="text"
                    id="plannedAmount"
                    name="plannedAmount"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.plannedAmount}
                  />
                  {formik.touched.plannedAmount &&
                    formik.errors.plannedAmount ? (
                    <div className="error text-danger">
                      {formik.errors.plannedAmount}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-md-4">
                <div className="FormGroup">
                  <label htmlFor="remarks">Remarks</label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.remarks}
                  />
                </div>
              </div>
            </div>

            <div className="BtnGroup">
              <button type="submit" className="SubmitBtn btn">
                {editData.length > 0 ? "Update    " : "Submit"}
              </button>
              <button
                type="button"
                className="SubmitBtn btn"
                onClick={() => {
                  formik.handleReset();
                  setIsEditData([]);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
          <DeleteConfirmationModal
            show={openDelete}
            title={"Are you sure you want to delete ?"}
            onDelete={() => {
              // setRows([...rows?.filter((ele) => ele.id !== actionData.edit.id)]);

              // axiosMain
              //   .post("/preauction/Buyer/DeleteFromMyPlanner", {
              //     createdBy: userId,
              //     // saleNo: rowData.saleNo,
              //     SaleProgramId: saleProgramId,
              //     // season: myCatalogDetails.season,
              //     updatedBy: userId,
              //     myPlannerId: rowData.myPlannerId,
              //     auctionCenterId: auctionCenterId,
              //   })
              //   .then((res) => {
              //     // setGetDataByprems(res.data.responseData);
              //     if (res.data.statusCode === 200) {
              //       CustomToast.success(res.data.message);

              //       axiosMain
              //         .post("preauction/Buyer/GetMyPlannerList", {
              //           // season: myCatalogDetails.season,
              //           // saleNo: parseInt(myCatalogDetails.saleNo),
              //           // createdBy: userId,
              //           // auctionCenterId: auctionCenterId
              //           SaleProgramId: saleProgramId,
              //           createdBy: userId,
              //           auctionCenterId: auctionCenterId,
              //         })
              //         .then((res) => {
              //           if (res.data.statusCode === 200) {
              //             // CustomToast.success(res.data.message);
              //             setRows(res.data.responseData);
              //           } else {
              //             CustomToast.warning(res.data.message);
              //             setRows([]);
              //           }
              //         });
              //       formik.resetForm();
              //       formik.setFieldValue("groupCode", "");
              //     } else {
              //       CustomToast.warning(res.data.message);
              //     })
              axiosMain
                .post(`/preauction/${baseUrlEngBuyer}/DeleteFromMyPlanner`, {
                  createdBy: userId,
                  SaleProgramId: saleProgramId,
                  updatedBy: userId,
                  myPlannerIds: selectionPlannerList
                    .map((ele) => rows[ele]?.myPlannerId)
                    .join(","),
                  auctionCenterId: auctionCenterId,
                  // sessionTypeId: sessionTypeId,
                })
                .then((res) => {
                  if (res.data.statusCode === 200) {
                    CustomToast.success(res.data.message);
                    // setRows(
                    //   [...rows].filter(
                    //     (ele, index) =>
                    //       ele.myPlannerId !==
                    //       selectionPlannerList.map((ele) => rows[ele]?.myPlannerId)[
                    //         index
                    //       ]
                    //   )
                    // );

                    axiosMain
                      .post(`preauction/${baseUrlEngBuyer}/GetMyPlannerList`, {
                        // season: myCatalogDetails.season,
                        // saleNo: parseInt(myCatalogDetails.saleNo),
                        // createdBy: userId,
                        // auctionCenterId: auctionCenterId
                        SaleProgramId: saleProgramId,
                        createdBy: userId,
                        auctionCenterId: auctionCenterId,
                        // sessionTypeId: sessionTypeId,
                      })
                      .then((res) => {
                        if (res.data.statusCode === 200) {
                          // CustomToast.success(res.data.message);
                          setRows(res.data.responseData);
                        } else {
                          CustomToast.warning(res.data.message);
                          setRows([]);
                        }
                      });
                  } else {
                    CustomToast.warning(res.data.message);
                    // setRows([]);
                  }
                })
                .catch((err) => console.log(err));

              setOpenDelete(false);
            }}
            onHide={() => setOpenDelete(false)}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default CreatePlannerfrom;
