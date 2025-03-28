const express = require('express');
const router = express.Router();
const IngredientController = require('../controllers/IngredientController'); // Import all controller functions

// Destructure the imported functions
const { 
  createIngredient,
  updateIngredient,
  getAllIngredients,
  deleteIngredient
} = IngredientController;



// Routes for Ingredients
router.post('/ingredients', isAdmin, createIngredient);
router.put('/ingredients/:id', isAdmin, updateIngredient);
router.delete('/ingredients/:id', isAdmin, deleteIngredient);
router.get('/ingredients', getAllIngredients);

module.exports = router;
