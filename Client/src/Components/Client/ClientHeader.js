import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';
import normalAvatar from '../../Assets/Client/Images/default-avatar.png';

export default function ClientHeader() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    navigate('/');
    setUser(null);
  };

  const truncateName = (name, maxLength) => {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };


  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
        <NavLink to="/" className="navbar-brand p-0 d-flex align-items-center">
          <img src="../../Assets/Client/Images/huong-sen-logo.png" alt="Logo" className="mr-2" />
          <h3 className="ff-secondary text-start fw-normal m-0">
              <span style={{ color: '#e242c2' }}> Hương Sen - Cafe & Restaurant<br /> </span>
              <span style={{ color: '#FEA115' }}> Tịnh Chay Cho Mọi Hành Trình Tâm Thức </span> </h3>
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="fa fa-bars"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto py-0 pe-4">
            <NavLink to="/" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}` }>Trang chủ</NavLink>
            <NavLink to="/menu" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}` }>Menu</NavLink>
            {/* <NavLink to="/service" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}` }>Dịch vụ</NavLink> */}
            <NavLink to="/blog" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}` }>Blog</NavLink>
            <div className="nav-item dropdown">
              <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Khác</Link>
              <div className="dropdown-menu m-0">
                <NavLink to="/about" className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}` }>Về chúng tôi</NavLink>
                <NavLink to="/contact" className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}` }>Liên hệ</NavLink>
              </div>
            </div>
          </div>
<NavLink
  to="/booking"
  className="btn fw-semibold animate__animated animate__fadeInLeft"
  style={{
    borderRadius: '25px',
    fontSize: '0.95rem',
    padding: '8px 20px',
    transition: 'all 0.3s ease',
    color: '#e83e8c',
    border: '2px solid #e83e8c',
    backgroundColor: 'transparent',
    boxShadow: '0 0 6px rgba(232, 62, 140, 0.5)',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.backgroundColor = '#e83e8c';
    e.currentTarget.style.color = '#fff';
    e.currentTarget.style.boxShadow = '0 0 10px rgba(232, 62, 140, 0.8)';
    e.currentTarget.style.borderColor = '#e83e8c';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = '#e83e8c';
    e.currentTarget.style.boxShadow = '0 0 6px rgba(232, 62, 141, 0.84)';
    e.currentTarget.style.borderColor = '#e83e8c';
  }}
>
  Đặt bàn
</NavLink>

          {user ? (
            <div className="dropdown ms-2">
              <button
                className="btn dropdown-toggle d-flex align-items-center rounded-circle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  backgroundColor: 'rgb(89, 202, 230)',
                  border: '1px solid rgb(35,36,50)',
                  padding: 0,
                  width: '40px',
                  height: '40px'
                }}
              >
                <img
                  src={user.avatar || normalAvatar}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{ width: '100%', height: '100%' }}
                  onError={(e) => (e.target.src = normalAvatar)}
                />
              </button>
              <ul className="dropdown-menu dropdown-menu-end rounded-3" aria-labelledby="dropdownMenuButton">
                <li className="dropdown-header">
                  <strong>{truncateName(user.fullname, 15)}</strong>
                </li>
                <li>
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      "dropdown-item" + (isActive ? " active" : "")
                    }
                  >
                    Thông tin tài khoản
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-bookings"
                    className={({ isActive }) =>
                      "dropdown-item" + (isActive ? " active" : "")
                    }
                  >
                    Đơn đặt bàn của tôi
                  </NavLink>
                </li>

                <li><button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button></li>
              </ul>
            </div>
          ) : (
<NavLink
  to="/login"
  className="btn fw-semibold animate__animated animate__fadeInLeft ms-1"
  style={{
    borderRadius: '25px',
    fontSize: '0.95rem',
    padding: '8px 20px',
    transition: 'all 0.3s ease',
    color: '#e83e8c',
    border: '2px solid #e83e8c',
    backgroundColor: 'transparent',
    boxShadow: '0 0 6px rgba(232, 62, 140, 0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '120px',
    maxWidth: '150px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.backgroundColor = '#e83e8c';
    e.currentTarget.style.color = '#fff';
    e.currentTarget.style.boxShadow = '0 0 10px rgba(232, 62, 140, 0.8)';
    e.currentTarget.style.borderColor = '#e83e8c';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = '#e83e8c';
    e.currentTarget.style.boxShadow = '0 0 6px rgba(232, 62, 141, 0.84)';
    e.currentTarget.style.borderColor = '#e83e8c';
  }}
>
  <i className="fa-solid fa-user"></i> Đăng nhập
</NavLink>


          )}
        </div>
      </nav>
    </div>
  )
}
