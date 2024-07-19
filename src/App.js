import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import CreateQuestion from './components/CreateQuestion';
import RandomQuestion from './components/RandomQuestion';
import MyQuestion from "./components/MyQuestion";
import Feedback from "./components/Feedback"; // Импортируем компонент Feedback

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Проверяем, авторизован ли пользователь при загрузке компонента
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
      <Router>
        <div className="App">
          <Routes>
            <Route
                path="/"
                element={<Home user={user} onLogout={handleLogout} />}
            />
            <Route
                path="/login"
                element={<Login onLogin={handleLogin} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
                path="/create-question"
                element={<CreateQuestion user={user} onLogout={handleLogout} />}
            />
            <Route
                path="/random-question"
                element={<RandomQuestion user={user} onLogout={handleLogout} />}
            />
            <Route
                path="/my-question"
                element={<MyQuestion user={user} onLogout={handleLogout} />}
            />
            <Route
                path="/feedback"
                element={<Feedback user={user} onLogout={handleLogout} />}
            />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
