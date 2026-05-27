import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react'

const AppContext = createContext(null)

const initialState = {
  user:      null,
  inventory: [],
  loading:   false,
  error:     null,
  toasts:    [],
  route:     'overview',
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, error: null }
    case 'LOGOUT':
      return { ...initialState }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload, loading: false, error: null }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'UPDATE_STOCK':
      return {
        ...state,
        inventory: state.inventory.map(item =>
          item.id === action.payload.id
            ? { ...item, stock: Math.max(0, item.stock + action.payload.delta), updatedAt: new Date().toISOString() }
            : item
        ),
      }
    case 'SET_ROUTE':
      return { ...state, route: action.payload }
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const toastId = useRef(0)
  const inventoryRef = useRef([])

  // Keep inventory list reference updated for stable callbacks
  inventoryRef.current = state.inventory

  const addToast = useCallback((message, variant = 'success') => {
    const id = ++toastId.current
    dispatch({ type: 'ADD_TOAST', payload: { id, message, variant } })
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3200)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }, [])

  const loadInventory = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8001/api/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.detail || 'Failed to fetch inventory');
      }
      
      const rawItems = resData.data || resData || [];
      
      const mappedItems = rawItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        sku: item.sku || 'SKU-UNKNOWN',
        stock: item.quantity,
        maxStock: item.quantity + (item.reorder_level || 10) + 120, // realistic max stock
        threshold: item.reorder_level || 10,
        price: item.price,
        supplier: item.supplier || 'NovaTech Supply',
        updatedAt: item.updated_at || item.created_at || new Date().toISOString()
      }));
      
      dispatch({ type: 'SET_INVENTORY', payload: mappedItems })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      addToast('Failed to load inventory: ' + err.message, 'danger')
    }
  }, [addToast])

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });
      
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.detail || resData.message || 'Invalid email or password');
      }
      
      const { access_token, user } = resData.data || resData;
      localStorage.setItem('token', access_token);
      
      const mappedUser = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role === 'admin' ? 'Inventory Manager' : 'Staff',
        initials: user.username ? user.username.substring(0, 2).toUpperCase() : 'US'
      };
      
      dispatch({ type: 'LOGIN', payload: mappedUser })
      
      // Load inventory immediately after login
      setTimeout(() => {
        loadInventory();
      }, 50);
      
      return mappedUser;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [loadInventory])

  const register = useCallback(async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await fetch('http://localhost:8001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role || 'user'
        })
      });
      
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.detail || resData.message || 'Registration failed');
      }
      
      const { access_token, user } = resData.data || resData;
      localStorage.setItem('token', access_token);
      
      const mappedUser = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role === 'admin' ? 'Inventory Manager' : 'Staff',
        initials: user.username ? user.username.substring(0, 2).toUpperCase() : 'US'
      };
      
      dispatch({ type: 'LOGIN', payload: mappedUser })
      
      setTimeout(() => {
        loadInventory();
      }, 50);
      
      return mappedUser;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [loadInventory])

  const updateStock = useCallback(async (id, delta) => {
    const item = inventoryRef.current.find(i => i.id === id);
    if (!item) return;
    
    const newQty = Math.max(0, item.stock + delta);
    
    // Optimistically update stock locally
    dispatch({ type: 'UPDATE_STOCK', payload: { id, delta } })
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8001/api/inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQty })
      });
      if (!response.ok) {
        throw new Error('Server refused update');
      }
      addToast(`Updated stock: ${delta > 0 ? '+' : ''}${delta} units`, 'success');
    } catch (err) {
      addToast('Sync failed: ' + err.message, 'danger');
      // Rollback optimistic update
      dispatch({ type: 'UPDATE_STOCK', payload: { id, delta: -delta } });
    }
  }, [addToast])

  const setRoute = useCallback((route) => {
    dispatch({ type: 'SET_ROUTE', payload: route })
  }, [])

  // Restore session on startup
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token')
      if (!token) return;
      
      try {
        const response = await fetch('http://localhost:8001/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await response.json();
        if (response.ok) {
          const user = resData.data || resData;
          const mappedUser = {
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role === 'admin' ? 'Inventory Manager' : 'Staff',
            initials: user.username ? user.username.substring(0, 2).toUpperCase() : 'US'
          };
          dispatch({ type: 'LOGIN', payload: mappedUser })
          loadInventory();
        } else {
          localStorage.removeItem('token')
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
      }
    };
    
    restoreSession();
  }, [loadInventory])

  return (
    <AppContext.Provider value={{ ...state, login, logout, register, loadInventory, updateStock, setRoute, addToast }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
