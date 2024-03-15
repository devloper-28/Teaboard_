import React, { useState } from "react";
import CustomToast from "../../../components/Toast";

function AddWarehouseBillUploads() {
  const [warehouseBill, setwarehouseBill] = useState({
    "markId": 0
  });

  const Validate = () => {
    let isValid = true;
    if (
      warehouseBill.markId == null ||
      warehouseBill.markId == "SELECT" ||
      warehouseBill.markId == ""
    ) {
      CustomToast.error("Please select Mark");
      isValid = false;
      return;
    }
    
    return isValid;
  };
  
  const handleSubmit = (e) =>{
    e.preventDefault();
    if(Validate()){
       
    }else{
       
    }
  }


  const handleViewDealSearch = (e) => {
    const { name, value } = e.target;
    setwarehouseBill({ ...warehouseBill, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>Bill Type</label>
            <select className="form-control select=form" 
             
             >
              <option>1</option>
              <option value={1}>2</option>
              <option value={1}>3</option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>Mark</label><label className="errorLabel"> * </label>
            <select 
             className="form-control select=form"
             name="markId"
             onChange={handleViewDealSearch}
             value={warehouseBill.markId}             >
              <option>1</option>
              <option value={1}>2</option>
              <option value={1}>3</option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>Auctioneer</label><label className="errorLabel"> * </label>
            <select className="form-control select=form">
              <option></option>
              <option></option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>Bill Date</label><label className="errorLabel"> * </label>
            <select className="form-control select=form">
              <option></option>
              <option></option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>Bill Number</label><label className="errorLabel"> * </label>
            <select className="form-control select=form">
              <option></option>
              <option></option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>Gross Bill Amount</label><label className="errorLabel"> * </label>
            <select className="form-control select=form">
              <option></option>
              <option></option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>SGST on Gross Bill Amount</label><label className="errorLabel"> * </label>
            <select className="form-control select=form">
              <option></option>
              <option></option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>Bill Type</label>
            <select className="form-control select=form">
              <option></option>
              <option></option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>CGST on Gross Bill Amount</label><label className="errorLabel"> * </label>
            <select className="form-control select=form">
              <option></option>
              <option></option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>IGST on Gross Bill Amount</label><label className="errorLabel"> * </label>
            <select className="form-control select=form">
              <option></option>
              <option></option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>TDS Rate</label><label className="errorLabel"> * </label>
            <select className="form-control select=form">
              <option></option>
              <option></option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>Net Amount</label>
            <select className="form-control select=form">
              <option></option>
              <option></option>
            </select>
          </div>
        </div>
        <div className="col-xl-2">
          <div className="FomrGroup">
            <label>Remark</label><label className="errorLabel"> * </label>
            <select className="form-control select=form">
              <option></option>
              <option></option>
            </select>
          </div>
        </div>
        <div className="col-12">
          <div className="BtnGroup">
            <button type="submit" className="SubmitBtn">
              Search
            </button>
            <button type="button" className="SubmitBtn">
              Cancel
            </button>
            <button type="button" className="SubmitBtn">
              Reset
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddWarehouseBillUploads;
