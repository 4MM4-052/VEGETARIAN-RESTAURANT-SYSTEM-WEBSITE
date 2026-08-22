// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchListProductCategory,
//   fetchProductCategoryHoatDong,
// } from "../../Actions/ProductCategoryActions";
// import {
//   fetchMenu,
//   fetchProductHoatDong,
// } from "../../Actions/ProductActions";
// import unidecode from "unidecode";
// import { Link, useNavigate } from "react-router-dom";
// import Spinner from "../../Components/Client/Spinner";
// import Pagination from '@mui/material/Pagination';

// export default function Menu() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const productCategoryState = useSelector((state) => state.product_category);
//   const productState = useSelector((state) => state.product);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 20; //TODO setting limit/trang ở đây

//   useEffect(() => {
//     dispatch(fetchListProductCategory());
//     dispatch(fetchMenu());
//   }, [dispatch]);

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   // Hàm tạo slug từ tên sản phẩm
//   const createSlug = (name) => {
//     return unidecode(name) // Chuyển đổi ký tự tiếng Việt thành ký tự không dấu
//       .toLowerCase() // Chuyển thành chữ thường
//       .replace(/[^a-z0-9]/g, "-") // Thay thế ký tự không phải chữ cái hoặc số bằng dấu -
//       .replace(/-+/g, "-") // Thay thế nhiều dấu - bằng 1 dấu -
//       .replace(/^-+/, "") // Xóa dấu - ở đầu chuỗi
//       .replace(/-+$/, ""); // Xóa dấu - ở cuối chuỗi
//   };


//   const handleProductClick = (name) => {
//     const slug = createSlug(name);
//     navigate(`/product-detail/${slug}.html`);
//   };

//   const handleCategoryClick = (categoryId) => {
//     setSelectedCategory(categoryId);
//     setCurrentPage(1);
//   };

//   const productsInCategorySelected = selectedCategory
//     ? productState.product.filter((product) => product.categories_id === selectedCategory)
//     : productState.product;

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = productsInCategorySelected.slice(indexOfFirstProduct, indexOfLastProduct);

//   const totalPages = Math.ceil(productsInCategorySelected.length / productsPerPage);

//   return (
//     <div>
//       {/* Tiêu đề */}
//       <div className="py-5 bg-dark hero-header mb-3">
//         <div className="container text-center my-5 pt-5 pb-4">
//           <h1 className="display-3 text-white mb-3 animated slideInDown">
//             Thực Đơn
//           </h1>
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb justify-content-center text-uppercase">
//               <li className="breadcrumb-item">
//                 <Link to="/">Trang chủ</Link>
//               </li>
//               <li className="breadcrumb-item text-white active" aria-current="page">
//                 Thực Đơn
//               </li>
//             </ol>
//           </nav>
//         </div>
//       </div>

//       <div className="container-fluid">
//         <div className="row justify-content-center">
//           {/* Sidebar */}
//           <div className="col-lg-3 col-md-4 bg-light" style={{
//             minHeight: '100vh',
//             padding: '20px',
//             boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
//             overflowY: 'auto'
//           }}>
//             <div className="text-center">
//               <h4 className="mb-4 ff-secondary fw-normal section-title" style={{ fontWeight: 'bold', color: '#FEA100' }}>THỰC ĐƠN</h4>
//             </div>
//             <ul className="list-group">
//               <li className={`list-group-item d-flex align-items-center ${selectedCategory === null ? 'active' : ''}`}
//                 style={{ cursor: 'pointer', transition: 'background-color 0.3s', padding: '15px 20px', borderRadius: '8px', marginBottom: '10px' }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffd17a'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
//                 onClick={() => handleCategoryClick(null)}>
//                 <i className="icon-class" style={{ marginRight: '15px', fontSize: '1.5rem', color: '#FEA100' }}></i>
//                 <span style={{ fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>Xem tất cả</span>
//               </li>
//               {productCategoryState.product_category.map((item) => (
//                 <li className={`list-group-item d-flex align-items-center ${selectedCategory === item.id ? 'active' : ''}`}
//                   key={item.id}
//                   style={{ cursor: 'pointer', transition: 'background-color 0.3s', padding: '15px 20px', borderRadius: '8px', marginBottom: '10px' }}
//                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffd17a'}
//                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
//                   onClick={() => handleCategoryClick(item.id)}>
//                   <i className="icon-class" style={{ marginRight: '15px', fontSize: '1.5rem', color: '#FEA100' }}></i>
//                   <span style={{ fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>{item.name}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Nội dung chính - điều chỉnh col và thêm padding */}
//           <div className="col-lg-9 col-md-8" style={{ padding: '20px' }}>
//             {productCategoryState.loading && <Spinner />}
//             {!productCategoryState.loading && productCategoryState.product_category.length === 0 && (
//               <div>No categories found.</div>
//             )}
//             {productCategoryState.error && (
//               <div>Error: {productCategoryState.error}</div>
//             )}

