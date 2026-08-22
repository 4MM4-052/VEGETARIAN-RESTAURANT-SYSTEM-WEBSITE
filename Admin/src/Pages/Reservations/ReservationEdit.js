import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchProductHoatDongReser } from "../../Actions/ProductActions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductCategoryHoatDong } from "../../Actions/ProductCategoryActions";
import CustomPagination from "../../Components/Pagination/CustomPagination";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";
import { fetchReservationdetail } from "../../Actions/GetReservationDetailAction";
import {
  updateReservationOrder,
  fetchReservations,
  deleteReservationDetail,
  fetchReservationsID,
} from "../../Actions/Reservations_t_AdminActions";
import { SuccessAlert, DangerAlert } from "../../Components/Alert/Alert";
import { useForm } from "react-hook-form";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { formatCurrency } from "../../Utils/FormatCurrency";
import { formatDateTime } from "../../Utils/FormatDateTime";

export default function ReservationUpdate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const reservationId = Number(id);

  const productState = useSelector((state) => state.product);
  const productCategoryState = useSelector((state) => state.product_category);
  const reservationDetailState = useSelector(
    (state) => state.reservations_Detail_Admin
  );
  const reservationState = useSelector((state) => state.reservations_Admin);

  const [activeTab, setActiveTab] = useState("category-info");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const query = new URLSearchParams(location.search);
  const urlPage = parseInt(query.get("page")) || 1;
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSuccessClose = () => setOpenSuccess(false);
  const handleErrorClose = () => setOpenError(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      tel: "",
      reservation_date: "", // Đặt cọc mặc định là 0, sẽ tính toán sau
      partySize: 1,
      notes: "",
      totalAmount: 0,
      status: 2,
      deposit: 0,
    },
  });

  const customerInfo = watch();

  useEffect(() => {
    dispatch(fetchReservationsID(id));
    dispatch(
      fetchProductHoatDongReser(searchTerm, urlPage, productState.pageSize)
    );
    dispatch(fetchProductCategoryHoatDong());
    if (reservationId) dispatch(fetchReservationdetail(reservationId));
  }, [dispatch, reservationId, searchTerm, urlPage, productState.pageSize]);

  useEffect(() => {
    if (reservationState.reservation) {
      const reservation = reservationState.reservation.find(
        (cust) => cust.id === reservationId
      );
      if (reservation) {
        setValue("fullname", reservation.fullname || "");
        setValue("email", reservation.email || "");
        setValue("tel", reservation.tel || "");
        setValue("deposit", reservation.deposit || 0); // Đặt cọc
        setValue("discount", reservation.discount || 0);

        // Chuyển đổi reservation_date sang giờ Việt Nam
        const reservationDate = reservation.reservation_date
          ? new Date(reservation.reservation_date)
          : null;

        if (reservationDate) {
          // Đặt múi giờ cho giờ Việt Nam
          const options = {
            timeZone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          };
          const formattedDate = reservationDate
            .toLocaleString("sv-SE", options)
            .replace(" ", "T");
          setValue("reservation_date", formattedDate);
        } else {
          setValue("reservation_date", "");
        }
        setValue("deposit", reservation.deposit || 0);
        setValue("party_size", reservation.party_size);
        setValue("note", reservation.note || "");
        setValue("totalAmount", reservation.totalAmount || 0);
        setValue("status", reservation.status || 2);
      }
    }
  }, [reservationState.reservation, setValue, reservationId]);

  const calculateTotalAmount = () => {
    if (!reservationState) {
      console.warn("Reservation state is not ready");
      return 0;
    }

    const selectedProducts = Object.entries(quantities).map(
      ([id, quantity]) => {
        const product = productState.product.find((p) => p.id === parseInt(id));
        const price =
          product && product.sale_price ? product.sale_price : product?.price;
        return product && quantity > 0 ? price * quantity : 0;
      }
    );

    const totalSelected = selectedProducts.reduce(
      (sum, price) => sum + price,
      0
    );
    const totalGrouped = groupedReservationDetails.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const subtotal = totalSelected + totalGrouped;
    const reservation = reservationState.reservation[0];
    const discount = reservation.discount; // Giảm giá mặc định là 0 nếu không có
    const discountAmount = subtotal * (discount / 100);
    console.log(reservation.discount);

    const vat = subtotal * 0.1;

    return subtotal - discountAmount + vat;
  };

  useEffect(() => {
    const selectedProducts = Object.entries(quantities)
      .map(([id, quantity]) => {
        const product = productState.product.find((p) => p.id === parseInt(id));
        if (product && quantity > 0) {
          return {
            product_id: product.id,
            quantity: quantity,
            price: product.price * quantity,
          };
        }
        return null;
      })
      .filter((item) => item !== null);
    const totalGrouped = groupedReservationDetails.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    const total =
      selectedProducts.reduce((sum, item) => sum + item.price, 0) +
      totalGrouped;
    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + item.price,
      0
    );
    const reservation = reservationState.reservation[0];
    const discount = reservation.discount; // Giảm giá mặc định là 0 nếu không có
    const discountAmount = total * (discount / 100);
    const vat = subtotal * 0.1;
    setValue("total", total);
    setValue("vat", vat);
    setValue("discountAmount", discountAmount);
  }, [quantities, productState.product, setValue]);

  const handleDeleteProduct = async (productId) => {
    try {
      await dispatch(deleteReservationDetail(reservationId, productId));
      setOpenSuccess(true);
      setSuccessMessage("Xóa món ăn thành công!");

      // Refetch the reservation details to update the UI
      dispatch(fetchReservationdetail(reservationId));
    } catch (error) {
      setOpenError(true);
      setErrorMessage("Xóa món ăn thất bại! Vui lòng thử lại.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    navigate(`?page=1`);
  };

  const handlePageChange = (page) => {
    navigate(`?page=${page}`);
    dispatch(
      fetchProductHoatDongReser(searchTerm, page, productState.pageSize)
    );
  };

  const handleQuantityChange = (id, value) => {
    setQuantities({
      ...quantities,
      [id]: Math.max(value, 0),
    });
  };

  const groupReservationsByProduct = (reservations) => {
    const grouped = {};

    // Duyệt qua từng item để gộp dữ liệu
    reservations.forEach((item) => {
      if (grouped[item.product_id]) {
        grouped[item.product_id].quantity += item.quantity;
        grouped[item.product_id].totalPrice += item.price * item.quantity;
      } else {
        grouped[item.product_id] = {
          ...item,
          totalPrice: item.price * item.quantity,
        };
      }
    });

    // Trả về danh sách các nhóm dưới dạng mảng
    return Object.values(grouped);
  };

  const groupedReservationDetails = reservationDetailState.reservationDetail
    ? groupReservationsByProduct(reservationDetailState.reservationDetail)
    : [];

  const onSubmit = async (data) => {
    // Kiểm tra xem có sản phẩm nào được chọn từ số lượng hoặc trong chi tiết đặt bàn
    const selectedProducts = Object.entries(quantities)
      .map(([id, quantity]) => {
        const product = productState.product.find((p) => p.id === parseInt(id));
        if (product && quantity > 0) {
          return {
            product_id: product.id,
            quantity: quantity,
            price: product.price,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    // Bắt lỗi nếu không có sản phẩm nào được chọn từ cả hai nguồn
    if (
      selectedProducts.length === 0 &&
      groupedReservationDetails.length === 0
    ) {
      setOpenError(true);
      setErrorMessage("Phải có ít nhất 1 sản phẩm được chọn.");
      return; // Dừng thực hiện nếu không có sản phẩm nào
    }

    const total = selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalAmount = calculateTotalAmount();
    // Tính tiền đặt cọc

    const requestData = {
      fullname: data.fullname,
      email: data.email,
      tel: data.tel,
      reservation_date: data.reservation_date,
      party_size: parseInt(data.party_size),
      note: data.notes,
      products: selectedProducts,
      total_amount: totalAmount,
      status: parseInt(data.status),
      id: reservationId,
    };

    try {
      await dispatch(updateReservationOrder(reservationId, requestData));
      setOpenSuccess(true);
      setSuccessMessage("Cập nhật đặt bàn thành công!");
      setTimeout(() => {
        navigate("/reservation");
      }, 2000); // Redirect sau khi thành công
    } catch (error) {
      setOpenError(true);
      setErrorMessage("Cập nhật đặt bàn thất bại! Vui lòng thử lại.");
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="container">
      <div className="page-inner">
        <div className="row">
          <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
            {" "}
            {/* Sử dụng handleSubmit */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Cập nhật đặt bàn</div>
              </div>

              <div className="card-body">
                <div>
                  <h5 className="form-group card_title">
                    {reservationState.reservation &&
                      reservationState.reservation.length > 0 && (
                        <>
                          <strong>Mã đơn:</strong>{" "}
                          {reservationState.reservation[0].reservation_code} |{" "}
                          <strong>Ngày đặt:</strong>{" "}
                          {formatDateTime(
                            reservationState.reservation[0].reservation_date
                          )}
                        </>
                      )}
                  </h5>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Tên khách hàng</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.fullname ? "is-invalid" : ""
                        }`}
                        {...register("fullname", {
                          required: "Tên khách hàng là bắt buộc",
                        })}
                        placeholder="Nhập tên khách hàng"
                      />
                      {errors.fullname && (
                        <div className="invalid-feedback">
                          {errors.fullname.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Email (không bắt buộc)</label>
                      <input
                        type="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        {...register("email", {
                          pattern: {
                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                            message: "Email không hợp lệ",
                          },
                        })}
                        placeholder="Nhập email"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại</label>
                      <input
                        type="number"
                        className={`form-control ${
                          errors.tel ? "is-invalid" : ""
                        }`}
                        {...register("tel", {
                          required: "Số điện thoại là bắt buộc",
                          pattern: {
                            value:
                              /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                            message: "Số điện thoại không đúng định dạng",
                          },
                        })}
                        placeholder="Nhập số điện thoại"
                      />
                      {errors.tel && (
                        <div className="invalid-feedback">
                          {errors.tel.message}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Trạng thái</label>
                      <select defaultValue="1" className="form-control" {...register("status")}>
                        {customerInfo.status !== 4 &&
                          customerInfo.status !== 5 && (
                            <option value={3}>Đã thanh toán cọc</option>
                          )}
                        <option value={4}>Đang lên món & Chờ thanh toán toàn bộ đơn</option>
                        <option value={5}>Hoàn thành đơn</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Tổng tiền</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("totalAmount")}
                        readOnly
                        placeholder="0 VND"
                        value={formatCurrency(watch("total") || 0)}
                        // Hiển thị giá trị từ state
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="deposit">Tiền đã đặt cọc:</label>
                      <input
                        type="text"
                        id="deposit"
                        {...register("deposit")}
                        className="form-control"
                        readOnly
                        value={formatCurrency(watch("deposit") || 0)}
                      />
                    </div>

                    {/* Hiển thị phần giảm giá chỉ nếu có giảm giá */}
                    {watch("discount") > 0 && (
                      <div className="form-group">
                        <label htmlFor="discount">Giảm giá:</label>
                        <input
                          type="text"
                          id="discount"
                          {...register("discount")}
                          className="form-control"
                          readOnly
                          value={formatCurrency(watch("discountAmount") || 0)}
                        />
                      </div>
                    )}

                    {/* Hiển thị phần tiền còn lại chỉ nếu tiền đặt cọc khác 0 */}
                    {watch("deposit") > 0 && (
                      <div className="form-group">
                        <label htmlFor="total">Số tiền còn lại:</label>
                        <input
                          type="text"
                          id="total"
                          {...register("total")}
                          className="form-control"
                          readOnly
                          value={formatCurrency(calculateTotalAmount())}
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <label>Tiền thuế</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("vat")}
                        readOnly
                        placeholder="0 VND"
                        value={formatCurrency(watch("vat") || 0)} // Hiển thị giá trị từ state
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label>Ghi chú</label>
                      <textarea
                        className="form-control full-width "
                        {...register("notes")}
                        placeholder="Nhập ghi chú"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card card-round">
                  <div className="card-header">
                    <div className="card-head-row card-tools-still-right">
                      <div className="card-title">Danh sách món ăn</div>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive text-center">
                      <table className="table align-items-center mb-0">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Món ăn</th>
                            <th scope="col">Số lượng</th>
                            <th scope="col">Giá</th>
                            <th scope="col">Tổng tiền</th>
                            <th scope="col">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservationDetailState.loading ? (
                            <tr>
                              <td colSpan={6}>
                                <CustomSpinner />
                              </td>
                            </tr>
                          ) : groupedReservationDetails.length > 0 ? (
                            groupedReservationDetails
                              .filter(
                                (item) =>
                                  selectedCategory === null ||
                                  item.categories_id === selectedCategory
                              )
                              .map((item, index) => (
                                <tr key={`${item.product_id}-${index}`}>
                                  <td>{index + 1}</td>
                                  <td>{item.product_name}</td>
                                  <td>{item.quantity}</td>
                                  <td>{formatCurrency(item.price)}</td>
                                  <td>{formatCurrency(item.totalPrice)}</td>
                                  <td>
                                    {/* Sử dụng biểu tượng Font Awesome */}
                                    <span
                                      className="text-red-500 cursor-pointer hover:text-red-700"
                                      onClick={() =>
                                        handleDeleteProduct(
                                          item.product_id,
                                          item.reservation_id
                                        )
                                      }
                                    >
                                      <i className="fas fa-trash-alt"></i>{" "}
                                      {/* Icon xóa */}
                                    </span>
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center">
                                Không có món ăn nào.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="row justify-content-center mb-3"></div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card card-round shadow">
                  <div
                    className="card-header d-flex justify-content-between align-items-center"
                    onClick={toggleDropdown}
                  >
                    <h5 className="card-title">Danh sách món ăn</h5>
                    <span className="caret mx-4"></span>
                  </div>
                  <div className="d-flex justify-content-center">
                    <div className="card-body col-md-11">
                      <div className={`collapse ${isOpen ? "show" : ""}`}>
                        <div className="pb-2 rounded-bottom shadow-sm mb-4">
                          <div className="d-flex justify-content-between align-items-center shadow-sm rounded py-2 px-3">
                            <ul className="nav">
                              <li className="nav-item">
                                <Link
                                  to="#"
                                  className={`nav-link fw-bolder fs-6 ${
                                    selectedCategory === null &&
                                    activeTab === "category-info"
                                      ? "active text-primary"
                                      : "text-dark"
                                  }`} // 'Tất cả' sẽ được active nếu selectedCategory là null và activeTab là 'updateInfo'
                                  onClick={() => {
                                    setSelectedCategory(null); // Chọn 'Tất cả'
                                    setActiveTab("category-info"); // Cập nhật activeTab
                                  }}
                                >
                                  Tất cả
                                </Link>
                              </li>
                            </ul>
                            <div className="card-tools">
                              <Paper
                                component="form"
                                sx={{
                                  p: "2px 4px",
                                  display: "flex",
                                  alignItems: "center",
                                  width: 320,
                                }}
                              >
                                <SearchIcon />
                                <InputBase
                                  sx={{ ml: 1, flex: 1 }}
                                  placeholder="Tìm kiếm món ăn..."
                                  inputProps={{ "aria-label": "search" }}
                                  value={searchTerm}
                                  onChange={handleSearch}
                                />
                              </Paper>
                            </div>
                          </div>
                          <table className="table table-hover table-striped mt-2">
                            <thead>
                              <tr>
                                <th scope="col">Tên</th>
                                <th scope="col">Đơn giá</th>
                                <th scope="col" className="text-center">
                                  Số lượng
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {productState.loading && (
                                <tr>
                                  <td colSpan={4}>
                                    <CustomSpinner />
                                  </td>
                                </tr>
                              )}
                              {!productState.loading &&
                              productState.allProducts &&
                              productState.allProducts.length > 0 ? (
                                productState.allProducts
                                  .filter(
                                    (product) =>
                                      selectedCategory === null ||
                                      product.categories_id === selectedCategory
                                  ) // Lọc sản phẩm theo danh mục, hiển thị tất cả nếu selectedCategory là null
                                  .map((product) => (
                                    <tr key={product.id}>
                                      <td>{product.name}</td>
                                      <td>
                                        {formatCurrency(
                                          product.sale_price
                                            ? product.price - product.sale_price
                                            : product.price
                                        )}
                                      </td>
                                      <td className="d-flex justify-content-center align-items-center">
                                        {/* Nhóm số lượng với các nút dính liền */}
                                        <div
                                          className="btn-group"
                                          role="group"
                                          aria-label="Quantity Controls"
                                        >
                                          {/* Nút giảm số lượng */}
                                          <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-lg"
                                            onClick={() =>
                                              handleQuantityChange(
                                                product.id,
                                                Math.max(
                                                  0,
                                                  (quantities[product.id] ||
                                                    0) - 1
                                                )
                                              )
                                            }
                                          >
                                            <i className="fas fa-minus"></i>
                                          </button>

                                          {/* Hiển thị số lượng */}
                                          <input
                                            type="text"
                                            value={quantities[product.id] || 0}
                                            className="form-control form-control-lg text-center border-0"
                                            style={{ width: "200px" }}
                                            onInput={(e) => {
                                              // Chỉ cho phép nhập số
                                              const newValue =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                );
                                              handleQuantityChange(
                                                product.id,
                                                parseInt(newValue || 0, 10)
                                              );
                                            }}
                                          />

                                          {/* Nút tăng số lượng */}
                                          <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-lg"
                                            onClick={() =>
                                              handleQuantityChange(
                                                product.id,
                                                (quantities[product.id] || 0) +
                                                  1
                                              )
                                            }
                                          >
                                            <i className="fas fa-plus"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="text-center">
                                    Không có món ăn nào
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          <div className="row justify-content-center mb-3 mx-1">
                            <CustomPagination
                              count={productState.totalPages} // Tổng số trang từ state
                              onPageChange={handlePageChange} // Hàm chuyển trang
                              currentPageSelector={(state) =>
                                state.product.currentPage
                              } // Selector lấy currentPage
                              pageSizeSelector={(state) => state.product.limit} // Thay pageSizeSelector thành limit
                              fetchDataAction={(page) =>
                                fetchProductHoatDongReser(searchTerm, page)
                              } // Fetch dữ liệu với searchTerm và page
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-between align-items-center">
                        <div>
                          <button
                            type="submit"
                            className="btn btn-primary px-5"
                          >
                            Cập nhật
                          </button>
                          <Link
                            to="/reservation"
                            className="btn btn-secondary mx-3 px-5"
                          >
                            Hủy
                          </Link>
                        </div>
                        <h3 className="mx-5">
                          Tổng tiền: {formatCurrency(calculateTotalAmount())}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <SuccessAlert
        open={openSuccess}
        handleClose={handleSuccessClose}
        message={successMessage}
      />

      {/* Error Alert */}
      <DangerAlert
        open={openError}
        handleClose={handleErrorClose}
        message={errorMessage}
      />
    </div>
  );
}
