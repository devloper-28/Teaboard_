export default function formatDateToDdMmYy(inputDate) {
  if (!(inputDate instanceof Date)) {
    inputDate = new Date(inputDate); // Convert input to a Date object if it's not already
  }

  const day = inputDate.getDate().toString().padStart(2, "0");
  const month = (inputDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  //   const year = inputDate.getFullYear().toString().slice(-2); // Get the last two digits of the year
  const year = inputDate.getFullYear().toString();

  return year === "NaN" ? `-` : `${day}-${month}-${year}`;
}
