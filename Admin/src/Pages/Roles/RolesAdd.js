import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { addRole } from "../../Actions/RoleActions";
import { DangerAlert, SuccessAlert } from "../../Components/Alert/Alert";

export default function RolesAdd() {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data) => {
        try {
            // Gửi yêu cầu thêm vai trò
            await dispatch(addRole(data)); 
            setOpenSuccess(true);
            setTimeout(() => {
                navigate('/role');
            }, 2000);
        } catch (error) {
            // Kiểm tra lỗi từ phía server
            if (error.response && error.response.status === 409) {
                setErrorMessage("Vai trò đã tồn tại");
            } else {
                setErrorMessage(error.message || "Không thể tạo vai trò");
            }
            setOpenError(true);
        }
    };

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const handleErrorClose = () => {
        setOpenError(false);
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm vai trò</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên vai trò</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                placeholder="Nhập tên vai trò"
                                                {...register('name', { required: 'Tên vai trò là bắt buộc' })}
                                            />
                                            {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="description">Mô tả</label>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                id="description"
                                                placeholder="Nhập mô tả"
                                                {...register('description')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="btn-group mt-3" role="group">
                                    <button type="submit" className="btn btn-success">Thêm mới</button>
                                    <button type="button" className="btn btn-danger" onClick={() => navigate('/role')}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Thêm vai trò thành công!" vertical="top" horizontal="right" />
                    <DangerAlert
                        open={openError}
                        onClose={handleErrorClose}
                        message={"Đã xảy ra lỗi hoặc vai trò đã tồn tại"}
                        vertical="top"
                        horizontal="right"
                    />
                </div>
            </div>
        </div>
    );
}
