// import React, { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchBlog, updateBlog } from "../../Actions/BlogActions";
// import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
// import { SuccessAlert } from "../../Components/Alert/Alert";
// import { useForm } from "react-hook-form";
// import { fetchCategoryBlog } from "../../Actions/BlogsCategoriesActions";
// import CustomSpinner from "../../Components/Spinner/CustomSpinner";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// import { getPermissions } from "../../Actions/GetQuyenHanAction";
// import { jwtDecode as jwt_decode } from "jwt-decode";

// export default function BlogEdit() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const getQuyenHanState = useSelector((state) => state.getQuyenHan);
//   const permissions = getQuyenHanState.getQuyenHan || [];

//   useEffect(() => {
//   if (token) {
//       const decodedToken = jwt_decode(token);
//       const userIdFromToken = decodedToken.id;
//       dispatch(getPermissions(userIdFromToken));
//   }
//   const decodedToken = jwt_decode(token);
//   const userIdFromToken = decodedToken.id;
//       dispatch(getPermissions(userIdFromToken));
//   }, [navigate, dispatch, token]);

//   const hasPermission = (permissionName) => {
//       return (
//           permissions.data &&
//           permissions.data.some((permission) => permission.name == permissionName)
//       );
//   };

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const blogState = useSelector((state) => state.blog);
//   const blogCategoryState = useSelector((state) => state.categories);

//   const [initialPoster, setInitialPoster] = useState(null);
//   const [poster, setPoster] = useState("");
//   const [openSuccess, setOpenSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [content, setContent] = useState(""); // Track Quill content
//   const [author, setAuthor] = useState(""); // Track author
//   const [initialCategoryId, setInitialCategoryId] = useState(null); // Lưu id danh mục ban đầu

//   const quillRef = useRef(null);

//   useEffect(() => {
//     const fetchBlogData = async () => {
//       setLoading(true);
//       await dispatch(fetchBlog(id)); // Fetch the specific blog by ID
//       await dispatch(fetchCategoryBlog());
//       setLoading(false);
//     };

//     fetchBlogData();
//   }, [dispatch, id]);

//   useEffect(() => {
//     const blog = blogState.blog.find((b) => b.id === parseInt(id));
//     if (blog) {
//       setValue("title", blog.title);
//       setValue("blog_category_id", blog.blog_category_id);
//       setInitialCategoryId(blog.blog_category_id); // Lưu lại ID danh mục ban đầu
//       setInitialPoster(blog.poster);
//       setPoster(blog.poster);
//       setContent(blog.content); // Set Quill content
//       setAuthor(blog.author); // Store the author's name
//     }
//   }, [blogState.blog, id, setValue]);

//   const handleSuccessClose = () => {
//     setOpenSuccess(false);
//   };

//   const onSubmit = async (data) => {
//     setLoading(true);
//     const updatedData = {
//       ...data,
//       poster: poster || initialPoster, // Update poster if there's a new one
//       content,
//       author, // Keep the original author
//     };

//     try {
//       await dispatch(updateBlog(id, updatedData));
//       setOpenSuccess(true);
//       reset();
//       setTimeout(() => {
//         navigate("/blogs");
//       }, 2000); // Navigate after 2 seconds
//     } catch (error) {
//       console.error("Error updating blog:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = (fileNames) => {
//     if (fileNames.length > 0) {
//       setPoster(fileNames[0]);
//       setValue("poster", fileNames[0]);
//     }
//   };

//   const modules = {
//     toolbar: [
//       [{ font: [] }, { size: [] }],
//       [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
//       [
//         { list: "ordered" },
//         { list: "bullet" },
//         { indent: "-1" },
//         { indent: "+1" },
//       ],
//       ["bold", "italic", "underline", "strike"],
//       [{ color: [] }, { background: [] }],
//       ["link", "image", "video"],
//       ["align", { align: [] }],
//       ["clean"],
//     ],
//   };

//   if (loading) {
//     return (
//       <div className="container">
//         <CustomSpinner />
//       </div>
//     );
//   }

//   const canViewCategories = hasPermission("Xem danh mục bài viết");

