import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
import { fetchCommentBlog, updateCommentBlog } from "../../Actions/CommentBlogActions";
import { fetchCustomer } from "../../Actions/CustomerActions";
import { SuccessAlert, DangerAlert } from "../../Components/Alert/Alert";
import CustomSpinner from '../../Components/Spinner/CustomSpinner';

export default function CommentBlogEdit() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const commentBlogState = useSelector((state) => state.commentBlog);
    const customerState = useSelector((state) => state.customer); // Get the customer data
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchCustomer()); // Fetch the list of customers
        dispatch(fetchCommentBlog());
    }, [dispatch]);

    useEffect(() => {
        const commentBlog = commentBlogState.commentBlog.find((perm) => perm.id === parseInt(id));
        if (commentBlog) {
            setValue('customer_id', commentBlog.customer_id);
            setValue('content', commentBlog.content);
            setLoading(false); // Stop loading once data is set
        }
    }, [commentBlogState.commentBlog, id, setValue]);

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const handleErrorClose = () => {
        setOpenError(false);
    };

    const onSubmit = async (data) => {
        try {
            const updatedData = {
                ...data,
            };
            await dispatch(updateCommentBlog(id, updatedData));

            setOpenSuccess(true);
            setOpenError(false); 

            setTimeout(() => {
                navigate('/comment-blog');
            }, 2000);

        } catch (error) {
            setErrorMessage(error.message || 'Đã xảy ra lỗi không xác định.');
            setOpenSuccess(false);
            setOpenError(true);
        }
    };

    if (commentBlogState.loading || loading) {
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
                                <div className="card-title">Sửa bình luận</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="customer_id">Chọn Khách hàng</label>
                                            <select defaultValue="1"
                                                className="form-control"
                                                id="customer_id"
                                                {...register('customer_id', { required: 'ID khách hàng là bắt buộc' })}
                                            >
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
                            message="Cập nhật bình luận thành công!" 
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
