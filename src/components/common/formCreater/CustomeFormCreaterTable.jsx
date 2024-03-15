import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

const CustomeFormCreaterTable = ({
  numRows,
  fields,
  Controlls,
  formik,
  setHandleChnage,
}) => {
  const { values, handleChange, errors: formikErrors } = formik;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, numRows);
  const itemsOnPage = Array?.from(
    { length: numRows },
    (_, index) => index + startIndex
  );
  return (
    <>
      <div className="row">
        <div className="TableBox">
          <table className="table table-risponsive">
            <thead>
              <tr>
                <th>marketTypeId</th>
                <th>categoryId</th>
                <th>teaTypeId</th>
                <th>sessionTypeId</th>
                <th>saleDate</th>
                <th>stardivate</th>
                <th>enddate</th>
                <th>minimumBidTime</th>
                <th>noOfLots</th>
                <th>status</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {itemsOnPage?.slice(startIndex, endIndex)?.map((item, index) => (
                <tr key={index}>
                  {fields.map((field, index) => (
                    <td key={index}>
                      {field.type === "select" ? (
                        <div className="FormGroup">
                          <label htmlFor={field.name}>{field.label}</label>
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
                              setHandleChnage(true);
                            }}
                            onBlur={formik.handleBlur}
                          >
                            {field?.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : field.type === "datepicker" ? (
                        <div className="FormGroup">
                          <label htmlFor={field.name}>{field.label}</label>
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
                              setHandleChnage(true);
                            }}
                          />
                        </div>
                      ) : field.type === "disable" ? (
                        <div className="FormGroup">
                          <label htmlFor={field.name}>{field.label}</label>

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
                        </div>
                      ) : field.type === "disableDatePicker" ? (
                        <div className="FormGroup">
                          <label htmlFor={field.name}>{field.label}</label>

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
                        </div>
                      ) : field.type === "disableSelect" ? (
                        <div className="FormGroup">
                          <label htmlFor={field.name}>{field.label}</label>
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
                                setHandleChnage(true);
                              }}
                              onBlur={formik.handleBlur}
                            >
                              {field?.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="FormGroup">
                          <label htmlFor={field.name}>{field.label}</label>

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
                              setHandleChnage(true);
                            }}
                          />
                        </div>
                      )}
                      {formikErrors[field.name] && (
                        <span className="error text-danger">
                          {formikErrors[field.name]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <div className="row">
        {fields.map((field, index) => (
          <div className="col-md-4" key={index}>
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
                      setHandleChnage(true);
                    }}
                    onBlur={formik.handleBlur}
                  >
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
                    setHandleChnage(true);
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
                      setHandleChnage(true);
                    }}
                    onBlur={formik.handleBlur}
                  >
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
                    setHandleChnage(true);
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
      </div> */}

      <Controlls />
    </>
  );
};

export default CustomeFormCreaterTable;