//   return (
//     <div className="container">
//       <div className="page-inner">
//         <div className="row">
//           <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
//             <div className="card">
//               <div className="card-header">
//                 <div className="card-title">Chỉnh sửa bài viết</div>
//               </div>
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <label htmlFor="title">Tiêu đề bài viết</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="title"
//                         placeholder="Nhập tiêu đề"
//                         {...register("title", {
//                           required: "Tiêu đề là bắt buộc",
//                         })}
//                       />
//                       {errors.title && (
//                         <p className="text-danger">{errors.title.message}</p>
//                       )}
//                     </div>
//                     <div className="form-group">
//                       {/* Display author but don't submit it */}
//                       <label htmlFor="author">Tác giả</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="author"
//                         value={author}
//                         disabled // Disable field to avoid modification
//                       />
//                     </div>
                   
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <label>Danh mục</label>
//                       {/* <select
//                         className="form-select"
//                         id="blog_category_id"
//                         {...register("blog_category_id", {
//                           required: "Vui lòng chọn danh mục!",
//                         })}
//                       >
//                         {blogCategoryState.categories &&
//                           blogCategoryState.categories.map((item) => (
//                             <option key={item.id} value={item.id}>
//                               {item.name}
//                             </option>
//                           ))}
//                       </select> */}
//                       <select defaultValue="1"
//                         className={`form-select ${!hasPermission("Xem danh mục bài viết") ? 'is-invalid' : ''}`} 
//                         id="blog_category_id"
//                         {...register("blog_category_id", {
//                           required: hasPermission("Xem danh mục bài viết") ? "Vui lòng chọn danh mục!" : false,
//                         })}
//                         disabled={!hasPermission("Xem danh mục bài viết")}
//                       >
//                         {hasPermission("Xem danh mục bài viết") ? (
//                           blogCategoryState.categories &&
//                           blogCategoryState.categories.map((item) => (
//                             <option key={item.id} value={item.id}>
//                               {item.name}
//                             </option>
//                           ))
//                         ) : (
//                           <option value={blogState.blog[0]?.blog_category_id} disabled>
//                             Bạn không có quyền xem danh mục
//                           </option>
//                         )}
//                       </select>

//                       {!hasPermission("Xem danh mục bài viết") && (
//                         <p className="text-danger">Bạn không có quyền xem danh mục!</p>
//                       )}

//                       {errors.blog_category_id && (
//                         <p className="text-danger">
//                           {errors.blog_category_id.message}
//                         </p>
//                       )}

//                        <div className="form-group">
//                       <label htmlFor="poster">Ảnh poster</label>
//                       <br />
//                       <ImageUploadComponent
//                         id="poster"
//                         onImageUpload={handleImageUpload}
//                       />
//                       {initialPoster && (
//                         <div>
//                           <img
//                             src={initialPoster}
//                             alt="Poster"
//                             style={{ maxWidth: "100px", marginTop: "10px" }}
//                           />
//                         </div>
//                       )}
//                     </div>
//                     </div>
                
//                   </div>
//                   <div className="col-md-12">
//                     <div className="form-group">
//                       <label htmlFor="content">Nội dung</label>
//                       <ReactQuill 
//                         // ref={quillRef}
//                         theme="snow"
//                         value={content}
//                         onChange={setContent}
//                         className="quill-editor"
//                         modules={modules}
//                       />
//                       {errors.content && (
//                         <p className="text-danger">{errors.content.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="card-footer">
//                 <div className="btn-group mt-3" role="group">
//                   <button type="submit" className="btn btn-success">
//                     Cập Nhật
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-danger"
//                     onClick={() => navigate("/blogs?page=1")}
//                   >
//                     Hủy
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>
//           <SuccessAlert
//             open={openSuccess}
//             onClose={handleSuccessClose}
//             message="Cập nhật thông tin bài viết thành công!"
//             vertical="top"
//             horizontal="right"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }












// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchBlog, updateBlog } from "../../Actions/BlogActions";
// import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
// import { SuccessAlert } from "../../Components/Alert/Alert";
// import { useForm } from "react-hook-form";
// import { fetchCategoryBlog } from "../../Actions/BlogsCategoriesActions";
// import CustomSpinner from "../../Components/Spinner/CustomSpinner";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';


// // import ReactQuill from "react-quill-ver2";
// // import "quill/dist/quill.snow.css";
// import { getPermissions } from "../../Actions/GetQuyenHanAction";
// import { jwtDecode as jwt_decode } from "jwt-decode";

// export default function BlogEdit() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Get token and decode for permissions
//   const token = localStorage.getItem("token");
//   const getQuyenHanState = useSelector((state) => state.getQuyenHan);
//   const permissions = getQuyenHanState.getQuyenHan || [];

//   useEffect(() => {
//     if (token) {
//       const decodedToken = jwt_decode(token);
//       const userIdFromToken = decodedToken.id;
//       dispatch(getPermissions(userIdFromToken));
//     }
//   }, [dispatch, token]);

//   // Check if the user has permission to view categories
//   const hasPermission = (permissionName) => {
//     return (
//       permissions.data &&
//       permissions.data.some((permission) => permission.name === permissionName)
//     );
//   };

//   // Set up form and reset state with react-hook-form
//   const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  
//   // Redux states
//   const blogState = useSelector((state) => state.blog);
//   const blogCategoryState = useSelector((state) => state.categories);

//   const [initialPoster, setInitialPoster] = useState(null);
//   const [poster, setPoster] = useState("");
//   const [openSuccess, setOpenSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [content, setContent] = useState(""); // Track Quill content
//   const [author, setAuthor] = useState(""); // Track author
//   const [initialCategoryId, setInitialCategoryId] = useState(null); // Store initial category ID

//   useEffect(() => {
//     const fetchBlogData = async () => {
//       setLoading(true);
//       await dispatch(fetchBlog(id)); // Fetch the specific blog by ID
//       await dispatch(fetchCategoryBlog());
//       setLoading(false);
//     };

//     fetchBlogData();
//   }, [dispatch, id]);

//   // Set form values when blog data is loaded
//   useEffect(() => {
//     const blog = blogState.blog.find((b) => b.id === parseInt(id));
//     if (blog) {
//       setValue("title", blog.title);
//       setValue("blog_category_id", blog.blog_category_id);
//       setInitialCategoryId(blog.blog_category_id); // Store initial category ID
//       setInitialPoster(blog.poster);
//       setPoster(blog.poster);
//       setContent(blog.content); // Set Quill content
//       setAuthor(blog.author); // Store the author's name
//     }
//   }, [blogState.blog, id, setValue]);

//   const handleSuccessClose = () => {
//     setOpenSuccess(false);
//   };

//   const onSubmit = async (data) => {
//     setLoading(true);
//     const updatedData = {
//       ...data,
//       poster: poster || initialPoster, // Update poster if there's a new one
//       content,
//       author, // Keep the original author
//     };

//     try {
//       await dispatch(updateBlog(id, updatedData));
//       setOpenSuccess(true);
//       reset();
//       setTimeout(() => {
//         navigate("/blogs");
//       }, 2000); // Navigate after 2 seconds
//     } catch (error) {
//       console.error("Error updating blog:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = (fileNames) => {
//     if (fileNames.length > 0) {
//       setPoster(fileNames[0]);
//       setValue("poster", fileNames[0]);
//     }
//   };

//   const modules = {
//     toolbar: [
//       [{ font: [] }, { size: [] }],
//       [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
//       [
//         { list: "ordered" },
//         { list: "bullet" },
//         { indent: "-1" },
//         { indent: "+1" },
//       ],
//       ["bold", "italic", "underline", "strike"],
//       [{ color: [] }, { background: [] }],
//       ["link", "image", "video"],
//       ["align", { align: [] }],
//       ["clean"],
//     ],
//   };

//   if (loading) {
//     return (
//       <div className="container">
//         <CustomSpinner />
//       </div>
//     );
//   }

//   const canViewCategories = hasPermission("Xem danh mục bài viết");

