// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from 'react-hook-form';
// import { useNavigate } from "react-router-dom";
// import { addProduct , fetchProduct } from "../../Actions/ProductActions";
// import { fetchCategoryProductNoPage } from "../../Actions/CategoryProductNoPageActions";
// import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
// import { SuccessAlert } from "../../Components/Alert/Alert";
// import CustomSpinner from "../../Components/Spinner/CustomSpinner";

// import { getPermissions } from "../../Actions/GetQuyenHanAction";
// import { jwtDecode as jwt_decode } from "jwt-decode";

// export default function ProductAdd () {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const token = localStorage.getItem("token");
//     const getQuyenHanState = useSelector((state) => state.getQuyenHan);
//     const permissions = getQuyenHanState.getQuyenHan || [];

//     useEffect(() => {
//     if (token) {
//         const decodedToken = jwt_decode(token);
//         const userIdFromToken = decodedToken.id;
//         dispatch(getPermissions(userIdFromToken));
//     }
//     const decodedToken = jwt_decode(token);
//     const userIdFromToken = decodedToken.id;
//     dispatch(getPermissions(userIdFromToken));
//     }, [navigate, dispatch, token]);

//     const hasPermission = (permissionName) => {
//     return (
//         permissions.data &&
//         permissions.data.some((permission) => permission.name == permissionName)
//     );
//     };

//     const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
//     const productState = useSelector(state => state.product);
//     const productCategoryState = useSelector(state => state.productCategoryNoPage);

//     useEffect(() => {
//         dispatch(fetchCategoryProductNoPage());
//         dispatch(fetchProduct());
//     }, [dispatch]);

//     const [imageError, setImageError] = useState('');
//     const [image, setImage] = useState('');
//     const [openSuccess, setOpenSuccess] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [randomCode, setRandomCode] = useState(generateRandomCode());

//     function generateRandomCode() {
//         return `HS${Math.floor(1000 + Math.random() * 9000)}`;
//     }

//     const regenerateCode = (e) => {
//         e.preventDefault();
//         setRandomCode(generateRandomCode());
//     };

//     const handleImageUpload = (fileNames) => {
//         if (fileNames.length > 0) {
//             setImage(fileNames[0]);
//         }
//     };

//     const handleSuccessClose = () => {
//         setOpenSuccess(false);
//     };

//     const onSubmit = async (data) => {
//         if (!image) {
//             setImageError ('Vui lòng chọn ảnh sản phẩm!');
//             return;
//         }
        
//         setImageError('');

//         data.image = image;
//         if (!data.description) {
//             data.description = 'Không có mô tả';
//         }

//         setLoading(true); // Bắt đầu spinner
//         try {
//             await dispatch(addProduct(data));
//             setOpenSuccess(true);
//             reset();
//             setTimeout(() => {
//                 navigate('/product');
//             }, 2000); // Điều hướng sau 2 giây để người dùng có thể xem thông báo
//         } catch (error) {
//             setOpenError(true); // Hiển thị thông báo lỗi
//             console.error('Error adding product:', error);
//         } finally {
//             setLoading(false); // Dừng spinner
//         }
        
//     };

//     const getUncategorizedId = () => {
//         const uncategorizedCategory = productCategoryState.product_category.find(item => item.name === "Chưa phân loại");
//         if (uncategorizedCategory) {
//             console.log('id lấy là:', uncategorizedCategory.id);
//             return uncategorizedCategory.id;
//         } else {
//             console.warn("Danh mục 'Chưa phân loại' không tồn tại!");
//             return ""; // Hoặc giá trị mặc định khác nếu cần
//         }
//     };    

//     const canViewCategories = hasPermission("Xem danh mục sản phẩm");

//     useEffect(() => {
//         if (!canViewCategories) {
//             const uncategorizedId = getUncategorizedId();
//             setValue('category_id', uncategorizedId); // Đặt giá trị mặc định cho category_id
//         }
//     }, [canViewCategories, setValue]);

//     if (loading) {
//         return (
//             <div className="container">
//                 <CustomSpinner />
//             </div>
//         );
//     }

