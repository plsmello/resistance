const Sala = require('./sala');

module.exports = class GerenciadorDeSalas {
    constructor(socket) {
        this.socket = socket;
        this.salas = [];
    }
    
    criarSala(id) {
        this.salas.push(new Sala(id, this.socket));
    }

    fecharSala(id) {

    }
}