// Action Types
export const FETCH_RESERVATION_REQUEST = "FETCH_RESERVATION_REQUEST";
export const FETCH_RESERVATION_SUCCESS = "FETCH_RESERVATION_SUCCESS";
export const FETCH_RESERVATION_FAILURE = "FETCH_RESERVATION_FAILURE";

// Import API config
import { API_ENDPOINT, API_DATA } from "../Config/APIs";
import http from "../Utils/Http";

// Action Creators
export const fetchReservationRequest = () => ({
    type: FETCH_RESERVATION_REQUEST,
});

export const fetchReservationSuccess = reservation => ({
    type: FETCH_RESERVATION_SUCCESS,
    payload: reservation,
});

export const fetchReservationFailure = error => ({
    type: FETCH_RESERVATION_FAILURE,
    payload: error,
});

export const requestMomoPaymentBalance = (reservationId, amount) => async dispatch => {
    try {
      const response = await http.post('http://localhost:3307/api/public/payment/pay_balance', {
        reservationId,
        amount
        
      });
      return response.data; // Trả về dữ liệu để xử lý tiếp
    } catch (error) {
      console.error("Error in MoMo payment request:", error);
      throw error;
    }
};