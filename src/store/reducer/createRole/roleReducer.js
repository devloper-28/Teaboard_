import * as actionTypes from "../../actionLabels/index";

const initialState = {
  allRoles: [],
  allRolesAsc: [],
  searchedRoles: [],
  roleById: [],
  error: null,
  uploadedDocuments: [],
  createEditRoleApiStatus: false,
  userDetails: [],
  selectedUserId: null,
  roleList: [],
  selectedRoleId: null,
  rightsData: null,
  loading: false,
  success: null,
  response: null,
  createEditRightsApiStatus: false,
  getRoleApiStatus: false,
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_ROLES_SUCCESS:
      return {
        ...state,
        allRoles: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_ROLES_FAIL:
      return {
        ...state,
        allRoles: [],
        error: action.payload,
      };

    case actionTypes.GET_ALL_ROLES_SUCCESS_ASC:
      return {
        ...state,
        allRolesAsc: action.payload,
        error: null,
      };

    case actionTypes.GET_ALL_ROLES_FAIL_ASC:
      return {
        ...state,
        allRolesAsc: [],
        error: action.payload,
      };

    case actionTypes.CREATE_ROLE_SUCCESS:
      return {
        ...state,
        error: null,
      };

    case actionTypes.CREATE_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.UPDATE_ROLE_SUCCESS:
      return {
        ...state,
        error: null,
      };

    case actionTypes.UPDATE_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.SEARCH_ROLE_SUCCESS:
      return {
        ...state,
        searchedRoles: action.payload,
        error: null,
      };

    case actionTypes.SEARCH_ROLE_FAIL:
      return {
        ...state,
        searchedRoles: [],
        error: action.payload,
      };

    case actionTypes.GET_ROLE_BY_ID_SUCCESS:
      return {
        ...state,
        roleById: action.payload,
        error: null,
      };

    case actionTypes.GET_ROLE_BY_ID_FAIL:
      return {
        ...state,
        roleById: [],
        error: action.payload,
      };
    case actionTypes.UPLOAD_ALL_DOCUMENTS_ROLE_SUCCESS:
      return {
        ...state,
        uploadedDocuments: action.payload, // Add the uploaded document to the state
        error: null,
      };

    case actionTypes.UPLOAD_ALL_DOCUMENTS_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.CREATE_EDIT_ROLE_API_STATUS:
      return {
        ...state,
        createEditRoleApiStatus: action.payload.data,
      };
    // Manage Roles
    case actionTypes.FETCH_USER_DETAILS_SUCCESS:
      return {
        ...state,
        userDetails: action.payload,
        error: null,
      };
    case actionTypes.FETCH_USER_DETAILS_FAILURE:
      return {
        ...state,
        userDetails: [],
        error: action.payload,
      };
    case actionTypes.SET_SELECTED_USER_ID:
      return {
        ...state,
        selectedUserId: action.payload,
      };
    case actionTypes.FETCH_ROLE_LIST_SUCCESS:
      return {
        ...state,
        roleList: action.payload,
        error: null,
      };
    case actionTypes.FETCH_ROLE_LIST_FAILURE:
      return {
        ...state,
        roleList: [],
        error: action.payload,
      };
    case actionTypes.SET_SELECTED_ROLE_ID:
      return {
        ...state,
        selectedRoleId: action.payload,
      };
    case actionTypes.FETCH_RIGHTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.FETCH_RIGHTS_SUCCESS:
      return {
        ...state,
        loading: false,
        rightsData: action.payload,
      };
    case actionTypes.FETCH_RIGHTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case actionTypes.SAVE_RIGHTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };

    case actionTypes.SAVE_RIGHTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
        response: action.payload,
      };

    case actionTypes.SAVE_RIGHTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case actionTypes.CREATE_EDIT_RIGHTS_API_STATUS:
      return {
        ...state,
        createEditRightsApiStatus: action.payload.data,
      };
    case actionTypes.GET_ROLE_API_STATUS:
      return {
        ...state,
        getRoleApiStatus: action.payload.data,
      };
    default:
      return state;
  }
};

export default roleReducer;
