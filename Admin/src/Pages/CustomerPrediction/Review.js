import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Review() {
  const [stats, setStats] = useState({ total: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [isLoading, setIsLoading] = useState(true);



  const [suggestions, setSuggestions] = useState({});
  const [reviewList, setReviewList] = useState([]);
  const [openReview, setOpenReview] = useState(null);
  const [showReviewList, setShowReviewList] = useState(false);
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const [filterStar, setFilterStar] = useState(0);
  const filteredReviews =
  filterStar === 0
    ? reviewList
    : reviewList.filter(r => r.star === filterStar);

  const [loadingExplain, setLoadingExplain] = useState(null);
  const explainReview = async (review) => {
    if (review.has_explain) return;

    setLoadingExplain(review.id);   // 👈 THÊM DÒNG NÀY

    try {
      const res = await axios.post(
        "http://localhost:8000/admin/reviews/explain",
        {
          content: review.content,
          level1: modelConfig.level1,
          level2a: modelConfig.level2a,
          level2b: modelConfig.level2b
        }
      );

      const rawPhrases = res.data.phrases || [];

      setReviewList(prev =>
        prev.map(item =>
          item.id === review.id
            ? { ...item, phrases: rawPhrases, has_explain: true }
            : item
        )
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExplain(null);   // 👈 THÊM DÒNG NÀY
    }
  };

  const handleOtherAction = async (review) => {
    if (!review.phrases || review.phrases.length === 0) {
      alert("Vui lòng phân tích review trước");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:8000/admin/reviews/suggest",
        {
          phrases: review.phrases,
          star: review.star
        }
      );

      setSuggestions(prev => ({
        ...prev,
        [review.id]: res.data
      }));

    } catch (err) {
      console.error(err);
    }
  };



  const [animatedValues, setAnimatedValues] = useState({
    average: 0,
    total: 0,
    counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  // ===== MODEL STATE (MỚI) =====
  const [useModel, setUseModel] = useState(false);
  const [modelConfig, setModelConfig] = useState({
    level1: "SVM",
    level2a: "Logistic",
    level2b: "SVM"
  });
const stableModelConfig = JSON.stringify(modelConfig);
  // ===== LOAD STATS =====
  const loadStats = async () => {
  setIsLoading(true);
  try {
    let res;

    if (useModel) {
  res = await axios.post(
    "http://localhost:8000/admin/reviews/predict",
    modelConfig
  );
  setStats(res.data);

  // ❌ CHỈ load reviewList KHI CHƯA CÓ
  if (reviewList.length === 0) {
    const detailRes = await axios.post(
      "http://localhost:8000/admin/reviews/predict/detail",
      modelConfig
    );
    setReviewList(detailRes.data.reviews || []);
  }
}
else {
      // =====================
      // 🔹 LOGIC CŨ – GIỮ NGUYÊN
      // =====================
      res = await axios.get("http://localhost:8000/reviews");
      const reviews = res.data;

      const newStats = {
        total: reviews.length,
        5: { count: 0 },
        4: { count: 0 },
        3: { count: 0 },
        2: { count: 0 },
        1: { count: 0 }
      };

      reviews.forEach(r => {
        const star = Number(r["Số sao"]);
        if (newStats[star]) newStats[star].count++;
      });

      setStats(newStats);
      setReviewList([]); // ❗ không dùng model thì không show explain
    }

  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};


useEffect(() => {
  loadStats();
}, [useModel, stableModelConfig]);




  

  // ===== UTILS =====
  const calculateAverage = () => {
    let totalStars = 0;
    let totalReviews = 0;
    [5, 4, 3, 2, 1].forEach(star => {
      const count = stats[star]?.count || 0;
      totalStars += star * count;
      totalReviews += count;
    });
    return totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : '0.0';
  };

  const getRatingDistribution = () => {
    const total = stats.total || 1;
    return [5, 4, 3, 2, 1].map(star => ({
      star,
      count: stats[star]?.count || 0,
      percent: ((stats[star]?.count || 0) / total) * 100
    }));
  };

  const getRatingLabel = (avg) => {
    const numAvg = parseFloat(avg);
    if (numAvg >= 4.5) return 'Xuất sắc';
    if (numAvg >= 4.0) return 'Tuyệt vời';
    if (numAvg >= 3.5) return 'Tốt';
    if (numAvg >= 3.0) return 'Khá tốt';
    if (numAvg >= 2.5) return 'Trung bình';
    return 'Cần cải thiện';
  };

  const renderStars = (num, size = 18) =>
    [...Array(5)].map((_, i) => (
      <span key={i} style={{
        color: i < Math.floor(num) ? '#fbbf24' : '#e2e8f0',
        fontSize: size
      }}>★</span>
    ));

  const distribution = getRatingDistribution();

  return (

    
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '60px 20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
    
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* ===== HEADER ===== */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 24px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '30px',
            marginBottom: '20px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
            <span style={{ color: '#3b82f6', fontWeight: '600', fontSize: '14px' }}>
              Thống kê đánh giá
            </span>
          </div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#1e293b',
            margin: '0 0 12px 0',
            letterSpacing: '-0.5px'
          }}>
            Tổng quan đánh giá khách hàng
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '16px',
            margin: 0,
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Theo dõi và phân tích phản hồi từ khách hàng để cải thiện chất lượng dịch vụ
          </p>
        </div>

        {/* ===== MAIN STATS CARD ===== */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04)',
          border: '1px solid rgba(226, 232, 240, 0.6)',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {/* Average Rating Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '20px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                position: 'relative',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 12px 32px rgba(59, 130, 246, 0.35)'
                }}>
                  <div style={{
                    textAlign: 'center',
                    color: '#ffffff'
                  }}>
                    <span style={{
                      fontSize: '42px',
                      fontWeight: '800',
                      display: 'block',
                      lineHeight: 1
                    }}>
                      {isLoading ? '...' : calculateAverage()}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      opacity: 0.9,
                      fontWeight: '500'
                    }}>
                      / 5.0
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                {renderStars(parseFloat(calculateAverage()), 22)}
              </div>
              
              <div style={{
                padding: '8px 20px',
                background: parseFloat(calculateAverage()) >= 4.0 ? 'rgba(16, 185, 129, 0.1)' : parseFloat(calculateAverage()) >= 3.0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: '20px',
                marginBottom: '12px'
              }}>
                <span style={{
                  fontWeight: '700',
                  fontSize: '14px',
                  color: parseFloat(calculateAverage()) >= 4.0 ? '#059669' : parseFloat(calculateAverage()) >= 3.0 ? '#d97706' : '#dc2626'
                }}>
                  {getRatingLabel(calculateAverage())}
                </span>
              </div>
              
              <span style={{ color: '#64748b', fontSize: '14px' }}>
                Dựa trên {stats.total || 0} đánh giá
              </span>
            </div>
            

            {/* Rating Distribution */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
              
            }}>

              {/* ===== MODEL SELECT ===== */}
<div style={{
  padding: '16px 20px',
  background: '#ffffff',
  borderRadius: '14px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
}}>

  {/* Header */}
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
        Chế độ mô hình
      </div>
      <div style={{ fontSize: 12, color: '#64748b' }}>
        Phân tích theo từng mô hình học máy
      </div>
    </div>

    {/* Checkbox an toàn */}
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      fontWeight: 600,
      color: '#334155',
      cursor: 'pointer'
    }}>
      <input
        type="checkbox"
        checked={useModel}
        onChange={e => setUseModel(e.target.checked)}
      />
      Bật
    </label>
  </div>

  {/* Select models */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    opacity: useModel ? 1 : 0.45
  }}>
    {[
      { key: 'level1', label: 'Level 1' },
      { key: 'level2a', label: 'Level 2A' },
      { key: 'level2b', label: 'Level 2B' }
    ].map(({ key, label }) => (
      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>
          {label}
        </span>
        <select
          disabled={!useModel}
          value={modelConfig?.[key] || 'SVM'}
          onChange={e =>
            setModelConfig({ ...modelConfig, [key]: e.target.value })
          }
          style={{
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: 14,
            background: '#f8fafc'
          }}
        >
          <option>SVM</option>
          <option>RF</option>
          <option>Logistic</option>
        </select>
      </div>
    ))}
  </div>
</div>


              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
                Phân bố đánh giá
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {distribution.map(({ star, count, percent }) => (
                  <div key={star} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      width: '24px',
                      fontWeight: '600',
                      color: '#64748b',
                      fontSize: '14px',
                      textAlign: 'right'
                    }}>
                      {star}★
                    </span>
                    <div style={{
                      flex: 1,
                      height: '10px',
                      background: '#f1f5f9',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: star >= 4 ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : star >= 3 ? 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)' : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                        borderRadius: '8px',
                        transition: 'width 1s ease-out',
                        boxShadow: star >= 4 ? '0 2px 8px rgba(16, 185, 129, 0.3)' : star >= 3 ? '0 2px 8px rgba(251, 191, 36, 0.3)' : '0 2px 8px rgba(239, 68, 68, 0.3)'
                      }} />
                    </div>
                    <span style={{
                      width: '50px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#1e293b',
                      fontSize: '14px'
                    }}>
                      {count}
                    </span>
                    <span style={{
                      width: '45px',
                      textAlign: 'right',
                      fontSize: '13px',
                      color: '#94a3b8',
                      fontWeight: '500'
                    }}>
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== DETAILED STATS GRID ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {[
            { star: 5, icon: '🌟', label: 'Xuất sắc', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
            { star: 4, icon: '👍', label: 'Tốt', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
            { star: 3, icon: '🙂', label: 'Trung bình', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
            { star: 2, icon: '😐', label: 'Kém', color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)' },
            { star: 1, icon: '😞', label: 'Rất tệ', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }
          ].map(({ star, icon, label, color, bgColor }) => (
            <div key={star} style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid rgba(226, 232, 240, 0.6)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
            }}
            >
              <div style={{
                fontSize: '32px',
                marginBottom: '12px'
              }}>
                {icon}
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                color: color,
                marginBottom: '4px'
              }}>
                {stats[star]?.count || 0}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                đánh giá
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                background: bgColor,
                borderRadius: '12px'
              }}>
                <span style={{ color: color, fontSize: '12px', fontWeight: '600' }}>{star}★</span>
                <span style={{ color: color, fontSize: '12px', fontWeight: '600' }}>{label}</span>
              </div>
            </div>
          ))}
        </div>





