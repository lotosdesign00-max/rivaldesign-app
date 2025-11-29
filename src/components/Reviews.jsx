import React, {useState} from 'react'
import reviews from '../data/reviews.json'

export default function Reviews(){
  const [list] = useState(reviews)
  return (
    <div className="card">
      <h3>Отзывы</h3>
      <div className="muted">Короткие карточки клиентов</div>
      <div style={{display:'flex', gap:12, overflowX:'auto', paddingTop:12}}>
        {list.map(r => (
          <div key={r.id} style={{minWidth:220}} className="card">
            <div style={{display:'flex',gap:10,alignItems:'center'}}>
              <img src={r.avatar} style={{width:48,height:48,borderRadius:24,objectFit:'cover'}} />
              <div>
                <div style={{fontWeight:700}}>{r.name}</div>
                <div className="muted" style={{fontSize:12}}>{r.role || ''}</div>
              </div>
            </div>
            <p style={{marginTop:8}}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
