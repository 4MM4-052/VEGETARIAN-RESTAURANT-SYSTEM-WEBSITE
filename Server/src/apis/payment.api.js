// const axios = require("axios");
// const express = require("express");
// const router = express.Router();
// const crypto = require("crypto");
// const connection = require("../../index");

// var accessKey = process.env.MOMO_ACCESSKEY;
// var secretKey = process.env.MOMO_SECRETKEY;

// router.post("/", async (req, res) => {
//   const { amount, reservationId, reservation_code } = req.body;
//   var orderInfo = "pay with MoMo";
//   var partnerCode = "MOMO";
//   var redirectUrl = "http://localhost:3001/confirm";
//   var ipnUrl = `${process.env.LOCAL_URL}/api/public/payment/callback`;
//   var requestType = "payWithMethod";
//   var orderId = reservation_code; // Sử dụng reservation_code
//   var requestId = orderId;
//   var extraData = "";
//   var lang = "vi";

//   var rawSignature =
//     "accessKey=" +
//     accessKey +
//     "&amount=" +
//     amount +
//     "&extraData=" +
//     extraData +
//     "&ipnUrl=" +
//     ipnUrl +
//     "&orderId=" +
//     orderId +
//     "&orderInfo=" +
//     orderInfo +
//     "&partnerCode=" +
//     partnerCode +
//     "&redirectUrl=" +
//     redirectUrl +
//     "&requestId=" +
//     requestId +
//     "&requestType=" +
//     requestType;

//   var signature = crypto
//     .createHmac("sha256", secretKey)
//     .update(rawSignature)
//     .digest("hex");

//   const requestBody = JSON.stringify({
//     partnerCode: partnerCode,
//     partnerName: "Test",
//     storeId: "MomoTestStore",
//     requestId: requestId,
//     amount: amount,
//     orderId: orderId,
//     orderInfo: orderInfo,
//     redirectUrl: redirectUrl,
//     ipnUrl: ipnUrl,
//     lang: lang,
//     requestType: requestType,
//     autoCapture: true,
//     extraData: extraData,
//     orderGroupId: "",
//     signature: signature,
//   });

//   const options = {
//     method: "POST",
//     url: "https://test-payment.momo.vn/v2/gateway/api/create",
//     headers: {
//       "Content-Type": "application/json",
//       "Content-Length": Buffer.byteLength(requestBody),
//     },
//     data: requestBody,
//   };

//   try {
//     // Gửi yêu cầu thanh toán đến MoMo
//     const result = await axios(options);

//     // Đếm ngược thời gian 1 giờ 40 phút
//     setTimeout(async () => {
//       const checkStatusQuery = `SELECT status FROM reservations WHERE id = ?`;
//       connection.query(
//         checkStatusQuery,
//         [reservationId],
//         async (err, results) => {
//           if (err) {
//             console.error("Error checking reservation status:", err);
//           } else if (results[0].status !== 3) {
//             const updateStatusQuery = `UPDATE reservations SET status = 2 WHERE id = ?`;
//             await new Promise((resolve, reject) => {
//               connection.query(updateStatusQuery, [reservationId], (err) => {
//                 if (err) {
//                   console.error("Error updating reservation status:", err);
//                   reject(err);
//                 } else {
//                   resolve();
//                 }
//               });
//             });
//             console.log("Reservation status updated to 2 due to timeout");
//           }
//         }
//       );
//     }, 100 * 60000); // 1 giờ 40 phút

//     return res.status(200).json(result.data);
//   } catch (error) {
//     console.error("Error in MoMo payment request:", error);
//     return res.status(500).json({
//       statusCode: 500,
//       message: "Server error",
//     });
//   }
// });

// router.post("/get_pay_url", async (req, res) => {
//   const { amount, reservationId } = req.body;

//   const generateReservationCode = () => {
//     const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
//     return `HS${randomNumber}`;
//   };

//   try {
//     // Kiểm tra xem reservation_code đã tồn tại chưa
//     const checkQuery = `SELECT reservation_code FROM reservations WHERE id = ?`;
//     const reservationCode = await new Promise((resolve, reject) => {
//       connection.query(checkQuery, [reservationId], (err, results) => {
//         if (err) {
//           console.error("Error fetching reservation_code:", err);
//           reject(err);
//         } else if (results.length > 0 && results[0].reservation_code) {
//           resolve(results[0].reservation_code);
//         } else {
//           resolve(null);
//         }
//       });
//     });

//     let reseCode;
//     if (reservationCode) {
//       reseCode = reservationCode; // ❗ Dùng lại nếu đã có
//     } else {
//       reseCode = generateReservationCode(); // ❗ Tạo mới nếu chưa có
//       const updateQuery = `UPDATE reservations SET reservation_code = ? WHERE id = ?`;
//       await new Promise((resolve, reject) => {
//         connection.query(updateQuery, [reseCode, reservationId], (err, results) => {
//           if (err) {
//             console.error("Error updating reservation_code:", err);
//             reject(err);
//           } else {
//             resolve(results);
//           }
//         });
//       });
//     }

//     const orderInfo = "pay with MoMo";
//     const partnerCode = "MOMO";
//     const redirectUrl = "http://localhost:3001/confirm";
//     const ipnUrl = `${process.env.LOCAL_URL}/api/public/payment/callback`;
//     const requestType = "payWithMethod";
//     const requestId = reseCode;
//     const extraData = "";
//     const orderGroupId = "";
//     const autoCapture = true;
//     const lang = "vi";

