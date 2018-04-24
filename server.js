const server = require('http').createServer();
const io = require('socket.io')(server);


io.on('connection', (client) => {
    client.on('sala', console.log);
});


server.listen(8090);