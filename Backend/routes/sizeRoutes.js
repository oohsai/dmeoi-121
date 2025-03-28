const express = require('express');
const router = express.Router();
const SizeController= require('../controllers/SizeController'); // Import all controller functions

// Destructure the imported functions
const { 
  
  isAdmin,
  createSize,
  updateSize,
  deleteSize,
  getAllSizes,
} = SizeController;


// Routes for Sizes
router.post('/sizes', isAdmin, createSize);
router.put('/sizes/:id', isAdmin, updateSize);
router.delete('/sizes/:id', isAdmin, deleteSize);
router.get('/sizes', getAllSizes);



module.exports = router;
