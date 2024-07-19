import React from 'react';
import { Link } from 'react-router-dom';

function Home({ user, onLogout }) {
    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
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
                            <li className="nav-item">
                                <Link className="nav-link" to="/feedback">Обратная связь</Link>
                            </li>
                        </ul>
                        {user && (
                            <div className="d-flex align-items-center">
                                <span className="me-2">Привет, {user.name}!</span>
                                <button className="btn btn-outline-danger" onClick={handleLogout}>Выйти</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        {user ? (
                            <div>
                                <h2 className="text-center">Добро пожаловать в QB!</h2>
                                <div className="d-grid gap-2">
                                    <Link to="/random-question" className="btn btn-primary">Получить случайный вопрос</Link>
                                    <Link to="/create-question" className="btn btn-secondary">Создать вопрос</Link>
                                    <Link to="/my-question" className="btn btn-success">Мои вопросы</Link>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-center mb-4">Вы не вошли в систему!</h2>
                                <div className="d-grid gap-2">
                                    <Link to="/login" className="btn btn-primary">Войти</Link>
                                    <Link to="/register" className="btn btn-secondary">Зарегистрироваться</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
