module.exports = class Sala {
    constructor(id, socket) {
        this.id = id;
        this.socket = socket;
        this.clients = [];
    }

    adicionarClient(client) {
        this.clients.push(client);
    }
} 