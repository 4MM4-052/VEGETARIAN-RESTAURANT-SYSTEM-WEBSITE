import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductCategory, updateProductCategory } from '../../Actions/ProductCategoryActions';
import { SuccessAlert } from '../../Components/Alert/Alert';
import { useForm } from 'react-hook-form';

export default function CategoryProductEdit () {
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productCategoryState = useSelector(state => state.product_category);

    const [openSuccess, setOpenSuccess] = useState(false);

    useEffect(() => {
        dispatch(fetchProductCategory());
    }, [dispatch]);

    useEffect(() => {
        const product_category = productCategoryState.product_category.find((cust) => cust.id === parseInt(id));
        if (product_category) {
            setValue('name', product_category.name);
            setValue('status', product_category.status);
        }
    }, [productCategoryState.product_category, id, setValue]);

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const onSubmit = (data) => {
        const updatedData = {
            ...data,
        };

        dispatch(updateProductCategory(id, updatedData));

        setOpenSuccess(true);
        setTimeout(() => {
            navigate('/category-product');
        }, 2000);
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Cập nhật danh mục</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên danh mục</label>
                                            <input type="text" className="form-control" id="name" placeholder="Nhập tên danh mục" {...register('name', { required: 'Vui lòng điền tên danh mục!', validate: value => {const exists = productCategoryState.product_category.some (p => p.name == value && p.id !== parseInt(id)) ; return !exists || 'Tên danh mục đã tồn tại!' }})}/>
                                            {errors.name && <div className="text-danger">{errors.name.message}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group h-75">
                                            <label>Trạng thái</label>
                                            <select defaultValue="1" className="form-select h-75" id='status' {...register('status')}>
                                                <option value='1'>Hoạt động</option>
                                                <option value="0">Ngưng hoạt động</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action">
                                <div className="btn-group mt-3" role="group">
                                    <button className="btn btn-success">Cập nhật</button>
                                    <button className="btn btn-danger" onClick={() => navigate('/category-product')}>Hủy</button>
                                </div>   
                            </div>
                        </div>
                    </form>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Cập nhật danh mục thành công!" vertical="top" horizontal="right" />
                </div>
            </div>
        </div>
    )
}