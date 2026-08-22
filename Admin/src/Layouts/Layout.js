import React from 'react'

import { Outlet } from 'react-router-dom';
import Header from '../Components/Header';
import MenuBar from '../Components/MenuBar';
import Footer from '../Components/Footer';

export default function Layout() {
    return (
        <div className='wrapper'>
            <MenuBar />
            <div className='main-panel'>
                <Header />
                <Outlet />
                <Footer />
            </div>
        </div>
    )
}
