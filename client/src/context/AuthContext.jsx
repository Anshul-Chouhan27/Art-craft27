import React, { createContext, useContext, useState } from 'react'

const AuthCtx = createContext(null)
export function AuthProvider({ children }){
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  function login(t){ setToken(t); localStorage.setItem('token', t) }
  function logout(){ setToken(''); localStorage.removeItem('token') }
  return <AuthCtx.Provider value={{ token, login, logout }}>{children}</AuthCtx.Provider>
}
export function useAuth(){ return useContext(AuthCtx) }
