import React, { useState } from "react";
import axios from "axios";

function MenuPrediction() {
  const [day, setDay] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/predict/mon_ban_chay/by_day?day=${day}`
      );
      setResult(res.data);
    } catch (error) {
      setResult({ error: error.response?.data?.error || "Lỗi server" });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      maxWidth: "900px",
      margin: "50px auto",
      padding: "40px",
      backgroundColor: "#f7f9fc",
      borderRadius: "16px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    },
    title: {
      textAlign: "center",
      fontSize: "30px",
      marginBottom: "35px",
      color: "#1f2937",
      fontWeight: "700",
    },
    form: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "40px",
    },
    input: {
      width: "90px",
      padding: "12px",
      fontSize: "16px",
      borderRadius: "10px",
      border: "1px solid #d1d5db",
      textAlign: "center",
      transition: "0.3s",
    },
    button: {
      padding: "12px 28px",
      backgroundColor: "#3b82f6",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "600",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "0.3s",
    },
    buttonHover: {
      backgroundColor: "#2563eb",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    loading: {
      textAlign: "center",
      color: "#6b7280",
      fontStyle: "italic",
      marginBottom: "20px",
    },
    error: {
      color: "#ef4444",
      textAlign: "center",
      fontWeight: "600",
      marginBottom: "20px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      transition: "0.3s",
    },
    cardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
    },
    hourTitle: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "12px",
      color: "#111827",
    },
    item: {
      display: "flex",
      justifyContent: "space-between",
      padding: "6px 0",
      borderBottom: "1px solid #e5e7eb",
    },
    itemName: {
      fontWeight: "500",
      color: "#374151",
    },
    itemQty: {
      fontWeight: "600",
      color: "#10b981",
    },
    summary: {
      marginTop: "30px",
      padding: "20px",
      borderRadius: "12px",
      backgroundColor: "#e0f2fe",
      fontWeight: "600",
      color: "#0369a1",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dự đoán Món Bán Chạy theo Các Ngày Trong Tuần</h2>

      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="number"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          min={1}
          max={7}
          required
          style={styles.input}
          placeholder="Nhập thứ 1-7"
        />
        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) =>
            (e.target.style = { ...styles.button, ...styles.buttonHover })
          }
          onMouseLeave={(e) => (e.target.style = styles.button)}
          disabled={loading}
        >
          {loading ? "Đang dự đoán..." : "Dự đoán"}
        </button>
      </form>

      {loading && <p style={styles.loading}>Vui lòng chờ...</p>}
      {result?.error && <p style={styles.error}>{result.error}</p>}

      {result?.hourly_top5 && (
        <>
          <div style={styles.grid}>
            {Object.entries(result.hourly_top5).map(([hour, top5]) => (
              <div
                key={hour}
                style={styles.card}
                onMouseEnter={(e) =>
                  (e.currentTarget.style = { ...styles.card, ...styles.cardHover })
                }
                onMouseLeave={(e) => (e.currentTarget.style = styles.card)}
              >
                <h4 style={styles.hourTitle}>Giờ {hour}</h4>
                {top5.map((item, idx) => (
                  <div key={idx} style={styles.item}>
                    <span style={styles.itemName}>{item.product_name}</span>
                    <span style={styles.itemQty}>{item.predicted_quantity}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Tổng hợp nhanh top 3 món chung trong ngày */}
          {/* <div style={styles.summary}>
            Top 3 món dự đoán bán chạy hôm nay:{" "}
            {Object.values(result.hourly_top5)
              .flat()
              .sort((a, b) => b.predicted_quantity - a.predicted_quantity)
              .slice(0, 3)
              .map((item) => item.product_name)
              .join(", ")}
          </div> */}
        </>
      )}
    </div>
  );
}

export default MenuPrediction;
