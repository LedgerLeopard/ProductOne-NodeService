const fs = require('fs');
const { UPDATE_PARITY_SCRIPT } = require('../config');
const logger = require('../utils/logger');

async function updateVersion(req, res) {
    const { newVersion } = req.body;
    const updateScriptFile = fs.readFileSync(UPDATE_PARITY_SCRIPT, 'utf-8');
    const updateScript = updateScriptFile.replace('__NEW_VERSION__', newVersion);

    logger.info('Update script content');
    logger.info(updateScript);

    debugger;
    /*
    Вызвать выполнение скрипта с подставленной в него новой версией parity
     */
}

module.exports = {
    updateVersion,
};
