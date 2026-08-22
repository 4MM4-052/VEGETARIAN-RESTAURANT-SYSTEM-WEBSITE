import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { addCommentBlog } from "../../Actions/CommentBlogActions";
import { fetchCustomer } from "../../Actions/CustomerActions"; // Import fetchCustomer action
import { SuccessAlert, DangerAlert } from "../../Components/Alert/Alert";

export default function CommentBlogAdd() {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const customerState = useSelector(state => state.customer); // Get the customer data

    useEffect(() => {
        dispatch(fetchCustomer()); // Fetch customer data when component mounts
    }, [dispatch]);

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const handleErrorClose = () => {
        setOpenError(false);
    };

    const onSubmit = async (data) => {
        try {
            await dispatch(addCommentBlog(data));
            setOpenSuccess(true);
            setOpenError(false); 
            reset();
            setTimeout(() => {
                navigate('/comment-blog');
            }, 2000); 
        } catch (error) {
            setErrorMessage(error.message || 'Đã xảy ra lỗi không xác định.');
            setOpenSuccess(false); 
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
                                <div className="card-title">Thêm bình luận</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="customer_id">Chọn Khách hàng</label>
                                            <select defaultValue="1"
                                                className="form-control"
                                                id="customer_id"
                                                {...register('customer_id', { required: 'Khách hàng là bắt buộc' })}
                                            >
                                                <option value="">Chọn khách hàng</option>
                                                {customerState.customer.map((customer) => (
                                                    <option key={customer.id} value={customer.id}>
                                                        {customer.fullname}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.customer_id && <p className="text-danger">{errors.customer_id.message}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="content">Nội dung bình luận</label>
                                            <textarea
                                                className="form-control"
                                                id="content"
                                                placeholder="Nhập nội dung bình luận"
                                                {...register('content', { required: 'Nội dung là bắt buộc' })}
                                            />
                                            {errors.content && <p className="text-danger">{errors.content.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="btn-group mt-3" role="group">
                                    <button type="submit" className="btn btn-success">Xác nhận</button>
                                    <button type="button" className="btn btn-danger" onClick={() => navigate('/comment-blog')}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    {openSuccess && 
                        <SuccessAlert 
                            open={openSuccess} 
                            onClose={handleSuccessClose} 
                            message="Thêm bình luận thành công!" 
                            vertical="top" 
                            horizontal="right" 
                        />
                    }
                    {openError && 
                        <DangerAlert 
                            open={openError} 
                            onClose={handleErrorClose} 
                            message={errorMessage} 
                            vertical="top" 
                            horizontal="right" 
                        />
                    }
                </div>
            </div>
        </div>
    );
}
