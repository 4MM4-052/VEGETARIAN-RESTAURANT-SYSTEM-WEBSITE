import React, { useEffect } from "react";
import { Link, NavLink, useLocation, Navigate, useNavigate } from "react-router-dom";
import logo from "../Assets/Images/huong-sen-logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { getPermissions } from '../Actions/GetQuyenHanAction';

export default function MenuBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem('token');
  const getQuyenHanState = useSelector(state => state.getQuyenHan);
  const permissions = getQuyenHanState.getQuyenHan || [];

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      const userIdFromToken = decodedToken.id;
      dispatch(getPermissions(userIdFromToken));
    }

  }, [navigate, dispatch, token]);

  const hasPermission = (permissionName) => {
    return permissions.data && permissions.data.some(permission => permission.name == permissionName);
  };

  // Kiểm tra xem hiện tại đang ở trong dropdown nào
  const isDashboardActive = location.pathname === "/dashboard";
  const isProductManagementActive =
    location.pathname.startsWith("/category-product") ||
    location.pathname.startsWith("/product");
  const isBlogManagementActive =
    location.pathname.startsWith("/category-blog") ||
    location.pathname.startsWith("/blogs");
  const isOtherManagementActive =
    location.pathname.startsWith("/promotions") ||
    location.pathname.startsWith("/customer-group") ||
    location.pathname.startsWith("/places");
  const isAccountManagementActive =
    location.pathname.startsWith("/users")
  const isRoleManagementActive =
    location.pathname.startsWith("/role") ||
    location.pathname.startsWith("/permissions");
  const isChatManagement = location.pathname.startsWith("/user-chats");
  const isReview = location.pathname.startsWith("/Review");
  const isReview1 = location.pathname.startsWith("/Review1");
  const isPredictionActive = ["/customer-prediction", "/menu-prediction"].some(path =>
  location.pathname.startsWith(path)
  );
  
  return (
    <div className="sidebar" data-background-color="dark">
      <div className="sidebar-logo">
        <div
          className="logo-header d-flex justify-content-center align-items-center"
          data-background-color="dark"
        >
          <Link to="" className="logo">
            <img
              src={logo}
              alt="navbar brand"
              className="navbar-brand"
              width={70}
              height="70"
            />
          </Link>
          <div className="nav-toggle">
            <button className="btn btn-toggle toggle-sidebar">
              <i className="gg-menu-right"></i>
            </button>
            <button className="btn btn-toggle sidenav-toggler">
              <i className="gg-menu-left"></i>
            </button>
          </div>
          <button className="topbar-toggler more">
            <i className="gg-more-vertical-alt"></i>
          </button>
        </div>
      </div>
      <div className="sidebar-wrapper scrollbar scrollbar-inner">
        <div className="sidebar-content">
          <ul className="nav nav-secondary">

            <li className={`nav-item ${isDashboardActive ? "active" : ""}`}>
              <NavLink to="/dashboard" className="collapsed">
                <i className="fas fa-home"></i>
                <p>Dashboard</p>
              </NavLink>
            </li>


      <li className="nav-item">
        {/* Menu cha */}
        <a
          className="nav-link collapsed d-flex align-items-center"
          data-bs-toggle="collapse"
          href="#reviewMenu"
        >
          <i className="fa-regular fa-comments me-2"></i>

          <p className="mb-0 flex-grow-1">
            Đánh Giá Khách Hàng
          </p>

          <span className="caret ms-auto"></span>
        </a>
        {/* 2 trang con */}
        <div className="collapse" id="reviewMenu">
          <ul className="nav nav-collapse">
            <li>
              <NavLink
                to="/Review"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="sub-item">Thời gian thực</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/Review1"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="sub-item">Tổng hợp</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </li>

            <li className="nav-section">
              <h4 className="text-section">Quản Lý Danh Sách</h4>
            </li>

            {/* Quản Lý Sản Phẩm */}
            {(hasPermission('Xem sản phẩm') || hasPermission('Xem danh mục sản phẩm') || hasPermission('Sửa sản phẩm và Xem danh mục sản phẩm') || hasPermission('Thêm sản phẩm và Xem danh mục sản phẩm') || hasPermission('Khôi phục sản phẩm')) && (
              <li className={`nav-item ${(((hasPermission('Xem danh mục sản phẩm') || hasPermission('Thêm sản phẩm và Xem danh mục sản phẩm') || hasPermission('Sửa sản phẩm và Xem danh mục sản phẩm')) && location.pathname.startsWith("/category-product")) || (hasPermission('Xem sản phẩm') && location.pathname.startsWith("/product")) || (hasPermission('Khôi phục sản phẩm') && location.pathname.startsWith("/product/tam_xoa"))) ? "active" : ""}`}>
                <NavLink to="#productManagement" className="collapsed" aria-expanded={isProductManagementActive.toString()} data-bs-toggle="collapse">
                  <i className="fa-solid fa-utensils"></i>
                  <p>Quản Lý Món Ăn</p>
                  <span className="caret"></span>
                </NavLink>
                <div className={`collapse ${(((hasPermission('Xem danh mục sản phẩm') || hasPermission('Thêm sản phẩm và Xem danh mục sản phẩm') || hasPermission('Sửa sản phẩm và Xem danh mục sản phẩm')) && location.pathname.startsWith("/category-product")) || (hasPermission('Xem sản phẩm') && location.pathname.startsWith("/product")) || (hasPermission('Khôi phục sản phẩm') && location.pathname.startsWith("/product/tam_xoa"))) ? "show" : ""}`} id="productManagement">
                  <ul className="nav nav-collapse">
                    {(hasPermission('Xem danh mục sản phẩm') || hasPermission('Thêm sản phẩm và Xem danh mục sản phẩm') || hasPermission('Sửa sản phẩm và Xem danh mục sản phẩm')) && (
                      <li>
                        <NavLink to="/category-product">
                          <span className="sub-item">Danh mục sản phẩm</span>
                        </NavLink>
                      </li>
                    )}
                    {hasPermission('Xem sản phẩm') && (
                      <li>
                        <NavLink to="/product">
                          <span className="sub-item">Sản phẩm</span>
                        </NavLink>
                      </li>
                    )}
                    {hasPermission('Khôi phục sản phẩm') && (
                      <li>
                        <NavLink to="/product/tam_xoa">
                          <span className="sub-item">Sản phẩm tạm xóa</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            )}

            {/* Quản Lý Bài Viết */}
            {(hasPermission('Xem danh mục bài viết') || hasPermission('Xem bài viết') || hasPermission('Thêm bài viết và Xem danh mục bài viết') || hasPermission('Sửa bài viết và Xem danh mục bài viết')) && (
              <li className={`nav-item ${(((hasPermission('Xem danh mục bài viết') || hasPermission('Thêm bài viết và Xem danh mục bài viết') || hasPermission('Sửa bài viết và Xem danh mục bài viết')) && (location.pathname.startsWith("/category-blog"))) || (hasPermission('Xem bài viết') && location.pathname.startsWith("/blogs"))) ? "active" : ""}`}>
                <NavLink to="#blogManagement" className="collapsed" aria-expanded={isBlogManagementActive.toString()} data-bs-toggle="collapse">
                  <i className="fa-solid fa-newspaper"></i>
                  <p>Quản Lý Bài Viết</p>
                  <span className="caret"></span>
                </NavLink>
                <div className={`collapse ${(((hasPermission('Xem danh mục bài viết') || hasPermission('Thêm bài viết và Xem danh mục bài viết') || hasPermission('Sửa bài viết và Xem danh mục bài viết')) && location.pathname.startsWith("/category-blog")) || (hasPermission('Xem bài viết') && location.pathname.startsWith("/blogs"))) ? "show" : ""}`} id="blogManagement">
                  <ul className="nav nav-collapse">
                    {(hasPermission('Xem danh mục bài viết') || hasPermission('Thêm bài viết và Xem danh mục bài viết') || hasPermission('Sửa bài viết và Xem danh mục bài viết')) && (
                      <li>
                        <NavLink to="/category-blog">
                          <span className="sub-item">Danh mục bài viết</span>
                        </NavLink>
                      </li>
                    )}
                    {hasPermission('Xem bài viết') && (
                      <li>
                        <NavLink to="/blogs">
                          <span className="sub-item">Bài viết</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            )}

            {/* Quản Lý Khác */}
            {hasPermission('Xem mã khuyến mãi') && (
              <li className={`nav-item ${(hasPermission('Xem mã khuyến mãi') && (location.pathname.startsWith("/promotions"))) ? "active" : ""}`}>
                <NavLink to="#otherManagement" className="collapsed" aria-expanded={isOtherManagementActive.toString()} data-bs-toggle="collapse">
                  <i className="fa-solid fa-cogs"></i>
                  <p>Quản Lý Sự Kiện</p>
                  <span className="caret"></span>
                </NavLink>
                <div className={`collapse ${(hasPermission('Xem mã khuyến mãi') && (location.pathname.startsWith("/promotions"))) ? "show" : ""}`} id="otherManagement">
                  <ul className="nav nav-collapse">
                    {hasPermission('Xem mã khuyến mãi') && (
                      <li>
                        <NavLink to="/promotions">
                          <span className="sub-item">Quản lý khuyến mãi</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            )}

            {/* Quản Lý Tài khoản */}
            {hasPermission('Xem tài khoản') && (
              <li
                className={`nav-item ${(hasPermission('Xem tài khoản') && (location.pathname.startsWith("/users"))) ? "active" : ""
                  }`}
              >
                <NavLink
                  to="#accountManagement"
                  className="collapsed"
                  aria-expanded={isAccountManagementActive.toString()}
                  data-bs-toggle="collapse"
                >
                  <i className="fa-solid fa-users"></i>
                  <p>Quản Lý Tài khoản</p>
                  <span className="caret"></span>
                </NavLink>
                <div className={`collapse ${(hasPermission('Xem tài khoản') && (location.pathname.startsWith("/users"))) ? "show" : ""}`} id="accountManagement">
                  <ul className="nav nav-collapse">
                    <li>
                      <NavLink to="/users">
                        <span className="sub-item">Tài khoản</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            )}

            {/* Quản Lý Đặt Bàn */}
            {(hasPermission('Xem đặt bàn') || hasPermission('Xem bàn ăn')) && (
              <li className={`nav-item ${((hasPermission('Xem đặt bàn') && (location.pathname.startsWith("/reservation"))) || (hasPermission('Xem bàn ăn') && location.pathname.startsWith("/tables"))) ? "active" : ""}`}>
                <NavLink to="#tableManagement" className="collapsed" aria-expanded={isBlogManagementActive.toString()} data-bs-toggle="collapse">
                  <i className="fa-solid fa-chair"></i>
                  <p>Quản Lý Đặt Bàn</p>
                  <span className="caret"></span>
                </NavLink>
                <div className={`collapse ${((hasPermission('Xem đặt bàn') && (location.pathname.startsWith("/reservation"))) || (hasPermission('Xem bàn ăn') && location.pathname.startsWith("/tables"))) ? "show" : ""}`} id="tableManagement">
                  <ul className="nav nav-collapse">
                    {hasPermission('Xem bàn ăn') && (
                      <li>
                        <NavLink to="/tables">
                          <span className="sub-item">Quản lý bàn ăn</span>
                        </NavLink>
                      </li>
                    )}
                    {hasPermission('Xem đặt bàn') && (
                      <li>
                        <NavLink to="/reservation">
                          <span className="sub-item">Quản lý đặt bàn</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            )}

            {/* Quản Lý Quyền */}
            {(hasPermission('Xem vai trò') || hasPermission('Phân quyền')) && (
              <li className={`nav-item ${((hasPermission('Xem vai trò') && (location.pathname.startsWith("/role"))) || (hasPermission('Phân quyền') && location.pathname.startsWith("/permissions"))) ? "active" : ""}`}>
                <NavLink to="#roleManagement" className="collapsed" aria-expanded={isRoleManagementActive.toString()} data-bs-toggle="collapse">
                  <i className="fa-solid fa-user-shield"></i>
                  <p>Quản Lý Vai Trò</p>
                  <span className="caret"></span>
                </NavLink>
                <div className={`collapse ${((hasPermission('Xem vai trò') && (location.pathname.startsWith("/role"))) || (hasPermission('Phân quyền') && location.pathname.startsWith("/permissions"))) ? "show" : ""}`} id="roleManagement">
                  <ul className="nav nav-collapse">
                    {hasPermission('Phân quyền') && (
                      <li>
                        <NavLink to="/permissions">
                          <span className="sub-item">Phân quyền</span>
                        </NavLink>
                      </li>
                    )}
                    {hasPermission('Xem vai trò') && (
                      <li>
                        <NavLink to="/role">
                          <span className="sub-item">Vai trò</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            )}

            {/* Quản Lý chat với khách hàng*/}
            {hasPermission('Tư vấn khách hàng') && (
              <li className={`nav-item ${(hasPermission('Tư vấn khách hàng') && location.pathname.startsWith("/user-chats")) ? "active" : ""}`}>
                <NavLink
                to="#chatManagement"
                className="collapsed"
                aria-expanded={isChatManagement.toString()}
                data-bs-toggle="collapse"
              >
                <i className="fa-regular fa-message"></i>
                <p>Tư vấn với khách hàng</p>
                <span className="caret"></span>
              </NavLink>
                <div
                  className={`collapse ${(hasPermission('Tư vấn khách hàng') && location.pathname.startsWith("/user-chats")) ? "show" : ""}`}
                  id="chatManagement"
                >
                  <ul className="nav nav-collapse">
                    <li>
                      <NavLink to="/user-chats">
                        <span className="sub-item">Tư vấn với khách hàng</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            )}



            {/* Dự đoán số khách hàng đến đặt bàn & Số món ăn chọn nhiều trong khung giờ */}
            <li className={`nav-item ${isPredictionActive ? "active" : ""}`}>
              {/* <NavLink
                to="#CustomerPrediction"
                className="collapsed"
                aria-expanded={isPredictionActive.toString()}
                data-bs-toggle="collapse"
              >
                <i className="fa-regular fa-chart-line"></i>
                <p>Prediction</p>
                <span className="caret"></span>
              </NavLink> */}
              <div
                className={`collapse ${isPredictionActive ? "show" : ""}`}
                id="CustomerPrediction"
              >
                <ul className="nav nav-collapse">
                  <li>
                    {/* <NavLink to="/customer-prediction">
                      <span className="sub-item">Số Khách Hàng</span>
                    </NavLink> */}
                  </li>
                  <li>
                    {/* <NavLink to="/menu-prediction">
                      <span className="sub-item">Món Bán Chạy</span>
                    </NavLink> */}
                  </li>
                </ul>
              </div>
            </li>



            
          </ul>
        </div>
      </div>
    </div>
  );
}







