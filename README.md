# VEGETARIAN-RESTAURANT-SYSTEM-WEBSITE
Hệ thống được thiết kế và phát triển theo kiến trúc RESTful API, sử dụng công nghệ NodeJS cho Backend nhằm xử lý hiệu quả các yêu cầu như đặt bàn, gọi món, quản lý đơn hàng và thanh toán trực tuyến. Frontend được xây dựng bằng ReactJS, mang lại giao diện trực quan, thân thiện và dễ sử dụng. Dữ liệu được lưu trữ bằng MySQL, đảm bảo việc quản lý thông tin ổn định, chính xác và đáng tin cậy.

> ### **Key Features:**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  **1. User**
-	Chức năng **đăng nhập, đăng ký, đăng xuất**
-	**Tích hợp bản đồ Google Map** để hỗ trợ khách tìm đường đến nhà hàng
-	**Gửi Mail** liên hệ với nhà hàng nếu có vấn đề hay thắc mắc cần hỗ trợ giải đáp 
-	**Bình luận** dưới các bài viết để tăng tính tương tác
-	**Đặt bàn trực tuyến**
-	**Chọn món ăn & thanh toán cọc qua ví MoMo** sau khi đặt bàn thành công.
-	**Theo dõi và quản lý các đơn hàng** đã đặt, xem chi tiết trạng thái và lịch sử.
-	**Cập nhật và quản lý hồ sơ cá nhân** (tên, số điện thoại, email, ảnh đại diện,…)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  **2. Admin**
##### -	Thêm / Sửa / Xoá / Cập nhật các nội dung như:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Món ăn
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Bài viết - blog
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Chương trình khuyến mãi
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Tài khoản người dùng
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Bàn ăn 
##### -	Phân quyền vai trò người dùng (Admin, nhân viên viết bài, nhân viên bếp, nhân viên sự kiện …)
##### -	Quản lý đặt bàn
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Theo dõi & duyệt trạng thái đơn đặt
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Theo dõi trạng thái bàn: 
##### -	Quản lý báo cáo tổng hợp  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Số lượng tài khoản
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Số lượng bài viết
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Số lượng món ăn
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Số lượng danh mục
-	Thống kê hóa đơn và phân loại theo từng trạng thái mỗi tháng.
-	Thống kê doanh thu theo từng tháng, từng năm


> ### **Technologies Used::**
-	Frontend: ReactJS, HTML, CSS, JavaScript
-	Backend: NodeJS, Express
-	Cơ sở dữ liệu: MySQL


> ### **Cách hoạt động của các tính năng:**
#### - Mô tả cách hoạt động tổng quát:
  <img width="699" height="408" alt="image" src="https://github.com/user-attachments/assets/3efc5a77-9584-45e6-ab5b-afc11da5fa4b" />

 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Khi người dùng tương tác và phát sinh Actions, Redux sẽ thông qua dispatch (gửi đi) để kích hoạt action tương ứng. Action này sẽ được reducer xử lý, cập nhật lại store, và giao diện được cập nhật theo trạng thái mới.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Redux Thunk là một middleware (phần mềm trung gian) mở rộng cho Redux, cho phép xử lý các hành động bất đồng bộ như gọi API. Thay vì trả về một object thông thường, Redux Thunk cho phép action trả về là một hàm. Middleware này sẽ “chặn” action dạng hàm, thực thi logic bất đồng bộ bên trong (ví dụ: axios.get), rồi sau đó mới dispatch một action thông thường đến reducer khi có kết quả. Nhờ đó, các component có thể xử lý luồng dữ liệu bất đồng bộ một cách mạch lạc và hiệu quả hơn

#### - Ví dụ về Cài đặt tính năng **tạo đơn đặt bàn** ở frontend và backend:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Cấu trúc thư mục cần thiết tại backend bao gồm:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;src/ apis/  reservations.api.js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Cấu trúc thư mục cần thiết tại frontend bao gồm:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;src/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Actions/ ReservationActions.js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pages/ Client/ Order.js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reducers/ ReservationReducers.js  

#### - Giải thích
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Actions: Các "tín hiệu" cho biết cần thay đổi dữ liệu gì (Thêm, Xóa, Cập Nhật,...)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Reducers: Các hàm xử lý **Actions** và cập nhật lại trạng thái mới.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; •	Pages: Trang giao diện để thực hiện các **Actions** và **hiển thị các thông báo trạng thái** khi đã cập nhật thành công.


## Presenting some features:
### 1. Admin - Ví dụ mẫu 4 trang nhỏ 
#### Giao diện trang Thống Kê
  <img width="853" height="367" alt="image" src="https://github.com/user-attachments/assets/f393aef0-48f5-425f-a64d-17497af58ea5" />

 
#### Giao diện trang Món Ăn
  <img width="931" height="549" alt="image" src="https://github.com/user-attachments/assets/f30f9a41-dac8-42d2-b528-ae79abd213dc" />


#### Giao diện trang Bàn Ăn
  <img width="951" height="427" alt="image" src="https://github.com/user-attachments/assets/e54b6cca-8663-46bf-8e97-1b171d6e12cf" />


#### Giao diện trang Đơn Đặt Bàn
  <img width="944" height="498" alt="image" src="https://github.com/user-attachments/assets/ea3905a2-8ea3-4bb3-8147-f4a72222578c" />




### 2. User - Ví dụ mẫu 1 số trang nhỏ
#### Giao diện trang Trang Chủ
  <img width="862" height="472" alt="image" src="https://github.com/user-attachments/assets/e118200b-033b-4f75-aaa6-f81ec5e49294" />


#### Giao diện trang Menu Nhà Hàng - Chi Tiết Món Ăn
  <img width="857" height="445" alt="image" src="https://github.com/user-attachments/assets/1f5d5549-4e03-42e3-9ca5-a0b674007d30" />

  <img width="854" height="395" alt="image" src="https://github.com/user-attachments/assets/ec31f4cc-9d7d-4ade-b205-b79bf3954198" />


#### Giao diện trang Bài Viết - Bình Luận
  <img width="837" height="425" alt="image" src="https://github.com/user-attachments/assets/3faa9620-a035-47d0-8a68-6e0a92f4817b" />

  <img width="803" height="250" alt="image" src="https://github.com/user-attachments/assets/8578c209-3f7e-4a98-a8e9-d79c8258d0f4" />



#### Giao diện trang Địa chỉ - Gửi Mail
  <img width="855" height="426" alt="image" src="https://github.com/user-attachments/assets/b3849d53-93be-48dd-9c48-a7a9e9fdb1c3" />


#### Giao diện trang Đặt Bàn - Thanh Toán
  <img width="889" height="391" alt="image" src="https://github.com/user-attachments/assets/3421ebca-66a5-4ba2-bb48-39a4fcd4c0a7" />

  <img width="896" height="438" alt="image" src="https://github.com/user-attachments/assets/80ada498-c1fb-4e3d-9f57-f71113119d96" />

  <img width="915" height="523" alt="image" src="https://github.com/user-attachments/assets/66c86096-07fd-46af-a7d5-7fa459d3f4ce" />

  <img width="839" height="392" alt="image" src="https://github.com/user-attachments/assets/9c50f3ea-e35c-4972-a69c-1365dcf8d8f3" />

