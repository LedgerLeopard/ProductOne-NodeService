const fs = require('fs');
const shellExec = require('shell-exec');
const logger = require('../utils/logger');

const INTERVAL_DELAY = 10 * 1000;
const UPDATE_MAX_ATTEMPTS = 30; // 30 * 10 second = 5 minute
const SERVICE_SH_PATH = '/parity/service.sh';
const SERVICE_SH_BACKUP_PATH = `${SERVICE_SH_PATH}.backup`;

const CONFIG_DIR =          '/parity/config';
const DB_DIR =              '/parity/db';

const BACKUP_DIR =          '/parity/backup';
const CONFIG_DIR_BACKUP =   '/parity/backup/config';
const DB_DIR_BACKUP =       '/parity/backup/db';

async function getContainerStatus(containerName) {
    const containerInfoRaw = await shellExec(`sudo docker container inspect ${containerName}`);
    const containerInfo = JSON.parse(containerInfoRaw.stdout);
    return containerInfo[0].State.Status;
}

function parseContainerName(script) {
    let [containerName] = script.match(/--name parity-.{5}/);
    containerName = containerName.replace('--name ', '');
    logger.info('Container name ' + containerName);
    return containerName;
}

async function restartParity() {
    logger.info('Restart parity service');
    await shellExec('sudo systemctl restart parity');
}

async function updateVersion(req, res) {
    req.setTimeout(UPDATE_MAX_ATTEMPTS * INTERVAL_DELAY * 2);

    const {
        newVersion,
    } = req.body;

    const script = fs.readFileSync(SERVICE_SH_PATH, 'utf-8');
    let containerName = parseContainerName(script);

    logger.info('Backup data');
    fs.copyFileSync(SERVICE_SH_PATH, SERVICE_SH_BACKUP_PATH);
    fs.mkdir(BACKUP_DIR);
    fs.copyFileSync(CONFIG_DIR, CONFIG_DIR_BACKUP);
    fs.copyFileSync(DB_DIR, DB_DIR_BACKUP);

    logger.info('Update version at service file');
    const newVersionScript = script.replace(/parity\/parity:[^\s]+/, `parity/parity:${newVersion} `);
    fs.writeFileSync(SERVICE_SH_PATH, newVersionScript);

    logger.info('Pull parity version');
    await shellExec(`sudo docker image pull parity/parity:${newVersion}`);

    await restartParity();

    let updateAttempt = 0;
    const updateInterval = setInterval(async () => {
        updateAttempt++;
        try {
            const containerStatus = await getContainerStatus(containerName);
            if (containerStatus === 'running') {
                logger.info('Container is running');
                clearInterval(updateInterval);
                logger.info('Remove backups');
                fs.unlinkSync(SERVICE_SH_BACKUP_PATH);
                fs.unlinkSync(BACKUP_DIR);
                res.send(200);
            }
        } catch (e) {
            logger.info('Error on updating');
            logger.info(e);
        }
        if (updateAttempt > UPDATE_MAX_ATTEMPTS) {
            clearInterval(updateInterval);
            logger.info(`Can't update parity version to ${newVersion}. Try to rollback to previous version`);

            logger.info('Restore files from backup');
            fs.copyFileSync(SERVICE_SH_BACKUP_PATH, SERVICE_SH_PATH);
            fs.copyFileSync(CONFIG_DIR_BACKUP, CONFIG_DIR);
            fs.copyFileSync(DB_DIR_BACKUP, DB_DIR);
            logger.info('Remove backups');
            fs.unlinkSync(SERVICE_SH_BACKUP_PATH);
            fs.unlinkSync(BACKUP_DIR);

            await restartParity();

            let rollbackAttempt = 0;
            const rollbackInterval = setInterval(async () => {
                rollbackAttempt++;
                try {
                    const containerStatus = await getContainerStatus(containerName);
                    if (containerStatus === 'running') {
                        clearInterval(rollbackInterval);
                        res.send(409);
                    }
                } catch (e) {
                    logger.info(e);
                }
                if (rollbackAttempt > UPDATE_MAX_ATTEMPTS) {
                    clearInterval(rollbackInterval);
                    logger.info(`Can't rollback to previous version`);
                    res.send(500);
                }
            }, INTERVAL_DELAY);
        }
    }, INTERVAL_DELAY);

    res.send(200);
}

module.exports = {
    updateVersion,
};
