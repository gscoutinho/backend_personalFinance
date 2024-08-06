const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbControllers.js');

router.get('/users', dbController.getUser);
router.post('/users', dbController.createUser)

router.get('/cat', dbController.getCategory)
router.post('/cat', dbController.createCategory)

// router.post('/pessoas', pessoasController.addPessoa);

module.exports = router;
