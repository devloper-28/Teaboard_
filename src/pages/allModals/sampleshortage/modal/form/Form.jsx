import React, { useEffect, useState } from "react";
import { Button, FormControl, InputGroup, Table } from "react-bootstrap";
import CustomeFormCreater from "../../../../../components/common/formCreater/CustomeFormCreater";
import * as Yup from "yup";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  addAwrRequest,
  fetchCategoryRequest,
  fetchGradeRequest,
  fetchInvoiceDetailsRequest,
  fetchMarkRequest,
  fetchSaleProgramListRequest,
  fetchSubTeaTypeRequest,
  fetchWarehouseUserRequest,
  teaTypeAction,
  uploadSampleShortageRequest,
} from "../../../../../store/actions";
import { fetchSaleNumbersRequest } from "../../../../../store/actions/createdSaleNo/CreatedSaleNo";
import { useFormik } from "formik";
import axios from "axios";

import { setRef } from "@mui/material";
import SheetUploader from "../../../../../components/common/uploadFile/SheetUploader";
import FileUpload from "../../../../../components/common/uploadFile/FileUpload";
import { readFileAndCheckHeaders } from "../../../../../components/common/uploadFile/utils";
import CustomToast from "../../../../../components/Toast";
import { useAuctionDetail } from "../../../../../components/common/AunctioneerDeteailProvider";

const currentDate = new Date().toISOString()?.split("T")[0];

// Get the current year
const currentYear = new Date().getFullYear();

const currentWeek = Math.ceil(
  ((currentDate - new Date(currentYear, 0, 4)) / 86400000 + 1) / 7
);

const validationSchema = Yup.object().shape({
  LotNo: Yup.string().required("LotNo is required"),
  packageNo: Yup.string().required("Package No is required"),
  sampleWeight: Yup.number()
    .required("Sample Weight is required")
    .min(0, "Sample Weight must be a positive number"),
  shortWeight: Yup.number()
    .required("Short Weight is required")
    .min(0, "Short Weight must be a positive number"),
  inspectionCharges: Yup.number().required("Inspection Charges is required"),
  reInspectionCharges: Yup.number().required(
    "Re-inspection Charges must be a non-negative number"
  ),
});

// const handleSubmit = (fromData) => {
//   // setUploadedData(fromData);
//   const data = {
//     season: fromData.season,
//     saleNo: fromData.saleNo,
//     gpQty: 800,
//     awrReferenceNo: fromData.awrReferenceNo,
//     markId: fromData.mark,
//     wareHouseUserRegId: fromData.wareHouseUserRegId,
//     arrivalDate: fromData.arrivalDate,
//     awrDate: fromData.awrDate,
//     catalogClosingDate: fromData.catalogClosingDate,
//     invoiceDate: fromData.invoiceDate,
//     factoryName: fromData.factoryName,
//     gradeId: fromData.gradeId,
//     awrInvoices: fromData.awrInvoices,
//   };
//   console.log(data);
// };

