const {
    BLOCKCHAIN_PORT,
    JWT_SECRET_KEY,
    NODE_SERVICE_TOKEN,
    BLOCKCHAIN_WS_PORT
} = require('../config');
const Web3 = require('web3');
const web3blocks = new Web3(`ws://localhost:${BLOCKCHAIN_WS_PORT}`);
const web3txs = new Web3(`ws://localhost:${BLOCKCHAIN_WS_PORT}`);
const web3http = new Web3(`http://127.0.0.1:${BLOCKCHAIN_PORT}`);
const logger = require('../utils/logger');
const fs = require('fs');
const configFile = fs.readFileSync('/init', 'utf8');
const yaml = require('js-yaml');
const networkName = yaml.safeLoad(configFile)["Network name"];
const vmName = yaml.safeLoad(configFile)["VM name"];
const token = require('../utils/jwt')(NODE_SERVICE_TOKEN, JWT_SECRET_KEY);

const emitTransactions = (socket) => {

    web3txs.eth.subscribe('pendingTransactions',
        (error, result) => {
            if (!error) {
                logger.info(`Got transaction with hash ${result}`);
            }
            else {
                logger.error(error);
                web3txs.eth.clearSubscriptions();
            }
        })
        .on('data', async (txHash) => {
            logger.info(`Try to send trx ${txHash}`);
            const trx = await web3http.eth.getTransaction(txHash);
            if (!trx.blockNumber) return;
            let type = 'Migration';
            if (!trx.to) type = 'Deploying contract';
            const transaction = {
                txHash,
                minerAccount: trx.miner,
                timeDate: new Date(),
                from: trx.from,
                to: trx.to,
                data: trx.input,
                blockNumber: trx.blockNumber,
                index: trx.transactionIndex,
                type,
                networkName,
                vmName,
                token
            };
            socket.emit('transaction', transaction);
            logger.info(`Trx ${txHash} was sent`);
        });

};

const emitBlocks = (socket) => {

    web3blocks.eth.subscribe('newBlockHeaders',
        (error, result) => {
            if (!error) {

                logger.info(`Got block with hash ${result.hash}`);
            } else {
                logger.error(error);
                web3blocks.eth.clearSubscriptions();
            }
        }).on('data', async (block) => {
        logger.info(`Try to send block ${block.number}`);
        if (!block.hash) return;
        const trxCount = await web3http.eth.getBlockTransactionCount(block.hash);
        const blockToEmit = {
            number: block.number,
            miner: block.miner,
            timeDate: new Date(),
            trxCount,
            networkName,
            vmName,
            token
        };
        socket.emit('block', blockToEmit);
        logger.info(`Block with number ${block.number} was sent\n${JSON.stringify(blockToEmit)}`);
    });

};

module.exports = {emitTransactions, emitBlocks};