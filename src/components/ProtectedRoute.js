import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element }) => {
  const token = localStorage.getItem('token'); // Obtener el token del localStorage
  const isAuthenticated = !!token; // Verifica si hay un token
  return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
