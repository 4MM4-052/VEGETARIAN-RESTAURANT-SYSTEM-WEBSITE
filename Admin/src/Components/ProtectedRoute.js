import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { getPermissions } from '../Actions/GetQuyenHanAction';
import NotPermission from './NotPermission';

const ProtectedRoute = ({ element, requiredPermissions }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const token = localStorage.getItem('token');
    const expiryTime = localStorage.getItem('expiryTime');

    const getQuyenHanState = useSelector(state => state.getQuyenHan);

    const expiryTimeNumber = expiryTime ? Number(expiryTime) : null;
    const isAuthenticated = token && expiryTimeNumber && new Date().getTime() < expiryTimeNumber;

    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.removeItem('token');
            localStorage.removeItem('expiryTime');
            navigate('/login');
        } else {
            if (token && typeof token === "string") {
                const decodedToken = jwt_decode(token);
                const userIdFromToken = decodedToken.id;
                dispatch(getPermissions(userIdFromToken));
            }
        }
    }, [isAuthenticated, navigate, dispatch]);

    // Kiểm tra quyền hạn
    const hasRequiredPermissions = (permissions) => {
        const permissionMap = {
            // "Xem danh mục sản phẩm": ["Xem danh mục sản phẩm", "Thêm sản phẩm và Xem danh mục sản phẩm"],
            // "Thêm sản phẩm và Xem danh mục sản phẩm": ["Xem danh mục sản phẩm", "Thêm sản phẩm và Xem danh mục sản phẩm"],
        };

        if (!getQuyenHanState || !getQuyenHanState.getQuyenHan || !getQuyenHanState.getQuyenHan.data) {
            return false; // Nếu chưa có quyền hạn
        }

        const userPermissions = getQuyenHanState.getQuyenHan.data.map(permission => permission.name);
        // return permissions.some(permission => userPermissions.includes(permission));
        
        // Mở rộng danh sách quyền yêu cầu
        const expandedPermissions = permissions.flatMap(permission => permissionMap[permission] || [permission]);

        // Kiểm tra nếu bất kỳ quyền nào khớp
        return expandedPermissions.some(permission => userPermissions.includes(permission));
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Nếu không có yêu cầu quyền hạn, cho phép truy cập
    if (requiredPermissions && requiredPermissions.length > 0 && !hasRequiredPermissions(requiredPermissions)) {
        return <NotPermission />;
    }

    return element;
};

export default ProtectedRoute;