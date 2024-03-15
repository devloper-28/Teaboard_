import * as actionLabels from '../../actionLabels';

export const dummyAction = () => {
  return {
    type: actionLabels.DUMMY_ACTION_SAGA,
  };
};
export const dummyActionSuccess = () => {
  return {
    type: actionLabels.DUMMY_ACTION_SUCCESS,
  };
};

export const setAuthentication = payload => ({
  type:actionLabels.SET_AUTHENTICATION,
  payload
})

export const logout = () => ({
  type:actionLabels.LOGOUT,
})