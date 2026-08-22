// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   fetchProductHoatDong,
//   deleteProduct,
//   updateStatus,
//   setCurrentPage,
// } from "../../Actions/ProductActions";
// import { fetchCategoryProductNoPage } from "../../Actions/CategoryProductNoPageActions";
// import DialogConfirm from "../../Components/Dialog/Dialog";
// import CustomPagination from "../../Components/Pagination/CustomPagination";
// import CustomSpinner from "../../Components/Spinner/CustomSpinner";
// import CheckboxSelection from "../../Components/CheckboxSelection";
// import { SuccessAlert } from "../../Components/Alert/Alert";

// import { getPermissions } from "../../Actions/GetQuyenHanAction";
// import { jwtDecode as jwt_decode } from "jwt-decode";

// export default function ProductList() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const token = localStorage.getItem("token");
//   const getQuyenHanState = useSelector((state) => state.getQuyenHan);
//   const permissions = getQuyenHanState.getQuyenHan || [];

//   useEffect(() => {
//     if (token) {
//       const decodedToken = jwt_decode(token);
//       const userIdFromToken = decodedToken.id;
//       dispatch(getPermissions(userIdFromToken));
//     }
//     const decodedToken = jwt_decode(token);
//     const userIdFromToken = decodedToken.id;
//     dispatch(getPermissions(userIdFromToken));
//   }, [navigate, dispatch, token]);

//   const hasPermission = (permissionName) => {
//     return (
//       permissions.data &&
//       permissions.data.some((permission) => permission.name == permissionName)
//     );
//   };

//   const productState = useSelector((state) => state.product);
//   const productCategoryState = useSelector((state) => state.productCategoryNoPage);

//   const query = new URLSearchParams(location.search);
//   const urlPage = parseInt(query.get("page")) || 1;

//   const [open, setOpen] = useState(false);
//   const [openSuccess, setOpenSuccess] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchCateID, setsearchCateID] = useState("");

//   useEffect(() => {
//     dispatch(
//       fetchProductHoatDong(
//         searchTerm,
//         searchCateID,
//         urlPage,
//         productState.pageSize
//       )
//     );
//     dispatch(fetchCategoryProductNoPage());
//   }, [dispatch, urlPage, productState.pageSize, searchTerm, searchCateID]);

//   useEffect(() => {
//     navigate(`?page=${productState.currentPage}`);
//     dispatch(fetchCategoryProductNoPage());
//   }, [productState.currentPage, navigate]);

//   const getCategoryName = (id) => {
//     const product_category = productCategoryState.product_category.find(
//       (cat) => cat.id == id
//     );
//     return product_category ? product_category.name : "Không xác định";
//   };

//   const handleClickOpen = (productId) => {
//     setSelectedProduct(productId);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedProduct(null);
//   };

//   const handleSuccessClose = () => {
//     setOpenSuccess(false);
//   };

//   const handleConfirm = async () => {
//     if (setSelectedProduct) {
//       try {
//         await dispatch(
//           updateStatus(
//             selectedProduct,
//             { status: 0 },
//             "list",
//             searchTerm,
//             searchCateID,
//             urlPage,
//             productState.pageSize
//           )
//         );
//         handleClose();
//         setOpenSuccess(true); // Hiển thị thông báo thành công
//       } catch (error) {
//         console.error("Error deleting product:", error);
//       }
//     }
//   };

//   const handleDeleteProducts = async (selectedProductIds) => {
//     for (let productId of selectedProductIds) {
//       await dispatch(
//         updateStatus(
//           productId,
//           { status: 0 },
//           "list",
//           searchTerm,
//           searchCateID,
//           urlPage,
//           productState.pageSize
//         )
//       );
//     }
//     setOpenSuccess(true); // Hiển thị thông báo thành công
//   };

//   const {
//     selectedItems,
//     handleSelectItem,
//     handleSelectAll,
//     handleDeleteSelected,
//     allSelected,
//   } = CheckboxSelection(productState.product, handleDeleteProducts);

//   const handleEdit = (id) => {
//     navigate(`edit/${id}`);
//   };

//   const formatCurrency = (value) => {
//     return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`;
//   };

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     dispatch(setCurrentPage(1));
//   };

//   const handleSearchCateID = (event) => {
//     setsearchCateID(event.target.value);
//     dispatch(setCurrentPage(1));
//   };

//   const handlePageChange = (page) => {
//     navigate(`?page=${page}`); // Cập nhật URL với page
//     dispatch(setCurrentPage(page)); // Cập nhật trang hiện tại trong state
//     dispatch(
//       fetchProductHoatDong(
//         searchTerm,
//         searchCateID,
//         page,
//         productState.pageSize
//       )
//     );
//   };

