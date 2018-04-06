var app = require('express')();
var fs = require('fs');
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

const minJog = 5;
const maxJog = 10;
const proporcaoEspiao = [2,2,3,3,3,4];
const tamEquipe = [ [2,3,2,3,3],
                    [2,3,4,3,4],
                    [2,3,3,4,4],
                    [3,4,4,5,5],
                    [3,4,4,5,5],
                    [3,4,4,5,5]];
var clients = {};
var qtEspioes = 2;

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
        client.emit("update", "Tâmo junto...");
        client.broadcast.emit("update", name + " quer encarar.")
    });

    client.on("send", function(msg){
    	console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function(){
    	console.log("Disconnect");
        io.emit("update", clients[client.id] + " arregou!");
        delete clients[client.id];
    });
});


http.listen(3000, function(){
  console.log('Sala criada: aguarde!');
});