//   return (
//     <div className="container">
//       <div className="page-inner">
//         <div className="row">
//           <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
//             <div className="card">
//               <div className="card-header">
//                 <div className="card-title">Chỉnh sửa bài viết</div>
//               </div>
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <label htmlFor="title">Tiêu đề bài viết</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="title"
//                         placeholder="Nhập tiêu đề"
//                         {...register("title", {
//                           required: "Tiêu đề là bắt buộc",
//                         })}
//                       />
//                       {errors.title && (
//                         <p className="text-danger">{errors.title.message}</p>
//                       )}
//                     </div>
//                     <div className="form-group">
//                       {/* Display author but don't submit it */}
//                       <label htmlFor="author">Tác giả</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="author"
//                         value={author}
//                         disabled // Disable field to avoid modification
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <label>Danh mục</label>
//                       <select
//                         className={`form-select ${!hasPermission("Xem danh mục bài viết") ? 'is-invalid' : ''}`}
//                         id="blog_category_id"
//                         {...register("blog_category_id", {
//                           required: hasPermission("Xem danh mục bài viết") ? "Vui lòng chọn danh mục!" : false,
//                         })}
//                         disabled={!hasPermission("Xem danh mục bài viết")}
//                       >
//                         {hasPermission("Xem danh mục bài viết") ? (
//                           blogCategoryState.categories &&
//                           blogCategoryState.categories.map((item) => (
//                             <option key={item.id} value={item.id}>
//                               {item.name}
//                             </option>
//                           ))
//                         ) : (
//                           <option value={blogState.blog[0]?.blog_category_id} disabled>
//                             Bạn không có quyền xem danh mục
//                           </option>
//                         )}
//                       </select>

//                       {!hasPermission("Xem danh mục bài viết") && (
//                         <p className="text-danger">Bạn không có quyền xem danh mục!</p>
//                       )}

//                       {errors.blog_category_id && (
//                         <p className="text-danger">
//                           {errors.blog_category_id.message}
//                         </p>
//                       )}

//                       <div className="form-group">
//                         <label htmlFor="poster">Ảnh poster</label>
//                         <br />
//                         <ImageUploadComponent
//                           id="poster"
//                           onImageUpload={handleImageUpload}
//                         />
//                         {initialPoster && (
//                           <div>
//                             <img
//                               src={initialPoster}
//                               alt="Poster"
//                               style={{ maxWidth: "100px", marginTop: "10px" }}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-12">
//                     <div className="form-group">
//                       <label htmlFor="content">Nội dung</label>
//                       <ReactQuill
//                       key="editor"
//                         theme="snow"
//                         value={content}
//                         onChange={setContent}
//                         className="quill-editor"
//                         modules={modules}
//                       />
//                       {errors.content && (
//                         <p className="text-danger">{errors.content.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="card-footer">
//                 <div className="btn-group mt-3" role="group">
//                   <button type="submit" className="btn btn-success">
//                     Cập Nhật
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-danger"
//                     onClick={() => navigate("/blogs?page=1")}
//                   >
//                     Hủy
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>
//           <SuccessAlert
//             open={openSuccess}
//             onClose={handleSuccessClose}
//             message="Cập nhật thông tin bài viết thành công!"
//             vertical="top"
//             horizontal="right"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
























// import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchBlog, updateBlog } from "../../Actions/BlogActions";
// import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
// import { SuccessAlert } from "../../Components/Alert/Alert";
// import { useForm } from "react-hook-form";
// import { fetchCategoryBlog } from "../../Actions/BlogsCategoriesActions";
// import CustomSpinner from "../../Components/Spinner/CustomSpinner";
// import Quill from "quill";
// import "quill/dist/quill.snow.css"; // Import Quill CSS
// import { getPermissions } from "../../Actions/GetQuyenHanAction";
// import { jwtDecode as jwt_decode } from "jwt-decode";

// const BlogEdit = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   const token = localStorage.getItem("token");
//   const getQuyenHanState = useSelector((state) => state.getQuyenHan);
//   const permissions = getQuyenHanState.getQuyenHan || [];

