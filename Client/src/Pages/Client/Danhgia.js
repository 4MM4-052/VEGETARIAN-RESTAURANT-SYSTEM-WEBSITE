import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const getAvatar = (name) => `https://i.pravatar.cc/40?u=${name}`;

export default function ReviewChatStyle() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [filterStar, setFilterStar] = useState(null);
  const [sender, setSender] = useState('');
  const [shouldScroll, setShouldScroll] = useState(false);
  const reviewEndRef = useRef(null);

  // =========================
  // STATS – TÍNH TỪ STATE
  // =========================
  const stats = React.useMemo(() => {
    const result = {
      total: reviews.length,
      1: { count: 0 },
      2: { count: 0 },
      3: { count: 0 },
      4: { count: 0 },
      5: { count: 0 }
    };

    reviews.forEach(r => {
      const star = r['Số sao'];
      if (result[star]) {
        result[star].count++;
      }
    });

    return result;
  }, [reviews]);


  // =========================
  // FILTER FRONTEND
  // =========================
  const filteredReviews = filterStar
    ? reviews.filter(r => r['Số sao'] === filterStar)
    : reviews;

  // =========================
  // SCROLL
  // =========================
  useEffect(() => {
    if (shouldScroll) {
      reviewEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldScroll(false);
    }
  }, [reviews, shouldScroll]);

