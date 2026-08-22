import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import React from 'react';

import { publicAdminRoutes } from './Routes/routes';
import NotFound from './Components/NotFound';
import Layout from './Layouts/Layout';
import Login from './Pages/Authentication/Login';
import Otp from './Pages/Authentication/Otp';
import Forgot from './Pages/Authentication/Forgot';
import ProtectedRoute from './Components/ProtectedRoute';
import Redirect from './Components/Redirect';
import './App.css';

import ReservationDetail from './Pages/Reservations/ReservationDetail';
import ReservationDetailTable from './Pages/Reservations/ReservationDetailTable';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/login" element={<Redirect><Login /></Redirect>} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/forgot" element={<Forgot />} />

          <Route path="" element={<ProtectedRoute element={<Layout />} requiredPermissions={[]} />}>
            {publicAdminRoutes.map(({ path, component: Component, permissions }) => (
              <Route 
                key={path} 
                path={path} 
                element={<ProtectedRoute element={<Component />} requiredPermissions={permissions || []} />} 
              />
            ))}
          </Route>

          <Route path="reservation/detail/:id" element={<ProtectedRoute element={<ReservationDetail />} requiredPermissions={["Xem chi tiết đặt bàn"]} />} />
          <Route path="reservation/detail/table/:id" element={<ProtectedRoute element={<ReservationDetailTable />} requiredPermissions={["Xem chi tiết đặt bàn"]} />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;