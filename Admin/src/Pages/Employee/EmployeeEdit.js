import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmployees, updateEmployee } from '../../Actions/EmployeeActions';
import { fetchRole } from "../../Actions/RoleActions";
import ImageUploadComponent from '../../Components/ImageUpload/ImageUpload';
import { SuccessAlert } from '../../Components/Alert/Alert';
import { useForm } from 'react-hook-form';

export default function EmployeeEdit() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const employeeState = useSelector((state) => state.employee);
    const roleState = useSelector(state => state.role);

    const [initialAvatar, setInitialAvatar] = useState(null);
    const [avatar, setAvatar] = useState('');
    const [initialPassword, setInitialPassword] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);

    useEffect(() => {
        dispatch(fetchEmployees());
        dispatch(fetchRole());
    }, [dispatch]);

    useEffect(() => {
        const employee = employeeState.employee.find((emp) => emp.id === parseInt(id));
        if (employee) {
            setValue('fullname', employee.fullname);
            setValue('email', employee.email);
            setValue('tel', employee.tel);
            setValue('address', employee.address);
            setValue('password', '');
            setValue('role_id', employee.role_id);
            setValue('status', employee.status);
            setInitialAvatar(employee.avatar);
            setAvatar(employee.avatar); // Đặt avatar để hiển thị
            setInitialPassword(employee.password);
        }
    }, [employeeState.employee, id, setValue]);

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const onSubmit = (data) => {
        const updatedData = {
            ...data,
            password: data.password || initialPassword, // Cập nhật mật khẩu nếu có
            avatar: avatar || initialAvatar // Cập nhật avatar nếu có ảnh mới
        };


        dispatch(updateEmployee(id, updatedData));

        setOpenSuccess(true);
        setTimeout(() => {
            navigate('/employee');
        }, 1000);
    };

    const handleImageUpload = (fileNames) => {
        if (fileNames.length > 0) {
            setAvatar(fileNames[0]); // Cập nhật avatar với file mới
            setValue('avatar', fileNames[0]); // Cập nhật giá trị của avatar trong form
        }
    };


    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Cập nhật nhân viên</div>
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
                                            <input type="email" className="form-control" id="email" placeholder="Nhập email" {...register('email', { 
                                                required: 'Vui lòng điền email!',
                                                pattern: {
                                                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                                        message: 'Email không hợp lệ',
                                                    }, 
                                                })}/>
                                            {errors.email && <div className="text-danger">{errors.email.message}</div>}
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
                                            <label>Trạng thái</label>
                                            <select className="form-select" id="status" {...register('status', { required: 'Vui lòng chọn trạng thái!' })}>
                                                <option value='1'>Đang làm việc</option>
                                                <option value='0'>Nghỉ việc</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="avatar">Ảnh nhân viên</label><br/>
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
                                    <button className="btn btn-success">Cập nhật</button>
                                    <button className="btn btn-danger" onClick={() => navigate('/employee')}>Hủy</button>
                                </div>   
                            </div>
                        </div>
                    </form>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Cập nhật thông tin nhân viên thành công!" vertical="top" horizontal="right" />
                </div>
            </div>
        </div>
    );
}
