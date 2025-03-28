const express = require('express');
const { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  isAdmin 
} = require('../controllers/productController');
const { authenticateToken } = require('../controllers/userController');
const { getCategories } = require('../controllers/productController');
const router = express.Router();


router.get('/categories', getCategories);
// Route to get all products
router.get('/', getAllProducts);  // Get all products

// Route to get a single product by ID (optional, based on your needs)
router.get('/:id', getProductById); // Get product by ID

// Admin-only route to create a new product
router.post('/create', authenticateToken, isAdmin, createProduct);

// Admin-only route to update an existing product
router.put('/update/:id', authenticateToken, isAdmin, updateProduct);

// Admin-only route to delete a product
router.delete('/delete/:id', authenticateToken, isAdmin, deleteProduct);

module.exports = router;