//   return (
//     <div className="container">
//       <div className="page-inner">
//         <div className="pt-2 pb-4">
//           <div className="mb-3">
//             <h3 className="fw-bold mb-3">Quản lý sản phẩm</h3>
//           </div>

//           <div className="d-flex flex-wrap justify-content-between align-items-center">
//             <div className="d-flex align-items-center">
//               <input
//                 type="text"
//                 className="form-control me-2"
//                 style={{ height: "38px", minWidth: "150px" }}
//                 placeholder="Tên"
//                 aria-label="Tên"
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//               <select
//                 className="form-control"
//                 style={{ height: "38px", minWidth: "150px" }}
//                 value={searchCateID}
//                 onChange={handleSearchCateID}
//               >
//                 <option value="">Danh mục</option>
//                 {productCategoryState &&
//                   productCategoryState.product_category.map((item, index) => (
//                     <option key={index} value={item.id}>
//                       {item.name}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             <div className="d-flex align-items-center flex-wrap">
//               {hasPermission("Xóa sản phẩm") && (
//                 <button
//                   className="btn btn-danger btn-round me-2 mb-2 mb-md-0"
//                   onClick={handleDeleteSelected}
//                   disabled={selectedItems.length === 0}
//                   style={{ height: "38px" }}
//                 >
//                   Xóa mục đã chọn
//                 </button>
//               )}
//               {hasPermission("Khôi phục sản phẩm") && (
//                 <Link
//                   to="/product/tam_xoa"
//                   className="btn btn-info btn-round me-2 mb-2 mb-md-0"
//                   style={{ height: "38px" }}
//                 >
//                   Sản phẩm tạm xóa
//                 </Link>
//               )}
//               {hasPermission("Thêm sản phẩm") && (
//                 <Link
//                   to="/product/add"
//                   className="btn btn-primary btn-round"
//                   style={{ height: "38px" }}
//                 >
//                   Thêm sản phẩm
//                 </Link>
//               )}
//               <DialogConfirm />
//             </div>
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-md-12">
//             <div className="card card-round">
//               <div className="card-header">
//                 <div className="card-head-row card-tools-still-right">
//                   <div className="card-title">Danh sách</div>
//                 </div>
//               </div>
//               <div className="card-body p-0">
//                 <div className="table-responsive text-center">
//                   <table className="table align-items-center mb-0">
//                     <thead className="thead-light">
//                       <tr>
//                         <th>
//                           <input
//                             type="checkbox"
//                             checked={allSelected}
//                             onChange={handleSelectAll}
//                           />
//                         </th>
//                         <th scope="col">STT</th>
//                         <th style={{ width: "10%" }} scope="col">
//                           Hình ảnh
//                         </th>
//                         <th scope="col">Tên sản phẩm</th>
//                         <th scope="col">Danh mục</th>
//                         <th scope="col">Trạng thái</th>
//                         <th scope="col">Giá</th>
//                         <th scope="col">Thao tác</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {productState.loading && (
//                         <tr>
//                           <td colSpan="7">
//                             <CustomSpinner />
//                           </td>
//                         </tr>
//                       )}
//                       {!productState.loading &&
//                         productState.allProducts.length === 0 && (
//                           <tr>
//                             <td colSpan="7">Không tìm thấy sản phẩm nào!</td>
//                           </tr>
//                         )}
//                       {productState.allProducts &&
//                         productState.allProducts.map((item, index) => {
//                           return (
//                             <tr key={item.id}>
//                               <td>
//                                 <input
//                                   type="checkbox"
//                                   checked={selectedItems.includes(item.id)}
//                                   onChange={() => handleSelectItem(item.id)}
//                                 />
//                               </td>
//                               <td>{index + 1}</td>
//                               <td>
//                                 <img
//                                   className="img-fluid rounded w-100"
//                                   src={
//                                     item.image || "../Assets/Images/default.jpg"
//                                   }
//                                   alt="Image"
//                                 />
//                               </td>
//                               <td>{item.name}</td>
//                               <td>{hasPermission("Xem danh mục sản phẩm") ? getCategoryName(item.categories_id) : 'Không có quyền xem!'}</td>
//                               <td>
//                                 {item.status === 1 ? (
//                                   <span className="badge badge-success">
//                                     Hoạt động
//                                   </span>
//                                 ) : (
//                                   <span className="badge badge-danger">
//                                     Ngừng kinh doanh
//                                   </span>
//                                 )}
//                               </td>
//                               <td>
//                                 {item.sale_price > 0 ? (
//                                   <div>
//                                     <span className="text-danger text-decoration-line-through">
//                                       {formatCurrency(item.price)}
//                                     </span>
//                                     <div>
//                                       {formatCurrency(
//                                         item.price - item.sale_price
//                                       )}
//                                     </div>
//                                   </div>
//                                 ) : (
//                                   <div>{formatCurrency(item.price)}</div>
//                                 )}
//                               </td>
//                               <td>
//                                 <div className="btn-group" role="group">
//                                   {hasPermission("Sửa sản phẩm") && (
//                                     <button
//                                       type="button"
//                                       className="btn btn-outline-success"
//                                       onClick={() => handleEdit(item.id)}
//                                     >
//                                       Sửa
//                                     </button>
//                                   )}
//                                   {hasPermission("Xóa sản phẩm") && (
//                                     <button
//                                       type="button"
//                                       className="btn btn-outline-danger"
//                                       onClick={() => handleClickOpen(item.id)}
//                                     >
//                                       Xóa
//                                     </button>
//                                   )}
//                                 </div>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="my-2">
//                   <CustomPagination
//                     count={productState.totalPages} // Tổng số trang
//                     onPageChange={handlePageChange} // Hàm chuyển trang
//                     currentPageSelector={(state) => state.product.currentPage} // Selector để lấy trang hiện tại
//                     pageSizeSelector={(state) => state.product.limit} // Lấy limit thay vì pageSize
//                     fetchDataAction={(page) =>
//                       fetchProductHoatDong(searchTerm, searchCateID, page)
//                     } // Hàm fetch dữ liệu chỉ truyền page (limit đã lấy từ state)
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <SuccessAlert
//             open={openSuccess}
//             onClose={handleSuccessClose}
//             message="Xóa sản phẩm thành công!"
//           />
//         </div>
//       </div>
//       <DialogConfirm
//         open={open}
//         onClose={handleClose}
//         onConfirm={handleConfirm}
//       />
//     </div>
//   );
// }







