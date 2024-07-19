import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function CreateQuestion({ user, onLogout }) {
    const [topic, setTopic] = useState('');
    const [text, setText] = useState('');
    const [answerOptions, setAnswerOptions] = useState(['', '']);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (index, event) => {
        const values = [...answerOptions];
        values[index] = event.target.value;
        setAnswerOptions(values);
    };

    const handleAddOption = () => {
        setAnswerOptions([...answerOptions, '']);
    };

    const handleRemoveOption = (index) => {
        const values = [...answerOptions];
        values.splice(index, 1);
        setAnswerOptions(values);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!topic || !text || answerOptions.some(option => !option)) {
            setError('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/Question',
                { topic, text, answerOptions },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate('/my-question');
        } catch (err) {
            setError('Не удалось создать вопрос.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/');
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
                <h2>Создать вопрос</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="topic" className="form-label">Тема</label>
                        <input
                            type="text"
                            className="form-control"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="text" className="form-label">Текст вопроса</label>
                        <textarea
                            className="form-control"
                            id="text"
                            rows="3"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Варианты ответа</label>
                        {answerOptions.map((option, index) => (
                            <div key={index} className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={option}
                                    onChange={(event) => handleInputChange(index, event)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveOption(index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary" onClick={handleAddOption}>Добавить вариант</button>
                    </div>
                    <button type="submit" className="btn btn-primary">Создать</button>
                </form>
            </div>
        </div>
    );
}

export default CreateQuestion;
