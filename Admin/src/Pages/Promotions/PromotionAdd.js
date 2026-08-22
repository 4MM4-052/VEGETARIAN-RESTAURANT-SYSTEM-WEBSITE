import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { addPromotion, fetchPromotion } from "../../Actions/PromotionActions";
import { SuccessAlert } from "../../Components/Alert/Alert";

export default function PromotionAdd () {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const promotionState = useSelector(state => state.promotion);

    useEffect(() => {
        dispatch(fetchPromotion());
    }, [dispatch]);

    const navigate = useNavigate();

    const [openSuccess, setOpenSuccess] = useState(false);

    const watchValidFrom = watch('valid_from');

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const onSubmit = (data) => {
        const formatToMySQLDateTime = (isoDate) => {
            const date = new Date(isoDate);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0'); // Tháng (0-based)
            const dd = String(date.getDate()).padStart(2, '0'); // Ngày
            const hh = String(date.getHours()).padStart(2, '0'); // Giờ
            const mi = String(date.getMinutes()).padStart(2, '0'); // Phút
            const ss = String(date.getSeconds()).padStart(2, '0'); // Giây
            return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
        };

        const promotionData = {
            ...data,
            valid_from: formatToMySQLDateTime(data.valid_from), 
            valid_to: formatToMySQLDateTime(data.valid_to),
        };

        dispatch(addPromotion(promotionData))
        setOpenSuccess(true);
        reset();
        setTimeout(() => {
            navigate('/promotions');
        }, 2000);

    };

    const currentDate = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại

    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm mã khuyến mãi</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="">Mã khuyến mãi</label>
                                            <input type="text" className="form-control" id="" placeholder="Nhập mã khuyến mãi" {...register('code_name', { required: 'Vui lòng điền mã!', validate: value => {const exists = promotionState.promotion.some (p => p.code_name == value) ; return !exists || 'Mã đã tồn tại!' }})}/>
                                            {errors.code_name && <div className="text-danger">{errors.code_name.message}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="">Phần trăm giảm</label>
                                            <input type="number" className="form-control" id="" placeholder="Nhập số phần trăm" {...register('discount', { required: 'Vui lòng nhập phần trăm giảm!' , min: {value: 1, message: 'Phần trăm giảm phải lớn hơn hoặc bằng 1!'} , max: {value: 99, message: 'Phần trăm giảm phải nhỏ hơn hoặc bằng 99!'} })}/>
                                            {errors.discount && <div className="text-danger">{errors.discount.message}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="">Số lần</label>
                                            <input type="number" className="form-control" id="" placeholder="Nhập số lần dùng" {...register('quantity', { required: 'Vui lòng nhập số lần!',  min: {value: 1, message: 'Số lần không hợp lệ!'} })}/>
                                            {errors.quantity && <div className="text-danger">{errors.quantity.message}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="">Ngày bắt đầu</label>
                                            <input type="datetime-local" className="form-control" id="" {...register('valid_from', { required: 'Vui lòng nhập ngày bắt đầu!', validate: value => new Date(value) >= new Date(currentDate) || 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại!'})}/>
                                            {errors.valid_from && <div className="text-danger">{errors.valid_from.message}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="">Ngày kết thúc</label>
                                            <input type="datetime-local" className="form-control" id="" {...register('valid_to', { required: 'Vui lòng nhập ngày kết thúc!', validate: value => {if (new Date(value) <= new Date(watchValidFrom)) {return 'Ngày kết thúc không hợp lệ!'} return true}}) }/>
                                            {errors.valid_to && <div className="text-danger">{errors.valid_to.message}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Loại</label>
                                            <select defaultValue="1" className="form-select" id="type" {...register('type', { required: 'Vui lòng chọn loại!' })}>
                                                <option value="">---</option>
                                                <option value='1'>Mã đặt biệt</option>
                                                <option value='0'>Mã thường</option>
                                            </select>
                                            {errors.type && <div className="text-danger">{errors.type.message}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action">
                                <div className="btn-group mt-3" role="group">
                                    <button className="btn btn-success">Thêm</button>
                                    <button className="btn btn-danger" onClick={() => navigate('/promotions')}>Hủy</button>
                                </div>   
                            </div>
                        </div>
                    </form>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Thêm khuyến mãi thành công!" vertical="top" horizontal="right" />
                </div>
            </div>
        </div>
    )
}