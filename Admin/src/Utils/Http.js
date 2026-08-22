import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const createHttpInstance = () => {
    const instance = axios.create({
        baseURL: 'http://localhost:4000/',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);

                // Kiểm tra thời gian hết hạn của token
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    // Token đã hết hạn, xóa token và điều hướng về trang đăng nhập
                    localStorage.removeItem('token');
                    const navigate = useNavigate();
                    navigate('/login');
                    return Promise.reject(new Error('Token expired'));
                }

                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            const navigate = useNavigate();
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem('token');
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

const http = createHttpInstance();

export default http;
