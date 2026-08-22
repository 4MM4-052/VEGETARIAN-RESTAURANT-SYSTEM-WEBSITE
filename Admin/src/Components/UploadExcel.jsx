import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProductsFromExcel } from '../Actions/ProductActions';
import { SuccessAlert } from '../Components/Alert/Alert'; // giả sử bạn có sẵn

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Vui lòng chọn file Excel!");

    try {
      await dispatch(addProductsFromExcel(file));
      setOpenSuccess(true); // mở thông báo thành công
      setFile(null); // reset input
    } catch (error) {
      alert('Thêm sản phẩm thất bại!');
    }
  };

  const handleCloseSuccess = () => setOpenSuccess(false);

  return (
    <div>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Tải lên Excel</button>

      <SuccessAlert
        open={openSuccess}
        onClose={handleCloseSuccess}
        message="Thêm sản phẩm từ Excel thành công!"
        vertical="top"
        horizontal="right"
      />
    </div>
  );
};

export default UploadExcel;
