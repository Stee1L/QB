import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function RandomQuestion({ user, onLogout }) {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    const fetchQuestion = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get('http://localhost:5000/api/Question/random', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setQuestion(response.data);
            setLoading(false);
            setError(null);
            setStats(null); // Сбрасываем статистику при получении нового вопроса
        } catch (err) {
            console.log(err);
            setError('Ошибка загрузки вопроса');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post('http://localhost:5000/api/Question/answer', {
                questionId: question.id,
                answerId: selectedOption
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response.data);
            const totalVotes = response.data.reduce((sum, stat) => sum + stat.votes, 0);
            const statsWithPercentages = response.data.map(stat => ({
                ...stat,
                percentage: ((stat.votes / totalVotes) * 100).toFixed(2)
            }));
            setStats(statsWithPercentages);

        } catch (err) {
            setError('Ошибка отправки ответа');
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
                                <Link className="nav-link" to="/create-question">Создать вопрос</Link>
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
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title mb-4">Случайный вопрос</h2>
                                {loading ? (
                                    <p>Загрузка...</p>
                                ) : (
                                    <>
                                        {error ? (
                                            <div className="alert alert-danger" role="alert">{error}</div>
                                        ) : question ? (
                                            <>
                                                <form onSubmit={handleSubmit}>
                                                    <div className="mb-4">
                                                        <h3>{question.topic}</h3>
                                                        <p>{question.text}</p>
                                                    </div>
                                                    <div className="mb-4">
                                                        {question.answerOptions && question.answerOptions.length > 0 ? (
                                                            question.answerOptions.map((option) => (
                                                                <div className="form-check" key={option.answerId}>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="options"
                                                                        id={`option-${option.answerId}`}
                                                                        value={option.answerId}
                                                                        checked={selectedOption === option.answerId}
                                                                        onChange={(e) => setSelectedOption(e.target.value)}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={`option-${option.answerId}`}>
                                                                        {option.text}
                                                                    </label>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p>Нет доступных вариантов ответа</p>
                                                        )}
                                                    </div>
                                                    {error && <div className="text-danger mb-3">{error}</div>}
                                                    <button type="submit" className="btn btn-primary">Отправить ответ</button>
                                                </form>
                                                <button onClick={fetchQuestion} className="btn btn-secondary mt-4">Получить новый вопрос</button>
                                            </>
                                        ) : (
                                            <p>{error}</p>
                                        )}
                                        {stats && (
                                            <div className="mt-4">
                                                <h3>Статистика</h3>
                                                {stats.map((stat) => (
                                                    <div key={stat.text} className="mb-2">
                                                        <span>{stat.text}: {stat.votes}</span>
                                                        <div className="progress">
                                                            <div className="progress-bar" role="progressbar" style={{ width: `${stat.percentage}%` }} aria-valuenow={stat.percentage} aria-valuemin="0" aria-valuemax="100">
                                                                {stat.percentage}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RandomQuestion;
