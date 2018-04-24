const app = require('express')();
const fs = require('fs');
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require('body-parser');

const gerenciadorDeSalas = new (require('./server/gerenciador-de-salas'))(io);
const Sala = require('./server/sala');
const Jogo = require('./server/jogo');
const jogoUtils = require('./server/jogo-utils');

// #region
const minJog = 5;
const maxJog = 10;
const proporcaoEspiao = [2, 2, 3, 3, 3, 4];
const utilizar = [
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
//#endregion

app.use(express.static(path.resolve(__dirname, './')));
app.use('/static', express.static(path.resolve(__dirname, './assets')));
app.use('/static', express.static(path.resolve(__dirname, './node_modules')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/entrarNaSala', (req, res) => {
    let { nome, sala } = req.body;

    if (!nome || !sala) return res.status(500).json({ message: 'Paramêtros nome e sala são obrigatórios' });

});

gerenciadorDeSalas.criarSala('primeira');
io.on('connection', client => {

});

sala.quandoJogadorEntrar((idDoJogador, nome) => {
    if (!jogo.estaLotado) {
        jogo.adicionarJogador(idDoJogador, nome);
        sala.enviarParaTodos('jogadorEntrou', jogo.jogadores.map(jogador => jogador.nome));
    }
    if (jogo.estaProntoParaIniciar) sala.enviarParaJogador('jogoAlcancouOMinimoDeJogadores', true, jogo.primeiroJogadorQueEntrou.id);
});

sala.quandoJogadorIniciarPartida(() => {
    jogo.sortearEquipes(jogoUtils.pegarProporcaoDeEspioes(jogo.quantidadeDeJogadores));
    jogo.setarPosicoesDosJogadores();
    sala.enviarParaTodos('iniciouJogo', jogo.jogadores);
});

sala.quandoIniciarNovaRodada(() => {
    let { idDoLider, quantidadeDeParticipantesParaEscolher, numeroDaMissao } = jogo.iniciarNovaRodada(jogo.sortearLider());

    sala.enviarParaTodos('iniciouNovaRodada', { idDoLider, quantidadeDeParticipantesParaEscolher, numeroDaMissao });
});

sala.quandoLiderEscolherParticipante(idDoParticipante => {
    jogo.rodadaAtual.adiconarParticipante(idDoParticipante);
    sala.enviarParaTodosExceto('liderEscolheuParticipante', idDoParticipante, jogo.lider.id);
    if (jogo.rodadaAtual.haParticipantesSuficientes)
        sala.enviarParaJogador('escolheuParticipantesSuficientes', true, jogo.lider.id);
});

sala.quandoLiderRemoverParticipante(idDoParticipante => {
    jogo.rodadaAtual.removerParticipante(idDoParticipante);
    sala.enviarParaTodosExceto('liderRemoveuParticipante', idDoParticipante, jogo.lider.id);
    sala.enviarParaJogador('escolheuParticipantesSuficientes', false, jogo.lider.id);
});

http.listen(3000, function () {
    console.log('Sala criada: aguarde!');
});

return;


io.on('connection', function (client) {
    client.on('join', function (nome) {
        //#region 
        if (clients.length == 10 || qtEspioes > 0) {
            console.log("jogo lotado/iniciado!");
        }
        else {
            if (clients.indexOf(nome) < 0) {
                console.log("Joined: " + nome);
                clients[clients.length] = nome;
            }

            client.emit("mesa", clients, utilizar);
            client.broadcast.emit("mesa", clients, utilizar);
        }
        //#endregion
    });

    client.on('jogo.iniciar', () => {

    });

    return;

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

    client.on("disconnect", function (client) {
        console.log(`Desconectado: ${client.id}`);
        sala = new Jogo(io);


        return;
        console.log("Disconnect");
        //io.emit("update", clients[client.id] + " arregou!");
        //clients.splice(0,10);//[clients.indexOf(cli)];
        io.emit("mesa", clients, utilizar);
    });
});


