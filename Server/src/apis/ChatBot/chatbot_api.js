// const natural = require('natural');
// const tokenizer = new natural.WordTokenizer();
// // API endpoint cho chatbot
// const express = require('express');
// const router = express.Router();

// function vietnameseTokenizer(text) {
//     // Tách các từ bằng khoảng trắng và giữ nguyên dấu
//     return text.split(/\s+/).filter(word => word.length > 0);
// }

// function normalizeVietnamese(str) {
//     return str.normalize('NFC').toLowerCase();
// }


// const chatbotPatterns = [
//     {
//         keywords: ['xin chào', 'chào', 'hi', 'hello', 'hey', 'alo', 'chào bạn', 'cho hỏi', 'cho mình hỏi', 'cho tôi hỏi'],
//         response: "Xin chào! Rất vui được gặp bạn. Tôi có thể giúp gì cho bạn hôm nay?",
//         endConversation: false
//     },
//     {
//         keywords: ['địa chỉ', 'ở đâu', 'chỗ nào', 'đường nào', 'quận nào', 'khu nào', 'vị trí', 'địa điểm', 'tới', 'đến', 'tìm đường'],
//         response: "Địa chỉ nhà hàng Hương Sen nằm ở 319/22 Lê Văn Thọ, P.8, Q.Gò Vấp, Thành phố Hồ Chí Minh.",
//         endConversation: false
//     },
//     {
//         keywords: ['giờ hoạt động', 'giờ mở cửa', 'mở cửa', 'đóng cửa', 'mấy giờ', 'khi nào', 'thời gian', 'còn mở không', 'còn phục vụ không'],
//         response: "Nhà hàng chúng tôi mở cửa từ 8h-22h từ thứ 2 đến thứ 6 & từ 10h-23h thứ 7 và chủ nhật, mở cả trong các ngày lễ, Tết.",
//         endConversation: false
//     },
//     {
//         keywords: ['liên hệ', 'số điện thoại', 'sđt', 'phone', 'email', 'gọi', 'hotline', 'zalo', 'facebook'],
//         response: "Bạn có thể liên hệ với chúng tôi qua:\n- Số điện thoại: 096.698.2676\n- Email: huongsen@gmail.com\n- Facebook: facebook.com/huongsen\n- Zalo: 096.698.2676",
//         endConversation: false
//     },
//     {
//         keywords: ['menu', 'thực đơn', 'món ăn', 'đồ ăn', 'có món gì', 'món nào', 'các món', 'món đặc trưng', 'món đặc sản', 'specialties'],
//         response: "Nhà hàng chúng tôi chuyên phục vụ các món CHAY tinh túy, kết hợp hài hòa giữa tinh hoa ẩm thực Việt Nam và các quốc gia Á Đông, mang đến thực đơn phong phú, hấp dẫn và đầy sáng tạo.\n\nBạn có thể xem menu đầy đủ tại website: http://localhost:3001/menu",
//         endConversation: false
//     },
//     {
//         keywords: ['giá', 'bảng giá', 'chi phí', 'giá cả', 'giá tiền', 'bao nhiêu tiền', 'cost', 'price'],
//         response: "Giá các món ăn của chúng tôi:\n- Món khai vị: 45.000đ - 75.000đ\n- Món chính: 45.000đ - 100.000đ\n- Lẩu: 150.000đ - 400.000đ\n- Set menu nhóm (4-6 người): 500.000đ - 1.200.000đ",
//         endConversation: false
//     },
//     {
//         keywords: ['đặt bàn', 'book bàn', 'reservation', 'đặt chỗ', 'giữ chỗ', 'đặt trước', 'book', 'còn bàn'],
//         response: "Để đặt bàn, bạn vui lòng cung cấp các thông tin:\n- Ngày giờ dự kiến\n- Số lượng khách\n- Số điện thoại liên hệ\n\nHoặc gọi trực tiếp số 096.698.2676 để được hỗ trợ nhanh nhất.",
//         endConversation: false
//     },
//     {
//         keywords: ['parking', 'đậu xe', 'gửi xe', 'bãi xe', 'để xe', 'chỗ để xe'],
//         response: "Nhà hàng có bãi đậu xe rộng rãi, miễn phí cho cả xe máy và ô tô ngay tại tầng hầm của tòa nhà.",
//         endConversation: false
//     },
//     {
//         keywords: ['thanh toán', 'payment', 'trả tiền', 'card', 'thẻ', 'tiền mặt', 'chuyển khoản'],
//         response: "Nhà hàng chấp nhận các hình thức thanh toán:\n- Tiền mặt\n- Thẻ ngân hàng (Visa, Master, JCB)\n- Ví điện tử (Momo, ZaloPay, VNPay)\n- Chuyển khoản ngân hàng",
//         endConversation: false
//     },
//     {
//         keywords: ['tiệc', 'tổ chức tiệc', 'đặt tiệc', 'sinh nhật', 'liên hoan', 'party', 'sự kiện', 'event'],
//         response: "Nhà hàng nhận đặt tiệc:\n- Sức chứa: 10-200 khách\n- Loại tiệc: Sinh nhật, Liên hoan, Công ty, Gia đình\n- Có menu và không gian riêng cho tiệc\n- Ưu đãi đặc biệt cho nhóm trên 50 khách\n\nVui lòng liên hệ trước 2-3 ngày để được tư vấn và sắp xếp.",
//         endConversation: false
//     },
//     {
//         keywords: ['wifi', 'internet', 'mạng', 'wifi password', 'pass wifi'],
//         response: "Nhà hàng có wifi miễn phí cho khách hàng. Bạn có thể hỏi nhân viên để được cung cấp mật khẩu wifi.",
//         endConversation: false
//     },
//     {
//         keywords: ['khuyến mãi', 'ưu đãi', 'giảm giá', 'voucher', 'promotion', 'discount'],
//         response: "Các chương trình khuyến mãi hiện tại:\n- Giảm 10% tổng hóa đơn cho khách hàng mới\n- Giảm 15% cho nhóm trên 10 người\n- Tặng món tráng miệng cho khách đặt tiệc\n\nTheo dõi Facebook của nhà hàng để cập nhật khuyến mãi mới nhất.",
//         endConversation: false
//     },
//     {
//         keywords: ['gặp nhân viên', 'tư vấn', 'hỗ trợ', 'gặp nhân viên tư vấn', 'gặp tư vấn viên'],
//         response: "Để gặp nhân viên tư vấn, vui lòng để lại số điện thoại. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.",
//         endConversation: true
//     },
//     {
//         keywords: ['tạm biệt', 'cảm ơn', 'bye', 'goodbye', 'gặp lại', 'hẹn gặp lại'],
//         response: "Cảm ơn bạn đã liên hệ. Chúc bạn một ngày tốt lành!",
//         endConversation: true
//     }
// ];

