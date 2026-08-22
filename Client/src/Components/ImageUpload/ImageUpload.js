// import React, { useState } from 'react';
// // import ImageUploader from 'react-images-upload';
// import { useDropzone } from 'react-dropzone';
// import './uploadImage.css'
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { storage } from '../../Config/Client/Firebase';

// const ImageUploadComponent = ({ id, onImageUpload }) => {
//     const [pictures, setPictures] = useState([]);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploading, setUploading] = useState(false);

//     const onDrop = (pictureFiles) => {
//         const file = pictureFiles[0];
//         if (!file) return;

//         const storageRef = ref(storage, `images/${file.name}`);
//         const uploadTask = uploadBytesResumable(storageRef, file);

//         setUploading(true);

//         uploadTask.on(
//             'state_changed',
//             (snapshot) => {
//                 // Theo dõi tiến trình tải lên
//                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                 setUploadProgress(progress);
//                 console.log('Upload is ' + progress + '% done');
//             },
//             (error) => {
//                 // Xử lý lỗi
//                 console.error('Upload failed:', error);
//                 setUploading(false);
//             },
//             () => {
//                 // Xử lý thành công
//                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                     console.log('File available at', downloadURL);
//                     setPictures([downloadURL]);
//                     onImageUpload([downloadURL]); // Gọi callback để truyền URL lên component cha
//                     setUploading(false);
//                     setUploadProgress(0); // Đặt lại tiến trình
//                 });
//             }
//         );
//     };

//     return (
//         <div>
//             <ImageUploader
//                 withIcon={true}
//                 buttonText='Chọn ảnh'
//                 onChange={onDrop}
//                 imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
//                 maxFileSize={5242880}
//                 withPreview={true}
//                 singleImage={true}
//                 fileContainerStyle={{ backgroundColor: '#f8f9fa' }} // Áp dụng style tùy chỉnh
//                 id={id}
//             />
//             {uploading && (
//                 <div className='float-end'>
//                     <p>Đang tải lên: {Math.round(uploadProgress)}%</p>
//                     <progress value={uploadProgress} max="100" />
//                 </div>
//             )}
//         </div>

//     );
// };


// export default ImageUploadComponent;

// import React, { useState } from 'react';
// import { useDropzone } from 'react-dropzone';  // Sử dụng useDropzone thay vì ImageUploader
// import './uploadImage.css';  // Đảm bảo có file CSS để tạo giao diện đẹp
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { storage } from '../../Config/Client/Firebase';

// const ImageUploadComponent = ({ id, onImageUpload }) => {
//     const [pictures, setPictures] = useState([]);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploading, setUploading] = useState(false);

//     const onDrop = (acceptedFiles) => {
//         const file = acceptedFiles[0];
//         if (!file) return;

//         const storageRef = ref(storage, `images/${file.name}`);
//         const uploadTask = uploadBytesResumable(storageRef, file);

//         setUploading(true);

//         uploadTask.on(
//             'state_changed',
//             (snapshot) => {
//                 // Theo dõi tiến trình tải lên
//                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                 setUploadProgress(progress);
//                 console.log('Upload is ' + progress + '% done');
//             },
//             (error) => {
//                 // Xử lý lỗi
//                 console.error('Upload failed:', error);
//                 setUploading(false);
//             },
//             () => {
//                 // Xử lý thành công
//                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                     console.log('File available at', downloadURL);
//                     setPictures([downloadURL]);
//                     onImageUpload([downloadURL]); // Gọi callback để truyền URL lên component cha
//                     setUploading(false);
//                     setUploadProgress(0); // Đặt lại tiến trình
//                 });
//             }
//         );
//     };

//     // Sử dụng useDropzone để thay thế ImageUploader
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop,
//         accept: 'image/*',  // Chỉ chấp nhận file ảnh
//     });

//     return (
//         <div>
//             <div {...getRootProps({ className: 'dropzone' })}>
//                 <input {...getInputProps()} />
//                 {
//                     isDragActive ? (
//                         <p>Thả ảnh vào đây...</p>
//                     ) : (
//                         <p>Chọn hoặc kéo thả ảnh vào đây</p>
//                     )
//                 }
//             </div>

//             {uploading && (
//                 <div className='float-end'>
//                     <p>Đang tải lên: {Math.round(uploadProgress)}%</p>
//                     <progress value={uploadProgress} max="100" />
//                 </div>
//             )}

//             {pictures.length > 0 && (
//                 <div className="preview">
//                     <img src={pictures[0]} alt="Uploaded" style={{ width: '200px', marginTop: '10px' }} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ImageUploadComponent;


// import React, { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';
// import './uploadImage.css'; // File CSS bạn tự style

// const ImageUploadComponent = ({ id, onImageUpload }) => {
//     const [pictures, setPictures] = useState([]);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploading, setUploading] = useState(false);

//     // Hàm xử lý khi người dùng chọn file ảnh
//     const onDrop = (acceptedFiles) => {
//         const file = acceptedFiles[0];
//         if (!file) return;

//         // Hiển thị preview nhanh
//         const preview = URL.createObjectURL(file);
//         setPictures([preview]);

//         // Gửi file lên server
//         uploadImage(file);
//     };

//     // Hàm upload ảnh
//     const uploadImage = (file) => {
//         setUploading(true);
//         setUploadProgress(0);

//         const formData = new FormData();
//         formData.append('image', file); // Gửi file gốc, không phải base64

