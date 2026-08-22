// import React, { useState, useEffect, useRef} from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
// import { fetchCategoryBlog } from "../../Actions/BlogsCategoriesActions";
// import { addBlog } from "../../Actions/BlogActions";
// import { SuccessAlert } from "../../Components/Alert/Alert";
// import CustomSpinner from "../../Components/Spinner/CustomSpinner";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// // import ReactQuill from "react-quill-ver2";
// // import "quill/dist/quill.snow.css";
// import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode

// import { getPermissions } from "../../Actions/GetQuyenHanAction";
// import { jwtDecode as jwt_decode } from "jwt-decode";

// export default function BlogAdd() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const getQuyenHanState = useSelector((state) => state.getQuyenHan);
//   const permissions = getQuyenHanState.getQuyenHan || [];

//   const quillRef = useRef(null);

//   useEffect(() => {
//   if (token) {
//       const decodedToken = jwt_decode(token);
//       const userIdFromToken = decodedToken.id;
//       dispatch(getPermissions(userIdFromToken));
//   }
//   const decodedToken = jwt_decode(token);
//   const userIdFromToken = decodedToken.id;
//   dispatch(getPermissions(userIdFromToken));
//   }, [navigate, dispatch, token]);

//   const hasPermission = (permissionName) => {
//   return (
//       permissions.data &&
//       permissions.data.some((permission) => permission.name == permissionName)
//   );
//   };

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm();
//   const blogCategoryState = useSelector((state) => state.categories);

//   const [poster, setPoster] = useState("");
//   const [content, setContent] = useState("");
//   const [openSuccess, setOpenSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     dispatch(fetchCategoryBlog());

//     // Function to get the user's full name from the token and localStorage
//     const getValue = () => {
//       const accessToken = localStorage.getItem("token");
//       if (accessToken) {
//         const decodedToken = jwtDecode(accessToken); // Correct usage of jwtDecode

//         const storedProfile = localStorage.getItem("user_admin");
//         if (storedProfile) {
//           const parsedProfile = JSON.parse(storedProfile);

//           // Set the author's username automatically in a hidden input
//           setValue("author", parsedProfile.username);
//         }
//       }
//     };

//     getValue(); // Call the function on component load
//   }, [dispatch, setValue]);

//   const handleImageUpload = (fileNames) => {
//     if (fileNames.length > 0) {
//       setPoster(fileNames[0]);
//     }
//   };

//   const handleSuccessClose = () => {
//     setOpenSuccess(false);
//   };

//   const onSubmit = async (data) => {
//     setLoading(true);
//     data.poster = poster;
//     data.content = content;

//     try {
//       await dispatch(addBlog(data));
//       setOpenSuccess(true);
//       setTimeout(() => {
//         navigate("/blogs");
//       }, 2000);
//     } catch (error) {
//       console.error("Error adding blog:", error);
//     } finally {
//       setLoading(false);
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

//   const getUncategorizedId = () => {
//       const uncategorizedCategory = blogCategoryState.categories.find(item => item.name === "Chưa phân loại");
//       return uncategorizedCategory ? uncategorizedCategory.id : "";
//   };
  
//   // Lọc các danh mục có trạng thái là 1
//   const filteredCategories = blogCategoryState.categories
//   ? blogCategoryState.categories.filter(item => item.status === 1)
//   : [];

//   return (
//     <div className="container">
//       <div className="page-inner">
//         <div className="row">
//           <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
//             <div className="card">
//               <div className="card-header">
//                 <div className="card-title">Thêm bài viết</div>
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
//                       <label htmlFor="poster">Ảnh poster</label>
//                       <br />
//                       <ImageUploadComponent
//                         id="poster"
//                         onImageUpload={handleImageUpload}
//                       />
//                     </div>