//   const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
//   const blogState = useSelector((state) => state.blog);
//   const blogCategoryState = useSelector((state) => state.categories);

//   const [initialPoster, setInitialPoster] = useState(null);
//   const [poster, setPoster] = useState("");
//   const [openSuccess, setOpenSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [content, setContent] = useState(""); // Track Quill content
//   const [author, setAuthor] = useState(""); // Track author
//   const [initialCategoryId, setInitialCategoryId] = useState(null);

//   const quillRef = useRef(null); // Reference for Quill

//   // Check permission
//   useEffect(() => {
//     if (token) {
//       const decodedToken = jwt_decode(token);
//       const userIdFromToken = decodedToken.id;
//       dispatch(getPermissions(userIdFromToken));
//     }
//   }, [dispatch, token]);

//   const hasPermission = (permissionName) => {
//     return (
//       permissions.data &&
//       permissions.data.some((permission) => permission.name === permissionName)
//     );
//   };

//   // Fetch blog and categories
//   useEffect(() => {
//     const fetchBlogData = async () => {
//       setLoading(true);
//       await dispatch(fetchBlog(id)); // Fetch the specific blog by ID
//       await dispatch(fetchCategoryBlog());
//       setLoading(false);
//     };

//     fetchBlogData();
//   }, [dispatch, id]);

//   // Set form values when blog is loaded
//   useEffect(() => {
//     const blog = blogState.blog.find((b) => b.id === parseInt(id));
//     if (blog) {
//       setValue("title", blog.title);
//       setValue("blog_category_id", blog.blog_category_id);
//       setInitialCategoryId(blog.blog_category_id);
//       setInitialPoster(blog.poster);
//       setPoster(blog.poster);
//       setContent(blog.content);
//       setAuthor(blog.author);
//     }
//   }, [blogState.blog, id, setValue]);

//   // Initialize Quill editor
//   useLayoutEffect(() => {
//     if (quillRef.current) {
//       const quill = new Quill(quillRef.current, {
//         theme: "snow",
//         modules: {
//           toolbar: [
//             [{ font: [] }, { size: [] }],
//             [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
//             [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
//             ["bold", "italic", "underline", "strike"],
//             [{ color: [] }, { background: [] }],
//             ["link", "image", "video"],
//             ["align", { align: [] }],
//             ["clean"],
//           ],
//         },
//       });

//       // Load content to Quill editor
//       quill.root.innerHTML = content;

//       // Update content when Quill changes
//       quill.on("text-change", () => {
//         setContent(quill.root.innerHTML);
//       });
//     }
//   }, [content]);

//   // Handle form submission
//   const onSubmit = async (data) => {
//     setLoading(true);
//     const updatedData = {
//       ...data,
//       poster: poster || initialPoster,
//       content,
//       author,
//     };

//     try {
//       await dispatch(updateBlog(id, updatedData));
//       setOpenSuccess(true);
//       reset();
//       setTimeout(() => {
//         navigate("/blogs");
//       }, 2000);
//     } catch (error) {
//       console.error("Error updating blog:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle image upload
//   const handleImageUpload = (fileNames) => {
//     if (fileNames.length > 0) {
//       setPoster(fileNames[0]);
//       setValue("poster", fileNames[0]);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container">
//         <CustomSpinner />
//       </div>
//     );
//   }

//   const canViewCategories = hasPermission("Xem danh mục bài viết");

