import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'
import { Spinner } from '../components/UI'

export default function LoginPage() {
  const { login, register } = useApp()
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role,     setRole]     = useState('user')
  const [showPwd,  setShowPwd]  = useState(false)
  const [focused,  setFocused]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (isSignUp) {
      if (!username || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.')
        return
      }
      if (username.length < 3) {
        setError('Username must be at least 3 characters.')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      
      setLoading(true)
      try {
        await register({ username, email, password, role })
      } catch (err) {
        setError(err.message || 'Registration failed.')
        setLoading(false)
      }
    } else {
      if (!email || !password) {
        setError('Please fill in all fields.')
        return
      }
      setLoading(true)
      try {
        await login({ email, password })
      } catch (err) {
        setError(err.message || 'Invalid credentials. Try ayan38540@gmail.com / #Gondogol.com10')
        setLoading(false)
      }
    }
  }

  const inputStyle = (id) => ({
    width: '100%',
    background: 'var(--bg-raised)',
    border: `1px solid ${focused === id ? 'var(--accent)' : 'var(--border-default)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px 12px 44px',
    color: 'var(--text-primary)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease)',
    boxShadow: focused === id ? '0 0 0 3px var(--accent-glow)' : 'none',
  })

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg-base)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* ── Ambient orbs ──────────────────────────────────── */}
      <div style={{
        position: 'absolute', width: 560, height: 560,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,138,248,.08) 0%, transparent 70%)',
        top: -180, left: -140,
        animation: 'float-orb 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 420, height: 420,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,199,232,.06) 0%, transparent 70%)',
        bottom: -100, right: 80,
        animation: 'float-orb 11s ease-in-out 3s infinite',
        pointerEvents: 'none',
      }} />
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px)',
        backgroundSize: '38px 38px',
        pointerEvents: 'none',
      }} />

      {/* ── Left hero panel ───────────────────────────────── */}
      <div className="animate-fade-up" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 72px',
        position: 'relative', zIndex: 1,
        maxWidth: 580,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent), var(--info))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="warehouse" size={19} style={{ color: '#fff' }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 18,
            fontWeight: 700, letterSpacing: '-.4px',
          }}>
            <span style={{ color: 'var(--accent)' }}>Inv</span>Track
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}> Pro</span>
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 50, fontWeight: 800, lineHeight: 1.05,
          letterSpacing: '-2.5px', marginBottom: 20,
        }}>
          Inventory<br />
          <span style={{
            background: 'linear-gradient(105deg, var(--accent) 0%, var(--info) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Intelligence
          </span><br />
          Platform
        </h1>

        <p style={{
          color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.75,
          maxWidth: 380, marginBottom: 44,
        }}>
          Real-time stock monitoring across all categories — with smart threshold
          alerts, supplier tracking, and predictive reorder signals.
        </p>

        {/* Feature list */}
        {[
          { icon: 'check', text: 'Live sync across all 6 categories', color: 'var(--success)' },
          { icon: 'bell',  text: 'Smart reorder & critical alerts',   color: 'var(--accent)'  },
          { icon: 'bar',   text: 'Full analytics & value tracking',   color: 'var(--info)'    },
        ].map(({ icon, text, color }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: `${color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color, flexShrink: 0,
            }}>
              <Icon name={icon} size={11} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{text}</span>
          </div>
        ))}

        {/* Stats strip */}
        <div style={{
          display: 'flex', gap: 36, marginTop: 48,
          paddingTop: 32, borderTop: '1px solid var(--border-subtle)',
        }}>
          {[['54', 'Total SKUs'], ['6', 'Categories'], ['99.9%', 'Uptime']].map(([v, l]) => (
            <div key={l}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 24,
                fontWeight: 800, letterSpacing: '-1px', color: 'var(--text-primary)',
              }}>{v}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────── */}
      <div style={{
        width: 480, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 40,
        position: 'relative', zIndex: 1,
      }}>
        <div className="animate-fade-up delay-2" style={{
          width: '100%', maxWidth: 400,
          background: 'rgba(14,19,32,.88)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '42px 38px',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22, fontWeight: 700, letterSpacing: '-.5px', marginBottom: 6,
            }}>
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {isSignUp ? 'Get started with your workspace' : 'Sign in to your workspace'}
            </p>
          </div>

          {/* Tab Selection */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-raised)',
            borderRadius: 'var(--radius-md)',
            padding: 4,
            marginBottom: 20,
            border: '1px solid var(--border-default)'
          }}>
            <button
              type="button"
              disabled={loading}
              onClick={() => { setIsSignUp(false); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 0',
                background: !isSignUp ? 'rgba(91,138,248,.15)' : 'transparent',
                color: !isSignUp ? 'var(--accent)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all var(--duration) var(--ease)',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => { setIsSignUp(true); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 0',
                background: isSignUp ? 'rgba(91,138,248,.15)' : 'transparent',
                color: isSignUp ? 'var(--accent)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all var(--duration) var(--ease)',
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username (Sign Up Only) */}
            {isSignUp && (
              <div style={{ marginBottom: 14 }} className="animate-fade-up">
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600,
                  color: 'var(--text-secondary)', letterSpacing: '.5px',
                  textTransform: 'uppercase', marginBottom: 7,
                }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                    color: focused === 'username' ? 'var(--accent)' : 'var(--text-tertiary)',
                    transition: 'color var(--duration) var(--ease)', pointerEvents: 'none',
                  }}>
                    <Icon name="user" size={16} />
                  </div>
                  <input
                    type="text" value={username}
                    onChange={e => setUsername(e.target.value)}
                    onFocus={() => setFocused('username')}
                    onBlur={() => setFocused('')}
                    placeholder="Choose a username"
                    style={inputStyle('username')}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: 'var(--text-secondary)', letterSpacing: '.5px',
                textTransform: 'uppercase', marginBottom: 7,
              }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'email' ? 'var(--accent)' : 'var(--text-tertiary)',
                  transition: 'color var(--duration) var(--ease)', pointerEvents: 'none',
                }}>
                  <Icon name="user" size={16} />
                </div>
                <input
                  type="email" value={email} autoComplete="email"
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  placeholder="ayan38540@gmail.com"
                  style={inputStyle('email')}
                />
              </div>
            </div>

            {/* Role (Sign Up Only) */}
            {isSignUp && (
              <div style={{ marginBottom: 14 }} className="animate-fade-up">
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600,
                  color: 'var(--text-secondary)', letterSpacing: '.5px',
                  textTransform: 'uppercase', marginBottom: 7,
                }}>
                  Workspace Role
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: role === 'user' ? 'rgba(56,199,232,.15)' : 'var(--bg-raised)',
                      border: `1px solid ${role === 'user' ? 'var(--info)' : 'var(--border-default)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: role === 'user' ? 'var(--info)' : 'var(--text-secondary)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all var(--duration) var(--ease)',
                    }}
                  >
                    Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: role === 'admin' ? 'rgba(91,138,248,.15)' : 'var(--bg-raised)',
                      border: `1px solid ${role === 'admin' ? 'var(--accent)' : 'var(--border-default)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: role === 'admin' ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all var(--duration) var(--ease)',
                    }}
                  >
                    Inventory Manager
                  </button>
                </div>
              </div>
            )}

            {/* Password */}
            <div style={{ marginBottom: isSignUp ? 14 : 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{
                  fontSize: 11, fontWeight: 600,
                  color: 'var(--text-secondary)', letterSpacing: '.5px',
                  textTransform: 'uppercase',
                }}>
                  Password
                </label>
                {!isSignUp && (
                  <span style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>
                    Forgot?
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'password' ? 'var(--accent)' : 'var(--text-tertiary)',
                  transition: 'color var(--duration) var(--ease)', pointerEvents: 'none',
                }}>
                  <Icon name="lock" size={16} />
                </div>
                <input
                  type={showPwd ? 'text' : 'password'} value={password}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="••••••••••"
                  style={{ ...inputStyle('password'), paddingRight: 44 }}
                />
                <button
                  type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)', padding: 4,
                    display: 'flex', transition: 'color var(--duration) var(--ease)',
                  }}
                >
                  <Icon name={showPwd ? 'eyeoff' : 'eye'} size={16} />
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <div style={{ marginBottom: 22 }} className="animate-fade-up">
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600,
                  color: 'var(--text-secondary)', letterSpacing: '.5px',
                  textTransform: 'uppercase', marginBottom: 7,
                }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                    color: focused === 'confirmPassword' ? 'var(--accent)' : 'var(--text-tertiary)',
                    transition: 'color var(--duration) var(--ease)', pointerEvents: 'none',
                  }}>
                    <Icon name="lock" size={16} />
                  </div>
                  <input
                    type={showPwd ? 'text' : 'password'} value={confirmPassword}
                    autoComplete="new-password"
                    onChange={e => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocused('confirmPassword')}
                    onBlur={() => setFocused('')}
                    placeholder="••••••••••"
                    style={{ ...inputStyle('confirmPassword'), paddingRight: 44 }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px', marginBottom: 16,
                background: 'var(--danger-dim)',
                border: '1px solid rgba(240,82,82,.25)',
                borderRadius: 'var(--radius-md)',
                fontSize: 12, color: 'var(--danger)', fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? 'var(--bg-float)' : 'linear-gradient(135deg, #5b8af8, #38c7e8)',
                border: 'none', borderRadius: 'var(--radius-md)',
                color: '#fff', fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity var(--duration) var(--ease)',
                opacity: loading ? .7 : 1,
                letterSpacing: '.2px',
              }}
            >
              {loading && <Spinner size={16} color="#fff" />}
              {loading ? (isSignUp ? 'Creating account…' : 'Signing in…') : (isSignUp ? 'Create Account' : 'Sign in to Dashboard')}
            </button>
          </form>

          {/* Toggle link below form */}
          <div style={{
            marginTop: 20,
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--text-secondary)'
          }}>
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => { setIsSignUp(false); setError(''); }}
                  style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Sign In
                </span>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <span
                  onClick={() => { setIsSignUp(true); setError(''); }}
                  style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Sign Up
                </span>
              </>
            )}
          </div>

          {/* Demo hint */}
          {!isSignUp && (
            <div style={{
              marginTop: 18, padding: '12px 14px',
              background: 'var(--bg-raised)', borderRadius: 'var(--radius-md)',
              fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.7,
            }}>
              Demo credentials:<br />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>ayan38540@gmail.com</span>
              {' · '}
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>#Gondogol.com10</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
