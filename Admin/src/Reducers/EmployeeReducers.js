import {
    FETCH_EMPLOYEE_FAILURE,
    FETCH_EMPLOYEE_REQUEST,
    FETCH_EMPLOYEE_SUCCESS,
    SET_CURRENT_PAGE
} from '../Actions/EmployeeActions';

const initialState = {
    allEmployees: [],
    employee: [],
    currentPage: 1,
    pageSize: 5, // Số lượng nhân viên trên mỗi trang
    loading: false,
    error: '',
    totalCount: 0, // Tổng số nhân viên
    totalPages: 0 // Tổng số trang
};

const employeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_EMPLOYEE_SUCCESS:
            // const employees = Array.isArray(action.payload) ? action.payload : []; // Đảm bảo payload là một mảng
            return {
                ...state,
                loading: false,
                allEmployees: action.payload.results,
                totalCount: action.payload.totalCount,
                totalPages: action.payload.totalPages,
                currentPage: action.payload.currentPage,
                employee: action.payload.results.slice(0, state.pageSize) // Dữ liệu cho trang hiện tại
            };
        case FETCH_EMPLOYEE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case SET_CURRENT_PAGE:
            const start = (action.payload - 1) * state.pageSize;
            const end = start + state.pageSize;
            return {
                ...state,
                currentPage: action.payload,
                employee: state.allEmployees.slice(start, end) // Chia dữ liệu cho trang hiện tại
            };
        default:
            return state;
    }
};

export default employeeReducer;
