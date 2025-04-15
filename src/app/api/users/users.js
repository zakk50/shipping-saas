const express = require('express');
const User = require('../models/User'); // Подключение модели пользователя
const bcrypt = require('bcryptjs'); // Для хэширования пароля
const router = express.Router();

// Получение списка пользователей (GET /api/users)
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Получаем всех пользователей
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

// ✅ Получение пользователей по массиву ID
router.post('/by-ids', async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    return res.status(400).json({ message: 'ids must be an array' });
  }

  try {
    const users = await User.find({ _id: { $in: ids } }).select('_id name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера при получении пользователей по id', error });
  }
});

// Регистрация пользователя
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    // Проверка обязательных полей
    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Хэширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создание нового пользователя
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      department,
      role: role || 'employee',
    });

    // Сохранение в базе данных
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
