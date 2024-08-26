import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './css/SignUp.css'; // Asegúrate de importar el archivo CSS

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/auth/register', { name, email, password });
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión.',
      }).then(() => navigate('/login')); // Cambiado de '/signin' a '/login'
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: error.response?.data.error || 'Ocurrió un problema al registrar la cuenta.',
      });
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-card">
        <h2 className="sign-up-title">Registrarse</h2>
        <form onSubmit={handleSubmit} className="sign-up-form">
          <label className="sign-up-label" htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            placeholder="Ingresa tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="sign-up-input"
            required
          />
          <label className="sign-up-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sign-up-input"
            required
          />
          <label className="sign-up-label" htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="sign-up-input"
            required
          />
          <label className="sign-up-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="sign-up-input"
            required
          />
          <button type="submit" className="sign-up-button">Registrarse</button>
          <p className="sign-up-login">
            ¿Ya tienes una cuenta? <a href="/login" className="sign-up-login-link">Inicia sesión</a> {/* Cambiado de '/signin' a '/login' */}
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;

