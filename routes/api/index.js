var router = require('express').Router();

router.use('/user/', require('./user'));
router.use('/lobby/', require('./lobby'));

module.exports = router;