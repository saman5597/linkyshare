const viewController = require('../controllers/viewController');

const router = require('express').Router();

router.get('/', viewController.renderHomePage);

module.exports = router;