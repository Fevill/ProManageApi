const express = require('express');
const router = express.Router();

// Routes pour ClassePCG
router.get('/classes', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM ClassePCG ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/classes/:id', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM ClassePCG WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Classe PCG non trouvée' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes pour TypeCompte
router.get('/types', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM TypeCompte ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes pour Account
router.get('/accounts', async (req, res) => {
  try {
    const query = `
      SELECT a.*, t.name as type_name, c.name as classe_name
      FROM Account a
      LEFT JOIN TypeCompte t ON a.type_id = t.id
      LEFT JOIN ClassePCG c ON a.classe_pcg_id = c.id
      ORDER BY a.code`;
    const result = await req.db.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/accounts/:id', async (req, res) => {
  try {
    const query = `
      SELECT a.*, t.name as type_name, c.name as classe_name
      FROM Account a
      LEFT JOIN TypeCompte t ON a.type_id = t.id
      LEFT JOIN ClassePCG c ON a.classe_pcg_id = c.id
      WHERE a.id = $1`;
    const result = await req.db.query(query, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/accounts', async (req, res) => {
  const {
    code,
    name,
    type_id,
    classe_pcg_id,
    parent_id,
    description,
    is_active,
    is_auxiliaire,
    code_pcg_reference,
    lettrage
  } = req.body;

  try {
    const query = `
      INSERT INTO Account (
        code, name, type_id, classe_pcg_id, parent_id, description,
        is_active, is_auxiliaire, code_pcg_reference, lettrage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`;
    
    const values = [
      code, name, type_id, classe_pcg_id, parent_id, description,
      is_active, is_auxiliaire, code_pcg_reference, lettrage
    ];

    const result = await req.db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/accounts/:id', async (req, res) => {
  const {
    code,
    name,
    type_id,
    classe_pcg_id,
    parent_id,
    description,
    is_active,
    is_auxiliaire,
    code_pcg_reference,
    lettrage,
  } = req.body;

  try {
    const query = `
      UPDATE Account SET
        code = $1,
        name = $2,
        type_id = $3,
        classe_pcg_id = $4,
        parent_id = $5,
        description = $6,
        is_active = $7,
        is_auxiliaire = $8,
        code_pcg_reference = $9,
        lettrage = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *`;
    
    const values = [
      code, name, type_id, classe_pcg_id, parent_id, description,
      is_active, is_auxiliaire, code_pcg_reference, lettrage,
      req.params.id
    ];

    const result = await req.db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/accounts/:id', async (req, res) => {
  try {
    // Vérifier si le compte a des enfants
    const childrenCheck = await req.db.query(
      'SELECT COUNT(*) FROM Account WHERE parent_id = $1',
      [req.params.id]
    );

    if (parseInt(childrenCheck.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'Impossible de supprimer ce compte car il contient des sous-comptes'
      });
    }

    const result = await req.db.query(
      'DELETE FROM Account WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    res.json({ message: 'Compte supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes pour ComptePCGReference
router.get('/pcg-references', async (req, res) => {
  try {
    const query = `
      SELECT r.*, c.name as classe_name
      FROM ComptePCGReference r
      LEFT JOIN ClassePCG c ON r.classe_id = c.id
      ORDER BY r.code`;
    const result = await req.db.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pcg-references/:code', async (req, res) => {
  try {
    const query = `
      SELECT r.*, c.name as classe_name
      FROM ComptePCGReference r
      LEFT JOIN ClassePCG c ON r.classe_id = c.id
      WHERE r.code = $1`;
    const result = await req.db.query(query, [req.params.code]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Référence PCG non trouvée' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour obtenir la structure hiérarchique des comptes
router.get('/accounts-hierarchy', async (req, res) => {
  try {
    const query = `
      WITH RECURSIVE AccountHierarchy AS (
        -- Sélection des comptes parents (sans parent_id)
        SELECT 
          id, code, name, parent_id, 
          CAST(code AS VARCHAR(255)) as path,
          ARRAY[id] as id_path,
          0 as level
        FROM Account 
        WHERE parent_id IS NULL

        UNION ALL

        -- Récursion pour obtenir les enfants
        SELECT 
          a.id, a.code, a.name, a.parent_id,
          ah.path || '>' || a.code,
          ah.id_path || a.id,
          ah.level + 1
        FROM Account a
        INNER JOIN AccountHierarchy ah ON a.parent_id = ah.id
      )
      SELECT 
        ah.*,
        a.type_id, a.classe_pcg_id, a.description, 
        a.is_active, a.is_auxiliaire, a.code_pcg_reference,
        t.name as type_name,
        c.name as classe_name
      FROM AccountHierarchy ah
      JOIN Account a ON ah.id = a.id
      LEFT JOIN TypeCompte t ON a.type_id = t.id
      LEFT JOIN ClassePCG c ON a.classe_pcg_id = c.id
      ORDER BY path`;

    const result = await req.db.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
