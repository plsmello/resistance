const app = require('express')();
const fs = require('fs');
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const minJog = 5;
const maxJog = 10;
const proporcaoEspiao = [2, 2, 3, 3, 3, 4];
const tamEquipe = [
    [], [], [], [],
    [2, 3, 2, 3, 3],
    [2, 3, 4, 3, 4],
    [2, 3, 3, 4, 4],
    [3, 4, 4, 5, 5],
    [3, 4, 4, 5, 5],
    [3, 4, 4, 5, 5]
];
const utilizar = [
    [1],
    [1, 3],
    [1, 3, 5],
    [1, 3, 5, 7],
    [1, 3, 5, 7, 9],
    [1, 3, 5, 6, 8, 10],
    [1, 3, 4, 5, 6, 8, 10],
    [1, 2, 3, 5, 6, 7, 8, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
];

var resultadosMissoes = "";
var votando = false;
var clients = [];
var espioes = [];
var lider = 0;
var qtEspioes = 0;
var missao = 0;
var votosSim = 1;
var votosNao = 0;
var sucesso = 0;
var fracasso = 0;

app.use(express.static(path.resolve(__dirname, './')));
app.use('/assets', express.static(path.resolve(__dirname, './assets')));
app.use('/node_modules', express.static(path.resolve(__dirname, './node_modules')));

app.post('/registrarJogador', (req, res) => {
    console.log(req.body.name);
})


io.on("connection", function (client) {
    client.on("join", function (name) {
        if (clients.length == 10 || qtEspioes > 0) {
            console.log("jogo lotado/iniciado!");
        }
        else {
            if (clients.indexOf(name) < 0) {
                console.log("Joined: " + name);
                clients[clients.length] = name;
            }
            client.emit("mesa", clients, utilizar);
            client.broadcast.emit("mesa", clients, utilizar);
        }
    });

    // client.on("send", function(msg){
    // 	console.log("Message: " + msg);
    //     client.broadcast.emit("chat", clients[client.id], msg);
    // });

    client.on("myClick", function (data) {
        console.log("veio " + data.id);
        if (data.id in { btIniciar: "", btNovaRodada: "", btMissaoRecusada: "" }) {
            if (data.id == "btIniciar") {
                qtEspioes = proporcaoEspiao[clients.length - minJog];
                var espTemp = 0;
                var i = 1;
                var rnd;
                while (i <= qtEspioes) {
                    rnd = Math.floor((Math.random() * clients.length) + 1);
                    espTemp = utilizar[clients.length - 1][rnd - 1];
                    if (espioes.indexOf(espTemp) < 0) {
                        espioes[i - 1] = espTemp;
                        console.log('espiao ' + i + ' eh ' + espTemp);
                        i++;
                    }
                }
                io.emit("espioes", espioes);
            }
            if (data.id != "btMissaoRecusada") {
                ++missao;
            }
            votosNao = 0;
            votosSim = 1;
            sucesso = 0;
            fracasso = 0;
            votando = false;
            io.emit("limpaMissao", utilizar[clients.length - 1][lider]);
            client.emit("comecou", clients, tamEquipe, missao);
        } else if (data.id.startsWith("p")) {
            if (data.jogador != clients[lider] || votando)
                return;
            //
            io.emit("selecionaMissao", data.id);
        } else if (data.id.startsWith("btVotar")) {
            if (data.id == "btVotarSim") {
                votosSim++;
            } else votosNao++;
            client.emit("jaVotou");
            //
            console.log("votacao em " + votosSim + " contra " + votosNao);
            if (votosSim + votosNao == clients.length) {
                if (votosNao >= votosSim) {
                    lider++;
                }
                io.emit("resultadoVotacao", votosNao, votosSim, clients, lider);
            }
        } else if (data.id.startsWith("btMissao")) {
            if (data.id == "btMissaoSucesso") {
                sucesso++;
            } else fracasso++;
            client.emit("jaLutou");
            //
            if (sucesso + fracasso == tamEquipe[clients.length - 1][missao - 1]) {
                if (lider < clients.length - 1)
                    lider++;
                else lider = 0;
                //
                resultadosMissoes += (fracasso > 0 ? "F" : "S");
                console.log("PLACAR: " + resultadosMissoes);
                io.emit("resultadoMissao", fracasso, sucesso, resultadosMissoes, clients, lider);
            }
        }
    });

    client.on("votar", function () {
        votando = true;
        client.broadcast.emit("votar");
    });

    client.on("desvendaEspioes", function () {
        io.emit("espioes", espioes, true);
    });

    client.on("disconnect", function () {
        console.log("Disconnect");
        //io.emit("update", clients[client.id] + " arregou!");
        //clients.splice(0,10);//[clients.indexOf(cli)];
        io.emit("mesa", clients, utilizar);
    });
});


http.listen(3000, function () {
    console.log('Sala criada: aguarde!');
});
