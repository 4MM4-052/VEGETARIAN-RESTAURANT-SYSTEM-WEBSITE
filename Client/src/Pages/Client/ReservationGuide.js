import React from 'react'
import { Link } from 'react-router-dom'

function ReservationGuide() {
    return (
        <>
            <div className="container-fluid py-5 bg-dark hero-header mb-2">
            </div>

            <div className="container py-4">
  <div className="row justify-content-center">
    <div className="col-lg-9">
      <div className="text-center mb-5">
        <h1 className="text-uppercase fw-bold" style={{ color: '#E67E22', fontSize: '2.2rem' }}>
          <i className="fa-solid fa-utensils me-2"></i>Hướng dẫn đặt bàn
        </h1>
        <p className="text-muted" style={{fontSize: '1.4rem' }}>Cách thức đơn giản để bạn đặt bàn và chọn món ăn nhanh chóng!</p>
      </div>

      {/* Bước 1 */}
      <div className="mb-5">
        <h4 className="fw-semibold" style={{ color: "#1313ff" }}>
          <i className="fa-regular fa-pen-to-square me-2"></i>1. Điền thông tin
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
      <div className="mb-5">
        <h4 className="fw-semibold text-success">
          <i className="fa-solid fa-bowl-food me-2"></i>2. Chọn món ăn
        </h4>
        <p>Chọn các món ăn từ thực đơn: món chính, phụ, tráng miệng, đồ uống.</p>
        <p>Thông tin món được hiển thị ở mục <strong>"Món ăn đã chọn"</strong>.</p>
        <p>Bạn có thể dễ dàng thêm, xoá hoặc chỉnh số lượng món tại đây.</p>
      </div>

      {/* Bước 3 */}
      <div className="mb-5">
        <h4 className="fw-semibold text-primary">
          <i className="fa-solid fa-credit-card me-2"></i>3. Thanh toán (nếu có)
        </h4>
        <p>Nếu yêu cầu thanh toán trước, bạn sẽ được chuyển đến trang thanh toán.</p>
        <p>Chọn hình thức thanh toán phù hợp: <em>thẻ, ví điện tử, chuyển khoản...</em></p>
        <p>Sau đó ấn <strong>"Xác nhận thanh toán"</strong>.</p>
      </div>

      {/* Bước 4 */}
      <div className="mb-5">
        <h4 className="fw-semibold text-danger">
          <i className="fa-solid fa-check-circle me-2"></i>4. Xác nhận đặt bàn
        </h4>
        <p>Kiểm tra lại toàn bộ đơn đặt và điều chỉnh nếu cần.</p>
        <p>Sau khi ấn <strong>"Đồng ý đặt bàn"</strong>, bạn sẽ nhận được xác nhận qua tin nhắn/email trong 10 phút.</p>
      </div>

      {/* Lưu ý */}
      <div className="mb-5 p-4 rounded" style={{ background: '#fff8e1', borderLeft: '6px solid #f39c12' }}>
        <h5 className="fw-bold mb-3">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>Lưu ý khi đặt bàn
        </h5>
        <ul className="mb-0">
          <li>Chỉ tiếp nhận đơn từ <strong>09:00</strong> đến <strong>21:00</strong> mỗi ngày.</li>
          <li>Yêu cầu đặt trước ít nhất <strong>2 tiếng</strong> so với giờ đến.</li>
          <li>Với đơn đã thanh toán, vui lòng liên hệ đổi/hủy ít nhất <strong>1 tiếng</strong> trước giờ hẹn.</li>
        </ul>
      </div>

      <div className="text-center">
        <Link to="/" className="btn btn-outline-primary px-4">
          <i className="fa-solid fa-arrow-left me-2"></i>Về trang chủ
        </Link>
      </div>
    </div>
  </div>
</div>


            
        </>
    )
}

export default ReservationGuide