//             {/* Hiển thị danh sách món ăn theo danh mục đã chọn */}
//             {selectedCategory !== null && (
//               <div className="container-xxl py-5">
//                 <div className="container">
//                   <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
//                     <h5 className="section-title ff-secondary text-center text-primary fw-normal">
//                       Nhà Hàng Hương Sen
//                     </h5>
//                     <h1 className="mb-5">{productCategoryState.product_category.find(cat => cat.id === selectedCategory)?.name}</h1>
//                   </div>

//                   <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.1s">
//                     <div className="tab-content">
//                       <div id="tab-1" className="tab-pane fade show p-0 active">
//                         <div className="row" style={{ rowGap: "20px" }}>
//                           {currentProducts.length === 0 ? (
//                             <div className="text-center" style={{ marginTop: '20px', fontSize: '1.2rem', color: '#333' }}>
//                               Đang cập nhật thêm món ăn...
//                             </div>
//                           ) : (
//                             currentProducts.map((product) => (
//                               <div className="col-lg-6" key={product.id}>
//                                 <div
//                                   className="d-flex align-items-center"
//                                   onClick={() => handleProductClick(product.name)}
//                                   style={{ cursor: "pointer" }}
//                                 >
//                                   <img
//                                     className="flex-shrink-0 img-fluid rounded"
//                                     src={product.image}
//                                     alt={product.name}
//                                     style={{
//                                       width: "150px",
//                                       height: "150px",
//                                       objectFit: "cover",
//                                       borderRadius: "10px",
//                                     }}
//                                   />
//                                   {product.sale_price > 0 ? (
//                                     <div className="w-100 d-flex flex-column text-start ps-4">
//                                       <h5 className="d-flex justify-content-between border-bottom pb-2">
//                                         <span>{product.name}</span>
//                                         <span className="text-primary" style={{ fontSize: "1rem" }}>
//                                           {formatPrice(product.price - product.sale_price)}
//                                         </span>
//                                       </h5>
//                                       <div className="d-flex justify-content-end">
//                                         <span className="text-secondary text-decoration-line-through" style={{ fontSize: "0.85rem" }}>
//                                           {formatPrice(product.price)}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   ) : (
//                                     <div className="w-100 d-flex flex-column text-start ps-4">
//                                       <h5 className="d-flex justify-content-between border-bottom pb-2">
//                                         <span>{product.name}</span>
//                                         <span className="text-primary" style={{ fontSize: "1rem" }}>
//                                           {formatPrice(product.price)}
//                                         </span>
//                                       </h5>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Hiển thị tất cả danh mục nếu không có danh mục nào được chọn */}
//             {selectedCategory === null && productCategoryState.product_category.map((item) => {
//               const productsInCategorySelected = productState.product.filter(product => product.categories_id === item.id);
//               if (productsInCategorySelected.length === 0) return null;

//               return (
//                 <div className="container-xxl py-5" key={item.id}>
//                   <div className="container">
//                     <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
//                       <h5 className="section-title ff-secondary text-center text-primary fw-normal">
//                         Nhà Hàng Hương Sen
//                       </h5>
//                       <h1 className="mb-5">{item.name}</h1>
//                     </div>

