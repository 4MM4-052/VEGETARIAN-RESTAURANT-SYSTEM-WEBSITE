
export const FETCH_STATISTICAL_REQUEST = 'FETCH_STATISTICAL_REQUEST';
export const FETCH_STATISTICAL_SUCCESS = 'FETCH_STATISTICAL_SUCCESS';
export const FETCH_STATISTICAL_FAILURE = 'FETCH_STATISTICAL_FAILURE';

import { API_ENDPOINT, API_DATA } from "../Config/APIs";
import http from "../Utils/Http";

export const fetchStatisticalRequest = () => ({
    type: FETCH_STATISTICAL_REQUEST
});

export const fetchStatisticalSuccess = results => ({
    type: FETCH_STATISTICAL_SUCCESS,
    payload: results
});

export const fetchStatisticalFailure = error => ({
    type: FETCH_STATISTICAL_FAILURE,
    payload: error
});

export const fetchStatistical = () => {
    return dispatch => {
        dispatch(fetchStatisticalRequest());
        http.get(`${API_ENDPOINT}${API_DATA.statistical}`)
            .then(response => {
                dispatch(fetchStatisticalSuccess(response.data)); // Lưu dữ liệu vào Redux
            })
            .catch(error => {
                dispatch(fetchStatisticalFailure(error.message)); // Nếu lỗi, lưu thông báo lỗi
            });
    };
};