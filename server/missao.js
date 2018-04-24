module.exports = class Missao {
    constructor(participantes) {
        this.participantes = participantes;
        this.sabotagens = 0;
        this.conclusoes = 0;
        this.executada = false;
    }

    sabotar() {
        this.sabotagens++;
    }

    concluir() {
        this.conclusoes++;
    }

    foiSabotada() {
        return this.sabotagens > 0;
    }

    foiConcluida() {
        return this.conclusoes === this.participantes.length;
    }
}