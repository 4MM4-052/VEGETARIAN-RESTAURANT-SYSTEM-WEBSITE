import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { DangerLogin, SuccessLogin } from '../../Components/Alert/Alert';
import { forgotPassword } from '../../Actions/AuthActions';
import CustomSpinner from '../../Components/Spinner/CustomSpinner';

export default function Otp () {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true); // Bắt đầu hiển thị spinner khi bắt đầu gửi yêu cầu
        try {
            await dispatch(forgotPassword(data.email));
            setSuccessMessage('Email đặt lại mật khẩu đã được gửi!');
            setErrorMessage('');  // Xóa thông báo lỗi nếu có
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage('');  // Xóa thông báo thành công nếu có
        } finally {
            setLoading(false); // Kết thúc hiển thị spinner sau khi hoàn tất
        }
    };

    return (
        <section className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#EEEEEE' }}>
            {loading ? (
                <CustomSpinner />
            ) : (
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 col-lg-5">
                            <div className="login-wrap p-4 p-md-5 border rounded shadow bg-white">
                                <h3 className="mb-4 text-center">Quên mật khẩu</h3>
                                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" style={{ height: '100%', display: 'flex', alignItems: 'center', borderTopRightRadius: '0', borderBottomRightRadius: '0' }}>
                                                    <i className="fa fa-envelope"></i>
                                                </span>
                                            </div>
                                            <input type="text" className="form-control rounded-right" placeholder="Email" {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ!' }}) } style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}/>
                                        </div>
                                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                    </div>
                                    <div className="form-group text-center">
                                        <button type="submit" className="btn btn-primary rounded submit">Gửi yêu cầu</button>
                                    </div>
                                    <div className="form-group mt-1">
                                        <p><Link to="/login">Đăng nhập ?</Link></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div> 
            )}
            <SuccessLogin open={!!successMessage} onClose={() => setSuccessMessage('')} message={successMessage} />
            <DangerLogin open={!!errorMessage} onClose={() => setErrorMessage('')} message={errorMessage} />
        </section>
    );
}
