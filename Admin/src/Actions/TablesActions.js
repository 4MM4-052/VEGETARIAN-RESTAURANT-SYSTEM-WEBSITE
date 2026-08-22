export const FETCH_TABLE_REQUEST = "FETCH_TABLE_REQUEST";
export const FETCH_TABLE_SUCCESS = "FETCH_TABLE_SUCCESS";
export const FETCH_TABLE_FAILURE = "FETCH_TABLE_FAILURE";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const SET_LIMIT = 'SET_LIMIT'; // Thay thế SET_PAGE_SIZE

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config/index";
import http from "../Utils/Http";

// Action creators
export const fetchTableRequest = () => ({
  type: FETCH_TABLE_REQUEST,
});

export const fetchTableSuccess = ({
  results,
  totalCount,
  totalPages,
  currentPage
}) => ({
  type: FETCH_TABLE_SUCCESS,
  payload: {
    results,
    totalCount,
    totalPages,
    currentPage,
  },
});

export const fetchTableFailure = (error) => ({
  type: FETCH_TABLE_FAILURE,
  payload: error,
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setLimit = (limit) => ({  // Thay đổi SET_PAGE_SIZE thành SET_LIMIT
  type: SET_LIMIT,
  payload: limit
});

// Thunk action creator for fetching tables
export const fetchTables = (number = "", page = 1, searchCapacity = '', date = '') => {
  return async (dispatch) => {
    dispatch(fetchTableRequest());

    const limit = parseInt(localStorage.getItem('limit'), 10) || 5;

    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.table}/filter-by-date`);
      if (number) {
        url.searchParams.append("search", number);
      }
      if (searchCapacity) {
        url.searchParams.append("searchCapacity", searchCapacity);
      }
      if (date) {
        url.searchParams.append("date", date); // Thêm tham số ngày vào URL
      }

      url.searchParams.append("page", page);
      url.searchParams.append('limit', limit);
      url.searchParams.append("searchCapacity", searchCapacity);

      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;

      dispatch(fetchTableSuccess({ results, totalCount, totalPages, currentPage }));
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to fetch tables";
      dispatch(fetchTableFailure(errorMsg));
    };
  };
};

export const fetchListTableFilterByDate = (date, page = 1) => {
  return async (dispatch) => {
    dispatch(fetchTableRequest()); // Bắt đầu yêu cầu

    // Lấy limit từ localStorage, mặc định là 5 nếu chưa có
    const limit = parseInt(localStorage.getItem("limit"), 10) || 5;

    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.table}/filter-by-date`);
      
      // Thêm tham số vào query string
      url.searchParams.append("date", date);
      url.searchParams.append("page", page);
      url.searchParams.append("limit", limit); // Thay pageSize bằng limit

      // Gọi API với http.get
      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;

      // Dispatch action thành công
      dispatch(fetchTableSuccess(results, totalCount, totalPages, currentPage));
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || "Đã xảy ra lỗi khi lọc bàn theo ngày";

      // Dispatch action lỗi
      dispatch(fetchTableFailure(errorMsg));
      throw error;
    }
  };
};


export const fetchReservationDetails = (tableId) => {
  return async (dispatch) => {
    dispatch(fetchTableRequest());
    try {
      const response = await http.get(`${API_ENDPOINT}/${AdminConfig.routes.table}/${tableId}/reservations`);
      return response.data; // Trả về dữ liệu chi tiết đơn đặt bàn
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || "Đã xảy ra lỗi khi lấy thông tin đặt bàn";
      dispatch(fetchTableFailure(errorMsg));
      throw error;
    }
  };
};


export const addTable = (table) => {
  return async (dispatch) => {
    dispatch(fetchTableRequest());
    try {
      const response = await http.post(
        `${API_ENDPOINT}/${AdminConfig.routes.table}`,
        table
      );
      dispatch(fetchTables()); // Tải lại danh sách bàn sau khi thêm mới
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || "Lỗi không xác định";
      dispatch(fetchTableFailure(errorMsg));
      console.error("Lỗi khi thêm bàn:", errorMsg);
      throw new Error(errorMsg);
    }
  };
};

export const updateTable = (id, data) => {
  return async (dispatch) => {
    dispatch(fetchTableRequest());
    try {
      const response = await http.patch(
        `${API_ENDPOINT}/${AdminConfig.routes.table}/${id}`,
        data
      );
      dispatch(fetchTables()); // Tải lại danh sách bàn sau khi cập nhật
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || "Lỗi không xác định";
      dispatch(fetchTableFailure(errorMsg));
      console.error("Lỗi khi cập nhật bàn:", errorMsg);
      throw new Error(errorMsg);
    }
  };
};


export const deleteTable = (id) => {
  return async (dispatch) => {
    dispatch(fetchTableRequest());
    try {
      await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.table}/${id}`);
      dispatch(fetchTables()); // Tải lại danh sách bàn sau khi xóa
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || "Đã xảy ra lỗi trong quá trình xóa bàn";
      dispatch(fetchTableFailure(errorMsg));
      throw error;
    }
  };
};
