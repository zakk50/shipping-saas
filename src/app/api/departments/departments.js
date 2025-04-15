const express = require('express');
const Department = require('../models/Department'); // Модель службы
const router = express.Router();

// Получить все службы
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Добавить новый службы
router.post('/', async (req, res) => {
  try {
    console.log('Received data:', req.body); // Логируем входные данные
    
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Department name is required' });
    }

    const newDepartment = new Department({ name, description });
    const savedDepartment = await newDepartment.save();

    res.status(201).json(savedDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновить службы
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Удалить службы
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