//                     <input
//                       type="hidden"
//                       {...register("author", {
//                         required: "Tác giả là bắt buộc",
//                       })}
//                     />
//                     {errors.author && (
//                       <p className="text-danger">{errors.author.message}</p>
//                     )}
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <label>Danh mục</label>
//                       {/* Add the form-control class to make it consistent */}
//                       {/* <select
//                         className="form-control"
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
//                           className={`form-select ${!canViewCategories ? 'is-invalid' : ''}`} 
//                           id="blog_category_id"
//                           {...register("blog_category_id", {
//                               required: "Vui lòng chọn danh mục!",
//                           })}
//                           disabled={!canViewCategories} // Disable nếu không có quyền
//                       >
//                           {canViewCategories ? (
//                               filteredCategories.length > 0 ? (
//                                 filteredCategories.map((item) => (
//                                     <option key={item.id} value={item.id}>
//                                         {item.name}
//                                     </option>
//                                 ))
//                               ) : (
//                                   <option disabled>
//                                       Không có danh mục nào khả dụng.
//                                   </option>
//                               )
//                           ) : (
//                               <option value={getUncategorizedId()} disabled>
//                                   Bạn không có quyền xem danh mục!
//                               </option>
//                           )}
//                       </select>
//                       {errors.blog_category_id && (
//                         <p className="text-danger">
//                           {errors.blog_category_id.message}
//                         </p>
//                       )}
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
//                   <button
//                     type="submit"
//                     className="btn btn-success"
//                     disabled={loading}
//                   >
//                     Thêm mới
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
//             message="Thêm bài viết thành công!"
//             vertical="top"
//             horizontal="right"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ImageUploadComponent from "../../Components/ImageUpload/ImageUpload";
import { fetchCategoryBlog } from "../../Actions/BlogsCategoriesActions";
import { addBlog } from "../../Actions/BlogActions";
import { SuccessAlert } from "../../Components/Alert/Alert";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";
import { Editor } from "@tinymce/tinymce-react";  // Import TinyMCE Editor
import { getPermissions } from "../../Actions/GetQuyenHanAction";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function BlogAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const getQuyenHanState = useSelector((state) => state.getQuyenHan);
  const permissions = getQuyenHanState.getQuyenHan || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const blogCategoryState = useSelector((state) => state.categories);

  const [poster, setPoster] = useState("");
  const [content, setContent] = useState("");  // Content for TinyMCE
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetching categories and permissions
  useEffect(() => {
    dispatch(fetchCategoryBlog());

    if (token) {
      const decodedToken = jwt_decode(token);
      const userIdFromToken = decodedToken.id;
      dispatch(getPermissions(userIdFromToken));
    }

    const getValue = () => {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        const decodedToken = jwt_decode(accessToken);

        const storedProfile = localStorage.getItem("user_admin");
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setValue("author", parsedProfile.username);
        }
      }
    };
    getValue();
  }, [dispatch, setValue, token]);

  const hasPermission = (permissionName) => {
    return (
      permissions.data &&
      permissions.data.some((permission) => permission.name === permissionName)
    );
  };

  const handleImageUpload = (fileNames) => {
    if (fileNames.length > 0) {
      setPoster(fileNames[0]);
    }
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    data.poster = poster;
    data.content = content;

    try {
      await dispatch(addBlog(data));
      setOpenSuccess(true);
      setTimeout(() => {
        navigate("/blogs");
      }, 2000);
    } catch (error) {
      console.error("Error adding blog:", error);
    } finally {
      setLoading(false);
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

  const getUncategorizedId = () => {
    const uncategorizedCategory = blogCategoryState.categories.find(item => item.name === "Chưa phân loại");
    return uncategorizedCategory ? uncategorizedCategory.id : "";
  };

  // Lọc các danh mục có trạng thái là 1
  const filteredCategories = blogCategoryState.categories
    ? blogCategoryState.categories.filter(item => item.status === 1)
    : [];

  return (
    <div className="container">
      <div className="page-inner">
        <div className="row">
          <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Thêm bài viết</div>
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
                      <label htmlFor="poster">Ảnh poster</label>
                      <br />
                      <ImageUploadComponent
                        id="poster"
                        onImageUpload={handleImageUpload}
                      />
                    </div>

                    <input
                      type="hidden"
                      {...register("author", {
                        required: "Tác giả là bắt buộc",
                      })}
                    />
                    {errors.author && (
                      <p className="text-danger">{errors.author.message}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Danh mục</label>
                      <select
                        className={`form-select ${!canViewCategories ? 'is-invalid' : ''}`}
                        id="blog_category_id"
                        {...register("blog_category_id", {
                          required: "Vui lòng chọn danh mục!",
                        })}
                        disabled={!canViewCategories} // Disable nếu không có quyền
                      >
                        {canViewCategories ? (
                          filteredCategories.length > 0 ? (
                            filteredCategories.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))
                          ) : (
                            <option disabled>
                              Không có danh mục nào khả dụng.
                            </option>
                          )
                        ) : (
                          <option value={getUncategorizedId()} disabled>
                            Bạn không có quyền xem danh mục!
                          </option>
                        )}
                      </select>
                      {errors.blog_category_id && (
                        <p className="text-danger">
                          {errors.blog_category_id.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="content">Nội dung</label>
                      <Editor
                        apiKey="o7ub26majar7p61pekuh08ovc6xapqtdkxh0erzmehc91v92"  // Thêm khóa API của bạn vào đây
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
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    Thêm mới
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
            message="Thêm bài viết thành công!"
            vertical="top"
            horizontal="right"
          />
        </div>
      </div>
    </div>
  );
}
