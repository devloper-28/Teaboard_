import * as actionTypes from "../../actionLabels/createGrace/createGrace";

export const getGrace = (payloadGraceData) => {
  return {
    type: actionTypes.GET_ALL_GRACE,
    payload: payloadGraceData,
  };
};

export const getGraceSuccess = (GraceData) => {
  return {
    type: actionTypes.GET_ALL_GRACE_SUCCESS,
    payload: GraceData,
  };
 
};

export const getGraceFail = (error) => {
  return {
    type: actionTypes.GET_ALL_GRACE_FAIL,
    payload: error,
  };
};

// Action creator for creating a Grace
export const createGraceAction = (newGraceData) => {
  return {
    type: actionTypes.CREATE_GRACE,
    payload: newGraceData,
  };
};

export const createGraceActionSuccess = (createdGrace) => {
  return {
    type: actionTypes.CREATE_GRACE_SUCCESS,
    payload: createdGrace,
  };
};

export const createGraceActionFail = (error) => ({
  type: actionTypes.CREATE_GRACE_FAIL,
  payload: error,
});

// Action creator for updating a Grace
export const updateGraceAction = (updatedGraceData) => {
  return {
    type: actionTypes.UPDATE_GRACE,
    payload: {
      updatedGraceData,
    },
  };
};

export const updateGraceActionSuccess = (updatedGrace) => {
  return {
    type: actionTypes.UPDATE_GRACE_SUCCESS,
    payload: updatedGrace,
  };
};

export const updateGraceActionFail = (error) => ({
  type: actionTypes.UPDATE_GRACE_FAIL,
  payload: error,
});


// Action creator for getting state by Grace ID
export const getGraceByIdAction = (GraceId) => {
  return {
    type: actionTypes.GET_GRACE_BY_ID,
    payload: GraceId,
  };
};

export const getGraceByIdActionSuccess = (GraceData) => {
  return {
    type: actionTypes.GET_GRACE_BY_ID_SUCCESS,
    payload: GraceData,
  };
};

export const getGraceByIdActionFail = (error) => ({
  type: actionTypes.GET_GRACE_BY_ID_FAIL,
  payload: error,
});

export const uploadAllDocumentsGraceAction = () => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_GRACE,
  };
};

export const uploadAllDocumentsGraceSuccess = (documents) => {
  return {
    type: actionTypes.UPLOAD_ALL_DOCUMENTS_GRACE_SUCCESS,
    payload: documents,
  };
};

export const uploadAllDocumentsGraceFail = (error) => (
  {
  type: actionTypes.UPLOAD_ALL_DOCUMENTS_GRACE_FAIL,
  payload: error,
}
);


export const getGraceWithoutFilter = (payloadGraceData) => {
  return {
    type: actionTypes.GET_ALL_GRACE_WITHOUT_FILTER,
    payload: payloadGraceData,
  };
};

export const getGraceSuccessWithoutFilter = (GraceData) => {
  return {
    type: actionTypes.GET_ALL_GRACE_WITHOUT_FILTER_SUCCESS,
    payload: GraceData,
  };
};

export const getGraceFailWithoutFilter = (error) => {
  return {
    type: actionTypes.GET_ALL_GRACE_WITHOUT_FILTER_FAIL,
    payload: error,
  };
};

export const getSaleNoPreauction = (payloadSaleNoPreauctionData) => {
  return {
    type: actionTypes.GET_ALL_SALENO_PREAUCTION,
    payload: payloadSaleNoPreauctionData,
  };
};

export const getSaleNoPreauctionSuccess = (SaleNoPreauctionData) => {
  return {
    type: actionTypes.GET_ALL_SALENO_PREAUCTION_SUCCESS,
    payload: SaleNoPreauctionData,
  };
 
};

export const getSaleNoPreauctionFail = (error) => {
  return {
    type: actionTypes.GET_ALL_SALENO_PREAUCTION_FAIL,
    payload: error,
  };
};

export const createEditApiStatusGrace = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_API_STATUS_GRACE,
    payload: { data: data },
}
}
