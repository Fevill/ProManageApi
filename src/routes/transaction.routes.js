const express = require('express');
const router = express.Router();

// Get all transactions (excluding forecasts by default)
router.get('/', async (req, res) => {
  try {
    const isForecast = req.query.forecast === 'true';
    const companyId = req.query.companyId;
    const fiscalYearId = req.query.fiscalYearId;

    let params = [isForecast];
    let whereClause = 't.is_forecast = $1';

    if (companyId) {
      params.push(companyId);
      whereClause += ` AND t.company_id = $${params.length}`;
    }

    if (fiscalYearId) {
      params.push(fiscalYearId);
      whereClause += ` AND t.fiscal_year_id = $${params.length}`;
    }

    const query = `
      SELECT t.*, 
             da.code as debit_account_code, 
             da.name as debit_account_name,
             ca.code as credit_account_code, 
             ca.name as credit_account_name
      FROM transactions t
      LEFT JOIN account da ON t.debit_account_id = da.id
      LEFT JOIN account ca ON t.credit_account_id = ca.id
      WHERE ${whereClause}
      ORDER BY t.date DESC
    `;
    const result = await req.db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT t.*, 
             da.code as debit_account_code, 
             da.name as debit_account_name,
             ca.code as credit_account_code, 
             ca.name as credit_account_name
      FROM transactions t
      LEFT JOIN account da ON t.debit_account_id = da.id
      LEFT JOIN account ca ON t.credit_account_id = ca.id
      WHERE t.id = $1
    `;
    const result = await req.db.query(query, [req.params.id]);
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
  const { 
    date, 
    amount, 
    debit_account_id, 
    credit_account_id, 
    description, 
    reference,
    company_id,
    fiscal_year_id,
    is_forecast
  } = req.body;

  try {
    const query = `
      INSERT INTO transactions (
        date, 
        amount, 
        debit_account_id, 
        credit_account_id, 
        description, 
        reference,
        company_id,
        fiscal_year_id,
        is_forecast
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
    `;
    const result = await req.db.query(query, [
      date, 
      amount, 
      debit_account_id, 
      credit_account_id, 
      description, 
      reference,
      company_id,
      fiscal_year_id,
      is_forecast || false
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  const { 
    date, 
    amount, 
    debit_account_id, 
    credit_account_id, 
    description, 
    reference,
    company_id,
    fiscal_year_id,
    is_forecast
  } = req.body;

  try {
    const query = `
      UPDATE transactions 
      SET date = $1, 
          amount = $2, 
          debit_account_id = $3, 
          credit_account_id = $4, 
          description = $5, 
          reference = $6,
          company_id = $7,
          fiscal_year_id = $8,
          is_forecast = $9,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 
      RETURNING *
    `;
    const result = await req.db.query(query, [
      date, 
      amount, 
      debit_account_id, 
      credit_account_id, 
      description, 
      reference,
      company_id,
      fiscal_year_id,
      is_forecast || false,
      req.params.id
    ]);
    
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

// Get transactions by date range and company (with forecast filter)
router.get('/range/:companyId/:start/:end', async (req, res) => {
  try {
    const isForecast = req.query.forecast === 'true';
    const query = `
      SELECT t.*, 
             da.code as debit_account_code, 
             da.name as debit_account_name,
             ca.code as credit_account_code, 
             ca.name as credit_account_name
      FROM transactions t
      LEFT JOIN account da ON t.debit_account_id = da.id
      LEFT JOIN account ca ON t.credit_account_id = ca.id
      WHERE t.company_id = $1 
      AND t.date BETWEEN $2 AND $3 
      AND t.is_forecast = $4
      ORDER BY t.date DESC
    `;
    const result = await req.db.query(query, [
      req.params.companyId,
      req.params.start, 
      req.params.end,
      isForecast
    ]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all transactions (including forecasts)
router.get('/all', async (req, res) => {
  try {
    const query = `
      SELECT t.*, 
             da.code as debit_account_code, 
             da.name as debit_account_name,
             ca.code as credit_account_code, 
             ca.name as credit_account_name
      FROM transactions t
      LEFT JOIN account da ON t.debit_account_id = da.id
      LEFT JOIN account ca ON t.credit_account_id = ca.id
      ORDER BY t.date DESC
    `;
    const result = await req.db.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get forecast transactions
router.get('/forecast', async (req, res) => {
  try {
    const query = `
      SELECT t.*, 
             da.code as debit_account_code, 
             da.name as debit_account_name,
             ca.code as credit_account_code, 
             ca.name as credit_account_name
      FROM transactions t
      LEFT JOIN account da ON t.debit_account_id = da.id
      LEFT JOIN account ca ON t.credit_account_id = ca.id
      WHERE t.is_forecast = true
      ORDER BY t.date DESC
    `;
    const result = await req.db.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
