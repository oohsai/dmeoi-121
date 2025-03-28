const express = require('express');
const router = express.Router();
const IngredientCategoryController = require('../controllers/IngredientCategoryController'); // Import all controller functions

// Destructure the imported functions
const { 
  isAdmin,
  createIngredientCategory,
  updateIngredientCategory,
  deleteIngredientCategory,
  getAllIngredientCategories,
} = IngredientCategoryController;



// Routes for Ingredient Categories
router.post('/ingredientCategory', isAdmin, createIngredientCategory);
router.put('/ingredientCategory/:id', isAdmin, updateIngredientCategory);
router.delete('/ingredientCategory/:id', isAdmin, deleteIngredientCategory);
router.get('/ingredientCategory', getAllIngredientCategories);





module.exports = router;
