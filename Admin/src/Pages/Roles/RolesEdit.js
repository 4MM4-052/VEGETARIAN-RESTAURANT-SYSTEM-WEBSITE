import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRole, updateRole } from '../../Actions/RoleActions';
import { DangerAlert, SuccessAlert } from '../../Components/Alert/Alert';
import { useForm } from 'react-hook-form';

export default function RolesEdit() {
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const roleState = useSelector((state) => state.role);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const role = roleState.role.find((r) => r.id === parseInt(id));
        if (role) {
            setValue('name', role.name);
            setValue('description', role.description);
        }
        fetchRole();
    }, [roleState.role, id, setValue]);

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const handleErrorClose = () => {
        setOpenError(false);
    };

    const onSubmit = async (data) => {
        const updatedData = {
            ...data,
        };
        try {
            await dispatch(updateRole(id, updatedData));
            setOpenSuccess(true);
            setTimeout(() => {
                navigate('/role');
            }, 2000);
        } catch (error) {
            setErrorMessage(error.response?.data?.error || error.message);
            setOpenError(true);
        }
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Cập nhật vai trò</div>
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
                                                {...register('name', { required: 'Tên vai trò là bắt buộc' })}
                                                placeholder="Nhập tên vai trò"
                                            />
                                            {errors.name && <p>{errors.name.message}</p>}
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
                            <div className="card-action">
                                <div className="btn-group mt-3" role="group">
                                    <button type="submit" className="btn btn-success">Cập nhật</button>
                                    <button type="button" className="btn btn-danger" onClick={() => navigate('/role')}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Cập nhật vai trò thành công!" vertical="top" horizontal="right" />
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
