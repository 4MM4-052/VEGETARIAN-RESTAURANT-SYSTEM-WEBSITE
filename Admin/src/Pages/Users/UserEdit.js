import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploadComponent from '../../Components/ImageUpload/ImageUpload';
import { SuccessAlert } from '../../Components/Alert/Alert';
import { useForm } from 'react-hook-form';
import CustomSpinner from '../../Components/Spinner/CustomSpinner';
import { fetchRole } from '../../Actions/RoleActions';
import { fetchUserById, updateUser } from '../../Actions/UsersAction';

export default function UserEdit() {
    const { register, handleSubmit, setValue, clearErrors, formState: { errors }, reset, setError, watch } = useForm();

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userState = useSelector(state => state.users);
    const roleState = useSelector(state => state.role);

    useEffect(() => {
        dispatch(fetchRole());
    }, [dispatch]);

    const [initialAvatar, setInitialAvatar] = useState(null);
    const [avatar, setAvatar] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const userType = watch('user_type'); 


    useEffect(() => {
        const fetchUser = async (id) => {
            setLoading(true); // Start spinner while data is loading

            try {
                const user = await dispatch(fetchUserById(id)); // Await the dispatch
                if (user) {
                    setValue('fullname', user.fullname);
                    setValue('username', user.username);
                    setValue('email', user.email);
                    setValue('address', user.address);
                    setValue('tel', user.tel);
                    setValue('user_type', user.user_type);
                    setValue('role_id', user.role_id);
                    setValue('status', user.status);
                    setValue('salary', user.salary);
                    setInitialAvatar(user.avatar);
                    setAvatar(user.avatar); // Set avatar to display
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false); // Stop spinner when data is loaded
            }
        };

        fetchUser(id);
    }, [dispatch, id, setValue]);


    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const onSubmit = async (data) => {

        setLoading(true);
        const updatedData = {
            ...data,
            avatar: avatar || initialAvatar // Cập nhật avatar nếu có ảnh mới
        };

        try {
            await dispatch(updateUser(id, updatedData));
            setOpenSuccess(true);
            reset();
            setTimeout(() => {
                navigate('/users');
            }, 2000); // Điều hướng sau 2 giây để người dùng có thể xem thông báo
        } catch (error) {
            console.error('Error updating customer:', error);
        } finally {
            setLoading(false); // Dừng spinner khi hoàn tất gửi form
        }
    };

    const handleImageUpload = (fileNames) => {
        if (fileNames.length > 0) {
            setAvatar(fileNames[0]);
            setValue('avatar', fileNames[0]);
        }
    };


    if (userState.loading && loading) {
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
                                <div className="card-title">Cập nhật thông tin</div>
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
                                                        if (value === undefined || value === null || value === '') {
                                                            return true; // Không có lỗi nếu không nhập giá trị
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
                                            {initialAvatar && (
                                                <div>
                                                    <img src={initialAvatar} alt="Avatar" style={{ maxWidth: '100px', marginTop: '10px' }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action">
                                <div className="btn-group mt-3" role="group">
                                    <button type="submit" className="btn btn-success">Cập nhật</button>
                                    <button type="button" className="btn btn-danger" onClick={() => navigate('/users')}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Cập nhật thông tin khách hàng thành công!" vertical="top" horizontal="right" />
                </div>
            </div>
        </div>
    );
}