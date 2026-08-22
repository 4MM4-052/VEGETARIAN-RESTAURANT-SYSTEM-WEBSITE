import {
    FETCH_USERS_FAILURE,
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    SET_CURRENT_PAGE,
    SET_LIMIT  // Thay thế SET_PAGE_SIZE thành SET_LIMIT
} from '../Actions/UsersAction';

const initialState = {
    allUsers: [], // Lưu tất cả người dùng
    user: [], // Danh sách người dùng trên trang hiện tại
    currentPage: parseInt(localStorage.getItem('currentPage'), 10) || 1,
    limit: localStorage.getItem('limit') ? parseInt(localStorage.getItem('limit')) : 10,
    loading: false,
    error: '',
    totalCount: 0,
    totalPages: 0
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_USERS_SUCCESS:
            const { results, totalCount, totalPages, currentPage } = action.payload;

            // Lưu thông tin trang vào localStorage
            localStorage.setItem('currentPage', currentPage);

            return {
                ...state,
                loading: false,
                allUsers: results,
                totalCount,
                totalPages,
                currentPage,
                user: Array.isArray(results) ? results.slice(0, state.limit) : [],

            };
        case FETCH_USERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case SET_CURRENT_PAGE: {
            const start = (action.payload - 1) * state.limit;
            const end = start + state.limit;

            // Lưu thông tin trang hiện tại vào localStorage
            localStorage.setItem('currentPage', action.payload);

            return {
                ...state,
                currentPage: action.payload,
                user: state.allUsers.slice(start, end) // Cập nhật danh sách người dùng của trang mới
            };
        }
        case SET_LIMIT: {
            const newLimit = action.payload;

            // Điều chỉnh currentPage để đảm bảo không vượt quá số trang có sẵn khi limit thay đổi
            const totalPages = Math.ceil(state.allUsers.length / newLimit); // Tổng số trang
            const currentPage = state.currentPage > totalPages ? totalPages : state.currentPage;

            // Tính toán lại các chỉ số start và end dựa trên currentPage và newLimit
            const start = (currentPage - 1) * newLimit;
            const end = start + newLimit;

            // Lưu limit vào localStorage
            localStorage.setItem('limit', newLimit);

            return {
                ...state,
                limit: newLimit,
                currentPage, // Cập nhật currentPage nếu cần thiết
                user: state.allUsers.slice(start, end), // Cập nhật lại danh sách người dùng theo limit mới
            };
        }

        default:
            return state;
    }
};

export default userReducer;
