import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Admin from './pages/Admin.jsx'
import About from './pages/About.jsx'
import LoginPage from './pages/Login.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import EditProduct from './pages/EditProduct.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import AdminLoginModal from './components/AdminLoginModal.jsx'
import { FaInstagram, FaFacebook, FaYoutube, FaXTwitter } from 'react-icons/fa6'

export default function App(){
  const [showLogin, setShowLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('token'))
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='app'>
          <header className='header container'>
            <div className='brand'><div className='logo'>🎨</div><h1>Art & Creative Shop</h1></div>
            <button className='hamburger' aria-label='Menu' onClick={()=>setMenuOpen(m=>!m)}>☰</button>
            <nav className={'nav ' + (menuOpen ? 'open' : '')}>
              <Link onClick={()=>setMenuOpen(false)} to='/' className='navlink'>Home</Link>
              <Link onClick={()=>setMenuOpen(false)} to='/about' className='navlink'>About Us</Link>
              {isAdmin ? <Link onClick={()=>setMenuOpen(false)} to='/admin' className='navlink'>Dashboard</Link> : <button className='navlink' onClick={()=>{ setMenuOpen(false); setShowLogin(true) }}>Admin</button>}
              <Link onClick={()=>setMenuOpen(false)} to='/login' className='navlink'>Login Page</Link>
            </nav>
          </header>

          <main>
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/about' element={<About/>} />
              <Route path='/admin' element={<Admin/>} />\n              <Route path='/admin/edit/:id' element={<EditProduct/>} />
              <Route path='/login' element={<LoginPage/>} />
              <Route path='/product/:id' element={<ProductDetail/>} />
            </Routes>
          </main>

          <footer className='footer'>
            <div className='container footgrid center'>
              <div className='social'>
                <a href='https://www.instagram.com/itzme85888/' aria-label='Instagram'><FaInstagram/></a>
                <a href='#' aria-label='Facebook'><FaFacebook/></a>
                <a href='#' aria-label='YouTube'><FaYoutube/></a>
                <a href='#' aria-label='X'><FaXTwitter/></a>
              </div>
              <p>© {new Date().getFullYear()} <strong>HandmadeHearts</strong></p>
            </div>
          </footer>

          {showLogin && <AdminLoginModal onClose={()=>setShowLogin(false)} onLoginSuccess={()=>setIsAdmin(true)}/>} 
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
