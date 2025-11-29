import React from 'react'
export default function IdeaGenerator(){
  function gen(){
    const palettes = [
      ['#111','#e11b23','#fff'],
      ['#0a0a0a','#ff0033','#ffd700'],
      ['#121212','#ff2d55','#b0b0b0']
    ]
    const p = palettes[Math.floor(Math.random()*palettes.length)]
    alert('Палитра: ' + p.join(', '))
  }
  return (
    <div className="card">
      <h3>Генератор идей</h3>
      <div className="muted">Нажми, чтобы получить быструю идею или палитру</div>
      <div style={{marginTop:8}}>
        <button className="btn" onClick={gen}>Сгенерировать идею</button>
      </div>
    </div>
  )
}
