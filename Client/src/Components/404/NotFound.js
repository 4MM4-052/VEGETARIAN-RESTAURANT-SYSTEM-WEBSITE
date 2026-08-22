import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className='d-flex vh-100 justify-content-center align-items-center bg-light'>
            <div className="text-center" style={{ fontFamily: 'Times New Roman', fontWeight: 'bold' }}>
                <h1 className="display-1 text-dark" style={{ fontFamily: 'Times New Roman', fontSize: '8rem' }}>404</h1>
                <p className="h4 mb-4" style={{ fontFamily: 'Times New Roman', fontSize: '2rem' }}>Trang không tìm thấy</p>
                <p className="lead" style={{ fontFamily: 'Times New Roman', fontSize: '1.6rem' }}>Rất tiếc, trang bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
                <Link to="/" className="btn btn-primary mt-3" style={{ fontFamily: 'Times New Roman', fontSize: '1.5rem' }}>Trở về trang chủ</Link>
            </div>
        </div>
    )
}
