import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSpinner from '../Components/Spinner/CustomSpinner';

const Redirect = ({ children }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const expiryTime = localStorage.getItem('expiryTime');
        const isAuthenticated = token && expiryTime && new Date().getTime() < Number(expiryTime);

        if (isAuthenticated) {
            navigate('/dashboard'); // Chuyển hướng đến dashboard nếu đã đăng nhập
        } else {
            setIsLoading(false); // Không chuyển hướng, dừng loading
        }
    }, [navigate]);

    // Hiển thị spinner ngay từ đầu
    return isLoading ? (
        <section className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#EEEEEE' }}>
            <CustomSpinner />
        </section>
    ) : (
        children // Nếu chưa đăng nhập, render children
    );
};

export default Redirect;
