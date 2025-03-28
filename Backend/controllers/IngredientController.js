const pool = require('../db')
const isAdmin = (req, res, next) => {
    const { role } = req.user; // Assuming the user role is stored in req.user (e.g., after JWT auth)
  
    if (role !== 'Admin') {
      return res.status(403).json({ message: 'Permission denied. Admin access required.' });
    }
  
    next(); // Allow admins to proceed
  };

  // ingredients

const createIngredient = (req, res) => {
    const { ingredientName, categoryID, sizeID, hasCream, hasIce } = req.body;
  
    if (!ingredientName || !categoryID || !sizeID) {
      return res.status(400).json({ message: 'Ingredient name, category ID, and size ID are required.' });
    }
  
    pool.query(
      'INSERT INTO Ingredients (IngredientName, CategoryID, SizeID, hasCream, hasIce) VALUES (?, ?, ?, ?, ?)',
      [ingredientName, categoryID, sizeID, hasCream, hasIce],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error');
        }
        res.status(201).json({ message: 'Ingredient created successfully', id: results.insertId });
      }
    );
  };
  
  const updateIngredient = (req, res) => {
    const { id } = req.params;
    const { ingredientName, categoryID, sizeID, hasCream, hasIce } = req.body;
  
    pool.query(
      'UPDATE Ingredients SET IngredientName = ?, CategoryID = ?, SizeID = ?, hasCream = ?, hasIce = ? WHERE IngredientID = ?',
      [ingredientName, categoryID, sizeID, hasCream, hasIce, id],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error');
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Ingredient not found' });
        }
        res.json({ message: 'Ingredient updated successfully' });
      }
    );
  };
  
  const deleteIngredient = (req, res) => {
    const { id } = req.params;
  
    pool.query('DELETE FROM Ingredients WHERE IngredientID = ?', [id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Ingredient not found' });
      }
      res.json({ message: 'Ingredient deleted successfully' });
    });
  };
  
  const getAllIngredients = (req, res) => {
    pool.query(
      `SELECT i.IngredientID, i.IngredientName, ic.IngredientCategoryName, s.SizeDescription, i.hasCream, i.hasIce 
       FROM Ingredients i
       JOIN IngredientCategory ic ON i.CategoryID = ic.IngredientCategoryID
       JOIN Sizes s ON i.SizeID = s.SizeID`,
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error');
        }
        res.json(results);
      }
    );
  };

module.exports ={
    createIngredient,
    updateIngredient,
    deleteIngredient,
    getAllIngredients,
    isAdmin,
}  