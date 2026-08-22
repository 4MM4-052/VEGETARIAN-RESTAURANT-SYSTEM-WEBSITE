import {
    FETCH_CATEGORY_BLOG_REQUEST,
    FETCH_CATEGORY_BLOG_SUCCESS,
    FETCH_CATEGORY_BLOG_FAILURE,
    SET_CURRENT_PAGE,
    SET_LIMIT // Thêm hành động để thay đổi số lượng danh mục hiển thị mỗi trang
} from '../Actions/BlogsCategoriesActions';

const initialState = {
    allCategories: [], // Lưu tất cả danh mục
    categories: [], // Danh mục hiển thị trên trang hiện tại
    currentPage: parseInt(localStorage.getItem('currentPage'), 10) || 1,
    limit: localStorage.getItem('limit') ? parseInt(localStorage.getItem('limit')) : 5, // Số lượng danh mục hiển thị mỗi trang
    loading: false,
    error: '',
    totalCount: 0, // Tổng số danh mục
    totalPages: 0 // Tổng số trang
};

const blogsCategoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CATEGORY_BLOG_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_CATEGORY_BLOG_SUCCESS: {
            const { results, totalCount, totalPages, currentPage } = action.payload;

            // Lưu thông tin trang vào localStorage
            localStorage.setItem('currentPage', currentPage);

            return {
                ...state,
                loading: false,
                allCategories: results,
                totalCount,
                totalPages,
                currentPage,
                categories: results.slice(0, state.limit) // Danh mục hiển thị cho trang đầu tiên
            };
        }
        case FETCH_CATEGORY_BLOG_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                categories: [] // Xóa dữ liệu nếu xảy ra lỗi
            };
        case SET_CURRENT_PAGE: {
            const start = (action.payload - 1) * state.limit;
            const end = start + state.limit;

            // Lưu thông tin trang hiện tại vào localStorage
            localStorage.setItem('currentPage', action.payload);

            return {
                ...state,
                currentPage: action.payload,
                categories: state.allCategories.slice(start, end) // Cập nhật danh mục hiển thị
            };
        }
        case SET_LIMIT: {
            const newLimit = action.payload;

            // Điều chỉnh currentPage nếu limit mới làm tổng số trang thay đổi
            const totalPages = Math.ceil(state.allCategories.length / newLimit);
            const currentPage = state.currentPage > totalPages ? totalPages : state.currentPage;

            // Tính toán lại các chỉ số start và end dựa trên currentPage và newLimit
            const start = (currentPage - 1) * newLimit;
            const end = start + newLimit;

            // Lưu limit vào localStorage
            localStorage.setItem('limit', newLimit);

            return {
                ...state,
                limit: newLimit,
                currentPage,
                categories: state.allCategories.slice(start, end) // Cập nhật lại danh mục theo limit mới
            };
        }
        default:
            return state;
    }
};

export default blogsCategoriesReducer;
