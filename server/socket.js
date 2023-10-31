const  { Server } = require("socket.io");

const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*'
        }
    });

    io.on('connect', (socket) => {
        console.log('CONNECTION!');
    
        // задача, кожні 5 секунд відправляти push-повідомлення на клієнт
        setInterval(() => {
            io.emit('NEW_NOTIFICATION', {notification: 'Something new happened'});
        }, 1000000);
    
        socket.on('disconnect', (reason) => {
            console.log(reason);
        });
    });

    return io;
}

module.exports = initSocket;