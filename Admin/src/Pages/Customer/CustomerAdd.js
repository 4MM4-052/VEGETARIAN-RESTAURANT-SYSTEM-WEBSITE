import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { addCustomer, checkEmailExists } from "../../Actions/CustomerActions";
import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
import { DangerAlert, SuccessAlert } from "../../Components/Alert/Alert";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";

export default function CustomerAdd() {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setError, watch } = useForm();

    const navigate = useNavigate();

    const [avatar, setAvatar] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [loading, setLoading] = useState(false);

    const password = watch('password');

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
            await dispatch(addCustomer(data));
            setOpenSuccess(true);
            setTimeout(() => {
                navigate('/customer');
            }, 2000);
        } catch (error) {
            setOpenError(true); // Hiển thị thông báo lỗi
            console.error('Error adding customer:', error);
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
                                <div className="card-title">Thêm khách hàng</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="fullname">Tên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="fullname"
                                                placeholder="Nhập tên"
                                                {...register('fullname', { required: 'Tên là bắt buộc' })}
                                            />
                                            {errors.fullname && <p className="text-danger">{errors.fullname.message}</p>}
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
                                                })}
                                            />
                                            {errors.email && <p className="text-danger">{errors.email.message}</p>}
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
                                            <label htmlFor="phone">Số điện thoại</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="phone"
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
                                    </div>
                                    <div className="col-md-12">
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
                                    <button type="button" className="btn btn-danger" onClick={() => navigate('/customer')}>Hủy</button>
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