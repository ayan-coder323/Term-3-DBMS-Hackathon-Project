import { memo, useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'
import { Card, SectionTitle, Spinner } from '../components/UI'
import defaultAvatar from '../default_avatar.png'

export default memo(function ProfilePage() {
  const { user, addToast } = useApp()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [editForm, setEditForm] = useState({ role: '', isActive: 1 })

  const fetchUsers = async (pageNumber) => {
    setLoadingUsers(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8001/api/users?page=${pageNumber}&size=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const resData = await response.json()
      if (response.ok) {
        setUsers(resData.data.content || [])
        setTotalPages(resData.data.totalPages || 0)
        setTotalElements(resData.data.totalElements || 0)
      } else {
        addToast(resData.message || 'Failed to fetch users', 'danger')
      }
    } catch (err) {
      addToast('Error fetching users: ' + err.message, 'danger')
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8001/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        addToast('User deleted successfully', 'success')
        fetchUsers(page)
      } else {
        const resData = await response.json()
        addToast(resData.message || 'Failed to delete user', 'danger')
      }
    } catch (err) {
      addToast('Error deleting user: ' + err.message, 'danger')
    }
  }

  const handleUpdateUser = async (id) => {
    try {
      const token = localStorage.getItem('token')
      console.log('[ProfilePage] Updating user', id, 'with:', editForm)
      const response = await fetch(`http://localhost:8001/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })
      const resData = await response.json()
      console.log('[ProfilePage] Update response:', response.status, resData)
      if (response.ok) {
        addToast('User updated successfully', 'success')
        setEditingUserId(null)
        fetchUsers(page)
      } else {
        addToast(resData.message || resData.detail || 'Failed to update user', 'danger')
      }
    } catch (err) {
      console.error('[ProfilePage] Update error:', err)
      addToast('Error updating user: ' + err.message, 'danger')
    }
  }

  useEffect(() => {
    if (user) {
      fetchUsers(page)
    }
  }, [page, user])

  if (!user) return null

  const isAdmin = user.role === 'Inventory Manager' || user.role === 'admin'

  return (
    <div style={{ padding: '28px 32px', maxWidth: 800 }}>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="animate-fade-up" style={{ marginBottom: 26 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-.7px', marginBottom: 4 }}>
          Account Center
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Manage your personal information and application permissions
        </p>
      </div>

      {/* ── Profile Card ─────────────────────────────────────── */}
      <Card className="animate-fade-up delay-1" style={{
        padding: '36px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 24,
      }}>
        {/* Subtle decorative glow orb */}
        <div style={{
          position: 'absolute', width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,138,248,.12) 0%, transparent 70%)',
          top: -60, right: -40, pointerEvents: 'none',
        }} />

        {/* Circular Avatar Section */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div style={{
            width: 124, height: 124,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--info))',
            padding: 3, // Ring border width
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0, 0, 0, .25)',
          }}>
            <img
              src={defaultAvatar}
              alt={user.name}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                background: 'var(--bg-surface)',
              }}
            />
          </div>
          {/* Active status indicator badge */}
          <span style={{
            position: 'absolute',
            bottom: 6,
            right: 6,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'var(--success)',
            border: '3px solid var(--bg-surface)',
            boxShadow: '0 2px 8px rgba(0,0,0,.3)',
          }} />
        </div>

        {/* User basic info */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-.5px',
          marginBottom: 6,
          color: 'var(--text-primary)',
        }}>
          {user.name}
        </h2>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: isAdmin ? 'var(--accent)' : 'var(--text-tertiary)',
          background: isAdmin ? 'rgba(91,138,248,.12)' : 'var(--bg-raised)',
          border: `1px solid ${isAdmin ? 'rgba(91,138,248,.25)' : 'var(--border-default)'}`,
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-block',
          marginBottom: 20,
        }}>
          {user.role}
        </span>

        {/* Info Grid */}
        <div style={{
          width: '100%',
          maxWidth: 560,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          textAlign: 'left',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 24,
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>
              Email address
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
              {user.email}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>
              Status
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
              Active System Session
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>
              Assigned Department
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
              Warehouse & Inventory Logistics
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>
              Authority Tier
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: isAdmin ? 'var(--accent)' : 'var(--text-secondary)' }}>
              {isAdmin ? 'Tier-1 Root Admin' : 'Tier-3 Read Only Access'}
            </div>
          </div>
        </div>
      </Card>

      {/* ── Permissions Card ─────────────────────────────────── */}
      <Card className="animate-fade-up delay-2" style={{ padding: '24px 30px' }}>
        <SectionTitle sub="Security context and actions allowed for your role group">
          Security & Permission Group
        </SectionTitle>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              title: 'View Dashboard & Metrics',
              desc: 'Allowed to access overall value tracking, category percentages, and statistics.',
              allowed: true
            },
            {
              title: 'Monitor Stock Levels & Warnings',
              desc: 'Allowed to read stock items and view low or critical reorder warnings.',
              allowed: true
            },
            {
              title: 'Refill / Adjust Stock Quantities',
              desc: 'Allowed to perform adjustments (+10 / -10 units) and request custom reorders.',
              allowed: isAdmin
            },
            {
              title: 'Create & Modify Product Items',
              desc: 'Allowed to introduce new SKUs, adjust descriptions, price points, and thresholds.',
              allowed: isAdmin
            },
            {
              title: 'Delete System Records',
              desc: 'Allowed to remove inventory item cards, category bindings, or purge items.',
              allowed: isAdmin
            }
          ].map(({ title, desc, allowed }) => (
            <div key={title} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: allowed ? 'rgba(34,214,143,.04)' : 'rgba(240,82,82,.03)',
              border: `1px solid ${allowed ? 'rgba(34,214,143,.15)' : 'rgba(240,82,82,.12)'}`,
              transition: 'transform var(--duration) var(--ease)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{
                color: allowed ? 'var(--success)' : 'var(--danger)',
                marginTop: 2,
                flexShrink: 0,
              }}>
                <Icon name={allowed ? 'check' : 'x'} size={15} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── User Directory Card ──────────────────────────────── */}
      <Card className="animate-fade-up delay-3" style={{ padding: '24px 30px', marginTop: 24 }}>
        <SectionTitle sub={`Total registered users: ${totalElements}`}>
          User Management Directory
        </SectionTitle>

        {loadingUsers ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spinner size={24} color="var(--accent)" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Username</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                  {isAdmin && <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-secondary)' }}>#{u.id}</td>
                    <td style={{ padding: '16px', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{u.username}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
                    
                    {/* Role Column */}
                    <td style={{ padding: '16px' }}>
                      {editingUserId === u.id ? (
                        <select 
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          style={{
                            background: 'var(--bg-raised)', border: '1px solid var(--border-default)',
                            color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '4px', fontSize: 13
                          }}
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      ) : (
                        <span style={{
                          fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                          color: u.role === 'admin' ? 'var(--accent)' : 'var(--text-secondary)',
                          background: u.role === 'admin' ? 'rgba(91,138,248,.1)' : 'var(--bg-raised)',
                          padding: '4px 10px', borderRadius: '12px'
                        }}>
                          {u.role}
                        </span>
                      )}
                    </td>

                    {/* Status Column */}
                    <td style={{ padding: '16px' }}>
                      {editingUserId === u.id ? (
                        <select 
                          value={editForm.isActive}
                          onChange={(e) => setEditForm({ ...editForm, isActive: parseInt(e.target.value) })}
                          style={{
                            background: 'var(--bg-raised)', border: '1px solid var(--border-default)',
                            color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '4px', fontSize: 13
                          }}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      ) : (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13,
                          color: u.isActive === 1 ? 'var(--success)' : 'var(--danger)'
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.isActive === 1 ? 'var(--success)' : 'var(--danger)' }} />
                          {u.isActive === 1 ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    {isAdmin && (
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        {editingUserId === u.id ? (
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button onClick={() => handleUpdateUser(u.id)} style={{ padding: '6px 12px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: 12, cursor: 'pointer' }}>Save</button>
                            <button onClick={() => setEditingUserId(null)} style={{ padding: '6px 12px', background: 'var(--bg-raised)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', borderRadius: '4px', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => {
                                setEditingUserId(u.id);
                                setEditForm({ role: u.role, isActive: u.isActive !== undefined ? u.isActive : 1 });
                              }} 
                              style={{ padding: '6px', background: 'transparent', color: 'var(--info)', border: 'none', cursor: 'pointer' }}
                              title="Edit User"
                            >
                              <Icon name="edit2" size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)} 
                              style={{ padding: '6px', background: 'transparent', color: 'var(--danger)', border: 'none', cursor: 'pointer' }}
                              title="Delete User"
                            >
                              <Icon name="trash2" size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
            <button 
              disabled={page === 0} 
              onClick={() => setPage(page - 1)}
              style={{ padding: '8px 16px', background: 'var(--bg-raised)', color: page === 0 ? 'var(--text-tertiary)' : 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: '6px', fontSize: 13, cursor: page === 0 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Page {page + 1} of {totalPages}
            </span>
            <button 
              disabled={page >= totalPages - 1} 
              onClick={() => setPage(page + 1)}
              style={{ padding: '8px 16px', background: 'var(--bg-raised)', color: page >= totalPages - 1 ? 'var(--text-tertiary)' : 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: '6px', fontSize: 13, cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        )}
      </Card>
    </div>
  )
})
