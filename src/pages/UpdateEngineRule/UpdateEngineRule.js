import React, { useState, useEffect } from "react";
import TableComponent from "../../components/tableComponent/TableComponent";
import {
  updateRuleEngineAction,
  getRuleEngineByIdAction,
  getAllAuctionCenterAscAction,
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
import { Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
  const [uploadDocumentRemarks, setUploadDocumentRemarks] = useState("");
  const [showmodal, setShowmodal] = useState(false);
  const [expanded, setExpanded] = React.useState("panel2");
  const [auctionCenterIdError, setauctionCenterIdError] = useState("");
  const [auctionCenterId, setauctionCenterId] = useState([]);
  const [remarksError, setRemarksError] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [onChangesAuctionCenterId, setOnChangeAuctionCenterId] = useState([]);
  const [uploadDocumentError, setUploadDocumentError] = useState([]);
  const [editingRuleEngineData, seteditingRuleEngineData] = useState(null);
  const [
    timeIntervalBetweenTwoAuctionSessionError,
    settimeIntervalBetweenTwoAuctionSessionError,
  ] = useState("");
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
        isActive: "1",
      })
    );

    dispatch(getRuleEngineByIdAction(editAuctionCenterId));
  }, [getAllAuctionCenterAscAction]);
  const getAllAuctionCenterResponse = useSelector(
    (state) => state.auctionCenter?.getAllAuctionCenterAsc?.responseData
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
        CustomToast.error("Please select an auction center.");
        isValid = false;
        return;
      }

      // if (!editingRuleEngineData.basePriceOrClosingPriceIncrInTimes) {
      //   CustomToast.error(
      //     "Please select Base Price/Closing price increment in times"
      //   );
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

      if (!editingRuleEngineData.timeIntervalOfIncrInClosingPrice) {
        CustomToast.error(
          "Please enter the time interval of increment in closing price"
        );
        isValid = false;
        return;
      }
      if (!editingRuleEngineData.basePriceCapping) {
        CustomToast.error(
          "Please enter the Minimum Acceptable Price Percentage of SBP (Base Price Threshold)"
        );
        isValid = false;
        return;
      }

      // if (!uploadedDocuments.length && !uploadDocumentRemarks) {
      //   setUploadDocumentError("");
      //   setRemarksError("");
      // } else if (uploadedDocuments.length == 1 && !uploadDocumentRemarks) {
      //   CustomToast.error("Please enter the remarks");
      //   isValid = false;
      //   return;
      // } else if (!uploadedDocuments.length && uploadDocumentRemarks) {
      //   CustomToast.error("Please upload the document");
      //   isValid = false;
      //   return;
      // }

      if (!isValid) {
        return;
      }

      try {
        if (editingRuleEngineData) {
          const isFormModified =
            uploadDocumentRemarks !==
              editingRuleEngineData.uploadDocumentRemarks ||
            uploadedDocuments.length !==
              editingRuleEngineData.downloadDto.length;

          if (isFormModified) {
            editingRuleEngineData.searchData = {};
            editingRuleEngineData.uploadDocumentRemarks = uploadDocumentRemarks;
            editingRuleEngineData.downloadDto = uploadedDocuments;
            dispatch(updateRuleEngineAction(editingRuleEngineData));
            setShowChildmodal(false);
          } else {
            setShowChildmodal(false);
          }
        }
      } catch (error) {
        // setSubmitSuccess(false);
        // Handle the error as needed
        console.error(error);
      }
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
    (state) => state.ruleEngine?.UserData?.responseData
  );

  useEffect(() => {
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

      dispatch(
        getAllAuctionCenterAscAction({
          sortBy: "asc",
          sortColumn: "auctionCenterName",
          isActive: "1",
        })
      );
      setUploadDocumentRemarks(
        editingRuleEngineDataFrom.uploadDocumentRemarks || ""
      );
      setUploadedDocuments(editingRuleEngineDataFrom.downloadDto || []);
    } else {
    }
  }, [editingRuleEngineDataFrom]);

  const resetForm = () => {
    seteditingRuleEngineData("");
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
                      <label for="priceIncrement">
                        Base Price / Closing Price increment in times
                      </label>
                      <label className="errorLabel"> * </label>
                      <Tooltip
                        title="On this configuration, system will allow a buyer to bid within this specified increment limit to participate in the Pre-auction and live auction. For example: If the “Base Price / Closing Price” is 100 and “Base Price/Closing Price increment in times” is configured as 20, the maximum allowable MBP / Bid would be 100 * 20 = 2000. Therefore, any bid exceeding this increment will not be accepted by the system."
                        placement="top"
                      >
                        <InfoOutlinedIcon />
                      </Tooltip>
                      <select
                        className="form-control select-form"
                        id="selectBox"
                        value={
                          editingRuleEngineData?.basePriceOrClosingPriceIncrInTimes
                        }
                        onChange={(e) =>
                          editingRuleEngineData
                            ? seteditingRuleEngineData({
                                ...editingRuleEngineData,
                                basePriceOrClosingPriceIncrInTimes:
                                  e.target.value,
                              })
                            : ""
                        }
                        disabled={viewMode}
                      >
                        <option value="10">10 times</option>
                        <option value="20">20 times</option>
                        <option value="30">30 times</option>
                        <option value="40">40 times</option>
                        <option value="50">50 times</option>
                        <option value="60">60 times</option>
                        <option value="70">70 times</option>
                        <option value="80">80 times</option>
                        <option value="90">90 times</option>
                        <option value="100">100 times</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>
                        Time interval between two auction session in minutes
                      </label>
                      <label className="errorLabel"> * </label>
                      <Tooltip
                        title="-On this configuration, the Auction Session Interval sets the time gap between the end of one auction session and the start of the next (Applicable in Normal session).-This configuration should not be applicable for PRS auction session ‘coz PRS has a separate configuration for time interval."
                        placement="top"
                      >
                        <InfoOutlinedIcon />
                      </Tooltip>
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
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>
                        Time interval of increment in closing price in seconds
                      </label>
                      <label className="errorLabel"> * </label>
                      <Tooltip
                        title="-On this configuration, the “Time interval of increment in closing price (Closing Price Update Interval)” determines how often these closing prices are auto refreshed or auto modified during the course of an auction.-This configuration should be applicable for Normal and PRS auction session."
                        placement="top"
                      >
                        <InfoOutlinedIcon />
                      </Tooltip>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          editingRuleEngineData?.timeIntervalOfIncrInClosingPrice
                        }
                        onChange={(e) =>
                          editingRuleEngineData
                            ? seteditingRuleEngineData({
                                ...editingRuleEngineData,
                                timeIntervalOfIncrInClosingPrice:
                                  e.target.value,
                              })
                            : ""
                        }
                        disabled={viewMode}
                      />
                      {timeIntervalOfIncrInClosingPriceError && (
                        <p className="errorLabel">
                          {timeIntervalOfIncrInClosingPriceError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="FormGroup">
                      <label>Minimum Acceptable Price Percentage of SBP</label>
                      <label className="errorLabel"> * </label>
                      <Tooltip
                        title={
                          "-On this configuration, the field that controls the minimum acceptable value for the Base Price is often referred to as the Minimum Acceptable Price Percentage of SBP (Base Price Threshold) field. For e.g. If System base price (SBP) is 100, and configured percentage as 50% (greater than or equal to 50% to be considered), then the system will accept 50 or more than 50 as Base Price. System will not accept 49 or lower than 49 value in Base Price.-	This configuration should be applicable for Normal and PRS auction session.-	System should allow updating the above-mentioned details to the authorized user. On submitting, system should display a confirmation message that “These changes will be applicable in newly created (upcoming) sale no. only; this will not effect on already created sale no(s). Are you sure you want to submit this changes?” with Yes and No options.-	By clicking on Yes, system should display a confirmation message that “Rule engine changes updated successfully” and capture the entry in audit trail report as “Rule engine changes updated successfully”.-	By clicking on No, system should not update the changes and redirect on the same page."
                        }
                        placement="top"
                      >
                        <InfoOutlinedIcon />
                      </Tooltip>
                      <input
                        type="text"
                        className="form-control"
                        value={editingRuleEngineData?.basePriceCapping}
                        onChange={(e) =>
                          editingRuleEngineData
                            ? seteditingRuleEngineData({
                                ...editingRuleEngineData,
                                basePriceCapping: e.target.value,
                              })
                            : ""
                        }
                        disabled={viewMode}
                      />
                      {basePriceCappingError && (
                        <p className="errorLabel">{basePriceCappingError}</p>
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

                  <p className="Red mt-2 ml-3">
                    Note:These changes will be applicable in upcoming sale no. /
                    Auction sessions only; this will not effect on already
                    created sale no(s)
                  </p>
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