//     const rawSignature =
//       `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${reseCode}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

//     const signature = crypto
//       .createHmac("sha256", secretKey)
//       .update(rawSignature)
//       .digest("hex");

//     const requestBody = JSON.stringify({
//       partnerCode,
//       partnerName: "Test",
//       storeId: "MomoTestStore",
//       requestId,
//       amount,
//       orderId: reseCode,
//       orderInfo,
//       redirectUrl,
//       ipnUrl,
//       lang,
//       requestType,
//       autoCapture,
//       extraData,
//       orderGroupId,
//       signature,
//     });

//     const options = {
//       method: "POST",
//       url: "https://test-payment.momo.vn/v2/gateway/api/create",
//       headers: {
//         "Content-Type": "application/json",
//         "Content-Length": Buffer.byteLength(requestBody),
//       },
//       data: requestBody,
//     };

//     const result = await axios(options);
//     const { payUrl } = result.data;

//     console.log("MoMo Response:", result.data);

//     return res.status(200).json({ payUrl });
//   } catch (error) {
//     console.error("Error in MoMo payment request:", error);
//     return res.status(500).json({
//       statusCode: 500,
//       message: "Server error",
//     });
//   }
// });


// router.post("/pay_balance", async (req, res) => {
//   const { amount, reservationId } = req.body;

//   const generateReservationCode = () => {
//     const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
//     return `HS${randomNumber}`;
//   };

//   try {
//     // Lấy reservation_code từ DB
//     const checkQuery = `SELECT reservation_code FROM reservations WHERE id = ?`;
//     const reservationCode = await new Promise((resolve, reject) => {
//       connection.query(checkQuery, [reservationId], (err, results) => {
//         if (err) {
//           console.error("Error fetching reservation_code:", err);
//           reject(err);
//         } else if (results.length > 0 && results[0].reservation_code) {
//           resolve(results[0].reservation_code);
//         } else {
//           resolve(null);
//         }
//       });
//     });

//     let reseCode;
//     if (reservationCode) {
//       reseCode = reservationCode; // ❗Dùng lại nếu đã có
//     } else {
//       reseCode = generateReservationCode(); // ❗Tạo mới
//       const updateQuery = `UPDATE reservations SET reservation_code = ? WHERE id = ?`;
//       await new Promise((resolve, reject) => {
//         connection.query(updateQuery, [reseCode, reservationId], (err, results) => {
//           if (err) {
//             console.error("Error updating reservation_code:", err);
//             reject(err);
//           } else {
//             resolve(results);
//           }
//         });
//       });
//     }

//     const orderInfo = "pay with MoMo";
//     const partnerCode = "MOMO";
//     const redirectUrl = "http://localhost:5301/reservation";
//     const ipnUrl = `${process.env.LOCAL_URL}/api/public/payment/callback`;
//     const requestType = "payWithMethod";
//     const requestId = reseCode;
//     const extraData = "";
//     const orderGroupId = "";
//     const autoCapture = true;
//     const lang = "vi";

//     const rawSignature =
//       `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${reseCode}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

//     const signature = crypto
//       .createHmac("sha256", secretKey)
//       .update(rawSignature)
//       .digest("hex");

//     const requestBody = JSON.stringify({
//       partnerCode,
//       partnerName: "Test",
//       storeId: "MomoTestStore",
//       requestId,
//       amount,
//       orderId: reseCode,
//       orderInfo,
//       redirectUrl,
//       ipnUrl,
//       lang,
//       requestType,
//       autoCapture,
//       extraData,
//       orderGroupId,
//       signature,
//     });

//     const options = {
//       method: "POST",
//       url: "https://test-payment.momo.vn/v2/gateway/api/create",
//       headers: {
//         "Content-Type": "application/json",
//         "Content-Length": Buffer.byteLength(requestBody),
//       },
//       data: requestBody,
//     };

//     const result = await axios(options);
//     const { payUrl } = result.data;

//     console.log("MoMo Response:", result.data);

//     return res.status(200).json({ payUrl });
//   } catch (error) {
//     console.error("Error in MoMo payment request:", error);
//     return res.status(500).json({
//       statusCode: 500,
//       message: "Server error",
//     });
//   }
// });


//    const updateReservationStatus = async (orderId) => {
//      console.log(`Bắt đầu cập nhật trạng thái cho orderId: ${orderId}`);
//      const getStatusQuery = `SELECT status, table_id FROM reservations WHERE reservation_code = ?`;
//      const updateStatusQuery = `UPDATE reservations SET status = ? WHERE reservation_code = ?`;
//      const updateTableStatusQuery = `UPDATE tables SET status = ? WHERE id = ?`;

//      try {
//        const { currentStatus, tableId } = await new Promise((resolve, reject) => {
//          connection.query(getStatusQuery, [orderId], (err, results) => {
//            if (err) return reject(err);
//            if (results.length === 0) return reject(new Error("Không tìm thấy đơn đặt chỗ."));
//            resolve({
//              currentStatus: results[0].status,
//              tableId: results[0].table_id,
//            });
//          });
//        });

//        console.log(`Trạng thái hiện tại: ${currentStatus}, tableId: ${tableId}`);

//        const newStatus = currentStatus === 4 ? 5 : 3;
//        const newTableStatus = newStatus === 5 ? 1 : 0;

