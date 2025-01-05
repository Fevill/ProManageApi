const express = require('express');
const router = express.Router();

// Get accounting entries
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM accounting_entries ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
