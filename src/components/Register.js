import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Очистка ошибок перед началом регистрации
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/Auth/register', { name, email, password, confirmPassword });
      if (response.data && response.data.message) {
        // Если регистрация успешна, перенаправляем пользователя на страницу авторизации
        navigate('/login');
      } else {
        setError('Не удалось зарегистрироваться');
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error); // Вывод ошибки в консоль для отладки

      if (error.response && error.response.data) {
        console.log('Ответ от сервера:', error.response.data); // Вывод ответа от сервера в консоль для отладки

        // Обрабатываем ошибки из объекта data
        const errorMessages = Object.values(error.response.data).flat().map((errorMsg, index) => {
          switch (errorMsg) {
            case "The Name field is required.":
              return "Поле 'Имя' обязательно для заполнения.";
            case "Passwords must be at least 6 characters.":
              return "Пароль должен содержать как минимум 6 символов.";
            case "Passwords must have at least one digit ('0'-'9').":
              return "Пароль должен содержать как минимум одну цифру ('0'-'9').";
            case "Passwords must have at least one non alphanumeric character.":
              return "Пароль должен содержать как минимум один специальный символ.";
            case "Passwords must have at least one lowercase ('a'-'z').":
              return "Пароль должен содержать как минимум одну строчную букву.";
            case "Passwords must have at least one uppercase ('A'-'Z').":
              return "Пароль должен содержать как минимум одну заглавную букву.";
            case "Username '' is invalid, can only contain letters or digits":
              return "Имя пользователя '' не корректно, можно использовать буквы и цифры";
            default:
              return errorMsg;
          }
        });
        setError(<div>{errorMessages.map((error, index) => <div key={index}>{error}</div>)}
          <div style={{marginBottom: '10px'}}></div>
        </div>);
      } else {
        setError('Ошибка при регистрации!');
      }
    }
  };

  return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="/">QB</Link>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Главная</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title mb-4">Регистрация</h2>
                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Имя:</label>
                      <input
                          type="text"
                          className="form-control"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Адрес электронной почты:</label>
                      <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Пароль:</label>
                      <input
                          type="password"
                          className="form-control"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Подтвердить пароль:</label>
                      <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                      />
                    </div>
                    {error && <div className="text-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
                  </form>
                  <div className="mt-3">
                    <p>Уже создали аккаунт? <Link to="/login" className="btn btn-link">Войти</Link></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Register;
