import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { addPermissions } from "../../Actions/PermissionsActions";
import { SuccessAlert, DangerAlert } from "../../Components/Alert/Alert";

export default function PermissionsAdd() {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();
    const navigate = useNavigate();
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const handleErrorClose = () => {
        setOpenError(false);
    };

    const onSubmit = async (data) => {
        try {
            // Dispatch addPermissions và chờ cho đến khi hoàn thành
            await dispatch(addPermissions(data));
            setOpenSuccess(true);
            setOpenError(false); // Đảm bảo rằng thông báo lỗi bị đóng
            reset();
            setTimeout(() => {
                navigate('/permissions');
            }, 2000); // Chuyển hướng sau 2 giây để người dùng thấy thông báo
        } catch (error) {
            if (error.message === 'Duplicate entry') {
                // Xử lý lỗi trùng lặp
                setError('name', {
                    type: 'manual',
                    message: 'Tên quyền hạn đã tồn tại'
                });
                setOpenSuccess(false); // Đảm bảo rằng thông báo thành công bị đóng
                setOpenError(true);
            } else {
                // Xử lý các lỗi khác
                setErrorMessage(error.message || 'Đã xảy ra lỗi không xác định.');
                setOpenSuccess(false); // Đảm bảo rằng thông báo thành công bị đóng
                setOpenError(true);
            }
        }
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm quyền hạn</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên quyền hạn</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                placeholder="Nhập tên quyền hạn"
                                                {...register('name', { required: 'Tên là bắt buộc' })}
                                            />
                                            {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="btn-group mt-3" role="group">
                                    <button type="submit" className="btn btn-success">Xác nhận</button>
                                    <button type="button" className="btn btn-danger" onClick={() => navigate('/permissions')}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    {openSuccess && 
                        <SuccessAlert 
                            open={openSuccess} 
                            onClose={handleSuccessClose} 
                            message="Thêm quyền hạn thành công!" 
                            vertical="top" 
                            horizontal="right" 
                        />
                    }
                    {openError && 
                        <DangerAlert 
                            open={openError} 
                            onClose={handleErrorClose} 
                            message={"Tên quyền hạn đã tồn tại"} 
                            vertical="top" 
                            horizontal="right" 
                        />
                    }
                </div>
            </div>
        </div>
    );
}
