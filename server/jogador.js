module.exports = class Jogador {
    constructor(id, nome, posicao) {
        this.id = id;
        this.nome = nome;
        this.posicao = posicao;
        this.equipe = '';
        this.ehLider = false;
    }

    get ehEspiao(){
        return this.equipe === 'espiao';
    }

    get ehResistencia(){
        return this.equipe === 'resistencia';
    }
}