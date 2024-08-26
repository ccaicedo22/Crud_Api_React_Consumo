import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './css/TaskDetailModal.css'; // Asegúrate de tener estilos para el modal

Modal.setAppElement('#root');

function TaskDetailModal({ isOpen, onRequestClose, task }) {
  const [details, setDetails] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: '',
    priority: ''
  });

  useEffect(() => {
    if (task) {
      setDetails({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.due_date || '',
        status: task.status || 'pendiente',
        priority: task.priority || 'media'
      });
    }
  }, [task]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Detalles de la Tarea"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Detalles de la Tarea</h2>
      <div className="form-group">
        <label htmlFor="title">Título:</label>
        <p id="title">{details.title}</p>
      </div>
      <div className="form-group">
        <label htmlFor="description">Descripción:</label>
        <p id="description">{details.description}</p>
      </div>
      <div className="form-group">
        <label htmlFor="due_date">Fecha Límite:</label>
        <p id="due_date">{details.dueDate}</p>
      </div>
      <div className="form-group">
        <label htmlFor="priority">Prioridad:</label>
        <p id="priority">{details.priority}</p>
      </div>
      <div className="form-group">
        <label htmlFor="status">Estado:</label>
        <p id="status">{details.status}</p>
      </div>
      <button className="ok-btn" onClick={onRequestClose}>Aceptar</button>
    </Modal>
  );
}

export default TaskDetailModal;
