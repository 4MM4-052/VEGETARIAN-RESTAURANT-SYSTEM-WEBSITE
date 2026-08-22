import {
    FETCH_REVENUE_REQUEST,
    FETCH_REVENUE_SUCCESS,
    FETCH_REVENUE_FAILURE
} from '../Actions/RevenueTimeAction';

const initialState = {
    loading: false,
    data: null,
    error: null,
};

const revenueTimeReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_REVENUE_REQUEST:
            return { ...state, loading: true };
        case FETCH_REVENUE_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case FETCH_REVENUE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default revenueTimeReducer;