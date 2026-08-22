import axios from "axios";

export const FETCH_QUYEN_HAN_REQUEST = 'FETCH_QUYEN_HAN_REQUEST';
export const FETCH_QUYEN_HAN_SUCCESS = 'FETCH_QUYEN_HAN_SUCCESS';
export const FETCH_QUYEN_HAN_FAILURE = 'FETCH_QUYEN_HAN_FAILURE';

import { API_ENDPOINT } from "../Config/APIs";

export const fetchQuyenHanRequest = () => ({
    type: FETCH_QUYEN_HAN_REQUEST
});

export const fetchQuyenHanSuccess = auth => ({
    type: FETCH_QUYEN_HAN_SUCCESS,
    payload: auth
});

export const fetchQuyenHanFailure = error => ({
    type: FETCH_QUYEN_HAN_FAILURE,
    payload: error
});

// Hàm lấy quyền hạn
export const getPermissions = (id) => {
    return async dispatch => {
        dispatch(fetchQuyenHanRequest());
        try {
            const response = await axios.post(`${API_ENDPOINT}/auth_admin/role_permissions`, { id });
            if (response.status === 200) {
                const data = response.data;
                // console.log(data);
                dispatch(fetchQuyenHanSuccess(data));
            } else {
                dispatch(fetchQuyenHanFailure('Unexpected response status: ' + response.status));
            }
        } catch (error) {
            dispatch(fetchQuyenHanFailure(error.response ? error.response.data.message : error.message));
        }
    };
};