import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Dashboard.css';
import './tasks/css/Tasks.css';

function Dashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true); // Controla el estado del sidebar
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
    };
  
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
  
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen); // Alterna el estado del sidebar
    };
    
    const handleLogoClick = () => {
        navigate('/dashboard');
    };

    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="user-logo">
            <FaUserCircle
              size={40} // Tamaño del ícono
              className="user-logo-icon"
              onClick={toggleMenu}
            />
            {menuOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleLogout}>
                  <FaSignOutAlt /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>
        <aside className={`sidebar ${!sidebarOpen ? 'closed' : ''}`}>
          <div className="sidebar-header">
            <img
              src="/images/logo_empresa_prueba.png" 
              alt="Sidebar"
              className="sidebar-img"
              onClick={handleLogoClick}
            />                        
          </div>
          <h2 className="sidebar-title">Panel de Control</h2>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <Link to="/dashboard/tasks">Tareas</Link>
              </li>
              {/* Agrega más módulos aquí */}
            </ul>
          </nav>
        </aside>
        <button className={`sidebar-toggle ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
          {/* Icono de toggle */}
          <FaSignOutAlt />
        </button>
        <main className="main-content">
          <Outlet /> {/* Donde se renderizarán las rutas anidadas */}
          
        </main>
      </div>
    );
  }
  
  export default Dashboard;