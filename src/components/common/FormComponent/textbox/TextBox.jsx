import React from "react";
import "./textbox.css";
import { TextField } from "@mui/material";

const TextBox = ({
  type,
  placeholder,
  value,
  name,
  error,
  onChange,
  onBlur,
  inValid,
  label,
  fullWidth,
}) => {
  return (
    <>
      <TextField
        type={type}
        label={label}
        fullWidth={fullWidth}
        placeholder={placeholder}
        name={name}
        value={value || ""}
        error={error}
        onChange={onChange}
        onBlur={onBlur}
        invalid={inValid}
      />
      {/* {error && <p className="text-danger">{error}</p>} */}
    </>
  );
};

export default TextBox;
