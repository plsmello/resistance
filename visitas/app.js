// Servidor: app.js
 // Iniciando servidor HTTP
 var app = require('http').createServer(index)
   , io = require('socket.io').listen(app)
   , fs = require('fs')
 ;
 app.listen(3000, function() {
   console.log("Servidor rodando!");
 });
 function index(req, res){
   fs.readFile(__dirname + '/index.html', function(err, data){
 res.writeHead(200);
     res.end(data);
   });
 };
 // Iniciando Socket.IO
 var visitas = 0;
 // Evento connection ocorre quando entra um novo usu�rio.
 io.on('connection', function(socket){
   // Incrementa o total de visitas no site.
   visitas++;
   // Envia o total de visitas para o novo usu�rio.
   socket.emit('visits', visitas);
   // Envia o total de visitas para os demais usu�rios.
   socket.broadcast.emit('visits', visitas);
   // Evento disconnect ocorre quando sai um usu�rio.
   socket.on('disconnect', function(){
     visitas--;
     // Atualiza o total de visitas para os demais usu�rios.
     socket.broadcast.emit('visits', visitas);
   });
 });