function AWRForm({ isDisabled }) {
  const [uploadedData, setUploadedData] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [teaTypeList, setTeaTeatypeList] = useState([]);
  const [markDataList, setMarkDataList] = useState([]);
  const [warehouseUserList, setWarehouseUserList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [saleNo, setSaleNo] = useState([]);
  const [subTeaTypeNo, setSubTeaTypeNo] = useState([]);
  const [catagory, setCategory] = useState([]);
  const [saleprogram, setsaleprogrm] = useState([]);
  const [formData, setFormData] = useState({});
  const [sampleList, setSampleList] = useState([]);
  const [handleChnage, setHandleChnage] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showCreateButton, setShowCreateButton] = useState(false);
  //FIle Uploade
  const [fileData, setFileData] = useState([]);
  const [validationData, setValidationData] = useState([]);
   const { auctionDetailId, auctionCenterUserId, auctionCenterId, userId,roleCode } =
    useAuctionDetail();

  const initialValues = {
    LotNo: "",
    packageNo: "",
    sampleWeight: 0,
    shortWeight: 0,
    inspectionCharges: 0,
    reInspectionCharges: 0,
    isActive: true,
    createdBy: userId, //auctioner
    updatedBy: userId, //auctioner
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      setTableData(values, "values");
      // console.log(data, "hello");
    },
    validateOnBlur: false, // Disable validation on blur
    validateOnChange: handleChnage, // Disable validation on change
    isInitialValid: false,
  });

  const dispatch = useDispatch();

  const teaType = useSelector(
    (state) => state.teaType.teaTypeList.responseData
  );
  const subTeaType = useSelector((state) => state.teaType.data.responseData);

  const markList = useSelector((state) => state.mark.data.responseData);
  const warehouseUsersList = useSelector(
    (state) => state.warehouseUser.data.responseData
  );
  const grades = useSelector((state) => state.grade.data.responseData);

  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const category = useSelector((state) => state?.category?.data?.responseData);

  const invoiceData = useSelector(
    (state) => state?.invoiceDetails?.data?.responseData
  );

  console.log(invoiceData, "invoiceData");

  useEffect(() => {
    dispatch(teaTypeAction({auctionCenterId }));
    dispatch(fetchMarkRequest({auctionCenterId }));
    dispatch(fetchWarehouseUserRequest({ auctionCenterId }));
    dispatch(fetchGradeRequest({auctionCenterId}));
    // dispatch(fetchSaleProgramListRequest(saleData));
    // dispatch(fetchSubTeaTypeRequest(formik.values.teaType));
    // dispatch(fetchSubTeaTypeRequest(formik.values.teaType));
    dispatch(fetchCategoryRequest({
        teaTypeId: parseInt(formik.values.teaType),
        auctionCenterId,
      }));
    dispatch(fetchSaleNumbersRequest(formik.values.season));
  }, []);

  useEffect(() => {
    setTeaTeatypeList(teaType);
    setMarkDataList(markList);
    setWarehouseUserList(warehouseUsersList);
    setGradesList(grades);
    setSaleNo(saleNumber);
    setSubTeaTypeNo(subTeaType);
    setCategory(category);
  }, [
    teaType,
    subTeaType,
    markList,
    warehouseUsersList,
    grades,
    saleNumber,
    category,
  ]);

  const fields = [
    {
      label: "Mark",
      name: "mark",
      type: isDisabled === true ? "disable" : "select",
      options: markDataList?.map((ele) => {
        return { label: ele.markName, value: ele.markId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Tea Type",
      name: "mark",
      type: isDisabled === true ? "disable" : "select",
      options: markDataList?.map((ele) => {
        return { label: ele.markName, value: ele.markId };
      }),
      required: false,
      className: "FormGroup",
    },
    {
      label: "Grade",
      name: "grade",
      type: isDisabled === true ? "disable" : "select",
      options: gradesList?.map((ele) => {
        return { label: ele.gradeName, value: ele.gradeId };
      }),
      required: false,
      className: "FormGroup",
    },
  ];

  const Controlls = () => {
    return (
      <>
        <div className="BtnGroup">
          {/* <Button
            onClick={() => {
              if (tableData?.length > 0) {
                // let tableDatas = tableData?.map((ele) => {
                //   ele.gpDate + "" + ele.gpNo;
                // });
                tableData[0].gpDate = formik.values.gpDate;
                tableData[0].gpNo = formik.values.gpNo.toString();
                dispatch(addAwrRequest(tableData));
              } else {
                CustomToast.error("Add Awr to create AWR");
              }
            }}
            className="SubmitBtn"
          >
            Create
          </Button> */}

          {/* <label className="btn SubmitBtn mr-2">
            <ImportExportIcon />
          </label> */}

          {/* <label htmlFor="fileUpload" className="btn SubmitBtn mr-2">
            <FileUploadIcon />
          </label> */}
          {/* <input
            type="file"
            className="form-control"
            id="fileUpload"
            accept=".xls, .xlsx"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            multiple
          /> */}
          {/* <label className="btn SubmitBtn">
            <PictureAsPdfIcon />
          </label> */}
        </div>
      </>
    );
  };

  const handleFileRemove = (index) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const propertyNames = [
    "inspectionchgs",
    "lotno",
    "packageno",
    "reinspectionchgs",
    "samplewt",
    "shortwt",
  ];

  const handleData = async (uploadedData) => {
    // for (const { fileName, data, missingHeaders } of uploadedData) {

    //   if (missingProperties && missingProperties.length > 0) {
    //     console.log(`File '${fileName}' with camel case data:`, data);
    //     updatedFileData.push(data);
    //     // updatedFileData.push(data)
    //     // ... rest of the code ...
    //   } else if (missingHeaders) {
    //     // Show toaster with missing headers for the current file
    //     CustomToast.error(
    //       `File '${fileName}' has missing headers: ${missingHeaders.join(", ")}`
    //     );
    //   } else {
    //     // Show toaster for any other errors
    //     CustomToast.error(`Error reading file '${fileName}'`);
    //   }
    // }

    setFileData(uploadedData);
  };
  const validation = async (uploadedData) => {
    const updatedFileData = [];
    if (fileData.length > 0) {
      for (const { fileName, data } of uploadedData) {
        if (data && data.length > 0) {
          const missingProperties = propertyNames.filter((propertyName) => {
            return !data.some((obj) => propertyName in obj);
          });

          const filteredData = data.filter((obj) => {
            // Check if any key in the object has a defined value
            return Object.values(obj).some((value) => value !== undefined);
          });

          if (missingProperties.length === 0 && filteredData.length > 0) {
            // console.log(`All properties are present in file '${fileName}'`);
            CustomToast.success(
              `All properties are present in file ${fileName}`
            );
            updatedFileData.push(filteredData);
            // Continue with processing the data
            // ... rest of your code ...
          } else {
            // console.log(
            //   `Missing properties in file '${fileName}':`,
            //   missingProperties
            // );

            // Handle the case where properties are missing
            CustomToast.error(
              `Missing properties in file '${fileName}': ${missingProperties.join(
                ", "
              )}`
            );
          }
        } else {
          // Handle the case where the data array is empty
          CustomToast.error(`No data found in file '${fileName}'`);
        }
      }
    } else {
      CustomToast.error(`No file found in fields`);
    }
    const mergedArray = updatedFileData.reduce((result, currentArray) => {
      return result.concat(currentArray);
    }, []);
    // console.log(mergedArray, "updatedFileData");

    setValidationData([...sampleList, ...mergedArray]);
  };

  const handleAddData = () => {
    // You can call this function when the "Add Data" button is clicked
    const newArray = validationData?.map((obj) => ({
      ...obj,
      packageno:
        obj.packageno !== undefined ? obj.packageno.toString() : obj.packageno,
    }));

    const finalData = newArray?.map(
      ({ lotno, packageno, inspectionchgs, reinspectionchgs, ...rest }) => ({
        LotNo: lotno,
        packageNo: packageno,
        sampleWeight: rest.samplewt,
        shortWeight: rest.shortwt,
        inspectionCharges: inspectionchgs,
        reInspectionCharges: reinspectionchgs,
        isActive: true,
        createdBy: userId, //auctioner
        updatedBy: userId, //auctioner
        season: rest.season?.toString(),
        saleNo: parseInt(rest.saleNo === "" ? 0 : rest.saleNo),
        auctionCenterId: auctionCenterId,
        ...rest,
      })
    );

    const fileInput = document.getElementById("fileInput");

    if (fileData?.length > 0 && validationData?.length > 0) {
      // handleData(/* Your uploaded data here */);
      fileInput.value = "";
      setSampleList(finalData);
      setFileData([]);
      setShowCreateButton(true);
      CustomToast.success("Data added successfully!");
    } else {
      CustomToast.error("Data validation failed! Cannot add data.");
    }
  };

  // console.log(fileData, "fileData");

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <CustomeFormCreater
            fields={fields}
            initialValues={initialValues}
            validationSchema={validationSchema}
            // handleSubmit={() => handleSubmit()}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            handleFileRemove={handleFileRemove}
            formik={formik}
            Controlls={Controlls}
            setHandleChnage={setHandleChnage}
          />
        </div>
        <div className="col-md-6">
          <Button className="SubmitBtn">Add</Button>
        </div>
      </div>

      {/* <SheetUploader
                sheetDataList={sheetDataList}
                setSheetDataList={setSheetDataList}
                validationMessages={validationMessages}
                setValidationMessages={setValidationMessages}
              /> */}

      {/* <div className="col-md-6">
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>File Name</th>
                          <th>File Type</th>
                          <th>File Size</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadedFiles.map((file, index) => (
                          <tr key={index}>
                            <td>{file.name}</td>
                            <td>{file.type}</td>
                            <td>{Math.round(file.size / 1024)} KB</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleFileRemove(index)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div> */}

      <div className="row mt-3">
        <div className="col-md-6">
          <FileUpload
            id="fileInput"
            handleData={handleData}
            readFileAndCheckHeaders={readFileAndCheckHeaders}
          />
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-1">
              <Button
                className="SubmitBtn w-100"
                onClick={() => handleAddData()}
              >
                Add
              </Button>
            </div>
            <div className="col-md-1">
              <Button
                className="SubmitBtn"
                onClick={() => validation(fileData)}
              >
                Validate
              </Button>
            </div>
            <div className="col-md-6">
              <Button
                disable={showCreateButton}
                className="SubmitBtn"
                onClick={() => {
                  if (sampleList?.length > 0) {
                    dispatch(uploadSampleShortageRequest(sampleList));
                  } else {
                    CustomToast.error("First add data after create.");
                  }
                }}
              >
                Upload Sample & Shortage
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="TableBox">
          {sampleList?.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {/* {Object.keys(fileData[0])?.map((key) => (
                        <th key={key}>{key}</th>
                      ))} */}
                  <th>Package No</th>
                  <th>Sample Weight</th>
                  <th>Short Weight</th>
                  <th>Inspection Charges</th>
                  <th>ReInspection Charges</th>
                </tr>
              </thead>
              <tbody>
                {sampleList?.map((data, index) => (
                  <tr key={index}>
                    {/* {Object.entries(data).map(([key, value], i) => (
                          <td key={i}>{value}</td>
                        ))} */}
                    <td>{data.packageNo}</td>
                    <td>{data.sampleWeight}</td>
                    <td>{data.shortWeight}</td>
                    <td>{data.inspectionCharges}</td>
                    <td>{data.reInspectionCharges}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {/* {Object.keys(fileData[0])?.map((key) => (
                        <th key={key}>{key}</th>
                      ))} */}
                  <th>PackageNo</th>
                  <th>SampleWt</th>
                  <th>ShortWt</th>
                  <th>InspectionCharges</th>
                  <th>ReInsoectionCharges</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center">
                    No Data
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </div>
      </div>
      {/* <ToastContainer autoClose={1200} /> */}
    </div>
  );
}

export default AWRForm;
