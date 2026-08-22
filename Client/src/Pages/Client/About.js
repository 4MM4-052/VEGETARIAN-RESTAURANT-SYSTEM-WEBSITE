import React from 'react'

import ImageGallery from '../../Components/Client/ImageGallery';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div>

            <div className="container-fluid p-0 py-5 bg-dark hero-header mb-5">
                <div className="container text-center my-5 pt-5 pb-4">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">Về Chúng Tôi</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center text-uppercase">
                            <li className="breadcrumb-item">
                                <Link to="/">Trang chủ</Link>
                            </li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Về Chúng Tôi</li>
                        </ol>
                    </nav>
                </div>
            </div>



            {/* <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6">
                            <div className="row g-3">
                                <div className="col-6 text-start">
                                    <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.1s" src={ImageGallery.about1} />
                                </div>
                                <div className="col-6 text-start">
                                    <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.3s" src={ImageGallery.about2}
                                        style={{ marginBottom: '25%' }} />
                                </div>
                                <div className="col-6 text-end">
                                    <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.5s" src={ImageGallery.about3} />
                                </div>
                                <div className="col-6 text-end">
                                    <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.7s" src={ImageGallery.about4} />
                                </div>
                            </div>
                        </div>


                        <div className="col-lg-6">
                            <h5 className="section-title ff-secondary text-start text-primary fw-normal">Về Chúng Tôi</h5>
                            <h1 className="mb-4">Chào Mừng Đến Với <i className="fa fa-utensils text-primary me-2"></i>Nhà Hàng</h1>
                            <p className="mb-4">Chúng tôi tự hào mang đến cho bạn trải nghiệm ẩm thực độc đáo và tuyệt vời. Với nhiều năm kinh nghiệm và đội ngũ đầu bếp tài năng, chúng tôi cam kết mang lại những món ăn ngon miệng và dịch vụ chuyên nghiệp nhất.</p>
                            <p className="mb-4">Không chỉ là một nhà hàng, chúng tôi còn là nơi bạn có thể thưởng thức những giây phút thư giãn, tận hưởng không gian ấm cúng và phong cách phục vụ tận tâm. Chúng tôi luôn nỗ lực không ngừng để mang đến những điều tốt nhất cho khách hàng của mình.</p>
                            <div className="row g-4 mb-4">
                                <div className="col-sm-6">
                                    <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                                        <h1 className="flex-shrink-0 display-5 text-primary mb-0" data-toggle="counter-up">15</h1>
                                        <div className="ps-4">
                                            <p className="mb-0">Năm</p>
                                            <h6 className="text-uppercase mb-0">Kinh Nghiệm</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                                        <h1 className="flex-shrink-0 display-5 text-primary mb-0" data-toggle="counter-up">30</h1>
                                        <div className="ps-4">
                                            <p className="mb-0">Đầu Bếp</p>
                                            <h6 className="text-uppercase mb-0">Hàng Đầu</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a className="btn btn-primary py-3 px-5 mt-2" href="">Xem Thêm</a>
                        </div>

                        
                    </div>
                </div>
            </div> */}