//        await new Promise((resolve, reject) => {
//          connection.query(updateStatusQuery, [newStatus, orderId], (err) => {
//            if (err) {
//              console.error("Lỗi khi cập nhật trạng thái:", err);
//              return reject(err);
//            }
//            console.log(`Cập nhật trạng thái thành công cho orderId: ${orderId} với trạng thái mới: ${newStatus}`);
//            resolve();
//          });
//        });

//        await new Promise((resolve, reject) => {
//          connection.query(updateTableStatusQuery, [newTableStatus, tableId], (err) => {
//            if (err) {
//              console.error("Lỗi khi cập nhật trạng thái bàn:", err);
//              return reject(err);
//            }
//            console.log(`Cập nhật trạng thái bàn thành công cho tableId: ${tableId} với trạng thái mới: ${newTableStatus}`);
//            resolve();
//          });
//        });

//        return { newStatus, newTableStatus };
//      } catch (error) {
//        console.error("Lỗi cập nhật trạng thái:", error);
//        throw error;
//      }
//    };
   

// // Nhận callback từ MoMo
// router.post("/callback", async (req, res) => {
//   console.log("MoMo callback nhận:", req.body);

//   const { resultCode, orderId, message } = req.body;

//   if (resultCode === 0) {
//     try {
//       console.log(`Cập nhật trạng thái cho orderId: ${orderId}`);
//       const statusUpdate = await updateReservationStatus(orderId);
//       console.log("Cập nhật trạng thái thành công:", statusUpdate);
//       return res.status(200).json({ message: `Cập nhật trạng thái thành công`, statusUpdate });
//     } catch (err) {
//       console.error("Cập nhật thất bại:", err);
//       return res.status(500).json({ message: "Cập nhật thất bại", error: err.message });
//     }
//   } else {
//     console.log(`Giao dịch thất bại với resultCode: ${resultCode}, message: ${message}`);
//     return res.status(400).json({ message: `Giao dịch thất bại: ${message}` });
//   }
// });


// // Truy vấn trạng thái giao dịch
// router.post("/transaction-status", async (req, res) => {
//   const { orderId } = req.body;
//   const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;

//   const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

//   const requestBody = {
//     partnerCode,
//     requestId: orderId,
//     orderId,
//     signature,
//     lang: "vi",
//   };

//   try {
//     const result = await axios.post("https://test-payment.momo.vn/v2/gateway/api/query", requestBody, {
//       headers: { "Content-Type": "application/json" },
//     });

//     res.status(200).json(result.data);
//   } catch (err) {
//     console.error("Lỗi truy vấn trạng thái:", err);
//     res.status(500).json({ error: "Không thể truy vấn trạng thái giao dịch" });
//   }
// });

// module.exports = router;












// const express = require("express");
// const axios = require("axios");
// const crypto = require("crypto");
// const { v4: uuidv4 } = require("uuid");
// const router = express.Router();
// const connection = require("../../index");

// // === MoMo Config ===
// const accessKey = process.env.MOMO_ACCESSKEY;
// const secretKey = process.env.MOMO_SECRETKEY;
// const redirectUrl = "http://localhost:3001/confirm";
// const ipnUrl = `${process.env.LOCAL_URL}/api/public/payment/callback`;
// const partnerCode = "MOMO";
// const partnerName = "Test";
// const storeId = "MomoTestStore";
// const requestType = "payWithMethod";
// const lang = "vi";

// // === Utility ===
// const generateReservationCode = () => `HS${Math.floor(10000000 + Math.random() * 90000000)}`;
// const generateOrderId = (reservationCode) => `${reservationCode}_${Date.now()}_${uuidv4()}`;
// const generateRequestId = (reservationCode) => `${reservationCode}_${Date.now()}_${uuidv4()}`;

// const createSignature = ({ amount, orderId, requestId }) => {
//     const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}` +
//         `&orderId=${orderId}&orderInfo=pay with MoMo&partnerCode=${partnerCode}` +
//         `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
//     return crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
// };

// const createPaymentRequestBody = ({ amount, orderId, requestId, signature }) => ({
//     partnerCode,
//     partnerName,
//     storeId,
//     requestId,
//     amount,
//     orderId,
//     orderInfo: "pay with MoMo",
//     redirectUrl,
//     ipnUrl,
//     lang,
//     requestType,
//     autoCapture: true,
//     extraData: "",
//     orderGroupId: "",
//     signature
// });

// const createMomoPayment = async (amount, reservationCode) => {
//     const orderId = generateOrderId(reservationCode);
//     const requestId = generateRequestId(reservationCode);
//     const signature = createSignature({ amount, orderId, requestId });
//     const requestBody = createPaymentRequestBody({ amount, orderId, requestId, signature });

//     try {
//         const result = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody, {
//             headers: { "Content-Type": "application/json" }
//         });

//         const { resultCode, message } = result.data;
//         if (resultCode === 0) {
//             console.log("✅ MoMo payment success:", result.data);
//             return result.data;
//         } else {
//             console.error("❌ MoMo Error:", result.data);
//             throw new Error(`MoMo trả về lỗi (${resultCode}): ${message}`);
//         }
//     } catch (error) {
//         console.error("❌ Gửi yêu cầu MoMo thất bại:", error?.response?.data || error.message);
//         throw new Error(error?.response?.data?.message || error.message);
//     }
// };

// // === POST /api/public/payment ===
// router.post("/", async (req, res) => {
//     const { amount, reservationId, reservation_code } = req.body;

