const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbControllers.js');

router.get('/users', dbController.getUser);
router.post('/users', dbController.createUser)

router.get('/cat', dbController.getCategory)
router.post('/cat', dbController.createCategory)

router.get('/reg', dbController.getRegs)
router.post('/reg', dbController.createReg)
router.get('/reg/:id', dbController.getRegsAll)
module.exports = router;
