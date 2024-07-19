const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config'); // Подключение конфигурационного файла

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Конфигурация nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // используйте соответствующий почтовый сервис
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
    },
});

app.post('/api/feedback', (req, res) => {
    const { email, message } = req.body;

    const mailOptions = {
        from: email,
        to: config.adminEmail, // Почта администратора из конфигурации
        subject: 'Новое сообщение обратной связи',
        text: `Почта отправителя: ${email}\n\nСообщение:\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: 'Не удалось отправить сообщение' });
        }
        res.status(200).json({ message: 'Сообщение отправлено' });
    });
});

app.listen(5000, () => {
    console.log('Сервер запущен на порту 5000');
});