//     try {
//         const paymentResult = await createMomoPayment(amount, reservation_code);

//         // Auto timeout sau 100 phút nếu chưa thanh toán
//         setTimeout(() => {
//             connection.query("SELECT status FROM reservations WHERE id = ?", [reservationId], (err, results) => {
//                 if (err) return console.error("DB SELECT error:", err);
//                 if (results.length && results[0].status !== 3) {
//                     connection.query("UPDATE reservations SET status = 2 WHERE id = ?", [reservationId], (err) => {
//                         if (err) return console.error("DB UPDATE error:", err);
//                         console.log("⏳ Reservation timed out & updated to status = 2");
//                     });
//                 }
//             });
//         }, 100 * 60 * 1000); // 1h40 phút

//         res.status(200).json(paymentResult);
//     } catch (error) {
//         res.status(500).json({ message: error.message || "Lỗi khi tạo thanh toán" });
//     }
// });

// // === POST /api/public/payment/get_pay_url ===
// router.post("/get_pay_url", async (req, res) => {
//     const { amount, reservationId } = req.body;

//     try {
//         let reservationCode = await new Promise((resolve, reject) => {
//             connection.query("SELECT reservation_code FROM reservations WHERE id = ?", [reservationId], (err, results) => {
//                 if (err) return reject(err);
//                 resolve(results[0]?.reservation_code || null);
//             });
//         });

//         if (!reservationCode) {
//             reservationCode = generateReservationCode();
//             await new Promise((resolve, reject) => {
//                 connection.query(
//                     "UPDATE reservations SET reservation_code = ? WHERE id = ?",
//                     [reservationCode, reservationId],
//                     (err) => (err ? reject(err) : resolve())
//                 );
//             });
//         }

//         const result = await createMomoPayment(amount, reservationCode);
//         res.status(200).json({ payUrl: result.payUrl });
//     } catch (error) {
//         res.status(500).json({ message: error.message || "Không thể tạo link thanh toán" });
//     }
// });

// // === POST /api/public/payment/pay_balance ===
// router.post("/pay_balance", async (req, res) => {
//     const { amount, reservationId } = req.body;

//     try {
//         let reservationCode = await new Promise((resolve, reject) => {
//             connection.query("SELECT reservation_code FROM reservations WHERE id = ?", [reservationId], (err, results) => {
//                 if (err) return reject(err);
//                 resolve(results[0]?.reservation_code || null);
//             });
//         });

//         if (!reservationCode) {
//             reservationCode = generateReservationCode();
//             await new Promise((resolve, reject) => {
//                 connection.query(
//                     "UPDATE reservations SET reservation_code = ? WHERE id = ?",
//                     [reservationCode, reservationId],
//                     (err) => (err ? reject(err) : resolve())
//                 );
//             });
//         }

//         const result = await createMomoPayment(amount, reservationCode);
//         res.status(200).json({ payUrl: result.payUrl });
//     } catch (error) {
//         res.status(500).json({ message: error.message || "Không thể thanh toán phần còn lại" });
//     }
// });

// module.exports = router;






// const express = require("express");
// const axios = require("axios");
// const crypto = require("crypto");
// const { v4: uuidv4 } = require("uuid");
// const router = express.Router();
// const connection = require("../../index");

// // === MoMo Config ===
// const accessKey = process.env.MOMO_ACCESSKEY;
// const secretKey = process.env.MOMO_SECRETKEY;
// const redirectUrl = "http://localhost:3001/confirm"; // URL người dùng sẽ được chuyển hướng sau khi thanh toán
// const ipnUrl = `${process.env.LOCAL_URL}/api/public/payment/callback`; // URL nhận kết quả thanh toán từ MoMo
// const partnerCode = "MOMO";
// const partnerName = "Test";
// const storeId = "MomoTestStore";
// const requestType = "payWithMethod";
// const lang = "vi";

// // === Utility ===
// const generateReservationCode = () => `HS${Math.floor(10000000 + Math.random() * 90000000)}`;
// const generateOrderId = (reservationCode) => `${reservationCode}_${Date.now()}_${uuidv4()}`;
// const generateRequestId = (reservationCode) => `${reservationCode}_${Date.now()}_${uuidv4()}`;

// const createSignature = ({ amount, orderId, requestId }) => {
//   const rawSignature =
//     `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}` +
//     `&orderId=${orderId}&orderInfo=pay with MoMo&partnerCode=${partnerCode}` +
//     `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
//   return crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
// };

// const createPaymentRequestBody = ({ amount, orderId, requestId, signature }) => ({
//   partnerCode,
//   partnerName,
//   storeId,
//   requestId,
//   amount,
//   orderId,
//   orderInfo: "pay with MoMo",
//   redirectUrl,
//   ipnUrl,
//   lang,
//   requestType,
//   autoCapture: true,
//   extraData: "",
//   orderGroupId: "",
//   signature
// });

// const createMomoPayment = async (amount, reservationCode) => {
//   const orderId = generateOrderId(reservationCode);
//   const requestId = generateRequestId(reservationCode);
//   const signature = createSignature({ amount, orderId, requestId });
//   const requestBody = createPaymentRequestBody({ amount, orderId, requestId, signature });

//   try {
//     const result = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody, {
//       headers: { "Content-Type": "application/json" },
//     });

