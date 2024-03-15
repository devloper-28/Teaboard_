import * as actionLabels from "../../actionLabels";

export const toggleAction = () => {
  return {
    type: actionLabels.TOGGLE_SAGA
  };
};

export const toggleActionSuccess = () => {
  return {
    type: actionLabels.TOGGLE_SUCCESS
  };
};

export const toggleActionFail = () => ({
  type: actionLabels.TOGGLE_FAIL
});
