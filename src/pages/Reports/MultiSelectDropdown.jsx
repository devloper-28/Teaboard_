import React, { useState } from "react";
import Select from "react-select";

function MultiSelectDropdown({
  optionsList,
  selectedOptions,
  setSelectedOptions,
}) {
  // console.log(
  //   optionsList.tblReportControlDetail?.map((ele) => {
  //     return { value: ele.controlValue, label: ele.condition };
  //   })
  // );
  const options = optionsList?.map((ele) => {
    return { value: ele.condition, label: ele.controlValue };
  });

  const handleSelectChange = (selectedValues) => {
    setSelectedOptions(selectedValues);
  };
  console.log(optionsList, "optionsList");
  return (
    <div>
      {/* <h6>Select Multiple Options:</h6> */}
      <Select
        options={options}
        closeMenuOnSelect={false}
        isMulti
        value={selectedOptions}
        onChange={handleSelectChange}
      />
    </div>
  );
}

export default MultiSelectDropdown;
