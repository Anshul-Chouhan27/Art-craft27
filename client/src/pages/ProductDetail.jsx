import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api.js'
import '../pages/Productdetails.css';


// helper function to generate full image URL
const imageUrl = (path) => path ? `http://localhost:5000${path}` : '';

export default function ProductDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setItem(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className='container'>
        <p className='muted'>Loading…</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className='container'>
        <p className='error'>Not found</p>
      </div>
    );
  }

  return (
    <>
  <div className='container'>
    <div className='detail'>
      <div className='detail-img'>
        <div className='detail-media'>
          {item.image ? (
            <img src={imageUrl(item.image)} alt={item.title} />
          ) : (
            <div className='thumb placeholder'>No Image</div>
          )}
        </div>
      </div>

      <div className='detail-info'>
        <h2 className='headline'>{item.title}</h2>
        <p className='sub'>{item.description}</p>
        <p className='price-lg'>₹ {item.price?.toLocaleString()}</p>

        <div className='actions'>
          <a className='btn brand' href={item.buyUrl} target='_blank' rel='noreferrer'>
            Buy
          </a>
          <Link className='btn' to='/'>
            Back
          </Link>
        </div>
      </div>
    </div>
  </div>
</>
  );
}
