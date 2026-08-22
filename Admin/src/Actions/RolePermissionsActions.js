
export const FETCH_ROLEPERMISSIONS_REQUEST = 'FETCH_ROLEPERMISSIONS_REQUEST';
export const FETCH_ROLEPERMISSIONS_SUCCESS = 'FETCH_ROLEPERMISSIONS_SUCCESS';
export const FETCH_ROLEPERMISSIONS_FAILURE = 'FETCH_ROLEPERMISSIONS_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from '../Config/index';
import http from "../Utils/Http";

// Action Creators
export const fetchRolePermissionsRequest = () => ({
    type: FETCH_ROLEPERMISSIONS_REQUEST
});

export const fetchRolePermissionsSuccess = (results, totalCount, totalPages, currentPage) => ({
    type: FETCH_ROLEPERMISSIONS_SUCCESS,
    payload: {
        results,
        totalCount,
        totalPages,
        currentPage
    }
});

export const fetchRolePermissionsFailure = error => ({
    type: FETCH_ROLEPERMISSIONS_FAILURE,
    payload: error
});

export const setCurrentPage = (page) => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

// Fetch RolePermissions Action
export const fetchRolePermissions = (roleId) => {
    return dispatch => {
        dispatch(fetchRolePermissionsRequest());

        const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.rolesPermissions}`);
        url.searchParams.append('role_id', roleId);

        http.get(url.toString())
            .then(response => {
                const { results } = response.data; // Lấy dữ liệu từ kết quả API
                dispatch(fetchRolePermissionsSuccess(results));
            })
            .catch(error => {
                const errorMsg = error.response?.data?.error || error.message;
                dispatch(fetchRolePermissionsFailure(errorMsg));
            });
    };
};



// Add RolePermissions Action

export const addRolePermissions = (rolesPermissions) => {
    return async dispatch => {
        dispatch(fetchRolePermissionsRequest());
        try {
            // Gửi request POST tới API với dữ liệu `rolesPermissions`
            await http.post(`${API_ENDPOINT}/${AdminConfig.routes.rolesPermissions}`, rolesPermissions);
            
            // Thành công, trả về Promise.resolve() để chỉ ra thành công
            return Promise.resolve(); 
        } catch (error) {
            // Xử lý lỗi nếu có
            if (error.response) {
                // Kiểm tra mã lỗi HTTP để xử lý các tình huống cụ thể
                if (error.response.status === 409) {
                    // Nếu lỗi là lỗi trùng lặp, ném lỗi có thông báo cụ thể
                    throw new Error("Đã xảy ra lỗi: Dữ liệu bị trùng lặp."); 
                } else if (error.response.status === 400) {
                    // Nếu lỗi là lỗi yêu cầu không hợp lệ
                    throw new Error(`Yêu cầu không hợp lệ: ${error.response.data.message || 'Vui lòng kiểm tra dữ liệu và thử lại.'}`); 
                } else if (error.response.status === 404) {
                    // Nếu không tìm thấy tài nguyên
                    throw new Error("Tài nguyên không tìm thấy: Vui lòng kiểm tra lại đường dẫn."); 
                } else if (error.response.status === 500) {
                    // Nếu có lỗi trên server
                    throw new Error("Lỗi máy chủ: Đã xảy ra lỗi trong quá trình xử lý yêu cầu."); 
                } else {
                    // Nếu lỗi khác, ném lỗi với thông báo chi tiết
                    throw new Error(`Đã xảy ra lỗi: ${error.response.data.message || error.message}`); 
                }
            } else {
                // Nếu không có phản hồi từ server, ném lỗi chung
                throw new Error("Đã xảy ra lỗi không xác định.");
            }
        }
    };
};


// Update RolePermissions Action
export const updateRolePermissions = (id, data) => {
    return dispatch => {
        dispatch(fetchRolePermissionsRequest());
        http.patch(`${API_ENDPOINT}/${AdminConfig.routes.RolePermissions}/${id}`, data)
            .then(() => {
                dispatch(fetchRolePermissions());
            })
            .catch(error => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchRolePermissionsFailure(errorMsg));
            });
    };
};

// Delete RolePermissions Action
export const deleteRolePermissions = (id) => {
    return dispatch => {
        dispatch(fetchRolePermissionsRequest());
        http.delete(`${API_ENDPOINT}/${AdminConfig.routes.rolesPermissions}/${id}`)
            .then(() => {
                dispatch(fetchRolePermissions()); // Refresh the RolePermissions list
            })
            .catch(error => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchRolePermissionsFailure(errorMsg));
            });
    };
};
