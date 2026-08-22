import React, { useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';

import { deleteCustomer, fetchCustomer, setCurrentPage } from '../../Actions/CustomerActions';
import DialogConfirm from '../../Components/Dialog/Dialog';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import CustomSpinner from '../../Components/Spinner/CustomSpinner';
import { SuccessAlert } from '../../Components/Alert/Alert';

export default function CustomerList() {
    const dispatch = useDispatch();
    const customerState = useSelector(state => state.customer);


    const navigate = useNavigate();

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const urlPage = parseInt(query.get('page')) || 1;

    const [open, setOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce hàm tìm kiếm để giảm số lần gọi API
    const debouncedSearch = useMemo(() => debounce((term) => {
        dispatch(fetchCustomer(term, urlPage, customerState.pageSize));
        dispatch(setCurrentPage(1));
    }, 1000), [dispatch, urlPage, customerState.pageSize]);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    useEffect(() => {
        if (!searchTerm) {
            dispatch(fetchCustomer('', urlPage, customerState.pageSize));
        }
    }, [dispatch, urlPage, customerState.pageSize]);

    useEffect(() => {
        if (searchTerm) {
            debouncedSearch(searchTerm);
        }
    }, [searchTerm]);

    useEffect(() => {
        navigate(`?page=${customerState.currentPage}`);
    }, [customerState.currentPage, navigate]);

    const handleClickOpen = (customerId) => {
        setSelectedCustomer(customerId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCustomer(null);
    };

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };


    const handleConfirm = async () => {
        if (selectedCustomer) {
            try {
                await dispatch(deleteCustomer(selectedCustomer));
                handleClose();
                setOpenSuccess(true); // Hiển thị thông báo thành công
            } catch (error) {
                console.error("Error deleting customer:", error);
            }
        }
    };


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event.target.value);
    };

    const handleEdit = (id) => {
        navigate(`edit/${id}`);
    };

    //* Hàm để chuyển trang và render dữ liệu đến trang hiện tại
    const handlePageChange = (page) => {
        navigate(`?page=${page}`); // Cập nhật URL với page
        dispatch(setCurrentPage(page)); // Cập nhật trang hiện tại trong state
        dispatch(fetchCustomer(searchTerm, page, customerState.pageSize));
    };


    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                    <div>
                        <h3 className="fw-bold mb-3">Quản lý khách hàng</h3>
                        <h6 className="op-7 mb-2">Hương Sen Admin Dashboard</h6>
                    </div>
                    <div className="ms-md-auto py-2 py-md-0">
                        <Link to="/customer/add" className="btn btn-primary btn-round">Thêm khách hàng</Link>
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
                                                placeholder="Tìm kiếm tài khoản ở đây!"
                                                inputProps={{ 'aria-label': 'search' }}
                                                value={searchTerm}
                                                onChange={handleSearch} // Thêm xử lý thay đổi từ khóa tìm kiếm
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
                                                <th scope="col">STT</th>
                                                <th className='w-10' scope="col">Ảnh đại diện</th>
                                                <th scope="col">Tên</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Sđt</th>
                                                <th scope="col">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customerState.loading && (
                                                <tr>
                                                    <td colSpan="7"><CustomSpinner /></td>
                                                </tr>
                                            )}
                                            {!customerState.loading && customerState.customer.length === 0 && (
                                                <tr>
                                                    <td colSpan="7">Không tìm thấy tài khoản</td>
                                                </tr>
                                            )}
                                            {customerState.customer && customerState.customer.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(customerState.currentPage - 1) * customerState.pageSize + index + 1}</td>
                                                    <td>
                                                        <img className="img-fluid rounded" src={item.avatar || '../Assets/Images/default.jpg'} alt="Avatar" width={70} />
                                                    </td>
                                                    <td>{item.fullname}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.tel}</td>
                                                    <td>
                                                        <div className="btn-group mt-3" role="group">
                                                            <button type="button" className="btn btn-outline-success" onClick={() => handleEdit(item.id)}>Sửa</button>
                                                            <button type="button" className="btn btn-outline-danger" onClick={() => handleClickOpen(item.id)}>
                                                                <span className='text-danger'>Xóa</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='my-2'>
                                    <CustomPagination
                                        count={customerState.totalPages} // Tổng số trang
                                        currentPageSelector={state => state.customer.currentPage} // Selector để lấy trang hiện tại
                                        fetchAction={(page, pageSize) => fetchCustomer(searchTerm, page, pageSize)} // Hàm fetch dữ liệu
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Xóa tài khoản thành công!" />
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