//         axios.post('http://localhost:3307/apis/upload', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//             onUploadProgress: (progressEvent) => {
//                 const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                 setUploadProgress(percent);
//             }
//         })
//         .then(response => {
//             console.log('Upload thành công:', response.data);
//             setUploadProgress(100);
//             setUploading(false);

//             if (onImageUpload) {
//                 onImageUpload(response.data); // Trả về { id, imageUrl }
//             }
//         })
//         .catch(error => {
//             console.error('Lỗi upload:', error);
//             setUploading(false);
//         });
//     };

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop,
//         accept: {
//             'image/*': []
//         },
//         multiple: false,
//     });

//     return (
//         <div className="upload-container">
//             <div {...getRootProps({ className: 'dropzone' })}>
//                 <input {...getInputProps()} />
//                 {
//                     isDragActive ? (
//                         <p>Kéo và thả ảnh vào đây...</p>
//                     ) : (
//                         <p>Click hoặc kéo thả ảnh vào đây để upload</p>
//                     )
//                 }
//             </div>

//             {uploading && (
//                 <div className="upload-progress">
//                     <p>Đang tải lên: {uploadProgress}%</p>
//                     <progress value={uploadProgress} max="100" />
//                 </div>
//             )}

//             {pictures.length > 0 && (
//                 <div className="preview">
//                     <img
//                         src={pictures[0]}
//                         alt="Ảnh preview"
//                         style={{
//                             width: '200px',
//                             height: 'auto',
//                             marginTop: '10px',
//                             objectFit: 'cover',
//                             borderRadius: '8px',
//                         }}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ImageUploadComponent;





// import React, { useState } from 'react';
// import { useDropzone } from 'react-dropzone';

// import './uploadImage.css';
// import { Client, Storage, ID, Permission, Role } from 'appwrite';

// const client = new Client()
//     .setEndpoint('https://fra.cloud.appwrite.io/v1') // VD: https://cloud.appwrite.io/v1
//     .setProject('6810325c001922879970'); // Project ID trong Appwrite

// const storage = new Storage(client);

// const ImageUploadComponent = ({ id, onImageUpload }) => {
//     const [pictures, setPictures] = useState([]);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploading, setUploading] = useState(false);

//     const onDrop = async (pictureFiles) => {
//         const file = pictureFiles[0];
//         if (!file) return;
    
//         setUploading(true);
//         setUploadProgress(0);
    
//         try {
//             const uploadedFile = await storage.createFile(
//                 '68103304002595b90afb',
//                 ID.unique(),
//                 file,
//                 [Permission.read(Role.any())]
//             );
    
//             const imageUrl = `https://fra.cloud.appwrite.io/v1/storage/buckets/68103304002595b90afb/files/${uploadedFile.$id}/view?project=6810325c001922879970&mode=admin`;
    
//             setPictures([imageUrl]);
    
//             if (onImageUpload) {
//                 onImageUpload([imageUrl]);
//             } else {
//                 console.warn('onImageUpload is not defined!');
//             }
    
//         } catch (error) {
//             console.error('Upload failed:', error);
//         } finally {
//             setUploading(false);
//             setUploadProgress(100);
//         }
//     };
    

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop,
//         accept: 'image/*',
//     });

//     return (
//         <div>
//             <div {...getRootProps({ className: 'dropzone' })}>
//                 <input {...getInputProps()} />
//                 {
//                     isDragActive ? (
//                         <p>Thả ảnh vào đây...</p>
//                     ) : (
//                         <p>Chọn hoặc kéo thả ảnh vào đây</p>
//                     )
//                 }
//             </div>

//             {uploading && (
//                 <div className='float-end'>
//                     <p>Đang tải lên...</p>
//                     <progress value={uploadProgress} max="100" />
//                 </div>
//             )}

//             {pictures.length > 0 && (
//                 <div className="preview">
//                     <img src={pictures[0]} alt="Uploaded" style={{ width: '200px', marginTop: '10px' }} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ImageUploadComponent;




import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import './uploadImage.css';
import { Client, Storage, ID, Permission, Role } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // VD: https://cloud.appwrite.io/v1
    .setProject('6810325c001922879970'); // Project ID trong Appwrite

const storage = new Storage(client);

const ImageUploadComponent = ({ id, onImageUpload }) => {
    const [pictures, setPictures] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const onDrop = async (pictureFiles) => {
        const file = pictureFiles[0];
        if (!file) return;
    
        setUploading(true);
        setUploadProgress(0);
    
        try {
            const uploadedFile = await storage.createFile(
                '68103304002595b90afb',
                ID.unique(),
                file,
                [Permission.read(Role.any())]
            );
    
            const imageUrl = `https://fra.cloud.appwrite.io/v1/storage/buckets/68103304002595b90afb/files/${uploadedFile.$id}/view?project=6810325c001922879970&mode=admin`;
    
            setPictures([imageUrl]);
    
            if (onImageUpload) {
                onImageUpload([imageUrl]);
            } else {
                console.warn('onImageUpload is not defined!');
            }
    
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
            setUploadProgress(100);
        }
    };
    

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    return (
        <div>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {
                    isDragActive ? (
                        <p>Thả ảnh vào đây...</p>
                    ) : (
                        <p>Chọn hoặc kéo thả ảnh vào đây</p>
                    )
                }
            </div>

            {uploading && (
                <div className='float-end'>
                    <p>Đang tải lên...</p>
                    <progress value={uploadProgress} max="100" />
                </div>
            )}

            {pictures.length > 0 && (
                <div className="preview">
                    <img src={pictures[0]} alt="Uploaded" style={{ width: '200px', marginTop: '10px' }} />
                </div>
            )}
        </div>
    );
};

export default ImageUploadComponent;