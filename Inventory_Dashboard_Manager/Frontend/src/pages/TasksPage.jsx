import { memo, useState, useEffect, useCallback, useRef } from 'react'
import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'
import { Card, Spinner } from '../components/UI'

const PER_PAGE = 10

export default memo(function TasksPage() {
  const { user, addToast } = useApp()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [taskData, setTaskData] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // User dropdown state
  const [allUsers, setAllUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const userDropdownRef = useRef(null)

  const loadTasks = useCallback(async (p = 0) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:8001/api/tasks/getalltasks/${p + 1}/${PER_PAGE}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.code === 200) {
        setTasks(data.tasks || [])
        setTotalPages(data.totalpages || 1)
        setPage(p)
      } else {
        addToast(data.message || 'Failed to load tasks', 'error')
      }
    } catch (err) {
      addToast('Error loading tasks', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadTasks(0)
  }, [loadTasks])

  const handleEdit = (task) => {
    setTaskData(task)
    const found = allUsers.find(u => u.id === task.assignedto)
    setUserSearch(found ? found.email : '')
    setShowModal(true)
  }

  const handleCreate = () => {
    setTaskData({
      title: '', description: '', assignedto: 0, priority: 0, deadline: '', status: 0, category: 'general'
    })
    setUserSearch('')
    setShowModal(true)
  }

  // Fetch all user emails for the dropdown
  const loadUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:8001/api/users/emails', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.code === 200 && data.data) {
        setAllUsers(data.data)
      }
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  // Load users when modal opens
  useEffect(() => {
    if (showModal) {
      loadUsers()
    }
  }, [showModal, loadUsers])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get display text for assigned user
  const getAssignedUserEmail = () => {
    if (!taskData || !taskData.assignedto) return ''
    const found = allUsers.find(u => u.id === taskData.assignedto)
    return found ? found.email : ''
  }

  // Filter users by search query
  const filteredUsers = allUsers.filter(u =>
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:8001/api/tasks/deletetask/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.code === 200) {
        addToast('Task deleted successfully', 'success')
        loadTasks(page)
      } else {
        addToast(data.message || 'Failed to delete task', 'error')
      }
    } catch (err) {
      addToast('Error deleting task', 'error')
    }
  }

  const handleSave = async () => {
    if (!taskData.title || !taskData.deadline) {
      addToast('Title and Deadline are required', 'error')
      return
    }
    
    setIsSaving(true)
    try {
      const token = localStorage.getItem('token')
      const isUpdate = !!taskData._id
      const url = isUpdate ? `http://localhost:8001/api/tasks/updatetask/${taskData._id}` : `http://localhost:8001/api/tasks/createtask`
      const method = isUpdate ? 'PUT' : 'POST'
      
      const payload = {
        title: taskData.title,
        description: taskData.description,
        assignedto: parseInt(taskData.assignedto) || 0,
        priority: parseInt(taskData.priority) || 0,
        deadline: taskData.deadline,
        status: parseInt(taskData.status) || 0,
        category: taskData.category || 'general'
      }

      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      if (data.code === 200) {
        addToast(`Task ${isUpdate ? 'updated' : 'created'} successfully`, 'success')
        setShowModal(false)
        loadTasks(page)
      } else {
        addToast(data.message || `Failed to ${isUpdate ? 'update' : 'create'} task`, 'error')
      }
    } catch (err) {
      addToast(`Error ${taskData._id ? 'updating' : 'creating'} task`, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)', padding: '9px 12px', color: 'var(--text-primary)',
    fontSize: 13, outline: 'none', marginBottom: 12
  }

  return (
    <div style={{ padding: '28px 32px' }}>
      <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-.7px', marginBottom: 4 }}>
            Task Manager
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Manage and track inventory assignments
          </p>
        </div>
        <button
          onClick={handleCreate}
          style={{
            background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
            padding: '0 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', height: 36,
            display: 'flex', alignItems: 'center', gap: 6, transition: 'all var(--duration) var(--ease)'
          }}
        >
          <Icon name="plus" size={14} /> New Task
        </button>
      </div>

      <Card className="animate-fade-up delay-1" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
            <thead>
              <tr>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '.5px', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', width: '25%' }}>Task</th>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '.5px', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>Priority</th>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '.5px', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>Status</th>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '.5px', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>Deadline</th>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '.5px', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>Category</th>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '.5px', textTransform: 'uppercase', textAlign: 'right', borderBottom: '1px solid var(--border-subtle)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}><Spinner /></td></tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ marginBottom: 12, color: 'var(--text-tertiary)' }}><Icon name="box" size={40} strokeWidth={1} /></div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No tasks found</div>
                  </td>
                </tr>
              ) : tasks.map((task, idx) => (
                <tr key={task._id} style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.013)' }}>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 1 }}>{task.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{task.description}</div>
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: task.priority === 1 ? 'var(--danger)' : 'var(--text-primary)' }}>
                    {task.priority === 1 ? 'High' : 'Normal'}
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: task.status === 2 ? 'var(--success)' : task.status === 1 ? 'var(--warning)' : 'var(--info)' }}>
                    {task.status === 2 ? 'Completed' : task.status === 1 ? 'In-Progress' : 'Assigned'}
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 12 }}>{task.deadline}</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      {task.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(task)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginRight: 10 }}><Icon name="edit2" size={14} /></button>
                    <button onClick={() => handleDelete(task._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Icon name="trash2" size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', gap: 6 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => loadTasks(i)} style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: page === i ? 'var(--accent)' : 'var(--bg-raised)', border: `1px solid ${page === i ? 'var(--accent)' : 'var(--border-default)'}`, color: page === i ? '#fff' : 'var(--text-secondary)', fontSize: 12, fontWeight: page === i ? 700 : 400, cursor: 'pointer' }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </Card>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 460, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{taskData._id ? 'Edit Task' : 'New Task'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><Icon name="x" size={18} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Title</label>
              <input style={inputStyle} value={taskData.title} onChange={e => setTaskData({...taskData, title: e.target.value})} placeholder="e.g. Restock Laptops" />
              
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Description</label>
              <textarea style={{...inputStyle, height: 60, resize: 'none'}} value={taskData.description} onChange={e => setTaskData({...taskData, description: e.target.value})} placeholder="Task details..." />

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1, position: 'relative' }} ref={userDropdownRef}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Assigned to</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={inputStyle}
                      value={userSearch || getAssignedUserEmail()}
                      onChange={e => {
                        setUserSearch(e.target.value)
                        setShowUserDropdown(true)
                        if (e.target.value === '') {
                          setTaskData({...taskData, assignedto: 0})
                        }
                      }}
                      onFocus={() => setShowUserDropdown(true)}
                      placeholder="Search by email or username..."
                      autoComplete="off"
                    />
                    {loadingUsers && (
                      <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                        <Spinner />
                      </div>
                    )}
                  </div>
                  {showUserDropdown && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
                      background: 'var(--bg-raised)', border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)', maxHeight: 180, overflowY: 'auto',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)', marginTop: -8
                    }}>
                      {filteredUsers.length === 0 ? (
                        <div style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          {loadingUsers ? 'Loading users...' : 'No users found'}
                        </div>
                      ) : filteredUsers.map(u => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setTaskData({...taskData, assignedto: u.id})
                            setUserSearch(u.email)
                            setShowUserDropdown(false)
                          }}
                          style={{
                            padding: '8px 12px', cursor: 'pointer', fontSize: 12,
                            borderBottom: '1px solid var(--border-subtle)',
                            transition: 'background 0.15s',
                            background: taskData.assignedto === u.id ? 'rgba(99,102,241,0.15)' : 'transparent'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = taskData.assignedto === u.id ? 'rgba(99,102,241,0.15)' : 'transparent'}
                        >
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{u.email}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1 }}>@{u.username}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Category</label>
                  <input style={inputStyle} value={taskData.category} onChange={e => setTaskData({...taskData, category: e.target.value})} placeholder="restock, audit..." />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Priority</label>
                  <select style={inputStyle} value={taskData.priority} onChange={e => setTaskData({...taskData, priority: e.target.value})}>
                    <option value={0}>Normal</option>
                    <option value={1}>High</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Status</label>
                  <select style={inputStyle} value={taskData.status} onChange={e => setTaskData({...taskData, status: e.target.value})}>
                    <option value={0}>Assigned</option>
                    <option value={1}>In-Progress</option>
                    <option value={2}>Completed</option>
                  </select>
                </div>
              </div>

              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Deadline (YYYY-MM-DD)</label>
              <input type="date" style={inputStyle} value={taskData.deadline} onChange={e => setTaskData({...taskData, deadline: e.target.value})} />

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: 'var(--bg-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button onClick={handleSave} disabled={isSaving} style={{ flex: 1, padding: '10px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>{isSaving ? 'Saving...' : 'Save Task'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
