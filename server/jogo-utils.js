function pegarPosicaoDoJogador(ordemDeEntrada, quantidadeDeJogadores) {
	const posicoes = new Map([
		[5, [1, 3, 5, 7, 9]],
		[6, [1, 3, 5, 6, 8, 10]],
		[7, [1, 3, 4, 5, 6, 8, 10]],
		[8, [1, 2, 3, 5, 6, 7, 8, 10]],
		[9, [1, 2, 3, 4, 5, 6, 7, 8, 10]],
		[10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
	]);

	return posicoes.get(quantidadeDeJogadores)[ordemDeEntrada];
}

function pegarProporcaoDeEspioes(quantidadeDeJogadores) {
    const quantidadeDeEspioes = new Map([
        [5, 2],
        [6, 2],
        [7, 3],
        [8, 3],
        [9, 3],
        [10, 4]
    ]);

    return quantidadeDeEspioes.get(quantidadeDeJogadores);
}

function pegarQuantidadeNecessariaDeParticipantesParaMisssao(numeroDaMissao, quantidadeDeJogadores) {
    const quantidadeDeParticipantes = new Map([
        [5, [2, 3, 2, 3, 3]],
        [6, [2, 3, 4, 3, 4]],
        [7, [2, 3, 3, 4, 4]],
        [8, [3, 4, 4, 5, 5]],
        [9, [3, 4, 4, 5, 5]],
        [10, [3, 4, 4, 5, 5]]
    ]);

    return quantidadeDeParticipantes.get(quantidadeDeJogadores)[numeroDaMissao - 1];
}

function escolherNumeroEntre(inicio, fim) {
    inicio = Math.ceil(inicio);
    fim = Math.floor(fim);
    return Math.floor(Math.random() * (fim - inicio + 1)) + inicio;
}

module.exports = {
    pegarPosicaoDoJogador,
    pegarProporcaoDeEspioes,
    pegarQuantidadeNecessariaDeParticipantesParaMisssao,
    escolherNumeroEntre
}