// function processChatbotMessage(message) {
//     const normalizedMessage = normalizeVietnamese(message);
//     const tokens = vietnameseTokenizer(normalizedMessage);

//     let bestMatch = {
//         pattern: null,
//         score: 0
//     };

//     for (const pattern of chatbotPatterns) {
//         const score = pattern.keywords.reduce((acc, keyword) => {
//             const normalizedKeyword = normalizeVietnamese(keyword);
//             const keywordTokens = vietnameseTokenizer(normalizedKeyword);
//             // Kiểm tra xem tất cả các token của từ khóa có trong message không
//             const isMatch = keywordTokens.every(token => tokens.includes(token));
//             return acc + (isMatch ? 1 : 0);
//         }, 0);

//         if (score > bestMatch.score) {
//             bestMatch = { pattern, score };
//         }
//     }

//     if (bestMatch.score > 0) {
//         return {
//             response: bestMatch.pattern.response,
//             endConversation: bestMatch.pattern.endConversation || false
//         };
//     }

//     return {
//         response: `Xin lỗi, tôi chỉ là chatbot hỗ trợ những vấn đề cơ bản như hỏi thông tin địa chỉ cửa hàng,...Nếu bạn cần được tư vấn kĩ hơn vui lòng nhập đúng từ khóa "gặp nhân viên" để được hỗ trợ`,
//         endConversation: false
//     };
// }

// router.post('/', (req, res) => {
//     try {
//         const { message } = req.body;
//         if (!message || typeof message !== 'string') {
//             return res.status(400).json({ error: 'Invalid message format' });
//         }
//         const response = processChatbotMessage(message);
//         res.json({ response });
//     } catch (error) {
//         console.error('Error processing chatbot message:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const axios = require('axios');

// =========================
// TEXT PROCESSING
// =========================

