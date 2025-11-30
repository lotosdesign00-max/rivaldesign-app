import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./components/Home";
import Gallery from "./components/Gallery";
import Order from "./components/Order";
import Testimonials from "./components/Testimonials";
import AIGenerator from "./components/AIGenerator";

function App() {
  return (
    <Router>
      <div className="app">
        {/* Навигация */}
        <nav className="navbar">
          <ul className="nav-links">
            <li><NavLink to="/">Главная</NavLink></li>
            <li><NavLink to="/gallery">Галерея</NavLink></li>
            <li><NavLink to="/order">Заказать</NavLink></li>
            <li><NavLink to="/ai">AI Генератор</NavLink></li>
            <li><NavLink to="/testimonials">Отзывы</NavLink></li>
          </ul>
        </nav>

        {/* Основное содержимое */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/order" element={<Order />} />
          <Route path="/ai" element={<AIGenerator />} />
          <Route path="/testimonials" element={<Testimonials />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
