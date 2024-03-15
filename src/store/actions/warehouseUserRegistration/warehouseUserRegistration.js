// actions.js
import {
    FETCH_DOCUMENTS_REQUEST,
    FETCH_DOCUMENTS_SUCCESS,
    FETCH_DOCUMENTS_FAILURE,
    GET_USERS_REQUEST,
    GET_USERS_SUCCESS,
    GET_USERS_FAILURE,
    GET_DOCUMENT_DETAIL_REQUEST,
    GET_DOCUMENT_DETAIL_SUCCESS,
    GET_DOCUMENT_DETAIL_FAILURE,
    POST_WAREHOUSE_USER_REQUEST,
    POST_WAREHOUSE_USER_SUCCESS,
    POST_WAREHOUSE_USER_FAILURE,
    UPDATE_WAREHOUSE_USER_REQUEST,
    UPDATE_WAREHOUSE_USER_SUCCESS,
    UPDATE_WAREHOUSE_USER_FAILURE,
    FETCH_AUCTION_REQUEST,
    FETCH_AUCTION_SUCCESS,
    FETCH_AUCTION_FAILURE,
    FETCH_STATE_REQUEST,
    FETCH_STATE_SUCCESS,
    FETCH_STATE_FAILURE,
    SEARCH_USERS_REQUEST,
    SEARCH_USERS_SUCCESS,
    SEARCH_USERS_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    CREATE_WAREHOUSE_UNIT_REQUEST,
    CREATE_WAREHOUSE_UNIT_SUCCESS,
    CREATE_WAREHOUSE_UNIT_FAILURE,
    SEARCH_WAREHOUSE_UNITS_REQUEST,
    SEARCH_WAREHOUSE_UNITS_SUCCESS,
    SEARCH_WAREHOUSE_UNITS_FAILURE,
    SEARCH_UNIT_REQUEST,
    SEARCH_UNIT_SUCCESS,
    SEARCH_UNIT_FAILURE,
    UPDATE_WAREHOUSE_UNIT_REQUEST,
    UPDATE_WAREHOUSE_UNIT_SUCCESS,
    UPDATE_WAREHOUSE_UNIT_FAILURE,
    GET_UNIT_BY_ID_REQUEST,
    GET_UNIT_BY_ID_SUCCESS,
    GET_UNIT_BY_ID_FAILURE,
    GET_ALL_UNIT_DOCUMENT_REQUEST,
    GET_ALL_UNIT_DOCUMENT_SUCCESS,
    GET_ALL_UNIT_DOCUMENT_FAILURE,
    GET_WAREHOUSE_HISTORY_REQUEST,
    GET_WAREHOUSE_HISTORY_SUCCESS,
    GET_WAREHOUSE_HISTORY_FAILURE,
    GET_UNIT_HISTORY_REQUEST,
    GET_UNIT_HISTORY_SUCCESS,
    GET_UNIT_HISTORY_FAILURE,
    CREATE_EDIT_API_STATUS_WAREHOUSE,
  } from '../../actionLabels';
  
  export const fetchDocumentsRequest = () => ({
    type: FETCH_DOCUMENTS_REQUEST,
  });
  
  export const fetchDocumentsSuccess = (data) => ({
    type: FETCH_DOCUMENTS_SUCCESS,
    payload: data,
  });
  
  export const fetchDocumentsFailure = (error) => ({
    type: FETCH_DOCUMENTS_FAILURE,
    payload: error,
  });
  
 
  export const getUsersRequest = () => ({
    type: GET_USERS_REQUEST,
  });
  
  export const getUsersSuccess = (users) => ({
    type: GET_USERS_SUCCESS,
    payload: users,
  });
  
  export const getUsersFailure = (error) => ({
    type: GET_USERS_FAILURE,
    payload: error,
  });

  export const getDocumentDetailRequest = (documentId) => ({
    type: GET_DOCUMENT_DETAIL_REQUEST,
    payload: documentId,
  });
  
  export const getDocumentDetailSuccess = (data) => ({
    type: GET_DOCUMENT_DETAIL_SUCCESS,
    payload: data,
  });
  
  export const getDocumentDetailFailure = (error) => ({
    type: GET_DOCUMENT_DETAIL_FAILURE,
    payload: error,
  });
  
  export const postWarehouseUserRequest = (payload) => ({
    type: POST_WAREHOUSE_USER_REQUEST,
    payload:payload,
  });
  
  export const postWarehouseUserSuccess = (response) => ({
    type: POST_WAREHOUSE_USER_SUCCESS,
    payload:response,
  });

  export const postWarehouseUserFailure = (error) => ({
    type: POST_WAREHOUSE_USER_FAILURE,
    error,
  });

  export const updateWarehouseUserRequest = (data) => ({
    type: UPDATE_WAREHOUSE_USER_REQUEST,
    payload: data,
  });
  
  export const updateWarehouseUserSuccess = (response) => ({
    type: UPDATE_WAREHOUSE_USER_SUCCESS,
    payload: response,
  });
  
  export const updateWarehouseUserFailure = (error) => ({
    type: UPDATE_WAREHOUSE_USER_FAILURE,
    payload: error,
  });

  
  export const fetchAuctionRequest = () => ({
    type: FETCH_AUCTION_REQUEST,
  });
  
  export const fetchAuctionSuccess = (data) => ({
    type: FETCH_AUCTION_SUCCESS,
    payload: data,
  });
  
  export const fetchAuctionFailure = (error) => ({
    type: FETCH_AUCTION_FAILURE,
    payload: error,
  });

  export const fetchStateRequest = () => ({
    type: FETCH_STATE_REQUEST,
  });
  
  export const fetchStateSuccess = (data) => ({
    type: FETCH_STATE_SUCCESS,
    payload: data,
  });
  
  export const fetchStateFailure = (error) => ({
    type: FETCH_STATE_FAILURE,
    payload: error,
  });

  export const searchUsersRequest = (query) => ({
    type: SEARCH_USERS_REQUEST,
    payload: query,
  });
  
  export const searchUsersSuccess = (data) => ({
    type: SEARCH_USERS_SUCCESS,
    payload: data,
  });
  
  export const searchUsersFailure = (error) => ({
    type: SEARCH_USERS_FAILURE,
    payload: error,
  });

  export const getUserRequest = (userId) => ({
    type: GET_USER_REQUEST,
    payload:userId ,
  });
  
  export const getUserSuccess = (user) => ({
    type: GET_USER_SUCCESS,
    payload: { user },
  });
  
  export const getUserFailure = (error) => ({
    type: GET_USER_FAILURE,
    payload: { error },
  });


  export const createWarehouseUnitRequest = (payload) => ({
    type: CREATE_WAREHOUSE_UNIT_REQUEST,
    payload : payload,
  });
  
  export const createWarehouseUnitSuccess = (data) => ({
    type: CREATE_WAREHOUSE_UNIT_SUCCESS,
    payload:data,
  });
  
  export const createWarehouseUnitFailure = (error) => ({
    type: CREATE_WAREHOUSE_UNIT_FAILURE,
    error,
  });

  export const searchWarehouseUnitsRequest = (query) => ({
    type: SEARCH_WAREHOUSE_UNITS_REQUEST,
    payload: query,
  });
  
  export const searchWarehouseUnitsSuccess = (data) => ({
    type: SEARCH_WAREHOUSE_UNITS_SUCCESS,
    payload: data ,
  });
  
  export const searchWarehouseUnitsFailure = (error) => ({
    type: SEARCH_WAREHOUSE_UNITS_FAILURE,
    payload: { error },
  });

  export const searchUnitRequest = (params) => ({
    type: SEARCH_UNIT_REQUEST,
    params,
  });
  
  export const searchUnitSuccess = (data) => ({
    type: SEARCH_UNIT_SUCCESS,
    data,
  });
  
  export const searchUnitFailure = (error) => ({
    type: SEARCH_UNIT_FAILURE,
    error,
  });

  export const updateWarehouseUnitRequest = (data) => ({
    type: UPDATE_WAREHOUSE_UNIT_REQUEST,
    payload: data,
  });
  
  export const updateWarehouseUnitSuccess = (response) => ({
    type: UPDATE_WAREHOUSE_UNIT_SUCCESS,
    payload: response,
  });
  
  export const updateWarehouseUnitFailure = (error) => ({
    type: UPDATE_WAREHOUSE_UNIT_FAILURE,
    payload: error,
  });



  export const getUnitRequest = (unitId) => ({
    type: GET_UNIT_BY_ID_REQUEST,
    payload:unitId ,
  });
  
  export const getUnitSuccess = (user) => ({
    type: GET_UNIT_BY_ID_SUCCESS,
    payload: { user },
  });
  
  export const getUnitFailure = (error) => ({
    type: GET_UNIT_BY_ID_FAILURE,
    payload: { error },
  });

  export const fetchUnitDocumentsRequest = () => ({
    type: GET_ALL_UNIT_DOCUMENT_REQUEST,
  });
  
  export const fetchUnitDocumentsSuccess = (data) => ({
    type: GET_ALL_UNIT_DOCUMENT_SUCCESS,
    payload: data,
  });
  
  export const fetchUnitDocumentsFailure = (error) => ({
    type: GET_ALL_UNIT_DOCUMENT_FAILURE,
    payload: error,
  });

  export const getWarehouseHistoryRequest = (id) => ({
    type: GET_WAREHOUSE_HISTORY_REQUEST,
    payload:id,
  });
  
  export const getWarehouseHistorySuccess = (data) => ({
    type: GET_WAREHOUSE_HISTORY_SUCCESS,
    payload: data,
  });
  
  export const getWarehouseHistoryFailure = (error) => ({
    type: GET_WAREHOUSE_HISTORY_FAILURE,
    payload: error,
  });

  export const getWarehouseUnitHistoryRequest = (id) => ({
    type: GET_UNIT_HISTORY_REQUEST,
    payload:id,
  });
  
  export const getWarehouseUnitHistorySuccess = (data) => ({
    type: GET_UNIT_HISTORY_SUCCESS,
    payload: data,
  });
  
  export const getWarehouseUnitHistoryFailure = (error) => ({
    type: GET_UNIT_HISTORY_FAILURE,
    payload: error,
  });
  
  export const createEditApiStatusWarehouse = (data) => {
    return {
      type: CREATE_EDIT_API_STATUS_WAREHOUSE,
      payload: { data: data },
    };
  };