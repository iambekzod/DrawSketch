var router = require('express').Router();

router.use('/user/', require('./user'));
router.use('/game/', require('./game'));

module.exports = router;