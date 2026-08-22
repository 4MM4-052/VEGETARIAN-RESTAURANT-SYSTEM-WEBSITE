import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from "react-router-dom";
import { fetchLogin } from "../../Actions/AuthActions";
import { DangerLogin, SuccessLogin } from "../../Components/Alert/Alert";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    let authState = useSelector(state => state.auth);
    const alertShown = useRef(false);

    const [openSuccess, setOpenSuccess] = useState(false);
    const [openDanger, setOpenDanger] = useState(false);
    const [click , setClick] = useState(false);

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };
    const handleDangerClose = () => {
        setOpenDanger(false);
    };

    const onSubmit = (data) => {
        dispatch(fetchLogin(data.email, data.password));
        setClick(true);
    };

    useEffect(() => {
        if (authState.auth && click) {
            setClick(false);
            setOpenDanger(false);
            setOpenSuccess(true);

            const accessToken = authState.auth.accessToken;
            const expiresIn = authState.auth.expiresIn;
            const expiryTime = Date.now() + expiresIn * 1000; // Tính thời gian hết hạn
            localStorage.setItem('token', accessToken);
            localStorage.setItem('expiryTime', expiryTime);

            if (localStorage.getItem('token') && localStorage.getItem('expiryTime')) {
                setTimeout(() => {
                    navigate('/dashboard');
                }, 500);
            }
        }
    }, [authState.auth]);

    useEffect(() => {
        if (authState.error && alertShown.current == false && click) {
            setOpenDanger(true);
            alertShown.current = true; // Đánh dấu rằng alert đã được hiển thị
        } else {
            alertShown.current = false; // Đặt lại trạng thái khi không còn lỗi
        }
    }, [authState]);

    return (
        <section className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#EEEEEE' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7 col-lg-5">
                        <div className="login-wrap p-4 p-md-5 border rounded shadow bg-white">
                            <h3 className="mb-4 text-center">Đăng nhập</h3>
                            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-text" style={{ cursor: 'pointer' }}>
                                            <i className="fa fa-envelope"></i>
                                        </span>
                                        <input type="text" className="form-control rounded-right" placeholder="Email" style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} {...register('email', { required: 'Vui lòng điền email!', pattern: {value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Email không đúng định dạng!'}})}/>
                                    </div>
                                    {errors.email && <div className="text-danger">{errors.email.message}</div>}
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-text" style={{ cursor: 'pointer' }}>
                                            <i className="fa fa-lock"></i>
                                        </span>
                                        <input type={passwordVisible ? 'text' : 'password'} className="form-control rounded-right" placeholder="Password" style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} {...register('password', { required: 'Vui lòng điền mật khẩu!' })}/>
                                        <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                            <i className={passwordVisible ? 'fa fa-eye-slash w-15' : 'fa fa-eye w-15'} inert="true"></i>
                                        </span>
                                    </div>
                                    {errors.password && <div className="text-danger">{errors.password.message}</div>}
                                </div>
                                <div className="form-group text-center">
                                    <button type="submit" className="btn btn-primary rounded submit">Đăng nhập</button>
                                </div>
                                <div className="form-group mt-1">
                                    <p><Link to="/otp">Quên mật khẩu?</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <DangerLogin open={openDanger} onClose={handleDangerClose} message="Đăng nhập thất bại!" vertical="top" horizontal="right" />
            <SuccessLogin open={openSuccess} onClose={handleSuccessClose} message="Đăng nhập thành công!" vertical="top" horizontal="right" />
        </section>
    );
}