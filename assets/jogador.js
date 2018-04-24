function Jogador(id, nome, posicao, equipe) {
    let jogador = {
        id,
        posicao,
        equipe,
        get nome() {
            return this.elemento.find('#nome').text();
        },
        set nome(valor) {
            this.elemento.find('#nome').text(valor);
        },
        get elemento() {
            return $(`#jogador${this.posicao}`);
        },
        get ehLider() {
            return this.elemento.hasClass('lider');
        },
        set ehLider(valor) {
            if (valor === true) this.elemento.addClass('lider');
            if (valor === false) this.elemento.removeClass('lider');
        },
        get escolhidoParaMissao() {
            return this.elemento.hasClass('escolhido');
        },
        set escolhidoParaMissao(valor) {
            if(valor === true) this.elemento.addClass('escolhido');
            if(valor === false) this.elemento.removeClass('escolhido');
        }
    };

    jogador.nome = nome;
    return jogador;
}