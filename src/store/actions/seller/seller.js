import { CREATE_FACTORY_OWNER_FAILURE, CREATE_FACTORY_OWNER_REQUEST, CREATE_FACTORY_OWNER_SUCCESS, CREATE_SELLER_FAILURE, CREATE_SELLER_REQUEST, CREATE_SELLER_SUCCESS, FETCH_FACTORY_BY_ID_FAILURE, FETCH_FACTORY_BY_ID_REQUEST, FETCH_FACTORY_BY_ID_SUCCESS, FETCH_FACTORY_FAILURE, FETCH_FACTORY_OWNER_FAILURE, FETCH_FACTORY_OWNER_REQUEST, FETCH_FACTORY_OWNER_SUCCESS, FETCH_FACTORY_REQUEST, FETCH_FACTORY_SUCCESS, GET_ALL_FACTORY_TYPE_FAILURE, GET_ALL_FACTORY_TYPE_REQUEST, GET_ALL_FACTORY_TYPE_SUCCESS, GET_ALL_REVENUES_FAILURE, GET_ALL_REVENUES_REQUEST, GET_ALL_REVENUES_SUCCESS, GET_ALL_REVENUE_FAILURE, GET_ALL_REVENUE_REQUEST, GET_ALL_REVENUE_SUCCESS, GET_ALL_SELLER_STATE_FAILURE,  GET_FACTORY_DOCUMENT_FAILURE, GET_FACTORY_DOCUMENT_REQUEST, GET_FACTORY_DOCUMENT_SUCCESS, GET_FACTORY_OWNER_LIST_FAILURE, GET_FACTORY_OWNER_LIST_REQUEST, GET_FACTORY_OWNER_LIST_SUCCESS, GET_SELLER_DOCUMENT_FAILURE, GET_SELLER_DOCUMENT_REQUEST, GET_SELLER_DOCUMENT_SUCCESS, UPDATE_FACTORY_FAILURE, UPDATE_FACTORY_OWNER_FAILURE, UPDATE_FACTORY_OWNER_REQUEST, UPDATE_FACTORY_OWNER_SUCCESS, UPDATE_FACTORY_REQUEST, UPDATE_FACTORY_SUCCESS,CREATE_EDIT_API_STATUS_SELLER } from "../../actionLabels";

