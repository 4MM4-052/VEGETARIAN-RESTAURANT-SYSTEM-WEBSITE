import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
import { fetchPermissions, updatePermissions } from "../../Actions/PermissionsActions";
import { SuccessAlert } from "../../Components/Alert/Alert";
import CustomSpinner from '../../Components/Spinner/CustomSpinner';

export default function PermissionsEdit() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const permissionsState = useSelector((state) => state.permissions);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchPermissions());
    }, [dispatch]);

    useEffect(() => {
        const permission = permissionsState.permissions.find((perm) => perm.id === parseInt(id));
        if (permission) {
            setValue('name', permission.name);
            
        }
    }, [permissionsState.permissions, id, setValue]);

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const onSubmit = (data) => {
        const updatedData = {
            ...data,
        };

        dispatch(updatePermissions(id, updatedData));

        setOpenSuccess(true);
        setTimeout(() => {
            navigate('/permissions');
        },2000);
    };

    if (permissionsState.loading && loading) {
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
                                <div className="card-title">Sửa quyền hạn</div>
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
                                                {...register('name', { required: 'Tên quyền hạn là bắt buộc' })}
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
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Cập nhật quyền hạn thành công!" vertical="top" horizontal="right" />
                </div>
            </div>
        </div>
    );
}
