import {
  FETCH_ROLE_FAILURE,
  FETCH_ROLE_REQUEST,
  FETCH_ROLE_SUCCESS,
  SET_CURRENT_PAGE,
  SET_LIMIT, // Thêm SET_LIMIT
} from "../Actions/RoleActions";

const initialState = {
  allRoles: [], // Lưu tất cả vai trò
  role: [], // Danh sách vai trò trên trang hiện tại
  currentPage: parseInt(localStorage.getItem("currentPage"), 10) || 1,
  limit: localStorage.getItem("limit") ? parseInt(localStorage.getItem("limit")) : 5, // Lấy limit từ localStorage, mặc định là 5
  loading: false,
  error: "",
  totalCount: 0,
  totalPages: 0,
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ROLE_REQUEST:
      return {
        ...state,
        loading: true,
      };
      case FETCH_ROLE_SUCCESS:
        // Kiểm tra xem payload có phải là một đối tượng chứa dữ liệu phân trang hay không
        const {
          results = [],
          totalCount = 0,
          totalPages = 0,
          currentPage = 1,
        } = action.payload || {};
  
        // Đảm bảo rằng results là một mảng
        const rolesArray = Array.isArray(results) ? results : [];
  
        return {
          ...state,
          loading: false,
          allRoles: rolesArray,
          totalCount,
          totalPages,
          currentPage,
          // Cập nhật danh sách vai trò cho trang hiện tại
          role: rolesArray.slice(0, state.limit),
        };
    case FETCH_ROLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SET_CURRENT_PAGE: {
      const start = (action.payload - 1) * state.limit;
      const end = start + state.limit;

      // Lưu thông tin currentPage vào localStorage
      localStorage.setItem("currentPage", action.payload);

      return {
        ...state,
        currentPage: action.payload,
        role: state.allRoles.slice(start, end), // Cập nhật vai trò theo trang hiện tại
      };
    }
    case SET_LIMIT: {
      const newLimit = action.payload;

      // Điều chỉnh currentPage nếu cần thiết
      const totalPages = Math.ceil(state.allRoles.length / newLimit); // Tổng số trang
      const currentPage =
        state.currentPage > totalPages ? totalPages : state.currentPage;

      const start = (currentPage - 1) * newLimit;
      const end = start + newLimit;

      // Lưu limit vào localStorage
      localStorage.setItem("limit", newLimit);

      return {
        ...state,
        limit: newLimit,
        currentPage, // Cập nhật currentPage nếu cần thiết
        role: state.allRoles.slice(start, end), // Cập nhật danh sách vai trò theo limit mới
      };
    }
    default:
      return state;
  }
};

export default roleReducer;
