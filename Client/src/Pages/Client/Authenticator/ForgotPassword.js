import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { DangerAlert, SuccessAlert } from '../../../Components/Alert/Alert';
import { forgotPassword } from '../../../Actions/AuthActions';
import Spinner from '../../../Components/Client/Spinner';

export default function ForgotPassword() {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);



    const onSubmit = async (data) => {
        setLoading(true); // Bắt đầu hiển thị spinner khi bắt đầu gửi yêu cầu
        try {
            await dispatch(forgotPassword(data.email));
            setSuccessMessage('Email đặt lại mật khẩu đã được gửi!');
            setErrorMessage('');  // Xóa thông báo lỗi nếu có
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage('');  // Xóa thông báo thành công nếu có
        } finally {
            setLoading(false); // Kết thúc hiển thị spinner sau khi hoàn tất
        }
    };


    return (

        <div>
            <div className="container-fluid py-5 bg-dark hero-header mb-5">
            </div>
            <div className="container py-5">
  <div className="row justify-content-center">
    <div className="col-md-6">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center mb-4 text-black">Quên mật khẩu</h2>

            <div className="form-group mb-4">
              <label htmlFor="email" className="form-label fw-semibold">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="fa fa-envelope text-secondary"></i>
                </span>
                <input
                  type="email"
                  className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  placeholder="Nhập email của bạn"
                  {...register('email', {
                    required: 'Email là bắt buộc',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email không hợp lệ',
                    },
                  })}
                />
              </div>
              {errors.email && <div className="text-danger mt-1">{errors.email.message}</div>}
            </div>

            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn"
                style={{
                  borderRadius: '25px',
                  fontSize: '1rem',
                  padding: '10px 20px',
                  color: '#f0ad4e',
                  border: '2px solid #f0ad4e',
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s ease',
                  fontWeight: '800',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#f0ad4e';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.fontWeight = '900';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#f0ad4e';
                  e.currentTarget.style.fontWeight = '900';
                }}
              >
                Gửi yêu cầu
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-decoration-none link-primary" style={{ fontWeight: 500 }}>
                <strong><i className="fa-solid fa-arrow-left ms-2"></i> Trở lại </strong>
              </Link>
            </div>
          </form>

          {loading && (
            <div className="mt-4 text-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>


            
            {/* Thông báo */}
            <SuccessAlert open={!!successMessage} onClose={() => setSuccessMessage('')} message={successMessage} />
            <DangerAlert open={!!errorMessage} onClose={() => setErrorMessage('')} message={errorMessage} />
        </div>


    );
}
