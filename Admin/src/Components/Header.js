// import React, { useEffect, useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom';
// import { fetchRetime } from '../Actions/Reservations_t_AdminActions';

// export default function Header() {
//     const navigate = useNavigate();

//     // Khởi tạo state để lưu trữ dữ liệu reservations
//     const [reservations, setReservations] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetchRetime();
//                 setReservations(response?.results || []);
//             } catch (error) {
//                 console.error('Error fetching reservations:', error);
//             }
//         };    

//         // Lần đầu gọi hàm lấy dữ liệu
//         fetchData();

//         // Đặt setInterval để tự động gọi API sau mỗi 5 giây
//         const intervalId = setInterval(fetchData, 5000);

//         // Dọn dẹp interval khi component bị unmount
//         return () => clearInterval(intervalId);
//     }, []);

    
//     const getUser = () => {
//         if (localStorage.getItem ('user_admin')) {
//             return JSON.parse(localStorage.getItem ('user_admin'));
//         } else {
//             return null;
//         }
//     }

//     const logOut = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('expiryTime');
//         localStorage.removeItem('user_admin');
//         navigate('/login');
//     }

//     const user_admin = getUser();
//         // Check if reservations is an array and is not empty.
//         if (!Array.isArray(reservations)) {
//             console.warn("reservations is not an array:", reservations);
//             return;
//         }
        

//     // Lấy 5 đơn đầu tiên từ danh sách
//     const firstFiveReservations = reservations.slice(0, 5);

//     // Lọc đơn có trạng thái "Chờ thanh toán cọc" (giả định status = 1) từ 5 đơn đầu tiên
//     let unconfirmedReservations = firstFiveReservations.filter(reservation => reservation.status === 1);

//     // Giới hạn hiển thị tối đa 4 đơn
//     unconfirmedReservations = unconfirmedReservations.slice(0, 4);

//     // console.warn("reservations is not an array or is empty:", reservations);

//     return (
//         <div className="main-header">
//             <div className="main-header-logo">
//                 <div className="logo-header" data-background-color="dark">
//                     <a href="index.html" className="logo">
//                         <img
//                             src="../Assets/Images/kaiadmin/logo_light.svg"
//                             alt="navbar brand"
//                             className="navbar-brand"
//                             height="20"
//                         />
//                     </a>
//                     <div className="nav-toggle">
//                         <button className="btn btn-toggle toggle-sidebar">
//                             <i className="gg-menu-right"></i>
//                         </button>
//                         <button className="btn btn-toggle sidenav-toggler">
//                             <i className="gg-menu-left"></i>
//                         </button>
//                     </div>
//                     <button className="topbar-toggler more">
//                         <i className="gg-more-vertical-alt"></i>
//                     </button>
//                 </div>
//             </div>
//             <nav
//                 className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom"
//             >
//                 <div className="container-fluid">
//                     <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
//                         <li className="nav-item topbar-icon dropdown hidden-caret">
//                             <a
//                                 className="nav-link dropdown-toggle"
//                                 href="#"
//                                 id="notifDropdown"
//                                 role="button"
//                                 data-bs-toggle="dropdown"
//                                 aria-haspopup="true"
//                                 aria-expanded="false"
//                             >
//                                 <i className="fa fa-bell"></i>
//                                 {/* Số lượng thông báo */}
//                                 <span className="notification">{unconfirmedReservations.length}</span>
//                             </a>
//                             <ul
//                                 className="dropdown-menu notif-box animated fadeIn"
//                                 aria-labelledby="notifDropdown"
//                             >
//                                 <li>
//                                     <div className="dropdown-title">
//                                         Bạn có {unconfirmedReservations.length} hóa đơn chưa thanh toán cọc
//                                     </div>
//                                 </li>
//                                 <li>
//                                     <div className="notif-scroll scrollbar-outer">
//                                         <div className="notif-center">
//                                             {unconfirmedReservations.map((reservation, index) => (
//                                                 <div key={index} style={notifItemStyle}>
//                                                     <div className="notif-content" style={notifContentStyle}>
//                                                         <span className="block" style={notifTitleStyle}>
//                                                             Đơn #{reservation.id} của {reservation.fullname}
//                                                         </span>
//                                                         <span className="time" style={notifTimeStyle}>
//                                                             {new Date(reservation.created_at).toLocaleString()}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </li>
//                                 <li>
//                                     <Link to='/reservation' className="see-all">Danh sách đặt bàn<i className="fa fa-angle-right"></i></Link>
//                                 </li>
//                             </ul>
//                         </li>

