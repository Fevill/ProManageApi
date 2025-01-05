const express = require('express');
const router = express.Router();

// Get bilan
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM bilan');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
