const jogoUtils = require('./jogo-utils');

module.exports = class Rodada {
    constructor(numeroDaMissao, quantidadeDeParticipantesParaEscolher, idDoLider) {
        this.numeroDaMissao = numeroDaMissao
        this.quantidadeDeParticipantesParaEscolher = quantidadeDeParticipantesParaEscolher;
        this.idDoLider = idDoLider;
        this.escolhidosParaProximaMissao = [];
    }

    get haParticipantesSuficientes() {
        return this.quantidadeDeParticipantesParaEscolher === this.escolhidosParaProximaMissao.length;
    }

    adiconarParticipante(idDoJogador) {
        this.escolhidosParaProximaMissao.push(idDoJogador);
    }

    removerParticipante(idDoJogador) {
        this.escolhidosParaProximaMissao = this.escolhidosParaProximaMissao.filter(escolhido => escolhido !== idDoJogador);
    }
}