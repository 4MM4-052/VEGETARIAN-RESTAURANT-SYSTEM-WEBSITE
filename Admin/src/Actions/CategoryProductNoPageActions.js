
export const FETCH_CATEGORY_PRODUCT_NOPAGE_REQUEST = 'FETCH_CATEGORY_PRODUCT_NOPAGE_REQUEST';
export const FETCH_CATEGORY_PRODUCT_NOPAGE_SUCCESS = 'FETCH_CATEGORY_PRODUCT_NOPAGE_SUCCESS';
export const FETCH_CATEGORY_PRODUCT_NOPAGE_FAILURE = 'FETCH_CATEGORY_PRODUCT_NOPAGE_FAILURE';

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from '../Config/index';
import http from "../Utils/Http";

export const fetchCategoryProductNoPageRequest = () => ({
    type: FETCH_CATEGORY_PRODUCT_NOPAGE_REQUEST
});

export const fetchCategoryProductNoPageSuccess = product => ({
    type: FETCH_CATEGORY_PRODUCT_NOPAGE_SUCCESS,
    payload: product
});

export const fetchCategoryProductNoPageFailure = error => ({
    type: FETCH_CATEGORY_PRODUCT_NOPAGE_FAILURE,
    payload: error
});

export const fetchCategoryProductNoPage = () => {
    return dispatch => {
        dispatch(fetchCategoryProductNoPageRequest());
        http.get(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/noPage`)
            .then(response => {
                const product_category = response.data.results;
                console.log (response.data.results);
                dispatch(fetchCategoryProductNoPageSuccess(product_category));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchCategoryProductNoPageFailure(errorMsg));
            });
    };
};