//                     <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.1s">
//                       <div className="tab-content">
//                         <div id="tab-1" className="tab-pane fade show p-0 active">
//                           <div className="row" style={{ rowGap: "20px" }}>
//                             {productsInCategorySelected.map((product) => (
//                               <div className="col-lg-6" key={product.id}>
//                                 <div
//                                   className="d-flex align-items-center"
//                                   onClick={() => handleProductClick(product.name)}
//                                   style={{ cursor: "pointer" }}
//                                 >
//                                   <img
//                                     className="flex-shrink-0 img-fluid rounded"
//                                     src={product.image}
//                                     alt={product.name}
//                                     style={{
//                                       width: "150px",
//                                       height: "150px",
//                                       objectFit: "cover",
//                                       borderRadius: "10px",
//                                     }}
//                                   />
//                                   {product.sale_price > 0 ? (
//                                     <div className="w-100 d-flex flex-column text-start ps-4">
//                                       <h5 className="d-flex justify-content-between border-bottom pb-2">
//                                         <span>{product.name}</span>
//                                         <span className="text-primary" style={{ fontSize: "1rem" }}>
//                                           {formatPrice(product.price - product.sale_price)}
//                                         </span>
//                                       </h5>
//                                       <div className="d-flex justify-content-end">
//                                         <span className="text-secondary text-decoration-line-through" style={{ fontSize: "0.85rem" }}>
//                                           {formatPrice(product.price)}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   ) : (
//                                     <div className="w-100 d-flex flex-column text-start ps-4">
//                                       <h5 className="d-flex justify-content-between border-bottom pb-2">
//                                         <span>{product.name}</span>
//                                         <span className="text-primary" style={{ fontSize: "1rem" }}>
//                                           {formatPrice(product.price)}
//                                         </span>
//                                       </h5>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             {/* Hiển thị phân trang nếu có nhiều hơn 10 sản phẩm */}
//             {selectedCategory !== null && totalPages > 1 && (
//               <div className="d-flex justify-content-center align-items-center mt-3">
//                 <Pagination
//                   count={count > 0 ? count : 1}
//                   page={currentPage > 0 ? currentPage : 1}
//                   onChange={(event, value) => setCurrentPage(value)}
//                   color="primary"
//                   variant="outlined"
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchListProductCategory,
  fetchProductCategoryHoatDong,
} from "../../Actions/ProductCategoryActions";
import {
  fetchMenu,
  fetchProductHoatDong,
  setCurrentPage,
} from "../../Actions/ProductActions";
import unidecode from "unidecode";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../Components/Client/Spinner";
import Pagination from '@mui/material/Pagination';
import '@fortawesome/fontawesome-free/css/all.min.css';



