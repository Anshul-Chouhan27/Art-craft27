import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function EditProduct() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title:'', price:'', description:'', buyUrl:'' })
  const [file, setFile] = useState(null)
  const [product, setProduct] = useState(null)

  // Fetch product details for edit
  useEffect(()=>{
    api.get(`/products/${id}`).then(res=>{
      setProduct(res.data)
      setForm({
        title: res.data.title,
        price: res.data.price,
        description: res.data.description,
        buyUrl: res.data.buyUrl
      })
    })
  },[id])

  async function submit(e){
    e.preventDefault()
    if(!token){ alert('Please login first'); return }

    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('price', form.price)
    fd.append('description', form.description)
    fd.append('buyUrl', form.buyUrl)
    if(file) fd.append('image', file)   // if new file selected, update

    await api.put(`/products/${id}`, fd, { headers: {'Content-Type':'multipart/form-data'} })
    alert("Product updated successfully")
    navigate("/admin")   // redirect back to admin panel
  }

  if(!product) return <p>Loading...</p>

  return (
    <div className='container'>
      <h2 className='section-title'>Edit Product</h2>
      <form className='form' onSubmit={submit}>
        <div className='row'>
          <label>Title</label>
          <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        </div>

        <div className='row'>
          <label>Price</label>
          <input type='number' value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
        </div>

        <div className='row'>
          <label>Description</label>
          <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
        </div>

        <div className='row'>
          <label>Buy URL</label>
          <input type='url' value={form.buyUrl} onChange={e=>setForm({...form, buyUrl:e.target.value})} required />
        </div>

        <div className='row'>
          <label>Current Image</label><br/>
          {product.image ? (
            <img 
              src={`http://localhost:5000/${product.image}`} 
              alt="Current" 
              style={{ width:"150px", marginBottom:"10px" }}
            />
          ) : (
            <p>No image available</p>
          )}
        </div>

        <div className='row'>
          <label>Change Image</label>
          <input type='file' accept='image/*' onChange={e=>setFile(e.target.files?.[0] || null)} />
        </div>

        <button className='btn brand' type='submit'>Update Product</button>
      </form>
    </div>
  )
}
