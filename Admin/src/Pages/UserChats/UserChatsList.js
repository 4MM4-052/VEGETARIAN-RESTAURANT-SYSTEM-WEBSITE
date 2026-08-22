// import React, { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   getDocs,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
//   deleteDoc,
//   doc,
//   updateDoc,
//   setDoc,
//   limit,
// } from "firebase/firestore";
// import { db } from "../../Config/Firebase";
// import Picker from "emoji-picker-react";
// import DialogConfirm from "../../Components/Dialog/Dialog";
// import { SuccessAlert } from "../../Components/Alert/Alert";
// import CustomSpinner from "../../Components/Spinner/CustomSpinner";
// import defaultAvatar from "../../Assets/Images/profile-icon.png"
// import axios from 'axios';
// import { CircularProgress } from '@mui/material';
// import { createPortal } from "react-dom";

// export default function UserChatsList() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [messages, setMessages] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [newMessage, setNewMessage] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [chatToDelete, setChatToDelete] = useState(null);
//   const [openSuccess, setOpenSuccess] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const typingTimeoutRef = useRef(null);
//   const typingDocRef = useRef(null);
//   const emojiPickerRef = useRef(null);
//   const [chatMode, setChatMode] = useState('human'); // 'bot' hoặc 'human'
//   const [endedChats, setEndedChats] = useState({});
//   const [isDeleting, setIsDeleting] = useState(false);

//   const selectedAdminUser = JSON.parse(localStorage.getItem("user_admin"));

//   // Lấy tất cả tin nhắn và nhóm chúng
//   useEffect(() => {
//     const unsubscribe = onSnapshot(
//       query(collection(db, "messages"), orderBy("timestamp", "asc")),
//       (querySnapshot) => {
//         const messagesData = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//           timestamp: doc.data().timestamp?.toDate() || new Date(),
//         }));

//         // Nhóm tin nhắn theo chatId
//         const groupedMessages = messagesData.reduce((acc, message) => {
//           if (message.isTypingIndicator) return acc; // Bỏ qua tin nhắn đang nhập

//           const key = message.chatId;
//           if (!acc[key]) {
//             acc[key] = {
//               chatId: message.chatId,
//               uid: message.uid,
//               fullname: message.fullname,
//               tel: message.tel,
//               messages: [],
//               timestamp: message.timestamp,
//               lastMessage: message.text,
//               lastMessageRole: message.role,
//             };
//           }
//           acc[key].messages.push(message);
//           // Cập nhật timestamp và lastMessage nếu tin nhắn này mới hơn
//           if (message.timestamp > acc[key].timestamp && !message.isTypingIndicator) {
//             acc[key].timestamp = message.timestamp;
//             acc[key].lastMessage = message.text;
//             acc[key].lastMessageRole = message.role;
//           }
//           return acc;
//         }, {});

//         // Sắp xếp các nhóm tin nhắn theo timestamp mới nhất
//         const sortedGroupedMessages = Object.values(groupedMessages)
//           .sort((a, b) => b.timestamp - a.timestamp)
//           .map((group) => ({
//             ...group,
//             // Lấy thông tin của tin nhắn khách hàng gần nhất
//             customerInfo:
//               group.messages.find(
//                 (msg) => msg.role === "customer" && msg.chatId === group.chatId
//               ) || {},
//           }));

//         setMessages(sortedGroupedMessages);
//         setIsLoading(false);
//       },
//       (error) => {
//         console.error("Lỗi khi lấy tin nhắn:", error);
//         setIsLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // Lấy tin nhắn cho cuộc trò chuyện được chọn
//   useEffect(() => {
//     if (selectedUser) {
//       const chatId = selectedUser.chatId;
//       const messagesCollection = collection(db, "messages");
//       const q = query(
//         messagesCollection,
//         where("chatId", "==", chatId),
//         orderBy("timestamp", "asc")
//       );

//       const unsubscribe = onSnapshot(
//         q,
//         (querySnapshot) => {
//           const chatMessagesData = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//             timestamp: doc.data().timestamp?.toDate() || new Date(),
//           }));
//           setChatMessages(chatMessagesData);
//         },
//         (error) => {
//           console.error("Lỗi khi lấy tin nhắn chat:", error);
//         }
//       );

//       return () => unsubscribe();
//     }
//   }, [selectedUser]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         emojiPickerRef.current &&
//         !emojiPickerRef.current.contains(event.target)
//       ) {
//         setShowEmojiPicker(false);
//       }

