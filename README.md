# Thông Tin Sinh Viên
### Họ Tên: Trần Trương Ngọc Uyển
### MSSV: B2207576
### Đồ án niên luận ngành Khoa Học Máy Tính

# 🌱 VEGETARIAN RESTAURANT SYSTEM WEBSITE
## Website đặt chỗ nhà hàng chay tích hợp Chatbot AI và hệ thống phân tích đánh giá khách hàng

Hệ thống được xây dựng nhằm hỗ trợ khách hàng trong quá trình tìm kiếm thông tin, đặt chỗ và tương tác trực tuyến với nhà hàng chay thông qua **AI Chatbot**. 

Bên cạnh đó, hệ thống ứng dụng các kỹ thuật **Natural Language Processing (NLP)** và **Machine Learning** để tự động phân tích đánh giá khách hàng, dự đoán mức độ hài lòng, trích xuất các yếu tố ảnh hưởng đến trải nghiệm và đưa ra đề xuất cải thiện dịch vụ.

Hệ thống được xây dựng theo kiến trúc **RESTful API**, kết hợp giữa **FastAPI Backend**, **Rasa NLU Chatbot**, **PhoBERT Feature Extraction** và các mô hình học máy nhằm tạo ra một nền tảng nhà hàng thông minh.


## 🎥 Demo

| Chức năng | Liên kết |
|-----------|----------|
| 🤖 Chatbot AI hỗ trợ khách hàng | https://drive.google.com/file/d/1LVpqP2uYXjG9FVpJrQNUkF42ssD8_qBZ/view?usp=drive_link |
| ⭐ Phân loại đánh giá khách hàng | https://drive.google.com/file/d/1TWg0rCa2xee1j0QZgR6TFFNkEZWgsZHH/view?usp=drive_link |
| 🏠 Giao diện người dùng | https://drive.google.com/file/d/1NeDJBXgLW6dH_ZG8c0PpAa7zoYhvxhfx/view?usp=drive_link |
| ⚙️ Giao diện quản trị | https://drive.google.com/file/d/12Tc13o4eUP4tjjIu0m4SOdSDUfPyj8Eg/view?usp=drive_link |


## 🛠 Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Backend | Python, FastAPI RESTful API |
| Database | MySQL |
| Conversational AI | Rasa NLU |
| NLP | PhoBERT-base |
| Machine Learning | SVM, Random Forest, Logistic Regression |
| Text Processing | Tokenization, Layer-wise Pooling, Sentence Embedding |


## ✨ Chức năng chính

- Đặt chỗ trực tuyến tại nhà hàng chay.
- Tra cứu thông tin món ăn và thực đơn.
- Chatbot AI hỗ trợ khách hàng 24/7.
- Nhận diện ý định người dùng và trích xuất thông tin trong hội thoại.
- Phân tích đánh giá khách hàng tự động.
- Phân loại cảm xúc: Tiêu cực / Trung lập / Tích cực.
- Dự đoán mức đánh giá từ 1 đến 5 sao.
- Trích xuất các cụm từ quan trọng ảnh hưởng đến trải nghiệm khách hàng.
- Sinh đề xuất cải thiện dịch vụ dựa trên phản hồi thực tế.

# 🧠 Xây dựng hệ thống phân tích đánh giá khách hàng

### 1. Kiến trúc tổng thể

Hệ thống được xây dựng theo mô hình Pipeline gồm ba giai đoạn chính:

- Tiền xử lý dữ liệu văn bản.
- Trích xuất đặc trưng bằng PhoBERT.
- Huấn luyện mô hình Machine Learning và sinh kết quả phân tích.

### Pipeline hệ thống
<img width="899" height="340" alt="image" src="https://github.com/user-attachments/assets/b4f229d5-1f25-46ec-b8c5-c52786ea613f" />  

### 2. Trích xuất đặc trưng văn bản với PhoBERT

Hệ thống sử dụng phương pháp **Transfer Learning** với mô hình **PhoBERT-base** nhằm chuyển đổi văn bản đánh giá thành các vector biểu diễn giàu ngữ nghĩa.

Quy trình thực hiện:

- Tokenization bằng PhoBERT Tokenizer.
- Ánh xạ token thành vector embedding 768 chiều.
- Trích xuất đặc trưng từ các tầng Encoder cuối.
- Áp dụng Mean Pooling để tạo Sentence Embedding.
- Sử dụng vector đặc trưng làm đầu vào cho các mô hình phân loại.

