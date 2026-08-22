import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  deleteCommentBlog,
  fetchCommentBlog,
  setCurrentPage,
} from "../../Actions/CommentBlogActions";
import DialogConfirm from "../../Components/Dialog/Dialog";
import CustomSpinner from "../../Components/Spinner/CustomSpinner";
import { format } from "date-fns";
import { SuccessAlert } from "../../Components/Alert/Alert";
import CheckboxSelection from "../../Components/CheckboxSelection";

import { getPermissions } from "../../Actions/GetQuyenHanAction";
import { jwtDecode as jwt_decode } from "jwt-decode";
import CustomPagination from "../../Components/Pagination/CustomPagination";

export default function CommentBlogList() {
  const { blogId } = useParams();
  const dispatch = useDispatch();
  const [openSuccess, setOpenSuccess] = useState(false);
  const commentBlogState = useSelector((state) => state.commentBlog);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const getQuyenHanState = useSelector((state) => state.getQuyenHan);
  const permissions = getQuyenHanState.getQuyenHan || [];

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      const userIdFromToken = decodedToken.id;
      dispatch(getPermissions(userIdFromToken));
    }
    const decodedToken = jwt_decode(token);
    const userIdFromToken = decodedToken.id;
    dispatch(getPermissions(userIdFromToken));
  }, [navigate, dispatch, token]);

  const hasPermission = (permissionName) => {
    return (
      permissions.data &&
      permissions.data.some((permission) => permission.name == permissionName)
    );
  };

  const query = new URLSearchParams(location.search);
  const urlPage = parseInt(query.get("page")) || 1;

  // const query = new URLSearchParams(location.search);
  const [open, setOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  console.log("Check commentBlogState:", commentBlogState)
  useEffect(() => {
    if (blogId) {

      console.log("Check blogId blogId::, ", blogId)

      // Gọi API khi blogId thay đổi
      dispatch(fetchCommentBlog(blogId, urlPage, commentBlogState.pageSize));
    }
  }, [dispatch, blogId, urlPage, commentBlogState.pageSize]);

  const handlePageChange = (page) => {
    if (blogId) {
      // Cập nhật URL với trang mới
      navigate(`?page=${page}`);
      
      // Cập nhật trang hiện tại trong Redux state
      dispatch(setCurrentPage(page));
  
      // Fetch dữ liệu theo trang mới
      dispatch(fetchCommentBlog(blogId, page));
    }
  };
  



  const handleClickOpen = (commentId) => {
    setSelectedCommentId(commentId); // Lưu commentId khi mở dialog
    setOpen(true); // Mở dialog
  };

  // Đóng dialog xác nhận
  const handleClose = () => {
    setOpen(false); // Đóng dialog
    setSelectedCommentId(null); // Reset lại commentId
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);
  };

  // Xác nhận xóa bình luận
  const handleConfirm = () => {
    if (selectedCommentId && blogId) {
      dispatch(deleteCommentBlog(selectedCommentId, blogId)); // Xóa comment với blogId và commentId
      setOpenSuccess(true);
      handleClose();
    }
  };

  const handleDeleteCommentBlogs = async (selectedIds) => {
    for (let Id of selectedIds) {
      await dispatch(deleteCommentBlog(Id, blogId));
    }
    setOpenSuccess(true); // Hiển thị thông báo thành công
  };

  const {
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    handleDeleteSelected,
    allSelected,
  } = CheckboxSelection(commentBlogState.commentBlog, handleDeleteCommentBlogs);

  return (
    <div className="container">
      <div className="page-inner">
        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
          <div>
            <h3 className="fw-bold mb-3">Quản lý bình luận bài viết cho bài viết #{blogId}</h3>
            <h6 className="op-7 mb-2">Hương Sen Admin Dashboard</h6>
          </div>
          <div className="ms-md-auto py-2 py-md-0">
            {hasPermission('Xóa bình luận bài viết') && (
              <button className="btn btn-danger btn-round me-2" onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
                Xóa mục đã chọn
              </button>
            )}
          </div>
        </div>


        <div className="card card-round">
          <div className="card-header">
            <div className="card-title">Danh sách bình luận</div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive text-center">
              <table className="table align-items-center mb-0">
                <thead className="thead-light">
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th scope="col">STT</th>
                    <th scope="col">Tên người dùng</th>
                    <th scope="col">Nội dung</th>
                    <th scope="col">Ngày tạo</th>
                    <th scope="col">Ngày cập nhật</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {commentBlogState.loading && (
                    <tr>
                      <td colSpan="5">
                        <CustomSpinner />
                      </td>
                    </tr>
                  )}
                  {!commentBlogState.loading &&
                    commentBlogState.allCommentBlogs.length === 0 && (
                      <tr>
                        <td colSpan="5">Không tìm thấy bình luận</td>
                      </tr>
                    )}
                  {!commentBlogState.loading &&
                    commentBlogState.allCommentBlogs.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{item.fullname}</td>
                        <td>{item.content}</td>
                        <td>
                          {format(
                            new Date(item.created_at),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </td>
                        <td>
                          {format(
                            new Date(item.updated_at),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </td>
                        <td>
                          {hasPermission("Xóa bình luận bài viết") && (
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => handleClickOpen(item.id)} // Mở dialog và lưu commentId
                            >
                              Xóa
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="my-2">
              {/* <CustomPagination
                count={commentBlogState.totalPages} // Tổng số trang
                currentPageSelector={(state) => state.commentBlog.currentPage} // Selector để lấy trang hiện tại
                fetchAction={(page) => fetchCommentBlog(blogId, page, commentBlogState.pageSize)} // Đảm bảo là một hàm
                onPageChange={handlePageChange} // Hàm xử lý khi thay đổi trang
              /> */}
              <CustomPagination
                                        count={commentBlogState.totalPages} // Tổng số trang từ state
                                        currentPageSelector={(state) => state.commentBlog.currentPage} // Selector lấy currentPage
                                        pageSizeSelector={(state) => state.commentBlog.limit} // Thay pageSizeSelector thành limit
                                        fetchDataAction={(page, size) => fetchCommentBlog(blogId, page, commentBlogState.pageSize)} // Fetch dữ liệu với searchTerm và page
                                        onPageChange={handlePageChange} // Hàm chuyển trang
                                    />
            </div>
          </div>
          <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Xóa bình luận thành công!" />
        </div>
      </div>
      <DialogConfirm
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
