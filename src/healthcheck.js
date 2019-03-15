const { BRANCH, SHORT } = require('./config');

const getVersion = (req, res) => {
    const version = { version: `vB-${BRANCH}.2.${SHORT}` };
    res.status(200).send(version);
};

module.exports = getVersion;
