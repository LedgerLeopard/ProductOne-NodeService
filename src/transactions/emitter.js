const sendTransaction = function (socket) {
    socket.emit('transaction', transaction);
};