//                         <li className="nav-item topbar-user dropdown hidden-caret">
//                             <a
//                                 className="dropdown-toggle profile-pic"
//                                 data-bs-toggle="dropdown"
//                                 href="#"
//                                 aria-expanded="false"
//                             >
//                                 <div className="avatar-sm">
//                                     <img
//                                         src={user_admin ? user_admin.avatar : 'Guest'}
//                                         alt="..."
//                                         className="avatar-img rounded-circle"
//                                     />
//                                 </div>
//                                 <span className="profile-username">
//                                     <span className="op-7">Hi,</span>
//                                     <span className="fw-bold">{user_admin ? user_admin.username : 'Guest'}</span>
//                                 </span>
//                             </a>
//                             <ul className="dropdown-menu dropdown-user animated fadeIn">
//                                 <div className="dropdown-user-scroll scrollbar-outer">
//                                     <li>
//                                         <div className="user-box">
//                                             <div className="avatar-lg">
//                                                 <img
//                                                     src={user_admin ? user_admin.avatar : 'Guest'}
//                                                     alt="image profile"
//                                                     className="avatar-img rounded"
//                                                 />
//                                             </div>
//                                             <div className="u-text">
//                                                 <h4>{user_admin ? user_admin.username : 'Guest'}</h4>
//                                                 <p className="text-muted">{user_admin ? user_admin.email : 'Guest'}</p>
//                                             </div>
//                                         </div>
//                                     </li>
//                                     <li>
//                                         <div className="dropdown-divider"></div>
//                                         <Link to='/acount' className="dropdown-item">Thông tin cá nhân</Link>

//                                         <div className="dropdown-divider"></div>
//                                         <a className="dropdown-item" href='#' onClick={logOut}>Đăng xuất</a>
//                                     </li>
//                                 </div>
//                             </ul>
//                         </li>
//                     </ul>
//                 </div>
//             </nav>
//         </div>
//     )
// }

// const notifItemStyle = {
//     display: 'block',
//     padding: '10px 22px',
//     backgroundColor: '#f9f9f9',
//     marginBottom: '5px',
//     borderRadius: '5px',
//     textDecoration: 'none',
//     color: '#333'
// };

// const notifContentStyle = {
//     display: 'flex',
//     flexDirection: 'column'
// };

// const notifTitleStyle = {
//     fontSize: '14px',
//     fontWeight: '600'
// };

// const notifTimeStyle = {
//     fontSize: '12px',
//     color: '#999'
// };






import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchRetime } from '../Actions/Reservations_t_AdminActions';

