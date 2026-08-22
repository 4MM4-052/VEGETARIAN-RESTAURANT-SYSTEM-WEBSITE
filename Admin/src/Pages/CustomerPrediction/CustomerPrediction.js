import React, { useState, useEffect } from 'react';

function CustomerPrediction() {
  const [day, setDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [hour, setHour] = useState(new Date().getHours());
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const [animateNumber, setAnimateNumber] = useState(0);

  const days = [
    { value: 0, label: 'Thứ 2', short: 'T2', icon: '📅'},
    { value: 1, label: 'Thứ 3', short: 'T3', icon: '📅' },
    { value: 2, label: 'Thứ 4', short: 'T4', icon: '📅' },
    { value: 3, label: 'Thứ 5', short: 'T5', icon: '📅' },
    { value: 4, label: 'Thứ 6', short: 'T6', icon: '📅' },
    { value: 5, label: 'Thứ 7', short: 'T7', icon: '📅' },
    { value: 6, label: 'CN', short: 'CN', icon: '📅' },
  ];

  const quickHours = [
    { hour: 7, label: 'Sáng', icon: '🌄' },
    { hour: 12, label: 'Trưa', icon: '🌞' },
    { hour: 18, label: 'Tối', icon: '🌇' },
    { hour: 21, label: 'Đêm', icon: '🌙' },
  ];

  const getTimeSlot = (h) => {
    if (h >= 5 && h < 9) return { label: 'Sáng sớm', icon: '🌄', color: '#d1b905ff' };
    if (h >= 9 && h < 11) return { label: 'Buổi sáng', icon: '☀️', color: '#faa107ff' };
    if (h >= 11 && h < 14) return { label: 'Buổi trưa', icon: '🌞', color: '#ff5b15ff' };
    if (h >= 14 && h < 17) return { label: 'Buổi chiều', icon: '🌤️', color: '#3b82f6' };
    if (h >= 17 && h < 21) return { label: 'Buổi tối', icon: '🌇', color: '#aa55faff' };
    return { label: 'Đêm khuya', icon: '🌙', color: '#1e293b' };
  };

  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null);
    setAnimateNumber(0);

    try {
      // Thay localhost bằng IP của máy chạy Flask nếu client không cùng máy
      const response = await fetch(`http://127.0.0.1:5000/api/predict/so_khach_dat_ban/${day}/${hour}`);
      const data = await response.json();

      const rawResult = data.predicted_guests;
      const result = Math.max(0, Math.round(rawResult));

      setPrediction(result);
      setLoading(false);

      // Animate number
      if (typeof result === 'number') {
        let count = 0;
        const increment = Math.ceil(result / 30);
        const timer = setInterval(() => {
          count += increment;
          if (count >= result) {
            setAnimateNumber(result);
            clearInterval(timer);
          } else {
            setAnimateNumber(count);
          }
        }, 30);
      }

      // Update history
      setHistory(prev => [{
        day: days[day].label,
        hour: hour,
        prediction: result,
        time: new Date().toLocaleTimeString('vi-VN')
      }, ...prev.slice(0, 4)]);

    } catch (error) {
      console.error(error);
      setPrediction("error");
      setLoading(false);
    }
  };


  const getPredictionLevel = (num) => {
    if (num === "error") return { text: 'Lỗi', color: '#ef4444', bg: '#fef2f2', emoji: '❌' };
    if (num <= 5) return { text: 'Rất thấp', color: '#22c55e', bg: '#f0fdf4', emoji: '😴' };
    if (num <= 15) return { text: 'Thấp', color: '#84cc16', bg: '#f7fee7', emoji: '🙂' };
    if (num <= 30) return { text: 'Trung bình', color: '#f59e0b', bg: '#fffbeb', emoji: '😊' };
    if (num <= 50) return { text: 'Cao', color: '#f97316', bg: '#fff7ed', emoji: '🔥' };
    return { text: 'Rất cao', color: '#ef4444', bg: '#fef2f2', emoji: '🚀' };
  };

  const getTips = (num) => {
    if (num <= 10) return [
      '💡 Thời điểm vắng - Có thể làm vệ sinh, chuẩn bị nguyên liệu',
      '📢 Đây là lúc tốt để chạy khuyến mãi flash sale',
      '👥 Giảm số nhân viên trực để tiết kiệm chi phí'
    ];
    if (num <= 30) return [
      '✅ Lượng khách ổn định - Duy trì đội ngũ hiện tại',
      '🍽️ Chuẩn bị sẵn các món bán chạy',
      '📱 Thời điểm tốt để tương tác với khách'
    ];
    return [
      '⚡ Cao điểm! Cần đủ nhân viên phục vụ',
      '🥡 Chuẩn bị sẵn nguyên liệu số lượng lớn',
      '⏰ Thông báo khách có thể phải chờ đợi',
      '🚗 Kiểm tra dịch vụ giao hàng hoạt động tốt'
    ];
  };

  // Inject styles
  useEffect(() => {
    if (!document.getElementById('prediction-styles-v2')) {
      const style = document.createElement('style');
      style.id = 'prediction-styles-v2';
      style.textContent = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 
          0%, 100% { transform: translateY(0) rotate(0deg); } 
          50% { transform: translateY(-20px) rotate(5deg); } 
        }
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes pulse { 
          0%, 100% { transform: scale(1); } 
          50% { transform: scale(1.05); } 
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
        }
        .card-animate { animation: fadeInUp 0.6s ease-out; }
        .result-animate { animation: fadeInUp 0.5s ease-out; }
        .pulse-animate { animation: pulse 2s infinite; }
        .bounce-animate { animation: bounce 1s ease-in-out infinite; }
        .glow-animate { animation: glow 2s ease-in-out infinite; }
        .day-btn-hover:hover { 
          transform: translateY(-3px) scale(1.02); 
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        .quick-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .predict-btn-hover:hover:not(:disabled) { 
          transform: translateY(-3px); 
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
        }
        .history-item:hover {
          transform: translateX(5px);
          background: rgba(102, 126, 234, 0.1);
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .tip-item {
          transition: all 0.3s ease;
        }
        .tip-item:hover {
          transform: translateX(10px);
          background: rgba(102, 126, 234, 0.05);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // ===================== STYLES =====================
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '30px 15px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    },

    bgCircle: (size, top, left, right, bottom, delay, color) => ({
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: color || 'rgba(102, 126, 234, 0.1)',
      top, left, right, bottom,
      animation: `float 8s ease-in-out infinite ${delay}s`,
      filter: 'blur(1px)',
    }),

    card: {
      maxWidth: '800px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '28px',
      boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 1,
    },

    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '35px 30px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',      // đặt các phần con xếp theo cột
      justifyContent: 'center',     // căn giữa theo chiều dọc
      gap: '20px',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '50px',
    },

    headerPattern: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    },

    headerIcon: {
      width: '70px',
      height: '70px',
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      position: 'relative',
      zIndex: 1,
    },

    headerContent: {
      position: 'relative',
      zIndex: 1,
    },

    headerTitle: {
      color: 'white',
      fontSize: '1.8rem',
      fontWeight: '800',
      margin: 0,
      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
      flexDirection: 'column',     
      textAlign: 'center',   
      fontFamily: '"Times New Roman", Times, serif',
    },

    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1rem',
      margin: '8px 0 0 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },

    liveBadge: {
      background: '#22c55e',
      color: 'white',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },

    body: {
      padding: '35px',
    },

    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '18px',
    },

    inputSection: {
      marginBottom: '32px',
    },

    dayGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '10px',
    },

    dayBtn: (isActive, busy) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '16px 8px',
      border: isActive ? 'none' : '2px solid #e5e7eb',
      borderRadius: '16px',
      background: isActive 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        : 'white',
      color: isActive ? 'white' : '#374151',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isActive ? 'scale(1.08)' : 'scale(1)',
      boxShadow: isActive 
        ? '0 10px 25px rgba(102, 126, 234, 0.5)' 
        : '0 2px 8px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden',
    }),

    // busyIndicator: (busy) => ({
    //   position: 'absolute',
    //   top: '6px',
    //   right: '6px',
    //   width: '8px',
    //   height: '8px',
    //   borderRadius: '50%',
    //   background: busy === 'very-high' ? '#ef4444' 
    //     : busy === 'high' ? '#f97316' 
    //     : busy === 'medium' ? '#f59e0b' 
    //     : '#22c55e',
    // }),

    dayIcon: { fontSize: '1.5rem' },
    dayLabel: { fontSize: '1.0rem', fontWeight: '700', fontFamily: '"Times New Roman", Times, serif', },

    quickHoursContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
    },

    quickHourBtn: (isActive) => ({
      flex: 1,
      padding: '12px',
      border: isActive ? 'none' : '2px solid #e5e7eb',
      borderRadius: '12px',
      background: isActive 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        : 'white',
      color: isActive ? 'white' : '#64748b',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      fontSize: '1.1rem',
      fontWeight: '600',
      fontFamily: '"Times New Roman", Times, serif',
    }),

    sliderContainer: {
      padding: '15px 0',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '16px',
      paddingLeft: '20px',
      paddingRight: '20px',
    },

    sliderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
    },

    currentTime: {
      fontSize: '2rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },

    timeBadge: {
      background: getTimeSlot(hour).color,
      color: 'white',
      padding: '8px 16px',
      borderRadius: '25px',
      fontSize: '1.0rem',
      fontWeight: '800',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },

    slider: {
      width: '100%',
      height: '10px',
      borderRadius: '5px',
      background: `linear-gradient(to right, 
        #fbbf24 0%, #f59e0b 20%, #ef4444 40%, 
        #3b82f6 60%, #8b5cf6 80%, #1e293b 100%)`,
      outline: 'none',
      WebkitAppearance: 'none',
      cursor: 'pointer',
    },

    hourMarks: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '12px',
      color: '#94a3b8',
      fontSize: '0.8rem',
      fontWeight: '500',
    },

    predictBtn: {
      width: '100%',
      padding: '20px 35px',
      border: 'none',
      borderRadius: '18px',
      backgroundImage: loading 
        ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      backgroundSize: '200% 200%',
      color: 'white',
      fontSize: '1.2rem',
      fontWeight: '700',
      cursor: loading ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      transition: 'all 0.4s ease',
      boxShadow: loading ? 'none' : '0 10px 30px rgba(102, 126, 234, 0.4)',
    },

    spinner: {
      width: '26px',
      height: '26px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderTopColor: 'white',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    },

    resultCard: {
      marginTop: '35px',
      padding: '30px',
      borderRadius: '20px',
      background: prediction !== "error" 
        ? `linear-gradient(135deg, ${getPredictionLevel(prediction).bg} 0%, white 100%)`
        : 'linear-gradient(135deg, #fef2f2 0%, white 100%)',
      border: `3px solid ${prediction !== "error" 
        ? getPredictionLevel(prediction).color 
        : '#fecaca'}`,
      position: 'relative',
      overflow: 'hidden',
    },

    resultEmoji: {
      position: 'absolute',
      top: '15px',
      right: '20px',
      fontSize: '3rem',
      opacity: 0.3,
    },

    resultHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '25px',
      fontSize: '1.1rem',
      color: '#475569',
      fontWeight: '700',
    },

    resultMain: {
      textAlign: 'center',
      position: 'relative',
      zIndex: 1,
    },

    resultNumber: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '20px',
    },

    number: {
      fontSize: '5rem',
      fontWeight: '900',
      background: `linear-gradient(135deg, ${getPredictionLevel(prediction).color} 0%, #764ba2 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: 1,
      textShadow: '0 4px 30px rgba(102, 126, 234, 0.3)',
    },

    unit: {
      fontSize: '2.3rem',
      color: '#64748b',
      fontWeight: '700',
    },

    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 28px',
      borderRadius: '35px',
      color: 'white',
      fontWeight: '700',
      fontSize: '1.1rem',
      background: prediction !== "error" 
        ? getPredictionLevel(prediction).color 
        : '#ef4444',
      boxShadow: `0 8px 25px ${prediction !== "error" 
        ? getPredictionLevel(prediction).color + '60' 
        : 'rgba(239, 68, 68, 0.4)'}`,
    },

    resultDetails: {
      display: 'flex',
      justifyContent: 'center',
      gap: '40px',
      marginTop: '25px',
      color: '#64748b',
      fontSize: '1rem',
      fontWeight: '500',
    },

    detailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'white',
      padding: '10px 18px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },

    tipsSection: {
      marginTop: '25px',
      padding: '20px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      borderRadius: '16px',
      border: '2px solid #7dd3fc',
    },

    tipsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '15px',
      cursor: 'pointer',
    },

    tipsTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '1rem',
      fontWeight: '700',
      color: '#0369a1',
    },

    tipItem: {
      padding: '12px 16px',
      marginBottom: '8px',
      background: 'white',
      borderRadius: '10px',
      fontSize: '0.95rem',
      color: '#334155',
      // borderLeft: '4px solid #667eea',
    },

    historySection: {
      marginTop: '35px',
      padding: '25px',
      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
      borderRadius: '20px',
      border: '2px solid #e9d5ff',
    },

    historyTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#7c3aed',
      marginBottom: '18px',
    },

    historyList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },

    historyItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 18px',
      background: 'white',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },

    historyLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },

    historyInfo: {
      fontSize: '0.95rem',
      color: '#475569',
    },

    historyValue: {
      fontSize: '1.2rem',
      fontWeight: '800',
      color: '#667eea',
    },

    statsBar: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '15px',
      marginBottom: '30px',
    },

    statCard: {
      background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
      padding: '18px',
      borderRadius: '16px',
      textAlign: 'center',
      border: '2px solid #667eea30',
    },

    statValue: {
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#667eea',
    },

    statLabel: {
      fontSize: '1.1rem',
      color: '#64748b',
      marginTop: '5px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Background Decorations */}
      <div style={styles.bgCircle('350px', '-150px', 'auto', '-100px', 'auto', 0, 'rgba(102, 126, 234, 0.15)')}></div>
      <div style={styles.bgCircle('250px', 'auto', '-80px', 'auto', '50px', 2, 'rgba(240, 147, 251, 0.15)')}></div>
      <div style={styles.bgCircle('200px', '40%', 'auto', '-50px', 'auto', 4, 'rgba(118, 75, 162, 0.1)')}></div>
      <div style={styles.bgCircle('150px', 'auto', '50%', 'auto', '-30px', 3, 'rgba(102, 126, 234, 0.1)')}></div>

      {/* Main Card */}
      <div style={styles.card} className="card-animate">
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerPattern}></div>
          <div style={styles.headerIcon} className="pulse-animate">👥</div>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>  Dự Đoán Số Khách Hàng Sẽ Đặt Bàn<br />
                                          Trong Các Khung Giờ Tiếp Theo Trong Ngày</h1>
            <p style={styles.headerSubtitle}>
      
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={styles.body}>

          {/* Quick Stats */}
          <div style={styles.statsBar}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>📅</div>
              <div style={styles.statLabel}>Hôm nay: {new Date().toLocaleDateString('vi-VN')}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>⏰</div>
              <div style={styles.statLabel}>Hiện tại: {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>📊</div>
              <div style={styles.statLabel}>Đã dự đoán: {history.length} lần</div>
            </div>
          </div>
          
          {/* Day Selection */}
          <div style={styles.inputSection}>
            <div style={styles.sectionTitle}>
              <span>📅</span>
              <span>Chọn ngày trong tuần</span>
            </div>
            <div style={styles.dayGrid}>
              {days.map((d) => (
                <button
                  key={d.value}
                  className="day-btn-hover"
                  style={styles.dayBtn(day === d.value, d.busy)}
                  onClick={() => setDay(d.value)}
                >
                  {/* <div style={styles.busyIndicator(d.busy)}></div> */}
                  <span style={styles.dayIcon}>{d.icon}</span>
                  <span style={styles.dayLabel}>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hour Selection */}
          <div style={styles.inputSection}>
            <div style={styles.sectionTitle}>
              <span>⏰</span>
              <span>Chọn giờ dự đoán</span>
            </div>

            {/* Quick Hour Buttons */}
            <div style={styles.quickHoursContainer}>
              {quickHours.map((q) => (
                <button
                  key={q.hour}
                  className="quick-btn"
                  style={styles.quickHourBtn(hour === q.hour)}
                  onClick={() => setHour(q.hour)}
                >
                  <span style={{fontSize: '1.5rem'}}>{q.icon}</span>
                  <span>{q.label}</span>
                </button>
              ))}
            </div>

            {/* Slider */}
            <div style={styles.sliderContainer}>
              <div style={styles.sliderHeader}>
                <span style={styles.currentTime}>{hour}:00</span>
                <span style={styles.timeBadge}>
                  {getTimeSlot(hour).icon} {getTimeSlot(hour).label}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="23"
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.hourMarks}>
                {['0:00', '6:00', '12:00', '18:00', '23:00'].map(h => (
                  <span key={h}>{h}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Predict Button */}
          <button
            className="predict-btn-hover"
            style={styles.predictBtn}
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={styles.spinner}></div>
                <span>Đang phân tích dữ liệu...</span>
              </>
            ) : (
              <>
                <span style={{fontSize: '1.6rem'}}>🔮</span>
                <span>Dự Đoán Ngay</span>
                <span style={{fontSize: '1.3rem'}}>⚡</span>
              </>
            )}
          </button>

          {/* Result */}
          {prediction !== null && (
            <div style={styles.resultCard} className="result-animate">
              <div style={styles.resultEmoji}>
                {getPredictionLevel(prediction).emoji}
              </div>
              
              <div style={styles.resultHeader}>
                <span style={{fontSize: '1.8rem'}}>📊</span>
                <span>Kết quả dự đoán</span>
              </div>

              {prediction !== "error" ? (
                <div style={styles.resultMain}>
                  <div style={styles.resultNumber}>
                    <span style={styles.number}>{animateNumber}</span>
                    <span style={styles.unit}>Khách</span>
                  </div>
                  
                  <span style={styles.badge} className={prediction > 30 ? 'glow-animate' : ''}>
                    {getPredictionLevel(prediction).emoji}
                    {getPredictionLevel(prediction).text}
                  </span>
                  
                  <div style={styles.resultDetails}>
                    <div style={styles.detailItem}>
                      <span>📅</span>
                      <span>{days.find(d => d.value === day)?.label}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span>⏰</span>
                      <span>{hour}:00 - {getTimeSlot(hour).label}</span>
                    </div>
                  </div>

                  {/* Tips Section */}
                  <div style={styles.tipsSection}>
                    <div 
                      style={styles.tipsHeader}
                      onClick={() => setShowTips(!showTips)}
                    >
                      <div style={styles.tipsTitle}>
                        <span>💡</span>
                        <span>Gợi ý kinh doanh</span>
                      </div>
                      <span style={{fontSize: '1.2rem', transition: 'transform 0.3s', transform: showTips ? 'rotate(180deg)' : 'rotate(0)'}}>
                        ⬇️
                      </span>
                    </div>
                    {showTips && (
                      <div>
                        {getTips(prediction).map((tip, index) => (
                          <div key={index} style={styles.tipItem} className="tip-item">
                            {tip}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <span style={{fontSize: '4rem', display: 'block', marginBottom: '15px'}}>❌</span>
                  <p style={{fontSize: '1.1rem', color: '#ef4444', fontWeight: '600'}}>
                    Không thể kết nối đến server. Vui lòng thử lại!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div style={styles.historySection}>
              <div style={styles.historyTitle}>
                <span>📜</span>
                <span>Lịch sử dự đoán</span>
              </div>
              <div style={styles.historyList}>
                {history.map((item, index) => (
                  <div key={index} style={styles.historyItem} className="history-item">
                    <div style={styles.historyLeft}>
                      <span style={{fontSize: '1.5rem'}}>
                        {getPredictionLevel(item.prediction).emoji}
                      </span>
                      <div style={styles.historyInfo}>
                        <strong>{item.day}</strong> lúc <strong>{item.hour}:00</strong>
                        <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>
                          {item.time}
                        </div>
                      </div>
                    </div>
                    <div style={styles.historyValue}>
                      {item.prediction} khách
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default CustomerPrediction;