//     return (
//         <div className="container">
//             <div className="page-inner">
//                 <div className="row">
//                     <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
//                         <div className="card">
//                             <div className="card-header">
//                                 <div className="card-title">Thêm sản phẩm</div>
//                             </div>
//                             <div className="card-body">
//                                 <div className="row">
//                                     <div className="col-md-6 col-lg-6">
//                                         <div className="form-group">
//                                             <label htmlFor="name">Tên sản phẩm</label>
//                                             <input type="text" className="form-control" id="name" placeholder="Nhập tên sản phẩm" {...register('name', { required: 'Vui lòng điền tên!' })}/>
//                                             {errors.name && <div className="text-danger">{errors.name.message}</div>}
//                                         </div>
//                                         <div className="form-group">
//                                             <label htmlFor="code">Mã hiệu sản phẩm</label>
//                                             <div className="input-group">
//                                                 <input 
//                                                     type="text" 
//                                                     className="form-control" 
//                                                     id="product_code" 
//                                                     value={randomCode}
//                                                     readOnly
//                                                     {...register('product_code', { 
//                                                         required: 'Vui lòng điền mã hiệu!',
//                                                         validate: value => {
//                                                             const exists = productState.product.some(p => p.product_code === value);
//                                                             return !exists || 'Mã hiệu sản phẩm đã tồn tại!';
//                                                         }
//                                                     })}
//                                                 />
//                                                 <button 
//                                                     className="btn btn-outline-secondary" 
//                                                     type="button"
//                                                     onClick={regenerateCode}
//                                                 >
//                                                     <i className="fas fa-sync-alt"></i>
//                                                 </button>
//                                             </div>
//                                             {errors.product_code && <div className="text-danger">{errors.product_code.message}</div>}
//                                         </div>
//                                         <div className="form-group">
//                                             <label htmlFor="price">Giá niêm yết</label>
//                                             <input type="number" className="form-control" id="price" placeholder="Nhập giá niêm yết" {...register('price', { required: 'Vui lòng điền giá niêm yết!', validate: value => value >= 0 || 'Giá niêm yết không được là số âm!' })}/>
//                                             {errors.price && <div className="text-danger">{errors.price.message}</div>}
//                                         </div>
//                                         <div className="form-group">
//                                             <label>Danh mục</label>
//                                             {/* <select className="form-select" id="category_id" {...register('category_id', { required: 'Vui lòng chọn danh mục!' })}>
//                                                 <option value="">---</option>
//                                                 {productCategoryState.product_category
//                                                     .filter(item => item.status == 1)
//                                                     .map((item, index) => (
//                                                         <option key={item.id} value={item.id}>{item.name}</option>
//                                                     ))
//                                                 }
//                                             </select> */}
//                                             <select defaultValue="1"
//                                                 className={`form-select ${!canViewCategories ? 'is-invalid' : ''}`} 
//                                                 id="category_id" 
//                                                 {...register('category_id', { required: canViewCategories ? 'Vui lòng chọn danh mục!' : null })} 
//                                                 disabled={!canViewCategories}
//                                             >
//                                                 {canViewCategories ? (
//                                                     <>
//                                                         <option value="">---</option>
//                                                         {productCategoryState.product_category
//                                                             .filter(item => item.status === 1)
//                                                             .map((item) => (
//                                                                 <option key={item.id} value={item.id}>{item.name}</option>
//                                                             ))
//                                                         }
//                                                     </>
//                                                 ) : (
//                                                     <option value={getUncategorizedId()} disabled>
//                                                         Bạn không có quyền xem danh mục!
//                                                     </option>
//                                                 )}
//                                             </select>
//                                             {errors.category_id && <div className="text-danger">{errors.category_id.message}</div>}
//                                         </div>
//                                         <div className="form-group">
//                                             <label htmlFor="description">Mô tả sản phẩm</label>
//                                             <textarea className="form-control" id="description" rows="4" {...register('description')}></textarea>
//                                         </div>
//                                     </div>
//                                     <div className="col-md-6 col-lg-6">
//                                         <div className="form-group">
//                                             <label htmlFor="saleEmail">Giá khuyến mãi</label>
//                                             <input type="number" className="form-control" id="sale_price" placeholder="Nhập giá khuyến mãi" 
//                                             {...register('sale_price', { required: 'Vui lòng điền giá khuyến mãi!' , validate: value => {const price = Number(watch('price')) ; const sale_price = Number(value) ; if (sale_price < 0) {return 'Giá khuyến mãi không được là số âm!'} if (sale_price >= price) {return 'Giá khuyến mãi không hợp lệ!'}}})}/>
//                                             {errors.sale_price && <div className="text-danger">{errors.sale_price.message}</div>}
//                                         </div>
//                                         <div className="form-group">
//                                             <label>Trạng thái</label>
//                                             <select className="form-select" id="status" defaultValue="1" {...register('status')}>
//                                                 <option value='1'>Đang kinh doanh</option>
//                                                 <option value='0'>Tạm ngưng bán</option>
//                                             </select>
//                                             {errors.status && <div className="text-danger">{errors.status.message}</div>}
//                                         </div>
//                                         <div className="form-group">
//                                             <label htmlFor="exampleFormControlFile1">Ảnh sản phẩm</label><br/>
//                                             <ImageUploadComponent id="image" onImageUpload={handleImageUpload} />
//                                             {imageError && <div className="text-danger">{imageError}</div>}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="card-action">
//                                 <div className="btn-group mt-3" role="group">
//                                     <button className="btn btn-success">Thêm</button>
//                                     <button className="btn btn-danger" onClick={() => navigate('/product')}>Hủy</button>
//                                 </div>   
//                             </div>
//                         </div>
//                     </form>
//                     <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Thêm sản phẩm thành công!" vertical="top" horizontal="right" />
//                 </div>
//             </div>
//         </div>
//     )
// }


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { addProduct, fetchProductHoatDong } from "../../Actions/ProductActions";
import { fetchCategoryProductNoPage } from "../../Actions/CategoryProductNoPageActions";
import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
import { SuccessAlert } from "../../Components/Alert/Alert";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";
import UploadExcel from '../../Components/UploadExcel';
import { getPermissions } from "../../Actions/GetQuyenHanAction";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function ProductAdd () {
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
    }, [dispatch, token]);

    const hasPermission = (permissionName) => {
        return (
            permissions.data &&
            permissions.data.some((permission) => permission.name == permissionName)
        );
    };

    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
    const productState = useSelector(state => state.product);
    const productCategoryState = useSelector(state => state.productCategoryNoPage);

    useEffect(() => {
        dispatch(fetchCategoryProductNoPage());
        dispatch(fetchProductHoatDong());
    }, [dispatch]);

    const [imageError, setImageError] = useState('');
    const [image, setImage] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [randomCode, setRandomCode] = useState(generateRandomCode());

    function generateRandomCode() {
        return `HS${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const regenerateCode = (e) => {
        e.preventDefault();
        setRandomCode(generateRandomCode());
    };

    const handleImageUpload = (fileNames) => {
        if (fileNames.length > 0) setImage(fileNames[0]);
    };

    const handleSuccessClose = () => setOpenSuccess(false);

    const onSubmit = async (data) => {
        if (!image) {
            setImageError('Vui lòng chọn ảnh sản phẩm!');
            return;
        }
        setImageError('');

        data.image = image;
        if (!data.description) data.description = 'Không có mô tả';

        setLoading(true);
        try {
            await dispatch(addProduct(data));
            
            // Hiển thị thông báo thành công
            setOpenSuccess(true);

            // Reset form
            reset();
            setRandomCode(generateRandomCode());
            setImage('');
            
            // Tự ẩn thông báo sau 2s và chuyển trang
            setTimeout(() => {
                setOpenSuccess(false);
                navigate('/product');
            }, 2000);

        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setLoading(false);
        }
    };


    const getUncategorizedId = () => {
        const uncategorizedCategory = productCategoryState.product_category.find(item => item.name === "Chưa phân loại");
        return uncategorizedCategory ? uncategorizedCategory.id : "";
    };

    const canViewCategories = hasPermission("Xem danh mục sản phẩm");

    useEffect(() => {
        if (!canViewCategories) {
            const uncategorizedId = getUncategorizedId();
            setValue('category_id', uncategorizedId);
        }
    }, [canViewCategories, setValue]);

    if (loading) {
        return <div className="container"><CustomSpinner /></div>;
    }

    return (
        <div className="container">
            <div className="page-inner">

                {/* Form thêm sản phẩm đơn lẻ */}
                <div className="row">
                    <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm sản phẩm</div>
                            </div>
                            <div className="card-body">
                                <div className="row">

                                    {/* Cột 1 */}
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label>Tên sản phẩm</label>
                                            <input type="text" className="form-control" {...register('name', { required: 'Vui lòng điền tên!' })}/>
                                            {errors.name && <div className="text-danger">{errors.name.message}</div>}
                                        </div>

                                        <div className="form-group">
                                            <label>Mã sản phẩm</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" value={randomCode} readOnly
                                                    {...register('product_code', { 
                                                        required: 'Vui lòng điền mã!',
                                                        validate: value => !productState.product.some(p => p.product_code === value) || 'Mã đã tồn tại!'
                                                    })}/>
                                                <button className="btn btn-outline-secondary" type="button" onClick={regenerateCode}>
                                                    <i className="fas fa-sync-alt"></i>
                                                </button>
                                            </div>
                                            {errors.product_code && <div className="text-danger">{errors.product_code.message}</div>}
                                        </div>

                                        <div className="form-group">
                                            <label>Giá niêm yết</label>
                                            <input type="number" className="form-control" {...register('price', { required: 'Vui lòng điền giá!', validate: value => value >= 0 || 'Không được âm!' })}/>
                                            {errors.price && <div className="text-danger">{errors.price.message}</div>}
                                        </div>

                                        <div className="form-group">
                                            <label>Danh mục</label>
                                            <select className={`form-select ${!canViewCategories ? 'is-invalid' : ''}`} disabled={!canViewCategories} {...register('category_id', { required: canViewCategories ? 'Vui lòng chọn danh mục!' : null })}>
                                                {canViewCategories ? (
                                                    <>
                                                        <option value="">---</option>
                                                        {productCategoryState.product_category.filter(item => item.status === 1).map(item => (
                                                            <option key={item.id} value={item.id}>{item.name}</option>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <option value={getUncategorizedId()} disabled>Bạn không có quyền xem danh mục!</option>
                                                )}
                                            </select>
                                            {errors.category_id && <div className="text-danger">{errors.category_id.message}</div>}
                                        </div>

                                        <div className="form-group">
                                            <label>Mô tả sản phẩm</label>
                                            <textarea className="form-control" rows="4" {...register('description')}></textarea>
                                        </div>
                                    </div>

                                    {/* Cột 2 */}
                                    <div className="col-md-6 col-lg-6">
                                        <div className="form-group">
                                            <label>Giá khuyến mãi</label>
                                            <input type="number" className="form-control" {...register('sale_price', { validate: value => {
                                                const price = Number(watch('price'));
                                                const sale_price = Number(value);
                                                if (sale_price < 0) return 'Không được âm!';
                                                if (sale_price >= price) return 'Giá khuyến mãi không hợp lệ!';
                                            }})}/>
                                            {errors.sale_price && <div className="text-danger">{errors.sale_price.message}</div>}
                                        </div>

                                        <div className="form-group">
                                            <label>Trạng thái</label>
                                            <select className="form-select" defaultValue="1" {...register('status')}>
                                                <option value='1'>Đang kinh doanh</option>
                                                <option value='0'>Tạm ngưng bán</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Ảnh sản phẩm</label><br/>
                                            <ImageUploadComponent id="image" onImageUpload={handleImageUpload} />
                                            {imageError && <div className="text-danger">{imageError}</div>}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="card-action">
                                <button className="btn btn-success">Thêm</button>
                                <button className="btn btn-danger" type="button" onClick={() => navigate('/product')}>Hủy</button>
                            </div>
                        </div>
                    </form>
                    <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Thêm sản phẩm thành công!" vertical="top" horizontal="right" />
                </div>

                {/* Upload Excel */}
                <div className="row mt-3">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm sản phẩm từ Excel</div>
                            </div>
                            <div className="card-body">
                                <UploadExcel />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
