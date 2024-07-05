import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function CreateQuestion({ user, onLogout }) {
    const [topic, setTopic] = useState('');
    const [text, setText] = useState('');
    const [answerOptions, setAnswerOptions] = useState(['']);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAddOption = () => {
        setAnswerOptions([...answerOptions, '']);
    };

    const handleOptionChange = (index, event) => {
        const newOptions = [...answerOptions];
        newOptions[index] = event.target.value;
        setAnswerOptions(newOptions);
    };

    const handleRemoveOption = (index) => {
        const newOptions = [...answerOptions];
        newOptions.splice(index, 1);
        setAnswerOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (answerOptions.length < 2) {
            setError('Добавьте минимум два варианта ответа');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/question/create',
                { topic, text, answerOptions },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/my-question');
        } catch (error) {
            setError('Не удалось создать вопрос');
            if (error.response && error.response.data) {
                setError(error.response.data.message);
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
                        {user && (
                            <div className="d-flex align-items-center">
                                <span className="me-2">Привет, {user.name}!</span>
                                <button className="btn btn-outline-danger" onClick={onLogout}>Выйти</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title mb-4">Создать вопрос</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="topic" className="form-label">Тема:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="topic"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="text" className="form-label">Текст:</label>
                                        <textarea
                                            className="form-control"
                                            id="text"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Варианты ответа:</label>
                                        {answerOptions.map((option, index) => (
                                            <div key={index} className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(index, e)}
                                                    required
                                                />
                                                <button type="button" className="btn btn-danger" onClick={() => handleRemoveOption(index)}>Удалить</button>
                                            </div>
                                        ))}
                                        <button type="button" className="btn btn-secondary" onClick={handleAddOption}>Добавить вариант</button>
                                    </div>
                                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                    <button type="submit" className="btn btn-primary">Создать вопрос</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateQuestion;