useEffect(() => {
  axios.get('http://localhost:8000/reviews')
    .then(res => {
      setReviews(res.data);
    })
    .catch(err => {
      console.error("Load reviews failed", err);
    });
}, []);



  // =========================
  // SUBMIT REVIEW → ML API
  // =========================
  const handleSubmit = async () => {
  if (!sender.trim()) return alert("Vui lòng nhập tên!");
  if (!newReview.trim()) return alert("Vui lòng nhập review!");

  try {
    // 1️⃣ Predict sao (ML)
    const predictRes = await axios.post(
      'http://localhost:8000/predict',
      { review: newReview }
    );

    const star = predictRes.data.star;

    // 2️⃣ LƯU VÀO CSV (backend)
    await axios.post('http://localhost:8000/reviews', {
      sender: sender,
      content: newReview,
      star: star
    });

    // 3️⃣ LOAD LẠI REVIEW TỪ BACKEND
    const res = await axios.get('http://localhost:8000/reviews');
    setReviews(res.data);

    setSender('');
    setNewReview('');
    setShouldScroll(true);

  } catch (err) {
    console.error(err);
    alert("Không kết nối được backend!");
  }
};




  const renderStars = (num) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{
        color: i < num ? '#fbbf24' : '#e5e7eb',
        marginRight: '2px',
        fontSize: '16px',
        textShadow: i < num ? '0 0 8px rgba(251, 191, 36, 0.4)' : 'none',
        transition: 'all 0.2s ease'
      }}>★</span>
    ));
  };

  // Stats bar component
  const StatsBar = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      padding: '16px 24px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      marginBottom: '24px'
    }}>
      {[5, 4, 3, 2, 1].map(star => (
        <div key={star} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          background: filterStar === star ? '#3b82f6' : '#ffffff',
          borderRadius: '24px',
          border: `1px solid ${filterStar === star ? '#3b82f6' : '#e2e8f0'}`,
          boxShadow: filterStar === star ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.04)',
          cursor: 'pointer',
          transition: 'all 0.25s ease'
        }}
        onClick={() => {
          const newFilter = star === filterStar ? null : star;
          setFilterStar(newFilter);
          // fetchReviews(newFilter);
        }}
        onMouseEnter={(e) => {
          if (filterStar !== star) {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (filterStar !== star) {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
        >
          <span style={{
            fontWeight: '700',
            color: filterStar === star ? '#ffffff' : '#64748b',
            fontSize: '14px'
          }}>{star}★</span>
          <span style={{
            fontWeight: '600',
            color: filterStar === star ? 'rgba(255,255,255,0.9)' : '#94a3b8',
            fontSize: '13px',
            background: filterStar === star ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>{stats[star]?.count || 0}</span>
        </div>
      ))}
      {(filterStar !== null) && (
        <button
          onClick={() => {
            setFilterStar(null);
            // fetchReviews();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: '#ef4444',
            borderRadius: '24px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
          }}
        >
          <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '13px' }}>✕ Bỏ lọc</span>
        </button>
      )}
    </div>
  );

  // const today = new Date().toLocaleDateString('vi-VN'); // VD: 05/02/2026

  // const reviewTodayCount = reviews.filter(r => {
  //   if (!r['Ngày review']) return false;

  //   // "05/02/2026 02:38:47" → "05/02/2026"
  //   const reviewDate = r['Ngày review'].split(' ')[0];

  //   return reviewDate === today;
  // }).length;



  return (
    <>
      {/* ===== HEADER ===== */}
      <div style={{
        position: 'relative',
        height: '320px',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
        marginBottom: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <div style={{
          position: 'relative',
          textAlign: 'center',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '20px'
          }}>
            <span style={{ color: '#fbbf24', fontSize: '18px' }}>★★★★★</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>Thực khách đánh giá</span>
          </div>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            color: '#ffffff',
            margin: '0 0 12px 0',
            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
            letterSpacing: '-0.5px'
          }}>
            Đánh giá Nhà hàng
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '16px',
            margin: 0,
            fontWeight: '400'
          }}>
            Chia sẻ trải nghiệm của bạn với chúng tôi
          </p>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        minHeight: '100vh',
        padding: '40px 20px 60px 20px',
        marginTop: '-40px',
        borderRadius: '40px 40px 0 0',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* ===== THỐNG KÊ TỔNG QUAN ===== */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
            padding: '24px 32px',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid rgba(226, 232, 240, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '80px',
                height: '64px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
              }}>
                <span style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700' }}>
                  {Math.round(((stats[5]?.count || 0) * 5 + (stats[4]?.count || 0) * 4 + (stats[3]?.count || 0) * 3 + (stats[2]?.count || 0) * 2 + (stats[1]?.count || 0) * 1) / (stats.total || 1) * 10) / 10 || 0} ★
                </span>
              </div>
            {/* <div>
                <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Review hôm nay
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>
                    {reviewTodayCount}

                    </span>
                    <span style={{ color: '#3b82f6', fontSize: '16px' }}>🕒</span>
                </div>
            </div> */}

            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              paddingLeft: '24px',
              borderLeft: '2px solid #e2e8f0'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#3b82f6' }}>{stats.total || 0}</div>
                <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Tổng đánh giá</div>
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* ===== BỘ LỌC SAO ===== */}
          <StatsBar />

          {/* ===== NỘI DUNG CHÍNH ===== */}
          <div style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04)',
            padding: '32px',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            {/* TIÊU ĐỀ PHỤ */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '28px',
              paddingBottom: '20px',
              borderBottom: '2px solid #f1f5f9'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
                  Danh sách đánh giá
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>
                  {filteredReviews.length} đánh giá {filterStar ? `(${filterStar} sao)` : ''}
                </p>
              </div>
            </div>

            {/* DANH SÁCH REVIEW */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxHeight: '580px',
              overflowY: 'auto',
              padding: '8px',
              marginBottom: '28px'
            }}
            onScroll={(e) => {
              const shadowTop = e.target.scrollTop > 0 ? 'inset 0 2px 6px rgba(0,0,0,0.08)' : 'none';
              const shadowBottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight > 10 ? 'inset 0 -2px 6px rgba(0,0,0,0.08)' : 'none';
              e.target.style.boxShadow = `${shadowTop}, ${shadowBottom}`;
            }}
            >
              <style>{`
                div::-webkit-scrollbar {
                  width: 8px;
                }
                div::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 10px;
                }
                div::-webkit-scrollbar-thumb {
                  background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
                  border-radius: 10px;
                }
                div::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
                }
              `}</style>

              {filteredReviews.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 30px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '20px',
                  border: '2px dashed #cbd5e1'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#e2e8f0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px 0',
                    fontSize: '36px'
                  }}>
                    💬
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '18px', fontWeight: '600' }}>
                    Chưa có đánh giá nào
                  </h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
                    Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!
                  </p>
                </div>
              )}

              {filteredReviews.map((r, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  width: '100%',
                  padding: '20px',
                  background: '#f8fafc',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={getAvatar(r['Người gửi'])}
                      alt="avatar"
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '16px',
                        border: '3px solid #ffffff',
                        objectFit: 'cover',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      width: '20px',
                      height: '20px',
                      background: '#10b981',
                      borderRadius: '50%',
                      border: '3px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffffff">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '10px',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <div>
                        <span style={{
                          fontWeight: '700',
                          color: '#1e293b',
                          fontSize: '16px',
                          display: 'block',
                          marginBottom: '4px'
                        }}>
                          {r['Người gửi']}
                        </span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {renderStars(r['Số sao'])}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: '#f1f5f9',
                        borderRadius: '20px'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>
                          {r['Ngày review']}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '15px',
                      color: '#475569',
                      lineHeight: '1.7',
                      whiteSpace: 'pre-wrap',
                      background: '#ffffff',
                      padding: '16px 18px',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      marginTop: '10px'
                    }}>
                      {r['Nội dung review']}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={reviewEndRef} />
            </div>

            {/* FORM GỬI REVIEW */}
            <div style={{
              padding: '28px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '20px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.3)'
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                    Viết đánh giá của bạn
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
                    Chia sẻ trải nghiệm của bạn với chúng tôi
                  </p>
                </div>
              </div>
            <div style={{ marginBottom: '14px' }}>
            <input
                type="text"
                value={sender}
                onChange={e => setSender(e.target.value)}
                placeholder="Tên của bạn *"
                style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '14px',
                border: '2px solid #e2e8f0',
                fontSize: '15px',
                fontWeight: '500'
                }}
            />
            </div>

              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <textarea
                  value={newReview}
                  onChange={e => setNewReview(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0',
                    fontSize: '15px',
                    resize: 'none',
                    backgroundColor: '#ffffff',
                    fontFamily: 'inherit',
                    color: '#1e293b',
                    fontWeight: '500',
                    lineHeight: '1.6',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Hãy chia sẻ trải nghiệm của bạn về chất lượng dịch vụ, không gian và món ăn tại nhà hàng..."
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '14px',
                  right: '16px',
                  fontSize: '13px',
                  color: newReview.length > 500 ? '#ef4444' : '#94a3b8',
                  fontWeight: '600',
                  background: newReview.length > 500 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.9)',
                  padding: '4px 10px',
                  borderRadius: '8px'
                }}>
                  {newReview.length}/500
                </div>
              </div>

              <button
                onClick={handleSubmit}
                style={{
                  width: '100%',
                  padding: '16px 28px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(59, 130, 246, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.35)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Gửi đánh giá
              </button>
            </div>

          </div>

          {/* ===== FOOTER ===== */}
          <div style={{
            textAlign: 'center',
            marginTop: '32px',
            padding: '20px',
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            <p style={{ margin: 0 }}>
              Cảm ơn bạn đã chia sẻ! • Đánh giá của bạn giúp chúng tôi cải thiện chất lượng dịch vụ
            </p>
          </div>

        </div>
      </div>
    </>
  );
}


























// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function AdminReviewStats() {
//   const [stats, setStats] = useState({ total: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
//   const [isLoading, setIsLoading] = useState(true);
//   const [animatedValues, setAnimatedValues] = useState({
//     average: 0,
//     total: 0,
//     counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
//   });

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/stats')
//       .then(res => {
//         setStats(res.data);
//         setIsLoading(false);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   const calculateAverage = () => {
//     let totalStars = 0;
//     let totalReviews = 0;
//     [5, 4, 3, 2, 1].forEach(star => {
//       const count = stats[star]?.count || 0;
//       totalStars += star * count;
//       totalReviews += count;
//     });
//     return totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : '0.0';
//   };

//   const getRatingDistribution = () => {
//     const total = stats.total || 1;
//     return [5, 4, 3, 2, 1].map(star => ({
//       star,
//       count: stats[star]?.count || 0,
//       percent: ((stats[star]?.count || 0) / total) * 100
//     }));
//   };

//   const getRatingLabel = (avg) => {
//     const numAvg = parseFloat(avg);
//     if (numAvg >= 4.5) return 'Xuất sắc';
//     if (numAvg >= 4.0) return 'Tuyệt vời';
//     if (numAvg >= 3.5) return 'Tốt';
//     if (numAvg >= 3.0) return 'Khá tốt';
//     if (numAvg >= 2.5) return 'Trung bình';
//     return 'Cần cải thiện';
//   };

//   const renderStars = (num, size = 18) => {
//     return [...Array(5)].map((_, i) => (
//       <span key={i} style={{
//         color: i < Math.floor(num) ? '#fbbf24' : i < num ? '#fbbf24' : '#e2e8f0',
//         marginRight: '2px',
//         fontSize: `${size}px`,
//         textShadow: i < Math.floor(num) ? '0 0 12px rgba(251, 191, 36, 0.4)' : 'none',
//         transition: 'all 0.3s ease'
//       }}>★</span>
//     ));
//   };

//   const StarRatingInput = ({ rating, onRate, readonly = false }) => {
//     const [hover, setHover] = useState(0);
    
//     return (
//       <div style={{ display: 'flex', gap: '4px' }}>
//         {[1, 2, 3, 4, 5].map((star) => (
//           <span
//             key={star}
//             onClick={() => !readonly && onRate?.(star)}
//             onMouseEnter={() => !readonly && setHover(star)}
//             onMouseLeave={() => !readonly && setHover(0)}
//             style={{
//               color: (hover || rating) >= star ? '#fbbf24' : '#e2e8f0',
//               fontSize: '24px',
//               cursor: readonly ? 'default' : 'pointer',
//               textShadow: (hover || rating) >= star ? '0 0 12px rgba(251, 191, 36, 0.5)' : 'none',
//               transition: 'all 0.2s ease',
//               transform: (hover || rating) >= star ? 'scale(1.1)' : 'scale(1)'
//             }}
//           >
//             ★
//           </span>
//         ))}
//       </div>
//     );
//   };

//   const CircularProgress = ({ value, max, size = 120, strokeWidth = 10, color = '#3b82f6' }) => {
//     const radius = (size - strokeWidth) / 2;
//     const circumference = radius * 2 * Math.PI;
//     const offset = circumference - (value / max) * circumference;
//     const percentage = ((value / max) * 100).toFixed(0);

//     return (
//       <div style={{ position: 'relative', width: size, height: size }}>
//         <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             fill="none"
//             stroke="#e2e8f0"
//             strokeWidth={strokeWidth}
//           />
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             fill="none"
//             stroke={color}
//             strokeWidth={strokeWidth}
//             strokeDasharray={circumference}
//             strokeDashoffset={offset}
//             strokeLinecap="round"
//             style={{
//               transition: 'stroke-dashoffset 1s ease-out'
//             }}
//           />
//         </svg>
//         <div style={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           textAlign: 'center'
//         }}>
//           <span style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>{percentage}%</span>
//         </div>
//       </div>
//     );
//   };

//   const distribution = getRatingDistribution();

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//       padding: '60px 20px',
//       fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
//     }}>
//       <div style={{
//         maxWidth: '1000px',
//         margin: '0 auto'
//       }}>
//         {/* ===== HEADER ===== */}
//         <div style={{
//           textAlign: 'center',
//           marginBottom: '40px'
//         }}>
//           <div style={{
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: '10px',
//             padding: '10px 24px',
//             background: 'rgba(59, 130, 246, 0.1)',
//             borderRadius: '30px',
//             marginBottom: '20px'
//           }}>
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M12 20V10" />
//               <path d="M18 20V4" />
//               <path d="M6 20v-4" />
//             </svg>
//             <span style={{ color: '#3b82f6', fontWeight: '600', fontSize: '14px' }}>
//               Thống kê đánh giá
//             </span>
//           </div>
//           <h1 style={{
//             fontSize: '36px',
//             fontWeight: '800',
//             color: '#1e293b',
//             margin: '0 0 12px 0',
//             letterSpacing: '-0.5px'
//           }}>
//             Tổng quan đánh giá khách hàng
//           </h1>
//           <p style={{
//             color: '#64748b',
//             fontSize: '16px',
//             margin: 0,
//             maxWidth: '500px',
//             marginLeft: 'auto',
//             marginRight: 'auto'
//           }}>
//             Theo dõi và phân tích phản hồi từ khách hàng để cải thiện chất lượng dịch vụ
//           </p>
//         </div>

//         {/* ===== MAIN STATS CARD ===== */}
//         <div style={{
//           background: '#ffffff',
//           borderRadius: '24px',
//           padding: '40px',
//           boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04)',
//           border: '1px solid rgba(226, 232, 240, 0.6)',
//           marginBottom: '32px'
//         }}>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
//             gap: '32px'
//           }}>
//             {/* Average Rating Section */}
//             <div style={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'center',
//               padding: '32px',
//               background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//               borderRadius: '20px',
//               border: '1px solid #e2e8f0'
//             }}>
//               <div style={{
//                 position: 'relative',
//                 marginBottom: '20px'
//               }}>
//                 <div style={{
//                   width: '140px',
//                   height: '140px',
//                   borderRadius: '50%',
//                   background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   boxShadow: '0 12px 32px rgba(59, 130, 246, 0.35)'
//                 }}>
//                   <div style={{
//                     textAlign: 'center',
//                     color: '#ffffff'
//                   }}>
//                     <span style={{
//                       fontSize: '42px',
//                       fontWeight: '800',
//                       display: 'block',
//                       lineHeight: 1
//                     }}>
//                       {isLoading ? '...' : calculateAverage()}
//                     </span>
//                     <span style={{
//                       fontSize: '14px',
//                       opacity: 0.9,
//                       fontWeight: '500'
//                     }}>
//                       / 5.0
//                     </span>
//                   </div>
//                 </div>
//               </div>
              
//               <div style={{ marginBottom: '12px' }}>
//                 {renderStars(parseFloat(calculateAverage()), 22)}
//               </div>
              
//               <div style={{
//                 padding: '8px 20px',
//                 background: parseFloat(calculateAverage()) >= 4.0 ? 'rgba(16, 185, 129, 0.1)' : parseFloat(calculateAverage()) >= 3.0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(239, 68, 68, 0.1)',
//                 borderRadius: '20px',
//                 marginBottom: '12px'
//               }}>
//                 <span style={{
//                   fontWeight: '700',
//                   fontSize: '14px',
//                   color: parseFloat(calculateAverage()) >= 4.0 ? '#059669' : parseFloat(calculateAverage()) >= 3.0 ? '#d97706' : '#dc2626'
//                 }}>
//                   {getRatingLabel(calculateAverage())}
//                 </span>
//               </div>
              
//               <span style={{ color: '#64748b', fontSize: '14px' }}>
//                 Dựa trên {stats.total || 0} đánh giá
//               </span>
//             </div>

//             {/* Rating Distribution */}
//             <div style={{
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center'
//             }}>
//               <h3 style={{
//                 fontSize: '18px',
//                 fontWeight: '700',
//                 color: '#1e293b',
//                 marginBottom: '24px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px'
//               }}>
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
//                   <path d="M22 12A10 10 0 0 0 12 2v10z" />
//                 </svg>
//                 Phân bố đánh giá
//               </h3>
              
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                 {distribution.map(({ star, count, percent }) => (
//                   <div key={star} style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '12px'
//                   }}>
//                     <span style={{
//                       width: '24px',
//                       fontWeight: '600',
//                       color: '#64748b',
//                       fontSize: '14px',
//                       textAlign: 'right'
//                     }}>
//                       {star}★
//                     </span>
//                     <div style={{
//                       flex: 1,
//                       height: '10px',
//                       background: '#f1f5f9',
//                       borderRadius: '8px',
//                       overflow: 'hidden',
//                       position: 'relative'
//                     }}>
//                       <div style={{
//                         width: `${percent}%`,
//                         height: '100%',
//                         background: star >= 4 ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : star >= 3 ? 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)' : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
//                         borderRadius: '8px',
//                         transition: 'width 1s ease-out',
//                         boxShadow: star >= 4 ? '0 2px 8px rgba(16, 185, 129, 0.3)' : star >= 3 ? '0 2px 8px rgba(251, 191, 36, 0.3)' : '0 2px 8px rgba(239, 68, 68, 0.3)'
//                       }} />
//                     </div>
//                     <span style={{
//                       width: '50px',
//                       textAlign: 'right',
//                       fontWeight: '600',
//                       color: '#1e293b',
//                       fontSize: '14px'
//                     }}>
//                       {count}
//                     </span>
//                     <span style={{
//                       width: '45px',
//                       textAlign: 'right',
//                       fontSize: '13px',
//                       color: '#94a3b8',
//                       fontWeight: '500'
//                     }}>
//                       {percent.toFixed(0)}%
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ===== DETAILED STATS GRID ===== */}
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
//           gap: '20px',
//           marginBottom: '32px'
//         }}>
//           {[
//             { star: 5, icon: '🌟', label: 'Xuất sắc', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
//             { star: 4, icon: '👍', label: 'Tốt', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
//             { star: 3, icon: '🙂', label: 'Trung bình', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
//             { star: 2, icon: '😐', label: 'Kém', color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)' },
//             { star: 1, icon: '😞', label: 'Rất tệ', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }
//           ].map(({ star, icon, label, color, bgColor }) => (
//             <div key={star} style={{
//               background: '#ffffff',
//               borderRadius: '16px',
//               padding: '24px',
//               textAlign: 'center',
//               boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
//               border: '1px solid rgba(226, 232, 240, 0.6)',
//               transition: 'all 0.3s ease',
//               cursor: 'pointer'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'translateY(-4px)';
//               e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'translateY(0)';
//               e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
//             }}
//             >
//               <div style={{
//                 fontSize: '32px',
//                 marginBottom: '12px'
//               }}>
//                 {icon}
//               </div>
//               <div style={{
//                 fontSize: '32px',
//                 fontWeight: '800',
//                 color: color,
//                 marginBottom: '4px'
//               }}>
//                 {stats[star]?.count || 0}
//               </div>
//               <div style={{
//                 fontSize: '14px',
//                 color: '#64748b',
//                 fontWeight: '500',
//                 marginBottom: '8px'
//               }}>
//                 đánh giá
//               </div>
//               <div style={{
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 gap: '4px',
//                 padding: '4px 12px',
//                 background: bgColor,
//                 borderRadius: '12px'
//               }}>
//                 <span style={{ color: color, fontSize: '12px', fontWeight: '600' }}>{star}★</span>
//                 <span style={{ color: color, fontSize: '12px', fontWeight: '600' }}>{label}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ===== SATISFACTION METRICS ===== */}
//         <div style={{
//           background: '#ffffff',
//           borderRadius: '24px',
//           padding: '32px',
//           boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04)',
//           border: '1px solid rgba(226, 232, 240, 0.6)'
//         }}>
//           <h3 style={{
//             fontSize: '20px',
//             fontWeight: '700',
//             color: '#1e293b',
//             marginBottom: '28px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '10px'
//           }}>
//             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//               <polyline points="22 4 12 14.01 9 11.01" />
//             </svg>
//             Chỉ số hài lòng
//           </h3>

//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//             gap: '24px'
//           }}>
//             {/* Positive Reviews */}
//             <div style={{
//               padding: '24px',
//               background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)',
//               borderRadius: '16px',
//               border: '1px solid rgba(16, 185, 129, 0.2)'
//             }}>
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//                 marginBottom: '16px'
//               }}>
//                 <div style={{
//                   width: '44px',
//                   height: '44px',
//                   background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                   borderRadius: '12px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center'
//                 }}>
//                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
//                   </svg>
//                 </div>
//                 <div>
//                   <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Đánh giá tích cực</div>
//                   <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669' }}>
//                     {((stats[5]?.count || 0) + (stats[4]?.count || 0))}
//                   </div>
//                 </div>
//               </div>
//               <div style={{
//                 height: '8px',
//                 background: '#e2e8f0',
//                 borderRadius: '8px',
//                 overflow: 'hidden'
//               }}>
//                 <div style={{
//                   width: `${stats.total > 0 ? (((stats[5]?.count || 0) + (stats[4]?.count || 0)) / stats.total * 100) : 0}%`,
//                   height: '100%',
//                   background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
//                   borderRadius: '8px',
//                   transition: 'width 1s ease-out'
//                 }} />
//               </div>
//               <div style={{
//                 marginTop: '8px',
//                 fontSize: '13px',
//                 color: '#64748b',
//                 fontWeight: '500'
//               }}>
//                 {stats.total > 0 ? (((stats[5]?.count || 0) + (stats[4]?.count || 0)) / stats.total * 100).toFixed(1) : 0}% tổng số
//               </div>
//             </div>

//             {/* Neutral Reviews */}
//             <div style={{
//               padding: '24px',
//               background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(217, 119, 6, 0.04) 100%)',
//               borderRadius: '16px',
//               border: '1px solid rgba(251, 191, 36, 0.2)'
//             }}>
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//                 marginBottom: '16px'
//               }}>
//                 <div style={{
//                   width: '44px',
//                   height: '44px',
//                   background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
//                   borderRadius: '12px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center'
//                 }}>
//                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <circle cx="12" cy="12" r="10" />
//                     <line x1="12" y1="8" x2="12" y2="12" />
//                     <line x1="12" y1="16" x2="12.01" y2="16" />
//                   </svg>
//                 </div>
//                 <div>
//                   <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Đánh giá trung bình</div>
//                   <div style={{ fontSize: '24px', fontWeight: '800', color: '#d97706' }}>
//                     {stats[3]?.count || 0}
//                   </div>
//                 </div>
//               </div>
//               <div style={{
//                 height: '8px',
//                 background: '#e2e8f0',
//                 borderRadius: '8px',
//                 overflow: 'hidden'
//               }}>
//                 <div style={{
//                   width: `${stats.total > 0 ? ((stats[3]?.count || 0) / stats.total * 100) : 0}%`,
//                   height: '100%',
//                   background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
//                   borderRadius: '8px',
//                   transition: 'width 1s ease-out'
//                 }} />
//               </div>
//               <div style={{
//                 marginTop: '8px',
//                 fontSize: '13px',
//                 color: '#64748b',
//                 fontWeight: '500'
//               }}>
//                 {stats.total > 0 ? ((stats[3]?.count || 0) / stats.total * 100).toFixed(1) : 0}% tổng số
//               </div>
//             </div>

//             {/* Negative Reviews */}
//             <div style={{
//               padding: '24px',
//               background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.04) 100%)',
//               borderRadius: '16px',
//               border: '1px solid rgba(239, 68, 68, 0.2)'
//             }}>
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//                 marginBottom: '16px'
//               }}>
//                 <div style={{
//                   width: '44px',
//                   height: '44px',
//                   background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
//                   borderRadius: '12px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center'
//                 }}>
//                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
//                     <line x1="12" y1="9" x2="12" y2="13" />
//                     <line x1="12" y1="17" x2="12.01" y2="17" />
//                   </svg>
//                 </div>
//                 <div>
//                   <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Đánh giá tiêu cực</div>
//                   <div style={{ fontSize: '24px', fontWeight: '800', color: '#dc2626' }}>
//                     {((stats[2]?.count || 0) + (stats[1]?.count || 0))}
//                   </div>
//                 </div>
//               </div>
//               <div style={{
//                 height: '8px',
//                 background: '#e2e8f0',
//                 borderRadius: '8px',
//                 overflow: 'hidden'
//               }}>
//                 <div style={{
//                   width: `${stats.total > 0 ? (((stats[2]?.count || 0) + (stats[1]?.count || 0)) / stats.total * 100) : 0}%`,
//                   height: '100%',
//                   background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
//                   borderRadius: '8px',
//                   transition: 'width 1s ease-out'
//                 }} />
//               </div>
//               <div style={{
//                 marginTop: '8px',
//                 fontSize: '13px',
//                 color: '#64748b',
//                 fontWeight: '500'
//               }}>
//                 {stats.total > 0 ? (((stats[2]?.count || 0) + (stats[1]?.count || 0)) / stats.total * 100).toFixed(1) : 0}% tổng số
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ===== FOOTER ===== */}
//         <div style={{
//           textAlign: 'center',
//           marginTop: '40px',
//           padding: '24px',
//           color: '#94a3b8',
//           fontSize: '14px'
//         }}>
//           <p style={{ margin: 0 }}>
//             Dữ liệu được cập nhật tự động • Quản lý đánh giá khách hàng
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