export default function Menu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productCategoryState = useSelector((state) => state.product_category);
  const productState = useSelector((state) => state.product);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20; //TODO setting limit/trang ở đây

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCateID, setsearchCateID] = useState("");
  const urlPage = currentPage;
  const [priceFilter, setPriceFilter] = useState("");



  useEffect(() => {
    dispatch(fetchListProductCategory());
    dispatch(fetchMenu());
  }, [dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Hàm tạo slug từ tên sản phẩm
  const createSlug = (name) => {
    return unidecode(name) // Chuyển đổi ký tự tiếng Việt thành ký tự không dấu
      .toLowerCase() // Chuyển thành chữ thường
      .replace(/[^a-z0-9]/g, "-") // Thay thế ký tự không phải chữ cái hoặc số bằng dấu -
      .replace(/-+/g, "-") // Thay thế nhiều dấu - bằng 1 dấu -
      .replace(/^-+/, "") // Xóa dấu - ở đầu chuỗi
      .replace(/-+$/, ""); // Xóa dấu - ở cuối chuỗi
  };


  const handleProductClick = (name) => {
    const slug = createSlug(name);
    navigate(`/product-detail/${slug}.html`);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Cập nhật local state
  };

  const handleSearchCateID = (event) => {
    setsearchCateID(event.target.value);
    setCurrentPage(1); // Cập nhật local state
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };




  // Lọc dựa trên searchTerm, searchCateID và selectedCategory
  const filterProducts = () => {
    let filtered = productState.product;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (searchCateID !== "") {
      filtered = filtered.filter((p) => p.categories_id === parseInt(searchCateID));
    }

    if (selectedCategory !== null) {
      filtered = filtered.filter((p) => p.categories_id === selectedCategory);
    }

    if (priceFilter !== "") {
      filtered = filtered.filter((p) => {
        const finalPrice = p.sale_price > 0 ? p.price - p.sale_price : p.price;
        switch (priceFilter) {
          case "1":
            return finalPrice < 50000;
          case "2":
            return finalPrice >= 50000 && finalPrice <= 100000;
          case "3":
            return finalPrice > 100000;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Lọc dựa trên searchTerm, searchCateID và selectedCategory
  const filteredProducts = filterProducts();

  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


  return (
    <div>
      {/* Tiêu đề */}
      <div className="py-5 bg-dark hero-header mb-3">
        <div className="container text-center my-5 pt-5 pb-4">
          <h2 className="display-3 text-white mb-3 animated slideInDown">
            Menu
          </h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item text-white active" aria-current="page">
                Menu
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row justify-content-center">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-4 sidebar-container" style={{
            minHeight: '100vh',
            padding: '25px 15px',
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
            overflowY: 'auto',
            backgroundColor: '#fafafa'
          }}>
            <div className="text-center mb-4">
              <h4 style={{ fontWeight: 'bold', color: '#266040', fontFamily: "'Times New Roman', Tahoma, Geneva, Verdana, sans-serif" }}>
                THỰC ĐƠN
              </h4>
            </div>

            <style>{
              `
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 18px 25px;
      margin-bottom: 12px;
      background: white;
      border: 2.5px solid #ddd;
      cursor: pointer;
      transition: all 0.4s ease;
      font-weight: 600;
      color: #205236;
      font-family: 'Times New Roman', Tahoma, Geneva, Verdana, sans-serif;
      border-left: 5px solid transparent;
      user-select: none;
      border-radius: 15px;
      font-size: 17px;
    }
    .list-group-item i {
      margin-right: 20px;
      font-size: 1.6rem;
      color: #205236;
      transition: color 0.4s ease;
      min-width: 30px;
      text-align: center;
    }
    .list-group-item:hover {
      background: linear-gradient(90deg,rgb(216, 238, 206),rgba(186, 213, 172, 0.98)); /* xanh nhạt hơn */
      color: #205236;
      border-color: #53bc82;
      box-shadow: 0 8px 15px rgba(167, 209, 143, 0.3);
    }
    .list-group-item:hover i {
      color: #205236;
    }
    .list-group-item.active {
      border-left: 5px solid #2c6e49;
      background: #3b9966;
      color: white;
      border-color: #205236;
      box-shadow: 0 8px 15px rgba(44, 110, 73, 0.6);
    }
    .list-group-item.active i {
      color: white;
    }
  `}</style>

            <ul className="list-group">
              <li
                className={`list-group-item d-flex align-items-center ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => handleCategoryClick(null)}
              >
                <i className="fas fa-list"></i>
                <span>Xem tất cả</span>
              </li>
              {productCategoryState.product_category.map(item => {
                console.log('item.id =', item.id, typeof item.id);
                const iconMap = {
                  '11': 'fas fa-utensils',
                  '12': 'fas fa-seedling',
                  '13': 'fas fa-ice-cream',
                  '14': 'fas fa-cocktail',
                  '15': 'fas fa-plus-circle',
                  '20': 'fas fa-burn',
                  '21': 'fas fa-adjust',
                };
                const iconClass = iconMap[item.id] || 'fas fa-utensils';

                return (
                  <li
                    key={item.id}
                    className={`list-group-item d-flex align-items-center ${selectedCategory === item.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(item.id)}
                  >
                    <i className={iconClass}></i>
                    <span>{item.name}</span>
                  </li>
                )
              })}
            </ul>
          </div>


          {/* Nội dung chính - điều chỉnh col và thêm padding */}
          <div className="col-lg-9 col-md-8" style={{ padding: '20px' }}>

            <div
              className="search-box mb-4 p-4"
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#fff",
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <i
                  className="fa fa-search"
                  style={{ color: "#FEA100", fontSize: "1.2rem", marginRight: "10px" }}
                ></i>
                <h5 className="mb-0" style={{ fontWeight: "bold", color: "#333" }}>
                  Tìm Kiếm Món Ăn
                </h5>
              </div>

              <div className="row g-3">
                <div className="col-md-8 col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder=" Nhập tên món ăn (ví dụ: Cơm, Salad, Trà...)"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "10px 15px",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>

                <div className="col-md-4 col-12">
                  <select
                    className="form-select"
                    value={priceFilter}
                    onChange={(e) => {
                      setPriceFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "10px",
                      fontSize: "0.95rem",
                    }}
                  >
                    <option value="">💰 Chọn mức giá</option>
                    <option value="1">Dưới 50.000đ</option>
                    <option value="2">50.000đ - 100.000đ</option>
                    <option value="3">Trên 100.000đ</option>
                  </select>
                </div>
              </div>
            </div>




            {productCategoryState.loading && <Spinner />}
            {!productCategoryState.loading && productCategoryState.product_category.length === 0 && (
              <div>No categories found.</div>
            )}
            {productCategoryState.error && (
              <div>Error: {productCategoryState.error}</div>
            )}

            {/* Hiển thị danh sách món ăn theo danh mục đã chọn */}
            {selectedCategory !== null && (
              <div className="container-xxl py-5">
                <div className="container">
                  <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    {/* <h5 className="section-title ff-secondary text-center text-primary fw-normal">
                      Nhà Hàng Hương Sen
                    </h5> */}
                    <h1 className="mb-5">
                      {productCategoryState.product_category.find(cat => cat.id === selectedCategory)?.name}</h1>
                  </div>

                  <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.1s">
                    <div className="tab-content">
                      <div id="tab-1" className="tab-pane fade show p-0 active">
                        <div className="row" style={{ rowGap: "20px" }}>
                          {currentProducts.length === 0 ? (
                            <div className="text-center" style={{ marginTop: '20px', fontSize: '1.2rem', color: '#333' }}>
                              Đang cập nhật thêm món ăn...
                            </div>
                          ) : (
                            currentProducts.map((product) => (
                              <div className="col-lg-6" key={product.id}>
                                <div
                                  className="d-flex align-items-center"
                                  onClick={() => handleProductClick(product.name)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <img
                                    className="flex-shrink-0 img-fluid rounded"
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      objectFit: "cover",
                                      borderRadius: "10px",
                                    }}
                                  />
                                  {product.sale_price > 0 ? (
                                    <div className="w-100 d-flex flex-column text-start ps-4">
                                      <h5 className="d-flex justify-content-between border-bottom pb-2">
                                        <span>{product.name}</span>
                                        <span className="text-primary" style={{ fontSize: "1rem" }}>
                                          {formatPrice(product.price - product.sale_price)}
                                        </span>
                                      </h5>
                                      <div className="d-flex justify-content-end">
                                        <span className="text-secondary text-decoration-line-through" style={{ fontSize: "0.85rem" }}>
                                          {formatPrice(product.price)}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-100 d-flex flex-column text-start ps-4">
                                      <h5 className="d-flex justify-content-between border-bottom pb-2">
                                        <span>{product.name}</span>
                                        <span className="text-primary" style={{ fontSize: "1rem" }}>
                                          {formatPrice(product.price)}
                                        </span>
                                      </h5>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hiển thị tất cả danh mục nếu không có danh mục nào được chọn */}
            {selectedCategory === null && productCategoryState.product_category.map((item) => {
              const productsInCategorySelected = productState.product.filter(product => product.categories_id === item.id);
              if (productsInCategorySelected.length === 0) return null;

              return (
                <div className="container-xxl py-5" key={item.id}>
                  <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                      {/* <h5 className="section-title ff-secondary text-center text-primary fw-normal">
                        Nhà Hàng Hương Sen
                      </h5> */}
                      <h1 className="mb-5">{item.name}</h1>
                    </div>

                    <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.1s">
                      <div className="tab-content">
                        <div id="tab-1" className="tab-pane fade show p-0 active">
                          <div className="row" style={{ rowGap: "20px" }}>
                            {productsInCategorySelected.map((product) => (
                              <div className="col-lg-6" key={product.id}>
                                <div
                                  className="d-flex align-items-center"
                                  onClick={() => handleProductClick(product.name)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <img
                                    className="flex-shrink-0 img-fluid rounded"
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      objectFit: "cover",
                                      borderRadius: "10px",
                                    }}
                                  />
                                  {product.sale_price > 0 ? (
                                    <div className="w-100 d-flex flex-column text-start ps-4">
                                      <h5 className="d-flex justify-content-between border-bottom pb-2">
                                        <span>{product.name}</span>
                                        <span className="text-primary" style={{ fontSize: "1rem" }}>
                                          {formatPrice(product.price - product.sale_price)}
                                        </span>
                                      </h5>
                                      <div className="d-flex justify-content-end">
                                        <span className="text-secondary text-decoration-line-through" style={{ fontSize: "0.85rem" }}>
                                          {formatPrice(product.price)}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-100 d-flex flex-column text-start ps-4">
                                      <h5 className="d-flex justify-content-between border-bottom pb-2">
                                        <span>{product.name}</span>
                                        <span className="text-primary" style={{ fontSize: "1rem" }}>
                                          {formatPrice(product.price)}
                                        </span>
                                      </h5>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Hiển thị phân trang nếu có nhiều hơn 10 sản phẩm */}
            {selectedCategory !== null && totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-3">
                <Pagination
                  count={totalPages}
                  page={currentPage > 0 ? currentPage : 1}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  variant="outlined"
                />
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
}