<div className="container-xxl py-5" style={{ background: 'linear-gradient(135deg, #f7f9fc 0%, #d9e6f5 100%)' }}>
  <div className="container">
    <div className="row g-5 align-items-center">
      
 <div className="col-lg-6" style={{ position: 'relative', height: '500px', perspective: '1000px' }}>
  {/* Video tròn ở giữa */}
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '250px',
    height: '250px',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    overflow: 'hidden',
    boxShadow: '0 25px 45px rgba(0,0,0,0.4)',
    border: '8px solid #fff6e0',
    zIndex: 5,
  }}>
    <video
      src="https://nhahangchayhuongsen.com/huong-sen-web.mp4"
      autoPlay
      loop
      muted
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  </div>

  {/* 4 ảnh với layout xoay sáng tạo */}
  {[
    {
      src: ImageGallery.about1,
      style: {
        top: '-16%',
        left: '5%',
        width: '280px',
        transform: 'rotate(-20deg) translate(-10px, -10px)',
        zIndex: 3
      },
      sticker: '🔥 Warm Space'
    },
    {
      src: ImageGallery.about2,
      style: {
        top: '-30%',
        right: '5%',
        width: '270px',
        transform: 'rotate(15deg) translate(10px, -15px)',
        zIndex: 3
      },
      sticker: '⭐ Chef’s Choice'
    },
    {
      src: ImageGallery.about3,
      style: {
        bottom: '10%',
        left: '5%',
        width: '280px',
        transform: 'rotate(-12deg) translate(-5px, 10px)',
        zIndex: 3
      },
      sticker: '🥗 Perfect Starter'
    },
    {
      src: ImageGallery.about4,
      style: {
        bottom: '2%',
        right: '2%',
        width: '280px',
        transform: 'rotate(18deg) translate(8px, 10px)',
        zIndex: 3
      },
      sticker: '🏆 Best Seller'
    }
  ].map(({ src, style, sticker }, idx) => (
    <div
      key={idx}
      style={{
        position: 'absolute',
        ...style,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        borderRadius: '16px',
        border: '6px solid #fff8e1',
        backgroundColor: '#fff8e1',
        overflow: 'hidden',
        boxShadow: '0 18px 35px rgba(0,0,0,0.28)',
      }}
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        e.currentTarget.style.transform = `${style.transform} translate3d(${x * 0.04}px, ${y * 0.04}px, 12px) scale(1.05)`;
        e.currentTarget.style.boxShadow = '0 28px 45px rgba(0,0,0,0.38)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = style.transform;
        e.currentTarget.style.boxShadow = '0 18px 35px rgba(0,0,0,0.28)';
      }}
    >
      <img src={src} alt={`about${idx + 1}`} style={{ width: '100%', display: 'block', borderRadius: '12px' }} />
      {sticker && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#ff5e57',
          color: '#fff',
          padding: '6px 12px',
          fontSize: '0.8rem',
          borderRadius: '20px',
          fontWeight: 'bold',
          boxShadow: '0 3px 6px rgba(0,0,0,0.2)'
        }}>
          {sticker}
        </div>
      )}
    </div>
  ))}
</div>


      {/* Nội dung sáng tạo */}
      <div className="col-lg-6">
        <h5 className="section-title ff-secondary text-primary fw-bold text-start">
          Về Chúng Tôi
        </h5>

        {/* Typing effect (giả lập bằng CSS animation) */}
        <h1 className="mb-4 fw-bold" style={{ fontSize: '2.5rem', minHeight: '3rem' }}>
          <span className="typing-text">Chào Mừng Đến Với Nhà Hàng</span>
        </h1>

        {/* Quote */}
        <blockquote className="blockquote text-muted fst-italic mb-4" style={{ borderLeft: '4px solid #4e73df', paddingLeft: '1rem' }}>
          “Ẩm thực không chỉ là thức ăn, mà là câu chuyện của tình yêu, văn hóa và sự sáng tạo không ngừng.”  
          
        </blockquote>

        {/* Mô tả chi tiết với icon */}
        <ul className="list-unstyled fs-5 mb-4">
          <li className="mb-3 d-flex align-items-center">
            <i className="fa fa-check-circle text-success me-3 fs-4"></i>
            <span><strong>Nguyên liệu tươi sạch</strong> được lựa chọn kỹ lưỡng từ các nhà cung cấp uy tín.</span>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <i className="fa fa-check-circle text-success me-3 fs-4"></i>
            <span>Đầu bếp <strong>kinh nghiệm & sáng tạo</strong>, luôn đổi mới để làm hài lòng thực khách.</span>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <i className="fa fa-check-circle text-success me-3 fs-4"></i>
            <span>Không gian ấm cúng, sang trọng, <strong>phù hợp cho mọi dịp</strong> từ gặp gỡ bạn bè đến tổ chức sự kiện.</span>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <i className="fa fa-check-circle text-success me-3 fs-4"></i>
            <span>Dịch vụ chuyên nghiệp, tận tâm, luôn đặt <strong>khách hàng lên hàng đầu</strong>.</span>
          </li>
        </ul>

        {/* Thống kê mở rộng */}
       <div className="row g-4 mb-5">
  {[
    {
      number: '15',
      label1: 'Năm',
      label2: 'Kinh Nghiệm',
      icon: 'fa-solid fa-award',
      color1: '#ff6f61',
      color2: '#ff9472',
    },
    {
      number: '30',
      label1: 'Đầu Bếp',
      label2: 'Hàng Đầu',
      icon: 'fa-solid fa-user-tie',
      color1: '#20c997',
      color2: '#28a745',
    },
    {
      number: '400+',
      label1: 'Khách Hàng',
      label2: 'Hài Lòng',
      icon: 'fa-solid fa-users',
      color1: '#4e73df',
      color2: '#6f42c1',
    },
    {
      number: '50+',
      label1: 'Món Ăn',
      label2: 'Đa Dạng',
      icon: 'fa-solid fa-utensils',
      color1: '#f6c23e',
      color2: '#fd7e14',
    },
  ].map((item, idx) => (
    <div key={idx} className="col-md-6 col-xl-3">
      <div
        className="text-center p-4 rounded position-relative overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = `0 15px 35px ${item.color1}33`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
        }}
      >
        {/* Icon trong vòng tròn gradient */}
        <div
          className="mx-auto mb-3"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${item.color1}, ${item.color2})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <i className={`${item.icon} text-white`} style={{ fontSize: '1.5rem' }}></i>
        </div>

        {/* Nội dung */}
        <h2
          className="fw-bold mb-2"
          style={{
            color: item.color1,
            fontSize: '2.5rem',
          }}
        >
          {item.number}
        </h2>
        <p className="mb-0 fw-semibold">{item.label1}</p>
        <h6 className="text-uppercase text-muted">{item.label2}</h6>
      </div>
    </div>
  ))}
