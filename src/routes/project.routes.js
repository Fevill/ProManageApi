const express = require('express');
const router = express.Router();

// Get projects
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