function vietnameseTokenizer(text) {
    return text.split(/\s+/).filter(word => word.length > 0);
}

function normalizeVietnamese(str) {
    return str.normalize('NFC').toLowerCase();
}

// =========================
// KEYWORD BOT (LOCAL)
// =========================

const chatbotPatterns = [
    {
        keywords: ['xin chào', 'chào', 'hello', 'hi'],
        response: "Xin chào! Rất vui được gặp bạn 😊",
        endConversation: false
    },
    {
        keywords: ['địa chỉ', 'ở đâu', 'đường nào'],
        response: "Nhà hàng ở 319/22 Lê Văn Thọ, Gò Vấp, TP.HCM.",
        endConversation: false
    },
    {
        keywords: ['giờ mở cửa', 'mấy giờ'],
        response: "Nhà hàng mở cửa từ 8h - 22h mỗi ngày.",
        endConversation: false
    },
    {
        keywords: ['menu', 'món ăn'],
        response: "Bạn xem menu tại: http://localhost:3001/menu",
        endConversation: false
    },
    {
        keywords: ['giá', 'bao nhiêu tiền'],
        response: "Giá dao động từ 45.000đ - 400.000đ tùy món.",
        endConversation: false
    },
    {
        keywords: ['gặp nhân viên', 'tư vấn', 'hỗ trợ'],
        response: "Bạn sẽ được chuyển sang nhân viên hỗ trợ ngay bây giờ.",
        endConversation: true
    },
    {
        keywords: ['cảm ơn', 'bye'],
        response: "Cảm ơn bạn! Hẹn gặp lại 😊",
        endConversation: true
    }
];

// =========================
// KEYWORD MATCHING
// =========================

function processChatbotMessage(message) {
    const normalizedMessage = normalizeVietnamese(message);
    const tokens = vietnameseTokenizer(normalizedMessage);

    let bestMatch = { pattern: null, score: 0 };

    for (const pattern of chatbotPatterns) {
        const score = pattern.keywords.reduce((acc, keyword) => {
            const keywordTokens = vietnameseTokenizer(normalizeVietnamese(keyword));
            const isMatch = keywordTokens.every(token => tokens.includes(token));
            return acc + (isMatch ? 1 : 0);
        }, 0);

        if (score > bestMatch.score) {
            bestMatch = { pattern, score };
        }
    }

    return bestMatch.score > 0 ? bestMatch.pattern : null;
}

// =========================
// SIMPLE FALLBACK
// =========================

function simpleFallback(message) {
    const msg = message.toLowerCase();

    if (msg.includes('chào')) {
        return {
            response: "Xin chào! Mình có thể giúp gì cho bạn?",
            endConversation: false
        };
    }

    return null;
}

// =========================
// MAIN API
// =========================

router.post('/', async (req, res) => {
    try {
        const { message, sender } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // =========================
        // 1. GỌI RASA
        // =========================
        try {
            const rasaRes = await axios.post(
                'http://localhost:5005/webhooks/rest/webhook',
                {
                    sender: sender || "user1",
                    message: message
                }
            );

            const rasaMessages = rasaRes.data;

            if (rasaMessages && rasaMessages.length > 0) {

                const text = rasaMessages
                    .map(m => m.text)
                    .filter(Boolean)
                    .join("\n");

                const image = rasaMessages.find(m => m.image)?.image || null;

                const endConversation = rasaMessages.some(
                    m => m.custom && m.custom.endConversation === true
                );

                return res.json({
                    response: text,
                    image: image, // ✅ THÊM DÒNG NÀY
                    endConversation
                });
            }

        } catch (err) {
            console.log("⚠️ Rasa lỗi → dùng local bot");
        }

        // =========================
        // 2. KEYWORD BOT (LOCAL)
        // =========================
        const keywordResult = processChatbotMessage(message);

        if (keywordResult) {
            return res.json({
                response: keywordResult.response,
                endConversation: keywordResult.endConversation
            });
        }

        // =========================
        // 3. SIMPLE FALLBACK
        // =========================
        const fallback = simpleFallback(message);

        if (fallback) {
            return res.json(fallback);
        }

        // =========================
        // 4. DEFAULT RESPONSE
        // =========================
        return res.json({
            response: "Xin lỗi mình chưa hiểu 😅 Bạn thử hỏi về menu, giá hoặc địa chỉ nhé!",
            endConversation: false
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;