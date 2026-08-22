import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container-fluid d-flex justify-content-between">
                <nav className="pull-left">
                    <ul className="nav">
                        <li className="nav-item">
                        Hương Sen – Tịnh Chay Cho Mọi Hành Trình Tâm Thức
                        </li>
                    </ul>
                </nav>
                <div className="copyright">
                    2025, bản quyền thuộc về <Link to="/dashboard"> Trần Uyển</Link>
                </div>
            </div>
        </footer>
    )
}