//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const formatMessageTimestamp = (timestamp) => {
//     if (!timestamp) {
//       return "Thời gian không hợp lệ";
//     }

//     const date = new Date(timestamp);
//     const now = new Date();
//     const timeDifference = now - date;
//     const minutesDifference = Math.floor(timeDifference / (1000 * 60));

//     if (minutesDifference < 1) {
//       return "Mới nhất";
//     } else if (minutesDifference < 60) {
//       return `${minutesDifference} phút trước`;
//     } else if (timeDifference < 24 * 60 * 60 * 1000) {
//       const hoursDifference = Math.floor(minutesDifference / 60);
//       return `${hoursDifference} giờ trước`;
//     } else {
//       return date.toLocaleString("vi-VN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       });
//     }
//   };

//   const filteredMessages = messages.filter((group) => {
//     // Kiểm tra xem group có customerInfo không
//     if (!group.customerInfo) {
//       return false;
//     }

//     // Lấy tên khách hàng và số điện thoại từ customerInfo
//     const customerName = group.customerInfo.fullname || "Không có tên cần tìm";
//     const customerPhone = group.customerInfo.tel || "";

//     // Tìm kiếm dựa trên tên khách hàng hoặc số điện thoại
//     return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customerPhone.includes(searchTerm);
//   });

//   // Hàm để cập nhật trạng thái đang nhập
//   const setAdminTyping = async (chatId, isTyping) => {
//     try {
//       if (isTyping && !typingDocRef.current) {
//         const docRef = await addDoc(collection(db, "messages"), {
//           chatId,
//           adminTyping: true,
//           timestamp: serverTimestamp(),
//           isTypingIndicator: true,
//           text: "Admin đang nhập...",
//           role: "admin"
//         });
//         typingDocRef.current = docRef;
//       } else if (!isTyping && typingDocRef.current) {
//         await deleteDoc(typingDocRef.current);
//         typingDocRef.current = null;
//       }
//     } catch (error) {
//       console.error("Error updating typing status:", error);
//     }
//   };

//   const handleTyping = (chatId) => {
//     if (!isTyping) {
//       setIsTyping(true);
//       setAdminTyping(chatId, true);
//     }

//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     typingTimeoutRef.current = setTimeout(() => {
//       setIsTyping(false);
//       setAdminTyping(chatId, false);
//     }, 3000);
//   };

//   // Xử lý khi admin bắt đầu nhập
//   const handleInputChange = (e) => {
//     setNewMessage(e.target.value);
//     if (selectedUser) {
//       handleTyping(selectedUser.chatId);
//     }
//   };

//   const handleEndConversation = async () => {
//     if (selectedUser) {
//       try {
//         await addDoc(collection(db, "messages"), {
//           chatId: selectedUser.chatId,
//           text: "Cuộc trò chuyện với nhân viên đã kết thúc, bạn đang được chuyển về chat với chatbot.",
//           timestamp: serverTimestamp(),
//           role: "admin",
//           status: "ended"
//         });

//         setEndedChats(prev => ({
//           ...prev,
//           [selectedUser.chatId]: true
//         }));

//         // Chuyển chatMode sang 'bot' khi kết thúc cuộc trò chuyện
//         setChatMode('bot');

//       } catch (error) {
//         console.error("Lỗi khi kết thúc cuộc trò chuyện:", error);
//       }
//     }
//   };

//   const resumeConversation = async () => {
//     if (selectedUser) {
//       setEndedChats(prev => ({
//         ...prev,
//         [selectedUser.chatId]: false
//       }));

//       // Chuyển chatMode sang 'human' khi tiếp tục cuộc trò chuyện
//       setChatMode('human');

//       await addDoc(collection(db, "messages"), {
//         chatId: selectedUser.chatId,
//         text: "Cuộc trò chuyện đã được tiếp nối đến nhân viên tư vấn, bạn vui lòng đợi trong giây lát.",
//         timestamp: serverTimestamp(),
//         role: "admin",
//         status: "active"
//       });
//     }
//   };

