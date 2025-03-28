const express = require('express');
const { getAllUsers, getUserById, createUser, loginUser, logoutUser, updateUser, deleteUser, deactivateUser, restoreUser, updateUserStatus } = require('../controllers/userController');

const router = express.Router();

// User routes
router.get('/', getAllUsers); // Get all users
router.get('/:id', getUserById); // Get user by ID
router.post('/createUser', createUser); // Create new user
// router.delete('/deleteUser/:id', deleteUser); // Create new user
router.post('/updateUser', updateUser); // Create new user
router.post('/login', loginUser); // Login user
router.post('/logout', logoutUser); // Logout user
// router.post('/deactivateUser', deactivateUser);
router.put('/restoreUser/:id', restoreUser);
router.post('/updateUserStatus/:id', updateUserStatus);

module.exports = router;
