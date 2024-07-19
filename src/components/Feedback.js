import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Feedback({ user, onLogout }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:5000/api/feedback', { email, message });
            setFeedbackMessage('Сообщение отправлено');
            setEmail('');
            setMessage('');
        } catch (error) {
            setFeedbackMessage('Не удалось отправить сообщение');
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
                <h2>Обратная связь</h2>
                {feedbackMessage && <div className={`alert ${feedbackMessage === 'Сообщение отправлено' ? 'alert-success' : 'alert-danger'}`}>{feedbackMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Адрес электронной почты</label>
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
                        <label htmlFor="message" className="form-label">Сообщение</label>
                        <textarea
                            className="form-control"
                            id="message"
                            rows="3"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Отправить</button>
                </form>
            </div>
        </div>
    );
}

export default Feedback;
