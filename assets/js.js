//var socket = io.connect("http://10.100.80.204:3000");
var socket = io();

console.log('oi');
/* fetch({
	json
})
 */
$(document).on('click', function (event) {
	socket.emit('myClick', { id: event.target.id, jogador: localStorage.getItem("RTnick") });
});

$(document).ready(function () {
	var ready = false;

	// $("#submit").submit(function (e) {
	// 	e.preventDefault();
	// 	$(document).ready(function () {
	// 		url = "/mesa.html";
	// 		$(location).attr("href", url);
	// 	});
	// 	var name = $("#nickname").val();
	// 	var time = new Date();
	// 	$("#name").html(name);
	// 	$("#time").html('First login: ' + time.getHours() + ':' + time.getMinutes());

	// 	ready = true;
	// 	console.log(ready);
	localStorage.setItem("RTtoNaMissao", "nao");
	localStorage.setItem("RTescolher", 100);

	socket.emit("join", localStorage.getItem("RTnick"));

	//});

	$("#textarea").keypress(function (e) {
		if (e.which == 13) {
			var text = $("#textarea").val();
			$("#textarea").val('');
			var time = new Date();
			$(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
			socket.emit("send", text);
		}
	});

	socket.on("update", function (msg) {
		if (ready) {
			$('.chat').append('<li class="info">' + msg + '</li>')
		}
	});

	socket.on("chat", function (client, msg) {
		if (ready) {
			var time = new Date();
			$(".chat").append('<li class="other"><div class="msg"><span>' + client + ':</span><p>' + msg + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
		}
	});

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
		//}
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
});