import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyQuestions({ user, onLogout }) {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const token = localStorage.getItem('token');
                console.log('Fetching questions with token:', token);

                const response = await axios.get('http://localhost:5000/api/question/my-questions', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log('Response data:', response.data);

                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    const questionsWithStats = response.data.map(question => {
                        if (question.answerOptions && Array.isArray(question.answerOptions) && question.answerOptions.length > 0) {
                            const totalVotes = question.answerOptions.reduce((sum, option) => sum + option.votes, 0);
                            const answerOptionsWithPercentages = question.answerOptions.map(option => ({
                                ...option,
                                percentage: totalVotes ? ((option.votes / totalVotes) * 100).toFixed(2) : 0
                            }));
                            return { ...question, answerOptions: answerOptionsWithPercentages, totalVotes };
                        } else {
                            return { ...question, totalVotes: 0 };
                        }
                    });

                    setQuestions(questionsWithStats);
                } else {
                    setQuestions([]);
                    setError('Вопросы пока не созданы.');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError('Не удалось загрузить вопросы');
            }
        }

        fetchQuestions();
    }, []);

    const toggleQuestionDetails = (id) => {
        const updatedQuestions = questions.map(question =>
            question.id === id ? { ...question, expanded: !question.expanded } : question
        );
        setQuestions(updatedQuestions);
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
                <h2>Мои вопросы</h2>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {questions.length > 0 ? (
                    <div className="list-group">
                        {questions.map((question) => (
                            <div key={question.id} className="list-group-item mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4>{question.topic}</h4>
                                    <div className="d-flex align-items-center">
                                        <span className="me-3">{question.totalVotes} {question.totalVotes === 1 ? 'голос' : 'голосов'}</span>
                                        <button className="btn btn-sm btn-primary" onClick={() => toggleQuestionDetails(question.id)}>Подробнее</button>
                                    </div>
                                </div>
                                {question.expanded && (
                                    <div>
                                        <p className="mt-3">{question.text}</p>
                                        <ul className="list-group">
                                            {question.answerOptions && question.answerOptions.length > 0 ? (
                                                question.answerOptions.map((option) => (
                                                    <li key={option.id} className="list-group-item">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span>{option.text}</span>
                                                            <span>{option.votes} голосов</span>
                                                        </div>
                                                        <div className="progress mt-2">
                                                            <div className="progress-bar" role="progressbar" style={{ width: `${option.percentage}%` }} aria-valuenow={parseFloat(option.percentage)} aria-valuemin="0" aria-valuemax="100">
                                                                {parseFloat(option.percentage)}%
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="list-group-item">Нет доступных вариантов ответа</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Вопросы пока не созданы.</p>
                )}
            </div>
        </div>
    );
}

export default MyQuestions;
