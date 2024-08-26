import React, { useState } from 'react';
import Modal from 'react-modal';
import './css/NewTaskModal.css'; // Asegúrate de tener estilos para el modal
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Configura el elemento raíz del modal para accesibilidad
Modal.setAppElement('#root');

function NewTaskModal({ isOpen, onRequestClose, onTaskCreated }) {
  // Estados para los campos del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pendiente');
  const [priority, setPriority] = useState('media');

  // Fecha actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newTask = {
      title,
      description,
      due_date: dueDate,
      status,
      priority,
    };
  
    try {
      Swal.showLoading(); // Muestra el indicador de carga
  
      const response = await axios.post('http://127.0.0.1:8000/api/tasks', newTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Tarea Creada',
        text: 'La tarea se ha creado correctamente.',
      }).then(() => {
        if (onTaskCreated) {
          onTaskCreated(response.data.task);
        }
  
        // Restablece los campos del formulario
        resetForm();
  
        // Cierra el modal
        onRequestClose();
      });
  
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear la tarea. Por favor, inténtelo de nuevo.',
      });
  
      console.error('Error al crear la tarea:', error);
    }
  };

  // Restablece los campos del formulario
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('pendiente');
    setPriority('media');
  };

  // Maneja el cierre del modal
  const handleCloseModal = () => {
    resetForm();
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Crear Nueva Tarea"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Nueva Tarea</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="due_date">Fecha Límite:</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={today}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Prioridad:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Estado:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
        <div className="buttons-container">
          <button type="submit">Crear Tarea</button>
          <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cerrar</button>
        </div>
      </form>
    </Modal>
  );
}

export default NewTaskModal;
