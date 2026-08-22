
export const FETCH_CUSTOMER_REQUEST = 'FETCH_CUSTOMER_REQUEST';
export const FETCH_CUSTOMER_SUCCESS = 'FETCH_CUSTOMER_SUCCESS';
export const FETCH_CUSTOMER_FAILURE = 'FETCH_CUSTOMER_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from '../Config/index';
import http from "../Utils/Http";

export const fetchCustomerRequest = () => ({
    type: FETCH_CUSTOMER_REQUEST
});

export const fetchCustomerSuccess = (results, totalCount, totalPages, currentPage) => ({
    type: FETCH_CUSTOMER_SUCCESS,
    payload: {
        results,
        totalCount,
        totalPages,
        currentPage
    }
});

export const fetchCustomerFailure = error => ({
    type: FETCH_CUSTOMER_FAILURE,
    payload: error
});

export const setCurrentPage = (page) => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

export const fetchCustomer = (fullname = '', page = 1, pageSize = 15) => {
    return dispatch => {
        dispatch(fetchCustomerRequest());

        const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.customer}`);

        // Thêm tham số tìm kiếm nếu có
        if (fullname) {
            url.searchParams.append('search', fullname);
        }
        // Thêm tham số phân trang
        url.searchParams.append('page', page);
        url.searchParams.append('pageSize', pageSize);

        http.get(url.toString())
            .then(response => {
                const { results, totalCount, totalPages, currentPage } = response.data;

                // Dispatch action để cập nhật dữ liệu
                dispatch(fetchCustomerSuccess(results, totalCount, totalPages, currentPage));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchCustomerFailure(errorMsg));
            });
    };
};






export const addCustomer = (customer) => {
    return dispatch => {
        dispatch(fetchCustomerRequest());
        http.post(`${API_ENDPOINT}/${AdminConfig.routes.customer}`, customer)
            .then((response) => {
                // Sau khi thêm khách hàng mới, gọi lại fetchCustomer để làm mới danh sách
                dispatch(fetchCustomerSuccess(response.data.data));
                dispatch(fetchCustomer());
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchCustomerFailure(errorMsg));
            });
    };
};


export const updateCustomer = (id, data) => {
    return (dispatch) => {
        dispatch(fetchCustomerRequest());
        http.patch(`${API_ENDPOINT}/${AdminConfig.routes.customer}/${id}`, data)
            .then((response) => {
                dispatch(fetchCustomerSuccess(response.data.data));
                dispatch(fetchCustomer()); // Reload danh sách khách hàng sau khi cập nhật
            })
            .catch((error) => {
                dispatch(fetchCustomerFailure(error.message));
            });
    };
};

export const deleteCustomer = (id) => {
    return async dispatch => {
        try {
            dispatch(fetchCustomerRequest());
            await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.customer}/${id}`);
            dispatch(fetchCustomer());
        } catch (error) {
            const errorMsg = error.message || 'Đã xảy ra lỗi trong quá trình xóa khách hàng';
            dispatch(fetchCustomerFailure(errorMsg));
        }
    };
};


export const checkEmailExists = async (email) => {
    try {
        const response = await http.get(`${API_ENDPOINT}/auth/check-email`, { params: { email } });
        return response.data.exists ? response.data.user : null;
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
};