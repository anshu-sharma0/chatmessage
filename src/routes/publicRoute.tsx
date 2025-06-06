import { Outlet, Navigate } from 'react-router-dom';

const PublicRoute = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');

  return !isAuthenticated ? <Outlet /> : <Navigate to="/chat" replace />;
};

export default PublicRoute;