import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  fetchProductHoatDong,
  deleteProduct,
  updateStatus,
  setCurrentPage,
} from "../../Actions/ProductActions";
import { fetchCategoryProductNoPage } from "../../Actions/CategoryProductNoPageActions";
import DialogConfirm from "../../Components/Dialog/Dialog";
import CustomPagination from "../../Components/Pagination/CustomPagination";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";
import CheckboxSelection from "../../Components/CheckboxSelection";
import { SuccessAlert } from "../../Components/Alert/Alert";

import { getPermissions } from "../../Actions/GetQuyenHanAction";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function ProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const getQuyenHanState = useSelector((state) => state.getQuyenHan);
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
    return (
      permissions.data &&
      permissions.data.some((permission) => permission.name == permissionName)
    );
  };

  const productState = useSelector((state) => state.product);
  const productCategoryState = useSelector((state) => state.productCategoryNoPage);

  const query = new URLSearchParams(location.search);
  const urlPage = parseInt(query.get("page")) || 1;

  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCateID, setsearchCateID] = useState("");

  useEffect(() => {
    dispatch(
      fetchProductHoatDong(
        searchTerm,
        searchCateID,
        urlPage,
        productState.pageSize
      )
    );
    dispatch(fetchCategoryProductNoPage());
  }, [dispatch, urlPage, productState.pageSize, searchTerm, searchCateID]);

  useEffect(() => {
    navigate(`?page=${productState.currentPage}`);
    dispatch(fetchCategoryProductNoPage());
  }, [productState.currentPage, navigate]);

  const getCategoryName = (id) => {
    const product_category = productCategoryState.product_category.find(
      (cat) => cat.id == id
    );
    return product_category ? product_category.name : "Không xác định";
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
        await dispatch(
          updateStatus(
            selectedProduct,
            { status: 0 },
            "list",
            searchTerm,
            searchCateID,
            urlPage,
            productState.pageSize
          )
        );
        handleClose();
        setOpenSuccess(true); // Hiển thị thông báo thành công
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleDeleteProducts = async (selectedProductIds) => {
    for (let productId of selectedProductIds) {
      await dispatch(
        updateStatus(
          productId,
          { status: 0 },
          "list",
          searchTerm,
          searchCateID,
          urlPage,
          productState.pageSize
        )
      );
    }
    setOpenSuccess(true); // Hiển thị thông báo thành công
  };

  const {
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    handleDeleteSelected,
    allSelected,
  } = CheckboxSelection(productState.product, handleDeleteProducts);

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
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
    dispatch(
      fetchProductHoatDong(
        searchTerm,
        searchCateID,
        page,
        productState.pageSize
      )
    );
  };

  return (
    <div className="container">
      <div className="page-inner">
        <div className="pt-2 pb-4">
          <div className="mb-3">
            <h3 className="fw-bold mb-3">Quản lý sản phẩm</h3>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control me-2"
                style={{ height: "38px", minWidth: "150px" }}
                placeholder="Tên"
                aria-label="Tên"
                value={searchTerm}
                onChange={handleSearch}
              />
              <select
                className="form-control"
                style={{ height: "38px", minWidth: "150px" }}
                value={searchCateID}
                onChange={handleSearchCateID}
              >
                <option value="">Danh mục</option>
                {productCategoryState &&
                  productCategoryState.product_category.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="d-flex align-items-center flex-wrap">
              {hasPermission("Xóa sản phẩm") && (
                <button
                  className="btn btn-danger btn-round me-2 mb-2 mb-md-0"
                  onClick={handleDeleteSelected}
                  disabled={selectedItems.length === 0}
                  style={{ height: "38px" }}
                >
                  Xóa mục đã chọn
                </button>
              )}
              {hasPermission("Khôi phục sản phẩm") && (
                <Link
                  to="/product/tam_xoa"
                  className="btn btn-info btn-round me-2 mb-2 mb-md-0"
                  style={{ height: "38px" }}
                >
                  Sản phẩm tạm xóa
                </Link>
              )}
              {hasPermission("Thêm sản phẩm") && (
                <Link
                  to="/product/add"
                  className="btn btn-primary btn-round"
                  style={{ height: "38px" }}
                >
                  Thêm sản phẩm
                </Link>
              )}
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
                        <th style={{ width: "10%" }} scope="col">
                          Hình ảnh
                        </th>
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
                          <td colSpan="7">
                            <CustomSpinner />
                          </td>
                        </tr>
                      )}
                      {!productState.loading &&
                        productState.allProducts.length === 0 && (
                          <tr>
                            <td colSpan="7">Không tìm thấy sản phẩm nào!</td>
                          </tr>
                        )}
                      {productState.allProducts &&
                        productState.allProducts.map((item, index) => {
                          if (!item || !item.id) return null;
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
                                <img
                                  className="img-fluid rounded w-100"
                                  src={
                                    item.image || "../Assets/Images/default.jpg"
                                  }
                                  alt="Image"
                                />
                              </td>
                              <td>{item.name}</td>
                              <td>{hasPermission("Xem danh mục sản phẩm") ? getCategoryName(item.categories_id) : 'Không có quyền xem!'}</td>
                              <td>
                                {item.status === 1 ? (
                                  <span className="badge badge-success">
                                    Hoạt động
                                  </span>
                                ) : (
                                  <span className="badge badge-danger">
                                    Ngừng kinh doanh
                                  </span>
                                )}
                              </td>
                              <td>
                                {item.sale_price > 0 ? (
                                  <div>
                                    <span className="text-danger text-decoration-line-through">
                                      {formatCurrency(item.price)}
                                    </span>
                                    <div>
                                      {formatCurrency(
                                        item.price - item.sale_price
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div>{formatCurrency(item.price)}</div>
                                )}
                              </td>
                              <td>
                                <div className="btn-group" role="group">
                                  {hasPermission("Sửa sản phẩm") && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-success"
                                      onClick={() => handleEdit(item.id)}
                                    >
                                      Sửa
                                    </button>
                                  )}
                                  {hasPermission("Xóa sản phẩm") && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger"
                                      onClick={() => handleClickOpen(item.id)}
                                    >
                                      Xóa
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="my-2">
                  <CustomPagination
                    count={productState.totalPages} // Tổng số trang
                    onPageChange={handlePageChange} // Hàm chuyển trang
                    currentPageSelector={(state) => state.product.currentPage} // Selector để lấy trang hiện tại
                    pageSizeSelector={(state) => state.product.limit} // Lấy limit thay vì pageSize
                    fetchDataAction={(page) =>
                      fetchProductHoatDong(searchTerm, searchCateID, page)
                    } // Hàm fetch dữ liệu chỉ truyền page (limit đã lấy từ state)
                  />
                </div>
              </div>
            </div>
          </div>
          <SuccessAlert
            open={openSuccess}
            onClose={handleSuccessClose}
            message="Xóa sản phẩm thành công!"
          />
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
