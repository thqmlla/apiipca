import express from 'express';
import {
    listarIPCA,
    filtrarIPCAPorAno,
    localizarIPCAPorId,
    corrigirValorComIPCA,
    validarEntradas
} from './servicos/servico.js';

const app = express();

app.get('/historicoIPCA', (req, res) => {
    const { ano } = req.query;
    const dados = ano ? filtrarIPCAPorAno(ano) : listarIPCA();

    if (dados && dados.length > 0) {
        res.json(dados);
    } else {
        res.status(404).send({ erro: 'Nenhum dado encontrado para o ano informado.' });
    }
});

app.get('/historicoIPCA/calculo', (req, res) => {
    const { valor, mesInicial, anoInicial, mesFinal, anoFinal } = req.query;

    const valorConvertido = parseFloat(valor);
    const mesInicio = parseInt(mesInicial, 10);
    const anoInicio = parseInt(anoInicial, 10);
    const mesFim = parseInt(mesFinal, 10);
    const anoFim = parseInt(anoFinal, 10);

    if (anoInicio > anoFim || (anoInicio === anoFim && mesInicio > mesFim)) {
        return res.status(400).send({ erro: 'Período inválido: a data inicial é maior que a final.' });
    }

    if (!validarEntradas(valorConvertido, mesInicio, anoInicio, mesFim, anoFim)) {
        return res.status(400).send({ erro: 'Os parâmetros fornecidos são inválidos.' });
    }

    const resultado = corrigirValorComIPCA(valorConvertido, mesInicio, anoInicio, mesFim, anoFim);

    if (resultado !== null) {
        res.json({ valorCorrigido: resultado.toFixed(2) });
    } else {
        res.status(404).send({ erro: 'Não foi possível realizar o cálculo com os dados fornecidos.' });
    }
});

app.get('/historicoIPCA/:id', (req, res) => {
    const id = req.params.id;
    const dado = localizarIPCAPorId(id);

    if (dado) {
        res.json(dado);
    } else {
        res.status(404).send({ erro: 'Registro não encontrado com o ID especificado.' });
    }
});

app.use((err, req, res, next) => {
    console.error('Erro:', err.message);
    res.status(500).send({ erro: 'Ocorreu um erro no servidor.' });
});

app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080.');
});
