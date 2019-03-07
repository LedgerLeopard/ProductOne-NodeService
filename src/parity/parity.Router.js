const { Router } = require('express');

const { wrapList } = require('../utils/wrapper');
const controller = wrapList(require('./parity.Controller'));
const tokenChecker = require('../middleware/tokenChecker');
const validator = require('../middleware/validator');
const schema = require('./parity.Schema');

const router = new Router();

router.use(tokenChecker);

router.post('/versions', validator(schema.updateVersion), controller.updateVersion);

module.exports = router;
