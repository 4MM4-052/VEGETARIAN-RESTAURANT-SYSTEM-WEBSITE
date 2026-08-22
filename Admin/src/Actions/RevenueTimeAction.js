export const FETCH_REVENUE_REQUEST = 'FETCH_REVENUE_REQUEST';
export const FETCH_REVENUE_SUCCESS = 'FETCH_REVENUE_SUCCESS';
export const FETCH_REVENUE_FAILURE = 'FETCH_REVENUE_FAILURE';

import { API_ENDPOINT, API_DATA } from "../Config/APIs";
import http from "../Utils/Http";

export const fetchRevenueRequest = () => ({
    type: FETCH_REVENUE_REQUEST
});

export const fetchRevenueSuccess = results => ({
    type: FETCH_REVENUE_SUCCESS,
    payload: results
});

export const fetchRevenueFailure = error => ({
    type: FETCH_REVENUE_FAILURE,
    payload: error
});

export const fetchRevenue = (startDate, endDate) => {
    return dispatch => {
        dispatch(fetchRevenueRequest());
        http.get(`${API_ENDPOINT}${API_DATA.statistical}/revenue`, {
            params: { startDate, endDate } // Gửi tham số qua query
        })
            .then(response => {
                dispatch(fetchRevenueSuccess(response.data)); // Lưu dữ liệu vào Redux
            })
            .catch(error => {
                dispatch(fetchRevenueFailure(error.message)); // Lưu lỗi nếu xảy ra
            });
    };
};