import React, { useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLoginModal({ onClose, onLoginSuccess }){
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  async function submit(e){
    e.preventDefault()
    setError('')
    try{
      const { data } = await api.post('/auth/login', { password })
      login(data.token)
      onLoginSuccess?.()
      onClose()
    }catch(err){
      setError(err.response?.data?.error || 'Invalid password')
    }
  }

  return (
    <div className='modalOverlay'>
      <div className='modal'>
        <h3>Admin Login</h3>
        {error && <p className='error'>{error}</p>}
        <form onSubmit={submit}>
          <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Enter admin password' required />
          <button className='btn brand' type='submit'>Login</button>
        </form>
        <button className='btn' onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
