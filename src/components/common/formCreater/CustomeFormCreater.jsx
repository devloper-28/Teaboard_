import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

const CommonForm = ({ fields, Controlls, formik, setHandleChnage, pageName }) => {
  const { values, handleChange, handleReset, errors: formikErrors } = formik;
  const resetForm = () => {
    handleReset();
    setHandleChnage(false); // Reset the "handleChange" flag as well
    fields
      .filter(
        (field) => field.type === "select" || field.type === "disableSelect"
      )
      .forEach((field) => {
        formik.setFieldValue(field.name, "");
      });
  };
  return (
    <>
      {fields.map((field, index) => (
        <div className="col-xl-2 col-lg-3 col-md-4" key={index}>
          <div className={field.className}>
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === "select" ? (
              <div className="FormGroup">
                <select
                  className="select-form form-control"
                  name={field.name}
                  id={field.name}
                  value={
                    values[field.name] !== undefined
                      ? values[field.name]
                      : "" || ""
                  } // Set the default value to the first option
                  onChange={(e) => {
                    handleChange(e);
                    setHandleChnage(false)
                  }}
                  onBlur={formik.handleBlur}
                >
                  {field.name === "saleNo" ? <option value="">All</option> : ""}
                  {pageName !== "AWR" && field.name === "mark" ? <option value="">All</option> : ""}
                  {pageName !== "AWR" && field.name === "warehouse" ? (
                    <option value="">All</option>
                  ) : (
                    ""
                  )}
                  { pageName !== "AWR" && field.name === "grade" ? <option value="">All</option> : ""}
                  {field.name === "status" ? <option value="">All</option> : ""}

                  {field?.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : field.type === "datepicker" ? (
              <input
                type="date"
                className="form-control"
                name={field.name}
                id={field.name}
                value={
                  values[field.name] !== undefined
                    ? values[field.name]
                    : "" || ""
                }
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            ) : field.type === "disable" ? (
              <input
                type={"text"}
                className="form-control"
                name={field.name}
                id={field.name}
                value={
                  values[field.name] !== undefined
                    ? values[field.name]
                    : "" || ""
                }
                onChange={handleChange}
                disabled
              />
            ) : field.type === "disableDatePicker" ? (
              <input
                type={"date"}
                className="form-control"
                name={field.name}
                id={field.name}
                value={
                  values[field.name] !== undefined
                    ? values[field.name]
                    : "" || ""
                }
                onChange={handleChange}
                disabled
              />
            ) : field.type === "dateTimePicker" ? (
              <input
                type={"datetime-local"}
                className="form-control"
                name={field.name}
                id={field.name}
                value={
                  values[field.name] !== undefined
                    ? values[field.name]
                    : "" || ""
                }
                onChange={handleChange}
              />
            ) : field.type === "disableDateTimePicker" ? (
              <input
                type={"datetime-local"}
                className="form-control"
                name={field.name}
                id={field.name}
                value={
                  values[field.name] !== undefined
                    ? values[field.name]
                    : "" || ""
                }
                onChange={handleChange}
                disabled
              />
            ) : field.type === "disableSelect" ? (
              <div className="FormGroup">
                <select
                  className="select-form form-control"
                  name={field.name}
                  id={field.name}
                  value={
                    values[field.name] !== undefined
                      ? values[field.name]
                      : "" || ""
                  } // Set the default value to the first option
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  disabled
                >
                  {field.name === "saleNo" ? <option value="">All</option> : ""}
                  {field?.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <input
                type={field.type}
                className="form-control"
                name={field.name}
                id={field.name}
                value={
                  values[field.name] !== undefined
                    ? values[field.name]
                    : "" || ""
                }
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            )}
            {formikErrors[field.name] && (
              <span className="error text-danger">
                {formikErrors[field.name]}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* <Button variant="secondary" onClick={resetForm}>
        Reset Form
      </Button> */}
      <div className="col-12">
        <Controlls />
      </div>
    </>
  );
};

export default CommonForm;
