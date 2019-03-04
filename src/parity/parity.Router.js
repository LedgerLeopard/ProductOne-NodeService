const { Router } = require('express');

const { wrapList } = require('../utils/wrapper');
const controller = wrapList(require('./parity.Controller'));
const tokenChecker = require('../middleware/tokenChecker');

const router = new Router();

router.use(tokenChecker);

router.put('/versions', controller.updateVersion);

module.exports = router;
