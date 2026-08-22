import { Link, useNavigate, useLocation } from "react-router-dom";
import { InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  fetchProductHoatDongReser,
  setCurrentPage,
} from "../../Actions/ProductActions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductCategoryHoatDong } from "../../Actions/ProductCategoryActions";
import CustomPagination from "../../Components/Pagination/CustomPagination";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";
import { formatCurrency } from "../../Utils/FormatCurrency";
import {
  addReservation,
  fetchExistingReservations as fetchExistingReservationsAction,
} from "../../Actions/Reservations_t_AdminActions";
import { SuccessAlert, DangerAlert } from "../../Components/Alert/Alert";
import { useForm } from "react-hook-form";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function ReservationAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const productState = useSelector((state) => state.product);
  const productCategoryState = useSelector((state) => state.product_category);

  const [depositAmount, setDepositAmount] = useState(0);
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
  const [tongTien, setTongTien] = useState(0);

  // Set initial state for deposit to true and status to 3
  const [isDeposit, setIsDeposit] = useState(true);

  const handleSuccessClose = () => setOpenSuccess(false);
  const handleErrorClose = () => {
    setOpenError(false);
  };

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
      reservation_date: "",
      deposit: 0,
      partySize: 1,
      notes: "",
      totalAmount: 0,
      status: 3, // Default to "đã đặt cọc"
      reservation_code: "",
    },
  });

  const customerInfo = watch();

  useEffect(() => {
    dispatch(
      fetchProductHoatDongReser(searchTerm, urlPage, productState.pageSize)
    );
    dispatch(fetchProductCategoryHoatDong());
  }, [dispatch, searchTerm, urlPage, productState.pageSize]);

  useEffect(() => {
    const selectedProducts = Object.entries(quantities)
      .map(([id, quantity]) => {
        const product = productState.product.find((p) => p.id === parseInt(id));
        if (product && quantity > 0) {
          const price = product.sale_price
            ? product.price - product.sale_price
            : product.price;
          return {
            product_id: product.id,
            quantity: quantity,
            price: price * quantity,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    const total = selectedProducts.reduce((sum, item) => sum + item.price, 0);
    const vat = total * 0.1; // Tính VAT
    const deposit = isDeposit ? total * 0.3 : 0;
    const totalAfterDeposit = total + vat - deposit;
    const totalAmount = total + vat;
    setValue("vat", vat); // Cộng VAT và trừ đặt cọc
    setValue("deposit", deposit);
    setValue(
      "totalAfterDeposit",
      totalAfterDeposit > 0 ? totalAfterDeposit : 0
    );
    setValue("totalAmount", totalAmount > 0 ? totalAmount : 0);
  }, [quantities, productState.product, setValue, isDeposit]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    dispatch(setCurrentPage(1));
  };
  const handlePageChange = (page) => {
    navigate(`?page=${page}`); // Cập nhật URL với page
    dispatch(setCurrentPage(page)); // Cập nhật trang hiện tại trong state
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

  const generateReservationCode = () => {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    return `HS${randomNumber}`;
  };

  const checkReservationCodeExists = async (code) => {
    try {
      const existingReservations = await dispatch(
        fetchExistingReservationsAction()
      );
      return existingReservations.some(
        (reservation) => reservation.reservation_code === code
      );
    } catch (error) {
      console.error("Error checking reservation code:", error);
      return false;
    }
  };

  const onSubmit = async (data) => {
    const selectedProducts = Object.entries(quantities)
      .map(([id, quantity]) => {
        const product = productState.product.find((p) => p.id === parseInt(id));
        if (product && quantity > 0) {
          return {
            product_id: product.id,
            quantity: quantity,
            price: product.price,
            total_price: product.price * quantity,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    if (selectedProducts.length === 0) {
      setOpenError(true);
      setErrorMessage("Vui lòng chọn ít nhất một món để đặt bàn.");
      return;
    }

    const total = selectedProducts.reduce(
      (sum, item) => sum + item.total_price,
      0
    );
    const vat = total * 0.1; // Tính VAT
    const deposit = isDeposit ? total * 0.3 : 0;
    const totalWithVat = total + vat; // Tổng tiền sau khi cộng VAT

    let reservationCode;
    let codeExists = true;
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

    while (codeExists && attempts < MAX_ATTEMPTS) {
      reservationCode = generateReservationCode();
      codeExists = await checkReservationCodeExists(reservationCode);
      attempts++;
    }

    if (codeExists) {
      setOpenError(true);
      setErrorMessage(
        "Không thể tạo mã đặt bàn duy nhất, vui lòng thử lại sau."
      );
      setTimeout(handleErrorClose, 3000);
      return;
    }

    const requestData = {
      ...data,
      party_Size: parseInt(data.partySize),
      totalAmount: totalWithVat,
      deposit: deposit,
      status: parseInt(data.status),
      products: selectedProducts,
      reservation_code: reservationCode,
    };

    try {
      await dispatch(addReservation(requestData));
      setOpenSuccess(true);
      setSuccessMessage("Đặt bàn thành công!");

      setTimeout(() => {
        navigate("/reservation");
      }, 2000);
    } catch (error) {
      setOpenError(true);
      setErrorMessage("Không có bàn trống, vui lòng đặt ngày khác");
      setTimeout(handleErrorClose, 1500);
    }
  };

  const handleDepositChange = (event) => {
    setIsDeposit(event.target.checked);
    setValue("status", event.target.checked ? 3 : 4);
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
                <div className="card-title">Thêm bàn đặt</div>
              </div>
              <div className="card-body">
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
                      <label>Ngày và giờ đặt</label>
                      <input
                        type="datetime-local"
                        className={`form-control ${
                          errors.reservation_date ? "is-invalid" : ""
                        }`}
                        {...register("reservation_date", {
                          required: "Ngày và giờ đặt là bắt buộc",
                          validate: (value) => {
                            const selectedDate = new Date(value);
                            const now = new Date();
                            const maxTime = new Date(
                              now.getTime() + 7 * 24 * 60 * 60 * 1000
                            ); // Thời gian tối đa là 7 ngày sau hiện tại

                            // Không cho phép chọn thời gian trong quá khứ
                            if (selectedDate <= now) {
                              return "Không thể chọn thời gian trong quá khứ";
                            }

                            // Kiểm tra thời gian tối đa
                            if (selectedDate > maxTime) {
                              return "Không thể đặt bàn quá 7 ngày tính từ hôm nay";
                            }

                            // Kiểm tra giờ đặt bàn (từ 9h đến 20h)
                            const selectedHour = selectedDate.getHours();
                            if (selectedHour < 9 || selectedHour > 20) {
                              return "Thời gian đặt bàn phải nằm trong khoảng từ 9h đến 20h";
                            }

                            return true; // Hợp lệ
                          },
                        })}
                        min={new Date().toISOString().slice(0, 16)} // Giá trị tối thiểu là thời gian hiện tại
                      />
                      {errors.reservation_date && (
                        <div className="invalid-feedback">
                          {errors.reservation_date.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Số lượng người</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Nhập số lượng người"
                        defaultValue={1}
                        // Chặn nhập số lớn hơn 8
                        step={1} // Chỉ cho phép nhập số nguyên
                        {...register("partySize", {
                          required: "Số lượng người là bắt buộc",
                          validate: (value) => {
                            if (value < 1) {
                              return "Số lượng người phải lớn hơn 0";
                            }
                            if (value > 8) {
                              return "Số lượng người không được vượt quá 8";
                            }
                            return true; // Giá trị hợp lệ
                          },
                        })}
                      />
                      {errors.partySize && (
                        <small className="text-danger">
                          {errors.partySize.message}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group" hidden>
                      <label>Trạng thái</label>
                      <select defaultValue="1"
                        className="form-select form-control"
                        {...register("status")}
                      >
                        <option value={3}>Đã thanh toán cọc</option>
                        <option value={4}>Đang lên món & Chờ thanh toán toàn bộ đơn</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Tổng tiền</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("totalAmount")}
                        readOnly
                        placeholder="0VND"
                        value={formatCurrency(customerInfo.totalAmount)}
                      />
                    </div>
                    {isDeposit ? (
                      <div className="form-group">
                        <label>Số tiền còn lại</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("totalAfterDeposit")}
                          readOnly
                          placeholder="0VND"
                          value={formatCurrency(
                            watch("totalAfterDeposit") || 0
                          )}
                        />
                      </div>
                    ) : null}

                    <div className="form-group">
                      <label>Tiền thuế</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("vat")}
                        readOnly
                        placeholder="0VND"
                        value={formatCurrency(watch("vat") || 0)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tiền cọc</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("deposit")}
                        readOnly
                        placeholder="0VND"
                        value={formatCurrency(customerInfo.deposit)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Đặt cọc</label>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={isDeposit}
                              onChange={handleDepositChange}
                            />
                          }
                          label={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span>Đặt cọc 30%</span>
                              <span> | </span>
                            </div>
                          }
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label>Ghi chú</label>
                      <textarea
                        className="form-control full-width"
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
                                  }`}
                                  onClick={() => {
                                    setSelectedCategory(null);
                                    setActiveTab("category-info");
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
                                  )
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
                          <div className="row justify-content-center mb-3 mx-1 flex items-center space-x-4">
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
                            Thêm
                          </button>
                          <Link
                            to="/reservation"
                            className="btn btn-secondary mx-3 px-5"
                          >
                            Hủy
                          </Link>
                        </div>
                        <h3 className="mx-5">
                          Tổng tiền: {formatCurrency(customerInfo.totalAmount)}
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