<img width="749" height="691" alt="image" src="https://github.com/user-attachments/assets/867a6234-a6f3-4784-99e6-1fa1908917b4" />

### 3. Phân loại cảm xúc theo cấp bậc

Để tối ưu độ chính xác và giảm sự nhầm lẫn giữa các mức đánh giá có đặc điểm tương đồng, hệ thống áp dụng phương pháp phân loại hai giai đoạn:
#### Giai đoạn 1: Phân loại cảm xúc
- Tiêu cực
- Trung lập
- Tích cực
#### Giai đoạn 2: Phân loại mức độ đánh giá
- 1-2 sao: Không hài lòng
- 3 sao: Bình thường
- 4-5 sao: Hài lòng
  
<img width="725" height="619" alt="image" src="https://github.com/user-attachments/assets/c6778339-1106-4371-b2ec-d93016dcb6c7" />

### 4. Trích xuất cụm từ đặc trưng và đề xuất cải thiện

Sau khi dự đoán mức độ hài lòng, hệ thống tiếp tục phân tích nội dung đánh giá để tìm ra các yếu tố ảnh hưởng đến trải nghiệm khách hàng.
Quy trình:  
Hệ thống gồm hai thành phần chính:
- **Salient Phrase Extraction**
  - Xác định các cụm từ quan trọng ảnh hưởng đến kết quả dự đoán.
- **Improvement Recommendation**
  - Ánh xạ cụm từ đặc trưng sang các giải pháp cải thiện dịch vụ.

<img width="947" height="850" alt="image" src="https://github.com/user-attachments/assets/af25e79b-6215-4e71-97b8-646f8bf79e5e" />  

# 🤖 Xây dựng Chatbot AI với Rasa NLU

## Kiến trúc chatbot

Chatbot được phát triển dựa trên nền tảng **Rasa NLU**, cho phép xử lý hội thoại bằng ngôn ngữ tự nhiên.

Quy trình xây dựng:  
<img width="876" height="507" alt="image" src="https://github.com/user-attachments/assets/d53aea83-0697-45c4-b798-3446443f0bd9" />  

## Các thành phần chatbot

### Intent Recognition
Xác định mục đích của khách hàng:
- Hỏi thông tin món ăn.
- Tìm kiếm thực đơn.
- Hỏi chính sách nhà hàng.
- Đặt món.
- Đặt bàn.

### Entity Extraction
Trích xuất thông tin quan trọng:
- Tên món ăn.
- Khoảng giá.
- Loại món.
- Thông tin đặt bàn.

### Dialogue Management
Xây dựng hội thoại bằng:
- Rule-based Conversation.
- Story-based Conversation.

### Action Processing
Chatbot hỗ trợ ba loại hành động:
- Default Actions.
- Utter Actions.
- Custom Actions.

# 📈 Kết quả thực nghiệm
### Phân loại đánh giá  
| Mô hình | Độ chính xác |
|---------|-------------:|
| SVM - Sentiment Classification | **96,38%** |
| Random Forest - Negative Reviews (1-2 sao) | **94,66%** |
| Logistic Regression - Positive Reviews (4-5 sao) | **95,09%** |

### Chatbot
Độ chính xác theo Accuracy  
<img width="670" height="325" alt="image" src="https://github.com/user-attachments/assets/4e968adf-3264-45e8-96de-eb847ad0796c" />  

Độ chính xác theo F1-score    
<img width="735" height="400" alt="image" src="https://github.com/user-attachments/assets/2368d353-5cf1-4407-972d-64e0b8da4c79" />  

Hiệu suất tổng thể mô hình  
<img width="667" height="427" alt="image" src="https://github.com/user-attachments/assets/17691a5f-815d-46dc-9deb-ddeb19c328e0" />



# 🌟 Điểm nổi bật của dự án
- Kết hợp **Conversational AI** và **Sentiment Analysis** trong cùng một hệ thống.
- Ứng dụng **PhoBERT** để khai thác đặc trưng ngữ nghĩa tiếng Việt.
- Phân tích không chỉ mức độ hài lòng mà còn nguyên nhân ảnh hưởng đến trải nghiệm khách hàng.
- Tự động sinh đề xuất cải thiện dịch vụ dựa trên dữ liệu đánh giá.
- Xây dựng nền tảng nhà hàng chay thông minh hỗ trợ khách hàng và doanh nghiệp.











