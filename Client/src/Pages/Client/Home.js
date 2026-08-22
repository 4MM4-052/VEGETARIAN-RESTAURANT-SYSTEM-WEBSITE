import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductHoatDong, fetchProductWithNewDate } from "../../Actions/ProductActions";
import { Link, useNavigate } from "react-router-dom";
import ImageGallery from "../../Components/Client/ImageGallery";
import unidecode from "unidecode";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add useNavigate hook
  const productState = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProductWithNewDate());
  }, [dispatch]);

  useEffect(() => {
    const carouselEl = document.getElementById("heroCarousel");
    const carousel = new bootstrap.Carousel(carouselEl, {
      interval: 4000, // 4s
      ride: 'carousel',
      pause: false
    });
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const products = productState.product.slice(0, 8);

  // Function to create slug from product name
  const createSlug = (name) => {
    return unidecode(name)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  // Function to handle click and navigate to product detail page
  const handleProductClick = (name) => {
    const slug = createSlug(name);
    navigate(`/product-detail/${slug}.html`);
  };

  return (
    <div>




      <div
        className="container-fluid p-0 py-5 position-relative overflow-hidden"
        style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
      >
        {/* Video nền khói nhẹ nhàng */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.06,
            zIndex: 1,
            filter: 'brightness(1) saturate(1.1)',
          }}
        >
          <source
            src="https://nhahangchayhuongsen.com/huong-sen-web.mp4"
            type="video/mp4"
          />
        </video>

        {/* Overlay mờ tối để tăng tương phản */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0)', // độ mờ nhẹ, bạn có thể điều chỉnh 0.1 -> 0.5
            zIndex: 1,
          }}

        ></div>

        {/* Nội dung chính */}
        <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000" style={{ zIndex: 2, position: 'relative' }}>
          <div className="carousel-inner">

            {/* Slide 1 */}
            <div className="carousel-item active">
              <div
                className="row align-items-center g-5 py-5"
                style={{ minHeight: '96vh' }}
              >
                <div className="col-lg-6 text-center text-lg-start">
                  <h1
                    className="text-white fw-bold mb-4 animate__animated animate__fadeInLeft"
                    style={{
                      fontSize: '2.4rem',
                      letterSpacing: '1px',
                      lineHeight: '1.3',
                      textAlign: 'center',
                    }}
                  >
                    NHỮNG MÓN ĂN NGON SẴN SÀNG PHỤC VỤ THỰC KHÁCH
                  </h1>

                  <p
                    className="text-white mb-3 animate__animated animate__fadeInLeft"
                    style={{ fontSize: '1.15rem', lineHeight: '1.6', textAlign: 'center' }}
                  >
                    Hành trình ẩm thực chay – Nơi hương vị thăng hoa, tâm hồn thư thái.
                  </p>

                  <p
                    className="text-white mb-3 animate__animated animate__fadeInLeft"
                    style={{ fontSize: '1.15rem', lineHeight: '1.6', textAlign: 'center' }}
                  >
                    Bước vào không gian của chúng tôi, bạn sẽ được dẫn dắt qua những cung
                    bậc tinh tế của ẩm thực chay Á Đông. Với thực đơn phong phú, kết hợp
                    truyền thống và sáng tạo hiện đại, chúng tôi mang đến trải nghiệm thanh
                    đạm nhưng đậm đà, gần gũi và đầy bất ngờ.
                  </p>

                  <p
                    className="text-white mb-4 animate__animated animate__fadeInLeft"
                    style={{ fontSize: '1.15rem', lineHeight: '1.6', textAlign: 'center' }}
                  >
                    Không chỉ là bữa ăn, mà là hành trình sống chậm – ăn lành, cảm nhận sự
                    an yên từ sâu bên trong.
                  </p>

                  <Link
                    to="/booking"
                    className="btn btn-outline-success fw-semibold px-5 py-3 animate__animated animate__fadeInLeft"
                    style={{
                      borderRadius: '30px',
                      fontSize: '1.15rem',
                      transition: 'all 0.3s ease',
                      color: '#28a745',
                      borderWidth: '2.5px',
                      display: 'block',      
                      width: 'fit-content',    
                      margin: '0 auto',        
                      boxShadow: '0 0 10px rgba(40, 167, 69, 0.5)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#28a745';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.boxShadow =
                        '0 0 14px rgba(40, 167, 69, 0.9)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#28a745';
                      e.currentTarget.style.boxShadow =
                        '0 0 10px rgba(40, 167, 69, 0.5)';
                    }}
                  >
                    Đặt bàn ngay
                  </Link>
                </div>

                <div className="col-lg-6 text-center text-lg-end position-relative overflow-visible p-0">
                  <img
                    src={ImageGallery.hero2}
                    alt="Hero 1"
                    className="img-fluid animated zoomIn"
                    style={{
                          width: '98%',
                          maxHeight: '1000px',
                          objectFit: 'cover',
                          transform: 'translateX(-2%)', // đẩy ảnh sang trái
                          transition: 'transform 0.3s ease',
                        }}
                  />
                </div>
              </div>
            </div>


            {/* Slide 2 */}
            <div className="carousel-item">
              <div className="row align-items-center g-5 py-5"
                style={{ minHeight: '96vh' }}
              >
                <div className="col-lg-6 text-center text-lg-start">
                  <h1
                    className="text-white fw-bold mb-4 animate__animated animate__fadeInLeft"
                    style={{
                      fontSize: '2.4rem',
                      letterSpacing: '1px',
                      lineHeight: '1.3',
                      textAlign: 'center',
                    }}
                  >
                    VỀ CHÚNG TÔI & LIÊN HỆ
                  </h1>

                  <p
                    className="text-white mb-3 animate__animated animate__fadeInLeft"
                    style={{ fontSize: '1.15rem', lineHeight: '1.6', textAlign: 'center' }}
                  >
                    Chúng tôi là một nhà hàng chay tận tâm, mang đến những trải nghiệm ẩm thực tinh tế, thanh đạm nhưng đầy hương vị.
                  </p>

                  <p
                    className="text-white mb-3 animate__animated animate__fadeInLeft"
                    style={{ fontSize: '1.15rem', lineHeight: '1.6', textAlign: 'center' }}
                  >
                    Với thực đơn phong phú kết hợp giữa truyền thống và sáng tạo hiện đại, chúng tôi luôn nỗ lực phục vụ khách hàng tốt nhất.
                  </p>

                  <p
                    className="text-white mb-4 animate__animated animate__fadeInLeft"
                    style={{ fontSize: '1.15rem', lineHeight: '1.6', textAlign: 'center' }}
                  >
                    Nếu bạn có thắc mắc, góp ý hay muốn đặt bàn, hãy liên hệ với chúng tôi để được hỗ trợ nhanh chóng và chu đáo.
                  </p>

                  <div
  className="d-flex flex-column align-items-center gap-3 mt-4 animate__animated animate__fadeInLeft"
>
  {/* 2 NÚT PHÍA TRÊN */}
  <div className="d-flex justify-content-center gap-3">
    <Link
      to="/about"
      className="btn btn-outline-success fw-semibold px-4 py-3"
      style={{
        borderRadius: '30px',
        fontSize: '1.1rem',
        transition: 'all 0.3s ease',
        color: '#28a745',
        borderWidth: '2.5px',
        boxShadow: '0 0 10px rgba(40, 167, 69, 0.5)',
        minWidth: '150px',
        textAlign: 'center',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#28a745';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.boxShadow =
          '0 0 14px rgba(40, 167, 69, 0.9)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#28a745';
        e.currentTarget.style.boxShadow =
          '0 0 10px rgba(40, 167, 69, 0.5)';
      }}
    >
      Về Chúng Tôi
    </Link>

    <Link
      to="/contact"
      className="btn btn-outline-success fw-semibold px-4 py-3"
      style={{
        borderRadius: '30px',
        fontSize: '1.1rem',
        transition: 'all 0.3s ease',
        color: '#28a745',
        borderWidth: '2.5px',
        boxShadow: '0 0 10px rgba(40, 167, 69, 0.5)',
        minWidth: '150px',
        textAlign: 'center',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#28a745';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.boxShadow =
          '0 0 14px rgba(40, 167, 69, 0.9)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#28a745';
        e.currentTarget.style.boxShadow =
          '0 0 10px rgba(40, 167, 69, 0.5)';
      }}
    >
      Liên Hệ
    </Link>
  </div>

  {/* NÚT PHÍA DƯỚI */}
  <Link
    to="/danhgia"
    className="btn btn-outline-success fw-semibold px-5 py-3"
    style={{
      borderRadius: '30px',
      fontSize: '1.1rem',
      transition: 'all 0.3s ease',
      color: '#28a745',
      borderWidth: '2.5px',
      boxShadow: '0 0 10px rgba(40, 167, 69, 0.5)',
      minWidth: '200px',
      textAlign: 'center',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.backgroundColor = '#28a745';
      e.currentTarget.style.color = '#fff';
      e.currentTarget.style.boxShadow =
        '0 0 14px rgba(40, 167, 69, 0.9)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = '#28a745';
      e.currentTarget.style.boxShadow =
        '0 0 10px rgba(40, 167, 69, 0.5)';
    }}
  >
    Đánh Giá Nhà Hàng
  </Link>
</div>

                  

                </div>
                <div className="col-lg-6 text-center text-lg-end">
<img
                    src={ImageGallery.hero1}
                    alt="Hero 2"
                    className="img-fluid animated zoomIn"
                    style={{
                          width: '110%',
                          marginTop: '-40px',
                          maxHeight: '1000px',
                          objectFit: 'cover',
                          transform: 'translateX(-2%)', // đẩy ảnh sang trái
                          transition: 'transform 0.3s ease',
                        }}
                  />                
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="carousel-item">
              <div className="row align-items-center g-5 py-5"
                style={{ minHeight: '96vh' }}
              >
                <div className="col-lg-6 text-center text-lg-start">
                  <h1
                    className="text-white fw-bold mb-4 animate__animated animate__fadeInLeft"
                    style={{
                      fontSize: '2.4rem',
                      letterSpacing: '1px',
                      lineHeight: '1.3',
                      textAlign: 'center',
                    }}
                  >
                    CHÍNH SÁCH HOẠT ĐỘNG & <br></br> HƯỚNG DẪN ĐẶT BÀN 
                  </h1>

                  <p
                    className="text-white mb-3 animate__animated animate__fadeInLeft"
                    style={{ fontSize: '1.15rem', lineHeight: '1.6', textAlign: 'center' }}
                  >
                    Chúng tôi mang đến quy trình đặt bàn <strong>nhanh chóng</strong>, <strong>minh bạch</strong> và <strong>thuận tiện</strong> cho mọi khách hàng.
                  </p>

                  <p
                    className="text-white mb-3 animate__animated animate__fadeInLeft"
                    style={{ fontSize: '1.15rem', lineHeight: '1.6', textAlign: 'center' }}
                  >
                    Tại đây, bạn sẽ tìm thấy thông tin về <strong>quy trình đặt bàn</strong>, <strong>chính sách cọc</strong> và <strong>thanh toán</strong>.
                  </p>

                  <p
                    className="text-white mb-4 animate__animated animate__fadeInLeft"
                    style={{ fontSize: '1.15rem', lineHeight: '1.6', textAlign: 'center' }}
                  >
                    Vui lòng xem kỹ để nắm rõ các bước thực hiện và <strong>quyền lợi của bạn</strong> khi sử dụng dịch vụ.
                  </p>

                  <Link
                    to="/policy"
                    className="btn btn-outline-success fw-semibold px-5 py-3 animate__animated animate__fadeInLeft"
                    style={{
                      borderRadius: '30px',
                      fontSize: '1.15rem',
                      transition: 'all 0.3s ease',
                      color: '#28a745',
                      borderWidth: '2.5px',
                      display: 'block',      
                      width: 'fit-content',    
                      margin: '0 auto',        
                      boxShadow: '0 0 10px rgba(40, 167, 69, 0.5)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#28a745';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.boxShadow =
                        '0 0 14px rgba(40, 167, 69, 0.9)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#28a745';
                      e.currentTarget.style.boxShadow =
                        '0 0 10px rgba(40, 167, 69, 0.5)';
                    }}
                  >
                    Chính Sách Hoạt Động
                  </Link>
                </div>
                <div className="col-lg-6 text-center text-lg-end">
                  <img
                    src={ImageGallery.hero3}
                    alt="Hero 3"
                    className="img-fluid animated zoomIn"
                    style={{
                          width: '90%',
                          marginTop: '-40px',
                          maxHeight: '1000px',
                          objectFit: 'cover',
                          transform: 'translateX(-2%)', // đẩy ảnh sang trái
                          transition: 'transform 0.3s ease',
                        }}
                  />                
                </div>
              </div>
            </div>

          </div>

          {/* Controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        
      </div>








      {/* <div className="hero-clean position-relative text-white d-flex align-items-center justify-content-center" style={{
  height: '100vh',
  backgroundColor: '#121920',
  overflow: 'hidden',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}}>


  <video autoPlay muted loop playsInline className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" style={{ opacity: 0.05 }}>
    <source src="https://nhahangchayhuongsen.com/huong-sen-web.mp4" type="video/mp4" />
  </video>


  <div className="position-absolute top-50 start-50 translate-middle" style={{
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, #70a1ff44 0%, #cce4ff33 60%, transparent 100%)',
    animation: 'spinAura 20s linear infinite',
    zIndex: 1,
    filter: 'blur(30px)',
  }}></div>

 
  <div className="position-absolute top-0 start-0 w-100 h-100" style={{
    background: 'linear-gradient(120deg, transparent 60%, rgba(112,161,255,0.1) 100%)',
    zIndex: 0,
    animation: 'lightSweep 15s ease-in-out infinite alternate'
  }}></div>


  <div className="position-relative z-3 text-center px-3">
    <img
      src="/Assets/Client/Images/hero2.png"
      alt="Ẩm thực linh thiêng"
      className="img-fluid rounded-circle shadow-lg"
      style={{
        width: '360px',
        animation: 'slow-rotate 30s infinite linear',
        filter: 'drop-shadow(0 0 40px #70a1ff)'
      }}
    />


    <h1 className="display-4 fw-bold text-uppercase mt-5 mb-3" style={{
      fontFamily: 'Cinzel, serif',
      color: '#e1e8ff',
      letterSpacing: '2px'
    }}>
      NGHỆ THUẬT
    </h1>
    <h1 className="display-4 fw-bold text-uppercase" style={{
      fontFamily: 'Cinzel, serif',
      color: '#70a1ff',
      letterSpacing: '2px'
    }}>
      ẨM THỰC LINH THIÊNG
    </h1>

    <p className="fs-5 mt-3" style={{
      maxWidth: '600px',
      margin: '0 auto',
      color: '#cfd8ff',
      textShadow: '0 0 10px rgba(0,0,0,0.3)'
    }}>
      Khi ẩm thực không chỉ để ăn – mà để cảm, để chữa lành và kết nối với bản thể sâu nhất bên trong bạn.
    </p>

    <Link to="/booking" className="btn btn-outline-primary mt-4 px-5 py-3 rounded-pill fw-bold" style={{borderWidth: '2px'}}>
      Trải nghiệm nghi lễ vị giác
    </Link>
  </div>
</div> */}















      {/* <div className="container-fluid p-0 py-5 bg-light hero-header mb-5" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
  <div className="container my-5 py-5">
    <div className="row align-items-center g-5">


      <div className="col-lg-6 text-center text-lg-start">
        <h1 className="display-4 fw-bold text-dark mb-4" style={{ letterSpacing: '2px' }}>
          Khám Phá Ẩm Thực Chay Đỉnh Cao
        </h1>
        <p className="text-muted fs-5 mb-4" style={{ maxWidth: '500px' }}>
          Tinh hoa ẩm thực chay Á Đông hòa quyện cùng sự sáng tạo hiện đại. 
          Mỗi món ăn là câu chuyện của sự thanh đạm và đầy cảm xúc.
        </p>
        <Link
          to="/booking"
          className="btn btn-primary btn-lg px-5 py-3"
          style={{ borderRadius: '30px', boxShadow: '0 5px 15px rgba(0,123,255,0.4)' }}
        >
          Đặt bàn ngay
        </Link>
      </div>

 
      <div className="col-lg-6 text-center">
        <img
          src={ImageGallery.hero}
          alt="Ẩm thực chay"
          className="img-fluid rounded-4 shadow"
          style={{ maxHeight: '400px', objectFit: 'cover' }}
        />
      </div>
    </div>

    
    <div className="row text-center mt-5 g-4">
      <div className="col-md-4">
        <div className="p-4 border rounded-3 h-100">
          <img src="Assets/Client/Images/menu/trangmieng10.png"  style={{ width: '220px', height: 'auto' }} alt="Món Đậu Hũ Sốt Cà" className="img-fluid rounded mb-3" />
          <h5 className="fw-bold mb-2">Đậu Hũ Sốt Cà Chua</h5>
          <p className="text-muted small">
            Đậu hũ mềm hòa quyện sốt cà chua chua ngọt, món ăn truyền thống nhưng đầy sáng tạo.
          </p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-4 border rounded-3 h-100">
          <img src="Assets/Client/Images/menu/trangmieng9.png"  style={{ width: '220px', height: 'auto' }} alt="Bún Riêu Chay" className="img-fluid rounded mb-3" />
          <h5 className="fw-bold mb-2">Bún Riêu Chay</h5>
          <p className="text-muted small">
            Sợi bún tươi cùng nước dùng thanh ngọt, hương vị đặc trưng khiến ai cũng nhớ mãi.
          </p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-4 border rounded-3 h-100">
          <img src="Assets/Client/Images/menu/trangmieng8.png"  style={{ width: '220px', height: 'auto' }} alt="Cơm Chiên Chay" className="img-fluid rounded mb-3" />
          <h5 className="fw-bold mb-2">Cơm Chiên Chay</h5>
          <p className="text-muted small">
            Cơm chiên dẻo thơm, kết hợp rau củ tươi ngon, món ăn đơn giản mà đầy hấp dẫn.
          </p>
        </div>
      </div>
    </div>
  </div>
</div> */}



<div className="container-xxl py-5 bg-light">
  <div className="container">
    <div className="text-center mb-5">
      <h5 className="section-title text-primary fw-bold text-uppercase">Tại sao nên chọn chúng tôi ???</h5>
      <h4 className="fw-bold">Khám phá các dịch vụ của chúng tôi - Mang đến cho bạn trải nghiệm hoàn hảo từ A đến Z</h4>
    </div>
    <div className="row g-4">
      {[
        {
          icon: "fa-utensils",
          title: "Đầu bếp hàng đầu",
          desc: "Đội ngũ đầu bếp của chúng tôi là những chuyên gia giàu kinh nghiệm, mang đến những món ăn độc đáo và hấp dẫn.",
          image: "/Assets/Client/Images/team-5.jpg",
        },
        {
          icon: "fa-leaf",
          title: "Nguyên liệu sạch - chất lượng",
          desc: "Chúng tôi cam kết sử dụng nguyên liệu hưu cơ - tươi ngon nhất để đảm bảo mỗi món ăn đều đạt chuẩn chất lượng cao nhất.",
          image: "/Assets/Client/Images/team-6.jpg",
        },
        {
          icon: "fa-calendar-check",
          title: "Đặt bàn trực tuyến",
          desc: "Đặt bàn online nhanh chóng, tiện lợi, được giữ chỗ trước không cần chờ đợi.",
          image: "/Assets/Client/Images/team-7.jpg",
        },
        {
          icon: "fa-headset",
          title: "Hỗ trợ tận tâm",
          desc: "Dịch vụ CSKH 24/7 – luôn lắng nghe và phục vụ bạn tốt nhất ở mọi lúc, mọi nơi.",
          image: "/Assets/Client/Images/team-8.jpg",
        },
        {
          icon: "fa-shield-alt",
          title: "An toàn & Bảo mật",
          desc: "Chúng tôi cam kết cung cấp các dịch vụ an toàn và bảo mật, đảm bảo thông tin cá nhân của bạn được bảo vệ tốt nhất.",
          image: "/Assets/Client/Images/team-9.jpg",
        },
        {
          icon: "fa-truck",
          title: "Giao hàng chuẩn giờ",
          desc: "Dịch vụ giao hàng của chúng tôi đảm bảo rằng bạn nhận được sản phẩm của mình một cách nhanh chóng và đúng thời gian.",
          image: "/Assets/Client/Images/team-10.jpg",
        },
      ].map((item, idx) => (
        <div className="col-lg-4 col-md-6" key={idx}>
          <div className="service-card">
            <div className="service-img" style={{ backgroundImage: `url(${item.image})` }}>
              <div className="icon-badge">
                <i className={`fa ${item.icon}`}></i>
              </div>
            </div>
            <div className="service-content p-4">
              <h5 className="fw-bold mb-2">{item.title}</h5>
              <p className="text-muted">{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  <style>{`
    .service-card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .service-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 18px 45px rgba(0,0,0,0.12);
    }

    .service-img {
      height: 200px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .icon-badge {
      position: absolute;
      bottom: -24px;
      left: 20px;
      background-color: #ffffff;
      border-radius: 50%;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      font-size: 1.5rem;
      color:rgb(21, 132, 250);
      z-index: 2;
    }

    .service-content {
      padding-top: 40px;
    }

    .service-content h5 {
      color:rgb(2, 26, 159);
    }

    @media (max-width: 768px) {
      .service-img {
        height: 160px;
      }
    }
  `}</style>
</div>





      <div className="container-xxl py-5" style={{ backgroundColor: "#f4fbf6" }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-5" style={{ color: "#155e34", fontFamily: "'Times New Roman', sans-serif" }}>
            Ưu Đãi Đặc Biệt Với Mã Giảm Giá
          </h2>

          <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;900&display=swap');

      .discount-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 24px;
      }

      .discount-card {
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 8px 30px rgba(39, 174, 96, 0.15);
        padding: 20px 25px;
        width: 220px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: default;
        user-select: none;
      }

      .discount-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 50px rgba(12, 186, 20, 0.42);
      }

      .discount-icon {
        font-size: 40px;
        color: #155e34;
        margin-bottom: 12px;
      }

      .discount-code {
        font-family: 'Poppins', sans-serif;
        font-weight: 900;
        font-size: 1.1rem;
        color: #155e34;
        padding-bottom: 8px;
        border-bottom: 2px solid #27ae60;
        letter-spacing: 4px;
        margin-bottom: 16px;
        user-select: all;
        width: 100%;
        text-align: center;
      }

      .discount-percent {
        font-size: 3rem;
        font-weight: 900;
        color: #2ece9b;
        margin-bottom: 10px;
      }

      .discount-desc {
        font-size: 1rem;
        color: #6c757d;
        line-height: 1.5;
        font-style: italic;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .discount-row {
          justify-content: center;
        }
        .discount-card {
          width: 100%;
          max-width: 320px;
        }
      }
    `}</style>

          <div className="discount-row">
            {[
              { code: "FREEDRINK", percent: "Free", desc: "Tặng ngay 1 đồ uống miễn phí cho đơn hàng từ 500.000đ.", icon: "fa-coffee" },
              { code: "CHRISTMAS", percent: "15%", desc: "Giảm 15% dịp Giáng Sinh, dành cho tất cả khách hàng thân thiết.", icon: "fa-tree" },
              { code: "BIRTHDAY", percent: "20%", desc: "Tặng ngay 25% nhân dịp sinh nhật của bạn tại nhà hàng.", icon: "fa-birthday-cake" },
              { code: "CHAYDAY", percent: "25%", desc: "Ưu đãi đặc biệt 30% cho món chay trong ngày chay.", icon: "fa-leaf" },
              { code: "FAMILY", percent: "30%", desc: "Ưu đãi 20% cho nhóm gia đình từ 4 người trở lên.", icon: "fa-users" }
            ].map(({ code, percent, desc, icon }, i) => (
              <div className="discount-card" key={i}>
                <i className={`fas ${icon} discount-icon`}></i>
                <div className="discount-code">{code}</div>
                <div className="discount-percent">{percent}</div>
                <div className="discount-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>





      <div
        className="container-xxl py-5"
        style={{ backgroundColor: "#fdf6f9", fontFamily: "'Times New Roman', serif" }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "3rem",
            padding: "2rem 1rem",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {/* Left content */}
          <div style={{ flex: "1 1 500px", minWidth: "320px" }}>
            <h5
              style={{
                color: "#00c481",
                fontWeight: "600",
                fontFamily: "Times New Roman",
                fontWeight: 'bold',
                fontSize: "1.3rem",
                letterSpacing: "1px",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
              }}
            >
              Giới thiệu
            </h5>

            <h2
              style={{
                fontSize: "2.7rem",
                fontFamily: "Times New Roman",
                fontWeight: "bold",
                color: "#3a3a3a",
                marginBottom: "1rem",
              }}
            >
              Chào mừng đến với
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img
                src="../../Assets/Client/Images/huong-sen-logo.png"
                alt="Hương Sen Logo"
                style={{ width: "60px", borderRadius: "8px" }}
              />
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontFamily: "Times New Roman",
                  fontWeight: 'bold',
                  color: "#d6007d",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                Hương Sen – Tịnh Chay Cho Mọi Hành Trình Tâm Thức
              </h3>
            </div>

            <p
              style={{
                marginTop: "1.5rem",
                color: "#444",
                lineHeight: "1.7",
                fontSize: "1.05rem",
              }}
            >
              Nhà hàng chay Hương Sen mang đến trải nghiệm ẩm thực chay đậm đà bản sắc
              Việt. Với hơn 5 năm kinh nghiệm, chúng tôi không ngừng sáng tạo để mang
              đến những món ăn tinh tế, chất lượng và đầy cảm hứng.
            </p>

            <p
              style={{
                color: "#444",
                lineHeight: "1.7",
                fontSize: "1.05rem",
              }}
            >
              Không gian ấm cúng cùng đội ngũ đầu bếp tài hoa sẽ khiến bạn cảm nhận
              được sự gần gũi như ở nhà. Hãy để Hương Sen đồng hành cùng bạn trên hành
              trình khám phá ẩm thực chay đích thực.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                marginTop: "2rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f8d9e3",
                  padding: "1rem 1.5rem",
                  borderRadius: "12px",
                  textAlign: "center",
                  flex: "1 1 150px",
                }}
              >
                <h2 style={{ margin: 0, fontFamily: "Times New Roman", color: "#d6007e" }}>{">"}5</h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.2rem",
                    fontFamily: "Times New Roman",
                    fontWeight: "600",
                    color: "#d6007e",
                  }}
                >
                  Năm Kinh Nghiệm
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "#f8d9e3",
                  padding: "1rem 1.5rem",
                  borderRadius: "12px",
                  textAlign: "center",
                  flex: "1 1 150px",
                }}
              >
                <h2 style={{ margin: 0, fontFamily: "Times New Roman", color: "#d6007e" }}>{">"}10</h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    fontFamily: "Times New Roman",
                    color: "#d6007e",
                  }}
                >
                  Đầu Bếp Tài Năng
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                marginTop: "3rem",
                flexWrap: "wrap", // mobile sẽ tự xuống hàng
              }}
            >
              <Link
                to="/about"
                className="btn fw-semibold animate__animated animate__fadeInLeft"
                style={{
                  padding: "0.75rem 2rem",
                  borderRadius: "30px",
                  fontSize: "1.125rem",
                  transition: "all 0.3s ease",
                  color: "#e05284",
                  border: "2.5px solid #e05284",
                  backgroundColor: "transparent",
                  boxShadow: "0 0 8px rgba(224, 82, 132, 0.6)",
                  fontWeight: "600",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e05284";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.boxShadow =
                    "0 0 12px rgba(224, 82, 132, 0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#e05284";
                  e.currentTarget.style.boxShadow =
                    "0 0 8px rgba(224, 82, 132, 0.6)";
                }}
              >
                Xem thêm tại đây
              </Link>

            <Link
              to="/danhgia"
              className="btn fw-semibold"
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "30px",
                fontSize: "1.125rem",
                transition: "all 0.3s ease",
                color: "#1f7a6b",            // xanh ngọc trầm
                border: "2.5px solid #1f7a6b",
                backgroundColor: "transparent",
                boxShadow: "0 0 8px rgba(31, 122, 107, 0.5)",
                fontWeight: "600",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1f7a6b";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.boxShadow =
                  "0 0 14px rgba(31, 122, 107, 0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#1f7a6b";
                e.currentTarget.style.boxShadow =
                  "0 0 8px rgba(31, 122, 107, 0.5)";
              }}
            >
              Đánh Giá Nhà Hàng
            </Link>

            </div>


          </div>

          {/* Right image */}
          <div style={{ flex: "1 1 400px", minWidth: "320px" }}>
            <img
              src={ImageGallery.about1}
              alt="Hương Sen Restaurant"
              style={{
                width: "100%",
                borderRadius: "20px",
                boxShadow: "0 12px 24px rgba(185, 78, 114, 0.3)",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>





      {/* <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">
              Nhà Hàng Hương Sen
            </h5>
            <h1 className="mb-5">Món ăn mới</h1>
          </div>
          <div
            className="tab-class text-center wow fadeInUp"
            data-wow-delay="0.1s"
          >
            <div className="tab-content">
              <div id="tab-1" className="tab-pane fade show p-0 active">
                <div className="row" style={{ rowGap: "20px" }}>
                  {products.map((product) => (
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
                              <span
                                className="text-primary"
                                style={{ fontSize: "1rem" }}
                              >
                                {formatPrice(
                                  product.price - product.sale_price
                                )}
                              </span>
                            </h5>
                            <div className="d-flex justify-content-end">
                              <span
                                className="text-secondary text-decoration-line-through"
                                style={{ fontSize: "0.85rem" }}
                              >
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-100 d-flex flex-column text-start ps-4">
                            <h5 className="d-flex justify-content-between border-bottom pb-2">
                              <span>{product.name}</span>
                              <span
                                className="text-primary"
                                style={{ fontSize: "1rem" }}
                              >
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
 */}




    </div>
  );
}

export default Home;
