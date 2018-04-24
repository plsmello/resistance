const socket = io();
const mesa = Mesa();
const jogo = Jogo();
const notificacoes = {
	mensagens: {
		selecioneParticipantesMissao: (participantes) => {
			mesa.mensagem = `Escolha ${participantes} participantes para realizar a missão.`;
		},
		aguardeSelecaoDeParticipantes: (nomeDoLider) => {
			mesa.mensagem = `Aguarde <b>${nomeDoLider}</b> selecionar os participantes para a missão.`
		}
	},
	acoes: {
		iniciarJogo: () => mesa.acoes = '<button type="button" id="iniciarJogo" >Iniciar</button>',
		confirmarSelecao: () => mesa.acoes = '<button type="button" id="confirmarSelecao">Confirmar Selecao/button>'
	}
}

$(document).ready(function () {
	var ready = false;

	entrarNaSala();
	socket.on('jogadorEntrou', atualizarListaDeJogadoresEmEspera);

	socket.on('jogoAlcancouOMinimoDeJogadores', () => {
		notificacoes.acoes.iniciarJogo();
		quandoClicarEmIniciar(() => socket.emit('iniciouJogo'));
	});

	socket.on('iniciouJogo', jogadores => {
		const souCriadorDaSala = jogadores[0].id === socket.id;

		mesa.mensagem = '';
		mesa.acoes = '';
		jogo.jogadores = jogadores.map(jogador => Jogador(jogador.id, jogador.nome, jogador.posicao, jogador.equipe));
		if (souCriadorDaSala) socket.emit('iniciouNovaRodada');
	});

	socket.on('iniciouNovaRodada', ({ numeroDaMissao, quantidadeDeParticipantesParaEscolher, idDoLider }) => {
		const souOLider = idDoLider === socket.id;
		const novoLider = jogo.pegarJogadorPorId(idDoLider);

		novoLider.ehLider = true;
		jogo.iniciarNovaRodada(numeroDaMissao, quantidadeDeParticipantesParaEscolher, idDoLider);
		if (souOLider) {
			notificacoes.mensagens.selecioneParticipantesMissao(quantidadeDeParticipantesParaEscolher);
			quandoClicarEmAlgumJogador(jogador => {
				if (!jogo.rodadaAtual.haParticipantesSuficientes) {
					(jogador.escolhidoParaMissao)
						? removerParticipanteParaMissao(jogador.id)
						: escolherParticipanteParaMissao(jogador.id)
				}
				else if (jogador.escolhidoParaMissao)
					removerParticipanteParaMissao(jogador.id);
			});
		}
		else
			notificacoes.mensagens.aguardeSelecaoDeParticipantes(novoLider.nome);
	});

	socket.on('liderEscolheuParticipante', idDoJogador => {
		jogo.pegarJogadorPorId(idDoJogador).escolhidoParaMissao = true;
	});

	socket.on('liderRemoveuParticipante', idDoJogador => {
		jogo.pegarJogadorPorId(idDoJogador).escolhidoParaMissao = false;
	});

	socket.on('escolheuParticipantesSuficientes', escolheu => {
		jogo.rodadaAtual.haParticipantesSuficientes = escolheu;
	});

	return;
	//#region 

	function inicia() {
		socket.emit("inicia");
	};


	socket.on("mesa", function (clients, utilizar) {
		console.log('cara');
		console.log(clients);
		//if (ready) {

		console.log('aqui');
		$("div").removeClass("espiao");
		var data_length = clients.length;
		if ((data_length >= 5) && clients[0] == localStorage.getItem("RTnick")) {
			$('#mesa').html('<button type="button" id="btIniciar" >Iniciar</button>');
		}
		$("div").filter(function () {
			return ($(this).attr("id") ? $(this).attr("id").startsWith("p") : false);
		}).html("&nbsp;");
		for (var i = 0; i < data_length; i++) {
			//alert(clients[i-1]);
			console.log("setando o i " + i + " de " + clients.length);
			$('#p' + utilizar[clients.length - 1][i]).html(clients[i]);
		}
		//
	});

	socket.on("espioes", function (espioes, fim) {
		var souEspiao = false;
		//for (x)
		//if (clients[0] == localStorage.getItem("RTnick")))
		for (let i = 0; i < espioes.length; i++) {
			if ($('#p' + espioes[i]).html() == localStorage.getItem("RTnick") || fim)
				souEspiao = true;
		}
		if (souEspiao) {
			for (let i = 0; i < espioes.length; i++) {
				$('#p' + espioes[i]).addClass("espiao");
			}
		}
	});

	socket.on("comecou", function (clients, tamEquipe, missao) {
		localStorage.setItem("RTescolher", tamEquipe[clients.length - 1][missao - 1]);
		console.log('falta escolher' + localStorage.getItem("RTescolher"));
		$('#mesa').html(localStorage.getItem("RTnick") +
			`, escolha ${localStorage.getItem("RTescolher")} participantes para a missão`);
	});

	socket.on("selecionaMissao", function (quem) {
		if ($("#" + quem).hasClass("escolhido")) {
			$("#" + quem).removeClass("escolhido");
			localStorage.setItem("RTescolher", localStorage.getItem("RTescolher") + 1);
			if ($("#" + quem).html() == localStorage.getItem("RTnick")) {
				localStorage.setItem("RTtoNaMissao", "nao");
			}
		}
		else if (localStorage.getItem("RTescolher") > 0 || localStorage.getItem("RTescolher") == null) {
			$("#" + quem).addClass("escolhido");
			localStorage.setItem("RTescolher", localStorage.getItem("RTescolher") - 1);
			if ($("#" + quem).html() == localStorage.getItem("RTnick")) {
				localStorage.setItem("RTtoNaMissao", "sim");
			}
		}
		if (localStorage.getItem("RTescolher") == 0) {
			socket.emit("votar");
		}

	});

	socket.on("votar", function () {
		$('#mesa').html("Concorda com a equipe escolhida?<br/>" +
			'<button type="button" id="btVotarSim">Sim</button>' +
			'<button type="button" id="btVotarNao">Não</button>');
	});

	socket.on("jaVotou", function () {
		$('#mesa').html("Aguarde todos votarem...");
	});

	socket.on("jaLutou", function () {
		$('#mesa').html("Aguarde todos lutarem...");
	});

	socket.on("resultadoVotacao", function (votosNao, votosSim, clients, lider) {
		var res = (votosSim > votosNao ? "APROVADO" : "REPROVADO");
		var msg = `Votos SIM: ${votosSim}<br/>Votos NÃO: ${votosNao}<br/>${res}`;
		if (res == "APROVADO") {
			if (localStorage.getItem("RTtoNaMissao") == "sim") {
				msg += `<br/>Como vc reagiu na missão?<br/>
				<button type="button" id="btMissaoSucesso">Sucesso</button><br/>
				<button type="button" id="btMissaoFracasso">Fracasso</button>`;
			} else {
				msg += `<br/>Aguarde o resultado da missão...`;
			}
		} else {
			//reprovado
			//socket.emit("myClick", { id: "missaoRecusada" });
			if (clients[lider] == localStorage.getItem("RTnick")) {
				msg += `<br/>Inicie nova rodada<br/>
							<button type="button" id="btMissaoRecusada">Nova missão</button>`;
			}
		}
		$('#mesa').html(msg);
	});

	socket.on("resultadoMissao", function (fracasso, sucesso, resultadosMissoes, clients, lider) {
		var res = (fracasso > 0 ? "FALHOU" : "TEVE SUCESSO");
		var msg = `A missão teve:<br/>
					${sucesso} sucesso(s) e <br/>
					${fracasso} fracasso(s).<br/>
					Ela ${res}!<br/>
					PLACAR: ${resultadosMissoes}`;
		var qt = 0;
		var res = 0;
		res = resultadosMissoes.indexOf("F");
		while (res != -1) {
			if (res >= 0) {
				qt++;
			}
			res = resultadosMissoes.indexOf("F", res + 1);
		}


		if (qt > 2 || resultadosMissoes.length == 5) {
			msg += `<br/>Os ${(qt > 2 ? "ESPIÕES" : "ALIADOS")} venceram!!!`;
			socket.emit("desvendaEspioes");
		} else if (clients[lider] == localStorage.getItem("RTnick")) {
			msg += `<br/>Inicie nova rodada<br/>
						<button type="button" id="btNovaRodada">Nova missão</button>`;
		}
		$('#mesa').html(msg);
	});

	socket.on("limpaMissao", function (lider) {
		localStorage.setItem("RTtoNaMissao", "nao");
		localStorage.setItem("RTescolher", 100);
		$("div").removeClass("escolhido");
		$("div").removeClass("lider");
		$('#p' + lider).addClass("lider");
	});

	// socket.on("disconnect", function () {
	// 	socket.emit("disconnect", clients.indexOf(localStorage.content));
	// });

	//#endregion
});

function entrarNaSala() {
	socket.emit('entrou', localStorage.getItem('RTnick'), 'primeira');
}

function atualizarListaDeJogadoresEmEspera(jogadores) {
	mesa.mensagem = jogadores.map(jogador => `<span>${jogador}</span>`).join('</br>');
}

function quandoClicarEmIniciar(listener) {
	$('#iniciarJogo').one('click', listener);
}

function quandoClicarEmAlgumJogador(listener) {
	jogo.jogadores.forEach(jogador => jogador.elemento.on('click', () => listener(jogador)));
}

function escolherParticipanteParaMissao(idDoJogador) {
	jogo.pegarJogadorPorId(idDoJogador).escolhidoParaMissao = true;
	socket.emit('liderEscolheuParticipante', idDoJogador);
}

function removerParticipanteParaMissao(idDoJogador) {
	jogo.pegarJogadorPorId(idDoJogador).escolhidoParaMissao = false;
	socket.emit('liderRemoveuParticipante', idDoJogador);
}

function mostrarEspioes() {

}
