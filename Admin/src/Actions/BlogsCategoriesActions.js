export const FETCH_CATEGORY_BLOG_REQUEST = "FETCH_CATEGORY_BLOG_REQUEST";
export const FETCH_CATEGORY_BLOG_SUCCESS = "FETCH_CATEGORY_BLOG_SUCCESS";
export const FETCH_CATEGORY_BLOG_FAILURE = "FETCH_CATEGORY_BLOG_FAILURE";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const SET_LIMIT = "SET_LIMIT"; // Thêm hành động SET_LIMIT

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config/index";
import http from "../Utils/Http";

// Action creators
export const fetchCategoryBlogRequest = () => ({
    type: FETCH_CATEGORY_BLOG_REQUEST,
});

export const fetchCategoryBlogSuccess = ({ results, totalCount, totalPages, currentPage }) => ({
    type: FETCH_CATEGORY_BLOG_SUCCESS,
    payload: {
        results,
        totalCount,
        totalPages,
        currentPage
    }
});

export const fetchCategoryBlogFailure = (error) => ({
    type: FETCH_CATEGORY_BLOG_FAILURE,
    payload: error,
});

export const setCurrentPage = (page) => ({
    type: SET_CURRENT_PAGE,
    payload: page,
});

export const setLimit = (limit) => ({ // Thêm hành động để thiết lập limit
    type: SET_LIMIT,
    payload: limit,
});

// Thunk action creator for fetching category blogs
export const fetchCategoryBlog = (name = '', status = '', page = 1) => {
    return async (dispatch) => {
        dispatch(fetchCategoryBlogRequest());

        // Lấy limit từ localStorage, mặc định là 5 nếu chưa có
        const limit = parseInt(localStorage.getItem('limit'), 10) || 5;

        try {
            const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}`);

            // Add search parameter if provided
            if (name) {
                url.searchParams.append('search', name);
            }
            if (status) {
                url.searchParams.append('searchStatus', status);
            }

            // Add pagination parameters
            url.searchParams.append('page', page);
            url.searchParams.append('limit', limit);

            const response = await http.get(url.toString());
            const { results, totalCount, totalPages, currentPage } = response.data;

            // Dispatch success action
            dispatch(fetchCategoryBlogSuccess({ results, totalCount, totalPages, currentPage }));
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch categories";
            dispatch(fetchCategoryBlogFailure(errorMsg));
        }
    };
};

// Thunk action creator for adding a category blog
export const addCategoryBlog = (categoryBlog) => {
    return async (dispatch) => {
        dispatch(fetchCategoryBlogRequest());
        try {
            await http.post(`${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}`, categoryBlog);
            // Refresh the list after adding
            dispatch(fetchCategoryBlog());
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to add category";
            dispatch(fetchCategoryBlogFailure(errorMsg));
        }
    };
};

// Thunk action creator for updating a category blog
export const updateCategoryBlog = (id, data) => {
    return async (dispatch) => {
        dispatch(fetchCategoryBlogRequest());
        try {
            await http.patch(`${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}/${id}`, data);
            // Refresh the list after updating
            dispatch(fetchCategoryBlog());
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to update category";
            dispatch(fetchCategoryBlogFailure(errorMsg));
        }
    };
};

// Thunk action creator for soft deleting a category blog
export const deleteCategoryBlog = (id) => {
    return async (dispatch) => {
        dispatch(fetchCategoryBlogRequest());
        try {
            await http.delete(`${API_ENDPOINT}/${AdminConfig.routes.categoryBlog}/${id}`);
            // Refresh the list after deleting
            dispatch(fetchCategoryBlog());
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to delete category";
            dispatch(fetchCategoryBlogFailure(errorMsg));
        }
    };
};
