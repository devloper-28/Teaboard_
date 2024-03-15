import React, { useState, useEffect } from "react";
import Modals from "../../components/common/Modal";
import UpdateEngineRule from "../UpdateEngineRule/UpdateEngineRule";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  getDocumentByIdAction,
  fetchRuleEngineBrt,
  getRuleEngineByIdActionSuccess,
  uploadAllDocumentsRuleEngineAction,
  getDocumentByIdActionSuccess,
} from "../../store/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { Card, Modal } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import { NO_OF_RECORDS } from "../../constants/commonConstants";
import Base64ToPDFPreview from "../uploadDocument/Base64ToPDFPreview";
import { ThreeDots } from "react-loader-spinner";

let pageNo = 1;
const data = [
  {
    state: "California",
    stateCode: "CA",
    stateInitial: "C",
    action: "Some action",
  },
  {
    state: "New York",
    stateCode: "NY",
    stateInitial: "NY",
    action: "Another action",
  },
];

let isFirstCall = 0;
function ManageRuleEngine({ open, setOpen, modalRight, auctionType }) {
  const getRuleEngineData = useSelector(
    (state) => state.ruleEngineEng.getAllRuleEngineBrtActionSuccess.responseData
  );
  // let getRuleEngineData =
  //   getRuleEngineDatafull &&
  //   getRuleEngineDatafull.filter((data) => 1 == data.isActive);

  const [rows, setRows] = useState(getRuleEngineData);

  // useEffect(() => {
  //   setRows(getRuleEngineData);
  // }, [getRuleEngineData]);
  // useEffect(() => {
  //   const newRows = getRuleEngineData || [];
  //   setRows((prevRows) => {
  //     const currentRows = Array.isArray(prevRows) ? prevRows : [];
  //     return [...currentRows, ...newRows];
  //   });
  // }, [getRuleEngineData]);
  useEffect(() => {
    setRows([]);
    isFirstCall = isFirstCall + 1;
  }, []);

  useEffect(() => {
    const newRows = getRuleEngineData || [];

    if (auctionType == 1) {
      setRows((prevRows) => {
        const currentRows =
          isFirstCall > 1 ? (Array.isArray(prevRows) ? [...prevRows] : []) : [];

        newRows.forEach((newRow) => {
          const index = currentRows.findIndex(
            (row) => row.auctionCenterId === newRow.auctionCenterId
          );

          if (index !== -1) {
            currentRows[index] = newRow;
          } else {
            currentRows.push(newRow);
          }
        });

        return currentRows;
      });
    }
  }, [getRuleEngineData, auctionType]);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [showmodal, setShowmodal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewDocumentContent, setPreviewDocumentContent] = useState("");
  const [showchildmodal, setShowChildmodal] = useState(false);
  const [expanded, setExpanded] = React.useState("panel2");
  const [auctionCenterId, setauctionCenterId] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [loader, setLoader] = useState(false);
  const handleCloseHistory = () => setShowmodal(false);
  const [editAuctionCenterId, setEditAuctionCenterId] = useState("");
  const [documentMode, setDocumentmode] = useState("");
  const getAllUploadedDoc = useSelector(
    (state) =>
      state &&
      state.ruleEngine &&
      state.ruleEngine.uploadedDocuments &&
      state.ruleEngine.uploadedDocuments.responseData
  );
  const handleViewMore = () => {
    pageNo = pageNo + 1;
    dispatch(
      fetchRuleEngineBrt({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
        auctionTypeMasterId: "1",
        isActive: "1",
        pageNo: pageNo,
        noOfRecords: NO_OF_RECORDS,
      })
    );
  };
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      dispatch(
        fetchRuleEngineBrt({
          sortBy: "asc",
          sortColumn: "auctionCenterName",
          auctionTypeMasterId: "1",
          isActive: "1",
          pageNo: pageNo,
          noOfRecords: NO_OF_RECORDS,
        })
      );
    }, 1000);
  }, [fetchRuleEngineBrt]);
  const handleClosePreviewModal = () => {
    dispatch(getDocumentByIdActionSuccess(""));
    setDocumentmode("");
    setPreviewModal(false);
    setPreviewDocumentContent("");
  };

  // useEffect(() => {
  //   setRows(getRuleEngineData);
  // }, [getRuleEngineData]);

  const handleEditClick = (auctionCenterId) => {
    setViewMode(false);
    // dispatch(getRuleEngineByIdAction(auctionCenterId));
    setEditAuctionCenterId(auctionCenterId);
    setShowChildmodal(true);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if ("panel2" == panel && isExpanded) {
      dispatch(getRuleEngineByIdActionSuccess([]));
    } else if ("panel3" == panel && isExpanded) {
      //Document API call
      dispatch(uploadAllDocumentsRuleEngineAction(""));
      dispatch(getRuleEngineByIdActionSuccess([]));
    } else if ("panel1" == panel && !isExpanded) {
      dispatch(getRuleEngineByIdActionSuccess([]));
    }
  };

  const columns = [
    {
      name: "index",
      title: "Sr.",
    },
    {
      name: "auctionCenterName",
      title: "Auction Center",
    },
    {
      name: "action",
      title: "Action",
      getCellValue: (rows) => <ActionData data={rows} />,
    },
  ];
  function ActionData(data) {
    return (
      <>
        <div class="Action">
          {modalRight?.some((ele) => ele === "2") && (
            <i
              className="fa fa-edit"
              onClick={() => handleEditClick(data.data.auctionCenterId)}
            ></i>
          )}
        </div>
      </>
    );
  }
  const getUploadedIdData = useSelector(
    (state) => state.documentReducer?.documentData?.responseData
  );
  const handleDownloadClick = (uploadDocumentConfId, type) => {
    setDocumentmode(type);
    dispatch(getDocumentByIdAction(uploadDocumentConfId));
  };

  useEffect(() => {
    if (
      getUploadedIdData &&
      getUploadedIdData.documentContent &&
      "download" == documentMode
    ) {
      dispatch(getDocumentByIdActionSuccess(""));
      uploadedFileDownload(
        getUploadedIdData.documentContent,
        getUploadedIdData.documentName,
        "data:application/pdf;base64"
      );
    }
    if (
      getUploadedIdData &&
      getUploadedIdData.documentContent &&
      "preview" == documentMode
    ) {
      dispatch(getDocumentByIdActionSuccess(""));
      setPreviewModal(true);
      setPreviewDocumentContent(getUploadedIdData.documentContent);
    }
  }, [getUploadedIdData]);

  function UploadActionData(data) {
    return (
      <div class="Action">
        {modalRight?.some((ele) => ele === "7") && (
          <i
            class="fa fa-download"
            onClick={() => {
              handleDownloadClick(data.data.uploadDocumentConfId, "download");
            }}
          ></i>
        )}
        {modalRight?.some((ele) => ele === "10") && (
          <i
          title="Preview"
            class="fa fa-eye"
            onClick={() => {
              handleDownloadClick(data.data.uploadDocumentConfId, "preview");
            }}
          ></i>
        )}
      </div>
    );
  }
  return (
    <>
      <Accordion
        expanded={expanded === "panel2"}
        className={`${expanded === "panel2" ? "active" : ""}`}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Manage Rule</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12 mt-4">
                <div className="TableBox CreateStateMaster">
                  {loader ? (
                    <div className="">
                      <ThreeDots
                        visible={true}
                        height="80"
                        width="80"
                        color="#4fa94d"
                        radius="9"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    </div>
                  ) : rows?.length > 0 ? (
                    <TableComponent
                      columns={columns}
                      rows={rows?.map((row, index) => ({
                        ...row,
                        index: index + 1,
                      }))}
                      sorting={true}
                      dragdrop={false}
                      fixedColumnsOn={false}
                      resizeingCol={false}
                    />
                  ) : (
                    <div className="NoData">No Records Found</div>
                  )}
                </div>
                <button class="SubmitBtn" onClick={handleViewMore}>
                  View More
                </button>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
      {modalRight?.some((ele) => ele === "6") && (
        <Accordion
          expanded={expanded === "panel3"}
          className={`${expanded === "panel3" ? "active" : ""}`}
          onChange={handleChange("panel3")}
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Uploaded Document</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TableComponent
                columns={[
                  {
                    name: "index",
                    title: "Sr.",
                  },
                  {
                    name: "documentUploadTime",
                    title: "Document Upload Date And Time",
                  },
                  {
                    name: "uploadDocumentRemarks",
                    title: "Document Brief/Remarks",
                  },
                  {
                    name: "action",
                    title: "Action",
                    getCellValue: (rows) => <UploadActionData data={rows} />,
                  },
                ]}
                rows={
                  getAllUploadedDoc == undefined || getAllUploadedDoc == null
                    ? []
                    : getAllUploadedDoc?.map((row, index) => ({
                        ...row,
                        index: index + 1,
                      }))
                }
                sorting={true}
                dragdrop={false}
                fixedColumnsOn={false}
                resizeingCol={false}
              />
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}
      {showchildmodal && (
        <Modals
          title={"Edit Rule"}
          show={showchildmodal}
          size="xl"
          centered
          handleClose={() => setShowChildmodal(false)}
        >
          <UpdateEngineRule
            modalRight={modalRight}
            setShowChildmodal={setShowChildmodal}
            id={auctionCenterId}
            editAuctionCenterId={editAuctionCenterId}
          ></UpdateEngineRule>
        </Modals>
      )}
      {previewDocumentContent != "" && "preview" == documentMode ? (
        <Modal
          show={previewModal}
          onHide={handleClosePreviewModal}
          size="lg"
          centered
        >
          <Modal.Header>
            <Modal.Title>Preview</Modal.Title>
            <i
              className="fa fa-times CloseModal"
              onClick={handleClosePreviewModal}
            ></i>
          </Modal.Header>

          <Modal.Body>
            <Base64ToPDFPreview base64String={previewDocumentContent} />
          </Modal.Body>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
}
export default ManageRuleEngine;
