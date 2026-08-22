import {
    FETCH_STATISTICAL_REQUEST,
    FETCH_STATISTICAL_SUCCESS,
    FETCH_STATISTICAL_FAILURE
} from '../Actions/StatisticalActions';

const initialState = {
    loading: false,
    data: null,
    error: ''
};

const StatisticalReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_STATISTICAL_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_STATISTICAL_SUCCESS:
            return {
                loading: false,
                data: action.payload,
                error: ''
            };
        case FETCH_STATISTICAL_FAILURE:
            return {
                loading: false,
                data: null,
                error: action.payload
            };
        default:
            return state;
    }
};

export default StatisticalReducer;