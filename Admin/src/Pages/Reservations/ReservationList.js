import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchReservations, deleteReservations, updateReservations, setCurrentPage } from '../../Actions/Reservations_t_AdminActions';
import { requestMomoPaymentBalance } from '../../Actions/PaymentActions';
import DialogConfirm from '../../Components/Dialog/Dialog';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import CustomSpinner from '../../Components/Spinner/CustomSpinner';
import { SuccessAlert } from '../../Components/Alert/Alert';
import { formatDateTime } from '../../Utils/FormatDateTime';

import { InputBase, Select, MenuItem, FormControl, InputLabel, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { getPermissions } from '../../Actions/GetQuyenHanAction';
import { jwtDecode as jwt_decode } from 'jwt-decode';

import DialogChangedishes from './DialogChangedishes'; // Popup hiển thị changedishes (tạo mới)
import http from "../../Utils/Http";

export default function ReservationList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

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

    const [recodeSearch, setrecodeSearch] = useState('');

    const handlerecodeSearch = (event) => {
        setrecodeSearch(event.target.value);
        dispatch(setCurrentPage(1));
    };

    const [nameSearch, setNameSearch] = useState('');

    const handleNameSearch = (event) => {
        setNameSearch(event.target.value);
        dispatch(setCurrentPage(1));
    };

    const [emailSearch, setEmailSearch] = useState('');

    const handleEmailSearch = (event) => {
        setEmailSearch(event.target.value);
        dispatch(setCurrentPage(1));
    };

    const [phoneSearch, setPhoneSearch] = useState('');

    const handlePhoneSearch = (event) => {
        setPhoneSearch(event.target.value);
        dispatch(setCurrentPage(1));
    };

    const [statusSearch, setStatusSearch] = useState('');

    const handleStatusSearch = (event) => {
        setStatusSearch(event.target.value);
        dispatch(setCurrentPage(1));
    };

    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const reservationState = useSelector(state => state.reservations_Admin);

    const query = new URLSearchParams(location.search);
    const urlPage = parseInt(query.get('page')) || 1;

    const [open, setOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    useEffect(() => {
        dispatch(fetchReservations(nameSearch , phoneSearch , emailSearch , statusSearch , recodeSearch , urlPage));
    }, [dispatch, urlPage, reservationState.pageSize, nameSearch, phoneSearch, emailSearch, statusSearch, recodeSearch]);

    useEffect(() => {
        navigate(`?page=${reservationState.currentPage}`);
    }, [reservationState.currentPage, navigate]);

    const handleClickOpen = (id) => {
        setSelectedReservation(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedReservation(null);
    };

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const handleDelete = async () => {
        if (selectedReservation) {
            try {
                await dispatch(deleteReservations(selectedReservation, nameSearch, phoneSearch, emailSearch, statusSearch, recodeSearch, urlPage, reservationState.pageSize));
                setActiveDropdown(null);
                handleClose();
                setOpenSuccess(true); // Hiển thị thông báo thành công
            } catch (error) {
                console.error("Error deleting reservations:", error);
            }
        }
    };

    const handleUpdateStatus = async (id, st) => {
        if (id) {
            try {
                await dispatch(updateReservations(id, {status: st}, nameSearch, phoneSearch, emailSearch, statusSearch, recodeSearch, urlPage));
                setActiveDropdown(null);
                handleClose();
                setOpenSuccess(true); // Hiển thị thông báo thành công

                // Gọi lại fetchReservations để lấy dữ liệu mới
                dispatch(fetchReservations(nameSearch, phoneSearch, emailSearch, statusSearch, recodeSearch, urlPage));
            } catch (error) {
                console.error("Error update reservations:", error);
            }
        }
    };

    const payBalance = async (reservationId, amount) => {
        const momoResponse = await dispatch(requestMomoPaymentBalance(reservationId, amount));
    
        if (momoResponse && momoResponse.payUrl) {
          window.location.href = momoResponse.payUrl;
        }
    }

    const [openChangedishesDialog, setOpenChangedishesDialog] = useState(false);
    const [selectedChangedishes, setSelectedChangedishes] = useState([]);
    const [selecteDeposit, setSelectedDeposit] = useState(0);
    const [selecteReservation_id, setSelectedReservation_id] = useState([]);

    const pheDuyet = (changedishes, deposit, reservation_id ) => {
        setSelectedChangedishes(changedishes);
        setSelectedReservation_id(reservation_id)
        setSelectedDeposit(deposit);
        setOpenChangedishesDialog(true);
    };

    const handleConfirmChangedishes = async () => { 
        try {
            // Gọi API trực tiếp
            const response = await http.post('http://localhost:3307/api/reservations_t_admin/changedishes', {
                selectedChangedishes,
                selecteReservation_id
            });
    
            // Xử lý phản hồi từ server (nếu cần)
            console.log("Response from server:", response.data);
    
            // Nếu bạn cần dispatch action sau khi gọi API
            dispatch(fetchReservations(nameSearch , phoneSearch , emailSearch , statusSearch , recodeSearch , urlPage));
    
            // Đóng dialog
            setOpenChangedishesDialog(false);
            setOpenSuccess(true);
        } catch (error) {
            alert('Thao tác không thành công');
        }
    };

    const handleReject = async () => {
        try {
            // Gọi API trực tiếp
            const response = await http.patch('http://localhost:3307/api/reservations_t_admin/notChange', {
                selecteReservation_id
            });
    
            // Nếu bạn cần dispatch action sau khi gọi API
            dispatch(fetchReservations(nameSearch , phoneSearch , emailSearch , statusSearch , recodeSearch , urlPage));
    
            // Đóng dialog
            setOpenChangedishesDialog(false)
            setOpenSuccess(true);
        } catch (error) {
            alert('Thao tác không thành công');
        }
    };

    const handleEdit = (id) => {
        navigate(`edit/${id}`);
    };

    const handleDetail = (id) => {
        navigate(`detail/${id}`);
    };

    const formatCurrency = (value) => {
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`;
    };

    const handlePageChange = (page) => {
        navigate(`?page=${page}`); // Cập nhật URL với page
        dispatch(setCurrentPage(page)); // Cập nhật trang hiện tại trong state
        dispatch(fetchReservations(nameSearch , phoneSearch , emailSearch , statusSearch , recodeSearch , page));
    };

    const statusMapping = {
        2: { text: 'Hết hạn thanh toán cọc', class: 'badge bg-secondary' },    
        1: { text: 'Chờ thanh toán cọc', class: 'badge bg-dark' },
        3: { text: 'Đã thanh toán cọc', class: 'badge bg-info' },     
        0: { text: 'Hủy đơn', class: 'badge bg-danger' },             
        4: { text: 'Đang lên món & Chờ thanh toán toàn bộ đơn', class: 'badge bg-primary' },
        5: { text: 'Hoàn thành đơn', class: 'badge bg-success' }       
    };
    
    return (
        <div className="container" style={{ overflow: 'visible' }}>
            <div className="page-inner">
                <div className="pt-2 pb-4 mb-2">
                    <div>
                        <h3 className="fw-bold mb-2">Quản lý đặt bàn</h3>
                        <form className="form-inline d-flex flex-wrap justify-content-between align-items-center">
                            <div className="d-flex flex-wrap align-items-center mb-2">
                                <input type="text" className="form-control mr-2" style={{ flex: '1 1 150px', height: '38px', minWidth: '120px' }} placeholder="Mã hóa đơn" aria-label="Email" value={recodeSearch} onChange={handlerecodeSearch} /> 
                                <input type="text" className="form-control mr-2" style={{ flex: '1 1 150px', height: '38px', minWidth: '120px' }} placeholder="Tên khách hàng" aria-label="Email" value={nameSearch} onChange={handleNameSearch} /> 
                                <input type="email" className="form-control mr-2" style={{ flex: '1 1 150px', height: '38px', minWidth: '120px' }} placeholder="Email" aria-label="Email" value={emailSearch} onChange={handleEmailSearch} /> 
                                <input type="text" className="form-control mr-2" style={{ flex: '1 1 150px', height: '38px', minWidth: '120px' }} placeholder="Phone" aria-label="Phone" value={phoneSearch} onChange={handlePhoneSearch} /> 
                                <select className="form-control mr-2" style={{ flex: '1 1 150px', height: '38px', minWidth: '120px' }} value={statusSearch} onChange={handleStatusSearch}>
                                    <option value="">Trạng thái</option>
                                    <option value="0">Đã hủy</option>
                                    <option value="1">Chờ thanh toán cọc</option>
                                    <option value="2">Hết hạn thanh toán cọc</option>
                                    <option value="3">Đã thanh toán cọc</option>
                                    <option value="4">Đang lên món & Chờ thanh toán toàn bộ đơn</option>
                                    <option value="5">Hoàn thành đơn</option>
                                </select>
                            </div>
                            {hasPermission('Thêm đặt bàn') && (
                                <Link to="add" className="btn btn-primary" style={{ height: '38px', borderRadius: '20px' }}>Thêm đặt bàn</Link>
                            )}
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-round">
                            <div className="card-header">
                                <div className="card-head-row card-tools-still-right">
                                    <div className="card-title">Danh sách</div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive text-center">
                                    <table className="table align-items-center mb-0">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>STT</th>
                                                <th style={{ textAlign: 'left' }}>Thông tin khách hàng</th>
                                                <th style={{ textAlign: 'left' }}>Thông tin đặt bàn</th>
                                                <th>Trạng thái</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reservationState.loading && (
                                                <tr>
                                                    <td colSpan="7"><CustomSpinner/></td>
                                                </tr>
                                            )}
                                            {!reservationState.loading && reservationState.allReservation.length === 0 && (
                                                <tr>
                                                    <td colSpan="7">Không tìm thấy danh sách nào!</td>
                                                </tr>
                                            )}
                                            {reservationState.allReservation && reservationState.allReservation.map((item, index) => {
                                                const stt = (reservationState.currentPage - 1) * reservationState.pageSize + index + 1;
                                                const statusInfo = statusMapping[item.status] || { text: 'Không xác định', class: 'badge-secondary' };
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{index + 1}</td>
                                                        <td style={{ textAlign: 'left' }}>
                                                            <span className="fw-semibold">Mã hóa đơn: </span>{item.reservation_code ? item.reservation_code : 'Chưa rõ'}<br />
                                                            <span className="fw-semibold">Ngày đặt: </span>{formatDateTime(item.reservation_date)}<br />
                                                            <span className="fw-semibold">Họ và tên: </span>{item.fullname}<br />
                                                            <span className="fw-semibold">Email: </span>{item.email}<br />
                                                            <span className="fw-semibold">Phone: </span>{item.tel}
                                                        </td>
                                                        <td style={{ textAlign: 'left' }}>
                                                            <span className="fw-semibold">Số bàn: </span>{(item.tableName && item.status !== 1 && item.status !== 2) ? item.tableName : 'Chưa có'}<br/>
                                                            <span className="fw-semibold">Số người: </span>{item.party_size}<br />
                                                            <span className="fw-semibold">Tổng tiền: </span>{formatCurrency(item.total_amount ? item.total_amount : 0)}<br />
                                                            <span className="fw-semibold">Số tiền cọc: </span>{item.deposit ? formatCurrency (item.deposit) : '0 VND'}<br/>
                                                            {/* <span className="fw-semibold">Số tiền còn lại: </span>{formatCurrency(item.status == 5 ? 0 : item.total_amount ? item.deposit ? item.total_amount - item.deposit : item.total_amount : 0)}<br/> */}
                                                            {item.total_amount >= item.deposit && (
                                                                <div>
                                                                    <span className="fw-semibold">Số tiền còn lại: </span>{formatCurrency(item.status == 5 ? 0 : item.total_amount ? item.deposit ? item.total_amount - item.deposit : item.total_amount : 0)}<br/>
                                                                </div>
                                                            )}
                                                            {item.total_amount < item.deposit && (
                                                                <span style={{ color: 'red' }}>
                                                                    <span className="fw-semibold">Số tiền phải thối: </span>{formatCurrency(item.deposit - item.total_amount)}<br/>
                                                                </span>
                                                            )}<br/>
                                                        </td>
                                                        <td>
                                                        <span className={`badge ${statusInfo.class}`}>
                                                            {statusInfo.text}
                                                        </span>
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <div className="text-align-center">
                                                                <div className="d-flex align-items-center justify-content-center">
                                                                {(hasPermission('Sửa đặt bàn') && (item.status == 1 || item.status == 3 || item.status == 4)) && (
                                                                    <button className="btn dropdown-toggle" type="button" onClick={() => toggleDropdown(index)} style={{ marginRight: '5px', backgroundColor: '#4c9fbc', color: '#fff', border: 'none' }}>
                                                                        Hành động
                                                                    </button>
                                                                )}
                                                                {(hasPermission('Sửa đặt bàn') && item.status != 5 && item.status != 0 && item.status != 2 && item.status != 1) && (
                                                                    <button onClick={() => handleEdit(item.id)} className="btn" style={{ backgroundColor: '#ff6b6b', color: '#fff', marginRight: '5px', border: 'none' }}>
                                                                        <i className="fas fa-edit mr-2"></i>
                                                                    </button>
                                                                )}
                                                                {hasPermission('Xem chi tiết đặt bàn') && (
                                                                    <button onClick={() => handleDetail(item.id)} className="btn" style={{ backgroundColor: '#ffcc5c', color: '#fff', border: 'none' , marginRight: '5px' }}>
                                                                        <i className="fas fa-eye mr-2"></i>
                                                                    </button>
                                                                )}
                                                                {(item.status == 4) && (item.deposit < item.total_amount) && (
                                                                    <button className="btn" style={{ backgroundColor: '#8cd790', color: '#fff', border: 'none' }} onClick={() => payBalance(item.id , item.deposit ? item.total_amount - item.deposit : item.total_amount)}>
                                                                        <i className="fas fa-credit-card"></i>
                                                                    </button>
                                                                )}
                                                                {(item.status == 3) && (item.number_change == 0) && (
                                                                    <button className="btn" style={{ backgroundColor: '#8cd790', color: '#fff', border: 'none' }} onClick={() => pheDuyet(item.changedishes, item.deposit, item.id)}>
                                                                        Duyệt
                                                                    </button>
                                                                )}
                                                                </div>
                                                                {activeDropdown === index && (
                                                                    <div className="dropdown-menu show" style={{ position: 'absolute', zIndex: 2, right: '5.9%' }}>
                                                                        {(item.status !== 3 && item.status !== 4 && item.status !== 1) && (
                                                                            <div>
                                                                                <button onClick={() => handleUpdateStatus(item.id , 1)} className="dropdown-item">
                                                                                    <i className="fas fa-times-circle mr-2" style={{ minWidth: '20px', textAlign: 'center' }}></i> Chờ thanh toán cọc
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        {(item.status !== 3 && item.status !== 4 && item.status !== 1) && (
                                                                            <div>
                                                                                <div className="dropdown-divider"></div>
                                                                                <button onClick={() => handleUpdateStatus(item.id , 3)} className="dropdown-item">
                                                                                    <i className="fas fa-check-circle mr-2" style={{ minWidth: '20px', textAlign: 'center' }}></i> Đã thanh toán cọc
                                                                                </button>
                                                                                <div className="dropdown-divider"></div>
                                                                            </div>
                                                                        )}
                                                                        {(item.status == 4 && item.status !== 1) && (
                                                                            <div>
                                                                                <button onClick={() => handleUpdateStatus(item.id , 5)} className="dropdown-item">
                                                                                    <i className="fas fa-check-circle mr-2" style={{ minWidth: '20px', textAlign: 'center' }}></i> Hoàn thành đơn
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        {(item.status == 3) && (
                                                                            <div>
                                                                                <button onClick={() => handleUpdateStatus(item.id , 0)} className="dropdown-item">
                                                                                    <i className="fas fa-ban mr-2" style={{ minWidth: '20px', textAlign: 'center' }}></i> Hủy đơn
                                                                                </button>
                                                                                <div className="dropdown-divider"></div>
                                                                            </div>
                                                                        )}
                                                                        {(item.status !== 4 && item.status !== 1) && (
                                                                            <div>
                                                                                <button onClick={() => handleUpdateStatus(item.id , 4)} className="dropdown-item">
                                                                                    <i className="fas fa-dollar-sign mr-2" style={{ minWidth: '20px', textAlign: 'center' }}></i> Đang lên món & Chờ thanh toán toàn bộ đơn
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        {(item.status !== 3 && item.status !== 4) && (
                                                                            <div>
                                                                                {/* <div className="dropdown-divider"></div> */}
                                                                                <button onClick={() => handleUpdateStatus(item.id , 2)} className="dropdown-item">
                                                                                    <i className="fas fa-ban mr-2" style={{ minWidth: '20px', textAlign: 'center' }}></i> Hết hạn thanh toán cọc
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
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
                                        count={reservationState.totalPages} // Tổng số trang
                                        onPageChange={handlePageChange}
                                        currentPageSelector={(state) => state.reservations_Admin.currentPage} // Selector để lấy trang hiện tại
                                        pageSizeSelector={(state) => state.reservations_Admin.limit} // Thay pageSizeSelector thành limit
                                        fetchDataAction={(page, size) => fetchReservations(nameSearch , phoneSearch , emailSearch , statusSearch , recodeSearch , page)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Thao tác thành công!" />
                </div>
            </div>
            <DialogConfirm open={open} onClose={handleClose} onConfirm={handleDelete} />
            <DialogChangedishes 
                open={openChangedishesDialog} 
                onReject={handleReject}
                onClose={() => setOpenChangedishesDialog(false)} 
                changedishes={selectedChangedishes} 
                deposit={selecteDeposit}
                onConfirm={handleConfirmChangedishes}  
            />
        </div>
    );
}