export const FETCH_PRODUCT_CATEGORY_REQUEST = 'FETCH_PRODUCT_CATEGORY_REQUEST';
export const FETCH_PRODUCT_CATEGORY_SUCCESS = 'FETCH_PRODUCT_CATEGORY_SUCCESS';
export const FETCH_PRODUCT_CATEGORY_FAILURE = 'FETCH_PRODUCT_CATEGORY_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LIMIT = 'SET_LIMIT';

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from '../Config/index';
import http from "../Utils/Http";

export const fetchProductCategoryRequest = () => ({
    type: FETCH_PRODUCT_CATEGORY_REQUEST
});

export const fetchProductCategorySuccess = (results, totalCount, totalPages, currentPage) => ({
    type: FETCH_PRODUCT_CATEGORY_SUCCESS,
    payload: {
        results,
        totalCount,
        totalPages,
        currentPage
    }
});

export const fetchProductCategoryFailure = error => ({
    type: FETCH_PRODUCT_CATEGORY_FAILURE,
    payload: error
});

export const setCurrentPage = (page) => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

export const setLimit = (limit) => ({
    type: SET_LIMIT,
    payload: limit
});

export const fetchProductCategory = (name = '', status = '', page = 1, pageSize = 10) => {
    return dispatch => {
        dispatch(fetchProductCategoryRequest());

        const limit = parseInt(localStorage.getItem('limit'), 10) || 5;
        
        const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}`);

        // Thêm tham số tìm kiếm nếu có
        if (name) {
            url.searchParams.append('search', name);
        }
        if (status) {
            url.searchParams.append('searchStatus', status);
        }

        // Thêm tham số phân trang
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);

        http.get(url.toString())
            .then(response => {
                const { results, totalCount, totalPages, currentPage } = response.data;

                // Dispatch action để cập nhật dữ liệu
                dispatch(fetchProductCategorySuccess(results, totalCount, totalPages, currentPage));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchProductCategoryFailure(errorMsg));
            });
    };
};

export const fetchProductCategoryHoatDong = (name = '', page = 1, pageSize = 10) => {
    return dispatch => {
        dispatch(fetchProductCategoryRequest());

        const limit = parseInt(localStorage.getItem('limit'), 10) || 5;

        const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/hoat_dong`);

        // Thêm tham số tìm kiếm nếu có
        if (name) {
            url.searchParams.append('search', name);
        }
        // Thêm tham số phân trang
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);

        http.get(url.toString())
            .then(response => {
                const { results, totalCount, totalPages, currentPage } = response.data;

                // Dispatch action để cập nhật dữ liệu
                dispatch(fetchProductCategorySuccess(results, totalCount, totalPages, currentPage));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchProductCategoryFailure(errorMsg));
            });
    };
};

export const fetchListProductCategory = () => {
    return dispatch => {
        dispatch(fetchProductCategoryRequest());
        http.get(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/danh_muc`)
            .then(response => {
                const product_category = response.data.results;
                dispatch(fetchProductCategorySuccess(product_category));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchProductCategoryFailure(errorMsg));
            });
    };
};

export const addProductCategory = (product) => {
    return dispatch => {
        dispatch(fetchProductCategoryRequest());
        http.post(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}`, product)
            .then((response) => {
                // Sau khi thêm san pham mới, gọi lại fetchProduct để làm mới danh sách
                dispatch(fetchProductCategorySuccess(response.data.data));
                dispatch(fetchProductCategory());
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchProductCategoryFailure(errorMsg));
            });
    };
};

export const updateProductCategory = (id, data) => {
    return (dispatch) => {
        dispatch(fetchProductCategoryRequest());
        http.patch(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/${id}`, data)
            .then((response) => {
                dispatch(fetchProductCategorySuccess(response.data.data));
                dispatch(fetchProductCategory()); // Reload danh sách sau khi cập nhật
            })
            .catch((error) => {
                dispatch(fetchProductCategoryFailure(error.message));
            });
    };
};

export const deleteProductCategory = (id, name = '', page = 1, pageSize = 10) => {
    return dispatch => {
        dispatch(fetchProductCategoryRequest());
        http.delete(`${API_ENDPOINT}/${AdminConfig.routes.categoryProduct}/${id}`)
            .then(() => {
                // Sau khi xóa danh muc, gọi lại fetchProductCategory để làm mới danh sách
                dispatch(fetchProductCategory(name, page, pageSize));
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchProductCategoryFailure(errorMsg));
            });
    };
};