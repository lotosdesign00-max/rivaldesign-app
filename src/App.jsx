import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import AIGenerator from "./components/AIGenerator";
import Order from "./components/Order";

export default function App() {
  return (
    <Router>
      <nav className="nav">
        <NavLink to="/">О нас</NavLink>
        <NavLink to="/gallery">Галерея</NavLink>
        <NavLink to="/testimonials">Отзывы</NavLink>
        <NavLink to="/ai-generator">AI Генератор</NavLink>
        <NavLink to="/order">Заказать</NavLink>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/ai-generator" element={<AIGenerator />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </div>
    </Router>
  );
}
