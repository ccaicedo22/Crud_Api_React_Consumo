// Tasks.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import NewTaskModal from './NewTaskModal';
import EditTaskModal from './EditTaskModal';
import TaskDetailModal from './TaskDetailModal';
import Swal from 'sweetalert2';
import './css/Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToShow, setTaskToShow] = useState(null); // Estado para la tarea a mostrar en detalle
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemsPerPage] = useState(5);

  // Estados para los filtros
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [currentPage]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          page: currentPage,
          per_page: itemsPerPage,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
        },
      });
      setTasks(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
      setTotalRecords(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      await fetchTasks();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      await fetchTasks();
      setIsEditModalOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleShowDetails = (task) => {
    setTaskToShow(task);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#f0ad4e',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          Swal.fire(
            'Eliminado!',
            'La tarea ha sido eliminada.',
            'success'
          );

          await fetchTasks();
        } catch (error) {
          Swal.fire(
            'Error',
            'Hubo un error al eliminar la tarea. Por favor, inténtelo de nuevo.',
            'error'
          );

          console.error('Error deleting task:', error);
        }
      }
    });
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchTasks();
  };

  return (
    <div className="tasks-container">
      <h2>Lista de Tareas</h2>
      <div className="filters">
        <div className="filter-group">
          <div className="filter-group-item">
            <label htmlFor="status">Estado:</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>
          <div className="filter-group-item">
            <label htmlFor="priority">Prioridad:</label>
            <select
              id="priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>
        <button className="filter-btn" onClick={handleFilter}>Filtrar</button>
      </div>

      <button className="new-task-btn" onClick={() => setIsCreateModalOpen(true)}>
        Nueva Tarea
      </button>
      <div className="tasks-list-container">
        <ul className="tasks-list">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div className="task-details">
                  <h3 onClick={() => handleShowDetails(task)}>{task.title}</h3>
                  <p>Estado: {task.status}</p>
                  <p>Prioridad: {task.priority}</p>
                </div>
                <div className="task-actions">
                  <button className="action-btn edit-btn" onClick={() => handleEdit(task)}>
                    <FaEdit />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(task.id)}>
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="no-tasks-message">No hay tareas disponibles.</p>
          )}
        </ul>
      </div>
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <FaArrowLeft />
        </button>
        <span className="pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <FaArrowRight />
        </button>
        <div className="pagination-details">
          <p>Total de registros: {totalRecords}</p>
          <p>Registros por página: {itemsPerPage}</p>
        </div>
      </div>
      <NewTaskModal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleCreateTask}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        task={taskToEdit}
        onTaskUpdated={handleEditTask}
      />
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onRequestClose={() => setIsDetailModalOpen(false)}
        task={taskToShow}
      />
    </div>
  );
}

export default Tasks;