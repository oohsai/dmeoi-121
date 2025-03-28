  const pool = require('../db')
  
  const isAdmin = (req, res, next) => {
    const { role } = req.user; // Assuming the user role is stored in req.user (e.g., after JWT auth)
  
    if (role !== 'Admin') {
      return res.status(403).json({ message: 'Permission denied. Admin access required.' });
    }
  
    next(); // Allow admins to proceed
  };
  
  // size 
  const createSize = (req, res) => {
    const { sizeDescription, basePrice, unit } = req.body;
  
    if (!sizeDescription || !basePrice || !unit) {
      return res.status(400).json({ message: 'Size description, base price, and unit are required.' });
    }
  
    pool.query(
      'INSERT INTO Sizes (SizeDescription, BasePrice, Unit) VALUES (?, ?, ?)',
      [sizeDescription, basePrice, unit],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error');
        }
        res.status(201).json({ message: 'Size created successfully', id: results.insertId });
      }
    );
  };
  
  const updateSize = (req, res) => {
    const { id } = req.params;
    const { sizeDescription, basePrice, unit } = req.body;
  
    pool.query(
      'UPDATE Sizes SET SizeDescription = ?, BasePrice = ?, Unit = ? WHERE SizeID = ?',
      [sizeDescription, basePrice, unit, id],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error');
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Size not found' });
        }
        res.json({ message: 'Size updated successfully' });
      }
    );
  };
  
  const deleteSize = (req, res) => {
    const { id } = req.params;
  
    pool.query('DELETE FROM Sizes WHERE SizeID = ?', [id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Size not found' });
      }
      res.json({ message: 'Size deleted successfully' });
    });
  };
  
  const getAllSizes = (req, res) => {
    pool.query('SELECT * FROM Sizes', (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      res.json(results);
    });
  };

module.exports = {
  createSize,
  updateSize,
  deleteSize,
  getAllSizes,
  isAdmin,
}