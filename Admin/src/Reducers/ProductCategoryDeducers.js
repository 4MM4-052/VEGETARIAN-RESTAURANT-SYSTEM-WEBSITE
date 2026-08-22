import {
    FETCH_PRODUCT_CATEGORY_REQUEST,
    FETCH_PRODUCT_CATEGORY_SUCCESS,
    FETCH_PRODUCT_CATEGORY_FAILURE,
    SET_CURRENT_PAGE,
    SET_LIMIT
} from '../Actions/ProductCategoryActions';


const initialState = {
    allProduct_categorys: [],
    loading: false,
    product_category: [],
    error: '',
    totalCount: 0,
    totalPages: 0,
    currentPage: parseInt(localStorage.getItem('currentPage'), 10) || 1,
    limit: localStorage.getItem('limit') ? parseInt(localStorage.getItem('limit')) : 10,
};

const productCategoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCT_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_PRODUCT_CATEGORY_SUCCESS:
            const { results, totalCount, totalPages, currentPage } = action.payload;

            localStorage.setItem('currentPage', currentPage);

            return {
                ...state,
                loading: false,
                allProduct_categorys: results,
                totalCount,
                totalPages,
                currentPage,
                product_category: action.payload.results.slice(0, state.limit),
            };
        case FETCH_PRODUCT_CATEGORY_FAILURE:
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
                product_category: state.allProduct_categorys.slice(start, end)
            };
        case SET_LIMIT: {
            const newLimit = action.payload;

            // Điều chỉnh currentPage để đảm bảo không vượt quá số trang có sẵn khi limit thay đổi
            const totalPages = Math.ceil(state.allProduct_categorys.length / newLimit); // Tổng số trang
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
                product_category: state.allProduct_categorys.slice(start, end), // Cập nhật lại danh sách người dùng theo limit mới
            };
        }
        default:
            return state;
    }
};

export default productCategoryReducer;

