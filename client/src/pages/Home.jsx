import React, { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Link } from 'react-router-dom'

export default function Home(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products')
      .then(r => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className='container'>
      <section className='hero'>
        <h2 className='headline'>Unique Art & Creative Pieces</h2>
        <p className='sub'>Handmade • Limited • Designed for your vibe</p>
      </section>

      {loading && <p className='muted'>Loading…</p>}

      <div className='grid'>
        {items.map(p => (
          <div key={p._id} className='card'>
            <Link to={`/product/${p._id}`} className='linkcard'>
              {p.image ? (
                <img
                  className="thumb"
                  src={p.image}   // ✅ Cloudinary URL directly
                  alt={p.title}
                />
              ) : (
                <div className="thumb placeholder">No Image</div>
              )}
            </Link>

            <div className="card-body">
              <h3 className="title">{p.title}</h3>
              <p className="desc">{p.description}</p>

              <div className="meta">
                <span className="price">₹ {p.price?.toLocaleString()}</span>
                {p.buyUrl && (
                  <a
                    className="btn brand"
                    href={p.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy Now
                  </a>
                )}
              </div>

              <div className="actions">
                <Link to={`/product/${p._id}`} className="btn">
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