//   return (
//     <div className="container">
//       <div className="page-inner">
//         <div className="row">
//           <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
//             <div className="card">
//               <div className="card-header">
//                 <div className="card-title">Chỉnh sửa bài viết</div>
//               </div>
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <label htmlFor="title">Tiêu đề bài viết</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="title"
//                         placeholder="Nhập tiêu đề"
//                         {...register("title", {
//                           required: "Tiêu đề là bắt buộc",
//                         })}
//                       />
//                       {errors.title && (
//                         <p className="text-danger">{errors.title.message}</p>
//                       )}
//                     </div>
//                     <div className="form-group">
//                       <label htmlFor="author">Tác giả</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="author"
//                         value={author}
//                         disabled
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <label>Danh mục</label>
//                       <select
//                         className={`form-select ${!hasPermission("Xem danh mục bài viết") ? 'is-invalid' : ''}`}
//                         id="blog_category_id"
//                         {...register("blog_category_id", {
//                           required: hasPermission("Xem danh mục bài viết") ? "Vui lòng chọn danh mục!" : false,
//                         })}
//                         disabled={!hasPermission("Xem danh mục bài viết")}
//                       >
//                         {hasPermission("Xem danh mục bài viết") ? (
//                           blogCategoryState.categories &&
//                           blogCategoryState.categories.map((item) => (
//                             <option key={item.id} value={item.id}>
//                               {item.name}
//                             </option>
//                           ))
//                         ) : (
//                           <option value={blogState.blog[0]?.blog_category_id} disabled>
//                             Bạn không có quyền xem danh mục
//                           </option>
//                         )}
//                       </select>

//                       {!hasPermission("Xem danh mục bài viết") && (
//                         <p className="text-danger">Bạn không có quyền xem danh mục!</p>
//                       )}

//                       {errors.blog_category_id && (
//                         <p className="text-danger">{errors.blog_category_id.message}</p>
//                       )}

//                       <div className="form-group">
//                         <label htmlFor="poster">Ảnh poster</label>
//                         <br />
//                         <ImageUploadComponent
//                           id="poster"
//                           onImageUpload={handleImageUpload}
//                         />
//                         {initialPoster && (
//                           <div>
//                             <img
//                               src={initialPoster}
//                               alt="Poster"
//                               style={{ maxWidth: "100px", marginTop: "10px" }}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-12">
//                     <div className="form-group">
//                       <label htmlFor="content">Nội dung</label>
//                       {/* Quill Editor */}
//                       <div ref={quillRef} style={{ height: '300px' }}></div>
//                       {errors.content && (
//                         <p className="text-danger">{errors.content.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="card-footer">
//                 <div className="btn-group mt-3" role="group">
//                   <button type="submit" className="btn btn-success">
//                     Cập Nhật
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-danger"
//                     onClick={() => navigate("/blogs?page=1")}
//                   >
//                     Hủy
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>
//           <SuccessAlert
//             open={openSuccess}
//             onClose={() => setOpenSuccess(false)}
//             message="Cập nhật thông tin bài viết thành công!"
//             vertical="top"
//             horizontal="right"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogEdit;





