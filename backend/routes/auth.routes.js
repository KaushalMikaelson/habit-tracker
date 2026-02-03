const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login); //localhost:5000/auth/login

module.exports = router;