//     const { resultCode, message } = result.data;
//     if (resultCode === 0) {
//       console.log("✅ MoMo payment success:", result.data);
//       return result.data;
//     } else {
//       console.error("❌ MoMo Error:", result.data);
//       throw new Error(`MoMo trả về lỗi (${resultCode}): ${message}`);
//     }
//   } catch (error) {
//     console.error("❌ Gửi yêu cầu MoMo thất bại:", error?.response?.data || error.message);
//     throw new Error(error?.response?.data?.message || error.message);
//   }
// };

// // === POST /api/public/payment ===
// router.post("/", async (req, res) => {
//   const { amount, reservationId, reservation_code } = req.body;

//   try {
//     const paymentResult = await createMomoPayment(amount, reservation_code);

//     // Tự động hủy sau 100 phút nếu chưa thanh toán
//     setTimeout(() => {
//       connection.query("SELECT status FROM reservations WHERE id = ?", [reservationId], (err, results) => {
//         if (err) return console.error("DB error:", err);
//         if (results.length > 0 && results[0].status !== 3) {
//           connection.query("UPDATE reservations SET status = 2 WHERE id = ?", [reservationId], err => {
//             if (err) return console.error("DB update error:", err);
//             console.log("🕒 Reservation status set to 2 (timeout)");
//           });
//         }
//       });
//     }, 100 * 60 * 1000); // 100 phút = 1h40

//     res.status(200).json(paymentResult); // Trả về URL thanh toán MoMo
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Lỗi server khi tạo thanh toán" });
//   }
// });

// // === POST /api/public/payment/get_pay_url ===
// router.post("/get_pay_url", async (req, res) => {
//   const { amount, reservationId } = req.body;

//   try {
//     const reservationCode = await new Promise((resolve, reject) => {
//       connection.query(
//         `SELECT reservation_code FROM reservations WHERE id = ?`,
//         [reservationId],
//         (err, results) => {
//           if (err) return reject(err);
//           resolve(results[0]?.reservation_code || null);
//         }
//       );
//     });

//     if (!reservationCode) {
//       reservationCode = generateReservationCode();
//       await new Promise((resolve, reject) => {
//         connection.query(
//           "UPDATE reservations SET reservation_code = ? WHERE id = ?",
//           [reservationCode, reservationId],
//           (err) => (err ? reject(err) : resolve())
//         );
//       });
//     }

//     const result = await createMomoPayment(amount, reservationCode);
//     res.status(200).json({ payUrl: result.payUrl }); // trả về URL thanh toán
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Không thể tạo link thanh toán" });
//   }
// });

// module.exports = router;



// const express = require("express");
// const axios = require("axios");
// const crypto = require("crypto");
// const { v4: uuidv4 } = require("uuid");
// const router = express.Router();
// const connection = require("../../index");

// // === MoMo Config ===
// const accessKey = process.env.MOMO_ACCESSKEY;
// const secretKey = process.env.MOMO_SECRETKEY;
// const redirectUrl = "http://localhost:3001/confirm"; // URL người dùng sẽ được chuyển hướng sau khi thanh toán
// const ipnUrl = `${process.env.LOCAL_URL}/api/public/payment/callback`; // URL nhận kết quả thanh toán từ MoMo
// const partnerCode = "MOMO";
// const partnerName = "Test";
// const storeId = "MomoTestStore";
// const requestType = "payWithMethod";
// const lang = "vi";

// // === Utility ===
// const generateReservationCode = () => `HS${Math.floor(10000000 + Math.random() * 90000000)}`;
// const generateOrderId = (reservationCode) => `${reservationCode}_${Date.now()}_${uuidv4()}`;
// const generateRequestId = (reservationCode) => `${reservationCode}_${Date.now()}_${uuidv4()}`;

// const createSignature = ({ amount, orderId, requestId }) => {
//   const rawSignature =
//     `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}` +
//     `&orderId=${orderId}&orderInfo=pay with MoMo&partnerCode=${partnerCode}` +
//     `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
//   return crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
// };

// const createPaymentRequestBody = ({ amount, orderId, requestId, signature }) => ({
//   partnerCode,
//   partnerName,
//   storeId,
//   requestId,
//   amount,
//   orderId,
//   orderInfo: "pay with MoMo",
//   redirectUrl,
//   ipnUrl,
//   lang,
//   requestType,
//   autoCapture: true,
//   extraData: "",
//   orderGroupId: "",
//   signature
// });

// const createMomoPayment = async (amount, reservationCode) => {
//   const orderId = generateOrderId(reservationCode);
//   const requestId = generateRequestId(reservationCode);
//   const signature = createSignature({ amount, orderId, requestId });
//   const requestBody = createPaymentRequestBody({ amount, orderId, requestId, signature });

//   try {
//     const result = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody, {
//       headers: { "Content-Type": "application/json" },
//     });

//     const { resultCode, message } = result.data;
//     if (resultCode === 0) {
//       console.log("✅ MoMo payment created successfully:", result.data);
//       return result.data;
//     } else {
//       console.error("❌ MoMo Error:", result.data);
//       throw new Error(`MoMo trả về lỗi (${resultCode}): ${message}`);
//     }
//   } catch (error) {
//     console.error("❌ Gửi yêu cầu MoMo thất bại:", error?.response?.data || error.message);
//     throw new Error(error?.response?.data?.message || error.message);
//   }
// };

// // === [1] POST /api/public/payment → Tạo thanh toán và setup timeout ===
// router.post("/", async (req, res) => {
//   const { amount, reservationId, reservation_code } = req.body;

//   try {
//     const paymentResult = await createMomoPayment(amount, reservation_code);

