const { BLOCKCHAIN_PORT } = require('../config');
const Web3 = require('web3');
const web3 = new Web3(`ws://localhost:${BLOCKCHAIN_PORT}`);
const web3http = new Web3(`http://localhost:${BLOCKCHAIN_PORT}`);
const logger = require('../utils/logger');

const emitTransactions = (socket) => {
    web3.eth.subscribe('pendingTransactions' ,
        (error, result) => {
        if (!error)
            logger.info(`Got transaction with hash ${result}`);
    })
        .on('data', async (txHash) => {
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
            };
            socket.emit('transaction', transaction);
            logger.info(`Trx ${txHash} was sent`);
        });
};

const emitBlocks = (socket) => {
    web3.eth.subscribe('newBlockHeaders' ,
        (error, result) => {
            if (!error) {
                logger.info(`Got block with hash ${result.hash}`);
                logger.info(result);}
        }).on('data', async (block) => {
            if (!block.hash) return;
            const trxCount = await web3http.eth.getBlockTransactionCount(block.hash);
            const blockToEmit = {
                number: block.number,
                miner: block.miner,
                timeDate: new Date(block.timestamp),
                trxCount,
            };
            socket.emit('block', blockToEmit);
            logger.info(`Block with number ${block.number} was sent\n${JSON.stringify(blockToEmit)}`);
        });
};

module.exports = { emitTransactions, emitBlocks };