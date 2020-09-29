const showlinkController = require('../controllers/showlinkController');

const router = require('express').Router();

router.get('/:uuid', showlinkController.renderDownloadPage);

module.exports = router;