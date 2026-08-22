import {
    FETCH_RESERVATIONS_REQUEST,
    FETCH_RESERVATIONS_SUCCESS,
    FETCH_RESERVATIONS_FAILURE,
    SET_CURRENT_PAGE,
    SET_LIMIT
} from '../Actions/Reservations_t_AdminActions';

const initialState = {
    allReservation: [],
    loading: false,
    reservation: [],
    error: '',
    totalCount: 0,
    totalPages: 0,
    currentPage: parseInt(localStorage.getItem('currentPage'), 10) || 1,
    limit: localStorage.getItem('limit') ? parseInt(localStorage.getItem('limit')) : 10,
};

const Reservations_t_AdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_RESERVATIONS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_RESERVATIONS_SUCCESS:
            const { results, totalCount, totalPages, currentPage } = action.payload;

            return {
                ...state,
                loading: false,
                allReservation: results || [], // Gán giá trị mặc định là mảng rỗng nếu không có
                totalCount,
                totalPages,
                currentPage,
                reservation: Array.isArray(action.payload.results) ? action.payload.results.slice(0, state.limit) : [],
            };
        case FETCH_RESERVATIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case SET_CURRENT_PAGE:
            const start = (action.payload - 1) * state.limit;
            const end = start + state.limit;

            // Lưu thông tin trang hiện tại vào localStorage
            localStorage.setItem('currentPage', action.payload);
            return {
                ...state,
                currentPage: action.payload,
                reservation: state.allReservation.slice(start, end)
            };
        case SET_LIMIT: {
            const newLimit = action.payload;

            // Điều chỉnh currentPage để đảm bảo không vượt quá số trang có sẵn khi limit thay đổi
            const totalPages = Math.ceil(state.allReservation.length / newLimit); // Tổng số trang
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
                reservation: state.allReservation.slice(start, end), // Cập nhật lại danh sách người dùng theo limit mới
            };
        }
        default:
            return state;
    }
};

export default Reservations_t_AdminReducer;

