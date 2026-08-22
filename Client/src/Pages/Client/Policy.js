import React from 'react'
import { Link } from 'react-router-dom'

function Policy() {
    return (
        <>
            <div className="container-fluid py-5 bg-dark hero-header mb-2">
            </div>
            <div className="container py-1">
                <div className="row">



                   <div className="container py-5">
  {/* Chính sách hoạt động */}
  <div className="text-center mb-5">
    <h1 className="text-uppercase fw-bold" style={{ color: '#1a3c72', fontSize: '2.3rem', fontFamily: 'Times New Roman, Times, serif' }}>
      <i className="fa-solid fa-gear me-2"></i>Chính sách hoạt động chung
    </h1>
  </div>

  <div className="row justify-content-center mb-5">
    <div className="col-md-10 col-lg-8">
      <div className="bg-light p-4 rounded shadow-sm">
        <h3 className="mb-3" style={{ color: '#000000', fontFamily: 'Times New Roman, Times, serif'}}>
          <i className="fa-regular fa-clock me-2"></i>Giờ hoạt động
        </h3>
        <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
          <span className="fw-medium">Thứ 2 - Thứ 6</span>
          <span>8:00 - 22:00</span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="fw-medium">Thứ 7 - Chủ Nhật</span>
          <span>10:00 - 23:00</span>
        </div>
      </div>
    </div>
  </div>

  {/* Hướng dẫn đặt bàn */}
  <div className="text-center mb-5">
    <h1 className="text-uppercase fw-bold" style={{ color: '#1a3c72', fontSize: '2.3rem', fontFamily: 'Times New Roman, Times, serif' }}>
      <i className="fa-solid fa-utensils me-2"></i> Hướng dẫn đặt bàn
    </h1>
    <p className="text-muted fs-5" style={{fontSize: '1.4rem' }}>Cách thức đơn giản để bạn đặt bàn và chọn món ăn nhanh chóng !!!</p>
  </div>

  <div className="row justify-content-center">
    <div className="col-md-10 col-lg-9">

      {/* Bước 1 */}
      <div className="step-box mb-5">
        <h4 className="fw-semibold text-primary">
          <i className="fa-regular fa-pen-to-square me-2"></i>Bước 1: Điền thông tin
        </h4>
        <p>Nhấn nút <strong>"Đặt bàn"</strong> trên trang chủ.</p>
        <p>Điền đầy đủ thông tin: <em>Họ tên, số điện thoại, ngày đặt, số lượng khách...</em></p>
        <p>Sau đó bạn có thể chọn:</p>
        <ul>
          <li>Ấn <strong>"Tiếp theo"</strong> để chọn món ăn.</li>
          <li>Hoặc ấn <strong>"Hoàn thành đặt chỗ"</strong> nếu chỉ muốn giữ chỗ.</li>
        </ul>
      </div>

      {/* Bước 2 */}
      <div className="step-box mb-5">
        <h4 className="fw-semibold text-success">
          <i className="fa-solid fa-bowl-food me-2"></i>Bước 2: Chọn món ăn
        </h4>
        <p>Chọn các món ăn từ thực đơn: <strong><em>Món Khai Vị, Món Chính, Lẩu, Mẹt Cuốn, Món Tráng Miệng, Đồ Uống,...</em></strong>
        </p>
        <p>Thông tin món được hiển thị ở mục <strong>"Món ăn đã chọn"</strong>.</p>
        <p>Bạn có thể dễ dàng thêm, xoá hoặc chỉnh số lượng món tại đây.</p>
      </div>

      {/* Bước 3 */}
      <div className="step-box mb-5">
        <h4 className="fw-semibold" style={{ color: '#0000b1'}}>
          <i className="fa-solid fa-credit-card me-2"></i>Bước 3: Thanh toán cọc
        </h4>
        <p>Sau khi chọn món xong, bạn sẽ được chuyển đến trang thanh toán.</p>
        <p>Bạn cần thanh toán trước <strong>30% giá trị đơn hàng</strong> để giữ chỗ.</p>
        <p>Vui lòng chọn hình thức thanh toán cọc qua <strong><em>MoMo</em></strong>.</p>
        <p>Sau khi thanh toán cọc thành công, bạn sẽ nhận được xác nhận đặt bàn.</p>
        <p>Phần chi phí còn lại sẽ được thanh toán trực tiếp tại nhà hàng sau khi dùng bữa.</p>
      </div>

      {/* Bước 4 */}
      <div className="step-box mb-5">
        <h4 className="fw-semibold text-danger">
          <i className="fa-solid fa-check-circle me-2"></i>Bước 4: Xác nhận đặt bàn
        </h4>
        <p>Kiểm tra lại toàn bộ đơn đặt và điều chỉnh nếu cần.</p>
        <p>Sau khi ấn <strong>"Đồng ý đặt bàn"</strong>, bạn sẽ nhận được xác nhận qua tin nhắn/email trong <strong>10 phút. </strong></p>
      </div>

      {/* Lưu ý */}
      <div className="alert alert-warning p-4 rounded shadow-sm" role="alert">
        <h5 className="fw-bold mb-3">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>Lưu ý khi đặt bàn
        </h5>
        <ul className="mb-0">
          <li>Chỉ tiếp nhận đơn từ <strong>09:00</strong> đến <strong>21:00</strong> mỗi ngày.</li>
          <li>Yêu cầu đặt trước ít nhất <strong>2 tiếng</strong> so với giờ đến.</li>
          <li>Với đơn đã thanh toán, vui lòng liên hệ đổi/hủy ít nhất <strong>1 tiếng</strong> trước giờ hẹn.</li>
        </ul>
      </div>

      {/* Nút về trang chủ */}
      <div className="text-center mt-5">
        <Link to="/" className="btn btn-outline-dark px-4 py-2">
          <i className="fa-solid fa-arrow-left me-2"></i>Về trang chủ
        </Link>
      </div>

    </div>
  </div>
</div>



                </div>
            </div>
        </>
    )
}

export default Policy
