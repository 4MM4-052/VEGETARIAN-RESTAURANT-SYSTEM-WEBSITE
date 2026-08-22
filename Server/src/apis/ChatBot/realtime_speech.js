const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

function processChatbotMessage(message) {
    const normalizedMessage = normalizeVietnamese(message);
    const tokens = vietnameseTokenizer(normalizedMessage);

    let bestMatch = {
        pattern: null,
        score: 0
    };

    for (const pattern of chatbotPatterns) {
        const score = pattern.keywords.reduce((acc, keyword) => {
            const normalizedKeyword = normalizeVietnamese(keyword);
            const keywordTokens = vietnameseTokenizer(normalizedKeyword);
            // Kiểm tra xem tất cả các token của từ khóa có trong message không
            const isMatch = keywordTokens.every(token => tokens.includes(token));
            return acc + (isMatch ? 1 : 0);
        }, 0);

        if (score > bestMatch.score) {
            bestMatch = { pattern, score };
        }
    }

    if (bestMatch.score > 0) {
        return {
            response: bestMatch.pattern.response,
            endConversation: bestMatch.pattern.endConversation || false
        };
    }

    return {
        response: `Xin lỗi, tôi chỉ là chatbot hỗ trợ những vấn đề cơ bản như hỏi thông tin địa chỉ cửa hàng,...Nếu bạn cần được tư vấn kĩ hơn vui lòng nhập đúng từ khóa "gặp nhân viên" để được hỗ trợ`,
        endConversation: false
    };
}

wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket');

    ws.on('message', async (message) => {
        // message ở đây là audio Base64 từ client
        const audioBuffer = Buffer.from(message, 'base64');
        const tmpPath = './tmp/audio.wav';
        fs.writeFileSync(tmpPath, audioBuffer);

        try {
            // Gọi Whisper để transcribe audio
            const transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(tmpPath),
                model: 'whisper-1'
            });

            const textMessage = transcription.text;
            const response = processChatbotMessage(textMessage);

            ws.send(JSON.stringify({
                userText: textMessage,
                botResponse: response.response
            }));

        } catch (err) {
            console.error(err);
            ws.send(JSON.stringify({ error: 'STT error' }));
        } finally {
            fs.unlinkSync(tmpPath); // xóa tạm
        }
    });

    ws.on('close', () => console.log('Client disconnected'));
});

server.listen(3001, () => {
    console.log('Server listening on http://localhost:3001');
});
