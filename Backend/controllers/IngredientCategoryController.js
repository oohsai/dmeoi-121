const pool = require('../db');  // Import the MySQL connection pool

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const { role } = req.user; // Assuming the user role is stored in req.user (e.g., after JWT auth)

  if (role !== 'Admin') {
    return res.status(403).json({ message: 'Permission denied. Admin access required.' });
  }

  next(); // If the user is an admin, allow them to proceed
};

// IngredientCategory
const createIngredientCategory = (req, res) => {
    const { ingredientCategoryName, ingredientCategoryDescription } = req.body;
  
    if (!ingredientCategoryName) {
      return res.status(400).json({ message: 'Ingredient category name is required.' });
    }
  
    pool.query(
      'INSERT INTO IngredientCategory (IngredientCategoryName, IngredientsDescriptor) VALUES (?, ?)',
      [ingredientCategoryName, ingredientCategoryDescription],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error');
        }
        res.status(201).json({ message: 'Ingredient category created successfully', id: results.insertId });
      }
    );
  };
  
  const updateIngredientCategory = (req, res) => {
    const { id } = req.params;
    const { ingredientCategoryName, ingredientCategoryDescription } = req.body;
  
    pool.query(
      'UPDATE IngredientCategory SET IngredientCategoryName = ?, IngredientsDescriptor = ? WHERE IngredientCategoryID = ?',
      [ingredientCategoryName, ingredientCategoryDescription, id],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error');
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Ingredient category not found' });
        }
        res.json({ message: 'Ingredient category updated successfully' });
      }
    );
  };
  
  const deleteIngredientCategory = (req, res) => {
    const { id } = req.params;
  
    pool.query('DELETE FROM IngredientCategory WHERE IngredientCategoryID = ?', [id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Ingredient category not found' });
      }
      res.json({ message: 'Ingredient category deleted successfully' });
    });
  };
  
  const getAllIngredientCategories = (req, res) => {
    pool.query('SELECT * FROM IngredientCategory', (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      res.json(results);
    });
  };


module.exports = {
  createIngredientCategory,
  updateIngredientCategory,
  getAllIngredientCategories,
  deleteIngredientCategory,
  isAdmin
};
