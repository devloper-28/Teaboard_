import * as actionTypes from "../../actionLabels/createMark/createMark";

export const getMark = (payloadMarkData) => {
  return {
    type: actionTypes.GET_ALL_MARK,
    payload: payloadMarkData,
  };
};

export const getMarkSuccess = (MarkData) => {
  return {
    type: actionTypes.GET_ALL_MARK_SUCCESS,
    payload: MarkData,
  };
 
};

export const getMarkFail = (error) => {
  return {
    type: actionTypes.GET_ALL_MARK_FAIL,
    payload: error,
  };
};

export const getFactory = () => {
  return {
    type: actionTypes.GET_ALL_FACTORY,
  };
};

export const getFactorySuccess = (FactoryData) => {
  return {
    type: actionTypes.GET_ALL_FACTORY_SUCCESS,
    payload: FactoryData,
  };
 
};

export const getFactoryFail = (error) => {
  return {
    type: actionTypes.GET_ALL_FACTORY_FAIL,
    payload: error,
  };
};


// Action creator for creating a Mark
export const createMarkAction = (newMarkData) => {
  return {
    type: actionTypes.CREATE_MARK,
    payload: newMarkData,
  };
};

export const createMarkActionSuccess = (createdMark) => {
  return {
    type: actionTypes.CREATE_MARK_SUCCESS,
    payload: createdMark,
  };
};

export const createMarkActionFail = (error) => ({
  type: actionTypes.CREATE_MARK_FAIL,
  payload: error,
});

// Action creator for updating a Mark
export const updateMarkAction = (updatedMarkData) => {
  return {
    type: actionTypes.UPDATE_MARK,
    payload: {
      updatedMarkData,
    },
  };
};

export const updateMarkActionSuccess = (updatedMark) => {
  return {
    type: actionTypes.UPDATE_MARK_SUCCESS,
    payload: updatedMark,
  };
};

export const updateMarkActionFail = (error) => ({
  type: actionTypes.UPDATE_MARK_FAIL,
  payload: error,
});


// Action creator for getting state by Mark ID
export const getMarkByIdAction = (MarkId) => {
  return {
    type: actionTypes.GET_MARK_BY_ID,
    payload: MarkId,
  };
};

export const getMarkByIdActionSuccess = (MarkData) => {
  return {
    type: actionTypes.GET_MARK_BY_ID_SUCCESS,
    payload: MarkData,
  };
};

export const getMarkByIdActionFail = (error) => ({
  type: actionTypes.GET_MARK_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsMarkAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_MARK,
  };
};

export const uploadAllDocumentsMarkSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_MARK_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsMarkFail = (error) => (
  {
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_MARK_FAIL,
  payload: error,
}
);


export const getMarkWithoutFilter = (payloadMarkData) => {
  return {
    type: actionTypes.GET_ALL_MARK_WITHOUT_FILTER,
    payload: payloadMarkData,
  };
};

export const getMarkSuccessWithoutFilter = (MarkData) => {
  return {
    type: actionTypes.GET_ALL_MARK_WITHOUT_FILTER_SUCCESS,
    payload: MarkData,
  };
};

export const getMarkFailWithoutFilter = (error) => {
  return {
    type: actionTypes.GET_ALL_MARK_WITHOUT_FILTER_FAIL,
    payload: error,
  };
};

export const createEditApiStatusMark = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_API_STATUS_MARK,
    payload: { data: data },
}
}
