
export const FETCH_RESERVATIONDETAIL_REQUEST = 'FETCH_RESERVATIONDETAIL_REQUEST';
export const FETCH_RESERVATIONDETAIL_SUCCESS = 'FETCH_RESERVATIONDETAIL_SUCCESS';
export const FETCH_RESERVATIONDETAIL_FAILURE = 'FETCH_RESERVATIONDETAIL_FAILURE';

import { API_ENDPOINT, API_DATA } from "../Config/APIs";
import http from "../Utils/Http";

export const fetchReservationdetailRequest = () => ({
    type: FETCH_RESERVATIONDETAIL_REQUEST
});

export const fetchReservationdetailSuccess = results => ({
    type: FETCH_RESERVATIONDETAIL_SUCCESS,
    payload: results
});

export const fetchReservationdetailFailure = error => ({
    type: FETCH_RESERVATIONDETAIL_FAILURE,
    payload: error
});

export const fetchReservationdetail = (id) => {
    return dispatch => {
        dispatch(fetchReservationdetailRequest());
        http.get(`${API_ENDPOINT}/${API_DATA.reservations_admin}/reservation_details/${id}`)
            .then(response => {
                dispatch(fetchReservationdetailSuccess(response.data.results));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchReservationdetailFailure(errorMsg));
            });
    };
};

export const fetchReservationdetail2 = (id, page = 1, pageSize = 10) => {
    return (dispatch) => {
        dispatch(fetchReservationdetailRequest());
        http.get(
            `${API_ENDPOINT}/${API_DATA.reservations_admin}/reservation_details/${id}?page=${page}&pageSize=${pageSize}`
        )
            .then((response) => {
                const { results, totalItems, totalPages } = response.data;
                dispatch(
                    fetchReservationdetailSuccess({
                        data: results,
                        totalItems,
                        totalPages,
                        currentPage: page,
                    })
                );
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchReservationdetailFailure(errorMsg));
            });
    };
};
