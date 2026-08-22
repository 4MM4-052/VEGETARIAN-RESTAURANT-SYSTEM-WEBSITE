import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addTable } from "../../Actions/TablesActions";
import { SuccessAlert, DangerAlert } from "../../Components/Alert/Alert";

export default function TableAdd() {
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
  const [errorMessage, setErrorMessage] = useState("");

  const handleSuccessClose = () => {
    setOpenSuccess(false);
  };

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const onSubmit = async (data) => {
    const currentDate = new Date().toISOString();
    const tableData = {
      ...data,
      created_at: currentDate,
      updated_at: currentDate,
    };

    try {
      await dispatch(addTable(tableData));
      setOpenSuccess(true);
      reset();
      navigate("/tables"); // Điều hướng ngay lập tức sau khi thêm thành công
    } catch (error) {
      setErrorMessage('Thêm bàn không thành công!');
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
                <div className="card-title">Thêm Bàn Ăn</div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="number">Số Bàn</label>
                      <input
                        type="number"
                        className="form-control"
                        id="number"
                        placeholder="Nhập số bàn"
                        {...register("number", {
                          required: "Số bàn là bắt buộc",
                          valueAsNumber: true,
                          min: { value: 0, message: "Số bàn không được âm" },
                        })}
                      />
                      {errors.number && (
                        <p className="text-danger">{errors.number.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="capacity">Số Lượng Người Tối Đa</label>
                      <select defaultValue="1"
                        className="form-control"
                        id="capacity"
                        {...register("capacity", {
                          required: "Số lượng người tối đa là bắt buộc",
                          validate: (value) =>
                            [2, 4, 6, 8].includes(Number(value)) ||
                            "Số lượng người không hợp lệ",
                        })}
                      >
                        <option value="">Chọn số lượng người</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="6">6</option>
                        <option value="8">8</option>
                      </select>
                      {errors.capacity && (
                        <p className="text-danger">{errors.capacity.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="status">Trạng Thái</label>
                      <select defaultValue="1"
                        id="status"
                        className="form-control"
                        {...register("status", {
                          required: "Trạng thái là bắt buộc",
                        })}
                      >
                        <option value="1">Bàn trống</option>
                      </select>
                      {errors.status && (
                        <p className="text-danger">{errors.status.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="btn-group mt-3" role="group">
                  <button type="submit" className="btn btn-success">
                    Thêm mới
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => navigate("/tables")}
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
            message="Thêm bàn ăn thành công!"
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
