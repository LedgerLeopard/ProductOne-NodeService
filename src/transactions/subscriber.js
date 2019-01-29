const {
    JWT_SECRET_KEY,
    NODE_SERVICE_TOKEN
} = require('../config');

const logger = require('../utils/logger');
const fs = require('fs');
const configFile = fs.readFileSync('/init', 'utf8');
const yaml = require('js-yaml');
const NETWORK_NAME = yaml.safeLoad(configFile)["Network name"];
const VMNAME = yaml.safeLoad(configFile)["VM name"];
const CURRENT_IP = yaml.safeLoad(configFile)["Host"];
const WS_PORT = yaml.safeLoad(configFile)["Parity WS port"];
const RPC_PORT = yaml.safeLoad(configFile)["Parity RPC port"];
const token = require('../utils/jwt')(NODE_SERVICE_TOKEN, JWT_SECRET_KEY);
const Web3 = require('web3');
const web3ws = new Web3(`ws://${CURRENT_IP}:${WS_PORT}`);
const web3http = new Web3(`http://${CURRENT_IP}:${RPC_PORT}`);

const emitTransactions = (socket) => {
    web3ws.eth.subscribe('pendingTransactions',
            (error, result) => {
                logger.info(error);
                logger.info(result);
                if (!error && error !== '') {
                    logger.info(`Got transaction with hash ${result}`);
                }
                else {
                    logger.error(error);
                    web3ws.eth.clearSubscriptions();
                }
            })
            .on('data', async (txHash) => {
                logger.info(`Try to send trx ${txHash}`);
                const trx = await web3http.eth.getTransaction(txHash);
                let type = 'Migration';
                if (!trx.to) type = 'Deploying contract';
                const transaction = {
                    txHash,
                    minerAccount: trx.miner,
                    timeDate: new Date(),
                    from: trx.from,
                    to: trx.to || 'Contract',
                    data: trx.input,
                    blockNumber: trx.blockNumber || 0,
                    index: trx.transactionIndex || 0,
                    type,
                    networkName: NETWORK_NAME,
                    vmName: VMNAME,
                    token
                };
                socket.emit('transaction', transaction);
                logger.info(`Trx ${txHash} was sent`);
            });
};

const emitBlocks = (socket) => {
    web3ws.eth.subscribe('newBlockHeaders',
            (error, result) => {
                if (!error && error !== '') {
                    logger.info(`Got block with hash ${result.hash}`);
                } else {
                    logger.error(error);
                    web3ws.eth.clearSubscriptions();
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
                networkName: NETWORK_NAME,
                vmName: VMNAME,
                token
            };
            socket.emit('block', blockToEmit);
            logger.info(`Block with number ${block.number} was sent\n${JSON.stringify(blockToEmit)}`);
        });
};

module.exports = {emitTransactions, emitBlocks};