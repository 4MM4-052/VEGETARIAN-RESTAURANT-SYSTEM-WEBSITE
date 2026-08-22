import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRole2 } from '../../Actions/RoleActions';
import {
  addRolePermissions,
  fetchRolePermissions,
  deleteRolePermissions,
} from '../../Actions/RolePermissionsActions'; // Import thêm hàm deleteRolePermissions
import { fetchPermissions } from '../../Actions/PermissionsActions';
import { DangerAlert, SuccessAlert } from '../../Components/Alert/Alert';
import { useForm } from 'react-hook-form';
import CustomSpinner from '../../Components/Spinner/CustomSpinner';

import { getPermissions } from "../../Actions/GetQuyenHanAction";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function RolesEdit() {
  const { handleSubmit } = useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const roleState = useSelector((state) => state.role);
  const permissionsState = useSelector((state) => state.permissions);
  const rolePermissionsState = useSelector((state) => state.rolePermissions.allRolePermissions);

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);


  // Load roles and permissions data
  useEffect(() => {
    dispatch(fetchRole2());
    dispatch(fetchPermissions());
  }, [dispatch]);

  // Tải quyền vai trò khi vai trò được chọn
  useEffect(() => {
    const loadRolePermissions = async () => {
      if (selectedRole) {
        setLoading(true);
        await dispatch(fetchRolePermissions(selectedRole));
        setLoading(false);
      }
    };
    loadRolePermissions();
  }, [dispatch, selectedRole]);

  // Cập nhật trạng thái khi dữ liệu vai trò thay đổi
  useEffect(() => {
    const role = roleState.role.find((r) => r.id === parseInt(id));
    if (role) {
      setSelectedRole(role.id);
    }
  }, [roleState.role, id]);

  useEffect(() => {
    if (selectedRole && rolePermissionsState.length > 0) {
      const rolePermissions = rolePermissionsState.filter(
        (rp) => rp.role_id === selectedRole
      );
      setSelectedPermissions(rolePermissions.map((rp) => rp.permission_id));
    }
  }, [rolePermissionsState, selectedRole]);

  // Chuyển trạng thái chọn của một quyền cụ thể
  const handleCheckboxChange = (id, label, group) => {
    setSelectedPermissions((prev) => {
      const isAddEditDelete = ["Thêm", "Sửa", "Xóa"].includes(label);
      const isView = label === "Xem";
  
      if (isAddEditDelete) {
        // Khi chọn "Thêm", "Sửa", hoặc "Xóa", tự động thêm quyền "Xem"
        const viewPermission = group.options.find((perm) => perm.label === "Xem");
        if (viewPermission && !prev.includes(viewPermission.id)) {
          return [...prev, id, viewPermission.id];
        }
      }
  
      if (isView) {
        // Không cho bỏ quyền "Xem" nếu có "Thêm", "Sửa", hoặc "Xóa"
        const relatedPermissions = group.options.filter(
          (perm) =>
            ["Thêm", "Sửa", "Xóa"].includes(perm.label) &&
            selectedPermissions.includes(perm.id)
        );
        if (relatedPermissions.length > 0) {
          return prev; // Không thay đổi nếu "Xem" liên quan
        }
      }
  
      // Thêm hoặc gỡ quyền thông thường
      return prev.includes(id)
        ? prev.filter((permission) => permission !== id)
        : [...prev, id];
    });
  };  

  const isViewDisabled = (group) => {
    // Nếu bất kỳ quyền "Thêm", "Sửa", hoặc "Xóa" được chọn, disable quyền "Xem"
    return group.options.some(
      (option) =>
        ["Thêm", "Sửa", "Xóa"].includes(option.label) &&
        selectedPermissions.includes(option.id)
    );
  };  

  // Chọn tất cả quyền trong một nhóm
  const handleSelectAll = (rolePermissions) => {
    if (!rolePermissions.options) return;

    const allSelected = rolePermissions.options.every((option) =>
      selectedPermissions.includes(option.id)
    );

    setSelectedPermissions((prev) =>
      allSelected
        ? prev.filter(
          (permission) => !rolePermissions.options.some((option) => option.id === permission)
        )
        : [
          ...prev,
          ...rolePermissions.options
            .map((option) => option.id)
            .filter((id) => !prev.includes(id)),
        ]
    );
  };

  // Xử lý khi gửi biểu mẫu
  const onSubmit = async () => {
    if (!selectedRole) {
      setErrorMessage('Vui lòng chọn vai trò.');
      setOpenError(true);
      return;
    }

    if (selectedPermissions.length === 0) {
      setErrorMessage('Vui lòng chọn quyền hạn.');
      setOpenError(true);
      return;
    }

    try {
      // Xóa tất cả quyền cũ trước khi thêm quyền mới
      await dispatch(deleteRolePermissions(selectedRole));

      // Nếu không có permission nào được chọn, gửi dữ liệu trống cho permissions
      const rolePermissionsData = selectedPermissions.map((permissionId) => ({
        role_id: selectedRole,
        permission_id: permissionId,
      }));

      await dispatch(addRolePermissions(rolePermissionsData));
      setOpenSuccess(true);
      setTimeout(() => navigate('/permissions'), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message);
      setOpenError(true);
    }
  };

  // Nhóm quyền theo tiêu đề và lọc chỉ các quyền có ID số
  const groupPermissionsByTitle = (permissions) => {
    const groupedPermissions = permissions.reduce((acc, permission) => {
      if (!acc[permission.title]) {
        acc[permission.title] = { title: permission.title, options: [] };
      }

      if (permission.label && !isNaN(permission.id)) {
        acc[permission.title].options.push(permission);
      }

      return acc;
    }, {});

    return Object.values(groupedPermissions);
  };
  // Lọc và nhóm dữ liệu quyền hạn
  const filteredPermissionsData = groupPermissionsByTitle(
    (permissionsState.permissions || []).filter(group =>
      group.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
       <div className="container">
            <div className="page-inner">
                 <div className="row">
                      <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
                           <div className="card">
                                <div className="card-header">
                                     <div className="card-title">Set quyền vào vai trò</div>
                                </div>
                                <div className="card-body">
                                     <button type="submit" className="btn btn-primary mt-3 float-end">
                                          Áp dụng
                                     </button>
                                     <div className="mb-3 col-md-4">
                                          <select
                                               className={`form-select ${!hasPermission('Xem vai trò') ? 'is-invalid' : ''}`}
                                               onChange={(e) => {
                                                    const selectedId = parseInt(e.target.value);
                                                    setSelectedRole(selectedId);
                                               }}
                                               value={selectedRole || ''}
                                          >
                                               {hasPermission('Xem vai trò') ? (
                                                    <option value="">Chọn vai trò...</option>
                                               ) : (
                                                    <option value="" disabled>
                                                         Bạn không có quyền xem vai trò!
                                                    </option>
                                               )}
                                               {hasPermission('Xem vai trò') && (
                                                    <>
                                                         {/* <option value="">Chọn vai trò ...</option> */}
                                                         {roleState.role.map((role) => (
                                                              <option key={role.id} value={role.id}>
                                                                   {role.name}
                                                              </option>
                                                         ))}
                                                    </>
                                               )}
                                          </select>
                                     </div>
                                     <div className="mb-3 col-md-4">
                                          <input type="text" className="form-control" placeholder="Tìm kiếm nhóm quyền ở đây..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                     </div>
                                     {loading ? (
                                          <CustomSpinner />
                                     ) : (
                                          <>
                                               <h2 className="text-center my-4">Quản lý phân quyền</h2>
                                               <div className="row row-cols-1 row-cols-md-5">
                                                    {/* {filteredPermissionsData.map((group, index) => (
                        <div key={index} className="col mb-4">
                          <h4 className="fw-bold fs-6">{group.title}</h4>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`selectAll-${index}`}
                              onChange={() => handleSelectAll(group)}
                              checked={
                                group.options &&
                                group.options.length > 0 &&
                                group.options.every((option) => selectedPermissions.includes(option.id))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`selectAll-${index}`}
                            >
                              Chọn tất cả
                            </label>
                          </div>
                          {group.options.map((option) => (
                            <div key={option.id} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={option.id}
                                id={`option-${option.id}`}
                                checked={selectedPermissions.includes(option.id)}
                                onChange={() => handleCheckboxChange(option.id)}
                              />
                              <label className="form-check-label" htmlFor={`option-${option.id}`}>
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      ))} */}
                                                    {filteredPermissionsData.map((group, index) => (
                                                         <div key={index} className="col mb-4">
                                                              <h4 className="fw-bold fs-6">{group.title}</h4>
                                                              <div className="form-check">
                                                                   <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`selectAll-${index}`}
                                                                        onChange={() => handleSelectAll(group)}
                                                                        checked={group.options && group.options.length > 0 && group.options.every((option) => selectedPermissions.includes(option.id))}
                                                                   />
                                                                   <label className="form-check-label" htmlFor={`selectAll-${index}`}>
                                                                        Chọn tất cả
                                                                   </label>
                                                              </div>
                                                              {group.options.map((option) => (
                                                                   <div key={option.id} className="form-check">
                                                                        <input
                                                                             className="form-check-input"
                                                                             type="checkbox"
                                                                             value={option.id}
                                                                             id={`option-${option.id}`}
                                                                             onChange={() => handleCheckboxChange(option.id, option.label, group)}
                                                                              checked={selectedPermissions.includes(option.id)}
                                                                              disabled={option.label === 'Xem' && isViewDisabled(group)}
                                                                             
                                                                        />
                                                                        <label className="form-check-label" htmlFor={`option-${option.id}`}>
                                                                             {option.label}
                                                                        </label>
                                                                   </div>
                                                              ))}
                                                         </div>
                                                    ))}
                                               </div>
                                          </>
                                     )}
                                </div>
                           </div>
                      </form>
                      <SuccessAlert open={openSuccess} onClose={() => setOpenSuccess(false)} message="Thêm quyền vào vai trò thành công!" vertical="top" horizontal="right" />
                      <DangerAlert open={openError} onClose={() => setOpenError(false)} message={errorMessage} vertical="top" horizontal="right" />
                 </div>
            </div>
       </div>
  );
}
