import {
    FETCH_QUYEN_HAN_REQUEST,
    FETCH_QUYEN_HAN_SUCCESS,
    FETCH_QUYEN_HAN_FAILURE,
} from "../Actions/GetQuyenHanAction";

const initialState = {
    loading: false,
    getQuyenHan: null,
    error: '',
};

const getQuyenHanReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_QUYEN_HAN_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_QUYEN_HAN_SUCCESS:
            return {
                loading: false,
                getQuyenHan: action.payload,
                error: ''
            };
        case FETCH_QUYEN_HAN_FAILURE:
            return {
                loading: false,
                getQuyenHan: null,
                error: action.payload
            };
        default:
            return state;
    }
};

export default getQuyenHanReducer;

