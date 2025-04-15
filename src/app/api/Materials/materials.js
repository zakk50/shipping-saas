const express = require('express');
const Material = require('../models/Material');
const router = express.Router();

// Создать новый материал
router.post('/', async (req, res) => {
  try {
    const { title, content, author, department, visibility } = req.body;

    const newMaterial = new Material({
      title,
      content,
      author,
      department,
      visibility,
    });

    const savedMaterial = await newMaterial.save();
    res.status(201).json(savedMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить все материалы
router.get('/', async (req, res) => {
  try {
    const materials = await Material.find().populate('author department');
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
