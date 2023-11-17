const express = require('express');
const router = express.Router();

const { createUser, userLogin, updateUser, deleteUser, importUsers, getAllUsers, getUserById, searchUsers } = require('../controllers/usersController');
const verifyToken = require('../config/authentication');
const userValidator = require('../validators/usersValidator');

router.post('', verifyToken, userValidator.validateCreateUser, createUser);
router.post('/login',  userValidator.validateLogin, userLogin);
router.post('/import', verifyToken, importUsers);

router.get('', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.get('/search/:field/:value', verifyToken, searchUsers);

router.put('/:id', verifyToken, userValidator.validateUpdateUser, updateUser);

router.delete('/:id', verifyToken, deleteUser);

module.exports = router;
