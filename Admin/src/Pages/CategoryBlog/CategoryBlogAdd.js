import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addCategoryBlog } from "../../Actions/BlogsCategoriesActions";
import { SuccessAlert, DangerAlert } from "../../Components/Alert/Alert";

export default function CategoryBlogAdd() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSuccessClose = () => {
    setOpenSuccess(false);
  };

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const onSubmit = async (data) => {
    const currentDate = new Date().toISOString();
    const categoryData = {
      ...data,
      status: 1,
      created_at: currentDate,
      updated_at: currentDate,
    };

    setLoading(true);
    try {
      await dispatch(addCategoryBlog(categoryData));
      setOpenSuccess(true);
      reset();
      setTimeout(() => {
        navigate("/category-blog");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">Đang xử lý...</div>
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
                <div className="card-title">Thêm danh mục</div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="name">Tên danh mục</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Nhập tên danh mục"
                        {...register("name", {
                          required: "Tên danh mục là bắt buộc",
                        })}
                      />
                      {errors.name && (
                        <p className="text-danger">{errors.name.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="status">Trạng thái</label>
                      <select defaultValue="1"
                        id="status"
                        className="form-control"
                        {...register("status")}
                      >
                        <option value="1">Hoạt động</option>
                        <option value="0">Ngưng hoạt động</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="btn-group mt-3" role="group">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    Thêm mới
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => navigate("/category-blog")}
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
            message="Thêm danh mục thành công!"
            vertical="top"
            horizontal="right"
          />
          <DangerAlert
            open={openError}
            onClose={handleErrorClose}
            message={errorMessage}
            vertical="top"
            horizontal="right"
          />
        </div>
      </div>
    </div>
  );
}
