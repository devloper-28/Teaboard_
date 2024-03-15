import React, { useState } from "react";
// Date Range Picker
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import "./calender.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

function CalenderComponent({
  selectedDate,
  onChanges,
  error,
  name,
  value,
  onChange,
  onBlur,
  inValid,
}) {
  //set Selected Dates
  const handleDatepicker = (event, picker) => {
    picker.element.val(picker.startDate.format("MM/DD/YYYY"));
    onChanges(picker.startDate.format("D MMMM YYYY"));
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker label="Basic date picker" onChange={onChange} />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
}

export default CalenderComponent;
