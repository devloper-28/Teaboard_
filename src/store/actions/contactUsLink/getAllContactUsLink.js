import * as actionLabels from "../../actionLabels";

export const getAllContactLinkAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_CONTACT_LINK,
    payload: payload,
  };
};

export const getAllContactLinkActionSuccess = (getAllContactLink) => {
  return {
    type: actionLabels.GET_ALL_CONTACT_LINK_SUCCESS,
    payload: getAllContactLink,
  };
};

export const getAllContactLinkActionFail = (error) => ({
  type: actionLabels.GET_ALL_CONTACT_LINK_FAIL,
  payload: error,
});

export const getAllSupportLinkAction = (payload) => {
  return {
    type: actionLabels.GET_ALL_SUPPORT_LINK,
    payload: payload,
  };
};

export const getAllSupportLinkActionSuccess = (getAllSupportLink) => {
  return {
    type: actionLabels.GET_ALL_SUPPORT_LINK_SUCCESS,
    payload: getAllSupportLink,
  };
};

export const getAllSupportLinkActionFail = (error) => ({
  type: actionLabels.GET_ALL_SUPPORT_LINK_FAIL,
  payload: error,
});