{/* ===== REVIEW LIST CONTAINER ===== */}
{useModel && reviewList.length > 0 && (
  <div style={{ marginBottom: 32 }}>

    {/* ===== HEADER + FILTER ===== */}
    <div
      onClick={() => setShowReviewList(!showReviewList)}
      style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        cursor: 'pointer'
      }}
    >
      {/* TOP */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
            Danh sách đánh giá khách hàng
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Chi tiết đánh giá & keyword (AI)
          </div>
        </div>

        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#3b82f6'
        }}>
          {showReviewList ? 'Thu gọn ▲' : `Xem (${reviewList.length}) ▼`}
        </span>
      </div>

      {/* FILTER */}
      {showReviewList && (
        <div style={{
          display: 'flex',
          gap: 8,
          marginTop: 14,
          flexWrap: 'wrap'
        }}>
          {[0, 5, 4, 3, 2, 1].map(star => (
            <button
              key={star}
              onClick={(e) => {
                e.stopPropagation();
                setFilterStar(star);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid #e2e8f0',
                background: filterStar === star ? '#3b82f6' : '#f8fafc',
                color: filterStar === star ? '#ffffff' : '#334155',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {star === 0 ? 'Tất cả' : `${star}★`}
            </button>
          ))}
        </div>
      )}
    </div>

    {/* ===== CONTENT ===== */}
    {showReviewList && (
      <div style={{
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        {filteredReviews.map((r, i) => (
          <div
            key={r.id}
            
            style={{
              background: '#ffffff',
              padding: 20,
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            {/* HEADER */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                  {r.name || r["Người gửi"] || "Ẩn danh"}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  {formatDateTime(r.created_at || r["Ngày review"])}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div>{renderStars(r.star, 16)}</div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color:
                    r.star >= 4 ? '#059669'
                    : r.star >= 3 ? '#d97706'
                    : '#dc2626'
                }}>
                  {r.star}★
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <p style={{
              margin: '12px 0',
              color: '#334155',
              lineHeight: 1.6
            }}>
              {r.content}
            </p>


{/* ACTION */}
<div style={{ display: 'flex', gap: 8, marginTop: 10 }}>

  {/* Giải thích AI - màu CAM */}
  <button
    onClick={() => explainReview(r)}
    disabled={loadingExplain === r.id}
    style={{
      padding: '8px 18px',
      borderRadius: '12px',
      border: '1px solid transparent',
      background: r.has_explain
        ? '#f8fafc'
        : 'linear-gradient(#ffffff,#ffffff) padding-box, linear-gradient(135deg,#f97316,#fb923c) border-box',
      color: r.has_explain ? '#94a3b8' : '#ea580c',
      fontSize: '13px',
      fontWeight: '720',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    }}

    onMouseEnter={(e)=>{
      e.currentTarget.style.background =
        'linear-gradient(#fff7ed,#fff7ed) padding-box, linear-gradient(135deg,#f97316,#fb923c) border-box';
    }}

    onMouseLeave={(e)=>{
      e.currentTarget.style.background =
        'linear-gradient(#ffffff,#ffffff) padding-box, linear-gradient(135deg,#f97316,#fb923c) border-box';
    }}

    onMouseDown={(e)=>{
      e.currentTarget.style.background =
        'linear-gradient(#fed7aa,#fed7aa) padding-box, linear-gradient(135deg,#f97316,#fb923c) border-box';
    }}

    onMouseUp={(e)=>{
      e.currentTarget.style.background =
        'linear-gradient(#fff7ed,#fff7ed) padding-box, linear-gradient(135deg,#f97316,#fb923c) border-box';
    }}
  >
    {loadingExplain === r.id
      ? 'Đang phân tích...'
      : r.has_explain
        ? 'Đã giải thích'
        : 'Giải thích'}
  </button>

  {/* Đề xuất cải thiện - màu XANH */}
  <button
    onClick={() => handleOtherAction(r)}
    style={{
      padding: '8px 18px',
      borderRadius: '12px',
      border: '1px solid transparent',
      background:
        'linear-gradient(#ffffff,#ffffff) padding-box, linear-gradient(135deg,#3b82f6,#06b6d4) border-box',
      color: '#2563eb',
      fontSize: '13px',
      fontWeight: '720',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    }}

    onMouseEnter={(e)=>{
      e.currentTarget.style.background =
        'linear-gradient(#eff6ff,#eff6ff) padding-box, linear-gradient(135deg,#3b82f6,#06b6d4) border-box';
    }}

    onMouseLeave={(e)=>{
      e.currentTarget.style.background =
        'linear-gradient(#ffffff,#ffffff) padding-box, linear-gradient(135deg,#3b82f6,#06b6d4) border-box';
    }}

    onMouseDown={(e)=>{
      e.currentTarget.style.background =
        'linear-gradient(#dbeafe,#dbeafe) padding-box, linear-gradient(135deg,#3b82f6,#06b6d4) border-box';
    }}

    onMouseUp={(e)=>{
      e.currentTarget.style.background =
        'linear-gradient(#eff6ff,#eff6ff) padding-box, linear-gradient(135deg,#3b82f6,#06b6d4) border-box';
    }}
  >
    Đề xuất cải thiện
  </button>

</div>

{/* KEYWORDS */}
<div style={{ 
  marginTop: '15px',
  padding: '10px',
  background: r.has_explain ? '#f8fafc' : 'transparent',
  borderRadius: '12px',
  border: r.has_explain ? '1px dashed #cbd5e1' : 'none' 
}}>
  {r.has_explain ? (
    r.phrases?.length > 0 ? (
      r.phrases.map((p, idx) => (
        <span 
          key={`${r.id}-${idx}`} 
          style={{
            display: 'inline-block',
            margin: '2px 4px',
            padding: '4px 10px',
            borderRadius: '15px',
            fontSize: '12px',
            background:
              p.impact >= 0.7
                ? '#bbf7d0'      // xanh nhạt
                : p.impact >= 0.34
                ? '#fef9c3'      // vàng nhạt
                : '#fce7f3',     // hồng nhạt

            color:
              p.impact >= 0.7
                ? '#166534'      // xanh đậm
                : p.impact >= 0.34
                ? '#854d0e'      // vàng nâu
                : '#9d174d',     // hồng đậm

            fontWeight: 600,     // đậm vừa
          }}
        >
          {p.phrase} ({Number(p.impact).toFixed(2)})
        </span>
      ))
    ) : (
      <span style={{color: 'orange'}}>Đã phân tích nhưng không tìm thấy từ khóa</span>
    )
  ) : null}
</div>


{suggestions[r.id] && (
  <div style={{
    marginTop: 12,
    padding: 12,
    background: '#f1f5f9',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500
  }}>

    {/* Biện pháp cải thiện */}
    {suggestions[r.id]?.improvements?.length > 0 && (
      <>
        <div style={{fontSize:14,fontWeight:700,color:'#dc2626',marginBottom:6}}>
          Biện pháp cải thiện
        </div>

        {suggestions[r.id]?.improvements?.map((s,i)=>(
          <div key={i}>• {s.solution}</div>
        ))}
      </>
    )}

    {/* Điểm mạnh */}
    {suggestions[r.id]?.strengths?.length > 0 && (
      <>
        <div style={{fontSize:13,fontWeight:700,color:'#059669',marginTop:8}}>
          Điểm mạnh nên duy trì
        </div>

        {suggestions[r.id]?.strengths?.map((s,i)=>(
          <div key={i}>• {s.solution}</div>
        ))}
      </>
    )}

    {/* Nếu không có gì */}
    {( (!suggestions[r.id]?.improvements || suggestions[r.id]?.improvements.length === 0) &&
       (!suggestions[r.id]?.strengths || suggestions[r.id]?.strengths.length === 0) ) && (
      <div style={{color:'#64748b', fontStyle:'italic'}}>
        Không có đề xuất cụ thể cho đánh giá này.
      </div>
    )}

  </div>
)}


            
          </div>
        ))}
      </div>
    )}
  </div>
)}





        {/* ===== SATISFACTION METRICS ===== */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04)',
          border: '1px solid rgba(226, 232, 240, 0.6)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Chỉ số hài lòng
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {/* Positive Reviews */}
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Đánh giá tích cực</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669' }}>
                    {((stats[5]?.count || 0) + (stats[4]?.count || 0))}
                  </div>
                </div>
              </div>
              <div style={{
                height: '8px',
                background: '#e2e8f0',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${stats.total > 0 ? (((stats[5]?.count || 0) + (stats[4]?.count || 0)) / stats.total * 100) : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  borderRadius: '8px',
                  transition: 'width 1s ease-out'
                }} />
              </div>
              <div style={{
                marginTop: '8px',
                fontSize: '13px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                {stats.total > 0 ? (((stats[5]?.count || 0) + (stats[4]?.count || 0)) / stats.total * 100).toFixed(1) : 0}% tổng số
              </div>
            </div>

            {/* Neutral Reviews */}
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(217, 119, 6, 0.04) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Đánh giá trung bình</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#d97706' }}>
                    {stats[3]?.count || 0}
                  </div>
                </div>
              </div>
              <div style={{
                height: '8px',
                background: '#e2e8f0',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${stats.total > 0 ? ((stats[3]?.count || 0) / stats.total * 100) : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                  borderRadius: '8px',
                  transition: 'width 1s ease-out'
                }} />
              </div>
              <div style={{
                marginTop: '8px',
                fontSize: '13px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                {stats.total > 0 ? ((stats[3]?.count || 0) / stats.total * 100).toFixed(1) : 0}% tổng số
              </div>
            </div>

            {/* Negative Reviews */}
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.04) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Đánh giá tiêu cực</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#dc2626' }}>
                    {((stats[2]?.count || 0) + (stats[1]?.count || 0))}
                  </div>
                </div>
              </div>
              <div style={{
                height: '8px',
                background: '#e2e8f0',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${stats.total > 0 ? (((stats[2]?.count || 0) + (stats[1]?.count || 0)) / stats.total * 100) : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '8px',
                  transition: 'width 1s ease-out'
                }} />
              </div>
              <div style={{
                marginTop: '8px',
                fontSize: '13px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                {stats.total > 0 ? (((stats[2]?.count || 0) + (stats[1]?.count || 0)) / stats.total * 100).toFixed(1) : 0}% tổng số
              </div>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '24px',
          color: '#94a3b8',
          fontSize: '14px'
        }}>
          <p style={{ margin: 0 }}>
            Dữ liệu được cập nhật tự động • Quản lý đánh giá khách hàng
          </p>
        </div>
      </div>
    </div>


  );
}