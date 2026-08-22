import {
  FETCH_TABLE_REQUEST,
  FETCH_TABLE_SUCCESS,
  FETCH_TABLE_FAILURE,
  SET_CURRENT_PAGE,
  SET_LIMIT, // Thay thế SET_PAGE_SIZE thành SET_LIMIT
} from "../Actions/TablesActions";

const initialState = {
  allTables: [], // Tất cả dữ liệu bảng
  tables: [], // Dữ liệu bảng cho trang hiện tại
  currentPage: parseInt(localStorage.getItem("currentPage"), 10) || 1,
  limit: localStorage.getItem("limit")
    ? parseInt(localStorage.getItem("limit"))
    : 10,
  loading: false,
  error: "",
  totalCount: 0,
  totalPages: 0,
};

const tablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TABLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case FETCH_TABLE_SUCCESS:
      const { results, totalCount, totalPages, currentPage } = action.payload;

      // Lưu thông tin trang vào localStorage
      localStorage.setItem("currentPage", currentPage);
      return {
        ...state,
        loading: false,
        allTables: results,
        totalCount,
        totalPages,
        currentPage,
        tables: Array.isArray(action.payload?.results)
          ? action.payload.results.slice(
              0,
              Number.isFinite(state.limit) ? state.limit : 0
            )
          : [],
      };
    case FETCH_TABLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        tables: [],
      };
    case SET_CURRENT_PAGE: {
      const start = (action.payload - 1) * state.limit;
      const end = start + state.limit;
      return {
        ...state,
        currentPage: action.payload,
        tables: state.allTables.slice(start, end), // Dữ liệu bảng cho trang hiện tại
      };
    }

    case SET_LIMIT: {
      const newLimit = action.payload;

      // Điều chỉnh currentPage để đảm bảo không vượt quá số trang có sẵn khi limit thay đổi
      const totalPages = Math.ceil(state.allUsers.length / newLimit); // Tổng số trang
      const currentPage =
        state.currentPage > totalPages ? totalPages : state.currentPage;

      // Tính toán lại các chỉ số start và end dựa trên currentPage và newLimit
      const start = (currentPage - 1) * newLimit;
      const end = start + newLimit;

      // Lưu limit vào localStorage
      localStorage.setItem("limit", newLimit);

      return {
        ...state,
        limit: newLimit,
        currentPage, // Cập nhật currentPage nếu cần thiết
        tables: state.allTables.slice(start, end), // Cập nhật lại danh sách người dùng theo limit mới
      };
    }
    default:
      return state;
  }
};

export default tablesReducer;
