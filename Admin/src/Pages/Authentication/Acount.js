import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkPassword, updateProfile } from '../../Actions/AuthActions';
import { checkEmailExists } from '../../Actions/UsersAction';

import Spinner from '../../Components/Spinner/CustomSpinner';

import { jwtDecode as jwt_decode } from 'jwt-decode';
import { DangerLogin, SuccessLogin } from '../../Components/Alert/Alert';

export default function Acount() {

    const { register, handleSubmit, clearErrors, formState: { errors }, getValues, setValue, watch, reset } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { passwordCheckMessage, error } = useSelector(state => state.auth);

    const [activeTab, setActiveTab] = useState('updateInfo');
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState('');
    const [userId, setUserId] = useState(null);

    const [initialAvatar, setInitialAvatar] = useState(null);
    const [initialPassword, setInitialPassword] = useState('');

    // Hàm kiểm tra email có tồn tại trên hệ thống chưa.
    const validateEmailExists = async (email) => {
        try {
            const user = await checkEmailExists(email);
            if (user && user.id !== userId) {
                setError('email', {
                    type: 'manual',
                    message: 'Email đã tồn tại trên hệ thống',
                });
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };

    const [profile, setProfile] = useState({
        fullname: '',
        username: '',
        email: '',
        avatar: '',
        tel: '',
        address: '',
        status: '',
        salary: ''
    });

    const handleUpdateProfile = async (data) => {
        if (!userId) {
            console.error('User ID is missing');
            return;
        }

        const updatedProfile = {
            fullname: data.fullname,
            username: data.username,
            email: data.email,
            tel: data.tel,
            address: data.address,
            status: profile.status,
            salary: profile.salary,
            avatar: image || profile.avatar
        };

        try {
            const response = await dispatch(updateProfile(userId, updatedProfile));
            localStorage.setItem('user_admin', JSON.stringify(updatedProfile));
            
            const storedProfile = localStorage.getItem('user_admin');
            const parsedProfile = JSON.parse(storedProfile);
            setProfile(parsedProfile);

            // Lưu trạng thái thông báo vào localStorage
            localStorage.setItem('profileUpdateStatus', 'success');

            navigate('/acount');

        } catch (error) {
            console.error('Error updating profile:', error);
            // Lưu trạng thái thông báo lỗi vào localStorage
            localStorage.setItem('profileUpdateStatus', 'error');
            navigate('/acount');

        }
    };

    const getValue = () => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            const decodedToken = jwt_decode(accessToken);
            const userIdFromToken = decodedToken.id;
            setUserId(userIdFromToken);

            const storedProfile = localStorage.getItem('user_admin');
            if (storedProfile) {
                const parsedProfile = JSON.parse(storedProfile);
                setProfile(parsedProfile);

                // Đặt giá trị ban đầu cho form
                setValue('fullname', parsedProfile.fullname);
                setValue('username', parsedProfile.username);
                setValue('email', parsedProfile.email);
                setValue('tel', parsedProfile.tel);
                setValue('address', parsedProfile.address);
                setValue('status', parsedProfile.status);

                // Lưu giá trị avatar và password ban đầu
                setInitialAvatar(parsedProfile.avatar);
                setInitialPassword(parsedProfile.password || '');
            }
        }
    }

    useEffect(() => {
        getValue ();
    }, []);

    useEffect(() => {
        const alertStatus = localStorage.getItem('profileUpdateStatus');
        if (alertStatus) {
            setAlert({
                open: true,
                message: alertStatus === 'success' ? 'Cập nhật thông tin thành công!' : 'Cập nhật thông tin thất bại!',
                severity: alertStatus === 'success' ? 'success' : 'error'
            });
            localStorage.removeItem('profileUpdateStatus');
        }
    }, [handleUpdateProfile]);

    const handleImageUpload = (fileNames) => {
        if (fileNames.length > 0) {
            setImage(fileNames[0]);
        }
    };

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false
    });

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    const handleChangePassword = async (data) => { 
        try {
            setIsLoading(true);

            // Kiểm tra mật khẩu hiện tại
            const email = profile.email;
            const currentPassword = getValues('currentPassword');
            const passwordCheckMessage = await dispatch(checkPassword(email, currentPassword));

            console.log('Kết quả kiểm tra mật khẩu:', passwordCheckMessage);

            // Nếu mật khẩu đúng, tiến hành cập nhật mật khẩu mới
            if (passwordCheckMessage === 'Password is correct') {
                const updatedProfile = {
                    password: data.newPassword
                };

                await dispatch(updateProfile(userId, updatedProfile));

                setAlert({
                    open: true,
                    message: 'Đổi mật khẩu thành công!',
                    severity: 'success'
                });

                reSet();
                getValue ();

            } else {
                setAlert({
                    open: true,
                    message: 'Mật khẩu cũ không đúng!',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error(error);
            setAlert({
                open: true,
                message: 'Đổi mật khẩu thất bại!',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const reSet = () => {
        reset({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        });
    }

    return (
        <div className="container">
            {isLoading ? (
                <div className='mt-5'>
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className="page-inner">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card card-round">
                                    <div className="card-header">
                                        <div className="card-head-row card-tools-still-right">
                                            <div className="card-title">Thông tin của bạn</div>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="container-xxl py-5">
                                            <div className="container">
                                                <div className="row g-4">
                                                    <div className="col-md-4">
                                                        <div className="bg-white p-0 rounded text-center">
                                                            <img src={profile.avatar} alt="Avatar" className="img-fluid rounded-circle mb-3" width={110} />
                                                            <br />
                                                            <table className="table table-bordered text-center">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="col-6" style={{ textTransform: 'none' }}>Họ tên</th>
                                                                        <td className="col-6">{profile.fullname}</td>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <th className="col-6" style={{ fontWeight: '600' }}>Email</th>
                                                                        <td>{profile.email}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="col-6" style={{ fontWeight: '600' }}>Số điện thoại</th>
                                                                        <td className="col-6">{profile.tel}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="col-6" style={{ fontWeight: '600' }}>Địa chỉ</th>
                                                                        <td>{profile.address}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="col-6" style={{ fontWeight: '600' }}>Lương</th>
                                                                        <td className="col-6">{profile.salary == null ? 'Chưa biết' : profile.salary}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th className="col-6" style={{ fontWeight: '600' }}>Trạng thái</th>
                                                                        <td>{profile.status == 1 ? 'Đang làm' : 'Nghỉ việc'}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                    <div className="col-md-7 " style={{ marginLeft: '64px' }}>
                                                        <ul className="nav nav-tabs mb-3">
                                                            <li className="nav-item">
                                                                <button className={`nav-link ${activeTab == 'updateInfo' ? 'active text-primary' : 'text-dark'}`} onClick={() => setActiveTab('updateInfo')}>
                                                                    CẬP NHẬT THÔNG TIN
                                                                </button>
                                                            </li>
                                                            <li className="nav-item">
                                                                <button className={`nav-link ${activeTab == 'changePassword' ? 'active text-primary' : 'text-dark'}`} onClick={() => setActiveTab('changePassword')}>
                                                                    THAY ĐỔI MẬT KHẨU
                                                                </button>
                                                            </li>
                                                        </ul>
                                                        <div className="tab-content bg-white rounded-bottom">
                                                            {activeTab === 'updateInfo' && (
                                                                <form onSubmit={handleSubmit(handleUpdateProfile)}>
                                                                    <div className="row g-3">

                                                                        <div className="col-md-7">
                                                                            <div className="form-floating">
                                                                                <input type="text" className="form-control" id="fullname" placeholder="Họ và Tên" {...register('fullname', { required: "Họ và tên là bắt buộc" })}/>
                                                                                <label htmlFor="fullname">Họ và Tên</label>
                                                                                {errors.fullname && <span className="text-danger">{errors.fullname.message}</span>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-5" style={{ marginLeft: '-5px' }}>
                                                                            <div className="form-floating">
                                                                                <input type="tel" className="form-control" id="username" placeholder="Tên đăng nhập" {...register('username', { required: "Tên đăng nhập là bắt buộc" })}/>
                                                                                <label htmlFor="tel">Tên đăng nhập</label>
                                                                                {errors.username && <span className="text-danger">{errors.username.message}</span>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            <div className="form-floating">
                                                                                <input type="email" className="form-control" id="email" placeholder="Email" {...register('email', { required: "Email là bắt buộc", validate: async (value) => { clearErrors('email') ; const isValid = await validateEmailExists(value) ; return isValid || 'Email đã tồn tại' ;} })} />
                                                                                <label htmlFor="email">Email</label>
                                                                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-5" style={{ marginLeft: '-5px' }}>
                                                                            <div className="form-floating">
                                                                                <input type="tel" className="form-control" id="tel" placeholder="Số Điện Thoại" {...register('tel', { required: 'Số điện thoại là bắt buộc', pattern: { value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, message: 'Số điện thoại không đúng định dạng',},})}/>
                                                                                <label htmlFor="tel">Số Điện Thoại</label>
                                                                                {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            <div className="form-floating">
                                                                                <label htmlFor="avatar">Avatar</label>
                                                                                <ImageUploadComponent id="avatar" onImageUpload={handleImageUpload}/>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-5" style={{ marginLeft: '-5px' }}>
                                                                            <div className="form-floating">
                                                                                <input type="text" className="form-control" id="address" placeholder="Địa Chỉ" {...register('address', { required: 'Địa chỉ là bắt buộc' })}/>
                                                                                <label htmlFor="address">Địa Chỉ</label>
                                                                                {errors.address && <p className="text-danger">{errors.address.message}</p>}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="btn-group" role="group">
                                                                                <button className="btn btn-success" type="submit">Cập nhật</button>
                                                                                <div className="btn btn-danger" onClick={getValue}>Đặt lại</div>
                                                                            </div>   
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            )}
                                                            {activeTab === 'changePassword' && (
                                                                <form onSubmit={handleSubmit(handleChangePassword)}>
                                                                    <div className="row g-3">
                                                                        <div className="col-12 position-relative">
                                                                            <div className="form-floating">
                                                                                <input type={showPassword.currentPassword ? "text" : "password"} className="form-control" id="currentPassword" placeholder="Mật Khẩu Cũ" {...register('currentPassword', { required: "Mật khẩu cũ là bắt buộc" })}/>
                                                                                <label htmlFor="currentPassword">Mật Khẩu Cũ</label>
                                                                                <i
                                                                                    className={`fa ${showPassword.currentPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute top-50 end-0 translate-middle-y pe-3`}
                                                                                    onClick={() => togglePasswordVisibility('currentPassword')}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                />
                                                                                {errors.currentPassword && <span className="text-danger">{errors.currentPassword.message}</span>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 position-relative">
                                                                            <div className="form-floating">
                                                                                <input type={showPassword.newPassword ? "text" : "password"} className="form-control" id="newPassword" placeholder="Mật Khẩu Mới" {...register('newPassword', { required: 'Mật khẩu là bắt buộc', minLength: { value: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }, pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, message: 'Mật khẩu phải bao gồm số và ký tự đặc biệt' }})}/>
                                                                                <label htmlFor="newPassword">Mật Khẩu Mới</label>
                                                                                <i
                                                                                    className={`fa ${showPassword.newPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute top-50 end-0 translate-middle-y pe-3`}
                                                                                    onClick={() => togglePasswordVisibility('newPassword')}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                />
                                                                                {errors.newPassword && <span className="text-danger">{errors.newPassword.message}</span>}       
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 position-relative">
                                                                            <div className="form-floating">
                                                                                <input type={showPassword.confirmNewPassword ? "text" : "password"} className="form-control" id="confirmNewPassword" placeholder="Nhập Lại Mật Khẩu Mới" {...register('confirmNewPassword', { required: 'Xác nhận mật khẩu là bắt buộc', validate: (value) => value === getValues('newPassword') || 'Mật khẩu không khớp' })}/>
                                                                                <label htmlFor="confirmNewPassword">Nhập Lại Mật Khẩu Mới</label>
                                                                                <i
                                                                                    className={`fa ${showPassword.confirmNewPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute top-50 end-0 translate-middle-y pe-3`}
                                                                                    onClick={() => togglePasswordVisibility('confirmNewPassword')}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                />
                                                                                {errors.confirmNewPassword && <span className="text-danger">{errors.confirmNewPassword.message}</span>}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="btn-group" role="group">
                                                                                <button className="btn btn-success" type="submit">Đổi mật khẩu</button>
                                                                                <div className="btn btn-danger" onClick={reSet}>Đặt lại</div>
                                                                            </div>   
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <SuccessLogin open={alert.open && alert.severity === 'success'} onClose={() => setAlert({ ...alert, open: false })} message={alert.message} />
            <DangerLogin open={alert.open && alert.severity === 'error'} onClose={() => setAlert({ ...alert, open: false })} message={alert.message} />
        </div>
    );
}