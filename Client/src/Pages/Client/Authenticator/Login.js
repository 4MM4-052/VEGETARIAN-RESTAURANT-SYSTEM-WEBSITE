import React, { useState } from 'react'
import '../../../Assets/Client/Styles/AuthenStyle/authen.css'
import '../../../Assets/Client/Styles/AuthenStyle/util.css'
import { Link, useNavigate } from 'react-router-dom'
import GoogleAuth from '../../../Services/GoogleAuth/GoogleAuth';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../Components/Client/Spinner';
import { fetchLogin } from '../../../Actions/AuthActions';
import FacebookAuth from '../../../Services/FaceboolAuth/FacebookAuth';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginState = useSelector(state => state.auth);
    const { error } = loginState;

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');

        try {
            await dispatch(fetchLogin(data.email, data.password));
            setLoading(false);

            const user = localStorage.getItem('user');
            const accessToken = localStorage.getItem('accessToken');
            if (user && accessToken) {
                navigate('/');
            }
        } catch (err) {
            setLoading(false);
            setServerError(err.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="min-vh-100 ">
            <div className="container-fluid py-5 bg-dark hero-header">
            </div>
            <div className="container my-3">
                <div className="row justify-content-center ">
                    <div className="col-12 col-lg-6">
                        {/* Logo */}
                        {/* <div className="text-center mb-4">
                            <img
                                src="../../../Assets/Client/Images/huong-sen-logo.png"
                                alt="Lotus Logo"
                                className="img-fluid"
                                style={{ maxWidth: '150px' }}
                            />
                        </div> */}

                        {/* Social Login Options */}
                        {/* <div className="text-center mb-4">
                            <h5 className="mb-3">Đăng Nhập</h5>
                            <div className="d-flex justify-content-center gap-3">
                                <div className="btn btn-light shadow-sm">
                                    <GoogleAuth />
                                </div>
                                <div className="btn btn-light shadow-sm">
                                    <FacebookAuth />
                                </div>
                            </div>
                        </div> */}



                        <div
                            className="text-center mb-4 position-relative"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {/* Tiêu đề với icon */}
                            <h2
                                className="font-weight-bold text-dark mb-3"
                                style={{
                                    fontSize: "3.2rem",
                                    fontFamily: "'Times New Roman', sans-serif",
                                    color: "#333",
                                    letterSpacing: "2px",
                                    textTransform: "uppercase",
                                    marginBottom: "0",
                                }}
                            >
                                <i className="fas fa-handshake"></i> Chào Mừng Bạn
                                {/* Thêm icon chào đón */}
                            </h2>

                            {/* Thêm một mô tả ngắn hoặc hướng dẫn */}
                            <p
                                className="text-muted mt-3"
                                style={{
                                    fontSize: "1.4rem",
                                    fontFamily: "'Times New Roman', sans-serif",
                                    color: "#777",
                                    marginTop: "20px",
                                }}
                            >
                                <i className="fas fa-info-circle"></i> Để bắt đầu, bạn cần đăng nhập để có thể sử dụng tất cả các tính năng và ưu đãi của nhà hàng.
                            </p>

                        </div>
                        {/* Logo */}
                        <div className="text-center mb-4">
                            <img
                                src="../../../Assets/Client/Images/login.png"
                                alt="Lotus Logo"
                                className="img-fluid"
                                style={{ maxWidth: '200px' }}
                            />
                        </div>

                        {/* Social Login Options */}
                        <div className="text-center mb-4">
                            <h5 className="mb-3">Đăng Nhập</h5>
                            {/* <div className="d-flex justify-content-center gap-3">
                                <div className="btn btn-light shadow-sm">
                                    <GoogleAuth />
                                </div>
                                <div className="btn btn-light shadow-sm">
                                    <FacebookAuth />
                                </div>
                            </div> */}
                        </div>



                        {/* Divider */}
                        <div className="d-flex align-items-center my-4">
                            <hr className="flex-grow-1" />
                            <span className="mx-3 text-muted">Form Login</span>
                            <hr className="flex-grow-1" />
                        </div>

                        {/* Login Form */}
                        <div className="p-4 shadow-sm rounded">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label className="form-label">Nhập Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        {...register('email', { required: "Email là bắt buộc" })}
                                    />

                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nhập mật khẩu</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Mật khẩu"
                                        {...register('password')}
                                    />
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3 float-end">
                                    <a
                                    href="/forgot-password"
                                    className="text-decoration-none text-muted"
                                    style={{ transition: 'color 0.2s ease, font-weight 0.2s ease' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.color = '#000';
                                        e.currentTarget.style.fontWeight = '600';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.color = '#6c757d';
                                        e.currentTarget.style.fontWeight = 'normal';
                                    }}
                                    >
                                    Quên mật khẩu?
                                    </a>


                                </div>

                                <button
                                    type="submit"
                                    className="btn"
                                    style={{
                                        borderRadius: '20px',
                                        fontSize: '0.9rem',
                                        padding: '6px 16px',
                                        color: '#e83e8c',
                                        border: '1.5px solid #e83e8c',
                                        backgroundColor: 'transparent',
                                        transition: '0.25s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = '#e73cb8';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#e83e8c';

                                    }}
                                >
                                    Đăng nhập
                                </button>

                            </form>
                        </div>

                        {/* Register Option */}
                        <div className="text-center mt-3">
                            <p className="mb-1">
                                Bạn chưa có tài khoản?{' '}
                                <a href="/register" className="text-primary text-decoration-none"
                                    style={{ transition: 'color 0.2s ease, font-weight 0.2s ease' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.color = '#000';
                                        e.currentTarget.style.fontWeight = '600';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.color = '#6c757d';
                                        e.currentTarget.style.fontWeight = 'normal';
                                    }}
                                >
                                    Đăng ký ngay
                                </a>
                            </p>
                            <a href="/policy"
                                className="text-secondary text-decoration-underline"
                                style={{ transition: 'color 0.2s ease, font-weight 0.2s ease' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = '#000';
                                    e.currentTarget.style.fontWeight = '600';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = '#6c757d';
                                    e.currentTarget.style.fontWeight = 'normal';
                                }}
                            >
                                Xem chính sách của nhà hàng
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}