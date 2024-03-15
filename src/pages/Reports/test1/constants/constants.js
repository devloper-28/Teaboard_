export const optionsConfig = {
  equal: { label: "Equal", value: "equal", comparison: "=" },
  notEqual: { label: "Not Equal", value: "notEqual", comparison: "!=" },
  less: { label: "Less", value: "less", comparison: "<" },
  lessOrEqual: {
    label: "Less or Equal",
    value: "lessOrEqual",
    comparison: "<=",
  },
  greater: { label: "Greater", value: "greater", comparison: ">" },
  greaterOrEqual: {
    label: "Greater or Equal",
    value: "greaterOrEqual",
    comparison: ">=",
  },
  between: { label: "Between", value: "between", comparison: "between" },
};

export const apiUrl = "/postauction/Report/list";

export const orderValues = { desc: "desc", asc: "asc" };
export const initialSortValue = {
  fieldName: "",
  order: "",
};
