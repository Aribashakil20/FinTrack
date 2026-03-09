'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback(async (creds) => {
    const { data } = await authApi.login(creds)
    localStorage.setItem('token', data.token)
    const u = { id: data.id, name: data.name, email: data.email }
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
    return data
  }, [])

  const register = useCallback(async (creds) => {
    const { data } = await authApi.register(creds)
    localStorage.setItem('token', data.token)
    const u = { id: data.id, name: data.name, email: data.email }
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
