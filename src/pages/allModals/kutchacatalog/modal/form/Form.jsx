import React, { useState } from "react";
import { Button, FormControl, InputGroup, Table } from "react-bootstrap";
import CustomeFormCreater from "../../../../../components/common/formCreater/CustomeFormCreater";
import * as Yup from "yup";
import KutchaTable from "../kutchaDataTable/KutchaTable";

function AWRForm() {
  const [uploadedData, setUploadedData] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
 
  const columns = [
    "Season",
    "Sale No.",
    "Warehouse",
    "Warehouse Name",
    "Auctioneer",
    "Grade",
    "Period of Manufacture (From Date)",
    "Period of Manufacture (To Date)",
    "Date of Dispatch",
    "Invoice No.",
    "Invoice Date",
    "Lorry Receipt No.",
    "Lorry No.",
    "Carrier",
    "Basic / A.D.E.",
    "Cess",
    "Total Duty Payable",
    "Arrival Date",
    "AWR Date",
    "AWR Ref. No.",
    "Tea Type",
    "Sub Type",
    "Category",
    "Package Size",
    "Package Type",
    "Package No.",
    "Total Packages",
    "Gross KGs",
    "Tare KGs",
    "Net KGs",
    "Total Net KGs",
    "GP No.",
    "GP Date",
    "Short/Excess Weight",
    "Location inside Warehouse",
  ];

  const fields = [
    {
      label: "Season",
      name: "season",
      type: "select",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
      required: false,
      className: "FormGroup",
    },
    {
      label: "Sale No",
      name: "sellno",
      type: "select",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
      required: false,
      className: "FormGroup",
    },
    {
      label: "Gate Pass Quantity",
      name: "gatePassQuantity",
      type: "text",
      required: true,
      className: "FormGroup",
    },
    {
      label: "AWR Ref No",
      name: "awrRefNo",
      type: "text",
      required: true,
      className: "FormGroup",
    },
    {
      label: "Mark",
      name: "mark",
      type: "select",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
      required: false,
      className: "FormGroup",
    },
    {
      label: "Warehouse",
      name: "warehouse",
      type: "select",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
      required: false,
      className: "FormGroup",
    },
    {
      label: "Arrival Date",
      name: "arrivalDate",
      type: "datepicker",
      required: true,
      className: "FormGroup",
    },
    {
      label: "AWR Date",
      name: "awrDate",
      type: "datepicker",
      required: true,
      className: "FormGroup",
    },
    {
      label: "Catalog Closing Date",
      name: "catalogClosingDate",
      type: "datepicker",
      required: true,
      className: "FormGroup",
    },
    {
      label: "Invoice Date",
      name: "invoiceDate",
      type: "datepicker",
      required: true,
      className: "FormGroup",
    },
    {
      label: "Manufacture",
      name: "manufacture",
      type: "select",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
      required: false,
      className: "FormGroup",
    },
    {
      label: "Grade",
      name: "grade",
      type: "select",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
      required: false,
      className: "FormGroup",
    },
  ];

  const initialValues = {
    seson: "",
    sellno: "",
    gatePassQuantity: "",
    awrRefNo: "",
    mark: "",
    warehouse: "",
    arrivalDate: "",
    awrDate: "",
    catalogClosingDate: "",
    invoiceDate: "",
    manufacture: "",
    grade: "",
  };

  const validationSchema = Yup.object().shape({
    gatePassQuantity: Yup.number()
      // .required("Gate Pass Quantity is required")
      .min(1, "Gate Pass Quantity must be at least 1"),
    awrRefNo: Yup.string().required("AWR Ref No is required"),
    arrivalDate: Yup.date().required("Arrival Date is required"),
    awrDate: Yup.date().required("AWR Date is required"),
    catalogClosingDate: Yup.date().required("Catalog Closing Date is required"),
    invoiceDate: Yup.date().required("Invoice Date is required"),
  });

  const handleSubmit = (fromData) => {
    // setUploadedData(fromData);
    console.log(fromData);
  };

  const tableData = [
    {
      Season: "Season 1",
      SaleNo: "Sale No. 1",
      Warehouse: "Warehouse 1",
      WarehouseName: "Warehouse Name 1",
      Auctioneer: "Auctioneer 1",
      Grade: "Grade 1",
      PeriodofManufactureFromDate: "From Date 1",
      PeriodofManufactureToDate: "To Date 1",
      DateofDispatch: "Dispatch Date 1",
      InvoiceNo: "Invoice No. 1",
      InvoiceDate: "Invoice Date 1",
      LorryReceiptNo: "Receipt No. 1",
      LorryNo: "Lorry No. 1",
      Carrier: "Carrier 1",
      BasicADE: "Basic / A.D.E. 1",
      Cess: "Cess 1",
      TotalDutyPayable: "Duty Payable 1",
      ArrivalDate: "Arrival Date 1",
      AWRDate: "AWR Date 1",
      AWRRefNo: "AWR Ref. No. 1",
      TeaType: "Tea Type 1",
      SubType: "Sub Type 1",
      Category: "Category 1",
      PackageSize: "Package Size 1",
      PackageType: "Package Type 1",
      PackageNo: "Package No. 1",
      TotalPackages: "Total Packages 1",
      GrossKGs: "Gross KGs 1",
      TareKGs: "Tare KGs 1",
      NetKGs: "Net KGs 1",
      TotalNetKGs: "Total Net KGs 1",
      GPNo: "GP No. 1",
      GPDate: "GP Date 1",
      ShortExcessWeight: "Short/Excess Weight 1",
      LocationinsideWarehouse: "Location 1",
    },
    {
      Season: "Season 1",
      SaleNo: "Sale No. 1",
      Warehouse: "Warehouse 1",
      WarehouseName: "Warehouse Name 1",
      Auctioneer: "Auctioneer 1",
      Grade: "Grade 1",
      PeriodofManufactureFromDate: "From Date 1",
      PeriodofManufactureToDate: "To Date 1",
      DateofDispatch: "Dispatch Date 1",
      InvoiceNo: "Invoice No. 1",
      InvoiceDate: "Invoice Date 1",
      LorryReceiptNo: "Receipt No. 1",
      LorryNo: "Lorry No. 1",
      Carrier: "Carrier 1",
      BasicADE: "Basic / A.D.E. 1",
      Cess: "Cess 1",
      TotalDutyPayable: "Duty Payable 1",
      ArrivalDate: "Arrival Date 1",
      AWRDate: "AWR Date 1",
      AWRRefNo: "AWR Ref. No. 1",
      TeaType: "Tea Type 1",
      SubType: "Sub Type 1",
      Category: "Category 1",
      PackageSize: "Package Size 1",
      PackageType: "Package Type 1",
      PackageNo: "Package No. 1",
      TotalPackages: "Total Packages 1",
      GrossKGs: "Gross KGs 1",
      TareKGs: "Tare KGs 1",
      NetKGs: "Net KGs 1",
      TotalNetKGs: "Total Net KGs 1",
      GPNo: "GP No. 1",
      GPDate: "GP Date 1",
      ShortExcessWeight: "Short/Excess Weight 1",
      LocationinsideWarehouse: "Location 1",
    },
    {
      Season: "Season 1",
      SaleNo: "Sale No. 1",
      Warehouse: "Warehouse 1",
      WarehouseName: "Warehouse Name 1",
      Auctioneer: "Auctioneer 1",
      Grade: "Grade 1",
      PeriodofManufactureFromDate: "From Date 1",
      PeriodofManufactureToDate: "To Date 1",
      DateofDispatch: "Dispatch Date 1",
      InvoiceNo: "Invoice No. 1",
      InvoiceDate: "Invoice Date 1",
      LorryReceiptNo: "Receipt No. 1",
      LorryNo: "Lorry No. 1",
      Carrier: "Carrier 1",
      BasicADE: "Basic / A.D.E. 1",
      Cess: "Cess 1",
      TotalDutyPayable: "Duty Payable 1",
      ArrivalDate: "Arrival Date 1",
      AWRDate: "AWR Date 1",
      AWRRefNo: "AWR Ref. No. 1",
      TeaType: "Tea Type 1",
      SubType: "Sub Type 1",
      Category: "Category 1",
      PackageSize: "Package Size 1",
      PackageType: "Package Type 1",
      PackageNo: "Package No. 1",
      TotalPackages: "Total Packages 1",
      GrossKGs: "Gross KGs 1",
      TareKGs: "Tare KGs 1",
      NetKGs: "Net KGs 1",
      TotalNetKGs: "Total Net KGs 1",
      GPNo: "GP No. 1",
      GPDate: "GP Date 1",
      ShortExcessWeight: "Short/Excess Weight 1",
      LocationinsideWarehouse: "Location 1",
    },
    // Add more data entries following the same pattern...
  ];

  const handleFileRemove = (index) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-6">
              <CustomeFormCreater
                fields={fields}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                handleFileRemove={handleFileRemove}
              />
            </div>
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
          </div>
        </div>
        <div className="col-md-12">
          <div className="TableBox">
            {/* <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {Object.keys(tableData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    {Object.values(data).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table> */}
            <KutchaTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AWRForm;
