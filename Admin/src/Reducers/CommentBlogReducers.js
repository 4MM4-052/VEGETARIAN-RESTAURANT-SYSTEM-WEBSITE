import {
    FETCH_COMMENTBLOG_FAILURE,
    FETCH_COMMENTBLOG_REQUEST,
    FETCH_COMMENTBLOG_SUCCESS,
    SET_CURRENT_PAGE,
    SET_LIMIT,
} from '../Actions/CommentBlogActions';

const initialState = {
    currentPage: parseInt(localStorage.getItem("currentPage"), 10) || 1,
    allCommentBlogs: [],
    loading: false,
    commentBlog: [],
    limit: localStorage.getItem("limit")
    ? parseInt(localStorage.getItem("limit"))
    : 10,
    error: '',
    totalCount: 0,
    totalPages: 0
};

const commentBlogReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_COMMENTBLOG_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case FETCH_COMMENTBLOG_SUCCESS:
            const { results, totalCount, totalPages, currentPage } = action.payload;

            // Kiểm tra xem results có phải là mảng không trước khi gọi slice
            const commentBlogs = Array.isArray(results) ? results : [];

            return {
                ...state,
                loading: false,
                allCommentBlogs: commentBlogs, // Lưu tất cả các bình luận
                totalCount,         // Tổng số bình luận
                totalPages,         // Tổng số trang
                currentPage,       // Trang hiện tại
                commentBlog: commentBlogs.slice(0, state.limit), // Dữ liệu cho trang hiện tại
            };

        case FETCH_COMMENTBLOG_FAILURE:
            return {
                ...state,
                loading: false,
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
                commentBlog: state.allCommentBlogs.slice(start, end), // Dữ liệu của trang hiện tại
            };

            case SET_LIMIT: {
                const newLimit = action.payload;
          
                // Điều chỉnh currentPage để đảm bảo không vượt quá số trang có sẵn khi limit thay đổi
                const totalPages = Math.ceil(state.allCommentBlogs.length / newLimit); // Tổng số trang
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
                    commentblog: state.allCommentBlogs.slice(start, end), // Cập nhật lại danh sách người dùng theo limit mới
                  };}
        default:
            return state;
    }
};

export default commentBlogReducer;
