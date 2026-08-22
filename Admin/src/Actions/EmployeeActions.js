

export const FETCH_EMPLOYEE_REQUEST = 'FETCH_EMPLOYEE_REQUEST';
export const FETCH_EMPLOYEE_SUCCESS = 'FETCH_EMPLOYEE_SUCCESS';
export const FETCH_EMPLOYEE_FAILURE = 'FETCH_EMPLOYEE_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from '../Config/index';
import http from "../Utils/Http";
import { fetchRole } from "./RoleActions";

export const fetchEmployeeRequest = () => ({
    type: FETCH_EMPLOYEE_REQUEST
});

export const fetchEmployeeSuccess = (results, totalCount, totalPages, currentPage) => ({
    type: FETCH_EMPLOYEE_SUCCESS,
    payload: {
        results,
        totalCount,
        totalPages,
        currentPage
    }
});

export const fetchEmployeeFailure = error => ({
    type: FETCH_EMPLOYEE_FAILURE,
    payload: error
});

export const setCurrentPage = (page) => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

export const fetchEmployees = (fullname = '', page = 1, pageSize = 15) => {
    return dispatch => {
        dispatch(fetchEmployeeRequest());

        const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.employee}`);

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
                dispatch(fetchEmployeeSuccess(results, totalCount, totalPages, currentPage));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchEmployeeFailure(errorMsg));
            });
    };
};

export const addEmployee = (employee) => {
    return dispatch => {
        dispatch(fetchEmployeeRequest());
        http.post(`${API_ENDPOINT}/${AdminConfig.routes.employee}`, employee)
            .then(response => {
                dispatch(fetchEmployeeSuccess(response.data.data));
                dispatch(fetchEmployees()); 
                dispatch(fetchRole()); 
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchEmployeeFailure(errorMsg));
            });
    };
};

export const updateEmployee = (id, data) => {
    return dispatch => {
        dispatch(fetchEmployeeRequest());
        http.patch(`${API_ENDPOINT}/${AdminConfig.routes.employee}/${id}`, data)
            .then(response => {
                dispatch(fetchEmployeeSuccess(response.data)); // Điều chỉnh dựa trên cấu trúc trả về từ server
                dispatch(fetchEmployees()); // Cập nhật danh sách nhân viên sau khi cập nhật
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchEmployeeFailure(errorMsg));
            });
    };
};

export const deleteEmployee = (id) => {
    return dispatch => {
        dispatch(fetchEmployeeRequest());
        http.delete(`${API_ENDPOINT}/${AdminConfig.routes.employee}/${id}`)
            .then(() => {
                dispatch(fetchEmployees()); // Cập nhật danh sách nhân viên sau khi xóa
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchEmployeeFailure(errorMsg));
            });
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