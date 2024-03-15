import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";

export default function CheckboxComponent({ value, setData }) {
  const [checked, setChecked] = React.useState(value);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setData(event.target.checked);
  };


  return (
    <FormControlLabel
      label={"Check"}
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      }
    />
  );
}
