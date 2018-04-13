var app = require('express')();
var fs = require('fs');
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};

app.use(express.static(__dirname + '\assets'));
app.use(express.static(__dirname + '\node_modules'));

app.get('*', function index(req, res){
	console.log(req.url);
   fs.readFile(__dirname + req.url, function(err, data){
 	res.writeHead(200);
     res.end(data);
   });
 });



io.on("connection", function (client) {
    client.on("join", function(name){
    	console.log("Joined: " + name);
        clients[client.id] = name;
        client.emit("update", "You have connected to the server.");
        client.broadcast.emit("update", name + " has joined the server.")
    });

    client.on("send", function(msg){
    	console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function(){
    	console.log("Disconnect");
        io.emit("update", clients[client.id] + " has left the server.");
        delete clients[client.id];
    });
});


http.listen(3000, function(){
  console.log('listening on port 3000');
});
