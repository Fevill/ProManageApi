const express = require('express');
const router = express.Router();

// Get all fiscal years
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM fiscal_year ORDER BY start_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get fiscal year by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM fiscal_year WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fiscal year not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create fiscal year
router.post('/', async (req, res) => {
  const { company_id, name, start_date, end_date, status, notes } = req.body;

  // Validation
  if (!company_id || !name || !start_date || !end_date || !status) {
    return res.status(400).json({ 
      message: 'Missing required fields',
      required: ['company_id', 'name', 'start_date', 'end_date', 'status']
    });
  }

  try {
    // Check if company exists
    const companyCheck = await req.db.query('SELECT id FROM company WHERE id = $1', [company_id]);
    if (companyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check for overlapping fiscal years
    const overlapCheck = await req.db.query(`
      SELECT id FROM fiscal_year 
      WHERE company_id = $1 
      AND daterange(start_date, end_date, '[]') && daterange($2::date, $3::date, '[]')
    `, [company_id, start_date, end_date]);

    if (overlapCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Fiscal year dates overlap with an existing fiscal year' });
    }

    const result = await req.db.query(`
      INSERT INTO fiscal_year (
        company_id, name, start_date, end_date, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `, [company_id, name, start_date, end_date, status, notes]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update fiscal year
router.put('/:id', async (req, res) => {
  const { company_id, name, start_date, end_date, status, notes } = req.body;
  const fiscalYearId = req.params.id;

  // Validation
  if (!company_id || !name || !start_date || !end_date || !status) {
    return res.status(400).json({ 
      message: 'Missing required fields',
      required: ['company_id', 'name', 'start_date', 'end_date', 'status']
    });
  }

  try {
    // Check if fiscal year exists
    const fiscalYearCheck = await req.db.query(
      'SELECT id FROM fiscal_year WHERE id = $1',
      [fiscalYearId]
    );
    if (fiscalYearCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Fiscal year not found' });
    }

    // Check if company exists
    const companyCheck = await req.db.query('SELECT id FROM company WHERE id = $1', [company_id]);
    if (companyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check for overlapping fiscal years (excluding current fiscal year)
    const overlapCheck = await req.db.query(`
      SELECT id FROM fiscal_year 
      WHERE company_id = $1 
      AND id != $2
      AND daterange(start_date, end_date, '[]') && daterange($3::date, $4::date, '[]')
    `, [company_id, fiscalYearId, start_date, end_date]);

    if (overlapCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Fiscal year dates overlap with an existing fiscal year' });
    }

    const result = await req.db.query(`
      UPDATE fiscal_year 
      SET company_id = $1, 
          name = $2, 
          start_date = $3, 
          end_date = $4, 
          status = $5, 
          notes = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 
      RETURNING *
    `, [company_id, name, start_date, end_date, status, notes, fiscalYearId]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete fiscal year
router.delete('/:id', async (req, res) => {
  try {
    const result = await req.db.query('DELETE FROM fiscal_year WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fiscal year not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get fiscal years by company ID
router.get('/company/:companyId', async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT * FROM fiscal_year WHERE company_id = $1 ORDER BY start_date DESC',
      [req.params.companyId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current fiscal year by company ID
router.get('/company/:companyId/current', async (req, res) => {
  try {
    const result = await req.db.query(`
      SELECT * FROM fiscal_year 
      WHERE company_id = $1 
      AND status = 'active'
      AND CURRENT_DATE BETWEEN start_date AND end_date
      ORDER BY start_date DESC 
      LIMIT 1
    `, [req.params.companyId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No current fiscal year found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
