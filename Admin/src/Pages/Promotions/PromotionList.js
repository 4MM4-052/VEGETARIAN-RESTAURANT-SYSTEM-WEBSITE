import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchPromotion, deletePromotion, setCurrentPage } from '../../Actions/PromotionActions';
import DialogConfirm from '../../Components/Dialog/Dialog';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import CustomSpinner from '../../Components/Spinner/CustomSpinner';
import CheckboxSelection from '../../Components/CheckboxSelection';
import { SuccessAlert, DangerAlert } from '../../Components/Alert/Alert';
import { formatDateTime } from '../../Utils/FormatDateTime';

import { InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { getPermissions } from '../../Actions/GetQuyenHanAction';
import { jwtDecode as jwt_decode } from 'jwt-decode';

export default function PromotionList () {
    const dispatch = useDispatch();
    const promotionState = useSelector(state => state.promotion);
    const navigate = useNavigate();

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

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const urlPage = parseInt(query.get('page')) || 1;

    const [open, setOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchPromotion(searchTerm, urlPage, promotionState.pageSize));
    }, [dispatch, urlPage, promotionState.pageSize, searchTerm]);

    useEffect(() => {
        navigate(`?page=${promotionState.currentPage}`);
    }, [promotionState.currentPage, navigate]);

    const handleClickOpen = (promotion_id) => {
        setSelectedPromotion(promotion_id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPromotion(null);
    };

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const handleErrorClose = () => {
        setErrorMessage(false);
    };

    const handleConfirm = async () => {
        if (selectedPromotion) {
            try {
                await dispatch(deletePromotion(selectedPromotion, searchTerm, urlPage, promotionState.pageSize));
                handleClose();
                setOpenSuccess(true); // Hiển thị thông báo thành công
            } catch (error) {
                handleClose();
                setErrorMessage(true); // Hiển thị thông báo lỗi
            }
        }
    };

    const handleDeletePromotion = async (selectedProductIds) => {
        let i = true;
        for (let Id of selectedProductIds) {
            try {
                await dispatch(deletePromotion(Id, searchTerm, urlPage, promotionState.pageSize));
                i = true;
            } catch (error) {
                i = false;
            }
        }
        if (i == true) {
            setOpenSuccess(true);
        } else {
            setErrorMessage(true);
        }
    };

    const {
        selectedItems,
        handleSelectItem,
        handleSelectAll,
        handleDeleteSelected,
        allSelected
    } = CheckboxSelection(promotionState.promotion, handleDeletePromotion);

    const handleEdit = (id) => {
        navigate(`edit/${id}`);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        dispatch(setCurrentPage(1));
    };

    const handlePageChange = (page) => {
        navigate(`?page=${page}`); // Cập nhật URL với page
        dispatch(setCurrentPage(page)); // Cập nhật trang hiện tại trong state
        dispatch(fetchPromotion(searchTerm, page, promotionState.pageSize));
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                    <div>
                        <h3 className="fw-bold mb-3">Quản lý khuyến mãi</h3>
                        <h6 className="op-7 mb-2">Hương Sen Admin Dashboard</h6>
                    </div>
                    <div className="ms-md-auto py-2 py-md-0">
                        {hasPermission('Xóa mã khuyến mãi') && (
                            <button className="btn btn-danger btn-round me-2" onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
                                Xóa mục đã chọn
                            </button>
                        )}
                        {hasPermission('Thêm mã khuyến mãi') && (
                            <Link to="/promotions/add" className="btn btn-primary btn-round">Thêm khuyến mãi</Link>
                        )}
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
                                                placeholder="Tìm kiếm mã ở đây!"
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
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        checked={allSelected}
                                                        onChange={handleSelectAll}
                                                    />
                                                </th>
                                                <th scope="col">STT</th>
                                                <th scope="col">Mã khuyến mãi</th>
                                                <th scope="col">Phần trăm giảm</th>
                                                <th scope="col">Số lần</th>
                                                <th scope="col">Loại</th>
                                                <th scope="col">Ngày bắt đầu</th>
                                                <th scope="col">Ngày kết thúc</th>
                                                <th scope="col">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {promotionState.loading && (
                                                <tr>
                                                    <td colSpan="7"><CustomSpinner/></td>
                                                </tr>
                                            )}
                                            {!promotionState.loading && promotionState.allPromotions.length === 0 && (
                                                <tr>
                                                    <td colSpan="7">Không tìm thấy mã nào!</td>
                                                </tr>
                                            )}
                                            {promotionState.allPromotions && promotionState.allPromotions.map((item, index) => {
                                                const stt = (promotionState.currentPage - 1) * promotionState.pageSize + index + 1;
                                                return (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedItems.includes(item.id)}
                                                                onChange={() => handleSelectItem(item.id)}
                                                            />
                                                        </td>
                                                        <td>{index + 1}</td>
                                                        <td>{item.code_name}</td>
                                                        <td>
                                                            <span className="badge badge-success">{item.discount}%</span>
                                                        </td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.type == 0 ? 'Mã thường' : 'Mã đặt biệt'}</td>
                                                        <td>
                                                            {formatDateTime(item.valid_from)}
                                                        </td>
                                                        <td>
                                                            {formatDateTime(item.valid_to)}
                                                        </td>
                                                        <td>
                                                            <div className="btn-group mt-3" role="group">
                                                                {hasPermission('Sửa mã khuyến mãi') && (
                                                                    <button type="button" className="btn btn-outline-success" onClick={() => handleEdit(item.id)}>
                                                                        Sửa
                                                                    </button>
                                                                )}
                                                                {hasPermission('Xóa mã khuyến mãi') && (
                                                                    <button type="button" className="btn btn-outline-danger" onClick={() => handleClickOpen(item.id)}>
                                                                        Xóa
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='my-2'>
                                    <CustomPagination
                                        count={promotionState.totalPages} // Tổng số trang
                                        onPageChange={handlePageChange}
                                        currentPageSelector={(state) => state.promotion.currentPage} // Selector để lấy trang hiện tại
                                        pageSizeSelector={(state) => state.promotion.limit} // Thay pageSizeSelector thành limit
                                        fetchDataAction={(page, size) => fetchPromotion(searchTerm, page)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Xóa khuyến mãi thành công!" />
                    <DangerAlert open={errorMessage} onClose={handleErrorClose} message={'Xóa mã không thành công!'} /> {/* Hiển thị lỗi */}
                </div>
            </div>
            <DialogConfirm open={open} onClose={handleClose} onConfirm={handleConfirm} />
        </div>
    )
}