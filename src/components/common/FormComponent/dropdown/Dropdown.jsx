import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "./dropdown.css";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const top100Films = [
  { category: "Sports", subcategory: "Football" },
  { category: "Sports", subcategory: "Basketball" },
  { category: "Sports", subcategory: "Tennis" },
  { category: "Sports", subcategory: "Cricket" },
  { category: "Sports", subcategory: "Golf" },
  { category: "City", subcategory: "New York" },
  { category: "City", subcategory: "London" },
  { category: "City", subcategory: "Paris" },
  { category: "City", subcategory: "Tokyo" },
  { category: "City", subcategory: "Sydney" },
];

const DropdownBox = ({ data, setdata, error, onChange, inValids }) => {
  const handleDropdownChange = (event, values) => {
    setdata({ ...data, dropdown: values });
    onChange(values)
  };

  return (
    <div className="dropdown">
      <Autocomplete
        multiple
        className="mui-input"
        id="checkboxes-tags-demo"
        options={top100Films}
        disableCloseOnSelect
        value={data.dropdown}
        onChange={handleDropdownChange}
        getOptionLabel={(option) => option.subcategory}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.subcategory}
          </li>
        )}
        renderGroup={(params) => (
          <div key={params.key}>
            <h6 className="font-weight-bold pl-3 mb-1">{params.group}</h6>
            {params.children}
          </div>
        )}
        groupBy={(option) => option.category}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Checkboxes"
            placeholder="Favorites"
            invalid={inValids}
          />
        )}
      />
    </div>
  );
};

export default DropdownBox;