//   const handleSendMessage = async () => {
//     if (newMessage.trim() && selectedUser) {
//       if (endedChats[selectedUser.chatId]) {
//         alert("Cuộc trò chuyện đã kết thúc. Vui lòng tiếp tục cuộc trò chuyện để gửi tin nhắn.");
//         return;
//       }
//       const messageData = {
//         chatId: selectedUser.chatId,
//         text: newMessage,
//         timestamp: serverTimestamp(),
//         role: chatMode === 'human' ? 'admin' : 'bot',
//         fullname: selectedAdminUser.fullname,
//         username: selectedAdminUser.username,
//         tel: selectedAdminUser.tel,
//         status: "sent"
//       };

//       try {
//         await addDoc(collection(db, "messages"), messageData);
//         setNewMessage("");
//       } catch (error) {
//         console.error("Lỗi khi gửi tin nhắn:", error);
//       }
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const onEmojiClick = (emojiObject) => {
//     setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
//   };

//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [chatMessages]);

//   const handleOpenDeleteDialog = (chat) => {
//     setChatToDelete(chat);
//     setOpenDeleteDialog(true);
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//     setChatToDelete(null);
//   };

//   const handleSuccessClose = () => {
//     setOpenSuccess(false);
//   };

//   const handleConfirmDelete = async () => {
//     if (chatToDelete) {
//       handleCloseDeleteDialog();
//       setIsDeleting(true);
//       try {
//         // Xóa tất cả tin nhắn trong cuộc trò chuyện
//         const messagesRef = collection(db, "messages");
//         const q = query(
//           messagesRef,
//           where("chatId", "==", chatToDelete.chatId)
//         );
//         const querySnapshot = await getDocs(q);

//         // Sử dụng vòng lặp for...of để xóa từng document
//         for (const doc of querySnapshot.docs) {
//           await deleteDoc(doc.ref);
//         }

//         // Cập nhật UI sau khi xóa
//         setMessages((prevMessages) =>
//           prevMessages.filter((msg) => msg.chatId !== chatToDelete.chatId)
//         );

//         // Reset selectedUser về null
//         setSelectedUser(null);

//         // Hiển thị thông báo thành công
//         setOpenSuccess(true);
//       } catch (error) {
//         console.error("Lỗi khi xóa lịch sử chat:", error);
//       } finally {
//         setIsDeleting(false);
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="container d-flex justify-content-center align-items-center">
//         <CustomSpinner />
//       </div>
//     );
//   }

//   useEffect(() => {
//     setShowEmojiPicker(false);
//   }, [selectedUser]);


//   return (
//     <div className="container">
//       {isDeleting && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backdropFilter: 'blur(20px)',
//           zIndex: 1000,
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center'
//         }}>
//           <CircularProgress color="warning" />
//         </div>
//       )}
//       <div className="page-inner bg-light rounded p-4 shadow-sm">
//         <div className="d-flex align-items-center flex-column flex-md-row mb-4">
//           <div>
//             <h3 className="fw-bold mb-2">Quản lý chat khách hàng</h3>
//             <h6 className="text-muted mb-3">Hương Sen Admin Dashboard</h6>
//           </div>
//         </div>

//         <div className="row g-4">
//           <div className="col-12 col-md-4 p-3">
//             <div
//               className="border-start bg-white"
//               style={{ height: "640px", overflowY: "auto" }} // Tùy chỉnh kích thước khung hiển thị tài khoản
//             >
//               <div
//                 className="sticky-top bg-light p-3"
//                 style={{ top: 0, zIndex: 100 }}
//               >
//                 <h5 className="fw-bold mb-3"># Danh sách tin nhắn</h5>
//                 <form
//                   className="form-action"
//                   onSubmit={(e) => e.preventDefault()}
//                 >
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
//                     style={{ width: "100%" }}
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </form>
//               </div>
//               <div className="list-group">
//                 {filteredMessages.map((group, i) => (
//                   <Link
//                     to={`/user-chats?chatId=${group.chatId}`}
//                     className="list-group-item list-group-item-action d-flex align-items-center p-3 border-bottom"
//                     key={group.chatId}
//                     onClick={() => setSelectedUser(group)}
//                   >
//                     <img
//                       src={
//                         group.customerInfo.avatar ||
//                         defaultAvatar
//                       }
//                       alt="Avatar"
//                       className="rounded-circle me-3"
//                       style={{ width: "50px", height: "50px" }}
//                     />
//                     <div className="flex-grow-1">
//                       <p className="mb-0">
//                         <strong>
//                           {group.customerInfo.fullname || "Unknown"} -  SĐT:{group.customerInfo.tel || ""}
//                         </strong>{" "}
//                         {group.lastMessageRole !== "admin" && (
//                           <i
//                             className="fa-solid fa-circle-dot"
//                             style={{ color: "blue", fontSize: "small" }}
//                           ></i>
//                         )}
//                       </p>
//                       <small className="text-muted">
//                         {group.lastMessageRole === "admin" ? "Bạn: " : ""}
//                         {group.lastMessage}
//                       </small>
//                     </div>
//                     <span className="text-muted ms-auto">
//                       {!group.isTypingIndicator ? formatMessageTimestamp(group.timestamp) : ""}
//                     </span>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="col-12 col-md-8">
//             <div className="border bg-white rounded">
//               <div className="d-flex align-items-center p-3 border-bottom">
//                 <img
//                   src={
//                     selectedUser?.customerInfo?.avatar ||
//                     defaultAvatar
//                   }
//                   alt="Avatar"
//                   className="me-3 rounded-circle"
//                   style={{ width: "50px", height: "50px" }}
//                 />
//                 <p className="mb-0">
//                   <strong>
//                     {/* {console.log("Check :: ", selectedUser)} */}
//                     {selectedUser
//                       ? `${selectedUser.customerInfo?.fullname || "Unknown"} - SĐT: ${selectedUser.customerInfo?.tel || ""}`
//                       : "Chọn tài khoản để chat"}
//                   </strong>
//                 </p>
//                 {selectedUser && (
//                   <div className="ms-auto">
//                     <div className="dropdown">
//                       <button
//                         className="btn btn-light"
//                         type="button"
//                         id="dropdownMenuButton"
//                         data-bs-toggle="dropdown"
//                         aria-expanded="false"
//                       >
//                         <i className="fas fa-ellipsis-v"></i>
//                       </button>
//                       <ul
//                         className="dropdown-menu"
//                         aria-labelledby="dropdownMenuButton"
//                       >
//                         <li>
//                           <button
//                             className="dropdown-item"
//                             onClick={handleEndConversation}
//                             disabled={endedChats[selectedUser.chatId]}
//                           >
//                             Kết thúc trò chuyện
//                           </button>
//                         </li>
//                         {endedChats[selectedUser.chatId] && (
//                           <li>
//                             <button
//                               className="dropdown-item"
//                               onClick={resumeConversation}
//                             >
//                               Tiếp tục trò chuyện với khách hàng
//                             </button>
//                           </li>
//                         )}
//                         <li>
//                           <Link
//                             className="dropdown-item"
//                             to="#"
//                             onClick={() => handleOpenDeleteDialog(selectedUser)}
//                           >
//                             <span className="text-danger">
//                               Xóa lịch sử chat
//                             </span>
//                           </Link>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <div
//                 className="d-flex flex-column border"
//                 style={{ height: "500px", overflowY: "auto" }}
//               >
//                 {chatMessages.map((message, index) => (
//                   <div
//                     key={message.id || index}
//                     className={`d-flex ${message.role === "admin" || message.role === "bot" || message.role === "system"
//                       ? "justify-content-end"
//                       : "justify-content-start"
//                       } mb-3 p-2`}
//                   >
//                     <div
//                       className={`d-flex ${message.role === "admin" || message.role === "bot" || message.role === "system"
//                         ? "flex-row-reverse"
//                         : "flex-row"
//                         } align-items-end`}
//                     >
//                       <img
//                         src={
//                           message.role === "admin" || message.role === "bot" || message.role === "system"
//                             ? "../../Assets/Images/huong-sen-logo.png"
//                             : message.avatar ||
//                             defaultAvatar
//                         }
//                         alt={`${message.role} Avatar`}
//                         className="rounded-circle mx-2"
//                         style={{ width: "40px", height: "40px" }}
//                       />
//                       <div
//                         className={`d-flex flex-column ${message.role === "admin" || message.role === "bot" || message.role === "system"
//                           ? "align-items-end"
//                           : "align-items-start"
//                           }`}
//                       >
//                       <div
//                         className="p-3 rounded"
//                         style={{
//                           maxWidth: "300px",
//                           wordWrap: "break-word",
//                           backgroundColor:
//                             message.role === "admin" || message.role === "bot" || message.role === "system"
//                               ? "#f7caee" // màu admin
//                               : "#f0f0f0", // màu khách hàng
//                           color: "black"
//                         }}
//                       >

//                           <small className="text-muted mb-1 d-block">
//                             {message.role === "admin"
//                               ? "Hương Sen – Tịnh Chay Cho Mọi Hành Trình Tâm Thức"
//                               : `${message.fullname || "Unknown"} - SĐT: ${message.tel || ""}`}
//                           </small>
//                           <p className="mb-0">{message.text}</p>
//                         </div>
//                         <small className="text-muted mt-1">
//                           {message.role === "admin" && (
//                             <span className="me-2">
//                               {message.status === "sending"
//                                 ? "Đang gửi..."
//                                 : "Đã gửi" + " •"}
//                             </span>
//                           )}
//                           {formatMessageTimestamp(message.timestamp)}
//                         </small>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>
//               {selectedUser && (
//                 <>
//                   {!endedChats[selectedUser.chatId] ? (
//                     <div className="d-flex align-items-center p-3 border-top bg-light">
//                       <input
//                         type="text"
//                         className="form-control me-3"
//                         placeholder="Nhập tin nhắn..."
//                         style={{ flex: 1 }}
//                         value={newMessage}
//                         onChange={handleInputChange}
//                         onKeyPress={handleKeyPress}
//                       />
//                       <button
//                         className="btn btn-light me-2"
//                         onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                       >
//                         😊
//                       </button>
//                       {showEmojiPicker &&
//                         createPortal(
//                           <div
//                             ref={emojiPickerRef}
//                             style={{
//                               position: "fixed",
//                               bottom: "80px",
//                               right: "20px",
//                               zIndex: 1000
//                             }}
//                           >
//                             <Picker onEmojiClick={onEmojiClick} />
//                           </div>,
//                           document.body
//                         )}

//                     </div>
//                   ) : (
//                     <div className="p-3 border-top bg-light text-center">
//                       <p className="mb-0">Cuộc trò chuyện đã kết thúc.</p>
//                       <small className="text-muted">Nhấn vào nút "Tiếp tục trò chuyện với khách hàng" để tiếp tục nhắn tin.</small>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <DialogConfirm
//         open={openDeleteDialog}
//         onClose={handleCloseDeleteDialog}
//         onConfirm={handleConfirmDelete}
//         title="Xác nhận xóa"
//         content="Bạn có chắc chắn muốn xóa lịch sử chat này không?"
//       />

//       <SuccessAlert
//         style={{ width: "700px" }}
//         open={openSuccess}
//         onClose={handleSuccessClose}
//         message="Xóa lịch sử chat thành công!"
//       />
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  limit,
} from "firebase/firestore";
import { db } from "../../Config/Firebase";
import Picker from "emoji-picker-react";
import DialogConfirm from "../../Components/Dialog/Dialog";
import { SuccessAlert } from "../../Components/Alert/Alert";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";
import defaultAvatar from "../../Assets/Images/profile-icon.png"
import axios from 'axios';
import { CircularProgress } from '@mui/material';


