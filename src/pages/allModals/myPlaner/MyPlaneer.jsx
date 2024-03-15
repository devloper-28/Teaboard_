import React, { useState, useEffect } from "react";
import TableComponent from "../../../components/tableComponent/TableComponent";
import { fetchSaleNumbersRequest } from "../../../store/actions";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";

const AuctionCatalog = () => {
  const [rows, setRows] = useState([]);

  const [saleNo, setSaleNo] = useState([]);
  const saleNumber = useSelector(
    (state) => state?.CreatedSaleNo?.saleNumbers?.responseData
  );
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      season: "",
      saleNo: "",
      auctionDate: "",
      auctioneer: "",
      teaType: "",
      category: "",
      sessionTime: "",
    },
    onSubmit: (values) => {
      // This function will be called when the form is submitted
      console.log("Form data submitted:", values);
    },
  });

  useEffect(() => {
    // setRows(sellPrograms);
    dispatch(fetchSaleNumbersRequest(formik.values.season));
  }, []);
  const sellPrograms = [
    { title: "Lot No.", name: "LotNo" },
    { title: "Mark", name: "markName" },
    { title: "Invoice No.", name: "invoiceNo" },
    { title: "Grade", name: "gradeName" },
    { title: "No. of Packages", name: "noOfPackages" },
    { title: "Base Price", name: "basePrice" },
    // { title: "Reserve Price", name: "reservePrice" },
    { title: "Auctioneer’s Valuation", name: "auctioneerValuation" },
    { title: "Price Increment", name: "priceIncrement" },
    { title: "LSP / SP", name: "LSP_SP" },
    // { title: "Quality Comments", name: "qualityComments" },
    { title: "Origin", name: "Origin" },
    { title: "Tea Type", name: "teaTypeName" },
    { title: "Sub Type", name: "subTeaTypeName" },
    { title: "Category", name: "categoryName" },
    { title: "Package Type", name: "packageType" },
    { title: "Package No.", name: "packageNo" },
    { title: "Gross Weight", name: "grossKgs" },
    { title: "Tare Weight", name: "tareKgs" },
    { title: "Net Weight", name: "netKgs" },
    { title: "Sample Qty. (KGs)", name: "SampleQty" },
    { title: "Invoice Weight", name: "invoiceQty" },
    // { title: "Short accses Weight", name: "shortAccsesWeight" },
    { title: "GP No.", name: "gpNo" },
    { title: "GP Date", name: "gpDate" },
    { title: "Period of Manufacture", name: "periodOfManufacture" },
    { title: "Mark & Packaging Comments", name: "markPackageComments" },
    { title: "Market Type", name: "marketTypeName" },
    { title: "Warehouse Name", name: "wareHouseName" },
    { title: "Garden Certification", name: "gardenCertification" },
    { title: "Quality Certification", name: "qualityCertification" },
    { title: "Color of Brew", name: "brewColor" },
    { title: "Age of Products (In Months)", name: "ageOfProducts" },
    { title: "Brewers Comments", name: "brewersComments" },
    { title: "System Base Price", name: "SystemBasePrice" },
    { title: "SBP_LSP/SP", name: "SBP_LSP_SP" },
    // { title: "Lot Comments", name: "lotComments" },
  ];

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        {/* <div className="row">
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="season">Season</label>
              <input
                type="text"
                id="season"
                name="season"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.season}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="saleNo">Sale No.</label>
              <input
                type="text"
                id="saleNo"
                name="saleNo"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.saleNo}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="auctionDate">Auction Date</label>
              <input
                type="text"
                id="auctionDate"
                name="auctionDate"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.auctionDate}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="auctioneer">Auctioneer</label>
              <input
                type="text"
                id="auctioneer"
                name="auctioneer"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.auctioneer}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="teaType">Tea Type</label>
              <input
                type="text"
                id="teaType"
                name="teaType"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.teaType}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.category}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="sessionTime">Session Time</label>
              <input
                type="text"
                id="sessionTime"
                name="sessionTime"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sessionTime}
              />
            </div>
          </div>
        </div> */}
        <div className="row">
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="season">Season</label>
              <select
                id="season"
                name="season"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.season}
              >
                <option value="">Select Season</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="saleNo">Sale No.</label>
              <select
                id="saleNo"
                name="saleNo"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.saleNo}
              >
                <option value="">Select Sale No.</option>
                <option value="123">123</option>
                <option value="456">456</option>
                <option value="789">789</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="auctionDate">Auction Date</label>
              <select
                id="auctionDate"
                name="auctionDate"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.auctionDate}
              >
                <option value="">Select Auction Date</option>
                <option value="2023-09-15">2023-09-15</option>
                <option value="2023-09-16">2023-09-16</option>
                <option value="2023-09-17">2023-09-17</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="auctioneer">Auctioneer</label>
              <select
                id="auctioneer"
                name="auctioneer"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.auctioneer}
              >
                <option value="">Select Auctioneer</option>
                <option value="Auctioneer 1">Auctioneer 1</option>
                <option value="Auctioneer 2">Auctioneer 2</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="teaType">Tea Type</label>
              <select
                id="teaType"
                name="teaType"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.teaType}
              >
                <option value="">Select Tea Type</option>
                <option value="Green Tea">Green Tea</option>
                <option value="Black Tea">Black Tea</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.category}
              >
                <option value="">Select Category</option>
                <option value="Category 1">Category 1</option>
                <option value="Category 2">Category 2</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="FormGroup">
              <label htmlFor="sessionTime">Session Time</label>
              <select
                id="sessionTime"
                name="sessionTime"
                className="form-control select-form"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sessionTime}
              >
                <option value="">Select Session Time</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-auto">
            <button type="submit" className="SubmitBtn btn">
              Refresh
            </button>
          </div>
          <div className="col-lg-auto">
            <button type="submit" className="SubmitBtn btn">
              Clear
            </button>
          </div>
          {/* ... Other buttons */}
        </div>
      </form>

      <div className="row mt-4">
        <div className="col-12">
          <TableComponent
            columns={sellPrograms}
            rows={rows?.length > 0 ? rows : []}
            setRows={setRows}
            addpagination={true}
            dragdrop={false}
            fixedColumnsOn={false}
            resizeingCol={false}
            selectionCol={true}
            sorting={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AuctionCatalog;
