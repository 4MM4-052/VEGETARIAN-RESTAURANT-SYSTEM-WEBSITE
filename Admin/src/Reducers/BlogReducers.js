import {
  FETCH_BLOG_FAILURE,
  FETCH_BLOG_REQUEST,
  FETCH_BLOG_SUCCESS,
  SET_CURRENT_PAGE,
  SET_LIMIT,
} from "../Actions/BlogActions";

const initialState = {
  allBlogs: [],
  blog: [],
  currentPage: parseInt(localStorage.getItem("currentPage"), 10) || 1,
  limit: localStorage.getItem("limit")
    ? parseInt(localStorage.getItem("limit"))
    : 10,
  loading: false,
  error: "",
  totalCount: 0, // Tổng số khách hàng
  totalPages: 0, // Tổng số trang
};

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BLOG_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case FETCH_BLOG_SUCCESS:
      const { results, totalCount, totalPages, currentPage } = action.payload;

      // Lưu thông tin trang vào localStorage
      localStorage.setItem("currentPage", currentPage);

      return {
        ...state,
        loading: false,
        allBlogs: results,
        totalCount,
        totalPages,
        currentPage,
        // Correctly apply slice to the results array
        blog: action.payload.results.slice(0, state.limit),
      };
    case FETCH_BLOG_FAILURE:
      return {
        ...state,
        loading: false,
        blog: [],
        allBlogs: [],
        error: action.payload,
      };
    case SET_CURRENT_PAGE:
      const start = (action.payload - 1) * state.limit;
      const end = start + state.limit;

      // Lưu thông tin trang hiện tại vào localStorage
      localStorage.setItem("currentPage", action.payload);

      return {
        ...state,
        currentPage: action.payload,
        blog: state.allBlogs.slice(start, end),
      };

    case SET_LIMIT: {
      const newLimit = action.payload;

      // Điều chỉnh currentPage để đảm bảo không vượt quá số trang có sẵn khi limit thay đổi
      const totalPages = Math.ceil(state.allBlogs.length / newLimit); // Tổng số trang
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
        blog: state.allBlogs.slice(start, end), // Cập nhật lại danh sách người dùng theo limit mới
      };
    }

    default:
      return state;
  }
};

export default blogReducer;
