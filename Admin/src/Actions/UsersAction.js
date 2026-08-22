export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LIMIT = 'SET_LIMIT'; // Thay thế SET_PAGE_SIZE

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from '../Config/index';
import http from "../Utils/Http";

// Action creators
export const fetchUserRequest = () => ({
    type: FETCH_USERS_REQUEST
});

export const fetchUserSuccess = ({ results, totalCount, totalPages, currentPage }) => ({
    type: FETCH_USERS_SUCCESS,
    payload: {
        results,
        totalCount,
        totalPages,
        currentPage
    }
});

export const fetchUserFailure = (error) => ({
    type: FETCH_USERS_FAILURE,
    payload: error
});

export const setCurrentPage = (page) => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

export const setLimit = (limit) => ({  // Thay đổi SET_PAGE_SIZE thành SET_LIMIT
    type: SET_LIMIT,
    payload: limit
});

// Thunk action for fetching users
export const fetchUsers = (fullname = '', status = '',  searchRoleId = '', searchUserType = '', page = 1) => {
    return async (dispatch) => {
        dispatch(fetchUserRequest());

        // Lấy limit từ localStorage, mặc định là 5 nếu chưa có
        const limit = parseInt(localStorage.getItem('limit'), 10) || 5;

        try {
            const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.users}`);

            // Thêm tham số tìm kiếm và phân trang
            if (fullname) {
                url.searchParams.append('search', fullname);
            }
            if (status) {
                url.searchParams.append('searchStatus', status);
            }
            if (searchUserType) {
                url.searchParams.append('searchUserType', searchUserType);
            }
            if (searchRoleId) {
                url.searchParams.append("searchRoleId", searchRoleId);
              }
            url.searchParams.append('page', page);
            url.searchParams.append('limit', limit); // Dùng limit thay cho pageSize

            // Gọi API với http.get
            const response = await http.get(url.toString());
            const { results, totalCount, totalPages, currentPage } = response.data;

            // Dispatch action thành công
            dispatch(fetchUserSuccess({ results, totalCount, totalPages, currentPage }));
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch users";

            // Dispatch action lỗi
            dispatch(fetchUserFailure(errorMsg));
        }
    };
};





export const fetchUserById = (id) => {
    return async (dispatch) => {
        dispatch(fetchUserRequest());

        try {
            const url = `${API_ENDPOINT}/${AdminConfig.routes.users}/${id}`;
            const response = await http.get(url);
            const user = response.data.result;
            console.log("Check data user:: ", user)
            dispatch(fetchUserSuccess(user));
            return user; // Return the fetched user data
        } catch (error) {
            const errorMsg = error.message;
            dispatch(fetchUserFailure(errorMsg));
            throw error; // Rethrow the error for handling in the calling function
        }
    };
};




export const checkEmailExists = async (email) => {
    try {
        const response = await http.post(`${API_ENDPOINT}/${AdminConfig.routes.users}/check-email-exists`, { email });
        return response.data.exists ? response.data.user : null;
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};


export const addUser = (user) => {
    return dispatch => {
        dispatch(fetchUserRequest());
        http.post(`${API_ENDPOINT}/${AdminConfig.routes.users}`, user)
            .then(response => {
                dispatch(fetchUserSuccess(response.data.data));
                dispatch(fetchUsers());
                dispatch(fetchRole());
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchUserFailure(errorMsg));
            });
    };
};

export const updateUser = (id, data) => {
    return dispatch => {
        dispatch(fetchUserRequest());
        http.patch(`${API_ENDPOINT}/${AdminConfig.routes.users}/${id}`, data)
            .then(response => {
                dispatch(fetchUserSuccess(response.data)); // Điều chỉnh dựa trên cấu trúc trả về từ server
                dispatch(fetchUsers()); // Cập nhật danh sách nhân viên sau khi cập nhật
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchUserFailure(errorMsg));
            });
    };
};

export const deleteUsers = (id) => {
    return dispatch => {
        dispatch(fetchUserRequest());
        return http.delete(`${API_ENDPOINT}/${AdminConfig.routes.users}/${id}`)
            .then((response) => {
                dispatch(fetchUsers()); // Cập nhật danh sách sau khi xóa
                return response.data; // Trả về dữ liệu thành công
            })
            .catch(error => {
                const errorMsg = error.response?.data?.error || "Đã xảy ra lỗi khi xóa tài khoản";
                dispatch(fetchUserFailure(errorMsg));
                throw new Error(errorMsg); // Ném lỗi ra ngoài để bắt
            });
    };
};



// export const checkEmailExists = async (email) => {
//     try {
//         const response = await http.get(`${API_ENDPOINT}/auth/check-email`, { params: { email } });
//         return response.data.exists ? response.data.user : null;
//     } catch (error) {
//         console.error('Error checking user existence:', error);
//         throw error;
//     }
// };