//     // Tự động hủy đơn sau 100 phút nếu chưa thanh toán
//     setTimeout(() => {
//       connection.query("SELECT status FROM reservations WHERE id = ?", [reservationId], (err, results) => {
//         if (err) return console.error("DB error:", err);
//         if (results.length > 0 && results[0].status !== 3) {
//           connection.query("UPDATE reservations SET status = 2 WHERE id = ?", [reservationId], err => {
//             if (err) return console.error("DB update error:", err);
//             console.log("🕒 Reservation status set to 2 (timeout)");
//           });
//         }
//       });
//     }, 100 * 60 * 1000); // 100 phút

//     res.status(200).json(paymentResult); // Trả về URL thanh toán
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Lỗi server khi tạo thanh toán" });
//   }
// });

// // === [2] POST /api/public/payment/get_pay_url → Lấy link thanh toán theo reservationId ===
// router.post("/get_pay_url", async (req, res) => {
//   const { amount, reservationId } = req.body;

//   try {
//     let reservationCode = await new Promise((resolve, reject) => {
//       connection.query(
//         `SELECT reservation_code FROM reservations WHERE id = ?`,
//         [reservationId],
//         (err, results) => {
//           if (err) return reject(err);
//           resolve(results[0]?.reservation_code || null);
//         }
//       );
//     });

//     if (!reservationCode) {
//       reservationCode = generateReservationCode();
//       await new Promise((resolve, reject) => {
//         connection.query(
//           "UPDATE reservations SET reservation_code = ? WHERE id = ?",
//           [reservationCode, reservationId],
//           (err) => (err ? reject(err) : resolve())
//         );
//       });
//     }

//     const result = await createMomoPayment(amount, reservationCode);
//     res.status(200).json({ payUrl: result.payUrl });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Không thể tạo link thanh toán" });
//   }
// });

// // === [3] POST /api/public/payment/callback → Nhận callback từ MoMo và cập nhật trạng thái ===
// router.post("/callback", (req, res) => {
//   const {
//     partnerCode,
//     orderId,
//     requestId,
//     amount,
//     orderInfo,
//     orderType,
//     transId,
//     resultCode,
//     message,
//     payType,
//     responseTime,
//     extraData,
//     signature
//   } = req.body;

//   console.log("🔄 MoMo callback received:", req.body);

//   // Tạo raw signature theo tài liệu MoMo (phải giống lúc gửi)
//   const rawSignature =
//     `&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}` +
//     `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
//     `&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}` +
//     `&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

//   const expectedSignature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

//   if (signature !== expectedSignature) {
//     console.warn("⚠️ Chữ ký callback không hợp lệ");
//     return res.status(400).json({ message: "Invalid signature" });
//   }

//   if (resultCode === 0) {
//     const reservationCode = orderId.split("_")[0];
//     connection.query(
//       "UPDATE reservations SET status = 3 WHERE reservation_code = ?",
//       [reservationCode],
//       (err) => {
//         if (err) {
//           console.error("❌ Lỗi khi cập nhật trạng thái:", err);
//           return res.status(500).json({ message: "Lỗi DB khi cập nhật trạng thái" });
//         }
//         console.log(`✅ Đã cập nhật trạng thái thành công cho ${reservationCode}`);
//         return res.status(200).json({ message: "Cập nhật trạng thái thành công" });
//       }
//     );
//   } else {
//     console.warn("⚠️ Giao dịch không thành công:", message);
//     return res.status(200).json({ message: "Giao dịch thất bại" });
//   }
// });

// // === [4] GET /api/public/payment/confirm → Xử lý redirectUrl từ MoMo sau khi người dùng thanh toán ===
// router.get("/confirm", (req, res) => {
//   const { orderId, errorCode, message } = req.query;

//   console.log("🔄 Redirect MoMo confirm received:", req.query);

//   if (errorCode === "0") {
//     // Thanh toán thành công
//     const reservationCode = orderId.split("_")[0];
//     connection.query(
//       "UPDATE reservations SET status = 3 WHERE reservation_code = ?",
//       [reservationCode],
//       (err) => {
//         if (err) {
//           console.error("❌ Lỗi cập nhật trạng thái trong confirm:", err);
//           return res.status(500).send("Lỗi server khi cập nhật trạng thái");
//         }
//         return res.send("Thanh toán thành công! Đơn hàng đã được cập nhật.");
//       }
//     );
//   } else {
//     // Thanh toán thất bại hoặc bị hủy
//     return res.send(`Thanh toán không thành công: ${message || "Lỗi không xác định"}`);
//   }
// });

// // === [5] GET /api/public/payment/status/:reservation_code → Lấy trạng thái đơn hàng ===
// router.get("/status/:reservation_code", (req, res) => {
//   const { reservation_code } = req.params;

//   connection.query(
//     "SELECT status FROM reservations WHERE reservation_code = ?",
//     [reservation_code],
//     (err, results) => {
//       if (err) {
//         console.error("❌ Lỗi truy vấn trạng thái:", err);
//         return res.status(500).json({ message: "Lỗi server" });
//       }

//       if (results.length === 0) {
//         return res.status(404).json
//         return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
//       }

//       // Trả về trạng thái đơn hàng
//       return res.status(200).json({ status: results[0].status });
//     }
//   );
// });

// module.exports = router;


const axios = require("axios");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
// const connection = require("../../index");
const { connection } = require('../../db');