</div>

        
      </div>
    </div>



    {/* Phần khách hàng review (demo - bạn có thể thay bằng slider thư viện) */}
    <div className="row mt-5">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // căn giữa cả hàng
          gap: "1rem",               // khoảng cách giữa H3 & nút
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <h3
          className="fw-bold"
          style={{
            margin: 0,
            color: "#dc3545",        // đỏ giống text-danger
            fontWeight: 800,         // đậm hơn
            textAlign: "center",
          }}
        >
          Khách Hàng Nói Gì Về Chúng Tôi
        </h3>

        <Link
          to="/danhgia"
          className="btn fw-semibold"
          style={{
            padding: "0.4rem 1.2rem",
            borderRadius: "25px",
            fontSize: "0.95rem",
            color: "#dc3545",         // cùng tone đỏ
            border: "2px solid #dc3545",
            backgroundColor: "transparent",
            fontWeight: "600",
            boxShadow: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#dc3545";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#dc3545";
          }}
        >
          Xem Thêm
        </Link>
      </div>


      <div className="col-md-4 mb-4">
        <div className="card shadow-sm p-3 rounded">
          <p className="fst-italic">
            “Không gian nhà hàng thật tuyệt vời, đồ ăn ngon và nhân viên thân thiện. Mình chắc chắn sẽ quay lại!”
          </p>
          <div className="d-flex align-items-center">
            <img src="Assets/Client/Images/testimonial-2.jpg" alt="Khách hàng 1" className="rounded-circle me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            <div>
              <h6 className="mb-0">Nguyễn Văn A</h6>
              <small className="text-muted">Khách hàng thân thiết</small>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm p-3 rounded">
          <p className="fst-italic">
            “Món ăn đa dạng, vị rất vừa miệng. Phục vụ chuyên nghiệp và nhanh chóng. Rất hài lòng!”
          </p>
          <div className="d-flex align-items-center">
            <img src="Assets/Client/Images/testimonial-1.jpg" alt="Khách hàng 2" className="rounded-circle me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            <div>
              <h6 className="mb-0">Trần Thị B</h6>
              <small className="text-muted">Khách hàng mới</small>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm p-3 rounded">
          <p className="fst-italic">
            “Một trong những nhà hàng tốt nhất mà tôi từng đến. Đầu bếp rất chuyên nghiệp, không gian rất đẹp.”
          </p>
          <div className="d-flex align-items-center">
            <img src="Assets/Client/Images/testimonial-3.jpg" alt="Khách hàng 3" className="rounded-circle me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            <div>
              <h6 className="mb-0">Lê Văn C</h6>
              <small className="text-muted">Thực khách VIP</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* FAQ mini */}
