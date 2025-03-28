const express = require('express');
const router = express.Router();
const customProductController = require('../controllers/customProductsController'); // Import all controller functions

// Destructure the imported functions
const { 
  createCustomProduct, 
  updateCustomProduct, 
  deleteCustomProduct, 
  getAllCustomProducts, 
  getCustomProductById, 
  isAdmin,
  
} = customProductController;

// Routes for Custom Products
router.post('/customProduct', isAdmin, createCustomProduct);
router.put('/custom-products/:id', isAdmin, updateCustomProduct);
router.delete('/custom-products/:id', isAdmin, deleteCustomProduct);
router.get('/custom-products', getAllCustomProducts);
router.get('/custom-products/:id', getCustomProductById);




module.exports = router;
