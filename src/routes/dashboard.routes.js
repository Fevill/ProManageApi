const express = require('express');
const router = express.Router();

// Get dashboard data
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM dashboard_data');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
