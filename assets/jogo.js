function Jogo() {
	return {
		jogadores: [],
		rodadas: [],
		get quantidadeDeJogadores() {
			return this.jogadores.length;
		},
		get lider() {
			return this.pegarJogadorPorId(this.rodadaAtual.idDoLider);
		},
		get rodadaAtual() {
			return this.rodadas[this.rodadas.length - 1];
		},
		get missaoAtual() {
			return this.rodadaAtual.missao;
		},
		iniciarNovaRodada(numeroDaMissao, quantidadeDeParticipantesParaEscolher, idDoLider) {
			this.rodadas.push(Rodada(numeroDaMissao, quantidadeDeParticipantesParaEscolher, idDoLider));
		},
		pegarJogadorPorId(id) {
			return this.jogadores.find(jogador => jogador.id === id);
		}
	}
}
