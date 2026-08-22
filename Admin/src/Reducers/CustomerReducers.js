import {
    FETCH_CUSTOMER_FAILURE,
    FETCH_CUSTOMER_REQUEST,
    FETCH_CUSTOMER_SUCCESS,
    SET_CURRENT_PAGE
} from '../Actions/CustomerActions';


const initialState = {
    allCustomers: [],
    customer: [],
    currentPage: 1,
    pageSize: 5,
    loading: false,
    error: '',
    totalCount: 0, // Tổng số khách hàng
    totalPages: 0 // Tổng số trang
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CUSTOMER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_CUSTOMER_SUCCESS:
            return {
                ...state,
                loading: false,
                allCustomers: action.payload.results,
                totalCount: action.payload.totalCount,
                totalPages: action.payload.totalPages,
                currentPage: action.payload.currentPage,
                customer: action.payload.results.slice(0, state.pageSize) // Dữ liệu cho trang hiện tại
            };
        case FETCH_CUSTOMER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case SET_CURRENT_PAGE:
            // Tính chỉ mục bắt đầu và kết thúc cho dữ liệu của trang hiện tại
            const start = (action.payload - 1) * state.pageSize;
            const end = start + state.pageSize;

            return {
                ...state,
                currentPage: action.payload,
                customer: state.allCustomers.slice(start, end) // Dữ liệu cho trang hiện tại
            };
        default:
            return state;
    }
};



export default customerReducer;

