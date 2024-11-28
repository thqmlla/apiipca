import historicoInflacao from '../dados/dados.js';

export const listarIPCA = () => {
    return historicoInflacao;
};

export const filtrarIPCAPorAno = (ano) => {
    return historicoInflacao.filter(item => item.ano == ano);
};

export const localizarIPCAPorId = (id) => {
    const idNumerico = parseInt(id, 10);
    return historicoInflacao.find(item => item.id === idNumerico);
};

export const corrigirValorComIPCA = (valor, mesInicio, anoInicio, mesFim, anoFim) => {
    const periodo = historicoInflacao.filter(dado => {
        return (
            (dado.ano > anoInicio || (dado.ano === anoInicio && dado.mes >= mesInicio)) &&
            (dado.ano < anoFim || (dado.ano === anoFim && dado.mes <= mesFim))
        );
    });

    if (periodo.length === 0) return null;

    return periodo.reduce((acumulado, dado) => acumulado * (1 + dado.ipca / 100), valor);
};

export const validarEntradas = (valor, mesInicio, anoInicio, mesFim, anoFim) => {
    if (isNaN(valor) || isNaN(mesInicio) || isNaN(anoInicio) || isNaN(mesFim) || isNaN(anoFim)) {
        return false;
    }

    if (anoInicio < 2015 || anoFim > 2024 || anoInicio > anoFim) {
        return false;
    }

    if (mesInicio < 1 || mesInicio > 12 || mesFim < 1 || mesFim > 12) {
        return false;
    }

    if (anoInicio === 2024 && mesInicio > 6 || anoFim === 2024 && mesFim > 6) {
        return false;
    }

    return true;
};