export default function UserChatsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const typingDocRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [chatMode, setChatMode] = useState('human'); // 'bot' hoặc 'human'
  const [endedChats, setEndedChats] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedAdminUser = JSON.parse(localStorage.getItem("user_admin"));

  // Lấy tất cả tin nhắn và nhóm chúng
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "messages"), orderBy("timestamp", "asc")),
      (querySnapshot) => {
        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        }));

        // Nhóm tin nhắn theo chatId
        const groupedMessages = messagesData.reduce((acc, message) => {
          if (message.isTypingIndicator) return acc; // Bỏ qua tin nhắn đang nhập

          const key = message.chatId;
          if (!acc[key]) {
            acc[key] = {
              chatId: message.chatId,
              fullname: message.fullname,
              tel: message.tel,
              messages: [],
              timestamp: message.timestamp,
              lastMessage: message.text,
              lastMessageRole: message.role,
            };
          }
          acc[key].messages.push(message);
          // Cập nhật timestamp và lastMessage nếu tin nhắn này mới hơn
          if (message.timestamp > acc[key].timestamp && !message.isTypingIndicator) {
            acc[key].timestamp = message.timestamp;
            acc[key].lastMessage = message.text;
            acc[key].lastMessageRole = message.role;
          }
          return acc;
        }, {});

        // Sắp xếp các nhóm tin nhắn theo timestamp mới nhất
        const sortedGroupedMessages = Object.values(groupedMessages)
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((group) => ({
            ...group,
            // Lấy thông tin của tin nhắn khách hàng gần nhất
            customerInfo:
              group.messages.find((msg) => msg.role === "customer") || {},
          }));

        setMessages(sortedGroupedMessages);
        setIsLoading(false);
      },
      (error) => {
        console.error("Lỗi khi lấy tin nhắn:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Lấy tin nhắn cho cuộc trò chuyện được chọn
  useEffect(() => {
    if (selectedUser) {
      const chatId = selectedUser.chatId;
      const messagesCollection = collection(db, "messages");
      const q = query(
        messagesCollection,
        where("chatId", "==", chatId),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const chatMessagesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          }));
          setChatMessages(chatMessagesData);
        },
        (error) => {
          console.error("Lỗi khi lấy tin nhắn chat:", error);
        }
      );

      return () => unsubscribe();
    }
  }, [selectedUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatMessageTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Thời gian không hợp lệ";
    }

    const date = new Date(timestamp);
    const now = new Date();
    const timeDifference = now - date;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    if (minutesDifference < 1) {
      return "Mới nhất";
    } else if (minutesDifference < 60) {
      return `${minutesDifference} phút trước`;
    } else if (timeDifference < 24 * 60 * 60 * 1000) {
      const hoursDifference = Math.floor(minutesDifference / 60);
      return `${hoursDifference} giờ trước`;
    } else {
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  };

  const filteredMessages = messages.filter((group) => {
    // Kiểm tra xem group có customerInfo không
    if (!group.customerInfo) {
      return false;
    }

    // Lấy tên khách hàng và số điện thoại từ customerInfo
    const customerName = group.customerInfo.fullname || "Không có tên cần tìm";
    const customerPhone = group.customerInfo.tel || "";

    // Tìm kiếm dựa trên tên khách hàng hoặc số điện thoại
    return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerPhone.includes(searchTerm);
  });

  // Hàm để cập nhật trạng thái đang nhập
  const setAdminTyping = async (chatId, isTyping) => {
    try {
      if (isTyping && !typingDocRef.current) {
        const docRef = await addDoc(collection(db, "messages"), {
          chatId,
          adminTyping: true,
          timestamp: serverTimestamp(),
          isTypingIndicator: true,
          text: "Admin đang nhập...",
          role: "admin"
        });
        typingDocRef.current = docRef;
      } else if (!isTyping && typingDocRef.current) {
        await deleteDoc(typingDocRef.current);
        typingDocRef.current = null;
      }
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  const handleTyping = (chatId) => {
    if (!isTyping) {
      setIsTyping(true);
      setAdminTyping(chatId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setAdminTyping(chatId, false);
    }, 3000);
  };

  // Xử lý khi admin bắt đầu nhập
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (selectedUser) {
      handleTyping(selectedUser.chatId);
    }
  };

  const handleEndConversation = async () => {
    if (selectedUser) {
      try {
        await addDoc(collection(db, "messages"), {
          chatId: selectedUser.chatId,
          text: "Cuộc trò chuyện với nhân viên đã kết thúc, bạn đang được chuyển về chat với chatbot.",
          timestamp: serverTimestamp(),
          role: "admin",
          status: "ended"
        });

        setEndedChats(prev => ({
          ...prev,
          [selectedUser.chatId]: true
        }));

        // Chuyển chatMode sang 'bot' khi kết thúc cuộc trò chuyện
        setChatMode('bot');

      } catch (error) {
        console.error("Lỗi khi kết thúc cuộc trò chuyện:", error);
      }
    }
  };

  const resumeConversation = async () => {
    if (selectedUser) {
      setEndedChats(prev => ({
        ...prev,
        [selectedUser.chatId]: false
      }));

      // Chuyển chatMode sang 'human' khi tiếp tục cuộc trò chuyện
      setChatMode('human');

      await addDoc(collection(db, "messages"), {
        chatId: selectedUser.chatId,
        text: "Cuộc trò chuyện đã được tiếp nối đến nhân viên tư vấn, bạn vui lòng đợi trong giây lát.",
        timestamp: serverTimestamp(),
        role: "admin",
        status: "active"
      });
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedUser) {
      if (endedChats[selectedUser.chatId]) {
        alert("Cuộc trò chuyện đã kết thúc. Vui lòng tiếp tục cuộc trò chuyện để gửi tin nhắn.");
        return;
      }
      const messageData = {
        chatId: selectedUser.chatId,
        text: newMessage,
        timestamp: serverTimestamp(),
        role: chatMode === 'human' ? 'admin' : 'bot',
        fullname: selectedAdminUser.fullname,
        username: selectedAdminUser.username,
        tel: selectedAdminUser.tel,
        status: "sent"
      };

      try {
        await addDoc(collection(db, "messages"), messageData);
        setNewMessage("");
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleOpenDeleteDialog = (chat) => {
    setChatToDelete(chat);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setChatToDelete(null);
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);
  };

  const handleConfirmDelete = async () => {
    if (chatToDelete) {
      handleCloseDeleteDialog();
      setIsDeleting(true);
      try {
        // Xóa tất cả tin nhắn trong cuộc trò chuyện
        const messagesRef = collection(db, "messages");
        const q = query(
          messagesRef,
          where("chatId", "==", chatToDelete.chatId)
        );
        const querySnapshot = await getDocs(q);

        // Sử dụng vòng lặp for...of để xóa từng document
        for (const doc of querySnapshot.docs) {
          await deleteDoc(doc.ref);
        }

        // Cập nhật UI sau khi xóa
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.chatId !== chatToDelete.chatId)
        );

        // Reset selectedUser về null
        setSelectedUser(null);

        // Hiển thị thông báo thành công
        setOpenSuccess(true);
      } catch (error) {
        console.error("Lỗi khi xóa lịch sử chat:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container d-flex justify-content-center align-items-center">
        <CustomSpinner />
      </div>
    );
  }

  return (
    <div className="container">
      {isDeleting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <CircularProgress color="warning" />
        </div>
      )}
      <div className="page-inner bg-light rounded p-4 shadow-sm">
        <div className="d-flex align-items-center flex-column flex-md-row mb-4">
          <div>
            <h3 className="fw-bold mb-2">Quản lý chat khách hàng</h3>
            <h6 className="text-muted mb-3">Hương Sen Admin Dashboard</h6>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-4 p-3">
            <div
              className="border-start bg-white"
              style={{ height: "640px", overflowY: "auto" }} // Tùy chỉnh kích thước khung hiển thị tài khoản
            >
              <div
                className="sticky-top bg-light p-3"
                style={{ top: 0, zIndex: 100 }}
              >
                <h5 className="fw-bold mb-3"># Danh sách tin nhắn</h5>
                <form
                  className="form-action"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                    style={{ width: "100%" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div>
              <div className="list-group">
                {filteredMessages.map((group, i) => (
                  <Link
                    to={`/user-chats?uid=${group.customerInfo.uid || ""}`}
                    className="list-group-item list-group-item-action d-flex align-items-center p-3 border-bottom"
                    key={i}
                    onClick={() => setSelectedUser(group)}
                  >
                    <img
                      src={
                        group.customerInfo.avatar ||
                        defaultAvatar
                      }
                      alt="Avatar"
                      className="rounded-circle me-3"
                      style={{ width: "50px", height: "50px" }}
                    />
                    <div className="flex-grow-1">
                      <p className="mb-0">
                        <strong>
                          {group.customerInfo.fullname || "Unknown"} -  SĐT:{group.customerInfo.tel || ""}
                        </strong>{" "}
                        {group.lastMessageRole !== "admin" && (
                          <i
                            className="fa-solid fa-circle-dot"
                            style={{ color: "blue", fontSize: "small" }}
                          ></i>
                        )}
                      </p>
                      <small className="text-muted">
                        {group.lastMessageRole === "admin" ? "Bạn: " : ""}
                        {group.lastMessage}
                      </small>
                    </div>
                    <span className="text-muted ms-auto">
                      {!group.isTypingIndicator ? formatMessageTimestamp(group.timestamp) : ""}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-8">
            <div className="border bg-white rounded">
              <div className="d-flex align-items-center p-3 border-bottom">
                <img
                  src={
                    selectedUser?.customerInfo?.avatar ||
                    defaultAvatar
                  }
                  alt="Avatar"
                  className="me-3 rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
                <p className="mb-0">
                  <strong>
                    {console.log("Check :: ", selectedUser)}
                    {selectedUser
                      ? `${selectedUser.customerInfo?.fullname || "Unknown"} - SĐT: ${selectedUser.customerInfo?.tel || ""}`
                      : "Chọn tài khoản để chat"}
                  </strong>
                </p>
                {selectedUser && (
                  <div className="ms-auto">
                    <div className="dropdown">
                      <button
                        className="btn btn-light"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={handleEndConversation}
                            disabled={endedChats[selectedUser.chatId]}
                          >
                            Kết thúc trò chuyện
                          </button>
                        </li>
                        {endedChats[selectedUser.chatId] && (
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={resumeConversation}
                            >
                              Tiếp tục trò chuyện với khách hàng
                            </button>
                          </li>
                        )}
                        <li>
                          <Link
                            className="dropdown-item"
                            to="#"
                            onClick={() => handleOpenDeleteDialog(selectedUser)}
                          >
                            <span className="text-danger">
                              Xóa lịch sử chat
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div
                className="d-flex flex-column border"
                style={{ height: "500px", overflowY: "auto" }}
              >
                {chatMessages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`d-flex ${message.role === "admin" || message.role === "bot" || message.role === "system"
                      ? "justify-content-end"
                      : "justify-content-start"
                      } mb-3 p-2`}
                  >
                    <div
                      className={`d-flex ${message.role === "admin" || message.role === "bot" || message.role === "system"
                        ? "flex-row-reverse"
                        : "flex-row"
                        } align-items-end`}
                    >
                      <img
                        src={
                          message.role === "admin" || message.role === "bot" || message.role === "system"
                            ? "../../Assets/Images/huong-sen-logo.png"
                            : message.avatar ||
                            defaultAvatar
                        }
                        alt={`${message.role} Avatar`}
                        className="rounded-circle mx-2"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div
                        className={`d-flex flex-column ${message.role === "admin" || message.role === "bot" || message.role === "system"
                          ? "align-items-end"
                          : "align-items-start"
                          }`}
                      >
                      <div
                        className="p-3 rounded"
                        style={{
                          maxWidth: "300px",
                          wordWrap: "break-word",
                          backgroundColor:
                            message.role === "admin" || message.role === "bot" || message.role === "system"
                              ? "#f7caee" // màu admin
                              : "#f0f0f0", // màu khách hàng
                          color: "black"
                        }}
                      >

                      <small className="mb-1 d-block">
                        {message.role === "admin" ? (
                          <span
                            style={{
                              background: "linear-gradient(90deg, #32CD32,  #006400)", // vàng đậm → cam đậm
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              fontWeight: 600,
                              fontSize: "13px"
                            }}
                          >
                            Hương Sen - Tinh Hoa Ẩm Thực Chay
                          </span>
                        ) : (
                          <span
                            style={{
                              background: "linear-gradient(90deg, #4facfe, #8e44ad)", // xanh → tím
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              fontWeight: 600,
                              fontSize: "13px"
                            }}
                          >
                            {message.fullname || "Unknown"} - SĐT: {message.tel || ""}
                          </span>
                        )}
                      </small>
                          <p
                            className="mb-0"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {message.text}
                          </p>
                        </div>
                        <small className="text-muted mt-1">
                          {message.role === "admin" && (
                            <span className="me-2">
                              {message.status === "sending"
                                ? "Đang gửi..."
                                : "Đã gửi" + " •"}
                            </span>
                          )}
                          {formatMessageTimestamp(message.timestamp)}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              {selectedUser && (
                <>
                  {!endedChats[selectedUser.chatId] ? (
                    <div className="d-flex align-items-center p-3 border-top bg-light">
                      <input
                        type="text"
                        className="form-control me-3"
                        placeholder="Nhập tin nhắn..."
                        style={{ flex: 1 }}
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                      />
                      <button
                        className="btn btn-light me-2"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        😊
                      </button>
                      {showEmojiPicker && (
                        <div
                          ref={emojiPickerRef}
                          style={{
                            position: "fixed",
                            bottom: "80px",
                            right: "20px",
                            zIndex: 1000,
                            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                          }}
                        >
                          <Picker onEmojiClick={onEmojiClick} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 border-top bg-light text-center">
                      <p className="mb-0">Cuộc trò chuyện đã kết thúc.</p>
                      <small className="text-muted">Nhấn vào nút "Tiếp tục trò chuyện với khách hàng" để tiếp tục nhắn tin.</small>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <DialogConfirm
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa lịch sử chat này không?"
      />

      <SuccessAlert
        style={{ width: "700px" }}
        open={openSuccess}
        onClose={handleSuccessClose}
        message="Xóa lịch sử chat thành công!"
      />
    </div>
  );
}



