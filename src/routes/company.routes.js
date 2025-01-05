const express = require('express');
const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query(`
      WITH company_data AS (
        SELECT c.*, 
          CASE 
            WHEN EXISTS (SELECT 1 FROM fiscal_year fy WHERE fy.company_id = c.id)
            THEN (
              SELECT json_agg(
                json_build_object(
                  'id', fy.id,
                  'companyId', fy.company_id,
                  'name', fy.name,
                  'startDate', fy.start_date,
                  'endDate', fy.end_date,
                  'status', fy.status,
                  'notes', fy.notes
                )
              )
              FROM fiscal_year fy 
              WHERE fy.company_id = c.id
            )
          END as fiscalYears
        FROM company c
      )
      SELECT 
        id, name, description, address, phone, email,
        legal_form, vat_number, created_at, updated_at,
        CASE 
          WHEN fiscalYears IS NOT NULL 
          THEN fiscalYears 
        END as fiscalYears
      FROM company_data
      ORDER BY LOWER(name)
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await req.db.query(`
      WITH company_data AS (
        SELECT c.*, 
          CASE 
            WHEN EXISTS (SELECT 1 FROM fiscal_year fy WHERE fy.company_id = c.id)
            THEN (
              SELECT json_agg(
                json_build_object(
                  'id', fy.id,
                  'companyId', fy.company_id,
                  'name', fy.name,
                  'startDate', fy.start_date,
                  'endDate', fy.end_date,
                  'status', fy.status,
                  'notes', fy.notes
                )
              )
              FROM fiscal_year fy 
              WHERE fy.company_id = c.id
            )
          END as fiscalYears
        FROM company c
        WHERE c.id = $1
      )
      SELECT 
        id, name, description, address, phone, email,
        legal_form, vat_number, created_at, updated_at,
        CASE 
          WHEN fiscalYears IS NOT NULL 
          THEN fiscalYears 
        END as fiscalYears
      FROM company_data
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new company
router.post('/', async (req, res) => {
  const { name, description, address, phone, email, siret, legalForm, vatNumber } = req.body;
  try {
    const result = await req.db.query(
      `INSERT INTO company (
        name, description, address, phone, email, 
        siret, legal_form, vat_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, description, address, phone, email, siret, legalForm, vatNumber]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update company
router.put('/:id', async (req, res) => {
  const { name, description, address, phone, email, siret, legalForm, vatNumber } = req.body;
  try {
    const result = await req.db.query(
      `UPDATE company SET 
        name = $1, 
        description = $2, 
        address = $3, 
        phone = $4, 
        email = $5,
        siret = $6,
        legal_form = $7,
        vat_number = $8
      WHERE id = $9 RETURNING *`,
      [name, description, address, phone, email, siret, legalForm, vatNumber, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const result = await req.db.query('DELETE FROM company WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
