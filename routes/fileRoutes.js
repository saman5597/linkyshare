const fileController = require('../controllers/fileController');
const router = require('express').Router();

router.post('/', fileController.uploadFile);

router.post('/send', fileController.sendEmail);

module.exports = router;