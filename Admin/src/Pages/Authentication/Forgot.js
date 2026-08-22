import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { changePassword } from '../../Actions/AuthActions';
import { DangerLogin, SuccessLogin } from '../../Components/Alert/Alert';
import CustomSpinner from '../../Components/Spinner/CustomSpinner';

export default function Forgot () {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    // Lấy token từ URL query parameter
    const getTokenFromQuery = () => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get('token');
    };

    const token = getTokenFromQuery();

    const onSubmit = async (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            setErrorMessage('Mật khẩu xác nhận không khớp');
            setSuccessMessage('');
            return;
        }

        setLoading(true);
        try {
            await dispatch(changePassword(token, data.newPassword));
            setSuccessMessage('Đổi mật khẩu thành công');
            setErrorMessage('');
            setTimeout(() => navigate('/login'), 2000); // Điều hướng đến trang /login sau 2 giây
        } catch (error) {
            setErrorMessage('Thay đổi mật khẩu không thành công!' || error.message);
            setSuccessMessage('');
        } finally {
            setLoading(false);
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
                                <h3 className="mb-4 text-center">Thay đổi mật khẩu</h3>
                                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-text" style={{ cursor: 'pointer' }}>
                                                <i className="fa fa-key"></i>
                                            </span>
                                            <input type={passwordVisible ? 'text' : 'password'} className="form-control" id="newPassword" placeholder="Nhập mật khẩu mới" {...register('newPassword', { required: 'Mật khẩu mới là bắt buộc', minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }, pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, message: 'Mật khẩu phải bao gồm số và ký tự đặc biệt' }})} style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}/>
                                            <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                                <i className={passwordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'} inert="true"></i>
                                            </span>
                                        </div>
                                        {errors.newPassword && <span className="text-danger">{errors.newPassword.message}</span>}
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-text" style={{ cursor: 'pointer' }}>
                                                <i className="fa fa-lock"></i>
                                            </span>
                                            <input type={confirmPasswordVisible ? 'text' : 'password'} className="form-control" id="confirmNewPassword" placeholder="Nhập lại mật khẩu mới" {...register('confirmNewPassword', { required: 'Xác nhận mật khẩu là bắt buộc', validate: value => value === watch('newPassword') || 'Mật khẩu xác nhận không khớp' })}/>
                                            <span className="input-group-text" onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
                                                <i className={confirmPasswordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'} inert="true"></i>
                                            </span>
                                        </div>
                                        {errors.confirmNewPassword && <span className="text-danger">{errors.confirmNewPassword.message}</span>}
                                    </div>
                                    <div className="form-group text-center">
                                        <button type="submit" className="btn btn-primary rounded submit">Thay đổi</button>
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
