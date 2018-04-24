function Mesa() {
	return {
		get mensagem() {
			return $('#mesa #mensagem').html();
		},
		set mensagem(valor) {
			$('#mesa #mensagem').html(valor);
		},
		get acoes() {
			return $('#mesa #acoes').html();
		},
		set acoes(valor) {
			$('#mesa #acoes').html(valor);
		}
	};
}