import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Modal from 'react-modal';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/Dashboard';
import Tasks from './components/tasks/Tasks';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import ProtectedRoute from './components/ProtectedRoute';

// Configura el elemento raíz del modal para accesibilidad
Modal.setAppElement('#root');

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <RedirectIfAuthenticated>
            <SignIn />
          </RedirectIfAuthenticated>
        } />
        <Route path="/register" element={
          <RedirectIfAuthenticated>
            <SignUp />
          </RedirectIfAuthenticated>
        } />
        <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />}>
          <Route path="tasks" element={<Tasks />} />
          {/* Agrega más rutas aquí */}
        </Route>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirige a SignIn si no hay una ruta definida */}
      </Routes>
    </Router>
  );
}

export default App;
