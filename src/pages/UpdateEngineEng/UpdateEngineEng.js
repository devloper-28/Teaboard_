import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  fetchRuleEngine,
  createRuleEngineAction,
  updateRuleEngineEngAction,
  getRuleEngineEngByIdAction,
  getRuleEngineByIdActionSuccess,
  getAllAuctionCenterAscAction,
  searchRuleEngineAction,
  uploadAllDocumentsRuleEngineAction,
  getDocumentByIdAction,
  getHistoryByIdAction,
  createEditApiRuleEngine,
  getAllStateAction,
} from "../../store/actions";
import { uploadedFileDownload } from "../uploadDocument/UploadedFileDownload";
import UploadMultipleDocuments from "../uploadDocument/UploadMultipleDocuments";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  FormControl,
  AccordionDetails,
  Checkbox,
  AccordionSummary,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import $ from "jquery";
import CustomToast from "../../components/Toast";

function UpdateEngineRule({
  id,
  open,
  setOpen,
  editingRuleEngine,
  setShowChildmodal,
  editAuctionCenterId,
  modalRight,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showmodal, setShowmodal] = useState(false);
  const [expanded, setExpanded] = React.useState("panel2");
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [auctionCenterId, setauctionCenterId] = useState([]);
  const [uploadDocumentError, setUploadDocumentError] = useState([]);
  const [editingRuleEngineData, seteditingRuleEngineData] = useState(null);
  const [
    timeIntervalBetweenTwoAuctionSessionError,
    settimeIntervalBetweenTwoAuctionSessionError,
  ] = useState("");
  const [onChangesAuctionCenterId, setOnChangeAuctionCenterId] = useState([]);
  const [
    timeIntervalOfIncrInClosingPriceError,
    settimeIntervalOfIncrInClosingPriceError,
  ] = useState("");
  const [basePriceCappingError, setbasePriceCappingError] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const handleCloseHistory = () => setShowmodal(false);

  useEffect(() => {
    dispatch(
      getAllAuctionCenterAscAction({
        sortBy: "asc",
        sortColumn: "auctionCenterName",
      })
    );

    dispatch(getRuleEngineEngByIdAction(editAuctionCenterId));
  }, []);

  const getAllAuctionCenterResponse = useSelector(
    (state) => state?.auctionCenter?.getAllAuctionCenterAsc?.responseData
  );

  const getAllAuctionCenter =
    getAllAuctionCenterResponse &&
    getAllAuctionCenterResponse.filter((data) => 1 == data.isActive);

  const handleFileUpload = (files) => {
    const newFiles = files?.map((file) => ({
      documentContent: file.documentContent,
      documentName: file.documentName,
      documentSize: file.documentSize,
    }));
    setUploadedDocuments(newFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValid = true;
    if (editingRuleEngineData) {
      if (!editingRuleEngineData.auctionCenterId) {
        CustomToast.error("Please enter auctionCenterId");
        isValid = false;
        return;
      }

      // if (!editingRuleEngineData.timeIntervalBetweenTwoAuctionSession) {
      //   CustomToast.error("Please enter timeIntervalBetweenTwoAuctionSession");
      //   isValid = false;
      //   return;
      // }
      if (!editingRuleEngineData.timeIntervalBetweenTwoAuctionSession) {
        CustomToast.error(
          "Please enter the time interval between two auction sessions"
        );
        isValid = false;
      } else if (
        editingRuleEngineData.timeIntervalBetweenTwoAuctionSession < 1
      ) {
        CustomToast.error("The minimum allowed value is 1");
        isValid = false;
      } else if (
        isNaN(editingRuleEngineData.timeIntervalBetweenTwoAuctionSession)
      ) {
        CustomToast.error("Please enter a numeric value");
        isValid = false;
      } else {
      }

      if (!isValid) {
        return;
      }

      dispatch(updateRuleEngineEngAction(editingRuleEngineData));
      setShowChildmodal(false);
    }
  };
  const handleChanges = (event) => {
    // const {
    //   target: { value },
    // } = event;
    // const selectedValues = Array.isArray(value)
    //   ? value.map(String)
    //   : [String(value)];
    // seteditingRuleEngineData((prevData) => ({
    //   ...prevData,
    //   auctionCenterId: selectedValues,
    // }));-

    // const selectedIds = getAllAuctionCenter.filter((auctionCenter) =>
    //   selectedValues.includes(auctionCenter.auctionCenterName)
    // );
    // // .map((auctionCenter) => auctionCenter.auctionCenterId.toString());

    // setauctionCenterId(selectedIds);

    const {
      target: { value, id },
    } = event;
    let tempData = typeof value === "string" ? value.split(",") : value;
    // seteditingRuleEngineData((prevData) => ({
    //   ...prevData,
    //   auctionCenterName: tempData,
    // }));
    let tempDataNo = [];

    getAllAuctionCenter &&
      getAllAuctionCenter.map((auctionCenterData, auctioncenterIndex) => {
        if (tempData.includes(auctionCenterData.auctionCenterName)) {
          tempDataNo.push(auctionCenterData.auctionCenterId.toString());
        }
      });
    seteditingRuleEngineData((prevData) => ({
      ...prevData,
      auctionCenterName: tempData,
      auctionCenterId: tempDataNo,
    }));
  };
  const handleClear = () => {
    resetForm();
    setUploadedDocuments([]);
    const inputElement = document.getElementById("ruleEngineUpload");
    if (inputElement) {
      inputElement.value = "";
    }
    removeFile();
  };

  const editingRuleEngineDataFrom = useSelector(
    (state) => state.ruleEngineEng?.UserData?.responseData
  );

  useEffect(() => {
    // if (editingRuleEngineDataFrom) {
    //   editingRuleEngineDataFrom.auctionCenterName = [];
    //   seteditingRuleEngineData(editingRuleEngineDataFrom);
    // }

    if (editingRuleEngineDataFrom) {
      let tempDataName = [];
      getAllAuctionCenter &&
        getAllAuctionCenter.map((auctionCenterData, auctioncenterIndex) => {
          if (
            editingRuleEngineDataFrom.auctionCenterId.includes(
              auctionCenterData.auctionCenterId
            )
          ) {
            tempDataName.push(auctionCenterData.auctionCenterName.toString());
          }
        });

      editingRuleEngineDataFrom.auctionCenterName = tempDataName;
      seteditingRuleEngineData(editingRuleEngineDataFrom);
    }
  }, [editingRuleEngineDataFrom]);

  const resetForm = () => {
    const inputElement = document.getElementById("ruleEngineUpload");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <>
      <Accordion>
        <AccordionDetails>
          <Typography>
            <div className="row">
              <div className="col-lg-12">
                <div className="row align-items-end">
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Auction Center</label>
                      <label className="errorLabel"> * </label>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        className="w-100"
                        value={editingRuleEngineData?.auctionCenterName || []}
                        onChange={handleChanges}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(", ")}
                        disabled={viewMode}
                      >
                        {console.log("line 240", getAllAuctionCenter)}
                        {getAllAuctionCenter?.map((AuctionCenter) => (
                          <MenuItem
                            key={AuctionCenter.auctionCenterId}
                            value={AuctionCenter.auctionCenterName}
                          >
                            <Checkbox
                              checked={
                                editingRuleEngineData?.auctionCenterName?.indexOf(
                                  AuctionCenter.auctionCenterName
                                ) > -1
                              }
                            />
                            <ListItemText
                              primary={AuctionCenter.auctionCenterName}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                      {auctionCenterIdError && (
                        <p className="errorLabel">{auctionCenterIdError}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>
                        Time interval between two auction session in minutes
                      </label>
                      <label className="errorLabel"> * </label>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          editingRuleEngineData?.timeIntervalBetweenTwoAuctionSession
                        }
                        onChange={(e) =>
                          editingRuleEngineData
                            ? seteditingRuleEngineData({
                                ...editingRuleEngineData,
                                timeIntervalBetweenTwoAuctionSession:
                                  e.target.value,
                              })
                            : ""
                        }
                        disabled={viewMode}
                      />
                      {timeIntervalBetweenTwoAuctionSessionError && (
                        <p className="errorLabel">
                          {timeIntervalBetweenTwoAuctionSessionError}
                        </p>
                      )}
                    </div>
                  </div>

                  {!viewMode ? (
                    <>
                      <div className="col-md-12">
                        <UploadMultipleDocuments
                          onFileSelect={handleFileUpload}
                          uploadedFiles={uploadedFiles}
                          setUploadedFiles={setUploadedFiles}
                          uploadDocumentError={uploadDocumentError}
                          inputId="ruleEngineUpload"
                        />
                      </div>

                      <div className="col-md-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Enter Remarks"
                          value={editingRuleEngineData?.uploadDocumentRemarks}
                          onChange={(e) =>
                            editingRuleEngineData
                              ? seteditingRuleEngineData({
                                  ...editingRuleEngineData,
                                  uploadDocumentRemarks: e.target.value,
                                })
                              : ""
                          }
                          disabled={viewMode}
                        ></textarea>
                        {remarksError && (
                          <p className="errorLabel" style={{ color: "red" }}>
                            {remarksError}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  {!viewMode ? (
                    <div className="col-md-12">
                      <div className="BtnGroup">
                        {modalRight?.some((ele) => ele === "2") && (
                          <button
                            className="SubmitBtn"
                            disabled={viewMode}
                            onClick={handleSubmit}
                          >
                            Update
                          </button>
                        )}
                        {/* <button
                          className="Clear"
                          disabled={viewMode}
                          onClick={handleClear}
                        >
                          Clear
                        </button> */}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
export default UpdateEngineRule;
