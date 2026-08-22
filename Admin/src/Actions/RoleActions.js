export const FETCH_ROLE_REQUEST = "FETCH_ROLE_REQUEST";
export const FETCH_ROLE_SUCCESS = "FETCH_ROLE_SUCCESS";
export const FETCH_ROLE_FAILURE = "FETCH_ROLE_FAILURE";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const SET_LIMIT = "SET_LIMIT";

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config/index";
import http from "../Utils/Http";

export const fetchRoleRequest = () => ({
  type: FETCH_ROLE_REQUEST,
});

export const fetchRoleSuccess = (
  results,
  totalCount,
  totalPages,
  currentPage
) => ({
  type: FETCH_ROLE_SUCCESS,
  payload: {
    results,
    totalCount,
    totalPages,
    currentPage,
  },
});

export const fetchRoleFailure = (error) => ({
  type: FETCH_ROLE_FAILURE,
  payload: error,
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setLimit = (limit) => ({
  // Thay đổi SET_PAGE_SIZE thành SET_LIMIT
  type: SET_LIMIT,
  payload: limit,
});

export const fetchRole = (name = "", page = 1) => {
  return async (dispatch) => {
    dispatch(fetchRoleRequest());

    // Lấy limit từ localStorage, mặc định là 5 nếu chưa có
    const limit = parseInt(localStorage.getItem("limit"), 10) || 5;

    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.role}`);

      // Thêm tham số tìm kiếm và phân trang
      if (name) {
        url.searchParams.append("search", name);
      }
      url.searchParams.append("page", page);
      url.searchParams.append("limit", limit); // Dùng limit thay cho pageSize

      // Gọi API với http.get
      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;

      // Dispatch action thành công
      dispatch(fetchRoleSuccess(results, totalCount, totalPages, currentPage));
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch roles";

      // Dispatch action lỗi
      dispatch(fetchRoleFailure(errorMsg));
    }
  };
};

export const fetchRole2 = () => {
  return (dispatch) => {
    dispatch(fetchRoleRequest());

    const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.role}`);

    // Không thêm tham số tìm kiếm và phân trang

    http
      .get(url.toString())
      .then((response) => {
        const { results } = response.data;

        // Dispatch action để cập nhật dữ liệu
        dispatch(fetchRoleSuccess(results));
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchRoleFailure(errorMsg));
      });
  };
};

export const addRole = (role) => {
  return async (dispatch) => {
    dispatch(fetchRoleRequest());
    try {
      const response = await http.post(
        `${API_ENDPOINT}/${AdminConfig.routes.role}`,
        role
      );
      dispatch(fetchRoleSuccess(response.data));
      dispatch(fetchRole());
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "Lỗi không xác định";
      throw new Error(errorMsg);
    }
  };
};

export const updateRole = (id, data) => {
  return async (dispatch) => {
    dispatch(fetchRoleRequest());
    try {
      const response = await http.patch(
        `${API_ENDPOINT}/${AdminConfig.routes.role}/${id}`,
        data
      );
      dispatch(fetchRoleSuccess(response.data));
      dispatch(fetchRole());
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "Lỗi không xác định";
      throw new Error(errorMsg);
    }
  };
};

export const deleteRole = (id) => {
  return async (dispatch) => {
    dispatch(fetchRoleRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.role}/${id}`);
      // Sau khi xóa vai trò, gọi lại fetchRole để làm mới danh sách
      dispatch(fetchRole());
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "Lỗi không xác định";
      throw new Error(errorMsg);
    }
  };
};
