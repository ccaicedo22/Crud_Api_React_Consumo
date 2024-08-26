import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './css/EditTaskModal.css';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Configura el elemento raíz del modal para accesibilidad
Modal.setAppElement('#root');

function EditTaskModal({ isOpen, onRequestClose, task, onTaskUpdated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pendiente');
  const [priority, setPriority] = useState('media');

  // Fecha actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Llenar los campos con los datos de la tarea existente cuando se abre el modal
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.due_date || '');
      setStatus(task.status || 'pendiente');
      setPriority(task.priority || 'media');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = {
      title,
      description,
      due_date: dueDate,
      status,
      priority,
    };

    try {
      Swal.showLoading(); // Muestra el indicador de carga

      const response = await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Tarea Actualizada',
        text: 'La tarea se ha actualizado correctamente.',
      }).then(() => {
        if (onTaskUpdated) {
          onTaskUpdated(response.data.task); // Pasar la tarea actualizada
        }

        onRequestClose(); // Cierra el modal
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al actualizar la tarea. Por favor, inténtelo de nuevo.',
      });

      console.error('Error al actualizar la tarea:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Editar Tarea"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Editar Tarea</h2>
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
          <button type="submit">Actualizar Tarea</button>
          <button type="button" className="cancel-btn" onClick={onRequestClose}>Cerrar</button>
        </div>
      </form>
    </Modal>
  );
}

export default EditTaskModal;
