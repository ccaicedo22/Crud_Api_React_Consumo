import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './css/SignIn.css'; // Asegúrate de importar el archivo CSS

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login', { email, password });
      console.log(response);
      localStorage.setItem('token', response.data.access_token); // Guarda el token en localStorage
      navigate('/dashboard'); // Redirige al dashboard
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: error.response?.data.error || 'Ocurrió un problema al iniciar sesión.',
      });
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-card">
        <h2 className="sign-in-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="sign-in-form">
          <label className="sign-in-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sign-in-input"
            required
          />
          <label className="sign-in-label" htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="sign-in-input"
            required
          />
          <button type="submit" className="sign-in-button">Iniciar Sesión</button>
          <p className="sign-in-register">
            ¿No tienes una cuenta? <a href="/register" className="sign-in-register-link">Regístrate</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