var accessKey = process.env.MOMO_ACCESSKEY;
var secretKey = process.env.MOMO_SECRETKEY;

router.post("/", async (req, res) => {
  const { amount, reservationId, reservation_code } = req.body;
  var orderInfo = "pay with MoMo";
  var partnerCode = "MOMO";
  var redirectUrl = "http://localhost:3001/confirm";
  var ipnUrl = `${process.env.LOCAL_URL}/api/public/payment/callback`;
  var requestType = "payWithMethod";
  var orderId = reservation_code; // Sử dụng reservation_code
  var requestId = orderId;
  var extraData = "";
  var lang = "vi";

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: true,
    extraData: extraData,
    orderGroupId: "",
    signature: signature,
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    // Gửi yêu cầu thanh toán đến MoMo
    const result = await axios(options);

    // Đếm ngược thời gian 1 giờ 40 phút
    setTimeout(async () => {
      const checkStatusQuery = `SELECT status FROM reservations WHERE id = ?`;
      connection.query(
        checkStatusQuery,
        [reservationId],
        async (err, results) => {
          if (err) {
            console.error("Error checking reservation status:", err);
          } else if (results[0].status !== 3) {
            const updateStatusQuery = `UPDATE reservations SET status = 2 WHERE id = ?`;
            await new Promise((resolve, reject) => {
              connection.query(updateStatusQuery, [reservationId], (err) => {
                if (err) {
                  console.error("Error updating reservation status:", err);
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
            console.log("Reservation status updated to 2 due to timeout");
          }
        }
      );
    }, 100 * 60000); // 1 giờ 40 phút

    return res.status(200).json(result.data);
  } catch (error) {
    console.error("Error in MoMo payment request:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
});

router.post("/get_pay_url", async (req, res) => {
  const { amount, reservationId } = req.body;

  // Hàm tạo mã ngẫu nhiên với hai chữ HS và 8 chữ số cuối
  const generateReservationCode = () => {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Tạo số ngẫu nhiên gồm 8 chữ số
    return `HS${randomNumber}`;
  };

  try {
    // Kiểm tra xem mã đơn reservation_code đã tồn tại trong cơ sở dữ liệu hay chưa
    const checkQuery = `SELECT reservation_code FROM reservations WHERE id = ?`;
    const reservationCode = await new Promise((resolve, reject) => {
      connection.query(checkQuery, [reservationId], (err, results) => {
        if (err) {
          console.error("Error fetching reservation_code:", err);
          reject(err);
        } else if (results.length > 0 && results[0].reservation_code) {
          resolve(results[0].reservation_code); // Lấy mã reservation_code đã tồn tại
        } else {
          resolve(null); // Không có mã reservation_code
        }
      });
    });

    let reseCode;
    if (reservationCode) {
      reseCode = generateReservationCode();
      // Cập nhật reservation_code vào cơ sở dữ liệu
      const updateQuery = `UPDATE reservations SET reservation_code = ? WHERE id = ?`;
      await new Promise((resolve, reject) => {
        connection.query(updateQuery, [reseCode, reservationId], (err, results) => {
          if (err) {
            console.error("Error updating reservation_code:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    } else {
      reseCode = generateReservationCode();
      // Cập nhật reservation_code vào cơ sở dữ liệu
      const updateQuery = `UPDATE reservations SET reservation_code = ? WHERE id = ?`;
      await new Promise((resolve, reject) => {
        connection.query(updateQuery, [reseCode, reservationId], (err, results) => {
          if (err) {
            console.error("Error updating reservation_code:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    }

    var orderInfo = "pay with MoMo";
    var partnerCode = "MOMO";
    var redirectUrl = "http://localhost:3001/confirm";
    var ipnUrl = `${process.env.LOCAL_URL}/api/public/payment/callback`;
    var requestType = "payWithMethod";
    var requestId = reseCode;
    var extraData = "";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      reseCode +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;

    var signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: reseCode,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    // Gửi yêu cầu thanh toán đến MoMo
    const result = await axios(options);

    // Lấy payUrl từ phản hồi của MoMo
    const { payUrl } = result.data;

    console.log (result.data)

    // Trả về payUrl cho client
    return res.status(200).json({ payUrl });
  } catch (error) {
    console.error("Error in MoMo payment request:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
});

router.post("/pay_balance", async (req, res) => {
  const { amount, reservationId } = req.body;

  // Hàm tạo mã ngẫu nhiên với hai chữ HS và 8 chữ số cuối
  const generateReservationCode = () => {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Tạo số ngẫu nhiên gồm 8 chữ số
    return `HS${randomNumber}`;
  };

  try {
    // Kiểm tra xem mã đơn reservation_code đã tồn tại trong cơ sở dữ liệu hay chưa
    const checkQuery = `SELECT reservation_code FROM reservations WHERE id = ?`;
    const reservationCode = await new Promise((resolve, reject) => {
      connection.query(checkQuery, [reservationId], (err, results) => {
        if (err) {
          console.error("Error fetching reservation_code:", err);
          reject(err);
        } else if (results.length > 0 && results[0].reservation_code) {
          resolve(results[0].reservation_code); // Lấy mã reservation_code đã tồn tại
        } else {
          resolve(null); // Không có mã reservation_code
        }
      });
    });

    let reseCode;
    if (reservationCode) {
      reseCode = generateReservationCode();
      // Cập nhật reservation_code vào cơ sở dữ liệu
      const updateQuery = `UPDATE reservations SET reservation_code = ? WHERE id = ?`;
      await new Promise((resolve, reject) => {
        connection.query(updateQuery, [reseCode, reservationId], (err, results) => {
          if (err) {
            console.error("Error updating reservation_code:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    } else {
      reseCode = generateReservationCode();
      // Cập nhật reservation_code vào cơ sở dữ liệu
      const updateQuery = `UPDATE reservations SET reservation_code = ? WHERE id = ?`;
      await new Promise((resolve, reject) => {
        connection.query(updateQuery, [reseCode, reservationId], (err, results) => {
          if (err) {
            console.error("Error updating reservation_code:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    }

    var orderInfo = "pay with MoMo";
    var partnerCode = "MOMO";
    var redirectUrl = "http://localhost:5301/reservation";
    var ipnUrl = `${process.env.LOCAL_URL}/api/public/payment/callback`;
    var requestType = "payWithMethod";
    var requestId = reseCode;
    var extraData = "";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      reseCode +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;

    var signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: reseCode,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    // Gửi yêu cầu thanh toán đến MoMo
    const result = await axios(options);

    // Lấy payUrl từ phản hồi của MoMo
    const { payUrl } = result.data;

    // Trả về payUrl cho client
    return res.status(200).json({ payUrl });
  } catch (error) {
    console.error("Error in MoMo payment request:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
});

const updateReservationStatus = async (orderId) => {
  const getStatusQuery = `SELECT status, table_id FROM reservations WHERE reservation_code = ?`;
  const updateStatusQuery = `UPDATE reservations SET status = ? WHERE reservation_code = ?`;
  const updateTableStatusQuery = `UPDATE tables SET status = ? WHERE id = ?`;

  try {
    const { currentStatus, tableId } = await new Promise((resolve, reject) => {
      connection.query(getStatusQuery, [orderId], (err, results) => {
        if (err) {
          console.error("❌ Error fetching reservation status:", err);
          return reject(err);
        }
        if (results.length === 0) {
          console.warn("⚠️ Không tìm thấy đơn đặt chỗ với orderId:", orderId);
          return reject(new Error("Không tìm thấy đơn đặt chỗ."));
        }

        console.log("✅ Đã tìm thấy đơn đặt chỗ:", results[0]);
        resolve({
          currentStatus: results[0].status,
          tableId: results[0].table_id,
        });
      });
    });

    const newStatus = currentStatus == 4 ? 5 : 3;
    const newTableStatus = newStatus === 5 ? 1 : 0;

    console.log(`👉 Cập nhật trạng thái reservation: ${currentStatus} → ${newStatus}`);
    console.log(`👉 Cập nhật trạng thái bàn: ${tableId} → ${newTableStatus}`);

    // Cập nhật reservation
    await new Promise((resolve, reject) => {
      connection.query(updateStatusQuery, [newStatus, orderId], (err, result) => {
        if (err) {
          console.error("❌ Lỗi khi cập nhật trạng thái đơn:", err);
          return reject(err);
        }
        console.log(`✅ Đã cập nhật reservation_code=${orderId}, affectedRows=${result.affectedRows}`);
        resolve();
      });
    });

    // Cập nhật table
    await new Promise((resolve, reject) => {
      connection.query(updateTableStatusQuery, [newTableStatus, tableId], (err, result) => {
        if (err) {
          console.error("❌ Lỗi khi cập nhật trạng thái bàn:", err);
          return reject(err);
        }
        console.log(`✅ Đã cập nhật bàn table_id=${tableId}, affectedRows=${result.affectedRows}`);
        resolve();
      });
    });

    return { newStatus, newTableStatus };

  } catch (error) {
    console.error("❌ Lỗi trong updateReservationStatus:", error);
    throw error;
  }
};

router.post("/callback", async (req, res) => {
  console.log("📥 Đã nhận callback từ MoMo:");
  console.log(JSON.stringify(req.body, null, 2)); // log đẹp và rõ ràng

  const { resultCode, orderId, message } = req.body;

  console.log("📦 resultCode:", resultCode);
  console.log("📦 orderId:", orderId);
  console.log("📦 message:", message);

  try {
    if (resultCode === 0) {
      console.log("✅ Giao dịch thành công. Đang cập nhật CSDL...");

      const updated = await updateReservationStatus(orderId);

      return res.status(200).json({
        message: `🎉 Cập nhật trạng thái thành công.`,
        updated,
      });

    } else if (resultCode === 49) {
      console.log("⏰ Giao dịch đã quá hạn.");
      return res.status(400).json({ message: "⏰ Giao dịch đã quá hạn." });

    } else if (resultCode === 1001) {
      console.log("❌ Giao dịch bị hủy bởi người dùng.");
      return res.status(400).json({ message: "❌ Giao dịch đã bị hủy bởi người dùng." });

    } else {
      console.log("❌ Giao dịch thất bại với mã:", resultCode);
      return res.status(400).json({ message: `❌ Giao dịch thất bại: resultCode = ${resultCode}` });
    }

  } catch (error) {
    console.error("❌ Lỗi xử lý callback:", error);
    return res.status(500).json({ message: "Lỗi máy chủ khi xử lý callback.", error: error.message });
  }
});


router.post("/transaction-status", async (req, res) => {
  const { orderId } = req.body;

  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId,
    signature,
    lang: "vi",
  });

  //options for axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };

  let result = await axios(options);

  return res.status(200).json(result.data);
});

module.exports = router;