import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBlog, updateBlog } from "../../Actions/BlogActions";
import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
import { SuccessAlert } from "../../Components/Alert/Alert";
import { useForm } from "react-hook-form";
import { fetchCategoryBlog } from "../../Actions/BlogsCategoriesActions";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";
import { Editor } from "@tinymce/tinymce-react";  // Import TinyMCE Editor
import { getPermissions } from "../../Actions/GetQuyenHanAction";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function BlogEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get token and decode for permissions
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

  // Check if the user has permission to view categories
  const hasPermission = (permissionName) => {
    return (
      permissions.data &&
      permissions.data.some((permission) => permission.name === permissionName)
    );
  };

  // Set up form and reset state with react-hook-form
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  
  // Redux states
  const blogState = useSelector((state) => state.blog);
  const blogCategoryState = useSelector((state) => state.categories);

  const [initialPoster, setInitialPoster] = useState(null);
  const [poster, setPoster] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(""); // Track TinyMCE content
  const [author, setAuthor] = useState(""); // Track author
  const [initialCategoryId, setInitialCategoryId] = useState(null); // Store initial category ID

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      await dispatch(fetchBlog(id)); // Fetch the specific blog by ID
      await dispatch(fetchCategoryBlog());
      setLoading(false);
    };

    fetchBlogData();
  }, [dispatch, id]);

  // Set form values when blog data is loaded
  useEffect(() => {
    const blog = blogState.blog.find((b) => b.id === parseInt(id));
    if (blog) {
      setValue("title", blog.title);
      setValue("blog_category_id", blog.blog_category_id);
      setInitialCategoryId(blog.blog_category_id); // Store initial category ID
      setInitialPoster(blog.poster);
      setPoster(blog.poster);
      setContent(blog.content); // Set TinyMCE content
      setAuthor(blog.author); // Store the author's name
    }
  }, [blogState.blog, id, setValue]);

  const handleSuccessClose = () => {
    setOpenSuccess(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const updatedData = {
      ...data,
      poster: poster || initialPoster, // Update poster if there's a new one
      content, // Keep the content from TinyMCE
      author, // Keep the original author
    };

    try {
      await dispatch(updateBlog(id, updatedData));
      setOpenSuccess(true);
      reset();
      setTimeout(() => {
        navigate("/blogs");
      }, 2000); // Navigate after 2 seconds
    } catch (error) {
      console.error("Error updating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (fileNames) => {
    if (fileNames.length > 0) {
      setPoster(fileNames[0]);
      setValue("poster", fileNames[0]);
    }
  };

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["align", { align: [] }],
      ["clean"],
    ],
  };

  if (loading) {
    return (
      <div className="container">
        <CustomSpinner />
      </div>
    );
  }

  const canViewCategories = hasPermission("Xem danh mục bài viết");

  return (
    <div className="container">
      <div className="page-inner">
        <div className="row">
          <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Chỉnh sửa bài viết</div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="title">Tiêu đề bài viết</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        placeholder="Nhập tiêu đề"
                        {...register("title", {
                          required: "Tiêu đề là bắt buộc",
                        })}
                      />
                      {errors.title && (
                        <p className="text-danger">{errors.title.message}</p>
                      )}
                    </div>
                    <div className="form-group">
                      {/* Display author but don't submit it */}
                      <label htmlFor="author">Tác giả</label>
                      <input
                        type="text"
                        className="form-control"
                        id="author"
                        value={author}
                        disabled // Disable field to avoid modification
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Danh mục</label>
                      <select
                        className={`form-select ${!hasPermission("Xem danh mục bài viết") ? 'is-invalid' : ''}`}
                        id="blog_category_id"
                        {...register("blog_category_id", {
                          required: hasPermission("Xem danh mục bài viết") ? "Vui lòng chọn danh mục!" : false,
                        })}
                        disabled={!hasPermission("Xem danh mục bài viết")}
                      >
                        {hasPermission("Xem danh mục bài viết") ? (
                          blogCategoryState.categories &&
                          blogCategoryState.categories.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value={blogState.blog[0]?.blog_category_id} disabled>
                            Bạn không có quyền xem danh mục
                          </option>
                        )}
                      </select>

                      {!hasPermission("Xem danh mục bài viết") && (
                        <p className="text-danger">Bạn không có quyền xem danh mục!</p>
                      )}

                      {errors.blog_category_id && (
                        <p className="text-danger">
                          {errors.blog_category_id.message}
                        </p>
                      )}

                      <div className="form-group">
                        <label htmlFor="poster">Ảnh poster</label>
                        <br />
                        <ImageUploadComponent
                          id="poster"
                          onImageUpload={handleImageUpload}
                        />
                        {initialPoster && (
                          <div>
                            <img
                              src={initialPoster}
                              alt="Poster"
                              style={{ maxWidth: "100px", marginTop: "10px" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="content">Nội dung</label>
                      <Editor
                        apiKey="o7ub26majar7p61pekuh08ovc6xapqtdkxh0erzmehc91v92" // Thêm khóa API vào đây
                        value={content}
                        onEditorChange={(newValue) => setContent(newValue)} // Cập nhật nội dung
                        init={{
                          height: 500,
                          menubar: false,
                          plugins: ['link', 'image', 'code'],
                          toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | code',
                        }}
                      />
                      {errors.content && (
                        <p className="text-danger">{errors.content.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="btn-group mt-3" role="group">
                  <button type="submit" className="btn btn-success">
                    Cập Nhật
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => navigate("/blogs?page=1")}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </form>
          <SuccessAlert
            open={openSuccess}
            onClose={handleSuccessClose}
            message="Cập nhật thông tin bài viết thành công!"
            vertical="top"
            horizontal="right"
          />
        </div>
      </div>
    </div>
  );
}