export default function Header() {
    const navigate = useNavigate();
    
    // Khởi tạo state để lưu trữ dữ liệu reservations
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm fetch dữ liệu
        const fetchData = async () => {
            try {
                setLoading(true);  // Bắt đầu loading
                const response = await fetchRetime();
                setReservations(response?.results || []);
                setLoading(false);  // Xử lý xong thì dừng loading
            } catch (err) {
                setLoading(false);
                setError(err.message);  // Nếu có lỗi, set lỗi vào state
                console.error('Error fetching reservations:', err);
            }
        };

        fetchData();  // Lần đầu gọi hàm lấy dữ liệu

        // Đặt setInterval để tự động gọi API sau mỗi 5 giây
        const intervalId = setInterval(fetchData, 5000);

        // Dọn dẹp interval khi component bị unmount
        return () => clearInterval(intervalId);
    }, []); // Mảng rỗng để chỉ gọi lần đầu khi component được render

    const getUser = () => {
        if (localStorage.getItem('user_admin')) {
            return JSON.parse(localStorage.getItem('user_admin'));
        }
        return null;
    };

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expiryTime');
        localStorage.removeItem('user_admin');
        navigate('/login');
    };

    const user_admin = getUser();

    // Kiểm tra nếu reservations không phải là mảng
    if (!Array.isArray(reservations)) {
        console.warn("reservations is not an array:", reservations);
        return <div>Error: Invalid reservations data.</div>;
    }

    // Lấy 5 đơn đầu tiên từ danh sách
    const firstFiveReservations = reservations.slice(0, 5);

    // Lọc đơn có trạng thái "Chờ thanh toán cọc" (giả định status = 1) từ 5 đơn đầu tiên
    let unconfirmedReservations = firstFiveReservations.filter(reservation => reservation.status === 1);

    // Giới hạn hiển thị tối đa 4 đơn
    unconfirmedReservations = unconfirmedReservations.slice(0, 4);

    return (
        <div className="main-header">
            <div className="main-header-logo">
                <div className="logo-header" data-background-color="dark">
                    {/* <a href="index.html" className="logo">
                        <img
                            src="../Assets/Images/kaiadmin/logo_light.svg"
                            alt="navbar brand"
                            className="navbar-brand"
                            height="20"
                        />
                    </a> */}
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
            <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
                <div className="container-fluid">
                    <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">


                        <li className="nav-item topbar-icon dropdown hidden-caret">
                            <a className="nav-link dropdown-toggle" href="#" id="notifDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-bell"></i>
                                <span className="notification">{unconfirmedReservations.length}</span>
                            </a>
                            <ul className="dropdown-menu notif-box animated fadeIn" aria-labelledby="notifDropdown">
                                <li>
                                    <div className="dropdown-title">
                                        Bạn có {unconfirmedReservations.length} hóa đơn chưa thanh toán cọc
                                    </div>
                                </li>
                                <li>
                                    <div className="notif-scroll scrollbar-outer">
                                        <div className="notif-center">
                                            {unconfirmedReservations.map((reservation) => (
                                                 <div key={reservation.id} style={notifItemStyle}>
                                                    <div className="notif-content" style={notifContentStyle}>
                                                        <span className="block" style={notifTitleStyle}>
                                                            Đơn #{reservation.id} của {reservation.fullname}
                                                        </span>
                                                        <span className="time" style={notifTimeStyle}>
                                                            {new Date(reservation.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link to='/reservation' className="see-all">Danh sách đặt bàn<i className="fa fa-angle-right"></i></Link>
                                </li>
                            </ul>
                        </li>



                        <li className="nav-item topbar-user dropdown hidden-caret" >
                            <a className="dropdown-toggle profile-pic" data-bs-toggle="dropdown" href="#" aria-expanded="false">
                                <div className="avatar-sm">
                                    <img src={user_admin ? user_admin.avatar : 'Guest'} alt="..." className="avatar-img rounded-circle" />
                                </div>
                                <span className="profile-username">
                                    <span className="op-7">Hi,</span>
                                    <span className="fw-bold">{user_admin ? user_admin.username : 'Guest'}</span>
                                </span>
                            </a>
                            <ul className="dropdown-menu dropdown-user animated fadeIn">
                                <div className="dropdown-user-scroll scrollbar-outer" style={{ minWidth: '320px' }}>
                                    <li>
                                        <div className="user-box">
                                            <div className="avatar-lg">
                                                <img src={user_admin ? user_admin.avatar : 'Guest'} alt="image profile" className="avatar-img rounded" />
                                            </div>
                                            <div className="u-text">
                                                <h4>{user_admin ? user_admin.username : 'Guest'}</h4>
                                                <p className="text-muted" style={{fontSize: '0.86rem' }}>{user_admin ? user_admin.email : 'Guest'}</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dropdown-divider"></div>
                                        <Link to='/acount' className="dropdown-item">Thông tin cá nhân</Link>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item" href='#' onClick={logOut}>Đăng xuất</a>
                                    </li>
                                </div>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

const notifItemStyle = {
    display: 'block',
    padding: '10px 22px',
    backgroundColor: '#f9f9f9',
    marginBottom: '5px',
    borderRadius: '5px',
    textDecoration: 'none',
    color: '#333'
};

const notifContentStyle = {
    display: 'flex',
    flexDirection: 'column'
};

const notifTitleStyle = {
    fontSize: '14px',
    fontWeight: '600'
};

const notifTimeStyle = {
    fontSize: '12px',
    color: '#999'
};
