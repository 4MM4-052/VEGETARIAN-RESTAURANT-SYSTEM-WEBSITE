export const FETCH_BLOG_REQUEST = "FETCH_BLOG_REQUEST";
export const FETCH_BLOG_SUCCESS = "FETCH_BLOG_SUCCESS";
export const FETCH_BLOG_FAILURE = "FETCH_BLOG_FAILURE";
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_LIMIT = 'SET_LIMIT'; // Thay thế SET_PAGE_SIZE

import { API_ENDPOINT } from "../Config/APIs";
import AdminConfig from "../Config/index";
import http from "../Utils/Http";

export const fetchBlogRequest = () => ({
  type: FETCH_BLOG_REQUEST,
});

export const fetchBlogSuccess = ({ results, totalCount, totalPages, currentPage }) => ({
  type: FETCH_BLOG_SUCCESS,
  payload: {
    results,
    totalCount,
    totalPages,
    currentPage,
  },
});

export const fetchBlogFailure = (error) => ({
  type: FETCH_BLOG_FAILURE,
  payload: error,
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setLimit = (limit) => ({
  type: SET_LIMIT,
  payload: limit,
});

// Thunk action for fetching blogs
export const fetchBlog = (name = '', page = 1) => {
  return async (dispatch) => {
    dispatch(fetchBlogRequest());

    // Get limit from localStorage or default to 5
    const limit = parseInt(localStorage.getItem('limit'), 10) || 5;

    try {
      const url = new URL(`${API_ENDPOINT}/${AdminConfig.routes.blog}`);

      // Add search parameter if name is provided
      if (name) {
        url.searchParams.append('searchName', name);
      }

      // Add pagination parameters
      url.searchParams.append('page', page);
      url.searchParams.append('limit', limit); // Corrected typo from "limt" to "limit"

      // Fetch data from the API
      const response = await http.get(url.toString());
      const { results, totalCount, totalPages, currentPage } = response.data;

      // Dispatch success action
      dispatch(fetchBlogSuccess({ results, totalCount, totalPages, currentPage }));
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to fetch blogs";

      // Dispatch failure action
      dispatch(fetchBlogFailure(errorMsg));
    }
  };
};


export const addBlog = (blog) => {
  return (dispatch) => {
    dispatch(fetchBlogRequest());
    http
      .post(`${API_ENDPOINT}/${AdminConfig.routes.blog}`, blog)
      .then((response) => {
        dispatch(fetchBlogSuccess(response.data.data));
        dispatch(fetchBlog());
        // dispatch(fetchCategoryBlogAction()); // Dispatching fetchCategoryBlogAction
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchBlogFailure(errorMsg));
      });
  };
};

export const updateBlog = (id, data) => {
  return (dispatch) => {
    dispatch(fetchBlogRequest());
    http
      .patch(`${API_ENDPOINT}/${AdminConfig.routes.blog}/${id}`, data)
      .then((response) => {
        dispatch(fetchBlogSuccess(response.data.data));
        dispatch(fetchBlog());
      })
      .catch((error) => {
        dispatch(fetchBlogFailure(error.message));
      });
  };
};

export const deleteBlog = (id) => {
    return dispatch => {
        dispatch(fetchBlogRequest());
        http.delete(`${API_ENDPOINT}/${AdminConfig.routes.blog}/${id}`)
            .then(() => {
                // Sau khi xóa khách hàng, gọi lại fetchCustomer để làm mới danh sách
                dispatch(fetchBlog());
            })
            .catch((error) => {
                const errorMsg = error.message;
                dispatch(fetchBlogFailure(errorMsg));
            });
    };
};

