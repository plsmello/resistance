const Rodada = require('./rodada');
const Missao = require('./missao');
const Jogador = require('./jogador');
const jogoUtils = require('./jogo-utils');

const MINIMO_DE_JOGADORES = 5;
const MAXIMO_DE_JOGADORES = 10;

module.exports = class Jogo {
    constructor() {
        this.jogadores = [];
        this.rodadas = [];
    }

    get estaProntoParaIniciar() {
        return this.quantidadeDeJogadores >= MINIMO_DE_JOGADORES;
    }

    get estaLotado() {
        return this.quantidadeDeJogadores >= MAXIMO_DE_JOGADORES;
    }

    get primeiroJogadorQueEntrou() {
        return this.jogadores[0];
    }

    get quantidadeDeJogadores() {
        return this.jogadores.length;
    }

    get quantidadeDeEspioes() {
        return this.jogadores.filter(jogador => jogador.equipe === 'espiao').length;
    }

    get lider() {
        return this.jogadores.find(jogador => jogador.ehLider);
    }

    get rodadaAtual() {
        return this.rodadas[this.rodadas.length - 1];
    }

    get numeroDaMissaoAtual() {
        const totalDeMissoesExecutadas = this.rodadas.filter(rodada => rodada.executada).length;

        return totalDeMissoesExecutadas + 1;
    }

    adicionarJogador(id, nome) {
        this.jogadores.push(new Jogador(id, nome));
    }

    sortearEquipes(proporcaoDeEspioes) {
        const espioes = new Set();

        while (espioes.length < proporcaoDeEspioes) {
            const indiceDoJogador = jogoUtils.escolherNumeroEntre(0, this.quantidadeDeJogadores() - 1);

            espioes.add(indiceDoJogador);
        }

        this.jogadores.forEach((jogador, index) => {
            const escolhidoParaSerEspiao = espioes.has(index);

            jogador.equipe = (escolhidoParaSerEspiao) ? 'espiao' : 'resistencia';
        })
    }

    sortearLider() {
        const lider = jogoUtils.escolherNumeroEntre(0, this.quantidadeDeJogadores - 1);

        this.jogadores[lider].ehLider = true;
        return this.jogadores[lider].id;
    }

    setarPosicoesDosJogadores() {
        this.jogadores.forEach((jogador, index) =>
            jogador.posicao = jogoUtils.pegarPosicaoDoJogador(index, this.quantidadeDeJogadores)
        );
    }

    iniciarNovaRodada(idDoLider) {
        let rodada = new Rodada(
            this.numeroDaMissaoAtual,
            jogoUtils.quantidadeNecessariaDeParticipantesParaMisssao(this.numeroDaMissaoAtual, this.quantidadeDeJogadores),
            idDoLider
        );

        this.rodadas.push(rodada);
        return rodada;
    }
}