import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct, updateProduct } from '../../Actions/ProductActions';
import { fetchCategoryProductNoPage } from "../../Actions/CategoryProductNoPageActions";
import ImageUploadComponent from '../../Components/ImageUpload/ImageUpload';
import { SuccessAlert } from '../../Components/Alert/Alert';
import { useForm } from 'react-hook-form';
import CustomSpinner from '../../Components/Spinner/CustomSpinner';

import { getPermissions } from "../../Actions/GetQuyenHanAction";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function ProductEdit () {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const getQuyenHanState = useSelector((state) => state.getQuyenHan);
    const permissions = getQuyenHanState.getQuyenHan || [];

    useEffect(() => {
    if (token) {
        const decodedToken = jwt_decode(token);
        const userIdFromToken = decodedToken.id;
        dispatch(getPermissions(userIdFromToken));
    }
    const decodedToken = jwt_decode(token);
    const userIdFromToken = decodedToken.id;
        dispatch(getPermissions(userIdFromToken));
    }, [navigate, dispatch, token]);

    const hasPermission = (permissionName) => {
        return (
            permissions.data &&
            permissions.data.some((permission) => permission.name == permissionName)
        );
    };

    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm();

    const { id } = useParams();

    const productState = useSelector((state) => state.product);
    const productCategoryState = useSelector(state => state.productCategoryNoPage);

    const [initialImage, setInitialImage] = useState(null);
    const [image, setImage] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchCategoryProductNoPage());
        dispatch(fetchProduct());
    }, [dispatch]);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true); // Bắt đầu spinner khi tải dữ liệu
            const product = productState.product.find((cust) => cust.id === parseInt(id));
            if (product) {
                setValue('name', product.name);
                setValue('product_code', product.product_code);
                setValue('price', product.price);
                setValue('sale_price', product.sale_price);
                setValue('description', product.description);
                setValue('categories_id', product.categories_id);
                setValue('status', product.status);
                setInitialImage(product.image);
                setImage(product.image);
            }
            setLoading(false); // Dừng spinner khi dữ liệu đã được tải
        }
        fetchProduct ();
    }, [productState.product, id, setValue]);

    const handleSuccessClose = () => {
        setOpenSuccess(false);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const { product_code, ...dataWithoutProductCode } = data;
        
        const updatedData = {
            ...dataWithoutProductCode,
            image: image || initialImage
        };

        try {
            await dispatch(updateProduct(id, updatedData));
            setOpenSuccess(true);
            reset();

            setTimeout(() => {
                navigate('/product');
            }, 2000);
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (fileNames) => {
        if (fileNames.length > 0) {
            setImage(fileNames[0]); // Cập nhật avatar với file mới
            setValue('image', fileNames[0]); // Cập nhật giá trị của avatar trong form
        }
    };

    if (productState.loading && loading) {
        return (
            <div className="container">
                <CustomSpinner />
            </div>
        );
    }

    const canViewCategories = hasPermission("Xem danh mục sản phẩm");

    return (
        <div className="container">
            <div className="page-inner">
                <div className="row">
                    <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Cập nhật sản phẩm</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên sản phẩm</label>
                                            <input type="text" className="form-control" id="name" placeholder="Nhập tên sản phẩm" {...register('name', { required: 'Vui lòng điền tên!' })}/>
                                            {errors.name && <div className="text-danger">{errors.name.message}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="code">Mã hiệu sản phẩm</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="product_code" 
                                                readOnly
                                                disabled
                                                style={{ backgroundColor: '#e9ecef' }}
                                                {...register('product_code')}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="price">Giá niêm yết</label>
                                            <input type="number" className="form-control" id="price" placeholder="Nhập giá niêm yết" {...register('price', { required: 'Vui lòng điền giá niêm yết!', validate: value => value >= 0 || 'Giá niêm yết không được là số âm!' })}/>
                                            {errors.price && <div className="text-danger">{errors.price.message}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Danh mục</label>
                                            {/* <select defaultValue="1"
                                                className={`form-select ${!canViewCategories ? 'is-invalid' : ''}`} 
                                                id="category_id" 
                                                {...register('categories_id', { required: canViewCategories ? 'Vui lòng chọn danh mục!' : null })} 
                                                disabled={!canViewCategories}
                                            >
                                                {canViewCategories ? (
                                                    <>
                                                        {productCategoryState.product_category && productCategoryState.product_category.map((item) => {
                                                            const isSelected = item.id === parseInt(productState.product.find((prod) => prod.id === parseInt(id))?.categories_id);
                                                            return (
                                                                <option key={item.id} value={item.id} selected={isSelected}>
                                                                    {item.name}
                                                                </option>
                                                            );
                                                        })}
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value={productState.product.find((prod) => prod.id === parseInt(id))?.categories_id} disabled>
                                                            Bạn không có quyền xem danh mục!
                                                        </option>
                                                    </>
                                                )}
                                            </select> */}

                                            <select
                                            className={`form-select ${!canViewCategories ? 'is-invalid' : ''}`}
                                            id="category_id"
                                            {...register('categories_id', {
                                                required: canViewCategories ? 'Vui lòng chọn danh mục!' : null
                                            })}
                                            defaultValue={
                                                canViewCategories
                                                ? productState.product.find((prod) => prod.id === parseInt(id))?.categories_id || ''
                                                : productState.product.find((prod) => prod.id === parseInt(id))?.categories_id || ''
                                            }
                                            disabled={!canViewCategories}
                                            >
                                            {canViewCategories ? (
                                                <>
                                                {productCategoryState.product_category?.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                    {item.name}
                                                    </option>
                                                ))}
                                                </>
                                            ) : (
                                                <option value={productState.product.find((prod) => prod.id === parseInt(id))?.categories_id} disabled>
                                                Bạn không có quyền xem danh mục!
                                                </option>
                                            )}
                                            </select>

                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Mô tả sản phẩm</label>
                                            <textarea className="form-control" id="description" rows="4" {...register('description')}></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="saleEmail">Giá khuyến mãi</label>
                                            <input type="number" className="form-control" id="sale_price" placeholder="Nhập giá khuyến mãi" {...register('sale_price', { required: 'Vui lòng điền giá khuyến mãi!' , validate: value => {const price = Number(watch('price')) ; const sale_price = Number(value) ; if (sale_price < 0) {return 'Giá khuyến mãi không được là số âm!'} if (sale_price >= price) {return 'Giá khuyến mãi không hợp lệ!'}}})}/>
                                            {errors.sale_price && <div className="text-danger">{errors.sale_price.message}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Trạng thái</label>
                                            <select defaultValue="1" className="form-select" id="status" {...register('status', { required: 'Vui lòng chọn trạng thái!' })}>
                                                <option value='1'>Đang kinh doanh</option>
                                                <option value='0'>Tạm ngưng bán</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleFormControlFile1">Ảnh sản phẩm</label><br/>
                                            <ImageUploadComponent id="image" onImageUpload={handleImageUpload} />
                                            {initialImage && (
                                                <div>
                                                    <img src={initialImage} alt="Image" style={{ maxWidth: '100px', marginTop: '10px' }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action">
                                <div className="btn-group mt-3" role="group">
                                    <button className="btn btn-success">Cập nhật</button>
                                    <button className="btn btn-danger" onClick={() => navigate('/product')}>Hủy</button>
                                </div>   
                            </div>
                        </div>
                    </form>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Cập nhật thông tin sản phẩm thành công!" vertical="top" horizontal="right" />
                </div>
            </div>
        </div>
    )
}