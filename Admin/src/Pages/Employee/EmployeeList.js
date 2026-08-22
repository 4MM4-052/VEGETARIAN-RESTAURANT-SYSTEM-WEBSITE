import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    deleteEmployee,
    fetchEmployees,
    setCurrentPage,
} from "../../Actions/EmployeeActions";
import DialogConfirm from "../../Components/Dialog/Dialog";
import { fetchRole } from "../../Actions/RoleActions";
import CustomSpinner from '../../Components/Spinner/CustomSpinner';
import CustomPagination from "../../Components/Pagination/CustomPagination";

import { InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from "lodash.debounce";

export default function EmployeeList() {
    const dispatch = useDispatch();
    const employeeState = useSelector((state) => state.employee);
    const roleState = useSelector((state) => state.role);

    const navigate = useNavigate();

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const urlPage = parseInt(query.get('page')) || 1;

    const [open, setOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State cho thanh tìm kiếm

    // Debounce hàm tìm kiếm để giảm số lần gọi API
    const debouncedSearch = useMemo(() => debounce((term) => {
        dispatch(fetchEmployees(term, urlPage, employeeState.pageSize));
        dispatch(setCurrentPage(1));
    }, 1000), [dispatch, urlPage, employeeState.pageSize]);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    useEffect(() => {
        if (!searchTerm) {
            dispatch(fetchEmployees('', urlPage, employeeState.pageSize));
        }
    }, [dispatch, urlPage, employeeState.pageSize]);

    useEffect(() => {
        if (searchTerm) {
            debouncedSearch(searchTerm);
        }
    }, [searchTerm]);

    // Cập nhật URL khi currentPage thay đổi
    useEffect(() => {
        navigate(`?page=${employeeState.currentPage}`);
    }, [employeeState.currentPage, navigate]);

    const getRoleName = (id) => {
        const role = roleState.role.find((rol) => rol.id === id);
        return role ? role.name : "Không xác định";
    };

    const handleClickOpen = (employeeId) => {
        setSelectedEmployee(employeeId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEmployee(null);
    };

    const handleConfirm = () => {
        if (selectedEmployee) {
            dispatch(deleteEmployee(selectedEmployee));
            handleClose();
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
        dispatch(fetchEmployees(searchTerm, page, employeeState.pageSize));
        dispatch(fetchRole());
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                    <div>
                        <h3 className="fw-bold mb-3">Quản lý nhân viên</h3>
                        <h6 className="op-7 mb-2">Hương Sen Admin Dashboard</h6>
                    </div>
                    <div className="ms-md-auto py-2 py-md-0">
                        <Link to="/employee/add" className="btn btn-primary btn-round">
                            Thêm nhân viên
                        </Link>
                        <DialogConfirm />
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
                                                <th className="w-10" scope="col">
                                                    Ảnh đại diện
                                                </th>
                                                <th scope="col">Họ và tên</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Sdt</th>
                                                <th scope="col">Vai trò</th>
                                                <th scope="col">Trạng thái</th>
                                                <th scope="col">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employeeState.loading && (
                                                <tr>
                                                    <td colSpan="9"><CustomSpinner /></td>
                                                </tr>
                                            )}
                                            {!employeeState.loading &&
                                                employeeState.employee.length === 0 && (
                                                    <tr>
                                                        <td colSpan="9">No employees found.</td>
                                                    </tr>
                                                )}
                                            {employeeState.employee &&
                                                employeeState.employee.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img
                                                                className="img-fluid rounded"
                                                                src={
                                                                    item.avatar || "../Assets/Images/default.jpg"
                                                                }
                                                                alt="Avatar"
                                                                width={70}
                                                            />
                                                        </td>
                                                        <td>{item.fullname}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.tel}</td>
                                                        <td>{getRoleName(item.role_id)}</td>
                                                        <td>
                                                            <span
                                                                className="badge"
                                                                style={{
                                                                    backgroundColor:
                                                                        item.status === 1 ? "green" : "red",
                                                                    color: "white",

                                                                }}
                                                            >
                                                                {item.status === 1
                                                                    ? "Đang làm việc"
                                                                    : "Nghỉ việc"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="btn-group mt-3" role="group">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-success"
                                                                    onClick={() => handleEdit(item.id)}
                                                                >
                                                                    Sửa
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger"
                                                                    onClick={() => handleClickOpen(item.id)}
                                                                >
                                                                    <span className="text-danger">Xóa</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="my-2">
                                    <CustomPagination
                                        count={employeeState.totalPages} // Tổng số trang
                                        currentPageSelector={state => state.employee.currentPage} // Selector để lấy trang hiện tại
                                        fetchAction={(page, pageSize) => fetchEmployees(searchTerm, page, pageSize)} // Hàm fetch dữ liệu
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
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
