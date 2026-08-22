import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchStatistical } from '../Actions/StatisticalActions';
import { fetchRevenue } from '../Actions/RevenueTimeAction';
import ReactEcharts from 'echarts-for-react';
import CustomSpinner from '../Components/Spinner/CustomSpinner';

import { fetchProduct } from '../Actions/ProductActions';
import { fetchUsers } from '../Actions/UsersAction';
import { fetchBlog } from '../Actions/BlogActions';
import { fetchProductCategory } from '../Actions/ProductCategoryActions';

import { getPermissions } from '../Actions/GetQuyenHanAction';
import { jwtDecode as jwt_decode } from 'jwt-decode';

import logo from "../Assets/Images/huong-sen-logo.png";

export default function Dashboard() {
    const dispatch = useDispatch();
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

    const { loading, data, error } = useSelector(state => state.statistical);
    
    const revenueTime = useSelector((state) => state.revenueTimeReducer);
    // Dùng giá trị mặc định nếu dữ liệu chưa có
    const revenueSummary = revenueTime.data || { totalRevenue: 0, orderCount: 0 };

    const [selectedMonth, setSelectedMonth] = useState(null); // State để lưu tháng được chọn, mặc định là null (Cả năm)

    const [startDate, setStartDate] = useState(''); // Ngày bắt đầu
    const [endDate, setEndDate] = useState(''); // Ngày kết thúc

    const fetchRevenueSummary = () => {
        if (startDate && endDate) {
            dispatch(fetchRevenue(startDate, endDate)); // Redux sẽ tự quản lý state
        }
    };

    useEffect(() => {
        fetchRevenueSummary();
    }, [startDate, endDate]); // Chạy lại khi `startDate` hoặc `endDate` thay đổi    

    const productState = useSelector(state => state.product);
    const userState = useSelector(state => state.users);
    const blogState = useSelector(state => state.blog);
    const categoryState = useSelector(state => state.product_category);
    const [selectedYear, setSelectedYear] = useState(2025);


useEffect(() => {
    dispatch(fetchStatistical(selectedYear));
    dispatch(fetchProduct());
    dispatch(fetchUsers());
    dispatch(fetchBlog());
    dispatch(fetchProductCategory());
}, [dispatch, selectedYear]);


    // Hàm để chuyển đổi dữ liệu theo trạng thái của từng tháng
    const getOrderDataByMonth = () => {
    if (!data?.revenueByMonthAndStatus) return [];

    const source =
        selectedMonth === null
            ? data.revenueByMonthAndStatus
            : data.revenueByMonthAndStatus[selectedMonth - 1]
                ? [data.revenueByMonthAndStatus[selectedMonth - 1]]
                : [];

    if (source.length === 0) return [];

    const orderCounts = source.reduce((acc, month) => {
        Object.keys(month).forEach(status => {
            acc[status] = (acc[status] || 0) + month[status];
        });
        return acc;
    }, {});

    return Object.keys(orderCounts).map(status => ({
        name: status,
        value: orderCounts[status]
    }));
};


    const orderOption = () => {
    const orderData = getOrderDataByMonth();
    if (!orderData || orderData.length === 0) return {};

    return {
        tooltip: { trigger: 'item' },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: orderData.map(item => item.name)
        },
        series: [
            {
                name: 'Thống kê hóa đơn',
                type: 'pie',
                radius: '50%',
                data: orderData
            }
        ]
    };
};


    const revenueOption = () => {
    if (!data || !data.monthlyRevenue) return {};

    const fullRevenue = Array(12).fill(0);
    data.monthlyRevenue.forEach((value, index) => {
        fullRevenue[index] = value;
    });

    return {
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: 'Doanh thu',
                type: 'bar',
                data: fullRevenue
            }
        ]
    };
};


    if (loading) {
        return (
            <section className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#EEEEEE' }}>
                <CustomSpinner />
            </section>
        );
    }

    if (revenueTime.loading) {
        return (
            <section className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#EEEEEE' }}>
                <CustomSpinner />
            </section>
        )
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!hasPermission('Xem thống kê')) {
        return (
            <div className='d-flex vh-100 justify-content-center align-items-center bg-light'>
                <div className="invoice-header text-center">
                    <img style={{width: '100px'}} src={logo} alt="navbar brand" />
                    <h2>Hương Sen – Tịnh Chay Cho Mọi Hành Trình Tâm Thức</h2>
                    <p>Địa chỉ: 319/22 Lê Văn Thọ, P.8, Q.Gò Vấp, Thành phố Hồ Chí Minh</p>
                    <p>Điện thoại: 190052432 | Email: huongsen_support@gmail.com</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                    <div>
                        <h3 className="fw-bold mb-3">Dashboard</h3>
                        <h6 className="op-7 mb-2">Hương Sen Admin Dashboard</h6>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6 col-md-3">
                        <div className="card card-stats card-round">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-icon">
                                        <div
                                            className="icon-big text-center icon-primary bubble-shadow-small"
                                        >
                                            <i className="fas fa-users"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ms-3 ms-sm-0">
                                        <div className="numbers">
                                            <p className="card-category">Số lượng tài khoản</p>
                                            <h4 className="card-title">{userState.totalCount ? userState.totalCount : 0}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <div className="card card-stats card-round">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-icon">
                                        <div
                                            className="icon-big text-center icon-success bubble-shadow-small"
                                        >
                                            <i className="fas fa-file-alt"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ms-3 ms-sm-0">
                                        <div className="numbers">
                                            <p className="card-category">Số lượng bài viết</p>
                                            <h4 className="card-title">{blogState.totalCount ? blogState.totalCount : 0}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <div className="card card-stats card-round">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-icon">
                                        <div
                                            className="icon-big text-center icon-success bubble-shadow-small" style={{ backgroundColor: '#57EDE5' }}
                                        >
                                            <i className="fas fa-utensils"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ms-3 ms-sm-0">
                                        <div className="numbers">
                                            <p className="card-category">Số lượng món ăn</p>
                                            <h4 className="card-title">{productState ? productState.allProducts.length : 0}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-sm-6 col-md-3">
                        <div className="card card-stats card-round">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-icon">
                                        <div
                                            className="icon-big text-center icon-secondary bubble-shadow-small" style={{ backgroundColor: '#ED9D57' }}
                                        >
                                            <i className="fas fa-th-list"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ms-3 ms-sm-0">
                                        <div className="numbers">
                                            <p className="card-category">Số lượng danh mục</p>
                                            <h4 className="card-title">{categoryState.totalCount ? categoryState.totalCount : 0}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
                
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-round">
                            <div className="card-header">
                                <div className="card-head-row d-flex justify-content-between align-items-center">
                                    <div className="card-title">Thống Kê Hóa Đơn</div>
                                    {/* Dropdown select option nằm ngang tiêu đề */}
                                    <div className="col-md-4">
                                        <select
                                            className="form-select"
                                            value={selectedMonth || ''}
                                            onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value, 10) : null)}
                                        >
                                            <option value="">Cả năm</option>
                                            {[...Array(12).keys()].map(month => (
                                                <option key={month} value={month + 1}>Tháng {month + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="chart-container" style={{ minHeight: "375px" }}>
                                    <ReactEcharts option={orderOption()} style={{ height: '400px', width: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-round">
                            <div className="card-header">
                                <div className="card-head-row">
                                    <div className="card-title">So Sánh Doanh Thu</div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="chart-container" style={{ minHeight: "375px" }}>
                                    <ReactEcharts option={revenueOption()} style={{ height: '400px', width: '100%' }} />
                                </div>
                                <div id="myChartLegend"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card card-round">
                    <div className="card-header">
                        <div className="card-head-row">
                            <div className="card-title">Thống Kê Doanh Thu</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <label>Ngày bắt đầu</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <label>Ngày kết thúc</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={fetchRevenueSummary}
                                >
                                    Thống Kê
                                </button>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="card-stats card-round">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col-icon">
                                                <div className="icon-big text-center icon-success bubble-shadow-small">
                                                    <i className="fas fa-dollar-sign"></i>
                                                </div>
                                            </div>
                                            <div className="col col-stats ms-3 ms-sm-0">
                                                <div className="numbers">
                                                    <p className="card-category">Tổng Doanh Thu</p>
                                                    <h4 className="card-title">
                                                        {revenueSummary.totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card-stats card-round">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col-icon">
                                                <div className="icon-big text-center icon-info bubble-shadow-small">
                                                    <i className="fas fa-shopping-cart"></i>
                                                </div>
                                            </div>
                                            <div className="col col-stats ms-3 ms-sm-0">
                                                <div className="numbers">
                                                    <p className="card-category">Số Lượng Đơn Hàng</p>
                                                    <h4 className="card-title">
                                                        {revenueSummary.orderCount}
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                
                {/* <div className="row">
                    <div className="col-md-4">
                        <label>Ngày bắt đầu</label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label>Ngày kết thúc</label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                        <button
                            className="btn btn-primary w-100"
                            onClick={fetchRevenueSummary}
                        >
                            Thống Kê
                        </button>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="card card-stats card-round">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-icon">
                                        <div className="icon-big text-center icon-success bubble-shadow-small">
                                            <i className="fas fa-dollar-sign"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ms-3 ms-sm-0">
                                        <div className="numbers">
                                            <p className="card-category">Tổng Doanh Thu</p>
                                            <h4 className="card-title">
                                                {revenueSummary.totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card card-stats card-round">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-icon">
                                        <div className="icon-big text-center icon-info bubble-shadow-small">
                                            <i className="fas fa-shopping-cart"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ms-3 ms-sm-0">
                                        <div className="numbers">
                                            <p className="card-category">Số Lượng Đơn Hàng</p>
                                            <h4 className="card-title">
                                                {revenueSummary.orderCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

            </div>
        </div>
    );
}









































// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { fetchStatistical } from '../Actions/StatisticalActions';
// import { fetchRevenue } from '../Actions/RevenueTimeAction';
// import ReactEcharts from 'echarts-for-react';
// import CustomSpinner from '../Components/Spinner/CustomSpinner';

// import { fetchProduct } from '../Actions/ProductActions';
// import { fetchUsers } from '../Actions/UsersAction';
// import { fetchBlog } from '../Actions/BlogActions';
// import { fetchProductCategory } from '../Actions/ProductCategoryActions';

// import { getPermissions } from '../Actions/GetQuyenHanAction';
// import { jwtDecode as jwt_decode } from 'jwt-decode';

// import logo from "../Assets/Images/huong-sen-logo.png";

// export default function Dashboard() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const token = localStorage.getItem('token');
//     const getQuyenHanState = useSelector(state => state.getQuyenHan);
//     const permissions = getQuyenHanState.getQuyenHan || [];

//     useEffect(() => {
//         if (token) {
//           const decodedToken = jwt_decode(token);
//           const userIdFromToken = decodedToken.id;
//           dispatch(getPermissions(userIdFromToken));  
//         }
//         const decodedToken = jwt_decode(token);
//         const userIdFromToken = decodedToken.id;
//         dispatch(getPermissions(userIdFromToken));
//     }, [navigate, dispatch, token]);

//     const hasPermission = (permissionName) => {
//         return permissions.data && permissions.data.some(permission => permission.name == permissionName);
//     };

//     const { loading, data, error } = useSelector(state => state.statistical);
    
//     const revenueTime = useSelector((state) => state.revenueTimeReducer);
//     // Dùng giá trị mặc định nếu dữ liệu chưa có
//     const revenueSummary = revenueTime.data || { totalRevenue: 0, orderCount: 0 };

//     const [selectedMonth, setSelectedMonth] = useState(null); // State để lưu tháng được chọn, mặc định là null (Cả năm)

//     const [startDate, setStartDate] = useState(''); // Ngày bắt đầu
//     const [endDate, setEndDate] = useState(''); // Ngày kết thúc

//     const fetchRevenueSummary = () => {
//         if (startDate && endDate) {
//             dispatch(fetchRevenue(startDate, endDate)); // Redux sẽ tự quản lý state
//         }
//     };

//     useEffect(() => {
//         fetchRevenueSummary();
//     }, [startDate, endDate]); // Chạy lại khi `startDate` hoặc `endDate` thay đổi    

//     const productState = useSelector(state => state.product);
//     const userState = useSelector(state => state.users);
//     const blogState = useSelector(state => state.blog);
//     const categoryState = useSelector(state => state.product_category);

//     useEffect(() => {
//         dispatch(fetchStatistical());
//         dispatch(fetchProduct());
//         dispatch(fetchUsers());
//         dispatch(fetchBlog());
//         dispatch(fetchProductCategory());
//     }, [dispatch]);

//     // Hàm để chuyển đổi dữ liệu theo trạng thái của từng tháng
//     const getOrderDataByMonth = () => {
//         if (!data || !data.revenueByMonthAndStatus) return [];

//         const monthData = selectedMonth === null ? data.revenueByMonthAndStatus : [data.revenueByMonthAndStatus[selectedMonth - 1]];
//         const orderCounts = monthData.reduce((acc, month) => {
//             Object.keys(month).forEach(status => {
//                 acc[status] = (acc[status] || 0) + month[status];
//             });
//             return acc;
//         }, {});

//         return Object.keys(orderCounts).map(status => ({
//             value: orderCounts[status],
//             name: status,
//         }));
//     };

//     const orderOption = () => {
//         if (!data || !data.revenueByMonthAndStatus) return {};
//         return {
//             tooltip: {
//                 trigger: 'item'
//             },
//             legend: {
//                 orient: 'vertical',
//                 left: 'left',
//                 data: Object.keys(data.revenueByMonthAndStatus[0]) // Lấy tên trạng thái từ dữ liệu
//             },
//             series: [
//                 {
//                     name: 'Thống kê hóa đơn',
//                     type: 'pie',
//                     radius: '50%',
//                     data: getOrderDataByMonth(),
//                     emphasis: {
//                         itemStyle: {
//                             shadowBlur: 10,
//                             shadowOffsetX: 0,
//                             shadowColor: 'rgba(0, 0, 0, 0.5)'
//                         }
//                     }
//                 }
//             ]
//         };
//     };

//     const revenueOption = () => {
//         if (!data || !data.monthlyRevenue) return {};
//         const revenueData = data.monthlyRevenue; // Kiểm tra dữ liệu hoặc trả về mảng rỗng
//         return {
//             tooltip: {
//                 trigger: 'axis'
//             },
//             legend: {
//                 data: ['Doanh thu']
//             },
//             grid: {
//                 left: '3%',
//                 right: '4%',
//                 bottom: '3%',
//                 containLabel: true
//             },
//             xAxis: {
//                 type: 'category',
//                 data: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
//             },
//             yAxis: {
//                 type: 'value'
//             },
//             series: [
//                 {
//                     name: 'Doanh thu',
//                     type: 'bar',
//                     data: revenueData
//                 }
//             ]
//         };
//     };

//     if (loading) {
//         return (
//             <section className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#EEEEEE' }}>
//                 <CustomSpinner />
//             </section>
//         );
//     }

//     if (revenueTime.loading) {
//         return (
//             <section className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#EEEEEE' }}>
//                 <CustomSpinner />
//             </section>
//         )
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     if (!hasPermission('Xem thống kê')) {
//         return (
//             <div className='d-flex vh-100 justify-content-center align-items-center bg-light'>
//                 <div className="invoice-header text-center">
//                     <img style={{width: '100px'}} src={logo} alt="navbar brand" />
//                     <h2>Hương Sen - Tinh Hoa Ẩm Thực Chay</h2>
//                     <p>Địa chỉ: 778/2 Nguyễn Kiệm, Phường 04, Quận Phú Nhuận, Thành phố Hồ Chí Minh</p>
//                     <p>Điện thoại: 190052432 | Email: huongsen_support@gmail.com</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container">
//             <div className="page-inner">
//                 <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
//                     <div>
//                         <h3 className="fw-bold mb-3">Dashboard</h3>
//                         <h6 className="op-7 mb-2">Hương Sen Admin Dashboard</h6>
//                     </div>
//                 </div>

//                 {/* <div className="row">
//                     <div className="col-sm-6 col-md-3">
//                         <div className="card card-stats card-round">
//                             <div className="card-body">
//                                 <div className="row align-items-center">
//                                     <div className="col-icon">
//                                         <div
//                                             className="icon-big text-center icon-primary bubble-shadow-small"
//                                         >
//                                             <i className="fas fa-users"></i>
//                                         </div>
//                                     </div>




                                    
//                                     <div className="col col-stats ms-3 ms-sm-0">
//                                         <div className="numbers">
//                                             <p className="card-category">Số lượng tài khoản</p>
//                                             <h4 className="card-title">{userState.totalCount ? userState.totalCount : 0}</h4>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-sm-6 col-md-3">
//                         <div className="card card-stats card-round">
//                             <div className="card-body">
//                                 <div className="row align-items-center">
//                                     <div className="col-icon">
//                                         <div
//                                             className="icon-big text-center icon-success bubble-shadow-small"
//                                         >
//                                             <i className="fas fa-file-alt"></i>
//                                         </div>
//                                     </div>
//                                     <div className="col col-stats ms-3 ms-sm-0">
//                                         <div className="numbers">
//                                             <p className="card-category">Số lượng bài viết</p>
//                                             <h4 className="card-title">{blogState.totalCount ? blogState.totalCount : 0}</h4>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-sm-6 col-md-3">
//                         <div className="card card-stats card-round">
//                             <div className="card-body">
//                                 <div className="row align-items-center">
//                                     <div className="col-icon">
//                                         <div
//                                             className="icon-big text-center icon-success bubble-shadow-small" style={{ backgroundColor: '#57EDE5' }}
//                                         >
//                                             <i className="fas fa-utensils"></i>
//                                         </div>
//                                     </div>
//                                     <div className="col col-stats ms-3 ms-sm-0">
//                                         <div className="numbers">
//                                             <p className="card-category">Số lượng món ăn</p>
//                                             <h4 className="card-title">{productState ? productState.allProducts.length : 0}</h4>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-sm-6 col-md-3">
//                         <div className="card card-stats card-round">
//                             <div className="card-body">
//                                 <div className="row align-items-center">
//                                     <div className="col-icon">
//                                         <div
//                                             className="icon-big text-center icon-secondary bubble-shadow-small" style={{ backgroundColor: '#ED9D57' }}
//                                         >
//                                             <i className="fas fa-th-list"></i>
//                                         </div>
//                                     </div>
//                                     <div className="col col-stats ms-3 ms-sm-0">
//                                         <div className="numbers">
//                                             <p className="card-category">Số lượng danh mục</p>
//                                             <h4 className="card-title">{categoryState.totalCount ? categoryState.totalCount : 0}</h4>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div> */}
                
//                 {/* <div className="row">
//                     <div className="col-md-12">
//                         <div className="card card-round">
//                             <div className="card-header">
//                                 <div className="card-head-row d-flex justify-content-between align-items-center">
//                                     <div className="card-title">Thống Kê Hóa Đơn</div>
                                    
//                                     <div className="col-md-4">
//                                         <select
//                                             className="form-select"
//                                             value={selectedMonth || ''}
//                                             onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value, 10) : null)}
//                                         >
//                                             <option value="">Cả năm</option>
//                                             {[...Array(12).keys()].map(month => (
//                                                 <option key={month} value={month + 1}>Tháng {month + 1}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="card-body">
//                                 <div className="chart-container" style={{ minHeight: "375px" }}>
//                                     <ReactEcharts option={orderOption()} style={{ height: '400px', width: '100%' }} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div> */}

//                 {/* <div className="row">
//                     <div className="col-md-12">
//                         <div className="card card-round">
//                             <div className="card-header">
//                                 <div className="card-head-row">
//                                     <div className="card-title">So Sánh Doanh Thu</div>
//                                 </div>
//                             </div>
//                             <div className="card-body">
//                                 <div className="chart-container" style={{ minHeight: "375px" }}>
//                                     <ReactEcharts option={revenueOption()} style={{ height: '400px', width: '100%' }} />
//                                 </div>
//                                 <div id="myChartLegend"></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div> */}

//                 {/* <div className="card card-round">
//                     <div className="card-header">
//                         <div className="card-head-row">
//                             <div className="card-title">Thống Kê Doanh Thu</div>
//                         </div>
//                     </div>
//                     <div className="card-body">
//                         <div className="row">
//                             <div className="col-md-4">
//                                 <label>Ngày bắt đầu</label>
//                                 <input
//                                     type="date"
//                                     className="form-control"
//                                     value={startDate}
//                                     onChange={(e) => setStartDate(e.target.value)}
//                                 />
//                             </div>
//                             <div className="col-md-4">
//                                 <label>Ngày kết thúc</label>
//                                 <input
//                                     type="date"
//                                     className="form-control"
//                                     value={endDate}
//                                     onChange={(e) => setEndDate(e.target.value)}
//                                 />
//                             </div>
//                             <div className="col-md-4 d-flex align-items-end">
//                                 <button
//                                     className="btn btn-primary w-100"
//                                     onClick={fetchRevenueSummary}
//                                 >
//                                     Thống Kê
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="row mt-4">
//                             <div className="col-md-6">
//                                 <div className="card-stats card-round">
//                                     <div className="card-body">
//                                         <div className="row align-items-center">
//                                             <div className="col-icon">
//                                                 <div className="icon-big text-center icon-success bubble-shadow-small">
//                                                     <i className="fas fa-dollar-sign"></i>
//                                                 </div>
//                                             </div>
//                                             <div className="col col-stats ms-3 ms-sm-0">
//                                                 <div className="numbers">
//                                                     <p className="card-category">Tổng Doanh Thu</p>
//                                                     <h4 className="card-title">
//                                                         {revenueSummary.totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
//                                                     </h4>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="col-md-6">
//                                 <div className="card-stats card-round">
//                                     <div className="card-body">
//                                         <div className="row align-items-center">
//                                             <div className="col-icon">
//                                                 <div className="icon-big text-center icon-info bubble-shadow-small">
//                                                     <i className="fas fa-shopping-cart"></i>
//                                                 </div>
//                                             </div>
//                                             <div className="col col-stats ms-3 ms-sm-0">
//                                                 <div className="numbers">
//                                                     <p className="card-category">Số Lượng Đơn Hàng</p>
//                                                     <h4 className="card-title">
//                                                         {revenueSummary.orderCount}
//                                                     </h4>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div> */}















































//                 {/* <div className="row">
//                     <div className="col-md-4">
//                         <label>Ngày bắt đầu</label>
//                         <input
//                             type="date"
//                             className="form-control"
//                             value={startDate}
//                             onChange={(e) => setStartDate(e.target.value)}
//                         />
//                     </div>
//                     <div className="col-md-4">
//                         <label>Ngày kết thúc</label>
//                         <input
//                             type="date"
//                             className="form-control"
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                         />
//                     </div>
//                     <div className="col-md-4 d-flex align-items-end">
//                         <button
//                             className="btn btn-primary w-100"
//                             onClick={fetchRevenueSummary}
//                         >
//                             Thống Kê
//                         </button>
//                     </div>
//                 </div>

//                 <div className="row mt-4">
//                     <div className="col-md-6">
//                         <div className="card card-stats card-round">
//                             <div className="card-body">
//                                 <div className="row align-items-center">
//                                     <div className="col-icon">
//                                         <div className="icon-big text-center icon-success bubble-shadow-small">
//                                             <i className="fas fa-dollar-sign"></i>
//                                         </div>
//                                     </div>
//                                     <div className="col col-stats ms-3 ms-sm-0">
//                                         <div className="numbers">
//                                             <p className="card-category">Tổng Doanh Thu</p>
//                                             <h4 className="card-title">
//                                                 {revenueSummary.totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
//                                             </h4>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-md-6">
//                         <div className="card card-stats card-round">
//                             <div className="card-body">
//                                 <div className="row align-items-center">
//                                     <div className="col-icon">
//                                         <div className="icon-big text-center icon-info bubble-shadow-small">
//                                             <i className="fas fa-shopping-cart"></i>
//                                         </div>
//                                     </div>
//                                     <div className="col col-stats ms-3 ms-sm-0">
//                                         <div className="numbers">
//                                             <p className="card-category">Số Lượng Đơn Hàng</p>
//                                             <h4 className="card-title">
//                                                 {revenueSummary.orderCount}
//                                             </h4>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div> */}

//             </div>
//         </div>
//     );
// }