export const fetchSellerDocumentsRequest = () => ({
    type: GET_SELLER_DOCUMENT_REQUEST,
  });
  
  export const fetchSellerDocumentsSuccess = (data) => ({
    type: GET_SELLER_DOCUMENT_SUCCESS,
    payload: data,
  });
  
  export const fetchSellerDocumentsFailure = (error) => ({
    type: GET_SELLER_DOCUMENT_FAILURE,
    payload: error,
  });
 
  export const createSellerRequest = (sellerData) => ({
    type: CREATE_SELLER_REQUEST,
    payload: sellerData,
  });
  
  export const createSellerSuccess = (seller) => ({
    type: CREATE_SELLER_SUCCESS,
    payload: seller,
  });
  
  export const createSellerFailure = (error) => ({
    type: CREATE_SELLER_FAILURE,
    payload: error,
  });


  export const createFactoryOwnerRequest = (payload) => ({
    type: CREATE_FACTORY_OWNER_REQUEST,
    payload,
  });
  
  export const createFactoryOwnerSuccess = (data) => ({
    type: CREATE_FACTORY_OWNER_SUCCESS,
    data,
  });
  
  export const createFactoryOwnerFailure = (error) => ({
    type: CREATE_FACTORY_OWNER_FAILURE,
    error,
  });


  export const getFactoryOwnerListRequest = (data) => ({
    type: GET_FACTORY_OWNER_LIST_REQUEST,
    payload:data,
  });
  
  export const getFactoryOwnerListSuccess = (data) => ({
    type: GET_FACTORY_OWNER_LIST_SUCCESS,
    payload: data,
  });
  
  export const getFactoryOwnerListFailure = (error) => ({
    type: GET_FACTORY_OWNER_LIST_FAILURE,
    payload: error,
  });


  export const updateFactoryOwnerRequest = (newOwnerData) => ({
    type: UPDATE_FACTORY_OWNER_REQUEST,
    payload: newOwnerData,
  });
  
  export const updateFactoryOwnerSuccess = (data) => ({
    type: UPDATE_FACTORY_OWNER_SUCCESS,
    payload:data,
  });
  
  export const updateFactoryOwnerFailure = (error) => ({
    type: UPDATE_FACTORY_OWNER_FAILURE,
    payload: error,
  });

  export const fetchFactoryOwnerRequest = (id) => ({
    type: FETCH_FACTORY_OWNER_REQUEST,
    payload: id,
  });

  export const fetchFactorySuccess = (data) => ({
    type: FETCH_FACTORY_OWNER_SUCCESS,
    payload: data,
  });

  export const fetchFactoryFailure = (error) => ({
    type: FETCH_FACTORY_OWNER_FAILURE,
    payload: error,
  });


  export const fetchFactoryListRequest = (searchFactory) => ({
    type: FETCH_FACTORY_REQUEST,
    payload:searchFactory,
  });
  
  export const fetchFactoryListSuccess = (data) => ({
    type: FETCH_FACTORY_SUCCESS,
    payload: data,
  });
  
  export const fetchFactoryListFailure = (error) => ({
    type: FETCH_FACTORY_FAILURE,
    payload: error,
  });


  
  export const GetFactoryRequest = (id) => ({
    type: FETCH_FACTORY_BY_ID_REQUEST,
    payload: id,
  });

  export const GetFactorySuccess = (data) => ({
    type: FETCH_FACTORY_BY_ID_SUCCESS,
    payload: data,
  });

  export const GetFactoryFailure = (error) => ({
    type: FETCH_FACTORY_BY_ID_FAILURE,
    payload: error,
  });


  export const updateFactoryRequest = (newFactoryData) => ({
    type: UPDATE_FACTORY_REQUEST,
    payload: newFactoryData,
  });
  
  export const updateFactorySuccess = (data) => ({
    type: UPDATE_FACTORY_SUCCESS,
    payload:data,
  });
  
  export const updateFactoryFailure = (error) => ({
    type: UPDATE_FACTORY_FAILURE,
    payload: error,
  });



  export const fetchFactoryDocumentsRequest = () => ({
    type: GET_FACTORY_DOCUMENT_REQUEST,
  });
  
  export const fetchFactoryDocumentsSuccess = (data) => ({
    type: GET_FACTORY_DOCUMENT_SUCCESS,
    payload: data,
  });
  
  export const fetchFactoryDocumentsFailure = (error) => ({
    type: GET_FACTORY_DOCUMENT_FAILURE,
    payload: error,
  });

  export const getAllRevenueRequest = (data) => ({
    type: GET_ALL_REVENUES_REQUEST,
    payload:data,
  });
  
  export const getAllRevenueSuccess = (revenueData) => ({
    type: GET_ALL_REVENUES_SUCCESS,
    payload: revenueData,
  });
  
  export const getAllRevenueFailure = (error) => ({
    type: GET_ALL_REVENUES_FAILURE,
    payload: error,
  });


  export const getFactoryTypeRequest = (data) => ({
    type: GET_ALL_FACTORY_TYPE_REQUEST,
    payload:data
  });
  
  export const getFactoryTypeSuccess = (stateData) => ({
    type: GET_ALL_FACTORY_TYPE_SUCCESS,
    payload: stateData,
  });
  
  export const getFactoryTypeFailure = (error) => ({
    type: GET_ALL_FACTORY_TYPE_FAILURE,
    payload: error,
  });

export const createEditApiStatusSeller = (data) => {
  return {
    type: CREATE_EDIT_API_STATUS_SELLER,
    payload: { data: data },
  };
};
