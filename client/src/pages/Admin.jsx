import React, { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

export default function Admin(){
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title:'', price:'', description:'', buyUrl:'' })
  const [file, setFile] = useState(null)

  useEffect(()=>{
    api.get('/products')
      .then(r=>setItems(r.data))
      .catch(()=>{})
  },[])

  async function submit(e){
    e.preventDefault()
    if(!token){ alert('Please login first'); return }
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('price', form.price)
    fd.append('description', form.description)
    fd.append('buyUrl', form.buyUrl)
    if(file) fd.append('image', file)

    await api.post('/products', fd, { headers: {'Content-Type':'multipart/form-data'} })
    const { data } = await api.get('/products')
    setItems(data)
    setForm({ title:'', price:'', description:'', buyUrl:'' })
    setFile(null)
  }

  async function remove(id){
    if(!token){ alert('Please login first'); return }
    if(!confirm('Delete?')) return
    await api.delete(`/products/${id}`)
    const { data } = await api.get('/products')
    setItems(data)
  }

  return (
    <div className='container'>
      <h2 className='section-title'>Admin Panel</h2>
      {!token && <p className='muted'>You are not logged in. Click Admin in header to login.</p>}

      {/* Product Form */}
      <form className='form' onSubmit={submit}>
        <div className='row'><label>Title</label><input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required /></div>
        <div className='row'><label>Price</label><input type='number' value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required /></div>
        <div className='row'><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required /></div>
        <div className='row'><label>Buy URL</label><input type='url' value={form.buyUrl} onChange={e=>setForm({...form, buyUrl:e.target.value})} required /></div>
        <div className='row'><label>Image (upload)</label><input type='file' accept='image/*' onChange={e=>setFile(e.target.files?.[0] || null)} /></div>
        <button className='btn brand' type='submit'>Save Product</button>
      </form>

      {/* Product List */}
      <h3 className='section-title'>Products</h3>
      <div className='grid'>
        {items.map(p=>(
          <div key={p._id} className='card'>
            {p.image && (
              <img 
                src={p.image} 
                alt={p.title} 
                style={{ width:"100%", height:"200px", objectFit:"cover" }}
              />
            )}
            <div className='card-body'>
              <h4>{p.title}</h4>
              <p>{p.description}</p>
              <p><strong>Price:</strong> ₹ {p.price}</p>
              <div className='row'>
                <a className='btn' href={p.buyUrl} target='_blank' rel='noreferrer'>Buy Link</a>
                <Link to={`/admin/edit/${p._id}`} className='btn'>Edit</Link>
                <button className='btn danger' onClick={()=>remove(p._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
