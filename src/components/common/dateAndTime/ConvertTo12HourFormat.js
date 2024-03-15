import React from "react";
function ConvertTo12HourFormat(time) {
  const [hours, minutes] = time.split(":");
  let period = "AM";
  let formattedHours = parseInt(hours, 10);

  if (formattedHours >= 12) {
    period = "PM";
    if (formattedHours > 12) {
      formattedHours -= 12;
    }
  }

  if (formattedHours === 0) {
    formattedHours = 12;
  }

  return `${formattedHours}:${minutes} ${period}`;
}

export default ConvertTo12HourFormat;
