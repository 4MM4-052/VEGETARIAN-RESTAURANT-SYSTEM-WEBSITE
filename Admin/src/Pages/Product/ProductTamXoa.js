import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchProductNgungHoatDong, updateStatus, setCurrentPage } from '../../Actions/ProductActions';
import { fetchProductCategory } from '../../Actions/ProductCategoryActions';
import DialogConfirm from '../../Components/Dialog/DialogKhoiPhuc';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import CustomSpinner from '../../Components/Spinner/CustomSpinner';
import CheckboxSelection from '../../Components/CheckboxSelection';
import { SuccessAlert } from '../../Components/Alert/Alert';

import { InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function ProductTamXoa () {
    const dispatch = useDispatch();
    const productState = useSelector(state => state.product);
    const productCategoryState = useSelector(state => state.product_category);
    const navigate = useNavigate();

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const urlPage = parseInt(query.get('page')) || 1;

    const [open, setOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchCateID, setsearchCateID] = useState("");

    const handleStatusProducts = async (selectedProductIds) => {
        for (let productId of selectedProductIds) {
            await dispatch(updateStatus(productId, {status: 1}, 'tam_xoa', searchTerm, searchCateID, urlPage, productState.pageSize));
        }
        setOpenSuccess(true); // Hiển thị thông báo thành công
    };

    const {
        selectedItems,
        handleSelectItem,
        handleSelectAll,
        handleDeleteSelected,
        allSelected
    } = CheckboxSelection(productState.product, handleStatusProducts);

    useEffect(() => {
        dispatch(fetchProductNgungHoatDong(searchTerm, searchCateID, urlPage, productState.pageSize));
        dispatch(fetchProductCategory());
    }, [dispatch, urlPage, productState.pageSize, searchTerm, searchCateID]);

    useEffect(() => {
        navigate(`?page=${productState.currentPage}`);
        dispatch(fetchProductCategory());
    }, [productState.currentPage, navigate]);

    const getCategoryName = (id) => {
        const product_category = productCategoryState.product_category.find(cat => cat.id === id);
        return product_category ? product_category.name : 'Không xác định';
    };

    const handleClickOpen = (productId) => {
        setSelectedProduct(productId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedProduct(null);
    };

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const handleConfirm = async () => {
        if (setSelectedProduct) {
            try {
                dispatch(updateStatus(selectedProduct, {status: 1}, 'tam_xoa', searchTerm, searchCateID, urlPage, productState.pageSize));
                handleClose();
                setOpenSuccess(true); // Hiển thị thông báo thành công
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const formatCurrency = (value) => {
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`;
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        dispatch(setCurrentPage(1));
    };

    const handleSearchCateID = (event) => {
        setsearchCateID(event.target.value);
        dispatch(setCurrentPage(1));
    };

    const handlePageChange = (page) => {
        navigate(`?page=${page}`); // Cập nhật URL với page
        dispatch(setCurrentPage(page)); // Cập nhật trang hiện tại trong state
        dispatch(fetchProductNgungHoatDong(searchTerm, searchCateID, page, productState.pageSize));
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="pt-2 pb-4">
                    <div className="mb-3">
                        <h3 className="fw-bold mb-3">Sản phẩm tạm xóa</h3>
                    </div>

                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <input
                                type="text"
                                className="form-control me-2"
                                style={{ height: '38px', minWidth: '150px' }}
                                placeholder="Tên"
                                aria-label="Tên"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <select
                                className="form-control"
                                style={{ height: '38px', minWidth: '150px' }}
                                value={searchCateID}
                                onChange={handleSearchCateID}
                            >
                                <option value="">Danh mục</option>
                                {productCategoryState && productCategoryState.product_category.map((item, index) => (
                                <option key={index} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="d-flex align-items-center flex-wrap">
                            <button className="btn btn-danger btn-round me-2" onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
                                Khôi phục mục đã chọn
                            </button>
                            <DialogConfirm />
                        </div>
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
                                                placeholder="Tìm sản phẩm ở đây!"
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
                                                <th style={{ width: '10%' }} scope="col">Hình ảnh</th>
                                                <th scope="col">Tên sản phẩm</th>
                                                <th scope="col">Danh mục</th>
                                                <th scope="col">Trạng thái</th>
                                                <th scope="col">Giá</th>
                                                <th scope="col">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productState.loading && (
                                                <tr>
                                                    <td colSpan="7"><CustomSpinner/></td>
                                                </tr>
                                            )}
                                            {!productState.loading && productState.product.length === 0 && (
                                                <tr>
                                                    <td colSpan="7">Không tìm thấy sản phẩm nào!</td>
                                                </tr>
                                            )}
                                            {productState.allProducts && productState.allProducts.map((item, index) => {
                                                const stt = (productState.currentPage - 1) * productState.pageSize + index + 1;
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
                                                        <td>
                                                            <img className="img-fluid rounded w-100" src={item.image || '../Assets/Images/default.jpg'} alt="Image"/>
                                                        </td>
                                                        <td>{item.name}</td>
                                                        <td>{getCategoryName(item.categories_id)}</td>
                                                        <td>
                                                            {
                                                                item.status === 1 ? <span className="badge badge-success">Hoạt động</span> : <span className="badge badge-danger">Ngừng kinh doanh</span>
                                                            }
                                                        </td>
                                                        <td>
                                                            {item.sale_price > 0 ? (
                                                                <div>
                                                                    <span className="text-danger text-decoration-line-through">{formatCurrency(item.price)}</span>
                                                                    <div>{formatCurrency(item.price - item.sale_price)}</div>
                                                                </div>
                                                            ) : (
                                                                <div>{formatCurrency(item.price)}</div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="btn-group" role="group">
                                                                <button type="button" className="btn btn-outline-success" onClick={() => handleClickOpen(item.id)}>
                                                                    Khôi phục
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='my-2'>
                                    {/* <CustomPagination
                                        count={productState.totalPages} // Tổng số trang
                                        currentPageSelector={state => state.product.currentPage} // Selector để lấy trang hiện tại
                                        fetchAction={(page, pageSize) => fetchProductNgungHoatDong(searchTerm, searchCateID, page, pageSize)} // Hàm fetch dữ liệu
                                        onPageChange={handlePageChange} 
                                    /> */}
                                    <CustomPagination
                                        count={productState.totalPages} // Tổng số trang
                                        onPageChange={handlePageChange}
                                        currentPageSelector={(state) => state.product.currentPage} // Selector để lấy trang hiện tại
                                        pageSizeSelector={(state) => state.product.limit} // Thay pageSizeSelector thành limit
                                        fetchDataAction={(page, size) => fetchProductNgungHoatDong(searchTerm, searchCateID, page)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Khôi phục sản phẩm thành công!" />
                </div>
            </div>
            <DialogConfirm open={open} onClose={handleClose} onConfirm={handleConfirm} />
        </div>
    )
}