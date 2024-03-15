// import { AccordionDetails, AccordionSummary, Typography } from "@mui/material";
// import React from "react";
// import { Accordion } from "react-bootstrap";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import {
//   createWarehouseUnitRequest,
//   searchUnitRequest,
//   updateWarehouseUserRequest,
// } from "../../../store/actions";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import UploadMultipleDocuments from "../../uploadDocument/UploadMultipleDocuments";

// export const WarehouseUnitRegistration = () => {
//   const [expandedSub, setExpandedSub] = React.useState("panel1");
//   const [wareHouseUnitCodeValid, setwareHouseUnitCodeValid] = useState("");
//   const [wareHouseUnitNameValid, setwareHouseUnitNameValid] = useState("");
//   const [uploadedDocuments, setUploadedDocuments] = useState([]);
//   const [uploadDocumentError, setUploadDocumentError] = useState("");
//   const [disabled, setDisabled] = useState(false);
//   const [warehouseDisabled, setwarehouseDisabled] = useState(false);
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [isEdit, setIsedit] = useState(false);
//   const [unitSearchData, setUnitSearchData] = useState([]);
//   const [expanded, setExpanded] = React.useState("panel1");
//   const [unitsearch, setUnitSearch] = useState([]);

//   const dispatch = useDispatch();

//   const handleChangeExpandSub = (panel) => (event, isExpanded) => {
//     setExpandedSub(isExpanded ? panel : false);
//   };

//   const [formDataUnit, setFormDataUnit] = useState({
//     wareHouseUserRegId: null,
//     wareHouseUnitCode: "",
//     wareHouseUnitName: "",
//   });

//   const handleFileUpload = (files) => {
//     const newFiles = files?.map((file) => ({
//       documentContent: file.documentContent,
//       documentName: file.documentName,
//       documentSize: file.documentSize,
//     }));
//     setUploadedDocuments(newFiles);

//     // setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
//   };
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     formDataUnit.downloadDto = uploadedDocuments;
//     console.log(formDataUnit.isActive);
//     setFormDataUnit({ ...formDataUnit, [name]: value });
//   };
//   const resetFormUnit = () => {};
//   const UnithandleChange = (e) => {
//     const { name, value } = e.target;
//     setFormDataUnit({
//       ...formDataUnit,
//       [name]: value,
//     });
//   };
//   const validUnit = () => {
//     let isValid = true;

//     if (formDataUnit.wareHouseUnitCode == "") {
//       isValid = false;
//       setwareHouseUnitCodeValid("Please Enter Valid Unit Code");
//     } else {
//       setwareHouseUnitCodeValid("");
//     }
//     if (formDataUnit.wareHouseUnitName == "") {
//       isValid = false;
//       setwareHouseUnitCodeValid("Please Enter Valid Unit Name");
//     } else {
//       setwareHouseUnitCodeValid("");
//     }
//     return isValid;
//   };

//   const handleWarehouseUnitNameChange = (e) => {
//     const { name, value } = e.target;
//     setUnitSearchData({ ...unitSearchData, [name]: value });
//   };
//   const handleUnitSearch = (e) => {
//     e.preventDefault();
//     dispatch(searchUnitRequest(unitSearchData));
//   };

//   const UnithandleSubmit = (e) => {
//     e.preventDefault();
//     if (validUnit()) dispatch(createWarehouseUnitRequest(formDataUnit));
//   };

//   const SaveUpdatedUnit = () => {
//     if (validUnit() && isEdit == true) {
//     }
//   };

//   const ClearUnitSearch = () => {
//     dispatch(searchUnitRequest({}));
//     unitSearchData.wareHouseUnitCode = "";
//     unitSearchData.wareHouseUnitName = "";
//   };

//   const ViewUniWareHouse = () => {
//     setwarehouseDisabled(true);
//     setExpandedSub("panel1");
//   };
//   const EditUniWareHouse = (unitData) => {};

