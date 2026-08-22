import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { addEmployee, checkEmailExists } from "../../Actions/EmployeeActions";
import { fetchRole } from "../../Actions/RoleActions";
import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
import { DangerAlert, SuccessAlert } from "../../Components/Alert/Alert";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";

export default function EmployeeAdd () {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setError, reset, watch } = useForm();
    const roleState = useSelector(state => state.role);

    useEffect(() => {
        dispatch(fetchRole());
    }, [dispatch]);

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
            await dispatch(addEmployee(data));
            setOpenSuccess(true);
            setTimeout(() => {
                navigate('/employee');
            }, 1000);
        } catch (error) {
            setOpenError(true); // Hiển thị thông báo lỗi
            console.error('Error adding employee:', error);
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
                                <div className="card-title">Thêm nhân viên</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="fullname">Họ và tên</label>
                                            <input type="text" className="form-control" id="fullname" placeholder="Nhập họ và tên" {...register('fullname', { required: 'Vui lòng điền họ và tên!' })}/>
                                            {errors.fullname && <div className="text-danger">{errors.fullname.message}</div>}
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
                                            <label htmlFor="tel">Số điện thoại</label>
                                            <input type="text" className="form-control" id="tel" placeholder="Nhập số điện thoại" {...register('tel', { 
                                                required: 'Vui lòng điền số điện thoại!',
                                                pattern: {
                                                        value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                                                        message: 'Số điện thoại không không đúng định dạng',
                                                    },
                                                })}/>
                                            {errors.tel && <div className="text-danger">{errors.tel.message}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Vai trò</label>
                                            <select defaultValue="1" className="form-select" id="role_id" {...register('role_id', { required: 'Vui lòng chọn vai trò!' })}>
                                                <option value="">---</option>
                                                {roleState.role && roleState.role.map((item, index) => (
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="address">Địa chỉ</label>
                                            <input type="text" className="form-control" id="address" placeholder="Nhập địa chỉ" {...register('address', { required: 'Vui lòng điền địa chỉ!' })}/>
                                            {errors.address && <div className="text-danger">{errors.address.message}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Mật khẩu</label>
                                            <input type="password" className="form-control" id="password" placeholder="Nhập mật khẩu" {...register('password', { 
                                                required: 'Vui lòng điền mật khẩu!',
                                                minLength: {
                                                        value: 8,
                                                        message: 'Mật khẩu phải có ít nhất 8 ký tự',
                                                    },
                                                    pattern: {
                                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                                        message: 'Mật khẩu phải bao gồm số và ký tự đặc biệt',
                                                    }, 
                                                })}/>
                                            {errors.password && <div className="text-danger">{errors.password.message}</div>}
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
                                            <label>Trạng thái</label>
                                            <select className="form-select" id="status" {...register('status', { required: 'Vui lòng chọn trạng thái!' })}>
                                                <option value='1'>Đang làm việc</option>
                                                <option value='0'>Nghỉ việc</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="avatar">Ảnh nhân viên</label><br/>
                                            <ImageUploadComponent id="avatar" onImageUpload={handleImageUpload} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action">
                                <div className="btn-group mt-3" role="group">
                                    <button type="submit" className="btn btn-success" disabled={loading}>Thêm mới</button>
                                    <button type="button" className="btn btn-danger" onClick={() => navigate('/employee')}>Hủy</button>
                                </div>   
                            </div>
                        </div>
                    </form>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Thêm nhân viên thành công!" vertical="top" horizontal="right" />
                    <DangerAlert open={openError} onClose={handleErrorClose} message="Có lỗi khi thêm tài khoản" vertical="top" horizontal="right" />
                </div>
            </div>
        </div>
    )
}
