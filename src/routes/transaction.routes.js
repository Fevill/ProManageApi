const express = require('express');
const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM transactions ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM transactions WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  const { date, description, amount, type, category_id, account_id } = req.body;
  try {
    const result = await req.db.query(
      'INSERT INTO transactions (date, description, amount, type, category_id, account_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [date, description, amount, type, category_id, account_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  const { date, description, amount, type, category_id, account_id } = req.body;
  try {
    const result = await req.db.query(
      'UPDATE transactions SET date = $1, description = $2, amount = $3, type = $4, category_id = $5, account_id = $6 WHERE id = $7 RETURNING *',
      [date, description, amount, type, category_id, account_id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const result = await req.db.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transactions by date range
router.get('/range/:start/:end', async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT * FROM transactions WHERE date BETWEEN $1 AND $2 ORDER BY date DESC',
      [req.params.start, req.params.end]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