//   return (
//     <div>
//       <Accordion
//         expanded={expandedSub === "panel1"}
//         className={`${expandedSub === "panel1" ? "active" : ""}`}
//         onChange={handleChangeExpandSub("panel1")}
//         TransitionProps={{ unmountOnExit: true }}
//       >
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel1a-content"
//           id="panel1a-header"
//         >
//           <Typography>Warehouse Unit Registration</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Typography>
//             <form onSubmit={UnithandleSubmit}>
//               <div className="row align-items-center">
//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>Address</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="address"
//                       value={formDataUnit?.address}
//                       maxLength={500}
//                       disabled
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>City</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="city"
//                       value={formDataUnit?.city}
//                       maxLength={50}
//                       disabled
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>Contact Person</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="contactPerson"
//                       value={formDataUnit?.contactPerson}
//                       maxLength={100}
//                       disabled
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>E Mail</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="email"
//                       value={formDataUnit?.email}
//                       maxLength={50}
//                       disabled
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>Entity Code</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="entityCode"
//                       value={formDataUnit?.entityCode}
//                       disabled
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>Fax</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="fax"
//                       value={formDataUnit?.fax}
//                       maxLength={15}
//                       disabled
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>Mobile No</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="mobileNo"
//                       value={formDataUnit?.mobileNo}
//                       maxLength={15}
//                       disabled
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>Phone: </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="phoneNo"
//                       value={formDataUnit?.phoneNo}
//                       maxLength={15}
//                       disabled
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>Short Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="shortName"
//                       value={formDataUnit?.shortName}
//                       maxLength={15}
//                       disabled
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>Teaboard Reg No</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="teaBoardRegistrationNo"
//                       value={formDataUnit?.teaBoardRegistrationNo}
//                       maxLength={15}
//                       disabled
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>Ware House Unit Code</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="wareHouseUnitCode"
//                       value={formDataUnit?.wareHouseUnitCode}
//                       onChange={UnithandleChange}
//                       maxLength={10}
//                       disabled={warehouseDisabled}
//                     />
//                     <p className="errorLabel">{wareHouseUnitCodeValid}</p>
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>Ware House Unit Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="wareHouseUnitName"
//                       value={formDataUnit?.wareHouseUnitName}
//                       onChange={UnithandleChange}
//                       maxLength={50}
//                       disabled={warehouseDisabled}
//                     />
//                     <p className="errorLabel">{wareHouseUnitNameValid}</p>
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <div className="FomrGroup">
//                     <label>Ware House License No</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="wareHouseLicenseNo"
//                       value={formDataUnit?.wareHouseLicenseNo}
//                       maxLength={50}
//                       disabled
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-md-12">
//                   <UploadMultipleDocuments
//                     onFileSelect={handleFileUpload}
//                     uploadedFiles={uploadedFiles}
//                     setUploadedFiles={setUploadedFiles}
//                     uploadDocumentError={uploadDocumentError}
//                     inputId="#stateUpload"
//                   />
//                 </div>
//               </div>
//               <div className="row mt-3">
//                 <div className="col-12">
//                   <div className="BtnGroup">
//                     {isEdit == true ? (
//                       <button
//                         className={"SubmitBtn"}
//                         onClick={() => SaveUpdatedUnit()}
//                         disabled={disabled}
//                       >
//                         Update
//                       </button>
//                     ) : (
//                       <button className="SubmitBtn" disabled={disabled}>
//                         Submit
//                       </button>
//                     )}

//                     <button
//                       className="SubmitBtn"
//                       type="button"
//                       onClick={() => resetFormUnit()}
//                       disabled={disabled}
//                     >
//                       Clear
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </Typography>
//         </AccordionDetails>
//       </Accordion>
//       <Accordion
//         expandedSub={expandedSub === "panel2"}
//         className={`${expanded === "panel2" ? "active" : ""}`}
//         onChange={handleChangeExpandSub("panel2")}
//         TransitionProps={{ unmountOnExit: true }}
//       >
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel1a-content"
//           id="panel1a-header"
//         >
//           <Typography>Manage Warehouse Unit</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Typography>
//             <form onSubmit={handleUnitSearch}>
//               <div className="row align-items-center">
//                 <div className="col-md-3">
//                   <div className="FomrGroup">
//                     <label>Ware House Unit Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="wareHouseUnitName"
//                       value={unitSearchData.wareHouseUnitName}
//                       onChange={handleWarehouseUnitNameChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-3">
//                   <div className="FomrGroup">
//                     <label>Ware House Unit Code</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="wareHouseUnitCode"
//                       value={unitSearchData.wareHouseUnitCode}
//                       onChange={handleWarehouseUnitNameChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="col-auto">
//                   <div className="BtnGroup">
//                     <button className="SubmitBtn">Search</button>
//                     <button
//                       className="SubmitBtn"
//                       onClick={() => ClearUnitSearch()}
//                     >
//                       Clear
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </form>
//             <div className="row">
//               <div className="col-12">
//                 <div className="TableBox">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Address</th>
//                         <th>City</th>
//                         <th>Contact Person</th>
//                         <th>E Mail</th>
//                         <th>Entity Code</th>
//                         <th>Fax</th>
//                         <th>Mobile No</th>
//                         <th>Phone</th>
//                         <th>Short Name</th>
//                         <th>Tea board Rag. No</th>
//                         <th>Ware House Unit Code</th>
//                         <th>Ware Unit Name</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {unitsearch?.map((unit) => (
//                         <tr key={unit.id}>
//                           <td>{unit.address}</td>
//                           <td>{unit.city}</td>
//                           <td>{unit.contactPerson}</td>
//                           <td>{unit.email}</td>
//                           <td>{unit.entityCode}</td>
//                           <td>{unit.fax}</td>
//                           <td>{unit.mobileNo}</td>
//                           <td>{unit.phoneNo}</td>
//                           <td>{unit.shortName}</td>
//                           <td>{unit.teaBoardRegistrationNo}</td>
//                           <td>{unit.wareHouseUnitCode}</td>
//                           <td>{unit.wareHouseUnitName}</td>
//                           <td className="Action">
//                             <i
//                               className="fa fa-eye"
//                               onClick={() => ViewUniWareHouse()}
//                             ></i>
//                             <i
//                               className="fa fa-edit"
//                               onClick={() => EditUniWareHouse(unit)}
//                             ></i>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </Typography>
//         </AccordionDetails>
//       </Accordion>
//     </div>
//   );
// };


// export default WarehouseUnitRegistration;