import express from 'express';
import path from 'path';
import expressEjsLayouts from 'express-ejs-layouts'; // Импортируем пакет
import userRouter from './routes/userRoutes';

const app = express();

// Настройка EJS и layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressEjsLayouts); // Подключаем express-ejs-layouts
app.set('layout', 'layouts/layout'); // Указываем путь к основному layout

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Роуты
app.use('/users', userRouter);
app.get('/', (req, res) => res.redirect('/users'));

export default app;