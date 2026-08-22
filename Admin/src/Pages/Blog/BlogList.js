import React, { useEffect,useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchBlog, deleteBlog, setCurrentPage } from '../../Actions/BlogActions';
import DialogConfirm from '../../Components/Dialog/Dialog';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import { InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SuccessAlert } from '../../Components/Alert/Alert';
import CheckboxSelection from '../../Components/CheckboxSelection';
import debounce from "lodash.debounce";

import { getPermissions } from '../../Actions/GetQuyenHanAction';
import { jwtDecode as jwt_decode } from 'jwt-decode';

export default function BlogList() {
    const dispatch = useDispatch();
    const blogState = useSelector(state => state.blog);
    const navigate = useNavigate();

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const urlPage = parseInt(query.get('page')) || 1;

    const token = localStorage.getItem('token');
    const getQuyenHanState = useSelector(state => state.getQuyenHan);
    const permissions = getQuyenHanState.getQuyenHan || [];

    useEffect(() => {
        if (token) {
          const decodedToken = jwt_decode(token);
          const userIdFromToken = decodedToken.id;
          dispatch(getPermissions(userIdFromToken));  
        }
        const decodedToken = jwt_decode(token);
        const userIdFromToken = decodedToken.id;
        dispatch(getPermissions(userIdFromToken));
    }, [navigate, dispatch, token]);

    const hasPermission = (permissionName) => {
        return permissions.data && permissions.data.some(permission => permission.name == permissionName);
    };

    const [open, setOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); 

    const debouncedSearch = useMemo(() => debounce((term) => {
        dispatch(fetchBlog(term, urlPage, blogState.pageSize));
        dispatch(setCurrentPage(1));
      }, 1000), [dispatch, urlPage, blogState.pageSize]);
    
      useEffect(() => {
        return () => {
          debouncedSearch.cancel();
        };
      }, [debouncedSearch]);
    
      useEffect(() => {
        if (!searchTerm) {
            dispatch(fetchBlog("", urlPage, blogState.pageSize)); // Fetch lại dữ liệu khi không tìm kiếm
        }
    }, [dispatch, searchTerm, urlPage, blogState.pageSize]);
    
      useEffect(() => {
        if (searchTerm) {
          debouncedSearch(searchTerm);
        }
      }, [searchTerm]);
    




    
    useEffect(() => {
        navigate(`?page=${blogState.currentPage}`);
    }, [blogState.currentPage, navigate]);

    const handleClickOpen = (blogId) => {
        setSelectedBlog(blogId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBlog(null);
    };

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const handleConfirm = () => {
        if (selectedBlog) {
            dispatch(deleteBlog(selectedBlog));
            setOpenSuccess(true); // Hiển thị thông báo thành công
            handleClose();
        }
    };

    const handleDeleteBlogs = async (selectedIds) => {
        for (let Id of selectedIds) {
            await dispatch(deleteBlog(Id));
        }
        setOpenSuccess(true); // Hiển thị thông báo thành công
    };

    const {
        selectedItems,
        handleSelectItem,
        handleSelectAll,
        handleDeleteSelected,
        allSelected
    } = CheckboxSelection(blogState.blog, handleDeleteBlogs);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        dispatch(setCurrentPage(1));
    };

    const handleEdit = (id) => {
        navigate(`edit/${id}`);
    };

    // Modify the handleViewComment to just navigate to the comment view
    const handleViewComment = (blogId) => {
        navigate(`/comment-blog/${blogId}`); // Navigate to the comment view
        // Fetching comments will be handled in the comment view component
    };
    
    const handlePageChange = (page) => {
        navigate(`?page=${page}`); // Cập nhật URL với trang mới
        dispatch(setCurrentPage(page)); // Cập nhật trang hiện tại trong state
        dispatch(fetchBlog(searchTerm, page, blogState.pageSize)); // Fetch dữ liệu theo trang mới
    };


    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                    <div>
                        <h3 className="fw-bold mb-3">Quản lý bài viết</h3>
                        <h6 className="op-7 mb-2">Hương Sen Admin Dashboard</h6>
                    </div>
                    <div className="ms-md-auto py-2 py-md-0">
                        {hasPermission('Xóa bài viết') && (
                            <button className="btn btn-danger btn-round me-2" onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
                                Xóa mục đã chọn
                            </button>
                        )}
                        {hasPermission('Thêm bài viết') && (
                            <Link to="/blogs/add" className="btn btn-primary btn-round">Thêm bài viết</Link>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-round">
                            <div className="card-header">
                                <div className="card-head-row card-tools-still-right">
                                    <div className="card-title">Danh sách</div>
                                    <div className="card-tools">
                                        <Paper
                                            component="form"
                                            sx={{
                                                p: '2px 4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: 320,
                                            }}
                                        >
                                            <SearchIcon />
                                            <InputBase
                                                sx={{ ml: 1, flex: 1 }}
                                                placeholder="Tìm kiếm bài viết hoặc tác giả ở đây!"
                                                inputProps={{ 'aria-label': 'search' }}
                                                value={searchTerm}
                                                onChange={handleSearch} // Handle search term change
                                            />
                                        </Paper>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive text-center">
                                    <table className="table align-items-center mb-0">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        checked={allSelected}
                                                        onChange={handleSelectAll}
                                                    />
                                                </th>
                                                <th scope="col">STT</th>
                                                <th scope="col">Tiêu đề</th>
                                                <th scope="col">Tác giả</th>
                                                <th scope="col">Hình ảnh</th>
                                                <th scope="col">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {blogState.loading && (
                                                <tr>
                                                    <td colSpan="6">Loading...</td>
                                                </tr>
                                            )}
                                            {!blogState.loading && blogState.blog.length === 0 && (
                                                <tr>
                                                    <td colSpan="7">Không tìm thấy bài viết.</td>
                                                </tr>
                                            )}
                                            {blogState.error && (
                                                <tr>
                                                    <td colSpan="6">Error: {blogState.error}</td>
                                                </tr>
                                            )}
                                            {blogState.allBlogs && blogState.allBlogs.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.includes(item.id)}
                                                            onChange={() => handleSelectItem(item.id)}
                                                        />
                                                    </td>
                                                    <td>{index + 1}</td>
                                                    <td>{item.title}</td>
                                                    <td>{item.author}</td>
                                                    <td>
                                                        <img className="img-fluid rounded" src={item.poster || '../Assets/Images/default.jpg'} alt="poster" width={70} />
                                                    </td>
                                                    <td>
                                                        <div className="btn-group mt-3" role="group">
                                                            {hasPermission('Xem bình luận bài viết') && (
                                                                <button type="button" className="btn btn-outline-warning" onClick={() => handleViewComment(item.id)}>Xem bình luận</button>
                                                            )}
                                                            {hasPermission('Sửa bài viết') && (
                                                                <button type="button" className="btn btn-outline-success" onClick={() => handleEdit(item.id)}>Sửa</button>
                                                            )}
                                                            {hasPermission('Xóa bài viết') && (
                                                                <button type="button" className="btn btn-outline-danger" onClick={() => handleClickOpen(item.id)}>Xóa</button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table> 
                                </div>
                                <div className='my-2'>
                                <CustomPagination
                                        count={blogState.totalPages} // Tổng số trang từ state
                                        onPageChange={handlePageChange} // Hàm chuyển trang
                                        currentPageSelector={(state) => state.blog.currentPage} // Selector lấy currentPage
                                        pageSizeSelector={(state) => state.blog.limit} // Thay pageSizeSelector thành limit
                                        fetchDataAction={(page, size) => fetchBlog(searchTerm, page)} // Fetch dữ liệu với searchTerm và page
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Xóa bài viết thành công!" />
                </div>
            </div>
            <DialogConfirm
                open={open}
                onClose={handleClose}
                onConfirm={handleConfirm}
            />
        </div>
    );
}
