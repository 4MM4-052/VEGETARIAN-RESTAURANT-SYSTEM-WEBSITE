import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "lodash.debounce";

import { setCurrentPage } from "../../Actions/CustomerActions";
import DialogConfirm from "../../Components/Dialog/Dialog";
import CustomPagination from "../../Components/Pagination/CustomPagination";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";
import { DangerAlert, SuccessAlert } from "../../Components/Alert/Alert";
import { deleteUsers, fetchUsers } from "../../Actions/UsersAction";
import { fetchRole } from "../../Actions/RoleActions";

import { getPermissions } from "../../Actions/GetQuyenHanAction";
import { jwtDecode as jwt_decode } from "jwt-decode";
import CheckboxSelection from "../../Components/CheckboxSelection";

export default function CustomerList() {
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

  const userState = useSelector((state) => state.users);
  const roleState = useSelector((state) => state.role);

  const query = new URLSearchParams(location.search);
  const urlPage = parseInt(query.get("page")) || 1;

  const [open, setOpen] = useState(false);
  const [selectedUser, setselectedUser] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorMsgContent, setErrorMsgContent] = useState(""); // Nội dung thông báo lỗi
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setsearchStatus] = useState("");
  const [searchUserType, setUserType] = useState("");
  const [searchRoleId, setsearchRoleId] = useState("");

  // Debounce hàm tìm kiếm để giảm số lần gọi API
  const debouncedSearch = useMemo(
    () =>
      debounce((term, status, role_id, user_type) => {
        dispatch(fetchUsers(term, status, role_id, user_type, urlPage, userState.pageSize));
        dispatch(setCurrentPage(1));
        console.log(role_id);
        
      }, 1000),
    [dispatch, urlPage, userState.pageSize]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (!searchTerm) {
      dispatch(fetchUsers("", searchStatus, searchRoleId, searchUserType, urlPage, userState.pageSize)); // Fetch lại dữ liệu khi không tìm kiếm
    }
  }, [dispatch, searchTerm, urlPage, userState.pageSize]);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm, searchStatus, searchRoleId, searchUserType);
    }
  }, [searchTerm]);

  useEffect(() => {
    navigate(`?page=${userState.currentPage}`);
  }, [userState.currentPage, navigate]);

  useEffect(() => {
    dispatch(fetchRole());
  }, [dispatch]);

  const getRoleNameById = (roleId) => {
    const role = roleState.role.find((role) => role.id === roleId);
    return role ? role.name : "";
  };

  const handleClickOpen = (customerId) => {
    setselectedUser(customerId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setselectedUser(null);
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);
  };

  const handleErrorClose = () => {
    setErrorMessage(false);
    setErrorMsgContent(""); // Reset nội dung lỗi
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        await dispatch(deleteUsers(selectedUser));
        handleClose();
        setOpenSuccess(true); // Hiển thị thông báo thành công
      } catch (error) {
        setErrorMsgContent(error.message || "Đã xảy ra lỗi khi xóa tài khoản!");
        setErrorMessage(true); // Hiển thị thông báo lỗi
      }
    }
  };

  const handleDeleteUsersSeleted = async (selectedUserIds) => {
    let hasError = false;

    try {
      await Promise.all(
        selectedUserIds.map(async (id) => {
          try {
            await dispatch(deleteUsers(id));
          } catch (error) {
            setErrorMsgContent(`Lỗi khi xóa tài khoản: ${error.message}`);
            hasError = true;
          }
        })
      );

      if (hasError) {
        setErrorMessage(true); // Hiển thị thông báo lỗi
      } else {
        setOpenSuccess(true); // Hiển thị thông báo thành công nếu không có lỗi
      }
    } catch (error) {
      setErrorMsgContent("Đã xảy ra lỗi khi xóa các tài khoản đã chọn.");
      setErrorMessage(true);
    }
  };

  const {
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    handleDeleteSelected,
    allSelected,
  } = CheckboxSelection(userState.user, handleDeleteUsersSeleted);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value, searchStatus, searchRoleId, searchUserType);
  };

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };

  const handleSearchStatus = (event) => {
    setsearchStatus(event.target.value);
    debouncedSearch(searchTerm, event.target.value, searchRoleId, searchUserType);
  };

  const handleSearchType = (event) => {
    setUserType(event.target.value);
    debouncedSearch(searchTerm, searchStatus, searchRoleId, event.target.value);
  };

  const handleSearchRoleID = (event) => {
    setsearchRoleId(event.target.value);
    debouncedSearch(searchTerm, searchStatus, event.target.value, searchUserType);
  };

  //* Hàm để chuyển trang và render dữ liệu đến trang hiện tại
  const handlePageChange = (page) => {
    navigate(`?page=${page}`); // Cập nhật URL với trang mới
    dispatch(setCurrentPage(page)); // Cập nhật trang hiện tại trong state
    dispatch(fetchUsers(searchTerm, searchStatus, searchRoleId, searchUserType, page, userState.pageSize)); // Fetch dữ liệu theo trang mới
  };


  return (
    <div className="container">
      <div className="page-inner">
        <div className="pt-2 pb-4">
          <div>
            <h3 className="fw-bold mb-3">Quản lý tài khoản</h3>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <select
                className="form-control"
                style={{ height: "38px", minWidth: "150px" }}
                value={searchUserType}
                onChange={handleSearchType}
              >
                <option value="">Loại người dùng</option>
                <option value="Khách Hàng">Khách Hàng</option>
                <option value="Nhân Viên">Nhân Viên</option>
              </select>
              <select
                className="form-control"
                style={{ height: "38px", minWidth: "150px" }}
                value={searchRoleId}
                onChange={handleSearchRoleID}
              >
                <option value="">Vai trò</option>
                {roleState && roleState.role.map((item, index) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              <select
                className="form-control"
                style={{ height: "38px", minWidth: "150px" }}
                value={searchStatus}
                onChange={handleSearchStatus}
              >
                <option value="">Trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Ngưng hoạt động</option>
              </select>
            </div>
            <div className="ms-md-auto py-2 py-md-0">
              {hasPermission("Xóa tài khoản") && (
                <button
                  className="btn btn-danger btn-round me-2"
                  onClick={handleDeleteSelected}
                  disabled={selectedItems.length === 0}
                >
                  Xóa mục đã chọn
                </button>
              )}
              {hasPermission("Thêm tài khoản") && (
                <Link to="/users/add" className="btn btn-primary btn-round">
                  Thêm tài khoản
                </Link>
              )}
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
                        p: "2px 4px",
                        display: "flex",
                        alignItems: "center",
                        width: 320,
                      }}
                    >
                      <SearchIcon />
                      <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Tìm kiếm tài khoản ở đây!"
                        inputProps={{ "aria-label": "search" }}
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
                        <th scope="col">#</th>
                        <th scope="col">Ảnh đại diện</th>
                        <th scope="col">Tên đầy đủ</th>
                        <th scope="col">Email</th>
                        <th scope="col">SĐT</th>
                        <th scope="col">Loại người dùng</th>
                        <th scope="col">Vai trò (dành cho nhân viên)</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userState.loading && (
                        <tr>
                          <td colSpan="7">
                            <CustomSpinner />
                          </td>
                        </tr>
                      )}
                      {!userState.loading && userState.user.length === 0 && (
                        <tr>
                          <td colSpan="7">Không tìm thấy tài khoản</td>
                        </tr>
                      )}
                      {userState.allUsers &&
                        userState.allUsers.map((user, index) => (
                          <tr key={user.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(user.id)}
                                onChange={() => handleSelectItem(user.id)}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                className="img-fluid rounded-circle"
                                src={
                                  user.avatar || "../Assets/Images/default.jpg"
                                }
                                alt="Avatar"
                                width={50}
                                height={50}
                              />
                            </td>
                            <td>{user.fullname}</td>
                            <td>{user.email}</td>
                            <td>{user.tel}</td>
                            <td>
                              {user.user_type == "Khách Hàng" ? (
                                <span className="badge badge-secondary">
                                  Khách Hàng
                                </span>
                              ) : (
                                <span className="badge badge-info">
                                  Nhân Viên
                                </span>
                              )}
                            </td>
                            <td>
                              <span className="badge badge-warning">
                                {getRoleNameById(user.role_id)}
                              </span>
                            </td>
                            <td>
                              {user.status == 1 ? (
                                <span className="badge badge-success">
                                  Hoạt động
                                </span>
                              ) : (
                                <span className="badge badge-danger">
                                  Ngưng hoạt động
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                {hasPermission("Sửa tài khoản") && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-success"
                                    onClick={() => handleEdit(user.id)}
                                  >
                                    Sửa
                                  </button>
                                )}
                                {hasPermission("Xóa tài khoản") && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => handleClickOpen(user.id)}
                                  >
                                    <span className="text-danger">Xóa</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="my-2">
                  <CustomPagination
                    count={userState.totalPages} // Tổng số trang từ state
                    onPageChange={handlePageChange} // Hàm chuyển trang
                    currentPageSelector={(state) => state.users.currentPage} // Selector lấy currentPage
                    pageSizeSelector={(state) => state.users.limit} // Thay pageSizeSelector thành limit
                    fetchDataAction={(page, size) =>
                      fetchUsers(searchTerm, page)
                    } // Fetch dữ liệu với searchTerm và page
                  />
                </div>
              </div>
            </div>
          </div>
          <SuccessAlert
            open={openSuccess}
            onClose={handleSuccessClose}
            message="Xóa tài khoản thành công!"
          />
          <DangerAlert
            open={errorMessage}
            onClose={handleErrorClose}
            message={errorMsgContent || "Lỗi khi xóa tài khoản!"}
          />
        </div>
      </div>
      <DialogConfirm
        open={open}
        onClose={handleClose}
        onConfirm={handleDelete}
      />
    </div>
  );
}
