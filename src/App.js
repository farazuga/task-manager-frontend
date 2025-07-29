import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://personal-task-manager-api-production-e76c.up.railway.app';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks);
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (err) {
      setError('Error connecting to API');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      const data = await response.json();
      if (data.success) {
        setTasks([...tasks, data.task]);
        setNewTask({ title: '', description: '' });
        setError('');
      } else {
        setError('Failed to create task');
      }
    } catch (err) {
      setError('Error creating task');
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map(task => 
          task.id === taskId ? data.task : task
        ));
      } else {
        setError('Failed to update task');
      }
    } catch (err) {
      setError('Error updating task');
      console.error('Update error:', err);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        setError('Failed to delete task');
      }
    } catch (err) {
      setError('Error deleting task');
      console.error('Delete error:', err);
    }
  };

  // Load tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Get task statistics
  const getStats = () => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    return { completed, pending, total: tasks.length };
  };

  const stats = getStats();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>Task Manager</h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: '0.9'
          }}>Connected to your live Railway API</p>
        </header>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: '0',
                width: '24px',
                height: '24px'
              }}
            >
              ×
            </button>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'transform 0.2s'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#4f46e5',
              marginBottom: '0.5rem'
            }}>{stats.total}</div>
            <div style={{ color: '#6b7280', fontWeight: '500' }}>Total Tasks</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'transform 0.2s'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '0.5rem'
            }}>{stats.pending}</div>
            <div style={{ color: '#6b7280', fontWeight: '500' }}>Pending</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'transform 0.2s'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '0.5rem'
            }}>{stats.completed}</div>
            <div style={{ color: '#6b7280', fontWeight: '500' }}>Completed</div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#374151'
          }}>Add New Task</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <textarea
              placeholder="Task description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                minHeight: '80px'
              }}
              rows="3"
            />
            <button
              onClick={createTask}
              disabled={loading || !newTask.title.trim()}
              style={{
                width: '100%',
                background: loading || !newTask.title.trim() ? '#9ca3af' : '#4f46e5',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading || !newTask.title.trim() ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#374151'
          }}>Your Tasks</h2>
          {loading && tasks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#6b7280',
              fontSize: '1.1rem'
            }}>Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#6b7280',
              fontSize: '1.1rem'
            }}>
              <p>No tasks yet! Add your first task above.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  style={{
                    border: `2px solid ${task.status === 'completed' ? '#bbf7d0' : '#e5e7eb'}`,
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    background: task.status === 'completed' ? '#f0fdf4' : '#f9fafb',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: task.status === 'completed' ? '#6b7280' : '#111827',
                        marginBottom: '0.5rem',
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                      }}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p style={{
                          color: '#6b7280',
                          marginBottom: '1rem',
                          lineHeight: '1.5'
                        }}>{task.description}</p>
                      )}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        marginBottom: '1rem'
                      }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          background: task.status === 'completed' ? '#d1fae5' : '#fef3c7',
                          color: task.status === 'completed' ? '#065f46' : '#92400e'
                        }}>
                          {task.status}
                        </span>
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#9ca3af'
                        }}>
                          Created: {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginLeft: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        onClick={() => updateTaskStatus(
                          task.id, 
                          task.status === 'completed' ? 'pending' : 'completed'
                        )}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: task.status === 'completed' ? '#fef3c7' : '#dcfce7',
                          color: task.status === 'completed' ? '#92400e' : '#166534'
                        }}
                      >
                        {task.status === 'completed' ? '↶ Reopen' : '✓ Complete'}
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: '#fee2e2',
                          color: '#dc2626'
                        }}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;