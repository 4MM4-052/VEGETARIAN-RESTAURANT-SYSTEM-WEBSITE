import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
import { DangerAlert, SuccessAlert } from "../../Components/Alert/Alert";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";
import { addUser, checkEmailExists } from "../../Actions/UsersAction";
import { fetchRole } from "../../Actions/RoleActions";

export default function UserAdd() {
    const dispatch = useDispatch();
    const { register, handleSubmit, clearErrors, formState: { errors }, setError, watch } = useForm();
    const roleState = useSelector(state => state.role);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchRole());
    }, [dispatch]);

    const [avatar, setAvatar] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [loading, setLoading] = useState(false);

    const password = watch('password');
    const userType = watch('user_type'); 

    const handleImageUpload = (fileNames) => {
        if (fileNames.length > 0) {
            setAvatar(fileNames[0]);
        }
    };

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const handleErrorClose = () => {
        setOpenError(false);
    };

    // Hàm kiểm tra email có tồn tại trên hệ thống chưa.
    const validateEmailExists = async (email) => {
        try {
            const user = await checkEmailExists(email);
            if (user) {
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

    const onSubmit = async (data) => {
        const emailIsValid = await validateEmailExists(data.email);
        if (!emailIsValid) return;

        setLoading(true);
        data.avatar = avatar;
        try {
            await dispatch(addUser(data));
            setOpenSuccess(true);
            setTimeout(() => {
                navigate('/users');
            }, 2000);
        } catch (error) {
            setOpenError(true); // Hiển thị thông báo lỗi
            console.error('Error user customer:', error);
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return (
            <div className="container">
                <CustomSpinner />
            </div>
        );
    }

    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm người dùng</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="fullname">Họ và tên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="fullname"
                                                placeholder="Nhập tên đầy đủ"
                                                {...register('fullname', { required: 'Tên là bắt buộc' })}
                                            />
                                            {errors.fullname && <p className="text-danger">{errors.fullname.message}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="username">Tên đăng nhập</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="username"
                                                placeholder="Nhập tên đăng nhập"
                                                {...register('username', { required: 'Tên đăng nhập là bắt buộc' })}
                                            />
                                            {errors.username && <p className="text-danger">{errors.username.message}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="Nhập email"
                                                {...register('email', {
                                                    required: 'Email là bắt buộc',
                                                    pattern: {
                                                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                                        message: 'Email không hợp lệ',
                                                    },
                                                    validate: async (value) => {
                                                        // Clear previous errors before validation
                                                        clearErrors('email');

                                                        // Validate if email exists
                                                        const isValid = await validateEmailExists(value);
                                                        return isValid || 'Email đã tồn tại';
                                                    }
                                                })}
                                            />
                                            {errors.email && <p className="text-danger">{errors.email.message}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="tel">Số điện thoại</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="tel"
                                                placeholder="Nhập số điện thoại"
                                                {...register('tel', {
                                                    required: 'Số điện thoại là bắt buộc',
                                                    pattern: {
                                                        value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                                                        message: 'Số điện thoại không đúng định dạng',
                                                    },
                                                })}
                                            />
                                            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="userType">Loại người dùng</label>
                                            <select defaultValue="1"
                                                className="form-control"
                                                id="user_type"
                                                {...register('user_type')}
                                            >
                                                <option value="Khách Hàng">Khách hàng</option>
                                                <option value="Nhân Viên">Nhân viên</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="status">Trạng thái</label>
                                            <select defaultValue="1"
                                                className="form-control"
                                                id="status"
                                                {...register('status')}
                                            >
                                                <option value="1">Hoạt động</option>
                                                <option value="0">Ngưng hoạt động</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="address">Địa chỉ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="address"
                                                placeholder="Nhập địa chỉ"
                                                {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                                            />
                                            {errors.address && <p className="text-danger">{errors.address.message}</p>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password">Mật khẩu</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                placeholder="Nhập mật khẩu"
                                                {...register('password', {
                                                    required: 'Mật khẩu là bắt buộc',
                                                    minLength: {
                                                        value: 8,
                                                        message: 'Mật khẩu phải có ít nhất 8 ký tự',
                                                    },
                                                    pattern: {
                                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                                        message: 'Mật khẩu phải bao gồm số và ký tự đặc biệt',
                                                    },
                                                })}
                                            />
                                            {errors.password && <p className="text-danger">{errors.password.message}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="confirmPassword">Mật khẩu xác nhận</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="confirmPassword"
                                                placeholder="Nhập mật khẩu xác nhận"
                                                {...register('confirmPassword', {
                                                    required: 'Mật khẩu xác nhận là bắt buộc',
                                                    validate: (value) => value === password || 'Mật khẩu xác nhận không khớp',
                                                })}
                                            />
                                            {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="role_id">Vai trò <strong>(Dành cho nhân viên)</strong></label>
                                            <select defaultValue="1"
                                                className="form-control"
                                                id="role_id"
                                                {...register('role_id', {
                                                    valueAsNumber: true,
                                                    disabled: userType === "Khách Hàng",
                                                })}
                                            >
                                                <option value="">Chọn vai trò cho nhân viên</option>
                                                {roleState.role && roleState.role.map((item, index) => (
                                                    <option key={item.id || index} value={item.id}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="salary">Lương <strong>(Dành cho nhân viên)</strong></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="salary"
                                                placeholder="Nhập lương"
                                                {...register('salary', {
                                                    valueAsNumber: true,
                                                    disabled: userType === "Khách Hàng",
                                                    validate: value => {
                                                        if (value === undefined || value === '') {
                                                            return true;
                                                        }
                                                        if (value < 10000) {
                                                            return 'Lương phải lớn hơn hoặc bằng 10.000đ';
                                                        }
                                                        if (value < 0) {
                                                            return 'Lương không được là số âm';
                                                        }
                                                        return true; // Không có lỗi
                                                    }
                                                })}
                                            />
                                            {errors.salary && <p className="text-danger">{errors.salary.message}</p>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="avatar">Ảnh đại diện</label><br />
                                            <ImageUploadComponent id="avatar" onImageUpload={handleImageUpload} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="btn-group mt-3" role="group">
                                    <button type="submit" className="btn btn-success" disabled={loading}>Thêm mới</button>
                                    <button type="button" className="btn btn-danger" onClick={() => navigate('/users')}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Thêm khách hàng thành công!" vertical="top" horizontal="right" />
                    <DangerAlert open={openError} onClose={handleErrorClose} message="Có lỗi khi thêm tài khoản" vertical="top" horizontal="right" />
                </div>
            </div>
        </div>
    );
}