import { FETCH_BUYER_GROUPS, FETCH_BUYER_GROUPS_ERROR, FETCH_BUYER_GROUPS_SUCCESS } from "../../actionLabels";
//Group Code
export function fetchBuyerGroups(buyerUserId) {
    return {
        type: FETCH_BUYER_GROUPS,
        payload: buyerUserId,
    };
}

export function fetchBuyerGroupsSuccess(data) {
    return {
        type: FETCH_BUYER_GROUPS_SUCCESS,
        payload: data,
    };
}

export function fetchBuyerGroupsError(error) {
    return {
        type: FETCH_BUYER_GROUPS_ERROR,
        payload: error,
    };
}