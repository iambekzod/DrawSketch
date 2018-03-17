var router = require('express').Router();

router.use('/user/', require('./user'));
router.use('/game/', require('./game'));
router.use('/lobby/', require('./lobby'));

module.exports = router;