<div className="row mt-5">
  <h3
    className="text-center mb-4 fw-bold"
    style={{
      color: '#2c3e50',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}
  >
    Câu Hỏi Thường Gặp
  </h3>
  <div className="col-md-8 mx-auto">
    <div className="accordion" id="faqAccordion">
      {[
        {
          id: 1,
          question: "Nhà hàng có nhận đặt tiệc không?",
          answer:
            "Chúng tôi nhận đặt tiệc với số lượng từ 10 người trở lên, vui lòng liên hệ trước để được hỗ trợ tốt nhất.",
        },
        {
            id: 2,
            question: "Nhà hàng có chỗ đậu xe không?",
            answer: "Nhà hàng có khu vực đậu xe miễn phí rộng rãi dành cho khách hàng.",
        },
        {
          id: 3,
          question: "Giờ mở cửa của nhà hàng?",
          answer: "Nhà hàng mở cửa từ:\n\tThứ 2 - Thứ 6 -> 8:00 AM đến 22:00 PM\n\tThứ 7 - Chủ Nhật -> 10:00 AM đến 23:00 PM",
        },
        {
            id: 4,
            question: "Có hỗ trợ tổ chức sinh nhật tại nhà hàng không?",
            answer: "Chúng tôi rất vui được hỗ trợ tổ chức các buổi tiệc sinh nhật với nhiều ưu đãi hấp dẫn."
        },
      ].map(({ id, question, answer }) => (
        <div
          key={id}
          className="accordion-item mb-3 rounded"
          style={{
            backgroundColor: "#f9fbfc",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 8px 20px rgba(93, 173, 226, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <h2 className="accordion-header" id={`heading${id}`}>
            <button
              className="accordion-button collapsed d-flex align-items-center"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse${id}`}
              aria-expanded="false"
              aria-controls={`collapse${id}`}
              style={{
                backgroundColor: "#dff4fb",
                color: "#1a3c72",
                fontWeight: "600",
                fontSize: "1.15rem",
                borderRadius: "0.7rem",
                border: "none",
                padding: "1rem 1.8rem",
                boxShadow: "inset 2px 2px 6px rgba(26, 60, 114, 0.15)",
                userSelect: "none",
                letterSpacing: "0.02em",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a7d7f9")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dff4fb")}
            >
              <span
                style={{
                  display: "inline-block",
                  fontSize: "1.5rem",
                  marginRight: "14px",
                  userSelect: "none",
                  transition: "transform 0.3s ease",
                  color: "#1a3c72",
                }}
              >
                ▶
              </span>
              {question}
            </button>
          </h2>
          <div
            id={`collapse${id}`}
            className="accordion-collapse collapse"
            aria-labelledby={`heading${id}`}
            data-bs-parent="#faqAccordion"
            style={{ backgroundColor: "transparent" }}
          >
            <div
              className="accordion-body"
              style={{
                backgroundColor: "transparent",
                padding: "1.5rem 2rem",
                fontSize: "1rem",
                color: "#2c3e50",
                fontStyle: "italic",
                borderLeft: "4px solid #5dade2",
                borderRadius: "0 0 0.7rem 0.7rem",
                boxShadow: "none",
                userSelect: "text",
                whiteSpace: 'pre-wrap',
              }}
            >
              {answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


    
  </div>

  {/* CSS typing effect */}
  <style>{`
    .typing-text {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      border-right: 3px solid #4e73df;
      animation: typing 8s steps(51, end) infinite, blink-caret 0.7s step-end infinite;
      
    }
    @keyframes typing {
      0%, 100% { width: 0 }
      50% { width: 100% }
    }
    @keyframes blink-caret {
      0%, 100% { border-color: transparent }
      50% { border-color: #4e73df }
    }
    .btn-gradient:hover {
      color: #fff !important;
    }

    
  `}</style>
</div>







            <div className="container-xxl pt-5 pb-3">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">Thành Viên</h5>
                        <h1 className="mb-5">Đội Ngũ Đầu Bếp</h1>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="team-item text-center rounded overflow-hidden">
                                <div className="rounded-circle overflow-hidden m-4">
                                    <img className="img-fluid" src={ImageGallery.team1} alt="" />
                                </div>
                                <h5 className="mb-0">Hoàng Thanh C</h5>
                                <small>Đầu Bếp Trưởng</small>
                                <div className="d-flex justify-content-center mt-3">
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                            <div className="team-item text-center rounded overflow-hidden">
                                <div className="rounded-circle overflow-hidden m-4">
                                    <img className="img-fluid" src={ImageGallery.team2} alt="" />
                                </div>
                                <h5 className="mb-0">Trương Ngọc M</h5>
                                <small>Đầu Bếp Chính</small>
                                <div className="d-flex justify-content-center mt-3">
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                            <div className="team-item text-center rounded overflow-hidden">
                                <div className="rounded-circle overflow-hidden m-4">
                                    <img className="img-fluid" src={ImageGallery.team3} alt="" />
                                </div>
                                <h5 className="mb-0">Vũ Thiên Y</h5>
                                <small>Đầu Bếp</small>
                                <div className="d-flex justify-content-center mt-3">
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
                            <div className="team-item text-center rounded overflow-hidden">
                                <div className="rounded-circle overflow-hidden m-4">
                                    <img className="img-fluid" src={ImageGallery.team4} alt="" />
                                </div>
                                <h5 className="mb-0">Trần Diệu U</h5>
                                <small>Đầu Bếp Phụ</small>
                                <div className="d-flex justify-content-center mt-3">
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
