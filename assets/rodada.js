function Rodada(numeroDaMissao, quantidadeDeParticipantesParaEscolher, idDoLider) {
    return {
        missao: Missao(numeroDaMissao),
        idDoLider,
        quantidadeDeParticipantesParaEscolher,
        haParticipantesSuficientes: false
    }
}