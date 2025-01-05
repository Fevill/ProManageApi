const express = require('express');
const router = express.Router();

// Get profile
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM profiles');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
